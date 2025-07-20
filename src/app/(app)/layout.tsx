import { ReactNode } from 'react';
import MainSidebar from '@/components/main-sidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer base {
          :root {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 210 40% 98%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 212.7 26.8% 83.9%;
            --radius: 0.5rem;
          }

          body {
            @apply bg-background text-foreground;
          }
        }
      `}</style>
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
    </>
  );
}