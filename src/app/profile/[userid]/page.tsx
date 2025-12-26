import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink, Briefcase,Calendar, Award } from 'lucide-react';
import BackButton from '@/components/backbutton';


interface IPortfolio {
  title: string;
  link: string;
  description?: string;
}

interface IUser {
  userId: string;               
  userImage: string;             
  firstName: string;
  lastName?: string;
  role: 'freelancer' | 'client'; 
  bio?: string;
  skills?: string[];
  projects_done?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  portfolio?: IPortfolio[];
  companyName?: string;  
  companyWebsite?: string;
  jobsPosted?: string[];
  jobsInProgress?: string[];
  jobsFinished?: string[];
  jobsProposed?: string[];
  ratings?: number;
  reviews?: string[];
  createdAt: string;
  updatedAt: string;
}

async function getUserProfile(userId: string): Promise<IUser | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) || 
                  'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/profile/${userId}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user;
}


const ExperienceBadge = ({ level }: { level: string }) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    expert: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[level as keyof typeof colors]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-neutral-300">({rating.toFixed(1)})</span>
    </div>
  );
};

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  // Await the params promise
  const resolvedParams = await params;
  const user = await getUserProfile(resolvedParams.userId);

  if (!user) return notFound();

  const fullName = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;

  return (
    <main>
      <div className="w-full overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b w-full bg-linear-to-bl from-green-300 to-emerald-600 border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <BackButton/>
            <Image
              src={user.userImage || '/default-avatar.png'}
              alt={fullName}
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-neutral-700"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{fullName}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.role === 'freelancer' ? 'bg-blue-600' : 'bg-linear-to-b from-green-300 to-green-400'
                }`}>
                  {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
                </span>
              </div>
              
              {user.bio && (
                <p className="text-lg text-neutral-300 mb-4 max-w-2xl">{user.bio}</p>
              )}
              
              {user.ratings === 0 && (
                <div className="mb-4">
                  <RatingStars rating={user.ratings} />
                </div>
              )}
              
              {user.role === 'freelancer' && user.experienceLevel && (
                <div className="mb-4">
                  <ExperienceBadge level={user.experienceLevel} />
                </div>
              )}
              
              {user.role === 'client' && user.companyName && (
                <div className="flex items-center gap-2 text-neutral-300">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-lg">{user.companyName}</span>
                  {user.companyWebsite && (
                    <Link 
                      href={user.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Skills (Freelancers) */}
            {user.role === 'freelancer' && user.skills && user.skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-neutral-800 border text-white  border-neutral-700 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio (Freelancers) */}
            {user.role === 'freelancer' && user.portfolio && user.portfolio.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
                <div className="space-y-4">
                  {user.portfolio.map((item: IPortfolio, index: number) => (
                    <div key={index} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-neutral-400 mt-1">{item.description}</p>
                          )}
                        </div>
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                {user.role === 'freelancer' && (
                  <>
                    <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{user.projects_done || 0}</div>
                      <div className="text-sm text-neutral-400">Projects Completed</div>
                    </div>
                    <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{user.jobsProposed?.length || 0}</div>
                      <div className="text-sm text-neutral-400">Proposals Sent</div>
                    </div>
                  </>
                )}
                
                {user.role === 'client' && (
                  <div className="p-4 bg-purple-100 border border-purple-400 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">{user.jobsPosted?.length || 0}</div>
                    <div className="text-sm text-neutral-400">Jobs Posted</div>
                  </div>
                )}
                
                <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">{user.jobsInProgress?.length || 0}</div>
                  <div className="text-sm text-neutral-400">Active Projects</div>
                </div>
                
                <div className="p-4 bg-emerald-100 border border-emerald-400 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">{user.jobsFinished?.length || 0}</div>
                  <div className="text-sm text-neutral-400">Completed Projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Reviews & Feedback</h2>
              {user.reviews && user.reviews.length > 0 ? (
                <div className="space-y-4">
                  {user.reviews.slice(0, 3).map((reviewId: string, index: number) => (
                    <div key={index} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                      <div className="text-sm text-neutral-400">Review ID: {reviewId}</div>
                      <div className="text-sm text-neutral-500 mt-2">
                        Review details would be fetched separately
                      </div>
                    </div>
                  ))}
                  {user.reviews.length > 3 && (
                    <div className="text-center">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        View all {user.reviews.length} reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-neutral-800 border border-neutral-700 rounded-lg text-center">
                  <div className="text-neutral-500 mb-2">No reviews yet</div>
                  <div className="text-sm text-neutral-600">
                    {user.role === 'freelancer' ? 
                      'Complete your first project to receive reviews' : 
                      'Reviews from completed projects will appear here'}
                  </div>
                </div>
              )}
            </div>

            {/* Member Since */}
            <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar className="w-5 h-5" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}