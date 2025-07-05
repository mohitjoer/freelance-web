'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Skeleton } from '@/components/ui/skeleton';

interface Job {
  jobId: string;
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  createdAt: string;
}

export default function OpenJobsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs/open');
        const data = await res.json();

        if (data.success) {
          setJobs(data.data);
          setFilteredJobs(data.data);
        } else {
          setMessage(data.message);
        }
      } catch {
        setMessage('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isLoaded, user]);

  // Filter on search or category change
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = jobs.filter(
      job =>
        job.title.toLowerCase().includes(lower) ||
        job.description.toLowerCase().includes(lower) ||
        job.category.toLowerCase().includes(lower)
    ).filter(job => {
      return categoryFilter ? job.category.toLowerCase() === categoryFilter.toLowerCase() : true;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, categoryFilter, jobs]);

  const categories = [...new Set(jobs.map(job => job.category))];

  return (
    <main className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-4 flex items-center justify-center">
      <div className="w-full max-w-6xl h-[95vh] max-h-[95vh] mx-auto bg-white rounded-xl p-2 sm:p-6 shadow-md flex flex-col overflow-auto">
        <h1 className="text-2xl py-4 sm:text-3xl font-bold mb-4 text-indigo-700 text-center">Explore Open Jobs</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push('/dashboard/freelancer')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Go to Dashboard
          </button>
        </div>
        {message && <p className="text-red-500 mb-4 text-center">{message}</p>}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search jobs by title, description or category..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-400 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              tabIndex={-1}
              aria-label="Search"
            >
              <SearchOutlinedIcon />
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 text-sm w-full md:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="h-full w-full bg-white flex items-center justify-center">
            <Skeleton className="w-full h-full max-w-full max-h-full bg-gray-700 rounded-xl" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-600 text-center">No matching jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto pr-1 h-full w-full">
            {filteredJobs.map(job => (
              <div
                key={job._id}
                className="border border-gray-200 p-4 rounded-lg bg-white hover:shadow-lg transition flex flex-col"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-indigo-700 mb-1">{job.title}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">{job.category}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-2">{job.description}</p>
                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm mt-auto text-gray-600 gap-1">
                  <span>Budget: <span className="font-semibold">${job.budget}</span></span>
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => router.push(`/jobs/${job.jobId}`)}
                  className="mt-3 bg-linear-to-t from-sky-500 to-indigo-500 hover:to-indigo-300 hover:from-indigo-300 text-white hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
