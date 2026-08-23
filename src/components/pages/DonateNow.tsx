"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Loader2,
} from "lucide-react";

import orderImage from "../../assets/order.png";
import campaignOwner from "../../assets/user.png";
import { useGetCampaignByIdQuery } from "@/redux/features/campaign/campaignApi";
import { useCreateDonationMutation } from "@/redux/features/donation/donationApi";
import { useGetAccountQuery } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const donationAmounts = [10, 20, 40, 80, 160, 320] as const;

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
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") || "";

  // 1. Fetch specific campaign details
  const { data: campaignResponse, isLoading: isLoadingCampaign } = useGetCampaignByIdQuery(
    campaignId,
    { skip: !campaignId }
  );
  const campaign = campaignResponse?.data;

  // 2. Create Donation Mutation Hook
  const [createDonation, { isLoading: isDonating }] = useCreateDonationMutation();

  const { data: accountResponse } = useGetAccountQuery(undefined, {
    skip: typeof window !== "undefined" && !localStorage.getItem("token")
  });
  const accountInfo = accountResponse?.data;

  const [amount, setAmount] = useState(20);
  const [error, setError] = useState("");

  const campaignDetails = [
    { label: "Campaign Name", value: campaign?.name || "N/A", icon: Package },
    { label: "Category", value: campaign?.campaignCategory || "N/A", icon: Box },
    { label: "Campaign Code", value: campaign?.campaignCode || "N/A", icon: CalendarDays },
    { label: "Delivery Options", value: campaign?.deliveryOptions?.shipping ? "Shipping" : "Standard", icon: Truck },
    { label: "Shipping Fee", value: `$${campaign?.shippingFee || 0}`, icon: ShoppingCart },
  ] as const;

  const handleDonateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!campaignId) {
      setError("Campaign ID not found. Cannot submit donation.");
      return;
    }

    if (accountInfo && accountInfo.status?.toLowerCase() !== "active") {
      const errMsg = "You cannot donate or place orders because your onboarding account status is not active. Please complete verification in Settings.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      campaignId,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      message: formData.get("message") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      amount: Number(amount),
    };

    if (!payload.firstName || !payload.lastName || !payload.email) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await createDonation(payload).unwrap();
      if (response?.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Could not retrieve Stripe checkout session URL.");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || "Failed to initiate donation. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  if (isLoadingCampaign) {
    return (
      <main className="bg-background py-20">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4">
          <Loader2 className="size-10 animate-spin text-secondary" />
          <p className="text-muted-foreground font-medium">Loading campaign details...</p>
        </div>
      </main>
    );
  }

  if (!campaignId || !campaign) {
    return (
      <main className="bg-background py-20">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <Heart className="size-12 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">Campaign Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            Please make sure you selected a valid campaign to donate.
          </p>
          <Link href="/campaign" className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-6 text-sm font-semibold text-white transition-all hover:bg-secondary/90">
            Browse Campaigns
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background py-8 sm:py-12">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <Link href="/campaign" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-secondary">
          <ArrowLeft className="size-4" />
          Back to Campaigns
        </Link>

        <div className="mx-auto mt-6 grid max-w-6xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-xl border border-muted-foreground/60 bg-white p-4 sm:p-5">
            <h1 className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="size-4 text-secondary" />
              Live Preview
            </h1>

            <div className="relative mt-4 aspect-[1.52/1] overflow-hidden rounded-xl bg-slate-100">
              <Image src={campaign.thumbnail || orderImage} alt={campaign.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" unoptimized={!!campaign.thumbnail} />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-100">
                <Image src={campaign.organizer?.profileImage || campaignOwner} alt={campaign.name} fill className="object-cover" sizes="48px" unoptimized={!!campaign.organizer?.profileImage} />
              </div>
              <h2 className="text-lg leading-6 font-semibold truncate max-w-[200px]" title={campaign.name}>{campaign.name}</h2>
            </div>

            <p className="mt-5 text-sm font-semibold text-secondary">Goal: ${campaign.goalAmount?.toLocaleString()}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary/15">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, Math.round(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100))}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-xs font-medium">
              <span>${campaign.raisedAmount?.toLocaleString() || 0} Raised</span>
              <span>Active Campaign</span>
            </div>

            <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/5 text-sm font-semibold text-secondary">
              <Clock3 className="size-4" />
              {campaign.duration || 7} Days Duration
            </div>

            <Link href={`/order-summary?code=${campaign.campaignCode}`} className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">
              <ShoppingCart className="size-4" />
              Buy Products
            </Link>

            <div className="mt-5">
              <h3 className="text-sm font-semibold">About This Campaign</h3>
              <dl className="mt-4 space-y-3">
                {campaignDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="grid grid-cols-[1fr_1.1fr] items-start gap-3 text-xs">
                      <dt className="flex items-center gap-2 text-muted-foreground"><Icon className="size-4 shrink-0" />{detail.label}</dt>
                      <dd className="text-right font-medium truncate" title={String(detail.value)}>{detail.value}</dd>
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
                <p className="whitespace-pre-line">{campaign.story || "No story description provided."}</p>
              </div>
            </section>

            <form className="space-y-5" onSubmit={handleDonateSubmit}>
              <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6 bg-white">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                {error && <p className="mt-3 text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField label="First Name" name="firstName" placeholder="Jane" required />
                  <FormField label="Last Name" name="lastName" placeholder="Smith" required />
                  <div className="sm:col-span-2"><FormField label="Message" name="message" placeholder="Keep up the great work! Happy to support." required /></div>
                  <div className="sm:col-span-2"><FormField label="Email Address" name="email" type="email" placeholder="jane@email.com" required /></div>
                  <div className="sm:col-span-2"><FormField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" /></div>
                </div>
              </section>

              <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6 bg-white">
                <h2 className="text-xl font-semibold">Make a Donation</h2>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {donationAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`h-9 rounded-lg border text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary cursor-pointer ${amount === preset ? "border-secondary bg-secondary text-white" : "border-border bg-white"}`}
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

                <button type="submit" disabled={isDonating} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md cursor-pointer">
                  {isDonating ? <Loader2 className="size-4 animate-spin" /> : <Heart className="size-4 fill-white" />}
                  {isDonating ? "Processing..." : `Donate $${amount}`}
                </button>

                <p className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/5 px-3 py-3 text-center text-xs font-medium text-secondary">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Thank you! Your donation means so much.
                </p>

                <div className="my-6 border-t border-muted-foreground/30" />

                <button type="button" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-muted-foreground/60 text-sm font-semibold transition-all duration-300 hover:border-secondary hover:text-secondary cursor-pointer">
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
