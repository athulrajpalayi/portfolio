"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const ringX = useSpring(mx, { stiffness: 200, damping: 24, mass: 0.3 });
  const ringY = useSpring(my, { stiffness: 200, damping: 24, mass: 0.3 });
  const dotX = useSpring(mx, { stiffness: 900, damping: 30, mass: 0.08 });
  const dotY = useSpring(my, { stiffness: 900, damping: 30, mass: 0.08 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setHovering(
        !!el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex="0"]')
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
    };
  }, [mx, my]);

  if (!mounted) return null;

  const ringSize = clicking ? 18 : hovering ? 44 : 30;
  const glowPx = hovering ? 16 : 8;
  const borderAlpha = hovering ? 0.85 : 0.55;
  const glowAlpha = hovering ? 0.5 : 0.2;

  return (
    <>
      {/* Outer crosshair ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          width: ringSize,
          height: ringSize,
          border: `1px solid rgba(40,240,211,${borderAlpha})`,
          boxShadow: `0 0 ${glowPx}px rgba(40,240,211,${glowAlpha}), 0 0 ${glowPx * 2}px rgba(40,240,211,${glowAlpha * 0.45})`,
          transition: "width 180ms ease, height 180ms ease, opacity 200ms ease",
        }}
      >
        {/* Crosshair arms */}
        <div style={{ position: "absolute", top: "50%", left: -9, width: 5, height: 1, backgroundColor: `rgba(40,240,211,${borderAlpha})`, transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", top: "50%", right: -9, width: 5, height: 1, backgroundColor: `rgba(40,240,211,${borderAlpha})`, transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: -9, height: 5, width: 1, backgroundColor: `rgba(40,240,211,${borderAlpha})`, transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", bottom: -9, height: 5, width: 1, backgroundColor: `rgba(40,240,211,${borderAlpha})`, transform: "translateX(-50%)" }} />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible && !hovering ? 1 : 0,
          width: clicking ? 3 : 5,
          height: clicking ? 3 : 5,
          backgroundColor: "rgb(40,240,211)",
          boxShadow: "0 0 6px rgba(40,240,211,0.9)",
          transition: "width 120ms ease, height 120ms ease, opacity 180ms ease",
        }}
      />
    </>
  );
}
