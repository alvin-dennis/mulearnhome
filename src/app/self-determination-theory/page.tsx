import type { Metadata } from "next";
import { SelfDeterminationTheoryView } from "@/features/self-determination-theory";

export const metadata: Metadata = {
  title: "Self-Determination Theory (SDT) — The Science Behind µLearn",
  description:
    "Self-Determination Theory by Deci & Ryan explains how autonomy, competence, and relatedness drive motivation. See how µLearn is intentionally architected around these three psychological needs.",
  keywords: [
    "Self-Determination Theory",
    "SDT",
    "Edward Deci",
    "Richard Ryan",
    "intrinsic motivation",
    "autonomy",
    "competence",
    "relatedness",
    "peer-led learning",
    "µLearn",
  ],
  alternates: {
    canonical: "/self-determination-theory",
  },
  openGraph: {
    title: "Self-Determination Theory (SDT) — The Science Behind µLearn",
    description:
      "How autonomy, competence, and relatedness drive motivation — and how µLearn is built around these three psychological needs.",
    url: "https://mulearn.org/self-determination-theory",
    type: "article",
  },
};

export default async function SelfDeterminationTheoryPage() {
  return <SelfDeterminationTheoryView />;
}
