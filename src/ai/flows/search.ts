
'use server';
/**
 * @fileOverview A multi-source image search flow.
 * - searchFlow - A function that fetches images from multiple APIs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { SearchInput, SearchResult } from './search-types';

// Helper function to fetch from an API and handle errors
async function fetchFromAPI(url: string, headers: any, source: string): Promise<SearchResult[]> {
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            console.error(`Error fetching from ${source}: ${response.statusText}`);
            const errorBody = await response.text();
            console.error(`Error body from ${source}:`, errorBody);
            return [];
        }
        const data = await response.json();

        // Map the API-specific response to our standard SearchResult format
        if (source === 'Unsplash') {
            return (data.results || []).map((img: any) => ({
                src: img.urls.regular,
                alt: img.alt_description,
                source: 'Unsplash',
            })).slice(0, 20);
        }
        if (source === 'Pexels') {
            return (data.photos || []).map((img: any) => ({
                src: img.src.large,
                alt: img.alt,
                source: 'Pexels',
            })).slice(0, 20);
        }
        if (source === 'Pixabay') {
            return (data.hits || []).map((img: any) => ({
                src: img.largeImageURL,
                alt: img.tags,
                source: 'Pixabay',
            })).slice(0, 20);
        }
        return [];
    } catch (error: any) {
        console.error(`A critical error occurred while fetching from ${source}:`, error);
        return [];
    }
}

export const searchFlow = ai.defineFlow(
    {
        name: 'multiApiSearchFlow',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.array(z.object({
            src: z.string(),
            alt: z.string().optional(),
            source: z.string(),
        }))
    },
    async ({ query }) => {
        const encodedQuery = encodeURIComponent(query);

        const sources = [
            { 
                name: 'Unsplash', 
                url: `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=20`,
                headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
            },
            { 
                name: 'Pexels', 
                url: `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=20`,
                headers: { Authorization: process.env.PEXELS_API_KEY || '' }
            },
            { 
                name: 'Pixabay', 
                url: `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodedQuery}&per_page=20&safesearch=true`,
                headers: {}
            },
        ];

        const allImages: SearchResult[] = [];

        const fetchPromises = sources.map(source => 
            fetchFromAPI(source.url, source.headers, source.name)
        );

        const results = await Promise.all(fetchPromises);
        
        results.forEach(images => {
            if (images) {
                allImages.push(...images);
            }
        });

        console.log(`Found a total of ${allImages.length} images for query: "${query}"`);

        return allImages;
    }
);
