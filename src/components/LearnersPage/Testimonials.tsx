"use client";

import React, { useState, useEffect } from 'react';
import { testimonialsData, slideImages } from '@/data/data'; 
interface SlideImage {
  imageUrl: string;
  alt: string;
}

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideImage[] = slideImages;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-gray-50 pt-8 md:pt-12 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mt-10 mx-auto w-full max-w-6xl h-[400px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(37,99,235,0.4)]">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.imageUrl}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Cards */}
        <div className="mt-12 relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-r from-white via-gray-50/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-l from-white via-gray-50/80 to-transparent z-10 pointer-events-none" />

          <div className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
            <div className="flex gap-6 pb-4 px-8">
              {testimonialsData.map((testimonial, index) => (
                <div
                  key={index}
                  className="mt-4 flex-shrink-0 w-80 relative h-[280px] rounded-[24px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(256,256,256,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_50px_-10px_rgba(37,99,235,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A7FE8] via-[#5B8FF5] to-[#6BA5FF]" />
                  <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <p className="text-sm text-white leading-relaxed italic mb-4 drop-shadow-sm">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.imageUrl}
                        alt={`${testimonial.name}'s profile`}
                        className="w-14 h-14 rounded-xl object-cover shadow-lg border-2 border-white/30"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + testimonial.name;
                        }}
                      />
                      <div>
                        <p className="font-bold text-white text-base drop-shadow">– {testimonial.name}</p>
                        <p className="text-sm text-white/90 font-medium drop-shadow">{testimonial.designation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-[24px] border border-white/20 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
