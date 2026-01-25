"use client";

import type { Variants } from "framer-motion";
import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function FoundersMessage() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Hero Section - Dark */}
      <section className="relative bg-mulearn-blackish overflow-hidden">
        {/* Large FOUNDER Text */}
        <MotionDiv
          variants={fadeIn}
          className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden"
        >
          <h1
            className="text-[18vw] md:text-[14vw] font-black tracking-tight leading-none text-mulearn-trusty-blue"
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            FOUNDER
          </h1>
        </MotionDiv>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-end">
            {/* Founder Image */}
            <MotionDiv variants={scaleIn} className="w-full lg:w-1/2">
              <div className="relative aspect-4/5 max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg">
                <MuImage
                  src="/assets/founders-message/deepu-s-nath.jpg"
                  alt="Deepu S Nath - Chief Volunteer, Mulearn Foundation"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover object-top"
                  preload
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-mulearn-blackish/60 via-transparent to-transparent" />
              </div>
            </MotionDiv>

            {/* Meet The Founder */}
            <MotionDiv variants={fadeInUp} className="w-full lg:w-1/2 text-right lg:pb-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Meet The Founder</h2>
              <div className="flex items-center gap-4 justify-end">
                <div>
                  <p className="text-white font-bold text-xl md:text-2xl">Deepu S Nath</p>
                  <p className="text-mulearn-trusty-blue font-semibold">Chief Volunteer</p>
                  <p className="text-mulearn-greyish">Mulearn Foundation</p>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Message Section - Light */}
      <section className="bg-mulearn-whitish py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Title */}
          <MotionDiv
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-2 bg-mulearn/10 text-mulearn font-semibold text-sm uppercase tracking-wider rounded-full mb-6">
              A Message to the World
            </span>
          </MotionDiv>

          {/* Message Content */}
          <MotionDiv
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="prose prose-lg md:prose-xl max-w-none"
          >
            <p className="text-mulearn-gray-600 leading-relaxed mb-8 text-lg md:text-xl">
              μLearn was not born out of policy, funding, or disruption theatre. It was born out of
              a simple discomfort—the quiet but persistent feeling that we are wasting human
              potential at scale.
            </p>

            <p className="text-mulearn-gray-600 leading-relaxed mb-8">
              Across classrooms, offices, institutions, and communities, we prepare people for a
              world that no longer exists. We reward compliance over curiosity, credentials over
              competence, obedience over ownership. We ask young people to memorize answers while
              the world is screaming for problem solvers. We ask organizations to hire talent, then
              slowly drain the life out of it. We ask governments to future-proof nations using
              systems designed for the past.
            </p>

            <p className="text-mulearn font-semibold text-xl md:text-2xl mb-8">
              μLearn exists to interrupt this pattern.
            </p>

            <p className="text-mulearn-gray-600 leading-relaxed mb-8">
              At its core, μLearn is not a platform. It is a belief system made operational. A
              belief that learning is not something delivered—it is something activated. A belief
              that talent is universal, but opportunity, context, and confidence are not. A belief
              that motivation cannot be commanded—it must be designed for. And a belief that the
              future will not be built by institutions alone, but by empowered individuals connected
              through purpose.
            </p>

            {/* Stakeholder Messages */}
            <div className="my-16 space-y-12">
              <div>
                <p className="flex items-center gap-3 text-mulearn-blackish font-semibold text-lg mb-3">
                  <span className="text-mulearn">→</span> To students,
                </p>
                <p className="text-mulearn-gray-600 leading-relaxed pl-7">
                  μLearn exists to return something that was taken away early—agency. You are not
                  here to fit into predefined roles. You are here to explore, to build, to fail
                  safely, to find your edge, and to contribute before you are "ready." Your
                  curiosity is not a distraction. It is your signal.
                </p>
              </div>

              <div>
                <p className="flex items-center gap-3 text-mulearn-blackish font-semibold text-lg mb-3">
                  <span className="text-mulearn-duke-purple">→</span> To industry,
                </p>
                <p className="text-mulearn-gray-600 leading-relaxed pl-7">
                  μLearn exists as a mirror and an invitation. The skills you seek cannot be
                  manufactured through hiring alone. They must be cultivated through ecosystems that
                  reward learning, collaboration, and real-world contribution. μLearn connects you
                  not to resumes, but to capability in motion.
                </p>
              </div>

              <div>
                <p className="flex items-center gap-3 text-mulearn-blackish font-semibold text-lg mb-3">
                  <span className="text-mulearn-trusty-blue">→</span> To governments,
                </p>
                <p className="text-mulearn-gray-600 leading-relaxed pl-7">
                  μLearn exists as a public good. A living infrastructure for skills, motivation,
                  and civic capability. Not another program layered onto an overloaded system, but a
                  protocol that allows learning to happen anywhere, anytime, driven by communities
                  and aligned with national priorities.
                </p>
              </div>

              <div>
                <p className="flex items-center gap-3 text-mulearn-blackish font-semibold text-lg mb-3">
                  <span className="text-mulearn-gray-600">→</span> To NGOs and civil society,
                </p>
                <p className="text-mulearn-gray-600 leading-relaxed pl-7">
                  μLearn exists as leverage. A way to scale impact by empowering people not just to
                  receive help, but to develop agency, skills, and dignity through contribution.
                </p>
              </div>
            </div>

            <p className="text-mulearn-gray-600 leading-relaxed mb-8">
              I serve μLearn not as its owner, but as its chief volunteer. Because movements like
              this do not belong to founders. They belong to the people who show up, learn out loud,
              build in public, and pull others forward with them.
            </p>

            <p className="text-mulearn-blackish font-semibold text-lg md:text-xl mb-4">
              The future will not be shaped by those who wait for permission.
            </p>
            <p className="text-mulearn-blackish font-semibold text-lg md:text-xl mb-8">
              It will be shaped by those who learn continuously, act responsibly, and collaborate
              generously.
            </p>

            <p className="text-mulearn font-bold text-xl md:text-2xl mb-12">
              μLearn exists to make that future inevitable.
            </p>

            <div className="bg-gradient-to-r from-mulearn/5 to-mulearn-duke-purple/5 rounded-xl p-8 mb-12">
              <p className="text-mulearn-gray-600 italic text-lg mb-2">
                This is not an invitation to join a platform.
              </p>
              <p className="text-mulearn-blackish font-bold text-xl md:text-2xl">
                It is a call to participate in a learning civilization.
              </p>
            </div>

            <p className="text-mulearn font-bold text-2xl md:text-3xl mb-12">Welcome to μLearn.</p>
          </MotionDiv>

          {/* CTA */}
          <MotionDiv
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="https://app.mulearn.org" target="_blank" rel="noreferrer">
              <Button variant="default" className="px-8 py-3 text-lg">
                Join μLearn
              </Button>
            </Link>
          </MotionDiv>
        </div>
      </section>
    </MotionDiv>
  );
}
