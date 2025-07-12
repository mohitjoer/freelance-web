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

export default function Proposallist() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [deletingProposalId, setDeletingProposalId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch('/api/proposals/user');
        const data = await res.json();
        if (data.success) {
          setProposals(data.data);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleDeleteProposal = async (proposalId: string, jobId: string) => {
    if (!proposalId || !jobId) return;

    setDeletingProposalId(proposalId);
    
    try {
      const res = await fetch(
        `/api/proposal/${proposalId}?jobId=${jobId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await res.json();

      if (result.success) {
        setProposals(prev => prev.filter(p => p.proposalId !== proposalId));
        setSuccessMessage('Proposal deleted successfully.');
        setFailureMessage('');
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFailureMessage('Delete failed: ' + result.message);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      setFailureMessage('An error occurred during deletion.');
      setSuccessMessage('');
    } finally {
      setDeletingProposalId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div>
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></div>
            Unknown
          </span>
        );
    }
  };

  const canDeleteProposal = (proposal: Proposal) => {
    return proposal.status === 'pending' && proposal.job?.jobId;
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Proposals</h1>
              <p className="text-slate-600">Track and manage your job proposals</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              <Link href="/jobs/open" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Find New Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}
        {failureMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {failureMessage}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-slate-600">Loading proposals...</span>
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No proposals yet</h3>
            <p className="text-slate-600 mb-6">Start by browsing available jobs and submitting your first proposal.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              <Link href="/jobs/open">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-slate-900 flex-1">
                          {proposal.job?.title || 'Job No Longer Available'}
                        </h3>
                        {getStatusBadge(proposal.status)}
                      </div>

                      {/* Status-specific messages */}
                      {proposal.status === 'accepted' && (
                        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🎉</span>
                            <div>
                              <p className="text-sm font-semibold text-emerald-800">Congratulations!</p>
                              <p className="text-sm text-emerald-700">Your proposal has been accepted. You can start working on this project.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {proposal.status === 'rejected' && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            This proposal was not selected. Don&apos;t worry - keep applying to find the right match!
                          </p>
                        </div>
                      )}

                      {/* Proposal Details */}
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-slate-900 mb-2">Proposal Message</h4>
                        <p className="text-slate-700 leading-relaxed">{proposal.message}</p>
                      </div>

                      {/* Proposal Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm text-slate-600">Proposed Amount</div>
                          <div className="text-lg font-semibold text-slate-900">{formatCurrency(proposal.proposedAmount)}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm text-slate-600">Estimated Duration</div>
                          <div className="text-lg font-semibold text-slate-900">{proposal.estimatedDays} days</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm text-slate-600">Submitted</div>
                          <div className="text-lg font-semibold text-slate-900">{formatDate(proposal.createdAt)}</div>
                        </div>
                      </div>

                      {/* Warning for deleted jobs */}
                      {!proposal.job && (
                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span>The job associated with this proposal is no longer available.</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      {proposal.job && (
                        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                          <Link href={`/jobs/${proposal.job.jobId}`} className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Job
                          </Link>
                        </Button>
                      )}
                      
                      {proposal.status === 'accepted' && (
                        <div className="text-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-sm font-medium text-emerald-800">Active Project</p>
                          <p className="text-xs text-emerald-600">Check current jobs</p>
                        </div>
                      )}
                      
                      {canDeleteProposal(proposal) && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          onClick={() => handleDeleteProposal(proposal.proposalId, proposal.job?.jobId || '')}
                          disabled={deletingProposalId === proposal.proposalId}
                        >
                          {deletingProposalId === proposal.proposalId ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              Deleting...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Proposal
                            </div>
                          )}
                        </Button>
                      )}

                      {proposal.status === 'rejected' && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                          onClick={() => handleDeleteProposal(proposal.proposalId, proposal.job?.jobId || '')}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}