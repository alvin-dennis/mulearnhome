import type { LucideIcon } from "lucide-react";
import { Sparkle, TrendingUp, User, UserPlus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
}

const Icon = ({ icon: IconComponent }: { icon: LucideIcon }) => (
  <IconComponent className="w-6 h-6 text-mulearn-whitish" />
);

const stats: Stat[] = [
  {
    label: "Active members",
    value: "12,095",
    icon: Users,
    iconBg: "bg-blue-500",
  },
  {
    label: "Total Members",
    value: "44,700+",
    icon: User,
    iconBg: "bg-blue-600",
  },
  {
    label: "New Members joined",
    value: "88",
    icon: UserPlus,
    iconBg: "bg-blue-600",
  },
  {
    label: "Learners Completion",
    value: "92%",
    icon: TrendingUp,
    iconBg: "bg-blue-600",
  },
];

export default function MissionAndGrowth() {
  return (
    <section className="w-full bg-mulearn-whitish relative overflow-hidden py-12 px-6">
      {/* Corner sparkles */}
      <div className="hidden md:block absolute top-6 right-10 z-10">
        <Sparkle className="w-6 h-6 text-mulearn" />
      </div>
      <div className="hidden md:block absolute bottom-6 left-8 z-10">
        <Sparkle className="w-6 h-6 text-mulearn" />
      </div>

      <div className="mx-auto max-w-7xl flex flex-col items-center gap-10">
        {/* Heading */}
        <h2 className="text-center text-5xl font-bold leading-[62.40px]">
          <span>Our </span>
          <span className="text-mulearn">Mission </span>
          <span>&amp; </span>
          <span className="text-mulearn">Growth</span>
        </h2>

        {/* Stat Cards — single column on mobile, row on lg */}
        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-5">
          {stats.map((stat, i) => (
            <Card key={i} className="w-72 p-6 flex flex-col justify-start items-start">
              <div className="self-stretch flex justify-between items-center">
                {/* Left: label, value, badge */}
                <div className="flex-1 flex flex-col justify-start items-start gap-1">
                  <p className="text-sm font-semibold leading-5">{stat.label}</p>
                  <p className="text-3xl font-bold leading-9 pb-1">{stat.value}</p>
                </div>

                <div
                  className={`w-12 h-12 ${stat.iconBg} rounded-xl flex justify-center items-center flex-shrink-0`}
                >
                  <Icon icon={stat.icon} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
