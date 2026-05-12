import { NextResponse } from "next/server";
import { fetchNowPlaying } from "@/lib/streaming/azuracast";

export const revalidate = 0;

export async function GET() {
  try {
    const metadata = await fetchNowPlaying();
    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("[stream-metadata]", err);
    return NextResponse.json(
      {
        isLive: false,
        listenersCount: 0,
        nowPlaying: null,
        streamUrl: process.env.NEXT_PUBLIC_STREAM_URL ?? "",
        stationName: "Speaking Saints",
      },
      { status: 200 }
    );
  }
}
