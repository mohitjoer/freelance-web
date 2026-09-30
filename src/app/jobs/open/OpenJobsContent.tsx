'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Page, PageHeader, SidePanel } from '@/components/PageShell';
import { Select } from '@/components/ui/input';
import { formatBudget } from '@/lib/budget';
import type { OpenJob } from '@/lib/jobs';

export type { OpenJob };

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'video', label: 'Video' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data', label: 'Data & Analytics' },
];

const BUDGET_BANDS = [
  { value: '', label: 'Any budget' },
  { value: '0-100', label: 'Up to $100' },
  { value: '100-500', label: '$100 – $500' },
  { value: '500-2000', label: '$500 – $2,000' },
  { value: '2000-', label: '$2,000+' },
];

interface Filters {
  search: string;
  category: string;
  min: string;
  max: string;
  budgetType: string;
  sort: string;
}

interface OpenJobsContentProps {
  initialJobs: OpenJob[];
  meta: { total: number; page: number; pageCount: number };
  filters: Filters;
  message?: string | null;
}

function OpenJobsContent({ initialJobs, meta, filters, message }: OpenJobsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search box is uncontrolled-by-URL while typing; debounced into the URL.
  // Reset on query change is handled by the `key` on <OpenJobsContent> in the
  // wrapper below, not by an effect here.
  // react-doctor-disable-next-line -- deliberate: remount-on-key, not derived state
  const [draft, setDraft] = useState(filters.search);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const id = setTimeout(() => {
      if (draft !== filters.search) setParam({ search: draft, page: '1' });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  function setParam(patch: Partial<Filters> & { page?: string }) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === 'all') next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.push(qs ? `/jobs/open?${qs}` : '/jobs/open');
  }

  const clear = () => {
    setDraft('');
    router.push('/jobs/open');
  };

  const hasFilters = Boolean(
    filters.search ||
      filters.min ||
      filters.max ||
      filters.budgetType !== 'all' ||
      filters.category !== 'all'
  );

  // Rendered twice (rail on lg+, disclosure below lg), so every control needs a
  // per-instance id or the labels bind to the wrong element.
  const filterForm = (scope: string) => (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor={`${scope}-search`} className="mb-2 block text-sm font-medium text-ink">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={`${scope}-search`}
            type="search"
            placeholder="Title or keyword"
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${scope}-category`} className="mb-2 block text-sm font-medium text-ink">
          Category
        </label>
        <Select
          id={`${scope}-category`}
          value={filters.category}
          onChange={(e) => setParam({ category: e.target.value, page: '1' })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor={`${scope}-budget`} className="mb-2 block text-sm font-medium text-ink">
          Budget
        </label>
        <Select
          id={`${scope}-budget`}
          value={bandValue(filters.min, filters.max)}
          onChange={(e) => {
            const [lo = '', hi = ''] = e.target.value.split('-');
            setParam({ min: lo, max: hi, page: '1' });
          }}
        >
          {BUDGET_BANDS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor={`${scope}-budgetType`} className="mb-2 block text-sm font-medium text-ink">
          Rate type
        </label>
        <Select
          id={`${scope}-budgetType`}
          value={filters.budgetType}
          onChange={(e) => setParam({ budgetType: e.target.value, page: '1' })}
        >
          <option value="all">Fixed or hourly</option>
          <option value="fixed">Fixed price</option>
          <option value="hourly">Hourly rate</option>
        </Select>
      </div>

      <div>
        <label htmlFor={`${scope}-sort`} className="mb-2 block text-sm font-medium text-ink">
          Sort by
        </label>
        <Select
          id={`${scope}-sort`}
          value={filters.sort}
          onChange={(e) => setParam({ sort: e.target.value, page: '1' })}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="budget_high">Highest budget</option>
          <option value="budget_low">Lowest budget</option>
          <option value="deadline">Deadline soonest</option>
        </Select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-ink underline underline-offset-4 hover:text-primary"
        >
          Clear all filters
        </button>
      )}
    </form>
  );

  return (
    <Page
      aside={
        <SidePanel active="/jobs/open">
          <div className="border-t border-hairline pt-6">{filterForm("rail")}</div>
        </SidePanel>
      }
    >
      <PageHeader title="Open jobs" body="Every listing is a live brief with a stated budget." />

      {/* The rail is lg-only, so below lg the same filters live in a disclosure. */}
      <details className="mb-6 rounded-xl border border-hairline bg-card px-4 py-3 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium text-ink">
          Filter and sort
          {hasFilters && <span className="ml-2 text-muted-foreground">active</span>}
        </summary>
        <div className="mt-4">{filterForm("sheet")}</div>
      </details>

      {message && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{message}</p>
        </div>
      )}

      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium tabular-nums text-ink">{meta.total}</span> job
          {meta.total === 1 ? '' : 's'}
        </p>
        {meta.pageCount > 1 && (
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.pageCount}
          </p>
        )}
      </div>

      {initialJobs.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-card py-16 text-center">
          <h3 className="text-base font-medium text-ink">No jobs match those filters</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Try widening the budget range or clearing the category filter.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="mt-6 inline-flex items-center rounded-lg border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-hairline">
            {initialJobs.map((job) => (
              <li key={job._id} className="py-5 transition-colors hover:bg-surface-soft/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-ink">
                        <Link href={`/jobs/${job.jobId}`} className="hover:text-primary">
                          {job.title}
                        </Link>
                      </h3>
                      <span className="rounded-full bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {job.category}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {job.description}
                    </p>

                    <Link
                      href={`/profile/${job.client.clientId}`}
                      className="mt-2.5 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-ink"
                    >
                      <Image
                        src={job.client.image}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                      {job.client.name || 'Anonymous client'}
                    </Link>
                  </div>

                  <div className="flex shrink-0 items-center gap-6 sm:flex-col sm:items-end sm:gap-1.5 sm:text-right">
                    <p className="text-sm font-semibold tabular-nums text-ink">
                      {formatBudget(job)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(job.deadline))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.proposalCount} {job.proposalCount === 1 ? 'proposal' : 'proposals'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {meta.pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setParam({ page: String(meta.page - 1) })}
                disabled={meta.page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-card px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.pageCount}
              </span>

              <button
                type="button"
                onClick={() => setParam({ page: String(meta.page + 1) })}
                disabled={meta.page >= meta.pageCount}
                className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-card px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </Page>
  );
}

/** Maps the min/max URL pair back onto a budget band for the select. */
function bandValue(min: string, max: string): string {
  const band = BUDGET_BANDS.find((b) => {
    const [lo = '', hi = ''] = b.value.split('-');
    return (lo || '') === (min || '') && (hi || '') === (max || '');
  });
  return band?.value ?? '';
}

export default function OpenJobsPage(props: OpenJobsContentProps) {
  return (
    <Suspense fallback={null}>
      {/* Keyed on the URL search so the input resets when the query changes —
          e.g. arriving from a category tile with ?search= set. */}
      <OpenJobsContent key={props.filters.search} {...props} />
    </Suspense>
  );
}
