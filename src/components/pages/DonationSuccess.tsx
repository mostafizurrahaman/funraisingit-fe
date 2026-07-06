import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  Headphones,
  Heart,
  PartyPopper,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";

import glitter from "../../assets/glitter.png";
import orderImage from "../../assets/order.png";
import roket from "../../assets/roket.png";

interface DonationSuccessProps {
  amount?: number;
}

const donationDetails = [
  { label: "First Name", value: "Jane" },
  { label: "Last Name", value: "Smith" },
  { label: "Message", value: "Proud of sweetheart!" },
  { label: "Email Address", value: "jane@email.com" },
  { label: "Phone Number", value: "+1 (555) 000-0000" },
] as const;

const helpCards = [
  {
    title: "What Happens Next?",
    points: ["Check your email receipt", "Watch for pickup details", "Share Jenna’s campaign with friends"],
    icon: ClipboardCheck,
    iconColor: "bg-secondary",
    panelColor: "bg-[#eefafa]",
  },
  {
    title: "Need Help With Your Purchase?",
    points: ["Seller: Jenna Smith", "Phone: (555) 214-9087", "Email: hello@jennasbananapudding.com"],
    icon: Headphones,
    iconColor: "bg-[#4285f4]",
    panelColor: "bg-[#eef6ff]",
  },
  {
    title: "Want to Support More Dreams?",
    points: ["Discover more inspiring community campaigns", "Help more dreams take off"],
    icon: Users,
    iconColor: "bg-[#9333ea]",
    panelColor: "bg-[#faf2ff]",
  },
] as const;

const DonationSuccess = ({ amount = 20 }: DonationSuccessProps) => {
  return (
    <main className="min-h-screen bg-background pb-10">
      <header className="py-8 sm:py-12">
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
          <Image src={glitter} alt="" className="h-auto w-12 shrink-0 sm:w-40 lg:w-[28%] lg:max-w-[395px]" aria-hidden="true" priority />
          <div className="min-w-0 flex-1 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400 bg-green-50 px-3 py-1 text-[10px] font-medium text-green-600">
              <CheckCircle2 className="size-3" />
              Payment Successful
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground sm:text-4xl">Thank You for Supporting</h1>
            <p className="mt-1 text-2xl font-semibold text-secondary sm:text-4xl">Jenna&apos;s Banana Pudding!</p>
            <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground sm:text-sm">Your order has been confirmed, and Jenna&apos;s campaign is one step closer to reaching her goal.</p>
          </div>
          <Image src={glitter} alt="" className="h-auto w-12 shrink-0 -scale-x-100 sm:w-40 lg:w-[28%] lg:max-w-[395px]" aria-hidden="true" />
        </div>
      </header>

      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-muted-foreground/50 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-3 text-base font-semibold"><Heart className="size-5 fill-secondary text-secondary" />Your Donation Summary</h2>
            <dl className="mt-7 space-y-4">
              {donationDetails.map((detail) => (
                <div key={detail.label} className="flex items-start justify-between gap-5 text-sm">
                  <dt className="font-medium">{detail.label}</dt>
                  <dd className="text-right text-muted-foreground">{detail.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-5 border-t border-border pt-4 text-sm font-semibold">
                <dt>Donation Amount</dt>
                <dd className="text-secondary">${amount}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-muted-foreground/50 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-3 text-base font-semibold"><Heart className="size-5 fill-secondary text-secondary" />You Helped Jenna Get Closer <Heart className="size-4 fill-red-500 text-red-500" /></h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-lg sm:size-32"><Image src={orderImage} alt="Banana pudding campaign" fill className="object-cover" sizes="128px" /></div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Jenna&apos;s Banana Pudding</h3>
                <p className="mt-3 text-xs">Goal: $2,500</p>
                <p className="mt-1 text-sm font-semibold text-secondary">Raised: $680</p>
                <p className="mt-3 text-[10px] font-medium">Progress: 27%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15"><div className="h-full w-[27%] rounded-full bg-secondary" /></div>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-secondary bg-secondary/5 p-4 text-sm text-secondary"><PartyPopper className="mt-0.5 size-5 shrink-0" /><p>Every order helps Jenna turn her banana pudding dream into something bigger!</p></div>
            <button type="button" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"><Share2 className="size-4" />Share Jenna&apos;s Campaign</button>
          </article>
        </div>

        <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-xl border border-primary/60 bg-[#fff8ee] p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-semibold">You Just Supported a Dream...</h2>
            <p className="mt-3 text-xl font-semibold text-primary">Now Yours Could Be Next &#128640;</p>
            <p className="mt-5 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">You just helped Jenna move closer to her goal. Now imagine what your own family, friends, customers, or community could help you build. With FunRaisingIt, you can raise money, sell products, accept donations, and share one simple campaign link&mdash;without needing a website.</p>
            <p className="mt-4 text-xs font-medium sm:text-sm">Whether you&apos;re raising for a team, school, church, event, business idea, or personal goal, we make it simple to get started.</p>
            <Link href="/campaign" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">Start My Own Campaign</Link>
            <p className="mt-3 text-xs text-muted-foreground">Build your campaign free. Launch only when you&apos;re ready.</p>
          </div>
          <Image src={roket} alt="Rocket launching a new dream" className="absolute bottom-0 right-0 h-auto w-40 opacity-35 sm:w-56 sm:opacity-100 lg:right-10 lg:w-64" />
        </section>

        <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {helpCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className={`rounded-xl p-5 ${card.panelColor}`}>
                <div className="flex gap-4">
                  <div className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white ${card.iconColor}`}><Icon className="size-5" /></div>
                  <div><h2 className="text-sm font-semibold">{card.title}</h2><ul className="mt-2 space-y-2">{card.points.map((point) => <li key={point} className="flex gap-2 text-xs leading-4 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-secondary" />{point}</li>)}</ul></div>
                </div>
                {index === 1 && <button type="button" className="mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#4285f4] bg-white text-xs font-semibold text-[#4285f4] transition-all duration-300 hover:bg-[#4285f4] hover:text-white"><Headphones className="size-4" />Contact Seller</button>}
                {index === 2 && <Link href="/campaign" className="mt-5 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#9333ea] bg-white text-xs font-semibold text-[#9333ea] transition-all duration-300 hover:bg-[#9333ea] hover:text-white"><Heart className="size-4" />Browse Campaigns</Link>}
              </article>
            );
          })}
        </section>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground"><ShieldCheck className="size-4 text-secondary" />Platform support is available for technical issues anytime.</p>
      </div>
    </main>
  );
};

export default DonationSuccess;
