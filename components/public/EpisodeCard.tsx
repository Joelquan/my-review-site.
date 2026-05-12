import Link from "next/link";
import { Play, Clock, Radio } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatDuration, formatDate } from "@/lib/utils";
import type { Episode } from "@/types";

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Card hover as="article" className="group overflow-hidden">
      <div className="p-5 flex gap-4">
        {/* Artwork */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 border border-gold-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-gold-500/40 transition-colors">
          {episode.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={episode.coverImageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Radio className="w-6 h-6 text-gold-500/50" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1 group-hover:text-gold-300 transition-colors">
            {episode.title}
          </h3>
          {episode.host && (
            <p className="text-navy-400 text-xs mb-2">{episode.host}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-navy-400">
            {episode.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(episode.duration)}
              </span>
            )}
            {episode.publishedAt && (
              <span>
                {formatDate(episode.publishedAt.toDate(), { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>

        {/* Play */}
        {episode.audioUrl && (
          <button
            className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 transition-all duration-200 flex-shrink-0 self-center"
            aria-label={`Play ${episode.title}`}
          >
            <Play className="w-4 h-4 translate-x-0.5" />
          </button>
        )}
      </div>
    </Card>
  );
}
