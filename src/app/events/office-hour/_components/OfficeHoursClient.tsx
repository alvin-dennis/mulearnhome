"use client";

import { AnimatePresence } from "framer-motion";
import { Calendar, Clock, Mic, PlayCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/app/events/_components/EmptyState";
import { GenericEventCard } from "@/app/events/_components/GenericEventCard";
import Pagination from "@/app/events/_components/Pagination";
import SearchAndFilter from "@/app/events/_components/SearchAndFilter";
import { TabButton } from "@/app/events/_components/TabButton";
import { MotionSection } from "@/components/MuFramer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface OfficeHourSession {
  title: string;
  performer?: string | null;
  designation?: string | null;
  description?: string | null;
  date?: string | null;
  interestGroups?: (string | null)[] | null;
  isUpcoming?: boolean | null;
  link?: string | null;
  poster_thumbnail?: string | null;
}

interface OfficeHoursClientProps {
  sessions: OfficeHourSession[];
}

type ViewType = "upcoming" | "previous";

export default function OfficeHoursClient({ sessions }: OfficeHoursClientProps) {
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

  // Parse DD/MM/YYYY date format and check if it's upcoming (today or future)
  const isDateUpcoming = useCallback((dateStr: string): boolean => {
    if (!dateStr) return false;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return false;
    const eventDate = new Date(
      parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10),
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }, []);

  // Transform sessions to match expected format
  const allEvents = useMemo(() => {
    return sessions.map((session, index) => ({
      id: index + 1,
      title: session.title,
      performer: session.performer || "",
      designation: session.designation || "",
      description: session.description || "",
      date: session.date || "",
      interestGroups: session.interestGroups?.filter((t): t is string => t !== null) || [],
      isUpcoming: isDateUpcoming(session.date || ""),
      link: session.link || undefined,
      thumbnail: session.poster_thumbnail || undefined,
    }));
  }, [sessions, isDateUpcoming]);

  const allTags = useMemo(
    () => Array.from(new Set(allEvents.flatMap((e) => e.interestGroups))),
    [allEvents],
  );

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => event.title.toLowerCase().includes(search.toLowerCase()))
      .filter((event) =>
        selectedTags.length === 0
          ? true
          : selectedTags.every((t) => event.interestGroups.includes(t)),
      )
      .sort((a, b) => {
        // Parse dates in DD/MM/YYYY format
        const parseDate = (dateStr: string) => {
          if (!dateStr) return 0;
          const parts = dateStr.split("/");
          if (parts.length === 3) {
            // DD/MM/YYYY format
            return new Date(
              parseInt(parts[2], 10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[0], 10),
            ).getTime();
          }
          return new Date(dateStr).getTime() || 0;
        };
        return parseDate(b.date) - parseDate(a.date);
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
  }, []);

  const motionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-4 md:py-8">
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

            <Button variant={"default"} className="px-8 py-3 gap-2 rounded-full">
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
      <div className="flex justify-center gap-3 py-4">
        <TabButton
          icon={Clock}
          label="Upcoming"
          isActive={view === "upcoming"}
          onClick={() => setView("upcoming")}
        />
        <TabButton
          icon={Calendar}
          label="Previous"
          isActive={view === "previous"}
          onClick={() => setView("previous")}
        />
      </div>
      <AnimatePresence mode="wait">
        {view === "upcoming" && (
          <MotionSection
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedUpcoming.map((event) => (
                    <GenericEventCard
                      key={event.id}
                      event={event}
                      variant="office-hour"
                      icon={Mic}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Upcoming Episodes"
                  description="Check back later for new inspiring stories!"
                />
              )}

              <Pagination
                page={upcomingPage}
                setPage={setUpcomingPage}
                total={upcomingEvents.length}
                perPage={itemsPerPage}
              />
            </div>
          </MotionSection>
        )}

        {view === "previous" && (
          <MotionSection
            key="previous"
            variants={motionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="py-12 pb-20"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPast.map((event) => (
                  <GenericEventCard key={event.id} event={event} variant="office-hour" icon={Mic} />
                ))}
              </div>

              <Pagination
                page={pastPage}
                setPage={setPastPage}
                total={pastEvents.length}
                perPage={itemsPerPage}
              />
            </div>
          </MotionSection>
        )}
      </AnimatePresence>
    </div>
  );
}
