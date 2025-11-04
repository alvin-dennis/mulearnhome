import { cdnUrl } from "@/services/cdn";

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
};
