"use client";

import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Image from "next/image";
import { SignedIn, SignOutButton, UserButton } from '@/components/auth';
import type { FreelancerData } from "./types";

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

interface DashboardSidebarProps {
  freelancer: FreelancerData;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export default function DashboardSidebar({ freelancer, sidebarOpen, onCloseSidebar }: DashboardSidebarProps) {
  const sidebarItems = [
    { icon: <DashboardOutlinedIcon />, label: "Dashboard", href: "/dashboard", active: true },
    { icon: <WorkOutlineOutlinedIcon />, label: "Find Jobs", href: "/jobs/open" },
    { icon: <PersonOutlineOutlinedIcon />, label: "Profile", href: `/profile/${freelancer.userId}` },
    { icon: <NotificationsOutlinedIcon />, label: "Notifications", href: "/notifications" },
    { icon: <SettingsOutlinedIcon />, label: "Settings", href: "/setting" },
    { icon: <HelpOutlineOutlinedIcon />, label: "Help & Support", href: "/support" },
  ];

  return (
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

            onClick={onCloseSidebar}

            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <CloseOutlinedIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {freelancer.image && (
              <div className="relative">
                <Image
                  src={freelancer.image}
                  alt={freelancer.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{freelancer.name || freelancer.name.split(' ')[0]}</h3>
              <p className="text-sm text-gray-500 truncate">{freelancer.role}</p>
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
  );
}
