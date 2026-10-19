/* =========================================================================
 *  Validation des données : références cassées, accessibilité, finitude.
 *  Utilisée au démarrage (rapide), dans la console de debug et par
 *  tools/validate.js / tests (complète). Ne prétend rien : elle compte.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  var HUB = { ROOM: 1, TERRACE: 1, HALL: 1, DREAMROOM: 1, NEXUS: 1, EFFECTROOM: 1 };

  function allMarkDefs(def) { return YN.net.markDefs(def); }
  function collectSetFlags() {
    var set = {};
    function scan(o, depth) {
      if (!o || depth > 12) return;
      if (Array.isArray(o)) { o.forEach(function (x) { scan(x, depth + 1); }); return; }
      if (typeof o !== 'object') return;
      ['set', 'setNow'].forEach(function (k) { if (o[k] && typeof o[k] === 'object') U.keys(o[k]).forEach(function (f) { set[f] = true; }); });
      U.keys(o).forEach(function (k) { if (typeof o[k] === 'object') scan(o[k], depth + 1); });
    }
    U.keys(YN.data.worlds).forEach(function (w) { scan(YN.data.worlds[w], 0); });
    U.keys(YN.data.entities).forEach(function (e) { scan(YN.data.entities[e], 0); });
    U.keys(YN.data.dialogues).forEach(function (d) { scan(YN.data.dialogues[d], 0); });
    (YN.data.quests || []).forEach(function (q) { scan(q, 0); });
    // drapeaux posés par du code (mécaniques) : déclarés dans YN.data.codeFlags
    (YN.data.codeFlags || []).forEach(function (f) { set[f] = true; });
    return set;
  }
  /* une condition peut-elle être remplie, avec ces effets ? (analyse statique prudente) */
  function staticOk(c, eff, flags, opts) {
    if (!c) return { ok: true };
    if (typeof c === 'function') return { ok: true, fn: true };
    if (Array.isArray(c)) { var r0 = { ok: true }; c.forEach(function (x) { var r = staticOk(x, eff, flags, opts); if (!r.ok) r0.ok = false; if (r.real) r0.real = true; if (r.debug) r0.debug = true; }); return r0; }
    var res = { ok: true };
    U.keys(c).forEach(function (k) {
      var v = c[k];
      switch (k) {
        case 'effect': if (!(Array.isArray(v) ? v : [v]).every(function (e) { return eff[e]; })) res.ok = false; break;
        case 'equipped': if (!(Array.isArray(v) ? v : [v]).some(function (e) { return eff[e]; })) res.ok = false; break;
        case 'anyEffect': if (!v.some(function (e) { return eff[e]; })) res.ok = false; break;
        case 'flag': if (!(Array.isArray(v) ? v : [v]).every(function (f) { return flags[f]; })) res.ok = false; break;
        case 'realDate': case 'realHour': case 'realTime': case 'weekday': res.real = true; break;
        case 'debug': if (v) res.debug = true; break;
        case 'any': var anyOk = v.some(function (x) { var r = staticOk(x, eff, flags, opts); if (r.real) res.real = true; return r.ok && !r.real; }); if (!anyOk) { var anyR = v.some(function (x) { var r = staticOk(x, eff, flags, opts); return r.ok; }); if (!anyR) res.ok = false; else res.real = true; } break;
        case 'all': v.forEach(function (x) { var r = staticOk(x, eff, flags, opts); if (!r.ok) res.ok = false; if (r.real) res.real = true; }); break;
        case 'not': break; // les négations sont toujours atteignables dans un sens ou l'autre
        case 'savedEffects': case 'effectsCount': if (U.keys(eff).length < v) res.ok = false; break;
        case 'eggs': break;
        default: break; // temps, chambre, quêtes, visites : contrôlés par la joueuse
      }
    });
    return res;
  }

  var V = YN.validate = {
    /* contrôle rapide des références */
    quick: function () {
      var errors = [], warnings = [];
      var W = YN.data.worlds, E = YN.data.entities;
      U.keys(W).forEach(function (id) {
        var d = W[id];
        allMarkDefs(d).forEach(function (m) {
          if (m.to && m.to !== 'WAKE' && !W[m.to]) errors.push(id + ': door to a missing world ' + m.to);
          if (m.give && !YN.effectById(m.give)) errors.push(id + ': unknown effect ' + m.give);
          if (m.dialog && !YN.data.dialogues[m.dialog]) errors.push(id + ': unknown dialogue ' + m.dialog);
        });
        (d.npcs || []).forEach(function (n) { if (!E[n.id]) errors.push(id + ': unknown NPC ' + n.id); });
        (d.mech || []).forEach(function (m) { if (YN.mech && U.keys(YN.mech).length && !YN.mech[m.type]) errors.push(id + ': unknown mechanic ' + m.type); });
        if (d.map) {
          var seen = {};
          d.map.forEach(function (row) { for (var i = 0; i < row.length; i++) { var ch = row[i]; if (/[A-Z0-9]/.test(ch) && !seen[ch]) { seen[ch] = 1; if (!(d.marks && ch in d.marks)) warnings.push(id + ': mark character without a definition ' + ch); } } });
        }
        if (!d.name) errors.push(id + ': no name');
        if (d.depth === undefined) warnings.push(id + ': missing depth');
      });
      U.keys(E).forEach(function (id) {
        var e = E[id];
        if (e.dialog && !YN.data.dialogues[e.dialog]) errors.push(id + ': unknown dialogue ' + e.dialog);
        if (e.world && !W[e.world]) warnings.push(id + ': missing home world ' + e.world);
      });
      YN.data.effects.forEach(function (ef) { if (ef.world && !W[ef.world]) warnings.push(ef.id + ': missing source world ' + ef.world); });
      return { errors: errors, warnings: warnings };
    },

    /* accessibilité depuis le Nexus, avec acquisition progressive des effets */
    reach: function (opts) {
      opts = opts || {};
      YN.net.build();
      var W = YN.data.worlds, flags = collectSetFlags(), eff = {}, reached = {}, realOnly = {}, changed = true, guard = 0;
      var limit = opts.coreOnly ? function (id) { return HUB[id] || (W[id] && W[id].core); } : function () { return true; };
      var exclude = opts.excludeEffects || {};
      while (changed && guard++ < 60) {
        changed = false;
        var q = ['NEXUS', 'DREAMROOM'], seen = {};
        q.forEach(function (x) { seen[x] = 1; });
        while (q.length) {
          var c = q.shift();
          if (!reached[c]) { reached[c] = true; changed = true; }
          (YN.net.edges[c] || []).forEach(function (e) {
            if (!W[e.to] || seen[e.to] || !limit(e.to)) return;
            if (e.debugOnly) return;
            var r = staticOk(e.cond, eff, flags);
            if (!r.ok || r.debug) return;
            if (r.real) { realOnly[e.to] = true; if (opts.noReal) return; }
            seen[e.to] = 1; q.push(e.to);
          });
        }
        YN.data.effects.forEach(function (ef) {
          if (eff[ef.id] || exclude[ef.id]) return;
          if (ef.req && !staticOk(ef.req, eff, flags).ok) return;
          if (ef.world && reached[ef.world] && limit(ef.world)) { eff[ef.id] = true; changed = true; }
        });
      }
      return { reached: reached, effects: eff, realOnly: realOnly };
    },

    counts: function () {
      var W = YN.data.worlds, ids = U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); });
      var by = function (f) { return ids.filter(function (k) { return f(W[k]); }).length; };
      var ents = U.keys(YN.data.entities);
      return {
        worlds: ids.length, core: by(function (d) { return d.core; }),
        implemented: by(function (d) { return d.status === 'implemented' || d.status === 'tested'; }), partial: by(function (d) { return d.status === 'partial'; }), designed: by(function (d) { return !d.status || d.status === 'designed'; }),
        tiers: { easy: by(function (d) { return d.tier === 'easy'; }), mid: by(function (d) { return d.tier === 'mid'; }), hard: by(function (d) { return d.tier === 'hard' || d.tier === 'extreme'; }), extreme: by(function (d) { return d.tier === 'extreme'; }) },
        depths: [0, 1, 2, 3, 4, 5].map(function (n) { return by(function (d) { return (d.depth || 0) === n; }); }),
        entities: ents.length, majors: ents.filter(function (k) { return YN.data.entities[k].major; }).length,
        effects: YN.data.effects.length, coreEffects: YN.data.effects.filter(function (e) { return e.core; }).length,
        puzzles: (YN.data.puzzles || []).length || YN.data.effects.filter(function (e) { return e.puzzle; }).length, mechanics: ids.reduce(function (n, k) { return n + (W[k].mech || []).length; }, 0), quests: (YN.data.quests || []).length,
        infinite: by(function (d) { return !!d.inf || !!d.wrap || !!d.loop; }), witches: (YN.data.witches || []).length
      };
    },

    run: function () {
      var q = V.quick(), c = V.counts();
      var all = V.reach({}), core = V.reach({ coreOnly: true, noReal: true });
      var W = YN.data.worlds, ids = U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); });
      var unreachable = ids.filter(function (k) { return !all.reached[k] && !W[k].debugWorld; });
      var debugWorlds = ids.filter(function (k) { return W[k].debugWorld; });
      var coreEff = U.keys(core.effects).filter(function (e) { return YN.effectById(e).core; });
      // robustesse : aucune énigme seule ne doit bloquer la fin
      var fragile = [];
      YN.data.effects.filter(function (e) { return e.core; }).forEach(function (e) {
        var ex = {}; ex[e.id] = true;
        var r = V.reach({ coreOnly: true, noReal: true, excludeEffects: ex });
        if (U.keys(r.effects).length < 30) fragile.push(e.id);
      });
      // portes sans retour (hors chutes et passages à sens unique)
      var noReturn = [];
      U.keys(YN.net.edges).forEach(function (from) {
        YN.net.edges[from].forEach(function (e) {
          if (e.oneway || e.to === 'WAKE' || !W[e.to] || e.debugOnly) return;
          var back = (YN.net.edges[e.to] || []).some(function (b) { return b.to === from; }) || (YN.net.edges[e.to] || []).length > 0;
          if (!back) noReturn.push(from + ' → ' + e.to);
        });
      });
      var rep = {
        counts: c, errors: q.errors, warnings: q.warnings,
        unreachable: unreachable, debugWorlds: debugWorlds, realTimeOnly: U.keys(all.realOnly),
        coreObtainable: coreEff.length, fragile: fragile, noReturn: noReturn,
        finishable: coreEff.length >= 30 && !fragile.length
      };
      rep.summary = 'worlds ' + c.worlds + ' (implemented ' + c.implemented + ', partial ' + c.partial + ', designed ' + c.designed + ') · NPCs ' + c.entities + ' · effects ' + c.effects +
        ' · errors ' + q.errors.length + ' · unreachable ' + unreachable.length + ' · core effects obtainable ' + coreEff.length + '/36 · ending ' + (rep.finishable ? 'OK' : 'NO');
      return rep;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
