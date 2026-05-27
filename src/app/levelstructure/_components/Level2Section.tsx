import { Sparkle } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";

export default function Level2Section() {
  return (
    <section
      className="relative flex flex-col items-center py-15 overflow-hidden bg-mulearn-whitish"
      id="level-2"
    >
      <div className="max-w-7xl mx-auto px-4 w-full z-10 flex flex-col items-center">
        <MuImage
          src="/assets/levelstructure/rocket_lvl2.svg"
          alt="Rocket"
          width={300}
          height={400}
          className="hidden md:block absolute top-0 right-[-10%] sm:right-[-5%] lg:right-[5%] z-20 w-[40%] sm:w-[30%] max-w-[300px] object-contain"
        />

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-4xl mx-auto mb-4 lg:mb-4 relative z-40"
        >
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-mulearn-blackish tracking-tight">
              Level 2: <span className="text-mulearn-trusty-blue">Then comes level 2.</span>
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
            <p className="text-mulearn-blackish font-semibold text-base sm:text-lg">
              Most students walk into this level with invisible cages. A web development student may
              think that they are not good enough to compete globally while a comic artist may doubt
              a future for his passion.
            </p>
            <p className="text-mulearn-gray-600">
              Mulearn rewrite all these narratives through experiences,reflections and peer nudge.
              Skills at this level are refreshed every 18 months and the students are equipped with
              a growth mindset from this level.
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-6xl aspect-square md:aspect-[2/1] lg:aspect-[2.5/1] flex items-center justify-center -mt-8 lg:-mt-16"
        >
          <Sparkle className="absolute top-[10%] left-[20%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-50" />
          <Sparkle className="absolute top-[30%] left-[5%] text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-40" />
          <Sparkle className="absolute bottom-[20%] left-[15%] text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-60" />
          <Sparkle className="absolute top-[15%] right-[25%] text-mulearn-trusty-blue w-3 h-3 z-50 fill-mulearn-trusty-blue opacity-30" />
          <Sparkle className="absolute top-[40%] right-[5%] text-mulearn-trusty-blue w-6 h-6 z-50 fill-mulearn-trusty-blue opacity-50" />
          <Sparkle className="absolute bottom-[10%] right-[20%] text-mulearn-trusty-blue w-4 h-4 z-50 fill-mulearn-trusty-blue opacity-40" />
          <Sparkle className="absolute top-[50%] left-[30%] text-mulearn-trusty-blue w-3 h-3 z-50 fill-mulearn-trusty-blue opacity-50" />
          <Sparkle className="absolute bottom-[40%] right-[30%] text-mulearn-trusty-blue w-5 h-5 z-50 fill-mulearn-trusty-blue opacity-60" />

          <MuImage
            src="/assets/levelstructure/line_lvl2.svg"
            alt="Line Path"
            width={1400}
            height={800}
            className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-[50%] z-0 w-[150%] max-w-[1600px] object-contain pointer-events-none"
          />

          <MuImage
            src="/assets/levelstructure/planet_lvl2.svg"
            alt="Planet"
            width={280}
            height={280}
            className="absolute top-[55%] left-[-5%] lg:-left-[10%] z-20 w-[22%] max-w-[280px] object-contain"
          />

          <MuImage
            src="/assets/levelstructure/astronaut3.svg"
            alt="Astronaut"
            width={300}
            height={340}
            className="relative z-30 w-[40%] sm:w-[28%] min-w-[220px] max-w-[300px] object-contain hover:-translate-y-4 transition-transform duration-700 ease-in-out"
          />

          <MuImage
            src="/assets/levelstructure/planets2_lvl2.svg"
            alt="Planets"
            width={450}
            height={450}
            className="absolute -bottom-[30%] lg:-bottom-[40%] -right-[15%] lg:-right-[20%] z-20 w-[35%] max-w-[450px] object-contain"
          />
        </MotionDiv>
      </div>
    </section>
  );
}
