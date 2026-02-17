import { MotionDiv } from "@/components/MuFramer";
import type { OnboardingStep } from "@/lib/types";

interface OnboardingStepsProps {
  data: OnboardingStep[];
}

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ data }) => {
  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Desktop Layout */}
      <div className="hidden md:flex justify-center items-center gap-0">
        {data.map((step, index) => (
          <div key={step.step} className="flex items-center flex-1 max-w-xs">
            <div className="flex flex-col items-center text-center w-full">
              {/* Step Number Box */}
              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg mb-6">
                  <span className="text-white text-2xl font-bold">{step.step}</span>
                </div>
              </MotionDiv>

              {/* Title */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.1, duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-black mb-3">{step.title}</h3>
              </MotionDiv>

              {/* Description */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
              >
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </MotionDiv>
            </div>

            {/* Connecting Line with Overlaid Dots */}
            {index < data.length - 1 && (
              <div className="flex items-center -mx-8 -mt-29">
                <div className="relative w-30 h-0.5 flex items-center">
                  {/* The Continuous Dashed Line */}
                  <div className="absolute inset-0 border-t-2 border-dashed border-blue-600"></div>

                  {/* Start Dot - positioned exactly on the line */}
                  <div className="absolute left-0 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>

                  {/* End Dot - positioned exactly on the line */}
                  <div className="absolute right-0 translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center space-y-8">
        {data.map((step, index) => (
          <div key={step.step} className="flex flex-col items-center text-center max-w-sm">
            {/* Step Number Box */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                <span className="text-white text-2xl font-bold">{step.step}</span>
              </div>
            </MotionDiv>

            {/* Title */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-black mb-3">{step.title}</h3>
            </MotionDiv>

            {/* Description */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </MotionDiv>

            {/* Vertical Connecting Line */}
            {index < data.length - 1 && (
              <div className="flex flex-col items-center py-6">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mb-2"></div>
                <div className="h-12 border-l-2 border-dashed border-blue-600"></div>
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingSteps;
