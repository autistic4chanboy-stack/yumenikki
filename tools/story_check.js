/* Vérifie les histoires (data/stories/*.js) : structure, langues, liens des dialogues à choix, unicité.
 * Usage : node tools/story_check.js [fichier…]   (sans argument : toutes les histoires chargées par le jeu) */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.join(__dirname, '..');
var files = process.argv.slice(2);
var stories = [], problems = [];
if (files.length) {
  var sandbox = { YN: { data: {} } }; sandbox.YN.addStory = function (s) { s._file = cur; stories.push(s); }; sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox); var cur = '';
  files.forEach(function (f) { cur = f; try { vm.runInContext(fs.readFileSync(path.resolve(ROOT, f), 'utf8'), sandbox, { filename: f }); } catch (e) { problems.push(f + ' : ne se charge pas — ' + e.message); } });
} else {
  var L = require('./load.js'); var YN = L.load({ skip: /src\/main\.js$/ }).YN; stories = YN.data.stories || [];
}
var THEMES = /^(home|school|institution|office|city|korea|north|nature|beach|water|snow|abstract)$/;
var LOOKS = /^(humanoid|adult|kid|old|ghost|shadow|tall|doll|robot|mannequin|cat|dog|rabbit|bird|owl|frog|snail|fish|moth|bee|blob|worm|deer|jelly)$/;
var ITEMS = /^(shoe|sock|letter|photo|keyring|book|ball|doll|crane|coin|pills|glass|stamp|drawing|toytrain|jar|shell|candle)$/;
var REWARDS = /^(coin|page|photo|secret|lore|cookie|none)$/;
var FR = /[éèêàçùâîôûœ]|\b(les|des|une|est|dans|elle|avec|toi|moi|rien|cette|mais|très|pourquoi|maman)\b/i;
var seenId = {}, seenLine = {};
function lines(arr, where, lang, s) {
  if (!Array.isArray(arr) || !arr.length) { problems.push(where + ' : liste de répliques vide ou absente'); return; }
  arr.forEach(function (l, i) {
    var w = where + '[' + i + ']';
    if (typeof l === 'string') { if (FR.test(l)) problems.push(w + ' : français ? « ' + l.slice(0, 60) + ' »'); check1(l, w); return; }
    if (!l || typeof l.t !== 'string') { problems.push(w + ' : réplique mal formée'); return; }
    if (!/^(en|ko-s|ko-n)$/.test(l.lang)) problems.push(w + ' : langue « ' + l.lang + ' »');
    if (/^ko/.test(l.lang) && (!l.tr || typeof l.tr !== 'string')) problems.push(w + ' : réplique coréenne sans traduction');
    if (/^ko/.test(l.lang) && !/[가-힣]/.test(l.t)) problems.push(w + ' : réplique « coréenne » sans hangeul');
    if (l.lang === 'en' && /[가-힣]/.test(l.t)) problems.push(w + ' : hangeul dans une réplique anglaise');
    check1(l.t, w); if (l.tr) check1(l.tr, w + '.tr');
  });
}
function check1(t, w) {
  if (t.length > 160) problems.push(w + ' : réplique trop longue (' + t.length + ')');
  if (/'/.test(t)) problems.push(w + " : apostrophe droite (utiliser ’)");
  var k = t.trim().toLowerCase(), owner = w.split(' ').slice(0, 2).join(' '); if (k.length > 18) { if (seenLine[k] && seenLine[k] !== owner) problems.push(w + ' : réplique déjà utilisée dans ' + seenLine[k]); else seenLine[k] = owner; }
}
stories.forEach(function (s, n) {
  var id = s && s.id || ('#' + n), W = (s._file ? path.basename(s._file) + ' ' : '') + id;
  if (!s || !s.id) { problems.push(W + ' : pas d’id'); return; }
  if (seenId[s.id]) problems.push(W + ' : id en double'); seenId[s.id] = 1;
  if (!/^(follow|fetch|choice|word)$/.test(s.kind)) problems.push(W + ' : kind « ' + s.kind + ' »');
  var wh = s.where || {}; if (!Array.isArray(wh.themes) || !wh.themes.length || wh.themes.some(function (t) { return !THEMES.test(t); })) problems.push(W + ' : where.themes');
  if (!Array.isArray(wh.depth) || wh.depth.length !== 2 || wh.depth[0] < 1 || wh.depth[1] > 4 || wh.depth[0] > wh.depth[1]) problems.push(W + ' : where.depth');
  var who = s.who || {}; if (!who.name || typeof who.name !== 'string') problems.push(W + ' : who.name');
  if (!who.look || !LOOKS.test(who.look.t || '')) problems.push(W + ' : who.look.t');
  if (!/^(en|ko-s|ko-n)$/.test(who.lang)) problems.push(W + ' : who.lang');
  lines(s.intro, W + ' intro'); lines(s.again, W + ' again');
  if (s.kind === 'follow') { var f = s.follow || {}; ['start', 'wait', 'arrive'].forEach(function (k) { lines(f[k], W + ' follow.' + k); }); if (!/^(secret|far|water|corner)$/.test(f.to)) problems.push(W + ' : follow.to'); }
  if (s.kind === 'fetch') { var fe = s.fetch || {}; if (!Array.isArray(fe.items) || fe.items.length < 1 || fe.items.length > 4) problems.push(W + ' : fetch.items (1–4)'); (fe.items || []).forEach(function (it, i) { if (!it.name || !ITEMS.test(it.look || '')) problems.push(W + ' : fetch.items[' + i + ']'); }); lines(fe.found, W + ' fetch.found'); lines(fe.done, W + ' fetch.done'); if ((fe.items || []).length > 1) lines(fe.partial, W + ' fetch.partial'); }
  if (s.kind === 'word') { var wd = s.word || {}; if (!Array.isArray(wd.words) || !wd.words.length || wd.words.some(function (x) { return typeof x !== 'string' || x !== x.toLowerCase() || /[.,!?;:]/.test(x); })) problems.push(W + ' : word.words'); lines(wd.hint, W + ' word.hint'); lines(wd.heard, W + ' word.heard'); }
  if (s.kind === 'choice') {
    var c = s.choice || {}, nodes = c.nodes || {}, ends = c.endings || {};
    if (!nodes[c.start]) problems.push(W + ' : choice.start inconnu');
    if (Object.keys(ends).length < 3) problems.push(W + ' : moins de 3 fins');
    var reach = {}, depth = 0;
    (function walk(idn, d) { if (reach[idn]) return; reach[idn] = 1; depth = Math.max(depth, d); var nd = nodes[idn]; if (!nd) return; (nd.choices || []).forEach(function (ch) { walk(ch.to, d + 1); }); })(c.start, 0);
    Object.keys(nodes).forEach(function (k) { var nd = nodes[k]; lines(nd.say, W + ' node ' + k); if (!Array.isArray(nd.choices) || nd.choices.length < 2 || nd.choices.length > 4) problems.push(W + ' : node ' + k + ' : 2–4 choix'); (nd.choices || []).forEach(function (ch, i) { if (!ch.label || /[éèàç]/.test(ch.label)) problems.push(W + ' : node ' + k + ' choix ' + i + ' : libellé'); if (!nodes[ch.to] && !ends[ch.to]) problems.push(W + ' : node ' + k + ' → « ' + ch.to + ' » inexistant'); if (ch.to === c.start) problems.push(W + ' : retour au début'); }); if (!reach[k]) problems.push(W + ' : node ' + k + ' injoignable'); });
    Object.keys(ends).forEach(function (k) { lines(ends[k].say, W + ' end ' + k); if (!REWARDS.test(ends[k].reward || 'none')) problems.push(W + ' : end ' + k + ' reward'); if (!reach[k]) problems.push(W + ' : fin ' + k + ' injoignable'); });
  } else if (!REWARDS.test(s.reward || 'none')) problems.push(W + ' : reward');
  if (s.lore) lines(s.lore, W + ' lore');
});
var kinds = {}; stories.forEach(function (s) { kinds[s.kind] = (kinds[s.kind] || 0) + 1; });
console.log('Histoires : ' + stories.length + ' ' + JSON.stringify(kinds) + ' · problèmes : ' + problems.length);
problems.slice(0, 80).forEach(function (p) { console.log('  ' + p); });
if (!problems.length) console.log('OK');
process.exitCode = problems.length ? 1 : 0;
