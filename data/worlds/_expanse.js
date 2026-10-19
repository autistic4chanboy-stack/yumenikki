/* =========================================================================
 *  L'ÉTENDUE — chargé après tous les mondes.
 *   1. Les mondes générés deviennent beaucoup plus grands.
 *   2. Une quinzaine d'entre eux bouclent (on en fait le tour sans bord).
 *   3. Les cartes dessinées en plein air reçoivent une annexe à l'est :
 *      on passe par une brèche dans le bord, et le rêve continue.
 *   4. Des passages latéraux relient les mondes voisins d'un même thème
 *      (les 40 premiers entre eux, les mondes secrets entre eux ; jamais la
 *      sixième couche, jamais les mondes à apparition).
 *  Rien n'est retiré : seules des surfaces et des portes s'ajoutent.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, W = YN.data.worlds;
  var ids = U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); }).sort();
  var SPAWN = {}; ids.forEach(function (k) { if (W[k].spawnRule) SPAWN[k] = 1; });
  var NO = { W040: 1, W189: 1, W191: 1, W166: 1, W127: 1, W154: 1, W155: 1, W182: 1, W193: 1, W198: 1, W159: 1, W190: 1, W172: 1 };

  /* une carte a-t-elle des coordonnées fixes (qu'un agrandissement casserait) ? */
  function hasFixed(d) {
    var fixed = false, chk = function (a) { if (Array.isArray(a) && typeof a[0] === 'number') fixed = true; };
    YN.net.markDefs(d).forEach(function (m) { chk(m.at); });
    (d.npcs || []).forEach(function (n) { chk(n.at); var e = YN.data.entities[n.id]; if (e && (e.path || e.center || Array.isArray(e.at))) fixed = true; });
    (d.mech || []).forEach(function (m) { ['zone', 'center', 'path', 'start', 'lineY', 'at', 'points', 'cells'].forEach(function (k) { if (m[k] !== undefined) fixed = true; }); });
    if (d.gen && d.gen.stamps) fixed = true;
    return fixed;
  }
  function negCoords(d) { var neg = false; YN.net.markDefs(d).forEach(function (m) { if (Array.isArray(m.at) && (m.at[0] < 0 || m.at[1] < 0)) neg = true; }); (d.npcs || []).forEach(function (n) { if (Array.isArray(n.at) && (n.at[0] < 0 || n.at[1] < 0)) neg = true; }); return neg; }

  /* ---------- 1 et 2 : grands mondes générés, certains en boucle ---------- */
  var SCALE = { city: 1.7, empty: 1.7, forest: 1.7, islands: 1.6, cave: 1.45, rooms: 1.45, maze: 1.35 };
  var LOOP = { W051: 1, W070: 1, W074: 1, W093: 1, W114: 1, W129: 1, W130: 1, W136: 1, W162: 1, W164: 1, W167: 1, W169: 1, W176: 1, W179: 1, W185: 1, W104: 1 };
  var grown = [], looped = [];
  ids.forEach(function (id) {
    var d = W[id], g = d.gen; if (!g || d.inf || NO[id] || hasFixed(d) || d.noExpand) return;
    var k = SCALE[g.type]; if (!k) return;
    g.w = Math.min(110, Math.round((g.w || 40) * k)); g.h = Math.min(90, Math.round((g.h || 30) * k));
    grown.push(id);
    if (LOOP[id] && !d.wrap) {
      d.wrap = true; d.loop = true; looped.push(id);
      if (g.opts) { if (g.opts.border) g.opts.border = false; if (g.type === 'empty') delete g.opts.border; }
      d.info = d.info || {}; d.info.rules = (d.info.rules || []).concat(['The world loops: walk straight ahead and you come back to where you started.']);
    }
    if (d.furnishDensity === undefined) d.furnishDensity = 80;
  });

  /* ---------- 3 : annexes des cartes dessinées en plein air ---------- */
  function passCh(ch) { var ti = YN.tileInfo(ch); return ti.pass && !ti.water && !ti.pit && !ti.hazard && !ti.slide; }
  function wallCh(ch) { var ti = YN.tileInfo(ch); return ti.wall || ti.tall; }
  var annexed = [];
  ids.forEach(function (id) {
    var d = W[id];
    if (!d.map || !d.outdoor || d.wrap || d.inf || NO[id] || SPAWN[id] || (d.depth || 0) < 1 || (d.depth || 0) > 4 || negCoords(d) || d.noExpand) return;
    if (d.style && (d.style.view === 'side' || d.style.view === 'fps')) return;
    var map = d.map, h = map.length, w = map[0].length;
    if (h < 8 || w < 12 || w > 90) return;
    // une brèche possible sur le bord est : rangées où l'avant-dernière colonne est franchissable
    var rowsOk = []; for (var y = 1; y < h - 1; y++) { var a = map[y][w - 1], b = map[y][w - 2]; if (passCh(b) && (wallCh(a) || a === ' ' || passCh(a))) rowsOk.push(y); }
    if (rowsOk.length < 2) return;
    // le caractère de sol le plus courant et le caractère de mur
    var cnt = {}; map.forEach(function (r) { for (var i = 0; i < r.length; i++) cnt[r[i]] = (cnt[r[i]] || 0) + 1; });
    var floor = U.keys(cnt).filter(function (c) { return passCh(c) && /[.,;:]/.test(c); }).sort(function (p, q) { return cnt[q] - cnt[p]; })[0] || '.';
    var wall = U.keys(cnt).filter(function (c) { return YN.tileInfo(c).wall; }).sort(function (p, q) { return cnt[q] - cnt[p]; })[0] || '#';
    var aw = Math.max(26, Math.min(64, Math.round(w * 0.9)));
    var r = YN.rng.make(YN.rng.hash('annexe:' + id));
    var rows = []; for (var yy = 0; yy < h; yy++) { var row = ''; for (var xx = 0; xx < aw; xx++) { var edge = yy === 0 || yy === h - 1 || xx === aw - 1; row += edge ? wall : floor; } rows.push(row); }
    var g = rows.map(function (s) { return s.split(''); });
    var th = YN.furnish ? YN.furnish.themeOf(d) : 'nature';
    var tallC = U.keys(cnt).filter(function (c) { var ti = YN.tileInfo(c); return ti.tall && !ti.wall; }).sort(function (p, q) { return cnt[q] - cnt[p]; })[0];
    var inside = function (x, y) { return y > 0 && y < h - 1 && x > 1 && x < aw - 1; };
    if (th === 'city') {
      // des pâtés de maisons et des rues
      var bw = r.int(5, 7), bh = r.int(4, 6), ox = r.int(3, 5), oy = r.int(2, 3);
      for (var by = oy; by < h - 2; by += bh + 3) for (var bx = ox; bx < aw - 3; bx += bw + 3) {
        if (r.next() < 0.18) continue; // une place vide, parfois
        for (var y2 = by; y2 < Math.min(h - 2, by + bh); y2++) for (var x2 = bx; x2 < Math.min(aw - 2, bx + bw); x2++) g[y2][x2] = wall;
      }
    } else if (tallC && (th === 'nature' || th === 'snow' || th === 'beach')) {
      // des bosquets et des clairières
      var sd = r.int(1, 1e6);
      for (var y3 = 1; y3 < h - 1; y3++) for (var x3 = 2; x3 < aw - 1; x3++) { var nz = YN.rng.noise2(x3 * 0.18, y3 * 0.18, sd); if (nz > 0.62 && r.next() < 0.55) g[y3][x3] = tallC; }
    } else {
      // des massifs pour donner une forme
      for (var k = 0; k < Math.round(aw * h / 120); k++) { var cx = r.int(3, aw - 4), cy = r.int(2, h - 3), rx = r.int(1, 3), ry = r.int(1, 2); for (var dy = -ry; dy <= ry; dy++) for (var dx = -rx; dx <= rx; dx++) if (inside(cx + dx, cy + dy) && (dx * dx) / (rx * rx + 0.5) + (dy * dy) / (ry * ry + 0.5) <= 1) g[cy + dy][cx + dx] = wall; }
    }
    // la brèche : trois rangées au milieu des rangées possibles, et un couloir dégagé de l'autre côté
    var mid = rowsOk[Math.floor(rowsOk.length / 2)], gap = rowsOk.filter(function (y) { return Math.abs(y - mid) <= 1; });
    var base = map.map(function (s) { return s.split(''); });
    gap.forEach(function (y) { base[y][w - 1] = floor; for (var x = 0; x < 6 && x < aw - 1; x++) g[y][x] = floor; });
    // tout l'espace de l'annexe doit communiquer : on relie les poches au couloir
    if (YN.gen && YN.gen.connectRegions) { try { YN.gen.connectRegions(g, floor, r); } catch (e) { } }
    d.map = base.map(function (row, y) { return row.join('') + g[y].join(''); });
    d.annex = { x: w, w: aw };
    if (d.furnishDensity === undefined) d.furnishDensity = 70;
    d.info = d.info || {};
    annexed.push(id);
  });

  /* ---------- 4 : passages latéraux entre mondes voisins ---------- */
  YN.net.build();
  function degree(id) { var s = {}; (YN.net.edges[id] || []).forEach(function (e) { s[e.to] = 1; }); (YN.net.rev[id] || []).forEach(function (e) { s[e.from] = 1; }); return U.keys(s).length; }
  function linked(a, b) { return (YN.net.edges[a] || []).some(function (e) { return e.to === b; }) || (YN.net.edges[b] || []).some(function (e) { return e.to === a; }); }
  var LOOKS = { nature: ['gate', { c: ['#6a5a3a'] }, 'a path through the grass'], beach: ['boat', {}, 'a rowing boat pulled up on the sand'], city: ['door', { style: 'metal', c: ['#5a5a6a'] }, 'an alley'], home: ['door', { style: 'wood', c: ['#6a4a3a'] }, 'one more door'], institution: ['door', { style: 'metal', c: ['#7a8a8a'] }, 'a service corridor'], office: ['elevator', {}, 'a service lift'], north: ['door', { style: 'red', c: ['#8a2020'] }, 'a service door'], abstract: ['hole', {}, 'a passage'], snow: ['gate', { c: ['#c8d0d8'] }, 'tracks in the snow'], water: ['hole', {}, 'a current'], korea: ['door', { style: 'shoji', c: ['#e8e0c8'] }, 'a sliding door'] };
  // un monde dont toutes les entrées demandent quelque chose (la récompense d'une énigme) ne reçoit pas de passage de traverse
  function gated(id) { var inc = (YN.net.rev[id] || []).filter(function (e) { return e.from !== id && e.kind !== 'spawn'; }); return inc.length > 0 && inc.every(function (e) { return !!e.cond; }); }
  YN.data.gated = {}; ids.forEach(function (id) { if (gated(id)) YN.data.gated[id] = true; });
  var pool = ids.filter(function (id) { var d = W[id]; return !NO[id] && !SPAWN[id] && !YN.data.gated[id] && (d.depth || 0) >= 1 && (d.depth || 0) <= 4 && !d.debugWorld && !(d.style && (d.style.view === 'side' || d.style.view === 'fps')); });
  var theme = {}; pool.forEach(function (id) { theme[id] = YN.furnish ? YN.furnish.themeOf(W[id]) : 'nature'; });
  var pairs = [];
  pool.forEach(function (a) {
    if (degree(a) >= 5) return;
    var cand = pool.filter(function (b) { return b !== a && !!W[a].core === !!W[b].core && Math.abs((W[a].depth || 0) - (W[b].depth || 0)) <= 1 && theme[a] === theme[b] && !linked(a, b) && degree(b) < 6; });
    if (!cand.length) cand = pool.filter(function (b) { return b !== a && !!W[a].core === !!W[b].core && (W[a].depth || 0) === (W[b].depth || 0) && !linked(a, b) && degree(b) < 5; });
    if (!cand.length) return;
    var r = YN.rng.make(YN.rng.hash('lien:' + a));
    cand.sort(function (p, q) { return Math.abs(W[p].depth - W[a].depth) - Math.abs(W[q].depth - W[a].depth) || (YN.rng.hash(a + p) % 97) - (YN.rng.hash(a + q) % 97); });
    var b = cand[r.int(0, Math.min(2, cand.length - 1))];
    pairs.push([a, b]);
    [[a, b], [b, a]].forEach(function (ab) {
      var lk = LOOKS[theme[ab[0]]] || LOOKS.abstract, d = W[ab[0]];
      var md = { id: 'side_' + ab[1], type: lk[0] === 'hole' ? 'hole' : lk[0] === 'elevator' ? 'elevator' : 'door', to: ab[1], look: lk[0], lookOpt: lk[1], at: 'random-any', label: lk[2], lateral: true };
      if (md.type === 'hole') md.type = 'door'; // un passage latéral se reprend dans les deux sens
      d.place = (d.place || []).concat([md]);
    });
    YN.net.build();
  });

  YN.expanse = { grown: grown, looped: looped, annexed: annexed, pairs: pairs };
})(typeof window !== 'undefined' ? window : globalThis);
