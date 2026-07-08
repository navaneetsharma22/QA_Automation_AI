import React, { useEffect, useState } from "react";

/**
 * GradientOrb
 * Animated pulsing gradient orb (3 layered circles + soft glow + core sheen).
 * Works in both light and dark mode.
 *
 * Usage:
 *   <GradientOrb size={232} />                mode auto-detects system theme
 *   <GradientOrb size={232} mode="light" />    force light palette
 *   <GradientOrb size={232} mode="dark" />     force dark palette
 */

const PALETTES = {
  light: {
    ring1: { colors: ["#050a30", "#118dfa", "#11518e"], opacity: 0.12 },
    ring2: { colors: ["#050a30", "#4b70a2", "#0181fd"], opacity: 0.19 },
    core: ["#050a30", "#1a3262", "#57729f"],
    sheenOpacity: 0.35,
  },
  dark: {
    // Obsidian Glass (Monochrome Silver & Dark Charcoal)
    ring1: { colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"], opacity: 0.05 },
    ring2: { colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0"], opacity: 0.15 },
    core: ["#0A0A0A", "#171717", "#242424"],
    sheenOpacity: 0.6,
  },
};

function useAutoTheme(mode) {
  const [resolved, setResolved] = useState(
    mode === "auto"
      ? typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode
  );

  useEffect(() => {
    if (mode !== "auto") {
      setResolved(mode);
      return;
    }
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setResolved(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return resolved;
}

export default function GradientOrb({ size = 232, className = "", mode = "auto" }) {
  const theme = useAutoTheme(mode);
  const p = PALETTES[theme] ?? PALETTES.light;

  const uid = React.useId ? React.useId().replace(/:/g, "") : "orb";
  const ids = {
    ring1: `${uid}-ring1`,
    ring2: `${uid}-ring2`,
    core: `${uid}-core`,
    sheen: `${uid}-sheen`,
    glow: `${uid}-glow`,
  };

  return (
    <svg
      fill="none"
      height={size}
      width={size}
      viewBox="0 0 232 231"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <defs>
        <linearGradient id={ids.ring1} gradientUnits="userSpaceOnUse" spreadMethod="pad" x2="0" y2="96" x1="0" y1="-98">
          <stop offset="0%" stopColor={p.ring1.colors[0]} />
          <stop offset="50%" stopColor={p.ring1.colors[1]} />
          <stop offset="100%" stopColor={p.ring1.colors[2]} />
        </linearGradient>
        <linearGradient id={ids.ring2} gradientUnits="userSpaceOnUse" spreadMethod="pad" x2="0" y2="96" x1="0" y1="-98">
          <stop offset="0%" stopColor={p.ring2.colors[0]} />
          <stop offset="50%" stopColor={p.ring2.colors[1]} />
          <stop offset="100%" stopColor={p.ring2.colors[2]} />
        </linearGradient>
        <linearGradient id={ids.core} gradientUnits="userSpaceOnUse" spreadMethod="pad" x2="0" y2="96" x1="0" y1="-98">
          <stop offset="0%" stopColor={p.core[0]} />
          <stop offset="50%" stopColor={p.core[1]} />
          <stop offset="100%" stopColor={p.core[2]} />
        </linearGradient>
        <radialGradient id={ids.sheen} cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={p.sheenOpacity} />
          <stop offset="40%" stopColor="#ffffff" stopOpacity={p.sheenOpacity * 0.25} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Layer 1 - outer, slow big pulse */}
      <g opacity={p.ring1.opacity} filter={`url(#${ids.glow})`}>
        <g transform="translate(116,116)">
          <g transform="scale(1.19,1.19)">
            <animateTransform
              repeatCount="indefinite"
              type="scale"
              attributeName="transform"
              dur="2.736s"
              begin="0s"
              calcMode="spline"
              values="1.19 1.19; 0.27 0.27; 1.19 1.19; 1.19 1.19"
              keyTimes="0; 0.280488; 0.987805; 1"
              keySplines="0.39 0 0.833 1; 0.167 0 0 1; 0 0 1 1"
              fill="freeze"
            />
            <g transform="translate(0,1)">
              <g transform="matrix(1,0,0,1,0,-1)">
                <ellipse ry="96" rx="96" cy="0" cx="0" fill={`url(#${ids.ring1})`} />
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Layer 2 - mid pulse */}
      <g opacity={p.ring2.opacity} filter={`url(#${ids.glow})`}>
        <g transform="translate(116,116)">
          <g transform="scale(0.94,0.94)">
            <animateTransform
              repeatCount="indefinite"
              type="scale"
              attributeName="transform"
              dur="2.736s"
              begin="0s"
              calcMode="spline"
              values="0.94 0.94; 0.47 0.47; 0.94 0.94; 0.94 0.94; 0.94 0.94"
              keyTimes="0; 0.280488; 0.768293; 0.987805; 1"
              keySplines="0.39 0 0.833 1; 0.167 0 0.1 1; 0 0 1 1; 0 0 1 1"
              fill="freeze"
            />
            <g transform="translate(0,1)">
              <g transform="matrix(1,0,0,1,0,-1)">
                <ellipse ry="96" rx="96" cy="0" cx="0" fill={`url(#${ids.ring2})`} />
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Layer 3 - inner core + sheen */}
      <g>
        <g transform="translate(116,116)">
          <g transform="scale(0.64,0.64)">
            <animateTransform
              repeatCount="indefinite"
              type="scale"
              attributeName="transform"
              dur="2.736s"
              begin="0s"
              calcMode="spline"
              values="0.64 0.64; 0.46 0.46; 0.64 0.64; 0.64 0.64; 0.64 0.64"
              keyTimes="0; 0.280488; 0.548781; 0.987805; 1"
              keySplines="0.39 0 0.833 1; 0.167 0 0.1 1; 0.9 0 0.833 1; 0 0 1 1"
              fill="freeze"
            />
            <g transform="translate(0,1)">
              <g transform="matrix(1,0,0,1,0,-1)">
                <ellipse ry="96" rx="96" cy="0" cx="0" fill={`url(#${ids.core})`} />
                <ellipse ry="96" rx="96" cy="0" cx="0" fill={`url(#${ids.sheen})`} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
