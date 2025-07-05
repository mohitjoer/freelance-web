'use client';

import { useEffect, useState } from 'react';

interface User {
  name: string;
  image?: string;
}

interface Proposal {
  _id: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
  createdAt: string;
  freelancerId: User;
}

interface ViewProposalProps {
  jobId: string;
}

export default function ViewProposal({ jobId }: ViewProposalProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(`/api/proposals/${jobId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProposals(data.data);
        } else {
          setProposals([]); // Fallback to avoid undefined
        }
      } catch (error) {
        console.error('Error fetching proposals for job:', error);
        setProposals([]); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [jobId]);

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Proposals for This Job</h2>
      {loading ? (
        <p>Loading proposals...</p>
      ) : proposals?.length === 0 ? (
        <p className="text-gray-500">No proposals submitted for this job yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="bg-white shadow-md p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-indigo-700">
                  {proposal.freelancerId?.name || 'Unknown Freelancer'}
                </h3>
                <p className="text-xs text-gray-400">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 mt-2">{proposal.message}</p>
              <div className="text-sm text-gray-600 mt-2">
                <strong>${proposal.proposedAmount}</strong> • {proposal.estimatedDays} Days
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
