/* =========================================================================
 *  42 ORIGINS — chapitres (10 par langage, 10 missions chacun)
 *  La 10e mission de chaque chapitre est son « contrat final ».
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  function ch(t, d) { return { t: t, d: d }; }
  O42.chapters = {
    c: [
      ch('Afficher avec write', 'Le descripteur 1, les octets, le \\n.'),
      ch('Cases et tableaux', 'Variables, char, indices, le \\0 final.'),
      ch('Conditions et boucles', 'if, while, compter, répéter.'),
      ch('Fonctions et chaînes', 'Paramètres, return, parcourir une chaîne.'),
      ch('Lire l’entrée', 'read, nombres tapés, conversions.'),
      ch('Algorithmes sur place', 'Échanger, inverser, trier dans un tableau.'),
      ch('Pointeurs et malloc', 'Adresses, *p, &x, le tas, free.'),
      ch('Tableaux dynamiques', 'Tableaux d’int sur le tas, calculs, 2D.'),
      ch('Ligne par ligne', 'get_next_line, fichiers, aucune fuite.'),
      ch('Structs et listes chaînées', 'struct, ->, maillons, parcours, libération.')
    ],
    py: [
      ch('Afficher avec print', 'Textes, nombres, sep et end.'),
      ch('Variables et textes', 'Affectation, str immuables, tranches.'),
      ch('Boucles', 'for, range, while, accumuler.'),
      ch('Lire l’entrée', 'input, int(), plusieurs lignes.'),
      ch('Listes', 'append, indices, parcours, tri.'),
      ch('Dictionnaires', 'Clés, valeurs, compter, regrouper.'),
      ch('Fonctions', 'def, paramètres, return, cadres.'),
      ch('Références et copies', 'Alias, copy, listes de listes.'),
      ch('Algorithmes', 'Recherche, tri, chaînes, statistiques.'),
      ch('Récursion', 'Cas de base, pile d’appels, diviser pour régner.')
    ],
    asm: [
      ch('Registres et exit', 'mov, rdi, le code de sortie.'),
      ch('Écrire avec write', 'Données .data, adresses, syscall 1.'),
      ch('Calculer avec l’ALU', 'add, sub, imul, div, drapeaux.'),
      ch('Comparer et sauter', 'cmp, je, jg, jl…'),
      ch('Boucles', 'Compteurs, dec, jnz, chiffres.'),
      ch('Fonctions', 'call, ret, arguments dans rdi, rsi.'),
      ch('La pile', 'push, pop, sauvegarder, inverser.'),
      ch('Copier la mémoire', 'Octet par octet, [rsi + rcx], .bss.'),
      ch('Lire l’entrée', 'syscall read, tampons, longueur lue.'),
      ch('La libc et malloc', 'main, call malloc, free, libasm.')
    ]
  };

  /* range les missions par chapitre puis par ordre, et complète les champs */
  O42.finalizeMissions = function () {
    ['c', 'py', 'asm'].forEach(function (lang) {
      var list = O42.missions[lang] || [];
      list.forEach(function (m) {
        if (!m.ch) { var k = +/\d+$/.exec(m.id)[0]; m.ch = k; m.ord = 10; m.final = true; }
        if (!m.ord) m.ord = 1;
        if (!m.stars) m.stars = Math.min(5, Math.ceil(m.ch / 2));
        if (!m.job) m.job = 'Chapitre ' + m.ch + ' · mission ' + m.ord;
        if (!m.hints) m.hints = [];
        if (!m.scene) m.scene = 'terminal';
        if (!m.story) m.story = '';
        if (!m.lesson) m.lesson = '';
        if (!m.rules) m.rules = {};
      });
      list.sort(function (a, b) { return a.ch - b.ch || a.ord - b.ord; });
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
