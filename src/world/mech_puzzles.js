/* =========================================================================
 *  MÉCANIQUES D'ÉNIGMES GÉNÉRIQUES (paramétrées par chaque monde).
 *  Toutes acceptent : reward (actions), flag (drapeau posé à la réussite),
 *  done (condition « déjà résolu »), text (message de réussite).
 *  Signatures : init(rt,p,s) update(rt,s,p,dt) onInteract(rt,s,p,m)
 *               onStep(rt,s,p,x,y) onSpeak(rt,s,p,n) onMelody(rt,s,p,str)
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, M = YN.mech;
  function G() { return YN.game; }
  function say(l, c, d) { YN.mechUtil.say(l, c, d); }
  function solved(p) { return (p.flag && YN.save.flag(p.flag)) || (p.done && YN.cond.check(p.done)) || (p.give && (YN.save.hasEffect(p.give) || YN.save.isEgg(p.give))); }
  function win(rt, p, s, mark) {
    if (s) s.won = true;
    if (p.flag) YN.save.setFlag(p.flag, true);
    YN.audio.sfx(p.sfx || 'reveal');
    var after = function () { if (p.reward) YN.act.run(p.reward, { mark: mark }); if (p.give) G().giveEffect(p.give); if (p.text) G().toast(p.text); YN.world.reeval(rt); };
    if (p.winLines) say(p.winLines, { mark: mark }, after); else after();
  }
  function dist(a, b) { return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])); }
  YN.puzzle = { win: win, solved: solved };
  /* l'écho : une voix qui n'est pas la sienne, au-dessus d'elle */
  var echoSay = function (w) {
    var pl = G().player; YN.render.addFx({ type: 'note', x: pl.px - 0.5, y: pl.py - 1.6, life: 2.4, text: w, color: '#c8d8ff' });
    G().toast('“' + w + '”', 2.4);
  };

  /* --- interagir avec des marques dans un ordre donné ; option : elles sonnent dans cet ordre --- */
  M.sequence = {
    init: function (rt, p, s) { s.i = 0; s.t = 0; s.ringI = 0; },
    update: function (rt, s, p, dt) {
      if (!p.ring || solved(p) || s.won) return;
      s.t += dt; var every = p.ring.every || 1.6, pause = p.ring.pause || 4;
      var cyc = p.order.length * every + pause, k = U.mod(s.t, cyc), idx = Math.floor(k / every);
      if (idx < p.order.length && idx !== s.ringI) {
        s.ringI = idx; var m = rt.findMark(p.order[idx]);
        if (m && YN.mechUtil.near(rt, m, p.ring.hear || 14)) { YN.audio.sfx(p.ring.sfx || 'phone_ring', { vol: 0.35, note: idx * 2 }); YN.render.addFx({ type: 'note', x: m.x, y: m.y - 0.6, life: 1.2, text: p.ring.glyph || '♪', color: p.ring.color }); }
      } else if (idx >= p.order.length) s.ringI = -1;
    },
    onInteract: function (rt, s, p, m) {
      if (p.order.indexOf(m.key) < 0) return false;
      if (solved(p)) { if (p.doneLine) say([p.doneLine]); return true; }
      if (m.key === p.order[s.i]) {
        s.i++; YN.audio.sfx(p.okSfx || 'chime', { note: s.i * 2 });
        if (p.okLines && p.okLines[s.i - 1]) say([p.okLines[s.i - 1]], { mark: m });
        if (s.i >= p.order.length) { s.i = 0; win(rt, p, s, m); }
      } else {
        if (s.i > 0) YN.audio.sfx('menu_back');
        s.i = m.key === p.order[0] ? 1 : 0;
        if (p.wrongLine) say([p.wrongLine], { mark: m });
      }
      return !p.passThrough;
    }
  };

  /* --- marcher sur des dalles dans un ordre (p.plates : { 'x,y': rang }) --- */
  M.stepOrder = {
    init: function (rt, p, s) { s.i = 0; },
    onStep: function (rt, s, p, x, y) {
      var n = p.plates[x + ',' + y]; if (n === undefined || solved(p)) return;
      if (n === s.i) { s.i++; YN.audio.sfx('chime', { note: [0, 2, 4, 7, 9, 12, 14, 16][s.i % 8] }); YN.render.addFx({ type: 'ring', x: x, y: y, life: 0.6, r: 10, color: p.color || 'rgba(255,240,180,0.9)' }); if (s.i >= p.count) win(rt, p, s); }
      else if (n !== s.i - 1) { if (s.i > 0) YN.audio.sfx('menu_back'); s.i = n === 0 ? 1 : 0; }
    }
  };

  /* --- rester immobile (p.zone [x0,y0,x1,y1]) pendant p.secs ; option : seulement si cond --- */
  M.standStill = {
    init: function (rt, p, s) { s.t = 0; },
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      if (p.mark) { var zm = rt.findMark(p.mark); if (!zm) return; p.zone = [zm.x, zm.y, zm.x, zm.y]; }
      var pl = G().player, z = p.zone, inZ = pl.x >= z[0] && pl.y >= z[1] && pl.x <= z[2] && pl.y <= z[3];
      if (!inZ || pl.moving || (p.cond && !YN.cond.check(p.cond))) { if (s.t > 0.5 && p.breakLine && inZ) G().toast(p.breakLine); s.t = 0; return; }
      s.t += dt;
      if (p.tick && Math.floor(s.t) !== Math.floor(s.t - dt)) YN.audio.sfx(p.tick, { vol: 0.25 });
      if (s.t >= p.secs) win(rt, p, s);
    }
  };

  /* --- frapper n fois une marque en peu de temps --- */
  M.knock = {
    init: function (rt, p, s) { s.hits = []; },
    onInteract: function (rt, s, p, m) {
      if (m.key !== p.mark) return false;
      if (solved(p)) { if (p.doneLine) say([p.doneLine]); return true; }
      var now = G().clock; s.hits = s.hits.filter(function (t) { return now - t < (p.within || 2.5); }); s.hits.push(now);
      YN.audio.sfx(p.sfx || 'door_far', { vol: 0.5 }); YN.render.cam.shake = 0.15;
      if (s.hits.length >= (p.n || 3)) { s.hits = []; win(rt, p, s, m); return true; }
      if (s.hits.length === 1 && p.firstLine) say([p.firstLine]);
      return true;
    }
  };

  /* --- coincer un être qui fuit : il ne peut plus s'éloigner --- */
  M.corner = {
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      var e = rt.findEnt(p.ent); if (!e || !e.present) return;
      var pl = G().player;
      if (U.dist(e.fx, e.fy, pl.fx, pl.fy) > 1.25) { s.t = 0; return; }
      var free = 0;
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (d) {
        var nx = e.x + d[0], ny = e.y + d[1];
        if (U.dist(nx, ny, pl.x, pl.y) < U.dist(e.x, e.y, pl.x, pl.y)) return; // vers la joueuse : pas une fuite
        if (rt.passable(nx, ny, 'npc', e.def.caps || {})) free++;
      });
      if (free === 0) { s.t = (s.t || 0) + dt; if (s.t > 0.4) { e.present = false; e.visible = false; win(rt, p, s); } }
      else s.t = 0;
    }
  };

  /* --- attraper des êtres en les touchant (pas en courant) --- */
  M.catchN = {
    init: function (rt, p, s) {
      var k = p.key || ('catch_' + rt.id);
      s.n = YN.save.temp(k) || 0; s.ids = (YN.save.temp(k + ':ids') || []).slice();
      // celles déjà attrapées cette nuit ne reviennent pas (ni en revenant dans le monde, ni à la réévaluation)
      rt.ents.forEach(function (e) { if (s.ids.indexOf(e.def.id) >= 0) { e.deleted = true; e.present = false; e.visible = false; } });
    },
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      var pl = G().player, run = YN.input.held('run'), k = p.key || ('catch_' + rt.id);
      rt.ents.forEach(function (e) {
        if ((p.prefix && e.def.id.indexOf(p.prefix) !== 0) || (p.tag && e.def.tag !== p.tag)) return;
        if (s.ids.indexOf(e.def.id) >= 0) { if (!e.deleted) { e.deleted = true; e.present = false; e.visible = false; } return; } // déjà attrapée cette nuit
        if (!e.present || e.deleted) return;
        if (U.dist(e.fx, e.fy, pl.fx, pl.fy) > 0.75) return;
        if (run && p.noRun) { if (!e.state.fled) { e.state.fled = true; G().toast(p.runLine || '…'); } return; }
        e.deleted = true; e.present = false; e.visible = false; s.n++; s.ids.push(e.def.id);
        YN.save.temp(k, s.n); YN.save.temp(k + ':ids', s.ids.slice());
        YN.audio.sfx(p.sfx || 'chime', { note: s.n }); YN.render.addFx({ type: 'spark', x: e.x, y: e.y, life: 0.7, color: p.color || '#fff8a0' });
        if (p.countText) G().toast(p.countText.replace('#', s.n).replace('%', p.n));
        if (s.n >= p.n) win(rt, p, s);
      });
    }
  };

  /* --- atteindre une zone sous condition (temps, effet, objet…) --- */
  M.reach = {
    onStep: function (rt, s, p, x, y) {
      if (solved(p) || s.won) return;
      var z = p.zone; if (x < z[0] || y < z[1] || x > z[2] || y > z[3]) return;
      if (p.cond && !YN.cond.check(p.cond)) { if (p.failLine && !(s.cd > G().clock)) { s.cd = G().clock + 5; say([p.failLine]); } return; }
      win(rt, p, s);
    }
  };

  /* --- écho : dire un mot, l'écho en renvoie un autre ; répéter celui-là --- */
  M.echo = {
    init: function (rt, p, s) { s.want = null; },
    onSpeak: function (rt, s, p, n) {
      var z = p.zone, pl = G().player; if (pl.x < z[0] || pl.y < z[1] || pl.x > z[2] || pl.y > z[3]) return false;
      if (solved(p)) { setTimeout(function () { echoSay(n.split('').reverse().join('')); }, 900); return true; }
      if (s.want && n === s.want) { s.want = null; win(rt, p, s); return true; }
      var words = p.words, w = words[Math.abs(YN.rng.hash(n)) % words.length];
      s.want = U.norm(w);
      setTimeout(function () { YN.audio.sfx('echo'); echoSay(w); }, 1100);
      return true;
    }
  };

  /* --- reproduire une suite de directions montrée par un être (mime, danse) --- */
  M.dirSequence = {
    init: function (rt, p, s) { s.i = 0; s.last = -1; s.show = 0; },
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      var e = rt.findEnt(p.ent); if (!e) return;
      s.show += dt; var k = Math.floor(s.show / 0.9) % (p.seq.length + 2);
      if (k < p.seq.length) { e.dir = p.seq[k]; e.state.pose = p.seq[k]; } else e.dir = 'down';
      var ls = G().lastStep;
      if (!ls || ls.n === s.last) return; s.last = ls.n;
      if (YN.mechUtil.near(rt, e, p.dist || 6) === false) { s.i = 0; return; }
      if (ls.dir === p.seq[s.i]) { s.i++; if (s.i >= p.seq.length) win(rt, p, s); }
      else s.i = ls.dir === p.seq[0] ? 1 : 0;
    }
  };

  /* --- dire un mot de passe près d'une marque ou d'un être (variante de password) --- */
  M.sayTo = {
    onSpeak: function (rt, s, p, n) {
      var tgt = p.ent ? rt.findEnt(p.ent) : rt.findMark(p.mark);
      if (!tgt || U.dist(tgt.x, tgt.y, G().player.x, G().player.y) > (p.dist || 3)) return false;
      if (solved(p)) { if (p.doneLine) say([p.doneLine]); return true; }
      if (p.cond && !YN.cond.check(p.cond)) { if (p.notNow) say([p.notNow]); return !!p.notNow; }
      var ok = (p.words || []).some(function (w) { var ww = U.norm(w); return n === ww || n.indexOf(ww) >= 0; });
      if (!ok) { if (p.wrong) say([p.wrong]); return !!p.wrong; }
      win(rt, p, s, tgt);
      return true;
    }
  };

  /* --- un chiffre secret composé sur un clavier (Téléphone, cadenas) via la parole --- */
  M.melodyLock = {
    onMelody: function (rt, s, p, str) {
      var m = rt.findMark(p.mark); if (!m || !YN.mechUtil.near(rt, m, p.dist || 4) || solved(p)) return false;
      if (str.indexOf(p.tune) < 0) return false;
      win(rt, p, s, m); return true;
    }
  };

  /* --- objet qui tourne autour d'un pivot ; rester dans son ombre (Ombre E70) --- */
  M.followShadow = {
    init: function (rt, p, s) { s.a = 0; s.t = 0; },
    update: function (rt, s, p, dt) {
      if (solved(p) || s.won) return;
      s.a += dt * (p.speed || 0.25); var c = p.center, r = p.r || 3;
      var sx = c[0] + Math.cos(s.a) * r, sy = c[1] + Math.sin(s.a) * r * 0.7;
      rt.lightsExtra = [{ x: sx, y: sy, r: 1.2, a: 0.6, color: '#202040' }];
      var pl = G().player;
      if (U.dist(pl.px - 0.5, pl.py - 0.5, sx, sy) < 1.1) { s.t += dt; if (s.t > (p.secs || 25)) win(rt, p, s); }
      else if (s.t > 0) { s.t = 0; if (p.breakLine) G().toast(p.breakLine); }
      s.shadow = [sx, sy];
    },
    draw: function (rt, x, s) {
      if (!s.shadow || s.won) return;
      var R = YN.render, q = R.toScreen(rt, s.shadow[0] + 0.5, s.shadow[1] + 0.5), t = R.ts();
      x.fillStyle = 'rgba(10,8,24,0.45)';
      for (var yy = -6; yy <= 6; yy++) { var hw = Math.round(Math.sqrt(Math.max(0, 1 - yy * yy / 49)) * t * 0.9); x.fillRect(Math.round(q[0]) - hw, Math.round(q[1]) + yy, hw * 2, 1); }
    }
  };

  /* --- monde qui boucle : marcher n fois vers une direction pour passer (wagons, couloirs) --- */
  M.loopCount = {
    init: function (rt, p, s) { s.n = YN.save.temp(p.key) || 0; s.lastX = null; },
    update: function (rt, s, p) {
      var pl = G().player, w = rt.w;
      if (s.lastX === null) { s.lastX = pl.px; return; }
      var dx = pl.px - s.lastX;
      if (dx < -w / 2) { s.n += 1; YN.save.temp(p.key, s.n); if (p.onLoop) p.onLoop(rt, s.n, 1); }
      else if (dx > w / 2) { s.n -= 1; YN.save.temp(p.key, s.n); if (p.onLoop) p.onLoop(rt, s.n, -1); }
      s.lastX = pl.px;
      rt.loopN = s.n;
    }
  };

  /* --- PNJ qui guide : il marche quand on approche, s'arrête quand on s'éloigne --- */
  M.guide = {
    update: function (rt, s, p) {
      var e = rt.findEnt(p.ent); if (!e) return;
      var pl = G().player, d = U.dist(e.fx, e.fy, pl.fx, pl.fy);
      e.paused = d > (p.wait || 4.5) || (p.cond && !YN.cond.check(p.cond));
      if (!s.won && e.def.path && e.pathI >= e.def.path.length - 1 && d < 3) win(rt, p, s);
    }
  };

  /* --- météo selon une condition (phase du rêve, heure…) --- */
  M.weatherWhen = {
    update: function (rt, s, p) {
      var on = YN.cond.check(p.cond);
      if (on === s.on) return; s.on = on;
      U.keys(p.weather).forEach(function (k) { if (on) rt.weather[k] = p.weather[k]; else delete rt.weather[k]; });
      if (p.music && on) YN.audio.playMusic(p.music, { fade: 3 });
    }
  };

  /* --- le Locataire : porte de la chambre entrouverte, il range (jamais vu) --- */
  M.locataire = {
    update: function (rt, s, p, dt) {
      if (!YN.cond.roomFelt(rt.depth).doorAjar) return;
      s.t = (s.t || 0) + dt; if (s.t < (s.next || 12)) return;
      s.t = 0; s.next = 10 + Math.random() * 14;
      var pool = rt.marks.filter(function (m) { return m.type === 'decor' && !m.essential && m.look && !YN.decor.isWall(m.look); });
      var pl = G().player, far = pool.filter(function (m) { return U.dist(m.x, m.y, pl.x, pl.y) > 6; });
      var m = far[Math.floor(Math.random() * far.length)]; if (!m) return;
      m.ox = (Math.random() - 0.5) * 0.6; m.oy = (Math.random() - 0.5) * 0.3;
      YN.audio.sfx('whistle', { vol: 0.12 });
    }
  };

  /* --- la sonnerie de l'école (fenêtre régulière du compte à rebours) --- */
  M.bellRing = {
    update: function (rt, s, p) {
      var on = YN.cond.check({ remainingMod: { every: p.every, under: p.under } });
      if (on && !s.on) { YN.audio.sfx('bell', { vol: 0.5 }); G().toast('The bell rings out.'); YN.render.cam.shake = 0.2; }
      s.on = on;
    }
  };

  /* --- casino : on mise des minutes de rêve --- */
  M.casino = {
    init: function (rt, p, s) { s.net = YN.save.temp('casinoNet') || 0; },
    onInteract: function (rt, s, p, m) {
      var c = m.def.casino; if (!c) return false;
      if (c.game === 'roulette' && YN.game.equipped() === 'E13') return false;
      var fmt = function (sec) { return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); };
      var labels = c.bets.map(function (b) { return 'Bet ' + fmt(b); }).concat(['Leave']);
      var intro = { roulette: '“Place your bets.” The ball waits.', slot: 'Three reels of fruit, one lever.', cards: '“Higher or lower, sweetheart?”', dice: 'Two dice in a leather cup.' }[c.game];
      say([{ t: intro }], { mark: m }, function () {
        YN.ui.dialog.choose(labels, function (i) {
          if (i >= c.bets.length) return;
          var bet = c.bets[i];
          if (YN.game.remaining() < bet + 30) { say(['“You don’t have enough time for that bet.”']); return; }
          var odds = { roulette: 0.46, slot: 0.34, cards: 0.48, dice: 0.44 }[c.game], win = Math.random() < odds;
          YN.audio.sfx(win ? 'coin' : 'error');
          if (win) { YN.game.addTime(bet); s.net += bet; } else { YN.game.addTime(-bet); s.net -= bet; }
          YN.save.temp('casinoNet', s.net);
          var prize = win && bet >= 60 && p.prize && !YN.save.hasEffect(p.prize) && !YN.save.isEgg(p.prize);
          var res = win ? ['Won. The countdown climbs back by ' + fmt(bet) + '.'] : ['Lost. ' + fmt(bet) + ' of dream slip away.'];
          if (prize) res.push('Along with her winnings, the croupier slides a white die towards her: “For luck. You’ll need it.”');
          if (s.net >= 180 && p.jackpotFlag && !YN.save.flag(p.jackpotFlag)) { YN.save.setFlag(p.jackpotFlag, true); res.push('A red door lights up at the back of the room: “VIP”.'); YN.world.reeval(rt); }
          say(res, { mark: m }, function () { if (prize) YN.game.giveEffect(p.prize); });
        });
      });
      return true;
    }
  };

  YN.data.codeFlags = (YN.data.codeFlags || []).concat(['casino_jackpot', 'factory_off', 'lighthouse_W029', 'absents_watered', 'arcade_watermelon']);
})(typeof window !== 'undefined' ? window : globalThis);
