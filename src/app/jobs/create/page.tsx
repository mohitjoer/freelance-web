import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import JobForm from "@/app/jobs/JobForm";

export const dynamic = "force-dynamic";

export default async function CreateJobPage() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/jobs/create");

  return <JobForm mode="create" />;
}
