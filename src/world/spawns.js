/* =========================================================================
 *  MONDES À APPARITION (W141–W150)
 *  Dix mondes qui n'ont pas de porte fixe : ils s'ouvrent dans d'autres
 *  mondes selon une règle explicite (déclarée par chaque monde dans
 *  `spawnRule`). Ils ne sont jamais nécessaires à la progression.
 *
 *  spawnRule = { in: [ids] | { depthMin, depthMax, outdoor },
 *                cond: condition,       // évaluée à l'entrée du monde hôte
 *                chance: 0..1,          // tirage stable pour la nuit et le monde
 *                as: 'door'|'stairs'|'elevator'|'hole',
 *                still: secondes,       // n'apparaît que si l'on reste immobile
 *                look, lookOpt, label }
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  function G() { return YN.game; }

  var SP = YN.spawns = {
    rules: function () { var out = []; U.keys(YN.data.worlds).forEach(function (id) { var d = YN.data.worlds[id]; if (d.spawnRule) out.push({ id: id, r: d.spawnRule }); }); return out; },
    hostOk: function (host, r) {
      if (!host || host.safe || host.depth === 0 || host.id === r.target) return false;
      if (Array.isArray(r.in)) return r.in.indexOf(host.id) >= 0;
      var w = r.in || {};
      if (w.depthMin !== undefined && (host.depth || 0) < w.depthMin) return false;
      if (w.depthMax !== undefined && (host.depth || 0) > w.depthMax) return false;
      if (w.outdoor && !host.outdoor) return false;
      if (w.core === false && host.core) return false;
      return true;
    },
    roll: function (hostId, targetId, p) {
      var no = YN.save.dream ? YN.save.dream.no : 0;
      return YN.rng.make(YN.rng.hash(no + ':' + hostId + ':' + targetId)).next() < p;
    },
    /* appelé après la construction d'un monde hôte */
    apply: function (rt) {
      if (!YN.save.dream || rt.inf) return;
      SP.rules().forEach(function (o) {
        var r = Object.assign({ target: o.id }, o.r);
        if (!SP.hostOk(rt.def, r)) return;
        if (r.chance !== undefined && !SP.roll(rt.id, o.id, r.chance)) return;
        var md = { id: 'spawn_' + o.id, type: r.as || 'door', to: o.id, look: r.look || (r.as === 'stairs' ? 'stairsdown' : r.as === 'elevator' ? 'elevator' : r.as === 'hole' ? 'hole' : 'door'), lookOpt: r.lookOpt || { style: 'wood', c: ['#2a2a3a'] }, cond: r.cond, label: r.label, spawned: true, at: 'random-any', appearSfx: 'reveal' };
        if (r.still) { md.cond = { all: [r.cond || {}, { temp: (function () { var t = {}; t['still_' + rt.id] = true; return t; })() }] }; }
        var at = YN.world.resolveAt(rt, 'random-any', 900 + o.id.charCodeAt(3) * 7);
        if (!at) return;
        var m = YN.world.addMark(rt, md, at[0], at[1], null);
        m.active = !md.cond || YN.cond.check(md.cond, { mark: m, rt: rt });
      });
    },
    /* « le passage quand on s'arrête » : immobile assez longtemps, il s'ouvre */
    update: function (rt, dt) {
      if (!YN.save.dream || !rt) return;
      var p = G().player;
      SP._still = p.moving ? 0 : (SP._still || 0) + dt;
      var need = 0;
      rt.marks.forEach(function (m) { if (m.def.spawned && YN.data.worlds[m.def.to] && YN.data.worlds[m.def.to].spawnRule.still) need = YN.data.worlds[m.def.to].spawnRule.still; });
      if (need && SP._still > need && !YN.save.temp('still_' + rt.id)) { YN.save.temp('still_' + rt.id, true); YN.world.reeval(rt); G().toast('Something opened while she stood still.'); }
    }
  };
  YN.bus.on('worldEnter', function (rt) { SP._still = 0; });
})(typeof window !== 'undefined' ? window : globalThis);
