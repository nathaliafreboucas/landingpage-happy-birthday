import HelenaSticker from "@/components/ui/HelenaSticker";
import { content } from "@/lib/content";

const { date, time, venue, address, mapsUrl, dressCode } = content.event;

type EventCard = { emoji: string; label: string; value: string; sub?: string; href?: string };

const cards: EventCard[] = [
  {
    emoji: "📅",
    label: "Data",
    value: date,
    sub: time,
  },
  {
    emoji: "📍",
    label: "Local",
    value: venue,
    sub: address,
    href: mapsUrl,
  },
  {
    emoji: "👗",
    label: "Traje",
    value: dressCode,
    sub: "Venha confortável e à vontade",
  },
];

export default function EventInfo() {
  return (
    <section className="py-20 px-6 bg-linen relative">

      {/* Helena 5 — MOBILE (<lg): canto superior direito da seção */}
      <div aria-hidden className="lg:hidden absolute -top-3 lg:top-16 right-4 sm:right-8 pointer-events-none z-10">
        <HelenaSticker src="/images-person/5.png" size="md" rotate={-9} delay="1.5s" />
      </div>

      <div className="max-w-3xl mx-auto relative">

        {/* Helena 5 — DESKTOP (lg+): canto superior direito dos cards */}
        <div aria-hidden className="hidden lg:block absolute -top-10 -right-10 pointer-events-none z-10">
          <HelenaSticker src="/images-person/5.png" size="md" rotate={-9} delay="1.5s" />
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="block h-0.5 w-10 bg-rose mx-auto mb-4" />
          <h2 className="font-serif text-forest text-3xl sm:text-4xl font-bold mb-3">
            Informações do Evento
          </h2>
          <p className="font-sans text-muted text-base">
            Tudo que você precisa saber para não perder essa festa
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-warm"
            >
              <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center text-2xl mx-auto mb-3">
                {card.emoji}
              </div>
              <p className="font-sans text-muted text-sm uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className="font-serif text-forest font-bold text-base leading-snug mb-1">
                {card.value}
              </p>
              {card.sub && (
                <p className="font-sans text-muted text-sm">{card.sub}</p>
              )}
              {card.href && card.href !== "#" && (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sage text-sm font-semibold underline underline-offset-2 hover:text-sage-dark transition-colors"
                >
                  Ver no mapa →
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
