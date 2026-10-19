/* Vérifie, monde par monde, que les portes, effets et marques essentielles
 * sont atteignables à pied depuis l'arrivée (parcours en largeur sur les cases
 * franchissables, effets « nage » et « vol » ignorés). Usage : node tools/reach_maps.js [W001 …] [--nights N]
 * --nights N : refait le contrôle pour les nuits 1 à N (cachettes, portes peintes et objets changent chaque nuit). */
'use strict';
var L = require('./load.js');
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN;
YN.save.fresh();
var args = process.argv.slice(2), ni = args.indexOf('--nights'), NIGHTS = ni >= 0 ? +args[ni + 1] : 1;
if (ni >= 0) args.splice(ni, 2);
var only = args;
var W = YN.data.worlds, bad = 0, checked = 0, seenBad = {};
for (var night = 1; night <= NIGHTS; night++) {
YN.save.perm.stats.dreams = night - 1; YN.save.beginDream({});
Object.keys(W).sort().forEach(function (id) {
  if (only.length && only.indexOf(id) < 0) return;
  var def = W[id];
  if (def.inf || (def.style && (def.style.view === 'side' || def.style.view === 'fps'))) return;
  var rt; try { rt = YN.world.build(id); } catch (e) { console.log(id + ' : construction impossible — ' + e.message); bad++; return; }
  if (!rt || rt.inf) return;
  checked++;
  // point de départ : la porte de retour, sinon l'arrivée par défaut
  var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0];
  var start = YN.world.arrival(rt, back ? back.def.id || back.key : null, back ? back.def.to : null).pos;
  var seen = {}, q = [start], w = rt.w, h = rt.h;
  seen[start[0] + ',' + start[1]] = 1;
  var pass = function (x, y) { var info = YN.tileInfo(rt.tile(x, y)); if (!info.pass && !info.slide && !(YN.secrets && YN.secrets.isFake(rt, x, y))) return false; var ms = rt.marksAt(x, y); for (var i = 0; i < ms.length; i++) if (ms[i].solid) return false; return true; };
  while (q.length) {
    var c = q.shift();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
      var nx = c[0] + d[0], ny = c[1] + d[1];
      if (rt.wrap) { nx = (nx + w) % w; ny = (ny + h) % h; } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      var k = nx + ',' + ny; if (seen[k]) return;
      if (!pass(nx, ny)) return;
      seen[k] = 1; q.push([nx, ny]);
    });
  }
  // l'arrivée enfermée dans un recoin (des objets bouchent la sortie) : bien moins que ce que la carte nue permettrait
  var bare = {}, bq = [start], nb = 0; bare[start[0] + ',' + start[1]] = 1;
  while (bq.length && nb < 100000) { var bc = bq.pop(); nb++; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = bc[0] + d[0], ny = bc[1] + d[1]; if (rt.wrap) { nx = (nx + w) % w; ny = (ny + h) % h; } else if (nx < 0 || ny < 0 || nx >= w || ny >= h) return; var k = nx + ',' + ny; if (bare[k]) return; var inf = YN.tileInfo(rt.tile(nx, ny)); if (!inf.pass && !inf.slide && !(YN.secrets && YN.secrets.isFake(rt, nx, ny))) return; bare[k] = 1; bq.push([nx, ny]); }); }
  var nseen = Object.keys(seen).length;
  if (nseen < 40 && nseen < nb * 0.5) { if (!seenBad[id]) bad++; seenBad[id] = 1; console.log(id + ' (' + def.name + ')' + (NIGHTS > 1 ? ' nuit ' + night : '') + ' : arrivée enfermée — ' + nseen + ' cases sur ' + nb); }
  var touch = function (m) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var x = m.x + dx, y = m.y + dy; if (rt.wrap) { x = (x + w) % w; y = (y + h) % h; } if (seen[x + ',' + y]) return true; } return false; };
  var missing = rt.marks.filter(function (m) {
    var important = YN.DOOR_TYPES[m.type] || m.type === 'effect' || m.def.essential || m.def.give || (m.type === 'item') || (m.type === 'trigger') || m.def.collectSet || m.def.storyItem;
    return important && !m.def.unreachOk && !touch(m);
  });
  if (missing.length) { if (!seenBad[id]) bad++; seenBad[id] = 1; console.log(id + ' (' + def.name + ')' + (NIGHTS > 1 ? ' nuit ' + night : '') + ' : injoignable — ' + missing.map(function (m) { return (m.def.id || m.key) + '@' + m.x + ',' + m.y + (m.def.to ? '→' + m.def.to : ''); }).join(' ; ')); }
});
}
console.log(checked + (NIGHTS > 1 ? ' constructions vérifiées (' + NIGHTS + ' nuits), ' : ' mondes vérifiés, ') + bad + ' avec des marques injoignables.');
process.exit(bad ? 1 : 0);
