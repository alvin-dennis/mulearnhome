import MuImage from "@/components/MuImage";
import { enablers } from "@/data/data";
import { BiSolidRightArrow } from "react-icons/bi";
import { Variants, easeOut } from "framer-motion";
import { MotionDiv } from "@/components/MuFramer";

export default function Benefits() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <section
      id="Benefits"
      className="py-16 md:py-24 bg-mulearn-whitish text-mulearn-blackish"
    >
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                Benefits
              </span>
            </span>{" "}
            to the Enabler
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {enablers.benefits.map((benefit, index) => (
            <MotionDiv
              key={index}
              className="rounded-2xl border border-mulearn-gray-600/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {benefit.image && (
                <div className="w-full h-36 rounded-2xl overflow-hidden flex items-center justify-center">
                  <MuImage
                    src={benefit.image}
                    alt={benefit.title}
                    className="object-cover w-full h-full"
                    width={400}
                    height={150}
                  />
                </div>
              )}

              <h3 className="text-xl font-bold">{benefit.title}</h3>

              <div className="space-y-4">
                {benefit.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                      <BiSolidRightArrow className="w-5 h-5 bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent" />
                    </div>
                    <p className="text-base text-mulearn-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
