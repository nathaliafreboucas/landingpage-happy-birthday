"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/content";

interface Props {
  photos: readonly Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent((i) => (i + 1) % photos.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  });

  const photo = photos[current];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card central */}
      <div
        className="relative polaroid max-w-sm w-[88vw] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-rose text-white flex items-center justify-center shadow-md text-base font-bold hover:bg-rose-dark transition-colors"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Imagem */}
        <div className="relative aspect-square bg-cream-warm overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            className="object-cover"
            sizes="88vw"
          />
        </div>

        {/* Legenda poética */}
        <p className="mt-2 text-center font-serif text-forest text-base italic">
          {photo.caption}
        </p>

        {/* Contador */}
        <p className="mt-1 text-center font-sans text-muted text-sm">
          {current + 1} / {photos.length}
        </p>
      </div>

      {/* Setas */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors flex items-center justify-center text-lg"
        aria-label="Foto anterior"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors flex items-center justify-center text-lg"
        aria-label="Próxima foto"
      >
        ›
      </button>
    </div>
  );
}
