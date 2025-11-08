import { cdnUrl } from "@/services/cdn";
import { Event, OMEvent } from "@/lib/types";

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
      title: "Hacktoberfest 205",
      date: "Oct 1-31, 2025",
      description:
        "Hacktoberfest 2025 is a month-long open-source celebration where developers across the globe contribute to projects, improve software, and earn a digital badge.",
    },
    {
      title: "Hacktoberfest 2025",
      date: "Oct 1-31, 2025",
      description:
        "Hacktoberfest 2025 is a month-long open-source celebration where developers across the globe contribute to projects, improve software, and earn a digital badge.",
    },
  ],
  recurringEvents: {
    flagship: [
      {
        title: "Permute",
        description:
          "Perµte is the annual flagship celebration of the µLearn Foundation—an electrifying gathering that honors excellence, sparks bold ideas through thought-provoking panels, unveils visionary roadmaps, and ignites connections across a vibrant tapestry of talent and innovation.",
        link: "https://permute.mulearn.org/",

        isLive: false,
      },
      {
        title: "Top 100 Coders",
        description:
          "Welcome to the Top 100 Coders initiative Recognised by Kerala Govt. We're on a mission to recognize and empower the best coders in India. If you're passionate about coding and want to make a significant impact in the tech community, you're in the right place.",
        link: "https://top100coders.com/",
        image: cdnUrl("src/modules/Public/Home/assets/top-100.webp"),
        isLive: true,
      },
      {
        title: "Top 100 Designers",
        description:
          "Discover the forefront of design innovation with Top 100 Designers, an initiative dedicated to recognizing and celebrating India's most talented and influential designers. This platform brings together creative minds from various design disciplines - from UI/UX and graphic design to product and motion design. Join us in spotlighting exceptional design talent and shaping the future of India's creative landscape.",
        link: "https://designers.top100series.com/",

        isLive: true,
      },
      {
        title: "Top 100 Makers",
        description:
          "Welcome to Top 100 Makers - an initiative celebrating India's most innovative creators, builders, and hardware enthusiasts. We're dedicated to recognizing brilliant minds who turn ideas into tangible prototypes, electronic innovations, and real-world solutions. From IoT devices and robotics to DIY projects and smart gadgets, join us in empowering the maker community and shaping the future of hands-on innovation in India.",
        link: "https://makers.top100series.com/",

        isLive: true,
      },
      {
        title: "Launchpad",
        description:
          "Launchpad Kerala is a premier job fair that brings together talented individuals and innovative companies in the technical and engineering fields. With its skills-first approach, flexible interviews, and a wide talent pool, Launchpad Kerala offers unmatched opportunities for both candidates and employers.",
        link: "https://launchpad.mulearn.org/",
        image: cdnUrl("src/modules/Public/Home/assets/launchpad.webp"),
        isLive: false,
      },
      {
        title: "Mutate",
        description:
          "Mutate is a prestigious, invite-only convergence that brought together 125 campus leads and enablers from the μLearn foundation. This exclusive event, held at the Gokulam Grand in Kazhakoottam, was designed to foster collaboration, ignite creative discussions, and drive impactful change for future campus initiatives. It served as a strategic platform for networking and planning, uniting the community's brightest minds to shape the future of student-led innovation.",
        link: "https://mulearn.org/",

        isLive: false,
      },
      {
        title: "Amuse",
        description:
          "Amuse is a vibrant, invite-only gathering that brought together campus leads, district leads, and core enablers from the μLearn community. Hosted as a collaborative planning retreat, Amuse served as a space for vision-building, strategy discussions, and cross-campus collaboration. The event fostered meaningful conversations and collective ideation, empowering leaders to align on future initiatives and strengthen the ecosystem of student-led innovation across campuses.",
        link: "https://mulearn.org/",

        isLive: false,
      },
      {
        title: "CareHack 2025",
        description:
          "CareHack is a dynamic two-phase hackathon presented by CareRevenue in collaboration with the μLearn Foundation, scheduled for August 2nd & 3rd, 2025. This competitive event is designed to identify and recruit exceptional full-stack developers and UI/UX designers through intense, collaborative innovation. Beyond talent acquisition, CareHack aims to amplify CareRevenue's brand presence within the tech ecosystem while evaluating participants on technical expertise, teamwork, communication, and problem-solving abilities.",
        link: "https://carehack.tech/",

        isLive: false,
      },
    ],
    weekly: [
      {
        title: "Inspiration Station Radio",
        description:
          "Everyone has a story to tell, the story about finding their passion, the story of learning new things and much more. Often times these stories are filled with fun and inspirations which fuel others to start their own journey.",
        link: "/events/inspiration-station",
        date: "Every Tuesday",
      },
      {
        title: "Open Mic",
        description:
          "Already too exhausted by your weekly chores? Insert Open Mic 🎤 into the equation and your week becomes much more fun! The event aims to provide members an open stage to exhibit their skills and talents to the community.",
        link: "/events/openmic",
        date: "Every Saturday",
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

export const inspirationStationData = {
  events: [
    {
      id: 1,
      title: "From Failure to Success: My Tech Journey",
      speaker: "Alex Johnson",
      description:
        "Alex shares his inspiring journey from multiple failures to building a successful career in technology, and the lessons he learned along the way.",
      date: "Next Tuesday",
      tags: ["Career", "Resilience", "Technology"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: true,
    },
    {
      id: 2,
      title: "Women in Leadership: Breaking the Glass Ceiling",
      speaker: "Maria Garcia",
      description:
        "Maria discusses her experiences as a female leader in a male-dominated industry and how she empowers other women to take on leadership roles.",
      date: "Coming Soon",
      tags: ["Leadership", "Diversity", "Empowerment"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: true,
    },
    {
      id: 3,
      title: "The Art of Public Speaking",
      speaker: "David Chen",
      description:
        "David shares his transformation from a shy introvert to a confident public speaker and how communication skills changed his career trajectory.",
      date: "December 5th",
      tags: ["Communication", "Personal Growth", "Confidence"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: true,
    },
    {
      id: 4,
      title: "From Engineer to Entrepreneur",
      speaker: "John Doe",
      description:
        "John shares his incredible journey from being a software engineer to building a successful startup, the challenges he faced, and how he overcame them to create impact.",
      date: "15/11/2023",
      tags: ["Career", "Entrepreneurship", "Resilience"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
    {
      id: 5,
      title: "Breaking Barriers in Tech",
      speaker: "Sarah Wilson",
      description:
        "Sarah discusses her experience as a woman in technology, breaking stereotypes, and creating opportunities for others in the tech industry.",
      date: "08/11/2023",
      tags: ["Leadership", "Diversity", "Technology"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
    {
      id: 6,
      title: "The Power of Community Learning",
      speaker: "Mike Johnson",
      description:
        "Mike talks about how community-driven learning transformed his career and the importance of peer-to-peer knowledge sharing in personal growth.",
      date: "01/11/2023",
      tags: ["Community", "Learning", "Growth"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
  ],
};

export interface OpenMicData {
  events: OMEvent[];
}

export const openMicData: OpenMicData = {
  events: [
    {
      id: 1,
      title: "Open Mic #1 ft. @s.o.d.666 & sabareesh__k",
      performer: "George Ben Chirby & Sabareesh K",
      description:
        "This time we house with us George Ben Chirby & Sabareesh k. John is live on Instagram at 8pm on the 18th of December and witness the magic of music.",
      date: "15/12/2022",
      tags: ["Music", "Performance"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
    {
      id: 2,
      title: "Open Mic #2 ft. Ramakrishnan",
      performer: "Ramakrishnan Haraden",
      description:
        "This time we have with us Ramakrishnan Haraden, a ship near Engineering Student at MBECT. Ramakrishnan is a music composer and loves to experiment with music.",
      date: "08/12/2022",
      tags: ["Music", "Composition"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
    {
      id: 3,
      title: "Open Mic #3 ft. Arjun",
      performer: "Arjun",
      description:
        "Wouldn't a little music make your day better? Join the Open Mic at 8:00 PM today on our Instagram Hands. This edition of Open Mic we have...",
      date: "01/12/2022",
      tags: ["Music", "Singing"],
      thumbnail: cdnUrl("public/assets/team/default.webp"),
      isUpcoming: false,
    },
  ],
};

export const artOfTeachingMentors = [
  {
    name: "Dr T M George",
    designation:
      "Former Principal at Mar Baselios College of Engineering and Technology",
    image: "/public/assets/dpm.webp",
    linkedIn:
      "https://www.linkedin.com/in/dr-t-m-george-87b86028/?originalSubdomain=in",
  },
  {
    name: "Ann Andrews",
    designation: "Product | Technology & Data Strategy | NYU & Columbia Fellow",
    image: "/public/assets/dpm.webp",
    linkedIn: "https://www.linkedin.com/in/annandrews/",
  },
  {
    name: "Rajeev J Sebastian",
    designation: "CEO Alokin Software Private Limited",
    image: "/public/assets/dpm.webp",
    linkedIn: "https://www.linkedin.com/in/rajeevjs",
  },
];

export const artOfTeachingUrls = {
  mainVideo: "https://www.youtube.com/embed/r5izRx-4j68?si=L9gHSznyZTeCI3b3",
  firstEdition: "vPLuA5kXoBI",
  archives: ["Wmo0StqW9Kc", "TEylubYDzhQ", "jRcseEVk2sk"],
  registerNow: "https://airtable.com/appopz4GXqkTszuJ7/pagmodllXiRWsjhXi/form",
};

export const yip = [
  {
    type: "type1",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/prereg.webp"),
    phaseLabel: "Pre\nRegistration",
    title: "Step One",
    link: "https://yip.kerala.gov.in/yipapp/index.php/Idea2022",
    description:
      "Click Here to go to the Pre-Registration page. Enter all your details in the Pre-Registration Form and Complete the OTP Verification. By Now you would have received an email with login credentials, you can now login with that.",
  },
  {
    type: "type2",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/studentreg.webp"),
    phaseLabel: "Ideator\nRegistration",
    title: "Step Two",
    link: "https://yip.kerala.gov.in/yipapp/index.php/Init/",
    description:
      "Click Here to Login, After Logging in Click the Open the left navbar option and from the options listed there click the Profile Completion option. Fill in all your details correctly and according to the mentioned specifications. Finally Submit the form and click OK.",
  },
  {
    type: "type3",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/yip-voc.webp"),
    phaseLabel: "Voice of\nStakeholder",
    title: "Step Three",
    description:
      "After completing your Profile and submitting it, You can check the left navbar again to find the  Voice of Stakeholder(VOS Module) option. By clicking that you will be directed to the course page where you can complete it. Post it with the hashtag #yip5.0-vos to gain 400 Karma Points",
  },
  {
    type: "type1",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/team.webp"),
    phaseLabel: "Team\nFormation",
    title: "Step Four",
    description:
      "After completing the VOS Course and attending the quiz there. You can form a team consisting of minimum 2 members and maximum 5 members by clicking the Group Formation Button from the left navbar. Only one person from a group is required to form the group while the other members can join it using the team's name and password.",
  },
  {
    type: "type1",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/ideafind.webp"),
    phaseLabel: "Idea\nSubmission",
    title: "Step Five",
    description:
      "After forming a team and finding an idea which suits the given themes, the person who formed the team can submit the idea by going to the Idea Submission Option from his/her Navbar.Post your idea submission certificate with the hashtag #yip5.0-idea to gain 800 Karma Points. You could submit upto 2 ideas per person.",
  },
  {
    type: "type2",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/approved.webp"),
    phaseLabel: "Institutional\nApproval",
    title: "Step Six",
    description:
      "After the submission of the idea, it requires the approval of the respective Institution and you may contact the concerned authority for the approval of your idea.",
  },
  {
    type: "type3",
    icon: cdnUrl("src/modules/Public/yip/assets/procedure/evaluation.webp"),
    phaseLabel: "Preliminary\nEvaluation",
    title: "Step Seven",
    description:
      "Once your Idea is approved by the institution, it is put forward for a preliminary evaluation and teams are selected from District Level and State Level and are awarded prizes.",
  },
  {
    type: "type1",
    icon: cdnUrl(
      "src/modules/Public/yip/assets/procedure/winner%20annoucement.webp",
    ),
    phaseLabel: "Winner\nAnnouncement",
    title: "Step Eight",
    description:
      "Finally the winners are announced and out of the total teams selected at state level the best of those teams are provided financial and mentoring support to implement their ideas.",
  },
];
