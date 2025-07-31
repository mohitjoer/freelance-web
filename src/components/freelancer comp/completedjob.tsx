"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Job {
    _id: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: Date;
    clientId: string;
}

interface Proposal {
    _id: string;
    jobId: string;
    freelancerId: string;
    proposedAmount: number;
    status: 'completed';
    createdAt: string;
    updatedAt: string;
    rating?: number;
    feedback?: string;
    job: Job | null;
}

interface CompletedJobData {
    _id: string;
    jobId: string;
    freelancerId: string;
    startDate: string;
    completedDate: string;
    finalAmount: number;
    rating?: number;
    feedback?: string;
    status: 'completed';
    job: Job | null;
}

export default function CompletedJob() {
  const [completedJobs, setCompletedJobs] = useState<CompletedJobData[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user');
        const data = await res.json();
        if (data.success) {
          // Filter to show only accepted proposals (completed jobs)
          const acceptedProposals = data.data.filter(
            (proposal: Proposal) => proposal.status === 'completed'
          );
          
          // Transform proposals to completed jobs format
          const transformedJobs = acceptedProposals.map((proposal: Proposal) => ({
            _id: proposal._id,
            jobId: proposal.jobId,
            freelancerId: proposal.freelancerId,
            startDate: proposal.createdAt, 
            completedDate: proposal.updatedAt || proposal.createdAt,
            finalAmount: proposal.proposedAmount,
            rating: proposal.rating || undefined,
            feedback: proposal.feedback || undefined,
            status: 'completed',
            job: proposal.job
          }));
          
          setCompletedJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching completed jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Completed Jobs</h2>
          <p className="text-sm text-gray-600 mt-1">
            {completedJobs.length} job{completedJobs.length !== 1 ? 's' : ''} completed successfully
          </p>
        </div>
        <Link href="/jobs/open">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Find New Jobs
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-20 bg-gray-100 rounded-lg mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
                <div className="h-16 bg-gray-100 rounded-lg"></div>
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : completedJobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No completed jobs yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven&apos;t completed any jobs yet. Start working on active projects to build your portfolio and track record.
          </p>
          <Link href="/jobs/open">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Browse Available Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completedJobs.map((completedJob) => (
            <div key={completedJob._id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {completedJob.job?.title || 'Job No Longer Available'}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{formatTimeAgo(completedJob.completedDate)}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {completedJob.job && (
                      <Link href={`/jobs/${completedJob.job.jobId}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Job
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Success Message */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    🎉 Congratulations! You successfully completed this project .
                  </p>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                  {/* Project Description */}
                  <div className="lg:col-span-2">
                    {completedJob.job?.description ? (
                      <div className="bg-gray-50 rounded-lg p-4 h-full">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Project Description</h4>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {completedJob.job.description}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
                        <p className="text-sm text-gray-500">Description not available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 lg:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Final Amount</div>
                        <div className="text-lg font-semibold text-green-600 mt-1">{formatCurrency(completedJob.finalAmount)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Started</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">{formatDate(completedJob.startDate)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Completed</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">{formatDate(completedJob.completedDate)}</div>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Feedback Section */}
                {completedJob.feedback && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Client Feedback</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {completedJob.feedback}
                    </p>
                  </div>
                )}

                {/* Warning for deleted jobs */}
                {!completedJob.job && (
                  <div className="flex items-start gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Job No Longer Available</p>
                      <p className="text-xs mt-1">The job associated with this completion has been removed, but your completion record remains.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}