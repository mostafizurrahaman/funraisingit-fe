import CampaignSection from "@/components/pages/CampaignSection";
import React, { Suspense } from "react";

const Campaign = () => {
  return (
    <div>
      <Suspense fallback={
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        </div>
      }>
        <CampaignSection />
      </Suspense>
    </div>
  );
};

export default Campaign;
