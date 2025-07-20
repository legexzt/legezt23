
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useState } from 'react';
import { useSearchStore } from '@/hooks/use-search';
import { usePathname } from 'next/navigation';

export function PageHeader() {
  const { user } = useAuth();
  const { query, setQuery } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const pathname = usePathname();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQuery(localQuery);
    }
  };
  
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="relative flex-1">
         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
         <Input
            type="search"
            placeholder={pathname.includes('/gallery') ? "Search images..." : "Search news..."}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleSearch}
         />
      </div>
    </header>
  );
}
