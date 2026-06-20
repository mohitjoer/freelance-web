import type { MetadataRoute } from "next";
import connectDB from "@/mongo/db";
import Job from "@/mongo/model/jobschema";
import UserData from "@/mongo/model/user";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://freelancebase.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-05-18"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/jobs/open`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  try {
    // Attempt DB connection
    await connectDB();

    // Query active jobs (only open ones make sense for search engines)
    const openJobs = await Job.find({ status: "open" }).select("jobId updatedAt").lean();
    const jobRoutes = openJobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.jobId}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Query freelancers (only public profiles)
    const freelancers = await UserData.find({ role: "freelancer" }).select("userId updatedAt").lean();
    const freelancerRoutes = freelancers.map((user: any) => ({
      url: `${baseUrl}/profile/${user.userId}`,
      lastModified: user.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...jobRoutes, ...freelancerRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap, returning static routes:", error);
    return staticRoutes;
  }
}
