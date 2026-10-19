/* =========================================================================
 *  NOUVELLES ÉNIGMES (paramétrées par chaque monde, comme les autres).
 *  Paramètres communs : give, reward, flag, done, winLines, text (voir mech_puzzles.js).
 *   · lampsAll : allumer toutes les lumières (marques p.lamps) ; p.time : elles
 *                s'éteignent après ce délai si toutes ne sont pas allumées.
 *   · pairs    : retrouver les paires de symboles cachés sous des objets (p.tiles).
 *   · push     : pousser des caisses (p.blocks) sur des dalles (p.plates).
 *   · trail    : des traces de pas mènent de p.from à p.to ; seul qui les suit
 *                jusqu'au bout sans s'en écarter (p.slack cases) réussit.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, M = YN.mech;
  function G() { return YN.game; }
  function say(l, c, d) { YN.mechUtil.say(l, c, d); }
  function solved(p) { return YN.puzzle.solved(p); }
  function win(rt, p, s, m) { YN.puzzle.win(rt, p, s, m); }
  var GLYPH = ['☾', '✿', '◆', '♫', '✦', '☂', '♥', '☀', '✚', '◐'];

  M.lampsAll = {
    init: function (rt, p, s) { s.on = {}; s.t = {}; },
    update: function (rt, s, p, dt) {
      if (!p.time || solved(p) || s.won) return;
      U.keys(s.on).forEach(function (id) {
        if (!s.on[id]) return; s.t[id] += dt;
        if (s.t[id] > p.time) { s.on[id] = false; var m = rt.findMark(id); if (m) { m.lit = false; m.light = 0; } YN.audio.sfx('menu_back', { vol: 0.3 }); }
      });
    },
    onInteract: function (rt, s, p, m) {
      var id = m.def.id || m.key; if ((p.lamps || []).indexOf(id) < 0) return false;
      if (solved(p) || s.won) { if (p.doneLine) say([p.doneLine]); return true; }
      if (s.on[id]) { if (p.onLine) say([p.onLine]); return true; }
      s.on[id] = true; s.t[id] = 0; m.lit = true; m.light = p.light || 2.4;
      YN.audio.sfx('switch'); YN.audio.sfx('chime', { note: U.keys(s.on).filter(function (k) { return s.on[k]; }).length * 2, vol: 0.5 });
      YN.render.addFx({ type: 'spark', x: m.x, y: m.y, life: 0.8, color: '#fff0b0' });
      if ((p.lamps || []).every(function (q) { return s.on[q]; })) win(rt, p, s, m);
      else if (p.litLines && p.litLines.length) say([p.litLines[U.keys(s.on).filter(function (k) { return s.on[k]; }).length % p.litLines.length]], { mark: m });
      return true;
    }
  };

  M.pairs = {
    init: function (rt, p, s) {
      var tiles = (p.tiles || []).slice(), r = YN.rng.make(YN.rng.hash(rt.id + ':pairs:' + ((YN.save.dream && YN.save.dream.no) || 0)));
      var sym = []; for (var i = 0; i < tiles.length; i++) sym.push(GLYPH[Math.floor(i / 2) % GLYPH.length]);
      sym = U.shuffle(sym, r); s.sym = {}; tiles.forEach(function (id, i) { s.sym[id] = sym[i]; });
      s.open = null; s.done = {}; s.busy = 0;
    },
    update: function (rt, s, p, dt) { if (s.busy > 0) s.busy -= dt; },
    onInteract: function (rt, s, p, m) {
      var id = m.def.id || m.key; if (!s.sym || !s.sym[id]) return false;
      if (solved(p) || s.won) { if (p.doneLine) say([p.doneLine]); return true; }
      if (s.done[id] || s.busy > 0) return true;
      var g = s.sym[id];
      YN.render.addFx({ type: 'note', x: m.x, y: m.y - 0.4, life: 1.4, text: g, color: '#f0e8ff' }); YN.audio.sfx('page');
      if (!s.open) { s.open = id; return true; }
      if (s.open === id) return true;
      if (s.sym[s.open] === g) {
        s.done[id] = s.done[s.open] = true; s.open = null; YN.audio.sfx('chime', { note: U.keys(s.done).length });
        [id].forEach(function () { YN.render.addFx({ type: 'spark', x: m.x, y: m.y, life: 0.7, color: '#d8f0ff' }); });
        if (U.keys(s.sym).every(function (q) { return s.done[q]; })) win(rt, p, s, m);
      } else { s.open = null; s.busy = 1; YN.audio.sfx('menu_back'); if (p.wrongLine) say([p.wrongLine], { mark: m }); }
      return true;
    }
  };

  M.push = {
    onTryMove: function (rt, s, p, x, y, dir) {
      if (solved(p) || s.won) return false;
      var b = rt.marksAt(x, y).filter(function (m) { return (p.blocks || []).indexOf(m.def.id || m.key) >= 0; })[0]; if (!b) return false;
      var v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir]; if (!v) return false;
      var nx = x + v[0], ny = y + v[1];
      var free = YN.tileInfo(rt.tile(nx, ny)).pass && !rt.marksAt(nx, ny).some(function (m) { return m.solid; }) && !rt.entAt(nx, ny);
      if (!free) { YN.audio.sfx('door_locked', { vol: 0.3 }); return true; }
      b.x = nx; b.y = ny; YN.audio.sfx(p.sfx || 'stamp', { vol: 0.5 });
      var plates = (p.plates || []).map(function (id) { return rt.findMark(id); }).filter(Boolean);
      if (plates.length && plates.every(function (pl) { return rt.marksAt(pl.x, pl.y).some(function (m) { return (p.blocks || []).indexOf(m.def.id || m.key) >= 0; }); })) win(rt, p, s, b);
      return true;
    }
  };

  M.trail = {
    init: function (rt, p, s) { s.path = null; s.i = 0; s.off = 0; },
    build: function (rt, p, s) {
      var a = rt.findMark(p.from), b = rt.findMark(p.to); if (!a || !b) return;
      var w = rt.w, h = rt.h, par = new Int32Array(w * h).fill(-2), q = [a.y * w + a.x], qi = 0; par[q[0]] = -1;
      var goal = -1, D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      while (qi < q.length && goal < 0) {
        var k = q[qi++], x = k % w, y = (k / w) | 0;
        for (var j = 0; j < 4; j++) { var nx = x + D[j][0], ny = y + D[j][1]; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; var nk = ny * w + nx; if (par[nk] !== -2) continue; if (Math.abs(nx - b.x) + Math.abs(ny - b.y) <= 1) { par[nk] = k; goal = nk; break; } if (!rt.passable(nx, ny, 'pbody', {})) continue; par[nk] = k; q.push(nk); }
      }
      var path = []; for (var c = goal; c >= 0; c = par[c]) path.push([c % w, (c / w) | 0]); s.path = path.reverse();
    },
    onStep: function (rt, s, p, x, y) {
      if (solved(p) || s.won) return;
      if (!s.path) M.trail.build(rt, p, s); if (!s.path || !s.path.length) return;
      // la trace la plus avancée à portée de pas (sans sauter plus loin que quelques traces), sinon une trace déjà suivie
      var sl = p.slack || 0, ahead = -1, behind = -1, lim = Math.min(s.path.length - 1, s.i + sl * 2 + 2);
      for (var i = 0; i < s.path.length; i++) {
        if (Math.abs(s.path[i][0] - x) + Math.abs(s.path[i][1] - y) > sl) continue;
        if (i >= s.i && i <= lim) ahead = i; else if (i < s.i) behind = i;
      }
      if (ahead < 0 && behind < 0) { if (s.i > 0) { s.i = 0; YN.audio.sfx('menu_back', { vol: 0.3 }); if (p.lostLine) G().toast(p.lostLine, 2.5); } return; }
      if (ahead >= 0) s.i = ahead;
      if (s.i >= s.path.length - 1) win(rt, p, s, rt.findMark(p.to));
    },
    draw: function (rt, x, s, p) {
      if (solved(p) || s.won) return; if (!s.path) M.trail.build(rt, p, s); if (!s.path) return;
      var t = YN.render.ts(), ph = YN.render.t;
      for (var i = 0; i < s.path.length; i++) {
        if (p.dark && !YN.cond.roomFelt(rt.depth).dark && rt.darkness < 0.4) break;
        var c = s.path[i], sp = YN.render.toScreen(rt, c[0] + 0.5, c[1] + 0.6), a = i < s.i ? 0.15 : 0.32 + 0.12 * Math.sin(ph * 2 + i * 0.7);
        x.fillStyle = 'rgba(40,30,50,' + a.toFixed(3) + ')'; var o = (i % 2 ? 1 : -1) * Math.max(1, t / 10);
        x.fillRect(Math.round(sp[0] + o - t * 0.06), Math.round(sp[1] - t * 0.08), Math.max(1, Math.round(t / 8)), Math.max(1, Math.round(t / 6)));
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
