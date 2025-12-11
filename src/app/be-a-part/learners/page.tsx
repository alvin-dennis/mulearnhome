import LearnerIntro from "@/app/be-a-part/learners/_components/LearnerIntro";
import LearnersHero from "@/app/be-a-part/learners/_components/LearnersHero";
import RankingSection from "@/app/be-a-part/learners/_components/RankingSection";
import OnboardingSteps from "@/app/be-a-part/learners/_components/OnboardingSteps";
import Testimonials from "@/app/be-a-part/learners/_components/Testimonials";

import { learnerIdentityTags, onboardingSteps } from "@/data/learners";

export default function LearnersPage() {
  return (
    <main className="min-h-screen">
      <section id="hero">
        <LearnersHero />
      </section>
      <section id="learner-intro" className="pt-12 md:pt-16">
        <LearnerIntro learnerTags={learnerIdentityTags} />
      </section>
      <section id="testimonials" className="pt-12 md:pt-16 pb-12 md:pb-16">
        <Testimonials />
      </section>
      <section id="rankings" className="py-12 md:py-16">
        <RankingSection />
      </section>
      <section id="onboarding" className="py-12 md:py-16 container mx-auto px-4">
        <h2 className="text-center mb-8 md:mb-12">
          Onboarding <span className="text-mulearn-trusty-blue">Process</span>
        </h2>
        <OnboardingSteps data={onboardingSteps} />
      </section>
    </main>
  );
}
