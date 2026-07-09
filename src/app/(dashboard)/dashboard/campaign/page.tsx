import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardEdit,
  Copy,
  Edit3,
  Flag,
  Globe2,
  Heart,
  ImageIcon,
  Mail,
  Megaphone,
  Package,
  Pause,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  Zap,
} from "lucide-react";
import order from "@/assets/order.png";
import user from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const healthItems = ["Photo Added", "Story Added", "Product Added", "Delivery Selected", "Donation Enabled"] as const;

const editCampaignItems = [
  { label: "Campaign Name", value: "Jenna's Banana Pudding", icon: Edit3, action: "Edit" },
  { label: "Fundraising Goal", value: "$2,500", icon: Target, action: "Edit" },
  { label: "Campaign Length", value: "7 Days", icon: CalendarDays, action: "Edit" },
  { label: "Campaign Photo", value: "Product image", icon: ImageIcon, action: "Replace Photo", image: true },
] as const;

const performanceItems = [
  { label: "Supporters", value: "57", icon: Heart, className: "text-rose-500" },
  { label: "Orders", value: "32", icon: Package, className: "text-primary" },
  { label: "Raised", value: "$1,426", icon: Sparkles, className: "text-secondary" },
  { label: "Goal", value: "57%", icon: Target, className: "text-violet-600" },
] as const;

const deliveryOptions = [
  { title: "Pickup", detail: "Local pickup at a designated location" },
  { title: "Local Delivery", detail: "Delivered to local addresses" },
  { title: "Shipping", detail: "Shipped anywhere" },
] as const;

const visibilityOptions = [
  { title: "Public", detail: "Anyone with your link can view", active: true },
  { title: "Private", detail: "Only invited supporters can view", active: false },
] as const;

const quickActions = [
  { label: "Save Changes", icon: Save, className: "border-secondary text-secondary hover:bg-secondary hover:text-white" },
  { label: "Post Campaign Update", icon: Megaphone, className: "border-violet-500 text-violet-700 hover:bg-violet-600 hover:text-white" },
  { label: "Email Supporters", icon: Mail, className: "border-primary text-primary hover:bg-primary hover:text-white" },
  { label: "Copy Campaign Link", icon: Copy, className: "border-secondary text-secondary hover:bg-secondary hover:text-white" },
] as const;

export default function CampaignSettingsPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Campaign Settings</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span>Jenna&apos;s Banana Pudding</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              <span className="size-2 rounded-full bg-secondary" />
              Live
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="size-4 text-foreground" />
              7 Days Remaining
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1.2fr_0.68fr]">
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Heart className="size-5 fill-secondary text-secondary" />
            Campaign Health
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-2.5">
              {healthItems.map((item) => (
                <p key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 fill-secondary text-white" />
                  {item}
                </p>
              ))}
            </div>
            <div className="text-center">
              <div className="relative mx-auto flex size-28 items-center justify-center rounded-full border-[10px] border-secondary">
                <div>
                  <p className="text-4xl font-semibold">95</p>
                  <p className="text-xs font-medium">/100</p>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">Campaign Score</p>
              <div className="mt-1 flex justify-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">Excellent Campaign!</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ClipboardEdit className="size-5" />
            Edit Campaign
          </h3>
          <div className="mt-4 space-y-4">
            {editCampaignItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="grid gap-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
                  <span className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Icon className="size-4 text-foreground" />
                    {item.label}
                  </span>
                  <span className="font-semibold">
                    {item.label === "Campaign Photo" ? <Image src={order} alt="Banana pudding campaign" className="size-12 rounded-md object-cover" /> : item.value}
                  </span>
                  <button type="button" className="w-fit rounded-md border border-secondary px-3 py-1 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white">
                    {item.action}
                  </button>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ArrowUpRight className="size-4" />
            Campaign Performance
          </h3>
          <div className="mt-4 space-y-2.5">
            {performanceItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-2 font-semibold text-muted-foreground">
                    <Icon className={cn("size-4", item.className)} />
                    {item.label}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Image src={user} alt="Organizer" className="size-12 rounded-full object-cover ring-2 ring-border" />
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[57%] rounded-full bg-secondary" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">$1,426 of $2,500 goal</p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.78fr_0.9fr_1.1fr_0.78fr]">
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Package className="size-5" />
            Product Details
          </h3>
          <div className="mt-4 flex gap-3">
            <Image src={order} alt="Banana pudding" className="size-16 rounded-md object-cover" />
            <div className="text-sm">
              <p className="font-semibold">Product</p>
              <p>Banana Pudding</p>
              <p className="mt-2 font-semibold">Price</p>
              <p>$10.00</p>
              <p className="mt-2 font-semibold">Shipping Fee</p>
              <p>$8.00</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-5 w-full text-xs">
            Edit Product
          </Button>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Truck className="size-5" />
            Delivery Options
          </h3>
          <div className="mt-4 space-y-3">
            {deliveryOptions.map((option) => (
              <div key={option.title} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-secondary text-white" />
                <div>
                  <p className="font-semibold">{option.title}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{option.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-secondary/10 px-3 py-2 text-center text-xs font-semibold text-secondary">Shipping Fee: $8.00</div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ClipboardEdit className="size-5" />
            Story &amp; About Section
          </h3>
          <div className="mt-4 rounded-lg bg-[#f8ffff] p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">Hi everyone!</p>
            <p className="mt-2">My name is Jenna and I&apos;m raising money to launch Jenna&apos;s Banana Pudding.</p>
            <p className="mt-2">Your support helps me purchase ingredients, packaging and supplies so I can continue growing my business.</p>
            <p className="mt-2">Thank you for believing in me!</p>
          </div>
          <Button variant="outline" size="sm" className="mx-auto mt-4 flex text-xs">
            <Edit3 className="size-4" />
            Edit Story
          </Button>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Heart className="size-5 fill-rose-500 text-rose-500" />
            Donation Settings
          </h3>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-secondary">Donations Enabled</p>
            <button type="button" aria-label="Donations enabled" className="relative h-7 w-12 rounded-full bg-secondary transition-colors duration-300 hover:bg-secondary/90">
              <span className="absolute right-1 top-1 size-5 rounded-full bg-white" />
            </button>
          </div>
          <div className="mt-5 text-sm">
            <p className="font-semibold">Minimum Donation</p>
            <p className="mt-1">$1.00</p>
          </div>
          <Button variant="outline" size="sm" className="mt-8 w-full text-xs">
            Edit Donation Settings
          </Button>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.2fr_1fr]">
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Globe2 className="size-5 text-secondary" />
            Campaign Visibility
          </h3>
          <div className="mt-4 space-y-3">
            {visibilityOptions.map((option) => (
              <button
                key={option.title}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-all duration-300 hover:border-secondary hover:bg-secondary/5",
                  option.active ? "border-secondary bg-secondary/5" : "border-slate-300 bg-white",
                )}
              >
                <span className={cn("mt-0.5 size-4 rounded-full border", option.active ? "border-secondary bg-secondary" : "border-slate-400")} />
                <span>
                  <span className="block text-sm font-semibold">{option.title}</span>
                  <span className="text-xs text-muted-foreground">{option.detail}</span>
                </span>
              </button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Zap className="size-5 text-secondary" />
            Quick Actions
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
                    action.className,
                  )}
                >
                  <Icon className="size-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="size-5 text-secondary" />
            Campaign Management
          </h3>
          <div className="mt-5 space-y-3">
            <button type="button" className="flex w-full items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
              <Pause className="mt-0.5 size-5 shrink-0 fill-amber-500 text-amber-500" />
              <span>
                <span className="block text-sm font-semibold">Pause Campaign</span>
                <span className="text-xs text-muted-foreground">Temporarily stop orders and donations.</span>
              </span>
            </button>
            <button type="button" className="flex w-full items-start gap-3 rounded-md border border-rose-300 bg-rose-50 p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
              <Flag className="mt-0.5 size-5 shrink-0 fill-rose-500 text-rose-500" />
              <span>
                <span className="block text-sm font-semibold text-rose-600">End Campaign Early</span>
                <span className="text-xs text-muted-foreground">Close campaign and prepare payout.</span>
              </span>
            </button>
          </div>
        </DashboardCard>
      </section>

      <section className="rounded-lg bg-blue-50 px-4 py-4 text-center text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="size-5 text-secondary" />
          <span>
            <span className="font-semibold text-foreground">Your settings are automatically saved as you make changes.</span>
            <span className="block text-xs">Last updated: May 18, 2026 at 2:45 PM</span>
          </span>
        </p>
      </section>
    </div>
  );
}

