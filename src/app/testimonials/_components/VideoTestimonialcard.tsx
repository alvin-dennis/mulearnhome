import { YouTubeEmbed } from "@next/third-parties/google";
import type { VideoTestimonial } from "@/lib/types";

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial;
}

export default function VideoTestimonialCard({ testimonial }: VideoTestimonialCardProps) {
  return (
    <div className="relative w-full inset-0 h-full overflow-hidden mb-10">
      <YouTubeEmbed
        videoid={testimonial.videoUrl}
        playlabel="true"
        style="border: none"
        params="rel=0&modestbranding=1&playsinline=1"
      />
    </div>
  );
}
