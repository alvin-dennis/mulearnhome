import { Testimonial, LearnerRoleTag, TopLearner, OnboardingStep } from "@/lib/types";

export const learnerIdentityTags: LearnerRoleTag[] = [
  { label: "The Ambitious Student", id: "ambitious" },
  { label: "The Career Launcher", id: "launcher" },
  { label: "The Skill Upgrader", id: "upgrader" },
  { label: "The Career Pivoter", id: "pivoter" },
  { label: "The Aspiring Entrepreneur", id: "entrepreneur" },
  { label: "The Passionate Hobbyist", id: "hobbyist" },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    step: 1,
    title: "Create μLearn Profile",
    description:
      "Enablers should create a profile via app.mulearn.org, and they should ensure to register as a faculty member by choosing the option 'I'm teaching in an Institute. Once you get a profile, go to 'Connect Discord' and join our Discord server.",
    iconUrl: "/assets/learners/icons/mu-icon.svg",
  },
  {
    step: 2,
    title: "Connect Discord",
    description:
      "Once you join the server, our bot Aaronchetan will send you a DM asking you to connect your u-ID, which is provided in the learn profile. Once it's connected, you can start your onboarding process.",
    iconUrl: "/assets/learners/icons/discord-icon.svg",
  },
  {
    step: 3,
    title: "Start Leveling Up",
    description:
      "Now you will have access to the #lvl-info channel, and as you do the tasks, you will progress through the levels. Once you reach level 4, you will have the option to edit Interest Groups on your learn profile page.",
    iconUrl: "/assets/learners/icons/bulb-icon.svg",
  },
];

export const topLearnersData: TopLearner[] = [
  {
    name: "Greg George",
    kp: 37500,
    imageUrl: "/assets/learners/images/greg.png",
  },
  {
    name: "Erica Jackson",
    kp: 24500,
    imageUrl: "/assets/learners/images/erica.png",
  },
  {
    name: "Vishnu Das",
    kp: 20300,
    imageUrl: "/assets/learners/images/vishnu.png",
  },
  { name: "John", kp: 20000, imageUrl: "" },
  { name: "Jane", kp: 19900, imageUrl: "" },
  { name: "Alice", kp: 19800, imageUrl: "" },
  { name: "Doe", kp: 19700, imageUrl: "" },
  { name: "Smith", kp: 19600, imageUrl: "" },
  { name: "Lenita", kp: 19500, imageUrl: "" },
  { name: "Grace", kp: 19400, imageUrl: "" },
  { name: "Rodrigues", kp: 19300, imageUrl: "" },
];

export const testimonialsData: Testimonial[] = [
  {
    name: "Soorya",
    designation: "SWE",
    quote:
      "In a world that never stops changing, standing still isn't an option. Learning is how you keep up and get ahead. It's the key that unlocks new hobbies, better careers, and deeper connections.",
    imageUrl: "",
  },
  {
    name: "Alex",
    designation: "Product Designer",
    quote:
      "μLearn provided the real-world projects and mentorship I needed to switch careers. The focus on Karma Points kept me motivated to consistently build my portfolio.",
    imageUrl: "",
  },
  {
    name: "Arya",
    designation: "SWE",
    quote:
      "In a world that never stops changing, standing still isn't an option. Learning is how you keep up and get ahead. It's the key that unlocks new hobbies, better careers, and deeper connections.",
    imageUrl: "",
  },
  {
    name: "Riya",
    designation: "Product Designer",
    quote:
      "μLearn provided the real-world projects and mentorship I needed to switch careers. The focus on Karma Points kept me motivated to consistently build my portfolio.",
    imageUrl: "",
  },
  {
    name: "Manu",
    designation: "SWE",
    quote:
      "In a world that never stops changing, standing still isn't an option. Learning is how you keep up and get ahead. It's the key that unlocks new hobbies, better careers, and deeper connections.",
    imageUrl: "",
  },
];

export const slideImages = [
  { imageUrl: "/assets/learners/slide1.png", alt: "Slide 1" },
  { imageUrl: "/assets/learners/slide2.png", alt: "Slide 2" },
  { imageUrl: "/assets/learners/slide3.png", alt: "Slide 3" },
];
