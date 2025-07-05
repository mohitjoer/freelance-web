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
import JobTaken from "@/components/freelancer comp/jobtaken";


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
  bio: string;
  skills: string[];
  portfolio: PortfolioItem[];
  experienceLevel: string;
  jobsTaken: string[];
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
      <div className="h-screen bg-white flex items-center justify-center">
        <Skeleton className="w-[95vw] h-[95vh] max-w-full max-h-full bg-gray-700 rounded-xl" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          {error && error.includes("not found") && (
            <Link href="/onboarding" className="text-blue-600 hover:underline">
              Complete your freelancer profile setup
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!freelancerData?.data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-center text-red-500">Freelancer profile not found.</p>
      </div>
    );
  }

  const data = freelancerData.data;

  return (
    <main className="h-screen bg-gradient-to-t from-sky-500 to-indigo-500 px-2 py-4 flex items-center justify-center">
      <div className="w-[95vw] h-[95vh] max-w-full max-h-full bg-white p-2 sm:p-6 rounded-xl shadow-lg flex flex-col overflow-auto">
        
        <div className="flex  justify-between border-b border-neutral-400">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            {data.image && (
              <Image
                src={data.image}
                alt={data.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex flex-wrap items-end gap-1 md:gap-2 ">
              <h1 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">{data.name || user?.firstName}</h1>
              <Badge variant="secondary" className="bg-sky-400 h-fit text-white rounded-full ">
                {data.role}
              </Badge>
            </div>
          </div>
          {/* Action Buttons */}
            <div className="flex flex-row gap-2 items-start">
            <Link href="/jobs/open" >
              <button className="w-full sm:w-auto flex items-center justify-center  text-gray-500 font-bold p-1 shadow rounded-full transition-colors">
              <WorkOutlineOutlinedIcon />
              </button>
            </Link>
            <Link href="/profile/edit" >
              <button className="w-full sm:w-auto flex items-center justify-center text-gray-500 font-bold p-1 shadow rounded-full transition-colors">
              <SettingsOutlinedIcon />
              </button>
            </Link>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "35px",
                      height: "35px",
                    },
                  },
                }}
              />
            </SignedIn>
            </div>
        </div>
        {/* Bio Section */}
        {data.bio && (
          <div className="my-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{data.bio}</p>
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Skills</h2>
          {data.skills && data.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>

        {/* Portfolio Section */}
        <div className="mb-6 w-fit">
          <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
          {data.portfolio && data.portfolio.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.portfolio.map((item: PortfolioItem, index: number) => (
                <div key={index} className="border-neutral-500 border-2 flex items-center justify-center rounded-xl p-1 hover:bg-gray-50">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {item.title}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No portfolio items added yet.</p>
          )}
        </div>

        {/* Job Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-blue-800">Jobs Taken</h3>
            <p className="text-2xl font-bold text-blue-600">
              {data.jobsTaken?.length || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-green-800">Proposals Sent</h3>
            <p className="text-2xl font-bold text-green-600">
              {data.jobsProposed?.length || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-purple-800">Experience</h3>
            <p className="text-lg font-bold text-purple-600 capitalize">
              {data.experienceLevel}
            </p>
          </div>
        </div>

        {/* Component Switch */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveView('proposals')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeView === 'proposals'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Proposals
              </button>
              <button
                onClick={() => setActiveView('jobs')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeView === 'jobs'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Jobs Taken
              </button>
            </div>
          </div>
          
          {/* Component Display */}
          <div className="transition-all duration-300 ease-in-out">
            {activeView === 'proposals' && <Proposallist />}
            {activeView === 'jobs' && <JobTaken />}
          </div>
        </div>
      </div>
    </main>
  );
}