import { Clock, File, MapPin } from "lucide-react";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CareersCardProps } from "@/lib/types";

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
    <Card className="w-80 rounded-2xl border border-mulearn-trusty-blue bg-mulearn-whitish p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-4">
      {logo && (
        <MuImage
          src={logo}
          alt={`${organization || "Company"} Logo`}
          className="mx-auto object-contain -mt-8"
          width={70}
          height={70}
        />
      )}
      {organization && <h4 className="text-center text-lg font-semibold">{organization}</h4>}
      {role && <h2 className="text-center text-3xl font-bold text-mulearn">{role}</h2>}

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

      <CardContent className="mt-auto flex flex-col gap-2 w-full">
        {jdlink && (
          <Button
            asChild
            variant={"default"}
            className="w-full flex items-center justify-center gap-1 px-4 py-2"
          >
            <a href={jdlink} target="_blank" rel="noopener noreferrer">
              <File /> View JD
            </a>
          </Button>
        )}
        {applylink && (
          <Button
            asChild
            variant={"default"}
            className="w-full flex items-center justify-center gap-1 px-4 py-2"
          >
            <a href={applylink} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
        )}
        {extraButton && (
          <Button
            asChild
            variant={"default"}
            className="w-full flex items-center justify-center gap-1 px-4 py-2"
          >
            <a href={extraButton} target="_blank" rel="noopener noreferrer">
              View Challenge
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CareersCard;
