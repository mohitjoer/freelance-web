'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import ViewProposal from '@/components/jobs id comp/viewproposal'; 

interface Job {
  _id: string;
  jobId: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  createdAt: string;
  references?: string[];
  resources?: string[];
  client?: {
    name: string;
    image: string;
  };
}

interface Proposal {
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
}

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(null);
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

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        console.log('Fetching job with ID:', jobId); 
        const res = await fetch(`/api/job/${jobId}`, {
          cache: 'no-store',
        });
        
        console.log('Response status:', res.status); 
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Response data:', data); 

        if (!data.success || !data.data) {
          setError('Job not found');
          router.replace('/404');
        } else {
          setJob(data.data);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  // Fixed useEffect - moved fetchProposal logic inside
  useEffect(() => {
    if (!job || !jobId) return;
    
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposal/check?jobId=${jobId}`);
        const data = await res.json();
        if (data.success && data.proposal) {
          setExistingProposal(data.proposal);
        }
      } catch (err) {
        console.error('Failed to fetch proposal:', err);
      }
    };

    fetchProposal();
  }, [job, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-cyan-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-cyan-500 to-indigo-600 flex items-center justify-center">
        <div className="text-red-200 text-xl">{error || 'Job not found.'}</div>
      </div>
    );
  }

  // Check if the current user is the client who posted this job
  const isJobOwner = user?.id === job.clientId;

  return (
    <main className="min-h-screen bg-gradient-to-bl from-cyan-500 to-indigo-600 px-4 py-8 flex justify-center">
      <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-lg">
        <div className='flex flex-row justify-between items-start mb-6'>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">{job.title}</h1>
          </div>
          {job.client && (
            <div className="flex w-fit bg-neutral-100 p-2 pr-4 rounded-full items-center flex-row gap-3 ml-4">
              <Image
                src={job.client.image}
                alt={job.client.name}
                className="w-10 h-10 rounded-full border"
                width={40}
                height={40}
              />
              <div>
                <p className="text-lg font-semibold">{job.client.name}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-6 grid grid-cols-2 gap-4">
          <p><strong>Category:</strong> {job.category}</p>
          <p><strong>Budget:</strong> ${job.budget.toLocaleString()}</p>
          <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
          <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {Array.isArray(job.references) && job.references.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reference Links</h2>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              {job.references.map((url, idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(job.resources) && job.resources.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Resource Links</h2>
            <ul className="list-disc list-inside text-green-600 space-y-1">
              {job.resources.map((url, idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {existingProposal && !isJobOwner && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Your Current Proposal</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Message:</strong> {existingProposal.message}</p>
              <p><strong>Proposed Amount:</strong> ${existingProposal.proposedAmount.toLocaleString()}</p>
              <p><strong>Estimated Days:</strong> {existingProposal.estimatedDays} days</p>
            </div>
          </div>
        )}

        {isJobOwner && (
          <div className='flex flex-row justify-start items-center'>
             <Link href="/dashboard/client">
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              &larr; Back to Dashboard
            </Button>
          </Link>

          </div>
        )}
        {!isJobOwner && (
        <div className="flex flex-row justify-between items-center mt-6">
          
          <Link href="/jobs/open">
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              &larr; Back to Open Jobs
            </Button>
          </Link>

          
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {existingProposal ? 'Edit Proposal' : 'Make a Proposal'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {existingProposal ? 'Edit your Proposal' : 'Submit your Proposal'}
                </h3>

                {successMessage && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertTitle className="text-green-800">{successMessage}</AlertTitle>
                  </Alert>
                )}
                {failureMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>{failureMessage}</AlertTitle>
                  </Alert>
                )}

                <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      defaultValue={existingProposal?.message || ''}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Explain why you're the best fit for this job..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="proposedAmount" className="block text-sm font-medium mb-1">
                      Proposed Amount ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="proposedAmount"
                      name="proposedAmount"
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      defaultValue={existingProposal?.proposedAmount || ''}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your proposed amount"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="estimatedDays" className="block text-sm font-medium mb-1">
                      Estimated Days to Complete <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="estimatedDays"
                      name="estimatedDays"
                      type="number"
                      min="1"
                      required
                      defaultValue={existingProposal?.estimatedDays || ''}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter estimated days"
                    />
                  </div>
                  
                  <div className='flex flex-row items-center justify-center gap-2 w-full'>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : (existingProposal ? 'Update Proposal' : 'Submit Proposal')}
                    </Button>
                    {existingProposal && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-red-600 border-red-500 hover:bg-red-50"
                        onClick={handleDeleteProposal}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </div>
                </form>
                
                <p className="text-xs text-gray-500 mt-3">
                  You can only submit one proposal per job. You can edit or delete it anytime.
                </p>
              </PopoverContent>
            </Popover>
        </div>
        )}


        {isJobOwner && (
          <div className="mt-8">
            <ViewProposal jobId={job.jobId} />
            
          </div>
        )}
      </div>
    </main>
  );
}