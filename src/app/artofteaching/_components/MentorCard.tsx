"use client";

import React from "react";
import Link from "next/link";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";

interface MentorCardProps {
  name: string;
  designation: string;
  image?: string;
  linkedIn?: string;
}

const MentorCard = ({ 
  name, 
  designation, 
  image, 
  linkedIn, 
}: MentorCardProps) => {
  const linkedInImage = cdnUrl("/src/modules/Public/artofteaching/assets/linkedin.png");
  return (
    <div className="mx-auto mt-4 max-w-sm w-full shadow-lg rounded-lg p-6 bg-white border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        {image && (
          <MuImage
            src={image}
            alt={`${name} profile`}
            width={80}
            height={80}
            className="object-cover w-20 h-20 rounded-md"
            loading="lazy"
          />
        )}
        <div className="flex flex-col items-end">
          {linkedIn && linkedIn !== "" && (
            <Link
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 group"
            >
              <div className="w-7 h-7 rounded overflow-hidden hover:scale-110 transition-transform duration-300 hover:shadow-lg">
                <MuImage
                  src={linkedInImage}
                  alt="LinkedIn"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain group-hover:brightness-110 transition-all duration-300"
                />
              </div>
            </Link>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
        {name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {designation}
      </p>
    </div>
  );
};

export default MentorCard;