'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from 'next/image';

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
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <PersonIcon className="text-xl" />
                      <span className="text-base">I&apos;m looking for Freelance Work</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setRole('client')}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                      <label className="block text-xs font-semibold text-gray-700">First Name</label>
                      <input
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700">Last Name</label>
                      <input
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Freelancer Section */}
                  {role === 'freelancer' && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">Skills</label>
                        <input
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g. Video editing, Web development, React"
                          required
                        />
                        <p className="text-xs text-gray-500">Separate skills with commas</p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">Experience Level</label>
                        <select
                          value={experienceLevel}
                          onChange={e => setExperienceLevel(e.target.value as 'beginner' | 'intermediate' | 'expert')}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="beginner">Beginner (0-2 years)</option>
                          <option value="intermediate">Intermediate (2-5 years)</option>
                          <option value="expert">Expert (5+ years)</option>
                        </select>
                      </div>

                      {/* Portfolio Section */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">Portfolio Links</label>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={portfolioTitle}
                              onChange={(e) => setPortfolioTitle(e.target.value)}
                              placeholder="Project title"
                              className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="url"
                              value={portfolioLink}
                              onChange={(e) => setPortfolioLink(e.target.value)}
                              placeholder="https://yourproject.com"
                              className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddPortfolio}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 font-medium text-sm"
                          >
                            Add Portfolio Item
                          </button>
                        </div>
                        
                        {portfolio.length > 0 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            <h4 className="text-xs font-medium text-gray-700">Your Portfolio:</h4>
                            <div className="space-y-1">
                              {portfolio.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.link}</p>
                                  </div>
                                  <button
                                    onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                    title="Remove portfolio item"
                                  >
                                    <DeleteOutlineIcon style={{ fontSize: '16px' }} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Client Section */}
                  {role === 'client' && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">Company Name</label>
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g. Acme Inc."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">Company Website</label>
                        <input
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => setRole('')}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 border border-gray-300 text-sm"
                  >
                    <ArrowLeftIcon style={{ fontSize: '18px' }} />
                    Change Role
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-none text-sm"
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
                    <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      Terms and Conditions
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                      Privacy Policy
                    </a>
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