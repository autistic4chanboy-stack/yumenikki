/* =========================================================================
 *  HORREUR ET PSYCHÉDÉLIQUE — pièces de dessin en plus pour les habitants
 *  (têtes, yeux, bouches, cous, bras, auras, créatures) et pour les formes
 *  et accessoires des effets. Branché dans art_chars.js (S.EYES_X, S.MOUTH_X,
 *  S.HEADS, S.HORROR, S.CREATURES_X, S.ACC, S.FORMS).
 *  Unité : la case. Les têtes sont dessinées autour de (0, 0).
 *  Le temps (S._t) ne prend que quatre valeurs par habitant (cache) : les
 *  animations sont lentes et en boucle.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint, S = YN.spr;
  var TAU = Math.PI * 2;

  function E(x, cx, cy, rx, ry, fill, line, lw, rot) {
    x.beginPath(); x.ellipse(cx, cy, Math.max(0.001, rx), Math.max(0.001, ry), rot || 0, 0, TAU);
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (line) { x.strokeStyle = line; x.lineWidth = lw; x.stroke(); }
  }
  function path(x, pts, fill, line, lw, close) {
    x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) { var p = pts[i]; if (p.length === 4) x.quadraticCurveTo(p[0], p[1], p[2], p[3]); else x.lineTo(p[0], p[1]); }
    if (close !== false) x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (line) { x.strokeStyle = line; x.lineWidth = lw; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); }
  }
  function line(x, x0, y0, x1, y1, col, w) { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); }
  function hc(look, i, d) { return (look && look.c && look.c[i]) || d; }
  function rng(seed) { return YN.rng.make(typeof seed === 'number' ? seed : YN.rng.hash(String(seed))); }
  function hue(t, off, sat, li) { return 'hsl(' + Math.round(U.mod(t * 60 + (off || 0), 360)) + ',' + (sat || 90) + '%,' + (li || 60) + '%)'; }
  /* un œil : blanc, iris, pupille ; open = 0..1 */
  function eyeball(x, cx, cy, r, iris, open, lw, look) {
    if (open <= 0.05) { line(x, cx - r, cy, cx + r, cy, '#1a1010', lw * 1.6); return; }
    E(x, cx, cy, r, r * 0.72 * open, '#f4efe6', '#2a1a1a', lw);
    x.save(); x.beginPath(); x.ellipse(cx, cy, r, r * 0.72 * open, 0, 0, TAU); x.clip();
    var gx = (look && look.gaze) || 0;
    E(x, cx + gx * r * 0.3, cy, r * 0.5, r * 0.5, iris || '#6a2030'); E(x, cx + gx * r * 0.3, cy, r * 0.22, r * 0.22, '#050505'); E(x, cx - r * 0.18, cy - r * 0.2, r * 0.12, r * 0.1, '#fff');
    x.restore();
  }
  function blinkAt(t, k) { var v = U.mod(t * 0.9 + k * 0.37, 1.6); return v < 0.12 ? 0.05 : 1; }
  function teethRow(x, x0, x1, y, h, n, col) { var w = (x1 - x0) / n; for (var i = 0; i < n; i++) path(x, [[x0 + i * w, y], [x0 + (i + 0.5) * w, y + h], [x0 + (i + 1) * w, y]], col || '#f0ead8'); }

  /* ================= YEUX ================= */
  S.EYES_X = {
    void: function (x, e, look, lw) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.05, 0.065, '#020203'); E(x, ex + k * dx, ey + 0.005, 0.011, 0.011, '#f4f4f4'); }); },
    stare: function (x, e, look, lw) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.45; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.058, 0.058, '#fbf8f0', '#3a1a1a', lw); line(x, ex + k * dx - 0.05, ey + 0.01, ex + k * dx - 0.02, ey, '#c84040', lw * 0.7); line(x, ex + k * dx + 0.05, ey - 0.01, ex + k * dx + 0.025, ey + 0.005, '#c84040', lw * 0.7); E(x, ex + k * dx, ey, 0.009, 0.009, '#050505'); }); },
    bleed: function (x, e, look, lw, t) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42, col = look.bleed || '#0a0606', run = 0.12 + 0.05 * Math.sin(t * 1.5); [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.04, 0.05, '#050304'); path(x, [[ex + k * dx - 0.014, ey + 0.03], [ex + k * dx + 0.014, ey + 0.03], [ex + k * dx + 0.01, ey + run], [ex + k * dx, ey + run + 0.025], [ex + k * dx - 0.01, ey + run]], col); }); },
    red: function (x, e, look, lw, t) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.05, 0.04, 'rgba(0,0,0,0.85)'); E(x, ex + k * dx, ey, 0.014, 0.012, '#ff2030'); E(x, ex + k * dx, ey, 0.04, 0.03, 'rgba(255,30,40,' + (0.18 + 0.08 * Math.sin(t * 3)) + ')'); }); },
    vertical: function (x, e, look, lw) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42, col = look.eyeColor || '#e8c030'; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.026, 0.06, col, '#2a1a00', lw); E(x, ex + k * dx, ey, 0.006, 0.05, '#050505'); }); },
    uneven: function (x, e, look, lw, t) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42; eyeball(x, ex - dx, ey - 0.01, 0.075, '#5a1a2a', blinkAt(t, 1), lw, look); E(x, ex + dx, ey + 0.01, 0.014, 0.014, '#050505'); },
    spin: function (x, e, look, lw, t) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.05, 0.05, '#0a0a14'); x.lineWidth = lw * 1.2; for (var a = 0; a < 14; a += 0.5) { x.strokeStyle = hue(t, a * 25 + k * 90); x.beginPath(); x.arc(ex + k * dx, ey, 0.004 + a * 0.0032, a + t * 4 * k, a + 0.6 + t * 4 * k); x.stroke(); } }); },
    lots: function (x, e, look, lw, t) { var r = rng('lots' + (look.seed || 0)); for (var i = 0; i < 9; i++) { var px = e.eyes[0] + (r.next() - 0.5) * 0.3, py = e.eyes[1] + (r.next() - 0.55) * 0.26, rr = 0.016 + r.next() * 0.022; eyeball(x, px, py, rr, look.eyeColor || '#3a2a6a', blinkAt(t, i), lw * 0.6, look); } },
    blank: function (x, e, look, lw) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.045, 0.035, '#fffdf6', '#5a5048', lw * 0.8); }); },
    hollowglow: function (x, e, look, lw, t) { var ex = e.eyes[0], ey = e.eyes[1], dx = (e.w || 0.18) * 0.42, c = look.eyeColor || '#9af0ff'; [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.05, 0.06, '#000'); E(x, ex + k * dx, ey, 0.03, 0.036, P.rgba(c, 0.25 + 0.15 * Math.sin(t * 2 + k))); E(x, ex + k * dx, ey, 0.012, 0.014, c); }); }
  };

  /* ================= BOUCHES ================= */
  S.MOUTH_X = {
    teeth: function (x, e, lw) { var cx = e.eyes[0], cy = e.eyes[1] + 0.1; path(x, [[cx - 0.13, cy - 0.03], [cx, cy + 0.11, cx + 0.13, cy - 0.03], [cx, cy + 0.02, cx - 0.13, cy - 0.03]], '#1a0406', '#100204', lw); teethRow(x, cx - 0.11, cx + 0.11, cy - 0.012, 0.035, 9); x.save(); x.translate(0, 0.06); x.scale(1, -1); x.translate(0, -2 * cy - 0.035); teethRow(x, cx - 0.08, cx + 0.08, cy, 0.03, 7); x.restore(); },
    gape: function (x, e, lw, t) { var cx = e.eyes[0], cy = e.eyes[1] + 0.1, l = 0.16 + 0.03 * Math.sin(t * 1.2); E(x, cx, cy + l / 2, 0.045, l / 2 + 0.02, '#040203', '#200a0a', lw); },
    ear2ear: function (x, e, lw) { var cx = e.eyes[0], cy = e.eyes[1] + 0.09; path(x, [[cx - 0.17, cy - 0.05], [cx, cy + 0.08, cx + 0.17, cy - 0.05]], null, '#3a0408', lw * 2.4, false); path(x, [[cx - 0.17, cy - 0.05], [cx, cy + 0.08, cx + 0.17, cy - 0.05]], null, '#b01020', lw * 0.9, false); for (var i = -3; i <= 3; i++) { var px = cx + i * 0.045, py = cy + 0.03 - Math.abs(i) * 0.012 * Math.abs(i) * 0.5; line(x, px, py - 0.018, px, py + 0.018, '#1a0a0a', lw * 0.8); } },
    drool: function (x, e, lw, t) { var cx = e.eyes[0], cy = e.eyes[1] + 0.1, d = 0.06 + 0.05 * U.mod(t * 0.6, 1); E(x, cx, cy, 0.03, 0.02, '#120404'); path(x, [[cx - 0.008, cy + 0.015], [cx + 0.008, cy + 0.015], [cx + 0.005, cy + d], [cx, cy + d + 0.015], [cx - 0.005, cy + d]], '#2a1010'); },
    many: function (x, e, lw, t) { [[-0.09, 0.07], [0.08, 0.1], [0, 0.15]].forEach(function (q, i) { var o = 0.008 + 0.01 * (0.5 + 0.5 * Math.sin(t * 2 + i * 2)); E(x, e.eyes[0] + q[0], e.eyes[1] + q[1], 0.03, o, '#1a0406', '#3a1010', lw * 0.7); }); },
    whisper: function (x, e, lw, t) { var cx = e.eyes[0], cy = e.eyes[1] + 0.1, o = 0.004 + 0.016 * Math.abs(Math.sin(t * 3)); E(x, cx, cy, 0.03, o, '#200808', '#5a2020', lw * 0.8); },
    stitchwide: function (x, e, lw) { var cx = e.eyes[0], cy = e.eyes[1] + 0.1; line(x, cx - 0.14, cy, cx + 0.14, cy, '#1a0a0a', lw * 1.4); for (var i = -6; i <= 6; i++) line(x, cx + i * 0.022, cy - 0.022, cx + i * 0.022 + 0.006, cy + 0.022, '#1a0a0a', lw); }
  };

  /* ================= TÊTES ================= */
  var H = S.HEADS;
  H.faceless = function (x, look, lw) { var s = hc(look, 2, '#e8d8c8'); P.ball(x, 0, 0, 0.18, 0.2, s, { hi: 0.1, lo: -0.25, line: P.sh(s, -0.5), lw: lw }); E(x, -0.07, 0.01, 0.04, 0.02, P.rgba(P.sh(s, -0.3), 0.25)); E(x, 0.07, 0.01, 0.04, 0.02, P.rgba(P.sh(s, -0.3), 0.25)); return null; };
  H.eyes = function (x, look, lw) { var s = hc(look, 2, '#d8c8b8'), t = S._t; P.ball(x, 0, 0, 0.2, 0.2, s, { lo: -0.25, line: P.sh(s, -0.5), lw: lw }); var r = rng('eyes' + (look.seed || 0)); for (var i = 0; i < 11; i++) { var a = r.next() * TAU, d = Math.sqrt(r.next()) * 0.14, rr = 0.022 + r.next() * 0.03; eyeball(x, Math.cos(a) * d, Math.sin(a) * d, rr, look.eyeColor || '#5a2a3a', blinkAt(t, i), lw * 0.6, look); } return null; };
  H.maw = function (x, look, lw) { var s = hc(look, 2, '#c8a8a0'); P.ball(x, 0, 0, 0.21, 0.21, s, { lo: -0.3, line: P.sh(s, -0.5), lw: lw }); var o = 0.11 + 0.025 * Math.sin(S._t * 1.4); E(x, 0, 0.02, 0.17, o, '#1a0206', '#3a0a10', lw * 1.4); teethRow(x, -0.15, 0.15, 0.02 - o + 0.01, 0.05, 10); x.save(); x.translate(0, 0.04 + 2 * o - 0.02); x.scale(1, -1); teethRow(x, -0.14, 0.14, 0, 0.045, 9); x.restore(); E(x, 0.02, 0.06, 0.06, 0.03, '#a03040'); return null; };
  H.split = function (x, look, lw) { var s = hc(look, 2, '#e0c8b0'), g = 0.035 + 0.02 * Math.sin(S._t * 1.1); [-1, 1].forEach(function (k) { x.save(); x.translate(k * g, 0); x.beginPath(); x.rect(k < 0 ? -0.3 : 0, -0.3, 0.3, 0.6); x.clip(); P.ball(x, 0, 0, 0.19, 0.2, s, { lo: -0.2, line: P.sh(s, -0.5), lw: lw }); E(x, k * 0.08, -0.01, 0.03, 0.035, '#050304'); E(x, k * 0.08, -0.005, 0.008, 0.008, '#fff'); x.restore(); }); path(x, [[-g, -0.19], [g, -0.19], [g, 0.19], [-g, 0.19]], '#3a0610'); for (var i = 0; i < 6; i++) { var yy = -0.15 + i * 0.06; path(x, [[-g, yy], [0, yy + 0.02], [-g, yy + 0.04]], '#f0e8d0'); path(x, [[g, yy + 0.03], [0, yy + 0.05], [g, yy + 0.07]], '#f0e8d0'); } return null; };
  H.porcelain = function (x, look, lw) { P.ball(x, 0, 0, 0.18, 0.2, '#f4f0ea', { hi: 0.15, lo: -0.12, line: '#8a8078', lw: lw }); E(x, -0.07, 0, 0.035, 0.04, '#050304'); E(x, 0.07, 0, 0.03, 0.035, '#2a3a6a'); E(x, 0.07, 0, 0.012, 0.012, '#050505'); E(x, 0.06, -0.012, 0.007, 0.007, '#fff'); E(x, -0.11, 0.07, 0.03, 0.015, 'rgba(230,120,140,0.5)'); E(x, 0.11, 0.07, 0.03, 0.015, 'rgba(230,120,140,0.5)'); E(x, 0, 0.11, 0.02, 0.012, '#c03040'); x.strokeStyle = '#3a3230'; x.lineWidth = lw * 0.9; x.beginPath(); x.moveTo(-0.07, -0.04); x.lineTo(-0.1, -0.11); x.lineTo(-0.06, -0.15); x.lineTo(-0.09, -0.2); x.moveTo(-0.1, -0.11); x.lineTo(-0.15, -0.1); x.moveTo(-0.05, 0.03); x.lineTo(-0.02, 0.09); x.stroke(); path(x, [[-0.09, -0.13], [-0.05, -0.16], [-0.06, -0.1]], '#151010'); return null; };
  H.static = function (x, look, lw) { var t = S._t, r = rng(Math.floor(t * 5) * 977 + (look.seed || 0)); P.rr(x, -0.21, -0.18, 0.42, 0.34, 0.04); x.fillStyle = '#2a2a2e'; x.fill(); x.strokeStyle = '#0a0a0a'; x.lineWidth = lw; x.stroke(); for (var yy = -0.15; yy < 0.13; yy += 0.022) for (var xx = -0.18; xx < 0.18; xx += 0.022) { var v = r.int(90, 240); x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(xx, yy, 0.022, 0.022); } if (U.mod(t, 1.6) < 0.4) { E(x, -0.06, -0.03, 0.03, 0.04, 'rgba(0,0,0,0.7)'); E(x, 0.06, -0.03, 0.03, 0.04, 'rgba(0,0,0,0.7)'); E(x, 0, 0.07, 0.06, 0.02, 'rgba(0,0,0,0.6)'); } line(x, -0.1, -0.18, -0.16, -0.3, '#888', lw); line(x, 0.1, -0.18, 0.16, -0.3, '#888', lw); return null; };
  H.long = function (x, look, lw) { var s = hc(look, 2, '#e4d4c4'); P.ball(x, 0, -0.08, 0.14, 0.32, s, { lo: -0.25, line: P.sh(s, -0.5), lw: lw }); return { eyes: [0, 0.08], w: 0.12 }; };
  H.upside = function (x, look, lw) { var s = hc(look, 2, '#f0d0b8'); P.ball(x, 0, 0, 0.19, 0.18, s, { hi: 0.12, lo: -0.18, line: P.sh(s, -0.5), lw: lw }); path(x, [[-0.05, -0.07], [0, -0.1, 0.05, -0.07]], null, '#5a1a1a', lw * 1.6, false); [-1, 1].forEach(function (k) { E(x, k * 0.075, 0.06, 0.026, 0.034, '#1a1418'); E(x, k * 0.075 + 0.008, 0.075, 0.009, 0.009, '#fff'); path(x, [[k * 0.075 - 0.035, 0.1 - k * 0.01], [k * 0.075 + 0.035, 0.1 + k * 0.01]], null, '#3a2a28', lw * 1.3, false); }); return null; };
  H.petals = function (x, look, lw) { var t = S._t, c = hc(look, 3, '#c04070'); for (var i = 0; i < 8; i++) { var a = i / 8 * TAU + t * 0.4; x.save(); x.rotate(a); E(x, 0.16, 0, 0.1, 0.055, c, P.sh(c, -0.4), lw); eyeball(x, 0.17, 0, 0.03, '#2a1a3a', blinkAt(t, i), lw * 0.5); x.restore(); } P.ball(x, 0, 0, 0.1, 0.1, hc(look, 2, '#f0e0c0'), { line: '#5a3a20', lw: lw }); eyeball(x, 0, 0, 0.06, '#8a1020', blinkAt(t, 9), lw, look); return null; };
  H.bandage = function (x, look, lw) { P.ball(x, 0, 0, 0.19, 0.2, '#e8e0d0', { lo: -0.2, line: '#8a8070', lw: lw }); x.strokeStyle = 'rgba(120,100,80,0.6)'; x.lineWidth = lw; for (var i = 0; i < 7; i++) { x.beginPath(); x.moveTo(-0.19, -0.16 + i * 0.05); x.quadraticCurveTo(0, -0.13 + i * 0.05 + (i % 2 ? 0.02 : -0.02), 0.19, -0.15 + i * 0.05); x.stroke(); } E(x, 0.07, -0.01, 0.04, 0.03, '#1a0e0e'); eyeball(x, 0.07, -0.01, 0.025, '#3a1010', 1, lw * 0.6); E(x, -0.05, 0.08, 0.04, 0.025, 'rgba(150,30,30,0.35)'); return null; };
  H.noh = function (x, look, lw) { P.ball(x, 0, 0, 0.18, 0.22, '#f8f6ee', { hi: 0.06, line: '#9a948a', lw: lw }); [-1, 1].forEach(function (k) { path(x, [[k * 0.11, -0.01], [k * 0.07, -0.03, k * 0.03, -0.005], [k * 0.07, 0.0, k * 0.11, -0.01]], '#050404'); E(x, k * 0.08, -0.12, 0.03, 0.012, '#1a1a1a', null, 0, k * 0.2); }); path(x, [[-0.12, 0.07], [0, 0.17, 0.12, 0.07], [0, 0.11, -0.12, 0.07]], '#2a0404'); path(x, [[-0.04, 0.1], [0, 0.12, 0.04, 0.1]], null, '#c01020', lw * 2, false); return null; };
  H.void = function (x, look, lw) { var t = S._t; E(x, 0, 0, 0.19, 0.2, '#020108', 'rgba(140,120,255,0.5)', lw); x.save(); x.beginPath(); x.ellipse(0, 0, 0.19, 0.2, 0, 0, TAU); x.clip(); var r = rng('void' + (look.seed || 0)); for (var i = 0; i < 26; i++) { var px = (r.next() - 0.5) * 0.4, py = U.mod(r.next() * 0.4 + t * 0.03, 0.4) - 0.2; x.fillStyle = r.next() < 0.3 ? hue(t, i * 40, 80, 75) : '#f0f0ff'; x.fillRect(px, py, 0.012, 0.012); } var g = x.createRadialGradient(0.05, 0.04, 0, 0.05, 0.04, 0.12); g.addColorStop(0, 'rgba(120,60,200,0.45)'); g.addColorStop(1, 'rgba(120,60,200,0)'); x.fillStyle = g; x.fillRect(-0.2, -0.2, 0.4, 0.4); x.restore(); E(x, -0.065, -0.01, 0.012, 0.012, '#fff'); E(x, 0.065, -0.01, 0.012, 0.012, '#fff'); return null; };
  H.prism = function (x, look, lw) { var t = S._t; for (var i = 0; i < 6; i++) { var a0 = i / 6 * TAU + t * 0.6, a1 = a0 + TAU / 6; path(x, [[0, 0], [Math.cos(a0) * 0.22, Math.sin(a0) * 0.22], [Math.cos(a1) * 0.22, Math.sin(a1) * 0.22]], hue(t, i * 60), 'rgba(255,255,255,0.6)', lw * 0.8); } E(x, 0, 0, 0.08, 0.08, '#fff'); path(x, [[-0.06, 0], [0, -0.03, 0.06, 0], [0, 0.03, -0.06, 0]], '#101018'); E(x, 0, 0, 0.012, 0.025, hue(t, 180)); return null; };
  H.moth = function (x, look, lw) { var t = S._t, c = hc(look, 3, '#c8b8a0'), f = Math.sin(t * 2) * 0.1; [-1, 1].forEach(function (k) { x.save(); x.scale(k, 1); x.rotate(f); E(x, 0.2, -0.08, 0.16, 0.11, c, P.sh(c, -0.4), lw, -0.3); E(x, 0.22, -0.08, 0.05, 0.05, '#2a1a10'); E(x, 0.22, -0.08, 0.025, 0.025, '#e8d070'); x.restore(); }); P.ball(x, 0, 0, 0.13, 0.17, '#5a4a38', { line: '#2a1a10', lw: lw }); E(x, -0.05, -0.02, 0.035, 0.035, '#100808'); E(x, 0.05, -0.02, 0.035, 0.035, '#100808'); return null; };

  /* ================= MEMBRES, AURAS, AJOUTS ================= */
  S.HORROR = {
    behind: function (x, look, G, t, lw) {
      var hy = G.headY;
      if (look.aura) {
        // en pixel art, les dégradés transparents disparaissent : des traits pleins, en couronne
        var cy = (G.bodyTop + G.headY) / 2, R = 0.5 + (G.hgt - 1) * 0.3, ra = rng('aura' + (look.seed || 0));
        if (look.aura === 'psy') { for (var i = 0; i < 4; i++) { x.strokeStyle = hue(t, i * 70); x.lineWidth = lw * 2.2; x.setLineDash && x.setLineDash([0.08, 0.05]); x.lineDashOffset = t * (i % 2 ? 0.2 : -0.2); x.beginPath(); x.ellipse(0, cy, R * (0.55 + i * 0.16), R * (0.75 + i * 0.16), 0, 0, TAU); x.stroke(); } x.setLineDash && x.setLineDash([]); }
        else {
          var colA = look.aura === 'red' ? '#8a0a14' : look.aura === 'white' ? '#e8e8f4' : '#040306';
          x.strokeStyle = colA; for (var k = 0; k < 9; k++) { var a = -Math.PI * (0.05 + ra.next() * 0.9), l = R * (0.6 + ra.next() * 0.6), wv = Math.sin(t * 1.5 + k) * 0.05; x.lineWidth = lw * (3.2 - k * 0.2); x.beginPath(); x.moveTo(Math.cos(a) * 0.12, cy + Math.sin(a) * 0.1); x.quadraticCurveTo(Math.cos(a) * l * 0.6 + wv, cy + Math.sin(a) * l * 0.6, Math.cos(a) * l + wv, cy + Math.sin(a) * l); x.stroke(); }
        }
      }
      if (look.eyesHalo) { var n = look.eyesHalo === true ? 9 : look.eyesHalo; for (var j = 0; j < n; j++) { var b = j / n * TAU + t * 0.25; eyeball(x, Math.cos(b) * 0.32, hy + Math.sin(b) * 0.3, 0.035, look.eyeColor || '#6a1020', blinkAt(t, j), lw * 0.6, look); } }
      if (look.antlers) { var ac = look.antlers === true ? '#2a1a12' : look.antlers; [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.1, hy - 0.15); x.scale(k, 1); P.stroke(x, [[0, 0], [0.1, -0.2], [0.22, -0.32]], ac, lw * 3); P.stroke(x, [[0.1, -0.2], [0.05, -0.38]], ac, lw * 2.5); P.stroke(x, [[0.17, -0.27], [0.3, -0.25]], ac, lw * 2); P.stroke(x, [[0.04, -0.3], [-0.02, -0.42]], ac, lw * 2); if (look.antlerEyes) eyeball(x, 0.22, -0.33, 0.025, '#8a1020', blinkAt(t, k + 2), lw * 0.5); x.restore(); }); }
      if (look.strings) { x.strokeStyle = 'rgba(220,220,230,0.7)'; x.lineWidth = lw * 0.7; [[-0.2, G.bodyTop + 0.4], [0.2, G.bodyTop + 0.4], [0, hy - 0.18]].forEach(function (q) { x.beginPath(); x.moveTo(q[0], q[1]); x.lineTo(q[0] * 0.6, hy - 1.4); x.stroke(); }); }
    },
    manyArms: function (x, look, G, t, lw, ac) {
      var n = look.manyArms === true ? 2 : look.manyArms, L = (G.bodyBot - G.bodyTop) * 0.9;
      for (var i = 0; i < n; i++) [-1, 1].forEach(function (k) {
        x.save(); x.translate(k * 0.14, G.bodyTop + 0.06 + i * 0.05); x.rotate(k * (0.7 + i * 0.45) + Math.sin(t * 2 + i + k) * 0.12);
        P.rr(x, -0.03, 0, 0.06, L, 0.03); x.fillStyle = P.sh(ac, -0.1 - i * 0.08); x.fill(); x.strokeStyle = P.sh(ac, -0.5); x.lineWidth = lw; x.stroke();
        S.HORROR.claws(x, 0, L, hc(look, 2, '#e8d0c0'), lw, t, k); x.restore();
      });
    },
    claws: function (x, x0, y, skin, lw, t, k) { E(x, x0, y, 0.03, 0.03, skin); for (var i = -2; i <= 2; i++) { var a = Math.PI / 2 + i * 0.28 + Math.sin(t * 3 + i) * 0.06; line(x, x0, y, x0 + Math.cos(a) * 0.1, y + Math.sin(a) * 0.12, P.sh(skin, -0.15), lw * 1.4); } },
    neck: function (x, look, G, t, lw) {
      if (!look.neck || look.hunch) return;
      var s = hc(look, 2, '#e8d0c0'), top = G.headY + 0.12, bot = G.bodyTop + 0.02, sw = Math.sin(t * 1.2) * 0.02;
      x.beginPath(); x.moveTo(-0.035, bot); x.quadraticCurveTo(-0.035 + sw, (top + bot) / 2, -0.03, top); x.lineTo(0.03, top); x.quadraticCurveTo(0.035 + sw, (top + bot) / 2, 0.035, bot); x.closePath();
      x.fillStyle = s; x.fill(); x.strokeStyle = P.sh(s, -0.5); x.lineWidth = lw; x.stroke();
      x.strokeStyle = P.rgba(P.sh(s, -0.35), 0.7); x.lineWidth = lw * 0.8; for (var y = bot - 0.06; y > top; y -= 0.07) { x.beginPath(); x.moveTo(-0.03 + sw * 0.5, y); x.lineTo(0.03 + sw * 0.5, y + 0.01); x.stroke(); }
    },
    head: function (x, look, G, t, lw) {
      if (look.veil) { var vc = look.veil === true ? '#0c0a10' : look.veil; path(x, [[-0.21, -0.12], [-0.22, -0.26, 0, -0.27], [0.22, -0.26, 0.21, -0.12], [0.24, 0.5], [0.12, 0.42], [0.04, 0.56], [-0.06, 0.44], [-0.14, 0.55], [-0.24, 0.46]], vc, P.sh(vc, -0.3), lw); if (look.veilEye) { E(x, 0.05, 0.03, 0.02, 0.012, '#f4f0e8'); E(x, 0.05, 0.03, 0.007, 0.007, '#000'); } }
      if (look.crack) { x.strokeStyle = 'rgba(20,10,10,0.8)'; x.lineWidth = lw; x.beginPath(); x.moveTo(0.02, -0.19); x.lineTo(0.06, -0.08); x.lineTo(0.01, 0.0); x.lineTo(0.08, 0.1); x.moveTo(0.06, -0.08); x.lineTo(0.14, -0.06); x.stroke(); }
      if (look.thirdEye) eyeball(x, 0, -0.1, 0.035, look.eyeColor || '#8a1020', blinkAt(t, 5), lw * 0.7, look);
      if (look.halo) { x.strokeStyle = look.halo === 'psy' ? hue(t, 0) : 'rgba(255,240,200,0.85)'; x.lineWidth = lw * 2.5; x.beginPath(); x.ellipse(0, -0.3, 0.17, 0.045, 0, 0, TAU); x.stroke(); }
    },
    after: function (x, look, G, t, lw) {
      if (look.drip) { var dc = look.drip === true ? '#120608' : look.drip; for (var i = -2; i <= 2; i++) { var l = 0.06 + 0.05 * U.mod(t * 0.5 + i * 0.37, 1); path(x, [[i * 0.06 - 0.018, G.bodyBot - 0.02], [i * 0.06 + 0.018, G.bodyBot - 0.02], [i * 0.06 + 0.01, G.bodyBot + l], [i * 0.06, G.bodyBot + l + 0.025], [i * 0.06 - 0.01, G.bodyBot + l]], dc); } }
      if (look.ribs) { x.strokeStyle = 'rgba(240,230,210,0.6)'; x.lineWidth = lw * 1.2; for (var r = 0; r < 4; r++) { var yy = G.bodyTop + 0.08 + r * 0.06; x.beginPath(); x.moveTo(-0.12, yy + 0.03); x.quadraticCurveTo(0, yy - 0.02, 0.12, yy + 0.03); x.stroke(); } }
    }
  };

  /* ================= CRÉATURES ================= */
  var CX = S.CREATURES_X = {};
  CX.tallman = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 0, '#141418'), sk = hc(look, 2, '#e8e4dc'), sw = Math.sin(ph * TAU) * (mv ? 1 : 0), H0 = -2.5;
    [-1, 1].forEach(function (k) { var up = Math.max(0, sw * k) * 0.06; P.rr(x, k * 0.05 - 0.02, -1.1, 0.04, 1.08 - up, 0.02); x.fillStyle = c; x.fill(); });
    path(x, [[-0.1, -2.15], [0.1, -2.15], [0.12, -1.05], [-0.12, -1.05]], c, '#000', lw);
    [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.11, -2.1); x.rotate(k * 0.05 + Math.sin(t * 1.3 + k) * 0.03); P.rr(x, -0.022, 0, 0.044, 1.75, 0.02); x.fillStyle = c; x.fill(); S.HORROR.claws(x, 0, 1.75, sk, lw, t, k); x.restore(); });
    P.stroke(x, [[0, -2.15], [0, -2.32]], sk, lw * 3);
    P.ball(x, 0, -2.42, 0.1, 0.13, sk, { line: '#555', lw: lw });
    if (look.eyes !== 'none') { E(x, -0.035, -2.43, 0.012, 0.016, '#000'); E(x, 0.035, -2.43, 0.012, 0.016, '#000'); }
    if (look.hat) { P.rr(x, -0.09, -2.72, 0.18, 0.2, 0.01); x.fillStyle = '#0a0a0c'; x.fill(); P.rr(x, -0.15, -2.54, 0.3, 0.03, 0.01); x.fill(); }
    void H0;
  };
  CX.crawler = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 2, '#d8ccc0'), d = hc(look, 0, '#2a2420'), sw = Math.sin(ph * TAU) * (mv ? 1 : 0);
    [[-0.32, 1], [-0.18, -1], [0.18, 1], [0.32, -1]].forEach(function (q) { var a = sw * 0.3 * q[1]; x.save(); x.translate(q[0] * 0.7, -0.32); x.rotate(a + (q[0] < 0 ? 0.5 : -0.5)); P.rr(x, -0.02, 0, 0.04, 0.38, 0.02); x.fillStyle = c; x.fill(); x.strokeStyle = P.sh(c, -0.5); x.lineWidth = lw; x.stroke(); x.restore(); });
    P.ball(x, 0, -0.36, 0.3, 0.1, d, { line: '#000', lw: lw });
    x.save(); x.translate(0.26, -0.3 + Math.sin(t * 2) * 0.01); x.rotate(0.3 + Math.sin(t * 1.5) * 0.1); P.ball(x, 0, 0, 0.12, 0.13, c, { line: P.sh(c, -0.5), lw: lw });
    S.EYES_X.stare(x, { eyes: [0, -0.02], w: 0.13 }, look, lw * 0.7, t); S.MOUTH_X.gape(x, { eyes: [0, -0.06] }, lw * 0.6, t); x.restore();
    if (look.hair !== false) { x.fillStyle = '#0a0808'; x.beginPath(); x.moveTo(0.18, -0.4); x.quadraticCurveTo(0.3, -0.48, 0.4, -0.32); x.lineTo(0.36, -0.1); x.lineTo(0.3, -0.2); x.lineTo(0.24, -0.08); x.closePath(); x.fill(); }
  };
  CX.faces = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 2, '#e0c8b0'), n = look.n || 4, kinds = ['void', 'stare', 'blank', 'red', 'bleed'], mk = ['teeth', 'gape', 'whisper', 'stitchwide', 'ear2ear'];
    for (var i = 0; i < n; i++) { var y = -0.2 - i * 0.3, sx = Math.sin(t * 1.2 + i * 1.7) * 0.03; x.save(); x.translate(sx, y); x.rotate(Math.sin(t + i) * 0.08); P.ball(x, 0, 0, 0.17, 0.16, P.sh(c, -i * 0.05), { lo: -0.25, line: P.sh(c, -0.55), lw: lw }); S.EYES_X[kinds[(i + (look.seed || 0)) % kinds.length]](x, { eyes: [0, -0.02], w: 0.16 }, look, lw, t + i); S.MOUTH_X[mk[(i + (look.seed || 0)) % mk.length]](x, { eyes: [0, -0.04] }, lw, t + i); x.restore(); }
  };
  CX.handmass = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 2, '#d8c4b4'), r = rng('hands' + (look.seed || 0));
    P.ball(x, 0, -0.1, 0.36, 0.13, P.sh(c, -0.25), { line: P.sh(c, -0.55), lw: lw });
    for (var i = 0; i < 9; i++) { var bx = (r.next() - 0.5) * 0.6, a = -Math.PI / 2 + (r.next() - 0.5) * 1.1 + Math.sin(t * 2 + i) * 0.15, L = 0.35 + r.next() * 0.45; x.save(); x.translate(bx, -0.12); x.rotate(a + Math.PI / 2); P.rr(x, -0.028, -L, 0.056, L, 0.028); x.fillStyle = P.sh(c, (r.next() - 0.5) * 0.15); x.fill(); x.strokeStyle = P.sh(c, -0.5); x.lineWidth = lw; x.stroke(); x.scale(1, -1); S.HORROR.claws(x, 0, L, c, lw * 0.8, t, 1); x.restore(); }
  };
  CX.eyecluster = function (x, look, ph, mv, t, lw) {
    var r = rng('cluster' + (look.seed || 0)), fy = -0.7 + Math.sin(t * 1.5) * 0.06;
    for (var i = 0; i < 13; i++) { var a = r.next() * TAU, d = Math.sqrt(r.next()) * 0.3, rr = 0.04 + r.next() * 0.07; var px = Math.cos(a) * d, py = fy + Math.sin(a) * d * 0.9; E(x, px, py, rr * 1.15, rr * 1.15, '#3a0a14'); eyeball(x, px, py, rr, look.eyeColor || (r.next() < 0.3 ? '#2a6a3a' : '#6a1a2a'), blinkAt(t, i), lw * 0.7, { gaze: Math.sin(t + i) }); }
    for (var j = 0; j < 4; j++) { var ta = j * 0.6 - 0.9; x.strokeStyle = '#3a0a14'; x.lineWidth = lw * 2; x.beginPath(); x.moveTo(Math.sin(ta) * 0.2, fy + 0.25); x.quadraticCurveTo(Math.sin(ta + t) * 0.25, fy + 0.45, Math.sin(ta) * 0.3, fy + 0.62); x.stroke(); }
  };
  CX.mouthbeast = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 0, '#6a2a3a'), o = 0.13 + 0.05 * Math.abs(Math.sin(t * 1.3)), b = mv ? Math.abs(Math.sin(ph * TAU)) * 0.04 : 0;
    x.translate(0, -b); P.ball(x, 0, -0.35, 0.36, 0.32, c, { lo: -0.3, line: P.sh(c, -0.5), lw: lw });
    E(x, 0, -0.32, 0.27, o, '#140206', '#2a0408', lw); teethRow(x, -0.25, 0.25, -0.32 - o + 0.015, 0.07, 11); x.save(); x.translate(0, -0.32 + o - 0.015); x.scale(1, -1); teethRow(x, -0.23, 0.23, 0, 0.06, 10); x.restore();
    E(x, -0.12, -0.6, 0.02, 0.02, '#ffd040'); E(x, 0.14, -0.62, 0.014, 0.014, '#ffd040');
  };
  CX.puppet = function (x, look, ph, mv, t, lw) {
    var sw = Math.sin(t * 1.4) * 0.06, c = hc(look, 0, '#b07848'), sk = hc(look, 2, '#e8c8a0');
    x.strokeStyle = 'rgba(230,230,240,0.75)'; x.lineWidth = lw * 0.7; [[-0.18, -0.75], [0.18, -0.75], [0, -1.3], [-0.1, -0.2], [0.1, -0.2]].forEach(function (q) { x.beginPath(); x.moveTo(q[0] + sw, q[1]); x.lineTo(q[0] * 0.4 + sw * 2, -2.4); x.stroke(); });
    x.save(); x.translate(sw, -0.15); x.rotate(sw * 0.5);
    [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.06, -0.35); x.rotate(k * 0.15 + Math.sin(t * 2 + k) * 0.2); P.rr(x, -0.025, 0, 0.05, 0.32, 0.02); x.fillStyle = c; x.fill(); E(x, 0, 0.16, 0.025, 0.025, P.sh(c, -0.3)); x.restore(); });
    path(x, [[-0.14, -0.85], [0.14, -0.85], [0.16, -0.35], [-0.16, -0.35]], P.sh(c, 0.1), P.sh(c, -0.5), lw);
    [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.15, -0.8); x.rotate(k * (0.4 + Math.sin(t * 1.8 + k) * 0.25)); P.rr(x, -0.022, 0, 0.044, 0.36, 0.02); x.fillStyle = c; x.fill(); E(x, 0, 0.18, 0.022, 0.022, P.sh(c, -0.3)); x.restore(); });
    x.save(); x.translate(0, -1.04); x.rotate(0.45 + Math.sin(t) * 0.1); P.ball(x, 0, 0, 0.16, 0.17, sk, { line: P.sh(sk, -0.5), lw: lw }); line(x, -0.1, 0.06, -0.1, 0.16, '#3a2010', lw); line(x, 0.1, 0.06, 0.1, 0.16, '#3a2010', lw); E(x, -0.06, -0.02, 0.03, 0.03, '#fff'); E(x, -0.06, -0.02, 0.014, 0.014, '#000'); E(x, 0.06, -0.02, 0.03, 0.03, '#fff'); E(x, 0.07, -0.01, 0.014, 0.014, '#000'); path(x, [[-0.08, 0.06], [0.08, 0.06], [0.08, 0.09], [-0.08, 0.09]], '#2a0a0a'); x.restore();
    x.restore();
  };
  CX.kaleido = function (x, look, ph, mv, t, lw) {
    var cy = -0.75 + Math.sin(t * 1.2) * 0.05;
    for (var ring = 3; ring >= 0; ring--) { var n = 6 + ring * 2, R = 0.12 + ring * 0.1; for (var i = 0; i < n; i++) { var a = i / n * TAU + t * (ring % 2 ? 0.5 : -0.4); x.save(); x.translate(Math.cos(a) * R, cy + Math.sin(a) * R); x.rotate(a); path(x, [[0, -0.05], [0.04, 0], [0, 0.05], [-0.04, 0]], hue(t, ring * 70 + i * 20), 'rgba(255,255,255,0.5)', lw * 0.6); x.restore(); } }
    eyeball(x, 0, cy, 0.07, hue(t, 200, 80, 45), blinkAt(t, 3), lw, look);
  };
  CX.melter = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 0, '#8a7a9a'), sk = hc(look, 2, '#d8c0b0'), m = 0.5 + 0.5 * Math.sin(t * 0.8);
    E(x, 0, -0.03, 0.42, 0.08, P.sh(c, -0.2));
    path(x, [[-0.38, -0.02], [-0.25, -0.2], [-0.2, -0.75], [-0.16, -0.95], [0.16, -0.95], [0.2, -0.75], [0.25, -0.2], [0.38, -0.02]], c, P.sh(c, -0.5), lw);
    for (var i = -2; i <= 2; i++) path(x, [[i * 0.07 - 0.02, -0.6], [i * 0.07 + 0.02, -0.6], [i * 0.07 + 0.015, -0.3 + m * 0.1 * (i % 2 ? 1 : -1)], [i * 0.07, -0.26 + m * 0.1], [i * 0.07 - 0.015, -0.3]], P.sh(c, 0.12));
    x.save(); x.translate(0.02, -1.08 + m * 0.03); x.scale(1, 1 + m * 0.15); P.ball(x, 0, 0, 0.16, 0.17, sk, { line: P.sh(sk, -0.5), lw: lw }); path(x, [[-0.1, 0.02], [-0.06, 0.06 + m * 0.06], [-0.04, 0.02]], '#120808'); path(x, [[0.04, 0.0], [0.07, 0.08 + m * 0.05], [0.1, 0.0]], '#120808'); E(x, 0, 0.1 + m * 0.03, 0.03, 0.025 + m * 0.02, '#120808'); x.restore();
  };
  CX.smiler = function (x, look, ph, mv, t, lw) {
    var fy = -1.25 + Math.sin(t * 1.1) * 0.06, c = hc(look, 0, '#101014');
    path(x, [[-0.06, fy + 0.2], [0.06, fy + 0.2], [0.1, -0.02], [-0.1, -0.02]], 'rgba(10,10,14,0.85)');
    E(x, 0, fy, 0.28, 0.24, c, '#000', lw);
    path(x, [[-0.22, fy + 0.02], [0, fy + 0.2, 0.22, fy + 0.02], [0, fy + 0.1, -0.22, fy + 0.02]], '#f8f4ea'); for (var i = -7; i <= 7; i++) line(x, i * 0.028, fy + 0.04 + (1 - Math.abs(i) / 7) * 0.08, i * 0.028, fy + 0.1 + (1 - Math.abs(i) / 7) * 0.08 - 0.03, '#b8b0a0', lw * 0.6);
    E(x, -0.1, fy - 0.08, 0.035, 0.012, '#f8f4ea'); E(x, 0.1, fy - 0.08, 0.035, 0.012, '#f8f4ea');
  };
  CX.doubles = function (x, look, ph, mv, t, lw) {
    var c = hc(look, 0, '#2a2438');
    for (var i = 2; i >= 0; i--) { var ox = (i - 1) * 0.12 + Math.sin(t * 2 + i) * 0.03; x.globalAlpha = i === 1 ? 1 : 0.45; x.save(); x.translate(ox, 0); path(x, [[-0.16, 0], [-0.18, -0.85], [-0.1, -0.95], [-0.12, -1.2, 0, -1.25], [0.12, -1.2, 0.1, -0.95], [0.18, -0.85], [0.16, 0]], i === 1 ? c : hue(t, i * 120, 70, 45)); S.EYES_X.blank(x, { eyes: [0, -1.08], w: 0.1 }, look, lw); x.restore(); }
    x.globalAlpha = 1;
  };
  CX.longface = function (x, look, ph, mv, t, lw) {
    var g = hc(look, 0, 'rgba(232,228,240,0.85)'), fl = Math.sin(t * 1.6) * 0.04;
    path(x, [[-0.16, -0.1 + fl], [-0.18, -1.5 + fl, 0, -1.6 + fl], [0.18, -1.5 + fl, 0.16, -0.1 + fl], [0.1, -0.02 + fl], [0.04, -0.12 + fl], [-0.03, -0.02 + fl], [-0.1, -0.12 + fl]], g);
    S.EYES_X.void(x, { eyes: [0, -1.2 + fl], w: 0.12 }, look, lw); S.MOUTH_X.gape(x, { eyes: [0, -1.05 + fl] }, lw, t);
  };

  /* ================= EFFETS : accessoires et formes ================= */
  var ACC = S.ACC, BACK = S.ACC_BACK, ANIM = S.ACC_ANIM, FORMS = S.FORMS, FA = S.FORM_ANIM = S.FORM_ANIM || {};
  function hand(vw) { return vw.v === 'side' ? [0.02, -0.46] : vw.v === 'back' ? [-0.19, -0.46] : [0.19, -0.46]; }
  function inHand(draw) { return function (x, vw, ph, w, t, lw) { var h = hand(vw); x.save(); x.translate(h[0], h[1]); draw(x, lw, t, vw); x.restore(); }; }
  function face(vw) { return vw.v === 'side' ? 0.12 : vw.t * 0.075; }
  var FY = -1.04; // hauteur des yeux de la protagoniste

  /* --- terrifiants --- */
  ACC.grin = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(face(vw), bob || 0); var sd = vw.v === 'side'; [-1, 1].forEach(function (k) { if (sd && k < 0) return; var ex = sd ? 0.01 : k * 0.085; E(x, ex, FY - 0.005, 0.05, 0.06, '#000'); E(x, ex, FY, 0.012, 0.012, '#fff'); }); var w0 = sd ? 0.11 : 0.2; path(x, [[-w0, -0.99], [0, -0.82, w0, -0.99], [0, -0.93, -w0, -0.99]], '#050102'); path(x, [[-w0 * 0.85, -0.975], [0, -0.92, w0 * 0.85, -0.975], [0, -0.945, -w0 * 0.85, -0.975]], '#f4eee0'); P.stroke(x, [[-w0, -0.99], [-w0 - 0.03, -1.02]], '#a01020', lw * 2); P.stroke(x, [[w0, -0.99], [w0 + 0.03, -1.02]], '#a01020', lw * 2); x.restore(); };
  ACC.censorbar = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; var j = Math.round(Math.sin(t * 7) * 2) * 0.006; x.save(); x.translate(face(vw) + j, bob || 0); x.fillStyle = '#050505'; x.fillRect(vw.v === 'side' ? -0.04 : -0.2, FY - 0.045, vw.v === 'side' ? 0.24 : 0.4, 0.085); x.fillStyle = 'rgba(255,255,255,0.15)'; x.fillRect(vw.v === 'side' ? -0.04 : -0.2, FY - 0.045, vw.v === 'side' ? 0.24 : 0.4, 0.008); x.restore(); };
  ACC.whiteout = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(face(vw), bob || 0); var sd = vw.v === 'side'; path(x, sd ? [[0.0, -1.15], [0.2, -1.14], [0.22, -0.92], [0.12, -0.88], [0.0, -0.92]] : [[-0.19, -1.13], [0.19, -1.13], [0.2, -0.95], [0.1, -0.89], [-0.1, -0.89], [-0.2, -0.95]], '#fbfbf6', '#c8c8c0', lw); for (var i = 0; i < 3; i++) { var dx = (sd ? 0.05 : -0.12) + i * (sd ? 0.05 : 0.1), l = 0.05 + 0.06 * U.mod(t * 0.4 + i * 0.3, 1); path(x, [[dx - 0.015, -0.9], [dx + 0.015, -0.9], [dx + 0.01, -0.9 + l], [dx, -0.88 + l], [dx - 0.01, -0.9 + l]], '#fbfbf6'); } x.restore(); };
  ACC.strings = function (x, vw, ph, w, t, lw, bob) { var sw = Math.sin(t * 1.4) * 0.05; x.strokeStyle = 'rgba(235,235,245,0.8)'; x.lineWidth = lw * 0.8; [[-0.19, -0.46], [0.19, -0.46], [0, -1.33], [-0.07, -0.05], [0.07, -0.05]].forEach(function (q) { x.beginPath(); x.moveTo(q[0], q[1] + (bob || 0)); x.lineTo(q[0] * 0.5 + sw, -2.1); x.stroke(); }); P.rr(x, -0.26 + sw, -2.16, 0.52, 0.05, 0.02); x.fillStyle = '#6a4a2a'; x.fill(); P.rr(x, -0.03 + sw, -2.3, 0.06, 0.25, 0.02); x.fill(); };
  ACC.puppethand = function (x, vw, ph, w, t, lw, bob) { var sw = Math.sin(t * 1.2) * 0.05, hy = -2.25 + Math.sin(t * 0.9) * 0.03; x.strokeStyle = 'rgba(235,235,245,0.75)'; x.lineWidth = lw * 0.8; [[-0.19, -0.46], [0.19, -0.46], [0, -1.33]].forEach(function (q, i) { x.beginPath(); x.moveTo(q[0], q[1] + (bob || 0)); x.lineTo(-0.12 + i * 0.12 + sw, hy + 0.08); x.stroke(); }); x.save(); x.translate(sw, hy); P.ball(x, 0, 0, 0.2, 0.12, '#e8ddd0', { line: '#7a6a5a', lw: lw }); for (var i = 0; i < 4; i++) { x.save(); x.translate(-0.15 + i * 0.1, 0.06); x.rotate(Math.sin(t * 2 + i) * 0.15); P.rr(x, -0.025, 0, 0.05, 0.14, 0.025); x.fillStyle = '#e8ddd0'; x.fill(); x.strokeStyle = '#7a6a5a'; x.lineWidth = lw; x.stroke(); x.restore(); } x.restore(); };
  BACK.shadowhands = function (x, vw, ph, w, t, lw) { var tw = Math.sin(t * 3) * 0.04; [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.3, -1.25); x.rotate(k * (0.4 + tw)); P.rr(x, -0.03, 0, 0.06, 0.5, 0.03); x.fillStyle = '#050407'; x.fill(); x.restore(); }); };
  ACC.shadowhands = function (x, vw, ph, w, t, lw, bob) { var tw = Math.sin(t * 3) * 0.02; x.save(); x.translate(0, bob || 0); [-1, 1].forEach(function (k) { x.save(); x.translate(k * (0.19 + tw), -0.8); x.scale(k, 1); for (var i = 0; i < 4; i++) { P.stroke(x, [[0, 0], [-0.03 - i * 0.025, 0.08 + i * 0.01], [-0.05 - i * 0.03, 0.17 + i * 0.015]], '#050407', lw * 2.6); } x.restore(); }); x.restore(); };
  BACK.eyecloak = function (x, vw, ph, w, t, lw) { path(x, [[-0.22, -0.88], [0.22, -0.88], [0.4, -0.05], [0, 0.0], [-0.4, -0.05]], '#18121e', '#000', lw); if (vw.v === 'back') { for (var i = 0; i < 9; i++) eyeball(x, -0.22 + (i % 3) * 0.22, -0.7 + Math.floor(i / 3) * 0.22, 0.06, '#9a1020', blinkAt(t, i), lw * 0.6); } };
  ACC.eyecloak = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(0, bob || 0); [[-0.32, -0.55], [0.32, -0.5], [-0.35, -0.22], [0.35, -0.2], [-0.3, -0.75], [0.3, -0.72]].forEach(function (q, i) { if (vw.v === 'side' && q[0] > 0) return; eyeball(x, q[0], q[1], 0.055, '#9a1020', blinkAt(t, i + 3), lw * 0.6); }); x.restore(); };
  ACC.tvhead = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); P.rr(x, -0.27, -1.36, 0.54, 0.44, 0.05); x.fillStyle = '#3a3a40'; x.fill(); x.strokeStyle = '#0a0a0a'; x.lineWidth = lw; x.stroke(); if (vw.v !== 'back') { var r = rng(Math.floor(t * 6) * 131); for (var yy = -1.3; yy < -1.0; yy += 0.025) for (var xx = -0.22; xx < 0.17; xx += 0.025) { var v = r.int(80, 235); x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(xx, yy, 0.025, 0.025); } if (U.mod(t, 2) < 0.5) { E(x, -0.08, -1.18, 0.03, 0.04, 'rgba(0,0,0,0.75)'); E(x, 0.04, -1.18, 0.03, 0.04, 'rgba(0,0,0,0.75)'); E(x, -0.02, -1.06, 0.06, 0.02, 'rgba(0,0,0,0.6)'); } E(x, 0.22, -1.25, 0.02, 0.02, '#888'); E(x, 0.22, -1.15, 0.02, 0.02, '#888'); } line(x, -0.1, -1.36, -0.18, -1.52, '#999', lw); line(x, 0.1, -1.36, 0.2, -1.5, '#999', lw); x.restore(); };
  BACK.windkey = function (x, vw, ph, w, t, lw) { var a = t * 1.5, sd = vw.v === 'side'; x.save(); x.translate(sd ? -0.24 : 0, sd ? -0.62 : -0.86); P.stroke(x, [[0, 0], [sd ? -0.1 : 0, sd ? 0 : -0.08]], '#a08030', lw * 5); x.translate(sd ? -0.12 : 0, sd ? 0 : -0.12); x.rotate(sd ? Math.PI / 2 : 0); x.scale(Math.abs(Math.cos(a)) * 0.75 + 0.25, 1); [-1, 1].forEach(function (k) { E(x, k * 0.17, -0.02, 0.15, 0.11, '#d8b040', '#5a4008', lw * 1.5); E(x, k * 0.17, -0.02, 0.06, 0.045, '#5a4008'); }); x.restore(); };
  ANIM.windkey = 1;
  ACC.electrodes = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); [-1, 1].forEach(function (k) { if (vw.v === 'side' && k < 0) return; var px = vw.v === 'side' ? 0.05 : k * 0.21; E(x, px, -1.1, 0.025, 0.025, '#d8d8d8', '#555', lw); x.strokeStyle = k < 0 ? '#c03030' : '#3050c0'; x.lineWidth = lw * 1.5; x.beginPath(); x.moveTo(px, -1.1); x.quadraticCurveTo(px + k * 0.25, -0.6, px + k * 0.2, -0.02); x.stroke(); if (U.mod(t * 2 + k, 1.3) < 0.25) { P.stroke(x, [[px, -1.12], [px + k * 0.06, -1.2], [px + k * 0.03, -1.24], [px + k * 0.09, -1.32]], '#b0e8ff', lw * 1.5); } }); x.restore(); };
  ACC.thirdeye = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(face(vw), (bob || 0) - 1.17); x.rotate(Math.PI / 2); var o = blinkAt(t, 2); E(x, 0, 0, 0.045, 0.028 * o + 0.002, '#fbf6ea', '#3a1010', lw); if (o > 0.5) { E(x, 0, 0, 0.016, 0.016, '#9a1020'); E(x, 0, 0, 0.007, 0.007, '#000'); } x.restore(); E(x, face(vw), -1.17 + (bob || 0), 0.06, 0.06, 'rgba(255,60,80,0.15)'); };
  ACC.blacktears = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(face(vw), bob || 0); var sd = vw.v === 'side'; [-1, 1].forEach(function (k, i) { if (sd && k < 0) return; var ex = sd ? 0.01 : k * 0.085, l = 0.22 + 0.12 * U.mod(t * 0.6 + i * 0.4, 1); E(x, ex, FY, 0.045, 0.055, '#000'); path(x, [[ex - 0.025, FY + 0.03], [ex + 0.025, FY + 0.03], [ex + 0.02, FY + 0.03 + l], [ex, FY + 0.07 + l], [ex - 0.02, FY + 0.03 + l]], '#000'); }); x.restore(); };
  ACC.longhair = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); var sw = Math.sin(t * 1.5) * 0.02; path(x, [[-0.25, -1.2], [-0.26, -1.36, 0, -1.37], [0.26, -1.36, 0.25, -1.2], [0.27 + sw, -0.35], [0.15, -0.42], [0.08 + sw, -0.28], [0, -0.4], [-0.08 + sw, -0.3], [-0.16, -0.42], [-0.27 + sw, -0.36]], '#0a080c', '#000', lw); if (vw.v !== 'back') { E(x, face(vw) + 0.06, -1.05, 0.022, 0.012, '#f2eee6'); E(x, face(vw) + 0.06, -1.05, 0.008, 0.008, '#000'); } x.restore(); };
  BACK.twin = function (x, vw, ph, w, t, lw) { var o = 0.18 + Math.sin(t * 1.3) * 0.04; x.save(); x.translate(-o, -0.06); x.globalAlpha = 0.45; var pale = { hair: '#3a3448', hairHi: '#4a4458', skin: '#d8dce8', skinSh: '#b8bccc', blush: '#d0d0e0', eye: '#000000', sweater: '#8890a8', sweaterSh: '#6a7088', sweaterHi: '#a8b0c8', skirt: '#3a3e58', sock: '#d0d0e0', shoe: '#2a2a3a', clip: '#8a8aa0' }; S._girlFrontBack(x, pale, vw.v === 'side' ? { v: 'front', t: 0, m: 1 } : vw, 0, 0, 0, false, lw, {}); x.restore(); };
  ACC.dollchain = function (x, vw, ph, w, t, lw) { var h = hand(vw); for (var i = 0; i < 5; i++) { var px = h[0] + (vw.v === 'back' ? -1 : 1) * (0.08 + i * 0.13), py = h[1] + 0.12 + Math.sin(t * 2 + i) * 0.02; x.save(); x.translate(px, py); x.rotate(Math.sin(t * 1.5 + i) * 0.15); E(x, 0, -0.14, 0.04, 0.04, '#f4f0e4', '#a09a88', lw * 0.6); path(x, [[-0.035, -0.1], [0.035, -0.1], [0.06, 0.02], [-0.06, 0.02]], '#f4f0e4', '#a09a88', lw * 0.6); P.stroke(x, [[-0.06, -0.07], [0.06, -0.07]], '#f4f0e4', lw * 3); if (i === 4) { E(x, -0.014, -0.145, 0.008, 0.008, '#000'); E(x, 0.014, -0.145, 0.008, 0.008, '#000'); } x.restore(); } };
  ANIM.dollchain = 1;
  ACC.eggeye = inHand(function (x, lw, t) { P.ball(x, 0, -0.03, 0.07, 0.09, '#f4ecd8', { line: '#a09070', lw: lw }); P.stroke(x, [[-0.06, -0.05], [-0.02, -0.02], [0.01, -0.06], [0.05, -0.02]], '#3a2a1a', lw); var o = blinkAt(t, 1); if (o > 0.5) { E(x, -0.005, -0.03, 0.02, 0.012, '#fff'); E(x, -0.005, -0.03, 0.008, 0.008, '#8a1020'); } });
  ACC.facade = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(face(vw) * 1.3, bob || 0); P.rr(x, -0.21, -1.26, 0.42, 0.38, 0.02); x.fillStyle = '#d8c8a8'; x.fill(); x.strokeStyle = '#6a5a3a'; x.lineWidth = lw; x.stroke(); E(x, 0, -1.07, 0.15, 0.16, '#f4dcc4'); E(x, -0.055, -1.1, 0.025, 0.012, '#111'); E(x, 0.055, -1.1, 0.025, 0.012, '#111'); path(x, [[-0.08, -1.02], [0, -0.96, 0.08, -1.02]], null, '#c02030', lw * 2.5, false); P.stroke(x, [[0, -0.88], [0, -0.6]], '#6a5a3a', lw * 3); x.restore(); };
  /* --- psychédéliques --- */
  BACK.kaleido = function (x, vw, ph, w, t, lw) { for (var ring = 2; ring >= 0; ring--) { var n = 8 + ring * 4, R = 0.32 + ring * 0.14; for (var i = 0; i < n; i++) { var a = i / n * TAU + t * (ring % 2 ? 0.6 : -0.5); x.save(); x.translate(Math.cos(a) * R, -1.0 + Math.sin(a) * R); x.rotate(a); path(x, [[0, -0.05], [0.035, 0], [0, 0.05], [-0.035, 0]], P.rgba(hue(t, ring * 80 + i * 30), 0.85)); x.restore(); } } };
  ACC.prism = function (x, vw, ph, w, t, lw) { for (var i = 0; i < 3; i++) { var a = t * 2 + i * 2.1; x.strokeStyle = hue(t, i * 120); x.lineWidth = lw * 2.2; x.setLineDash && x.setLineDash([0.07, 0.05]); x.lineDashOffset = t * 0.3 * (i % 2 ? 1 : -1); x.beginPath(); x.ellipse(Math.cos(a) * 0.03, -0.7, 0.34 + i * 0.05, 0.76 + i * 0.05, 0, 0, TAU); x.stroke(); } x.setLineDash && x.setLineDash([]); };
  ACC.static = function (x, vw, ph, w, t, lw) { var r = rng(Math.floor(t * 6) * 71); x.globalCompositeOperation = 'source-atop'; for (var i = 0; i < 5; i++) { var y = -1.35 + r.next() * 1.3, v = r.int(120, 255); x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(-0.4, y, 0.8, 0.07 + r.next() * 0.08); for (var j = 0; j < 8; j++) { x.fillStyle = r.next() < 0.5 ? '#111' : '#fff'; x.fillRect(-0.3 + r.next() * 0.6, y + r.next() * 0.1, 0.05, 0.04); } } x.globalCompositeOperation = 'source-over'; };
  ACC.orbits = function (x, vw, ph, w, t, lw) { for (var i = 0; i < 4; i++) { var a = t * (0.8 + i * 0.3) + i * 1.6, R = 0.3 + i * 0.06, px = Math.cos(a) * R, py = -0.75 + Math.sin(a) * R * 0.35; if (Math.sin(a) < 0) { x.globalAlpha = 0.6; } P.ball(x, px, py, 0.035 + i * 0.008, 0.035 + i * 0.008, ['#a8a0b8', '#c8b090', hue(t, i * 90, 60, 60), '#8090a0'][i], { line: '#333', lw: lw * 0.6 }); x.globalAlpha = 1; } };
  ACC.soundrings = function (x, vw, ph, w, t, lw) { if (vw.v === 'back') return; for (var i = 0; i < 3; i++) { var k = U.mod(t * 0.7 + i / 3, 1), R0 = 0.24 + k * 0.4; x.strokeStyle = hue(t, i * 100, 85, 65); x.lineWidth = lw * 2.4; [-1, 1].forEach(function (s0) { x.beginPath(); x.ellipse(face(vw), -0.95, R0, R0 * 0.8, 0, s0 < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, s0 < 0 ? Math.PI * 1.25 : Math.PI * 0.25); x.stroke(); }); } };
  ACC.fog = function (x, vw, ph, w, t, lw) { for (var i = 0; i < 7; i++) { var a = t * 0.5 + i * 0.9; E(x, Math.cos(a) * 0.3, -0.05 + Math.sin(a * 1.3) * 0.04, 0.09 + 0.03 * Math.sin(t + i), 0.035, i % 2 ? '#c4c4d0' : '#a8a8b8'); } for (var j = 0; j < 3; j++) { var b = t * 0.4 + j * 2.1; E(x, Math.cos(b) * 0.25, -0.5 + Math.sin(b) * 0.3, 0.05, 0.02, '#b8b8c8'); } };
  ACC.cranes = function (x, vw, ph, w, t, lw) { for (var i = 0; i < 6; i++) { var a = t * 0.9 + i * TAU / 6, px = Math.cos(a) * 0.42, py = -1.0 + Math.sin(a) * 0.18 + Math.sin(t * 3 + i) * 0.03; x.save(); x.translate(px, py); x.scale(Math.cos(a) < 0 ? -0.6 : 0.6, 0.6); path(x, [[-0.12, 0], [0, -0.04], [0.14, -0.1], [0.05, 0.01], [-0.02, 0.05]], i % 2 ? '#f8f8f4' : hue(t, i * 50, 70, 80), '#a0a098', lw); x.restore(); } };
  ACC.filmstrip = function (x, vw, ph, w, t, lw) { for (var j = 0; j < 8; j++) { var a2 = j / 8 * TAU + t * 0.8, px = Math.cos(a2) * 0.36, py = -0.75 + Math.sin(a2) * 0.16; if (Math.sin(a2) < -0.1) continue; P.rr(x, px - 0.075, py - 0.06, 0.15, 0.12, 0.01); x.fillStyle = '#16120e'; x.fill(); x.fillStyle = ['#e8d8a8', '#a8c0d8', '#d8a8a8'][j % 3]; x.fillRect(px - 0.05, py - 0.035, 0.1, 0.07); } };
  [['grin', 0], ['censorbar', 1], ['whiteout', 1], ['strings', 1], ['puppethand', 1], ['shadowhands', 1], ['eyecloak', 1], ['tvhead', 1], ['electrodes', 1], ['thirdeye', 1], ['blacktears', 1], ['longhair', 1], ['twin', 1], ['eggeye', 1], ['kaleido', 1], ['prism', 1], ['static', 1], ['orbits', 1], ['soundrings', 1], ['fog', 1], ['cranes', 1], ['filmstrip', 1]].forEach(function (q) { if (q[1]) ANIM[q[0]] = 1; });
  ACC.twin = function () { };
  ACC.windkey = function () { };
  ACC.kaleido = function () { };
  /* formes */
  FORMS.reversed = function (x, vw, ph, walk, t, pal, lw) { var sw = Math.sin(ph * TAU) * walk, rv = vw.v === 'front' ? { v: 'back', t: -vw.t, m: vw.m } : vw.v === 'back' ? { v: 'front', t: -vw.t, m: vw.m } : vw; if (rv.v === 'side') { if (rv.m < 0) x.scale(-1, 1); x.scale(-1, 1); S._girlSide(x, pal, -sw, 0, walk, false, lw, {}); } else S._girlFrontBack(x, pal, rv, sw, 0, walk, U.mod(t, 3.7) < 0.12, lw, {}); };
  FORMS.longneck = function (x, vw, ph, walk, t, pal, lw) {
    var sw = Math.sin(ph * TAU) * walk, L = 0.55 + Math.sin(t * 1.4) * 0.04, back = vw.v === 'back';
    if (vw.m < 0) x.scale(-1, 1);
    // le corps sans la tête : on dessine la protagoniste puis on efface sa tête, on remonte la tête au bout du cou
    var tmp = P.mk(256, 256), q = tmp.x; q.translate(128, 200); q.scale(80, 80); var vw2 = vw.v === 'side' ? { v: 'front', t: 0.55, m: 1 } : vw;
    S._girlFrontBack(q, pal, vw2, sw, 0, walk, false, lw, {});
    x.save(); x.beginPath(); x.rect(-1, -0.86, 2, 1); x.clip(); x.drawImage(tmp.c, -1.6, -2.5, 3.2, 3.2); x.restore();
    path(x, [[-0.035, -0.84], [-0.03 + Math.sin(t * 1.2) * 0.04, -0.84 - L * 0.5], [-0.03, -0.86 - L], [0.03, -0.86 - L], [0.03 + Math.sin(t * 1.2) * 0.04, -0.84 - L * 0.5], [0.035, -0.84]], pal.skinSh, P.sh(pal.skinSh, -0.5), lw);
    x.save(); x.translate(Math.sin(t * 1.2) * 0.02, -L); x.beginPath(); x.rect(-1, -2.5, 2, 1.62); x.clip(); x.drawImage(tmp.c, -1.6, -2.5, 3.2, 3.2); x.restore();
    void back;
  };
  FA.longneck = 1;
  FORMS.umbra = function (x, vw, ph, walk, t, pal, lw) {
    var dark = { hair: '#030306', hairHi: '#0a0a10', skin: '#050508', skinSh: '#040406', blush: '#050508', eye: '#050508', sweater: '#06060a', sweaterSh: '#040407', sweaterHi: '#0a0a10', skirt: '#040407', sock: '#06060a', shoe: '#030305', clip: '#06060a' };
    var sw = Math.sin(ph * TAU) * walk; if (vw.m < 0) x.scale(-1, 1);
    if (vw.v === 'side') S._girlSide(x, dark, sw, 0, walk, true, lw, {}); else S._girlFrontBack(x, dark, vw, sw, 0, walk, true, lw, {});
    for (var i = -3; i <= 3; i++) { var l = 0.06 + 0.07 * U.mod(t * 0.5 + i * 0.29, 1); path(x, [[i * 0.06 - 0.02, -0.4], [i * 0.06 + 0.02, -0.4], [i * 0.06 + 0.012, -0.4 + l], [i * 0.06, -0.38 + l], [i * 0.06 - 0.012, -0.4 + l]], '#040406'); }
    if (vw.v !== 'back') { var fx = vw.v === 'side' ? 0.12 : vw.t * 0.075; [-1, 1].forEach(function (k) { if (vw.v === 'side' && k < 0) return; E(x, fx + (vw.v === 'side' ? 0 : k * 0.085), -1.04, 0.022, 0.03, '#f4f4f0'); }); }
  };
  FA.umbra = 1;
  FORMS.void = function (x, vw, ph, walk, t, pal, lw) {
    var sw = Math.sin(ph * TAU) * walk, sil = { hair: '#06040e', hairHi: '#0c0818', skin: '#06040e', skinSh: '#06040e', blush: '#06040e', eye: '#06040e', sweater: '#06040e', sweaterSh: '#06040e', sweaterHi: '#0c0818', skirt: '#06040e', sock: '#06040e', shoe: '#06040e', clip: '#06040e' };
    if (vw.m < 0) x.scale(-1, 1);
    if (vw.v === 'side') S._girlSide(x, sil, sw, 0, walk, true, lw, {}); else S._girlFrontBack(x, sil, vw, sw, 0, walk, true, lw, {});
    x.globalCompositeOperation = 'source-atop'; var r = rng(17);
    for (var i = 0; i < 46; i++) { var px = (r.next() - 0.5) * 0.6, py = -U.mod(r.next() * 1.4 + t * 0.05, 1.4); x.fillStyle = r.next() < 0.35 ? hue(t, i * 37, 80, 75) : '#f4f2ff'; x.fillRect(px, py, 0.014, 0.014); }
    var g = x.createRadialGradient(0.05, -0.7, 0, 0.05, -0.7, 0.5); g.addColorStop(0, P.rgba(hue(t, 260, 70, 50), 0.45)); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(-0.6, -1.5, 1.2, 1.6);
    x.globalCompositeOperation = 'source-over';
  };
  FA.void = 1;
})(typeof window !== 'undefined' ? window : globalThis);

/* ---- accessoires simples pour les effets qui n'avaient aucune apparence ---- */
(function (root) {
  'use strict';
  var YN = root.YN, P = YN.paint, S = YN.spr, ACC = S.ACC, ANIM = S.ACC_ANIM, U = YN.util, TAU = Math.PI * 2;
  function E(x, cx, cy, rx, ry, fill, line, lw, rot) { x.beginPath(); x.ellipse(cx, cy, Math.max(0.001, rx), Math.max(0.001, ry), rot || 0, 0, TAU); if (fill) { x.fillStyle = fill; x.fill(); } if (line) { x.strokeStyle = line; x.lineWidth = lw; x.stroke(); } }
  function R(x, a, b, w, h, fill, line, lw) { P.rr(x, a, b, w, h, Math.min(w, h) * 0.25); x.fillStyle = fill; x.fill(); if (line) { x.strokeStyle = line; x.lineWidth = lw; x.stroke(); } }
  function hand(vw) { return vw.v === 'side' ? [0.02, -0.46] : vw.v === 'back' ? [-0.19, -0.46] : [0.19, -0.46]; }
  function inHand(draw) { return function (x, vw, ph, w, t, lw) { var h = hand(vw); x.save(); x.translate(h[0], h[1]); draw(x, lw, t, vw); x.restore(); }; }
  ACC.remote = inHand(function (x, lw) { x.rotate(-0.4); R(x, -0.03, -0.09, 0.06, 0.16, '#2a2a30', '#000', lw); E(x, 0, -0.06, 0.012, 0.012, '#d03030'); });
  ACC.pen = inHand(function (x, lw) { x.rotate(-0.7); R(x, -0.012, -0.1, 0.024, 0.16, '#c03030', '#401010', lw); P.stroke(x, [[0, 0.06], [0, 0.09]], '#222', lw * 2); });
  ACC.cup = inHand(function (x, lw, t) { R(x, -0.045, -0.06, 0.09, 0.1, '#e8e4dc', '#6a6460', lw); for (var i = 0; i < 2; i++) { var k = U.mod(t * 0.8 + i * 0.5, 1); E(x, -0.01 + i * 0.03, -0.08 - k * 0.12, 0.012, 0.018, 'rgba(240,240,250,' + (0.9 - k * 0.7) + ')'); } });
  ACC.drone = function (x, vw, ph, w, t, lw) { var y = -1.7 + Math.sin(t * 3) * 0.03; R(x, -0.08, y - 0.02, 0.16, 0.05, '#3a3a44', '#000', lw); [-0.13, 0.13].forEach(function (k) { P.stroke(x, [[k * 0.6, y], [k, y - 0.03]], '#555', lw * 2); E(x, k, y - 0.04, 0.07 * Math.abs(Math.cos(t * 30)) + 0.01, 0.01, '#aaa'); }); E(x, 0, y + 0.03, 0.015, 0.015, '#ff3040'); };
  ACC.rope = function (x, vw, ph, w, t, lw) { var a = t * 4; x.strokeStyle = '#e05080'; x.lineWidth = lw * 2; x.beginPath(); x.moveTo(-0.19, -0.46); x.quadraticCurveTo(0, Math.sin(a) > 0 ? 0.12 : -1.6, 0.19, -0.46); x.stroke(); };
  ACC.handle = inHand(function (x, lw) { R(x, -0.02, -0.05, 0.04, 0.1, '#c8a040', '#6a5010', lw); P.stroke(x, [[0.02, -0.01], [0.09, -0.01]], '#c8a040', lw * 3); });
  ACC.thread = function (x, vw, ph, w, t, lw) { var h = hand(vw); x.strokeStyle = '#d02030'; x.lineWidth = lw * 1.2; x.beginPath(); x.moveTo(h[0], h[1]); for (var i = 1; i <= 8; i++) x.lineTo(h[0] - i * 0.06, h[1] + 0.05 + i * 0.05 + Math.sin(t * 2 + i) * 0.02); x.stroke(); };
  ACC.whistle = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(0, bob || 0); x.strokeStyle = '#d8d8e0'; x.lineWidth = lw; x.beginPath(); x.moveTo(-0.08, -0.8); x.lineTo(0, -0.62); x.lineTo(0.08, -0.8); x.stroke(); R(x, -0.03, -0.64, 0.07, 0.04, '#c0c0c8', '#555', lw); x.restore(); };
  ACC.pitchfork = function (x, vw, ph, w, t, lw) { var h = hand(vw); x.save(); x.translate(h[0], h[1]); P.stroke(x, [[0, 0.4], [0, -0.9]], '#8a6a3a', lw * 2.5); [-0.06, 0, 0.06].forEach(function (k) { P.stroke(x, [[k, -0.9], [k, -1.08]], '#888', lw * 2); }); P.stroke(x, [[-0.06, -0.9], [0.06, -0.9]], '#888', lw * 2); x.restore(); };
  ACC.shoe = inHand(function (x, lw) { E(x, 0, 0, 0.07, 0.035, '#e8c8a0', '#7a5a3a', lw); P.stroke(x, [[-0.03, -0.02], [0.03, -0.02]], '#c06050', lw * 2); });
  ACC.gloves = function (x, vw) { (vw.v === 'side' ? [[0.02, -0.46]] : [[-0.19, -0.46], [0.19, -0.46]]).forEach(function (h) { E(x, h[0], h[1], 0.045, 0.04, '#f08aa8'); }); };
  ACC.bundle = inHand(function (x, lw) { R(x, -0.06, -0.05, 0.12, 0.09, '#d8d0b8', '#7a7058', lw); P.stroke(x, [[-0.06, -0.01], [0.06, -0.01]], '#5a5040', lw); });
  ACC.apron = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(0, bob || 0); R(x, -0.13, -0.66, 0.26, 0.3, '#d8e0c0', '#6a7050', lw); E(x, -0.05, -0.55, 0.03, 0.03, '#a0b880'); x.restore(); };
  ACC.snowflake = function (x, vw, ph, w, t, lw) { var y = -1.5 + Math.sin(t * 2) * 0.03; x.save(); x.translate(0.2, y); x.rotate(t); for (var i = 0; i < 6; i++) { x.rotate(TAU / 6); P.stroke(x, [[0, 0], [0, -0.07]], '#e8f4ff', lw * 1.6); } x.restore(); };
  ACC.dustmask = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; var fx = vw.v === 'side' ? 0.12 : vw.t * 0.075; x.save(); x.translate(fx, bob || 0); R(x, -0.1, -1.0, vw.v === 'side' ? 0.1 : 0.2, 0.09, '#ece4c4', '#a09870', lw); x.restore(); };
  ACC.bobble = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); x.beginPath(); x.moveTo(-0.24, -1.2); x.quadraticCurveTo(0, -1.52, 0.24, -1.2); x.closePath(); x.fillStyle = '#c84050'; x.fill(); x.strokeStyle = '#6a1a20'; x.lineWidth = lw; x.stroke(); E(x, 0, -1.42, 0.06, 0.06, '#f0f0f0'); x.restore(); };
  ACC.marble = inHand(function (x, lw, t) { E(x, 0, 0, 0.04, 0.04, 'rgba(120,180,255,0.9)', '#204080', lw); E(x, Math.cos(t * 3) * 0.015, Math.sin(t * 3) * 0.015, 0.012, 0.012, '#f0f0ff'); });
  ACC.candyfloss = inHand(function (x, lw) { P.stroke(x, [[0, 0.06], [0, -0.1]], '#e8e0d0', lw * 2); P.ball(x, 0, -0.18, 0.1, 0.09, '#f8b0d8'); });
  ACC.kite = function (x, vw, ph, w, t, lw) { var h = hand(vw), kx = 0.35 + Math.sin(t) * 0.05, ky = -1.9 + Math.sin(t * 1.3) * 0.05; x.strokeStyle = '#ddd'; x.lineWidth = lw * 0.8; x.beginPath(); x.moveTo(h[0], h[1]); x.lineTo(kx, ky + 0.1); x.stroke(); x.beginPath(); x.moveTo(kx, ky - 0.12); x.lineTo(kx + 0.09, ky); x.lineTo(kx, ky + 0.12); x.lineTo(kx - 0.09, ky); x.closePath(); x.fillStyle = '#e04040'; x.fill(); };
  ACC.shell = inHand(function (x, lw) { E(x, 0, 0, 0.06, 0.045, '#f0dcc8', '#a07858', lw); for (var i = -2; i <= 2; i++) P.stroke(x, [[0, 0.04], [i * 0.025, -0.035]], '#c8a080', lw); });
  ACC.strawhat = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); E(x, 0, -1.3, 0.34, 0.07, '#e0c070', '#8a6a20', lw); E(x, 0, -1.36, 0.16, 0.08, '#e8cc80', '#8a6a20', lw); P.stroke(x, [[-0.16, -1.32], [0.16, -1.32]], '#c03030', lw * 2); x.restore(); };
  ACC.duck = inHand(function (x, lw) { P.ball(x, 0, 0, 0.05, 0.04, '#f8d830'); P.ball(x, 0.03, -0.05, 0.03, 0.03, '#f8d830'); E(x, 0.065, -0.05, 0.02, 0.01, '#f08020'); });
  ACC.brick = inHand(function (x, lw) { R(x, -0.06, -0.035, 0.12, 0.07, '#b05040', '#5a2010', lw); });
  ACC.tray = inHand(function (x, lw) { R(x, -0.11, -0.02, 0.22, 0.04, '#9aa0a8', '#4a5058', lw); E(x, -0.04, -0.03, 0.03, 0.015, '#f0f0e8'); });
  ['cup', 'drone', 'rope', 'thread', 'snowflake', 'marble', 'kite'].forEach(function (k) { ANIM[k] = 1; });
})(typeof window !== 'undefined' ? window : globalThis);
