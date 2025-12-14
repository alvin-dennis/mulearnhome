"use client";

import { Calendar, Clock, Mic, PlayCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import MuImage from "@/components/MuImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { openMicData } from "@/data/events";
import type { OMEvent } from "@/lib/types";

export default function OpenMicPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">("upcoming");
  const [search, setSearch] = useState("");

  const upcomingEvents = useMemo(() => openMicData.events.filter((e) => e.isUpcoming), []);
  const pastEvents = useMemo(() => openMicData.events.filter((e) => !e.isUpcoming), []);

  const filteredEvents = useMemo(() => {
    const events = activeTab === "upcoming" ? upcomingEvents : pastEvents;
    return events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search, upcomingEvents, pastEvents]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-2 border-mulearn-trusty-blue text-mulearn-trusty-blue font-bold text-sm py-2 px-4 shadow-sm"
          >
            <Mic className="w-4 h-4 mr-2" /> Community Platform
          </Badge>

          <h1 className="mb-6">
            µLearn <span className="text-mulearn">Open Mic</span>
          </h1>

          <p className="text-lg md:text-xl text-mulearn-gray-600 mb-8">
            A platform where µLearn members perform, speak, express creativity, and share unique
            stories or talents.
          </p>

          <div className="flex justify-center mb-6">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab} events...`}
              className="border border-mulearn-gray-600 rounded-lg py-2 px-4 w-full max-w-md text-sm"
            />
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={activeTab === "upcoming" ? "mulearn" : "outline"}
              className="rounded-full px-6"
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Sessions
            </Button>

            <Button
              variant={activeTab === "previous" ? "mulearn" : "outline"}
              className="rounded-full px-6"
              onClick={() => setActiveTab("previous")}
            >
              Previous Sessions
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <FallbackEmpty
              title={
                activeTab === "upcoming"
                  ? "No Upcoming Open Mic Sessions"
                  : "No Past Performances Yet"
              }
              description={
                activeTab === "upcoming"
                  ? "New performances will be announced soon. Stay tuned!"
                  : "Be part of the next Open Mic and make history ✨"
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}

function FallbackEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-8 md:py-12">
      <Calendar className="w-12 h-12 md:w-16 md:h-16 text-mulearn-gray-600  mx-auto mb-3 md:mb-4" />
      <h3 className="text-lg md:text-xl font-semibold text-mulearn-gray-600 mb-2">{title}</h3>
      <p className="text-mulearn-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
}

function useReadMore(initialText: string, maxLength: number = 100) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = initialText.length > maxLength;
  const displayText = isExpanded
    ? initialText
    : shouldTruncate
      ? `${initialText.slice(0, maxLength)}...`
      : initialText;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return { displayText, isExpanded, shouldTruncate, toggleExpand };
}

function EventCard({ event }: { event: OMEvent }) {
  const { displayText, isExpanded, shouldTruncate, toggleExpand } = useReadMore(
    event.description,
    120,
  );

  return (
    <Card variant="hoverable" className="h-full flex flex-col">
      <div className="h-48 bg-linear-to-br from-mulearn-trusty-blue/20 to-mulearn-duke-purple/20 flex items-center justify-center relative flex-shrink-0">
        {event.thumbnail ? (
          <MuImage
            src={event.thumbnail}
            alt={`Open Mic performance: ${event.title}`}
            width={400}
            height={192}
            className="object-cover w-full h-full"
          />
        ) : (
          <Mic className="w-16 h-16 text-mulearn-trusty-blue" />
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={event.isUpcoming ? "default" : "secondary"} className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {event.isUpcoming ? "Upcoming" : "Past Event"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4 flex-grow">
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

        <CardTitle className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>

        {event.performer && (
          <p className="text-mulearn-gray-700 font-medium mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-mulearn-gray-500" />
            Featuring: {event.performer}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <p className="text-mulearn-gray-600 leading-relaxed">{displayText}</p>
          {shouldTruncate && (
            <Button
              variant="link"
              onClick={toggleExpand}
              className="p-0 h-auto text-mulearn-trusty-blue hover:text-mulearn-duke-purple font-medium text-sm mt-2"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <span className="text-sm text-mulearn-gray-500 font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {event.date}
          </span>
          <Button
            variant={event.isUpcoming ? "mulearn" : "mulearn-outline"}
            className="gap-1 px-4 py-2 text-sm rounded-full"
          >
            <PlayCircle className="w-4 h-4" />
            {event.isUpcoming ? "Register" : "Watch"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
