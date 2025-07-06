"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Job {
    _id: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: Date;
}

interface Proposal {
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

export default function WorkingJob() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkingJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user');
        const data = await res.json();
        if (data.success) {
          setProposals(data.data);
        } else {
          setError(data.message || 'Failed to load working jobs');
        }
      } catch (error) {
        console.error('Error fetching working jobs:', error);
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingJobs();
  }, []);

  // Filter proposals to show only accepted ones
  const acceptedProposals = proposals.filter(proposal => proposal.status === 'accepted');

  return (
    <div className="p-6 max-w-4xl mx-auto bg-blue-300 rounded-lg shadow-md">
      <div className='flex flex-row justify-between'>
        <h2 className="text-2xl font-bold mb-4">Your Working Jobs</h2>
        <Button className='bg-blue-600 hover:bg-blue-700'>
          <Link href="/jobs/open" className="text-white">
            Find More Jobs
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading working jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : acceptedProposals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don&apos;t have any working jobs at the moment.</p>
          <Button className='bg-blue-600 hover:bg-blue-700'>
            <Link href="/jobs/open" className="text-white">
              Browse Available Jobs
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedProposals.map((proposal) => (
            <div key={proposal._id} className="bg-white shadow p-4 rounded-lg border">
              <div className="flex flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-blue-700">
                      {proposal.job?.title || 'Job No Longer Available'}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Progress
                    </span>
                  </div>

                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 You&apos;re working on this project! Keep up the great work.
                    </p>
                  </div>

                  <p className="text-gray-700 mt-2">{proposal.message}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                    <div>
                      <span className="font-medium">Your Pay:</span>
                      <br />
                      <span className="text-lg font-bold text-green-600">${proposal.proposedAmount}</span>
                    </div>
                    <div>
                      <span className="font-medium">Estimated Days:</span>
                      <br />
                      <span className="text-lg font-bold text-blue-600">{proposal.estimatedDays}</span>
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span>
                      <br />
                      <span className="text-sm text-gray-700">
                        {proposal.job?.deadline 
                          ? new Date(proposal.job.deadline).toLocaleDateString()
                          : 'Not specified'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Started on {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                  
                  {!proposal.job && (
                    <p className="text-xs text-red-500 mt-1">
                      Note: The job associated with this proposal may have been deleted or is no longer available.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {proposal.job && (
                    <Button asChild>
                      <Link
                        href={`/jobs/${proposal.job.jobId}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View Job Details
                      </Link>
                    </Button>
                  )}
                  
                  
                  <Button asChild>
                    <Link
                      href={`/projects/${proposal.proposalId}`}
                      className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Project chat
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}