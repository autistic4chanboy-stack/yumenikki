/* =========================================================================
 *  42 ORIGINS — missions Python (10 contrats)
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};

  O42.missions.py = [
    {
      id: 'p1', title: 'Dire bonjour à Guido', job: 'Contrat 01 · Agent d’accueil', stars: 1,
      scene: 'talk', sceneOpts: { who: 'human', name: 'Guido', hair: '#6a4a2a', shirt: '#ffcc4d', expect: 'Bonjour Guido\n', happy: 'Bonjour ! Bienvenue dans le monde de Python 🐍', wrong: 'Hmm ? Ce n’est pas tout à fait ça…', wait: '(Guido attend ton bonjour)' },
      story: 'Guido, le créateur de Python, visite le campus. Salue-le avec la fonction <code>print</code>.',
      goal: 'Affiche exactement <code>Bonjour Guido</code> (print ajoute tout seul le retour à la ligne).',
      lesson: '<p><code>print(…)</code> affiche ses arguments puis passe à la ligne. Un texte (type <code>str</code>) s’écrit entre guillemets <code>"…"</code> ou apostrophes <code>\'…\'</code>.</p>' +
        '<p>Contrairement au C, il n’y a ni <code>main</code>, ni <code>;</code>, ni longueur à compter : Python s’en occupe.</p>' +
        '<p>Dans la vue mémoire, le texte devient un <b>objet str</b> rangé sur le tas, une lettre par case.</p>',
      starter: '# Python lit le fichier de haut en bas\nprint("Bonjour")\n',
      hints: ['Il manque « Guido ».', 'print("Bonjour Guido")'],
      solution: 'print("Bonjour Guido")\n',
      tests: [{ expect: 'Bonjour Guido\n' }],
      rules: { mustCall: ['print'] }
    },
    {
      id: 'p2', title: 'L’enseigne immuable', job: 'Contrat 02 · Électricien du néon', stars: 1,
      scene: 'sign', sceneOpts: { v: 'enseigne', text: 'CAFE FERME' },
      story: 'Même café, autre langage ! Mais attention : en Python, on ne peut <b>pas</b> changer une lettre d’une chaîne (essaie <code>enseigne[5] = "O"</code> pour voir l’erreur). Il faut fabriquer une <b>nouvelle</b> chaîne.',
      goal: 'Fais en sorte que <code>enseigne</code> vaille <code>CAFE OUVRE</code> en réutilisant le début <code>enseigne[:5]</code> (tranche) et en ajoutant la fin, puis affiche-la.<br>Interdit d’écrire "CAFE OUVRE" en entier.',
      lesson: '<p>Les chaînes Python sont <b>immuables</b> : une fois créées, leurs cases ne changent plus. Une « modification » crée en réalité un <b>nouvel objet</b>, et la variable pointe ensuite vers lui (regarde l’adresse changer dans la mémoire).</p>' +
        '<p><b>Tranches</b> : <code>s[a:b]</code> renvoie les cases a à b−1.</p><pre>s = "CAFE FERME"\ns[:5]   # "CAFE "\ns[5:]   # "FERME"</pre>' +
        '<p>On colle deux chaînes avec <code>+</code>.</p>',
      starter: 'enseigne = "CAFE FERME"\n# enseigne[5] = "O"   <- essaie : TypeError !\n\nprint(enseigne)\n',
      hints: ['enseigne[:5] donne "CAFE ".', 'enseigne = enseigne[:5] + "OUVRE" — ah non, OUVRE est interdit entier ! Assemble-le : "OUV" + "RE".', 'Ou bien : enseigne = enseigne.replace("FERME", "OUV" + "RE")'],
      solution: 'enseigne = "CAFE FERME"\nenseigne = enseigne[:5] + "OUV" + "RE"\nprint(enseigne)\n',
      tests: [{ expect: 'CAFE OUVRE\n' }],
      rules: { forbidSrc: [{ re: '["\'][^"\'\\n]*OUVRE', msg: 'N’écris pas OUVRE en entier : construis la nouvelle chaîne.' }], mustSrc: [{ re: 'enseigne\\s*\\[|replace', msg: 'Réutilise une partie de enseigne (tranche ou replace).' }] }
    },
    {
      id: 'p3', title: 'Le compte à rebours', job: 'Contrat 03 · Base spatiale', stars: 1,
      scene: 'rocket', sceneOpts: {},
      story: 'La fusée a besoin de son compte à rebours, cette fois en Python. Utilise une boucle <code>for</code> avec <code>range</code>.',
      goal: 'Affiche 5, 4, 3, 2, 1 (un par ligne) puis <code>DECOLLAGE</code>, avec une boucle.',
      lesson: '<p><code>range(debut, fin, pas)</code> produit les entiers de debut jusqu’à fin <b>exclue</b>, de pas en pas :</p><pre>range(5, 0, -1)  →  5 4 3 2 1</pre>' +
        '<p>Le bloc de la boucle est défini par l’<b>indentation</b> (4 espaces) :</p><pre>for i in range(3):\n    print(i)      # dans la boucle\nprint("fin")     # après</pre>',
      starter: 'for i in range(5, 0, -1):\n    pass  # remplace pass par l\'affichage de i\n\nprint("DECOLLAGE")\n',
      hints: ['print(i) à la place de pass.', 'Garde bien les 4 espaces devant print(i).'],
      solution: 'for i in range(5, 0, -1):\n    print(i)\n\nprint("DECOLLAGE")\n',
      tests: [{ expect: '5\n4\n3\n2\n1\nDECOLLAGE\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: 'print\\(\\s*["\']?5', msg: 'Ne recopie pas les nombres : la boucle s’en charge.' }] }
    },
    {
      id: 'p4', title: 'Le guichet de la poste', job: 'Contrat 04 · Postier', stars: 2,
      scene: 'mail', sceneOpts: {},
      story: 'Les clients donnent leur prénom au guichet. <code>input()</code> lit une ligne tapée au clavier (l’entrée standard).',
      goal: 'Lis un prénom avec <code>input()</code> et affiche <code>Bonjour &lt;prénom&gt; !</code> — testé avec plusieurs clients.',
      lesson: '<p><code>nom = input()</code> lit une ligne de l’entrée <b>sans</b> le retour à la ligne, et la renvoie toujours sous forme de <b>texte</b> (str).</p>' +
        '<p>Trois façons de construire la phrase :</p><pre>print("Bonjour " + nom + " !")\nprint("Bonjour", nom, "!")\nprint(f"Bonjour {nom} !")   # f-string</pre>' +
        '<p>Modifie l’onglet <b>⌨ Entrée</b> pour tester d’autres prénoms.</p>',
      starter: 'nom = input()\n# affiche : Bonjour <nom> !\n',
      stdin: 'Ada\n',
      hints: ['print(f"Bonjour {nom} !")'],
      solution: 'nom = input()\nprint(f"Bonjour {nom} !")\n',
      tests: [{ stdin: 'Ada\n', expect: 'Bonjour Ada !\n' }, { stdin: 'Linus\n', expect: 'Bonjour Linus !\n' }, { stdin: 'Grace\n', expect: 'Bonjour Grace !\n' }],
      rules: { mustCall: ['input', 'print'] }
    },
    {
      id: 'p5', title: 'La liste de courses', job: 'Contrat 05 · Épicerie', stars: 2,
      scene: 'conveyor', sceneOpts: { title: 'ÉPICERIE · LISTE' },
      story: 'L’épicier reçoit des articles un par un, jusqu’au mot <code>FIN</code>. Range-les dans une <b>liste</b>, puis affiche la liste numérotée et le total.',
      goal: 'Lis les lignes avec <code>input()</code> jusqu’à <code>FIN</code>, ajoute chaque article à une liste avec <code>append</code>, puis affiche :<pre>1. pain\n2. lait\n3. pommes\ntotal: 3</pre>',
      lesson: '<p>Une <b>liste</b> est un objet modifiable qui contient des références vers d’autres objets :</p><pre>courses = []\ncourses.append("pain")   # ajoute à la fin\nlen(courses)             # 1</pre>' +
        '<p>Dans la vue mémoire, la liste est un tableau de cases [0], [1]… qui <b>pointent</b> vers les objets str.</p>' +
        '<p><code>enumerate(liste, 1)</code> donne les paires (numéro, élément) en commençant à 1.</p>',
      starter: 'courses = []\narticle = input()\nwhile article != "FIN":\n    # TODO : ajoute article à la liste, puis lis le suivant\n    article = input()\n\nfor num, a in enumerate(courses, 1):\n    print(f"{num}. {a}")\n# TODO : affiche « total: » suivi du nombre d\'articles\n',
      stdin: 'pain\nlait\npommes\nFIN\n',
      hints: ['courses.append(article)', 'print(f"total: {len(courses)}")'],
      solution: 'courses = []\narticle = input()\nwhile article != "FIN":\n    courses.append(article)\n    article = input()\n\nfor num, a in enumerate(courses, 1):\n    print(f"{num}. {a}")\nprint(f"total: {len(courses)}")\n',
      tests: [{ stdin: 'pain\nlait\npommes\nFIN\n', expect: '1. pain\n2. lait\n3. pommes\ntotal: 3\n' }, { stdin: 'riz\nFIN\n', expect: '1. riz\ntotal: 1\n' }, { stdin: 'FIN\n', expect: 'total: 0\n' }],
      rules: { mustCall: ['append', 'input'] }
    },
    {
      id: 'p6', title: 'Le compteur de lettres', job: 'Contrat 06 · Imprimerie', stars: 3,
      scene: 'bars', sceneOpts: { v: 'compte', title: 'IMPRIMERIE · CASSES' },
      story: 'L’imprimeur doit savoir combien de caractères de plomb préparer. Compte chaque lettre d’un mot avec un <b>dictionnaire</b>.',
      goal: 'Lis un mot, compte ses lettres dans le dictionnaire <code>compte</code>, puis affiche chaque lettre dans l’ordre de première apparition : <pre>b: 1\na: 3\nn: 2</pre>(pour « banana »).',
      lesson: '<p>Un <b>dictionnaire</b> associe des <b>clés</b> à des <b>valeurs</b> :</p><pre>compte = {}\ncompte["a"] = 1\ncompte.get("z", 0)   # 0 si la clé n’existe pas</pre>' +
        '<p>Pour compter : <code>compte[c] = compte.get(c, 0) + 1</code>.</p>' +
        '<p>Depuis Python 3.7, un dict garde l’<b>ordre d’insertion</b> : parfait pour l’ordre de première apparition.</p>',
      starter: 'mot = input()\ncompte = {}\nfor c in mot:\n    pass  # TODO : augmente le compteur de la lettre c\n\nfor lettre in compte:\n    print(f"{lettre}: {compte[lettre]}")\n',
      stdin: 'banana\n',
      hints: ['compte[c] = compte.get(c, 0) + 1'],
      solution: 'mot = input()\ncompte = {}\nfor c in mot:\n    compte[c] = compte.get(c, 0) + 1\n\nfor lettre in compte:\n    print(f"{lettre}: {compte[lettre]}")\n',
      tests: [{ stdin: 'banana\n', expect: 'b: 1\na: 3\nn: 2\n' }, { stdin: 'abracadabra\n', expect: 'a: 5\nb: 2\nr: 2\nc: 1\nd: 1\n' }, { stdin: 'x\n', expect: 'x: 1\n' }],
      rules: { forbidSrc: [{ re: '\\.count\\(|Counter', msg: 'Compte toi-même avec le dictionnaire (pas de .count ni Counter).' }] }
    },
    {
      id: 'p7', title: 'Le coffre des palindromes', job: 'Contrat 07 · Serrurier', stars: 3,
      scene: 'vault', sceneOpts: { v: 'mot', i: 'i', j: 'j', cap: 'Le coffre s’ouvre pour les mots qui se lisent dans les deux sens' },
      story: 'Le nouveau coffre ne s’ouvre qu’avec un <b>palindrome</b> (un mot qui se lit pareil dans les deux sens : kayak, radar…). Écris la fonction qui le vérifie.',
      goal: 'Écris <code>est_palindrome(mot)</code> qui renvoie <code>True</code> ou <code>False</code> <b>sans</b> utiliser <code>[::-1]</code> ni <code>reversed</code> : compare les lettres avec deux indices <code>i</code> et <code>j</code>. Le programme affiche <code>OUVERT</code> ou <code>FERME</code> pour chaque mot lu.',
      lesson: '<p>Une <b>fonction</b> se définit avec <code>def</code> et renvoie un résultat avec <code>return</code>. À chaque appel, un nouveau <b>cadre</b> apparaît dans la pile d’appels avec ses propres variables.</p>' +
        '<pre>def est_palindrome(mot):\n    i = 0\n    j = len(mot) - 1\n    while i < j:\n        if mot[i] != mot[j]:\n            return False\n        …</pre>' +
        '<p>Dès qu’on trouve deux lettres différentes, inutile de continuer : <code>return False</code> sort immédiatement.</p>',
      starter: 'def est_palindrome(mot):\n    i = 0\n    j = len(mot) - 1\n    # TODO : compare mot[i] et mot[j] en rapprochant i et j\n    return True\n\nn = int(input())\nfor k in range(n):\n    m = input()\n    if est_palindrome(m):\n        print("OUVERT")\n    else:\n        print("FERME")\n',
      stdin: '3\nkayak\nradar\npython\n',
      hints: ['while i < j:', 'if mot[i] != mot[j]: return False', 'Sinon : i += 1 et j -= 1. Après la boucle : return True.'],
      solution: 'def est_palindrome(mot):\n    i = 0\n    j = len(mot) - 1\n    while i < j:\n        if mot[i] != mot[j]:\n            return False\n        i += 1\n        j -= 1\n    return True\n\nn = int(input())\nfor k in range(n):\n    m = input()\n    if est_palindrome(m):\n        print("OUVERT")\n    else:\n        print("FERME")\n',
      tests: [{ stdin: '3\nkayak\nradar\npython\n', expect: 'OUVERT\nOUVERT\nFERME\n' }, { stdin: '4\na\nab\nabba\nabca\n', expect: 'OUVERT\nFERME\nOUVERT\nFERME\n' }, { stdin: '1\n\n', expect: 'OUVERT\n' }],
      rules: { forbidSrc: [{ re: '::\\s*-1|reversed', msg: 'Sans [::-1] ni reversed : utilise deux indices.' }] }
    },
    {
      id: 'p8', title: 'Les jumeaux et la boîte à jouets', job: 'Contrat 08 · Crèche', stars: 4,
      scene: 'twins', sceneOpts: { a: 'jouets_lea', b: 'jouets_tom' },
      story: 'Léa et Tom ont chacun leur boîte à jouets… enfin, croyait-on. Quand Tom ajoute un jouet, il apparaît aussi chez Léa ! C’est l’<b>aliasing</b> : deux noms, <b>un seul</b> objet.',
      goal: 'Corrige la ligne <code>jouets_tom = jouets_lea</code> pour que Tom ait <b>sa propre copie</b>. Sortie attendue :<pre>[\'ours\', \'balle\']\n[\'ours\', \'balle\', \'robot\']</pre>',
      lesson: '<p>En Python, <code>b = a</code> ne copie <b>pas</b> la liste : il colle une deuxième étiquette sur le <b>même objet</b>. Regarde dans la mémoire : deux flèches vers une seule liste !</p>' +
        '<p>Pour une vraie copie : <code>b = a.copy()</code>, <code>b = list(a)</code> ou <code>b = a[:]</code>. Un nouvel objet apparaît alors sur le tas.</p>' +
        '<p>C’est l’équivalent de deux pointeurs C vers le même bloc malloc.</p>',
      starter: 'jouets_lea = ["ours", "balle"]\njouets_tom = jouets_lea      # <- le bug est ici\n\njouets_tom.append("robot")\nprint(jouets_lea)\nprint(jouets_tom)\n',
      hints: ['Il faut un NOUVEL objet liste pour Tom.', 'jouets_tom = jouets_lea.copy()'],
      solution: 'jouets_lea = ["ours", "balle"]\njouets_tom = jouets_lea.copy()\n\njouets_tom.append("robot")\nprint(jouets_lea)\nprint(jouets_tom)\n',
      tests: [{ expect: "['ours', 'balle']\n['ours', 'balle', 'robot']\n" }],
      rules: { forbidSrc: [{ re: 'jouets_tom\\s*=\\s*\\[\\s*["\']', msg: 'Copie la liste de Léa au lieu de réécrire les jouets à la main.' }] }
    },
    {
      id: 'p9', title: 'Le tableau des scores', job: 'Contrat 09 · Arcade', stars: 4,
      scene: 'bars', sceneOpts: { v: 'scores', title: 'ARCADE · HIGH SCORES' },
      story: 'La borne d’arcade enregistre les scores sur une seule ligne, séparés par des espaces. Calcule les statistiques du jour.',
      goal: 'Lis la ligne, transforme-la en liste d’entiers <code>scores</code>, puis affiche :<pre>meilleur: 42\npire: 3\nmoyenne: 16.0\nclassement: 42 12 7 3</pre>(moyenne avec 1 chiffre après la virgule, classement décroissant).',
      lesson: '<p><code>"12 7 42".split()</code> découpe le texte en liste <code>["12", "7", "42"]</code>… de <b>textes</b> ! Il faut les convertir : <code>int("12")</code>.</p>' +
        '<pre>scores = [int(x) for x in ligne.split()]   # compréhension de liste</pre>' +
        '<p>Fonctions utiles : <code>max</code>, <code>min</code>, <code>sum</code>, <code>len</code>, <code>sorted(l, reverse=True)</code>. Format : <code>f"{x:.1f}"</code>.</p>' +
        '<p>Pour coller les nombres : <code>" ".join(str(s) for s in …)</code>.</p>',
      starter: 'ligne = input()\nscores = []\n# TODO : remplis scores avec les entiers de la ligne\n\nprint(f"meilleur: {max(scores)}")\n',
      stdin: '12 7 42 3\n',
      hints: ['scores = [int(x) for x in ligne.split()]', 'moyenne = sum(scores) / len(scores) puis print(f"moyenne: {moyenne:.1f}")', 'print("classement: " + " ".join([str(s) for s in sorted(scores, reverse=True)]))'],
      solution: 'ligne = input()\nscores = [int(x) for x in ligne.split()]\n\nprint(f"meilleur: {max(scores)}")\nprint(f"pire: {min(scores)}")\nmoyenne = sum(scores) / len(scores)\nprint(f"moyenne: {moyenne:.1f}")\nprint("classement: " + " ".join([str(s) for s in sorted(scores, reverse=True)]))\n',
      tests: [{ stdin: '12 7 42 3\n', expect: 'meilleur: 42\npire: 3\nmoyenne: 16.0\nclassement: 42 12 7 3\n' }, { stdin: '5\n', expect: 'meilleur: 5\npire: 5\nmoyenne: 5.0\nclassement: 5\n' }, { stdin: '10 20 25\n', expect: 'meilleur: 25\npire: 10\nmoyenne: 18.3\nclassement: 25 20 10\n' }],
      rules: {}
    },
    {
      id: 'p10', title: 'Les tours de Hanoï', job: 'Contrat 10 · Déménageur de temples', stars: 5,
      scene: 'hanoi', sceneOpts: { n: 3 },
      story: 'Les moines doivent déplacer une tour de disques du pilier A vers le pilier C, un disque à la fois, sans jamais poser un grand disque sur un petit. La solution tient en <b>3 lignes récursives</b>.',
      goal: 'Écris <code>hanoi(n, depart, arrivee, aide)</code> qui affiche chaque déplacement sous la forme <code>A -> C</code>. Pour n = 2 :<pre>A -> B\nA -> C\nB -> C</pre>',
      lesson: '<p>Une fonction <b>récursive</b> s’appelle elle-même sur un problème plus petit. Pour déplacer n disques de A vers C :</p>' +
        '<ol><li>déplacer n−1 disques de A vers B (en s’aidant de C),</li><li>déplacer le grand disque de A vers C,</li><li>déplacer les n−1 disques de B vers C (en s’aidant de A).</li></ol>' +
        '<p>Il faut un <b>cas de base</b> qui arrête la récursion : si n == 0, on ne fait rien. Sinon : <b>RecursionError</b> !</p>' +
        '<p>Avance pas à pas et regarde les cadres <code>hanoi()</code> s’empiler dans la pile d’appels.</p>',
      starter: 'def hanoi(n, depart, arrivee, aide):\n    if n == 0:\n        return\n    # TODO : 1) n-1 disques de depart vers aide\n    print(f"{depart} -> {arrivee}")\n    # TODO : 3) n-1 disques de aide vers arrivee\n\nn = int(input())\nhanoi(n, "A", "C", "B")\n',
      stdin: '3\n',
      hints: ['hanoi(n - 1, depart, aide, arrivee)', 'hanoi(n - 1, aide, arrivee, depart)', 'Pour n disques il faut 2ⁿ − 1 coups : 7 pour 3 disques.'],
      solution: 'def hanoi(n, depart, arrivee, aide):\n    if n == 0:\n        return\n    hanoi(n - 1, depart, aide, arrivee)\n    print(f"{depart} -> {arrivee}")\n    hanoi(n - 1, aide, arrivee, depart)\n\nn = int(input())\nhanoi(n, "A", "C", "B")\n',
      tests: [{ stdin: '2\n', expect: 'A -> B\nA -> C\nB -> C\n' }, { stdin: '3\n', expect: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C\n' }, { stdin: '1\n', expect: 'A -> C\n' }],
      rules: { mustCall: ['hanoi'] }
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
