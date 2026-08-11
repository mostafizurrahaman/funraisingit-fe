"use client";

import { CircleCheck, Loader2, CreditCard, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useGetSiteInfoQuery } from "@/redux/features/settingsManagement/settingsManagementApi";

interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  platformFee: string;
  features: string[];
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

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-stretch">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7 ${
                plan.featured
                  ? "border-secondary/60 border-t-4 border-t-secondary"
                  : "border-slate-100"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-4 top-4 whitespace-nowrap rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold text-secondary tracking-wider uppercase">
                  Popular
                </span>
              )}

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan.name}</p>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground">{plan.price}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{plan.billing}</p>
              
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary">
                  {plan.platformFee}
                </span>
              </div>

              <div className="mt-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">What&apos;s Included</p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <CircleCheck
                        className="mt-0.5 size-4 shrink-0 text-secondary"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

     

      </div>
    </section>
  );
};

export default TtransparentPricing;
