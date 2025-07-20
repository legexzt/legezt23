'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Clapperboard, FileQuestion, Gamepad2, Home, Calculator, Music, Sparkles, Settings, User } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator
} from '@/components/ui/sidebar';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/youtube-downloader', label: 'Downloader', icon: Music },
  { href: '/visual-qa', label: 'Visual Q&A', icon: Bot },
  { href: '/snake-game', label: 'Snake Game', icon: Gamepad2 },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/pdf-analyzer', label: 'PDF Analyzer', icon: FileQuestion },
  { href: '/notes-generator', label: 'Notes Generator', icon: Clapperboard },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Legezt</h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                href={link.href}
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Profile">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
