import Link from "next/link";
import { Section } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { StateDisplay } from "@/components/ui/state-display";
import { EventMediaClient, getGalleryEventBySlug } from "@/features/gallery";
import { constructMetadata } from "@/lib/metadata";

const GALLERY_EVENT_KEYWORDS = [
  "mulearn gallery",
  "event photos",
  "campus event",
  "mulearn community event",
];

export async function generateMetadata({ params }: { params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params;
  const event = getGalleryEventBySlug(eventSlug);
  if (!event) return constructMetadata({ noIndex: true });
  return constructMetadata({
    title: event.name,
    description: event.description,
    image: event.coverImage,
    keywords: GALLERY_EVENT_KEYWORDS,
    canonical: `https://mulearn.org/gallery/${event.slug}`,
  });
}

export default async function EventGalleryPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const resolvedParams = await params;
  const event = getGalleryEventBySlug(resolvedParams.eventSlug);

  if (!event) {
    return (
      <Section className="min-h-screen">
        <StateDisplay
          variant="no-results"
          title="Event Not Found"
          description="We couldn't find the gallery event you're looking for. It may have been moved or no longer exists."
          size="md"
          action={
            <Button asChild variant="default">
              <Link href="/gallery">Go to Gallery</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  return <EventMediaClient event={event} />;
}
