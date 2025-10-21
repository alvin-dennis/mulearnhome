"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    title: "Industry Immersion Programs",
    items: [
      "Offering Enablers short-term industry internships to stay connected with current practices and technologies",
      "IEs and presenters can be moved to the front of the class"
    ],
    bgColor: "bg-mulearn-blackish",
    textColor: "text-mulearn-whitish",
  },
  {
    title: "Meet-ups",
    items: [
      "Enabler meet-ups with industry and peers offer statewide networking, benefiting both their network and the institution's reputation.",
      "Monthly District Meetups: Virtual/Offline event to check the updates and improvements in colleges",
      "Zonal Meetups: Offline event organized with the help of our three zonal heads once in 3 months"
    ],
    bgColor: "bg-blue-100",
    textColor: "text-mulearn-blackish",
  },
  {
    title: "Up-Skill Program",
    items: [
      "Providing a platform for enablers to gain insights into industry mentors",
      "Enablers can enhance their skills and stay updated with emerging technologies",
      "Workshops focused on technology, industry-leading solutions, GenAI tools and participation in open-source projects offer growth and development"
    ],
    bgColor: "bg-blue-500",
    textColor: "text-mulearn-whitish",
  }
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display mb-12 text-center text-3xl font-bold text-mulearn-blackish md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
            Benefits
          </span>{" "}
          to the Enabler
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* First row - Industry Immersion and Meet-ups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className={`${benefits[0].bgColor} ${benefits[0].textColor} relative overflow-hidden rounded-3xl p-8 shadow-lg`}
          >
            <h3 className="font-display mb-6 text-xl font-bold md:text-2xl">{benefits[0].title}</h3>
            <ul className="font-sans space-y-4">
              {benefits[0].items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm leading-relaxed md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            {/* Star decoration */}
            <div className="absolute right-6 top-6 opacity-80">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white/30">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${benefits[1].bgColor} ${benefits[1].textColor} relative overflow-hidden rounded-3xl p-8 shadow-lg`}
          >
            <h3 className="font-display mb-6 text-xl font-bold md:text-2xl">{benefits[1].title}</h3>
            <ul className="font-sans space-y-4">
              {benefits[1].items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mulearn-trusty-blue/20">
                    <svg
                      className="h-3 w-3 text-mulearn-trusty-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm leading-relaxed md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Second row - Up-Skill Program spanning left, Quote on right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${benefits[2].bgColor} ${benefits[2].textColor} relative overflow-hidden rounded-3xl p-8 shadow-lg`}
          >
            <h3 className="font-display mb-6 text-xl font-bold md:text-2xl">{benefits[2].title}</h3>
            <ul className="font-sans space-y-4">
              {benefits[2].items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm leading-relaxed md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            {/* Star decoration */}
            <div className="absolute right-6 bottom-6 opacity-80">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white/30">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
          </motion.div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex items-center justify-center overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg"
          >
            <div className="absolute right-6 top-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-mulearn-blackish opacity-10">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
            <div className="relative z-10 text-center">
              <p className="font-sans text-lg font-semibold italic text-mulearn-blackish md:text-xl lg:text-2xl">
                &quot;Beyond Teaching - Become the spark<br />That Shapes Tomorrow&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}