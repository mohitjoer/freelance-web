import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";
import Job from "@/mongo/model/jobschema";
import { toPlain } from "@/lib/serialize";
import ClientDashboard from "./ClientDashboard";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/dashboard/client");

  await connectDB();

  const user = await UserData.findOne({ userId, role: "client" }).lean();
  if (!user) redirect("/onboarding");

  const jobs = await Job.find({ clientId: userId }).sort({ createdAt: -1 }).lean();
  // Serialize Mongo documents into plain JSON-safe props
  const serializedJobs = toPlain(jobs);

  return (
    <ClientDashboard
      client={{
        userId: user.userId,
        name: `${user.firstName} ${user.lastName ?? ""}`.trim(),
        role: user.role,
        image: user.userImage,
        bio: user.bio,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        status: "active",
      }}
      jobs={serializedJobs}
    />
  );
}
