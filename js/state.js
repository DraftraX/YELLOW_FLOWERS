/**
 * Módulo de estado y configuración para Flores Amarillas
 * Dedicado con amor para Maria Iboni <3
 */

const DEFAULT_GIFT_DATA = {
  version: 2,
  recipient: "Maria Iboni <3",
  senderTag: "Con mucho amor",
  headerPill: "21 · DE · SEPTIEMBRE",
  headerTitle: "Flores Amarillas para Ti",
  headerSubtitle: "Un detalle inolvidable preparado con todo el corazón…",
  boxTag: "Para: Maria Iboni <3",
  boxSubtitle: "Toca la caja para abrir tu regalo especial ✨",
  letterTitle: "Para ti, mi amor",
  letterBody: "El 21 de septiembre se regalan flores amarillas como símbolo de un amor puro, incondicional y lleno de luz. Hoy este ramo entero florece para ti, Maria Iboni, porque no hay sol ni jardín en este mundo que brille con tanta calidez, dulzura y magia como lo haces tú todos los días en mi vida. Eres mi momento favorito, mi paz y mi alegría más grande.",
  letterSign: "— Con todo mi amor, hoy y siempre",
  photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
  photoTitle: "Mi persona favorita",
  photoSubtitle: "Maria Iboni, brillas más que mil girasoles 🌻",
  theme: "clasico", // 'clasico' | 'atardecer' | 'noche' | 'pastel'
  bouquetStyle: "exuberante", // 'exuberante' | 'girasoles' | 'rosas'
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
      body: "Prometo cuidar siempre de ti, celebrar cada uno de tus sueños y recordarte todos los días lo maravillosa que eres."
    }
  ],
  animals: [
    {
      id: "gato",
      name: "Gatito",
      active: true,
      msg: "¡Miau! Ronroneos de felicidad para Maria Iboni 💕"
    },
    {
      id: "perrito",
      name: "Perrito",
      active: true,
      msg: "¡Guau! ¡Moviendo la colita de alegría por ti! 🐾"
    },
    {
      id: "conejito",
      name: "Conejito",
      active: true,
      msg: "¡Saltitos de dulzura! Eres la más linda 🌸"
    },
    {
      id: "abeja",
      name: "Abejita",
      active: true,
      msg: "Traje el polen más dorado y miel pura para ti ✨"
    },
    {
      id: "pollito",
      name: "Pollito",
      active: true,
      msg: "¡Pío pío! ¡Hoy es tu día especial, reina! 💛"
    },
    {
      id: "capibara",
      name: "Capibara",
      active: true,
      msg: "Paz, amor infinito y flores amarillas para ti 🌿"
    }
  ],
  musicUrl: "",
  synthMusic: true,
  interactiveSound: true
};

const THEMES = {
  clasico: {
    name: "Amarillo Radiante (Clásico)",
    bg: "radial-gradient(circle at 15% 20%, rgba(255,214,90,.4), transparent 45%), radial-gradient(circle at 85% 75%, rgba(255,190,60,.35), transparent 50%), linear-gradient(180deg,#FFF3C4 0%,#FFE792 38%,#FFF9E8 100%)",
    cardBg: "#FFFFFF",
    textColor: "#5C3A21",
    primary: "#F0A500",
    primaryGlow: "rgba(240,165,0,0.45)",
    accent: "#E05555",
    secondary: "#FFD45E",
    boxBg: "linear-gradient(160deg, #FFD45E, #F0A500)",
    ribbonBg: "linear-gradient(90deg, #E05555, #B83A3A)"
  },
  atardecer: {
    name: "Atardecer Dorado & Coral",
    bg: "radial-gradient(circle at 20% 25%, rgba(255,160,122,.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,193,7,.3), transparent 50%), linear-gradient(180deg,#FFE4D6 0%,#FFD1BA 40%,#FFF5EB 100%)",
    cardBg: "#FFFFFF",
    textColor: "#542F26",
    primary: "#E76F51",
    primaryGlow: "rgba(231,111,81,0.45)",
    accent: "#F4A261",
    secondary: "#E9C46A",
    boxBg: "linear-gradient(160deg, #F4A261, #E76F51)",
    ribbonBg: "linear-gradient(90deg, #C73E1D, #93291E)"
  },
  noche: {
    name: "Noche Mágica Estrellada",
    bg: "radial-gradient(circle at 25% 20%, rgba(255,215,0,.22), transparent 40%), radial-gradient(circle at 75% 80%, rgba(240,165,0,.15), transparent 50%), linear-gradient(180deg,#0F172A 0%,#1E293B 40%,#090D16 100%)",
    cardBg: "#1E293B",
    textColor: "#F8FAFC",
    primary: "#FBBF24",
    primaryGlow: "rgba(251,191,36,0.6)",
    accent: "#F43F5E",
    secondary: "#FCD34D",
    boxBg: "linear-gradient(160deg, #F59E0B, #B45309)",
    ribbonBg: "linear-gradient(90deg, #F43F5E, #BE123C)"
  },
  pastel: {
    name: "Jardín Floral de Ensueño",
    bg: "radial-gradient(circle at 18% 22%, rgba(254,240,138,.45), transparent 45%), radial-gradient(circle at 82% 78%, rgba(187,247,208,.38), transparent 50%), linear-gradient(180deg,#FEF9C3 0%,#ECFDF5 45%,#FFFBEB 100%)",
    cardBg: "#FFFFFF",
    textColor: "#334155",
    primary: "#EAB308",
    primaryGlow: "rgba(234,179,8,0.4)",
    accent: "#EC4899",
    secondary: "#FDE047",
    boxBg: "linear-gradient(160deg, #FDE047, #EAB308)",
    ribbonBg: "linear-gradient(90deg, #EC4899, #BE185D)"
  }
};

class GiftState {
  constructor() {
    this.data = this.loadInitialData();
  }

  loadInitialData() {
    // 1. Check URL Hash: #data=...
    const hashData = this.readFromHash();
    if (hashData) return hashData;

    // 2. Check URL Query: ?data=...
    const queryData = this.readFromQuery();
    if (queryData) return queryData;

    // 3. Check LocalStorage
    try {
      const stored = localStorage.getItem('flores_amarillas_gift_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_GIFT_DATA, ...parsed };
      }
    } catch (e) {
      console.warn("No se pudo leer de localStorage", e);
    }

    // 4. Default: Maria Iboni <3
    return JSON.parse(JSON.stringify(DEFAULT_GIFT_DATA));
  }

  readFromHash() {
    try {
      if (window.location.hash && window.location.hash.includes('data=')) {
        const hash = window.location.hash;
        const raw = hash.split('data=')[1];
        if (raw) return this.decodeDataString(raw);
      }
    } catch (e) {
      console.warn("Error leyendo hash:", e);
    }
    return null;
  }

  readFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search);
      const val = params.get('data');
      if (val) {
        return this.decodeDataString(val);
      }
    } catch (e) {
      console.warn("Error leyendo query:", e);
    }
    return null;
  }

  decodeDataString(encoded) {
    try {
      const clean = decodeURIComponent(encoded);
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const json = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(json);
      return { ...DEFAULT_GIFT_DATA, ...parsed };
    } catch (e) {
      console.error("Error decodificando datos:", e);
      return null;
    }
  }

  encodeDataString(dataObj = this.data) {
    try {
      const json = JSON.stringify(dataObj);
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return encodeURIComponent(btoa(binary));
    } catch (e) {
      console.error("Error codificando datos:", e);
      return "";
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('flores_amarillas_gift_data', JSON.stringify(this.data));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_GIFT_DATA));
    this.saveToLocalStorage();
    return this.data;
  }

  generateShareableUrl(baseUrl) {
    if (!baseUrl) {
      baseUrl = window.location.href.split('#')[0].split('?')[0];
    }
    // ensure it targets index.html for the public view
    let target = baseUrl.replace('editor.html', 'index.html');
    if (!target.endsWith('index.html') && !target.endsWith('/')) {
      target = target.substring(0, target.lastIndexOf('/') + 1) + 'index.html';
    }
    const encoded = this.encodeDataString();
    return `${target}#data=${encoded}`;
  }

  applyThemeCSS(themeName = this.data.theme) {
    const theme = THEMES[themeName] || THEMES.clasico;
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.bg);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--primary-glow', theme.primaryGlow);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--box-bg', theme.boxBg);
    root.style.setProperty('--ribbon-bg', theme.ribbonBg);
    document.body.className = `theme-${themeName}`;
  }
}

window.GiftState = GiftState;
window.DEFAULT_GIFT_DATA = DEFAULT_GIFT_DATA;
window.THEMES = THEMES;
