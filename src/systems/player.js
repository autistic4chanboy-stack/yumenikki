/* =========================================================================
 *  Déplacements hors vue de dessus : plateforme (vue de côté) et vue
 *  subjective (raycast). La position en cases reste synchronisée pour les
 *  marques, PNJ et sorcières.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  function solidSide(rt, tx, ty, caps) {
    var info = YN.tileInfo(rt.tile(tx, ty));
    if (info.wall || info.tall || info.obj) return true;
    var m = rt.markAt(tx, ty);
    if (m && m.solid && !YN.DOOR_TYPES[m.type]) return true;
    void caps;
    return false;
  }

  YN.player = {
    updateSide: function (G, rt, dt) {
      var p = G.player, s = p.side, I = YN.input, caps = G.caps();
      var grav = (rt.def.gravity || 1) * (p.gravFlip ? -1 : 1);
      var inWater = YN.tileInfo(rt.tile(Math.floor((s.px + 8) / 16), Math.floor((s.py + 14) / 16))).water;
      var dir = I.dir(), moveX = 0;
      if (!G.trans && G.state !== 'capture') {
        if (I.held('left')) { moveX = -1; p.dir = 'left'; }
        if (I.held('right')) { moveX = 1; p.dir = 'right'; }
      }
      var speed = (I.held('run') ? 135 : 88) * YN.effects.speed(G.equipped());
      s.vx = U.lerp(s.vx, moveX * speed, Math.min(1, dt * 12));
      // échelles
      var cx = Math.floor((s.px + 8) / 16), cy = Math.floor((s.py + 18) / 16);
      var onLadder = YN.tileInfo(rt.tile(cx, cy)).ladder;
      if (onLadder && (I.held('up') || I.held('down'))) {
        s.vy = I.held('up') ? -70 : 70; s.ladder = true;
      } else if (s.ladder && onLadder) { s.vy = 0; }
      else {
        s.ladder = false;
        var g = inWater ? 260 : 900, maxFall = inWater ? 80 : 420;
        if (caps.float || p.floating) { g = 220; maxFall = 50; }
        s.vy += g * grav * dt;
        s.vy = U.clamp(s.vy, -maxFall * 1.5, maxFall);
      }
      var jumpPressed = I.pressed('act') || (I.peek('up') && I.pressed('up'));
      if (jumpPressed) {
        var m0 = G.markOverlap();
        if (m0 && YN.DOOR_TYPES[m0.type]) { G.useDoor(m0); return; }
        if (m0 && !YN.DOOR_TYPES[m0.type]) { G.useMark(m0); }
        else if (s.ground || inWater || s.ladder) { s.vy = -300 * grav * (caps.jump ? 1.3 : 1); s.ground = false; YN.audio.sfx('jump', { vol: 0.5 }); }
        else if (!m0) { var ent = G.rt.entAt(Math.floor((s.px + 8) / 16) + (p.dir === 'left' ? -1 : 1), Math.floor((s.py + 12) / 16)); if (ent) YN.entities.talk(ent, G); }
      }
      // mouvement horizontal
      var nx = s.px + s.vx * dt;
      var top = s.py + 4, bot = s.py + 23;
      var hitX = false;
      [top, s.py + 12, bot].forEach(function (yy) {
        var tx = Math.floor((s.vx > 0 ? nx + 12 : nx + 3) / 16), ty = Math.floor(yy / 16);
        if (solidSide(rt, tx, ty, caps)) hitX = true;
        var dm = rt.markAt(tx, ty);
        if (dm && dm.solid && YN.DOOR_TYPES[dm.type] && Math.abs(s.vx) > 20 && !G.trans) { G.useDoor(dm); hitX = true; }
      });
      if (!hitX) s.px = nx; else s.vx = 0;
      // mouvement vertical
      var ny = s.py + s.vy * dt, wasGround = s.ground;
      s.ground = false;
      var lx = Math.floor((s.px + 3) / 16), rx = Math.floor((s.px + 12) / 16);
      if (s.vy * grav > 0) {
        var footY = grav > 0 ? ny + 24 : ny + 3, ty2 = Math.floor(footY / 16);
        for (var tx2 = lx; tx2 <= rx; tx2++) {
          var info = YN.tileInfo(rt.tile(tx2, ty2));
          var solid = solidSide(rt, tx2, ty2, caps) || (info.oneway && grav > 0 && (s.py + 24) <= ty2 * 16 + 2);
          if (solid) { ny = grav > 0 ? ty2 * 16 - 24 : (ty2 + 1) * 16 - 3; s.vy = 0; s.ground = true; break; }
        }
      } else if (s.vy * grav < 0) {
        var headY = grav > 0 ? ny + 4 : ny + 23, ty3 = Math.floor(headY / 16);
        for (var tx3 = lx; tx3 <= rx; tx3++) if (solidSide(rt, tx3, ty3, caps)) { ny = grav > 0 ? (ty3 + 1) * 16 - 4 : ty3 * 16 - 23; s.vy = 0; break; }
      }
      s.py = ny;
      if (s.ground && !wasGround) YN.audio.sfx('land', { vol: 0.4 });
      // synchronisation des cases
      var px = Math.floor((s.px + 8) / 16), py = Math.floor((s.py + 16) / 16);
      if (px !== p.x || py !== p.y) {
        p.x = px; p.y = py; p.fx = s.px / 16; p.fy = s.py / 16 + 0.5;
        p.stepN++; G.lastStep = { dir: p.dir, n: p.stepN, x: px, y: py };
        G.onStepSide();
      } else { p.fx = s.px / 16; p.fy = s.py / 16 + 0.5; }
      p.moving = Math.abs(s.vx) > 10;
      if (s.ground) s.safe = [s.px, s.py];
      // dangers et chutes hors carte
      var here = YN.tileInfo(rt.tile(px, Math.floor((s.py + 20) / 16)));
      var out = s.py > rt.h * 16 + 32 || s.py < -64;
      if (here.hazard || out || (here.pit && s.vy > 0)) {
        if ((out || here.pit) && rt.def.fall) { G.enterWorld(rt.def.fall.to, rt.def.fall.arrive, rt.id, 'fall'); return; }
        YN.audio.sfx('stun'); G.addTime(-10); s.px = s.safe[0]; s.py = s.safe[1] - 2; s.vx = 0; s.vy = 0; YN.render.cam.shake = 0.6;
      }
    },

    updateFps: function (G, rt, dt) {
      var p = G.player, P = p.fps, I = YN.input;
      if (G.trans || G.state === 'capture') return;
      var turn = 2.4 * dt, spd = 2.7 * dt * YN.effects.speed(G.equipped()) * (I.held('run') ? 1.5 : 1);
      if (I.held('left')) P.a -= turn;
      if (I.held('right')) P.a += turn;
      var mv = 0;
      if (I.held('up')) mv = 1;
      if (I.held('down')) mv = -0.7;
      p.moving = mv !== 0;
      if (mv) {
        var dx = Math.cos(P.a) * spd * mv, dy = Math.sin(P.a) * spd * mv, r = 0.22;
        var tryAt = function (x, y) {
          var tx = Math.floor(x), ty = Math.floor(y);
          var m = rt.markAt(tx, ty);
          if (m && m.solid && YN.DOOR_TYPES[m.type]) { G.useDoor(m); return false; }
          return rt.passable(tx, ty, 'player', G.caps());
        };
        if (tryAt(P.x + dx + U.sign(dx) * r, P.y)) P.x += dx;
        if (tryAt(P.x, P.y + dy + U.sign(dy) * r)) P.y += dy;
      }
      var a = U.mod(P.a, Math.PI * 2);
      p.dir = a < Math.PI / 4 || a > Math.PI * 7 / 4 ? 'right' : a < Math.PI * 3 / 4 ? 'down' : a < Math.PI * 5 / 4 ? 'left' : 'up';
      var nx = Math.floor(P.x), ny = Math.floor(P.y);
      p.fx = P.x - 0.5; p.fy = P.y - 0.5;
      if (nx !== p.x || ny !== p.y) { p.x = nx; p.y = ny; p.stepN++; G.lastStep = { dir: p.dir, n: p.stepN, x: nx, y: ny }; G.onStep(); }
    }
  };

  /* pas en vue de côté : sons et marques au sol */
  YN.bus.on('boot', function () {
    YN.game.onStepSide = function () {
      var G = YN.game, rt = G.rt, p = G.player;
      rt.marksAt(p.x, p.y).forEach(function (m) {
        if (m.type === 'trigger' && (!m.state.fired || m.def.repeat) && (!m.def.cond || YN.cond.check(m.def.cond))) { m.state.fired = true; YN.act.run(m.def.use || m.def.do, { mark: m }); }
        if ((m.type === 'item' || m.type === 'cookie') && !m.state.taken) G.useMark(m);
        if (m.type === 'path' && (!m.def.cond || YN.cond.check(m.def.cond))) G.useDoor(m);
      });
      YN.world.mechCall(rt, 'onStep', p.x, p.y);
      if (p.side.ground && p.stepN % 2) YN.audio.sfx('step_floor', { vol: 0.35 });
      if (G.state === 'dream' && YN.input.held('run')) G.noise(p.x, p.y, 1.2, 'run');
    };
    YN.game.markOverlap = function () {
      var G = YN.game, s = G.player.side, rt = G.rt;
      var tx = Math.floor((s.px + 8) / 16), ty = Math.floor((s.py + 12) / 16);
      return rt.markAt(tx, ty) || rt.markAt(tx, ty + 1) || null;
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
