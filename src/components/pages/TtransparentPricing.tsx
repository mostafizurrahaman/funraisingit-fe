"use client";

import Link from "next/link";
import { CircleCheck, Loader2 } from "lucide-react";
import { useGetSiteInfoQuery } from "@/redux/features/settingsManagement/settingsManagementApi";

interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  platformFee: string;
  features: string[];
  buttonLabel: string;
  featured?: boolean;
}

const TtransparentPricing = () => {
  const { data: siteInfoResponse, isLoading } = useGetSiteInfoQuery(undefined);

  const siteInfo = siteInfoResponse?.data || {};

  const platformFeeVal = siteInfo.platformFee !== undefined ? siteInfo.platformFee : 6;
  const launchFeeVal = siteInfo.campaignLaunchFee !== undefined ? siteInfo.campaignLaunchFee : 18.99;
  const brandBuilderPricingVal = siteInfo.brandBuilderPricing !== undefined ? siteInfo.brandBuilderPricing : 39.99;

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "Free",
      billing: "No upfront cost",
      platformFee: `${platformFeeVal}% platform fee`,
      features: [
        "Campaign builder",
        "Unlimited products",
        "Public campaign page",
        "Order management",
        "Basic analytics",
      ],
      buttonLabel: "Start for free",
    },
    {
      name: "Pro",
      price: `$${launchFeeVal}`,
      billing: "One-time launch fee",
      platformFee: "4% platform fee",
      features: [
        "Everything in Starter",
        "Priority support",
        "Social post generator",
        "QR code download",
        "Email supporters",
        "Advanced analytics",
      ],
      buttonLabel: "Launch Pro",
      featured: true,
    },
    {
      name: "Brand Builder",
      price: `$${brandBuilderPricingVal}`,
      billing: "One-time launch fee",
      platformFee: "2% platform fee",
      features: [
        "Everything in Pro",
        "Custom merch design",
        "Dedicated designer",
        "Mockup approval",
        "Event package",
        "Brand kit",
      ],
      buttonLabel: "Go Premium",
    },
  ];

  if (isLoading) {
    return (
      <section className="bg-background py-14 sm:py-20 lg:py-24">
        <div className="container mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="size-8 animate-spin text-secondary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading pricing details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-semibold text-secondary sm:text-lg">
            Transparent Pricing
          </p>
          <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Start free. Scale as you grow.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            No monthly fees. Pay only when you launch. Platform fee auto-deducted — you keep the rest.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-stretch">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex min-h-[370px] flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${
                plan.featured
                  ? "border-secondary bg-secondary text-white shadow-lg"
                  : "border-secondary bg-white text-foreground shadow-sm"
              }`}
            >
              {plan.featured && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#ffc107] px-4 py-1 text-[10px] font-semibold text-black">
                  MOST POPULAR
                </span>
              )}

              <p className="text-sm font-medium">{plan.name}</p>
              <h2 className="mt-1 text-3xl leading-none font-semibold">{plan.price}</h2>
              <p className="mt-2 text-xs">{plan.billing}</p>
              <p className={`mt-1 text-sm font-semibold ${plan.featured ? "text-[#fff200]" : "text-secondary"}`}>
                {plan.platformFee}
              </p>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CircleCheck
                      className={`mt-0.5 size-4 shrink-0 ${plan.featured ? "text-[#fff200]" : "text-secondary"}`}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-auto flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  plan.featured
                    ? "bg-[#ffb800] text-black hover:bg-[#ffa800]"
                    : "border border-secondary bg-white text-secondary hover:bg-secondary hover:text-white"
                }`}
              >
                {plan.buttonLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TtransparentPricing;
