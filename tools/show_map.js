/* Affiche la carte construite d'un monde (une nuit) avec ses marques, pour placer des choses à la main.
 * Usage : node tools/show_map.js W029 [--night 3] [--crop x0,y0,x1,y1]
 * Légende : cases telles quelles (# mur, . , : sols, ~ eau, ' ' vide…), marques en lettres a–z puis A–Z
 * (liste en dessous : lettre, id, type, position, look, condition), habitants « & », faux murs « ░ ». */
'use strict';
var L = require('./load.js');
var YN = L.load({ skip: /src\/main\.js$/ }).YN, U = YN.util;
var id = process.argv[2];
if (!id || !YN.data.worlds[id]) { console.log('usage : node tools/show_map.js W029'); process.exit(1); }
var ni = process.argv.indexOf('--night'), night = ni > 0 ? +process.argv[ni + 1] : 1;
YN.save.fresh(); YN.save.perm.stats.dreams = night - 1; YN.save.beginDream({}); // le numéro de la nuit suit perm.stats.dreams
var rt = YN.world.build(id);
if (rt.inf) { console.log(id + ' : monde infini (pas de carte fixe) ; placer avec at: [x,y] près de (16,16) ou random-any.'); process.exit(0); }
var ci = process.argv.indexOf('--crop'), crop = ci > 0 ? process.argv[ci + 1].split(',').map(Number) : [0, 0, rt.w - 1, rt.h - 1];
var LET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', at = {}, legend = [];
rt.marks.forEach(function (m, i) {
  var c = LET[i % LET.length]; at[m.y * rt.w + m.x] = c;
  legend.push(c + ' ' + (m.id || '-') + ' ' + m.type + ' (' + m.x + ',' + m.y + ')' + (m.look ? ' ' + m.look : '') + (m.active ? '' : ' [inactive]') + (m.solid ? ' solid' : '') + (m.def.cond ? ' cond:' + JSON.stringify(m.def.cond).slice(0, 60) : '') + (m.def.to ? ' → ' + m.def.to : ''));
});
var ents = {}; (rt.ents || []).forEach(function (e) { ents[Math.round(e.y) * rt.w + Math.round(e.x)] = 1; });
console.log(id + ' ' + rt.def.name + ' — ' + rt.w + '×' + rt.h + ' · view ' + rt.view + (rt.wrap ? ' · wrap' : ''));
var head = '     '; for (var x = crop[0]; x <= crop[2]; x++) head += (x % 10 === 0 ? String(x / 10 % 10) : ' ');
console.log(head);
head = '     '; for (x = crop[0]; x <= crop[2]; x++) head += String(x % 10); console.log(head);
for (var y = crop[1]; y <= crop[3]; y++) {
  var row = ('   ' + y).slice(-4) + ' ';
  for (x = crop[0]; x <= crop[2]; x++) {
    var k = y * rt.w + x;
    row += at[k] || (ents[k] ? '&' : (rt.fake && rt.fake[k] === 1 ? '░' : (rt.tile(x, y) || ' ')));
  }
  console.log(row);
}
console.log('\nMarques :'); legend.forEach(function (l) { console.log('  ' + l); });
console.log('Habitants : ' + (rt.ents || []).map(function (e) { return (e.id || e.def && e.def.id) + '(' + Math.round(e.x) + ',' + Math.round(e.y) + ')'; }).join(' '));
var T = YN.TILE || {}; var used = {}; rt.base.forEach(function (r) { for (var i = 0; i < r.length; i++) used[r[i]] = 1; });
console.log('Cases : ' + U.keys(used).map(function (c) { var t = YN.tileInfo(c); return JSON.stringify(c) + '=' + (t.name || '') + (t.pass ? '' : '(bloque)') + (t.wall ? '(mur)' : ''); }).join(' '));
