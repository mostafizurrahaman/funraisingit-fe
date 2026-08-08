"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useGetAllCampaignsQuery } from "@/redux/features/campaign/campaignApi";

import cardImage from "../../assets/user.png";
import toast from "react-hot-toast";

const CampaignSection = () => {
  const { data: campaignsResponse, isLoading } = useGetAllCampaignsQuery(undefined);
  const campaigns = campaignsResponse?.data || [];

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <h2 className="text-center text-5xl font-semibold text-foreground">
          Campaign
        </h2>

        {isLoading ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-8 animate-spin text-secondary" />
            <p className="text-sm text-muted-foreground">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mt-20 text-center text-muted-foreground">
            No campaigns found.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign: any) => (
              <div
                key={campaign._id}
                className="overflow-hidden rounded-lg bg-white shadow-[0_8px_24px_rgba(7,18,47,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,18,47,0.16)]"
              >
                <div className="relative aspect-[1.55/1] w-full overflow-hidden bg-slate-50">
                  <Image
                    src={campaign.thumbnail || cardImage}
                    alt={campaign.name}
                    fill
                    className="object-top object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={!!campaign.thumbnail}
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-50">
                      <Image
                        src={campaign.organizerProfileImage || cardImage}
                        alt="Campaign owner"
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={!!campaign.organizerProfileImage}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base leading-6 font-semibold text-foreground sm:text-lg truncate">
                        {campaign.name}
                      </h3>
                      <p className="mt-1 text-xs leading-4 text-muted-foreground sm:text-sm line-clamp-2">
                        {campaign.story}
                      </p>
                      
                      {campaign.fundUsage && campaign.fundUsage.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {campaign.fundUsage.map((fund: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary"
                            >
                              {fund}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/donate-now?campaignId=${campaign._id}`}
                      onClick={(e) => {
                        if (campaign.status === "draft" || campaign.status === "pending") {
                          e.preventDefault();
                          toast.error("This campaign is not launched yet.");
                        }
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-secondary bg-white px-3 text-xs font-semibold text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-white"
                    >
                      <Heart className="size-4" />
                      Donate
                    </Link>
                    <Link
                      href={`/order-summary?code=${campaign.campaignCode}`}
                      onClick={(e) => {
                        if (campaign.status === "draft" || campaign.status === "pending") {
                          e.preventDefault();
                          toast.error("This campaign is not launched yet.");
                        }
                      }}
                      className="flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                    >
                      Buy Now
                    </Link>
                  </div>

                  <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((supporter) => (
                        <div
                          key={supporter}
                          className="relative size-6 overflow-hidden rounded-full border-2 border-white bg-slate-50"
                        >
                          <Image
                            src={campaign.organizerProfileImage || cardImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="24px"
                            unoptimized={!!campaign.organizerProfileImage}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-foreground">
                      Join {campaign.totalSupporters || 0} supporters
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-7 text-center">
          <Link
            href="/campaign"
            className="text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary"
          >
            See All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
