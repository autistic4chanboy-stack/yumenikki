/* =========================================================================
 *  PNJ et entités : apparition conditionnelle, comportements, réactions
 *  aux effets, paroles, entités invisibles (voix, ombres), hostiles
 *  (qui volent du temps ou déplacent — elles n'attrapent jamais).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  var EN = YN.entities = {
    /* toutes les définitions présentes dans un monde */
    defsFor: function (worldId) {
      var out = [], def = YN.data.worlds[worldId];
      (def.npcs || []).forEach(function (n) {
        var ed = YN.data.entities[n.id];
        if (!ed) { YN.warn(worldId + ': unknown NPC ' + n.id); return; }
        out.push({ def: ed, at: n.at || ed.at, appear: n.appear });
      });
      U.keys(YN.data.entities).forEach(function (id) {
        var ed = YN.data.entities[id];
        if (ed.world === worldId && ed.at !== undefined && !(def.npcs || []).some(function (n) { return n.id === id; })) out.push({ def: ed, at: ed.at, appear: null });
        if (ed.worlds && ed.worlds[worldId] !== undefined && !(def.npcs || []).some(function (n) { return n.id === id; })) { // jamais deux fois le même
          var w = ed.worlds[worldId];
          out.push({ def: ed, at: w.at !== undefined ? w.at : w, appear: w.appear || null, lines: w.lines, behavior: w.behavior });
        }
      });
      return out;
    },
    /* la partie du lieu qu'on atteint sans passer par un faux mur (calculée une fois par construction) */
    inOpenRegion: function (rt, p, def) {
      if (!rt.fake || rt.inf || /^(swim|fly)$/.test(def.behavior || '')) return true;
      if (!rt._openRegion) {
        var w = rt.w, h = rt.h, PG = YN.world.passGrid(rt, 'npc'), seen = new Uint8Array(w * h), back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0], a;
        try { a = YN.world.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos; } catch (e) { a = null; }
        if (!a || a[0] < 0 || a[1] < 0 || a[0] >= w || a[1] >= h) return true;
        var q = [a], qi = 0; seen[a[1] * w + a[0]] = 1;
        while (qi < q.length) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var nx = c[0] + [1, -1, 0, 0][k], ny = c[1] + [0, 0, 1, -1][k]; if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; var kk = ny * w + nx; if (seen[kk] || !PG[kk]) continue; seen[kk] = 1; q.push([nx, ny]); } }
        rt._openRegion = seen;
      }
      return rt._openRegion[p[1] * rt.w + p[0]] === 1;
    },
    spawnFor: function (rt) {
      EN.defsFor(rt.id).forEach(function (s, i) {
        var at = YN.world.resolveAt(rt, s.at, 100 + i);
        // un habitant immobile posé au hasard ne doit pas boucher un couloir
        if (at && !rt.inf && typeof s.at === 'string' && s.at.indexOf('random') === 0 && YN.world.choke) {
          // ni dans un couloir étroit (il le boucherait), ni dans une pièce secrète (derrière un mur qu'elle seule traverse)
          var bad = function (p) { return (s.def.solid !== false && YN.world.choke(rt, p[0], p[1])) || !EN.inOpenRegion(rt, p, s.def); };
          for (var k = 1; k < 40 && bad(at); k++) { var a2 = YN.world.resolveAt(rt, s.at, 100 + i + k * 37); if (a2) at = a2; }
        }
        if (!at) { if (s.at !== undefined) YN.warn(rt.id + ': position not found for ' + s.def.id); return; }
        if (!rt.inf && !YN.tileInfo(rt.tile(at[0], at[1])).pass && !(s.def.behavior === 'swim' || s.def.behavior === 'fly')) at = YN.world.nearestOpen(rt, at[0], at[1]);
        var e = EN.add(rt, s.def, at[0], at[1], { appear: s.appear, lines: s.lines, behavior: s.behavior });
        // un corps qu'on voit (personne, animal au sol) se heurte ; seuls fantômes, insectes volants, poissons… se traversent.
        // Un habitant immobile reste traversable s'il est posé dans un passage étroit.
        if (s.def.solid === false && EN.bodyLike(s.def, e.behavior)) e.solid = !(e.behavior === 'static' && !rt.inf && YN.world.choke && YN.world.choke(rt, at[0], at[1]));
      });
    },
    add: function (rt, ed, x, y, o) {
      o = o || {};
      var e = {
        def: ed, id: ed.id, x: x, y: y, fx: x, fy: y, hx: x, hy: y, dir: ed.dir || 'down',
        moving: false, mt: 0, from: null, to: null, timer: Math.random() * 2, frame: 0,
        visible: true, alphaNow: ed.alpha === undefined ? 1 : ed.alpha, solid: ed.solid !== false,
        behavior: o.behavior || ed.behavior || 'static', appear: o.appear || ed.appear || null, lines: o.lines || null,
        state: U.copy(ed.state || {}), talkCount: 0, hostileCd: 0, pathI: 0, frozen: false
      };
      if (ed.invisible || ed.kind === 'voice') { e.solid = false; e.alphaNow = 0; }
      rt.ents.push(e);
      return e;
    },
    reeval: function (rt, first) {
      rt.ents.forEach(function (e) {
        var ok = !e.appear || YN.cond.check(e.appear, { ent: e });
        if (ok && e.def.appear && e.appear !== e.def.appear) ok = YN.cond.check(e.def.appear, { ent: e });
        if (e.def.goneIf && YN.cond.check(e.def.goneIf, { ent: e })) ok = false;
        if (e.def.dayOnly && YN.cond.roomFelt(rt.depth).dark) ok = false;
        if (e.def.nightOnly && !YN.cond.roomFelt(rt.depth).dark) ok = false;
        if (e.def.snowOnly && !YN.cond.roomFelt(rt.depth).snow) ok = false;
        if (e.def.noSnow && YN.cond.roomFelt(rt.depth).snow) ok = false;
        if (e.deleted) ok = false;
        if (!first && ok !== e.present) YN.bus.emit('entToggle', rt, e, ok);
        e.present = ok;
        e.visible = ok && !(e.def.invisible || e.def.kind === 'voice');
        if (!ok) e.alphaNow = 0;
      });
    },
    /* taille du corps (en cases), mesurée sur le dessin : sert aux collisions et à la portée pour parler.
       (« radius » dans les fiches est le rayon de promenade, pas la taille.) */
    body: function (e) {
      var look = e.state.look || e.def.look || { t: 'humanoid' };
      if (e._bodyLook === look && e._body !== undefined) return e._body;
      var r = 0.28;
      if (e.def.body !== undefined) r = e.def.body;
      else {
        var key = JSON.stringify(look), c = EN._bodies[key];
        if (c === undefined) {
          c = 0.28;
          try {
            var img = YN.spr.creature(look, 0, {}), w = img.width, h = img.height, x = img.getContext && img.getContext('2d');
            if (x && x.getImageData && w > 0 && h > 0) {
              var y0 = Math.floor(h * 0.55), d = x.getImageData(0, y0, w, h - y0).data, minX = w, maxX = -1;
              for (var yy = 0; yy < h - y0; yy++) for (var xx = 0; xx < w; xx++) if (d[(yy * w + xx) * 4 + 3] > 80) { if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; }
              if (maxX >= minX) c = U.clamp((maxX - minX + 1) / YN.terrain.tpx * 0.42, 0.22, 0.95);
            }
          } catch (ex) { c = 0.28; }
          EN._bodies[key] = c;
        }
        r = c;
      }
      e._bodyLook = look; e._body = r;
      return r;
    },
    _bodies: {},
    bodyLike: function (ed, beh) {
      var t = (ed.look && ed.look.t) || 'humanoid';
      if (ed.invisible || ed.kind === 'voice' || ed.kind === 'ghost' || ed.passThrough) return false;
      if (/^(ghost|moth|bee|jelly|fish|whale|bird|butterfly|wisp|shadow)$/.test(t)) return false;
      return !/^(fly|swim|mimic|orbit|follow)$/.test(beh || ed.behavior || 'static');
    },
    creep: function (e, dist, G, dt) {
      var p = G.player, max = 1.2;
      if (dist > 9 || !e.visible) { e.jx = (e.jx || 0) * Math.max(0, 1 - dt * 2); e.jy = (e.jy || 0) * Math.max(0, 1 - dt * 2); return; }
      if (G.isLookingAt(e.x, e.y)) return;
      var dx = p.px - (e.fx + 0.5), dy = p.py - (e.fy + 0.9), l = Math.sqrt(dx * dx + dy * dy) || 1, sp = dt * 0.9;
      var nx = (e.jx || 0) + dx / l * sp, ny = (e.jy || 0) + dy / l * sp, m = Math.sqrt(nx * nx + ny * ny);
      if (m > max) { nx *= max / m; ny *= max / m; }
      if (l < 1.3) return; // jamais sur elle
      e.jx = nx; e.jy = ny;
    },
    sprite: function (e, fr) {
      var look = e.state.look || e.def.look || { t: 'humanoid' };
      if (e.disguise) look = e.disguise;
      if (look.t === 'witchsprite') return YN.spr.witch(look.id, fr);
      e.phase = (e.phase || 0);
      return YN.spr.creature(look, look.anim === 'still' ? 0 : fr % 4, { moving: e.moving, phase: e.moving ? e.mt : 0, flip: e.dir === 'left' && !e.def.noFlip });
    },

    /* ---------- mise à jour ---------- */
    update: function (rt, dt, G) {
      var p = G.player;
      for (var i = 0; i < rt.ents.length; i++) {
        var e = rt.ents[i];
        if (!e.present) continue;
        var dist = U.dist(e.fx, e.fy, p.fx, p.fy);
        // apparence dynamique
        var target = 1;
        if (e.def.invisible || e.def.kind === 'voice') target = 0;
        if (e.behavior === 'shy' && dist < (e.def.shyDist || 3)) target = 0;
        if (e.def.onlyStill && G.player.moving) target = 0;
        if (e.def.lookOnly && !G.isLookingAt(e.x, e.y)) target = Math.max(0, target - 1);
        if (e.def.mirrorOnly) target = G.mirrorUntil > G.clock ? 1 : 0;
        if (e.def.alpha !== undefined) target *= e.def.alpha;
        if (e.def.flicker) target *= (Math.sin(YN.render.t * 9 + i) > -0.3 ? 1 : 0.2);
        e.alphaNow += (target - e.alphaNow) * Math.min(1, dt * 4);
        e.visible = e.alphaNow > 0.02 || e.def.kind === 'voice';
        // s'approche quand on ne le regarde pas, se fige quand on le regarde (seulement l'image : son corps reste où il est)
        var lkc = e.state.look || e.def.look; if (lkc && lkc.fx && lkc.fx.creep) EN.creep(e, dist, G, dt);
        // voix : parle quand on approche
        if (e.def.kind === 'voice' || e.def.ambientLines) {
          e.timer -= dt;
          if (dist < (e.def.hearDist || 5) && e.timer <= 0) {
            e.timer = e.def.ambientEvery || 6 + Math.random() * 4;
            var al = e.def.ambientLines || e.def.lines;
            if (al && al.length && YN.speech) YN.speech.npcBubble(e, al[Math.floor(Math.random() * al.length)]);
          }
        }
        if (dist > 26 && !e.def.alwaysActive) continue; // activation par distance
        if (G.frozenUntil > G.clock && !e.def.timeless) continue;
        if (e.frozenByP || e.frozenByC) continue;
        if (e.puppet > G.clock) { EN.puppetMove(rt, e, G, dt); continue; }
        // déplacement en cours
        if (e.moving) {
          e.mt += dt * (e.def.speed || 2.2);
          var k = Math.min(1, e.mt);
          e.fx = U.lerp(e.from[0], e.to[0], k); e.fy = U.lerp(e.from[1], e.to[1], k);
          if (rt.wrap) { e.fx = e.from[0] + (Rwrap(e.to[0] - e.from[0], rt.w)) * k; e.fy = e.from[1] + (Rwrap(e.to[1] - e.from[1], rt.h)) * k; }
          if (k >= 1) { e.moving = false; e.fx = e.x; e.fy = e.y; e.mt = 0; }
          continue;
        }
        e.timer -= dt;
        if (!e.paused) EN.behave(rt, e, G, dist, dt);
        // contact hostile
        if ((e.def.hostile || e.hostileOverride) && e.hostileCd <= 0 && dist < 1.05 && !p.hiding && !G.invulnerable()) { EN.hostileTouch(e, G); e.hostileCd = 4; }
        if (e.hostileCd > 0) e.hostileCd -= dt;
      }
    },
    behave: function (rt, e, G, dist, dt) {
      var p = G.player, b = e.behavior;
      if (e.state.following) b = 'follow';
      if (e.def.face !== false && dist < 4 && (b === 'static' || b === 'watcher')) e.dir = EN.dirTo(e, p.x, p.y);
      if (b === 'turnaway' && dist < 6) { var d0 = EN.dirTo(e, p.x, p.y); e.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[d0]; }
      if (e.timer > 0) return;
      var r = e.def.radius || 3;
      switch (b) {
        case 'wander': {
          e.timer = 0.8 + Math.random() * 2.2;
          var ds = U.shuffle(['up', 'down', 'left', 'right']);
          for (var i = 0; i < 4; i++) { var dd = DIRS[ds[i]]; var nx = e.x + dd[0], ny = e.y + dd[1]; if (Math.abs(nx - e.hx) <= r && Math.abs(ny - e.hy) <= r && EN.free(rt, e, nx, ny, G)) { EN.step(rt, e, ds[i]); break; } }
          break; }
        case 'patrol': {
          var path = e.def.path; if (!path || !path.length) break;
          var tgt = path[e.pathI % path.length];
          if (e.x === tgt[0] && e.y === tgt[1]) { e.pathI++; e.timer = e.def.pause || 0.3; break; }
          var dir = EN.dirTo(e, tgt[0], tgt[1]); var dv = DIRS[dir];
          if (EN.free(rt, e, e.x + dv[0], e.y + dv[1], G)) EN.step(rt, e, dir); else e.timer = 0.6;
          break; }
        case 'follow': {
          e.timer = 0.15;
          if (dist > 1.5) { var fd = EN.pathDir(rt, e, p.x, p.y, G); if (fd) EN.step(rt, e, fd); }
          break; }
        case 'flee': {
          e.timer = 0.3;
          if (dist < (e.def.fleeDist || 4)) {
            var away = ['up', 'down', 'left', 'right'].map(function (d) { var v = DIRS[d]; return { d: d, s: U.dist(e.x + v[0], e.y + v[1], p.x, p.y) }; }).sort(function (a, b2) { return b2.s - a.s; });
            for (var j = 0; j < 4; j++) { var v2 = DIRS[away[j].d]; if (EN.free(rt, e, e.x + v2[0], e.y + v2[1], G) && Math.abs(e.x + v2[0] - e.hx) <= r * 2 && Math.abs(e.y + v2[1] - e.hy) <= r * 2) { EN.step(rt, e, away[j].d); break; } }
          }
          break; }
        case 'chase': {
          e.timer = e.def.chaseDelay || 0.45;
          if (dist < (e.def.sight || 6) && !p.hiding) { var cd = EN.pathDir(rt, e, p.x, p.y, G, true); if (cd) EN.step(rt, e, cd); }
          else if (Math.random() < 0.3) { var rd = U.shuffle(['up', 'down', 'left', 'right'])[0]; var rv = DIRS[rd]; if (EN.free(rt, e, e.x + rv[0], e.y + rv[1], G) && Math.abs(e.x + rv[0] - e.hx) <= r) EN.step(rt, e, rd); }
          break; }
        case 'statue': { // ne bouge que quand on ne la regarde pas
          e.timer = 0.5;
          if (!G.isLookingAt(e.x, e.y) && dist > 1.5 && dist < 12) { var sd = EN.pathDir(rt, e, p.x, p.y, G); if (sd) EN.step(rt, e, sd); }
          break; }
        case 'mimic': {
          e.timer = 0.05;
          if (G.lastStep && G.lastStep.n !== e.state.lastN) {
            e.state.lastN = G.lastStep.n;
            var md = e.def.mirror ? { up: 'up', down: 'down', left: 'right', right: 'left' }[G.lastStep.dir] : G.lastStep.dir;
            var mv = DIRS[md]; if (EN.free(rt, e, e.x + mv[0], e.y + mv[1], G)) EN.step(rt, e, md); else e.dir = md;
          }
          break; }
        case 'orbit': {
          e.timer = 0.5; var seq = ['right', 'down', 'left', 'up']; e.state.o = ((e.state.o || 0) + 1) % (r * 4);
          var od = seq[Math.floor(e.state.o / r) % 4], ov = DIRS[od]; if (EN.free(rt, e, e.x + ov[0], e.y + ov[1], G)) EN.step(rt, e, od);
          break; }
        case 'dance': { e.timer = 0.4; e.dir = ['down', 'left', 'up', 'right'][Math.floor(YN.render.t * 2.5) % 4]; break; }
        case 'swim': case 'fly': {
          e.timer = 0.5 + Math.random();
          var sds = U.shuffle(['up', 'down', 'left', 'right']);
          for (var q = 0; q < 4; q++) {
            var sv = DIRS[sds[q]], tx = e.x + sv[0], ty = e.y + sv[1], inf = YN.tileInfo(rt.tile(tx, ty));
            var ok = b === 'swim' ? (inf.water || inf.kind === 'shallow' || inf.lily) : !inf.void;
            if (ok && Math.abs(tx - e.hx) <= r && Math.abs(ty - e.hy) <= r && !(tx === p.x && ty === p.y)) { EN.step(rt, e, sds[q]); break; }
          }
          break; }
        case 'runner': {
          var rp = e.def.path || [];
          if (e.pathI >= rp.length) { e.deleted = true; e.present = false; e.visible = false; break; }
          var rt2 = rp[e.pathI];
          if (e.x === rt2[0] && e.y === rt2[1]) { e.pathI++; break; }
          var rdir = EN.dirTo(e, rt2[0], rt2[1]); EN.step(rt, e, rdir); e.timer = 0;
          break; }
        default: e.timer = 1;
      }
    },
    free: function (rt, e, x, y, G) {
      if (G.player.x === x && G.player.y === y && !e.def.hostile) return false;
      if (e.def.ghost) return !YN.tileInfo(rt.tile(x, y)).void;
      return rt.passable(x, y, 'npc', e.def.caps || {});
    },
    step: function (rt, e, dir) {
      var v = DIRS[dir]; e.dir = dir;
      var n = rt.norm(e.x + v[0], e.y + v[1]);
      e.from = [e.x, e.y]; e.to = n; e.x = n[0]; e.y = n[1]; e.moving = true; e.mt = 0;
      if (rt.wrap) { e.from = [e.fx, e.fy]; }
    },
    dirTo: function (e, x, y) {
      var dx = x - e.x, dy = y - e.y;
      if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
      return dy > 0 ? 'down' : 'up';
    },
    /* direction du premier pas vers une cible (BFS bornée) */
    pathDir: function (rt, e, tx, ty, G, allowPlayer) {
      var key = function (x, y) { return x + ',' + y; };
      var start = key(e.x, e.y), goal = key(tx, ty), prev = {}, q = [[e.x, e.y]], n = 0;
      prev[start] = null;
      while (q.length && n++ < 900) {
        var c = q.shift(), ck = key(c[0], c[1]);
        if (ck === goal) break;
        var order = ['up', 'down', 'left', 'right'];
        for (var i = 0; i < 4; i++) {
          var v = DIRS[order[i]], nx = c[0] + v[0], ny = c[1] + v[1], nk = key(nx, ny);
          if (nk in prev) continue;
          var isGoal = nk === goal;
          if (!isGoal && !rt.passable(nx, ny, 'npc', e.def.caps || {})) continue;
          if (isGoal && !allowPlayer && !(rt.passable(nx, ny, 'ghost', {}))) continue;
          prev[nk] = ck; q.push([nx, ny]);
        }
      }
      if (!(goal in prev)) return null;
      var k = goal, last = null;
      while (prev[k] !== null && prev[k] !== undefined) { last = k; k = prev[k]; if (k === start) break; }
      if (!last) return null;
      var p = last.split(','), dx = +p[0] - e.x, dy = +p[1] - e.y;
      if (dx === 1) return 'right'; if (dx === -1) return 'left'; if (dy === 1) return 'down'; if (dy === -1) return 'up';
      return null;
    },
    puppetMove: function (rt, e, G, dt) {
      e.timer -= dt; if (e.timer > 0 || e.moving) return;
      if (G.lastStep && G.lastStep.n !== e.state.pn) { e.state.pn = G.lastStep.n; var v = DIRS[G.lastStep.dir]; if (EN.free(rt, e, e.x + v[0], e.y + v[1], G)) EN.step(rt, e, G.lastStep.dir); }
    },
    hostileTouch: function (e, G) {
      var h = e.hostileOverride || e.def.hostile;
      YN.audio.sfx('stun'); YN.render.cam.shake = 0.6;
      if (h.kind === 'time') { G.addTime(-(h.amount || 30)); G.toast('…'); }
      else if (h.kind === 'trap') { G.warp(h.to, h.arrive, 'trap'); }
      else if (h.kind === 'push') { G.pushBack(e); }
      if (h.do) YN.act.run(h.do, { ent: e });
    },

    /* ---------- dialogue ---------- */
    talk: function (e, G) {
      var d = e.def;
      e.dir = EN.dirTo(e, G.player.x, G.player.y);
      YN.save.meetNpc(d.id);
      e.talkCount++;
      if (e.disguise && YN.witches) { YN.witches.copyRevealed(e); return; }
      if (d.silentTalk) { if (d.onTalk) YN.act.run(d.onTalk, { ent: e }); return; }
      if (d.onTalk) YN.act.run(d.onTalk, { ent: e });
      if (d.dialog && YN.dialogue) { YN.dialogue.start(d.dialog, e); return; }
      var lines = e.lines || d.lines;
      if (!lines || !lines.length) { if (YN.ui) YN.ui.dialog.queue([{ t: '…', who: d.name }], { ent: e }); return; }
      // lignes : tableau simple (on tourne) ou entrées conditionnelles { if, t }
      var pool = lines.filter(function (l) { return typeof l === 'string' || !l.if || YN.cond.check(l.if, { ent: e }); });
      if (!pool.length) pool = ['…'];
      var idx = d.sequential ? Math.min(pool.length - 1, YN.save.talks(d.id) - 1) : (YN.save.talks(d.id) - 1) % pool.length;
      var l = pool[Math.max(0, idx)];
      // une réplique conditionnelle qui fait avancer quelque chose passe en premier, une fois
      var beat = pool.filter(function (x) { return x && typeof x === 'object' && x.if && x.do && !YN.save.flag('beat:' + d.id + ':' + lines.indexOf(x)); })[0];
      if (beat) { l = beat; YN.save.setFlag('beat:' + d.id + ':' + lines.indexOf(beat), true); }
      var seq = Array.isArray(l) ? l : (l && l.seq ? l.seq : [l]);
      var withWho = seq.map(function (x) { var o = typeof x === 'string' ? { t: x } : Object.assign({}, x); if (!o.who) o.who = d.name; if (!o.lang && d.lang) o.lang = d.lang; if (!o.voice) o.voice = d.voice; return o; });
      if (YN.ui) YN.ui.dialog.queue(withWho, { ent: e });
      if (l && l.do) YN.act.run(l.do, { ent: e });
      YN.save.temp('lastNpcLine', U.norm(withWho[0].t || ''));
    },
    react: function (e, effectId) {
      var r = e.def.reacts[effectId];
      if (!r) return false;
      var lines = r.lines || (Array.isArray(r) ? r : null), acts = r.do;
      if (lines && YN.ui) YN.ui.dialog.queue(lines.map(function (x) { var o = typeof x === 'string' ? { t: x } : Object.assign({}, x); if (!o.who) o.who = e.def.name; if (!o.lang && e.def.lang) o.lang = e.def.lang; o.voice = o.voice || e.def.voice; return o; }), { ent: e });
      if (acts) YN.act.run(acts, { ent: e, effect: effectId });
      return true;
    },
    hear: function (e, text) {
      var hs = e.def.hears; if (!hs) return false;
      var t = U.norm(text);
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];
        if (h.if && !YN.cond.check(h.if, { ent: e })) continue;
        var match = (h.match || []).some(function (m) { var mm = U.norm(m); return h.exact ? t === mm : (t === mm || (' ' + t + ' ').indexOf(' ' + mm + ' ') >= 0 || (mm.length > 3 && t.indexOf(mm) >= 0)); });
        if (h.any) match = true;
        if (!match) continue;
        if (h.lines && YN.ui) YN.ui.dialog.queue(h.lines.map(function (x) { var o = typeof x === 'string' ? { t: x } : Object.assign({}, x); if (!o.who) o.who = e.def.name; if (!o.lang && e.def.lang) o.lang = e.def.lang; o.voice = o.voice || e.def.voice; return o; }), { ent: e });
        if (h.say && YN.speech) YN.speech.npcBubble(e, h.say);
        if (h.do) YN.act.run(h.do, { ent: e, said: text });
        if (h.dialog && YN.dialogue) YN.dialogue.start(h.dialog, e);
        return true;
      }
      return false;
    },
    /* sons positionnels des entités et marques proches */
    emitters: function (rt, G) {
      var out = [], p = G.player;
      rt.ents.forEach(function (e) {
        if (!e.present || !e.def.sound) return;
        var d = U.dist(e.x, e.y, p.x, p.y); if (d > 12) return;
        out.push({ id: rt.id + e.def.id, type: e.def.sound, pan: U.clamp((e.x - p.x) / 8, -1, 1), gain: (e.def.soundVol || 0.08) * (1 - d / 12) });
      });
      rt.marks.forEach(function (m) {
        if (!m.active || !m.def.sound) return;
        var d = U.dist(m.x, m.y, p.x, p.y); if (d > 12) return;
        out.push({ id: m.id, type: m.def.sound, pan: U.clamp((m.x - p.x) / 8, -1, 1), gain: (m.def.soundVol || 0.08) * (1 - d / 12) });
      });
      out.sort(function (a, b) { return b.gain - a.gain; });
      return out;
    }
  };
  function Rwrap(d, size) { return U.mod(d + size / 2, size) - size / 2; }
})(typeof window !== 'undefined' ? window : globalThis);
