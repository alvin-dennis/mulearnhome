import Activities from "@/app/be-a-part/campus/_components/Activities";
import Apply from "@/app/be-a-part/campus/_components/Apply";
import BestPractice from "@/app/be-a-part/campus/_components/BestPractices";
import Hero from "@/app/be-a-part/campus/_components/Hero";
import Journey from "@/app/be-a-part/campus/_components/Journey";
import Quote from "@/app/be-a-part/campus/_components/Quote";
import Structure from "@/app/be-a-part/campus/_components/Structure";
import WhyChapter from "@/app/be-a-part/campus/_components/Why";

export default function CampusChapter() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyChapter />
      <Structure />
      <Activities />
      <Journey />
      <BestPractice />
      <Quote />
      <Apply />
    </div>
  );
}
