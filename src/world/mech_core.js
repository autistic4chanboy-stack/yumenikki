/* =========================================================================
 *  Mécaniques des lieux-pivots et du Jardin.
 *  Signature : init(rt, p, s) · update(rt, s, p, dt) · draw(rt, x, s, p)
 *              onStep/onInteract/onSpeak/onMelody/onEffect(rt, s, p, ...)
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, M = YN.mech;
  function G() { return YN.game; }
  function say(lines, ctx, done) { YN.ui.dialog.queue(lines.map(function (l) { return typeof l === 'string' ? { t: l } : l; }), ctx || {}, done); }
  function near(rt, m, r) { var p = G().player; return m && U.dist(m.x, m.y, p.x, p.y) <= r; }
  YN.mechUtil = { say: say, near: near };

  /* ---------- silhouettes de ville (terrasse) ---------- */
  M.skyline = {
    drawBg: function (rt, x) {
      var R = YN.render, w = R.curW || R.W, h = R.curH || R.H, t = R.ts(), r = YN.rng.make(42);
      var lightOn = YN.save.perm && YN.save.perm.room.light, hz = h * 0.46;
      var sky = x.createLinearGradient(0, 0, 0, hz + t);
      sky.addColorStop(0, '#05061a'); sky.addColorStop(0.7, '#141a3a'); sky.addColorStop(1, '#2a2440');
      x.fillStyle = sky; x.fillRect(0, 0, w, hz + t);
      // trois rangées d'immeubles, chacune plus proche et plus sombre
      for (var L = 0; L < 3; L++) {
        var f = 0.04 + L * 0.05, off = -R.cam.x * t * f, col = ['#1a1c34', '#11132a', '#0a0b1c'][L];
        var n = Math.ceil(w / (t * 0.9)) + 6;
        for (var i = 0; i < n; i++) {
          var bw = (0.5 + r.next() * 1.1) * t, bh = (0.8 + r.next() * (2.6 - L * 0.5)) * t;
          var bx = U.mod(i * t * 0.9 + off + r.next() * t * 0.4, w + t * 4) - t * 2, by = hz - bh + L * t * 0.18;
          x.fillStyle = col; x.fillRect(bx, by, bw, bh + t);
          if (r.next() < 0.18) { x.fillRect(bx + bw * 0.45, by - t * 0.35, Math.max(1, t * 0.04), t * 0.35); if ((R.t * 1.2 + i) % 2 < 1) { x.fillStyle = '#ff3040'; x.fillRect(bx + bw * 0.45 - t * 0.02, by - t * 0.38, t * 0.08, t * 0.05); } }
          var wn = Math.floor(bw / (t * 0.16)), hn = Math.floor(bh / (t * 0.2));
          for (var yy = 0; yy < hn; yy++) for (var xx = 0; xx < wn; xx++) {
            if (r.next() < (lightOn ? 0.2 : 0.12) * (1 - L * 0.2)) { x.fillStyle = r.next() < 0.7 ? '#e8d890' : '#a0c8f0'; x.globalAlpha = 0.5 + L * 0.2; x.fillRect(bx + (xx + 0.3) * t * 0.16, by + (yy + 0.4) * t * 0.2, t * 0.07, t * 0.09); x.globalAlpha = 1; }
          }
        }
      }
    }
  };

  /* ---------- la salle des nids ---------- */
  M.effectGallery = {
    init: function (rt, p, s) {
      s.nests = rt.marks.filter(function (m) { return m.type === 'nest'; }).sort(function (a, b) { var aa = Math.atan2(a.y - 9, a.x - 11), bb = Math.atan2(b.y - 9, b.x - 11); return aa - bb; });
    },
    update: function (rt, s) {
      var eggs = (YN.save.perm.eggs || []).concat(YN.save.dream ? YN.save.dream.eggs : []);
      s.nests.forEach(function (m, i) { var id = eggs[i]; m.lookOpt = id ? { egg: true } : null; m.state.egg = id || null; });
    },
    draw: function (rt, x, s) {
      var list = YN.save.ownedEffects(), rs = YN.render.ts() / 16, t = YN.render.t, N = list.length;
      // un disque en spirale (tournesol), au milieu exact de la salle, à l'intérieur du cercle des nids
      var cx = rt.w / 2, cy = rt.h / 2, R = N > 60 ? 4.7 : 4.1, GA = 2.39996;
      for (var i = 0; i < N; i++) {
        var d = YN.effectById(list[i]); if (!d) continue;
        var rr = R * Math.sqrt((i + 0.5) / Math.max(1, N)), a = i * GA + t * 0.08;
        var p = YN.render.toScreen(rt, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82);
        var sz = Math.round(Math.max(10, Math.min(14, 14 * Math.sqrt(48 / Math.max(48, N)))) * (YN.render.tpx || 20) / 20), ic = YN.spr.icon(d.icon, sz), bob = Math.round(Math.sin(t * 2 + i) * 1.5 * rs);
        var gl = x.createRadialGradient(p[0], p[1] - bob, 0, p[0], p[1] - bob, sz * 0.75);
        gl.addColorStop(0, 'rgba(255,240,200,' + (N > 60 ? 0.14 : 0.3) + ')'); gl.addColorStop(1, 'rgba(255,240,200,0)');
        x.fillStyle = gl; x.fillRect(p[0] - sz, p[1] - bob - sz, sz * 2, sz * 2);
        x.globalAlpha = YN.save.effectState(d.id) === 'dream' ? 0.45 : 0.9;
        x.drawImage(ic, Math.round(p[0] - sz / 2), Math.round(p[1] - bob - sz / 2), sz, sz);
      }
      x.globalAlpha = 1;
    },
    onInteract: function (rt, s, p, m) {
      if (m.type !== 'nest') return false;
      var S = YN.save;
      if (m.state.egg) { var d0 = YN.effectById(m.state.egg); say(['A stone egg, warm.' + (d0 ? ' Faintly, inside: ' + d0.name.toLowerCase() + '.' : '')]); return true; }
      var owned = S.ownedEffects(), total = owned.length + S.eggCount();
      if (total < 30) { say(['The nest is cold.']); return true; }
      if (!owned.length) { say(['There is nothing left to lay down.']); return true; }
      var labels = owned.slice(0, 12).map(function (id) { return YN.effectById(id).name; }).concat(['Nothing']);
      say(['The nest is warm. It is waiting for something.'], {}, function () {
        YN.ui.dialog.choose(labels, function (i) {
          if (i >= owned.length || i >= 12) return;
          var id = owned[i];
          YN.ui.confirm('Lay “' + U.escape(YN.effectById(id).name) + '” down here? She will never wear it again.', function () {
            G().depositEgg(id); YN.ui.hud.refresh();
            if (S.eggCount() >= 30) say(['All thirty nests are full. Somewhere above, a door is listening.']);
          });
        });
      });
      return true;
    }
  };

  /* ---------- grille qui s'ouvre au sifflet / à la musique ---------- */
  M.gate = {
    init: function (rt, p, s) {
      s.fn = function () {
        if (G().rt !== rt) return;
        var m = rt.findMark(p.mark);
        if (!m || YN.save.flag(p.flag) || !near(rt, m, p.dist || 5)) return;
        YN.save.setFlag(p.flag, true); YN.audio.sfx('door'); G().toast(p.text || '…'); YN.world.reeval(rt);
      };
      (p.events || ['whistle']).forEach(function (ev) { YN.bus.on(ev, s.fn); });
    },
    onLeave: function (rt, s, p) { (p.events || ['whistle']).forEach(function (ev) { YN.bus.off(ev, s.fn); }); }
  };

  /* ---------- pont cassé : poser les planches ---------- */
  M.bridgePlanks = {
    init: function (rt, p, s) { s.placed = YN.save.temp('planks:' + rt.id) || 0; if (!YN.save.flag(p.flag)) for (var i = 0; i < s.placed; i++) rt.setTemp(p.gaps[i][0], p.gaps[i][1], '=', 'bridge'); },
    onInteractNothing: function (rt, s, p, x, y) {
      var gi = -1; p.gaps.forEach(function (g, i) { if (g[0] === x && g[1] === y) gi = i; });
      if (gi < 0 || rt.tile(x, y) !== '_') return false;
      if (YN.save.items('plank') <= 0) { say(['Three planks are missing. Down below, something breathes.']); return true; }
      YN.save.addItem('plank', -1);
      rt.setTemp(x, y, '=', 'bridge'); s.placed++; YN.save.temp('planks:' + rt.id, s.placed);
      YN.audio.sfx('step_wood'); YN.audio.sfx('stamp', { vol: 0.4 });
      if (p.gaps.every(function (g) { return rt.tile(g[0], g[1]) === '='; })) { YN.save.setFlag(p.flag, true); G().toast('The bridge holds.'); }
      return true;
    }
  };
  M.plankPile = {
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.mark) return false;
      if (YN.save.flag('pepin_pile_taken')) { say(['The pile of planks. One is missing, and someone has noticed.']); return true; }
      say(['A neat pile of planks. On the top one: “FOR A GARDEN”.'], {}, function () {
        YN.ui.dialog.choose(['Take one', 'Leave them'], function (i) {
          if (i !== 0) return;
          YN.save.addItem('plank', 1); YN.save.setFlag('pepin_pile_taken', true); YN.save.addRel(p.owner, -1);
          YN.audio.sfx('step_wood'); G().toast('A plank.');
        });
      });
      return true;
    }
  };

  /* ---------- champ de feuilles : la pousse s'enfuit ---------- */
  M.gardenLeaves = {
    onStep: function (rt, s, p, x, y) {
      var m = rt.findMark(p.sprout); if (!m || !m.active || YN.save.hasEffect('E01')) return;
      if (rt.tile(x, y) !== ';') return;
      if (G().caps().feather || YN.cond.roomFelt(rt.depth).dark) return; // elle dort la nuit ; la plume ne fait pas de bruit
      if (U.dist(m.x, m.y, x, y) > 6) return;
      var f = p.field, r = YN.rng.make(Date.now() & 0xffff), tries = 0;
      while (tries++ < 200) {
        var nx = r.int(f[0] + 1, f[2] - 1), ny = r.int(f[1] + 1, f[3] - 1);
        if (rt.tile(nx, ny) === '"' && U.dist(nx, ny, x, y) >= 5 && !rt.markAt(nx, ny)) { m.x = nx; m.y = ny; break; }
      }
      YN.audio.sfx('hidden'); YN.save.temp('sproutFled', (YN.save.temp('sproutFled') || 0) + 1);
      G().toast('Something burrows under the leaves.');
    }
  };

  /* ---------- le merle et ses quatre directions ---------- */
  var DIRN = ['up', 'right', 'down', 'left'];
  M.gardenBird = {
    init: function (rt, p, s) {
      var r = YN.rng.make('merle:' + (YN.save.dream ? YN.save.dream.no : 0));
      s.seq = []; for (var i = 0; i < 4; i++) s.seq.push(DIRN[r.int(0, 3)]);
      s.listen = false; s.prog = 0;
    },
    sing: function (rt, s) {
      var bird = rt.findEnt('N015');
      s.listen = true; s.prog = 0;
      // c'est lui qui montre : un petit saut dans chaque direction, une note à chaque saut
      s.show = { t0: performance.now() / 1000, seq: s.seq.slice() };
      s.seq.forEach(function (d, i) {
        setTimeout(function () {
          YN.audio.sfx('birdnote', { pitch: d === 'up' ? 1.5 : d === 'down' ? 0.65 : 1, pan: d === 'left' ? -0.9 : d === 'right' ? 0.9 : 0 });
          if (bird) YN.render.addFx({ type: 'note', x: bird.x, y: bird.y - 0.6, life: 0.9, color: 'rgba(255,250,225,0.8)' });
        }, 300 + i * 650);
      });
    },
    animate: function (rt, s) {
      var bird = rt.findEnt('N015'); if (!bird) return;
      var sh = s.show; bird.jx = 0; bird.jy = 0; bird.jz = 0;
      if (!sh) return;
      var now = performance.now() / 1000 - sh.t0, V = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
      if (now > 0.3 + sh.seq.length * 0.65 + 0.4) { s.show = null; bird.dir = 'down'; return; }
      for (var i = 0; i < sh.seq.length; i++) {
        var u = (now - 0.3 - i * 0.65) / 0.55; if (u < 0 || u > 1) continue;
        var d = sh.seq[i], v = V[d], o = Math.sin(Math.PI * u) * 0.8;
        bird.dir = d; bird.jx = v[0] * o; bird.jy = v[1] * o; bird.jz = Math.abs(Math.sin(Math.PI * u * 2)) * 0.22; // petit saut (décalage d'affichage)
      }
    },
    onAction: function (rt, s, p, a) {
      if (a !== 'birdSing') return false;
      if (YN.save.hasEffect('E02')) { YN.audio.sfx('bird'); YN.speech.npcBubble(rt.findEnt('N015'), '♪'); return true; }
      if (YN.cond.roomFelt(rt.depth).dark) { YN.speech.npcBubble(rt.findEnt('N015'), 'zzz'); return true; }
      M.gardenBird.sing(rt, s);
      return true;
    },
    onStep: function (rt, s, p, x, y) {
      if (!s.listen || YN.save.hasEffect('E02')) return;
      var b = p.plaza; if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) return;
      var d = G().lastStep && G().lastStep.dir;
      if (d === s.seq[s.prog]) {
        s.prog++; YN.audio.sfx('chime', { note: s.prog * 2 });
        if (s.prog >= s.seq.length) {
          s.listen = false;
          var bird = rt.findEnt('N015');
          YN.audio.sfx('bird');
          say([{ t: 'The blackbird lands on her shoulder, whistles three notes, and flies off.', who: '' }], {}, function () { G().giveEffect('E02'); });
          if (bird) bird.dir = 'down';
        }
      } else if (s.prog > 0 || true) { if (s.prog > 0) YN.audio.sfx('menu_back'); s.prog = d === s.seq[0] ? 1 : 0; }
    },
    draw: function (rt, x, s, p) {
      M.gardenBird.animate(rt, s);
      if (!rt.vflags.snow || YN.save.hasEffect('E02')) return;
      // dans la neige, ses pas restent : quatre traces dans l'ordre
      var b = p.plaza, cx = Math.floor((b[0] + b[2]) / 2), cy = Math.floor((b[1] + b[3]) / 2), rs = YN.render.ts() / 16;
      var pos = [cx, cy];
      s.seq.forEach(function (d, i) {
        var v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[d];
        var sp = YN.render.toScreen(rt, pos[0] + v[0] * 0.5 + 0.5, pos[1] + v[1] * 0.5 + 0.5);
        x.fillStyle = 'rgba(80,90,120,0.45)';
        for (var k = 0; k < 3; k++) { var fx = sp[0] + v[0] * k * 3 * rs, fy = sp[1] + v[1] * k * 3 * rs, a = Math.atan2(v[1], v[0]); x.save(); x.translate(fx, fy); x.rotate(a); x.beginPath(); x.ellipse(0, -1.2 * rs, 1.6 * rs, 0.8 * rs, 0, 0, 6.28); x.ellipse(1.2 * rs, 1.2 * rs, 1.6 * rs, 0.8 * rs, 0, 0, 6.28); x.fill(); x.restore(); }
        pos = [pos[0] + v[0], pos[1] + v[1]];
      });
    }
  };

  /* ---------- nénuphars et boîte à musique ---------- */
  M.gardenLilies = {
    init: function (rt, p, s) { s.buf = ''; s.ff = 0; s.t = 0; },
    playLullaby: function () {
      var seq = YN.data.lullaby.split('').map(Number), ST = [0, 2, 4, 7, 9];
      seq.forEach(function (n, i) { setTimeout(function () { YN.audio.sfx('chime', { note: ST[n] }); }, i * 520); });
    },
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.box) return false;
      say(['A music box resting on a stone. The lid opens by itself.'], {}, function () { M.gardenLilies.playLullaby(); });
      return true;
    },
    onStep: function (rt, s, p, x, y) {
      var n = p.lilies[x + ',' + y]; if (n === undefined) return;
      YN.audio.sfx('chime', { note: [0, 2, 4, 7, 9][n] });
      YN.render.addFx({ type: 'ring', x: x, y: y, life: 0.6, r: 10, color: 'rgba(240,200,255,0.8)' });
      s.buf = (s.buf + n).slice(-12);
      if (s.buf.indexOf(YN.data.lullaby) >= 0 && !YN.save.hasEffect('E03')) {
        s.buf = '';
        say([{ t: 'The pond sings along with her, then falls silent.', who: '' }], {}, function () { G().giveEffect('E03'); });
      }
    },
    update: function (rt, s, p, dt) { s.t += dt; },
    draw: function (rt, x, s, p) {
      // la nuit, les lucioles montrent l'air sur les nénuphars
      if (!YN.cond.roomFelt(rt.depth).dark || YN.save.hasEffect('E03')) return;
      var seq = YN.data.lullaby, i = Math.floor(s.t / 0.8) % (seq.length + 2);
      if (i >= seq.length) return;
      var n = +seq[i], pos = null;
      U.keys(p.lilies).forEach(function (k) { if (p.lilies[k] === n) pos = k.split(',').map(Number); });
      if (!pos) return;
      var sp = YN.render.toScreen(rt, pos[0] + 0.5, pos[1] + 0.3), rs = YN.render.ts() / 16;
      var g = x.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], 10 * rs);
      g.addColorStop(0, 'rgba(240,255,150,0.9)'); g.addColorStop(1, 'rgba(240,255,150,0)');
      x.fillStyle = g; x.fillRect(sp[0] - 10 * rs, sp[1] - 10 * rs, 20 * rs, 20 * rs);
      rt.lightsExtra = [{ x: pos[0], y: pos[1], r: 1.4 }];
    }
  };

  /* ---------- le poisson de l'étang ---------- */
  M.gardenFish = {
    onMelody: function (rt, s, p, str) {
      var f = rt.findEnt(p.fish); if (!f || YN.save.hasEffect('E04')) return false;
      if (str.indexOf(YN.data.lullaby) < 0) return false;
      if (U.dist(f.x, f.y, G().player.x, G().player.y) > 7) return false;
      YN.audio.sfx('splash'); YN.render.addFx({ type: 'ring', x: f.x, y: f.y, life: 1, r: 20 });
      say([{ t: 'The fish leaps out of the water, once, twice, then stays close to her.', who: '' }], {}, function () { G().giveEffect('E04'); });
      return true;
    }
  };

  /* ---------- la statue « En mémoire de maman » ---------- */
  M.gardenStatue = {
    init: function (rt, p, s) {
      s.onPlant = function (x, y) {
        var m = rt.findMark(p.statue); if (!m || G().rt !== rt) return;
        if (U.dist(m.x, m.y, x, y) <= 1.5) { YN.save.setFlag('statue_flowers', true); YN.world.reeval(rt); G().toast('Flowers have grown at the foot of the stone.'); YN.act.run({ quest: { Q02: YN.save.questStage('Q02') || 'statue' } }); }
      };
      YN.bus.on('planted', s.onPlant);
    },
    onLeave: function (rt, s) { YN.bus.off('planted', s.onPlant); },
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.statue) return false;
      var l = [{ t: 'A statue of a woman, hands clasped. The face is worn by the rain.' }, { t: 'On the plinth: “In memory of Mum”.' }];
      if (YN.save.flag('statue_flowers')) l.push({ t: 'The flowers have lasted.' });
      if (YN.save.corruption(rt.id) > 0) l.push({ t: 'The stone is split by a black line, perfectly straight, as if drawn with a ruler.' });
      say(l);
      return true;
    },
    onSpeak: function (rt, s, p, n) {
      var m = rt.findMark(p.statue); if (!near(rt, m, 3)) return false;
      if (/\b(mum|mom|mummy|mommy|mama|mother|엄마|어머니)\b/.test(n) || n.indexOf('엄마') >= 0) { say(['The stone is warm under her hand.']); YN.save.setFlag('said_maman_statue', true); return true; }
      if (/(grandma|grandmother|granny|halmeoni|할머니)/.test(n)) { say(['Somewhere, a blackbird whistles three notes. The same as the chimes.']); YN.save.setFlag('said_halmeoni', true); YN.save.addNote('n_halmeoni'); return true; }
      if (/(oksun|옥순)/.test(n)) { say(['The wind turns. For a moment, it smells of wet earth and soap.']); YN.save.addNote('n_oksun_statue'); return true; }
      return false;
    },
    onMelody: function (rt, s, p, str) {
      var m = rt.findMark(p.statue); if (!near(rt, m, 4)) return false;
      if (str.indexOf(YN.data.lullaby) >= 0 && YN.save.corruption(rt.id) > 0) { YN.save.stabilize(rt.id, 5); YN.corruption.apply(rt); G().toast('The black line fades from the stone.'); return true; }
      return false;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* ---------- le disque du Nexus : sol peint en couches, sigle central ---------- */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  YN.mech.nexusFloor = {
    drawBg: function (rt, x) {
      var rs = YN.render.ts() / 16, t = YN.render.t;
      var c = YN.render.toScreen(rt, 10.5, 8.5), R = 7.6 * 16 * rs;
      var n = YN.save.perm ? YN.save.perm.effects.length + YN.save.perm.eggs.length : 0;
      var g = x.createRadialGradient(c[0], c[1], R * 0.1, c[0], c[1], R);
      g.addColorStop(0, '#3a2e58'); g.addColorStop(0.55, '#241c3c'); g.addColorStop(0.92, '#1a1430'); g.addColorStop(1, '#0c0a18');
      x.fillStyle = g; x.beginPath(); x.arc(c[0], c[1], R, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(160,140,230,0.35)'; x.lineWidth = rs;
      [0.98, 0.7, 0.32].forEach(function (k) { x.beginPath(); x.arc(c[0], c[1], R * k, 0, Math.PI * 2); x.stroke(); });
      // la mosaïque : une tesselle colorée par effet gardé
      var cols = ['#e07080', '#f0c060', '#70d0a0', '#80a0f0', '#c080f0', '#f09050', '#a0e0f0', '#f0e0a0'];
      for (var i = 0; i < 90; i++) {
        var a = i / 90 * Math.PI * 2, rr = R * 0.84;
        var px = c[0] + Math.cos(a) * rr, py = c[1] + Math.sin(a) * rr;
        x.fillStyle = i < n ? cols[i % cols.length] : 'rgba(120,110,170,0.18)';
        x.globalAlpha = i < n ? 0.75 + 0.25 * Math.sin(t * 1.5 + i) : 1;
        x.beginPath(); x.moveTo(px, py - 2.4 * rs); x.lineTo(px + 2.4 * rs, py); x.lineTo(px, py + 2.4 * rs); x.lineTo(px - 2.4 * rs, py); x.closePath(); x.fill();
      }
      x.globalAlpha = 1;
      // sigle central : un œil fermé, ou ouvert quand la lumière est éteinte
      var dark = YN.cond.roomFelt(1).dark;
      x.strokeStyle = dark ? 'rgba(220,200,255,0.55)' : 'rgba(200,180,255,0.3)'; x.lineWidth = 1.5 * rs;
      x.beginPath(); x.ellipse(c[0], c[1], 22 * rs, 9 * rs, 0, 0, Math.PI); x.stroke();
      if (dark) { x.beginPath(); x.ellipse(c[0], c[1], 22 * rs, 9 * rs, 0, Math.PI, Math.PI * 2); x.stroke(); x.beginPath(); x.arc(c[0], c[1], 4 * rs, 0, Math.PI * 2); x.stroke(); }
      void U;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
