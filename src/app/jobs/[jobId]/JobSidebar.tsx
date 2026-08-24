'use client';

import ProposalFormSection from './ProposalFormSection';
import { formatDate, type Job, type Proposal } from './types';

interface JobSidebarProps {
  job: Job;
  isJobOwner: boolean;
  existingProposal: Proposal | null;
  isSubmitting: boolean;
  successMessage: string;
  failureMessage: string;
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

export default function JobSidebar({
  job,
  isJobOwner,
  existingProposal,
  isSubmitting,
  successMessage,
  failureMessage,
  formRef,
  onSubmit,
  onDelete,
}: JobSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        {/* Action Card */}
        {!isJobOwner && job.status === "open" && (
          <ProposalFormSection
            existingProposal={existingProposal}
            isSubmitting={isSubmitting}
            successMessage={successMessage}
            failureMessage={failureMessage}
            formRef={formRef}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        )}

        {/* Job Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posted</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(job.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget</span>
              <span className="text-sm font-bold text-green-600">
                ${job.budget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
