import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/mongo/db";
import UserData from "@/mongo/model/user";

export default async function SelectRedirectPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  await connectDB();
  const user = await UserData.findOne({ userId });

  if (!user) return redirect("/onboarding");

  return redirect(`/dashboard/${user.role}`);
}