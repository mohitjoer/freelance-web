'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
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

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BackButton/>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                  alt="FreeLanceBase Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FreeLanceBase</h1>
                  <p className="text-xs text-gray-500">Professional Freelance Network</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <WorkOutlineIcon className="text-blue-600" style={{ fontSize: 18 }} />
                <span className="font-medium">{jobs.length} Open Positions</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title  */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Open Jobs
          </h2>
        </div>

        {message && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title, description, category, or client name..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchOutlinedIcon className="text-gray-400" style={{ fontSize: 20 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Summary */}
          {!loading && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {searchQuery || categoryFilter ? (
                  <>Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of <span className="font-semibold text-gray-900">{jobs.length}</span> jobs</>
                ) : (
                  <>Displaying all <span className="font-semibold text-gray-900">{jobs.length}</span> available jobs</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchOutlinedIcon className="text-gray-400" style={{ fontSize: 40 }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn&apos;t find any jobs matching your search criteria. Try adjusting your filters or search terms.
            </p>
            {(searchQuery || categoryFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
              >
                {/* Client Profile Section */}
                <Link href={`/profile/${job.client.clientId}`} className="block mb-4">
                  <div className="flex items-center space-x-3 p-3 -m-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={job.client.image}
                        alt={job.client.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.png';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {job.client.name || 'Anonymous Client'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <PersonOutlineIcon style={{ fontSize: 12 }} />
                        Verified Client
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Job Details */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {job.title}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                    {job.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {job.description}
                </p>

                {/* Job Meta Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                      <AttachMoneyIcon style={{ fontSize: 16 }} />
                      <span>${job.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <CalendarTodayIcon style={{ fontSize: 14 }} />
                      <span>{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/jobs/${job.jobId}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}