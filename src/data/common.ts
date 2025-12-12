import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export const navItems = [
  {
    label: "About",
    submenu: {
      "KEY PAGES": [
        { label: "MANIFESTO", href: "/manifesto" },
        { label: "TEAM", href: "/team" },
        {
          label: "IMPACT GALLERY",
          href: "/impact-gallery",
        },
        { label: "LEADERBOARD", href: "/leaderboard" },
        { label: "OUR PARTNERS", href: "/partners" },
        { label: "EVENTS", href: "/events" },
      ],
      Programs: [
        { label: "LAUNCHPAD", href: "https://launchpadkerala.org/" },
        { label: "PERMUTE", href: "https://permute.mulearn.org/" },
        { label: "TOP100SERIES", href: "https://top100series.com/" },
        { label: "ART OF TEACHING", href: "/artofteaching" },
        { label: "IN50HOURS", href: "/in50hours" },
        { label: "KKEM", href: "/kkem" },
      ],
      OTHERS: [
        {
          label: "MuBook",
          href: "https://mulearn.org/r/mubook",
        },
        {
          label: "CAREER LABS",
          href: "/careers",
        },
        {
          label: "CONTACT US",
          href: "/contact",
        },
        {
          label: "TESTIMONIALS",
          href: "/testimonials",
        },
        // { label: "ANNUAL REPORTS",
        //   href: "/reports"
        // },
      ],
    },
  },
  {
    label: "Why μLearn?",
    href: "https://youtu.be/ehdSEL_s050",
    submenu: null,
  },
  {
    label: "Be A Part of Us",
    submenu: {
      "Join Us": [
        { label: "Company", href: "/be-a-part/company" },
        { label: "Campus", href: "/be-a-part/campus" },
        { label: "Enabler", href: "/be-a-part/enablers" },
        { label: "Learners", href: "/be-a-part/learners" },
        { label: "Campus Logo Generator", href: "/campus-logo-generator" },
      ],
      Partners: [
        { label: "COMMUNITY PARTNERS", href: "/partners/community-partners" },
        { label: "COMPANY PARTNERS", href: "/partners/company-partners" },
      ],
    },
  },
  {
    label: "Mentorship",
    href: "https://app.mulearn.org/dashboard/search?activetab=mentors",
    submenu: null,
  },
  {
    label: "Learning",
    href: "/learning-circle",
    submenu: {
      Explore: [
        {
          label: "Level Structure",
          href: "/levelstructure",
        },
        {
          label: "Interest Groups",
          href: "/interest-groups",
        },
        {
          label: "Learning Circle",
          href: "/learning-circle",
        },
        {
          label: "Learning Paths",
          href: "https://app.mulearn.org/dashboard/mujourney",
        },
      ],
    },
  },
  {
    label: "Donate",
    href: "/donate",
    submenu: null,
  },
];

export const footer = [
  {
    title: "Quick Links",
    links: [
      { title: "Blog", url: "https://gtechmulearn.medium.com/" },
      { title: "Team", url: "/team" },
      { title: "Career Labs", url: "/careers" },
      { title: "Interest Groups", url: "/interest-groups" },
      { title: "Contact Us", url: "/contact" },
      { title: "Donate", url: "/donate" },
    ],
  },
  {
    title: "Be Part of Us",
    links: [
      { title: "Campus", url: "be-a-part/campus" },
      { title: "Companies", url: "be-a-part/company" },
      {
        title: "Students",
        url: "/be-a-part/learners",
      },
      {
        title: "Mentors",
        url: "https://app.mulearn.org/dashboard/search?activetab=mentors",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms and Conditions", url: "/termsandconditions" },
      { title: "Privacy Policy", url: "/privacypolicy" },
      { title: "Refund Policy", url: "/refundpolicy" },
      { title: "Annual Reports", url: "/report" },
    ],
  },
];

export const socials = [
  {
    icon: FaLinkedin,
    url: "https://linkedin.com/company/gtechmulearn/",
    label: "LinkedIn",
  },
  {
    icon: FaInstagram,
    url: "https://instagram.com/mulearn.official/",
    label: "Instagram",
  },
  {
    icon: FaYoutube,
    url: "https://youtube.com/c/mulearn",
    label: "YouTube",
  },
  {
    icon: FaFacebook,
    url: "http://facebook.com/gtechmulearn",
    label: "Facebook",
  },
];

export const contactInfo = {
  copyright: "μLearn Foundation | Copyright © 2025 All rights reserved.",
  address: "Technopark Phase 1, Thiruvananthapuram, Kerala - 695581",
  email: "info@mulearn.org",
  phone: "+91 89436 47000",
  website: "www.mulearn.org",
};

export const contactPage = {
  hero: {
    badge: "Connect With Us",
    title: {
      line1: "Let's Build",
      line2: "Together",
    },
    description:
      "Join our growing community of learners, innovators, and partners. Whether you're starting your journey or looking to collaborate, we're here to support your growth every step of the way.",
    stats: [
      { value: "60K+", label: "Learners" },
      { value: "400+", label: "Partners" },
      { value: "48h", label: "Response" },
    ],
  },
  getInTouch: {
    title: "Get in Touch",
    description:
      "Have questions or feedback? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.",
  },
};
