import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";
import Job from "@/mongo/model/jobschema";
import OpenJobsPage, { type OpenJob } from "./OpenJobsContent";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/jobs/open");

  await connectDB();

  const user = await UserData.findOne({ userId });
  if (!user || user.role !== 'freelancer') {
    return (
      <OpenJobsPage
        initialJobs={[]}
        message={!user ? 'Unauthorized' : 'Access denied: freelancers only.'}
      />
    );
  }

  // Mirrors GET /api/jobs/open
  const openJobs = await Job.find({
    status: 'open',
    freelancerId: { $exists: false },
  }).sort({ createdAt: -1 }).lean();

  const jobsWithClientDetails: OpenJob[] = await Promise.all(
    openJobs.map(async (job) => {
      const client = await UserData.findOne({ userId: job.clientId }).select('firstName lastName userImage').lean();
      return {
        _id: String(job._id),
        jobId: job.jobId,
        title: job.title,
        description: job.description,
        category: job.category,
        budget: job.budget,
        deadline: job.deadline?.toString() ?? '',
        createdAt: job.createdAt?.toString() ?? '',
        client: {
          clientId: job.clientId,
          name: `${client?.firstName || ''} ${client?.lastName || ''}`.trim(),
          image: client?.userImage || '/default-avatar.png',
        },
      };
    })
  );

  return <OpenJobsPage initialJobs={jobsWithClientDetails} />;
}
