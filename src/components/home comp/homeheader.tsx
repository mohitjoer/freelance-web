"use client";

import { Button } from "../ui/button";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

function Homeheader() {
  return (
    <header className="w-full bg-white shadow-lg border-b border-gray-100 px-4 py-3 sm:px-8 sm:py-4">
      <div className=" mx-auto flex items-center justify-between">
        {/* Brand + Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image 
                alt="FreeLancBase logo" 
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              FreeLancBase
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {["Find Jobs", "Hire Freelancers", "How It Works", "About"].map((label) => (
              <Button
                key={label}
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 text-sm transition-colors duration-200"
              >
                {label}
              </Button>
            ))}
          </nav>

          {/* Mobile Dropdown */}
          <div className="flex lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Menu <ArrowDropDownIcon className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white shadow-lg border border-gray-200" align="start">
                <DropdownMenuGroup>
                  {["Find Jobs", "Hire Freelancers", "How It Works", "About"].map((label) => (
                    <DropdownMenuItem key={label} className="text-gray-700 hover:bg-gray-50 cursor-pointer">
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="redirect" forceRedirectUrl="/select">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors duration-200">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/select">
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Homeheader;