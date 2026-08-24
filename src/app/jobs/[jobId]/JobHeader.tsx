'use client';

import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/backbutton';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import type { Job } from './types';

interface JobHeaderProps {
  job: Job;
  currentUserId: string;
}

export default function JobHeader({ job, currentUserId }: JobHeaderProps) {
  return (
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

            {job.clientId !== currentUserId && job.client && (
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
  );
}
