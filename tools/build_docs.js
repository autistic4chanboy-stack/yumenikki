/* Régénère PROGRESSION.md à partir des données du jeu (effets, mondes, arcs).
 * Usage : node tools/build_docs.js */
'use strict';
var fs = require('fs'), path = require('path');
var L = require('./load.js');
var S = L.load({ skip: /src\/main\.js$/ });
var YN = S.YN, U = YN.util, W = YN.data.worlds;
YN.save.fresh(); YN.save.beginDream({});
YN.net.build();

function wn(id) { return W[id] ? W[id].name + ' (' + id + ')' : id; }
// chemin le plus court depuis le Nexus (sans condition d'heure réelle)
function route(target) {
  var prev = { NEXUS: null }, q = ['NEXUS'];
  while (q.length) { var c = q.shift(); if (c === target) break; (YN.net.edges[c] || []).forEach(function (e) { if (!W[e.to] || e.to in prev || e.debugOnly || e.spawn) return; if (/realHour|realTime|realDate/.test(JSON.stringify(e.cond || {}, function (k, v) { return typeof v === 'function' ? 0 : v; }))) return; prev[e.to] = c; q.push(e.to); }); }
  if (!(target in prev)) return null;
  var p = [target], k = target; while (prev[k]) { k = prev[k]; p.unshift(k); } return p;
}
var core = YN.data.effects.filter(function (e) { return e.core; });
var out = [];
out.push('# Progression — comment finir THE DREAM ARCHIVE');
out.push('');
out.push('> **Spoilers complets.** Le jeu n’explique que sa boucle ; ce document explique le reste.');
out.push('> Généré par `node tools/build_docs.js` à partir des données — il suit le jeu tel qu’il est.');
out.push('');
out.push('## La boucle');
out.push('');
out.push('1. Dans la chambre : régler la lampe, la fenêtre, la porte (elles changent les rêves), éventuellement prendre un comprimé (bleu : rêve plus long et plus profond ; blanc : rêve plus doux), puis dormir.');
out.push('2. Le rêve dure 10 minutes (20 avec le comprimé bleu). La chambre de rêve mène au Nexus ; le Nexus aux mondes.');
out.push('3. Les effets trouvés pendant la nuit ne sont gardés qu’au **réveil normal** (porte de la chambre de rêve, ou fin du temps). Une capture par une sorcière ou la Prêtresse jette la nuit — sauf si l’on a un biscuit.');
out.push('4. Au Nexus, **coucher un effet dans un nid** le garde pour toujours (on ne peut plus l’équiper).');
out.push('5. **Trente nids** : au réveil suivant, la porte-fenêtre s’ouvre (Fin I).');
out.push('');
out.push('## Les ' + core.length + ' effets des quarante premiers mondes');
out.push('');
out.push('Trente suffisent. Il y en a ' + core.length + ' : on peut en manquer six. Aucune énigme seule ne bloque la fin (vérifié par `tests/run.js`).');
out.push('');
out.push('| Effet | Monde | Comment | Chemin depuis le Nexus |');
out.push('|---|---|---|---|');
core.forEach(function (e) {
  var r = route(e.world);
  out.push('| **' + e.name + '** (' + e.id + ') | ' + wn(e.world) + ' | ' + (e.get || '').replace(/\|/g, '/') + ' | ' + (r ? r.slice(1).map(function (x) { return x; }).join(' → ') : '—') + ' |');
});
out.push('');
out.push('## Ordre conseillé');
out.push('');
out.push('- **Premières nuits** : le Jardin (Pousse, Sifflet du merle, Arrosoir côté serre), la Gare (Billet), la Ville au crépuscule, l’École, le Village (Cloche). Peu de sorcières tant qu’on a peu d’effets gardés.');
out.push('- **Ensuite** : les effets qui ouvrent d’autres effets — Lanterne (lieux sombres, phares), Poisson (eau), Craie (tableaux de l’École → deux mondes), Lunettes (ce qui est caché), Boussole (Dédale).');
out.push('- **Coucher tôt dans les nids** ce qu’on n’utilise plus : une capture ne peut plus le reprendre.');
out.push('- Les sorcières se débloquent avec le nombre d’effets gardés (2, 5, 8, 12, 16). Un biscuit sauve d’une étreinte (pas de celle de la Prêtresse verrouillée).');
out.push('');
out.push('## Les quatre fins');
out.push('');
out.push('| Fin | Conditions |');
out.push('|---|---|');
out.push('| I — ' + YN.endings.SEQ.I.name + ' | 30 effets dans les nids → au réveil, la porte-fenêtre s’ouvre ; au garde-corps : « Regarder le ciel ». Suivie d’un message de prévention. |');
out.push('| II — ' + YN.endings.SEQ.II.name + ' | Fin I disponible **et** sa voix revenue : Q04 résolue (cinq mots rendus à l’Ancienne), Q03 (lettre de M. remise au facteur des lettres impossibles), Q08 (Ondine sortie de la cabine), voix de la mère entendue (W187 ou W190 ; ou fête des mères ; ou cinq visites de la mère). Éveillée, devant la porte de la chambre : lui parler. |');
out.push('| III — ' + YN.endings.SEQ.III.name + ' | Entrer dans la sixième couche par W181 (Scaphandre équipé) ou W182 (voir plus bas), dormir dans les sept lits, se recoucher dans le dernier (W193). |');
out.push('| IV — █████ | Mode caractères ; « set 68 » devant un mur ; dans l’espace en caractères (W191), écrire ou dire FIN. |');
out.push('');
out.push('## La sixième couche (P5)');
out.push('');
out.push('Deux entrées seulement :');
out.push('- **W181 Le Lit au fond de l’eau** — depuis la Mer intérieure (W090) quand les trois phares sont allumés (W029, W088, W158, avec la Lanterne) ou une nuit de pleine lune réelle ; aussi depuis l’Escalier dans le noir (W143). S’allonger dans le lit demande le **Scaphandre** (E77, l’Épave W091).');
out.push('- **W182 La Chambre d’en bas** — depuis la cave de l’Immeuble (W038) après une visite en profondeur 3 et avec le comprimé bleu. Le lit n’accepte que si la chambre est **l’inverse du dessin** accroché au mur (dessin : lampe allumée, fenêtre ouverte, porte fermée → donc lampe éteinte, fenêtre fermée, porte entrouverte), avec le comprimé bleu, avec au moins **8:00** de rêve restant.');
out.push('');
out.push('## Les arcs');
out.push('');
(YN.data.quests || []).forEach(function (q) {
  out.push('### ' + q.id + ' — ' + q.name);
  q.stages.forEach(function (s) { out.push('- `' + s[0] + '` — ' + s[1]); });
  if (q.reward) out.push('- *Au bout :* ' + q.reward);
  out.push('');
});
out.push('## Événements à l’heure réelle (jamais nécessaires)');
out.push('');
U.keys(W).sort().forEach(function (id) { var t = (W[id].info || {}).time; if (t && t.length && /réel/i.test(t.join(' '))) out.push('- ' + wn(id) + ' : ' + t.join(' ')); });
out.push('- Heure du loup (3 h–4 h) : un loup dans la Forêt qui revient (W109). Indice : graffiti, Ville au crépuscule.');
out.push('- Minute qui bégaie (11:11, 22:22…) : dire « vœu » en rêve donne un biscuit. Indices : Toc-Toc, Salle des horloges.');
out.push('- 8 mai (어버이날) : des œillets dans la Tour de Verre (W033). Indice : calendrier du 44e étage.');
out.push('- Vendredi 13 : une maison numéro 13 dans le Quartier aux portes identiques (W010), vers l’Étage 13 bis.');
out.push('- 24–25 décembre : un sapin allumé dans le Quartier résidentiel vide (W008).');
out.push('');
fs.writeFileSync(path.join(L.ROOT, 'PROGRESSION.md'), out.join('\n'));
console.log('PROGRESSION.md : ' + out.length + ' lignes');
