/* =========================================================================
 *  PEINTURE PROCÉDURALE HAUTE DÉFINITION
 *  Outils de dessin (formes ombrées, feuillages, ombres) et matières
 *  (herbe, terre, bois, pierre, carrelage, neige...) peintes en coordonnées
 *  du monde : deux blocs voisins se raccordent sans couture.
 *  Une « zone » = { wx0, wy0, w, h (en cases), tpx (pixels par case), seed }.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var P = YN.paint = {};
  var texCache = {};

  /* toile de travail : en mémoire (les relectures de pixels y sont rapides) ; gpu = vraie toile d'affichage */
  P.mk = function (w, h, gpu) {
    var c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    var x = null; if (!gpu) { try { x = c.getContext('2d', { willReadFrequently: true }); } catch (e) { x = null; } }
    return { c: c, x: x || c.getContext('2d') };
  };
  /* recopie une image finie vers une toile d'affichage (dessinée vite à chaque image) */
  P.toGpu = function (src) {
    if (!src || !src.width || typeof document === 'undefined') return src;
    var g = document.createElement('canvas'); g.width = src.width; g.height = src.height;
    var gx = g.getContext('2d'); if (!gx || !gx.drawImage) return src;
    gx.drawImage(src, 0, 0);
    if (src.ax !== undefined) g.ax = src.ax; if (src.ay !== undefined) g.ay = src.ay;
    return g;
  };
  /* version d'affichage d'une texture, gardée avec elle (pour les motifs peints à chaque image) */
  P.gpu = function (c) { if (!c) return c; if (!c._gpu) c._gpu = P.toGpu(c); return c._gpu; };
  P.rgba = function (hex, a) {
    if (typeof hex !== 'string' || hex[0] !== '#') return hex;
    var r = U.hexToRgb(hex); return 'rgba(' + r[0] + ',' + r[1] + ',' + r[2] + ',' + a + ')';
  };
  P.sh = function (hex, f) { return (typeof hex === 'string' && hex[0] === '#') ? U.shade(hex, f) : hex; };
  P.cell = function (x, y, s) { return YN.rng.cell(x, y, s); };
  P.rng = function (tx, ty, s) { return YN.rng.make(((Math.imul(tx | 0, 73856093) ^ Math.imul(ty | 0, 19349663) ^ Math.imul(s | 0, 83492791)) >>> 0) || 1); };

  /* ---------- textures répétables (grain, papier, caustiques) ---------- */
  P.speckle = function (size, seed, light, dark, dens) {
    var k = 'sp|' + size + '|' + seed + '|' + light + '|' + dark + '|' + dens;
    if (texCache[k]) return texCache[k];
    var t = P.mk(size, size), r = YN.rng.make(seed), n = Math.floor(size * size * (dens || 0.02));
    for (var i = 0; i < n; i++) {
      t.x.fillStyle = r.chance(0.5) ? light : dark;
      var s = r.chance(0.8) ? 1 : 2; t.x.fillRect(r.int(0, size - 1), r.int(0, size - 1), s, s);
    }
    texCache[k] = t.c; return t.c;
  };
  P.paperTex = function (size) {
    var k = 'paper|' + size; if (texCache[k]) return texCache[k];
    var t = P.mk(size, size), img = t.x.createImageData(size, size), d = img.data;
    for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
      var n = YN.rng.noise2(x * 0.08, y * 0.08, 5) * 0.5 + YN.rng.noise2(x * 0.5, y * 0.5, 9) * 0.3 + YN.rng.cell(x, y, 3) * 0.2;
      var v = 225 + n * 30, i = (y * size + x) * 4;
      d[i] = v; d[i + 1] = v - 4; d[i + 2] = v - 14; d[i + 3] = 255;
    }
    t.x.putImageData(img, 0, 0); texCache[k] = t.c; return t.c;
  };
  P.grainTex = function (size) {
    var k = 'grain|' + size; if (texCache[k]) return texCache[k];
    var t = P.mk(size, size), img = t.x.createImageData(size, size), d = img.data;
    for (var i = 0; i < size * size; i++) { var v = Math.random() * 255; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; }
    t.x.putImageData(img, 0, 0); texCache[k] = t.c; return t.c;
  };
  P.causticTex = function (size) {
    var k = 'caus|' + size; if (texCache[k]) return texCache[k];
    var t = P.mk(size, size), x = t.x, r = YN.rng.make(77);
    x.strokeStyle = 'rgba(255,255,255,0.9)'; x.lineCap = 'round';
    for (var i = 0; i < 22; i++) {
      var cx = r.next() * size, cy = r.next() * size, len = size * (0.08 + r.next() * 0.12), a = r.next() * 0.6 - 0.3;
      x.lineWidth = Math.max(1, size / 140) * (1 + r.next());
      for (var ox = -size; ox <= size; ox += size) for (var oy = -size; oy <= size; oy += size) {
        x.beginPath(); x.moveTo(cx + ox - len, cy + oy); x.quadraticCurveTo(cx + ox, cy + oy - len * 0.3 + a * len, cx + ox + len, cy + oy); x.stroke();
      }
    }
    texCache[k] = t.c; return t.c;
  };
  P.patternAt = function (x, tex, area, alpha, op) {
    var pat = x.createPattern(tex, 'repeat');
    var ox = -U.mod(area.wx0 * area.tpx, tex.width), oy = -U.mod(area.wy0 * area.tpx, tex.height);
    if (pat.setTransform && root.DOMMatrix) pat.setTransform(new DOMMatrix().translateSelf(ox, oy));
    x.save(); x.globalAlpha = alpha === undefined ? 1 : alpha; if (op) x.globalCompositeOperation = op;
    x.fillStyle = pat; x.fillRect(0, 0, area.w * area.tpx, area.h * area.tpx); x.restore();
  };

  /* ---------- taches de bruit (couleur, basse fréquence) ---------- */
  P.blotches = function (x, area, color, freq, seed, strength, lo, hi) {
    var step = 0.25, gw = Math.ceil(area.w / step) + 3, gh = Math.ceil(area.h / step) + 3;
    var t = P.mk(gw, gh), img = t.x.createImageData(gw, gh), d = img.data, rgb = U.hexToRgb(color);
    lo = lo === undefined ? 0.35 : lo; hi = hi === undefined ? 0.75 : hi;
    for (var j = 0; j < gh; j++) for (var i = 0; i < gw; i++) {
      var wx = area.wx0 + (i - 1) * step, wy = area.wy0 + (j - 1) * step;
      var n = YN.rng.noise2(wx * freq, wy * freq, seed) * 0.7 + YN.rng.noise2(wx * freq * 2.7, wy * freq * 2.7, seed + 17) * 0.3;
      var a = U.smooth(U.clamp((n - lo) / (hi - lo), 0, 1)) * strength;
      var k = (j * gw + i) * 4; d[k] = rgb[0]; d[k + 1] = rgb[1]; d[k + 2] = rgb[2]; d[k + 3] = a * 255;
    }
    t.x.putImageData(img, 0, 0);
    x.save(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    var s = area.tpx * step;
    x.drawImage(t.c, -s, -s, gw * s, gh * s);
    x.restore();
  };
  P.eachTile = function (area, margin, fn) {
    var m = margin === undefined ? 1 : margin;
    for (var ty = Math.floor(area.wy0) - m; ty < area.wy0 + area.h + m; ty++)
      for (var tx = Math.floor(area.wx0) - m; tx < area.wx0 + area.w + m; tx++)
        fn(tx, ty, (tx - area.wx0) * area.tpx, (ty - area.wy0) * area.tpx, P.rng(tx, ty, area.seed));
  };

  /* ---------- formes ---------- */
  P.ellipse = function (x, cx, cy, rx, ry, fill, rot) { x.beginPath(); x.ellipse(cx, cy, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } };
  P.shadow = function (x, cx, cy, rx, ry, a) {
    var g = x.createRadialGradient(cx, cy, 0, cx, cy, rx);
    g.addColorStop(0, 'rgba(10,8,20,' + (a || 0.35) + ')'); g.addColorStop(0.7, 'rgba(10,8,20,' + (a || 0.35) * 0.5 + ')'); g.addColorStop(1, 'rgba(10,8,20,0)');
    x.save(); x.translate(cx, cy); x.scale(1, ry / rx); x.translate(-cx, -cy);
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rx, 0, Math.PI * 2); x.fill(); x.restore();
  };
  /* sphère/ellipse ombrée : lumière en haut à gauche */
  P.ball = function (x, cx, cy, rx, ry, col, o) {
    o = o || {};
    var g = x.createRadialGradient(cx - rx * 0.35, cy - ry * 0.45, Math.min(rx, ry) * 0.1, cx, cy, Math.max(rx, ry) * 1.05);
    g.addColorStop(0, P.sh(col, o.hi === undefined ? 0.28 : o.hi)); g.addColorStop(0.55, col); g.addColorStop(1, P.sh(col, o.lo === undefined ? -0.38 : o.lo));
    P.ellipse(x, cx, cy, rx, ry, g);
    if (o.line) { x.lineWidth = o.lw || 1; x.strokeStyle = o.line; x.stroke(); }
  };
  P.rr = function (x, x0, y0, w, h, r) {
    r = Math.min(r, w / 2, h / 2); x.beginPath();
    x.moveTo(x0 + r, y0); x.lineTo(x0 + w - r, y0); x.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r); x.lineTo(x0 + w, y0 + h - r);
    x.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h); x.lineTo(x0 + r, y0 + h); x.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r); x.lineTo(x0, y0 + r); x.quadraticCurveTo(x0, y0, x0 + r, y0); x.closePath();
  };
  /* boîte en perspective 3/4 : dessus + face avant */
  P.box = function (x, x0, y0, w, h, depth, top, front, o) {
    o = o || {};
    var gf = x.createLinearGradient(0, y0 + depth, 0, y0 + depth + h);
    gf.addColorStop(0, P.sh(front, 0.06)); gf.addColorStop(1, P.sh(front, -0.22));
    P.rr(x, x0, y0 + depth, w, h, o.r || 0); x.fillStyle = gf; x.fill();
    var gt = x.createLinearGradient(x0, y0, x0 + w, y0 + depth);
    gt.addColorStop(0, P.sh(top, 0.16)); gt.addColorStop(1, top);
    P.rr(x, x0, y0, w, depth, o.r || 0); x.fillStyle = gt; x.fill();
    if (o.line) { x.strokeStyle = o.line; x.lineWidth = o.lw || 1; P.rr(x, x0, y0, w, depth + h, o.r || 0); x.stroke(); }
  };
  /* touffe de feuillage : beaucoup de petites boules */
  P.foliage = function (x, cx, cy, rx, ry, cols, seed, o) {
    o = o || {};
    var r = YN.rng.make(seed || 1), n = o.n || Math.round(14 + rx * ry / 40);
    P.ball(x, cx, cy, rx, ry, cols[1] || cols[0], { hi: 0.1, lo: -0.45 });
    for (var i = 0; i < n; i++) {
      var a = r.next() * Math.PI * 2, d = Math.sqrt(r.next());
      var px = cx + Math.cos(a) * rx * d * 0.85, py = cy + Math.sin(a) * ry * d * 0.85;
      var lit = (cx - px) / rx * 0.5 + (cy - py) / ry * 0.7; // haut gauche plus clair
      var col = lit > 0.25 ? (cols[2] || cols[0]) : lit < -0.35 ? (cols[1] || cols[0]) : cols[0];
      var s = (o.leaf || 0.2) * Math.min(rx, ry) * (0.6 + r.next() * 0.7);
      P.ball(x, px, py, s, s * 0.85, col, { hi: 0.18, lo: -0.3 });
    }
    if (o.rim !== false) { x.save(); x.globalCompositeOperation = 'source-atop'; var g = x.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry); g.addColorStop(0, 'rgba(255,255,220,0.16)'); g.addColorStop(0.5, 'rgba(255,255,220,0)'); g.addColorStop(1, 'rgba(0,0,30,0.22)'); x.fillStyle = g; x.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, ry * 2.4); x.restore(); }
  };
  P.leaf = function (x, cx, cy, len, ang, col, vein) {
    x.save(); x.translate(cx, cy); x.rotate(ang);
    x.beginPath(); x.moveTo(-len / 2, 0); x.quadraticCurveTo(0, -len * 0.38, len / 2, 0); x.quadraticCurveTo(0, len * 0.38, -len / 2, 0);
    x.fillStyle = col; x.fill();
    if (vein) { x.strokeStyle = vein; x.lineWidth = Math.max(0.5, len / 14); x.beginPath(); x.moveTo(-len / 2, 0); x.lineTo(len / 2, 0); x.stroke(); }
    x.restore();
  };
  P.flower = function (x, cx, cy, r, petal, heart) {
    for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; P.ellipse(x, cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6, r * 0.5, r * 0.5, petal); }
    P.ellipse(x, cx, cy, r * 0.38, r * 0.38, heart || '#f8d860');
  };
  P.blade = function (x, bx, by, h, lean, col, w) {
    x.strokeStyle = col; x.lineWidth = w || Math.max(1, h / 6); x.lineCap = 'round';
    x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + lean * 0.3, by - h * 0.6, bx + lean, by - h); x.stroke();
  };
  P.stroke = function (x, pts, col, w) {
    x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.stroke();
  };

  /* =================== MATIÈRES DE SOL =================== */
  function C(c, i, d) { return (c && c[i]) || d; }
  function base(x, area, col) { x.fillStyle = col; x.fillRect(0, 0, area.w * area.tpx, area.h * area.tpx); }
  var MAT = P.MAT = {};

  MAT.flat = function (x, a, c) { base(x, a, C(c, 0, '#3a3a44')); P.blotches(x, a, C(c, 1, P.sh(C(c, 0, '#3a3a44'), -0.15)), 0.35, a.seed, 0.35); P.patternAt(x, P.speckle(128, 3, 'rgba(255,255,255,0.06)', 'rgba(0,0,0,0.08)', 0.05), a); };
  MAT.void = function () { };
  MAT.blank = function () { };
  MAT.grass = function (x, a, c, o) {
    var g0 = C(c, 0, '#4a8a3c'), dark = C(c, 1, P.sh(g0, -0.2)), light = C(c, 2, P.sh(g0, 0.2)), deep = C(c, 3, P.sh(g0, -0.35));
    base(x, a, g0);
    P.blotches(x, a, deep, 0.12, a.seed + 1, 0.45, 0.45, 0.8);
    P.blotches(x, a, light, 0.18, a.seed + 2, 0.35, 0.5, 0.85);
    P.blotches(x, a, dark, 0.5, a.seed + 3, 0.25);
    P.patternAt(x, P.speckle(160, 11, P.rgba(light, 0.35), P.rgba(deep, 0.3), 0.06), a);
    var t = a.tpx;
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      var n = (o && o.sparse) ? 5 : 11;
      for (var i = 0; i < n; i++) {
        var bx = px + r.next() * t, by = py + r.next() * t, h = t * (0.08 + r.next() * 0.1);
        P.blade(x, bx, by, h, (r.next() - 0.5) * t * 0.08, r.chance(0.5) ? P.rgba(light, 0.75) : P.rgba(deep, 0.6), Math.max(1, t / 48));
      }
      if (r.chance(o && o.flowers ? 0.6 : 0.12)) {
        var fx = px + r.next() * t, fy = py + r.next() * t;
        P.flower(x, fx, fy, t * 0.045, r.pick(['#ffffff', '#f8e070', '#f0a0c0', '#c0d0ff']), '#f8d050');
      }
    });
  };
  MAT.meadow = function (x, a, c) { MAT.grass(x, a, c, { flowers: true }); };
  MAT.moss = function (x, a, c) { MAT.grass(x, a, c, { sparse: true }); };
  MAT.dirt = function (x, a, c) {
    var d0 = C(c, 0, '#8a6a44'), dark = C(c, 1, P.sh(d0, -0.18)), light = C(c, 2, P.sh(d0, 0.15));
    base(x, a, d0);
    P.blotches(x, a, dark, 0.3, a.seed + 4, 0.4);
    P.blotches(x, a, light, 0.22, a.seed + 5, 0.3, 0.55, 0.85);
    P.patternAt(x, P.speckle(128, 21, P.rgba(light, 0.5), P.rgba(dark, 0.5), 0.08), a);
    var t = a.tpx;
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      for (var i = 0; i < 3; i++) if (r.chance(0.6)) {
        var sx = px + r.next() * t, sy = py + r.next() * t, s = t * (0.025 + r.next() * 0.035);
        P.ellipse(x, sx + s * 0.3, sy + s * 0.4, s * 1.1, s * 0.6, 'rgba(0,0,0,0.18)');
        P.ball(x, sx, sy, s, s * 0.75, r.pick([P.sh(d0, 0.3), '#a09888', '#8a8478']), { hi: 0.3 });
      }
    });
  };
  MAT.path = MAT.dirt;
  MAT.sand = function (x, a, c) {
    var s0 = C(c, 0, '#d8c08a'); base(x, a, s0);
    P.blotches(x, a, C(c, 1, P.sh(s0, -0.12)), 0.25, a.seed + 6, 0.4);
    var t = a.tpx; x.strokeStyle = P.rgba(P.sh(s0, -0.15), 0.4); x.lineWidth = Math.max(1, t / 40);
    P.eachTile(a, 1, function (tx, ty, px, py, r) { for (var i = 0; i < 2; i++) { var yy = py + r.next() * t; x.beginPath(); x.moveTo(px, yy); x.quadraticCurveTo(px + t / 2, yy - t * 0.08, px + t, yy); x.stroke(); } });
    P.patternAt(x, P.speckle(128, 31, 'rgba(255,255,255,0.25)', 'rgba(90,60,20,0.2)', 0.12), a);
  };
  MAT.soil = function (x, a, c) {
    var s0 = C(c, 0, '#5a3e26'); base(x, a, s0);
    var t = a.tpx;
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      for (var k = 0; k < 3; k++) { var yy = py + (k + 0.5) * t / 3; var g = x.createLinearGradient(0, yy - t / 8, 0, yy + t / 8); g.addColorStop(0, P.sh(s0, 0.12)); g.addColorStop(1, P.sh(s0, -0.25)); x.fillStyle = g; x.fillRect(px, yy - t / 8, t, t / 4); }
    });
    P.patternAt(x, P.speckle(128, 41, 'rgba(255,220,180,0.12)', 'rgba(0,0,0,0.3)', 0.08), a);
  };
  MAT.leaves = function (x, a, c) {
    var g0 = C(c, 0, '#3f7a38'); MAT.grass(x, a, [g0, P.sh(g0, -0.2), P.sh(g0, 0.15)], { sparse: true });
    var t = a.tpx, cols = c.slice(1);
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      for (var i = 0; i < 9; i++) { var col = r.pick(cols); P.leaf(x, px + r.next() * t, py + r.next() * t, t * (0.12 + r.next() * 0.08), r.next() * 6.28, col, P.sh(col, -0.25)); }
    });
  };
  MAT.flowers = function (x, a, c) {
    MAT.grass(x, a, [C(c, 0, '#3f7a3c')]);
    var t = a.tpx;
    P.eachTile(a, 1, function (tx, ty, px, py, r) { for (var i = 0; i < 5; i++) P.flower(x, px + r.next() * t, py + r.next() * t, t * (0.05 + r.next() * 0.03), r.pick(c.slice(1)), '#f8d050'); });
  };
  MAT.snow = function (x, a, c) {
    var s0 = C(c, 0, '#eef3f8'); base(x, a, s0);
    P.blotches(x, a, C(c, 1, '#d4e0ee'), 0.2, a.seed + 7, 0.6);
    P.blotches(x, a, '#ffffff', 0.35, a.seed + 8, 0.5, 0.55, 0.9);
    P.patternAt(x, P.speckle(128, 51, 'rgba(255,255,255,0.9)', 'rgba(150,170,200,0.25)', 0.03), a);
  };
  MAT.ice = function (x, a, c) {
    var i0 = C(c, 0, '#bfe0f4'); base(x, a, i0);
    P.blotches(x, a, C(c, 1, '#9ccbe8'), 0.2, a.seed + 9, 0.5);
    var t = a.tpx; x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = Math.max(1, t / 50);
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      if (r.chance(0.5)) { var sx = px + r.next() * t, sy = py + r.next() * t; x.beginPath(); x.moveTo(sx, sy); for (var k = 0; k < 4; k++) { sx += (r.next() - 0.5) * t * 0.4; sy += (r.next() - 0.3) * t * 0.3; x.lineTo(sx, sy); } x.stroke(); }
      if (r.chance(0.3)) { x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(px + r.next() * t, py + r.next() * t, t * 0.3, Math.max(1, t / 40)); }
    });
  };
  MAT.wood = function (x, a, c, o) {
    var w0 = C(c, 0, '#9a7650'), dark = C(c, 1, P.sh(w0, -0.25)), light = C(c, 2, P.sh(w0, 0.12));
    var t = a.tpx, ph = t / 3, W = a.w * t, H = a.h * t;
    base(x, a, w0);
    var row0 = Math.floor(a.wy0 * 3) - 1;
    for (var row = row0; row < (a.wy0 + a.h) * 3 + 1; row++) {
      var py = row * ph - a.wy0 * t, len = 4 + (P.cell(row, 0, a.seed) * 3 | 0), off = P.cell(row, 1, a.seed) * len;
      for (var k = Math.floor(a.wx0 / len) - 2; k * len < a.wx0 + a.w + len; k++) {
        var x0 = (k * len + off - a.wx0) * t, shade = (P.cell(row, k, a.seed + 2) - 0.5) * 0.14;
        var g = x.createLinearGradient(0, py, 0, py + ph); g.addColorStop(0, P.sh(w0, shade + 0.06)); g.addColorStop(1, P.sh(w0, shade - 0.08));
        x.fillStyle = g; x.fillRect(x0, py, len * t, ph);
        x.strokeStyle = P.rgba(dark, 0.35); x.lineWidth = Math.max(1, t / 70);
        for (var gl = 0; gl < 3; gl++) { var gy = py + ph * (0.25 + gl * 0.25) + (P.cell(k, gl, row) - 0.5) * ph * 0.2; x.beginPath(); x.moveTo(x0, gy); x.bezierCurveTo(x0 + len * t * 0.3, gy - ph * 0.08, x0 + len * t * 0.6, gy + ph * 0.1, x0 + len * t, gy); x.stroke(); }
        if (P.cell(k, row, a.seed + 3) < 0.25) P.ellipse(x, x0 + len * t * P.cell(k, row, 9), py + ph / 2, ph * 0.18, ph * 0.12, P.rgba(dark, 0.5));
        x.fillStyle = P.rgba(dark, 0.8); x.fillRect(x0, py, Math.max(1, t / 48), ph);
      }
      x.fillStyle = P.rgba(dark, 0.9); x.fillRect(0, py + ph - Math.max(1, t / 48), W, Math.max(1, t / 48));
      x.fillStyle = P.rgba(light, 0.25); x.fillRect(0, py, W, Math.max(1, t / 64));
    }
    void H; void o;
  };
  MAT.plank = function (x, a, c) { MAT.wood(x, a, c); };
  MAT.tile = function (x, a, c) {
    var t0 = C(c, 0, '#d8d8d0'), grout = C(c, 1, P.sh(t0, -0.3)), t = a.tpx, s = t / 2;
    base(x, a, grout);
    for (var j = Math.floor(a.wy0 * 2) - 1; j < (a.wy0 + a.h) * 2 + 1; j++) for (var i = Math.floor(a.wx0 * 2) - 1; i < (a.wx0 + a.w) * 2 + 1; i++) {
      var px = i * s - a.wx0 * t, py = j * s - a.wy0 * t, v = (P.cell(i, j, a.seed) - 0.5) * 0.08, g = Math.max(1, t / 40);
      var gr = x.createLinearGradient(px, py, px + s, py + s); gr.addColorStop(0, P.sh(t0, v + 0.1)); gr.addColorStop(1, P.sh(t0, v - 0.06));
      x.fillStyle = gr; P.rr(x, px + g, py + g, s - 2 * g, s - 2 * g, g * 1.5); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(px + g * 2, py + g * 2, s * 0.35, g);
    }
  };
  MAT.bigtile = function (x, a, c) { var t0 = C(c, 0, '#c8c8c0'); MAT.tile(x, { wx0: a.wx0 / 2, wy0: a.wy0 / 2, w: a.w, h: a.h, tpx: a.tpx * 2, seed: a.seed }, [t0, C(c, 1, P.sh(t0, -0.25))]); };
  MAT.checker = function (x, a, c) {
    var t = a.tpx, s = t / 2;
    for (var j = Math.floor(a.wy0 * 2) - 1; j < (a.wy0 + a.h) * 2 + 1; j++) for (var i = Math.floor(a.wx0 * 2) - 1; i < (a.wx0 + a.w) * 2 + 1; i++) {
      x.fillStyle = ((i + j) & 1) ? C(c, 0, '#e8e8e8') : C(c, 1, '#202020'); x.fillRect(i * s - a.wx0 * t, j * s - a.wy0 * t, s + 0.5, s + 0.5);
    }
    P.blotches(x, a, '#000000', 0.3, a.seed, 0.12);
  };
  MAT.stone = function (x, a, c) {
    var s0 = C(c, 0, '#8a8a80'), grout = C(c, 1, P.sh(s0, -0.35)), t = a.tpx;
    base(x, a, grout);
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      var cols = 2, rows = 2, cw = t / cols, ch = t / rows;
      for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
        var jx = (r.next() - 0.5) * cw * 0.2, jy = (r.next() - 0.5) * ch * 0.2, g = t * 0.04;
        var col = P.sh(s0, (r.next() - 0.5) * 0.18);
        var x0 = px + i * cw + g + jx * 0.3, y0 = py + j * ch + g + jy * 0.3;
        var gr = x.createLinearGradient(x0, y0, x0 + cw, y0 + ch); gr.addColorStop(0, P.sh(col, 0.12)); gr.addColorStop(1, P.sh(col, -0.1));
        x.fillStyle = gr; P.rr(x, x0, y0, cw - 2 * g, ch - 2 * g, t * 0.08); x.fill();
      }
    });
    P.patternAt(x, P.speckle(128, 61, 'rgba(255,255,255,0.1)', 'rgba(0,0,0,0.15)', 0.06), a);
  };
  MAT.cobble = function (x, a, c) {
    var s0 = C(c, 0, '#7a7a74'), t = a.tpx; base(x, a, P.sh(s0, -0.4));
    P.eachTile(a, 1, function (tx, ty, px, py, r) {
      for (var k = 0; k < 6; k++) { var cx = px + r.next() * t, cy = py + r.next() * t, rr = t * (0.12 + r.next() * 0.08); P.ball(x, cx, cy, rr, rr * 0.8, P.sh(s0, (r.next() - 0.5) * 0.2), { hi: 0.2, lo: -0.25 }); }
    });
  };
  MAT.carpet = function (x, a, c) {
    var c0 = C(c, 0, '#7a2a3a'); base(x, a, c0);
    P.blotches(x, a, P.sh(c0, -0.15), 0.4, a.seed, 0.3);
    var t = a.tpx; x.strokeStyle = P.rgba(C(c, 2, '#c8a040'), 0.35); x.lineWidth = Math.max(1, t / 30);
    P.eachTile(a, 0, function (tx, ty, px, py) { x.beginPath(); x.moveTo(px + t / 2, py + t * 0.2); x.lineTo(px + t * 0.8, py + t / 2); x.lineTo(px + t / 2, py + t * 0.8); x.lineTo(px + t * 0.2, py + t / 2); x.closePath(); x.stroke(); });
    P.patternAt(x, P.speckle(96, 71, 'rgba(255,255,255,0.07)', 'rgba(0,0,0,0.12)', 0.15), a);
  };
  MAT.rug = function (x, a, c) {
    var c0 = C(c, 0, '#6a4a8a'), c1 = C(c, 1, P.sh(c0, 0.15)); base(x, a, c0);
    var t = a.tpx;
    for (var j = Math.floor(a.wy0 * 4) - 1; j < (a.wy0 + a.h) * 4 + 1; j++) { if (j % 3) continue; x.fillStyle = P.rgba(c1, 0.6); x.fillRect(0, j * t / 4 - a.wy0 * t, a.w * t, t / 10); }
    P.patternAt(x, P.speckle(96, 72, 'rgba(255,255,255,0.08)', 'rgba(0,0,0,0.15)', 0.18), a);
  };
  MAT.mosaic = function (x, a, c) {
    var t = a.tpx, s = t / 4; base(x, a, '#1a1420');
    for (var j = Math.floor(a.wy0 * 4) - 1; j < (a.wy0 + a.h) * 4 + 1; j++) for (var i = Math.floor(a.wx0 * 4) - 1; i < (a.wx0 + a.w) * 4 + 1; i++) {
      x.fillStyle = c[Math.floor(P.cell(i, j, a.seed) * c.length)] || '#444'; P.rr(x, i * s - a.wx0 * t + 1, j * s - a.wy0 * t + 1, s - 2, s - 2, s * 0.2); x.fill();
    }
  };
  MAT.marble = function (x, a, c) {
    var m0 = C(c, 0, '#e8e4dc'); base(x, a, m0);
    P.blotches(x, a, C(c, 1, '#b8b0a8'), 0.25, a.seed, 0.35);
    var t = a.tpx; x.strokeStyle = P.rgba(C(c, 1, '#a09890'), 0.5); x.lineWidth = Math.max(1, t / 60);
    P.eachTile(a, 1, function (tx, ty, px, py, r) { if (r.chance(0.6)) { var sx = px, sy = py + r.next() * t; x.beginPath(); x.moveTo(sx, sy); x.bezierCurveTo(px + t * 0.3, sy + (r.next() - 0.5) * t, px + t * 0.6, sy + (r.next() - 0.5) * t, px + t, sy + (r.next() - 0.5) * t * 0.5); x.stroke(); } });
    MAT.tileLines(x, a, 'rgba(0,0,0,0.12)', 1);
  };
  MAT.tileLines = function (x, a, col, per) {
    var t = a.tpx * (per || 1); x.fillStyle = col;
    for (var i = Math.floor(a.wx0 / (per || 1)); i * (per || 1) < a.wx0 + a.w + 1; i++) x.fillRect(i * t - a.wx0 * a.tpx, 0, Math.max(1, a.tpx / 64), a.h * a.tpx);
    for (var j = Math.floor(a.wy0 / (per || 1)); j * (per || 1) < a.wy0 + a.h + 1; j++) x.fillRect(0, j * t - a.wy0 * a.tpx, a.w * a.tpx, Math.max(1, a.tpx / 64));
  };
  MAT.concrete = function (x, a, c) {
    var c0 = C(c, 0, '#787878'); base(x, a, c0);
    P.blotches(x, a, P.sh(c0, -0.15), 0.25, a.seed, 0.45); P.blotches(x, a, P.sh(c0, 0.1), 0.4, a.seed + 1, 0.3);
    P.patternAt(x, P.speckle(128, 81, 'rgba(255,255,255,0.12)', 'rgba(0,0,0,0.18)', 0.12), a);
    var t = a.tpx; x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = Math.max(1, t / 70);
    P.eachTile(a, 1, function (tx, ty, px, py, r) { if (r.chance(0.12)) { var sx = px + r.next() * t, sy = py + r.next() * t; x.beginPath(); x.moveTo(sx, sy); for (var k = 0; k < 5; k++) { sx += (r.next() - 0.5) * t * 0.3; sy += r.next() * t * 0.2; x.lineTo(sx, sy); } x.stroke(); } });
  };
  MAT.asphalt = function (x, a, c) { MAT.concrete(x, a, [C(c, 0, '#3a3a40')]); };
  MAT.metal = function (x, a, c) {
    var m0 = C(c, 0, '#6a7078'); base(x, a, m0);
    var t = a.tpx;
    P.eachTile(a, 0, function (tx, ty, px, py) {
      var g = x.createLinearGradient(px, py, px + t, py + t); g.addColorStop(0, P.sh(m0, 0.12)); g.addColorStop(1, P.sh(m0, -0.12)); x.fillStyle = g; x.fillRect(px + 1, py + 1, t - 2, t - 2);
      [[0.12, 0.12], [0.88, 0.12], [0.12, 0.88], [0.88, 0.88]].forEach(function (q) { P.ball(x, px + q[0] * t, py + q[1] * t, t * 0.03, t * 0.03, '#b8c0c8'); });
    });
  };
  MAT.paper = function (x, a, c) { base(x, a, C(c, 0, '#ece6da')); P.patternAt(x, P.paperTex(256), a, 0.6, 'multiply'); };
  MAT.tatami = function (x, a, c) {
    var t0 = C(c, 0, '#c8c088'); base(x, a, t0); var t = a.tpx;
    x.strokeStyle = P.rgba(P.sh(t0, -0.2), 0.5); x.lineWidth = 1;
    for (var j = 0; j < a.h * t; j += Math.max(2, t / 16)) { x.beginPath(); x.moveTo(0, j); x.lineTo(a.w * t, j); x.stroke(); }
    MAT.tileLines(x, a, '#4a5a3a', 2);
  };
  MAT.stars = function (x, a, c) { base(x, a, C(c, 0, '#05040c')); P.patternAt(x, P.speckle(200, 91, 'rgba(255,255,255,0.8)', 'rgba(160,140,255,0.5)', 0.004), a); };
  MAT.cloud = function (x, a, c) { base(x, a, C(c, 0, '#e8ecf8')); P.blotches(x, a, '#ffffff', 0.3, a.seed, 0.8); P.blotches(x, a, C(c, 1, '#c8d0e8'), 0.5, a.seed + 3, 0.4); };
  MAT.flesh = function (x, a, c) { base(x, a, C(c, 0, '#8a3040')); P.blotches(x, a, C(c, 1, '#a04050'), 0.3, a.seed, 0.6); P.blotches(x, a, C(c, 2, '#601828'), 0.6, a.seed + 1, 0.5); };
  MAT.grid = function (x, a, c) { base(x, a, C(c, 0, '#101018')); MAT.tileLines(x, a, C(c, 1, '#30ff90'), 1); };
  MAT.neon = function (x, a, c) { base(x, a, C(c, 0, '#0a0a14')); P.blotches(x, a, C(c, 1, '#ff40a0'), 0.2, a.seed, 0.25); MAT.tileLines(x, a, P.rgba(C(c, 1, '#ff40a0'), 0.5), 1); };
  MAT.hex = function (x, a, c) {
    var t = a.tpx, r = t / 2; base(x, a, C(c, 1, '#7a5a20'));
    for (var j = Math.floor(a.wy0) - 1; j < a.wy0 + a.h + 1; j++) for (var i = Math.floor(a.wx0) - 1; i < a.wx0 + a.w + 1; i++) {
      var cx = (i + (j & 1) * 0.5 - a.wx0) * t + r, cy = (j - a.wy0) * t * 0.87 + r;
      x.beginPath(); for (var k = 0; k < 6; k++) { var an = k / 6 * Math.PI * 2 + Math.PI / 6; x.lineTo(cx + Math.cos(an) * r * 0.92, cy + Math.sin(an) * r * 0.92); } x.closePath();
      var g = x.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r); g.addColorStop(0, P.sh(C(c, 0, '#e8b840'), 0.25)); g.addColorStop(1, C(c, 0, '#e8b840')); x.fillStyle = g; x.fill();
    }
  };
  MAT.lines = function (x, a, c) { base(x, a, C(c, 0, '#202020')); var t = a.tpx; x.fillStyle = C(c, 1, '#e0e0e0'); for (var j = Math.floor(a.wy0); j < a.wy0 + a.h + 1; j++) x.fillRect(0, (j + 0.5 - a.wy0) * t - t / 30, a.w * t, t / 15); };
  MAT.stripes = function (x, a, c) { base(x, a, C(c, 0, '#555')); var t = a.tpx; x.fillStyle = C(c, 1, '#333'); for (var i = Math.floor(a.wx0 * 4); i < (a.wx0 + a.w) * 4 + 1; i += 2) x.fillRect(i * t / 4 - a.wx0 * t, 0, t / 4, a.h * t); };
  MAT.hstripes = function (x, a, c) { base(x, a, C(c, 0, '#555')); var t = a.tpx; x.fillStyle = C(c, 1, '#333'); for (var j = Math.floor(a.wy0 * 4); j < (a.wy0 + a.h) * 4 + 1; j += 2) x.fillRect(0, j * t / 4 - a.wy0 * t, a.w * t, t / 4); };
  MAT.rails = function (x, a, c) {
    MAT.dirt(x, a, [C(c, 0, '#5a5048')]); var t = a.tpx;
    for (var j = Math.floor(a.wy0 * 3); j < (a.wy0 + a.h) * 3 + 1; j++) { P.box(x, 0, j * t / 3 - a.wy0 * t, a.w * t, t * 0.06, t * 0.05, '#6a4a30', '#4a3020'); }
  };
  MAT.dots = function (x, a, c) { base(x, a, C(c, 0, '#444')); P.eachTile(a, 0, function (tx, ty, px, py) { P.ellipse(x, px + a.tpx * 0.3, py + a.tpx * 0.3, a.tpx * 0.08, a.tpx * 0.08, C(c, 1, '#888')); }); };
  MAT.gradient = function (x, a, c) { var g = x.createLinearGradient(0, 0, 0, a.h * a.tpx); g.addColorStop(0, C(c, 0, '#000')); g.addColorStop(1, C(c, 1, '#333')); x.fillStyle = g; x.fillRect(0, 0, a.w * a.tpx, a.h * a.tpx); };
  MAT.pulse = MAT.flat; MAT.waves = MAT.flat; MAT.noise = MAT.flat; MAT.scribble = function (x, a, c) { MAT.paper(x, a, c); var t = a.tpx; x.strokeStyle = 'rgba(30,30,30,0.35)'; x.lineWidth = Math.max(1, t / 40); P.eachTile(a, 1, function (tx, ty, px, py, r) { x.beginPath(); for (var k = 0; k < 4; k++) x.lineTo(px + r.next() * t, py + r.next() * t); x.stroke(); }); };
  MAT.hatch = function (x, a, c) { base(x, a, C(c, 0, '#e8e0d0')); var t = a.tpx; x.strokeStyle = P.rgba(C(c, 1, '#303030'), 0.5); x.lineWidth = 1; for (var k = -a.h * t; k < a.w * t; k += Math.max(3, t / 10)) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + a.h * t, a.h * t); x.stroke(); } };
  MAT.ondol = function (x, a, c) { base(x, a, C(c, 0, '#d8b880')); P.blotches(x, a, '#b89058', 0.3, a.seed, 0.4); MAT.tileLines(x, a, 'rgba(90,60,20,0.35)', 1); };

  /* priorité de superposition des matières de sol (plus haut = dessiné après) */
  P.PRIORITY = { floor: 0, floor4: 1, floor5: 1, floor3: 2, quiet: 2, floor2: 3, dirt: 3, soil: 4, carpet: 5, mat: 5, mat2: 5, tile: 5, rail: 5, line: 5, leafg: 6, leafb: 6, flowers: 7, snow: 8, ice: 8, bridge: 9, vine: 9, light: 9, gold: 9, hazard: 9, spike: 9, conveyor: 9, stairs: 9, platform: 9, arrowl: 9, arrowr: 9, diag: 9, diag2: 9, dark: 9 };
  /* bords organiques (nature) ou nets (intérieur) */
  P.EDGE = { grass: 'organic', meadow: 'organic', moss: 'organic', dirt: 'organic', path: 'organic', sand: 'organic', soil: 'rounded', leaves: 'organic', flowers: 'organic', snow: 'organic', ice: 'organic', flesh: 'organic', cloud: 'organic', cobble: 'organic', stone: 'rounded' };
})(typeof window !== 'undefined' ? window : globalThis);
