"use client";

import { useState } from "react";
import { MotionDiv, MotionH2, MotionP } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { CompanyFeatures, companyImages } from "@/data/company";

const NumberIcon = ({ num }: { num: number }) => (
  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-mulearn">
    <span className="text-2xl font-bold text-mulearn-whitish">{num}</span>
  </div>
);

export default function WhyCollaborate() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <section className="bg-mulearn-whitish py-16 px-4 sm:px-8 relative">
      <MuImage
        src={companyImages.note}
        alt="note icon"
        className="absolute right-24 top-0 w-[92px] h-[115px] rotate-[16deg] hidden lg:block"
        width={92}
        height={115}
      />
      <MuImage
        src={companyImages.handshake}
        alt="handshake icon"
        className="absolute left-12 top-4 w-[109px] h-[128px] rotate-[65deg] hidden lg:block"
        width={109}
        height={128}
      />
      <div className="max-w-6xl mx-auto">
        <MotionH2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl sm:text-xl md:text-4xl font-semibold text-center mb-4 tracking-tight"
        >
          <span className="text-[#1A202C]">Why Collaborate with </span>
          <span className="text-mulearn-trusty-blue">µLearn</span>
          <span className="text-[#1A202C]">?</span>
        </MotionH2>

        <MotionP
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16 font-light"
        >
          Join forces with a thriving community of learners and innovators. Together, we create
          meaningful impact through talent development, innovation, and collaborative growth
          opportunities.
        </MotionP>

        <div className="hidden lg:flex items-stretch justify-center gap-0">
          {CompanyFeatures.map((feature, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              animate={{
                flex: hoveredIndex === index ? 1.8 : 1,
                backgroundColor: hoveredIndex === index ? "#E7F2FF" : "#FFF",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex flex-col items-center justify-start gap-5 py-8 px-4 border-2 border-mulearn-gray-600/10 transition-all duration-100 ease-in-out ${
                index === 0
                  ? "rounded-l-[10px] border-r-0"
                  : index === CompanyFeatures.length - 1
                    ? "rounded-r-[10px]"
                    : "border-r-0"
              }`}
            >
              <NumberIcon num={index} />
              <h3
                className={`text-xl sm:text-2xl font-bold text-mulearn text-center leading-tight transition-all duration-300`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-center font-thin text-mulearn-blackish leading-relaxed transition-all duration-300 ${
                  index === 0 ? "text-sm sm:text-sm" : "text-xs sm:text-sm"
                }`}
              >
                {feature.description}
              </p>
            </MotionDiv>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {CompanyFeatures.map((feature, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex flex-col items-center justify-start gap-5 p-6 border-2 border-mulearn-gray-600/10 rounded-lg transition-all duration-300 ease-in-out ${
                hoveredIndex === index ? "bg-[#E7F2FF]" : "bg-white"
              }`}
            >
              <NumberIcon num={index + 1} />
              <h3 className="text-xl sm:text-2xl font-bold text-mulearn-trusty-blue text-center leading-tight">
                {feature.title}
              </h3>
              <p className="text-center font-thin text-mulearn-blackish leading-relaxed text-base sm:text-lg">
                {feature.description}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
