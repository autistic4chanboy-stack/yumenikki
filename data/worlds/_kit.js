/* =========================================================================
 *  Petit atelier pour dessiner les cartes en code (déterministe) et
 *  palettes de matières partagées par les mondes.
 *  Rappel des caractères : voir src/render/tiles.js (YN.TILE). Les marques
 *  sont les majuscules, les chiffres et « @ » (définies dans `marks`).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;

  function Grid(w, h, ch) {
    this.w = w; this.h = h; this.g = [];
    for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push(ch === undefined ? ' ' : ch); this.g.push(r); }
  }
  Grid.prototype.ok = function (x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; };
  Grid.prototype.at = function (x, y) { return this.ok(x, y) ? this.g[y][x] : null; };
  Grid.prototype.set = function (x, y, c) { if (this.ok(x, y)) this.g[y][x] = c; return this; };
  Grid.prototype.rect = function (x, y, w, h, c) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) this.set(i, j, c); return this; };
  /* pièce : murs `wall` autour, sol `floor` dedans */
  Grid.prototype.box = function (x, y, w, h, wall, floor) { if (floor === null) { this.hline(x, x + w - 1, y, wall); this.hline(x, x + w - 1, y + h - 1, wall); this.vline(x, y, y + h - 1, wall); this.vline(x + w - 1, y, y + h - 1, wall); return this; } this.rect(x, y, w, h, wall); this.rect(x + 1, y + 1, w - 2, h - 2, floor === undefined ? '.' : floor); return this; };
  Grid.prototype.hline = function (x0, x1, y, c) { for (var i = Math.min(x0, x1); i <= Math.max(x0, x1); i++) this.set(i, y, c); return this; };
  Grid.prototype.vline = function (x, y0, y1, c) { for (var j = Math.min(y0, y1); j <= Math.max(y0, y1); j++) this.set(x, j, c); return this; };
  /* couloir en L entre deux points */
  Grid.prototype.path = function (x0, y0, x1, y1, c, wide) { var w = wide || 1; for (var k = 0; k < w; k++) { this.hline(x0, x1, y0 + k, c); this.vline(x1 + k, y0, y1, c); } return this; };
  Grid.prototype.text = function (x, y, rows) { var self = this; (Array.isArray(rows) ? rows : [rows]).forEach(function (r, j) { for (var i = 0; i < r.length; i++) if (r[i] !== '·') self.set(x + i, y + j, r[i]); }); return this; };
  Grid.prototype.ellipse = function (cx, cy, rx, ry, c) { for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) this.set(x, y, c); } return this; };
  /* parsème `c` sur les cases `on` avec une probabilité (graine fixe) */
  Grid.prototype.scatter = function (c, on, rate, seed, area) {
    var r = YN.rng.make(seed || 7), a = area || [0, 0, this.w, this.h];
    for (var y = a[1]; y < a[1] + a[3]; y++) for (var x = a[0]; x < a[0] + a[2]; x++) if (this.at(x, y) === on && r.next() < rate) this.set(x, y, c);
    return this;
  };
  Grid.prototype.border = function (c) { this.hline(0, this.w - 1, 0, c).hline(0, this.w - 1, this.h - 1, c).vline(0, 0, this.h - 1, c).vline(this.w - 1, 0, this.h - 1, c); return this; };
  Grid.prototype.rows = function () { return this.g.map(function (r) { return r.join(''); }); };

  YN.kit = {
    grid: function (w, h, ch) { return new Grid(w, h, ch); },
    /* matières prêtes à l'emploi */
    LOOK: {
      street: { floor: { p: 'asphalt', c: ['#3e3e46'] }, floor2: { p: 'tile', c: ['#8a8a88', '#6a6a68'] }, floor3: { p: 'concrete', c: ['#6a6a6c'] }, wall: { p: 'brick', c: ['#6a5048', '#5a4038', '#3a2a24'] }, wall2: { p: 'concrete', c: ['#7a7a80', '#6a6a70', '#505058'] } },
      station: { floor: { p: 'tile', c: ['#c8c4b8', '#a09c90'] }, floor2: { p: 'flat', c: ['#e0c040', '#c8a830'] }, floor3: { p: 'concrete', c: ['#6a6a6c'] }, wall: { p: 'tile', c: ['#d8d4c8', '#b8b4a8', '#8a8678'] }, wall2: { p: 'concrete', c: ['#8a8a8a', '#707070', '#5a5a5a'] }, rail: { p: 'rails', c: ['#3a342c', '#9a9aa0'] } },
      school: { floor: { p: 'wood', c: ['#b08a5a', '#8a6a44', '#c8a070'] }, floor2: { p: 'tile', c: ['#d8d8d0', '#a8a8a0'] }, floor3: { p: 'concrete', c: ['#8a8a84'] }, wall: { p: 'flat', c: ['#4a4038', '#3a3028'], topColor: '#3a322c' }, wallface: { p: 'panel', c: ['#d8d0b8', '#b8b098', '#8a8470'], skirt: '#5a4a38' } },
      hospital: { floor: { p: 'tile', c: ['#d8e0e0', '#a8b8b8'] }, floor2: { p: 'flat', c: ['#a8c8c0', '#98b8b0'] }, wall: { p: 'flat', c: ['#3a4a4a', '#2a3a3a'], topColor: '#2a3434' }, wallface: { p: 'panel', c: ['#c8dcd8', '#a8c0bc', '#7a908c'], skirt: '#5a8a80' } },
      house: { floor: { p: 'wood', c: ['#8a6848', '#6a4a30', '#9a7a58'] }, floor2: { p: 'carpet', c: ['#6a4048', '#5a3038'] }, floor3: { p: 'tile', c: ['#e0e0d8', '#b0b0a8'] }, wall: { p: 'flat', c: ['#3a2c28', '#2c201c'], topColor: '#33282a' }, wallface: { p: 'wallpaper', c: ['#c8b898', '#a89878', '#7a6a50'], skirt: '#5a4030' } },
      mono: { floor: { p: 'flat', c: ['#f0f0f0', '#e4e4e4'] }, floor2: { p: 'flat', c: ['#202020', '#181818'] }, floor3: { p: 'checker', c: ['#f0f0f0', '#101010'] }, wall: { p: 'flat', c: ['#101010', '#080808'] }, wall2: { p: 'flat', c: ['#e8e8e8', '#d0d0d0'] } },
      desert: { floor: { p: 'sand', c: ['#d8c08a', '#c8b078'] }, floor2: { p: 'dirt', c: ['#b89868', '#a08050', '#c8a878'] }, wall: { p: 'stone', c: ['#a08a68', '#806a50', '#605040'] } },
      forest: { _base: 'garden', floor: { p: 'grass', c: ['#2f6a34', '#285c2c', '#3f7e40', '#1f4a24'] }, floor2: { p: 'dirt', c: ['#6a5038', '#5a4230', '#7a6046'] }, wall: { p: 'hedge', c: ['#1a4020', '#143418', '#24502a', '#0c2410'] } },
      snow: { floor: { p: 'snow', c: ['#eef4fa', '#dfe8f2'] }, floor2: { p: 'ice', c: ['#bfe0f4', '#a8d0ec', '#ffffff'] }, wall: { p: 'stone', c: ['#a8b8c8', '#8898a8', '#687888'] }, water: { p: 'water', c: ['#2a4a78', '#203e68', '#3a6a9a', '#c8e0f0'] } },
      night: { floor: { p: 'asphalt', c: ['#24242c'] }, floor2: { p: 'tile', c: ['#4a4a58', '#34343e'] }, wall: { p: 'brick', c: ['#3a3040', '#2a2030', '#1a1420'] }, wall2: { p: 'concrete', c: ['#4a4a54', '#3a3a44', '#2a2a34'] } },
      neon: { floor: { p: 'neon', c: ['#0a0a14', '#ff40a0'] }, floor2: { p: 'grid', c: ['#0a0a18', '#40c0ff'] }, floor3: { p: 'carpet', c: ['#3a1040', '#2a0830'] }, wall: { p: 'metal', c: ['#2a2a3a', '#1a1a2a', '#3a3a4a'] } },
      nk: { floor: { p: 'marble', c: ['#e8dcc8', '#b8a088'] }, floor2: { p: 'carpet', c: ['#8a1a24', '#6a1018'] }, floor3: { p: 'mosaic', c: ['#c83030', '#e8c040', '#3060a0', '#f0e8d0'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a10'], topColor: '#2c2016' }, wallface: { p: 'panel', c: ['#d8c098', '#b8a078', '#8a7050'], skirt: '#6a1a1a' }, rail: { p: 'rails', c: ['#3a2a20', '#c8b080'] } },
      sk: { floor: { p: 'tile', c: ['#d8dce4', '#a8b0bc'] }, floor2: { p: 'grid', c: ['#101420', '#40e0ff'] }, floor3: { p: 'metal', c: ['#7a8090'] }, wall: { p: 'flat', c: ['#1a2030', '#141a28'], topColor: '#1a2030' }, wallface: { p: 'glass', c: ['#8ab0d8'], skirt: '#2a3a5a' } },
      charcoal: { floor: { p: 'paper', c: ['#e8e4dc'] }, floor2: { p: 'hatch', c: ['#e0dcd0', '#404040'] }, wall: { p: 'flat', c: ['#202020', '#181818'] }, wall2: { p: 'flat', c: ['#4a4a4a', '#3a3a3a'] } },
      water: { floor: { p: 'tile', c: ['#a8d0d8', '#78a8b8'] }, floor2: { p: 'tile', c: ['#e0f0f0', '#a8c8d0'] }, wall: { p: 'tile', c: ['#c8e0e8', '#98b8c8', '#6a8898'] }, water: { p: 'water', c: ['#3a8ab8', '#2a6a98', '#5aaad0', '#d8f0f8'] } },
      cave: { floor: { p: 'dirt', c: ['#3a3028', '#2a2018', '#4a4034'] }, floor2: { p: 'cobble', c: ['#4a4440'] }, wall: { p: 'stone', c: ['#3a342e', '#2a2420', '#4a443c'] }, water: { p: 'water', c: ['#1a3a48', '#102a38', '#2a5a68', '#8ab8c8'] } },
      flesh: { floor: { p: 'flesh', c: ['#6a2030', '#802838', '#401018'] }, floor2: { p: 'flesh', c: ['#a04050', '#b85060', '#702030'] }, wall: { p: 'flesh', c: ['#4a1020', '#6a1828', '#2a0810'] } },
      void: { floor: { p: 'flat', c: ['#0a0a10', '#08080c'] }, floor2: { p: 'stars', c: ['#05040c'] }, wall: { p: 'flat', c: ['#000000', '#000000'] } }
    },
    /* quelques réglages de décor répétés par caractère */
    TALL: {
      city: { '^': { look: 'streetlamp' }, '{': { look: 'trash' }, '}': { look: 'vending' }, 'o': { look: 'mailbox' } },
      station: { '^': { look: 'pillar' }, '{': { look: 'bench' }, '}': { look: 'ticketmachine' }, 'o': { look: 'trash' } },
      school: { '^': { look: 'locker' }, '{': { look: 'schooldesk' }, '}': { look: 'chair' }, 'o': { look: 'plant' } },
      forest: { '^': { look: 'tree' }, '{': { look: 'bush' }, '}': { look: 'stump' }, 'o': { look: 'rock' } },
      pine: { '^': { look: 'pine' }, '{': { look: 'bush' }, '}': { look: 'stump' }, 'o': { look: 'rock' } }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
