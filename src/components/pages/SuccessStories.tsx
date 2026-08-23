"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";

import organizerImage from "../../assets/user.png";

interface SuccessStory {
  id: number | string;
  quote: string;
  name: string;
  organization: string;
  amount: string;
  rating?: number;
  profileImage?: string;
}

const SuccessStories = () => {
  const { data: reviewsResponse } = useGetAllReviewsQuery({
    page: 1,
    limit: 10,
    isFeatured: true,
  });

  const apiReviews = reviewsResponse?.data || [];

  const dynamicStories: SuccessStory[] = apiReviews.map((review: any, idx: number) => ({
    id: review._id || idx,
    quote: review.message || "",
    name: review.user?.name || "Organizer",
    organization: review.user?.campaign?.name || "Campaign Organizer",
    amount: review.user?.campaign?.goalAmount ? `$${review.user.campaign.goalAmount.toLocaleString()}` : "",
    profileImage: review.user?.profileImage || "",
    rating: review.rating || 5,
  }));

  const storiesToRender: SuccessStory[] = dynamicStories;

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

        {storiesToRender.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg text-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 shadow-sm">
            <Star className="size-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No Stories Yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              No organizer success stories or reviews have been published yet. Check back later to see inspiring stories from our community!
            </p>
          </div>
        ) : (
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
              {storiesToRender.map((story: SuccessStory) => (
                <article
                  key={story.id}
                  className="flex min-h-64 min-w-full snap-start flex-col rounded-2xl bg-secondary p-6 text-white shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-7 md:min-w-[calc(50%-0.625rem)]"
                >
                  <div className="flex gap-1" aria-label={`${story.rating} out of 5 stars`}>
                    {Array.from({ length: story.rating || 5 }).map((_, star) => (
                      <Star key={star} className="size-4 fill-[#ffc107] text-[#ffc107]" aria-hidden="true" />
                    ))}
                  </div>

                  <blockquote className="mt-5 text-sm leading-6 sm:text-base">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>

                  <div className="mt-auto flex items-end gap-3 pt-7">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-white/70">
                      <Image
                        src={story.profileImage || organizerImage}
                        alt={story.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized={!!story.profileImage}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{story.name}</p>
                      <p className="truncate text-xs text-white/85">{story.organization}</p>
                    </div>
                    {story.amount && (
                      <p className="whitespace-nowrap text-sm font-semibold text-foreground">{story.amount}</p>
                    )}
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
        )}
      </section>
    </main>
  );
};

export default SuccessStories;
