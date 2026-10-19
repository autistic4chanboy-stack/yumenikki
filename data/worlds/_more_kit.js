/* =========================================================================
 *  ATELIER DES AJOUTS — ajoute des énigmes, secrets, objets et habitants à
 *  un monde déjà écrit, sans réécrire sa fiche (fichiers data/worlds/more_XX.js).
 *
 *  YN.kit.more('W029', {
 *    place: [...marques...],          // ajoutées à la fin de def.place
 *    mech:  [...mécaniques...],       // ajoutées à def.mech
 *    npcs:  [{ id, name, look, lines, behavior, at }],  // définies puis posées
 *    fakeWalls: [[x, y], [x, y, w, h]],                 // murs qu'elle seule traverse
 *    post: function (rows, rng, def) { return rows; },  // retouche la carte (dessinée ou générée)
 *    rules: ['…'],                    // lignes ajoutées à info.rules (wiki, mode spoiler)
 *    set: { champ: valeur }           // champs bruts de la fiche (moreSecrets, dark…)
 *  });
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function chain(prev, fn) { if (!prev) return fn; return function (rows, r, def) { rows = prev(rows, r, def) || rows; return fn(rows, r, def) || rows; }; }
  YN.kit.more = function (id, o) {
    var d = YN.data.worlds[id];
    if (!d) { YN.warn('more: unknown world ' + id); return null; }
    if (o.place) d.place = (d.place || []).concat(o.place);
    if (o.mech) d.mech = (d.mech || []).concat(o.mech);
    if (o.fakeWalls) d.fakeWalls = (d.fakeWalls || []).concat(o.fakeWalls);
    if (o.post) { if (d.map) d.mapPost = chain(d.mapPost, o.post); else if (d.gen) d.gen.post = chain(d.gen.post, o.post); }
    if (o.npcs) {
      d.npcs = d.npcs || [];
      o.npcs.forEach(function (n) {
        var ed = Object.assign({ world: id, kind: 'creature', behavior: 'wander', radius: 3, speed: 1.4 }, n);
        delete ed.at; delete ed.count;
        if (!YN.data.entities[n.id]) YN.defEntity(ed);
        for (var c = 0; c < (n.count || 1); c++) d.npcs.push({ id: n.id, at: n.at || 'random-any' });
      });
    }
    if (o.rules) { d.info = d.info || {}; d.info.rules = (d.info.rules || []).concat(o.rules); }
    if (o.set) Object.keys(o.set).forEach(function (k) { d[k] = o.set[k]; });
    return d;
  };
})(typeof window !== 'undefined' ? window : globalThis);
