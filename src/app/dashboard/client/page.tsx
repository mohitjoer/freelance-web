'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Example fetch (replace with real API call)
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs/client'); // Adjust endpoint
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    if (user) fetchJobs();
  }, [user]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Dashboard</h1>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Your Posted Jobs</h2>
            <Link
              href="/dashboard/client/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Post New Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <p className="text-gray-600">You haven’t posted any jobs yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
