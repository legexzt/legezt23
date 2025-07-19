'use server';
/**
 * @fileOverview A flow to fetch metadata for a YouTube video.
 *
 * - fetchYoutubeInfo - Fetches metadata like title, thumbnail, duration, and channel.
 * - FetchYoutubeInfoInput - The input type for the fetchYoutubeInfo function.
 * - FetchYoutubeInfoOutput - The return type for the fetchYoutubeInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import play from 'play-dl';

const FetchYoutubeInfoInputSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the YouTube video.'),
});
export type FetchYoutubeInfoInput = z.infer<typeof FetchYoutubeInfoInputSchema>;

const FetchYoutubeInfoOutputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  thumbnail: z.string().url().describe('The URL of the video thumbnail.'),
  duration: z.number().describe('The duration of the video in seconds.'),
  channel: z.string().describe('The name of the YouTube channel.'),
});
export type FetchYoutubeInfoOutput = z.infer<typeof FetchYoutubeInfoOutputSchema>;

export async function fetchYoutubeInfo(input: FetchYoutubeInfoInput): Promise<FetchYoutubeInfoOutput> {
  return fetchYoutubeInfoFlow(input);
}

const fetchYoutubeInfoFlow = ai.defineFlow(
  {
    name: 'fetchYoutubeInfoFlow',
    inputSchema: FetchYoutubeInfoInputSchema,
    outputSchema: FetchYoutubeInfoOutputSchema,
  },
  async ({ videoUrl }) => {
    try {
      const info = await play.video_info(videoUrl);
      const videoDetails = info.video_details;

      if (!videoDetails) {
        throw new Error('Could not retrieve video details.');
      }

      return {
        title: videoDetails.title || 'Untitled',
        thumbnail: videoDetails.thumbnails[0]?.url,
        duration: videoDetails.durationInSec,
        channel: videoDetails.channel?.name || 'Unknown Channel',
      };
    } catch (error) {
      console.error('Error fetching YouTube info with play-dl:', error);
      throw new Error(`Failed to fetch video information for ${videoUrl}`);
    }
  }
);
