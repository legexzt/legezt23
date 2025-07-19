import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Clapperboard, FileQuestion, Gamepad2, Calculator, Music } from 'lucide-react';

const features = [
  {
    title: 'YouTube Downloader',
    description: 'Download and trim YouTube videos as MP3 or MP4.',
    href: '/youtube-downloader',
    icon: <Music className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Visual Q&A',
    description: 'Ask Gemini AI a question and get a visual answer.',
    href: '/visual-qa',
    icon: <Bot className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Snake Game',
    description: 'Play a classic game of snake with a modern twist.',
    href: '/snake-game',
    icon: <Gamepad2 className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Scientific Calculator',
    description: 'Perform complex calculations with ease.',
    href: '/calculator',
    icon: <Calculator className="h-8 w-8 text-primary" />,
  },
  {
    title: 'PDF Analyzer',
    description: 'Upload a PDF and ask questions about its content.',
    href: '/pdf-analyzer',
    icon: <FileQuestion className="h-8 w-8 text-primary" />,
  },
  {
    title: 'YouTube Notes Generator',
    description: 'Generate summary notes from any YouTube video.',
    href: '/notes-generator',
    icon: <Clapperboard className="h-8 w-8 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="container mx-auto">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to Legezt Lite
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A suite of powerful, AI-driven tools designed to streamline your digital tasks. From media downloading to complex analysis, Legezt Lite has you covered.
        </p>
        <Button asChild size="lg">
          <Link href="/youtube-downloader">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              {feature.icon}
              <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.href}>
                  Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
