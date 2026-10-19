/* =========================================================================
 *  SECRETS — ce que la carte cache, placé là où on a envie de chercher.
 *   · faux mur   : au bout d'un couloir ou dans un renfoncement, un pan de mur
 *                  qu'on traverse ; derrière, une petite pièce fermée.
 *   · chemin noir: depuis un bord du vide, un chemin qu'on ne voit pas mène
 *                  à un îlot qu'on voit.
 *   · porte cachée : parfois, dans la pièce secrète, une porte vers un autre rêve.
 *  Les places changent d'une nuit à l'autre. Un petit signe trahit l'entrée
 *  (une fissure, des traces de pas, des cailloux au bord du vide) — pas toujours.
 *  Les faux murs ne laissent passer que la protagoniste (ni habitants, ni sorcières).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  var DRAWINGS = ['Someone drew a door here, at child height. It has a handle.', 'Chalk on the wall: a house, a sun, three people. One of them has been rubbed out.',
    'A drawing of this very room, with someone standing exactly where she is.', 'Tally marks. Hundreds of them. The last row stops halfway.',
    'A crayon drawing of a cake with too many candles to count.', 'Someone wrote “I was here” and then, smaller, “nobody came”.'];
  var NOOK = ['A blanket, folded very small. Still warm.', 'A cup with a little water left in it. Nobody drinks from it.', 'A shoebox of bottle caps, sorted by colour.',
    'A pillow fort that someone stopped building.', 'A torch with dead batteries, pointing at the wall.', 'A tin of buttons. One button is still sewn to a scrap of school uniform.'];

  function H(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }

  var S = YN.secrets = {
    /* creuse les secrets dans la carte de base (avant les marques) */
    carve: function (rt) {
      var def = rt.def;
      rt.fake = null; rt.secretSpots = [];
      S.dataFakes(rt);
      if (rt.inf || rt.view !== 'top' || def.noSecrets || (def.depth || 0) === 0 || !rt.base || !/^W\d{3}$/.test(rt.id)) return;
      var w = rt.w, h = rt.h; if (w < 18 || h < 12) return;
      var dn = YN.save.dream ? YN.save.dream.no : 0, r = YN.rng.make((H('secret:' + rt.id) ^ Math.imul(dn + 1, 2654435761) ^ ((YN.save.perm && YN.save.perm.created) || 7)) >>> 0);
      var grid = rt.base.map(function (row) { return row.split(''); });
      var info = function (x, y) { return YN.tileInfo(grid[y][x]); };
      var pass = function (x, y) { if (x < 0 || y < 0 || x >= w || y >= h) return false; var i = info(x, y); return !!(i.pass || i.slide); };
      var marked = {}; (rt.markPos || []).forEach(function (mp) { marked[mp[1] + ',' + mp[2]] = 1; });
      // d'où l'on part : l'arrivée, sinon une porte, sinon le centre
      var start = rt.spawnAt || ((rt.markPos || []).filter(function (mp) { var md = def.marks && def.marks[mp[0]]; return md && YN.DOOR_TYPES[md.type]; }).map(function (mp) { return [mp[1], mp[2]]; })[0]) || [w >> 1, h >> 1];
      var dist = new Int32Array(w * h).fill(-1), q = [];
      var s0 = null; for (var rr = 0; rr < 60 && !s0; rr++) for (var dy0 = -rr; dy0 <= rr && !s0; dy0++) for (var dx0 = -rr; dx0 <= rr && !s0; dx0++) if (pass(start[0] + dx0, start[1] + dy0)) s0 = [start[0] + dx0, start[1] + dy0];
      if (!s0) { for (var sy = 1; sy < h - 1 && !s0; sy++) for (var sx = 1; sx < w - 1 && !s0; sx++) if (pass(sx, sy)) s0 = [sx, sy]; }
      if (!s0) return;
      dist[s0[1] * w + s0[0]] = 0; q.push(s0); var qi = 0, reach = 0;
      while (qi < q.length) { var c = q[qi++]; reach++; D4.forEach(function (d) { var nx = c[0] + d[0], ny = c[1] + d[1]; if (!pass(nx, ny) || dist[ny * w + nx] >= 0) return; dist[ny * w + nx] = dist[c[1] * w + c[0]] + 1; q.push([nx, ny]); }); }
      if (reach < 30) return;
      var solidFree = function (x, y) { return x > 0 && y > 0 && x < w - 1 && y < h - 1 && !pass(x, y) && !marked[x + ',' + y]; };
      var taken = new Uint8Array(w * h), cands = [], sample = Math.min(1, 6000 / (w * h)); // grandes cartes : on n'examine qu'une partie des cases
      // ---- faux murs : une pièce fermée derrière un pan de mur ----
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        var k = y * w + x; if (dist[k] < 4 || (sample < 1 && r.next() > sample)) continue;
        var nb = D4.filter(function (d) { return pass(x + d[0], y + d[1]); }).length, dead = nb <= 1;
        D4.forEach(function (d) {
          var wx = x + d[0], wy = y + d[1]; if (!solidFree(wx, wy)) return;
          var wi = info(wx, wy); if (!(wi.wall || wi.tall || wi.void)) return;
          var rw = 2 + r.int(0, 2), rd = 2 + r.int(0, 1); // largeur (en travers), profondeur
          var px = -d[1], py = d[0], ok = true, cells = [];
          for (var a = 1; a <= rd + 1 && ok; a++) for (var b = -((rw >> 1) + 1); b <= (rw >> 1) + 1 && ok; b++) {
            var cx = wx + d[0] * a + px * b, cy = wy + d[1] * a + py * b;
            if (!solidFree(cx, cy)) { ok = false; break; }
            if (a <= rd && Math.abs(b) <= (rw >> 1)) cells.push([cx, cy]);
          }
          if (!ok) return;
          var sc = (dead ? 40 : 0) + Math.min(60, dist[k]) + r.next() * 15 - (nb >= 3 ? 25 : 0);
          cands.push({ kind: 'room', sc: sc, from: [x, y], door: [wx, wy], cells: cells, d: d });
        });
      }
      // ---- chemins noirs : d'un bord du vide vers un îlot ----
      for (var y2 = 1; y2 < h - 1; y2++) for (var x2 = 1; x2 < w - 1; x2++) {
        var k2 = y2 * w + x2; if (dist[k2] < 3 || (sample < 1 && r.next() > sample)) continue;
        D4.forEach(function (d) {
          var L = 3 + r.int(0, 3), ok = true, path = [], med = grid[y2 + d[1]] && grid[y2 + d[1]][x2 + d[0]]; // le vide, ou l'eau : un chemin qu'on ne voit pas
          if (med !== ' ' && med !== '~') return;
          for (var a = 1; a <= L && ok; a++) { var cx = x2 + d[0] * a, cy = y2 + d[1] * a; if (cx < 1 || cy < 1 || cx >= w - 1 || cy >= h - 1 || grid[cy][cx] !== med || marked[cx + ',' + cy]) ok = false; else path.push([cx, cy]); }
          if (!ok) return;
          var ix = x2 + d[0] * (L + 2), iy = y2 + d[1] * (L + 2), cells = [];
          for (var dy = -2; dy <= 2 && ok; dy++) for (var dx = -2; dx <= 2 && ok; dx++) { var ex = ix + dx, ey = iy + dy; if (ex < 1 || ey < 1 || ex >= w - 1 || ey >= h - 1 || grid[ey][ex] !== med || marked[ex + ',' + ey]) ok = false; else if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) cells.push([ex, ey]); }
          if (!ok) return;
          path.push([x2 + d[0] * (L + 1), y2 + d[1] * (L + 1)]);
          cands.push({ kind: 'dark', sc: 30 + Math.min(50, dist[k2]) + r.next() * 20, from: [x2, y2], path: path, cells: cells, d: d });
        });
      }
      // ---- raccourcis : un mur d'une case entre deux couloirs que tout sépare à pied ----
      var cuts = [];
      for (var y3 = 1; y3 < h - 1; y3++) for (var x3 = 1; x3 < w - 1; x3++) {
        if (pass(x3, y3) || marked[x3 + ',' + y3]) continue; var wi3 = info(x3, y3); if (!wi3.wall) continue;
        [[1, 0], [0, 1]].forEach(function (d) {
          var ax = x3 - d[0], ay = y3 - d[1], bx = x3 + d[0], by = y3 + d[1];
          if (!pass(ax, ay) || !pass(bx, by)) return; var da = dist[ay * w + ax], db = dist[by * w + bx]; if (da < 0 || db < 0) return;
          var gap = Math.abs(da - db); if (gap < 28) return;
          cuts.push({ kind: 'cut', sc: gap + r.next() * 10, from: da > db ? [bx, by] : [ax, ay], door: [x3, y3], cells: [], center: [x3, y3] });
        });
      }
      cuts.sort(function (a, b) { return b.sc - a.sc; });
      if (cuts.length) { var nc = Math.min(cuts.length, 1 + (reach > 2500 ? 1 : 0)); for (var ci = 0; ci < nc; ci++) cands.push(Object.assign(cuts[r.int(0, Math.min(cuts.length - 1, 4))], { sc: 999 - ci })); }
      if (!cands.length) return;
      cands.sort(function (a, b) { return b.sc - a.sc; });
      // les premiers mondes (W001–W040) cachent davantage ; un monde peut en demander plus (def.moreSecrets)
      var early = rt.id <= 'W040' ? 2 : 0, want = Math.min((def.vast ? 8 : 4) + early, 1 + early + (def.moreSecrets || 0) + Math.floor(reach / 1400) + (r.chance(0.5) ? 1 : 0)), fake = rt.fake || new Uint8Array(w * h), picked = [];
      var free = function (c) { var all = (c.cells || []).concat(c.path || []).concat(c.door ? [c.door] : []); for (var i = 0; i < all.length; i++) for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) { var xx = all[i][0] + dx, yy = all[i][1] + dy; if (xx >= 0 && yy >= 0 && xx < w && yy < h && taken[yy * w + xx]) return false; } return true; };
      var top = cands.slice(0, Math.max(want * 6, 12));
      while (picked.length < want && top.length) {
        var c = top.splice(r.int(0, Math.min(top.length - 1, 3)), 1)[0];
        if (!free(c)) continue;
        if (c.kind === 'dark' && picked.some(function (p) { return p.kind === 'dark'; })) continue;
        picked.push(c);
        (c.cells || []).concat(c.path || []).concat(c.door ? [c.door] : []).forEach(function (p) { taken[p[1] * w + p[0]] = 1; });
      }
      var floorCh = function (c) { var ch = grid[c.from[1]][c.from[0]], i = YN.tileInfo(ch); return (i.pass && !i.ladder && !i.slide && i.kind !== 'bridge') ? ch : '.'; };
      picked.forEach(function (c) {
        if (c.kind === 'cut') { fake[c.door[1] * w + c.door[0]] = 1; rt.secretSpots.push(c); return; }
        var fc = floorCh(c);
        c.orig = c.cells.map(function (p) { return [p[0], p[1], grid[p[1]][p[0]]]; });
        c.cells.forEach(function (p) { grid[p[1]][p[0]] = fc; });
        if (c.kind === 'room') fake[c.door[1] * w + c.door[0]] = 1;
        else c.path.forEach(function (p) { fake[p[1] * w + p[0]] = 1; });
        c.center = c.cells[Math.floor(c.cells.length / 2)];
        rt.secretSpots.push(c);
      });
      if (!picked.length) return;
      rt.base = grid.map(function (row) { return row.join(''); });
      rt.fake = fake;
    },

    /* depuis l'arrivée réelle (marques posées) : une cachette collée à une zone hors d'atteinte est refermée */
    dropUnreachable: function (rt) {
      var w = rt.w, h = rt.h, a = null;
      try { var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0]; a = YN.world.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos; } catch (e) { a = null; }
      if (!a) return;
      var seen = new Uint8Array(w * h), q = [a], qi = 0, PG = YN.world.passGrid(rt, 'player'); if (a[0] < 0 || a[1] < 0 || a[0] >= w || a[1] >= h) return; seen[a[1] * w + a[0]] = 1;
      while (qi < q.length) { var c = q[qi++]; for (var k = 0; k < 4; k++) { var nx = c[0] + D4[k][0], ny = c[1] + D4[k][1]; if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen[ny * w + nx]) continue; if (!PG[ny * w + nx]) continue; seen[ny * w + nx] = 1; q.push([nx, ny]); } }
      var keep = [], rows = null;
      rt.secretSpots.forEach(function (c) {
        if (seen[c.from[1] * w + c.from[0]] && (c.kind === 'cut' || seen[c.center[1] * w + c.center[0]])) { keep.push(c); return; }
        rows = rows || rt.base.map(function (row) { return row.split(''); });
        (c.orig || []).forEach(function (o) { rows[o[1]][o[0]] = o[2]; });
        (c.path || []).concat(c.door ? [c.door] : []).forEach(function (p) { rt.fake[p[1] * w + p[0]] = 0; });
      });
      if (rows) rt.base = rows.map(function (row) { return row.join(''); });
      rt.secretSpots = keep;
    },

    /* en fin de construction : rien d'important hors d'atteinte, aucun faux mur bouché par un objet */
    finalCheck: function (rt) {
      if (rt.inf || !rt.base) return;
      var w = rt.w, h = rt.h;
      if (rt.fake) rt.marks.forEach(function (m) { if (m.solid && m.active && m.x >= 0 && m.y >= 0 && m.x < w && m.y < h && rt.fake[m.y * w + m.x] && !m.def.secretDoor) { var q = YN.world.nearestOpen(rt, m.x, m.y); if (q && !rt.fake[q[1] * w + q[0]]) { m.x = q[0]; m.y = q[1]; } else m.active = false; } });
      var a = null; try { var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0]; a = YN.world.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos; } catch (e) { a = null; }
      if (!a || a[0] < 0 || a[1] < 0 || a[0] >= w || a[1] >= h) return;
      var seen = new Uint8Array(w * h), q0 = [a], qi = 0, PG = YN.world.passGrid(rt, 'player'); seen[a[1] * w + a[0]] = 1;
      while (qi < q0.length) { var c = q0[qi++]; for (var k = 0; k < 4; k++) { var nx = c[0] + D4[k][0], ny = c[1] + D4[k][1]; if (rt.wrap) { nx = U.mod(nx, w); ny = U.mod(ny, h); } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; if (seen[ny * w + nx] || !PG[ny * w + nx]) continue; seen[ny * w + nx] = 1; q0.push([nx, ny]); } }
      var near = function (m) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var x = m.x + dx, y = m.y + dy; if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x >= 0 && y >= 0 && x < w && y < h && seen[y * w + x]) return true; } return false; };
      var nooks = null, r = YN.rng.make((H('final:' + rt.id) ^ 77) >>> 0);
      rt.marks.forEach(function (m) {
        if ((!m.active && !m.def.spawned) || !(m.def.collectSet || m.def.storyItem || m.def.secretDoor || (m.type === 'effect' && m.def.give) || /^find_|^art_/.test(m.def.id || '') || (YN.DOOR_TYPES[m.type] && ((typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0) || m.def.spawned)))) return;
        if (near(m)) return;
        if (!nooks) { var MG0 = YN.world.markGrid(rt), cutT = YN.world.cutAny(rt); nooks = []; for (var i = 0; i < q0.length; i++) { var cc = q0[i]; if (MG0.has(cc[0], cc[1]) || cutT[cc[1] * w + cc[0]] || YN.world.choke(rt, cc[0], cc[1])) continue; /* jamais dans un goulet : une porte solide le boucherait */ var bl = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var xx = cc[0] + dx, yy = cc[1] + dy; if ((dx || dy) && (xx < 0 || yy < 0 || xx >= w || yy >= h || !PG[yy * w + xx])) bl++; } if (bl >= 4) nooks.push(cc); } if (!nooks.length) nooks = q0.slice(4).filter(function (c1) { return !MG0.has(c1[0], c1[1]) && !cutT[c1[1] * w + c1[0]] && !YN.world.choke(rt, c1[0], c1[1]); }); if (!nooks.length) nooks = q0.slice(4).filter(function (c1) { return !MG0.has(c1[0], c1[1]); }); }
        if (!nooks.length) return; var p = nooks.splice(r.int(0, nooks.length - 1), 1)[0]; m.x = p[0]; m.y = p[1];
      });
    },

    /* murs traversables écrits dans les données : def.fakeWalls = [[x, y], [x, y, largeur, hauteur], …]
       (cases qui ont l'air pleines ou vides et qu'elle seule traverse ; coordonnées négatives = depuis le bord) */
    dataFakes: function (rt) {
      var fw = rt.def.fakeWalls; if (!fw || rt.inf || !rt.base) return;
      var w = rt.w, h = rt.h, f = rt.fake || new Uint8Array(w * h);
      (typeof fw === 'function' ? fw(rt) || [] : fw).forEach(function (a) {
        var x0 = a[0] < 0 ? w + a[0] : a[0], y0 = a[1] < 0 ? h + a[1] : a[1];
        for (var y = y0; y < y0 + (a[3] || 1); y++) for (var x = x0; x < x0 + (a[2] || 1); x++) if (x >= 0 && y >= 0 && x < w && y < h) f[y * w + x] = 1;
      });
      rt.fake = f;
    },

    /* une case qu'on traverse alors qu'elle a l'air pleine (ou vide) */
    isFake: function (rt, x, y) { return !!(rt.fake && x >= 0 && y >= 0 && x < rt.w && y < rt.h && rt.fake[y * rt.w + x]); },

    /* ce qu'il y a dans chaque cachette (après les marques et l'ameublement) */
    populate: function (rt) {
      if (!rt.secretSpots || !rt.secretSpots.length) return;
      S.dropUnreachable(rt);
      if (!rt.secretSpots.length) return;
      var r = YN.rng.make((H('fill:' + rt.id) ^ ((YN.save.dream ? YN.save.dream.no : 0) * 977)) >>> 0), WD = YN.world;
      rt.secretSpots.forEach(function (c, i) {
        if (c.kind === 'cut') { c.reward = 'shortcut'; if (r.chance(0.6) && !rt.markAt(c.from[0], c.from[1])) WD.addMark(rt, { id: 'shint_c' + i, type: 'decor', look: 'crack', solid: false, flat: true, noInteract: true }, c.from[0], c.from[1], null); return; }
        var at = c.center, kind = null, roll = r.next();
        // une collection d'abord (pièces, pages…), sinon une porte cachée, un dessin, un coin habité
        if (YN.collect && roll < 0.55) kind = YN.collect.placeIn(rt, at[0], at[1], 'secret:' + i) ? 'collect' : null;
        if (!kind && roll < 0.75) { var to = S.doorTarget(rt, r); if (to) { WD.addMark(rt, { id: 'sdoor_' + i, type: 'door', to: to, look: c.kind === 'dark' ? 'ndoor' : 'door', lookOpt: { c: ['#3a3048', '#d8d0f0'] }, solid: true, secretDoor: true }, at[0], at[1], null); kind = 'door'; } }
        if (!kind) { var nook = r.chance(0.5); WD.addMark(rt, { id: 'snook_' + i, type: 'decor', look: nook ? 'blanketlump' : 'doodle', solid: false, flat: !nook, lines: [nook ? NOOK[r.int(0, NOOK.length - 1)] : DRAWINGS[r.int(0, DRAWINGS.length - 1)]] }, at[0], at[1], null); kind = 'nook'; }
        c.reward = kind;
        // un signe à l'entrée, pas toujours
        if (r.chance(0.7)) {
          var hx = c.from[0], hy = c.from[1];
          if (!rt.markAt(hx, hy)) WD.addMark(rt, { id: 'shint_' + i, type: 'decor', look: c.kind === 'dark' ? 'pebbles' : (r.chance(0.5) ? 'crack' : 'scuff'), solid: false, flat: true, noInteract: true }, hx, hy, null);
        }
      });
    },

    /* un tableau, un miroir, une affiche accrochés au mur… dans lesquels on peut entrer */
    paintedDoor: function (rt) {
      var def = rt.def; if (rt.inf || rt.view !== 'top' || def.noSecrets || (def.depth || 0) === 0 || (def.depth || 0) >= 5 || !rt.base || !/^W\d{3}$/.test(rt.id)) return;
      var r = YN.rng.make((H('paint:' + rt.id) ^ ((YN.save.dream ? YN.save.dream.no : 0) * 7919)) >>> 0); if (!r.chance(rt.id <= 'W040' ? 0.7 : 0.4)) return;
      var w = rt.w, h = rt.h, cand = [], cut = YN.world.cutAny(rt); // jamais sur une case de passage obligatoire (virage d'un couloir, porte d'une pièce)
      for (var y = 2; y < h - 1; y++) for (var x = 1; x < w - 1; x++) { var ti = YN.tileInfo(rt.tile(x, y)), up = YN.tileInfo(rt.tile(x, y - 1)); if (ti.pass && up.wall && !cut[y * w + x] && !YN.world.choke(rt, x, y) && !rt.markAt(x, y) && !rt.markAt(x - 1, y) && !rt.markAt(x + 1, y) && rt.passable(x, y + 1, 'pbody', {})) cand.push([x, y]); }
      if (cand.length < 8) return;
      var to = S.doorTarget(rt, r); if (!to) return;
      var at = cand[r.int(0, cand.length - 1)], looks = ['frame', 'mirror', 'poster', 'portrait'], lk = looks[r.int(0, looks.length - 1)];
      YN.world.addMark(rt, { id: 'pdoor', type: 'door', to: to, look: lk, lookOpt: { seed: r.int(0, 255) }, solid: true, secretDoor: true, painted: true, sfx: 'reveal' }, at[0], at[1], null);
      rt.paintedDoor = { at: at, to: to };
    },

    /* une porte cachée mène vers un autre rêve du même étage ou du suivant (jamais la sixième couche, jamais un lieu à part) */
    doorTarget: function (rt, r) {
      var dep = rt.depth || 1, W = YN.data.worlds;
      if (!S._pool) S._pool = U.keys(W).filter(function (k) { var d = W[k]; return /^W\d{3}$/.test(k) && (d.depth || 0) >= 1 && (d.depth || 0) <= 4 && !d.spawnRule && !d.appear && !d.noHiddenEntry && !d.ending && !(d.inf && d.inf.only) && !(YN.data.gated && YN.data.gated[k]); }); // jamais vers la récompense d'une énigme
      var sl = rt.def.secretLevel || 0;
      var pool = S._pool.filter(function (k) { var d0 = W[k].depth || 1; return k !== rt.id && (W[k].secretLevel || 0) <= sl + 1 && d0 >= dep - 1 && d0 <= Math.min(4, dep + 1) && !(dep < 3 && d0 >= 3 && !W[k].core); });
      if (dep >= 5) return null;
      return pool.length ? pool[r.int(0, pool.length - 1)] : null;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
