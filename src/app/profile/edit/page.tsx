import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";
import EditProfileForm from "./EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/profile/edit");

  await connectDB();

  // Mirrors GET /api/user/me
  const user = await UserData.findOne({ userId }).lean();
  if (!user) redirect("/onboarding");

  return (
    <EditProfileForm
      initialRole={user.role === 'client' ? 'client' : 'freelancer'}
      initialForm={{
        bio: user.bio || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        skills: user.skills?.join(", ") || "",
        portfolio: user.portfolio ?? [],
        experienceLevel: user.experienceLevel || "",
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
      }}
    />
  );
}
