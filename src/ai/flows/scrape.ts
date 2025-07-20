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

// Helper to parse image URLs from Markdown
function parseImagesFromMarkdown(markdown: string): { src: string; alt: string }[] {
    if (!markdown) return [];
    const imageRegex = /!\[(?<alt>.*?)\]\((?<src>.*?)\)/g;
    const images = [];
    let match;
    while ((match = imageRegex.exec(markdown)) !== null) {
        if (match.groups) {
            images.push({
                src: match.groups.src,
                alt: match.groups.alt,
            });
        }
    }
    return images;
}


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

        const responseData = await response.json();

        if (responseData.success && responseData.data && responseData.data.markdown) {
            const images = parseImagesFromMarkdown(responseData.data.markdown);
            // We are creating a new data object that matches what the frontend expects
            const formattedData = {
                ...responseData.data,
                images: images
            };
            return { success: true, data: formattedData };
        } else {
             return { success: false, error: 'Scraped data is missing markdown content.' };
        }

    } catch (error: any) {
        console.error('Error in scrapeUrlFlow:', error);
        return { success: false, error: error.message || 'An unexpected error occurred during scraping.' };
    }
  }
);