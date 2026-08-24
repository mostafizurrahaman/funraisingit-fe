import {
  ChevronRight,
  Landmark,
  LockKeyhole,
  Pencil,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Users,
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
    description: "Add your product, story, photos and set your goal",
    icon: Pencil,
  },
  {
    number: 2,
    title: "Share Your Link",
    description: "Post on social media, text or email to your supporters.",
    icon: Share2,
  },
  {
    number: 3,
    title: "Collect Orders & Donations",
    description: "Supporters can buy your products or donate to your cause.",
    icon: ShoppingBag,
  },
  {
    number: 4,
    title: "Get Paid",
    description: "Receive payouts and download your order report.",
    icon: Landmark,
  },
];

const trustItems: TrustItem[] = [
  { label: "Secure Payments", icon: ShieldCheck },
  { label: "Customer Support", icon: Users },
  { label: "Your Data is Safe", icon: LockKeyhole },
  { label: "Fast Payouts", icon: Zap },
];

const HowItWorks = () => {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wide text-secondary sm:text-sm">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Get started in 4 easy steps
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="group relative px-4 text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+3.5rem)] right-[calc(-50%+3.5rem)] top-7 hidden items-center lg:flex" aria-hidden="true">
                    <span className="w-full border-t-2 border-dotted border-secondary" />
                    <ChevronRight className="-ml-2 size-4 shrink-0 text-secondary" />
                  </div>
                )}

                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-secondary group-hover:text-white group-hover:shadow-md">
                  <Icon className="size-9 stroke-[1.7]" aria-hidden="true" />
                </div>

                <span className="mt-4 inline-flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-white">
                  {step.number}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-48 text-[14px] leading-4 text-muted-foreground sm:text-xs">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <p className="text-center text-xl font-medium text-foreground sm:text-base">
            Trusted by thousands of creators, teams and entrepreneurs
          </p>

          <div className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-4 sm:gap-0 ">
            {trustItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`flex justify-start items-center gap-3 px-3 text-center transition-colors duration-300 hover:text-secondary ${index > 0 ? "sm:border-l sm:border-muted-foreground/40" : ""}`}
                >
                  <Icon className="h-15 w-15 shrink-0 text-secondary stroke-[1.8] " aria-hidden="true" />
                  <span className="text-xl font-medium text-foreground sm:text-sm">
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
