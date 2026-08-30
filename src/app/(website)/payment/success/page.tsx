import PaymentSuccess from "@/components/pages/PaymentSuccess";
import CampaignLaunchSuccess from "@/components/pages/CampaignLaunchSuccess";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
    transactionId?: string;
    email?: string;
    campaignId?: string;
    campaignCode?: string;
    session_id?: string;
  }>;
};

const PaymentSuccessPage = async ({ searchParams }: PaymentSuccessPageProps) => {
  const params = await searchParams;
  
  if (params.campaignId) {
    return <CampaignLaunchSuccess campaignId={params.campaignId} />;
  }

  const parsedAmount = Number(params.amount);
  const amount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
  const transactionId = params.transactionId || undefined;
  const email = params.email || undefined;

  return (
    <PaymentSuccess
      amount={amount}
      transactionId={transactionId}
      email={email}
    />
  );
};

export default PaymentSuccessPage;
