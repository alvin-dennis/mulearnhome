import { Award, BookOpen, Briefcase, Target, TrendingUp, Users } from "lucide-react";

const WhyMuLearn = () => {
  const benefits = [
    {
      icon: BookOpen,
      title: "A space to access curated resources",
    },
    {
      icon: Target,
      title: "Guidance to practice skills through tasks",
    },
    {
      icon: Users,
      title: "A community that supports consistent learning",
    },
    {
      icon: Award,
      title: "Mentorship from professionals at top companies",
    },
    {
      icon: Briefcase,
      title: "Real-world practice opportunities",
    },
    {
      icon: TrendingUp,
      title: "A proof-of-work-based learning system that makes your growth visible",
    },
  ];

  return (
    <section className="py-16 md:py-20 container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Why <span className="text-blue-600">μLearn</span>?
          </h2>
          <p className="text-lg md:text-xl text-black font-medium">
            Learn by doing. Grow with purpose.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 lg:p-8 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <p className="text-base lg:text-lg text-gray-800 font-normal leading-relaxed">
                  {benefit.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMuLearn;
