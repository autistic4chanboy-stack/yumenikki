/* =========================================================================
 *  Schéma de la boucle de jeu — un petit dessin en pixels.
 *  Obligatoire avant une nouvelle partie, consultable depuis le titre, la
 *  pause et le journal. Il montre la boucle (dormir, rêver, trouver,
 *  garder) et laisse le reste à moitié dit : des icônes, des « ? ».
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var W = 256, H = 150;
  var C = { bg: '#14111e', box: '#201b33', line: '#8c7bd6', ink: '#e8e2f4', dim: '#8a82a6', good: '#6fd0a0', warn: '#e8c060', bad: '#e06070', blue: '#6aa8f0', wood: '#8a5a3a', sheet: '#d8d0f0' };

  /* petits dessins (une lettre = une couleur, « . » = vide) */
  var SPR = {
    bed: ['...........', '.ww........', '.wwssssssss', '.wwssssssss', 'bbbbbbbbbbb', 'b.........b'],
    door: ['..lllll..', '.l.....l.', '.l.....l.', '.l....yl.', '.l.....l.', '.l.....l.', '.lllllll.'],
    spark: ['....y....', '....y....', '..y.y.y..', '...yyy...', 'yyyyyyyyy', '...yyy...', '..y.y.y..', '....y....', '....y....'],
    egg: ['...ee...', '..eeee..', '.eeeeee.', '.eeeeee.', 'bbeeeebb', '.bbbbbb.'],
    eye: ['..iiiii..', '.i.....i.', 'i..ggg..i', 'i..g.g..i', 'i..ggg..i', '.i.....i.', '..iiiii..'],
    clock: ['..www..', '.w...w.', 'w..y..w', 'w..yy.w', 'w.....w', '.w...w.', '..www..'],
    hand: ['.r.r.r.', '.r.r.r.', '.r.r.r.r', '.rrrrrr', 'rrrrrr.', '.rrrrr.', '..rrr..'],
    cookie: ['.oooo.', 'oo.ooo', 'oooo.o', 'o.oooo', '.oooo.'],
    pill: ['.bbbww.', 'bbbbwww', '.bbbww.'],
    check: ['......g', '.....g.', 'g...g..', '.g.g...', '..g....'],
    cross: ['r...r', '.r.r.', '..r..', '.r.r.', 'r...r']
  };
  var PAL = { w: '#e8e2f4', s: '#a8c4e2', b: '#8a5a3a', l: '#c8b8e8', y: '#f0d060', e: '#f0ece0', i: '#e8e2f4', g: '#6fd0a0', r: '#e06070', o: '#c8904a' };

  function sprite(x, rows, px, py, k) {
    k = k || 1;
    rows.forEach(function (row, j) { for (var i = 0; i < row.length; i++) { var c = row[i]; if (c === '.') continue; x.fillStyle = PAL[c] || '#fff'; x.fillRect(px + i * k, py + j * k, k, k); } });
  }
  function rect(x, a, b, w, h, c) { x.fillStyle = c; x.fillRect(a, b, w, h); }
  function hline(x, a, b, len, c) { rect(x, a, b, len, 1, c); }
  function vline(x, a, b, len, c) { rect(x, a, b, 1, len, c); }
  function arrowR(x, a, b, len, c) { hline(x, a, b, len, c); rect(x, a + len - 2, b - 1, 1, 3, c); rect(x, a + len - 3, b - 2, 1, 5, c); }
  function arrowD(x, a, b, len, c) { vline(x, a, b, len, c); rect(x, a - 1, b + len - 2, 3, 1, c); rect(x, a - 2, b + len - 3, 5, 1, c); }
  function arrowU(x, a, b, len, c) { vline(x, a, b - len, len, c); rect(x, a - 1, b - len + 1, 3, 1, c); rect(x, a - 2, b - len + 2, 5, 1, c); }
  /* texte en pixels nets : écrit puis binarisé */
  var TXT = []; // textes à poser sur la toile finale, en double résolution
  function text(x, str, a, b, c, size, align) { TXT.push([str, a, b, c || C.ink, align]); }
  function textW(str) { var t = document.createElement('canvas').getContext('2d'); t.font = '16px "Pixelify Sans", "Courier New", monospace'; return Math.ceil(t.measureText(str).width) / 2; }
  function flushText(fx) {
    TXT.forEach(function (q) {
      var t = document.createElement('canvas'); t.width = W * 2; t.height = 24; var tx = t.getContext('2d');
      tx.font = '16px "Pixelify Sans", "Courier New", monospace'; tx.textBaseline = 'top'; tx.fillStyle = q[3];
      var w = Math.ceil(tx.measureText(q[0]).width), a2 = q[1] * 2, ox = q[4] === 'center' ? Math.round(a2 - w / 2) : q[4] === 'right' ? a2 - w : a2;
      tx.fillText(q[0], 2, 2);
      var d = tx.getImageData(0, 0, t.width, t.height), dd = d.data;
      for (var i = 3; i < dd.length; i += 4) dd[i] = dd[i] > 100 ? 255 : 0;
      tx.putImageData(d, 0, 0);
      fx.drawImage(t, ox - 2, q[2] * 2 - 3);
    });
    TXT = [];
  }
  function frame(x, a, b, w, h, c) { rect(x, a, b, w, h, C.box); hline(x, a, b, w, c); hline(x, a, b + h - 1, w, c); vline(x, a, b, h, c); vline(x, a + w - 1, b, h, c); }

  function draw(cv) {
    var base = document.createElement('canvas'); base.width = W; base.height = H;
    var x = base.getContext('2d'); x.imageSmoothingEnabled = false; TXT = [];
    rect(x, 0, 0, W, H, C.bg);
    // étoiles de fond
    for (var s = 0; s < 40; s++) { var sx = (s * 97) % W, sy = (s * 53) % H; rect(x, sx, sy, 1, 1, s % 3 ? '#2a2440' : '#3a3458'); }

    // ---- la boucle ----
    var top = 10, cols = [10, 64, 118, 172];
    var labels = ['sleep', 'dream', 'find', 'keep?'];
    var icons = [SPR.bed, SPR.door, SPR.spark, SPR.egg];
    cols.forEach(function (cx0, i) {
      frame(x, cx0, top, 40, 28, i === 3 ? C.warn : C.line);
      var sp = icons[i], w = sp[0].length * 2, h = sp.length * 2;
      sprite(x, sp, cx0 + 20 - w / 2, top + 4 + (12 - h / 2) + 2, 2);
      text(x, labels[i], cx0 + 20, top + 30, C.ink, 8, 'center');
      if (i < 3) arrowR(x, cx0 + 41, top + 14, 12, C.line);
    });

    // ---- trois issues, sous « rêver » ----
    var by = 58, bx = [14, 72, 130], brIcons = [SPR.eye, SPR.clock, SPR.hand], brCols = [C.good, C.warn, C.bad];
    var brText = ['wake', 'stay…', 'caught'];
    arrowD(x, 84, top + 40, 8, C.line);
    hline(x, 30, by - 6, 118, C.line);
    bx.forEach(function (b0, i) {
      arrowD(x, b0 + 16, by - 6, 6, brCols[i]);
      frame(x, b0, by, 32, 22, brCols[i]);
      var sp = brIcons[i], w = sp[0].length * 2, h = sp.length * 2;
      sprite(x, sp, b0 + 16 - w / 2, by + 11 - h / 2, 2);
      text(x, brText[i], b0 + 16, by + 24, brCols[i], 8, 'center');
    });
    // ce que chaque issue laisse
    sprite(x, SPR.check, 26, by + 38, 2); text(x, 'kept', 42, by + 37, C.good, 8);
    text(x, '?', 86, by + 37, C.warn, 8, 'center');
    sprite(x, SPR.cross, 140, by + 38, 2); text(x, 'lost', 154, by + 37, C.bad, 8);
    // un biscuit, une fois
    sprite(x, SPR.cookie, 168, by + 6, 2); text(x, '×1', 182, by + 7, C.dim, 8);

    // ---- on recommence ----
    var ly = by + 52;
    vline(x, 30, by + 46, ly - (by + 46), C.line);
    hline(x, 4, ly, 27, C.line);
    vline(x, 4, top + 14, ly - top - 14, C.line);
    arrowR(x, 4, top + 14, 6, C.line);
    text(x, 'again', 34, ly - 6, C.dim, 8);

    // ---- les couches ----
    frame(x, 214, 10, 36, 78, C.line);
    for (var d = 0; d < 6; d++) {
      var dy = 14 + d * 12, ww = 26 - d * 2, col = 'hsl(' + (250 + d * 16) + ',40%,' + Math.round(46 - d * 6) + '%)';
      rect(x, 219 + d, dy, ww, 9, col);
      text(x, d < 5 ? String(d) : '?', 222 + d, dy + 1, '#ffffff', 8);
    }
    arrowD(x, 246, 16, 66, C.dim);

    // ---- comprimé ----
    sprite(x, SPR.pill, 214, 96, 2);
    text(x, '10:00', 232, 94, C.ink, 8);
    text(x, '20:00 ?', 214, 104, C.blue, 8);

    // ---- touches ----
    var ky = 128;
    hline(x, 6, ky - 4, W - 12, '#2e2846');
    var keys = [[null, 'move'], ['Space', 'look'], ['Tab', 'effects'], ['F', '…'], ['T', 'say']], kx = 8;
    keys.forEach(function (k) {
      var w = k[0] ? Math.ceil(textW(k[0])) + 6 : 26;
      frame(x, kx, ky, w, 12, C.dim);
      if (k[0]) text(x, k[0], kx + 3, ky + 2, C.ink, 8);
      else { // quatre petites flèches
        sprite(x, ['..w..', '.www.', 'wwwww'], kx + 3, ky + 4, 1); sprite(x, ['wwwww', '.www.', '..w..'], kx + 9, ky + 4, 1);
        sprite(x, ['..w', '.ww', 'www', '.ww', '..w'], kx + 15, ky + 3, 1); sprite(x, ['w..', 'ww.', 'www', 'ww.', 'w..'], kx + 20, ky + 3, 1);
      }
      text(x, k[1], kx + w + 3, ky + 2, C.dim, 8);
      kx += w + 6 + Math.ceil(textW(k[1])) + 5;
    });
    // toile finale : les dessins en gros pixels, le texte net par-dessus
    var fx = cv.getContext('2d'); fx.imageSmoothingEnabled = false;
    fx.drawImage(base, 0, 0, W * 2, H * 2);
    flushText(fx);
  }

  YN.schema = {
    canvas: function () {
      var cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2; cv.className = 'schema-px';
      draw(cv);
      // redessin quand la police pixel est prête
      try { if (document.fonts && document.fonts.load) document.fonts.load('16px "Pixelify Sans"').then(function () { draw(cv); }); } catch (e) { /* police de secours */ }
      return cv;
    },
    // compatibilité : ancien appel
    svg: function () { return ''; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
