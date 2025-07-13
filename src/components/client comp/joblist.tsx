'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';

interface Job {
  jobId: string;
  clientId: string;
  discription: string;
  category: string;
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your jobs...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center px-4">
              <div className="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">⚠️</div>
              <p className="text-red-600 font-semibold text-base sm:text-lg mb-2">Something went wrong</p>
              <p className="text-gray-600 text-sm sm:text-base break-words">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-tl from-cyan-500 to-blue-500 rounded-lg p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col mb-4 sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">            
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Job Management</h1>
          <Link href="/jobs/create" className="block w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
              <AddIcon className="w-4 h-4" />
                <span className="hidden xs:inline">Post New Job</span>
                <span className="xs:hidden">New Job</span>
            </Button>
          </Link>
        </div>
          
       

        {/* Jobs Section */}
        <div>

          <div className="p-4 sm:p-6 md:p-8">
            {jobs.length === 0 ? (
              <div className="text-center py-8 sm:py-12 md:py-16">
                <div className="text-gray-300 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📋</div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">Get started by posting your first job and finding the right talent.</p>
                <Link href="/jobs/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {jobs.map((job) => (
                  <div 
                    key={job._id} 
                    className="border border-gray-200 rounded-xl p-2 sm:p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    {/* Job Header */}
                    <div className="flex flex-col gap-1 mb-1 sm:mb-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 break-words">{job.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(job.status)}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {job.status === 'open' && (
                          <div className="flex flex-col xs:flex-row gap-1 sm:gap-2 w-full sm:w-auto">
                            <Link href={`/jobs/edit/${job.jobId}`} className="w-full xs:w-auto">
                              <Button variant="outline" className="w-full xs:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs py-1 px-2 sm:py-2 sm:px-3">
                                <EditOutlinedIcon className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full xs:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs py-1 px-2 sm:py-2 sm:px-3">
                                  <CancelOutlinedIcon className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72 sm:w-80 mx-2">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Cancel Job</h4>
                                <p className="text-gray-600 mb-4 text-xs sm:text-sm">Are you sure you want to cancel this job? This action cannot be undone.</p>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleCancel(job.jobId)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors flex-1 text-xs sm:text-sm"
                                  >
                                    Yes, Cancel Job
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                            
                            <Link href={`/jobs/${job.jobId}`} className="w-full xs:w-auto">
                              <Button className="w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-xs">
                                <span className="hidden sm:inline">View Proposals</span>
                                <span className="sm:hidden">Proposals</span>
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600 min-w-0">
                        <AttachMoneyIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium flex-shrink-0">Budget:</span>
                        <span className="text-gray-900 font-semibold truncate">${job.budget.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600 min-w-0">
                        <CalendarTodayIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium flex-shrink-0">Deadline:</span>
                        <span className="text-gray-900 truncate">{new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600 min-w-0">
                        <AccessTimeIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium flex-shrink-0">Posted:</span>
                        <span className="text-gray-900 truncate">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}