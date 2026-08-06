"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, type InputHTMLAttributes } from "react";
import {
  ArrowLeft,
  Box,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Loader2,
} from "lucide-react";
import { useGetCampaignsByCodeQuery } from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

import defaultProductImage from "../../assets/order.png";
import defaultCampaignOwner from "../../assets/user.png";

interface ShippingMethod {
  id: "pickup" | "delivery" | "shipping";
  title: string;
  description: string;
  price: number;
  icon: typeof MapPin;
}

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingId, setShippingId] = useState<"pickup" | "delivery" | "shipping">("shipping");

  const { data: campaignResponse, isLoading } = useGetCampaignsByCodeQuery(code, {
    skip: !code,
  });

  const campaign = campaignResponse?.data;
  const products = campaign?.products || [];

  // Auto-select if there is exactly 1 product
  useEffect(() => {
    if (products.length === 1 && !selectedProductId) {
      setSelectedProductId(products[0]._id);
    }
  }, [products, selectedProductId]);

  // Find currently selected product
  const product = products.find((p: any) => p._id === selectedProductId) || (products.length === 1 ? products[0] : null);

  // Dynamic variables from API
  const productName = product?.name || campaign?.name || "Premium Item";
  const productPrice = product?.price || 10;
  const productImageSrc = product?.productImage || campaign?.thumbnail || defaultProductImage;
  const organizerName = campaign?.organizerName || "Organizer";
  const organizerImageSrc = campaign?.organizerProfileImage || defaultCampaignOwner;
  const campaignStory = campaign?.story || "Thank you for supporting our campaign!";
  const campaignShippingFee = campaign?.shippingFee || 0;

  // Stock values
  const isPhysical = product?.productType === "physical";
  const isLimited = product?.isUnlimited === false;
  const availableStock = product?.stock ?? 0;
  const isProductOutOfStock = isPhysical && isLimited && availableStock <= 0;

  // Reset quantity if it exceeds stock of a newly selected product
  useEffect(() => {
    if (isPhysical && isLimited && quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    } else if (isPhysical && isLimited && availableStock <= 0) {
      setQuantity(1);
    }
  }, [selectedProductId, availableStock, isPhysical, isLimited, quantity]);

  // Calculations
  const subtotal = productPrice * quantity;
  const tax = 2.24 * quantity;

  // Dynamically build shipping options based on settings
  const shippingMethods: ShippingMethod[] = [];
  if (campaign?.allowLocalPickup || campaign?.allowLocalPickup === undefined) {
    shippingMethods.push({
      id: "pickup",
      title: "Local Pickup",
      description: "Customers pick up in person",
      price: 0,
      icon: MapPin,
    });
  }
  if (campaign?.allowLocalDelivery || campaign?.allowLocalDelivery === undefined) {
    shippingMethods.push({
      id: "delivery",
      title: "Local Delivery",
      description: "Delivered locally",
      price: 0,
      icon: Truck,
    });
  }
  if (campaign?.allowShipping || campaign?.allowShipping === undefined) {
    shippingMethods.push({
      id: "shipping",
      title: "Shipping",
      description: "We ship to supporters",
      price: campaignShippingFee,
      icon: Box,
    });
  }

  // Set default shipping method if the current one is not supported
  const activeMethods = shippingMethods.map((m) => m.id);
  const currentShippingId = activeMethods.includes(shippingId)
    ? shippingId
    : activeMethods[0] || "shipping";

  const selectedShippingFee = shippingMethods.find((method) => method.id === currentShippingId)?.price ?? 0;
  const total = subtotal + selectedShippingFee + tax;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background">
        <Loader2 className="size-8 animate-spin text-secondary" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  // Render product selection screen if no product is selected and there are multiple products
  if (!product && products.length > 1) {
    return (
      <main className="min-h-screen bg-background py-14 sm:py-20">
        <div className="container mx-auto px-5 sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-secondary mb-6">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-semibold text-foreground">Select a Product</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please choose a product from {campaign?.name || "the campaign"} to continue with your purchase.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {products.map((p: any) => {
              const outOfStock = p.productType === "physical" && p.isUnlimited === false && p.stock <= 0;
              return (
                <div
                  key={p._id}
                  className="overflow-hidden rounded-lg border border-border bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[1.55/1] w-full overflow-hidden bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.productImage || defaultProductImage.src}
                        alt={p.name}
                        className="absolute inset-0 size-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground truncate">{p.name}</h3>
                      {outOfStock ? (
                        <span className="mt-1 inline-block rounded bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-600">
                          Out of Stock
                        </span>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground capitalize">{p.productType} Product</p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border flex items-center justify-between gap-4">
                    <span className="text-lg font-bold text-secondary">${p.price.toFixed(2)}</span>
                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedProductId(p._id)}
                      className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold transition-all duration-300 ${
                        outOfStock
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      {outOfStock ? "Out of Stock" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

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
              <div className="relative aspect-[1.55/1] overflow-hidden rounded-xl bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={typeof productImageSrc === "string" ? productImageSrc : (productImageSrc as any).src} alt={productName} className="absolute inset-0 size-full object-cover object-top" />
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={typeof organizerImageSrc === "string" ? organizerImageSrc : (organizerImageSrc as any).src} alt={organizerName} className="absolute inset-0 size-full object-cover rounded-full" />
                  </div>
                  <h1 className="text-lg font-semibold leading-6 text-foreground sm:text-xl truncate">
                    {organizerName}&apos;s<br />Fundraiser
                  </h1>
                </div>
                <p className="whitespace-nowrap text-3xl font-semibold text-secondary">
                  ${productPrice}<span className="ml-1 text-xs font-normal text-foreground">each</span>
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-foreground">Quantity</p>
                <div className="mt-2 flex flex-col items-start gap-1">
                  <div className="inline-flex items-center overflow-hidden rounded-lg border border-muted-foreground/60">
                    <button
                      type="button"
                      disabled={isProductOutOfStock}
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="flex size-9 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium">
                      {isProductOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isProductOutOfStock || (isPhysical && isLimited && quantity >= availableStock)}
                      onClick={() => setQuantity((current) => Math.min(isPhysical && isLimited ? availableStock : 9999, current + 1))}
                      className="flex size-9 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  {isPhysical && isLimited && (
                    <p className={`text-xs font-medium mt-1 ${isProductOutOfStock ? "text-red-500 animate-pulse" : "text-orange-600"}`}>
                      {isProductOutOfStock ? "Out of Stock" : `Only ${availableStock} units available`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                <h2 className="font-semibold text-foreground">About This Campaign</h2>
                <p className="mt-3">{campaignStory}</p>
              </div>
            </section>

            {shippingMethods.length > 0 && (
              <section className="rounded-xl border border-muted-foreground/60 p-4 sm:p-5">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                  <Truck className="size-5 text-secondary" />
                  Shipping Method
                </h2>
                <div className="mt-5 space-y-3">
                  {shippingMethods.map((method) => {
                    const Icon = method.icon;
                    const selected = currentShippingId === method.id;
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
            )}
          </div>

          <form className="space-y-6" onSubmit={(event) => {
            event.preventDefault();
            if (isPhysical && isLimited && availableStock <= 0) {
              return toast.error("This product is currently out of stock.");
            }
            if (isPhysical && isLimited && quantity > availableStock) {
              return toast.error(`You cannot order more than ${availableStock} items.`);
            }
            router.push("/order-success");
          }}>
            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Order Summary</h2>
              <div className="mt-5 flex items-center gap-4 border-b border-muted-foreground/30 pb-4">
                <div className="relative size-14 overflow-hidden rounded-lg bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={typeof productImageSrc === "string" ? productImageSrc : (productImageSrc as any).src} alt={productName} className="absolute inset-0 size-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{productName}</p>
                  <p className="text-xs text-muted-foreground">${productPrice} × {isProductOutOfStock ? 0 : quantity}</p>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(null)}
                      className="mt-1 text-xs text-secondary font-semibold hover:underline block cursor-pointer bg-transparent border-none p-0"
                    >
                      Change Product
                    </button>
                  )}
                </div>
                <p className="text-sm font-semibold">${(isProductOutOfStock ? 0 : subtotal).toFixed(2)}</p>
              </div>
              <dl className="space-y-3 border-b border-muted-foreground/30 py-4 text-xs">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${(isProductOutOfStock ? 0 : subtotal).toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>${(isProductOutOfStock ? 0 : selectedShippingFee).toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Estimated tax (8%)</dt><dd>${(isProductOutOfStock ? 0 : tax).toFixed(2)}</dd></div>
              </dl>
              <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                <span>Total</span><span className="text-xl text-secondary">${(isProductOutOfStock ? 0 : total).toFixed(2)}</span>
              </div>
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-black">Contact Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormField label="First Name" name="firstName" placeholder="Jane" required disabled={isProductOutOfStock} />
                <FormField label="Last Name" name="lastName" placeholder="Smith" required disabled={isProductOutOfStock} />
                <div className="sm:col-span-2"><FormField label="Email Address" name="email" type="email" placeholder="jane@email.com" required disabled={isProductOutOfStock} /></div>
                <div className="sm:col-span-2"><FormField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" required disabled={isProductOutOfStock} /></div>
              </div>
            </section>

            {currentShippingId !== "pickup" && (
              <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-black">Delivery Address</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><FormField label="Address Line 1" name="address1" placeholder="123 Main Street" required disabled={isProductOutOfStock} /></div>
                  <div className="sm:col-span-2"><FormField label="Address Line 2" name="address2" placeholder="Apt, suite, unit (optional)" disabled={isProductOutOfStock} /></div>
                  <FormField label="City" name="city" placeholder="Springfield" required disabled={isProductOutOfStock} />
                  <label className="block text-xs font-medium">State <span className="text-red-500">*</span><select name="state" required disabled={isProductOutOfStock} className={`mt-2 ${inputClassName}`} defaultValue=""><option value="" disabled>Select state</option><option>California</option><option>New York</option><option>Texas</option></select></label>
                  <FormField label="ZIP / Postal Code" name="postalCode" placeholder="62701" required disabled={isProductOutOfStock} />
                  <label className="block text-xs font-medium">Country <span className="text-red-500">*</span><select name="country" required disabled={isProductOutOfStock} className={`mt-2 ${inputClassName}`} defaultValue=""><option value="" disabled>Select country</option><option>United States</option><option>Canada</option><option>United Kingdom</option></select></label>
                </div>
              </section>
            )}

            <button
              type="submit"
              disabled={isProductOutOfStock}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <ShieldCheck className="size-4" />
              {isProductOutOfStock ? "Product Out of Stock" : `Place Order · $${total.toFixed(2)}`}
            </button>
            <p className="text-center text-[10px] leading-4 text-muted-foreground">By placing your order you agree to our Terms of Service and Privacy Policy.<br />Your payment is secured and encrypted by Stripe.</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default OrderSummery;
