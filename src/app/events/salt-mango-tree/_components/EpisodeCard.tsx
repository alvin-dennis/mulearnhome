"use client";

import { Calendar, Clock, MapPin, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyTwitchEvent } from "@/lib/types";

interface EpisodeCardProps {
  event: WeeklyTwitchEvent;
}

export function EpisodeCard({ event }: EpisodeCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
      {/* Thumbnail Section */}
      <div className="h-48 bg-linear-to-br from-mulearn-trusty-blue/20 to-mulearn-duke-purple/20 flex items-center justify-center relative flex-shrink-0">
        <Radio className="w-16 h-16 text-mulearn-trusty-blue" />
        <div className="absolute top-4 right-4">
          <Badge
            className={`flex items-center ${
              event.isUpcoming
                ? "bg-mulearn-whitish text-mulearn-trusty-blue border border-mulearn-trusty-blue"
                : "bg-gray-100 text-mulearn-blackish"
            }`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {event.isUpcoming ? "Upcoming" : "Past Episode"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-mulearn-trusty-blue bg-mulearn-trusty-blue/10">
            {event.zone}
          </Badge>
        </div>

        <CardTitle className="text-xl mb-2 line-clamp-2">{event.topic}</CardTitle>

        {event.campus && (
          <p className="text-mulearn-gray-700 font-medium mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-mulearn-gray-500" />
            {event.campus}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-grow">
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <span className="text-sm text-mulearn-gray-500 font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {event.date}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
