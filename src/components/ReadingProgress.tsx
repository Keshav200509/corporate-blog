"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[3px] w-full bg-zinc-200/50 dark:bg-zinc-800/50"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
