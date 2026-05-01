# Gallery Image & Video Adding Guide

This guide explains how to add new Gallery events and media to mulearn.org.

## Source of Truth

All gallery content is managed in:
- `src/data/gallery.ts`

Do not read files dynamically from the filesystem or CMS for the Gallery feature.

## 1) Add Media Files

Create a folder per event under:
- `public/assets/gallery/<event_slug>/`

Example:
- `public/assets/gallery/bc2025/cover.webp`
- `public/assets/gallery/bc2025/photo1.webp`
- `public/assets/gallery/bc2025/photo2.webp`
- `public/assets/gallery/bc2025/highlight.mp4`
- `public/assets/gallery/bc2025/highlight-thumb.webp`

Recommended naming:
- Cover image: `cover.webp`
- Images: `photo1.webp`, `photo2.webp`, ...
- Video: `highlight.mp4` (or `.webm`)
- Video thumbnail: `highlight-thumb.webp`

Image format requirement:
- All gallery images must be `.webp` (cover, photos, and video thumbnails).

## 2) Add Event Entry in Data

Open `src/data/gallery.ts` and append a new event object in `galleryEvents`.

Use this shape:

```ts
{
  slug: "bc2025",
  name: "BuildersCamp 2025",
  date: "March 12, 2025",
  location: "Thiruvananthapuram, Kerala",
  coverImage: "/assets/gallery/bc2025/cover.webp",
  description: "Annual builders and makers showcase by µLearn.",
  media: [
    {
      type: "image",
      src: "/assets/gallery/bc2025/photo1.webp",
      alt: "BuildersCamp 2025 opening ceremony",
    },
    {
      type: "image",
      src: "/assets/gallery/bc2025/photo2.webp",
      alt: "Hackathon teams collaborating at BuildersCamp 2025",
    },
    {
      type: "video",
      src: "/assets/gallery/bc2025/highlight.mp4",
      thumbnail: "/assets/gallery/bc2025/highlight-thumb.webp",
      caption: "Event highlights",
    },
  ],
}
```

## 3) Field Rules

### Event fields
- `slug`: unique, URL-safe, and must match the folder name in `public/assets/gallery/`.
- `name`: event title shown in cards and event page.
- `date`: display string.
- `location`: display string.
- `coverImage`: must point to `/assets/gallery/<slug>/...`.
- `coverImage`: must use a `.webp` file under `/assets/gallery/<slug>/...`.
- `description`: optional.

### Media fields
- `type`: `"image"` or `"video"`.
- `src`: required.
  - Preferred: local path under `/assets/gallery/<slug>/...`.
  - Supported for videos: YouTube or Vimeo links (renderer handles both).
- `alt`: strongly recommended for images.
- `thumbnail`: recommended for video poster and should be `.webp`.
- `caption`: optional; shown under video or in lightbox.

## 4) Supported Video Sources

Current `VideoPlayer` supports:
- Native video files (`.mp4`, `.webm`) via `<video>`
- YouTube URLs (`youtube.com`, `youtu.be`)
- Vimeo URLs (`vimeo.com`)

If source is not YouTube/Vimeo, it is treated as a native video URL.

## 5) Quality Checklist

Before commit:
- Event appears in `/gallery`
- Clicking event opens `/gallery/<slug>`
- Image thumbnails open in lightbox
- Video plays correctly (native/embed)
- Each image has meaningful `alt`
- Paths are valid and load without 404

Then run:

```bash
bun run lint:fix
bun run typecheck
```

## 6) Common Mistakes

- Slug and folder mismatch (`slug: "launchpad2025"` but folder is `launch-pad-2025`)
- Wrong leading slash in paths (must be `/assets/...`, not `assets/...`)
- Missing `coverImage`
- Using `.jpg`/`.png` for gallery images instead of required `.webp`
- Image item added without `alt`
- Video added without `thumbnail` (not required, but recommended)

## 7) Minimal Example (Image-only Event)

```ts
{
  slug: "sample-event",
  name: "Sample Event",
  date: "April 19, 2026",
  location: "Kochi, Kerala",
  coverImage: "/assets/gallery/sample-event/cover.webp",
  media: [
    {
      type: "image",
      src: "/assets/gallery/sample-event/photo1.webp",
      alt: "Participants at Sample Event",
    },
  ],
}
```
