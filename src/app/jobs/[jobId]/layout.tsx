import type { Metadata } from "next";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";

type Props = {
  children: React.ReactNode;
  params: Promise<{ jobId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params;

  try {
    await connectDB();
    const job = await Job.findOne({ jobId }).select("title description category budget").lean();
    if (!job) {
      return {
        title: "Job Not Found",
        description: "The requested job listing could not be found.",
      };
    }

    const trimmedDesc = job.description.length > 155 
      ? `${job.description.slice(0, 155)}...` 
      : job.description;

    return {
      title: `${job.title} ($${job.budget})`,
      description: trimmedDesc || `Apply to the ${job.title} job on FreelanceBase. Budget: $${job.budget}.`,
      openGraph: {
        title: `${job.title} - Apply on FreelanceBase`,
        description: trimmedDesc,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata for job:", error);
    return {
      title: "Job Details",
      description: "View job details and apply on FreelanceBase.",
    };
  }
}

export default function JobDetailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
