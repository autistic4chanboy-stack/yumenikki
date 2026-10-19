/* =========================================================================
 *  Mode debug. Désactivé par défaut.
 *  Il se déverrouille d'une manière qui n'est écrite nulle part dans le jeu
 *  (seulement dans ses fichiers), ou par ?debug dans l'adresse (développeur).
 *  F9 : tout devient caractères. ` : console. « set <code> » : la case
 *  devant soi devient ce caractère. Rien de ce qui est fait ici n'est gardé.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var DB = YN.debug = {
    on: false, ascii: false, noclip: false, forceWitch: null, forcePriestess: false, log: [],
    urlFlag: function () { try { return /[?#&]debug/.test(root.location.search + root.location.hash); } catch (e) { return false; } },
    unlocked: function () { return DB.urlFlag() || !!(YN.save.perm && YN.save.perm.debug); },
    unlock: function () { if (YN.save.perm) { YN.save.perm.debug = true; YN.save.write(); } DB.on = true; YN.audio.sfx('ascii'); },
    cheat: function () { if (YN.save.perm && !YN.save.perm.flags.cheated) { YN.save.perm.flags.cheated = true; YN.save.write(); } },
    toggleAscii: function (force) {
      DB.ascii = force === true ? true : !DB.ascii;
      YN.audio.sfx('ascii');
      YN.tiles.clear(); if (YN.terrain) YN.terrain.clear();
      if (DB.ascii) DB.cheat();
    },
    /* ---------- rendu en caractères ---------- */
    COLORS: { wall: '#9a9ab8', wall2: '#8a9a8a', tall: '#4a9a4a', water: '#3a7ad8', shallow: '#6aa0e0', pit: '#333', void: '#000', floor: '#3a3a48', floor2: '#4a4a58', floor3: '#3a4a3a', leafg: '#4a9a40', leafb: '#a07030', soil: '#8a5a30', bridge: '#a08050', ice: '#c8e8ff', snow: '#e8e8f0', secret: '#9a9ab8', invis: '#202020', hazard: '#d04040', board: '#3a7a4a', paper: '#e0dcd0', mirror: '#c8d8e8', vine: '#6cc25a' },
    drawAscii: function (x, rt, W, H, tpx) {
      var G = YN.game, R = YN.render, c = R.cam;
      W = W || x.canvas.width; H = H || x.canvas.height; tpx = tpx || R.ts();
      var cell = Math.max(9, Math.round(tpx * 0.55)), rs = cell / 16;
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      x.font = 'bold ' + Math.round(cell * 0.86) + 'px "Courier New", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      var cols = Math.ceil(W / cell) + 2, rows = Math.ceil(H / cell) + 2;
      var view = rt.view === 'fps' || rt.view === 'side' || rt.view === 'wire';
      var camx = view ? G.player.x + 0.5 : c.x, camy = view ? G.player.y + 0.5 : c.y;
      var x0 = Math.floor(camx - cols / 2), y0 = Math.floor(camy - rows / 2);
      var toS = function (wx, wy) { var dx = wx - camx, dy = wy - camy; if (rt.wrap && !rt.inf) { dx = R.wrapD(dx, rt.w); dy = R.wrapD(dy, rt.h); } return [dx * cell + W / 2, dy * cell + H / 2]; };
      var px = G.player.x, py = G.player.y;
      var text = {};
      (rt.def.asciiText || []).forEach(function (t) { for (var i = 0; i < t.text.length; i++) text[(t.x + i) + ',' + t.y] = t.text[i]; });
      for (var ty = y0; ty <= y0 + rows; ty++) for (var tx = x0; tx <= x0 + cols; tx++) {
        var ch = rt.tile(tx, ty), info = YN.tileInfo(ch), sp = toS(tx + 0.5, ty + 0.5);
        var k = rt.norm(tx, ty).join(',');
        if (text[k]) { x.fillStyle = '#f0e090'; x.fillText(text[k], sp[0], sp[1]); continue; }
        if (ch === ' ' || info.void) continue;
        x.fillStyle = DB.COLORS[info.kind] || '#666';
        x.fillText(ch === '.' ? '·' : ch, sp[0], sp[1]);
      }
      var put = function (wx, wy, chr, col) {
        var sp = toS(wx + 0.5, wy + 0.5);
        x.fillStyle = '#000'; x.fillRect(sp[0] - cell / 2, sp[1] - cell / 2, cell, cell);
        x.fillStyle = col; x.fillText(chr, sp[0], sp[1]);
      };
      rt.marks.forEach(function (m) {
        if (!m.active || m.def.decal) return;
        var chr = m.ch || (YN.DOOR_TYPES[m.type] ? 'D' : m.type === 'effect' ? '*' : m.type === 'item' ? '%' : m.type === 'cookie' ? 'o' : m.type === 'sign' ? '?' : m.type === 'soul' ? 'ʘ' : m.look ? '&' : null);
        if (!chr) return;
        put(m.x, m.y, chr, m.hidden ? '#555' : YN.DOOR_TYPES[m.type] ? '#f0c040' : '#c0a0f0');
      });
      rt.ents.forEach(function (e) { if (!e.present) return; var n = (e.def.ascii || e.def.name || '?')[0]; put(e.fx, e.fy, e.def.invisible || e.def.kind === 'voice' ? n.toLowerCase() : n, e.def.hostile ? '#f06060' : '#80e0ff'); });
      (YN.witches ? YN.witches.drawList(rt.id) : []).forEach(function (w) { put(w.x, w.y, 'W', '#ff3040'); });
      (YN.priestess ? YN.priestess.drawList(rt.id) : []).forEach(function (w) { put(w.x, w.y, 'P', '#c060ff'); });
      var pp = view ? [G.player.x, G.player.y] : [G.player.px - 0.5, G.player.py - 0.5];
      put(pp[0], pp[1], '@', '#ffff60');
      var f = G.facing(), fs = toS(f[0] + 0.5, f[1] + 0.5);
      x.strokeStyle = 'rgba(255,255,96,0.35)'; x.lineWidth = Math.max(1, rs); x.strokeRect(fs[0] - cell / 2 + 1, fs[1] - cell / 2 + 1, cell - 2, cell - 2);
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillStyle = '#4a4'; x.font = Math.round(cell * 0.6) + 'px monospace';
      x.fillText(rt.id + ' ' + px + ',' + py + '  [' + rt.tile(f[0], f[1]).charCodeAt(0) + ']', cell * 0.4, H - cell * 0.4);
    },

    /* ---------- console ---------- */
    openConsole: function () {
      var UI = YN.ui, p = { node: UI.el('div', 'console') };
      p.node.innerHTML = '<div class="out"></div><div class="row">&gt; <input type="text" spellcheck="false" autocomplete="off"></div>';
      UI.root.appendChild(p.node);
      var out = p.node.querySelector('.out'), inp = p.node.querySelector('input');
      var print = function (s) { DB.log.push(s); if (DB.log.length > 80) DB.log.shift(); out.textContent = DB.log.slice(-14).join('\n'); };
      print(DB.log.length ? '' : 'help for the list of commands');
      YN.input.typing = true;
      var close = function () { YN.input.typing = false; UI._typingEsc = null; UI.pop(p); };
      UI._typingEsc = close;
      inp.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.code === 'Enter') { var v = inp.value; inp.value = ''; print('> ' + v); try { print(DB.exec(v) || ''); } catch (err) { print('error: ' + err.message); } }
        else if (e.code === 'Escape' || e.code === 'Backquote') { e.preventDefault(); close(); }
      });
      p.onKey = function () { return false; };
      UI.push(p); YN.input.typing = true;
      setTimeout(function () { inp.focus(); }, 20);
    },
    exec: function (line) {
      var G = YN.game, S = YN.save, a = line.trim().split(/\s+/), cmd = (a[0] || '').toLowerCase();
      DB.cheat();
      switch (cmd) {
        case 'help': return 'set N · tp ID [x y] · time mm:ss · give ID|all · take ID · witch ID · priestess · corrupt N · clean · room light|window|door · mother · wake · cookie · noclip · ascii · flag K [V] · quest Q S · hour HH:MM · stats · validate · seed · reveal · music ID · fps · witchesoff · priestessoff';
        case 'set': {
          var n = parseInt(a[1], 10); if (isNaN(n) || n < 0 || n > 255) return 'set 0..255';
          return DB.setFront(n);
        }
        case 'tp': {
          var id = (a[1] || '').toUpperCase(); if (!YN.data.worlds[id]) return 'unknown world';
          if (!S.dream && id !== 'ROOM') { S.beginDream({}); G.state = 'dream'; if (YN.witches) YN.witches.beginDream(); }
          G.enterWorld(id, a[2] ? [+a[2], +a[3]] : null, null, 'warp'); return 'ok';
        }
        case 'time': { if (!S.dream) return 'no dream'; var p = (a[1] || '').split(':'); S.dream.remaining = (+p[0]) * 60 + (+p[1] || 0); return 'ok'; }
        case 'give': {
          if (a[1] === 'all') { YN.data.effects.forEach(function (e) { S.grantEffect(e.id); }); return YN.data.effects.length + ' effects'; }
          var e = YN.effectById((a[1] || '').toUpperCase()); if (!e) return 'unknown effect'; G.giveEffect(e.id); return e.name;
        }
        case 'take': { var t = (a[1] || '').toUpperCase(); if (S.dream) S.dream.effects = S.dream.effects.filter(function (x) { return x !== t; }); S.perm.effects = S.perm.effects.filter(function (x) { return x !== t; }); return 'ok'; }
        case 'witch': { if (!S.dream) return 'no dream'; YN.witches.summon(a[1] || 'silent'); return 'ok'; }
        case 'priestess': { if (!S.dream) return 'no dream'; DB.forcePriestess = true; YN.priestess.summon({ now: true }); return 'ok'; }
        case 'corrupt': { S.addCorruption(G.rt.id, +a[1] || 1); YN.corruption.apply(G.rt); return 'level ' + S.corruption(G.rt.id); }
        case 'clean': { S.stabilize(G.rt.id, 5); YN.corruption.apply(G.rt); return 'ok'; }
        case 'room': { var k = a[1]; if (!S.perm.room.hasOwnProperty(k)) return 'light|window|door'; S.perm.room[k] = !S.perm.room[k]; if (S.dream) S.dream.room[k] = S.perm.room[k]; S.write(); G.rebuildWorld(); return k + ' = ' + S.perm.room[k]; }
        case 'mother': { if (!S.dream) return 'no dream'; S.dream.room.light = true; S.dream.mother.roll = true; S.dream.mother.at = 0; S.dream.mother.done = false; return 'ok'; }
        case 'wake': G.wake('event'); return 'ok';
        case 'cookie': G.giveCookie(); return 'ok';
        case 'noclip': DB.noclip = !DB.noclip; return 'noclip ' + DB.noclip;
        case 'ascii': DB.toggleAscii(); return 'ascii ' + DB.ascii;
        case 'flag': if (a.length > 2) { S.setFlag(a[1], a[2] === 'null' ? null : (a[2] === 'true' ? true : a[2] === 'false' ? false : (isNaN(+a[2]) ? a[2] : +a[2])), true); } return a[1] + ' = ' + JSON.stringify(S.flag(a[1]));
        case 'quest': S.setQuest(a[1], a[2] || null); return a[1] + ' : ' + S.questStage(a[1]);
        case 'hour': { var hp = (a[1] || '').split(':'); var now = new Date(); now.setHours(+hp[0], +hp[1] || 0, 0); YN.realtime.offsetMs = now.getTime() - Date.now(); return 'simulated time ' + a[1]; }
        case 'stats': { var r = YN.validate ? YN.validate.counts() : {}; return JSON.stringify(r); }
        case 'validate': { if (!YN.validate) return 'validation unavailable'; var rep = YN.validate.run(); return rep.summary; }
        case 'seed': return G.rt.id + ' seed ' + G.rt.seed;
        case 'reveal': G.revealUntil = G.clock + 30; G.rt.marks.forEach(function (m) { m.revealed = true; }); return 'ok';
        case 'music': YN.audio.playMusic(a[1], { fade: 1 }); return 'ok';
        case 'fps': S.settings.showFps = !S.settings.showFps; return 'fps ' + S.settings.showFps;
        case 'witchesoff': S.setFlag('witches_off', !S.flag('witches_off'), true); return 'witches ' + (S.flag('witches_off') ? 'disabled' : 'active');
        case 'priestessoff': S.setFlag('priestess_off', !S.flag('priestess_off'), true); return 'ok';
        case 'unlock': DB.unlock(); return 'ok';
      }
      return 'unknown command (help)';
    },
    /* « set N » : la case devant devient le caractère N (temporaire) */
    setFront: function (n) {
      var G = YN.game, rt = G.rt, f = G.facing(), ch = String.fromCharCode(n), before = rt.tile(f[0], f[1]);
      if (n === 7) { if (YN.save.dream) YN.witches.summon('bell'); YN.audio.sfx('witch_bell'); return 'BEL'; }
      if (n === 27) { if (YN.save.dream) G.wake('event'); return 'ESC'; }
      if (n === 127) { var e = rt.entAt(f[0], f[1]) || rt.ents.filter(function (q) { return q.x === f[0] && q.y === f[1]; })[0]; if (e) { e.deleted = true; e.present = false; e.visible = false; return 'DEL ' + e.def.name; } var m0 = rt.markAt(f[0], f[1]); if (m0 && !m0.essential) { m0.active = false; m0.def = Object.assign({}, m0.def, { cond: { fn: function () { return false; } } }); return 'DEL'; } return 'DEL nothing'; }
      if (n === 0) {
        if (rt.depth >= 4 && YN.data.worlds.W183) { YN.world.addMark(rt, { type: 'hole', to: 'W183', look: 'hole', id: 'nulhole' }, f[0], f[1], null); rt.setTemp(f[0], f[1], '.', 'debug'); return 'NUL'; }
        rt.setTemp(f[0], f[1], ' ', 'debug'); return 'NUL';
      }
      if (ch === 'D') {
        if (YN.tileInfo(before).wall && YN.data.worlds.W191) {
          rt.setTemp(f[0], f[1], '.', 'debug');
          var m = YN.world.addMark(rt, { type: 'door', to: 'W191', id: 'debugdoor', look: null, solid: true }, f[0], f[1], null);
          m.asciiCh = 'D';
          return 'D (a door stands upright)';
        }
        return 'D';
      }
      rt.setTemp(f[0], f[1], ch, 'debug');
      return JSON.stringify(before) + ' -> ' + JSON.stringify(ch);
    }
  };

  /* le Nexus, dans le noir, entend « ascii » */
  YN.bus.on('boot', function () {
    YN.speech.listen(function (n) {
      var G = YN.game;
      if (!G.rt || G.rt.id !== 'NEXUS') return false;
      if (n !== 'ascii' && n !== '41 53 43 49 49' && n !== '4153434949') return false;
      if (!YN.cond.roomFelt(1).dark) return false;
      if (!DB.unlocked()) { DB.unlock(); YN.ui.toast('▒▒▒', 2); }
      DB.toggleAscii(true);
      return true;
    });
    // passer en mode noclip : la joueuse traverse tout
    var origPass = null;
    YN.bus.on('worldEnter', function (rt) {
      if (!origPass) origPass = true;
      var base = rt.passable;
      rt.passable = function (x, y, who, caps) { if (who === 'player' && DB.noclip) return true; return base(x, y, who, caps); };
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
