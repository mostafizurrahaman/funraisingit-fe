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
} from "lucide-react";
import user from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Supporters", value: "138", detail: "People", icon: Users, tone: "secondary" },
  { title: "Total Orders", value: "$1,850", detail: "From 67 supporters", icon: Heart, tone: "rose" },
  { title: "Total Donations", value: "$600", detail: "From 71 supporters", icon: Gift, tone: "blue" },
  { title: "Total Support", value: "$2,450", detail: "Combined total", icon: Star, tone: "primary" },
  { title: "New This Week", value: "24", detail: "New supporters", icon: Users, tone: "violet" },
] as const;

const supporters = [
  { name: "Grandma Betty", email: "betty@gmail.com", phone: "(555) 123-4567", orders: "$40.00", donations: "$75.00", total: "$115.00", activity: "Today" },
  { name: "Uncle John", email: "john.smith@email.com", phone: "(555) 234-5678", orders: "$35.00", donations: "$70.00", total: "$120.00", activity: "Yesterday" },
  { name: "Aunt Susan", email: "susan.jones@email.com", phone: "(555) 345-6789", orders: "$60.00", donations: "$80.00", total: "$130.00", activity: "Yesterday" },
  { name: "Cousin Mike", email: "mike.brown@email.com", phone: "(555) 456-7890", orders: "$55.00", donations: "$90.00", total: "$125.00", activity: "Yesterday" },
  { name: "Sister Lisa", email: "lisa.white@email.com", phone: "(555) 567-8901", orders: "$65.00", donations: "$85.00", total: "$135.00", activity: "2 Days Ago" },
  { name: "Brother Tom", email: "tom.johnson@email.com", phone: "(555) 678-9012", orders: "$70.00", donations: "$95.00", total: "$140.00", activity: "2 Days Ago" },
] as const;

const topSupporters = [
  { name: "Grandma Betty", amount: "$75" },
  { name: "Uncle John", amount: "$40" },
  { name: "Aunt Susan", amount: "$30" },
  { name: "Cousin Mike", amount: "$25" },
  { name: "Brother Tom", amount: "$25" },
] as const;

const insights = [
  { title: "Most Active Day", value: "Saturday", detail: "28 supporters", icon: Users, tone: "secondary" },
  { title: "Most Active Day", value: "10AM-2PM", detail: "Peak engagement", icon: CalendarClock, tone: "blue" },
  { title: "Repeat Supporters", value: "18", detail: "Support twice", icon: Heart, tone: "violet" },
  { title: "Average Order Value", value: "$27.61", detail: "From 67 orders", icon: ShoppingBag, tone: "primary" },
  { title: "Average Donations", value: "$18.75", detail: "From 71 orders", icon: Gift, tone: "green" },
] as const;

const toneStyles = {
  secondary: "bg-secondary/10 text-secondary",
  rose: "bg-rose-50 text-rose-500",
  blue: "bg-blue-100 text-blue-700",
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
} as const;

export default function SupportersPage() {
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
            <p className="mt-4 text-sm font-semibold">Jennie&apos;s Banana Pudding</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              Campaign Status:
              <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">Live</span>
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="h-11 border-secondary text-xs">
            <Download className="size-4" />
            Export List
          </Button>
          <Button variant="outline" className="h-11 border-secondary text-xs">
            <Mail className="size-4" />
            Send Your Email
          </Button>
          <Button className="h-11 text-xs">
            <Plus className="size-4" />
            Add Supporter
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <DashboardCard key={stat.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", toneStyles[stat.tone])}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.detail}</p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <DashboardCard className="p-0">
          <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-base font-semibold">All Supporters</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Search orders, name, email..." className="h-11 rounded-lg border-border pl-10 text-sm" />
              </div>
              <p className="shrink-0 text-sm font-medium text-muted-foreground">138 Supporters</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs font-semibold text-muted-foreground">
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
                {supporters.map((supporter) => (
                  <tr key={supporter.email} className="transition-colors duration-300 hover:bg-secondary/5">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold">
                        <Image src={user} alt="" className="size-7 rounded-full object-cover" />
                        {supporter.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{supporter.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{supporter.phone}</td>
                    <td className="px-4 py-3 font-medium">{supporter.orders}</td>
                    <td className="px-4 py-3 font-medium">{supporter.donations}</td>
                    <td className="px-4 py-3 font-semibold">{supporter.total}</td>
                    <td className="px-4 py-3 text-muted-foreground">{supporter.activity}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" aria-label={`Open actions for ${supporter.name}`} className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary">
                        <MoreHorizontal className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <aside className="space-y-5">
          <DashboardCard>
            <h3 className="text-base font-semibold">Support Overview</h3>
            <div className="mt-4 flex items-center gap-5">
              <div className="relative flex size-28 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(var(--secondary)_0_48%,#f43f5e_48%_78%,#3b82f6_78%_100%)]">
                <div className="flex size-20 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-xl font-semibold">138</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <LegendDot className="bg-secondary" label="Orders Only" value="67 (48%)" />
                <LegendDot className="bg-rose-500" label="Donations Only" value="71 (51%)" />
                <LegendDot className="bg-blue-500" label="Both Orders & Donations" value="32 (23%)" />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="size-5 text-primary" />
              Top Supporters
            </h3>
            <div className="mt-4 space-y-3">
              {topSupporters.map((supporter, index) => (
                <div key={supporter.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary/10 text-xs text-secondary">{index + 1}</span>
                    <Image src={user} alt="" className="size-7 rounded-full object-cover" />
                    {supporter.name}
                  </span>
                  <span className="font-semibold">{supporter.amount}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </aside>
      </section>

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
        <Button variant="outline" size="sm" className="w-full text-xs sm:w-auto">
          <Mail className="size-4" />
          Send Your Email
        </Button>
      </section>
    </div>
  );
}

function LegendDot({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span className={cn("size-3 rounded-full", className)} />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
