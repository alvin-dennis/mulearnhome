"use client";

import { useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef } from "react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";

export default function Level7Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center py-10 lg:py-20 overflow-hidden min-h-[90vh]"
      id="level-7"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <MuImage
          src="/assets/levelstructure/bg_lvl7.svg"
          alt="μVerse Background"
          fill
          className="object-cover object-center opacity-90"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10 flex flex-col items-center text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-mulearn-blackish tracking-tight">
            Welcome to the <span className="text-mulearn-trusty-blue">μVerse</span>
          </h2>
          <p className="text-lg md:text-2xl text-mulearn-blackish max-w-4xl mx-auto font-medium leading-relaxed">
            Where learning transforms into opportunity, and students become global contributors.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-24">
          {[
            {
              title: "Access",
              text: "Direct pathways to fellowships, startups, and global opportunities curated for your journey.",
            },
            {
              title: "Network",
              text: "Connect with mentors, industry leaders, and peers who accelerate your growth.",
            },
            {
              title: "Impact",
              text: "Build solutions that matter, ship to real users, and contribute to meaningful projects.",
            },
          ].map((card, i) => (
            <MotionDiv
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-mulearn-whitish border-[1.5px] border-mulearn-blackish rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-mulearn-blackish mb-4">
                {card.title}
              </h3>
              <p className="text-base md:text-lg text-mulearn-blackish/80 leading-relaxed font-medium">
                {card.text}
              </p>
            </MotionDiv>
          ))}
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="w-24 h-[3px] bg-mulearn-duke-purple mx-auto rounded-full" />
          <p className="text-lg md:text-xl text-mulearn-blackish font-semibold leading-relaxed">
            The μVerse is not a destination. It&apos;s a continuous cycle of learning, building, and
            contributing that keeps you growing throughout your career.
          </p>
        </MotionDiv>

        <div className="absolute inset-0 pointer-events-none opacity-40">
          <Sparkle className="absolute top-[15%] left-[5%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue" />
          <Sparkle className="absolute top-[40%] right-[10%] text-mulearn-trusty-blue w-6 h-6 fill-mulearn-trusty-blue" />
          <Sparkle className="absolute bottom-[20%] left-[15%] text-mulearn-trusty-blue w-5 h-5 fill-mulearn-trusty-blue" />
          <Sparkle className="absolute top-[60%] left-[45%] text-mulearn-trusty-blue w-3 h-3 fill-mulearn-trusty-blue" />
        </div>
      </div>
    </section>
  );
}
