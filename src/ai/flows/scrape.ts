
'use server';

/**
 * @fileOverview A flow to scrape a URL using Firecrawl.
 * 
 * - scrapeUrl - A function that scrapes a URL using Firecrawl.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ScrapeUrlInput, ScrapeResult } from './scrape-types';
import { ScrapeUrlSchema, ScrapeResultSchema } from './scrape-types';


export async function scrapeUrl(input: ScrapeUrlInput): Promise<ScrapeResult> {
  return await scrapeUrlFlow(input);
}

const scrapeUrlFlow = ai.defineFlow(
  {
    name: 'scrapeUrlFlow',
    inputSchema: ScrapeUrlSchema,
    outputSchema: ScrapeResultSchema,
  },
  async (input) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

    if (!firecrawlApiKey) {
      return { success: false, error: 'FIRECRAWL_API_KEY is not set in the environment variables.' };
    }

    try {
        const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firecrawlApiKey}`,
            },
            body: JSON.stringify({
                url: input.url,
                pageOptions: {
                    render: input.render,
                    waitFor: input.wait,
                }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Firecrawl API Error:', errorBody);
            return { success: false, error: errorBody.error || `Firecrawl API request failed with status ${response.status}.` };
        }

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error: any) {
        console.error('Error in scrapeUrlFlow:', error);
        return { success: false, error: error.message || 'An unexpected error occurred during scraping.' };
    }
  }
);

