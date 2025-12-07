"use client";

import { useState, useMemo } from "react";
import { officehourdata } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Mic, Clock, Calendar, PlayCircle } from "lucide-react";
import SearchAndFilter from "./_components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import EventsGrid from "./_components/EventsGrid";
import Pagination from "./_components/Pagination";

export default function OfficeHoursPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const itemsPerPage = 6;

  const allEvents = officehourdata.events;

  const allTags = useMemo(
    () => Array.from(new Set(allEvents.flatMap((e) => e.tags))),
    [allEvents]
  );

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((event) =>
        selectedTags.length === 0
          ? true
          : selectedTags.every((t) => event.tags.includes(t))
      )
      .sort((a, b) => {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return bDate - aDate;
      });
  }, [search, selectedTags, allEvents]);

  const upcomingEvents = filteredEvents.filter((e) => e.isUpcoming);
  const pastEvents = filteredEvents.filter((e) => !e.isUpcoming);

  const paginatedUpcoming = useMemo(() => {
    const start = (upcomingPage - 1) * itemsPerPage;
    return upcomingEvents.slice(start, start + itemsPerPage);
  }, [upcomingEvents, upcomingPage]);

  const paginatedPast = useMemo(() => {
    const start = (pastPage - 1) * itemsPerPage;
    return pastEvents.slice(start, start + itemsPerPage);
  }, [pastEvents, pastPage]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 border-2 border-mulearn-trusty-blue text-mulearn-trusty-blue font-bold text-sm py-2 px-4 hover:bg-mulearn-trusty-blue/10 hover:border-mulearn-duke-purple hover:text-mulearn-duke-purple transition-all duration-300 shadow-sm"
            >
              <Mic className="w-4 h-4 mr-2" />
              Community Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl font-black text-mulearn-blackish mb-6 leading-tight">
              µLearn{" "}
              <span className="text-mulearn">
                Office Hour
              </span>
            </h1>

            <p className="text-lg md:text-xl text-mulearn-gray-600 leading-relaxed mb-8">
              A space where µLearn members connect, learn, and grow together.
              Office Hour is our community-driven learning zone — a place to ask
              questions, share progress, explore ideas, and get guidance from
              peers and mentors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant={"mulearn"}
                className="px-8 py-3 gap-2 text-base rounded-full"
              >
                <PlayCircle className="w-5 h-5" />
                Join Next Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SearchAndFilter
        search={search}
        onSearchChange={setSearch}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        allTags={allTags}
      />

      {upcomingEvents.length > 0 && (
        <section className="py-12" id="upcoming-section">
          <div className="max-w-7xl mx-auto px-4">
            <EventsGrid
              events={paginatedUpcoming}
              title="Upcoming Sessions"
              icon={<Clock className="w-8 h-8 mr-3 text-mulearn-trusty-blue" />}
            />

            <Pagination
              page={upcomingPage}
              setPage={setUpcomingPage}
              total={upcomingEvents.length}
              perPage={itemsPerPage}
              scrollToId="upcoming-section"
            />
          </div>
        </section>
      )}

      <section className="py-12 pb-20" id="past-section">
        <div className="max-w-7xl mx-auto px-4">
          <EventsGrid
            events={paginatedPast}
            title="Performance Highlights"
            icon={<Calendar className="w-8 h-8 mr-3 text-mulearn-trusty-blue" />}
          />

          <Pagination
            page={pastPage}
            setPage={setPastPage}
            total={pastEvents.length}
            perPage={itemsPerPage}
            scrollToId="past-section"
          />
        </div>
      </section>
    </div>
  );
}
