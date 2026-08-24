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
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {proposal.job?.title || 'Job No Longer Available'}
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                In Progress
              </span>
            </div>
            <p className="text-sm text-gray-500">Started {formatDate(proposal.createdAt)}</p>
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Project Overview</h4>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {proposal.message}
              </p>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Project Value</span>
                </div>
                <div className="text-lg font-semibold text-green-600">{formatCurrency(proposal.proposedAmount)}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Duration</span>
                </div>
                <div className="text-lg font-semibold text-blue-600">{proposal.estimatedDays} days</div>
              </div>
            </div>

            {/* Project Category */}
            {proposal.job?.category && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Category</div>
                <div className="text-sm font-medium text-blue-900 mt-1 capitalize">
                  {proposal.job.category}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {proposal.job && (
            <Link href={`/jobs/${proposal.job.jobId}`} className="flex-1">
              <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Job Details
              </Button>
            </Link>
          )}

          <Link href={`/room/${proposal.jobId}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Project Chat
            </Button>
          </Link>

          {/* Report User Button */}
          {proposal.job?.clientId && (
            <ReportUserPopover reporterId={user?.id} reportedId={proposal.job!.clientId} jobId={proposal.job!.jobId} reportedLabel="client" />
          )}

          {/* Completion Status */}
          {proposal.job?.freelancerMarkedComplete === true ? (
            <div className="flex-1 flex items-center justify-center p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-amber-700">
                Awaiting Client Approval
              </span>
            </div>
          ) : (
            proposal.job && (
              <MarkCompletePopover
                jobId={proposal.job.jobId}
                markingComplete={markingComplete}
                onConfirm={onMarkComplete}
              />
            )
          )}
        </div>

        {/* Warning for deleted jobs */}
        {!proposal.job && (
          <div className="mt-4 flex items-start gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="font-medium">Job No Longer Available</p>
              <p className="text-xs mt-1">The job associated with this project has been removed or closed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
