"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { EmptyState } from "@/components/dashboard/ui";
import { formatDay } from "@/lib/format";

// Module-scope so the formatter is built once, not per render
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

interface Job {
    _id: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: Date;
    clientId: string;
}

interface Proposal {
    _id: string;
    jobId: string;
    freelancerId: string;
    proposedAmount: number;
    status: 'completed';
    createdAt: string;
    updatedAt: string;
    rating?: number;
    feedback?: string;
    job: Job | null;
}

interface CompletedJobData {
    _id: string;
    jobId: string;
    freelancerId: string;
    startDate: string;
    completedDate: string;
    finalAmount: number;
    rating?: number;
    feedback?: string;
    status: 'completed';
    job: Job | null;
}

const formatDate = formatDay;

export default function CompletedJob() {
  const [completedJobs, setCompletedJobs] = useState<CompletedJobData[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const controller = new AbortController();

    const fetchCompletedJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP `);
        const data = await res.json();
        if (data.success) {
          // Filter to show only accepted proposals (completed jobs)
          const acceptedProposals = data.data.filter(
            (proposal: Proposal) => proposal.status === 'completed'
          );
          
          // Transform proposals to completed jobs format
          const transformedJobs = acceptedProposals.map((proposal: Proposal) => ({
            _id: proposal._id,
            jobId: proposal.jobId,
            freelancerId: proposal.freelancerId,
            startDate: proposal.createdAt, 
            completedDate: proposal.updatedAt || proposal.createdAt,
            finalAmount: proposal.proposedAmount,
            rating: proposal.rating || undefined,
            feedback: proposal.feedback || undefined,
            status: 'completed',
            job: proposal.job
          }));
          
          setCompletedJobs(transformedJobs);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching completed jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {completedJobs.length} job{completedJobs.length !== 1 ? 's' : ''} completed
      </p>

      {loading ? (
        <div className="space-y-3" aria-busy>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-soft" />
          ))}
        </div>
      ) : completedJobs.length === 0 ? (
        <EmptyState
          title="No completed jobs yet"
          body="Finish a project and it lands here with the client's feedback."
          action={
            <Button asChild size="sm">
              <Link href="/jobs/open">Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="-mx-5 divide-y divide-hairline">
          {completedJobs.map((job) => (
            <li key={job._id} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {job.job?.title || 'Job no longer available'}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(job.startDate)} – {formatDate(job.completedDate)}
                  </p>
                </div>

                {job.job && (
                  <Button asChild variant="ghost" size="sm" className="shrink-0">
                    <Link href={`/jobs/${job.job.jobId}`}>View job</Link>
                  </Button>
                )}
              </div>

              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {formatCurrency(job.finalAmount)}
                  </dd>
                </div>
                {typeof job.rating === 'number' && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {job.rating.toFixed(1)}
                    </dd>
                  </div>
                )}
              </dl>

              {job.feedback && (
                <blockquote className="mt-3 border-l-2 border-hairline pl-3 text-sm text-muted-foreground">
                  {job.feedback}
                </blockquote>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}