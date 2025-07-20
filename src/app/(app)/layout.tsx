'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    // If user is not logged in, redirect them to the login page
    if (!user) {
      router.push('/');
      return;
    }

  }, [user, loading, router, pathname]);

  // While loading or if no user, show a loading screen or nothing to prevent flashing content
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
