"use client";

import { useState, useEffect } from "react";
import { Sparkles, Flame } from "lucide-react";

export function SpiralFlameAnimation() {
  const [angle, setAngle] = useState(0);
  const [sparkleVisible, setSparkleVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => {
        const next = (prev + 1.5) % 360;
        // Trigger soft sparkle briefly when completing full circle
        if (next > 340 || next < 20) {
          setSparkleVisible(true);
        } else {
          setSparkleVisible(false);
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Radius for outer circumference orbit
  const r = 68;
  const rad = (angle * Math.PI) / 180;
  const cx = 90 + r * Math.cos(rad);
  const cy = 90 + r * Math.sin(rad);

  return (
    <div className="bg-[#1A0F0A] border border-[#D9A441]/30 rounded-[24px] p-5 sm:p-6 text-[#F8EFE6] flex flex-col sm:flex-row items-center gap-6 shadow-sm overflow-hidden">
      {/* SVG Animation Graphic */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="w-full h-full select-none">
          <defs>
            <radialGradient id="waxGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2A1B15" />
              <stop offset="85%" stopColor="#1A0F0A" />
              <stop offset="100%" stopColor="#D9A441" stopOpacity="0.4" />
            </radialGradient>
            <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Candle Round Outer Body */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="url(#waxGlow)"
            stroke="#D9A441"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />

          {/* Inner Wax Basin */}
          <circle
            cx="90"
            cy="90"
            r="52"
            fill="#120A07"
            stroke="#D9A441"
            strokeWidth="0.5"
            opacity="0.4"
          />

          {/* Sealed Center Core (Keepsake hidden inside — gift is NOT shown) */}
          <circle
            cx="90"
            cy="90"
            r="26"
            fill="#241510"
            stroke="#D9A441"
            strokeWidth="1"
            opacity="0.6"
          />
          <text
            x="90"
            y="94"
            textAnchor="middle"
            fill="#D9A441"
            fontSize="8"
            letterSpacing="0.15em"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            opacity="0.75"
          >
            W&amp;W
          </text>

          {/* Travelling Flame on the Rim */}
          <g transform={`translate(${cx}, ${cy})`} filter="url(#flameGlow)">
            {/* Outer flame aura */}
            <circle cx="0" cy="0" r="8" fill="#F28A3D" opacity="0.3" />
            {/* Core teardrop flame */}
            <path
              d="M0,-8 C3,-4 4,-1 3,2 C2,5 -2,5 -3,2 C-4,-1 -3,-4 0,-8 Z"
              fill="#FFBD59"
            />
            <circle cx="0" cy="1" r="2" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>

        {/* Soft Sparkle Indicator when circle finishes */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            sparkleVisible ? "opacity-100 scale-110" : "opacity-0 scale-90"
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#D9A441] animate-pulse" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#241510] text-[#D9A441] border border-[#D9A441]/30 font-medium">
          <Flame className="w-3 h-3 text-[#D9A441]" />
          Signature Turkish Spiral Burn
        </span>
        <h4
          className="text-lg font-serif font-medium text-[#F8EFE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Edge-Wick Journey
        </h4>
        <p className="text-xs text-[#CDB8A6] leading-relaxed">
          Light the artisanal wick placed on the carved rim. The flame journeys slowly around the perimeter, casting a hypnotic dance of candlelight until your sealed keepsake treasure is discovered.
        </p>
        <p className="text-[11px] text-[#D9A441]/80 italic">
          Keepsake sealed in an industrial heat-safe pouch at the base.
        </p>
      </div>
    </div>
  );
}

