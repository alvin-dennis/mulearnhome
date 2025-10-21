"use client";

import { motion } from "framer-motion";

export default function WhoIsEnabler() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display mb-6 text-3xl font-bold text-mulearn-blackish md:text-4xl lg:text-5xl">
          Who is an{" "}
          <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
            Enabler
          </span>
          ?
        </h2>
        <p className="font-sans mx-auto max-w-3xl text-base leading-relaxed text-mulearn-gray-600 md:text-lg">
          Enablers are faculty who are continuous learners with social capital, connecting within the µLearn framework, and networking with various other enablers or students. They guide and mentor students, enhancing their growth and social capital as well.
        </p>
      </motion.div>
    </section>
  );
}