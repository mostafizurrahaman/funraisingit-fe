"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type InputHTMLAttributes } from "react";
import {
  ArrowLeft,
  Box,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Heart,
  LockKeyhole,
  Package,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import orderImage from "../../assets/order.png";
import campaignOwner from "../../assets/user.png";

const donationAmounts = [10, 20, 40, 80, 160, 320] as const;

const campaignDetails = [
  { label: "Campaign Name", value: "Jenna's Banana Pudding", icon: Package },
  { label: "Product", value: "Banana Pudding", icon: Box },
  { label: "Campaign Length", value: "7 Days", icon: CalendarDays },
  { label: "Delivery Options", value: "Pickup, Delivery, Shipping", icon: Truck },
  { label: "Shipping Fee", value: "$8", icon: ShoppingCart },
] as const;

const inputClassName =
  "h-10 w-full rounded-lg border border-muted-foreground/50 bg-white px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/15";

function FormField({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-xs font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
      <input required={required} className={`mt-2 ${inputClassName}`} {...props} />
    </label>
  );
}

const DonateNow = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(20);

  return (
    <main className="bg-background py-8 sm:py-12">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-secondary">
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <div className="mx-auto mt-6 grid max-w-6xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-xl border border-muted-foreground/60 bg-white p-4 sm:p-5">
            <h1 className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="size-4 text-secondary" />
              Live Preview
            </h1>

            <div className="relative mt-4 aspect-[1.52/1] overflow-hidden rounded-xl">
              <Image src={orderImage} alt="Jenna's banana pudding" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                <Image src={campaignOwner} alt="Jenna" fill className="object-cover" sizes="48px" />
              </div>
              <h2 className="text-lg leading-6 font-semibold">Jenna’s<br />Banana Pudding</h2>
            </div>

            <p className="mt-5 text-sm font-semibold text-secondary">Goal: $2,500</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/15">
              <div className="h-full w-[2%] rounded-full bg-secondary" />
            </div>
            <div className="mt-3 flex justify-between text-xs font-medium">
              <span>$0 Raised</span>
              <span>0 Supporters</span>
            </div>

            <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/5 text-sm font-semibold text-secondary">
              <Clock3 className="size-4" />
              7 Days Left
            </div>

            <Link href="/order-summary" className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">
              <ShoppingCart className="size-4" />
              Buy Banana Pudding
            </Link>

            <div className="mt-5">
              <h3 className="text-sm font-semibold">About This Campaign</h3>
              <dl className="mt-4 space-y-3">
                {campaignDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="grid grid-cols-[1fr_1.1fr] items-start gap-3 text-xs">
                      <dt className="flex items-center gap-2 text-muted-foreground"><Icon className="size-4 shrink-0" />{detail.label}</dt>
                      <dd className="text-right font-medium">{detail.value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="mt-5 rounded-lg border border-secondary bg-secondary/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-5 text-secondary" />100% Secure</p>
              <p className="mt-1 text-xs text-muted-foreground">Your information is always safe and protected</p>
            </div>
          </aside>

          <div className="space-y-5">
            <section>
              <h2 className="text-xl font-semibold">Our Story</h2>
              <div className="mt-3 rounded-xl border border-muted-foreground/60 p-4 text-sm leading-6 text-muted-foreground sm:p-5">
                <p>Hi everyone! My name is Jenna and I&apos;m raising money to launch Jenna&apos;s Banana Pudding.</p>
                <p className="mt-3">Your support will help me purchase ingredients, package, and supplies so I can grow my business and bring my homemade desserts to more customers.</p>
                <p className="mt-3">Thank you for believing in me!</p>
              </div>
            </section>

            <form className="space-y-5" onSubmit={(event) => {
                event.preventDefault();
                router.push(`/donation-success?amount=${amount}`);
              }}>
              <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField label="First Name" name="firstName" placeholder="Jane" required />
                  <FormField label="Last Name" name="lastName" placeholder="Smith" required />
                  <div className="sm:col-span-2"><FormField label="Message" name="message" placeholder="Proud of sweetheart!" required /></div>
                  <div className="sm:col-span-2"><FormField label="Email Address" name="email" type="email" placeholder="jane@email.com" required /></div>
                  <div className="sm:col-span-2"><FormField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" required /></div>
                </div>
              </section>

              <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
                <h2 className="text-xl font-semibold">Make a Donate</h2>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {donationAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`h-9 rounded-lg border text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary ${amount === preset ? "border-secondary bg-secondary text-white" : "border-border bg-white"}`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <label className="relative mt-4 block">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium">$</span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(event) => setAmount(Math.max(1, Number(event.target.value)))}
                    aria-label="Donation amount"
                    className="h-12 w-full rounded-lg border border-border bg-white pl-8 pr-4 text-lg font-semibold text-secondary outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </label>

                <button type="submit" className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md">
                  <Heart className="size-4 fill-white" />
                  Donate ${amount}
                </button>

                <p className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/5 px-3 py-3 text-center text-xs font-medium text-secondary">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Thank you! Your donation means so much.
                </p>

                <div className="my-6 border-t border-muted-foreground/30" />

                <button type="button" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-muted-foreground/60 text-sm font-semibold transition-all duration-300 hover:border-secondary hover:text-secondary">
                  <Share2 className="size-4" />
                  Share This Campaign
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
                  <LockKeyhole className="size-3 text-secondary" />
                  100% of funds go directly to the organizer. Secured by Stripe.
                </p>
              </section>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DonateNow;
