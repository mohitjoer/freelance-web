'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
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
  acceptedProposalId?: string;
}

export default function JobFinished() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'completed' | 'cancelled'>('completed');

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchFinishedJobs = async () => {
      try {
        const res = await fetch('/api/user/client-jobs');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to load finished jobs');
        }
      } catch {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedJobs();
  }, [isLoaded, user]);

  // Filter jobs based on status
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const cancelledJobs = jobs.filter(job => job.status === 'cancelled');
  const currentJobs = activeTab === 'completed' ? completedJobs : cancelledJobs;

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-green-50 text-green-700 border border-green-200',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
          message: 'This job has been completed successfully!',
          messageBg: 'bg-green-50 border-green-200 text-green-700'
        };
      case 'cancelled':
        return {
          color: 'bg-red-50 text-red-700 border border-red-200',
          icon: CancelIcon,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
          message: 'This job was cancelled.',
          messageBg: 'bg-red-50 border-red-200 text-red-700'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border border-gray-200',
          icon: CheckCircleIcon,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100',
          message: 'Job status updated.',
          messageBg: 'bg-gray-50 border-gray-200 text-gray-700'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">Loading finished jobs...</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finished Jobs</h1>
              <p className="mt-2 text-gray-600">Review your completed and cancelled projects</p>
            </div>
            <Link href="/jobs/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                <AddIcon className="w-5 h-5" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  Completed ({completedJobs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cancelled'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CancelIcon className="w-4 h-4" />
                  Cancelled ({cancelledJobs.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {currentJobs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <AssignmentTurnedInIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} jobs found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeTab === 'completed' 
                  ? "You don't have any completed jobs yet. Your finished projects will appear here."
                  : "You don't have any cancelled jobs. This section shows jobs that were cancelled before completion."
                }
              </p>
              <Link href="/jobs/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                  Create New Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentJobs.map((job, index) => {
                const statusConfig = getStatusConfig(job.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={job._id} 
                    className={`p-6 hover:bg-gray-50 transition-colors ${index === 0 ? 'rounded-t-xl' : ''} ${index === currentJobs.length - 1 ? 'rounded-b-xl' : ''}`}
                  >
                    {/* Job Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">{job.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            <StatusIcon className={`w-4 h-4 mr-1 ${statusConfig.iconColor}`} />
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                        
                        {/* Status Message */}
                        <div className={`p-3 rounded-lg border ${statusConfig.messageBg}`}>
                          <p className="text-sm font-medium">
                            {activeTab === 'completed' ? '✅' : '❌'} {statusConfig.message}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex gap-2">
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}