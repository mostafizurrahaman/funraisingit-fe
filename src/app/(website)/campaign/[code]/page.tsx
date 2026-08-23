import CampaignDetailsClient from "./CampaignDetailsClient";
import type { Metadata } from "next";
import { BASE_URL } from "@/utils/baseUrl";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  let campaignThumbnail = "";
  let campaignName = "";
  let campaignStory = "";

  try {
    const res = await fetch(`${BASE_URL}/campaign/${code}/details`);
    const data = await res.json();
    if (data.success && data.data) {
      campaignThumbnail = data.data.thumbnail || "";
      campaignName = data.data.name || "";
      campaignStory = data.data.story || "";
    }
  } catch (err) {
    console.error("Failed to fetch campaign details for SEO metadata:", err);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://funraisingit.com";
  const title = campaignName ? `${campaignName} | FunRaisingIt` : `Campaign Details - ${code} | FunRaisingIt`;
  const description = campaignStory
    ? campaignStory.slice(0, 155) + "..."
    : `Support campaign ${code} on FunRaisingIt! Join supporters to help this project achieve its goal.`;
  const shareUrl = `${baseUrl}/campaign/${code}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/campaign/${code}`,
    },
    openGraph: {
      title,
      description,
      url: shareUrl,
      type: "website",
      siteName: "FunRaisingIt",
      images: campaignThumbnail ? [{ url: campaignThumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: campaignThumbnail ? [campaignThumbnail] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  let initialData = null;
  try {
    const res = await fetch(`${BASE_URL}/campaign/${code}/details`, {
      next: { revalidate: 10 }
    });
    const data = await res.json();
    if (data.success && data.data) {
      initialData = data.data;
    }
  } catch (err) {
    console.error("Failed to pre-fetch campaign details on server:", err);
  }

  return <CampaignDetailsClient params={params} initialData={initialData} />;
}
