import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import { queryOpenJobs } from "@/lib/jobs";
import OpenJobsPage from "./OpenJobsContent";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in?redirect=/jobs/open");

  const params = await searchParams;

  const { data, total, page, pageCount } = await queryOpenJobs({
    search: one(params.search),
    category: one(params.category),
    min: one(params.min),
    max: one(params.max),
    budgetType: one(params.budgetType),
    sort: one(params.sort),
    page: one(params.page),
  });

  return (
    <OpenJobsPage
      initialJobs={data}
      meta={{ total, page, pageCount }}
      filters={{
        search: one(params.search) ?? "",
        category: one(params.category) ?? "all",
        min: one(params.min) ?? "",
        max: one(params.max) ?? "",
        budgetType: one(params.budgetType) ?? "all",
        sort: one(params.sort) ?? "newest",
      }}
    />
  );
}
