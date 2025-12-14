"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Mic, PlayCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { officehourdata } from "@/data/events";
import EventsGrid from "./_components/EventsGrid";
import Pagination from "./_components/Pagination";
import SearchAndFilter from "./_components/SearchAndFilter";

type ViewType = "upcoming" | "previous";

export default function OfficeHoursPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view") as ViewType | null;
  const view: ViewType = viewParam === "previous" ? "previous" : "upcoming";

  const setView = (nextView: ViewType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    router.push(`?${params.toString()}`, { scroll: false });
  };
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const itemsPerPage = 6;

  const allEvents = officehourdata.events;

  const allTags = useMemo(() => Array.from(new Set(allEvents.flatMap((e) => e.tags))), [allEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => event.title.toLowerCase().includes(search.toLowerCase()))
      .filter((event) =>
        selectedTags.length === 0 ? true : selectedTags.every((t) => event.tags.includes(t)),
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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  useEffect(() => {
    setUpcomingPage(1);
    setPastPage(1);
  }, [view, search, selectedTags]);

  const motionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 border-2 border-mulearn-trusty-blue text-mulearn-trusty-blue font-bold text-sm py-2 px-4"
            >
              <Mic className="w-4 h-4 mr-2" />
              Community Platform
            </Badge>

            <h1 className="mb-6">
              µLearn <span className="text-mulearn">Office Hour</span>
            </h1>

            <p className="text-lg md:text-xl text-mulearn-gray-600 leading-relaxed mb-8">
              A space where µLearn members connect, learn, and grow together. Office Hour is our
              community-driven learning zone.
            </p>

            <Button variant="mulearn" className="px-8 py-3 gap-2 rounded-full">
              <PlayCircle className="w-5 h-5" />
              Join Next Session
            </Button>
          </div>
        </div>
      </section>
      <SearchAndFilter
        search={search}
        onSearchChange={setSearch}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        allTags={allTags}
        view={view}
      />
      <div className="flex justify-center gap-3 py-10">
        <Button
          variant={view === "upcoming" ? "mulearn" : "outline"}
          className="rounded-full px-6"
          onClick={() => setView("upcoming")}
        >
          Upcoming Sessions
        </Button>

        <Button
          variant={view === "previous" ? "mulearn" : "outline"}
          className="rounded-full px-6"
          onClick={() => setView("previous")}
        >
          Previous Sessions
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {view === "upcoming" && (
          <motion.section
            key="upcoming"
            variants={motionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="py-12"
          >
            <div className="max-w-7xl mx-auto px-4">
              {paginatedUpcoming.length > 0 ? (
                <EventsGrid
                  events={paginatedUpcoming}
                  title="Upcoming Sessions"
                  icon={<Clock className="w-8 h-8 mr-3 text-mulearn-trusty-blue" />}
                />
              ) : (
                <div className="text-center py-8 md:py-12">
                  <Calendar className="w-12 h-12 md:w-16 md:h-16 text-mulearn-gray-600 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-mulearn-gray-600 mb-2">
                    No Upcoming Episodes
                  </h3>
                  <p className="text-mulearn-gray-600 text-sm md:text-base">
                    Check back later for new inspiring stories!
                  </p>
                </div>
              )}

              <Pagination
                page={upcomingPage}
                setPage={setUpcomingPage}
                total={upcomingEvents.length}
                perPage={itemsPerPage}
              />
            </div>
          </motion.section>
        )}

        {view === "previous" && (
          <motion.section
            key="previous"
            variants={motionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="py-12 pb-20"
          >
            <div className="max-w-7xl mx-auto px-4">
              <EventsGrid
                events={paginatedPast}
                title="Previous Sessions"
                icon={<Calendar className="w-8 h-8 mr-3 text-mulearn-trusty-blue" />}
              />

              <Pagination
                page={pastPage}
                setPage={setPastPage}
                total={pastEvents.length}
                perPage={itemsPerPage}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
