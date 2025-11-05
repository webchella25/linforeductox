import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardWrapper>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="lg:pl-64 min-h-screen">
          <DashboardHeader user={session.user} />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardWrapper>
  );
}
