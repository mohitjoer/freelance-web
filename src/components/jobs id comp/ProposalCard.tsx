'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDay } from '@/lib/format';

export interface Freelancer {
  freelancerId?: string;
  userId?: string;
  name: string;
  image?: string | null;
  rating?: number | null;
  skills?: string[];
}

export interface Proposal {
  _id?: string;
  jobId?: string;
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
  createdAt?: string;
  freelancerId: Freelancer | string;
  status?: 'pending' | 'accepted' | 'rejected';
}

const STATUS_LABEL: Record<NonNullable<Proposal['status']>, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Declined',
};

const getFreelancerId = (f: Freelancer) => f.freelancerId || f.userId || '';

interface ProposalCardProps {
  proposal: Proposal;
  onAction: (proposal: Proposal, action: 'accept' | 'reject') => void;
}

export default function ProposalCard({ proposal, onAction }: ProposalCardProps) {
  const f =
    typeof proposal.freelancerId === 'object' && proposal.freelancerId !== null
      ? proposal.freelancerId
      : { name: 'Unknown freelancer' };
  const profileHref = getFreelancerId(f) ? `/profile/${getFreelancerId(f)}` : null;
  const status = proposal.status ?? 'pending';

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={f.image || '/default-avatar.png'}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <div className="min-w-0">
            {profileHref ? (
              <Link href={profileHref} className="text-sm font-medium text-ink hover:text-primary">
                {f.name}
              </Link>
            ) : (
              <p className="text-sm font-medium text-ink">{f.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {typeof f.rating === 'number' && f.rating > 0 ? `${f.rating.toFixed(1)} rating` : 'No rating yet'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums text-ink">
            ${proposal.proposedAmount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{proposal.estimatedDays} days</p>
        </div>
      </div>

      {f.skills && f.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {f.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {proposal.message}
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {STATUS_LABEL[status]}
          {proposal.createdAt && ` · ${formatDay(proposal.createdAt)}`}
        </p>

        {status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onAction(proposal, 'reject')}>
              Decline
            </Button>
            <Button size="sm" onClick={() => onAction(proposal, 'accept')}>
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
