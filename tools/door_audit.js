/* Où tombent les portes : pour chaque monde à carte et plusieurs nuits, les portes mal placées.
 * Usage : node tools/door_audit.js [--nights N] [--list]
 * Critères (portes actives ou à venir, sauf cachées dans une cachette ou peintes sur un mur) :
 *   collée      : une autre porte à 2 cases ou moins
 *   arrivée     : à moins de 4 cases de l'endroit où l'on arrive (hors la porte du retour elle-même)
 *   sans accès  : les quatre cases autour sont bouchées — on ne peut pas s'y présenter
 *   objet devant: un objet solide occupe la case juste devant (en dessous)
 *   au milieu   : lieu fermé, et aucun mur autour (seule au milieu d'une pièce)
 *   à l'étroit  : plein air, au moins 5 des 8 cases autour sont bouchées (dans un buisson, contre l'eau)
 * Chaque problème est compté séparément pour les portes posées au hasard et pour celles placées à la main. */
'use strict';
var L = require('./load.js');
var YN = L.load({ skip: /src\/main\.js$/ }).YN, U = YN.util, W = YN.data.worlds, WD = YN.world;
var args = process.argv.slice(2), ni = args.indexOf('--nights'), NIGHTS = ni >= 0 ? +args[ni + 1] : 3, list = args.indexOf('--list') >= 0;
var GROUND = { hole: 1, fall: 1, path: 1 };
var tot = { doors: 0 }, ex = {};
function add(k, rnd, id) { var key = k + (rnd ? ' (au hasard)' : ' (à la main)'); tot[key] = (tot[key] || 0) + 1; (ex[key] = ex[key] || []).length < 12 && ex[key].push(id); }
YN.save.fresh();
for (var n = 1; n <= NIGHTS; n++) {
  YN.save.perm.stats.dreams = n - 1; YN.save.beginDream({});
  U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); }).sort().forEach(function (id) {
    var d = W[id]; if (d.inf || (d.style && (d.style.view === 'side' || d.style.view === 'fps'))) return;
    var rt = WD.build(id); if (rt.inf || rt.view !== 'top') return;
    var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0];
    var a = WD.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos, indoor = WD.indoor(rt);
    var doors = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && !GROUND[m.type] && !m.def.secretDoor && !m.def.painted && (m.active || m.def.spawned || m.def.cond); });
    var blocked = function (x, y) { if (rt.wrap) { x = U.mod(x, rt.w); y = U.mod(y, rt.h); } if (x < 0 || y < 0 || x >= rt.w || y >= rt.h) return true; if (!YN.tileInfo(rt.tile(x, y)).pass) return true; return rt.marksAt(x, y).some(function (m) { return m.solid && m.active; }); };
    var wallAt = function (x, y) { return x >= 0 && y >= 0 && x < rt.w && y < rt.h && !!YN.tileInfo(rt.tile(x, y)).wall; };
    doors.forEach(function (m) {
      tot.doors++;
      var rnd = (typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0) || !!m.def.spawned, tag = id + ':' + (m.def.id || m.key) + '@' + m.x + ',' + m.y + ' n' + n;
      if (doors.some(function (o) { return o !== m && Math.max(Math.abs(o.x - m.x), Math.abs(o.y - m.y)) <= 2; })) add('collée', rnd, tag);
      if (m !== back && Math.max(Math.abs(a[0] - m.x), Math.abs(a[1] - m.y)) < 4) add('arrivée', rnd, tag);
      if (blocked(m.x, m.y + 1) && blocked(m.x - 1, m.y) && blocked(m.x + 1, m.y) && blocked(m.x, m.y - 1)) add('sans accès', rnd, tag);
      else if (rt.marksAt(m.x, m.y + 1).some(function (o) { return o.solid && o.active && !YN.DOOR_TYPES[o.type]; })) add('objet devant', rnd, tag);
      var around = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && blocked(m.x + dx, m.y + dy)) around++;
      var walls = wallAt(m.x, m.y - 1) || wallAt(m.x - 1, m.y) || wallAt(m.x + 1, m.y);
      if (indoor && !walls && around === 0) add('au milieu', rnd, tag);
      if (!indoor && around >= 5) add('à l’étroit', rnd, tag);
    });
  });
}
console.log('Portes examinées : ' + tot.doors + ' (' + NIGHTS + ' nuits)');
U.keys(tot).filter(function (k) { return k !== 'doors'; }).sort().forEach(function (k) { console.log('  ' + k + ' : ' + tot[k] + (list ? '  — ' + ex[k].join('  ') : '')); });
