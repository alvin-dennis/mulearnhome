import React from "react";
import Hero from "./_components/Hero";
import WhyCollaborate from "./_components/Collabrate";
import WhatYouCanDo from "./_components/Do";
import Gateway from "./_components/Gateway";
import HowToJoin from "./_components/Join";

export default function Company() {
  return (
    <div className="bg-white">
      <Hero />
      <WhyCollaborate />
      <WhatYouCanDo />
      <Gateway />
      <HowToJoin />
    </div>
  );
}
