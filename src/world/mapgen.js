/* =========================================================================
 *  Génération procédurale (graines stables).
 *  Les générateurs produisent des tableaux de chaînes avec la même légende
 *  que les cartes dessinées à la main : la suite du moteur ne fait pas la
 *  différence. Les mondes infinis passent par YN.inf (tronçons + cache LRU).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  function grid(w, h, ch) { var g = []; for (var y = 0; y < h; y++) { g.push([]); for (var x = 0; x < w; x++) g[y].push(ch); } return g; }
  function toRows(g) { return g.map(function (r) { return r.join(''); }); }
  function inb(g, x, y) { return y >= 0 && y < g.length && x >= 0 && x < g[0].length; }
  function passCh(ch) { var i = YN.tileInfo(ch); return i.pass || YN.isMarkChar(ch); }

  var G = YN.gen = {
    grid: grid, toRows: toRows,
    /* labyrinthe parfait (retour sur trace), puis boucles optionnelles */
    maze: function (w, h, r, o) {
      o = o || {};
      var wall = o.wall || '#', floor = o.floor || '.';
      w = w % 2 ? w : w - 1; h = h % 2 ? h : h - 1;
      var g = grid(w, h, wall), stack = [[1, 1]];
      g[1][1] = floor;
      while (stack.length) {
        var c = stack[stack.length - 1], dirs = U.shuffle([[2, 0], [-2, 0], [0, 2], [0, -2]], r), moved = false;
        for (var i = 0; i < 4; i++) {
          var nx = c[0] + dirs[i][0], ny = c[1] + dirs[i][1];
          if (nx > 0 && ny > 0 && nx < w - 1 && ny < h - 1 && g[ny][nx] === wall) {
            g[c[1] + dirs[i][1] / 2][c[0] + dirs[i][0] / 2] = floor; g[ny][nx] = floor;
            stack.push([nx, ny]); moved = true; break;
          }
        }
        if (!moved) stack.pop();
      }
      var loops = o.loops === undefined ? 0.06 : o.loops;
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        if (g[y][x] !== wall) continue;
        var hor = g[y][x - 1] !== wall && g[y][x + 1] !== wall && g[y - 1][x] === wall && g[y + 1][x] === wall;
        var ver = g[y - 1][x] !== wall && g[y + 1][x] !== wall && g[y][x - 1] === wall && g[y][x + 1] === wall;
        if ((hor || ver) && r.next() < loops) g[y][x] = floor;
      }
      if (o.rooms) for (var k = 0; k < o.rooms; k++) {
        var rw = r.int(2, 4) * 2 + 1, rh = r.int(2, 3) * 2 + 1, rx = r.int(1, Math.max(1, (w - rw - 1) / 2)) * 2 - 1, ry = r.int(1, Math.max(1, (h - rh - 1) / 2)) * 2 - 1;
        for (var yy = ry; yy < ry + rh && yy < h - 1; yy++) for (var xx = rx; xx < rx + rw && xx < w - 1; xx++) if (yy > 0 && xx > 0) g[yy][xx] = floor;
      }
      if (o.decor) G.sprinkle(g, r, floor, o.decor, o.decorRate || 0.03);
      return toRows(g);
    },
    /* grottes par automate cellulaire */
    cave: function (w, h, r, o) {
      o = o || {};
      var wall = o.wall || '#', floor = o.floor || '.', g = grid(w, h, wall);
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) g[y][x] = r.next() < (o.fill || 0.44) ? wall : floor;
      for (var it = 0; it < (o.iter || 4); it++) {
        var n = grid(w, h, wall);
        for (var y2 = 1; y2 < h - 1; y2++) for (var x2 = 1; x2 < w - 1; x2++) {
          var c = 0;
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (g[y2 + dy][x2 + dx] === wall) c++;
          n[y2][x2] = c >= 5 ? wall : floor;
        }
        g = n;
      }
      G.connectRegions(g, floor, r);
      if (o.decor) G.sprinkle(g, r, floor, o.decor, o.decorRate || 0.03);
      if (o.water) G.blobs(g, r, '~', floor, o.water);
      return toRows(g);
    },
    /* îles : bruit + seuil */
    islands: function (w, h, r, o) {
      o = o || {};
      var seed = r.int(1, 1e6), g = grid(w, h, o.sea || '~'), sc = o.scale || 0.12;
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var n = YN.rng.noise2(x * sc, y * sc, seed) * 0.7 + YN.rng.noise2(x * sc * 2.3, y * sc * 2.3, seed + 7) * 0.3;
        if (n > (o.level || 0.58)) g[y][x] = o.land || '.';
        else if (n > (o.level || 0.58) - 0.05) g[y][x] = o.shore || 'w';
      }
      if (o.decor) G.sprinkle(g, r, o.land || '.', o.decor, o.decorRate || 0.04);
      return toRows(g);
    },
    /* pièces et couloirs (partition binaire) */
    rooms: function (w, h, r, o) {
      o = o || {};
      var wall = o.wall || '#', floor = o.floor || '.', corr = o.corridor || floor, g = grid(w, h, wall), rooms = [];
      function split(x, y, ww, hh, d) {
        if (d > (o.depth || 4) || ww < 12 || hh < 10) {
          var rw = r.int(Math.max(4, ww / 2), ww - 2), rh = r.int(Math.max(4, hh / 2), hh - 2), rx = x + r.int(1, ww - rw - 1), ry = y + r.int(1, hh - rh - 1);
          for (var yy = ry; yy < ry + rh; yy++) for (var xx = rx; xx < rx + rw; xx++) g[yy][xx] = floor;
          rooms.push([rx + Math.floor(rw / 2), ry + Math.floor(rh / 2), rx, ry, rw, rh]);
          return;
        }
        if (ww > hh) { var s = r.int(Math.floor(ww * 0.35), Math.floor(ww * 0.65)); split(x, y, s, hh, d + 1); split(x + s, y, ww - s, hh, d + 1); }
        else { var t = r.int(Math.floor(hh * 0.35), Math.floor(hh * 0.65)); split(x, y, ww, t, d + 1); split(x, y + t, ww, hh - t, d + 1); }
      }
      split(0, 0, w, h, 0);
      for (var i = 1; i < rooms.length; i++) G.carveL(g, rooms[i - 1][0], rooms[i - 1][1], rooms[i][0], rooms[i][1], corr, r);
      G.rooms_last = rooms;
      if (o.decor) G.sprinkle(g, r, floor, o.decor, o.decorRate || 0.02);
      return toRows(g);
    },
    /* quadrillage urbain */
    city: function (w, h, r, o) {
      o = o || {};
      var block = o.block || 6, road = o.road || ',', side = o.side || '.', bld = o.building || '#', g = grid(w, h, road);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var bx = x % (block + 2), by = y % (block + 2);
        if (bx === 0 || by === 0) g[y][x] = road;
        else if (bx === 1 || by === 1 || bx === block + 1 || by === block + 1) g[y][x] = side;
        else g[y][x] = bld;
      }
      if (o.decor) G.sprinkle(g, r, side, o.decor, o.decorRate || 0.05);
      return toRows(g);
    },
    /* forêt clairsemée */
    forest: function (w, h, r, o) {
      o = o || {};
      var g = grid(w, h, o.floor || '.'), seed = r.int(1, 1e6);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var n = YN.rng.noise2(x * 0.15, y * 0.15, seed);
        if (r.next() < (o.density || 0.22) * (n * 1.5)) g[y][x] = o.tree || '^';
        else if (o.grass && r.next() < 0.1) g[y][x] = o.grass;
      }
      if (o.border) for (var i = 0; i < w; i++) { g[0][i] = g[h - 1][i] = o.tree || '^'; }
      if (o.border) for (var j = 0; j < h; j++) { g[j][0] = g[j][w - 1] = o.tree || '^'; }
      return toRows(g);
    },
    empty: function (w, h, r, o) { o = o || {}; var g = grid(w, h, o.floor || '.'); if (o.border) { for (var i = 0; i < w; i++) { g[0][i] = g[h - 1][i] = o.border; } for (var j = 0; j < h; j++) { g[j][0] = g[j][w - 1] = o.border; } } if (o.decor) G.sprinkle(g, r, o.floor || '.', o.decor, o.decorRate || 0.03); return toRows(g); },
    /* plateformes de côté */
    platform: function (w, h, r, o) {
      o = o || {};
      var g = grid(w, h, '.'), solid = o.solid || '#';
      for (var x = 0; x < w; x++) { g[h - 1][x] = solid; g[h - 2][x] = solid; }
      var y = h - 5;
      for (var x2 = 4; x2 < w - 4;) {
        var len = r.int(3, 7); y = U.clamp(y + r.int(-3, 2), 3, h - 4);
        for (var k = 0; k < len && x2 + k < w; k++) g[y][x2 + k] = r.chance(0.3) ? '-' : solid;
        if (r.chance(0.25)) { var gap = r.int(2, 3); for (var q = 0; q < gap; q++) if (x2 + len + q < w - 2) { g[h - 1][x2 + len + q] = '_'; g[h - 2][x2 + len + q] = '.'; } }
        if (o.hazard && r.chance(0.15)) g[h - 3][x2 + 1] = '!';
        x2 += len + r.int(1, 4);
      }
      for (var yy = 0; yy < h; yy++) { g[yy][0] = solid; g[yy][w - 1] = solid; }
      return toRows(g);
    },
    /* utilitaires */
    sprinkle: function (g, r, onCh, chars, rate) {
      for (var y = 1; y < g.length - 1; y++) for (var x = 1; x < g[0].length - 1; x++)
        if (g[y][x] === onCh && r.next() < rate) g[y][x] = typeof chars === 'string' ? chars[r.int(0, chars.length - 1)] : r.pick(chars);
    },
    blobs: function (g, r, ch, onCh, n) {
      for (var k = 0; k < n; k++) {
        var cx = r.int(2, g[0].length - 3), cy = r.int(2, g.length - 3), rad = r.int(1, 3);
        for (var y = cy - rad; y <= cy + rad; y++) for (var x = cx - rad; x <= cx + rad; x++)
          if (inb(g, x, y) && g[y][x] === onCh && (x - cx) * (x - cx) + (y - cy) * (y - cy) <= rad * rad) g[y][x] = ch;
      }
    },
    carveL: function (g, x0, y0, x1, y1, ch, r) {
      var x = x0, y = y0, horizFirst = r ? r.chance(0.5) : true;
      function set() { if (inb(g, x, y) && !passCh(g[y][x])) g[y][x] = ch; }
      if (horizFirst) { while (x !== x1) { set(); x += U.sign(x1 - x); } while (y !== y1) { set(); y += U.sign(y1 - y); } }
      else { while (y !== y1) { set(); y += U.sign(y1 - y); } while (x !== x1) { set(); x += U.sign(x1 - x); } }
      set();
    },
    /* relie toutes les zones accessibles à la plus grande */
    connectRegions: function (g, floor, r) {
      var h = g.length, w = g[0].length, lab = grid(w, h, -1), regions = [];
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        if (lab[y][x] !== -1 || !passCh(g[y][x])) continue;
        var q = [[x, y]], cells = [], id = regions.length; lab[y][x] = id;
        while (q.length) {
          var c = q.pop(); cells.push(c);
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
            var nx = c[0] + d[0], ny = c[1] + d[1];
            if (inb(g, nx, ny) && lab[ny][nx] === -1 && passCh(g[ny][nx])) { lab[ny][nx] = id; q.push([nx, ny]); }
          });
        }
        regions.push(cells);
      }
      if (regions.length < 2) return;
      regions.sort(function (a, b) { return b.length - a.length; });
      for (var i = 1; i < regions.length; i++) {
        var a = regions[i][0], b = r.pick(regions[0]);
        G.carveL(g, a[0], a[1], b[0], b[1], floor, r);
      }
    },
    /* plus court chemin (cases) — utilisé pour vérifier les cartes */
    bfs: function (rows, from, passFn) {
      var h = rows.length, w = rows[0].length, dist = new Int32Array(w * h).fill(-1), q = [from[0] + from[1] * w];
      dist[q[0]] = 0;
      passFn = passFn || function (ch) { return passCh(ch); };
      while (q.length) {
        var i = q.shift(), x = i % w, y = (i / w) | 0;
        var nb = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        for (var k = 0; k < 4; k++) {
          var nx = nb[k][0], ny = nb[k][1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          var j = nx + ny * w;
          if (dist[j] >= 0 || !passFn(rows[ny][nx], nx, ny)) continue;
          dist[j] = dist[i] + 1; q.push(j);
        }
      }
      return { dist: dist, w: w };
    },
    /* case libre aléatoire */
    findOpen: function (rows, r, filter) {
      for (var k = 0; k < 400; k++) {
        var y = r.int(1, rows.length - 2), x = r.int(1, rows[0].length - 2);
        if (rows[y][x] === '.' || (filter && filter(rows[y][x], x, y))) return [x, y];
      }
      return [1, 1];
    },
    /* incruste un motif dessiné à la main dans une carte générée */
    stamp: function (rows, piece, x0, y0) {
      var g = rows.map(function (s) { return s.split(''); });
      for (var y = 0; y < piece.length; y++) for (var x = 0; x < piece[y].length; x++) {
        var ch = piece[y][x];
        if (ch === '`') continue; // transparent
        if (inb(g, x0 + x, y0 + y)) g[y0 + y][x0 + x] = ch;
      }
      return toRows(g);
    },
    put: function (rows, x, y, ch) {
      if (y < 0 || y >= rows.length || x < 0 || x >= rows[y].length) return rows;
      rows[y] = rows[y].substring(0, x) + ch + rows[y].substring(x + 1);
      return rows;
    }
  };

  /* ================= MONDES INFINIS ================= */
  var CH = 32;
  YN.inf = {
    CH: CH,
    /* gen : function(cx, cy, rng, def) -> tableau de CH chaînes de CH caractères */
    make: function (def, seed) {
      var cache = {}, order = [], max = (def.inf && def.inf.cache) || 64, genFn = YN.infGen[def.inf.type] || YN.infGen.plain;
      var gen = {
        seed: seed, chunks: 0,
        chunk: function (cx, cy) {
          var k = cx + ',' + cy, c = cache[k];
          if (c) return c;
          var r = YN.rng.make((seed ^ Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663)) >>> 0);
          c = genFn(cx, cy, r, def, seed);
          cache[k] = c; order.push(k); gen.chunks++;
          if (order.length > max) { var old = order.shift(); delete cache[old]; }
          return c;
        },
        tile: function (x, y) {
          var cx = Math.floor(x / CH), cy = Math.floor(y / CH);
          var c = gen.chunk(cx, cy);
          return c[U.mod(y, CH)][U.mod(x, CH)];
        },
        cached: function () { return order.length; }
      };
      return gen;
    }
  };
  /* générateurs de tronçons */
  YN.infGen = {
    plain: function (cx, cy, r, def, seed) {
      var o = def.inf, g = grid(CH, CH, o.floor || '.');
      var dens = o.density === undefined ? 0.012 : o.density;
      for (var y = 0; y < CH; y++) for (var x = 0; x < CH; x++) {
        if (r.next() < dens) g[y][x] = r.pick(o.scatter || ['o']);
        else if (o.grass && r.next() < 0.03) g[y][x] = o.grass;
      }
      // repère rare au centre du tronçon (déterministe)
      if (o.landmarks && YN.rng.cell(cx, cy, seed) < (o.landmarkRate || 0.25)) g[16][16] = o.landmarks;
      if (cx === 0 && cy === 0) for (var yy = 12; yy < 20; yy++) for (var xx = 12; xx < 20; xx++) g[yy][xx] = o.floor || '.';
      return toRows(g);
    },
    city: function (cx, cy, r, def, seed) {
      var o = def.inf, g = grid(CH, CH, o.road || ','), b = 7;
      for (var y = 0; y < CH; y++) for (var x = 0; x < CH; x++) {
        var bx = U.mod(x, b + 1), by = U.mod(y, b + 1);
        if (bx === 0 || by === 0) g[y][x] = o.road || ',';
        else if (bx === 1 || by === 1 || bx === b || by === b) g[y][x] = o.side || '.';
        else g[y][x] = o.building || '#';
      }
      if (o.doors) for (var k = 0; k < 6; k++) { var px = r.int(0, 3) * (b + 1) + 2 + r.int(0, 4), py = r.int(0, 3) * (b + 1) + 2; if (px < CH && py < CH) g[py][px] = o.doors; }
      return toRows(g);
    },
    forest: function (cx, cy, r, def, seed) {
      var o = def.inf, g = grid(CH, CH, o.floor || '.');
      for (var y = 0; y < CH; y++) for (var x = 0; x < CH; x++) {
        var n = YN.rng.noise2((cx * CH + x) * 0.12, (cy * CH + y) * 0.12, seed);
        if (n > 0.55 && r.next() < 0.6) g[y][x] = o.tree || '^';
      }
      return toRows(g);
    },
    void: function (cx, cy, r, def) { var o = def.inf, g = grid(CH, CH, o.floor || '.'); if (o.scatter) for (var k = 0; k < 2; k++) g[r.int(0, CH - 1)][r.int(0, CH - 1)] = r.pick(o.scatter); return toRows(g); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
