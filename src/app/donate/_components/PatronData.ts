export type PatronTier = "diamond" | "platinum" | "gold" | "silver";

export interface PatronBenefit {
  text: string;
  highlight?: boolean;
}

export interface PatronTierConfig {
  id: string;
  tier: PatronTier;
  label: string;
  amount: number; // For one-time, or default
  amountOrg?: number; // For recurring - Organization
  amountInd?: number; // For recurring - Individual
  description: string;
  benefits: PatronBenefit[];
  limit?: string; // e.g. "Only first 5"
  color: string;
  textColor: string;
}

// Founding Patron tiers (bank transfer, one-time)
export const oneTimeTiers: PatronTierConfig[] = [
  {
    id: "diamond-founding",
    tier: "diamond",
    label: "Diamond Patron",
    amount: 3000000,
    description: "Movement Architect / Founding Patron",
    limit: "Only first 5",
    color: "from-cyan-50 to-white",
    textColor: "text-[#006064]",
    benefits: [
      {
        text: 'Founding Recognition: Permanent placement as "Founding Diamond Patron"',
        highlight: true,
      },
      { text: "Ecosystem Access: All Diamond Annual benefits for 5 years" },
      {
        text: "Keynote Status: Main guest/keynote slot at Permute (Annual Summit) with VIP lounge access",
      },
      { text: "Co-Design Rights: Co-design one flagship initiative" },
      { text: "Strategy: Permanent seat in the µLearn Executive Roundtable" },
    ],
  },
  {
    id: "platinum-founding",
    tier: "platinum",
    label: "Platinum Patron",
    amount: 1000000,
    description: "Ecosystem Shaper & Program Co-Creator",
    limit: "Only first 50",
    color: "from-slate-50 to-white",
    textColor: "text-[#546E7A]",
    benefits: [
      {
        text: 'Program Co-Creation: Recognition as "Platinum Patron" on website and flagship decks',
        highlight: true,
      },
      { text: "Ecosystem Access: All Platinum Annual benefits" },
      { text: 'Branding: "Powered By" branding for 1 flagship program (3-year period)' },
      {
        text: "Talent Access: Full access to 60,000+ learner pool for surveys, pilots, and beta testing",
      },
    ],
  },
  {
    id: "gold-founding",
    tier: "gold",
    label: "Gold Patron",
    amount: 500000,
    description: "Growth Partner & Talent Pipeline Builder",
    limit: "Only first 100",
    color: "from-amber-50 to-white",
    textColor: "text-[#B08600]",
    benefits: [
      {
        text: 'Regional Impact: Recognition as "Gold Patron" on website and select programs for 3 years',
      },
      { text: "Ecosystem Access: All Gold Annual benefits for 2-3 years" },
      {
        text: "Event Presence: Branding at 1 major event per year + 2 AMA/Tech Talk sessions per year",
      },
    ],
  },
];

// Regular one-time donation tiers (not Founding Patron)
export const regularOneTimeTiers: PatronTierConfig[] = [
  {
    id: "one-time-100k",
    tier: "diamond",
    label: "Champion",
    amount: 100000,
    description: "Make a significant impact",
    color: "from-cyan-50 to-white",
    textColor: "text-[#006064]",
    benefits: [
      { text: "Recognition on our website as a Champion donor", highlight: true },
      { text: "Certificate of appreciation" },
      { text: "Exclusive updates on impact" },
    ],
  },
  {
    id: "one-time-80k",
    tier: "platinum",
    label: "Advocate",
    amount: 80000,
    description: "Support our cause",
    color: "from-slate-50 to-white",
    textColor: "text-[#546E7A]",
    benefits: [
      { text: "Recognition on our website as an Advocate donor", highlight: true },
      { text: "Certificate of appreciation" },
    ],
  },
  {
    id: "one-time-50k",
    tier: "gold",
    label: "Supporter",
    amount: 50000,
    description: "Help us grow",
    color: "from-amber-50 to-white",
    textColor: "text-[#B08600]",
    benefits: [
      { text: "Recognition as a Supporter donor" },
      { text: "Certificate of appreciation" },
    ],
  },
  {
    id: "one-time-30k",
    tier: "silver",
    label: "Friend",
    amount: 30000,
    description: "Every contribution counts",
    color: "from-zinc-50 to-white",
    textColor: "text-[#757575]",
    benefits: [{ text: "Certificate of appreciation" }],
  },
];

export const annualTiers: PatronTierConfig[] = [
  {
    id: "diamond-annual",
    tier: "diamond",
    label: "Diamond",
    amount: 1000000, // Org default/display
    amountOrg: 1000000,
    amountInd: 100000,
    description: "Movement Architect",
    color: "from-cyan-50 to-white",
    textColor: "text-[#006064]",
    benefits: [
      { text: "6 months branding window (first-pick)", highlight: true },
      { text: '"Powered By" branding for 2 flagship events' },
      { text: "Keynote status at Permute + 4 major events branding" },
      { text: "Dedicated Community Manager" },
      { text: "Executive Roundtable seat" },
    ],
  },
  {
    id: "platinum-annual",
    tier: "platinum",
    label: "Platinum",
    amount: 750000,
    amountOrg: 750000,
    amountInd: 75000,
    description: "Ecosystem Shaper",
    color: "from-slate-50 to-white",
    textColor: "text-[#546E7A]",
    benefits: [
      { text: "6 months branding window", highlight: true },
      { text: '"Powered By" branding for 1 flagship program' },
      { text: "VIP seating at Permute" },
      { text: "3 AMA slots/year" },
      { text: "Full talent pool access for pilots" },
    ],
  },
  {
    id: "gold-annual",
    tier: "gold",
    label: "Gold",
    amount: 500000,
    amountOrg: 500000,
    amountInd: 50000,
    description: "Growth Partner",
    color: "from-amber-50 to-white",
    textColor: "text-[#B08600]",
    benefits: [
      { text: "3 months branding window" },
      { text: "Branding at 1 major event" },
      { text: "1 speaking slot at Permute" },
      { text: "2 AMA slots/year" },
    ],
  },
  {
    id: "silver-annual",
    tier: "silver",
    label: "Silver",
    amount: 100000,
    amountOrg: 100000,
    amountInd: 20000,
    description: "Entry Patron",
    color: "from-zinc-50 to-white",
    textColor: "text-[#757575]",
    benefits: [
      { text: "Logo on partners page" },
      { text: "1 month branding window" },
      { text: "1 AMA slot/year" },
    ],
  },
];

export const monthlyTiers: PatronTierConfig[] = [
  {
    id: "diamond-monthly",
    tier: "diamond",
    label: "Diamond",
    amount: 50000,
    amountOrg: 50000,
    amountInd: 10000,
    description: "Movement Architect",
    color: "from-cyan-50 to-white",
    textColor: "text-[#006064]",
    benefits: [
      { text: "Unlocks Diamond Annual benefits proportionally" },
      { text: "Major slots may require minimum commitment period" },
    ],
  },
  {
    id: "platinum-monthly",
    tier: "platinum",
    label: "Platinum",
    amount: 35000,
    amountOrg: 35000,
    amountInd: 5000,
    description: "Ecosystem Shaper",
    color: "from-slate-50 to-white",
    textColor: "text-[#546E7A]",
    benefits: [{ text: "Unlocks Platinum Annual benefits proportionally" }],
  },
  {
    id: "gold-monthly",
    tier: "gold",
    label: "Gold",
    amount: 20000,
    amountOrg: 20000,
    amountInd: 2000,
    description: "Growth Partner",
    color: "from-amber-50 to-white",
    textColor: "text-[#B08600]",
    benefits: [{ text: "Unlocks Gold Annual benefits proportionally" }],
  },
  {
    id: "silver-monthly",
    tier: "silver",
    label: "Silver",
    amount: 10000,
    amountOrg: 10000,
    amountInd: 500,
    description: "Entry Patron",
    color: "from-zinc-50 to-white",
    textColor: "text-[#757575]",
    benefits: [{ text: "Unlocks Silver Annual benefits proportionally" }],
  },
];
