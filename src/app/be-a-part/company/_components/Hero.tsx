"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { companyImages } from "@/data/data";
export default function Hero() {
  return (
    <section className="bg-white py-12 px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[512px]">
              <div className="absolute top-1/4 left-8 w-[236px] h-[283px] rounded-full bg-[#456FF6] blur-[200px] opacity-70 hidden sm:block" />

              <Image
                src={companyImages.hero}
                alt="Company Partnership Illustration"
                className="w-full h-auto relative z-10"
                 width={512}
                height={400}
            
              />

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-end gap-8 order-1 lg:order-2"
          >
            <h1 className="text-xl sm:text-lg md:text-xl lg:text-[40px] font-semibold leading-tight text-center lg:text-right max-w-[630px]">
              <span className="text-[#1A202C]">Partner with </span>
              <span className="text-[#456FF6]">µLearn </span>
              <span className="text-[#1A202C]">to discover talent and spark innovation</span>
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#456FF6] text-white font-medium text-base sm:text-sm lg:text-sm px-2 sm:px-4 py-2 sm:py-5 rounded-[20px] transition-all hover:bg-[#3558d9] shadow-md"
            >
              Join as a Company Partner
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
