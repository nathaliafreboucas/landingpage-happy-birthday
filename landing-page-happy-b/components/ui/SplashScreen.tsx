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
    const video = videoRef.current;
    if (!video) return;

    // iOS antigo (< 10) precisa desse atributo via JS
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      video.play().catch(() => startHide());
    };

    // Só tenta play quando o browser tem dados suficientes —
    // evita rejeição falsa por "not enough data" no iOS
    video.addEventListener("canplay", tryPlay, { once: true });
    // Se o vídeo já tem dados suficientes (cache/reload rápido), canplay não vai mais disparar
    if (video.readyState >= 3) tryPlay();

    const fallback = setTimeout(startHide, 3_000);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#1a3830" }}
    >
      <div className="absolute inset-0 bg-gingham opacity-10 pointer-events-none" />

      <div className="relative w-[88vw] max-w-[380px] rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src="/video/helena.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-auto block"
          loop
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
