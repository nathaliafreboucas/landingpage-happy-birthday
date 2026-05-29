"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [gone,   setGone]   = useState(false);

  function startHide() {
    setHiding(true);
    setTimeout(() => setGone(true), 800);
  }

  useEffect(() => {
    const fallback = setTimeout(startHide, 5_000);
    return () => clearTimeout(fallback);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#1a3830" }}
    >
      <div className="absolute inset-0 bg-gingham opacity-10 pointer-events-none" />

      <div className="relative w-[88vw] max-w-[380px] rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src="/video/helena (1).gif"
          alt="Helena"
          width={380}
          height={380}
          className="w-full h-auto block"
          unoptimized
          priority
        />
      </div>

      <button
        onClick={startHide}
        className="absolute bottom-6 font-sans text-white/35 text-sm hover:text-white/60 transition-colors cursor-pointer"
      >
        pular →
      </button>
    </div>
  );
}
