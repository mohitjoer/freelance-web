'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PortfolioItem {
  title: string;
  link: string;
}

interface ProfileForm {
  bio: string;
  firstName: string;
  lastName: string;
  skills: string;
  portfolio: PortfolioItem[];
  experienceLevel: string;
  companyName: string;
  companyWebsite: string;
}

interface EditProfileFormProps {
  initialRole: 'client' | 'freelancer';
  initialForm: ProfileForm;
}

export default function EditProfileForm({ initialRole, initialForm }: EditProfileFormProps) {
  const router = useRouter();

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (saving) return;
    setSaving(true);
    setMsg(null);

    const payload: Record<string, unknown> = {
      bio: form.bio,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    if (role === "freelancer") {
      payload.skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    } finally {
      setSaving(false);
    }
  };

  if (msg === "Loading...") return <p className="p-4">Loading...</p>;

  return (
    <main className="h-screen bg-linear-to-r from-cyan-500 to-blue-500 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl sm:p-8 p-6 bg-white shadow-xl rounded-xl transition duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Profile</h1>

        {msg && <p className="text-sm text-red-500 mb-4">{msg}</p>}

        <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700">First Name</label>
        <input
          id="firstName"
          className="w-full p-2 mb-4 border rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700">Last Name</label>
        <input
          id="lastName"
          className="w-full p-2 mb-4 border rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <label htmlFor="bio" className="block mb-1 font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          className="w-full p-2 mb-4 border rounded h-24"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        {role === "freelancer" && (
          <>
            <label htmlFor="skills" className="block mb-1 font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              id="skills"
              className="w-full p-2 mb-4 border rounded"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />

            <label htmlFor="experienceLevel" className="block mb-1 font-medium text-gray-700">Experience Level</label>
            <input
              id="experienceLevel"
              className="w-full p-2 mb-4 border rounded"
              value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            />
          </>
        )}

        {role === "client" && (
          <>
            <label htmlFor="companyName" className="block mb-1 font-medium text-gray-700">Company Name</label>
            <input
              id="companyName"
              className="w-full p-2 mb-4 border rounded"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />

            <label htmlFor="companyWebsite" className="block mb-1 font-medium text-gray-700">Company Website</label>
            <input
              id="companyWebsite"
              className="w-full p-2 mb-4 border rounded"
              value={form.companyWebsite}
              onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
            />
          </>
        )}

        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving}
          className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold transition-colors cursor-pointer"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </main>
  );
}
