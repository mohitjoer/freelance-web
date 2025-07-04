'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle } from "@/components/ui/alert";

interface Job {
  _id: string;
  jobId: string; // ✅ Ensure this is fetched from the backend
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
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage('');
    setFailureMessage('');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      jobId: job!.jobId, // ✅ using UUID
      message: formData.get('message'),
      proposedAmount: parseFloat(formData.get('proposedAmount') as string),
      estimatedDays: parseInt(formData.get('estimatedDays') as string),
    };

    try {
      let res;
      if (existingProposal) {
        res = await fetch(`/api/proposal/${existingProposal.proposalId}?jobId=${job!.jobId}`, {
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
          fetchProposal();
        }

        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setFailureMessage(`Failed to ${existingProposal ? 'update' : 'submit'} proposal: ` + result.message);
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setFailureMessage('Something went wrong!');
      setSuccessMessage('');
    }
  };

  const handleDeleteProposal = async () => {
    if (!existingProposal || !job?.jobId) return;

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
        setSuccessMessage('Proposal deleted.');
        setFailureMessage('');
      } else {
        setFailureMessage('Delete failed: ' + result.message);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      setFailureMessage('An error occurred during deletion.');
      setSuccessMessage('');
    }
  };

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposal/check?jobId=${id}`);
      const data = await res.json();
      if (data.success && data.proposal) {
        setExistingProposal(data.proposal);
      }
    } catch (err) {
      console.error('Failed to fetch proposal:', err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job/${id}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (!data.success || !data.data) {
          setError('Job not found');
          router.replace('/404');
        } else {
          setJob(data.data); // Make sure this includes `jobId`
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading job details...</div>;
  }

  if (error || !job) {
    return <div className="p-8 text-center text-red-500">{error || 'Job not found.'}</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-bl from-cyan-500 to-indigo-600 px-4 py-8 flex justify-center">
      <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-lg">
        <div className='flex flex-row justify-between items-center mb-6'>
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">{job.title}</h1>
          {job.client && (
            <div className="flex w-fit bg-neutral-400 p-2 pr-4 rounded-full items-center flex-row gap-4 mb-4">
              <img
                src={job.client.image}
                alt={job.client.name}
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className=" text-2xl font-semibold">{job.client.name}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p><strong>Category:</strong> {job.category}</p>
          <p><strong>Budget:</strong> ${job.budget}</p>
          <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
          <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleString()}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {Array.isArray(job.references) && job.references.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reference Links</h2>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              {job.references.map((url, idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
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
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-row justify-between items-center mt-6">
          <Link href="/jobs/open">
            <Button variant="outline" className="text-indigo-600 border-2 flex items-center justify-center px-4 py-2">
                &larr; Back to Open Jobs
            </Button>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2">
                {existingProposal ? 'Edit Proposal' : 'Make a Proposal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">
                {existingProposal ? 'Edit your Proposal' : 'Submit your Proposal'}
              </h3>

              {successMessage && (
                <Alert variant="default" className="text-green-700 border-green-600 mb-4 p-2">
                  <AlertTitle>{successMessage}</AlertTitle>
                </Alert>
              )}
              {failureMessage && (
                <Alert variant="destructive" className="text-red-600 border-red-600 mb-4 p-2">
                  <AlertTitle>{failureMessage}</AlertTitle>
                </Alert>
              )}

              <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                <div className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      defaultValue={existingProposal?.message || ''}
                      required
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label htmlFor="proposedAmount" className="block text-sm font-medium mb-1">Proposed Amount ($)</label>
                    <input
                      id="proposedAmount"
                      name="proposedAmount"
                      type="number"
                      min={1}
                      required
                      defaultValue={existingProposal?.proposedAmount || ''}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="estimatedDays" className="block text-sm font-medium mb-1">Estimated Days to Complete</label>
                    <input
                      id="estimatedDays"
                      name="estimatedDays"
                      type="number"
                      min={1}
                      required
                      defaultValue={existingProposal?.estimatedDays || ''}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center gap-4 w-full '>
                  <Button type="submit" className="w-1/2 bg-indigo-600 text-white hover:bg-indigo-700">
                    {existingProposal ? 'Update Proposal' : 'Submit Proposal'}
                  </Button>
                  {existingProposal && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2 text-red-600 border-red-500 hover:bg-red-50 "
                      onClick={handleDeleteProposal}
                    >
                      Delete Proposal
                    </Button>
                  )}
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-2">You can only submit one proposal per job.</p>
            </PopoverContent>
          </Popover>
        </div>

        {existingProposal && (
          <div className="flex flex-col items-start mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p>
              <strong>Your Proposal:</strong> <br />
              <strong>Message:</strong> {existingProposal.message} <br />
              <strong>Proposed Amount:</strong> ${existingProposal.proposedAmount} <br />
              <strong>Estimated Days:</strong> {existingProposal.estimatedDays} days
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
