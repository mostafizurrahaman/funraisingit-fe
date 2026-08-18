"use client";

import React, { use } from "react";
import { useGetContentQuery } from "@/redux/features/settingsManagement/settingsManagementApi";
import { Loader2, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    contentType: string;
  }>;
}

const formatTitle = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ContentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const contentType = resolvedParams.contentType;

  const { data, isLoading, error } = useGetContentQuery(contentType);
  const contentData = data?.data;
  const htmlContent = contentData?.content || "";
  const title = formatTitle(contentType);

  // Helper to decode escaped HTML tags (e.g. &lt;p&gt; to <p>)
  const decodeHtml = (htmlStr: string) => {
    if (typeof window === "undefined" || !htmlStr) return htmlStr;
    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = htmlStr;
      return txt.value;
    } catch {
      return htmlStr;
    }
  };

  const cleanHtmlContent = decodeHtml(htmlContent);

  // Check if error is "Content not found"
  const isContentNotFoundError =
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    error.data.message === "Content not found";

  // Determine if we show empty state "No content here"
  const showEmptyState = !isLoading && (isContentNotFoundError || !htmlContent);

  return (
    <main className="bg-slate-50 min-h-screen py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:text-secondary hover:-translate-x-0.5 mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        {isLoading ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-8 shadow-sm">
            <Loader2 className="size-10 animate-spin text-secondary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Loading document...
            </p>
          </div>
        ) : showEmptyState ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-muted-foreground">
              <Info className="size-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">No content here</h2>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                This document is currently unavailable or has not been created yet.
              </p>
            </div>
            <Link
              href="/"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md cursor-pointer"
            >
              Go Home
            </Link>
          </div>
        ) : error ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/20 p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-red-600">Failed to Load Content</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              An error occurred while loading this page. Please try again later.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md cursor-pointer"
            >
              Go Home
            </Link>
          </div>
        ) : (
          <article className="rounded-2xl border border-border bg-white p-8 sm:p-12 md:p-16 shadow-[0_8px_30px_rgb(7,12,47,0.03)]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8 pb-6 border-b border-border leading-tight">
              {title}
            </h1>
            
            {/* Custom child elements styling using tailwind prefix rules */}
            <div
              className="text-muted-foreground text-sm sm:text-base leading-relaxed 
                [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-4 [&_p]:leading-7 [&_p_strong]:text-foreground
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:mb-2 [&_ul_li]:leading-7
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:mb-2 [&_ol_li]:leading-7
                [&_strong]:font-semibold [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
            />
          </article>
        )}
      </div>
    </main>
  );
}
