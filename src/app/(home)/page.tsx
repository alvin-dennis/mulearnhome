import dynamic from "next/dynamic";
import Features from "@/app/(home)/_components/Features";
import Hero from "@/app/(home)/_components/Hero";
import Story from "@/app/(home)/_components/Story";

// Lazy load below-fold components for better initial page load
// SEO-safe: Next.js dynamic imports don't affect SSR, crawlers see all content
const SpecialEvents = dynamic(() => import("@/app/(home)/_components/SpecialEvents"));
const Comparison = dynamic(() => import("@/app/(home)/_components/Comparison"));
const Opportunities = dynamic(() => import("@/app/(home)/_components/Opportunities"));
const Roles = dynamic(() => import("@/app/(home)/_components/Roles"));
const Stats = dynamic(() => import("@/app/(home)/_components/Stats"));
const Community = dynamic(() => import("@/app/(home)/_components/Community"));
const Newsletter = dynamic(() => import("@/app/(home)/_components/Newsletter"));

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Story />
      <SpecialEvents />
      <Comparison />
      <Opportunities />
      <Roles />
      <Stats />
      <Community />
      <Newsletter />
    </div>
  );
};

export default Home;
