import { clientEnv } from "@/config/env.client";
import { cdnUrl } from "@/shared";

export const kkem = {
  interestGroupCards: [
    {
      name: "UI/UX",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/46fe1fb7-7b04-4ebe-837d-120bc16d0e0a`,
      image: "/assets/interestgroups/design.svg",
      description:
        "Master the art of user interface and user experience design. Share portfolios, get feedback, and learn the latest design trends.",
    },
    {
      name: "Web Development",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/9b8aaf7f-16a0-4a66-ae53-79b8c25e5faa`,
      image: "/assets/interestgroups/webdev.svg",
      description:
        "Explore frontend, backend, and full-stack development. Collaborate on real-world web projects and learn modern frameworks.",
    },
    {
      name: "Cybersecurity",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/3a74725e-a05a-418b-a275-39d68ad9a416`,
      image: "/assets/interestgroups/cyber.svg",
      description:
        "Learn how to protect systems and data. Participate in CTFs, workshops, and security challenges.",
    },
    {
      name: "Game Development",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/1be43a3a-bcfb-4ef1-b77a-959b01bcb782`,
      image: "/assets/interestgroups/game.svg",
      description:
        "Dive into game design, development, and storytelling. Collaborate on projects and learn from industry experts.",
    },
    {
      name: "Internet Of Things (IOT) And Robotics",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/d379d82b-e116-4b67-8128-670916e6bb42`,
      image: "/assets/interestgroups/iot.svg",
      description:
        "Explore IoT devices, robotics, and automation. Build smart systems and learn about hardware integration.",
    },
    {
      name: "Digital Marketing",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/5bf2bdfe-5c22-48ab-9572-9e9836c70e79`,
      image: "/assets/interestgroups/marketing.svg",
      description:
        "Master SEO, social media, and online campaigns. Learn strategies to boost engagement and reach.",
    },
    {
      name: "Cloud and DevOps",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/1719d19a-0206-4161-9c6f-0a7dba44d4e5`,
      image: "/assets/interestgroups/cloud.svg",
      description:
        "Learn cloud platforms, CI/CD, and infrastructure automation. Collaborate on scalable solutions.",
    },
    {
      name: "Product Management",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/04d29c15-4de4-4b43-ad63-0f4760c62919`,
      image: "/assets/interestgroups/product.svg",
      description:
        "Discover the art of product strategy, development, and launch. Work with teams to deliver impactful solutions.",
    },
    {
      name: "Entrepreneurship",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/243a1bda-893c-4de3-b457-51e7cb517d83`,
      image: "/assets/interestgroups/entrepreneurship.svg",
      description:
        "Learn how to start, grow, and scale ventures. Connect with founders and innovators.",
    },
    {
      name: "AR/VR",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/2de0ee0c-ddc3-4f02-bf93-b6bd2d0625c3`,
      image: "/assets/interestgroups/arvr.svg",
      description:
        "Explore augmented and virtual reality. Build immersive applications and learn cutting-edge tech.",
    },
    {
      name: "Quantum Computing",
      link: `${clientEnv.NEXT_PUBLIC_APP_URL}dashboard/interest-groups/b83146a5-1b36-42f1-b560-76b682482e10`,
      image: "/assets/interestgroups/quantum.svg",
      description:
        "Explore quantum algorithms, qubits, and quantum computing frameworks. Learn the fundamentals shaping the next era of computation.",
    },
    {
      name: "Data Analytics",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/data-analytics.svg",
      description:
        "Master data analysis, visualization, business intelligence, and statistical modeling to uncover meaningful insights.",
    },
    {
      name: "AI & Machine Learning",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/ai-ml.svg",
      description:
        "Explore neural networks, machine learning algorithms, deep learning, and natural language processing.",
    },
    {
      name: "Blockchain",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/blockchain.svg",
      description:
        "Learn smart contracts, decentralized finance, consensus protocols, and Web3 development.",
    },
    {
      name: "No Or Low Code",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/low-code.svg",
      description:
        "Rapidly build applications and automate workflows using modern no-code and low-code platforms.",
    },
    {
      name: "Mobile Development",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/mobile-dev.svg",
      description:
        "Develop iOS, Android, and cross-platform mobile apps using Flutter, React Native, and native frameworks.",
    },
    {
      name: "Competitive Coding",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/competitive-coding.svg",
      description:
        "Hone data structures, algorithmic thinking, speed coding, and excel in competitive programming contests.",
    },
    {
      name: "Creative Design",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/creative-design.svg",
      description:
        "Explore graphic design, digital art, typography, branding, and visual storytelling.",
    },
    {
      name: "Quality Assurance",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/qa-testing.svg",
      description:
        "Learn automated testing, performance testing, QA methodology, and bug prevention strategies.",
    },
    {
      name: "Civil Engineering",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/civil.svg",
      description:
        "Explore structural engineering, urban planning, sustainable design, and smart infrastructure.",
    },
    {
      name: "Strategic Leadership",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/leadership.svg",
      description:
        "Master leadership strategy, team management, decision making, and organizational transformation.",
    },
    {
      name: "AI for Social Good",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/social-good.svg",
      description:
        "Apply artificial intelligence to healthcare, sustainability, education, and community impact.",
    },
    {
      name: "Beckn Protocol",
      link: "https://app.mulearn.org/dashboard/interestgroups",
      image: "/assets/interestgroups/beckn.svg",
      description:
        "Learn Beckn protocol architecture, open digital commerce, and decentralized transaction networks.",
    },
  ],
  pastEventCardData: [
    {
      name: "GTA: SandShores",
      code: "gtas",
      description:
        "After Codestorm get ready for an exhilarating journey with GTA: SandShore Hackathon💫",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/gtas.webp"),
      link: "https://gta.mulearn.org",
      date: "14th and 15th October",
    },
    {
      name: "Learning Fest",
      code: "lf",
      description:
        "Learning Fest — a series of bootcamps to upskill in various domains and earn karma & opportunities.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/lf.webp"),
      link: "https://mulearn.org/keralatechfest",
      date: "7th August 2023",
    },
    {
      name: "GTA:CodeStorm",
      code: "gtac",
      description:
        "Gear up for CodeStorm — the first hackathon of the Grand Tech Adventure Series. 🚀",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/gtac.webp"),
      link: "https://gta.mulearn.org/codestorm",
      date: "19th and 20th August",
    },
    {
      name: "Beyond Us Hackathon",
      code: "buh",
      description:
        "Create impressive projects from scratch and explore the limitless universe — Beyond Us ✨",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/buh.webp"),
      link: "https://mulearn.org/events/beyondus",
      date: "8th and 9th July 2023",
    },
    {
      name: "Karma Fest",
      code: "kf",
      description:
        "Earn valuable karma points by completing learning tracks, tasks, and participating in themed mini-hackathons.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/kf.webp"),
      link: "",
      date: "May 2023",
    },
  ],
  winnersDesign: [
    {
      name: "Team DT12",
      description:
        "Adarsh has managed to create a user interface for an app that helps you schedule your day. The app is designed to be simple and easy to use.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/d1.jpg"),
      link: "https://www.figma.com/file/zG7oCsCIlxuvK1uiV5g0TO/Beyond-Us-24-Hour-%7C-Scheduler-App-DT12-(Individual)?type=design&node-id=6-24&mode=design&t=38JirqJdGQl19Szp-0",
    },
    {
      name: "Team DT05",
      description:
        "This platform should provide a space for like-minded students to network, work together on projects, share achievements, and foster a sense of community.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/d2.jpg"),
      link: "https://www.figma.com/file/zG7oCsCIlxuvK1uiV5g0TO/Beyond-Us-24-Hour-%7C-Scheduler-App-DT12-(Individual)?type=design&node-id=6-24&mode=design&t=38JirqJdGQl19Szp-0",
    },
    {
      name: "Team DT08",
      description:
        "Mobile Application: We have designed a mobile application that allows users to easily record attendance. The app will have an intuitive interface with options to input the name of the attendee and their entry time.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/d3.jpg"),
      link: "https://www.figma.com/file/gBHFXhyYJNloANQlTbFlN5/Beyond-Us-Hackathon?type=design&node-id=0-1&mode=design&t=InTgCXHZn2TR2WHe-0",
    },
  ],
  winnersSoftware: [
    {
      name: "Team ST03",
      description:
        "Introducing CV Wizard from Beyond-Us: the game-changing automated CV parsing tool. With the powerful PyRes Parser, CV Wizard extracts and organizes resume data with precision, saving time for employers.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/s1.jpg"),
      link: "https://github.com/shihabsaleem/CV-BeyondUs",
    },
    {
      name: "Team ST10",
      description:
        "This platform should provide a space for like-minded students to network, work together on projects, share achievements, and foster a sense of community.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/s2.jpg"),
      link: "#",
    },
    {
      name: "Team ST13",
      description:
        "Ekipa is a comprehensive team management and task allocation platform designed to streamline collaboration and enhance productivity within teams.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/beyondus/s3.jpg"),
      link: "https://github.com/suryan-s/Ekipa",
    },
  ],
};
