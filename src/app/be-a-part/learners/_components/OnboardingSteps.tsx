import { Lightbulb } from "lucide-react";
import { Fragment } from "react";
import { FaDiscord } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import type { OnboardingStep } from "@/lib/types";

interface OnboardingStepsProps {
  data: OnboardingStep[];
}

const getStepIcon = (step: number) => {
  switch (step) {
    case 1:
      return <div className="text-mulearn-whitish text-5xl font-bold">μ</div>;
    case 2:
      return <FaDiscord className="w-12 h-12 text-mulearn-whitish" />;
    case 3:
      return <Lightbulb className="w-12 h-12 text-mulearn-whitish" />;
    default:
      return <div className="text-mulearn-whitish text-4xl font-bold">μ</div>;
  }
};

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ data }) => {
  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="hidden lg:flex justify-center items-start relative gap-8">
        {data.map((step, index) => (
          <Fragment key={step.step}>
            <Card variant="hoverable" className="flex-1 max-w-sm">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    {getStepIcon(step.step)}
                  </div>

                  <span className="absolute top-1/2 -translate-y-1/2 -right-4 bg-black text-mulearn-whitish border-4 border-mulearn-whitish rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-md">
                    0{step.step}
                  </span>
                </div>

                <h3 className="mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>

            {index < data.length - 1 && (
              <div className="flex items-center mt-16">
                <div className="w-20 h-1 bg-black"></div>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="lg:hidden flex flex-col items-center space-y-8">
        {data.map((step, index) => (
          <Fragment key={step.step}>
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="relative mb-4">
                  <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    {getStepIcon(step.step)}
                  </div>
                  <span className="absolute top-1/2 -translate-y-1/2 -right-4 bg-black text-mulearn-whitish border-4 border-mulearn-whitish rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shadow-md">
                    0{step.step}
                  </span>
                </div>

                <h3 className="mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>

            {index < data.length - 1 && (
              <div className="text-mulearn-blackish" aria-hidden="true">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default OnboardingSteps;
