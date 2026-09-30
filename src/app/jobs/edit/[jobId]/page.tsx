import { notFound, redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";
import JobForm from "@/app/jobs/JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  // Session check and DB connection are independent
  // react-doctor-disable-next-line -- already wrapped in Promise.all; detector misses imported helpers
  const [userId] = await Promise.all([getUserId(), connectDB()]);
  if (!userId) redirect(`/sign-in?redirect=/jobs/edit/${jobId}`);

  // Scoped to the owner — a client must not be able to edit someone else's job.
  const job = await Job.findOne({ jobId, clientId: userId }).lean();
  if (!job) notFound();

  return (
    <JobForm
      mode="edit"
      jobId={jobId}
      initial={{
        title: job.title,
        description: job.description,
        category: job.category,
        budget: String(job.budget),
        // Dropping these used to silently rewrite an hourly job as a fixed-price one.
        budgetType: job.budgetType === "hourly" ? "hourly" : "fixed",
        budgetMax: job.budgetMax ? String(job.budgetMax) : "",
        deadline: job.deadline?.toString() ?? "",
        references: job.references ?? [],
        resources: job.resources ?? [],
      }}
    />
  );
}
