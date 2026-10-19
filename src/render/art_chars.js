/* =========================================================================
 *  PERSONNAGES EN VECTORIEL : la protagoniste (8 directions, marche,
 *  respiration, clignements, accessoires et formes des effets), les PNJ
 *  (générateur paramétrique), les sorcières, la Prêtresse, les icônes.
 *  Unité de dessin : la case (s pixels). Origine : centre des pieds.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, P = YN.paint;
  var cache = {}, cacheN = 0;

  function outline(c) { return P.sh(c, -0.55); }
  function E(x, cx, cy, rx, ry, fill, line, lw, rot) {
    x.beginPath(); x.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, Math.PI * 2);
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (line) { x.strokeStyle = line; x.lineWidth = lw; x.stroke(); }
  }
  function shade(x, cx, cy, r, col, a) { // dégradé de volume (lumière en haut à gauche)
    var g = x.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    g.addColorStop(0, P.sh(col, a || 0.14)); g.addColorStop(0.55, col); g.addColorStop(1, P.sh(col, -(a || 0.14) * 1.8));
    return g;
  }
  function path(x, pts, fill, line, lw, close) {
    x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i];
      if (p.length === 4) x.quadraticCurveTo(p[0], p[1], p[2], p[3]); else if (p.length === 6) x.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]); else x.lineTo(p[0], p[1]);
    }
    if (close !== false) x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (line) { x.strokeStyle = line; x.lineWidth = lw; x.lineJoin = 'round'; x.stroke(); }
  }

  /* Encrage : on dessine le personnage sans son ombre, on l'entoure d'un trait
     sombre (lisible sur tous les sols), puis on remet l'ombre dessous. */
  function inked(W, H, ax, ay, s, draw, opt) {
    opt = opt || {};
    var raw = P.mk(W, H), shadows = [], ps = P.shadow;
    raw.x.translate(ax, ay);
    P.shadow = function (x, cx, cy, rx, ry, a) { shadows.push([cx, cy, rx, ry, a]); };
    try { draw(raw.x); } finally { P.shadow = ps; }
    var out = P.mk(W, H), ox = out.x;
    if (P.PIX) {
      if (opt.ink === false) P.crisp(raw.c, { thr: false, alphaSteps: 3 });
      else { P.crisp(raw.c, { thr: 100 }); P.outline(raw.c, opt.inkHex || P.INK); }
      shadows.forEach(function (q) { P.pxShadow(ox, ax + q[0], ay + q[1] - 1, q[2], Math.max(1.5, q[3]), 0.28); });
      ox.drawImage(raw.c, 0, 0);
      out.c.ax = ax; out.c.ay = ay;
      return out.c;
    }
    ox.save(); ox.translate(ax, ay); shadows.forEach(function (q) { ps(ox, q[0], q[1], q[2], q[3], q[4]); }); ox.restore();
    if (opt.ink !== false) {
      var sil = P.mk(W, H); sil.x.drawImage(raw.c, 0, 0); sil.x.globalCompositeOperation = 'source-in'; sil.x.fillStyle = opt.inkColor || 'rgba(18,10,26,0.92)'; sil.x.fillRect(0, 0, W, H);
      var o = Math.max(1, s * (opt.inkW || 0.022)), d = o * 0.71;
      [[o, 0], [-o, 0], [0, o], [0, -o], [d, d], [-d, d], [d, -d], [-d, -d]].forEach(function (q) { ox.drawImage(sil.c, q[0], q[1]); });
    }
    ox.drawImage(raw.c, 0, 0);
    // léger liseré de lumière en haut à gauche (rendu « illustré »)
    if (opt.rim !== false) {
      var rim = P.mk(W, H); rim.x.drawImage(raw.c, 0, 0); rim.x.globalCompositeOperation = 'destination-out'; rim.x.drawImage(raw.c, Math.max(1, s * 0.018), Math.max(1, s * 0.018));
      rim.x.globalCompositeOperation = 'source-in'; rim.x.fillStyle = 'rgba(255,248,235,0.35)'; rim.x.fillRect(0, 0, W, H);
      ox.drawImage(rim.c, 0, 0);
    }
    out.c.ax = ax; out.c.ay = ay;
    return out.c;
  }

  /* direction (8) → vue */
  function viewOf(dir) {
    switch (dir) {
      case 'down': return { v: 'front', t: 0, m: 1 }; case 'downright': return { v: 'front', t: 0.55, m: 1 }; case 'downleft': return { v: 'front', t: -0.55, m: 1 };
      case 'right': return { v: 'side', t: 0, m: 1 }; case 'left': return { v: 'side', t: 0, m: -1 };
      case 'upright': return { v: 'back', t: 0.55, m: 1 }; case 'upleft': return { v: 'back', t: -0.55, m: 1 }; case 'up': return { v: 'back', t: 0, m: 1 };
    }
    return { v: 'front', t: 0, m: 1 };
  }

  var GIRL = { hair: '#1e1a26', hairHi: '#4a4258', skin: '#f6d8c0', skinSh: '#e0b49a', blush: '#f0a0a8', eye: '#2a1822', sweater: '#a8c4e2', sweaterSh: '#7e9cc4', sweaterHi: '#d4e4f4', skirt: '#2c3458', sock: '#f2f0f6', shoe: '#5a2c2c', clip: '#f4c84a' };

  var S = YN.spr = {
    cache: cache, GIRL: GIRL,
    mk: P.mk,
    mirror: function (src) { var m = P.mk(src.width, src.height); m.x.translate(src.width, 0); m.x.scale(-1, 1); m.x.drawImage(src, 0, 0); return m.c; },
    viewOf: viewOf,

    /* ===================== LA PROTAGONISTE ===================== */
    drawGirl: function (x, s, o) {
      o = o || {};
      var pal = o.pal || GIRL, vw = viewOf(o.dir || 'down'), ph = o.phase || 0, t = o.time || 0;
      var walk = o.moving ? 1 : 0, sw = Math.sin(ph * Math.PI * 2) * walk;
      var bob = -Math.abs(Math.sin(ph * Math.PI * 2)) * 0.028 * walk + Math.sin(t * 2.2) * 0.006 * (1 - walk);
      var lw = Math.max(1, s * 0.014);
      x.save();
      P.shadow(x, 0, 0, s * 0.27, s * 0.09, 0.32);
      x.scale(s, s); lw = lw / s;
      if (o.form) { S.FORMS[o.form] ? S.FORMS[o.form](x, vw, ph, walk, t, pal, lw) : null; x.restore(); return; }
      if (vw.m < 0) x.scale(-1, 1);
      var blink = o.blink !== undefined ? o.blink : (U.mod(t + (o.seed || 0), 3.7) < 0.12);
      var accBack = o.acc && S.ACC_BACK[o.acc], accFront = o.acc && S.ACC[o.acc];
      if (accBack) accBack(x, vw, ph, walk, t, lw);
      if (vw.v === 'side') S._girlSide(x, pal, sw, bob, walk, blink, lw, o);
      else S._girlFrontBack(x, pal, vw, sw, bob, walk, blink, lw, o);
      if (accFront) { x.save(); if (vw.m < 0 && S.ACC_NOFLIP[o.acc]) { x.scale(-1, 1); } accFront(x, vw, ph, walk, t, lw, bob); x.restore(); }
      x.restore();
    },
    _legs: function (x, pal, sw, walk, lw, side) {
      var lift = function (k) { return Math.max(0, k) * 0.05; };
      if (side) {
        [[1, -0.02], [-1, 0.02]].forEach(function (q) {
          var a = sw * 0.45 * q[0];
          x.save(); x.translate(q[1], -0.32); x.rotate(a);
          path(x, [[-0.03, 0], [0.03, 0], [0.028, 0.27], [-0.028, 0.27]], pal.skin, outline(pal.skin), lw);
          path(x, [[-0.031, 0.19], [0.031, 0.19], [0.03, 0.27], [-0.03, 0.27]], pal.sock);
          E(x, 0.02, 0.29, 0.06, 0.028, pal.shoe, outline(pal.shoe), lw);
          x.restore();
        });
        return;
      }
      [-1, 1].forEach(function (k) {
        var up = lift(sw * k), lx = k * 0.07;
        path(x, [[lx - 0.03, -0.32], [lx + 0.03, -0.32], [lx + 0.028, -0.05 - up], [lx - 0.028, -0.05 - up]], pal.skin, outline(pal.skin), lw);
        path(x, [[lx - 0.031, -0.13 - up], [lx + 0.031, -0.13 - up], [lx + 0.03, -0.045 - up], [lx - 0.03, -0.045 - up]], pal.sock);
        E(x, lx, -0.03 - up, 0.05, 0.03, pal.shoe, outline(pal.shoe), lw);
        E(x, lx - 0.015, -0.04 - up, 0.018, 0.008, 'rgba(255,255,255,0.35)');
      });
    },
    _girlFrontBack: function (x, pal, vw, sw, bob, walk, blink, lw, o) {
      var back = vw.v === 'back', tt = vw.t;
      S._legs(x, pal, sw, walk, lw, false);
      x.save(); x.translate(0, bob);
      // jupe
      path(x, [[-0.16, -0.43], [0.16, -0.43], [0.205, -0.28], [-0.205, -0.28]], pal.skirt, outline(pal.skirt), lw);
      x.strokeStyle = P.sh(pal.skirt, -0.3); x.lineWidth = lw * 0.8;
      [-0.1, 0, 0.1].forEach(function (k) { x.beginPath(); x.moveTo(k * 0.9, -0.42); x.lineTo(k * 1.2, -0.29); x.stroke(); });
      // manches arrière (bras) — balancement
      var armA = sw * 0.12;
      [-1, 1].forEach(function (k) {
        x.save(); x.translate(k * 0.165, -0.76); x.rotate(-armA * k);
        path(x, [[-0.05, 0], [0.05, 0], [0.058, 0.31], [-0.045, 0.31]], shade(x, 0, 0.15, 0.08, pal.sweater, 0.12), outline(pal.sweater), lw);
        path(x, [[-0.046, 0.26], [0.058, 0.26], [0.06, 0.32], [-0.047, 0.32]], pal.sweaterSh);
        x.restore();
      });
      // pull trop grand
      var g = x.createLinearGradient(-0.25, -0.8, 0.25, -0.38); g.addColorStop(0, pal.sweaterHi); g.addColorStop(0.4, pal.sweater); g.addColorStop(1, pal.sweaterSh);
      path(x, [[-0.15, -0.8], [0.15, -0.8], [0.2, -0.74, 0.215, -0.6], [0.228, -0.42], [0.2, -0.385, 0, -0.38], [-0.2, -0.385, -0.228, -0.42], [-0.215, -0.6], [-0.2, -0.74, -0.15, -0.8]], g, outline(pal.sweater), lw);
      // bord-côte
      path(x, [[-0.226, -0.45], [0.226, -0.45], [0.228, -0.4], [0, -0.382, -0.228, -0.4]], pal.sweaterSh);
      x.strokeStyle = P.rgba(P.sh(pal.sweater, -0.35), 0.6); x.lineWidth = lw * 0.7;
      for (var k = -0.2; k <= 0.2; k += 0.04) { x.beginPath(); x.moveTo(k, -0.448); x.lineTo(k, -0.39); x.stroke(); }
      // plis et maille
      x.strokeStyle = P.rgba(pal.sweaterSh, 0.7); x.lineWidth = lw;
      x.beginPath(); x.moveTo(-0.1, -0.68); x.quadraticCurveTo(-0.13, -0.58, -0.12, -0.48); x.stroke();
      x.beginPath(); x.moveTo(0.08, -0.62); x.quadraticCurveTo(0.12, -0.55, 0.1, -0.47); x.stroke();
      if (!back) {
        // col
        path(x, [[-0.075, -0.8], [0, -0.775, 0.075, -0.8], [0.07, -0.765], [0, -0.735, -0.07, -0.765]], pal.sweaterHi, outline(pal.sweater), lw);
      } else {
        x.strokeStyle = P.rgba(pal.sweaterSh, 0.8); x.beginPath(); x.moveTo(0, -0.79); x.lineTo(0, -0.46); x.stroke();
      }
      // cou
      path(x, [[-0.035, -0.84], [0.035, -0.84], [0.035, -0.79], [-0.035, -0.79]], pal.skinSh);
      // tête
      S._head(x, pal, back, tt, blink, lw, o);
      x.restore();
    },
    _head: function (x, pal, back, tt, blink, lw, o) {
      var hx = tt * 0.025, cy = -1.06;
      // cheveux arrière (carré)
      path(x, [[-0.255 + hx, -1.12], [-0.25 + hx, -1.34, 0 + hx, -1.34], [0.25 + hx, -1.34, 0.255 + hx, -1.12], [0.26 + hx, -0.88], [0.22 + hx, -0.85, 0.17 + hx, -0.87], [-0.17 + hx, -0.87], [-0.22 + hx, -0.85, -0.26 + hx, -0.88]], pal.hair, outline(pal.hair), lw);
      if (!back) {
        var fx = tt * 0.06;
        // visage
        var fg = x.createRadialGradient(-0.06 + fx, cy - 0.06, 0.02, fx, cy, 0.24); fg.addColorStop(0, P.sh(pal.skin, 0.08)); fg.addColorStop(1, pal.skinSh);
        path(x, [[-0.19 + fx, -1.12], [-0.2 + fx, -0.93, 0 + fx, -0.875], [0.2 + fx, -0.93, 0.19 + fx, -1.12], [0 + fx, -1.2]], fg, outline(pal.skin), lw);
        // yeux
        var ey = cy + 0.02, ex1 = -0.085 + fx * 1.25, ex2 = 0.085 + fx * 1.25, far = 1 - Math.abs(tt) * 0.3;
        [[ex1, tt > 0 ? far : 1], [ex2, tt < 0 ? far : 1]].forEach(function (q) {
          if (blink) { x.strokeStyle = pal.eye; x.lineWidth = lw * 1.4; x.beginPath(); x.moveTo(q[0] - 0.03 * q[1], ey + 0.01); x.quadraticCurveTo(q[0], ey + 0.025, q[0] + 0.03 * q[1], ey + 0.01); x.stroke(); return; }
          E(x, q[0], ey, 0.03 * q[1], 0.042, pal.eye);
          E(x, q[0], ey + 0.012, 0.022 * q[1], 0.022, P.sh(pal.eye, 0.25));
          E(x, q[0] - 0.01 * q[1], ey - 0.016, 0.011 * q[1], 0.013, '#ffffff');
          E(x, q[0] + 0.008 * q[1], ey + 0.016, 0.006, 0.006, 'rgba(255,255,255,0.6)');
        });
        E(x, ex1 - 0.035, ey + 0.068, 0.03, 0.014, P.rgba(pal.blush, 0.32));
        E(x, ex2 + 0.035, ey + 0.068, 0.03, 0.014, P.rgba(pal.blush, 0.32));
        if (!blink) { x.strokeStyle = pal.eye; x.lineWidth = lw * 1.3; x.lineCap = 'round'; [ex1, ex2].forEach(function (q) { x.beginPath(); x.moveTo(q - 0.036, ey - 0.03); x.quadraticCurveTo(q, ey - 0.058, q + 0.036, ey - 0.03); x.stroke(); }); }
        x.strokeStyle = P.sh(pal.skin, -0.45); x.lineWidth = lw; x.beginPath();
        var my = cy + 0.11, mx = fx * 1.3;
        if (o.smile) { x.moveTo(mx - 0.03, my - 0.005); x.quadraticCurveTo(mx, my + 0.02, mx + 0.03, my - 0.005); } else { x.moveTo(mx - 0.015, my); x.lineTo(mx + 0.015, my); }
        x.stroke();
        // frange
        path(x, [[-0.235 + hx, -1.08], [-0.24 + hx, -1.33, 0 + hx, -1.335], [0.24 + hx, -1.33, 0.235 + hx, -1.08], [0.18 + hx, -1.13], [0.12 + hx, -1.075], [0.06 + hx, -1.13], [0 + hx, -1.08], [-0.06 + hx, -1.13], [-0.12 + hx, -1.075], [-0.18 + hx, -1.13]], pal.hair, outline(pal.hair), lw);
      }
      // reflet des cheveux
      x.strokeStyle = P.rgba(pal.hairHi, 0.9); x.lineWidth = lw * 3; x.lineCap = 'round';
      x.beginPath(); x.arc(hx - 0.02, -1.13, 0.17, Math.PI * 1.15, Math.PI * 1.55); x.stroke();
      x.lineWidth = lw * 1.5; x.beginPath(); x.arc(hx + 0.02, -1.13, 0.19, Math.PI * 1.62, Math.PI * 1.78); x.stroke();
      // barrette (toujours sur son côté droit)
      var cx = back ? 0.2 + hx : -0.2 + hx;
      if (!(o.dir === 'left' || o.dir === 'upleft' && false)) {
        x.save(); x.translate(cx, -1.2); x.rotate(back ? 0.5 : -0.5);
        path(x, [[-0.045, -0.018], [0.045, -0.018], [0.05, 0.018], [-0.05, 0.018]], P.sh(pal.clip, 0.05), outline(pal.clip), lw);
        E(x, -0.015, -0.006, 0.012, 0.006, 'rgba(255,255,255,0.7)');
        x.restore();
      }
    },
    _girlSide: function (x, pal, sw, bob, walk, blink, lw, o) {
      S._legs(x, pal, sw, walk, lw, true);
      x.save(); x.translate(0, bob);
      // bras arrière
      x.save(); x.translate(-0.01, -0.76); x.rotate(sw * 0.35);
      path(x, [[-0.045, 0], [0.045, 0], [0.05, 0.3], [-0.04, 0.3]], P.sh(pal.sweater, -0.15), outline(pal.sweater), lw); x.restore();
      path(x, [[-0.13, -0.43], [0.13, -0.43], [0.17, -0.28], [-0.15, -0.28]], pal.skirt, outline(pal.skirt), lw);
      var g = x.createLinearGradient(-0.2, -0.8, 0.2, -0.38); g.addColorStop(0, pal.sweaterHi); g.addColorStop(0.5, pal.sweater); g.addColorStop(1, pal.sweaterSh);
      path(x, [[-0.11, -0.8], [0.1, -0.8], [0.15, -0.72, 0.165, -0.58], [0.175, -0.42], [0.15, -0.385, 0, -0.38], [-0.16, -0.385, -0.18, -0.42], [-0.17, -0.6], [-0.15, -0.74, -0.11, -0.8]], g, outline(pal.sweater), lw);
      path(x, [[-0.18, -0.45], [0.176, -0.45], [0.175, -0.4], [0, -0.382, -0.18, -0.4]], pal.sweaterSh);
      path(x, [[-0.03, -0.84], [0.04, -0.84], [0.04, -0.79], [-0.03, -0.79]], pal.skinSh);
      // tête de profil
      var cy = -1.06;
      path(x, [[-0.23, -1.1], [-0.22, -1.34, 0.02, -1.34], [0.2, -1.33, 0.2, -1.15], [0.12, -0.9], [-0.15, -0.86], [-0.22, -0.86, -0.25, -0.9]], pal.hair, outline(pal.hair), lw);
      var fg = x.createRadialGradient(0.08, cy - 0.04, 0.02, 0.06, cy, 0.2); fg.addColorStop(0, P.sh(pal.skin, 0.08)); fg.addColorStop(1, pal.skinSh);
      path(x, [[-0.02, -1.16], [0.17, -1.17, 0.205, -1.06], [0.215, -1.0], [0.2, -0.95], [0.18, -0.9, 0.1, -0.885], [0.0, -0.9], [-0.06, -1.0]], fg, outline(pal.skin), lw);
      if (blink) { x.strokeStyle = pal.eye; x.lineWidth = lw * 1.4; x.beginPath(); x.moveTo(0.1, cy + 0.03); x.quadraticCurveTo(0.125, cy + 0.045, 0.15, cy + 0.03); x.stroke(); }
      else { E(x, 0.125, cy + 0.02, 0.026, 0.045, pal.eye); E(x, 0.118, cy + 0.003, 0.009, 0.012, '#fff'); }
      E(x, 0.1, cy + 0.085, 0.035, 0.02, P.rgba(pal.blush, 0.55));
      x.strokeStyle = P.sh(pal.skin, -0.45); x.lineWidth = lw; x.beginPath(); x.moveTo(0.17, cy + 0.12); x.lineTo(0.192, cy + 0.12); x.stroke();
      path(x, [[-0.05, -1.12], [-0.02, -1.33, 0.14, -1.3], [0.21, -1.25, 0.21, -1.1], [0.17, -1.13], [0.13, -1.08], [0.08, -1.13], [0.03, -1.09]], pal.hair, outline(pal.hair), lw);
      x.strokeStyle = P.rgba(pal.hairHi, 0.9); x.lineWidth = lw * 3; x.lineCap = 'round'; x.beginPath(); x.arc(-0.02, -1.12, 0.17, Math.PI * 1.2, Math.PI * 1.6); x.stroke();
      if (o.dir !== 'left') { x.save(); x.translate(0.02, -1.22); x.rotate(-0.3); path(x, [[-0.045, -0.018], [0.045, -0.018], [0.05, 0.018], [-0.05, 0.018]], pal.clip, outline(pal.clip), lw); x.restore(); }
      // bras avant
      x.save(); x.translate(0.0, -0.76); x.rotate(-sw * 0.35);
      path(x, [[-0.05, 0], [0.05, 0], [0.058, 0.31], [-0.045, 0.31]], shade(x, 0, 0.15, 0.08, pal.sweater, 0.12), outline(pal.sweater), lw);
      path(x, [[-0.046, 0.26], [0.058, 0.26], [0.06, 0.32], [-0.047, 0.32]], pal.sweaterSh);
      x.restore();
      x.restore();
    },
    /* image mise en cache de la protagoniste */
    girl: function (dir, frame, opt) {
      opt = opt || {};
      var s = YN.terrain ? YN.terrain.tpx : 64;
      var moving = !!opt.moving, ph = moving ? Math.round((opt.phase || 0) * 12) / 12 : 0;
      var tq = moving ? 0 : Math.round((opt.t || 0) * 8) / 8;
      var blinkT = opt.t || 0;
      var anim = S.ACC_ANIM[opt.acc] || (S.FORM_ANIM && S.FORM_ANIM[opt.form]), af = anim ? Math.floor((opt.t || 0) * 6) % 12 : 0;
      var key = 'G|' + s + '|' + dir + '|' + ph + '|' + (moving ? 'm' : 'i' + (tq % 3)) + '|' + (opt.form || '') + '|' + (opt.acc || '') + '|' + (opt.palKey || '') + '|' + (U.mod(blinkT, 3.7) < 0.12 ? 'b' : '') + '|' + (opt.hiding ? 'h' : '') + (anim ? '|' + af : '');
      var c = cache[key];
      if (c) return c;
      var W = Math.ceil(s * 1.7), H = Math.ceil(s * 2.5);
      var img = inked(W, H, W / 2, H - s * 0.35, s, function (x) {
        S.drawGirl(x, s, { dir: dir, phase: ph, moving: moving, time: anim ? af / 6 : (moving ? 0 : tq), blink: !moving && U.mod(blinkT, 3.7) < 0.12, form: opt.form, acc: opt.hiding ? 'blanketHide' : opt.acc, pal: opt.pal, seed: 0, smile: opt.smile });
      });
      if (cacheN > 4000) { cache = S.cache = {}; cacheN = 0; }
      img = P.toGpu ? P.toGpu(img) : img;
      cache[key] = img; cacheN++;
      return img;
    }
  };

  /* ===================== ACCESSOIRES DES EFFETS ===================== */
  var ACC = S.ACC = {}, BACK = S.ACC_BACK = {}, NOFLIP = S.ACC_NOFLIP = {}, ANIM = S.ACC_ANIM = { notes: 1, balloon: 1, jar: 1, glow: 1, lantern: 1 };
  function hand(vw) { return vw.v === 'side' ? [0.02, -0.46] : vw.v === 'back' ? [-0.19, -0.46] : [0.19, -0.46]; }
  ACC.sprout = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0.02, -1.33 + (bob || 0)); x.rotate(Math.sin(t * 2) * 0.1); P.stroke(x, [[0, 0], [0, -0.12]], '#3f8a3a', lw * 3); P.leaf(x, -0.06, -0.12, 0.13, -0.5, '#6cc25a', '#3f8a3a'); P.leaf(x, 0.06, -0.15, 0.13, 0.5, '#8ad870', '#3f8a3a'); x.restore(); };
  ACC.bird = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0.04, -1.36 + (bob || 0)); E(x, 0, 0, 0.1, 0.065, '#18181e', '#000', lw); E(x, 0.07, -0.05, 0.05, 0.045, '#18181e'); path(x, [[0.11, -0.055], [0.16, -0.045], [0.11, -0.035]], '#e8a53a'); E(x, 0.08, -0.06, 0.01, 0.01, '#fff'); path(x, [[-0.08, -0.01], [-0.17, -0.04], [-0.1, 0.03]], '#18181e'); x.restore(); };
  ACC.notes = function (x, vw, ph, w, t) { for (var i = 0; i < 3; i++) { var a = t * 1.5 + i * 2.1, px = Math.cos(a) * 0.32, py = -1.1 + Math.sin(a * 1.3) * 0.15 - (U.mod(t + i, 3)) * 0.1; x.globalAlpha = 0.85 - (U.mod(t + i, 3)) * 0.25; E(x, px, py, 0.03, 0.022, '#e8e0ff', null, 0, -0.4); P.stroke(x, [[px + 0.026, py], [px + 0.026, py - 0.1]], '#e8e0ff', 0.012); x.globalAlpha = 1; } };
  ACC.fishhood = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.27, -1.0], [-0.27, -1.38, 0, -1.4], [0.27, -1.38, 0.27, -1.0], [0.2, -1.12], [-0.2, -1.12]], shade(x, 0, -1.2, 0.3, '#4a8ccf'), '#24507a', lw); path(x, [[0.2, -1.3], [0.36, -1.42], [0.3, -1.24]], '#3a7ab8', '#24507a', lw); path(x, [[-0.2, -1.3], [-0.36, -1.42], [-0.3, -1.24]], '#3a7ab8', '#24507a', lw); if (vw.v !== 'back') { E(x, -0.13, -1.29, 0.04, 0.04, '#fff', '#24507a', lw); E(x, 0.13, -1.29, 0.04, 0.04, '#fff', '#24507a', lw); E(x, -0.13, -1.29, 0.018, 0.018, '#111'); E(x, 0.13, -1.29, 0.018, 0.018, '#111'); } x.restore(); };
  ACC.lantern = function (x, vw, ph, w, t, lw) { var h = hand(vw), sw2 = Math.sin(t * 3 + ph * 6) * 0.06; x.save(); x.translate(h[0], h[1]); x.rotate(sw2); P.stroke(x, [[0, 0], [0, 0.08]], '#4a3a2a', lw * 2); path(x, [[-0.06, 0.08], [0.06, 0.08], [0.07, 0.24], [-0.07, 0.24]], 'rgba(255,220,140,0.85)', '#6a4a2a', lw * 1.5); E(x, 0, 0.16, 0.035, 0.05, '#fff6c8'); path(x, [[-0.08, 0.06], [0.08, 0.06], [0.06, 0.09], [-0.06, 0.09]], '#7a5232'); path(x, [[-0.08, 0.24], [0.08, 0.24], [0.06, 0.27], [-0.06, 0.27]], '#7a5232'); x.restore(); };
  ACC.umbrella = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0.06, (bob || 0)); P.stroke(x, [[0, -0.5], [0, -1.62]], '#3a2a2a', lw * 2.5); var g = x.createRadialGradient(-0.15, -1.75, 0.05, 0, -1.6, 0.6); g.addColorStop(0, '#e86070'); g.addColorStop(1, '#a02838'); path(x, [[-0.55, -1.52], [-0.45, -1.92, 0, -1.95], [0.45, -1.92, 0.55, -1.52], [0.42, -1.58, 0.28, -1.52], [0.14, -1.58, 0, -1.52], [-0.14, -1.58, -0.28, -1.52], [-0.42, -1.58, -0.55, -1.52]], g, '#6a1828', lw); x.strokeStyle = 'rgba(80,10,20,0.5)'; x.lineWidth = lw; [-0.28, 0, 0.28].forEach(function (k) { x.beginPath(); x.moveTo(0, -1.94); x.lineTo(k, -1.54); x.stroke(); }); x.restore(); };
  ACC.skates = function (x, vw) { [-0.07, 0.07].forEach(function (k) { if (vw.v === 'side') k = k * 0.3; path(x, [[k - 0.06, -0.035], [k + 0.06, -0.035], [k + 0.06, 0.0], [k - 0.06, 0.0]], '#e03a4a', '#6a1020', 0.01); E(x, k - 0.035, 0.015, 0.018, 0.018, '#222'); E(x, k + 0.035, 0.015, 0.018, 0.018, '#222'); }); };
  function inHand(draw) { return function (x, vw, ph, w, t, lw) { var h = hand(vw); x.save(); x.translate(h[0], h[1]); draw(x, lw, t); x.restore(); }; }
  ACC.ticket = inHand(function (x, lw) { x.rotate(0.3); path(x, [[-0.06, -0.035], [0.06, -0.035], [0.06, 0.035], [-0.06, 0.035]], '#f4e4b8', '#8a6a3a', lw); P.stroke(x, [[-0.02, -0.035], [-0.02, 0.035]], '#c04040', lw); });
  ACC.chalk = inHand(function (x, lw) { x.rotate(-0.6); path(x, [[-0.015, -0.07], [0.015, -0.07], [0.015, 0.05], [-0.015, 0.05]], '#f8f8f4', '#a0a0a0', lw); });
  ACC.eraser = inHand(function (x, lw) { P.rr(x, -0.05, -0.03, 0.1, 0.06, 0.015); x.fillStyle = '#f0b8c8'; x.fill(); x.strokeStyle = '#a06070'; x.lineWidth = lw; x.stroke(); });
  ACC.phone = inHand(function (x, lw) { P.rr(x, -0.06, -0.04, 0.12, 0.08, 0.02); x.fillStyle = '#e04848'; x.fill(); x.strokeStyle = '#701818'; x.lineWidth = lw; x.stroke(); E(x, 0, 0, 0.022, 0.022, '#fff'); });
  ACC.keys = inHand(function (x, lw, t) { x.rotate(Math.sin(t * 4) * 0.2); E(x, 0, 0, 0.03, 0.03, null, '#c0a030', lw * 2); P.stroke(x, [[0.02, 0.02], [0.07, 0.09]], '#e0c040', lw * 2.5); P.stroke(x, [[-0.02, 0.02], [-0.05, 0.1]], '#c8b040', lw * 2.5); });
  ACC.glasses = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(0, bob || 0); var fx = vw.v === 'side' ? 0.12 : vw.t * 0.075; E(x, fx - (vw.v === 'side' ? 0 : 0.085), -1.04, 0.05, 0.045, 'rgba(200,230,255,0.35)', '#2a2a34', lw * 1.6); if (vw.v !== 'side') { E(x, fx + 0.085, -1.04, 0.05, 0.045, 'rgba(200,230,255,0.35)', '#2a2a34', lw * 1.6); P.stroke(x, [[fx - 0.035, -1.045], [fx + 0.035, -1.045]], '#2a2a34', lw * 1.4); } x.restore(); };
  ACC.scarf = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.15, -0.84], [0.15, -0.84], [0.16, -0.76], [-0.16, -0.76]], '#d03a44', '#701820', lw); if (vw.v !== 'back') { x.save(); x.translate(0.08, -0.77); x.rotate(Math.sin(t * 3 + ph * 6) * 0.08); path(x, [[-0.035, 0], [0.035, 0], [0.04, 0.22], [-0.03, 0.22]], '#b82a34', '#701820', lw); x.restore(); } x.strokeStyle = 'rgba(255,255,255,0.3)'; x.lineWidth = lw; for (var k = -0.12; k < 0.13; k += 0.06) { x.beginPath(); x.moveTo(k, -0.835); x.lineTo(k, -0.765); x.stroke(); } x.restore(); };
  ACC.bagmask = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.26, -0.88], [-0.28, -1.38], [0.28, -1.38], [0.26, -0.88]], shade(x, 0, -1.1, 0.3, '#c9a878'), '#6a5030', lw); x.strokeStyle = 'rgba(100,70,40,0.5)'; x.lineWidth = lw; x.beginPath(); x.moveTo(-0.28, -1.32); x.lineTo(0.28, -1.32); x.stroke(); if (vw.v !== 'back') { var fx = vw.v === 'side' ? 0.12 : vw.t * 0.06; E(x, fx - 0.08, -1.1, 0.035, 0.04, '#1a1410'); if (vw.v !== 'side') E(x, fx + 0.08, -1.1, 0.035, 0.04, '#1a1410'); path(x, [[fx - 0.06, -0.98], [fx, -0.96, fx + 0.06, -0.98]], null, '#1a1410', lw * 2, false); } x.restore(); };
  ACC.token = inHand(function (x, lw) { E(x, 0, 0, 0.045, 0.045, '#e8c040', '#8a6a10', lw); E(x, 0, 0, 0.025, 0.025, null, '#b08a20', lw); });
  ACC.balloon = function (x, vw, ph, w, t, lw) { var h = hand(vw), bx = h[0] + 0.1 + Math.sin(t * 1.3) * 0.05, by = -1.75 + Math.sin(t * 1.9) * 0.03; x.strokeStyle = '#ddd'; x.lineWidth = lw; x.beginPath(); x.moveTo(h[0], h[1]); x.quadraticCurveTo(h[0] + 0.15, -1.0, bx, by + 0.17); x.stroke(); P.ball(x, bx, by, 0.15, 0.18, '#ef6aa0', { hi: 0.35 }); path(x, [[bx - 0.02, by + 0.17], [bx + 0.02, by + 0.17], [bx, by + 0.2]], '#c04070'); };
  ACC.radio = inHand(function (x, lw) { P.rr(x, -0.08, -0.05, 0.16, 0.1, 0.02); x.fillStyle = '#6a5a48'; x.fill(); x.strokeStyle = '#2a2018'; x.lineWidth = lw; x.stroke(); E(x, -0.03, 0, 0.03, 0.03, '#c0b090'); P.stroke(x, [[0.05, -0.05], [0.09, -0.2]], '#999', lw * 1.5); });
  ACC.pocketmirror = inHand(function (x, lw) { E(x, 0, 0, 0.05, 0.05, '#c8a040', '#6a5010', lw); E(x, 0, 0, 0.038, 0.038, '#dce8f4'); E(x, -0.012, -0.014, 0.012, 0.008, '#fff'); });
  ACC.feather = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(vw.v === 'back' ? -0.18 : 0.18, -1.27 + (bob || 0)); x.rotate(0.5 + Math.sin(t * 2) * 0.06); P.leaf(x, 0, -0.08, 0.2, Math.PI / 2, '#f4f0ff', '#c8c0e0'); x.restore(); };
  ACC.hourglass = inHand(function (x, lw) { path(x, [[-0.04, -0.07], [0.04, -0.07], [0.006, 0], [0.04, 0.07], [-0.04, 0.07], [-0.006, 0]], 'rgba(220,235,255,0.6)', '#8a6a3a', lw); path(x, [[-0.025, 0.06], [0.025, 0.06], [0, 0.02]], '#f0d890'); P.stroke(x, [[-0.05, -0.07], [0.05, -0.07]], '#8a6a3a', lw * 3); P.stroke(x, [[-0.05, 0.07], [0.05, 0.07]], '#8a6a3a', lw * 3); });
  ACC.inkhands = function (x, vw) { var hs = vw.v === 'side' ? [[0.02, -0.46]] : [[-0.17, -0.46], [0.17, -0.46]]; hs.forEach(function (h) { E(x, h[0], h[1], 0.04, 0.03, '#101018'); }); };
  ACC.bell = inHand(function (x, lw, t) { x.rotate(Math.sin(t * 6) * 0.15); path(x, [[-0.02, -0.07], [0.02, -0.07], [0.06, 0.04], [-0.06, 0.04]], shade(x, 0, 0, 0.06, '#d8b040'), '#7a5a10', lw); E(x, 0, 0.055, 0.015, 0.015, '#6a4a10'); });
  ACC.blanket = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.24, -0.82], [0.24, -0.82], [0.27, -0.4], [0, -0.36, -0.27, -0.4]], 'rgba(216,192,232,0.92)', '#8a6aa0', lw); x.strokeStyle = 'rgba(140,110,170,0.5)'; x.lineWidth = lw; x.beginPath(); x.moveTo(-0.1, -0.8); x.lineTo(-0.15, -0.42); x.moveTo(0.1, -0.8); x.lineTo(0.15, -0.42); x.stroke(); x.restore(); };
  ACC.blanketHide = function (x) { path(x, [[-0.34, -0.02], [-0.36, -0.42, -0.1, -0.62], [0.12, -0.66, 0.3, -0.5], [0.38, -0.3, 0.34, -0.02]], shade(x, 0, -0.3, 0.4, '#d8c0e8'), '#7a5a90', 0.012); x.strokeStyle = 'rgba(120,90,150,0.45)'; x.lineWidth = 0.01; x.beginPath(); x.moveTo(-0.2, -0.45); x.quadraticCurveTo(-0.05, -0.3, -0.1, -0.05); x.moveTo(0.15, -0.5); x.quadraticCurveTo(0.2, -0.3, 0.12, -0.05); x.stroke(); };
  ACC.jar = inHand(function (x, lw, t) { path(x, [[-0.05, -0.08], [0.05, -0.08], [0.06, 0.07], [-0.06, 0.07]], 'rgba(180,230,210,0.5)', '#6a9a8a', lw); P.stroke(x, [[-0.055, -0.085], [0.055, -0.085]], '#888', lw * 3); for (var i = 0; i < 3; i++) { var a = t * 3 + i * 2; E(x, Math.cos(a) * 0.03, Math.sin(a * 1.3) * 0.04, 0.012, 0.012, 'rgba(250,255,150,' + (0.6 + 0.4 * Math.sin(a * 2)) + ')'); } });
  ACC.ribbon = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(vw.v === 'back' ? 0 : 0.14, -1.3 + (bob || 0)); path(x, [[0, 0], [-0.09, -0.05], [-0.09, 0.05]], '#e03a5a', '#801030', lw); path(x, [[0, 0], [0.09, -0.05], [0.09, 0.05]], '#e03a5a', '#801030', lw); E(x, 0, 0, 0.022, 0.022, '#c02a4a'); x.restore(); };
  ACC.compass = inHand(function (x, lw, t) { E(x, 0, 0, 0.05, 0.05, '#d0d0d0', '#555', lw); x.rotate(t * 2); path(x, [[0, -0.04], [0.01, 0], [0, 0.04], [-0.01, 0]], '#e03030'); });
  ACC.die = inHand(function (x, lw) { P.rr(x, -0.045, -0.045, 0.09, 0.09, 0.015); x.fillStyle = '#f8f8f4'; x.fill(); x.strokeStyle = '#888'; x.lineWidth = lw; x.stroke(); E(x, -0.02, -0.02, 0.01, 0.01, '#111'); E(x, 0.02, 0.02, 0.01, 0.01, '#111'); E(x, 0, 0, 0.01, 0.01, '#c02020'); });
  ACC.crane = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(vw.v === 'side' ? -0.06 : 0.16, -0.86 + (bob || 0)); path(x, [[-0.12, 0], [0, -0.04], [0.14, -0.1], [0.05, 0.01], [-0.02, 0.05]], '#f8f8f4', '#a0a098', lw); path(x, [[0, -0.04], [0.04, -0.12], [0.06, -0.02]], '#e8e8e0', '#a0a098', lw); x.restore(); };
  ACC.earpiece = function (x, vw, ph, w, t, lw, bob) { var px = vw.v === 'side' ? -0.02 : vw.v === 'back' ? 0.23 : -0.21; E(x, px, -1.02 + (bob || 0), 0.025, 0.03, '#40e0ff', '#106080', lw); E(x, px, -1.02 + (bob || 0), 0.05, 0.05, 'rgba(64,224,255,' + (0.2 + 0.1 * Math.sin(t * 5)) + ')'); };
  ACC.cupped = function () { };
  ACC.stamp = inHand(function (x, lw) { P.rr(x, -0.03, -0.09, 0.06, 0.06, 0.02); x.fillStyle = '#8a5030'; x.fill(); path(x, [[-0.05, -0.03], [0.05, -0.03], [0.05, 0.02], [-0.05, 0.02]], '#c03030', '#601010', lw); });
  ACC.can = inHand(function (x, lw) { path(x, [[-0.07, -0.06], [0.05, -0.06], [0.06, 0.06], [-0.07, 0.06]], shade(x, 0, 0, 0.07, '#5aa0d0'), '#205070', lw); P.stroke(x, [[0.05, -0.02], [0.14, -0.08]], '#4a90c0', lw * 4); x.strokeStyle = '#205070'; x.lineWidth = lw * 2; x.beginPath(); x.arc(-0.01, -0.07, 0.05, Math.PI, 0); x.stroke(); });
  ACC.plush = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; x.save(); x.translate(vw.v === 'side' ? 0.12 : 0, -0.58 + (bob || 0)); P.ball(x, 0, 0, 0.1, 0.09, '#e8d8c8'); P.ball(x, -0.05, -0.12, 0.03, 0.08, '#e8d8c8'); P.ball(x, 0.05, -0.12, 0.03, 0.08, '#e8d8c8'); E(x, -0.03, -0.01, 0.01, 0.012, '#222'); E(x, 0.03, -0.01, 0.01, 0.012, '#222'); x.restore(); };
  ACC.crown = function (x, vw, ph, w, t, lw, bob) { path(x, [[-0.14, -1.33], [-0.14, -1.45], [-0.07, -1.38], [0, -1.47], [0.07, -1.38], [0.14, -1.45], [0.14, -1.33]], shade(x, 0, -1.4, 0.15, '#e8c040'), '#8a6a10', lw); void bob; };
  ACC.halo = function (x, vw, ph, w, t) { x.strokeStyle = 'rgba(255,248,200,0.8)'; x.lineWidth = 0.02; x.beginPath(); x.ellipse(0, -1.48 + Math.sin(t * 2) * 0.01, 0.16, 0.04, 0, 0, Math.PI * 2); x.stroke(); };
  ACC.smile = function (x, vw, ph, w, t, lw, bob) { if (vw.v !== 'front') return; x.save(); x.translate(vw.t * 0.075, bob || 0); path(x, [[-0.09, -0.965], [0, -0.9, 0.09, -0.965]], null, '#e03030', lw * 3.5, false); E(x, -0.14, -1.0, 0.03, 0.02, 'rgba(240,60,60,0.6)'); E(x, 0.14, -1.0, 0.03, 0.02, 'rgba(240,60,60,0.6)'); x.restore(); };
  ACC.tear = function (x, vw, ph, w, t, lw, bob) { if (vw.v !== 'front') return; var k = U.mod(t, 1.5) / 1.5; E(x, -0.09 + vw.t * 0.075, -0.99 + k * 0.12 + (bob || 0), 0.012, 0.018, 'rgba(120,190,255,' + (1 - k) + ')'); };
  ACC.veil = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.3, -0.8], [-0.3, -1.4, 0, -1.42], [0.3, -1.4, 0.3, -0.8]], 'rgba(240,238,228,0.88)', '#a8a498', lw); for (var i = 0; i < 4; i++) path(x, [[-0.22, -1.25 + i * 0.1], [0.22, -1.25 + i * 0.1], [0.22, -1.22 + i * 0.1], [-0.22, -1.22 + i * 0.1]], '#111'); x.restore(); };
  ACC.shadow = function () { };
  ACC.headphones = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); x.strokeStyle = '#303038'; x.lineWidth = lw * 4; x.beginPath(); x.arc(0, -1.1, 0.26, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); P.rr(x, -0.29, -1.12, 0.07, 0.13, 0.03); x.fillStyle = '#404048'; x.fill(); P.rr(x, 0.22, -1.12, 0.07, 0.13, 0.03); x.fill(); x.restore(); };
  ACC.helmet = function (x, vw, ph, w, t, lw, bob) { x.save(); x.translate(0, bob || 0); path(x, [[-0.28, -1.08], [-0.28, -1.42, 0, -1.43], [0.28, -1.42, 0.28, -1.08]], shade(x, 0, -1.25, 0.3, '#e8d840'), '#7a6a10', lw); P.stroke(x, [[-0.28, -1.09], [0.28, -1.09]], '#b0a020', lw * 3); x.restore(); };
  ACC.mic = inHand(function (x, lw) { P.stroke(x, [[0, 0.05], [0, -0.05]], '#222', lw * 4); P.ball(x, 0, -0.08, 0.035, 0.035, '#b0b0b8'); });
  ACC.camera = inHand(function (x, lw) { P.rr(x, -0.07, -0.05, 0.14, 0.09, 0.015); x.fillStyle = '#303034'; x.fill(); E(x, 0.01, -0.005, 0.03, 0.03, '#6aa8d0', '#111', lw); });
  ACC.suitcase = inHand(function (x, lw) { P.rr(x, -0.09, 0.0, 0.18, 0.13, 0.02); x.fillStyle = '#7a4a2a'; x.fill(); x.strokeStyle = '#3a2010'; x.lineWidth = lw; x.stroke(); x.strokeStyle = '#3a2010'; x.lineWidth = lw * 2; x.beginPath(); x.arc(0, 0, 0.035, Math.PI, 0); x.stroke(); x.fillStyle = '#e8d090'; x.font = 'bold 0.06px serif'; x.fillText('J.', -0.02, 0.09); });
  ACC.lever = inHand(function (x, lw) { P.stroke(x, [[0, 0.04], [0, -0.14]], '#888', lw * 3); P.ball(x, 0, -0.16, 0.03, 0.03, '#d33'); });
  ACC.letter = inHand(function (x, lw) { x.rotate(-0.2); path(x, [[-0.07, -0.045], [0.07, -0.045], [0.07, 0.045], [-0.07, 0.045]], '#f4ecd8', '#a09070', lw); path(x, [[-0.07, -0.045], [0, 0.01], [0.07, -0.045]], null, '#a09070', lw, false); E(x, 0, 0.005, 0.012, 0.012, '#c03030'); });
  ACC.pasta = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; for (var i = 0; i < 9; i++) { var a = Math.PI * (0.1 + i * 0.1); E(x, Math.cos(a) * 0.13, -0.8 + Math.sin(a) * 0.09 + (bob || 0), 0.02, 0.014, i % 2 ? '#f0d070' : '#e88a40', '#8a5a20', lw * 0.6, a); } };
  ACC.watch = inHand(function (x, lw) { E(x, 0, 0, 0.04, 0.04, '#f8f8f0', '#8a7a50', lw * 2); P.stroke(x, [[-0.04, 0], [-0.06, 0]], '#5a4a30', lw * 3); });
  ACC.sunglasses = function (x, vw, ph, w, t, lw, bob) { if (vw.v === 'back') return; var fx = vw.v === 'side' ? 0.12 : vw.t * 0.075; P.rr(x, fx - 0.15, -1.07 + (bob || 0), vw.v === 'side' ? 0.08 : 0.3, 0.06, 0.02); x.fillStyle = '#101018'; x.fill(); };
  ACC.cloud = function () { };
  ACC.flowercrown = function (x, vw, ph, w, t, lw, bob) { for (var i = 0; i < 7; i++) P.flower(x, -0.2 + i * 0.066, -1.3 + Math.abs(i - 3) * 0.012 + (bob || 0), 0.03, ['#f070a0', '#fff070', '#80c0ff'][i % 3]); };
  ACC.glow = function (x, vw, ph, w, t) { var g = x.createRadialGradient(0, -0.7, 0.1, 0, -0.7, 0.8); g.addColorStop(0, 'rgba(255,255,220,' + (0.25 + 0.1 * Math.sin(t * 3)) + ')'); g.addColorStop(1, 'rgba(255,255,220,0)'); x.fillStyle = g; x.fillRect(-0.8, -1.5, 1.6, 1.6); };
  BACK.balloon = null;
  NOFLIP.suitcase = true;

  /* ===================== FORMES (transformations) ===================== */
  var FORMS = S.FORMS = {};
  FORMS.cat = function (x, vw, ph, w, t, pal, lw) {
    var k = '#1c1a22', sw = Math.sin(ph * Math.PI * 2) * w;
    if (vw.m < 0) x.scale(-1, 1);
    if (vw.v === 'side') {
      [[-0.14, 1], [-0.06, -1], [0.1, 1], [0.17, -1]].forEach(function (q) { x.save(); x.translate(q[0], -0.14); x.rotate(sw * 0.4 * q[1]); P.rr(x, -0.022, 0, 0.044, 0.14, 0.02); x.fillStyle = k; x.fill(); x.restore(); });
      E(x, 0, -0.2, 0.23, 0.1, k);
      x.save(); x.translate(-0.22, -0.24); x.rotate(-0.8 + Math.sin(t * 2) * 0.2); P.rr(x, -0.02, -0.25, 0.04, 0.26, 0.02); x.fillStyle = k; x.fill(); x.restore();
      E(x, 0.24, -0.32, 0.11, 0.1, k); path(x, [[0.17, -0.38], [0.19, -0.47], [0.23, -0.4]], k); path(x, [[0.26, -0.4], [0.3, -0.48], [0.32, -0.38]], k);
      E(x, 0.28, -0.33, 0.018, 0.022, '#e8e050'); E(x, 0.285, -0.33, 0.006, 0.018, '#111');
    } else {
      E(x, 0, -0.2, 0.17, 0.15, k);
      [-0.08, 0.08].forEach(function (q, i) { P.rr(x, q - 0.025, -0.1 - (i ? Math.max(0, sw) : Math.max(0, -sw)) * 0.03, 0.05, 0.1, 0.02); x.fillStyle = k; x.fill(); });
      x.save(); x.translate(0.12, -0.25); x.rotate(0.5 + Math.sin(t * 2) * 0.25); P.rr(x, -0.02, -0.28, 0.04, 0.28, 0.02); x.fillStyle = k; x.fill(); x.restore();
      E(x, 0, -0.42, 0.14, 0.12, k); path(x, [[-0.13, -0.47], [-0.11, -0.6], [-0.04, -0.52]], k); path(x, [[0.13, -0.47], [0.11, -0.6], [0.04, -0.52]], k);
      if (vw.v === 'front') { E(x, -0.05, -0.43, 0.022, 0.026, '#e8e050'); E(x, 0.05, -0.43, 0.022, 0.026, '#e8e050'); E(x, -0.05, -0.43, 0.007, 0.02, '#111'); E(x, 0.05, -0.43, 0.007, 0.02, '#111'); path(x, [[-0.012, -0.38], [0.012, -0.38], [0, -0.365]], '#e09090'); }
    }
  };
  FORMS.fish = function (x, vw, ph, w, t) { var sw = Math.sin(t * 6) * 0.15; x.save(); x.translate(0, -0.12); x.rotate(vw.v === 'side' ? 0 : -Math.PI / 2); if (vw.m < 0) x.scale(-1, 1); P.ball(x, 0, 0, 0.22, 0.12, '#4a8ccf', { hi: 0.3 }); path(x, [[-0.2, 0], [-0.34, -0.1 + sw * 0.3], [-0.34, 0.1 + sw * 0.3]], '#3a70b0'); E(x, 0.12, -0.03, 0.025, 0.025, '#fff'); E(x, 0.125, -0.03, 0.012, 0.012, '#111'); x.restore(); };
  FORMS.puddle = function (x, vw, ph, w, t) { E(x, 0, -0.03, 0.3, 0.09, 'rgba(100,140,190,0.75)', 'rgba(60,90,130,0.6)', 0.01); E(x, -0.08, -0.05, 0.1, 0.025, 'rgba(220,240,255,0.5)'); };
  FORMS.cloud = function (x, vw, ph, w, t) { var b = Math.sin(t * 2) * 0.03; [[0, -0.5, 0.2], [-0.15, -0.42, 0.15], [0.16, -0.43, 0.15], [0, -0.38, 0.17]].forEach(function (q) { P.ball(x, q[0], q[1] + b, q[2], q[2] * 0.85, '#f4f6ff', { hi: 0.05, lo: -0.15 }); }); E(x, -0.05, -0.45 + b, 0.015, 0.02, '#556'); E(x, 0.05, -0.45 + b, 0.015, 0.02, '#556'); };
  FORMS.scarecrow = function (x) { P.stroke(x, [[0, 0], [0, -1.0]], '#7a5a30', 0.05); P.stroke(x, [[-0.35, -0.75], [0.35, -0.75]], '#7a5a30', 0.04); path(x, [[-0.18, -0.78], [0.18, -0.78], [0.2, -0.4], [-0.2, -0.4]], '#a04030', '#501810', 0.012); P.ball(x, 0, -1.05, 0.16, 0.15, '#d8c070'); path(x, [[-0.25, -1.12], [0.25, -1.12], [0.12, -1.3], [-0.12, -1.3]], '#5a4020'); E(x, -0.05, -1.06, 0.015, 0.015, '#222'); E(x, 0.05, -1.06, 0.015, 0.015, '#222'); };
  FORMS.statue = function (x, vw, ph, w, t, pal, lw) { x.save(); x.filter = 'grayscale(1) brightness(0.85)'; S._girlFrontBack(x, { hair: '#8a8a8a', hairHi: '#aaa', skin: '#b0b0b0', skinSh: '#999', blush: '#a8a8a8', eye: '#777', sweater: '#a8a8a8', sweaterSh: '#8a8a8a', sweaterHi: '#c0c0c0', skirt: '#909090', sock: '#b0b0b0', shoe: '#808080', clip: '#a0a0a0' }, vw, 0, 0, 0, false, lw, {}); x.restore(); P.rr(x, -0.28, -0.06, 0.56, 0.08, 0.02); x.fillStyle = '#777'; x.fill(); };
  FORMS.flat = function (x, vw, ph, w, t, pal, lw) { x.save(); x.scale(1, 0.98); S._girlFrontBack(x, pal, vw, Math.sin(ph * 6.28) * w, 0, w, false, lw * 1.6, {}); x.restore(); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(255,250,230,0.25)'; x.fillRect(-0.4, -1.5, 0.8, 1.6); x.globalCompositeOperation = 'source-over'; };
  FORMS.doodle = function (x, vw, ph, w, t) { var sw = Math.sin(ph * 6.28) * w * 0.3; x.strokeStyle = '#1a1a2a'; x.lineWidth = 0.025; x.lineCap = 'round'; x.beginPath(); x.arc(0, -1.05, 0.17, 0, 6.3); x.moveTo(0, -0.88); x.lineTo(0, -0.4); x.moveTo(0, -0.75); x.lineTo(-0.2, -0.55 + sw * 0.2); x.moveTo(0, -0.75); x.lineTo(0.2, -0.55 - sw * 0.2); x.moveTo(0, -0.4); x.lineTo(-0.13 + sw * 0.4, 0); x.moveTo(0, -0.4); x.lineTo(0.13 - sw * 0.4, 0); x.stroke(); E(x, -0.06, -1.07, 0.015, 0.02, '#1a1a2a'); E(x, 0.06, -1.07, 0.015, 0.02, '#1a1a2a'); };
  FORMS.shadow = function (x, vw, ph, w, t, pal, lw) { x.save(); var sh = { hair: '#06060c', hairHi: '#101018', skin: '#0a0a12', skinSh: '#080810', blush: '#0a0a12', eye: '#3a3a5a', sweater: '#0c0c14', sweaterSh: '#08080e', sweaterHi: '#12121c', skirt: '#08080e', sock: '#0c0c14', shoe: '#06060a', clip: '#16161e' }; S._girlFrontBack(x, sh, vw, Math.sin(ph * 6.28) * w, 0, w, false, lw, {}); x.restore(); };
  FORMS.blob = function (x, vw, ph, w, t) { var b = Math.sin(t * 3) * 0.03; P.ball(x, 0, -0.22 + b, 0.24, 0.22 - b, '#c080e0', { hi: 0.35 }); E(x, -0.07, -0.26, 0.025, 0.035, '#222'); E(x, 0.07, -0.26, 0.025, 0.035, '#222'); };
  FORMS.line = function (x) { P.stroke(x, [[-0.4, -0.02], [0.4, -0.02]], '#f0f0f0', 0.02); };
  FORMS.letterA = function (x) { x.fillStyle = '#e8e8e8'; x.font = 'bold 1px monospace'; x.textAlign = 'center'; x.fillText('@', 0, -0.15); };

  /* ===================== PNJ : générateur paramétrique ===================== */
  function hc(look, i, d) { return (look.c && look.c[i]) || d; }
  var HEADS = S.HEADS = {
    round: function (x, look, lw) { var s = hc(look, 2, '#f0d0b8'); P.ball(x, 0, 0, 0.19, 0.18, s, { hi: 0.12, lo: -0.18, line: outline(s), lw: lw }); return { eyes: [0, 0.02], w: 0.19 }; },
    square: function (x, look, lw) { var s = hc(look, 2, '#d8d0c8'); P.rr(x, -0.18, -0.18, 0.36, 0.36, 0.06); x.fillStyle = shade(x, 0, 0, 0.18, s); x.fill(); x.strokeStyle = outline(s); x.lineWidth = lw; x.stroke(); return { eyes: [0, 0], w: 0.18 }; },
    bag: function (x, look, lw) { path(x, [[-0.2, 0.18], [-0.22, -0.24], [0.22, -0.24], [0.2, 0.18]], shade(x, 0, 0, 0.22, '#c9a878'), '#6a5030', lw); P.stroke(x, [[-0.22, -0.19], [0.22, -0.19]], 'rgba(100,70,40,0.5)', lw); return { eyes: [0, 0], w: 0.2, holes: true }; },
    mask: function (x, look, lw) { P.ball(x, 0, 0, 0.18, 0.2, '#f4f4f0', { hi: 0.05, line: '#888', lw: lw }); return { eyes: [0, -0.02], w: 0.18, painted: true }; },
    clock: function (x, look, lw) { E(x, 0, 0, 0.21, 0.21, '#8a6a3a', '#3a2a10', lw); E(x, 0, 0, 0.17, 0.17, '#f4ecd0'); for (var i = 0; i < 12; i++) { var a = i / 12 * 6.28; E(x, Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0.008, 0.008, '#333'); } P.stroke(x, [[0, 0], [0, -0.1]], '#222', lw * 2); P.stroke(x, [[0, 0], [0.07, 0.02]], '#222', lw * 2); return null; },
    tv: function (x, look, lw) { P.rr(x, -0.24, -0.2, 0.48, 0.36, 0.05); x.fillStyle = '#3a3a40'; x.fill(); x.strokeStyle = '#111'; x.lineWidth = lw; x.stroke(); P.rr(x, -0.19, -0.15, 0.32, 0.26, 0.05); x.fillStyle = hc(look, 3, '#8aa8c8'); x.fill(); P.stroke(x, [[-0.08, -0.2], [-0.15, -0.32]], '#888', lw); P.stroke(x, [[0.08, -0.2], [0.15, -0.32]], '#888', lw); return { eyes: [-0.03, -0.02], w: 0.15, screen: true }; },
    phone: function (x, look, lw) { var c = hc(look, 3, '#d03838'); P.rr(x, -0.2, -0.05, 0.4, 0.2, 0.04); x.fillStyle = shade(x, 0, 0, 0.2, c); x.fill(); P.rr(x, -0.24, -0.16, 0.48, 0.1, 0.05); x.fill(); x.strokeStyle = outline(c); x.lineWidth = lw; x.stroke(); E(x, 0, 0.05, 0.06, 0.06, '#f0f0f0'); return null; },
    bell: function (x, look, lw) { path(x, [[-0.08, -0.2], [0.08, -0.2], [0.18, 0.12], [-0.18, 0.12]], shade(x, 0, 0, 0.2, '#d8b040'), '#6a4a10', lw); E(x, 0, 0.16, 0.04, 0.04, '#6a4a10'); return null; },
    flower: function (x, look, lw) { var p = hc(look, 3, '#f0d040'); for (var i = 0; i < 8; i++) { var a = i / 8 * 6.28; P.ball(x, Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0.08, 0.08, p, { line: outline(p), lw: lw * 0.7 }); } P.ball(x, 0, 0, 0.13, 0.13, hc(look, 2, '#e8c040'), { line: outline(p), lw: lw }); return { eyes: [0, -0.01], w: 0.13 }; },
    pot: function (x, look, lw) { path(x, [[-0.17, -0.12], [0.17, -0.12], [0.13, 0.17], [-0.13, 0.17]], shade(x, 0, 0, 0.17, '#c06a40'), '#5a2a10', lw); P.rr(x, -0.2, -0.17, 0.4, 0.07, 0.02); x.fillStyle = '#d07a50'; x.fill(); x.stroke(); P.stroke(x, [[0, -0.17], [0, -0.3]], '#4a9a40', lw * 3); P.leaf(x, 0.05, -0.29, 0.1, 0.4, '#6cc25a'); return { eyes: [0, 0.02], w: 0.14 }; },
    bulb: function (x, look, lw) { P.ball(x, 0, -0.04, 0.15, 0.16, '#fff7b0', { hi: 0.2, line: '#a09040', lw: lw }); P.rr(x, -0.07, 0.1, 0.14, 0.08, 0.02); x.fillStyle = '#999'; x.fill(); return null; },
    none: function () { return null; },
    veil: function (x, look, lw) { path(x, [[-0.2, 0.25], [-0.22, -0.2, 0, -0.24], [0.22, -0.2, 0.2, 0.25]], '#ece8de', '#999', lw); for (var i = 0; i < 3; i++) P.rr(x, -0.15, -0.1 + i * 0.1, 0.3, 0.03, 0.01), x.fillStyle = '#111', x.fill(); return null; },
    helmet: function (x, look, lw) { HEADS.round(x, look, lw); path(x, [[-0.21, 0.0], [-0.21, -0.22, 0, -0.24], [0.21, -0.22, 0.21, 0.0]], shade(x, 0, -0.1, 0.2, hc(look, 3, '#808890')), '#333', lw); return { eyes: [0, 0.05], w: 0.17 }; },
    hood: function (x, look, lw) { var c = hc(look, 0, '#555'); P.ball(x, 0, 0, 0.21, 0.22, c, { line: outline(c), lw: lw }); E(x, 0, 0.03, 0.13, 0.13, '#0a0a10'); return { eyes: [0, 0.03], w: 0.13, glowEyes: true }; },
    eye: function (x, look, lw) { E(x, 0, 0, 0.22, 0.15, '#f8f4f0', '#888', lw); E(x, 0, 0, 0.1, 0.1, hc(look, 3, '#3070c0')); E(x, 0, 0, 0.05, 0.05, '#111'); E(x, -0.03, -0.03, 0.02, 0.02, '#fff'); return null; },
    box: function (x, look, lw) { P.box(x, -0.2, -0.22, 0.4, 0.3, 0.12, '#c8a070', '#a07848', { line: '#5a3a20', lw: lw }); return { eyes: [0, 0.05], w: 0.15 }; },
    moon: function (x, look, lw) { P.ball(x, 0, 0, 0.19, 0.19, '#f4f0c0', { line: '#a09860', lw: lw }); E(x, 0.07, -0.02, 0.15, 0.17, '#20203a'); return { eyes: [-0.07, 0], w: 0.08 }; },
    skull: function (x, look, lw) { P.ball(x, 0, -0.02, 0.18, 0.17, '#e8e4d8', { line: '#888', lw: lw }); P.rr(x, -0.08, 0.1, 0.16, 0.08, 0.02); x.fillStyle = '#e8e4d8'; x.fill(); E(x, -0.07, 0, 0.045, 0.05, '#222'); E(x, 0.07, 0, 0.045, 0.05, '#222'); return null; },
    mirror: function (x, look, lw) { E(x, 0, 0, 0.18, 0.22, '#a0a8b8', '#555', lw); var g = x.createLinearGradient(-0.15, -0.2, 0.15, 0.2); g.addColorStop(0, '#f0f6ff'); g.addColorStop(1, '#8090a8'); E(x, 0, 0, 0.14, 0.18, g); E(x, -0.05, -0.08, 0.04, 0.02, '#fff'); return null; },
    pincushion: function (x, look, lw) { P.ball(x, 0, 0, 0.21, 0.18, '#c03a4a', { line: '#601020', lw: lw }); return null; },
    doorbell: function (x, look, lw) { P.rr(x, -0.16, -0.2, 0.32, 0.4, 0.05); x.fillStyle = '#c8b890'; x.fill(); x.strokeStyle = '#5a4a20'; x.lineWidth = lw; x.stroke(); E(x, 0, 0, 0.08, 0.08, '#e8e0c8', '#5a4a20', lw); E(x, 0, 0, 0.05, 0.05, '#b03030'); return null; },
    cap: function (x, look, lw) { var r = HEADS.round(x, look, lw); path(x, [[-0.2, -0.04], [-0.2, -0.22, 0, -0.23], [0.2, -0.22, 0.2, -0.04]], hc(look, 3, '#203050'), '#101828', lw); P.rr(x, -0.2, -0.07, 0.36, 0.05, 0.02); x.fillStyle = '#101828'; x.fill(); return r; },
    hollow: function (x, look, lw) { HEADS.round(x, look, lw); E(x, 0, 0.02, 0.09, 0.11, '#000'); return null; },
    many: function (x, look, lw) { HEADS.round(x, look, lw); for (var i = 0; i < 7; i++) E(x, -0.12 + (i % 4) * 0.08, -0.05 + Math.floor(i / 4) * 0.09, 0.02, 0.025, '#111'); return null; },
    candle: function (x, look, lw) { P.rr(x, -0.07, -0.1, 0.14, 0.28, 0.03); x.fillStyle = '#f0e8d0'; x.fill(); x.strokeStyle = '#a09070'; x.lineWidth = lw; x.stroke(); E(x, 0, -0.17, 0.035, 0.06, '#ffcc40'); return null; },
    sun: function (x, look, lw) { for (var i = 0; i < 12; i++) { var a = i / 12 * 6.28; P.stroke(x, [[Math.cos(a) * 0.18, Math.sin(a) * 0.18], [Math.cos(a) * 0.26, Math.sin(a) * 0.26]], '#f0b030', lw * 3); } P.ball(x, 0, 0, 0.18, 0.18, '#f8d040', { line: '#a07010', lw: lw }); return { eyes: [0, 0], w: 0.16 }; }
  };
  var BODIES = S.BODIES = {
    dress: function (x, look, top, bot, lw) { var a = hc(look, 0, '#7060a0'); path(x, [[-0.11, top], [0.11, top], [0.24, bot], [-0.24, bot]], shade(x, 0, (top + bot) / 2, 0.24, a), outline(a), lw); },
    coat: function (x, look, top, bot, lw) { var a = hc(look, 0, '#4a4040'); path(x, [[-0.17, top], [0.17, top], [0.2, bot], [-0.2, bot]], shade(x, 0, (top + bot) / 2, 0.2, a), outline(a), lw); P.stroke(x, [[0, top + 0.03], [0, bot]], hc(look, 1, P.sh(a, -0.3)), lw * 1.5); E(x, 0.04, top + 0.12, 0.012, 0.012, '#c8b060'); E(x, 0.04, top + 0.22, 0.012, 0.012, '#c8b060'); },
    suit: function (x, look, top, bot, lw) { var a = hc(look, 0, '#303848'); path(x, [[-0.17, top], [0.17, top], [0.18, bot], [-0.18, bot]], shade(x, 0, (top + bot) / 2, 0.18, a), outline(a), lw); path(x, [[-0.05, top], [0.05, top], [0, top + 0.14]], '#f0f0f0'); path(x, [[-0.012, top + 0.02], [0.012, top + 0.02], [0.02, top + 0.15], [0, top + 0.18], [-0.02, top + 0.15]], hc(look, 3, '#c03030')); },
    robe: function (x, look, top, bot, lw) { var a = hc(look, 0, '#e8e8e8'); path(x, [[-0.14, top], [0.14, top], [0.27, bot], [-0.27, bot]], shade(x, 0, (top + bot) / 2, 0.26, a), outline(a), lw); },
    shirt: function (x, look, top, bot, lw) { var m = top + (bot - top) * 0.55; var a = hc(look, 0, '#c84848'), b = hc(look, 1, '#304060'); path(x, [[-0.15, top], [0.15, top], [0.16, m], [-0.16, m]], shade(x, 0, top, 0.16, a), outline(a), lw); path(x, [[-0.15, m], [0.15, m], [0.14, bot], [-0.14, bot]], b, outline(b), lw); },
    uniform: function (x, look, top, bot, lw) { var a = hc(look, 0, '#2a4a3a'); BODIES.coat(x, look, top, bot, lw); P.stroke(x, [[-0.18, top + 0.12], [0.18, top + 0.12]], hc(look, 3, '#d8b040'), lw * 2.5); },
    apron: function (x, look, top, bot, lw) { BODIES.coat(x, look, top, bot, lw); path(x, [[-0.12, top + 0.06], [0.12, top + 0.06], [0.14, bot], [-0.14, bot]], hc(look, 1, '#f0f0f0'), '#999', lw); },
    stick: function (x, look, top, bot, lw) { P.stroke(x, [[0, top], [0, bot]], hc(look, 0, '#3a8a3a'), lw * 4); P.leaf(x, -0.08, (top + bot) / 2, 0.16, -0.5, hc(look, 0, '#3a8a3a')); P.leaf(x, 0.08, (top + bot) / 2 + 0.06, 0.16, 0.5, P.sh(hc(look, 0, '#3a8a3a'), 0.15)); },
    blob: function (x, look, top, bot, lw) { var a = hc(look, 0, '#9070b0'); P.ball(x, 0, (top + bot) / 2, 0.24, (bot - top) / 1.6, a, { line: outline(a), lw: lw }); },
    long: function (x, look, top, bot, lw) { var a = hc(look, 0, '#101010'); path(x, [[-0.1, top], [0.1, top], [0.17, bot], [-0.17, bot]], a, outline(a), lw); },
    sweater: function (x, look, top, bot, lw) { var m = top + (bot - top) * 0.62, a = hc(look, 0, '#c0a070'); path(x, [[-0.17, top], [0.17, top], [0.2, m], [-0.2, m]], shade(x, 0, top, 0.2, a), outline(a), lw); path(x, [[-0.14, m], [0.14, m], [0.14, bot], [-0.14, bot]], hc(look, 1, '#404040')); },
    hanbok: function (x, look, top, bot, lw) { var a = hc(look, 0, '#d05070'), b = hc(look, 1, '#f0e8d8'); path(x, [[-0.13, top + 0.12], [0.13, top + 0.12], [0.28, bot], [-0.28, bot]], shade(x, 0, bot, 0.28, a), outline(a), lw); path(x, [[-0.14, top], [0.14, top], [0.15, top + 0.14], [-0.15, top + 0.14]], b, outline(b), lw); P.stroke(x, [[0, top + 0.08], [0.06, top + 0.24]], hc(look, 3, '#c03050'), lw * 3); },
    none: function () { }
  };
  function legs(x, look, bot, ph, moving, lw) {
    if (look.legs === false) return;
    var lc = look.legs || '#2a2a30', sw = Math.sin(ph * 6.28) * (moving ? 1 : 0);
    [-1, 1].forEach(function (k) { var up = Math.max(0, sw * k) * 0.04; P.rr(x, k * 0.065 - 0.027, bot - 0.01, 0.054, -bot - 0.03 - up, 0.02); x.fillStyle = lc; x.fill(); E(x, k * 0.065, -0.02 - up, 0.045, 0.025, P.sh(lc, -0.3)); });
  }
  function eyes(x, e, look, kind, lw) {
    if (!e) return;
    if (S.EYES_X && S.EYES_X[kind]) { S.EYES_X[kind](x, e, look, lw, S._t || 0); return; }
    var ex = e.eyes[0], ey = e.eyes[1], w = e.w || 0.18, col = look.eyeColor || hc(look, 3, '#111');
    var dx = w * 0.42;
    switch (kind || 'dots') {
      case 'none': return;
      case 'closed': [-1, 1].forEach(function (k) { path(x, [[ex + k * dx - 0.03, ey], [ex + k * dx, ey + 0.02, ex + k * dx + 0.03, ey]], null, '#2a2020', lw * 1.6, false); }); return;
      case 'line': P.stroke(x, [[ex - dx - 0.03, ey], [ex + dx + 0.03, ey]], '#1a1010', lw * 2); return;
      case 'glow': [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.035, 0.02, col); E(x, ex + k * dx, ey, 0.06, 0.04, P.rgba(col, 0.3)); }); return;
      case 'x': [-1, 1].forEach(function (k) { P.stroke(x, [[ex + k * dx - 0.025, ey - 0.025], [ex + k * dx + 0.025, ey + 0.025]], '#111', lw * 1.8); P.stroke(x, [[ex + k * dx + 0.025, ey - 0.025], [ex + k * dx - 0.025, ey + 0.025]], '#111', lw * 1.8); }); return;
      case 'spiral': [-1, 1].forEach(function (k) { x.strokeStyle = '#a040c0'; x.lineWidth = lw; x.beginPath(); for (var a = 0; a < 12; a += 0.4) x.lineTo(ex + k * dx + Math.cos(a) * a * 0.003, ey + Math.sin(a) * a * 0.003); x.stroke(); }); return;
      case 'one': E(x, ex, ey, 0.04, 0.05, '#111'); E(x, ex - 0.012, ey - 0.018, 0.012, 0.012, '#fff'); return;
      case 'sad': [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey + 0.01, 0.025, 0.035, '#1a1418'); P.stroke(x, [[ex + k * dx - 0.035, ey - 0.05 + k * 0.012], [ex + k * dx + 0.035, ey - 0.05 - k * 0.012]], '#3a2a28', lw * 1.3); }); return;
      case 'wide': [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.045, 0.05, '#fff', '#333', lw); E(x, ex + k * dx, ey, 0.02, 0.025, '#111'); }); return;
      case 'big': [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.04, 0.055, '#1a1420'); E(x, ex + k * dx - 0.013, ey - 0.02, 0.014, 0.016, '#fff'); }); return;
      default: [-1, 1].forEach(function (k) { E(x, ex + k * dx, ey, 0.024, 0.032, '#1a1418'); E(x, ex + k * dx - 0.008, ey - 0.012, 0.008, 0.008, 'rgba(255,255,255,0.8)'); });
    }
  }
  function mouth(x, e, kind, lw) {
    if (!e || !kind || kind === 'none') return;
    if (S.MOUTH_X && S.MOUTH_X[kind]) { S.MOUTH_X[kind](x, e, lw, S._t || 0); return; }
    var cx = e.eyes[0], cy = e.eyes[1] + 0.09;
    switch (kind) {
      case 'smile': path(x, [[cx - 0.04, cy - 0.005], [cx, cy + 0.03, cx + 0.04, cy - 0.005]], null, '#6a2020', lw * 1.6, false); break;
      case 'painted': path(x, [[cx - 0.08, cy - 0.02], [cx, cy + 0.05, cx + 0.08, cy - 0.02]], null, '#e02828', lw * 3.5, false); break;
      case 'frown': path(x, [[cx - 0.04, cy + 0.015], [cx, cy - 0.015, cx + 0.04, cy + 0.015]], null, '#4a2020', lw * 1.6, false); break;
      case 'o': E(x, cx, cy, 0.022, 0.028, '#3a1010'); break;
      case 'grin': path(x, [[cx - 0.07, cy - 0.01], [cx, cy + 0.06, cx + 0.07, cy - 0.01]], '#fff', '#3a1010', lw * 1.4); break;
      case 'stitch': P.stroke(x, [[cx - 0.06, cy], [cx + 0.06, cy]], '#3a1010', lw * 1.5); for (var i = -2; i <= 2; i++) P.stroke(x, [[cx + i * 0.025, cy - 0.015], [cx + i * 0.025, cy + 0.015]], '#3a1010', lw); break;
      case 'line': P.stroke(x, [[cx - 0.03, cy], [cx + 0.03, cy]], '#4a2020', lw * 1.4); break;
    }
  }
  function hair(x, look, lw) {
    if (!look.hair) return;
    var h = look.hair, st = look.hairStyle || 'short', l = outline(h);
    if (st === 'short') path(x, [[-0.2, 0.0], [-0.21, -0.22, 0, -0.23], [0.21, -0.22, 0.2, 0.0], [0.12, -0.1], [-0.12, -0.1]], h, l, lw);
    else if (st === 'long') { path(x, [[-0.22, 0.32], [-0.24, -0.24, 0, -0.25], [0.24, -0.24, 0.22, 0.32], [0.15, 0.3], [0.15, -0.08], [-0.15, -0.08], [-0.15, 0.3]], h, l, lw); }
    else if (st === 'bun') { path(x, [[-0.2, -0.02], [-0.21, -0.22, 0, -0.22], [0.21, -0.22, 0.2, -0.02], [0, -0.12]], h, l, lw); P.ball(x, 0, -0.27, 0.09, 0.08, h, { line: l, lw: lw }); }
    else if (st === 'braids') { path(x, [[-0.2, 0.0], [-0.21, -0.22, 0, -0.23], [0.21, -0.22, 0.2, 0.0], [0, -0.12]], h, l, lw); [-1, 1].forEach(function (k) { for (var i = 0; i < 4; i++) P.ball(x, k * 0.2, 0.06 + i * 0.07, 0.04, 0.04, h, { line: l, lw: lw }); }); }
    else if (st === 'spiky') { path(x, [[-0.2, -0.02], [-0.24, -0.2], [-0.12, -0.18], [-0.1, -0.3], [0, -0.2], [0.1, -0.3], [0.12, -0.18], [0.24, -0.2], [0.2, -0.02], [0, -0.12]], h, l, lw); }
    else if (st === 'over') { path(x, [[-0.22, 0.2], [-0.23, -0.24, 0, -0.25], [0.23, -0.24, 0.22, 0.2], [0, 0.22]], h, l, lw); }
  }
  function hat(x, look, lw) {
    var h = look.hat; if (!h) return;
    var col = look.hatColor || '#303030';
    if (h === 'cap' || h === true) { path(x, [[-0.19, -0.1], [-0.19, -0.24, 0, -0.25], [0.19, -0.24, 0.19, -0.1]], col, outline(col), lw); P.rr(x, -0.05, -0.12, 0.28, 0.05, 0.02); x.fillStyle = P.sh(col, -0.2); x.fill(); }
    else if (h === 'tophat') { P.rr(x, -0.13, -0.5, 0.26, 0.32, 0.03); x.fillStyle = shade(x, 0, -0.35, 0.13, col); x.fill(); P.rr(x, -0.22, -0.2, 0.44, 0.05, 0.02); x.fillStyle = col; x.fill(); }
    else if (h === 'beret') { E(x, 0.03, -0.18, 0.2, 0.08, col, outline(col), lw, -0.15); }
    else if (h === 'conductor') { P.rr(x, -0.18, -0.32, 0.36, 0.14, 0.04); x.fillStyle = shade(x, 0, -0.25, 0.18, col); x.fill(); P.rr(x, -0.2, -0.19, 0.4, 0.04, 0.02); x.fillStyle = '#101010'; x.fill(); E(x, 0, -0.26, 0.025, 0.025, '#d8b040'); }
    else if (h === 'bow') { path(x, [[0.1, -0.18], [0.2, -0.24], [0.2, -0.12]], col); path(x, [[0.1, -0.18], [0.0, -0.24], [0.0, -0.12]], col); }
    else if (h === 'crown') { path(x, [[-0.13, -0.16], [-0.13, -0.28], [-0.06, -0.21], [0, -0.3], [0.06, -0.21], [0.13, -0.28], [0.13, -0.16]], '#e0c040', '#8a6a10', lw); }
    else if (h === 'straw') { E(x, 0, -0.16, 0.3, 0.07, '#d8c070', '#8a7030', lw); P.ball(x, 0, -0.22, 0.15, 0.08, '#e0c880'); }
    else if (h === 'beanie') { path(x, [[-0.19, -0.08], [-0.19, -0.26, 0, -0.27], [0.19, -0.26, 0.19, -0.08]], col, outline(col), lw); P.ball(x, 0, -0.29, 0.04, 0.04, '#f0f0f0'); }
    else if (h === 'nurse') { P.rr(x, -0.12, -0.27, 0.24, 0.09, 0.02); x.fillStyle = '#f8f8f8'; x.fill(); P.stroke(x, [[-0.025, -0.225], [0.025, -0.225]], '#d03030', lw * 3); P.stroke(x, [[0, -0.25], [0, -0.2]], '#d03030', lw * 3); }
    else if (h === 'horns') { [-1, 1].forEach(function (k) { path(x, [[k * 0.12, -0.15], [k * 0.22, -0.34], [k * 0.06, -0.18]], col); }); }
    else if (h === 'antenna') { P.stroke(x, [[0, -0.18], [0, -0.38]], '#999', lw * 2); P.ball(x, 0, -0.4, 0.035, 0.035, '#f04040'); }
  }
  function prop(x, look, lw, t) {
    var a = look.acc; if (!a) return;
    var col = look.accColor;
    x.save(); x.translate(0.24, -0.5);
    switch (a) {
      case 'umbrella': x.restore(); x.save(); P.stroke(x, [[0.12, -0.5], [0.12, -1.6]], '#222', lw * 2); path(x, [[-0.4, -1.5], [-0.3, -1.85, 0.12, -1.88], [0.54, -1.85, 0.64, -1.5]], col || '#303040', '#111', lw); break;
      case 'cane': P.stroke(x, [[0, -0.1], [0, 0.48]], '#6a4a2a', lw * 3); path(x, [[0, -0.1], [-0.05, -0.18, -0.1, -0.1]], null, '#6a4a2a', lw * 3, false); break;
      case 'bag': P.rr(x, -0.06, 0.05, 0.13, 0.15, 0.03); x.fillStyle = col || '#7a5030'; x.fill(); break;
      case 'book': P.rr(x, -0.08, 0, 0.16, 0.12, 0.01); x.fillStyle = col || '#a03030'; x.fill(); P.rr(x, -0.07, 0.01, 0.02, 0.1, 0.01); x.fillStyle = '#f0e8d8'; x.fill(); break;
      case 'lantern': ACC.lantern(x, { v: 'front' }, 0, 0, t || 0, lw); break;
      case 'flower': P.stroke(x, [[0, 0.1], [0, -0.1]], '#4a9a40', lw * 2); P.flower(x, 0, -0.12, 0.05, col || '#f070a0'); break;
      case 'balloon': P.stroke(x, [[0, 0.05], [0.05, -0.8]], '#ccc', lw); P.ball(x, 0.05, -0.92, 0.12, 0.14, col || '#e05050', { hi: 0.35 }); break;
      case 'sign': P.stroke(x, [[0, 0.3], [0, -0.3]], '#6a4a2a', lw * 3); P.rr(x, -0.18, -0.5, 0.36, 0.22, 0.02); x.fillStyle = '#f0e8d0'; x.fill(); x.strokeStyle = '#6a4a2a'; x.lineWidth = lw; x.stroke(); break;
      case 'phone': P.rr(x, -0.03, -0.05, 0.06, 0.1, 0.01); x.fillStyle = '#222'; x.fill(); break;
      case 'ticket': ACC.ticket(x, { v: 'front' }, 0, 0, 0, lw); break;
      case 'suitcase': ACC.suitcase(x, { v: 'front' }, 0, 0, 0, lw); break;
      case 'broom': P.stroke(x, [[0, -0.5], [0, 0.4]], '#8a6a3a', lw * 2.5); path(x, [[-0.08, 0.4], [0.08, 0.4], [0.12, 0.6], [-0.12, 0.6]], '#c0a050'); break;
      case 'newspaper': x.rotate(-0.2); P.rr(x, -0.12, -0.08, 0.24, 0.16, 0.01); x.fillStyle = '#e8e8e0'; x.fill(); for (var i = 0; i < 3; i++) P.stroke(x, [[-0.09, -0.04 + i * 0.04], [0.09, -0.04 + i * 0.04]], i === 1 ? '#111' : '#888', lw * (i === 1 ? 3 : 1)); break;
      case 'coffee': P.rr(x, -0.04, -0.04, 0.08, 0.1, 0.02); x.fillStyle = '#f0f0f0'; x.fill(); E(x, 0, -0.04, 0.04, 0.012, '#5a3a20'); break;
      case 'briefcase': P.rr(x, -0.1, 0.02, 0.2, 0.14, 0.02); x.fillStyle = '#3a2a20'; x.fill(); break;
      case 'scissors': x.rotate(0.6); P.stroke(x, [[-0.1, 0], [0.12, 0.02]], '#ccc', lw * 2); P.stroke(x, [[-0.1, 0.03], [0.12, -0.02]], '#bbb', lw * 2); E(x, -0.12, 0.0, 0.03, 0.03, null, '#d33', lw * 2); break;
      case 'needle': P.stroke(x, [[0, -0.25], [0, 0.1]], '#ddd', lw * 1.5); break;
      case 'seeds': P.rr(x, -0.05, 0, 0.1, 0.12, 0.03); x.fillStyle = '#c8a070'; x.fill(); for (var k = 0; k < 3; k++) E(x, -0.02 + k * 0.02, 0.05, 0.01, 0.014, '#6a4a2a'); break;
      case 'crane': ACC.crane(x, { v: 'front' }, 0, 0, 0, lw, 0.86); break;
      case 'map': P.rr(x, -0.12, -0.07, 0.24, 0.16, 0.01); x.fillStyle = '#e8d8a8'; x.fill(); P.stroke(x, [[-0.08, 0.04], [0, -0.02], [0.07, 0.03]], '#c04040', lw); break;
      case 'tray': P.stroke(x, [[-0.15, 0], [0.12, 0]], '#aaa', lw * 3); break;
      case 'baton': P.stroke(x, [[0, -0.15], [0, 0.05]], '#f0f0f0', lw * 2); break;
      case 'clipboard': P.rr(x, -0.08, -0.08, 0.16, 0.2, 0.01); x.fillStyle = '#c8a878'; x.fill(); P.rr(x, -0.06, -0.05, 0.12, 0.14, 0.01); x.fillStyle = '#f8f8f0'; x.fill(); break;
      case 'candle': P.rr(x, -0.025, -0.05, 0.05, 0.14, 0.01); x.fillStyle = '#f0e8d0'; x.fill(); E(x, 0, -0.08, 0.018, 0.03, '#ffb030'); break;
      case 'drum': E(x, 0, 0.05, 0.12, 0.05, '#f0f0f0'); P.rr(x, -0.12, 0.05, 0.24, 0.12, 0.01); x.fillStyle = '#c04040'; x.fill(); break;
      case 'lamp': P.stroke(x, [[0, 0.1], [0, -0.3]], '#555', lw * 2); P.ball(x, 0, -0.35, 0.08, 0.06, '#fff0a0'); break;
      case 'mic': ACC.mic(x, { v: 'front' }, 0, 0, 0, lw); break;
      case 'stamp': ACC.stamp(x, { v: 'front' }, 0, 0, 0, lw); break;
      case 'tablet': P.rr(x, -0.1, -0.07, 0.2, 0.14, 0.02); x.fillStyle = '#202830'; x.fill(); P.rr(x, -0.08, -0.05, 0.16, 0.1, 0.01); x.fillStyle = '#60c0f0'; x.fill(); break;
      case 'flag': P.stroke(x, [[0, 0.3], [0, -0.6]], '#888', lw * 2); path(x, [[0, -0.6], [0.25, -0.53], [0, -0.45]], col || '#d03030'); break;
    }
    x.restore();
  }
  /* animaux */
  var ANIMALS = S.ANIMALS = {
    cat: function (x, look, ph, mv, t, lw) { FORMS.cat(x, { v: 'front', m: 1 }, ph, mv ? 1 : 0, t, null, lw); },
    bird: function (x, look, ph, mv, t, lw) { var k = hc(look, 0, '#1b1b22'), hop = mv ? Math.abs(Math.sin(ph * 6.28)) * 0.05 : 0; x.translate(0, -hop); E(x, 0, -0.14, 0.13, 0.1, k, outline(k), lw); E(x, 0.09, -0.24, 0.07, 0.065, k); path(x, [[0.15, -0.25], [0.22, -0.235], [0.15, -0.22]], hc(look, 3, '#e8a53a')); E(x, 0.11, -0.255, 0.013, 0.013, '#fff'); E(x, 0.113, -0.255, 0.006, 0.006, '#111'); path(x, [[-0.1, -0.15], [-0.24, -0.2], [-0.12, -0.09]], P.sh(k, 0.1)); P.stroke(x, [[-0.02, -0.05], [-0.03, 0]], '#c08020', lw * 2); P.stroke(x, [[0.04, -0.05], [0.04, 0]], '#c08020', lw * 2); },
    fish: function (x, look, ph, mv, t) { var c = hc(look, 0, '#e07040'), sw = Math.sin(t * 6) * 0.1; P.ball(x, 0, -0.1, 0.17, 0.09, c, { hi: 0.3 }); path(x, [[-0.15, -0.1], [-0.27, -0.18 + sw], [-0.27, -0.02 + sw]], P.sh(c, -0.1)); E(x, 0.09, -0.12, 0.018, 0.018, '#fff'); E(x, 0.095, -0.12, 0.009, 0.009, '#111'); },
    dog: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#a07040'), sw = Math.sin(ph * 6.28) * (mv ? 1 : 0); [-0.12, -0.05, 0.08, 0.15].forEach(function (q, i) { P.rr(x, q - 0.02, -0.15 + (i % 2 ? sw : -sw) * 0.02, 0.04, 0.15, 0.02); x.fillStyle = P.sh(c, -0.15); x.fill(); }); P.ball(x, 0, -0.22, 0.22, 0.1, c, { line: outline(c), lw: lw }); P.ball(x, 0.2, -0.33, 0.1, 0.09, c, { line: outline(c), lw: lw }); E(x, 0.16, -0.4, 0.04, 0.07, P.sh(c, -0.3), null, 0, 0.4); E(x, 0.23, -0.34, 0.014, 0.014, '#111'); E(x, 0.29, -0.31, 0.02, 0.016, '#222'); path(x, [[-0.2, -0.25], [-0.3, -0.36 + Math.sin(t * 8) * 0.04], [-0.22, -0.22]], c); },
    rabbit: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#f0f0f0'), hop = mv ? Math.abs(Math.sin(ph * 6.28)) * 0.07 : 0; x.translate(0, -hop); P.ball(x, 0, -0.14, 0.14, 0.13, c, { line: '#999', lw: lw }); P.ball(x, 0, -0.32, 0.1, 0.09, c, { line: '#999', lw: lw }); [-1, 1].forEach(function (k) { E(x, k * 0.05, -0.47, 0.03, 0.09, c, '#999', lw, k * 0.15); E(x, k * 0.05, -0.47, 0.014, 0.06, '#f0b0c0', null, 0, k * 0.15); }); E(x, -0.035, -0.33, 0.012, 0.014, '#d04060'); E(x, 0.035, -0.33, 0.012, 0.014, '#d04060'); },
    snail: function (x, look, ph, mv, t, lw) { var b = hc(look, 1, '#c8b890'), sh2 = hc(look, 0, '#b07040'), st = Math.sin(t * 2) * 0.01; P.rr(x, -0.22, -0.08, 0.4, 0.08, 0.04); x.fillStyle = b; x.fill(); x.strokeStyle = outline(b); x.lineWidth = lw; x.stroke(); P.stroke(x, [[0.13, -0.08], [0.18, -0.22 + st]], b, lw * 3); P.stroke(x, [[0.16, -0.08], [0.24, -0.2 + st]], b, lw * 3); E(x, 0.18, -0.23 + st, 0.015, 0.015, '#111'); E(x, 0.24, -0.21 + st, 0.015, 0.015, '#111'); P.ball(x, -0.03, -0.18, 0.14, 0.13, sh2, { line: outline(sh2), lw: lw }); x.strokeStyle = P.sh(sh2, -0.3); x.lineWidth = lw * 1.5; x.beginPath(); for (var a = 0; a < 11; a += 0.3) x.lineTo(-0.03 + Math.cos(a) * a * 0.011, -0.18 + Math.sin(a) * a * 0.011); x.stroke(); if (look.hat) { P.rr(x, -0.1, -0.36, 0.16, 0.06, 0.02); x.fillStyle = look.hatColor || '#2a4a8a'; x.fill(); P.rr(x, -0.13, -0.31, 0.22, 0.025, 0.01); x.fill(); } },
    bee: function (x, look, ph, mv, t, lw) { var f = Math.sin(t * 30) * 0.5; E(x, 0, -0.35, 0.13, 0.09, '#e8c030', '#6a4a10', lw); [-0.04, 0.04].forEach(function (k) { P.stroke(x, [[k, -0.43], [k, -0.27]], '#222', lw * 3); }); E(x, -0.06, -0.46 - f * 0.02, 0.07, 0.04, 'rgba(220,240,255,0.7)', null, 0, -0.5); E(x, 0.06, -0.46 + f * 0.02, 0.07, 0.04, 'rgba(220,240,255,0.7)', null, 0, 0.5); E(x, 0.12, -0.36, 0.015, 0.015, '#111'); },
    worm: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#e0a0a0'); for (var i = 0; i < 6; i++) P.ball(x, -0.18 + i * 0.07, -0.05 - Math.abs(Math.sin(t * 3 + i)) * 0.03, 0.05, 0.045, look.glow && i === 0 ? '#f8ff90' : c, { line: outline(c), lw: lw * 0.7 }); E(x, 0.18, -0.07, 0.012, 0.012, '#111'); },
    frog: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#50a050'); P.ball(x, 0, -0.12, 0.17, 0.11, c, { line: outline(c), lw: lw }); [-1, 1].forEach(function (k) { P.ball(x, k * 0.08, -0.22, 0.05, 0.05, c); E(x, k * 0.08, -0.23, 0.025, 0.025, '#111'); }); P.stroke(x, [[-0.08, -0.08], [0.08, -0.08]], '#305030', lw); },
    moth: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#c8b8a0'), f = Math.sin(t * 14) * 0.15; E(x, 0, -0.45, 0.025, 0.09, '#8a7a60'); [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.02, -0.47); x.scale(k, 1); x.rotate(f); E(x, 0.1, -0.02, 0.1, 0.07, c, outline(c), lw); E(x, 0.1, -0.02, 0.025, 0.025, P.sh(c, -0.3)); x.restore(); }); },
    whale: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#3a5a8a'); P.ball(x, 0, -0.3, 0.6, 0.24, c, { line: outline(c), lw: lw }); path(x, [[-0.55, -0.3], [-0.85, -0.5 + Math.sin(t * 2) * 0.05], [-0.8, -0.18]], c); E(x, 0.38, -0.32, 0.03, 0.03, '#fff'); E(x, 0.38, -0.32, 0.015, 0.015, '#111'); P.ellipse(x, 0.1, -0.15, 0.4, 0.08, P.sh(c, 0.25)); },
    deer: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#a0784a'); [-0.15, -0.08, 0.08, 0.15].forEach(function (q) { P.rr(x, q - 0.015, -0.3, 0.03, 0.3, 0.01); x.fillStyle = P.sh(c, -0.1); x.fill(); }); P.ball(x, 0, -0.38, 0.22, 0.1, c, { line: outline(c), lw: lw }); P.ball(x, 0.22, -0.55, 0.08, 0.1, c, { line: outline(c), lw: lw }); P.stroke(x, [[0.2, -0.63], [0.15, -0.82], [0.1, -0.78]], '#6a4a2a', lw * 2); P.stroke(x, [[0.25, -0.63], [0.3, -0.82], [0.36, -0.78]], '#6a4a2a', lw * 2); E(x, 0.26, -0.56, 0.014, 0.014, '#111'); },
    jelly: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, 'rgba(200,160,255,0.8)'), b = Math.sin(t * 2) * 0.03; path(x, [[-0.18, -0.4 + b], [-0.18, -0.65, 0, -0.66], [0.18, -0.65, 0.18, -0.4 + b]], c); for (var i = 0; i < 5; i++) { var px = -0.14 + i * 0.07; path(x, [[px, -0.4 + b], [px + Math.sin(t * 3 + i) * 0.04, -0.2], [px, -0.05]], null, c, lw * 2, false); } },
    owl: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#8a6a4a'); P.ball(x, 0, -0.25, 0.16, 0.22, c, { line: outline(c), lw: lw }); [-1, 1].forEach(function (k) { E(x, k * 0.065, -0.33, 0.05, 0.05, '#f0e0a0'); E(x, k * 0.065, -0.33, 0.022, 0.022, '#111'); path(x, [[k * 0.1, -0.44], [k * 0.15, -0.52], [k * 0.05, -0.45]], c); }); path(x, [[-0.02, -0.28], [0.02, -0.28], [0, -0.24]], '#d0a030'); },
    crow: function (x, look, ph, mv, t, lw) { ANIMALS.bird(x, { c: ['#121216', 0, 0, '#444'] }, ph, mv, t, lw); },
    ant: function (x, look, ph, mv, t, lw) { var c = hc(look, 0, '#301818'); P.ball(x, -0.1, -0.06, 0.05, 0.04, c); P.ball(x, 0, -0.06, 0.04, 0.03, c); P.ball(x, 0.09, -0.07, 0.06, 0.05, c); }
  };

  /* dessin d'un PNJ ; cache par (look, image) */
  S.drawCreature = function (x, s, look, o) {
    o = o || {};
    look = look || {};
    var t = look.t || 'humanoid', ph = o.phase || 0, mv = !!o.moving, time = o.time || 0;
    var lw = Math.max(1, s * 0.013) / s;
    x.save();
    var sc = look.scale || ((look.h || 24) / 24);
    if (t !== 'ghost' && t !== 'shadow' && t !== 'voice' && look.shadow !== false) P.shadow(x, 0, 0, s * 0.24 * Math.min(1.6, sc), s * 0.08, 0.3);
    x.scale(s, s);
    if (o.flip) x.scale(-1, 1);
    if (t === 'humanoid' || t === 'kid' || t === 'adult' || t === 'old' || t === 'tall' || t === 'doll' || t === 'mannequin' || t === 'robot') {
      var hgt = t === 'kid' ? 1.05 : t === 'tall' ? 1.9 : t === 'old' ? 1.25 : 1.35;
      hgt *= Math.max(0.6, Math.min(1.6, sc));
      var bob = mv ? -Math.abs(Math.sin(ph * 6.28)) * 0.025 : Math.sin(time * 2 + (o.seed || 0)) * 0.006;
      var headY = -hgt + 0.2, bodyTop = -hgt + 0.42, bodyBot = -0.3, HX = S.HORROR;
      if (t === 'tall') { bodyBot = -0.04; }
      S._t = time;
      if (look.neck) headY -= look.neck;
      if (look.hunch) headY = bodyTop + 0.04;
      if (look.float) x.translate(0, -0.14 - Math.sin(time * 1.6) * 0.03);
      var GEO = { headY: headY, bodyTop: bodyTop, bodyBot: bodyBot, hgt: hgt };
      if (HX) HX.behind(x, look, GEO, time, lw);
      if (look.body !== 'robe' && look.body !== 'blob' && look.body !== 'long' && t !== 'tall') legs(x, look, bodyBot, ph, mv, lw);
      x.translate(0, bob);
      if (look.arms !== false && look.body !== 'none' && look.body !== 'blob' && look.body !== 'stick') {
        var ac = hc(look, 1, '#3a3030'), sw = Math.sin(ph * 6.28) * (mv ? 0.15 : 0), aLen = (bodyBot - bodyTop) * 0.8 * (look.longArms ? (look.longArms === true ? 2.1 : look.longArms) : 1);
        if (HX && look.manyArms) HX.manyArms(x, look, GEO, time, lw, ac);
        [-1, 1].forEach(function (k) { x.save(); x.translate(k * 0.16, bodyTop + 0.04); x.rotate(-sw * k + (look.longArms ? k * 0.06 : 0)); P.rr(x, -0.035, 0, 0.07, aLen, 0.03); x.fillStyle = ac; x.fill(); x.strokeStyle = outline(ac); x.lineWidth = lw; x.stroke(); if (look.claws && HX) HX.claws(x, 0, aLen, hc(look, 2, '#f0d0b8'), lw, time, k); else if (look.hands !== false) E(x, 0, aLen, 0.035, 0.035, hc(look, 2, '#f0d0b8')); x.restore(); });
      }
      if (look.thin) { x.save(); x.scale(look.thin === true ? 0.62 : look.thin, 1); }
      (BODIES[look.body || 'coat'] || BODIES.coat)(x, look, bodyTop, bodyBot, lw);
      if (look.thin) x.restore();
      if (HX) HX.neck(x, look, GEO, time, lw);
      x.save(); x.translate(0, headY); if (look.headScale) x.scale(look.headScale, look.headScale); if (look.tilt) x.rotate(look.tilt + (look.tiltSway ? Math.sin(time * 1.3) * look.tiltSway : 0));
      if (look.hairStyle === 'long' || look.hairStyle === 'over') hair(x, look, lw);
      var hd = (HEADS[look.head || 'round'] || HEADS.round)(x, look, lw);
      if (look.hairStyle !== 'long' && look.hairStyle !== 'over') hair(x, look, lw);
      if (hd && look.hairStyle !== 'over') {
        if (hd.holes) { E(x, -0.07, 0, 0.035, 0.04, '#1a1410'); E(x, 0.07, 0, 0.035, 0.04, '#1a1410'); }
        else eyes(x, hd, look, look.eyes, lw);
        mouth(x, hd, look.mouth || (hd.painted ? 'painted' : null), lw);
      }
      hat(x, look, lw);
      if (HX) HX.head(x, look, GEO, time, lw);
      x.restore();
      if (HX) HX.after(x, look, GEO, time, lw);
      if (t === 'robot') { P.stroke(x, [[-0.1, bodyTop + 0.15], [0.1, bodyTop + 0.15]], '#60e0ff', lw * 3); }
      prop(x, look, lw, time);
      if (t === 'mannequin') { x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(230,220,210,0.55)'; x.fillRect(-0.4, -hgt - 0.3, 0.8, hgt + 0.3); x.globalCompositeOperation = 'source-over'; }
    } else if (t === 'ghost') {
      var g = hc(look, 0, 'rgba(230,230,255,0.75)'), fl = Math.sin(time * 2) * 0.04; S._t = time;
      if (S.HORROR) S.HORROR.behind(x, look, { headY: -0.65, bodyTop: -0.8, bodyBot: -0.1, hgt: 1 }, time, lw);
      path(x, [[-0.2, -0.15 + fl], [-0.22, -0.9 + fl, 0, -0.95 + fl], [0.22, -0.9 + fl, 0.2, -0.15 + fl], [0.13, -0.08 + fl], [0.07, -0.17 + fl], [0, -0.08 + fl], [-0.07, -0.17 + fl], [-0.13, -0.08 + fl]], g);
      eyes(x, { eyes: [0, -0.65 + fl], w: 0.15 }, look, look.eyes || 'big', lw);
    } else if (t === 'blob') {
      var bc = hc(look, 0, '#a070c0'), b2 = Math.sin(time * 3) * 0.02;
      P.ball(x, 0, -0.2 + b2, 0.24 * sc, (0.2 - b2) * sc, bc, { hi: 0.3, line: outline(bc), lw: lw });
      eyes(x, { eyes: [0, -0.25], w: 0.14 }, look, look.eyes || 'dots', lw); mouth(x, { eyes: [0, -0.25] }, look.mouth, lw);
    } else if (t === 'shadow' || t === 'voice') {
      var sc2 = hc(look, 0, 'rgba(8,8,16,0.85)');
      path(x, [[-0.18, 0], [-0.2, -0.9], [-0.12, -1.0], [-0.14, -1.25, 0, -1.3], [0.14, -1.25, 0.12, -1.0], [0.2, -0.9], [0.18, 0]], sc2);
      if (look.eyes) eyes(x, { eyes: [0, -1.12], w: 0.1 }, look, look.eyes, lw);
    } else if (S.CREATURES_X && S.CREATURES_X[t]) {
      S._t = time; S.CREATURES_X[t](x, look, ph, mv, time, lw, sc);
    } else if (ANIMALS[t]) {
      if (sc !== 1) x.scale(Math.min(2.5, Math.max(0.6, sc)), Math.min(2.5, Math.max(0.6, sc)));
      ANIMALS[t](x, look, ph, mv, time, lw);
    } else if (YN.decor && YN.decor.has(t)) {
      x.restore(); x.save();
      var dc = YN.decor.get(t, look, Math.floor(time * 2), s);
      if (dc) x.drawImage(dc.c, -dc.ax, -dc.ay);
    } else { P.ball(x, 0, -0.2, 0.2, 0.2, hc(look, 0, '#c0c0c0')); }
    x.restore();
  };
  S.creature = function (look, frame, o) {
    o = o || {};
    var s = YN.terrain ? YN.terrain.tpx : 64;
    var key = 'C|' + s + '|' + JSON.stringify(look) + '|' + (o.moving ? 'm' + Math.round((o.phase || 0) * 8) : 'i' + (frame % 4)) + '|' + (o.flip ? 1 : 0);
    var c = cache[key];
    if (c) return c;
    var sc = Math.max(1, (look && look.h ? look.h / 24 : 1));
    var W = Math.ceil(s * 1.8 * Math.max(1, sc)), H = Math.ceil(s * 2.6 * Math.max(1, sc));
    if (look && (look.t === 'whale')) { W = s * 2.2; }
    var lt = (look && look.t) || 'humanoid', soft = lt === 'ghost' || lt === 'shadow' || lt === 'voice' || (look && (look.alpha !== undefined || look.ink === false));
    var img = inked(W, H, W / 2, H - s * 0.3, s, function (x) {
      S.drawCreature(x, s, look, { phase: o.phase || 0, moving: o.moving, time: (frame % 4) * 0.4, flip: o.flip });
    }, { ink: !soft, rim: !soft, inkColor: 'rgba(18,10,26,0.8)', inkW: 0.019 });
    if (cacheN > 4000) { cache = S.cache = {}; cacheN = 0; }
    img = P.toGpu ? P.toGpu(img) : img;
    cache[key] = img; cacheN++;
    return img;
  };

  /* ===================== SORCIÈRES ET PRÊTRESSE ===================== */
  S.drawWitch = function (x, s, id, t, mood) {
    var hunt = mood === 'hunt', lw = Math.max(1, s * 0.014) / s, fl = Math.sin(t * 1.6) * 0.04;
    x.save(); P.shadow(x, 0, 0, s * 0.32, s * 0.1, 0.4); x.scale(s, s);
    switch (id) {
      case 'silent': {
        x.translate(0, -0.08 + fl);
        var dg = x.createLinearGradient(0, -1.8, 0, 0); dg.addColorStop(0, '#16141c'); dg.addColorStop(1, 'rgba(16,14,22,0)');
        path(x, [[-0.14, -1.55], [0.14, -1.55], [0.3, -0.25], [0.18, 0], [0, -0.12], [-0.18, 0], [-0.3, -0.25]], dg);
        path(x, [[-0.16, -1.55], [0.16, -1.55], [0.2, -1.1], [-0.2, -1.1]], '#0e0d12');
        P.ball(x, 0, -1.78, 0.15, 0.17, '#e8e6ee', { lo: -0.2 });
        path(x, [[-0.2, -1.7], [-0.2, -2.0, 0, -2.0], [0.2, -2.0, 0.2, -1.7], [0.22, -1.2], [0.12, -1.25], [0.08, -1.6], [0, -1.55], [-0.08, -1.6], [-0.12, -1.25], [-0.22, -1.2]], '#9a9aa8', '#5a5a68', lw);
        P.stroke(x, [[0.0, -1.66], [0.0, -1.5]], '#e8e6ee', lw * 5); E(x, 0, -1.68, 0.03, 0.03, '#e8e6ee');
        if (hunt) { E(x, -0.05, -1.83, 0.02, 0.012, '#ff3040'); E(x, 0.05, -1.83, 0.02, 0.012, '#ff3040'); }
        break; }
      case 'seam': {
        var sw2 = Math.sin(t * 4) * 0.08;
        path(x, [[-0.28, -1.1], [0.28, -1.1], [0.34, -0.05], [-0.34, -0.05]], shade(x, 0, -0.6, 0.3, '#4a3028'), '#1a0c08', lw);
        for (var k = 0; k < 6; k++) { var yy = -1.0 + k * 0.16; P.stroke(x, [[-0.3, yy], [0.3, yy + 0.04]], 'rgba(232,208,112,0.5)', lw); for (var q = -0.25; q < 0.3; q += 0.1) P.stroke(x, [[q, yy - 0.025], [q + 0.02, yy + 0.03]], '#d8d0b0', lw); }
        P.stroke(x, [[-0.3, -1.05], [0.3, -1.0], [0.36, -0.7]], '#e8d070', lw * 6);
        [-1, 1].forEach(function (kk) { x.save(); x.translate(kk * 0.3, -1.0); x.rotate(kk * (0.3 + sw2)); P.rr(x, -0.04, 0, 0.08, 0.6, 0.03); x.fillStyle = '#3a2018'; x.fill(); x.translate(0, 0.62); x.rotate(kk * 0.4); P.stroke(x, [[0, 0], [0.04, 0.25]], '#d8d8e0', lw * 4); P.stroke(x, [[0, 0], [-0.04, 0.25]], '#c8c8d0', lw * 4); x.restore(); });
        P.ball(x, 0, -1.35, 0.26, 0.24, '#b02838', { line: '#500818', lw: lw });
        var r = YN.rng.make(5); for (var i = 0; i < 9; i++) { var a = -Math.PI * (0.1 + r.next() * 0.8), px = Math.cos(a) * 0.22, py = -1.35 + Math.sin(a) * 0.2; P.stroke(x, [[px, py], [px * 1.5, py - 0.1 - r.next() * 0.08]], '#d0d0d0', lw * 1.5); E(x, px * 1.5, py - 0.12, 0.022, 0.022, r.pick(['#e8e050', '#40a0f0', '#f0f0f0', '#60c060'])); }
        if (hunt) { E(x, -0.08, -1.32, 0.03, 0.03, '#fff'); E(x, 0.08, -1.32, 0.03, 0.03, '#fff'); }
        break; }
      case 'copy': {
        var jt = Math.sin(t * 9) * 0.01;
        [-0.07, 0.07].forEach(function (kk) { P.rr(x, kk - 0.04, -0.62, 0.08, 0.6, 0.04); x.fillStyle = shade(x, kk, -0.3, 0.05, '#d8d0c4'); x.fill(); E(x, kk, -0.32, 0.045, 0.03, '#b8b0a4'); });
        P.rr(x, -0.19, -1.3, 0.38, 0.7, 0.12); x.fillStyle = shade(x, 0, -1.0, 0.2, '#ddd5c9'); x.fill(); x.strokeStyle = '#8a8070'; x.lineWidth = lw; x.stroke();
        [-1, 1].forEach(function (kk) { x.save(); x.translate(kk * 0.22, -1.24); x.rotate(kk * (0.1 + jt * 5)); P.rr(x, -0.035, 0, 0.07, 0.56, 0.035); x.fillStyle = '#d8d0c4'; x.fill(); E(x, 0, 0.27, 0.04, 0.025, '#b8b0a4'); x.restore(); });
        E(x, 0, -1.33, 0.05, 0.03, '#b8b0a4');
        var mg = x.createLinearGradient(-0.15, -1.75, 0.15, -1.4); mg.addColorStop(0, '#f4f8ff'); mg.addColorStop(0.5, '#a8b4c8'); mg.addColorStop(1, '#e0e8f4');
        E(x, jt, -1.56, 0.17, 0.21, mg, '#6a7080', lw * 1.5);
        if (hunt) { E(x, -0.06, -1.57, 0.03, 0.04, '#1e1a26'); E(x, 0.06, -1.57, 0.03, 0.04, '#1e1a26'); E(x, -0.07, -1.585, 0.01, 0.012, '#fff'); E(x, 0.05, -1.585, 0.01, 0.012, '#fff'); }
        else E(x, -0.05, -1.62, 0.05, 0.025, 'rgba(255,255,255,0.8)');
        break; }
      case 'bell': {
        path(x, [[-0.24, -1.15], [0.24, -1.15], [0.27, -0.05], [-0.27, -0.05]], shade(x, 0, -0.6, 0.27, '#2a2a38'), '#0a0a12', lw);
        x.strokeStyle = '#1a1a1a'; x.lineWidth = lw * 2; x.beginPath(); for (var c2 = 0; c2 < 30; c2++) { var cx2 = 0.3 + c2 * 0.012, cy2 = -0.9 + c2 * 0.03; x.lineTo(cx2 + Math.cos(c2 * 1.8 + t * 3) * 0.04, cy2 + Math.sin(c2 * 1.8) * 0.02); } x.stroke();
        P.rr(x, -0.19, -1.62, 0.38, 0.48, 0.06); x.fillStyle = shade(x, 0, -1.4, 0.2, '#c8b890'); x.fill(); x.strokeStyle = '#5a4a20'; x.lineWidth = lw; x.stroke();
        E(x, 0, -1.38, 0.1, 0.1, '#e8e0c8', '#5a4a20', lw); E(x, 0, -1.38, 0.065, 0.065, hunt ? '#ff2020' : '#a03030');
        if (hunt) E(x, 0, -1.38, 0.14, 0.14, 'rgba(255,40,40,0.25)');
        break; }
      case 'voyager': {
        path(x, [[-0.22, -1.25], [0.22, -1.25], [0.3, -0.03], [-0.3, -0.03]], shade(x, 0, -0.6, 0.3, '#5a2a2a'), '#2a0a0a', lw);
        P.stroke(x, [[0, -1.2], [0, -0.1]], '#3a1414', lw * 2); [-0.9, -0.7, -0.5].forEach(function (yy) { E(x, 0.05, yy, 0.02, 0.02, '#d8b040'); });
        x.save(); x.translate(0.32, -0.55); x.rotate(Math.sin(t * 2) * 0.05); P.rr(x, -0.02, 0.06, 0.26, 0.22, 0.03); x.fillStyle = '#7a4a2a'; x.fill(); x.strokeStyle = '#3a2010'; x.lineWidth = lw; x.stroke(); x.fillStyle = '#e8d090'; x.font = 'bold 0.1px serif'; x.fillText('J.', 0.07, 0.21); x.restore();
        E(x, 0, -1.48, 0.17, 0.19, '#121218');
        P.rr(x, -0.2, -1.74, 0.4, 0.16, 0.05); x.fillStyle = '#2a3a5a'; x.fill(); P.rr(x, -0.23, -1.6, 0.46, 0.04, 0.02); x.fillStyle = '#101828'; x.fill(); E(x, 0, -1.67, 0.03, 0.03, '#d8b040');
        if (hunt) { E(x, -0.06, -1.47, 0.025, 0.014, '#ffe070'); E(x, 0.06, -1.47, 0.025, 0.014, '#ffe070'); }
        break; }
      case 'priestess': {
        x.translate(0, -0.15 + fl);
        var rg = x.createLinearGradient(0, -2.6, 0, 0.1); rg.addColorStop(0, '#f8f6ee'); rg.addColorStop(0.7, '#e8e4d8'); rg.addColorStop(1, 'rgba(232,228,216,0)');
        path(x, [[-0.2, -2.15], [0.2, -2.15], [0.55, -0.1], [0.3, 0.1], [0, -0.05], [-0.3, 0.1], [-0.55, -0.1]], rg, 'rgba(120,115,100,0.5)', lw);
        [-1, 1].forEach(function (kk) { path(x, [[kk * 0.18, -2.0], [kk * 0.62, -1.2 + Math.sin(t + kk) * 0.04], [kk * 0.5, -1.05], [kk * 0.2, -1.6]], '#f0ede2', 'rgba(120,115,100,0.5)', lw); });
        x.strokeStyle = 'rgba(160,150,130,0.35)'; x.lineWidth = lw; for (var f2 = -0.4; f2 < 0.45; f2 += 0.1) { x.beginPath(); x.moveTo(f2 * 0.4, -2.0); x.lineTo(f2, -0.1); x.stroke(); }
        // œil fermé barré sur la poitrine
        x.strokeStyle = hunt ? '#9a40ff' : '#6a6050'; x.lineWidth = lw * 2.5; x.beginPath(); x.ellipse(0, -1.55, 0.12, 0.05, 0, 0, Math.PI); x.stroke(); P.stroke(x, [[-0.15, -1.48], [0.15, -1.62]], hunt ? '#9a40ff' : '#6a6050', lw * 2.5);
        // tête et voile de journaux barrés
        P.ball(x, 0, -2.3, 0.16, 0.18, '#ece8dc');
        path(x, [[-0.24, -2.55], [0.24, -2.55], [0.3, -1.9], [-0.3, -1.9]], 'rgba(236,232,220,0.95)', '#8a8678', lw);
        for (var b = 0; b < 7; b++) { var yy2 = -2.48 + b * 0.085; x.fillStyle = '#d8d4c8'; x.fillRect(-0.26, yy2, 0.52, 0.06); x.fillStyle = '#121212'; x.fillRect(-0.22 + (b % 3) * 0.05, yy2 + 0.015, 0.25 + (b % 2) * 0.12, 0.03); }
        path(x, [[-0.25, -2.55], [-0.2, -2.72], [-0.1, -2.6], [0, -2.76], [0.1, -2.6], [0.2, -2.72], [0.25, -2.55]], '#d8d0b8', '#6a6050', lw);
        if (hunt) { x.fillStyle = '#9a40ff'; x.fillRect(-0.12, -2.34, 0.24, 0.02); }
        // lanterne d'ombre
        x.save(); x.translate(-0.62, -1.15); x.rotate(Math.sin(t * 1.5) * 0.1); P.stroke(x, [[0, 0], [0, 0.12]], '#333', lw * 2); P.rr(x, -0.08, 0.12, 0.16, 0.22, 0.02); x.fillStyle = '#1a1a22'; x.fill(); E(x, 0, 0.23, 0.05, 0.07, '#4a2a7a'); x.restore();
        break; }
    }
    x.restore();
  };
  S.witch = function (id, frame, mood) {
    var s = YN.terrain ? YN.terrain.tpx : 64;
    var key = 'W|' + s + '|' + id + '|' + (frame % 8) + '|' + (mood || '');
    if (cache[key]) return cache[key];
    var big = id === 'priestess', W = Math.ceil(s * (big ? 1.8 : 1.4)), H = Math.ceil(s * (big ? 3.4 : 2.6));
    var img = inked(W, H, W / 2, H - s * 0.3, s, function (x) { S.drawWitch(x, s, id, (frame % 8) * 0.5, mood); },
      { ink: id !== 'silent' && id !== 'priestess', inkColor: mood === 'hunt' ? 'rgba(60,0,10,0.9)' : 'rgba(10,6,14,0.9)', rim: id !== 'silent' });
    img = P.toGpu ? P.toGpu(img) : img;
    cache[key] = img; cacheN++;
    return img;
  };

  /* ===================== ICÔNES (menus) ===================== */
  S.icon = function (icon, size) {
    size = size || 64;
    var key = 'I|' + JSON.stringify(icon) + '|' + size;
    if (cache[key]) return cache[key];
    var cv = P.mk(size, size), x = cv.x;
    if (size < 22) {
      // en tout petit : un éclat de couleur net, cerné, avec un reflet (lisible même à 9 pixels)
      var hh = YN.rng.hash(JSON.stringify(icon || {})) % 360, cc = (icon && icon.c) || ('hsl(' + hh + ',55%,68%)'), r0 = Math.max(2, Math.floor(size * 0.42)), m0 = Math.floor(size / 2);
      x.fillStyle = '#0c0a10'; x.fillRect(m0 - r0 - 1, m0 - r0, 2 * r0 + 2, 2 * r0); x.fillRect(m0 - r0, m0 - r0 - 1, 2 * r0, 2 * r0 + 2);
      x.fillStyle = cc; x.fillRect(m0 - r0, m0 - r0, 2 * r0, 2 * r0);
      x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(m0 - r0, m0 + r0 - 1, 2 * r0, 1); x.fillRect(m0 + r0 - 1, m0 - r0, 1, 2 * r0);
      x.fillStyle = 'rgba(255,255,255,0.75)'; x.fillRect(m0 - r0 + 1, m0 - r0 + 1, Math.max(1, Math.floor(r0 / 2)), 1);
      cache[key] = cv.c; return cv.c;
    }
    var g = x.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, size, size);
    var a = icon && icon.acc, col = (icon && icon.c) || '#ddd';
    x.save();
    if (a && ACC[a]) {
      // l'accessoire seul, recadré : on le dessine sur une silhouette invisible
      var tmp = P.mk(size * 3, size * 3); tmp.x.translate(size * 1.5, size * 2.4); tmp.x.scale(size * 1.1, size * 1.1);
      ACC[a](tmp.x, { v: 'front', t: 0, m: 1 }, 0, 0, 0.6, 0.015, 0);
      var d = tmp.x.getImageData(0, 0, tmp.c.width, tmp.c.height).data, minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, w = tmp.c.width;
      for (var i = 3; i < d.length; i += 16) if (d[i] > 8) { var p = (i - 3) / 4, px = p % w, py = (p / w) | 0; if (px < minx) minx = px; if (px > maxx) maxx = px; if (py < miny) miny = py; if (py > maxy) maxy = py; }
      if (maxx > 0) { var bw = maxx - minx + 4, bh = maxy - miny + 4, sc = Math.min(size * 0.78 / bw, size * 0.78 / bh, 3); x.drawImage(tmp.c, minx - 2, miny - 2, bw, bh, size / 2 - bw * sc / 2, size / 2 - bh * sc / 2, bw * sc, bh * sc); }
    } else if (icon && icon.form && FORMS[icon.form]) {
      x.translate(size / 2, size * 0.86); x.scale(size * 0.55, size * 0.55);
      FORMS[icon.form](x, { v: 'front', t: 0, m: 1 }, 0, 0, 0.5, GIRL, 0.02);
    } else if (icon && icon.glyph) {
      x.fillStyle = col; x.font = 'bold ' + Math.round(size * 0.42) + 'px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.shadowColor = col; x.shadowBlur = size * 0.12; x.fillText(icon.glyph, size / 2, size / 2 + size * 0.02);
    } else { P.ball(x, size / 2, size / 2, size * 0.25, size * 0.25, col); }
    x.restore();
    cache[key] = cv.c;
    return cv.c;
  };
  S.iconURL = function (icon) {
    var key = 'U|' + JSON.stringify(icon);
    if (cache[key]) return cache[key];
    cache[key] = S.icon(icon, 64).toDataURL();
    return cache[key];
  };
})(typeof window !== 'undefined' ? window : globalThis);
