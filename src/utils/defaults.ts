export interface GiftNote {
  id: string;
  title: string;
  body: string;
}

export interface GiftAnimal {
  id: string;
  name: string;
  active: boolean;
  msg: string;
}

export interface GiftData {
  id: string;
  createdAt: number;
  expiresAt: number; // Máximo 7 días después de createdAt
  recipient: string;
  senderTag: string;
  headerPill: string;
  headerTitle: string;
  headerSubtitle: string;
  boxTag: string;
  boxSubtitle: string;
  letterTitle: string;
  letterBody: string;
  letterSign: string;
  photoUrl: string;
  photoTitle: string;
  photoSubtitle: string;
  theme: 'clasico' | 'atardecer' | 'noche' | 'pastel';
  bouquetStyle: string;
  audioUrl: string;
  audioName?: string;
  notes: GiftNote[];
  animals: GiftAnimal[];
}

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

export const DEFAULT_GIFT: GiftData = {
  id: "especial",
  createdAt: Date.now(),
  expiresAt: Date.now() + ONE_WEEK_MS,
  recipient: "Mi persona favorita 💛",
  senderTag: "Con mucho amor",
  headerPill: "21 · DE · SEPTIEMBRE",
  headerTitle: "Flores Amarillas para Ti",
  headerSubtitle: "Un detalle inolvidable preparado con todo el corazón…",
  boxTag: "Para: Alguien Especial ✨",
  boxSubtitle: "Toca la caja para abrir tu regalo especial ✨",
  letterTitle: "Para ti, con todo mi corazón",
  letterBody: "El 21 de septiembre se regalan flores amarillas como promesa de un amor puro, alegría y complicidad que florece con cada amanecer. Hoy este ramo entero florece para ti, porque no hay sol ni jardín en este mundo que brille con tanta calidez, dulzura y magia como lo haces tú todos los días en mi vida. Eres mi momento favorito, mi paz y mi alegría más grande.",
  letterSign: "— Siempre contigo, con todo mi amor",
  photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
  photoTitle: "Mi persona favorita",
  photoSubtitle: "Brillas más que mil girasoles 🌻",
  theme: "clasico",
  bouquetStyle: "exuberante",
  audioUrl: "",
  audioName: "Caja de Música Romántica (Sintetizador)",
  notes: [
    {
      id: "n1",
      title: "Razón número uno 🌻",
      body: "Porque tu sonrisa tiene el superpoder de iluminar hasta el día más gris y llenarlo de una primavera eterna."
    },
    {
      id: "n2",
      title: "Razón número dos ✨",
      body: "Porque la bondad, la dulzura y el brillo único de tus ojos hacen de mi mundo un lugar infinitamente más feliz."
    },
    {
      id: "n3",
      title: "Razón número tres 💛",
      body: "Porque cada instante a tu lado se siente como un abrazo cálido al alma, de esos que uno nunca quiere soltar."
    },
    {
      id: "n4",
      title: "Nuestra Promesa 💌",
      body: "Prometo cuidar siempre de ti, celebrar cada uno de tus sueños y recordarte todos los días lo increíble que eres."
    }
  ],
  animals: [
    {
      id: "gato",
      name: "Gatito Cariñoso",
      active: true,
      msg: "¡Miau! Ronroneos y caricias infinitas para ti 💕"
    },
    {
      id: "perrito",
      name: "Perrito Fiel",
      active: true,
      msg: "¡Guau! Moviendo la colita de felicidad por verte sonreír 🐾"
    },
    {
      id: "conejito",
      name: "Conejito Tierno",
      active: true,
      msg: "¡Saltitos de alegría! Eres la persona más linda de todas 🌸"
    },
    {
      id: "abeja",
      name: "Abejita",
      active: true,
      msg: "Traje el polen más dorado y la miel más dulce para ti 🍯"
    },
    {
      id: "pollito",
      name: "Pollito",
      active: true,
      msg: "¡Pío pío! ¡Hoy es tu día especial, que seas muy feliz! 🐥"
    },
    {
      id: "capibara",
      name: "Capibara Zen",
      active: true,
      msg: "Paz absoluta, amor eterno y muchas flores amarillas 🌿"
    }
  ]
};
