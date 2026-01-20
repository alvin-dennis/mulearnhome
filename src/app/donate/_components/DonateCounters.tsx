import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";

export default function DonateCounters() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
      <Card className="flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="text-3xl sm:text-4xl font-extrabold text-mulearn">
            <CountUp end={62} duration={2.5} suffix="K+" />
          </div>
          <div className="text-sm text-mulearn-blackish">Students</div>
        </CardContent>
      </Card>

      <Card className="flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="text-3xl sm:text-4xl font-extrabold text-mulearn">
            <CountUp end={378} duration={2.2} separator="," suffix="+" />
          </div>
          <div className="text-sm text-mulearn-blackish">Events</div>
        </CardContent>
      </Card>
    </div>
  );
}
