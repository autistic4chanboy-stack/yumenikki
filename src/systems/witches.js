/* =========================================================================
 *  Les cinq sorcières. Elles existent dans le réseau pendant tout le rêve,
 *  passent de monde en monde par de vraies portes (jamais d'apparition à
 *  l'écran), et chacune chasse à sa manière (voir docs/bible.md §9).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var PHASE_ACT = { opening: 0.35, middle: 1, late: 1.6, final: 2.2 };

  var DEFAULTS = [
    { id: 'silent', name: 'The Silent One', unlock: 2, speed: 2.5, chase: 3.7, sight: 6, home: 'W005', sfx: 'witch_silent', affinity: ['mono', 'quiet', 'dark'] },
    { id: 'bell', name: 'The Doorbell', unlock: 5, speed: 2.8, chase: 4.1, sight: 3, home: 'W011', sfx: 'witch_bell', affinity: ['noisy', 'city', 'phones'] },
    { id: 'copy', name: 'The Copycat', unlock: 8, speed: 2.2, chase: 5.6, sight: 5, home: 'W004', sfx: 'witch_copy', affinity: ['crowd', 'school'] },
    { id: 'seam', name: 'The Seamstress', unlock: 12, speed: 2.7, chase: 3.9, sight: 5, home: 'W009', sfx: 'witch_seam', affinity: ['house', 'interior'] },
    { id: 'voyager', name: 'The Traveller', unlock: 16, speed: 3.0, chase: 4.3, sight: 5, home: 'W002', sfx: 'witch_voyager', affinity: ['transport', 'hub'] }
  ];

  var W = YN.witches = {
    agents: [], ambT: 0,
    defs: function () { return YN.data.witches || DEFAULTS; },
    reset: function () { W.agents = []; },
    active: function (d) {
      var p = YN.save.perm; if (!p) return false;
      if (YN.save.flag('witches_off')) return false;
      return p.effects.length + p.eggs.length >= d.unlock || !!(YN.debug && YN.debug.forceWitch === d.id);
    },
    beginDream: function () {
      W.agents = [];
      var playerWorld = 'DREAMROOM';
      W.defs().forEach(function (d) {
        var a = { id: d.id, def: d, world: null, x: 0, y: 0, fx: 0, fy: 0, state: 'dormant', moveT: 0, nextT: 30 + Math.random() * 60,
          hunting: false, lastKnown: null, lastSeenT: -99, path: null, pathT: 0, stun: 0, mood: 'calm', staged: false, speakT: 0, enteredAt: 0, leaveT: 0, door: null, mt: 0, from: null, to: null, moving: false };
        a.repel = function () { W.repel(a); };
        // placée à quelques portes de la joueuse, ou chez elle
        a.world = YN.data.worlds[d.home] ? d.home : W.randomWorld(playerWorld, 4);
        W.agents.push(a);
      });
      void playerWorld;
    },
    randomWorld: function (from, hops) {
      var cur = 'NEXUS';
      for (var i = 0; i < hops; i++) { var nb = YN.net.adjacent(cur, { noSafe: true }); if (!nb.length) break; cur = nb[Math.floor(Math.random() * nb.length)]; }
      return YN.net.SAFE[cur] ? 'W001' : cur;
    },
    agent: function (id) { for (var i = 0; i < W.agents.length; i++) if (W.agents[i].id === id) return W.agents[i]; return null; },
    anyIn: function (wid) { return W.agents.some(function (a) { return a.world === wid && a.state !== 'dormant' && W.active(a.def); }); },
    inWorld: function (wid) { return W.agents.filter(function (a) { return a.world === wid && a.state !== 'dormant' && a.state !== 'network' && W.active(a.def); }); },
    nearestDist: function (wid, x, y) { var best = 99; W.inWorld(wid).forEach(function (a) { var d = U.dist(a.x, a.y, x, y); if (d < best) best = d; }); return best; },

    /* ---------- événements venant du jeu ---------- */
    playerEntered: function (rt, fromId) {
      W.agents.forEach(function (a) {
        if (a.world === rt.id && W.active(a.def)) W.arriveLocal(a, rt, null, true);
        else if (a.world !== rt.id) { a.state = 'network'; a.moving = false; }
        // la Voyageuse se souvient de la porte prise
        if (a.id === 'voyager' && fromId) a.lastRoute = fromId + '>' + rt.id;
      });
      void fromId;
    },
    worldRebuilt: function (rt) { W.inWorld(rt.id).forEach(function (a) { if (!rt.passable(a.x, a.y, 'witch', {})) { var q = YN.world.nearestOpen(rt, a.x, a.y); a.x = q[0]; a.y = q[1]; a.fx = a.x; a.fy = a.y; } }); },
    noteDoor: function (wid, mark, to) {
      W.agents.forEach(function (a) {
        if (a.world !== wid || !W.active(a.def)) return;
        // elles voient la porte qu'on prend : elles suivent
        var seen = a.state === 'chase' || (a.id === 'seam') || (U.dist(a.x, a.y, mark.x, mark.y) < a.def.sight && W.los(YN.game.rt, a.x, a.y, mark.x, mark.y));
        if (seen) { a.followTo = to; a.followAt = YN.game.clock + (a.id === 'seam' ? 6 : 3.5); }
      });
    },
    hear: function (wid, x, y, amount, kind) {
      W.agents.forEach(function (a) {
        if (!W.active(a.def)) return;
        if (a.world === wid && a.state !== 'network') {
          var d = U.dist(a.x, a.y, x, y);
          var range = a.id === 'bell' ? amount * 3.2 : amount * 0.9;
          if (YN.game.holdBreath > YN.game.clock) range *= 0.2;
          if (d < range) { a.lastKnown = [x, y]; a.lastSeenT = YN.game.clock; if (a.id === 'bell' && a.state !== 'chase') a.state = 'hunt'; }
        } else if (a.id === 'bell' && amount >= 6 && a.world && YN.net.distance(a.world, wid, { noSafe: true }) <= 1) {
          a.hunting = true; a.nextT = Math.min(a.nextT, 4);
        }
      });
    },
    lightChanged: function (wid, x, y) {
      var a = W.agent('silent'); if (!a || !W.active(a.def)) return;
      if (a.world === wid) { a.lastKnown = [x, y]; a.state = 'hunt'; a.lastSeenT = YN.game.clock; }
      else { a.hunting = true; a.nextT = Math.min(a.nextT, 6); }
    },
    alertAll: function (wid) { W.agents.forEach(function (a) { if (W.active(a.def)) { a.hunting = true; a.nextT = Math.min(a.nextT, 3 + Math.random() * 5); } }); void wid; },
    summon: function (id) {
      var G = YN.game; if (!G.rt) return;
      var a = W.agent(id) || W.agents[0];
      if (!a) { W.beginDream(); a = W.agent(id); }
      if (!a) return;
      a.world = G.rt.id; a.staged = true; YN.save.markWitchMet(a.id);
      if (YN.debug) YN.debug.forceWitch = a.id;
      W.arriveLocal(a, G.rt, null, false);
    },

    /* ---------- arrivée dans le monde de la joueuse ---------- */
    arriveLocal: function (a, rt, fromWorld, silent) {
      var door = null;
      rt.marks.forEach(function (m) { if (!door && YN.DOOR_TYPES[m.type] && m.active && fromWorld && m.def.to === fromWorld) door = m; });
      if (!door) { var doors = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.active; }); door = doors.length ? doors[Math.floor(Math.random() * doors.length)] : null; }
      var pos;
      if (door) pos = YN.world.besideMark(rt, door);
      else if (rt.inf) { var p = YN.game.player; pos = [p.x + (Math.random() < 0.5 ? -14 : 14), p.y + (Math.random() < 0.5 ? -10 : 10)]; pos = YN.world.nearestOpen(rt, pos[0], pos[1]); }
      else { pos = YN.world.nearestOpen(rt, Math.floor(Math.random() * rt.w), Math.floor(Math.random() * rt.h)); }
      // jamais à côté de la joueuse
      var pl = YN.game.player;
      if (U.dist(pos[0], pos[1], pl.x, pl.y) < 6) { var far = YN.world.nearestOpen(rt, U.clamp(pl.x + (pl.x < rt.w / 2 ? 14 : -14), 1, rt.w - 2), pl.y); pos = far; }
      a.x = pos[0]; a.y = pos[1]; a.fx = a.x; a.fy = a.y; a.moving = false;
      a.state = 'wander'; a.enteredAt = YN.game.clock; a.leaveT = 25 + Math.random() * 30; a.door = door; a.lastKnown = null;
      a.mood = 'calm';
      if (!silent && door) YN.audio.sfx('door', { vol: 0.5, pan: U.clamp((a.x - pl.x) / 8, -1, 1) });
      YN.audio.sfx(a.def.sfx, { vol: 0.6 });
      if (!YN.save.perm.witchesMet[a.id]) { a.staged = true; a.stageT = 7; }
      if (a.id === 'copy') W.disguise(a, rt);
      if (a.id === 'seam') W.stitch(a, rt);
      YN.bus.emit('witchEnter', a, rt);
    },
    leaveLocal: function (a) {
      var rt = YN.game.rt;
      var nb = YN.net.adjacent(a.world, { noSafe: true });
      if (a.id === 'copy') W.undisguise(a, rt);
      if (a.id === 'seam') W.unstitch(rt);
      a.world = nb.length ? nb[Math.floor(Math.random() * nb.length)] : a.world;
      a.state = 'network'; a.nextT = 20 + Math.random() * 30;
      if (rt) YN.audio.sfx('door', { vol: 0.3 });
    },
    repel: function (a) { a.stun = 3; a.mood = 'calm'; a.state = 'stunned'; setTimeout(function () { if (a.world === (YN.game.rt && YN.game.rt.id)) W.leaveLocal(a); }, 3000); },

    /* ---------- boucle ---------- */
    update: function (dt) {
      var G = YN.game, rt = G.rt; if (!rt || !YN.save.dream) return;
      var phase = G.phaseNow() || 'middle', act = PHASE_ACT[phase] * (rt.depth >= 3 ? 1.4 : 1);
      var elapsed = YN.save.dream.duration - YN.save.dream.remaining;
      W.agents.forEach(function (a) {
        if (!W.active(a.def)) { a.state = 'dormant'; return; }
        if (a.state === 'dormant') a.state = 'network';
        if (elapsed < 25 && !a.staged) return; // un peu de répit au début
        if (a.world === rt.id && !YN.net.SAFE[rt.id] && a.state !== 'network') W.local(a, rt, dt, act);
        else W.network(a, rt, dt, act);
      });
      // ambiance : pas sans origine, annonces, silence
      var here = W.inWorld(rt.id);
      var silent = here.some(function (a) { return a.id === 'silent'; });
      var sil = silent ? Math.min(0.85, (G.clock - (W.agent('silent').enteredAt || G.clock)) / 30) : 0;
      if (YN.audio.mods.silence !== sil) YN.audio.setMods({ silence: sil });
      W.ambT -= dt;
      if (W.ambT <= 0 && here.length) {
        W.ambT = 3 + Math.random() * 4;
        here.forEach(function (a) {
          var pan = U.clamp((a.x - G.player.x) / 10, -1, 1), vol = U.clamp(1 - U.dist(a.x, a.y, G.player.x, G.player.y) / 20, 0.08, 0.6);
          if (a.id === 'bell') YN.audio.sfx(Math.random() < 0.5 ? 'witch_bell' : 'mother_steps', { pan: pan, vol: vol * 0.6 });
          else if (a.id !== 'silent' && Math.random() < 0.5) YN.audio.sfx(a.def.sfx, { pan: pan, vol: vol * 0.5 });
        });
      }
      rt.corrLocal = here.length ? Math.min(2, (rt.corrLocal || 0) + dt / 30) : Math.max(0, (rt.corrLocal || 0) - dt / 4);
      rt.witchKinds = here.map(function (a) { return a.id; });
    },
    network: function (a, rt, dt, act) {
      a.state = 'network';
      // suit la joueuse par la porte qu'elle a prise
      if (a.followTo && YN.game.clock >= a.followAt) {
        if (a.followTo === rt.id) { var from = a.world; a.world = rt.id; a.followTo = null; W.arriveLocal(a, rt, from, false); return; }
        a.followTo = null;
      }
      a.nextT -= dt * act;
      if (a.nextT > 0) return;
      a.nextT = (18 + Math.random() * 28);
      var target = null;
      var huntChance = { opening: 0.12, middle: 0.3, late: 0.55, final: 0.75 }[YN.game.phaseNow() || 'middle'];
      if (rt.depth >= 3) huntChance += 0.15;
      if (a.hunting || Math.random() < huntChance) {
        var path = YN.net.path(a.world, rt.id, { noSafe: true });
        if (path && path.length > 1) target = path[1];
        a.hunting = path && path.length > 2;
      }
      if (a.id === 'voyager' && !target) { // devance : va là où la joueuse a l'habitude d'aller
        var best = null, bestN = 0, routes = YN.save.perm.route;
        U.keys(routes).forEach(function (k) { var p = k.split('>'); if (p[0] === rt.id && routes[k] > bestN && !YN.net.SAFE[p[1]]) { bestN = routes[k]; best = p[1]; } });
        if (best && best !== a.world) { var vp = YN.net.path(a.world, best, { noSafe: true }); if (vp && vp.length > 1) target = vp[1]; }
      }
      if (!target) {
        var nb = YN.net.adjacent(a.world, { noSafe: true });
        if (nb.length) target = nb[Math.floor(Math.random() * nb.length)];
      }
      if (!target || YN.net.SAFE[target]) return;
      var prev = a.world; a.world = target;
      if (target === rt.id) W.arriveLocal(a, rt, prev, false);
    },
    los: function (rt, x0, y0, x1, y1) {
      var dx = x1 - x0, dy = y1 - y0, n = Math.max(Math.abs(dx), Math.abs(dy));
      for (var i = 1; i < n; i++) {
        var x = Math.round(x0 + dx * i / n), y = Math.round(y0 + dy * i / n), inf = YN.tileInfo(rt.tile(x, y));
        if (inf.wall || inf.tall || inf.void) return false;
      }
      return true;
    },
    canSee: function (a, rt) {
      var G = YN.game, p = G.player;
      if (p.hiding && !(a.sawHide)) return false;
      if (p.statue) return false;
      var eq = G.equipped(), stealth = YN.effects.stealth(eq);
      var dark = G.darknessLevel() > 0.5;
      var sight = a.def.sight * (dark && a.id !== 'voyager' ? 0.55 : 1) * (1 - stealth) * (YN.save.dream && YN.save.dream.white ? 0.7 : 1);
      if (a.id === 'silent') { if (!p.moving && !(YN.effects.light(eq) > 0 && p.lampOn)) return false; sight = dark ? 3 : 6; if (YN.effects.light(eq) > 0 && p.lampOn) sight += 3; }
      if (G.decoy && G.decoy.world === rt.id && G.decoy.until > G.clock) { a.lastKnown = [G.decoy.x, G.decoy.y]; return false; }
      var d = U.dist(a.x, a.y, p.x, p.y);
      if (d > sight) return false;
      return W.los(rt, a.x, a.y, p.x, p.y);
    },
    local: function (a, rt, dt, act) {
      var G = YN.game, p = G.player;
      if (G.frozenUntil > G.clock) return;
      if (a.stun > 0) { a.stun -= dt; return; }
      // mise en scène de la première rencontre : elle regarde, puis s'en va
      if (a.staged && a.stageT !== undefined) {
        a.stageT -= dt; a.mood = 'calm';
        if (a.stageT <= 0) { a.staged = false; a.stageT = undefined; YN.save.markWitchMet(a.id); W.leaveLocal(a); }
        return;
      }
      if (a.id === 'copy' && a.disguised) { W.copyWatch(a, rt, dt); return; }
      // déplacement interpolé
      if (a.moving) {
        var spd = (a.state === 'chase' ? a.def.chase : a.def.speed) * (act > 1.5 ? 1.12 : 1) * (G.rt.def.witchSpeed || 1);
        a.mt += dt * spd;
        var k = Math.min(1, a.mt);
        a.fx = U.lerp(a.from[0], a.to[0], k); a.fy = U.lerp(a.from[1], a.to[1], k);
        if (k >= 1) { a.moving = false; a.fx = a.x; a.fy = a.y; }
      }
      // contact
      var dist = U.dist(a.fx, a.fy, p.fx, p.fy);
      if (dist < 0.7 && a.state === 'chase' && !G.invulnerable()) { G.attack(a); return; }
      if (a.moving) return;
      var sees = W.canSee(a, rt);
      if (sees) {
        if (a.state !== 'chase') { a.state = 'chase'; YN.audio.sfx('witch_seen', { vol: 0.7 }); W.speak(a); }
        a.lastKnown = [p.x, p.y]; a.lastSeenT = G.clock; a.mood = 'hunt';
      } else if (a.state === 'chase' && G.clock - a.lastSeenT > (a.id === 'silent' ? 2 : 5)) { a.state = a.lastKnown ? 'hunt' : 'wander'; a.mood = 'calm'; }
      if (a.state === 'chase') { a.speakT -= dt; if (a.speakT <= 0) W.speak(a); }
      // choix du pas
      var target = null;
      if (a.state === 'chase') target = [p.x, p.y];
      else if (a.state === 'hunt' && a.lastKnown) { target = a.lastKnown; if (a.x === target[0] && a.y === target[1]) { a.lastKnown = null; a.state = 'wander'; } }
      else if (a.id === 'voyager' && a.door) { target = YN.world.besideMark(rt, a.door); }
      a.leaveT -= dt;
      if (a.state === 'wander' && a.leaveT <= 0) { W.leaveLocal(a); return; }
      var dir = null;
      if (target) {
        a.pathT -= dt;
        dir = W.stepToward(a, rt, target[0], target[1]);
      } else if (Math.random() < 0.5) {
        var ds = U.shuffle(['up', 'down', 'left', 'right']);
        for (var i = 0; i < 4; i++) { var v = DIRS[ds[i]]; if (rt.passable(a.x + v[0], a.y + v[1], 'witch', {})) { dir = ds[i]; break; } }
      }
      if (dir) { var dv = DIRS[dir], n = rt.norm(a.x + dv[0], a.y + dv[1]); a.from = [a.x, a.y]; a.x = n[0]; a.y = n[1]; a.to = rt.wrap ? [a.from[0] + dv[0], a.from[1] + dv[1]] : n; a.moving = true; a.mt = 0; a.dir = dir; }
    },
    stepToward: function (a, rt, tx, ty) {
      var e = { x: a.x, y: a.y, def: { caps: { witchFloat: a.id === 'voyager' } } };
      // BFS sur la grille (entités ignorées, portes traversables)
      var key = function (x, y) { return x + ',' + y; }, start = key(a.x, a.y), goal = key(tx, ty), prev = {}, q = [[a.x, a.y]], n = 0;
      prev[start] = null;
      while (q.length && n++ < 1600) {
        var c = q.shift(); if (key(c[0], c[1]) === goal) break;
        for (var d in DIRS) {
          var v = DIRS[d], nn = rt.norm(c[0] + v[0], c[1] + v[1]), nk = key(nn[0], nn[1]);
          if (nk in prev) continue;
          if (nk !== goal && !rt.passable(nn[0], nn[1], 'witch', e.def.caps)) continue;
          prev[nk] = key(c[0], c[1]); q.push(nn);
        }
      }
      if (!(goal in prev) || goal === start) return null;
      var k = goal;
      while (prev[k] !== start && prev[k] !== null && prev[k] !== undefined) k = prev[k];
      if (prev[k] !== start) return null;
      var parts = k.split(','), sx = +parts[0], sy = +parts[1];
      var dx = sx - a.x, dy = sy - a.y;
      if (rt.wrap) { dx = U.mod(dx + rt.w / 2, rt.w) - rt.w / 2; dy = U.mod(dy + rt.h / 2, rt.h) - rt.h / 2; }
      if (dx === 1) return 'right'; if (dx === -1) return 'left'; if (dy === 1) return 'down'; if (dy === -1) return 'up';
      return null;
    },
    speak: function (a) {
      a.speakT = 4 + Math.random() * 3;
      var line = YN.lang.witchLine(a.id);
      W.bubbles = W.bubbles || [];
      W.bubbles = W.bubbles.filter(function (b) { return b.a !== a; });
      W.bubbles.push({ a: a, text: line, until: YN.game.clock + 2.8 });
      if (YN.ui) YN.ui.bubbles.refresh();
    },

    /* ---------- la Copieuse ---------- */
    disguise: function (a, rt) {
      var candidates = rt.ents.filter(function (e) { return e.present && e.visible && !e.def.major && !e.disguise && e.def.kind !== 'voice'; });
      if (!candidates.length) { a.disguised = false; a.ghostTrail = true; return; }
      var src = candidates[Math.floor(Math.random() * candidates.length)];
      var pos = YN.world.nearestOpen(rt, src.x + 1, src.y);
      var fake = YN.entities.add(rt, { id: 'COPY_' + src.def.id, name: src.def.name, look: src.def.look || src.state.look, behavior: 'static', lines: ['…'] }, pos[0], pos[1]);
      fake.disguise = src.def.look; fake.present = true; fake.visible = true; fake.isCopy = true;
      a.disguised = true; a.fake = fake; a.x = pos[0]; a.y = pos[1]; a.fx = a.x; a.fy = a.y;
      a.nearT = 0;
    },
    undisguise: function (a, rt) {
      if (a.fake && rt) { var i = rt.ents.indexOf(a.fake); if (i >= 0) rt.ents.splice(i, 1); }
      a.fake = null; a.disguised = false;
    },
    copyWatch: function (a, rt, dt) {
      var G = YN.game, p = G.player, f = a.fake;
      if (!f || rt.ents.indexOf(f) < 0) { a.disguised = false; return; }
      a.x = f.x; a.y = f.y; a.fx = f.fx; a.fy = f.fy;
      var d = U.dist(f.x, f.y, p.x, p.y);
      a.nearT = d < 1.6 ? a.nearT + dt : 0;
      if (a.nearT > 1.5) W.copyRevealed(f);
      a.leaveT -= dt;
      if (a.leaveT < -20) W.leaveLocal(a);
    },
    copyRevealed: function (fake) {
      var a = W.agent('copy'); if (!a) return;
      var rt = YN.game.rt;
      W.undisguise(a, rt);
      a.state = 'chase'; a.mood = 'hunt'; a.lastSeenT = YN.game.clock; a.lastKnown = [YN.game.player.x, YN.game.player.y];
      YN.audio.sfx('witch_seen'); YN.render.cam.shake = 0.5;
      W.speak(a);
      void fake;
    },
    revealCopy: function (wid) {
      var a = W.agent('copy');
      if (a && a.world === wid && a.disguised && a.fake) {
        a.fake.state.look = Object.assign({}, a.fake.disguise, { c: (a.fake.disguise && a.fake.disguise.c || []).map(function (c) { return typeof c === 'string' && c[0] === '#' ? YN.util.rgbToHex.apply(null, YN.util.hexToRgb(c).map(function (v) { return 255 - v; })) : c; }) });
        a.fake.disguise = a.fake.state.look;
        a.revealedByMirror = true;
        return true;
      }
      return false;
    },

    /* ---------- la Couturière ---------- */
    stitch: function (a, rt) {
      var doors = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.active && m.solid && m.def.to; });
      rt.relink = rt.relink || {};
      if (doors.length >= 2) {
        var d1 = doors[Math.floor(Math.random() * doors.length)];
        var others = YN.net.adjacent(rt.id, { noSafe: true }).filter(function (w) { return w !== d1.def.to; });
        if (others.length) { rt.relink[d1.id] = others[Math.floor(Math.random() * others.length)]; d1.stitchedTo = rt.relink[d1.id]; }
        var shortcut = doors.filter(function (m) { return !m.essential && m !== d1; })[0];
        if (shortcut) { shortcut.stitched = true; shortcut.origDef = shortcut.def; shortcut.def = Object.assign({}, shortcut.def, { lock: { text: 'Stitches hold the door shut.', unless: { equipped: ['E10', 'E86'] } } }); }
      }
      rt.tears = true;
    },
    unstitch: function (rt) {
      if (!rt) return;
      rt.relink = {}; rt.tears = false;
      rt.marks.forEach(function (m) { if (m.stitched) { m.stitched = false; if (m.origDef) m.def = m.origDef; m.origDef = null; } m.stitchedTo = null; });
    },

    /* ---------- affichage ---------- */
    drawList: function (wid) {
      var out = [];
      W.inWorld(wid).forEach(function (a) {
        if (a.id === 'copy' && a.disguised) return;
        if (a.state === 'network') return;
        var alpha = 1;
        if (a.id === 'silent') alpha = YN.game.player.moving ? 1 : 0.75;
        if (a.staged) alpha = 0.85;
        out.push({ x: a.fx, y: a.fy, img: YN.spr.witch(a.id, Math.floor(YN.game.clock * 3), a.mood), alpha: alpha, a: a });
      });
      return out;
    },
    serialize: function () { return W.agents.map(function (a) { return { id: a.id, world: a.world, x: a.x, y: a.y, state: a.state === 'chase' ? 'hunt' : a.state }; }); },
    restore: function (list) {
      if (!W.agents.length) W.beginDream();
      (list || []).forEach(function (s) { var a = W.agent(s.id); if (a) { a.world = s.world; a.x = s.x; a.y = s.y; a.fx = s.x; a.fy = s.y; a.state = s.state === 'network' || s.state === 'dormant' ? 'network' : 'wander'; } });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
