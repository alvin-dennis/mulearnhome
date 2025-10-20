"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import GalleryGrid from "./_components/GalleryGrid";
import FilterButtons from "./_components/FilterButtons";
import ImpactStats from "./_components/ImpactStats";
import { GalleryItem } from "@/data/data";
import LightboxModal from "./_components/LightboxModal";

export default function ImpactGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-mulearn-whitish to-white">
      {/* Hero Section */}
      <section 
  className="relative py-20"
  style={{ background: "var(--mulearn-trusty)" }}
>
  <div className="container mx-auto px-4 text-center">
    <motion.h1 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-6xl font-bold mb-6 text-white font-display"
    >
      μLearn Impact Gallery
    </motion.h1>
    <motion.p 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white/90 font-sans"
>
  Showcasing our journey, milestones, and the incredible impact we&apos;ve created together
</motion.p>

  </div>
</section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-mulearn-blackish mb-4">
              Our Impact in Action
            </h2>
            <p className="text-mulearn-gray-600 text-lg max-w-2xl mx-auto">
              Explore the stories, events, and milestones that define our community's journey
            </p>
          </div>

          {/* Filter Buttons */}
          <FilterButtons 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Gallery Grid */}
          <GalleryGrid 
            activeFilter={activeFilter}
            onItemClick={setSelectedItem}
          />

          {/* Lightbox Modal */}
          {selectedItem && (
            <LightboxModal 
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </div>
      </section>
    </div>
  );
}