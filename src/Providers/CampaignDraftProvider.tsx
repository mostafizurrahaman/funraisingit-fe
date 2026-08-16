"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

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

export const CampaignDraftProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<CampaignDraft>(initialDraft);

  const updateDraft = useCallback((updates: Partial<CampaignDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(initialDraft);
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
