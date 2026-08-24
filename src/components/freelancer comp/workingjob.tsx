"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import ProposalCard, { type Proposal } from './ProposalCard';

export default function WorkingJob() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchWorkingJobs = async () => {
      try {
        const res = await fetch('/api/proposals/user', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP `);
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setProposals(data.data);
        } else {
          setError(data.message || 'Failed to load working jobs');
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Error fetching working jobs:', error);
        if (!cancelled) setError('Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWorkingJobs();
    return () => {
      cancelled = true;
      controller.abort();
    };
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

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
            <div key={`item-${i}`} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
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
          {acceptedProposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              markingCompleteId={markingComplete}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
