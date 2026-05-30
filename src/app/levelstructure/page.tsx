"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useState } from "react";
import { MotionDiv } from "@/components/MuFramer";

import Level1Section from "./_components/Level1Section";
import Level2Section from "./_components/Level2Section";
import Level3Section from "./_components/Level3Section";
import Level4Section from "./_components/Level4Section";
import Level5Section from "./_components/Level5Section";
import Level6Section from "./_components/Level6Section";
import Level7Section from "./_components/Level7Section";

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
  noPadding?: boolean;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  id,
  className,
  style = {},
  children,
  "aria-label": ariaLabel,
  noPadding = false,
}) => (
  <section
    id={id}
    data-flow-section
    aria-label={ariaLabel}
    className={cx("relative min-h-screen w-full overflow-hidden bg-mulearn-whitish", className)}
  >
    <div
      data-flow-inner
      className={cx(
        "flow-art-container relative w-full",
        noPadding
          ? "min-h-screen flex flex-col"
          : "flex min-h-screen flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]",
        "will-change-transform",
      )}
      style={{ transformOrigin: "bottom left", ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

export const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (!inner) return;

        if (i > 0) {
          // Pre-rotate and translate incoming section significantly to look like a flipping page/wheel
          gsap.set(inner, { rotation: 28, y: 150, transformOrigin: "bottom left" });
          const tween = gsap.to(inner, {
            rotation: 0,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      // Snapping Scroll behavior: custom dynamic snapping to keep sections centered
      triggers.push(
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: { min: 0.4, max: 0.9 },
            delay: 0.15,
            ease: "power2.out",
          },
        }),
      );

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx("w-full overflow-x-hidden", className)}
    >
      {children}
    </main>
  );
};

export default function LevelStructure() {
  return (
    <div className="min-h-screen bg-mulearn-whitish">
      <AnimatePresence mode="wait">
        <FlowArt>
          {/* Section 0: Intro Landing page */}
          <FlowSection noPadding>
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/assets/levelstructure/bg_image1.svg')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-16 sm:mt-0 space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-mulearn-blackish tracking-tight leading-[1.1]">
                  The <span className="text-mulearn">µLearn</span> Odyssey
                </h1>

                <div className="text-sm sm:text-base md:text-lg text-mulearn-gray-600 max-w-3xl mx-auto space-y-4 leading-relaxed font-medium">
                  <p>
                    All learners enter their college life with a bag full of hopes and pocket full
                    dreams. However,for the majority of them,the next 3 or 4 years will be
                    predictable-attend lectures,write some exams,finish the degree and so on.
                  </p>
                  <p>Like every single one around them,they hold some quiet dreams within them.</p>
                  <ul className="list-none inline-block text-left space-y-2 py-2 border-y border-mulearn/20">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mulearn" />
                      Maybe they love coding
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mulearn" />
                      Maybe they sketch during lectures
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mulearn" />
                      Maybe they dream of building things on their own
                    </li>
                  </ul>
                  <p>But all of these remain invisible until spoken aloud.</p>
                  <p className="font-semibold text-mulearn-blackish text-base sm:text-lg md:text-xl">
                    And exactly at this point,their journey with µlearn begins.
                  </p>
                </div>

                <div className="pt-10 pb-16 flex flex-col items-center select-none w-full max-w-sm">
                  <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 80 }}
                    className="relative w-full bg-mulearn-whitish border border-mulearn-greyish/30 rounded-lg p-6 shadow-[3px_5px_25px_rgba(0,0,0,0.02)] hover:shadow-[5px_8px_35px_rgba(0,0,0,0.05)] hover:border-mulearn/40 transition-all duration-500 group text-left cursor-pointer"
                    onClick={() => {
                      document.getElementById("level-1")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    whileHover={{ y: -4, rotate: -1 }}
                  >
                    {/* Ring Binder Spiral Holes (Left edge) */}
                    <div className="absolute top-6 bottom-6 left-2 flex flex-col justify-between w-2 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative flex items-center">
                          {/* Inner dark shadow hole */}
                          <div className="w-2.5 h-2.5 rounded-full bg-mulearn-blackish/20 shadow-inner" />
                          {/* Silver metal loop */}
                          <div className="absolute w-5 h-4 border-2 border-t-0 border-l-0 border-mulearn-greyish rounded-br-lg -left-1.5 top-[-2px] shadow-sm transform rotate-12" />
                        </div>
                      ))}
                    </div>

                    {/* Ruled Paper Lining */}
                    <div className="pl-6 border-l-2 border-mulearn-greyish/40 space-y-4 font-sans relative">
                      {/* Notebook Header */}
                      <div className="flex items-center justify-between border-b border-mulearn-greyish/20 pb-1">
                        <span className="text-[11px] font-bold tracking-widest text-mulearn-gray-600 uppercase">
                          Notes
                        </span>
                        <span className="text-[9px] font-mono text-mulearn-gray-600">
                          Page 1 of 7
                        </span>
                      </div>

                      {/* Handwritten Scribbles & Sketches */}
                      <div className="space-y-3 text-sm text-mulearn-blackish font-medium leading-relaxed tracking-tight relative">
                        <p className="line-through decoration-mulearn-gray-600/40 opacity-40 font-normal">
                          Attend class. Get degree. Predictable.
                        </p>

                        <p className="text-mulearn-trusty-blue font-bold flex items-center gap-1">
                          <span>Create something real.</span>
                        </p>

                        <div className="text-mulearn-duke-purple font-bold flex items-center gap-1.5">
                          <span>Descend into the levels</span>
                          {/* Hand-drawn inline SVG arrow */}
                          <svg
                            className="w-4 h-4 text-mulearn animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </div>

                        {/* Little hand-drawn star SVG doodle positioned in corner */}
                        <div className="absolute right-0 bottom-4 opacity-70 text-mulearn-trusty-blue">
                          <svg
                            className="w-6 h-6 animate-spin"
                            style={{ animationDuration: "15s" }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M12 2L14.8 8.6L22 9.2L16.5 13.9L18.3 21L12 17.3L5.7 21L7.5 13.9L2 9.2L9.2 8.6L12 2Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Footer Trigger */}
                      <div className="pt-2 flex items-center justify-between border-t border-mulearn-greyish/20 text-[11px] font-bold text-mulearn-gray-600 group-hover:text-mulearn transition-colors duration-300">
                        <span>Turn to page 2...</span>
                        <span className="text-[9px] font-mono opacity-60">TAP OR SCROLL</span>
                      </div>
                    </div>

                    {/* Hanging Bookmark Ribbon String (acting as physical scroll trigger) */}
                    <div className="absolute -bottom-10 left-[60%] flex flex-col items-center">
                      {/* String cord */}
                      <MotionDiv
                        className="w-1 h-12 bg-mulearn rounded-full origin-top"
                        animate={{ rotate: [-4, 4, -4], y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      />
                      {/* Little circular card tag representing story start */}
                      <MotionDiv
                        className="w-4 h-4 rounded-full bg-mulearn-whitish border-2 border-mulearn shadow-sm flex items-center justify-center -mt-1 text-[8px] font-bold text-mulearn"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        µ
                      </MotionDiv>
                    </div>
                  </MotionDiv>
                </div>
              </div>
            </div>
          </FlowSection>

          {/* Levels Sections wrapped in FlowSections */}
          <FlowSection id="level-1" noPadding>
            <Level1Section />
          </FlowSection>

          <FlowSection id="level-2" noPadding>
            <Level2Section />
          </FlowSection>

          <FlowSection id="level-3" noPadding>
            <Level3Section />
          </FlowSection>

          <FlowSection id="level-4" noPadding>
            <Level4Section />
          </FlowSection>

          <FlowSection id="level-5" noPadding>
            <Level5Section />
          </FlowSection>

          <FlowSection id="level-6" noPadding>
            <Level6Section />
          </FlowSection>

          <FlowSection id="level-7" noPadding>
            <Level7Section />
          </FlowSection>
        </FlowArt>
      </AnimatePresence>
    </div>
  );
}
