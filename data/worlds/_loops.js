/* =========================================================================
 *  COULOIRS SANS FIN — deux couloirs déclarés en boucle étaient fermés par un
 *  mur à chaque bout : on ne pouvait jamais en faire le tour. Les deux bouts
 *  s'ouvrent (rangée par rangée, seulement là où le couloir touche le bord).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, W = YN.data.worlds;
  function openEnds(rows) {
    var w = rows[0].length;
    return rows.map(function (row) {
      var a = YN.tileInfo(row[0]), b = YN.tileInfo(row[1]), c = YN.tileInfo(row[w - 2]), d = YN.tileInfo(row[w - 1]);
      if (a.wall && d.wall && b.pass && c.pass && !YN.isMarkChar(row[1]) && !YN.isMarkChar(row[w - 2])) return row[1] + row.slice(1, w - 1) + row[w - 2];
      return row;
    });
  }
  ['W043', 'W154'].forEach(function (id) {
    var d = W[id]; if (!d || !d.map || !d.wrap) return;
    var prev = d.mapPost;
    d.mapPost = function (rows, r, def) { rows = prev ? prev(rows, r, def) || rows : rows; return openEnds(rows); };
  });
})(typeof window !== 'undefined' ? window : globalThis);
