"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import organizerImage from "../../assets/user.png";

interface SuccessStory {
  id: number;
  quote: string;
  name: string;
  organization: string;
  amount: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    quote: "We raised $15,000 for our food pantry in just 3 weeks. Our volunteers shared the link and orders just started pouring in.",
    name: "Pastor David Webb",
    organization: "Eastside Community Church",
    amount: "$15,000",
  },
  {
    id: 2,
    quote: "I had never done a fundraiser before. FunRaisingIt walked me through every step. Our school now has a beautiful new playground.",
    name: "Jennifer Park",
    organization: "Lincoln Elementary PTA",
    amount: "$12,000",
  },
  {
    id: 3,
    quote: "Our team reached its travel goal faster than we imagined. Sharing one simple campaign link made everything so easy.",
    name: "Marcus Green",
    organization: "Riverside Youth Soccer",
    amount: "$9,800",
  },
  {
    id: 4,
    quote: "The campaign page looked professional from day one, and our supporters loved being able to donate or buy products in one place.",
    name: "Alicia Torres",
    organization: "Bright Futures Project",
    amount: "$18,500",
  },
];

const SuccessStories = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollBack(slider.scrollLeft > 2);
    setCanScrollForward(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateControls();
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(slider);

    return () => resizeObserver.disconnect();
  }, [updateControls]);

  const scroll = (direction: "back" | "forward") => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === "forward" ? slider.clientWidth : -slider.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-background py-16 sm:py-20 lg:py-24">
      <section className="container mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-secondary">Success Stories</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Real organizers. Real results.
          </h1>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl items-center gap-4 sm:grid-cols-[44px_minmax(0,1fr)_44px] sm:gap-5">
          <button
            type="button"
            onClick={() => scroll("back")}
            disabled={!canScrollBack}
            aria-label="Previous success stories"
            className="order-2 flex size-11 items-center justify-center justify-self-end rounded-full bg-secondary text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/85 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-35 sm:order-1"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div
            ref={sliderRef}
            onScroll={updateControls}
            className="order-1 flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:order-2"
          >
            {successStories.map((story) => (
              <article
                key={story.id}
                className="flex min-h-64 min-w-full snap-start flex-col rounded-2xl bg-secondary p-6 text-white shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-7 md:min-w-[calc(50%-0.625rem)]"
              >
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-[#ffc107] text-[#ffc107]" aria-hidden="true" />
                  ))}
                </div>

                <blockquote className="mt-5 text-sm leading-6 sm:text-base">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>

                <div className="mt-auto flex items-end gap-3 pt-7">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-white/70">
                    <Image src={organizerImage} alt={story.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{story.name}</p>
                    <p className="truncate text-xs text-white/85">{story.organization}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-foreground">{story.amount}</p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("forward")}
            disabled={!canScrollForward}
            aria-label="Next success stories"
            className="order-3 flex size-11 items-center justify-center justify-self-start rounded-full bg-secondary text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/85 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default SuccessStories;
