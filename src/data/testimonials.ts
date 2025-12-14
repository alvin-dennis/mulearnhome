import type { TextTestimonial, VideoTestimonial } from "@/lib/types";

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
    name: "Ansan Johny",
    role: "Jnr Software Test Engineer",
    company: "FAYA",
    muid: "ansanjohny@mulearn",
    profileImage: "https://placehold.co/600x600/AF2EE6/ffffff.png?text=AJ",
    quote:
      "I was first drawn to µLearn seeing my seniors succeed during the pandemic, and my initial goal was simple: earn karma points. But it quickly became about so much more than points. The learning circles provided a collaborative space where I could consistently build real skills and develop a professional mindset. When I joined the Launchpad program, everything came together. The interview wasn't about what I knew, but what I had done. My 'proof of work, built entirely within the µLearn community, was the key that helped me land my current role. µLearn provided the ecosystem to turn learning into a career.",
    type: "learner",
    rating: 5,
    date: "2025-07-17",
    socialProof: "Posted on Instagram",
  },
  {
    id: "t2",
    name: "Aswanth V C",
    role: "Jnr Software Engineer",
    company: "FAYA",
    muid: "aswanthvc@mulearn",
    profileImage: "https://placehold.co/600x600/AF2EE6/ffffff.png?text=AV",
    quote:
      "My µLearn journey began at the GTA Codestorm hackathon, where I first discovered the community and the concept of karma points. I quickly got immersed in the Discord server, not just for the tasks, but for the late-night tech discussions and the connections I made. It became a space where someone was always ready to help whenever I got stuck. After college, Launchpad provided the perfect next step, and I began focusing my efforts on its tasks. That focus paid off, leading directly to interviews where my skills and even my karma points were valued, guiding me to my current role as a Junior Software Engineer.",
    type: "learner",
    rating: 5,
    date: "2025-07-18",
    socialProof: "Posted on Instagram",
  },
];

export const testimonials = {
  video: videoTestimonials,
  text: textTestimonials,
};
