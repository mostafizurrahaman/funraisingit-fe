"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetMyBrandsQuery } from "@/redux/features/brandBuilder/BrandBuilderApi";
import { Loader2, Palette, Box, CheckCircle2, AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MyBrandPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: myBrandsResponse, isLoading, error } = useGetMyBrandsQuery({
    page,
    limit,
  });

  const brands = myBrandsResponse?.data || [];
  const meta = myBrandsResponse?.meta || {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  };
  const totalPages = meta.totalPages || 1;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700 border border-green-200";
      case "payment_failed":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="container mx-auto  space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">My Brand Projects</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your custom Brand Builder requests and checkout links.
        </p>
      </div>

      <DashboardCard className="p-0 border border-slate-100 overflow-hidden bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-secondary" />
            <p className="text-sm text-muted-foreground">Loading brand projects...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-4 gap-2">
            <AlertCircle className="size-10 text-rose-500" />
            <p className="text-sm font-semibold text-muted-foreground">Failed to load brand data.</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6">
            <Palette className="size-12 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-muted-foreground">No brand projects found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 font-semibold">Business Info</th>
                  <th className="px-5 py-4 font-semibold">Products Required</th>
                  <th className="px-5 py-4 font-semibold">Colors & Style</th>
                  <th className="px-5 py-4 font-semibold">Assets</th>
                  <th className="px-5 py-4 font-semibold">Budget & Fees</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {brands.map((brand: any) => (
                  <tr key={brand._id} className="transition-colors duration-300 hover:bg-slate-50/50">
                    {/* Business Info */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{brand.businessName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{brand.sellingItem}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                        <Calendar className="size-3" />
                        <span>{formatDate(brand.createdAt)}</span>
                      </div>
                    </td>

                    {/* Products Required */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                        {brand.products?.map((prod: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-secondary/5 px-2 py-0.5 text-[10px] font-medium text-secondary"
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Colors & Style */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 capitalize">
                        {brand.brandStyle}
                      </span>
                      <div className="flex gap-1 mt-2">
                        {brand.colors?.map((color: string, idx: number) => (
                          <span
                            key={idx}
                            className="size-4 rounded-full border border-slate-200 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Assets */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5 text-xs font-semibold">
                        {brand.brandLogo ? (
                          <a
                            href={brand.brandLogo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-secondary hover:underline"
                          >
                            Logo File <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No Logo</span>
                        )}
                        <br />
                        {brand.brandImage ? (
                          <a
                            href={brand.brandImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-secondary hover:underline"
                          >
                            Inspiration <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No Image</span>
                        )}
                      </div>
                    </td>

                    {/* Budget & Fees */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted-foreground">
                        Budget: <span className="font-semibold text-slate-700">${brand.budget}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fee: <span className="font-semibold text-slate-700">${brand.brandBuilderFee?.toFixed(2)}</span>
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusStyle(brand.status)}`}>
                        {brand.status?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      {!brand.status?.toLowerCase().includes("paid") ? (
                        <Button
                          onClick={() => {
                            const targetCampaignId = brand.campaignId || brand.campaign?._id || "";
                            if (targetCampaignId) {
                              localStorage.setItem("campaignId", targetCampaignId);
                            }
                            router.push("/brand-builder");
                          }}
                          className="bg-secondary text-white text-xs hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer h-9 px-3"
                        >
                          Brand your project
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 pb-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-white px-4 text-xs font-medium text-foreground transition-all duration-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`inline-flex size-9 items-center justify-center rounded-lg border text-xs font-medium transition-all duration-300 cursor-pointer ${
                  page === pageNumber
                    ? "border-secondary bg-secondary text-white shadow-sm"
                    : "border-border bg-white text-foreground hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-white px-4 text-xs font-medium text-foreground transition-all duration-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
