'use server';
/**
 * @fileOverview A flow to search the web for a query and return a structured summary.
 * - This flow first uses the Brave Search API to find the most relevant URL for a query.
 * - Then, it uses Firecrawl's Scrape API to extract a structured summary from that URL.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { QueryResult } from './query-types';

async function searchWithBrave(query: string): Promise<string | null> {
    const braveApiUrl = `https://brave-web-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}`;
    const apiKey = process.env.BRAVE_SEARCH_API_KEY;

    if (!apiKey) {
        console.error("BRAVE_SEARCH_API_KEY is not set.");
        throw new Error("Server configuration error: Missing Brave Search API key.");
    }
    
    console.log(`Searching with Brave for: "${query}"`);

    try {
        const response = await fetch(braveApiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'brave-web-search.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Brave Search API error: ${response.statusText}`, errorBody);
            throw new Error(`Failed to search with Brave. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Brave Search API Response:", JSON.stringify(result, null, 2));

        if (result.web && result.web.results && result.web.results.length > 0) {
            const topUrl = result.web.results[0].url;
            console.log(`Found top URL: ${topUrl}`);
            return topUrl;
        } else {
            console.log("No relevant URL found in Brave Search results.");
            return null;
        }
    } catch (error: any) {
        console.error('A critical error occurred during the Brave search request:', error);
        throw new Error(error.message || 'An unexpected error occurred during Brave search.');
    }
}

async function scrapeWithFirecrawl(url: string): Promise<any> {
    const firecrawlApiUrl = 'https://api.firecrawl.dev/v0/scrape';
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
        console.error("FIRECRAWL_API_KEY is not set.");
        throw new Error("Server configuration error: Missing Firecrawl API key.");
    }
    
    console.log(`Scraping with Firecrawl: "${url}"`);

    try {
        const response = await fetch(firecrawlApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                url: url,
                pageOptions: {
                    onlyMainContent: true,
                    includeHtml: false,
                },
                extractorOptions: {
                    mode: 'llm-extraction',
                    extractionPrompt: "Based on the content, extract a concise summary, a list of key bullet points, any data presented in a table, and a list of key external links. Ensure the output is clean and well-structured.",
                    jsonSchema: {
                        type: "object",
                        properties: {
                           summary: { type: "string" },
                           bulletPoints: { type: "array", items: { type: "string" } },
                           table: { type: "array", items: { type: "object" } },
                           links: { type: "array", items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" }}}}
                        },
                        required: ["summary"]
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Firecrawl Scrape API error: ${response.statusText}`, errorBody);
            throw new Error(`Failed to scrape with Firecrawl. Status: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        console.log("Firecrawl Scrape API Response:", JSON.stringify(result, null, 2));

        if (result.success && result.data && result.data.llm_extraction) {
            return {
                success: true,
                data: result.data.llm_extraction,
                metadata: result.data.metadata
            };
        } else {
             throw new Error(result.error || "Firecrawl returned an unsuccessful response or no data.");
        }
    } catch (error: any) {
        console.error('A critical error occurred during the Firecrawl scrape request:', error);
        throw new Error(error.message || 'An unexpected error occurred during scrape.');
    }
}

export const queryFlow = ai.defineFlow(
    {
        name: 'queryFlow',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.object({
            title: z.string().optional(),
            summary: z.string().optional(),
            bulletPoints: z.array(z.string()).optional(),
            table: z.array(z.any()).optional(),
            links: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
            favicon: z.string().optional(),
            sourceURL: z.string().optional(),
        })
    },
    async ({ query }) => {
        console.log(`Starting query flow for: "${query}"`);

        const relevantUrl = await searchWithBrave(query);

        if (!relevantUrl) {
            throw new Error("Could not find a relevant URL for the query.");
        }

        const result = await scrapeWithFirecrawl(relevantUrl);

        if (result.success && result.data) {
            const llm_extraction = result.data;
            const metadata = result.metadata;

            const response: QueryResult = {
                title: metadata?.title,
                summary: llm_extraction?.summary,
                bulletPoints: llm_extraction?.bulletPoints,
                table: llm_extraction?.table,
                links: llm_extraction?.links,
                favicon: metadata?.ogImage, // Use ogImage as favicon might not be available
                sourceURL: metadata?.sourceURL,
            };
            
            return response;
        } else {
            // This path should ideally not be taken due to error throwing in the scrape function
            throw new Error("Failed to get structured data from Firecrawl.");
        }
    }
);
