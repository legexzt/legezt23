
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
    try {
        const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: url,
                pageOptions: {
                    onlyMainContent: true,
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
            console.error(`Error scraping ${source}: Status ${response.status}, Body: ${errorBody}`);
            return [];
        }

        const result: any = await response.json();
        
        // Robust check for the extracted data
        if (result.data && result.data.llm_extraction && Array.isArray(result.data.llm_extraction.images) && result.data.llm_extraction.images.length > 0) {
          console.log(`Successfully extracted ${result.data.llm_extraction.images.length} images from ${source}.`);
          return result.data.llm_extraction.images.slice(0, 20).map((img: any) => ({ ...img, source }));
        } else {
          console.warn(`No images found in llm_extraction for ${source}. Full response:`, JSON.stringify(result, null, 2));
          return [];
        }
    } catch (error: any) {
        console.error(`A critical error occurred while scraping ${source}:`, error);
        return [];
    }
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
