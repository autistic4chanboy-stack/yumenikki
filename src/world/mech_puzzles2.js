/* =========================================================================
 *  MÉCANIQUES D'ÉNIGMES (suite) — cadrans, images qui défilent, quiz,
 *  « tout visiter », repère qui recule, marche au rythme, cycle de looks.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, M = YN.mech;
  function G() { return YN.game; }
  function say(l, c, d) { YN.mechUtil.say(l, c, d); }
  var win = function (rt, p, s, m) { YN.puzzle.win(rt, p, s, m); }, solved = function (p) { return YN.puzzle.solved(p); };

  /* --- cadrans : chaque marque a n états ; la bonne combinaison résout --- */
  M.dials = {
    init: function (rt, p, s) { s.v = {}; p.marks.forEach(function (id, i) { s.v[id] = (p.start && p.start[i]) || 0; var m = rt.findMark(id); if (m) m.lookOpt = Object.assign({}, m.lookOpt, p.optKey ? (function () { var o = {}; o[p.optKey] = (p.values ? p.values[s.v[id]] : s.v[id]); return o; })() : {}); }); },
    onInteract: function (rt, s, p, m) {
      if (p.marks.indexOf(m.key) < 0) return false;
      if (solved(p)) { if (p.doneLine) say([p.doneLine]); return true; }
      s.v[m.key] = (s.v[m.key] + 1) % p.states;
      var label = p.values ? p.values[s.v[m.key]] : s.v[m.key];
      if (p.optKey) { var o = {}; o[p.optKey] = label; m.lookOpt = Object.assign({}, m.lookOpt, o); }
      YN.audio.sfx(p.sfx || 'click', { note: s.v[m.key] * 2 });
      G().toast((p.labelText || '') + label);
      var ok = p.marks.every(function (id, i) { return s.v[id] === p.target[i]; });
      if (ok) win(rt, p, s, m);
      return true;
    }
  };

  /* --- une image qui défile : interagir au bon moment --- */
  M.cycleFrames = {
    init: function (rt, p, s) { s.t = 0; s.i = 0; },
    update: function (rt, s, p, dt) {
      s.t += dt; var i = Math.floor(s.t / (p.every || 2)) % p.frames.length;
      if (i !== s.i) { s.i = i; var m = rt.findMark(p.mark); if (m && p.optKey) { var o = {}; o[p.optKey] = i; m.lookOpt = Object.assign({}, m.lookOpt, o); } }
    },
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.mark) return false;
      if (solved(p)) { say([p.doneLine || p.frames[s.i]]); return true; }
      if (s.i === p.good) { win(rt, p, s, m); return true; }
      say([p.frames[s.i]], { mark: m });
      return true;
    }
  };

  /* --- quiz : une suite de questions à choix --- */
  M.quiz = {
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.mark) return false;
      if (solved(p)) { say([p.doneLine || '…']); return true; }
      var i = 0, errors = 0;
      var ask = function () {
        if (i >= p.questions.length) { if (errors === 0) win(rt, p, s, m); else say([p.failLine || 'A red cross in the margin. Start again.']); return; }
        var q = p.questions[i];
        say([{ t: q.q }], { mark: m }, function () { YN.ui.dialog.choose(q.choices, function (k) { if (k !== q.right) errors++; i++; ask(); }); });
      };
      if (p.intro) say(p.intro, { mark: m }, ask); else ask();
      return true;
    }
  };

  /* --- tout visiter (n'importe quel ordre) --- */
  M.visitAll = {
    init: function (rt, p, s) { s.seen = YN.save.temp('va_' + rt.id) || {}; },
    onInteract: function (rt, s, p, m) {
      if (p.marks.indexOf(m.key) < 0 || solved(p)) return false;
      if (!s.seen[m.key]) { s.seen[m.key] = 1; YN.save.temp('va_' + rt.id, s.seen); YN.audio.sfx('chime', { note: U.keys(s.seen).length * 2 }); if (p.hide) m.active = false; }
      var n = U.keys(s.seen).length;
      if (p.countText) G().toast(p.countText.replace('#', n).replace('%', p.marks.length));
      if (n >= p.marks.length) { if (m.def.lines) say(m.def.lines, { mark: m }, function () { win(rt, p, s, m); }); else win(rt, p, s, m); return true; }
      return !!p.hide;
    }
  };

  /* --- un repère qui recule quand on le regarde --- */
  M.recede = {
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      var m = rt.findMark(p.mark); if (!m) return;
      var pl = G().player, d = U.dist(m.x, m.y, pl.x, pl.y);
      s.cd = (s.cd || 0) - dt;
      if (d < 1.6) { m.active = false; win(rt, p, s, m); return; }
      if (d < (p.dist || 7) && G().isLookingAt(m.x, m.y) && s.cd <= 0) {
        var dx = U.sign(m.x - pl.x), dy = U.sign(m.y - pl.y), nx = m.x + dx * 2, ny = m.y + dy * 2;
        if (rt.passable(nx, ny, 'npc', {})) { m.x = nx; m.y = ny; }
        s.cd = 0.7;
      }
    }
  };

  /* --- marcher au rythme : bouger pendant le silence renvoie au départ --- */
  M.rhythmWalk = {
    init: function (rt, p, s) { s.t = 0; s.beat = false; },
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      s.t += dt; var per = p.period || 1.2, ph = (s.t % per) / per, on = ph < (p.window || 0.45);
      if (on && !s.beat) { YN.audio.sfx('heartbeat', { vol: 0.6 }); YN.render.cam.shake = 0.12; }
      s.beat = on;
      var pl = G().player, z = p.zone;
      if (pl.x >= z[0] && pl.y >= z[1] && pl.x <= z[2] && pl.y <= z[3]) { win(rt, p, s); return; }
      if (!on && pl.moving && pl.y < (p.lineY || 1e9)) { G().placePlayer(p.start[0], p.start[1]); YN.audio.sfx('menu_back'); G().toast(p.failText || 'The heart has gone quiet. She steps back.'); }
    }
  };

  /* --- tours autour d'un centre : quarts de tour comptés (escaliers, rondes) --- */
  M.laps = {
    update: function (rt, s, p) {
      var pl = G().player, a = Math.atan2(pl.py - p.center[1], pl.px - p.center[0]);
      if (s.a === undefined) { s.a = a; s.sum = 0; return; }
      var d = a - s.a; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2;
      s.sum += d; s.a = a;
      YN.save.temp(p.key, Math.floor(Math.abs(s.sum) / (Math.PI / 2)));
    }
  };

  /* --- le rêve changeant : le lieu se réarrange et change de style --- */
  M.shifting = {
    init: function (rt, p, s) { s.t = 0; },
    update: function (rt, s, p, dt) {
      s.t += dt; if (s.t < (p.every || 45)) return; s.t = 0;
      if (G().trans || YN.ui.modalOpen()) return;
      var n = (YN.save.temp('shift_' + rt.id) || 0) + 1; YN.save.temp('shift_' + rt.id, n);
      YN.audio.sfx('static', { vol: 0.4 });
      if (YN.ui.fade) YN.ui.fade.inOut(0.4, '#fff', function () { G().rebuildWorld(); }, function () { });
      else G().rebuildWorld();
    }
  };

  /* --- la pièce rétrécit : un anneau de murs de plus à chaque intervalle --- */
  M.shrink = {
    init: function (rt, p, s) { s.t = 0; s.k = 0; },
    update: function (rt, s, p, dt) {
      if (s.k >= (p.max || 8)) return;
      s.t += dt; if (s.t < (p.every || 9)) return; s.t = 0; s.k++;
      var k = s.k, w = rt.w, h = rt.h;
      for (var x = k; x < w - k; x++) { rt.setTemp(x, k, '#', 'shrink'); rt.setTemp(x, h - 1 - k, '#', 'shrink'); }
      for (var y = k; y < h - k; y++) { rt.setTemp(k, y, '#', 'shrink'); rt.setTemp(w - 1 - k, y, '#', 'shrink'); }
      YN.audio.sfx('door_locked', { vol: 0.5 }); YN.render.cam.shake = 0.3;
      var pl = G().player; if (!rt.passable(pl.x, pl.y, 'player', G().caps())) { var q = YN.world.nearestOpen(rt, pl.x, pl.y); G().placePlayer(q[0], q[1]); }
      if (p.text) G().toast(p.text);
    }
  };

  /* --- des décors changent d'apparence en boucle (sauf un) --- */
  M.cycleLooks = {
    init: function (rt, p, s) { s.t = 0; },
    update: function (rt, s, p, dt) {
      s.t += dt; if (s.t < (p.every || 2.5)) return; s.t = 0;
      var r = YN.rng.make(Math.floor(G().clock * 10));
      rt.marks.forEach(function (m) { if (m.def.cycleGroup === p.group) m.lookOpt = Object.assign({}, m.lookOpt, { c: [r.pick(p.colors)], symbol: r.pick(p.symbols || ['']) }); });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
