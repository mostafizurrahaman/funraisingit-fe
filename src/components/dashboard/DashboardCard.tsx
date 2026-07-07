import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return <section className={cn("rounded-lg border border-border bg-white p-4 shadow-sm", className)}>{children}</section>;
}
