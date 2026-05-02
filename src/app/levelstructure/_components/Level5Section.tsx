"use client";

import { useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef } from "react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";

export default function Level5Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white flex items-center py-10 lg:py-20 overflow-hidden"
      id="level-5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Visual Section: Static Container for Sparkles & Planets, Animating Astronaut */}
          <div className="relative flex items-center justify-center lg:justify-start lg:-ml-32 min-h-[500px]">
            {/* Static Planets/Meteor - Moved closer to the text section */}
            <div className="absolute top-[40%] left-[55%] w-[450px] md:w-[500px] h-auto opacity-80 pointer-events-none z-0">
              <MuImage
                src="/assets/levelstructure/planets_lvl5.svg"
                alt="Floating Planets"
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>

            {/* Animating Astronaut Only - Pushed further left */}
            <MotionDiv
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[480px] hover:-translate-y-4 transition-transform duration-700 ease-in-out"
            >
              <MuImage
                src="/assets/levelstructure/astronaut4.svg"
                alt="The Global Arena Astronaut"
                width={480}
                height={480}
                className="w-full h-auto object-contain"
              />
            </MotionDiv>

            {/* Static Sparkles - No slide-in animation */}
            <Sparkle className="absolute top-[10%] left-[20%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-50" />
            <Sparkle className="absolute bottom-[20%] right-[10%] text-mulearn-trusty-blue w-6 h-6 fill-mulearn-trusty-blue opacity-30" />
            <Sparkle className="absolute top-[50%] left-[5%] text-mulearn-trusty-blue w-3 h-3 fill-mulearn-trusty-blue opacity-25" />
            <Sparkle className="absolute bottom-[10%] left-[40%] text-mulearn-trusty-blue w-5 h-5 fill-mulearn-trusty-blue opacity-20" />
          </div>

          {/* Right Text Section */}
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 relative z-20"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-mulearn-blackish tracking-tight">
                The <span className="text-mulearn-trusty-blue">Global Arena</span>
              </h2>
              <p className="text-xl font-bold text-mulearn-blackish">
                Challenges, Hackathons & Competitions
              </p>
              <p className="text-sm md:text-base text-mulearn-blackish  leading-relaxed max-w-2xl">
                The student now steps onto global battlegrounds. Facing global peers raises the bar,
                sharpens skills, and builds recognition.
              </p>
            </div>

            {/* List with segmented line */}
            <div className="space-y-6 relative pl-8">
              {/* Segmented Line Simulation */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] flex flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 bg-mulearn-trusty-blue rounded-full" />
                ))}
              </div>

              {[
                { label: "AI Students", text: '"Competing in Kaggle & LLM hackathons."' },
                { label: "Film Group", text: '"Submitting to online festivals & comic cons."' },
                {
                  label: "Civil Engineers",
                  text: '"Sustainable city models in design challenges."',
                },
                {
                  label: "Space/Cosmos Tribe",
                  text: '"Writing proposals for CubeSat challenges."',
                },
              ].map((item, i) => (
                <div key={i} className="py-1">
                  <p className="text-sm md:text-base text-mulearn-blackish">
                    <span className="font-bold">{item.label}:</span> <span>{item.text}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Impact Card */}
            <div className="bg-white border-[1.5px] border-mulearn-blackish rounded-[2.5rem] p-8 shadow-sm max-w-xl">
              <p className="text-sm md:text-base text-mulearn-blackish leading-relaxed">
                <span className="font-bold">The Impact</span>
                <br />
                Learners transform into contributors, not just participants. Global competition
                builds real-world credibility and industry recognition.
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
