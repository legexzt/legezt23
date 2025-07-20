'use server';
/**
 * @fileOverview A flow to search the web for a query and return a structured summary using Firecrawl's Search API.
 * - queryFlow - A function that takes a search query and uses Firecrawl to find and extract structured data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { QueryResult } from './query-types';

async function searchWithFirecrawl(query: string): Promise<any> {
    const firecrawlApiUrl = 'https://api.firecrawl.dev/v0/search';
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
        console.error("FIRECRAWL_API_KEY is not set.");
        throw new Error("Server configuration error: Missing Firecrawl API key.");
    }
    
    console.log(`Searching with Firecrawl for: "${query}"`);

    try {
        const response = await fetch(firecrawlApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                query: query,
                pageOptions: {
                    onlyMainContent: true,
                },
                searchOptions: {
                    limit: 1 // We only need the top result for a concise summary
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
            console.error(`Firecrawl Search API error: ${response.statusText}`, errorBody);
            throw new Error(`Failed to search with Firecrawl. Status: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        console.log("Firecrawl Search API Response:", JSON.stringify(result, null, 2));

        if (result.success && result.data && result.data.length > 0) {
             const topResult = result.data[0];
            // The structured data is in llm_extraction, metadata is separate
            return {
                success: true,
                data: topResult.llm_extraction,
                metadata: topResult.metadata
            };
        } else {
             throw new Error(result.error || "Firecrawl returned an unsuccessful response or no data.");
        }
    } catch (error: any) {
        console.error('A critical error occurred during the Firecrawl search request:', error);
        throw new Error(error.message || 'An unexpected error occurred during search.');
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

        try {
            const result = await searchWithFirecrawl(query);

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
                console.error("Query flow failed: No data from Firecrawl search.");
                // This path should ideally not be taken due to error throwing in the search function
                return {}; 
            }
        } catch (error: any) {
            console.error(`Query flow failed for "${query}":`, error);
            // Re-throw the error to be caught by the client UI
            throw error;
        }
    }
);
