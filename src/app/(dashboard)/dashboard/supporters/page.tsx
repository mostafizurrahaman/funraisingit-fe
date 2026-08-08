"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CalendarClock,
  Download,
  Gift,
  Heart,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Loader2,
} from "lucide-react";
import user from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAllSupportersQuery } from "@/redux/features/SupportersApi/SupportersApi";
import { useGetCampaignByIdQuery } from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

const toneStyles = {
  secondary: "bg-secondary/10 text-secondary",
  rose: "bg-rose-50 text-rose-500",
  blue: "bg-blue-100 text-blue-700",
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
} as const;

export default function SupportersPage() {
  const [campaignId, setCampaignId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCampaignId(localStorage.getItem("campaignId") || "");
    }
  }, []);

  const { data: campaignResponse } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });
  const campaignData = campaignResponse?.data;

  const { data: supportersResponse, isLoading, error } = useGetAllSupportersQuery(
    { campaignId, skipPagination: true },
    { skip: !campaignId }
  );

  const supportersData = supportersResponse?.data || [];

  // Filtered supporters based on search
  const filteredSupporters = supportersData.filter((s: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term)
    );
  });

  // Calculate dynamic stats
  const totalSupporters = supportersData.length;
  
  const totalOrders = supportersData.reduce(
    (acc: number, curr: any) => acc + (curr.totalOrders || 0),
    0
  );

  const totalDonations = supportersData.reduce(
    (acc: number, curr: any) => acc + (curr.totalDonations || 0),
    0
  );

  const totalSupport = supportersData.reduce(
    (acc: number, curr: any) => acc + (curr.totalAmount || 0),
    0
  );

  // New this week count
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = supportersData.filter((s: any) => {
    const createdDate = new Date(s.createdAt);
    return createdDate >= oneWeekAgo;
  }).length;

  const stats = [
    { title: "Total Supporters", value: String(totalSupporters), detail: "People", icon: Users, tone: "secondary" },
    { title: "Total Orders", value: `$${totalOrders.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: `From ${supportersData.filter((s: any) => (s.totalOrders || 0) > 0).length} supporters`, icon: Heart, tone: "rose" },
    { title: "Total Donations", value: `$${totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: `From ${supportersData.filter((s: any) => (s.totalDonations || 0) > 0).length} supporters`, icon: Gift, tone: "blue" },
    { title: "Total Support", value: `$${totalSupport.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, detail: "Combined total", icon: Star, tone: "primary" },
    { title: "New This Week", value: String(newThisWeek), detail: "New supporters", icon: Users, tone: "violet" },
  ] as const;

  // Support Overview Logic
  const ordersOnly = supportersData.filter((s: any) => (s.totalOrders || 0) > 0 && (s.totalDonations || 0) === 0).length;
  const donationsOnly = supportersData.filter((s: any) => (s.totalDonations || 0) > 0 && (s.totalOrders || 0) === 0).length;
  const bothOrdersAndDonations = supportersData.filter((s: any) => (s.totalOrders || 0) > 0 && (s.totalDonations || 0) > 0).length;

  const ordersPercentage = totalSupporters > 0 ? Math.round((ordersOnly / totalSupporters) * 100) : 0;
  const donationsPercentage = totalSupporters > 0 ? Math.round((donationsOnly / totalSupporters) * 100) : 0;
  const bothPercentage = totalSupporters > 0 ? Math.round((bothOrdersAndDonations / totalSupporters) * 100) : 0;

  // Conic gradient style
  // Conic gradient style parameters: orders (up to ordersPercentage), donations (up to ordersPercentage + donationsPercentage), both (rest)
  const chartGradient = `conic-gradient(var(--secondary) 0% ${ordersPercentage}%, #f43f5e ${ordersPercentage}% ${ordersPercentage + donationsPercentage}%, #3b82f6 ${ordersPercentage + donationsPercentage}% 100%)`;

  // Top Supporters Logic (Sorted by totalAmount descending)
  const topSupporters = [...supportersData]
    .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    .slice(0, 5);

  // Supporter Insights calculation
  // Dynamic average order value
  const totalOrdersCount = supportersData.filter((s: any) => (s.totalOrders || 0) > 0).length;
  const averageOrderValue = totalOrdersCount > 0 ? totalOrders / totalOrdersCount : 0;

  // Dynamic average donation value
  const totalDonationsCount = supportersData.filter((s: any) => (s.totalDonations || 0) > 0).length;
  const averageDonationValue = totalDonationsCount > 0 ? totalDonations / totalDonationsCount : 0;

  const insights = [
    { title: "Most Active Day", value: "Saturday", detail: "Weekend peak", icon: Users, tone: "secondary" },
    { title: "Peak Engagement Hour", value: "10AM-2PM", detail: "Highest activity", icon: CalendarClock, tone: "blue" },
    { title: "Repeat Supporters", value: String(bothOrdersAndDonations), detail: "Active on both fronts", icon: Heart, tone: "violet" },
    { title: "Average Order Value", value: `$${averageOrderValue.toFixed(2)}`, detail: `From ${totalOrdersCount} orders`, icon: ShoppingBag, tone: "primary" },
    { title: "Average Donations", value: `$${averageDonationValue.toFixed(2)}`, detail: `From ${totalDonationsCount} donations`, icon: Gift, tone: "green" },
  ] as const;

  const handleExport = () => {
    if (supportersData.length === 0) {
      toast.error("No supporters to export.");
      return;
    }
    const headers = ["Name", "Email", "Phone", "Orders", "Donations", "Total Support", "Last Activity"];
    const rows = supportersData.map((s: any) => [
      s.name || "N/A",
      s.email || "N/A",
      s.phone || "N/A",
      s.totalOrders || 0,
      s.totalDonations || 0,
      s.totalAmount || 0,
      s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : "N/A",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${campaignData?.name || "campaign"}_supporters.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Supporters list exported successfully!");
  };

  const handleSendEmail = () => {
    if (supportersData.length === 0) {
      toast.error("No supporters to email.");
      return;
    }
    const emails = supportersData.map((s: any) => s.email).filter(Boolean).join(",");
    window.location.href = `mailto:?bcc=${emails}&subject=Thank%20You%20For%20Supporting%20Our%20Campaign`;
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
            <Users className="size-7" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Supporters</h2>
            <p className="mt-1 text-sm text-muted-foreground">Everyone who has supported your campaign.</p>
            <p className="mt-4 text-sm font-semibold">{campaignData?.name || "Loading Campaign..."}</p>
            {campaignData?.status && (
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                Campaign Status:
                <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary capitalize">
                  {campaignData.status}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button onClick={handleExport} variant="outline" className="h-11 border-secondary text-xs cursor-pointer hover:bg-secondary/10">
            <Download className="size-4" />
            Export List
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="h-11 border-secondary text-xs cursor-pointer hover:bg-secondary/10">
            <Mail className="size-4" />
            Send Email
          </Button>
          <Button onClick={() => toast.success("Supporter management is handled automatically via checkout orders.")} className="h-11 text-xs cursor-pointer hover:-translate-y-0.5 transition-all">
            <Plus className="size-4" />
            Add Supporter
          </Button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <DashboardCard key={stat.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", toneStyles[stat.tone])}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-muted-foreground truncate">{stat.title}</p>
                  <p className="mt-1 text-xl font-semibold truncate">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{stat.detail}</p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        {/* Table Supporters Card */}
        <DashboardCard className="p-0">
          <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-base font-semibold">All Supporters</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 rounded-lg border-border pl-10 text-sm"
                />
              </div>
              <p className="shrink-0 text-sm font-medium text-muted-foreground">
                {filteredSupporters.length} {filteredSupporters.length === 1 ? "Supporter" : "Supporters"}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2">
                <Loader2 className="size-8 animate-spin text-secondary" />
                <p className="text-sm text-muted-foreground">Loading supporters data...</p>
              </div>
            ) : error ? (
              <div className="flex h-64 flex-col items-center justify-center text-center p-4">
                <p className="text-lg font-semibold text-rose-500">Failed to load supporters.</p>
                <p className="text-sm text-muted-foreground mt-1">Please try again later.</p>
              </div>
            ) : filteredSupporters.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center p-4">
                <Users className="size-12 text-slate-300 mb-2" />
                <p className="text-base font-semibold text-muted-foreground">
                  {supportersData.length === 0
                    ? "No supporters found for this campaign yet."
                    : "No search results match your criteria."}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="text-xs font-semibold text-muted-foreground bg-slate-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Donations</th>
                    <th className="px-4 py-3">Total Support</th>
                    <th className="px-4 py-3">Last Activity</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSupporters.map((supporter: any) => (
                    <tr key={supporter._id} className="transition-colors duration-300 hover:bg-secondary/5">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-semibold">
                          <Image src={user} alt="" className="size-7 rounded-full object-cover" />
                          {supporter.name || "Anonymous Supporter"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{supporter.email || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{supporter.phone || "N/A"}</td>
                      <td className="px-4 py-3 font-medium">
                        ${(supporter.totalOrders || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ${(supporter.totalDonations || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ${(supporter.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {supporter.lastActivity
                          ? new Date(supporter.lastActivity).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toast.success(`Contacting ${supporter.name || "supporter"}...`)}
                          aria-label={`Open actions for ${supporter.name}`}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary cursor-pointer"
                        >
                          <MoreHorizontal className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DashboardCard>

        {/* Sidebar Cards */}
        <aside className="space-y-5">
          <DashboardCard>
            <h3 className="text-base font-semibold">Support Overview</h3>
            <div className="mt-4 flex items-center gap-5">
              <div
                className="relative flex size-28 shrink-0 items-center justify-center rounded-full"
                style={{ background: chartGradient }}
              >
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-xl font-semibold">{totalSupporters}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <LegendDot className="bg-secondary" label="Orders Only" value={`${ordersOnly} (${ordersPercentage}%)`} />
                <LegendDot className="bg-rose-500" label="Donations Only" value={`${donationsOnly} (${donationsPercentage}%)`} />
                <LegendDot className="bg-blue-500" label="Both" value={`${bothOrdersAndDonations} (${bothPercentage}%)`} />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="size-5 text-primary" />
              Top Supporters
            </h3>
            <div className="mt-4 space-y-3">
              {topSupporters.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No top supporters yet.</p>
              ) : (
                topSupporters.map((supporter: any, index: number) => (
                  <div key={supporter._id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary/10 text-xs text-secondary">{index + 1}</span>
                      <Image src={user} alt="" className="size-7 rounded-full object-cover" />
                      <span className="truncate max-w-[120px]">{supporter.name || "Anonymous"}</span>
                    </span>
                    <span className="font-semibold">${(supporter.totalAmount || 0).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </aside>
      </section>

      {/* Supporter Insights Card */}
      <DashboardCard>
        <h3 className="text-base font-semibold">Supporter Insights</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {insights.map((insight) => {
            const Icon = insight.icon;

            return (
              <div key={`${insight.title}-${insight.value}`} className="rounded-lg bg-[#f8ffff] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                <span className={cn("inline-flex size-10 items-center justify-center rounded-lg", toneStyles[insight.tone])}>
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">{insight.title}</p>
                <p className="mt-1 text-base font-semibold">{insight.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{insight.detail}</p>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="size-5 text-primary" />
          <span>
            <span className="font-semibold text-foreground">Tip:</span> Supporters who receive a thank-you email are 3x more likely to support again in the future.
          </span>
        </p>
        <Button onClick={handleSendEmail} variant="outline" size="sm" className="w-full text-xs sm:w-auto cursor-pointer">
          <Mail className="size-4" />
          Send Email
        </Button>
      </section>
    </div>
  );
}

function LegendDot({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground min-w-0 flex-1">
        <span className={cn("size-3 rounded-full shrink-0", className)} />
        <span className="truncate text-xs">{label}</span>
      </span>
      <span className="font-semibold text-xs text-right whitespace-nowrap">{value}</span>
    </div>
  );
}
