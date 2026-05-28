"use client";

import { useState } from "react";
import { content } from "@/lib/content";

type Attending = "yes" | "maybe" | "no";

const attendingOptions: { value: Attending; label: string; emoji: string }[] = [
  { value: "yes",   label: "Sim, vou!",        emoji: "🎉" },
  { value: "maybe", label: "Talvez",            emoji: "🤔" },
  { value: "no",    label: "Não consigo ir",    emoji: "😢" },
];

export default function RSVPForm() {
  const [name, setName]           = useState("");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [guests, setGuests]       = useState(1);
  const [message, setMessage]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  async function doSubmit() {
    if (!name.trim() || !attending || loading) return;
    setLoading(true);
    // TODO: substituir por chamada ao Firebase quando o projeto estiver criado
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await doSubmit();
  }

  if (submitted) {
    return (
      <div className="text-center py-8 animate-fade-up">
        <span className="text-5xl block mb-4">🩷</span>
        <p className="font-serif text-forest text-xl font-bold mb-2">
          Recebemos sua resposta!
        </p>
        <p className="font-sans text-muted text-sm">
          {content.rsvp.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Nome */}
      <div>
        <label className="block font-sans text-forest text-sm font-semibold mb-1.5">
          Seu nome <span className="text-rose">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como você se chama?"
          required
          className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors"
        />
      </div>

      {/* Confirmação */}
      <div>
        <label className="block font-sans text-forest text-sm font-semibold mb-2">
          Você vai comparecer? <span className="text-rose">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {attendingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onTouchEnd={(e) => { e.preventDefault(); setAttending(opt.value); }}
              onClick={() => setAttending(opt.value)}
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              className={`
                flex-1 min-w-[80px] py-2.5 px-3 rounded-full font-sans text-sm font-semibold cursor-pointer
                border transition-all duration-200 active:scale-95
                ${attending === opt.value
                  ? opt.value === "yes"   ? "bg-sage text-white border-sage"
                  : opt.value === "maybe" ? "bg-gold/20 text-forest border-gold"
                  :                         "bg-rose-light text-rose border-rose"
                  : "bg-white text-muted border-cream-warm hover:border-sage"
                }
              `}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantas pessoas (só quando "sim") */}
      {attending === "yes" && (
        <div className="animate-fade-up">
          <label className="block font-sans text-forest text-sm font-semibold mb-1.5">
            Quantas pessoas (incluindo você)?
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onTouchEnd={(e) => { e.preventDefault(); setGuests((g) => Math.max(1, g - 1)); }}
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-9 h-9 rounded-full border border-cream-warm bg-white text-forest font-bold flex items-center justify-center hover:border-sage transition-colors touch-manipulation cursor-pointer"
            >
              −
            </button>
            <span className="font-serif text-forest text-xl w-6 text-center">{guests}</span>
            <button
              type="button"
              onTouchEnd={(e) => { e.preventDefault(); setGuests((g) => Math.min(10, g + 1)); }}
              onClick={() => setGuests((g) => Math.min(10, g + 1))}
              className="w-9 h-9 rounded-full border border-cream-warm bg-white text-forest font-bold flex items-center justify-center hover:border-sage transition-colors touch-manipulation cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Mensagem opcional */}
      <div>
        <label className="block font-sans text-forest text-sm font-semibold mb-1.5">
          Deixe uma mensagem para a Helena{" "}
          <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva algo com carinho para nossa princesinha…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors resize-none"
        />
      </div>

      {/* Botão enviar */}
      <button
        type="submit"
        onTouchEnd={(e) => { e.preventDefault(); doSubmit(); }}
        disabled={!name.trim() || !attending || loading}
        className="w-full py-3.5 rounded-full bg-sage text-white font-sans font-bold text-base tracking-wide
          hover:bg-sage-dark active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enviando…" : "Confirmar presença 🩷"}
      </button>

    </form>
  );
}
