/* =========================================================================
 *  COLLECTIONS — semer, ramasser, compter (données : data/collections.js).
 *  Chaque nuit : une partie de ce qui manque est confiée à quelques mondes.
 *  Les cachettes (src/world/secrets.js) en reçoivent d'abord ; le reste va
 *  dans un recoin. Ce qui est ramassé est gardé pour toujours.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  function H(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }

  var C = YN.collect = {
    set: function (id) { return (YN.data.collections || []).filter(function (s) { return s.id === id; })[0] || null; },
    have: function (id) { var p = YN.save.perm; if (!p) return []; p.collect = p.collect || {}; return p.collect[id] || (p.collect[id] = []); },
    count: function (id) { return C.have(id).length; },
    eligibleWorlds: function () {
      if (C._worlds) return C._worlds;
      var W = YN.data.worlds;
      C._worlds = U.keys(W).filter(function (k) { var d = W[k], v = (d.style && d.style.view) || 'top'; return /^W\d{3}$/.test(k) && (d.depth || 0) >= 1 && (d.depth || 0) <= 4 && v === 'top' && !d.inf; });
      return C._worlds;
    },
    /* le plan de la nuit : quelles pièces dans quels mondes */
    plan: function () {
      var D = YN.save.dream; if (!D) return null;
      if (D.collectPlan) return D.collectPlan;
      var r = YN.rng.make((H('collect') ^ Math.imul(D.no || 1, 2654435761) ^ ((YN.save.perm && YN.save.perm.created) || 1)) >>> 0);
      var worlds = C.eligibleWorlds(), vast = YN.data.vastWorlds || [], plan = { byWorld: {}, extra: [] };
      (YN.data.collections || []).forEach(function (s) {
        var have = C.have(s.id), missing = [];
        for (var i = 0; i < s.pieces.length; i++) if (have.indexOf(i) < 0) missing.push(i);
        missing = U.shuffle(missing, r);
        missing.forEach(function (idx, n) {
          if (n < s.perNight) {
            var w = r.chance(0.3) && vast.length ? vast[r.int(0, vast.length - 1)] : worlds[r.int(0, worlds.length - 1)];
            (plan.byWorld[w] = plan.byWorld[w] || []).push({ set: s.id, idx: idx });
          } else plan.extra.push({ set: s.id, idx: idx });
        });
      });
      plan.extra = U.shuffle(plan.extra, r).slice(0, 30);
      D.collectPlan = plan;
      return plan;
    },
    markDef: function (p) {
      var s = C.set(p.set);
      return { id: 'col_' + p.set + '_' + p.idx, type: 'decor', look: s.look, lookOpt: { c: [s.color] }, solid: false, flat: true, animated: true, collectSet: p.set, collectIdx: p.idx,
        use: [function (ctx) { C.take(ctx.mark); }] };
    },
    /* une cachette demande quelque chose à garder */
    placeIn: function (rt, x, y) {
      var pl = C.plan(); if (!pl) return false;
      rt._colPlaced = rt._colPlaced || {};
      var mine = (pl.byWorld[rt.id] || []).filter(function (p) { return !rt._colPlaced[p.set + p.idx] && C.have(p.set).indexOf(p.idx) < 0; })[0];
      if (!mine) { mine = pl.extra.shift(); if (mine) (pl.byWorld[rt.id] = pl.byWorld[rt.id] || []).push(mine); }
      if (!mine) return false;
      rt._colPlaced[mine.set + mine.idx] = 1;
      var d = C.markDef(mine); d.inSecret = true;
      YN.world.addMark(rt, d, x, y, null);
      return true;
    },
    /* après les cachettes : le reste de la part de ce monde, dans des recoins */
    onBuild: function (rt) {
      var pl = C.plan();
      if (rt.id === 'DREAMROOM') C.shelf(rt);
      if (!pl || rt.inf) return;
      rt._colPlaced = rt._colPlaced || {};
      (pl.byWorld[rt.id] || []).forEach(function (p, i) {
        if (rt._colPlaced[p.set + p.idx] || C.have(p.set).indexOf(p.idx) >= 0) return;
        var d = C.markDef(p); d.at = 'random-hidden';
        var at = YN.world.resolveAt(rt, 'random-hidden', 300 + i);
        if (at) { YN.world.addMark(rt, d, at[0], at[1], null); rt._colPlaced[p.set + p.idx] = 1; }
      });
    },
    take: function (m) {
      var s = C.set(m.def.collectSet), idx = m.def.collectIdx, have = C.have(s.id);
      m.active = false;
      if (have.indexOf(idx) >= 0) return;
      C.grantPiece(s, idx, m);
    },
    grantPiece: function (s, idx, m) {
      var have = C.have(s.id), G = YN.game; have.push(idx);
      YN.audio.sfx('pickup', { note: have.length % 8 });
      if (G && G.player) YN.render.addFx({ type: 'spark', x: m ? m.x : G.player.x, y: m ? m.y : G.player.y, life: 0.8, color: s.color });
      var piece = s.pieces[idx], n = have.length, tot = s.pieces.length;
      var ls = [{ t: piece.text, who: '' }];
      var ms = s.milestones && s.milestones[n];
      if (YN.ui) YN.ui.dialog.queue(ls, {}, function () {
        if (G) G.toast(s.name + ' · ' + n + ' / ' + tot, 3);
        if (ms) YN.ui.dialog.queue((ms.lines || []).map(function (t) { return { t: t, who: '' }; }), {}, function () { if (ms.give && G) G.giveEffect(ms.give); if (ms.cookie && G) G.giveCookie(); });
      });
      if (YN.save.write) try { YN.save.write(); } catch (e) { /* sauvegarde plus tard */ }
    },
    /* une histoire récompense avec la prochaine pièce manquante d'une collection */
    grantNext: function (setId) {
      var s = C.set(setId); if (!s) return false;
      var have = C.have(setId);
      for (var i = 0; i < s.pieces.length; i++) if (have.indexOf(i) < 0) { C.grantPiece(s, i, null); return true; }
      return false;
    },
    /* l'étagère de la chambre de rêve */
    shelf: function (rt) {
      if (rt.findMark('col_shelf')) return;
      var at = YN.world.resolveAt(rt, 'random-any', 911); if (!at) return;
      YN.world.addMark(rt, { id: 'col_shelf', type: 'decor', look: 'shelf', at: 'random-any', solid: true, lines: [{ who: '', t: function () {
        var parts = (YN.data.collections || []).map(function (s) { var n = C.count(s.id); return n ? s.name.toLowerCase() + ': ' + n + ' of ' + s.pieces.length : null; }).filter(Boolean);
        return parts.length ? 'On the shelf: ' + parts.join(' · ') + '.' : 'An empty shelf. Dust in the shape of small things that aren’t there yet.';
      } }] }, at[0], at[1], null);
    }
  };

  /* deux pouvoirs liés aux collections */
  var A = YN.effects && YN.effects.actions;
  if (A) {
    A.seek = function (G) {
      var rt = G.rt, p = G.player, best = null, bd = 1e9;
      rt.marks.forEach(function (m) {
        if (!m.active) return;
        var want = m.def.collectSet || m.def.storyItem || (m.type === 'effect' && m.def.give && !YN.save.hasEffect(m.def.give)) || (/^find_/.test(m.def.id || '') && m.def.use);
        if (!want) return; var d = U.dist(m.x, m.y, p.x, p.y); if (d < bd) { bd = d; best = [m.x, m.y]; }
      });
      (rt.secretSpots || []).forEach(function (c) { if (c.seen) return; var d = U.dist(c.from[0], c.from[1], p.x, p.y); if (d < bd) { bd = d; best = c.from; } });
      YN.audio.sfx('page');
      if (!best) { G.toast('The pages stay still.'); return; }
      var dx = best[0] - p.x, dy = best[1] - p.y, dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      p.dir = dir; YN.render.addFx({ type: 'wisp', x: p.x, y: p.y, dir: dir, life: 1.8, color: '#f0e8c8' });
      G.toast(bd < 4 ? 'Very near.' : bd < 14 ? 'Not far.' : 'Far, that way.');
    };
    A.trace = function (G) { YN.audio.sfx('reveal'); YN.render.addFx({ type: 'fakes', x: G.player.x, y: G.player.y, life: 6, r: 10 }); };
  }
})(typeof window !== 'undefined' ? window : globalThis);
