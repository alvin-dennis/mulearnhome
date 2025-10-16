"use client";

import { useState } from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { cdnUrl } from "@/services/cdn";
import { cn } from "@/lib/utils";
import MuImage from "@/components/MuImage";
import Link from "next/link";
import { TeamCardProps } from "@/lib/types";

const fallbackImage = cdnUrl("public/assets/team/default.webp");

export function TeamCard({
  name,
  designation,
  image,
  linkedin,
  github,
  x,
  muid,
  lead,
  team,
}: TeamCardProps) {
  const [showAllRoles, setShowAllRoles] = useState(false);

  const teamRoles: string[] = team
    ? team
        .split(",")
        .map((role) => role.trim())
        .filter((role) => role !== "")
    : [];

  const displayedRoles = showAllRoles ? teamRoles : teamRoles.slice(0, 1);
  const hiddenCount = teamRoles.length - 1;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mx-auto mt-4 max-w-md p-6 rounded-lg w-full shadow-[1px_1px_45px_-5px_rgba(0,0,0,0.08)]">
      <div className="flex justify-center sm:justify-start">
        <MuImage
          src={image ? cdnUrl(image) : fallbackImage}
          alt={name}
          width={128}
          height={128}
          className="rounded-lg w-32 h-32 object-cover object-top"
        />
      </div>

      <div className="flex flex-col justify-between gap-2 w-full">
        <div>
          {name && <h3 className="text-2xl font-semibold">{name}</h3>}
          {(lead || designation) && (
            <p className="text-sm text-mulearn-gray-600">
              {lead ? `${lead} Lead` : designation}
            </p>
          )}
          {muid && <p className="text-[10px] text-mulearn-gray-600">{muid}</p>}
          {teamRoles.length > 0 && (
            <ul
              className={cn(
                "flex flex-wrap justify-center sm:justify-end gap-1.5 mt-2 p-0 list-none overflow-hidden transition-all duration-300",
                showAllRoles ? "max-h-none" : "max-h-[58px]"
              )}
            >
              {displayedRoles.map((role, index) => (
                <li
                  key={index}
                  className="bg-mulearn-greyish/20 text-mulearn-gray-600 text-xs px-2.5 py-1 rounded-xl whitespace-nowrap"
                >
                  {role}
                </li>
              ))}
              {!showAllRoles && hiddenCount > 0 && (
                <li
                  className="bg-mulearn-greyish/20 text-mulearn-gray-600 px-2.5 py-1 rounded-xl text-xs font-medium cursor-pointer hover:bg-mulearn-greyish/40  transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllRoles(true);
                  }}
                >
                  +{hiddenCount} more
                </li>
              )}
            </ul>
          )}

          {(linkedin || github || x) && (
            <div className="flex flex-wrap justify-center sm:justify-end gap-2.5 mt-2">
              {linkedin && (
                <Link
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mulearn-blackish hover:text-mulearn-trusty-blue transition-colors"
                >
                  <FaLinkedin size={24} />
                </Link>
              )}
              {github && (
                <Link
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mulearn-blackish hover:text-mulearn-trusty-blue transition-colors"
                >
                  <FaGithub size={24} />
                </Link>
              )}
              {x && (
                <Link
                  href={x}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mulearn-blackish hover:text-mulearn-trusty-blue transition-colors"
                >
                  <FaTwitter size={24} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
