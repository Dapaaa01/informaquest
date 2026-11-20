// ==========================================
// 4. WEB AUDIO ENGINE
// ==========================================
const SoundEngine = {
  ctx: null,
  isMuted: false,
  bgmInterval: null,
  stepIdx: 0,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  startBGM() {
    this.init();
    if (this.bgmInterval) return;
    const leadNotes = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.00, 698.46,
      523.25, 659.25, 783.99, 1046.50,
      987.77, 783.99, 659.25, 587.33
    ];
    const bassNotes = [130.81, 130.81, 146.83, 146.83, 174.61, 174.61, 196.00, 196.00];

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(leadNotes[this.stepIdx % leadNotes.length], now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.028, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);

      if (this.stepIdx % 2 === 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = "sine";
        bOsc.frequency.setValueAtTime(bassNotes[(this.stepIdx / 2) % bassNotes.length], now);
        bGain.gain.setValueAtTime(0.035, now);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.42);
      }

      this.stepIdx++;
    }, 340);
  },

  playClick() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  },

  playWhoosh() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.2);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  },

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const now = this.ctx.currentTime + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    });
  },

  playWrong() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(185, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  },

  playDisqualified() {
    if (this.isMuted) return;
    this.init();
    [220, 165, 110].forEach((f, i) => {
      const now = this.ctx.currentTime + i * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  },

  playLevelClear() {
    if (this.isMuted) return;
    this.init();
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
      const now = this.ctx.currentTime + i * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
    });
  }
};

function toggleAudioSystem() {
  SoundEngine.init();
  SoundEngine.isMuted = !SoundEngine.isMuted;
  if (!SoundEngine.isMuted) {
    SoundEngine.startBGM();
    SoundEngine.playClick();
  }
  const navBtn = document.getElementById("audio-toggle-btn");
  const quizBtn = document.getElementById("quiz-audio-btn");
  if (navBtn) {
    navBtn.textContent = SoundEngine.isMuted ? "🔇 SFX: OFF" : "🔊 SFX: ON";
    navBtn.classList.toggle("muted", SoundEngine.isMuted);
  }
  if (quizBtn) {
    quizBtn.textContent = SoundEngine.isMuted ? "🔇 OFF" : "🔊 SFX";
  }
}