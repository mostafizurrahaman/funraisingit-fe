"use client";

import { useSearchParams } from "next/navigation";
import CampaignLaunchSuccess from "@/components/pages/CampaignLaunchSuccess";
import { Suspense } from "react";

function CampaignLaunchSuccessWrapper() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") || "";

  return <CampaignLaunchSuccess campaignId={campaignId} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CampaignLaunchSuccessWrapper />
    </Suspense>
  );
}
