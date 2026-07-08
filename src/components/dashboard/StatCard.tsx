import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "secondary" | "primary" | "rose" | "violet";
};

const toneStyles: Record<StatCardProps["tone"], string> = {
  secondary: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  rose: "bg-rose-50 text-rose-500",
  violet: "bg-violet-50 text-violet-600",
};

export function StatCard({ title, value, detail, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", toneStyles[tone])}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
    </div>
  );
}
