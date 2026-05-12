"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StreamMetadata } from "@/types";

interface AudioPlayerProps {
  streamMetadata: StreamMetadata | null;
  className?: string;
  compact?: boolean;
}

export default function AudioPlayer({ streamMetadata, className, compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamUrl = streamMetadata?.streamUrl ?? "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onWaiting  = () => setBuffering(true);
    const onPlaying  = () => { setBuffering(false); setError(null); };
    const onError    = () => { setBuffering(false); setError("Stream unavailable. Retrying…"); };
    const onCanPlay  = () => setBuffering(false);

    audio.addEventListener("waiting",  onWaiting);
    audio.addEventListener("playing",  onPlaying);
    audio.addEventListener("error",    onError);
    audio.addEventListener("canplay",  onCanPlay);

    return () => {
      audio.removeEventListener("waiting",  onWaiting);
      audio.removeEventListener("playing",  onPlaying);
      audio.removeEventListener("error",    onError);
      audio.removeEventListener("canplay",  onCanPlay);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setBuffering(true);
      setError(null);
      audio.src = streamUrl;
      audio.load();
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setError("Could not start stream. Please try again.");
        setBuffering(false);
      }
    }
  }, [playing, streamUrl]);

  const handleVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val > 0) setMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const nowPlaying = streamMetadata?.nowPlaying;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 p-4 card", className)}>
        <audio ref={audioRef} preload="none" />
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 hover:shadow-lg hover:shadow-gold-500/40 transition-all duration-200 flex-shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {buffering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : playing ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 translate-x-0.5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate text-sm">
            {nowPlaying?.title ?? "Speaking Saints"}
          </p>
          <p className="text-navy-300 text-xs truncate">
            {nowPlaying?.artist ?? "24/7 Faith-Based Radio"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-navy-300 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card p-6 md:p-8", className)}>
      <audio ref={audioRef} preload="none" />

      {/* Now Playing Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 border border-gold-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {nowPlaying?.artwork ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={nowPlaying.artwork} alt="Now playing" className="w-full h-full object-cover" />
          ) : (
            <Radio className="w-8 h-8 text-gold-500/60" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gold-400 font-semibold uppercase tracking-widest mb-1">Now Playing</p>
          <h3 className="text-white font-bold text-lg leading-tight truncate">
            {nowPlaying?.title ?? "Speaking Saints Live"}
          </h3>
          <p className="text-navy-300 text-sm mt-0.5">
            {nowPlaying?.artist ?? "24/7 Faith-Based Radio"}
          </p>
        </div>
      </div>

      {/* Progress bar (decorative for live stream) */}
      <div className="relative h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full animate-[shimmer_2s_ease-in-out_infinite]"
          style={{ width: playing ? "100%" : "0%", transition: "width 0.5s" }}
        />
        {playing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-400 shadow-lg shadow-gold-400/50" />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Volume */}
          <button
            onClick={toggleMute}
            className="text-navy-300 hover:text-white transition-colors p-1"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            className="w-24"
            aria-label="Volume"
          />
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-bold shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label={playing ? "Pause stream" : "Play stream"}
        >
          {buffering ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : playing ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 translate-x-0.5" />
          )}
        </button>

        {/* Live badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {streamMetadata?.isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Live</span>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-4 text-center">{error}</p>
      )}
    </div>
  );
}
