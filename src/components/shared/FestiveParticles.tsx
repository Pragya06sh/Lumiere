"use client";

import { useEffect, useState } from "react";
import { festiveConfig } from "@/config/festive";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function FestiveParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!festiveConfig.enabled || !festiveConfig.particles.enabled) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const count = isMobile
      ? festiveConfig.particles.mobileCount
      : festiveConfig.particles.desktopCount;

    const colors = ["#d4a017", "#e8740c", "#ff4500", "#f5a623"];

    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 3 + 2, // 2px to 5px
      duration: Math.random() * 10 + 8, // 8s to 18s
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(generated);
  }, []);

  if (!mounted || !festiveConfig.enabled || particles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            bottom: `-${p.size * 2}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `ember-float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
