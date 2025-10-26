import React from "react";
import Link from "next/link";
import { cardProps } from "@/lib/types";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";
import { kkem } from "@/data/data";

export default function BeyondUs() {
  const renderCard = ({ name, description, image, link }: cardProps) => (
    <Link href={link} key={name} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col items-start p-4 gap-4 w-[310px] h-[475px] bg-white shadow-lg rounded-xl mt-4 mb-4 transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex justify-center items-center w-[278px] h-[214px] bg-gray-200 rounded-xl overflow-hidden">
          <MuImage
            src={image}
            alt={name}
            width={188}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="font-semibold text-2xl md:text-3xl text-gray-900">
          {name}
        </p>
        <p className="font-light text-base text-gray-700">{description}</p>
        {link !== "#" ? (
          <span className="uppercase font-medium text-blue-600">
            Explore More
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              className="group-hover:fill-[royalblue]"
            >
              <path d="M12.1711 3.983L2.12965 14.0245L0.47998 12.3748L10.5203 2.33333H1.67115V0H14.5045V12.8333H12.1711V3.983Z" />
            </svg>
          </span>
        ) : (
          <span className="uppercase font-medium text-gray-400">
            Coming Soon!
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <div className="w-full mx-auto px-6 md:px-12">
      <div className="flex flex-wrap justify-between items-center py-8 md:py-12">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Beyond Us
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-900 mb-2">
            A hackathon like never before in association with Kerala Knowledge
            Economy Mission as a part of Kerala Skill Express wherein your
            skills of technical knowledge and problem solving will be put to the
            test.
          </p>
          <p className="text-lg md:text-xl font-light text-gray-700">
            08 August 2023 - 09 August 2023
          </p>
        </div>
        <MuImage
          src={cdnUrl(
            "src/modules/Public/KKEM/assets/past_events/beyondus/beyondus.png"
          )}
          alt="Beyond Us Event"
          width={384}
          height={384}
          className="rounded-lg"
        />
      </div>

      <div className="bg-blue-100 py-8 flex justify-center">
        <div className="flex flex-wrap justify-between w-full max-w-7xl px-4 md:px-12">
          <div className="text-center mb-6 md:mb-0">
            <p className="text-4xl md:text-5xl font-semibold text-gray-900">
              200+
            </p>
            <p className="text-lg font-normal text-blue-500">Participants</p>
          </div>
          <div className="text-center mb-6 md:mb-0">
            <p className="text-4xl md:text-5xl font-semibold text-gray-900">
              375+
            </p>
            <p className="text-lg font-normal text-blue-500">Registrations</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-semibold text-gray-900">
              50K
            </p>
            <p className="text-lg font-normal text-blue-500">Worth Prize</p>
          </div>
        </div>
      </div>

      <div className="py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center md:text-left mb-8">
          Winners: Design Domain
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {kkem.winnersDesign.map(renderCard)}
        </div>
      </div>

      <div className="py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center md:text-left mb-8">
          Winners: Software Domain
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {kkem.winnersSoftware.map(renderCard)}
        </div>
      </div>
    </div>
  );
};
