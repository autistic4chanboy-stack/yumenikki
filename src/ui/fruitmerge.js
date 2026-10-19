/* =========================================================================
 *  La borne d'arcade de la chambre : fusion de fruits sur 4×4 (façon 2048).
 *  Cerise → fraise → raisin → mandarine → pomme → poire → pêche → ananas →
 *  melon → pastèque. Deux pastèques ne fusionnent pas... sauf en trichant.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var NAMES = ['', 'cherry', 'strawberry', 'grape', 'tangerine', 'apple', 'pear', 'peach', 'pineapple', 'melon', 'watermelon', '?'];
  var COLS = ['', '#d02030', '#e8405a', '#7a40b0', '#f09020', '#d84030', '#b8d040', '#f0a080', '#e8c030', '#a0d070', '#40a050', '#000'];

  function drawFruit(x, lvl, s) {
    var c = COLS[lvl], m = s / 16;
    function R(i, j, w, h, col) { x.fillStyle = col; x.fillRect(Math.round(i * m), Math.round(j * m), Math.ceil(w * m), Math.ceil(h * m)); }
    switch (lvl) {
      case 1: R(4, 8, 4, 4, c); R(9, 9, 4, 4, c); R(7, 3, 1, 6, '#4a8030'); R(8, 3, 3, 1, '#4a8030'); R(5, 9, 1, 1, '#fff'); break;
      case 2: R(4, 6, 8, 6, c); R(5, 12, 6, 1, c); R(6, 13, 4, 1, c); R(5, 4, 6, 2, '#40a040'); [6, 9, 7, 10].forEach(function (k, i) { R(k, 8 + (i % 2) * 2, 1, 1, '#f8e070'); }); break;
      case 3: for (var i = 0; i < 6; i++) R(4 + (i % 3) * 3, 5 + Math.floor(i / 3) * 3, 3, 3, c); R(6, 11, 3, 3, c); R(7, 2, 1, 3, '#6a4a2a'); break;
      case 4: R(3, 5, 10, 8, c); R(4, 4, 8, 10, c); R(7, 3, 2, 1, '#50a040'); R(5, 6, 2, 1, '#ffd080'); break;
      case 5: R(3, 5, 10, 8, c); R(4, 4, 8, 10, c); R(7, 2, 1, 3, '#6a4a2a'); R(8, 2, 3, 2, '#50a040'); R(5, 6, 2, 2, '#ff8080'); break;
      case 6: R(5, 3, 6, 5, c); R(3, 8, 10, 6, c); R(7, 1, 1, 3, '#6a4a2a'); break;
      case 7: R(3, 5, 10, 8, c); R(4, 4, 8, 10, c); R(8, 4, 1, 10, '#e07060'); R(7, 2, 3, 2, '#50a040'); break;
      case 8: R(4, 6, 8, 8, c); for (var k = 0; k < 4; k++) R(5 + k * 2, 7 + (k % 2) * 3, 1, 1, '#a07010'); R(5, 2, 2, 4, '#3a8a30'); R(9, 2, 2, 4, '#3a8a30'); R(7, 1, 2, 5, '#3a8a30'); break;
      case 9: R(2, 4, 12, 9, c); R(3, 3, 10, 11, c); for (var q = 0; q < 4; q++) R(3 + q * 3, 4, 1, 9, '#80b050'); break;
      case 10: R(1, 4, 14, 9, c); R(2, 3, 12, 11, c); for (var z = 0; z < 5; z++) R(2 + z * 3, 3, 1, 11, '#2a7038'); R(5, 6, 6, 4, '#e04050'); break;
      case 11: x.fillStyle = '#000'; x.fillRect(0, 0, s, s); x.fillStyle = '#fff'; x.font = 'bold ' + Math.round(s * 0.7) + 'px monospace'; x.textAlign = 'center'; x.fillText('?', s / 2, s * 0.78); break;
    }
  }

  var F = YN.fruit = {
    NAMES: NAMES,
    open: function () {
      var UI = YN.ui, el = UI.el;
      var p = { node: el('div', 'panel fruit') };
      var g = [], score = 0, over = false, best = (YN.save.perm.arcade && YN.save.perm.arcade.best) || 0;
      for (var i = 0; i < 16; i++) g.push(0);
      function spawn() { var e = []; g.forEach(function (v, i) { if (!v) e.push(i); }); if (!e.length) return; g[e[Math.floor(Math.random() * e.length)]] = Math.random() < 0.9 ? 1 : 2; }
      spawn(); spawn();
      var cv = document.createElement('canvas'); cv.width = 4 * 40 + 10; cv.height = 4 * 40 + 10;
      p.node.innerHTML = '<h2>FRUITS</h2><div class="sc"></div>';
      p.node.appendChild(cv);
      p.node.appendChild(el('div', 'hint', 'Arrows: push · Esc: quit'));
      var x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
      function draw() {
        x.fillStyle = '#1a1830'; x.fillRect(0, 0, cv.width, cv.height);
        for (var i = 0; i < 16; i++) {
          var cx = 5 + (i % 4) * 40, cy = 5 + Math.floor(i / 4) * 40;
          x.fillStyle = '#2a2848'; x.fillRect(cx + 2, cy + 2, 36, 36);
          if (g[i]) { x.save(); x.translate(cx + 4, cy + 4); drawFruit(x, g[i], 32); x.restore(); }
        }
        if (over) { x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = '#fff'; x.font = '14px monospace'; x.textAlign = 'center'; x.fillText('END', cv.width / 2, cv.height / 2); }
        var top = Math.max.apply(null, g);
        p.node.querySelector('.sc').textContent = 'score ' + score + ' · best ' + best + (top ? ' · ' + NAMES[top] : '');
      }
      function move(dir) {
        if (over) return;
        var moved = false, cheat = YN.debug && YN.debug.unlocked();
        for (var a = 0; a < 4; a++) {
          var line = [];
          for (var b = 0; b < 4; b++) {
            var idx = dir === 'left' ? a * 4 + b : dir === 'right' ? a * 4 + (3 - b) : dir === 'up' ? b * 4 + a : (3 - b) * 4 + a;
            line.push(idx);
          }
          var vals = line.map(function (i) { return g[i]; }).filter(function (v) { return v; }), out = [];
          for (var k = 0; k < vals.length; k++) {
            if (k + 1 < vals.length && vals[k] === vals[k + 1] && (vals[k] < 10 || cheat)) {
              var nv = vals[k] + 1; out.push(nv); score += Math.pow(2, nv); k++;
              if (nv >= 10) YN.save.setFlag('arcade_watermelon', true, true);
              if (nv === 11) { YN.save.setFlag('arcade_question', true, true); YN.audio.sfx('ascii'); }
            } else out.push(vals[k]);
          }
          while (out.length < 4) out.push(0);
          line.forEach(function (i, j) { if (g[i] !== out[j]) moved = true; g[i] = out[j]; });
        }
        if (moved) {
          spawn(); YN.audio.sfx('menu_move');
          var can = g.some(function (v) { return !v; });
          for (var i = 0; i < 16 && !can; i++) { var r = i % 4, c = Math.floor(i / 4); if (r < 3 && g[i] === g[i + 1]) can = true; if (c < 3 && g[i] === g[i + 4]) can = true; }
          if (!can) { over = true; YN.audio.sfx('lose'); }
          if (score > best) { best = score; YN.save.perm.arcade.best = best; }
          var top = Math.max.apply(null, g); if (top > (YN.save.perm.arcade.bestFruit || 0)) YN.save.perm.arcade.bestFruit = top;
          YN.save.write();
        }
        draw();
      }
      p.onKey = function (e) {
        var c = e.code;
        if (c === 'Escape') { UI.pop(p); return; }
        if (c === 'ArrowLeft' || c === 'KeyA') move('left');
        else if (c === 'ArrowRight' || c === 'KeyD') move('right');
        else if (c === 'ArrowUp' || c === 'KeyW') move('up');
        else if (c === 'ArrowDown' || c === 'KeyS') move('down');
        else if ((c === 'Enter' || c === 'Space') && over) { for (var i = 0; i < 16; i++) g[i] = 0; score = 0; over = false; spawn(); spawn(); draw(); }
        else return false;
      };
      YN.ui.root.appendChild(p.node); draw(); YN.ui.push(p);
      YN.audio.playMusic('arcade', { fade: 0.5 });
      var origPop = YN.ui.pop;
      void origPop;
      p.onClose = function () { if (YN.game.rt) YN.audio.playMusic(YN.game.rt.music, { fade: 1 }); };
    },
    draw: drawFruit
  };
})(typeof window !== 'undefined' ? window : globalThis);
