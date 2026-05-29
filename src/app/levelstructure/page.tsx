import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import Level1Section from "./_components/Level1Section";
import Level2Section from "./_components/Level2Section";
import Level3Section from "./_components/Level3Section";
import Level4Section from "./_components/Level4Section";
import Level5Section from "./_components/Level5Section";
import Level6Section from "./_components/Level6Section";
import Level7Section from "./_components/Level7Section";

export default function LevelStructure() {
  return (
    <div className="min-h-screen bg-mulearn-whitish">
      <AnimatePresence mode="wait">
        <MotionDiv
          key="main"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
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

            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-16 sm:mt-0 space-y-6">
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

              <div className="pt-4">
                <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#level-1">
                    <Button variant={"default"}>Begin Your Journey</Button>
                  </Link>
                </MotionDiv>
              </div>
            </div>
          </div>

          <Level1Section />
          <Level2Section />
          <Level3Section />
          <Level4Section />
          <Level5Section />
          <Level6Section />
          <Level7Section />
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
