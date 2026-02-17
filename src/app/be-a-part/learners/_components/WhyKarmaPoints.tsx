"use client";

import { Box, Globe, LineChart, TrendingUp, Zap } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";

const WhyKarmaPoints = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Shows real progress",
      description:
        "Karma grows only when you take action, making it a true reflection of your work.",
    },
    {
      icon: <Box className="w-8 h-8 text-white" />,
      title: "Builds consistency",
      description: "Regular earning helps you stay active and develop strong learning habits.",
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Improves visibility",
      description: "Active learners stand out in guilds and the wider community.",
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Highlights engagement",
      description: "Karma increases when you participate, contribute and collaborate.",
    },
    {
      icon: <LineChart className="w-8 h-8 text-white" />,
      title: "Proof of growth",
      description:
        "Karma acts as a visible proof-of-work, showing your dedication and skill development.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            Why Karma Points Matter
            <br />
            in <span className="text-blue-600">µLearn</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Karma points represent your real effort inside µLearn. They show how active, consistent
            and committed you are as you complete tasks, take challenges and engage with the
            community.
          </p>
        </MotionDiv>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto">
          {/* First Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {benefits.slice(0, 3).map((benefit, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    {benefit.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black mb-4">{benefit.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Second Row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.slice(3, 5).map((benefit, index) => (
              <MotionDiv
                key={index + 3}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 3) * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    {benefit.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black mb-4">{benefit.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKarmaPoints;
