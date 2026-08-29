import type { LucideIcon } from "lucide-react";

export type SocialLinks = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  action?: "follow" | "subscribe";
  color: string;
};
