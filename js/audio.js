/**
 * Reproductor y Sintetizador de Audio Romántico para Flores Amarillas
 * Incluye sintetizador Web Audio API autónomo (caja musical de ensueño)
 * y soporte para pistas de audio MP3 externas.
 */

class RomanticAudioController {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.synthLoopInterval = null;
    this.htmlAudio = null;
    this.customUrl = "";
    this.synthActive = true;
    this.volume = 0.6;
    this.step = 0;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Toca una nota suave tipo arpa o caja de música
  playBellNote(freq, duration = 1.6, delay = 0, gainLevel = 0.28) {
    this.initAudioContext();
    if (!this.audioCtx) return;

    setTimeout(() => {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, this.audioCtx.currentTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Añade una armónica suave para calidez
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, this.audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.08 * this.volume, this.audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration * 0.8);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(gainLevel * this.volume, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
      } catch (e) {
        console.warn("Error sintetizando nota:", e);
      }
    }, delay * 1000);
  }

  // Acorde arpegiado mágico (al tocar flores o abrir regalo)
  playMagicChime(chordType = 'happy') {
    this.initAudioContext();
    const notes = chordType === 'sparkle'
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C5, E5, G5, C6, E6, G6
      : [440.00, 554.37, 659.25, 880.00, 1108.73]; // A4, C#5, E5, A5, C#6

    notes.forEach((freq, idx) => {
      this.playBellNote(freq, 1.8, idx * 0.075, 0.22);
    });
  }

  // Melodía romántica en bucle ("Flores Amarillas" vibra dulce y nostálgica)
  startSynthMelody() {
    this.stopSynthMelody();
    this.initAudioContext();
    this.isPlaying = true;

    // Progresión romántica (Do Mayor - Sol Mayor - La menor - Fa Mayor)
    // Con notas melódicas pentatónicas y vals delicado
    const melodyPattern = [
      { f: 523.25, d: 1.4 }, { f: 659.25, d: 1.0 }, { f: 783.99, d: 1.5 }, { f: 1046.50, d: 2.2 },
      { f: 880.00, d: 1.4 }, { f: 783.99, d: 1.0 }, { f: 659.25, d: 1.8 }, { f: 587.33, d: 1.2 },
      { f: 523.25, d: 1.4 }, { f: 587.33, d: 1.0 }, { f: 659.25, d: 1.6 }, { f: 783.99, d: 2.0 },
      { f: 698.46, d: 1.4 }, { f: 659.25, d: 1.2 }, { f: 587.33, d: 1.6 }, { f: 523.25, d: 2.6 },
      // Segundo verso
      { f: 659.25, d: 1.2 }, { f: 783.99, d: 1.2 }, { f: 880.00, d: 1.8 }, { f: 1046.50, d: 2.4 },
      { f: 987.77, d: 1.2 }, { f: 880.00, d: 1.2 }, { f: 783.99, d: 1.8 }, { f: 659.25, d: 2.0 },
      { f: 587.33, d: 1.2 }, { f: 659.25, d: 1.2 }, { f: 783.99, d: 1.8 }, { f: 587.33, d: 1.8 },
      { f: 523.25, d: 3.2 }
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlaying) return;
      const note = melodyPattern[noteIdx % melodyPattern.length];
      this.playBellNote(note.f, note.d, 0, 0.24);

      // Acompañamiento armónico suave de fondo cada 2 notas
      if (noteIdx % 2 === 0) {
        this.playBellNote(note.f / 2, 2.0, 0, 0.12);
      }

      noteIdx++;
      this.synthLoopInterval = setTimeout(playNext, 620);
    };

    playNext();
  }

  stopSynthMelody() {
    if (this.synthLoopInterval) {
      clearTimeout(this.synthLoopInterval);
      this.synthLoopInterval = null;
    }
  }

  playMusic(customUrl = "") {
    this.initAudioContext();
    if (customUrl) {
      this.customUrl = customUrl;
    }

    if (this.customUrl) {
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio(this.customUrl);
        this.htmlAudio.loop = true;
      } else if (this.htmlAudio.src !== this.customUrl) {
        this.htmlAudio.src = this.customUrl;
      }
      this.htmlAudio.volume = this.volume;
      this.htmlAudio.play().then(() => {
        this.isPlaying = true;
        this.updateBtnUI();
      }).catch(err => {
        console.warn("Fallo reproducción MP3, usando sintetizador musical:", err);
        this.startSynthMelody();
        this.updateBtnUI();
      });
    } else {
      this.startSynthMelody();
      this.updateBtnUI();
    }
  }

  pauseMusic() {
    this.isPlaying = false;
    this.stopSynthMelody();
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    this.updateBtnUI();
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic(this.customUrl);
    }
  }

  updateBtnUI() {
    const btn = document.getElementById('btn-musica');
    const onda = document.getElementById('onda');
    if (!btn) return;

    if (this.isPlaying) {
      btn.classList.add('tocando');
      btn.setAttribute('aria-label', 'Pausar música');
      if (onda) onda.style.opacity = '1';
    } else {
      btn.classList.remove('tocando');
      btn.setAttribute('aria-label', 'Reproducir música');
      if (onda) onda.style.opacity = '0';
    }
  }
}

window.romanticAudio = new RomanticAudioController();
