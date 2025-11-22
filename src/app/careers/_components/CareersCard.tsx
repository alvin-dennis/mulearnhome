import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CareersCardProps } from "@/lib/types";
import { Clock, MapPin, File } from "lucide-react";

const CareersCard = ({
  role,
  remuneration,
  vacancies,
  location,
  lastdate,
  duration,
  logo,
  applylink,
  jdlink,
  extraField,
  extraContent,
  extraButton,
  organization,
}: CareersCardProps) => {
  return (
    <div className="w-80 rounded-2xl border border-mulearn-trusty-blue bg-mulearn-whitish p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-4">
      {logo && (
        <MuImage
          src={logo}
          alt={`${organization || "Company"} Logo`}
          className="mx-auto object-contain -mt-8"
          width={70}
          height={70}
        />
      )}
      {organization && (
        <h4 className="text-center text-lg font-semibold">{organization}</h4>
      )}
      {role && (
        <h2 className="text-center text-3xl font-bold">{role}</h2>
      )}

      <div className="flex flex-col items-center gap-2 text-sm text-mulearn-blackish">
        {duration && (
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {duration}
          </p>
        )}
        {location && (
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {location}
          </p>
        )}
        {remuneration && (
          <p className="mb-2 text-center text-base text-mulearn-blackish">
            <span className="font-semibold">Remuneration:</span> {remuneration}
          </p>
        )}
        {vacancies && (
          <p className="mb-2 text-center text-base text-mulearn-blackish">
            <span className="font-semibold">Vacancies:</span> {vacancies}
          </p>
        )}
        {lastdate && (
          <p className="mb-2 text-center text-base text-mulearn-blackish">
            <span className="font-semibold">Last Date:</span> {lastdate}
          </p>
        )}
        {extraField && extraContent && (
          <p className="mb-2 text-center text-base text-mulearn-blackish">
            <span className="font-semibold">{extraField}:</span> {extraContent}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2 w-full">
        {jdlink && (
          <Link href={jdlink} target="_blank" rel="noopener noreferrer">
            <Button variant="mulearn" className="w-full flex items-center justify-center gap-1 px-4 py-2">
              <File /> View JD
            </Button>
          </Link>
        )}
        {applylink && (
          <Link href={applylink} target="_blank" rel="noopener noreferrer">
            <Button variant="mulearn" className="w-full flex items-center justify-center gap-1 px-4 py-2">
              Apply Now
            </Button>
          </Link>
        )}
        {jdlink && (
          <Link href={jdlink} target="_blank" rel="noopener noreferrer">
            <Button variant="mulearn" className="px-5 py-2 font-semibold">
              View JD
            </Button>
          </Link>
        )}
        {extraButton && (
          <Link href={extraButton} target="_blank" rel="noopener noreferrer">
            <Button variant="mulearn" className="w-full flex items-center justify-center gap-1 px-4 py-2">
              View Challenge
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CareersCard;
