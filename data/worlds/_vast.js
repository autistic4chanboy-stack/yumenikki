/* =========================================================================
 *  MONDES IMMENSES — dix lieux deviennent très grands et se redessinent à
 *  chaque visite (src/world/vast.js). Le reste du lieu (portes, habitants,
 *  âmes, effets, artefacts) se pose dessus comme d'habitude.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, W = YN.data.worlds;
  // monde : [agrandissement, colonnes, rangées de quartiers, épaisseur des bandes]
  var V = {
    W051: [2.4, 3, 3, 5], W136: [2.3, 3, 3, 6], W118: [2.3, 3, 3, 5], W042: [2.6, 3, 3, 6], W093: [2.4, 3, 3, 6],
    W100: [2.4, 3, 3, 6], W070: [2.2, 3, 3, 5], W090: [2.2, 3, 3, 5], W130: [2.2, 3, 2, 6], W162: [2.2, 3, 3, 5]
  };
  YN.data.vastWorlds = Object.keys(V);
  Object.keys(V).forEach(function (id) {
    var d = W[id]; if (!d || !d.gen || d.inf) return;
    var g = d.gen, v = V[id];
    d.gen = { type: 'vast', w: Math.min(240, Math.round((g.w || 60) * v[0])), h: Math.min(180, Math.round((g.h || 44) * v[0])),
      opts: { base: g.type, baseOpts: g.opts || g, cols: v[1], rows: v[2], band: v[3], wrap: !!d.wrap }, post: g.post, stamps: g.stamps, seed: g.seed };
    d.vast = true;
    d.info = d.info || {};
    d.info.rules = (d.info.rules || []).concat(['Immense, and drawn again on every visit: its districts, lakes, clearings and walls are never in the same place twice.']);
  });
})(typeof window !== 'undefined' ? window : globalThis);
