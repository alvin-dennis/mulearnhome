import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { CompanyPartners, CompanyPartners1 } from "@/data/company_new";

const Partners = () => {
  return (
    <section className="bg-mulearn-whitish overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-col">
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-extralight leading-tight text-center max-w-[630px] pt-20">
            <span className="text-mulearn-blackish">Our </span>
            <span className="text-mulearn">Company Partners</span>
          </h1>
        </MotionDiv>

        <div className="absolute right-38 top-0 items-center pointer-events-none">
          <div className="w-[300px] h-[300px] bg-mulearn blur-[200px] opacity-30 rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-center flex-col">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-screen mt-12 border border-mulearn-blackish p-3 bg-mulearn-whitish"
          >
            <MotionDiv
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 12,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="flex gap-12 w-max"
            >
              {[...CompanyPartners1, ...CompanyPartners1].map((partner, i) => (
                <div
                  key={`${partner.image}-${i < CompanyPartners1.length ? "a" : "b"}`}
                  className="flex-shrink-0 max-w-full"
                >
                  <MuImage
                    src={partner.image}
                    alt={partner.title}
                    width={120}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="w-screen mt-12 border border-mulearn-blackish p-3 bg-mulearn-whitish"
          >
            <MotionDiv
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                ease: "linear",
                duration: 12,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="flex gap-8 w-max"
            >
              {[...CompanyPartners, ...CompanyPartners].map((partner, i) => (
                <div
                  key={`${partner.image}-${i < CompanyPartners.length ? "a" : "b"}`}
                  className="flex-shrink-0 max-w-full"
                >
                  <MuImage
                    src={partner.image}
                    alt={partner.title}
                    width={120}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Partners;
