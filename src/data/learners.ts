import type { LearnerRoleTag, OnboardingStep, Testimonial } from "@/lib/types";

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
    title: "Create your µLearn account",
    description: "Sign up in minutes and get access to the community.",
    iconUrl: "/assets/learners/icons/mu-icon.svg",
  },
  {
    step: 2,
    title: "Choose an interested group",
    description: "Join a guild that matches your skills and goals.",
    iconUrl: "/assets/learners/icons/discord-icon.svg",
  },
  {
    step: 3,
    title: "Start engaging & earn karma",
    description: "Complete tasks, collaborate, and grow your karma points.",
    iconUrl: "/assets/learners/icons/bulb-icon.svg",
  },
];

export const testimonialsData: Testimonial[] = [
  {
    name: "Aswanth V C",
    designation: "Jr. SWE",
    quote:
      "My µLearn journey began at GTA Codestorm and grew through constant learning and support on Discord. Launchpad then opened the door to interviews, helping me land my role as a Junior Software Engineer.",
    imageUrl: "",
  },
  {
    name: "Ansan Johny",
    designation: "Jr. SDET",
    quote:
      "I joined µLearn for karma points but soon found real skill-building and growth. Launchpad helped me turn that proof of work into my current role.",
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
