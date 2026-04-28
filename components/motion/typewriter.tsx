"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  strings: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
};

export function Typewriter({
  strings,
  className,
  speed = 72,
  deleteSpeed = 36,
  pauseMs = 2400,
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const target = strings[idx] ?? "";

    if (!deleting && text === target) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIdx((i) => (i + 1) % strings.length);
      return;
    }

    const t = setTimeout(
      () =>
        setText(
          deleting ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1)
        ),
      deleting ? deleteSpeed : speed
    );
    return () => clearTimeout(t);
  }, [text, idx, deleting, strings, speed, deleteSpeed, pauseMs]);

  return (
    <span className={className}>
      {text}
      <span
        style={{
          display: "inline-block",
          width: "0.5em",
          height: "1.1em",
          backgroundColor: "var(--accent-teal)",
          opacity: blink ? 0.9 : 0,
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          transition: "opacity 80ms",
        }}
      />
    </span>
  );
}
