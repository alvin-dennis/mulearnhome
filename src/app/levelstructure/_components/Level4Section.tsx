import { Sparkle } from "lucide-react";
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
  return (
    <section
      className="relative bg-mulearn-whitish flex flex-col items-center min-h-screen py-10 lg:py-20 overflow-hidden"
      id="level-4"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <MuImage
          src="/assets/levelstructure/line_lvl2.svg"
          alt="Line Path"
          width={1400}
          height={800}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[1600px] object-contain opacity-40"
        />
        <MuImage
          src="/assets/levelstructure/rocket_lvl2.svg"
          alt="Rocket"
          width={300}
          height={400}
          className="hidden md:block absolute top-0 right-[-10%] sm:right-[-5%] lg:right-[5%] z-20 w-[40%] sm:w-[30%] max-w-[300px] object-contain"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full z-10 flex flex-col items-center text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-mulearn-blackish tracking-tight leading-tight">
            Level 4:{" "}
            <span className="text-mulearn-trusty-blue">
              Now here comes the bigger question.Which path will you choose?
            </span>
          </h2>
          <p className="text-sm md:text-base font-semibold text-mulearn-blackish max-w-3xl mx-auto leading-relaxed">
            This is the level 4,where students enter different interest groups. Some walk with
            AI,while some others choose the Web tribe. A few others move into film,animation or
            comics to weave their imagination. Many of them choose civil/mechanical,or space shaping
            physical reality and touching the stars.
          </p>
          <p className="text-xs md:text-sm text-mulearn-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            At this point, there is no more scattered learning. The learners can start building
            proof of work within their chosen interest group.
          </p>
        </MotionDiv>

        <div className="hidden lg:flex flex-col items-center gap-5 w-full">
          <div className="grid grid-cols-5 gap-5 w-full">
            {INTEREST_GROUPS.slice(0, 5).map((group, index) => (
              <MotionDiv
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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

          <div className="flex flex-row gap-5 w-full">
            {INTEREST_GROUPS.slice(5).map((group, index) => (
              <MotionDiv
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 5) * 0.1 }}
                viewport={{ once: true }}
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

        <div className="grid lg:hidden grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
          {INTEREST_GROUPS.map((group, index) => (
            <MotionDiv
              key={group.name + "-mobile"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
