"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { EmptyState } from "@/components/dashboard/ui";
import { formatBudget } from "@/lib/budget";
import { formatDay } from "@/lib/format";

interface Job {
    _id: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    budgetType?: 'fixed' | 'hourly';
    budgetMax?: number | null;
    deadline: Date;
}

interface Proposal {
    _id: string;
    proposalId: string;
    jobId: string;
    freelancerId: string;
    message: string;
    proposedAmount: number;
    estimatedDays: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    job: Job | null;
}

const canDeleteProposal = (proposal: Proposal) =>
  (proposal.status === 'pending' || proposal.status === 'rejected') && proposal.job?.jobId;

// Module-scope so the formatter is built once, not per render
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function Proposallist() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [deletingProposalId, setDeletingProposalId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProposals = async () => {
      try {
        const res = await fetch('/api/proposals/user', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP `);
        const data = await res.json();
        if (data.success) {
          // Filter to show only pending and rejected proposals
          const filteredProposals = data.data.filter(
            (proposal: Proposal) => proposal.status === 'pending' || proposal.status === 'rejected'
          );
          setProposals(filteredProposals);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
    return () => controller.abort();
  }, []);

  const handleDeleteProposal = async (proposalId: string, jobId: string) => {
    if (!proposalId || !jobId) return;

    setDeletingProposalId(proposalId);

    try {
      const res = await fetch(`/api/proposal/${proposalId}?jobId=${jobId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();

      if (result.success) {
        setProposals((prev) => prev.filter((p) => p.proposalId !== proposalId));
        setSuccessMessage('Proposal deleted.');
        setFailureMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFailureMessage('Delete failed: ' + result.message);
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error deleting proposal:', err);
      setFailureMessage('An error occurred while deleting the proposal.');
      setSuccessMessage('');
    } finally {
      setDeletingProposalId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-soft" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {proposals.length} awaiting response
        </p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/jobs/open">Find work</Link>
        </Button>
      </div>

      {successMessage && (
        <p className="mb-3 text-sm text-foreground" role="status">
          {successMessage}
        </p>
      )}
      {failureMessage && (
        <p className="mb-3 text-sm text-destructive" role="alert">
          {failureMessage}
        </p>
      )}

      {proposals.length === 0 ? (
        <EmptyState
          title="No open proposals"
          body="Proposals you send stay here until a client responds."
          action={
            <Button asChild size="sm">
              <Link href="/jobs/open">Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <ul className="-mx-5 divide-y divide-hairline">
          {proposals.map((proposal) => (
            <li key={proposal._id} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">
                      {proposal.job?.title || 'Job no longer available'}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        proposal.status === 'pending'
                          ? "bg-amber-50 text-amber-700"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {proposal.status === 'pending' ? 'Pending' : 'Not selected'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sent {formatDay(proposal.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {proposal.job && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/jobs/${proposal.job.jobId}`}>View job</Link>
                    </Button>
                  )}
                  {canDeleteProposal(proposal) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        handleDeleteProposal(proposal.proposalId, proposal.job?.jobId || '')
                      }
                      disabled={deletingProposalId === proposal.proposalId}
                    >
                      {deletingProposalId === proposal.proposalId ? 'Deleting…' : 'Delete'}
                    </Button>
                  )}
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{proposal.message}</p>

              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">You proposed</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {usd.format(proposal.proposedAmount)}
                  </dd>
                </div>
                {proposal.job && (
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Job budget</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {formatBudget(proposal.job)}
                    </dd>
                  </div>
                )}
                <div className="flex gap-1.5">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {proposal.estimatedDays} days
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
