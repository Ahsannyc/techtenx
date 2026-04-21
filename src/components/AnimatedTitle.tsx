'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    });
  }, []);

  return (
    <h1 ref={titleRef} className={className}>
      {children}
    </h1>
  );
}
