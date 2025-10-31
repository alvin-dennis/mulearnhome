import { communityPartners } from "@/data/data";
import CommunityCard from "@/app/partners/community-partners/_components/CommunityCard";
import { cdnUrl } from "@services/cdn";
import MuImage from "@/components/MuImage";
import { Variants, easeOut } from "framer-motion";
import { MotionDiv } from "@/components/MuFramer";
import { Partner } from "@/lib/types";

export default function CommmunityPartners() {
  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center md:ml-3 md:mr-3 xl:ml-0 xl:mr-0 lg:ml-0 lg:mr-0 min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-around w-full ">
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
            className="text-center md:text-left md:w-1/3 mx-4 md:mx-0"
          >
            <h1 className="text-5xl font-semibold text-mulearn-blackish md:text-7xl inline-block xl:inline-block lg:inline-block md:hidden md:w-[50%] md:leading-tight">
              <span className="font-semibold bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                µLearn Community
              </span>{" "}
              Partners
            </h1>

            <p className="mt-6 md:mt-8 text-lg md:text-2xl w-full md:mx-0 text-mulearn-gray-600">
              When a group of like-minded people come together interesting
              things take place. What if multiple Communities join their hands
              together for a common aim things get much more interesting!
            </p>
          </MotionDiv>

          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
            className="w-full flex justify-center md:w-auto md:flex md:items-center md:justify-center"
          >
            <MuImage
              src={cdnUrl(
                "src/modules/Public/CommPartners/assets/Coding workshop.gif"
              )}
              width={0}
              height={0}
              alt="Coding Workshop Animation"
              className="block mt-6 md:mt-0 w-[90vw] max-w-xl md:w-full md:max-w-152 h-auto md:h-104 object-cover rounded-2xl "
              style={{
                objectFit: "cover",
                width: "100%",
                maxWidth: "38rem",
                height: "auto",
                borderRadius: "1.5rem",
              }}
              priority
            />
          </MotionDiv>
        </div>

        <div className="max-w-7xl xl:w-7xl sm:mt-24 md:mt-32 lg:mt-32 xl:mt-0 pb-20">
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:w-2/3 flex flex-col text-center md:text-left mx-4 md:mx-0 pt-20 lg:pt-32"
          >
            <h4 className="text-3xl md:text-5xl lg:ml-10 xl:ml-0 font-semibold">
              <span className="bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                Community
              </span>{" "}
              Partners
            </h4>

            <p className="mt-6 md:mt-8 lg:ml-10 xl:ml-0 text-lg md:text-2xl md:mx-0 xl:w-176 text-mulearn-gray-600">
              µLearn has partnered with multiple communities to provide the
              peers the best resources and events to learn and up-skill
              themselves.
            </p>
          </MotionDiv>

          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 mt-12 w-full"
          >
            {(communityPartners as Partner[]).map((partner) => (
              <CommunityCard
                key={partner.name}
                name={partner.name}
                image={partner.image}
                link={partner.link}
                customlink={partner.customlink}
              />
            ))}
          </MotionDiv>
        </div>
      </div>
    </>
  );
}
