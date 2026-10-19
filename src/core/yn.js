/* =========================================================================
 *  YUME NIKKI : THE DREAM ARCHIVE — noyau commun
 *  Espace de noms global, utilitaires, hasard déterministe, bus d'événements.
 *  Chargé en premier. Aucun accès au DOM ici (utilisable sous Node pour les tests).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN = root.YN || {};
  YN.VERSION = '1.0.0';
  YN.data = YN.data || {};
  YN.data.worlds = YN.data.worlds || {};
  YN.data.entities = YN.data.entities || {};
  YN.data.dialogues = YN.data.dialogues || {};
  YN.data.effects = YN.data.effects || [];
  YN.data.quests = YN.data.quests || [];
  YN.data.puzzles = YN.data.puzzles || [];
  YN.mech = YN.mech || {};
  YN.sys = YN.sys || {};
  YN.devLog = [];

  /* ---------- utilitaires ---------- */
  var U = YN.util = {
    clamp: function (v, a, b) { return v < a ? a : (v > b ? b : v); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    smooth: function (t) { return t * t * (3 - 2 * t); },
    mod: function (a, n) { return ((a % n) + n) % n; },
    dist: function (ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); },
    sign: function (v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); },
    pad2: function (n) { n = Math.floor(n); return n < 10 ? '0' + n : '' + n; },
    fmtTime: function (sec) {
      sec = Math.max(0, Math.ceil(sec - 1e-6));
      return U.pad2(sec / 60) + ':' + U.pad2(sec % 60);
    },
    /* normalise une phrase tapée : minuscules, sans accents latins, ponctuation retirée, hangul conservé */
    norm: function (s) {
      s = String(s || '').toLowerCase();
      if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC'); // NFC : le hangeul se recompose (sinon il était effacé)
      return s.replace(/[^a-z0-9ㄱ-ㆎ가-힣 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    },
    copy: function (o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); },
    keys: function (o) { return o ? Object.keys(o) : []; },
    shuffle: function (arr, rng) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor((rng ? rng.next() : Math.random()) * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    },
    hexToRgb: function (h) {
      if (typeof h !== 'string') return [0, 0, 0];
      h = h.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    },
    rgbToHex: function (r, g, b) {
      function c(v) { v = U.clamp(Math.round(v), 0, 255).toString(16); return v.length < 2 ? '0' + v : v; }
      return '#' + c(r) + c(g) + c(b);
    },
    mix: function (h1, h2, t) {
      var a = U.hexToRgb(h1), b = U.hexToRgb(h2);
      return U.rgbToHex(U.lerp(a[0], b[0], t), U.lerp(a[1], b[1], t), U.lerp(a[2], b[2], t));
    },
    shade: function (h, f) { // f<0 assombrit, f>0 éclaircit
      var a = U.hexToRgb(h);
      if (f < 0) return U.rgbToHex(a[0] * (1 + f), a[1] * (1 + f), a[2] * (1 + f));
      return U.rgbToHex(a[0] + (255 - a[0]) * f, a[1] + (255 - a[1]) * f, a[2] + (255 - a[2]) * f);
    },
    gray: function (h) {
      var a = U.hexToRgb(h), g = a[0] * 0.3 + a[1] * 0.59 + a[2] * 0.11;
      return U.rgbToHex(g, g, g);
    },
    desat: function (h, t) { return U.mix(h, U.gray(h), t); },
    hsl: function (hDeg, s, l) {
      hDeg = U.mod(hDeg, 360) / 360;
      var r, g, b;
      if (s === 0) { r = g = b = l; } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        var f = function (t) {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        r = f(hDeg + 1 / 3); g = f(hDeg); b = f(hDeg - 1 / 3);
      }
      return U.rgbToHex(r * 255, g * 255, b * 255);
    }
  };

  /* ---------- hasard déterministe ---------- */
  YN.rng = {
    /* FNV-1a 32 bits */
    hash: function (str) {
      str = String(str);
      var h = 0x811c9dc5;
      for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
      }
      return h >>> 0;
    },
    make: function (seed) {
      var s = (typeof seed === 'number' ? seed : YN.rng.hash(seed)) >>> 0;
      if (s === 0) s = 0x9e3779b9;
      var r = {
        next: function () { /* mulberry32 */
          s = (s + 0x6D2B79F5) >>> 0;
          var t = s;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
        int: function (a, b) { return a + Math.floor(r.next() * (b - a + 1)); },
        range: function (a, b) { return a + r.next() * (b - a); },
        pick: function (arr) { return arr[Math.floor(r.next() * arr.length)]; },
        chance: function (p) { return r.next() < p; },
        state: function () { return s; }
      };
      return r;
    },
    /* bruit de valeur 2D lissé, déterministe */
    noise2: function (x, y, seed) {
      function h(ix, iy) {
        var n = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
        n = Math.imul(n ^ (n >>> 13), 1274126177);
        return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
      }
      var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      var a = h(ix, iy), b = h(ix + 1, iy), c = h(ix, iy + 1), d = h(ix + 1, iy + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    },
    cell: function (x, y, seed) { // valeur [0,1) stable par case
      var n = (Math.imul(x | 0, 73856093) ^ Math.imul(y | 0, 19349663) ^ Math.imul(seed | 0, 83492791)) | 0;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    }
  };

  /* ---------- bus d'événements ---------- */
  var handlers = {};
  YN.bus = {
    on: function (ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); return fn; },
    off: function (ev, fn) {
      var l = handlers[ev]; if (!l) return;
      var i = l.indexOf(fn); if (i >= 0) l.splice(i, 1);
    },
    emit: function (ev, a, b, c) {
      var l = handlers[ev]; if (!l) return;
      l = l.slice();
      for (var i = 0; i < l.length; i++) {
        try { l[i](a, b, c); } catch (e) { YN.warn('bus ' + ev + ': ' + (e && e.stack || e)); }
      }
    },
    clear: function () { handlers = {}; }
  };

  YN.warn = function (msg) {
    YN.devLog.push({ t: Date.now(), msg: String(msg) });
    if (YN.devLog.length > 300) YN.devLog.shift();
    if (root.console && console.warn) console.warn('[YN] ' + msg);
  };

  /* ---------- enregistrement des données ---------- */
  YN.defWorld = function (def) {
    if (!def || !def.id) { YN.warn('world without an id'); return; }
    if (YN.data.worlds[def.id]) YN.warn('world defined twice: ' + def.id);
    YN.data.worlds[def.id] = def;
  };
  YN.defWorlds = function (list) { for (var i = 0; i < list.length; i++) YN.defWorld(list[i]); };
  YN.defEntity = function (def) {
    if (!def || !def.id) { YN.warn('entity without an id'); return; }
    if (YN.data.entities[def.id]) YN.warn('entity defined twice: ' + def.id);
    YN.data.entities[def.id] = def;
  };
  YN.defEntities = function (list) { for (var i = 0; i < list.length; i++) YN.defEntity(list[i]); };
  YN.defDialogue = function (id, def) { YN.data.dialogues[id] = def; };
  YN.effectById = function (id) {
    var l = YN.data.effects;
    if (!YN._effIndex || YN._effIndexLen !== l.length) {
      YN._effIndex = {}; YN._effIndexLen = l.length;
      for (var i = 0; i < l.length; i++) YN._effIndex[l[i].id] = l[i];
    }
    return YN._effIndex[id] || null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
