"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  Home,
  LogOut,
  Package,
  Settings,
  Sparkles,
  UploadCloud,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/logo.png";
import user from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Donations", href: "/dashboard/donations", icon: Heart },
  { label: "Supporters", href: "/dashboard/supporters", icon: BarChart3 },
  { label: "Payouts", href: "/dashboard/payouts", icon: WalletCards },
  { label: "Update Campaign", href: "/dashboard/campaign", icon: UploadCloud },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-white", className)}>
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-border px-5">
          <Link href="/dashboard" aria-label="FunRaisingIt dashboard" className="transition-opacity duration-300 hover:opacity-80">
            <Image src={logo} alt="FunRaisingIt" className="h-auto w-36" priority />
          </Link>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-lg border border-border bg-[#f8ffff] p-3 text-center">
            <Image src={user} alt="Jennie's bouncy banana pudding" className="mx-auto size-20 rounded-lg object-cover" />
            <p className="mt-3 text-sm font-semibold">Jennie&apos;s Bouncy Pudding</p>
            <span className="mt-1 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">Live</span>
          </div>
        </div>

        <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary",
                  isActive && "bg-secondary/10 text-secondary",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-border p-4">
          <div className="rounded-lg bg-secondary/10 p-4 text-center">
            <Sparkles className="mx-auto size-5 text-secondary" />
            <p className="mt-2 text-sm font-semibold text-secondary">Need Help?</p>
            <p className="mt-1 text-xs text-muted-foreground">Here to guide you</p>
            <Button size="sm" className="mt-3 h-9 w-full text-xs">
              Contact Support
            </Button>
          </div>
          <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary">
            <LogOut className="size-4" />
            Log out
          </Link>
        </div>
      </div>
    </aside>
  );
}
