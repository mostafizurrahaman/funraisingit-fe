"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Menu } from "lucide-react";
import user from "@/assets/user.png";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

export function DashboardHeader() {
  const token = useSelector(userCurrentToken);
  const { data: profileResponse } = useGetMeQuery(undefined, { skip: !token });
  const profileData = profileResponse?.data;
  const displayName = profileData?.name || "User";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" aria-label="Open dashboard menu" className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition-all duration-300 hover:border-secondary hover:bg-secondary/10 hover:text-secondary lg:hidden">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="left-0 right-auto w-[82%] max-w-72 translate-x-0 border-l-0 border-r p-0 data-[state=closed]:-translate-x-full">
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <DashboardSidebar className="static flex h-dvh w-full border-r-0" />
            </SheetContent>
          </Sheet>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Campaign dashboard</p>
            <h1 className="text-lg font-semibold sm:text-xl">Welcome back, {displayName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/campaign" className="hidden rounded-full px-4 text-xs sm:inline-flex">
          <Button size="sm" variant="outline" className="hidden rounded-full px-4 text-xs sm:inline-flex">
            View All Campaign
          </Button>
          </Link>
          <button type="button" aria-label="Notifications" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-secondary hover:bg-secondary/10 hover:text-secondary">
            <Bell className="size-4" />
          </button>
          {/* <button type="button" aria-label="Favorites" className="hidden size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 hover:bg-secondary hover:text-white sm:inline-flex">
            <Heart className="size-4 fill-current" />
          </button> */}
          <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-3 hover:border-secondary transition-colors duration-300">
            <Image src={profileData?.profileImage || user} alt={`${displayName} profile`} width={36} height={36} className="size-9 rounded-full object-cover" />
            <span className="hidden text-sm font-semibold sm:block">{displayName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
