'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

test('sound module loads and provides safe procedural audio API in headless environment', () => {
  const Sound = require('./sound.js');
  assert.ok(Sound, 'Sound module should export an object');
  assert.equal(typeof Sound.toggle, 'function');
  assert.equal(typeof Sound.setVolume, 'function');
  assert.equal(typeof Sound.getVolume, 'function');
  assert.equal(typeof Sound.isMuted, 'function');
  assert.equal(typeof Sound.playBowl, 'function');
  assert.equal(typeof Sound.playBreakthrough, 'function');
  assert.equal(typeof Sound.playParchment, 'function');
  assert.equal(typeof Sound.playClash, 'function');
  assert.equal(typeof Sound.playPunch, 'function');
  assert.equal(typeof Sound.playVictory, 'function');
  assert.equal(typeof Sound.playTenseDrone, 'function');
  assert.equal(typeof Sound.playClick, 'function');
  assert.equal(typeof Sound.playGuardBreak, 'function');
  assert.equal(typeof Sound.playEvilGodFlame, 'function');
  assert.equal(typeof Sound.playCrit, 'function');

  // Verify volume clamping
  Sound.setVolume(0.75);
  assert.equal(Sound.getVolume(), 0.75);
  Sound.setVolume(2.5);
  assert.equal(Sound.getVolume(), 1.0);
  Sound.setVolume(-0.5);
  assert.equal(Sound.getVolume(), 0.0);
  Sound.setVolume(0.4);
  assert.equal(Sound.getVolume(), 0.4);

  // In headless Node, all sound triggers must safely no-op without errors
  assert.doesNotThrow(() => Sound.playBowl());
  assert.doesNotThrow(() => Sound.playBreakthrough());
  assert.doesNotThrow(() => Sound.playParchment());
  assert.doesNotThrow(() => Sound.playClash());
  assert.doesNotThrow(() => Sound.playPunch());
  assert.doesNotThrow(() => Sound.playVictory());
  assert.doesNotThrow(() => Sound.playTenseDrone());
  assert.doesNotThrow(() => Sound.playClick());
  assert.doesNotThrow(() => Sound.playGuardBreak());
  assert.doesNotThrow(() => Sound.playEvilGodFlame());
  assert.doesNotThrow(() => Sound.playCrit());
});

test('sound module connects procedural audio graph correctly when AudioContext is present', () => {
  // Setup a mock browser window with Web Audio API
  const calls = [];
  class MockParam {
    constructor(val = 0) { this.value = val; }
    setValueAtTime(v, t) { calls.push(['setValueAtTime', v, t]); this.value = v; }
    linearRampToValueAtTime(v, t) { calls.push(['linearRampToValueAtTime', v, t]); this.value = v; }
    exponentialRampToValueAtTime(v, t) { calls.push(['exponentialRampToValueAtTime', v, t]); this.value = v; }
    cancelScheduledValues(t) { calls.push(['cancelScheduledValues', t]); }
  }

  class MockNode {
    constructor(nodeKind) {
      this.nodeKind = nodeKind;
      this.type = 'sine';
      this.frequency = new MockParam(440);
      this.gain = new MockParam(1);
      this.Q = new MockParam(1);
      this.connectedTo = [];
    }
    connect(dest) {
      this.connectedTo.push(dest);
      calls.push(['connect', this.nodeKind, dest.nodeKind || 'destination']);
    }
    disconnect() {
      calls.push(['disconnect', this.nodeKind]);
    }
    start(t) { calls.push(['start', this.nodeKind, t]); }
    stop(t) { calls.push(['stop', this.nodeKind, t]); }
  }

  class MockAudioContext {
    constructor() {
      this.currentTime = 10.0;
      this.sampleRate = 44100;
      this.state = 'running';
      this.destination = { nodeKind: 'destination' };
    }
    createGain() { return new MockNode('gain'); }
    createOscillator() { return new MockNode('oscillator'); }
    createBiquadFilter() { return new MockNode('filter'); }
    createBuffer(ch, len, rate) {
      return {
        sampleRate: rate,
        getChannelData: () => new Float32Array(len)
      };
    }
    createBufferSource() { return new MockNode('bufferSource'); }
    resume() { return Promise.resolve(); }
  }

  const vm = require('node:vm');
  const fs = require('node:fs');
  const context = {
    window: {
      AudioContext: MockAudioContext
    },
    localStorage: {
      getItem: (key) => key === 'isekai-sound-enabled' ? 'true' : (key === 'isekai-sound-volume' ? '0.4' : null),
      setItem: () => {}
    },
    Date,
    Math,
    Float32Array,
    console
  };
  context.globalThis = context;

  const code = fs.readFileSync('sound.js', 'utf8');
  vm.runInNewContext(code, context);
  const Sound = context.IsekaiSound;
  assert.ok(Sound);
  assert.equal(Sound.enabled, true);

  // Test procedural triggers create and start audio nodes
  calls.length = 0;
  Sound.playBowl(300, 2);
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playBowl should start oscillators');

  calls.length = 0;
  Sound.playBreakthrough();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playBreakthrough should trigger oscillators');

  calls.length = 0;
  Sound.playParchment();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'bufferSource'), 'playParchment should trigger noise buffer');

  calls.length = 0;
  Sound.playClash();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playClash should start metal ring oscillators');

  calls.length = 0;
  Sound.playPunch();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playPunch should start punch pitch sweep');

  calls.length = 0;
  Sound.playVictory();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playVictory should play victory chord');

  calls.length = 0;
  Sound.playTenseDrone();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playTenseDrone should start dark drone oscillators');

  calls.length = 0;
  Sound.playClick();
  assert.ok(calls.some(c => c[0] === 'start' && c[1] === 'oscillator'), 'playClick should play subtle tap');
});
