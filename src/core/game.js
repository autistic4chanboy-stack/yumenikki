/* =========================================================================
 *  Cœur du jeu : états, rêve et compte à rebours, déplacements,
 *  interactions, portes, réveil, capture, biscuits, mère, pincement.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], upleft: [-0.7071, -0.7071], upright: [0.7071, -0.7071], downleft: [-0.7071, 0.7071], downright: [0.7071, 0.7071] };
  var DIR8 = ['right', 'downright', 'down', 'downleft', 'left', 'upleft', 'up', 'upright'];
  function dirFromVec(vx, vy) { var a = Math.atan2(vy, vx); var i = Math.round(a / (Math.PI / 4)); return DIR8[U.mod(i, 8)]; }
  function dir4(d) { return { upleft: 'up', upright: 'up', downleft: 'down', downright: 'down' }[d] || d; }
  var RAD = 0.26;
  var STEP_SFX = { grass: 'step_grass', floor3: 'step_grass', leafg: 'step_grass', flowers: 'step_grass', quiet: 'step_carpet', leafb: 'step_leaves', wood: 'step_wood', bridge: 'step_wood', plank: 'step_wood', platform: 'step_wood',
    shallow: 'step_water', water: 'step_water', lily: 'step_water', snow: 'step_snow', ice: 'step_snow', metal: 'step_metal', rail: 'step_metal', conveyor: 'step_metal', tile: 'step_tile', carpet: 'step_carpet', mat: 'step_carpet', mat2: 'step_carpet', stairs: 'step_wood', soil: 'step_grass', dirt: 'step_grass', vine: 'step_grass' };

  function newPlayer() {
    return { x: 0, y: 0, fx: 0, fy: 0, px: 0.5, py: 0.62, vx: 0, vy: 0, phase: 0, stepDist: 0, hopT: 0, dir: 'down', moving: false, mt: 0, from: null, to: null, frame: 0, animT: 0,
      z: 0, hiding: false, floating: false, small: false, lampOn: true, alpha: 1, invisible: false,
      side: { px: 0, py: 0, vx: 0, vy: 0, ground: false, safe: [0, 0] }, fps: { x: 0.5, y: 0.5, a: 0 },
      slide: null, stepN: 0 };
  }

  var G = YN.game = {
    state: 'boot', rt: null, player: newPlayer(), clock: 0, fx: [], paused: false, trans: null,
    revealUntil: 0, mirrorUntil: 0, frozenUntil: 0, invulnUntil: 0, effectSuppressed: 0, effectInverted: false,
    pinch: 0, lastStep: null, history: [], snapT: 0, reevalT: 0, emitT: 0, phase: null, repeatLog: [],
    noiseEvents: [], camOverride: null, decoy: null, lastWorldEnter: 0,

    /* ---------- utilitaires ---------- */
    equipped: function () { var p = YN.save.perm; return p && G.inDream() ? p.equipped : null; }, // les effets n'existent que dans les rêves
    caps: function () { return YN.effects.caps(G.equipped()); },
    inDream: function () { return !!YN.save.dream; },
    invulnerable: function () { return G.clock < G.invulnUntil; },
    toast: function (msg, sec) { if (YN.ui) YN.ui.toast(msg, sec); },
    facing: function () {
      var p = G.player;
      if (G.rt && G.rt.view === 'fps') return YN.raycast.facing(G.rt, p.fps);
      if (G.rt && G.rt.view === 'side') { var sx = Math.floor((p.side.px + 8) / 16) + (p.dir === 'left' ? -1 : p.dir === 'right' ? 1 : 0), sy = Math.floor((p.side.py + 12) / 16) + (p.dir === 'up' ? -1 : 0); return [sx, sy]; }
      var d = DIRS[p.dir] || DIRS.down;
      var fx = Math.floor(p.px + d[0] * 0.8), fy = Math.floor(p.py - 0.12 + d[1] * 0.8);
      if (fx === p.x && fy === p.y) { var d4 = DIRS[dir4(p.dir)]; fx = p.x + d4[0]; fy = p.y + d4[1]; }
      return G.rt ? G.rt.norm(fx, fy) : [fx, fy];
    },
    /* cases candidates devant soi (la plus proche d'abord) : sert aux interactions en mouvement libre */
    facingCandidates: function () {
      var p = G.player, d = DIRS[p.dir] || DIRS.down, out = [], seen = {};
      [[0.55, 0], [0.9, 0], [0.75, 0.3], [0.75, -0.3], [1.25, 0]].forEach(function (o) {
        var a = Math.atan2(d[1], d[0]) + o[1];
        var tx = Math.floor(p.px + Math.cos(a) * o[0]), ty = Math.floor(p.py - 0.12 + Math.sin(a) * o[0]);
        var n = G.rt ? G.rt.norm(tx, ty) : [tx, ty], k = n[0] + ',' + n[1];
        if (!seen[k] && !(n[0] === p.x && n[1] === p.y)) { seen[k] = 1; out.push(n); }
      });
      return out;
    },
    dir4: function () { return dir4(G.player.dir); },
    isLookingAt: function (x, y) {
      var p = G.player, dx = x + 0.5 - p.px, dy = y + 0.5 - p.py;
      if (G.rt && G.rt.wrap) { dx = U.mod(dx + G.rt.w / 2, G.rt.w) - G.rt.w / 2; dy = U.mod(dy + G.rt.h / 2, G.rt.h) - G.rt.h / 2; }
      var d = DIRS[p.dir] || DIRS.down;
      var dot = dx * d[0] + dy * d[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
      return dot / len > 0.45;
    },
    remaining: function () { return YN.save.dream ? YN.save.dream.remaining : 0; },
    phaseNow: function () { var d = YN.save.dream; return d ? YN.cond.phaseOf(d.remaining, d.duration) : null; },

    /* ---------- démarrage ---------- */
    newGame: function () {
      YN.save.wipe(); YN.save.fresh();
      YN.save.perm.accepted = true; YN.save.perm.schemaSeen = true;
      YN.save.write();
      G.enterRoom('new');
    },
    continueGame: function () {
      if (!YN.save.perm && !YN.save.load()) { G.newGame(); return; }
      var snap = YN.save.readSnapshot();
      if (snap && snap.extra && YN.data.worlds[snap.extra.world]) {
        YN.save.dream = snap.dream;
        G.state = 'dream';
        G.enterWorld(snap.extra.world, snap.extra.pos, null, 'resume', function () {
          if (snap.extra.dir) G.player.dir = snap.extra.dir;
          if (YN.witches && snap.extra.witches) YN.witches.restore(snap.extra.witches);
          G.toast('The dream goes on.');
        });
        return;
      }
      G.enterRoom('continue');
    },
    enterRoom: function (reason) {
      G.state = 'room';
      YN.speech.clear();
      if (YN.witches) YN.witches.reset();
      if (YN.priestess) YN.priestess.reset();
      G.enterWorld('ROOM', reason === 'wake' || reason === 'capture' ? 'bed' : 'start', null, reason);
    },

    /* ---------- dormir ---------- */
    sleep: function () {
      var perm = YN.save.perm, room = YN.room ? YN.room.tonight : { pill: false, white: false };
      if (YN.save.dream) return;
      YN.save.beginDream({ pill: room.pill, white: room.white });
      var d = YN.save.dream;
      // la mère : une chance sur cinq, entre 5 et 10 minutes de rêve, si la lumière est allumée
      if (d.room.light && Math.random() < 0.2) { d.mother.roll = true; d.mother.at = 300 + Math.random() * 300; }
      if (YN.room) YN.room.resetTonight();
      G.state = 'dream';
      G.phase = 'opening';
      YN.audio.sfx('sleep');
      if (YN.witches) YN.witches.beginDream();
      if (YN.priestess) YN.priestess.beginDream();
      G.enterWorld('DREAMROOM', 'bed', null, 'sleep');
      void perm;
    },

    /* ---------- transitions entre mondes ---------- */
    enterWorld: function (id, arrive, fromId, how, after) {
      var def = YN.data.worlds[id];
      if (YN.save.dream && fromId && (how === 'door' || how === 'fall') && YN.data.worlds[fromId] && fromId !== id) { var cf = YN.save.dream.cameFrom = YN.save.dream.cameFrom || {}; cf[id] = fromId; }
      if (!def) { YN.warn('missing world: ' + id); G.toast('…'); return; }
      var doIt = function () {
        var prev = G.rt;
        if (prev) YN.world.mechCall(prev, 'onLeave', id);
        if (YN.data.worlds[id] && YN.data.worlds[id].vast && YN.save.dream) YN.save.temp('vast:' + id, 1 + Math.floor(Math.random() * 1e9)); // nouvelle carte à chaque visite
        var rt = YN.world.build(id);
        G.rt = rt; if (YN.render) { YN.render.viewReady = false; YN.render.warm = true; } // la vue se prépare (fondu au noir)
        G.fx = [];
        YN.speech.clear();
        var arr = YN.world.arrival(rt, arrive, fromId || (prev && prev.id));
        G.placePlayer(arr.pos[0], arr.pos[1]);
        if (arr.face) G.player.dir = arr.face;
        if (how === 'fall') G.player.dir = 'down';
        G.player.hiding = false; G.player.slide = null;
        if (G.player.floating && !(G.caps().float)) G.player.floating = false;
        YN.render.cam.init = false;
        if (G.inDream() && rt.depth > 0) {
          YN.save.visitWorld(id);
          if (rt.depth > YN.save.dream.depthMax) YN.save.dream.depthMax = rt.depth;
          if (rt.depth >= 3) YN.save.setFlag('deep_visited', true);
        }
        G.lastWorldEnter = G.clock;
        YN.audio.playMusic(rt.music === null ? null : rt.music, { fade: def.musicFade });
        if (rt.music === null) YN.audio.stopMusic(def.musicFade || 1.5);
        YN.audio.ambience(rt.amb ? rt.amb.type || rt.amb : (rt.felt.murmur && rt.depth > 0 ? 'tv' : null), rt.amb && rt.amb.vol ? rt.amb.vol : (rt.felt.murmur ? 0.035 : 0.08));
        YN.world.mechCall(rt, 'onEnter', fromId || (prev && prev.id), how);
        if (YN.witches && G.inDream()) YN.witches.playerEntered(rt, prev ? prev.id : null, how);
        if (YN.priestess && G.inDream()) YN.priestess.playerEntered(rt, prev ? prev.id : null);
        // éveillée, aucun effet : la protagoniste retrouve sa taille ; en rêve, celle de l'effet porté
        var eqd = G.equipped() && YN.effectById(G.equipped()); G.player.small = !!(eqd && eqd.caps && eqd.caps.indexOf('small') >= 0);
        if (YN.ui) { YN.ui.hud.refresh(); YN.ui.worldName(def); }
        if (G.inDream()) G.snapshot();
        if (after) after();
        YN.bus.emit('worldEnter', rt, how);
      };
      if (how === 'resume' || how === 'new' || how === 'continue' || !YN.ui) { doIt(); if (YN.ui) YN.ui.fade.whenReady(function () { YN.ui.fade.out(0.6); }); return; }
      var col = how === 'fall' ? '#000' : (how === 'capture' ? '#200' : '#000');
      G.trans = true;
      YN.ui.fade.inOut(how === 'sleep' || how === 'wake' ? 1.1 : (how === 'fall' ? 0.7 : 0.35), col, doIt, function () { G.trans = false; });
    },
    useDoor: function (m) {
      var d = m.def;
      if (d.cond && !YN.cond.check(d.cond, { mark: m })) { G.lockedDoor(m); return; }
      if (d.lock && !(m.unlockedByKnob && !d._lockFrom) && !YN.cond.check(d.lock.unless || d.lock.if || {}, { mark: m })) { G.lockedDoor(m); return; }
      if (d.use) YN.act.run(d.use, { mark: m });
      if (d.handler) { YN.world.mechCall(G.rt, 'onDoor', m); return; }
      if (YN.world.mechCall(G.rt, 'onDoor', m)) return;
      var to = d.to;
      if ((d.id === 'back' || d.backDoor) && YN.save.dream && YN.save.dream.cameFrom) {
        var came = YN.save.dream.cameFrom[G.rt.id];
        if (came && came !== to && came !== 'WAKE' && YN.data.worlds[came] && (YN.data.worlds[came].depth || 0) > 0 && YN.net && YN.net.markDefs(YN.data.worlds[came]).some(function (q) { return q.to === G.rt.id; })) to = came; // retour cohérent : là où l'on était
      }
      // la Couturière recoud des portes : une porte peut mener ailleurs pendant sa présence
      if (G.rt.relink && G.rt.relink[m.id]) to = G.rt.relink[m.id];
      if (!to) { G.lockedDoor(m); return; }
      if (G.rt.id === 'DREAMROOM' && to === 'WAKE') { G.wake('door'); return; }
      if (to === 'WAKE') { G.wake('door'); return; }
      YN.audio.sfx(d.sfx || (m.type === 'stairs' ? 'stairs' : m.type === 'elevator' ? 'elevator' : m.type === 'fall' || m.type === 'hole' ? 'fall' : 'door'));
      if (YN.witches) YN.witches.noteDoor(G.rt.id, m, to);
      G.enterWorld(to, d.arrive, G.rt.id, m.type === 'fall' || m.type === 'hole' ? 'fall' : 'door');
    },
    lockedDoor: function (m) {
      var d = m.def;
      YN.audio.sfx('door_locked');
      var txt = (d.lock && d.lock.text) || d.lockedText;
      if (txt) YN.ui.dialog.queue(Array.isArray(txt) ? txt : [{ t: txt }], { mark: m });
      else G.toast('…');
    },
    warp: function (world, arrive, how) { G.enterWorld(world, arrive, G.rt ? G.rt.id : null, how || 'warp'); },
    rebuildWorld: function () {
      var old = G.rt; if (!old) return;
      var p = G.player, over = old.over, overLayer = old.overLayer;
      var rt = YN.world.build(old.id);
      rt.over = over; rt.overLayer = overLayer; rt._ovN = Object.keys(over || {}).length;
      G.rt = rt;
      if (!rt.passable(p.x, p.y, 'player', G.caps())) { var q = YN.world.nearestOpen(rt, p.x, p.y); G.placePlayer(q[0], q[1]); }
      YN.audio.playMusic(rt.music, { fade: 2.5 });
      if (rt.music === null) YN.audio.stopMusic(2);
      if (YN.witches) YN.witches.worldRebuilt(rt);
    },
    placePlayer: function (x, y, exact) {
      var p = G.player;
      p.x = Math.floor(x); p.y = Math.floor(y);
      p.px = exact ? x : p.x + 0.5; p.py = exact ? y : p.y + 0.62; p.fx = p.px - 0.5; p.fy = p.py - 0.5;
      p.vx = 0; p.vy = 0; p.hopT = 0; p.z = 0; p.moving = false; p.mt = 0;
      x = p.x; y = p.y;
      p.side.px = x * 16; p.side.py = y * 16 - 8; p.side.vx = 0; p.side.vy = 0; p.side.safe = [x, y];
      p.fps.x = x + 0.5; p.fps.y = y + 0.5;
      p.fps.a = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0, upleft: -Math.PI * 0.75, upright: -Math.PI / 4, downleft: Math.PI * 0.75, downright: Math.PI / 4 }[p.dir] || 0;
    },

    /* ---------- réveil ---------- */
    wake: function (reason) {
      if (!YN.save.dream || G.state === 'capture') return;
      G.state = 'waking';
      var mother = YN.save.dream.mother && YN.save.dream.mother.done;
      var summary = YN.save.commitDream(reason);
      YN.audio.sfx('wake');
      if (YN.witches) YN.witches.reset();
      if (YN.priestess) YN.priestess.reset();
      if (reason === 'pinch') YN.save.perm.stats.pinches++;
      if (reason === 'timeout') YN.save.perm.stats.timeouts++;
      if (reason === 'door') YN.save.perm.stats.doorWakes++;
      YN.save.write();
      G.enterWorld('ROOM', 'bed', null, 'wake', function () {
        G.state = 'room';
        if (YN.room) YN.room.onWake(summary, mother);
        if (YN.ui) YN.ui.wakeSummary(summary, reason);
      });
    },

    /* ---------- attaque / capture ---------- */
    attack: function (by, opts) {
      opts = opts || {};
      if (G.state !== 'dream' || G.trans || G.invulnerable()) return false;
      var ignoresCookie = !!opts.ignoreCookie;
      if (!ignoresCookie && YN.save.useCookie()) {
        YN.audio.sfx('cookie_break');
        YN.render.addFx({ type: 'flash', life: 0.5, a: 0.4, color: '#f8d8a0' });
        YN.render.cam.shake = 1;
        G.invulnUntil = G.clock + 3;
        if (by && by.repel) by.repel();
        G.toast('The biscuit broke.', 2.5);
        if (YN.ui) YN.ui.hud.refresh();
        return false;
      }
      G.capture(by, opts);
      return true;
    },
    capture: function (by, opts) {
      if (G.state === 'capture') return;
      G.state = 'capture';
      var who = by && by.id ? by.id : 'witch';
      YN.save.markWitchMet(who);
      if (who === 'priestess' && G.rt) {
        YN.save.addCorruption(G.rt.id, 2);
        YN.net.adjacent(G.rt.id, { noSafe: true }).forEach(function (w) { YN.save.addCorruption(w, 1); });
      }
      var lost = YN.save.discardDream(who);
      if (YN.witches) YN.witches.reset();
      if (YN.priestess) YN.priestess.reset();
      YN.audio.stopMusic(0.1);
      var done = function () { G.enterWorld('ROOM', 'bed', null, 'capture', function () { G.state = 'room'; if (YN.room) YN.room.onCapture(lost); if (YN.ui) YN.ui.captureSummary(lost); }); };
      if (YN.ui) YN.ui.jumpscare(who, done); else done();
    },

    /* ---------- objets ---------- */
    giveEffect: function (id) {
      var d = YN.effectById(id);
      if (!d) { YN.warn('unknown effect ' + id); return; }
      if (YN.save.hasEffect(id) || YN.save.isEgg(id)) return;
      YN.save.grantEffect(id);
      YN.audio.sfx('effect_get');
      YN.render.addFx({ type: 'spark', x: G.player.x, y: G.player.y, life: 1.2, color: '#fff8d0' });
      if (YN.ui) YN.ui.effectGet(d);
      YN.bus.emit('effectGet', id);
    },
    giveCookie: function () {
      if (YN.save.addCookie()) { YN.audio.sfx('cookie'); G.toast('A biscuit.'); if (YN.ui) YN.ui.hud.refresh(); return true; }
      G.toast('Her pockets are full.'); return false;
    },
    addTime: function (sec) {
      var d = YN.save.dream; if (!d) return;
      d.remaining = U.clamp(d.remaining + sec, 0, 1800);
      if (sec < 0) YN.render.addFx({ type: 'flash', life: 0.3, a: 0.25, color: '#400' });
      if (YN.ui) YN.ui.hud.pulseTimer(sec);
    },
    questNotice: function () { /* les quêtes ne s'annoncent jamais : rien */ },
    depositEgg: function (id) {
      if (!YN.save.layEgg(id)) return false;
      YN.audio.sfx('reveal');
      YN.bus.emit('egg', id);
      return true;
    },
    ending: function (id) { if (YN.endings) YN.endings.play(id); },

    /* ---------- bruit, lumière ---------- */
    noise: function (x, y, amount, kind) {
      G.noiseEvents.push({ world: G.rt ? G.rt.id : null, x: x, y: y, amount: amount, kind: kind, t: G.clock });
      if (G.noiseEvents.length > 40) G.noiseEvents.shift();
      if (YN.witches) YN.witches.hear(G.rt ? G.rt.id : null, x, y, amount, kind);
      if (G.rt) YN.world.mechCall(G.rt, 'onNoise', x, y, amount);
    },
    lightChanged: function () { if (YN.witches) YN.witches.lightChanged(G.rt ? G.rt.id : null, G.player.x, G.player.y); },
    darknessLevel: function () {
      var rt = G.rt; if (!rt) return 0;
      var d = rt.darkness || 0;
      if (rt.corrDark) d = Math.max(d, rt.corrDark);
      if (YN.priestess && YN.priestess.isIn(rt.id)) d = Math.min(1, d + 0.15);
      var st = YN.save.settings;
      if (st && st.darkAssist) d *= rt.def.totalDark ? 0.92 : 0.6;
      return U.clamp(d, 0, 1);
    },
    lights: function () {
      var rt = G.rt, p = G.player, out = [], eq = G.equipped();
      var dark = G.darknessLevel();
      if (dark > 0) {
        var pl = YN.effects.light(eq);
        var base = rt.def.noPlayerLight ? 0 : (rt.def.playerLight !== undefined ? rt.def.playerLight : 1.6);
        if (YN.save.settings && YN.save.settings.darkAssist) base = Math.max(base, rt.def.totalDark ? 0.9 : 2.4);
        var r = Math.max(base, pl);
        if (r > 0) out.push({ x: rt.view === 'side' ? p.side.px / 16 : p.fx, y: rt.view === 'side' ? p.side.py / 16 + 0.5 : p.fy, r: r, flicker: pl > 0 });
      }
      rt.marks.forEach(function (m) { if (m.active && !m.hidden && m.light) out.push({ x: m.x, y: m.y, r: m.light, flicker: m.def.flicker }); });
      rt.ents.forEach(function (e) { if (e.present && e.def.light && e.alphaNow > 0.1) out.push({ x: e.fx, y: e.fy, r: e.def.light * e.alphaNow }); });
      (rt.lightsExtra || []).forEach(function (l) { out.push(l); });
      return out;
    },
    cssFilter: function () {
      var f = [];
      if (YN.priestess && G.rt && YN.priestess.isIn(G.rt.id)) f.push('contrast(1.12) saturate(0.7)');
      if (G.rt && G.rt.cssFilter) f.push(G.rt.cssFilter);
      return f.join(' ');
    },

    /* ---------- sauvegarde instantanée du rêve ---------- */
    snapshot: function () {
      if (!G.inDream() || !G.rt || G.state !== 'dream') return;
      YN.save.snapshot({ world: G.rt.id, pos: [G.player.x, G.player.y], dir: G.player.dir, witches: YN.witches ? YN.witches.serialize() : null });
    },

    /* ================= BOUCLE ================= */
    update: function (realDt) {
      var dt = Math.min(realDt, 0.1);
      if (G.state === 'boot' || G.state === 'title' || !G.rt) return;
      if (YN.ui && YN.ui.modalOpen()) { // menus ouverts : le rêve continue (sauf pause explicite)
        if (G.paused) return;
        G.clock += dt;
        G.tickTimer(realDt);
        return;
      }
      if (G.paused) return;
      G.clock += dt;
      var rt = G.rt;
      rt.t += dt;
      if (G.state === 'dream') G.tickTimer(realDt);
      if (G.state !== 'dream' && G.state !== 'room') return;
      if (G.effectSuppressed > 0) G.effectSuppressed -= dt;
      G.reevalT -= dt;
      if (G.reevalT <= 0) { G.reevalT = 0.5; YN.world.reeval(rt); }
      // mécaniques du monde
      if (!(G.frozenUntil > G.clock)) for (var i = 0; i < rt.mechs.length; i++) { var m = rt.mechs[i]; if (m.impl.update) { try { m.impl.update(rt, m.s, m.p, dt); } catch (e) { YN.warn(rt.id + ' ' + m.type + '.update : ' + (e.stack || e)); m.impl = Object.assign({}, m.impl, { update: null }); } } }
      if (!G.trans) G.handleInput(dt);
      G.updatePlayer(dt);
      YN.entities.update(rt, dt, G);
      if (YN.spawns) YN.spawns.update(rt, dt);
      G.updateSouls(dt);
      if (G.state === 'dream') {
        if (YN.witches) YN.witches.update(dt);
        if (YN.priestess) YN.priestess.update(dt);
      }
      if (YN.corruption) YN.corruption.update(rt, dt);
      YN.speech.update();
      G.emitT -= dt;
      if (G.emitT <= 0) { G.emitT = 0.15; YN.audio.setEmitters(YN.entities.emitters(rt, G)); }
      G.snapT -= dt;
      if (G.snapT <= 0) { G.snapT = 5; G.snapshot(); G.history.push({ x: G.player.x, y: G.player.y, w: rt.id, t: G.clock }); if (G.history.length > 6) G.history.shift(); }
    },
    tickTimer: function (realDt) {
      var d = YN.save.dream; if (!d || G.state !== 'dream') return;
      var mul = (G.rt && G.rt.depth >= 5) ? 2 : 1; // la sixième couche compte double
      if (G.rt && G.rt.def.timerMul) mul = G.rt.def.timerMul;
      if (G.caps().caffeine) mul *= 1.25;
      d.remaining -= realDt * mul;
      // phases et signaux discrets
      var ph = YN.cond.phaseOf(d.remaining, d.duration);
      if (ph !== G.phase) { G.phase = ph; YN.bus.emit('phase', ph); if (ph !== 'opening') YN.audio.sfx('chime', { note: ph === 'middle' ? 0 : ph === 'late' ? -3 : -7, vol: 0.5 }); }
      var finalK = ph === 'final' ? U.clamp(1 - d.remaining / (d.duration * 0.1), 0, 1) : 0;
      YN.audio.setMods({ lowpass: 1 - finalK * 0.85, detune: finalK * 30, rate: 1 - finalK * 0.25 });
      // la mère
      var elapsed = d.duration - d.remaining;
      if (d.mother.roll && !d.mother.done) {
        if (!d.mother.warned && elapsed > d.mother.at - 4 && d.room.door) { d.mother.warned = true; YN.audio.sfx('mother_steps', { vol: 0.6, pan: -0.3 }); }
        if (elapsed >= d.mother.at) G.motherEnters();
      }
      if (d.remaining <= 0) { d.remaining = 0; G.wake('timeout'); }
    },
    motherEnters: function () {
      var d = YN.save.dream; if (!d || d.mother.done) return;
      if (!d.room.door) YN.audio.sfx('mother_steps', { vol: 0.35 });
      YN.render.addFx({ type: 'flash', life: 1.6, a: 0.18, color: '#f8e0a0' });
      setTimeout(function () {
        if (!YN.save.dream) return;
        YN.audio.sfx('mother_click');
        YN.save.motherVisit();
        G.lightChanged();
        if (G.rt && G.rt.depth <= 2) G.rebuildWorld();
        YN.bus.emit('mother');
      }, 1400);
      d.mother.done = true;
    },

    /* ---------- commandes ---------- */
    handleInput: function (dt) {
      var I = YN.input, p = G.player;
      if (I.pressed('back')) { if (YN.ui) YN.ui.pause.open(); return; }
      if (I.pressed('effects')) { if (!G.inDream()) { YN.audio.sfx('menu_back'); return; } if (YN.ui) YN.ui.effectsMenu.open(); return; }
      if (I.pressed('speak')) { if (YN.ui) YN.ui.speak.open(); return; }
      if (I.pressed('ascii') && YN.debug && YN.debug.unlocked()) { YN.debug.toggleAscii(); }
      if (I.pressed('console') && YN.debug && YN.debug.unlocked()) { YN.debug.openConsole(); return; }
      if (I.pressed('map') && YN.ui && G.caps().map) { YN.ui.minimap.toggle(); }
      if (I.pressed('effect') && G.inDream()) { YN.effects.use(); }
      if (I.pressed('act')) { G.interact(); }
      // se pincer (maintenir)
      if (I.held('pinch') && G.state === 'dream' && !p.moving) {
        var need = 1.5 * Math.max(1, G.rt.depth);
        G.pinch += dt;
        if (G.pinch === dt) YN.audio.sfx('pinch');
        if (YN.ui) YN.ui.hud.pinch(G.pinch / need);
        if (G.pinch >= need) { G.pinch = 0; if (YN.ui) YN.ui.hud.pinch(0); G.wake('pinch'); return; }
      } else if (G.pinch > 0) { G.pinch = 0; if (YN.ui) YN.ui.hud.pinch(0); }
      if (I.held('pinch') && G.state === 'room' && I.peek('pinch')) { I.pressed('pinch'); G.toast('She is awake.'); }
    },
    interact: function () {
      var rt = G.rt, f = G.facing(), p = G.player;
      // ce qui est sous les pieds d'abord (objets au sol)
      var under = rt.marksAt(p.x, p.y).filter(function (m) { return !m.solid && !m.def.noInteract && (m.type === 'item' || m.type === 'cookie' || m.type === 'effect' || m.def.use || m.def.lines); });
      var ent = null, m = null, cands = (rt.view === 'side' || rt.view === 'fps' || rt.view === 'wire') ? [f] : G.facingCandidates();
      if (rt.view !== 'side' && rt.view !== 'fps' && rt.view !== 'wire') {
        // l'être le plus proche dans un cône devant la joueuse
        var d = DIRS[p.dir] || DIRS.down, bestS = 1e9;
        for (var i = 0; i < rt.ents.length; i++) {
          var e2 = rt.ents[i]; if (!e2.present || !(e2.def.talkable || e2.visible || e2.solid !== false)) continue;
          var ex = (e2.fx != null ? e2.fx : e2.x) + 0.5 - p.px, ey = (e2.fy != null ? e2.fy : e2.y) + 0.55 - p.py;
          if (rt.wrap) { ex = U.mod(ex + rt.w / 2, rt.w) - rt.w / 2; ey = U.mod(ey + rt.h / 2, rt.h) - rt.h / 2; }
          var dl = Math.sqrt(ex * ex + ey * ey); if (dl > 1.45 + Math.max(0, YN.entities.body(e2) - 0.3)) continue;
          var dot = dl < 0.35 ? 1 : (ex * d[0] + ey * d[1]) / dl; if (dot < 0.35) continue;
          var sc = dl - dot * 0.5; if (sc < bestS) { bestS = sc; ent = e2; }
        }
      } else ent = rt.entAt(f[0], f[1]);
      if (!ent) for (var c = 0; c < cands.length && !m; c++) {
        m = rt.markAt(cands[c][0], cands[c][1]);
        if (m && m.def.noInteract) { var alt = rt.marksAt(cands[c][0], cands[c][1]).filter(function (q) { return !q.def.noInteract; }); m = alt[alt.length - 1] || null; }
        if (m) f = cands[c];
      }
      if (!ent && !m) { f = cands[0] || f; for (var j = 0; j < rt.ents.length; j++) { var e3 = rt.ents[j]; if (e3.present && e3.x === f[0] && e3.y === f[1] && (e3.def.talkable || e3.visible)) { ent = e3; break; } } }
      G.logRepeat('i:' + f[0] + ',' + f[1]);
      if (ent && ent.present) { YN.entities.talk(ent, G); return; }
      if (m) { G.useMark(m); return; }
      if (under.length) { G.useMark(under[0]); return; }
      YN.world.mechCall(rt, 'onInteractNothing', f[0], f[1]);
    },
    useMark: function (m) {
      var d = m.def;
      if (YN.world.mechCall(G.rt, 'onInteract', m)) return;
      if (YN.DOOR_TYPES[m.type] && m.solid) { G.useDoor(m); return; }
      if (d.cond2 && !YN.cond.check(d.cond2)) { if (d.failLines) YN.ui.dialog.queue(d.failLines, { mark: m }); return; }
      switch (m.type) {
        case 'item': case 'cookie':
          if (m.state.taken || (d.once && YN.save.flag('got:' + m.id))) return;
          m.state.taken = true; m.active = false;
          YN.save.temp('took:' + G.rt.id + ':' + (m.def.id || m.key || (m.x + ',' + m.y)), true); // gardé pour la nuit : il ne réapparaît pas
          if (d.once) YN.save.setFlag('got:' + m.id, true);
          if (m.type === 'cookie') G.giveCookie();
          if (d.give) G.giveEffect(d.give);
          if (d.item) YN.act.run({ item: d.item }, { mark: m });
          break;
        case 'effect':
          if (d.give && !YN.save.hasEffect(d.give) && !YN.save.isEgg(d.give) && (!d.need || YN.cond.check(d.need, { mark: m }))) {
            if (d.getLines) YN.ui.dialog.queue(d.getLines, { mark: m }, function () { G.giveEffect(d.give); if (d.onGet) YN.act.run(d.onGet, { mark: m }); });
            else { G.giveEffect(d.give); if (d.onGet) YN.act.run(d.onGet, { mark: m }); }
            return;
          }
          break;
      }
      if (m.type === 'soul') { G.soulSpeak(m); return; }
      if (d.use) YN.act.run(d.use, { mark: m });
      if (d.dialog) { YN.dialogue.start(d.dialog, null, { mark: m }); return; }
      var lines = d.lines || (d.text ? [d.text] : null);
      if (d.glyphs) lines = [{ t: '{{' + d.glyphs + '}}', who: '' }].concat(lines || []);
      if (lines) {
        // les répliques conditionnelles d'un objet : seules celles dont la condition tient
        var pool = lines.filter(function (l) { return !(l && typeof l === 'object' && l.if) || YN.cond.check(l.if, { mark: m }); });
        if (!pool.length) return;
        if (d.cycle) { var n = (m.state.n = (m.state.n || 0) + 1); var beat = pool.filter(function (l) { return l && l.if && l.do && !YN.save.flag('beat:' + m.id + ':' + lines.indexOf(l)); })[0]; if (beat) YN.save.setFlag('beat:' + m.id + ':' + lines.indexOf(beat), true); pool = beat ? [beat] : [pool[(n - 1) % pool.length]]; }
        var acts = []; pool.forEach(function (l) { if (!l || !l.do) return; var bk = 'beatdo:' + m.id + ':' + lines.indexOf(l); if (l.repeat || !YN.save.flag(bk)) { acts.push(l.do); if (!l.repeat) YN.save.setFlag(bk, true); } });
        YN.ui.dialog.queue(pool.map(function (l) { return typeof l === 'string' ? { t: l } : l; }), { mark: m }, acts.length ? function () { acts.forEach(function (a) { YN.act.run(a, { mark: m }); }); } : null);
      }
    },
    /* une âme donne son message en entier, puis se défait */
    soulSpeak: function (m) {
      var d = m.def; if (m.state.leaving) return;
      var body = (d.lines || (d.text ? [d.text] : [])).map(function (l) { return typeof l === 'string' ? { t: l } : Object.assign({}, l); }).filter(function (l) { return typeof l.t === 'string' || typeof l.t === 'function'; });
      // elle ne dit presque rien : une phrase (deux au plus pour un ancien panneau qui portait un indice)
      var spoken = body.filter(function (l) { return l.lang; });
      if (d._wasSign) body = spoken.length ? spoken.slice(0, 2) : body.slice(0, 2); // les indices sont dans les répliques, pas dans la description
      else body = [spoken[0] || body[0]].filter(Boolean);
      if (d.glyphs) body = [{ t: '{{' + d.glyphs + '}}', who: '' }].concat(body.slice(0, 1));
      body.forEach(function (l) { if (l.who === undefined) l.who = l.lang ? 'a soul' : ''; });
      if (!body.length) body = [{ t: '…', who: '' }];
      YN.audio.sfx('soul', { vol: 0.4 });
      YN.ui.dialog.queue(body, { mark: m }, function () {
        if (d.use) YN.act.run(d.use, { mark: m });
        m.state.leaving = G.clock;
        if (d.soulKey) {
          if (d.soulNightly) YN.save.temp(d.soulKey, true); else YN.save.setFlag(d.soulKey, true, true);
          var P = YN.save.perm; if (P) { P.souls = P.souls || []; if (!P.souls.some(function (s) { return s.k === d.soulKey; })) { P.souls.push({ k: d.soulKey, w: G.rt.id, lines: body.map(function (l) { return { t: l.t, lang: l.lang, tr: l.tr }; }).filter(function (l) { return typeof l.t === 'string'; }), at: P.stats ? P.stats.dreams : 0 }); YN.save.write(); } }
        }
      });
    },
    updateSouls: function (dt) {
      var rt = G.rt; if (!rt) return;
      for (var i = 0; i < rt.marks.length; i++) {
        var m = rt.marks[i]; if (m.type !== 'soul' || !m.active) continue;
        m.oy = Math.sin(G.clock * 1.3 + m.x * 0.7) * 0.06 - 0.08;
        if (m.state.leaving) { var k = (G.clock - m.state.leaving) / 2.2; m.alpha = Math.max(0, 0.82 * (1 - k)); m.oy -= k * 0.6; m.solid = false; if (k >= 1) { m.active = false; m.hidden = true; } }
      }
    },
    logRepeat: function (key) {
      var now = G.clock;
      G.repeatLog = G.repeatLog.filter(function (r) { return now - r.t < 6; });
      G.repeatLog.push({ k: key, t: now });
      var n = G.repeatLog.filter(function (r) { return r.k === key; }).length;
      if (n >= 3 && G.state === 'dream') G.noise(G.player.x, G.player.y, 3 + n, 'repeat');
    },

    /* ---------- déplacement libre (8 directions, collisions circulaires) ---------- */
    solidFor: function (tx, ty) {
      if (YN.debug && YN.debug.noclip) return false;
      return !G.rt.passable(tx, ty, 'pbody', G.caps());
    },
    /* distance² (pondérée) entre le pied et une case */
    tileD2: function (nx, ny, tx, ty) {
      var cx = U.clamp(nx, tx, tx + 1), cy = U.clamp(ny, ty, ty + 1);
      var dx = nx - cx, dy = (ny - cy) * (ny > cy ? 1.8 : 1.3);
      return dx * dx + dy * dy;
    },
    /* renvoie ce qui bloque un pied posé en (nx, ny), ou null.
       Un obstacle qu'on chevauche déjà (porte apparue, être arrivé sur nous) ne retient pas. */
    hits: function (nx, ny) {
      var r = RAD, r2 = r * r, p = G.player, rt = G.rt;
      var x0 = Math.floor(nx - r), x1 = Math.floor(nx + r), y0 = Math.floor(ny - r * 0.7), y1 = Math.floor(ny + r * 0.55);
      var best = null, bd = 9;
      for (var ty = y0; ty <= y1; ty++) for (var tx = x0; tx <= x1; tx++) {
        var dd = G.tileD2(nx, ny, tx, ty);
        if (dd >= r2 || dd >= bd) continue;
        if (!G.solidFor(tx, ty)) continue;
        if (G.tileD2(p.px, p.py, tx, ty) < r2 * 0.98 && dd >= G.tileD2(p.px, p.py, tx, ty) - 1e-6) continue;
        bd = dd; best = [tx, ty];
      }
      if (best || (YN.debug && YN.debug.noclip)) return best;
      // les êtres solides : des cercles autour de leurs pieds
      for (var i = 0; i < rt.ents.length; i++) {
        var e = rt.ents[i]; if (!e.visible || !e.solid || !e.present) continue;
        var ex = e.fx + 0.5, ey = e.fy + 0.62, dx = nx - ex, dy = ny - ey;
        if (rt.wrap) { dx = U.mod(dx + rt.w / 2, rt.w) - rt.w / 2; dy = U.mod(dy + rt.h / 2, rt.h) - rt.h / 2; }
        var er = r + YN.entities.body(e), d2 = dx * dx + dy * dy * 1.6;
        if (d2 >= er * er) continue;
        var ox = p.px - ex, oy = p.py - ey, o2 = ox * ox + oy * oy * 1.6;
        if (o2 < er * er && d2 >= o2) continue; // déjà collées : on peut s'écarter
        var hb = [e.x, e.y]; hb.ent = e; return hb;
      }
      return null;
    },
    updatePlayer: function (dt) {
      var rt = G.rt; if (!rt) return;
      if (rt.view === 'side') return YN.player.updateSide(G, rt, dt);
      if (rt.view === 'fps' || rt.view === 'wire') return YN.player.updateFps(G, rt, dt);
      var p = G.player, I = YN.input;
      p.animT += dt;
      if (p.hopT > 0) { G.updateHop(dt); return; }
      var ix = 0, iy = 0;
      if (!G.trans && G.state !== 'capture' && G.state !== 'waking' && !p.statue) {
        var a = I.axis(); ix = a[0]; iy = a[1];
        if (rt.controlsMirror) ix = -ix;
        if (rt.controlsRotate) { var tq = ix; ix = -iy; iy = tq; }
      }
      var len = Math.sqrt(ix * ix + iy * iy);
      if (len > 0.15) { p.dir = dirFromVec(ix, iy); if (p.hiding) p.hiding = false; }
      // mondes où le corps va à rebours du regard (on fait face, on recule)
      if (rt.def.invertX) ix = -ix;
      if (rt.def.invertY) iy = -iy;
      var here = YN.tileInfo(rt.tile(p.x, p.y));
      var spd = G.moveSpeed(here);
      var icy = here.slide && !G.caps().scarf;
      if (icy) {
        if (len > 0.15) { p.vx += ix * spd * 1.6 * dt; p.vy += iy * spd * 1.6 * dt; }
        var vl = Math.sqrt(p.vx * p.vx + p.vy * p.vy), vmax = spd * 1.5; if (vl > vmax) { p.vx *= vmax / vl; p.vy *= vmax / vl; }
        p.vx *= Math.max(0, 1 - 0.25 * dt); p.vy *= Math.max(0, 1 - 0.25 * dt);
      } else if (G.pixelMove() && !here.conveyor) {
        // déplacement au pixel : vitesse constante, nombre entier de pixels par image, sans rampe
        var tp = (YN.render && YN.render.tpx) || 20, run = I.held('run');
        var pxs = 60 * (spd / 3.6) * (run ? 2 / 1.6 : 1);
        var ax = Math.abs(ix) > 0.35 ? (ix > 0 ? 1 : -1) : 0, ay = Math.abs(iy) > 0.35 ? (iy > 0 ? 1 : -1) : 0;
        p.vx = ax * pxs / tp; p.vy = ay * pxs / tp;
      } else {
        var k = Math.min(1, dt * (len > 0.15 ? 16 : 22));
        p.vx += (ix * spd - p.vx) * k; p.vy += (iy * spd - p.vy) * k;
        if (len <= 0.15 && Math.abs(p.vx) < 0.03 && Math.abs(p.vy) < 0.03) { p.vx = 0; p.vy = 0; }
      }
      if (here.conveyor && rt.def.conveyorDir) { var cd = DIRS[rt.def.conveyorDir]; p.vx = p.vx * 0.5 + cd[0] * 4; p.vy = p.vy * 0.5 + cd[1] * 4; }
      var ox = p.px, oy = p.py, mx = p.vx * dt, my = p.vy * dt;
      if (G.pixelMove() && !icy && !here.conveyor) {
        var tq2 = (YN.render && YN.render.tpx) || 20;
        if (!p.vx) p.accX = 0; if (!p.vy) p.accY = 0;
        // rythme régulier : à 144 Hz, 1 px toutes les 2 images (et non 1, 0, 0, 1, 0… qui saccade) ; à 60 Hz, 1 px par image
        var hz = (YN.render && YN.render.hz) || Math.round(1 / Math.max(1 / 240, dt || 1 / 60));
        var ppf = Math.max(Math.abs(p.vx), Math.abs(p.vy)) * tq2 / hz, nX = 0, nY = 0;
        if (ppf > 0) {
          if (ppf >= 0.75) { var k = Math.max(1, Math.round(ppf)); nX = Math.sign(p.vx) * k; nY = Math.sign(p.vy) * k; p.cad = 0; }
          else { var every = Math.max(1, Math.round(1 / ppf)); p.cad = ((p.cad || 0) + 1) % every; if (p.cad === 0) { nX = Math.sign(p.vx); nY = Math.sign(p.vy); } }
        } else p.cad = -1; // à l'arrêt : le premier pas part tout de suite
        p.accX = 0; p.accY = 0; mx = nX / tq2; my = nY / tq2;
      }
      if (mx || my) {
        // sous-pas pour ne jamais traverser une case fine
        var steps = Math.max(1, Math.ceil(Math.max(Math.abs(mx), Math.abs(my)) / 0.12));
        for (var si = 0; si < steps; si++) {
          var sx = mx / steps, sy = my / steps;
          if (sx) { var h1 = G.hits(p.px + sx, p.py); if (!h1) p.px += sx; else { if (h1.ent || !G.cornerSlide('x', sx)) { G.bump(h1, sx > 0 ? 'right' : 'left', len > 0.15 && Math.abs(ix) > 0.3); p.vx = icy ? -p.vx * 0.2 : 0; mx = 0; } } }
          if (sy) { var h2 = G.hits(p.px, p.py + sy); if (!h2) p.py += sy; else { if (h2.ent || !G.cornerSlide('y', sy)) { G.bump(h2, sy > 0 ? 'down' : 'up', len > 0.15 && Math.abs(iy) > 0.3); p.vy = icy ? -p.vy * 0.2 : 0; my = 0; } } }
          if (G.trans) break;
        }
        if (rt.wrap && !rt.inf) { p.px = U.mod(p.px, rt.w); p.py = U.mod(p.py, rt.h); }
      }
      var ddx = p.px - ox, ddy = p.py - oy;
      if (rt.wrap) { if (Math.abs(ddx) > rt.w / 2) ddx -= U.sign(ddx) * rt.w; if (Math.abs(ddy) > rt.h / 2) ddy -= U.sign(ddy) * rt.h; }
      var moved = Math.sqrt(ddx * ddx + ddy * ddy);
      // l'animation ne s'interrompt pas pour une image sans pixel gagné : on garde la marche 0,15 s
      if (moved > 0.0015) p.walkHold = 0.15; else p.walkHold = Math.max(0, (p.walkHold || 0) - dt);
      p.moving = (len > 0.15 || icy) && p.walkHold > 0;
      p.sliding = icy && moved > 0.002 && len <= 0.15;
      if (p.moving && !p.sliding) {
        // une foulée par case : cycle complet (gauche, pose, droite, pose) en deux cases
        var q0 = Math.floor(p.phase * 2);
        p.phase = U.mod(p.phase + moved * 0.5, 1);
        if (Math.floor(p.phase * 2) !== q0) G.footstep();
      } else if (!p.moving) { p.phase = 0.75; p.stepDist = 0; } // on repart de la pose : la première foulée vient après une demi-case
      p.fx = p.px - 0.5; p.fy = p.py - 0.5;
      var nx = Math.floor(p.px), ny = Math.floor(p.py);
      if (rt.wrap && !rt.inf) { nx = U.mod(nx, rt.w); ny = U.mod(ny, rt.h); }
      if (nx !== p.x || ny !== p.y) {
        var tx = nx - p.x, ty = ny - p.y;
        if (rt.wrap) { if (Math.abs(tx) > rt.w / 2) tx -= U.sign(tx) * rt.w; if (Math.abs(ty) > rt.h / 2) ty -= U.sign(ty) * rt.h; }
        var sd = Math.abs(tx) >= Math.abs(ty) ? (tx > 0 ? 'right' : 'left') : (ty > 0 ? 'down' : 'up');
        p.x = nx; p.y = ny;
        G.lastStep = { dir: sd, n: ++p.stepN, x: nx, y: ny };
        G.onStep();
      }
    },
    /* aide aux coins : on glisse le long d'un angle frôlé au lieu de rester bloquée
       (jamais contre un habitant : on s'arrête devant lui, sinon on le contourne sans pouvoir lui parler) */
    cornerSlide: function (axis, m) {
      var p = G.player, o;
      for (var s = 1; s <= 5; s++) {
        o = s * 0.05;
        if (axis === 'x') {
          if (!G.hits(p.px + m, p.py - o) && !G.hits(p.px, p.py - o)) { p.py -= Math.min(o, Math.abs(m)); return true; }
          if (!G.hits(p.px + m, p.py + o) && !G.hits(p.px, p.py + o)) { p.py += Math.min(o, Math.abs(m)); return true; }
        } else {
          if (!G.hits(p.px - o, p.py + m) && !G.hits(p.px - o, p.py)) { p.px -= Math.min(o, Math.abs(m)); return true; }
          if (!G.hits(p.px + o, p.py + m) && !G.hits(p.px + o, p.py)) { p.px += Math.min(o, Math.abs(m)); return true; }
        }
      }
      return false;
    },
    /* on pousse contre une case : porte, trou, mécanique, rebond */
    bump: function (h, dir, pushing) {
      var rt = G.rt, m = rt.markAt(h[0], h[1]);
      if (!pushing || G.trans) return;
      if (m && YN.DOOR_TYPES[m.type] && m.solid) { G.useDoor(m); return; }
      if (YN.world.mechCall(rt, 'onTryMove', h[0], h[1], dir)) return;
      var info = YN.tileInfo(rt.tile(h[0], h[1]));
      if (info.pit) {
        var fall = (m && m.type === 'fall') ? m.def : rt.def.fall;
        if (fall && (!fall.cond || YN.cond.check(fall.cond))) {
          G.pitPush = (G.pitPush || 0) + 1;
          if (G.pitPush > 8) { G.pitPush = 0; YN.audio.sfx('fall'); G.enterWorld(fall.to, fall.arrive, rt.id, 'fall'); }
        }
        return;
      }
      if (m && m.def.onBump && !(m.state.bumpT > G.clock)) { m.state.bumpT = G.clock + 0.9; YN.act.run(m.def.onBump, { mark: m }); }
    },
    pixelMove: function () { return !(YN.save.settings && YN.save.settings.pixelMove === false); },
    moveSpeed: function (here) {
      var p = G.player, I = YN.input, eq = G.equipped();
      var s = 3.6 * YN.effects.speed(eq);
      if (I.held('run')) s *= 1.6;
      here = here || YN.tileInfo(G.rt.tile(p.x, p.y));
      if (here.slow && !G.caps().swim) s *= 0.62;
      if (G.rt.def.speedMul) s *= G.rt.def.speedMul;
      if (G.rt.speedMulNow) s *= G.rt.speedMulNow;
      if (p.small) s *= 0.8;
      if (p.hugging) s *= 0.85;
      return s;
    },
    footstep: function () {
      var rt = G.rt, p = G.player, info = YN.tileInfo(rt.tile(p.x, p.y));
      var mat = YN.tiles.material(rt.look, info.kind), kind = mat && mat.p;
      var sfx = STEP_SFX[info.kind] || STEP_SFX[kind] || 'step_floor';
      var noiseMul = YN.effects.noise(G.equipped()), run = YN.input.held('run');
      YN.audio.sfx(sfx, { vol: 0.42 * Math.min(1.5, noiseMul) * (p.small ? 0.5 : 1) });
      var noise = (info.noise || 0.4) * noiseMul * (run ? 2.2 : 1);
      if (G.state === 'dream' && noise > 0.6) G.noise(p.x, p.y, noise, info.noise >= 3 ? 'leaves' : (run ? 'run' : 'step'));
      if (YN.render.addFx && (info.water || info.kind === 'shallow')) YN.render.addFx({ type: 'ripple', x: p.px - 0.5, y: p.py - 0.5, life: 0.9 });
      else if (YN.render.addFx && (info.kind === 'snow' || kind === 'snow')) YN.render.addFx({ type: 'print', x: p.px - 0.5, y: p.py - 0.5, life: 7, dir: p.dir, side: ((G.fsN = (G.fsN || 0) + 1) & 1) });
    },
    /* petite poussée (vent, recul, mécaniques) */
    tryMove: function (dir) {
      var p = G.player, d = DIRS[dir]; if (!d) return;
      p.vx += d[0] * 6; p.vy += d[1] * 6;
    },
    onStep: function () {
      var rt = G.rt, p = G.player, info = YN.tileInfo(rt.tile(p.x, p.y));
      if (info.hazard && G.state === 'dream' && !G.caps().hazardProof) { G.addTime(-15); YN.audio.sfx('stun'); YN.render.cam.shake = 0.5; }
      if (info.pit && rt.def.fall && !G.trans && !(YN.debug && YN.debug.noclip)) { var fl = rt.def.fall; if (!fl.cond || YN.cond.check(fl.cond)) { YN.audio.sfx('fall'); G.enterWorld(fl.to, fl.arrive, rt.id, 'fall'); return; } }
      rt.marksAt(p.x, p.y).forEach(function (m) {
        if (m.type === 'path' || m.type === 'fall' || m.type === 'hole' || (m.type === 'stairs' && !m.solid)) { if (!m.def.cond || YN.cond.check(m.def.cond)) { G.useDoor(m); } return; }
        if (m.type === 'trigger' && (!m.state.fired || m.def.repeat)) { if (!m.def.cond || YN.cond.check(m.def.cond, { mark: m })) { m.state.fired = true; YN.act.run(m.def.use || m.def.do, { mark: m }); if (m.def.lines) YN.ui.dialog.queue(m.def.lines, { mark: m }); } }
        if ((m.type === 'cookie' || m.type === 'item') && m.def.auto) G.useMark(m);
      });
      YN.world.mechCall(rt, 'onStep', p.x, p.y);
      YN.bus.emit('step', p.x, p.y);
    },
    /* saut (Grue) : arc vers le point libre le plus lointain dans la direction regardée */
    hop: function (n) {
      var rt = G.rt, p = G.player, d = DIRS[p.dir] || DIRS.down;
      for (var dist = n + 1; dist >= 1.5; dist -= 0.5) {
        var lx = p.px + d[0] * dist, ly = p.py + d[1] * dist;
        if (G.hits(lx, ly)) continue;
        var blocked = false;
        for (var s2 = 0.5; s2 < dist; s2 += 0.5) { var mi = YN.tileInfo(rt.tile(Math.floor(p.px + d[0] * s2), Math.floor(p.py + d[1] * s2))); if (mi.wall || mi.tall) { blocked = true; break; } }
        if (blocked) continue;
        YN.audio.sfx('jump');
        p.hopDur = 0.32 + dist * 0.06; p.hopT = p.hopDur; p.hopFrom = [p.px, p.py]; p.hopTo = [lx, ly];
        return true;
      }
      YN.audio.sfx('error'); return false;
    },
    updateHop: function (dt) {
      var p = G.player; p.hopT -= dt;
      var k = 1 - Math.max(0, p.hopT) / p.hopDur;
      p.px = U.lerp(p.hopFrom[0], p.hopTo[0], k); p.py = U.lerp(p.hopFrom[1], p.hopTo[1], k);
      p.z = Math.sin(k * Math.PI) * 0.8;
      p.fx = p.px - 0.5; p.fy = p.py - 0.5; p.moving = true; p.phase = 0.25;
      if (p.hopT <= 0) {
        p.z = 0; p.hopT = 0; p.vx = 0; p.vy = 0; YN.audio.sfx('land');
        var rt = G.rt; if (rt.wrap && !rt.inf) { p.px = U.mod(p.px, rt.w); p.py = U.mod(p.py, rt.h); }
        var nx = Math.floor(p.px), ny = Math.floor(p.py);
        if (nx !== p.x || ny !== p.y) { p.x = nx; p.y = ny; G.lastStep = { dir: dir4(p.dir), n: ++p.stepN, x: nx, y: ny }; G.onStep(); }
      }
    },
    pushBack: function (e) {
      var p = G.player, dx = p.px - ((e.fx != null ? e.fx : e.x) + 0.5), dy = p.py - ((e.fy != null ? e.fy : e.y) + 0.6), l = Math.sqrt(dx * dx + dy * dy);
      if (l < 0.01) { dx = 0; dy = 1; l = 1; }
      p.vx = dx / l * 8; p.vy = dy / l * 8;
    },
    rewind: function () {
      var h = G.history.filter(function (q) { return q.w === G.rt.id && G.clock - q.t > 4; });
      if (!h.length) { YN.audio.sfx('error'); return; }
      var q = h[h.length - 1]; YN.audio.sfx('static'); G.placePlayer(q.x, q.y);
      YN.render.addFx({ type: 'flash', life: 0.4, a: 0.3, color: '#c0c0ff' });
    },
    playerSprite: function () {
      var p = G.player, eq = G.equipped(), look = YN.effects.look(eq);
      var form = look.form, acc = look.acc;
      if (eq === 'E04' && G.rt && YN.tileInfo(G.rt.tile(p.x, p.y)).water) form = 'fish';
      if (p.statue) form = 'statue';
      var dir = p.dir, moving = p.moving && !p.sliding, phase = p.phase;
      if (G.rt && G.rt.view === 'side') { dir = /left/.test(p.dir) ? 'left' : 'right'; moving = Math.abs(p.side.vx) > 10; phase = U.mod(G.clock * 1.6, 1); }
      return YN.spr.girl(dir, 0, { moving: moving, phase: phase, form: form, acc: acc, hiding: p.hiding, pal: look.pal, palKey: look.palKey, t: G.clock });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
