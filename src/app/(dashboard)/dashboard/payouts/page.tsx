/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  Heart,
  HelpCircle,
  Landmark,
  Rocket,
  ShieldCheck,
  Trophy,
  WalletCards,
  Loader2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetCampaignByIdQuery } from "@/redux/features/campaign/campaignApi";
import {
  useGetPayoutHistoryQuery,
  useGetPayoutOverviewQuery,
} from "@/redux/features/Payout/PayoutApi";
import { useGetAccountQuery } from "@/redux/features/auth/authApi";

const faqItems = [
  {
    question: "When do I get paid?",
    answer: "Within 1 business day after your campaign ends.",
    icon: CalendarDays,
  },
  {
    question: "Why are funds processing?",
    answer: "This allows payment verification and fraud protection.",
    icon: ShieldCheck,
  },
  {
    question: "Can I see my payout before the campaign ends?",
    answer: "Yes, estimated earnings update in real time.",
    icon: CheckCircle2,
  },
] as const;

const taxDocuments = [
  "1099 Forms",
  "Annual Earnings Summary",
  "Payment History",
] as const;

export default function PayoutsPage() {
  const [campaignId, setCampaignId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCampaignId(localStorage.getItem("campaignId") || "");
    }
  }, []);

  // 1. Get campaign details
  const { data: campaignResponse, isLoading: isLoadingCampaign } =
    useGetCampaignByIdQuery(campaignId, {
      skip: !campaignId,
    });
  const campaign = campaignResponse?.data;

  // 2. Get payout overview
  const { data: overviewResponse, isLoading: isLoadingOverview } =
    useGetPayoutOverviewQuery(campaignId, {
      skip: !campaignId,
    });
  const overview = overviewResponse?.data;

  // 4. Get onboarding account details
  const { data: accountResponse, isLoading: isLoadingAccount } =
    useGetAccountQuery({});
  const accountInfo = accountResponse?.data;

  // 3. Get payout history
  const { data: historyResponse, isLoading: isLoadingHistory } =
    useGetPayoutHistoryQuery(
      { campaignId, page, limit: 10 },
      { skip: !campaignId },
    );
  const payoutHistories = historyResponse?.data || [];
  const meta = historyResponse?.meta;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return "N/A";
    if (start && !end) return formatDate(start);
    if (!start && end) return formatDate(end);

    const startDate = new Date(start!);
    const endDate = new Date(end!);
    const startStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-US", {
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const isLoading =
    isLoadingCampaign ||
    isLoadingOverview ||
    isLoadingHistory ||
    isLoadingAccount;

  if (!campaignId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No campaign selected. Please select a campaign from the dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <Loader2 className="size-8 animate-spin text-secondary" />
        <p className="text-xs text-muted-foreground">
          Loading payout details...
        </p>
      </div>
    );
  }
  if (isLoadingAccount) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <Loader2 className="size-8 animate-spin text-secondary" />
        <p className="text-xs text-muted-foreground">
          Loading account details...
        </p>
      </div>
    );
  }

  const payoutTimeline = [
    {
      label: "Campaign ends",
      date: formatDate(overview?.endedAt),
      icon: CalendarDays,
    },
    {
      label: "Funds processing",
      date: formatDate(overview?.fundProcessingAt),
      icon: Building2,
    },
    {
      label: "Payout sent",
      date: formatDate(overview?.estimatedDepositFirstDate),
      icon: Rocket,
    },
    {
      label: "Estimated deposit",
      date: formatDateRange(
        overview?.estimatedDepositFirstDate,
        overview?.estimatedDepositLastDate,
      ),
      icon: WalletCards,
    },
  ] as const;

  const earningsBreakdown = [
    {
      label: "Gross Sales",
      amount: formatAmount(overview?.financialBreakdown?.totalOrderAmount),
      highlight: false,
      danger: false,
    },
    {
      label: "Donations",
      amount: formatAmount(overview?.financialBreakdown?.totalDonationAmount),
      highlight: false,
      danger: false,
    },
    {
      label: "Total Raised",
      amount: formatAmount(overview?.financialBreakdown?.totalAmount),
      highlight: true,
      danger: false,
    },
    {
      label: "Platform Fee",
      amount: `-${formatAmount(overview?.financialBreakdown?.platformFee)}`,
      highlight: false,
      danger: true,
    },
  ] as const;

  const displayBankAccount = accountInfo?.account
    ? `**** **** **** ${accountInfo.account.slice(-4)}`
    : overview?.bankAccount
      ? `**** **** **** ${overview.bankAccount.slice(-4)}`
      : "Not Connected";

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1fr_1.1fr_2fr]">
        <DashboardCard className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <WalletCards className="size-8" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Payouts</h2>
            <p className="mt-2 text-sm font-semibold">
              {campaign?.name || "Loading..."}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium">
              Campaign Status:
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize">
                <span className="size-2 rounded-full bg-secondary animate-pulse" />
                {overview?.status || campaign?.status || "active"}
              </span>
            </p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold">Available Balance (Stripe)</p>
          <p className="mt-2 text-3xl font-semibold text-secondary">
            {formatAmount(overview?.stripeBalance?.available)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pending: {formatAmount(overview?.stripeBalance?.pending)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <CheckCircle2 className="size-3.5" />
            {overview?.status === "active" ? "On Track" : "Ready"}
          </span>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-base font-semibold">Payout Timeline</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            {payoutTimeline.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="relative text-center">
                  {index < payoutTimeline.length - 1 && (
                    <span className="absolute left-1/2 top-6 hidden h-px w-full bg-blue-500 sm:block" />
                  )}
                  <span className="relative z-10 mx-auto inline-flex size-12 items-center justify-center rounded-full border border-blue-500 bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-3 text-xs font-semibold">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                    {item.date}
                  </p>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_1.55fr_1fr]">
        <DashboardCard>
          <h3 className="text-base font-semibold">Earning Breakdown</h3>
          <div className="mt-4 space-y-3">
            {earningsBreakdown.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between gap-4 text-sm",
                  item.highlight && "border-t border-border pt-3 font-semibold",
                  item.highlight && "text-secondary",
                  item.danger && "text-rose-500",
                )}
              >
                <span
                  className={cn(
                    !item.highlight && !item.danger && "text-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span>{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-emerald-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Estimated Payout</p>
              <p className="text-2xl font-semibold text-secondary">
                {formatAmount(overview?.financialBreakdown?.organizerAmount)}
              </p>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 fill-emerald-600 text-emerald-600" />
              You keep 94% of what you raise.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-base font-semibold">Recent Payout Activity</h3>
          <div className="mt-4 overflow-x-auto">
            {payoutHistories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No payout history found.
              </p>
            ) : (
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Stripe Account</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payoutHistories.map((activity: any, index: number) => (
                    <tr
                      key={`${activity.payoutId}-${index}`}
                      className="transition-colors duration-300 hover:bg-secondary/5"
                    >
                      <td className="py-2.5">
                        {formatDate(activity.createdAt)}
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-2 font-semibold">
                          <Heart className="size-4 fill-rose-500 text-rose-500" />
                          {activity.stripeAccountId || "Stripe"}
                        </span>
                      </td>
                      <td className="py-2.5 font-semibold">
                        {formatAmount(activity.amount)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-3 py-1 text-xs font-semibold capitalize",
                            activity.status === "failed"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700",
                          )}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 cursor-pointer"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 cursor-pointer"
                  disabled={page === meta.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </DashboardCard>

        <DashboardCard className="flex flex-col items-center justify-center text-center">
          <span className="inline-flex size-20 items-center justify-center rounded-full bg-secondary/10 text-amber-500">
            <Trophy className="size-10 fill-amber-400" />
          </span>
          <p className="mt-4 text-lg font-semibold">Great Job!</p>
          <p className="mt-4 text-base font-semibold">Current Earnings</p>
          <p className="mt-2 text-3xl font-semibold text-secondary">
            {formatAmount(overview?.financialBreakdown?.organizerAmount)}
          </p>
          <p className="mt-5 text-base font-semibold">Projected Deposit</p>
          <p className="mt-1 text-2xl font-semibold text-secondary">
            {formatDate(overview?.estimatedDepositFirstDate)}
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="size-5 shrink-0 text-primary" />
            Keep sharing your campaign to increase your payout
          </p>
        </DashboardCard>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard className="text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Landmark className="size-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">Payout Account</h3>
          <p className="mt-3 text-sm font-semibold">Bank Account</p>
          <p className="text-sm font-semibold">{displayBankAccount}</p>
          <span
            className={cn(
              "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              accountInfo?.status === "active" || overview?.isBankConnected
                ? "bg-secondary/10 text-secondary"
                : "bg-rose-100 text-rose-700",
            )}
          >
            <CheckCircle2 className="size-3" />
            {accountInfo?.status === "active" || overview?.isBankConnected
              ? "Connected"
              : "Disconnected"}
          </span>
          <p className="mx-auto mt-5 max-w-44 text-sm text-muted-foreground">
            Need to update your banking information?
          </p>
        </DashboardCard>

        <DashboardCard className="text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <CalendarDays className="size-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">Upcoming Payout</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimated Deposit
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatAmount(overview?.financialBreakdown?.organizerAmount)}
          </p>
          <p className="mt-3 text-sm font-medium">
            {formatDate(overview?.estimatedDepositFirstDate)}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            Scheduled
          </span>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold">Payout History</h3>
            {/* <button type="button" className="text-xs font-semibold text-secondary transition-colors duration-300 hover:text-primary">
              View All
            </button> */}
          </div>
          <div className="mt-4 space-y-3">
            {payoutHistories.slice(0, 3).map((item: any) => (
              <div
                key={item.payoutId}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm"
              >
                <span className="font-medium">
                  {formatDate(item.createdAt)}
                </span>
                <span className="font-semibold">
                  {formatAmount(item.amount)}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-semibold capitalize",
                    item.status === "failed"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {item.status}
                </span>
              </div>
            ))}
            {payoutHistories.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                No history.
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full text-xs">
            <Download className="size-4" />
            Download Payout Report
          </Button>
        </DashboardCard>
      </section>

      <section className="grid gap-4 rounded-lg border border-border bg-white p-4 shadow-sm xl:grid-cols-[1fr_1.2fr_1.35fr_1.45fr]">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <HelpCircle className="size-4" />
          </span>
          <p className="text-sm font-semibold">Frequently Asked Questions</p>
        </div>
        {faqItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.question} className="flex gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{item.question}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 pb-3 text-sm text-muted-foreground md:grid-cols-2">
        <p className="flex items-center gap-2">
          <ShieldCheck className="size-5 shrink-0 fill-secondary text-secondary" />
          Your funds are protected and securely processed through FunRaisingIt
        </p>
        <p className="flex items-center gap-2 md:justify-end">
          <ShieldCheck className="size-5 shrink-0 text-secondary" />
          We use industry-standard encryption and secure banking partners.
        </p>
      </section>
    </div>
  );
}
