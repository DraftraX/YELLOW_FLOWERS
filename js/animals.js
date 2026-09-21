/**
 * Banda de Animalitos Amigos - Flores Amarillas
 * Ilustraciones SVG limpias, dinámicas e interactivas
 */

const ANIMAL_SVGS = {
  gato: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Orejas -->
      <polygon points="22,35 16,10 38,24" fill="#F59E0B"/>
      <polygon points="68,35 74,10 52,24" fill="#F59E0B"/>
      <polygon points="24,31 20,16 34,25" fill="#FECDD3"/>
      <polygon points="66,31 70,16 56,25" fill="#FECDD3"/>
      <!-- Cabeza -->
      <circle cx="45" cy="50" r="28" fill="#FBBF24"/>
      <circle cx="45" cy="54" r="18" fill="#FEF3C7" opacity="0.8"/>
      <!-- Ojos tiernos con brillo -->
      <ellipse cx="35" cy="46" rx="4" ry="5" fill="#3E2723"/>
      <circle cx="36.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <ellipse cx="55" cy="46" rx="4" ry="5" fill="#3E2723"/>
      <circle cx="56.5" cy="44.5" r="1.5" fill="#FFFFFF"/>
      <!-- Nariz y boca -->
      <polygon points="45,53 42,50 48,50" fill="#E11D48"/>
      <path d="M41 55 Q 45 59 45 55 Q 45 59 49 55" stroke="#3E2723" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Bigotes -->
      <line x1="20" y1="50" x2="30" y2="52" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="56" x2="29" y2="56" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="70" y1="50" x2="60" y2="52" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="72" y1="56" x2="61" y2="56" stroke="#3E2723" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Flor amarilla en la orejita -->
      <g transform="translate(68, 28) scale(0.6)">
        <circle cx="0" cy="0" r="6" fill="#FDE047"/>
        <circle cx="0" cy="0" r="2.5" fill="#B45309"/>
      </g>
    </svg>
  `,

  perrito: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Orejas caídas suaves -->
      <ellipse cx="20" cy="46" rx="10" ry="18" fill="#B45309" transform="rotate(-15 20 46)"/>
      <ellipse cx="70" cy="46" rx="10" ry="18" fill="#B45309" transform="rotate(15 70 46)"/>
      <!-- Cabeza -->
      <circle cx="45" cy="48" r="28" fill="#F59E0B"/>
      <!-- Hocico crema -->
      <ellipse cx="45" cy="58" rx="16" ry="12" fill="#FFFBEB"/>
      <!-- Ojos felices -->
      <circle cx="34" cy="44" r="4.5" fill="#3E2723"/>
      <circle cx="35.5" cy="42.5" r="1.5" fill="#FFF"/>
      <circle cx="56" cy="44" r="4.5" fill="#3E2723"/>
      <circle cx="57.5" cy="42.5" r="1.5" fill="#FFF"/>
      <!-- Nariz grande y tierna -->
      <ellipse cx="45" cy="54" rx="5" ry="3.5" fill="#1F2937"/>
      <!-- Lengüita feliz asomándose -->
      <path d="M43 62 Q 45 68 47 62" fill="#F43F5E"/>
      <!-- Mancha de amor sobre el ojo -->
      <ellipse cx="56" cy="42" rx="9" ry="8" fill="#D97706" opacity="0.35"/>
    </svg>
  `,

  conejito: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Orejas largas -->
      <ellipse cx="32" cy="22" rx="7.5" ry="20" fill="#FFFFFF"/>
      <ellipse cx="32" cy="22" rx="4" ry="14" fill="#FBCFE8"/>
      <ellipse cx="58" cy="22" rx="7.5" ry="20" fill="#FFFFFF"/>
      <ellipse cx="58" cy="22" rx="4" ry="14" fill="#FBCFE8"/>
      <!-- Cabeza redondita -->
      <circle cx="45" cy="54" r="26" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
      <!-- Mejillas sonrojadas -->
      <circle cx="28" cy="58" r="5" fill="#F472B6" opacity="0.4"/>
      <circle cx="62" cy="58" r="5" fill="#F472B6" opacity="0.4"/>
      <!-- Ojos cerrados felices -->
      <path d="M30 50 Q 35 46 40 50" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M50 50 Q 55 46 60 50" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Naricita y boca -->
      <ellipse cx="45" cy="56" rx="2.5" ry="2" fill="#FB7185"/>
      <path d="M42 60 Q 45 63 45 60 Q 45 63 48 60" stroke="#475569" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Flor amarilla entre las orejitas -->
      <circle cx="45" cy="34" r="6" fill="#FACC15"/>
      <circle cx="45" cy="34" r="2.5" fill="#EAB308"/>
    </svg>
  `,

  abeja: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Alas translúcidas que aletean -->
      <ellipse cx="34" cy="30" rx="12" ry="17" fill="#E0F2FE" opacity="0.8" transform="rotate(-25 34 30)"/>
      <ellipse cx="56" cy="30" rx="12" ry="17" fill="#E0F2FE" opacity="0.8" transform="rotate(25 56 30)"/>
      <!-- Cuerpo gordito a rayas -->
      <ellipse cx="45" cy="54" rx="24" ry="19" fill="#FACC15"/>
      <!-- Franjas negras -->
      <path d="M31 46 Q 45 54 59 46 V 52 Q 45 60 31 52 Z" fill="#292524"/>
      <path d="M35 60 Q 45 66 55 60 V 64 Q 45 70 35 64 Z" fill="#292524"/>
      <!-- Ojitos kawaii -->
      <circle cx="36" cy="46" r="3.2" fill="#292524"/>
      <circle cx="37" cy="45" r="1.2" fill="#FFF"/>
      <circle cx="54" cy="46" r="3.2" fill="#292524"/>
      <circle cx="55" cy="45" r="1.2" fill="#FFF"/>
      <!-- Mejillas -->
      <circle cx="30" cy="50" r="3" fill="#F87171" opacity="0.5"/>
      <circle cx="60" cy="50" r="3" fill="#F87171" opacity="0.5"/>
      <!-- Sonrisa -->
      <path d="M42 52 Q 45 56 48 52" stroke="#292524" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Antenitas -->
      <path d="M38 38 Q 32 30 28 32" stroke="#292524" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="32" r="2.2" fill="#292524"/>
      <path d="M52 38 Q 58 30 62 32" stroke="#292524" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="62" cy="32" r="2.2" fill="#292524"/>
    </svg>
  `,

  pollito: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Alitas -->
      <ellipse cx="23" cy="54" rx="7" ry="10" fill="#FBBF24" transform="rotate(20 23 54)"/>
      <ellipse cx="67" cy="54" rx="7" ry="10" fill="#FBBF24" transform="rotate(-20 67 54)"/>
      <!-- Cuerpo esférico y suave -->
      <circle cx="45" cy="50" r="25" fill="#FEF08A"/>
      <!-- Mechón de plumas arriba -->
      <path d="M45 25 Q 48 16 54 18 Q 48 24 45 25 Z" fill="#FACC15"/>
      <path d="M45 25 Q 42 16 36 18 Q 42 24 45 25 Z" fill="#FACC15"/>
      <!-- Ojos grandes y tiernos -->
      <circle cx="36" cy="46" r="3.8" fill="#1F2937"/>
      <circle cx="37.5" cy="44.5" r="1.5" fill="#FFF"/>
      <circle cx="54" cy="46" r="3.8" fill="#1F2937"/>
      <circle cx="55.5" cy="44.5" r="1.5" fill="#FFF"/>
      <!-- Piquito naranja -->
      <polygon points="41,51 49,51 45,58" fill="#F97316"/>
      <!-- Patitas amarillas -->
      <path d="M38 74 L 38 80 M40 80 L 36 80" stroke="#F97316" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M52 74 L 52 80 M54 80 L 50 80" stroke="#F97316" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `,

  capibara: `
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <!-- Orejitas redondas pequeñas -->
      <ellipse cx="28" cy="28" rx="6" ry="7" fill="#854D0E"/>
      <ellipse cx="62" cy="28" rx="6" ry="7" fill="#854D0E"/>
      <ellipse cx="28" cy="28" rx="3.5" ry="4" fill="#FEF08A" opacity="0.6"/>
      <ellipse cx="62" cy="28" rx="3.5" ry="4" fill="#FEF08A" opacity="0.6"/>
      <!-- Cabeza rectangular redondeada relajada -->
      <rect x="24" y="32" width="42" height="42" rx="16" fill="#A16207"/>
      <!-- Hocico característico -->
      <rect x="30" y="52" width="30" height="22" rx="10" fill="#713F12"/>
      <!-- Ojos entrecerrados en máxima paz -->
      <line x1="32" y1="46" x2="38" y2="46" stroke="#451A03" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="52" y1="46" x2="58" y2="46" stroke="#451A03" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Fosas nasales -->
      <circle cx="41" cy="60" r="1.8" fill="#451A03"/>
      <circle cx="49" cy="60" r="1.8" fill="#451A03"/>
      <!-- Pequeña flor amarilla en su cabeza (tradicional) -->
      <g transform="translate(45, 26)">
        <circle cx="0" cy="0" r="7" fill="#FACC15"/>
        <circle cx="0" cy="0" r="3" fill="#EA580C"/>
        <ellipse cx="6" cy="4" rx="4" ry="2" fill="#4ADE80" transform="rotate(30)"/>
      </g>
    </svg>
  `
};

class AnimalsBand {
  constructor(containerId, animalsData = []) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.animalsData = animalsData;
    this.render();
  }

  updateData(newAnimalsData) {
    this.animalsData = newAnimalsData;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const activeList = this.animalsData.filter(a => a.active !== false);
    if (activeList.length === 0) {
      this.container.innerHTML = `<p style="opacity:0.6;font-style:italic;">Todos los animalitos están descansando 💛</p>`;
      return;
    }

    activeList.forEach((item, idx) => {
      const svgCode = ANIMAL_SVGS[item.id] || ANIMAL_SVGS.gato;
      const card = document.createElement('div');
      card.className = 'tarjeta-animal';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.name}: ${item.msg}`);
      card.style.animationDelay = `${idx * 0.18}s`;

      card.innerHTML = `
        <div class="globo-dialogo" id="burbuja-${item.id}">
          <span class="globo-texto">${item.msg}</span>
        </div>
        <div class="icono-animal-svg">
          ${svgCode}
        </div>
        <span class="nombre-animal">${item.name}</span>
      `;

      // Interacción al clic / tap
      card.addEventListener('click', () => {
        this.triggerAnimalReaction(card, item);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.triggerAnimalReaction(card, item);
        }
      });

      this.container.appendChild(card);
    });
  }

  triggerAnimalReaction(card, item) {
    // Sonido suave
    if (window.romanticAudio) {
      window.romanticAudio.playMagicChime('happy');
    }

    // Animación de salto
    card.classList.remove('animar-salto');
    void card.offsetWidth; // Forzar reflow
    card.classList.add('animar-salto');

    // Muestra burbuja
    const burbuja = card.querySelector('.globo-dialogo');
    if (burbuja) {
      burbuja.classList.add('activo');
      setTimeout(() => burbuja.classList.remove('activo'), 3400);
    }

    // Desprende corazoncitos
    const rect = card.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'corazon-flotante';
    heart.textContent = '💛';
    heart.style.left = (rect.left + rect.width / 2) + 'px';
    heart.style.top = rect.top + 'px';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }
}

window.AnimalsBand = AnimalsBand;
window.ANIMAL_SVGS = ANIMAL_SVGS;
