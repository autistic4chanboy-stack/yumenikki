/* =========================================================================
 *  Tuiles procédurales : chaque monde décrit ses matières (motif + couleurs)
 *  et le peintre fabrique des textures 16×16 (ou 32×32 en haute résolution).
 *  Légende des caractères de carte : voir YN.TILE ci-dessous.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  /* ---- sémantique des caractères (indépendante du style) ---- */
  var T = YN.TILE = {
    '.': { pass: 1, kind: 'floor' }, ',': { pass: 1, kind: 'floor2' }, ':': { pass: 1, kind: 'floor3' },
    '#': { pass: 0, kind: 'wall', wall: 1 }, '%': { pass: 0, kind: 'wall2', wall: 1 },
    '^': { pass: 0, kind: 'tall', tall: 1 }, 'o': { pass: 0, kind: 'rock', obj: 1 },
    '~': { pass: 0, kind: 'water', water: 1 }, 'w': { pass: 1, kind: 'shallow', noise: 2, slow: 1, wet: 1 },
    '_': { pass: 0, kind: 'pit', pit: 1 }, '=': { pass: 1, kind: 'bridge' }, '+': { pass: 1, kind: 'soil', soil: 1 },
    '"': { pass: 1, kind: 'leafg', quiet: 1 }, ';': { pass: 1, kind: 'leafb', noise: 3 }, '*': { pass: 1, kind: 'flowers' },
    '&': { pass: 1, kind: 'ice', slide: 1 }, '|': { pass: 0, kind: 'thin', wall: 1, thin: 1 }, 'x': { pass: 0, kind: 'invis', invis: 1 },
    '?': { pass: 0, kind: 'secret', wall: 1, secret: 1 }, ' ': { pass: 0, kind: 'void', void: 1 },
    'b': { pass: 0, kind: 'board', wall: 1, board: 1 }, 'p': { pass: 0, kind: 'paper', wall: 1, paper: 1 },
    'm': { pass: 0, kind: 'mirror', wall: 1, mirror: 1 }, 's': { pass: 1, kind: 'stairs', ladder: 1 },
    'c': { pass: 1, kind: 'carpet', quiet: 1 }, 't': { pass: 1, kind: 'tile', noise: 1 }, 'r': { pass: 1, kind: 'rail', noise: 1 },
    'h': { pass: 1, kind: 'hazard', hazard: 1 }, 'g': { pass: 0, kind: 'glass', wall: 1, glass: 1 },
    'n': { pass: 1, kind: 'snow', noise: 1 }, 'v': { pass: 1, kind: 'vine' }, 'e': { pass: 0, kind: 'seam', wall: 1, seam: 1 },
    'k': { pass: 1, kind: 'dark' }, 'l': { pass: 1, kind: 'line' }, 'd': { pass: 1, kind: 'dirt' },
    'u': { pass: 0, kind: 'counter', wall: 1 }, 'f': { pass: 0, kind: 'fence', obj: 1 }, 'q': { pass: 1, kind: 'quiet', quiet: 1 },
    'z': { pass: 1, kind: 'conveyor', conveyor: 1 }, 'y': { pass: 1, kind: 'lily', lily: 1 }, 'j': { pass: 0, kind: 'jar', obj: 1 },
    'i': { pass: 1, kind: 'light' }, '-': { pass: 1, kind: 'platform', oneway: 1 }, '<': { pass: 1, kind: 'arrowl' }, '>': { pass: 1, kind: 'arrowr' },
    '!': { pass: 1, kind: 'spike', hazard: 1 }, '$': { pass: 1, kind: 'gold' }, '`': { pass: 1, kind: 'floor4' }, "'": { pass: 1, kind: 'floor5' },
    '(': { pass: 0, kind: 'wall3', wall: 1 }, ')': { pass: 0, kind: 'wall4', wall: 1 }, '[': { pass: 1, kind: 'mat' }, ']': { pass: 1, kind: 'mat2' },
    '{': { pass: 0, kind: 'deco1', obj: 1 }, '}': { pass: 0, kind: 'deco2', obj: 1 }, '\\': { pass: 1, kind: 'diag' }, '/': { pass: 1, kind: 'diag2' }
  };
  YN.tileInfo = function (ch) { return T[ch] || (/[A-Z0-9@]/.test(ch) ? T['.'] : T['#']); };
  YN.isMarkChar = function (ch) { return /[A-Z0-9@]/.test(ch); };

  /* ---- thèmes par défaut (les mondes les surchargent) ---- */
  YN.themes = {
    plain: { bg: '#101014', floor: { p: 'flat', c: ['#3a3a44', '#34343e'] }, wall: { p: 'brick', c: ['#6a6a78', '#5a5a66', '#48485a'] } },
    garden: {
      bg: '#16301c',
      floor: { p: 'grass', c: ['#3f8a3c', '#367a34', '#4f9e46', '#2f6a2e'] },
      floor2: { p: 'dirt', c: ['#8a6a44', '#7a5c3a', '#9a7a52'] },
      floor3: { p: 'grass', c: ['#5aa04a', '#4c9040', '#68b058', '#3f7a38'] },
      wall: { p: 'hedge', c: ['#24582a', '#1c4622', '#2f6d34', '#123418'] },
      wall2: { p: 'stone', c: ['#8a8a80', '#6e6e66', '#a0a096'] },
      tall: { p: 'tree', c: ['#2a6a30', '#1f5226', '#5a3e26', '#3a8a40'] },
      water: { p: 'water', c: ['#2f6aa8', '#2a5e96', '#4c8ac4', '#8fc0ea'] },
      shallow: { p: 'water', c: ['#4c8ac4', '#4580b8', '#6aa8dc', '#a8d4f4'] },
      leafg: { p: 'leaves', c: ['#3f8a3c', '#5fb04c', '#7ac85a'] },
      leafb: { p: 'leaves', c: ['#3f8a3c', '#9a6a34', '#b8843e'] },
      soil: { p: 'soil', c: ['#5a3e26', '#4a3220', '#6e4e30'] },
      bridge: { p: 'plank', c: ['#9a7448', '#7e5c38', '#b48c5a'] },
      pit: { p: 'void', c: ['#0a140c'] },
      flowers: { p: 'flowers', c: ['#3f8a3c', '#f070a0', '#f8e070', '#ffffff'] },
      lily: { p: 'lily', c: ['#2f6aa8', '#3a9a48', '#f0a0c0'] },
      ice: { p: 'ice', c: ['#bfe0f4', '#a8d0ec', '#ffffff'] },
      snow: { p: 'snow', c: ['#eef4fa', '#dfe8f2', '#ffffff'] },
      rock: { p: 'rock', c: ['#7a7a74', '#5e5e58', '#94948c'] },
      vine: { p: 'vine', c: ['#2f6a2e', '#5aa04a', '#8fd070'] }
    }
  };

  /* ---- matière par défaut de chaque genre de case ---- */
  var DEFAULT_KIND = {
    floor: { p: 'flat', c: ['#3a3a44', '#34343e'] }, floor2: { p: 'flat', c: ['#44444e', '#3c3c46'] }, floor3: { p: 'flat', c: ['#30303a', '#2a2a34'] },
    floor4: { p: 'flat', c: ['#4a3a44', '#40343e'] }, floor5: { p: 'flat', c: ['#3a4a44', '#344a3e'] },
    wall: { p: 'brick', c: ['#6a6a78', '#5a5a66', '#48485a'] }, wall2: { p: 'stone', c: ['#7a7a74', '#5e5e58', '#94948c'] },
    wall3: { p: 'panel', c: ['#5a5068', '#4a4058', '#3a3048'] }, wall4: { p: 'concrete', c: ['#787878', '#6a6a6a', '#555'] },
    tall: { p: 'tree', c: ['#2a6a30', '#1f5226', '#5a3e26', '#3a8a40'] }, rock: { p: 'rock', c: ['#7a7a74', '#5e5e58', '#94948c'] },
    water: { p: 'water', c: ['#2f5a98', '#2a5086', '#4c7ab4', '#8fb0da'] }, shallow: { p: 'water', c: ['#4c7ab4', '#4570a8', '#6a98cc', '#a8c4e4'] },
    pit: { p: 'void', c: ['#050508'] }, bridge: { p: 'plank', c: ['#8a6a44', '#6e5234', '#a08056'] }, soil: { p: 'soil', c: ['#5a3e26', '#4a3220', '#6e4e30'] },
    leafg: { p: 'leaves', c: ['#3a5a3a', '#4f8a40', '#6aa050'] }, leafb: { p: 'leaves', c: ['#3a5a3a', '#9a6a34', '#b8843e'] },
    flowers: { p: 'flowers', c: ['#3f7a3c', '#f070a0', '#f8e070', '#ffffff'] }, ice: { p: 'ice', c: ['#bfe0f4', '#a8d0ec', '#ffffff'] },
    thin: { p: 'stripes', c: ['#555', '#333'] }, invis: { p: 'blank', c: ['#000'] }, secret: { p: 'brick', c: ['#6a6a78', '#5a5a66', '#48485a'] },
    void: { p: 'void', c: ['#000000'] }, board: { p: 'flat', c: ['#26402e', '#2c4a34'] }, paper: { p: 'paper', c: ['#e8e4d8', '#c8c4b8'] },
    mirror: { p: 'glass', c: ['#a8b8c8', '#e8f0f8', '#808898'] }, stairs: { p: 'hstripes', c: ['#6a6060', '#4a4040'] },
    carpet: { p: 'carpet', c: ['#7a2a3a', '#5a1a2a', '#c8a040'] }, tile: { p: 'tile', c: ['#d8d8d0', '#a8a8a0'] }, rail: { p: 'rails', c: ['#4a4038', '#6a5a48', '#9a9aa0'] },
    hazard: { p: 'flesh', c: ['#6a2030', '#802838', '#a03040'] }, glass: { p: 'glass', c: ['#7898b8', '#c8e0f0', '#a0b8d0'] },
    snow: { p: 'snow', c: ['#eef4fa', '#dfe8f2', '#ffffff'] }, vine: { p: 'vine', c: ['#1a2a1a', '#4f8a40', '#8fd070'] },
    seam: { p: 'stripes', c: ['#802030', '#e8e8e8'] }, dark: { p: 'void', c: ['#050505'] }, line: { p: 'lines', c: ['#202020', '#e0e0e0'] },
    dirt: { p: 'dirt', c: ['#6a5038', '#5a4230', '#7a6046'] }, counter: { p: 'wood', c: ['#7a5a3a', '#5a4028', '#8a6a48'] },
    fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#8a7050'] }, quiet: { p: 'grass', c: ['#3a5a40', '#345238', '#4a6a4a'] },
    conveyor: { p: 'hstripes', c: ['#3a3a3a', '#5a5a5a'] }, lily: { p: 'lily', c: ['#2f5a98', '#3a8a48', '#f0a0c0'] }, jar: { p: 'rock', c: ['#a0c8b8', '#80a898', '#d0f0e0'] },
    light: { p: 'flat', c: ['#f0e8b0', '#e8dca0'] }, platform: { p: 'plank', c: ['#8a6a44', '#6e5234', '#a08056'] },
    arrowl: { p: 'flat', c: ['#404048'] }, arrowr: { p: 'flat', c: ['#404048'] }, spike: { p: 'flesh', c: ['#303030', '#505050', '#c03030'] },
    gold: { p: 'flat', c: ['#c8a040', '#e8c060'] }, mat: { p: 'rug', c: ['#5a4a6a', '#6a5a7a'] }, mat2: { p: 'rug', c: ['#6a4a3a', '#7a5a4a'] },
    deco1: { p: 'rock', c: ['#6a6a7a', '#4a4a5a', '#8a8a9a'] }, deco2: { p: 'rock', c: ['#7a6a5a', '#5a4a3a', '#9a8a7a'] },
    diag: { p: 'hatch', c: ['#303038', '#404048'] }, diag2: { p: 'hatch', c: ['#383030', '#484040'] }
  };
  YN.DEFAULT_KIND = DEFAULT_KIND;

  var tileCache = {}, tileCacheCount = 0;
  YN.tiles = {
    clear: function () { tileCache = {}; tileCacheCount = 0; },
    material: function (look, kind) {
      return (look && look[kind]) || (look && look._base && YN.themes[look._base] && YN.themes[look._base][kind]) || DEFAULT_KIND[kind] || DEFAULT_KIND.floor;
    },
    /* texture n×n d'une case (vue subjective, ASCII, sons de pas) */
    get: function (worldKey, look, ch, variant, frame, n) {
      var info = YN.tileInfo(ch), mat = YN.tiles.material(look, info.kind);
      var key = worldKey + '|' + ch + '|' + n;
      if (tileCache[key]) return tileCache[key];
      var c = document.createElement('canvas'); c.width = n; c.height = n;
      var x = c.getContext('2d'), area = { wx0: 0, wy0: 0, w: 1, h: 1, tpx: n, seed: YN.rng.hash(worldKey) & 0xffff };
      var p = mat.p, MAT = YN.paint.MAT;
      try {
        if (info.wall && YN.terrain) { var fake = { look: look, style: {} }; var t = YN.terrain.paintWall(fake, { wx0: 0, wy0: 0, w: 1, h: 1, tpx: n, seed: area.seed }, mat, 'face', 0.0); x.drawImage(t.c, 0, 0, n, n, 0, 0, n, n); }
        else if (p === 'water' || p === 'lily') { var g = x.createLinearGradient(0, 0, 0, n); g.addColorStop(0, (mat.c || ['#2f6aa8'])[2] || '#4c8ac4'); g.addColorStop(1, (mat.c || ['#2f6aa8'])[0]); x.fillStyle = g; x.fillRect(0, 0, n, n); }
        else (MAT[p] || MAT.flat)(x, area, mat.c || ['#555'], mat);
      } catch (e) { x.fillStyle = '#f0f'; x.fillRect(0, 0, n, n); }
      if (tileCacheCount > 600) { tileCache = {}; tileCacheCount = 0; }
      tileCache[key] = c; tileCacheCount++;
      return c;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
