/* =========================================================================
 *  PIXEL ART — outils communs.
 *  Le jeu est rendu à basse résolution (cases de 20 px), agrandi sans
 *  lissage. Tout ce qui est dessiné en vectoriel passe ici pour devenir
 *  du vrai pixel art : bords nets (alpha binaire), couleurs ramenées à une
 *  palette commune (aplats et paliers au lieu de dégradés), contour d'un
 *  pixel autour des silhouettes, ombres au sol pleines.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;
  P.PIX = true;
  P.TILE = 20;
  P.INK = '#0c0a10';

  /* ---------- palette commune (stable d'un bloc à l'autre) ---------- */
  var PAL = [], LUT = new Int16Array(32768).fill(-1);
  (function build() {
    var add = function (hex) { var c = U.hexToRgb(hex); PAL.push(c); };
    ['#0c0a10', '#1a1820', '#2a2830', '#3c3a44', '#52505a', '#6a6872', '#84828c', '#9e9ca6', '#b8b6be', '#d2d0d6', '#e8e6ea', '#f8f8fa', '#ffffff'].forEach(add);
    var Ls = [0.1, 0.19, 0.29, 0.4, 0.52, 0.64, 0.76, 0.87], Ss = [0.22, 0.48, 0.78];
    for (var h = 0; h < 360; h += 15) for (var si = 0; si < Ss.length; si++) for (var li = 0; li < Ls.length; li++) {
      var rgb = hsl2rgb(h / 360, Ss[si], Ls[li]); PAL.push(rgb);
    }
    // tons chair et bois, souvent utilisés
    ['#f8dcc4', '#e8c0a0', '#dcae94', '#c08a6a', '#8a5a3a', '#6a4028', '#4a2a18', '#f4e8d0', '#e0cca8', '#c8a878'].forEach(add);
  })();
  function hsl2rgb(h, s, l) {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var f = function (t) { t = (t + 1) % 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 0.5) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
    return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
  }
  function nearest(r, g, b) {
    var k = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3), v = LUT[k];
    if (v >= 0) return v;
    var best = 0, bd = 1e9, rr = (r & 0xf8) + 4, gg = (g & 0xf8) + 4, bb = (b & 0xf8) + 4;
    for (var i = 0; i < PAL.length; i++) {
      var c = PAL[i], dr = rr - c[0], dg = gg - c[1], db = bb - c[2], rm = (rr + c[0]) / 2;
      var d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
      if (d < bd) { bd = d; best = i; }
    }
    LUT[k] = best; return best;
  }
  P.PALETTE = PAL;
  P.nearest = function (r, g, b) { return PAL[nearest(r, g, b)]; };

  /* ---------- aplatissement d'une image ----------
     o.thr : seuil d'opacité (false = garder l'alpha), o.quant : palette,
     o.outline : couleur du contour (4 voisins), o.keepAlpha : alpha conservé mais quantifié */
  P.crisp = function (c, o) {
    o = o || {};
    var w = c.width, h = c.height; if (!w || !h) return c;
    var x = c.getContext('2d'), img = x.getImageData(0, 0, w, h), d = img.data, n = w * h;
    var thr = o.thr === undefined ? 110 : o.thr, quant = o.quant === undefined ? 'k' : o.quant;
    if (quant === 'k') {
      for (var j = 0; j < n * 4; j += 4) { if (thr !== false) d[j + 3] = d[j + 3] < thr ? 0 : 255; }
      kmeans(d, n, o.k || 9);
      if (o.outline) outlineData(d, w, h, U.hexToRgb(o.outline), o.outlineAlpha);
      x.putImageData(img, 0, 0);
      return c;
    }
    for (var i = 0; i < n * 4; i += 4) {
      var a = d[i + 3];
      if (thr !== false) { if (a < thr) { d[i + 3] = 0; continue; } d[i + 3] = 255; }
      else if (a === 0) continue;
      else if (o.alphaSteps) d[i + 3] = Math.round(a / 255 * o.alphaSteps) / o.alphaSteps * 255;
      if (quant) { var c2 = PAL[nearest(d[i], d[i + 1], d[i + 2])]; d[i] = c2[0]; d[i + 1] = c2[1]; d[i + 2] = c2[2]; }
    }
    if (o.outline) outlineData(d, w, h, U.hexToRgb(o.outline), o.outlineAlpha);
    x.putImageData(img, 0, 0);
    return c;
  };
  /* aplats : k-moyennes sur les couleurs opaques (garde les teintes du dessin) */
  function kmeans(d, n, k) {
    var idx = [];
    for (var i = 0; i < n; i++) if (d[i * 4 + 3] > 0) idx.push(i);
    if (idx.length < k * 2) return;
    var lum = function (i) { return d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11; };
    var sorted = idx.slice().sort(function (a, b) { return lum(a) - lum(b); });
    var cen = [];
    for (var c = 0; c < k; c++) { var q = sorted[Math.floor((c + 0.5) / k * sorted.length)]; cen.push([d[q * 4], d[q * 4 + 1], d[q * 4 + 2]]); }
    var asg = new Int16Array(idx.length);
    for (var it = 0; it < 6; it++) {
      var acc = []; for (c = 0; c < k; c++) acc.push([0, 0, 0, 0]);
      for (var m = 0; m < idx.length; m++) {
        var p = idx[m] * 4, r = d[p], g = d[p + 1], b = d[p + 2], best = 0, bd = 1e9;
        for (c = 0; c < k; c++) { var e = cen[c], dr = r - e[0], dg = g - e[1], db = b - e[2], dd = 3 * dr * dr + 4 * dg * dg + 2 * db * db; if (dd < bd) { bd = dd; best = c; } }
        asg[m] = best; var A = acc[best]; A[0] += r; A[1] += g; A[2] += b; A[3]++;
      }
      for (c = 0; c < k; c++) if (acc[c][3]) cen[c] = [acc[c][0] / acc[c][3], acc[c][1] / acc[c][3], acc[c][2] / acc[c][3]];
    }
    for (m = 0; m < idx.length; m++) { var pp = idx[m] * 4, cc = cen[asg[m]]; d[pp] = cc[0]; d[pp + 1] = cc[1]; d[pp + 2] = cc[2]; }
  }
  function outlineData(d, w, h, col, al) {
    var n = w * h, m = new Uint8Array(n), A = al === undefined ? 255 : al;
    for (var i = 0; i < n; i++) m[i] = d[i * 4 + 3] > 0 ? 1 : 0;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var k = y * w + x; if (m[k]) continue;
      if ((x > 0 && m[k - 1]) || (x < w - 1 && m[k + 1]) || (y > 0 && m[k - w]) || (y < h - 1 && m[k + w])) {
        var j = k * 4; d[j] = col[0]; d[j + 1] = col[1]; d[j + 2] = col[2]; d[j + 3] = A;
      }
    }
  }
  P.outline = function (c, col) {
    var x = c.getContext('2d'), img = x.getImageData(0, 0, c.width, c.height);
    outlineData(img.data, c.width, c.height, U.hexToRgb(col || P.INK)); x.putImageData(img, 0, 0); return c;
  };
  /* seuil binaire d'un masque (garde la couleur) */
  P.binarize = function (c, thr) {
    var x = c.getContext('2d'), img = x.getImageData(0, 0, c.width, c.height), d = img.data;
    for (var i = 3; i < d.length; i += 4) d[i] = d[i] >= (thr || 128) ? 255 : 0;
    x.putImageData(img, 0, 0); return c;
  };
  /* assombrit les pixels de bord d'un calque (1 px), pour des limites franches */
  P.edgeDarken = function (c, k, inner) {
    var x = c.getContext('2d'), w = c.width, h = c.height, img = x.getImageData(0, 0, w, h), d = img.data;
    var m = new Uint8Array(w * h); for (var i = 0; i < w * h; i++) m[i] = d[i * 4 + 3] > 127 ? 1 : 0;
    for (var y = 0; y < h; y++) for (var xx = 0; xx < w; xx++) {
      var q = y * w + xx; if (!m[q]) continue;
      var edge = (xx > 0 && !m[q - 1]) || (xx < w - 1 && !m[q + 1]) || (y > 0 && !m[q - w]) || (y < h - 1 && !m[q + w]);
      if (!edge) continue;
      var j = q * 4; d[j] = d[j] * (1 - k); d[j + 1] = d[j + 1] * (1 - k); d[j + 2] = d[j + 2] * (1 - k);
    }
    x.putImageData(img, 0, 0); return c;
  };

  /* ---------- ombre au sol pleine (ellipse en pixels) ---------- */
  P.pxShadow = function (x, cx, cy, rx, ry, a) {
    rx = Math.max(2, Math.round(rx)); ry = Math.max(1, Math.round(ry));
    x.fillStyle = 'rgba(8,6,16,' + (a === undefined ? 0.3 : a) + ')';
    for (var yy = -ry; yy <= ry; yy++) {
      var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / ((ry + 0.5) * (ry + 0.5)))));
      if (hw > 0) x.fillRect(Math.round(cx) - hw, Math.round(cy) + yy, hw * 2, 1);
    }
  };

  /* ---------- sprite depuis une grille de caractères ---------- */
  P.grid = function (rows, pal, opt) {
    opt = opt || {};
    var h = rows.length, w = 0; rows.forEach(function (r) { if (r.length > w) w = r.length; });
    var m = opt.margin === undefined ? 1 : opt.margin, t = P.mk(w + m * 2, h + m * 2);
    P.paintGrid(t.x, rows, pal, m, m);
    if (opt.outline !== false) P.outline(t.c, opt.outline || P.INK);
    return t.c;
  };
  P.paintGrid = function (x, rows, pal, ox, oy, flip) {
    var w = 0; rows.forEach(function (r) { if (r.length > w) w = r.length; });
    for (var y = 0; y < rows.length; y++) {
      var r = rows[y];
      for (var i = 0; i < r.length; i++) {
        var ch = r[i]; if (ch === '.' || ch === ' ') continue;
        var col = pal[ch]; if (!col) continue;
        x.fillStyle = col; x.fillRect(ox + (flip ? w - 1 - i : i), oy + y, 1, 1);
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
