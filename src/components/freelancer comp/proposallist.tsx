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
          // Filter to show only pending and rejected proposals
          const filteredProposals = data.data.filter(
            (proposal: Proposal) => proposal.status === 'pending' || proposal.status === 'rejected'
          );
          setProposals(filteredProposals);
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
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
            Not Selected
          </span>
        );
      default:
        return null;
    }
  };

  const canDeleteProposal = (proposal: Proposal) => {
    return (proposal.status === 'pending' || proposal.status === 'rejected') && proposal.job?.jobId;
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
          <h2 className="text-xl font-semibold text-gray-900">My Proposals</h2>
          <p className="text-sm text-gray-600 mt-1">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} awaiting response or review
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

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMessage}
        </div>
      )}
      {failureMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {failureMessage}
        </div>
      )}

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
      ) : proposals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending proposals</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don&apos;t have any proposals awaiting response. Start browsing jobs to submit new proposals.
          </p>
          <Link href="/jobs/open">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Browse Available Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {proposal.job?.title || 'Job No Longer Available'}
                      </h3>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <p className="text-sm text-gray-500">{formatTimeAgo(proposal.createdAt)}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {proposal.job && (
                      <Link href={`/jobs/${proposal.job.jobId}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Job
                        </Button>
                      </Link>
                    )}
                    
                    {canDeleteProposal(proposal) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteProposal(proposal.proposalId, proposal.job?.jobId || '')}
                        disabled={deletingProposalId === proposal.proposalId}
                      >
                        {deletingProposalId === proposal.proposalId ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                            Deleting...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {proposal.status === 'rejected' ? 'Remove' : 'Delete'}
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Status Message */}
                {proposal.status === 'rejected' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      This proposal was not selected. Keep applying to find the right match!
                    </p>
                  </div>
                )}

                {/* Proposal Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-4 h-full">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Proposal Message</h4>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {proposal.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 lg:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Proposed Amount</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(proposal.proposedAmount)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Duration</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">{proposal.estimatedDays} days</div>
                      </div>
                    </div>
                    
                    {/* Job Budget Comparison if available */}
                    {proposal.job?.budget && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Job Budget</div>
                        <div className="text-sm font-medium text-blue-900 mt-1">
                          {formatCurrency(proposal.job.budget)}
                          <span className="text-xs text-blue-600 ml-2">
                            ({proposal.proposedAmount <= proposal.job.budget ? 'Within budget' : 'Above budget'})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning for deleted jobs */}
                {!proposal.job && (
                  <div className="flex items-start gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Job No Longer Available</p>
                      <p className="text-xs mt-1">The job associated with this proposal has been removed or closed.</p>
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