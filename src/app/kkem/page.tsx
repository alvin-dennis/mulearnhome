import { cdnUrl } from "@/services/cdn";
import IGAbout from "./_components/IGAbout";
import IGSection from "./_components/IGSection";
import IGEvents from "./_components/IGEvents";

export default function Landing() {
  const igCardData = [
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/android.webp"),
      name: "Android",
      link: "https://learn.mulearn.org/webmobile/android",
      description:
        "Android is a mobile operating system based on a modified version of the Linux kernel and other open-source software.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/frontend.webp"),
      name: "Front-End",
      link: "https://learn.mulearn.org/webmobile/web",
      description: `
                    The term Front-End mainly referes to the User Interface which an user view and interacts with and its `,
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/blockchain.webp"),
      name: "Blockchain",
      link: "https://learn.mulearn.org/blockchain",
      description: `
                    A blockchain is a digital ledger or database where encrypted blocks of digital asset data are stored and chained together`,
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/ai.webp"),
      name: "Artifcial Intelligence",
      link: "https://learn.mulearn.org/aimlanalytics/ai",
      description:
        "AI which stands for artificial intelligence refers to systems or machines that mimic human intelligence to perform tasks.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/arvr.webp"),
      name: "AR/VR",
      link: "https://learn.mulearn.org/arvrxr",
      description: `
                    Augmented and virtual reality (AR/VR) are immersive technologies that enable users to experience digitally rendered content`,
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/qa.webp"),
      name: "QA",
      link: "https://learn.mulearn.org/webmobile/qa",
      description:
        "Quality assurance (QA) is any systematic process of determining whether a product or service meets specified requirements.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/pm.webp"),
      name: "Product Management",
      link: "https://learn.mulearn.org/innovationentre/pm",
      description:
        "Are you interested in learning to build the right product and the product right?.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/iot.webp"),
      name: "IoT",
      link: "https://learn.mulearn.org/iotrf/iot",
      description:
        "IoT is the network of physical objects that are embedded with sensors, software etc.. for the purpose of connecting and exchanging data over the internet.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/uiux.webp"),
      name: "UI/UX",
      link: "https://learn.mulearn.org/uiuxcreative/ux",
      description:
        "UI Design and UX Design are some of the most in-demand skills today. While UI deals with the graphical layout of an app, UX deals with the human experience.",
    },
    {
      image: cdnUrl("src/modules/Public/KKEM/assets/IGS/cybersec.webp"),
      name: "Cyber Security",
      link: "https://learn.mulearn.org/cybersec",
      description:
        "Cyber Security is the practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious attacks. ",
    },
  ];
  const pastEventCardData = [
    {
      name: "GTA: SandShores",
      code: "gtas",
      description:
        "After Codestorm get ready for an exhilarating journey with GTA:SandShore Hackathon💫",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/gtas.webp"),
      link: "https://gta.mulearn.org",
      date: "14th and 15th October",
    },
    {
      name: "Learning Fest",
      code: "lf",
      description:
        "µLearn in association with KKEM brings you Learning Fest a series of bootcamps to improve your skills in various domains and the chance to earn Karma points and various other opportunities.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/lf.webp"),
      link: "https://mulearn.org/keralatechfest",
      date: "7th August 2023",
    },
    {
      name: "GTA:CodeStorm",
      code: "gtac",
      description:
        "It's time to gear up for the CodeStorm, the first hackathon of the Grand Tech Adventure Hackathon series. 🚀",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/gtac.webp"),
      link: "https://gta.mulearn.org/codestorm",
      date: "19th and 20th August",
    },
    {
      name: "Beyond Us Hackathon",
      code: "buh",
      description:
        "Embark on an extraordinary hackathon mission 🚀. Utilize your strategic thinking and create impressive projects from scratch to explore Beyond Us ✨",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/buh.webp"),
      link: "https://mulearn.org/events/beyondus",
      date: "8th and 9th July 2023",
    },
    {
      name: "Karma Fest",
      code: "kf",
      description:
        "his festive season, don't miss the chance to boost your career with µLearn's Karma Fest‼️\n\nEarn valuable karma points by completing learning tracks, tasks, and participating in mini-hackathons based on Design & Research, Development, No-code, and AI.",
      image: cdnUrl("src/modules/Public/KKEM/assets/past_events/kf.webp"),
      link: "",
      date: "May 2023",
    },
  ];
  return (
    <>
      <main className="max-w-800">
        <IGAbout />
        <IGSection cards={igCardData} />
        <div id="events">
          <IGEvents
            cards={pastEventCardData}
            heading="Partnered Events"
            largeImg={true}
          />
        </div>
      </main>
    </>
  );
}
