import { notFound, redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";
import Proposal from "@/mongo/model/proposalschema";
import UserData from "@/mongo/model/user";
import { toPlain } from "@/lib/serialize";
import JobDetails from "./JobDetails";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  // react-doctor-disable-next-line -- already wrapped in Promise.all; detector misses imported helpers
  const [userId] = await Promise.all([getUserId(), connectDB()]);
  if (!userId) redirect(`/sign-in?redirect=/jobs/${jobId}`);

  const [job, proposal] = await Promise.all([
    Job.findOne({ jobId }).lean(),
    Proposal.findOne({ jobId, freelancerId: userId }).lean(),
  ]);
  if (!job) notFound();

  // Job owner: load all proposals with freelancer details
  let initialProposals: unknown[] | null = null;
  if (job.clientId === userId) {
    const allProposals = await Proposal.find({ jobId }).lean();
    const freelancerIds = allProposals.map((pr) => pr.freelancerId);
    const freelancers = await UserData.find({ userId: { $in: freelancerIds } }).lean();
    const freelancersById = new Map(freelancers.map((f) => [f.userId, f]));
    initialProposals = allProposals.map((pr) => {
      const f = freelancersById.get(pr.freelancerId);
      return {
        ...pr,
        freelancerId: {
          freelancerId: f?.userId ?? null,
          name: f ? `${f.firstName} ${f.lastName ?? ""}`.trim() : 'Unknown Freelancer',
          image: f?.userImage ?? null,
          userId: f?.userId ?? null,
          rating: f?.ratings ?? null,
          skills: f?.skills ?? [],
        },
      };
    });
    initialProposals = toPlain(initialProposals);
  }

  return (
    <JobDetails
      job={toPlain(job)}
      currentUserId={userId}
      initialProposal={proposal ? toPlain(proposal) : null}
      initialProposals={initialProposals ?? undefined}
    />
  );
}
