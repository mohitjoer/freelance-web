import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelance Web Platform",
  description: "Find and post freelance jobs easily — modern, fast, and responsive.",
  keywords: ["freelance", "jobs", "remote work", "clients", "developers"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Freelance Web Platform",
    description: "A place to connect freelancers and clients seamlessly.",
    url: "https://yourdomain.com",
    siteName: "FreelanceWeb",
    images: [{ url: "/next.svg", width: 800, height: 600, alt: "FreelanceWeb" }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300`}
      >
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <a
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition"
            >
              Freelance<span className="text-blue-600">Web</span>
            </a>

            <div className="flex items-center gap-4 text-sm font-medium">
              <a href="/jobs" className="hover:text-blue-600 transition">
                Jobs
              </a>
              <a href="/proposals" className="hover:text-blue-600 transition">
                Proposals
              </a>
              <a href="/profile" className="hover:text-blue-600 transition">
                Profile
              </a>

              {/* 🌗 Theme Toggle Button */}
              <ThemeToggle />
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FreelanceWeb. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
