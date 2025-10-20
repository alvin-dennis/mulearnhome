import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donation Successful | µLearn',
  description: 'Thank you for your generous donation to µLearn Foundation',
};

export default function DonateSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
