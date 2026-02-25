import Link from "next/link";
import { Button } from "@/components/ui/button";

const LearnersHero = () => {
  return (
    <div className="relative overflow-hidden py-20 lg:py-32">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
          <span className="text-black">Unlock Your Potential</span>
          <br />
          <span className="text-black">with </span>
          <span className="text-blue-600">μLearn</span>
        </h1>

        {/* Subtitle */}
        <p className="font-semibold text-base sm:text-lg lg:text-xl leading-relaxed tracking-wide text-center mb-4 max-w-4xl lg:whitespace-nowrap">
          Try new skills, learn at your own pace, and build confidence through real-world, hands-on
          experience.
          <br />
          <span className="inline-block lg:pl-20">
            μLearn connects your curiosity with the right resources, action, and proof-of-work.
          </span>
        </p>

        {/* Tagline */}
        <p className="font-bold text-base sm:text-lg lg:text-xl leading-relaxed tracking-normal text-center text-[#456FF6] mb-6 lg:whitespace-nowrap">
          Stay Curious | Stay Active | Grow Every Day.
        </p>

        {/* CTA Button */}
        <Button
          variant="default"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          asChild
        >
          <Link href="https://app.mulearn.org" target="_blank" rel="noopener noreferrer">
            Join Now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LearnersHero;
