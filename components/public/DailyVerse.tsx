import { BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import type { Verse } from "@/types";

interface DailyVerseProps {
  verse?: Verse | null;
}

const DEFAULT_VERSE: Partial<Verse> = {
  reference: "Psalm 46:10",
  text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
  translation: "NIV",
  theme: "Peace & Rest",
};

export default function DailyVerse({ verse }: DailyVerseProps) {
  const v = verse ?? DEFAULT_VERSE;

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-navy-800/80 to-navy-900/80 border-gold-500/20">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-gold-400" />
        <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
          Today&apos;s Verse
        </span>
      </div>
      <blockquote className="text-white text-lg md:text-xl font-serif leading-relaxed mb-4 italic">
        &ldquo;{v.text}&rdquo;
      </blockquote>
      <div className="flex items-center justify-between">
        <cite className="not-italic text-gold-400 font-semibold text-sm">
          — {v.reference} {v.translation && `(${v.translation})`}
        </cite>
        {v.theme && (
          <span className="text-xs text-navy-300 bg-navy-700/60 px-2.5 py-1 rounded-full border border-white/10">
            {v.theme}
          </span>
        )}
      </div>
    </Card>
  );
}
