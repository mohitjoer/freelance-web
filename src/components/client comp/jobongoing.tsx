'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

export default function JobOngoing() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOngoingJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load ongoing jobs');
        }
      } catch {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingJobs();
  }, [isLoaded, user]);

  const handleMarkComplete = async (jobId: string) => {
    try {
      const res = await fetch(`/api/job/${jobId}/complete`, {
        method: "PATCH",
      });

      const result = await res.json();

      if (result.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === jobId ? { ...job, status: "completed" } : job
          )
        );
      } else {
        alert(result.message || "Failed to mark job as complete.");
      }
    } catch (err) {
      console.error("Complete job error:", err);
      alert("Server error.");
    }
  };

  // Filter jobs to show only those with "in-progress" status
  const inProgressJobs = jobs.filter(job => job.status === 'in-progress');

  return (
    <main className="w-full mx-auto p-6 bg-yellow-300 shadow-md rounded">
      {loading ? (
        <p>Loading ongoing jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Ongoing Jobs</h2>
            <Link href="/jobs/create">
              <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                + New Job
              </button>
            </Link>
          </div>

          {inProgressJobs.length === 0 ? (
            <p className="text-gray-600">You don&apos;t have any ongoing jobs at the moment.</p>
          ) : (
            <div className="space-y-4">
              {inProgressJobs.map((job) => (
                <div key={job._id} className="p-4 border-neutral-300 rounded-xl bg-white shadow-sm shadow-white hover:scale-101">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <span
                      className={`text-sm font-semibold capitalize text-yellow-600`}
                    >
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
                      <Popover>
                        <PopoverTrigger className='text-green-600'>
                          <CheckCircleOutlineIcon/>
                        </PopoverTrigger>
                        <PopoverContent className="bg-white w-fit h-fit">
                          <p>Mark this job as completed?</p>
                          <button
                            onClick={() => handleMarkComplete(job.jobId)}
                            className="text-sm px-3 py-1 mt-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            Mark Complete
                          </button>
                        </PopoverContent>
                      </Popover>
                      
                      <Link href={`/jobs/${job.jobId}`}>
                        <Button variant={'outline'} className="text-blue-600 text-sm border-2 hover:text-blue-800">
                          <VisibilityIcon className="mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
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