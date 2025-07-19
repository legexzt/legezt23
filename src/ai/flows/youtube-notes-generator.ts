'use server';

/**
 * @fileOverview A YouTube video notes generator AI agent.
 *
 * - youtubeNotesGenerator - A function that handles the YouTube video notes generation process.
 * - YoutubeNotesGeneratorInput - The input type for the youtubeNotesGenerator function.
 * - YoutubeNotesGeneratorOutput - The return type for the youtubeNotesGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YoutubeNotesGeneratorInputSchema = z.object({
  youtubeVideoLink: z.string().describe('The link to the YouTube video.'),
});
export type YoutubeNotesGeneratorInput = z.infer<typeof YoutubeNotesGeneratorInputSchema>;

const YoutubeNotesGeneratorOutputSchema = z.object({
  notes: z.string().describe('The bullet-point notes summarizing the video content.'),
});
export type YoutubeNotesGeneratorOutput = z.infer<typeof YoutubeNotesGeneratorOutputSchema>;

export async function youtubeNotesGenerator(input: YoutubeNotesGeneratorInput): Promise<YoutubeNotesGeneratorOutput> {
  return youtubeNotesGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeNotesGeneratorPrompt',
  input: {schema: YoutubeNotesGeneratorInputSchema},
  output: {schema: YoutubeNotesGeneratorOutputSchema},
  prompt: `You are an AI assistant that summarizes YouTube video transcripts into bullet-point notes.

  Given the following YouTube video link, extract the transcript and generate bullet-point notes summarizing the video's content.

  YouTube Video Link: {{{youtubeVideoLink}}}
  `,
});

const youtubeNotesGeneratorFlow = ai.defineFlow(
  {
    name: 'youtubeNotesGeneratorFlow',
    inputSchema: YoutubeNotesGeneratorInputSchema,
    outputSchema: YoutubeNotesGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
