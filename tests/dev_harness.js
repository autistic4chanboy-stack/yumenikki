/* Outil de développement : piloter le jeu image par image depuis la console
 * (utilisé pour les vérifications visuelles automatisées). Non chargé par le jeu. */
(function () {
  window.__step = function (n, dt) { for (var i = 0; i < n; i++) { YN.game.update(dt || 0.033); if (YN.game.rt) YN.render.frame(dt || 0.033); YN.ui.hud.tick(); } };
  window.__shot = function (name) { return fetch('/__shot?name=' + name, { method: 'POST', body: document.getElementById('screen').toDataURL() }).then(function (r) { return r.text(); }); };
  window.__shotx = function (name, k) { k = k || 3; var s = document.getElementById('screen'), c = document.createElement('canvas'); c.width = s.width * k; c.height = s.height * k; var x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.filter = getComputedStyle(s).filter || 'none'; x.drawImage(s, 0, 0, c.width, c.height); return fetch('/__shot?name=' + name, { method: 'POST', body: c.toDataURL() }).then(function (r) { return r.text(); }); };
  window.__wait =function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* marche libre : dir peut être 'up', 'downleft'… ; n = nombre de cases environ */
  window.__walk = function (dir, n) {
    var K = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    var codes = []; ['up', 'down', 'left', 'right'].forEach(function (d) { if (dir.indexOf(d) >= 0) codes.push(K[d]); });
    var frames = Math.round((n || 1) / 3.6 / 0.033) + 1;
    codes.forEach(function (c) { YN.input.down[c] = true; });
    __step(frames);
    codes.forEach(function (c) { YN.input.down[c] = false; });
    __step(6);
    var p = YN.game.player; return [p.px.toFixed(2), p.py.toFixed(2), p.x, p.y, p.dir];
  };
  window.__key = function (action) { YN.input.hit[action] = (YN.input.hit[action] || 0) + 1; __step(1); };
  window.__start = async function () { YN.ui.top().activate(); YN.ui.top().activate(); YN.ui.top().activate(); __step(3); };
  window.__dream = async function () { YN.game.sleep(); await __wait(2600); __step(3); };
  window.__tp = async function (id, at) { YN.game.warp(id, at); await __wait(900); __step(3); };
  window.__log = function (n) { return YN.devLog.slice(-(n || 6)).map(function (l) { return l.msg; }); };
  window.__closeUI = function () { while (YN.ui.stack.length) YN.ui.pop(YN.ui.top()); if (YN.ui.dialog.open) YN.ui.dialog.close(); };
})();
