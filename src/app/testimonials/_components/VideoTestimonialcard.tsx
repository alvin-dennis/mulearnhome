import { YouTubeEmbed } from "@next/third-parties/google";
import { VideoTestimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial;
  isActive: boolean;
}

export default function VideoTestimonialCard({
  testimonial,
  isActive,
}: VideoTestimonialCardProps) {

  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-500 overflow-hidden",
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
      )}
    >
        <div className="relative bg-mulearn-whitish p-6">
          <div className="relative rounded-2xl bg-mulearn-gray-800">
            <YouTubeEmbed
              videoid={testimonial.videoUrl}
              style="border-none"
              playlabel="true"
              params="disablekb=1&enablejsapi=1&playsinline=1"
            />
          </div>
        </div>
      </div>
  );
}
