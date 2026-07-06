import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  Gift,
  Headphones,
  Heart,
  Mail,
  MapPin,
  PartyPopper,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

import glitter from "../../assets/glitter.png";
import orderImage from "../../assets/order.png";
import roket from "../../assets/roket.png";

const orderDetails = [
  { label: "You purchased", value: "3 Banana Puddings", icon: Gift, color: "text-primary" },
  { label: "Price", value: "$10 each", icon: DollarSign, color: "text-primary" },
  { label: "Total", value: "$30.00", icon: DollarSign, color: "text-secondary" },
  { label: "Delivery", value: "Local Pickup", icon: MapPin, color: "text-[#8b5cf6]" },
  { label: "Receipt", value: "Sent to your email", icon: Mail, color: "text-primary" },
] as const;

const helpCards = [
  {
    title: "What Happens Next?",
    description: "Check your email receipt, watch for pickup details, and share Jenna's campaign with friends.",
    action: "View Order Details",
    icon: ClipboardCheck,
    colors: "bg-[#eefafa] text-secondary border-secondary",
  },
  {
    title: "Need Help With Your Purchase?",
    description: "We're here for you! If you have any questions about your order or need support, our team is happy to help.",
    action: "Contact Support",
    icon: Headphones,
    colors: "bg-[#eef6ff] text-[#4285f4] border-[#4285f4]",
  },
  {
    title: "Want to Support More Dreams?",
    description: "Discover more inspiring community campaigns and help more dreams take off.",
    action: "Browse Campaigns",
    icon: Users,
    colors: "bg-[#faf2ff] text-[#9333ea] border-[#9333ea]",
  },
] as const;

const OrderSuccess = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-background pb-8 sm:pb-12">
      <header className="py-8 sm:py-12">
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
          <Image
            src={glitter}
            alt=""
            className="h-auto w-12 sm:w-40 lg:w-[28%] lg:max-w-98.75"
            aria-hidden="true"
            priority
          />

          <div className="min-w-0 flex-1 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400 bg-green-50 px-3 py-1 text-[10px] font-medium text-green-600">
              <CheckCircle2 className="size-3" />
              Payment Successful
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground sm:text-4xl">
              Thank You for Supporting
            </h1>
            <p className="mt-1 text-2xl font-semibold text-secondary sm:text-4xl">
              Jenna&apos;s Banana Pudding!
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Your order has been confirmed, and Jenna&apos;s campaign is one step closer to reaching her goal.
            </p>
          </div>

          <Image
            src={glitter}
            alt=""
            className="h-auto w-12 shrink-0 -scale-x-100 sm:w-40 lg:w-[28%] lg:max-w-[395px]"
            aria-hidden="true"
          />
        </div>
      </header>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-muted-foreground/50 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-3 text-base font-semibold">
                <ShoppingBag className="size-5 text-secondary" />
                Your Order Summary
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-[1.15fr_1fr]">
                <div className="relative aspect-[1.45/1] overflow-hidden rounded-lg">
                  <Image src={orderImage} alt="Jenna's banana pudding order" fill className="object-cover" sizes="(max-width: 640px) 100vw, 260px" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="mt-1 text-xl font-semibold text-secondary">#FR10284</p>
                </div>
              </div>
              <dl className="mt-5 space-y-3">
                {orderDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Icon className={`size-4 shrink-0 ${detail.color}`} />
                      <dt className="font-medium">{detail.label}</dt>
                      <dd className="ml-auto text-right font-semibold text-foreground">{detail.value}</dd>
                    </div>
                  );
                })}
              </dl>
              <div className="mt-6 grid gap-3">
                <Link href="/order-summary" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">
                  <ShoppingBag className="size-4" />
                  View My Order
                </Link>
                <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white">
                  <Share2 className="size-4" />
                  Share Jenna&apos;s Campaign
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-muted-foreground/50 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-3 text-base font-semibold">
                <Heart className="size-5 fill-secondary text-secondary" />
                You Helped Jenna Get Closer
                <Heart className="size-4 fill-red-500 text-red-500" />
              </h2>
              <div className="mt-5 flex items-center gap-4">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg sm:size-28">
                  <Image src={orderImage} alt="Banana pudding campaign" fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Jenna&apos;s Banana Pudding</h3>
                  <p className="mt-3 text-xs">Goal: $2,500</p>
                  <p className="mt-1 text-sm font-semibold text-secondary">Raised: $680</p>
                  <p className="mt-3 text-[10px] font-medium">Progress: 27%</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15">
                    <div className="h-full w-[27%] rounded-full bg-secondary" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-secondary bg-secondary/5 p-4 text-sm text-secondary">
                <PartyPopper className="mt-0.5 size-5 shrink-0" />
                <p>Every order helps Jenna turn her banana pudding dream into something bigger!</p>
              </div>
              <button type="button" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white">
                <Share2 className="size-4" />
                Share Jenna&apos;s Campaign
              </button>
            </article>
          </div>

          <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-xl border border-primary/60 bg-[#fff8ee] p-6 sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl font-semibold">You Just Supported a Dream...</h2>
              <p className="mt-3 text-xl font-semibold text-primary">Now Yours Could Be Yours &#128640;</p>
              <p className="mt-5 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
                You just helped Jenna move closer to her goal. Now imagine what your own family, friends, customers, or community could help you build. With FunRaisingIt, you can raise money, sell products, accept donations, and share one simple campaign link&mdash;without needing a website.
              </p>
              <p className="mt-4 text-xs font-medium sm:text-sm">Whether you&apos;re raising for a team, school, event, business idea, or personal goal, we make it simple to get started.</p>
              <Link href="/campaign" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">
                Start My Own Campaign
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">Build your campaign free. Launch only when you&apos;re ready.</p>
            </div>
            <Image src={roket} alt="Rocket launching a new dream" className="absolute bottom-0 right-0 h-auto w-40 opacity-35 sm:w-56 sm:opacity-100 lg:right-10 lg:w-64" />
          </section>

          <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {helpCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className={`rounded-xl p-5 ${card.colors.split(" ")[0]}`}>
                  <div className="flex gap-4">
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white ${card.colors.includes("#4285f4") ? "bg-[#4285f4]" : card.colors.includes("#9333ea") ? "bg-[#9333ea]" : "bg-secondary"}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">{card.title}</h2>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                  <button type="button" className={`mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-lg border bg-white text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${card.colors.split(" ").slice(1).join(" ")}`}>
                    {card.action}
                  </button>
                </article>
              );
            })}
          </section>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            Your information is secure and protected.
          </p>
      </div>
    </main>
  );
};

export default OrderSuccess;
