import Community from "@/app/(home)/_components/Community";
import Comparison from "@/app/(home)/_components/Comparison";
import Features from "@/app/(home)/_components/Features";
import Hero from "@/app/(home)/_components/Hero";
import Newsletter from "@/app/(home)/_components/Newsletter";
import Opportunities from "@/app/(home)/_components/Opportunities";
import Roles from "@/app/(home)/_components/Roles";
import SpecialEvents from "@/app/(home)/_components/SpecialEvents";
import Stats from "@/app/(home)/_components/Stats";
import Story from "@/app/(home)/_components/Story";

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
