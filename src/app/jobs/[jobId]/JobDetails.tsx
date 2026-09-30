'use client';

import { useRef, useState } from 'react';
import ViewProposal from '@/components/jobs id comp/viewproposal';
import JobHeader from './JobHeader';
import JobResources from './JobResources';
import JobSidebar from './JobSidebar';
import { Panel, PanelHeader, StatRow } from '@/components/ui/panel';
import { SidePanel } from '@/components/PageShell';
import { formatDate, type Job, type Proposal } from './types';
import { formatBudget } from '@/lib/budget';

interface JobDetailsProps {
  job: Job;
  currentUserId: string;
  initialProposal: Proposal | null;
  initialProposals?: unknown[];
}

export default function JobDetails({ job, currentUserId, initialProposal, initialProposals }: JobDetailsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(initialProposal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job?.jobId || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setFailureMessage('');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const message = formData.get('message') as string;
    const proposedAmount = formData.get('proposedAmount') as string;
    const estimatedDays = formData.get('estimatedDays') as string;

    // Validation
    if (!message?.trim()) {
      setFailureMessage('Message is required');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(proposedAmount);
    const days = parseInt(estimatedDays);

    if (isNaN(amount) || amount <= 0) {
      setFailureMessage('Please enter a valid proposed amount');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(days) || days <= 0) {
      setFailureMessage('Please enter valid estimated days');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      jobId: job.jobId,
      message: message.trim(),
      proposedAmount: amount,
      estimatedDays: days,
    };

    try {
      let res;
      if (existingProposal) {
        res = await fetch(`/api/proposal/${existingProposal.proposalId}?jobId=${job.jobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setSuccessMessage(existingProposal ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
        setFailureMessage('');

        if (existingProposal) {
          setExistingProposal(result.proposal);
        } else {
          // Inline fetch proposal after successful submission
          try {
            const res = await fetch(`/api/proposal/check?jobId=${job.jobId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.success && data.proposal) {
              setExistingProposal(data.proposal);
            }
          } catch (err) {
            console.error('Failed to fetch proposal:', err);
          }
        }

        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setFailureMessage(`Failed to ${existingProposal ? 'update' : 'submit'} proposal: ${result.message || 'Unknown error'}`);
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setFailureMessage('Network error. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProposal = async () => {
    if (!existingProposal || !job?.jobId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/proposal/${existingProposal.proposalId}?jobId=${job.jobId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setExistingProposal(null);
        setSuccessMessage('Proposal deleted successfully.');
        setFailureMessage('');
      } else {
        setFailureMessage(`Delete failed: ${result.message || 'Unknown error'}`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      setFailureMessage('Network error during deletion.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current user is the client who posted this job
  const isJobOwner = currentUserId === job.clientId;

  return (
    <div className="min-h-dvh bg-canvas">
      <JobHeader job={job} currentUserId={currentUserId} />

      {/* Nav rail | job content | apply form. Collapses to one column below xl. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:px-8 xl:grid-cols-[15rem_minmax(0,1fr)_20rem]">
        <div className="hidden xl:block">
          <SidePanel active="/jobs/open" />
        </div>

        <div className="min-w-0 space-y-6">
          <Panel>
            <StatRow
              stats={[
                { label: "Budget", value: formatBudget(job) },
                { label: "Deadline", value: formatDate(job.deadline) },
                { label: "Category", value: job.category },
                { label: "Posted", value: formatDate(job.createdAt) },
              ]}
            />
          </Panel>

          <Panel>
            <PanelHeader title="Description" />
            <p className="whitespace-pre-wrap px-5 py-4 leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </Panel>

          <JobResources references={job.references} resources={job.resources} />

          {existingProposal && !isJobOwner && (
            <Panel>
              <PanelHeader title="Your proposal" />
              <div className="space-y-4 px-5 py-4">
                <p className="leading-relaxed text-foreground">{existingProposal.message}</p>
                <dl className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Your rate</dt>
                    <dd className="font-medium tabular-nums text-ink">
                      ${existingProposal.proposedAmount.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="font-medium tabular-nums text-ink">
                      {existingProposal.estimatedDays} days
                    </dd>
                  </div>
                </dl>
              </div>
            </Panel>
          )}

          {isJobOwner && (
            <Panel>
              <ViewProposal jobId={job.jobId} initialProposals={initialProposals} />
            </Panel>
          )}
        </div>

        <div className="min-w-0">
          <JobSidebar
            job={job}
            isJobOwner={isJobOwner}
            existingProposal={existingProposal}
            isSubmitting={isSubmitting}
            successMessage={successMessage}
            failureMessage={failureMessage}
            formRef={formRef}
            onSubmit={onSubmit}
            onDelete={handleDeleteProposal}
          />
        </div>
      </div>
    </div>
  );
}
