"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { saveRSVP, checkPhoneExists } from "@/lib/rsvp";

type Attending = "yes" | "no";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function formatPhone(value: string): string {
  const d = normalizePhone(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidPhone(value: string): boolean {
  const d = normalizePhone(value);
  return d.length === 10 || d.length === 11;
}

export default function RSVPForm() {
  const [name, setName]             = useState("");
  const [phone, setPhone]           = useState("");
  const [attending, setAttending]   = useState<Attending | null>(null);
  const [extraCount, setExtraCount] = useState(0);
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [message, setMessage]       = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [checking, setChecking]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [duplicate, setDuplicate]   = useState(false);
  const [error, setError]           = useState("");

  function handleAttending(value: Attending) {
    setAttending(value);
    if (value === "no") {
      setExtraCount(0);
      setGuestNames([]);
    }
  }

  function changeExtraCount(delta: number) {
    const next = Math.max(0, Math.min(10, extraCount + delta));
    setExtraCount(next);
    setGuestNames((prev) => {
      const arr = [...prev];
      while (arr.length < next) arr.push("");
      return arr.slice(0, next);
    });
  }

  function setGuestName(index: number, value: string) {
    setGuestNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function canSubmit() {
    if (!name.trim() || !attending || !isValidPhone(phone)) return false;
    if (attending === "yes" && guestNames.some((n) => !n.trim())) return false;
    return true;
  }

  async function openModal(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit() || checking) return;
    setError("");
    setChecking(true);
    try {
      const exists = await checkPhoneExists(normalizePhone(phone));
      if (exists) {
        setDuplicate(true);
        return;
      }
      setShowModal(true);
    } catch {
      setError("Erro ao verificar. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await saveRSVP({
        name:             name.trim(),
        phone:            normalizePhone(phone),
        attending:        attending!,
        additionalGuests: guestNames.map((n) => n.trim()),
        totalGuests:      attending === "yes" ? 1 + guestNames.length : 0,
        message:          message.trim(),
      });
      setShowModal(false);
      setSubmitted(true);
    } catch {
      setError("Erro ao enviar. Tente novamente.");
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  }

  /* ── Já enviou ───────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="text-center py-8 animate-fade-up">
        <span className="text-5xl block mb-4">🩷</span>
        <p className="font-serif text-forest text-xl font-bold mb-2">
          Recebemos sua resposta!
        </p>
        <p className="font-sans text-muted text-base">
          {content.rsvp.successMessage}
        </p>
      </div>
    );
  }

  /* ── Telefone duplicado ──────────────────────────────────────── */
  if (duplicate) {
    return (
      <div className="text-center py-8 animate-fade-up">
        <span className="text-5xl block mb-4">💌</span>
        <p className="font-serif text-forest text-xl font-bold mb-2">
          Você já confirmou!
        </p>
        <p className="font-sans text-muted text-base leading-relaxed">
          Já recebemos uma resposta com esse número de telefone.
          <br />
          Se precisar corrigir algo, fale com a família.
        </p>
      </div>
    );
  }

  /* ── Formulário ──────────────────────────────────────────────── */
  return (
    <>
      <form onSubmit={openModal} className="space-y-6">

        {/* Nome completo */}
        <div>
          <label className="block font-sans text-forest text-base font-semibold mb-1.5">
            Seu nome completo <span className="text-rose">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como você se chama?"
            required
            className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-base placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block font-sans text-forest text-base font-semibold mb-1.5">
            Telefone <span className="text-rose">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            required
            className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-base placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors"
          />
          <p className="font-sans text-muted text-sm mt-1">
            Celular ou fixo, com DDD
          </p>
        </div>

        {/* Vai ou não */}
        <div>
          <label className="block font-sans text-forest text-base font-semibold mb-2">
            Você vai comparecer? <span className="text-rose">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAttending("yes")}
              className={`flex-1 py-3 px-4 rounded-full font-sans text-base font-semibold border transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation
                ${attending === "yes"
                  ? "bg-sage text-white border-sage"
                  : "bg-white text-muted border-cream-warm hover:border-sage"}`}
            >
              🎉 Sim, vou!
            </button>
            <button
              type="button"
              onClick={() => handleAttending("no")}
              className={`flex-1 py-3 px-4 rounded-full font-sans text-base font-semibold border transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation
                ${attending === "no"
                  ? "bg-rose-light text-rose border-rose"
                  : "bg-white text-muted border-cream-warm hover:border-sage"}`}
            >
              😢 Não vou
            </button>
          </div>
        </div>

        {/* Convidados extras — só quando sim */}
        {attending === "yes" && (
          <div className="animate-fade-up space-y-3">
            <label className="block font-sans text-forest text-base font-semibold">
              Quer confirmar a presença de mais alguém?
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeExtraCount(-1)}
                disabled={extraCount === 0}
                className="w-9 h-9 rounded-full border border-cream-warm bg-white text-forest font-bold flex items-center justify-center hover:border-sage transition-colors touch-manipulation cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="font-serif text-forest text-xl w-6 text-center select-none">
                {extraCount}
              </span>
              <button
                type="button"
                onClick={() => changeExtraCount(1)}
                disabled={extraCount === 10}
                className="w-9 h-9 rounded-full border border-cream-warm bg-white text-forest font-bold flex items-center justify-center hover:border-sage transition-colors touch-manipulation cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="font-sans text-muted text-sm">
                {extraCount === 0
                  ? "só você"
                  : extraCount === 1
                  ? "1 pessoa além de você"
                  : `${extraCount} pessoas além de você`}
              </span>
            </div>

            {guestNames.length > 0 && (
              <div className="space-y-2 pt-1">
                {guestNames.map((guestName, i) => (
                  <input
                    key={i}
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(i, e.target.value)}
                    placeholder={`Nome completo do convidado ${i + 1}`}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-base placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mensagem opcional */}
        <div>
          <label className="block font-sans text-forest text-base font-semibold mb-1.5">
            Deixe uma mensagem para a Helena{" "}
            <span className="font-normal text-muted">(opcional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva algo com carinho para nossa princesinha…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-cream-warm bg-white font-sans text-text text-base placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="font-sans text-rose text-base text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit() || checking}
          className="w-full py-3.5 rounded-full bg-sage text-white font-sans font-bold text-base tracking-wide
            hover:bg-sage-dark active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking
            ? "Verificando…"
            : attending === "no"
            ? "Enviar resposta"
            : "Confirmar presença 🩷"}
        </button>

      </form>

      {/* ── Modal de confirmação ──────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-up">

            {attending === "yes" ? (
              <>
                <p className="font-sans text-rose text-sm font-semibold uppercase tracking-wider mb-1">
                  Confirmação de presença
                </p>
                <h3 className="font-serif text-forest text-lg font-bold mb-1">
                  Tudo certo?
                </h3>
                <p className="font-sans text-muted text-sm mb-4">
                  Verifique os dados antes de confirmar.
                </p>
                <div className="bg-cream-warm rounded-xl p-4 space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-sage text-base">✓</span>
                    <span className="font-sans text-text text-base font-semibold">
                      {name.trim()}
                    </span>
                    <span className="font-sans text-muted text-sm">(você)</span>
                  </div>
                  {guestNames.map((g, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sage text-base">✓</span>
                      <span className="font-sans text-text text-base">{g.trim()}</span>
                    </div>
                  ))}
                  <p className="font-sans text-muted text-sm pt-1 border-t border-cream-warm/60">
                    Total: {1 + guestNames.length}{" "}
                    {1 + guestNames.length === 1 ? "pessoa" : "pessoas"} · {phone}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-sans text-rose text-sm font-semibold uppercase tracking-wider mb-1">
                  Confirmação de ausência
                </p>
                <h3 className="font-serif text-forest text-lg font-bold mb-4">
                  Tem certeza?
                </h3>
                <div className="bg-cream-warm rounded-xl p-4 mb-5">
                  <p className="font-sans text-text text-base">
                    <span className="font-semibold">{name.trim()}</span> não
                    poderá comparecer à festa da Helena.
                  </p>
                  <p className="font-sans text-muted text-sm mt-1">{phone}</p>
                  {message.trim() && (
                    <p className="font-sans text-muted text-sm mt-2 italic leading-relaxed">
                      "{message.trim()}"
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-full border border-cream-warm text-muted font-sans text-base font-semibold hover:border-sage transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-2.5 rounded-full bg-sage text-white font-sans text-base font-bold hover:bg-sage-dark transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Enviando…" : "Confirmar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
