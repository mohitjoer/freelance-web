'use client';

import { useEffect, useState } from 'react';
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
  discription: string;
  category: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  budgetType?: 'fixed' | 'hourly';
  budgetMax?: number | null;
  deadline: string;
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

export default function ClientJobList() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          // Filter to only show open jobs
          const openJobs = data.data.filter((job: Job) => job.status.toLowerCase() === 'open');
          setJobs(openJobs);
        } else {
          setError(data.message || 'Failed to load jobs');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (!cancelled) setError('Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isLoaded, user]);

  const handleCancel = async (jobId: string) => {
    try {
      const res = await fetch(`/api/job/${jobId}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        // Remove the cancelled job from the list since we only show open jobs
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      } else {
        alert(result.message || "Failed to cancel job.");
      }
    } catch (err) {
      console.error("Cancel job error:", err);
      alert("Server error.");
    }
  };


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
        Could not load your jobs. {error}
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No open jobs"
        body="Post a job to start receiving proposals from freelancers."
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
      {jobs.map((job) => (
        <li key={job._id} className="px-5 py-4 transition-colors hover:bg-surface-soft/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-foreground">{job.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{job.discription}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/jobs/edit/${job.jobId}`}>Edit</Link>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Cancel
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-5">
                    <h4 className="font-semibold text-foreground">Cancel this posting?</h4>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      This cannot be undone. Every proposal on the job is rejected.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => handleCancel(job.jobId)} size="sm" className="flex-1">
                        Yes, cancel job
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button asChild size="sm">
                <Link href={`/jobs/${job.jobId}`}>Proposals</Link>
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
              <dt className="text-muted-foreground">Posted</dt>
              <dd className="font-medium tabular-nums text-foreground">{formatDay(job.createdAt)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium capitalize text-foreground">{job.category}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}