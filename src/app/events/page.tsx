import type { Variants } from "framer-motion";
import EventCarousel from "@/app/events/_components/EventCarousel";
import Grid from "@/app/events/_components/Grid";
import { MotionDiv } from "@/components/MuFramer";
import { events } from "@/data/events";
import { clientEnv } from "@/lib/env/env.client";
import type { Event, PublicEvent } from "@/lib/types";
import { fetchPublicEvents } from "@/services/publicEvents";
import {
  fetchGrabYourSuperpowers,
  fetchInspirationStation,
  fetchOfficeHours,
  fetchSaltMangoTree,
} from "@/services/weeklyTwitches";

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function mapPublicEventToEvent(item: PublicEvent): Event {
  const start = new Date(item.start_datetime);
  const end = new Date(item.end_datetime);

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  const startFormatted = start.toLocaleDateString("en-IN", options);
  const endFormatted = end.toLocaleDateString("en-IN", options);

  let dateRange = startFormatted;
  if (startFormatted !== endFormatted) {
    if (start.getFullYear() === end.getFullYear()) {
      const startMonthDay = start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dateRange = `${startMonthDay} - ${endFormatted}`;
    } else {
      dateRange = `${startFormatted} - ${endFormatted}`;
    }
  }

  const description =
    item.description ||
    `Event Category: ${item.category_name || item.event_type || "General"}. Organised by ${
      item.organizer?.organiser_ig?.name || item.organizer?.organiser_campus?.title || "MuLearn"
    }.`;

  return {
    title: item.title,
    description: description,
    image: item.cover_image || undefined,
    isLive: item.status === "ongoing",
    date: dateRange,
    link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/event/${item.id}`,
  };
}

const WEEKLY_TWITCH_FETCHERS: Record<
  string,
  (params: { status: "upcoming"; pageIndex: number; perPage: number }) => Promise<{
    data: { date: string; time?: string | null }[];
  }>
> = {
  "Office Hour": fetchOfficeHours,
  "Inspiration Station Radio": fetchInspirationStation,
  "Salt Mango Tree": fetchSaltMangoTree,
  "Grab Your Superpowers": fetchGrabYourSuperpowers,
};

async function withNextSessionDate(weekly: Event[]): Promise<Event[]> {
  return Promise.all(
    weekly.map(async (item) => {
      const fetcher = WEEKLY_TWITCH_FETCHERS[item.title];
      if (!fetcher) return item;

      try {
        const { data } = await fetcher({ status: "upcoming", pageIndex: 1, perPage: 1 });
        const next = data[0];
        if (!next) return item;
        return {
          ...item,
          date: formatDate(next.date),
          time: next.time ? next.time.slice(0, 5) : undefined,
        };
      } catch {
        return item;
      }
    }),
  );
}

export default async function Events() {
  const { pastEvents, recurringEvents } = events;

  let latestEvents: Event[] = [];
  try {
    const publicEventsData = await fetchPublicEvents();
    if (publicEventsData && Array.isArray(publicEventsData.data)) {
      latestEvents = publicEventsData.data.map(mapPublicEventToEvent);
    }
  } catch (error) {
    console.error("Failed to fetch public events:", error);
    latestEvents = events.latestEvents;
  }

  const weeklyWithDates = await withNextSessionDate(recurringEvents.weekly);

  const recurring: Record<string, Event[]> = {
    weekly: weeklyWithDates,
    biweekly: recurringEvents.biweekly,
    monthly: recurringEvents.monthly,
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const formatSectionTitle = (type: string) => {
    const titles: Record<string, string> = {
      latest: "Ongoing Events",
      weekly: "Weekly Twitch Events",
      biweekly: "Biweekly Events",
      monthly: "Monthly Events",
      past: "Past Events",
    };
    return titles[type] || type;
  };

  const recurringEventsEntries = Object.entries(recurring).filter(([, evs]) => evs.length > 0) as [
    string,
    Event[],
  ][];

  const shouldUseCarousel = (evs: Event[]) => evs.length >= 3;

  const allEventsSections: [string, Event[]][] = [
    ["latest", latestEvents],
    ...recurringEventsEntries,
  ];

  return (
    <section className="px-6 py-8 md:px-12 min-h-screen">
      <div className="max-w-[1300px] mx-auto mb-16">
        <MotionDiv
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full text-center px-2 sm:px-0"
        >
          <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] text-mulearn-blackish font-bold leading-tight mb-6">
            <span className="text-mulearn">µLearn</span> Events
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-mulearn-gray-600 max-w-3xl mx-auto leading-relaxed">
            Several recurring activities are conducted at µLearn each week. There will be events
            filled with stories, learning experiences, inspirations, and much more. Join in and
            let&apos;s learn something new.
          </p>
        </MotionDiv>
      </div>

      <div className="max-w-6xl mx-auto">
        {allEventsSections.map(([type, evs]) => (
          <MotionDiv
            key={type}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="mb-3 text-center md:text-left">
              <h2 className="mb-1">{formatSectionTitle(type)}</h2>
              <div className="w-20 h-1 bg-mulearn mx-auto md:mx-0 rounded-full" />
            </div>

            {shouldUseCarousel(evs) ? (
              <EventCarousel events={evs} rtl={type === "latest" || type === "past"} />
            ) : (
              <Grid events={evs} />
            )}
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}
