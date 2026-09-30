'use client';

import ProposalFormSection from './ProposalFormSection';
import type { Job, Proposal } from './types';

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
  // Budget, deadline and status already read in the overview row. Repeating
  // them in a "Job Statistics" card was the same numbers twice on one screen.
  // The job owner never applies, so they get no sidebar at all.
  if (isJobOwner) return null;

  if (job.status !== "open") {
    return (
      <div className="rounded-xl border border-hairline bg-card px-5 py-4">
        <p className="text-sm font-medium text-ink">This job is {job.status}</p>
        <p className="mt-1 text-sm text-muted-foreground">It is no longer accepting proposals.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-8">
        <ProposalFormSection
          existingProposal={existingProposal}
          isSubmitting={isSubmitting}
          successMessage={successMessage}
          failureMessage={failureMessage}
          formRef={formRef}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
