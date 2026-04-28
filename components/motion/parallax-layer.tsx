"use client";

import type { PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMemo } from "react";

type ParallaxLayerProps = PropsWithChildren<{
  intensity?: number;
  className?: string;
}>;

export function ParallaxLayer({
  children,
  intensity = 18,
  className
}: ParallaxLayerProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 });

  const rotateX = useTransform(springY, [-1, 1], [intensity / 2, -intensity / 2]);
  const rotateY = useTransform(springX, [-1, 1], [-intensity / 2, intensity / 2]);
  const transformStyle = useMemo(() => ({ rotateX, rotateY }), [rotateX, rotateY]);

  return (
    <motion.div
      className={className}
      style={transformStyle}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
