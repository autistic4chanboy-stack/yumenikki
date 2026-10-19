/* =========================================================================
 *  Langues et écritures.
 *  - Coréen du Sud / du Nord : texte original, traduction seulement avec
 *    l'Oreillette (E32). Jamais nécessaire à la progression principale.
 *  - Texte barré [[...]] : visible seulement avec l'Encre (E24).
 *  - Vallonnais (peuple sans nom), langues des sorcières.
 *  - Les signes gravés : 26 glyphes. Le jeu ne dit jamais ce que c'est.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  /* ---------- glyphes (générés une fois, graine fixe, tous distincts) ---------- */
  var PTS = [[0, 0], [2, 0], [4, 0], [0, 3], [2, 3], [4, 3], [0, 6], [2, 6], [4, 6]];
  var SEGS = [];
  for (var i = 0; i < 9; i++) for (var j = i + 1; j < 9; j++) {
    var a = PTS[i], b = PTS[j], dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
    if (dx <= 2 && dy <= 3) SEGS.push([i, j]);
  }
  var GLYPHS = {};
  (function () {
    var r = YN.rng.make('les-murs-se-souviennent'), seen = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (ch) {
      for (var tries = 0; tries < 200; tries++) {
        var n = r.int(2, 4), set = [];
        while (set.length < n) { var s = r.int(0, SEGS.length - 1); if (set.indexOf(s) < 0) set.push(s); }
        set.sort(function (x, y) { return x - y; });
        var dot = r.chance(0.25) ? r.int(0, 8) : -1, key = set.join('.') + '|' + dot;
        if (seen[key]) continue;
        seen[key] = 1; GLYPHS[ch] = { segs: set.map(function (k) { return SEGS[k]; }), dot: dot };
        break;
      }
    });
  })();

  var LEX = { // vallonnais (clés anglaises, normalisées sans espace) : CV, accent final, pluriel par redoublement de la dernière syllabe
    hello: 'ouna-sé', you: 'ti', me: 'mo', we: 'mo-mo', word: 'lé', words: 'lé-lé', name: 'nami', water: 'ilo', fire: 'kaé', bread: 'pou',
    house: 'oto', child: 'tipa', mother: 'mama-ré', father: 'pa-ré', night: 'nokou', day: 'sali', bell: 'dinou', sing: 'lalé', forget: 'fou-ka',
    memory: 'ka-fou', come: 'véné', leave: 'tako', here: 'ki', there: 'na', no: 'na-na', yes: 'é', thanks: 'ouma', fear: 'gou', love: 'amé',
    lost: 'pélou', findagain: 'ré-pélou', flower: 'flori', silence: 'chou', speak: 'pala', listen: 'kouté', village: 'valo', old: 'oumé', small: 'pi',
    sky: 'sé', earth: 'tou', tree: 'abo', nothing: 'nadé', everything: 'toutou', who: 'ké', sleep: 'dodo-ré', wake: 'révé'
  };
  var WITCH = {
    silent: ['Shh’ma ja… shh’ma ja…', 'Ss… hn’sa mi’tha ss…', 'Shh…'],
    seam: ['Nu-vé, nu-vé, ka-shé…', 'Ti-ka, ti-ka, nou-ré-ma.', 'Ka-shé. Ka-shé.'],
    copy: null, // répète à l'envers ce que la joueuse a dit
    bell: ['Vrou-pa… vrou-pa… dinn.', 'Ollo ? Ollo-vé ?', 'Dinn. Dinn. Vrou-pa.'],
    voyager: ['Rèv’yen’dra, ommar dess…', 'Ommar dess-ka. Rèv’yen.', 'Dess… dess… rèv’yen’dra.'],
    priestess: ['███ EVERYTHING IS FINE ███', '████ ██ ████', 'NOTHING HAS █████']
  };

  var L = YN.lang = {
    GLYPHS: GLYPHS, LEX: LEX, WITCH: WITCH, PTS: PTS,
    drawGlyph: function (x, ch, gx, gy, size, color) {
      var g = GLYPHS[String(ch).toLowerCase()]; if (!g) return;
      var sx = size / 4, sy = size / 6;
      x.strokeStyle = color || '#d8d0b0'; x.lineWidth = Math.max(1, size / 8); x.lineCap = 'square';
      x.beginPath();
      g.segs.forEach(function (s) { var a = PTS[s[0]], b = PTS[s[1]]; x.moveTo(gx + a[0] * sx, gy + a[1] * sy); x.lineTo(gx + b[0] * sx, gy + b[1] * sy); });
      x.stroke();
      if (g.dot >= 0) { var p = PTS[g.dot]; x.fillStyle = color || '#d8d0b0'; x.fillRect(gx + p[0] * sx - 1, gy + p[1] * sy - 1, 2, 2); }
    },
    /* écriture gravée en SVG (pour les textes affichés en DOM) */
    glyphSVG: function (text, size, color) {
      size = size || 14; color = color || '#d8d0b0';
      var w = size * 0.75, gap = size * 0.35, words = String(text).toLowerCase().replace(/[^a-z ]/g, '');
      var x = 2, parts = [];
      for (var i = 0; i < words.length; i++) {
        var ch = words[i];
        if (ch === ' ') { x += w * 0.8; continue; }
        var g = GLYPHS[ch]; if (!g) continue;
        var sx = w / 4, sy = size / 6, d = '';
        g.segs.forEach(function (s) { var a = PTS[s[0]], b = PTS[s[1]]; d += 'M' + (x + a[0] * sx).toFixed(1) + ' ' + (2 + a[1] * sy).toFixed(1) + 'L' + (x + b[0] * sx).toFixed(1) + ' ' + (2 + b[1] * sy).toFixed(1); });
        parts.push('<path d="' + d + '"/>');
        if (g.dot >= 0) { var p = PTS[g.dot]; parts.push('<rect x="' + (x + p[0] * sx - 1).toFixed(1) + '" y="' + (2 + p[1] * sy - 1).toFixed(1) + '" width="2" height="2" fill="' + color + '" stroke="none"/>'); }
        x += w + gap;
      }
      return '<svg class="glyphs" width="' + Math.ceil(x + 2) + '" height="' + (size + 4) + '" viewBox="0 0 ' + Math.ceil(x + 2) + ' ' + (size + 4) + '" fill="none" stroke="' + color + '" stroke-width="' + Math.max(1, size / 9).toFixed(1) + '" stroke-linecap="square">' + parts.join('') + '</svg>';
    },
    /* vallonnais : liste de mots anglais → phrase, mots perdus remplacés par un vide */
    val: function (words, lost) {
      lost = lost || {};
      return words.map(function (w) {
        var k = U.norm(w).replace(/ /g, '');
        var v = LEX[k] || w;
        if (lost[k]) return ' — ';
        return v;
      }).join(' ');
    },
    witchLine: function (id) {
      if (id === 'copy') {
        var said = (YN.save.dream && YN.save.dream.saidRaw) || [];
        var last = said.length ? said[said.length - 1] : (YN.save.temp('lastNpcLine') || 'do what the others do');
        return last.split('').reverse().join('');
      }
      var l = WITCH[id] || ['…'];
      return l[Math.floor(Math.random() * l.length)];
    },
    /* rendu d'une réplique : redaction, coréen, corruption */
    render: function (line, ctx) {
      ctx = ctx || {};
      var t = typeof line === 'string' ? line : (line.t || '');
      var lang = (typeof line === 'object' && line.lang) || 'fr';
      var eq = YN.game ? YN.game.equipped() : null;
      var ink = eq === 'E24';
      var html = U.escape ? U.escape(t) : t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      // [[texte barré]]
      html = html.replace(/\[\[(.+?)\]\]/g, function (m, inner) {
        if (ink) return '<span class="inked">' + inner + '</span>';
        return '<span class="redact">' + inner.replace(/[^\s]/g, '█') + '</span>';
      });
      // {{glyphes}}
      html = html.replace(/\{\{(.+?)\}\}/g, function (m, inner) { return L.glyphSVG(inner, 14, '#e8dcb0'); });
      // corruption : mots barrés au hasard
      var lvl = ctx.corruption !== undefined ? ctx.corruption : (YN.game && YN.game.rt ? YN.game.rt.corrLevel : 0);
      if (lvl >= 1 && !ctx.noCorrupt) {
        var pr = [0, 0.05, 0.14, 0.28, 0.45, 1][Math.min(5, Math.round(lvl))];
        var r = YN.rng.make(t + ':' + Math.floor(Date.now() / 4000));
        html = html.replace(/(^|\s)([^\s<>]{3,})(?=\s|$)/g, function (m, sp, w) { return sp + (r.next() < pr ? '<span class="redact">' + w.replace(/./g, '█') + '</span>' : w); });
      }
      if (ctx.garble) { // sorcière présente
        var r2 = YN.rng.make(t + ':g');
        html = html.replace(/[a-zàâéèêîôûç]/gi, function (c) { return r2.next() < ctx.garble ? String.fromCharCode(0x2591 + r2.int(0, 2)) : c; });
      }
      var tr = null;
      var tm = YN.save.settings ? YN.save.settings.translate : 1;
      var trCap = eq === 'E32' || !!(YN.effects && YN.effects.caps(eq).translate);
      if ((lang === 'ko-s' || lang === 'ko-n' || lang === 'en') && line.tr && (tm === 2 || (tm === 1 && trCap))) tr = line.tr;
      if (lang === 'val' && line.tr && YN.save.flag('val_understood')) tr = line.tr;
      return { html: html, tr: tr, lang: lang, plain: t };
    },
    itemName: function (id) { var it = YN.data.items && YN.data.items[id]; return it ? it.name : id; }
  };
  U.escape = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
})(typeof window !== 'undefined' ? window : globalThis);
