import Benefits from "@/app/be-a-part/enablers/_components/Benefits";
import Colleges from "@/app/be-a-part/enablers/_components/Colleges";
import GetInTouch from "@/app/be-a-part/enablers/_components/GetInTouch";
import Hero from "@/app/be-a-part/enablers/_components/Hero";
import HowToBegin from "@/app/be-a-part/enablers/_components/HowToBegin";
import MissionAndGrowth from "@/app/be-a-part/enablers/_components/MissionAndGrowth";
import SuccessStories from "@/app/be-a-part/enablers/_components/SuccessStories";
import WhoIsEnabler from "@/app/be-a-part/enablers/_components/WhoIsEnabler";

export default function EnablersPage() {
  return (
    <main className="min-h-screen bg-mulearn-whitish">
      <Hero />
      <WhoIsEnabler />
      <Benefits />
      <Colleges />
      <SuccessStories />
      <MissionAndGrowth />
      <HowToBegin />
      <GetInTouch />
    </main>
  );
}
