import type { HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { MotionSection } from "./mu-framer";

interface SectionProps extends HTMLMotionProps<"section"> {
  variant?: "transparent" | "whitish" | "mulearn" | "gradient";
}

const bgClasses = {
  transparent: "bg-transparent",
  whitish: "bg-mulearn-whitish",
  mulearn: "bg-mulearn text-mulearn-whitish",
  gradient: "bg-linear-to-br from-mulearn-whitish via-mulearn-whitish to-mulearn-duke-purple/30",
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, variant = "transparent", ...props },
  ref,
) {
  return (
    <MotionSection
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden px-4 py-15 md:px-12 xl:px-16",
        bgClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </MotionSection>
  );
});
