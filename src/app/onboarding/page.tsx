'use client';

import { useUser } from '@/components/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from 'next/image';
import FreelancerSection from './FreelancerSection';
import ClientSection from './ClientSection';

interface PortfolioItem {
  title: string;
  link: string;
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<'freelancer' | 'client' | ''>('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    <main className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="flex h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
          <Image
            src="https://res.cloudinary.com/dipugmopt/image/upload/v1753531097/ChatGPT_Image_Jul_26_2025_05_27_45_PM_fklgic.png"
            alt="Professional workspace"
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
          />
          <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/80 rounded-2xl p-3 text-neutral-600">
            <h2 className="text-2xl font-bold mb-2">Welcome to <span className='text-sky-800'>FreeLanceBase</span> Network</h2>
            <p className="text-base opacity-90">Connect with top talent or find your next great opportunity</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-md max-h-full">
            {!role && (
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                  <p className="text-sm text-gray-600">Choose your role to get started</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setRole('freelancer')}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <PersonIcon className="text-xl" />
                      <span className="text-base">I&apos;m looking for Freelance Work</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setRole('client')}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <BusinessIcon className="text-xl" />
                      <span className="text-base">I&apos;m looking to Hire</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {role && (
              <div className="space-y-4 max-h-full overflow-y-auto">
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {role === 'freelancer' ? 'Freelancer Profile' : 'Client Profile'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {role === 'freelancer'
                      ? 'Tell us about your skills and experience'
                      : 'Set up your company profile'
                    }
                  </p>
                </div>

                {alertMessage && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 py-2">
                    <AlertDescription className="text-red-700 text-sm">
                      <strong>Error:</strong> {alertMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700">First Name</label>
                      <input
                        id="firstName"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700">Last Name</label>
                      <input
                        id="lastName"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label htmlFor="bio" className="block text-xs font-semibold text-gray-700">Bio</label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Freelancer Section */}
                  {role === 'freelancer' && (
                    <FreelancerSection
                      skills={skills}
                      onSkillsChange={setSkills}
                      experienceLevel={experienceLevel}
                      onExperienceLevelChange={setExperienceLevel}
                      portfolio={portfolio}
                      portfolioTitle={portfolioTitle}
                      onPortfolioTitleChange={setPortfolioTitle}
                      portfolioLink={portfolioLink}
                      onPortfolioLinkChange={setPortfolioLink}
                      onAddPortfolio={handleAddPortfolio}
                      onRemovePortfolio={(item) => setPortfolio(portfolio.filter((i) => i !== item))}
                    />
                  )}

                  {/* Client Section */}
                  {role === 'client' && (
                    <ClientSection
                      companyName={companyName}
                      onCompanyNameChange={setCompanyName}
                      companyWebsite={companyWebsite}
                      onCompanyWebsiteChange={setCompanyWebsite}
                    />
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => setRole('')}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition duration-200 border border-gray-300 text-sm"
                  >
                    <ArrowLeftIcon style={{ fontSize: '18px' }} />
                    Change Role
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-none text-sm"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
                 {/* Terms and Conditions */}
                <div className="py-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    By registering, you have accepted our{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Image Overlay */}
        <div className="lg:hidden absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-white/95 z-10"></div>
          <Image
            src="https://res.cloudinary.com/dipugmopt/image/upload/v1753531097/ChatGPT_Image_Jul_26_2025_05_27_45_PM_fklgic.png"
            alt="Professional workspace"
            className="w-full h-full object-cover opacity-10"
            width={100}
            height={100}
          />
        </div>
      </div>
    </main>
  );
}
