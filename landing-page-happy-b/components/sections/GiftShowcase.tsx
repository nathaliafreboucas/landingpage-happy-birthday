import Image from "next/image";
import GiftCard from "@/components/ui/GiftCard";
import HelenaSticker from "@/components/ui/HelenaSticker";
import { content } from "@/lib/content";

export default function GiftShowcase() {
  const { heading, subtitle, categories } = content.gifts;

  return (
    <section id="mimos" className="py-20 px-6 bg-gingham relative">

      {/* Helena 3 — MOBILE (<lg): canto superior esquerdo da seção */}
      <div aria-hidden className="lg:hidden absolute top-46 left-4 sm:left-8 pointer-events-none z-10">
        <HelenaSticker src="/images-person/3.png" size="md" rotate={-8} delay="0.7s" />
      </div>

      {/* Helena 4 — MOBILE (<lg): canto inferior direito da seção */}
      <div aria-hidden className="lg:hidden absolute bottom-14 right-4 sm:right-8 pointer-events-none z-10">
        <HelenaSticker src="/images-person/4.png" size="md" rotate={14} delay="2.1s" />
      </div>

      <div className="max-w-4xl mx-auto relative">

        {/* Helena 3 — DESKTOP (lg+): canto superior esquerdo do grid de cards */}
        <div aria-hidden className="hidden lg:block absolute -top-10 -left-10 pointer-events-none z-10">
          <HelenaSticker src="/images-person/3.png" size="md" rotate={-8} delay="0.7s" />
        </div>

        {/* Helena 4 — DESKTOP (lg+): canto inferior direito do grid de cards */}
        <div aria-hidden className="hidden lg:block absolute -bottom-10 -right-10 pointer-events-none z-10">
          <HelenaSticker src="/images-person/4.png" size="md" rotate={14} delay="2.1s" />
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="block h-0.5 w-10 bg-rose mx-auto mb-4" />
          <h2 className="font-serif text-forest text-3xl sm:text-4xl font-bold mb-3">
            {heading}
          </h2>
          <p className="font-sans text-muted text-base">{subtitle}</p>
        </div>

        {/* Cards de categorias */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>

        {/* Ilustração da gansa com carrinho */}
        <div className="flex justify-center mt-14">
          <Image
            src="/images/goose-presentes-card.png"
            alt="Gansa carregando carrinho cheio de presentes"
            width={280}
            height={280}
            className="opacity-90 animate-float [animation-duration:6s]"
          />
        </div>

      </div>
    </section>
  );
}
