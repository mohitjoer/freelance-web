import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";
import Proposal from "@/mongo/model/proposalschema";
import Job from "@/mongo/model/jobschema";
import { toPlain } from "@/lib/serialize";
import FreelancerDashboard from "./FreelancerDashboard";

export const dynamic = "force-dynamic";

export default async function FreelancerDashboardPage() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/dashboard/freelancer");

  await connectDB();

  const user = await UserData.findOne({ userId, role: "freelancer" }).lean();
  if (!user) redirect("/onboarding");

  // Proposals with attached job data (mirrors GET /api/proposals/user)
  const proposals = await Proposal.find({ freelancerId: userId }).sort({ createdAt: -1 }).lean();
  const jobIds = proposals.map((p) => p.jobId);
  const jobs = await Job.find({ jobId: { $in: jobIds } }).lean();

  const jobsByJobId = new Map(jobs.map((j) => [j.jobId, j]));
  const proposalsWithJobs = proposals.map((proposal) => ({
    ...toPlain(proposal),
    job: toPlain(jobsByJobId.get(proposal.jobId) ?? null),
  }));

  return (
    <FreelancerDashboard
      freelancer={{
        userId: user.userId,
        name: `${user.firstName} ${user.lastName ?? ""}`.trim(),
        role: user.role,
        image: user.userImage,
        projects_done: user.projects_done,
        bio: user.bio,
        skills: user.skills ?? [],
        portfolio: toPlain(user.portfolio ?? []),
        experienceLevel: user.experienceLevel,
        jobsInProgress: user.jobsInProgress ?? [],
        jobsProposed: user.jobsProposed ?? [],
        jobsFinished: user.jobsFinished ?? [],
      }}
      proposals={proposalsWithJobs}
    />
  );
}
