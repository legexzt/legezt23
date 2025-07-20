
'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const themes = [
  { name: 'Default', class: 'theme-default', color: 'hsl(255 90% 60%)' },
  { name: 'Dark', class: 'dark', color: 'hsl(243 85% 65%)' },
  { name: 'Forest', class: 'theme-forest', color: 'hsl(100 60% 50%)' },
  { name: 'Ocean', class: 'theme-ocean', color: 'hsl(200 80% 55%)' },
  { name: 'Sunset', class: 'theme-sunset', color: 'hsl(30 90% 60%)' },
  { name: 'Lavender', class: 'theme-lavender', color: 'hsl(250 65% 60%)' },
  { name: 'Matrix', class: 'theme-matrix', color: 'hsl(130 100% 50%)' },
  { name: 'Rose', class: 'theme-rose', color: 'hsl(340 80% 60%)' },
  { name: 'Sky', class: 'theme-sky', color: 'hsl(190 80% 65%)' },
  { name: 'Coffee', class: 'theme-coffee', color: 'hsl(35 40% 40%)' },
  { name: 'Slate', class: 'theme-slate', color: 'hsl(210 30% 60%)' },
  { name: 'Candy', class: 'theme-candy', color: 'hsl(330 90% 65%)' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Settings</CardTitle>
          <CardDescription>Customize the look and feel of your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-lg font-medium">Appearance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {themes.map((t) => (
              <div key={t.class} className="space-y-2">
                <button
                  onClick={() => setTheme(t.class)}
                  className={cn(
                    'flex items-center justify-center w-full h-16 rounded-lg border-2 transition-colors',
                    theme === t.class ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                  )}
                  style={{ backgroundColor: t.color }}
                  aria-label={`Select ${t.name} theme`}
                >
                  {theme === t.class && <Check className="h-6 w-6 text-primary-foreground" />}
                </button>
                <p className="text-center text-sm font-medium">{t.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
