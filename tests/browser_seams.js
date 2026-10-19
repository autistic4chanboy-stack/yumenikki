/* Raccord des mondes qui bouclent, dans le vrai navigateur : la vue doit être identique au pixel près quand la
 * caméra est décalée d'exactement une largeur (ou une hauteur) de monde. À charger dans la page du jeu après
 * tests/dev_harness.js :  __seams()  → { W005: '0.0/0.0', … }  (pourcentage de pixels différents, horizontal/vertical) */
(function () {
  window.__seams = function (ids) {
    var R = YN.render, out = {};
    if (!YN.save.perm) YN.save.fresh();
    if (!YN.save.dream) YN.save.beginDream({});
    YN.game.state = 'dream';
    ids = ids || Object.keys(YN.data.worlds).filter(function (k) { var d = YN.data.worlds[k]; return /^W\d{3}$/.test(k) && d.wrap && !d.inf; }).sort();
    ids.forEach(function (id) {
      YN.game.enterWorld(id, null, null, 'resume'); YN.game.trans = false;
      var rt = YN.game.rt, t = R.tpx, cv = document.createElement('canvas'); cv.width = t * 20; cv.height = t * 14;
      var x = cv.getContext('2d'), W = cv.width, H = cv.height;
      var draw = function (cx, cy) { R.cam.x = cx; R.cam.y = cy; R.vx = cx; R.vy = cy; R.curT = t; x.clearRect(0, 0, W, H); var s0 = rt.style.stars; rt.style.stars = false; R.missing = 0; R.buildMs = 0; R.warm = true; R.drawWorld(x, rt, YN.game, W, H, 0); R.warm = false; rt.style.stars = s0; R.curT = 0; return R.missing; };
      var grab = function (cx, cy) { for (var k = 0; k < 200 && draw(cx, cy) > 0; k++); draw(cx, cy); return x.getImageData(0, 0, W, H); };
      var cmp = function (a, b) { var diff = 0; for (var i = 0; i < a.data.length; i += 4) if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > 30) diff++; return diff / (a.data.length / 4) * 100; };
      out[id] = cmp(grab(rt.w - 2.5, rt.h / 2), grab(-2.5, rt.h / 2)).toFixed(1) + '/' + cmp(grab(rt.w / 2, rt.h - 2.5), grab(rt.w / 2, -2.5)).toFixed(1);
    });
    return out;
  };
})();
