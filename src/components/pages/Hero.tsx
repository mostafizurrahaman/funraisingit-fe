import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck, Heart, Users } from "lucide-react";
import user from "../../assets/user.jpg";
import hero from "../../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto grid items-center gap-12 px-5 pb-16 pt-10 sm:px-8 md:grid-cols-2 md:gap-10 lg:px-10 lg:pb-24 lg:pt-12">
        
        {/* LEFT CONTENT */}
        <div className="relative z-10 text-center md:text-left">
          {/* Small badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-3.5 py-2">
            <span className="size-2 rounded-full bg-secondary" />
            <span className="text-xs font-semibold text-secondary sm:text-sm">
              Turn your passion into something real
            </span>
          </div>

          <h1 className="text-[2.8rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#0B1530] sm:text-5xl lg:text-[4.35rem]">
            Turn Your Idea
            <br />
            Into{" "}
            <span className="relative inline-block text-secondary">
              Sales
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-secondary/20" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base md:mx-0 lg:text-lg lg:leading-8">
            Raise money, sell products, and accept donations —
            <br className="hidden sm:block" />
            all without needing a website.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="/campaign_1"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] sm:h-13 sm:px-7 sm:text-base"
            >
              Start My Campaign
              <ArrowRight className="size-4" />
            </Link>

            <div className="flex items-center gap-2 text-left">
              <CircleCheck className="size-4 shrink-0 text-secondary" />
              <p className="text-xs leading-4 text-muted-foreground">
                Free to build.
                <br />
                Pay only when you launch.
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 md:justify-start">
            <div>
              <p className="text-lg font-bold text-[#0B1530]">10K+</p>
              <p className="text-[11px] text-muted-foreground">
                Campaigns
              </p>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <p className="text-lg font-bold text-[#0B1530]">$2M+</p>
              <p className="text-[11px] text-muted-foreground">
                Raised
              </p>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <p className="text-lg font-bold text-[#0B1530]">98%</p>
              <p className="text-[11px] text-muted-foreground">
                Goal reached
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CAMPAIGN CARD */}
        <div className="relative mx-auto w-full max-w-[550px]">
          
          {/* Decorative top label */}
          <div className="absolute -top-4 left-6 z-20 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-sm">
            <p className="text-xs font-bold text-[#0B1530]">
              ✦ Live Campaign
            </p>
          </div>

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-3 shadow-[0_25px_70px_rgba(7,18,47,0.12)] sm:p-4">
            
            {/* Image */}
            <div className="relative aspect-[1.4/1] overflow-hidden rounded-[22px] bg-slate-100">
              <Image
                src={hero}
                alt="Jenny holding banana pudding"
                fill
                className="object-cover"
                priority
              />

              {/* Image overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-5 pt-16">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/80">
                      Campaign goal
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-white">
                      $2,500
                    </p>
                  </div>

                  <div className="rounded-full bg-white/95 px-3 py-1.5">
                    <p className="text-xs font-bold text-secondary">
                      98% Funded
                    </p>
                  </div>
                </div>
              </div>

              {/* Raised card */}
              <div className="absolute right-4 top-4 w-[175px] rounded-2xl border border-white/60 bg-white/95 p-3.5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Raised
                  </p>

                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[9px] font-bold text-secondary">
                    98%
                  </span>
                </div>

                <p className="mt-1 text-xl font-bold text-secondary">
                  $2,450
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/10">
                  <div className="h-full w-[98%] rounded-full bg-secondary" />
                </div>

                <p className="mt-1 text-[9px] text-muted-foreground">
                  of $2,500 goal
                </p>
              </div>
            </div>

            {/* Campaign details */}
            <div className="px-1 pb-1 pt-5 sm:px-2">
              
              {/* Creator */}
              <div className="flex items-start gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
                  <Image
                    src={user}
                    alt="Jenny"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold leading-tight text-[#0B1530] sm:text-lg">
                      Jenny&apos;s Famous Scented Candle
                    </h3>

                    <span className="hidden shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-[9px] font-bold text-secondary sm:block">
                      VERIFIED
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                    Help me launch my homemade scented candle business!
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 divide-x rounded-2xl bg-slate-50 py-3">
                <div className="text-center">
                  <p className="text-base font-bold text-[#0B1530]">
                    84
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Orders
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-base font-bold text-[#0B1530]">
                    42
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Supporters
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-base font-bold text-[#0B1530]">
                    12
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Days left
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white px-3 text-xs font-bold text-secondary"
                >
                  <Heart className="size-4 fill-current" />
                  Donate
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF7800] px-3 text-xs font-bold text-white"
                >
                  Buy Now
                </button>
              </div>

              {/* Supporters */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((supporter) => (
                      <div
                        key={supporter}
                        className="relative size-6 overflow-hidden rounded-full border-2 border-white bg-slate-100"
                      >
                        <Image
                          src={user}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] font-semibold text-foreground">
                    Join 42 supporters
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Users className="size-3.5" />
                  Community funded
                </div>
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 size-28 rounded-full bg-[#FF7800]/10" />
          <div className="pointer-events-none absolute -left-6 top-20 -z-10 size-20 rounded-full bg-secondary/10" />
        </div>
      </div>
    </section>
  );
};

export default Hero;