export const content = {
  hero: {
    name: "Helena",
    headline: "Um Aninho de Amor",
    theme: "One Silly Goose",
    badge: "✦ 1 aninho ✦",
  },

  event: {
    date: "DD de Mês de 2025",       // TODO: preencher
    time: "HH:00h",                   // TODO: preencher
    venue: "Nome do Local",           // TODO: preencher
    address: "Endereço, Cidade – UF", // TODO: preencher
    mapsUrl: "#",                     // TODO: link do Google Maps
    dressCode: "Traje passeio",
  },

  storybook: {
    heading: "A Historinha da Helena",
    subtitle: "365 dias de puro amor, descobertas e sorrisos",
    photos: [
      {id: "1", src: "/public/images/goose-presentes-card.png", caption: "O começo de tudo…" },
      {id: "2", src: "/public/images/goose-presentes-card.png", caption: "Primeiros sorrisos" },
      {id: "3", src: "/public/images/goose-presentes-card.png", caption: "Crescendo depressa!" },
      {id: "4", src: "/public/images/goose-presentes-card.png", caption: "Aventuras do dia a dia" },
      {id: "5", src: "/public/images/goose-presentes-card.png", caption: "Amor em família" },
      {id: "6", src: "/public/images/goose-presentes-card.png", caption: "Nossa princesinha" },
    ],
  },

  gifts: {
    heading: "Sugestões de Presentes",
    subtitle: "Escolha a categoria que mais combina com você",
    categories: [
      {
        id: "roupas",
        emoji: "👗",
        title: "Roupas e Moda",
        description:
          "Estética com laços e cabides em aquarela. Tamanhos ideais, cores favoritas e marcas preferidas para as roupinhas de passeio.",
        hint: "Tamanho 1–2 anos",
      },
      {
        id: "brinquedos",
        emoji: "🧩",
        title: "Brinquedos",
        description:
          "Foco em brinquedos de madeira, livros sensoriais e itens de desenvolvimento, incentivando o lúdico e a imaginação.",
        hint: "Para 12+ meses",
      },
      {
        id: "mimos",
        emoji: "🩷",
        title: "Mimos e Cuidados",
        description:
          "Itens indispensáveis do dia a dia da Helena: fraldas ecológicas, livrinhos de historinhas infantis e acessórios fofos.",
        hint: "Sempre bem-vindos!",
      },
    ],
  },

  rsvp: {
    heading: "Confirme sua Presença",
    subtitle: "Sua resposta nos ajuda a preparar tudo com carinho",
    successMessage: "Obrigada por confirmar! Mal podemos esperar para te ver lá. 🩷",
  },
} as const;

export type Photo    = (typeof content.storybook.photos)[number];
export type Gift     = (typeof content.gifts.categories)[number];
