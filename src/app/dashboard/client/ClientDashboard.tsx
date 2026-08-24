"use client";

import { useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignOutButton, UserButton } from '@/components/auth';
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
  status: string;
  companyName?: string;
  companyWebsite?: string;
}

interface Job {
  jobId: string;
  clientId: string;
  freelancerId: string;
  _id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  acceptedProposalId?: string;
}

interface APIResponse {
  success: boolean;
  data: ClientData;
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
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 group";
  const activeClasses = active
    ? "bg-green-600 text-white shadow-lg"
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const content = (
    <>
      <span className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-green-600'}`}>
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

interface ClientDashboardProps {
  client: ClientData;
  jobs: Job[];
}

export default function ClientDashboard({ client, jobs: initialJobs }: ClientDashboardProps) {
  const data = client;
  const [activeView, setActiveView] = useState<'posted' | 'ongoing' | 'finished'>('posted');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs] = useState<Job[]>(initialJobs);

  // Calculate job statistics
  const openJobs = jobs.filter(job => job.status === 'open').length;
  const ongoingJobs = jobs.filter(job => job.status === 'in-progress' || job.status === 'ongoing').length;
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'finished').length;


  const sidebarItems = [
    { icon: <DashboardOutlinedIcon />, label: "Dashboard", href: "/dashboard", active: true },
    { icon: <PostAddOutlinedIcon />, label: "Post Job", href: "/jobs/create" },
    { icon: <PersonOutlineOutlinedIcon />, label: "Profile", href: `/profile/${client.userId}` },
    { icon: <NotificationsOutlinedIcon />, label: "Notifications", href: "/notifications" },
    { icon: <SettingsOutlinedIcon />, label: "Settings", href: "/setting" },
    { icon: <HelpOutlineOutlinedIcon />, label: "Help & Support", href: "/support" },
  ];




  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between pt-5 pb-6 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">FreeLanceBase</span>
            </div>
            <button
              type="button" aria-label="Close menu"

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
                <h3 className="font-semibold text-gray-900 truncate">{data.name || client.name.split(' ')[0]}</h3>
                <p className="text-sm text-gray-500 truncate">{data.role}</p>
                {data.companyName && (
                  <p className="text-xs text-green-600 truncate">{data.companyName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
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
                <UserButton size={40} />
              </SignedIn>
              <SignOutButton>
                <span aria-hidden="true" className="block p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogoutOutlinedIcon className="w-5 h-5" />
                </span>
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
                type="button" aria-label="Open menu"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <MenuOutlinedIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {data.name || client.name.split(' ')[0]}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {data.role}
              </Badge>
              <Link href="/jobs/create">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <PostAddOutlinedIcon className="w-4 h-4" />
                  Post Job
                </button>
              </Link>
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

            {/* Company Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BusinessOutlinedIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold text-gray-900">
                      {data.companyName || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        Visit Website
                      </a>
                    ) : (
                      <p className="font-semibold text-gray-400">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                    <h3 className="font-semibold text-gray-900">Open Jobs</h3>
                    <p className="text-2xl font-bold text-blue-600">{openJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ongoing</h3>
                    <p className="text-2xl font-bold text-yellow-600">{ongoingJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Completed</h3>
                    <p className="text-2xl font-bold text-green-600">{completedJobs}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Switch */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setActiveView('posted')}
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${activeView === 'posted'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Posted Jobs
                  </button>
                  <button
                    onClick={() => setActiveView('ongoing')}
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${activeView === 'ongoing'
                        ? 'bg-yellow-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Ongoing Jobs
                  </button>
                  <button
                    onClick={() => setActiveView('finished')}
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${activeView === 'finished'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Finished Jobs
                  </button>
                </div>
              </div>

              {/* Component Display */}
              <div>
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