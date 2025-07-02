'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Alert, AlertDescription } from "@/components/ui/alert";


export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<'freelancer' | 'client' | ''>('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [portfolio, setPortfolio] = useState<{ title: string; link: string }[]>([]);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const handleAddPortfolio = () => {
    if (!portfolioTitle.trim() || !portfolioLink.trim()) return;
    setPortfolio([...portfolio, { title: portfolioTitle.trim(), link: portfolioLink.trim() }]);
    setPortfolioTitle('');
    setPortfolioLink('');
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!firstName.trim()) {
      setAlertMessage('First name is required.');
      return;
    }
    if (!lastName.trim()) {
      setAlertMessage('Last name is required.');
      return;
    }
    if (!bio.trim()) {
      setAlertMessage('Bio is required.');
      return;
    }
    if (role === 'freelancer') {
      if (!skills.trim()) {
        setAlertMessage('Please enter your skills.');
        return;
      }
      if (!experienceLevel) {
        setAlertMessage('Please select your experience level.');
        return;
      }
    }
    

    setIsSubmitting(true);

    const payload = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
      bio: bio.trim(),
      // Freelancer fields
      skills: role === 'freelancer' ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      experienceLevel: role === 'freelancer' ? experienceLevel : undefined,
      portfolio: role === 'freelancer' ? portfolio : undefined,
      // Client fields
      companyName: role === 'client' ? companyName.trim() : undefined,
      companyWebsite: role === 'client' ? companyWebsite.trim() : undefined,
    };

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.message === 'Already registered') {
        setAlertMessage('User already exists. Please sign in or go to your dashboard.');
      } else if (data.success) {
        router.push(`/dashboard/${role}`);
      } else {
        alert('Failed to register.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-screen bg-linear-to-r from-cyan-500 to-blue-500 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl sm:p-8 p-6 bg-white shadow-xl rounded-xl transition-all duration-300">
        {!role && (
          <>
            <h1 className="scroll-m-20 pb-6 text-center text-2xl font-bold tracking-tight text-balance">Choose Your Role</h1>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setRole('freelancer')}
                className="w-1/2 bg-linear-to-br from-cyan-500 to-blue-700 hover:to-blue-200 hover:from-blue-200 hover:text-blue-500 text-white font-semibold py-2 px-4 rounded-full"
              >
                I&apos;m looking for Freelance Work
              </button>
              <button
                onClick={() => setRole('client')}
                className="w-1/2 bg-linear-to-br from-green-500 to-emerald-700 hover:to-lime-200 hover:from-lime-200 hover:text-emerald-700 text-white font-semibold py-2 px-4 rounded-full"
              >
                I&apos;m looking to Hire
              </button>
            </div>
          </>
        )}

        {role && (
          <>
            <h2 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">
              {role === 'freelancer' ? 'Freelancer Profile' : 'Client Profile'}
            </h2>

            {alertMessage && (
              <Alert variant="destructive" className="text-red-600">
                <AlertDescription>Error : {alertMessage}</AlertDescription>
              </Alert>
            )}

            {/* First Name */}
            <label className="block mb-1 font-medium">First Name</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="First Name"
              required
            />

            {/* Last Name */}
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Last Name"
              required
            />

            {/* Bio */}
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 mb-4 border rounded h-24"
              placeholder="Tell us about yourself"
              required
            />

            {/* Freelancer Section */}
            {role === 'freelancer' && (
              <>
                <label className="block mb-1 font-medium">Skills (comma-separated)</label>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="e.g. Video editor, Web developer, React"
                  required
                />

                <label className="block mb-1 font-medium">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value as 'beginner' | 'intermediate' | 'expert')}
                  className="w-full p-2 mb-4 border rounded"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>

                {/* Portfolio Section */}
                <label className="block mb-1 font-medium">Portfolio Links</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    placeholder="Title"
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://yourproject.com"
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
                <ul className="list-disc pl-5 mt-2 mb-4">
                  {portfolio.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{item.title} - {item.link}</span>
                      <button
                        onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </li>
                  ))}
                </ul>
                
              </>
            )}

            {/* Client Section */}
            {role === 'client' && (
              <>
                <label className="block mb-1 font-medium">Company Name</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="e.g. Acme Inc."
                  // not required
                />

                <label className="block mb-1 font-medium">Company Website</label>
                <input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="https://example.com"
                  // not required
                />
              </>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setRole('')}
                className="bg-linear-to-r from-cyan-500 to-blue-500 px-3 pr-5 flex items-center justify-center  rounded-full text-white font-bold shadow-lg hover:from-white hover:to-white hover:text-cyan-500 transition-colors duration-300"
              >
                <ArrowLeftIcon sx={{ fontSize: 30 }} />Change Role
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-linear-to-t from-sky-500 to-indigo-500 px-3 py-2 rounded-full text-white font-bold shadow-lg hover:from-white hover:to-white hover:text-indigo-500"
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
