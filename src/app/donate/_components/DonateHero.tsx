"use client";

import type { Variants } from "framer-motion";
import { MotionDiv, MotionH1, MotionHeader, MotionP } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";
import { cdnUrl } from "@/services/cdn";

const heroImg = cdnUrl("src/modules/Public/Donation/assets/heroImg.jpg");

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.08, duration: 0.4 },
  }),
};

export default function DonateHero() {
  return (
    <MotionHeader
      className="w-full overflow-hidden bg-linear-to-b from-white via-mulearn/5 to-mulearn/10 px-4 py-16 sm:px-6 md:px-12 lg:px-24 xl:px-40"
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <MotionH1
            custom={0}
            variants={fadeInUp}
            className="text-4xl font-black leading-tight text-mulearn-blackish sm:text-5xl"
          >
            Small support.
            <br />
            <span className="text-mulearn">Big learning impact.</span>
          </MotionH1>

          <MotionP
            custom={1}
            variants={fadeInUp}
            className="mt-4 max-w-md text-mulearn-gray-600 lg:mx-0"
          >
            Your donation helps us build a peer-powered learning ecosystem that&apos;s open,
            inclusive, and accessible to all.
          </MotionP>

          <MotionDiv
            custom={2}
            variants={fadeInUp}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button asChild size="lg">
              <a href="#donate-form">Donate now</a>
            </Button>
            <Button variant="outline" size="lg" type="button">
              Watch video
            </Button>
          </MotionDiv>
        </div>

        <MotionDiv
          custom={1}
          variants={fadeInUp}
          className="relative mx-auto aspect-4/3 w-full max-w-lg lg:mx-0 lg:max-w-none"
        >
          <div className="absolute inset-8 rounded-[3rem] bg-mulearn/15" aria-hidden="true" />
          <MuImage
            src={heroImg}
            alt="µLearn community members collaborating"
            width={420}
            height={520}
            className="absolute right-0 top-0 h-[70%] w-[62%] rounded-3xl object-cover shadow-xl"
          />
          <MuImage
            src={heroImg}
            alt="µLearn community members learning together"
            width={220}
            height={220}
            className="absolute right-[38%] top-[8%] h-[28%] w-[30%] rounded-2xl border-4 border-mulearn-whitish object-cover shadow-lg"
          />
          <MuImage
            src={heroImg}
            alt="µLearn peer learning circle working on laptops"
            width={320}
            height={260}
            className="absolute bottom-0 left-0 h-[52%] w-[58%] rounded-3xl object-cover shadow-xl"
          />
        </MotionDiv>
      </div>
    </MotionHeader>
  );
}
