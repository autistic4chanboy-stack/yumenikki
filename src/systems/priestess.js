/* =========================================================================
 *  La Grande Prêtresse. Rare, annoncée par des présages, rapide, elle
 *  réécrit les règles du monde (pouvoirs réguliers et observables) et
 *  laisse une corruption persistante. Trois cloches = étreinte sans biscuit.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  var P = YN.priestess = {
    a: null, checkT: 40,
    reset: function () {
      if (P.a && YN.game.rt) P.cleanup(YN.game.rt);
      P.a = null; P.checkT = 40;
      YN.audio.setMods({ rate: 1 });
    },
    beginDream: function () { P.reset(); P.checkT = 50 + Math.random() * 40; },
    eligible: function () {
      var p = YN.save.perm; if (!p) return false;
      if (YN.save.flag('priestess_off')) return false;
      return p.effects.length + p.eggs.length >= 20 || !!p.flags.deep_visited || !!(YN.debug && YN.debug.forcePriestess);
    },
    isIn: function (wid) { return !!(P.a && P.a.world === wid && (P.a.state === 'present' || P.a.state === 'locking' || P.a.state === 'chase')); },
    omensIn: function (wid) { return !!(P.a && P.a.world === wid && P.a.state === 'omens'); },
    locked: function () { return !!(P.a && P.a.state === 'chase' && P.a.locked); },
    summon: function (o) {
      var rt = YN.game.rt; if (!rt || YN.net.SAFE[rt.id]) return;
      P.start(rt, o && o.now ? 2 : 18);
    },
    playerEntered: function (rt, fromId) {
      var a = P.a;
      if (a && (a.state === 'present' || a.state === 'locking' || a.state === 'chase')) {
        if (a.world === fromId && (a.lastSaw || a.locked) && a.follows < 2 && !YN.net.SAFE[rt.id]) {
          // elle franchit la porte juste derrière
          a.world = rt.id; a.follows++; a.arriveIn = 3; a.state = 'following';
        } else if (a.world !== rt.id) { P.leave(true); }
      } else if (a && a.state === 'omens' && a.world !== rt.id) { P.cleanup(YN.game.rt); P.a = null; }
      // une corruption non stabilisée la rappelle
      if (!P.a && P.eligible() && YN.save.corruption(rt.id) >= 3 && !YN.net.SAFE[rt.id] && Math.random() < 0.35) P.start(rt, 25);
    },
    start: function (rt, omen) {
      P.a = { world: rt.id, x: 0, y: 0, fx: 0, fy: 0, state: 'omens', omenT: omen, powerT: 10, bells: 0, bellT: 0, locked: false,
        seen: 0, lullabyUsed: false, follows: 0, sawDoor: false, lifeT: 70 + Math.random() * 30, moving: false, mt: 0, stun: 0 };
      rt.priestessSigns = true;
      // présage : les PNJ se figent, une porte apparaît au mauvais endroit
      rt.ents.forEach(function (e) { e.frozenByP = true; });
      var p = YN.game.player;
      var spot = YN.world.nearestOpen(rt, U.clamp(p.x + (Math.random() < 0.5 ? -9 : 9), 1, rt.inf ? p.x + 9 : rt.w - 2), U.clamp(p.y + (Math.random() < 0.5 ? -6 : 6), 1, rt.inf ? p.y + 6 : rt.h - 2));
      P.a.door = YN.world.addMark(rt, { type: 'door', id: 'pr_wrongdoor', look: 'door', lookOpt: { style: 'shoji', c: ['#f0f0e8'] }, to: rt.id, arrive: null, lockedText: '…' }, spot[0], spot[1], null);
      P.a.door.def = Object.assign({}, P.a.door.def, { lock: { text: 'The handle is warm.', unless: { fn: function () { return false; } } } });
      YN.audio.setMods({ rate: 0.82 });
      YN.audio.sfx('priestess_chant', { vol: 0.25 });
    },
    arrive: function (rt) {
      var a = P.a, d = a.door;
      var pos = d ? YN.world.besideMark(rt, d) : YN.world.nearestOpen(rt, YN.game.player.x + 10, YN.game.player.y);
      a.x = pos[0]; a.y = pos[1]; a.fx = a.x; a.fy = a.y;
      a.state = 'present';
      YN.audio.setMods({ silence: 0.5 });
      setTimeout(function () { YN.audio.setMods({ silence: 0 }); }, 2500);
      YN.audio.sfx('priestess_bell', { vol: 0.5 });
      YN.save.addCorruption(rt.id, 1);
      if (YN.corruption) YN.corruption.apply(rt);
      if (YN.ui) YN.ui.hud.refresh();
    },
    leave: function (scar) {
      var rt = YN.game.rt, a = P.a; if (!a) return;
      if (scar && a.world && !YN.net.SAFE[a.world]) YN.save.addCorruption(a.world, 1);
      P.cleanup(rt);
      P.a = null;
      if (YN.ui) YN.ui.hud.refresh();
    },
    cleanup: function (rt) {
      YN.audio.setMods({ rate: 1, silence: 0 });
      if (!rt) return;
      rt.priestessSigns = false; rt.controlsMirror = false;
      rt.ents.forEach(function (e) { e.frozenByP = false; });
      rt.marks = rt.marks.filter(function (m) { return !(m.def.id === 'pr_wrongdoor' || m.def.id === 'pr_falsedoor'); });
      rt.marks.forEach(function (m) { if (m.prClosed) { m.prClosed = false; if (m.origDef) m.def = m.origDef; } });
    },
    los: function (rt, x0, y0, x1, y1) { return YN.witches.los(rt, x0, y0, x1, y1); },
    update: function (dt) {
      var G = YN.game, rt = G.rt; if (!rt || !YN.save.dream) return;
      if (!P.a) {
        if (!P.eligible() || YN.net.SAFE[rt.id]) return;
        P.checkT -= dt;
        if (P.checkT > 0) return;
        P.checkT = 45;
        var ph = G.phaseNow(), chance = 0.04 + rt.depth * 0.04 + (ph === 'late' ? 0.06 : ph === 'final' ? 0.12 : 0);
        var visits = YN.save.visits(rt.id); if (visits > 12) chance += 0.05; // elle vient là où tu aimes aller
        if (YN.save.corruption(rt.id) >= 2) chance += 0.08;
        if (Math.random() < chance) P.start(rt, 15 + Math.random() * 12);
        return;
      }
      var a = P.a;
      if (a.world !== rt.id) return;
      if (a.state === 'omens') {
        a.omenT -= dt;
        if (a.omenT < 4) YN.audio.setMods({ silence: 0.7 });
        if (a.omenT <= 0) P.arrive(rt);
        return;
      }
      if (a.state === 'following') { a.arriveIn -= dt; if (a.arriveIn <= 0) { var pos = YN.world.nearestOpen(rt, G.player.x + 3, G.player.y); a.x = pos[0]; a.y = pos[1]; a.fx = a.x; a.fy = a.y; a.state = 'chase'; YN.audio.sfx('priestess_bell', { vol: 0.4 }); YN.save.addCorruption(rt.id, 1); } return; }
      if (G.frozenUntil > G.clock) return;
      if (a.stun > 0) { a.stun -= dt; return; }
      a.lifeT -= dt;
      if (a.lifeT <= 0) { P.leave(true); return; }
      var p = G.player;
      // pouvoirs réguliers
      a.powerT -= dt;
      if (a.powerT <= 0) { a.powerT = 10; P.power(rt); }
      if (rt.mirrorUntil && G.clock > rt.mirrorUntil) { rt.controlsMirror = false; rt.mirrorUntil = 0; }
      // perception : 12 cases, ignore l'obscurité
      var hidden = p.hiding && !(a.hideSeen);
      var sees = !hidden && !p.statue && U.dist(a.x, a.y, p.x, p.y) < 12 && P.los(rt, a.x, a.y, p.x, p.y);
      if (p.hiding && U.dist(a.x, a.y, p.x, p.y) <= 4 && a.lastSaw) a.hideSeen = true;
      if (!p.hiding) a.hideSeen = false;
      a.lastSaw = sees;
      if (sees) {
        if (!a.locked) {
          a.bellT -= dt;
          if (a.bellT <= 0) {
            a.bells++; a.bellT = 1;
            YN.audio.sfx('priestess_bell', { vol: 0.35 + a.bells * 0.15 });
            if (YN.ui) YN.ui.hud.priestessBells(a.bells);
            if (a.bells >= 3) { a.locked = true; a.state = 'chase'; if (YN.ui) YN.ui.hud.priestessLock(true); }
          }
        }
        a.lastKnown = [p.x, p.y];
        if (a.state === 'present') a.state = 'locking';
      } else if (!a.locked && a.bells > 0) {
        a.bells = 0; a.bellT = 0; if (YN.ui) YN.ui.hud.priestessBells(0);
      }
      // déplacement
      if (a.moving) {
        a.mt += dt * (a.locked ? 5.4 : 4.4);
        var k = Math.min(1, a.mt);
        a.fx = U.lerp(a.from[0], a.to[0], k); a.fy = U.lerp(a.from[1], a.to[1], k);
        if (k >= 1) { a.moving = false; a.fx = a.x; a.fy = a.y; }
      }
      if (U.dist(a.fx, a.fy, p.fx, p.fy) < 0.75 && !G.invulnerable()) {
        var by = { id: 'priestess', repel: function () { a.stun = 2; } };
        G.attack(by, { ignoreCookie: a.locked });
        return;
      }
      if (a.moving) return;
      var target = sees ? [p.x, p.y] : (a.lastKnown || null);
      var dir = null;
      if (target) dir = YN.witches.stepToward({ x: a.x, y: a.y, id: 'priestess' }, rt, target[0], target[1]);
      if (!dir && !target) { var ds = U.shuffle(['up', 'down', 'left', 'right']); for (var i = 0; i < 4; i++) { var v = DIRS[ds[i]]; if (rt.passable(a.x + v[0], a.y + v[1], 'witch', {})) { dir = ds[i]; break; } } }
      if (target && a.x === target[0] && a.y === target[1] && !sees) a.lastKnown = null;
      if (dir) { var dv = DIRS[dir], n = rt.norm(a.x + dv[0], a.y + dv[1]); a.from = [a.x, a.y]; a.x = n[0]; a.y = n[1]; a.to = rt.wrap ? [a.from[0] + dv[0], a.from[1] + dv[1]] : n; a.moving = true; a.mt = 0; }
    },
    /* pouvoirs : règles fixes, observables */
    power: function (rt) {
      var G = YN.game, a = P.a, r = Math.random();
      var doors = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.active && !m.essential && m.def.id !== 'pr_wrongdoor' && !m.prClosed; });
      if (r < 0.22 && doors.length) { // ferme un passage non essentiel
        var d = doors[Math.floor(Math.random() * doors.length)];
        d.prClosed = true; d.origDef = d.def; d.def = Object.assign({}, d.def, { lock: { text: '██████', unless: { fn: function () { return false; } } } });
        YN.render.addFx({ type: 'reveal', x: d.x, y: d.y, life: 1.5, color: '#9a40ff' });
      } else if (r < 0.42) { // fausse porte : ramène au même monde
        var spot = YN.world.nearestOpen(rt, G.player.x + (Math.random() < 0.5 ? 3 : -3), G.player.y + 2);
        var fd = YN.world.addMark(rt, { type: 'door', id: 'pr_falsedoor', look: 'door', lookOpt: { style: 'wood' }, to: rt.id }, spot[0], spot[1], null);
        void fd;
      } else if (r < 0.62) { if (YN.witches) YN.witches.alertAll(rt.id); YN.audio.sfx('priestess_chant', { vol: 0.2 }); }
      else if (r < 0.82) { G.effectSuppressed = 15; if (YN.ui) YN.ui.hud.refresh(); }
      else { rt.controlsMirror = true; rt.mirrorUntil = G.clock + 10; }
      void a;
    },
    /* la Berceuse (mélodie précise) l'immobilise une fois par rencontre */
    lullaby: function () {
      var a = P.a; if (!a || a.lullabyUsed || !P.isIn(YN.game.rt.id)) return false;
      a.lullabyUsed = true; a.stun = 3; a.bells = 0; a.locked = false; a.state = 'present';
      if (YN.ui) { YN.ui.hud.priestessBells(0); YN.ui.hud.priestessLock(false); }
      return true;
    },
    drawList: function (wid) {
      var a = P.a; if (!a || a.world !== wid || !(a.state === 'present' || a.state === 'locking' || a.state === 'chase')) return [];
      return [{ x: a.fx, y: a.fy, img: YN.spr.witch('priestess', Math.floor(YN.game.clock * 3), a.locked ? 'hunt' : ''), alpha: 0.95 }];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
