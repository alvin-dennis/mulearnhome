"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MuImage from '@/components/MuImage';

const floatingAssets = [
  { src: '/assets/levelstructure/rocket.svg', name: 'rocket', size: 60 },
  { src: '/assets/levelstructure/ufo.svg', name: 'ufo', size: 55 },

  { src: '/assets/levelstructure/rocket.svg', name: 'rocket2', size: 50 },
  { src: '/assets/levelstructure/ufo.svg', name: 'ufo2', size: 45 },
 
];

const getRandomAnimation = () => {
  const duration = 15 + Math.random() * 25;
  const delay = Math.random() * 5;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const endX = Math.random() * 100;
  const endY = Math.random() * 100;
  
  return {
    initial: {
      x: `${startX}vw`,
      y: `${startY}vh`,
      opacity: 0.5 + Math.random() * 0.2,
      rotate: Math.random() * 360,
    },
    animate: {
      x: [
        `${startX}vw`,
        `${endX}vw`,
        `${startX}vw`,
      ],
      y: [
        `${startY}vh`,
        `${endY}vh`,
        `${startY}vh`,
      ],
      opacity: [
        0.5 + Math.random() * 0.2,
        0.6 + Math.random() * 0.2,
        0.5 + Math.random() * 0.2,
      ],
      rotate: [0, 360, 720],
    },
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: "linear" as const,
    },
  };
};

export default function FloatingSpaceAssets() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {floatingAssets.map((asset, index) => {
        const animation = getRandomAnimation();
        
        return (
          <motion.div
            key={`${asset.name}-${index}`}
            className="absolute"
            initial={animation.initial}
            animate={animation.animate}
            transition={animation.transition}
            style={{
              width: `${asset.size}px`,
              height: `${asset.size}px`,
              willChange: 'transform, opacity',
            }}
          >
            <MuImage
              src={asset.src}
              alt={asset.name}
              width={asset.size}
              height={asset.size}
              className="w-full h-full object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
