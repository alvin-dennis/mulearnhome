import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { companyImages } from "@/data/company";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-mulearn-whitish py-12 px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1 lg:-ml-14"
          >
            <div className="relative w-full max-w-[650px] aspect-[512/400]">
              <div className="absolute top-1/4 left-30 w-[236px] h-[283px] rounded-full bg-mulearn blur-[200px] opacity-70 hidden sm:block" />

              <MuImage
                src={companyImages.hero}
                alt="Company Partnership Illustration"
                className="w-full h-full relative z-10 object-contain"
                width={650}
                height={500}
                unoptimized
              />
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-end gap-8 order-1 lg:order-2"
          >
            <h1 className="text-xl sm:text-lg md:text-xl lg:text-[40px] font-semibold leading-tight text-center lg:text-right max-w-[630px]">
              <span className="text-[#1A202C]">Partner with </span>
              <span className="text-mulearn">µLearn </span>
              <span className="text-[#1A202C]">
                to discover talent and spark innovation
              </span>
            </h1>

            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://airtable.com/app0v220Yc0G3CPMr/shrpiEQrpuIFTMNh1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant={"mulearn"} className="font-semibold px-6 py-3 md:px-8 md:py-4">
                Join as a Company Partner
                </Button>
              </Link>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
