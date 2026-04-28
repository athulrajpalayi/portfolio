"use client";

import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useState } from "react";

type MagneticButtonProps = PropsWithChildren<{
  className?: string;
}>;

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className={className}
      animate={offset}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6 }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 12;
        const y = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 12;
        setOffset({ x, y });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}
