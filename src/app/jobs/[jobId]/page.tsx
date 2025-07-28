'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import ViewProposal from '@/components/jobs id comp/viewproposal'; 
import BackButton from '@/components/backbutton';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';

interface Job {
  _id: string;
  jobId: string;
  clientId: string;
  title: string;
  status: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  createdAt: string;
  references?: string[];
  resources?: string[];
  client?: {
    name: string;
    image: string;
  };
}

interface Proposal {
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
}

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job?.jobId || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setFailureMessage('');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const message = formData.get('message') as string;
    const proposedAmount = formData.get('proposedAmount') as string;
    const estimatedDays = formData.get('estimatedDays') as string;

    // Validation
    if (!message?.trim()) {
      setFailureMessage('Message is required');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(proposedAmount);
    const days = parseInt(estimatedDays);

    if (isNaN(amount) || amount <= 0) {
      setFailureMessage('Please enter a valid proposed amount');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(days) || days <= 0) {
      setFailureMessage('Please enter valid estimated days');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      jobId: job.jobId,
      message: message.trim(),
      proposedAmount: amount,
      estimatedDays: days,
    };

    try {
      let res;
      if (existingProposal) {
        res = await fetch(`/api/proposal/${existingProposal.proposalId}?jobId=${job.jobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      
      if (result.success) {
        setSuccessMessage(existingProposal ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
        setFailureMessage('');

        if (existingProposal) {
          setExistingProposal(result.proposal);
        } else {
          // Inline fetch proposal after successful submission
          try {
            const res = await fetch(`/api/proposal/check?jobId=${job.jobId}`);
            const data = await res.json();
            if (data.success && data.proposal) {
              setExistingProposal(data.proposal);
            }
          } catch (err) {
            console.error('Failed to fetch proposal:', err);
          }
        }

        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setFailureMessage(`Failed to ${existingProposal ? 'update' : 'submit'} proposal: ${result.message || 'Unknown error'}`);
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setFailureMessage('Network error. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProposal = async () => {
    if (!existingProposal || !job?.jobId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/proposal/${existingProposal.proposalId}?jobId=${job.jobId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await res.json();

      if (result.success) {
        setExistingProposal(null);
        setSuccessMessage('Proposal deleted successfully.');
        setFailureMessage('');
      } else {
        setFailureMessage(`Delete failed: ${result.message || 'Unknown error'}`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      setFailureMessage('Network error during deletion.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        console.log('Fetching job with ID:', jobId); 
        const res = await fetch(`/api/job/${jobId}`, {
          cache: 'no-store',
        });
        
        console.log('Response status:', res.status); 
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Response data:', data); 

        if (!data.success || !data.data) {
          setError('Job not found');
          router.replace('/404');
        } else {
          setJob(data.data);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  // Fixed useEffect - moved fetchProposal logic inside
  useEffect(() => {
    if (!job || !jobId) return;
    
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposal/check?jobId=${jobId}`);
        const data = await res.json();
        if (data.success && data.proposal) {
          setExistingProposal(data.proposal);
        }
      } catch (err) {
        console.error('Failed to fetch proposal:', err);
      }
    };

    fetchProposal();
  }, [job, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-red-600 text-lg">{error || 'Job not found.'}</p>
        </div>
      </div>
    );
  }

  // Check if the current user is the client who posted this job
  const isJobOwner = user?.id === job.clientId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Header Section */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between h-16 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <BackButton/>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                  alt="FreeLanceBase Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FreeLanceBase</h1>
                  <p className="text-xs text-gray-500">Professional Freelance Network</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className={`w-2 h-2 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">{job.status}</span>
              </div>
            </div>
          </div>

          {/* Job Title Section */}
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center space-x-1 text-blue-700">
                  <CategoryIcon style={{ fontSize: 16 }} />
                  <span className="text-sm font-medium">{job.category}</span>
                </div>
              </div>
              
              {job.clientId !== user?.id && job.client && (
                <Link href={`/profile/${job.clientId}`}>
                  <div className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-xl border border-gray-200">
                    <div className="relative">
                      <Image
                        src={job.client.image}
                        alt={job.client.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                        width={48}
                        height={48}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{job.client.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <PersonOutlineIcon style={{ fontSize: 12 }} />
                        Client Profile
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DescriptionIcon className="text-blue-600" />
                Job Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <AttachMoneyIcon className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-bold text-green-600">${job.budget.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CalendarTodayIcon className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-bold text-blue-600">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CategoryIcon className="text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-bold text-purple-600">{job.category}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CalendarTodayIcon className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-bold text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* References and Resources */}
            {((Array.isArray(job.references) && job.references.length > 0) || 
              (Array.isArray(job.resources) && job.resources.length > 0)) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LinkIcon className="text-blue-600" />
                  Additional Resources
                </h3>
                
                {Array.isArray(job.references) && job.references.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Reference Links</h4>
                    <div className="space-y-2">
                      {job.references.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                        >
                          <LinkIcon className="text-blue-600 flex-shrink-0" style={{ fontSize: 16 }} />
                          <span className="text-blue-600 hover:text-blue-800 text-sm break-all group-hover:underline">
                            {url}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(job.resources) && job.resources.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Resource Links</h4>
                    <div className="space-y-2">
                      {job.resources.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                        >
                          <LinkIcon className="text-green-600 flex-shrink-0" style={{ fontSize: 16 }} />
                          <span className="text-green-600 hover:text-green-800 text-sm break-all group-hover:underline">
                            {url}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Existing Proposal Display */}
            {existingProposal && !isJobOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Proposal</h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message:</p>
                    <p className="text-gray-900">{existingProposal.message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Proposed Amount:</p>
                      <p className="text-lg font-bold text-green-600">${existingProposal.proposedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Days:</p>
                      <p className="text-lg font-bold text-blue-600">{existingProposal.estimatedDays} days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Proposals for Job Owner */}
            {isJobOwner && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <ViewProposal jobId={job.jobId} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Action Card */}
              {!isJobOwner && job.status === "open" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for This Job</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Submit your proposal to show interest in this project.
                  </p>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {existingProposal ? 'Edit Proposal' : 'Make a Proposal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        {existingProposal ? 'Edit your Proposal' : 'Submit your Proposal'}
                      </h3>

                      {successMessage && (
                        <Alert className="mb-4 border-green-200 bg-green-50">
                          <AlertTitle className="text-green-800">{successMessage}</AlertTitle>
                        </Alert>
                      )}
                      {failureMessage && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertTitle>{failureMessage}</AlertTitle>
                        </Alert>
                      )}

                      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium mb-1">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            defaultValue={existingProposal?.message || ''}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Explain why you're the best fit for this job..."
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="proposedAmount" className="block text-sm font-medium mb-1">
                            Proposed Amount ($) <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="proposedAmount"
                            name="proposedAmount"
                            type="number"
                            min="1"
                            step="0.01"
                            required
                            defaultValue={existingProposal?.proposedAmount || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your proposed amount"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="estimatedDays" className="block text-sm font-medium mb-1">
                            Estimated Days to Complete <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="estimatedDays"
                            name="estimatedDays"
                            type="number"
                            min="1"
                            required
                            defaultValue={existingProposal?.estimatedDays || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter estimated days"
                          />
                        </div>
                        
                        <div className='flex flex-row items-center justify-center gap-2 w-full'>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Processing...' : (existingProposal ? 'Update Proposal' : 'Submit Proposal')}
                          </Button>
                          {existingProposal && (
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 text-red-600 border-red-500 hover:bg-red-50"
                              onClick={handleDeleteProposal}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Deleting...' : 'Delete'}
                            </Button>
                          )}
                        </div>
                      </form>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        You can only submit one proposal per job. You can edit or delete it anytime.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Job Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="text-sm font-bold text-green-600">
                      ${job.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}