'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Job {
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

  return (
    <main className="w-full mx-auto p-6 bg-neutral-300 shadow-md rounded">
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
            <p className="text-gray-600">You haven’t posted any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-4 border border-neutral-600 rounded bg-white shadow-sm">
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
                  <p className="text-sm text-gray-500 mt-1">Budget: ${job.budget}</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(job.deadline).toDateString()}</p>
                  <p className="text-xs text-gray-400">Posted: {new Date(job.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
