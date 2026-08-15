import CampaignDetailsClient from "./CampaignDetailsClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://funraisingit.com";
  const title = `Campaign Details - ${code} | FunRaisingIt`;
  const description = `Support campaign ${code} on FunRaisingIt! Join supporters to help this project achieve its goal.`;
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  return <CampaignDetailsClient params={params} />;
}
