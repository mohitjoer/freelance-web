'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReportIcon from '@mui/icons-material/Report';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';
import { Alert, AlertTitle } from "@/components/ui/alert";

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
  startedat: Date;
}

export default function JobOngoing() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Report functionality states
  const [reportDetails, setReportDetails] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleReportUser = async (freelancerId: string, jobId: string) => {
    if (!reportDetails.trim()) {
      alert('Please provide a reason for reporting.');
      return;
    }

    try {
      const res = await fetch("/api/user/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: user?.id,
          reportedId: freelancerId,
          reason: reportDetails,
          details: reportDetails,
          jobId: jobId,
        }),
      });
      
      if (res.ok) {
        setSuccessMessage("Report submitted successfully!");
        setReportDetails('');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error('Report submission error:', error);
      alert("Server error occurred while submitting report.");
    }
  };

  const inProgressJobs = jobs.filter(job => job.status === 'in-progress');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">Loading ongoing jobs...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Ongoing Jobs</h1>
              <p className="mt-2 text-gray-600">Track and manage your active projects</p>
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
          {inProgressJobs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <WorkIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ongoing jobs</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You don&apos;t have any jobs in progress at the moment. Your completed and active projects will appear here.
              </p>
              <Link href="/jobs/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                  Create New Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {inProgressJobs.map((job, index) => (
                <div 
                  key={job._id} 
                  className={`p-6 hover:bg-gray-50 transition-colors ${index === 0 ? 'rounded-t-xl' : ''} ${index === inProgressJobs.length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  {/* Job Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">{job.title}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          In Progress
                        </span>
                      </div>
                      {job.clientMarkedComplete && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                          <HourglassEmptyIcon className="w-4 h-4" />
                          Waiting for freelancer to confirm completion
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                      <Link href={`/room/${job.jobId}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          <ChatOutlinedIcon className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      
                      {job.clientMarkedComplete ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                          className="border-gray-300 text-gray-500 cursor-not-allowed"
                        >
                          <HourglassEmptyIcon className="w-4 h-4 mr-2" />
                          Pending Confirmation
                        </Button>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors"
                            >
                              <CheckCircleOutlineIcon className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0 bg-white">
                            <div className="p-6">
                              <h4 className="font-semibold text-gray-900 mb-2">Mark Job Complete</h4>
                              <p className="text-gray-600 text-sm mb-4">
                                Are you sure you want to mark this job as completed? The freelancer will need to confirm completion before payment is released.
                              </p>
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleMarkComplete(job.jobId)}
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                  size="sm"
                                >
                                  Yes, Mark Complete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors"
                          >
                            <ReportIcon className="w-4 h-4 mr-2" />
                            Report User
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0 bg-white">
                          <div className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Report Freelancer</h4>
                            
                            {successMessage && (
                              <Alert className="mb-4 border-green-200 bg-green-50">
                                <AlertTitle className="text-green-800">{successMessage}</AlertTitle>
                              </Alert>
                            )}
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for reporting *
                              </label>
                              <textarea
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                placeholder="Provide the reason and context for reporting this freelancer..."
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={() => handleReportUser(job.freelancerId, job.jobId)}
                                className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                size="sm"
                                disabled={!reportDetails.trim()}
                              >
                                Submit Report
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-3">
                              Reports are reviewed by our team and this job will be marked as Cancelled. False reports may result in account restrictions.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Link href={`/jobs/${job.jobId}`}>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                          size="sm"
                        >
                          <VisibilityIcon className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <p className="text-gray-500 font-medium">Started</p>
                        <p className="text-gray-900 font-semibold">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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