/* Charge le jeu dans Node (sans navigateur) pour les outils et les tests.
 * Lit la liste des scripts dans index.html, fournit un DOM minimal. */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.join(__dirname, '..');

function fakeCtx() {
  var noop = function () { };
  var grad = { addColorStop: noop };
  return new Proxy({}, {
    get: function (t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return function () { return grad; };
      if (k === 'createPattern') return function () { return { setTransform: noop }; };
      if (k === 'getImageData' || k === 'createImageData') return function (x, y, w, h) { w = w || x; h = h || y; if (typeof w !== 'number') { w = 1; h = 1; } return { width: w, height: h, data: new Uint8ClampedArray(Math.max(1, w * h * 4)) }; };
      if (k === 'measureText') return function () { return { width: 10 }; };
      if (k === 'canvas') return { width: 320, height: 240 };
      if (t[k] !== undefined) return t[k];
      return noop;
    },
    set: function (t, k, v) { t[k] = v; return true; }
  });
}
function fakeEl(tag) {
  var el = {
    tagName: tag, style: { setProperty: function () { } }, children: [], classList: { add: function () { }, remove: function () { }, toggle: function () { }, contains: function () { return false; } },
    width: 320, height: 240, innerHTML: '', textContent: '', dataset: {},
    appendChild: function (c) { this.children.push(c); return c; }, removeChild: function () { }, insertBefore: function (c) { return c; },
    addEventListener: function () { }, removeEventListener: function () { }, setAttribute: function () { }, getAttribute: function () { return null; },
    querySelector: function () { return fakeEl('div'); }, querySelectorAll: function () { return []; },
    getContext: function () { return fakeCtx(); }, toDataURL: function () { return 'data:,'; }, focus: function () { }, blur: function () { },
    getBoundingClientRect: function () { return { left: 0, top: 0, width: 320, height: 240 }; }
  };
  return el;
}

function load(opts) {
  opts = opts || {};
  var html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  var srcs = [], re = /<script src="([^"]+)"><\/script>/g, m;
  while ((m = re.exec(html))) srcs.push(m[1]);
  // fichiers de mondes en cours d'écriture (pas encore dans index.html) : YN_EXTRA="data/worlds/a.js,data/worlds/b.js"
  var extra = (process.env.YN_EXTRA || '').split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s && srcs.indexOf(s) < 0; });
  if (extra.length) { var at = srcs.indexOf('data/quests.js'); if (at < 0) at = srcs.length - 1; srcs.splice.apply(srcs, [at, 0].concat(extra)); }
  var store = {};
  var sandbox = {
    console: console, Math: Math, Date: Date, JSON: JSON, setTimeout: function () { return 0; }, clearTimeout: function () { }, setInterval: function () { return 0; },
    performance: { now: function () { return Date.now(); } }, navigator: { userAgent: 'node', getGamepads: null },
    localStorage: { getItem: function (k) { return store[k] === undefined ? null : store[k]; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } },
    document: { createElement: fakeEl, getElementById: function () { return fakeEl('div'); }, addEventListener: function () { }, body: fakeEl('body'), documentElement: fakeEl('html'), querySelector: function () { return fakeEl('div'); }, querySelectorAll: function () { return []; }, hidden: false },
    location: { search: '', hash: '' }, innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
    addEventListener: function () { }, requestAnimationFrame: function () { }, AudioContext: undefined, Image: function () { return fakeEl('img'); },
    Uint8Array: Uint8Array, Int16Array: Int16Array, Uint8ClampedArray: Uint8ClampedArray, Float32Array: Float32Array, Proxy: Proxy, Promise: Promise, DOMMatrix: undefined
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.self = sandbox;
  vm.createContext(sandbox);
  srcs.forEach(function (s) {
    if (opts.skip && opts.skip.test(s)) return;
    var code = fs.readFileSync(path.join(ROOT, s), 'utf8');
    try { vm.runInContext(code, sandbox, { filename: s }); }
    catch (e) { console.error('ÉCHEC au chargement de ' + s + ' : ' + (e.stack || e)); throw e; }
  });
  return sandbox;
}
module.exports = { load: load, ROOT: ROOT };
