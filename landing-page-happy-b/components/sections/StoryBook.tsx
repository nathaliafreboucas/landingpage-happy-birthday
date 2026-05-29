"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

// ─── Helpers ─────────────────────────────────────────────────────

function PhotoSlot({
  src = "",
  alt = "",
  caption,
  circle = false,
  objectPosition = "center",
}: {
  src?: string;
  alt?: string;
  caption?: string;
  circle?: boolean;
  objectPosition?: string;
}) {
  const shape = circle
    ? "rounded-full aspect-square w-full max-w-[200px] sm:max-w-[220px] mx-auto"
    : "rounded-2xl aspect-[3/2] w-full";

  return (
    <div
      className={`relative overflow-hidden bg-cream-warm ${shape} flex items-center justify-center`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" style={{ objectPosition }} />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted/40 select-none pointer-events-none">
          <span className="text-3xl">📷</span>
          <span className="font-sans text-[11px]">foto em breve</span>
        </div>
      )}
      {caption && (
        <p className="absolute bottom-0 inset-x-0 bg-white/75 backdrop-blur-sm text-center font-serif text-forest/70 text-[10px] italic py-1.5 px-2 leading-snug rounded-b-2xl">
          {caption}
        </p>
      )}
    </div>
  );
}

function ChapterHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-forest font-bold leading-snug text-base sm:text-lg">
        {title}
      </h2>
      {sub && <p className="font-serif text-rose text-sm italic mt-0.5">{sub}</p>}
      <div className="mt-2 border-t-2 border-dashed border-sage/25" />
    </div>
  );
}

function StoryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/55 rounded-xl p-4 sm:p-5 border border-dashed border-sage/30 shadow-sm">
      <h3 className="font-serif text-forest text-base font-bold mb-2">{title}</h3>
      <div className="font-sans text-text text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

// ─── Spreads ─────────────────────────────────────────────────────

type SpreadId = "cover" | "ch1" | "ch3" | "ch4" | "ch5" | "cta";

const SPREADS: SpreadId[] = ["cover", "ch1", "ch3", "ch4", "ch5", "cta"];

// Troque os valores de src pelas fotos reais quando estiverem prontas
const PHOTOS: Record<string, string> = {
  barriguinha: "",  // ex: "/photos/barriguinha.jpg"
  nascimento:  "/images/familia.jpeg",  // ex: "/photos/nascimento.jpg"
  heroinas:    "/images/equipe-medica.jpeg",
  aniversario: "/images/cangaceira.png",  // ex: "/photos/aniversario.jpg"
};

function PageLeft({ id }: { id: SpreadId }) {
  switch (id) {
    case "cover":
      return (
        <div className="relative h-full min-h-[220px] sm:min-h-0 overflow-hidden">
          <Image
            src="/images-person/Helena 6.jpeg"
            alt="Helena"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      );

    case "ch1":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex flex-col">
          <ChapterHead title="Era uma vez…" sub="um céu cheio de nuvens" />
          <StoryCard title="A Viagem Longa">
            <p>
              A nossa casa estava com uma saudade bem apertada. Alguém muito,
              muito querido pela nossa família precisou fazer uma viagem bem
              longa para morar lá em cima, num céu cheio de nuvens macias.
            </p>
          </StoryCard>
        </div>
      );

    case "ch3":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex flex-col gap-3">
          <ChapterHead title="O Grande Dia: 02 de Julho" />
          <h3 className="font-serif text-forest text-base font-semibold">
            O meu nascimento
          </h3>
          <p className="font-sans text-text text-sm leading-relaxed">
            No dia{" "}
            <strong className="font-semibold text-forest">02/07</strong>,
            decidi que era hora de mostrar minhas bochechas para o mundo! Mas
            não foi assim tão rápido…
          </p>
          <p className="font-sans text-text text-sm leading-relaxed">
            Foram muitas e muitas horas de espera e trabalho de parto da mamãe.
            Eu estava muito confortável lá dentro, mas o amor aqui fora já
            estava pronto para transbordar por completo!
          </p>
        </div>
      );

    case "ch4":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex flex-col gap-3">
          <ChapterHead title="O Grande Dia" />
          <p className="font-sans text-text text-sm leading-relaxed">
            Para me ajudar a chegar em segurança, tive a proteção de{" "}
            <strong className="font-semibold text-forest">super heroínas</strong>{" "}
            cuidando de mim e da mamãe em cada detalhe.
          </p>
          <p className="font-sans text-text text-sm leading-relaxed">
            E então, eu cheguei! A minha dinda{" "}
            <strong className="font-semibold text-forest">Nathália</strong>{" "}
            estava lá bem pertinho de nós, registrando tudo, toda emocionada!
          </p>
        </div>
      );

    case "ch5":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex items-center justify-center">
          <PhotoSlot
            src={PHOTOS.aniversario}
            alt="Helena com 1 aninho"
            objectPosition="center 34%"
          />
        </div>
      );

    case "cta":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-8 sm:p-10 flex flex-col items-center justify-center gap-5 text-center">
          <h2 className="font-serif text-forest text-2xl sm:text-3xl font-bold leading-snug">
            Você faz parte dessa história!
          </h2>

          <p className="font-serif text-rose text-base font-semibold leading-relaxed">
            Visitem a nossa área de{" "}
            <a href="#confirmacao" className="underline underline-offset-2 hover:text-forest transition-colors">
              Confirmação de Presença
            </a>{" "}
            e{" "}
            <a href="#mimos" className="underline underline-offset-2 hover:text-forest transition-colors">
              Sugestões de Mimos
            </a>
            !
          </p>
        </div>
      );
  }
}

function PageRight({ id }: { id: SpreadId }) {
  switch (id) {
    case "cover":
      return (
        <div
          className="h-full min-h-[260px] sm:min-h-0 p-10 flex flex-col items-center justify-center gap-6 text-center"
          style={{
            background: "linear-gradient(135deg, #fdf2f2, #faf6ef)",
          }}
        >
          <p className="font-sans text-rose text-base font-semibold tracking-wide">
             Helena apresenta:
          </p>
          <h1 className="font-serif text-forest text-2xl sm:text-3xl font-bold leading-tight max-w-[280px]">
            Como o Amor Trouxe muita alegria
          </h1>
          <p className="font-sans text-muted text-sm leading-relaxed max-w-[240px]">
            A doce historinha do meu primeiro ano de vida, contada por mim para
            todos os meus queridos convidados.
          </p>
        </div>
      );

    case "ch1":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex flex-col justify-center">
          <StoryCard title="A Esperança">
            <p>
              Eu já estava guardadinha na barriga da mamãe, com um barrigão lindo
              prestes a nascer!
            </p>
            <p>
              Eu era aquela luz de esperança que todos já aguardavam ansiosos
              para encher a casa de cor novamente. Cada chute que eu dava na
              barriga era um afago de amor em preparação para o dia de encontrar o papai e a mamãe.
            </p>
          </StoryCard>
        </div>
      );

    case "ch3":
      return (
        <div className="relative h-[200px] sm:h-full bg-cream-warm overflow-hidden">
          {PHOTOS.nascimento ? (
            <Image
              src={PHOTOS.nascimento}
              alt="O grande dia"
              fill
              className="object-cover"
              style={{ objectPosition: "center 60%" }}
              sizes="50vw"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted/40 select-none pointer-events-none">
              <span className="text-3xl">📷</span>
              <span className="font-sans text-[11px]">foto em breve</span>
            </div>
          )}
        </div>
      );

    case "ch4":
      return (
        <div className="h-full min-h-[200px] sm:min-h-0 p-5 sm:p-6 flex items-center justify-center">
          <PhotoSlot
            src={PHOTOS.heroinas}
            alt="O primeiro olhar da dinda"
            caption="O primeiro olhar da dinda"
          />
        </div>
      );

    case "ch5":
      return (
        <div className="h-full min-h-[240px] sm:min-h-0 p-6 sm:p-8 flex flex-col justify-center gap-4">
          <ChapterHead title="E o tempo voou… Já vou fazer 1 ano!" />
          <p className="font-sans text-text text-sm leading-relaxed">
            Parece que foi ontem que eu cabia no colo com facilidade, mas agora
            eu já estou explorando tudo! Aprendi a engatinhar, a dar gargalhadas
            e a apontar para as coisas que acho fofas.
          </p>
          <p className="font-sans text-text text-sm leading-relaxed">
            Eu enchi nosso lar de Luz! No dia{" "}
            <strong className="font-semibold text-forest">02 de Julho</strong>,
            vou comemorar a minha primeira voltinha inteira ao redor do sol e
            quero celebrar esse recomeço com vocês.
          </p>
        </div>
      );

    case "cta":
      return (
        <div className="relative h-full min-h-[200px] sm:min-h-0 overflow-hidden">
          <Image
            src="/images/familia-2.jpeg"
            alt="Família"
            fill
            className="object-cover"
            style={{ objectPosition: "center 40%" }}
            sizes="50vw"
          />
        </div>
      );
  }
}

// ─── Main Component ───────────────────────────────────────────────

export default function StoryBook() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animClass, setAnimClass] = useState("");

  const bookRef       = useRef<HTMLDivElement>(null);
  const currentRef    = useRef(current);
  const isAnimRef     = useRef(isAnimating);
  const navigateRef   = useRef<(t: number) => void>(() => {});

  useEffect(() => { currentRef.current = current; },     [current]);
  useEffect(() => { isAnimRef.current  = isAnimating; }, [isAnimating]);

  const navigate = useCallback(
    (target: number) => {
      if (
        target < 0 ||
        target >= SPREADS.length ||
        isAnimating ||
        target === current
      )
        return;

      const dir = target > current ? "fwd" : "bwd";
      setIsAnimating(true);
      setAnimClass(`book-exit-${dir}`);

      setTimeout(() => {
        setCurrent(target);
        setAnimClass(`book-enter-${dir}`);
        setTimeout(() => {
          setAnimClass("");
          setIsAnimating(false);
        }, 320);
      }, 320);
    },
    [current, isAnimating]
  );

  // Keep navigateRef pointing to the freshest navigate every render
  useEffect(() => { navigateRef.current = navigate; });

  // Native touch listeners — { passive: false } on touchmove allows
  // preventDefault(), which stops the browser from treating a horizontal
  // swipe as a page-scroll on both Android and iOS.
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    let sx: number | null = null;
    let sy: number | null = null;
    let horiz: boolean | null = null;

    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      horiz = null;
    };

    const onMove = (e: TouchEvent) => {
      if (sx === null || sy === null) return;
      const dx = Math.abs(e.touches[0].clientX - sx);
      const dy = Math.abs(e.touches[0].clientY - sy);
      if (horiz === null && (dx > 8 || dy > 8)) horiz = dx > dy;
      if (horiz) e.preventDefault(); // block vertical scroll during horizontal swipe
    };

    const onEnd = (e: TouchEvent) => {
      if (sx === null || sy === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      sx = null; sy = null; horiz = null;
      if (Math.abs(dx) < 30 || Math.abs(dy) > Math.abs(dx)) return;
      if (isAnimRef.current) return;
      navigateRef.current(currentRef.current + (dx < 0 ? 1 : -1));
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, []); // mount only — refs keep values current

  // Mouse drag (desktop)
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (dragStartX.current === null || dragStartY.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    dragStartX.current = null;
    dragStartY.current = null;
    if (Math.abs(dx) < 30 || Math.abs(dy) > Math.abs(dx)) return;
    navigate(dx < 0 ? current + 1 : current - 1);
  };

  const id = SPREADS[current];

  return (
    <section className="py-20 px-4 sm:px-6 bg-linen">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <span className="block h-0.5 w-10 bg-rose mx-auto mb-4" />
          <h2 className="font-serif text-forest text-3xl sm:text-4xl font-bold mb-3">
            A Historinha da Helena
          </h2>
          <p className="font-sans text-muted text-base">
            365 dias de puro amor, descobertas e sorrisos
          </p>
        </div>

        {/* Wrapper com setas */}
        <div className="relative">

          {/* O Livro */}
          <div
            ref={bookRef}
            className="rounded-2xl overflow-hidden select-none"
            style={{
              boxShadow:
                "0 24px 70px rgba(35,77,64,0.28), 0 4px 12px rgba(35,77,64,0.12)",
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Páginas */}
            <div
              className={`relative grid grid-cols-1 sm:grid-cols-2 ${animClass}`}
              style={{
                background: "linear-gradient(135deg, #fdf2f2 0%, #faf6ef 55%, #faf6ef 100%)",
                minHeight: "480px",
              }}
            >
              {/* Página esquerda */}
              <div className="relative border-b sm:border-b-0 sm:border-r border-cream-warm/60">
                <PageLeft id={id} />
              </div>

              {/* Página direita */}
              <div className="relative">
                <PageRight id={id} />
              </div>

              {/* Lombada (desktop) */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-px w-px pointer-events-none hidden sm:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(200,186,168,0.45) 20%, rgba(200,186,168,0.45) 80%, transparent)",
                }}
              />
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between mt-5 px-1">
            <button
              onClick={() => navigate(current - 1)}
              disabled={current === 0 || isAnimating}
              aria-label="Página anterior"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest/90 text-white text-xl sm:text-2xl flex items-center justify-center shadow-lg hover:bg-forest transition-all disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation"
            >
              ‹
            </button>

            <div className="flex items-center gap-2">
              {SPREADS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  aria-label={`Capítulo ${i + 1}`}
                  className={`rounded-full transition-all duration-200 touch-manipulation ${
                    i === current
                      ? "w-3 h-3 bg-forest"
                      : "w-2 h-2 bg-forest/25 hover:bg-forest/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(current + 1)}
              disabled={current === SPREADS.length - 1 || isAnimating}
              aria-label="Próxima página"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest/90 text-white text-xl sm:text-2xl flex items-center justify-center shadow-lg hover:bg-forest transition-all disabled:opacity-20 disabled:cursor-not-allowed touch-manipulation"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
