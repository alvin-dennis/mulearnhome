import { Card, CardContent } from "@/components/ui/card";
import type { ClosedCareersCardProps } from "@/lib/types";

const ClosedCareersCard = ({
  date,
  location,
  qualifications,
  role,
  duration,
  remuneration,
}: ClosedCareersCardProps) => {
  return (
    <Card className="relative w-[350px] rounded-2xl bg-mulearn-whitish shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple p-4 text-center">
        <h2 className="text-lg font-semibold text-mulearn-whitish">μLearn Hiring Call</h2>
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

      <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
        Closed
      </div>
    </Card>
  );
};
export default ClosedCareersCard;
