"use client";

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
}

export default function EventCarousel({ events }: Props) {
  return (
    <div className="relative">
      <Button
        variant={"mulearn"}
        className="swiper-button-prev absolute -translate-y-1/2 z-10 flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-mulearn-whitish" />
      </Button>

      <Button
        variant={"mulearn"}
        className="swiper-button-next absolute -translate-y-1/2 z-10 flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5 text-mulearn-whitish" />
      </Button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop={events.length > 3}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!pb-12"
      >
        {events.map((event, i) => (
          <SwiperSlide key={event.title}>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
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
