"use client";

import React, { useState } from "react";
import { Tag, Search, Package, Layers, FileCode, Loader2 } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGetAllMyCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetProductsByCampaignIdQuery,
} from "@/redux/features/campaign/campaignApi";
import {
  Product,
  ProductDetailsModal,
  EditProductModal,
  DeleteProductModal,
} from "@/components/dashboard/ProductModals";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Physical, 2: Digital

  const { data: myCampaignsResponse, isLoading: isLoadingCampaigns } =
    useGetAllMyCampaignsQuery({});
  const campaignsList = myCampaignsResponse?.data || [];

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  // Sort campaigns by createdAt descending
  const sortedCampaigns = [...campaignsList].sort((a: any, b: any) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  React.useEffect(() => {
    if (!selectedCampaignId && sortedCampaigns.length > 0) {
      const mostRecentId = sortedCampaigns[0]._id;
      setSelectedCampaignId(mostRecentId);
    }
  }, [sortedCampaigns, selectedCampaignId]);

  // Load campaign for the campaign status
  const { data: campaignResponse } = useGetCampaignByIdQuery(
    selectedCampaignId,
    {
      skip: !selectedCampaignId,
    },
  );
  const campaignStatus = campaignResponse?.data?.status;

  // Load products specifically using the getProductsByCampaignId query
  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError,
  } = useGetProductsByCampaignIdQuery(selectedCampaignId, {
    skip: !selectedCampaignId,
  });

  const products: Product[] = productsResponse?.data || [];
  const isLoading =
    isLoadingCampaigns || (selectedCampaignId ? isLoadingProducts : true);
  console.log("campaignStatus:", campaignStatus);

  // Statistics calculation
  const totalProducts = products.length;
  const physicalProducts = products.filter(
    (p) => p.productType === "physical",
  ).length;
  const digitalProducts = products.filter(
    (p) => p.productType === "digital",
  ).length;

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name
      ? String(p.name).toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const skuMatch = p.sku
      ? String(p.sku).toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesSearch = nameMatch || skuMatch;

    if (!matchesSearch) return false;

    if (activeTab === 1) return p.productType === "physical";
    if (activeTab === 2) return p.productType === "digital";

    return true;
  });

  const productTabs = [
    `All Products (${totalProducts})`,
    `Physical (${physicalProducts})`,
    `Digital (${digitalProducts})`,
  ];

  const summaryStats = [
    {
      title: "Total Products",
      value: String(totalProducts),
      detail: "In this campaign",
      icon: Tag,
      colorClass: "bg-secondary/10 text-secondary",
    },
    {
      title: "Physical Products",
      value: String(physicalProducts),
      detail: "Deliverable products",
      icon: Package,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      title: "Digital Products",
      value: String(digitalProducts),
      detail: "Instant downloads",
      icon: FileCode,
      colorClass: "bg-violet-100 text-violet-700",
    },
    // {
    //   title: "Out of Stock",
    //   value: String(outOfStockProducts),
    //   detail: "Requires inventory refill",
    //   icon: AlertTriangle,
    //   colorClass: cn(
    //     "bg-red-100 text-red-700",
    //     outOfStockProducts > 0 && "animate-pulse"
    //   ),
    // },
  ] as const;

  return (
    <div className="mx-auto max-w-360 space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-lg bg-white text-foreground shadow-sm ring-1 ring-border">
            <Layers className="size-8 text-secondary" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage physical and digital products for your campaign
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="campaign-filter"
              className="text-sm font-semibold text-muted-foreground shrink-0"
            >
              Campaign:
            </label>
            <select
              id="campaign-filter"
              value={selectedCampaignId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCampaignId(val);
              }}
              className="flex h-10 w-full sm:w-64 rounded-md border border-slate-300 px-3 text-sm outline-none transition-all duration-300 focus:border-secondary cursor-pointer bg-white"
            >
              {sortedCampaigns.map((campaign: any) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          {/* {campaignStatus === "draft" && (
            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("campaignId", selectedCampaignId);
                }
                router.push("/campaign_3");
              }}
              className="h-10 bg-secondary hover:bg-secondary/90 text-white font-semibold transition-all duration-300 rounded-md"
            >
              Add Product
            </Button>
          )} */}
        </div>
      </section>

      {/* Summary statistics cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <DashboardCard
              key={stat.title}
              className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
                    stat.colorClass,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </section>

      <DashboardCard className="p-0">
        <div className="flex flex-col gap-4 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {productTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary",
                  index === activeTab && "bg-secondary/10 text-secondary",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="h-11 rounded-lg border-border pl-10 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex min-h-50 flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 animate-spin text-secondary" />
              <p className="text-sm text-muted-foreground">
                Loading products...
              </p>
            </div>
          ) : isError || !selectedCampaignId ? (
            <div className="flex min-h-50 flex-col items-center justify-center">
              <p className="text-sm text-red-500 font-semibold">
                {!selectedCampaignId
                  ? "No campaign found. Please select a campaign first."
                  : "Error loading campaign products."}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-50 flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No products found.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-245 text-left text-sm">
              <thead className="border-b border-border bg-[#f8ffff] text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  {/* <th className="px-4 py-3">SKU</th> */}
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3">Weight (lb)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition-colors duration-300 hover:bg-secondary/5"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {product.productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.productImage}
                            alt={product.name}
                            className="size-10 rounded-md object-cover border border-border"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-md bg-slate-100 text-[10px] text-muted-foreground">
                            No image
                          </div>
                        )}
                        <span className="font-semibold text-foreground text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    {/* <td className="px-4 py-4 text-xs font-mono text-muted-foreground">
                      {product.sku || "N/A"}
                    </td> */}
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize",
                          product.productType === "physical"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-violet-100 text-violet-700",
                        )}
                      >
                        {product.productType}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-foreground">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {product.productType === "digital" ? (
                        <span className="text-xs font-semibold text-muted-foreground">
                          —
                        </span>
                      ) : product.isUnlimited ? (
                        <span className="text-xs font-semibold text-muted-foreground">
                          Unlimited
                        </span>
                      ) : product.stock <= 0 ? (
                        <span className="text-xs font-semibold text-red-500">
                          Out of stock
                        </span>
                      ) : (
                        <span className="font-semibold">{product.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {product.productType === "physical" &&
                      product.weight !== undefined
                        ? `${product.weight} lb`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center">
                        <ProductDetailsModal product={product} />
                        <EditProductModal
                          product={product}
                          campaignStatus={campaignStatus}
                        />
                        <DeleteProductModal
                          product={product}
                          campaignStatus={campaignStatus}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DashboardCard>

      {campaignStatus === "draft" && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.setItem("campaignId", selectedCampaignId);
              }
              router.push("/campaign_3");
            }}
            className="h-11 bg-secondary hover:bg-secondary/90 text-white font-semibold transition-all duration-300 rounded-md px-6"
          >
            Add Additional Product
          </Button>
        </div>
      )}
    </div>
  );
}
