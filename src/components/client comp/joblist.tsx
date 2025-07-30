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
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
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
          // Filter to only show open jobs
          const openJobs = data.data.filter((job: Job) => job.status.toLowerCase() === 'open');
          setJobs(openJobs);
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
        // Remove the cancelled job from the list since we only show open jobs
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">Loading your open jobs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Open Jobs</h1>
              <p className="mt-2 text-gray-600">Manage and track your active job postings</p>
            </div>
            <Link href="/jobs/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                <AddIcon className="w-5 h-5" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {jobs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <WorkOutlineIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No open jobs found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You don&apos;t have any open jobs at the moment. Create your first job posting to start receiving proposals from talented professionals.
              </p>
              <Link href="/jobs/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                  Create Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <div 
                  key={job._id} 
                  className={`p-6 hover:bg-gray-50 transition-colors ${index === 0 ? 'rounded-t-xl' : ''} ${index === jobs.length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  {/* Job Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">{job.title}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                          Open
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{job.discription}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                      <Link href={`/jobs/edit/${job.jobId}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          <EditOutlinedIcon className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors"
                          >
                            <CancelOutlinedIcon className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 bg-white">
                          <div className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Cancel Job Posting</h4>
                            <p className="text-gray-600 text-sm mb-4">
                              Are you sure you want to cancel this job? This action cannot be undone and all proposals will be rejected.
                            </p>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleCancel(job.jobId)}
                                className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                size="sm"
                              >
                                Yes, Cancel Job
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Link href={`/jobs/${job.jobId}`}>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                          size="sm"
                        >
                          View Proposals
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <AttachMoneyIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Budget</p>
                        <p className="text-gray-900 font-semibold">${job.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarTodayIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Deadline</p>
                        <p className="text-gray-900 font-semibold">{new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <AccessTimeIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Posted</p>
                        <p className="text-gray-900 font-semibold">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <WorkOutlineIcon className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Category</p>
                        <p className="text-gray-900 font-semibold capitalize">{job.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}