import type { StreamMetadata } from "@/types";

const BASE_URL  = process.env.NEXT_PUBLIC_AZURACAST_BASE_URL ?? "";
const STATION   = process.env.NEXT_PUBLIC_AZURACAST_STATION_ID ?? "speaking-saints";
const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";

interface AzuraCastNowPlayingResponse {
  station: {
    name: string;
    description: string;
    listen_url: string;
  };
  now_playing: {
    song: {
      title: string;
      artist: string;
      album: string;
      art: string;
      duration: number;
    };
    elapsed: number;
  } | null;
  listeners: {
    current: number;
    unique: number;
    total: number;
  };
  live: {
    is_live: boolean;
  };
  is_online: boolean;
}

export async function fetchNowPlaying(): Promise<StreamMetadata> {
  if (!BASE_URL) {
    return getMockStreamData();
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/nowplaying/${STATION}`,
      {
        next: { revalidate: 15 },
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) return getMockStreamData();

    const data = (await res.json()) as AzuraCastNowPlayingResponse;

    return {
      isLive: data.is_online ?? false,
      listenersCount: data.listeners?.current ?? 0,
      nowPlaying: data.now_playing
        ? {
            title:    data.now_playing.song.title,
            artist:   data.now_playing.song.artist,
            album:    data.now_playing.song.album,
            artwork:  data.now_playing.song.art,
            duration: data.now_playing.song.duration,
            elapsed:  data.now_playing.elapsed,
          }
        : null,
      streamUrl: STREAM_URL || data.station.listen_url,
      stationName: data.station.name,
      stationDescription: data.station.description,
    };
  } catch {
    return getMockStreamData();
  }
}

function getMockStreamData(): StreamMetadata {
  return {
    isLive: true,
    listenersCount: 0,
    nowPlaying: {
      title:  "Morning Devotional – Speaking Saints",
      artist: "Speaking Saints",
      album:  "Daily Programming",
      duration: 300,
      elapsed:  42,
    },
    streamUrl: STREAM_URL,
    stationName: "Speaking Saints",
    stationDescription: "24/7 Faith-Based Audio Platform",
  };
}

export function formatElapsed(elapsed: number, duration: number): string {
  const pct = duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0;
  return `${Math.round(pct)}%`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
