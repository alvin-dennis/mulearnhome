
import { cdnUrl } from "@/services/cdn";
import { FaLinkedin, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

export interface SubItem {
  label: string;
  href: string;
}

export interface Role {
  id: string;
  label: string;
}

export interface RoleItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface RolesContent {
  [key: string]: RoleItem[];
}

export interface Event {
  title: string;
  description: string;
  link?: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "events" | "students" | "companies" | "mentors" | "impact-stories";
  type: "image" | "video";
  stats?: {
    participants?: number;
    campuses?: number;
    companies?: number;
  };
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: string; // We'll use string names since we can't import React components here
}

export const navItems = [
  {
    label: "About",
    submenu: {
      "KEY PAGES": [
        { label: "MANIFESTO", href: "/manifesto" },
        { label: "TEAM", href: "/team" },
        { label: "ENABLERS", href: "/enablers" },
      ],
      Partners: [
        { label: "COMMUNITY PARTNERS", href: "/community-partners" },
        { label: "COMPANY PARTNERS", href: "/company-partners" },
      ],
      EVENTS: [
        { label: "GLOBAL CALENDAR", href: "/events/calendar" },
        // { label: "ANNOUNCEMENTS", href: "/events/announcements" },
        { label: "ALL EVENTS", href: "/events" },
      ],
      Programs: [
        { label: "LAUNCHPAD", href: "https://launchpadkerala.org/" },
        { label: "PERMUTE", href: "https://permute.mulearn.org/" },
        { label: "TOP100SERIES", href: "https://top100coders.com/" },
        { label: "ART OF TEACHING", href: "/artofteaching" },
        { label: "IN50HOURS", href: "/in50hours" },
      ],
      OTHERS: [
        {
          label: "MuBook",
          href: "https://mulearn.org/r/mubook",
        },
        {
          label: "NEWSLETTER",
          href: "https://online.fliphtml5.com/slydm/yljq/",
        },
        {
          label: "IMPACT GALLERY",
          href: "/impact-gallery",
        },
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
        { label: "Campus Logo Generator", href: "/campus-logo-generator" },
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
    href: "https://app.mulearn.org/dashboard/learningcircle",
    submenu: {
      Explore: [
        {
          label: "Interest Groups",
          href: "https://app.mulearn.org/dashboard/interestgroups",
        },
        {
          label: "Learning Circle",
          href: "https://app.mulearn.org/dashboard/learningcircle",
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

export const features = [
  {
    title: "Community",
    description: "Join 60,000+ learners & innovators.",
    image: cdnUrl(
      "public/assets/landing/College Project Concept Illustration.png"
    ),
    bgColor: "#9bc8ff",
  },
  {
    title: "Mentors",
    description: "Learn from those ahead of you, mentor those behind you.",
    image: cdnUrl("public/assets/landing/searching.png"),
    bgColor: "#ffb0a1",
  },
  {
    title: "Interest Groups",
    description: "Connect with like-minded people who share your interests",
    image: cdnUrl(
      "public/assets/landing/Content Team Concept Illustration.png"
    ),
    bgColor: "#5ce5c9",
  },
  {
    title: "Roadmaps",
    description: "Structured learning paths for skill mastery.",
    image: cdnUrl("public/assets/landing/Roadmap.png"),
    bgColor: "#ffe399",
  },
  {
    title: "Challenges",
    description: "Engage in real-world problem-solving.",
    image: cdnUrl("public/assets/landing/collab.png"),
    bgColor: "#b594ff",
  },
  {
    title: "Opportunities",
    description: "Discover Gigs, Jobs, and best opportunities around you",
    image: "https://www.propeers.in/images/cuate.svg",
    bgColor: "#55bfe9",
  },
];

export const specialevents = [
  {
    id: 1,
    title: "Top 100 Coders",
    description:
      "Welcome to the Top 100 Coders initiative Recognised by Kerala Govt. We're on a mission to recognize and empower the best coders in India. If you're passionate about coding and want to make a significant impact in the tech community, you're in the right place.",
    // date: "2025-04-09",
    // participants: 100,
    link: "https://top100coders.com/",
    image: cdnUrl("src/modules/Public/Home/assets/top-100.webp"),
    isLive: true,
  },
  {
    id: 2,
    title: "Launchpad",
    description:
      "Launchpad Kerala 2024 is a premier job fair that brings together talented individuals and innovative companies in the technical and engineering fields.",
    // date: "2024-06-02",
    // participants: 200,
    link: "https://launchpad.mulearn.org/",
    image: cdnUrl("src/modules/Public/Home/assets/launchpad.webp"),
    isLive: false,
  },
  {
    id: 3,
    title: "Trivial Ideas",
    description:
      "Have an idea that's out-of-the-box crazy? This is your chance to turn it into a real product! ",
    recurrence: "Monthly",
    // date: "2025-02-02",
    // participants: 500,
    link: "https://www.instagram.com/mulearn.official/p/C6eHEzJyMMn/",
    image: cdnUrl("src/modules/Public/Home/assets/trivialideas.webp"),
    isLive: false,
  },
];

export const communityPartners = [
  {
    name: "ASAP",
    image: "src/modules/Public/CommPartners/assets/partners/asap.webp",
    link: "https://asapkerala.gov.in/",
  },

  {
    name: "Kerala Startup Mission",
    image: "src/modules/Public/CommPartners/assets/partners/ksum.webp",
    link: "https://startupmission.kerala.gov.in/",
    // customlink: "/community-partners/iedc",
    customlink: "",
  },

  {
    name: "Blockchain",
    image: "src/modules/Public/CommPartners/assets/partners/blockchain.webp",
    link: "https://kba.ai/",
    customlink: "",
  },

  {
    name: "Foxlabs",
    image: "src/modules/Public/CommPartners/assets/partners/foxlab.webp",
    link: "https://mulearn.org/community-partners/foxlab",
    // customlink: "/community-partners/foxlab",
  },
  {
    name: "Institute of Electrical and Electronics Engineers",
    image: "src/modules/Public/CommPartners/assets/partners/ieee.webp",
    link: "https://www.ieee.org/",
    customlink: "",
  },
  {
    name: "Kites Foundation",
    image: "src/modules/Public/CommPartners/assets/partners/kites.webp",
    link: "https://kitesfoundation.org/",
    customlink: "",
  },
  {
    name: "Pygrammers",
    image: "src/modules/Public/CommPartners/assets/partners/pygrammers.webp",
    link: "https://pygrammers.org/",
    customlink: "",
  },
  {
    name: "XtrudAR",
    image: "src/modules/Public/CommPartners/assets/partners/xtrudar.webp",
    link: "https://xtrudar.riglabs.co/",
    customlink: "",
  },
  {
    name: "Kerala Development and Innovation Strategic Council",
    image: "src/modules/Public/CommPartners/assets/partners/kdisc.webp",
    link: "https://kdisc.kerala.gov.in/",
  },
  {
    name: "Ether India",
    image: "src/modules/Public/CommPartners/assets/partners/ether_logo.webp",
    link: "https://etherindia.org/",
  },
  {
    name: "Kuttycoders",
    image: "src/modules/Public/CommPartners/assets/partners/kuttycoders.webp",
    link: "https://kuttycoders.in/",
  },
  {
    name: "Google Educators",
    image: "src/modules/Public/CommPartners/assets/partners/google_android.webp",
    link: "https://developer.android.com/teach",
  },
  {
    name: "Google Developer Students Club",
    image: "src/modules/Public/CommPartners/assets/partners/gdsc.webp",
    link: "https://gdg.community-partners.dev/",
  },
  {
    name: "ICFOSS",
    image: "src/modules/Public/CommPartners/assets/partners/icfoss.webp",
    link: "https://icfoss.in/",
  },
];

export const opportunities = [
  {
    id: 1,
    name: "Job",
    icon: "https://www.propeers.in/images/rafiki.svg",
  },
  {
    id: 2,
    name: "Freelance",
    icon: "https://www.propeers.in/images/Mentors-cuate.svg",
  },
  {
    id: 3,
    name: "Research",
    icon: "https://www.propeers.in/images/cuate.svg",
  },
  {
    id: 4,
    name: "Entrepreneurship",
    icon: cdnUrl(
      "public/assets/landing/College Project Concept Illustration.png"
    ),
  },
  {
    id: 5,
    name: "Social Cause",
    icon: cdnUrl("public/assets/landing/social-growth.webp"),
  },
];

export const rolesTitle: Role[] = [
  { id: "partner", label: "Partner" },
  { id: "learner", label: "Learner" },
  { id: "community", label: "Community" },
  // { id: 'enabler', label: 'Enabler' }
];

export const rolesContent: RolesContent = {
  partner: [
    {
      id: 1,
      name: "Leverage Resources & Expertise",
      description:
        "Share your tools, platforms, and industry expertise at no cost while accessing a highly skilled, pre-trained talent pool. Minimize onboarding time, streamline workflow integration, and scale projects efficiently through seamless collaboration.",
      image: cdnUrl("public/assets/landing/expertise.webp"),
    },
    {
      id: 2,
      name: "Product Introduction",
      description:
        "Launch your products directly to a community of tech-savvy developers and early adopters. Boost brand awareness, accelerate product adoption, and gather real-time user insights for continuous improvement.",
      image: cdnUrl("public/assets/landing/product introduction.webp"),
    },
    {
      id: 3,
      name: "Talent Acquisition",
      description:
        "Hire top-tier, job-ready developers with proven skills, reducing training costs and expediting project execution. Gain access to a dynamic talent pipeline that meets industry demands and ensures faster onboarding.",
      image: cdnUrl("public/assets/landing/talent.webp"),
    },
    {
      id: 4,
      name: "Brand Presence",
      description:
        "Elevate your brand reputation by engaging with a vibrant learning ecosystem. Build lasting relationships with future industry leaders while positioning your company as an innovator in the tech community.",
      image: cdnUrl("public/assets/landing/brand.webp"),
    },
  ],
  learner: [
    {
      id: 1,
      name: "Skill Development",
      description:
        "Gain practical experience through hands-on projects and industry-relevant training. Build a strong technical foundation with real-world applications that enhance your expertise.",
      image: cdnUrl("public/assets/roles_images/skill-development.svg"),
    },
    {
      id: 2,
      name: "Career Growth & Job Opportunities",
      description:
        "Connect with top companies, land internships, and explore high-impact job opportunities. Get noticed by hiring partners actively seeking fresh, skilled talent.",
      image: cdnUrl("public/assets/roles_images/career-growth.svg"),
    },
    {
      id: 3,
      name: "Collaborative Learning Experience",
      description:
        "Learn alongside peers and industry experts in an interactive, knowledge-sharing environment. Develop critical problem-solving skills while staying ahead with the latest tech trends.",
      image: cdnUrl("public/assets/roles_images/learning.svg"),
    },
    {
      id: 4,
      name: "Recognized Certifications & Skill Validation",
      description:
        "Earn industry-recognized certifications and verifiable credentials that enhance your professional profile. Stand out in a competitive job market with proof of your expertise.",
      image: cdnUrl("public/assets/roles_images/certifications.svg"),
    },
  ],
  community: [
    {
      id: 1,
      name: "Expand Your Network & Build Connections",
      description:
        "Engage with a vibrant community of like-minded individuals and industry professionals. Grow your network, discover collaboration opportunities, and build lasting relationships that drive career success.",
      image: cdnUrl("public/assets/roles_images/networking.svg"),
    },
    {
      id: 2,
      name: "Knowledge Sharing & Industry Insights",
      description:
        "Exchange ideas, best practices, and innovative solutions with experts and peers. Stay updated on the latest trends, emerging technologies, and industry advancements.",
      image: cdnUrl("public/assets/roles_images/knowledgesharing.svg"),
    },
    {
      id: 3,
      name: "Collaborative Projects & Real-World Impact",
      description:
        "Join forces with community members to work on impactful projects that shape the tech ecosystem. Gain hands-on experience, enhance problem-solving skills, and contribute to meaningful innovations.",
      image: cdnUrl("public/assets/roles_images/collaboration.svg"),
    },
    {
      id: 4,
      name: "Mentorship & Career Guidance",
      description:
        "Access mentorship from industry leaders while also giving back by guiding others. Gain valuable insights, career advice, and professional support to accelerate personal and professional growth.",
      image: cdnUrl("public/assets/roles_images/mentorship.svg"),
    },
  ],
  enabler: [
    {
      id: 1,
      name: "Resource Provision",
      description:
        "Facilitate access to cutting-edge tools and technologies, empowering learners with the resources they need to succeed.",
      image:
        "https://img.freepik.com/free-vector/digital-transformation_23-2148804417.jpg",
    },
    {
      id: 2,
      name: "Skill Bridging",
      description:
        "Bridge the gap between academic learning and industry demands by providing practical, hands-on training modules.",
      image:
        "https://img.freepik.com/free-vector/technology-innovation_23-2148812878.jpg",
    },
    {
      id: 3,
      name: "Innovative Platforms",
      description:
        "Deploy innovative platforms that support creative learning, foster collaboration, and drive digital transformation.",
      image:
        "https://img.freepik.com/free-vector/businessman-using-digital-tablet_74855-6340.jpg",
    },
    {
      id: 4,
      name: "Community Support",
      description:
        "Invest in a thriving ecosystem by supporting initiatives that benefit all members of the learning community.",
      image:
        "https://img.freepik.com/free-vector/customer-support-concept-illustration_114360-5090.jpg",
    },
  ],
};

export const comparisons = [
  {
    problem: "Fragmented Resources",
    solution: "Structured Roadmaps",
    highlight: "Roadmaps",
  },
  {
    problem: "Lack Of Right Advice",
    solution: "Mentorship from industry veterans",
    highlight: "Mentorship",
  },
  {
    problem: "Lack of Access to Opportunities",
    solution: "Opportunities from the best in every industry",
    highlight: "Opportunities",
  },
  {
    problem: "Limited Exposure",
    solution: "Exposure to global leaders and thinkers",
    highlight: "Exposure",
  },
  {
    problem: "Lack of motivation to learn",
    solution: "Gamified platform working based on Karma points",
    highlight: "Gamified",
  },
];

export const footer = [
  {
    title: "Quick Links",
    links: [
      { title: "Blog", url: "https://gtechmulearn.medium.com/" },
      { title: "Team", url: "/team" },
      { title: "Career Labs", url: "https://mulearn.org/careers" },
      {
        title: "Interest Groups",
        url: "https://app.mulearn.org/dashboard/interestgroups",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Terms and Conditions", url: "/termsandconditions" },
      { title: "Privacy Policy", url: "/privacypolicy" },
    ],
  },

  {
  title: "Be Part of Us",
  links: [
    { title: "Campus", url: "be-a-part/campus" },
    { title: "Companies", url: "be-a-part/company" },
    { title: "Students", url: "/students" },
    { title: "Mentors", url: "/mentors" }
  ]
},
];

export const socials = [
  {
    icon: FaLinkedin,
    url: "http://www.linkedin.com/company/gtechmulearn/",
    label: "LinkedIn",
  },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com/mulearn.official/",
    label: "Instagram",
  },
  {
    icon: FaYoutube,
    url: "https://www.youtube.com/c/mulearn",
    label: "YouTube",
  },
  {
    icon: FaFacebook,
    url: "http://www.facebook.com/gtechmulearn",
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

export const privacyPolicy = {
  title: "PRIVACY POLICY",
  lastUpdated: "September 2025",
  introduction: `This Policy is issued by µLearn, which includes its parent, subsidiaries and affiliates (together, "µLearn", or <strong>"We"</strong> or <strong>"us"</strong> or <strong>"our(s)"</strong>) and is addressed to individuals outside our organisation with whom we interact, including but not limited to customers, visitors to our websites, offices and other users (together, <strong>"You"</strong>) of our Services. By registering to µLearn platform, you are implicitly consenting to have your profile registered for e-learning, reporting purposes and helping µLearn improve the research quality.

You are hereby agreed that the data you are freely deciding to share is intended to keep your profile up to date and complete. This data will be processed in order to manage our e-learning process and offer you more visibility and accessibility to opportunities which will match with your profile.

You agree that while creating a profile, it implies a transfer of your profile data to µLearn entities located across Kerala. The protection of your data is assured by our internal Information Security, and is processed with your consent and for the legitimate interest of µLearn Group.`,
  sections: [
    {
      heading: "Use of Information",
      content:
        "We use your information to provide, analyse, administer, enhance and personalize our Services and marketing efforts, to process your registration, and to communicate with you on these and other topics.",
      subsections: [
        "We use your information in order to resolve disputes; troubleshoot problems; help promote safe matching; measure consumer interest in Services; inform you about Offers, Products, Services, and Updates; customize your experience; detect and protect us against error, fraud and other criminal activity; enforce our Terms of Services (TOS); and as otherwise described to you at the time of registration. We may compare and review your Information for errors, omissions and for accuracy.",
        "We use your e-mail to send you system e-mails about the functionality of our Website.",
        "We use your e-mail associated with your account in order to send you newsletters and promotions in conjunction with your use of our Services.",
        "We may use your Information in order to provide benchmark analysis and aggregate statistics. This particular Information will be anonymized, will not contain personal identification and will not be transferred or sold to third parties in any way or format that identifies you.",
        "We use Website navigation data to operate and improve our Website. We may also use Website navigation data alone or in combination with your Information to provide aggregated information about µLearn.",
        "We collect the IP Addresses to track when you use our Website. We use IP Addresses to monitor the regions from which you navigate our Website and sign-up to use our Services. Your IP Address is also registered for statistical purposes and to better our advertising and layout of the Website.",
        "We do not transfer, sell or rent your Information to third parties for their marketing purposes other than what is stated in this Privacy Policy. We request only the information that we need to operate our Services and improve our Website's user experience. We do not use your Information to create any advertising creative.",
      ],
    },
    {
      heading: "Protection of Information",
      content:
        "We use reasonable administrative, logical, physical and managerial measures to safeguard your personal information against loss, theft and unauthorised access, use and modification. These measures are designed to provide a level of security appropriate to the risks of processing your personal information.",
      subsections: [
        "All our employees, independent contractors and agents have executed non-disclosure agreements, which provide explicit confidentiality protections.",
        "We do not make any of your Information available to third parties for their marketing purposes. µLearn's software may runs on individual servers and no data given or collected is shared with other social media platforms.",
        "We use robust security measures to protect data from unauthorized access, maintain data accuracy, and help ensure the appropriate use of data. When the Services are accessed using the internet, Secure Socket Layer (SSL) technology protects your Information, using both server authentication and data encryption. These technologies help ensure that your Information is safe, secure, and only available to you and to whom you have granted access.",
        "µLearn does its utmost to secure communications and data storage in order to protect confidentiality of your Information against loss and interception by third parties. However, it is important to know that there is no zero-risk element against loss or interception by others of your Information.",
      ],
    },
    {
      heading: "Storage of Information",
      content: `We save your Information in our database in order to improve our Website and user experience and in accordance with our TOS. If you wish that your Information be permanently deleted from our database when you stop using our Services, please notify us at mulearnadmin@gtechindia.org

µLearn is an Indian company. If you are located outside India and choose to provide information to us, µLearn transfers your Information to our servers in India. India may not have the same data protection laws as the country in which you initially provided the Information. Therefore while we transfer your Information to India, we will protect it as described in this Privacy Policy.

By visiting our Website or providing µLearn with your Information, you fully understand and unambiguously consent to this transfer, processing and storage of your Information in India.`,
      subsections: [],
    },
    {
      heading: "Data Retention",
      content:
        "We retain your Personal Data for as long as is required to fulfil the activities set out in this Privacy Policy, for as long as otherwise communicated to you or for as long as is permitted by Applicable Law.",
      subsections: [],
    },
    {
      heading: "Your legal rights",
      content:
        "Under Applicable Law, you may have a number of rights, including: the right not to provide your Personal Data to us; the right of access to your Personal Data; the right to request rectification of inaccuracies; the right to request the erasure, or restriction of Processing, of your Personal Data; the right to object to the Processing of your Personal Data; the right to have your Personal Data transferred to another Controller; the right to withdraw consent; and the right to lodge complaints with Data Protection Authorities. We may require proof of your identity before we can give effect to these rights.",
      subsections: [],
    },
    {
      heading: "Other websites",
      content:
        "µLearn's Website may contain links to sites operated by third parties whose policies regarding the handling of information may differ from ours. These websites and platforms have separate and independent privacy or data policies, privacy statements, notices and terms of use, which we recommend you read carefully. In addition, you may encounter third party applications that interact with µLearn's Services.",
      subsections: [],
    },
    {
      heading: "Applicable Law",
      content:
        "The validity and interpretation of this Privacy Policy shall be governed by the laws of the India.",
      subsections: [],
    },
    {
      heading: "Changes to this Privacy Policy",
      content:
        "This Policy may be amended or updated from time to time to reflect changes in our practices with respect to the Processing of Personal Data, or changes in Applicable Law. We encourage you to read this Policy carefully, and to regularly check this page to review any changes we might make in accordance with the terms of this Policy.",
      subsections: [],
    },
  ],
};

export const termsAndConditions = {
  title: "TERMS OF SERVICES",
  lastUpdated: "September 2025",
  introduction: `These Terms of Services (“Terms” or “Agreement”) shall apply to use of μLearn platform (“μLearn” or “We” or “us”). By becoming a registered user of µLearn platform and by clicking the "I Accept" button on this registration page, and by using the relevant Training, you acknowledge that you have read and understood this Terms of Services and you agree to be bound by all of the terms and conditions of this Agreement.`,
  sections: [
    {
      heading: "Definitions:",
      content: "",
      subsections: [
        "Confidential Information means information provided by one party to the other including in written, graphic, recorded, machine readable or other form concerning the business, clients, suppliers, finances and other areas of the disclosing party's business or products, but does not include information in the public domain other than through the default of the party disclosing the information, information required to be disclosed by any court or regulatory authority, or any information already in the possession or control of the disclosing party.",
        "Intellectual Property Rights means and includes patents, trademarks, service marks, trade names, designs, copyrights, rights of privacy and publicity and other forms of intellectual or industrial property, know how, trade secrets, any other protected rights or assets and any licenses and permissions in connection therewith, in each and every part of the world and whether or not registered or registrable and for the full period thereof, and all extensions and renewals thereof, and all applications for registration in connection with the foregoing.",
        "Representative means any director, officer, employee, agent or professional advisor of μLearn.",
        "Services means the services more particularly described in Clause 2 of these Terms.",
        "Training or Training Material(s) means the orientation programs, webinars, training or training materials provided by µLearn from time to time in the course of the delivery of our Services.",
        "Website means https://mulearn.org/ owned and maintained by μLearn.",
        "You or you or your or yourself refers to the individual/user who uses the Services."
      ]
    },
    // Add more sections as needed, following the privacyPolicy structure
  ]
};

export const in50hrs = {
  features: [
    {
      title: "PITCH",
      titleSpan: "IT",
      description:
        "Pitch your boldest ideas and captivate them all in just minutes.",
    },
    {
      title: "PROTOTYPE",
      titleSpan: "TO",
      description:
        "Dive into the hustle and bustle of collaboration as teams form and dive headfirst into building their prototypes.",
    },
    {
      title: "GET FUNDED",
      titleSpan: "GET",
      description:
        "Pitch your boldest ideas and captivate them all in just minutes.",
    },
  ],
  steps: [
    {
      step: "STEP 1",
      stepSpan: "1",
      description:
        "Collect your coupons, go to the In-50hr-Challenge and type /get-in50hours-coupon to get your coupon code.",
    },
    {
      step: "STEP 2",
      stepSpan: "2",
      description:
        "Go to MakeMyPass.com and register for the event using the coupon code. In case you are not in level 5, you can pay and register.",
    },
    {
      step: "STEP 3",
      stepSpan: "3",
      description:
        "You will receive a confirmation mail having the ticket for joining the event on the 23rd of February.",
    },
  ],
};

export const events: {
  latestEvents: Event[];
  recurringEvents: {
    weekly: Event[];
    biweekly: Event[];
    monthly: Event[];
    flagship: Event[];
  };
} = {
  latestEvents: [
    {
      title: "Hacktoberfest 2025",
      date: "Oct 1-31, 2025",
      description:
        "Hacktoberfest 2025 is a month-long open-source celebration where developers across the globe contribute to projects, improve software, and earn a digital badge.",
    },
  ],
  recurringEvents: {
    flagship: [],
    weekly: [
      {
        title: "Inspiration Station Radio",
        description:
          "Everyone has a story to tell, the story about finding their passion, the story of learning new things and much more. Often times these stories are filled with fun and inspirations which fuel others to start their own journey.",
        link: "/isr",
        date: "Every Tuesday",
      },
      {
        title: "Open Mic",
        description:
          "Already too exhausted by your weekly chores? Insert Open Mic 🎤 into the equation and your week becomes much more fun! The event aims to provide members an open stage to exhibit their skills and talents to the community.",
        link: "/events/openmic",
        date: "Every Thursday",
      },
      {
        title: "µLearn Mentor Connect",
        description:
          "GTech μLearn presents Mentor Connect 👨🏽‍🏫, an original initiative as part of Weekly Twitch. This initiative will give members an opportunity to interact, learn, and explore their interests with mentors from the Industry.",
        link: "/events/mentorconnect",
        date: "Every Friday",
      },
      {
        title: "Salt Mango Tree",
        description:
          "English! English! English! I avoid I don't like it, but English likes me, I can't avoid! Well since avoiding English isn't an option, let's try to work towards improving our knowledge of English, by practicing, together.",
        link: "/events/saltmangotree",
        date: "Every Wednesday",
      },
    ],
    biweekly: [],
    monthly: [],
  },

};
// Add gallery data
export const galleryData: GalleryItem[] = [
  {
    id: "1",
    title: "Launchpad 2024",
    description: "Our biggest hiring fest with 5000+ participants from 200+ campuses",
    image: "/images/impact/launchpad-2024.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 5000,
      campuses: 200
    }
  },
  {
    id: "2",
    title: "Top 100 Coders",
    description: "Celebrating the brightest minds from our coding community",
    image: "/images/impact/top-100-coders.jpg",
    category: "students",
    type: "image",
    stats: {
      participants: 100
    }
  },
  {
    id: "3",
    title: "Company Partnership Summit",
    description: "Connecting students with top tech companies for career opportunities",
    image: "/images/impact/company-summit.jpg",
    category: "companies",
    type: "image",
    stats: {
      companies: 50
    }
  },
  {
    id: "4",
    title: "Mentor Meetup",
    description: "Our dedicated mentors guiding the next generation of innovators",
    image: "/images/impact/mentor-meetup.jpg",
    category: "mentors",
    type: "image"
  },
  {
    id: "5",
    title: "Success Story: From Student to Developer",
    description: "How μLearn helped Sarah land her dream job at Google",
    image: "/images/impact/success-story-1.jpg",
    category: "impact-stories",
    type: "image"
  },
  {
    id: "6",
    title: "Permute Hackathon",
    description: "48 hours of innovation and problem-solving with 300+ teams",
    image: "/images/impact/permute-hackathon.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 1200
    }
  },
  {
    id: "7",
    title: "Campus Community Growth",
    description: "Our expanding network of campus ambassadors and clubs",
    image: "/images/impact/campus-growth.jpg",
    category: "students",
    type: "image",
    stats: {
      campuses: 150
    }
  },
  {
    id: "8",
    title: "Industry Collaboration",
    description: "Working with industry leaders to shape future-ready curriculum",
    image: "/images/impact/industry-collab.jpg",
    category: "companies",
    type: "image"
  },
  {
    id: "9",
    title: "Mentor Training Program",
    description: "Empowering experienced professionals to guide young talents",
    image: "/images/impact/mentor-training.jpg",
    category: "mentors",
    type: "image"
  },
  {
    id: "10",
    title: "Rural Tech Revolution",
    description: "Bringing digital literacy to rural communities across Kerala",
    image: "/images/impact/rural-tech.jpg",
    category: "impact-stories",
    type: "image"
  },
  {
    id: "11",
    title: "Women in Tech Conference",
    description: "Celebrating and empowering women in technology",
    image: "/images/impact/women-in-tech.jpg",
    category: "events",
    type: "image",
    stats: {
      participants: 800
    }
  },
  {
    id: "12",
    title: "Student Innovation Showcase",
    description: "Showcasing groundbreaking projects from our student community",
    image: "/images/impact/innovation-showcase.jpg",
    category: "students",
    type: "image"
  }
];

export const galleryCategories = [
  { id: "all", label: "All", count: galleryData.length },
  { id: "events", label: "Events", count: galleryData.filter(item => item.category === "events").length },
  { id: "students", label: "Students", count: galleryData.filter(item => item.category === "students").length },
  { id: "companies", label: "Companies", count: galleryData.filter(item => item.category === "companies").length },
  { id: "mentors", label: "Mentors", count: galleryData.filter(item => item.category === "mentors").length },
  { id: "impact-stories", label: "Impact Stories", count: galleryData.filter(item => item.category === "impact-stories").length },
];

export const impactStats: ImpactStat[] = [
  { number: "59,000+", label: "Learners", icon: "Users" },
  { number: "1,900+", label: "Institutions", icon: "School" },
  { number: "500+", label: "Events Hosted", icon: "Calendar" },
  { number: "50+", label: "Company Partners", icon: "Handshake" },
  { number: "1,000+", label: "Mentors", icon: "GraduationCap" },
  { number: "100+", label: "Success Stories", icon: "TrendingUp" },
];
