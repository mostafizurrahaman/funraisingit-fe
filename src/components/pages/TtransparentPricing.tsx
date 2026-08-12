"use client";

import { Wallet, Rocket, Paintbrush, Check, Star, Info, Loader2 } from "lucide-react";
import { useGetSiteInfoQuery } from "@/redux/features/settingsManagement/settingsManagementApi";

const TtransparentPricing = () => {
  const { data: siteInfoResponse, isLoading } = useGetSiteInfoQuery(undefined);

  const siteInfo = siteInfoResponse?.data || {};

  const platformFeeVal = siteInfo.platformFee !== undefined ? siteInfo.platformFee : 6;
  const launchFeeVal = siteInfo.campaignLaunchFee !== undefined ? siteInfo.campaignLaunchFee : 18.99;
  const brandBuilderPricingVal = siteInfo.brandBuilderPricing !== undefined ? siteInfo.brandBuilderPricing : 39.99;

  if (isLoading) {
    return (
      <section className="bg-[#FAFDFD]/30 py-14 sm:py-20 lg:py-24">
        <div className="container mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="size-8 animate-spin text-[#008080]" />
          <p className="mt-2 text-sm text-muted-foreground">Loading pricing details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10 max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A]">
            Simple fees. Transparent always.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
            We believe in clarity. Here&apos;s how our pricing works.<br />
            No monthly fees. Pay only what you need.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-3 md:items-stretch">
          
          {/* Card 1: Platform Fee */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F3F3]">
                <Wallet className="h-7 w-7 text-[#008080]" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#008080] text-[10px] font-bold text-white">
                  %
                </span>
              </div>
              
              <h3 className="mt-6 text-lg font-semibold text-[#008080]">
                Platform Fee
              </h3>
              
              <p className="mt-3 text-4xl sm:text-5xl font-bold text-[#0F172A]">
                {platformFeeVal}%
              </p>
              
              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                We take a {platformFeeVal}% platform fee from every order and donation.
              </p>
            </div>
            
            {/* Footer box */}
            <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-[#E6F3F3]/50 p-4 text-left">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#008080] text-white">
                <Check className="h-3 w-3" />
              </div>
              <p className="text-xs font-medium text-slate-700 leading-snug">
                This fee helps us provide a secure platform and great support.
              </p>
            </div>
          </div>

          {/* Card 2: Campaign Launch */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3EB]">
                <Rocket className="h-7 w-7 text-[#F97316]" />
              </div>
              
              <h3 className="mt-6 text-lg font-semibold text-[#F97316]">
                Campaign Launch
              </h3>
              
              <p className="mt-3 text-4xl sm:text-5xl font-bold text-[#0F172A]">
                ${launchFeeVal}
              </p>
              
              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                A one-time ${launchFeeVal} fee is required to launch a campaign.
              </p>
            </div>
            
            {/* Footer box */}
            <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-[#FFF3EB]/50 p-4 text-left">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white">
                <Check className="h-3 w-3" />
              </div>
              <p className="text-xs font-medium text-slate-700 leading-snug">
                Covers campaign setup, review, and getting you live.
              </p>
            </div>
          </div>

          {/* Card 3: Brand Builder */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF]">
                <Paintbrush className="h-7 w-7 text-[#7C3AED]" />
              </div>
              
              <h3 className="mt-6 text-lg font-semibold text-[#7C3AED]">
                Brand Builder
              </h3>
              
              <p className="mt-3 text-4xl sm:text-5xl font-bold text-[#0F172A]">
                ${brandBuilderPricingVal}
              </p>
              
              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                A one-time ${brandBuilderPricingVal} fee to build and customize your campaign brand.
              </p>
            </div>
            
            {/* Footer box */}
            <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-[#F3E8FF]/50 p-4 text-left">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                <Star className="h-3 w-3 fill-current" />
              </div>
              <p className="text-xs font-medium text-slate-700 leading-snug">
                Unlock advanced branding tools and custom design features.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mx-auto mt-10 max-w-4xl flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-[#EBF7F7] px-6 py-3 text-sm text-[#006666]">
            <Info className="h-4 w-4 shrink-0" />
            <p className="text-center font-medium">
              <span className="font-bold">No monthly fees.</span> You only pay when you launch a campaign or use premium branding.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TtransparentPricing;

