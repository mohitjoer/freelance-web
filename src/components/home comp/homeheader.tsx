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

function Homeheader() {
  return (
    <header className="w-full bg-gradient-to-tl from-cyan-500 to-blue-500 px-3 py-2 sm:px-6 sm:py-4 flex flex-row md:items-center md:justify-between ">
      {/* Brand + Navigation */}
      <div className="flex flex-row  items-center gap-3 w-full md:w-auto">
        {/* Brand Name */}
        <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight text-center sm:text-left">
          Brand Name
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-wrap gap-3">
          {["Find Jobs", "Hire Freelancers", "How It Works", "About"].map((label) => (
            <Button
              key={label}
              className="bg-transparent text-white hover:bg-white hover:scale-105 hover:text-sky-500 hover:shadow-md transition-all duration-200 px-5 py-2 text-sm md:text-base font-bold"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-white rounded-full p-1 border-1 border-white hover:bg-white hover:text-sky-500 transition"
              >
               <ArrowDropDownIcon/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-linear-to-tr from-cyan-500 to-blue-500 text-white font-bold hover:shadow-white" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Find Jobs</DropdownMenuItem>
                <DropdownMenuItem>Hire Freelancers</DropdownMenuItem>
                <DropdownMenuItem>How It Works</DropdownMenuItem>
                <DropdownMenuItem>About</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Auth Section */}
      <div className="w-full md:w-auto flex items-center justify-center md:justify-end">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="bg-white px-5 py-2 rounded-full font-semibold hover:text-sky-500 hover:scale-110 transition">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

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
    </header>
  );
}

export default Homeheader;
