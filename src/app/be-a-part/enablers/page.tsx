import Hero from "@/app/be-a-part/enablers/_components/Hero";
import WhoIsEnabler from "@/app/be-a-part/enablers/_components/WhoIsEnabler";
import Benefits from "@/app/be-a-part/enablers/_components/Benefits";
import Programs from "@/app/be-a-part/enablers/_components/Programs";
import Onboarding from "@/app/be-a-part/enablers/_components/Onboarding";

export default function EnablersPage() {
  return (
    <main className="min-h-screen bg-mulearn-whitish">
      <Hero />
      <WhoIsEnabler />
      <Benefits />
      <Programs />
      <Onboarding />
    </main>
  );
}