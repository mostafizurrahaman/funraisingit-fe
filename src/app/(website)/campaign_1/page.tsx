"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useTransition,
  Suspense,
} from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Clock3,
  Heart,
  Target,
  Upload,
  Calendar,
  Truck,
  MapPin,
  Package,
  Check,
  DollarSign,
  Tag,
} from "lucide-react";
import hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = ["Your Campaign", "Your Story", "Details", "Preview"] as const;
const amounts = [500, 1000, 2500, 5000] as const;
const durations = [2, 3, 5, 7] as const;
const shippingAmounts = [5, 8, 10] as const;

const examples = [
  ["Jenny’s Banana Pudding", "Mike’s Custom Tees"],
  ["Rollie Republic Cinnamon Rolls", "Dayton Youth Football"],
  ["Sarah’s Candle Company", "Help Emma Start Her Business"],
  ["Glam Beauty Bar"],
] as const;

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { useCampaignDraft } from "@/Providers/CampaignDraftProvider";


function CampaignOneForm() {
  const router = useRouter();
  const token = useSelector(userCurrentToken);
  const { draft, updateDraft } = useCampaignDraft();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("campaignCategory");

  const [isCategoryInitialized, setIsCategoryInitialized] = useState(false);

  useEffect(() => {
    if (categoryParam && !isCategoryInitialized) {
      updateDraft({ campaignCategory: categoryParam });
      setIsCategoryInitialized(true);
    }
  }, [categoryParam, isCategoryInitialized, updateDraft]);

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !localToken) {
      toast.error("Please log in first to start a campaign.");
      router.push("/login");
    }
  }, [token, router]);

  const [customAmount, setCustomAmount] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedAmount = amounts.includes(draft.goalAmount as any) ? (draft.goalAmount as number | "custom") : "custom";
  const selectedShippingAmount = shippingAmounts.includes(draft.shippingFee as any) ? (draft.shippingFee as number | "custom") : "custom";
  const [customShipping, setCustomShipping] = useState("");

  useEffect(() => {
    if (selectedAmount === "custom" && draft.goalAmount > 0) {
      setCustomAmount(draft.goalAmount.toString());
    }
  }, [selectedAmount, draft.goalAmount]);

  useEffect(() => {
    if (selectedShippingAmount === "custom" && draft.shippingFee > 0) {
      setCustomShipping(draft.shippingFee.toString());
    }
  }, [selectedShippingAmount, draft.shippingFee]);

  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_DIM = 1200;
          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  resolve(file);
                }
              },
              "image/jpeg",
              0.75
            );
          } else {
            resolve(file);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    try {
      setFileError("Compressing image...");
      const processedFile = await compressImage(file);
      const objectUrl = URL.createObjectURL(processedFile);
      updateDraft({
        thumbnail: processedFile,
        thumbnailPreview: objectUrl,
      });
      setFileError("");
    } catch (e) {
      console.error(e);
      const objectUrl = URL.createObjectURL(file);
      updateDraft({
        thumbnail: file,
        thumbnailPreview: objectUrl,
      });
      setFileError("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // 1. Campaign Name Validation
    if (!draft.name || draft.name.trim().length < 3) {
      setError("Campaign name must be at least 3 characters long.");
      return;
    }

    // 2. Campaign Category Validation
    if (!draft.campaignCategory) {
      setError("Please select a campaign category.");
      return;
    }

    // 3. Campaign Photo Validation
    if (!draft.thumbnail && !draft.thumbnailPreview) {
      setError("Campaign photo is required. Please upload an image.");
      return;
    }

    // 4. Goal Amount Validation
    if (selectedAmount === "custom") {
      if (!customAmount || Number(customAmount) < 1) {
        setError("Please enter a custom goal amount of at least $1.");
        return;
      }
    } else {
      if (!draft.goalAmount || draft.goalAmount < 1) {
        setError("Please select a valid goal amount.");
        return;
      }
    }

    // 5. Campaign Length Validation
    if (!draft.durationDays || draft.durationDays <= 0) {
      setError("Please select a campaign duration.");
      return;
    }

    // 6. Delivery Options Validation (At least one must be selected)
    if (!draft.allowLocalPickup && !draft.allowLocalDelivery && !draft.allowShipping) {
      setError("Please select at least one delivery option (Local Pickup, Local Delivery, or Shipping).");
      return;
    }

    // 7. Shipping Fee Validation
    if (draft.allowShipping) {
      if (selectedShippingAmount === "custom") {
        if (customShipping === "" || Number(customShipping) < 0) {
          setError("Please enter a valid shipping fee.");
          return;
        }
      }
    }

    startTransition(() => router.push("/campaign_2"));
  }

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <ol
          aria-label="Campaign creation progress"
          className="mx-auto flex max-w-3xl items-start"
        >
          {steps.map((step, index) => (
            <li
              key={step}
              className={`relative flex flex-1 flex-col items-center text-center ${index < steps.length - 1 ? "after:absolute after:left-1/2 after:top-5 after:-z-0 after:h-px after:w-full after:bg-slate-400" : ""}`}
            >
              <span
                className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-base font-semibold ${index === 0 ? "border-secondary bg-secondary text-white" : "border-slate-500 bg-white text-foreground"}`}
              >
                {index + 1}
              </span>
              <span
                className={`relative z-10 mt-3 bg-white px-2 text-sm font-medium sm:text-base ${index === 0 ? "text-secondary" : "text-foreground"}`}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        <section className="mt-14 grid items-center gap-8 md:grid-cols-[1fr_0.9fr] lg:mt-20 lg:gap-20">
          <div>
            <span className="inline-flex bg-secondary/10 px-3 py-1.5 text-base font-medium text-secondary">
              Step 1 of 4
            </span>
            <h1 className="mt-5 max-w-md text-[32px] font-semibold leading-tight tracking-tight text-black">
              Let’s start your campaign!
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-7 text-muted-foreground">
              Tell us a few basic about your campaign so we can help you get
              started.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg">
            <Image
              src={hero}
              alt="Banana pudding fundraising campaign"
              className="aspect-[1.55/1] h-auto w-full object-cover object-right"
              sizes="(max-width: 768px) 90vw, 40vw"
              priority
            />
            <Heart
              className="absolute right-4 top-4 size-8 rotate-[-12deg] fill-white text-secondary drop-shadow"
              aria-hidden="true"
            />
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-14 space-y-12 lg:mt-16">
          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr]">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <BriefcaseBusiness className="size-10" />
            </span>
            <div className="w-full">
              <h2 className="text-[32px] font-semibold leading-tight">
                Campaign Name
              </h2>
              <p className="mt-2 text-lg leading-7 text-muted-foreground">
                Give your campaign a name supporters will recognize.
              </p>
              <Input
                name="campaignName"
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                required
                minLength={3}
                placeholder="Example: Jenny’s Banana Pudding"
                className="mt-4"
              />
              <p className="mt-5 text-lg font-medium">Examples:</p>
              <div className="mt-3 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {examples
                  .flatMap((row) => row)
                  .map((example, index) => (
                    <p
                      key={example}
                      className="flex items-center gap-2 text-lg text-foreground"
                    >
                      <span className="text-secondary">
                        {index % 3 === 0 ? "♨" : index % 3 === 1 ? "♙" : "♧"}
                      </span>
                      {example}
                    </p>
                  ))}
              </div>
              <p className="mt-5 flex items-start gap-2 text-lg leading-7 text-muted-foreground">
                <span className="text-secondary">✧</span>
                <span>
                  <strong className="font-medium text-secondary">Tips:</strong>{" "}
                  Use your business name, fundraiser name, or organization name.
                </span>
              </p>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr] ">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Tag className="size-10 " />
            </span>
            <div className="w-full ">
              <h2 className="text-[32px] font-semibold leading-tight">
                Campaign Category
              </h2>
              <p className="mt-2 text-lg leading-7 text-muted-foreground">
                Select the category that best fits your campaign.
              </p>
              <select
                id="campaignCategory"
                value={draft.campaignCategory || "business"}
                onChange={(event) => {
                  updateDraft({
                    campaignCategory: event.target.value,
                  });
                }}
                className="mt-4 w-full h-12 rounded-md border border-slate-800  px-4 text-base  text-foreground outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              >
                <option value="business">Launch a Business</option>
                <option value="school_fundraiser">School Fundraiser</option>
                <option value="church_campaign">Church Campaign</option>
                <option value="sports_team">Sports Team</option>
                <option value="products_pre_orders">Products & Pre-Orders</option>
                <option value="events_tickets">Events & Tickets</option>
                <option value="digital_products">Digital Products</option>
                <option value="community_nonprofit">Community & Nonprofits</option>
              </select>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr]">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Camera className="size-10" />
            </span>
            <div className="grid w-full gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  Upload Campaign Photo
                </h2>
                <p className="mt-1 max-w-sm text-lg leading-7 text-muted-foreground">
                  Add a photo that represent your product, business, or cause
                </p>
              </div>
              <div>
                <label className="group relative flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-secondary bg-secondary/10 p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/15 hover:shadow-md">
                  {draft.thumbnailPreview ? (
                    <Image
                      src={draft.thumbnailPreview}
                      alt="Campaign upload preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <span className="relative">
                        <Camera className="size-11 text-secondary" />
                        <Upload className="absolute -bottom-1 -right-1 size-5 rounded-full bg-white p-0.5 text-secondary" />
                      </span>
                      <span className="mt-3 text-lg font-semibold text-secondary">
                        Upload Photo
                      </span>
                      <span className="mt-2 text-sm text-muted-foreground">
                        JPG, PNG, or WEBP
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground">
                        Recommended size: 1200×800
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhoto}
                    className="sr-only"
                  />
                </label>
                {fileError ? (
                  <p role="alert" className="mt-2 text-lg text-red-600">
                    {fileError}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr]">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Target className="size-10" />
            </span>
            <div className="grid w-full gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="max-w-sm text-[32px] font-semibold leading-tight">
                  How much would you like to raise?
                </h2>
                <p className="mt-2 max-w-sm text-lg leading-7 text-muted-foreground">
                  This helps you stay focused and motivated.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => updateDraft({ goalAmount: amount })}
                    className={`relative h-12 rounded-md border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm ${selectedAmount === amount ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-400 bg-white"}`}
                  >
                    ${amount.toLocaleString()}
                    {amount === 2500 && selectedAmount === amount ? (
                      <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-secondary" />
                    ) : null}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updateDraft({ goalAmount: 0 })}
                  className={`h-12 px-1 rounded-md border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm sm:col-span-2 ${selectedAmount === "custom" ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-400 bg-white"}`}
                >
                  Custom 
                </button>
                {selectedAmount === "custom" ? (
                  <label className="col-span-full">
                    <span className="sr-only">Custom campaign amount</span>
                    <Input
                      type="number"
                      min="1"
                      required
                      value={customAmount}
                      onChange={(event) => {
                        setCustomAmount(event.target.value);
                        updateDraft({ goalAmount: Number(event.target.value) || 0 });
                      }}
                      placeholder="Enter custom amount "
                      className="h-12 w-full rounded-md border border-slate-400 px-4 text-lg outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                ) : null}
              </div>
            </div>
          </section>

          {/* Campaign Length */}
          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr]">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Calendar className="size-10" />
            </span>
            <div className="grid w-full gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  Campaign Length
                </h2>
                <p className="mt-2 text-lg leading-7 text-muted-foreground">
                  How long should your fundraiser run?
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {durations.map((duration) => {
                  const label = duration === 7 ? "7 days" : `${duration} Days`;
                  const isSelected = draft.durationDays === duration;
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => updateDraft({ durationDays: duration })}
                      className={`relative min-w-[100px] px-6 h-12 rounded-xl border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm ${
                        isSelected
                          ? "border-secondary bg-white text-secondary"
                          : "border-slate-400 bg-white text-foreground"
                      }`}
                    >
                      {label}
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Customer Delivery Options */}
          <section className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr]">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Truck className="size-10" />
            </span>
            <div className="grid w-full gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  How will customers receive products?
                </h2>
                <p className="mt-2 text-lg leading-7 text-muted-foreground">
                  Choose all that apply. You can offer more than one option.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Local Pickup */}
                <button
                  type="button"
                  onClick={() =>
                    updateDraft({ allowLocalPickup: !draft.allowLocalPickup })
                  }
                  className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
                    draft.allowLocalPickup
                      ? "border-secondary bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="size-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        Local Pickup
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Customers pick up in person
                      </p>
                    </div>
                  </div>
                  {draft.allowLocalPickup && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  )}
                </button>

                {/* Local Delivery */}
                <button
                  type="button"
                  onClick={() =>
                    updateDraft({
                      allowLocalDelivery: !draft.allowLocalDelivery,
                    })
                  }
                  className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
                    draft.allowLocalDelivery
                      ? "border-secondary bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Truck className="size-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        Local Delivery
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your Deliver locally
                      </p>
                    </div>
                  </div>
                  {draft.allowLocalDelivery && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  )}
                </button>

                {/* Shipping */}
                <button
                  type="button"
                  onClick={() =>
                    updateDraft({ allowShipping: !draft.allowShipping })
                  }
                  className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
                    draft.allowShipping
                      ? "border-secondary bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Package className="size-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        Shipping
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We ship to supporters
                      </p>
                    </div>
                  </div>
                  {draft.allowShipping && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Shipping Fee */}
          <section
            className={`mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-[80px_1fr] transition-all duration-300 ${
              !draft.allowShipping ? "opacity-50" : ""
            }`}
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <DollarSign className="size-10" />
            </span>
            <div className="grid w-full gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  3. Shipping Fee <span className="text-lg font-normal text-muted-foreground">(Only applies if shipping is selected)</span>
                </h2>
                <p className="mt-2 text-lg leading-7 text-muted-foreground">
                  How much will you charge for shipping?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {shippingAmounts.map((amount) => {
                  const isSelected =
                    draft.allowShipping &&
                    selectedShippingAmount === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      disabled={!draft.allowShipping}
                      onClick={() => updateDraft({ shippingFee: amount })}
                      className={`relative h-12 rounded-xl border text-lg font-medium transition-all duration-300 ${
                        draft.allowShipping
                          ? "hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm cursor-pointer"
                          : "cursor-not-allowed"
                      } ${
                        isSelected
                          ? "border-secondary bg-white text-secondary"
                          : "border-slate-400 bg-white text-foreground"
                      }`}
                    >
                      ${amount}
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={!draft.allowShipping}
                  onClick={() => updateDraft({ shippingFee: 0 })}
                  className={`relative h-12 rounded-xl border text-lg font-medium transition-all duration-300 sm:col-span-2 ${
                    draft.allowShipping
                      ? "hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm cursor-pointer"
                      : "cursor-not-allowed"
                  } ${
                    draft.allowShipping && selectedShippingAmount === "custom"
                      ? "border-secondary bg-white text-secondary"
                      : "border-slate-400 bg-white text-foreground"
                  }`}
                >
                  Custom
                  {draft.allowShipping && selectedShippingAmount === "custom" && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-secondary text-white border border-white">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  )}
                </button>
                {draft.allowShipping && selectedShippingAmount === "custom" ? (
                  <label className="col-span-full">
                    <span className="sr-only">Custom shipping fee amount</span>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={customShipping}
                      onChange={(event) => {
                        setCustomShipping(event.target.value);
                        updateDraft({
                          shippingFee: Number(event.target.value) || 0,
                        });
                      }}
                      placeholder="Enter custom shipping fee"
                      className="h-12 w-full rounded-md border border-slate-400 px-4 text-lg outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                ) : null}
              </div>
            </div>
          </section>

          {error ? (
            <p role="alert" className="text-lg text-red-600 text-center mb-4 font-semibold">
              {error}
            </p>
          ) : null}
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-lg"
            >
              {isPending ? "Saving..." : "Continue"}
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 flex items-center gap-2 text-lg text-muted-foreground">
              <Clock3 className="size-5 text-secondary" />
              Takes less then 2 minutes
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CampaignOnePage() {
  return (
    <Suspense fallback={
      <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          <p className="text-muted-foreground font-medium">Loading campaign details...</p>
        </div>
      </main>
    }>
      <CampaignOneForm />
    </Suspense>
  );
}
