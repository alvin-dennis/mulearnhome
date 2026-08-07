import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Award,
  BookOpen,
  Box,
  Building,
  Crown,
  Gift,
  Handshake,
  Heart,
  Home,
  Landmark,
  Server,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

export interface DonationTier {
  id: string;
  label: string;
  amount: number;
  description: string;
  icon: LucideIcon;
}

export const individualOneTimeTiers: DonationTier[] = [
  {
    id: "brick",
    label: "Brick",
    amount: 1500,
    description: "Support a small action that creates big change.",
    icon: Box,
  },
  {
    id: "beam",
    label: "Beam",
    amount: 5000,
    description: "Strengthen our community initiatives.",
    icon: Landmark,
  },
  {
    id: "pillar",
    label: "Pillar",
    amount: 7500,
    description: "Help build core infrastructure.",
    icon: Building,
  },
  {
    id: "cornerstone",
    label: "Cornerstone",
    amount: 15000,
    description: "Make a lasting impact on the ecosystem.",
    icon: Award,
  },
];

export const individualSubscriptionTiers: DonationTier[] = [
  {
    id: "friend",
    label: "Friend",
    amount: 500,
    description: "Be a friend of the µLearn movement.",
    icon: UserRound,
  },
  {
    id: "supporter",
    label: "Supporter",
    amount: 1250,
    description: "Support consistent learning opportunities.",
    icon: Heart,
  },
  {
    id: "patron",
    label: "Patron",
    amount: 2500,
    description: "Enable more learners to grow and build.",
    icon: Award,
  },
  {
    id: "contributor",
    label: "Contributor",
    amount: 5000,
    description: "Power programs, spaces, and resources.",
    icon: Users,
  },
  {
    id: "champion",
    label: "Champion",
    amount: 10000,
    description: "Champion the future of peer learning.",
    icon: Crown,
  },
];

export const orgOneTimeTiers: DonationTier[] = [
  {
    id: "community-partner",
    label: "Community Partner",
    amount: 125000,
    description: "Fuel grassroots campus programs.",
    icon: Handshake,
  },
  {
    id: "catalyst-partner",
    label: "Catalyst Partner",
    amount: 275000,
    description: "Spark new initiatives across the ecosystem.",
    icon: Zap,
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    amount: 500000,
    description: "Drive sustained growth for learners nationwide.",
    icon: TrendingUp,
  },
  {
    id: "anchor-partner",
    label: "Anchor Partner",
    amount: 1000000,
    description: "Anchor µLearn's long-term mission.",
    icon: Anchor,
  },
];

export const orgSubscriptionTiers: DonationTier[] = [
  {
    id: "community-partner",
    label: "Community Partner",
    amount: 50000,
    description: "Fuel grassroots campus programs, every year.",
    icon: Handshake,
  },
  {
    id: "catalyst-partner",
    label: "Catalyst Partner",
    amount: 100000,
    description: "Spark new initiatives, year after year.",
    icon: Zap,
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    amount: 250000,
    description: "Drive sustained growth for learners nationwide.",
    icon: TrendingUp,
  },
  {
    id: "anchor-partner",
    label: "Anchor Partner",
    amount: 500000,
    description: "Anchor µLearn's long-term mission, annually.",
    icon: Anchor,
  },
];

export interface DonationCategory {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const whereItGoesCategories: DonationCategory[] = [
  {
    label: "Campus Communities",
    description:
      "Help student chapters run peer learning circles, meetups, and projects on campus.",
    icon: Users,
  },
  {
    label: "Learning Activities",
    description: "Support open workshops, study jams, bootcamps, and community sessions.",
    icon: BookOpen,
  },
  {
    label: "MuSpace & Infrastructure",
    description: "Keep our physical space, equipment, and digital infrastructure running smoothly.",
    icon: Home,
  },
  {
    label: "Technology & Tools",
    description: "Maintain servers, platforms, and tools that power the µLearn ecosystem.",
    icon: Server,
  },

];
