import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import connectDB  from '@/mongo/db';
import UserData from '@/mongo/model/user';



export default async function ClientDashboardPage() {
  const { userId } =  auth();
  if (!userId) return redirect('/sign-in');

  await connectDB();
  const user = await UserData.findOne({ userId });

  if (!user || user.role !== 'client') {
    return redirect('/dashboard/freelancer'); // or 403 page
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <p>Welcome, {user.firstName}</p>
      {/* Jobs Posted, Proposals Received, etc. */}
    </section>
  );
}
