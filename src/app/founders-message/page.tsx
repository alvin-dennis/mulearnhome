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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FoundersMessage() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-mulearn-whitish overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        {/* Header / Title */}
        <MotionDiv variants={fadeInUp} className="mb-16 md:mb-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-mulearn/10 text-mulearn font-bold text-sm uppercase tracking-widest rounded-full mb-6">
            Founders Message
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-mulearn-blackish tracking-tight leading-[1.1]">
            A Message to the World
          </h1>
        </MotionDiv>

        {/* Main Content */}
        <MotionDiv
          variants={fadeInUp}
          className="prose prose-lg md:prose-xl prose-slate max-w-none text-mulearn-gray-600 leading-relaxed"
        >
          <p className="text-xl md:text-2xl font-medium text-mulearn-blackish mb-10 leading-relaxed">
            μLearn was not born out of policy, funding, or disruption theatre. It was born out of a
            simple discomfort—the quiet but persistent feeling that we are wasting human potential
            at scale.
          </p>

          <p className="mb-8">
            Across classrooms, offices, institutions, and communities, we prepare people for a world
            that no longer exists. We reward compliance over curiosity, credentials over competence,
            obedience over ownership. We ask young people to memorize answers while the world is
            screaming for problem solvers. We ask organizations to hire talent, then slowly drain
            the life out of it. We ask governments to future-proof nations using systems designed
            for the past.
          </p>

          <p className="text-mulearn font-bold text-2xl md:text-3xl my-10 border-l-4 border-mulearn pl-6">
            μLearn exists to interrupt this pattern.
          </p>

          <p className="mb-8">
            At its core, μLearn is not a platform. It is a belief system made operational. A belief
            that learning is not something delivered—it is something activated. A belief that talent
            is universal, but opportunity, context, and confidence are not. A belief that motivation
            cannot be commanded—it must be designed for. And a belief that the future will not be
            built by institutions alone, but by empowered individuals connected through purpose.
          </p>

          {/* Stakeholder Messages */}
          <div className="my-16 space-y-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-mulearn-gray-200">
              <p className="font-bold text-lg text-mulearn-blackish mb-3 flex items-center gap-2">
                <span className="text-mulearn text-2xl">→</span> To students,
              </p>
              <p className="text-base md:text-lg pl-8 text-mulearn-gray-600">
                μLearn exists to return something that was taken away early—agency. You are not here
                to fit into predefined roles. You are here to explore, to build, to fail safely, to
                find your edge, and to contribute before you are "ready." Your curiosity is not a
                distraction. It is your signal.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-mulearn-gray-200">
              <p className="font-bold text-lg text-mulearn-blackish mb-3 flex items-center gap-2">
                <span className="text-mulearn-duke-purple text-2xl">→</span> To industry,
              </p>
              <p className="text-base md:text-lg pl-8 text-mulearn-gray-600">
                μLearn exists as a mirror and an invitation. The skills you seek cannot be
                manufactured through hiring alone. They must be cultivated through ecosystems that
                reward learning, collaboration, and real-world contribution. μLearn connects you not
                to resumes, but to capability in motion.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-mulearn-gray-200">
              <p className="font-bold text-lg text-mulearn-blackish mb-3 flex items-center gap-2">
                <span className="text-mulearn-trusty-blue text-2xl">→</span> To governments,
              </p>
              <p className="text-base md:text-lg pl-8 text-mulearn-gray-600">
                μLearn exists as a public good. A living infrastructure for skills, motivation, and
                civic capability. Not another program layered onto an overloaded system, but a
                protocol that allows learning to happen anywhere, anytime, driven by communities and
                aligned with national priorities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-mulearn-gray-200">
              <p className="font-bold text-lg text-mulearn-blackish mb-3 flex items-center gap-2">
                <span className="text-mulearn-gray-500 text-2xl">→</span> To NGOs and civil society,
              </p>
              <p className="text-base md:text-lg pl-8 text-mulearn-gray-600">
                μLearn exists as leverage. A way to scale impact by empowering people not just to
                receive help, but to develop agency, skills, and dignity through contribution.
              </p>
            </div>
          </div>

          <p className="mb-6">
            I serve μLearn not as its owner, but as its chief volunteer. Because movements like this
            do not belong to founders. They belong to the people who show up, learn out loud, build
            in public, and pull others forward with them.
          </p>

          <div className="font-bold text-mulearn-blackish text-xl md:text-2xl space-y-2 mb-12">
            <p>The future will not be shaped by those who wait for permission.</p>
            <p>
              It will be shaped by those who learn continuously, act responsibly, and collaborate
              generously.
            </p>
            <p className="text-mulearn pt-4">μLearn exists to make that future inevitable.</p>
          </div>

          <div className="bg-gradient-to-r from-mulearn/5 to-mulearn-duke-purple/5 rounded-2xl p-10 mb-16 border border-mulearn/10">
            <p className="text-mulearn-gray-600 italic text-xl mb-4 font-serif">
              "This is not an invitation to join a platform. It is a call to participate in a
              learning civilization."
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="text-mulearn-blackish font-bold text-2xl md:text-3xl">
                Welcome to
              </span>
              <MuImage
                src="/assets/logo-black.png"
                alt="μLearn"
                width={70}
                height={10}
                className="h-6 md:h-8 w-auto object-contain"
              />
            </div>
          </div>
        </MotionDiv>

        {/* Signature / Founder Profile */}
        <MotionDiv
          variants={fadeInUp}
          className="flex items-center gap-6 pt-8 border-t border-mulearn-gray-200"
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
            <MuImage
              src="/assets/founders-message/deepu-s-nath.jpg"
              alt="Deepu S Nath"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-mulearn-blackish text-xl">Deepu S Nath</h3>
            <p className="text-mulearn font-medium">Chief Volunteer</p>
            <Link
              href="https://deepusnath.com"
              target="_blank"
              className="text-mulearn-gray-400 text-sm hover:text-mulearn transition-colors block mt-1"
            >
              deepusnath.com
            </Link>
            <p className="text-mulearn-gray-500 text-sm">Mulearn Foundation</p>
          </div>
        </MotionDiv>

        {/* CTA */}
        <MotionDiv variants={fadeInUp} className="mt-20 text-center">
          <Link href="https://app.mulearn.org" target="_blank" rel="noreferrer">
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Join the Movement
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}
