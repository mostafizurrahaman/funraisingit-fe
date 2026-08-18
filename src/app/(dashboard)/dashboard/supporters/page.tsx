/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useGetAllSupportersQuery, useGetSupportersOverviewQuery, useSendEmailToSupportersMutation } from "@/redux/features/SupportersApi/SupportersApi";
import { useGetCampaignByIdQuery } from "@/redux/features/campaign/campaignApi";
import { X } from "lucide-react";
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

  // Email Compose State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Important Campaign Update");
  const [emailMessage, setEmailMessage] = useState(
    `<p>We’re excited to share an important update about our campaign!</p><p>Thanks to your generous support, we’ve reached <strong>75% of our fundraising goal</strong>.</p><p>Your contribution is helping us get closer to making this campaign a success. We truly appreciate your support.</p><h3>What’s next?</h3><ul><li>We’ll continue working toward our fundraising goal.</li><li>We’ll keep you updated on our progress.</li><li>We’ll share more details as the campaign moves forward.</li></ul><p>Thank you again for being part of our journey!</p><p><strong>Best regards,</strong><br />The Campaign Team</p>`
  );

  const [sendEmailToSupporters, { isLoading: isSendingEmail }] = useSendEmailToSupportersMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCampaignId(localStorage.getItem("campaignId") || "");
    }
  }, []);

  const { data: campaignResponse } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });
  const campaignData = campaignResponse?.data;

  // 1. Fetch List of Supporters
  const { data: supportersResponse, isLoading: isLoadingList, error: listError } = useGetAllSupportersQuery(
    { campaignId, skipPagination: true },
    { skip: !campaignId }
  );
  const supportersData = supportersResponse?.data || [];

  // 2. Fetch pre-calculated Supporters Overview from Backend API
  const { data: overviewResponse, isLoading: isLoadingOverview } = useGetSupportersOverviewQuery(
    { campaignId },
    { skip: !campaignId }
  );
  const overview = overviewResponse?.data;

  // Filtered supporters based on search
  const filteredSupporters = supportersData.filter((s: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term)
    );
  });

  const totalSupporters = overview?.totalSupporters || 0;
  
  const stats = [
    {
      title: "Total Supporters",
      value: String(totalSupporters),
      detail: "People",
      icon: Users,
      tone: "secondary",
    },
    {
      title: "Total Orders",
      value: `$${(overview?.totalOrders?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: `From ${overview?.totalOrders?.fromSupporters || 0} supporters`,
      icon: Heart,
      tone: "rose",
    },
    {
      title: "Total Donations",
      value: `$${(overview?.totalDonations?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: `From ${overview?.totalDonations?.fromSupporters || 0} supporters`,
      icon: Gift,
      tone: "blue",
    },
    {
      title: "Total Support",
      value: `$${(overview?.totalSupport?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: "Combined total",
      icon: Star,
      tone: "primary",
    },
    {
      title: "New This Week",
      value: String(overview?.newSupportersThisWeek || 0),
      detail: "New supporters",
      icon: Users,
      tone: "violet",
    },
  ] as const;

  // Support Overview Chart calculations
  const ordersOnly = overview?.supportOverview?.ordersOnly || 0;
  const donationsOnly = overview?.supportOverview?.donationsOnly || 0;
  const bothOrdersAndDonations = overview?.supportOverview?.bothOrdersAndDonations || 0;

  const ordersPercentage = totalSupporters > 0 ? Math.round((ordersOnly / totalSupporters) * 100) : 0;
  const donationsPercentage = totalSupporters > 0 ? Math.round((donationsOnly / totalSupporters) * 100) : 0;
  const bothPercentage = totalSupporters > 0 ? Math.round((bothOrdersAndDonations / totalSupporters) * 100) : 0;

  const chartGradient = `conic-gradient(var(--secondary) 0% ${ordersPercentage}%, #f43f5e ${ordersPercentage}% ${ordersPercentage + donationsPercentage}%, #3b82f6 ${ordersPercentage + donationsPercentage}% 100%)`;

  const topSupporters = overview?.topSupporters || [];

  const insights = [
    {
      title: "Most Active Day",
      value: overview?.mostActiveDay?.day || "N/A",
      detail: `${overview?.mostActiveDay?.supporterCount || 0} supporters`,
      icon: Users,
      tone: "secondary",
    },
    {
      title: "Peak Engagement Hour",
      value: overview?.mostActiveTimeRange?.range || "N/A",
      detail: "Highest activity",
      icon: CalendarClock,
      tone: "blue",
    },
    {
      title: "Repeat Supporters",
      value: String(overview?.repeatSupporters || 0),
      detail: "Active on both fronts",
      icon: Heart,
      tone: "violet",
    },
    {
      title: "Average Order Value",
      value: `$${(overview?.averageOrderValue || 0).toFixed(2)}`,
      detail: `From ${overview?.totalOrders?.totalOrdersCount || 0} orders`,
      icon: ShoppingBag,
      tone: "primary",
    },
    {
      title: "Average Donations",
      value: `$${(overview?.averageDonationValue || 0).toFixed(2)}`,
      detail: `From ${overview?.totalDonations?.totalDonationsCount || 0} donations`,
      icon: Gift,
      tone: "green",
    },
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
    setIsEmailModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    if (!emailSubject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!emailMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const response = await sendEmailToSupporters({
        campaignId,
        subject: emailSubject,
        message: emailMessage,
      }).unwrap();

      if (response?.success) {
        toast.success("Email sent to supporters successfully!");
        setIsEmailModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to send email.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong while sending email.");
    }
  };

  const isLoading = isLoadingList || isLoadingOverview;

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

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={handleExport} variant="outline" className="h-11 border-secondary text-xs cursor-pointer hover:bg-secondary/90">
            <Download className="size-4" />
            Export List
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="h-11 border-secondary text-xs cursor-pointer hover:bg-secondary/90">
            <Mail className="size-4" />
            Send Email
          </Button>
        
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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

      <section className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_360px]">
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
            ) : listError ? (
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
                   
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Donations</th>
                    <th className="px-4 py-3">Total Support</th>
                    <th className="px-4 py-3">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSupporters.map((supporter: any) => (
                    <tr key={supporter._id} className="transition-colors duration-300 hover:bg-secondary/5">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-semibold">
                          {/* <Image src={user} alt="" className="size-7 rounded-full object-cover" /> */}
                          {supporter.name || "Anonymous Supporter"}
                        </span>
                      </td>
                    
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
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
              <div
                className="relative flex size-28 shrink-0 items-center justify-center rounded-full"
                style={{ background: chartGradient }}
              >
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-xl font-semibold">{totalSupporters}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="space-y-3 text-sm w-full">
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
                  <div key={supporter.supporterId || index} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary/10 text-xs text-secondary">{index + 1}</span>
                      <span className="truncate max-w-[120px]">{supporter.supporterName || "Anonymous"}</span>
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
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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

      {/* Custom Composition Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-4">Compose Update Email</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-300 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Message (HTML/Text)</label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Enter email body message..."
                  rows={10}
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-300 focus:border-secondary resize-none font-mono text-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendEmail}
                disabled={isSendingEmail}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="size-4" />
                    Send Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
