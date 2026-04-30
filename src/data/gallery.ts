export interface GalleryMediaItem {
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
}

export interface GalleryEvent {
  slug: string;
  name: string;
  date: string;
  location: string;
  coverImage: string;
  description?: string;
  media: GalleryMediaItem[];
}

export const galleryEvents: GalleryEvent[] = [
  {
    slug: "bc2025",
    name: "BuildersCamp 2025",
    date: "March 12, 2025",
    location: "Thiruvananthapuram, Kerala",
    coverImage: "/assets/gallery/bc2025/cover.jpg",
    description: "Annual builders and makers showcase by µLearn.",
    media: [
      {
        type: "image",
        src: "/assets/gallery/bc2025/photo1.jpg",
        alt: "BuildersCamp 2025 opening ceremony",
      },
      {
        type: "image",
        src: "/assets/gallery/bc2025/photo2.jpg",
        alt: "Hackathon teams collaborating at BuildersCamp 2025",
      },
      {
        type: "video",
        src: "/assets/gallery/bc2025/highlight.mp4",
        thumbnail: "/assets/gallery/bc2025/highlight-thumb.jpg",
        caption: "Event highlights",
      },
    ],
  },
  // Add more events here following the same shape
];

export function getGalleryEventBySlug(slug: string): GalleryEvent | undefined {
  return galleryEvents.find((e) => e.slug === slug);
}

export function getGalleryEventSlugs(): string[] {
  return galleryEvents.map((e) => e.slug);
}
