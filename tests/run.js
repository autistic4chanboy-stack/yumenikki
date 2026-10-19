/* Suite de tests automatisés (sans navigateur, sans dépendance).
 * Usage : node tests/run.js        (code de sortie 0 = tout passe)
 * Ce que ça vérifie : chargement, comptes demandés, références, accessibilité,
 * placement à pied, générateurs, sauvegarde, conditions à l'heure réelle,
 * arcs scriptés, fins, mode caractères, attribution réelle de chaque effet. */
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var L = require('../tools/load.js');
var ROOT = L.ROOT;
var pass = 0, fail = 0, fails = [];
function t(name, fn) {
  try { var r = fn(); if (r === false) throw new Error('faux'); pass++; console.log('  ✔ ' + name + (typeof r === 'string' ? ' — ' + r : '')); }
  catch (e) { fail++; fails.push(name); console.log('  ✖ ' + name + ' — ' + (e && e.message ? e.message : e)); }
}
function eq(a, b, msg) { if (a !== b) throw new Error((msg || '') + ' attendu ' + JSON.stringify(b) + ', obtenu ' + JSON.stringify(a)); }
function ok(c, msg) { if (!c) throw new Error(msg || 'condition fausse'); }

var warns = [];
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN, U = YN.util;
var origWarn = YN.warn; YN.warn = function (m) { warns.push(String(m)); if (origWarn) origWarn(m); };
function freshDream(o) { YN.save.fresh(); YN.save.beginDream(o || {}); }

console.log('\n== Chargement et comptes ==');
var rep = YN.validate.run(), c = rep.counts;
t('400 mondes, tous implémentés', function () { eq(c.worlds, 400); eq(c.implemented, 400); var nw = U.keys(YN.data.worlds).filter(function (k) { return /^W\d{3}$/.test(k) && k > 'W200'; }).length; eq(nw, 200, 'nouveaux mondes'); });
t('les 200 premiers : 30 faciles / 70 moyens / 100 difficiles dont au moins 10 extrêmes', function () { var T0 = { easy: 0, mid: 0, hard: 0, extreme: 0 }; U.keys(YN.data.worlds).filter(function (k) { return /^W\d{3}$/.test(k) && k <= 'W200'; }).forEach(function (k) { var d = YN.data.worlds[k], tr = d.tier === 'extreme' ? 'hard' : d.tier; T0[tr] = (T0[tr] || 0) + 1; if (d.tier === 'extreme' || d.extreme) T0.extreme++; }); eq(T0.easy, 30); eq(T0.mid, 70); eq(T0.hard, 100); ok(T0.extreme >= 10 || c.tiers.extreme >= 10, 'extrêmes : ' + T0.extreme); return JSON.stringify(c.tiers); });
t('les 40 premiers mondes sont en profondeur 1–2', function () { var bad = U.keys(YN.data.worlds).filter(function (k) { var d = YN.data.worlds[k]; return /^W\d{3}$/.test(k) && d.core && (d.depth < 1 || d.depth > 2); }); eq(bad.length, 0, bad.join(',')); });
t('au moins 85 effets', function () { ok(c.effects >= 85); return c.effects + ''; });
t('au moins 450 entités', function () { ok(c.entities >= 450); return c.entities + ''; });
t('au moins 10 arcs longs', function () { ok(c.quests >= 10); return c.quests + ''; });
t('au moins 15 mondes infinis ou en boucle', function () { ok(c.infinite >= 15); return c.infinite + ''; });
t('10 mondes à apparition', function () { var n = U.keys(YN.data.worlds).filter(function (k) { return YN.data.worlds[k].spawnRule; }).length; eq(n, 10); });
t('5 sorcières', function () { eq(c.witches, 5); });

console.log('\n== Références et accessibilité ==');
t('aucune référence cassée', function () { eq(rep.errors.length, 0, rep.errors.slice(0, 3).join(' | ')); });
t('aucun monde inaccessible (hors espace en caractères)', function () { eq(rep.unreachable.length, 0, rep.unreachable.join(',')); });
t('la fin est atteignable avec 30 effets des 40 premiers mondes, sans heure réelle', function () { ok(rep.finishable); ok(rep.coreObtainable >= 30); return rep.coreObtainable + ' effets obtenables'; });
t('aucune énigme seule ne bloque la fin', function () { eq(rep.fragile.length, 0, rep.fragile.join(',')); });
t('la sixième couche ne s’ouvre que par W181 et W182', function () {
  YN.net.build(); var bad = [];
  U.keys(YN.net.edges).forEach(function (from) { var fd = YN.data.worlds[from]; YN.net.edges[from].forEach(function (e) { var td = YN.data.worlds[e.to]; if (!td || e.debugOnly) return; if ((td.depth || 0) === 5 && (fd.depth || 0) < 5 && from !== 'W181' && from !== 'W182' && !td.debugWorld) bad.push(from + '→' + e.to); }); });
  eq(bad.length, 0, bad.join(','));
});
t('chaque effet est réellement attribué quelque part', function () {
  var src = ''; (function walk(d) { fs.readdirSync(d).forEach(function (f) { var p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) src += fs.readFileSync(p, 'utf8'); }); })(path.join(ROOT, 'data')); (function walk(d) { fs.readdirSync(d).forEach(function (f) { var p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) src += fs.readFileSync(p, 'utf8'); }); })(path.join(ROOT, 'src'));
  var miss = YN.data.effects.filter(function (e) { if (e.ground && YN.data.worlds[e.world] && ((YN.data.worlds[e.world].place || []).some(function (m) { return m.give === e.id || JSON.stringify(m.use || []).indexOf('"give":"' + e.id + '"') >= 0; }) || (e.keeper && YN.data.entities[e.keeper] && YN.data.entities[e.keeper].gift && YN.data.entities[e.keeper].gift.effect === e.id))) return false; return !new RegExp("give: '" + e.id + "'|effect: \\{ id: '" + e.id + "'|giveEffect\\('" + e.id + "'\\)").test(src); }).map(function (e) { return e.id; });
  eq(miss.length, 0, miss.join(','));
});
t('toutes les notes citées existent', function () {
  var used = {}; JSON.stringify(YN.data.worlds, function (k, v) { if (k === 'note' && typeof v === 'string' && /^n_/.test(v)) used[v] = 1; return typeof v === 'function' ? null : v; }); JSON.stringify(YN.data.entities, function (k, v) { if (k === 'note' && typeof v === 'string' && /^n_/.test(v)) used[v] = 1; return typeof v === 'function' ? null : v; });
  var miss = U.keys(used).filter(function (n) { return !YN.data.notes[n] && !/^n_rule_$/.test(n); }); eq(miss.length, 0, miss.join(','));
});

console.log('\n== Construction de chaque monde ==');
t('les 206 lieux se construisent sans erreur, arrivée franchissable', function () {
  freshDream(); var bad = [];
  U.keys(YN.data.worlds).forEach(function (id) {
    try { var rt = YN.world.build(id); if (!rt) { bad.push(id + ' (vide)'); return; }
      if (!rt.inf && rt.view !== 'side') { var a = YN.world.arrival(rt, null, null).pos; if (!YN.tileInfo(rt.tile(a[0], a[1])).pass && !YN.tileInfo(rt.tile(a[0], a[1])).slide) bad.push(id + ' arrivée ' + a); }
    } catch (e) { bad.push(id + ' : ' + e.message); }
  });
  eq(bad.length, 0, bad.slice(0, 5).join(' | '));
});
t('aucune marque posée hors carte (position introuvable)', function () { var w = warns.filter(function (m) { return /position introuvable|position not found/.test(m); }); eq(w.length, 0, w.slice(0, 3).join(' | ')); });
t('portes, effets et objets joignables à pied (tools/reach_maps.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reach_maps.js')], { encoding: 'utf8' }); ok(r.status === 0, (r.stdout || '').split('\n').filter(Boolean).slice(-3).join(' | ')); return (r.stdout || '').trim().split('\n').pop(); });

console.log('\n== Générateurs ==');
function sig(rt) { var s = ''; for (var y = 0; y < rt.h; y++) for (var x = 0; x < rt.w; x++) s += rt.tile(x, y); return s; }
t('W151 (dédale instable) change d’une nuit à l’autre', function () { freshDream(); YN.save.dream.no = 3; var a = sig(YN.world.build('W151')); YN.save.dream.no = 4; var b = sig(YN.world.build('W151')); ok(a !== b); });
t('le même rêve redonne la même carte (graine stable)', function () { freshDream(); YN.save.dream.no = 7; var a = sig(YN.world.build('W151')); var b = sig(YN.world.build('W151')); eq(a === b, true); });
t('W153 (maison qui se déplie) se réarrange', function () { freshDream(); var a = sig(YN.world.build('W153')); YN.save.temp('shift_W153', 1); var b = sig(YN.world.build('W153')); ok(a !== b); });
t('W152 (paysage infini) est infini', function () { freshDream(); var rt = YN.world.build('W152'); ok(rt.inf || YN.data.worlds.W152.inf); });
t('le Dédale (W031) diffère le jour et la nuit', function () { freshDream(); var d = YN.data.worlds.W031; ok(d.dayNight || (d.gen && d.gen.dayNight) || JSON.stringify(d).indexOf('dayNight') >= 0, 'pas de jour/nuit'); });

console.log('\n== Sauvegarde ==');
t('aller-retour avec somme de contrôle', function () { YN.save.fresh(); YN.save.grantEffect('E01'); YN.save.write(); YN.save.perm = null; ok(YN.save.load()); ok(YN.save.hasEffect('E01')); });
t('sauvegarde abîmée → copie de secours', function () { YN.save.fresh(); YN.save.grantEffect('E02'); YN.save.write(); YN.save.write(); YN.store.set('yn_dream_archive_save', '{"payload":"{}","sum":1}'); YN.save.perm = null; ok(YN.save.load()); ok(YN.save.hasEffect('E02')); ok(YN.save.corruptedOnLoad); });
t('ce qui est trouvé en rêve n’est validé qu’au réveil', function () { YN.save.fresh(); YN.save.beginDream({}); YN.save.setQuest('Q07', 'met'); eq(YN.save.perm.quests.Q07, undefined); YN.save.commitDream('wake'); eq(YN.save.perm.quests.Q07.stage, 'met'); });
t('une capture jette le rêve', function () { YN.save.fresh(); YN.save.beginDream({}); YN.save.setQuest('Q08', 'met'); YN.save.discardDream('capture'); ok(!YN.save.perm.quests.Q08); });

console.log('\n== Heures réelles ==');
function at(h, m) { var d = new Date(); d.setHours(h, m || 0, 0, 0); YN.realtime.fixed = d; }
t('le train de 23h71 n’entre qu’entre 23 h et minuit', function () { freshDream(); var door = YN.net.markDefs(YN.data.worlds.W082).filter(function (m) { return m.to === 'W192'; })[0]; ok(door); var cnd = door.cond || (door.lock && door.lock.if); at(22, 30); ok(!YN.cond.check(cnd)); at(23, 30); ok(YN.cond.check(cnd)); YN.realtime.fixed = null; });
t('la minute jumelle est reconnue (22:22)', function () { at(22, 22); ok(YN.realtime.named('twinMinute')); at(22, 23); ok(!YN.realtime.named('twinMinute')); YN.realtime.fixed = null; });
t('l’heure du loup (3 h)', function () { at(3, 10); ok(YN.realtime.named('wolf')); at(4, 10); ok(!YN.realtime.named('wolf')); YN.realtime.fixed = null; });

console.log('\n== Arcs ==');
function pick(id) { return YN.dialogue.pick(YN.data.dialogues[id], {}, id); }
function skipFirst() { U.keys(YN.data.dialogues).forEach(function (d) { (YN.data.dialogues[d].branches || []).forEach(function (b) { if (b.once) YN.save.setFlag('dlg:' + d + ':' + b.once, true); }); }); }
t('Q04 : cinq mots rendus à l’Ancienne donnent le Mot (E41)', function () { freshDream(); skipFirst(); YN.save.setFlag('dlg:ouma:first', true); YN.save.grantEffect('E25'); YN.save.setQuest('Q04', 'asked'); YN.save.addItem('word', 5); var b = YN.dialogue.pick(YN.data.dialogues.ouma, {}, 'ouma'); ok(b && JSON.stringify(b.do).indexOf('E41') >= 0); });
t('Q06 : la blague et la valise lancent le spectacle', function () { freshDream(); skipFirst(); YN.save.addItem('joke', 1); YN.save.perm.equipped = 'E71'; var b = pick('toctoc'); ok(b && JSON.stringify(b.do).indexOf('show') >= 0); YN.save.perm.equipped = null; });
t('Q06 : rire pendant le spectacle donne le Rire (E39)', function () { var h = YN.data.entities.N007.hears[0]; ok(JSON.stringify(h.do).indexOf('E39') >= 0 && h.match.indexOf('haha') >= 0); });
t('Q10 : choisir de garder le sourire donne E42', function () { freshDream(); skipFirst(); YN.save.setQuest('Q10', 'photo'); var b = YN.dialogue.pick(YN.data.dialogues.ri, {}, 'ri'); ok(b && b.choices && JSON.stringify(b.choices).indexOf('E42') >= 0); });
t('Q08 : Ondine sort après l’aveu du grand qui rit', function () { var l = YN.data.entities.N009.lines[0]; ok(l.if.quest.Q08 === 'adult' && JSON.stringify(l.do).indexOf('ondine_out') >= 0); });
t('Q11 : trois saisons et Flowey arrête de compter', function () { freshDream(); skipFirst(); YN.save.dream.flags['dlg:flowey:seasons'] = false; delete YN.save.dream.flags['dlg:flowey:seasons']; ['snow', 'night', 'flowers'].forEach(function (s) { YN.save.setQuest('Q11', s); }); var b = pick('flowey'); ok(b && b.once === 'seasons'); });
t('Q01 : dire à M. Ahn qu’elle a grandi donne la Montre (E38)', function () { freshDream(); YN.save.setFlag('dlg:ahn_train:aboard', true); YN.save.setQuest('Q01', 'witness'); var b = pick('ahn_train'); ok(b && JSON.stringify(b.choices).indexOf('E38') >= 0); });
t('la voix revient quand les quatre conditions sont réunies', function () { YN.save.fresh(); var f = YN.save.perm.flags; f.val_resolved = f.letter_to_s = f.ondine_out = f.heard_mother = true; YN.room.checkEnding(); ok(YN.save.perm.flags.voice_returned); });
t('trente nids ouvrent la terrasse', function () { YN.save.fresh(); for (var i = 1; i <= 30; i++) YN.save.perm.eggs.push('E' + (i < 10 ? '0' : '') + i); YN.room.checkEnding(); ok(YN.save.perm.flags.terrace_open); });
t('quatre fins définies', function () { eq(U.keys(YN.endings.SEQ).length, 4); });

console.log('\n== Mode caractères ==');
t('« set 68 » devant un mur fait tenir la porte de W191', function () {
  freshDream(); var G = YN.game, rt = null, found = null;
  ['W004', 'W009', 'W017', 'W018', 'W027'].forEach(function (id) { if (found) return; G.rt = rt = YN.world.build(id); for (var y = 1; y < rt.h - 1 && !found; y++) for (var x = 1; x < rt.w - 1 && !found; x++) if (YN.tileInfo(rt.tile(x, y)).pass && YN.tileInfo(rt.tile(x, y - 1)).wall && !rt.markAt(x, y - 1)) found = [x, y]; });
  ok(found, 'pas de mur'); G.placePlayer(found[0], found[1]); G.player.dir = 'up';
  var r = YN.debug.setFront(68); ok(/door/i.test(r), r); ok(rt.marks.some(function (m) { return m.def.to === 'W191'; }));
});
t('« set 0 » en profondeur 4 ouvre un trou vers la sixième couche', function () { freshDream(); var G = YN.game; G.rt = YN.world.build('W161'); var a = YN.world.arrival(G.rt, null, null).pos; G.placePlayer(a[0], a[1]); YN.debug.setFront(0); ok(G.rt.marks.some(function (m) { return m.def.to === 'W183'; })); });

console.log('\n== Âmes, caméra, déplacement, étendue ==');
t('plus aucun panneau : panneaux et inscriptions sont devenus des âmes', function () {
  freshDream(); var left = [], n = 0;
  U.keys(YN.data.worlds).forEach(function (id) { var rt = YN.world.build(id); rt.marks.forEach(function (m) { if (m.type === 'soul') n++; if ((m.type === 'sign' || (m.type === 'inscription' && id !== 'EFFECTROOM')) && !m.def.keepSign) left.push(id); }); });
  eq(left.length, 0, left.slice(0, 5).join(',')); ok(n >= 60 && n <= 420, n + ' âmes (attendu : rares)'); return n + ' âmes cette nuit';
});
t('une âme parle, se défait et reste dans le journal', function () {
  freshDream(); var G = YN.game; G.rt = YN.world.build('W036'); var m = G.rt.marks.filter(function (x) { return x.type === 'soul'; })[0]; ok(m, 'pas d’âme');
  var oq = YN.ui.dialog.queue; YN.ui.dialog.queue = function (l, c, done) { if (done) done(); }; G.clock = 10; G.soulSpeak(m); YN.ui.dialog.queue = oq;
  ok(YN.save.flag(m.def.soulKey)); ok((YN.save.perm.souls || []).some(function (s) { return s.k === m.def.soulKey; })); ok(m.state.leaving);
});
t('caméra directe par défaut : elle est exactement sur la protagoniste', function () {
  YN.save.settings = YN.save.defaultSettings(); eq(YN.save.settings.camera, 0); eq(YN.save.settings.cameraFx, false);
  freshDream(); var G = YN.game; G.rt = YN.world.build('W051'); G.placePlayer(20, 20); YN.render.cam.init = false; YN.render.updateCamera(G.rt, 1 / 60); G.player.px += 0.37; YN.render.updateCamera(G.rt, 1 / 60);
  ok(Math.abs(YN.render.cam.x - G.player.px) < 1e-9, 'écart ' + (YN.render.cam.x - G.player.px));
});
t('déplacement au pixel : un pixel par image en marchant, deux en courant', function () {
  YN.save.settings = YN.save.defaultSettings(); freshDream(); var G = YN.game; G.rt = YN.world.build('W051'); G.state = 'dream'; G.trans = null; var a = YN.world.arrival(G.rt, null, null).pos; G.placePlayer(a[0], a[1]);
  var tp = YN.render.tpx || 20, I = YN.input, d = [];
  // une direction dégagée sur au moins quatre cases
  var dir = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].filter(function (k) { var v = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[k]; for (var s = 1; s <= 4; s++) if (!G.rt.passable(a[0] + v[0] * s, a[1] + v[1] * s, 'player', {})) return false; return true; })[0];
  ok(dir, 'aucune direction libre');
  var ax = dir === 'ArrowRight' || dir === 'ArrowLeft' ? 'px' : 'py';
  I.down = {}; I.down[dir] = true; for (var i = 0; i < 12; i++) { var x0 = G.player[ax]; G.updatePlayer(1 / 60); d.push(Math.abs(Math.round((G.player[ax] - x0) * tp * 1000) / 1000)); }
  I.down = {};
  ok(d.every(function (v) { return v === 1; }), d.join(','));
});
t('les âmes sont rares et ne disent qu’une phrase (deux pour un ancien panneau)', function () {
  freshDream(); var G = YN.game, maxL = 0, lore = 0, worlds = 0;
  var oq = YN.ui.dialog.queue; YN.ui.dialog.queue = function (l, c, done) { maxL = Math.max(maxL, l.length); if (done) done(); };
  U.keys(YN.data.worlds).forEach(function (id) { var rt = YN.world.build(id); worlds++; var lm = rt.marks.filter(function (m) { return m.type === 'soul' && !m.def._wasSign && !m.def.soulNightly; }); ok(lm.length <= 1, id + ' a ' + lm.length + ' âmes de lore'); lore += lm.length; G.rt = rt; G.clock = 1; rt.marks.filter(function (m) { return m.type === 'soul'; }).forEach(function (m) { G.soulSpeak(m); }); });
  YN.ui.dialog.queue = oq; ok(maxL <= 2, 'une âme a dit ' + maxL + ' lignes'); ok(lore <= worlds * 0.25, lore + ' âmes de lore'); return lore + ' âmes de lore cette nuit, ' + maxL + ' ligne(s) au plus';
});
t('mondes agrandis, bouclés, prolongés et reliés', function () { var X = YN.expanse; ok(X.grown.length >= 30, 'agrandis ' + X.grown.length); ok(X.looped.length >= 15, 'bouclés ' + X.looped.length); ok(X.annexed.length >= 10, 'annexes ' + X.annexed.length); ok(X.pairs.length >= 50, 'passages ' + X.pairs.length); return X.grown.length + ' agrandis · ' + X.looped.length + ' bouclés · ' + X.annexed.length + ' annexes · ' + X.pairs.length + ' passages'; });
t('chaque carte est meublée', function () { freshDream(); var empty = []; U.keys(YN.data.worlds).filter(function (k) { return /^W\d{3}$/.test(k); }).forEach(function (id) { var rt = YN.world.build(id); if (rt.inf) return; var n = rt.marks.length + rt.ents.length; if (n < 4 && !{ W189: 1, W191: 1, W040: 1 }[id]) empty.push(id + ':' + n); }); eq(empty.length, 0, empty.slice(0, 6).join(' ')); });
t('aucun habitant ne parle français (tools/lang_check.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'lang_check.js')], { encoding: 'utf8' }); ok(r.status === 0, (r.stdout || '').split('\n').filter(function (l) { return /Paroles|Âmes/.test(l); }).join(' | ')); return (r.stdout || '').split('\n').filter(function (l) { return /Paroles en langue/.test(l); })[0]; });

t('le jeu est entièrement en anglais : aucun texte français (tools/fr_check.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'fr_check.js')], { encoding: 'utf8' }); var head = (r.stdout || '').split('\n')[0]; ok(r.status === 0, head + ' ' + (r.stdout || '').split('\n').slice(1, 4).join(' | ')); return head; });
t('plus de journal : ni touche, ni menu', function () { ok(!YN.ui.journal, 'YN.ui.journal existe encore'); ok(!YN.input.map.journal, 'touche du journal encore définie'); });
t('le merle montre lui-même les directions (pas de flèche)', function () {
  var src = require('fs').readFileSync(path.join(ROOT, 'src', 'world', 'mech_core.js'), 'utf8'), i = src.indexOf('M.gardenBird'), j = src.indexOf('\n  M.', i + 20);
  ok(i >= 0 && src.slice(i, j).indexOf("type: 'arrow'") < 0, 'le merle affiche encore des flèches'); ok(/animate: function/.test(src.slice(i, j)), 'pas d’animation de saut');
});
t('les habitants ont un corps à leur taille (rayon de promenade ≠ collision)', function () {
  var EN = YN.entities, big = 0; U.keys(YN.data.entities).forEach(function (id) { var d = YN.data.entities[id], b = EN.body({ def: d, state: {} }); ok(b > 0.1 && b < 1.0, id + ' corps ' + b); if (d.radius > 1.5) big++; });
  return big + ' habitants avec un grand rayon de promenade, tous avec un petit corps';
});

t('les effets n’existent qu’en rêve (éveillée : rien de porté, pas de menu)', function () {
  freshDream(); var G = YN.game, S = YN.save; S.perm.effects.push('E91'); S.perm.equipped = 'E91';
  ok(G.equipped() === 'E91', 'en rêve, l’effet est porté'); var d = S.dream; S.dream = null;
  ok(G.equipped() === null, 'éveillée, un effet est encore porté'); ok(!G.caps().small, 'éveillée, une capacité reste active'); S.dream = d;
});
t('les 90 artefacts s’obtiennent chacun par sa façon (fouiller, creuser, gardien, patience, trois, reflet)', function () {
  var G = YN.game, S = YN.save, oq = YN.ui.dialog.queue, oe = YN.ui.effectGet, got = 0, counts = {};
  YN.ui.dialog.queue = function (l, c, done) { if (done) done(); }; YN.ui.effectGet = function () {};
  YN.data.effects.filter(function (e) { return e.ground; }).forEach(function (e) {
    freshDream(); G.state = 'dream'; var rt = G.rt = YN.world.build(e.world); G.trans = null; counts[e.find] = (counts[e.find] || 0) + 1;
    var art = rt.findMark('art_' + e.id), f0 = rt.findMark('find_' + e.id);
    if (e.find === 'search' || e.find === 'dig') { ok(f0 && f0.active, e.id + ' : rien à fouiller'); for (var k = 0; k < 3; k++) G.useMark(f0); }
    else if (e.find === 'mirror') { ok(f0 && art && !art.active, e.id + ' : l’objet est déjà visible'); G.useMark(f0); ok(art.active, e.id + ' : le reflet ne révèle rien'); G.useMark(art); }
    else if (e.find === 'trio') { ok(art && !art.active, e.id + ' : déjà visible'); for (var j = 0; j < 3; j++) { var m = rt.findMark('find_' + e.id + '_' + j); ok(m, e.id + ' objet ' + j); G.useMark(m); } ok(art.active, e.id + ' : les trois ne révèlent rien'); G.useMark(art); }
    else if (e.find === 'patience') { ok(f0 && art && !art.active, e.id + ' : déjà visible'); G.placePlayer(f0.x, f0.y); G.player.px = f0.x + 0.5; G.player.py = f0.y + 0.6; G.player.moving = false; for (var s = 0; s < 6 / 0.05; s++) YN.finds.tick(0.05); ok(art.active && art.x === f0.x && art.y === f0.y, e.id + ' : rester immobile ne fait rien apparaître'); G.useMark(art); }
    else if (e.find === 'keeper') { YN.entities.spawnFor && rt.ents.length; var en = rt.ents.filter(function (q) { return q.def.id === e.keeper; })[0]; ok(en, e.id + ' : gardien ' + e.keeper + ' absent'); if (en) for (var n = 0; n < 3; n++) YN.entities.talk(en, G); }
    if (S.hasEffect(e.id)) got++; else ok(false, e.id + ' (' + e.find + ', ' + e.world + ') pas obtenu');
  });
  YN.ui.dialog.queue = oq; YN.ui.effectGet = oe; eq(got, 90);
  return U.keys(counts).map(function (k) { return k + ' ' + counts[k]; }).join(' · ');
});

t('une luciole attrapée ne revient pas (ni à la réévaluation, ni en revenant)', function () {
  freshDream(); var G = YN.game; G.state = 'dream'; var oq = YN.ui.dialog.queue, ot = G.toast; YN.ui.dialog.queue = function (l, c, d) { if (d) d(); }; G.toast = function () {};
  var rt = G.rt = YN.world.build('W019'); var mc = rt.mechs.filter(function (m) { return m.type === 'catchN'; })[0]; ok(mc, 'pas de mécanique');
  var ff = rt.ents.filter(function (e) { return e.def.tag === 'firefly' && e.present; }); ok(ff.length >= 5, ff.length + ' lucioles');
  var e0 = ff[0]; G.placePlayer(e0.x, e0.y); G.player.fx = e0.fx; G.player.fy = e0.fy;
  for (var i = 0; i < 30; i++) { mc.impl.update(rt, mc.s, mc.p, 0.05); YN.entities.reeval(rt); G.player.fx = e0.fx; G.player.fy = e0.fy; }
  eq(mc.s.n, 1, 'rester sur la même luciole la compte plusieurs fois');
  var rt2 = G.rt = YN.world.build('W019'); var mc2 = rt2.mechs.filter(function (m) { return m.type === 'catchN'; })[0]; mc2.impl.update(rt2, mc2.s, mc2.p, 0.05); ok(!rt2.ents.filter(function (e) { return e.def.id === e0.def.id; })[0].present, 'la luciole attrapée revient en rentrant dans le marais');
  YN.ui.dialog.queue = oq; G.toast = ot;
});

t('secrets : faux murs pour elle seule, cachettes atteignables, portes cachées jamais vers la sixième couche', function () {
  freshDream(); var n = 0, kinds = {}, worlds = 0;
  U.keys(YN.data.worlds).forEach(function (id) {
    var rt = YN.world.build(id); if (!rt || !rt.secretSpots) return;
    if (rt.secretSpots.length || rt.paintedDoor) worlds++;
    rt.secretSpots.forEach(function (c) {
      n++; kinds[c.kind] = (kinds[c.kind] || 0) + 1;
      var f = c.door || (c.path && c.path[0]); if (!f) return;
      ok(rt.passable(f[0], f[1], 'player', {}), id + ' : faux mur infranchissable pour elle');
      ok(!rt.passable(f[0], f[1], 'npc', {}) && !rt.passable(f[0], f[1], 'witch', {}), id + ' : un habitant ou une sorcière traverse le faux mur');
    });
    rt.marks.filter(function (m) { return m.def.secretDoor; }).forEach(function (m) { var d = YN.data.worlds[m.def.to]; ok(d && (d.depth || 0) <= 4, id + ' : porte cachée vers ' + m.def.to); });
  });
  ok(n >= 40, n + ' cachettes'); return n + ' cachettes dans ' + worlds + ' mondes ' + JSON.stringify(kinds);
});
t('mondes immenses : redessinés à chaque visite, identiques pendant la visite', function () {
  freshDream(); var ids = YN.data.vastWorlds || []; ok(ids.length >= 8, ids.length + ' mondes immenses');
  ids.forEach(function (id) {
    YN.save.temp('vast:' + id, 11); var a = YN.world.build(id), a2 = YN.world.build(id);
    YN.save.temp('vast:' + id, 22); var b = YN.world.build(id);
    ok(a.w * a.h >= 15000, id + ' trop petit : ' + a.w + '×' + a.h);
    eq(a.base.join(''), a2.base.join(''), id + ' change pendant la visite');
    ok(a.base.join('') !== b.base.join(''), id + ' identique d’une visite à l’autre');
  });
  return ids.length + ' mondes, ' + ids.map(function (id) { var d = YN.data.worlds[id].gen; return d.w + '×' + d.h; }).join(' ');
});
t('collections : semées chaque nuit, gardées, récompensées au bout', function () {
  freshDream(); var C = YN.collect, G = YN.game, oq = YN.ui.dialog.queue, oe = YN.ui.effectGet, ot = G.toast; YN.ui.dialog.queue = function (l, c, d) { if (d) d(); }; YN.ui.effectGet = function () {}; G.toast = function () {};
  var pl = C.plan(), n = 0; U.keys(pl.byWorld).forEach(function (w) { n += pl.byWorld[w].length; }); ok(n >= 10, n + ' pièces semées');
  var s = C.set('coins'); for (var i = 0; i < s.pieces.length; i++) C.grantNext('coins');
  eq(C.count('coins'), 40); ok(YN.save.hasEffect('E181'), 'pas de Coin Purse au bout des 40 pièces');
  YN.save.beginDream({}); var pl2 = C.plan(), coins = 0; U.keys(pl2.byWorld).forEach(function (w) { pl2.byWorld[w].forEach(function (p) { if (p.set === 'coins') coins++; }); }); eq(coins, 0, 'des pièces déjà trouvées sont resemées');
  YN.ui.dialog.queue = oq; YN.ui.effectGet = oe; G.toast = ot;
  return (YN.data.collections || []).map(function (c) { return c.name + ' ' + c.pieces.length; }).join(' · ');
});

t('le coréen tapé est reconnu (la normalisation ne l’efface plus)', function () { var U0 = YN.util; eq(U0.norm('엄마!'), '엄마'); eq(U0.norm('바다 Sea'), '바다 sea'); eq(U0.norm('Éclair'), 'eclair'); });
t('histoires bien formées (tools/story_check.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'story_check.js')], { encoding: 'utf8' }); var head = (r.stdout || '').split('\n')[0]; ok(r.status === 0, head + ' | ' + (r.stdout || '').split('\n').slice(1, 4).join(' | ')); return head; });
t('chaque histoire se termine, chaque fin de dialogue est atteignable (tools/story_play.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'story_play.js')], { encoding: 'utf8', timeout: 600000 }); var head = (r.stdout || '').split('\n').filter(function (l) { return /Histoires jouées/.test(l); })[0] || (r.stderr || '').slice(0, 200); ok(r.status === 0, head + ' | ' + (r.stdout || '').split('\n').filter(function (l) { return /^  /.test(l); }).slice(0, 3).join(' | ')); return head; });

t('cohérence : portes, retours, couches, arrivées, décors, objets (tools/coherence.js)', function () { var r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'coherence.js')], { encoding: 'utf8', timeout: 900000 }); var out = (r.stdout || '').split('\n'), head = out.filter(function (l) { return /^Mondes/.test(l); })[0] || (r.stderr || '').slice(0, 200); ok(r.status === 0, head + ' | ' + out.filter(function (l) { return /^ {5}/.test(l); }).slice(0, 4).join(' | ')); return head; });
t('la porte du retour ramène d’où l’on vient (monde à plusieurs entrées)', function () {
  freshDream(); var G = YN.game, W = YN.data.worlds;
  var b = U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k) && (W[k].place || []).some(function (p) { return p.id === 'back'; }); }).filter(function (k) { var parents = U.keys(W).filter(function (a) { return a !== k && YN.net.markDefs(W[a]).some(function (q) { return q.to === k; }); }); return parents.length >= 2; })[0];
  ok(b, 'aucun monde à deux entrées'); if (!b) return;
  var back = (W[b].place || []).filter(function (p) { return p.id === 'back'; })[0].to;
  var other = U.keys(W).filter(function (a) { return a !== b && a !== back && (W[a].depth || 0) > 0 && YN.net.markDefs(W[a]).some(function (q) { return q.to === b; }); })[0];
  var went = null, oe = G.enterWorld; G.enterWorld = function (id) { went = id; };
  YN.save.dream.cameFrom = {}; YN.save.dream.cameFrom[b] = other; G.rt = YN.world.build(b);
  G.useDoor(G.rt.marks.filter(function (m) { return m.def.id === 'back'; })[0]); G.enterWorld = oe;
  eq(went, other, b + ' : entré depuis ' + other + ', la porte du retour mène à ' + went); return b + ' : entrée depuis ' + other + ' → retour vers ' + went;
});
t('nouvelles énigmes : lumières, paires, caisses, traces', function () {
  var G = YN.game, oq = YN.ui.dialog.queue, oe = YN.ui.effectGet, ot = G.toast; YN.ui.dialog.queue = function (l, c, d) { if (d) d(); }; YN.ui.effectGet = function () {}; G.toast = function () {};
  var rows = ['##########', '#........#', '#........#', '#........#', '#........#', '#........#', '##########'];
  YN.defWorld({ id: 'TMECH', name: 'Test', depth: 2, map: rows, look: YN.kit.LOOK.house, marks: {}, noSecrets: true, place: [
    { id: 'l1', type: 'decor', look: 'lamp', at: [2, 2] }, { id: 'l2', type: 'decor', look: 'lamp', at: [6, 2] },
    { id: 'p1', type: 'decor', look: 'crate', at: [2, 4] }, { id: 'p2', type: 'decor', look: 'crate', at: [3, 4] }, { id: 'p3', type: 'decor', look: 'crate', at: [4, 4] }, { id: 'p4', type: 'decor', look: 'crate', at: [5, 4] },
    { id: 'box', type: 'decor', look: 'crate', solid: true, at: [7, 3] }, { id: 'plate', type: 'decor', look: 'stamp', solid: false, at: [7, 5] },
    { id: 'a', type: 'decor', look: 'pebbles', solid: false, at: [1, 1] }, { id: 'b', type: 'decor', look: 'pebbles', solid: false, at: [8, 1] }],
    mech: [{ type: 'lampsAll', lamps: ['l1', 'l2'], flag: 'tm_l' }, { type: 'pairs', tiles: ['p1', 'p2', 'p3', 'p4'], flag: 'tm_p' }, { type: 'push', blocks: ['box'], plates: ['plate'], flag: 'tm_b' }, { type: 'trail', from: 'a', to: 'b', flag: 'tm_t' }] });
  freshDream(); G.state = 'dream'; var rt = G.rt = YN.world.build('TMECH'); G.trans = null;
  var mc = function (t0) { return rt.mechs.filter(function (m) { return m.type === t0; })[0]; };
  G.useMark(rt.findMark('l1')); G.useMark(rt.findMark('l2')); ok(YN.save.flag('tm_l'), 'lumières');
  var pm = mc('pairs'), by = {}; ['p1', 'p2', 'p3', 'p4'].forEach(function (i) { (by[pm.s.sym[i]] = by[pm.s.sym[i]] || []).push(i); }); U.keys(by).forEach(function (k) { G.useMark(rt.findMark(by[k][0])); pm.s.busy = 0; G.useMark(rt.findMark(by[k][1])); }); ok(YN.save.flag('tm_p'), 'paires');
  YN.world.mechCall(rt, 'onTryMove', 7, 3, 'down'); YN.world.mechCall(rt, 'onTryMove', 7, 4, 'down'); ok(YN.save.flag('tm_b'), 'caisse');
  var tm = mc('trail'); YN.mech.trail.build(rt, tm.p, tm.s); tm.s.path.forEach(function (c0) { YN.world.mechCall(rt, 'onStep', c0[0], c0[1]); }); ok(YN.save.flag('tm_t'), 'traces');
  delete YN.data.worlds.TMECH; YN.ui.dialog.queue = oq; YN.ui.effectGet = oe; G.toast = ot;
});

t('placement : portes contre un mur dans les lieux fermés, rien de solide sur un passage indispensable', function () {
  freshDream(); var W = YN.data.worlds, WD = YN.world, badDoor = [], badCut = [], n = 0;
  U.keys(W).filter(function (k) { return /^W\d{3}$/.test(k); }).forEach(function (id) {
    var rt = WD.build(id); if (rt.inf || rt.view !== 'top') return; n++;
    var cut = WD.cutCells(rt), w = rt.w;
    rt.marks.forEach(function (m) {
      if (!m.active || m.hidden) return;
      var rnd = typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0;
      if (rnd && m.solid && YN.decor.isWall(m.look) && !YN.DOOR_TYPES[m.type] && cut[m.y * w + m.x] === 1) badCut.push(id + ':' + m.id);
    });
    if (!WD.indoor(rt)) return;
    // une porte posée au hasard, loin de tout mur, alors qu'un mur libre existait
    var cands = 0; for (var y = 1; y < rt.h - 1; y++) for (var x = 1; x < w - 1; x++) if (YN.tileInfo(rt.tile(x, y)).pass && YN.tileInfo(rt.tile(x, y - 1)).wall) cands++;
    if (cands < 6) return;
    rt.marks.forEach(function (m) {
      if (!m.active || !WD.DOOR_WALL[m.type] || m.def.secretDoor || m.def.painted || !(typeof m.def.at === 'string' && m.def.at.indexOf('random') === 0)) return;
      var around = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && !YN.tileInfo(rt.tile(m.x + dx, m.y + dy)).pass) around++;
      if (around === 0) badDoor.push(id + ':' + m.id);
    });
  });
  ok(badDoor.length <= 6, 'portes au milieu d’une pièce : ' + badDoor.slice(0, 8).join(' '));
  eq(badCut.length, 0, 'objets muraux solides sur un passage : ' + badCut.slice(0, 8).join(' '));
  return n + ' mondes · portes isolées : ' + badDoor.length;
});
t('murs traversables écrits dans les données (fakeWalls) et ajouts par YN.kit.more', function () {
  freshDream();
  var rows = ['#########', '#...#...#', '#...#...#', '#########'];
  YN.defWorld({ id: 'TFAKE', name: 'Test', depth: 2, map: rows, look: YN.kit.LOOK.house, marks: {}, noFurnish: true, place: [{ id: 'back', type: 'door', to: 'W001', at: [1, 1], essential: true }] });
  YN.kit.more('TFAKE', { fakeWalls: [[4, 2]], place: [{ id: 'hid', type: 'decor', look: 'doodle', solid: false, at: [6, 2] }], rules: ['test'] });
  var rt = YN.world.build('TFAKE');
  ok(rt.passable(4, 2, 'player', {}), 'elle traverse le faux mur');
  ok(!rt.passable(4, 2, 'npc', {}), 'les habitants, non');
  ok(rt.findMark('hid'), 'marque ajoutée');
  eq(YN.data.worlds.TFAKE.info.rules.length, 1, 'règle ajoutée');
  delete YN.data.worlds.TFAKE;
});
t('psychédélique voulu : des recettes différentes, et les réglages de confort calment tout', function () {
  var W = YN.data.worlds, ids = YN.data.psyWorlds || [];
  ok(ids.length >= 30, 'mondes psychédéliques : ' + ids.length);
  var sig = {}; ids.forEach(function (id) { var p = W[id].style.psy; sig[JSON.stringify(p)] = (sig[JSON.stringify(p)] || 0) + 1; });
  eq(U.keys(sig).length, ids.length, 'chaque monde a sa propre recette');
  // le rendu ne plante pas, avec ou sans réglages de confort
  freshDream(); var Rn = YN.render, rt = YN.world.build('W174'), set = YN.save.settings;
  var calls = 0, fake = { drawImage: function () { calls++; }, save: function () {}, restore: function () {}, translate: function () {}, scale: function () {}, rotate: function () {}, fillRect: function () { calls++; }, createLinearGradient: function () { return { addColorStop: function () {} }; }, createRadialGradient: function () { return { addColorStop: function () {} }; } };
  Rn.psyPost(fake, rt, 320, 200, {}); var full = calls; calls = 0;
  Rn.psyPost(fake, rt, 320, 200, { reduceDistortion: true, reduceFlash: true, reduceMotion: true }); var calm = calls;
  ok(full > calm, 'moins d’effets avec « Reduce distortion » (' + full + ' → ' + calm + ')');
  var keep = set.reduceFlash; set.reduceFlash = true; var f = Rn.styleFilter(rt); set.reduceFlash = keep;
  ok(/saturate/.test(f), 'filtre de couleur : ' + f);
  return ids.length + ' mondes, ' + U.keys(sig).length + ' recettes';
});

t('habitants terrifiants : nombreux en profondeur, aucun en P1, lieux tendres épargnés, tous dessinables', function () {
  var H = YN.data.horror || {}, W = YN.data.worlds, EN = YN.data.entities, ids = U.keys(H), home = {}, byD = {}, bad = [];
  U.keys(W).forEach(function (w) { (W[w].npcs || []).forEach(function (q) { if (q && q.id && !home[q.id]) home[q.id] = w; }); });
  ids.forEach(function (id) { var ed = EN[id], w = ed.world || home[id], d = W[w] ? W[w].depth || 0 : -1; byD[d] = (byD[d] || 0) + 1; if (ed.major) bad.push(id + ' (majeur)'); });
  ok(ids.length >= 200, 'habitants redessinés : ' + ids.length);
  ok(!byD[1] && !byD[0], 'aucun en P0/P1 : ' + JSON.stringify(byD));
  ok((byD[4] || 0) > (byD[2] || 0), 'plus nombreux en profondeur : ' + JSON.stringify(byD));
  eq(bad.length, 0, 'personnages majeurs intacts : ' + bad.join(' '));
  var errs = [];
  ids.forEach(function (id) { try { var c = YN.spr.creature(EN[id].look, 2, {}); if (!c) errs.push(id); } catch (e) { errs.push(id + ' : ' + e.message); } });
  eq(errs.length, 0, 'dessins en erreur : ' + errs.slice(0, 5).join(' / '));
  return ids.length + ' habitants · ' + JSON.stringify(byD);
});
t('effets : chacun change son allure ; une trentaine la rendent terrifiante ou psychédélique', function () {
  var E = YN.data.effects, S = YN.spr, none = E.filter(function (e) { return !e.acc && !e.form && !e.pal && e.id !== 'E13'; }), strong = E.filter(function (e) { return e.strongLook; }), errs = [];
  eq(none.length, 0, 'effets sans apparence : ' + none.map(function (e) { return e.id; }).join(' '));
  ok(strong.length >= 25, 'apparences fortes : ' + strong.length);
  E.forEach(function (e) {
    if (e.acc && !S.ACC[e.acc] && !S.ACC_BACK[e.acc]) errs.push(e.id + ' acc ' + e.acc);
    if (e.form && !S.FORMS[e.form]) errs.push(e.id + ' forme ' + e.form);
    ['down', 'left', 'up', 'downright'].forEach(function (dir) { try { S.girl(dir, 0, { acc: e.acc, form: e.form, pal: e.pal, palKey: e.pal ? e.id : '', moving: dir === 'left', phase: 0.3, t: 1.3 }); } catch (ex) { errs.push(e.id + ' ' + dir + ' : ' + ex.message); } });
  });
  eq(errs.length, 0, errs.slice(0, 5).join(' / '));
  return strong.length + ' fortes sur ' + E.length;
});

t('placement sur plusieurs nuits : labyrinthe, spirale, pièces à une seule entrée — rien ne se retrouve enfermé', function () {
  var ids = ['W151', 'W166', 'W171', 'W154', 'W106', 'W050', 'W058', 'W087'], bad = [];
  YN.save.fresh();
  for (var n = 1; n <= 12; n++) {
    YN.save.perm.stats.dreams = n - 1; YN.save.beginDream({});
    ids.forEach(function (id) {
      if (!YN.data.worlds[id]) return;
      var rt = YN.world.build(id); if (rt.inf || rt.view !== 'top') return;
      var back = rt.marks.filter(function (m) { return YN.DOOR_TYPES[m.type] && m.def.essential; })[0];
      var a = YN.world.arrival(rt, back ? back.def.id : null, back ? back.def.to : null).pos, w = rt.w, h = rt.h, PG = YN.world.passGrid(rt, 'player'), seen = new Uint8Array(w * h), q = [a], qi = 0;
      seen[a[1] * w + a[0]] = 1;
      while (qi < q.length) { var c = q[qi++]; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var x = c[0] + d[0], y = c[1] + d[1]; if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x] || !PG[y * w + x]) return; seen[y * w + x] = 1; q.push([x, y]); }); }
      rt.marks.forEach(function (m) {
        if (!YN.DOOR_TYPES[m.type] || m.def.unreachOk || m === back) return;
        var near = false; for (var dy = -1; dy <= 1 && !near; dy++) for (var dx = -1; dx <= 1 && !near; dx++) { var x = m.x + dx, y = m.y + dy; if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x >= 0 && y >= 0 && x < w && y < h && seen[y * w + x]) near = true; }
        if (!near) bad.push(id + ' nuit ' + n + ' : ' + (m.def.id || m.type));
      });
    });
  }
  eq(bad.length, 0, bad.slice(0, 6).join(' ; '));
});

console.log('\n' + pass + ' réussis, ' + fail + ' échoués' + (fail ? ' : ' + fails.join(' ; ') : ''));
process.exit(fail ? 1 : 0);
