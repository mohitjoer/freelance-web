'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/auth';
import Link from 'next/link';
import { Button } from '../ui/button';
import { EmptyState, Tabs } from "@/components/dashboard/ui";
import { formatBudget } from '@/lib/budget';
import { formatDay } from '@/lib/format';

interface Job {
  jobId: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  budgetType?: 'fixed' | 'hourly';
  budgetMax?: number | null;
  deadline: string;
  createdAt: string;
}

const TABS = [
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export default function JobFinished() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("completed");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchFinishedJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load finished jobs');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (!cancelled) setError('Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFinishedJobs();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isLoaded, user]);

  const completedJobs = jobs.filter((job) => job.status === 'completed');
  const cancelledJobs = jobs.filter((job) => job.status === 'cancelled');
  const currentJobs = activeTab === 'completed' ? completedJobs : cancelledJobs;

  if (loading) {
    return (
      <div className="space-y-3" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-soft" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        Could not load finished jobs. {error}
      </p>
    );
  }

  return (
    <div className="-mx-5 -mb-5">
      <Tabs
        tabs={TABS.map((t) => ({
          ...t,
          count: t.id === 'completed' ? completedJobs.length : cancelledJobs.length,
        }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      {currentJobs.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} jobs`}
          body={
            activeTab === 'completed'
              ? 'Finished projects show up here once both sides confirm completion.'
              : 'Jobs you cancel before completion show up here.'
          }
        />
      ) : (
        <ul className="divide-y divide-hairline">
          {currentJobs.map((job) => (
            <li key={job._id} className="px-5 py-4 transition-colors hover:bg-surface-soft/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="min-w-0 truncate text-sm font-medium text-foreground">{job.title}</h3>
                <Button asChild size="sm">
                  <Link href={`/jobs/${job.jobId}`}>Details</Link>
                </Button>
              </div>

              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Budget</dt>
                  <dd className="font-medium tabular-nums text-foreground">{formatBudget(job)}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Deadline</dt>
                  <dd className="font-medium tabular-nums text-foreground">{formatDay(job.deadline)}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Closed</dt>
                  <dd className="font-medium tabular-nums text-foreground">{formatDay(job.createdAt)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
