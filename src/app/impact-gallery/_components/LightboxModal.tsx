"use client";

import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/components/MuFramer";
import { useEffect } from "react";
import { GalleryItem } from "@/lib/types";
import MuImage from "@/components/MuImage";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxModalProps {
  item: GalleryItem;
  onClose: () => void;
}

export default function LightboxModal({ item, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-mulearn-blackish bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <MotionDiv
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-mulearn-whitish rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden border border-mulearn-greyish"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant={"mulearn"}
            onClick={onClose}
            className="absolute top-1 right-2 rounded-full text-2xl p-2 transition-colors z-50"
          >
            <X className=""/>
          </Button>
          <div className="flex justify-between items-center p-6 border-b border-mulearn-greyish">
            <div>
              <h2 className="text-xl font-bold text-mulearn">
                {item.title}
              </h2>
              <p className="text-mulearn-gray-600 mt-1 ">{item.description}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="relative w-full h-[45vh] md:h-[65vh] rounded-lg mb-6">
              <MuImage
                src={item.image || ""}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 90vw,
           (max-width: 1200px) 70vw,
           60vw"
                className="object-contain"
              />
            </div>

            {item.stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {item.stats.participants && (
                  <div className="text-center p-4 bg-mulearn-whitish rounded-lg border border-mulearn-greyish">
                    <div
                      className="text-2xl font-bold mb-1 "
                      style={{
                        background: "bg-mulearn",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.stats.participants}+
                    </div>
                    <div className="text-sm text-mulearn-gray-600 ">
                      Participants
                    </div>
                  </div>
                )}
                {item.stats.campuses && (
                  <div className="text-center p-4 bg-mulearn-whitish rounded-lg border border-mulearn-greyish">
                    <div
                      className="text-2xl font-bold mb-1 "
                      style={{
                        background: "var(--mulearn-trusty)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.stats.campuses}+
                    </div>
                    <div className="text-sm text-mulearn-gray-600 ">
                      Campuses
                    </div>
                  </div>
                )}
                {item.stats.companies && (
                  <div className="text-center p-4 bg-mulearn-whitish rounded-lg border border-mulearn-greyish">
                    <div
                      className="text-2xl font-bold mb-1 "
                      style={{
                        background: "var(--mulearn-trusty)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.stats.companies}+
                    </div>
                    <div className="text-sm text-mulearn-gray-600 ">
                      Companies
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}
