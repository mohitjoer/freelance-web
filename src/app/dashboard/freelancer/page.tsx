"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Image from "next/image";

import { Badge } from "@/components/ui/badge"
import { SignedIn, SignOutButton, UserButton } from "@clerk/clerk-react";
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
  jobsFinished: string[];
}

interface APIResponse {
  success: boolean;
  data: FreelancerData;
  message?: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active, onClick }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group";
  const activeClasses = active 
    ? "bg-blue-600 text-white shadow-lg" 
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const content = (
    <>
      <span className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${activeClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses} w-full text-left`}>
      {content}
    </button>
  );
};

export default function FreelancerDashboard() {
  const { user, isLoaded } = useUser();
  const [freelancerData, setFreelancerData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'proposals' | 'jobs'>('proposals');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const sidebarItems = [
    { icon: <DashboardOutlinedIcon />, label: "Dashboard", href: "/dashboard", active: true },
    { icon: <WorkOutlineOutlinedIcon />, label: "Find Jobs", href: "/jobs/open" },
    { icon: <PersonOutlineOutlinedIcon />, label: "Profile", href: `/profile/${freelancerData?.data.userId}` },
    { icon: <NotificationsOutlinedIcon />, label: "Notifications", href: "/notifications" },
    { icon: <SettingsOutlinedIcon />, label: "Settings", href: "/setting" },
    { icon: <HelpOutlineOutlinedIcon />, label: "Help & Support", href: "/support" },
  ];

  // Show loading while Clerk is initializing or while fetching data
  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
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
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Freelancer profile not found.</p>
        </div>
      </div>
    );
  }

  const data = freelancerData.data;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">FreeLanceBase</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <CloseOutlinedIcon className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {data.image && (
                <div className="relative">
                  <Image
                    src={data.image}
                    alt={data.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{data.name || user?.firstName}</h3>
                <p className="text-sm text-gray-500 truncate">{data.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
              />
            ))}
          </nav>

          {/* User Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
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
              <SignOutButton>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">               
                  <LogoutOutlinedIcon className="w-5 h-5" />               
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <MenuOutlinedIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {data.name || user?.firstName}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {data.experienceLevel} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Bio Section */}
            {data.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{data.bio}</p>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Proposals</h3>
                    <p className="text-2xl font-bold text-blue-600">{data.jobsProposed?.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Active Jobs</h3>
                    <p className="text-2xl font-bold text-green-600">{data.jobsInProgress?.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Completed</h3>
                    <p className="text-2xl font-bold text-purple-600">{data.jobsFinished?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              {data.skills && data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">No skills added yet.</p>
                  <Link href="/profile/edit" className="text-blue-600 hover:text-blue-700 font-medium">
                    Add your skills →
                  </Link>
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
              {data.portfolio && data.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.portfolio.map((item: PortfolioItem, index: number) => (
                    <div key={index} className="group">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
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
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">No portfolio items added yet.</p>
                  <Link href="/profile/edit" className="text-blue-600 hover:text-blue-700 font-medium">
                    Add your work →
                  </Link>
                </div>
              )}
            </div>

            {/* Component Switch */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setActiveView('proposals')}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeView === 'proposals'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Proposals
                  </button>
                  <button
                    onClick={() => setActiveView('jobs')}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeView === 'jobs'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Active Jobs
                  </button>
                </div>
              </div>
              
              {/* Component Display */}
              <div>
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