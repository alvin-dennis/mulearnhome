import { FaGlobe, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Card, CardContent } from "@/components/ui/card";
import { SucessStories } from "@/data/company_new";

const Sucess = () => {
  return (
    <section className="py-40 px-11 bg-mulearn-whitish overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-col">
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-center pt-20">
            <span className="text-mulearn-blackish">Success Stories From </span>
            <span className="text-mulearn">µLearn community</span>
          </h1>
        </MotionDiv>

        <MuImage
          src={"/assets/company_new/hand.svg"}
          alt="hand icon"
          className="absolute right-40 bottom-0 w-[92px] h-[115px] rotate-[16deg] hidden lg:block"
          width={92}
          height={115}
        />

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-7xl overflow-hidden sm:max-w-5xl"
        >
          <MotionDiv
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="flex gap-8 mt-10 w-max"
          >
            {[...SucessStories].map((feature, index) => (
              <Card
                key={`${feature.image}-${index < SucessStories.length ? "a" : "b"}`}
                className="min-w-[280px] max-w-[280px] border-mulearn/10 bg-gradient-to-br from-mulearn-whitish to-mulearn/5 h-full"
              >
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <MuImage
                    src={feature.image}
                    alt={feature.title}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />

                  <h3 className="text-xl font-bold text-mulearn-blackish text-center">
                    {feature.title}
                  </h3>

                  <p className="text-center font-medium text-mulearn-blackish text-sm">
                    {feature.Description}
                  </p>

                  <div className="flex flex-row gap-6 justify-center items-center">
                    <p className="font-light">Placed at:</p>
                    <Card className="bg-mulearn-whitish">
                      <MuImage
                        src={"/assets/company_new/ksum.svg"}
                        alt="company logo"
                        width={70}
                        height={50}
                      />
                    </Card>
                  </div>

                  <div className="flex flex-row gap-6 pt-3">
                    <FaXTwitter className="text-xl hover:scale-110 transition" />
                    <FaLinkedin className="text-xl hover:scale-110 transition" />
                    <FaGlobe className="text-xl hover:scale-110 transition" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

export default Sucess;
