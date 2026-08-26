/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCreateOrderMutation, usePreviewOrderMutation } from "@/redux/features/orderManagement/orderManagementApi";
import { useGetAccountQuery } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

import defaultProductImage from "../../assets/order.png";
import defaultCampaignOwner from "../../assets/user.png";

interface ShippingMethod {
  id: "local_pickup" | "local_delivery" | "shipping";
  title: string;
  description: string;
  price: number;
  icon: typeof MapPin;
}

const inputClassName =
  "h-10 w-full rounded-lg border border-muted-foreground/50 bg-white px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/15";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function FormField({ label, required, ...props }: FormFieldProps) {
  return (
    <label className="block text-xs font-medium text-foreground">
      {label} {required && <span className="text-red-500">*</span>}
      <input
        required={required}
        className={`mt-2 ${inputClassName}`}
        {...props}
      />
    </label>
  );
}

const OrderSummery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [shippingId, setShippingId] = useState<
    "local_pickup" | "local_delivery" | "shipping"
  >("shipping");

  const { data: campaignResponse, isLoading } = useGetCampaignsByCodeQuery(
    code,
    {
      skip: !code,
    },
  );

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [previewOrder, { data: previewResponse, isLoading: isPreviewLoading }] =
    usePreviewOrderMutation();
  const previewData = previewResponse?.data;

  const { data: accountResponse } = useGetAccountQuery(undefined, {
    skip: typeof window !== "undefined" && !localStorage.getItem("token")
  });
  const accountInfo = accountResponse?.data;

  const campaign = campaignResponse?.data;
  const products = campaign?.products || [];

  // Auto-initialize quantities when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities: Record<string, number> = {};
      products.forEach((p: any) => {
        initialQuantities[p._id] = 0;
      });
      // Default the first available/in-stock product to 1
      const firstAvailable = products.find(
        (p: any) =>
          p.productType !== "physical" ||
          p.isUnlimited === true ||
          (p.stock && p.stock > 0),
      );
      if (firstAvailable) {
        initialQuantities[firstAvailable._id] = 1;
      } else if (products[0]) {
        initialQuantities[products[0]._id] = 1;
      }
      setQuantities(initialQuantities);
    }
  }, [products]);

  const organizerName = campaign?.organizerName || "Organizer";
  const organizerImageSrc =
    campaign?.organizerProfileImage || defaultCampaignOwner;
  const campaignStory =
    campaign?.story || "Thank you for supporting our campaign!";
  const campaignShippingFee = campaign?.shippingFee || 0;

  // Calculations
  const subtotal = products.reduce((acc: number, p: any) => {
    const qty = quantities[p._id] || 0;
    return acc + p.price * qty;
  }, 0);

  // Dynamically build shipping options based on settings
  const shippingMethods: ShippingMethod[] = [];
  if (campaign?.allowLocalPickup || campaign?.allowLocalPickup === undefined) {
    shippingMethods.push({
      id: "local_pickup",
      title: "Local Pickup",
      description: "Customers pick up in person",
      price: 0,
      icon: MapPin,
    });
  }
  if (
    campaign?.allowLocalDelivery ||
    campaign?.allowLocalDelivery === undefined
  ) {
    shippingMethods.push({
      id: "local_delivery",
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

  const selectedShippingFee =
    shippingMethods.find((method) => method.id === currentShippingId)?.price ??
    0;

  // Auto-fetch order preview when quantities or shipping details change
  useEffect(() => {
    if (!campaign?._id) return;

    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const prod = products.find((p: any) => p._id === productId);
        return {
          product: productId,
          quantity: qty,
          price: prod?.price || 0,
          productType: prod?.productType || "physical",
        };
      });

    if (orderItems.length === 0) return;

    let shippingType = "shipping";
    if (currentShippingId === "local_pickup") shippingType = "local_pickup";
    else if (currentShippingId === "local_delivery")
      shippingType = "local_delivery";

    previewOrder({
      campaignId: campaign._id,
      orderItems,
      shippingType,
    });
  }, [quantities, currentShippingId, campaign?._id, previewOrder, products]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaign) return;

    if (accountInfo && accountInfo.status?.toLowerCase() !== "active") {
      return toast.error("You cannot donate or place orders because your onboarding account status is not active. Please complete verification in Settings.");
    }

    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const prod = products.find((p: any) => p._id === productId);
        return {
          product: productId,
          quantity: qty,
          price: prod.price,
          productType: prod.productType,
        };
      });

    if (orderItems.length === 0) {
      return toast.error("Please select at least one product to order.");
    }

    // Validate digital products limit & stocks for physical items
    for (const item of orderItems) {
      const prod = products.find((p: any) => p._id === item.product);
      if (prod && prod.productType === "digital" && item.quantity > 1) {
        return toast.error(
          `You cannot order more than 1 unit of digital product "${prod.name}".`,
        );
      }
      if (
        prod &&
        prod.productType === "physical" &&
        prod.isUnlimited === false
      ) {
        if (prod.stock <= 0) {
          return toast.error(
            `Product "${prod.name}" is currently out of stock.`,
          );
        }
        if (item.quantity > prod.stock) {
          return toast.error(
            `You cannot order more than ${prod.stock} units of "${prod.name}".`,
          );
        }
      }
    }

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address1 = (formData.get("address1") as string) || "";
    const address2 = (formData.get("address2") as string) || "";
    const city = (formData.get("city") as string) || "";
    const state = (formData.get("state") as string) || "";
    const postalCode = (formData.get("postalCode") as string) || "";
    const country = (formData.get("country") as string) || "";

    let shippingType = "shipping";
    if (currentShippingId === "local_pickup") shippingType = "local_pickup";
    else if (currentShippingId === "local_delivery")
      shippingType = "local_delivery";

    const orderPayload = {
      campaignId: campaign._id,
      orderItems,
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      addressLine1:
        currentShippingId === "local_pickup" ? "Local Pickup" : address1,
      addressLine2: address2,
      city: currentShippingId === "local_pickup" ? "Local Pickup" : city,
      state: currentShippingId === "local_pickup" ? "Local Pickup" : state,
      postalCode: currentShippingId === "local_pickup" ? "0000" : postalCode,
      country: currentShippingId === "local_pickup" ? "US" : country,
      shippingType,
    };

    try {
      const res = await createOrder(orderPayload).unwrap();
      if (res.success && res.data?.url) {
        toast.success(
          res.message || "Order created! Redirecting to payment...",
        );
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || "Failed to create order");
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.message || "Failed to create order";
      toast.error(errMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background">
        <Loader2 className="size-8 animate-spin text-secondary" />
        <p className="text-sm text-muted-foreground">
          Loading order details...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:text-secondary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-xl border border-muted-foreground/60 p-4 sm:p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      typeof organizerImageSrc === "string"
                        ? organizerImageSrc
                        : (organizerImageSrc as any).src
                    }
                    alt={organizerName}
                    className="absolute inset-0 size-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-lg font-semibold leading-6 text-foreground sm:text-xl truncate">
                  {organizerName}&apos;s
                  <br />
                  Fundraiser Products
                </h1>
              </div>

              {/* Products List */}
              <div className="space-y-4">
                {products.map((p: any) => {
                  const qty = quantities[p._id] || 0;
                  const isPhysical = p.productType === "physical";
                  const isDigital = p.productType === "digital";
                  const isLimited = p.isUnlimited === false;
                  const availableStock = p.stock ?? 0;
                  const outOfStock =
                    isPhysical && isLimited && availableStock <= 0;
                  const imageSrc = p.productImage || defaultProductImage;
                  return (
                    <div
                      key={p._id}
                      className="rounded-xl border border-muted-foreground/30 p-4 bg-white flex gap-4 transition-all duration-300 hover:shadow-sm"
                    >
                      <div className="relative aspect-[1.3/1] w-28 sm:w-32 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            typeof imageSrc === "string"
                              ? imageSrc
                              : (imageSrc as any).src
                          }
                          alt={p.name}
                          className="absolute inset-0 size-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-sm font-semibold leading-tight text-foreground truncate">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {p.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-base font-bold text-secondary">
                            ${p.price.toFixed(2)}
                          </p>

                          <div className="flex flex-col items-end gap-1">
                            <div className="inline-flex items-center overflow-hidden rounded-lg border border-muted-foreground/60 bg-white h-8">
                              <button
                                type="button"
                                disabled={outOfStock || qty <= 0}
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [p._id]: Math.max(0, qty - 1),
                                  }))
                                }
                                className="flex size-8 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary disabled:opacity-50"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="min-w-6 text-center text-xs font-semibold">
                                {outOfStock ? 0 : qty}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  outOfStock ||
                                  (isPhysical &&
                                    isLimited &&
                                    qty >= availableStock) ||
                                  (isDigital && qty >= 1)
                                }
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [p._id]: qty + 1,
                                  }))
                                }
                                className="flex size-8 items-center justify-center transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            {isPhysical && isLimited && (
                              <p
                                className={`text-[9px] font-medium leading-none ${
                                  outOfStock
                                    ? "text-red-500"
                                    : "text-orange-600"
                                }`}
                              >
                                {outOfStock
                                  ? "Out of stock"
                                  : `Only ${availableStock} left`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-pre-line border-t border-slate-100 pt-4">
                <h2 className="font-semibold text-foreground">
                  About This Campaign
                </h2>
                <p className="mt-2 text-xs">{campaignStory}</p>
              </div>
            </section>

            {shippingMethods.length > 0 && (
              <section className="rounded-xl border border-muted-foreground/60 p-4 sm:p-5">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
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
                        className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all duration-300 hover:border-secondary hover:bg-secondary/5 ${
                          selected
                            ? "border-secondary bg-secondary/5"
                            : "border-muted-foreground/50"
                        }`}
                      >
                        <Icon className="size-5 shrink-0 text-secondary" />
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">
                            {method.title}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {method.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6 bg-white">
              <h2 className="text-xl font-semibold text-black">
                Order Summary
              </h2>

              {/* Selected Items Checkout List */}
              <div className="mt-5 space-y-4 border-b border-muted-foreground/30 pb-4 max-h-60 overflow-y-auto pr-1">
                {products
                  .filter((p: any) => (quantities[p._id] || 0) > 0)
                  .map((p: any) => {
                    const qty = quantities[p._id] || 0;
                    const imageSrc = p.productImage || defaultProductImage;
                    return (
                      <div
                        key={p._id}
                        className="flex items-center gap-4 text-xs sm:text-sm"
                      >
                        <div className="relative size-12 overflow-hidden rounded-lg bg-slate-50 shrink-0 border border-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              typeof imageSrc === "string"
                                ? imageSrc
                                : (imageSrc as any).src
                            }
                            alt={p.name}
                            className="absolute inset-0 size-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${p.price.toFixed(2)} × {qty}
                          </p>
                        </div>
                        <p className="font-semibold text-right">
                          ${(p.price * qty).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                {products.filter((p: any) => (quantities[p._id] || 0) > 0)
                  .length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No products selected. Please add items above.
                  </p>
                )}
              </div>

              {isPreviewLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-secondary" />
                </div>
              ) : previewData ? (
                <>
                  <dl className="space-y-3 border-b border-muted-foreground/30 py-4 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>${previewData.subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shipping Fee</dt>
                      <dd>${previewData.shippingFee.toFixed(2)}</dd>
                    </div>
                    {/* <div className="flex justify-between">
                      <dt className="text-muted-foreground">Stripe Fee</dt>
                      <dd>${previewData.stripeFee.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Platform Fee</dt>
                      <dd>${previewData.platformFee.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-muted-foreground/20 pt-2 font-medium">
                      <dt className="text-muted-foreground">Organizer Net Amount</dt>
                      <dd className="text-secondary">${previewData.organizerNetAmount.toFixed(2)}</dd>
                    </div> */}
                  </dl>
                  <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-secondary">
                      ${previewData.grossAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <dl className="space-y-3 border-b border-muted-foreground/30 py-4 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd>${selectedShippingFee.toFixed(2)}</dd>
                    </div>
                  </dl>
                  <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-secondary">
                      ${(subtotal + selectedShippingFee).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6 bg-white">
              <h2 className="text-xl font-semibold text-black">
                Contact Information
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormField
                  label="First Name"
                  name="firstName"
                  placeholder="Jane"
                  required
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  placeholder="Smith"
                  required
                />
                <div className="sm:col-span-2">
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="jane@email.com"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-muted-foreground/60 p-5 sm:p-6 bg-white">
                <h2 className="text-xl font-semibold text-black">
                  Delivery Address
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField
                      label="Address Line 1"
                      name="address1"
                      placeholder="123 Main Street"
                      required={true}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FormField
                      label="Address Line 2"
                      name="address2"
                      placeholder="Apt, suite, unit (optional)"
                    />
                  </div>
                  <FormField
                    label="City"
                    name="city"
                    placeholder="Springfield"
                    required={true}
                  />
                  <label className="block text-xs font-medium">
                    State <span className="text-red-500">*</span>
                    <select
                      name="state"
                      required={true}
                      className={`mt-2 ${inputClassName}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                    </select>
                  </label>
                  <FormField
                    label="ZIP / Postal Code"
                    name="postalCode"
                    placeholder="62701"
                    required={true}
                  />
                  <label className="block text-xs font-medium">
                    Country <span className="text-red-500">*</span>
                    <select
                      name="country"
                      required={true}
                      className={`mt-2 ${inputClassName}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select country
                      </option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </label>
                </div>
              </section>

            <button
              type="submit"
              disabled={subtotal <= 0 || isCreating}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  {subtotal <= 0
                    ? "Add items to place order"
                    : `Place Order · $${(previewData?.grossAmount ?? subtotal + selectedShippingFee).toFixed(2)}`}
                </>
              )}
            </button>
            <p className="text-center text-[10px] leading-4 text-muted-foreground">
              By placing your order you agree to our Terms of Service and
              Privacy Policy.
              <br />
              Your payment is secured and encrypted by Stripe.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default OrderSummery;
