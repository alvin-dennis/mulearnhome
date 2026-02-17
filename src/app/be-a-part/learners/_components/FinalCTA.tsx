"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div className="text-white z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Start building your future with µLearn.
              </h2>
              <p className="text-lg md:text-xl mb-8 text-blue-50 leading-relaxed">
                Gain real skills, collaborate with learners, and earn recognition as you grow.
              </p>
              <Link
                href="https://app.mulearn.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Join µLearn
              </Link>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/assets/learners/learner-cta.png"
                  alt="Student learning with laptop"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 blur-3xl -ml-32 -mb-32"></div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default FinalCTA;
