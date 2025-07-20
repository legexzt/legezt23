
'use server';
/**
 * @fileOverview A multi-source image search flow.
 * - searchFlow - A function that scrapes multiple image sites for a query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { SearchInput, SearchResult } from './search-types';

const searchScrapeFlow = ai.defineFlow(
  {
    name: 'searchScrapeFlow',
    inputSchema: z.object({ url: z.string(), source: z.string() }),
    outputSchema: z.array(z.object({
        src: z.string(),
        alt: z.string().optional(),
        source: z.string(),
    })),
  },
  async ({ url, source }) => {
    console.log(`Scraping ${source} at url: ${url}`);
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
            url: url,
            pageOptions: {
                onlyMainContent: true, // Try to get cleaner data
            },
            extractorOptions: {
                mode: 'llm-extraction',
                jsonSchema: {
                    type: 'object',
                    properties: {
                        images: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    src: { type: 'string' },
                                    alt: { type: 'string' },
                                },
                                required: ['src'],
                            },
                        },
                    },
                    required: ['images'],
                },
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error scraping ${source}: ${errorBody}`);
        return [];
    }

    const result: any = await response.json();
    
    // Corrected logic: check for data.llm_extraction.images
    if (result.data && result.data.llm_extraction && result.data.llm_extraction.images) {
      return result.data.llm_extraction.images.slice(0, 20).map((img: any) => ({ ...img, source }));
    }

    return [];
  }
);


export const searchFlow = ai.defineFlow(
    {
        name: 'multiSourceSearchFlow',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.array(z.object({
            src: z.string(),
            alt: z.string().optional(),
            source: z.string(),
        }))
    },
    async ({ query }) => {
        const encodedQuery = encodeURIComponent(query);

        // We exclude Pinterest as it's often blocked.
        // We exclude Wallhaven as its layout is hard to parse reliably.
        const sources = [
            { name: 'Unsplash', url: `https://unsplash.com/s/photos/${encodedQuery}` },
            { name: 'Pexels', url: `https://www.pexels.com/search/${encodedQuery}/` },
            { name: 'Pixabay', url: `https://pixabay.com/images/search/${encodedQuery}/` },
        ];

        const allImages: SearchResult[] = [];

        const scrapingPromises = sources.map(source => 
            searchScrapeFlow({ url: source.url, source: source.name })
        );

        const results = await Promise.all(scrapingPromises);
        
        results.forEach(images => {
            if (images) {
                allImages.push(...images);
            }
        });

        console.log(`Found a total of ${allImages.length} images for query: "${query}"`);

        return allImages;
    }
);
