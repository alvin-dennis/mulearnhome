"use client";

import { Instagram, Linkedin, MessageCircle, Star, Twitter, Users } from "lucide-react";
import { use } from "react";
import MuImage from "@/components/MuImage";
import type { TextTestimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { cdnUrl } from "@/services/cdn";
import { fetchProfileImage } from "@/services/profile";

interface TextTestimonialCardProps {
  testimonial: TextTestimonial;
}

export default function TextTestimonialCard({ testimonial }: TextTestimonialCardProps) {
  const profileImage = use(
    testimonial.muid ? fetchProfileImage(testimonial.muid) : Promise.resolve(null),
  );
  const fallbackImage = cdnUrl("public/assets/team/default.webp");

  const getSocialIcon = (socialProof?: string) => {
    if (!socialProof) return <MessageCircle className="w-4 h-4" />;
    if (socialProof.includes("LinkedIn")) return <Linkedin className="w-4 h-4" />;
    if (socialProof.includes("Instgram")) return <Instagram className="w-4 h-4" />;
    if (socialProof.includes("Twitter")) return <Twitter className="w-4 h-4" />;
    if (socialProof.includes("Community")) return <Users className="w-4 h-4" />;
    return <MessageCircle className="w-4 h-4" />;
  };

  const getTypeColor = (type: TextTestimonial["type"]) => {
    switch (type) {
      case "academia":
        return "bg-mulearn-trusty-blue text-mulearn-whitish";
      case "industry":
        return "bg-mulearn-duke-purple text-mulearn-whitish";
      case "government":
        return "bg-mulearn-gray-600 text-mulearn-whitish";
      case "civic-society":
        return "bg-mulearn-trusty-blue text-mulearn-whitish";
      default:
        return "bg-mulearn-gray-500 text-mulearn-whitish";
    }
  };

  const getTypeLabel = (type: TextTestimonial["type"]) => {
    switch (type) {
      case "academia":
        return "Academia";
      case "industry":
        return "Industry";
      case "government":
        return "Government";
      case "civic-society":
        return "Civic Society";
      default:
        return type;
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300",
          )}
        />
      ))}
    </div>
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-col bg-mulearn-whitish rounded-2xl border border-mulearn-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex-none">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-none">
              <MuImage
                src={profileImage ?? testimonial.profileImage ?? fallbackImage}
                alt={testimonial.name}
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
                unoptimized
              />
            </div>

            <div>
              <h3 className="font-semibold text-mulearn-blackish">{testimonial.name}</h3>
              <p className="text-sm text-mulearn-gray-600">
                {testimonial.role}
                {testimonial.company && ` • ${testimonial.company}`}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex-none",
              getTypeColor(testimonial.type),
            )}
          >
            {getTypeLabel(testimonial.type)}
          </div>
        </div>

        <blockquote className="mb-4">
          <p className="text-mulearn-gray-600 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
        </blockquote>
      </div>

      <div className="flex-none mt-auto pt-4 border-t border-mulearn-gray-100">
        <div className="flex items-center justify-between">
          <StarRating rating={testimonial.rating} />

          <div className="flex items-center gap-2 text-sm text-mulearn-gray-600">
            {testimonial.socialProof && (
              <>
                {getSocialIcon(testimonial.socialProof)}
                <span>{testimonial.socialProof}</span>
              </>
            )}
            <span>{formatDate(testimonial.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
