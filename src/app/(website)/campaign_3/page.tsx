/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/set-state-in-effect */
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
  {
    id: "pickup",
    title: "Local Pickup",
    detail: "I will pick up from supporters",
    icon: Store,
  },
  {
    id: "delivery",
    title: "Local Delivery",
    detail: "I will deliver to supporters",
    icon: Truck,
  },
  {
    id: "shipping",
    title: "Shipping",
    detail: "I will ship to supporters",
    icon: PackageCheck,
  },
] as const;

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { useCampaignDraft } from "@/Providers/CampaignDraftProvider";
import {
  useAddProductMutation,
  useGetProductsByCampaignIdQuery,
} from "@/redux/features/campaign/campaignApi";
import { EditProductModal, DeleteProductModal } from "@/components/dashboard/ProductModals";
import { ChangeEvent } from "react";

interface ProductInput {
  name: string;
  description: string;
  price: number;
  productType: "physical" | "digital";
  stock: number;
  // sku: string;
  weight: number;
  productImage: File | null;
  productImagePreview: string;
  downloadFileName?: string;
  downloadFiles?: File | null;
}

export default function CampaignThreePage() {
  const router = useRouter();
  const token = useSelector(userCurrentToken);

  useEffect(() => {
    const localToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !localToken) {
      toast.error("Please log in first to start a campaign.");
      router.push("/login");
    }
  }, [token, router]);

  const { draft, updateDraft } = useCampaignDraft();
  const [campaignId, setCampaignId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localId = localStorage.getItem("campaignId") || "";
      const finalId = draft.id || localId;
      setCampaignId(finalId);
      if (localId && !draft.id) {
        updateDraft({ id: localId });
      }
    }
  }, [draft.id, updateDraft]);

  const { data: dbProductsResponse, isLoading: isLoadingProducts } =
    useGetProductsByCampaignIdQuery(campaignId, { skip: !campaignId });
  const dbProducts = dbProductsResponse?.data || [];

  const [showProductForm, setShowProductForm] = useState(false);
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState<"physical" | "digital">(
    "physical",
  );
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");
  const [weight, setWeight] = useState("0.1");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState("");
  const [productImageError, setProductImageError] = useState("");

  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadFiles, setDownloadFiles] = useState<File | null>(null);
  const [downloadFilesError, setDownloadFilesError] = useState("");

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  const productName = draft.productName || "";
  const price = prices.includes(draft.price as any)
    ? (draft.price as number | "custom")
    : "custom";
  const [customPrice, setCustomPrice] = useState("");
  const duration = draft.durationDays;

  const delivery: string[] = [];
  if (draft.allowLocalPickup) delivery.push("pickup");
  if (draft.allowLocalDelivery) delivery.push("delivery");
  if (draft.allowShipping) delivery.push("shipping");

  const shippingFee = shippingFees.includes(draft.shippingFee as any)
    ? (draft.shippingFee as number | "custom")
    : "custom";
  const [customShipping, setCustomShipping] = useState("");
  const [error, setError] = useState("");

  const displayPrice = price === "custom" ? Number(customPrice || 0) : price;
  const displayShipping =
    shippingFee === "custom" ? Number(customShipping || 0) : shippingFee;

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
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                    {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    },
                  );
                  resolve(compressedFile);
                } else {
                  resolve(file);
                }
              },
              "image/jpeg",
              0.75,
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

  async function handleProductImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setProductImageError("Choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    try {
      setProductImageError("Compressing image...");
      const processedFile = await compressImage(file);
      setProductImage(processedFile);
      setProductImagePreview(URL.createObjectURL(processedFile));
      setProductImageError("");
    } catch (e) {
      console.error(e);
      setProductImage(file);
      setProductImagePreview(URL.createObjectURL(file));
      setProductImageError("");
    }
  }

  async function handleDownloadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setDownloadFilesError("Digital file must be under 50 MB.");
      event.target.value = "";
      return;
    }

    if (file.type.startsWith("image/")) {
      try {
        setDownloadFilesError("Compressing image...");
        const compressedFile = await compressImage(file);
        setDownloadFiles(compressedFile);
        setDownloadFilesError("");
      } catch (e) {
        console.error("Compression failed, using original file", e);
        setDownloadFiles(file);
        setDownloadFilesError("");
      }
    } else {
      setDownloadFiles(file);
      setDownloadFilesError("");
    }
  }

  async function handleAddProductToList() {
    if (!productName.trim()) {
      setError("Please enter a product name first.");
      return;
    }
    if (displayPrice <= 0) {
      setError("Please enter a valid product price first.");
      return;
    }

    if (sku.trim()) {
      const isDuplicate = dbProducts.some(
        (p: any) => p.sku?.trim().toLowerCase() === sku.trim().toLowerCase(),
      );
      if (isDuplicate) {
        const errorMsg =
          "A product with this SKU already exists in this campaign. Please use a unique SKU.";
        toast.error(errorMsg);
        setError(errorMsg);
        return;
      }
    }

    if (!campaignId) {
      const errorMsg = "Campaign ID not found. Please create the campaign first in Step 2.";
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description || "High-quality product");
    formData.append("price", String(displayPrice));
    formData.append("productType", productType);
    formData.append("stock", productType === "physical" ? String(Number(stock) || 0) : "999999");
    formData.append("sku", sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    formData.append("weight", productType === "physical" ? String(Number(weight) || 0.1) : "0");
    if (productImage) {
      formData.append("productImage", productImage);
    }
    if (productType === "digital") {
      if (downloadFileName) {
        formData.append("downloadFileName", downloadFileName);
      }
      if (downloadFiles) {
        formData.append("downloadFiles", downloadFiles);
      }
    }

    try {
      await addProduct({ campaignId, formData }).unwrap();
      toast.success("Product added successfully!");
      setShowProductForm(false);

      // Reset current product inputs
      updateDraft({ productName: "", price: 5 });
      setDescription("");
      setStock("0");
      setSku("");
      setWeight("0.1");
      setProductImage(null);
      setProductImagePreview("");
      setDownloadFileName("");
      setDownloadFiles(null);
      setCustomPrice("");
      setError("");
    } catch (err: any) {
      console.error("Add product error:", err);
      toast.error(err?.data?.message || "Failed to add product");
    }
  }

  function toggleDelivery(id: string) {
    if (id === "pickup")
      updateDraft({ allowLocalPickup: !draft.allowLocalPickup });
    if (id === "delivery")
      updateDraft({ allowLocalDelivery: !draft.allowLocalDelivery });
    if (id === "shipping") updateDraft({ allowShipping: !draft.allowShipping });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!delivery.length)
      return setError("Select at least one delivery method.");
    if (delivery.includes("shipping") && displayShipping < 0)
      return setError("Enter a valid shipping fee.");

    if (!campaignId) {
      return setError(
        "Campaign ID not found. Please create the campaign first in Step 2.",
      );
    }

    // If there are inputs in the product form, automatically include them as well
    if (productName.trim() && showProductForm) {
      if (displayPrice <= 0)
        return setError(
          "Please select or enter a valid price for the current product.",
        );

      const isDuplicate = dbProducts.some(
        (p: any) => p.sku?.trim().toLowerCase() === sku.trim().toLowerCase(),
      );
      if (isDuplicate) {
        return setError(
          "A product with this SKU already exists in this campaign. Please use a unique SKU.",
        );
      }

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", description || "High-quality product");
      formData.append("price", String(displayPrice));
      formData.append("productType", productType);
      formData.append("stock", productType === "physical" ? String(Number(stock) || 0) : "999999");
      formData.append("sku", sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      formData.append("weight", productType === "physical" ? String(Number(weight) || 0.1) : "0");
      if (productImage) {
        formData.append("productImage", productImage);
      }
      if (productType === "digital") {
        if (downloadFileName) {
          formData.append("downloadFileName", downloadFileName);
        }
        if (downloadFiles) {
          formData.append("downloadFiles", downloadFiles);
        }
      }

      try {
        await addProduct({ campaignId, formData }).unwrap();
        // Reset current product inputs
        updateDraft({ productName: "", price: 5 });
        setDescription("");
        setStock("0");
        setSku("");
        setWeight("0.1");
        setProductImage(null);
        setProductImagePreview("");
        setDownloadFileName("");
        setDownloadFiles(null);
        setCustomPrice("");
        setShowProductForm(false);
      } catch (err: any) {
        console.error("Product creation handleSubmit error:", err);
        return setError(err?.data?.message || "Failed to save product before continuing");
      }
    }

    if (dbProducts.length === 0) {
      return setError("Please add at least one product to your campaign.");
    }

    try {
      toast.success("Products saved successfully!");
      router.push("/campaign_4");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  }

  return (
    <main className="bg-background px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <div className="container mx-auto">
        <ol
          aria-label="Campaign creation progress"
          className="mx-auto flex max-w-3xl items-start"
        >
          {steps.map((step, index) => {
            const complete = index < 2;
            const active = index === 2;
            return (
              <li
                key={step}
                className={`relative flex flex-1 flex-col items-center text-center ${index < steps.length - 1 ? `after:absolute after:left-1/2 after:top-5 after:-z-0 after:h-px after:w-full ${index < 2 ? "after:bg-secondary" : "after:bg-slate-400"}` : ""}`}
              >
                <span
                  className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-base font-semibold ${complete ? "border-secondary bg-secondary text-white" : active ? "border-primary bg-primary text-white" : "border-slate-500 bg-white text-foreground"}`}
                >
                  {complete ? <Check className="size-5" /> : index + 1}
                </span>
                <span
                  className={`relative z-10 mt-3 bg-white px-2 text-sm font-medium sm:text-base ${complete ? "text-secondary" : active ? "text-primary" : "text-foreground"}`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-14 grid w-full max-w-6xl items-start gap-10 lg:mt-20 lg:grid-cols-[1.25fr_0.75fr] xl:gap-16">
          <form onSubmit={handleSubmit} className="space-y-11">
            <header>
              {/* <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex bg-secondary/10 px-3 py-1.5 text-base font-medium text-secondary">Step 3 of 4</span>
                <Button type="button" variant="outline" onClick={handleAddProductToList} className="border-secondary text-secondary"><Plus className="size-4" />Add Product to Campaign</Button>
              </div> */}
              <h1 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight text-black">
                Set Up Your Campaign
              </h1>
              <p className="mt-4 text-lg leading-7 text-muted-foreground">
                Just a few more details before we create your fundraiser.
              </p>
              {dbProducts.length > 0 ? (
                <p className="mt-2 text-sm font-medium text-secondary">
                  {dbProducts.length} campaign items added
                </p>
              ) : null}
            </header>

            {/* List of added products */}
            {dbProducts.length > 0 && (
              <div className="rounded-lg border border-secondary bg-secondary/5 p-4 sm:p-5">
                <h3 className="font-semibold text-secondary text-lg mb-3">
                  Added Products ({dbProducts.length})
                </h3>
                <div className="divide-y divide-slate-200">
                  {dbProducts.map((p: any) => (
                    <div
                      key={p._id}
                      className="flex justify-between items-start sm:items-center gap-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">
                          {p.name} - ${p.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.productType}
                          {p.productType === "physical" && ` | Stock: ${p.stock}`}
                        </p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1 shrink-0">
                        <EditProductModal product={p} />
                        <DeleteProductModal product={p} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showProductForm ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-secondary/30 rounded-xl bg-secondary/5 gap-4">
                <p className="text-muted-foreground text-sm font-medium">
                  Need to add a product or experience to your campaign?
                </p>
                <Button
                  type="button"
                  onClick={() => setShowProductForm(true)}
                  className="px-6 h-12 bg-secondary text-white font-semibold rounded-md transition-all duration-300 hover:bg-secondary/90 hover:scale-[1.02] hover:shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Plus className="size-5" /> Add Product to Campaign
                </Button>
              </div>
            ) : (
              <div className="space-y-11 border border-secondary/20 rounded-xl p-6 bg-secondary/5">
                <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
                  <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Gift className="size-10" />
                  </span>
                  <div className="w-full space-y-4">
                    <h2 className="text-[32px] font-semibold leading-tight">
                      1. What will supporters receive?
                    </h2>
                    <p className="text-lg leading-7 text-muted-foreground">
                      What product, item, or experience are you offering?
                    </p>

                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Product Name *
                      </label>
                      <Input
                        value={productName}
                        onChange={(event) => {
                          updateDraft({ productName: event.target.value });
                          setError("");
                        }}
                        className="mt-1"
                        required
                        placeholder="Example: Premium T-Shirt"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Product Description
                      </label>
                      <Input
                        value={description}
                        onChange={(event) => {
                          setDescription(event.target.value);
                          setError("");
                        }}
                        className="mt-1"
                        placeholder="High-quality cotton t-shirt"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Product Type *
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-xs">
                        <button
                          type="button"
                          onClick={() => setProductType("physical")}
                          className={`h-11 rounded-md border text-base font-medium transition-all ${
                            productType === "physical"
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          Physical
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductType("digital")}
                          className={`h-11 rounded-md border text-base font-medium transition-all ${
                            productType === "digital"
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          Digital
                        </button>
                      </div>
                    </div>

                    {productType === "physical" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-foreground">
                            Stock *
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {productType === "physical" && (
                      <div>
                        <label className="text-sm font-semibold text-foreground">
                          Weight (lb)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={weight}
                          onChange={(event) => setWeight(event.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}

                    {productType === "digital" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold text-foreground">
                            Download File Name *
                          </label>
                          <Input
                            value={downloadFileName}
                            onChange={(event) =>
                              setDownloadFileName(event.target.value)
                            }
                            className="mt-1"
                            placeholder="React-Complete-Course.zip"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-foreground block mb-2">
                            Download Files *
                          </label>
                          {downloadFiles ? (
                            <div className="flex h-12 items-center justify-between rounded-lg border border-secondary bg-secondary/5 px-4 text-xs font-semibold text-secondary">
                              <span className="truncate max-w-[150px]">
                                {downloadFiles.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setDownloadFiles(null)}
                                className="bg-red-500 text-white rounded-full size-5 flex items-center justify-center text-[10px]"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <label className="flex h-12 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-secondary bg-secondary/10 text-center hover:bg-secondary/15 transition-all">
                              <span className="text-xs font-semibold text-secondary">
                                Upload Digital File
                              </span>
                              <input
                                type="file"
                                onChange={handleDownloadFile}
                                className="sr-only"
                                required
                              />
                            </label>
                          )}
                          {downloadFilesError && (
                            <p className="mt-1 text-xs text-red-500">
                              {downloadFilesError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Product Image
                      </label>
                      <div className="flex items-center gap-4">
                        {productImagePreview ? (
                          <div className="relative size-20 overflow-hidden rounded-lg border border-slate-200">
                            <Image
                              src={productImagePreview}
                              alt="Product preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setProductImage(null);
                                setProductImagePreview("");
                              }}
                              className="absolute right-1 top-1 bg-red-500 text-white rounded-full size-5 flex items-center justify-center text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="flex h-20 w-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-secondary bg-secondary/10 text-center hover:bg-secondary/15 transition-all">
                            <span className="text-xs font-semibold text-secondary">
                              Upload Image
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProductImage}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                      {productImageError && (
                        <p className="mt-1 text-xs text-red-500">
                          {productImageError}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
                  <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Tag className="size-10" />
                  </span>
                  <div>
                    <h2 className="text-[32px] font-semibold leading-tight">
                      2. Product Price
                    </h2>
                    <p className="mt-2 text-lg leading-7 text-muted-foreground">
                      How much will supporters pay?
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {prices.map((amount) => (
                        <ChoiceButton
                          key={amount}
                          selected={price === amount}
                          onClick={() => updateDraft({ price: amount })}
                        >
                          ${amount}
                        </ChoiceButton>
                      ))}
                      <ChoiceButton
                        selected={price === "custom"}
                        onClick={() => updateDraft({ price: 0 })}
                      >
                        Custom
                      </ChoiceButton>
                    </div>
                    {price === "custom" ? (
                      <Input
                        type="number"
                        min="1"
                        value={customPrice}
                        onChange={(event) => {
                          setCustomPrice(event.target.value);
                          updateDraft({ price: Number(event.target.value) || 0 });
                        }}
                        placeholder="Enter custom price"
                        className="mt-4"
                        required
                      />
                    ) : null}
                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowProductForm(false);
                          setError("");
                        }}
                        className="border-secondary text-secondary hover:bg-secondary/5 font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-95 h-12 px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddProductToList}
                        className="h-12 px-6 rounded-md bg-secondary text-white font-semibold transition-all duration-300 hover:bg-secondary/90 hover:scale-[1.01] hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Plus className="size-5" /> Add Product to List
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CalendarDays className="size-10" />
              </span>
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  3. Campaign Length
                </h2>
                <p className="mt-2 text-lg leading-7 text-muted-foreground">
                  How long should your fundraiser run?
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {durations.map((days) => (
                    <ChoiceButton
                      key={days}
                      selected={duration === days}
                      onClick={() => updateDraft({ durationDays: days })}
                    >
                      {days} Days
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
              <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Truck className="size-10" />
              </span>
              <div>
                <h2 className="text-[32px] font-semibold leading-tight">
                  4. How will customers receive products?
                </h2>
                <p className="mt-2 text-lg leading-7 text-muted-foreground">
                  Choose all that apply. You can offer more than one option.
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {deliveryOptions.map(({ id, title, detail, icon: Icon }) => {
                    const selected = delivery.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => toggleDelivery(id)}
                        className={`relative flex min-h-24 items-start gap-3 rounded-lg border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary ${selected ? "border-secondary bg-secondary/10" : "border-slate-300"}`}
                      >
                        <Icon className="mt-1 size-6 shrink-0 text-secondary" />
                        <span>
                          <strong className="block text-lg">{title}</strong>
                          <small className="mt-1 block text-sm text-muted-foreground">
                            {detail}
                          </small>
                        </span>
                        {selected ? (
                          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-secondary text-white">
                            <Check className="size-3" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {delivery.includes("shipping") ? (
              <section className="grid gap-5 sm:grid-cols-[80px_1fr]">
                <span className="flex size-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <DollarSign className="size-10" />
                </span>
                <div>
                  <h2 className="text-[32px] font-semibold leading-tight">
                    5. Shipping Fee{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      (Only applies if shipping is selected)
                    </span>
                  </h2>
                  <p className="mt-2 text-lg leading-7 text-muted-foreground">
                    How much will you charge for shipping?
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {shippingFees.map((fee) => (
                      <ChoiceButton
                        key={fee}
                        selected={shippingFee === fee}
                        onClick={() => updateDraft({ shippingFee: fee })}
                      >
                        ${fee}
                      </ChoiceButton>
                    ))}
                    <ChoiceButton
                      selected={shippingFee === "custom"}
                      onClick={() => updateDraft({ shippingFee: 0 })}
                    >
                      Custom
                    </ChoiceButton>
                  </div>
                  {shippingFee === "custom" ? (
                    <Input
                      type="number"
                      min="0"
                      value={customShipping}
                      onChange={(event) => {
                        setCustomShipping(event.target.value);
                        updateDraft({
                          shippingFee: Number(event.target.value) || 0,
                        });
                      }}
                      placeholder="Enter shipping fee"
                      className="mt-4"
                      required
                    />
                  ) : null}
                </div>
              </section>
            ) : null}

            {error ? (
              <p role="alert" className="text-lg text-red-600">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/campaign_2")}
                className="border-secondary text-secondary"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isAdding || dbProducts.length === 0}
                className="w-full sm:w-56"
              >
                {isAdding ? "Saving..." : "Continue"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <LockKeyhole className="size-4" />
              Your progress is saved automatically
            </p>
          </form>

          <aside className="rounded-lg border border-slate-400 p-5 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Eye className="size-5 text-secondary" />
              Live Preview
            </h2>
            <div className="relative mt-4 aspect-[1.55/1] w-full overflow-hidden rounded-lg">
              <Image
                src={draft.thumbnailPreview || hero}
                alt="Campaign preview"
                fill
                unoptimized={!!draft.thumbnailPreview}
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src={user}
                alt="User avatar"
                className="size-12 rounded-full object-cover"
              />
              <h3 className="text-lg font-semibold leading-5">
                {draft.name || "My Campaign"}
              </h3>
            </div>
            <p className="mt-5 text-sm font-medium text-secondary">
              Goal: ${draft.goalAmount?.toLocaleString() || "0"}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/15">
              <div className="h-full w-[3%] rounded-full bg-secondary" />
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span>$0 Raised</span>
              <span>0 Supporters</span>
            </div>
            <div className="mt-4 rounded-md border border-secondary bg-secondary/10 px-4 py-3 text-center text-sm font-medium text-secondary">
              <ShoppingCart className="mr-2 inline size-4" />
              {dbProducts.length || 1}{" "}
              {(dbProducts.length || 1) === 1 ? "Item" : "Items"} Listed
            </div>
            <div className="mt-4 space-y-3">
              <Button type="button" className="w-full">
                <ShoppingCart className="size-4" />
                Buy {productName || "Product"}
                {displayPrice ? ` — $${displayPrice}` : ""}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <Heart className="size-4" />
                Donate
              </Button>
            </div>
            <h3 className="mt-5 text-lg font-semibold">Campaign Details</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <PreviewRow
                icon={Gift}
                label="Product"
                value={productName || "—"}
              />
              <PreviewRow
                icon={CalendarDays}
                label="Campaign Length"
                value={`${duration} Days`}
              />
              <PreviewRow
                icon={Truck}
                label="Delivery Options"
                value={
                  delivery.length
                    ? deliveryOptions
                        .filter((option) => delivery.includes(option.id))
                        .map((option) => option.title)
                        .join(", ")
                    : "—"
                }
              />
              {delivery.includes("shipping") ? (
                <PreviewRow
                  icon={DollarSign}
                  label="Shipping Fee"
                  value={`$${displayShipping}`}
                />
              ) : null}
            </dl>
            <div className="mt-5 rounded-lg border border-secondary bg-secondary/10 p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary">
                <ShieldCheck className="size-5" />
                100% Secure
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your information is always safe and protected.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-12 rounded-md border text-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm ${selected ? "border-secondary bg-secondary/10 text-secondary" : "border-slate-400 bg-white"}`}
    >
      {children}
      {selected ? (
        <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-secondary text-white">
          <Check className="size-3" />
        </span>
      ) : null}
    </button>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[18px_1fr_1.2fr] gap-2">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
