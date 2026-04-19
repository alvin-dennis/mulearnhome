import { notFound } from "next/navigation";
import { getGalleryEventBySlug } from "@/data/gallery";
import { EventMediaClient } from "../_components";

export default function EventGalleryPage({ params }: { params: { eventSlug: string } }) {
  const event = getGalleryEventBySlug(params.eventSlug);
  if (!event) notFound();

  return <EventMediaClient event={event} />;
}
