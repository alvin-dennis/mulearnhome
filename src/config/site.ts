export const siteConfig = {
  name: "µLearn",
  shortName: "µLearn",
  description:
    "µLearn is a synergic philosophy of education, with a culture of mutual learning through micro groups of peers. µLearn is here to assist you in breaking through the echo chambers and free you from the shackles that have you grounded.",
  url: "https://mulearn.org/",
  ogImage: "/assets/logo.png",
  creator: "µLearn",
  keywords: ["mulearn", "peer learning", "interest groups", "student community", "karma"],
} as const;

export type SiteConfig = typeof siteConfig;
