import { Award, BookOpen, Briefcase, Target, TrendingUp, Users } from "lucide-react";

const WhyMuLearn = () => {
  const benefits = [
    { icon: BookOpen, title: "A space to access curated resources" },
    { icon: Target, title: "Guidance to practice skills through tasks" },
    { icon: Users, title: "A community that supports consistent learning" },
    { icon: Award, title: "Mentorship from professionals at top companies" },
    { icon: Briefcase, title: "Real-world practice opportunities" },
    {
      icon: TrendingUp,
      title: "A proof-of-work-based learning system that makes your growth visible",
    },
  ];

  return (
    <section className="py-16 md:py-24 ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-gray-900">
            Why <span className="text-[#456FF6]">μLearn</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Learn by doing. Grow with purpose.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            const isMiddleColumn = index === 1 || index === 4;

            return (
              <div
                key={benefit.title}
                className={`bg-white border border-[#456FF6] rounded-xl p-7 
                           shadow-sm hover:shadow-xl transition-all duration-500
                           ${isMiddleColumn ? "lg:-translate-y-10" : "lg:translate-y-0"}`}
              >
                {/* Icon Container */}
                <div className="w-12 h-12 bg-[#456FF6] rounded-lg flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>

                {/* Card Content */}
                <p className="text-gray-800 text-lg font-medium leading-snug">{benefit.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMuLearn;
