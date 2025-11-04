import {
  GalleryItem,
  ImpactStat,
  AnnualReport,
} from "@/lib/types";

export const galleryData: GalleryItem[] = [
  {
    id: "1",
    title: "Launchpad 2024",
    description:
      "Our biggest hiring fest with 5000+ participants from 200+ campuses",
    image: "/images/impact/launchpad-2024.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 5000,
      campuses: 200,
    },
  },
  {
    id: "2",
    title: "Top 100 Coders",
    description: "Celebrating the brightest minds from our coding community",
    image: "/images/impact/top-100-coders.jpg",
    category: "students",
    type: "image",
    stats: {
      participants: 100,
    },
  },
  {
    id: "3",
    title: "Company Partnership Summit",
    description:
      "Connecting students with top tech companies for career opportunities",
    image: "/images/impact/company-summit.jpg",
    category: "companies",
    type: "image",
    stats: {
      companies: 50,
    },
  },
  {
    id: "4",
    title: "Mentor Meetup",
    description:
      "Our dedicated mentors guiding the next generation of innovators",
    image: "/images/impact/mentor-meetup.jpg",
    category: "mentors",
    type: "image",
  },
  {
    id: "5",
    title: "Success Story: From Student to Developer",
    description: "How μLearn helped Sarah land her dream job at Google",
    image: "/images/impact/success-story-1.jpg",
    category: "impact-stories",
    type: "image",
  },
  {
    id: "6",
    title: "Permute Hackathon",
    description: "48 hours of innovation and problem-solving with 300+ teams",
    image: "/images/impact/permute-hackathon.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 1200,
    },
  },
  {
    id: "7",
    title: "Campus Community Growth",
    description: "Our expanding network of campus ambassadors and clubs",
    image: "/images/impact/campus-growth.jpg",
    category: "students",
    type: "image",
    stats: {
      campuses: 150,
    },
  },
  {
    id: "8",
    title: "Industry Collaboration",
    description:
      "Working with industry leaders to shape future-ready curriculum",
    image: "/images/impact/industry-collab.jpg",
    category: "companies",
    type: "image",
  },
  {
    id: "9",
    title: "Mentor Training Program",
    description: "Empowering experienced professionals to guide young talents",
    image: "/images/impact/mentor-training.jpg",
    category: "mentors",
    type: "image",
  },
  {
    id: "10",
    title: "Rural Tech Revolution",
    description: "Bringing digital literacy to rural communities across Kerala",
    image: "/images/impact/rural-tech.jpg",
    category: "impact-stories",
    type: "image",
  },
  {
    id: "11",
    title: "Women in Tech Conference",
    description: "Celebrating and empowering women in technology",
    image: "/images/impact/women-in-tech.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 800,
    },
  },
  {
    id: "12",
    title: "Student Innovation Showcase",
    description:
      "Showcasing groundbreaking projects from our student community",
    image: "/images/impact/innovation-showcase.jpg",
    category: "students",
    type: "image",
  },
];

export const galleryCategories = [
  { id: "all", label: "All", count: galleryData.length },
  {
    id: "events",
    label: "Events",
    count: galleryData.filter((item) => item.category === "events").length,
  },
  {
    id: "students",
    label: "Students",
    count: galleryData.filter((item) => item.category === "students").length,
  },
  {
    id: "companies",
    label: "Companies",
    count: galleryData.filter((item) => item.category === "companies").length,
  },
  {
    id: "mentors",
    label: "Mentors",
    count: galleryData.filter((item) => item.category === "mentors").length,
  },
  {
    id: "impact-stories",
    label: "Impact Stories",
    count: galleryData.filter((item) => item.category === "impact-stories")
      .length,
  },
];

export const impactStats: ImpactStat[] = [
  { number: "59,000+", label: "Learners", icon: "Users" },
  { number: "1,900+", label: "Institutions", icon: "School" },
  { number: "500+", label: "Events Hosted", icon: "Calendar" },
  { number: "50+", label: "Company Partners", icon: "Handshake" },
  { number: "1,000+", label: "Mentors", icon: "GraduationCap" },
  { number: "100+", label: "Success Stories", icon: "TrendingUp" },
];

export const annualReports: AnnualReport[] = [
  {
    id: "2024",
    year: "2024",
    title: "2024 Annual Report",
    summary:
      "A year of unprecedented growth and community impact. We expanded to 1,900+ institutions, hosted 500+ events, and empowered 59,000+ learners across India.",
    pdfUrl: "/assets/report/2024-annual-report.pdf",
    imageUrl: "/assets/report/2024-report-cover.jpg",
    highlights: [
      "59,000+ active learners across India",
      "1,900+ educational institutions partnered",
      "500+ events and workshops conducted",
      "50+ company partnerships established",
      "1,000+ mentors actively engaged",
    ],
    publishedDate: "2025-01-15",
  },
  {
    id: "2023",
    year: "2023",
    title: "2023 Annual Report",
    summary:
      "Building the foundation for peer-led learning. We established our core programs, launched key partnerships, and created the framework for sustainable community growth.",
    pdfUrl: "/assets/report/2023-annual-report.pdf",
    imageUrl: "/assets/report/2023-report-cover.jpg",
    highlights: [
      "25,000+ learners onboarded",
      "500+ institutions joined our network",
      "200+ events organized",
      "20+ strategic partnerships formed",
      "500+ mentors recruited",
    ],
    publishedDate: "2024-01-10",
  },
  {
    id: "2022",
    year: "2022",
    title: "2022 Annual Report",
    summary:
      "The year we began our journey. From a small community of passionate learners to establishing µLearn as a recognized platform for peer-led education.",
    pdfUrl: "/assets/report/2022-annual-report.pdf",
    imageUrl: "/assets/report/2022-report-cover.jpg",
    highlights: [
      "10,000+ early adopters",
      "100+ institutions piloted our programs",
      "50+ initial events conducted",
      "10+ founding partnerships",
      "100+ pioneer mentors",
    ],
    publishedDate: "2023-01-05",
  },
];
