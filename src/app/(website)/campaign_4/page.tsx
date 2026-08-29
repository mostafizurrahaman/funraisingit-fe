/* eslint-disable react-hooks/set-state-in-effect */
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
  ClipboardList,
  FileText,
  Target,
  Tag,
  Calendar,
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
import { useGetAccountQuery } from "@/redux/features/auth/authApi";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefundPolicy, setAgreedToRefundPolicy] = useState(false);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localId = localStorage.getItem("campaignId") || "";
      setCampaignId(localId);
      if (localId && draft.id !== localId) {
        updateDraft({ id: localId });
      }
      setIsInitialized(true);
    }
  }, [draft.id, updateDraft]);
  const removeCampaignIdFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("campaignId");
    }
  };

  const previewBody = promoCode ? { promoCode } : {};

  const {
    data: previewResponse,
    isLoading: isPreviewLoading,
    isFetching: isPreviewFetching,
  } = useGetCampaignPreviewQuery({ campaignId }, { skip: !campaignId });
  const [launchCampaign, { isLoading: isLaunching }] =
    useLaunchCampaignMutation();

  const previewData = previewResponse?.data;

  const { data: accountResponse } = useGetAccountQuery(undefined, {
    skip: !token,
  });
  const accountInfo = accountResponse?.data;

  async function handleLaunch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!agreedToTerms || !agreedToRefundPolicy) {
      setError(
        "Please confirm the campaign details, refund policy, and terms before launching.",
      );
      return;
    }

    setError("");

    if (accountInfo) {
      const status = accountInfo.status?.toLowerCase();
      if (status === "restricted") {
        setError(
          "Your onboarding account is restricted. Please complete your verification details in Settings.",
        );
        toast.error(
          "Account Restricted. Please complete verification in settings.",
        );
        return;
      }
      if (
        status === "pending" ||
        !accountInfo.chargesEnabled ||
        !accountInfo.payoutsEnabled
      ) {
        setError(
          "Your onboarding account verification is still pending. You cannot launch campaigns until verification is complete.",
        );
        toast.error(
          "Verification Pending. Please wait for verification to complete.",
        );
        return;
      }
    }

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

      if (accountInfo?.status?.toLowerCase() !== "active") {
        toast.error(
          "Please connect your bank account in Settings to receive payouts for your campaign.",
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("lastLaunchedCampaignId", campaignId);
      }
      resetDraft();
      removeCampaignIdFromLocalStorage();
      router.push(response?.data?.url);
    } catch (err: any) {
      const rawErr = err?.data;
      const errMsg =
        rawErr?.message ||
        (Array.isArray(rawErr?.errors)
          ? rawErr.errors.map((e: any) => e.message).join(", ")
          : "") ||
        (Array.isArray(rawErr?.errorSources)
          ? rawErr.errorSources.map((e: any) => e.message).join(", ")
          : "") ||
        err?.message ||
        "Failed to launch campaign. Please try again.";

      // if (
      //   errMsg === "Before launching campaign setup organization bank account."
      // ) {
      //   toast.error(errMsg);

      //   setTimeout(() => {
      //     router.push("/dashboard/settings");
      //   }, 1500);

      //   return;
      // }

      setError(errMsg);
    }
  }

  if (!isInitialized) {
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

  if (!campaignId) {
    return (
      <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <div className="size-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <Heart className="size-8 text-secondary fill-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Campaign Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find an active campaign session. Please create a
            campaign first to see the preview.
          </p>
          <Link
            href="/dashboard/campaign"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
          >
            See All Drafts Campaigns
          </Link>
        </div>
      </main>
    );
  }

  if (isPreviewLoading || isPreviewFetching) {
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

  const summaryRows = [
    {
      label: "Campaign Name",
      value: previewData?.campaign?.name || draft.name || "My Campaign",
      icon: FileText,
    },
    {
      label: "Goal",
      value: `$${(previewData?.campaign?.goalAmount || draft.goalAmount || 2500).toLocaleString()}`,
      icon: Target,
    },
    {
      label: "Price",
      value: `$${firstProduct?.price || 10} Each`,
      icon: Tag,
    },
    {
      label: "Campaign Length",
      value: `${previewData?.campaign?.durationDays || draft.durationDays || 7} Days`,
      icon: Calendar,
    },
    {
      label: "Delivery Option",
      value: activeDelivery.join(", ") || "None",
      icon: Truck,
    },
    {
      label: "Shipping Fee",
      value:
        (previewData?.campaign?.allowShipping ?? draft.allowShipping)
          ? `$${shippingFeeVal}`
          : "$0",
      icon: DollarSign,
    },
    {
      label: "Donation",
      value: isDonationVal ? "Enabled" : "Disabled",
      icon: Heart,
    },
  ];

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
              <span className="flex items-center gap-3 text-[32px] font-semibold leading-tight text-secondary">
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
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Campaign Summary Card */}
              <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
                  <ClipboardList className="size-5 text-teal-600" />
                  Campaign Summary
                </h3>
                <div className="space-y-4">
                  {summaryRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2.5 text-slate-500 font-medium">
                          <Icon className="size-4 text-teal-600 shrink-0" />
                          <span>{row.label}</span>
                        </div>
                        <span className="font-semibold text-slate-800 text-right max-w-[180px] truncate">
                          {row.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={handleLaunch}
                className="bg-white border-2 border-orange-300 rounded-[28px] p-6 sm:p-8 shadow-xl space-y-6"
              >
                {/* Ready to Launch Header */}
                <div className="text-center">
                  <div className="flex justify-start gap-2 mb-3">
                    <span className="text-4xl">🚀</span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Ready To Launch?
                    </h2>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    Your Campaign has been created and is ready to go live.
                  </p>
                </div>

                {/* Pricing Section */}
                <div className="text-center py-2">
                  <p className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                    One-Time Launch fee
                  </p>
                  <p className="text-5xl font-extrabold text-orange-500 mt-2">
                    $
                    {previewData?.paymentSummary?.payableAmount ||
                      previewData?.campaign?.launchFee ||
                      "18.99"}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    One-time fee -No monthly subscriptions
                  </p>
                </div>

                {/* Example Box */}
                <div className="bg-[#eaf8f7] rounded-2xl p-5 text-sm">
                  <div className="flex items-center gap-2 font-bold text-teal-600 mb-3">
                    <span className="flex size-5 items-center justify-center rounded-full bg-teal-600 text-white text-xs">
                      $
                    </span>
                    <span className="text-base">Example</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    One-time fee -No monthly subscriptions
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-700">
                      <span>Sales</span>
                      <span className="font-semibold">$1,000</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Platform Fee (6%)</span>
                      <span className="font-semibold">-$60</span>
                    </div>
                    <div className="border-t border-teal-200/60 my-2 pt-2 flex justify-between font-bold text-teal-700">
                      <span>You Receive</span>
                      <span>$940</span>
                    </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <span className="text-orange-500 text-xl">🎁</span>
                    What Happens Next?
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {[
                      "Campaign goes live instantly",
                      "Receive orders & donations",
                      "Track supporters",
                      "Download customer spreadsheet",
                      "Get paid after campaign ends",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-[10px]">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Build Today Teal Box */}
                <div className="bg-[#eaf8f7] rounded-2xl p-5 text-center">
                  <h4 className="font-bold text-teal-600 text-base">
                    Build Today. Launch When You’re Ready
                  </h4>
                  <p className="text-xs text-slate-600 mt-2">
                    You only pay when you’re ready to launch.
                  </p>
                </div>

                {/* Promo Code Option */}
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Promo Code (Optional)
                  </label>
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (e.g. WELCOME25)"
                    className="w-full border-slate-300 focus:border-secondary focus:ring-secondary/20 bg-white"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreedToRefundPolicy}
                      onChange={(event) => {
                        setAgreedToRefundPolicy(event.target.checked);
                        setError("");
                      }}
                      className="mt-1 size-4 shrink-0 accent-primary"
                    />
                    <span>
                      I understand all sales are final and campaign launch fees
                      are non-refundable
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(event) => {
                        setAgreedToTerms(event.target.checked);
                        setError("");
                      }}
                      className="mt-1 size-4 shrink-0 accent-primary"
                    />
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/content/terms_and_conditions"
                        className="font-medium text-teal-600 hover:underline"
                      >
                        Terms &amp; Conditions
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Errors */}
                {error ? (
                  <div
                    role="alert"
                    className="text-sm text-red-600 space-y-1.5"
                  >
                    <p>{error}</p>
                    {(error.includes("restricted") ||
                      error.includes("pending") ||
                      error.includes("bank account")) && (
                      <div>
                        <Link
                          href="/dashboard/settings"
                          className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
                        >
                          Verify Now &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isLaunching}
                    className="w-full h-11 bg-primary text-white hover:bg-primary/95 transition-all duration-300"
                  >
                    <Rocket className="size-4 mr-2" />
                    {isLaunching ? "Launching..." : "Launch My Campaign"}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/campaign_3")}
                      className="border-secondary text-secondary h-10 text-xs"
                    >
                      <Edit3 className="size-3.5 mr-1" />
                      Edit Campaign
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/dashboard/campaign")}
                      className="h-10 text-xs"
                    >
                      <ArrowLeft className="size-3.5 mr-1" />
                      All Campaigns
                    </Button>
                  </div>
                </div>
              </form>
            </div>
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
