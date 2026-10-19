/* Audit de cohérence et de synchronisation des mondes.
 * Usage : node tools/coherence.js [--list]
 *  · portes : destination existante, marque d'arrivée existante, chemin de retour, pas de saut de couches
 *  · arrivée : en entrant par une porte, on apparaît à côté de la porte qui ramène d'où l'on vient
 *  · décors, habitants : apparences connues (sinon objets invisibles)
 *  · objets : ramassés une fois, ils ne reviennent pas en rentrant dans le monde la même nuit
 *  · musiques, ambiances, noms */
'use strict';
var L = require('./load.js');
var SB = L.load({ skip: /src\/main\.js$/ }), YN = SB.YN, U = YN.util, W = YN.data.worlds;
var list = process.argv.indexOf('--list') >= 0;
var issues = {}, n = 0;
function add(kind, msg) { (issues[kind] = issues[kind] || []).push(msg); n++; }
YN.save.fresh(); YN.save.beginDream({});
var ids = U.keys(W).sort(), built = {};
ids.forEach(function (id) { try { built[id] = YN.world.build(id); } catch (e) { add('construction', id + ' : ' + e.message); } });
var CRE = /^(humanoid|adult|kid|old|ghost|shadow|tall|doll|robot|mannequin|cat|dog|rabbit|bird|owl|frog|snail|fish|moth|bee|blob|worm|deer|jelly|whale|ant|witchsprite|girl|mother|priestess|statue|cardperson|bigeye|mouth|hand|tv|plant|tree|lamp|crow)$/;
var names = {};
ids.forEach(function (id) {
  var d = W[id], rt = built[id]; if (!rt) return;
  if (d.name) { if (names[d.name]) add('noms', 'nom en double : « ' + d.name + ' » (' + names[d.name] + ', ' + id + ')'); names[d.name] = id; }
  if (d.music && !YN.musicConfig.tracks[d.music] && !(YN.musicConfig.auto)) add('musique', id + ' : piste « ' + d.music + ' » inconnue');
  rt.marks.forEach(function (m) {
    if (m.look && !YN.decor.get(m.look, m.lookOpt || {}, 0)) add('décor', id + ' : apparence « ' + m.look + ' » inconnue (' + (m.def.id || m.type) + ') — objet invisible');
    if (YN.DOOR_TYPES[m.type] && m.def.to && m.def.to !== 'WAKE') {
      var to = W[m.def.to];
      if (!to) { add('portes', id + ' → ' + m.def.to + ' : destination inconnue'); return; }
      if (m.def.arrive && typeof m.def.arrive === 'string' && built[m.def.to] && !built[m.def.to].findMark(m.def.arrive) && !(built[m.def.to].markPos || []).some(function (p) { return p[0] === m.def.arrive; })) add('portes', id + ' → ' + m.def.to + ' : marque d’arrivée « ' + m.def.arrive + ' » introuvable');
      var dd = (to.depth || 0) - (d.depth || 0);
      if (dd > 2 && !m.def.secretDoor && !m.def.spawned && !m.def.cond) add('couches', id + ' (P' + (d.depth || 0) + ') → ' + m.def.to + ' (P' + (to.depth || 0) + ') : saute ' + (dd - 1) + ' couche(s)');
      if ((to.depth || 0) >= 5 && (d.depth || 0) < 5 && id !== 'W181' && id !== 'W182' && !/^(DEBUG|ASCII)/.test(id)) add('couches', id + ' → ' + m.def.to + ' : la sixième couche ne s’ouvre que par W181/W182');
    }
  });
  rt.ents.forEach(function (e) { var t = (e.def.look && e.def.look.t) || 'humanoid'; if (!CRE.test(t)) { try { if (!YN.spr.creature(e.def.look || {}, 0, {})) add('habitants', id + ' : ' + e.def.id + ' apparence « ' + t + ' »'); } catch (ex) { add('habitants', id + ' : ' + e.def.id + ' apparence « ' + t + ' » (' + ex.message + ')'); } } });
});
// chemins de retour : depuis chaque monde, peut-on revenir au monde précédent (directement ou par un détour court) ?
var out = {}, all = {}; ids.forEach(function (id) { var rt = built[id]; if (!rt) return; out[id] = {}; all[id] = {}; rt.marks.forEach(function (m) { if (!(YN.DOOR_TYPES[m.type] && m.def.to && W[m.def.to])) return; all[id][m.def.to] = 1; if (!m.def.spawned && !m.def.secretDoor) out[id][m.def.to] = 1; }); });
ids.forEach(function (a) { U.keys(out[a] || {}).forEach(function (b) {
  if (out[b] && out[b][a]) return;
  if (built[b] && built[b].marks.some(function (m) { return YN.DOOR_TYPES[m.type] && (m.def.id === 'back' || m.def.backDoor); }) && (W[a].depth || 0) > 0) return; // la porte du retour ramène d'où l'on vient
  // un détour de deux portes au plus
  var back = U.keys(all[b] || {}).some(function (c) { return c === a || (all[c] && (all[c][a] || U.keys(all[c]).some(function (d0) { return all[d0] && all[d0][a]; }))); });
  if (!back && !/^(WAKE|ROOM|BALCONY|NEXUS)$/.test(b)) add('retour', a + ' → ' + b + ' : aucun chemin de retour en trois portes');
}); });
// arrivée : en entrant dans B depuis A, on est à côté de la porte B→A
ids.forEach(function (a) { U.keys(out[a] || {}).forEach(function (b) {
  var rb = built[b]; if (!rb || rb.inf || rb.view !== 'top') return;
  var door = rb.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.to === a && m.active; })[0]; if (!door) return;
  if (!YN.tileInfo(rb.tile(door.x, door.y)).pass && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(function (d) { var ti = YN.tileInfo(rb.tile(door.x + d[0], door.y + d[1])); return ti.water || !ti.pass; })) return; // porte au milieu de l'eau : on revient sur la rive
  var pos = YN.world.arrival(rb, null, a).pos;
  if (Math.abs(pos[0] - door.x) + Math.abs(pos[1] - door.y) > 2) add('arrivée', a + ' → ' + b + ' : on apparaît en ' + pos + ', la porte du retour est en ' + door.x + ',' + door.y);
  if (!YN.world.standable(rb, pos[0], pos[1])) add('arrivée', a + ' → ' + b + ' : arrivée sur une case infranchissable ' + pos);
}); });
// objets : ramassés, ils ne reviennent pas en rentrant la même nuit
var G = YN.game, oq = YN.ui.dialog.queue, oe = YN.ui.effectGet, ot = G.toast, hr = YN.ui.hud.refresh;
YN.ui.dialog.queue = function (l, c, d) { if (d) d(); }; YN.ui.effectGet = function () {}; G.toast = function () {}; YN.ui.hud.refresh = function () {};
ids.forEach(function (id) {
  var rt = built[id]; if (!rt || rt.inf) return;
  var takeable = rt.marks.filter(function (m) { return m.active && (m.type === 'item' || m.type === 'cookie'); });
  if (!takeable.length) return;
  G.rt = rt; G.state = 'dream';
  takeable.forEach(function (m) { try { G.useMark(m); } catch (e) { /* rien */ } });
  var rt2 = YN.world.build(id);
  takeable.forEach(function (m) { var m2 = rt2.findMark(m.def.id || m.key); if (m2 && m2.active && !m.active) add('objets', id + ' : « ' + (m.def.id || m.type) + ' » réapparaît en rentrant dans le monde'); });
});
YN.ui.dialog.queue = oq; YN.ui.effectGet = oe; G.toast = ot; YN.ui.hud.refresh = hr;
console.log('Mondes : ' + ids.length + ' · problèmes : ' + n);
U.keys(issues).forEach(function (k) { console.log('  ' + k + ' : ' + issues[k].length); (list ? issues[k] : issues[k].slice(0, 6)).forEach(function (m) { console.log('     ' + m); }); });
process.exitCode = n ? 1 : 0;
