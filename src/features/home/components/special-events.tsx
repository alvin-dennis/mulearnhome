import type { Variants } from "framer-motion";
import Link from "next/link";
import { MotionDiv, Section } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { specialevents } from "../data/home.data";
import { SpecialEventCard } from "./special-event-card";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export function SpecialEvents() {
  return (
    <div className="max-w-7xl mx-auto">
      <Section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <MotionDiv variants={fadeInUp} className="text-center mb-12">
          <h2 className="mb-4">
            Special <span className="text-mulearn">Events</span>
          </h2>
          <p className="font-medium text-lg text-mulearn-gray-600 max-w-3xl mx-auto">
            Discover exclusive events designed to inspire innovation, enhance skills, and foster
            meaningful connections across technology, management, and creativity.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 justify-items-center">
            {specialevents.map((specialevent) => (
              <SpecialEventCard key={specialevent.id} specialevent={specialevent} />
            ))}
          </div>
          <div className="mt-12">
            <Link href="/events">
              <Button variant={"default"} className="px-8 py-3 font-semibold">
                View All Events
              </Button>
            </Link>
          </div>
        </MotionDiv>
      </Section>
    </div>
  );
}
