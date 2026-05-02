"use client";

import { useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef } from "react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";

const INTEREST_GROUPS = [
  { name: "Web Development", icon: "/assets/interestgroups/webdev.svg" },
  { name: "UI/UX Design", icon: "/assets/interestgroups/design.svg" },
  { name: "Game Development", icon: "/assets/interestgroups/game.svg" },
  { name: "AR/VR", icon: "/assets/interestgroups/arvr.svg" },
  { name: "Cloud and DevOps", icon: "/assets/interestgroups/cloud.svg" },
  { name: "Digital Marketing", icon: "/assets/interestgroups/marketing.svg" },
  { name: "Cybersecurity", icon: "/assets/interestgroups/cyber.svg" },
  { name: "Internet Of Things (IOT) And Robotics", icon: "/assets/interestgroups/iot.svg" },
  { name: "Product Management", icon: "/assets/interestgroups/product.svg" },
];

export default function Level4Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white flex flex-col items-center py-10 lg:py-20 overflow-hidden"
      id="level-4"
    >
      {/* Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkle className="absolute top-[15%] left-[5%] text-mulearn-trusty-blue w-3 h-3 fill-mulearn-trusty-blue opacity-30" />
        <Sparkle className="absolute top-[35%] right-[10%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-20" />
        <Sparkle className="absolute bottom-[25%] left-[10%] text-mulearn-trusty-blue w-5 h-5 fill-mulearn-trusty-blue opacity-40" />
        <Sparkle className="absolute top-[8%] right-[25%] text-mulearn-trusty-blue w-2 h-2 fill-mulearn-trusty-blue opacity-20" />
        <Sparkle className="absolute bottom-[15%] right-[8%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10 flex flex-col items-center text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-mulearn-blackish tracking-tight">
            The Path of <span className="text-mulearn-trusty-blue">Choice</span>
          </h2>
          <p className="text-sm md:text-base font-bold text-mulearn-blackish tracking-widest">
            Choose Your Interest Group
          </p>
          <p className="text-xs md:text-sm text-mulearn-blackish max-w-2xl mx-auto leading-relaxed font-medium">
            This is where the hero chooses their tribe. Students anchor under mentors &
            industry-aligned pathways.
          </p>
        </MotionDiv>

        {/* Desktop View: Maintained 5 on top, 4 on bottom structure */}
        <div className="hidden lg:flex flex-col items-center gap-5 w-full">
          {/* Top Row: 5 Cards */}
          <div className="grid grid-cols-5 gap-5 w-full">
            {INTEREST_GROUPS.slice(0, 5).map((group, index) => (
              <MotionDiv
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer hover:scale-[1.03] transition-transform duration-300"
              >
                <MuImage
                  src={group.icon}
                  alt={group.name}
                  width={400}
                  height={250}
                  className="w-full h-auto drop-shadow-xl rounded-2xl"
                />
              </MotionDiv>
            ))}
          </div>

          {/* Bottom Row: 4 Cards (Centered) */}
          <div className="grid grid-cols-4 gap-5 w-full max-w-6xl">
            {INTEREST_GROUPS.slice(5).map((group, index) => (
              <MotionDiv
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: (index + 5) * 0.1 }}
                className="relative group cursor-pointer hover:scale-[1.03] transition-transform duration-300"
              >
                <MuImage
                  src={group.icon}
                  alt={group.name}
                  width={400}
                  height={250}
                  className="w-full h-auto drop-shadow-xl rounded-2xl"
                />
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet View: Single continuous grid to avoid gaps */}
        <div className="grid lg:hidden grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
          {INTEREST_GROUPS.map((group, index) => (
            <MotionDiv
              key={group.name + "-mobile"}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group cursor-pointer hover:scale-[1.03] transition-transform duration-300"
            >
              <MuImage
                src={group.icon}
                alt={group.name}
                width={400}
                height={250}
                className="w-full h-auto drop-shadow-xl rounded-2xl"
              />
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
