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

  // Filter proposals to show only accepted ones
  const acceptedProposals = proposals.filter(proposal => proposal.status === 'accepted');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Active Projects</h1>
                <p className="text-slate-300">Manage your ongoing work and deliverables</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button className="bg-white text-slate-900 hover:bg-gray-100 font-medium px-6 py-2.5 rounded-lg transition-colors">
                  <Link href="/jobs/open" className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Find New Projects
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <span className="ml-3 text-gray-600">Loading your projects...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : acceptedProposals.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Projects</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You don&apos;t have any active projects at the moment. Start browsing available opportunities to grow your portfolio.
                </p>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3 rounded-lg transition-colors">
                  <Link href="/jobs/open" className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Available Jobs
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {acceptedProposals.map((proposal) => (
                  <div key={proposal._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {proposal.job?.title || 'Job No Longer Available'}
                              </h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5"></div>
                                In Progress
                              </span>
                            </div>
                            
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium text-emerald-800">
                                  Congratulations! You&apos;re working on this project. Keep up the excellent work.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Your Proposal</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{proposal.message}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Project Value</span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">${proposal.proposedAmount}</span>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Duration</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{proposal.estimatedDays}</span>
                            <span className="text-sm text-gray-500 ml-1">days</span>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 21h18l-2-8H5l-2 8z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Deadline</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {proposal.job?.deadline 
                                ? new Date(proposal.job.deadline).toLocaleDateString()
                                : 'Not specified'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 21h18l-2-8H5l-2 8z" />
                            </svg>
                            Started on {new Date(proposal.createdAt).toLocaleDateString()}
                          </div>
                          
                          {!proposal.job && (
                            <div className="flex items-center gap-1 text-red-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Job may no longer be available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 lg:min-w-[200px]">
                        {proposal.job && (
                          <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors">
                            <Link href={`/jobs/${proposal.job.jobId}`} className="flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Job Details
                            </Link>
                          </Button>
                        )}
                        
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                          <Link href={`/projects/${proposal.proposalId}`} className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Project Chat
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}