'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryFlow } from '@/ai/flows/query';
import type { QueryResult } from '@/ai/flows/query-types';
import Image from 'next/image';

function QuerySkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}


export default function QueriesPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<QueryResult | null>(null);
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            toast({ title: "Please enter a search query.", variant: "destructive" });
            return;
        }
        setLoading(true);
        setResult(null);

        try {
            const res = await queryFlow({ query });
            if (res && res.summary) {
                setResult(res);
            } else {
                toast({
                    title: 'No results found',
                    description: 'Could not fetch information for that query. Please try another.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
             toast({
                title: 'An error occurred',
                description: error.message || 'Failed to fetch data.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">LEGEZT QUERIES</h1>
                    <p className="text-muted-foreground mt-2">
                        Search anything. Get instant article summaries, tables, lists, links — all from the live web using Firecrawl.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                    <Input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything... e.g., Doraemon, Neuralink, One Piece"
                        className="flex-grow"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Searching...' : <Search className="h-4 w-4" />}
                    </Button>
                </form>

                {loading && <QuerySkeleton />}

                {!loading && !result && (
                     <div className="text-center text-muted-foreground mt-16 flex flex-col items-center gap-4">
                        <Globe className="h-16 w-16" />
                        <h2 className="text-2xl font-semibold">Discover Knowledge</h2>
                        <p>Your search results will appear here.</p>
                    </div>
                )}

                {result && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                {result.favicon && <Image src={result.favicon} alt="favicon" width={16} height={16} unoptimized />}
                                <CardTitle>{result.title}</CardTitle>
                            </div>
                            {result.sourceURL && <CardDescription>Source: <a href={result.sourceURL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{result.sourceURL}</a></CardDescription>}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {result.summary && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Summary</h3>
                                    <p className="text-muted-foreground">{result.summary}</p>
                                </div>
                            )}
                             {result.bulletPoints && result.bulletPoints.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Key Points</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {result.bulletPoints.map((point, index) => <li key={index}>{point}</li>)}
                                    </ul>
                                </div>
                            )}
                            {result.table && result.table.length > 0 && Array.isArray(result.table) && Object.keys(result.table[0]).length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Data Table</h3>
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-muted">
                                                <tr>
                                                    {Object.keys(result.table[0]).map(key => <th key={key} className="p-2 text-left font-semibold">{key}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.table.map((row, index) => (
                                                    <tr key={index} className="border-t">
                                                        {Object.values(row).map((value: any, i) => <td key={i} className="p-2 text-muted-foreground">{typeof value === 'object' ? JSON.stringify(value) : value}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                             {result.links && result.links.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">External Links</h3>
                                     <ul className="space-y-1">
                                        {result.links.map((link, index) => (
                                            <li key={index}>
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">
                                                    {link.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
