'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Job {
  jobId: string;
  clientId: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
}

export default function ClientJobList() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load jobs');
        }
      } catch {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isLoaded, user]);

  const handleCancel = async (jobId: string) => {
    try {
      const res = await fetch(`/api/job/${jobId}/cancel`, {
        method: "PATCH",
      });

      const result = await res.json();

      if (result.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job.jobId === jobId ? { ...job, status: "cancelled" } : job
          )
        );
      } else {
        alert(result.message || "Failed to cancel job.");
      }
    } catch (err) {
      console.error("Cancel job error:", err);
      alert("Server error.");
    }
  };

  return (
    <main className="w-full mx-auto p-6 bg-blue-300 shadow-md rounded">
      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
            <Link href="/jobs/create">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + New Job
              </button>
            </Link>
          </div>

          {jobs.length === 0 ? (
            <p className="text-gray-600">You haven't posted any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-4  border-neutral-300 rounded-xl bg-white shadow-sm shadow-white hover:scale-101">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <span
                      className={`text-sm font-semibold capitalize ${
                        job.status === 'open'
                          ? 'text-green-600'
                          : job.status === 'in-progress'
                          ? 'text-yellow-600'
                          : job.status === 'completed'
                          ? 'text-blue-600'
                          : 'text-red-500'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between'>
                    <div className='flex gap-2 flex-row items-center '>
                      <p className="text-sm text-gray-500 ">Budget: ${job.budget}</p>
                      <p className="text-sm text-gray-500">Deadline: {new Date(job.deadline).toDateString()}</p>
                      <p className="text-xs text-gray-400">Posted: {new Date(job.createdAt).toLocaleString()}</p>
                    </div>
                    <div className='flex gap-2 flex-row items-center'>
                      {job.status !== 'cancelled' && (
                      <Link href={`/jobs/edit/${job.jobId}`}>
                        <button className="text-blue-600 text-sm underline hover:text-blue-800">
                          <EditOutlinedIcon/>
                        </button>
                      </Link>
                      )}
                      {job.status === 'open' && (
                        <div>
                            <Link href={`/jobs/${job.jobId}`}>
                              <button className="text-blue-600 text-sm underline hover:text-blue-800">
                                View Proposals
                              </button>
                            </Link>
                            <Popover>
                              <PopoverTrigger className='text-red-600'><CancelOutlinedIcon/></PopoverTrigger>
                              <PopoverContent className="bg-white w-fit h-fit">
                                <p>Are you sure you want to Cancel this job.</p>
                                <button
                                  onClick={() => handleCancel(job.jobId)}
                                  className="text-sm px-3 py-1 mt-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                  Cancel Job
                                </button>
                                </PopoverContent>
                              </Popover>
                          </div>
                        )}
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