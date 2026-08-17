import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck, Heart } from "lucide-react";
import user from "../../assets/user.png";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-background">
      <div className="container mx-auto grid items-center gap-10 px-5 pb-14 pt-8 sm:px-8 md:grid-cols-2 md:gap-8 lg:px-10 lg:pb-20 lg:pt-5">
        <div className="relative text-start md:text-left">
          <h1 className="text-[2.6rem] leading-[1.12] font-semibold tracking-[-0.04em] text-black sm:text-5xl lg:text-[4rem] lg:leading-[1.08]">
            Turn Your Idea
            <br />
            Into <span className="text-secondary">Sales</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base md:mx-0 lg:text-lg lg:leading-7">
            Raise money, sell products, and accept
            <br className="hidden sm:block" /> donations without needing a
            website.
          </p>

          <Link
            href="/campaign_1"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:px-5 sm:text-base"
          >
            Start My Campaign
            <ArrowRight className="size-4" />
          </Link>

          <div className="mt-5 flex items-start justify-center gap-2 text-left md:justify-start">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
            <p className="text-[14px] leading-4 text-foreground sm:text-xs">
              Build your campaign free.
              <br />
              Only pay when you&apos;re ready to launch.
            </p>
          </div>
        </div>

        {/* Custom Card Design Replacing Blurry Hero Image */}
        <div className="relative mx-auto flex w-full max-w-[540px] items-center justify-center p-8 md:justify-end">
          {/* Top-Left Decorative Teal Accents */}
          <div className="absolute top-0 left-0 text-secondary size-12 shrink-0 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="size-full">
              <path d="M40 30 L20 10" />
              <path d="M60 40 L50 15" />
              <path d="M35 55 L10 50" />
            </svg>
          </div>

          {/* Main Card Container */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_15px_40px_rgba(7,18,47,0.08)]">
            {/* Top Half Campaign Thumbnail Image */}
            <div className="relative aspect-[1.38/1] w-full overflow-hidden rounded-2xl bg-slate-50">
              <Image
                src={user}
                alt="Jenny holding banana pudding"
                fill
                className="object-cover object-top"
                priority
              />

              {/* Overlapping Stats Card */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-44 rounded-2xl bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-slate-50 text-left">
                <p className="text-lg font-bold text-secondary">$2,450</p>
                <p className="text-[10px] text-muted-foreground">raised of $2,500 goal</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/15">
                  <div className="h-full w-[98%] bg-secondary rounded-full" />
                </div>
                <div className="mt-3 flex justify-between gap-2 text-left">
                  <div>
                    <p className="text-sm font-bold text-foreground">84</p>
                    <p className="text-[9px] text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">42</p>
                    <p className="text-[9px] text-muted-foreground">Supporters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Half Campaign Details */}
            <div className="mt-4 px-1 text-left">
              <div className="flex gap-3">
                {/* Creator Avatar */}
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
                  <Image
                    src={user}
                    alt="Creator profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1530] leading-tight sm:text-lg">
                    Jenny&apos; Famous Banana Pudding
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal sm:text-sm">
                    Help me launch my homemade banana pudding business!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-white px-3 text-xs font-bold text-secondary "
                >
                  <Heart className="size-4 text-secondary fill-current" />
                  Donate
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center rounded-xl bg-[#FF7800] px-3 text-xs font-bold text-white  "
                >
                  Buy Now
                </button>
              </div>

              {/* Divider and Supporters List */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((supporter) => (
                    <div
                      key={supporter}
                      className="relative size-5 overflow-hidden rounded-full border border-white bg-slate-100 shadow-sm"
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
            </div>
          </div>

          {/* Bottom-Right Decorative Orange Accents */}
          <div className="absolute bottom-0 right-0 text-[#FF7800] size-12 shrink-0 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="size-full">
              <path d="M40 70 L20 90" />
              <path d="M60 60 L50 85" />
              <path d="M65 45 L90 50" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
