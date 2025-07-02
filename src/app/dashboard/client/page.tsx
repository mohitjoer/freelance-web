"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { Badge } from "@/components/ui/badge";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Type Definitions
interface ClientData {
  userId: string;
  name: string;
  role: string;
  image: string | null;
  bio?: string;
  companyName?: string;
  companyWebsite?: string;
  jobsPosted: string[];
  jobsOngoing: string[];
  jobsFinished: string[];
}

interface APIResponse {
  success: boolean;
  data: ClientData;
  message?: string;
}

export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const [clientData, setClientData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/client");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data: APIResponse = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load client data");
        setClientData(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!clientData?.data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        Client profile not found.
      </div>
    );
  }

  const data = clientData.data;

  return (
    <main className="h-screen bg-gradient-to-t from-green-400 to-blue-500 px-4 py-6 flex items-center justify-center">
      <div className="w-[95vw] h-[95vh] max-w-full max-h-full bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-neutral-300 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-4">
            {data.image && (
              <img src={data.image} alt={data.name} className="w-24 h-24 rounded-full object-cover" />
            )}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <Badge variant="secondary" className="bg-green-500 text-white rounded-full">
                {data.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/jobs/post">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 shadow">
                <PostAddOutlinedIcon />
              </button>
            </Link>
            <Link href="/profile/edit">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 shadow">
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

        {/* Bio */}
        {data.bio && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{data.bio}</p>
          </div>
        )}

        {/* Company Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Company Info</h2>
          <p className="text-gray-700"><strong>Name:</strong> {data.companyName || <span className="text-gray-400">N/A</span>}</p>
          <p className="text-gray-700">
            <strong>Website:</strong>{" "}
            {data.companyWebsite ? (
              <a
                href={data.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.companyWebsite}
              </a>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </p>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-blue-800">Jobs Posted</h3>
            <p className="text-2xl font-bold text-blue-600">{data.jobsPosted.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-yellow-800">Jobs Ongoing</h3>
            <p className="text-2xl font-bold text-yellow-600">{data.jobsOngoing.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-green-800">Jobs Finished</h3>
            <p className="text-2xl font-bold text-green-600">{data.jobsFinished.length}</p>
          </div>
        </div>

        {/* Jobs Posted List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Jobs Posted</h2>
          {data.jobsPosted.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {data.jobsPosted.map((job, i) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No jobs posted yet.</p>
          )}
        </div>

        {/* Jobs Ongoing List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Jobs Ongoing</h2>
          {data.jobsOngoing.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {data.jobsOngoing.map((job, i) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No ongoing jobs.</p>
          )}
        </div>

        {/* Jobs Finished List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Jobs Finished</h2>
          {data.jobsFinished.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {data.jobsFinished.map((job, i) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No finished jobs.</p>
          )}
        </div>


        {/* job */}
        <div className="mb-6 bg-neutral-300 border-neutral-500 border-2 rounded-xl p-4 w-fit">
          <Table>
            <TableCaption className="">A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>editing</TableCell>
                <TableCell>in progress</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
