"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
  
interface Job {
    _id: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    status:string;
    budget: number;
    clientMarkedComplete?: boolean;
    freelancerMarkedComplete?: boolean;
    deadline: Date;
}

interface Proposal {
    _id: string;
    proposalId: string;
    jobId: string;
    freelancerId: string;
    message: string;
    proposedAmount: number;
    estimatedDays: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    job: Job | null;
}

export default function WorkingJob() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkingJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user');
        const data = await res.json();
        if (data.success) {
          setProposals(data.data);
        } else {
          setError(data.message || 'Failed to load working jobs');
        }
      } catch (error) {
        console.error('Error fetching working jobs:', error);
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingJobs();
  }, []);

  const handleMarkComplete = async (jobId: string) => {
    setMarkingComplete(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}/confirm-completion`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          role: 'freelancer' 
        }),
      });

      const result = await res.json();

      if (result.success) {
        setProposals((prev: Proposal[]) =>
          prev.map((proposal) =>
            proposal.job?.jobId === jobId 
              ? { 
                  ...proposal, 
                  job: proposal.job ? { 
                    ...proposal.job, 
                    freelancerMarkedComplete: true 
                  } : null 
                } 
              : proposal
          )
        );
      } else {
        alert(result.message || "Failed to mark job as complete.");
      }
    } catch (err) {
      console.error("Complete job error:", err);
      alert("Server error.");
    } finally {
      setMarkingComplete(null);
    }
  };

  // Filter proposals to show only accepted ones with job status "in-progress"
  const acceptedProposals = proposals.filter(proposal => 
    proposal.status === 'accepted' && 
    proposal.job && 
    proposal.job.status === 'in-progress'
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
          <p className="text-sm text-gray-600 mt-1">
            {acceptedProposals.length} active project{acceptedProposals.length !== 1 ? 's' : ''} in progress
          </p>
        </div>
        <Link href="/jobs/open">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Find New Projects
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>
              <div className="h-20 bg-gray-100 rounded-lg mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Projects</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Again
          </Button>
        </div>
      ) : acceptedProposals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don&apos;t have any active projects at the moment. Start browsing available opportunities to grow your portfolio.
          </p>
          <Link href="/jobs/open">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Browse Available Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedProposals.map((proposal) => {
            
            
            return (
              <div key={proposal._id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {proposal.job?.title || 'Job No Longer Available'}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          In Progress
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Started {formatDate(proposal.createdAt)}</p>
                    </div>
                    
                    
                    
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <div className="lg:col-span-2">
                      <div className="bg-gray-50 rounded-lg p-4 h-full">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Project Overview</h4>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {proposal.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 lg:col-span-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Project Value</span>
                          </div>
                          <div className="text-lg font-semibold text-green-600">{formatCurrency(proposal.proposedAmount)}</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Duration</span>
                          </div>
                          <div className="text-lg font-semibold text-blue-600">{proposal.estimatedDays} days</div>
                        </div>
                      </div>
                      
                      {/* Project Category */}
                      {proposal.job?.category && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Category</div>
                          <div className="text-sm font-medium text-blue-900 mt-1 capitalize">
                            {proposal.job.category}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {proposal.job && (
                      <Link href={`/jobs/${proposal.job.jobId}`} className="flex-1">
                        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Job Details
                        </Button>
                      </Link>
                    )}
                    
                    <Link href={`/room/${proposal.jobId}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Project Chat
                      </Button>
                    </Link>

                    {/* Completion Status */}
                    {proposal.job?.freelancerMarkedComplete === true ? (
                      <div className="flex-1 flex items-center justify-center p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-amber-700">
                          Awaiting Client Approval
                        </span>
                      </div>
                    ) : (
                      proposal.job && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                              disabled={markingComplete === proposal.job.jobId}
                            >
                              {markingComplete === proposal.job.jobId ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                  Marking Complete...
                                </>
                              ) : (
                                <>
                                  <CheckCircleOutlineIcon className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 bg-white">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Mark Project Complete</h4>
                              <p className="text-sm text-gray-600">
                                Are you sure you want to mark this project as completed? This will notify the client for final approval.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleMarkComplete(proposal.job!.jobId)}
                                  disabled={markingComplete === proposal.job!.jobId}
                                >
                                  Yes, Complete Project
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )
                    )}
                  </div>

                  {/* Warning for deleted jobs */}
                  {!proposal.job && (
                    <div className="mt-4 flex items-start gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="font-medium">Job No Longer Available</p>
                        <p className="text-xs mt-1">The job associated with this project has been removed or closed.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}