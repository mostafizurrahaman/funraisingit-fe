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
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const payoutTimeline = [
  { label: "Campaign ends", date: "June 25, 2026", icon: CalendarDays },
  { label: "Funds processing", date: "June 26, 2026", icon: Building2 },
  { label: "Payout sent", date: "June 27, 2026", icon: Rocket },
  { label: "Estimated deposit", date: "June 27, 2026 - 28, 2026", icon: WalletCards },
] as const;

const earningsBreakdown = [
  { label: "Gross Sales", amount: "$2,100.00", highlight: false, danger: false },
  { label: "Donations", amount: "$350.00", highlight: false, danger: false },
  { label: "Total Raised", amount: "$2,450.00", highlight: true, danger: false },
  { label: "Platform Fee (6%)", amount: "-$147.00", highlight: false, danger: true },
] as const;

const payoutActivities = [
  { date: "June 12, 2026", type: "Donation", amount: "$50.00", status: "Received" },
  { date: "June 12, 2026", type: "Donation", amount: "$50.00", status: "Received" },
  { date: "June 12, 2026", type: "Donation", amount: "$50.00", status: "Received" },
  { date: "June 12, 2026", type: "Donation", amount: "$50.00", status: "Received" },
  { date: "June 12, 2026", type: "Donation", amount: "$50.00", status: "Received" },
] as const;

const payoutHistory = [
  { date: "May 15, 2026", amount: "$1,842.00", status: "Paid" },
  { date: "April 28, 2026", amount: "$965.00", status: "Paid" },
  { date: "March 11, 2026", amount: "$1,224.00", status: "Paid" },
] as const;

const taxDocuments = ["1099 Forms", "Annual Earnings Summary", "Payment History"] as const;

const faqItems = [
  { question: "When do I get paid?", answer: "Within 1 business day after your campaign ends.", icon: CalendarDays },
  { question: "Why are funds processing?", answer: "This allows payment verification and fraud protection.", icon: ShieldCheck },
  { question: "Can I see my payout before the campaign ends?", answer: "Yes, estimated earnings update in real time.", icon: CheckCircle2 },
] as const;

export default function PayoutsPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1fr_1.1fr_2fr]">
        <DashboardCard className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <WalletCards className="size-8" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Payouts</h2>
            <p className="mt-2 text-sm font-semibold">Jenna&apos;s Banana Pudding</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium">
              Campaign Status:
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                <span className="size-2 rounded-full bg-secondary" />
                Live
              </span>
            </p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold">Available Balance</p>
          <p className="mt-2 text-3xl font-semibold text-secondary">$1,842.00</p>
          <p className="mt-2 text-sm text-muted-foreground">Ready for payout after campaign ends.</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            <CheckCircle2 className="size-3.5" />
            On Track
          </span>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-base font-semibold">Payout Timeline</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            {payoutTimeline.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="relative text-center">
                  {index < payoutTimeline.length - 1 && <span className="absolute left-1/2 top-6 hidden h-px w-full bg-blue-500 sm:block" />}
                  <span className="relative z-10 mx-auto inline-flex size-12 items-center justify-center rounded-full border border-blue-500 bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-3 text-xs font-semibold">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{item.date}</p>
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
                <span className={cn(!item.highlight && !item.danger && "text-foreground")}>{item.label}</span>
                <span>{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-emerald-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Estimated Payout</p>
              <p className="text-2xl font-semibold text-secondary">$2,303.00</p>
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
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payoutActivities.map((activity, index) => (
                  <tr key={`${activity.date}-${index}`} className="transition-colors duration-300 hover:bg-secondary/5">
                    <td className="py-2.5">{activity.date}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <Heart className="size-4 fill-rose-500 text-rose-500" />
                        {activity.type}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold">{activity.amount}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{activity.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col items-center justify-center text-center">
          <span className="inline-flex size-20 items-center justify-center rounded-full bg-secondary/10 text-amber-500">
            <Trophy className="size-10 fill-amber-400" />
          </span>
          <p className="mt-4 text-lg font-semibold">Great Job!</p>
          <p className="mt-4 text-base font-semibold">Current Earnings</p>
          <p className="mt-2 text-3xl font-semibold text-secondary">$2,303.00</p>
          <p className="mt-5 text-base font-semibold">Projected Deposit</p>
          <p className="mt-1 text-2xl font-semibold text-secondary">June 27, 2026</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="size-5 shrink-0 text-primary" />
            Keep sharing your campaign to increase your payout
          </p>
        </DashboardCard>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_0.95fr_1.05fr_1.15fr]">
        <DashboardCard className="text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Landmark className="size-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">Payout Account</h3>
          <p className="mt-3 text-sm font-semibold">Bank Account</p>
          <p className="text-sm font-semibold">**** **** **** 4321</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary">
            <CheckCircle2 className="size-3" />
            Connected
          </span>
          <p className="mx-auto mt-5 max-w-44 text-sm text-muted-foreground">Need to update your banking information?</p>
          <Button variant="outline" size="sm" className="mt-4 w-full text-xs">
            Edit Bank Information
          </Button>
        </DashboardCard>

        <DashboardCard className="text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <CalendarDays className="size-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">Upcoming Payout</h3>
          <p className="mt-1 text-sm text-muted-foreground">Estimated Deposit</p>
          <p className="mt-2 text-lg font-semibold">$2,303.00</p>
          <p className="mt-3 text-sm font-medium">June 27, 2026</p>
          <span className="mt-3 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">Scheduled</span>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold">Payout History</h3>
            <button type="button" className="text-xs font-semibold text-secondary transition-colors duration-300 hover:text-primary">
              View All
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {payoutHistory.map((item) => (
              <div key={item.date} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
                <span className="font-medium">{item.date}</span>
                <span className="font-semibold">{item.amount}</span>
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full text-xs">
            <Download className="size-4" />
            Download Payout Report
          </Button>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-4">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <ClipboardList className="size-7" />
            </span>
            <h3 className="text-base font-semibold">Tax Documents</h3>
          </div>
          <div className="mt-5 space-y-3">
            {taxDocuments.map((document) => (
              <button key={document} type="button" className="flex w-full items-center justify-between gap-3 text-sm font-medium transition-colors duration-300 hover:text-secondary">
                <span>{document}</span>
                <ChevronRight className="size-4" />
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full border-violet-500 text-violet-700 hover:bg-violet-600 hover:text-white">
            <Download className="size-4" />
            Download Documents
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
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.answer}</p>
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

