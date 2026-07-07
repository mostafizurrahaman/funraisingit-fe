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
} from "lucide-react";
import glitter from "@/assets/glitter.png";
import heart from "@/assets/heart.png";
import order from "@/assets/order.png";
import roket from "@/assets/roket.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryStats = [
  { title: "Total Orders", value: "18", detail: "All Orders", icon: PackageCheck, tone: "secondary" },
  { title: "Total Items Sold", value: "28", detail: "Across all orders", icon: Gift, tone: "primary" },
  { title: "Total Sales", value: "$180.00", detail: "From orders", icon: CircleDollarSign, tone: "violet" },
  { title: "To Be Delivered", value: "12", detail: "Not marked delivered", icon: Truck, tone: "blue" },
] as const;

const recentDonations = [
  { donor: "Jennifer T.", amount: "$25.00", message: "Proud of sweetheart!", date: "Today, 9:42 AM" },
  { donor: "Michael R.", amount: "$25.00", message: "Can't wait to try it!", date: "Today, 8:15 AM" },
  { donor: "Uncle James", amount: "$30.00", message: "Good luck!", date: "Today, 7:30 AM" },
  { donor: "Aunt Carol", amount: "$20.00", message: "Keep going!", date: "Yesterday, 8:45 AM" },
  { donor: "Sarah Johnson", amount: "$25.00", message: "You've got this!", date: "Yesterday, 6:32 AM" },
  { donor: "The Johnson Family", amount: "$40.00", message: "Supporting dream!", date: "Yesterday, 4:21 AM" },
  { donor: "Neighbor Dave", amount: "$10.00", message: "Best wishes!", date: "Yesterday, 2:10 AM" },
] as const;

const activityFeed = [
  { text: "Grandma donated $75", time: "9:42 AM" },
  { text: "Aunt Mary donated $100", time: "10:30 AM" },
  { text: "Brother Alex donated $60", time: "11:45 AM" },
  { text: "Uncle Bob donated $50", time: "10:06 AM" },
  { text: "Sister Claire donated $25", time: "11:45 AM" },
  { text: "Cousin Joe donated $30", time: "10:30 AM" },
  { text: "Friend Sarah donated $10", time: "12:00 PM" },
] as const;

const supporters = [
  { name: "Grandma Betty", amount: "$75" },
  { name: "The Johnson Family", amount: "$40" },
  { name: "Uncle James", amount: "$30" },
  { name: "Jennifer T.", amount: "$25" },
  { name: "Sarah Johnson", amount: "$25" },
] as const;

const messages = ["Proud of you sweetheart!", "Keep pushing", "You can do this!", "Can't wait to try it!", "Supporting your dream."] as const;

const statToneStyles = {
  secondary: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
} as const;

export default function DonationPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
            <DashboardCard className="flex items-center gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <Heart className="size-7 fill-current" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold">Donations</h2>
                <p className="mt-1 text-sm text-muted-foreground">Jennie&apos;s Banana Pudding</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium">
                  Campaign Status:
                  <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">Live</span>
                </p>
              </div>
            </DashboardCard>

            <DashboardCard className="relative overflow-hidden bg-rose-50">
              <div className="relative z-10">
                <p className="text-sm font-semibold text-muted-foreground">Total Donations Received</p>
                <p className="mt-2 text-3xl font-semibold">$325.00</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="size-4 fill-rose-500 text-rose-500" />
                  From 12 supporters
                </p>
              </div>
              <Image src={heart} alt="" className="absolute right-5 top-1/2 size-24 -translate-y-1/2 object-contain opacity-80" />
            </DashboardCard>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <DashboardCard key={stat.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", statToneStyles[stat.tone])}>
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

          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <DashboardCard>
              <h3 className="text-base font-semibold">Recent Donations</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-semibold">Donor</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Message</th>
                      <th className="pb-3 text-right font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentDonations.map((donation) => (
                      <tr key={`${donation.donor}-${donation.date}`} className="transition-colors duration-300 hover:bg-secondary/5">
                        <td className="py-2.5">
                          <span className="flex items-center gap-2 font-semibold">
                            <Heart className="size-4 fill-rose-500 text-rose-500" />
                            {donation.donor}
                          </span>
                        </td>
                        <td className="py-2.5 font-semibold text-secondary">{donation.amount}</td>
                        <td className="py-2.5 text-muted-foreground">{donation.message}</td>
                        <td className="py-2.5 text-right text-xs text-muted-foreground">{donation.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" size="sm" className="mx-auto mt-4 flex text-xs">
                <Heart className="size-4" />
                View All Donations
              </Button>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-base font-semibold">Donation Activity Feed</h3>
              <div className="mt-4 space-y-3">
                {activityFeed.map((activity) => (
                  <div key={`${activity.text}-${activity.time}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Heart className="size-4 fill-rose-500 text-rose-500" />
                      {activity.text}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <DashboardCard>
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <Download className="size-5" />
                Download Donations
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Download a spreadsheet of all donations and donor details.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start text-xs">
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  Download Excel
                </Button>
                <Button variant="outline" className="justify-start text-xs">
                  <Download className="size-4" />
                  Download CSV
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Includes donor name, email, phone, amount, message, date.</p>
            </DashboardCard>

            <DashboardCard>
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <Heart className="size-5 fill-rose-500 text-rose-500" />
                Thank Your Supporters
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Express appreciation and build deeper relationships.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button className="text-xs">
                  <MessageCircle className="size-4" />
                  Send Your Email
                </Button>
                <Button variant="outline" className="text-xs">
                  <Users className="size-4" />
                  Download Donor List
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Build stronger relationships for future campaigns.</p>
            </DashboardCard>
          </section>
        </div>

        <aside className="space-y-5">
          <DashboardCard>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Target className="size-5 text-primary" />
              Donation Goal Progress
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">Goal: $500 Donations</p>
            <p className="mt-2 text-lg font-semibold">$325 Raised</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary/10">
              <div className="h-full w-[65%] rounded-full bg-secondary" />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-muted-foreground">$175 to go</span>
              <span className="font-semibold text-secondary">65%</span>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Star className="size-5 fill-amber-400 text-amber-400" />
              Top Supporters
            </h3>
            <div className="mt-4 space-y-3">
              {supporters.map((supporter, index) => (
                <div key={supporter.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary/10 text-xs text-secondary">{index + 1}</span>
                    {supporter.name}
                  </span>
                  <span className="font-semibold">{supporter.amount}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-5 w-full text-xs">
              <Users className="size-4" />
              View All Supporters
            </Button>
          </DashboardCard>

          <DashboardCard>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <MessageCircle className="size-5 text-blue-600" />
              Message From Supporters
            </h3>
            <div className="mt-4 space-y-3">
              {messages.map((message) => (
                <p key={message} className="rounded-lg bg-[#f8ffff] px-3 py-2 text-sm font-medium">
                  &quot;{message}&quot;
                </p>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-5 w-full text-xs">
              <MessageCircle className="size-4" />
              View All Messages
            </Button>
          </DashboardCard>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <DashboardCard className="flex flex-col gap-4 bg-secondary/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image src={glitter} alt="" className="size-12 object-contain" />
            <div>
              <p className="text-sm font-semibold text-primary">Recent Milestone</p>
              <p className="text-sm text-muted-foreground">You just passed:</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-secondary">$300 In Donations</p>
        </DashboardCard>

        <DashboardCard className="flex flex-col gap-4 bg-secondary/5 sm:flex-row sm:items-center sm:justify-between">
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
