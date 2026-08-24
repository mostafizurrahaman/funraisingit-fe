"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

export interface CampaignDraft {
  id?: string;
  name: string;
  campaignCategory: string;
  goalAmount: number;
  thumbnail: File | null;
  thumbnailPreview: string;
  story: string;
  fundUsage: string[];
  allowDonation: boolean;
  productName: string;
  price: number;
  durationDays: number;
  allowLocalPickup: boolean;
  allowLocalDelivery: boolean;
  allowShipping: boolean;
  shippingFee: number;
}

const initialDraft: CampaignDraft = {
  id: "",
  name: "",
  campaignCategory: "business",
  goalAmount: 2500,
  thumbnail: null,
  thumbnailPreview: "",
  story: "",
  fundUsage: [],
  allowDonation: true,
  productName: "",
  price: 10,
  durationDays: 7,
  allowLocalPickup: true,
  allowLocalDelivery: true,
  allowShipping: true,
  shippingFee: 8,
};

interface CampaignDraftContextType {
  draft: CampaignDraft;
  updateDraft: (updates: Partial<CampaignDraft>) => void;
  resetDraft: () => void;
}

const CampaignDraftContext = createContext<CampaignDraftContextType | undefined>(undefined);

function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const CampaignDraftProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<CampaignDraft>(initialDraft);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // 1. Load draft and base64 image on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = sessionStorage.getItem("campaignDraft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          const savedBase64 = sessionStorage.getItem("campaignDraftImage");
          const savedImageName = sessionStorage.getItem("campaignDraftImageName") || "thumbnail.jpg";
          
          let thumbnailFile: File | null = null;
          let thumbnailPreviewUrl = parsed.thumbnailPreview || "";
          
          if (savedBase64) {
            thumbnailFile = base64ToFile(savedBase64, savedImageName);
            thumbnailPreviewUrl = URL.createObjectURL(thumbnailFile);
          }
          
          setDraft({
            ...parsed,
            thumbnail: thumbnailFile,
            thumbnailPreview: thumbnailPreviewUrl,
          });
        } catch (e) {
          console.error("Error parsing campaign draft from sessionStorage", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // 2. Synchronize draft with sessionStorage when it changes
  useEffect(() => {
    if (!isLoaded) return;

    const { thumbnail, ...serializableDraft } = draft;
    sessionStorage.setItem("campaignDraft", JSON.stringify(serializableDraft));

    if (thumbnail) {
      sessionStorage.setItem("campaignDraftImageName", thumbnail.name);
      fileToBase64(thumbnail)
        .then((base64) => {
          sessionStorage.setItem("campaignDraftImage", base64);
        })
        .catch((e) => console.error("Error storing image base64", e));
    } else {
      sessionStorage.removeItem("campaignDraftImage");
      sessionStorage.removeItem("campaignDraftImageName");
    }
  }, [draft, isLoaded]);

  const resetDraft = useCallback(() => {
    setDraft(initialDraft);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("campaignDraft");
      sessionStorage.removeItem("campaignDraftImage");
      sessionStorage.removeItem("campaignDraftImageName");
    }
  }, []);

  // 3. Clear draft when navigating away from campaign wizard routes
  useEffect(() => {
    if (pathname && !pathname.startsWith("/campaign_")) {
      resetDraft();
    }
  }, [pathname, resetDraft]);

  const updateDraft = useCallback((updates: Partial<CampaignDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <CampaignDraftContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </CampaignDraftContext.Provider>
  );
};

export const useCampaignDraft = () => {
  const context = useContext(CampaignDraftContext);
  if (!context) {
    throw new Error("useCampaignDraft must be used within a CampaignDraftProvider");
  }
  return context;
};
