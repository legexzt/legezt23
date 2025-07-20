import { ReactNode } from 'react';
import MainSidebar from '@/components/main-sidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="group/sidebar flex">
          <MainSidebar />
          <main className="relative min-h-svh flex-1 bg-background peer-data-[variant=inset]:min-h-[calc(100svh-5rem)] peer-data-[state=expanded]:peer-data-[variant=inset]:ml-14">
            {children}
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
