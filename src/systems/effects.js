/* =========================================================================
 *  Effets : un seul équipé à la fois. Il donne des capacités (caps),
 *  modifie vitesse / bruit / lumière / apparence, et possède une action (F).
 *  Les mondes et les marques réagissent via onEffect / mech.onEffect.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var E = YN.effects = {
    def: function (id) { return YN.effectById(id); },
    caps: function (id) {
      var d = E.def(id), c = {};
      if (d && d.caps) d.caps.forEach(function (k) { c[k] = true; });
      if (YN.game && YN.game.player) {
        var p = YN.game.player;
        if (p.floating) c.float = true;
        if (p.small) c.small = true;
      }
      // la corruption de niveau 3+ peut inverser un effet (règle annoncée par l'icône qui tremble)
      if (d && YN.game && YN.game.rt && YN.game.rt.corrLevel >= 3 && d.invertable !== false && YN.game.effectInverted) {
        if (c.swim) { delete c.swim; }
        if (c.reveal) { delete c.reveal; }
      }
      if (YN.game && YN.game.effectSuppressed > 0) return {};
      return c;
    },
    speed: function (id) { var d = E.def(id); return d && d.speed ? d.speed : 1; },
    noise: function (id) { var d = E.def(id); return d && d.noise !== undefined ? d.noise : 1; },
    light: function (id) { var d = E.def(id); if (!d || !d.light) return 0; if ((d.action === 'lantern' || d.action === 'glow') && !(YN.game && YN.game.player.lampOn)) return 0; return d.light; },
    stealth: function (id) { var d = E.def(id); return d && d.stealth ? d.stealth : 0; },

    /* ---------- actions (touche F) ---------- */
    use: function () {
      var G = YN.game, id = G.equipped();
      if (!id) { G.toast('…'); return; }
      if (G.effectSuppressed > 0) { YN.audio.sfx('error'); G.toast('…'); return; }
      var d = E.def(id), rt = G.rt, f = G.facing();
      var target = rt.markAt(f[0], f[1]), ent = rt.entAt(f[0], f[1]);
      // réactions spécifiques d'abord : marque visée, PNJ visé, mécaniques du monde
      if (target && target.def.onEffect && target.def.onEffect[id]) { YN.act.run(target.def.onEffect[id], { mark: target, effect: id }); return; }
      if (ent && ent.def.reacts && ent.def.reacts[id]) { YN.entities.react(ent, id); return; }
      if (YN.world.mechCall(rt, 'onEffect', id, d.action, { x: f[0], y: f[1], mark: target, ent: ent })) return;
      var fn = E.actions[d.action];
      if (fn) fn(G, d, f, target, ent);
      else { YN.audio.sfx('menu_move'); G.toast('…'); }
    },
    actions: {
      none: function (G) { G.toast('…'); },
      plant: function (G, d, f) {
        var rt = G.rt, ch = rt.tile(f[0], f[1]), info = YN.tileInfo(ch);
        if (info.soil) {
          rt.setTemp(f[0], f[1], '*', 'plant'); YN.audio.sfx('reveal');
          YN.render.addFx({ type: 'spark', x: f[0], y: f[1], life: 0.8, color: '#9fe07a' });
          // une pousse sur la terre fait grandir une liane vers le trou ou l'eau le plus proche dans la même direction
          var dx = f[0] - G.player.x, dy = f[1] - G.player.y, grown = 0;
          for (var k = 1; k <= 6; k++) {
            var tx = f[0] + dx * k, ty = f[1] + dy * k, c2 = YN.tileInfo(rt.tile(tx, ty));
            if (c2.pit || c2.water) { rt.setTemp(tx, ty, 'v', 'plant'); grown++; } else break;
          }
          if (grown) G.toast('The sprout stretches out.');
          YN.bus.emit('planted', f[0], f[1]);
        } else { YN.audio.sfx('menu_move'); G.toast('Nothing grows here.'); }
      },
      whistle: function (G) { YN.audio.sfx('whistle', { seq: [0, 5, 3] }); G.noise(G.player.x, G.player.y, 4, 'whistle'); YN.render.addFx({ type: 'note', x: G.player.x, y: G.player.y, life: 1.2 }); YN.bus.emit('whistle'); },
      melody: function (G) { if (YN.ui && YN.ui.notepad) YN.ui.notepad.open(); },
      lantern: function (G) { G.player.lampOn = !G.player.lampOn; YN.audio.sfx('switch'); G.lightChanged(); },
      glow: function (G) { G.player.lampOn = !G.player.lampOn; YN.audio.sfx(G.player.lampOn ? 'soul' : 'switch', { vol: 0.4 }); G.lightChanged(); },
      /* flair : indique l'artefact encore caché le plus proche dans ce monde */
      sense: function (G) {
        var rt = G.rt, p = G.player, best = null, bd = 1e9;
        rt.marks.forEach(function (m) { if (!m.active || m.type !== 'effect' || !m.def.give || YN.save.hasEffect(m.def.give) || YN.save.isEgg(m.def.give)) return; var d = U.dist(m.x, m.y, p.x, p.y); if (d < bd) { bd = d; best = m; } });
        YN.audio.sfx('whistle', { seq: [0, 3] });
        if (!best) { G.toast('Nothing hidden around here.'); return; }
        var dx = best.x - p.x, dy = best.y - p.y, dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        p.dir = dir; YN.render.addFx({ type: 'wisp', x: p.x, y: p.y, dir: dir, life: 1.8 });
        G.toast(bd < 4 ? 'Very close.' : bd < 12 ? 'Not far.' : 'Far, that way.');
      },
      ring: function (G) {
        YN.audio.sfx('bell'); G.noise(G.player.x, G.player.y, 8, 'bell');
        YN.render.addFx({ type: 'ring', x: G.player.x, y: G.player.y, life: 1, r: 60 });
        G.rt.ents.forEach(function (e) { if (U.dist(e.x, e.y, G.player.x, G.player.y) < 7) { e.faceTo = [G.player.x, G.player.y]; if (e.def.onBell) YN.act.run(e.def.onBell, { ent: e }); } });
        YN.bus.emit('bell');
      },
      call: function (G) { if (YN.ui && YN.ui.dialpad) YN.ui.dialpad.open(); },
      draw: function (G, d, f) {
        var rt = G.rt, ch = rt.tile(f[0], f[1]), info = YN.tileInfo(ch);
        if (info.board) {
          var link = (rt.def.boards && rt.def.boards[f[0] + ',' + f[1]]) || rt.def.boardTo;
          if (!link) { G.toast('The chalk squeaks. The drawing rubs itself out.'); YN.audio.sfx('chalk'); return; }
          YN.audio.sfx('chalk');
          var m = YN.world.addMark(rt, { type: 'door', to: link.to || link, arrive: link.arrive, look: 'door', lookOpt: { style: 'shoji', c: ['#e8e8e8'] }, id: 'chalkdoor' + f[0] + '_' + f[1] }, f[0], f[1], null);
          m.solid = true; rt.setTemp(f[0], f[1], '.', 'chalk');
          G.toast('A door holds on the board.');
        } else { YN.audio.sfx('chalk'); G.toast('The chalk won’t take.'); }
      },
      erase: function (G, d, f) {
        var rt = G.rt, ch = rt.tile(f[0], f[1]), info = YN.tileInfo(ch);
        if (info.paper || info.seam || info.board) { rt.setTemp(f[0], f[1], info.board ? 'b' : '.', 'erase'); YN.audio.sfx('erase'); YN.render.addFx({ type: 'spark', x: f[0], y: f[1], life: 0.6, color: '#f0e0e8' }); YN.bus.emit('erased', f[0], f[1]); }
        else { YN.audio.sfx('erase'); G.toast('Nothing to erase.'); }
      },
      float: function (G) { G.player.floating = !G.player.floating; YN.audio.sfx(G.player.floating ? 'jump' : 'land'); },
      hide: function (G) { G.player.hiding = !G.player.hiding; YN.audio.sfx('hidden'); if (G.player.hiding) G.toast('…'); },
      reveal: function (G) {
        YN.audio.sfx('reveal'); G.revealUntil = YN.game.clock + 4;
        YN.render.addFx({ type: 'ring', x: G.player.x, y: G.player.y, life: 1.2, r: 90, color: 'rgba(160,255,220,0.8)' });
        G.rt.marks.forEach(function (m) { if (m.def.hiddenUntilReveal && U.dist(m.x, m.y, G.player.x, G.player.y) < 9) { m.revealed = true; YN.render.addFx({ type: 'reveal', x: m.x, y: m.y, life: 2 }); } });
        YN.bus.emit('reveal');
      },
      read: function (G) { G.toast('…'); },
      ribbon: function (G) {
        if (G.rt.id === 'NEXUS') { G.toast('…'); return; }
        if (YN.witches && YN.witches.nearestDist(G.rt.id, G.player.x, G.player.y) < 4) { YN.audio.sfx('error'); G.toast('The ribbon won’t come undone.'); return; }
        YN.audio.sfx('sleep'); G.warp('NEXUS', null, 'ribbon');
      },
      stopTime: function (G) {
        if (G.frozenUntil > G.clock - 15) { YN.audio.sfx('error'); return; }
        G.frozenUntil = G.clock + 5; YN.audio.sfx('clock_tick'); YN.render.addFx({ type: 'flash', life: 0.4, a: 0.3, color: '#f0e0b0' }); YN.bus.emit('timeStop');
      },
      echo: function (G) { YN.audio.sfx('echo'); G.noise(G.player.x, G.player.y, 5, 'shout'); YN.render.addFx({ type: 'walls', x: G.player.x, y: G.player.y, life: 2.2, r: 8 }); YN.bus.emit('echo'); },
      stamp: function (G) { YN.audio.sfx('stamp'); G.toast('APPROVED.'); },
      water: function (G, d, f) {
        var rt = G.rt, info = YN.tileInfo(rt.tile(f[0], f[1]));
        YN.audio.sfx('splash');
        if (info.soil || rt.tile(f[0], f[1]) === '*') { rt.setTemp(f[0], f[1], '*', 'water'); YN.render.addFx({ type: 'spark', x: f[0], y: f[1], life: 0.8, color: '#9fe07a' }); }
      },
      hug: function (G) { YN.audio.sfx('breath'); G.player.hugging = !G.player.hugging; },
      hop: function (G) { G.hop(2); },
      roll: function (G) { var n = 1 + Math.floor(Math.random() * 6); YN.audio.sfx('coin'); G.toast(String(n)); YN.save.temp('lastRoll', n); YN.bus.emit('roll', n); },
      compass: function (G) {
        var t = G.rt.def.compass ? YN.world.resolveAt(G.rt, G.rt.def.compass) : null;
        if (!t) { G.toast('The needle spins and spins.'); return; }
        var dx = t[0] - G.player.x, dy = t[1] - G.player.y, dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        G.player.dir = dir; YN.render.addFx({ type: 'wisp', x: G.player.x, y: G.player.y, dir: dir, life: 1.6, color: '#d8e8ff' });
      },
      token: function (G) { G.toast('…'); },
      mirror: function (G) {
        YN.audio.sfx('glass');
        var found = YN.witches ? YN.witches.revealCopy(G.rt.id) : false;
        G.mirrorUntil = G.clock + 5;
        if (!found) G.toast('She sees herself. A little late.');
      },
      radio: function (G) { if (YN.ui && YN.ui.radio) YN.ui.radio.open(); },
      meow: function (G) { YN.audio.sfx('meow'); G.noise(G.player.x, G.player.y, 2, 'meow'); YN.bus.emit('meow'); },
      photo: function (G) { YN.audio.sfx('switch'); YN.render.addFx({ type: 'flash', life: 0.25, a: 0.5 }); G.photoAt = G.clock; if (YN.witches) YN.witches.revealCopy(G.rt.id); YN.bus.emit('photo'); },
      rewind: function (G) { G.rewind(); },
      decoy: function (G) { G.decoy = { world: G.rt.id, x: G.player.x, y: G.player.y, until: G.clock + 6 }; YN.audio.sfx('reveal'); },
      shout: function (G) { YN.audio.sfx('echo'); G.noise(G.player.x, G.player.y, 12, 'shout'); YN.bus.emit('shout'); },
      cry: function (G) { YN.audio.sfx('breath'); G.player.crying = G.clock + 4; YN.bus.emit('cry'); },
      breath: function (G) { G.holdBreath = G.clock + 5; YN.audio.sfx('breath'); },
      gravity: function (G) { G.player.gravFlip = !G.player.gravFlip; YN.audio.sfx('reveal'); },
      thread: function (G) {
        if (!G.thread || G.thread.world !== G.rt.id) { G.thread = { world: G.rt.id, x: G.player.x, y: G.player.y }; G.toast('The thread is tied here.'); }
        else { var t = G.thread; var td = Math.abs(t.x - G.player.x) > Math.abs(t.y - G.player.y) ? (t.x > G.player.x ? 'right' : 'left') : (t.y > G.player.y ? 'down' : 'up'); G.player.dir = td; YN.render.addFx({ type: 'wisp', x: G.player.x, y: G.player.y, dir: td, life: 1.5, color: '#f04060' }); }
      },
      fold: function (G) {
        if (!G.fold || G.fold.world !== G.rt.id) { G.fold = { world: G.rt.id, x: G.player.x, y: G.player.y }; YN.audio.sfx('paper'); G.toast('A fold.'); }
        else { var f2 = G.fold; G.fold = null; YN.audio.sfx('paper'); G.placePlayer(f2.x, f2.y); }
      },
      lightswitch: function (G) {
        var r = YN.save.dream.room; r.light = !r.light; YN.save.perm.room.light = r.light;
        YN.audio.sfx('mother_click'); G.lightChanged(); G.rebuildWorld();
      },
      sing: function (G) { if (YN.ui && YN.ui.notepad) YN.ui.notepad.open(); G.noise(G.player.x, G.player.y, 6, 'sing'); },
      tv: function (G) { YN.bus.emit('remote'); YN.audio.sfx('static'); },
      clap: function (G) { YN.audio.sfx('laugh'); G.noise(G.player.x, G.player.y, 5, 'laugh'); YN.bus.emit('laugh'); G.rt.ents.forEach(function (e) { if (e.def.onLaugh && U.dist(e.x, e.y, G.player.x, G.player.y) < 8) YN.act.run(e.def.onLaugh, { ent: e }); }); },
      shadow: function (G) { G.shadowSent = { world: G.rt.id, x: G.facing()[0], y: G.facing()[1], until: G.clock + 6 }; YN.audio.sfx('hidden'); YN.bus.emit('shadow', G.shadowSent); },
      statue: function (G) { G.player.statue = !G.player.statue; YN.audio.sfx('stamp'); },
      smell: function (G) { G.smellUntil = G.clock + 6; YN.audio.sfx('breath'); },
      scout: function (G) { G.scoutUntil = G.clock + 6; G.camOverride = null; YN.audio.sfx('reveal'); },
      weather: function (G) { var w = G.rt.weather; var order = ['clear', 'rain', 'snow']; var cur = w.snow ? 'snow' : w.rain ? 'rain' : 'clear'; var nx = order[(order.indexOf(cur) + 1) % 3]; w.snow = nx === 'snow'; w.rain = nx === 'rain'; YN.audio.sfx('wind_gust'); YN.bus.emit('weather', nx); },
      knob: function (G, d, f, target) { if (target && YN.DOOR_TYPES[target.type]) { target.unlockedByKnob = true; YN.audio.sfx('door'); G.toast('The handle turns.'); } else G.toast('…'); },
      puppet: function (G, d, f, t, ent) { if (ent) { ent.puppet = G.clock + 8; YN.audio.sfx('reveal'); G.toast(ent.def.name + ' watches her every move.'); } else G.toast('…'); },
      write: function (G) { if (YN.ui && YN.ui.speak) YN.ui.speak.open('write'); },
      ascii: function (G) { if (YN.debug) YN.debug.toggleAscii(true); }
    },

    /* apparence de la joueuse selon l'effet */
    look: function (id) {
      var d = E.def(id); if (!d) return {};
      return { form: d.form || null, acc: d.acc || null, pal: d.pal || null, palKey: d.pal ? id : '', fx: d.fx || null };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
