import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "navy" | "green" | "red" | "blue" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold:    "bg-gold-500/20 text-gold-400 border border-gold-500/30",
  navy:    "bg-navy-600/60 text-navy-200 border border-navy-500/30",
  green:   "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  red:     "bg-red-500/20 text-red-400 border border-red-500/30",
  blue:    "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  outline: "border border-white/20 text-white/70",
};

export default function Badge({ children, variant = "navy", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
