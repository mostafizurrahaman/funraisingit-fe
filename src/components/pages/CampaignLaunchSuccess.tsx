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
} from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

// Assets
import hero from "@/assets/hero.png";
import like from "@/assets/like.png";
import price from "@/assets/price.png";
import user from "@/assets/user.png";
import sparkel from "@/assets/sparkel.png";

// API
import { useGetCampaignPreviewQuery } from "@/redux/features/campaign/campaignApi";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CampaignLaunchSuccessProps {
  campaignId: string;
}

const tips = [
  "Quick Success Tips",
  "Text family and friends first",
  "Post on social media today",
  "Thank every supporter",
  "Post updates throughout your campaign",
] as const;

export default function CampaignLaunchSuccess({ campaignId: initialCampaignId }: CampaignLaunchSuccessProps) {
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

  const { data: previewResponse, isLoading, error } = useGetCampaignPreviewQuery(
    { campaignId: campaignId || "" },
    { skip: !isReady || !campaignId }
  );

  const previewData = previewResponse?.data;
  const campaign = previewData?.campaign;
  const products = previewData?.products || [];
  const firstProduct = products[0] || null;

  const campaignCode = campaign?.campaignCode || "";
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

  if (!isReady || isLoading) {
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

  if (error || !campaign) {
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
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="flex items-center gap-3 text-base">
              <span className="font-semibold text-slate-700">Campaign Status:</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 text-sm">
                <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </p>
            <p className="text-sm font-medium text-slate-600">
              Your campaign is now accepting orders and donations!
            </p>
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
            <div className="relative z-10 mx-auto flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="relative z-10 mt-5 text-[32px] sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground">
              Congratulations!
            </h1>
            <p className="relative z-10 mt-3 text-xl font-bold text-secondary">
              {campaign.name} Is Now Live
            </p>
            <p className="relative z-10 mt-2 text-base text-muted-foreground">
              Your fundraiser is officially accepting orders and donations.
            </p>
          </section>

          {/* Campaign Link Copy Panel */}
          <section className="mt-5 rounded-2xl border border-secondary/40 bg-secondary/5 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col items-center gap-5 sm:flex-row justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
                  <Link2 className="size-6" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Your Campaign Link</p>
                  <p className="mt-1 truncate text-lg font-semibold text-secondary hover:underline cursor-pointer" onClick={() => copyLink("link")}>
                    {campaignUrl.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => copyLink("link")}
                  className="w-full sm:w-44 h-11 bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover shadow-md hover:shadow-lg"
                >
                  <Copy className="size-4 mr-2" />
                  {copied === "link" ? "COPIED!" : "COPY MY LINK"}
                </Button>
                <span className="text-[11px] text-muted-foreground italic mt-1 font-medium">
                  ✨ Share this link anywhere!
                </span>
              </div>
            </div>
          </section>

          {/* Social Share Grid */}
          <section className="mt-10 text-center">
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
                color="text-blue-600"
                onClick={() =>
                  openShare(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`,
                  )
                }
              />
              <ShareButton
                icon={MessageCircle}
                label="Text Message"
                color="text-green-500"
                onClick={() => {
                  window.location.href = `sms:?body=${encodeURIComponent(`Support my campaign "${campaign.name}": ${campaignUrl}`)}`;
                }}
              />
              <ShareButton
                icon={Mail}
                label="Email"
                color="text-red-500"
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent(`Support my campaign: ${campaign.name}`)}&body=${encodeURIComponent(`Hi,\n\nPlease support my fundraiser campaign "${campaign.name}" by ordering or donating here: ${campaignUrl}\n\nThank you!`)}`;
                }}
              />
              <ShareButton
                icon={FaWhatsapp}
                label="WhatsApp"
                color="text-green-600"
                onClick={() =>
                  openShare(
                    `https://wa.me/?text=${encodeURIComponent(`Support my campaign "${campaign.name}": ${campaignUrl}`)}`,
                  )
                }
              />
              <ShareButton
                icon={Copy}
                label={copied === "share" ? "Copied!" : "COPY MY LINK"}
                color="text-primary"
                onClick={() => copyLink("share")}
                highlighted
              />
            </div>
          </section>

          {/* Main Grid Content */}
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-7">
              {/* Campaign Snapshot */}
              <Panel title="Campaign Snapshot" icon={BarChart3}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map(({ icon: Icon, value, label, detail }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center hover:shadow-sm transition-all duration-300"
                    >
                      <Icon className="mx-auto size-7 text-secondary" />
                      <p className="mt-2 text-xl font-bold text-secondary">
                        {value}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-800">{label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* First Supporter Challenge */}
              <Panel title="First Supporter Challenge" icon={Sparkles}>
                <p className="text-sm leading-6 text-muted-foreground">
                  Most successful campaigns receive their first supporters within 24 hours.
                </p>
                <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row justify-start">
                  <div className="flex gap-3">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className="size-10 rounded-full border-2 border-slate-300 bg-slate-50 transition-colors duration-300 hover:border-secondary"
                      />
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-3xl font-extrabold text-secondary">
                      0/5{" "}
                      <span className="inline-block sm:block text-sm font-semibold text-foreground">
                        Supporters
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5 text-sm font-medium text-slate-800">
                  <Trophy className="size-5 text-yellow-500 fill-yellow-100" />
                  <span><strong>Reward:</strong> Unlock your first Campaign Success Badge</span>
                </div>
              </Panel>

              {/* What Would You Like To Do Next */}
              <Panel title="What Would You Like To Do Next" icon={Trophy}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard/campaign")}
                    className="h-auto py-3.5 px-4 bg-primary text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover shadow-sm hover:shadow-md flex flex-col items-center justify-center text-center gap-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 shrink-0" />
                      <span className="text-sm font-bold">Go To Dashboard</span>
                    </div>
                    <span className="text-[11px] font-normal text-white/80 block mt-0.5">
                      View orders, donations, supporters and more
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/campaign/${campaignCode}`)}
                    className="h-auto py-3.5 px-4 border-secondary text-secondary font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-white shadow-sm flex flex-col items-center justify-center text-center gap-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="size-4 shrink-0" />
                      <span className="text-sm font-bold">View My Campaign</span>
                    </div>
                    <span className="text-[11px] font-normal text-muted-foreground block mt-0.5 hover:text-white/85">
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
                    <li key={tip} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
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
                        <Check className="size-3" />
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              {/* Campaign Preview Card */}
              <Panel title="Your Campaign Preview" icon={Heart}>
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    <Image
                      src={campaign.thumbnail || hero}
                      alt="Campaign thumbnail"
                      fill
                      className="object-cover"
                      unoptimized={!!campaign.thumbnail}
                    />
                    <div className="absolute -bottom-2 -left-2 scale-75 origin-bottom-left">
                      <div className="relative size-12 overflow-hidden rounded-full border-2 border-white shadow bg-white">
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
                    <p className="mt-1 text-sm font-semibold text-secondary">
                      Goal: ${goalAmount.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/15">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-2.5 flex justify-between text-xs font-semibold text-slate-600">
                      <span>${raisedAmount.toLocaleString()} Raised</span>
                      <span>0 Supporters</span>
                    </div>
                    <p className="mt-1.5 text-xs font-bold text-secondary">
                      {durationDays} Days Left
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary text-white hover:bg-primary-hover font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    onClick={() => router.push(`/campaign/${campaignCode}`)}
                  >
                    <ShoppingBag className="size-3.5 mr-1.5" />
                    Buy {firstProduct?.name || "Product"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
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
          <section className="relative mt-12 overflow-hidden rounded-2xl bg-secondary/10 px-6 py-8 border border-secondary/20">
            <Image
              src={price}
              alt=""
              className="absolute bottom-0 left-3 hidden h-auto w-32 sm:block opacity-30 xl:opacity-100"
            />
            <Image
              src={like}
              alt=""
              className="absolute bottom-0 right-3 hidden h-auto w-32 sm:block opacity-30 xl:opacity-100"
            />
            <div className="relative z-10 mx-auto max-w-xl text-center">
              <Trophy className="mx-auto size-9 text-yellow-500 fill-yellow-100" />
              <h2 className="mt-3 text-lg sm:text-xl font-bold leading-tight text-secondary">
                Most successful campaigns get their first 5 supporters within the first 24 hours.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
                Share your campaign now and start building momentum.
              </p>
            </div>
          </section>

          {/* Footer security tag */}
          <p className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
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
  color,
  onClick,
  highlighted = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  onClick: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center gap-2.5 rounded-2xl border p-3 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md cursor-pointer ${
        highlighted ? "border-primary bg-orange-50/50 text-primary" : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <Icon className={`size-7 ${color}`} />
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
      className={`rounded-2xl border p-5 sm:p-6 transition-shadow duration-300 bg-white ${
        tone === "orange" ? "border-primary/40 bg-orange-50/20" : "border-slate-200"
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
      className={`flex size-7 items-center justify-center rounded-full border border-secondary font-bold text-secondary text-sm ${className}`}
    >
      $
    </span>
  );
}
