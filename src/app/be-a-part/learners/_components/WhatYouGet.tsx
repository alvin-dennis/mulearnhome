import { Briefcase, GraduationCap, Target, TrendingUp, Trophy, Users } from "lucide-react";
import React from "react";

const WhatYouGet = () => {
  const benefits = [
    {
      icon: GraduationCap,
      title: "Structured Learning Paths",
      description: "Guided tracks that take you from beginner to confident explorer.",
    },
    {
      icon: Target,
      title: "Real Projects",
      description: "Create meaningful work that becomes part of your portfolio.",
    },
    {
      icon: Trophy,
      title: "Karma Points",
      description: "Visible proof of your consistency, progress, and effort.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Peers, mentors, and industry visitors who help you grow.",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description:
        "Challenges, workshops, and tracks that help you apply your skills beyond the learning space.",
    },
    {
      icon: Briefcase,
      title: "Career Exposure",
      description:
        "Connect with companies, take part in hiring challenges, and mentorship from top MNCs.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      {/* Increased padding-left (px-16) to ensure the outside bars don't hit the screen edge */}
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            What You Get as
            <br />a <span className="text-[#456FF6]">Learner</span>?
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-10">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative"
              >
                {/* THE OUTSIDE BLUE BAR:
                   - left-[-12px]: Moves it entirely outside the card.
                   - rounded-full: Creates the perfect pill shape at both ends.
                   - z-[-1]: Ensures it doesn't overlap the card border if they touch.
                */}
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[10px] h-16 bg-[#456FF6] rounded-full transition-all duration-300 group-hover:h-20"></div>

                {/* Icon Container */}
                <div className="w-12 h-12 bg-[#456FF6] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[15px]">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
