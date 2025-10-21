"use client";

import { MoveUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showButton) return null;
  return (
    <Link
      className="p-2 flex justify-center bg-mulearn-trusty-blue rounded-[140px] fixed bottom-10 right-10 cursor-pointer"
      href="#home"
    >
      <MoveUp className="w-10 h-9 text-mulearn-whitish" />
    </Link>
  );
}
