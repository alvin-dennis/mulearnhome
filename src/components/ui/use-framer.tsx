"use client";

import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

const Motiondiv = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  function MotionDiv({ children, ...props }, ref) {
    return (
      <Motiondiv ref={ref} {...props}>
        {children}
      </Motiondiv>
    );
  }
);

const Motionsection = React.forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  function MotionSection({ children, ...props }, ref) {
    return (
      <Motionsection ref={ref} {...props}>
        {children}
      </Motionsection>
    );
  }
);

const Motionheader = React.forwardRef<HTMLElement, HTMLMotionProps<"header">>(
  function MotionHeader({ children, ...props }, ref) {
    return (
      <Motionheader ref={ref} {...props}>
        {children}
      </Motionheader>
    );
  }
);

const Motionh1 = React.forwardRef<HTMLHeadingElement, HTMLMotionProps<"h1">>(
  function MotionH1({ children, ...props }, ref) {
    return (
      <Motionh1 ref={ref} {...props}>
        {children}
      </Motionh1>
    );
  }
);

const Motionh2 = React.forwardRef<HTMLHeadingElement, HTMLMotionProps<"h2">>(
  function MotionH2({ children, ...props }, ref) {
    return (
      <Motionh2 ref={ref} {...props}>
        {children}
      </Motionh2>
    );
  }
);

const Motionp = React.forwardRef<HTMLParagraphElement, HTMLMotionProps<"p">>(
  function MotionP({ children, ...props }, ref) {
    return (
      <Motionp ref={ref} {...props}>
        {children}
      </Motionp>
    );
  }
);

const Motionnav = React.forwardRef<HTMLElement, HTMLMotionProps<"nav">>(
  function MotionNav({ children, ...props }, ref) {
    return (
      <Motionnav ref={ref} {...props}>
        {children}
      </Motionnav>
    );
  }
);

const Motionbq = React.forwardRef<
  HTMLQuoteElement,
  HTMLMotionProps<"blockquote">
>(function MotionBlockquote({ children, ...props }, ref) {
  return (
    <Motionbq ref={ref} {...props}>
      {children}
    </Motionbq>
  );
});

const Motionbutton = React.forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(function MotionButton({ children, ...props }, ref) {
  return (
    <Motionbutton ref={ref} {...props}>
      {children}
    </Motionbutton>
  );
});

const Motionfooter = React.forwardRef<HTMLElement, HTMLMotionProps<"footer">>(
  function MotionFooter({ children, ...props }, ref) {
    return (
      <motion.footer ref={ref} {...props}>
        {children}
      </motion.footer>
    );
  }
);

export {
  Motiondiv,
  Motionsection,
  Motionheader,
  Motionh1,
  Motionh2,
  Motionp,
  Motionnav,
  Motionbq,
  Motionbutton,
  Motionfooter,
};
