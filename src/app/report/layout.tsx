import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annual Reports | µLearn",
  description: "Explore µLearn's journey of growth, impact, and community building through our comprehensive annual reports. Discover our transparency and accountability to the community.",
  keywords: "µLearn, annual reports, transparency, community impact, education, peer learning",
  openGraph: {
    title: "Annual Reports | µLearn",
    description: "Explore µLearn's journey of growth, impact, and community building through our comprehensive annual reports.",
    type: "website",
    url: "https://mulearn.org/report",
    images: ["/assets/logo.png"],
  },
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
