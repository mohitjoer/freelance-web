"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

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
        // Remove the deleted proposal from the list
        setProposals(prev => prev.filter(p => p.proposalId !== proposalId));
        setSuccessMessage('Proposal deleted successfully.');
        setFailureMessage('');
        
        // Clear success message after 3 seconds
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Proposals</h2>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {failureMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {failureMessage}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t submitted any proposals yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="bg-white shadow p-4 rounded-lg border">
              <div className="flex flex-row justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Job: {proposal.job?.title || 'Job No Longer Available'}
                  </h3>
                  <p className="text-gray-700 mt-2">{proposal.message}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    Amount: <strong>${proposal.proposedAmount}</strong> | Estimated Days: <strong>{proposal.estimatedDays}</strong>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                  {!proposal.job && (
                    <p className="text-xs text-red-500 mt-1">
                      Note: The job associated with this proposal may have been deleted or is no longer available.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {proposal.job && (
                    <Button asChild>
                      <a
                        href={`/jobs/${proposal.job._id}`}
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      >
                        View Job
                      </a>
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 border-red-500 hover:bg-red-50"
                    onClick={() => handleDeleteProposal(proposal.proposalId, proposal.job?.jobId || '')}
                    disabled={deletingProposalId === proposal.proposalId || !proposal.job?.jobId}
                  >
                    {deletingProposalId === proposal.proposalId ? 'Deleting...' : 'Delete Proposal'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}