/* Vérifie qu'aucun habitant ne parle français et que les âmes ont un vrai message.
 * Usage : node tools/lang_check.js [--list]
 * Parole = réplique d'un habitant (lines, hears, ambientLines, reacts, dialogues)
 * ou message d'une âme. La narration (sans guillemets) peut rester en français. */
'use strict';
var L = require('./load.js');
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN, U = YN.util;
var list = process.argv.indexOf('--list') >= 0;
var bad = [], speech = 0, foreign = 0, noTr = 0;
var FR_QUOTE = /[«»]/;
function isSpeechText(t) { return typeof t === 'string' && FR_QUOTE.test(t); }
function visit(line, where) {
  if (line == null) return;
  if (Array.isArray(line)) { line.forEach(function (l) { visit(l, where); }); return; }
  if (typeof line === 'function') return;
  if (typeof line === 'string') { if (isSpeechText(line)) { speech++; bad.push(where + ' : ' + line.slice(0, 90)); } return; }
  if (typeof line !== 'object') return;
  if (line.seq) { visit(line.seq, where); return; }
  if (typeof line.t === 'string') {
    if (line.lang && line.lang !== 'fr') { foreign++; if (!line.tr && /^ko/.test(line.lang)) noTr++; } // seules les répliques coréennes ont une traduction (anglaise)
    else if (isSpeechText(line.t)) { speech++; bad.push(where + ' : ' + line.t.slice(0, 90)); }
  }
}
function scanEntity(e, where) {
  visit(e.lines, where); visit(e.ambientLines, where);
  (e.hears || []).forEach(function (h) { visit(h.lines, where + ' (écoute)'); });
  U.keys(e.reacts || {}).forEach(function (k) { visit(e.reacts[k].lines, where + ' (réaction)'); });
  U.keys(e.worlds || {}).forEach(function (w) { if (e.worlds[w] && e.worlds[w].lines) visit(e.worlds[w].lines, where); });
}
U.keys(YN.data.entities).forEach(function (id) { var e = YN.data.entities[id]; scanEntity(e, id + ' ' + e.name); });
U.keys(YN.data.dialogues).forEach(function (id) { (YN.data.dialogues[id].branches || []).forEach(function (b, i) { visit(b.lines, 'dialogue ' + id + '#' + i); (b.choices || []).forEach(function (c) { visit(c.lines, 'dialogue ' + id + '#' + i + ' (choix)'); }); }); U.keys(YN.data.dialogues[id].nodes || {}).forEach(function (n) { visit(YN.data.dialogues[id].nodes[n].lines, 'dialogue ' + id + '.' + n); }); });
// âmes : tout panneau / inscription / âme doit parler (pas de « Un panneau » ni de texte par défaut)
var souls = 0, soulBad = [];
YN.save.fresh(); YN.save.beginDream({});
U.keys(YN.data.worlds).forEach(function (id) {
  var d = YN.data.worlds[id];
  (d.mech || []).forEach(function (mc, i) { ['winLines', 'failLines', 'lines', 'doneLine', 'firstLine', 'okLines', 'wrongLines'].forEach(function (k) { if (mc[k]) visit(mc[k], id + ' mécanique ' + mc.type + '.' + k); }); });
  YN.net.markDefs(d).forEach(function (m) {
    var t = m.type || 'decor', isSoul = !m.keepSign && (t === 'soul' || t === 'sign' || (t === 'inscription' && id !== 'EFFECTROOM') || (t === 'decor' && m.look === 'sign'));
    if (!isSoul) { (m.listen || []).forEach(function (l) { visit(l.lines, id + ' écoute ' + (m.id || '')); }); return; }
    souls++;
    var ls = m.lines || [];
    var txt = JSON.stringify(ls, function (k, v) { return typeof v === 'function' ? '' : v; });
    if (/Un panneau|Une pancarte|Des signes sont gravés|Une pierre gravée|Une plaque|^\["A sign|\bA signpost\b|\bAn engraved stone\b|\bA plaque\b|Signs are carved/.test(txt)) soulBad.push(id + ' ' + (m.id || t) + ' : ' + txt.slice(0, 90));
    visit(ls, id + ' âme ' + (m.id || ''));
  });
});
console.log('Paroles en langue étrangère : ' + foreign + ' (coréennes sans traduction : ' + noTr + ')');
console.log('Paroles encore en français : ' + speech);
console.log('Âmes (panneaux, inscriptions, âmes) : ' + souls + ' — messages encore rédigés comme des panneaux : ' + soulBad.length);
if (list) { bad.slice(0, 400).forEach(function (b) { console.log('  · ' + b); }); soulBad.slice(0, 200).forEach(function (b) { console.log('  ◦ ' + b); }); }
process.exit(speech || soulBad.length ? 1 : 0);
