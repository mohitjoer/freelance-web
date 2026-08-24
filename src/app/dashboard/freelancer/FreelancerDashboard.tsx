"use client";

import { useState } from "react";
import Link from "next/link";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import { Badge } from "@/components/ui/badge"
import Proposallist from "@/components/freelancer comp/proposallist";
import WorkingJob from "@/components/freelancer comp/workingjob";
import CompletedJob from "@/components/freelancer comp/completedjob";
import DashboardSidebar from "./DashboardSidebar";
import StatsCards from "./StatsCards";
import type { FreelancerData, PortfolioItem, Proposal } from "./types";

interface FreelancerDashboardProps {
  freelancer: FreelancerData;
  proposals: Proposal[];
}

const FreelancerDashboardView = ({ freelancer, proposals }: FreelancerDashboardProps) => {
  const data = freelancer;
  // Calculate proposal counts by status
  const proposalCounts = {
    pending: proposals.filter((p) => p.status === 'pending').length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    completed: proposals.filter((p) => p.status === 'completed').length,
    total: proposals.length
  };
  const [activeView, setActiveView] = useState<'proposals' | 'jobs' | 'completed'>('proposals');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <DashboardSidebar
        freelancer={freelancer}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

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
                <p className="text-sm text-gray-500">Welcome back, {data.name || freelancer.name.split(' ')[0]}!</p>
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
            <StatsCards proposalCounts={proposalCounts} />

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              {data.skills && data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string) => (
                    <span
                      key={skill}
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
                  {data.portfolio.map((item: PortfolioItem) => (
                    <div key={`${item.title}-${item.link}`} className="group">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition duration-200"
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
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                      activeView === 'proposals'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Proposals
                  </button>
                  <button
                    onClick={() => setActiveView('jobs')}
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                      activeView === 'jobs'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Active Jobs
                  </button>
                  <button
                    onClick={() => setActiveView('completed')}
                    className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                      activeView === 'completed'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Component Display */}
              <div>
                {activeView === 'proposals' && <Proposallist />}
                {activeView === 'jobs' && <WorkingJob />}
                {activeView === 'completed' && <CompletedJob/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboardView;
