"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MouseLight() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, { stiffness: 48, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 48, damping: 18, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: 720,
        height: 720,
        background:
          "radial-gradient(circle, rgba(40,240,211,0.052) 0%, rgba(59,130,246,0.028) 42%, transparent 70%)",
        borderRadius: "50%",
      }}
    />
  );
}
