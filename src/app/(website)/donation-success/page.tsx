import DonationSuccess from "@/components/pages/DonationSuccess";

type DonationSuccessPageProps = {
  searchParams: Promise<{ amount?: string }>;
};

const DonationSuccessPage = async ({ searchParams }: DonationSuccessPageProps) => {
  const { amount: amountParam } = await searchParams;
  const parsedAmount = Number(amountParam);
  const amount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 20;

  return <DonationSuccess amount={amount} />;
};

export default DonationSuccessPage;
