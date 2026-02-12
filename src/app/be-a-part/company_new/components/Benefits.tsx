import { MotionDiv, MotionH1, MotionP } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyFeatures } from "@/data/company_new";

const Benefits = () => {
  return (
    <section className="py-3 bg-mulearn-whitish overflow-hidden relative z-0">
      <MotionDiv
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex items-center justify-center flex-col"
      >
        <MotionH1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl md:text-3xl lg:text-6xl font-extralight leading-tight text-center pt-20"
        >
          <span className="text-mulearn-blackish">Benefits to </span>{" "}
          <span className="text-mulearn">company partner</span>
        </MotionH1>

        <MuImage
          src={"/assets/company_new/note.svg"}
          alt="note icon"
          className="absolute left-24 top-0 w-[92px] h-[115px] rotate-[16deg] hidden lg:block"
          width={92}
          height={115}
        />

        <div className="absolute right-24 top-0 text-mulearn-blackish/80 hidden lg:block">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 15 9 24 12 15 15 12 24 9 15 0 12 9 9Z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 relative">
          {CompanyFeatures.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card
                variant="interactive"
                className="h-full border-mulearn/10 bg-mulearn-whitish z-10"
              >
                <CardContent className="flex flex-col gap-5 p-6">
                  <MuImage src={feature.image} alt={feature.title} width={60} height={60} />

                  <MotionH1
                    className="text-xl sm:text-2xl font-bold text-mulearn-trusty-blue text-left leading-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {feature.title}
                  </MotionH1>

                  <MotionP
                    className="font-thin text-mulearn-blackish leading-relaxed text-left sm:text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    {feature.description}
                  </MotionP>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>

      <div className="absolute -bottom-32 right-32 -translate-x-1/2 pointer-events-none z-0">
        <div className="w-[300px] h-[300px] bg-mulearn blur-[200px] opacity-25 rounded-full" />
      </div>
    </section>
  );
};

export default Benefits;
