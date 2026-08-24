'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface Freelancer {
  freelancerId?: string; // From API response
  userId?: string;       // From API response
  name: string;
  image?: string;
  email?: string;
  rating?: number;
  completedProjects?: number;
  skills?: string[];
  bio?: string;
  memberSince?: string;
}

export interface Proposal {
  _id?: string;
  jobId?: string;
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
  createdAt?: string;
  freelancerId: Freelancer | string;
  status?: 'pending' | 'accepted' | 'rejected';
  deliverables?: string[];
  coverLetter?: string;
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={`item-${i}`} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
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

const getFreelancerId = (freelancer: Freelancer) => {
  return freelancer.freelancerId || freelancer.userId || '';
};

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

interface ProposalCardProps {
  proposal: Proposal;
  onAction: (proposal: Proposal, action: 'accept' | 'reject') => void;
}

export default function ProposalCard({ proposal, onAction }: ProposalCardProps) {
  const freelancer = typeof proposal.freelancerId === 'object' && proposal.freelancerId !== null
    ? proposal.freelancerId
    : ({ name: 'Unknown Freelancer' } as Freelancer);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getFreelancerId(freelancer) ? (
              <Link href={`/profile/${getFreelancerId(freelancer)}`}>
                <div className="relative">
                  <Image
                    src={freelancer?.image || '/api/placeholder/48/48'}
                    alt={freelancer?.name || 'Unknown Freelancer'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                  />
                  {freelancer?.rating && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {freelancer.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="relative">
                <Image
                  src={freelancer?.image || '/api/placeholder/48/48'}
                  alt={freelancer?.name || 'Unknown Freelancer'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                />
                {freelancer?.rating && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {freelancer.rating.toFixed(1)}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1">
              {getFreelancerId(freelancer) ? (
                <Link href={`/profile/${getFreelancerId(freelancer)}`}>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                    {freelancer?.name || 'Unknown Freelancer'}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {freelancer?.name || 'Unknown Freelancer'}
                </h3>
              )}
              <div className="flex items-center space-x-3 text-sm">
                {freelancer?.completedProjects && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{freelancer.completedProjects} completed</span>
                  </div>
                )}
                {freelancer?.rating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(freelancer.rating))}
                    <span className="text-gray-600">({freelancer.rating.toFixed(1)})</span>
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
              {shortDateFormatter.format(new Date(proposal.createdAt ?? 0))}
            </p>
          </div>
        </div>

        {/* Skills */}
        {freelancer?.skills && freelancer.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {freelancer.skills.slice(0, 4).map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-2 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                >
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                  +{freelancer.skills.length - 4}
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
              onClick={() => onAction(proposal, 'accept')}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 font-medium shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Accept</span>
            </button>
            <button
              onClick={() => onAction(proposal, 'reject')}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-rose-700 transition duration-200 font-medium shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-1"
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
  );
}
