import { TextTestimonial, VideoTestimonial } from "@/lib/types";

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "Dr Saji Gopinath",
    videoUrl: "LgDKzzz8xp4",
  },
  {
    id: "2",
    name: "Dr Pv Unnikrishnan",
    videoUrl: "Rn2v9mkar4Q",
  },
  {
    id: "3",
    name: "K. N. Balagopal",
    videoUrl: "XoybSPRL3pw",
  },
  {
    id: "4",
    name: "Anoop P Ambika",
    videoUrl: "UcAM0_Kgbn0",
  },
  {
    id: "5",
    name: "Dr P. K. Biju",
    videoUrl: "tvmqUINECCI",
  },
  {
    id: "6",
    name: "Dr RAJASREE M S",
    videoUrl: "Kx2lRDjzMMk",
  },
  {
    id: "7",
    name: "Google",
    videoUrl: "b7u86JWH6ww",
  },
  {
    id: "8",
    name: "Rajeev",
    videoUrl: "duM15-tOwFo",
  },
  {
    id: "9",
    name: "Sangeetha",
    videoUrl: "SyxOSPx4b5o",
  },
  {
    id: "10",
    name: "Joy Sebastian",
    videoUrl: "X79zbLQufl0",
  },
];

export const textTestimonials: TextTestimonial[] = [
  {
    id: "t1",
    name: "Anjali Nair",
    role: "Software Developer",
    company: "Tech Solutions Inc.",
    profileImage: "https://placehold.co/600x600/AF2EE6/ffffff.png?text=AN",
    quote:
      "The peer learning sessions at µLearn helped me transition from a beginner to a confident full-stack developer. The community support is incredible!",
    type: "learner",
    rating: 5,
    date: "2024-01-15",
    socialProof: "Posted on LinkedIn",
  },
  {
    id: "t2",
    name: "Dr. Rajesh Kumar",
    role: "Professor",
    company: "State University",
    profileImage: "https://placehold.co/600x600/666771/ffffff.png?text=RK",
    quote:
      "As an educator, I am impressed by how µLearn complements formal education. The hands-on projects give students real-world experience that classrooms cannot provide.",
    type: "mentor",
    rating: 5,
    date: "2024-01-10",
    socialProof: "Shared on Twitter",
  },
  {
    id: "t3",
    name: "Priya Sharma",
    role: "Product Manager",
    company: "StartUp Ventures",
    profileImage: "https://placehold.co/600x600/2E85FE/ffffff.png?text=PS",
    quote:
      "We hired three developers from µLearn and they have been exceptional. The platform truly prepares students for industry challenges.",
    type: "partner",
    rating: 5,
    date: "2024-01-08",
  },
  {
    id: "t4",
    name: "Karthik Menon",
    role: "AI Enthusiast",
    profileImage: "https://placehold.co/600x600/AF2EE6/ffffff.png?text=KM",
    quote:
      "The learning circles at µLearn helped me build my first ML project. The collaborative environment makes complex topics approachable.",
    type: "learner",
    rating: 5,
    date: "2024-01-05",
    socialProof: "Posted in Community",
  },
  {
    id: "t5",
    name: "Sarah Johnson",
    role: "HR Director",
    company: "Global Tech Corp",
    profileImage: "https://placehold.co/600x600/666771/ffffff.png?text=SJ",
    quote:
      "µLearn graduates bring fresh perspectives and strong fundamentals. They are our go-to talent pool for junior developer roles.",
    type: "partner",
    rating: 5,
    date: "2024-01-03",
  },
  {
    id: "t6",
    name: "Arun Patel",
    role: "Community Lead",
    company: "Developer Groups",
    profileImage: "https://placehold.co/600x600/2E85FE/ffffff.png?text=AP",
    quote:
      "The energy and enthusiasm in µLearn communities is contagious. It is amazing to see learners supporting each other grow.",
    type: "community-leader",
    rating: 5,
    date: "2024-01-01",
  },
];

export const testimonials = {
  video: videoTestimonials,
  text: textTestimonials,
};