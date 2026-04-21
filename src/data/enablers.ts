import type { LucideIcon } from "lucide-react";
import { Building2, HelpCircle, Lightbulb, Target } from "lucide-react";
import { cdnUrl } from "@/services/cdn";

export interface EnablerFeature {
  text: string;
  icon: LucideIcon;
}

export const enablers = {
  benefits: [
    {
      title: "Industry Immersion Programs",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits1.webp"),
      items: [
        {
          text: "Offering short-term industry internships to stay connected with current practices and emerging technologies.",
        },
        {
          text: "TA's and presenters can be moved to the front of the class.",
        },
      ],
      bgColor: "bg-mulearn-blackish",
      textColor: "text-mulearn-whitish",
    },
    {
      title: "Up-Skill Programs",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits2.webp"),
      items: [
        {
          text: "Providing a platform for enablers to gain insights from industry mentors.",
        },
        {
          text: "Enablers can enhance their skills and stay updated with emerging technologies.",
        },
        {
          text: "Workshops focused on technology, no-code solutions, Git, GitHub, and open-source programs.",
        },
      ],
      bgColor: "bg-blue-500",
      textColor: "text-mulearn-whitish",
    },
    {
      title: "Meet-ups",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Benefits3.webp"),
      items: [
        {
          text: "Enabler meet-ups with industry and peers offer statewide networking opportunities.",
        },
        {
          text: "Monthly District Meetups: Virtual/Offline events to track progress and engagement.",
        },
        {
          text: "Zonal Meetups: Organized offline events by zonal heads once every 3 months.",
        },
      ],
      bgColor: "bg-blue-100",
      textColor: "text-mulearn-blackish",
    },
  ],

  features: [
    {
      text: "Provide direction and ensure healthy chapter functioning",
      icon: Target,
    },
    {
      text: "Guide student leads when needed",
      icon: HelpCircle,
    },
    {
      text: "Support a culture of exploration and practical learning",
      icon: Lightbulb,
    },
    {
      text: "Facilitate industry or campus-level opportunities.",
      icon: Building2,
    },
  ] as EnablerFeature[],

  programs: [
    {
      title: "Learning Fest For Enablers",
      description:
        "Are you passionate about helping others reach their full potential? 👀 Join us at Learning Fest, where you can enhance your skills as a mentor 💫 Explore new teaching techniques, network with fellow enablers, and help shape the future of education",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Project1.webp"),
      link: "https://mulearn.org/r/enablers-learningfest",
      cta: "Enroll Now",
    },
    {
      title: "Art of Teaching - Teach Contest",
      description:
        "Art of Teaching is an annual event that spotlights enablers' teaching talents. They can showcase their skills through videos, simplifying concepts for students. In the last edition, we received 150+ video entries and rewarded winners with cash prizes.",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Project2.webp"),
      link: "https://mulearn.org/artofteaching",
      cta: "Know More",
    },
  ],

  onboarding: [
    {
      number: "01",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Mu.webp"),
      title: "Create µLearn Profile",
      description:
        'Enablers should create a profile via app.mulearn.org, and they should ensure to register as a faculty member by choosing the option "I\'m teaching in an Institute". Once you get a profile, go to "Connect Discord" and join our Discord server.',
      link: "https://app.mulearn.org/",
      linkText: "app.mulearn.org",
    },
    {
      number: "02",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Discord.webp"),
      title: "Welcome to Discord",
      description:
        "Once you join the server, our bot, Aaronchetan will send you a DM asking you to connect your µ-ID, which is provided in the µlearn profile. Once it's connected, you can start your onboarding process.",
      link: "https://discord.gg/3v5GvJ8",
      linkText: "Join Discord",
    },
    {
      number: "03",
      image: cdnUrl("src/modules/Public/EnablersPage/assests/Bulb.webp"),
      title: "Add Interest Groups",
      description:
        "Now you will have access to the #lvl1-info channel, and as you do the tasks, you will progress through the levels. Once you reach level 4, you will have the option to edit Interest Groups on your µlearn profile page.",
      link: "https://app.mulearn.org/",
      linkText: "Explore Interests",
    },
  ],

  successStories: [
    {
      name: "Dr. A G Mathew",
      role: "Principal, St. Thomas Institute of Science and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=xbsRahh_mIschz-R",
      thumbnail: "/assets/be-a-part/thumbnails/ag-mathew.webp",
    },
    {
      name: "Dr. Neelakantan P C",
      role: "Principal, Muthoot Institute of Science and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=2qGCXXH89j9yzmZ-&t=21",
      thumbnail: "/assets/be-a-part/thumbnails/neelakantan-pc.webp",
    },
    {
      name: "Sharika T R",
      role: "Lead Enabler µLearn, Adi Shankara Institute of Engineering and Technology",
      url: "https://youtu.be/oyvb4-decaY?si=_qT1fFmQJVmlmJmg&t=63",
      thumbnail: "/assets/be-a-part/thumbnails/sharika-tr.webp",
    },
    {
      name: "Dr. M Manoj",
      role: "Lead Enabler µLearn, Marian Engineering College",
      url: "https://youtu.be/oyvb4-decaY?si=fEPdIxDP4uanErYi&t=73",
      thumbnail: "/assets/be-a-part/thumbnails/m-manoj.webp",
    },
  ],
  colleges: [
    {
      title: "Carmel College of Engineering and Technology",
    },
    {
      title: "Providence College of Engineering & School of Business Chengannur",
    },
    {
      title: "College of Engineering Chengannur",
    },
    {
      title: "Sree Buddha College of Engineering Pattoor",
    },
    {
      title: "Cochin University College of Engineering, Kuttanadu",
    },
    {
      title: "Adi Shankara College of Engineering",
    },
    {
      title: "Ilahia College of Engineering and Technology",
    },
    {
      title: "Mar Elias College, Kottappady, Ernakulam",
    },
    {
      title: "MES College of Engineering Technology Kunnukara",
    },
    {
      title: "MES MK Mackar Pillai College for Advanced Studies",
    },
    {
      title: "Muthoot Institute of Technology & Science",
    },
    {
      title: "Rajagiri School of Engineering and Technology",
    },
    {
      title: "SCMS School of Engineering and Technology",
    },
    {
      title: "Sree Narayana Gurukulam College of Engineering",
    },
    {
      title: "TocH Institute of Science and Technology",
    },
    {
      title: "Visat Engineering College",
    },
    {
      title: "Viswajyothy College of Engineering and Technology",
    },
    {
      title: "Federal Institute of Science and Technology",
    },
    {
      title: "Government Engineering College Idukki",
    },
    {
      title: "Mar Baselios Christian College of Engineering & Technology",
    },
    {
      title: "College of Engineering Thalassery",
    },
    {
      title: "Government College of Engineering Kannur",
    },
    {
      title: "Kodiyeri Balakrishnan Memorial Government College",
    },
    {
      title: "College of Engineering Trikaripur",
    },
    {
      title: "LBS College of Engineering",
    },
    {
      title: "College of Engineering - Kottarakkara",
    },
    {
      title: "College of Engineering - Pathanapuram",
    },
    {
      title: "College of Engineering Karunagappally",
    },
    {
      title: "College of Engineering Perumon",
    },
    {
      title: "Amal Jyothi College of Engineering Kanjirappally",
    },
    {
      title: "Kottayam Institute of Science and Technology",
    },
    {
      title: "Kristu Jyoti College of Management and Technology",
    },
    {
      title: "Rajiv Gandhi Institute of Technology Kottayam",
    },
    {
      title: "Saintgits College of Engineering",
    },
    {
      title: "St Josephs College of Engineering and Technology Palai",
    },
    {
      title: "AWH Engineering College",
    },
    {
      title: "College of Applied Science IHRD, Kozhikode",
    },
    {
      title: "College of Engineering Vadakara",
    },
    {
      title: "Govt. Engineering College - Kozhikode",
    },
    {
      title: "Muhammad Abdurahiman Memorial Orphanage College",
    },
    {
      title: "St. Josephs College Devagiri (Autonomous)",
    },
    {
      title: "Sree Gokulam Arts and Science College Baluserry",
    },
    {
      title: "Al Shifa College of Arts and Science",
    },
    {
      title: "CHMKM Govt Arts and Science College Tanur",
    },
    {
      title: "Malabar College of Advanced Studies",
    },
    {
      title: "MES College of Engineering - Kuttippuram",
    },
    {
      title: "MES Ponnani College",
    },
    {
      title: "Government Engineering College Sreekrishnapuram",
    },
    {
      title: "Mount Seena College of Arts and Science",
    },
    {
      title: "NSS College of Engineering Palakkad",
    },
    {
      title: "Sreepathy Institute of Management and Technology",
    },
    {
      title: "Ahalia School of Engineering and Technology",
    },
    {
      title: "Al Ameen Engineering College",
    },
    {
      title: "College of Engineering Aranmula",
    },
    {
      title: "College of Engineering Kallooppara",
    },
    {
      title: "Musaliar College of Arts and Science Pathanamthitta",
    },
    {
      title: "Christ College of Engineering",
    },
    {
      title: "Government Engineering College Thrissur",
    },
    {
      title: "Government Polytechnic College, Kunnamkulam",
    },
    {
      title: "Jyothi Engineering College",
    },
    {
      title: "Sahrdaya College of Engineering & Technology",
    },
    {
      title: "Thejus Engineering College",
    },
    {
      title: "Vidya Academy of Science and Technology",
    },
    {
      title: "ACE College of Engineering",
    },
    {
      title: "College of Engineering Muttathara",
    },
    {
      title: "College of Engineering Trivandrum",
    },
    {
      title: "LBS Institute of Technology for Women - Poojappura",
    },
    {
      title: "Lourdes Matha College of Science and Technology",
    },
    {
      title: "Mar Baselios College of Engineering and Technology",
    },
    {
      title: "Marian Engineering College",
    },
    {
      title: "Mohandas College of Engineering and Technology",
    },
    {
      title: "Muslim Association College of Engineering",
    },
    {
      title: "Rajadhani Institute of Engineering and Technology",
    },
    {
      title: "Sree Chitra Thirunal College of Engineering",
    },
    {
      title: "St. Thomas Institute for Science & Technology",
    },
    {
      title: "Trinity College of Engineering",
    },
    {
      title: "University College of Engineering Kariavattom",
    },
    {
      title: "WMO Arts and Science College",
    },
  ],
};
