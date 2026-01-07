import type { Variants } from "framer-motion";
import EventCarousel from "@/app/events/_components/EventCarousel";
import Grid from "@/app/events/_components/Grid";
import { MotionDiv } from "@/components/MuFramer";
import { getLatestEvents, getPastEvents, getRecurringEvents } from "@/lib/tina";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

// Transform TinaCMS event to local Event type
function transformEvent(
  tinaEvent: NonNullable<Awaited<ReturnType<typeof getLatestEvents>>[number]>,
): Event {
  return {
    title: tinaEvent.title,
    date: tinaEvent.date || "",
    description: tinaEvent.description || "",
    link: tinaEvent.link || "",
    image: tinaEvent.image || "",
    isLive: tinaEvent.isLive || false,
  };
}

export default async function Events() {
  // Fetch events from TinaCMS
  const [latestEvents, pastEvents, recurringEvents] = await Promise.all([
    getLatestEvents(),
    getPastEvents(),
    getRecurringEvents(),
  ]);

  // Transform TinaCMS events to local Event type
  const transformedLatest = latestEvents
    .filter((e): e is NonNullable<typeof e> => e != null)
    .map(transformEvent);
  const transformedPast = pastEvents
    .filter((e): e is NonNullable<typeof e> => e != null)
    .map(transformEvent);
  const transformedRecurring = {
    weekly: recurringEvents.weekly
      .filter((e): e is NonNullable<typeof e> => e != null)
      .map(transformEvent),
    biweekly: recurringEvents.biweekly
      .filter((e): e is NonNullable<typeof e> => e != null)
      .map(transformEvent),
    monthly: recurringEvents.monthly
      .filter((e): e is NonNullable<typeof e> => e != null)
      .map(transformEvent),
    flagship: recurringEvents.flagship
      .filter((e): e is NonNullable<typeof e> => e != null)
      .map(transformEvent),
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
      flagship: "Flagship Events",
      past: "Past Events",
    };
    return titles[type] || type;
  };

  const recurringEventsEntries: [string, Event[]][] = Object.entries(transformedRecurring).filter(
    ([, events]) => events.length > 0,
  );

  const shouldUseCarousel = (events: Event[]) => events.length > 3;

  const allEventsSections: [string, Event[]][] = [
    ["latest", transformedLatest],
    ...recurringEventsEntries,
    ["past", transformedPast],
  ] as [string, Event[]][];

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
        {allEventsSections.map(([type, events]) => (
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

            {shouldUseCarousel(events) ? (
              <EventCarousel events={events} />
            ) : (
              <Grid events={events} />
            )}
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}
