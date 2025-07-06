'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from '../ui/button';

interface Job {
  jobId: string;
  clientId: string;
  freelancerId: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  acceptedProposalId?: string;
}

export default function JobFinished() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchFinishedJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load finished jobs');
        }
      } catch {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedJobs();
  }, [isLoaded, user]);

  // Filter jobs to show only those with "completed" status
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <main className="w-full mx-auto p-6 bg-green-300 shadow-md rounded">
      {loading ? (
        <p>Loading finished jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Finished Jobs</h2>
            <Link href="/jobs/create">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                + New Job
              </button>
            </Link>
          </div>

          {completedJobs.length === 0 ? (
            <p className="text-gray-600">You don&apos;t have any finished jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {completedJobs.map((job) => (
                <div key={job._id} className="p-4 border-neutral-300 rounded-xl bg-white shadow-sm shadow-white hover:scale-101">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <span className="text-sm font-semibold capitalize text-green-600">
                      {job.status}
                    </span>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between'>
                    <div className='flex gap-2 flex-row items-center'>
                      <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
                      <p className="text-sm text-gray-500">Deadline: {new Date(job.deadline).toDateString()}</p>
                      <p className="text-xs text-gray-400">Started: {new Date(job.createdAt).toLocaleString()}</p>
                    </div>
                    
                    <div className='flex gap-2 flex-row items-center'>
                      <Link href={`/jobs/${job.jobId}`}>
                        <Button variant={'outline'} className="text-blue-600 text-sm border-2 hover:text-blue-800">
                          <VisibilityIcon className="mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      ✅ This job has been completed successfully!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}