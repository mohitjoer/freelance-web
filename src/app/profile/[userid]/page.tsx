import { notFound } from 'next/navigation';
import connectDB from '@/mongo/db';
import UserData from '@/mongo/model/user';
import Job from '@/mongo/model/jobschema';
import { toPlain } from '@/lib/serialize';
import ProfileView, { type IUser, type Project } from './ProfileView';
import type { Metadata } from "next";

async function getUserProfile(userId: string): Promise<IUser | null> {
  await connectDB();
  const user = await UserData.findOne({ userId }).select('-_id -__v').lean();
  if (!user) return null;
  // Serialize Mongo document into a plain JSON-safe object
  return toPlain(user) as IUser;
}

/**
 * Jobs this user was actually part of — assigned freelancer, or the client who
 * posted. Derived from the Job collection rather than the denormalised
 * `jobsFinished` / `jobsInProgress` arrays on the user doc, which are written in
 * one place and not maintained everywhere, so they drift.
 *
 * `finishedAt` is null while a job is in progress and sorts last under a
 * descending sort, so completed work leads.
 */
async function getProjects(user: IUser): Promise<Project[]> {
  await connectDB();
  const isFreelancer = user.role === 'freelancer';
  const filter = isFreelancer
    ? { freelancerId: user.userId }
    : { clientId: user.userId };

  const jobs = await Job.find({ ...filter, status: { $in: ['in-progress', 'completed'] } })
    .select('jobId title category status budget budgetType budgetMax finishedAt clientId freelancerId')
    .sort({ finishedAt: -1, createdAt: -1 })
    .limit(6)
    .lean();

  if (jobs.length === 0) return [];

  // One lookup for every counterparty, rather than one per card.
  const counterpartIds = [
    ...new Set(
      jobs
        .map((j) => (isFreelancer ? j.clientId : j.freelancerId))
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    ),
  ];
  const people = counterpartIds.length
    ? await UserData.find({ userId: { $in: counterpartIds } })
        .select('userId firstName lastName')
        .lean()
    : [];
  const nameById = new Map(
    people.map((p) => [p.userId, `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || 'Anonymous'])
  );

  return jobs.map((j) => {
    const counterpartId = isFreelancer ? j.clientId : j.freelancerId;
    return {
      jobId: j.jobId,
      title: j.title,
      category: j.category,
      status: j.status,
      budget: j.budget,
      budgetType: j.budgetType,
      budgetMax: j.budgetMax,
      finishedAt: j.finishedAt ? j.finishedAt.toISOString() : undefined,
      counterpartId,
      counterpartName: counterpartId ? (nameById.get(counterpartId) ?? 'Anonymous') : 'Anonymous',
    };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ userid: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await getUserProfile(resolvedParams.userid);
  if (!user) {
    return {
      title: "Profile Not Found",
      description: "This FreelanceBase profile does not exist.",
    };
  }

  const fullName = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;
  const roleStr = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const userBio = user.bio || `View the professional profile of ${fullName} (${roleStr}) on FreelanceBase.`;

  return {
    title: `${fullName} - ${roleStr} Profile`,
    description: userBio.slice(0, 160),
    openGraph: {
      title: `${fullName} - FreelanceBase Profile`,
      description: userBio.slice(0, 160),
      type: "profile",
      images: [user.userImage || "/default-avatar.png"],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ userid: string }> }) {
  // Await the params promise
  const resolvedParams = await params;
  const user = await getUserProfile(resolvedParams.userid);

  if (!user) return notFound();

  const projects = await getProjects(user);

  return <ProfileView user={user} projects={projects} />;
}
