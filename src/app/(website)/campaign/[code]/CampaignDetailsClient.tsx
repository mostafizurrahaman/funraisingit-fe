"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetCampaignsByCodeQuery } from "@/redux/features/campaign/campaignApi";
import { Loader2, ArrowLeft, Heart, ShoppingCart, Users, Calendar, Award, ShoppingBag, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import cardImage from "@/assets/user.png";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function CampaignDetailsClient({ params }: PageProps) {
  const resolvedParams = use(params);
  const code = resolvedParams.code;

  const { data: campaignResponse, isLoading, error } = useGetCampaignsByCodeQuery(code);
  const campaign = campaignResponse?.data;

  const progressPercent = campaign
    ? Math.min(100, Math.round(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100))
    : 0;

  const handleActionCheck = (e: React.MouseEvent) => {
    if (campaign?.status === "draft" || campaign?.status === "pending") {
      e.preventDefault();
      toast.error("This campaign is not launched yet.");
    }
  };

  const handleShare = () => {
    if (campaign) {
      const shareUrl = `${window.location.origin}/campaign/${campaign.campaignCode}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Campaign link copied to clipboard!");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10 max-w-6xl">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:text-secondary mb-8 hover:-translate-x-0.5"
        >
          <ArrowLeft className="size-4" />
          Back to Campaigns
        </Link>

        {isLoading ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-8 shadow-sm">
            <Loader2 className="size-10 animate-spin text-secondary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Loading campaign details...
            </p>
          </div>
        ) : error || !campaign ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-foreground">Campaign Not Found</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              We couldn't locate the campaign you requested. It might have ended or the link might be incorrect.
            </p>
            <Link
              href="/campaign"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md cursor-pointer"
            >
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            {/* Left side info */}
            <div className="space-y-8">
              {/* Campaign Header & Image */}
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="relative aspect-[1.78/1] w-full bg-slate-100">
                  <Image
                    src={campaign.thumbnail || cardImage}
                    alt={campaign.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={!!campaign.thumbnail}
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize">
                    <span className="size-1.5 rounded-full bg-secondary animate-pulse" />
                    {campaign.status}
                  </span>
                  <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                    {campaign.name}
                  </h1>

                  {/* Organizer Details */}
                  <div className="mt-6 flex items-center gap-4 border-t border-b border-border py-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-50">
                      <Image
                        src={campaign.organizerProfileImage || cardImage}
                        alt={campaign.organizerName || "Organizer"}
                        fill
                        className="object-cover"
                        unoptimized={!!campaign.organizerProfileImage}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Organized by</p>
                      <p className="text-sm font-bold text-foreground">{campaign.organizerName || "Anonymous"}</p>
                    </div>
                  </div>

                  {/* Campaign Story */}
                  <div className="mt-6">
                    <h2 className="text-lg font-bold text-foreground mb-3">Our Story</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {campaign.story}
                    </p>
                  </div>

                  {/* Fund usage list */}
                  {campaign.fundUsage && campaign.fundUsage.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                        <Award className="size-4 text-secondary" />
                        Fund Allocation
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {campaign.fundUsage.map((fund: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-lg bg-secondary/5 border border-secondary/15 px-3 py-1 text-xs font-semibold text-secondary"
                          >
                            {fund}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Section */}
              {campaign.products && campaign.products.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ShoppingBag className="size-5 text-secondary" />
                    Campaign Products
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {campaign.products.map((product: any) => (
                      <div
                        key={product._id}
                        className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="relative aspect-[1.5/1] w-full bg-slate-100">
                          <Image
                            src={product.productImage || cardImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized={!!product.productImage}
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-foreground line-clamp-1">{product.name}</h3>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-sm font-bold text-secondary">${product.price?.toFixed(2)}</span>
                            {product.stock !== undefined && (
                              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-muted-foreground">
                                Stock: {product.isUnlimited ? "Unlimited" : product.stock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side widgets (Actions & Progress) */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <article className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4">Campaign Progress</h2>

                <div className="space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 border border-slate-200/50">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-secondary">${(campaign.raisedAmount || 0).toLocaleString()} Raised</span>
                    <span className="text-muted-foreground font-semibold">Goal: ${campaign.goalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-border mt-6 pt-6 text-center">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-border/50">
                    <Users className="size-5 text-secondary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground font-semibold">Supporters</p>
                    <p className="text-base font-extrabold text-foreground mt-0.5">{campaign.totalSupporters || 0}</p>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-border/50">
                    <Calendar className="size-5 text-secondary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground font-semibold">Days Left</p>
                    <p className="text-base font-extrabold text-foreground mt-0.5">{campaign.remainingDays ?? campaign.durationDays}</p>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="mt-8 grid gap-3">
                  <Link
                    href={`/donate-now?campaignId=${campaign._id}`}
                    onClick={handleActionCheck}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/95 hover:shadow-md cursor-pointer"
                  >
                    <Heart className="size-4 fill-white" />
                    Donate Now
                  </Link>

                  <Link
                    href={`/order-summary?code=${campaign.campaignCode}`}
                    onClick={handleActionCheck}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="size-4" />
                    Buy Products / Register
                  </Link>

                  <button
                    onClick={handleShare}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-secondary bg-white text-sm font-semibold text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-white cursor-pointer"
                  >
                    <Share2 className="size-4" />
                    Share Campaign
                  </button>
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
