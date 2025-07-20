
"use server";

import ytdl from 'ytdl-core';

// Helper function to format duration from seconds to HH:MM:SS
const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  return new Date(seconds * 1000).toISOString().substr(11, 8).replace(/^(00:)?/, '');
};

export async function getVideoInfo(url: string) {
  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid YouTube URL.");
  }

  try {
    const info = await ytdl.getInfo(url);

    const mp4Formats = ytdl.filterFormats(info.formats, 'videoandaudio')
      .filter(f => f.container === 'mp4')
      .sort((a, b) => (b.height || 0) - (a.height || 0));
      
    const mp3Formats = ytdl.filterFormats(info.formats, 'audioonly')
      .filter(f => f.container === 'mp4') // m4a is mp4 audio
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

    if (mp4Formats.length === 0 && mp3Formats.length === 0) {
        throw new Error("No downloadable formats found. This video might be private or protected.");
    }
    
    return {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      author: info.videoDetails.author.name,
      duration: formatDuration(parseInt(info.videoDetails.lengthSeconds, 10)),
      url: info.videoDetails.video_url,
      mp4Formats: mp4Formats,
      mp3Formats: mp3Formats,
    };
  } catch (error: unknown) {
    console.error("YTDL Error:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && (error as any).statusCode === 410) {
        throw new Error("The video is unavailable. It might have been deleted or made private.");
    }
    throw new Error("Could not retrieve video information. It may be age-restricted, private, or a live stream.");
  }
}
