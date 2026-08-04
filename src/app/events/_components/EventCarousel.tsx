"use client";

import { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/lib/types";

interface Props {
  events: Event[];
  rtl?: boolean;
}

export default function EventCarousel({ events, rtl = false }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative">
      <Button
        ref={prevRef}
        variant={"ghost"}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronLeft className="w-5 h-5 text-mulearn-whitish" />
      </Button>

      <Button
        ref={nextRef}
        variant={"ghost"}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronRight className="w-5 h-5 text-mulearn-whitish" />
      </Button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        dir={rtl ? "rtl" : "ltr"}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-expect-error - Swiper typing mismatch
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error - Swiper typing mismatch
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        loop={events.length > 3}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!pb-12"
      >
        {events.map((event, i) => (
          <SwiperSlide key={`${event.title}-${event.date || i}`} dir="ltr">
            <MotionDiv
              layout={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <EventCard event={event} />
            </MotionDiv>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
