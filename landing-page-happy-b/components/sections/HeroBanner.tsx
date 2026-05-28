import Image from "next/image";
import HelenaSticker from "@/components/ui/HelenaSticker";
import { content } from "@/lib/content";

export default function HeroBanner() {
  const { name, headline, theme, badge } = content.hero;

  return (
    <section className="relative min-h-screen bg-linen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-red-500">
          <Image
            src="/images/banner-goose.png"
            alt="Gansa fofa com balões e flores no campo"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Estrelinhas decorativas */}
      <div aria-hidden className="absolute inset-0 pointer-events-none select-non etop-0">
        <span className="absolute top-[8%]  left-[6%]  text-gold   text-xl  opacity-70 animate-float">✦</span>
        <span className="absolute top-[12%] right-[8%] text-rose   text-base opacity-60 animate-float [animation-delay:1s]">✦</span>
        <span className="absolute top-[20%] left-[18%] text-sage   text-sm  opacity-50 animate-float [animation-delay:2s]">✦</span>
        <span className="absolute top-[6%]  right-[22%] text-gold  text-xs  opacity-40 animate-float [animation-delay:0.5s]">✦</span>
        <span className="absolute top-[30%] right-[5%] text-rose   text-lg  opacity-50 animate-float [animation-delay:1.5s]">✦</span>
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10 flex flex-col items-center justify-start flex-1 px-6 pt-16 pb-4 text-center">

        {/* Badge tema */}
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-sage text-sage font-sans font-semibold text-xs tracking-widest uppercase bg-sage-light">
          {theme}
        </span>

        {/* Subtítulo badge */}
        <p className="font-sans text-muted text-sm tracking-wider mb-2">{badge}</p>

        {/* Nome principal */}
        <h1 className="font-serif text-forest text-6xl sm:text-7xl md:text-8xl font-bold leading-none mb-4 drop-shadow-sm">
          {name}
        </h1>

        {/* Headline */}
        <p className="font-serif text-forest/80 text-xl sm:text-2xl md:text-3xl font-normal italic mb-8">
          {headline}
        </p>

        {/* Divisor fofo */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-12 bg-rose/40" />
          <span className="text-rose text-lg">🩷</span>
          <span className="h-px w-12 bg-rose/40" />
        </div>

        {/* Data do evento */}
        <p className="font-sans text-muted text-sm">
          {content.event.date} · {content.event.time}
        </p>
      </div>

      {/* Helena 1 — canto inferior esquerdo, dentro da section que já tem overflow-hidden */}
      <div aria-hidden className="absolute bottom-10 left-8 sm:left-16 pointer-events-none z-20">
        <HelenaSticker src="/images-person/1.png" size="lg" rotate={-12} delay="0.3s" />
      </div>

      {/* Helena 2 — canto inferior direito */}
      <div aria-hidden className="absolute bottom-6 right-8 sm:right-16 pointer-events-none z-20">
        <HelenaSticker src="/images-person/2.png" size="md" rotate={8} delay="1.2s" />
      </div>

    </section>
  );
}
