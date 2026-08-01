import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ClosedCareersCardProps } from "@/lib/types";

const ClosedCareersCard = ({
  date,
  location,
  qualifications,
  role,
  duration,
  remuneration,
  organization,
}: ClosedCareersCardProps) => {
  return (
    <Card className="relative w-[350px] rounded-2xl bg-mulearn-whitish shadow-lg border border-mulearn-greyish overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-mulearn p-4 pr-20 text-left">
        <h2 className="text-lg font-semibold text-mulearn-whitish">{organization}</h2>
      </div>

      <CardContent className="p-5 space-y-2 text-mulearn-blackish text-sm">
        {role && (
          <p>
            <strong>Role:</strong> {role}
          </p>
        )}
        {location && (
          <p>
            <strong>Location:</strong> {location}
          </p>
        )}
        {duration && (
          <p>
            <strong>Duration:</strong> {duration}
          </p>
        )}
        {remuneration && (
          <p>
            <strong>Remuneration:</strong> {remuneration}
          </p>
        )}
        {qualifications && (
          <p>
            <strong>Qualifications:</strong> {qualifications}
          </p>
        )}
        {date && (
          <p>
            <strong>Closed on:</strong> {date}
          </p>
        )}
      </CardContent>

      <Badge variant={"destructive"} className="absolute top-3 right-3 z-10">
        Closed
      </Badge>
    </Card>
  );
};
export default ClosedCareersCard;
