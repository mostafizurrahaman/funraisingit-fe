"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  Gift,
  Heart,
  MessageCircle,
  PackageCheck,
  Star,
  Target,
  Truck,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import glitter from "@/assets/glitter.png";
import heartImg from "@/assets/heart.png";
import order from "@/assets/order.png";
import roket from "@/assets/roket.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAllDonationQuery, useGetDonationOverviewQuery } from "@/redux/features/donation/donationApi";
import { useGetCampaignByIdQuery } from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

const statToneStyles = {
  secondary: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
} as const;

export default function DonationPage() {
  const [campaignId, setCampaignId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCampaignId(localStorage.getItem("campaignId") || "");
    }
  }, []);

  // 1. Get campaign details
  const { data: campaignResponse } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });
  const campaign = campaignResponse?.data;

  // 2. Get donation overview details
  const { data: overviewResponse, isLoading: isLoadingOverview } = useGetDonationOverviewQuery(
    { campaignId },
    { skip: !campaignId }
  );
  const overview = overviewResponse?.data;

  const { data: donationsResponse, isLoading: isLoadingList, error: listError } = useGetAllDonationQuery(
    { campaignId, page, limit: 10 },
    { skip: !campaignId }
  );
  const donations = donationsResponse?.data || [];
  const meta = donationsResponse?.meta;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleExport = (format: "csv" | "excel") => {
    if (donations.length === 0) {
      toast.error("No donations to export.");
      return;
    }
    const headers = ["Donation ID", "Donor Name", "Email", "Phone", "Amount", "Status", "Date"];
    const rows = donations.map((d: any) => [
      d.donationId || "N/A",
      d.supporterName || "N/A",
      d.supporterEmail || "N/A",
      d.supporterPhone || "N/A",
      d.totalAmount || 0,
      d.donationStatus || "N/A",
      d.paidAt ? new Date(d.paidAt).toLocaleDateString() : "Pending",
    ]);

    const content = [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n");
    const mimeType = format === "csv" ? "text/csv" : "application/vnd.ms-excel";
    const extension = format === "csv" ? "csv" : "xls";
    
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${campaign?.name || "campaign"}_donations.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Donations exported in ${format.toUpperCase()} successfully!`);
  };

  const summaryStats = [
    {
      title: "Subtotal Raised",
      value: `$${(overview?.financialBreakdown?.subTotal || 0).toFixed(2)}`,
      detail: "Gross donations",
      icon: PackageCheck,
      tone: "secondary",
    },
    {
      title: "Stripe Fees",
      value: `$${(overview?.financialBreakdown?.stripeFee || 0).toFixed(2)}`,
      detail: "Transaction processing",
      icon: Gift,
      tone: "primary",
    },
    {
      title: "Platform Fees",
      value: `$${(overview?.financialBreakdown?.platformFee || 0).toFixed(2)}`,
      detail: "6% campaign service",
      icon: CircleDollarSign,
      tone: "violet",
    },
    {
      title: "Net Organizer Amount",
      value: `$${(overview?.financialBreakdown?.organizerAmount || 0).toFixed(2)}`,
      detail: "Transferred payout",
      icon: Truck,
      tone: "blue",
    },
  ] as const;

  const topSupporters = overview?.topSupporters || [];
  const messages = overview?.messageFromSupporters || [];
  const activityFeed = overview?.recentActivities || [];

  // Goal calculation
  const goal = campaign?.goalAmount || 500;
  const raised = campaign?.raisedAmount || 0;
  const percentage = Math.min(100, Math.round((raised / goal) * 100));

  const isLoading = isLoadingOverview || isLoadingList;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
            <DashboardCard className="flex items-center gap-4 bg-white border border-border">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <Heart className="size-7 fill-current" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold">Donations</h2>
                <p className="mt-1 text-sm text-muted-foreground">{campaign?.name || "Loading Campaign..."}</p>
                {campaign?.status && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium">
                    Campaign Status:
                    <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary capitalize">
                      {campaign.status}
                    </span>
                  </p>
                )}
              </div>
            </DashboardCard>

            <DashboardCard className="relative overflow-hidden bg-rose-50 border border-rose-100">
              <div className="relative z-10">
                <p className="text-sm font-semibold text-muted-foreground">Total Donations Received</p>
                <p className="mt-2 text-3xl font-semibold">${(overview?.financialBreakdown?.totalAmount || 0).toFixed(2)}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="size-4 fill-rose-500 text-rose-500" />
                  From {overview?.totalDonations || 0} supporters
                </p>
              </div>
              <Image src={heartImg} alt="" className="absolute right-5 top-1/2 size-24 -translate-y-1/2 object-contain opacity-80 pointer-events-none" />
            </DashboardCard>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <DashboardCard key={stat.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-white border border-border">
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", statToneStyles[stat.tone])}>
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

          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            {/* Recent Donations Table */}
            <DashboardCard className="bg-white border border-border">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="text-base font-semibold">Recent Donations</h3>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex h-60 flex-col items-center justify-center gap-2">
                    <Loader2 className="size-8 animate-spin text-secondary" />
                    <p className="text-xs text-muted-foreground">Loading donations...</p>
                  </div>
                ) : listError ? (
                  <div className="flex h-60 flex-col items-center justify-center text-center p-4">
                    <p className="text-sm font-semibold text-rose-500">Failed to load donations.</p>
                  </div>
                ) : donations.length === 0 ? (
                  <div className="flex h-60 flex-col items-center justify-center text-center p-4">
                    <Heart className="size-10 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">
                      No donations found for this campaign yet.
                    </p>
                  </div>
                ) : (
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="text-xs text-muted-foreground bg-slate-50 border-b border-border">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Donor</th>
                        <th className="px-3 py-2.5 font-semibold">Amount</th>
                        <th className="px-3 py-2.5 font-semibold">Message</th>
                        <th className="px-3 py-2.5 text-right font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {donations.map((donation: any) => (
                        <tr key={donation.donationId} className="transition-colors duration-300 hover:bg-secondary/5">
                          <td className="px-3 py-2.5">
                            <span className="flex items-center gap-2 font-semibold text-xs">
                              <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                              {donation.supporterName || "Anonymous"}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-secondary text-xs">${(donation.totalAmount || 0).toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-muted-foreground text-xs truncate max-w-[200px]" title={donation.supporterPhone}>{donation.supporterEmail}</td>
                          <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">
                            {donation.paidAt ? new Date(donation.paidAt).toLocaleDateString() : "Pending"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Controls */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === meta.totalPages}>
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Showing page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
                        <span className="font-semibold text-foreground">{meta.totalPages}</span> (Total{" "}
                        <span className="font-semibold text-foreground">{meta.total}</span> donations)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 cursor-pointer"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 cursor-pointer"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === meta.totalPages}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DashboardCard>

            {/* Activity Feed */}
            <DashboardCard className="bg-white border border-border">
              <h3 className="text-base font-semibold">Donation Activity Feed</h3>
              <div className="mt-4 space-y-3">
                {activityFeed.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No recent activity.</p>
                ) : (
                  activityFeed.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <Heart className="size-4 fill-rose-500 text-rose-500" />
                        {activity.text}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{activity.paidAt}</span>
                    </div>
                  ))
                )}
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <DashboardCard className="bg-white border border-border">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <Download className="size-5" />
                Download Donations
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Download a spreadsheet of all donations and donor details.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button onClick={() => handleExport("excel")} variant="outline" className="justify-start text-xs cursor-pointer hover:bg-slate-50">
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  Download Excel
                </Button>
                <Button onClick={() => handleExport("csv")} variant="outline" className="justify-start text-xs cursor-pointer hover:bg-slate-50">
                  <Download className="size-4" />
                  Download CSV
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Includes donor name, email, phone, amount, message, date.</p>
            </DashboardCard>

            <DashboardCard className="bg-white border border-border">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <Heart className="size-5 fill-rose-500 text-rose-500" />
                Thank Your Supporters
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Express appreciation and build deeper relationships.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button onClick={() => {
                  const emails = donations.map((d: any) => d.supporterEmail).filter(Boolean).join(",");
                  window.location.href = `mailto:?bcc=${emails}&subject=Thank%20You%20For%20Supporting%20Our%20Campaign`;
                }} className="text-xs cursor-pointer hover:-translate-y-0.5 transition-all">
                  <MessageCircle className="size-4" />
                  Send Your Email
                </Button>
                <Button onClick={() => handleExport("csv")} variant="outline" className="text-xs cursor-pointer hover:bg-slate-50">
                  <Users className="size-4" />
                  Download Donor List
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Build stronger relationships for future campaigns.</p>
            </DashboardCard>
          </section>
        </div>

        {/* Sidebar Cards */}
        <aside className="space-y-5">
          <DashboardCard className="bg-white border border-border">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Target className="size-5 text-primary" />
              Donation Goal Progress
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">Goal: ${goal.toLocaleString()} Donations</p>
            <p className="mt-2 text-lg font-semibold">${raised.toLocaleString()} Raised</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary/10">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${percentage}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">${Math.max(0, goal - raised).toLocaleString()} to go</span>
              <span className="font-semibold text-secondary">{percentage}%</span>
            </div>
          </DashboardCard>

          <DashboardCard className="bg-white border border-border">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Star className="size-5 fill-amber-400 text-amber-400" />
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
                    <span className="font-semibold">${(supporter.amount || 0).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="bg-white border border-border">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <MessageCircle className="size-5 text-blue-600" />
              Message From Supporters
            </h3>
            <div className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No messages yet.</p>
              ) : (
                messages.map((message: string, idx: number) => (
                  <p key={idx} className="rounded-lg bg-[#f8ffff] px-3 py-2 text-xs font-medium border border-cyan-50">
                    &quot;{message}&quot;
                  </p>
                ))
              )}
            </div>
          </DashboardCard>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <DashboardCard className="flex flex-col gap-4 bg-secondary/5 sm:flex-row sm:items-center sm:justify-between border border-secondary/10">
          <div className="flex items-center gap-3">
            <Image src={glitter} alt="" className="size-12 object-contain" />
            <div>
              <p className="text-sm font-semibold text-primary">Recent Milestone</p>
              <p className="text-sm text-muted-foreground">You just passed:</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-secondary">${(overview?.financialBreakdown?.totalAmount || 0).toFixed(0)} In Donations</p>
        </DashboardCard>

        <DashboardCard className="flex flex-col gap-4 bg-secondary/5 sm:flex-row sm:items-center sm:justify-between border border-secondary/10">
          <p className="max-w-md text-sm font-medium text-muted-foreground">Keep sharing your campaign to reach your next milestone.</p>
          <div className="flex items-center gap-3">
            <Image src={order} alt="" className="size-16 rounded-lg object-cover" />
            <Image src={roket} alt="" className="size-14 object-contain" />
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}
