import Link from "next/link";
import { Button } from "@/components/ui/button";

const LearnersHero = () => {
  return (
    <div className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute right-1/4 pr-6 top-12 text-mulearn-blackish hidden lg:block ">
        <svg
          width="60"
          height="100"
          viewBox="0 0 24 24"
          fill="currentColor"
          strokeWidth="1"
          aria-hidden="true"
          focusable="false"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />
        </svg>
      </div>

      <div className="absolute right-1/4 pr-5  top-24 text-mulearn-blackish  hidden lg:block ">
        <svg
          width="20"
          height="50"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />
        </svg>
      </div>

      <div className="absolute left-1/5 pl-12 bottom-32 text-mulearn-blackish  hidden lg:block ">
        <svg
          width="20"
          height="50"
          viewBox="0 0 24 24"
          fill="currentColor"
          strokeWidth="1"
          aria-hidden="true"
          focusable="false"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
      <div className="absolute left-1/5   bottom-32 text-mulearn-blackish  hidden lg:block ">
        <svg
          width="60"
          height="100"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          shapeRendering="geometricPrecision"
        >
          <path
            d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
          <span>Unlock Your Potential</span>
          <br />
          <span>with </span>
          <span className="text-mulearn">μLearn</span>
        </h1>

        <p className="font-semibold text-base sm:text-lg lg:text-xl leading-relaxed tracking-wide text-center mb-4 max-w-4xl lg:whitespace-nowrap">
          Try new skills, learn at your own pace, and build confidence through real-world, hands-on
          experience.
          <br />
          <span className="inline-block lg:pl-20">
            μLearn connects your curiosity with the right resources, action, and proof-of-work.
          </span>
        </p>

        <p className="font-bold text-base sm:text-lg lg:text-xl leading-relaxed tracking-normal text-center text-mulearn-trusty-blue mb-6 lg:whitespace-nowrap">
          Stay Curious | Stay Active | Grow Every Day.
        </p>

        <Button variant="default" className="mt-4 px-8 py-4" asChild>
          <Link href="https://app.mulearn.org" target="_blank" rel="noopener noreferrer">
            Join Now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LearnersHero;
