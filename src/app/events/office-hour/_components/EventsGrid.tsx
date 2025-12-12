import { Calendar, Mic, User } from "lucide-react";
import Link from "next/link";
import MuImage from "@/components/MuImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OMEvent } from "@/lib/types";

interface EventsGridProps {
  events: OMEvent[];
  title: string;
  icon: React.ReactNode;
}

export default function EventsGrid({ events, title, icon }: EventsGridProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          {icon}
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Card key={event.id} variant="hoverable" className="h-full flex flex-col">
            <div className="h-48 bg-linear-to-br from-mulearn-trusty-blue/20 to-mulearn-duke-purple/20 flex items-center justify-center relative shrink-0">
              {event.thumbnail ? (
                <MuImage
                  src={event.thumbnail}
                  alt={`Office Hour: ${event.title}`}
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Mic className="w-16 h-16 text-mulearn-trusty-blue" />
              )}

              <div className="absolute top-4 right-4">
                <Badge variant={event.isUpcoming ? "default" : "secondary"}>
                  {event.isUpcoming ? "Upcoming" : "Past Event"}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-4 grow">
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-mulearn-trusty-blue bg-mulearn-trusty-blue/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <CardTitle className="text-xl mb-1 line-clamp-2">{event.title}</CardTitle>

              {event.performer && (
                <p className="text-sm text-mulearn-gray-400 flex items-center gap-1">
                  <User className="w-4 h-4" /> {event.performer}{" "}
                  {event.designation ? `- ${event.designation}` : ""}
                </p>
              )}
            </CardHeader>

            <CardContent className="pt-0 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-mulearn-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date} {event.time ? `• ${event.time}` : ""}
                </span>

                {event.link && (
                  <Link
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-mulearn-trusty-blue font-semibold hover:underline"
                  >
                    {event.isUpcoming ? "Join Live" : "View Past"}
                  </Link>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-mulearn-gray-400 mt-2 line-clamp-3">
                  {event.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
