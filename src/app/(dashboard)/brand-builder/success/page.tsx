"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ClipboardCheck, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import glitter from "../../../../assets/glitter.png";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "BB-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const details = [
    { label: "Project Status", value: "Paid & Scheduled", icon: CheckCircle2, color: "text-secondary" },
    { label: "Reference ID", value: sessionId, icon: ClipboardCheck, color: "text-primary" },
    { label: "Date", value: currentDate, icon: Calendar, color: "text-primary" },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 pb-12 sm:pb-20">
      <header className="py-12 sm:py-16">
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
          <Image
            src={glitter}
            alt=""
            className="h-auto w-12 shrink-0 sm:w-40 lg:w-[28%] lg:max-w-[395px]"
            aria-hidden="true"
            priority
          />
          <div className="min-w-0 flex-1 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400 bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-600">
              <CheckCircle2 className="size-3" />
              Order Successful
            </span>
            <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
              Brand Project Started!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground sm:text-sm leading-relaxed">
              We have received your brand details and payment successfully. Our professional design team will start working on your custom concepts. Expect mockups in your inbox within 7 business days!
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
        <div className="mx-auto max-w-xl">
          <article className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgb(7,12,47,0.02)]">
            <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">
              Order Details
            </h2>
            <dl className="space-y-5">
              {details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.label} className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className={`flex size-8 items-center justify-center rounded-full bg-slate-50 ${detail.color}`}>
                      <Icon className="size-4 shrink-0" />
                    </div>
                    <dt className="font-semibold text-muted-foreground">{detail.label}</dt>
                    <dd className="ml-auto text-right font-bold text-foreground">{detail.value}</dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 grid gap-3">
              <Link
                href="/"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Go to Homepage
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/campaign"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                Browse Campaigns
              </Link>
            </div>
          </article>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            Your project onboarding is fully secure and encrypted.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function BrandBuilderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
