/* =========================================================================
 *  Bibliothèque de mécaniques génériques réutilisables par les mondes.
 *  (Chaque monde les combine avec ses propres paramètres.)
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, M = YN.mech;
  function G() { return YN.game; }
  function say(l, c, d) { YN.mechUtil.say(l, c, d); }

  /* porte / marque qui répond à une phrase dite à voix haute */
  M.password = {
    onSpeak: function (rt, s, p, n) {
      var m = rt.findMark(p.mark); if (!m || !YN.mechUtil.near(rt, m, p.dist || 3)) return false;
      var ok = (p.words || []).some(function (w) { return n === U.norm(w) || n.indexOf(U.norm(w)) >= 0; });
      if (!ok) { if (p.wrong) say([p.wrong]); return !!p.wrong; }
      if (p.flag) YN.save.setFlag(p.flag, true);
      if (p.do) YN.act.run(p.do, { mark: m });
      if (p.text) G().toast(p.text);
      YN.audio.sfx(p.sfx || 'reveal'); YN.world.reeval(rt);
      return true;
    }
  };

  /* lumière d'ambiance clignotante (néons, bougies) */
  M.flickerLights = {
    update: function (rt, s, p, dt) {
      s.t = (s.t || 0) + dt;
      rt.marks.forEach(function (m) { if (m.def.flickerLight) m.light = (Math.sin(s.t * (m.def.flickerSpeed || 7) + m.x) > -0.4) ? m.def.flickerLight : 0; });
    }
  };

  /* vent périodique qui pousse la joueuse (fenêtre ouverte, toits) */
  M.wind = {
    update: function (rt, s, p, dt) {
      s.t = (s.t || 0) + dt;
      rt.windNow = Math.sin(s.t * 0.5) * (p.strength || 0.5);
      if (p.push && Math.sin(s.t * 0.5) > 0.97 && !G().player.moving && !(s.cd > s.t)) {
        s.cd = s.t + 4;
        var dir = p.dir || 'right';
        if (!G().caps().scarf) { var d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir]; if (rt.passable(G().player.x + d[0], G().player.y + d[1], 'player', G().caps())) { G().player.dir = dir; G().tryMove(dir); YN.audio.sfx('wind_gust'); } }
      }
    }
  };

  /* événement à un instant précis du rêve (une fois) */
  M.timedEvent = {
    update: function (rt, s, p) {
      if (s.done || !YN.save.dream) return;
      var rem = YN.save.dream.remaining;
      if ((p.remainingLt !== undefined && rem < p.remainingLt) || (p.elapsedGt !== undefined && YN.save.dream.duration - rem > p.elapsedGt)) {
        s.done = true; YN.act.run(p.do, {}); if (p.lines) say(p.lines);
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
