"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import ProposalCard, { type Proposal } from './ProposalCard';
import { EmptyState } from "@/components/dashboard/ui";

export default function WorkingJob() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchWorkingJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP `);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setProposals(data.data);
        } else {
          setError(data.message || 'Failed to load working jobs');
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching working jobs:', error);
        if (!cancelled) setError('Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWorkingJobs();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const handleMarkComplete = async (jobId: string) => {
    setMarkingComplete(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}/confirm-completion`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'freelancer'
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();

      if (result.success) {
        setProposals((prev: Proposal[]) =>
          prev.map((proposal) =>
            proposal.job?.jobId === jobId
              ? {
                  ...proposal,
                  job: proposal.job ? {
                    ...proposal.job,
                    freelancerMarkedComplete: true
                  } : null
                }
              : proposal
          )
        );
      } else {
        alert(result.message || "Failed to mark job as complete.");
      }
    } catch (err) {
      console.error("Complete job error:", err);
      alert("Server error.");
    } finally {
      setMarkingComplete(null);
    }
  };

  // Filter proposals to show only accepted ones with job status "in-progress"
  const acceptedProposals = proposals.filter(proposal =>
    proposal.status === 'accepted' &&
    proposal.job &&
    proposal.job.status === 'in-progress'
  );

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {acceptedProposals.length} active project{acceptedProposals.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="space-y-3" aria-busy>
          {[0, 1].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-surface-soft" />
          ))}
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-4">
            Try again
          </Button>
        </div>
      ) : acceptedProposals.length === 0 ? (
        <EmptyState
          title="No active projects"
          body="Projects you have been hired for show up here."
          action={
            <Button asChild size="sm">
              <Link href="/jobs/open">Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="-mx-5 divide-y divide-hairline">
          {acceptedProposals.map((proposal) => (
            <li key={proposal._id} className="px-5 py-4">
              <ProposalCard
                proposal={proposal}
                markingCompleteId={markingComplete}
                onMarkComplete={handleMarkComplete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
