'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
  name: string;
  image?: string;
  email?: string;
  rating?: number;
  completedProjects?: number;
  skills?: string[];
  location?: string;
  memberSince?: string;
}

interface Proposal {
  _id: string;
  jobId: string;
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
  createdAt: string;
  freelancerId: User;
  status?: 'pending' | 'accepted' | 'rejected';
  deliverables?: string[];
  coverLetter?: string;
}

interface ViewProposalProps {
  jobId: string;
}

export default function ViewProposal({ jobId }: ViewProposalProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'amount' | 'days' | 'rating' | 'date'>('date');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(`/api/proposals/${jobId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProposals(data.data);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error('Error fetching proposals for job:', error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [jobId]);

  const sortedProposals = [...proposals].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return a.proposedAmount - b.proposedAmount;
      case 'days':
        return a.estimatedDays - b.estimatedDays;
      case 'rating':
        return (b.freelancerId?.rating || 0) - (a.freelancerId?.rating || 0);
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleProposalAction = async (proposal: Proposal, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/action-proposal/${proposal.proposalId}/${action}?jobId=${proposal.jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobId,
          proposalId: proposal.proposalId
        })
      });
      
      if (res.ok) {
        setProposals(prev => 
          prev.map(p => 
            p._id === proposal._id 
              ? { ...p, status: action === 'accept' ? 'accepted' : 'rejected' }
              : p
          )
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing proposal:`, error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/5"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Received Proposals
              </h1>
              <p className="text-gray-600 text-sm">{proposals.length} proposals to review</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'amount' | 'days' | 'rating' | 'date')}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 shadow-md text-sm"
              >
                <option value="date">📅 Recent First</option>
                <option value="amount">💰 Lowest Price</option>
                <option value="days">⏱️ Fastest Delivery</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">No proposals yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Your job posting is live! Talented freelancers will start submitting proposals soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedProposals.map((proposal) => (
              <div
                key={proposal._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={proposal.freelancerId?.image || '/api/placeholder/48/48'}
                          alt={proposal.freelancerId?.name || 'Unknown Freelancer'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                        />
                        {proposal.freelancerId?.rating && (
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                            {proposal.freelancerId.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {proposal.freelancerId?.name || 'Unknown Freelancer'}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm">
                          {proposal.freelancerId?.completedProjects && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{proposal.freelancerId.completedProjects} completed</span>
                            </div>
                          )}
                          {proposal.freelancerId?.rating && (
                            <div className="flex items-center space-x-1">
                              {renderStars(Math.round(proposal.freelancerId.rating))}
                              <span className="text-gray-600">({proposal.freelancerId.rating.toFixed(1)})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(proposal.status)}`}>
                        {proposal.status || 'pending'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {proposal.freelancerId?.skills && proposal.freelancerId.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {proposal.freelancerId.skills.slice(0, 4).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {proposal.freelancerId.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                            +{proposal.freelancerId.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Proposal Message */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-2">{proposal.message}</p>
                  </div>

                  {/* Pricing and Timeline */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-700">
                        ${proposal.proposedAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">Total Cost</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-700">
                        {proposal.estimatedDays}
                      </div>
                      <div className="text-xs text-blue-600">Estimated Days</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(!proposal.status || proposal.status === 'pending') && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleProposalAction(proposal, 'accept')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleProposalAction(proposal, 'reject')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}