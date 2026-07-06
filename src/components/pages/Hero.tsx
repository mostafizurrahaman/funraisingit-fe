import hero from "../../assets/hero.png";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";



const Hero = () => {
  return (
    <section className="overflow-hidden bg-background">
      <div className="container mx-auto grid items-center gap-10 px-5 pb-14 pt-8 sm:px-8 md:grid-cols-2 md:gap-8 lg:px-10 lg:pb-20 lg:pt-5">
        <div className="relative  text-start md:text-left">
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

        <div className="relative mx-auto flex w-full max-w-[540px] items-center justify-center md:justify-end">
          <Image
            src={hero}
            alt="Fundraising campaign for Jenny’s Famous Banana Pudding"
            className="h-auto w-full object-contain"
            sizes="(max-width: 768px) 90vw, 46vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
