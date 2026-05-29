import HeroBanner   from "@/components/sections/HeroBanner";
import StoryBook    from "@/components/sections/StoryBook";
import GiftShowcase from "@/components/sections/GiftShowcase";
import EventInfo    from "@/components/sections/EventInfo";
import RSVPSection  from "@/components/sections/RSVPSection";

export default function Home() {
  return (
    <main>

      <HeroBanner />
      <StoryBook />
      <GiftShowcase />
      <EventInfo />
      <RSVPSection />

      <footer className="bg-forest py-8 px-6 text-center">
        <p className="font-sans text-white/60 text-sm">
          Feito com muito amor pela Dinda Nathália
        </p>
        <p className="font-sans text-white/30 text-sm mt-1">
          © {new Date().getFullYear()} Bday-Helena. Todos os direitos reservados.
        </p>
      </footer>

    </main>
  );
}
