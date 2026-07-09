import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  FileImage,
  Heart,
  Lightbulb,
  LockKeyhole,
  Palette,
  PenTool,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Upload,
  Wand2,
} from "lucide-react";
import shopping from "../../../assets/shopping.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const processSteps = [
  { title: "Tell Us Your Vision", detail: "Complete the form below", icon: PenTool, tone: "violet" },
  { title: "We Design", detail: "Our team creates 2 custom concepts", icon: Palette, tone: "cyan" },
  { title: "You Review", detail: "Receive mockups in 7 business days", icon: FileImage, tone: "orange" },
  { title: "You Approve", detail: "Choose your favorite and build your package", icon: BadgeCheck, tone: "pink" },
] as const;

const productOptions = [
  "Tent",
  "Tablecloth",
  "Staff Shirts",
  "Aprons",
  "Cups",
  "Napkins",
  "Paper Bags",
  "Custom Hat",
  "Yard Signs",
  "Flyers",
  "Stand-Up Banner",
  "Stickers",
  "Product Labels",
  "Small Treat Boxes",
  "Table Cover",
  "Custom Box",
] as const;

const brandStyles = ["Fun & Playful", "Luxury", "Modern", "Elegant", "Family Friendly", "Bold", "Let Designer Decide"] as const;
const budgets = ["Under $500", "$500-$1,000", "$1,000-$2,500", "$2,500+"] as const;
const designBullets = ["2 Custom Brand Concepts", "7 Business Days Turnaround", "Custom Package Quote"] as const;

const howItWorks = [
  { title: "Complete This Form", detail: "Tell us everything about your brand and what you need." },
  { title: "We Create 2 Concepts", detail: "Our designers get to work creating your unique brand concepts." },
  { title: "Receive in 7 Days", detail: "We send mockups of all your requested items." },
  { title: "You Choose & Approve", detail: "Pick your favorite concept and approve your package." },
  { title: "Get Your Quote", detail: "We send a custom quote for your branded package." },
  { title: "We Bring Your Brand to Life!", detail: "Your products are produced and delivered with care." },
] as const;

const uploadCards = [
  { title: "Upload Photos", detail: "Add images that inspire your brand" },
  { title: "Upload Logo", detail: "Upload your current logo if you have one" },
  { title: "Upload Colors", detail: "Share color ideas or palettes you love" },
] as const;

const trustItems = [
  { title: "Your information is safe with us.", detail: "We use secure encryption to protect your data.", icon: ShieldCheck },
  { title: "Used by 1,000+ entrepreneurs", detail: "Building brands they're proud of.", icon: Heart },
  { title: "Love it or we'll fix it.", detail: "Satisfaction guaranteed.", icon: BadgeCheck },
] as const;

const stepToneStyles = {
  violet: "bg-violet-100 text-violet-700",
  cyan: "bg-cyan-100 text-cyan-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
} as const;

export default function BrandBuilder() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <section className="grid items-center gap-6 rounded-lg border border-border bg-white p-4 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-lg bg-secondary/5">
              <Image src={shopping} alt="Jenna's branded product package" className="h-auto w-full object-contain" priority />
            </div>

            <div className="relative">
              <div className="absolute right-0 top-0 hidden size-28 items-center justify-center rounded-full bg-pink-500 text-center text-white shadow-lg sm:flex">
                <div>
                  <p className="text-3xl font-semibold">
                    $39<span className="text-base">.99</span>
                  </p>
                  <p className="text-xs font-semibold uppercase leading-4">
                    One-Time
                    <br />
                    Design Fee
                  </p>
                </div>
              </div>
              <p className="font-serif text-3xl italic text-pink-500">Custom</p>
              <h1 className="mt-1 text-5xl font-semibold leading-none text-blue-700 sm:text-6xl">
                BRAND
                <span className="block text-secondary">BUILDER</span>
              </h1>
              <h2 className="mt-4 text-xl font-semibold">We design it. You shine.</h2>
              <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                Tell us your vision and we&apos;ll create a custom brand that represents your business perfectly.
              </p>
              <div className="mt-5 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                {designBullets.map((bullet) => (
                  <p key={bullet} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 fill-secondary text-white" />
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-3 rounded-lg border border-border bg-white p-3 shadow-sm md:grid-cols-4">
            {processSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="flex items-center gap-3 rounded-md p-2 transition-colors duration-300 hover:bg-secondary/5">
                  <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", stepToneStyles[step.tone])}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <SectionHeader number="1" title="What Products Do You Need?" detail="Select everything you may need for your business." />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {productOptions.map((product, index) => (
                <label key={product} className="flex h-10 cursor-pointer items-center justify-between gap-2 rounded-md border border-border px-3 text-sm transition-all duration-300 hover:border-secondary hover:bg-secondary/5">
                  <span className="flex items-center gap-2">
                    <Boxes className="size-4 text-muted-foreground" />
                    {product}
                  </span>
                  <input type="checkbox" defaultChecked={[0, 1, 2, 3, 4, 5, 7, 12, 13, 14, 15].includes(index)} className="size-4 accent-secondary" />
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr]">
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-secondary/40 px-3 text-sm text-secondary transition-all duration-300 hover:bg-secondary/5">
                <input type="checkbox" defaultChecked className="size-4 accent-secondary" />
                Other
              </label>
              <Input placeholder="Tell us what else you need..." className="h-10 rounded-md border-border text-sm" />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <SectionHeader number="2" title="Tell Us About Your Business" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Business Name *">
                <Input placeholder="Enter your business name" className="h-10 rounded-md border-border text-sm" />
              </Field>
              <Field label="What Do You Sell? *">
                <Input defaultValue="example: Banana Pudding, Lemonade, Jewellery, etc." className="h-10 rounded-md border-border text-sm" />
              </Field>
            </div>
            <Field label="Describe Your Vision *" className="mt-4">
              <Textarea
                defaultValue={'Example: "I own Jenna\'s Banana Pudding. I want a fun but professional look with Tiffany blue and orange colors. I\'d like my tent, shirts, cups, and banner to all match."'}
                className="min-h-28 rounded-md border-border text-sm"
              />
            </Field>
          </section>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <SectionHeader number="3" title="Upload Inspiration" detail="Optional" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {uploadCards.map((card) => (
                <label key={card.title} className="flex cursor-pointer items-center gap-3 rounded-md border border-secondary bg-secondary/10 p-3 text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/15 hover:shadow-sm">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-secondary bg-white">
                    <Upload className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{card.title}</span>
                    <span className="text-xs text-muted-foreground">{card.detail}</span>
                  </span>
                  <input type="file" accept="image/*" className="sr-only" />
                </label>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <OptionCard number="4" title="Brand Style" detail="What style best represents your brand?">
              <div className="mt-3 space-y-2">
                {brandStyles.map((style, index) => (
                  <label key={style} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="brandStyle" defaultChecked={index === 0} className="size-4 accent-secondary" />
                    {style}
                  </label>
                ))}
              </div>
            </OptionCard>

            <OptionCard number="5" title="Package Budget" detail="What is your estimated budget for your branded items?">
              <div className="mt-3 space-y-2">
                {budgets.map((budget, index) => (
                  <label key={budget} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="budget" defaultChecked={index === 0} className="size-4 accent-secondary" />
                    {budget}
                  </label>
                ))}
              </div>
              <p className="mt-4 rounded-md bg-orange-100 p-2 text-xs font-semibold text-primary">This helps us recommend the best options for you.</p>
            </OptionCard>

            <OptionCard number="6" title="Turnaround Time" detail="7 Business Days">
              <div className="mt-3 space-y-2 text-sm">
                {["2 Custom Brand Concepts", "Mockups of requested items", "Recommended product package", "Custom pricing quote"].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 fill-secondary text-white" />
                    {item}
                  </p>
                ))}
              </div>
              <p className="mt-4 rounded-md bg-secondary/10 p-2 text-xs font-semibold text-secondary">Need it sooner? Rush service may be available. Contact our team after checkout.</p>
            </OptionCard>
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section className="overflow-hidden rounded-lg border border-pink-500 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-pink-600 px-4 py-3 text-white">
              <h3 className="text-base font-semibold">Order Summary</h3>
              <ShoppingCart className="size-5" />
            </div>
            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-semibold">Custom Brand Builder</p>
                  <p className="text-xs text-muted-foreground">One-Time Design Fee</p>
                </div>
                <span className="font-semibold">$39.99</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-2xl font-semibold text-pink-600">Total</p>
                <p className="text-2xl font-semibold text-pink-600">$39.99</p>
              </div>
              <SummaryFeature icon={Sparkles} title="One-Time Fee" detail="No hidden fees" />
              <SummaryFeature icon={Wand2} title="100% Custom Made" detail="Designed just for you" />
              <SummaryFeature icon={Star} title="Professional Quality" detail="High-resolution designs" />
              <SummaryFeature icon={ShieldCheck} title="Satisfaction Guaranteed" detail="We'll make it right" />
            </div>
          </section>

          <Button className="h-12 w-full bg-amber-400 text-base font-semibold text-foreground hover:bg-amber-500">How It Works</Button>

          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="space-y-4">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-secondary p-5 text-center text-white">
            <Lightbulb className="mx-auto size-12" />
            <p className="mt-3 text-lg font-semibold">Your brand. Your way</p>
            <p className="text-sm">We make dreams look amazing!</p>
          </section>

          <Button className="h-12 w-full bg-primary text-sm font-semibold hover:bg-primary-hover">
            Start My Brand Project
            <ArrowRight className="size-4" />
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-4" />
            Secure Checkout - One-Time Payment
          </p>
        </aside>
      </section>

      <section className="grid gap-4 pb-3 md:grid-cols-3">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-center gap-3">
              <Icon className="size-7 shrink-0 text-secondary" />
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function SectionHeader({ number, title, detail }: { number: string; title: string; detail?: string }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-secondary text-sm text-white">{number}</span>
        {title}
      </h3>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function OptionCard({ number, title, detail, children }: { number: string; title: string; detail: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <SectionHeader number={number} title={title} />
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      {children}
    </section>
  );
}

function SummaryFeature({ icon: Icon, title, detail }: { icon: ComponentType<{ className?: string }>; title: string; detail: string }) {
  return (
    <div className="flex gap-3">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
