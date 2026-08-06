import PaymentSuccess from "@/components/pages/PaymentSuccess";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
    transactionId?: string;
    email?: string;
  }>;
};

const PaymentSuccessPage = async ({ searchParams }: PaymentSuccessPageProps) => {
  const params = await searchParams;
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
