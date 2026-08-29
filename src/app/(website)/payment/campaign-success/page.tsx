import CampaignLaunchSuccess from "@/components/pages/CampaignLaunchSuccess";

type PageProps = {
  searchParams: Promise<{
    campaignId?: string;
  }>;
};

export default async function CampaignSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <CampaignLaunchSuccess campaignId={params.campaignId || ""} />;
}
