/* =========================================================================
 *  42 ORIGINS — scènes des missions
 *  Petites illustrations SVG « pixel » qui réagissent en direct au
 *  programme : sortie, variables, tas, code de sortie.
 *  Chaque scène : function (ctx, opts) → chaîne SVG.
 *  ctx : { out, done, error, exit, win, str(n), bytes(n), num(n), heap(), m, lang, stdin, step }
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var S = O42.scenes = {};
  var W = 320, H = 200;

  function svg(body, defs) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" font-family="Pixelify Sans, monospace">' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14203a"/><stop offset="1" stop-color="#26355a"/></linearGradient>' +
      '<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050913"/><stop offset="1" stop-color="#1a2244"/></linearGradient>' +
      '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      (defs || '') + '</defs>' + body + '</svg>';
  }
  function t(x, y, s, size, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 10) + '" fill="' + (fill || '#fff') + '" ' + (extra || '') + '>' + U.esc(s) + '</text>'; }
  function r(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function stars(n, seed) {
    var s = '', g = U.rng(seed || 7);
    for (var i = 0; i < n; i++) s += r(g() % W, g() % 110, 1 + (g() % 2), 1 + (g() % 2), '#fff', 'opacity="' + (0.3 + (g() % 60) / 100) + '" class="' + (i % 3 ? '' : 's-twinkle') + '" style="animation-delay:' + (g() % 2000) + 'ms"');
    return s;
  }
  function city(y, col) {
    var s = '', g = U.rng(3), x = 0;
    while (x < W) { var w = 18 + g() % 26, h = 20 + g() % 50; s += r(x, y - h, w, h, col || '#101a2e'); for (var k = 0; k < 4; k++) if (g() % 3 === 0) s += r(x + 3 + (g() % (w - 6)), y - h + 4 + (g() % (h - 8)), 3, 3, '#ffd36b', 'opacity=".7"'); x += w + 2; }
    return s;
  }
  function ground(y, c1, c2) { return r(0, y, W, H - y, c1 || '#1d2a1f') + r(0, y, W, 3, c2 || '#2f4a33'); }
  /* étudiant·e de 42 (pixel) */
  function student(x, y, shirt) {
    shirt = shirt || '#00babc';
    return '<g class="s-bob">' + r(x + 4, y, 12, 12, '#f2c29b') + r(x + 3, y - 2, 14, 5, '#3b2a20') + r(x + 7, y + 4, 2, 2, '#222') + r(x + 12, y + 4, 2, 2, '#222') +
      r(x + 1, y + 12, 18, 16, shirt) + r(x + 6, y + 14, 8, 3, '#fff', 'opacity=".85"') + t(x + 7, y + 17, '42', 4, '#063') + r(x + 3, y + 28, 6, 10, '#2b3655') + r(x + 11, y + 28, 6, 10, '#2b3655') + '</g>';
  }
  /* Marvin, le robot de l'accueil */
  function robot(x, y, mood) {
    var eye = mood === 'happy' ? r(x + 8, y + 12, 6, 2, '#2ef2d0') + r(x + 22, y + 12, 6, 2, '#2ef2d0') : '<g class="s-blink">' + r(x + 9, y + 9, 5, 6, '#2ef2d0') + r(x + 22, y + 9, 5, 6, '#2ef2d0') + '</g>';
    return '<g class="s-bob">' + r(x + 16, y - 10, 3, 10, '#8aa') + r(x + 14, y - 13, 7, 4, mood === 'happy' ? '#ff6fb5' : '#ffcc4d', 'filter="url(#glow)"') +
      r(x, y, 36, 26, '#c9d6e3') + r(x + 3, y + 3, 30, 20, '#0e1a2a') + eye + (mood === 'happy' ? r(x + 12, y + 18, 12, 2, '#2ef2d0') : r(x + 13, y + 18, 10, 2, '#5d7')) +
      r(x + 5, y + 27, 26, 24, '#aab8c8') + r(x + 10, y + 32, 16, 9, '#00babc') + t(x + 12, y + 39, 'M42', 6, '#002') + r(x - 4, y + 30, 8, 4, '#aab8c8') + r(x + 32, y + 30, 8, 4, '#aab8c8') +
      r(x + 8, y + 51, 8, 10, '#7f8da0') + r(x + 20, y + 51, 8, 10, '#7f8da0') + '</g>';
  }
  /* bulle de dialogue avec retour à la ligne */
  function bubble(x, y, w, text, color, tail) {
    var lines = wrap(text, Math.floor((w - 12) / 6.2)).slice(-4), h = 14 + lines.length * 12;
    var s = '<g>' + r(x, y, w, h, color || '#fff', 'rx="4"') + (tail === 'left' ? '<path d="M' + (x + 14) + ',' + (y + h) + ' l6,8 l6,-8z" fill="' + (color || '#fff') + '"/>' : '<path d="M' + (x + w - 26) + ',' + (y + h) + ' l6,8 l6,-8z" fill="' + (color || '#fff') + '"/>');
    lines.forEach(function (L, i) { s += t(x + 6, y + 14 + i * 12, L, 10, '#10182a', 'font-family="JetBrains Mono, monospace"'); });
    return s + '</g>';
  }
  function wrap(text, n) {
    var out = [];
    String(text).split('\n').forEach(function (line) {
      if (!line.length) { out.push(''); return; }
      while (line.length > n) { out.push(line.slice(0, n)); line = line.slice(n); }
      out.push(line);
    });
    while (out.length > 1 && out[out.length - 1] === '') out.pop();
    return out;
  }
  function vis(s) { return s.replace(/\n/g, '⏎').replace(/\t/g, '→'); }
  function cap(s) { return '<div class="s-cap">' + U.esc(s) + '</div>'; }
  S.cap = cap;

  /* 1. dialogue : quelqu'un attend un message précis */
  S.talk = function (ctx, o) {
    var said = ctx.out || '';
    var who = o.who || 'robot', win = ctx.win;
    var body = r(0, 0, W, H, 'url(#sky)') + stars(30) + city(150) + ground(150, '#18233a', '#24345a');
    body += r(20, 70, 90, 80, '#0f1a2e') + r(24, 74, 82, 50, '#1b2a48') + t(30, 92, '42 ORIGINS', 10, '#2ef2d0') + t(30, 106, 'ACCUEIL', 9, '#9ab') + r(56, 124, 20, 26, '#2a3b5e');
    body += student(132, 112, '#00babc');
    if (who === 'robot') body += robot(232, 90, win ? 'happy' : 'idle');
    else body += '<g class="s-bob">' + r(238, 98, 22, 22, '#f2c29b') + r(234, 92, 30, 9, o.hair || '#ffd34d') + r(244, 106, 3, 3, '#222') + r(252, 106, 3, 3, '#222') + r(232, 120, 34, 26, o.shirt || '#4aa3ff') + r(238, 146, 9, 12, '#334') + r(251, 146, 9, 12, '#334') + (win ? r(244, 114, 10, 2, '#a33') : '') + '</g>';
    if (said) body += bubble(118, 22, 132, vis(said).slice(-80), '#e9fff8', 'left');
    var reply = win ? (o.happy || 'Bonjour à toi ! 😊') : said ? (o.wrong || '…je n’ai pas bien compris.') : (o.wait || '…');
    body += bubble(206, 40, 108, reply, win ? '#c8ffdf' : '#fff', 'right');
    if (win) body += t(150, 190, '♥ ♥ ♥', 12, '#ff6fb5', 'class="s-bob"');
    return svg(body) + cap(o.name ? o.name + ' attend : ' + vis(o.expect || '') : '');
  };

  /* 2. enseigne lumineuse branchée sur une variable */
  S.sign = function (ctx, o) {
    var vn = o.v || ctx.findVar(['arr', 'ptr', 'str']);
    var bytes = ctx.bytes(vn) || U.utf8(o.text || ''), orig = U.utf8(o.text || '');
    var n = Math.min(bytes.length, 14), cw = Math.min(22, Math.floor(280 / Math.max(n, 1))), x0 = (W - n * cw) / 2;
    var body = r(0, 0, W, H, 'url(#night)') + stars(40, 11) + r(0, 150, W, 50, '#0c1222') + r(0, 150, W, 2, '#1e2a48');
    body += r(40, 96, 240, 54, '#2a1d2e') + r(48, 104, 70, 46, '#3a2840') + r(60, 112, 46, 38, '#ffd36b', 'opacity=".25"') + r(206, 112, 56, 38, '#120c18') + r(214, 120, 40, 30, '#3a2a10', 'opacity=".6"');
    body += r(x0 - 10, 30, n * cw + 20, 54, '#0a0c14', 'rx="6" stroke="#3b2a55" stroke-width="3"');
    for (var i = 0; i < n; i++) {
      var c = bytes[i], ch = c === 0 ? '·' : c === 32 ? ' ' : String.fromCharCode(c), changed = orig[i] !== c;
      var col = c === 0 ? '#3a3550' : changed ? '#2ef2d0' : '#ff4fa3';
      body += '<g class="' + (c && !changed ? 's-flick' : '') + '" style="animation-delay:' + (i * 230) + 'ms">' + t(x0 + i * cw + cw / 2, 66, ch, Math.min(24, cw + 2), col, 'text-anchor="middle" filter="url(#glow)" font-weight="700" font-family="JetBrains Mono, monospace"') + '</g>';
      body += t(x0 + i * cw + cw / 2, 80, '[' + i + ']', 7, '#7a86a8', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    }
    if (bytes.length > n) body += t(x0 + n * cw + 2, 66, '…', 14, '#888');
    body += r(150, 84, 3, 12, '#555') + r(170, 84, 3, 12, '#555');
    if (ctx.win) body += t(160, 140, '★ OUVERT ! ★', 13, '#ffd36b', 'text-anchor="middle" filter="url(#glow)" class="s-bob"');
    return svg(body) + cap(vn ? 'Enseigne = variable « ' + vn + ' » en mémoire, une lettre par case' : 'Enseigne branchée sur une chaîne en mémoire, une lettre par case');
  };

  /* 3. fusée : compte à rebours lu dans la sortie */
  S.rocket = function (ctx, o) {
    var lines = (ctx.out || '').split('\n').filter(Boolean), last = lines[lines.length - 1] || '', go = /DECOLLAGE|DÉCOLLAGE|LIFTOFF/i.test(ctx.out || '');
    var body = r(0, 0, W, H, 'url(#night)') + stars(60, 5) + r(250, 20, 22, 22, '#e8e6d0', 'rx="11" opacity=".9"') + ground(168, '#1c2433', '#2d3a55');
    body += r(40, 130, 10, 38, '#4a5470') + r(40, 130, 40, 6, '#4a5470') + r(200, 150, 60, 18, '#2b354d') + r(206, 154, 48, 10, '#0a0f18') + t(230, 162, (last.slice(-6) || '--'), 9, '#ff4f4f', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    var rx = 128;
    var rocketG = '<g' + (go && ctx.win ? ' style="animation: launch 2.2s ease-in forwards"' : go ? ' style="animation: launch 3s ease-in forwards"' : '') + '>' +
      '<path d="M' + (rx + 16) + ',60 l14,26 h-28z" fill="#ff5c7a"/>' + r(rx + 2, 86, 28, 56, '#e9eef7') + r(rx + 9, 96, 14, 14, '#4aa3ff', 'rx="7"') + r(rx + 2, 120, 28, 4, '#00babc') + t(rx + 8, 136, '42', 9, '#123') +
      '<path d="M' + (rx + 2) + ',128 l-12,20 h12z" fill="#ff5c7a"/><path d="M' + (rx + 30) + ',128 l12,20 h-12z" fill="#ff5c7a"/>' +
      (go || lines.length ? '<g style="transform-origin:' + (rx + 16) + 'px 142px; animation: flame .2s infinite">' + '<path d="M' + (rx + 6) + ',142 h20 l-10,' + (go ? 26 : 8 + lines.length * 2) + 'z" fill="#ffb02e"/><path d="M' + (rx + 11) + ',142 h10 l-5,' + (go ? 14 : 5) + 'z" fill="#fff6a0"/></g>' : '') + '</g>';
    body += rocketG;
    body += t(20, 30, go ? 'DÉCOLLAGE !' : last ? 'T − ' + last : 'Prête…', 18, go ? '#2ef2d0' : '#ffd36b', 'filter="url(#glow)"');
    return svg(body) + cap(o.hint || 'La fusée part quand le programme affiche le compte à rebours puis DECOLLAGE');
  };

  /* 4. mètre du tailleur : parcours d'une chaîne avec un indice */
  S.ruler = function (ctx, o) {
    var vn = o.v || ctx.findVar(['arr', 'ptr', 'str']), iname = o.i || ctx.findVar('int', 'i');
    var s = ctx.bytes(vn) || [], i = ctx.num(iname);
    var outs = (ctx.out || '').split('\n').filter(Boolean);
    var n = Math.min(s.length, 22), cw = 13, x0 = 16;
    var body = r(0, 0, W, H, '#2a1f2b') + r(0, 140, W, 60, '#3d2a2a') + r(0, 140, W, 3, '#5a3d3a');
    for (var k = 0; k < 6; k++) body += r(10 + k * 54, 150, 40, 30, '#4b3434', 'opacity=".5"');
    body += r(x0 - 4, 60, Math.max(n, 6) * cw + 8, 30, '#ffe7a8', 'rx="3"');
    for (var j = 0; j < Math.max(n, 6); j++) {
      body += r(x0 + j * cw, 60, 1, j % 5 === 0 ? 10 : 6, '#7a5a20');
      if (j < n) {
        var c = s[j];
        body += t(x0 + j * cw + 6, 82, c === 0 ? '\\0' : String.fromCharCode(c), c === 0 ? 7 : 11, c === 0 ? '#b33' : '#3a2a10', 'text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700"');
      }
      body += t(x0 + j * cw + 6, 100, String(j), 6, '#e6c78a', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    }
    if (i !== null && i !== undefined && i >= 0 && i < 40) {
      var px = x0 + Math.min(i, 30) * cw + 6;
      body += '<path d="M' + px + ',56 l-6,-10 h12z" fill="#2ef2d0" filter="url(#glow)"/>' + t(px, 40, (iname || 'i') + ' = ' + i, 9, '#2ef2d0', 'text-anchor="middle"');
    }
    body += '<g class="s-bob">' + r(250, 96, 20, 20, '#f2c29b') + r(246, 90, 28, 8, '#555') + r(255, 104, 3, 3, '#222') + r(262, 104, 3, 3, '#222') + r(244, 116, 32, 28, '#8a5cff') + r(270, 120, 16, 4, '#ffe7a8') + '</g>';
    outs.slice(-4).forEach(function (L, q) { body += r(16 + q * 56, 160, 50, 22, '#fff', 'rx="3"') + t(41 + q * 56, 175, L.slice(0, 7) + ' cm', 9, '#333', 'text-anchor="middle"'); });
    if (ctx.win) body += t(160, 30, 'Mesures parfaites !', 13, '#2ef2d0', 'text-anchor="middle" filter="url(#glow)"');
    return svg(body) + cap(o.cap || 'Le ruban = la chaîne case par case ; la flèche = ton indice');
  };

  /* 5. guichet : une lettre arrive (stdin), une réponse repart (stdout) */
  S.mail = function (ctx, o) {
    var inp = (ctx.stdin || '').split('\n')[0] || '…', out = ctx.out || '';
    var body = r(0, 0, W, H, 'url(#sky)') + r(0, 0, W, 60, '#3a2a1a') + r(0, 56, W, 4, '#ffcc4d') + t(160, 38, o.title || 'LA POSTE · GUICHET 42', 14, '#ffcc4d', 'text-anchor="middle"');
    body += r(0, 130, W, 70, '#5a4632') + r(0, 128, W, 4, '#8a6a46');
    body += '<g style="animation: slideIn .8s ease-out">' + r(26, 80, 74, 46, '#fdf6e3', 'rx="2"') + '<path d="M26,80 l37,24 l37,-24" fill="none" stroke="#c9b48a" stroke-width="2"/>' + t(63, 120, vis(inp).slice(0, 12), 9, '#333', 'text-anchor="middle" font-family="JetBrains Mono, monospace"') + '</g>';
    body += t(63, 74, 'stdin', 8, '#ffe7a8', 'text-anchor="middle"');
    body += (o.parrot ? '<g class="s-bob">' + r(150, 74, 22, 22, '#2fbf5a') + r(166, 82, 10, 6, '#ffb02e') + r(156, 80, 4, 4, '#111') + r(146, 96, 26, 26, '#25a24b') + r(140, 100, 8, 18, '#ff5c7a') + r(150, 122, 4, 8, '#aa7') + r(160, 122, 4, 8, '#aa7') + '</g>' + r(128, 130, 70, 4, '#6a4b2a')
      : '<g class="s-bob">' + r(150, 76, 22, 22, '#f2c29b') + r(146, 70, 30, 8, '#2244aa') + r(156, 84, 3, 3, '#222') + r(164, 84, 3, 3, '#222') + r(144, 98, 34, 30, '#2244aa') + r(156, 102, 10, 8, '#ffcc4d') + '</g>');
    if (out) body += bubble(196, 66, 116, vis(out).slice(-60), ctx.win ? '#c8ffdf' : '#fff', 'left');
    body += t(254, 186, 'stdout', 8, '#ffe7a8', 'text-anchor="middle"');
    return svg(body) + cap(o.cap || 'La lettre (stdin) est lue par ton programme ; la réponse s’affiche sur stdout');
  };

  /* 6. coffre-fort : une chaîne qu'on inverse avec deux indices */
  S.vault = function (ctx, o) {
    var s = ctx.bytes(o.v || ctx.findVar(['arr', 'ptr', 'str'])) || [], i = ctx.num(o.i || 'i'), j = ctx.num(o.j || 'j');
    var n = Math.min(s.length, 16), cw = 16, x0 = (W - n * cw) / 2;
    var open = ctx.win;
    var body = r(0, 0, W, H, '#151a24') + r(0, 160, W, 40, '#0f131b');
    for (var k = 0; k < 8; k++) body += r(k * 40, 0, 38, 160, '#181e2a');
    body += '<g style="transform-origin:60px 100px; transition: transform 1s; ' + (open ? 'transform: perspective(300px) rotateY(-70deg)' : '') + '">' + r(60, 40, 200, 118, '#5b6475', 'rx="6"') + r(66, 46, 188, 106, '#4a5262', 'rx="4"') +
      '<circle cx="230" cy="100" r="14" fill="#2a303c" stroke="#9aa" stroke-width="3"/>' + r(228, 86, 4, 28, '#9aa', 'transform="rotate(' + (((ctx.step || 0) * 37) % 360) + ' 230 100)"') + '</g>';
    if (open) body += r(64, 44, 192, 110, '#0a0d12') + t(160, 110, '💰 ✨ 💰', 22, '#ffd36b', 'text-anchor="middle" class="s-bob"');
    body += r(x0 - 6, 168, n * cw + 12, 26, '#0a0d14', 'rx="4" stroke="#2a3a58"');
    for (var q = 0; q < n; q++) {
      var c = s[q];
      body += t(x0 + q * cw + cw / 2, 186, c === 0 ? '·' : String.fromCharCode(c), 12, q === i || q === j ? '#ffb02e' : '#2ef2d0', 'text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700"');
      if (q === i) body += t(x0 + q * cw + cw / 2, 163, 'i', 8, '#ffb02e', 'text-anchor="middle"');
      if (q === j) body += t(x0 + q * cw + cw / 2, 163, 'j', 8, '#ffb02e', 'text-anchor="middle"');
    }
    body += t(160, 26, open ? 'CODE ACCEPTÉ' : 'CODE : ' + (ctx.out ? vis(ctx.out).slice(-18) : '????'), 12, open ? '#3ddc84' : '#ff5c7a', 'text-anchor="middle" filter="url(#glow)"');
    return svg(body) + cap(o.cap || 'En bas : la chaîne en mémoire. i et j se rapprochent en échangeant les lettres');
  };

  /* 7. boulangerie : chaque bloc du tas est un plateau */
  S.bakery = function (ctx, o) {
    var blocks = ctx.heap();
    var body = r(0, 0, W, H, '#3a2418') + r(0, 0, W, 34, '#5a3a22') + t(160, 23, o.title || 'BOULANGERIE DU TAS', 13, '#ffe0a8', 'text-anchor="middle"') + r(0, 150, W, 50, '#2a190f') + r(0, 148, W, 4, '#7a5030');
    body += r(250, 100, 50, 50, '#2a2a2a') + r(255, 105, 40, 30, '#ff7a1a', 'opacity=".8" class="s-flick"') + t(275, 145, 'four', 8, '#ccc', 'text-anchor="middle"');
    if (!blocks.length) body += t(120, 100, 'Aucun malloc : le présentoir est vide', 10, '#e8c9a0', 'text-anchor="middle"');
    blocks.slice(-4).forEach(function (b, k) {
      var y = 44 + k * 26, txt = b.bytes.slice(0, Math.max(0, b.n)).map(function (c) { return c === 0 ? '·' : c < 32 ? '?' : String.fromCharCode(c); }).join('');
      body += r(14, y, 220, 22, b.freed ? '#4a3a30' : '#c8945a', 'rx="4"') + r(18, y + 3, 212, 16, b.freed ? '#3a2e26' : '#e7b678', 'rx="3"');
      body += t(24, y + 15, (b.freed ? '(libéré) ' : '') + txt.slice(0, 26), 9, b.freed ? '#8a7a6a' : '#3a2010', 'font-family="JetBrains Mono, monospace"');
      body += t(236, y + 15, b.n + 'o', 8, '#ffe0a8');
    });
    var live = blocks.filter(function (b) { return !b.freed; }).length;
    if (ctx.done && !ctx.error) body += t(160, 178, live ? '⚠ ' + live + ' plateau(x) oublié(s) : fuite !' : '✔ tout est rangé (pas de fuite)', 11, live ? '#ff8da1' : '#7dffb2', 'text-anchor="middle"');
    return svg(body) + cap(o.cap || 'Chaque plateau = un bloc malloc ; grisé = libéré par free');
  };

  /* 8. tickets : un tableau d'int sur le tas */
  S.tickets = function (ctx, o) {
    var blocks = ctx.heap().filter(function (b) { return b.ints; }), b = blocks[blocks.length - 1];
    var body = r(0, 0, W, H, 'url(#sky)') + stars(20, 9);
    body += '<circle cx="250" cy="120" r="56" fill="none" stroke="#ff6fb5" stroke-width="4"/>';
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4 + (ctx.step || 0) * 0.08; body += r(250 + Math.cos(a) * 56 - 6, 120 + Math.sin(a) * 56 - 5, 12, 10, ['#ffcc4d', '#4aa3ff', '#3ddc84', '#ff9f43'][k % 4]); }
    body += r(246, 120, 8, 70, '#8a6aa8') + ground(186, '#2a3a2a', '#3d5a3d');
    body += t(16, 26, o.title || 'PARC 42 · TICKETS', 13, '#ffd36b');
    if (b) {
      b.ints.slice(0, 10).forEach(function (v, k2) {
        var x = 14 + (k2 % 5) * 40, y = 44 + Math.floor(k2 / 5) * 50;
        body += r(x, y, 36, 40, b.freed ? '#555' : '#ffe9b0', 'rx="3"') + r(x, y + 10, 36, 2, '#c9a85a') + t(x + 18, y + 31, v === null ? '?' : String(v), 12, '#3a2a10', 'text-anchor="middle" font-weight="700"') + t(x + 18, y + 8, '[' + k2 + ']', 6, '#8a6a20', 'text-anchor="middle"');
      });
    } else body += t(16, 80, 'Pas encore de tableau d’int sur le tas…', 10, '#9ab');
    return svg(body) + cap(o.cap || 'Les tickets = les cases int du bloc malloc (4 octets chacune)');
  };

  /* 9. tapis roulant : lignes lues une par une */
  S.conveyor = function (ctx, o) {
    var lines = (ctx.stdin || '').split('\n'); if (lines[lines.length - 1] === '') lines.pop();
    var done = (ctx.out || '').split('\n').filter(Boolean).length;
    var body = r(0, 0, W, H, '#1e2533') + r(0, 120, W, 16, '#3a4256') + r(0, 136, W, 6, '#232a3a');
    for (var k = 0; k < 16; k++) body += r((k * 22 - ((ctx.step || 0) * 4) % 22 + 22) % (W + 22) - 22, 122, 10, 12, '#4a536a');
    lines.slice(0, 8).forEach(function (L, k2) {
      var processed = k2 < done, x = processed ? 240 + (k2 % 3) * 10 : 10 + (k2 - done) * 50;
      if (!processed && x > 200) return;
      body += r(x, processed ? 60 + (k2 % 4) * 14 : 92, 44, 28, processed ? '#c8ffdf' : '#fdf6e3', 'rx="2"') + t(x + 22, (processed ? 60 + (k2 % 4) * 14 : 92) + 18, vis(L).slice(0, 6), 8, '#333', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    });
    body += r(196, 60, 34, 60, '#5a6478') + r(200, 66, 26, 20, '#0a0f18') + t(213, 80, String(done), 11, '#2ef2d0', 'text-anchor="middle"') + t(213, 108, 'GNL', 8, '#fff', 'text-anchor="middle"');
    body += t(16, 30, o.title || 'TRI DU COURRIER', 14, '#ffd36b') + t(16, 46, lines.length + ' lettre(s) à trier · ' + done + ' traitée(s)', 9, '#9ab');
    return svg(body) + cap(o.cap || 'Chaque appel lit une ligne de stdin et la place dans un nouveau bloc du tas');
  };

  /* 10. train : liste chaînée suivie dans la mémoire */
  S.train = function (ctx, o) {
    var head = o.head || ctx.findVar('ptr', 'head');
    var nodes = head && ctx.list ? ctx.list(head, o.valOff || 0, o.nextOff || 8) : [];
    o = { head: head || 'tete', title: o.title, cap: o.cap, valOff: o.valOff, nextOff: o.nextOff };
    var body = r(0, 0, W, H, 'url(#sky)') + stars(25, 4) + city(140, '#0f1830') + r(0, 160, W, 40, '#2a2a30') + r(0, 166, W, 3, '#777') + r(0, 176, W, 3, '#777');
    for (var k = 0; k < 20; k++) body += r(k * 18, 168, 10, 10, '#4a3a2a');
    var x = 10;
    body += r(x, 118, 54, 40, '#ff5c7a', 'rx="3"') + r(x + 30, 100, 20, 20, '#ff5c7a') + r(x + 6, 124, 18, 12, '#ffe7a8') + '<circle cx="' + (x + 14) + '" cy="160" r="7" fill="#222" stroke="#aaa"/><circle cx="' + (x + 42) + '" cy="160" r="7" fill="#222" stroke="#aaa"/>' + t(x + 4, 152, o.head || 'tete', 8, '#fff');
    x += 58;
    nodes.slice(0, 5).forEach(function (n, i) {
      body += r(x, 6 + 0, 0, 0, 'none') + r(x - 4, 140, 6, 3, '#888');
      body += r(x, 120, 44, 36, n.freed ? '#555' : ['#4aa3ff', '#3ddc84', '#ffcc4d', '#b48cff', '#ff9f43'][i % 5], 'rx="3"') + t(x + 22, 136, String(n.v), 11, '#10182a', 'text-anchor="middle" font-weight="700"') + t(x + 22, 150, U.hex(n.a).slice(-5), 6, '#10182a', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
      body += '<circle cx="' + (x + 10) + '" cy="160" r="6" fill="#222" stroke="#aaa"/><circle cx="' + (x + 34) + '" cy="160" r="6" fill="#222" stroke="#aaa"/>';
      x += 50;
    });
    if (nodes.length > 5) body += t(x, 140, '…', 14, '#fff');
    if (nodes.cut) body += t(x + 2, 140, '✂ ' + nodes.cut, 8, '#ff8da1');
    else if (nodes.length) body += t(x + 2, 140, 'NULL', 8, '#9ab');
    var sum = nodes.reduce(function (s, n) { return s + (n.freed ? 0 : n.v); }, 0);
    body += t(16, 30, o.title || 'GARE DE TRIAGE', 14, '#ffd36b') + t(16, 46, nodes.length + ' wagon(s) · poids total ' + sum, 9, '#9ab');
    if (ctx.done && !ctx.error) { var leaks = ctx.heap().filter(function (b) { return !b.freed; }).length; body += t(16, 62, leaks ? '⚠ ' + leaks + ' wagon(s) jamais libérés (fuite)' : '✔ tous les wagons sont libérés', 9, leaks ? '#ff8da1' : '#7dffb2'); }
    return svg(body) + cap(o.cap || 'Chaque wagon est un bloc du tas ; le champ next relie au suivant');
  };

  /* 11. porte à code : le code de sortie du programme */
  S.door = function (ctx, o) {
    var code = ctx.done && ctx.exit !== null && ctx.exit !== undefined ? ctx.exit : null, rdi = ctx.num('rdi'), open = ctx.win;
    var body = r(0, 0, W, H, '#10141e') + r(0, 170, W, 30, '#0a0d14');
    body += r(90, 30, 140, 140, '#2a3346', 'rx="4"') + '<g style="transform-origin:96px 100px; transition: transform 1s; ' + (open ? 'transform: perspective(300px) rotateY(-75deg)' : '') + '">' + r(96, 36, 128, 134, '#3d4a63') + r(104, 46, 112, 54, '#34405a') + r(104, 108, 112, 54, '#34405a') + r(200, 100, 10, 14, '#c9a85a') + '</g>';
    if (open) body += t(160, 120, '🎉', 30, '#fff', 'text-anchor="middle" class="s-bob"');
    body += r(240, 70, 64, 66, '#1a1f2c', 'rx="4" stroke="#445"') + r(246, 76, 52, 22, '#061810') + t(272, 92, code !== null ? String(code) : rdi !== null ? String(rdi & 255) : '--', 14, code !== null ? (open ? '#3ddc84' : '#ff5c7a') : '#2ef2d0', 'text-anchor="middle" font-family="JetBrains Mono, monospace" filter="url(#glow)"');
    body += t(272, 112, code !== null ? 'code de sortie' : 'rdi (live)', 7, '#9ab', 'text-anchor="middle"') + t(272, 126, 'attendu : ' + o.code, 7, '#ffd36b', 'text-anchor="middle"');
    body += t(20, 30, o.title || 'LA PORTE DU PROCESSEUR', 12, '#ffd36b');
    return svg(body) + cap(o.cap || 'Le boîtier lit le code de sortie (rdi lors de exit)');
  };

  /* 12. calculatrice : affiche des registres */
  S.calc = function (ctx, o) {
    var regs = o.regs || ['rax', 'rbx', 'rdi'];
    var body = r(0, 0, W, H, '#1a1430') + r(70, 16, 180, 172, '#2d2547', 'rx="10"') + r(82, 28, 156, 44, '#9fd8a8', 'rx="4"');
    var main = ctx.done && ctx.exit !== null ? ctx.exit : ctx.num(regs[0]);
    body += t(232, 62, main === null ? '0' : String(main), 22, '#163a1e', 'text-anchor="end" font-family="JetBrains Mono, monospace"');
    regs.forEach(function (rn, k) { var v = ctx.num(rn); body += t(84, 88 + k * 14, rn + ' = ' + (v === null ? '?' : v), 10, '#d8ccff', 'font-family="JetBrains Mono, monospace"'); });
    var keys = ['7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+'];
    keys.forEach(function (kc, k) { var x = 84 + (k % 4) * 38, y = 128 + Math.floor(k / 4) * 18; body += r(x, y, 32, 14, k % 4 === 3 ? '#ff6fb5' : '#463a6e', 'rx="3"') + t(x + 16, y + 11, kc, 9, '#fff', 'text-anchor="middle"'); });
    if (ctx.win) body += t(160, 12, '✔ calcul exact', 10, '#3ddc84', 'text-anchor="middle"');
    return svg(body) + cap(o.cap || 'Les registres en direct ; à la fin, l’écran montre le code de sortie');
  };

  /* 13. videur : comparaison et saut */
  S.bouncer = function (ctx, o) {
    var age = ctx.num(o.v || ctx.findVar('int', 'i') || 'age'), out = (ctx.out || '').trim();
    var body = r(0, 0, W, H, 'url(#night)') + stars(30, 8) + r(150, 30, 160, 140, '#2a1640') + t(230, 60, 'CLUB 42', 16, '#ff6fb5', 'text-anchor="middle" filter="url(#glow)" class="s-flick"') + r(200, 90, 60, 80, '#120a1c') + ground(170, '#1a1426', '#2a2040');
    body += '<g class="s-bob">' + r(266, 100, 24, 24, '#c98a5b') + r(266, 96, 24, 6, '#111') + r(270, 108, 16, 4, '#111') + r(262, 124, 32, 36, '#111') + t(278, 146, 'STAFF', 6, '#ff6fb5', 'text-anchor="middle"') + '</g>';
    body += student(60, 124, '#3ddc84');
    body += r(40, 90, 62, 22, '#fff', 'rx="3"') + t(71, 105, 'âge : ' + (age === null ? '?' : age), 10, '#222', 'text-anchor="middle"');
    if (out) body += bubble(170, 104, 90, out, /ENTRE/.test(out) ? '#c8ffdf' : '#ffd3dc', 'right');
    return svg(body) + cap(o.cap || 'cmp compare, puis un saut conditionnel choisit le chemin');
  };

  /* 14. dictionnaire / barres */
  S.bars = function (ctx, o) {
    var vn = o.v || ctx.findVar(['dict', 'list']);
    var d = ctx.pyv ? ctx.pyv(vn) : null, keys = [], vals = [];
    if (d && d.k === 'dict') { keys = d.keys; vals = d.vals.map(function (x) { return x.v || 0; }); }
    else if (d && d.k === 'list') { vals = d.items.map(function (x) { return x.v || 0; }); keys = vals.map(function (v, i) { return String(i); }); }
    var body = r(0, 0, W, H, '#14202a') + t(16, 26, o.title || 'COMPTEUR', 14, '#ffd36b') + r(16, 170, 288, 2, '#3a4a5a');
    var mx = Math.max.apply(null, vals.concat([1])), n = Math.min(keys.length, 12), bw = n ? Math.min(30, Math.floor(280 / n) - 4) : 20;
    for (var i = 0; i < n; i++) {
      var h = Math.round(120 * vals[i] / mx), x = 20 + i * (bw + 4);
      body += r(x, 170 - h, bw, h, ['#4aa3ff', '#3ddc84', '#ffcc4d', '#ff6fb5', '#b48cff', '#ff9f43'][i % 6], 'rx="2"') + t(x + bw / 2, 166 - h, String(vals[i]), 8, '#fff', 'text-anchor="middle"') + t(x + bw / 2, 184, keys[i].slice(0, 4), 9, '#cde', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    }
    if (!n) body += t(160, 110, 'en attente de données…', 10, '#789', 'text-anchor="middle"');
    return svg(body) + cap(o.cap || (vn ? 'Les barres lisent la variable « ' + vn + ' » en direct' : 'Les barres lisent une liste ou un dictionnaire en direct'));
  };

  /* 15. jumeaux : deux noms, un ou deux objets (alias Python) */
  S.twins = function (ctx, o) {
    var an = o.a, bn = o.b;
    if (!an || !bn) { var pair = ctx.findVars(['list', 'dict'], 2); an = an || pair[0]; bn = bn || pair[1]; }
    o = { a: an || 'a', b: bn || 'b' };
    var a = an && ctx.pyv ? ctx.pyv(an) : null, b = bn && ctx.pyv ? ctx.pyv(bn) : null, same = an && bn && ctx.same ? ctx.same(an, bn) : false;
    var body = r(0, 0, W, H, '#1a1f2e') + t(16, 26, 'LA BOÎTE À JOUETS', 14, '#ffd36b');
    function box(x, y, l, col) {
      var s = r(x, y, 120, 50, col, 'rx="6"');
      (l && l.items ? l.items : []).slice(0, 6).forEach(function (it, i) { s += r(x + 6 + i * 19, y + 14, 16, 22, '#fff', 'rx="2"') + t(x + 14 + i * 19, y + 29, String(it.v !== undefined ? it.v : it.s !== undefined ? it.s : '?').slice(0, 2), 9, '#223', 'text-anchor="middle"'); });
      return s;
    }
    body += student(20, 60, '#ff6fb5') + student(20, 130, '#4aa3ff') + t(52, 80, o.a, 11, '#ff6fb5') + t(52, 150, o.b, 11, '#4aa3ff');
    if (same) { body += box(170, 90, a, '#3a4a6a') + '<path d="M70,76 C120,76 130,110 168,112" stroke="#ff6fb5" stroke-width="2" fill="none"/><path d="M70,146 C120,146 130,118 168,118" stroke="#4aa3ff" stroke-width="2" fill="none"/>' + t(230, 160, 'UNE seule boîte partagée !', 9, '#ffcc4d', 'text-anchor="middle"'); }
    else { if (a) body += box(170, 52, a, '#4a3a5a') + '<path d="M70,76 C120,76 130,76 168,76" stroke="#ff6fb5" stroke-width="2" fill="none"/>'; if (b) body += box(170, 124, b, '#2a4a6a') + '<path d="M70,146 C120,146 130,146 168,146" stroke="#4aa3ff" stroke-width="2" fill="none"/>'; if (a && b) body += t(230, 192, 'deux boîtes distinctes', 9, '#3ddc84', 'text-anchor="middle"'); }
    return svg(body) + cap('Une variable Python est une étiquette collée sur un objet');
  };

  /* 16. tours de Hanoï rejouées depuis la sortie */
  S.hanoi = function (ctx, o) {
    var n = ctx.num('n'); if (!n || n < 1) n = o.n || 3; n = Math.min(n, 6);
    var pegs = [[], [], []], names = { A: 0, B: 1, C: 2 };
    for (var k = n; k >= 1; k--) pegs[0].push(k);
    var moves = (ctx.out || '').split('\n').filter(function (L) { return /^[ABC]\s*->\s*[ABC]$/.test(L.trim()); }), bad = false;
    moves.forEach(function (L) { var m = /([ABC])\s*->\s*([ABC])/.exec(L), f = pegs[names[m[1]]], to = pegs[names[m[2]]]; if (!f.length || (to.length && to[to.length - 1] < f[f.length - 1])) { bad = true; return; } to.push(f.pop()); });
    var body = r(0, 0, W, H, '#1c1830') + r(10, 170, 300, 8, '#6a4a2a') + t(16, 24, 'TOURS DE HANOÏ · ' + moves.length + ' coup(s)', 12, '#ffd36b');
    [0, 1, 2].forEach(function (p) {
      var x = 60 + p * 100;
      body += r(x - 2, 70, 4, 100, '#a8845a') + t(x, 192, 'ABC'[p], 10, '#fff', 'text-anchor="middle"');
      pegs[p].forEach(function (d, h) { var w = 14 + d * 12; body += r(x - w / 2, 160 - h * 12, w, 10, ['#ff5c7a', '#ffcc4d', '#3ddc84', '#4aa3ff', '#b48cff', '#ff9f43'][d - 1], 'rx="3"'); });
    });
    if (bad) body += t(160, 50, '⚠ coup interdit (grand disque sur petit)', 10, '#ff8da1', 'text-anchor="middle"');
    else if (pegs[2].length === n) body += t(160, 50, '★ tour déplacée ! ★', 12, '#3ddc84', 'text-anchor="middle" filter="url(#glow)"');
    return svg(body) + cap('Chaque ligne « A -> C » déplace un disque');
  };

  /* 17. pile d'assiettes : la pile du processeur */
  S.plates = function (ctx, o) {
    var depth = ctx.stackDepth ? ctx.stackDepth() : 0;
    var body = r(0, 0, W, H, '#262033') + r(0, 170, W, 30, '#3a2f22') + t(16, 26, o.title || 'LA PILE D’ASSIETTES', 13, '#ffd36b');
    body += r(110, 160, 100, 10, '#888');
    var vals = ctx.stackVals ? ctx.stackVals() : [];
    for (var k = 0; k < Math.min(depth, 10); k++) {
      body += r(116, 150 - k * 11, 88, 9, k === depth - 1 ? '#ffe7a8' : '#e9eef7', 'rx="4"') + t(160, 157 - k * 11, vals[k] !== undefined ? vals[k] : '', 7, '#334', 'text-anchor="middle" font-family="JetBrains Mono, monospace"');
    }
    if (depth) body += t(214, 157 - (Math.min(depth, 10) - 1) * 11, '← rsp', 9, '#3ddc84');
    body += t(16, 44, depth + ' valeur(s) empilée(s)', 9, '#9ab');
    if (ctx.out) body += bubble(220, 50, 90, vis(ctx.out).slice(-30), ctx.win ? '#c8ffdf' : '#fff', 'left');
    return svg(body) + cap('push pose une assiette, pop reprend celle du dessus (LIFO)');
  };

  /* 18. COBOL : salle des machines — la WORKING-STORAGE devient un registre bancaire live */
  S.cobol = function (ctx, o) {
    var fields = [];
    try { var rg = ctx.m && ctx.m.view().regions[0]; if (rg && rg.groups && rg.groups[0]) fields = rg.groups[0].objs || []; } catch (e) { }
    var outL = (ctx.out || '').split('\n'); if (outL.length && outL[outL.length - 1] === '') outL.pop();
    var last = outL[outL.length - 1] || '';
    var running = ctx.step > 0 && !ctx.done, win = ctx.win;
    var body = r(0, 0, W, H, '#1a2130') + r(0, 174, W, 26, '#12161f');
    body += r(0, 0, W, 22, '#243b2e') + r(0, 22, W, 2, '#3ddc84') + t(8, 15, 'CENTRE DE CALCUL · 42', 10, '#bfe9c8');
    body += r(10, 32, 104, 134, '#2b3545', 'rx="5"') + r(16, 38, 92, 40, '#121823', 'rx="3"');
    [40, 84].forEach(function (cx) {
      body += '<circle cx="' + cx + '" cy="58" r="15" fill="#0c111a" stroke="#4a566c" stroke-width="3"/>' +
        '<g class="' + (running ? 's-spin' : '') + '"><circle cx="' + cx + '" cy="58" r="3.5" fill="#8fe3b4"/>' +
        r(cx - 1.5, 46, 3, 8, '#5f6b82') + r(cx - 1.5, 62, 3, 8, '#5f6b82') + r(cx - 12, 56.5, 8, 3, '#5f6b82') + r(cx + 4, 56.5, 8, 3, '#5f6b82') + '</g>';
    });
    body += r(16, 86, 92, 30, '#05140c', 'rx="3"') + t(20, 104, (last ? '> ' + vis(last) : '> _').slice(0, 15), 9, '#6cf0a0', 'font-family="JetBrains Mono, monospace"');
    for (var k = 0; k < 6; k++) body += '<rect x="' + (18 + k * 15) + '" y="124" width="8" height="8" rx="2" fill="' + ['#ff5c7a', '#ffcc4d', '#3ddc84'][k % 3] + '"' + (running && k % 2 ? ' class="s-flick"' : '') + '/>';
    body += t(20, 150, 'MF-42', 8, '#8aa');
    body += r(124, 30, 188, 138, '#f3ead3', 'rx="4"') + r(124, 30, 188, 18, '#d9c9a0', 'rx="4"') + t(132, 43, 'WORKING-STORAGE', 10, '#4a3b1e', 'font-weight="700"');
    if (!fields.length) body += t(132, 72, 'Aucune donnée déclarée', 9, '#9a876a', 'font-family="JetBrains Mono, monospace"');
    fields.slice(0, 6).forEach(function (f, i) {
      var y = 54 + i * 19, val = (f.cells || []).map(function (c) { return c.val === ' ' ? '·' : c.val; }).join('').slice(0, 12);
      var numeric = /9|Z|\$|V/.test(f.type || '');
      body += t(132, y + 11, (f.name || '').slice(0, 9), 9, '#3a2e18', 'font-family="JetBrains Mono, monospace" font-weight="700"');
      body += r(200, y, 104, 15, '#fff', 'rx="2" stroke="#c9b88e"') + t(206, y + 11, val || '—', 10, numeric ? '#b06a12' : '#1d6a4a', 'font-family="JetBrains Mono, monospace"');
    });
    if (fields.length > 6) body += t(132, 165, '…+' + (fields.length - 6) + ' champ(s)', 7, '#9a876a');
    if (win) body += '<g transform="rotate(-11 222 150)">' + r(176, 137, 92, 26, '#1d7a44', 'rx="4" opacity=".92"') + t(222, 155, '✓ VALIDÉ', 14, '#eafff2', 'text-anchor="middle" font-weight="700"') + '</g>';
    return svg(body) + cap(o.cap || 'Chaque champ PIC de la WORKING-STORAGE, case par case, mis à jour en direct');
  };

  /* 19. CYBERSÉCURITÉ : la « cible » simulée, verrouillée puis compromise */
  S.cyber = function (ctx, o) {
    var sim = o.sim || 'logic', win = ctx.m ? !!ctx.m.ok : !!ctx.win;
    var outL = (ctx.out || '').split('\n').filter(Boolean), running = ctx.step > 0;
    var THEME = {
      sqli: { ic: 'SQL', t: 'BASE DE DONNÉES', c: '#4aa3ff' }, cmdi: { ic: '>_', t: 'SERVEUR SHELL', c: '#3ddc84' },
      pathtrav: { ic: 'DIR', t: 'SERVEUR DE FICHIERS', c: '#ffcc4d' }, logic: { ic: 'ID', t: 'CONTRÔLE D’ACCÈS', c: '#b48cff' },
      overflow: { ic: 'BUF', t: 'MÉMOIRE TAMPON', c: '#ff9f43' }, formatstr: { ic: '%x', t: 'FUITE MÉMOIRE', c: '#ff9f43' },
      token: { ic: 'JWT', t: 'JETON DE SESSION', c: '#ffd36b' }, xss: { ic: 'DOM', t: 'NAVIGATEUR', c: '#4aa3ff' },
      crypto: { ic: 'KEY', t: 'MESSAGE CHIFFRÉ', c: '#2ef2d0' }
    };
    var th = THEME[sim] || THEME.logic;
    var body = r(0, 0, W, H, 'url(#night)') + stars(26, 13);
    body += t(10, 20, 'CIBLE · ' + th.t, 11, th.c, 'filter="url(#glow)"');
    var bx = 96, by = 38;
    body += r(bx, by, 104, 102, '#121a28', 'rx="6" stroke="' + (win ? '#3ddc84' : '#2a3850') + '" stroke-width="3"');
    if (running && !win) body += '<rect x="' + (bx + 4) + '" y="' + (by + 6) + '" width="96" height="3" fill="' + th.c + '" opacity=".55" class="s-scan"/>';
    body += t(bx + 52, by + 58, win ? '🔓' : '🔒', 36, '#fff', 'text-anchor="middle"' + (win ? ' class="s-bob"' : ''));
    body += t(bx + 52, by + 88, th.ic, 15, th.c, 'text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700"');
    if (win) body += r(bx - 2, 146, 108, 22, '#1d7a44', 'rx="4"') + t(bx + 52, 161, '🚩 COMPROMISE', 11, '#eafff2', 'text-anchor="middle" font-weight="700"');
    else body += r(bx - 2, 146, 108, 22, '#3a1420', 'rx="4"') + t(bx + 52, 161, 'SÉCURISÉE', 10, '#ff7a98', 'text-anchor="middle"');
    var cx = 218;
    body += r(cx - 6, 38, 98, 120, '#05080e', 'rx="4" stroke="#1f2a40"') + r(cx - 6, 38, 98, 14, '#141c2c', 'rx="4"') + t(cx, 48, 'console', 8, '#8aa');
    var logLines = wrap(outL.slice(-7).join('\n'), 15).slice(-8);
    if (!logLines.length) logLines = ['en attente de', 'ta charge…'];
    logLines.forEach(function (L, i) { body += t(cx, 62 + i * 12, L, 8, win ? '#9fe8c4' : '#9fb4d8', 'font-family="JetBrains Mono, monospace"'); });
    return svg(body) + cap(o.cap || (win ? 'Cible compromise : objectif atteint. La défense (🛡) est expliquée dans la leçon.' : 'Cible simulée intacte : trouve la faille et envoie ta charge dans l’éditeur.'));
  };

  /* choix automatique d'une scène quand la mission n'en précise pas — pour que CHAQUE exercice ait un visuel */
  var PICK = {
    c: ['talk', 'sign', 'bouncer', 'ruler', 'mail', 'vault', 'bakery', 'tickets', 'conveyor', 'train'],
    py: ['talk', 'ruler', 'rocket', 'mail', 'bars', 'bars', 'talk', 'twins', 'ruler', 'hanoi'],
    asm: ['door', 'sign', 'calc', 'bouncer', 'rocket', 'plates', 'plates', 'sign', 'mail', 'bakery']
  };
  S.pick = function (m, dom) {
    if (dom === 'cobol') return { scene: 'cobol' };
    if (dom === 'cyber') return { scene: 'cyber', opts: { sim: (m.cyber && m.cyber.sim) || 'logic' } };
    var arr = PICK[dom]; if (!arr) return { scene: 'terminal' };
    var ch = Math.min(Math.max(m.ch || 1, 1), 10);
    return { scene: arr[ch - 1] || 'terminal' };
  };

  /* scène générique : terminal */
  S.terminal = function (ctx, o) {
    var lines = wrap(ctx.out || '', 40).slice(-9);
    var body = r(0, 0, W, H, '#0a0f18') + r(10, 10, 300, 180, '#05080e', 'rx="6" stroke="#1f2a40"') + r(10, 10, 300, 16, '#141c2c', 'rx="6"') + '<circle cx="22" cy="18" r="3" fill="#ff5f57"/><circle cx="32" cy="18" r="3" fill="#febc2e"/><circle cx="42" cy="18" r="3" fill="#28c840"/>';
    lines.forEach(function (L, i) { body += t(18, 42 + i * 15, L, 11, '#b8ffd9', 'font-family="JetBrains Mono, monospace"'); });
    if (ctx.win) body += t(300, 182, '✔', 14, '#3ddc84', 'text-anchor="end"');
    return svg(body) + cap(o.cap || '');
  };
})(typeof window !== 'undefined' ? window : globalThis);
