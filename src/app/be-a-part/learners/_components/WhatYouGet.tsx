import { Briefcase, GraduationCap, Target, TrendingUp, Trophy, Users } from "lucide-react";

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
    <section className="py-16 md:py-20 container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            What You Get as
            <br />a <span className="text-blue-600">Learner</span>?
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-600 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Blue accent bar on the left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>

                {/* Icon */}
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>

                {/* Description */}
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
