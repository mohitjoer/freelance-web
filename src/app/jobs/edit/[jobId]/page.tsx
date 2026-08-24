import { notFound, redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";
import EditJobForm, { type EditableJob } from "./EditJobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  // Session check and DB connection are independent
  // react-doctor-disable-next-line -- already wrapped in Promise.all; detector misses imported helpers
  const [userId] = await Promise.all([getUserId(), connectDB()]);
  if (!userId) redirect(`/sign-in?redirect=/jobs/edit/${jobId}`);

  // Mirrors GET /api/job/edit/[jobId]
  const job = await Job.findOne({ jobId }).lean();
  if (!job) notFound();

  const initialJob: EditableJob = {
    title: job.title,
    description: job.description,
    category: job.category,
    budget: job.budget,
    deadline: job.deadline?.toString() ?? '',
    references: job.references ?? [],
    resources: job.resources ?? [],
  };

  return <EditJobForm jobId={jobId} initialJob={initialJob} />;
}
