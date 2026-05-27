import { Sparkle } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Card, CardContent } from "@/components/ui/card";

export default function Level1Section() {
  return (
    <section className="relative flex items-center py-15 overflow-hidden" id="level-1">
      <div className="max-w-7xl mx-auto px-4 w-full z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center order-1"
          >
            <div className="relative w-full max-w-lg aspect-square hidden md:flex flex-col items-center justify-center">
              <Sparkle className="absolute top-10 left-4 text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-50" />
              <Sparkle className="absolute top-1/4 right-0 text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-40" />
              <Sparkle className="absolute bottom-[40%] left-[-10%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-50" />
              <Sparkle className="absolute top-[60%] right-[-15%] text-mulearn-trusty-blue w-3 h-3 z-50 fill-mulearn-trusty-blue opacity-30" />
              <Sparkle className="absolute bottom-4 left-1/2 text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-60" />
              <Sparkle className="absolute top-[-5%] right-[-25%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-40" />

              <MuImage
                src="/assets/levelstructure/planet_lvl1.svg"
                alt="Planet"
                width={240}
                height={240}
                className="absolute -bottom-12 -right-[25%] z-20 w-[50%] max-w-[240px] object-contain"
              />

              <div className="relative w-full h-[550px] hidden md:block mt-4">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 order-2"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-mulearn-blackish tracking-tight">
                Level 1: <span className="text-mulearn-trusty-blue">The First Hello</span>
              </h2>

              <p className="text-lg text-mulearn-blackish leading-relaxed font-semibold">
                The first thing that a student is asked to do is to introduce themselves:
              </p>

              <p className="text-base text-mulearn-blackish font-medium">
                Not with their CGPA or ranks,but with a simple statement about who they are.
              </p>

              <div className="space-y-4 pt-4">
                <div className="pl-4 border-l-[3px] border-mulearn-trusty-blue py-1">
                  <p className="text-sm sm:text-base text-mulearn-blackish font-medium">
                    One can write ” I’m curious about green buildings” and another one can write “ I
                    make short reels in my hostel room. ”
                  </p>
                </div>
              </div>
            </div>

            <Card className="border border-mulearn-blackish shadow-none rounded-xl mt-8">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-bold text-mulearn-blackish">The Aim</h3>
                <p className="text-sm text-mulearn-blackish leading-relaxed font-medium">
                  No matter who they are or what they aspire to be,the aim of this first task is
                  simple-to break hesitation and help the student to own their story.
                </p>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
