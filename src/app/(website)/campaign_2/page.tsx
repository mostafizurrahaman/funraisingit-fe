"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Heart,
  Lightbulb,
  LockKeyhole,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import hero from "@/assets/hero.png";
import user from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const steps = ["Your Campaign", "Your Story", "Details", "Preview"] as const;
const purposes = ["Ingredients", "Packaging", "Inventory", "Equipment", "Marketing", "Supplies", "School Program", "Sports Team", "Other"] as const;

const initialStory = `Hi everyone! My name is Jenna and I’m raising money to launch Jenna’s Banana Pudding.

Your support will help me purchase ingredients, package, and supplies so I can grow my business and bring my homemade desserts to more customers.

Thank you for believing in me!`;

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { useCampaignDraft } from "@/Providers/CampaignDraftProvider";
import { useCreateCampaignMutation } from "@/redux/features/campaign/campaignApi";

export default function CampaignTwoPage() {
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
  const story = draft.story || initialStory;
  const selectedPurposes = draft.fundUsage;
  const donationChoice = draft.allowDonation ? "allow" : "purchase";
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();

  function togglePurpose(purpose: string) {
    const nextPurposes = selectedPurposes.includes(purpose)
      ? selectedPurposes.filter((item) => item !== purpose)
      : [...selectedPurposes, purpose];
    updateDraft({ fundUsage: nextPurposes });
  }

  function generateStory() {
    setIsGenerating(true);
    window.setTimeout(() => {
      updateDraft({ story: initialStory });
      setIsGenerating(false);
      setError("");
    }, 500);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (story.trim().length < 50) {
      setError("Please tell supporters a little more about your campaign.");
      return;
    }
    if (!selectedPurposes.length) {
      setError("Select at least one way the money will be used.");
      return;
    }
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", draft.name || "Help Build a Community Library");
      formData.append("campaignCategory", "physical_product");
      formData.append("story", story);
      
      // Append fundUsage values
      if (selectedPurposes.length > 0) {
        selectedPurposes.forEach((item) => {
          formData.append("fundUsage", item);
        });
      } else {
        formData.append("fundUsage", "General Funding");
      }

      formData.append("goalAmount", String(draft.goalAmount));
      formData.append("durationDays", String(draft.durationDays));
      formData.append("allowLocalPickup", String(draft.allowLocalPickup));
      formData.append("allowLocalDelivery", String(draft.allowLocalDelivery));
      formData.append("allowShipping", String(draft.allowShipping));
      formData.append("allowDonation", String(draft.allowDonation));
      formData.append("shippingFee", String(draft.allowShipping ? draft.shippingFee : 0));
      
      if (draft.thumbnail) {
        formData.append("thumbnail", draft.thumbnail);
      }

      const response = await createCampaign(formData).unwrap();
      toast.success(response?.message || "Campaign created successfully!");
      const campaignId = response?.data?._id || response?.data?.id;
      if (campaignId) {
        updateDraft({ id: campaignId, story });
        localStorage.setItem("campaignId", campaignId);
        router.push("/campaign_3");
      } else {
        toast.error("Could not retrieve created Campaign ID.");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || "Failed to create campaign. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  }

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <ol aria-label="Campaign creation progress" className="mx-auto flex max-w-3xl items-start">
          {steps.map((step, index) => {
            const complete = index === 0;
            const active = index === 1;
            return (
              <li key={step} className={`relative flex flex-1 flex-col items-center text-center ${index < steps.length - 1 ? `after:absolute after:left-1/2 after:top-5 after:-z-0 after:h-px after:w-full ${index === 0 ? "after:bg-primary" : "after:bg-slate-400"}` : ""}`}>
                <span className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-base font-semibold ${complete ? "border-secondary bg-secondary text-white" : active ? "border-primary bg-primary text-white" : "border-slate-500 bg-white text-foreground"}`}>
                  {complete ? <Check className="size-5" /> : index + 1}
                </span>
                <span className={`relative z-10 mt-3 bg-white px-2 text-sm font-medium sm:text-base ${complete ? "text-secondary" : active ? "text-primary" : "text-foreground"}`}>{step}</span>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-14 grid w-full max-w-6xl items-start gap-10 lg:mt-20 lg:grid-cols-[1.3fr_0.8fr] xl:gap-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <header>
              <span className="inline-flex bg-secondary/10 px-3 py-1.5 text-base font-medium text-secondary">Step 2 of 4</span>
              <h1 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight text-black">Tell Your Story</h1>
              <p className="mt-4 text-lg leading-7 text-muted-foreground">People support people, not just products.<br />Tell supporters why you’re raising money and how their support will help.</p>
            </header>

            <section>
              <label htmlFor="story" className="mb-2 block text-lg font-semibold">Your Story</label>
              <Textarea id="story" value={story} onChange={(event) => { updateDraft({ story: event.target.value.slice(0, 5000) }); setError(""); }} rows={9} aria-invalid={Boolean(error)} />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{story.length}/5,000 characters</span>
                <Button type="button" variant="outline" onClick={generateStory} disabled={isGenerating} className="border-secondary text-secondary">
                  <Sparkles className={`size-4 ${isGenerating ? "animate-pulse" : ""}`} />
                  {isGenerating ? "Generating..." : "Generate My Story"}
                </Button>
              </div>
            </section>

            <section className="rounded-lg border border-slate-400 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">What Will The Money Be Used For?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {purposes.map((purpose) => {
                  const selected = selectedPurposes.includes(purpose);
                  return <button key={purpose} type="button" role="checkbox" aria-checked={selected} onClick={() => togglePurpose(purpose)} className={`flex min-h-11 items-center gap-2 rounded-md border px-3 text-left text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary ${selected ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-300 bg-white"}`}><span className={`flex size-4 shrink-0 items-center justify-center rounded border ${selected ? "border-secondary bg-secondary text-white" : "border-slate-400"}`}>{selected ? <Check className="size-3" /> : null}</span>{purpose}</button>;
                })}
              </div>
            </section>

            <section className="rounded-lg border border-slate-400 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Allow Donations?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Supporters can donate without purchasing.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => updateDraft({ allowDonation: true })} className={`flex min-h-12 items-center gap-3 rounded-md border px-4 text-left text-sm transition-all duration-300 hover:border-secondary ${donationChoice === "allow" ? "border-secondary bg-secondary/10" : "border-slate-300"}`}><span className={`size-4 rounded-full border-4 ${donationChoice === "allow" ? "border-secondary" : "border-slate-300"}`} />Yes, allow donations</button>
                <button type="button" onClick={() => updateDraft({ allowDonation: false })} className={`flex min-h-12 items-center gap-3 rounded-md border px-4 text-left text-sm transition-all duration-300 hover:border-secondary ${donationChoice === "purchase" ? "border-secondary bg-secondary/10" : "border-slate-300"}`}><span className={`size-4 rounded-full border-4 ${donationChoice === "purchase" ? "border-secondary" : "border-slate-300"}`} />No, purchase only</button>
              </div>
            </section>

            <section className="rounded-lg border border-slate-400 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Donation Preview</h2>
              <p className="mt-1 text-sm text-muted-foreground">Supporters will see:</p>
              <div className="mt-5 flex flex-col items-center gap-5 rounded-lg border border-secondary bg-secondary/10 p-5 sm:flex-row">
                <div className="relative flex size-20 shrink-0 items-center justify-center text-secondary"><Heart className="absolute right-1 top-0 size-7 fill-red-400 text-red-400" /><Heart className="size-12" /></div>
                <div className="flex-1 text-center sm:text-left"><p className="text-lg font-semibold">Support This Campaign</p><p className="mt-1 text-sm text-muted-foreground">Can’t purchase today? You can still support Jenna’s Banana Pudding with a donation.</p></div>
                <Button type="button" size="sm" className="shrink-0"><Heart className="size-4" />Donate</Button>
              </div>
            </section>

            {error ? <p role="alert" className="text-lg text-red-600">{error}</p> : null}
            <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => router.push("/campaign_1")} className="border-secondary text-secondary"><ArrowLeft className="size-4" />Back</Button>
              <Button type="submit" disabled={isCreating} className="w-full sm:w-56">{isCreating ? "Saving..." : "Continue"}<ArrowRight className="size-4" /></Button>
            </div>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4" />Your progress is saved automatically</p>
          </form>

          <aside className="rounded-lg border border-slate-400 p-5 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Eye className="size-5 text-secondary" />Live Preview</h2>
            <Image src={hero} alt="Banana pudding campaign preview" className="mt-4 aspect-[1.55/1] w-full rounded-lg object-cover object-right" />
            <div className="mt-4 flex items-center gap-3"><Image src={user} alt="Jenna" className="size-12 rounded-full object-cover" /><div><h3 className="text-lg font-semibold leading-5">Jenna’s<br />Banana Pudding</h3></div></div>
            <p className="mt-5 text-sm font-medium text-secondary">Goal: $2,500</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15"><div className="h-full w-[3%] rounded-full bg-secondary" /></div>
            <div className="mt-2 flex justify-between text-xs"><span>$80 Raised</span><span>0 Supporters</span></div>
            <h3 className="mt-5 text-lg font-semibold">About This Campaign</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{story}</p>
            <div className="mt-5 space-y-3"><Button type="button" className="w-full"><ShoppingCart className="size-4" />Buy Banana Pudding</Button><Button type="button" variant="outline" className="w-full"><Heart className="size-4" />Donate</Button></div>
            <div className="mt-5 rounded-lg border border-secondary bg-secondary/10 p-4"><h3 className="flex items-center gap-2 text-lg font-semibold text-secondary"><Lightbulb className="size-5" />Helpful Tip</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Campaigns with a personal story often receive more support.</p><ul className="mt-3 space-y-2 text-sm">{["Why you’re raising money", "What you’re selling", "What the money will help you accomplish"].map((tip) => <li key={tip} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-secondary" />{tip}</li>)}</ul></div>
          </aside>
        </div>
        <p className="mx-auto mt-6 flex max-w-6xl items-center justify-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4 text-secondary" />Step 2 takes only a few minutes</p>
      </div>
    </main>
  );
}
