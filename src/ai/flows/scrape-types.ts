
import { z } from 'genkit';

export const ScrapeUrlSchema = z.object({
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
