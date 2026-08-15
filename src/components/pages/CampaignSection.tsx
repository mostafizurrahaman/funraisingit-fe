"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useGetAllActiveCampaignsQuery } from "@/redux/features/campaign/campaignApi";

import cardImage from "../../assets/user.png";
import toast from "react-hot-toast";

const CampaignSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");

  const [page, setPage] = useState(1);
  const limit = 6;

  // Resolve category mapping: "products_pre_orders" maps to "physical_product"
  const resolvedCategory =
    categoryQuery === "products_pre_orders" || categoryQuery === "physical_product"
      ? "physical_product"
      : categoryQuery;

  // Pass resolved campaignCategory parameter to backend API
  const { data: campaignsResponse, isLoading } = useGetAllActiveCampaignsQuery({
    page,
    limit,
    ...(resolvedCategory ? { campaignCategory: resolvedCategory } : {}),
  });

  const campaigns = campaignsResponse?.data || [];
  const meta = campaignsResponse?.meta || {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  };
  const totalPages = meta.totalPages || 1;
  console.log("Campaigns Response:", campaignsResponse);

  // Client-side filtering as fallback/guarantee
  const filteredCampaigns = campaigns.filter((campaign: any) => {
    if (!categoryQuery) return true;
    const category = campaign.campaignCategory;
    if (categoryQuery === "products_pre_orders" || categoryQuery === "physical_product") {
      return category === "products_pre_orders" || category === "physical_product";
    }
    return category === categoryQuery;
  });

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <h2 className="text-center text-5xl font-semibold text-foreground">
          Campaign
        </h2>

        {isLoading ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-8 animate-spin text-secondary" />
            <p className="text-sm text-muted-foreground">
              Loading campaigns...
            </p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Campaign not available with this category.
            </p>
            {categoryQuery && (
              <button
                onClick={() => {
                  router.push("/campaign");
                }}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
              >
                See All Categories
              </button>
            )}
          </div>
        ) : (
          <div>
            {categoryQuery && (
              <div className="mt-6 flex justify-center mb-8">
                <button
                  onClick={() => {
                    router.push("/campaign");
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-secondary bg-white px-5 text-sm font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer hover:-translate-y-0.5"
                >
                  See All Categories
                </button>
              </div>
            )}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign: any) => (
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
                            {campaign.fundUsage.map(
                              (fund: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary"
                                >
                                  {fund}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/donate-now?campaignId=${campaign._id}`}
                        onClick={(e) => {
                          if (
                            campaign.status === "draft" ||
                            campaign.status === "pending"
                          ) {
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
                          if (
                            campaign.status === "draft" ||
                            campaign.status === "pending"
                          ) {
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
                      {campaign.totalSupporters > 0 && (
                        <div className="flex -space-x-2">
                          {Array.isArray(campaign.supporters) &&
                          campaign.supporters.length > 0 ? (
                            campaign.supporters
                              .slice(0, 3)
                              .map((supporter: any, idx: number) => {
                                const name =
                                  typeof supporter === "string"
                                    ? supporter
                                    : supporter.name || "Supporter";
                                const initial = name.charAt(0).toUpperCase();
                                return (
                                  <div
                                    key={idx}
                                    className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-secondary text-[10px] font-bold text-white shadow-sm"
                                  >
                                    {initial}
                                  </div>
                                );
                              })
                          ) : (
                            <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-secondary text-[10px] font-bold text-white shadow-sm">
                              {(campaign.organizerName || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-foreground">
                        Join {campaign.totalSupporters || 0} supporters
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground transition-all duration-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-300 cursor-pointer ${
                    page === pageNumber
                      ? "border-secondary bg-secondary text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground transition-all duration-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignSection;
