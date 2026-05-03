import { notFound } from "next/navigation";
import { getGalleryEventBySlug } from "@/data/gallery";
import { EventMediaClient } from "../_components";

export default async function EventGalleryPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const resolvedParams = await params;
  const event = getGalleryEventBySlug(resolvedParams.eventSlug);
  if (!event) notFound();

  return <EventMediaClient event={event} />;
}
