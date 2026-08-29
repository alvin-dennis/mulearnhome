import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";
import type { SocialLinks } from "../types/socials.types";

export interface SocialLinksGroup {
  socials: SocialLinks[];
  website: SocialLinks[];
  build: SocialLinks[];
}

export const socialLinks: SocialLinksGroup = {
  socials: [
    {
      icon: Instagram,
      title: "@mulearn.official",
      subtitle: "instagram.com",
      href: "https://instagram.com/mulearn.official?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Youtube,
      title: "µLearn",
      subtitle: "YouTube Channel",
      href: "https://youtube.com/@mulearn?si=uJUH5HktDnbf4-a3",
      action: "subscribe",
      color: "bg-destructive",
    },
    {
      icon: Facebook,
      title: "Facebook",
      subtitle: "facebook.com",
      href: "https://m.facebook.com/gtechmulearn",
      action: "follow",
      color: "bg-mulearn",
    },
    {
      icon: Twitter,
      title: "Twitter",
      subtitle: "@mulearn",
      href: "https://x.com/gtechmulearn?lang=ar-x-fm",
      action: "follow",
      color: "bg-mulearn-blackish",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      subtitle: "linkedin.com",
      href: "https://www.linkedin.com/company/mulearn",
      action: "follow",
      color: "bg-mulearn",
    },
    {
      icon: Instagram,
      title: "@mu.careers",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.careers/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu.campus",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.campus/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu.tech_",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.tech_/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu.designers",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.designers/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu__tv",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu__tv/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@muplay.gg",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/muplay.gg?igsh=b2U4MHc5OGFyZ2kx",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu.comics",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.comics?igsh=NW9oYm1wc29jd3Zs",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mu.v_filmclub",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mu.v_filmclub?igsh=cTdydGV3Z2w2NWF3",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: Instagram,
      title: "@mument.mulearn",
      subtitle: "instagram.com",
      href: "https://www.instagram.com/mument.mulearn?igsh=aWk3c3V3ejk2M2U1",
      action: "follow",
      color: "bg-gradient-to-br from-mulearn-duke-purple to-mulearn-duke-purple",
    },
    {
      icon: MessageCircle,
      title: "µLearn Foundation",
      subtitle: "whatsapp.com",
      href: "https://www.whatsapp.com/channel/0029VaylbVgICVfsfN2SZc14",
      action: "follow",
      color: "bg-chart-2",
    },
  ],
  website: [
    {
      icon: Globe,
      title: "µLearn Home",
      subtitle: "mulearn.org",
      href: "https://mulearn.org",
      color: "bg-mulearn",
    },
  ],
  build: [
    {
      icon: Github,
      title: "GitHub",
      subtitle: "github.com",
      href: "https://github.com/gtech-mulearn",
      action: "follow",
      color: "bg-mulearn-blackish",
    },
  ],
};
