"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Clock3,
  Heart,
  Target,
  Upload,
} from "lucide-react";
import hero from "@/assets/hero.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = ["Your Campaign", "Your Story", "Details", "Preview"] as const;
const amounts = [500, 1000, 2500, 5000] as const;

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

export default function CampaignOnePage() {
  const router = useRouter();
  const token = useSelector(userCurrentToken);

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !localToken) {
      toast.error("Please log in first to start a campaign.");
      router.push("/login");
    }
  }, [token, router]);

  const { draft, updateDraft } = useCampaignDraft();
  const [customAmount, setCustomAmount] = useState("");
  const [fileError, setFileError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedAmount = amounts.includes(draft.goalAmount as any) ? (draft.goalAmount as number | "custom") : "custom";

  useEffect(() => {
    if (selectedAmount === "custom" && draft.goalAmount > 0) {
      setCustomAmount(draft.goalAmount.toString());
    }
  }, [selectedAmount, draft.goalAmount]);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFileError("Choose a JPG, PNG, or WEBP image under 5 MB.");
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    updateDraft({
      thumbnail: file,
      thumbnailPreview: objectUrl,
    });
    setFileError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      selectedAmount === "custom" &&
      (!customAmount || Number(customAmount) < 1)
    )
      return;
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
                  className={`h-12 rounded-md border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm sm:col-span-2 ${selectedAmount === "custom" ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-400 bg-white"}`}
                >
                  Custom Amount
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
                      placeholder="Enter custom amount"
                      className="h-12 w-full rounded-md border border-slate-400 px-4 text-lg outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                ) : null}
              </div>
            </div>
          </section>

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
