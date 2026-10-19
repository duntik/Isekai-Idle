(function(root) {
  'use strict';

  // Procedural Web Audio API sound engine (0 KB audio files) for Isekai Idle
  // Designed with authentic Xianxia / Asian sacred instrument synthesis:
  // - Tibetan singing bowls for meditation & calm
  // - Meridian-shattering sub-bass gong & celestial crystal chimes for breakthroughs
  // - Filtered parchment noise bursts for story flips & archive inspection
  // - Metallic blade clashes & heavy physical impact punches for interactive duels
  // - Tense low-frequency binaural drones for dangerous encounters & ancient wards
  // - Subtle temple block / jade acoustic clicks for physical cultivation taps

  const isAudioAvailable = typeof window !== 'undefined' &&
    (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined');

  let ctx = null;
  let masterGain = null;
  let enabled = false;
  let volume = 0.4;
  const lastSoundTimes = {};
  const activeVoices = new Set();
  const MAX_VOICES = 20;

  // Read persisted user settings
  try {
    if (typeof localStorage !== 'undefined') {
      enabled = localStorage.getItem('isekai-sound-enabled') === 'true';
      const savedVol = parseFloat(localStorage.getItem('isekai-sound-volume'));
      if (!isNaN(savedVol) && savedVol >= 0 && savedVol <= 1) {
        volume = savedVol;
      }
    }
  } catch (e) {}

  function getAudioContext() {
    if (!isAudioAvailable) return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(enabled ? volume : 0, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended' && enabled) {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function canPlay(type, minIntervalMs = 40) {
    if (!enabled || !isAudioAvailable) return false;
    const now = Date.now();
    if (lastSoundTimes[type] && (now - lastSoundTimes[type]) < minIntervalMs) {
      return false;
    }
    lastSoundTimes[type] = now;
    return true;
  }

  function registerVoice(voiceNode) {
    if (activeVoices.size >= MAX_VOICES) {
      const oldest = activeVoices.values().next().value;
      if (oldest) {
        try { if (oldest.stop) oldest.stop(); } catch (e) {}
        activeVoices.delete(oldest);
      }
    }
    activeVoices.add(voiceNode);
    return () => {
      activeVoices.delete(voiceNode);
    };
  }

  function trackVoice(primaryNode, allNodes) {
    if (!primaryNode) return;
    const unregister = registerVoice(primaryNode);
    primaryNode.onended = () => {
      try {
        if (Array.isArray(allNodes)) {
          for (const n of allNodes) {
            if (n && typeof n.disconnect === 'function') n.disconnect();
          }
        }
      } catch (e) {}
      unregister();
    };
  }

  // Pre-generate / reuse white noise buffer for organic textures
  let noiseBuffer = null;
  function getNoiseBuffer(ac) {
    if (noiseBuffer && noiseBuffer.sampleRate === ac.sampleRate) return noiseBuffer;
    const bufferSize = ac.sampleRate * 1.5;
    noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  const IsekaiSound = {
    get enabled() {
      return enabled;
    },
    isMuted() {
      return !enabled;
    },
    getVolume() {
      return volume;
    },
    init() {
      if (enabled) getAudioContext();
    },
    toggle() {
      enabled = !enabled;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('isekai-sound-enabled', String(enabled));
        }
      } catch (e) {}

      if (enabled) {
        const ac = getAudioContext();
        if (ac && masterGain) {
          masterGain.gain.cancelScheduledValues(ac.currentTime);
          masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime);
          masterGain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.05);
          // Play a gentle Tibetan bowl chime to confirm activation
          this.playBowl(324, 2.8);
        }
      } else {
        if (ctx && masterGain) {
          masterGain.gain.cancelScheduledValues(ctx.currentTime);
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        }
      }
      return enabled;
    },
    setVolume(val) {
      const num = typeof val === 'number' ? val : parseFloat(val);
      if (isNaN(num)) return;
      volume = Math.max(0, Math.min(1, num));
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('isekai-sound-volume', String(volume));
        }
      } catch (e) {}

      if (enabled && ctx && masterGain) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.03);
      }
    },

    // 1. TIBETAN SINGING BOWL (Медитация, спокойствие, отдых)
    // Tibetan singing bowls produce a rich fundamental with subtle binaural beating (detuned twin)
    // and distinct inharmonic metal overtones (~2.76x and ~5.4x) with long organic exponential decay.
    playBowl(fundamental = 288, duration = 3.6) {
      if (!canPlay('bowl', 400)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const f0 = fundamental;

      // Partial 1: Fundamental Sine
      const osc1 = ac.createOscillator();
      const gain1 = ac.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f0, t0);
      gain1.gain.setValueAtTime(0, t0);
      gain1.gain.linearRampToValueAtTime(0.35, t0 + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      // Partial 2: Twin Detuned Sine (produces gentle 1.2Hz acoustic pulsing)
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f0 * 1.0035, t0);
      gain2.gain.setValueAtTime(0, t0);
      gain2.gain.linearRampToValueAtTime(0.28, t0 + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t0 + duration * 0.95);

      // Partial 3: Second Inharmonic Overtone (Singing bowl rim resonance ~2.76x)
      const osc3 = ac.createOscillator();
      const gain3 = ac.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(f0 * 2.76, t0);
      gain3.gain.setValueAtTime(0, t0);
      gain3.gain.linearRampToValueAtTime(0.12, t0 + 0.03);
      gain3.gain.exponentialRampToValueAtTime(0.0001, t0 + duration * 0.6);

      // Partial 4: High Crystalline Shimmer (~5.4x)
      const osc4 = ac.createOscillator();
      const gain4 = ac.createGain();
      osc4.type = 'sine';
      osc4.frequency.setValueAtTime(f0 * 5.4, t0);
      gain4.gain.setValueAtTime(0, t0);
      gain4.gain.linearRampToValueAtTime(0.05, t0 + 0.02);
      gain4.gain.exponentialRampToValueAtTime(0.0001, t0 + duration * 0.35);

      osc1.connect(gain1); gain1.connect(masterGain);
      osc2.connect(gain2); gain2.connect(masterGain);
      osc3.connect(gain3); gain3.connect(masterGain);
      osc4.connect(gain4); gain4.connect(masterGain);

      const unregister = registerVoice(osc1);
      osc1.onended = () => {
        try {
          osc1.disconnect(); osc2.disconnect(); osc3.disconnect(); osc4.disconnect();
          gain1.disconnect(); gain2.disconnect(); gain3.disconnect(); gain4.disconnect();
        } catch (e) {}
        unregister();
      };

      osc1.start(t0); osc1.stop(t0 + duration);
      osc2.start(t0); osc2.stop(t0 + duration);
      osc3.start(t0); osc3.stop(t0 + duration * 0.6);
      osc4.start(t0); osc4.stop(t0 + duration * 0.35);
    },

    // 2. MERIDIAN BREAKTHROUGH (Прорыв меридианов)
    // Multi-layered epic event:
    // A) Heavy sub-bass resonant gong sweep (110Hz -> 42Hz)
    // B) Metallic resonance chime
    // C) Celestial crystalline chime cascade (ascending pentatonic crystal bells)
    playBreakthrough() {
      if (!canPlay('breakthrough', 800)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;

      // Layer A: Sub-bass resonance gong
      const bassOsc = ac.createOscillator();
      const bassGain = ac.createGain();
      const bassFilter = ac.createBiquadFilter();
      const allNodes = [bassOsc, bassGain, bassFilter];

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(115, t0);
      bassOsc.frequency.exponentialRampToValueAtTime(42, t0 + 1.8);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(260, t0);
      bassFilter.frequency.exponentialRampToValueAtTime(60, t0 + 1.8);

      bassGain.gain.setValueAtTime(0, t0);
      bassGain.gain.linearRampToValueAtTime(0.55, t0 + 0.03);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(masterGain);

      bassOsc.start(t0);
      bassOsc.stop(t0 + 2.5);

      // Layer B: Resonant Temple Bell Chime
      [440, 660, 1056].forEach((freq, idx) => {
        const bellOsc = ac.createOscillator();
        const bellGain = ac.createGain();
        allNodes.push(bellOsc, bellGain);
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(freq, t0);

        const amp = 0.22 / (idx + 1);
        bellGain.gain.setValueAtTime(0, t0);
        bellGain.gain.linearRampToValueAtTime(amp, t0 + 0.015);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8 + idx * 0.2);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);

        bellOsc.start(t0);
        bellOsc.stop(t0 + 2.1);
      });

      // Layer C: Celestial Crystalline Ascent (staggered crystal bells)
      const crystalNotes = [880, 1174.66, 1396.91, 1760, 2093];
      crystalNotes.forEach((freq, i) => {
        const noteStart = t0 + 0.12 + (i * 0.075);
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        allNodes.push(osc, gain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.1);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + 1.2);
      });

      trackVoice(bassOsc, allNodes);
    },

    // 3. PARCHMENT RUSTLE (Шелест пергамента)
    // Band-pass filtered white noise burst with organic envelope for chapter & chronicle turns
    playParchment() {
      if (!canPlay('parchment', 100)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);

      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, t0);
      filter.frequency.linearRampToValueAtTime(1900, t0 + 0.18);
      filter.Q.setValueAtTime(1.8, t0);

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      trackVoice(noise, [noise, filter, gain]);
      noise.start(t0);
      noise.stop(t0 + 0.22);
    },

    // 4. METALLIC BLADE CLASH (Звон мечей и клинков в бою)
    playClash() {
      if (!canPlay('clash', 120)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const allNodes = [];

      // Inharmonic high metallic ringing partials
      const partials = [1820, 2460, 3720, 4890];
      partials.forEach((f, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        allNodes.push(osc, gain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t0);
        osc.frequency.exponentialRampToValueAtTime(f * 0.96, t0 + 0.35);

        const amp = 0.2 / (idx + 1);
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(amp, t0 + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t0);
        osc.stop(t0 + 0.4);
      });

      // Sharp transient clash snap
      const snap = ac.createBufferSource();
      snap.buffer = getNoiseBuffer(ac);
      const snapFilter = ac.createBiquadFilter();
      snapFilter.type = 'highpass';
      snapFilter.frequency.setValueAtTime(3200, t0);
      const snapGain = ac.createGain();
      snapGain.gain.setValueAtTime(0.25, t0);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);

      allNodes.push(snap, snapFilter, snapGain);
      snap.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(masterGain);
      trackVoice(snap, allNodes);
      snap.start(t0);
      snap.stop(t0 + 0.06);
    },

    // 5. PHYSICAL PUNCH / THUD (Сокрушительный удар кулаком / тяжелая тренировка)
    playPunch() {
      if (!canPlay('punch', 100)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;

      // Pitch-dropping heavy sine pulse
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(175, t0);
      osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.1);

      gain.gain.setValueAtTime(0.42, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.15);

      // Low-pass filtered body impact noise
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t0);
      filter.frequency.exponentialRampToValueAtTime(80, t0 + 0.12);

      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.28, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      trackVoice(osc, [osc, gain, noise, filter, noiseGain]);
      osc.start(t0);
      osc.stop(t0 + 0.16);
      noise.start(t0);
      noise.stop(t0 + 0.13);
    },

    // 6. NOBLE VICTORY CHORD (Триумф в поединке / победа)
    playVictory() {
      if (!canPlay('victory', 600)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const allNodes = [];
      let primaryOsc = null;

      // Ascending celestial pentatonic notes (G4, C5, D5, E5, G5)
      const chord = [392.00, 523.25, 587.33, 659.25, 783.99];
      chord.forEach((freq, idx) => {
        const noteStart = t0 + (idx * 0.065);
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        if (!primaryOsc) primaryOsc = osc;
        allNodes.push(osc, gain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.22, noteStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + 1.7);
      });

      trackVoice(primaryOsc, allNodes);
    },

    // 7. TENSE / DANGEROUS MOMENTS (Нагнетающий гул ци / Провокация соперника)
    playTenseDrone() {
      if (!canPlay('tense', 1800)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const oscA = ac.createOscillator();
      const oscB = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      // Binaural low beating frequency (55Hz & 56.4Hz)
      oscA.type = 'sawtooth';
      oscA.frequency.setValueAtTime(55, t0);

      oscB.type = 'sine';
      oscB.frequency.setValueAtTime(56.4, t0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, t0);
      filter.frequency.linearRampToValueAtTime(320, t0 + 1.2);
      filter.frequency.linearRampToValueAtTime(120, t0 + 2.5);
      filter.Q.setValueAtTime(3.5, t0);

      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.28, t0 + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 2.6);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      trackVoice(oscA, [oscA, oscB, filter, gain]);
      oscA.start(t0); oscA.stop(t0 + 2.7);
      oscB.start(t0); oscB.stop(t0 + 2.7);
    },

    // 8. SUBTLE JADE / TEMPLE BLOCK CLICK (Клики тренировки: уборка, стойка, приседания)
    playClick() {
      if (!canPlay('click', 60)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1020, t0);
      osc.frequency.exponentialRampToValueAtTime(680, t0 + 0.025);

      gain.gain.setValueAtTime(0.09, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.035);

      osc.connect(gain);
      gain.connect(masterGain);

      trackVoice(osc, [osc, gain]);
      osc.start(t0);
      osc.stop(t0 + 0.04);
    },

    // 9. SILK / PARCHMENT MAP SCROLL UNFOLD (Разворачивание свитка карты)
    playScrollOpen() {
      if (!canPlay('scroll', 120)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);

      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1900, t0);
      filter.frequency.linearRampToValueAtTime(1400, t0 + 0.35);
      filter.Q.value = 1.4;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.12, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      trackVoice(noise, [noise, filter, gain]);
      noise.start(t0);
      noise.stop(t0 + 0.4);
    },

    // 10. ROAD CARAVAN BELL (Колокольчик повозки и дорожного каравана)
    playCaravanBell() {
      if (!canPlay('caravan-bell', 150)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const osc1 = ac.createOscillator();
      const osc2 = ac.createOscillator();
      const gain1 = ac.createGain();
      const gain2 = ac.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1540, t0);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3120, t0);

      gain1.gain.setValueAtTime(0.08, t0);
      gain1.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.65);

      gain2.gain.setValueAtTime(0.04, t0);
      gain2.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.45);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(masterGain);
      gain2.connect(masterGain);

      trackVoice(osc1, [osc1, osc2, gain1, gain2]);
      osc1.start(t0); osc1.stop(t0 + 0.7);
      osc2.start(t0); osc2.stop(t0 + 0.5);
    },

    // 11. HIGH MOUNTAIN WIND WHISPER (Шёпот горного ветра)
    playWindWhisper() {
      if (!canPlay('wind-whisper', 300)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);

      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, t0);
      filter.frequency.linearRampToValueAtTime(720, t0 + 0.8);
      filter.frequency.linearRampToValueAtTime(320, t0 + 1.7);
      filter.Q.value = 2.0;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.07, t0 + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0005, t0 + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      trackVoice(noise, [noise, filter, gain]);
      noise.start(t0);
      noise.stop(t0 + 1.85);
    },

    // 12. GUARD BREAK SHATTER (Сокрушительный раскол стойки / треск защиты)
    playGuardBreak() {
      if (!canPlay('guard-break', 150)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const allNodes = [];

      // Descending shattering glass / resonant metal frequencies
      [1450, 980, 640, 290].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        allNodes.push(osc, gain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t0);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t0 + 0.45);

        const amp = 0.28 / (idx + 1);
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(amp, t0 + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t0);
        osc.stop(t0 + 0.52);
      });

      // Sharp shattering transient
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, t0);
      filter.frequency.exponentialRampToValueAtTime(800, t0 + 0.3);
      filter.Q.value = 3.0;

      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.35, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);

      allNodes.push(noise, filter, noiseGain);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      trackVoice(noise, allNodes);
      noise.start(t0);
      noise.stop(t0 + 0.38);
    },

    // 13. EVIL GOD CRIMSON FLAME SURGE (Рёв пламени Врат Злого Бога)
    playEvilGodFlame() {
      if (!canPlay('evil-god-flame', 300)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const allNodes = [];

      // Sub-bass ominous pulse
      const subOsc = ac.createOscillator();
      const subGain = ac.createGain();
      allNodes.push(subOsc, subGain);

      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(95, t0);
      subOsc.frequency.exponentialRampToValueAtTime(42, t0 + 0.9);

      const subFilter = ac.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(220, t0);
      subFilter.frequency.exponentialRampToValueAtTime(75, t0 + 0.9);

      subGain.gain.setValueAtTime(0, t0);
      subGain.gain.linearRampToValueAtTime(0.38, t0 + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.95);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(t0);
      subOsc.stop(t0 + 1.0);

      // Roaring filtered fire rush
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);
      const fireFilter = ac.createBiquadFilter();
      fireFilter.type = 'bandpass';
      fireFilter.frequency.setValueAtTime(180, t0);
      fireFilter.frequency.linearRampToValueAtTime(680, t0 + 0.35);
      fireFilter.frequency.exponentialRampToValueAtTime(120, t0 + 1.1);
      fireFilter.Q.value = 2.2;

      const fireGain = ac.createGain();
      fireGain.gain.setValueAtTime(0, t0);
      fireGain.gain.linearRampToValueAtTime(0.32, t0 + 0.1);
      fireGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.15);

      allNodes.push(noise, fireFilter, fireGain);
      noise.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(masterGain);
      trackVoice(subOsc, allNodes);
      noise.start(t0);
      noise.stop(t0 + 1.2);
    },

    // 14. CRITICAL BURST (Критический сокрушительный удар в комбо)
    playCrit() {
      if (!canPlay('crit-burst', 120)) return;
      const ac = getAudioContext();
      if (!ac || !masterGain) return;

      const t0 = ac.currentTime;
      const allNodes = [];

      // Heavy punch impact + metallic resonant snap
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t0);
      osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.16);

      gain.gain.setValueAtTime(0.55, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);

      osc.connect(gain);
      gain.connect(masterGain);
      allNodes.push(osc, gain);
      osc.start(t0);
      osc.stop(t0 + 0.24);

      // Crisp metallic harmonic snap
      [1800, 3200].forEach((freq) => {
        const hOsc = ac.createOscillator();
        const hGain = ac.createGain();
        allNodes.push(hOsc, hGain);
        hOsc.type = 'triangle';
        hOsc.frequency.setValueAtTime(freq, t0);
        hOsc.frequency.exponentialRampToValueAtTime(freq * 0.8, t0 + 0.15);
        hGain.gain.setValueAtTime(0.2, t0);
        hGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
        hOsc.connect(hGain);
        hGain.connect(masterGain);
        hOsc.start(t0);
        hOsc.stop(t0 + 0.2);
      });

      trackVoice(osc, allNodes);
    },

    // Method aliases for extended naming compatibility
    playSingingBowl(f, d) { return this.playBowl(f, d); },
    playSwordClash() { return this.playClash(); },
    playPhysicalStrike() { return this.playPunch(); },
    playVictoryChime() { return this.playVictory(); },
    startQiDrone() { return this.playTenseDrone(); },
    stopQiDrone() {},
    playJadeChime() { return this.playClick(); },
    playTempleBlock() { return this.playClick(); },
    playTrainingSwoosh() { return this.playClick(); },
    toggleMute() { return this.toggle(); },
    setMuted(m) { if (!!m === enabled) this.toggle(); return !enabled; }
  };

  root.IsekaiSound = IsekaiSound;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = IsekaiSound;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
