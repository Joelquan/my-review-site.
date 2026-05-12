import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  as?: "div" | "article" | "section";
}

export default function Card({ children, className, hover = false, glass = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-white/10",
        glass ? "bg-white/5 backdrop-blur-md" : "bg-navy-800/60",
        hover && "transition-all duration-300 hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/10 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </Tag>
  );
}
