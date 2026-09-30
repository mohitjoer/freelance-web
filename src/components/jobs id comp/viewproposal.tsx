'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/input';
import { Panel, PanelHeader, EmptyState } from '@/components/ui/panel';
import ProposalCard, { type Proposal } from './ProposalCard';

interface ViewProposalProps {
  jobId: string;
  initialProposals?: unknown[];
}

const ratingOf = (p: Proposal) =>
  typeof p.freelancerId === 'object' && p.freelancerId ? p.freelancerId.rating ?? 0 : 0;

const SORTS = [
  { id: 'date', label: 'Most recent' },
  { id: 'amount', label: 'Lowest rate' },
  { id: 'days', label: 'Fastest delivery' },
  { id: 'rating', label: 'Highest rated' },
] as const;

export default function ViewProposal({ jobId, initialProposals }: ViewProposalProps) {
  const [proposals, setProposals] = useState<Proposal[]>((initialProposals as Proposal[]) ?? []);
  const [loading, setLoading] = useState(!initialProposals);
  const [sortBy, setSortBy] = useState<(typeof SORTS)[number]['id']>('date');

  useEffect(() => {
    if (initialProposals) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchProposals = async () => {
      try {
        const res = await fetch(`/api/proposals/${jobId}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setProposals(data.success && Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching proposals for job:', error);
        if (!cancelled) setProposals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProposals();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [jobId, initialProposals]);

  const sortedProposals = [...proposals].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return a.proposedAmount - b.proposedAmount;
      case 'days':
        return a.estimatedDays - b.estimatedDays;
      case 'rating':
        return ratingOf(b) - ratingOf(a);
      default:
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    }
  });

  const handleProposalAction = async (proposal: Proposal, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(
        `/api/action-proposal/${proposal.proposalId}/${action}?jobId=${proposal.jobId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, proposalId: proposal.proposalId }),
        }
      );

      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposal._id
              ? { ...p, status: action === 'accept' ? 'accepted' : 'rejected' }
              : p
          )
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing proposal:`, error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 p-5" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-surface-soft" />
        ))}
      </div>
    );
  }

  return (
    <Panel>
      <PanelHeader title="Proposals">
        <p className="mt-0.5 text-sm text-muted-foreground">
          {proposals.length} to review
        </p>
      </PanelHeader>

      <div className="border-b border-hairline px-5 py-3">
        <label htmlFor="sort-proposals" className="sr-only">
          Sort proposals
        </label>
        <Select
          id="sort-proposals"
          className="w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as (typeof SORTS)[number]['id'])}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      {proposals.length === 0 ? (
        <EmptyState
          title="No proposals yet"
          body="Your posting is live. Freelancers pitching on this brief show up here."
        />
      ) : (
        <ul className="divide-y divide-hairline">
          {sortedProposals.map((proposal) => (
            <li key={proposal._id} className="px-5 py-4">
              <ProposalCard proposal={proposal} onAction={handleProposalAction} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
