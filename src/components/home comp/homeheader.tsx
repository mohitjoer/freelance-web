"use client";

import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../theme-provider";

function Homeheader() {
  const { resolvedTheme } = useTheme();
  return (
    <header
      className={`w-full fixed z-100 shadow-lg px-4 py-3 sm:px-8 sm:py-4 ${
        resolvedTheme === "dark"
          ? "bg-background backdrop-blur-lg"
          : "bg-white border-black"
      } transition-colors duration-144 border-b-1`}
    >
      <div className="mx-auto flex items-center justify-between">
        {/* Left Side: Brand + Navigation */}
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
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground tracking-tight cursor-pointer hover:text-blue-600 transition-colors">
                FreeLanceBase
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            
            <Link
              href="/jobs"
              className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Browse Jobs
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth Section */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="redirect" forceRedirectUrl="/select">
              <Button className="group cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-primary dark:to-primary/90 dark:hover:from-primary/90 dark:hover:to-primary/80 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-primary/50 transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-blue-400 dark:hover:ring-primary/60 hover:ring-offset-2 dark:hover:ring-offset-gray-900">
                <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                  Sign In
                </span>
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/select">
              <Button
                variant="outline"
                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors duration-200"
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

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Homeheader;