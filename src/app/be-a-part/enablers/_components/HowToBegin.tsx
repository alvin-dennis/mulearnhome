"use client";

import { MotionDiv } from "@/components/MuFramer";

const steps = [
  {
    step: 1,
    title: "Create your µLearn account",
    description: "Register as µLearn Enabler",
    bold: true,
  },
  {
    step: 2,
    title: "Connect with your Chapter leads",
    description: "Know their interests, abilities and plan.",
  },
  {
    step: 3,
    title: "Review Chapter health",
    description: "Analyze current chapter growth and design your own plan.",
  },
  {
    step: 4,
    title: "Conduct Periodic Check-Ins",
    description: "Plan monthly/weekly meetings for knowing impact of latest activities",
  },
  {
    step: 5,
    title: "Encourage task completions",
    description: "Complete tasks, collaborate, and grow your karma points.",
  },
];

const SparkleIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
      fill="black"
    />
  </svg>
);

// Dashed connector with dots at both ends
const Connector = () => (
  <div className="flex items-center h-16 px-1 flex-shrink-0">
    <div className="relative flex items-center w-20 lg:w-28 h-0.5">
      <div className="w-full border-t-2 border-dashed border-[#456FF6]" />
      <div className="absolute left-0 w-2 h-2 bg-[#456FF6] rounded-full -translate-x-1/2" />
      <div className="absolute right-0 w-2 h-2 bg-[#456FF6] rounded-full translate-x-1/2" />
    </div>
  </div>
);

const StepBox = ({
  step,
  title,
  description,
  bold,
  index,
}: {
  step: number;
  title: string;
  description: string;
  bold?: boolean;
  index: number;
}) => (
  <div className="flex flex-col items-center w-36 lg:w-44 text-center">
    <MotionDiv
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.45 }}
      className="mb-5"
    >
      <div className="w-16 h-16 bg-[#456FF6] rounded-xl flex items-center justify-center shadow-md">
        <span className="text-white text-2xl font-bold font-['Plus_Jakarta_Sans']">{step}</span>
      </div>
    </MotionDiv>

    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
    >
      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      <p
        className={`text-[11px] leading-relaxed font-['Plus_Jakarta_Sans'] ${
          bold ? "text-[#456FF6] font-bold not-italic" : "text-gray-500 italic"
        }`}
      >
        {description}
      </p>
    </MotionDiv>
  </div>
);

export default function Onboarding() {
  const row1 = steps.slice(0, 3);
  const row2 = steps.slice(3, 5);

  return (
    <section className="hidden md:block w-full relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 py-16 px-6">
      {/* Sparkle accents */}
      <div className="absolute top-8 right-16 opacity-60">
        <SparkleIcon size={18} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-60">
        <SparkleIcon size={14} />
      </div>

      {/* Character illustration — top right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/be-a-part/enabler-character.svg"
        alt="Enabler character"
        className="absolute top-4 right-8 w-24 h-24 object-contain opacity-90 pointer-events-none"
      />

      <div className="mx-auto max-w-5xl flex flex-col items-center gap-12">
        {/* Heading */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans'] text-gray-900 leading-tight">
            How to begin as an Enabler
          </h2>
        </MotionDiv>

        {/* Steps */}
        <div className="flex flex-col items-center gap-10 w-full">
          {/* Row 1 — steps 1, 2, 3 */}
          <div className="hidden md:flex justify-center items-start">
            {row1.map((s, i) => (
              <div key={s.step} className="flex items-start">
                <StepBox
                  step={s.step}
                  title={s.title}
                  description={s.description}
                  bold={(s as { bold?: boolean }).bold}
                  index={i}
                />
                {i < row1.length - 1 && <Connector />}
              </div>
            ))}
          </div>

          {/* Row 2 — steps 4, 5 (centered) */}
          <div className="hidden md:flex justify-center items-start">
            {row2.map((s, i) => (
              <div key={s.step} className="flex items-start">
                <StepBox step={s.step} title={s.title} description={s.description} index={i + 3} />
                {i < row2.length - 1 && <Connector />}
              </div>
            ))}
          </div>

          {/* Mobile — single column */}
          <div className="md:hidden flex flex-col items-center gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="flex flex-col items-center">
                <StepBox
                  step={s.step}
                  title={s.title}
                  description={s.description}
                  bold={(s as { bold?: boolean }).bold}
                  index={i}
                />
                {i < steps.length - 1 && (
                  <div className="flex flex-col items-center mt-4 h-10">
                    <div className="w-2 h-2 bg-[#456FF6] rounded-full" />
                    <div className="flex-1 border-l-2 border-dashed border-[#456FF6] my-0.5" />
                    <div className="w-2 h-2 bg-[#456FF6] rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
