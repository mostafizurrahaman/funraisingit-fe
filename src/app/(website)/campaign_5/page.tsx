"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  PartyPopper,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import hero from "@/assets/hero.png";
import like from "@/assets/like.png";
import price from "@/assets/price.png";
import user from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import sparkel from "@/assets/sparkel.png";
const campaignUrl = "https://funraisingit.com/jennas-banana-pudding";

const stats = [
  { icon: DollarIcon, value: "$0.00", label: "Current Earnings", detail: "Total you’ll receive" },
  { icon: Users, value: "0", label: "Supporters", detail: "People" },
  { icon: ShoppingBag, value: "0", label: "Orders", detail: "Total Orders" },
  { icon: Clock3, value: "7", label: "Days Left", detail: "Days Remaining" },
] as const;

const tips = ["Quickly Success Tip", "Text family and friends first", "Post on social media today", "Thank every supporter", "Post updates throughout your campaign"] as const;

export default function CampaignFivePage() {
  const router = useRouter();
  const [copied, setCopied] = useState<"link" | "share" | null>(null);
  const [copyError, setCopyError] = useState("");

  async function copyLink(type: "link" | "share") {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(type);
      setCopyError("");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopyError("Could not copy automatically. Please copy the campaign URL manually.");
    }
  }

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
  }

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-3 rounded-lg bg-slate-50 px-5 py-4 text-center sm:flex-row sm:text-left">
            <p className="flex items-center gap-3 text-lg"><PartyPopper className="size-6 text-primary" /><span>Campaign Status:</span><span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700"><span className="size-2 rounded-full bg-green-500" />Live</span></p>
            <p className="text-lg font-medium">Your campaign is now accepting orders and donations!</p>
          </div>

          <section className="relative mt-8 overflow-hidden py-8 text-center">
            <Image src={sparkel} alt="" fill sizes="100vw" className="pointer-events-none absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
            <div className="relative z-10 mx-auto flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><CheckCircle2 className="size-10" /></div>
            <h1 className="relative z-10 mt-5 text-[32px] font-semibold leading-tight tracking-tight text-black">🎉 Congratulations!</h1>
            <p className="relative z-10 mt-3 text-lg font-semibold text-secondary">Jenna’s Banana Pudding Is Now Live!</p>
            <p className="relative z-10 mt-2 text-lg leading-7 text-muted-foreground">Your fundraiser is officially accepting orders and donations.</p>
          </section>

          <section className="mt-5 rounded-lg border border-secondary bg-secondary/10 p-5 sm:p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white text-secondary"><Link2 className="size-10" /></span>
              <div className="min-w-0 flex-1 text-center sm:text-left"><p className="text-lg font-semibold">Your Campaign Link:</p><p className="mt-1 truncate text-lg font-medium text-secondary">funraisingit.com/jennas-banana-pudding</p></div>
              <Button type="button" onClick={() => copyLink("link")} className="min-w-40"><Copy className="size-4" />{copied === "link" ? "Copied!" : "Copy My Link"}</Button>
            </div>
            {copyError ? <p role="alert" className="mt-3 text-center text-lg text-red-600">{copyError}</p> : null}
          </section>

          <section className="mt-10 text-center">
            <h2 className="text-[32px] font-semibold leading-tight">Share Your Campaign</h2><p className="mt-2 text-lg leading-7 text-muted-foreground">The faster you share, the faster you’ll start receiving orders.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
              <ShareButton icon={FaFacebookF} label="Facebook" color="text-blue-600" onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`)} />
              <ShareButton icon={MessageCircle} label="Text Message" color="text-green-500" onClick={() => { window.location.href = `sms:?body=${encodeURIComponent(`Support Jenna’s Banana Pudding: ${campaignUrl}`)}`; }} />
              <ShareButton icon={Mail} label="Email" color="text-red-500" onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent("Support Jenna’s Banana Pudding")}&body=${encodeURIComponent(campaignUrl)}`; }} />
              <ShareButton icon={FaWhatsapp} label="WhatsApp" color="text-green-600" onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`Support Jenna’s Banana Pudding: ${campaignUrl}`)}`)} />
              <ShareButton icon={Copy} label={copied === "share" ? "Copied!" : "Copy My Link"} color="text-primary" onClick={() => copyLink("share")} highlighted />
            </div>
          </section>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-7">
              <Panel title="Campaign Snapshot" icon={BarChart3}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(({ icon: Icon, value, label, detail }) => <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center"><Icon className="mx-auto size-7 text-secondary" /><p className="mt-2 text-lg font-semibold text-secondary">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}</div>
              </Panel>

              <Panel title="First Supporter Challenge" icon={Sparkles}>
                <p className="text-lg leading-7 text-muted-foreground">Most successful campaigns receive their first supporters within 24 hours.</p><div className="mt-6 flex flex-col items-center gap-5 sm:flex-row"><div className="flex gap-3">{Array.from({ length: 5 }, (_, index) => <span key={index} className="size-10 rounded-full border-2 border-slate-400" />)}</div><p className="text-[32px] font-semibold text-secondary">0/5 <span className="block text-sm font-normal text-foreground">Supporters</span></p></div><p className="mt-5 flex items-center gap-2 text-lg"><Trophy className="size-6 text-yellow-500" /><strong>Reward:</strong> Unlock your First Campaign Success Badge</p>
              </Panel>

              <Panel title="What Would You Like To Do Next" icon={PartyPopper}>
                <div className="grid gap-4 sm:grid-cols-2"><Button type="button" onClick={() => router.push("/home")} className="h-auto min-h-14"><BarChart3 className="size-5" /><span>Go To Dashboard<small className="block font-normal">View orders, donations, supporters and more</small></span></Button><Button type="button" variant="outline" onClick={() => router.push("/campaign")} className="h-auto min-h-14 border-secondary text-secondary"><ExternalLink className="size-5" /><span>View My Campaign<small className="block font-normal text-muted-foreground">See how your campaign looks to supporters</small></span></Button></div>
              </Panel>
            </div>

            <aside className="space-y-7 lg:sticky lg:top-6">
              <Panel title="Quick Success Tips" icon={Star} tone="orange"><ul className="space-y-3">{tips.map((tip, index) => <li key={tip} className="flex items-start gap-3 text-lg"><span className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full text-white ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : index === 2 ? "bg-pink-500" : index === 3 ? "bg-primary" : "bg-purple-500"}`}><Check className="size-3" /></span>{tip}</li>)}</ul></Panel>

              <Panel title="Your Campaign Preview" icon={Heart}>
                <div className="flex gap-4"><Image src={hero} alt="Banana pudding campaign" className="size-28 rounded-lg object-cover object-right" /><div className="min-w-0"><div className="flex items-center gap-2"><Image src={user} alt="Jenna" className="size-9 rounded-full object-cover" /><p className="font-semibold">Jenna’s Banana Pudding</p></div><p className="mt-3 text-sm font-semibold text-secondary">Goal: $2,500</p><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary/15"><div className="h-full w-[3%] bg-secondary" /></div><div className="mt-2 flex justify-between text-xs"><span>$80 Raised</span><span>0 Supporters</span></div><p className="mt-2 text-xs text-secondary">7 Days Left</p></div></div><div className="mt-4 grid grid-cols-2 gap-3"><Button type="button" size="sm"><ShoppingBag className="size-4" />Buy</Button><Button type="button" size="sm" variant="outline"><Heart className="size-4" />Donate</Button></div>
              </Panel>
            </aside>
          </div>

          <section className="relative mt-12 overflow-hidden rounded-lg bg-secondary/10 p-7 sm:p-9">
            <Image src={price} alt="Campaign success reward" className="absolute bottom-0 left-3 hidden h-auto w-36 sm:block" /><Image src={like} alt="Supporter appreciation" className="absolute bottom-0 right-3 hidden h-auto w-36 sm:block" />
            <div className="relative z-10 mx-auto max-w-2xl text-center"><Trophy className="mx-auto size-10 text-yellow-500" /><h2 className="mt-3 text-[32px] font-semibold leading-tight text-secondary">Most successful campaigns get their first 5 supporters within the first 24 hours.</h2><p className="mt-3 text-lg leading-7 text-muted-foreground">Share your campaign now and start building momentum.</p></div>
          </section>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4" />Your campaign is live and secure.</p>
        </div>
      </div>
    </main>
  );
}

function ShareButton({ icon: Icon, label, color, onClick, highlighted = false }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string; onClick: () => void; highlighted?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border bg-white p-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-md ${highlighted ? "border-primary bg-orange-50" : "border-slate-300"}`}><Icon className={`size-8 ${color}`} />{label}</button>;
}

function Panel({ title, icon: Icon, tone = "default", children }: { title: string; icon: React.ComponentType<{ className?: string }>; tone?: "default" | "orange"; children: React.ReactNode }) {
  return <section className={`rounded-lg border p-5 sm:p-6 ${tone === "orange" ? "border-primary/70 bg-orange-50/40" : "border-slate-300 bg-white"}`}><h2 className="mb-5 flex items-center gap-3 text-[32px] font-semibold leading-tight"><Icon className={`size-10 ${tone === "orange" ? "text-primary" : "text-secondary"}`} />{title}</h2>{children}</section>;
}

function DollarIcon({ className }: { className?: string }) {
  return <span className={`flex items-center justify-center rounded-full border border-secondary font-semibold ${className}`}>$</span>;
}
