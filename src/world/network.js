/* =========================================================================
 *  Réseau des mondes : graphe des passages construit à partir des données.
 *  Sert aux sorcières (poursuite inter-mondes), à la carte du wiki et aux
 *  validations (accessibilité, portes sans retour).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var SAFE = { ROOM: 1, DREAMROOM: 1, NEXUS: 1, EFFECTROOM: 1 };

  var N = YN.net = {
    edges: null, rev: null, SAFE: SAFE,
    markDefs: function (def) {
      var out = [];
      U.keys(def.marks || {}).forEach(function (ch) { var m = def.marks[ch]; out.push(Object.assign({ _ch: ch }, m)); });
      (def.place || []).forEach(function (m) { out.push(m); });
      U.keys(def.variants || {}).forEach(function (v) {
        (def.variants[v].place || []).forEach(function (m) {
          var vc = v === 'dark' ? { dark: true } : v === 'snow' ? { snow: true } : v === 'doorAjar' ? { doorAjar: true } : v === 'white' ? { white: true } : def.variants[v].cond;
          out.push(Object.assign({}, m, { cond: m.cond ? [vc, m.cond] : vc }));
        });
      });
      return out;
    },
    build: function () {
      var E = {}, R = {};
      U.keys(YN.data.worlds).forEach(function (id) {
        var def = YN.data.worlds[id], list = E[id] = E[id] || [];
        N.markDefs(def).forEach(function (m) {
          if (!m.to || !(YN.DOOR_TYPES[m.type || 'decor'] || m.link)) return;
          list.push({ from: id, to: m.to, kind: m.type, cond: m.cond || (m.lock ? (m.lock.if || m.lock.unless || null) : null), oneway: !!m.oneway || m.type === 'fall' || m.type === 'hole', secret: !!m.secret || m.type === 'secret', mark: m.id || m._ch, debugOnly: !!m.debugOnly });
        });
        U.keys(def.boards || {}).forEach(function (k) { var b = def.boards[k]; list.push({ from: id, to: b.to || b, kind: 'chalk', cond: { effect: 'E09' }, oneway: false, viaMech: true, mark: 'board' + k }); });
        if (def.fall && def.fall.to) list.push({ from: id, to: def.fall.to, kind: 'fall', cond: def.fall.cond || null, oneway: true, viaMech: true, mark: 'fall' });
        (def.links || []).forEach(function (l) { list.push({ from: id, to: l.to, kind: l.kind || 'link', cond: l.cond || null, oneway: !!l.oneway, secret: !!l.secret, viaMech: true, debugOnly: !!l.debugOnly, note: l.note }); });
      });
      // mondes à apparition : un passage possible depuis chaque hôte admissible
      if (YN.spawns) U.keys(YN.data.worlds).forEach(function (tid) {
        var r = YN.data.worlds[tid].spawnRule; if (!r) return;
        U.keys(YN.data.worlds).forEach(function (hid) { if (YN.spawns.hostOk(YN.data.worlds[hid], Object.assign({ target: tid }, r))) (E[hid] = E[hid] || []).push({ from: hid, to: tid, kind: 'spawn', cond: r.cond || null, secret: true, spawn: true, oneway: false }); });
      });
      U.keys(E).forEach(function (id) { E[id].forEach(function (e) { (R[e.to] = R[e.to] || []).push(e); }); });
      N.edges = E; N.rev = R;
      return E;
    },
    neighbors: function (id, opts) {
      if (!N.edges) N.build();
      opts = opts || {};
      return (N.edges[id] || []).filter(function (e) {
        if (!YN.data.worlds[e.to]) return false;
        if (e.debugOnly && !opts.debug) return false;
        if (opts.noSafe && SAFE[e.to]) return false;
        if (opts.checkCond && e.cond && !YN.cond.check(e.cond)) return false;
        return true;
      });
    },
    /* voisins dans les deux sens (une sorcière peut remonter un passage) */
    adjacent: function (id, opts) {
      if (!N.edges) N.build();
      var set = {}, out = [];
      N.neighbors(id, opts).forEach(function (e) { if (!set[e.to]) { set[e.to] = 1; out.push(e.to); } });
      (N.rev[id] || []).forEach(function (e) {
        if (opts && opts.noSafe && SAFE[e.from]) return;
        if (e.oneway || e.debugOnly) return;
        if (!set[e.from]) { set[e.from] = 1; out.push(e.from); }
      });
      return out;
    },
    path: function (a, b, opts) {
      if (a === b) return [a];
      var prev = {}, q = [a]; prev[a] = null;
      while (q.length) {
        var c = q.shift();
        var nb = N.adjacent(c, opts);
        for (var i = 0; i < nb.length; i++) {
          var n = nb[i];
          if (n in prev) continue;
          prev[n] = c;
          if (n === b) { var p = [b], k = b; while (prev[k] !== null) { k = prev[k]; p.unshift(k); } return p; }
          q.push(n);
        }
      }
      return null;
    },
    distance: function (a, b, opts) { var p = N.path(a, b, opts); return p ? p.length - 1 : 99; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
