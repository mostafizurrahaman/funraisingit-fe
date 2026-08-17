"use client";

import Image from "next/image";
import Link from "next/link";
import {
  XCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import glitter from "../../assets/glitter.png";

const PaymentCancel = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paymentDetails = [
    { label: "Payment Status", value: "Cancelled / Failed", icon: XCircle, color: "text-red-500" },
    { label: "Date & Time", value: currentDate, icon: ShieldAlert, color: "text-primary" },
  ] as const;

  return (
    <main className="min-h-screen bg-background pb-12 sm:pb-20">
      <header className="py-8 sm:py-12">
        <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
          <Image
            src={glitter}
            alt=""
            className="h-auto w-12 shrink-0 sm:w-40 lg:w-[28%] lg:max-w-[395px]"
            aria-hidden="true"
            priority
          />
          <div className="min-w-0 flex-1 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400 bg-red-50 px-3 py-1 text-[10px] font-medium text-red-600">
              <XCircle className="size-3" />
              Payment Cancelled
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground sm:text-4xl">
              Payment was Cancelled
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Your transaction was not completed. No funds were charged from your card. You can try again or browse other campaigns.
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
          <article className="rounded-xl border border-border bg-white p-6 sm:p-8 shadow-sm">
            <dl className="mt-6 space-y-4">
              {paymentDetails.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.label} className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className={`flex size-8 items-center justify-center rounded-full bg-slate-50 ${detail.color}`}>
                      <Icon className="size-4 shrink-0" />
                    </div>
                    <dt className="font-medium text-muted-foreground">{detail.label}</dt>
                    <dd className="ml-auto text-right font-semibold text-foreground">{detail.value}</dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 grid gap-3">
              <Link
                href="/campaign"
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Try Payment Again
              </Link>
              <Link
                href="/"
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                Go to Homepage
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
            <ShieldAlert className="size-4 text-red-500" />
            No transaction fees were applied.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PaymentCancel;
