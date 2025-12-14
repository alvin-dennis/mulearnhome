import { YouTubeEmbed } from "@next/third-parties/google";
import { Card, CardContent } from "@/components/ui/card";
import type { VideoTestimonial } from "@/lib/types";

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial;
}

export default function VideoTestimonialCard({ testimonial }: VideoTestimonialCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="w-full h-full aspect-video">
          <YouTubeEmbed
            videoid={testimonial.videoUrl}
            style="border-none"
            playlabel="true"
            params="disablekb=1&enablejsapi=1&playsinline=1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
