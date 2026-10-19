/* =========================================================================
 *  Post-traitements de style (sur le tampon basse résolution).
 *  Chaque style modifie réellement la composition des pixels :
 *  dithering, hachures, fusain, aquarelle, crayon, psychédélisme...
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var noiseTex = null, noiseW = 0, noiseH = 0;

  function ensureNoise(w, h) {
    if (noiseTex && noiseW === w && noiseH === h) return;
    noiseW = w; noiseH = h; noiseTex = new Float32Array(w * h);
    var r = YN.rng.make(1234);
    for (var i = 0; i < w * h; i++) noiseTex[i] = r.next();
    // fibres du papier
    for (var k = 0; k < w * h / 40; k++) {
      var x = r.int(0, w - 1), y = r.int(0, h - 1), len = r.int(3, 10), dx = r.chance(0.5) ? 1 : 0, dy = 1 - dx;
      for (var s = 0; s < len; s++) { var xx = x + s * dx, yy = y + s * dy; if (xx < w && yy < h) noiseTex[yy * w + xx] *= 0.7; }
    }
  }
  function lum(r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; }

  var FX = YN.postfx = {
    /* tableau des styles : fn(data, w, h, t, opts) */
    mono: function (d, w, h, t, o) {
      var levels = (o && o.levels) || 2, contrast = (o && o.contrast) || 1.15;
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        var l = (lum(d[i], d[i + 1], d[i + 2]) / 255 - 0.5) * contrast + 0.5;
        var th = (BAYER4[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
        var q = Math.floor(l * (levels - 1) + th) / (levels - 1);
        var v = U.clamp(q, 0, 1) * 255;
        if (o && o.tint) { d[i] = v * o.tint[0]; d[i + 1] = v * o.tint[1]; d[i + 2] = v * o.tint[2]; }
        else d[i] = d[i + 1] = d[i + 2] = v;
      }
    },
    gray: function (d, w, h) { for (var i = 0; i < d.length; i += 4) { var l = lum(d[i], d[i + 1], d[i + 2]); d[i] = d[i + 1] = d[i + 2] = l; } },
    sepia: function (d, w, h, t, o) {
      for (var i = 0; i < d.length; i += 4) { var l = lum(d[i], d[i + 1], d[i + 2]); d[i] = U.clamp(l * 1.07 + 20, 0, 255); d[i + 1] = U.clamp(l * 0.95 + 8, 0, 255); d[i + 2] = U.clamp(l * 0.78, 0, 255); }
    },
    quantize: function (d, w, h, t, o) { // palette limitée (8-bit)
      var pal = (o && o.palette) || ['#0f0f1b', '#565a75', '#c6b7be', '#fafbf6'];
      var P = pal.map(U.hexToRgb);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, th = ((BAYER4[(y & 3) * 4 + (x & 3)] / 16) - 0.5) * 48;
        var r = d[i] + th, g = d[i + 1] + th, b = d[i + 2] + th, best = 0, bd = 1e9;
        for (var k = 0; k < P.length; k++) { var dr = r - P[k][0], dg = g - P[k][1], db = b - P[k][2], dd = dr * dr + dg * dg + db * db; if (dd < bd) { bd = dd; best = k; } }
        d[i] = P[best][0]; d[i + 1] = P[best][1]; d[i + 2] = P[best][2];
      }
    },
    charcoal: function (d, w, h, t, o) {
      ensureNoise(w, h);
      var src = new Uint8ClampedArray(d), paper = (o && o.paper) || [236, 230, 216];
      var jit = Math.floor(t * 4) % 3;
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        var i = (y * w + x) * 4;
        var l = lum(src[i], src[i + 1], src[i + 2]) / 255;
        // contours (Sobel simplifié) → traits sombres
        var gx = lum(src[i + 4], src[i + 5], src[i + 6]) - lum(src[i - 4], src[i - 3], src[i - 2]);
        var j2 = ((y + 1) * w + x) * 4, j1 = ((y - 1) * w + x) * 4;
        var gy = lum(src[j2], src[j2 + 1], src[j2 + 2]) - lum(src[j1], src[j1 + 1], src[j1 + 2]);
        var edge = Math.min(1, (Math.abs(gx) + Math.abs(gy)) / 140);
        var n = noiseTex[((y + jit) % h) * w + ((x + jit * 3) % w)];
        var tone = l * 0.85 + 0.15;
        // grain : le fusain n'accroche que le haut du papier
        var dark = (1 - tone);
        dark = dark * (0.55 + 0.6 * n) + edge * (0.6 + 0.4 * n);
        var v = U.clamp(1 - dark, 0, 1);
        d[i] = paper[0] * v; d[i + 1] = paper[1] * v; d[i + 2] = paper[2] * v;
      }
    },
    engraving: function (d, w, h, t, o) {
      var ink = (o && o.ink) || [30, 24, 20], paper = (o && o.paper) || [232, 222, 196];
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, l = lum(d[i], d[i + 1], d[i + 2]) / 255, on = false;
        if (l < 0.85 && ((x + y) % 4 === 0)) on = true;
        if (l < 0.6 && ((x - y + 400) % 4 === 0)) on = true;
        if (l < 0.38 && (y % 3 === 0)) on = true;
        if (l < 0.18) on = true;
        var c = on ? ink : paper;
        d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
      }
    },
    watercolor: function (d, w, h, t, o) {
      ensureNoise(w, h);
      var src = new Uint8ClampedArray(d);
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        var i = (y * w + x) * 4, r = 0, g = 0, b = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var j = ((y + dy) * w + x + dx) * 4; r += src[j]; g += src[j + 1]; b += src[j + 2]; }
        r /= 9; g /= 9; b /= 9;
        var gx = Math.abs(lum(src[i + 4], src[i + 5], src[i + 6]) - lum(src[i - 4], src[i - 3], src[i - 2]));
        var edge = Math.min(1, gx / 90) * 0.35;
        var n = noiseTex[y * w + x];
        var wash = 0.28 + n * 0.12; // lavis : éclaircit vers le papier
        d[i] = U.clamp((r * (1 - wash) + 245 * wash) * (1 - edge), 0, 255);
        d[i + 1] = U.clamp((g * (1 - wash) + 240 * wash) * (1 - edge), 0, 255);
        d[i + 2] = U.clamp((b * (1 - wash) + 228 * wash) * (1 - edge), 0, 255);
      }
    },
    crayon: function (d, w, h, t, o) {
      ensureNoise(w, h);
      var src = new Uint8ClampedArray(d), ph = Math.floor(t * 3) % 2;
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        var i = (y * w + x) * 4;
        // stries diagonales du crayon : le blanc du papier transparaît
        var stroke = ((x * 2 + y + ph) % 5 === 0) || noiseTex[y * w + x] > 0.86;
        var gx = Math.abs(lum(src[i + 4], src[i + 5], src[i + 6]) - lum(src[i - 4], src[i - 3], src[i - 2]));
        var j = ((y + 1) * w + x) * 4, gy = Math.abs(lum(src[j], src[j + 1], src[j + 2]) - lum(src[i], src[i + 1], src[i + 2]));
        if (gx + gy > 60 && noiseTex[(y * w + x + ph * 7) % (w * h)] > 0.25) { d[i] = 40; d[i + 1] = 34; d[i + 2] = 40; continue; }
        var k = stroke ? 0.55 : 0;
        d[i] = src[i] * (1 - k) + 250 * k; d[i + 1] = src[i + 1] * (1 - k) + 246 * k; d[i + 2] = src[i + 2] * (1 - k) + 236 * k;
      }
    },
    psychedelic: function (d, w, h, t, o) {
      var speed = (o && o.speed) || 1, amp = (o && o.amp !== undefined) ? o.amp : 1;
      var src = new Uint8ClampedArray(d);
      for (var y = 0; y < h; y++) {
        var off = Math.round(Math.sin(y * 0.07 + t * 1.3 * speed) * 3 * amp);
        for (var x = 0; x < w; x++) {
          var sx = U.mod(x + off, w), i = (y * w + x) * 4, j = (y * w + sx) * 4;
          var a = (Math.sin((x + y) * 0.025 + t * 0.6 * speed) * 0.5 + 0.5) * amp;
          var r = src[j], g = src[j + 1], b = src[j + 2];
          // rotation chromatique continue
          var c = Math.cos(a * 6.28), s = Math.sin(a * 6.28);
          d[i] = U.clamp(r * (0.667 + 0.333 * c) + g * (0.333 - 0.333 * c - 0.577 * s) + b * (0.333 - 0.333 * c + 0.577 * s), 0, 255);
          d[i + 1] = U.clamp(r * (0.333 - 0.333 * c + 0.577 * s) + g * (0.667 + 0.333 * c) + b * (0.333 - 0.333 * c - 0.577 * s), 0, 255);
          d[i + 2] = U.clamp(r * (0.333 - 0.333 * c - 0.577 * s) + g * (0.333 - 0.333 * c + 0.577 * s) + b * (0.667 + 0.333 * c), 0, 255);
        }
      }
    },
    silhouette: function (d, w, h, t, o) {
      var pal = ((o && o.palette) || ['#120a14', '#5a2a3a', '#e8905a', '#f8d8a0']).map(U.hexToRgb);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, l = lum(d[i], d[i + 1], d[i + 2]) / 255;
        var k = l < 0.22 ? 0 : l < 0.45 ? 1 : l < 0.72 ? 2 : 3;
        d[i] = pal[k][0]; d[i + 1] = pal[k][1]; d[i + 2] = pal[k][2];
      }
    },
    pattern: function (d, w, h, t, o) {
      var size = (o && o.size) || 8, shift = Math.floor(t * 2);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, cx = (x + shift) % size, cy = y % size;
        var m = ((cx < size / 2) !== (cy < size / 2)) ? 0.86 : 1.06;
        if ((cx === 0 || cy === 0)) m = 0.75;
        d[i] = U.clamp(d[i] * m, 0, 255); d[i + 1] = U.clamp(d[i + 1] * m, 0, 255); d[i + 2] = U.clamp(d[i + 2] * m, 0, 255);
      }
    },
    halftone: function (d, w, h, t, o) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, l = lum(d[i], d[i + 1], d[i + 2]) / 255;
        var cx = (x % 4) - 1.5, cy = (y % 4) - 1.5, r = Math.sqrt(cx * cx + cy * cy) / 2.2;
        if (r > l + 0.25) { d[i] *= 0.55; d[i + 1] *= 0.55; d[i + 2] *= 0.55; }
      }
    },
    grain: function (d, w, h, t, o) {
      var amt = (o && o.amount) || 18, seed = Math.floor(t * 24);
      for (var i = 0, p = 0; i < d.length; i += 4, p++) {
        var n = (YN.rng.cell(p, seed, 7) - 0.5) * amt;
        d[i] = U.clamp(d[i] + n, 0, 255); d[i + 1] = U.clamp(d[i + 1] + n, 0, 255); d[i + 2] = U.clamp(d[i + 2] + n, 0, 255);
      }
    },
    invert: function (d) { for (var i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2]; } },
    flatten: function (d, w, h, t, o) { // nuits « aplaties »
      var k = (o && o.amount) || 0.6;
      for (var i = 0; i < d.length; i += 4) { var l = lum(d[i], d[i + 1], d[i + 2]); d[i] = d[i] * (1 - k) + l * k * 0.95; d[i + 1] = d[i + 1] * (1 - k) + l * k * 0.95; d[i + 2] = d[i + 2] * (1 - k) + l * k; }
    },
    painting: function (d, w, h, t, o) {
      var src = new Uint8ClampedArray(d), seed = Math.floor(t * 2);
      for (var by = 0; by < h; by += 3) for (var bx = 0; bx < w; bx += 3) {
        var cx = U.clamp(bx + Math.floor(YN.rng.cell(bx, by, seed) * 3), 0, w - 1), cy = U.clamp(by + Math.floor(YN.rng.cell(by, bx, seed) * 3), 0, h - 1);
        var j = (cy * w + cx) * 4, ang = YN.rng.cell(bx, by, 99) > 0.5;
        for (var k = -2; k <= 3; k++) {
          var x = ang ? bx + k : bx + 1, y = ang ? by + 1 : by + k;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          var i = (y * w + x) * 4;
          d[i] = (src[j] * 2 + d[i]) / 3; d[i + 1] = (src[j + 1] * 2 + d[i + 1]) / 3; d[i + 2] = (src[j + 2] * 2 + d[i + 2]) / 3;
        }
      }
    },
    scan: function (d, w, h, t) { for (var y = 0; y < h; y += 2) for (var x = 0; x < w; x++) { var i = (y * w + x) * 4; d[i] *= 0.82; d[i + 1] *= 0.82; d[i + 2] *= 0.82; } }
  };

  /* Liste des post-effets associés à chaque style de rendu */
  YN.STYLE_POST = {
    pixel16: [], hires: [], dark: [], void: [], ascii: [],
    pixel8: ['quantize'], mono: ['mono'], charcoal: ['charcoal'], engraving: ['engraving'],
    watercolor: ['watercolor'], crayon: ['crayon'], psychedelic: ['psychedelic'], silhouette: ['silhouette'],
    pattern: ['pattern'], collage: ['halftone', 'grain'], painting: ['painting'], realistic: ['grain'],
    photo: ['sepia', 'grain'], sepia: ['sepia'], surveillance: ['gray', 'scan', 'grain']
  };
})(typeof window !== 'undefined' ? window : globalThis);
