import {
  CheckCircle2,
  ChevronRight,
  Landmark,
  LockKeyhole,
  Pencil,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface TrustItem {
  label: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Create Your Campaign",
    description: "Add your product, story, photos and set your goal in a few easy clicks.",
    icon: Pencil,
  },
  {
    number: 2,
    title: "Share Your Link",
    description: "Post on social media, text or email directly to your supporters and community.",
    icon: Share2,
  },
  {
    number: 3,
    title: "Collect Orders & Donations",
    description: "Supporters can seamlessly buy your products or donate directly to your cause.",
    icon: ShoppingBag,
  },
  {
    number: 4,
    title: "Get Paid",
    description: "Receive fast, direct payouts and download your complete order fulfillment report.",
    icon: Landmark,
  },
];

const trustItems: TrustItem[] = [
  { label: "Secure Payments", icon: ShieldCheck },
  { label: "Dedicated Support", icon: Users },
  { label: "Your Data is Safe", icon: LockKeyhole },
  { label: "Fast Payouts", icon: Zap },
];

interface HowItWorksProps {
  showVideo?: boolean;
}

const HowItWorks = ({ showVideo = true }: HowItWorksProps) => {
  return (
    <section className="bg-background py-20 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs sm:text-sm font-extrabold tracking-widest text-secondary uppercase">
            <Sparkles className="size-4" />
            HOW IT WORKS
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            Get Started in 4 Easy Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed">
            Watch our quick video walkthrough or follow the simple guide below to create, launch, and succeed with your fundraiser.
          </p>
        </div>

        {/* Featured Video Section */}
        {showVideo && (
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl lg:max-w-5xl">
            <div className="relative group overflow-hidden rounded-3xl border-2 border-secondary/20 bg-slate-950 shadow-2xl shadow-secondary/10 transition-all duration-300">
              <div className="relative aspect-video w-full bg-black">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                  src="https://funraising-it.s3.us-east-1.amazonaws.com/first_video_draft_5.mp4"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="bg-slate-900/95 backdrop-blur-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 text-white">
                <div className="flex items-center gap-2.5">
                  <Video className="size-5 text-secondary" />
                  <span className="text-base sm:text-lg font-bold">Platform Walkthrough Video</span>
                  <span className="text-xs text-white/60 hidden sm:inline">• See Funraising-It in action</span>
                </div>
                <div className="flex items-center gap-5 text-xs sm:text-sm font-semibold text-white/80">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-secondary" />
                    Quick Setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-secondary" />
                    No Upfront Costs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Steps Section */}
        <div className="mt-20 sm:mt-24">
          <div className="text-center mb-14 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Simple Step-by-Step Guide
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground font-medium">
              Everything you need to know from launching to receiving your funds.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.number} className="group relative px-4 text-center flex flex-col items-center">
                  {index < steps.length - 1 && (
                    <div
                      className="absolute left-[calc(50%+4rem)] right-[calc(-50%+4rem)] top-12 sm:top-14 hidden items-center lg:flex"
                      aria-hidden="true"
                    >
                      <span className="w-full border-t-2 border-dotted border-secondary/60" />
                      <ChevronRight className="-ml-2 size-5 shrink-0 text-secondary" />
                    </div>
                  )}

                  {/* Larger Step Icon Circle */}
                  <div className="mx-auto flex size-24 sm:size-28 items-center justify-center rounded-3xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-secondary group-hover:text-white group-hover:shadow-xl group-hover:shadow-secondary/25">
                    <Icon className="size-11 sm:size-12 stroke-[1.8]" aria-hidden="true" />
                  </div>

                  {/* Larger Step Number Badge */}
                  <span className="mt-5 inline-flex size-8 sm:size-9 items-center justify-center rounded-full bg-secondary text-sm sm:text-base font-extrabold text-white shadow-md">
                    {step.number}
                  </span>

                  {/* Larger Step Title */}
                  <h4 className="mt-3 text-lg sm:text-xl font-bold text-foreground">
                    {step.title}
                  </h4>

                  {/* Larger Step Description */}
                  <p className="mx-auto mt-2.5 max-w-xs text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Larger Trust Section */}
        <div className="mt-20 sm:mt-24 lg:mt-32 rounded-3xl bg-secondary/5 border border-secondary/15 p-8 sm:p-12 shadow-sm">
          <p className="text-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground">
            Trusted by thousands of creators, teams and entrepreneurs
          </p>
          <p className="mt-2 text-center text-sm sm:text-base text-muted-foreground font-medium">
            We provide all the tools, security, and guidance you need to hit your goal.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-secondary/15 shadow-sm transition-all duration-300 hover:shadow-md hover:border-secondary/40"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon className="size-6 stroke-[2]" aria-hidden="true" />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
