
'use server';

/**
 * @fileOverview A flow to scrape a URL using Firecrawl.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScrapeUrlSchema = z.object({
  url: z.string().url(),
  render: z.boolean().optional().default(true),
  wait: z.number().optional().default(2000),
});

export type ScrapeUrlInput = z.infer<typeof ScrapeUrlSchema>;

export const ScrapeResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});
export type ScrapeResult = z.infer<typeof ScrapeResultSchema>;


export const scrapeUrl = ai.defineFlow(
  {
    name: 'scrapeUrl',
    inputSchema: ScrapeUrlSchema,
    outputSchema: ScrapeResultSchema,
  },
  async (input) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY is not set in the environment variables.');
    }

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
        const errorBody = await response.text();
        console.error('Firecrawl API Error:', errorBody);
        return { success: false, error: `Firecrawl API request failed with status ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  }
);
