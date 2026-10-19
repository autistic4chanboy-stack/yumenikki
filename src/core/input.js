/* =========================================================================
 *  Entrées : clavier (codes physiques → ZQSD sur AZERTY, WASD sur QWERTY),
 *  manette standard, mode « saisie de texte » qui suspend le jeu.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;

  var DEFAULT_MAP = {
    up: ['ArrowUp', 'KeyW'],
    down: ['ArrowDown', 'KeyS'],
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    act: ['Space', 'Enter', 'NumpadEnter'],
    back: ['Escape', 'Backspace'],
    effect: ['KeyF'],
    effects: ['Tab', 'KeyI'],
    speak: ['KeyT'],
    pinch: ['KeyP', 'Digit9', 'Numpad9'],
    run: ['ShiftLeft', 'ShiftRight'],
    map: ['KeyM'],
    ascii: ['F9'],
    console: ['Backquote', 'IntlBackslash'],
    num1: ['Digit1', 'Numpad1'], num2: ['Digit2', 'Numpad2'], num3: ['Digit3', 'Numpad3'],
    num4: ['Digit4', 'Numpad4'], num5: ['Digit5', 'Numpad5']
  };

  var I = YN.input = {
    map: JSON.parse(JSON.stringify(DEFAULT_MAP)),
    down: {},      // code -> true
    hit: {},       // action -> nombre d'appuis non consommés
    typing: false, // saisie de texte en cours
    dirStack: [],  // dernière direction pressée = prioritaire
    pad: { connected: false, prev: {}, axes: [0, 0] },
    lastInputAt: 0,
    anyKeyFns: [],

    actionOf: function (code) {
      var res = [];
      for (var a in I.map) if (I.map[a].indexOf(code) >= 0) res.push(a);
      return res;
    },
    init: function () {
      if (typeof document === 'undefined') return;
      try {
        var saved = JSON.parse(YN.store.get('yn_dream_archive_keys') || 'null');
        if (saved) for (var a in saved) if (I.map[a] && Array.isArray(saved[a])) I.map[a] = saved[a];
      } catch (e) { /* défaut */ }
      document.addEventListener('keydown', function (e) {
        I.lastInputAt = performance.now();
        for (var f = 0; f < I.anyKeyFns.length; f++) I.anyKeyFns[f](e);
        if (I.typing) return; // le champ de texte gère lui-même
        var acts = I.actionOf(e.code);
        if (acts.length || e.code === 'F11') {
          if (e.code !== 'F11' && e.code !== 'F12' && e.code !== 'F5') e.preventDefault();
        }
        if (!I.down[e.code]) {
          acts.forEach(function (a) {
            I.hit[a] = (I.hit[a] || 0) + 1;
            if (a === 'up' || a === 'down' || a === 'left' || a === 'right') {
              var i = I.dirStack.indexOf(a); if (i >= 0) I.dirStack.splice(i, 1);
              I.dirStack.push(a);
            }
          });
        }
        I.down[e.code] = true;
      });
      document.addEventListener('keyup', function (e) {
        I.down[e.code] = false;
        I.actionOf(e.code).forEach(function (a) {
          if (!I.held(a)) { var i = I.dirStack.indexOf(a); if (i >= 0) I.dirStack.splice(i, 1); }
        });
      });
      root.addEventListener('blur', function () { I.releaseAll(); });
      root.addEventListener('gamepadconnected', function () { I.pad.connected = true; });
      root.addEventListener('gamepaddisconnected', function () { I.pad.connected = false; });
    },
    saveMap: function () { YN.store.set('yn_dream_archive_keys', JSON.stringify(I.map)); },
    resetMap: function () { I.map = JSON.parse(JSON.stringify(DEFAULT_MAP)); I.saveMap(); },
    releaseAll: function () { I.down = {}; I.hit = {}; I.dirStack = []; },
    held: function (a) {
      var codes = I.map[a] || [];
      for (var i = 0; i < codes.length; i++) if (I.down[codes[i]]) return true;
      return !!I.pad['h_' + a];
    },
    pressed: function (a) { // consomme un appui
      if (I.typing) return false;
      if (I.hit[a] > 0) { I.hit[a]--; return true; }
      return false;
    },
    peek: function (a) { return I.hit[a] > 0; },
    clearHits: function () { I.hit = {}; },
    dir: function () { // direction prioritaire tenue
      if (I.typing) return null;
      for (var i = I.dirStack.length - 1; i >= 0; i--) if (I.held(I.dirStack[i])) return I.dirStack[i];
      var pa = I.pad.axes;
      if (Math.abs(pa[0]) > 0.5 || Math.abs(pa[1]) > 0.5) {
        if (Math.abs(pa[0]) > Math.abs(pa[1])) return pa[0] < 0 ? 'left' : 'right';
        return pa[1] < 0 ? 'up' : 'down';
      }
      var ds = ['up', 'down', 'left', 'right'];
      for (var j = 0; j < ds.length; j++) if (I.pad['h_' + ds[j]]) return ds[j];
      return null;
    },
    /* vecteur analogique (clavier 8 directions + stick), longueur ≤ 1 */
    axis: function () {
      if (I.typing) return [0, 0];
      var x = (I.held('right') ? 1 : 0) - (I.held('left') ? 1 : 0), y = (I.held('down') ? 1 : 0) - (I.held('up') ? 1 : 0);
      var pa = I.pad.axes, m = Math.sqrt(pa[0] * pa[0] + pa[1] * pa[1]);
      if (m > 0.22) { var k = Math.min(1, (m - 0.22) / 0.7) / m; x += pa[0] * k; y += pa[1] * k; }
      var l = Math.sqrt(x * x + y * y);
      return l > 1 ? [x / l, y / l] : [x, y];
    },
    /* manette standard (Xbox / PlayStation) */
    pollPad: function () {
      if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
      var pads = navigator.getGamepads(), gp = null;
      for (var i = 0; i < pads.length; i++) if (pads[i]) { gp = pads[i]; break; }
      if (!gp) return;
      I.pad.connected = true;
      var B = function (n) { return !!(gp.buttons[n] && gp.buttons[n].pressed); };
      var state = {
        act: B(0), back: B(1), effect: B(2), effects: B(3), speak: B(4), run: B(5) || B(7),
        pinch: B(6), up: B(12), down: B(13), left: B(14), right: B(15)
      };
      if (B(9)) state.back = true;
      for (var a in state) {
        if (state[a] && !I.pad.prev[a]) { I.hit[a] = (I.hit[a] || 0) + 1; I.lastInputAt = performance.now(); }
        I.pad['h_' + a] = state[a];
      }
      I.pad.prev = state;
      I.pad.axes = [gp.axes[0] || 0, gp.axes[1] || 0];
    },
    rumble: function (ms, strength) {
      if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
      var pads = navigator.getGamepads();
      for (var i = 0; i < pads.length; i++) {
        var gp = pads[i];
        if (gp && gp.vibrationActuator && gp.vibrationActuator.playEffect) {
          try { gp.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: strength || 0.5, weakMagnitude: (strength || 0.5) / 2 }); } catch (e) { /* rien */ }
        }
      }
    },
    label: function (a) {
      var c = (I.map[a] || [])[0] || '?';
      return c.replace('Key', '').replace('Digit', '').replace('Arrow', '')
        .replace('Escape', 'Esc').replace('ShiftLeft', 'Shift').replace('ShiftRight', 'R Shift').replace('Backquote', '`');
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
