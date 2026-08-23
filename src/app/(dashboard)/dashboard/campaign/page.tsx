/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardEdit,
  Copy,
  Edit3,
  Flag,
  Globe2,
  Heart,
  ImageIcon,
  Mail,
  Megaphone,
  Package,
  Pause,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  Zap,
  X,
  Loader2,
  UploadCloud,
} from "lucide-react";
import order from "@/assets/order.png";
import user from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  useGetCampaignByIdQuery,
  useUpdateCampaignMutation,
  useGetDraftCampaignsQuery,
} from "@/redux/features/campaign/campaignApi";

const defaultPurposes = [
  "Ingredients",
  "Packaging",
  "Inventory",
  "Equipment",
  "Marketing",
  "Supplies",
] as const;

export default function CampaignSettingsPage() {
  const router = useRouter();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  // 1. Get draft campaigns list
  const {
    data: draftCampaignsResponse,
    isLoading: isLoadingDrafts,
    error: draftsError,
  } = useGetDraftCampaignsQuery(undefined);

  // Normalize drafts response (data could be a single object or an array)
  const draftsData = draftCampaignsResponse?.data;
  console.log("Draft Campaigns Response:", draftsData);
  const draftCampaigns = Array.isArray(draftsData)
    ? draftsData
    : draftsData && typeof draftsData === "object" && draftsData._id
      ? [draftsData]
      : [];

  const draftCampaignId =
    draftsData?._id ||
    (Array.isArray(draftsData) ? draftsData[0]?._id : undefined);

  // 2. Get single campaign details
  const {
    data: campaignResponse,
    isLoading: isDetailsLoading,
    error: detailsError,
    refetch,
  } = useGetCampaignByIdQuery(selectedCampaignId, {
    skip: !selectedCampaignId,
  });

  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateCampaignMutation();

  // State for modals
  const [isEditBasicOpen, setIsEditBasicOpen] = useState(false);
  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [isEditDeliveryOpen, setIsEditDeliveryOpen] = useState(false);
  const [isEditDonationOpen, setIsEditDonationOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [story, setStory] = useState("");

  const [allowLocalPickup, setAllowLocalPickup] = useState(false);
  const [allowLocalDelivery, setAllowLocalDelivery] = useState(false);
  const [allowShipping, setAllowShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState("");

  const [allowDonation, setAllowDonation] = useState(false);
  const [fundUsage, setFundUsage] = useState<string[]>([]);

  // Sync form states with campaign data
  const campaign = campaignResponse?.data;

  useEffect(() => {
    if (campaign) {
      setName(campaign.name || "");
      setGoalAmount(campaign.goalAmount ? String(campaign.goalAmount) : "");
      setDurationDays(
        campaign.durationDays ? String(campaign.durationDays) : "",
      );
      setThumbnailPreview(campaign.thumbnail || "");
      setStory(campaign.story || "");
      setAllowLocalPickup(!!campaign.allowLocalPickup);
      setAllowLocalDelivery(!!campaign.allowLocalDelivery);
      setAllowShipping(!!campaign.allowShipping);
      setShippingFee(campaign.shippingFee ? String(campaign.shippingFee) : "0");
      setAllowDonation(!!campaign.allowDonation);
      setFundUsage(campaign.fundUsage || []);
    }
  }, [campaign]);

  // Handle loading and error states for editing view
  if (selectedCampaignId && isDetailsLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-secondary" />
        <p className="text-sm text-muted-foreground">
          Loading campaign details...
        </p>
      </div>
    );
  }

  if (selectedCampaignId && detailsError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-rose-500">
          Failed to load campaign data.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setSelectedCampaignId(null)} variant="outline">
            Back to Drafts
          </Button>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Render drafts table view when no campaign is selected
  if (!selectedCampaignId) {
    if (isLoadingDrafts) {
      return (
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-secondary" />
          <p className="text-sm text-muted-foreground">
            Loading draft campaigns...
          </p>
        </div>
      );
    }

    if (draftsError) {
      const errMsg = (draftsError as any)?.data?.message || "";
      if (errMsg !== "No Draft campaign exists.") {
        return (
          <div className="flex h-96 flex-col items-center justify-center gap-3">
            <p className="text-lg font-semibold text-rose-500">{errMsg}</p>
          </div>
        );
      }
    }

    return (
      <div className="mx-auto max-w-[1180px] space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Draft Campaigns
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a draft campaign to continue setup and editing.
          </p>
        </div>

        <DashboardCard className="p-0 border border-slate-100 overflow-hidden bg-white shadow-sm">
          {draftCampaigns.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center text-center p-4 gap-4">
              <Package className="size-10 text-slate-300" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {(draftsError as any)?.data?.message ||
                    "No draft campaigns found."}
                </p>
              </div>
              <Link href="/campaign_1">
                <Button className="bg-secondary text-white hover:bg-secondary/90 transition-all duration-300 text-xs">
                  Create Campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Thumbnail</th>
                    <th className="px-5 py-4 font-semibold">Campaign Name</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Goal Amount</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {draftCampaigns.map((camp: any) => (
                    <tr
                      key={camp._id}
                      className="transition-colors duration-300 hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-4">
                        {camp.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={camp.thumbnail}
                            alt={camp.name}
                            className="size-12 rounded-lg object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="size-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon className="size-6" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {camp.name || "Unnamed"}
                      </td>
                      <td className="px-5 py-4 capitalize text-slate-600">
                        {(camp.campaignCategory || "physical_product").replace(
                          "_",
                          " ",
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        ${camp.goalAmount?.toLocaleString() || "0"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 capitalize">
                          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {camp.status || "draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          onClick={() => setSelectedCampaignId(camp._id)}
                          className="bg-secondary text-white text-xs hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Edit3 className="size-3.5" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCard>

        {draftCampaigns.length > 0 && draftCampaignId && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => {
                localStorage.setItem("campaignId", draftCampaignId);
                router.push("/campaign_4");
              }}
              className="bg-secondary text-white hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer py-2 px-5 font-semibold shadow-sm"
            >
              Launch Your Campaign &rarr;
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Handle updates
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append(
      "campaignCategory",
      campaign.campaignCategory || "physical_product",
    );
    formData.append("story", story);
    formData.append("goalAmount", goalAmount);
    formData.append("durationDays", durationDays);
    formData.append("allowLocalPickup", String(allowLocalPickup));
    formData.append("allowLocalDelivery", String(allowLocalDelivery));
    formData.append("allowShipping", String(allowShipping));
    formData.append("shippingFee", shippingFee);
    formData.append("allowDonation", String(allowDonation));

    fundUsage.forEach((item) => {
      formData.append("fundUsage", item);
    });

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      const res = await updateCampaign({
        campaignId: campaign._id,
        formData,
      }).unwrap();
      if (res.success) {
        toast.success(res.message || "Campaign updated successfully!");
        refetch();
      } else {
        toast.error(res.message || "Failed to update campaign.");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "An error occurred while updating the campaign.",
      );
    }
  };

  const copyCampaignLink = () => {
    if (campaign && campaign.campaignCode) {
      const link = `${window.location.origin}/order-summary?code=${campaign.campaignCode}`;
      navigator.clipboard.writeText(link);
      toast.success("Campaign link copied to clipboard!");
    } else {
      toast.error("Campaign link not available.");
    }
  };

  if (!campaign) return null;

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            onClick={() => setSelectedCampaignId(null)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline cursor-pointer bg-transparent border-none p-0 mb-1"
          >
            &larr; Back to Drafts
          </button>
          <h2 className="text-2xl font-semibold">Campaign Settings</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span>{campaign.name}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize">
              <span className="size-2 rounded-full bg-secondary" />
              {campaign.status}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="size-4 text-foreground" />
              {campaign.durationDays} Days Duration
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1.2fr_0.68fr]">
        {/* Campaign Health */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Heart className="size-5 fill-secondary text-secondary" />
            Campaign Health
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-2.5">
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={cn(
                    "size-4 fill-secondary text-white",
                    !campaign.thumbnail && "opacity-40",
                  )}
                />
                Photo Added
              </p>
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={cn(
                    "size-4 fill-secondary text-white",
                    !campaign.story && "opacity-40",
                  )}
                />
                Story Added
              </p>
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={cn(
                    "size-4 fill-secondary text-white",
                    (!campaign.products || campaign.products.length === 0) &&
                      "opacity-40",
                  )}
                />
                Product Added
              </p>
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={cn(
                    "size-4 fill-secondary text-white",
                    !campaign.allowShipping &&
                      !campaign.allowLocalPickup &&
                      !campaign.allowLocalDelivery &&
                      "opacity-40",
                  )}
                />
                Delivery Selected
              </p>
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={cn(
                    "size-4 fill-secondary text-white",
                    !campaign.allowDonation && "opacity-40",
                  )}
                />
                Donation Enabled
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto flex size-28 items-center justify-center rounded-full border-[10px] border-secondary">
                <div>
                  <p className="text-4xl font-semibold">
                    {Math.round(
                      (campaign.thumbnail ? 20 : 0) +
                        (campaign.story ? 20 : 0) +
                        (campaign.products && campaign.products.length > 0
                          ? 20
                          : 0) +
                        (campaign.allowShipping ||
                        campaign.allowLocalPickup ||
                        campaign.allowLocalDelivery
                          ? 20
                          : 0) +
                        (campaign.allowDonation ? 20 : 0),
                    )}
                  </p>
                  <p className="text-xs font-medium">/100</p>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Campaign Score
              </p>
              <div className="mt-1 flex justify-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Edit Campaign */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ClipboardEdit className="size-5" />
            Edit Campaign
          </h3>
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <Edit3 className="size-4 text-foreground" />
                Campaign Name
              </span>
              <span className="font-semibold truncate pr-2">{name}</span>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(true)}
                className="w-fit rounded-md border border-secondary px-3 py-1 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <Target className="size-4 text-foreground" />
                Fundraising Goal
              </span>
              <span className="font-semibold">
                ${Number(goalAmount || 0).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(true)}
                className="w-fit rounded-md border border-secondary px-3 py-1 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <CalendarDays className="size-4 text-foreground" />
                Campaign Length
              </span>
              <span className="font-semibold">{durationDays} Days</span>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(true)}
                className="w-fit rounded-md border border-secondary px-3 py-1 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <ImageIcon className="size-4 text-foreground" />
                Campaign Photo
              </span>
              <span className="font-semibold">
                {thumbnailPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailPreview}
                    alt="Campaign thumbnail"
                    className="size-12 rounded-md object-cover"
                  />
                ) : (
                  <Image
                    src={order}
                    alt="Fallback"
                    className="size-12 rounded-md object-cover"
                  />
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(true)}
                className="w-fit rounded-md border border-secondary px-3 py-1 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
              >
                Replace Photo
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* Campaign Performance */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ArrowUpRight className="size-4" />
            Campaign Performance
          </h3>
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-muted-foreground">
                <Heart className="size-4 text-rose-500" />
                Supporters
              </span>
              <span className="font-semibold">
                {campaign.totalSupporters || 0}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-muted-foreground">
                <Package className="size-4 text-primary" />
                Orders
              </span>
              <span className="font-semibold">{campaign.totalOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-muted-foreground">
                <Sparkles className="size-4 text-secondary" />
                Raised
              </span>
              <span className="font-semibold">
                ${campaign.raisedAmount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-muted-foreground">
                <Target className="size-4 text-violet-600" />
                Goal
              </span>
              <span className="font-semibold">
                {campaign.goalAmount
                  ? Math.round(
                      ((campaign.raisedAmount || 0) / campaign.goalAmount) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Image
              src={campaign.organizerProfileImage || user}
              alt="Organizer"
              width={100}
              height={100}
              className="size-12 rounded-full object-cover ring-2 ring-border"
            />
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-secondary"
                style={{
                  width: `${Math.min(
                    100,
                    campaign.goalAmount
                      ? Math.round(
                          ((campaign.raisedAmount || 0) / campaign.goalAmount) *
                            100,
                        )
                      : 0,
                  )}%`,
                }}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            ${campaign.raisedAmount || 0} of $
            {campaign.goalAmount?.toLocaleString() || "0"} goal
          </p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.78fr_0.9fr_1.1fr_0.78fr]">
        {/* Product Details */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Package className="size-5" />
            Product Details
          </h3>
          {campaign.products && campaign.products[0] ? (
            <div className="mt-4 flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.products[0].productImage || order.src}
                alt={campaign.products[0].name}
                className="size-16 rounded-md object-cover border border-border"
              />
              <div className="text-sm">
                <p className="font-semibold">Product</p>
                <p className="truncate max-w-[120px]">
                  {campaign.products[0].name}
                </p>
                <p className="mt-2 font-semibold">Price</p>
                <p>${campaign.products[0].price?.toFixed(2)}</p>
                <p className="mt-2 font-semibold">Shipping Fee</p>
                <p>
                  $
                  {campaign.shippingFee
                    ? Number(campaign.shippingFee).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground">
              No products added yet.
            </div>
          )}
          <Link
            href="/dashboard/products"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-semibold shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground w-full hover:-translate-y-0.5 cursor-pointer"
          >
            Manage Products
          </Link>
        </DashboardCard>

        {/* Delivery Options */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Truck className="size-5" />
            Delivery Options
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex gap-2 text-sm">
              <CheckCircle2
                className={cn(
                  "mt-0.5 size-4 shrink-0 fill-secondary text-white",
                  !allowLocalPickup && "opacity-20",
                )}
              />
              <div>
                <p className="font-semibold">Pickup</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Local pickup at a designated location
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <CheckCircle2
                className={cn(
                  "mt-0.5 size-4 shrink-0 fill-secondary text-white",
                  !allowLocalDelivery && "opacity-20",
                )}
              />
              <div>
                <p className="font-semibold">Local Delivery</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Delivered to local addresses
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <CheckCircle2
                className={cn(
                  "mt-0.5 size-4 shrink-0 fill-secondary text-white",
                  !allowShipping && "opacity-20",
                )}
              />
              <div>
                <p className="font-semibold">Shipping</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Shipped anywhere
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="rounded-md bg-secondary/10 px-3 py-2 text-center text-xs font-semibold text-secondary">
              Shipping Fee: $
              {shippingFee ? Number(shippingFee).toFixed(2) : "0.00"}
            </div>
            <button
              type="button"
              onClick={() => setIsEditDeliveryOpen(true)}
              className="rounded-md border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
            >
              Edit
            </button>
          </div>
        </DashboardCard>

        {/* Story Section */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ClipboardEdit className="size-5" />
            Story &amp; About Section
          </h3>
          <div className="mt-4 max-h-[160px] overflow-y-auto rounded-lg bg-[#f8ffff] p-4 text-sm leading-6 text-muted-foreground">
            <p className="whitespace-pre-line">
              {story || "No story added yet."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditStoryOpen(true)}
            className="mx-auto mt-4 flex text-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <Edit3 className="size-4 mr-1.5" />
            Edit Story
          </Button>
        </DashboardCard>

        {/* Donation Settings */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Heart className="size-5 fill-rose-500 text-rose-500" />
            Donation Settings
          </h3>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-secondary">
              Donations Enabled
            </p>
            <span
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                allowDonation ? "bg-secondary" : "bg-gray-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  allowDonation ? "translate-x-5" : "translate-x-0",
                )}
              />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Fund Usage Goals:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto">
              {fundUsage && fundUsage.length > 0 ? (
                fundUsage.map((usage: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary"
                  >
                    {usage}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  None specified
                </span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDonationOpen(true)}
            className="mt-5 w-full text-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            Edit Donation Settings
          </Button>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.2fr_1fr]">
        {/* Campaign Visibility */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Globe2 className="size-5 text-secondary" />
            Campaign Status Info
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex w-full items-start gap-3 rounded-md border border-secondary bg-secondary/5 p-3 text-left">
              <span className="mt-0.5 size-4 rounded-full border border-secondary bg-secondary" />
              <span>
                <span className="block text-sm font-semibold capitalize">
                  {campaign.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {campaign.status === "draft"
                    ? "This campaign is in draft. Complete all sections to launch it."
                    : "This campaign is pending review and approval."}
                </span>
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Zap className="size-5 text-secondary" />
            Quick Actions
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyCampaignLink}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-secondary text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-white hover:shadow-sm text-xs font-semibold cursor-pointer"
            >
              <Copy className="size-4" />
              Copy Campaign Link
            </button>
            <button
              type="button"
              onClick={() => {
                if (campaign.organizerEmail) {
                  window.location.href = `mailto:${campaign.organizerEmail}?subject=Campaign%20Update:%20${encodeURIComponent(campaign.name)}`;
                } else {
                  toast.error("Organizer email not found.");
                }
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-primary text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-sm text-xs font-semibold cursor-pointer"
            >
              <Mail className="size-4" />
              Email Supporters
            </button>
          </div>
        </DashboardCard>

        {/* Campaign Management */}
        <DashboardCard>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="size-5 text-secondary" />
            Campaign Management
          </h3>
          <div className="mt-5 space-y-3">
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
              Only live/active campaigns can be paused or ended. This campaign
              is currently in <strong>{campaign.status}</strong> status.
            </div>
          </div>
        </DashboardCard>
      </section>

      {/* Global Save Changes CTA */}
      <div className="flex justify-end pt-4 border-t border-border mt-4">
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-secondary text-white hover:bg-secondary/90 transition-all duration-300 h-11 px-6 font-semibold cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Saving Changes...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}

      {/* 1. EDIT BASIC INFO MODAL */}
      <Dialog.Root open={isEditBasicOpen} onOpenChange={setIsEditBasicOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditBasicOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Campaign Details
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    Update the campaign name, goal, length, and photo.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary cursor-pointer">
                  <X className="size-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Campaign Name</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter campaign name"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Goal Amount ($)
                    </label>
                    <Input
                      required
                      type="number"
                      min="1"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Duration (Days)
                    </label>
                    <Input
                      required
                      type="number"
                      min="1"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      placeholder="e.g. 7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Campaign Photo / Thumbnail
                  </label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="size-20 rounded-md object-cover border border-border"
                      />
                    )}
                    <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-4 hover:bg-slate-100 transition-colors duration-300">
                      <UploadCloud className="size-6 text-slate-500" />
                      <span className="mt-1 text-xs text-slate-600 font-medium">
                        Click to select photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setThumbnailFile(file);
                            setThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="size-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 2. EDIT STORY MODAL */}
      <Dialog.Root open={isEditStoryOpen} onOpenChange={setIsEditStoryOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditStoryOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Campaign Story
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    Describe your campaign to inspire supporters.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary cursor-pointer">
                  <X className="size-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Your Story</label>
                  <Textarea
                    required
                    rows={8}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Tell your story here..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="size-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 3. EDIT DELIVERY OPTIONS MODAL */}
      <Dialog.Root
        open={isEditDeliveryOpen}
        onOpenChange={setIsEditDeliveryOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditDeliveryOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Delivery Options
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    Select how products will be delivered and set shipping fees.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary cursor-pointer">
                  <X className="size-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowLocalPickup}
                      onChange={(e) => setAllowLocalPickup(e.target.checked)}
                      className="size-4 text-secondary accent-secondary"
                    />
                    <div>
                      <span className="block text-sm font-semibold">
                        Allow Local Pickup
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Customers can pick up the products locally.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowLocalDelivery}
                      onChange={(e) => setAllowLocalDelivery(e.target.checked)}
                      className="size-4 text-secondary accent-secondary"
                    />
                    <div>
                      <span className="block text-sm font-semibold">
                        Allow Local Delivery
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Offer delivery to local addresses.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowShipping}
                      onChange={(e) => setAllowShipping(e.target.checked)}
                      className="size-4 text-secondary accent-secondary"
                    />
                    <div>
                      <span className="block text-sm font-semibold">
                        Allow Shipping
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ship products to any location.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Shipping Fee ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    placeholder="e.g. 8.00"
                    disabled={!allowShipping}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="size-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 4. EDIT DONATION & FUND USAGE MODAL */}
      <Dialog.Root
        open={isEditDonationOpen}
        onOpenChange={setIsEditDonationOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditDonationOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Donation &amp; Fund Usage
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    Configure donations and select where the raised funds will
                    be allocated.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary cursor-pointer">
                  <X className="size-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-4 p-5">
                <label className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDonation}
                    onChange={(e) => setAllowDonation(e.target.checked)}
                    className="size-4 text-secondary accent-secondary"
                  />
                  <div>
                    <span className="block text-sm font-semibold">
                      Enable Donations
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Allow supporters to donate directly to the campaign.
                    </span>
                  </div>
                </label>

                <div className="space-y-2">
                  <label className="text-sm font-semibold block">
                    Fund Allocation Purposes
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Select all options that apply:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {defaultPurposes.map((purpose) => {
                      const isSelected = fundUsage.includes(purpose);
                      return (
                        <button
                          key={purpose}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFundUsage(
                                fundUsage.filter((item) => item !== purpose),
                              );
                            } else {
                              setFundUsage([...fundUsage, purpose]);
                            }
                          }}
                          className={cn(
                            "flex items-center justify-between rounded-md border p-2.5 text-left text-xs font-semibold transition-all duration-300 cursor-pointer",
                            isSelected
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700",
                          )}
                        >
                          {purpose}
                          {isSelected && (
                            <CheckCircle2 className="size-4 fill-secondary text-white shrink-0 ml-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="gap-2 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="size-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
