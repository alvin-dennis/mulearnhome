"use client";

import { Calendar, Clock, Mic, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/app/events/_components/EmptyState";
import { GenericEventCard } from "@/app/events/_components/GenericEventCard";
import { TabButton } from "@/app/events/_components/TabButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openMicData } from "@/data/events";

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
      <section className="relative overflow-hidden py-4 md:py-8">
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
            <TabButton
              icon={Clock}
              label="Upcoming"
              isActive={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
            />
            <TabButton
              icon={Calendar}
              label="Previous"
              isActive={activeTab === "previous"}
              onClick={() => setActiveTab("previous")}
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <GenericEventCard
                  key={event.id}
                  event={event}
                  variant="open-mic"
                  icon={Mic}
                  actionButton={{
                    label: event.isUpcoming ? "Register" : "Watch",
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
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
