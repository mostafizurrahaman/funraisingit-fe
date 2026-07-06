"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type InputHTMLAttributes } from "react";
import {
  ArrowLeft,
  Box,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import productImage from "../../assets/order.png";
import campaignOwner from "../../assets/user.png";

interface ShippingMethod {
  id: "pickup" | "delivery" | "shipping";
  title: string;
  description: string;
  price: number;
  icon: typeof MapPin;
}

const shippingMethods: ShippingMethod[] = [
  { id: "pickup", title: "Local Pickup", description: "Customers pick up in person", price: 0, icon: MapPin },
  { id: "delivery", title: "Local Delivery", description: "Your Deliver locally", price: 0, icon: Truck },
  { id: "shipping", title: "Shipping", description: "We ship to supporters", price: 8, icon: Box },
];

const inputClassName =
  "h-10 w-full rounded-lg border border-muted-foreground/50 bg-white px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/15";

function FormField({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-xs font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
      <input required={required} className={`mt-2 ${inputClassName}`} {...props} />
    </label>
  );
}

const OrderSummery = () => {
  const [quantity, setQuantity] = useState(1);
  const [shippingId, setShippingId] = useState<ShippingMethod["id"]>("shipping");

  const unitPrice = 10;
  const subtotal = unitPrice * quantity;
  const shipping = shippingMethods.find((method) => method.id === shippingId)?.price ?? 0;
  const tax = 2.24 * quantity;
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-secondary">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-xl border border-muted-foreground/60 p-4 sm:p-5">
              <div className="relative aspect-[1.55/1] overflow-hidden rounded-xl">
                <Image src={productImage} alt="Jennaâ€™s Banana Pudding" fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    <Image src={campaignOwner} alt="Jenna" fill className="object-cover" sizes="48px" />
                  </div>
                  <h1 className="text-lg font-semibold leading-6 text-foreground sm:text-xl">
                    Jennaâ€™s<br />Banana Pudding
                  </h1>
                </div>
                <p className="whitespace-nowrap text-3xl font-semibold text-secondary">
                  $10<span className="ml-1 text-xs font-normal text-foreground">each</span>
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-foreground">Quantity</p>
                <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg border border-muted-foreground/60">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="flex size-9 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary" aria-label="Decrease quantity">
                    <Minus className="size-3" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-medium">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => current + 1)} className="flex size-9 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary" aria-label="Increase quantity">
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>

              <div className="mt-5 text-sm leading-5 text-muted-foreground">
                <h2 className="font-semibold text-foreground">About This Campaign</h2>
                <p className="mt-3">Hi everyone! My name is Jenna and I&apos;m raising money to launch Jenna&apos;s Banana Pudding.</p>
                <p className="mt-3">Your support will help me purchase ingredients, packaging, and supplies so I can grow my business and bring my home-made desserts to more customers.</p>
                <p className="mt-3">Thank you for believing in me!</p>
              </div>
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-4 sm:p-5">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                <Truck className="size-5 text-secondary" />
                Shipping Method
              </h2>
              <div className="mt-5 space-y-3">
                {shippingMethods.map((method) => {
                  const Icon = method.icon;
                  const selected = shippingId === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setShippingId(method.id)}
                      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all duration-300 hover:border-secondary hover:bg-secondary/5 ${selected ? "border-secondary bg-secondary/5" : "border-muted-foreground/50"}`}
                    >
                      <Icon className="size-5 shrink-0 text-secondary" />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{method.title}</span>
                        <span className="block text-[11px] text-muted-foreground">{method.description}</span>
                      </span>
                      <span className="text-xs font-medium">{method.price === 0 ? "Free" : `$${method.price}`}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Order Summary</h2>
              <div className="mt-5 flex items-center gap-4 border-b border-muted-foreground/30 pb-4">
                <div className="relative size-14 overflow-hidden rounded-lg">
                  <Image src={productImage} alt="Banana pudding" fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Jenna&apos;s Banana Pudding</p>
                  <p className="text-xs text-muted-foreground">$10 Ã— {quantity}</p>
                </div>
                <p className="text-sm font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <dl className="space-y-3 border-b border-muted-foreground/30 py-4 text-xs">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>${shipping.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Estimated tax (8%)</dt><dd>${tax.toFixed(2)}</dd></div>
              </dl>
              <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                <span>Total</span><span className="text-xl text-secondary">${total.toFixed(2)}</span>
              </div>
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Contact Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormField label="First Name" name="firstName" placeholder="Jane" required />
                <FormField label="Last Name" name="lastName" placeholder="Smith" required />
                <div className="sm:col-span-2"><FormField label="Email Address" name="email" type="email" placeholder="jane@email.com" required /></div>
                <div className="sm:col-span-2"><FormField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" required /></div>
              </div>
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Delivery Address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><FormField label="Address Line 1" name="address1" placeholder="123 Main Street" required /></div>
                <div className="sm:col-span-2"><FormField label="Address Line 2" name="address2" placeholder="Apt, suite, unit (optional)" /></div>
                <FormField label="City" name="city" placeholder="Springfield" required />
                <label className="block text-xs font-medium">State <span className="text-red-500">*</span><select name="state" required className={`mt-2 ${inputClassName}`} defaultValue=""><option value="" disabled>Select state</option><option>California</option><option>New York</option><option>Texas</option></select></label>
                <FormField label="ZIP / Postal Code" name="postalCode" placeholder="62701" required />
                <label className="block text-xs font-medium">Country <span className="text-red-500">*</span><select name="country" required className={`mt-2 ${inputClassName}`} defaultValue=""><option value="" disabled>Select country</option><option>United States</option><option>Canada</option><option>United Kingdom</option></select></label>
              </div>
            </section>

            <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md">
              <ShieldCheck className="size-4" />
              Place Order Â· ${total.toFixed(2)}
            </button>
            <p className="text-center text-[10px] leading-4 text-muted-foreground">By placing your order you agree to our Terms of Service and Privacy Policy.<br />Your payment is secured and encrypted by Stripe.</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default OrderSummery;
