// app/dashboard/layout.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="lg:pl-64 min-h-screen">
          {/* Header del Dashboard */}
          <DashboardHeader user={session?.user} />

          {/* Content */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardWrapper>
  );
}