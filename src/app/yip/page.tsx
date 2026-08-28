import { YipView } from "@/features/yip";

export const metadata = {
  title: "YIP | µLearn",
  description: "Young Innovators Programme (YIP 5.0) by Kerala Government, K-DISC and µLearn.",
};

export default async function YipPage() {
  return <YipView />;
}
