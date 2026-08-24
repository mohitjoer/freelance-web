'use client';

import { useRef, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewProposal from '@/components/jobs id comp/viewproposal';
import JobHeader from './JobHeader';
import JobResources from './JobResources';
import JobSidebar from './JobSidebar';
import { formatDate, type Job, type Proposal } from './types';

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
    <div className="min-h-screen bg-gray-50">
      {/* Full Header Section */}
      <JobHeader job={job} currentUserId={currentUserId} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DescriptionIcon className="text-blue-600" />
                Job Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <AttachMoneyIcon className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-bold text-green-600">${job.budget.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CalendarTodayIcon className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-bold text-blue-600">{formatDate(job.deadline)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CategoryIcon className="text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-bold text-purple-600">{job.category}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CalendarTodayIcon className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-bold text-gray-600">{formatDate(job.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* References and Resources */}
            <JobResources references={job.references} resources={job.resources} />

            {/* Existing Proposal Display */}
            {existingProposal && !isJobOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Proposal</h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message:</p>
                    <p className="text-gray-900">{existingProposal.message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Proposed Amount:</p>
                      <p className="text-lg font-bold text-green-600">${existingProposal.proposedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Days:</p>
                      <p className="text-lg font-bold text-blue-600">{existingProposal.estimatedDays} days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Proposals for Job Owner */}
            {isJobOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <ViewProposal jobId={job.jobId} initialProposals={initialProposals} />
              </div>
            )}
          </div>

          {/* Sidebar */}
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
      </main>
    </div>
  );
}
