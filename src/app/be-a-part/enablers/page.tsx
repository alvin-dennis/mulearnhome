import Benefits from "@/app/be-a-part/enablers/_components/Benefits";
import Hero from "@/app/be-a-part/enablers/_components/Hero";
import Onboarding from "@/app/be-a-part/enablers/_components/Onboarding";
import Programs from "@/app/be-a-part/enablers/_components/Programs";
import WhoIsEnabler from "@/app/be-a-part/enablers/_components/WhoIsEnabler";

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
