/* =========================================================================
 *  DÉCORS EN VECTORIEL (arbres, mobilier, portes, statues, machines...).
 *  Chaque décor : largeur × hauteur en cases, dessiné en unités de case
 *  avec l'origine au centre du bas de sa case (là où il touche le sol).
 *  Les décors muraux (fenêtre, affiche...) se dessinent sur la face du mur.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;
  var cache = {}, cacheN = 0;
  function C(o, i, d) { return (o && o.c && o.c[i]) || d; }
  function E(x, cx, cy, rx, ry, fill, line, lw, rot) { x.beginPath(); x.ellipse(cx, cy, Math.max(0.001, rx), Math.max(0.001, ry), rot || 0, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } if (line) { x.strokeStyle = line; x.lineWidth = lw || 0.012; x.stroke(); } }
  function RR(x, x0, y0, w, h, r, fill, line, lw) { P.rr(x, x0, y0, w, h, r); if (fill) { x.fillStyle = fill; x.fill(); } if (line) { x.strokeStyle = line; x.lineWidth = lw || 0.012; x.stroke(); } }
  function LG(x, x0, y0, x1, y1, stops) { var g = x.createLinearGradient(x0, y0, x1, y1); stops.forEach(function (s, i) { g.addColorStop(s[0] !== undefined && typeof s !== 'string' ? s[0] : i / (stops.length - 1), typeof s === 'string' ? s : s[1]); }); return g; }
  function vshade(x, y0, y1, col, k) { return LG(x, 0, y0, 0, y1, [P.sh(col, (k || 0.15)), col, P.sh(col, -(k || 0.15) * 1.6)]); }
  function line(x, pts, col, w) { P.stroke(x, pts, col, w); }
  function poly(x, pts, fill, ln, lw) { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) { var p = pts[i]; if (p.length === 4) x.quadraticCurveTo(p[0], p[1], p[2], p[3]); else x.lineTo(p[0], p[1]); } x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (ln) { x.strokeStyle = ln; x.lineWidth = lw || 0.012; x.lineJoin = 'round'; x.stroke(); } }
  var OL = 0.014; // épaisseur de trait (en cases)
  function out(c) { return P.sh(c, -0.55); }
  /* ombre au sol (dessinée en unités de case) */
  function gshadow(x, rx, a, oy) { var g = x.createRadialGradient(0, oy || 0, 0, 0, oy || 0, rx); g.addColorStop(0, 'rgba(10,8,20,' + (a || 0.35) + ')'); g.addColorStop(1, 'rgba(10,8,20,0)'); x.save(); x.scale(1, 0.35); x.fillStyle = g; x.beginPath(); x.arc(0, (oy || 0) / 0.35, rx, 0, Math.PI * 2); x.fill(); x.restore(); }
  /* boîte 3/4 : base au sol (y=0), largeur w, profondeur d (vers le haut), hauteur h */
  function box(x, cx, w, d, h, top, front, o) {
    o = o || {};
    var x0 = cx - w / 2;
    RR(x, x0, -h, w, h, o.r || 0.02, vshade(x, -h, 0, front, 0.1), o.noline ? null : out(front), OL);
    RR(x, x0, -h - d, w, d, o.r || 0.02, LG(x, x0, -h - d, x0 + w, -h, [P.sh(top, 0.14), top]), o.noline ? null : out(top), OL);
  }

  var D = {};
  function def(name, w, h, fn, o) { D[name] = { w: w, h: h, fn: fn, o: o || {} }; }

  /* ===================== NATURE ===================== */
  def('tree', 2, 2.8, function (x, o, f, t) {
    gshadow(x, 0.75, 0.38, 0.02);
    var tr = C(o, 2, '#5a3e26');
    poly(x, [[-0.11, 0], [-0.08, -0.85], [-0.2, -1.1], [-0.05, -0.95], [0, -1.25], [0.05, -0.95], [0.2, -1.1], [0.08, -0.85], [0.11, 0]], vshade(x, -1, 0, tr, 0.1), out(tr), OL);
    x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 0.012; x.beginPath(); x.moveTo(-0.03, -0.1); x.lineTo(-0.02, -0.7); x.stroke();
    var sway = Math.sin(t * 0.9 + (o.seed || 0)) * 0.03;
    var g = [C(o, 0, '#3f8a3c'), C(o, 1, '#2a6a2e'), C(o, 3, '#6ab858')];
    P.foliage(x, sway, -1.55, 0.78, 0.62, g, (o.seed || 3) + 1, { n: 26, leaf: 0.24 });
    P.foliage(x, -0.35 + sway, -1.25, 0.42, 0.34, g, (o.seed || 3) + 2, { n: 12, leaf: 0.28 });
    P.foliage(x, 0.38 + sway, -1.28, 0.4, 0.33, g, (o.seed || 3) + 3, { n: 12, leaf: 0.28 });
    P.foliage(x, sway * 1.4, -1.95, 0.45, 0.36, g, (o.seed || 3) + 4, { n: 12, leaf: 0.28 });
    if (o.fruit) { var r = YN.rng.make(9); for (var i = 0; i < 9; i++) P.ball(x, sway + (r.next() - 0.5) * 1.2, -1.3 - r.next() * 0.8, 0.065, 0.065, o.fruit, { hi: 0.4 }); }
    if (o.snow) { x.globalAlpha = 0.85; P.ball(x, sway - 0.1, -2.2, 0.38, 0.12, '#f4f8ff', { lo: -0.08 }); P.ball(x, sway + 0.35, -1.6, 0.25, 0.08, '#f4f8ff', { lo: -0.08 }); x.globalAlpha = 1; }
  }, { anim: true });
  def('pine', 1.6, 2.8, function (x, o, f, t) {
    gshadow(x, 0.55, 0.35);
    RR(x, -0.07, -0.4, 0.14, 0.4, 0.02, '#4a3220', '#2a1a10', OL);
    var g = C(o, 0, '#1f4a2c'), sway = Math.sin(t * 0.8) * 0.02;
    for (var i = 0; i < 4; i++) {
      var w = 0.75 - i * 0.15, yb = -0.35 - i * 0.48, yt = yb - 0.75;
      poly(x, [[-w + sway * i, yb], [sway * (i + 1), yt], [w + sway * i, yb], [0, yb - 0.06]], LG(x, -w, yt, w, yb, [P.sh(g, 0.2), g, P.sh(g, -0.35)]), out(g), OL);
      if (o.snow) poly(x, [[-w * 0.6 + sway * i, yb - 0.32], [sway * (i + 1), yt], [w * 0.6 + sway * i, yb - 0.32], [0, yb - 0.28]], '#f0f6ff');
    }
  }, { anim: true });
  def('deadtree', 1.6, 2.6, function (x, o) {
    gshadow(x, 0.45, 0.3);
    var k = C(o, 0, '#3a3030');
    x.strokeStyle = k; x.lineCap = 'round';
    var br = function (x0, y0, a, len, w, d) { if (d > 4 || len < 0.06) return; var x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len; x.lineWidth = w; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); var r = YN.rng.make(Math.floor((x0 + 5) * 97 + d * 13)); br(x1, y1, a - 0.45 - r.next() * 0.3, len * 0.7, w * 0.65, d + 1); br(x1, y1, a + 0.4 + r.next() * 0.3, len * 0.65, w * 0.65, d + 1); };
    br(0, 0, 0, 0.9, 0.13, 0);
  });
  def('willow', 2.2, 3, function (x, o, f, t) {
    gshadow(x, 0.8, 0.35);
    RR(x, -0.1, -1.2, 0.2, 1.2, 0.05, vshade(x, -1.2, 0, C(o, 2, '#5a4a30')), '#2a2010', OL);
    var g = C(o, 0, '#5a8a4a');
    P.foliage(x, 0, -1.8, 0.8, 0.5, [g, P.sh(g, -0.25), P.sh(g, 0.2)], 7, { n: 22 });
    for (var i = 0; i < 14; i++) { var px = -0.78 + i * 0.12, sw = Math.sin(t * 1.2 + i * 0.7) * 0.05; x.strokeStyle = i % 2 ? P.sh(g, 0.1) : P.sh(g, -0.15); x.lineWidth = 0.05; x.beginPath(); x.moveTo(px, -1.6); x.quadraticCurveTo(px + sw, -1.0, px + sw * 2, -0.45 - (i % 3) * 0.12); x.stroke(); }
  }, { anim: true });
  def('palm', 2.2, 3, function (x, o, f, t) {
    gshadow(x, 0.6, 0.3);
    for (var i = 0; i < 12; i++) { var yy = -i * 0.16; E(x, Math.sin(i / 4) * 0.12, yy - 0.08, 0.1, 0.07, i % 2 ? '#8a6a40' : '#a07a48'); }
    var g = C(o, 0, '#3a8a40'), tx = Math.sin(11 / 4) * 0.12;
    for (var a = 0; a < 7; a++) { var an = -Math.PI + a / 6 * Math.PI + Math.sin(t + a) * 0.04; x.strokeStyle = a % 2 ? g : P.sh(g, -0.2); x.lineWidth = 0.09; x.beginPath(); x.moveTo(tx, -1.9); x.quadraticCurveTo(tx + Math.cos(an) * 0.5, -1.95 + Math.sin(an) * 0.3 - 0.2, tx + Math.cos(an) * 0.95, -1.75 + Math.sin(an) * 0.25 + 0.3); x.stroke(); }
  }, { anim: true });
  def('bush', 1.2, 1, function (x, o) {
    gshadow(x, 0.45, 0.32);
    var g = C(o, 0, '#2f6d34');
    P.foliage(x, 0, -0.32, 0.44, 0.32, [g, P.sh(g, -0.25), P.sh(g, 0.2)], (o.seed || 1) + 11, { n: 14, leaf: 0.3 });
    if (o.berry) { var r = YN.rng.make(4); for (var i = 0; i < 6; i++) P.ball(x, (r.next() - 0.5) * 0.6, -0.15 - r.next() * 0.4, 0.04, 0.04, o.berry, { hi: 0.45 }); }
  });
  def('flower', 1, 1, function (x, o) { line(x, [[0, 0], [0, -0.42]], '#3a8a3a', 0.035); P.leaf(x, -0.08, -0.18, 0.16, -0.5, '#4a9a40'); P.flower(x, 0, -0.48, 0.1, C(o, 0, '#f070a0'), C(o, 1, '#f8e070')); });
  def('flowers', 1, 1, function (x, o) { var cs = (o && o.c) || ['#f070a0', '#f8e070', '#ffffff', '#80c0ff', '#f09040']; var r = YN.rng.make(3); for (var i = 0; i < 5; i++) { var px = -0.35 + i * 0.17, h = 0.2 + r.next() * 0.2; line(x, [[px, 0], [px, -h]], '#3a8a3a', 0.025); P.flower(x, px, -h, 0.06, cs[i % cs.length]); } });
  def('sunflower', 1, 2, function (x, o, f, t) { line(x, [[0, 0], [Math.sin(t) * 0.03, -1.2]], '#3a7a30', 0.06); P.leaf(x, 0.12, -0.6, 0.3, 0.3, '#4a9a40', '#2a6a20'); P.leaf(x, -0.12, -0.8, 0.28, -0.3, '#4a9a40', '#2a6a20'); var p = C(o, 0, '#f0c020'); for (var i = 0; i < 14; i++) { var a = i / 14 * 6.28; E(x, Math.cos(a) * 0.2, -1.3 + Math.sin(a) * 0.2, 0.09, 0.05, p, null, 0, a); } P.ball(x, 0, -1.3, 0.15, 0.15, C(o, 1, '#5a3a10')); }, { anim: true });
  def('sprout', 1, 1, function (x, o, f, t) { E(x, 0, -0.02, 0.16, 0.05, '#5a3e26'); x.save(); x.rotate(Math.sin(t * 2) * 0.08); line(x, [[0, 0], [0, -0.32]], '#4f9a45', 0.04); P.leaf(x, -0.1, -0.3, 0.2, -0.5, '#6cc25a', '#3f8a3a'); P.leaf(x, 0.1, -0.36, 0.2, 0.5, '#8ad870', '#3f8a3a'); x.restore(); }, { anim: true });
  def('rock', 1, 1, function (x, o) { gshadow(x, 0.42, 0.3); var c = C(o, 0, '#7a7a74'); poly(x, [[-0.38, -0.02], [-0.33, -0.28], [-0.1, -0.42], [0.22, -0.38], [0.4, -0.15], [0.36, -0.02]], vshade(x, -0.42, 0, c, 0.2), out(c), OL); poly(x, [[-0.25, -0.3], [-0.08, -0.38], [0.15, -0.33], [0.0, -0.25]], P.rgba('#ffffff', 0.2)); });
  def('stump', 1, 1, function (x, o) { gshadow(x, 0.38, 0.3); RR(x, -0.28, -0.32, 0.56, 0.32, 0.06, vshade(x, -0.3, 0, '#6a4a2a'), '#2a1a0a', OL); E(x, 0, -0.32, 0.28, 0.1, '#c09a64', '#6a4a2a', OL); E(x, 0, -0.32, 0.16, 0.055, null, '#8a6a3a', OL); });
  def('mushroom', 1, 1, function (x, o) { RR(x, -0.07, -0.3, 0.14, 0.3, 0.04, '#f0e8d8', '#8a8070', OL); var c = C(o, 0, '#d03030'); poly(x, [[-0.32, -0.25], [-0.3, -0.52, 0, -0.55], [0.3, -0.52, 0.32, -0.25]], vshade(x, -0.55, -0.25, c), out(c), OL); E(x, -0.12, -0.42, 0.04, 0.03, '#fff'); E(x, 0.1, -0.46, 0.035, 0.025, '#fff'); E(x, 0.18, -0.34, 0.03, 0.02, '#fff'); });
  def('cactus', 1, 2, function (x, o) { gshadow(x, 0.3, 0.3); var g = C(o, 0, '#3a8a50'); RR(x, -0.12, -1.3, 0.24, 1.3, 0.12, vshade(x, -1.3, 0, g), out(g), OL); RR(x, -0.42, -0.95, 0.16, 0.45, 0.08, g, out(g), OL); RR(x, -0.42, -0.6, 0.35, 0.14, 0.07, g); RR(x, 0.26, -1.1, 0.16, 0.42, 0.08, g, out(g), OL); RR(x, 0.08, -0.75, 0.32, 0.14, 0.07, g); });
  def('reeds', 1, 1.6, function (x, o, f, t) { for (var i = 0; i < 6; i++) { var px = -0.35 + i * 0.14, h = 0.8 + (i * 37 % 10) / 20, sw = Math.sin(t * 1.5 + i) * 0.05; line(x, [[px, 0], [px + sw, -h]], '#6a8a40', 0.03); RR(x, px + sw - 0.025, -h - 0.04, 0.05, 0.2, 0.025, '#7a5a30'); } }, { anim: true });
  def('waterfall', 2.2, 3.4, function (x, o, f, t) {
    var c0 = C(o, 0, '#4c8ac4'), c1 = C(o, 1, '#a8d4f4');
    RR(x, -1.0, -3.3, 2.0, 3.3, 0.2, LG(x, 0, -3.3, 0, 0, [P.sh(c0, 0.1), c0, P.sh(c0, 0.2)]));
    for (var i = 0; i < 26; i++) { var px = -0.95 + (i * 0.37) % 1.9, ph = U.mod(t * 1.4 + i * 0.23, 1), len = 0.4 + (i % 4) * 0.12; x.globalAlpha = 0.55; line(x, [[px, -3.3 + ph * 3.3], [px, -3.3 + ph * 3.3 + len]], c1, 0.035); }
    x.globalAlpha = 1;
    for (var j = 0; j < 9; j++) { var ph2 = U.mod(t * 0.8 + j * 0.11, 1); P.ball(x, -0.9 + j * 0.22, -0.05 - ph2 * 0.25, 0.1 + ph2 * 0.08, 0.06 + ph2 * 0.04, 'rgba(255,255,255,' + (0.8 - ph2 * 0.7) + ')', { hi: 0, lo: 0 }); }
  }, { anim: true });
  def('lilypad', 1, 1, function (x, o) { E(x, 0, -0.1, 0.36, 0.22, '#3a9a48', '#1a5a24', OL); if (o.bloom) P.flower(x, 0.05, -0.15, 0.1, '#f0a0c0'); });
  def('snowman', 1, 1.8, function (x, o) { gshadow(x, 0.38, 0.3); P.ball(x, 0, -0.32, 0.34, 0.32, '#f4f8ff', { lo: -0.18 }); P.ball(x, 0, -0.86, 0.24, 0.23, '#f4f8ff', { lo: -0.18 }); P.ball(x, 0, -1.25, 0.18, 0.17, '#f4f8ff', { lo: -0.18 }); E(x, -0.06, -1.28, 0.022, 0.022, '#222'); E(x, 0.06, -1.28, 0.022, 0.022, '#222'); poly(x, [[0, -1.24], [0.16, -1.21], [0, -1.2]], '#f08030'); if (!o.noscarf) { RR(x, -0.22, -1.08, 0.44, 0.08, 0.04, '#c8303a'); RR(x, 0.06, -1.06, 0.08, 0.25, 0.03, '#a82530'); } line(x, [[-0.22, -0.9], [-0.5, -1.1]], '#5a3a20', 0.03); line(x, [[0.22, -0.9], [0.5, -1.05]], '#5a3a20', 0.03); });
  def('puddle', 1, 1, function (x, o) { E(x, 0, -0.08, 0.42, 0.16, 'rgba(110,150,200,0.7)', 'rgba(60,90,130,0.5)', OL); E(x, -0.12, -0.12, 0.15, 0.04, 'rgba(220,240,255,0.5)'); if (o.carrot) poly(x, [[0.05, -0.1], [0.3, -0.06], [0.05, -0.04]], '#f08030'); });
  def('nest', 1, 1, function (x, o) { E(x, 0, -0.14, 0.38, 0.16, '#6a4a2a'); for (var i = 0; i < 18; i++) { var a = i / 18 * 6.28; line(x, [[Math.cos(a) * 0.36, -0.14 + Math.sin(a) * 0.15], [Math.cos(a + 0.6) * 0.3, -0.16 + Math.sin(a + 0.6) * 0.12]], i % 2 ? '#9a7a48' : '#b0905a', 0.03); } E(x, 0, -0.17, 0.24, 0.08, '#3a2a18'); if (o.egg) { P.ball(x, 0, -0.33, 0.15, 0.19, C(o, 0, '#f0ece0'), { hi: 0.3 }); x.strokeStyle = 'rgba(120,100,160,0.4)'; x.lineWidth = 0.012; x.beginPath(); x.arc(0, -0.33, 0.1, 0.5, 2.4); x.stroke(); } });
  def('hive', 1, 1.6, function (x) { for (var i = 0; i < 5; i++) { var w = [0.25, 0.36, 0.4, 0.34, 0.22][i]; RR(x, -w, -0.3 - i * 0.22, w * 2, 0.24, 0.1, vshade(x, -0.3 - i * 0.22, -0.06 - i * 0.22, i % 2 ? '#d8a030' : '#e8b840')); } E(x, 0, -0.5, 0.07, 0.05, '#3a2a10'); });
  def('firefly', 1, 1, function (x, o, f, t) { var a = 0.5 + 0.5 * Math.sin(t * 2.5 + (o.ph || 0)); var g = x.createRadialGradient(0, -0.5, 0, 0, -0.5, 0.22); g.addColorStop(0, 'rgba(240,255,150,' + a + ')'); g.addColorStop(1, 'rgba(240,255,150,0)'); x.fillStyle = g; x.fillRect(-0.25, -0.75, 0.5, 0.5); E(x, 0, -0.5, 0.025, 0.025, '#fff8c0'); }, { anim: true });
  def('sparkle', 1, 1, function (x, o, f, t) { var s = 0.5 + 0.5 * Math.sin(t * 6); x.save(); x.translate(0, -0.5); x.rotate(t); x.fillStyle = C(o, 0, '#fff8d0'); x.globalAlpha = s; for (var i = 0; i < 4; i++) { x.rotate(Math.PI / 2); poly(x, [[0, 0], [0.03, -0.03], [0, -0.18], [-0.03, -0.03]], C(o, 0, '#fff8d0')); } x.restore(); }, { anim: true });

  /* ===================== MOBILIER ===================== */
  def('bed', 1.1, 2.3, function (x, o) {
    gshadow(x, 0.6, 0.3);
    var fr = '#6a4a3a', sheet = C(o, 0, '#e8e0f0'), cov = C(o, 1, '#8a9ac8');
    RR(x, -0.5, -1.9, 1.0, 1.9, 0.06, vshade(x, -1.9, 0, fr), out(fr), OL);
    RR(x, -0.5, -2.2, 1.0, 0.42, 0.08, vshade(x, -2.2, -1.8, P.sh(fr, 0.1)), out(fr), OL);
    RR(x, -0.44, -1.84, 0.88, 1.7, 0.06, sheet);
    RR(x, -0.38, -1.78, 0.76, 0.38, 0.12, LG(x, 0, -1.78, 0, -1.4, ['#ffffff', '#e8e4f0']), '#b8b0c8', OL);
    poly(x, [[-0.46, -1.3], [0.46, -1.3], [0.48, -0.12], [-0.48, -0.12]], LG(x, -0.5, -1.3, 0.5, -0.1, [P.sh(cov, 0.2), cov, P.sh(cov, -0.25)]), out(cov), OL);
    RR(x, -0.46, -1.32, 0.92, 0.12, 0.04, P.sh(cov, 0.25));
    x.strokeStyle = P.rgba(P.sh(cov, -0.3), 0.5); x.lineWidth = 0.012; x.beginPath(); x.moveTo(-0.3, -1.1); x.quadraticCurveTo(-0.1, -0.7, -0.25, -0.3); x.moveTo(0.2, -1.0); x.quadraticCurveTo(0.35, -0.6, 0.15, -0.25); x.stroke();
    if (o.sleeper) { P.ball(x, 0, -1.6, 0.18, 0.15, '#1e1a26'); E(x, 0, -1.5, 0.11, 0.06, '#f6d8c0'); }
  });
  def('desk', 2, 1.9, function (x, o) {
    gshadow(x, 0.95, 0.32);
    var c = C(o, 0, '#8a6a48');
    // pieds, caisson à tiroirs à droite
    RR(x, -0.92, -0.72, 0.09, 0.72, 0.02, vshade(x, -0.72, 0, P.sh(c, -0.25)), out(c), OL);
    RR(x, 0.3, -0.72, 0.62, 0.72, 0.03, vshade(x, -0.72, 0, P.sh(c, -0.06)), out(c), OL);
    [-0.66, -0.42, -0.2].forEach(function (yy) { RR(x, 0.36, yy, 0.5, 0.18, 0.02, vshade(x, yy, yy + 0.18, P.sh(c, 0.02)), out(c), OL); P.ball(x, 0.61, yy + 0.09, 0.025, 0.025, '#e0c080'); });
    // plateau
    box(x, 0, 1.96, 0.42, 0.1, P.sh(c, 0.14), P.sh(c, -0.05));
    // chaise devant (on la voit de dos)
    var ch = P.sh(c, -0.12);
    RR(x, -0.5, -0.3, 0.05, 0.3, 0.01, P.sh(ch, -0.3)); RR(x, -0.06, -0.3, 0.05, 0.3, 0.01, P.sh(ch, -0.3));
    box(x, -0.28, 0.5, 0.18, 0.05, P.sh(ch, 0.1), ch);
    RR(x, -0.52, -0.95, 0.48, 0.42, 0.05, vshade(x, -0.95, -0.5, ch), out(ch), OL);
    RR(x, -0.47, -0.9, 0.38, 0.06, 0.02, P.sh(ch, 0.15));
    if (o.book) { poly(x, [[0.0, -1.12], [0.46, -1.15], [0.5, -0.94], [0.02, -0.9]], '#f4ecdc', '#9a8a70', OL); line(x, [[0.25, -1.13], [0.26, -0.92]], '#b8a888', 0.012); for (var i = 0; i < 4; i++) line(x, [[0.05, -1.07 + i * 0.04], [0.21, -1.08 + i * 0.04]], 'rgba(60,60,90,0.5)', 0.008); RR(x, 0.04, -0.9, 0.48, 0.03, 0.01, '#a03040'); }
    if (o.lamp) { E(x, -0.7, -0.95, 0.12, 0.035, '#3a3a40'); line(x, [[-0.7, -0.95], [-0.62, -1.35], [-0.48, -1.42]], '#4a4a52', 0.03); poly(x, [[-0.6, -1.36], [-0.34, -1.4], [-0.36, -1.55], [-0.52, -1.55]], LG(x, 0, -1.55, 0, -1.36, ['#f8f0a0', '#e0c050']), '#8a7a30', OL); var g = x.createRadialGradient(-0.45, -1.1, 0, -0.45, -1.1, 0.7); g.addColorStop(0, 'rgba(255,240,180,0.3)'); g.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = g; x.fillRect(-1.2, -1.8, 1.5, 1.3); }
  });
  def('drain', 1, 1, function (x, o) { RR(x, -0.42, -0.62, 0.84, 0.5, 0.04, '#3a3a40', '#111', OL); for (var i = 0; i < 5; i++) RR(x, -0.36 + i * 0.16, -0.58, 0.08, 0.42, 0.01, '#121216'); if (o.umbrella) { line(x, [[-0.1, -0.5], [0.15, -0.3]], '#c02838', 0.05); } }, { flat: true });
  def('nightstand', 1, 1.5, function (x, o) {
    gshadow(x, 0.42, 0.3); var c = C(o, 0, '#8a6444');
    RR(x, -0.36, -0.12, 0.07, 0.12, 0.02, P.sh(c, -0.35)); RR(x, 0.29, -0.12, 0.07, 0.12, 0.02, P.sh(c, -0.35));
    box(x, 0, 0.78, 0.3, 0.62, P.sh(c, 0.14), c);
    RR(x, -0.32, -0.56, 0.64, 0.22, 0.03, vshade(x, -0.56, -0.34, P.sh(c, -0.04)), out(c), OL); P.ball(x, 0, -0.45, 0.03, 0.03, '#e8c890');
    RR(x, -0.32, -0.3, 0.64, 0.12, 0.02, 'rgba(0,0,0,0.22)');
    if (o.clock) { RR(x, 0.05, -1.08, 0.24, 0.17, 0.04, '#2a2a34', '#111', OL); x.fillStyle = '#f04060'; x.font = 'bold 0.09px monospace'; x.fillText('23:71', 0.07, -0.96); }
    else { E(x, 0.18, -0.95, 0.05, 0.02, '#3a3a3a'); line(x, [[0.18, -0.95], [0.18, -1.15]], '#4a4a4a', 0.025); poly(x, [[0.04, -1.12], [0.32, -1.12], [0.26, -1.3], [0.1, -1.3]], LG(x, 0, -1.3, 0, -1.12, ['#fff4d8', '#f0d8a0']), '#a08850', OL); }
    if (o.glass) { poly(x, [[-0.22, -1.17], [-0.06, -1.17], [-0.08, -0.93], [-0.2, -0.93]], 'rgba(210,235,255,0.55)', 'rgba(120,150,180,0.9)', OL); RR(x, -0.2, -1.06, 0.12, 0.12, 0.01, 'rgba(150,200,240,0.55)'); line(x, [[-0.19, -1.14], [-0.17, -0.97]], 'rgba(255,255,255,0.7)', 0.012); }
  });
  def('chair', 1, 1.4, function (x, o) { var c = C(o, 0, '#7a5a3a'); gshadow(x, 0.3, 0.3); RR(x, -0.25, -0.5, 0.06, 0.5, 0.02, P.sh(c, -0.2)); RR(x, 0.19, -0.5, 0.06, 0.5, 0.02, P.sh(c, -0.2)); box(x, 0, 0.5, 0.25, 0.06, P.sh(c, 0.12), c); RR(x, -0.25, -1.15, 0.5, 0.5, 0.05, vshade(x, -1.15, -0.65, c), out(c), OL); });
  def('stool', 1, 1, function (x, o) { var c = C(o, 0, '#8a6a48'); gshadow(x, 0.3, 0.3); RR(x, -0.2, -0.45, 0.06, 0.45, 0.02, P.sh(c, -0.25)); RR(x, 0.14, -0.45, 0.06, 0.45, 0.02, P.sh(c, -0.25)); box(x, 0, 0.5, 0.25, 0.08, P.sh(c, 0.12), c); });
  def('table', 2, 1.4, function (x, o) { gshadow(x, 0.9, 0.3); var c = C(o, 0, '#9a7a58'); [[-0.8, 0], [0.72, 0]].forEach(function (q) { RR(x, q[0], -0.6, 0.08, 0.6, 0.02, P.sh(c, -0.3)); }); box(x, 0, 1.8, 0.55, 0.1, P.sh(c, 0.12), c); if (o.cloth) { poly(x, [[-0.92, -1.25], [0.92, -1.25], [0.95, -0.55], [-0.95, -0.55]], o.cloth, out(o.cloth), OL); } });
  def('commode', 1.1, 1.5, function (x, o) {
    gshadow(x, 0.5, 0.3); var c = C(o, 0, '#9a7050');
    box(x, 0, 0.95, 0.3, 0.95, P.sh(c, 0.12), c);
    [-0.75, -0.38].forEach(function (yy) { RR(x, -0.4, yy, 0.8, 0.3, 0.03, vshade(x, yy, yy + 0.3, P.sh(c, -0.05)), out(c), OL); P.ball(x, 0, yy + 0.15, 0.035, 0.035, '#e0c080'); });
    RR(x, -0.42, -0.02, 0.1, 0.04, 0.01, P.sh(c, -0.35)); RR(x, 0.32, -0.02, 0.1, 0.04, 0.01, P.sh(c, -0.35));
  });
  def('shelf', 1, 2, function (x, o) {
    gshadow(x, 0.45, 0.3); var c = C(o, 0, '#7a5a3a');
    box(x, 0, 0.9, 0.22, 1.7, P.sh(c, 0.12), P.sh(c, -0.25));
    var cols = ['#a03040', '#3060a0', '#40804a', '#c0a040', '#705090', '#d0d0c0'];
    for (var i = 0; i < 4; i++) { var yy = -1.55 + i * 0.4; RR(x, -0.42, yy + 0.32, 0.84, 0.04, 0.01, c); for (var j = 0; j < 6; j++) { var h = 0.22 + ((i * 7 + j * 3) % 5) * 0.02; RR(x, -0.38 + j * 0.13, yy + 0.32 - h, 0.11, h, 0.01, cols[(i + j) % 6], out(cols[(i + j) % 6]), 0.008); } }
  });
  def('bookcase', 2, 2.6, function (x, o) {
    gshadow(x, 0.9, 0.3); var c = C(o, 0, '#6a4a2a');
    box(x, 0, 1.9, 0.25, 2.3, P.sh(c, 0.12), P.sh(c, -0.3));
    for (var i = 0; i < 5; i++) { var yy = -2.15 + i * 0.44; RR(x, -0.92, yy + 0.38, 1.84, 0.05, 0.01, c); for (var j = 0; j < 12; j++) { var h = 0.26 + ((i * 5 + j * 7) % 6) * 0.015, col = o.blank ? '#f0f0ea' : ['#a03040', '#3060a0', '#40804a', '#c0a040', '#705090', '#e0e0d0'][(i * 3 + j) % 6]; RR(x, -0.88 + j * 0.148, yy + 0.38 - h, 0.13, h, 0.01, col, out(col), 0.008); } }
  });
  def('lamp', 1, 2, function (x, o) { gshadow(x, 0.3, 0.3); RR(x, -0.2, -0.06, 0.4, 0.06, 0.03, '#2a2a2a'); line(x, [[0, -0.05], [0, -1.2]], '#3a3a3a', 0.04); var on = !o.off; poly(x, [[-0.28, -1.15], [0.28, -1.15], [0.18, -1.55], [-0.18, -1.55]], on ? LG(x, 0, -1.55, 0, -1.15, ['#fff8d0', '#f0d880']) : '#6a6458', on ? '#a08840' : '#3a3428', OL); });
  def('streetlamp', 1, 3.2, function (x, o) { gshadow(x, 0.25, 0.3); var c = C(o, 0, '#2a2a30'); RR(x, -0.06, -2.6, 0.12, 2.6, 0.03, vshade(x, -2.6, 0, c), out(c), OL); RR(x, -0.18, -0.15, 0.36, 0.15, 0.03, c); line(x, [[0, -2.6], [0.3, -2.75]], c, 0.06); var on = !o.off; poly(x, [[0.15, -2.75], [0.45, -2.75], [0.38, -2.95], [0.22, -2.95]], c); E(x, 0.3, -2.7, 0.12, 0.05, on ? '#fff0b0' : '#555'); });
  def('bench', 2, 1.2, function (x, o) { gshadow(x, 0.85, 0.28); var c = C(o, 0, '#8a6040'); [-0.75, 0.7].forEach(function (k) { RR(x, k, -0.42, 0.06, 0.42, 0.02, '#3a3a3a'); }); box(x, 0, 1.8, 0.22, 0.06, P.sh(c, 0.15), c); for (var i = 0; i < 2; i++) RR(x, -0.9, -0.92 + i * 0.2, 1.8, 0.12, 0.03, vshade(x, -0.92, -0.8, c), out(c), OL); });
  def('sofa', 2, 1.4, function (x, o) { gshadow(x, 0.9, 0.3); var c = C(o, 0, '#6a4a5a'); RR(x, -0.95, -1.1, 1.9, 0.6, 0.12, vshade(x, -1.1, -0.5, c), out(c), OL); box(x, 0, 1.6, 0.4, 0.3, P.sh(c, 0.15), c, { r: 0.08 }); RR(x, -1.0, -0.85, 0.22, 0.85, 0.08, vshade(x, -0.85, 0, P.sh(c, -0.1)), out(c), OL); RR(x, 0.78, -0.85, 0.22, 0.85, 0.08, vshade(x, -0.85, 0, P.sh(c, -0.1)), out(c), OL); });
  def('tv', 1, 1.5, function (x, o, f, t) { gshadow(x, 0.35, 0.3); RR(x, -0.06, -0.4, 0.12, 0.4, 0.02, '#1a1a1a'); RR(x, -0.25, -0.06, 0.5, 0.06, 0.02, '#1a1a1a'); RR(x, -0.48, -1.25, 0.96, 0.85, 0.07, vshade(x, -1.25, -0.4, '#2a2a30'), '#0a0a0e', OL); var on = !o.off; RR(x, -0.4, -1.17, 0.8, 0.66, 0.08, on ? LG(x, 0, -1.17, 0, -0.5, ['#a8b8d8', '#6a7aa0']) : '#151820'); if (on) { x.globalAlpha = 0.2; for (var i = 0; i < 8; i++) RR(x, -0.4, -1.17 + U.mod(t * 0.3 + i * 0.09, 0.66), 0.8, 0.02, 0, '#fff'); x.globalAlpha = 1; } }, { anim: true });
  def('crt', 1, 1, function (x, o, f, t) { box(x, 0, 0.8, 0.2, 0.62, '#d8d0c0', '#c8c0b0'); RR(x, -0.3, -0.56, 0.6, 0.44, 0.06, (Math.floor(t * 4) % 2) ? '#406a40' : '#305a30'); }, { anim: true });
  def('fridge', 1, 2.1, function (x, o) { gshadow(x, 0.45, 0.3); box(x, 0, 0.9, 0.25, 1.85, '#f4f4f4', '#e0e0e0'); line(x, [[-0.45, -1.25], [0.45, -1.25]], '#b8b8b8', 0.015); RR(x, 0.28, -1.65, 0.05, 0.3, 0.02, '#999'); RR(x, 0.28, -1.1, 0.05, 0.45, 0.02, '#999'); if (o.notes) { [['#f8f080', -0.3, -1.7], ['#f8c0c0', -0.1, -1.0], ['#c0e8f8', 0.05, -0.75]].forEach(function (q) { RR(x, q[1], q[2], 0.22, 0.2, 0.01, q[0], 'rgba(0,0,0,0.2)', 0.008); }); } });
  def('stove', 1, 1.4, function (x) { gshadow(x, 0.45, 0.3); box(x, 0, 0.9, 0.35, 0.9, '#d8d8d8', '#c0c0c0'); E(x, -0.2, -1.07, 0.13, 0.06, '#303030'); E(x, 0.2, -1.07, 0.13, 0.06, '#303030'); RR(x, -0.35, -0.75, 0.7, 0.5, 0.04, '#a0a0a0', '#666', OL); });
  def('sink', 1, 1.2, function (x) { box(x, 0, 0.9, 0.4, 0.6, '#e8eef4', '#d0d8e0'); E(x, 0, -0.8, 0.3, 0.12, '#a8b8c8'); line(x, [[0, -0.95], [0, -1.15], [0.12, -1.15]], '#999', 0.04); });
  def('bathtub', 2, 1.4, function (x, o) { gshadow(x, 0.9, 0.3); RR(x, -0.95, -0.95, 1.9, 0.9, 0.3, vshade(x, -0.95, -0.05, '#f0f0f4'), '#a0a0a8', OL); RR(x, -0.82, -0.88, 1.64, 0.5, 0.22, o.water ? LG(x, 0, -0.88, 0, -0.4, ['#a8d0f0', '#6a98c8']) : '#d0d8e0'); });
  def('toilet', 1, 1.5, function (x) { gshadow(x, 0.3, 0.3); RR(x, -0.25, -1.2, 0.5, 0.45, 0.06, vshade(x, -1.2, -0.75, '#f4f4f4'), '#999', OL); E(x, 0, -0.55, 0.3, 0.2, '#fafafa', '#999', OL); E(x, 0, -0.56, 0.2, 0.12, '#d8e0e8'); RR(x, -0.15, -0.38, 0.3, 0.38, 0.06, '#eee', '#999', OL); });
  def('stall', 1, 2.1, function (x, o) { var c = C(o, 0, '#c8b8a8'); RR(x, -0.48, -1.95, 0.96, 1.85, 0.03, vshade(x, -1.95, 0, c), out(c), OL); P.ball(x, 0.3, -0.95, 0.04, 0.04, '#777'); if (o.num) { x.fillStyle = '#444'; x.font = 'bold 0.28px Georgia'; x.textAlign = 'center'; x.fillText(String(o.num), 0, -1.55); } if (o.occupied) RR(x, 0.2, -1.05, 0.2, 0.08, 0.02, '#c03030'); RR(x, -0.48, -0.1, 0.96, 0.1, 0, 'rgba(0,0,0,0.6)'); });
  def('locker', 1, 2.1, function (x, o) { var c = C(o, 0, '#5a7aa0'); box(x, 0, 0.92, 0.18, 1.85, P.sh(c, 0.2), c); line(x, [[0, -1.85], [0, 0]], P.sh(c, -0.35), 0.015); for (var i = 0; i < 3; i++) { RR(x, -0.36, -1.75 + i * 0.08, 0.26, 0.03, 0.01, P.sh(c, -0.3)); RR(x, 0.1, -1.75 + i * 0.08, 0.26, 0.03, 0.01, P.sh(c, -0.3)); } P.ball(x, -0.1, -1.0, 0.03, 0.03, '#ddd'); P.ball(x, 0.1, -1.0, 0.03, 0.03, '#ddd'); });
  def('schooldesk', 1, 1.4, function (x, o) { gshadow(x, 0.4, 0.3); RR(x, -0.35, -0.6, 0.05, 0.6, 0.01, '#707070'); RR(x, 0.3, -0.6, 0.05, 0.6, 0.01, '#707070'); box(x, 0, 0.85, 0.4, 0.08, '#d8b888', '#c8a878'); if (o.carved) { x.strokeStyle = '#6a4a2a'; x.lineWidth = 0.02; x.font = 'bold 0.12px monospace'; x.fillStyle = '#6a4a2a'; x.textAlign = 'center'; x.fillText('MUTE GIRL', 0, -0.78); } if (o.flower) { RR(x, -0.06, -1.05, 0.12, 0.2, 0.03, 'rgba(190,220,240,0.7)'); P.flower(x, 0, -1.12, 0.06, '#f0f0f0'); } });
  def('blackboard', 3, 1.6, function (x, o) { RR(x, -1.45, -1.55, 2.9, 1.25, 0.04, '#6a4a2a', '#3a2a10', OL); RR(x, -1.38, -1.48, 2.76, 1.1, 0.03, LG(x, 0, -1.48, 0, -0.38, ['#2c4a36', '#22402e'])); RR(x, -1.45, -0.36, 2.9, 0.08, 0.02, '#8a6a48'); x.globalAlpha = 0.3; P.blotches; x.globalAlpha = 1; if (o.text) { x.fillStyle = 'rgba(240,240,235,0.85)'; x.font = '0.18px "Comic Sans MS", cursive'; x.textAlign = 'center'; x.fillText(o.text, 0, -0.95); } });
  def('piano', 2, 1.6, function (x) { gshadow(x, 0.9, 0.3); RR(x, -0.95, -1.4, 1.9, 0.95, 0.04, vshade(x, -1.4, -0.45, '#1a1418'), '#000', OL); RR(x, -0.92, -0.5, 1.84, 0.18, 0.02, '#f4f4f0'); for (var i = 0; i < 13; i++) if (i % 7 !== 2 && i % 7 !== 6) RR(x, -0.88 + i * 0.14, -0.5, 0.07, 0.1, 0.01, '#111'); RR(x, -0.9, -0.32, 0.08, 0.32, 0.01, '#111'); RR(x, 0.82, -0.32, 0.08, 0.32, 0.01, '#111'); });
  def('clock', 1, 2.1, function (x, o, f, t) { gshadow(x, 0.3, 0.3); var c = C(o, 0, '#7a5a3a'); box(x, 0, 0.6, 0.15, 1.5, P.sh(c, 0.15), c); P.ball(x, 0, -1.65, 0.32, 0.32, P.sh(c, 0.1), { line: out(c), lw: OL }); E(x, 0, -1.65, 0.25, 0.25, '#f4ecd0', '#8a6a3a', OL); var hr = o.hour !== undefined ? o.hour : (t * 0.1) % 12, mn = o.min !== undefined ? o.min : (t * 2) % 60; line(x, [[0, -1.65], [Math.sin(hr / 12 * 6.28) * 0.14, -1.65 - Math.cos(hr / 12 * 6.28) * 0.14]], '#111', 0.03); line(x, [[0, -1.65], [Math.sin(mn / 60 * 6.28) * 0.2, -1.65 - Math.cos(mn / 60 * 6.28) * 0.2]], '#222', 0.02); var sw = Math.sin(t * 2.5) * 0.25; RR(x, -0.18, -1.2, 0.36, 0.95, 0.03, '#2a1a10'); line(x, [[0, -1.18], [Math.sin(sw) * 0.55, -1.18 + Math.cos(sw) * 0.55]], '#d8b040', 0.02); P.ball(x, Math.sin(sw) * 0.6, -1.18 + Math.cos(sw) * 0.6, 0.06, 0.06, '#e8c050'); }, { anim: true });
  def('wallclock', 1, 1.6, function (x, o, f, t) { var c = C(o, 0, '#303030'); P.ball(x, 0, -0.95, 0.3, 0.3, c); E(x, 0, -0.95, 0.25, 0.25, '#f4f0e0', '#555', OL); var hr = o.hour !== undefined ? o.hour : 3, mn = o.min !== undefined ? o.min : (t * 6) % 60; line(x, [[0, -0.95], [Math.sin(hr / 12 * 6.28) * 0.13, -0.95 - Math.cos(hr / 12 * 6.28) * 0.13]], '#111', 0.035); line(x, [[0, -0.95], [Math.sin(mn / 60 * 6.28) * 0.2, -0.95 - Math.cos(mn / 60 * 6.28) * 0.2]], '#333', 0.02); }, { anim: true });
  def('poleclock', 1, 3, function (x, o, f, t) { gshadow(x, 0.25, 0.3); RR(x, -0.05, -2.3, 0.1, 2.3, 0.02, '#303030'); x.save(); x.translate(0, -1.55); D.wallclock.fn(x, o, f, t); x.restore(); }, { anim: true });
  def('calendar', 1, 1.6, function (x, o) { RR(x, -0.3, -1.3, 0.6, 0.65, 0.02, '#f4f0e8', '#888', OL); RR(x, -0.3, -1.3, 0.6, 0.16, 0.02, '#c03030'); for (var j = 0; j < 3; j++) for (var i = 0; i < 5; i++) E(x, -0.22 + i * 0.11, -1.05 + j * 0.13, 0.025, 0.025, '#888'); if (o.circle) E(x, 0.11, -0.79, 0.06, 0.05, null, '#e03030', 0.018); line(x, [[0, -1.36], [0, -1.3]], '#555', 0.02); });
  def('poster', 1, 1.6, function (x, o) { RR(x, -0.36, -1.4, 0.72, 0.85, 0.02, C(o, 0, '#1a2040'), '#000', OL); var r = YN.rng.make(5); for (var i = 0; i < 14; i++) { var px = -0.3 + r.next() * 0.6, py = -1.33 + r.next() * 0.7; if (o.doors && i % 3 === 0) RR(x, px - 0.02, py - 0.04, 0.04, 0.07, 0.005, '#f8e070'); else E(x, px, py, 0.012, 0.012, '#fff8e0'); } E(x, 0.12, -1.18, 0.07, 0.07, C(o, 1, '#f0e070')); });
  def('frame', 1, 1.6, function (x, o) { RR(x, -0.34, -1.35, 0.68, 0.62, 0.02, '#8a6a3a', '#3a2a10', OL); RR(x, -0.28, -1.29, 0.56, 0.5, 0.01, C(o, 0, '#c8d0b8')); var n = o.people || 0; for (var i = 0; i < n; i++) { var px = -0.2 + i * (0.4 / Math.max(1, n - 1)); RR(x, px - 0.04, -1.05, 0.08, 0.22, 0.02, '#5a5050'); P.ball(x, px, -1.11, 0.04, 0.04, '#d8b8a0'); } if (o.scratched) RR(x, -0.28, -1.15, 0.56, 0.1, 0.01, '#e8e8e8'); });
  def('mirror', 1, 1.8, function (x, o) { RR(x, -0.36, -1.6, 0.72, 1.25, 0.05, '#8a7a5a', '#3a2a10', OL); var g = LG(x, -0.3, -1.55, 0.3, -0.4, ['#e8f0f8', '#a8b8cc', '#d0dce8']); RR(x, -0.3, -1.54, 0.6, 1.13, 0.04, g); line(x, [[-0.18, -1.4], [-0.05, -1.1]], 'rgba(255,255,255,0.7)', 0.03); });
  def('window', 1, 1.6, function (x, o, f, t) {
    var night = o.night, open = o.open;
    RR(x, -0.42, -1.45, 0.84, 0.9, 0.03, '#e8e0d0', '#7a7060', OL);
    var g = night ? LG(x, 0, -1.38, 0, -0.62, ['#0a0e24', '#1e2a50']) : LG(x, 0, -1.38, 0, -0.62, ['#7ab8f0', '#c8e4f8']);
    RR(x, -0.36, -1.38, 0.72, 0.78, 0.02, g);
    if (night) { E(x, 0.15, -1.2, 0.07, 0.07, '#f8f0c0'); [[-0.25, -1.3], [-0.1, -1.1], [0.25, -0.9], [-0.2, -0.85]].forEach(function (q) { E(x, q[0], q[1], 0.01, 0.01, '#fff'); }); }
    else { P.ball(x, -0.15, -1.15, 0.1, 0.05, '#ffffff', { hi: 0, lo: -0.05 }); }
    line(x, [[0, -1.38], [0, -0.6]], '#e8e0d0', 0.04); line(x, [[-0.36, -1.0], [0.36, -1.0]], '#e8e0d0', 0.04);
    if (open) { poly(x, [[-0.36, -1.38], [-0.55, -1.32], [-0.55, -0.66], [-0.36, -0.6]], 'rgba(220,235,250,0.5)', '#7a7060', OL); var sw = Math.sin(t * 2) * 0.04; poly(x, [[0.36, -1.42], [0.5 + sw, -1.3], [0.48 + sw * 2, -0.5], [0.36, -0.55]], 'rgba(240,240,250,0.85)'); }
    else RR(x, -0.42, -0.62, 0.84, 0.06, 0.02, '#d0c8b8');
  }, { anim: true, wall: true });
  def('curtain', 1, 2.2, function (x, o, f, t) { var c = C(o, 0, '#8a3040'); for (var i = 0; i < 4; i++) { var sw = Math.sin(t + i) * 0.02; poly(x, [[-0.45 + i * 0.23, -2.0], [-0.22 + i * 0.23, -2.0], [-0.2 + i * 0.23 + sw, 0], [-0.47 + i * 0.23 + sw, 0]], vshade(x, -2, 0, i % 2 ? c : P.sh(c, 0.12))); } RR(x, -0.5, -2.08, 1.0, 0.1, 0.03, '#c8a040'); }, { anim: true });
  def('switch', 1, 1.4, function (x, o) { RR(x, -0.1, -1.0, 0.2, 0.3, 0.03, '#ece8e0', '#9a968c', OL); RR(x, -0.04, o.on ? -0.97 : -0.85, 0.08, 0.12, 0.02, '#c8c4bc'); });
  def('arcade', 1, 2.3, function (x, o, f, t) {
    gshadow(x, 0.45, 0.32); var c = C(o, 0, '#3a2a6a');
    poly(x, [[-0.45, 0], [-0.45, -1.4], [-0.4, -2.05], [0.4, -2.05], [0.45, -1.4], [0.45, 0]], vshade(x, -2.05, 0, c), out(c), OL);
    RR(x, -0.42, -2.18, 0.84, 0.2, 0.04, LG(x, -0.4, 0, 0.4, 0, ['#f04080', '#f0c040', '#40c0f0']));
    RR(x, -0.33, -1.85, 0.66, 0.5, 0.04, '#0a0a14', '#000', OL);
    var cols = ['#f04060', '#f0c040', '#40c060', '#4080f0'];
    for (var i = 0; i < 4; i++) for (var j = 0; j < 2; j++) P.ball(x, -0.2 + i * 0.13, -1.7 + j * 0.18, 0.045, 0.045, cols[(i + j + Math.floor(t * 2)) % 4], { hi: 0.4 });
    box(x, 0, 0.84, 0.25, 0.1, P.sh(c, 0.2), P.sh(c, -0.2));
    P.ball(x, -0.2, -1.3, 0.05, 0.05, '#e03030'); P.ball(x, 0.1, -1.28, 0.04, 0.04, '#3070e0'); P.ball(x, 0.22, -1.27, 0.04, 0.04, '#e0c030');
  }, { anim: true });
  def('slot', 1, 2.2, function (x, o, f, t) { gshadow(x, 0.4, 0.3); poly(x, [[-0.42, 0], [-0.42, -1.85], [0.42, -1.85], [0.42, 0]], vshade(x, -1.9, 0, '#a01828'), '#400810', OL); RR(x, -0.45, -2.05, 0.9, 0.24, 0.08, LG(x, 0, -2.05, 0, -1.8, ['#f8e070', '#c89020'])); RR(x, -0.32, -1.6, 0.64, 0.4, 0.04, '#f8f8f0', '#555', OL); var sy = ['7', '♥', '★']; x.font = 'bold 0.22px Georgia'; x.textAlign = 'center'; for (var i = 0; i < 3; i++) { x.fillStyle = ['#e03030', '#30a030', '#3050e0'][(i + Math.floor(t * 3)) % 3]; x.fillText(sy[(i + Math.floor(t * 3)) % 3], -0.2 + i * 0.2, -1.33); } line(x, [[0.42, -1.4], [0.55, -1.4], [0.55, -1.75]], '#999', 0.04); P.ball(x, 0.55, -1.8, 0.06, 0.06, '#e03030'); }, { anim: true });
  def('roulette', 2, 1.4, function (x, o, f, t) { gshadow(x, 0.95, 0.3); box(x, 0, 1.9, 0.75, 0.35, '#1a6a3a', '#4a3020'); E(x, -0.45, -0.75, 0.32, 0.18, '#4a2a10'); E(x, -0.45, -0.77, 0.27, 0.15, '#c8a040'); for (var i = 0; i < 12; i++) { var a = i / 12 * 6.28 + t * 0.8; E(x, -0.45 + Math.cos(a) * 0.21, -0.77 + Math.sin(a) * 0.11, 0.025, 0.018, i % 2 ? '#c02020' : '#111'); } for (var j = 0; j < 6; j++) RR(x, 0.05 + j * 0.13, -1.0, 0.1, 0.5, 0.01, j % 2 ? '#c02020' : '#111'); }, { anim: true });
  def('cardtable', 2, 1.4, function (x) { gshadow(x, 0.95, 0.3); box(x, 0, 1.9, 0.75, 0.35, '#1a5a3a', '#4a3020'); [[-0.5, '#c02020'], [-0.25, '#111']].forEach(function (q) { RR(x, q[0], -0.95, 0.2, 0.28, 0.02, '#f8f8f0', '#888', OL); E(x, q[0] + 0.1, -0.82, 0.03, 0.03, q[1]); }); for (var i = 0; i < 4; i++) E(x, 0.4, -0.75 - i * 0.03, 0.1, 0.035, '#e0c040', '#8a6a10', 0.008); });
  def('dollhouse', 2, 2.2, function (x, o, f, t) { gshadow(x, 0.9, 0.3); box(x, 0, 1.7, 0.2, 1.1, '#e8d8c0', '#e0d0b8'); poly(x, [[-0.95, -1.3], [0, -2.05], [0.95, -1.3]], vshade(x, -2.05, -1.3, '#a04040'), '#501818', OL); [[-0.5, -0.95], [0.5, -0.95], [-0.5, -0.5]].forEach(function (q, i) { RR(x, q[0] - 0.17, q[1] - 0.15, 0.34, 0.26, 0.02, i === 2 && Math.floor(t) % 2 ? '#f8e8a0' : '#90b8e0', '#5a4a3a', OL); }); RR(x, 0.3, -0.55, 0.25, 0.55, 0.02, '#6a4a2a'); }, { anim: true });
  def('toybox', 1, 1, function (x) { gshadow(x, 0.42, 0.3); box(x, 0, 0.85, 0.3, 0.45, '#e07070', '#c05050'); P.ball(x, -0.2, -0.88, 0.1, 0.1, '#f0d040'); RR(x, 0.05, -0.95, 0.2, 0.15, 0.02, '#40a0e0'); });
  def('plush', 1, 1, function (x, o) { var c = C(o, 0, '#e8d8c8'); gshadow(x, 0.25, 0.3); P.ball(x, 0, -0.22, 0.2, 0.18, c); P.ball(x, 0, -0.5, 0.15, 0.13, c); [-1, 1].forEach(function (k) { E(x, k * 0.08, -0.72, 0.04, 0.12, c, out(c), OL); }); E(x, -0.05, -0.52, 0.018, 0.022, '#222'); E(x, 0.05, -0.52, 0.018, 0.022, '#222'); if (o.dust) { x.fillStyle = 'rgba(160,150,140,0.5)'; x.fillRect(-0.3, -0.85, 0.6, 0.85); } });
  def('doll', 1, 1.4, function (x, o) { gshadow(x, 0.2, 0.3); poly(x, [[-0.15, -0.6], [0.15, -0.6], [0.22, -0.12], [-0.22, -0.12]], C(o, 0, '#d05080')); P.ball(x, 0, -0.78, 0.15, 0.15, '#f8e0d0'); poly(x, [[-0.17, -0.8], [-0.15, -0.98, 0, -0.98], [0.15, -0.98, 0.17, -0.8], [0.18, -0.6], [0.1, -0.75], [-0.1, -0.75], [-0.18, -0.6]], C(o, 1, '#d0a040')); E(x, -0.05, -0.77, 0.022, 0.022, '#3050a0'); E(x, 0.05, -0.77, 0.022, 0.022, '#3050a0'); });
  def('crate', 1, 1, function (x) { gshadow(x, 0.42, 0.3); box(x, 0, 0.8, 0.3, 0.55, '#b48c5a', '#9a7448'); line(x, [[-0.4, -0.27], [0.4, -0.27]], '#6e5234', 0.03); line(x, [[-0.35, -0.5], [0.35, -0.05]], '#6e5234', 0.03); });
  def('plank', 1, 1, function (x) { gshadow(x, 0.42, 0.3); poly(x, [[-0.42, -0.12], [0.4, -0.2], [0.42, -0.06], [-0.4, 0.02]], vshade(x, -0.2, 0, '#a07a4a'), '#5a4028', OL); line(x, [[-0.3, -0.08], [0.3, -0.13]], 'rgba(90,60,30,0.5)', 0.012); });
  def('barrel', 1, 1.2, function (x) { gshadow(x, 0.38, 0.3); RR(x, -0.34, -0.9, 0.68, 0.9, 0.2, LG(x, -0.34, 0, 0.34, 0, ['#7a4a28', '#a8743a', '#6a3a1a']), '#3a1a08', OL); [-0.75, -0.18].forEach(function (yy) { RR(x, -0.35, yy, 0.7, 0.05, 0.01, '#555'); }); E(x, 0, -0.9, 0.3, 0.08, '#8a5a30'); });
  def('trash', 1, 1.2, function (x) { gshadow(x, 0.32, 0.3); poly(x, [[-0.3, -0.85], [0.3, -0.85], [0.25, 0], [-0.25, 0]], vshade(x, -0.85, 0, '#6a7a6a'), '#2a3a2a', OL); RR(x, -0.34, -0.95, 0.68, 0.12, 0.04, '#8a9a8a'); for (var i = -1; i <= 1; i++) line(x, [[i * 0.12, -0.75], [i * 0.1, -0.1]], 'rgba(0,0,0,0.25)', 0.02); });
  def('vending', 1, 2.2, function (x, o, f, t) { gshadow(x, 0.45, 0.3); var c = C(o, 0, '#c02830'); box(x, 0, 0.9, 0.2, 1.9, P.sh(c, 0.2), c); RR(x, -0.38, -1.8, 0.5, 1.15, 0.03, LG(x, 0, -1.8, 0, -0.65, ['#e8f6ff', '#b8d8e8'])); for (var j = 0; j < 4; j++) for (var i = 0; i < 3; i++) RR(x, -0.33 + i * 0.15, -1.72 + j * 0.27, 0.1, 0.18, 0.03, ['#f04040', '#40a0f0', '#f0d040', '#60c060'][(i + j) % 4]); RR(x, 0.18, -1.5, 0.18, 0.3, 0.02, '#333'); RR(x, -0.35, -0.45, 0.5, 0.2, 0.02, '#111'); var g = x.createRadialGradient(0, -1.2, 0, 0, -1.2, 1); g.addColorStop(0, 'rgba(200,240,255,0.15)'); g.addColorStop(1, 'rgba(200,240,255,0)'); x.fillStyle = g; x.fillRect(-1, -2.2, 2, 2); });
  def('ticketmachine', 1, 2, function (x, o, f, t) { gshadow(x, 0.4, 0.3); box(x, 0, 0.85, 0.18, 1.75, '#7a8a9a', '#5a6a7a'); RR(x, -0.32, -1.6, 0.64, 0.4, 0.03, (Math.floor(t * 2) % 2) ? '#70d0f0' : '#50b0d0'); for (var i = 0; i < 9; i++) P.ball(x, -0.2 + (i % 3) * 0.2, -1.05 + Math.floor(i / 3) * 0.15, 0.04, 0.04, '#ddd'); RR(x, -0.25, -0.5, 0.5, 0.08, 0.02, '#222'); }, { anim: true });
  def('board', 3, 2.6, function (x, o, f, t) { RR(x, -0.05, -1.0, 0.1, 1.0, 0.02, '#333'); RR(x, -1.4, -2.4, 2.8, 1.4, 0.06, '#151515', '#000', OL); RR(x, -1.32, -2.32, 2.64, 1.24, 0.04, '#080808'); var lines = o.lines || ['--:--', '--:--', '--:--']; x.font = 'bold 0.22px "Courier New", monospace'; x.textAlign = 'left'; for (var i = 0; i < Math.min(4, lines.length); i++) { x.fillStyle = (o.color || '#f0a020'); x.globalAlpha = (Math.floor(t * 2 + i) % 7) ? 1 : 0.4; x.fillText(lines[i], -1.22, -2.05 + i * 0.3); } x.globalAlpha = 1; }, { anim: true });
  def('pillar', 1, 3.2, function (x, o) { var c = C(o, 0, '#c8c0b0'); gshadow(x, 0.42, 0.3); RR(x, -0.4, -0.22, 0.8, 0.22, 0.03, vshade(x, -0.2, 0, P.sh(c, -0.1)), out(c), OL); RR(x, -0.3, -2.75, 0.6, 2.55, 0.03, LG(x, -0.3, 0, 0.3, 0, [P.sh(c, 0.15), c, P.sh(c, -0.25)]), out(c), OL); for (var i = -2; i <= 2; i++) line(x, [[i * 0.1, -2.7], [i * 0.1, -0.25]], 'rgba(0,0,0,0.12)', 0.015); RR(x, -0.42, -3.0, 0.84, 0.28, 0.04, vshade(x, -3, -2.72, P.sh(c, 0.1)), out(c), OL); });
  def('turnstile', 1, 1.2, function (x, o) { gshadow(x, 0.4, 0.3); box(x, -0.3, 0.16, 0.2, 0.7, '#a0a8b0', '#808890'); box(x, 0.3, 0.16, 0.2, 0.7, '#a0a8b0', '#808890'); line(x, [[-0.22, -0.6], [0.22, -0.6]], '#c8d0d8', 0.04); P.ball(x, -0.3, -0.85, 0.035, 0.035, o.open ? '#40e060' : '#e04040'); });
  def('train', 4, 2.2, function (x, o, f, t) { gshadow(x, 1.9, 0.35); var c = C(o, 0, '#4a6a8a'); RR(x, -1.95, -1.9, 3.9, 1.65, 0.16, vshade(x, -1.9, -0.25, c), out(c), OL); RR(x, -1.95, -2.0, 3.9, 0.18, 0.08, P.sh(c, 0.25)); for (var i = 0; i < 6; i++) RR(x, -1.75 + i * 0.6, -1.65, 0.45, 0.55, 0.06, o.dark ? '#101418' : LG(x, 0, -1.65, 0, -1.1, ['#e8f0f8', '#a8c0d8']), '#203040', OL); RR(x, -1.95, -0.85, 3.9, 0.12, 0.02, P.sh(c, -0.3)); [-1.4, -0.9, 0.9, 1.4].forEach(function (q) { P.ball(x, q, -0.18, 0.14, 0.14, '#222', { lo: -0.1 }); }); });
  def('platformedge', 1, 1, function (x) { RR(x, -0.5, -0.3, 1.0, 0.3, 0, '#e8c030'); for (var i = 0; i < 4; i++) poly(x, [[-0.5 + i * 0.25, -0.3], [-0.38 + i * 0.25, -0.3], [-0.5 + i * 0.25 + 0.25, 0], [-0.5 + i * 0.25 + 0.13, 0]], '#202020'); });
  def('escalator', 2, 3.2, function (x, o, f, t) { RR(x, -0.95, -3.1, 1.9, 3.1, 0.05, '#a0a8b0', '#505860', OL); RR(x, -0.75, -3.05, 1.5, 3.0, 0.03, '#404850'); for (var i = 0; i < 14; i++) RR(x, -0.72, -3.0 + U.mod(i * 0.22 + t * 0.4, 3.0), 1.44, 0.04, 0, '#909aa4'); RR(x, -0.95, -3.1, 0.12, 3.1, 0.04, '#c8a040'); RR(x, 0.83, -3.1, 0.12, 3.1, 0.04, '#c8a040'); }, { anim: true });
  def('chandelier', 2, 1.6, function (x, o, f, t) { line(x, [[0, -1.6], [0, -1.05]], '#c8a040', 0.03); E(x, 0, -0.95, 0.7, 0.12, null, '#c8a040', 0.03); for (var i = 0; i < 9; i++) { var px = -0.65 + i * 0.163, h = 0.25 + (i % 2) * 0.15; line(x, [[px, -0.95], [px, -0.95 + h]], 'rgba(240,230,200,0.8)', 0.012); P.ball(x, px, -0.95 + h, 0.03, 0.045, '#fff8d8', { hi: 0.4 }); } var g = x.createRadialGradient(0, -0.9, 0, 0, -0.9, 0.9); g.addColorStop(0, 'rgba(255,240,200,' + (0.25 + 0.05 * Math.sin(t * 3)) + ')'); g.addColorStop(1, 'rgba(255,240,200,0)'); x.fillStyle = g; x.fillRect(-1, -1.6, 2, 1.6); }, { anim: true });
  def('mural', 4, 2.8, function (x, o) {
    RR(x, -1.95, -2.7, 3.9, 2.5, 0.04, '#c8a040', '#6a5010', OL);
    RR(x, -1.85, -2.6, 3.7, 2.3, 0.02, LG(x, 0, -2.6, 0, -0.3, ['#f0a050', '#f8d8a0', '#e8d0a0']));
    P.ball(x, 0, -2.0, 0.35, 0.35, '#f8d040', { hi: 0.2, lo: -0.05 });
    for (var r = 0; r < 12; r++) { var a = r / 12 * 6.28; line(x, [[Math.cos(a) * 0.42, -2.0 + Math.sin(a) * 0.42], [Math.cos(a) * 0.7, -2.0 + Math.sin(a) * 0.7]], 'rgba(248,200,60,0.6)', 0.04); }
    var ppl = [[-1.4, '#3050a0'], [-0.75, '#c03040'], [0, '#30704a'], [0.75, '#c03040'], [1.4, '#3050a0']];
    ppl.forEach(function (p, i) { var h = i === 2 ? 0.75 : 0.95; RR(x, p[0] - 0.17, -0.35 - h, 0.34, h, 0.06, vshade(x, -0.35 - h, -0.35, p[1]), out(p[1]), OL); P.ball(x, p[0], -0.48 - h, 0.15, 0.15, '#f0c8a0'); if (o.scratched === i) { RR(x, p[0] - 0.2, -0.66 - h, 0.4, 0.36, 0.04, '#a8a090'); for (var k = 0; k < 6; k++) line(x, [[p[0] - 0.18 + k * 0.07, -0.65 - h], [p[0] - 0.12 + k * 0.06, -0.32 - h]], '#7a7060', 0.015); } else { E(x, p[0] - 0.05, -0.5 - h, 0.018, 0.018, '#111'); E(x, p[0] + 0.05, -0.5 - h, 0.018, 0.018, '#111'); poly(x, [[p[0] - 0.06, -0.44 - h], [p[0], -0.4 - h], [p[0] + 0.06, -0.44 - h]], null, '#c03030', 0.02); } });
  }, { wall: true });
  def('loudspeaker', 1, 2.4, function (x, o, f, t) { gshadow(x, 0.2, 0.3); RR(x, -0.04, -1.6, 0.08, 1.6, 0.02, '#606060'); poly(x, [[-0.1, -1.8], [-0.4, -2.15], [-0.4, -1.45]], '#9aa0a0', '#404444', OL); poly(x, [[0.1, -1.8], [0.4, -2.15], [0.4, -1.45]], '#9aa0a0', '#404444', OL); if (Math.floor(t * 3) % 2) { [0.5, 0.6].forEach(function (r) { x.strokeStyle = 'rgba(220,220,220,0.4)'; x.lineWidth = 0.02; x.beginPath(); x.arc(0.3, -1.8, r, -0.6, 0.6); x.stroke(); }); } }, { anim: true });
  def('newsstand', 2, 2.2, function (x, o) { gshadow(x, 0.95, 0.3); box(x, 0, 1.9, 0.3, 1.1, '#7a5a40', '#5a4030'); RR(x, -1.0, -2.05, 2.0, 0.28, 0.04, '#c03030', '#601010', OL); for (var i = 0; i < 4; i++) { var px = -0.85 + i * 0.44; RR(x, px, -1.75, 0.36, 0.5, 0.01, '#f0ece0', '#888', 0.008); line(x, [[px + 0.04, -1.68], [px + 0.32, -1.68]], '#222', 0.03); for (var k = 0; k < 3; k++) { if (o.redacted && k === 1) RR(x, px + 0.04, -1.58 + k * 0.09, 0.28, 0.05, 0, '#111'); else line(x, [[px + 0.04, -1.56 + k * 0.09], [px + 0.3, -1.56 + k * 0.09]], '#999', 0.012); } } });
  def('sign', 1, 1.6, function (x, o) { gshadow(x, 0.2, 0.3); RR(x, -0.04, -0.85, 0.08, 0.85, 0.02, '#6a4a2a'); var c = C(o, 0, '#e8dcc0'); RR(x, -0.42, -1.4, 0.84, 0.58, 0.04, vshade(x, -1.4, -0.82, c), out(c), OL); for (var i = 0; i < 3; i++) line(x, [[-0.3, -1.25 + i * 0.13], [0.3 - (i % 2) * 0.15, -1.25 + i * 0.13]], '#6a5a4a', 0.02); });
  def('plaque', 1, 1.4, function (x, o) { var c = C(o, 0, '#a08040'); RR(x, -0.35, -1.1, 0.7, 0.45, 0.05, vshade(x, -1.1, -0.65, c), out(c), OL); for (var i = 0; i < 2; i++) line(x, [[-0.22, -0.95 + i * 0.13], [0.22, -0.95 + i * 0.13]], P.sh(c, -0.4), 0.025); });
  def('glyphstone', 1, 2, function (x, o) { gshadow(x, 0.4, 0.35); var c = C(o, 0, '#6a6a70'); poly(x, [[-0.38, 0], [-0.4, -1.5], [-0.25, -1.75], [0.25, -1.75], [0.4, -1.5], [0.38, 0]], vshade(x, -1.75, 0, c), out(c), OL); var txt = (o.text || 'abcdefgh').replace(/[^a-z]/g, ''); x.save(); x.translate(-0.25, -1.55); for (var i = 0; i < Math.min(16, txt.length); i++) { var gx = (i % 3) * 0.17, gy = Math.floor(i / 3) * 0.26; x.save(); x.translate(gx, gy); x.scale(0.012, 0.012); if (YN.lang) YN.lang.drawGlyph(x, txt[i], 0, 0, 14, 'rgba(30,25,35,0.85)'); x.restore(); } x.restore(); });
  def('statue', 1.2, 2.8, function (x, o) {
    gshadow(x, 0.55, 0.38); var c = C(o, 0, '#a8a8a0');
    box(x, 0, 1.0, 0.25, 0.55, P.sh(c, 0.1), P.sh(c, -0.15));
    x.save(); x.translate(0, -0.8);
    poly(x, [[-0.22, 0], [-0.3, -0.75], [-0.18, -1.05], [0.18, -1.05], [0.3, -0.75], [0.22, 0]], LG(x, -0.3, 0, 0.3, 0, [P.sh(c, 0.18), c, P.sh(c, -0.25)]), out(c), OL);
    poly(x, [[-0.12, -0.75], [0, -0.62], [0.12, -0.75], [0.06, -0.85], [-0.06, -0.85]], P.sh(c, 0.12), out(c), OL);
    P.ball(x, 0, -1.25, 0.17, 0.19, P.sh(c, 0.05), { line: out(c), lw: OL });
    poly(x, [[-0.18, -1.25], [-0.2, -1.48, 0, -1.48], [0.2, -1.48, 0.18, -1.25], [0.2, -1.05], [-0.2, -1.05]], P.sh(c, -0.08), out(c), OL);
    E(x, -0.06, -1.25, 0.03, 0.01, P.sh(c, -0.3)); E(x, 0.06, -1.25, 0.03, 0.01, P.sh(c, -0.3));
    if (o.tears) { line(x, [[-0.06, -1.23], [-0.065, -1.1]], 'rgba(140,200,255,0.9)', 0.02); }
    x.restore();
    x.fillStyle = P.sh(c, -0.45); x.font = 'bold 0.08px Georgia'; x.textAlign = 'center'; x.fillText('IN MEMORY', 0, -0.32); x.fillText('OF MUM', 0, -0.2);
    if (o.flowers) { [-0.4, -0.25, 0.25, 0.42].forEach(function (k, i) { P.flower(x, k, -0.06, 0.07, ['#f070a0', '#f8e070', '#ffffff', '#f070a0'][i]); }); }
  });
  def('fountain', 2, 2, function (x, o, f, t) { gshadow(x, 0.95, 0.3); E(x, 0, -0.3, 0.9, 0.35, vshade(x, -0.6, 0, '#a8a8a0'), '#5a5a54', OL); E(x, 0, -0.38, 0.75, 0.25, LG(x, 0, -0.6, 0, -0.1, ['#8ac0e8', '#4a88c0'])); RR(x, -0.12, -1.3, 0.24, 0.95, 0.05, vshade(x, -1.3, -0.35, '#b8b8b0'), '#5a5a54', OL); E(x, 0, -1.3, 0.3, 0.1, '#b8b8b0', '#5a5a54', OL); for (var i = 0; i < 8; i++) { var ph = U.mod(t + i * 0.13, 1); E(x, Math.cos(i) * 0.25 * ph, -1.4 - Math.sin(ph * Math.PI) * 0.3 + ph * 0.9, 0.02, 0.03, 'rgba(220,240,255,' + (1 - ph) + ')'); } }, { anim: true });
  def('well', 2, 2, function (x) { gshadow(x, 0.85, 0.3); E(x, 0, -0.5, 0.75, 0.3, '#101418'); RR(x, -0.78, -0.55, 1.56, 0.55, 0.2, vshade(x, -0.55, 0, '#8a8a80'), '#4a4a44', OL); RR(x, -0.7, -1.7, 0.08, 1.2, 0.02, '#6a4a2a'); RR(x, 0.62, -1.7, 0.08, 1.2, 0.02, '#6a4a2a'); poly(x, [[-0.95, -1.6], [0, -2.0], [0.95, -1.6], [0.85, -1.55], [0, -1.88], [-0.85, -1.55]], '#8a3a2a', '#401810', OL); });
  def('gate', 2, 2, function (x, o) { var c = C(o, 0, '#4a4a50'); RR(x, -0.95, -1.8, 0.12, 1.8, 0.03, vshade(x, -1.8, 0, c), '#111', OL); RR(x, 0.83, -1.8, 0.12, 1.8, 0.03, vshade(x, -1.8, 0, c), '#111', OL); P.ball(x, -0.89, -1.85, 0.07, 0.07, c); P.ball(x, 0.89, -1.85, 0.07, 0.07, c); if (!o.open) { for (var i = 0; i < 9; i++) line(x, [[-0.75 + i * 0.19, -0.05], [-0.75 + i * 0.19, -1.55 - Math.sin(i / 8 * Math.PI) * 0.15]], c, 0.035); line(x, [[-0.85, -0.5], [0.85, -0.5]], c, 0.04); line(x, [[-0.85, -1.3], [0.85, -1.3]], c, 0.04); E(x, 0, -0.95, 0.09, 0.09, '#d8b040', '#6a5010', OL); } });
  def('fence', 1, 1.2, function (x, o) { var c = C(o, 0, '#8a7050'); [-0.35, 0.35].forEach(function (k) { RR(x, k - 0.05, -0.85, 0.1, 0.85, 0.03, vshade(x, -0.85, 0, c), out(c), OL); }); RR(x, -0.5, -0.7, 1.0, 0.08, 0.02, c, out(c), OL); RR(x, -0.5, -0.4, 1.0, 0.08, 0.02, c, out(c), OL); });
  def('pedestal', 1, 1.6, function (x, o, f, t) { gshadow(x, 0.4, 0.3); var c = C(o, 0, '#c8c0d8'); RR(x, -0.25, -0.75, 0.5, 0.7, 0.03, vshade(x, -0.75, 0, c), out(c), OL); E(x, 0, -0.78, 0.35, 0.1, P.sh(c, 0.15), out(c), OL); RR(x, -0.38, -0.08, 0.76, 0.08, 0.02, P.sh(c, -0.2)); if (o.glow) { var g = x.createRadialGradient(0, -1.05, 0, 0, -1.05, 0.35); g.addColorStop(0, 'rgba(255,240,200,' + (0.6 + 0.3 * Math.sin(t * 3)) + ')'); g.addColorStop(1, 'rgba(255,240,200,0)'); x.fillStyle = g; x.fillRect(-0.4, -1.45, 0.8, 0.8); } }, { anim: true });
  def('egg', 1, 1, function (x, o) { gshadow(x, 0.22, 0.3); P.ball(x, 0, -0.28, 0.17, 0.23, C(o, 0, '#f0ece0'), { hi: 0.3 }); if (o.mark) E(x, 0, -0.3, 0.05, 0.05, o.mark); });
  def('cookiejar', 1, 1.2, function (x, o) { gshadow(x, 0.3, 0.3); RR(x, -0.28, -0.72, 0.56, 0.7, 0.14, 'rgba(200,230,240,0.55)', 'rgba(100,130,150,0.8)', OL); RR(x, -0.24, -0.84, 0.48, 0.14, 0.04, '#c08040', '#6a4010', OL); P.ball(x, 0, -0.9, 0.05, 0.04, '#c08040'); if (!o.empty) { [[-0.08, -0.25], [0.1, -0.3], [0, -0.45]].forEach(function (q) { P.ball(x, q[0], q[1], 0.11, 0.09, '#c8904a', { hi: 0.25 }); E(x, q[0] - 0.03, q[1] - 0.01, 0.015, 0.012, '#5a3a1a'); E(x, q[0] + 0.03, q[1] + 0.02, 0.015, 0.012, '#5a3a1a'); }); } line(x, [[-0.2, -0.65], [-0.18, -0.2]], 'rgba(255,255,255,0.6)', 0.025); });
  def('cookie', 1, 1, function (x) { P.ball(x, 0, -0.15, 0.17, 0.12, '#c8904a', { hi: 0.25 }); [[-0.06, -0.17], [0.05, -0.12], [0.02, -0.2]].forEach(function (q) { E(x, q[0], q[1], 0.02, 0.016, '#5a3a1a'); }); });
  def('glass', 1, 1, function (x) { RR(x, -0.1, -0.55, 0.2, 0.42, 0.03, 'rgba(210,235,250,0.6)', 'rgba(120,150,170,0.8)', OL); RR(x, -0.09, -0.36, 0.18, 0.22, 0.02, 'rgba(140,190,230,0.75)'); line(x, [[-0.06, -0.52], [-0.06, -0.2]], 'rgba(255,255,255,0.8)', 0.015); });
  def('candle', 1, 1, function (x, o, f, t) { RR(x, -0.07, -0.5, 0.14, 0.45, 0.02, vshade(x, -0.5, 0, '#f0e8d0'), '#a09070', OL); var fl = Math.sin(t * 9) * 0.01; poly(x, [[0, -0.75 + fl], [0.04, -0.58], [0, -0.52], [-0.04, -0.58]], '#ffcc40'); E(x, 0, -0.58, 0.015, 0.03, '#fff'); var g = x.createRadialGradient(0, -0.6, 0, 0, -0.6, 0.35); g.addColorStop(0, 'rgba(255,200,100,0.35)'); g.addColorStop(1, 'rgba(255,200,100,0)'); x.fillStyle = g; x.fillRect(-0.4, -1, 0.8, 0.8); }, { anim: true });
  def('cake', 1, 1.2, function (x, o, f, t) { gshadow(x, 0.38, 0.3); box(x, 0, 0.7, 0.2, 0.3, '#ffffff', '#f0d0d8', { r: 0.08 }); for (var i = 0; i < 4; i++) { var px = -0.24 + i * 0.16; RR(x, px - 0.015, -0.72, 0.03, 0.2, 0.01, '#80c0ff'); poly(x, [[px, -0.8 + Math.sin(t * 8 + i) * 0.01], [px + 0.02, -0.73], [px - 0.02, -0.73]], '#ffcc40'); } }, { anim: true });
  def('musicbox', 1, 1, function (x, o, f, t) { gshadow(x, 0.32, 0.3); box(x, 0, 0.6, 0.25, 0.3, '#b08058', '#8a5a3a'); poly(x, [[-0.3, -0.55], [0.3, -0.55], [0.25, -0.8], [-0.25, -0.8]], '#c89068', '#5a3a1a', OL); P.ball(x, 0, -0.62, 0.07, 0.07, '#e8c060'); if (Math.floor(t * 2) % 2) { E(x, 0.3, -0.95, 0.03, 0.022, '#fff'); line(x, [[0.325, -0.95], [0.325, -1.05]], '#fff', 0.012); } }, { anim: true });
  def('chime', 1, 1.8, function (x, o, f, t) { line(x, [[0, -1.6], [0, -1.45]], '#555', 0.015); RR(x, -0.25, -1.47, 0.5, 0.05, 0.02, '#8a6a3a'); for (var i = 0; i < 5; i++) { var sw = Math.sin(t * 2 + i * 1.3) * 0.04, px = -0.2 + i * 0.1; line(x, [[px, -1.43], [px + sw, -1.0 + i * 0.03]], 'rgba(120,120,120,0.6)', 0.008); RR(x, px + sw - 0.02, -1.0 + i * 0.03, 0.04, 0.3 - i * 0.03, 0.02, LG(x, px, 0, px + 0.04, 0, ['#e8e8f0', '#a8a8b8'])); } }, { anim: true });
  def('phone', 1, 1, function (x, o, f, t) { var ring = o.ringing && Math.floor(t * 8) % 2, c = C(o, 0, '#c03030'); x.save(); if (ring) x.rotate(0.06); gshadow(x, 0.3, 0.3); RR(x, -0.28, -0.4, 0.56, 0.36, 0.08, vshade(x, -0.4, 0, c), out(c), OL); RR(x, -0.34, -0.55, 0.68, 0.16, 0.08, P.sh(c, 0.1), out(c), OL); E(x, 0, -0.22, 0.12, 0.12, '#f0f0f0', '#888', OL); x.restore(); }, { anim: true });
  def('payphone', 1, 2.2, function (x) { gshadow(x, 0.38, 0.3); RR(x, -0.05, -0.6, 0.1, 0.6, 0.02, '#555'); RR(x, -0.4, -1.9, 0.8, 1.35, 0.06, vshade(x, -1.9, -0.55, '#3a5a8a'), '#102040', OL); RR(x, -0.3, -1.75, 0.6, 0.95, 0.03, '#d8d8d0'); RR(x, -0.25, -1.65, 0.16, 0.7, 0.05, '#222'); for (var i = 0; i < 9; i++) P.ball(x, 0.02 + (i % 3) * 0.1, -1.55 + Math.floor(i / 3) * 0.13, 0.035, 0.035, '#666'); });
  def('mailbox', 1, 1.6, function (x, o) { gshadow(x, 0.3, 0.3); RR(x, -0.05, -0.75, 0.1, 0.75, 0.02, '#555'); var c = C(o, 0, '#d8b030'); RR(x, -0.32, -1.3, 0.64, 0.58, 0.18, vshade(x, -1.3, -0.72, c), out(c), OL); RR(x, -0.2, -1.05, 0.4, 0.05, 0.02, '#333'); if (o.flag) { RR(x, 0.32, -1.4, 0.05, 0.35, 0.01, '#d03030'); RR(x, 0.32, -1.4, 0.18, 0.12, 0.01, '#d03030'); } });
  def('door', 1, 1.9, function (x, o) {
    var st = o.style || 'wood', c = C(o, 0, st === 'metal' ? '#7a8088' : st === 'glass' ? '#9ab8d0' : st === 'red' ? '#a02838' : st === 'shoji' ? '#f0e8d8' : '#7a5232');
    RR(x, -0.46, -1.78, 0.92, 1.78, 0.04, P.sh(c, -0.45));
    if (o.ajar) { RR(x, -0.4, -1.72, 0.8, 1.72, 0.02, '#050505'); poly(x, [[0.4, -1.72], [0.2, -1.6], [0.2, -0.1], [0.4, 0]], vshade(x, -1.7, 0, c), out(c), OL); return; }
    RR(x, -0.4, -1.72, 0.8, 1.72, 0.03, vshade(x, -1.72, 0, c), out(c), OL);
    if (st === 'glass') { RR(x, -0.3, -1.6, 0.6, 0.85, 0.03, LG(x, -0.3, -1.6, 0.3, -0.75, ['#e8f4fc', '#a8c8e0'])); line(x, [[-0.15, -1.5], [-0.05, -1.0]], 'rgba(255,255,255,0.8)', 0.03); }
    else if (st === 'shoji') { for (var i = 0; i < 5; i++) line(x, [[-0.4, -1.55 + i * 0.32], [0.4, -1.55 + i * 0.32]], '#6a4a2a', 0.025); line(x, [[0, -1.72], [0, 0]], '#6a4a2a', 0.025); }
    else { RR(x, -0.3, -1.6, 0.6, 0.65, 0.03, P.sh(c, 0.08), P.rgba(out(c), 0.5), OL); RR(x, -0.3, -0.85, 0.6, 0.72, 0.03, P.sh(c, 0.08), P.rgba(out(c), 0.5), OL); }
    P.ball(x, 0.28, -0.9, 0.045, 0.045, o.locked ? '#a08060' : '#e8c860', { hi: 0.5 });
    if (o.symbol) { x.fillStyle = '#f8f0d0'; x.font = 'bold 0.25px Georgia'; x.textAlign = 'center'; x.fillText(o.symbol, 0, -1.25); }
  });
  def('ndoor', 1.4, 2.6, function (x, o, f, t) {
    var c = C(o, 0, '#6a4a7a'), sym = o.sym, glow = 0.35 + 0.15 * Math.sin(t * 1.6);
    var g = x.createRadialGradient(0, -1.0, 0.1, 0, -1.0, 1.2); g.addColorStop(0, P.rgba(P.sh(c, 0.5), glow * 0.6)); g.addColorStop(1, P.rgba(c, 0)); x.fillStyle = g; x.fillRect(-0.7, -2.4, 1.4, 2.4);
    gshadow(x, 0.55, 0.4);
    RR(x, -0.55, -2.1, 1.1, 2.1, 0.08, LG(x, -0.55, 0, 0.55, 0, [P.sh(c, -0.25), P.sh(c, -0.5)]), '#0a0610', OL);
    poly(x, [[-0.45, 0], [-0.45, -1.75], [-0.4, -1.95, 0, -2.0], [0.4, -1.95, 0.45, -1.75], [0.45, 0]], vshade(x, -2, 0, c, 0.2), out(c), OL);
    RR(x, -0.33, -1.7, 0.66, 0.62, 0.06, P.sh(c, 0.1), P.rgba(out(c), 0.6), OL);
    RR(x, -0.33, -0.95, 0.66, 0.8, 0.06, P.sh(c, 0.1), P.rgba(out(c), 0.6), OL);
    P.ball(x, 0.3, -0.95, 0.05, 0.05, '#f0d070', { hi: 0.5 });
    var sc = C(o, 1, '#f8f0ff'); x.save(); x.translate(0, -1.4); x.fillStyle = sc; x.strokeStyle = sc; x.lineWidth = 0.035; x.shadowColor = sc; x.shadowBlur = 0.15;
    if (sym === 'leaf') { P.leaf(x, 0, 0, 0.38, -0.8, sc, P.sh(c, -0.1)); }
    else if (sym === 'clock') { x.beginPath(); x.arc(0, 0, 0.18, 0, 6.3); x.stroke(); line(x, [[0, 0], [0, -0.12]], sc, 0.035); line(x, [[0, 0], [0.09, 0.03]], sc, 0.035); }
    else if (sym === 'sun') { P.ball(x, 0, 0, 0.11, 0.11, sc); for (var i = 0; i < 8; i++) { var a = i / 8 * 6.28 + t * 0.2; line(x, [[Math.cos(a) * 0.16, Math.sin(a) * 0.16], [Math.cos(a) * 0.23, Math.sin(a) * 0.23]], sc, 0.03); } }
    else if (sym === 'school') { RR(x, -0.16, -0.05, 0.32, 0.18, 0.01, sc); poly(x, [[-0.2, -0.05], [0, -0.2], [0.2, -0.05]], sc); }
    else if (sym === 'mono') { RR(x, -0.16, -0.15, 0.16, 0.3, 0, '#000'); RR(x, 0, -0.15, 0.16, 0.3, 0, '#fff'); }
    else if (sym === 'egg') { E(x, 0, 0, 0.12, 0.16, sc); }
    else if (sym === 'eye') { E(x, 0, 0, 0.2, 0.09, null, sc, 0.035); E(x, 0, 0, 0.05, 0.05, sc); }
    else if (sym === 'moon') { P.ball(x, 0, 0, 0.17, 0.17, sc, { hi: 0.1, lo: -0.1 }); E(x, 0.08, -0.04, 0.14, 0.14, P.sh(c, 0.1)); }
    else if (sym) { x.font = 'bold 0.3px Georgia'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(sym, 0, 0); }
    x.restore();
  }, { anim: true });
  def('stairs', 1, 1, function (x, o) { var c = C(o, 0, '#8a8078'); for (var i = 0; i < 4; i++) RR(x, -0.5, -1.0 + i * 0.25, 1.0, 0.2, 0.02, vshade(x, -1 + i * 0.25, -0.8 + i * 0.25, P.sh(c, -i * 0.1)), out(c), OL); });
  def('stairsdown', 1, 1, function (x, o) { var c = C(o, 0, '#7a7068'); RR(x, -0.5, -1.0, 1.0, 1.0, 0.04, '#0a0a0e'); for (var i = 0; i < 4; i++) RR(x, -0.45 + i * 0.03, -0.95 + i * 0.22, 0.9 - i * 0.06, 0.16, 0.02, P.sh(c, -i * 0.22)); var g = x.createLinearGradient(0, -1, 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)'); x.fillStyle = g; x.fillRect(-0.5, -1, 1, 1); });
  def('ladder', 1, 2.2, function (x) { RR(x, -0.3, -2.0, 0.07, 2.0, 0.02, '#8a6a3a', '#3a2a10', OL); RR(x, 0.23, -2.0, 0.07, 2.0, 0.02, '#8a6a3a', '#3a2a10', OL); for (var i = 0; i < 6; i++) RR(x, -0.25, -1.85 + i * 0.32, 0.5, 0.05, 0.01, '#a07a48'); });
  def('hole', 1, 1, function (x) { var g = x.createRadialGradient(0, -0.5, 0, 0, -0.5, 0.48); g.addColorStop(0, '#000'); g.addColorStop(0.8, '#0a0810'); g.addColorStop(1, 'rgba(40,30,60,0.6)'); E(x, 0, -0.45, 0.46, 0.34, g); E(x, 0, -0.55, 0.46, 0.25, null, 'rgba(120,110,140,0.4)', 0.02); });
  def('elevator', 2, 2.6, function (x, o) { RR(x, -0.95, -2.5, 1.9, 2.5, 0.04, '#8a9098', '#3a4048', OL); var open = o.open; RR(x, -0.8, -2.0, 0.78, 2.0, 0.02, open ? '#151520' : vshade(x, -2, 0, '#c0c8d0'), '#505860', OL); RR(x, 0.02, -2.0, 0.78, 2.0, 0.02, open ? '#151520' : vshade(x, -2, 0, '#c0c8d0'), '#505860', OL); RR(x, -0.35, -2.4, 0.7, 0.3, 0.03, '#202020'); x.fillStyle = '#f04030'; x.font = 'bold 0.22px "Courier New"'; x.textAlign = 'center'; x.fillText(String(o.floor || '1'), 0, -2.18); });
  def('column', 1, 2.4, function (x, o) { D.pillar.fn(x, o, 0, 0); });
  def('tent', 2, 1.6, function (x, o) { gshadow(x, 0.95, 0.3); var c = C(o, 0, '#d05040'); poly(x, [[-0.95, 0], [0, -1.4], [0.95, 0]], vshade(x, -1.4, 0, c), out(c), OL); poly(x, [[-0.25, 0], [0, -0.75], [0.25, 0]], '#301010'); });
  def('stall2', 2, 2.2, function (x, o) { gshadow(x, 0.95, 0.3); var c = C(o, 0, '#e05050'); RR(x, -0.92, -1.9, 0.08, 1.9, 0.02, '#6a4a2a'); RR(x, 0.84, -1.9, 0.08, 1.9, 0.02, '#6a4a2a'); for (var i = 0; i < 8; i++) poly(x, [[-1 + i * 0.25, -2.1], [-0.75 + i * 0.25, -2.1], [-0.75 + i * 0.25, -1.7], [-0.875 + i * 0.25, -1.62], [-1 + i * 0.25, -1.7]], i % 2 ? c : '#f8f0e0'); box(x, 0, 1.9, 0.3, 0.6, '#a08060', '#8a6a4a'); if (o.goods) for (var j = 0; j < 5; j++) P.ball(x, -0.7 + j * 0.35, -1.0, 0.12, 0.1, o.goods[j % o.goods.length]); });
  def('ferris', 4, 4.4, function (x, o, f, t) { var c = C(o, 0, '#c0c0c8'); line(x, [[-0.6, 0], [0, -2.2]], '#808088', 0.06); line(x, [[0.6, 0], [0, -2.2]], '#808088', 0.06); x.strokeStyle = c; x.lineWidth = 0.04; x.beginPath(); x.arc(0, -2.2, 1.8, 0, 6.3); x.stroke(); for (var i = 0; i < 10; i++) { var a = i / 10 * 6.28 + t * 0.1, px = Math.cos(a) * 1.8, py = -2.2 + Math.sin(a) * 1.8; line(x, [[0, -2.2], [px, py]], c, 0.02); RR(x, px - 0.15, py, 0.3, 0.25, 0.06, ['#e05050', '#50a0e0', '#e0c040', '#60c060'][i % 4], '#222', OL); } P.ball(x, 0, -2.2, 0.12, 0.12, '#909098'); }, { anim: true });
  def('carousel', 3, 2.8, function (x, o, f, t) { gshadow(x, 1.4, 0.3); E(x, 0, -0.2, 1.4, 0.35, '#a04050', '#401018', OL); poly(x, [[-1.45, -2.0], [0, -2.7], [1.45, -2.0]], vshade(x, -2.7, -2, '#e05070'), '#601020', OL); RR(x, -1.45, -2.05, 2.9, 0.18, 0.04, '#f0c040'); for (var i = 0; i < 5; i++) { var a = i / 5 * 6.28 + t * 0.5, px = Math.cos(a) * 1.1, bob = Math.sin(t * 2 + i) * 0.1; if (Math.sin(a) < -0.2) continue; line(x, [[px, -1.9], [px, -0.3]], '#e0e0e0', 0.025); P.ball(x, px, -0.9 + bob, 0.22, 0.13, '#f8f0e0', { line: '#8a7a60', lw: OL }); } }, { anim: true });
  def('balloons', 1, 2.4, function (x, o, f, t) { var cs = ['#e05050', '#50a0e0', '#e0c040', '#e070c0']; for (var i = 0; i < 4; i++) { var px = -0.25 + i * 0.17 + Math.sin(t + i) * 0.04, py = -1.9 + (i % 2) * 0.25; line(x, [[0, -0.5], [px, py + 0.17]], '#ccc', 0.01); P.ball(x, px, py, 0.14, 0.17, cs[i], { hi: 0.35 }); } RR(x, -0.15, -0.5, 0.3, 0.5, 0.04, '#8a6a4a', '#3a2a10', OL); }, { anim: true });
  def('lighthouse', 2, 4.4, function (x, o, f, t) { gshadow(x, 0.75, 0.35); for (var i = 0; i < 6; i++) { var w = 0.6 - i * 0.05, y0 = -0.6 - i * 0.55; poly(x, [[-w, y0 + 0.6], [-(w - 0.05), y0], [w - 0.05, y0], [w, y0 + 0.6]], i % 2 ? '#e8e8e8' : '#c83030', '#401010', OL); } RR(x, -0.35, -4.1, 0.7, 0.55, 0.06, '#303038', '#000', OL); RR(x, -0.25, -4.0, 0.5, 0.35, 0.04, o.off ? '#404048' : '#fff8b0'); poly(x, [[-0.42, -4.1], [0, -4.35], [0.42, -4.1]], '#202028'); if (!o.off) { x.save(); x.globalAlpha = 0.18; x.fillStyle = '#fff8c0'; x.translate(0, -3.85); x.rotate(t * 0.8); poly(x, [[0, 0], [2.5, -0.3], [2.5, 0.3]], '#fff8c0'); x.restore(); } }, { anim: true });
  def('boat', 2, 1.4, function (x, o, f, t) { var bob = Math.sin(t * 1.5) * 0.04; x.translate(0, bob); poly(x, [[-0.95, -0.4], [0.95, -0.4], [0.7, -0.05], [-0.7, -0.05]], vshade(x, -0.4, 0, C(o, 0, '#8a5a30')), '#3a2010', OL); line(x, [[0, -0.4], [0, -1.3]], '#ccc', 0.03); poly(x, [[0.02, -1.25], [0.55, -0.5], [0.02, -0.5]], '#f0f0e8', '#888', OL); }, { anim: true });
  def('buoy', 1, 1, function (x, o, f, t) { var b = Math.sin(t * 2) * 0.05; P.ball(x, 0, -0.3 + b, 0.2, 0.22, '#e04030', { hi: 0.3 }); RR(x, -0.2, -0.32 + b, 0.4, 0.07, 0.01, '#f8f8f8'); line(x, [[0, -0.52 + b], [0, -0.7 + b]], '#888', 0.03); }, { anim: true });
  def('shell', 1, 1, function (x, o) { var c = C(o, 0, '#f0d8c8'); poly(x, [[0, -0.42], [0.32, -0.06], [-0.32, -0.06]], vshade(x, -0.42, 0, c), out(c), OL); for (var i = -2; i <= 2; i++) line(x, [[0, -0.4], [i * 0.13, -0.07]], P.sh(c, -0.25), 0.015); });
  def('coral', 1, 1.6, function (x, o) { var c = C(o, 0, '#e07090'); x.strokeStyle = c; x.lineCap = 'round'; [[0, 0, 0, -1.1, 0.12], [0, -0.5, -0.35, -0.85, 0.08], [0, -0.4, 0.32, -0.95, 0.08], [-0.35, -0.85, -0.42, -1.15, 0.06]].forEach(function (b) { x.lineWidth = b[4]; x.beginPath(); x.moveTo(b[0], b[1]); x.lineTo(b[2], b[3]); x.stroke(); }); });
  def('tank', 2, 2, function (x, o, f, t) { gshadow(x, 0.95, 0.3); RR(x, -0.95, -1.7, 1.9, 1.6, 0.05, '#6a7078', '#2a3038', OL); RR(x, -0.85, -1.6, 1.7, 1.3, 0.04, o.empty ? 'rgba(200,220,230,0.25)' : LG(x, 0, -1.6, 0, -0.3, ['rgba(120,190,230,0.8)', 'rgba(50,110,170,0.85)'])); if (!o.empty) for (var i = 0; i < 4; i++) { var px = -0.7 + U.mod(t * 0.2 + i * 0.4, 1.4); P.ball(x, px, -1.3 + i * 0.22, 0.08, 0.05, '#e08040'); } else for (var j = 0; j < 3; j++) P.ball(x, -0.5 + j * 0.5, -1.9 - Math.sin(t + j) * 0.1, 0.08, 0.05, '#e08040'); }, { anim: true });
  def('neon', 2, 1.4, function (x, o, f, t) { var on = Math.floor(t * 3) % 7 !== 0, c = C(o, 0, '#ff40a0'); RR(x, -0.95, -1.2, 1.9, 0.8, 0.06, '#10101a', '#000', OL); x.fillStyle = on ? c : P.sh(c, -0.6); x.font = 'bold 0.4px "Courier New"'; x.textAlign = 'center'; x.textBaseline = 'middle'; if (on) { x.shadowColor = c; x.shadowBlur = 0.25; } x.fillText(o.text || 'OPEN', 0, -0.8); }, { anim: true });
  def('hologram', 1, 2.2, function (x, o, f, t) { RR(x, -0.4, -0.25, 0.8, 0.25, 0.04, '#303848'); var a = 0.35 + 0.15 * Math.sin(t * 3); x.fillStyle = 'rgba(80,220,255,' + a + ')'; poly(x, [[-0.35, -0.25], [0.35, -0.25], [0.25, -1.9], [-0.25, -1.9]], 'rgba(80,220,255,' + a * 0.5 + ')'); for (var i = 0; i < 10; i++) RR(x, -0.25, -1.85 + U.mod(i * 0.17 + t * 0.2, 1.6), 0.5, 0.015, 0, 'rgba(200,250,255,0.5)'); if (o.figure !== false) P.ball(x, 0, -1.4, 0.12, 0.13, 'rgba(160,240,255,0.6)'); }, { anim: true });
  def('drone', 1, 1.6, function (x, o, f, t) { var b = Math.sin(t * 3) * 0.05; x.translate(0, -1.0 + b); RR(x, -0.18, -0.08, 0.36, 0.16, 0.05, '#404850', '#101418', OL); line(x, [[-0.18, -0.05], [-0.4, -0.12]], '#888', 0.02); line(x, [[0.18, -0.05], [0.4, -0.12]], '#888', 0.02); E(x, -0.4, -0.14, 0.12, 0.02, 'rgba(200,200,200,0.6)', null, 0, t * 30); E(x, 0.4, -0.14, 0.12, 0.02, 'rgba(200,200,200,0.6)', null, 0, -t * 30); P.ball(x, 0, 0.02, 0.025, 0.025, Math.floor(t * 2) % 2 ? '#f04040' : '#40f040'); if (o.box) RR(x, -0.1, 0.1, 0.2, 0.16, 0.02, '#c8a070', '#6a4a20', OL); }, { anim: true });
  def('server', 1, 2.2, function (x, o, f, t) { gshadow(x, 0.45, 0.3); box(x, 0, 0.85, 0.2, 1.95, '#30363c', '#202428'); for (var i = 0; i < 8; i++) { RR(x, -0.38, -1.85 + i * 0.22, 0.76, 0.17, 0.02, '#30363c'); P.ball(x, -0.28, -1.77 + i * 0.22, 0.02, 0.02, (i + Math.floor(t * 3)) % 3 ? '#40f080' : '#f0a020'); } }, { anim: true });
  def('monitor', 1, 1.4, function (x, o, f, t) { RR(x, -0.06, -0.35, 0.12, 0.35, 0.02, '#333'); RR(x, -0.25, -0.06, 0.5, 0.06, 0.02, '#333'); RR(x, -0.42, -1.1, 0.84, 0.72, 0.04, '#202020', '#000', OL); RR(x, -0.36, -1.04, 0.72, 0.6, 0.02, C(o, 0, '#3070c0')); if (o.text) for (var i = 0; i < 4; i++) RR(x, -0.3, -0.98 + i * 0.12, 0.3 + (i % 2) * 0.2, 0.04, 0.01, 'rgba(255,255,255,0.8)'); }, { anim: true });
  def('coffee', 1, 1, function (x, o) { RR(x, -0.13, -0.42, 0.26, 0.38, 0.04, vshade(x, -0.42, 0, '#f4f4f4'), '#999', OL); E(x, 0, -0.42, 0.13, 0.04, o.iced ? '#5a3a20' : '#3a2010'); if (o.iced) { RR(x, -0.06, -0.38, 0.06, 0.06, 0.01, 'rgba(220,240,255,0.8)'); line(x, [[0.04, -0.4], [0.07, -0.65]], '#e04040', 0.03); } });
  def('flagpole', 1, 3.4, function (x, o, f, t) { gshadow(x, 0.25, 0.3); RR(x, -0.04, -3.1, 0.08, 3.1, 0.02, '#909090'); var c = C(o, 0, '#c03030'), w = Math.sin(t * 3) * 0.06; poly(x, [[0.04, -3.05], [0.65, -2.95 + w], [0.04, -2.6]], c, out(c), OL); }, { anim: true });
  def('banner', 2, 1.6, function (x, o) { RR(x, -0.95, -1.5, 1.9, 0.9, 0.03, C(o, 0, '#c02020'), '#400', OL); x.fillStyle = C(o, 1, '#f8e070'); x.font = 'bold 0.22px Georgia'; x.textAlign = 'center'; x.fillText(o.text || '', 0, -1.0); });
  def('screen', 3, 2.2, function (x, o, f, t) { RR(x, -1.45, -2.1, 2.9, 1.9, 0.05, '#101010', '#000', OL); RR(x, -1.35, -2.0, 2.7, 1.7, 0.03, C(o, 0, '#3a6a9a')); x.globalAlpha = 0.15; for (var i = 0; i < 10; i++) RR(x, -1.35, -2.0 + U.mod(i * 0.17 + t * 0.3, 1.7), 2.7, 0.03, 0, '#fff'); x.globalAlpha = 1; }, { anim: true });
  def('bigeye', 2, 2, function (x, o, f, t) { E(x, 0, -1.0, 0.95, 0.55, '#f4f0f0', '#8a6060', 0.03); var px = Math.sin(t * 0.5) * 0.3; P.ball(x, px, -1.0, 0.36, 0.36, C(o, 0, '#4060a0')); E(x, px, -1.0, 0.16, 0.16, '#000'); E(x, px - 0.1, -1.1, 0.06, 0.05, '#fff'); }, { anim: true });
  def('mouth', 2, 1.2, function (x, o, f, t) { var op = 0.1 + Math.abs(Math.sin(t)) * 0.15; E(x, 0, -0.55, 0.95, 0.35 + op, '#801828', '#400810', OL); RR(x, -0.8, -0.85 - op, 1.6, 0.16, 0.05, '#f0f0e8'); RR(x, -0.8, -0.38 + op, 1.6, 0.14, 0.05, '#f0f0e8'); }, { anim: true });
  def('scarecrow', 1, 2.2, function (x, o, f, t) { gshadow(x, 0.3, 0.3); x.save(); x.scale(1.1, 1.1); YN.spr.FORMS.scarecrow(x); x.restore(); });
  def('jar', 1, 1, function (x, o) { RR(x, -0.22, -0.65, 0.44, 0.6, 0.1, C(o, 0, 'rgba(180,220,210,0.7)'), '#5a8a7a', OL); RR(x, -0.18, -0.72, 0.36, 0.08, 0.02, '#888'); if (o.inside) P.ball(x, 0, -0.32, 0.12, 0.12, o.inside); });
  def('onggi', 1, 1, function (x) { gshadow(x, 0.35, 0.3); P.ball(x, 0, -0.38, 0.34, 0.36, '#5a3a2a', { hi: 0.25 }); RR(x, -0.2, -0.82, 0.4, 0.1, 0.04, '#4a2a1a'); });
  def('hanok', 3, 2.8, function (x) { gshadow(x, 1.4, 0.3); box(x, 0, 2.5, 0.2, 1.3, '#e8dcc8', '#e0d0b8'); for (var i = 0; i < 4; i++) { RR(x, -1.1 + i * 0.58, -1.2, 0.48, 0.9, 0.02, '#f4ecd8', '#6a4a2a', OL); line(x, [[-0.86 + i * 0.58, -1.2], [-0.86 + i * 0.58, -0.3]], '#6a4a2a', 0.015); } poly(x, [[-1.5, -1.45], [-1.2, -1.9], [0, -2.1], [1.2, -1.9], [1.5, -1.45], [1.25, -1.5], [0, -1.7], [-1.25, -1.5]], vshade(x, -2.1, -1.45, '#3a3a40'), '#101014', OL); });
  def('house', 3, 3, function (x, o) { gshadow(x, 1.4, 0.3); var c = C(o, 0, '#d8c8b0'), r = C(o, 1, '#8a4a3a'); box(x, 0, 2.5, 0.25, 1.7, P.sh(c, 0.1), c); poly(x, [[-1.45, -1.9], [0, -2.9], [1.45, -1.9]], vshade(x, -2.9, -1.9, r), out(r), OL); [[-0.75], [0.75]].forEach(function (q) { RR(x, q[0] - 0.25, -1.45, 0.5, 0.45, 0.03, o.lit ? LG(x, 0, -1.45, 0, -1.0, ['#fff4c0', '#f0c860']) : '#506080', '#3a2a20', OL); line(x, [[q[0], -1.45], [q[0], -1.0]], '#3a2a20', 0.02); }); RR(x, -0.25, -0.95, 0.5, 0.95, 0.03, vshade(x, -0.95, 0, C(o, 2, '#5a3a2a')), '#2a1a10', OL); P.ball(x, 0.15, -0.5, 0.04, 0.04, '#e0c060'); });
  def('apartment', 3, 4.4, function (x, o) { gshadow(x, 1.4, 0.3); var c = C(o, 0, '#b8b8c0'); box(x, 0, 2.8, 0.25, 4.0, P.sh(c, 0.1), c); var r = YN.rng.make(o.seed || 1); for (var j = 0; j < 8; j++) for (var i = 0; i < 4; i++) { var lit = r.next() < (o.lit || 0.3); RR(x, -1.2 + i * 0.62, -3.85 + j * 0.45, 0.45, 0.3, 0.02, lit ? '#f8e8a0' : '#3a4050'); } RR(x, -0.3, -0.6, 0.6, 0.6, 0.02, '#303038'); });
  def('pot', 1, 1, function (x, o) { gshadow(x, 0.3, 0.3); poly(x, [[-0.25, -0.5], [0.25, -0.5], [0.18, 0], [-0.18, 0]], vshade(x, -0.5, 0, '#c06a40'), '#5a2a10', OL); RR(x, -0.3, -0.58, 0.6, 0.12, 0.03, '#d07a50', '#5a2a10', OL); E(x, 0, -0.55, 0.24, 0.05, '#5a3e26'); if (o.plant) { line(x, [[0, -0.55], [0, -0.95]], '#4f9a45', 0.04); P.leaf(x, -0.12, -0.85, 0.24, -0.5, '#6cc25a', '#3f8a3a'); P.leaf(x, 0.12, -0.95, 0.24, 0.5, '#8ad870', '#3f8a3a'); P.flower(x, 0, -1.02, 0.08, '#f0a0c0'); } });
  def('wateringcan', 1, 1, function (x) { YN.spr.ACC.can(x, { v: 'front' }, 0, 0, 0, 0.012); });
  def('seedbag', 1, 1, function (x) { poly(x, [[-0.2, -0.5], [0.2, -0.5], [0.25, 0], [-0.25, 0]], vshade(x, -0.5, 0, '#c8a070'), '#6a4a2a', OL); E(x, 0, -0.25, 0.05, 0.06, '#6a4a2a'); });
  def('letter', 1, 1, function (x) { poly(x, [[-0.3, -0.35], [0.3, -0.35], [0.3, -0.05], [-0.3, -0.05]], '#f4ecd8', '#a09070', OL); poly(x, [[-0.3, -0.35], [0, -0.18], [0.3, -0.35]], null, '#a09070', OL); E(x, 0, -0.18, 0.04, 0.04, '#c03030'); });
  def('coin', 1, 1, function (x, o) { var c = C(o, 0, '#c8a050'); E(x, 0, -0.12, 0.13, 0.08, c, P.sh(c, -0.35), OL); E(x, -0.03, -0.14, 0.05, 0.025, P.sh(c, 0.35), null); }, { flat: true });
  def('crane', 1, 1, function (x, o) { var c = C(o, 0, '#f4f4f0'); poly(x, [[-0.35, -0.2], [0, -0.3], [0.38, -0.55], [0.12, -0.18], [-0.05, -0.08]], vshade(x, -0.55, 0, c), '#a0a098', OL); poly(x, [[0, -0.3], [0.08, -0.55], [0.14, -0.26]], P.sh(c, -0.08), '#a0a098', OL); });
  def('shoe', 1, 1, function (x, o) { var c = C(o, 0, '#d05060'); poly(x, [[-0.25, -0.05], [-0.25, -0.25], [-0.05, -0.32], [0.05, -0.18], [0.28, -0.12], [0.28, -0.05]], vshade(x, -0.32, 0, c), out(c), OL); RR(x, -0.26, -0.06, 0.55, 0.05, 0.02, '#f0f0f0'); });
  def('photo', 1, 1, function (x, o) { RR(x, -0.3, -0.5, 0.6, 0.5, 0.02, '#f8f8f0', '#999', OL); RR(x, -0.25, -0.45, 0.5, 0.36, 0.01, C(o, 0, '#a09080')); if (o.person) { RR(x, -0.05, -0.3, 0.1, 0.2, 0.02, '#5a4a4a'); P.ball(x, 0, -0.34, 0.05, 0.05, '#e0c0a0'); } });
  def('lantern', 1, 1, function (x, o, f, t) { line(x, [[0, -0.8], [0, -0.68]], '#4a3a2a', 0.03); poly(x, [[-0.15, -0.68], [0.15, -0.68], [0.18, -0.15], [-0.18, -0.15]], o.off ? 'rgba(120,100,80,0.7)' : 'rgba(255,220,140,0.85)', '#6a4a2a', OL); if (!o.off) E(x, 0, -0.42, 0.07, 0.11, '#fff6c8'); RR(x, -0.2, -0.72, 0.4, 0.06, 0.02, '#7a5232'); RR(x, -0.2, -0.16, 0.4, 0.06, 0.02, '#7a5232'); }, { anim: true });
  def('hand', 1, 1.6, function (x, o) { var c = C(o, 0, '#f0d0b8'); RR(x, -0.2, -0.75, 0.4, 0.65, 0.12, vshade(x, -0.75, 0, c), out(c), OL); for (var i = 0; i < 4; i++) RR(x, -0.18 + i * 0.1, -1.2 + (i === 0 ? 0.25 : 0), 0.08, 0.5, 0.04, c, out(c), OL); });
  def('pills', 1, 1, function (x, o) { RR(x, -0.18, -0.6, 0.36, 0.55, 0.04, C(o, 0, '#f4f4f4'), '#999', OL); RR(x, -0.2, -0.68, 0.4, 0.12, 0.03, C(o, 1, '#3060c0')); RR(x, -0.14, -0.42, 0.28, 0.2, 0.01, C(o, 2, '#d8e4f4')); });
  def('blanketlump', 1, 1, function (x) { YN.spr.ACC.blanketHide(x); });
  def('cloudpuff', 2, 1.2, function (x) { [[-0.5, -0.4, 0.38], [0, -0.55, 0.45], [0.5, -0.4, 0.38]].forEach(function (q) { P.ball(x, q[0], q[1], q[2], q[2] * 0.75, '#f4f4ff', { hi: 0.05, lo: -0.12 }); }); });
  def('ghostfig', 1, 1.6, function (x, o) { YN.spr.drawCreature(x, 1, { t: 'ghost', c: [C(o, 0, 'rgba(220,220,255,0.5)')] }, {}); });
  def('void', 1, 1, function () { });
  def('glyph', 1, 1, function (x, o) { x.save(); x.translate(-0.2, -0.75); x.scale(0.03, 0.03); if (YN.lang) YN.lang.drawGlyph(x, o.ch || 'a', 0, 0, 14, C(o, 0, '#d8d0b0')); x.restore(); });
  def('wire', 1, 1, function (x, o) { x.strokeStyle = C(o, 0, '#60f0a0'); x.lineWidth = 0.02; x.strokeRect(-0.4, -0.85, 0.8, 0.8); line(x, [[-0.4, -0.85], [0.4, -0.05]], C(o, 0, '#60f0a0'), 0.02); });
  def('stamp', 1, 1, function (x) { YN.spr.ACC.stamp(x, { v: 'front' }, 0, 0, 0, 0.012); });
  def('drawer', 1, 1, function (x) { box(x, 0, 0.8, 0.2, 0.3, '#b08058', '#9a7050'); P.ball(x, 0, -0.15, 0.03, 0.03, '#d8c080'); });
  def('bigdoor', 2, 3, function (x, o) { var c = C(o, 0, '#5a4a3a'); RR(x, -0.95, -2.85, 1.9, 2.85, 0.06, P.sh(c, -0.4)); if (o.open) { RR(x, -0.85, -2.75, 1.7, 2.75, 0.04, '#050505'); return; } RR(x, -0.85, -2.75, 0.83, 2.75, 0.03, vshade(x, -2.75, 0, c), out(c), OL); RR(x, 0.02, -2.75, 0.83, 2.75, 0.03, vshade(x, -2.75, 0, c), out(c), OL); P.ball(x, -0.12, -1.3, 0.05, 0.05, '#e0c060'); P.ball(x, 0.12, -1.3, 0.05, 0.05, '#e0c060'); });
  def('telepole', 1, 3.6, function (x) { gshadow(x, 0.2, 0.3); RR(x, -0.06, -3.4, 0.12, 3.4, 0.03, vshade(x, -3.4, 0, '#5a4a3a'), '#2a1a10', OL); RR(x, -0.5, -3.15, 1.0, 0.08, 0.02, '#5a4a3a'); RR(x, -0.35, -2.9, 0.7, 0.06, 0.02, '#5a4a3a'); });
  def('carpart', 2, 1.4, function (x, o) { gshadow(x, 0.95, 0.3); var c = C(o, 0, '#a03030'); RR(x, -0.95, -0.75, 1.9, 0.55, 0.12, vshade(x, -0.75, -0.2, c), out(c), OL); poly(x, [[-0.5, -0.74], [-0.35, -1.1], [0.35, -1.1], [0.55, -0.74]], P.sh(c, -0.1), out(c), OL); RR(x, -0.32, -1.04, 0.28, 0.26, 0.02, '#90b0d0'); RR(x, 0.04, -1.04, 0.3, 0.26, 0.02, '#90b0d0'); P.ball(x, -0.55, -0.18, 0.17, 0.17, '#222'); P.ball(x, 0.55, -0.18, 0.17, 0.17, '#222'); });
  def('portrait', 1, 1.8, function (x, o) { RR(x, -0.36, -1.6, 0.72, 0.95, 0.03, '#c8a040', '#6a5010', OL); RR(x, -0.3, -1.54, 0.6, 0.83, 0.02, C(o, 0, '#5a4a6a')); P.ball(x, 0, -1.25, 0.13, 0.15, '#e0c0a0'); RR(x, -0.2, -1.1, 0.4, 0.38, 0.05, C(o, 1, '#303050')); if (o.redacted) RR(x, -0.26, -1.32, 0.52, 0.12, 0, '#000'); });

  /* ===================== AJOUTS (mondes du cœur) ===================== */
  def('lever', 1, 1.4, function (x, o) { gshadow(x, 0.3, 0.3); box(x, 0, 0.5, 0.2, 0.35, '#6a6a72', '#4a4a52'); var a = o.down ? 0.6 : -0.6; line(x, [[0, -0.4], [Math.sin(a) * 0.5, -0.4 - Math.cos(a) * 0.5]], '#9a9aa0', 0.06); P.ball(x, Math.sin(a) * 0.52, -0.4 - Math.cos(a) * 0.52, 0.08, 0.08, '#d03030'); });
  def('swing', 2, 2.4, function (x, o, f, t) { gshadow(x, 0.8, 0.3); var c = '#8a4a2a'; line(x, [[-0.9, 0], [-0.75, -2.1]], c, 0.06); line(x, [[0.9, 0], [0.75, -2.1]], c, 0.06); line(x, [[-0.8, -2.1], [0.8, -2.1]], c, 0.07); var s = Math.sin(t * 1.2) * 0.12; line(x, [[-0.25, -2.05], [-0.25 + s, -0.55]], '#bbb', 0.02); line(x, [[0.25, -2.05], [0.25 + s, -0.55]], '#bbb', 0.02); RR(x, -0.32 + s, -0.6, 0.64, 0.08, 0.02, '#c8a040', out('#c8a040'), OL); }, { anim: true });
  def('clothesline', 2, 3, function (x, o, f, t) { line(x, [[-0.9, 0], [-0.9, -2.2]], '#7a6a5a', 0.05); line(x, [[-0.9, -2.15], [0.9, -2.9]], '#ddd', 0.015); var w = Math.sin(t * 2) * 0.03; [['#f0f0f0', -0.6], ['#a8c8ec', -0.15], ['#f4b8c8', 0.35]].forEach(function (q) { var yy = -2.05 - (q[1] + 0.9) * 0.4; RR(x, q[1] + w, yy, 0.3, 0.42, 0.02, q[0], out(q[0]), OL); }); }, { anim: true });
  def('sandbox', 2, 1, function (x) { RR(x, -0.95, -0.55, 1.9, 0.5, 0.04, '#8a6a44', '#3a2a14', OL); RR(x, -0.85, -0.48, 1.7, 0.36, 0.03, '#e0c890'); line(x, [[-0.4, -0.3], [-0.1, -0.35]], '#b09a6a', 0.02); E(x, 0.4, -0.3, 0.1, 0.05, '#c8b078'); }, { flat: true });
  def('keyring', 1, 1.4, function (x) { line(x, [[0, -1.2], [0, -1.05]], '#888', 0.03); E(x, 0, -0.95, 0.1, 0.1, null, '#c0a030', 0.03); [[-0.12, 0.2], [0.02, -0.1], [0.14, 0.3]].forEach(function (q) { line(x, [[q[0] * 0.5, -0.9], [q[0], -0.62 + q[1] * 0.1]], '#d8c050', 0.035); }); });
  def('bigbell', 2, 3, function (x) { gshadow(x, 0.8, 0.32); line(x, [[-0.8, 0], [-0.7, -2.7]], '#5a3a20', 0.08); line(x, [[0.8, 0], [0.7, -2.7]], '#5a3a20', 0.08); RR(x, -0.85, -2.85, 1.7, 0.16, 0.03, '#6a4a2a', out('#6a4a2a'), OL); poly(x, [[-0.25, -2.65], [0.25, -2.65], [0.45, -1.3], [-0.45, -1.3]], vshade(x, -2.65, -1.3, '#b08a3a'), '#4a3010', OL); RR(x, -0.5, -1.36, 1.0, 0.1, 0.03, '#8a6a2a'); line(x, [[0.1, -2.6], [0.12, -0.3]], '#c8b890', 0.02); });
  def('loom', 2, 1.8, function (x) { gshadow(x, 0.8, 0.3); var c = '#7a5232'; RR(x, -0.9, -1.6, 0.08, 1.6, 0.02, c); RR(x, 0.82, -1.6, 0.08, 1.6, 0.02, c); RR(x, -0.9, -1.6, 1.8, 0.08, 0.02, c); RR(x, -0.9, -0.5, 1.8, 0.08, 0.02, c); for (var i = 0; i < 14; i++) line(x, [[-0.8 + i * 0.12, -1.52], [-0.8 + i * 0.12, -0.52]], i % 5 === 2 ? '#c03a3a' : '#e8e0d0', 0.012); RR(x, -0.8, -1.2, 1.6, 0.35, 0.01, 'rgba(200,60,60,0.6)'); });


  def('till', 2, 1.4, function (x) { gshadow(x, 0.9, 0.3); box(x, 0, 1.8, 0.4, 0.55, '#c8ccd0', '#a0a4a8'); RR(x, -0.7, -1.2, 0.5, 0.3, 0.03, '#2a2a30', '#111', OL); RR(x, -0.65, -1.16, 0.4, 0.16, 0.02, '#40e080'); RR(x, 0.1, -0.98, 0.8, 0.1, 0.02, '#303030'); });
  def('clawmachine', 1, 2.4, function (x) { gshadow(x, 0.45, 0.3); box(x, 0, 0.9, 0.3, 0.8, '#d03080', '#a02060'); RR(x, -0.42, -2.2, 0.84, 1.2, 0.04, 'rgba(200,230,255,0.45)', '#a02060', OL); line(x, [[0, -2.15], [0, -1.6]], '#ccc', 0.02); line(x, [[-0.08, -1.55], [0.08, -1.55]], '#ccc', 0.03); RR(x, -0.3, -1.25, 0.25, 0.18, 0.03, '#e03a4a'); P.ball(x, 0.15, -1.15, 0.1, 0.09, '#e8d8a0'); RR(x, -0.45, -2.35, 0.9, 0.16, 0.04, '#ff60b0'); });
  def('glassespile', 1, 1, function (x) { E(x, -0.12, -0.35, 0.1, 0.07, 'rgba(200,230,255,0.5)', '#222', 0.025); E(x, 0.12, -0.35, 0.1, 0.07, 'rgba(200,230,255,0.5)', '#222', 0.025); line(x, [[-0.02, -0.36], [0.02, -0.36]], '#222', 0.02); }, { flat: true });
  def('towel', 1, 1, function (x) { RR(x, -0.4, -0.5, 0.8, 0.4, 0.03, '#e8a0b0', out('#e8a0b0'), OL); for (var i = 0; i < 3; i++) RR(x, -0.4, -0.45 + i * 0.12, 0.8, 0.04, 0, '#f0c0c8'); }, { flat: true });
  def('crumbs', 1, 1, function (x) { for (var i = 0; i < 6; i++) E(x, -0.3 + (i * 37 % 60) / 100, -0.3 - (i * 23 % 30) / 100, 0.04, 0.03, '#a09888'); }, { flat: true, noline: true });
  def('hut', 3, 2.8, function (x) { gshadow(x, 1.3, 0.3); [-1.1, -0.3, 0.5, 1.2].forEach(function (k) { RR(x, k - 0.04, -0.7, 0.08, 0.7, 0.01, '#4a3a2a'); }); box(x, 0, 2.6, 0.4, 1.1, '#7a5a3a', '#5a4028', { r: 0.02 }); poly(x, [[-1.5, -2.2], [0, -2.9], [1.5, -2.2]], '#4a3a20', out('#4a3a20'), OL); RR(x, -0.25, -1.6, 0.5, 0.75, 0.03, '#1a1410'); });

  def('spark', 1, 1, function (x, o, f, t) { var k = 0.8 + Math.sin(t * 5) * 0.2; E(x, 0, -0.45, 0.12 * k, 0.12 * k, '#fff8c0'); E(x, 0, -0.45, 0.06, 0.06, '#ffffff'); line(x, [[-0.2 * k, -0.45], [0.2 * k, -0.45]], '#fff0a0', 0.03); line(x, [[0, -0.65 * k], [0, -0.25]], '#fff0a0', 0.03); }, { anim: true, noline: true, flat: true });
  def('trainseat', 1, 1.4, function (x, o) { var c = C(o, 0, '#8a2a3a'); gshadow(x, 0.4, 0.3); box(x, 0, 0.8, 0.3, 0.35, P.sh(c, 0.15), c); RR(x, -0.4, -1.1, 0.8, 0.45, 0.06, vshade(x, -1.1, -0.65, c), out(c), OL); RR(x, -0.36, -1.08, 0.72, 0.1, 0.03, '#e8e0d0'); });
  def('clothespin', 1, 1, function (x) { RR(x, -0.05, -0.45, 0.1, 0.35, 0.02, '#c8a070', '#6a4a20', OL); }, { flat: true });
  def('sock', 1, 1, function (x) { poly(x, [[-0.1, -0.9], [0.08, -0.9], [0.08, -0.45], [0.25, -0.35], [0.22, -0.22], [-0.08, -0.3]], '#f0f0f8', '#8a8aa0', OL); RR(x, -0.1, -0.9, 0.18, 0.08, 0.01, '#e04050'); line(x, [[-0.3, -0.95], [0.3, -0.95]], '#ddd', 0.015); });
  def('watertower', 2, 4, function (x) { gshadow(x, 0.9, 0.3); [-0.7, -0.25, 0.25, 0.7].forEach(function (k) { line(x, [[k, 0], [k * 0.85, -2.2]], '#5a4a3a', 0.06); }); RR(x, -0.85, -3.6, 1.7, 1.45, 0.12, vshade(x, -3.6, -2.15, '#8a6a4a'), out('#8a6a4a'), OL); poly(x, [[-0.95, -3.55], [0, -3.95], [0.95, -3.55]], '#6a4a2a', out('#6a4a2a'), OL); for (var i = 0; i < 4; i++) line(x, [[-0.85, -3.3 + i * 0.35], [0.85, -3.3 + i * 0.35]], 'rgba(0,0,0,0.2)', 0.02); });
  def('skylight', 2, 1, function (x, o) { RR(x, -0.85, -0.7, 1.7, 0.6, 0.04, '#3a3a40', '#111', OL); RR(x, -0.75, -0.62, 1.5, 0.44, 0.02, YN.save && YN.save.perm && YN.save.perm.room && YN.save.perm.room.light ? '#f0d890' : '#1a1a28'); line(x, [[0, -0.62], [0, -0.18]], '#3a3a40', 0.04); }, { flat: true });
  def('telescope', 1, 1.8, function (x) { gshadow(x, 0.35, 0.3); [-0.25, 0, 0.25].forEach(function (k) { line(x, [[0, -0.9], [k, 0]], '#3a3a3a', 0.035); }); x.save(); x.translate(0, -1.0); x.rotate(-0.6); RR(x, -0.45, -0.08, 0.9, 0.16, 0.05, vshade(x, -0.08, 0.08, '#b0a080'), '#4a3a20', OL); RR(x, 0.4, -0.1, 0.12, 0.2, 0.03, '#2a2a2a'); x.restore(); });
  def('hatch', 1, 1, function (x) { RR(x, -0.42, -0.8, 0.84, 0.7, 0.04, '#6a6a70', '#222', OL); line(x, [[-0.3, -0.45], [0.3, -0.45]], '#3a3a40', 0.03); RR(x, -0.1, -0.5, 0.2, 0.1, 0.02, '#9a9aa0'); }, { flat: true });
  def('vent', 1, 1.4, function (x) { gshadow(x, 0.45, 0.3); box(x, 0, 0.8, 0.3, 0.7, '#a0a4a8', '#80848a'); for (var i = 0; i < 4; i++) line(x, [[-0.32, -0.6 + i * 0.12], [0.32, -0.6 + i * 0.12]], '#5a5e64', 0.025); });
  def('antenna', 1, 2.6, function (x) { gshadow(x, 0.2, 0.3); line(x, [[0, 0], [0, -2.4]], '#7a7a80', 0.04); [-2.2, -1.9, -1.6].forEach(function (y, i) { line(x, [[-0.35 + i * 0.08, y], [0.35 - i * 0.08, y]], '#9a9aa0', 0.03); }); P.ball(x, 0, -2.45, 0.05, 0.05, '#e03030'); });
  def('radio', 1, 1.2, function (x) { gshadow(x, 0.35, 0.3); RR(x, -0.38, -0.75, 0.76, 0.5, 0.06, vshade(x, -0.75, -0.25, '#7a5a3a'), '#3a2a10', OL); E(x, -0.15, -0.5, 0.12, 0.12, '#c8b890', '#3a2a10', OL); RR(x, 0.05, -0.65, 0.26, 0.1, 0.02, '#f0e0a0'); line(x, [[0.25, -0.75], [0.45, -1.1]], '#999', 0.02); });
  def('clipboard', 1, 1.2, function (x) { RR(x, -0.28, -1.0, 0.56, 0.75, 0.03, '#a07040', '#4a3010', OL); RR(x, -0.22, -0.92, 0.44, 0.62, 0.01, '#f4f0e8'); for (var i = 0; i < 5; i++) line(x, [[-0.16, -0.82 + i * 0.1], [0.16, -0.82 + i * 0.1]], '#8a8aa0', 0.012); RR(x, -0.08, -1.04, 0.16, 0.08, 0.02, '#c0c0c0'); });

  def('book', 1, 1, function (x, o) { poly(x, [[-0.32, -0.55], [0.32, -0.6], [0.36, -0.25], [-0.3, -0.2]], C(o, 0, '#f0e8d8'), '#8a7a5a', OL); line(x, [[0.02, -0.58], [0.04, -0.22]], '#a09070', 0.015); RR(x, -0.3, -0.24, 0.66, 0.05, 0.01, C(o, 1, '#8a3040')); }, { flat: true });
  def('bell', 1, 1.6, function (x) { line(x, [[0, -1.5], [0, -1.3]], '#555', 0.03); poly(x, [[-0.12, -1.3], [0.12, -1.3], [0.28, -0.75], [-0.28, -0.75]], vshade(x, -1.3, -0.75, '#d8b040'), '#6a4a10', OL); P.ball(x, 0, -0.72, 0.06, 0.06, '#6a4a10'); }, { wall: true });
  def('hopscotch', 3, 1, function (x) { for (var i = 0; i < 6; i++) { x.strokeStyle = '#f0f0f0'; x.lineWidth = 0.03; x.strokeRect(-1.4 + i * 0.47, -0.7, 0.42, 0.42); x.fillStyle = '#f0f0f0'; x.font = '0.2px monospace'; x.fillText(String(i + 1), -1.25 + i * 0.47, -0.42); } }, { flat: true, noline: true });
  def('ball', 1, 1, function (x) { P.ball(x, 0, -0.25, 0.22, 0.16, '#d04040', { hi: 0.2 }); line(x, [[-0.2, -0.25], [0.2, -0.25]], '#f0f0f0', 0.03); });
  def('campfire', 1, 1.2, function (x, o, f, t) { gshadow(x, 0.45, 0.3); [-0.3, 0, 0.3].forEach(function (k) { line(x, [[k - 0.15, -0.1], [k + 0.15, -0.25]], '#5a3a20', 0.06); }); var h = 0.5 + Math.sin(t * 7) * 0.08; poly(x, [[-0.25, -0.2], [0, -0.2 - h], [0.25, -0.2]], '#f08030'); poly(x, [[-0.12, -0.2], [0, -0.2 - h * 0.6], [0.12, -0.2]], '#f8e060'); }, { anim: true });
  def('beacon', 1, 2, function (x, o, f, t) { gshadow(x, 0.3, 0.3); line(x, [[0, 0], [0, -1.5]], '#5a5a5a', 0.05); var on = Math.floor(t * 2) % 2; P.ball(x, 0, -1.6, 0.13, 0.13, on ? '#ff4040' : '#802020'); }, { anim: true });
  def('deliverybot', 1, 1.6, function (x, o, f, t) { gshadow(x, 0.4, 0.3); box(x, 0, 0.7, 0.3, 0.7, '#e8ecf0', '#c8ccd4'); RR(x, -0.25, -1.35, 0.5, 0.3, 0.06, '#202838', '#101418', OL); var b = Math.floor(t * 2) % 2; E(x, -0.1, -1.2, 0.04, 0.05, b ? '#40e0ff' : '#208090'); E(x, 0.1, -1.2, 0.04, 0.05, b ? '#40e0ff' : '#208090'); P.ball(x, -0.25, -0.05, 0.08, 0.08, '#333'); P.ball(x, 0.25, -0.05, 0.08, 0.08, '#333'); RR(x, -0.2, -0.95, 0.4, 0.22, 0.02, '#40e0ff'); }, { anim: true });

  def('toytrain', 2, 1, function (x) { gshadow(x, 0.8, 0.3); box(x, -0.4, 0.7, 0.2, 0.35, '#e04040', '#b02020'); box(x, 0.45, 0.6, 0.2, 0.3, '#4060c0', '#304890'); RR(x, -0.65, -0.85, 0.2, 0.3, 0.02, '#303030'); [-0.6, -0.2, 0.25, 0.65].forEach(function (k) { P.ball(x, k, -0.06, 0.08, 0.08, '#222'); }); x.fillStyle = '#f8f0d0'; x.font = 'bold 0.18px monospace'; x.fillText('23', -0.55, -0.35); });
  def('suitcase', 1, 1.2, function (x) { gshadow(x, 0.45, 0.3); RR(x, -0.42, -0.85, 0.84, 0.75, 0.06, vshade(x, -0.85, -0.1, '#7a4a2a'), '#3a2010', OL); line(x, [[-0.15, -0.85], [-0.15, -1.0], [0.15, -1.0], [0.15, -0.85]], '#3a2010', 0.04); x.fillStyle = '#e8d090'; x.font = 'bold 0.25px serif'; x.fillText('J.', -0.12, -0.38); });
  def('spotlight', 1, 1, function (x) { E(x, 0, -0.35, 0.5, 0.22, 'rgba(255,248,200,0.35)'); E(x, 0, -0.35, 0.3, 0.13, 'rgba(255,248,220,0.5)'); }, { flat: true, noline: true });
  def('inkwell', 1, 1, function (x) { RR(x, -0.2, -0.5, 0.4, 0.35, 0.06, '#202028', '#000', OL); RR(x, -0.1, -0.6, 0.2, 0.12, 0.02, '#303038'); line(x, [[0.05, -0.6], [0.3, -1.0]], '#e8e0c0', 0.025); });
  def('lighthouse', 2, 4.6, function (x) { gshadow(x, 0.9, 0.3); poly(x, [[-0.6, 0], [-0.4, -3.6], [0.4, -3.6], [0.6, 0]], vshade(x, -3.6, 0, '#e8e4dc'), '#6a6458', OL); [-0.9, -2.0, -3.1].forEach(function (y) { poly(x, [[-0.58 + (y / -3.6) * 0.2 * -1, y], [0.58 - (y / -3.6) * 0.2, y], [0.55 - ((y - 0.35) / -3.6) * 0.2, y - 0.35], [-0.55 + ((y - 0.35) / -3.6) * 0.2, y - 0.35]], '#c03030'); }); RR(x, -0.45, -4.2, 0.9, 0.6, 0.04, '#303038', '#111', OL); RR(x, -0.35, -4.1, 0.7, 0.4, 0.02, YN.save && YN.save.perm && YN.save.flag && YN.save.flag('lighthouse_W029') ? '#fff0a0' : '#4a4a50'); poly(x, [[-0.5, -4.2], [0, -4.55], [0.5, -4.2]], '#303038'); RR(x, -0.15, -0.6, 0.3, 0.6, 0.03, '#3a2a1a'); });
  def('bones', 2, 1.6, function (x, o) { var s = o.big ? 1.6 : 1; for (var i = 0; i < 5; i++) { x.strokeStyle = '#e8e4d8'; x.lineWidth = 0.07; x.beginPath(); x.arc(-0.7 * s + i * 0.35 * s, -0.1, 0.55 * s, Math.PI * 1.05, Math.PI * 1.6); x.stroke(); } line(x, [[-0.9 * s, -0.05], [0.9 * s, -0.05]], '#d8d4c8', 0.08); });

  def('monument', 2, 5, function (x) { gshadow(x, 1.1, 0.35); box(x, 0, 1.8, 0.4, 0.8, '#b8b0a0', '#988f80'); poly(x, [[-0.35, -0.8], [0.35, -0.8], [0.3, -3.2], [-0.3, -3.2]], vshade(x, -3.2, -0.8, '#c8a050'), '#6a5020', OL); P.ball(x, 0, -3.5, 0.28, 0.3, '#c8a050', { line: '#6a5020', lw: OL }); line(x, [[0.25, -2.9], [0.8, -4.4]], '#b89040', 0.12); });
  def('cardperson', 1, 1.6, function (x, o, f, t) { gshadow(x, 0.25, 0.3); RR(x, -0.12, -0.9, 0.24, 0.55, 0.04, '#f0f0f0', '#888', OL); P.ball(x, 0, -1.0, 0.12, 0.12, '#f0c8a0'); var cols = ['#c83030', '#e8c040', '#3060a0', '#f0e8d0']; RR(x, -0.3, -1.5, 0.6, 0.38, 0.02, cols[(Math.floor(t * 1.5) + Math.round((o.seed || 0) / 7)) % 4], '#333', OL); line(x, [[-0.1, -0.9], [-0.25, -1.15]], '#f0c8a0', 0.04); line(x, [[0.1, -0.9], [0.25, -1.15]], '#f0c8a0', 0.04); }, { anim: true });
  def('intercom', 1, 1.4, function (x) { RR(x, -0.22, -1.2, 0.44, 0.6, 0.05, '#c8ccd4', '#3a3e46', OL); RR(x, -0.15, -1.12, 0.3, 0.18, 0.02, '#202838'); for (var i = 0; i < 6; i++) E(x, -0.1 + (i % 3) * 0.1, -0.85 + Math.floor(i / 3) * 0.1, 0.03, 0.03, '#8a8e96'); }, { wall: true });
  def('photobooth', 1, 2.4, function (x) { gshadow(x, 0.45, 0.3); box(x, 0, 0.9, 0.3, 2.0, '#d03838', '#a02020'); RR(x, -0.38, -1.9, 0.5, 1.7, 0.03, '#2a1a1a'); RR(x, -0.36, -1.85, 0.46, 1.0, 0.02, 'rgba(255,240,220,0.15)'); RR(x, 0.15, -1.6, 0.2, 0.3, 0.02, '#f0f0f0'); x.fillStyle = '#f8f0d0'; x.font = 'bold 0.14px monospace'; x.fillText('PHOTO', -0.3, -2.0); });
  def('washer', 1, 1.4, function (x, o, f, t) { gshadow(x, 0.42, 0.3); box(x, 0, 0.85, 0.25, 0.95, '#f0f0f0', '#d8d8d8'); E(x, 0, -0.5, 0.28, 0.28, '#a8b8c8', '#5a6a7a', OL); E(x, Math.sin(t * 4) * 0.08, -0.5 + Math.cos(t * 4) * 0.08, 0.1, 0.08, '#e0a0b0'); RR(x, -0.35, -1.1, 0.25, 0.08, 0.02, '#6a7a8a'); if (o.num) { x.fillStyle = '#202020'; x.font = 'bold 0.16px monospace'; x.fillText(o.num, 0.15, -1.03); } }, { anim: true });
  def('wheel', 2, 2, function (x) { gshadow(x, 0.8, 0.3); E(x, 0, -0.9, 0.75, 0.75, null, '#5a3a20', 0.08); for (var i = 0; i < 8; i++) { var a = i / 8 * 6.28; line(x, [[0, -0.9], [Math.cos(a) * 0.72, -0.9 + Math.sin(a) * 0.72]], '#6a4a2a', 0.05); } P.ball(x, 0, -0.9, 0.12, 0.12, '#4a2a10'); });

  def('jumprope', 1, 1.2, function (x) { line(x, [[-0.3, -0.2], [-0.3, -0.6]], '#c83030', 0.07); line(x, [[0.3, -0.2], [0.3, -0.6]], '#c83030', 0.07); x.strokeStyle = '#f0e0a0'; x.lineWidth = 0.025; x.beginPath(); x.moveTo(-0.3, -0.6); x.quadraticCurveTo(0, -1.2, 0.3, -0.6); x.stroke(); });
  def('doodle', 1, 1.2, function (x, o) { x.strokeStyle = '#2a2a6a'; x.lineWidth = 0.03; x.beginPath(); x.arc(0, -0.85, 0.15, 0, 6.3); x.moveTo(0, -0.7); x.lineTo(0, -0.35); x.moveTo(-0.18, -0.55); x.lineTo(0.18, -0.55); x.moveTo(0, -0.35); x.lineTo(-0.12, -0.1); x.moveTo(0, -0.35); x.lineTo(0.12, -0.1); x.stroke(); E(x, -0.05, -0.88, 0.015, 0.02, '#2a2a6a'); E(x, 0.05, -0.88, 0.015, 0.02, '#2a2a6a'); if (!o.unfinished) { x.beginPath(); x.arc(0, -0.82, 0.06, 0.2, Math.PI - 0.2); x.stroke(); } }, { flat: true, noline: true });

  def('heart', 2, 2.4, function (x, o, f, t) { var k = 1 + Math.max(0, Math.sin(t * 5)) * 0.08; x.save(); x.translate(0, -1.1); x.scale(k, k); poly(x, [[0, 0.7], [-0.8, -0.1], [-0.8, -0.5], [-0.4, -0.8], [0, -0.5], [0.4, -0.8], [0.8, -0.5], [0.8, -0.1]], vshade(x, -0.8, 0.7, '#c02040'), '#4a0010', OL); line(x, [[-0.3, -0.5], [-0.1, 0.1]], '#e05070', 0.05); x.restore(); }, { anim: true });
  def('vitrine', 1, 1.8, function (x, o) { gshadow(x, 0.4, 0.3); box(x, 0, 0.8, 0.25, 0.7, '#e8e0d0', '#c8c0b0'); RR(x, -0.36, -1.6, 0.72, 0.85, 0.03, 'rgba(210,235,255,0.45)', '#8a8478', OL); if (o.tear) E(x, 0, -1.15, 0.06, 0.09, '#80c0ff', '#3070a0', OL); else E(x, 0, -1.1, 0.1, 0.08, C(o, 0, '#c8a080')); });
  def('puppetstrings', 2, 3, function (x) { for (var i = 0; i < 5; i++) line(x, [[-0.8 + i * 0.4, -2.9], [-0.8 + i * 0.4 + 0.1, -0.6]], 'rgba(240,240,230,0.8)', 0.015); RR(x, -1, -3, 2, 0.12, 0.02, '#5a3a20'); }, { noline: true, wall: true });
  def('cross', 1, 1.2, function (x) { gshadow(x, 0.2, 0.25); RR(x, -0.04, -0.9, 0.08, 0.9, 0.01, '#d8c8a0', '#6a5a3a', OL); RR(x, -0.22, -0.7, 0.44, 0.07, 0.01, '#d8c8a0', '#6a5a3a', OL); P.flower(x, 0.1, -0.08, 0.05, '#f070a0', '#f8e070'); });

  /* fruits du jeu de fusion : cerise, raisin, pomme, pêche, melon, pastèque, « ? » */
  var FRUIT = { cherry: ['#d02040', 0.16], grape: ['#7040a0', 0.2], apple: ['#e04030', 0.26], peach: ['#f0a080', 0.3], melon: ['#c8d860', 0.36], watermelon: ['#2a8a3a', 0.46], question: ['#c8c8d0', 0.34] };
  def('fruit', 1.4, 1.4, function (x, o) {
    var f = FRUIT[o.f] || FRUIT.apple, r = f[1] * (o.big ? 1.5 : 1);
    gshadow(x, r * 1.1, 0.3);
    if (o.f === 'grape') { for (var i = 0; i < 6; i++) P.ball(x, -0.1 + (i % 3) * 0.1 + (i > 2 ? 0.05 : 0), -0.25 - Math.floor(i / 3) * 0.12, 0.07, 0.07, f[0], { hi: 0.3 }); return; }
    if (o.f === 'cherry') { line(x, [[-0.08, -0.2], [0.02, -0.5], [0.1, -0.2]], '#3a6a20', 0.03); P.ball(x, -0.09, -0.16, 0.09, 0.09, f[0], { hi: 0.3 }); P.ball(x, 0.1, -0.16, 0.09, 0.09, f[0], { hi: 0.3 }); return; }
    P.ball(x, 0, -r, r, r * 0.92, f[0], { hi: 0.25 });
    if (o.f === 'watermelon') for (var k = -2; k <= 2; k++) line(x, [[k * r * 0.35, -r * 1.85], [k * r * 0.45, -r * 0.15]], '#1a5a20', 0.04);
    if (o.f === 'question') { x.fillStyle = '#5a5a6a'; x.font = 'bold ' + (r * 1.2) + 'px monospace'; x.textAlign = 'center'; x.fillText('?', 0, -r * 0.6); }
    else line(x, [[0, -r * 1.9], [0.04, -r * 2.15]], '#5a3a1a', 0.035);
  });
  def('drawing', 1, 1.4, function (x, o) {
    RR(x, -0.32, -1.3, 0.64, 0.56, 0.01, '#f8f4e8', '#a09880', OL);
    line(x, [[-0.2, -0.85], [-0.2, -1.05], [-0.05, -1.18], [0.1, -1.05], [0.1, -0.85]], C(o, 0, '#d04040'), 0.025);
    P.ball(x, 0.18, -0.98, 0.04, 0.04, '#f0a0a0'); line(x, [[0.18, -0.94], [0.18, -0.84]], '#3a3aa0', 0.02);
    E(x, 0.2, -1.2, 0.04, 0.04, '#f0d040');
  }, { wall: true });
  def('doorbell', 1, 1.2, function (x) { gshadow(x, 0.15, 0.25); RR(x, -0.04, -0.7, 0.08, 0.7, 0.01, '#6a6a6a', '#2a2a2a', OL); RR(x, -0.14, -0.95, 0.28, 0.3, 0.04, '#d8d0b0', '#5a5040', OL); E(x, 0, -0.8, 0.06, 0.06, '#c83030', '#4a1010', OL); });

  /* une âme : une silhouette de buée qui flotte, deux yeux sombres, une traîne qui ondule */
  var SOULC = [['#e8f0ff', '#a8c0f0'], ['#f0e8ff', '#c0a8f0'], ['#fff4e8', '#f0c8a0'], ['#e8fff4', '#a0e0c8'], ['#ffffff', '#c8c8d8']];
  def('soul', 1, 1.6, function (x, o, f, t) {
    var c = SOULC[(o.v || 0) % SOULC.length], b = Math.sin(t * 1.6) * 0.05, w = o.small ? 0.72 : 1;
    x.save(); x.translate(0, b - 0.12); x.scale(w, w);
    var body = function () { x.beginPath(); x.moveTo(0, -1.22); x.bezierCurveTo(0.3, -1.22, 0.32, -0.88, 0.3, -0.62); for (var i = 0; i <= 4; i++) { var px = 0.3 - i * 0.15, py = -0.36 + Math.sin(t * 3 + i * 1.7) * 0.05 + (i % 2) * 0.07; x.lineTo(px, py); } x.bezierCurveTo(-0.32, -0.88, -0.3, -1.22, 0, -1.22); x.closePath(); };
    body(); x.lineWidth = 0.09; x.strokeStyle = c[1]; x.stroke();            // halo clair au lieu d'un trait noir
    body(); x.fillStyle = c[0]; x.fill();
    x.save(); body(); x.clip(); x.fillStyle = c[1]; x.fillRect(-0.4, -0.7, 0.8, 0.5); x.fillStyle = '#ffffff'; x.fillRect(-0.16, -1.16, 0.1, 0.06); x.restore();
    E(x, -0.09, -0.9, 0.04, 0.055, '#26263c'); E(x, 0.09, -0.9, 0.04, 0.055, '#26263c');
    if (o.mouth) E(x, 0, -0.76, 0.03, 0.02, '#4a4a60');
    for (var k = 0; k < 3; k++) { var an = t * 1.2 + k * 2.1, rx = Math.cos(an) * 0.42, ry = -0.85 + Math.sin(an * 1.3) * 0.32; x.fillStyle = k === 1 ? '#ffffff' : c[0]; x.fillRect(rx - 0.03, ry - 0.03, 0.06, 0.06); }
    x.restore();
  }, { anim: true, flat: true, noline: true });

  /* détails de sol (plats, sans contour, non interactifs) */
  def('manhole', 1, 1, function (x) { E(x, 0, -0.2, 0.3, 0.16, '#2a2a30'); E(x, 0, -0.2, 0.26, 0.13, '#3a3a42'); for (var i = -2; i <= 2; i++) line(x, [[i * 0.09, -0.3], [i * 0.09, -0.1]], '#2a2a30', 0.02); }, { flat: true, noline: true });
  def('crack', 1, 1, function (x, o) { var c = C(o, 0, 'rgba(0,0,0,0.35)'); line(x, [[-0.35, -0.3], [-0.1, -0.22], [0.05, -0.34], [0.3, -0.18]], c, 0.025); line(x, [[0.05, -0.34], [0.12, -0.45]], c, 0.02); }, { flat: true, noline: true });
  def('scraps', 1, 1, function (x) { RR(x, -0.25, -0.3, 0.16, 0.1, 0.01, '#d8d4c8'); RR(x, 0.05, -0.22, 0.12, 0.08, 0.01, '#c8c0b0'); RR(x, -0.05, -0.4, 0.1, 0.06, 0.01, '#e8e4dc'); }, { flat: true, noline: true });
  def('pebbles', 1, 1, function (x, o) { var c = C(o, 0, '#8a8478'); [[-0.2, -0.25, 0.05], [0.05, -0.3, 0.04], [0.18, -0.2, 0.035], [-0.05, -0.16, 0.03]].forEach(function (q) { E(x, q[0], q[1], q[2], q[2] * 0.7, c); E(x, q[0] - q[2] * 0.3, q[1] - q[2] * 0.3, q[2] * 0.3, q[2] * 0.2, P.sh(c, 0.25)); }); }, { flat: true, noline: true });
  def('tuft', 1, 1, function (x, o) { var c = C(o, 0, '#4a8a3a'); for (var i = -2; i <= 2; i++) line(x, [[i * 0.05, -0.15], [i * 0.08, -0.32 - Math.abs(i) * -0.03]], i % 2 ? P.sh(c, 0.15) : c, 0.03); }, { flat: true, noline: true });
  def('deadleaves', 1, 1, function (x) { [['#a06030', -0.2, -0.25], ['#c08040', 0.05, -0.3], ['#8a5028', 0.15, -0.18], ['#b07038', -0.05, -0.15]].forEach(function (q, i) { x.save(); x.translate(q[1], q[2]); x.rotate(i * 1.3); E(x, 0, 0, 0.06, 0.03, q[0]); x.restore(); }); }, { flat: true, noline: true });
  def('scuff', 1, 1, function (x) { line(x, [[-0.3, -0.25], [0.25, -0.28]], 'rgba(0,0,0,0.18)', 0.03); line(x, [[-0.15, -0.18], [0.1, -0.2]], 'rgba(0,0,0,0.12)', 0.02); }, { flat: true, noline: true });
  def('crumbs2', 1, 1, function (x) { [[-0.1, -0.2], [0.08, -0.25], [0.02, -0.15], [0.15, -0.3]].forEach(function (q) { x.fillStyle = '#c8a070'; x.fillRect(q[0], q[1], 0.03, 0.03); }); }, { flat: true, noline: true });
  def('chalkmark', 1, 1, function (x) { x.strokeStyle = 'rgba(240,240,230,0.6)'; x.lineWidth = 0.025; x.beginPath(); x.arc(0, -0.25, 0.12, 0, 6.28); x.moveTo(-0.2, -0.1); x.lineTo(0.2, -0.4); x.stroke(); }, { flat: true, noline: true });
  def('glint', 1, 1, function (x, o) { x.fillStyle = C(o, 0, 'rgba(255,255,255,0.4)'); x.fillRect(-0.02, -0.3, 0.04, 0.04); x.fillRect(0.1, -0.2, 0.03, 0.03); }, { flat: true, noline: true });

  /* un artefact par terre : un petit objet à moitié enfoui qui scintille de temps en temps */
  def('trinket', 1, 1, function (x, o, f, t) {
    var c = C(o, 0, '#e8d8a0'), tw = Math.max(0, Math.sin(t * 1.1 + (o.ph || 0)) - 0.86) * 7;
    E(x, 0, -0.16, 0.13, 0.06, 'rgba(0,0,0,0.25)');
    RR(x, -0.07, -0.24, 0.14, 0.09, 0.03, c, P.sh(c, -0.4), 0.02);
    x.fillStyle = P.sh(c, 0.4); x.fillRect(-0.05, -0.23, 0.04, 0.02);
    if (tw > 0) { x.fillStyle = 'rgba(255,255,240,' + Math.min(1, tw) + ')'; x.fillRect(-0.015, -0.42, 0.03, 0.14); x.fillRect(-0.07, -0.36, 0.14, 0.03); }
  }, { anim: true, flat: true, noline: true });

  YN.decor = {
    D: D,
    has: function (t) { return !!D[t]; },
    size: function (t) { return D[t] ? [D[t].w, D[t].h] : [1, 1]; },
    isWall: function (t) { return !!(D[t] && D[t].o.wall); },
    animated: function (t) { return !!(D[t] && D[t].o.anim); },
    get: function (t, o, frame, s) {
      var d = D[t]; if (!d) return null;
      s = s || (YN.terrain ? YN.terrain.tpx : 64);
      var fr = d.o.anim ? (frame || 0) % 24 : 0;
      var key = t + '|' + s + '|' + (o ? JSON.stringify(o) : '') + '|' + fr;
      var hit = cache[key]; if (hit) return hit;
      var R0 = YN.render; if (R0 && R0.warm && R0.buildMs > R0.warmBudget) { R0.missing++; return null; }
      var tb0 = R0 && R0.warm ? performance.now() : 0;
      var W = Math.ceil(d.w * s + s * 0.4), H = Math.ceil(d.h * s + s * 0.3);
      var cv = P.mk(W, H), x = cv.x;
      x.translate(W / 2, H - s * 0.12); x.scale(s, s);
      try { d.fn(x, o || {}, fr, fr / 6); } catch (e) { YN.warn('decor ' + t + ': ' + (e.stack || e)); }
      if (P.PIX) {
        P.crisp(cv.c, { thr: 110 });
        if (!d.o.noline) P.outline(cv.c, P.INK);
        if (!d.o.wall && !d.o.flat) { var sh = P.mk(W, H); P.pxShadow(sh.x, W / 2, H - s * 0.12 - 1, Math.min(d.w, 2.2) * s * 0.36, Math.max(2, s * 0.1), 0.26); sh.x.drawImage(cv.c, 0, 0); cv = sh; }
      }
      var res = { c: P.toGpu ? P.toGpu(cv.c) : cv.c, ax: Math.round(W / 2), ay: Math.round(H - s * 0.12) };
      if (cacheN > 7000) { cache = {}; cacheN = 0; }
      cache[key] = res; cacheN++;
      if (tb0) R0.buildMs += performance.now() - tb0;
      return res;
    },
    sprite: function (t, o, frame) { var r = YN.decor.get(t, o, frame); if (!r) return null; r.c.ax = r.ax; r.c.ay = r.ay; return r.c; },
    clear: function () { cache = {}; cacheN = 0; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
