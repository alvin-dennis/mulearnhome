# Annual Reports Page

This page showcases µLearn's annual reports, demonstrating transparency and community accountability.

## Features

- **Hero Section**: Introduction to the purpose of annual reports with key values (transparency, community, growth, impact)
- **Report Cards**: Chronological display of annual reports with:
  - Year badges
  - Report summaries
  - Key highlights
  - Direct PDF download functionality
  - Responsive design for all devices

## Components

- `ReportHero.tsx`: Hero section with animated value cards
- `ReportCard.tsx`: Individual report display with download functionality
- `page.tsx`: Main page component with layout and data handling
- `layout.tsx`: Metadata and SEO configuration

## Data Structure

Reports are stored in `src/data/data.ts` as `annualReports` array with the following structure:

```typescript
interface AnnualReport {
  id: string;
  year: string;
  title: string;
  summary: string;
  pdfUrl: string;
  imageUrl?: string;
  highlights?: string[];
  publishedDate: string;
}
```

## Assets

Report assets are stored in `public/assets/report/`:
- PDF files: `{year}-annual-report.pdf`
- Cover images: `{year}-report-cover.jpg`

## Navigation

The report page is accessible via the main navigation under "About" > "ANNUAL REPORTS".

## Brand Compliance

- Uses µLearn's official color scheme (trusty blue, duke purple)
- Follows typography guidelines (Plus Jakarta Sans, Circe Rounded)
- Maintains consistent spacing and layout patterns
- Responsive design for mobile, tablet, and desktop
