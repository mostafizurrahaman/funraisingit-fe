/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  Banknote,
  CalendarDays,
  Goal,
  Heart,
  PackageCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import roket from "@/assets/roket.png";
import send from "@/assets/send.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/DashboardAnalytics/DashboardAnalyticsApi";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllMyCampaignsQuery } from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

const quickActions = [
  { label: "Copy Link", className: "bg-blue-600 hover:bg-blue-700" },
  { label: "Facebook", className: "bg-blue-700 hover:bg-blue-800" },
  { label: "Text Message", className: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Email", className: "bg-violet-600 hover:bg-violet-700" },
  { label: "WhatsApp", className: "bg-purple-600 hover:bg-purple-700" },
] as const;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const initialCampaignId =
    searchParams.get("campaignId") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("campaignId")
      : null) ||
    "";

  const [selectedCampaignId, setSelectedCampaignId] =
    useState<string>(initialCampaignId);

  const { data: myCampaignsResponse, isLoading: isLoadingCampaigns } =
    useGetAllMyCampaignsQuery(undefined, {
      skip: !selectedCampaignId && !initialCampaignId,
    });
  const campaignsList = myCampaignsResponse?.data || [];

  // Sort campaigns by createdAt descending to get the most recent first
  const sortedCampaigns = [...campaignsList].sort((a: any, b: any) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  console.log("Sorted Campaigns:", myCampaignsResponse);
  // Automatically select the most recent campaign if selectedCampaignId is empty
  useEffect(() => {
    if (!selectedCampaignId && sortedCampaigns.length > 0) {
      const mostRecentId = sortedCampaigns[0]._id;
      setSelectedCampaignId(mostRecentId);
      if (typeof window !== "undefined") {
        localStorage.setItem("campaignId", mostRecentId);
      }
    }
  }, [sortedCampaigns, selectedCampaignId]);

  const {
    data: response,
    isLoading: isLoadingAnalytics,
    error,
  } = useGetDashboardAnalyticsQuery(selectedCampaignId, {
    skip: !selectedCampaignId,
  });

  const isLoading =
    isLoadingCampaigns || (selectedCampaignId ? isLoadingAnalytics : true);

  const selectedCampaign = campaignsList.find((c: any) => c._id === selectedCampaignId);
  const campaignCode = selectedCampaign?.campaignCode || "";

  const handleShareAction = (label: string) => {
    if (!campaignCode) {
      toast.error("No active campaign selected to share.");
      return;
    }
    const shareUrl = `${window.location.origin}/campaign/${campaignCode}`;

    switch (label) {
      case "Copy Link":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Campaign link copied to clipboard!");
        break;
      case "Facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "Text Message":
        window.location.href = `sms:?&body=${encodeURIComponent(shareUrl)}`;
        break;
      case "Email":
        window.location.href = `mailto:?subject=${encodeURIComponent("Support my campaign")}&body=${encodeURIComponent(shareUrl)}`;
        break;
      case "WhatsApp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg font-semibold text-muted-foreground">
          Loading dashboard analytics...
        </p>
      </div>
    );
  }

  if (selectedCampaignId && (error || (response && !response.success))) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-red-500">
          {myCampaignsResponse?.data?.length === 0
            ? "No campaign found."
            : "Failed to load dashboard analytics."}
        </p>
        {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
      </div>
    );
  }

  const data = response?.data || {};

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-xs text-muted-foreground">
            Select a campaign to filter dashboard analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="campaign-filter"
            className="text-sm font-semibold text-muted-foreground shrink-0"
          >
            Campaign:
          </label>
          <select
            id="campaign-filter"
            value={selectedCampaignId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCampaignId(val);
              if (typeof window !== "undefined") {
                if (val) {
                  localStorage.setItem("campaignId", val);
                } else {
                  localStorage.removeItem("campaignId");
                }
              }
            }}
            className="flex h-10 w-full sm:w-64 rounded-md border border-slate-300 px-3 text-sm outline-none transition-all duration-300 focus:border-secondary cursor-pointer bg-white"
          >
            {sortedCampaigns.map((campaign: any) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardCard className="overflow-hidden">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Welcome back, Jennie!</h2>
                <Image src={glitter} alt="" className="size-6 object-contain" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Jennie&apos;s Banana Pudding
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3">
              <Image
                src={order}
                alt=""
                className="size-14 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-primary">
                  You&apos;re doing great!
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep sharing your link and watch your support grow.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Today&apos;s reminder
            </p>
            <p className="mt-1 text-lg font-semibold">
              Share with 3 more supporters
            </p>
          </div>
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Heart className="size-5 fill-current" />
          </span>
        </DashboardCard>
      </section> */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Raised"
          value={`$${data.raisedAmount}`}
          detail={`of $${data.goalAmount} goal`}
          icon={Banknote}
          tone="secondary"
        />
        <StatCard
          title="Supporters"
          value={String(data.supporters)}
          detail="people"
          icon={Heart}
          tone="rose"
        />
        <StatCard
          title="Orders"
          value={String(data.orders)}
          detail="total orders"
          icon={ShoppingBag}
          tone="primary"
        />
        <StatCard
          title="Goal"
          value={`$${data.goalAmount}`}
          detail="campaign target"
          icon={Goal}
          tone="violet"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <DashboardCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Campaign Progress</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  ${data.raisedAmount} raised of ${data.goalAmount} goal
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <CalendarDays className="size-4" />
                {data.remainingDays} days remaining
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary/10">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${data.raisedPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-right text-sm font-semibold text-secondary">
              {data.raisedPercentage}%
            </p>
          </DashboardCard>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Activity</h3>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {!data.recentActivities ||
                data.recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity.
                  </p>
                ) : (
                  data.recentActivities.map((activity: any, index: number) => (
                    <div
                      key={activity.paymentId || index}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors duration-300 hover:bg-secondary/5"
                    >
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                        <Heart className="size-4 fill-current" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {activity.name}{" "}
                          {activity.isDonation ? "donated" : "purchased"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.paidAt}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ${activity.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Orders</h3>
              </div>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {!data.recentOrders || data.recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent orders.
                  </p>
                ) : (
                  data.recentOrders.map((orderItem: any, index: number) => (
                    <div
                      key={orderItem.orderId || index}
                      className="grid grid-cols-[1fr_56px_72px] gap-2 text-sm"
                    >
                      <span className="font-medium">{orderItem.name}</span>
                      <span className="text-center text-muted-foreground">
                        1
                      </span>
                      <span className="text-right font-semibold">
                        ${orderItem.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <Link
                href="/dashboard/orders"
                className="mt-5 block text-xs font-semibold text-primary hover:underline"
              >
                <Button className="mt-5 w-full bg-primary text-xs hover:bg-primary-hover">
                  <PackageCheck className="size-4" />
                  View All Orders
                </Button>
              </Link>
            </DashboardCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Donations</h3>
              </div>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {!data.recentDonations || data.recentDonations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent donations.
                  </p>
                ) : (
                  data.recentDonations.map((donation: any, index: number) => (
                    <div
                      key={donation.donationId || index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">{donation.name}</span>
                      <span className="font-semibold">${donation.amount}</span>
                    </div>
                  ))
                )}
              </div>
              <Link href="/dashboard/donation">
                <Button variant="outline" className="mt-5 w-full text-xs">
                  <Heart className="size-4" />
                  View All Donations
                </Button>
              </Link>
            </DashboardCard>

            {/* <DashboardCard>
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Download className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">Download Orders</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Download a spreadsheet of all orders and customer details.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                >
                  <FileSpreadsheet className="size-4" />
                  Download Excel
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                >
                  <ClipboardList className="size-4" />
                  Download CSV
                </Button>
              </div>
            </DashboardCard> */}
          </div>
        </div>

        <aside className="space-y-5">
          <DashboardCard>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-secondary" />
              <h3 className="text-base font-semibold">Payout Status</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Campaign Ends</span>
                <span className="font-semibold">
                  {data.campaignEnds
                    ? new Date(data.campaignEnds).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expected Payout</span>
                <span className="font-semibold">
                  {data.expectedPayoutDate
                    ? new Date(data.expectedPayoutDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-semibold text-secondary">
                  ${data.remainingBalance}
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-secondary/10 p-3 text-xs text-muted-foreground">
              Payouts are sent 5 business days after your campaign ends.
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="text-base font-semibold">Share Campaign</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The more you share, the more you&apos;ll raise.
            </p>
            <div className="mt-4 space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleShareAction(action.label)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${action.className}`}
                >
                  <Send className="size-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">Current Goal</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get 50 supporters
                </p>
              </div>
              <Image src={roket} alt="" className="size-12 object-contain" />
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary/10">
              <div className="h-full w-[64%] rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-right text-sm font-semibold">64%</p>
          </DashboardCard>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DashboardCard className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Image
            src={send}
            alt=""
            className="size-16 rounded-lg bg-secondary/10 object-contain p-3"
          />
          <div className="flex-1">
            <h3 className="text-base font-semibold">Need More Sales?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Accept pre-orders and online payments for your next campaign.
            </p>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            Learn More
          </Button>
        </DashboardCard>

        <DashboardCard className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="inline-flex size-16 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Users className="size-8" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-semibold">Business Launch Center</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ready to scale from fundraising to a real brand?
            </p>
          </div>
          <Link href="/brand-builder">
            <Button size="sm" variant="outline" className="w-full sm:w-auto">
              Explore
            </Button>
          </Link>
        </DashboardCard>
      </section>

      <p className="pb-3 text-center text-xs text-muted-foreground">
        <TrendingUp className="mr-1 inline size-4 text-secondary" />
        PRO TIP: Campaigns that post updates daily raise more. Keep your
        supporters engaged.
      </p>
    </div>
  );
}
