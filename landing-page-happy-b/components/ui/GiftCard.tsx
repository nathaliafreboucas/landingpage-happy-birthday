"use client";

import { useState } from "react";
import type { Gift } from "@/lib/content";

interface Props {
  gift: Gift;
}

export default function GiftCard({ gift }: Props) {
  const [reserved, setReserved] = useState(false);

  return (
    <div
      className={`
        relative rounded-2xl p-6 bg-white transition-all duration-300
        ${reserved
          ? "border-2 border-rose shadow-lg shadow-rose/20"
          : "gift-border shadow-sm hover:shadow-md"
        }
      `}
    >
      {/* Laço rosa quando reservado */}
      {reserved && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-pale px-3 py-0.5 rounded-full border border-rose">
          <span className="font-sans text-rose text-[11px] font-semibold tracking-wide">
            🎀 Reservado
          </span>
        </div>
      )}

      {/* Emoji ícone */}
      <div className={`
        w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 transition-colors duration-300
        ${reserved ? "bg-rose-light" : "bg-sage-light"}
      `}>
        {gift.emoji}
      </div>

      {/* Título */}
      <h3 className="font-serif text-forest text-lg font-bold text-center mb-2">
        {gift.title}
      </h3>

      {/* Descrição */}
      <p className="font-sans text-muted text-sm text-center leading-relaxed mb-4">
        {gift.description}
      </p>

      {/* Hint de tamanho/detalhe */}
      <p className="font-sans text-sage-dark text-xs text-center italic mb-5">
        {gift.hint}
      </p>

      {/* Botão */}
      <button
        onClick={() => setReserved((v) => !v)}
        className={`
          w-full py-2.5 rounded-full font-sans font-bold text-sm tracking-wide
          transition-all duration-300 hover:scale-105 active:scale-95
          ${reserved
            ? "bg-rose-light text-rose border border-rose"
            : "bg-sage text-white hover:bg-sage-dark"
          }
        `}
      >
        {reserved ? "Cancelar reserva" : "Quero dar este presente!"}
      </button>
    </div>
  );
}
