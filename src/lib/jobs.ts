import connectDB from '@/mongo/db';
import Job from '@/mongo/model/jobschema';
import UserData from '@/mongo/model/user';

export const PAGE_SIZE = 12;

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  budget_high: { budget: -1 },
  budget_low: { budget: 1 },
  deadline: { deadline: 1 },
} as const;

export type SortKey = keyof typeof SORTS;

export interface OpenJob {
  _id: string;
  jobId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  budgetMax: number | null;
  deadline: string;
  createdAt: string;
  proposalCount: number;
  client: { clientId: string; name: string; image: string };
}

export interface OpenJobQuery {
  search?: string | null;
  category?: string | null;
  min?: string | null;
  max?: string | null;
  budgetType?: string | null;
  sort?: string | null;
  page?: string | null;
}

export interface OpenJobResult {
  data: OpenJob[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/**
 * Single source of truth for browsing open jobs. Used by the /jobs/open server
 * component and mirrored by GET /api/jobs/open — do not duplicate the query.
 */
export async function queryOpenJobs(params: OpenJobQuery = {}): Promise<OpenJobResult> {
  await connectDB();

  const query: Record<string, unknown> = {
    status: 'open',
    freelancerId: { $exists: false },
  };

  const search = params.search?.trim();
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    query.$or = [{ title: rx }, { description: rx }, { category: rx }];
  }

  const category = params.category?.trim();
  if (category && category !== 'all') {
    // Substring, not exact: "design" should also match "Web Design".
    query.category = { $regex: escapeRegex(category), $options: 'i' };
  }

  const budgetType = params.budgetType;
  if (budgetType === 'fixed' || budgetType === 'hourly') {
    query.budgetType = budgetType;
  }

  // Compare against the top of the range so "$25-40/hr" matches a $40 filter.
  const min = toNum(params.min);
  const max = toNum(params.max);
  if (min !== null || max !== null) {
    const ceiling = {
      $cond: [
        { $gt: [{ $ifNull: ['$budgetMax', 0] }, '$budget'] },
        '$budgetMax',
        '$budget',
      ],
    };
    const clauses: Record<string, unknown>[] = [];
    if (min !== null) clauses.push({ $gte: [ceiling, min] });
    if (max !== null) clauses.push({ $lte: [ceiling, max] });
    // $expr with more than one operator must nest under $and.
    query.$expr = clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  const sort = SORTS[(params.sort as SortKey) ?? 'newest'] ?? SORTS.newest;
  const page = Math.max(1, toNum(params.page) ?? 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [jobs, total] = await Promise.all([
    Job.find(query).sort(sort).skip(skip).limit(PAGE_SIZE).lean(),
    Job.countDocuments(query),
  ]);

  // One query for all clients, not one per job.
  const clientIds = [...new Set(jobs.map((j) => j.clientId as string))];
  const clients = clientIds.length
    ? await UserData.find({ userId: { $in: clientIds } })
        .select('userId firstName lastName userImage')
        .lean()
    : [];
  const clientById = new Map(clients.map((c) => [c.userId as string, c]));

  const data: OpenJob[] = jobs.map((job) => {
    const client = clientById.get(job.clientId as string);
    return {
      _id: String(job._id),
      jobId: job.jobId,
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      budgetType: (job.budgetType as 'fixed' | 'hourly') ?? 'fixed',
      budgetMax: (job.budgetMax as number | undefined) ?? null,
      deadline: job.deadline ? new Date(job.deadline).toISOString() : '',
      createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : '',
      proposalCount: Array.isArray(job.proposals) ? job.proposals.length : 0,
      client: {
        clientId: job.clientId as string,
        name: `${client?.firstName || ''} ${client?.lastName || ''}`.trim(),
        image: client?.userImage || '/default-avatar.png',
      },
    };
  });

  return {
    data,
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

function toNum(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
