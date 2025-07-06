"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { Badge } from "@/components/ui/badge";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton"
import ClientJobList from "@/components/client comp/joblist";
import Image from "next/image";
import JobOngoing from "@/components/client comp/jobongoing";
import JobFinshed from "@/components/client comp/jobfinshed";

// Type Definitions
interface ClientData {
  userId: string;
  name: string;
  role: string;
  image: string | null;
  bio?: string;
  companyName?: string;
  companyWebsite?: string;
  jobsPosted: string[];
  jobsOngoing: string[];
  jobsFinished: string[];
}

interface APIResponse {
  success: boolean;
  data: ClientData;
  message?: string;
}

export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const [clientData, setClientData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'posted' | 'ongoing' | 'finished'>('posted');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/client");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data: APIResponse = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load client data");
        setClientData(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  // Show loading while Clerk is initializing or while fetching data
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <Skeleton className="w-full h-[85vh] bg-white/60 rounded-2xl shadow-xl" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          {error && error.includes("not found") && (
            <Link href="/onboarding" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Complete Profile Setup
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!clientData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Client profile not found.</p>
        </div>
      </div>
    );
  }

  const data = clientData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                {data.image && (
                  <div className="relative">
                    <Image
                      src={data.image}
                      alt={data.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 lg:w-30 lg:h-30 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                )}
                <div className="text-white">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{data.name}</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {data.role}
                  </Badge>
                  {data.companyName && (
                    <p className="text-green-100 mt-2 text-sm">{data.companyName}</p>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/jobs/create">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30">
                    <PostAddOutlinedIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Post Job</span>
                  </button>
                </Link>
                <Link href="/profile/edit">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30">
                    <SettingsOutlinedIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Settings</span>
                  </button>
                </Link>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: "40px",
                          height: "40px",
                        },
                      },
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Bio Section */}
            {data.bio && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">{data.bio}</p>
                </div>
              </div>
            )}

            {/* Company Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h10M7 15h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold text-gray-900">
                      {data.companyName || <span className="text-gray-400">Not specified</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    {data.companyWebsite ? (
                      <a
                        href={data.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline"
                      >
                        {data.companyWebsite}
                      </a>
                    ) : (
                      <p className="font-semibold text-gray-400">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Jobs Posted</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {data.jobsPosted?.length || 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-yellow-900 mb-1">Jobs Ongoing</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {data.jobsOngoing?.length || 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-900 mb-1">Jobs Finished</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.jobsFinished?.length || 0}
                </p>
              </div>
            </div>

            {/* Component Switch */}
            <div className="mb-6">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-xl p-1 flex">
                  <button
                    onClick={() => setActiveView('posted')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeView === 'posted'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Posted Jobs
                  </button>
                  <button
                    onClick={() => setActiveView('ongoing')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeView === 'ongoing'
                        ? 'bg-yellow-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Ongoing Jobs
                  </button>
                  <button
                    onClick={() => setActiveView('finished')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeView === 'finished'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Finished Jobs
                  </button>
                </div>
              </div>
              
              {/* Component Display */}
              <div className="bg-gray-50 rounded-xl p-6">
                {activeView === 'posted' && <ClientJobList />}
                {activeView === 'ongoing' && <JobOngoing />}
                {activeView === 'finished' && <JobFinshed />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}