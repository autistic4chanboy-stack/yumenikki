/* =========================================================================
 *  Moteur audio (Web Audio). Musique procédurale en boucles de 8 mesures
 *  (la dernière harmonie résout vers la première), fondus à puissance
 *  constante, fichiers remplaçables, ambiances, effets synthétisés,
 *  voix des PNJ, émetteurs positionnels.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], aeolian: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10], locrian: [0, 1, 3, 5, 6, 8, 10], harmonic: [0, 2, 3, 5, 7, 8, 11],
    pentatonic: [0, 2, 4, 7, 9], minpent: [0, 3, 5, 7, 10], wholetone: [0, 2, 4, 6, 8, 10],
    hirajoshi: [0, 2, 3, 7, 8], blues: [0, 3, 5, 6, 7, 10], chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    pelog: [0, 1, 3, 7, 8], octatonic: [0, 2, 3, 5, 6, 8, 9, 11]
  };
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  var A = YN.audio = {
    ctx: null, ok: false, unlocked: false,
    master: null, bus: {}, reverb: null, noiseBuf: null,
    current: null, fading: [], mods: { lowpass: 1, gain: 1, detune: 0, rate: 1, silence: 0 },
    amb: null, emitters: {}, scheduler: null, missing: {},
    SCALES: SCALES,

    init: function () {
      if (A.ctx) return true;
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) { YN.warn('Web Audio unavailable'); return false; }
      try { A.ctx = new AC(); } catch (e) { YN.warn('audio: ' + e); return false; }
      var c = A.ctx;
      A.master = c.createGain();
      var comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
      A.master.connect(comp); comp.connect(c.destination);
      ['music', 'amb', 'sfx', 'voice'].forEach(function (b) { A.bus[b] = c.createGain(); A.bus[b].connect(A.master); });
      // filtre global de la musique (sorcières, fin du rêve)
      A.musicFilter = c.createBiquadFilter(); A.musicFilter.type = 'lowpass'; A.musicFilter.frequency.value = 20000;
      A.musicIn = c.createGain(); A.musicIn.connect(A.musicFilter); A.musicFilter.connect(A.bus.music);
      // réverbération synthétique
      A.reverb = c.createConvolver(); A.reverb.buffer = A.impulse(3.2, 2.4);
      A.revGain = c.createGain(); A.revGain.gain.value = 0.55; A.reverb.connect(A.revGain); A.revGain.connect(A.bus.music);
      A.sfxRev = c.createGain(); A.sfxRev.gain.value = 0.25; A.sfxRev.connect(A.reverb);
      // bruit partagé
      var len = c.sampleRate * 2, nb = c.createBuffer(1, len, c.sampleRate), d = nb.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A.noiseBuf = nb;
      A.applyVolumes();
      A.scheduler = setInterval(A.tick, 25);
      A.ok = true;
      return true;
    },
    unlock: function () {
      if (!A.ctx) A.init();
      if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
      A.unlocked = true;
    },
    applyVolumes: function () {
      if (!A.ctx) return;
      var s = YN.save.settings || YN.save.defaultSettings();
      var t = A.ctx.currentTime;
      A.master.gain.setTargetAtTime(s.master, t, 0.05);
      A.bus.music.gain.setTargetAtTime(s.music * A.mods.gain * (1 - A.mods.silence), t, 0.3);
      A.bus.amb.gain.setTargetAtTime(s.ambience * (1 - A.mods.silence), t, 0.3);
      A.bus.sfx.gain.setTargetAtTime(s.sfx * (1 - A.mods.silence * 0.85), t, 0.1);
      A.bus.voice.gain.setTargetAtTime(s.voice, t, 0.1);
    },
    impulse: function (sec, decay) {
      var c = A.ctx, len = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, len, c.sampleRate);
      for (var ch = 0; ch < 2; ch++) { var d = b.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
      return b;
    },
    /* modificateurs globaux (sorcières, Prêtresse, phase finale) */
    setMods: function (m) {
      for (var k in m) A.mods[k] = m[k];
      if (!A.ctx) return;
      var t = A.ctx.currentTime;
      A.musicFilter.frequency.setTargetAtTime(U.clamp(20000 * A.mods.lowpass, 200, 20000), t, 0.6);
      A.applyVolumes();
    },

    /* ================= MUSIQUE ================= */
    playMusic: function (id, opts) {
      opts = opts || {};
      if (!A.ctx) { A._pending = id; return; }
      if (A.current && A.current.id === id && !opts.restart) return;
      var MC = YN.musicConfig, cfg = MC.tracks[id];
      if (!cfg && id && MC.alias && MC.alias[id] && MC.tracks[MC.alias[id]]) cfg = MC.tracks[MC.alias[id]];
      if (!cfg && id && typeof id === 'string' && MC.auto) cfg = MC.tracks[id] = MC.auto(id);
      var fade = opts.fade !== undefined ? opts.fade : ((cfg && cfg.fade) || YN.musicConfig.defaults.fade);
      if (A.current) { A.fadeOut(A.current, fade); A.current = null; }
      if (!cfg) { if (id && cfg === undefined) YN.warn('unknown track: ' + id); return; }
      var tr = { id: id, cfg: cfg, gain: A.ctx.createGain(), started: A.ctx.currentTime, dead: false };
      tr.gain.gain.value = 0;
      tr.gain.connect(A.musicIn);
      tr.send = A.ctx.createGain(); tr.send.gain.value = (cfg.proc && cfg.proc.reverb !== undefined) ? cfg.proc.reverb : 0.5;
      tr.gain.connect(tr.send); tr.send.connect(A.reverb);
      A.current = tr;
      var target = cfg.gain || YN.musicConfig.defaults.gain;
      // fondu à puissance constante
      var steps = 32, curve = new Float32Array(steps);
      for (var i = 0; i < steps; i++) curve[i] = Math.sin((i / (steps - 1)) * Math.PI / 2) * target;
      try { tr.gain.gain.setValueCurveAtTime(curve, A.ctx.currentTime + 0.02, Math.max(0.05, fade)); } catch (e) { tr.gain.gain.value = target; }
      if (cfg.file) A.loadFile(tr, cfg);
      else A.startProc(tr);
    },
    stopMusic: function (fade) { if (A.current) { A.fadeOut(A.current, fade === undefined ? 1.5 : fade); A.current = null; } },
    fadeOut: function (tr, fade) {
      if (!A.ctx || tr.dead) return;
      var t = A.ctx.currentTime, g = tr.gain.gain, v = g.value;
      var steps = 32, curve = new Float32Array(steps);
      for (var i = 0; i < steps; i++) curve[i] = Math.cos((i / (steps - 1)) * Math.PI / 2) * v;
      try { g.cancelScheduledValues(t); g.setValueCurveAtTime(curve, t + 0.01, Math.max(0.05, fade)); } catch (e) { g.value = 0; }
      tr.stopAt = t + fade + 0.1;
      A.fading.push(tr);
    },
    loadFile: function (tr, cfg) {
      var url = cfg.file;
      var fallback = function (why) {
        if (!A.missing[url]) { A.missing[url] = why; YN.warn('music “' + url + '” unavailable (' + why + '): procedural fallback'); }
        if (cfg.proc) A.startProc(tr);
      };
      if (root.fetch && root.location && root.location.protocol !== 'file:') {
        fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
          .then(function (buf) { return A.ctx.decodeAudioData(buf); })
          .then(function (ab) {
            if (tr.dead) return;
            var src = A.ctx.createBufferSource(); src.buffer = ab; src.loop = true;
            if (cfg.loopStart !== undefined) src.loopStart = cfg.loopStart;
            src.loopEnd = cfg.loopEnd !== undefined && cfg.loopEnd !== null ? cfg.loopEnd : ab.duration;
            src.connect(tr.gain); src.start(); tr.src = src;
          }).catch(function (e) { fallback(e.message || 'error'); });
      } else if (typeof Audio !== 'undefined') {
        // ouverture en file:// : élément audio (boucle simple, sans points de boucle)
        var el = new Audio(); el.src = url; el.loop = true; el.volume = 0;
        el.addEventListener('error', function () { fallback('file not found'); });
        el.addEventListener('canplaythrough', function () {
          if (tr.dead) return;
          tr.el = el; el.play().catch(function () { fallback('playback blocked'); });
          var target = (cfg.gain || 0.8) * ((YN.save.settings && YN.save.settings.music) || 0.7);
          var t0 = performance.now();
          var fade = function () { if (tr.dead) { el.pause(); return; } var k = Math.min(1, (performance.now() - t0) / 2000); el.volume = target * Math.sin(k * Math.PI / 2); if (k < 1) requestAnimationFrame(fade); };
          fade();
        }, { once: true });
        el.load();
      } else fallback('aucun lecteur');
    },
    startProc: function (tr) {
      var p = tr.cfg.proc; if (!p) return;
      var r = YN.rng.make(p.seed || tr.id);
      var scale = SCALES[p.scale] || SCALES.minor;
      var bars = p.bars || 8, steps = p.steps || 16; // 12 = trois temps, 20 = cinq temps, 14 = sept croches
      // progression : degrés, la dernière mène à la première
      var deg = p.prog;
      if (!deg) {
        var pool = scale.length >= 7 ? [0, 3, 4, 5, 2, 6, 1] : [0, 1, 2, 3, 4].slice(0, scale.length);
        deg = [0];
        for (var b = 1; b < bars - 1; b++) deg.push(r.pick(pool.slice(1)));
        deg.push(scale.length >= 7 ? r.pick([4, 6]) : scale.length - 1);
      }
      var chordOf = function (d) { // 3 notes de la gamme
        var n = scale.length;
        return [0, 2, 4].map(function (k) { var i = d + k; return scale[i % n] + 12 * Math.floor(i / n); });
      };
      // motifs mélodiques A A' B A
      var motif = [];
      for (var s = 0; s < steps * 2; s++) motif.push(r.next() < 0.5 ? null : r.int(-2, 4));
      // sobriété : moins de notes, des mesures de respiration, trois couches au plus
      var sp = p.sparse === undefined ? 0.62 : p.sparse, maxL = p.maxLayers || 3;
      var srcLayers = (p.layers || []).slice(0, maxL + ((p.layers || []).some(function (L) { return L.role === 'texture'; }) ? 1 : 0));
      var layers = srcLayers.map(function (L, idx) {
        var lr = YN.rng.make((p.seed || tr.id) + ':' + idx), pat = [];
        for (var bb = 0; bb < bars; bb++) {
          var row = [], rest = (L.role === 'melody' || L.role === 'arp' || L.role === 'bell') && ((bb % 4 === 3 && lr.next() < 0.7) || lr.next() < (1 - sp) * 0.45);
          for (var st = 0; st < steps; st++) {
            var dens = (L.density === undefined ? 0.3 : L.density) * sp - (1 - sp) * 0.3, v = null;
            if (rest) { row.push(null); continue; }
            switch (L.role) {
              case 'pad': v = st === 0 ? { chord: true, len: steps } : null; break;
              case 'drone': v = (st === 0 && bb % 2 === 0) ? { note: 0, len: steps * 2 } : null; break;
              case 'bass': v = (st % 8 === 0 && lr.next() < dens + 0.4) ? { note: 0, len: 6 } : (st % 4 === 2 && lr.next() < dens * 0.4 ? { note: 4, len: 2 } : null); break;
              case 'arp': v = (st % 2 === 0 && lr.next() < dens + 0.15) ? { arp: (st / 2) % 3 + (lr.next() < 0.2 ? 3 : 0), len: 2 } : null; break;
              case 'melody':
                var m = motif[(st + (bb % 4 === 3 ? steps : 0)) % (steps * 2)];
                if (bb % 4 === 1 && st > 10) m = (m === null ? null : m + 1);
                v = (m !== null && lr.next() < dens + 0.35) ? { deg: m, len: lr.pick([2, 2, 3, 4]) } : null; break;
              case 'bell': v = lr.next() < dens * 0.25 ? { deg: lr.int(0, 6), len: 8 } : null; break;
              case 'perc': v = lr.next() < (st % 4 === 0 ? dens + 0.3 : dens * 0.5) ? { perc: L.type || 'tick' } : null; break;
              case 'texture': v = null; break;
            }
            row.push(v);
          }
          pat.push(row);
        }
        return { L: L, pat: pat };
      });
      tr.proc = { p: p, scale: scale, deg: deg, chordOf: chordOf, layers: layers, bars: bars, steps: steps, meter: p.meter || 0,
        stepDur: 60 / (p.bpm || 70) / 4, next: A.ctx.currentTime + 0.08, step: 0, swing: p.swing || 0 };
      // textures continues
      layers.forEach(function (ly) { if (ly.L.role === 'texture') tr.texture = A.texture(ly.L.type, ly.L.vol || 0.05, tr.gain); });
      if (p.lowpass) { tr.lp = A.ctx.createBiquadFilter(); tr.lp.type = 'lowpass'; tr.lp.frequency.value = p.lowpass; tr.gain.disconnect(); tr.gain.connect(tr.lp); tr.lp.connect(A.musicIn); tr.gain.connect(tr.send); }
    },
    tick: function () {
      if (!A.ctx) return;
      var now = A.ctx.currentTime;
      for (var i = A.fading.length - 1; i >= 0; i--) {
        var f = A.fading[i];
        if (now > f.stopAt) { A.killTrack(f); A.fading.splice(i, 1); }
        else A.schedule(f, now);
      }
      if (A.current) A.schedule(A.current, now);
    },
    killTrack: function (tr) {
      tr.dead = true;
      try { if (tr.src) tr.src.stop(); } catch (e) { /* déjà arrêté */ }
      if (tr.el) tr.el.pause();
      if (tr.texture) tr.texture.stop();
      try { tr.gain.disconnect(); } catch (e) { /* rien */ }
    },
    schedule: function (tr, now) {
      var P = tr.proc; if (!P || tr.dead) return;
      var rate = A.mods.rate || 1;
      while (P.next < now + 0.15) {
        var bar = Math.floor(P.step / P.steps) % P.bars, st = P.step % P.steps;
        var t = P.next + (st % 2 ? P.swing * P.stepDur : 0);
        var root = P.p.key + P.scale[P.deg[bar] % P.scale.length] - P.scale[0] + 12 * Math.floor(P.deg[bar] / P.scale.length);
        var chord = P.chordOf(P.deg[bar]).map(function (n) { return P.p.key + n; });
        for (var l = 0; l < P.layers.length; l++) {
          var ly = P.layers[l], ev = ly.pat[bar][st]; if (!ev) continue;
          var L = ly.L, oct = (L.oct || 0) * 12, vol = L.vol || 0.2, dur = (ev.len || 2) * P.stepDur;
          if (ev.chord) chord.forEach(function (n) { A.note(L.inst, n + oct, t, dur * 1.05, vol / 2.2, tr.gain, P.p.detune); });
          else if (ev.note !== undefined) A.note(L.inst, root + oct + (ev.note === 4 ? 7 : 0), t, dur, vol, tr.gain, P.p.detune);
          else if (ev.arp !== undefined) A.note(L.inst, chord[ev.arp % 3] + oct + (ev.arp >= 3 ? 12 : 0), t, dur, vol, tr.gain, P.p.detune);
          else if (ev.deg !== undefined) {
            var di = U.mod(ev.deg + P.deg[bar], P.scale.length), octs = Math.floor((ev.deg + P.deg[bar]) / P.scale.length);
            A.note(L.inst, P.p.key + P.scale[di] + 12 * octs + oct, t, dur, vol, tr.gain, P.p.detune);
          } else if (ev.perc) A.perc(ev.perc, t, vol, tr.gain);
        }
        P.next += P.stepDur / rate;
        P.step = (P.step + 1) % (P.steps * P.bars);
      }
    },

    /* ================= INSTRUMENTS ================= */
    note: function (inst, midi, t, dur, vol, out, detune) {
      var c = A.ctx; if (!c) return;
      var f = mtof(midi), dt = (detune || 0) + A.mods.detune;
      var g = c.createGain(); g.connect(out);
      var o, o2, env = g.gain;
      function adsr(a, d, s, r) {
        env.setValueAtTime(0.0001, t); env.linearRampToValueAtTime(vol, t + a);
        env.setTargetAtTime(vol * s, t + a, d);
        env.setTargetAtTime(0.0001, t + Math.max(a, dur), r);
      }
      var stopT = t + dur + 3;
      switch (inst) {
        case 'pad': case 'strings':
          o = c.createOscillator(); o.type = inst === 'pad' ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.detune.value = 7 + dt;
          o2 = c.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f; o2.detune.value = -9 - dt;
          var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = inst === 'pad' ? 900 : 1600;
          o.connect(lp); o2.connect(lp); lp.connect(g); g.gain.value = 0;
          adsr(0.9, 0.8, 0.7, 1.2); o.start(t); o2.start(t); o.stop(stopT); o2.stop(stopT);
          if (inst === 'strings') { var lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.detune); lfo.start(t); lfo.stop(stopT); }
          break;
        case 'kalimba': case 'marimba': case 'celesta': {
          // fondamentale + un partiel inharmonique bref : bois, lame, petite cloche
          var pr = inst === 'kalimba' ? 5.4 : inst === 'marimba' ? 4.0 : 3.0, dec = inst === 'kalimba' ? 1.1 : inst === 'marimba' ? 0.7 : 1.8;
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = dt;
          o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * pr;
          var gp = c.createGain(); gp.gain.setValueAtTime(vol * (inst === 'celesta' ? 0.35 : 0.5), t); gp.gain.exponentialRampToValueAtTime(0.0001, t + dec * 0.25); o2.connect(gp); gp.connect(out);
          o.connect(g); env.setValueAtTime(0.0001, t); env.linearRampToValueAtTime(vol, t + 0.004); env.exponentialRampToValueAtTime(0.0001, t + dec);
          o.start(t); o2.start(t); o.stop(t + dec + 0.1); o2.stop(t + dec * 0.3 + 0.1); break; }
        case 'harp': {
          o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = dt;
          var lpH = c.createBiquadFilter(); lpH.type = 'lowpass'; lpH.frequency.setValueAtTime(4200, t); lpH.frequency.exponentialRampToValueAtTime(700, t + 1.2);
          o.connect(lpH); lpH.connect(g); env.setValueAtTime(0.0001, t); env.linearRampToValueAtTime(vol, t + 0.006); env.exponentialRampToValueAtTime(0.0001, t + 2.2);
          o.start(t); o.stop(t + 2.3); break; }
        case 'felt': {
          // piano feutré : attaque douce, peu d'harmoniques
          o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = dt;
          var lpF = c.createBiquadFilter(); lpF.type = 'lowpass'; lpF.frequency.value = 1100; o.connect(lpF); lpF.connect(g);
          env.setValueAtTime(0.0001, t); env.linearRampToValueAtTime(vol, t + 0.02); env.exponentialRampToValueAtTime(vol * 0.35, t + 0.5); env.exponentialRampToValueAtTime(0.0001, t + Math.max(1.6, dur * 2.2));
          o.start(t); o.stop(t + Math.max(1.7, dur * 2.2 + 0.1)); break; }
        case 'clarinet': {
          o = c.createOscillator(); o.type = 'square'; o.frequency.value = f; o.detune.value = dt;
          var lpC = c.createBiquadFilter(); lpC.type = 'lowpass'; lpC.frequency.value = 1300; lpC.Q.value = 0.7; o.connect(lpC); lpC.connect(g); g.gain.value = 0;
          var vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 4.6; vg.gain.value = 5; vib.connect(vg); vg.connect(o.detune); vib.start(t + 0.3); vib.stop(t + dur + 1);
          adsr(0.08, 0.3, 0.75, 0.35); o.start(t); o.stop(t + dur + 1.2); break; }
        case 'vibes': {
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = dt; o.connect(g);
          var trem = c.createOscillator(), tg = c.createGain(); trem.frequency.value = 5.2; tg.gain.value = vol * 0.35; trem.connect(tg); tg.connect(g.gain);
          env.setValueAtTime(0.0001, t); env.linearRampToValueAtTime(vol, t + 0.005); env.exponentialRampToValueAtTime(0.0001, t + 2.6);
          o.start(t); trem.start(t); o.stop(t + 2.7); trem.stop(t + 2.7); break; }
        case 'sinepad': {
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = 4 + dt;
          o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f; o2.detune.value = -5 - dt;
          o.connect(g); o2.connect(g); g.gain.value = 0;
          adsr(1.6, 1.2, 0.8, 2.2); o.start(t); o2.start(t); o.stop(stopT + 1); o2.stop(stopT + 1); break; }
        case 'musicbox': case 'glass':
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * (inst === 'glass' ? 2 : 1); o.detune.value = dt;
          o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * (inst === 'glass' ? 5.04 : 3.01);
          var g2 = c.createGain(); g2.gain.value = 0.18; o2.connect(g2); g2.connect(g); o.connect(g);
          env.setValueAtTime(vol, t); env.exponentialRampToValueAtTime(0.0001, t + (inst === 'glass' ? 2.4 : 1.4));
          o.start(t); o2.start(t); o.stop(t + 2.6); o2.stop(t + 2.6); break;
        case 'piano':
          o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = dt;
          o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
          var g3 = c.createGain(); g3.gain.value = 0.25; o2.connect(g3); g3.connect(g); o.connect(g);
          env.setValueAtTime(vol, t); env.exponentialRampToValueAtTime(vol * 0.3, t + 0.4); env.exponentialRampToValueAtTime(0.0001, t + Math.max(1.2, dur * 2));
          o.start(t); o2.start(t); o.stop(t + Math.max(1.3, dur * 2 + 0.1)); o2.stop(t + Math.max(1.3, dur * 2 + 0.1)); break;
        case 'bell':
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = dt;
          var mod = c.createOscillator(), mg = c.createGain(); mod.frequency.value = f * 3.5; mg.gain.value = f * 1.2;
          mod.connect(mg); mg.connect(o.frequency); o.connect(g);
          mg.gain.setValueAtTime(f * 1.2, t); mg.gain.exponentialRampToValueAtTime(1, t + 2);
          env.setValueAtTime(vol, t); env.exponentialRampToValueAtTime(0.0001, t + 3.2);
          o.start(t); mod.start(t); o.stop(t + 3.3); mod.stop(t + 3.3); break;
        case 'drone':
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 1.5; o2.detune.value = 4;
          var g4 = c.createGain(); g4.gain.value = 0.3; o2.connect(g4); g4.connect(g); o.connect(g); g.gain.value = 0;
          adsr(2.5, 1, 0.9, 2.5); o.start(t); o2.start(t); o.stop(t + dur + 6); o2.stop(t + dur + 6); break;
        case 'pluck': case 'bass':
          o = c.createOscillator(); o.type = inst === 'bass' ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = dt;
          var lp2 = c.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.setValueAtTime(inst === 'bass' ? 600 : 3000, t); lp2.frequency.exponentialRampToValueAtTime(300, t + 0.4);
          o.connect(lp2); lp2.connect(g);
          env.setValueAtTime(vol, t); env.exponentialRampToValueAtTime(0.0001, t + (inst === 'bass' ? Math.max(0.5, dur) : 0.6));
          o.start(t); o.stop(t + Math.max(0.7, dur + 0.1)); break;
        case 'choir':
          o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt;
          var bp1 = c.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 700; bp1.Q.value = 6;
          var bp2 = c.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1150; bp2.Q.value = 8;
          o.connect(bp1); o.connect(bp2); bp1.connect(g); bp2.connect(g); g.gain.value = 0;
          adsr(1.2, 1, 0.8, 1.6); o.start(t); o.stop(stopT); break;
        case 'organ': case 'chip':
          o = c.createOscillator(); o.type = 'square'; o.frequency.value = f; o.detune.value = dt;
          var lp3 = c.createBiquadFilter(); lp3.type = 'lowpass'; lp3.frequency.value = inst === 'chip' ? 5000 : 1400;
          o.connect(lp3); lp3.connect(g); g.gain.value = 0;
          adsr(inst === 'chip' ? 0.005 : 0.05, 0.2, inst === 'chip' ? 0.5 : 0.8, inst === 'chip' ? 0.05 : 0.3);
          o.start(t); o.stop(t + dur + 1); break;
        case 'flute':
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = dt;
          o.connect(g); g.gain.value = 0; adsr(0.12, 0.3, 0.7, 0.3);
          var vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5.5; vg.gain.value = 8; vib.connect(vg); vg.connect(o.detune); vib.start(t); vib.stop(t + dur + 1);
          o.start(t); o.stop(t + dur + 1); break;
        default:
          o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g);
          env.setValueAtTime(vol, t); env.exponentialRampToValueAtTime(0.0001, t + 1); o.start(t); o.stop(t + 1.1);
      }
    },
    noiseSrc: function (t, loop) {
      var s = A.ctx.createBufferSource(); s.buffer = A.noiseBuf; s.loop = !!loop;
      s.playbackRate.value = 1; return s;
    },
    perc: function (type, t, vol, out) {
      var c = A.ctx, g = c.createGain(); g.connect(out);
      var n, f, o;
      switch (type) {
        case 'kick': o = c.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15); o.connect(g); g.gain.setValueAtTime(vol * 1.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.start(t); o.stop(t + 0.3); break;
        case 'hat': case 'shaker': n = A.noiseSrc(t); f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = type === 'hat' ? 7000 : 4000; n.connect(f); f.connect(g); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + (type === 'hat' ? 0.05 : 0.09)); n.start(t, Math.random()); n.stop(t + 0.1); break;
        case 'clap': n = A.noiseSrc(t); f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500; n.connect(f); f.connect(g); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12); n.start(t, Math.random()); n.stop(t + 0.15); break;
        case 'beep': o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 1320; o.connect(g); g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(0.0001, t + 0.09); o.start(t); o.stop(t + 0.1); break;
        case 'rail': n = A.noiseSrc(t); f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300; n.connect(f); f.connect(g); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08); n.start(t, Math.random()); n.stop(t + 0.1); break;
        default: o = c.createOscillator(); o.type = 'square'; o.frequency.value = 2400; o.connect(g); g.gain.setValueAtTime(vol * 0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.02); o.start(t); o.stop(t + 0.03);
      }
    },
    /* textures continues (vent, pluie, mer, foule, bourdonnement...) */
    texture: function (type, vol, out) {
      var c = A.ctx; if (!c) return { stop: function () { } };
      var g = c.createGain(); g.gain.value = 0; g.connect(out || A.bus.amb);
      g.gain.setTargetAtTime(vol, c.currentTime, 1.5);
      var nodes = [], n = A.noiseSrc(0, true), f = c.createBiquadFilter(), lfo = c.createOscillator(), lg = c.createGain();
      nodes.push(n, lfo);
      f.type = 'lowpass'; f.frequency.value = 600; lfo.frequency.value = 0.12; lg.gain.value = 300;
      switch (type) {
        case 'wind': f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 0.7; lg.gain.value = 350; break;
        case 'rain': f.type = 'highpass'; f.frequency.value = 2500; lg.gain.value = 200; lfo.frequency.value = 0.05; break;
        case 'sea': f.type = 'lowpass'; f.frequency.value = 700; lfo.frequency.value = 0.09; lg.gain.value = 500; break;
        case 'hum': f.type = 'lowpass'; f.frequency.value = 160; lg.gain.value = 20; var ho = c.createOscillator(); ho.frequency.value = 50; var hg = c.createGain(); hg.gain.value = 0.15; ho.connect(hg); hg.connect(g); ho.start(); nodes.push(ho); break;
        case 'crowd': case 'city': case 'tv': f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.5; lfo.frequency.value = 2.5; lg.gain.value = 500; break;
        case 'tape': case 'paper': f.type = 'highpass'; f.frequency.value = 5000; lg.gain.value = 600; lfo.frequency.value = 0.3; break;
        case 'rumble': f.type = 'lowpass'; f.frequency.value = 120; lg.gain.value = 60; lfo.frequency.value = 0.6; break;
        case 'drip': case 'stone': case 'ice': f.type = 'bandpass'; f.frequency.value = 2000; f.Q.value = 12; lfo.frequency.value = 0.7; lg.gain.value = 1500; break;
        case 'crickets': case 'frogs': case 'birds': f.type = 'bandpass'; f.frequency.value = type === 'crickets' ? 4500 : type === 'frogs' ? 600 : 3000; f.Q.value = 20; lfo.frequency.value = type === 'crickets' ? 9 : 3; lg.gain.value = 900; break;
        case 'static': f.type = 'highpass'; f.frequency.value = 1500; lg.gain.value = 1000; lfo.frequency.value = 7; break;
        case 'heart': f.type = 'lowpass'; f.frequency.value = 90; lg.gain.value = 40; lfo.frequency.value = 1.1; break;
      }
      lfo.connect(lg); lg.connect(f.frequency); n.connect(f); f.connect(g);
      n.start(0, Math.random() * 1.5); lfo.start();
      return {
        g: g, setVol: function (v) { g.gain.setTargetAtTime(v, c.currentTime, 0.5); },
        stop: function () { g.gain.setTargetAtTime(0, c.currentTime, 0.6); setTimeout(function () { nodes.forEach(function (x) { try { x.stop(); } catch (e) { /* ok */ } }); try { g.disconnect(); } catch (e) { /* ok */ } }, 2500); }
      };
    },
    ambience: function (type, vol) {
      if (!A.ctx) return;
      if (A.amb && A.amb.type === type) { A.amb.t.setVol(vol || 0.1); return; }
      if (A.amb) A.amb.t.stop();
      A.amb = type ? { type: type, t: A.texture(type, vol || 0.1, A.bus.amb) } : null;
    },

    /* ================= EFFETS SONORES ================= */
    sfx: function (name, o) {
      if (!A.ctx || !A.unlocked) return;
      o = o || {};
      var file = YN.musicConfig.sfx[name];
      if (file && typeof Audio !== 'undefined') { var el = new Audio(file); el.volume = U.clamp((o.vol || 1) * ((YN.save.settings && YN.save.settings.sfx) || 0.8), 0, 1); el.play().catch(function () { }); return; }
      var c = A.ctx, t = c.currentTime + (o.delay || 0), out = A.bus.sfx;
      var pan = c.createStereoPanner ? c.createStereoPanner() : null, g = c.createGain();
      g.gain.value = o.vol === undefined ? 1 : o.vol;
      if (pan) { pan.pan.value = U.clamp(o.pan || 0, -1, 1); g.connect(pan); pan.connect(out); pan.connect(A.sfxRev); } else g.connect(out);
      var S = SFX[name];
      if (!S) { YN.warn('unknown sound: ' + name); return; }
      try { S(c, t, g, o); } catch (e) { YN.warn('sfx ' + name + ': ' + e); }
    },
    blip: function (voice) {
      if (!A.ctx || !A.unlocked) return;
      var v = voice || {}, c = A.ctx, t = c.currentTime;
      var o = c.createOscillator(), g = c.createGain();
      o.type = v.wave || 'square';
      var base = v.pitch || 300, vary = v.vary === undefined ? 2 : v.vary;
      o.frequency.value = base * Math.pow(2, (Math.random() * vary * 2 - vary) / 12);
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = v.lp || 2200;
      o.connect(lp); lp.connect(g); g.connect(A.bus.voice);
      var len = (v.len || 45) / 1000, vol = v.vol || 0.06;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.start(t); o.stop(t + len + 0.01);
    },

    /* émetteurs positionnels : { id: {type, pan, gain} } mis à jour chaque image */
    setEmitters: function (list) {
      if (!A.ctx) return;
      var seen = {};
      for (var i = 0; i < list.length && i < 6; i++) {
        var e = list[i]; seen[e.id] = true;
        var em = A.emitters[e.id];
        if (!em) {
          var pan = A.ctx.createStereoPanner ? A.ctx.createStereoPanner() : null;
          var tex = A.texture(e.type, 0, pan || A.bus.amb);
          if (pan) pan.connect(A.bus.amb);
          em = A.emitters[e.id] = { tex: tex, pan: pan };
        }
        em.tex.setVol(e.gain);
        if (em.pan) em.pan.pan.setTargetAtTime(U.clamp(e.pan, -1, 1), A.ctx.currentTime, 0.1);
      }
      for (var k in A.emitters) if (!seen[k]) { A.emitters[k].tex.stop(); delete A.emitters[k]; }
    },
    clearEmitters: function () { A.setEmitters([]); }
  };

  /* ---------- bibliothèque d'effets synthétisés ---------- */
  function osc(c, type, f, t, dur, vol, out, f2) {
    var o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02); return o;
  }
  function noise(c, t, dur, vol, out, type, freq, q) {
    var n = A.noiseSrc(t), f = c.createBiquadFilter(), g = c.createGain();
    f.type = type || 'lowpass'; f.frequency.value = freq || 1000; if (q) f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(out); n.start(t, Math.random()); n.stop(t + dur + 0.02); return f;
  }
  var SFX = A.SFX = {
    step_floor: function (c, t, o) { noise(c, t, 0.05, 0.12, o, 'bandpass', 900, 2); },
    step_grass: function (c, t, o) { noise(c, t, 0.07, 0.1, o, 'bandpass', 2400, 1.5); },
    step_wood: function (c, t, o) { osc(c, 'triangle', 180, t, 0.06, 0.12, o, 120); noise(c, t, 0.04, 0.06, o, 'bandpass', 800, 3); },
    step_stone: function (c, t, o) { noise(c, t, 0.04, 0.14, o, 'highpass', 2000); },
    step_water: function (c, t, o) { noise(c, t, 0.15, 0.16, o, 'bandpass', 1300, 2); osc(c, 'sine', 600, t, 0.08, 0.04, o, 1200); },
    step_snow: function (c, t, o) { noise(c, t, 0.12, 0.14, o, 'lowpass', 1800); },
    step_metal: function (c, t, o) { osc(c, 'square', 820, t, 0.05, 0.05, o, 640); noise(c, t, 0.05, 0.08, o, 'highpass', 3000); },
    step_leaves: function (c, t, o) { for (var i = 0; i < 3; i++) noise(c, t + i * 0.02, 0.05, 0.16, o, 'highpass', 3500 + i * 500); },
    step_carpet: function (c, t, o) { noise(c, t, 0.05, 0.05, o, 'lowpass', 500); },
    step_tile: function (c, t, o) { osc(c, 'sine', 1200, t, 0.03, 0.05, o); noise(c, t, 0.03, 0.08, o, 'highpass', 2500); },
    door: function (c, t, o) { var f = noise(c, t, 0.6, 0.18, o, 'bandpass', 300, 8); f.frequency.setValueAtTime(250, t); f.frequency.linearRampToValueAtTime(700, t + 0.5); osc(c, 'sine', 90, t + 0.45, 0.25, 0.25, o, 50); },
    door_locked: function (c, t, o) { osc(c, 'square', 140, t, 0.05, 0.1, o); osc(c, 'square', 120, t + 0.09, 0.06, 0.1, o); },
    effect_get: function (c, t, o) { [0, 4, 7, 12, 16].forEach(function (s, i) { osc(c, 'sine', 523 * Math.pow(2, s / 12), t + i * 0.11, 0.9, 0.12, o); }); },
    cookie: function (c, t, o) { osc(c, 'triangle', 880, t, 0.15, 0.12, o, 1320); osc(c, 'triangle', 1320, t + 0.1, 0.2, 0.1, o); },
    cookie_break: function (c, t, o) { noise(c, t, 0.25, 0.3, o, 'highpass', 1500); osc(c, 'sawtooth', 300, t, 0.3, 0.12, o, 80); },
    menu_move: function (c, t, o) { osc(c, 'square', 660, t, 0.03, 0.04, o); },
    menu_ok: function (c, t, o) { osc(c, 'square', 880, t, 0.05, 0.05, o); osc(c, 'square', 1320, t + 0.05, 0.06, 0.04, o); },
    menu_back: function (c, t, o) { osc(c, 'square', 440, t, 0.06, 0.05, o, 330); },
    bell: function (c, t, o) { var bo = osc(c, 'sine', 880, t, 2.2, 0.25, o); var m = c.createOscillator(), mg = c.createGain(); m.frequency.value = 880 * 2.76; mg.gain.value = 400; m.connect(mg); mg.connect(bo.frequency); m.start(t); m.stop(t + 2.2); },
    whistle: function (c, t, o, p) { var seq = (p && p.seq) || [0, 5, 3]; seq.forEach(function (s, i) { var oo = osc(c, 'sine', 1400 * Math.pow(2, s / 12), t + i * 0.18, 0.16, 0.1, o); oo.frequency.linearRampToValueAtTime(1500 * Math.pow(2, s / 12), t + i * 0.18 + 0.1); }); },
    chime: function (c, t, o, p) { var n = (p && p.note !== undefined) ? p.note : 0; osc(c, 'sine', 523 * Math.pow(2, n / 12), t, 1.4, 0.18, o); osc(c, 'sine', 523 * 3.01 * Math.pow(2, n / 12), t, 0.5, 0.04, o); },
    phone_ring: function (c, t, o) { for (var i = 0; i < 8; i++) { osc(c, 'sine', 440, t + i * 0.05, 0.04, 0.08, o); osc(c, 'sine', 480, t + i * 0.05, 0.04, 0.08, o); } },
    phone_pick: function (c, t, o) { noise(c, t, 0.08, 0.2, o, 'bandpass', 1200, 3); osc(c, 'sine', 350, t + 0.1, 0.5, 0.03, o); osc(c, 'sine', 440, t + 0.1, 0.5, 0.03, o); },
    dial: function (c, t, o, p) { var d = (p && p.d) || 5; osc(c, 'sine', 697 + d * 40, t, 0.12, 0.08, o); osc(c, 'sine', 1209 + d * 30, t, 0.12, 0.08, o); },
    switch: function (c, t, o) { noise(c, t, 0.02, 0.4, o, 'highpass', 3000); osc(c, 'square', 2000, t, 0.01, 0.1, o); },
    pill: function (c, t, o) { osc(c, 'sine', 1800, t, 0.05, 0.05, o); noise(c, t + 0.1, 0.1, 0.06, o, 'lowpass', 900); },
    sleep: function (c, t, o) { [12, 7, 4, 0, -5].forEach(function (s, i) { osc(c, 'sine', 440 * Math.pow(2, s / 12), t + i * 0.25, 1.4, 0.07, o); }); },
    wake: function (c, t, o) { [-5, 0, 4, 7, 12].forEach(function (s, i) { osc(c, 'triangle', 440 * Math.pow(2, s / 12), t + i * 0.09, 0.6, 0.07, o); }); },
    pinch: function (c, t, o) { osc(c, 'sine', 300, t, 0.3, 0.1, o, 900); },
    splash: function (c, t, o) { noise(c, t, 0.4, 0.3, o, 'bandpass', 900, 1); },
    jump: function (c, t, o) { osc(c, 'square', 300, t, 0.12, 0.05, o, 700); },
    land: function (c, t, o) { noise(c, t, 0.06, 0.15, o, 'lowpass', 500); },
    fall: function (c, t, o) { osc(c, 'sine', 900, t, 1.0, 0.12, o, 80); noise(c, t, 1.0, 0.08, o, 'bandpass', 700, 0.6); },
    train_horn: function (c, t, o) { osc(c, 'sawtooth', 220, t, 1.4, 0.08, o); osc(c, 'sawtooth', 277, t, 1.4, 0.07, o); osc(c, 'sawtooth', 330, t, 1.4, 0.06, o); },
    train_pass: function (c, t, o) { var f = noise(c, t, 4, 0.3, o, 'lowpass', 200); f.frequency.linearRampToValueAtTime(900, t + 2); f.frequency.linearRampToValueAtTime(150, t + 4); },
    clock_tick: function (c, t, o) { osc(c, 'square', 3000, t, 0.01, 0.06, o); },
    stamp: function (c, t, o) { osc(c, 'sine', 120, t, 0.12, 0.4, o, 60); noise(c, t, 0.08, 0.2, o, 'lowpass', 800); },
    paper: function (c, t, o) { noise(c, t, 0.25, 0.12, o, 'highpass', 3000); },
    erase: function (c, t, o) { for (var i = 0; i < 4; i++) noise(c, t + i * 0.07, 0.06, 0.1, o, 'bandpass', 2000, 2); },
    chalk: function (c, t, o) { for (var i = 0; i < 5; i++) noise(c, t + i * 0.05, 0.05, 0.08, o, 'highpass', 4000); },
    coin: function (c, t, o) { osc(c, 'square', 988, t, 0.08, 0.06, o); osc(c, 'square', 1319, t + 0.08, 0.25, 0.06, o); },
    win: function (c, t, o) { [0, 4, 7, 12, 7, 12, 16].forEach(function (s, i) { osc(c, 'square', 523 * Math.pow(2, s / 12), t + i * 0.08, 0.12, 0.05, o); }); },
    lose: function (c, t, o) { [7, 6, 5, 4].forEach(function (s, i) { osc(c, 'square', 330 * Math.pow(2, s / 12), t + i * 0.15, 0.18, 0.05, o); }); },
    spin: function (c, t, o) { for (var i = 0; i < 16; i++) osc(c, 'square', 1500, t + i * 0.06 * (1 + i * 0.08), 0.01, 0.04, o); },
    /* ---- petits bruitages d'ambiance (joués de loin, rarement) ---- */
    chirp: function (c, t, o) { for (var i = 0; i < 3; i++) osc(c, 'sine', 3200 + i * 260, t + i * 0.09, 0.06, 0.035, o, 4200 + i * 200); },
    chirp2: function (c, t, o) { osc(c, 'sine', 2600, t, 0.18, 0.03, o, 3600); osc(c, 'sine', 3800, t + 0.22, 0.08, 0.025, o, 2900); },
    twig: function (c, t, o) { noise(c, t, 0.03, 0.12, o, 'highpass', 3000); noise(c, t + 0.05, 0.02, 0.06, o, 'highpass', 4200); },
    rustle: function (c, t, o) { noise(c, t, 0.5, 0.05, o, 'bandpass', 5200, 0.8); },
    owl: function (c, t, o) { osc(c, 'sine', 420, t, 0.32, 0.05, o, 380); osc(c, 'sine', 430, t + 0.45, 0.5, 0.045, o, 360); },
    car_far: function (c, t, o) { var f = noise(c, t, 3.2, 0.05, o, 'lowpass', 300); f.frequency.setValueAtTime(220, t); f.frequency.linearRampToValueAtTime(520, t + 1.4); f.frequency.linearRampToValueAtTime(180, t + 3.1); },
    dog_far: function (c, t, o) { osc(c, 'sawtooth', 300, t, 0.09, 0.025, o, 210); osc(c, 'sawtooth', 320, t + 0.22, 0.09, 0.022, o, 220); },
    door_far: function (c, t, o) { noise(c, t, 0.12, 0.08, o, 'lowpass', 400); osc(c, 'sine', 90, t, 0.2, 0.06, o, 60); },
    bike_bell: function (c, t, o) { osc(c, 'sine', 2350, t, 0.5, 0.03, o); osc(c, 'sine', 2350, t + 0.16, 0.5, 0.025, o); },
    creak: function (c, t, o) { osc(c, 'sawtooth', 160, t, 0.4, 0.02, o, 110); },
    pipe: function (c, t, o) { osc(c, 'triangle', 140, t, 0.15, 0.05, o, 120); osc(c, 'triangle', 150, t + 0.3, 0.12, 0.04, o, 125); },
    buzz: function (c, t, o) { osc(c, 'square', 120, t, 0.6, 0.012, o, 120); },
    phone_far: function (c, t, o) { for (var i = 0; i < 2; i++) { osc(c, 'square', 880, t + i * 0.5, 0.25, 0.012, o); osc(c, 'square', 1100, t + i * 0.5, 0.25, 0.01, o); } },
    drip2: function (c, t, o) { osc(c, 'sine', 1600, t, 0.08, 0.05, o, 700); },
    splash_small: function (c, t, o) { noise(c, t, 0.25, 0.06, o, 'bandpass', 1800, 1.2); },
    gull: function (c, t, o) { osc(c, 'sawtooth', 1300, t, 0.35, 0.015, o, 900); osc(c, 'sawtooth', 1200, t + 0.42, 0.3, 0.012, o, 850); },
    chime2: function (c, t, o) { [0, 4, 7].forEach(function (k, i) { osc(c, 'sine', 1046 * Math.pow(2, k / 12), t + i * 0.18, 1.6, 0.025, o); }); },
    glass_tick: function (c, t, o) { osc(c, 'sine', 4200, t, 0.05, 0.03, o); },
    swell: function (c, t, o) { var f = noise(c, t, 2.6, 0.03, o, 'bandpass', 600, 2); f.frequency.setValueAtTime(400, t); f.frequency.linearRampToValueAtTime(1400, t + 1.6); },
    crunch: function (c, t, o) { noise(c, t, 0.08, 0.07, o, 'bandpass', 2600, 1.5); },
    gust: function (c, t, o) { var f = noise(c, t, 2.2, 0.05, o, 'bandpass', 500, 0.7); f.frequency.setValueAtTime(300, t); f.frequency.linearRampToValueAtTime(900, t + 1); f.frequency.linearRampToValueAtTime(350, t + 2.1); },
    speaker_blip: function (c, t, o) { osc(c, 'sine', 660, t, 0.15, 0.03, o); osc(c, 'sine', 880, t + 0.18, 0.15, 0.03, o); osc(c, 'sine', 1100, t + 0.36, 0.25, 0.03, o); },
    train_far: function (c, t, o) { var f = noise(c, t, 4, 0.04, o, 'lowpass', 220); for (var i = 0; i < 6; i++) noise(c, t + 0.5 + i * 0.42, 0.06, 0.03, o, 'bandpass', 900, 2); },
    page: function (c, t, o) { noise(c, t, 0.18, 0.05, o, 'highpass', 2500); },
    clock_far: function (c, t, o) { osc(c, 'square', 2000, t, 0.02, 0.02, o); osc(c, 'square', 1700, t + 0.5, 0.02, 0.018, o); },
    soul: function (c, t, o) { osc(c, 'sine', 740, t, 1.6, 0.05, o, 370); osc(c, 'triangle', 1110, t + 0.18, 1.4, 0.03, o, 555); osc(c, 'sine', 1480, t + 0.4, 1.2, 0.02, o, 990); },
    reveal: function (c, t, o) { osc(c, 'sine', 600, t, 0.8, 0.08, o, 1800); osc(c, 'sine', 900, t + 0.1, 0.8, 0.05, o, 2700); },
    echo: function (c, t, o) { for (var i = 0; i < 4; i++) osc(c, 'sine', 700, t + i * 0.22, 0.12, 0.12 / (i + 1), o, 500); },
    meow: function (c, t, o) { var oo = osc(c, 'sawtooth', 600, t, 0.4, 0.06, o); oo.frequency.linearRampToValueAtTime(900, t + 0.12); oo.frequency.linearRampToValueAtTime(500, t + 0.38); },
    birdnote: function (c, t, o, p) { var k = (p && p.pitch) || 1; for (var i = 0; i < 2; i++) { var oo = osc(c, 'sine', 2400 * k, t + i * 0.1, 0.09, 0.08, o); oo.frequency.linearRampToValueAtTime(3000 * k, t + i * 0.1 + 0.06); } },
    bird: function (c, t, o) { for (var i = 0; i < 3; i++) { var oo = osc(c, 'sine', 2600, t + i * 0.12, 0.09, 0.06, o); oo.frequency.linearRampToValueAtTime(3400, t + i * 0.12 + 0.06); } },
    fish: function (c, t, o) { osc(c, 'sine', 400, t, 0.15, 0.1, o, 900); },
    wind_gust: function (c, t, o) { var f = noise(c, t, 1.5, 0.15, o, 'bandpass', 400, 1); f.frequency.linearRampToValueAtTime(900, t + 0.8); },
    heartbeat: function (c, t, o) { osc(c, 'sine', 60, t, 0.12, 0.5, o, 40); osc(c, 'sine', 55, t + 0.22, 0.12, 0.4, o, 38); },
    static: function (c, t, o) { noise(c, t, 0.5, 0.15, o, 'highpass', 1500); },
    laugh: function (c, t, o) { for (var i = 0; i < 5; i++) osc(c, 'sawtooth', 300 + (i % 2) * 40, t + i * 0.11, 0.08, 0.05, o); },
    error: function (c, t, o) { osc(c, 'square', 200, t, 0.15, 0.08, o); },
    glass: function (c, t, o) { osc(c, 'sine', 2400, t, 0.6, 0.08, o); osc(c, 'sine', 3600, t, 0.4, 0.04, o); },
    stun: function (c, t, o) { osc(c, 'sawtooth', 1200, t, 0.4, 0.08, o, 200); },
    witch_silent: function (c, t, o) { noise(c, t, 1.6, 0.06, o, 'bandpass', 5000, 4); },
    witch_seam: function (c, t, o) { for (var i = 0; i < 10; i++) osc(c, 'square', 90, t + i * 0.07, 0.03, 0.08, o); },
    witch_copy: function (c, t, o) { [12, 7, 3, 0].forEach(function (s, i) { var oo = osc(c, 'sine', 900 * Math.pow(2, s / 12), t + i * 0.2, 0.3, 0.06, o); oo.frequency.linearRampToValueAtTime(860 * Math.pow(2, s / 12), t + i * 0.2 + 0.3); }); },
    witch_bell: function (c, t, o) { osc(c, 'sine', 659, t, 0.6, 0.12, o); osc(c, 'sine', 523, t + 0.5, 0.9, 0.12, o); },
    witch_voyager: function (c, t, o) { osc(c, 'sawtooth', 110, t, 1.6, 0.06, o, 98); osc(c, 'sawtooth', 147, t, 1.6, 0.05, o, 130); },
    witch_seen: function (c, t, o) { osc(c, 'sawtooth', 150, t, 0.9, 0.08, o, 75); noise(c, t, 0.9, 0.08, o, 'bandpass', 600, 1); },
    jumpscare: function (c, t, o) {
      var soft = YN.save.settings && YN.save.settings.jumpscare === 0;
      var v = soft ? 0.12 : 0.45;
      noise(c, t, 0.9, v, o, 'bandpass', 1200, 0.4);
      [0, 1, 6, 11].forEach(function (s) { osc(c, 'sawtooth', 220 * Math.pow(2, s / 12), t, 1.1, v * 0.35, o, 55); });
    },
    priestess_bell: function (c, t, o) { var bo = osc(c, 'sine', 110, t, 3.5, 0.45, o); var m = c.createOscillator(), mg = c.createGain(); m.frequency.value = 110 * 1.41; mg.gain.value = 90; m.connect(mg); mg.connect(bo.frequency); m.start(t); m.stop(t + 3.5); osc(c, 'sine', 220, t, 2.5, 0.12, o); },
    priestess_chant: function (c, t, o) { [0, 3, 7].forEach(function (s) { A.note('choir', 45 + s, t, 3, 0.12, o); }); },
    priestess_grab: function (c, t, o) { for (var i = 0; i < 8; i++) A.note('choir', 40 + (i * 5) % 12, t + i * 0.15, 1.5, 0.12, o); noise(c, t, 2, 0.3, o, 'lowpass', 400); },
    mother_steps: function (c, t, o) { for (var i = 0; i < 4; i++) { osc(c, 'sine', 70, t + i * 0.55, 0.1, 0.35, o, 45); noise(c, t + i * 0.55, 0.06, 0.08, o, 'lowpass', 400); } },
    mother_click: function (c, t, o) { noise(c, t, 0.02, 0.6, o, 'highpass', 2500); osc(c, 'square', 1800, t, 0.015, 0.15, o); },
    ascii: function (c, t, o) { osc(c, 'square', 1046, t, 0.05, 0.05, o); osc(c, 'square', 1568, t + 0.05, 0.05, 0.05, o); },
    type: function (c, t, o) { osc(c, 'square', 1800 + Math.random() * 300, t, 0.012, 0.03, o); },
    hidden: function (c, t, o) { noise(c, t, 0.4, 0.08, o, 'lowpass', 600); },
    breath: function (c, t, o) { noise(c, t, 1.2, 0.05, o, 'bandpass', 1400, 1); },
    stairs: function (c, t, o) { for (var i = 0; i < 4; i++) noise(c, t + i * 0.12, 0.05, 0.1, o, 'bandpass', 700, 3); },
    tear: function (c, t, o) { noise(c, t, 0.35, 0.2, o, 'highpass', 2000); },
    crumble: function (c, t, o) { for (var i = 0; i < 6; i++) noise(c, t + i * 0.05, 0.08, 0.12, o, 'lowpass', 900 - i * 100); },
    elevator: function (c, t, o) { osc(c, 'sine', 880, t, 0.4, 0.1, o); osc(c, 'sine', 1108, t + 0.3, 0.6, 0.1, o); },
    rain_start: function (c, t, o) { noise(c, t, 2, 0.1, o, 'highpass', 2500); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
