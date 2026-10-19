/* =========================================================================
 *  MONDES IMMENSES — une carte en quartiers, retirée à chaque visite.
 *  Chaque quartier a sa forme : celle du monde (grotte, forêt, ville…) avec
 *  d'autres réglages, ou un lieu à part (clairière en anneau, lac et pont,
 *  jardin, ruines, petit dédale). Entre eux, d'épaisses bandes pleines
 *  (murs, arbres, eau) percées de quelques passages : de quoi se perdre, et de
 *  la place pour les cachettes (src/world/secrets.js y creuse ses pièces).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, G = YN.gen;

  function grid(w, h, ch) { var g = []; for (var y = 0; y < h; y++) { var row = []; for (var x = 0; x < w; x++) row.push(ch); g.push(row); } return g; }
  function passCh(ch) { var i = YN.tileInfo(ch); return !!(i.pass || YN.isMarkChar(ch)); }

  /* lieux à part, dessinés dans un rectangle w × h */
  var PIECES = {
    clearing: function (w, h, r, o) {
      var g = grid(w, h, o.floor), cx = w >> 1, cy = h >> 1, R = Math.max(3, Math.min(w, h) / 2 - 2);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy) * 1.4);
        if (Math.abs(d - R) < 0.7 && r.chance(0.75)) g[y][x] = o.tall;
        else if (d < R * 0.35 && o.flower) g[y][x] = o.flower;
      }
      if (r.chance(0.5)) for (var y2 = cy - 1; y2 <= cy + 1; y2++) for (var x2 = cx - 1; x2 <= cx + 1; x2++) g[y2][x2] = o.water || o.floor;
      return g;
    },
    lake: function (w, h, r, o) {
      var g = grid(w, h, o.floor), cx = w >> 1, cy = h >> 1, rx = w / 2 - 2, ry = h / 2 - 2, seed = r.int(1, 1e6);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var d = ((x - cx) * (x - cx)) / (rx * rx) + ((y - cy) * (y - cy)) / (ry * ry) + (YN.rng.noise2(x * 0.3, y * 0.3, seed) - 0.5) * 0.5;
        if (d < 0.75) g[y][x] = o.water || '~'; else if (d < 0.95) g[y][x] = o.shore || 'w';
      }
      var horiz = r.chance(0.5);
      if (horiz) for (var x3 = 0; x3 < w; x3++) { if (g[cy][x3] === (o.water || '~') || g[cy][x3] === (o.shore || 'w')) g[cy][x3] = '='; }
      else for (var y3 = 0; y3 < h; y3++) { if (g[y3][cx] === (o.water || '~') || g[y3][cx] === (o.shore || 'w')) g[y3][cx] = '='; }
      return g;
    },
    garden: function (w, h, r, o) {
      var g = grid(w, h, o.floor);
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        if (x % 4 === 0 && y % 3 !== 0) g[y][x] = r.chance(0.6) ? '*' : '+';
        else if (r.chance(0.05)) g[y][x] = o.tall;
      }
      return g;
    },
    ruins: function (w, h, r, o) {
      var rows = G.rooms(w, h, r, { wall: o.wall, floor: o.floor, depth: 3 }), g = rows.map(function (s) { return s.split(''); });
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) if (g[y][x] === o.wall && r.chance(0.28)) g[y][x] = r.chance(0.3) ? 'o' : o.floor; // murs écroulés
      return g;
    },
    knot: function (w, h, r, o) { return G.maze(w, h, r, { wall: o.wall, floor: o.floor, loops: 0.12 }).map(function (s) { return s.split(''); }); },
    // une clairière vide en apparence : un labyrinthe de murs invisibles, quelque chose au centre
    veil: function (w, h, r, o) { var g = G.maze(w, h, r, { wall: 'x', floor: o.floor, loops: 0.05 }).map(function (s) { return s.split(''); }); var cx = (w >> 1) | 1, cy = (h >> 1) | 1; if (g[cy] && g[cy][cx] !== undefined) g[cy][cx] = o.floor; G.vast._pieces.push({ kind: 'veil', cx: cx, cy: cy, w: w, h: h }); return g; }
  };
  var FAMILY = { // forme du monde → lieux à part qui lui vont, matière des bandes
    forest: { pieces: ['clearing', 'lake', 'garden', 'clearing', 'veil'], band: 'tall' },
    islands: { pieces: ['lake', 'clearing', 'garden', 'veil'], band: 'water' },
    cave: { pieces: ['lake', 'knot', 'clearing', 'ruins', 'veil'], band: 'wall' },
    city: { pieces: ['garden', 'ruins', 'clearing', 'knot', 'veil'], band: 'wall' },
    rooms: { pieces: ['ruins', 'knot', 'garden', 'veil'], band: 'wall' },
    maze: { pieces: ['knot', 'ruins', 'clearing', 'veil'], band: 'wall' },
    empty: { pieces: ['clearing', 'lake', 'ruins', 'garden', 'knot', 'veil'], band: 'wall' }
  };

  G.vast = function (w, h, r, o) {
    o = o || {};
    var base = o.base || 'cave', bo = o.baseOpts || {}, fam = FAMILY[base] || FAMILY.empty;
    var floor = bo.floor || bo.land || bo.side || '.', wall = bo.wall || bo.building || '#', tall = bo.tree || '^', water = bo.sea || '~';
    var bandCh = o.bandCh || (fam.band === 'tall' ? tall : fam.band === 'water' ? water : wall);
    var cols = o.cols || 3, rws = o.rows || 3, band = o.band || 5;
    var dw = Math.floor((w - band * (cols + 1)) / cols), dh = Math.floor((h - band * (rws + 1)) / rws);
    var g = grid(w, h, bandCh), cells = []; G.vast._pieces = []; G.vast.last = [];
    var po = { floor: floor, wall: wall, tall: tall, water: water, shore: bo.shore || 'w', flower: bo.flower || null };
    for (var j = 0; j < rws; j++) for (var i = 0; i < cols; i++) {
      var x0 = band + i * (dw + band), y0 = band + j * (dh + band), sub;
      // un quartier sur trois environ est un lieu à part ; jamais deux fois le même côte à côte
      if (r.chance(o.pieceRate === undefined ? 0.35 : o.pieceRate)) { var pk = fam.pieces[r.int(0, fam.pieces.length - 1)], n0 = G.vast._pieces.length; sub = PIECES[pk](dw, dh, r, po); G.vast._pieces.slice(n0).forEach(function (pc) { G.vast.last.push({ kind: pc.kind, x: x0 + pc.cx, y: y0 + pc.cy }); }); }
      else {
        var opts = Object.assign({}, bo);
        if (base === 'cave') opts.fill = (bo.fill || 0.44) + (r.next() - 0.5) * 0.08;
        if (base === 'forest') opts.density = (bo.density || 0.22) * (0.6 + r.next() * 0.9);
        if (base === 'maze') opts.loops = 0.04 + r.next() * 0.12;
        if (base === 'city') opts.block = Math.max(4, (bo.block || 6) + r.int(-2, 2));
        if (base === 'islands') opts.level = (bo.level || 0.58) + (r.next() - 0.5) * 0.08;
        var fn = G[base] || G.empty;
        sub = fn(dw, dh, r, opts).map(function (s) { return s.split(''); });
      }
      for (var yy = 0; yy < dh; yy++) for (var xx = 0; xx < dw; xx++) { var ch = (sub[yy] || [])[xx]; if (ch !== undefined) g[y0 + yy][x0 + xx] = ch; }
      cells.push({ i: i, j: j, x0: x0, y0: y0 });
    }
    // passages à travers les bandes : un ou deux entre voisins, creusés jusqu'au sol de chaque côté
    var dig = function (x, y, dx, dy, max) { for (var k = 0; k < max; k++) { var cx = x + dx * k, cy = y + dy * k; if (cx < 1 || cy < 1 || cx >= w - 1 || cy >= h - 1) return; if (k > 0 && passCh(g[cy][cx])) return; g[cy][cx] = floor; } };
    cells.forEach(function (c) {
      [[1, 0], [0, 1]].forEach(function (d) {
        var ni = c.i + d[0], nj = c.j + d[1]; if (ni >= cols || nj >= rws) return;
        var n = r.chance(0.35) ? 2 : 1;
        for (var t = 0; t < n; t++) {
          if (d[0]) { var py = c.y0 + r.int(2, dh - 3), bx = c.x0 + dw; dig(bx, py, 1, 0, band + 1); dig(bx - 1, py, -1, 0, 14); dig(bx + band, py, 1, 0, 14); }
          else { var px = c.x0 + r.int(2, dw - 3), by = c.y0 + dh; dig(px, by, 0, 1, band + 1); dig(px, by - 1, 0, -1, 14); dig(px, by + band, 0, 1, 14); }
        }
      });
    });
    G.connectRegions(g, floor, r);
    if (bo.decor) G.sprinkle(g, r, floor, bo.decor, (bo.decorRate || 0.03) * 0.7);
    return g.map(function (row) { return row.join(''); });
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* le centre d'un labyrinthe invisible garde une pièce de collection, ou à défaut un petit coin habité */
(function (root) {
  'use strict';
  var YN = root.YN;
  YN.vast = {
    populate: function (rt) {
      (rt.vastPieces || []).forEach(function (pc, i) {
        if (pc.kind !== 'veil' || rt.markAt(pc.x, pc.y)) return;
        if (YN.collect && YN.collect.placeIn(rt, pc.x, pc.y)) return;
        YN.world.addMark(rt, { id: 'veil_' + i, type: 'decor', look: 'sparkle', lookOpt: { c: ['#f0f0ff'] }, solid: false, flat: true, animated: true, lines: ['In the middle of nothing, a little light that was waiting to be reached.'] }, pc.x, pc.y, null);
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
