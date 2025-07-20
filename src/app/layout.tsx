
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { FirebaseProvider } from '@/components/firebase-provider';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Legezt - Anime Visuals & News',
    template: '%s - Legezt',
  },
  description: 'Premium Anime Visual & News Web App powered by Firebase and Firecrawl.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', spaceGrotesk.variable, 'min-h-screen bg-background')}>
        <FirebaseProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
