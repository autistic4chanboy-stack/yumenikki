/* Vérifie qu'il ne reste aucun texte français dans le jeu (interface, récit, habitants, wiki).
 * Le jeu est en anglais ; les habitants parlent anglais, coréen du Sud ou coréen du Nord.
 * Les commentaires du code ne sont pas lus (ils ne sont jamais affichés).
 * Usage : node tools/fr_check.js [--list] [chemin…]
 * Faux positifs connus : tools/fr_allow.json (chaînes exactes). */
'use strict';
var fs = require('fs'), path = require('path');
var ROOT = path.join(__dirname, '..');
var args = process.argv.slice(2), list = args.indexOf('--list') >= 0;
var only = args.filter(function (a) { return a[0] !== '-'; });
var BS = String.fromCharCode(92);
var ALLOW = {};
try { JSON.parse(fs.readFileSync(path.join(__dirname, 'fr_allow.json'), 'utf8')).forEach(function (s) { ALLOW[s] = 1; }); } catch (e) { /* pas de liste */ }

var ACC = /[éèêëàâçùûîïôœÉÈÊËÀÂÇÙÛÎÏÔŒ«»]/;
var LOAN = /\b(café|cafés|façade|façades|déjà|naïve|résumé|fiancée?|crème|pokémon|cliché|décor|décors|protégée?|rosé|soufflé|touché|piñata|señor|jalapeño|übermensch|über)\b/gi;
var STOP = /\b(le|la|les|des|une|est|pas|dans|elle|elles|qui|que|qu|pour|avec|tu|ton|tes|ta|toi|moi|rien|du|au|aux|cette|ces|il|ils|et|je|nous|vous|mais|sur|ce|ne|très|où|sont|ont|leur|lui|ses|sa|mon|ma|mes|un|plus|jamais|toujours|encore|ici|déjà|aussi|comme|tout|tous|fait|faire|être|avoir|peut|petit|petite|quand|parce|alors|depuis|chez|entre|sans|sous|vers)\b/gi;
/* langues inventées du jeu (la Vallée, le babil des sorcières) : ce n'est pas du français, on les retire avant de juger */
var INVENTED = {}, WITCHLINES = {};
(function () {
  var src = fs.readFileSync(path.join(ROOT, 'src', 'systems', 'languages.js'), 'utf8');
  src = src.replace(/\/\/[^\n]*/g, ''); // les commentaires contiennent des apostrophes droites
  var lex = src.match(/var LEX = \{[\s\S]*?\n  \};/), wit = src.match(/var WITCH = \{[\s\S]*?\n  \};/);
  if (lex) (lex[0].match(/'[^']*'/g) || []).forEach(function (q) { q.slice(1, -1).toLowerCase().split(/[\s,.…!?]+/).forEach(function (w) { if (w) INVENTED[w] = 1; }); });
  if (wit) (wit[0].match(/'[^']*'/g) || []).forEach(function (q) { var t = q.slice(1, -1); if (!/[A-Z]{3}/.test(t)) { WITCHLINES[t] = 1; t.toLowerCase().split(/[\s,.…!?]+/).forEach(function (w) { if (w) INVENTED[w] = 1; }); } });
})();
function dropInvented(t) { return t.replace(/[A-Za-zÀ-ÿ’'-]+/g, function (w) { var k = w.toLowerCase().replace(/^[’'-]+|[’'-]+$/g, ''); return INVENTED[k] ? ' ' : w; }); }
var WORDS = /^(reprendre|effets?|retour|titre|oui|non|plein|aller|voir|dire|garder|rêver|dormir|trouver|perdu|encore|continuer|nouvelle|partie|quitter|fermer|lire|jamais|toujours|couleur|musique|sons|touches|manette|courir|agir|haut|bas|gauche|droite|carte|parler|réglages|paramètres|vitesse|grand|petit|aucun|aucune|rien|tout|fini|finie|annuler|valider|suivant|précédent|ouvrir|utiliser|jeter|prendre|poser|éveillée|réveil|rêve|monde|mondes|âmes?|journal|crédits|commandes|langue|traduction|caméra|douce|directe|sauvegarde|charger|exporter|importer|effacer|recommencer|noir|blanc|nuit|jour)$/i;

function strings(src) { // [texte, ligne]
  var out = [], i = 0, n = src.length, line = 1;
  while (i < n) {
    var c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { var j0 = src.indexOf('*/', i + 2); var e0 = j0 < 0 ? n : j0 + 2; for (var q = i; q < e0; q++) if (src[q] === '\n') line++; i = e0; continue; }
    if (c === "'" || c === '"' || c === '`') {
      var j = i + 1, s = '', l0 = line;
      while (j < n && src[j] !== c) { if (src[j] === BS) { s += src[j + 1]; j += 2; continue; } if (src[j] === '\n') { if (c !== '`') break; line++; } s += src[j]; j++; }
      out.push([s, l0]); i = j + 1; continue;
    }
    i++;
  }
  return out;
}
function htmlText(src) { // texte visible d'une page : hors <script>/<style>, hors balises
  var out = [], lines = src.split('\n'), inScript = false;
  lines.forEach(function (l, k) {
    if (/<script|<style/i.test(l) && !/<\/script>|<\/style>/i.test(l)) { inScript = true; return; }
    if (inScript) { if (/<\/script>|<\/style>/i.test(l)) inScript = false; return; }
    var t = l.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim(); if (t) out.push([t, k + 1]);
    var m, re = /(?:title|placeholder|alt|aria-label|content)="([^"]+)"/g; while ((m = re.exec(l))) out.push([m[1], k + 1]);
  });
  return out;
}
function isFr(s, ui) {
  if (ALLOW[s] || WITCHLINES[s]) return false;
  var t = dropInvented(s.replace(LOAN, ' ').replace(/<[^>]*>/g, ' '));
  if (/^[a-z0-9_.:\/#?=&%-]+$/i.test(t) && !(ui && WORDS.test(t.trim()))) return false; // identifiant, clé, chemin
  if (ACC.test(t)) return true;
  if (ui && WORDS.test(t.trim())) return true;
  var m = t.match(STOP); if (!m) return false;
  var seen = {}; m.forEach(function (w) { seen[w.toLowerCase()] = 1; });
  return Object.keys(seen).length >= 2 && m.length >= 2 && /\s/.test(t);
}

var files = [];
function walk(d) { fs.readdirSync(d).forEach(function (f) { var p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(js|html)$/.test(f)) files.push(p); }); }
if (only.length) only.forEach(function (o) { var p = path.resolve(ROOT, o); if (fs.statSync(p).isDirectory()) walk(p); else files.push(p); });
else { walk(path.join(ROOT, 'src')); walk(path.join(ROOT, 'data')); files.push(path.join(ROOT, 'index.html'), path.join(ROOT, 'tools', 'wiki_template.html'), path.join(ROOT, 'tools', 'build_wiki.js')); }

var bad = [], scanned = 0;
files.forEach(function (f) {
  var rel = path.relative(ROOT, f).replace(/\\/g, '/'), src = fs.readFileSync(f, 'utf8');
  var ui = /^src\/(ui|systems|core)\//.test(rel) || /\.html$/.test(rel);
  var ss = /\.html$/.test(f) ? htmlText(src).concat(strings(src.replace(/^[\s\S]*?<script[^>]*>|<\/script>[\s\S]*?(<script[^>]*>|$)/gi, '\n'))) : strings(src);
  ss.forEach(function (q) { scanned++; if (isFr(q[0], ui)) bad.push(rel + ':' + q[1] + '  ' + q[0].slice(0, 110).replace(/\s+/g, ' ')); });
});
console.log('Chaînes lues : ' + scanned + ' · françaises : ' + bad.length);
if (list || bad.length <= 40) bad.slice(0, list ? 100000 : 40).forEach(function (b) { console.log('  ' + b); });
else { bad.slice(0, 40).forEach(function (b) { console.log('  ' + b); }); console.log('  … (' + (bad.length - 40) + ' de plus, --list pour tout voir)'); }
module.exports = { count: bad.length };
if (require.main === module) process.exitCode = bad.length ? 1 : 0;
