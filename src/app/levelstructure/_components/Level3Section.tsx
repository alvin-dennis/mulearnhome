import { Sparkle } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Card, CardContent } from "@/components/ui/card";

export default function Level3Section() {
  return (
    <section
      className="relative bg-mulearn-whitish flex items-center min-h-screen py-10 lg:py-20 overflow-hidden"
      id="level-3"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <MuImage
          src="/assets/levelstructure/line_lvl2.svg"
          alt="Line Path"
          width={1400}
          height={800}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[1600px] object-contain opacity-40 scale-x-[-1]"
        />
        <MuImage
          src="/assets/levelstructure/rocket_lvl2.svg"
          alt="Rocket"
          width={300}
          height={400}
          className="hidden md:block absolute top-0 left-[-10%] sm:left-[-5%] lg:left-[5%] z-20 w-[40%] sm:w-[30%] max-w-[300px] object-contain scale-x-[-1]"
        />
        <Sparkle className="absolute top-[10%] left-[20%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-50" />
        <Sparkle className="absolute top-[30%] left-[5%] text-mulearn-trusty-blue w-6 h-6 fill-mulearn-trusty-blue opacity-40" />
        <Sparkle className="absolute bottom-[20%] left-[15%] text-mulearn-trusty-blue w-5 h-5 fill-mulearn-trusty-blue opacity-60" />
        <Sparkle className="absolute top-[15%] right-[25%] text-mulearn-trusty-blue w-3 h-3 fill-mulearn-trusty-blue opacity-30" />
        <Sparkle className="absolute top-[40%] right-[5%] text-mulearn-trusty-blue w-6 h-6 fill-mulearn-trusty-blue opacity-50" />
        <Sparkle className="absolute bottom-[10%] right-[20%] text-mulearn-trusty-blue w-4 h-4 fill-mulearn-trusty-blue opacity-40" />
        <Sparkle className="absolute top-[50%] left-[30%] text-mulearn-trusty-blue w-3 h-3 fill-mulearn-trusty-blue opacity-50" />
        <Sparkle className="absolute bottom-[40%] right-[30%] text-mulearn-trusty-blue w-5 h-5 fill-mulearn-trusty-blue opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-28 items-start mt-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-xl"
          >
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-mulearn-blackish tracking-tight">
                Level 3: <span className="text-mulearn-trusty-blue">Now there is level 3.</span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base text-mulearn-blackish leading-relaxed font-semibold">
                Here the challenge is to learn tools-not theoretically, but practically. A web
                student learns GitHub, hosting and Figma. At the same time, a film enthusiast may
                learn editing software or storytelling workflows.
              </p>

              <div className="pl-4 border-l-[3px] border-mulearn-trusty-blue py-1">
                <p className="text-sm sm:text-base text-mulearn-gray-600 font-medium leading-relaxed">
                  At first, the tools may feel overwhelming-there are errors everywhere and nothing
                  may seem to work. But soon, the students move from being a passive learner to an
                  active learner.
                </p>
              </div>
            </div>

            <Card className="bg-mulearn-whitish border border-mulearn-blackish shadow-none rounded-xl mt-8">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-bold text-mulearn-blackish">The Ultimate Survival</h3>
                <p className="text-sm text-mulearn-blackish leading-relaxed font-medium">
                  They command technology instead of being commanded by it. Because, in today&apos;s
                  age, tool literacy is the ultimate survival.
                </p>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:flex items-start justify-end h-full min-h-[600px] lg:-mr-24"
          >
            <Sparkle className="absolute top-[20%] left-[20%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-50" />
            <Sparkle className="absolute top-[40%] left-[5%] text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-40" />
            <Sparkle className="absolute bottom-[20%] left-[15%] text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-60" />
            <Sparkle className="absolute top-[25%] right-[25%] text-mulearn-trusty-blue w-3 h-3 z-50 fill-mulearn-trusty-blue opacity-30" />
            <Sparkle className="absolute top-[50%] right-[5%] text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-50" />

            <MuImage
              src="/assets/levelstructure/astronaut1.svg"
              alt="Astronaut Level 3"
              width={400}
              height={500}
              className="relative z-30 w-[70%] max-w-[400px] object-contain hover:-translate-y-4 transition-transform duration-700 ease-in-out -mt-4"
            />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
