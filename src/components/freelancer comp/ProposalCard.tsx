'use client';

import { Button } from '../ui/button';
import Link from 'next/link';
import { useUser } from '@/components/auth';
import ReportUserPopover from '@/components/reports/ReportUserPopover';
import MarkCompletePopover from './MarkCompletePopover';

// Module-scope so the formatter is built once, not per render
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const formatDate = (dateString: string | Date) => dateFormatter.format(new Date(dateString));

export interface Proposal {
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

interface Job {
    _id: string;

    jobId: string;
    clientId: string;
    title: string;
    description: string;
    category: string;
    status: string;
    budget: number;
    clientMarkedComplete?: boolean;
    freelancerMarkedComplete?: boolean;
    deadline: Date;
}

interface ProposalCardProps {
  proposal: Proposal;
  markingCompleteId: string | null;
  onMarkComplete: (jobId: string) => void;
}

export default function ProposalCard({ proposal, markingCompleteId, onMarkComplete }: ProposalCardProps) {
  const { user } = useUser();
  const markingComplete = markingCompleteId === proposal.job?.jobId;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-foreground">
            {proposal.job?.title || 'Job no longer available'}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Started {formatDate(proposal.createdAt)}
          </p>
        </div>

        {proposal.job?.category && (
          <span className="shrink-0 rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
            {proposal.job.category}
          </span>
        )}
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{proposal.message}</p>

      {/* Project Details */}
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Your rate</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {formatCurrency(proposal.proposedAmount)}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {proposal.estimatedDays} days
          </dd>
        </div>
      </dl>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {proposal.job && (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href={`/jobs/${proposal.job.jobId}`}>View job</Link>
            </Button>

            <Button asChild size="sm">
              <Link href={`/room/${proposal.jobId}`}>Open chat</Link>
            </Button>

            <ReportUserPopover
              reporterId={user?.id}
              reportedId={proposal.job.clientId}
              jobId={proposal.job.jobId}
              reportedLabel="client"
            />

            {proposal.job.freelancerMarkedComplete === true ? (
              <span className="text-xs font-medium text-amber-700">Awaiting client approval</span>
            ) : (
              <MarkCompletePopover
                jobId={proposal.job.jobId}
                markingComplete={markingComplete}
                onConfirm={onMarkComplete}
              />
            )}
          </>
        )}

        {!proposal.job && (
          <span className="text-xs text-muted-foreground">
            This job was removed or closed. Your proposal record is unchanged.
          </span>
        )}
      </div>
    </div>
  );
}
