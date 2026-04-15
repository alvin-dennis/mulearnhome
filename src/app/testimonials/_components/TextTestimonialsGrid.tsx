"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { MotionDiv, MotionH2, MotionP } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import type { TextTestimonial } from "@/lib/types";
import TextTestimonialCard from "./TextTestimonialCard";

export type TextFilterType = "all" | "learner" | "mentor" | "partner" | "community-leader";

interface TextTestimonialsGridProps {
  testimonials: TextTestimonial[];
  activeFilter?: TextFilterType;
  onFilterChange?: (filter: TextFilterType) => void;
}

export default function TextTestimonialsGrid({
  testimonials,
  activeFilter,
  onFilterChange,
}: TextTestimonialsGridProps) {
  const [internalFilter, setInternalFilter] = useState<TextFilterType>("all");

  const filter = activeFilter ?? internalFilter;
  const setFilter = onFilterChange ?? setInternalFilter;

  const filteredTestimonials =
    filter === "all" ? testimonials : testimonials.filter((t) => t.type === filter);

  const filterOptions: { value: TextFilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "learner", label: "Learners" },
    { value: "mentor", label: "Mentors" },
    { value: "partner", label: "Partners" },
    { value: "community-leader", label: "Community Leaders" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const itemTransition = {
    duration: 0.3,
    ease: "easeOut" as const,
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <MotionH2
          className=" text-4xl md:text-5xl font-bold text-mulearn-blackish mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Community Voices
        </MotionH2>
        <MotionP
          className="text-xl text-mulearn-gray-600  max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Read what our community members are saying about their µLearn experience
        </MotionP>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-center items-center gap-2 bg-mulearn-gray-100 rounded-2xl p-2 max-w-full">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setFilter(option.value)}
              variant={filter === option.value ? "default" : "ghost"}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === option.value ? "shadow-sm" : "text-mulearn-gray-600"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
      >
        <AnimatePresence mode="wait">
          {filteredTestimonials.map((testimonial) => (
            <MotionDiv
              key={testimonial.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={itemTransition}
            >
              <TextTestimonialCard testimonial={testimonial} />
            </MotionDiv>
          ))}
        </AnimatePresence>

        {filteredTestimonials.length === 0 && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <p className="text-mulearn-gray-600 text-lg">
              No {filter === "all" ? "" : filter.replace("-", " ")} testimonials found.
            </p>
          </MotionDiv>
        )}
      </MotionDiv>
    </div>
  );
}
