import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

import heart from "../../assets/heart.png";
import send from "../../assets/send.png";

const BringIdea = () => {
  return (
    <section className="overflow-hidden bg-background pt-12 sm:pt-16">
      <div className="container relative mx-auto bg-[#e6f7f4]">
        <div
          className="absolute inset-y-0 right-full hidden w-[calc((100vw-100%)/2)] bg-[#e6f7f4] lg:block [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 left-full hidden w-[calc((100vw-100%)/2)] bg-[#e6f7f4] lg:block [clip-path:polygon(0_0,100%_100%,0_100%)]"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden px-6 py-14 sm:px-12 sm:py-16 lg:px-36 lg:py-20">
          <Image
            src={heart}
            alt=""
            className="absolute left-4 top-8 h-auto w-32 opacity-50 sm:left-12 sm:top-10 sm:w-20 sm:opacity-100 lg:left-[8%]"
            aria-hidden="true"
          />
          <Image
            src={send}
            alt=""
            className="absolute bottom-5 right-3 h-auto w-32 opacity-50 sm:bottom-8 sm:right-10 sm:w-28 sm:opacity-100 lg:right-[4%] lg:w-32"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-[32px] leading-tight font-semibold text-foreground">
              Ready to bring your idea to life?
            </h2>

            <p className="mt-4 text-xl leading-8 text-foreground">
              Create your campaign free and see it before you launch.
            </p>

            <div className="mt-6">
              <Link
                href="/campaign"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Start My Campaign
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-5">
              <p className="inline-flex items-center justify-center gap-2 text-sm text-foreground">
                <LockKeyhole className="size-4" aria-hidden="true" />
                Only pay when you&apos;re ready to launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BringIdea;
