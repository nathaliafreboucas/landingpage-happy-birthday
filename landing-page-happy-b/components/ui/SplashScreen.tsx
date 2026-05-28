"use client";

import { useEffect, useRef, useState } from "react";

export default function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [gone,   setGone]   = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function startHide() {
    setHiding(true);
    setTimeout(() => setGone(true), 800);
  }

  useEffect(() => {
    // Fallback: fecha após 12s caso o vídeo não toque
    const fallback = setTimeout(startHide, 3_000);
    return () => clearTimeout(fallback);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#1a3830" }}
    >
      <div className="absolute inset-0 bg-gingham opacity-10 pointer-events-none" />

      {/* Vídeo com cantos arredondados */}
      <div className="relative w-[88vw] max-w-[380px] rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src="/video/helena.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-auto block"
          loop
        />
      </div>

      <button
        onClick={startHide}
        className="absolute bottom-6 font-sans text-white/35 text-xs hover:text-white/60 transition-colors cursor-pointer"
      >
        pular →
      </button>
    </div>
  );
}
