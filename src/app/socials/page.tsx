import type { Variants } from "framer-motion";
import Link from "next/link";
import { MotionDiv, MotionSection } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { socialLinks } from "@/data/links";
import type { SocialLinks } from "@/lib/types";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function getBentoSize(index: number): string {
  switch (index) {
    case 0:
      return "lg:col-span-2 lg:row-span-1"; // Wide card top-left
    case 10:
      return "lg:col-span-1 lg:row-span-2"; // Tall card right
    case 11:
      return "lg:col-span-3 lg:row-span-1"; // Wide card bottom
    default:
      return "lg:col-span-1 lg:row-span-1"; // Standard cards
  }
}
function SocialCard({ social, className }: { social: SocialLinks; className?: string }) {
  const Icon = social.icon;
  return (
    <MotionDiv variants={cardVariants} className={cn("h-full", className)}>
      <Link href={social.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Card
          variant="interactive"
          className={cn(
            "group relative h-full overflow-hidden rounded-xl p-6",
            "transition-all duration-300",
            social.hoverColor,
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5",
              social.color,
            )}
          />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <MotionDiv
                transition={{ type: "spring", stiffness: 300 }}
                className={cn("mb-4 inline-flex rounded-lg p-3 text-2xl", social.iconBg)}
              >
                <Icon className="text-mulearn-whitish" />
              </MotionDiv>

              <h3 className="text-md font-semibold text-mulearn">{social.title}</h3>

              {social.subtitle && (
                <p className="mt-1 text-xs text-muted-foreground">{social.subtitle}</p>
              )}
            </div>
            {social.action && (
              <Link href={social.href} target="_blank" rel="noopener noreferrer">
                <Button variant={"default"} className="mt-4 w-full font-semibold">
                  {social.action === "follow" ? "Follow" : "Subscribe"}
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </Link>
    </MotionDiv>
  );
}

export default function Socials() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20 space-y-14">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h1>
            <span className="text-mulearn">µLearn</span> Social Links
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Explore the universe of creativity with us! Ideas flourish on this peer-group platform.
            Together, let&apos;s construct! 🎐
          </p>
        </MotionDiv>
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
          <MotionSection
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <MotionDiv variants={fadeInUp} className="space-y-3">
              <h2>Official Channels</h2>
              <p className="text-sm text-muted-foreground">
                Connect with us across all major social media platforms
              </p>
            </MotionDiv>
            <MotionDiv
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]"
            >
              {socialLinks.socials.map((social, index) => (
                <SocialCard
                  key={social.title}
                  social={social}
                  className={cn(getBentoSize(index))}
                />
              ))}
            </MotionDiv>
          </MotionSection>
          <MotionSection
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <MotionDiv variants={fadeInUp} className="space-y-3">
              <h2>Our Website</h2>
              <p className="text-sm text-muted-foreground">
                Visit our official website to learn more
              </p>
            </MotionDiv>
            <MotionDiv variants={container} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.website.map((social) => (
                <div key={social.title} className="lg:col-span-2 h-full">
                  <SocialCard social={social} />
                </div>
              ))}
            </MotionDiv>
          </MotionSection>
          <MotionSection
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <MotionDiv variants={fadeInUp} className="space-y-3">
              <h2>Build & Contribute</h2>
              <p className="text-sm text-muted-foreground">
                Join our community developers and creators
              </p>
            </MotionDiv>
            <MotionDiv variants={container} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.build.map((social) => (
                <SocialCard key={social.title} social={social} />
              ))}
            </MotionDiv>
          </MotionSection>
        </main>
      </div>
    </div>
  );
}
