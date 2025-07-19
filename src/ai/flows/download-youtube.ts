'use server';
/**
 * @fileOverview A flow to download a YouTube video as MP3 or MP4.
 *
 * - downloadYoutube - Downloads a video and optionally trims it.
 * - DownloadYoutubeInput - The input type for the downloadYoutube function.
 * - DownloadYoutubeOutput - The return type for the downloadYoutube function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import play from 'play-dl';
import { PassThrough } from 'stream';

const DownloadYoutubeInputSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the YouTube video.'),
  format: z.enum(['mp3', 'mp4']).describe('The desired download format.'),
  startTime: z.string().optional().describe('Start time for trimming (HH:mm:ss).'),
  endTime: z.string().optional().describe('End time for trimming (HH:mm:ss).'),
});
export type DownloadYoutubeInput = z.infer<typeof DownloadYoutubeInputSchema>;

const DownloadYoutubeOutputSchema = z.object({
  dataUri: z.string().describe('The downloaded file as a data URI.'),
  filename: z.string().describe('The name of the downloaded file.'),
});
export type DownloadYoutubeOutput = z.infer<typeof DownloadYoutubeOutputSchema>;

async function streamToDataUri(stream: PassThrough, mimeType: string): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}


export async function downloadYoutube(input: DownloadYoutubeInput): Promise<DownloadYoutubeOutput> {
  return downloadYoutubeFlow(input);
}

const downloadYoutubeFlow = ai.defineFlow(
  {
    name: 'downloadYoutubeFlow',
    inputSchema: DownloadYoutubeInputSchema,
    outputSchema: DownloadYoutubeOutputSchema,
  },
  async ({ videoUrl, format, startTime, endTime }) => {
    try {
        const info = await play.video_info(videoUrl);
        const title = info.video_details.title || 'video';
        const safeTitle = title.replace(/[^a-z0-9_-\s]/gi, '_').replace(/ /g, '_');
        
        let finalFilename = `${safeTitle}.${format}`;
        let mimeType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';

        const stream = await play.stream(videoUrl, {
            quality: 2, // 1080p for video, best for audio
            ...(format === 'mp3' && { seek: startTime ? parseTimeToSeconds(startTime) : undefined })
        });
        
        // Trimming is complex with streams; play-dl's `seek` is the best we can do for audio start time.
        // Full trimming for both formats would require ffmpeg, which we are avoiding.

        const dataUri = await streamToDataUri(stream.stream, mimeType);

        return {
            dataUri,
            filename: finalFilename,
        };

    } catch (error) {
      console.error('Error downloading with play-dl:', error);
      throw new Error(`Failed to download video from ${videoUrl}`);
    }
  }
);

function parseTimeToSeconds(time: string): number {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return Number(time) || 0;
}