'use client';

import { useEffect, useState } from 'react';
import ReportUserPopover from '@/components/reports/ReportUserPopover';
import { useUser } from '@/components/auth';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';
import { EmptyState } from "@/components/dashboard/ui";
import { formatBudget } from '@/lib/budget';
import { formatDay } from '@/lib/format';

interface Job {
  jobId: string;
  clientId: string;
  freelancerId: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  budgetType?: 'fixed' | 'hourly';
  budgetMax?: number | null;
  deadline: string;
  createdAt: string;
  clientMarkedComplete?: boolean;
  acceptedProposalId?: string;
  startedat?: Date;
}

export default function JobOngoing() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!isLoaded || !user) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchOngoingJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load ongoing jobs');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (!cancelled) setError('Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOngoingJobs();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isLoaded, user]);

  const handleMarkComplete = async (jobId: string) => {
    try {
      const res = await fetch(`/api/job/${jobId}/confirm-completion`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          role: 'client' 
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === jobId ? { ...job, status: "completed" } : job
          )
        );
      } else {
        alert(result.message || "Failed to mark job as complete.");
      }
    } catch (err) {
      console.error("Complete job error:", err);
      alert("Server error.");
    }
  };

  const inProgressJobs = jobs.filter(job => job.status === 'in-progress');

  if (loading) {
    return (
      <div className="space-y-3" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-soft" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        Could not load ongoing jobs. {error}
      </p>
    );
  }

  if (inProgressJobs.length === 0) {
    return (
      <EmptyState
        title="No ongoing jobs"
        body="Projects you hire a freelancer for will show up here."
        action={
          <Button asChild size="sm">
            <Link href="/jobs/create">Post a job</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="-mx-5 -my-5 divide-y divide-hairline">
      {inProgressJobs.map((job) => (
        <li key={job._id} className="px-5 py-4 transition-colors hover:bg-surface-soft/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-foreground">{job.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Waiting on freelancer confirmation
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/room/${job.jobId}`}>Chat</Link>
              </Button>

              {job.clientMarkedComplete ? (
                <Button variant="outline" size="sm" disabled>
                  Pending
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Mark complete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-5">
                      <h4 className="font-semibold text-foreground">Mark complete?</h4>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        The freelancer has to confirm before payment is released.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button onClick={() => handleMarkComplete(job.jobId)} size="sm" className="flex-1">
                          Yes, mark complete
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <ReportUserPopover
                reporterId={user?.id}
                reportedId={job.freelancerId}
                jobId={job.jobId}
                reportedLabel="freelancer"
              />

              <Button asChild size="sm">
                <Link href={`/jobs/${job.jobId}`}>Details</Link>
              </Button>
            </div>
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground">Budget</dt>
              <dd className="font-medium tabular-nums text-foreground">{formatBudget(job)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground">Deadline</dt>
              <dd className="font-medium tabular-nums text-foreground">{formatDay(job.deadline)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground">Started</dt>
              <dd className="font-medium tabular-nums text-foreground">{formatDay(job.startedat ?? job.createdAt)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}