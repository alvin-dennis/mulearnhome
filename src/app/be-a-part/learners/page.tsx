import CompanyPartners from "@/app/be-a-part/company/components/Partners";
import FinalCTA from "@/app/be-a-part/learners/_components/FinalCTA";
import LearnerIntro from "@/app/be-a-part/learners/_components/LearnerIntro";
import LearnersHero from "@/app/be-a-part/learners/_components/LearnersHero";
import LearnersStatus from "@/app/be-a-part/learners/_components/LearnersStatus";
import OnboardingSteps from "@/app/be-a-part/learners/_components/OnboardingSteps";
import RankingSection from "@/app/be-a-part/learners/_components/RankingSection";
// import Testimonials from "@/app/be-a-part/learners/_components/Testimonials";
import WhatYouGet from "@/app/be-a-part/learners/_components/WhatYouGet";
import WhyKarmaPoints from "@/app/be-a-part/learners/_components/WhyKarmaPoints";
import WhyMuLearn from "@/app/be-a-part/learners/_components/WhyMuLearn";

import { onboardingSteps } from "@/data/learners";

export default function LearnersPage() {
  return (
    <main className="min-h-screen ">
      <section id="hero">
        <LearnersHero />
      </section>
      <section id="learner-intro" className="pt-12 md:pt-16">
        <LearnerIntro />
      </section>
      <section id="why-mulearn" className="pt-12 md:pt-16">
        <WhyMuLearn />
      </section>
      {/* <section id="testimonials" className="pt-12 md:pt-16 pb-12 md:pb-16">
        <Testimonials />
      </section> */}
      <section id="rankings" className="py-12 md:py-16">
        <RankingSection />
      </section>
      <section id="what-you-get" className="py-12 md:py-16">
        <WhatYouGet />
      </section>
      <section id="company-partners" className="py-12 md:py-16">
        <CompanyPartners />
      </section>
      <section id="why-karma-points" className="py-12 md:py-16">
        <WhyKarmaPoints />
      </section>
      <section id="onboarding" className="py-12 md:py-16 container mx-auto px-4">
        <h2 className="text-center mb-8 md:mb-12 text-4xl md:text-5xl font-bold text-black">
          How to Begin Your Journey
        </h2>
        <OnboardingSteps data={onboardingSteps} />
      </section>
      <section id="learners-status" className="py-12 md:py-16">
        <LearnersStatus />
      </section>
      <section id="final-cta" className="py-12 md:py-16">
        <FinalCTA />
      </section>
    </main>
  );
}
