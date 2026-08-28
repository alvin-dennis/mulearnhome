"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { enablers } from "../../data/enablers.data";

import "swiper/css";
import "swiper/css/navigation";

const colleges = enablers.colleges;

export function FiftyPlusColleges() {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <section className="mx-auto max-w-7xl py-10">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h2 className="text-5xl">
            Over 80+ Colleges are <span className="text-mulearn">µLearn</span>ified
          </h2>
        </div>

        <div className="relative px-14 w-full">
          <Button
            variant="default"
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12"
          >
            <ChevronLeft className="w-6 h-6 text-mulearn-whitish" />
          </Button>

          <Button
            variant="default"
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12"
          >
            <ChevronRight className="w-6 h-6 text-mulearn-whitish" />
          </Button>

          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              reverseDirection: true,
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-4"
          >
            {colleges.map((college) => (
              <SwiperSlide key={`${college.title}`} className="h-auto">
                <Card
                  key={`${college.title}`}
                  className="h-40 shrink-0 flex flex-col border-mulearn/10 bg-linear-to-br from-mulearn-whitish to-mulearn/5"
                >
                  <CardContent className="flex items-center justify-center p-3 h-full">
                    <p className="text-md font-bold text-center leading-snug">{college.title}</p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
