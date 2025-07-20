
'use client';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
