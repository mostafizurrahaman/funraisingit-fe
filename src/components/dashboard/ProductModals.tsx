"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CalendarDays,
  FileText,
  Info,
  Layers,
  Package,
  Scale,
  Tag,
  Trash2,
  X,
  Edit2,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/features/campaign/campaignApi";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  productImage: string;
  productType: "physical" | "digital";
  isUnlimited?: boolean;
  stock: number;
  sku: string;
  weight?: number;
  downloadFileName?: string;
  downloadFiles?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ==========================================
// 1. PRODUCT DETAILS MODAL
// ==========================================
export function ProductDetailsModal({ product }: { product: Product }) {
  const dateFormatted = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-xs font-semibold text-secondary transition-colors duration-300 hover:text-secondary/80 mr-3"
        >
          Details
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">Product Details</Dialog.Title>
              {/* <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                SKU: {product.sku || "N/A"}
              </Dialog.Description> */}
            </div>
            <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {product.productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="size-28 rounded-lg object-cover border border-border shrink-0"
                />
              ) : (
                <div className="flex size-28 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground shrink-0">
                  No Image
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                <span className="mt-1 inline-flex rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary capitalize">
                  {product.productType}
                </span>
                <p className="mt-2 text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {product.productType === "physical" && (
                <>
                  <DetailBox icon={Package} label="Stock Status" value={product.isUnlimited ? "Unlimited" : `${product.stock} Units`} />
                  <DetailBox icon={Scale} label="Weight" value={`${product.weight ?? 0} lb`} />
                </>
              )}
              {product.productType === "digital" && (
                <DetailBox icon={FileText} label="Download File Name" value={product.downloadFileName || "N/A"} />
              )}
            </div>

            <section className="rounded-lg border border-border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-secondary" />
                Description
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {product.description || "No description provided."}
              </p>
            </section>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-4" />
              <span>Created on {dateFormatted}</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-border px-5 py-4">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto h-10 text-sm">
                Close
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DetailBox({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-[#f8ffff] p-3 flex items-center gap-3">
      <Icon className="size-5 text-secondary shrink-0" />
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ==========================================
// 2. EDIT PRODUCT MODAL
// ==========================================
export function EditProductModal({
  product,
  campaignStatus,
}: {
  product: Product;
  campaignStatus?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));
  const [productType, setProductType] = useState<"physical" | "digital">(product.productType);
  const [stock, setStock] = useState(String(product.stock));
  const [sku, setSku] = useState(product.sku || "");
  const [weight, setWeight] = useState(String(product.weight || ""));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product.productImage || "");
  const [downloadFileName, setDownloadFileName] = useState(product.downloadFileName || "");
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [downloadFileError, setDownloadFileError] = useState("");

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const isCampaignActive = campaignStatus === "active";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCampaignActive) {
      return toast.error("Products cannot be edited when the campaign is active");
    }

    if (!name.trim()) return toast.error("Product name is required");
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      return toast.error("Valid price is required");
    }
    // if (!sku.trim()) return toast.error("SKU is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("productType", productType);
    formData.append("stock", productType === "physical" ? (stock || "0") : "999999");
    formData.append("sku", sku);
    if (productType === "physical") {
      formData.append("weight", weight || "0");
    }
    if (productType === "digital") {
      formData.append("downloadFileName", downloadFileName);
      if (downloadFile) {
        formData.append("downloadFiles", downloadFile);
      }
    }
    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
      const res = await updateProduct({
        productId: product._id,
        formData,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Product updated successfully");
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to update product");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Something went wrong while updating product";
      toast.error(errMsg);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => { if (!isCampaignActive) setOpen(val); }}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={isCampaignActive}
          className={cn(
            "text-xs font-semibold mr-3 transition-colors duration-300",
            isCampaignActive
              ? "text-slate-400 cursor-not-allowed opacity-60"
              : "text-primary hover:text-primary-hover"
          )}
          title={isCampaignActive ? "Products cannot be edited when campaign is active" : "Edit Product"}
        >
          Edit
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">Edit Product</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Update product properties below
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Product Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-sm border-slate-300 focus:border-secondary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-10 text-sm border-slate-300 focus:border-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Product Type</label>
                <select
                  disabled
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as "physical" | "digital")}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none transition-all duration-300 focus:border-secondary disabled:cursor-not-allowed disabled:text-muted-foreground"
                >
                  <option value="physical">Physical</option>
                  <option value="digital">Digital</option>
                </select>
              </div>

              {/* <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">SKU</label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-10 text-sm border-slate-300 focus:border-secondary"
                  required
                />
              </div> */}
            </div>

            {productType === "physical" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Stock Quantity</label>
                  <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="h-10 text-sm border-slate-300 focus:border-secondary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Weight (lb)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 text-sm border-slate-300 focus:border-secondary"
                  />
                </div>
              </div>
            )}

            {productType === "digital" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Download File Name</label>
                  <Input
                    value={downloadFileName}
                    onChange={(e) => setDownloadFileName(e.target.value)}
                    className="h-10 text-sm border-slate-300 focus:border-secondary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground block mb-1">Download File</label>
                  {downloadFile ? (
                    <div className="flex h-10 items-center justify-between rounded-lg border border-secondary bg-secondary/5 px-3 text-xs font-semibold text-secondary">
                      <span className="truncate max-w-[120px]">
                        {downloadFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDownloadFile(null)}
                        className="bg-red-500 text-white rounded-full size-4 flex items-center justify-center text-[8px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-secondary bg-secondary/5 text-center hover:bg-secondary/10 transition-all">
                      <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                        <UploadCloud className="size-4 animate-bounce" /> Upload New File
                      </span>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 50 * 1024 * 1024) {
                              setDownloadFileError("File must be under 50 MB.");
                              return;
                            }
                            setDownloadFile(file);
                            setDownloadFileError("");
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                  {downloadFileError && (
                    <p className="mt-1 text-xs text-red-500">{downloadFileError}</p>
                  )}
                  {product.downloadFiles && !downloadFile && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Current file: {product.downloadFiles.split("/").pop()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-slate-300 bg-transparent p-3 text-sm outline-none transition-all duration-300 focus:border-secondary"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-muted-foreground">Product Image</label>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-16 rounded-md object-cover border border-border"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-md bg-slate-100 text-xs text-muted-foreground">
                    No image
                  </div>
                )}
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-secondary bg-secondary/5 px-4 text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors">
                  <UploadCloud className="size-4" />
                  Upload New Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto h-10 text-sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-10 text-sm">
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ==========================================
// 3. DELETE PRODUCT MODAL
// ==========================================
export function DeleteProductModal({
  product,
  campaignStatus,
}: {
  product: Product;
  campaignStatus?: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const isCampaignActive = campaignStatus === "active";

  const handleDelete = async () => {
    if (isCampaignActive) {
      return toast.error("Products cannot be deleted when the campaign is active");
    }

    try {
      const res = await deleteProduct(product._id).unwrap();
      if (res.success) {
        toast.success(res.message || "Product deleted successfully");
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to delete product");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Something went wrong while deleting product";
      toast.error(errMsg);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => { if (!isCampaignActive) setOpen(val); }}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          disabled={isCampaignActive}
          className={cn(
            "text-xs font-semibold transition-colors duration-300",
            isCampaignActive
              ? "text-slate-400 cursor-not-allowed opacity-60"
              : "text-red-500 hover:text-red-600"
          )}
          title={isCampaignActive ? "Products cannot be deleted when campaign is active" : "Delete Product"}
        >
          Delete
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <Dialog.Title className="text-lg font-semibold flex items-center gap-2 text-red-600">
              <Trash2 className="size-5" />
              Delete Product
            </Dialog.Title>
            <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to delete product <strong className="text-foreground">{product.name}</strong>? This action is permanent and cannot be undone.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto h-10 text-sm">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              disabled={isLoading}
              onClick={handleDelete}
              className="w-full sm:w-auto h-10 text-sm bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
