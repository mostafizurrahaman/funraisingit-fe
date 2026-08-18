import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import glitter from "../../assets/glitter.png";

const onboardingSteps = [
  {
    title: "Profile Setup Complete",
    description: "Your contact details and profile preferences are configured.",
    status: "done",
  },
  {
    title: "Account Activated",
    description: "Access to create campaigns and receive donations is enabled.",
    status: "done",
  },
  {
    title: "Dashboard Configured",
    description: "Real-time analytics and tracking systems are ready.",
    status: "done",
  },
] as const;

const OnboardingSuccess = () => {
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary bg-secondary/5 px-3 py-1 text-[10px] font-medium text-secondary">
              <UserCheck className="size-3" />
              Onboarding Complete
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground sm:text-4xl">
              Welcome to FunRaisingIt!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Your profile is now complete, and your account has been
              successfully onboarded. You are ready to start launching campaigns
              and accepting donations.
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
            <div className="flex flex-col items-center border-b border-border pb-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Sparkles className="size-6 animate-pulse" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">
                Onboarding Status
              </h2>
              <p className="mt-1 text-sm text-secondary font-semibold">
                All Systems Operational
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {onboardingSteps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-white mt-0.5">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3">
              <Link
                href="/dashboard/campaign"
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                <LayoutDashboard className="size-4" />
                Launch My Campaign
                <ArrowRight className="size-4" />
              </Link>
              {/* <Link
                href="/campaign_1"
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-secondary text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                <Rocket className="size-4" />
                Start My First Campaign
              </Link> */}
            </div>
          </article>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            Your account credentials and details are fully protected.
          </p>
        </div>
      </div>
    </main>
  );
};

export default OnboardingSuccess;
