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
  clientMarkedComplete?: boolean;
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
    const res = await fetch(`/api/job/${jobId}/confirm-completion`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        role: 'client' 
      }),
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

  const inProgressJobs = jobs.filter(job => job.status === 'in-progress');

  return (
    <main className="w-full mx-auto p-4 sm:p-6 bg-gradient-to-b from-yellow-300 to-orange-300 shadow-md rounded-lg">
      {loading ? (
        <p className="text-center">Loading ongoing jobs...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">Your Ongoing Jobs</h2>
            <Link href="/jobs/create">
              <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full sm:w-auto">
                + New Job
              </button>
            </Link>
          </div>

          {inProgressJobs.length === 0 ? (
            <p className="text-gray-600 text-center">You don&apos;t have any ongoing jobs at the moment.</p>
          ) : (
            <div className="space-y-4">
              {inProgressJobs.map((job) => (
                <div key={job._id} className="p-4 border-neutral-300 rounded-xl bg-white shadow-sm shadow-white hover:scale-101 transition-transform">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                    <h3 className="text-lg font-bold break-words">{job.title}</h3>
                    <span className="text-sm font-semibold capitalize text-yellow-600 self-start sm:self-center">
                      {job.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                      <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
                      <p className="text-sm text-gray-500">Deadline: {new Date(job.deadline).toDateString()}</p>
                      <p className="text-xs text-gray-400">Started: {new Date(job.createdAt).toLocaleString()}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 w-full sm:w-auto"
                      >
                        Chat with Freelancer
                      </Button>

                      { job.clientMarkedComplete === true ? (
                        <p className="text-gray-500 border-gray-200 w-full sm:w-auto flex text-center justify-center"                        >
                          Waiting for Freelancer to mark complete.
                        </p>
                      ) : (
                        
                    
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 w-full sm:w-auto"
                          >
                            <CheckCircleOutlineIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">Mark Complete</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-white w-fit p-4 shadow-lg">
                          <p className="mb-3 text-sm text-gray-700">Are you sure you want to mark this job as completed?</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleMarkComplete(job.jobId)}
                            >
                              Yes, Complete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                        )}
                      <Link href={`/jobs/${job.jobId}`}>
                        <Button
                          variant={'outline'}
                          className="text-blue-600 text-sm border-2 hover:text-blue-800 w-full sm:w-auto"
                        >
                          <VisibilityIcon className="mr-1 flex-shrink-0" />
                          <span className="truncate">View Details</span>
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
