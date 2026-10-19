/* =========================================================================
 *  Démarrage et boucle principale.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  YN.session = { accepted: false, started: performance.now() };

  function boot() {
    YN.store.init();
    YN.save.loadSettings();
    YN.save.load();
    YN.input.init();
    YN.render.init(document.getElementById('screen'));
    YN.ui.init();
    YN.net.build();
    YN.bus.emit('boot');
    if (YN.validate && YN.validate.quick) {
      var q = YN.validate.quick();
      if (q.errors.length) q.errors.slice(0, 20).forEach(function (e) { YN.warn('data: ' + e); });
    }
    // l'audio ne démarre qu'après un geste de la joueuse
    var unlock = function () { YN.audio.unlock(); document.removeEventListener('keydown', unlock, true); document.removeEventListener('pointerdown', unlock, true); };
    document.addEventListener('keydown', unlock, true); document.addEventListener('pointerdown', unlock, true);
    // onglet caché : pause explicite (le rêve ne compte pas en secret)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && YN.game.rt && (YN.game.state === 'dream' || YN.game.state === 'room') && !YN.game.paused) {
        YN.game.snapshot(); YN.ui.pause.open();
      }
    });
    root.addEventListener('beforeunload', function () { YN.game.snapshot(); });
    // secrets de console
    try {
      console.log('%c░▒▓ YUME NIKKI — The Dream Archive ▓▒░', 'color:#b8a8ff;font:bold 14px monospace');
      console.log('%cIf you are reading this, she is still asleep.', 'color:#888;font-style:italic');
    } catch (e) { /* rien */ }
    YN.game.state = 'title';
    YN.ui.fade.out(0.8);
    YN.ui.warning(function () { YN.ui.title(); });
    last = performance.now();
    requestAnimationFrame(loop);
  }

  var last = 0, fpsEl = null;
  function loop(now) {
    var dt = (now - last) / 1000; last = now;
    if (dt < 0) dt = 0;
    if (dt > 2) dt = 2; // au-delà, l'onglet était suspendu : la pause a été ouverte
    // cadence d'écran courante : on recale le pas sur l'image exacte (défilement au pixel régulier)
    [1 / 60, 1 / 120, 1 / 144, 1 / 75, 1 / 165, 1 / 90, 1 / 100, 1 / 240].some(function (f) { if (Math.abs(dt - f) < f * 0.12) { dt = f; return true; } return false; });
    // fréquence de l'écran, lissée (sert au rythme des pas au pixel)
    if (dt > 0 && dt < 0.05) { var hz0 = 1 / dt; YN.render.hzAvg = YN.render.hzAvg ? YN.render.hzAvg * 0.97 + hz0 * 0.03 : hz0; YN.render.hz = [60, 75, 90, 100, 120, 144, 165, 240].reduce(function (b, f) { return Math.abs(f - YN.render.hzAvg) < Math.abs(b - YN.render.hzAvg) ? f : b; }, 60); }
    try {
      YN.input.pollPad();
      YN.game.update(dt);
      if (YN.game.rt) YN.render.frame(Math.min(dt, 0.1));
      YN.ui.hud.tick();
      YN.ui.bubbles.position();
      YN.ui.minimap.draw();
      if (YN.save.settings && YN.save.settings.showFps) {
        fpsEl = fpsEl || document.getElementById('fps');
        fpsEl.style.display = 'block';
        fpsEl.textContent = YN.render.fps + ' fps · ' + (YN.game.rt ? YN.game.rt.id : '') + (YN.game.rt && YN.game.rt.inf ? ' · chunks ' + YN.game.rt.inf.cached() : '');
      } else if (fpsEl) fpsEl.style.display = 'none';
    } catch (e) {
      YN.warn('loop: ' + (e.stack || e));
      if (!loop.errShown) { loop.errShown = true; YN.ui.toast('Something went wrong (see the console).', 4); }
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  void U;
})(window);
