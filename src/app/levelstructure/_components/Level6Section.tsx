"use client";

import { useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef } from "react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";

export default function Level6Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white flex items-center py-10 lg:py-20 overflow-hidden"
      id="level-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Text Section */}
          <MotionDiv
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-mulearn-blackish tracking-tight">
                Build & <span className="text-mulearn-trusty-blue">Ship</span>
              </h2>
              <p className="text-xl font-bold text-mulearn-blackish">
                Proof-of-Impact & Real Users
              </p>
              <p className="text-sm md:text-base text-mulearn-blackish leading-relaxed max-w-2xl">
                Every hero must build their sword. Here, they don&apos;t just make prototypes. They
                ship to real users.
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
                { label: "AI Team", text: '"Mental wellness chatbot → deployed in colleges."' },
                { label: "Web Dev Team", text: '"Alumni-network portal → adopted by campus."' },
                {
                  label: "Civil + Mechanical",
                  text: '"Water filter prototype → tested with NGOs."',
                },
                {
                  label: "Film + Comics",
                  text: '"Gamified storytelling series → shared in schools."',
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
            <div className="bg-white border-[1.5px] border-mulearn-blackish rounded-[2.5rem] p-8 shadow-sm max-w-2xl">
              <p className="text-sm md:text-base text-mulearn-blackish leading-relaxed">
                <span className="font-bold">The Impact</span>
                <br />
                Shipping builds accountability, feedback flow, and real-world value. Proof-of-work
                matures into proof-of-impact.
                <br />
                <br />
                Students grow into builders & interdisciplinary collaborators who create things that
                others use.
              </p>
            </div>
          </MotionDiv>

          {/* Right Visual Section: Astronauts */}
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative z-10 w-full max-w-[550px] hover:-translate-y-4 transition-transform duration-700 ease-in-out">
              <MuImage
                src="/assets/levelstructure/astronauts.svg"
                alt="Build & Ship Astronauts"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Sparkles around astronauts */}
            <Sparkle className="absolute top-[10%] right-[20%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-50" />
            <Sparkle className="absolute bottom-[40%] left-[10%] text-mulearn-trusty-blue w-6 h-6 fill-mulearn-trusty-blue opacity-30" />

            {/* Purple portal at bottom right - Moved even further down */}
            <div className="absolute bottom-[-30%] right-[10%] w-64 h-64 md:w-72 md:h-72 opacity-50 z-0">
              <MuImage
                src="/assets/levelstructure/galaxy_lvl6.svg"
                alt="Portal"
                width={288}
                height={288}
                className="w-full h-full object-contain animate-spin-slow"
              />
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
