// app/profile/[userId]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getUserProfile(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${userId}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user;
}

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUserProfile(params.userId);

  if (!user) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Image
            src={user.profilePhoto || '/default-avatar.png'}
            alt={user.name}
            width={120}
            height={120}
            className="rounded-full object-cover border border-neutral-700"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sm text-neutral-400">{user.role === 'freelancer' ? 'Freelancer' : 'Client'}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {user.role === 'freelancer' && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Skills</h2>
                <p className="text-neutral-300">{user.skills?.join(', ') || 'N/A'}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Projects Done</h2>
                <p className="text-neutral-300">{user.projects_done || 0}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Portfolio</h2>
                {user.portfolio ? (
                  <Link
                    href={user.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    View Portfolio
                  </Link>
                ) : (
                  <p className="text-neutral-300">Not provided</p>
                )}
              </div>
            </>
          )}

          {user.role === 'client' && (
            <div>
              <h2 className="text-xl font-semibold">Jobs Posted</h2>
              <p className="text-neutral-300">{user.jobsPosted?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Placeholder for future features */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
          <p className="text-neutral-500 italic">Coming soon...</p>
        </div>
      </div>
    </main>
  );
}
