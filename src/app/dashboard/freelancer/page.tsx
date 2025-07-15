"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import Image from "next/image";

import { Badge } from "@/components/ui/badge"
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import Proposallist from "@/components/freelancer comp/proposallist";
import WorkingJob from "@/components/freelancer comp/workingjob";

// Type definitions
interface PortfolioItem {
  title: string;
  link: string;
}

interface FreelancerData {
  userId: string;
  name: string;
  role: string;
  image: string | null;
  projects_done: number;
  bio: string;
  skills: string[];
  portfolio: PortfolioItem[];
  experienceLevel: string;
  jobsInProgress: string[];
  jobsProposed: string[];
}

interface APIResponse {
  success: boolean;
  data: FreelancerData;
  message?: string;
}

export default function FreelancerDashboard() {
  const { user, isLoaded } = useUser();
  const [freelancerData, setFreelancerData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'proposals' | 'jobs'>('proposals');

  useEffect(() => {
    // Wait for Clerk to load user data
    if (!isLoaded) return;
    
    // If no user is authenticated, stop loading
    if (!user) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Remove userId from query params since API gets it from auth()
        const res = await fetch('/api/user/freelancer');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data: APIResponse = await res.json();
        
        // Check if the API returned a success response
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch freelancer data');
        }
        
        setFreelancerData(data);
      } catch (error) {
        console.error("Failed to load freelancer data:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load freelancer data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  // Show loading while Clerk is initializing or while fetching data
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <Skeleton className="w-full h-[85vh] bg-white/60 rounded-2xl shadow-xl" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          {error && error.includes("not found") && (
            <Link href="/onboarding" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Complete Profile Setup
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!freelancerData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Freelancer profile not found.</p>
        </div>
      </div>
    );
  }

  const data = freelancerData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
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
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">{data.name || user?.firstName}</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {data.role}
                  </Badge>
                  <p className="text-blue-100 mt-2 text-sm">{data.experienceLevel} Level</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/jobs/open">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30">
                    <WorkOutlineOutlinedIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Find Jobs</span>
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

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              {data.skills && data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-500">No skills added yet.</p>
                  <Link href="/profile/edit" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                    Add your skills →
                  </Link>
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio</h2>
              {data.portfolio && data.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.portfolio.map((item: PortfolioItem, index: number) => (
                    <div key={index} className="group">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">View project</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-500">No portfolio items added yet.</p>
                  <Link href="/profile/edit" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                    Add your work →
                  </Link>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Proposals Sent</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {data.jobsProposed?.length || 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-900 mb-1">Active Jobs</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.jobsInProgress?.length || 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-900 mb-1">Completed</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {data.projects_done || 0}
                </p>
              </div>
            </div>

            {/* Component Switch */}
            <div className="mb-6">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-xl p-1 flex">
                  <button
                    onClick={() => setActiveView('proposals')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeView === 'proposals'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    My Proposals
                  </button>
                  <button
                    onClick={() => setActiveView('jobs')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeView === 'jobs'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Active Jobs
                  </button>
                </div>
              </div>
              
              {/* Component Display */}
              <div className="bg-gray-50 rounded-xl p-6">
                {activeView === 'proposals' && <Proposallist />}
                {activeView === 'jobs' && <WorkingJob />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}