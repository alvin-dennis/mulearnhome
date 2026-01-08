"use client";

import { Calendar, Clock, PlayCircle, Radio } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/app/events/_components/EmptyState";
import { GenericEventCard } from "@/app/events/_components/GenericEventCard";
import { TabButton } from "@/app/events/_components/TabButton";
import MuImage from "@/components/MuImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface InspirationStationEpisode {
  topic: string;
  campus: string;
  zone?: string | null;
  date?: string | null;
  description?: string | null;
  isUpcoming?: boolean | null;
  link?: string | null;
}

interface InspirationStationClientProps {
  episodes: InspirationStationEpisode[];
}

export default function InspirationStationClient({ episodes }: InspirationStationClientProps) {
  // Parse YYYY-MM-DD date format and check if it's upcoming (today or future)
  const isDateUpcoming = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    if (Number.isNaN(eventDate.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Transform episodes to match WeeklyTwitchEvent type
  const events = episodes.map((episode, index) => ({
    id: index + 1,
    topic: episode.topic,
    campus: episode.campus,
    zone: episode.zone || "",
    date: episode.date || "",
    description: episode.description || "",
    isUpcoming: isDateUpcoming(episode.date || ""),
    link: episode.link || undefined,
  }));

  const upcomingEvents = events.filter((event) => event.isUpcoming);
  const pastEvents = events.filter((event) => !event.isUpcoming);

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Badge
                  variant="outline"
                  className="border-2 border-mulearn-trusty-blue text-mulearn-trusty-blue font-bold text-sm py-1 md:py-2 px-3 md:px-4 hover:bg-mulearn-trusty-blue/10 hover:border-mulearn-duke-purple hover:text-mulearn-duke-purple transition-all duration-300 shadow-sm"
                >
                  <Radio className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Storytelling Platform
                </Badge>
              </div>

              <h1>
                µLearn <span className="block text-mulearn mt-2">Inspiration Station Radio</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-mulearn-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                µLearn&apos;s storytelling-driven radio experience featuring real journeys,
                insights, and life-changing moments from the community.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
                <Link href="https://discord.gg/wqwTYuCR" target="_blank" rel="noopener noreferrer">
                  <Button variant={"default"} className="px-6 py-2.5 gap-2 font-semibold">
                    <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Join
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <MuImage
                  src="/assets/isr/isr.svg"
                  alt="Inspiration Station Radio Illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-2xl"
                  preload
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-3 md:mb-4">Inspiration Station Episodes</h2>
            <p className="text-mulearn-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-6 md:mb-8">
              Discover inspiring stories from our community
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 max-w-md mx-auto">
              <TabButton
                icon={Clock}
                label="Upcoming"
                isActive={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
              />
              <TabButton
                icon={Calendar}
                label="Previous"
                isActive={activeTab === "past"}
                onClick={() => setActiveTab("past")}
              />
            </div>
          </div>

          <div className="transition-all duration-300">
            {activeTab === "upcoming" && (
              <div>
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {upcomingEvents.map((event) => (
                      <GenericEventCard
                        key={event.id}
                        event={event}
                        variant="episode"
                        icon={Radio}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Upcoming Episodes"
                    description="Check back later for new inspiring stories!"
                  />
                )}
              </div>
            )}

            {activeTab === "past" && (
              <div>
                <div className="text-center mb-6 md:mb-8">
                  <p className="text-mulearn-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                    Listed below are the speakers who came to the inspiration stations and inspired
                    our listeners with their stories and experiences.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {pastEvents.map((event) => (
                    <GenericEventCard key={event.id} event={event} variant="episode" icon={Radio} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
