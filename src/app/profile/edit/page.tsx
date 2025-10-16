"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileProgress from "@/components/ui/profile-progress";

// Define the payload type
interface UpdatePayload {
  bio: string;
  firstName: string;
  lastName: string;
  skills?: string[];
  portfolio?: { title: string; link: string }[];
  experienceLevel?: string;
  companyName?: string;
  companyWebsite?: string;
}

export default function EditProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<"freelancer" | "client" | "">("");
  const [form, setForm] = useState({
    bio: "",
    firstName: "",
    lastName: "",
    skills: "",
    portfolio: [] as { title: string; link: string }[],
    experienceLevel: "",
    companyName: "",
    companyWebsite: "",
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // Fetch current user data from /api/user/me
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        const u = data.data;
        setRole(u.role);
        setForm({
          bio: u.bio || "",
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          skills: u.skills?.join(", ") || "",
          portfolio: u.portfolio || [],
          experienceLevel: u.experienceLevel || "",
          companyName: u.companyName || "",
          companyWebsite: u.companyWebsite || "",
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load profile.";
        console.error(errorMsg);
        setMsg(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) fetchProfile();
  }, [isLoaded, user]);

  const handleUpdate = async () => {
    setMsg(null);

    const payload: UpdatePayload = {
      bio: form.bio,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    if (role === "freelancer") {
      payload.skills = form.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
      payload.portfolio = form.portfolio;
      payload.experienceLevel = form.experienceLevel;
    }

    if (role === "client") {
      payload.companyName = form.companyName;
      payload.companyWebsite = form.companyWebsite;
    }

    try {
      const res = await fetch("/api/user/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setMsg("Profile updated successfully.");
        router.push(`/dashboard/${role}`);
      } else {
        setMsg(result.message || "Failed to update.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Server error.";
      console.error(errorMsg);
      setMsg(errorMsg);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h1>

        {/* Profile Progress Bar */}
        <ProfileProgress
          user={{
            bio: form.bio,
            skills: role === "freelancer" ? form.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
            portfolio: form.portfolio,
            experienceLevel: form.experienceLevel,
            companyName: form.companyName,
            companyWebsite: form.companyWebsite,
          }}
          showSuggestions={true}
        />

        <label className="block mb-1 font-medium">Last Name</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <label className="block mb-1 font-medium">Bio</label>
        <textarea
          className="w-full p-2 mb-4 border rounded h-24"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        {role === "freelancer" && (
          <>
            <label className="block mb-1 font-medium">Skills (comma-separated)</label>
            <input
              className="w-full p-2 mb-4 border rounded"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />

            <label className="block mb-1 font-medium">Experience Level</label>
            <input
              className="w-full p-2 mb-4 border rounded"
              value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            />
          </>
        )}

        {role === "client" && (
          <>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              className="w-full p-2 mb-4 border rounded"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />

            <label className="block mb-1 font-medium">Company Website</label>
            <input
              className="w-full p-2 mb-4 border rounded"
              value={form.companyWebsite}
              onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
            />
          </>
        )}

        <button
          onClick={handleUpdate}
          className="bg-linear-to-r from-cyan-500 to-blue-500 py-2 px-3 flex items-center justify-center  rounded-full text-white font-bold shadow-lg hover:from-white hover:to-white hover:text-cyan-500 transition-colors duration-300"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}