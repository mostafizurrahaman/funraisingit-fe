"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Heart,
  Link2,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Users,
  Loader2,
  CarTaxiFront,
} from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

// Assets
import hero from "@/assets/hero.png";
import like from "@/assets/like.png";
import price from "@/assets/price.png";
import user from "@/assets/user.png";
import sparkel from "@/assets/sparkel.png";

// API
import { 
  useGetCampaignPreviewQuery,
  useGetCampaignByIdQuery,
  useGetProductsByCampaignIdQuery,
} from "@/redux/features/campaign/campaignApi";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CampaignLaunchSuccessProps {
  campaignId: string;
  campaignCode?: string;
}

const tips = [
  "Quick Success Tips",
  "Text family and friends first",
  "Post on social media today",
  "Thank every supporter",
  "Post updates throughout your campaign",
] as const;

export default function CampaignLaunchSuccess({ campaignId: initialCampaignId, campaignCode: initialCampaignCode }: CampaignLaunchSuccessProps) {
  const router = useRouter();
  const [copied, setCopied] = useState<"link" | "share" | null>(null);
  const [origin, setOrigin] = useState("");
  const [campaignId, setCampaignId] = useState(initialCampaignId);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      if (!campaignId) {
        const localId = localStorage.getItem("lastLaunchedCampaignId") || localStorage.getItem("campaignId") || "";
        setCampaignId(localId);
      }
    }
    setIsReady(true);
  }, [campaignId]);

  // Query 1: Preview/Draft Query
  const { data: previewResponse, isLoading: isPreviewLoading } = useGetCampaignPreviewQuery(
    { campaignId: campaignId || "" },
    { skip: !isReady || !campaignId }
  );

  // Query 2: Live/Active Campaign Query
  const { data: liveResponse, isLoading: isLiveLoading } = useGetCampaignByIdQuery(
    campaignId,
    { skip: !isReady || !campaignId }
  );

  // Query 3: Products Query
  const { data: productsResponse, isLoading: isProductsLoading } = useGetProductsByCampaignIdQuery(
    campaignId,
    { skip: !isReady || !campaignId }
  );

  const previewData = previewResponse?.data;
  const campaign = previewData?.campaign || liveResponse?.data;
  const products = previewData?.products || productsResponse?.data || [];
  const firstProduct = products[0] || null;

  const campaignCode = campaign?.campaignCode || initialCampaignCode || "";
  const campaignUrl = campaignCode ? `${origin}/campaign/${campaignCode}` : `${origin}/campaign`;

  async function copyLink(type: "link" | "share") {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(type);
      toast.success("Campaign link copied to clipboard!");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Could not copy automatically. Please copy the campaign URL manually.");
    }
  }

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
  }

  const isLoading = !campaign && (isPreviewLoading || isLiveLoading || isProductsLoading || !isReady);

  if (isLoading) {
    return (
      <main className="bg-background px-5 py-20 sm:px-8 lg:px-10">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="size-10 animate-spin text-secondary" />
          <p className="text-muted-foreground font-medium animate-pulse">
            Loading campaign launch details...
          </p>
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="bg-background px-5 py-20 sm:px-8 lg:px-10">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div className="size-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <Heart className="size-8 text-secondary fill-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Campaign Launch Data Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            We couldn't retrieve the details for this campaign. Please check the URL or view your campaigns dashboard.
          </p>
          <Button
            onClick={() => router.push("/dashboard/my-campaigns")}
            className="mt-4 bg-primary text-white hover:bg-primary/90 transition-all duration-300"
          >
            Go to My Campaigns
          </Button>
        </div>
      </main>
    );
  }

  const durationDays = campaign?.durationDays || 7;
  const goalAmount = campaign?.goalAmount || 2500;
  const raisedAmount = campaign?.raisedAmount || 0;
  const progressPercent = Math.min(100, Math.round((raisedAmount / (goalAmount || 1)) * 100));

  const stats = [
    {
      icon: DollarIcon,
      value: `$${(raisedAmount).toFixed(2)}`,
      label: "Current Earnings",
      detail: "Total you’ll receive",
    },
    { icon: Users, value: "0", label: "Supporters", detail: "People" },
    { icon: ShoppingBag, value: "0", label: "Orders", detail: "Total Orders" },
    { icon: Clock3, value: String(durationDays), label: "Days Left", detail: "Days Remaining" },
  ] as const;

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12 font-sans">
      <div className="container mx-auto">
        <div className="mx-auto w-full max-w-6xl">
          {/* Top Status Pill Banner */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-[#f0faf9] px-6 py-3 text-center text-sm font-medium text-slate-700">
            <span className="font-semibold text-slate-600">Campaign Status:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d1fae5] px-3.5 py-0.5 font-bold text-[#065f46] text-xs">
              <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-600">Your campaign is now accepting orders and donations!</span>
          </div>

          {/* Congratulations Hero Banner with Confetti */}
          <section className="relative mt-8 overflow-hidden py-10 text-center">
            <Image
              src={sparkel}
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
              aria-hidden="true"
              priority
            />
            <div className="relative z-10 mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-white shadow-sm">
              <Check className="size-6 stroke-[3]" />
            </div>
            <h1 className="relative z-10 mt-5 text-[32px] sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground">
              Congratulations!
            </h1>
            <p className="relative z-10 mt-3 text-2xl font-extrabold text-secondary">
              {campaign.name} Is Now Live
            </p>
            <p className="relative z-10 mt-2 text-base text-muted-foreground font-medium">
              Your fundraiser is officially accepting orders and donations.
            </p>
          </section>

          {/* Campaign Link Copy Panel */}
          <section className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/5 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col items-center gap-5 sm:flex-row justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
                  <Link2 className="size-5" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Campaign Link</p>
                  <p className="mt-1 truncate text-lg font-bold text-secondary hover:underline cursor-pointer" onClick={() => copyLink("link")}>
                    {campaignUrl.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col items-center pb-6 sm:pb-0 shrink-0 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => copyLink("link")}
                  className="w-full sm:w-44 h-11 bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <Copy className="size-4 mr-2" />
                  {copied === "link" ? "COPIED!" : "COPY MY LINK"}
                </Button>
                <div className="absolute top-[48px] flex items-center gap-1.5 text-xs text-muted-foreground italic font-medium whitespace-nowrap">
                  <svg className="w-4 h-3 text-[#00aaa6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"></path>
                  </svg>
                  <span>Share this link anywhere!</span>
                </div>
              </div>
            </div>
          </section>

          {/* Social Share Grid */}
          <section className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Share Your Campaign
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The faster you share, the faster you’ll start receiving orders.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              <ShareButton
                icon={FaFacebookF}
                label="Facebook"
                iconBg="bg-blue-50 text-blue-600"
                onClick={() =>
                  openShare(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`,
                  )
                }
              />
              <ShareButton
                icon={MessageCircle}
                label="Text Message"
                iconBg="bg-green-50 text-green-500"
                onClick={() => {
                  window.location.href = `sms:?body=${encodeURIComponent(`Support my campaign "${campaign.name}": ${campaignUrl}`)}`;
                }}
              />
              <ShareButton
                icon={Mail}
                label="Email"
                iconBg="bg-red-50 text-red-500"
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent(`Support my campaign: ${campaign.name}`)}&body=${encodeURIComponent(`Hi,\n\nPlease support my fundraiser campaign "${campaign.name}" by ordering or donating here: ${campaignUrl}\n\nThank you!`)}`;
                }}
              />
              <ShareButton
                icon={FaWhatsapp}
                label="WhatsApp"
                iconBg="bg-emerald-50 text-emerald-600"
                onClick={() =>
                  openShare(
                    `https://wa.me/?text=${encodeURIComponent(`Support my campaign "${campaign.name}": ${campaignUrl}`)}`,
                  )
                }
              />
              <ShareButton
                icon={Copy}
                label={copied === "share" ? "Copied!" : "COPY MY LINK"}
                iconBg="bg-orange-50 text-primary"
                onClick={() => copyLink("share")}
                highlighted
              />
            </div>
          </section>

          {/* Main Grid Content */}
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-7">
              {/* Campaign Snapshot */}
              <Panel title="Campaign Snapshot" icon={BarChart3}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map(({ icon: Icon, value, label, detail }, index) => {
                    const isEarnings = index === 0;
                    return (
                      <div
                        key={label}
                        className={`rounded-2xl border p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-sm ${
                          isEarnings
                            ? "bg-[#e6f7f6] border-secondary/30"
                            : "bg-slate-50/50 border-slate-200"
                        }`}
                      >
                        <div className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-full ${isEarnings ? "bg-secondary/10" : "bg-slate-100"}`}>
                          <Icon className="size-5 text-secondary" />
                        </div>
                        <p className={`text-xl font-extrabold ${isEarnings ? "text-secondary" : "text-slate-800"}`}>
                          {value}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">{label}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground font-medium">
                          {detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              {/* First Supporter Challenge */}
              <Panel title="First Supporter Challenge" icon={Sparkles}>
                <p className="text-sm leading-6 text-muted-foreground font-medium">
                  Most successful campaigns receive their first supporters within 24 hours.
                </p>
                <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row justify-start">
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className="size-10 rounded-full border-2 border-slate-200 bg-slate-50 transition-colors duration-300 hover:border-secondary"
                      />
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-3xl font-extrabold text-secondary">
                      0/5{" "}
                      <span className="inline-block sm:block text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Supporters
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <Trophy className="size-5 text-yellow-500 fill-yellow-100 shrink-0" />
                  <span>Reward: <span className="text-slate-500 font-normal">Unlock your first Campaign Success Badge</span></span>
                </div>
              </Panel>

              {/* What Would You Like To Do Next */}
              <Panel title="What Would You Like To Do Next" icon={Trophy}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard/campaign")}
                    className="h-auto py-3.5 px-4 bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-md active:scale-[0.98] flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 shrink-0" />
                      <span className="text-sm font-extrabold">Go To Dashboard</span>
                    </div>
                    <span className="text-[11px] font-medium text-white/80 block mt-0.5">
                      View orders, donations, supporters and more
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/campaign/${campaignCode}`)}
                    className="h-auto py-3.5 px-4 border-secondary text-secondary font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:shadow-md active:scale-[0.98] flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="size-4 shrink-0" />
                      <span className="text-sm font-extrabold">View My Campaign</span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground block mt-0.5 group-hover:text-white/85">
                      See how your campaign looks to supporters
                    </span>
                  </Button>
                </div>
              </Panel>
            </div>

            {/* Sidebar Details */}
            <aside className="space-y-7 lg:sticky lg:top-6">
              {/* Quick Success Tips */}
              <Panel title="Quick Success Tips" icon={Star} tone="orange">
                <ul className="space-y-3.5">
                  {tips.map((tip, index) => (
                    <li key={tip} className="flex items-start gap-3 text-sm text-slate-700 font-semibold">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white text-[10px] ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-green-500"
                            : index === 2
                            ? "bg-pink-500"
                            : index === 3
                            ? "bg-primary"
                            : "bg-purple-500"
                        }`}
                      >
                        <Check className="size-3 stroke-[3]" />
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              {/* Campaign Preview Card */}
              <Panel title="Your Campaign Preview" icon={Heart}>
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
                    <Image
                      src={campaign.thumbnail || hero}
                      alt="Campaign thumbnail"
                      fill
                      className="object-cover"
                      unoptimized={!!campaign.thumbnail}
                    />
                    <div className="absolute -bottom-1 -left-1 scale-75 origin-bottom-left">
                      <div className="relative size-10 overflow-hidden rounded-full border-2 border-white shadow bg-white">
                        <Image
                          src={user}
                          alt="Organizer Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate" title={campaign.name}>
                      {campaign.name}
                    </h3>
                    <p className="mt-1 text-sm font-extrabold text-secondary">
                      Goal: ${goalAmount.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/15">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-bold text-slate-500">
                      <span>${raisedAmount.toLocaleString()} Raised</span>
                      <span>0 Supporters</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-secondary">
                      {durationDays} Days Left
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary text-white hover:bg-primary-hover font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    onClick={() => router.push(`/campaign/${campaignCode}`)}
                  >
                    <ShoppingBag className="size-3.5 mr-1.5" />
                   <CarTaxiFront></CarTaxiFront> Buy 
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white font-bold rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    onClick={() => router.push(`/campaign/${campaignCode}`)}
                  >
                    <Heart className="size-3.5 mr-1.5 fill-current" />
                    Donate
                  </Button>
                </div>
              </Panel>
            </aside>
          </div>

          {/* Bottom Callout Banner */}
          <section className="relative mt-12 overflow-hidden rounded-2xl bg-secondary/10 px-6 py-8 border border-secondary/20 text-center">
            <Image
              src={price}
              alt=""
              className="absolute bottom-0 left-3 hidden h-auto w-32 sm:block opacity-20 xl:opacity-100"
            />
            <Image
              src={like}
              alt=""
              className="absolute bottom-0 right-3 hidden h-auto w-32 sm:block opacity-20 xl:opacity-100"
            />
            <div className="relative z-10 mx-auto max-w-xl">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-3 shadow-sm">
                <Trophy className="size-6 fill-current" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold leading-tight text-secondary">
                Most successful campaigns get their first 5 supporters within the first 24 hours.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-bold">
                Share your campaign now and start building momentum.
              </p>
            </div>
          </section>

          {/* Footer security tag */}
          <p className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <LockKeyhole className="size-3.5 text-secondary" />
            Your campaign is live and secure.
          </p>
        </div>
      </div>
    </main>
  );
}

function ShareButton({
  icon: Icon,
  label,
  iconBg,
  onClick,
  highlighted = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconBg: string;
  onClick: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center gap-2.5 rounded-2xl border p-4 text-xs font-extrabold transition-all duration-300 hover:scale-[1.05] hover:border-secondary hover:shadow-md cursor-pointer ${
        highlighted ? "border-primary bg-orange-50/50 text-primary" : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className={`flex size-10 items-center justify-center rounded-full ${iconBg} shadow-sm`}>
        <Icon className="size-5" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function Panel({
  title,
  icon: Icon,
  tone = "default",
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "orange";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
        tone === "orange" ? "border-primary/20 bg-[#fffcf9]" : "border-slate-200"
      }`}
    >
      <h2 className="mb-4 flex items-center gap-2.5 text-base sm:text-lg font-bold text-slate-800">
        <Icon
          className={`size-6 ${tone === "orange" ? "text-primary" : "text-secondary"}`}
        />
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <span
      className={`font-extrabold text-secondary text-base ${className}`}
    >
      $
    </span>
  );
}
