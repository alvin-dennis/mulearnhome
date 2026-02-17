"use client";

import { Box, Globe, LineChart, TrendingUp, Zap } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";

/* ✅ DEFINE TYPE OUTSIDE */
type Benefit = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const WhyKarmaPoints = () => {
  const benefits: Benefit[] = [
    {
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      title: "Shows real progress",
      description:
        "Karma grows only when you take action, making it a true reflection of your work.",
    },
    {
      icon: <Box className="w-7 h-7 text-white" />,
      title: "Builds consistency",
      description: "Regular earning helps you stay active and develop strong learning habits.",
    },
    {
      icon: <Globe className="w-7 h-7 text-white" />,
      title: "Improves visibility",
      description: "Active learners stand out in guilds and the wider community.",
    },
    {
      icon: <Zap className="w-7 h-7 text-white" />,
      title: "Highlights engagement",
      description: "Karma increases when you participate, contribute and collaborate.",
    },
    {
      icon: <LineChart className="w-7 h-7 text-white" />,
      title: "Proof of growth",
      description:
        "Karma acts as a visible proof-of-work, showing your dedication and skill development.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            Why Karma Points Matter
            <br />
            in <span className="text-blue-600">µLearn</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Karma points represent your real effort inside µLearn. They show how active, consistent
            and committed you are as you complete tasks.
          </p>
        </MotionDiv>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mb-16">
            {benefits.slice(0, 3).map((benefit, index) => (
              <Card key={index} benefit={benefit} index={index} />
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 max-w-4xl mx-auto">
            {benefits.slice(3, 5).map((benefit, index) => (
              <Card key={index + 3} benefit={benefit} index={index + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ✅ USE TYPE HERE */
const Card = ({ benefit, index }: { benefit: Benefit; index: number }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative pt-8"
  >
    <div className="bg-white rounded-xl p-8 pt-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 h-full flex flex-col items-center text-center">
      {/* Icon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#0052FF] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
        {benefit.icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
      <p className="text-gray-600 leading-relaxed text-[15px]">{benefit.description}</p>
    </div>
  </MotionDiv>
);

export default WhyKarmaPoints;
