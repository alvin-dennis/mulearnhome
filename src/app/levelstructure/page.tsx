"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import WelcomePage from "./_components/WelcomePage";

export default function LevelStructure() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBeginJourney = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowWelcome(true);
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-mulearn-whitish">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomePage key="welcome" />
        ) : (
          <MotionDiv
            key="main"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/assets/levelstructure/bg_image1.svg')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-16 sm:mt-0">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-mulearn-blackish tracking-tight mb-6 sm:mb-8 leading-[1.1]">
                  The <span className="text-mulearn">µLearn</span>
                  <br />
                  Learning Odyssey
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-mulearn-gray-600 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-medium">
                  Step into an unexplored universe where you design your own trajectory through 7
                  levels of transformation
                </p>

                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isAnimating
                      ? {
                          scale: [1, 1.2, 1.4, 2, 5, 0],
                          opacity: [1, 1, 1, 0.8, 0.3, 0],
                          filter: [
                            "brightness(1) blur(0px)",
                            "brightness(1.2) blur(0px)",
                            "brightness(1.5) blur(1px)",
                            "brightness(2) blur(2px)",
                            "brightness(3) blur(5px)",
                            "brightness(5) blur(10px)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: isAnimating ? 1.5 : 0.2,
                    ease: isAnimating ? [0.25, 0.46, 0.45, 0.94] : "easeOut",
                  }}
                >
                  <Button
                    onClick={handleBeginJourney}
                    disabled={isAnimating}
                    className={`bg-mulearn text-mulearn-whitish hover:bg-mulearn/90 px-8 py-6 rounded-xl text-base sm:text-lg font-medium shadow-lg shadow-mulearn/25 transition-all ${
                      isAnimating ? "cursor-not-allowed opacity-80" : ""
                    }`}
                  >
                    Begin Your Journey
                  </Button>
                </MotionDiv>
              </div>
            </main>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
