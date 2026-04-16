import CTA from "@/app/be-a-part/learners/_components/CTA";
import Hero from "@/app/be-a-part/learners/_components/Hero";
import Intro from "@/app/be-a-part/learners/_components/Intro";
import Onboarding from "@/app/be-a-part/learners/_components/Onboarding";
import Ranking from "@/app/be-a-part/learners/_components/Ranking";
import Status from "@/app/be-a-part/learners/_components/Status";
import WhatYouGet from "@/app/be-a-part/learners/_components/WhatYouGet";
import WhyKarmaPoints from "@/app/be-a-part/learners/_components/WhyKarmaPoints";
import WhyMuLearn from "@/app/be-a-part/learners/_components/WhyMuLearn";

import { onboardingSteps } from "@/data/learners";

export default function LearnersPage() {
  return (
    <main className="min-h-screen ">
      <section id="hero">
        <Hero />
      </section>
      <section id="learner-intro" className="pt-12 md:pt-16">
        <Intro />
      </section>
      <section id="why-mulearn" className="pt-12 md:pt-16">
        <WhyMuLearn />
      </section>
      <section id="rankings" className="py-12 md:py-16">
        <Ranking />
      </section>
      <section id="what-you-get" className="py-12 md:py-16">
        <WhatYouGet />
      </section>
      <section id="why-karma-points" className="py-12 md:py-16">
        <WhyKarmaPoints />
      </section>
      <section id="onboarding" className="py-12 md:py-16 container mx-auto px-4">
        <h2 className="text-center mb-8 md:mb-12 text-4xl md:text-5xl font-bold">
          How to Begin Your Journey
        </h2>
        <Onboarding data={onboardingSteps} />
      </section>
      <section id="learners-status" className="py-12 md:py-16">
        <Status />
      </section>
      <section id="final-cta" className="py-12 md:py-16">
        <CTA />
      </section>
    </main>
  );
}
