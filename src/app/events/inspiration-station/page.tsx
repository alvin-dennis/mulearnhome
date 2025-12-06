"use client";

import { weeklyTwitch } from "@/data/events";
import { Radio, Calendar, PlayCircle, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EpisodeCard } from "./_components/EpisodeCard";
import { useState } from "react";
import Link from "next/link";

export default function InspirationStationPage() {
  const events = weeklyTwitch["inspiration station radio"];
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

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-mulearn-blackish leading-tight">
                µLearn{" "}
                <span className="block text-mulearn mt-2">
                  Inspiration Station Radio
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-mulearn-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                µLearn&apos;s storytelling-driven radio experience featuring
                real journeys, insights, and life-changing moments from the
                community.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
                <Link href="https://discord.gg/wqwTYuCR" target="_blank" rel="noopener noreferrer">
                  <Button variant={"mulearn"} className="px-6 py-2.5 gap-2 font-semibold">
                    <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Join
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <img
                  src="/assets/isr/isr.svg"
                  alt="Inspiration Station Radio Illustration"
                  className="w-full h-auto rounded-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-mulearn-blackish mb-3 md:mb-4">
              Inspiration Station Episodes
            </h2>
            <p className="text-mulearn-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-6 md:mb-8">
              Discover inspiring stories from our community
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 max-w-md mx-auto">
              <Button
                variant={"mulearn-outline"}
                onClick={() => setActiveTab("upcoming")}
                className={`flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 font-semibold rounded-full ${activeTab === "upcoming"
                    ? "sm:shadow-xl scale-105"
                    : "text-gray-500"
                  }`}
              >
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                Upcoming
              </Button>

              <Button
                variant={"mulearn-outline"}
                onClick={() => setActiveTab("past")}
                className={`flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold ${activeTab === "past"
                    ? "sm:shadow-xl scale-105"
                    : "text-gray-500"
                  }`}
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                Previous
              </Button>
            </div>
          </div>

          <div className="transition-all duration-300">
            {activeTab === "upcoming" && (
              <div>
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {upcomingEvents.map((event) => (
                      <EpisodeCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
                      No Upcoming Episodes
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base">
                      Check back later for new inspiring stories!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "past" && (
              <div>
                <div className="text-center mb-6 md:mb-8">
                  <p className="text-mulearn-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                    Listed below are the speakers who came to the inspiration
                    stations and inspired our listeners with their stories and
                    experiences.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {pastEvents.map((event) => (
                    <EpisodeCard key={event.id} event={event} />
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
