'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Skeleton } from '@/components/ui/skeleton';
import BackButton from '@/components/backbutton';
import Link from 'next/link';
import Image from 'next/image';

interface Job {
  jobId: string;
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  createdAt: string;
  client: {
    clientId: string;
    name: string;
    image: string;
  };
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
        job.category.toLowerCase().includes(lower) ||
        job.client.name.toLowerCase().includes(lower)
    ).filter(job => {
      return categoryFilter ? job.category.toLowerCase() === categoryFilter.toLowerCase() : true;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, categoryFilter, jobs]);

  const categories = [...new Set(jobs.map(job => job.category))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-2 py-4 flex items-center justify-center">
      <div className="w-full max-w-7xl h-[95vh] max-h-[95vh] mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-6 shadow-xl border border-white/20 flex flex-col overflow-auto">
        <div className="flex justify-start mb-2">
          <BackButton/>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 mb-2">
            Explore Open Jobs
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover opportunities that match your skills and expertise
          </p>
        </div>
        
        {message && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-gray-50/50 p-4 rounded-xl">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by title, description, category, or client name..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm bg-white shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              tabIndex={-1}
              aria-label="Search"
            >
              <SearchOutlinedIcon />
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm w-full lg:w-auto bg-white shadow-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-80 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <SearchOutlinedIcon className="text-gray-400" style={{ fontSize: 40 }} />
              </div>
              <p className="text-gray-600 text-lg mb-2">No matching jobs found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto pr-1 h-full w-full">
            {filteredJobs.map(job => (
              <div
                key={job._id}
                className="bg-white border border-gray-100 p-6 rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-indigo-200"
              >
                {/* Client Profile Section */}
                <Link href={`/profile/${job.client.clientId}`} >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="relative">
                      <Image
                        src={job.client.image}
                        alt={job.client.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-colors"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.png';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.client.name || 'Anonymous Client'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <PersonOutlineIcon style={{ fontSize: 12 }} />
                        Client
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Job Details */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                      {job.title}
                    </h2>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                      {job.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Job Meta Information */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <AttachMoneyIcon style={{ fontSize: 16 }} />
                      {job.budget.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <CalendarTodayIcon style={{ fontSize: 14 }} />
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/jobs/${job.jobId}`)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Counter */}
        {!loading && filteredJobs.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>
        )}
      </div>
    </main>
  );
}