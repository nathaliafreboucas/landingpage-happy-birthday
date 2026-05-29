import RSVPForm from "@/components/ui/RSVPForm";
import HelenaSticker from "@/components/ui/HelenaSticker";
import { content } from "@/lib/content";

export default function RSVPSection() {
  const { heading, subtitle } = content.rsvp;

  return (
    <section id="confirmacao" className="py-20 px-6 bg-gingham relative">

      {/* Helena 6 — MOBILE (<sm): canto superior direito da seção */}
      <div aria-hidden className="sm:hidden absolute top-6 right-4 pointer-events-none z-10">
        <HelenaSticker src="/images-person/6.png" size="sm" rotate={10} delay="0.4s" />
      </div>

      {/* Helena 7 — MOBILE (<sm): canto inferior esquerdo da seção */}
      <div aria-hidden className="sm:hidden absolute bottom-14 left-4 pointer-events-none z-10">
        <HelenaSticker src="/images-person/7.png" size="sm" rotate={-6} delay="1.8s" />
      </div>

      <div className="max-w-md mx-auto relative">

        {/* Helena 6 — DESKTOP (sm+): canto superior direito do container */}
        <div aria-hidden className="hidden sm:block absolute -top-20 -right-10 pointer-events-none z-10">
          <HelenaSticker src="/images-person/6.png" size="sm" rotate={10} delay="0.4s" />
        </div>

        {/* Helena 7 — DESKTOP (sm+): canto inferior esquerdo do container */}
        <div aria-hidden className="hidden sm:block absolute -bottom-10 -left-10 pointer-events-none z-10">
          <HelenaSticker src="/images-person/7.png" size="sm" rotate={-6} delay="1.8s" />
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <span className="block h-0.5 w-10 bg-rose mx-auto mb-4" />
          <h2 className="font-serif text-forest text-3xl sm:text-4xl font-bold mb-3">
            {heading}
          </h2>
          <p className="font-sans text-muted text-base">{subtitle}</p>
        </div>

        {/* Card formulário */}
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-cream-warm">
          <RSVPForm />
        </div>

      </div>
    </section>
  );
}
