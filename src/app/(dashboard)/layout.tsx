"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const token = useSelector(userCurrentToken);
  const router = useRouter();

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !localToken) {
      toast.error("Please login to access the dashboard.");
      router.push("/login");
    }
  }, [token, router]);

  // Render a loading state during check/redirect to prevent flickering
  const hasToken = token || (typeof window !== "undefined" && localStorage.getItem("token"));
  if (!hasToken) {
    return (
      <div className="min-h-screen bg-[#f5fbfb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5fbfb] text-foreground">
      <DashboardSidebar className="hidden lg:flex" />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
