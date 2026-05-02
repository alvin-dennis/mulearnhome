"use client";

import { useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef } from "react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Card, CardContent } from "@/components/ui/card";

export default function Level1Section() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center py-10 lg:py-20 overflow-hidden"
      id="level-1"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center order-1 -mt-12 lg:-mt-24 lg:-ml-12"
          >
            <div className="relative w-full max-w-lg aspect-square flex flex-col items-center justify-center">
              {/* Sparkles using lucide-react */}
              <Sparkle className="absolute top-10 left-4 text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-50" />
              <Sparkle className="absolute top-1/4 right-0 text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-40" />
              <Sparkle className="absolute bottom-[40%] left-[-10%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-50" />
              <Sparkle className="absolute top-[60%] right-[-15%] text-mulearn-trusty-blue w-3 h-3 z-50 fill-mulearn-trusty-blue opacity-30" />
              <Sparkle className="absolute bottom-4 left-1/2 text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-60" />
              <Sparkle className="absolute top-[-5%] right-[-25%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-40" />

              {/* Planet */}
              <MuImage
                src="/assets/levelstructure/planet_lvl1.svg"
                alt="Planet"
                width={240}
                height={240}
                className="absolute -bottom-12 -right-[25%] z-20 w-[50%] max-w-[240px] object-contain"
              />

              {/* UFO and Astronaut Composition */}
              <div className="relative w-full h-[550px] mt-4">
                <MuImage
                  src="/assets/levelstructure/ufo_lvl1.svg"
                  alt="UFO"
                  width={550}
                  height={550}
                  className="absolute top-0 left-[45%] -translate-x-[50%] z-10 w-[105%] max-w-[480px] object-contain"
                />

                <MuImage
                  src="/assets/levelstructure/astronaut2.svg"
                  alt="Astronaut"
                  width={250}
                  height={300}
                  className="absolute top-[38%] left-[45%] -translate-x-[45%] z-30 w-[60%] max-w-[230px] object-contain"
                />
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 order-2"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-mulearn-blackish tracking-tight">
                The First <span className="text-mulearn-trusty-blue">Hello</span>
              </h2>

              <p className="text-lg text-mulearn-blackish leading-relaxed font-medium">
                Every explorer in μLearn&apos;s galaxy starts by saying:{" "}
                <span className="text-mulearn-blackish">&ldquo;Here I am.&rdquo;</span>
              </p>

              <p className="text-base text-mulearn-blackish font-medium">
                This is not a roll call. It&apos;s an act of visibility—letting peers, mentors, and
                opportunities discover you.
              </p>

              <div className="space-y-4 pt-4">
                <div className="pl-4 border-l-[3px] border-mulearn-trusty-blue py-1">
                  <p className="text-sm text-mulearn-blackish font-semibold">
                    Civil Engineering Student:{" "}
                    <span className="text-mulearn-blackish font-normal">
                      &ldquo;curious about green buildings.&rdquo;
                    </span>
                  </p>
                </div>

                <div className="pl-4 border-l-[3px] border-mulearn-trusty-blue py-1">
                  <p className="text-sm text-mulearn-blackish font-semibold">
                    Mechanical Engineer:{" "}
                    <span className="text-mulearn-blackish font-normal">
                      &ldquo;I sketch machines but want to learn 3D modeling.&rdquo;
                    </span>
                  </p>
                </div>

                <div className="pl-4 border-l-[3px] border-mulearn-trusty-blue py-1">
                  <p className="text-sm text-mulearn-blackish font-semibold">
                    Film Enthusiast:{" "}
                    <span className="text-mulearn-blackish font-normal">
                      &ldquo;I make short reels in my hostel room.&rdquo;
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Card className="border border-mulearn-blackish shadow-none rounded-xl mt-8">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-bold text-mulearn-blackish">The Impact</h3>
                <p className="text-sm text-mulearn-blackish leading-relaxed font-medium">
                  Students realize that their journey begins not with skills, but with identity and
                  courage to show up.
                </p>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
