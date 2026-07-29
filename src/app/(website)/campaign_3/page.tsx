"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  DollarSign,
  Eye,
  Gift,
  Heart,
  LockKeyhole,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import hero from "@/assets/hero.png";
import user from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = ["Your Campaign", "Your Story", "Details", "Preview"] as const;
const prices = [5, 10, 15, 20] as const;
const durations = [2, 3, 5, 7] as const;
const shippingFees = [5, 8, 10] as const;

const deliveryOptions = [
  { id: "pickup", title: "Local Pickup", detail: "Customers pick up in person", icon: Store },
  { id: "delivery", title: "Local Delivery", detail: "You deliver locally", icon: Truck },
  { id: "shipping", title: "Shipping", detail: "We ship to supporters", icon: PackageCheck },
] as const;

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { useCampaignDraft } from "@/Providers/CampaignDraftProvider";

export default function CampaignThreePage() {
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
  
  const productName = draft.productName || "Banana Pudding";
  const price = prices.includes(draft.price as any) ? (draft.price as number | "custom") : "custom";
  const [customPrice, setCustomPrice] = useState("");
  const duration = draft.durationDays;
  
  const delivery: string[] = [];
  if (draft.allowLocalPickup) delivery.push("pickup");
  if (draft.allowLocalDelivery) delivery.push("delivery");
  if (draft.allowShipping) delivery.push("shipping");

  const shippingFee = shippingFees.includes(draft.shippingFee as any) ? (draft.shippingFee as number | "custom") : "custom";
  const [customShipping, setCustomShipping] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const displayPrice = price === "custom" ? Number(customPrice || 0) : price;
  const displayShipping = shippingFee === "custom" ? Number(customShipping || 0) : shippingFee;

  useEffect(() => {
    if (price === "custom" && draft.price > 0) {
      setCustomPrice(draft.price.toString());
    }
  }, [price, draft.price]);

  useEffect(() => {
    if (shippingFee === "custom" && draft.shippingFee > 0) {
      setCustomShipping(draft.shippingFee.toString());
    }
  }, [shippingFee, draft.shippingFee]);

  function toggleDelivery(id: string) {
    if (id === "pickup") updateDraft({ allowLocalPickup: !draft.allowLocalPickup });
    if (id === "delivery") updateDraft({ allowLocalDelivery: !draft.allowLocalDelivery });
    if (id === "shipping") updateDraft({ allowShipping: !draft.allowShipping });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productName.trim()) return setError("Enter a product or reward name.");
    if (displayPrice <= 0) return setError("Select or enter a valid product price.");
    if (!delivery.length) return setError("Select at least one delivery method.");
    if (delivery.includes("shipping") && displayShipping < 0) return setError("Enter a valid shipping fee.");
    setError("");
    startTransition(() => router.push("/campaign_4"));
  }

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <ol aria-label="Campaign creation progress" className="mx-auto flex max-w-3xl items-start">
          {steps.map((step, index) => {
            const complete = index < 2;
            const active = index === 2;
            return (
              <li key={step} className={`relative flex flex-1 flex-col items-center text-center ${index < steps.length - 1 ? `after:absolute after:left-1/2 after:top-5 after:-z-0 after:h-px after:w-full ${index < 2 ? "after:bg-secondary" : "after:bg-slate-400"}` : ""}`}>
                <span className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-base font-semibold ${complete ? "border-secondary bg-secondary text-white" : active ? "border-primary bg-primary text-white" : "border-slate-500 bg-white text-foreground"}`}>{complete ? <Check className="size-5" /> : index + 1}</span>
                <span className={`relative z-10 mt-3 bg-white px-2 text-sm font-medium sm:text-base ${complete ? "text-secondary" : active ? "text-primary" : "text-foreground"}`}>{step}</span>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-14 grid w-full max-w-6xl items-start gap-10 lg:mt-20 lg:grid-cols-[1.25fr_0.75fr] xl:gap-16">
          <form onSubmit={handleSubmit} className="space-y-11">
            <header>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex bg-secondary/10 px-3 py-1.5 text-base font-medium text-secondary">Step 3 of 4</span>
                <Button type="button" variant="outline" onClick={() => setItemCount((count) => count + 1)} className="border-secondary text-secondary"><Plus className="size-4" />Add New Item</Button>
              </div>
              <h1 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight text-black">Set Up Your Campaign</h1>
              <p className="mt-4 text-lg leading-7 text-muted-foreground">Just a few more details before we create your fundraiser.</p>
              {itemCount > 1 ? <p className="mt-2 text-sm font-medium text-secondary">{itemCount} campaign items added</p> : null}
            </header>

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><Gift className="size-10" /></span>
              <div className="w-full"><h2 className="text-[32px] font-semibold leading-tight">1. What will supporters receive?</h2><p className="mt-2 text-lg leading-7 text-muted-foreground">What product, item, or experience are you offering?</p><Input value={productName} onChange={(event) => { updateDraft({ productName: event.target.value }); setError(""); }} className="mt-4" required /><p className="mt-3 text-sm text-muted-foreground">Examples: Banana Pudding, 4-Pack Cinnamon Rolls, Handmade Candle, Custom T-Shirt</p></div>
            </section>

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><Tag className="size-10" /></span>
              <div><h2 className="text-[32px] font-semibold leading-tight">2. Product Price</h2><p className="mt-2 text-lg leading-7 text-muted-foreground">How much will supporters pay?</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">{prices.map((amount) => <ChoiceButton key={amount} selected={price === amount} onClick={() => updateDraft({ price: amount })}>${amount}</ChoiceButton>)}<ChoiceButton selected={price === "custom"} onClick={() => updateDraft({ price: 0 })}>Custom</ChoiceButton></div>{price === "custom" ? <Input type="number" min="1" value={customPrice} onChange={(event) => { setCustomPrice(event.target.value); updateDraft({ price: Number(event.target.value) || 0 }); }} placeholder="Enter custom price" className="mt-4" required /> : null}</div>
            </section>

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><CalendarDays className="size-10" /></span>
              <div><h2 className="text-[32px] font-semibold leading-tight">3. Campaign Length</h2><p className="mt-2 text-lg leading-7 text-muted-foreground">How long should your fundraiser run?</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{durations.map((days) => <ChoiceButton key={days} selected={duration === days} onClick={() => updateDraft({ durationDays: days })}>{days} Days</ChoiceButton>)}</div></div>
            </section>

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><Truck className="size-10" /></span>
              <div><h2 className="text-[32px] font-semibold leading-tight">4. How will customers receive products?</h2><p className="mt-2 text-lg leading-7 text-muted-foreground">Choose all that apply. You can offer more than one option.</p><div className="mt-5 grid gap-3 md:grid-cols-3">{deliveryOptions.map(({ id, title, detail, icon: Icon }) => { const selected = delivery.includes(id); return <button key={id} type="button" role="checkbox" aria-checked={selected} onClick={() => toggleDelivery(id)} className={`relative flex min-h-24 items-start gap-3 rounded-lg border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary ${selected ? "border-secondary bg-secondary/10" : "border-slate-300"}`}><Icon className="mt-1 size-6 shrink-0 text-secondary" /><span><strong className="block text-lg">{title}</strong><small className="mt-1 block text-sm text-muted-foreground">{detail}</small></span>{selected ? <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-secondary text-white"><Check className="size-3" /></span> : null}</button>; })}</div></div>
            </section>

            {delivery.includes("shipping") ? <section className="grid gap-5 sm:grid-cols-[80px_1fr]"><span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary"><DollarSign className="size-10" /></span><div><h2 className="text-[32px] font-semibold leading-tight">5. Shipping Fee <span className="text-base font-normal text-muted-foreground">(Only applies if shipping is selected)</span></h2><p className="mt-2 text-lg leading-7 text-muted-foreground">How much will you charge for shipping?</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{shippingFees.map((fee) => <ChoiceButton key={fee} selected={shippingFee === fee} onClick={() => updateDraft({ shippingFee: fee })}>${fee}</ChoiceButton>)}<ChoiceButton selected={shippingFee === "custom"} onClick={() => updateDraft({ shippingFee: 0 })}>Custom</ChoiceButton></div>{shippingFee === "custom" ? <Input type="number" min="0" value={customShipping} onChange={(event) => { setCustomShipping(event.target.value); updateDraft({ shippingFee: Number(event.target.value) || 0 }); }} placeholder="Enter shipping fee" className="mt-4" required /> : null}</div></section> : null}

            {error ? <p role="alert" className="text-lg text-red-600">{error}</p> : null}
            <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row"><Button type="button" variant="outline" onClick={() => router.push("/campaign_2")} className="border-secondary text-secondary"><ArrowLeft className="size-4" />Back</Button><Button type="submit" disabled={isPending} className="w-full sm:w-56">{isPending ? "Saving..." : "Continue"}<ArrowRight className="size-4" /></Button></div>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4" />Your progress is saved automatically</p>
          </form>

          <aside className="rounded-lg border border-slate-400 p-5 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Eye className="size-5 text-secondary" />Live Preview</h2>
            <Image src={hero} alt="Banana pudding campaign preview" className="mt-4 aspect-[1.55/1] w-full rounded-lg object-cover object-right" />
            <div className="mt-4 flex items-center gap-3"><Image src={user} alt="Jenna" className="size-12 rounded-full object-cover" /><h3 className="text-lg font-semibold leading-5">Jenna’s<br />Banana Pudding</h3></div>
            <p className="mt-5 text-sm font-medium text-secondary">Goal: $2,500</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15"><div className="h-full w-[3%] rounded-full bg-secondary" /></div><div className="mt-2 flex justify-between text-xs"><span>$80 Raised</span><span>0 Supporters</span></div>
            <div className="mt-4 rounded-md border border-secondary bg-secondary/10 px-4 py-3 text-center text-sm font-medium text-secondary"><ShoppingCart className="mr-2 inline size-4" />{itemCount} {itemCount === 1 ? "Item" : "Items"} Listed</div>
            <div className="mt-4 space-y-3"><Button type="button" className="w-full"><ShoppingCart className="size-4" />Buy {productName || "Product"}{displayPrice ? ` — $${displayPrice}` : ""}</Button><Button type="button" variant="outline" className="w-full"><Heart className="size-4" />Donate</Button></div>
            <h3 className="mt-5 text-lg font-semibold">Campaign Details</h3><dl className="mt-3 space-y-3 text-sm"><PreviewRow icon={Gift} label="Product" value={productName || "—"} /><PreviewRow icon={CalendarDays} label="Campaign Length" value={`${duration} Days`} /><PreviewRow icon={Truck} label="Delivery Options" value={delivery.length ? deliveryOptions.filter((option) => delivery.includes(option.id)).map((option) => option.title).join(", ") : "—"} />{delivery.includes("shipping") ? <PreviewRow icon={DollarSign} label="Shipping Fee" value={`$${displayShipping}`} /> : null}</dl>
            <div className="mt-5 rounded-lg border border-secondary bg-secondary/10 p-4"><h3 className="flex items-center gap-2 text-lg font-semibold text-secondary"><ShieldCheck className="size-5" />100% Secure</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Your information is always safe and protected.</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`relative h-12 rounded-md border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm ${selected ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-400 bg-white"}`}>{children}{selected ? <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-secondary text-white"><Check className="size-3" /></span> : null}</button>;
}

function PreviewRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return <div className="grid grid-cols-[18px_1fr_1.2fr] gap-2"><Icon className="mt-0.5 size-4 text-muted-foreground" /><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{value}</dd></div>;
}
