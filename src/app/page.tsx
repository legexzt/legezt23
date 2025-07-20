import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Clapperboard, FileQuestion, Gamepad2, Calculator, Music, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'YouTube Downloader',
    description: 'Download and trim YouTube videos as MP3 or MP4.',
    href: '/youtube-downloader',
    icon: <Music className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'youtube downloader',
        hint: 'music audio'
    }
  },
  {
    title: 'Visual Q&A',
    description: 'Ask Gemini AI a question and get a visual answer.',
    href: '/visual-qa',
    icon: <Bot className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'visual qa',
        hint: 'robot ai'
    }
  },
  {
    title: 'Snake Game',
    description: 'Play a classic game of snake with a modern twist.',
    href: '/snake-game',
    icon: <Gamepad2 className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'snake game',
        hint: 'game retro'
    }
  },
  {
    title: 'Scientific Calculator',
    description: 'Perform complex calculations with ease.',
    href: '/calculator',
    icon: <Calculator className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'calculator',
        hint: 'math calculation'
    }
  },
  {
    title: 'PDF Analyzer',
    description: 'Upload a PDF and ask questions about its content.',
    href: '/pdf-analyzer',
    icon: <FileQuestion className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'pdf analyzer',
        hint: 'document analysis'
    }
  },
  {
    title: 'YouTube Notes Generator',
    description: 'Generate summary notes from any YouTube video.',
    href: '/notes-generator',
    icon: <Clapperboard className="h-6 w-6 text-primary" />,
    image: {
        src: 'https://placehold.co/400x300.png',
        alt: 'notes generator',
        hint: 'notes video'
    }
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative bg-gradient-to-b from-[#202549] to-[#12142E] text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Legezt Developer
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-lg">
                      A suite of powerful, AI-driven tools designed to streamline your digital tasks. From media downloading to complex analysis, Legezt Lite has you covered.
                    </p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      <Link href="/youtube-downloader">
                        Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Developer tools illustration"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl"
                        data-ai-hint="developer tools"
                    />
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.href} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                <CardHeader className="p-0">
                  <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover"
                      data-ai-hint={feature.image.hint}
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={feature.href}>
                      Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="bg-card rounded-lg p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Skilled in Legezt</h2>
                  <p className="text-muted-foreground">
                      Leverage the full power of our platform to build, deploy, and scale your applications with unparalleled speed and reliability.
                  </p>
              </div>
              <div>
                 <Image
                      src="https://placehold.co/500x300.png"
                      alt="Abstract technology"
                      width={500}
                      height={300}
                      className="rounded-lg w-full"
                      data-ai-hint="abstract technology"
                 />
              </div>
          </div>
      </section>

    </div>
  );
}
