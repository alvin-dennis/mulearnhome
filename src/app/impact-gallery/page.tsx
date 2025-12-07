"use client";

import { useState } from "react";
import { MotionH1, MotionP } from "@/components/MuFramer";
import type { GalleryItem } from "@/lib/types";
import FilterButtons from "./_components/FilterButtons";
import GalleryGrid from "./_components/GalleryGrid";
import ImpactStats from "./_components/ImpactStats";
import LightboxModal from "./_components/LightboxModal";

export default function ImpactGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 bg-mulearn">
        <div className="container mx-auto px-4 text-center">
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-mulearn-whitish "
          >
            μLearn Impact Gallery
          </MotionH1>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-mulearn-whitish/90 "
          >
            Showcasing our journey, milestones, and the incredible impact we&apos;ve created
            together
          </MotionP>
        </div>
      </section>
      <ImpactStats />
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-mulearn mb-4">Our Impact in Action</h2>
            <p className="text-mulearn-gray-600 text-lg max-w-2xl mx-auto">
              Explore the stories, events, and milestones that define our community&apos;s journey
            </p>
          </div>
          <FilterButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <GalleryGrid activeFilter={activeFilter} onItemClick={setSelectedItem} />
          {selectedItem && (
            <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
          )}
        </div>
      </section>
    </div>
  );
}
