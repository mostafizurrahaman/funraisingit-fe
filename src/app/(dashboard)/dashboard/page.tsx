/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  Banknote,
  CalendarDays,
  ClipboardList,
  Download,
  FileSpreadsheet,
  Goal,
  Heart,
  PackageCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import glitter from "@/assets/glitter.png";
import order from "@/assets/order.png";
import roket from "@/assets/roket.png";
import send from "@/assets/send.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/DashboardAnalytics/DashboardAnalyticsApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const activities = [
  { name: "Sarah donated", note: "5 minutes ago", amount: "$20" },
  {
    name: "Mike purchased 2 Banana Puddings",
    note: "15 minutes ago",
    amount: "$20",
  },
  {
    name: "Brenda fully supported your page",
    note: "1 hour ago",
    amount: "$50",
  },
  {
    name: "Aisha purchased Banana Pudding",
    note: "2 hours ago",
    amount: "$10",
  },
  { name: "Jennifer L. donated", note: "3 hours ago", amount: "$20" },
] as const;

const orders = [
  { customer: "Brenda M.", quantity: 2, total: "$20.00" },
  { customer: "Mike F.", quantity: 2, total: "$20.00" },
  { customer: "Aubrey K.", quantity: 4, total: "$40.00" },
  { customer: "David K.", quantity: 2, total: "$20.00" },
] as const;

const donations = [
  { donor: "Grace", amount: "$100.00" },
  { donor: "Alex K.", amount: "$50.00" },
  { donor: "Ashley K.", amount: "$25.00" },
  { donor: "David C.", amount: "$20.00" },
  { donor: "Linda L.", amount: "$10.00" },
] as const;

const quickActions = [
  { label: "Copy Link", className: "bg-blue-600 hover:bg-blue-700" },
  { label: "Facebook", className: "bg-blue-700 hover:bg-blue-800" },
  { label: "Text Message", className: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Email", className: "bg-violet-600 hover:bg-violet-700" },
  { label: "WhatsApp", className: "bg-purple-600 hover:bg-purple-700" },
] as const;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const campaignId =
    searchParams.get("campaignId") ||
    (typeof window !== "undefined" ? localStorage.getItem("campaignId") : null) 

  const { data: response, isLoading, error } = useGetDashboardAnalyticsQuery(campaignId);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg font-semibold text-muted-foreground">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-red-500">Failed to load dashboard data.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const data = response.data;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
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
                <CalendarDays className="size-4" />{data.remainingDays} days remaining
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary/10">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${data.raisedPercentage}%` }} />
            </div>
            <p className="mt-2 text-right text-sm font-semibold text-secondary">
              {data.raisedPercentage}%
            </p>
          </DashboardCard>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Activity</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-muted-foreground transition-colors duration-300 hover:text-secondary"
                >
                  View All Activity
                </button>
              </div>
              <div className="space-y-3">
                {data.recentActivities?.map((activity: any, index: number) => (
                  <div
                    key={activity.paymentId || index}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors duration-300 hover:bg-secondary/5"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                      <Heart className="size-4 fill-current" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {activity.name} {activity.isDonation ? "donated" : "purchased"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.paidAt}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      ${activity.amount}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Orders</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-secondary transition-colors duration-300 hover:text-primary"
                >
                  View All Orders
                </button>
              </div>
              <div className="space-y-3">
                {data.recentOrders?.map((orderItem: any, index: number) => (
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
                ))}
              </div>
              <Button className="mt-5 w-full bg-primary text-xs hover:bg-primary-hover">
                <PackageCheck className="size-4" />
                View All Orders
              </Button>
            </DashboardCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <DashboardCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Donations</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-secondary transition-colors duration-300 hover:text-primary"
                >
                  View All Donations
                </button>
              </div>
              <div className="space-y-3">
                {data.recentDonations?.map((donation: any, index: number) => (
                  <div
                    key={donation.donationId || index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium">{donation.name}</span>
                    <span className="font-semibold">${donation.amount}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-5 w-full text-xs">
                <Heart className="size-4" />
                View All Donations
              </Button>
            </DashboardCard>

            <DashboardCard>
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
            </DashboardCard>
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
                  {data.campaignEnds ? new Date(data.campaignEnds).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expected Payout</span>
                <span className="font-semibold">
                  {data.expectedPayoutDate ? new Date(data.expectedPayoutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-semibold text-secondary">${data.remainingBalance}</span>
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
