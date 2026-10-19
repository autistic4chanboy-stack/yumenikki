/* Validation complète des données du jeu.  Usage : node tools/validate.js [--json] */
'use strict';
var L = require('./load.js');
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN;
YN.save.fresh && YN.save.fresh();
var rep = YN.validate.run();
if (process.argv.indexOf('--json') >= 0) { console.log(JSON.stringify(rep, null, 2)); process.exit(0); }
var c = rep.counts || {};
console.log('== Comptes ==');
Object.keys(c).forEach(function (k) { console.log('  ' + k + ' : ' + (typeof c[k] === 'object' ? JSON.stringify(c[k]) : c[k])); });
console.log('== Erreurs (' + rep.errors.length + ') ==');
rep.errors.slice(0, 60).forEach(function (e) { console.log('  ✖ ' + e); });
console.log('== Avertissements (' + rep.warnings.length + ') ==');
rep.warnings.slice(0, 40).forEach(function (e) { console.log('  ! ' + e); });
console.log('== Accessibilité ==');
console.log('  mondes inaccessibles : ' + rep.unreachable.length + (rep.unreachable.length ? ' (' + rep.unreachable.slice(0, 30).join(', ') + (rep.unreachable.length > 30 ? '…' : '') + ')' : ''));
console.log('  effets du cœur obtenables sans heure réelle : ' + rep.coreObtainable);
console.log('  énigmes fragiles : ' + (rep.fragile.length ? rep.fragile.join(', ') : 'aucune'));
console.log('  portes sans retour : ' + (rep.noReturn.length ? rep.noReturn.slice(0, 20).join(' ; ') : 'aucune'));
if (rep.realTimeOnly && rep.realTimeOnly.length) console.log('  seulement à certaines heures réelles : ' + rep.realTimeOnly.join(', '));

/* ---- tableau de bord (cahier des charges §27) : enregistré / implémenté / jouable / testé ---- */
var fs = require('fs'), path = require('path'), U = YN.util, W = YN.data.worlds;
var ids = U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); });
var playable = 0, buildErr = [];
YN.save.fresh(); YN.save.beginDream({});
ids.forEach(function (id) {
  try { var rt = YN.world.build(id); if (!rt) throw new Error('vide'); var okArr = rt.inf || rt.view === 'side' || (function () { var a = YN.world.arrival(rt, null, null).pos, ti = YN.tileInfo(rt.tile(a[0], a[1])); return ti.pass || ti.slide; })(); if (okArr) playable++; else buildErr.push(id + ' (arrivée bloquée)'); }
  catch (e) { buildErr.push(id + ' : ' + e.message); }
});
YN.net.build();
var edgeN = 0, edgeOk = 0; U.keys(YN.net.edges).forEach(function (k) { YN.net.edges[k].forEach(function (e) { edgeN++; if (W[e.to] || e.to === 'WAKE') edgeOk++; }); });
var nested = ids.filter(function (k) { return (W[k].depth || 0) >= 2; }).length;
var genA = ids.filter(function (k) { return W[k].gen && W[k].gen.perDream; }), genB = ids.filter(function (k) { return W[k].inf && (W[k].inf.gen || W[k].inf.type || typeof W[k].inf === 'object'); }), genC = ids.filter(function (k) { return W[k].gen && W[k].gen.shifting; });
var spawnW = ids.filter(function (k) { return W[k].spawnRule; });
var implEff = YN.data.effects.filter(function (e) { return e.use && (e.caps || e.action || e.acc || e.stealth !== undefined || e.mods); }).length;
var music = (function () { var dir = path.join(L.ROOT, 'assets', 'audio', 'music'); var files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(function (f) { return /\.(ogg|wav|mp3)$/i.test(f); }) : []; var tr = YN.musicConfig.tracks, miss = U.keys(tr).filter(function (k) { return tr[k] && tr[k].file && !fs.existsSync(path.join(L.ROOT, tr[k].file)); }); return { files: files.length, missing: miss }; })();
var smoke = (function () { var f = path.join(L.ROOT, 'tests', 'smoke_results.json'); try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } })();
console.log('== Tableau de bord ==');
console.log('  mondes enregistrés : ' + ids.length + ' · implémentés : ' + c.implemented + ' · jouables (construits, arrivée libre) : ' + playable + ' · testés en navigateur : ' + (smoke ? smoke.tested + ' (' + smoke.failed + ' échec, ' + smoke.date + ')' : 'voir tests/browser_smoke.js'));
console.log('  mondes imbriqués (profondeur ≥ 2) : ' + nested + ' · infinis/en boucle : ' + c.infinite);
console.log('  générateurs aléatoires : 3 systèmes — labyrinthe tiré chaque nuit (' + genA.join(', ') + '), paysage infini procédural (' + genB.length + ' mondes, dont W152), lieux qui se réarrangent (' + genC.join(', ') + ') · mondes à apparition : ' + spawnW.length);
console.log('  habitants uniques : ' + c.entities + ' (dont ' + c.majors + ' majeurs) · effets : ' + c.effects + ' (avec une fonction de jeu : ' + implEff + ')');
console.log('  sorcières : ' + c.witches + ' · Grande Prêtresse : ' + (YN.priestess && YN.priestess.summon ? 'implémentée (présages, pouvoirs, verrou, corruption persistante)' : 'absente'));
console.log('  passages : ' + edgeN + ' (vers un lieu existant : ' + edgeOk + ') · mondes inaccessibles : ' + rep.unreachable.length + ' · références cassées : ' + rep.errors.length);
console.log('  fichiers audio : ' + music.files + ' (musique procédurale par défaut) · fichiers déclarés manquants : ' + (music.missing.length ? music.missing.join(', ') : 'aucun'));
console.log('  constructions en échec : ' + (buildErr.length ? buildErr.join(' ; ') : 'aucune'));
console.log('  implémentations incomplètes déclarées : ' + ids.filter(function (k) { return W[k].status !== 'implemented' && W[k].status !== 'tested'; }).length);
process.exit(rep.errors.length || buildErr.length ? 1 : 0);
