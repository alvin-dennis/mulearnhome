"use client";

const stories = [
  {
    name: "Arjun Menon",
    role: "Campus Enabler, CUSAT",
    quote:
      "Being a µLearn enabler helped me grow my network and lead my college community to achieve real-world outcomes.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#3B82F6",
    initials: "AM",
  },
  {
    name: "Sneha Krishnan",
    role: "Campus Enabler, TKM College",
    quote:
      "The enabler program gave me the tools and confidence to mentor my peers and make a real impact on campus.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#6366F1",
    initials: "SK",
  },
  {
    name: "Rahul Das",
    role: "Campus Enabler, GEC Palakkad",
    quote:
      "Through µLearn I connected with industry leaders and opened doors I never thought were possible as a student.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#0EA5E9",
    initials: "RD",
  },
  {
    name: "Meghna Nair",
    role: "Campus Enabler, MEC",
    quote:
      "Organizing events and guiding students has been the most rewarding experience of my college life, thanks to µLearn.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#8B5CF6",
    initials: "MN",
  },
  {
    name: "Vishnu Prasad",
    role: "Campus Enabler, College of Engineering Trivandrum",
    quote:
      "The skills and proof-of-work culture at µLearn shaped how I approach learning and leadership every single day.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#EC4899",
    initials: "VP",
  },
  {
    name: "Aishwarya Rajan",
    role: "Campus Enabler, NIT Calicut",
    quote:
      "I grew from a quiet student to a confident campus leader — µLearn made that transformation possible for me.",
    avatar: "/assets/be-a-part/enabler-character.svg",
    color: "#F59E0B",
    initials: "AR",
  },
];

export default function SuccessStories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
          <span className="text-gray-900">Success Stories from </span>
          <span className="text-blue-500">µLearn Community</span>
        </h2>
      </div>

      {/* Cards + gradient overlay wrapper */}
      <div className="relative w-full">
        {/* Scrollable card row */}
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" } as React.CSSProperties}
        >
          {stories.map((story, i) => (
            <div
              key={i}
              className="
                flex-shrink-0 snap-start
                w-[160px] md:w-[240px]
                bg-white rounded-2xl
                shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]
                border border-gray-100
                p-4 md:p-6
                flex flex-col items-center gap-3 md:gap-4
              "
            >
              {/* Avatar — circular with initials fallback */}
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-sm md:text-xl font-bold font-['Plus_Jakarta_Sans'] flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: story.color }}
              >
                {story.initials}
              </div>

              {/* Name & Role — hidden on mobile to match skeleton look */}
              <div className="w-full flex flex-col items-center gap-1">
                <p className="text-gray-900 text-xs md:text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5 text-center truncate w-full">
                  {story.name}
                </p>
                <p className="text-gray-500 text-[10px] md:text-xs font-medium font-['Plus_Jakarta_Sans'] leading-4 text-center line-clamp-1">
                  {story.role}
                </p>
              </div>

              {/* Quote — only on desktop */}
              <p className="hidden md:block text-gray-600 text-xs font-['Plus_Jakarta_Sans'] leading-5 text-center line-clamp-4">
                &ldquo;{story.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Left gradient fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10" />
        {/* Right gradient fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10" />
      </div>

      {/* Scroll hint sparkle — desktop only */}
      <div className="hidden md:flex justify-end mt-4 pr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          viewBox="0 0 25 25"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
            fill="black"
          />
        </svg>
      </div>
    </section>
  );
}
