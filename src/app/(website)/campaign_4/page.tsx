/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  Edit3,
  Gift,
  Heart,
  LockKeyhole,
  PackageCheck,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = ["Your Campaign", "Your Story", "Details", "Preview"] as const;

const readiness = [
  "Campaign name and photo added",
  "Personal story completed",
  "Product and pricing configured",
  "Delivery options selected",
  "Donation preference confirmed",
] as const;

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useCampaignDraft } from "@/Providers/CampaignDraftProvider";
import {
  useGetCampaignPreviewQuery,
  useLaunchCampaignMutation,
} from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

export default function CampaignFourPage() {
  const router = useRouter();
  const token = useSelector(userCurrentToken);

  useEffect(() => {
    const localToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !localToken) {
      toast.error("Please log in first to start a campaign.");
      router.push("/login");
    }
  }, [token, router]);

  const { draft, updateDraft, resetDraft } = useCampaignDraft();
  const [campaignId, setCampaignId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localId = localStorage.getItem("campaignId") || "";
      const finalId = draft.id || localId;
      setCampaignId(finalId);
      if (localId && !draft.id) {
        updateDraft({ id: localId });
      }
    }
  }, [draft.id, updateDraft]);

  const previewBody = promoCode ? { promoCode } : {};

  const { data: previewResponse, isLoading: isPreviewLoading } =
    useGetCampaignPreviewQuery({
  campaignId
});;
  const [launchCampaign, { isLoading: isLaunching }] =
    useLaunchCampaignMutation();

  const previewData = previewResponse?.data;
  console.log("Current Campaign ID in State:", campaignId);
  console.log("previewBody Data:", previewBody);
  console.log("Preview Data:", previewResponse);

  async function handleLaunch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setError(
        "Please confirm the campaign details and agree to the terms before launching.",
      );
      return;
    }
    setError("");
    if (!campaignId) {
      setError("Campaign ID not found. Please start from Step 1.");
      return;
    }

    try {
      const launchBody = promoCode ? { promoCode } : {};
      const response = await launchCampaign({
        campaignId,
        body: launchBody,
      }).unwrap();
      toast.success(response?.message || "Campaign launched successfully!");
      resetDraft();

      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        router.push("/campaign_5");
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || "Failed to launch campaign. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  }

  if (isPreviewLoading && !previewData) {
    return (
      <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          <p className="text-muted-foreground font-medium">
            Loading campaign preview...
          </p>
        </div>
      </main>
    );
  }

  const productsList = previewData?.products || [];
  const firstProduct = productsList[0] || {
    name: draft.productName || "Product",
    price: draft.price || 10,
  };

  const activeDelivery: string[] = [];
  if (previewData?.campaign?.allowLocalPickup ?? draft.allowLocalPickup)
    activeDelivery.push("Pickup");
  if (previewData?.campaign?.allowLocalDelivery ?? draft.allowLocalDelivery)
    activeDelivery.push("Delivery");
  if (previewData?.campaign?.allowShipping ?? draft.allowShipping)
    activeDelivery.push("Shipping");

  const shippingFeeVal =
    previewData?.campaign?.shippingFee ?? draft.shippingFee;
  const isDonationVal =
    previewData?.campaign?.allowDonation ?? draft.allowDonation;

  const summary = [
    [
      "Campaign Name",
      previewData?.campaign?.name || draft.name || "My Campaign",
    ],
    [
      "Goal",
      `$${(previewData?.campaign?.goalAmount || draft.goalAmount || 2500).toLocaleString()}`,
    ],
    ["Price", `$${firstProduct?.price || 10} each`],
    [
      "Campaign Length",
      `${previewData?.campaign?.durationDays || draft.durationDays || 7} days`,
    ],
    ["Delivery Options", activeDelivery.join(", ") || "None"],
    [
      "Shipping Fee",
      (previewData?.campaign?.allowShipping ?? draft.allowShipping)
        ? `$${shippingFeeVal}`
        : "$0",
    ],
    ["Donations", isDonationVal ? "Enabled" : "Disabled"],
  ] as const;

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <ol
          aria-label="Campaign creation progress"
          className="mx-auto flex max-w-3xl items-start"
        >
          {steps.map((step, index) => {
            const complete = index < 3;
            const active = index === 3;
            return (
              <li
                key={step}
                className={`relative flex flex-1 flex-col items-center text-center ${index < steps.length - 1 ? "after:absolute after:left-1/2 after:top-5 after:-z-0 after:h-px after:w-full after:bg-secondary" : ""}`}
              >
                <span
                  className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-base font-semibold ${complete ? "border-secondary bg-secondary text-white" : active ? "border-primary bg-primary text-white" : "border-slate-500 bg-white text-foreground"}`}
                >
                  {complete ? <Check className="size-5" /> : index + 1}
                </span>
                <span
                  className={`relative z-10 mt-3 bg-white px-2 text-sm font-medium sm:text-base ${complete ? "text-secondary" : "text-primary"}`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-14 w-full max-w-6xl lg:mt-20">
          <header>
            <span className="inline-flex bg-secondary/10 px-3 py-1.5 text-base font-medium text-secondary">
              Step 4 of 4
            </span>
            <div className="mt-5 flex items-start gap-5">
              <span className="hidden size-20 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary sm:flex">
                <Rocket className="size-10" />
              </span>
              <div>
                <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-black">
                  Your Campaign is Ready!
                </h1>
                <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
                  Review your campaign below. If everything looks good, launch
                  and start accepting orders and donations.
                </p>
              </div>
            </div>
          </header>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] xl:gap-16">
            <section>
              <h2 className="flex items-center gap-3 text-[32px] font-semibold leading-tight">
                <Sparkles className="size-10 text-secondary" />
                Campaign Preview
              </h2>
              <div className="mx-auto mt-6 max-w-md rounded-[3rem] border-[10px] border-slate-950 bg-white p-2 shadow-2xl">
                <div className="mx-auto mb-2 h-5 w-28 rounded-b-2xl bg-slate-950" />
                <div className="overflow-hidden rounded-[2rem] border border-slate-200">
                  <div className="relative aspect-[1.55/1] w-full overflow-hidden">
                    <Image
                      src={
                        previewData?.campaign?.thumbnail ||
                        draft.thumbnailPreview ||
                        hero
                      }
                      alt={
                        previewData?.campaign?.name ||
                        draft.name ||
                        "Campaign Preview"
                      }
                      fill
                      priority
                      unoptimized={
                        !!(
                          previewData?.campaign?.thumbnail ||
                          draft.thumbnailPreview
                        )
                      }
                      className="object-cover"
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-white shadow">
                        <Heart className="size-5 text-secondary" />
                      </span>
                      <span className="flex size-9 items-center justify-center rounded-full bg-white shadow">
                        <ShoppingCart className="size-5 text-secondary" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={previewData?.image}
                        alt="User avatar"
                        className="size-14 rounded-full object-cover"
                      /> */}
                      <h3 className="text-xl font-semibold leading-6">
                        {previewData?.campaign?.name ||
                          draft.name ||
                          "My Campaign"}
                      </h3>
                    </div>
                    <div className="mt-5 text-lg font-semibold text-secondary">
                      Goal: $
                      {(
                        previewData?.campaign?.goalAmount ||
                        draft.goalAmount ||
                        2500
                      ).toLocaleString()}
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15">
                      <div className="h-full w-[3%] rounded-full bg-secondary" />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>$0 Raised</span>
                      <span>0 Supporters</span>
                      <span className="text-secondary">
                        {previewData?.campaign?.durationDays ||
                          draft.durationDays ||
                          7}{" "}
                        Days Left
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">
                      About This Campaign
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                      {previewData?.campaign?.story ||
                        draft.story ||
                        "No story provided."}
                    </p>
                    {firstProduct && (
                      <div className="mt-5 rounded-lg border border-secondary bg-secondary/10 p-4">
                        <div className="flex items-center gap-3">
                          <Gift className="size-10 text-secondary" />
                          <div>
                            <p className="text-lg font-semibold">
                              What You’ll Receive
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {firstProduct.name} — ${firstProduct.price} Each
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <h3 className="mt-5 text-lg font-semibold">
                      Delivery Options
                    </h3>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      {(previewData?.campaign?.allowLocalPickup ??
                        draft.allowLocalPickup) && (
                        <span className="rounded-md border border-slate-300 p-2">
                          <StoreIcon className="mx-auto mb-1 size-5 text-secondary" />
                          Local Pickup
                        </span>
                      )}
                      {(previewData?.campaign?.allowLocalDelivery ??
                        draft.allowLocalDelivery) && (
                        <span className="rounded-md border border-slate-300 p-2">
                          <Truck className="mx-auto mb-1 size-5 text-secondary" />
                          Local Delivery
                        </span>
                      )}
                      {(previewData?.campaign?.allowShipping ??
                        draft.allowShipping) && (
                        <span className="rounded-md border border-slate-300 p-2">
                          <PackageCheck className="mx-auto mb-1 size-5 text-secondary" />
                          Shipping
                        </span>
                      )}
                    </div>
                    {(previewData?.campaign?.allowShipping ??
                      draft.allowShipping) && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Shipping fee: ${shippingFeeVal}
                      </p>
                    )}
                    <div className="mt-5 space-y-3">
                      <Button type="button" className="w-full">
                        <ShoppingCart className="size-4" />
                        Buy {firstProduct?.name || "Product"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        <Heart className="size-4" />
                        Donate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-center text-sm text-muted-foreground">
                This is exactly how supporters will see your campaign.
              </p>
            </section>

            <form
              onSubmit={handleLaunch}
              className="space-y-6 lg:sticky lg:top-6"
            >
              <Panel title="Campaign Summary" icon={CheckCircle2}>
                <dl className="space-y-3">
                  {summary.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[1fr_1.1fr] gap-3 text-sm"
                    >
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Check className="size-4 text-secondary" />
                        {label}
                      </dt>
                      <dd className="text-right font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>

              <Panel title="Ready To Launch!" icon={Rocket} tone="orange">
                <p className="text-sm leading-6 text-muted-foreground">
                  Your campaign has everything needed and is ready to go live.
                </p>
                <ul className="mt-4 space-y-3">
                  {readiness.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Fees & Payout" icon={DollarSign}>
                <p className="text-sm text-muted-foreground">
                  Here’s how campaign earnings are calculated:
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <FeeRow
                    label="Product Price"
                    value={`$${firstProduct?.price || 10}.00`}
                  />
                  <FeeRow
                    label="Platform Fee (5%)"
                    value={`−$${((firstProduct?.price || 10) * 0.05).toFixed(2)}`}
                  />
                  <FeeRow
                    label="You Receive"
                    value={`$${((firstProduct?.price || 10) * 0.95).toFixed(2)}`}
                    strong
                  />
                </dl>
              </Panel>

              <Panel title="What Happens Next?" icon={Clock3}>
                <ul className="space-y-3">
                  {[
                    "Campaign goes live instantly",
                    "Receive orders and donations",
                    "Track supporters",
                    "Download customer spreadsheet",
                    "Get paid when campaign ends",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Panel>

              <div className="rounded-lg border border-secondary bg-secondary/10 p-5">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-secondary">
                  <ShieldCheck className="size-6" />
                  Build Today. Launch When You’re Ready
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  You only pay when you’re ready to launch.
                </p>
              </div>

              <div className="rounded-lg border border-slate-300 p-4 bg-white">
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Promo Code (Optional)
                </label>
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code (e.g. WELCOME25)"
                  className="w-full border-slate-300 focus:border-secondary focus:ring-secondary/20"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 p-4 text-sm leading-6 transition-colors duration-300 hover:border-secondary">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setError("");
                  }}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span>
                  I’ve reviewed my campaign details and agree to the{" "}
                  <Link
                    href="#"
                    className="font-medium text-secondary hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                  .
                </span>
              </label>
              {error ? (
                <p role="alert" className="text-lg text-red-600">
                  {error}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/campaign_3")}
                  className="border-secondary text-secondary"
                >
                  <Edit3 className="size-4" />
                  Edit Campaign
                </Button>
                <Button type="submit" disabled={isLaunching}>
                  <Rocket className="size-4" />
                  {isLaunching ? "Launching..." : "Launch My Campaign"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/campaign_3")}
                className="w-full"
              >
                <ArrowLeft className="size-4" />
                Back to Details
              </Button>
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <LockKeyhole className="size-4" />
                Your information is secure and protected
              </p>
            </form>
          </div>

          <section className="mt-14 flex flex-col items-center gap-6 rounded-lg bg-secondary/10 p-7 text-center sm:flex-row sm:text-left">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
              <Sparkles className="size-10" />
            </span>
            <div className="flex-1">
              <h2 className="text-[32px] font-semibold leading-tight">
                Need More Time?
              </h2>
              <p className="mt-2 text-lg leading-7 text-muted-foreground">
                Your campaign draft is automatically saved. Launch whenever
                you’re ready.
              </p>
            </div>
            <div className="flex items-center gap-4 text-secondary">
              <Gift className="size-10" />
              <ShieldCheck className="size-10" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Panel({
  title,
  icon: Icon,
  tone = "teal",
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "teal" | "orange";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-lg border p-5 ${tone === "orange" ? "border-primary/60 bg-orange-50/40" : "border-slate-400 bg-white"}`}
    >
      <h2
        className={`mb-4 flex items-center gap-3 text-lg font-semibold ${tone === "orange" ? "text-primary" : "text-foreground"}`}
      >
        <Icon
          className={`size-6 ${tone === "orange" ? "text-primary" : "text-secondary"}`}
        />
        {title}
      </h2>
      {children}
    </section>
  );
}

function FeeRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${strong ? "border-t border-secondary/30 pt-3 font-semibold text-secondary" : ""}`}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StoreIcon({ className }: { className?: string }) {
  return <PackageCheck className={className} />;
}
