/**
 * Generador y Controlador del Ramo de Flores Exuberante y Dinámico
 * Diseñado con flores artesanales multi-capa en SVG de alta fidelidad,
 * física de viento, desprendimiento de polen/estrellas y sonido interactivo.
 */

// Definiciones SVG reutilizables de flores maestras
const BOUQUET_ASSETS = {
  // Girasol majestuoso con capas dobles y disco con textura de semillas
  sunflower: (id = 0, scale = 1, rotation = 0) => {
    let petalsOuter = '';
    let petalsInner = '';
    const n = 16;
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i;
      petalsOuter += `<path d="M0 0 C -12 -38, -16 -75, 0 -98 C 16 -75, 12 -38, 0 0 Z" fill="url(#gradSunOuter)" transform="rotate(${ang})" filter="drop-shadow(0 2px 4px rgba(120,60,10,0.25))"/>`;
      const angIn = ang + (180 / n);
      petalsInner += `<path d="M0 0 C -9 -30, -12 -62, 0 -82 C 12 -62, 9 -30, 0 0 Z" fill="url(#gradSunInner)" transform="rotate(${angIn})"/>`;
    }

    return `
    <g class="flor-interactiva flor-girasol" data-type="girasol" transform="rotate(${rotation}) scale(${scale})" style="transform-origin: 0 0;">
      <!-- Pétalos exteriores e interiores -->
      <g class="corona-petalos">
        ${petalsOuter}
        ${petalsInner}
      </g>
      <!-- Disco central texturizado -->
      <circle r="34" fill="url(#gradSunCore)" filter="drop-shadow(inset 0 0 10px rgba(0,0,0,0.6))"/>
      <circle r="31" fill="none" stroke="#E5A020" stroke-width="1.8" stroke-dasharray="3 4" opacity="0.6"/>
      <circle r="25" fill="none" stroke="#523114" stroke-width="2.5" stroke-dasharray="4 3"/>
      <circle r="18" fill="#3D200E"/>
      <circle r="14" fill="#2E170A"/>
      <!-- Espirales de semillas diminutas -->
      <circle cx="-5" cy="-6" r="1.5" fill="#E8A838" opacity="0.8"/>
      <circle cx="6" cy="-4" r="1.5" fill="#E8A838" opacity="0.8"/>
      <circle cx="-3" cy="7" r="1.5" fill="#E8A838" opacity="0.8"/>
      <circle cx="5" cy="5" r="1.5" fill="#E8A838" opacity="0.8"/>
      <circle cx="0" cy="0" r="2" fill="#FBBF24"/>
    </g>`;
  },

  // Rosa amarilla elegante con pétalos envolventes
  rose: (scale = 1, rotation = 0) => {
    return `
    <g class="flor-interactiva flor-rosa" data-type="rosa" transform="rotate(${rotation}) scale(${scale})" style="transform-origin: 0 0;">
      <g filter="drop-shadow(0 4px 8px rgba(130,70,10,0.22))">
        <!-- Base de pétalos -->
        <circle r="42" fill="#EAB308"/>
        <!-- Capa exterior -->
        <path d="M-40 0 C -45 -30, -20 -44, 0 -42 C 20 -44, 45 -30, 40 0 C 35 30, 10 44, 0 42 C -10 44, -35 30, -40 0 Z" fill="url(#gradRoseOut)"/>
        <!-- Capa media -->
        <path d="M-28 -8 C -32 -28, -8 -36, 6 -32 C 22 -36, 32 -18, 28 6 C 24 24, 0 32, -12 28 C -26 24, -26 8, -28 -8 Z" fill="url(#gradRoseMid)"/>
        <!-- Capullo central enrollado -->
        <path d="M-15 -6 C -18 -20, 0 -24, 10 -18 C 18 -12, 18 4, 8 15 C -2 20, -12 16, -15 -6 Z" fill="#D97706"/>
        <path d="M-6 -6 C -8 -14, 4 -16, 8 -10 C 12 -4, 6 6, 0 6 C -6 6, -6 -2, -6 -6 Z" fill="#FEF08A"/>
        <ellipse cx="-2" cy="-2" rx="4" ry="3" fill="#B45309"/>
      </g>
    </g>`;
  },

  // Tulipán amarillo satinado
  tulip: (scale = 1, rotation = 0) => {
    return `
    <g class="flor-interactiva flor-tulipan" data-type="tulipan" transform="rotate(${rotation}) scale(${scale})" style="transform-origin: 0 0;">
      <g filter="drop-shadow(0 4px 6px rgba(110,60,10,0.2))">
        <!-- Pétalos posteriores -->
        <path d="M-20 -2 C -24 -24, -8 -48, 0 -52 C 8 -48, 24 -24, 20 -2 C 14 16, -14 16, -20 -2 Z" fill="#F59E0B"/>
        <!-- Pétalo izquierdo frontal -->
        <path d="M-22 0 C -26 -28, -6 -50, -4 -50 C 4 -32, 2 -8, -6 12 C -15 12, -20 6, -22 0 Z" fill="url(#gradTulipLeft)"/>
        <!-- Pétalo derecho frontal -->
        <path d="M22 0 C 26 -28, 6 -50, 4 -50 C -4 -32, -2 -8, 6 12 C 15 12, 20 6, 22 0 Z" fill="url(#gradTulipRight)"/>
        <!-- Centro cálido visible -->
        <ellipse cx="0" cy="-26" rx="4" ry="12" fill="#FEF08A" opacity="0.85"/>
      </g>
    </g>`;
  },

  // Flor silvestre / Margarita dorada
  daisy: (scale = 1, rotation = 0) => {
    let p = '';
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      p += `<ellipse cx="0" cy="-26" rx="6" ry="16" fill="url(#gradDaisy)" transform="rotate(${a})"/>`;
    }
    return `
    <g class="flor-interactiva flor-margarita" data-type="margarita" transform="rotate(${rotation}) scale(${scale})" style="transform-origin: 0 0;">
      <g filter="drop-shadow(0 2px 5px rgba(110,60,10,0.2))">
        ${p}
        <circle r="14" fill="url(#gradSunCore)"/>
        <circle r="8" fill="#B45309"/>
        <circle r="3" fill="#FDE047"/>
      </g>
    </g>`;
  },

  // Rama de follaje: Eucalipto verde plateado y helecho
  eucalyptusBranch: (scale = 1, rotation = 0) => {
    return `
    <g transform="rotate(${rotation}) scale(${scale})" opacity="0.95">
      <path d="M0 80 Q -10 20 -15 -60" stroke="#4A7C59" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <!-- Hojas redondeadas a los lados -->
      <g transform="translate(-4, 45) rotate(-35)"><ellipse rx="15" ry="11" fill="#588B67"/><ellipse rx="12" ry="8" fill="#6FA45C" opacity="0.7"/></g>
      <g transform="translate(-3, 20) rotate(35)"><ellipse rx="16" ry="12" fill="#4D7F5C"/><ellipse rx="13" ry="9" fill="#6FA45C" opacity="0.7"/></g>
      <g transform="translate(-10, -10) rotate(-40)"><ellipse rx="17" ry="13" fill="#588B67"/><ellipse rx="14" ry="10" fill="#7CB668" opacity="0.7"/></g>
      <g transform="translate(-12, -35) rotate(30)"><ellipse rx="15" ry="11" fill="#4D7F5C"/><ellipse rx="12" ry="8" fill="#6FA45C" opacity="0.7"/></g>
      <g transform="translate(-15, -60) rotate(-10)"><ellipse rx="13" ry="10" fill="#6FA45C"/><ellipse rx="10" ry="7" fill="#8AC875" opacity="0.7"/></g>
    </g>`;
  },

  // Gypsophila (Paniculata / Flor blanca nube de relleno)
  babyBreath: (scale = 1, rotation = 0) => {
    return `
    <g transform="rotate(${rotation}) scale(${scale})" opacity="0.9">
      <path d="M0 60 Q 5 20 0 -30 M0 20 Q 20 0 35 -20 M0 10 Q -20 -5 -30 -25" stroke="#7BA86B" stroke-width="2" fill="none"/>
      <!-- Capullos diminutos -->
      <circle cx="0" cy="-30" r="3.8" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FFF)"/>
      <circle cx="-10" cy="-36" r="3.2" fill="#FFFDE7"/>
      <circle cx="10" cy="-38" r="3.2" fill="#FFFDE7"/>
      <circle cx="35" cy="-20" r="3.5" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FFF)"/>
      <circle cx="28" cy="-30" r="3" fill="#FFFDE7"/>
      <circle cx="42" cy="-28" r="2.8" fill="#FFF9C4"/>
      <circle cx="-30" cy="-25" r="3.5" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FFF)"/>
      <circle cx="-38" cy="-35" r="3" fill="#FFFDE7"/>
      <circle cx="-22" cy="-35" r="2.8" fill="#FFF9C4"/>
    </g>`;
  }
};

class MasterpieceBouquet {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.options = Object.assign({
      isMini: false,
      interactive: true,
      recipientName: "Maria Iboni <3"
    }, options);

    this.render();
  }

  render() {
    if (!this.container) return;

    const width = this.options.isMini ? 320 : 540;
    const height = this.options.isMini ? 340 : 580;
    const viewBox = this.options.isMini ? "-160 -190 320 340" : "-270 -310 540 580";

    const svgHTML = `
    <svg class="masterpiece-bouquet-svg ${this.options.isMini ? 'bouquet-mini-svg' : 'bouquet-hero-svg'}" 
         viewBox="${viewBox}" 
         width="100%" 
         height="100%" 
         xmlns="http://www.w3.org/2000/svg"
         role="img" 
         aria-label="Hermoso ramo de flores amarillas para ${this.options.recipientName}">
      
      <!-- DEFINICIONES DE DEGRADADOS Y FILTROS -->
      <defs>
        <!-- Girasol degradado exterior -->
        <linearGradient id="gradSunOuter" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="90%" stop-color="#FDE047" />
          <stop offset="100%" stop-color="#FEF08A" />
        </linearGradient>

        <!-- Girasol degradado interior -->
        <linearGradient id="gradSunInner" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#B45309" />
          <stop offset="50%" stop-color="#FBBF24" />
          <stop offset="100%" stop-color="#FEF9C3" />
        </linearGradient>

        <!-- Centro del girasol -->
        <radialGradient id="gradSunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2D1507" />
          <stop offset="65%" stop-color="#4E270E" />
          <stop offset="85%" stop-color="#783D15" />
          <stop offset="100%" stop-color="#B45309" />
        </radialGradient>

        <!-- Rosas -->
        <linearGradient id="gradRoseOut" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="60%" stop-color="#FBBF24"/>
          <stop offset="100%" stop-color="#FEF08A"/>
        </linearGradient>
        <linearGradient id="gradRoseMid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#B45309"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#FDE047"/>
        </linearGradient>

        <!-- Tulipán -->
        <linearGradient id="gradTulipLeft" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="70%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#FEF08A"/>
        </linearGradient>
        <linearGradient id="gradTulipRight" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="70%" stop-color="#FBBF24"/>
          <stop offset="100%" stop-color="#FEF9C3"/>
        </linearGradient>

        <!-- Margarita -->
        <linearGradient id="gradDaisy" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="50%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#FFFFFF"/>
        </linearGradient>

        <!-- Papel Kraft Envoltura -->
        <linearGradient id="gradKraftBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D5B083"/>
          <stop offset="50%" stop-color="#BE976B"/>
          <stop offset="100%" stop-color="#A57D52"/>
        </linearGradient>
        <linearGradient id="gradKraftFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E8CEAE"/>
          <stop offset="70%" stop-color="#D0A87B"/>
          <stop offset="100%" stop-color="#B68B5E"/>
        </linearGradient>
        <linearGradient id="gradKraftFrontRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#DFBF9B"/>
          <stop offset="70%" stop-color="#C59C6F"/>
          <stop offset="100%" stop-color="#A97E52"/>
        </linearGradient>

        <!-- Cinta de raso / Moño -->
        <linearGradient id="gradRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E53935"/>
          <stop offset="50%" stop-color="#EF5350"/>
          <stop offset="100%" stop-color="#C62828"/>
        </linearGradient>
        <linearGradient id="gradGoldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="50%" stop-color="#EAB308"/>
          <stop offset="100%" stop-color="#A16207"/>
        </linearGradient>

        <!-- Sombra proyectada -->
        <filter id="shadowBouquet" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#4E2B0C" flood-opacity="0.32"/>
        </filter>
        <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- SOMBRA GENERAL EN LA BASE -->
      <ellipse cx="0" cy="${this.options.isMini ? 120 : 210}" rx="${this.options.isMini ? 70 : 130}" ry="${this.options.isMini ? 14 : 24}" fill="rgba(82,44,17,0.28)" filter="blur(6px)"/>

      <!-- ENVOLTURA TRASERA (FONDO DE PAPEL KRAFT) -->
      <g class="envoltura-trasera" filter="url(#shadowBouquet)">
        <polygon points="-160,-120 160,-120 70,190 -70,190" fill="url(#gradKraftBack)"/>
        <!-- Dobleces estéticos posteriores -->
        <polygon points="-160,-120 -195,-60 -70,190" fill="#9F764C" opacity="0.75"/>
        <polygon points="160,-120 195,-60 70,190" fill="#9F764C" opacity="0.75"/>
      </g>

      <!-- CAPA 1: FOLLAJE DE FONDO Y RAMAS -->
      <g class="capa-follaje-fondo">
        <!-- Eucalipto y ramas abiertas -->
        <g transform="translate(-90, -40)">${BOUQUET_ASSETS.eucalyptusBranch(1.1, -48)}</g>
        <g transform="translate(90, -40)">${BOUQUET_ASSETS.eucalyptusBranch(1.1, 48)}</g>
        <g transform="translate(-130, -90)">${BOUQUET_ASSETS.babyBreath(1.1, -30)}</g>
        <g transform="translate(130, -90)">${BOUQUET_ASSETS.babyBreath(1.1, 30)}</g>
        <g transform="translate(0, -140)">${BOUQUET_ASSETS.babyBreath(1.2, 0)}</g>
      </g>

      <!-- CAPA 2: TALLOS VISIBLES EN INTERIOR -->
      <g class="capa-tallos" stroke="#4A7C59" stroke-width="7" stroke-linecap="round" opacity="0.8">
        <line x1="-70" y1="-80" x2="-20" y2="90"/>
        <line x1="-30" y1="-120" x2="-10" y2="90"/>
        <line x1="0" y1="-130" x2="0" y2="90"/>
        <line x1="30" y1="-120" x2="10" y2="90"/>
        <line x1="70" y1="-80" x2="20" y2="90"/>
      </g>

      <!-- CAPA 3: FLORES SECUNDARIAS (NIVEL MEDIO-ALTO) -->
      <g class="capa-flores-fondo">
        <!-- Tulipán izquierdo alto -->
        <g class="flor-nodo" transform="translate(-85, -135)">${BOUQUET_ASSETS.tulip(1.05, -24)}</g>
        <!-- Margarita dorada arriba centro -->
        <g class="flor-nodo" transform="translate(0, -175)">${BOUQUET_ASSETS.sunflower(1, 0.76, 12)}</g>
        <!-- Tulipán derecho alto -->
        <g class="flor-nodo" transform="translate(85, -135)">${BOUQUET_ASSETS.tulip(1.05, 24)}</g>
        <!-- Rosa izquierda media -->
        <g class="flor-nodo" transform="translate(-125, -60)">${BOUQUET_ASSETS.rose(0.95, -15)}</g>
        <!-- Rosa derecha media -->
        <g class="flor-nodo" transform="translate(125, -60)">${BOUQUET_ASSETS.rose(0.95, 15)}</g>
      </g>

      <!-- CAPA 4: FLORES PROTAGONISTAS (GIRASOLES MAJESTUOSOS CENTRO) -->
      <g class="capa-flores-principales">
        <!-- Girasol Centro-Izquierdo -->
        <g class="flor-nodo" transform="translate(-65, -55)">
          ${BOUQUET_ASSETS.sunflower(2, 1.12, -8)}
        </g>
        <!-- Girasol Centro-Derecho -->
        <g class="flor-nodo" transform="translate(65, -55)">
          ${BOUQUET_ASSETS.sunflower(3, 1.12, 16)}
        </g>
        <!-- Gran Girasol Central Solemne -->
        <g class="flor-nodo" transform="translate(0, -5)">
          ${BOUQUET_ASSETS.sunflower(4, 1.34, 0)}
        </g>
        <!-- Margaritas y acentos florales que sobresalen -->
        <g class="flor-nodo" transform="translate(-105, 20)">${BOUQUET_ASSETS.daisy(1.0, -18)}</g>
        <g class="flor-nodo" transform="translate(105, 20)">${BOUQUET_ASSETS.daisy(1.0, 18)}</g>
        <g class="flor-nodo" transform="translate(0, -95)">${BOUQUET_ASSETS.rose(0.9, 0)}</g>
      </g>

      <!-- CAPA 5: FOLLAJE DELANTERO SOBRESALIENDO DEL PAPEL -->
      <g class="capa-follaje-frente">
        <g transform="translate(-85, 35)">${BOUQUET_ASSETS.eucalyptusBranch(0.8, -75)}</g>
        <g transform="translate(85, 35)">${BOUQUET_ASSETS.eucalyptusBranch(0.8, 75)}</g>
        <g transform="translate(0, 45)">${BOUQUET_ASSETS.babyBreath(0.85, 0)}</g>
      </g>

      <!-- CAPA 6: ENVOLTURA DELANTERA DE PAPEL KRAFT EN CAPAS Y PLIEGUES REALISTAS -->
      <g class="envoltura-frontal" filter="drop-shadow(0 -4px 10px rgba(0,0,0,0.18))">
        <!-- Papel de seda blanco interior con ligera transparencia -->
        <polygon points="-120,25 0,110 120,25 70,185 -70,185" fill="#FFFDF5" opacity="0.5"/>

        <!-- Solapa Izquierda de Kraft -->
        <polygon points="-155,-5 25,95 -45,210 -95,195" fill="url(#gradKraftFrontLeft)" filter="drop-shadow(3px 4px 6px rgba(0,0,0,0.22))"/>

        <!-- Solapa Derecha de Kraft (se cruza elegantemente por encima) -->
        <polygon points="155,-5 -35,100 45,210 95,195" fill="url(#gradKraftFrontRight)" filter="drop-shadow(-4px 4px 8px rgba(0,0,0,0.28))"/>

        <!-- Detalle de pliegue central -->
        <line x1="-35" y1="100" x2="45" y2="210" stroke="#7A522A" stroke-width="1.8" opacity="0.4"/>
      </g>

      <!-- CAPA 7: LAZO Y MOÑO DE SEDA ROJO / DORADO CON NUDO Y COLITAS CAYENDO -->
      <g class="moño-lazo" transform="translate(0, 115)" filter="drop-shadow(0 6px 8px rgba(80,20,20,0.35))">
        <!-- Colas de la cinta cayendo -->
        <path d="M-12 15 Q -35 55 -28 95 Q -25 80 -18 65 Q -8 40 -6 18 Z" fill="url(#gradRibbon)"/>
        <path d="M12 15 Q 35 55 28 95 Q 25 80 18 65 Q 8 40 6 18 Z" fill="url(#gradRibbon)"/>
        
        <!-- Lazos circulares (orejitas del moño) -->
        <path d="M0 0 C -45 -35, -80 -10, -50 16 C -25 32, -8 10, 0 2 Z" fill="url(#gradRibbon)"/>
        <path d="M0 0 C -40 -25, -65 -5, -42 12 C -20 22, -8 8, 0 2 Z" fill="#EF5350" opacity="0.8"/>

        <path d="M0 0 C 45 -35, 80 -10, 50 16 C 25 32, 8 10, 0 2 Z" fill="url(#gradRibbon)"/>
        <path d="M0 0 C 40 -25, 65 -5, 42 12 C 20 22, 8 8, 0 2 Z" fill="#EF5350" opacity="0.8"/>

        <!-- Nudo central -->
        <circle cx="0" cy="4" r="13" fill="url(#gradRibbon)"/>
        <circle cx="0" cy="4" r="9" fill="#B71C1C"/>
        <circle cx="-3" cy="2" r="3" fill="#FF8A80" opacity="0.75"/>

        <!-- Etiqueta dorada colgante: 'Con amor' -->
        <g transform="translate(18, 25) rotate(15)" class="etiqueta-amor">
          <line x1="0" y1="0" x2="8" y2="18" stroke="#D4AF37" stroke-width="1.8"/>
          <rect x="-2" y="18" width="54" height="24" rx="5" fill="#FFFDF2" stroke="#D4AF37" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>
          <text x="25" y="34" font-family="'Playfair Display', serif" font-weight="bold" font-size="9" fill="#8C531B" text-anchor="middle">Maria Iboni &lt;3</text>
        </g>
      </g>

    </svg>
    `;

    this.container.innerHTML = svgHTML;

    if (this.options.interactive) {
      this.attachFlowerInteractions();
    }
  }

  attachFlowerInteractions() {
    const flores = this.container.querySelectorAll('.flor-nodo');
    const lovePhrases = [
      "¡Eres mi sol! 🌻",
      "Maria Iboni <3",
      "Iluminas todo ✨",
      "Hermosa siempre 💛",
      "Con todo mi amor 💖",
      "Sonríe hoy 🌸",
      "Un día radiante ☀️"
    ];

    flores.forEach((flor, idx) => {
      flor.style.cursor = 'pointer';
      flor.addEventListener('mouseenter', () => {
        flor.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
        flor.style.transform += ' scale(1.14)';
      });

      flor.addEventListener('mouseleave', () => {
        flor.style.transform = flor.style.transform.replace(' scale(1.14)', '');
      });

      flor.addEventListener('click', (e) => {
        e.stopPropagation();
        // Dispara sonido arpegiado
        if (window.romanticAudio) {
          window.romanticAudio.playMagicChime('sparkle');
        }

        // Rebote visual
        flor.animate([
          { transform: flor.style.transform + ' scale(1.24) rotate(-5deg)' },
          { transform: flor.style.transform + ' scale(0.92) rotate(4deg)' },
          { transform: flor.style.transform + ' scale(1.08) rotate(-2deg)' },
          { transform: flor.style.transform }
        ], { duration: 600, easing: 'ease-out' });

        // Partículas saliendo de la flor
        const rect = flor.getBoundingClientRect();
        this.spawnPollenBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Burbujita flotante con frase tierna
        const phrase = lovePhrases[idx % lovePhrases.length];
        this.spawnFloatingBubble(rect.left + rect.width / 2, rect.top, phrase);
      });
    });
  }

  spawnPollenBurst(x, y) {
    const symbols = ['✨', '💛', '🌻', '⭐', '💖', '•'];
    const colors = ['#FFD700', '#FFA500', '#FFF', '#FF69B4', '#FFE4B5'];

    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'particula-polen';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: ${colors[i % colors.length]};
        font-size: ${12 + Math.random() * 16}px;
        pointer-events: none;
        z-index: 9999;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(255,215,0,0.8);
        transition: transform 1.2s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 1.2s ease-out;
      `;
      document.body.appendChild(p);

      const angle = (Math.PI * 2 / 16) * i + (Math.random() * 0.4 - 0.2);
      const dist = 60 + Math.random() * 90;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30;

      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(${0.4 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1300);
    }
  }

  spawnFloatingBubble(x, y, text) {
    const bubble = document.createElement('div');
    bubble.className = 'burbuja-ramo-amor';
    bubble.textContent = text;
    bubble.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -100%) scale(0.6);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border: 2px solid #F59E0B;
      color: #78350F;
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 6px 14px;
      border-radius: 20px;
      box-shadow: 0 8px 24px rgba(180,83,9,0.3);
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transition: all 0.9s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    `;
    document.body.appendChild(bubble);

    requestAnimationFrame(() => {
      bubble.style.transform = 'translate(-50%, -170%) scale(1.05)';
      bubble.style.opacity = '1';
    });

    setTimeout(() => {
      bubble.style.transform = 'translate(-50%, -230%) scale(0.85)';
      bubble.style.opacity = '0';
      setTimeout(() => bubble.remove(), 900);
    }, 1400);
  }
}

/**
 * Lluvia de pétalos dorados continuos con animación fluida
 */
class PetalRainSystem {
  constructor(containerId = 'petalos-fondo', count = 30) {
    this.container = document.getElementById(containerId);
    this.count = count;
    this.petals = [];
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = '';
    const tones = [
      ['#FDE047', '#EAB308'],
      ['#FACC15', '#CA8A04'],
      ['#FEF08A', '#F59E0B'],
      ['#FFFBEB', '#FBBF24']
    ];

    for (let i = 0; i < this.count; i++) {
      const p = document.createElement('div');
      p.className = 'petalo-flotante';
      const [fill, stroke] = tones[i % tones.length];
      const w = 14 + Math.random() * 16;
      const h = w * (1.3 + Math.random() * 0.4);

      p.innerHTML = `
        <svg viewBox="0 0 24 32" width="${w}" height="${h}">
          <path d="M12 2 C 21 8, 22 22, 12 30 C 2 22, 3 8, 12 2 Z" fill="${fill}" stroke="${stroke}" stroke-width="0.8" opacity="0.9"/>
          <line x1="12" y1="4" x2="12" y2="28" stroke="${stroke}" stroke-width="0.6" opacity="0.5"/>
        </svg>
      `;

      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (-Math.random() * 16) + 's';
      p.style.opacity = 0.5 + Math.random() * 0.45;

      this.container.appendChild(p);
    }
  }
}

/**
 * Explosión de confeti y fuegos de flores al abrir la caja
 */
function triggerGiftSurpriseExplosion(centerX, centerY) {
  const count = 75;
  const colors = ['#F59E0B', '#FBBF24', '#FDE047', '#EF4444', '#EC4899', '#10B981', '#FFFFFF'];
  const shapes = ['rect', 'circle', 'heart', 'star'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    el.className = `particula-confeti confeti-${shape}`;

    const size = 10 + Math.random() * 14;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.position = 'fixed';
    el.style.left = centerX + 'px';
    el.style.top = centerY + 'px';
    el.style.zIndex = '99999';
    el.style.pointerEvents = 'none';

    if (shape === 'circle') {
      el.style.borderRadius = '50%';
      el.style.background = colors[i % colors.length];
    } else if (shape === 'heart') {
      el.textContent = '💛';
      el.style.fontSize = size + 'px';
      el.style.lineHeight = '1';
    } else if (shape === 'star') {
      el.textContent = '✨';
      el.style.fontSize = size + 'px';
      el.style.lineHeight = '1';
    } else {
      el.style.borderRadius = '3px';
      el.style.background = colors[i % colors.length];
    }

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = 130 + Math.random() * 320;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - (100 + Math.random() * 140);
    const rotation = (Math.random() - 0.5) * 1200;

    el.animate([
      { transform: 'translate(0, 0) scale(0.6) rotate(0deg)', opacity: 1 },
      { transform: `translate(${destX * 0.5}px, ${destY * 0.8}px) scale(1.2) rotate(${rotation * 0.5}deg)`, opacity: 0.95, offset: 0.4 },
      { transform: `translate(${destX}px, ${destY + 220}px) scale(0.8) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1800 + Math.random() * 700,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    }).onfinish = () => el.remove();
  }
}

window.MasterpieceBouquet = MasterpieceBouquet;
window.PetalRainSystem = PetalRainSystem;
window.triggerGiftSurpriseExplosion = triggerGiftSurpriseExplosion;
