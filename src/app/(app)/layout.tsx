
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    // If user is not logged in, redirect them to the login page
    if (!user) {
      router.push('/');
      return;
    }

  }, [user, loading, router]);

  // While loading or if no user, show a loading screen or nothing to prevent flashing content
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
