/* =========================================================================
 *  MATIÈRES EN PIXEL ART — sols et murs dessinés pixel par pixel
 *  (tampons ImageData, aucune ligne lissée). Chaque matière reçoit
 *  (contexte, zone, couleurs) comme les matières peintes qu'elles
 *  remplacent : zone = { wx0, wy0, w, h (en cases), tpx, seed }.
 *  Les motifs sont calculés en coordonnées du monde : aucun raccord
 *  visible d'un bloc à l'autre.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;
  var V = P.MATV = {}; U.keys(P.MAT).forEach(function (k) { V[k] = P.MAT[k]; });
  var M = P.MAT;

  /* ---------- tampon de pixels ---------- */
  function rgb(c, d) { if (!c) c = d || '#444444'; if (Array.isArray(c)) return c; if (typeof c === 'string' && c[0] === '#') return U.hexToRgb(c); var m = /rgba?\(([^)]+)\)/.exec(c); if (m) { var p = m[1].split(',').map(parseFloat); return [p[0], p[1], p[2]]; } return [68, 68, 68]; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k | 0, a[1] + (b[1] - a[1]) * k | 0, a[2] + (b[2] - a[2]) * k | 0]; }
  function sh(a, k) { return k >= 0 ? mix(a, [255, 255, 255], k) : mix(a, [0, 0, 0], -k); }
  function hash(x, y, s) { var h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function Buf(x, a) {
    this.x = x; this.a = a; this.t = a.tpx;
    this.w = Math.ceil(a.w * a.tpx); this.h = Math.ceil(a.h * a.tpx);
    this.gx0 = Math.round(a.wx0 * a.tpx); this.gy0 = Math.round(a.wy0 * a.tpx);
    this.img = x.createImageData(this.w, this.h); this.d = this.img.data; this.s = (a.seed | 0) || 7;
  }
  Buf.prototype.px = function (x, y, c, al) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    var i = (y * this.w + x) * 4, d = this.d;
    if (al === undefined || al >= 1) { d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; }
    else { d[i] = d[i] + (c[0] - d[i]) * al; d[i + 1] = d[i + 1] + (c[1] - d[i + 1]) * al; d[i + 2] = d[i + 2] + (c[2] - d[i + 2]) * al; d[i + 3] = 255; }
  };
  Buf.prototype.fill = function (c) { for (var i = 0; i < this.d.length; i += 4) { this.d[i] = c[0]; this.d[i + 1] = c[1]; this.d[i + 2] = c[2]; this.d[i + 3] = 255; } };
  Buf.prototype.rect = function (x, y, w, h, c, al) { for (var yy = Math.max(0, y); yy < Math.min(this.h, y + h); yy++) for (var xx = Math.max(0, x); xx < Math.min(this.w, x + w); xx++) this.px(xx, yy, c, al); };
  /* parcours de tous les pixels en coordonnées du monde */
  Buf.prototype.each = function (fn) { for (var y = 0; y < this.h; y++) for (var x = 0; x < this.w; x++) fn(x, y, this.gx0 + x, this.gy0 + y); };
  /* parcours des cases (avec marge) : fn(px, py, tx, ty, r) */
  Buf.prototype.tiles = function (fn, margin) {
    var a = this.a, m = margin === undefined ? 1 : margin;
    for (var ty = Math.floor(a.wy0) - m; ty < Math.ceil(a.wy0 + a.h) + m; ty++) for (var tx = Math.floor(a.wx0) - m; tx < Math.ceil(a.wx0 + a.w) + m; tx++)
      fn(Math.round((tx - a.wx0) * this.t), Math.round((ty - a.wy0) * this.t), tx, ty, P.rng(tx, ty, this.s));
  };
  Buf.prototype.put = function () { this.x.putImageData(this.img, 0, 0); };
  P.PixBuf = Buf; P.pxrgb = rgb; P.pxmix = mix; P.pxsh = sh; P.pxhash = hash;

  /* taches à deux tons (bruit grossier, bord tramé d'un pixel) */
  function patches(b, col, freq, thr, seed) {
    var t = b.t;
    b.each(function (x, y, gx, gy) {
      var n = YN.rng.noise2(gx / t * freq, gy / t * freq, seed);
      if (n > thr || (n > thr - 0.025 && ((gx + gy) & 1))) b.px(x, y, col);
    });
  }
  function specks(b, cols, dens, seed) {
    b.each(function (x, y, gx, gy) { var r = hash(gx, gy, seed); if (r < dens) b.px(x, y, cols[Math.floor(r / dens * cols.length) % cols.length]); });
  }
  function C(c, i, d) { return rgb((c && c[i]) || d); }

  /* ================= SOLS ================= */
  M.flat = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#3a3a44'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, -0.12);
    b.fill(c0); patches(b, c1, 0.22, 0.62, b.s + 3); specks(b, [sh(c0, 0.1), sh(c0, -0.14)], 0.025, b.s); b.put();
  };
  M.blank = function () { }; M.void = function () { };
  M.grass = function (x, a, c, o) {
    o = o || {};
    var b = new Buf(x, a), g0 = C(c, 0, '#4a8a3c'), dark = c && c[1] ? rgb(c[1]) : sh(g0, -0.15), light = c && c[2] ? rgb(c[2]) : sh(g0, 0.18), deep = c && c[3] ? rgb(c[3]) : sh(g0, -0.3);
    b.fill(g0); patches(b, dark, 0.18, 0.6, b.s + 1); patches(b, mix(g0, light, 0.45), 0.25, 0.68, b.s + 2);
    var t = b.t;
    b.tiles(function (px, py, tx, ty, r) {
      var n = o.sparse ? 2 : 4;
      for (var i = 0; i < n; i++) { // touffes en « v »
        var bx = px + Math.floor(r.next() * (t - 3)), by = py + Math.floor(r.next() * (t - 3)), col = r.chance(0.55) ? light : deep;
        b.px(bx, by, col); b.px(bx + 2, by, col); b.px(bx + 1, by + 1, col); b.px(bx + 1, by + 2, sh(col, -0.1));
      }
      if (r.chance(o.flowers ? 0.7 : 0.1)) {
        var fx = px + 2 + Math.floor(r.next() * (t - 5)), fy = py + 2 + Math.floor(r.next() * (t - 5)), fc = rgb(r.pick(['#ffffff', '#f8e070', '#f4a0c0', '#b8c8ff']));
        b.px(fx, fy - 1, fc); b.px(fx - 1, fy, fc); b.px(fx + 1, fy, fc); b.px(fx, fy + 1, fc); b.px(fx, fy, [248, 208, 80]);
      }
    });
    b.put();
  };
  M.meadow = function (x, a, c) { M.grass(x, a, c, { flowers: true }); };
  M.moss = function (x, a, c) { M.grass(x, a, c, { sparse: true }); };
  M.dirt = function (x, a, c) {
    var b = new Buf(x, a), d0 = C(c, 0, '#8a6a44'), dark = c && c[1] ? rgb(c[1]) : sh(d0, -0.16), light = c && c[2] ? rgb(c[2]) : sh(d0, 0.14);
    b.fill(d0); patches(b, dark, 0.3, 0.63, b.s + 4); patches(b, light, 0.22, 0.7, b.s + 5);
    var t = b.t;
    b.tiles(function (px, py, tx, ty, r) {
      for (var i = 0; i < 3; i++) if (r.chance(0.55)) { var sx = px + Math.floor(r.next() * (t - 2)), sy = py + Math.floor(r.next() * (t - 2)), pc = rgb(r.pick(['#a09888', '#8a8478', '#b0a090'])); b.px(sx, sy, pc); b.px(sx + 1, sy, sh(pc, 0.15)); b.px(sx, sy + 1, sh(d0, -0.3)); b.px(sx + 1, sy + 1, sh(d0, -0.3)); }
    });
    b.put();
  };
  M.path = M.dirt;
  M.sand = function (x, a, c) {
    var b = new Buf(x, a), s0 = C(c, 0, '#d8c08a'), s1 = c && c[1] ? rgb(c[1]) : sh(s0, -0.1);
    b.fill(s0); specks(b, [sh(s0, 0.15), s1, sh(s0, -0.18)], 0.06, b.s + 6);
    var t = b.t;
    b.each(function (px, py, gx, gy) { var w = Math.sin(gx / t * 2.2 + Math.floor(gy / (t / 3)) * 1.7) > 0.86 && (gy % Math.round(t / 3)) === 0; if (w) b.px(px, py, s1); });
    b.put();
  };
  M.soil = function (x, a, c) {
    var b = new Buf(x, a), s0 = C(c, 0, '#5a3e26'), hi = sh(s0, 0.12), lo = sh(s0, -0.28), t = b.t, step = Math.max(4, Math.round(t / 3));
    b.fill(s0);
    b.each(function (px, py, gx, gy) { var k = ((gy % step) + step) % step; if (k === 0) b.px(px, py, hi); else if (k === step - 1) b.px(px, py, lo); });
    specks(b, [sh(s0, 0.22), lo], 0.03, b.s + 41);
    b.put();
  };
  M.leaves = function (x, a, c) {
    var g0 = C(c, 0, '#3f7a38');
    M.grass(x, a, [g0, sh(g0, -0.15), sh(g0, 0.12)], { sparse: true });
    var b = new Buf(x, a); b.d.set(x.getImageData(0, 0, b.w, b.h).data);
    var cols = (c || []).slice(1).map(function (q) { return rgb(q); }); if (!cols.length) cols = [[160, 110, 50]];
    var t = b.t;
    b.tiles(function (px, py, tx, ty, r) {
      for (var i = 0; i < 7; i++) {
        var lx = px + Math.floor(r.next() * (t - 3)), ly = py + Math.floor(r.next() * (t - 2)), col = r.pick(cols), hz = r.chance(0.5);
        b.px(lx, ly, col); b.px(lx + (hz ? 1 : 0), ly + (hz ? 0 : 1), col); b.px(lx + (hz ? 2 : 1), ly + (hz ? 1 : 1), sh(col, -0.2));
      }
    });
    b.put();
  };
  M.flowers = function (x, a, c) {
    M.grass(x, a, [C(c, 0, '#3f7a3c')]);
    var b = new Buf(x, a); b.d.set(x.getImageData(0, 0, b.w, b.h).data);
    var cols = (c || []).slice(1).map(function (q) { return rgb(q); }); if (!cols.length) cols = [[240, 112, 160], [248, 224, 112]];
    var t = b.t;
    b.tiles(function (px, py, tx, ty, r) {
      for (var i = 0; i < 4; i++) { var fx = px + 2 + Math.floor(r.next() * (t - 4)), fy = py + 2 + Math.floor(r.next() * (t - 4)), fc = r.pick(cols); b.px(fx, fy - 1, fc); b.px(fx - 1, fy, fc); b.px(fx + 1, fy, fc); b.px(fx, fy + 1, sh(fc, -0.2)); b.px(fx, fy, [248, 208, 80]); }
    });
    b.put();
  };
  M.snow = function (x, a, c) {
    var b = new Buf(x, a), s0 = C(c, 0, '#eef3f8'), s1 = c && c[1] ? rgb(c[1]) : [212, 224, 238];
    b.fill(s0); patches(b, s1, 0.2, 0.6, b.s + 7); specks(b, [[255, 255, 255], sh(s1, -0.08)], 0.02, b.s + 8); b.put();
  };
  M.ice = function (x, a, c) {
    var b = new Buf(x, a), i0 = C(c, 0, '#bfe0f4'), i1 = c && c[1] ? rgb(c[1]) : sh(i0, -0.1), hi = c && c[2] ? rgb(c[2]) : [255, 255, 255], t = b.t;
    b.fill(i0); patches(b, i1, 0.25, 0.6, b.s + 9);
    b.each(function (px, py, gx, gy) { var k = (gx + gy) % (t * 2); if (k === 0 || k === 1) { if (hash(Math.floor((gx - gy) / 7), 0, b.s) < 0.35) b.px(px, py, hi); } });
    b.tiles(function (px, py, tx, ty, r) { if (r.chance(0.25)) { var cx = px + Math.floor(r.next() * t), cy = py + Math.floor(r.next() * t); for (var k = 0; k < 6; k++) { b.px(cx, cy, sh(i0, -0.25)); cx += r.chance(0.5) ? 1 : 0; cy += 1; } } });
    b.put();
  };
  /* parquet : lames de t/4 px, raccords décalés, veines */
  M.wood = function (x, a, c) {
    var b = new Buf(x, a), w0 = C(c, 0, '#9a7650'), dark = c && c[1] ? rgb(c[1]) : sh(w0, -0.25), light = c && c[2] ? rgb(c[2]) : sh(w0, 0.15), t = b.t;
    var ph = Math.max(4, Math.round(t / 4)), shades = [w0, mix(w0, light, 0.4), mix(w0, dark, 0.22)];
    b.each(function (px, py, gx, gy) {
      var row = Math.floor(gy / ph), ry = gy - row * ph;
      var L = t * (2 + Math.floor(hash(row, 1, b.s) * 2)), off = Math.floor(hash(row, 2, b.s) * L), seg = Math.floor((gx + off) / L), sx = (gx + off) - seg * L;
      var col = shades[Math.floor(hash(seg, row, b.s + 3) * 3)];
      if (ry === ph - 1) col = dark;
      else if (sx === 0) col = sh(dark, 0.08);
      else if (ry === 0) col = mix(col, light, 0.35);
      else if (hash(gx >> 2, row, b.s + 5) < 0.12 && ry === 1 + (row % 2)) col = mix(col, dark, 0.45);
      b.px(px, py, col);
    });
    b.put();
  };
  M.plank = M.wood;
  M.tile = function (x, a, c, o) {
    var b = new Buf(x, a), t0 = C(c, 0, '#c8c8c0'), g = c && c[1] ? rgb(c[1]) : sh(t0, -0.25), t = b.t, s = (o && o.size) || Math.max(5, Math.round(t / 2));
    b.each(function (px, py, gx, gy) {
      var ix = ((gx % s) + s) % s, iy = ((gy % s) + s) % s, col = t0;
      var v = hash(Math.floor(gx / s), Math.floor(gy / s), b.s); if (v < 0.25) col = sh(t0, -0.05); else if (v > 0.85) col = sh(t0, 0.06);
      if (ix === s - 1 || iy === s - 1) col = g; else if (ix === 0 || iy === 0) col = sh(col, 0.12);
      b.px(px, py, col);
    });
    b.put();
  };
  M.bigtile = function (x, a, c) { M.tile(x, a, c, { size: a.tpx }); };
  M.checker = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#e0e0e0'), c1 = C(c, 1, '#303030'), s = Math.max(5, Math.round(b.t / 2));
    b.each(function (px, py, gx, gy) { b.px(px, py, ((Math.floor(gx / s) + Math.floor(gy / s)) & 1) ? c1 : c0); }); b.put();
  };
  M.stone = function (x, a, c) {
    var b = new Buf(x, a), s0 = C(c, 0, '#8a8a80'), gap = c && c[2] ? rgb(c[2]) : sh(s0, -0.35), t = b.t, bw = Math.round(t * 0.6), bh = Math.round(t * 0.4);
    b.each(function (px, py, gx, gy) {
      var row = Math.floor(gy / bh), off = (row & 1) ? Math.round(bw / 2) : 0, col = Math.floor((gx + off) / bw), ix = (gx + off) - col * bw, iy = gy - row * bh;
      var v = hash(col, row, b.s), cc = v < 0.3 ? sh(s0, -0.08) : v > 0.8 ? sh(s0, 0.08) : s0;
      if (ix === bw - 1 || iy === bh - 1) cc = gap; else if (iy === 0 || ix === 0) cc = sh(cc, 0.1);
      b.px(px, py, cc);
    });
    specks(b, [sh(s0, -0.18)], 0.02, b.s + 2); b.put();
  };
  M.cobble = function (x, a, c) {
    var b = new Buf(x, a), s0 = C(c, 0, '#7a7a74'), gap = sh(s0, -0.4), t = b.t, cs = Math.max(4, Math.round(t / 3));
    b.each(function (px, py, gx, gy) {
      var cx = Math.floor(gx / cs), cy = Math.floor(gy / cs), best = 9, second = 9, bi = 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var qx = (cx + dx) * cs + hash(cx + dx, cy + dy, b.s) * cs, qy = (cy + dy) * cs + hash(cx + dx, cy + dy, b.s + 1) * cs;
        var d = Math.sqrt((gx - qx) * (gx - qx) + (gy - qy) * (gy - qy));
        if (d < best) { second = best; best = d; bi = hash(cx + dx, cy + dy, b.s + 2); } else if (d < second) second = d;
      }
      var col = second - best < 1.2 ? gap : (bi < 0.3 ? sh(s0, -0.1) : bi > 0.75 ? sh(s0, 0.1) : s0);
      b.px(px, py, col);
    });
    b.put();
  };
  M.rock = M.cobble;
  M.carpet = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#8a4a5a'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, -0.12);
    b.fill(c0); b.each(function (px, py, gx, gy) { if (((gx >> 1) + (gy >> 1)) % 3 === 0 && ((gx + gy) & 1)) b.px(px, py, c1); }); b.put();
  };
  M.rug = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#7a5a8a'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, 0.12), t = b.t, s = Math.max(6, Math.round(t / 2));
    b.fill(c0);
    b.each(function (px, py, gx, gy) {
      var ix = ((gx % s) + s) % s - s / 2 + 0.5, iy = ((gy % s) + s) % s - s / 2 + 0.5, dd = Math.abs(ix) + Math.abs(iy);
      if (Math.abs(dd - s * 0.32) < 0.6) b.px(px, py, c1); else if (dd < 1) b.px(px, py, sh(c1, 0.15)); else if (hash(gx, gy, b.s) < 0.04) b.px(px, py, sh(c0, -0.1));
    });
    b.put();
  };
  M.mat = M.rug;
  M.mosaic = function (x, a, c) {
    var b = new Buf(x, a), cols = (c || ['#c84040', '#4080c8', '#e0c040']).map(function (q) { return rgb(q); }), s = Math.max(3, Math.round(b.t / 5)), g = [40, 36, 44];
    b.each(function (px, py, gx, gy) { var ix = ((gx % s) + s) % s, iy = ((gy % s) + s) % s; b.px(px, py, (ix === s - 1 || iy === s - 1) ? g : cols[Math.floor(hash(Math.floor(gx / s), Math.floor(gy / s), b.s) * cols.length)]); }); b.put();
  };
  M.marble = function (x, a, c) {
    var b = new Buf(x, a), m0 = C(c, 0, '#e8e4dc'), v = c && c[1] ? rgb(c[1]) : sh(m0, -0.25), t = b.t;
    b.fill(m0);
    b.each(function (px, py, gx, gy) { var n = YN.rng.noise2(gx / t * 0.6, gy / t * 0.6, b.s), q = Math.abs(Math.sin((gx + gy * 0.6) / t * 1.4 + n * 6)); if (q < 0.05) b.px(px, py, v); else if (q < 0.11 && ((gx + gy) & 1)) b.px(px, py, mix(m0, v, 0.5)); });
    M.tileLinesB(b, sh(m0, -0.12), 1); b.put();
  };
  M.tileLinesB = function (b, col, per) { var s = b.t * (per || 1); b.each(function (px, py, gx, gy) { if (((gx % s) + s) % s === 0 || ((gy % s) + s) % s === 0) b.px(px, py, col); }); };
  M.tileLines = function (x, a, col, per) { var b = new Buf(x, a); b.d.set(x.getImageData(0, 0, b.w, b.h).data); M.tileLinesB(b, rgb(col), per); b.put(); };
  M.concrete = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#8a8a88'), t = b.t;
    b.fill(c0); patches(b, sh(c0, -0.06), 0.3, 0.6, b.s); specks(b, [sh(c0, 0.1), sh(c0, -0.15)], 0.04, b.s + 1);
    b.tiles(function (px, py, tx, ty, r) { if (r.chance(0.12)) { var cx = px + Math.floor(r.next() * t), cy = py + Math.floor(r.next() * t); for (var k = 0; k < 7; k++) { b.px(cx, cy, sh(c0, -0.3)); cx += r.chance(0.5) ? 1 : -1; cy += r.chance(0.6) ? 1 : 0; } } });
    M.tileLinesB(b, sh(c0, -0.15), 2); b.put();
  };
  M.asphalt = function (x, a, c) { M.concrete(x, a, [C(c, 0, '#3a3a40')]); };
  M.metal = function (x, a, c) {
    var b = new Buf(x, a), m0 = C(c, 0, '#7a8088'), t = b.t, s = t;
    b.each(function (px, py, gx, gy) {
      var ix = ((gx % s) + s) % s, iy = ((gy % s) + s) % s, col = m0;
      if (((ix + iy) % 4) === 0 && ix > 1 && iy > 1 && ix < s - 2 && iy < s - 2) col = sh(m0, 0.12);
      if (ix === s - 1 || iy === s - 1) col = sh(m0, -0.35); else if (ix === 0 || iy === 0) col = sh(m0, 0.2);
      if ((ix === 2 || ix === s - 3) && (iy === 2 || iy === s - 3)) col = sh(m0, -0.25);
      b.px(px, py, col);
    });
    b.put();
  };
  M.paper = function (x, a, c) {
    var b = new Buf(x, a), p0 = C(c, 0, '#ece6da'), t = b.t;
    b.fill(p0); specks(b, [sh(p0, -0.06)], 0.05, b.s); b.each(function (px, py, gx, gy) { if (((gy % (t / 2 | 0)) === 0)) b.px(px, py, mix(p0, [150, 170, 210], 0.3)); }); b.put();
  };
  M.tatami = function (x, a, c) {
    var b = new Buf(x, a), t0 = C(c, 0, '#c8c088'), t = b.t, ed = [60, 80, 50];
    b.each(function (px, py, gx, gy) {
      var mx = Math.floor(gx / (t * 2)), my = Math.floor(gy / t), ix = gx - mx * t * 2, iy = gy - my * t, col = (iy & 1) ? sh(t0, -0.06) : t0;
      if (iy === 0 || iy === t - 1) col = ed;
      b.px(px, py, col);
    });
    b.put();
  };
  M.ondol = function (x, a, c) { M.tile(x, a, [C(c, 0, '#d8b880'), '#a88050'], { size: a.tpx }); };
  M.stars = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#05040c'); b.fill(c0);
    b.each(function (px, py, gx, gy) { var r = hash(gx, gy, b.s); if (r < 0.004) b.px(px, py, r < 0.001 ? [255, 255, 255] : [160, 150, 230]); }); b.put();
  };
  M.cloud = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#e8ecf8'), c1 = c && c[1] ? rgb(c[1]) : [200, 208, 232];
    b.fill(c0); patches(b, c1, 0.35, 0.6, b.s); patches(b, [255, 255, 255], 0.3, 0.68, b.s + 2); b.put();
  };
  M.flesh = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#8a3040'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, 0.12), c2 = c && c[2] ? rgb(c[2]) : sh(c0, -0.3), t = b.t;
    b.fill(c0); patches(b, c1, 0.3, 0.6, b.s); patches(b, c2, 0.5, 0.66, b.s + 1);
    b.each(function (px, py, gx, gy) { var n = YN.rng.noise2(gx / t * 0.8, gy / t * 0.8, b.s + 9); if (Math.abs(n - 0.5) < 0.012) b.px(px, py, c2); });
    b.put();
  };
  M.grid = function (x, a, c) { var b = new Buf(x, a); b.fill(C(c, 0, '#101018')); M.tileLinesB(b, C(c, 1, '#30ff90'), 1); b.put(); };
  M.neon = function (x, a, c) { var b = new Buf(x, a), c1 = C(c, 1, '#ff40a0'); b.fill(C(c, 0, '#0a0a14')); specks(b, [c1], 0.01, b.s); M.tileLinesB(b, mix(C(c, 0, '#0a0a14'), c1, 0.5), 1); b.put(); };
  M.hex = function (x, a, c) {
    var b = new Buf(x, a), c0 = C(c, 0, '#d8c040'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, -0.3), t = b.t, s = t / 2;
    b.each(function (px, py, gx, gy) { var q = (gx / s) * 0.866, r2 = gy / s - (Math.floor(q) & 1) * 0.5; var fx = q - Math.floor(q), fy = r2 - Math.floor(r2); b.px(px, py, (fx < 0.12 || fy < 0.1) ? c1 : c0); }); b.put();
  };
  M.lines = function (x, a, c) { var b = new Buf(x, a), t = b.t; b.fill(C(c, 0, '#202020')); b.each(function (px, py, gx, gy) { if (((gy % t) + t) % t === Math.floor(t / 2)) b.px(px, py, C(c, 1, '#e0e0e0')); }); b.put(); };
  M.stripes = function (x, a, c) { var b = new Buf(x, a), s = Math.max(2, Math.round(b.t / 4)); b.each(function (px, py, gx) { b.px(px, py, (Math.floor(gx / s) & 1) ? C(c, 1, '#333') : C(c, 0, '#555')); }); b.put(); };
  M.hstripes = function (x, a, c) { var b = new Buf(x, a), s = Math.max(2, Math.round(b.t / 4)); b.each(function (px, py, gx, gy) { b.px(px, py, (Math.floor(gy / s) & 1) ? C(c, 1, '#333') : C(c, 0, '#555')); }); b.put(); };
  M.rails = function (x, a, c) {
    var b = new Buf(x, a), t = b.t, g0 = C(c, 0, '#5a5048'), rail = C(c, 1, '#a0a0a8'), tie = [90, 64, 40];
    b.fill(g0); specks(b, [sh(g0, 0.12), sh(g0, -0.15)], 0.08, b.s);
    b.each(function (px, py, gx, gy) { var iy = ((gy % t) + t) % t, ix = ((gx % t) + t) % t; if (((gx % 5) + 5) % 5 < 2) b.px(px, py, tie); if (iy === 4 || iy === t - 5) b.px(px, py, rail); void ix; });
    b.put();
  };
  M.dots = function (x, a, c) { var b = new Buf(x, a), t = b.t; b.fill(C(c, 0, '#444')); b.each(function (px, py, gx, gy) { var ix = ((gx % (t / 2 | 0)) + 10) % (t / 2 | 0), iy = ((gy % (t / 2 | 0)) + 10) % (t / 2 | 0); if (ix < 2 && iy < 2) b.px(px, py, C(c, 1, '#888')); }); b.put(); };
  M.gradient = function (x, a, c) { var b = new Buf(x, a), c0 = C(c, 0, '#000'), c1 = C(c, 1, '#333'); b.each(function (px, py, gx, gy) { var k = Math.floor(((py / b.h) * 4)) / 4; b.px(px, py, mix(c0, c1, k)); }); b.put(); };
  M.pulse = M.flat; M.waves = M.flat; M.noise = M.flat;
  M.scribble = function (x, a, c) { M.paper(x, a, c); var b = new Buf(x, a); b.d.set(x.getImageData(0, 0, b.w, b.h).data); var t = b.t; b.tiles(function (px, py, tx, ty, r) { var cx = px + r.next() * t | 0, cy = py + r.next() * t | 0; for (var k = 0; k < 10; k++) { b.px(cx, cy, [40, 40, 40]); cx += r.int(-1, 1); cy += r.int(-1, 1); } }); b.put(); };
  M.hatch = function (x, a, c) { var b = new Buf(x, a), c0 = C(c, 0, '#e8e0d0'), c1 = C(c, 1, '#303030'); b.each(function (px, py, gx, gy) { b.px(px, py, (((gx + gy) % 4) === 0) ? mix(c0, c1, 0.5) : c0); }); b.put(); };
  M.lily = M.flat;

  /* ================= FACES DE MUR (pixel) ================= */
  P.PXFACE = {
    brick: function (b, c) {
      var c0 = C(c, 0, '#8a4a3a'), mort = sh(C(c, 2, sh(c0, -0.35)), -0.1), t = b.t, bh = Math.max(4, Math.round(t / 4)), bw = Math.round(t / 2);
      b.each(function (px, py, gx, gy) {
        var row = Math.floor(py / bh), off = (row & 1) ? Math.round(bw / 2) : 0, col = Math.floor((gx + off) / bw), ix = (gx + off) - col * bw, iy = py - row * bh;
        var v = hash(col, row, b.s), cc = v < 0.25 ? sh(c0, -0.08) : v > 0.85 ? sh(c0, 0.08) : c0;
        if (iy === bh - 1 || ix === bw - 1) cc = mort; else if (iy === 0) cc = sh(cc, 0.12);
        b.px(px, py, cc);
      });
    },
    stone: function (b, c) {
      var c0 = C(c, 0, '#8a8a80'), mort = sh(c0, -0.42), t = b.t, bh = Math.round(t / 3), bw = Math.round(t * 0.62);
      b.each(function (px, py, gx, gy) {
        var row = Math.floor(py / bh), off = Math.floor(hash(row, 3, b.s) * bw), col = Math.floor((gx + off) / bw), ix = (gx + off) - col * bw, iy = py - row * bh;
        var v = hash(col, row, b.s), cc = v < 0.3 ? sh(c0, -0.1) : v > 0.8 ? sh(c0, 0.08) : c0;
        if (iy === bh - 1 || ix === bw - 1) cc = mort; else if (iy === 0 || ix === 0) cc = sh(cc, 0.14);
        b.px(px, py, cc);
      });
    },
    wallpaper: function (b, c) {
      var c0 = C(c, 0, '#d8c8b0'), c1 = c && c[1] ? rgb(c[1]) : sh(c0, -0.12), c2 = c && c[2] ? rgb(c[2]) : sh(c0, -0.35), t = b.t, s = Math.max(4, Math.round(t / 4));
      b.each(function (px, py, gx, gy) {
        var ix = ((gx % (s * 2)) + s * 2) % (s * 2), iy = py % (s * 2), col = c0;
        if (ix === 0) col = c1;
        else if (ix === s && (iy === s || iy === s - 1)) col = c2;
        else if ((ix === s - 1 || ix === s + 1) && iy === s) col = mix(c1, c2, 0.4);
        b.px(px, py, col);
      });
    },
    panel: function (b, c) {
      var c0 = C(c, 0, '#8a6a48'), t = b.t;
      b.each(function (px, py, gx) { var ix = ((gx % t) + t) % t, col = c0; if (ix === 0) col = sh(c0, -0.3); else if (ix === 1) col = sh(c0, 0.15); else if (ix === t - 2) col = sh(c0, -0.12); b.px(px, py, col); });
    },
    hedge: function (b, c) {
      var c0 = C(c, 1, '#1c4622'), c1 = C(c, 0, '#24582a'), c2 = C(c, 3, '#123418'), t = b.t;
      b.fill(c0);
      b.each(function (px, py, gx, gy) { var n = YN.rng.noise2(gx / t * 1.6, py / t * 1.6, b.s); if (n > 0.6) b.px(px, py, c1); else if (n < 0.33) b.px(px, py, c2); if (hash(gx, py, b.s) < 0.03) b.px(px, py, sh(c1, 0.25)); });
    },
    concrete: function (b, c) { var c0 = C(c, 0, '#8a8a90'); b.fill(c0); specks(b, [sh(c0, 0.1), sh(c0, -0.12)], 0.05, b.s); b.each(function (px, py, gx) { if (((gx % (b.t * 2)) + b.t * 2) % (b.t * 2) === 0) b.px(px, py, sh(c0, -0.2)); }); },
    glass: function (b, c) { var c0 = C(c, 0, '#90b0d0'); b.each(function (px, py, gx) { var ix = ((gx % b.t) + b.t) % b.t; b.px(px, py, ix === 0 ? sh(c0, -0.3) : (ix === 3 || ix === 4) ? sh(c0, 0.35) : c0); }); },
    board: function (b, c) { var c0 = C(c, 0, '#26402e'); b.fill(c0); specks(b, [sh(c0, 0.2)], 0.02, b.s); },
    mirror: function (b) { b.each(function (px, py, gx) { var k = ((gx + py) % 9); b.px(px, py, k < 2 ? [230, 240, 250] : [170, 186, 206]); }); },
    metal: function (b, c) { var c0 = C(c, 0, '#7a8088'); b.each(function (px, py, gx) { var ix = ((gx % b.t) + b.t) % b.t; b.px(px, py, ix === 0 ? sh(c0, -0.35) : ix === 1 ? sh(c0, 0.2) : (py % 6 === 0 ? sh(c0, -0.08) : c0)); }); },
    flat: function (b, c) { var c0 = C(c, 1, C(c, 0, '#5a5a66')); b.fill(c0); specks(b, [sh(c0, -0.1)], 0.03, b.s); }
  };
  P.PXFACE.rock = P.PXFACE.stone; P.PXFACE.wood = P.PXFACE.panel; P.PXFACE.paper = function (b, c) { var c0 = C(c, 0, '#ece6da'); b.fill(c0); specks(b, [sh(c0, -0.08)], 0.04, b.s); };
  P.PXFACE.flesh = function (b, c) { var c0 = C(c, 0, '#8a3040'); b.fill(c0); specks(b, [sh(c0, -0.2), sh(c0, 0.15)], 0.08, b.s); };
  P.PXFACE.cloud = function (b) { b.fill([232, 236, 248]); specks(b, [[200, 208, 232]], 0.1, b.s); };
})(typeof window !== 'undefined' ? window : globalThis);
