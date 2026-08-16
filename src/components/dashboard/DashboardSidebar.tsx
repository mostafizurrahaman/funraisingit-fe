"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import {
  BarChart3,
  Heart,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  UploadCloud,
  WalletCards,
  Palette,
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
  { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Donations", href: "/dashboard/donation", icon: Heart },
  { label: "Supporters", href: "/dashboard/supporters", icon: BarChart3 },
  { label: "Payouts", href: "/dashboard/payouts", icon: WalletCards },
  { label: "Update Campaign", href: "/dashboard/campaign", icon: UploadCloud },
  { label: "My Brand", href: "/dashboard/my-brand", icon: Palette },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(userCurrentToken);
  const { data: profileResponse } = useGetMeQuery(undefined, { skip: !token });
  const profileData = profileResponse?.data;
  const displayName = profileData?.name || "User";

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
    // toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-white", className)}>
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-border px-5">
          <Link href="/" aria-label="FunRaisingIt dashboard" className="transition-opacity duration-300 hover:opacity-80">
            <Image src={logo} alt="FunRaisingIt" className="h-auto w-36" priority />
          </Link>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-lg border border-border bg-[#f8ffff] p-3 text-center">
            <Image src={profileData?.profileImage || user} alt={`${displayName} profile`} width={200} height={200} className="mx-auto size-20 rounded-lg object-cover" />
            <p className="mt-3 text-sm font-semibold">{displayName}</p>
            <span className="mt-1 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize">{profileData?.role || "Organizer"}</span>
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
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary cursor-pointer bg-transparent border-none">
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
