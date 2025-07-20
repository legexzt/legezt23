'use server';
/**
 * @fileOverview A flow to search the web for a query and return a structured summary.
 * - queryFlow - A function that takes a search query, finds a relevant URL, and uses Firecrawl to extract structured data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { QueryInput, QueryResult } from './query-types';

async function scrapeWithFirecrawl(url: string): Promise<any> {
    const firecrawlApiUrl = 'https://api.firecrawl.dev/v0/scrape';
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
        console.error("FIRECRAWL_API_KEY is not set.");
        throw new Error("Server configuration error: Missing Firecrawl API key.");
    }
    
    console.log(`Scraping URL with Firecrawl: ${url}`);

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
                },
                extractorOptions: {
                    mode: 'llm-extraction',
                    extractionPrompt: "Based on the content, extract a concise summary, a list of key bullet points, any data presented in a table, and a list of key external links. Ensure the output is clean and well-structured.",
                    jsonSchema: {
                        type: "object",
                        properties: {
                           summary: { type: "string" },
                           bulletPoints: { type: "array", items: { type: "string" } },
                           table: { type: "array", items: { type: "object", "minItems": 1, properties: {} } },
                           links: { type: "array", items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" }}}}
                        },
                        required: ["summary"]
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Firecrawl API error: ${response.statusText}`, errorBody);
            throw new Error(`Failed to scrape content from Firecrawl. Status: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        console.log("Firecrawl API Response:", JSON.stringify(result, null, 2));

        if (result.success && result.data && result.data.llm_extraction) {
            return {
                success: true,
                data: result.data.llm_extraction,
                metadata: result.data.metadata
            };
        } else {
             throw new Error(result.error || "Firecrawl returned an unsuccessful response or invalid data format.");
        }
    } catch (error: any) {
        console.error('A critical error occurred during the Firecrawl request:', error);
        throw new Error(error.message || 'An unexpected error occurred during scraping.');
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
        // Use a reliable search engine to find the most relevant link
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        console.log(`Starting query flow for: "${query}" by searching ${searchUrl}`);

        try {
            const result = await scrapeWithFirecrawl(searchUrl);

            if (result.success && result.data) {
                const llm_extraction = result.data;
                const metadata = result.metadata;

                const response: QueryResult = {
                    title: metadata?.title,
                    summary: llm_extraction?.summary,
                    bulletPoints: llm_extraction?.bulletPoints,
                    table: llm_extraction?.table,
                    links: llm_extraction?.links,
                    favicon: metadata?.favicon,
                    sourceURL: metadata?.sourceURL,
                };
                
                return response;
            } else {
                console.error("Query flow failed: No data from scrape.");
                return {};
            }
        } catch (error: any) {
            console.error(`Query flow failed for "${query}":`, error);
            // Re-throw the error to be caught by the client UI
            throw error;
        }
    }
);
