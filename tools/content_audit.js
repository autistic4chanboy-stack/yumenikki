/* Contenu par monde : énigmes, secrets (écrits dans les données), secrets du moteur (une nuit), placement.
 * Usage : node tools/content_audit.js [--list] [--csv]
 * Une « énigme » : une mécanique qui récompense (give, reward, flag, winLines), un effet donné sous condition, un
 * artefact à obtenir par une petite épreuve, une histoire d'habitant.
 * Un « secret » : porte ou objet sous condition, marque cachée, chose qui écoute un mot, case « ? » ou « x »,
 * chute, lien secret ; plus ceux que le moteur creuse (faux murs, chemins noirs, raccourcis, tableaux-portes). */
'use strict';
var L = require('./load.js');
var YN = L.load({ skip: /src\/main\.js$/ }).YN, U = YN.util, W = YN.data.worlds;
var list = process.argv.indexOf('--list') >= 0;
var AGAINST = { bookcase: 1, shelf: 1, sofa: 1, tv: 1, locker: 1, vending: 1, toybox: 1, desk: 1, piano: 1, bed: 1, fridge: 1, stove: 1, sink: 1, commode: 1, nightstand: 1, payphone: 1, newsstand: 1, mailbox: 1, onggi: 1 };
var AMBIENT = /^(wind|flickerLights|timedEvent|shifting|cycleLooks|skyline|effectGallery|nexusFloor|shrink|guide)$/;
YN.save.fresh(); YN.save.beginDream({});
var rows = [];
U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); }).sort().forEach(function (id) {
  var d = W[id], pz = [], sc = [];
  (d.mech || []).forEach(function (m) { if (!AMBIENT.test(m.type) && (m.give || m.reward || m.flag || m.winLines)) pz.push(m.type); });
  var marks = YN.net && YN.net.markDefs ? YN.net.markDefs(d) : [];
  (d.place || []).concat(U.keys(d.marks || {}).map(function (k) { return d.marks[k]; })).forEach(function (m) {
    if (!m) return;
    if (m.type === 'effect' && (m.need || m.cond)) pz.push('effect-cond');
    if (m.give && m.type !== 'effect' && m.use) pz.push('find');
    var door = YN.DOOR_TYPES[m.type];
    if (door && (m.cond || m.lock) && !m.spawned) sc.push('door-cond');
    if (!door && m.cond && m.type !== 'cookie' && m.type !== 'soul') sc.push('hidden-' + (m.type || 'mark'));
    if (m.hiddenUntilReveal) sc.push('reveal');
    if (m.listen) sc.push('listen');
    if (m.type === 'fall' || m.type === 'hole') sc.push('fall');
  });
  var rowsMap = (d.map || []).join('');
  if (/\?/.test(rowsMap)) sc.push('?-wall');
  if (/x/.test(rowsMap.replace(/[^x]/g, '')) && (d.map || []).some(function (r) { return /x/.test(r); }) && !/x/.test(JSON.stringify(d.marks || {}))) sc.push('invisible');
  if (d.fall) sc.push('fall');
  if (d.fakeWalls) sc.push('fake-wall');
  (d.links || []).forEach(function (l) { if (l.secret || l.cond) sc.push('link'); });
  (d.mech || []).forEach(function (m) { if (/^(password|sayTo|echo|knock|melodyLock)$/.test(m.type)) sc.push('word:' + m.type); });
  if ((d.npcs || []).length) (d.npcs || []).forEach(function (n) { var ed = YN.data.entities[n.id]; if (ed && (ed.hears || ed.onTalk)) sc.push('npc-listens'); });
  var art = YN.data.effects.filter(function (e) { return e.world === id && e.ground; }).length;
  if (art) pz.push('artefact');
  var rt = null, auto = 0, painted = 0, doorsMid = 0, furnMid = 0;
  try {
    rt = YN.world.build(id);
    auto = (rt.secretSpots || []).length; painted = rt.paintedDoor ? 1 : 0;
    var indoor = YN.world.indoor && YN.world.indoor(rt);
    if (!rt.inf && rt.view === 'top') rt.marks.forEach(function (m) {
      if (!m.active) return;
      var up = YN.tileInfo(rt.tile(m.x, m.y - 1)), around = 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && !YN.tileInfo(rt.tile(m.x + dx, m.y + dy)).pass) around++;
      if (indoor && YN.world.DOOR_WALL[m.type] && !up.wall && around === 0) doorsMid++;
      if (m.solid && m.type === 'decor' && around === 0 && AGAINST[m.look] && !up.wall && !(m.look === 'sofa' && m.def.furnished)) furnMid++;
    });
  } catch (e) { /* construit ailleurs */ }
  rows.push({ id: id, name: d.name, depth: d.depth || 0, core: !!d.core, puzzles: pz.length, secrets: sc.length, auto: auto + painted, pz: pz, sc: sc, doorsMid: doorsMid, furnMid: furnMid });
});
var noP = rows.filter(function (r) { return !r.puzzles; }), noS = rows.filter(function (r) { return !r.secrets; }), core = rows.filter(function (r) { return r.id <= 'W040'; });
console.log('Mondes : ' + rows.length + ' · sans énigme : ' + noP.length + ' · sans secret écrit : ' + noS.length + ' · sans aucun des deux : ' + rows.filter(function (r) { return !r.puzzles && !r.secrets; }).length);
console.log('40 premiers : secrets écrits en moyenne ' + (core.reduce(function (a, r) { return a + r.secrets; }, 0) / core.length).toFixed(1) + ' · moteur ' + (core.reduce(function (a, r) { return a + r.auto; }, 0) / core.length).toFixed(1));
console.log('Placement (lieux fermés) : portes loin de tout mur ' + rows.reduce(function (a, r) { return a + r.doorsMid; }, 0) + ' · meubles d’intérieur seuls au milieu ' + rows.reduce(function (a, r) { return a + r.furnMid; }, 0));
if (list) {
  console.log('\n-- sans énigme --'); console.log(noP.map(function (r) { return r.id; }).join(' '));
  console.log('\n-- sans secret écrit --'); console.log(noS.map(function (r) { return r.id; }).join(' '));
  console.log('\n-- 40 premiers --'); core.forEach(function (r) { console.log(r.id + ' ' + r.name + ' : énigmes ' + r.puzzles + ' [' + r.pz.join(',') + '] · secrets ' + r.secrets + ' [' + r.sc.join(',') + '] · moteur ' + r.auto); });
}
if (process.argv.indexOf('--csv') >= 0) require('fs').writeFileSync(process.argv[process.argv.indexOf('--csv') + 1] || 'content_audit.json', JSON.stringify(rows));
