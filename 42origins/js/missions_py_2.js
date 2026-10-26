/* 42 ORIGINS — missions Python, chapitres 6 à 10 (missions 1 à 9) */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.py = O42.missions.py || [];
  O42.missions.py.push(

    /* ===================== Chapitre 6 : dictionnaires ===================== */
    {
      id: 'p6_1', ch: 6, ord: 1,
      title: 'Le casier des badges',
      story: 'Au vestiaire du campus, chaque étudiant a un numéro de casier. Le gardien a tout noté dans un <b>dictionnaire</b> : le nom donne le casier.',
      goal: 'Lis un nom puis affiche son casier en lisant le dictionnaire <code>badges</code>. Pour <code>ada</code> :<pre>ada -> casier 12</pre>',
      lesson: '<p>Un <b>dictionnaire</b> (<code>dict</code>) associe des <b>clés</b> à des <b>valeurs</b> :</p><pre>badges = {"ada": 12, "linus": 7}\nbadges["ada"]    # 12</pre>' +
        '<p>On écrit la clé entre crochets, comme un indice de liste… mais la clé peut être un texte.</p>',
      starter: 'badges = {"ada": 12, "linus": 7, "grace": 31}\nnom = input()\n# TODO : remplace le ? par le casier de nom\nprint(f"{nom} -> casier ?")\n',
      stdin: 'ada\n',
      solution: 'badges = {"ada": 12, "linus": 7, "grace": 31}\nnom = input()\nprint(f"{nom} -> casier {badges[nom]}")\n',
      hints: ['La valeur associée à la clé nom s’écrit badges[nom].', 'print(f"{nom} -> casier {badges[nom]}")'],
      tests: [{ stdin: 'ada\n', expect: 'ada -> casier 12\n' }, { stdin: 'grace\n', expect: 'grace -> casier 31\n' }, { stdin: 'linus\n', expect: 'linus -> casier 7\n' }],
      rules: {}
    },
    {
      id: 'p6_2', ch: 6, ord: 2,
      title: 'La carte de la cafétéria',
      story: 'La cafétéria ajoute une boisson à sa carte… ou change le prix d’une boisson existante. Avec un dictionnaire, c’est la même instruction !',
      goal: 'Lis le nom d’une boisson puis son prix (deux lignes), range-le dans <code>menu</code>, puis affiche le menu et le nombre de boissons. Pour <code>chocolat</code> et <code>2</code> :<pre>{\'cafe\': 1, \'the\': 1, \'chocolat\': 2}\n3 boissons</pre>',
      lesson: '<p><code>menu[cle] = valeur</code> <b>ajoute</b> la clé si elle n’existe pas, et <b>remplace</b> sa valeur sinon. Une clé n’apparaît jamais deux fois.</p>' +
        '<p><code>len(menu)</code> donne le nombre de clés. <code>print(menu)</code> affiche le dict entre accolades, dans l’ordre d’ajout.</p>',
      starter: 'menu = {"cafe": 1, "the": 1}\nboisson = input()\nprix = int(input())\n# TODO : range le prix de boisson dans menu\n\nprint(menu)\nprint(f"{len(menu)} boissons")\n',
      stdin: 'chocolat\n2\n',
      solution: 'menu = {"cafe": 1, "the": 1}\nboisson = input()\nprix = int(input())\nmenu[boisson] = prix\n\nprint(menu)\nprint(f"{len(menu)} boissons")\n',
      hints: ['Une seule ligne suffit, avec des crochets.', 'menu[boisson] = prix'],
      tests: [{ stdin: 'chocolat\n2\n', expect: "{'cafe': 1, 'the': 1, 'chocolat': 2}\n3 boissons\n" }, { stdin: 'cafe\n2\n', expect: "{'cafe': 2, 'the': 1}\n2 boissons\n" }, { stdin: 'jus\n3\n', expect: "{'cafe': 1, 'the': 1, 'jus': 3}\n3 boissons\n" }],
      rules: {}
    },
    {
      id: 'p6_3', ch: 6, ord: 3,
      title: 'Les badges inconnus',
      story: 'Des visiteurs se présentent au vestiaire, mais certains n’ont pas de casier. Si on demande une clé absente, Python lève une <b>KeyError</b> : vérifie d’abord !',
      goal: 'Lis un nombre n, puis n noms. Pour chacun, affiche son casier, ou <code>inconnu</code> s’il n’est pas dans <code>casiers</code> :<pre>ada: casier 12\nbob: inconnu</pre>',
      lesson: '<p><code>cle in d</code> vaut <code>True</code> si la clé existe dans le dictionnaire :</p><pre>if nom in casiers:\n    …</pre>' +
        '<p>Autre possibilité : <code>casiers.get(nom, "inconnu")</code> renvoie la valeur, ou la valeur par défaut si la clé manque.</p>',
      starter: 'casiers = {"ada": 12, "linus": 7, "grace": 31}\nn = int(input())\nfor k in range(n):\n    nom = input()\n    # TODO : affiche inconnu si nom n’a pas de casier\n    print(f"{nom}: casier {casiers.get(nom)}")\n',
      stdin: '2\nada\nbob\n',
      solution: 'casiers = {"ada": 12, "linus": 7, "grace": 31}\nn = int(input())\nfor k in range(n):\n    nom = input()\n    if nom in casiers:\n        print(f"{nom}: casier {casiers[nom]}")\n    else:\n        print(f"{nom}: inconnu")\n',
      hints: ['if nom in casiers:', 'Dans le else : print(f"{nom}: inconnu")'],
      tests: [{ stdin: '2\nada\nbob\n', expect: 'ada: casier 12\nbob: inconnu\n' }, { stdin: '3\ngrace\nlinus\nzoe\n', expect: 'grace: casier 31\nlinus: casier 7\nzoe: inconnu\n' }, { stdin: '1\nmax\n', expect: 'max: inconnu\n' }],
      rules: {}
    },
    {
      id: 'p6_4', ch: 6, ord: 4,
      title: 'Le stock de la papeterie',
      story: 'La papeterie du campus veut savoir quels articles recommander. Parcours le stock clé par clé.',
      goal: 'Lis un seuil. Pour chaque article dont la quantité est <b>strictement inférieure</b> au seuil, affiche <code>commander: nom (quantite)</code>, puis le total des quantités. Pour le seuil 3 :<pre>commander: cahiers (2)\ncommander: gommes (0)\ntotal: 19</pre>',
      lesson: '<p><code>for nom, qte in stock.items():</code> parcourt les paires (clé, valeur) dans l’ordre d’ajout.</p>' +
        '<p><code>stock.keys()</code> donne les clés, <code>stock.values()</code> les valeurs : <code>sum(stock.values())</code> les additionne.</p>',
      starter: 'stock = {"stylos": 12, "cahiers": 2, "gommes": 0, "regles": 5}\nseuil = int(input())\nfor nom, qte in stock.items():\n    pass  # TODO : affiche les articles à commander\n\n# TODO : affiche le total\n',
      stdin: '3\n',
      solution: 'stock = {"stylos": 12, "cahiers": 2, "gommes": 0, "regles": 5}\nseuil = int(input())\nfor nom, qte in stock.items():\n    if qte < seuil:\n        print(f"commander: {nom} ({qte})")\n\nprint(f"total: {sum(stock.values())}")\n',
      hints: ['if qte < seuil:', 'print(f"commander: {nom} ({qte})")', 'print(f"total: {sum(stock.values())}")'],
      tests: [{ stdin: '3\n', expect: 'commander: cahiers (2)\ncommander: gommes (0)\ntotal: 19\n' }, { stdin: '10\n', expect: 'commander: cahiers (2)\ncommander: gommes (0)\ncommander: regles (5)\ntotal: 19\n' }, { stdin: '0\n', expect: 'total: 19\n' }],
      rules: { mustCall: ['items'] },
      scene: 'bars', sceneOpts: { v: 'stock', title: 'PAPETERIE · STOCK' }
    },
    {
      id: 'p6_5', ch: 6, ord: 5,
      title: 'Les votes du BDE',
      story: 'Le BDE organise un vote pour le repas de fin d’année. Les bulletins arrivent sur une seule ligne. Compte les voix de chaque plat.',
      goal: 'Lis la ligne, compte les votes dans le dictionnaire <code>votes</code>, affiche chaque plat dans l’ordre de première apparition puis le gagnant (le premier rencontré en cas d’égalité) :<pre>pizza: 3\nsushi: 2\ntacos: 1\ngagnant: pizza</pre>',
      lesson: '<p>Pour compter, on part de 0 si la clé n’existe pas encore :</p><pre>votes[v] = votes.get(v, 0) + 1</pre>' +
        '<p>Pour trouver le gagnant, garde le meilleur vu jusqu’ici et remplace-le seulement si un plat a <b>strictement plus</b> de voix.</p>',
      starter: 'bulletins = input().split()\nvotes = {}\nfor v in bulletins:\n    pass  # TODO : compte le vote v\n\nfor plat in votes:\n    print(f"{plat}: {votes[plat]}")\n\ngagnant = bulletins[0]\n# TODO : cherche le plat avec le plus de voix\nprint(f"gagnant: {gagnant}")\n',
      stdin: 'pizza sushi pizza tacos pizza sushi\n',
      solution: 'bulletins = input().split()\nvotes = {}\nfor v in bulletins:\n    votes[v] = votes.get(v, 0) + 1\n\nfor plat in votes:\n    print(f"{plat}: {votes[plat]}")\n\ngagnant = bulletins[0]\nfor plat in votes:\n    if votes[plat] > votes[gagnant]:\n        gagnant = plat\nprint(f"gagnant: {gagnant}")\n',
      hints: ['votes[v] = votes.get(v, 0) + 1', 'Parcours votes : for plat in votes:', 'if votes[plat] > votes[gagnant]: gagnant = plat'],
      tests: [{ stdin: 'pizza sushi pizza tacos pizza sushi\n', expect: 'pizza: 3\nsushi: 2\ntacos: 1\ngagnant: pizza\n' }, { stdin: 'tacos sushi sushi\n', expect: 'tacos: 1\nsushi: 2\ngagnant: sushi\n' }, { stdin: 'crepes galettes\n', expect: 'crepes: 1\ngalettes: 1\ngagnant: crepes\n' }],
      rules: { forbidSrc: [{ re: '\\.count\\(|Counter|max\\(', msg: 'Compte et cherche le gagnant toi-même (pas de .count, Counter ni max).' }] },
      scene: 'bars', sceneOpts: { v: 'votes', title: 'BDE · VOTES' }
    },
    {
      id: 'p6_6', ch: 6, ord: 6,
      title: 'Le rayon des fruits',
      story: 'Le primeur range ses fruits par <b>initiale</b> sur des étagères. Une valeur de dictionnaire peut être une liste !',
      goal: 'Lis une ligne de fruits, regroupe-les par première lettre dans <code>rayons</code> (une liste par lettre), puis affiche chaque rayon dans l’ordre de première apparition :<pre>a: ananas, abricot\nb: banane, brugnon\nc: cerise</pre>',
      lesson: '<p>Quand la valeur est une liste, il faut la créer la première fois :</p><pre>if f[0] not in rayons:\n    rayons[f[0]] = []\nrayons[f[0]].append(f)</pre>' +
        '<p>Raccourci : <code>rayons.setdefault(f[0], []).append(f)</code> crée la liste vide si besoin, puis la renvoie.</p>' +
        '<p><code>", ".join(liste)</code> colle les textes avec une virgule et une espace.</p>',
      starter: 'fruits = input().split()\nrayons = {}\nfor f in fruits:\n    pass  # TODO : ajoute f dans la liste de son initiale\n\nfor lettre, liste in rayons.items():\n    print(lettre + ": " + ", ".join(liste))\n',
      stdin: 'ananas banane abricot cerise brugnon\n',
      solution: 'fruits = input().split()\nrayons = {}\nfor f in fruits:\n    if f[0] not in rayons:\n        rayons[f[0]] = []\n    rayons[f[0]].append(f)\n\nfor lettre, liste in rayons.items():\n    print(lettre + ": " + ", ".join(liste))\n',
      hints: ['L’initiale de f est f[0].', 'Si f[0] n’est pas encore une clé : rayons[f[0]] = []', 'Puis rayons[f[0]].append(f)'],
      tests: [{ stdin: 'ananas banane abricot cerise brugnon\n', expect: 'a: ananas, abricot\nb: banane, brugnon\nc: cerise\n' }, { stdin: 'kiwi kaki figue\n', expect: 'k: kiwi, kaki\nf: figue\n' }, { stdin: 'poire\n', expect: 'p: poire\n' }],
      rules: { mustCall: ['append'] }
    },
    {
      id: 'p6_7', ch: 6, ord: 7,
      title: 'Le dictionnaire à l’envers',
      story: 'Le club d’anglais a un lexique français → anglais. Mais les correspondants anglais veulent l’inverse ! Retourne le dictionnaire : les valeurs deviennent les clés.',
      goal: 'Construis <code>inverse</code> (anglais → français) <b>à partir de</b> <code>trad</code> avec une boucle, puis traduis la ligne de mots anglais lue (<code>?</code> pour un mot inconnu). Pour <code>cat sun apple</code> :<pre>chat ? pomme</pre>',
      lesson: '<p>Pour inverser un dictionnaire, on parcourt ses paires et on les range à l’envers :</p><pre>for fr, en in trad.items():\n    inverse[en] = fr</pre>' +
        '<p>Attention : si deux clés avaient la même valeur, l’une écraserait l’autre (les clés sont uniques).</p>',
      starter: 'trad = {"chat": "cat", "chien": "dog", "pomme": "apple", "livre": "book"}\ninverse = {}\n# TODO : remplis inverse avec une boucle sur trad\n\nmots = input().split()\nres = []\nfor m in mots:\n    res.append(inverse.get(m, "?"))\nprint(" ".join(res))\n',
      stdin: 'cat sun apple\n',
      solution: 'trad = {"chat": "cat", "chien": "dog", "pomme": "apple", "livre": "book"}\ninverse = {}\nfor fr, en in trad.items():\n    inverse[en] = fr\n\nmots = input().split()\nres = []\nfor m in mots:\n    res.append(inverse.get(m, "?"))\nprint(" ".join(res))\n',
      hints: ['for fr, en in trad.items():', 'inverse[en] = fr'],
      tests: [{ stdin: 'cat sun apple\n', expect: 'chat ? pomme\n' }, { stdin: 'dog book\n', expect: 'chien livre\n' }, { stdin: 'hello\n', expect: '?\n' }],
      rules: { forbidSrc: [{ re: '"(cat|dog|apple|book)"\\s*:', msg: 'Construis inverse avec une boucle, pas à la main.' }] }
    },
    {
      id: 'p6_8', ch: 6, ord: 8,
      title: 'L’annuaire du campus',
      story: 'L’accueil tient l’annuaire téléphonique du campus. Les demandes arrivent sous forme de commandes, une par ligne, jusqu’à <code>FIN</code>.',
      goal: 'Gère les commandes :<ul><li><code>AJOUT nom numero</code> : enregistre (rien à afficher),</li><li><code>CHERCHE nom</code> : affiche <code>nom: numero</code> ou <code>nom: introuvable</code>,</li><li><code>SUPPR nom</code> : supprime et affiche <code>nom supprime</code>, ou <code>nom: introuvable</code>.</li></ul>À la fin, affiche <code>contacts: N</code>.',
      lesson: '<p><code>ligne.split()</code> découpe la commande : <code>parts[0]</code> est l’ordre, <code>parts[1]</code> le nom…</p>' +
        '<p>Pour retirer une clé : <code>del annuaire[nom]</code> ou <code>annuaire.pop(nom)</code> (erreur si la clé n’existe pas : teste avec <code>in</code> avant).</p>',
      starter: 'annuaire = {}\nligne = input()\nwhile ligne != "FIN":\n    parts = ligne.split()\n    if parts[0] == "AJOUT":\n        annuaire[parts[1]] = parts[2]\n    # TODO : CHERCHE et SUPPR\n    ligne = input()\nprint(f"contacts: {len(annuaire)}")\n',
      stdin: 'AJOUT ada 0601\nAJOUT linus 0602\nCHERCHE ada\nCHERCHE bob\nSUPPR linus\nFIN\n',
      solution: 'annuaire = {}\nligne = input()\nwhile ligne != "FIN":\n    parts = ligne.split()\n    nom = parts[1]\n    if parts[0] == "AJOUT":\n        annuaire[nom] = parts[2]\n    elif nom not in annuaire:\n        print(f"{nom}: introuvable")\n    elif parts[0] == "CHERCHE":\n        print(f"{nom}: {annuaire[nom]}")\n    elif parts[0] == "SUPPR":\n        del annuaire[nom]\n        print(f"{nom} supprime")\n    ligne = input()\nprint(f"contacts: {len(annuaire)}")\n',
      hints: ['elif parts[0] == "CHERCHE": … et elif parts[0] == "SUPPR": …', 'Avant de lire ou supprimer, vérifie : if parts[1] in annuaire:', 'del annuaire[parts[1]] puis print(f"{parts[1]} supprime")'],
      tests: [
        { stdin: 'AJOUT ada 0601\nAJOUT linus 0602\nCHERCHE ada\nCHERCHE bob\nSUPPR linus\nFIN\n', expect: 'ada: 0601\nbob: introuvable\nlinus supprime\ncontacts: 1\n' },
        { stdin: 'SUPPR zoe\nAJOUT zoe 0700\nAJOUT zoe 0711\nCHERCHE zoe\nFIN\n', expect: 'zoe: introuvable\nzoe: 0711\ncontacts: 1\n' },
        { stdin: 'AJOUT max 0102\nSUPPR max\nCHERCHE max\nFIN\n', expect: 'max supprime\nmax: introuvable\ncontacts: 0\n' }
      ],
      rules: {},
      scene: 'conveyor', sceneOpts: { title: 'ACCUEIL · ANNUAIRE' }
    },
    {
      id: 'p6_9', ch: 6, ord: 9,
      title: 'Le carnet de notes',
      story: 'Les correcteurs envoient les notes dans le désordre : une ligne <code>nom note</code> à la fois, jusqu’à <code>FIN</code>. Regroupe-les par étudiant et calcule chaque moyenne.',
      goal: 'Range les notes dans un dict <code>nom → liste de notes</code>, puis affiche pour chaque étudiant (ordre de première apparition) sa moyenne avec 1 chiffre après la virgule :<pre>ada: 15.5 (2 notes)\nlinus: 9.0 (1 notes)</pre>',
      lesson: '<p>Tu combines deux idées : <b>regrouper</b> (une liste par clé) puis <b>parcourir</b> le dictionnaire avec <code>items()</code>.</p>' +
        '<p>Moyenne : <code>sum(liste) / len(liste)</code>, affichée avec <code>f"{m:.1f}"</code>.</p>',
      starter: 'carnet = {}\nligne = input()\nwhile ligne != "FIN":\n    nom, note = ligne.split()\n    # TODO : ajoute int(note) à la liste de nom\n    ligne = input()\n\n# TODO : affiche la moyenne de chaque étudiant\n',
      stdin: 'ada 14\nlinus 9\nada 17\nFIN\n',
      solution: 'carnet = {}\nligne = input()\nwhile ligne != "FIN":\n    nom, note = ligne.split()\n    carnet.setdefault(nom, []).append(int(note))\n    ligne = input()\n\nfor nom, notes in carnet.items():\n    m = sum(notes) / len(notes)\n    print(f"{nom}: {m:.1f} ({len(notes)} notes)")\n',
      hints: ['carnet.setdefault(nom, []).append(int(note))', 'for nom, notes in carnet.items():', 'm = sum(notes) / len(notes) puis print(f"{nom}: {m:.1f} ({len(notes)} notes)")'],
      tests: [
        { stdin: 'ada 14\nlinus 9\nada 17\nFIN\n', expect: 'ada: 15.5 (2 notes)\nlinus: 9.0 (1 notes)\n' },
        { stdin: 'zoe 10\nmax 20\nzoe 11\nzoe 12\nmax 0\nFIN\n', expect: 'zoe: 11.0 (3 notes)\nmax: 10.0 (2 notes)\n' },
        { stdin: 'FIN\n', expect: '' }
      ],
      rules: {}
    },

    /* ===================== Chapitre 7 : fonctions ===================== */
    {
      id: 'p7_1', ch: 7, ord: 1,
      title: 'La sonnette du hall',
      story: 'La sonnette du hall est réglée : la fonction <code>sonner</code> existe déjà. Il ne reste plus qu’à appuyer dessus… trois fois.',
      goal: 'Appelle la fonction <code>sonner()</code> trois fois. Sortie :<pre>Driiing !\nDriiing !\nDriiing !</pre>',
      lesson: '<p><code>def nom():</code> <b>définit</b> une fonction : son corps (indenté) n’est pas exécuté tout de suite.</p>' +
        '<p>Il s’exécute à chaque <b>appel</b> : <code>sonner()</code>. Les parenthèses sont obligatoires, même vides. Regarde le cadre <code>sonner</code> apparaître dans la pile d’appels.</p>',
      starter: 'def sonner():\n    print("Driiing !")\n\n# TODO : appelle sonner trois fois\n',
      solution: 'def sonner():\n    print("Driiing !")\n\nsonner()\nsonner()\nsonner()\n',
      hints: ['Un appel s’écrit sonner()', 'Trois lignes sonner(), ou une boucle for k in range(3):'],
      tests: [{ expect: 'Driiing !\nDriiing !\nDriiing !\n' }],
      rules: { mustCall: ['sonner'], forbidSrc: [{ re: 'print\\([^)]*\\)[\\s\\S]*print\\(', msg: 'Un seul print, dans la fonction : appelle sonner().' }] }
    },
    {
      id: 'p7_2', ch: 7, ord: 2,
      title: 'Le comité d’accueil',
      story: 'Chaque nouveau visiteur mérite un accueil personnalisé. Donne un <b>paramètre</b> à la fonction pour qu’elle connaisse le nom.',
      goal: 'Complète <code>saluer(nom)</code> pour qu’elle affiche <code>Bienvenue sur le campus, NOM !</code>. Le programme lit n puis n noms :<pre>Bienvenue sur le campus, Ada !\nBienvenue sur le campus, Linus !</pre>',
      lesson: '<p>Un <b>paramètre</b> est une variable du cadre de la fonction, remplie au moment de l’appel :</p><pre>def saluer(nom):\n    …\nsaluer("Ada")    # dans le cadre, nom = "Ada"</pre>',
      starter: 'def saluer(nom):\n    pass  # TODO : affiche le message avec nom\n\nn = int(input())\nfor k in range(n):\n    saluer(input())\n',
      stdin: '2\nAda\nLinus\n',
      solution: 'def saluer(nom):\n    print(f"Bienvenue sur le campus, {nom} !")\n\nn = int(input())\nfor k in range(n):\n    saluer(input())\n',
      hints: ['Remplace pass par un print.', 'print(f"Bienvenue sur le campus, {nom} !")'],
      tests: [{ stdin: '2\nAda\nLinus\n', expect: 'Bienvenue sur le campus, Ada !\nBienvenue sur le campus, Linus !\n' }, { stdin: '1\nGrace\n', expect: 'Bienvenue sur le campus, Grace !\n' }, { stdin: '0\n', expect: '' }],
      rules: { mustCall: ['saluer'] }
    },
    {
      id: 'p7_3', ch: 7, ord: 3,
      title: 'Le carreleur',
      story: 'Le carreleur calcule l’aire et le périmètre des salles. Mais sa fonction <code>aire</code> <b>affiche</b> au lieu de <b>renvoyer</b> : le programme reçoit <code>None</code> !',
      goal: 'Corrige <code>aire(l, h)</code> et écris <code>perimetre(l, h)</code> pour qu’elles <b>renvoient</b> leur résultat avec <code>return</code>. Pour 4 et 3 :<pre>aire: 12\nperimetre: 14</pre>',
      lesson: '<p><code>print</code> montre une valeur à l’écran ; <code>return</code> la <b>renvoie</b> à l’appelant, qui peut la ranger ou la calculer.</p>' +
        '<p>Une fonction sans <code>return</code> renvoie <code>None</code>, la valeur « rien ».</p>',
      starter: 'def aire(l, h):\n    print(l * h)    # affiche... mais ne renvoie rien !\n\ndef perimetre(l, h):\n    return 0  # TODO\n\nl = int(input())\nh = int(input())\nprint(f"aire: {aire(l, h)}")\nprint(f"perimetre: {perimetre(l, h)}")\n',
      stdin: '4\n3\n',
      solution: 'def aire(l, h):\n    return l * h\n\ndef perimetre(l, h):\n    return 2 * (l + h)\n\nl = int(input())\nh = int(input())\nprint(f"aire: {aire(l, h)}")\nprint(f"perimetre: {perimetre(l, h)}")\n',
      hints: ['Dans aire : return l * h (et plus de print).', 'Le périmètre d’un rectangle : 2 * (l + h).'],
      tests: [{ stdin: '4\n3\n', expect: 'aire: 12\nperimetre: 14\n' }, { stdin: '5\n5\n', expect: 'aire: 25\nperimetre: 20\n' }, { stdin: '10\n1\n', expect: 'aire: 10\nperimetre: 22\n' }],
      rules: { mustCall: ['aire', 'perimetre'] }
    },
    {
      id: 'p7_4', ch: 7, ord: 4,
      title: 'Le comptoir à café',
      story: 'Au comptoir, la plupart des clients disent juste « un café ». Le barista veut que la taille soit <code>moyen</code> et le sucre <code>0</code> <b>par défaut</b>. Le stagiaire s’est trompé de réglages…',
      goal: 'Corrige les <b>valeurs par défaut</b> de <code>commande</code> (taille <code>"moyen"</code>, sucre <code>0</code>) sans toucher aux appels. Sortie :<pre>cafe moyen, 0 sucre(s)\nthe grand, 0 sucre(s)\nchocolat moyen, 2 sucre(s)\ncafe petit, 1 sucre(s)</pre>',
      lesson: '<p>Un paramètre peut avoir une <b>valeur par défaut</b>, utilisée si l’appel ne le donne pas :</p><pre>def commande(boisson, taille="moyen", sucre=0):</pre>' +
        '<p>On peut aussi nommer un argument à l’appel : <code>commande("chocolat", sucre=2)</code> saute la taille.</p>',
      starter: 'def commande(boisson, taille="petit", sucre=1):\n    return f"{boisson} {taille}, {sucre} sucre(s)"\n\nprint(commande("cafe"))\nprint(commande("the", "grand"))\nprint(commande("chocolat", sucre=2))\nprint(commande("cafe", "petit", 1))\n',
      solution: 'def commande(boisson, taille="moyen", sucre=0):\n    return f"{boisson} {taille}, {sucre} sucre(s)"\n\nprint(commande("cafe"))\nprint(commande("the", "grand"))\nprint(commande("chocolat", sucre=2))\nprint(commande("cafe", "petit", 1))\n',
      hints: ['Tout se passe sur la ligne def.', 'def commande(boisson, taille="moyen", sucre=0):'],
      tests: [{ expect: 'cafe moyen, 0 sucre(s)\nthe grand, 0 sucre(s)\nchocolat moyen, 2 sucre(s)\ncafe petit, 1 sucre(s)\n' }],
      rules: {
        mustCall: ['commande'],
        mustSrc: [{ re: 'print\\(commande\\("cafe"\\)\\)', msg: 'Garde l’appel commande("cafe") sans arguments en plus.' }, { re: 'taille\\s*=\\s*"moyen"', msg: 'La taille par défaut doit être "moyen".' }]
      }
    },
    {
      id: 'p7_5', ch: 7, ord: 5,
      title: 'Le plus haut sauteur',
      story: 'Au concours de saut du gymnase, trois essais par athlète. Écris <code>max3</code> en t’aidant d’une plus petite fonction <code>max2</code> : une fonction peut en <b>appeler une autre</b>.',
      goal: 'Écris <code>max2(a, b)</code> puis <code>max3(a, b, c)</code> qui utilise <code>max2</code>, <b>sans</b> la fonction <code>max</code> de Python. Pour <code>3 9 4</code> :<pre>record: 9</pre>',
      lesson: '<p>Quand <code>max3</code> appelle <code>max2</code>, un nouveau cadre s’empile au-dessus du sien. Quand <code>max2</code> fait <code>return</code>, son cadre disparaît et la valeur revient dans <code>max3</code>.</p>' +
        '<pre>def max3(a, b, c):\n    return max2(max2(a, b), c)</pre>',
      starter: 'def max2(a, b):\n    return a  # TODO\n\ndef max3(a, b, c):\n    return a  # TODO : utilise max2\n\na, b, c = [int(x) for x in input().split()]\nprint(f"record: {max3(a, b, c)}")\n',
      stdin: '3 9 4\n',
      solution: 'def max2(a, b):\n    if a > b:\n        return a\n    return b\n\ndef max3(a, b, c):\n    return max2(max2(a, b), c)\n\na, b, c = [int(x) for x in input().split()]\nprint(f"record: {max3(a, b, c)}")\n',
      hints: ['max2 : if a > b: return a, sinon return b.', 'max3 : return max2(max2(a, b), c)'],
      tests: [{ stdin: '3 9 4\n', expect: 'record: 9\n' }, { stdin: '-1 -5 -2\n', expect: 'record: -1\n' }, { stdin: '7 2 8\n', expect: 'record: 8\n' }, { stdin: '6 6 6\n', expect: 'record: 6\n' }],
      rules: { mustCall: ['max2', 'max3'], forbidCall: ['max', 'sorted'] }
    },
    {
      id: 'p7_6', ch: 7, ord: 6,
      title: 'La caisse du cinéma',
      story: 'Le ciné-club du campus a des tarifs selon l’âge : enfant (moins de 12 ans) 5 €, ado (moins de 18 ans) 7 €, senior (65 ans et plus) 6 €, sinon 10 €.',
      goal: 'Complète <code>tarif(age)</code> avec plusieurs <code>return</code>. Le programme lit n puis n âges et affiche chaque prix et le total :<pre>8 ans: 5 euros\n30 ans: 10 euros\ntotal: 15 euros</pre>',
      lesson: '<p><code>return</code> <b>quitte</b> la fonction immédiatement : les lignes suivantes ne sont pas exécutées. On peut donc enchaîner des <code>if … : return …</code> sans <code>else</code>.</p>',
      starter: 'def tarif(age):\n    # TODO : enfant 5, ado 7, senior 6\n    return 10\n\nn = int(input())\ntotal = 0\nfor k in range(n):\n    age = int(input())\n    prix = tarif(age)\n    print(f"{age} ans: {prix} euros")\n    total += prix\nprint(f"total: {total} euros")\n',
      stdin: '2\n8\n30\n',
      solution: 'def tarif(age):\n    if age < 12:\n        return 5\n    if age < 18:\n        return 7\n    if age >= 65:\n        return 6\n    return 10\n\nn = int(input())\ntotal = 0\nfor k in range(n):\n    age = int(input())\n    prix = tarif(age)\n    print(f"{age} ans: {prix} euros")\n    total += prix\nprint(f"total: {total} euros")\n',
      hints: ['if age < 12: return 5', 'Puis if age < 18: return 7, puis if age >= 65: return 6.'],
      tests: [
        { stdin: '2\n8\n30\n', expect: '8 ans: 5 euros\n30 ans: 10 euros\ntotal: 15 euros\n' },
        { stdin: '4\n12\n17\n18\n65\n', expect: '12 ans: 7 euros\n17 ans: 7 euros\n18 ans: 10 euros\n65 ans: 6 euros\ntotal: 30 euros\n' },
        { stdin: '1\n11\n', expect: '11 ans: 5 euros\ntotal: 5 euros\n' }
      ],
      rules: { mustCall: ['tarif'] }
    },
    {
      id: 'p7_7', ch: 7, ord: 7,
      title: 'Le chanteur d’opéra',
      story: 'Le professeur de chant fait vocaliser ses élèves sur les <b>voyelles</b>. Découpe le travail en deux fonctions : l’une reconnaît une voyelle, l’autre compte.',
      goal: 'Écris <code>est_voyelle(c)</code> (voyelles : <code>aeiouy</code>) et <code>compter_voyelles(mot)</code> qui l’appelle pour chaque lettre, sans <code>.count</code>. Pour n mots lus :<pre>opera: 3 voyelle(s)\nsolfege: 3 voyelle(s)</pre>',
      lesson: '<p>Découper un problème en <b>petites fonctions</b> rend le code lisible : chaque fonction fait une seule chose.</p>' +
        '<p><code>c in "aeiouy"</code> vaut <code>True</code> si le caractère c fait partie du texte.</p>',
      starter: 'def est_voyelle(c):\n    return False  # TODO\n\ndef compter_voyelles(mot):\n    total = 0\n    # TODO : utilise est_voyelle sur chaque lettre\n    return total\n\nn = int(input())\nfor k in range(n):\n    mot = input()\n    print(f"{mot}: {compter_voyelles(mot)} voyelle(s)")\n',
      stdin: '2\nopera\nsolfege\n',
      solution: 'def est_voyelle(c):\n    return c in "aeiouy"\n\ndef compter_voyelles(mot):\n    total = 0\n    for c in mot:\n        if est_voyelle(c):\n            total += 1\n    return total\n\nn = int(input())\nfor k in range(n):\n    mot = input()\n    print(f"{mot}: {compter_voyelles(mot)} voyelle(s)")\n',
      hints: ['return c in "aeiouy"', 'for c in mot: if est_voyelle(c): total += 1'],
      tests: [{ stdin: '2\nopera\nsolfege\n', expect: 'opera: 3 voyelle(s)\nsolfege: 3 voyelle(s)\n' }, { stdin: '3\nrythme\nbrr\naie\n', expect: 'rythme: 2 voyelle(s)\nbrr: 0 voyelle(s)\naie: 3 voyelle(s)\n' }],
      rules: { mustCall: ['est_voyelle', 'compter_voyelles'], forbidSrc: [{ re: '\\.count\\(', msg: 'Compte toi-même, sans .count.' }] }
    },
    {
      id: 'p7_8', ch: 7, ord: 8,
      title: 'La cuve de la fontaine',
      story: 'La fontaine du patio se remplit seau après seau (100 litres maximum). Mais le niveau affiché reste à 0 : la fonction calcule le bon niveau dans <b>son</b> cadre… et le jette en sortant.',
      goal: 'Fais <b>renvoyer</b> le nouveau niveau par <code>remplir</code> et range-le dans <code>cuve</code> à l’appel. Pour 30, 50 puis 40 litres :<pre>niveau: 30\nniveau: 80\nniveau: 100</pre>',
      lesson: '<p>Les paramètres et variables d’une fonction vivent dans <b>son cadre</b>. Le <code>cuve</code> de <code>remplir</code> n’est pas le <code>cuve</code> du programme : changer l’un ne change pas l’autre.</p>' +
        '<p>Pour faire sortir un résultat : <code>return cuve</code>, puis à l’appel <code>cuve = remplir(cuve, litres)</code>.</p>',
      starter: 'def remplir(cuve, litres):\n    cuve = cuve + litres\n    if cuve > 100:\n        cuve = 100\n    # TODO : renvoie le nouveau niveau\n\ncuve = 0\nn = int(input())\nfor k in range(n):\n    litres = int(input())\n    remplir(cuve, litres)       # <- le résultat est perdu !\n    print(f"niveau: {cuve}")\n',
      stdin: '3\n30\n50\n40\n',
      solution: 'def remplir(cuve, litres):\n    cuve = cuve + litres\n    if cuve > 100:\n        cuve = 100\n    return cuve\n\ncuve = 0\nn = int(input())\nfor k in range(n):\n    litres = int(input())\n    cuve = remplir(cuve, litres)\n    print(f"niveau: {cuve}")\n',
      hints: ['Ajoute return cuve à la fin de remplir.', 'À l’appel : cuve = remplir(cuve, litres)'],
      tests: [{ stdin: '3\n30\n50\n40\n', expect: 'niveau: 30\nniveau: 80\nniveau: 100\n' }, { stdin: '2\n10\n5\n', expect: 'niveau: 10\nniveau: 15\n' }, { stdin: '1\n250\n', expect: 'niveau: 100\n' }],
      rules: { mustCall: ['remplir'], forbidSrc: [{ re: '\\bglobal\\b', msg: 'Sans global : fais sortir le résultat avec return.' }] }
    },
    {
      id: 'p7_9', ch: 7, ord: 9,
      title: 'Le vigile des mots de passe',
      story: 'Le serveur de l’école refuse les mots de passe faibles. Le vigile vérifie trois règles, chacune dans sa petite fonction.',
      goal: 'Complète <code>a_un_chiffre</code>, <code>a_une_majuscule</code> et <code>verifier</code>. <code>verifier</code> renvoie, dans cet ordre de priorité : <code>trop court</code> (moins de 8 caractères), <code>il manque un chiffre</code>, <code>il manque une majuscule</code>, sinon <code>OK</code>.<pre>chat: trop court\nPython2026: OK</pre>',
      lesson: '<p>Une fonction de test renvoie un <b>booléen</b>. Dès qu’on trouve ce qu’on cherche, <code>return True</code> sort de la boucle ; si la boucle se termine, c’est qu’il n’y en a pas : <code>return False</code>.</p>' +
        '<p><code>c.isdigit()</code> et <code>c.isupper()</code> testent un caractère.</p>',
      starter: 'def a_un_chiffre(mdp):\n    return False  # TODO\n\ndef a_une_majuscule(mdp):\n    return False  # TODO\n\ndef verifier(mdp):\n    if len(mdp) < 8:\n        return "trop court"\n    # TODO : les deux autres règles\n    return "OK"\n\nn = int(input())\nfor k in range(n):\n    mdp = input()\n    print(f"{mdp}: {verifier(mdp)}")\n',
      stdin: '2\nchat\nPython2026\n',
      solution: 'def a_un_chiffre(mdp):\n    for c in mdp:\n        if c.isdigit():\n            return True\n    return False\n\ndef a_une_majuscule(mdp):\n    for c in mdp:\n        if c.isupper():\n            return True\n    return False\n\ndef verifier(mdp):\n    if len(mdp) < 8:\n        return "trop court"\n    if not a_un_chiffre(mdp):\n        return "il manque un chiffre"\n    if not a_une_majuscule(mdp):\n        return "il manque une majuscule"\n    return "OK"\n\nn = int(input())\nfor k in range(n):\n    mdp = input()\n    print(f"{mdp}: {verifier(mdp)}")\n',
      hints: ['for c in mdp: if c.isdigit(): return True — et return False après la boucle.', 'Dans verifier : if not a_un_chiffre(mdp): return "il manque un chiffre"', 'Même idée pour la majuscule, avant le return "OK".'],
      tests: [
        { stdin: '2\nchat\nPython2026\n', expect: 'chat: trop court\nPython2026: OK\n' },
        { stdin: '3\nmotdepasse\nmotdepasse42\nMOTdepasse\n', expect: 'motdepasse: il manque un chiffre\nmotdepasse42: il manque une majuscule\nMOTdepasse: il manque un chiffre\n' },
        { stdin: '1\nA1b2C3d4\n', expect: 'A1b2C3d4: OK\n' }
      ],
      rules: { mustCall: ['verifier', 'a_un_chiffre', 'a_une_majuscule'] }
    },

    /* ===================== Chapitre 8 : références et copies ===================== */
    {
      id: 'p8_1', ch: 8, ord: 1,
      title: 'Deux étiquettes, une étagère',
      story: 'À la bibliothèque, l’étagère porte deux étiquettes : <code>etagere</code> et <code>autre</code>. Ce sont deux noms pour <b>le même</b> objet liste.',
      goal: 'Ajoute <code>"carte"</code> en passant <b>par</b> <code>autre</code> (pas par <code>etagere</code>), puis observe : <code>print(etagere)</code> affiche<pre>[\'livre\', \'carte\']</pre>',
      lesson: '<p>En Python, une variable est une <b>étiquette</b> collée sur un objet. <code>autre = etagere</code> colle une deuxième étiquette sur la <b>même</b> liste : aucune copie n’est faite.</p>' +
        '<p>Dans la vue mémoire, suis les deux flèches : elles arrivent au même endroit.</p>',
      starter: 'etagere = ["livre"]\nautre = etagere\n# TODO : ajoute "carte" en passant par autre\n\nprint(etagere)\n',
      solution: 'etagere = ["livre"]\nautre = etagere\nautre.append("carte")\n\nprint(etagere)\n',
      hints: ['autre.append(…)', 'autre.append("carte")'],
      tests: [{ expect: "['livre', 'carte']\n" }],
      rules: {
        mustSrc: [{ re: 'autre\\s*\\.\\s*append\\(', msg: 'Ajoute la carte avec autre.append(…).' }],
        forbidSrc: [{ re: 'etagere\\s*\\.\\s*append|etagere\\s*=\\s*\\[\\s*"livre"\\s*,|etagere\\s*\\+=', msg: 'Ne touche pas à etagere directement : passe par autre.' }]
      },
      scene: 'twins', sceneOpts: { a: 'etagere', b: 'autre' }
    },
    {
      id: 'p8_2', ch: 8, ord: 2,
      title: 'Pareil ou le même ?',
      story: 'Deux élèves rendent la même liste de mots. Pareille… mais est-ce <b>le même</b> objet ? Le jury veut les deux réponses.',
      goal: 'Lis deux lignes en listes <code>a</code> et <code>b</code> ; <code>c</code> est un alias de <code>a</code>. Affiche <code>a == b</code>, <code>a is b</code> et <code>a is c</code> (un par ligne). Pour deux lignes identiques :<pre>True\nFalse\nTrue</pre>',
      lesson: '<p><code>==</code> compare le <b>contenu</b> : mêmes éléments dans le même ordre.</p>' +
        '<p><code>is</code> compare l’<b>identité</b> : est-ce le même objet en mémoire ? Deux listes construites séparément ne sont jamais le même objet, même si elles se ressemblent.</p>',
      starter: 'a = input().split()\nb = input().split()\nc = a\nprint(a == b)\n# TODO : affiche a is b, puis a is c\n',
      stdin: 'x y\nx y\n',
      solution: 'a = input().split()\nb = input().split()\nc = a\nprint(a == b)\nprint(a is b)\nprint(a is c)\n',
      hints: ['print(a is b)', 'print(a is c)'],
      tests: [{ stdin: 'x y\nx y\n', expect: 'True\nFalse\nTrue\n' }, { stdin: 'x\ny\n', expect: 'False\nFalse\nTrue\n' }],
      rules: { mustSrc: [{ re: '\\bis\\s+b\\b', msg: 'Utilise l’opérateur is pour comparer a et b.' }, { re: '\\bis\\s+c\\b', msg: 'Utilise l’opérateur is pour comparer a et c.' }] },
      scene: 'twins', sceneOpts: { a: 'a', b: 'b' }
    },
    {
      id: 'p8_3', ch: 8, ord: 3,
      title: 'La copie de secours',
      story: 'Le professeur ajoute un point bonus à chaque note, mais veut garder les notes d’origine pour l’administration. Problème : <code>original</code> change aussi !',
      goal: 'Corrige la ligne de sauvegarde pour que <code>original</code> soit une <b>vraie copie</b> (essaie la tranche <code>[:]</code>). Pour <code>12 15 20</code> :<pre>avant: [12, 15, 20]\napres: [13, 16, 20]</pre>(une note ne dépasse jamais 20).',
      lesson: '<p>Trois façons de copier une liste : <code>notes.copy()</code>, <code>list(notes)</code> ou la tranche complète <code>notes[:]</code>. Toutes créent un <b>nouvel objet</b> sur le tas.</p>',
      starter: 'notes = [int(x) for x in input().split()]\noriginal = notes      # sauvegarde... ?\nfor i in range(len(notes)):\n    notes[i] = min(notes[i] + 1, 20)\nprint(f"avant: {original}")\nprint(f"apres: {notes}")\n',
      stdin: '12 15 20\n',
      solution: 'notes = [int(x) for x in input().split()]\noriginal = notes[:]\nfor i in range(len(notes)):\n    notes[i] = min(notes[i] + 1, 20)\nprint(f"avant: {original}")\nprint(f"apres: {notes}")\n',
      hints: ['original = notes ne crée pas de nouvelle liste.', 'original = notes[:]'],
      tests: [{ stdin: '12 15 20\n', expect: 'avant: [12, 15, 20]\napres: [13, 16, 20]\n' }, { stdin: '0 19\n', expect: 'avant: [0, 19]\napres: [1, 20]\n' }],
      rules: {},
      scene: 'twins', sceneOpts: { a: 'original', b: 'notes' }
    },
    {
      id: 'p8_4', ch: 8, ord: 4,
      title: 'Les soldes de la boutique',
      story: 'C’est les soldes : tous les prix sont divisés par deux. La fonction <code>solder</code> fabrique bien une liste soldée… mais dans son cadre, et la perd en sortant.',
      goal: 'Modifie <code>solder(prix)</code> pour qu’elle change la liste <b>sur place</b> (case par case), sans <code>return</code>. Pour <code>10 25 8</code> :<pre>[5, 12, 4]</pre>(division entière <code>//</code>).',
      lesson: '<p>Quand on passe une liste à une fonction, le paramètre est une <b>étiquette de plus</b> sur le même objet. <code>prix[i] = …</code> modifie cet objet : l’appelant voit le changement.</p>' +
        '<p>Mais <code>prix = [ … ]</code> recolle seulement l’étiquette locale sur une nouvelle liste : l’objet de l’appelant ne bouge pas.</p>',
      starter: 'def solder(prix):\n    prix = [p // 2 for p in prix]    # nouvelle liste, perdue en sortant\n\nprix = [int(x) for x in input().split()]\nsolder(prix)\nprint(prix)\n',
      stdin: '10 25 8\n',
      solution: 'def solder(prix):\n    for i in range(len(prix)):\n        prix[i] = prix[i] // 2\n\nprix = [int(x) for x in input().split()]\nsolder(prix)\nprint(prix)\n',
      hints: ['Parcours les indices : for i in range(len(prix)):', 'prix[i] = prix[i] // 2'],
      tests: [{ stdin: '10 25 8\n', expect: '[5, 12, 4]\n' }, { stdin: '100\n', expect: '[50]\n' }, { stdin: '3 1 7 40\n', expect: '[1, 0, 3, 20]\n' }],
      rules: { mustCall: ['solder'], forbidSrc: [{ re: '\\breturn\\b', msg: 'Pas de return : modifie la liste sur place.' }, { re: 'prix\\s*=\\s*solder', msg: 'Pas besoin de récupérer un résultat : la liste est modifiée sur place.' }] }
    },
    {
      id: 'p8_5', ch: 8, ord: 5,
      title: 'Le classement qui abîme tout',
      story: 'Le secrétariat veut la liste des inscrits dans l’ordre d’arrivée <b>et</b> dans l’ordre alphabétique. Mais la fonction <code>trier</code> mélange aussi la liste d’origine !',
      goal: 'Corrige <code>trier(liste)</code> pour qu’elle renvoie une liste triée <b>sans modifier</b> celle qu’on lui donne. Pour <code>zoe ada max</code> :<pre>inscrits: zoe ada max\nalphabetique: ada max zoe</pre>',
      lesson: '<p><code>liste.sort()</code> trie <b>sur place</b> : l’objet de l’appelant est modifié. <code>sorted(liste)</code> renvoie une <b>nouvelle</b> liste triée et laisse l’originale tranquille.</p>' +
        '<p>Autre solution : copier d’abord, puis trier la copie.</p>',
      starter: 'def trier(liste):\n    liste.sort()\n    return liste\n\nnoms = input().split()\nclasse = trier(noms)\nprint("inscrits: " + " ".join(noms))\nprint("alphabetique: " + " ".join(classe))\n',
      stdin: 'zoe ada max\n',
      solution: 'def trier(liste):\n    copie = liste.copy()\n    copie.sort()\n    return copie\n\nnoms = input().split()\nclasse = trier(noms)\nprint("inscrits: " + " ".join(noms))\nprint("alphabetique: " + " ".join(classe))\n',
      hints: ['Trie une copie, pas la liste reçue.', 'copie = liste.copy() ; copie.sort() ; return copie — ou return sorted(liste)'],
      tests: [{ stdin: 'zoe ada max\n', expect: 'inscrits: zoe ada max\nalphabetique: ada max zoe\n' }, { stdin: 'linus grace\n', expect: 'inscrits: linus grace\nalphabetique: grace linus\n' }],
      rules: { mustCall: ['trier'] },
      scene: 'twins', sceneOpts: { a: 'noms', b: 'classe' }
    },
    {
      id: 'p8_6', ch: 8, ord: 6,
      title: 'Le parking du campus',
      story: 'Le parking a 3 rangées de 4 places. Le gardien le représente par une <b>liste de listes</b> : une liste par rangée.',
      goal: 'Lis n puis n lignes <code>rangee place</code> et marque chaque voiture d’un <code>X</code> dans <code>grille</code>. Affiche ensuite les rangées. Pour (0, 1) et (2, 3) :<pre>.X..\n....\n...X</pre>',
      lesson: '<p><code>grille[r]</code> est la liste de la rangée r ; <code>grille[r][p]</code> est la case p de cette rangée.</p>' +
        '<pre>grille = [["."] * 4 for r in range(3)]   # 3 rangées DISTINCTES</pre>' +
        '<p><code>"".join(rangee)</code> colle les cases d’une rangée en un seul texte.</p>',
      starter: 'grille = [["."] * 4 for r in range(3)]\nn = int(input())\nfor k in range(n):\n    r, p = [int(x) for x in input().split()]\n    # TODO : marque la place\n\nfor rangee in grille:\n    print("".join(rangee))\n',
      stdin: '2\n0 1\n2 3\n',
      solution: 'grille = [["."] * 4 for r in range(3)]\nn = int(input())\nfor k in range(n):\n    r, p = [int(x) for x in input().split()]\n    grille[r][p] = "X"\n\nfor rangee in grille:\n    print("".join(rangee))\n',
      hints: ['Deux paires de crochets : d’abord la rangée, puis la place.', 'grille[r][p] = "X"'],
      tests: [{ stdin: '2\n0 1\n2 3\n', expect: '.X..\n....\n...X\n' }, { stdin: '3\n1 0\n1 1\n0 3\n', expect: '...X\nXX..\n....\n' }, { stdin: '0\n', expect: '....\n....\n....\n' }],
      rules: {}
    },
    {
      id: 'p8_7', ch: 8, ord: 7,
      title: 'Le piège de la salle de cinéma',
      story: 'Le stagiaire a construit le plan de la salle avec <code>[["."] * 4] * 3</code>. Résultat : quand un spectateur s’assoit, il apparaît dans <b>toutes</b> les rangées !',
      goal: 'Corrige la construction de <code>salle</code> pour que chaque rangée soit une liste <b>distincte</b>. Pour (1, 2) :<pre>....\n..X.\n....</pre>',
      lesson: '<p><code>[ligne] * 3</code> crée une liste contenant <b>trois fois la même référence</b> : les trois rangées sont le même objet ! Regarde la mémoire : trois flèches vers une seule liste.</p>' +
        '<p>La bonne façon fabrique une nouvelle liste à chaque tour :</p><pre>[["."] * 4 for r in range(3)]</pre>' +
        '<p>(<code>["."] * 4</code> ne pose pas de problème : les textes sont immuables.)</p>',
      starter: 'salle = [["."] * 4] * 3\nn = int(input())\nfor k in range(n):\n    r, p = [int(x) for x in input().split()]\n    salle[r][p] = "X"\n\nfor rangee in salle:\n    print("".join(rangee))\n',
      stdin: '1\n1 2\n',
      solution: 'salle = [["."] * 4 for r in range(3)]\nn = int(input())\nfor k in range(n):\n    r, p = [int(x) for x in input().split()]\n    salle[r][p] = "X"\n\nfor rangee in salle:\n    print("".join(rangee))\n',
      hints: ['Il faut créer une nouvelle rangée à chaque tour.', 'salle = [["."] * 4 for r in range(3)]'],
      tests: [{ stdin: '1\n1 2\n', expect: '....\n..X.\n....\n' }, { stdin: '2\n0 0\n2 3\n', expect: 'X...\n....\n...X\n' }],
      rules: { forbidSrc: [{ re: '\\]\\s*\\*\\s*3', msg: 'Plus de « ] * 3 » : chaque rangée doit être une liste distincte.' }] }
    },
    {
      id: 'p8_8', ch: 8, ord: 8,
      title: 'La copie trop superficielle',
      story: 'L’architecte garde un <code>modele</code> vierge de la salle et en fait une copie pour chaque événement. Il a pourtant utilisé <code>.copy()</code>… et le modèle se remplit quand même !',
      goal: 'Corrige la copie : <code>plan</code> doit avoir ses <b>propres rangées</b>. Le modèle reste vierge. Pour (0, 1) :<pre>modele: [[0, 0, 0], [0, 0, 0]]\nplan: [[0, 1, 0], [0, 0, 0]]</pre>',
      lesson: '<p><code>modele.copy()</code> est une copie <b>superficielle</b> : la nouvelle liste extérieure contient… les <b>mêmes</b> rangées intérieures.</p>' +
        '<p>Pour une liste de listes, il faut aussi copier chaque rangée :</p><pre>plan = [rangee.copy() for rangee in modele]</pre>',
      starter: 'modele = [[0, 0, 0], [0, 0, 0]]\nplan = modele.copy()      # copie... de la boîte extérieure seulement\nn = int(input())\nfor k in range(n):\n    r, c = [int(x) for x in input().split()]\n    plan[r][c] = 1\nprint(f"modele: {modele}")\nprint(f"plan: {plan}")\n',
      stdin: '1\n0 1\n',
      solution: 'modele = [[0, 0, 0], [0, 0, 0]]\nplan = [rangee.copy() for rangee in modele]\nn = int(input())\nfor k in range(n):\n    r, c = [int(x) for x in input().split()]\n    plan[r][c] = 1\nprint(f"modele: {modele}")\nprint(f"plan: {plan}")\n',
      hints: ['Chaque rangée de plan doit être une nouvelle liste.', 'plan = [rangee.copy() for rangee in modele]'],
      tests: [{ stdin: '1\n0 1\n', expect: 'modele: [[0, 0, 0], [0, 0, 0]]\nplan: [[0, 1, 0], [0, 0, 0]]\n' }, { stdin: '2\n1 2\n1 0\n', expect: 'modele: [[0, 0, 0], [0, 0, 0]]\nplan: [[0, 0, 0], [1, 0, 1]]\n' }],
      rules: { forbidSrc: [{ re: 'plan\\s*=\\s*\\[\\s*\\[\\s*0', msg: 'Copie le modèle au lieu de réécrire le plan à la main.' }] },
      scene: 'twins', sceneOpts: { a: 'modele', b: 'plan' }
    },
    {
      id: 'p8_9', ch: 8, ord: 9,
      title: 'Les réservations du théâtre',
      story: 'Le petit théâtre (2 rangées de 3 fauteuils) prend les réservations. La fonction <code>reserver</code> reçoit la salle et la modifie <b>sur place</b> ; elle renvoie aussi si ça a marché.',
      goal: 'Complète <code>reserver(salle, r, c)</code> : si le fauteuil est déjà <code>X</code>, renvoie <code>False</code> ; sinon pose un <code>X</code> et renvoie <code>True</code>. Puis complète <code>places_libres(salle)</code>.<pre>0 1: OK\n0 1: deja pris\n.X.\n...\nlibres: 5</pre>',
      lesson: '<p>Une fonction peut à la fois <b>modifier</b> un objet reçu (effet visible par l’appelant) et <b>renvoyer</b> une information.</p>' +
        '<p>Pour compter dans une liste de listes, il faut deux boucles imbriquées : une sur les rangées, une sur les cases.</p>',
      starter: 'def reserver(salle, r, c):\n    # TODO\n    return True\n\ndef places_libres(salle):\n    total = 0\n    # TODO : compte les "."\n    return total\n\nsalle = [["."] * 3 for r in range(2)]\nn = int(input())\nfor k in range(n):\n    r, c = [int(x) for x in input().split()]\n    if reserver(salle, r, c):\n        print(f"{r} {c}: OK")\n    else:\n        print(f"{r} {c}: deja pris")\n\nfor rangee in salle:\n    print("".join(rangee))\nprint(f"libres: {places_libres(salle)}")\n',
      stdin: '2\n0 1\n0 1\n',
      solution: 'def reserver(salle, r, c):\n    if salle[r][c] == "X":\n        return False\n    salle[r][c] = "X"\n    return True\n\ndef places_libres(salle):\n    total = 0\n    for rangee in salle:\n        for case in rangee:\n            if case == ".":\n                total += 1\n    return total\n\nsalle = [["."] * 3 for r in range(2)]\nn = int(input())\nfor k in range(n):\n    r, c = [int(x) for x in input().split()]\n    if reserver(salle, r, c):\n        print(f"{r} {c}: OK")\n    else:\n        print(f"{r} {c}: deja pris")\n\nfor rangee in salle:\n    print("".join(rangee))\nprint(f"libres: {places_libres(salle)}")\n',
      hints: ['if salle[r][c] == "X": return False', 'Sinon : salle[r][c] = "X" puis return True.', 'places_libres : for rangee in salle: for case in rangee: if case == ".": total += 1'],
      tests: [
        { stdin: '2\n0 1\n0 1\n', expect: '0 1: OK\n0 1: deja pris\n.X.\n...\nlibres: 5\n' },
        { stdin: '4\n1 0\n1 2\n0 0\n1 2\n', expect: '1 0: OK\n1 2: OK\n0 0: OK\n1 2: deja pris\nX..\nX.X\nlibres: 3\n' },
        { stdin: '0\n', expect: '...\n...\nlibres: 6\n' }
      ],
      rules: { mustCall: ['reserver', 'places_libres'], forbidSrc: [{ re: '\\.count\\(', msg: 'Compte les places avec des boucles, sans .count.' }] }
    },

    /* ===================== Chapitre 9 : algorithmes ===================== */
    {
      id: 'p9_1', ch: 9, ord: 1,
      title: 'Le badge perdu',
      story: 'La borne d’entrée cherche un badge dans la liste des inscrits, case après case : c’est la <b>recherche linéaire</b>.',
      goal: 'Écris <code>chercher(liste, x)</code> qui renvoie l’indice de x, ou <code>-1</code> s’il est absent, avec une boucle (sans <code>.index</code> ni <code>in</code> sur la liste). La 1<sup>re</sup> ligne donne les inscrits, puis n noms à chercher :<pre>ada: position 1\nbob: absent</pre>',
      lesson: '<p>Recherche linéaire : on regarde chaque case, de la première à la dernière. Dès qu’on trouve, <code>return i</code>. Si la boucle se termine, l’élément n’y est pas.</p>' +
        '<p>Dans le pire cas, on regarde toutes les cases : pour 1000 éléments, 1000 comparaisons.</p>',
      starter: 'def chercher(liste, x):\n    # TODO : parcours les indices\n    return -1\n\ninscrits = input().split()\nn = int(input())\nfor k in range(n):\n    nom = input()\n    i = chercher(inscrits, nom)\n    if i == -1:\n        print(f"{nom}: absent")\n    else:\n        print(f"{nom}: position {i}")\n',
      stdin: 'linus ada grace\n2\nada\nbob\n',
      solution: 'def chercher(liste, x):\n    for i in range(len(liste)):\n        if liste[i] == x:\n            return i\n    return -1\n\ninscrits = input().split()\nn = int(input())\nfor k in range(n):\n    nom = input()\n    i = chercher(inscrits, nom)\n    if i == -1:\n        print(f"{nom}: absent")\n    else:\n        print(f"{nom}: position {i}")\n',
      hints: ['for i in range(len(liste)):', 'if liste[i] == x: return i'],
      tests: [{ stdin: 'linus ada grace\n2\nada\nbob\n', expect: 'ada: position 1\nbob: absent\n' }, { stdin: 'zoe max zoe\n3\nzoe\nmax\nada\n', expect: 'zoe: position 0\nmax: position 1\nada: absent\n' }],
      rules: { mustCall: ['chercher'], forbidCall: ['index', 'find'], forbidSrc: [{ re: '\\bin\\s+(liste|inscrits)\\b', msg: 'Sans « in liste » : compare les cases une par une avec les indices.' }] }
    },
    {
      id: 'p9_2', ch: 9, ord: 2,
      title: 'Le plus petit colis',
      story: 'Le livreur charge d’abord le colis le plus léger. Trouve son poids et sa position, sans la fonction <code>min</code>.',
      goal: 'Lis une ligne de poids et affiche le plus petit et sa position (la première s’il y a égalité) :<pre>minimum: 2 (position 3)</pre>pour <code>7 5 9 2 4</code> (positions à partir de 0).',
      lesson: '<p>Recherche du minimum : on suppose que la case 0 est la plus petite, puis on parcourt les autres. Chaque fois qu’on trouve <b>strictement</b> plus petit, on retient la valeur et l’indice.</p>',
      starter: 'poids = [int(x) for x in input().split()]\npos = 0\n# TODO : cherche la position du plus petit\nprint(f"minimum: {poids[pos]} (position {pos})")\n',
      stdin: '7 5 9 2 4\n',
      solution: 'poids = [int(x) for x in input().split()]\npos = 0\nfor i in range(1, len(poids)):\n    if poids[i] < poids[pos]:\n        pos = i\nprint(f"minimum: {poids[pos]} (position {pos})")\n',
      hints: ['for i in range(1, len(poids)):', 'if poids[i] < poids[pos]: pos = i'],
      tests: [{ stdin: '7 5 9 2 4\n', expect: 'minimum: 2 (position 3)\n' }, { stdin: '3 8 3\n', expect: 'minimum: 3 (position 0)\n' }, { stdin: '10 -4\n', expect: 'minimum: -4 (position 1)\n' }],
      rules: { forbidCall: ['min', 'max', 'sorted', 'sort', 'index'] },
      scene: 'bars', sceneOpts: { v: 'poids', title: 'LIVRAISON · POIDS' }
    },
    {
      id: 'p9_3', ch: 9, ord: 3,
      title: 'La bulle qui remonte',
      story: 'Au bassin, les bulles d’air remontent à la surface. Dans le <b>tri à bulles</b>, un passage fait « remonter » le plus grand nombre tout au bout de la liste.',
      goal: 'Fais <b>un seul passage</b> : compare chaque case avec la suivante et échange-les si elles sont dans le mauvais ordre. Pour <code>5 1 4 2 8 3</code> :<pre>1 4 2 5 3 8</pre>',
      lesson: '<p>Échanger deux cases en Python :</p><pre>l[i], l[i + 1] = l[i + 1], l[i]</pre>' +
        '<p>Après un passage de gauche à droite, le plus grand élément est forcément arrivé à la fin.</p>',
      starter: 'l = [int(x) for x in input().split()]\nfor i in range(len(l) - 1):\n    pass  # TODO : échange l[i] et l[i + 1] si besoin\nprint(" ".join([str(x) for x in l]))\n',
      stdin: '5 1 4 2 8 3\n',
      solution: 'l = [int(x) for x in input().split()]\nfor i in range(len(l) - 1):\n    if l[i] > l[i + 1]:\n        l[i], l[i + 1] = l[i + 1], l[i]\nprint(" ".join([str(x) for x in l]))\n',
      hints: ['if l[i] > l[i + 1]:', 'l[i], l[i + 1] = l[i + 1], l[i]'],
      tests: [{ stdin: '5 1 4 2 8 3\n', expect: '1 4 2 5 3 8\n' }, { stdin: '9 8 7\n', expect: '8 7 9\n' }, { stdin: '1 2 3\n', expect: '1 2 3\n' }],
      rules: { forbidCall: ['sorted', 'sort', 'max'] },
      scene: 'bars', sceneOpts: { v: 'l', title: 'BASSIN · BULLES' }
    },
    {
      id: 'p9_4', ch: 9, ord: 4,
      title: 'Le tri à bulles complet',
      story: 'Un passage ne suffit pas toujours. Le maître-nageur veut ranger les nageurs par temps, en répétant les passages et en montrant la liste après chacun.',
      goal: 'Trie la liste avec le tri à bulles : <code>len(l) - 1</code> passages, et affiche la liste après chaque passage. Pour <code>4 3 2 1</code> :<pre>3 2 1 4\n2 1 3 4\n1 2 3 4</pre>',
      lesson: '<p>Le passage numéro p place le p-ième plus grand à sa place. Avec n éléments, n − 1 passages suffisent toujours.</p>' +
        '<p>On peut raccourcir chaque passage : la fin de la liste est déjà triée (<code>range(len(l) - 1 - p)</code>).</p>',
      starter: 'l = [int(x) for x in input().split()]\nfor p in range(len(l) - 1):\n    # TODO : un passage du tri à bulles\n    print(" ".join([str(x) for x in l]))\n',
      stdin: '4 3 2 1\n',
      solution: 'l = [int(x) for x in input().split()]\nfor p in range(len(l) - 1):\n    for i in range(len(l) - 1 - p):\n        if l[i] > l[i + 1]:\n            l[i], l[i + 1] = l[i + 1], l[i]\n    print(" ".join([str(x) for x in l]))\n',
      hints: ['Mets la boucle de la mission précédente à l’intérieur.', 'for i in range(len(l) - 1 - p): if l[i] > l[i + 1]: échange.'],
      tests: [{ stdin: '4 3 2 1\n', expect: '3 2 1 4\n2 1 3 4\n1 2 3 4\n' }, { stdin: '2 9 1\n', expect: '2 1 9\n1 2 9\n' }, { stdin: '5 6\n', expect: '5 6\n' }],
      rules: { forbidCall: ['sorted', 'sort', 'min', 'max'] },
      scene: 'bars', sceneOpts: { v: 'l', title: 'PISCINE · CHRONOS' }
    },
    {
      id: 'p9_5', ch: 9, ord: 5,
      title: 'Les phrases miroirs',
      story: 'Le club de lettres collectionne les phrases <b>palindromes</b> : « Esope reste ici et se repose ». On ignore les espaces, la ponctuation et les majuscules.',
      goal: 'Lis n puis n phrases. Pour chacune, garde seulement les lettres en minuscules et affiche <code>OUI</code> si elles se lisent pareil dans les deux sens, sinon <code>NON</code>.',
      lesson: '<p>On nettoie d’abord le texte :</p><pre>lettres = "".join([c.lower() for c in phrase if c.isalpha()])</pre>' +
        '<p>Puis on compare avec son inverse : la tranche <code>lettres[::-1]</code> parcourt le texte à l’envers.</p>',
      starter: 'n = int(input())\nfor k in range(n):\n    phrase = input()\n    lettres = phrase  # TODO : garde seulement les lettres, en minuscules\n    if lettres == lettres[::-1]:\n        print("OUI")\n    else:\n        print("NON")\n',
      stdin: '2\nEsope reste ici et se repose\nBonjour\n',
      solution: 'n = int(input())\nfor k in range(n):\n    phrase = input()\n    lettres = "".join([c.lower() for c in phrase if c.isalpha()])\n    if lettres == lettres[::-1]:\n        print("OUI")\n    else:\n        print("NON")\n',
      hints: ['c.isalpha() teste si c est une lettre, c.lower() la met en minuscule.', 'lettres = "".join([c.lower() for c in phrase if c.isalpha()])'],
      tests: [{ stdin: '2\nEsope reste ici et se repose\nBonjour\n', expect: 'OUI\nNON\n' }, { stdin: '3\nA man, a plan, a canal: Panama!\nRessasser\nTic tac\n', expect: 'OUI\nOUI\nNON\n' }],
      rules: {}
    },
    {
      id: 'p9_6', ch: 9, ord: 6,
      title: 'Le jeu des anagrammes',
      story: 'Au foyer, on joue aux <b>anagrammes</b> : deux mots formés des mêmes lettres, comme <i>chien</i> et <i>niche</i>. L’arbitre a besoin d’un programme.',
      goal: 'Lis n puis n lignes de deux mots. Affiche <code>a b: anagrammes</code> ou <code>a b: differents</code> (sans tenir compte des majuscules) :<pre>chien niche: anagrammes\nchat chien: differents</pre>',
      lesson: '<p>Astuce : deux mots sont anagrammes si leurs lettres <b>triées</b> sont identiques.</p><pre>sorted("niche")   # [\'c\', \'e\', \'h\', \'i\', \'n\']</pre>' +
        '<p><code>sorted</code> sur un texte renvoie la liste de ses caractères triés.</p>',
      starter: 'def anagrammes(a, b):\n    return False  # TODO\n\nn = int(input())\nfor k in range(n):\n    a, b = input().split()\n    if anagrammes(a, b):\n        print(f"{a} {b}: anagrammes")\n    else:\n        print(f"{a} {b}: differents")\n',
      stdin: '2\nchien niche\nchat chien\n',
      solution: 'def anagrammes(a, b):\n    return sorted(a.lower()) == sorted(b.lower())\n\nn = int(input())\nfor k in range(n):\n    a, b = input().split()\n    if anagrammes(a, b):\n        print(f"{a} {b}: anagrammes")\n    else:\n        print(f"{a} {b}: differents")\n',
      hints: ['Compare les lettres triées des deux mots.', 'return sorted(a.lower()) == sorted(b.lower())'],
      tests: [{ stdin: '2\nchien niche\nchat chien\n', expect: 'chien niche: anagrammes\nchat chien: differents\n' }, { stdin: '3\nMarie aimer\nballe bulle\nsoir rois\n', expect: 'Marie aimer: anagrammes\nballe bulle: differents\nsoir rois: anagrammes\n' }],
      rules: { mustCall: ['anagrammes'] }
    },
    {
      id: 'p9_7', ch: 9, ord: 7,
      title: 'La médiane du marathon',
      story: 'Au marathon du campus, la moyenne est faussée par un coureur très lent. Les statisticiens préfèrent la <b>médiane</b> : la valeur du milieu une fois les temps triés.',
      goal: 'Lis une ligne de temps, affiche la liste triée, la médiane (1 chiffre après la virgule) et l’étendue (max − min) :<pre>tri: 1 3 5 7 9\nmediane: 5.0\netendue: 8</pre>',
      lesson: '<p>Avec n valeurs triées dans <code>t</code> : si n est impair, la médiane est <code>t[n // 2]</code> ; si n est pair, c’est la moyenne des deux du milieu, <code>t[n // 2 - 1]</code> et <code>t[n // 2]</code>.</p>',
      starter: 'temps = [int(x) for x in input().split()]\nt = sorted(temps)\nn = len(t)\nprint("tri: " + " ".join([str(x) for x in t]))\nmed = t[0]  # TODO : calcule la médiane\nprint(f"mediane: {med:.1f}")\n# TODO : affiche l’étendue\n',
      stdin: '7 1 5 3 9\n',
      solution: 'temps = [int(x) for x in input().split()]\nt = sorted(temps)\nn = len(t)\nprint("tri: " + " ".join([str(x) for x in t]))\nif n % 2 == 1:\n    med = t[n // 2]\nelse:\n    med = (t[n // 2 - 1] + t[n // 2]) / 2\nprint(f"mediane: {med:.1f}")\nprint(f"etendue: {t[-1] - t[0]}")\n',
      hints: ['if n % 2 == 1: med = t[n // 2]', 'else: med = (t[n // 2 - 1] + t[n // 2]) / 2', 'La liste est triée : l’étendue est t[-1] - t[0].'],
      tests: [{ stdin: '7 1 5 3 9\n', expect: 'tri: 1 3 5 7 9\nmediane: 5.0\netendue: 8\n' }, { stdin: '4 1 3 2\n', expect: 'tri: 1 2 3 4\nmediane: 2.5\netendue: 3\n' }, { stdin: '42\n', expect: 'tri: 42\nmediane: 42.0\netendue: 0\n' }],
      rules: {},
      scene: 'bars', sceneOpts: { v: 't', title: 'MARATHON · TEMPS' }
    },
    {
      id: 'p9_8', ch: 9, ord: 8,
      title: 'Le chiffre de César',
      story: 'Jules César décalait chaque lettre de ses messages de quelques rangs dans l’alphabet. Le club d’espionnage veut un programme pour chiffrer ses messages secrets.',
      goal: 'Lis le décalage k puis le message (minuscules et espaces). Décale chaque lettre de k rangs (après <code>z</code> on revient à <code>a</code>), garde les espaces. Pour 3 et <code>bonjour le campus</code> :<pre>erqmrxu oh fdpsxv</pre>',
      lesson: '<p><code>ord("a")</code> donne le code d’un caractère (97), <code>chr(97)</code> fait l’inverse. Pour décaler en restant dans l’alphabet :</p>' +
        '<pre>rang = ord(c) - ord("a")          # 0 à 25\nnouveau = (rang + k) % 26\nchr(nouveau + ord("a"))</pre>',
      starter: 'def chiffrer(message, k):\n    res = ""\n    for c in message:\n        # TODO : décale les lettres, garde les espaces\n        res += c\n    return res\n\nk = int(input())\nprint(chiffrer(input(), k))\n',
      stdin: '3\nbonjour le campus\n',
      solution: 'def chiffrer(message, k):\n    res = ""\n    for c in message:\n        if c == " ":\n            res += c\n        else:\n            rang = ord(c) - ord("a")\n            res += chr((rang + k) % 26 + ord("a"))\n    return res\n\nk = int(input())\nprint(chiffrer(input(), k))\n',
      hints: ['Si c est une espace, ajoute-la telle quelle.', 'rang = ord(c) - ord("a")', 'res += chr((rang + k) % 26 + ord("a"))'],
      tests: [{ stdin: '3\nbonjour le campus\n', expect: 'erqmrxu oh fdpsxv\n' }, { stdin: '1\nzut\n', expect: 'avu\n' }, { stdin: '13\nhello world\n', expect: 'uryyb jbeyq\n' }],
      rules: { mustCall: ['chiffrer', 'ord', 'chr'] }
    },
    {
      id: 'p9_9', ch: 9, ord: 9,
      title: 'Casser le code',
      story: 'Le club d’espionnage a intercepté un message chiffré par César, sans la clé. Un indice : le message parle forcément du <code>campus</code>. Essaie toutes les clés !',
      goal: 'Lis le message chiffré. Essaie les décalages de 0 à 25 : déchiffre avec <code>dechiffrer(message, d)</code> et arrête-toi au premier texte qui contient <code>campus</code>. Affiche la clé puis le message clair :<pre>cle: 5\nrendez vous au campus</pre>',
      lesson: '<p>Déchiffrer avec la clé d, c’est chiffrer avec −d. En Python, <code>%</code> renvoie toujours un résultat positif : <code>(2 - 5) % 26</code> vaut 23.</p>' +
        '<p>Essayer toutes les possibilités s’appelle une <b>recherche exhaustive</b> (« force brute ») : avec 26 clés seulement, César ne résiste pas longtemps !</p>',
      starter: 'def dechiffrer(message, d):\n    res = ""\n    for c in message:\n        if c == " ":\n            res += c\n        else:\n            res += chr((ord(c) - ord("a") - d) % 26 + ord("a"))\n    return res\n\nmessage = input()\n# TODO : essaie toutes les clés\n',
      stdin: 'wjsije atzx fz hfruzx\n',
      solution: 'def dechiffrer(message, d):\n    res = ""\n    for c in message:\n        if c == " ":\n            res += c\n        else:\n            res += chr((ord(c) - ord("a") - d) % 26 + ord("a"))\n    return res\n\nmessage = input()\nfor d in range(26):\n    clair = dechiffrer(message, d)\n    if "campus" in clair:\n        print(f"cle: {d}")\n        print(clair)\n        break\n',
      hints: ['for d in range(26): clair = dechiffrer(message, d)', 'if "campus" in clair:', 'Affiche la clé et le texte, puis break.'],
      tests: [{ stdin: 'wjsije atzx fz hfruzx\n', expect: 'cle: 5\nrendez vous au campus\n' }, { stdin: 'fy wugjom ioply u bocn byolym\n', expect: 'cle: 20\nle campus ouvre a huit heures\n' }, { stdin: 'campus\n', expect: 'cle: 0\ncampus\n' }],
      rules: { mustCall: ['dechiffrer'] }
    },

    /* ===================== Chapitre 10 : récursion ===================== */
    {
      id: 'p10_1', ch: 10, ord: 1,
      title: 'Le compte à rebours',
      story: 'La fusée du club d’astronomie décolle. Le compte à rebours s’écrit avec une fonction qui… <b>s’appelle elle-même</b>.',
      goal: 'Complète <code>decompte(n)</code> : si n vaut 0, affiche <code>Decollage !</code> ; sinon affiche n puis appelle <code>decompte(n - 1)</code>. Pour 3 :<pre>3\n2\n1\nDecollage !</pre>',
      lesson: '<p>Une fonction <b>récursive</b> s’appelle elle-même sur un problème plus petit. Il lui faut un <b>cas de base</b> qui s’arrête sans se rappeler.</p>' +
        '<p>Avance pas à pas : à chaque appel, un nouveau cadre <code>decompte</code> s’empile, chacun avec <b>son propre</b> n.</p>',
      starter: 'def decompte(n):\n    if n == 0:\n        print("Decollage !")\n        return\n    print(n)\n    # TODO : appel récursif\n\ndecompte(int(input()))\n',
      stdin: '3\n',
      solution: 'def decompte(n):\n    if n == 0:\n        print("Decollage !")\n        return\n    print(n)\n    decompte(n - 1)\n\ndecompte(int(input()))\n',
      hints: ['La fonction se rappelle avec un n plus petit.', 'decompte(n - 1)'],
      tests: [{ stdin: '3\n', expect: '3\n2\n1\nDecollage !\n' }, { stdin: '0\n', expect: 'Decollage !\n' }, { stdin: '5\n', expect: '5\n4\n3\n2\n1\nDecollage !\n' }],
      rules: { mustCall: ['decompte'], forbidSrc: [{ re: '\\bfor\\b|\\bwhile\\b', msg: 'Pas de boucle : utilise la récursion.' }] },
      scene: 'rocket', sceneOpts: {}
    },
    {
      id: 'p10_2', ch: 10, ord: 2,
      title: 'La factorielle du pâtissier',
      story: 'Le pâtissier se demande de combien de façons il peut aligner n gâteaux dans sa vitrine. Réponse : <b>n!</b> (factorielle) = n × (n − 1) × … × 1.',
      goal: 'Écris <code>fact(n)</code> récursive : <code>fact(0)</code> vaut 1, et <code>fact(n) = n * fact(n - 1)</code>. Pour 5 :<pre>5! = 120</pre>',
      lesson: '<p>La définition mathématique se traduit directement :</p><pre>def fact(n):\n    if n == 0:\n        return 1           # cas de base\n    return n * fact(n - 1)</pre>' +
        '<p>Les cadres s’empilent jusqu’à <code>fact(0)</code>, puis les résultats remontent en se multipliant. Les entiers Python n’ont pas de limite : 20! tient sans problème.</p>',
      starter: 'def fact(n):\n    # TODO\n    return 1\n\nn = int(input())\nprint(f"{n}! = {fact(n)}")\n',
      stdin: '5\n',
      solution: 'def fact(n):\n    if n == 0:\n        return 1\n    return n * fact(n - 1)\n\nn = int(input())\nprint(f"{n}! = {fact(n)}")\n',
      hints: ['Cas de base : if n == 0: return 1', 'return n * fact(n - 1)'],
      tests: [{ stdin: '5\n', expect: '5! = 120\n' }, { stdin: '0\n', expect: '0! = 1\n' }, { stdin: '20\n', expect: '20! = 2432902008176640000\n' }],
      rules: { mustCall: ['fact'], forbidSrc: [{ re: '\\bfor\\b|\\bwhile\\b|import', msg: 'Pas de boucle : utilise la récursion.' }] }
    },
    {
      id: 'p10_3', ch: 10, ord: 3,
      title: 'La tirelire récursive',
      story: 'Le trésorier du BDE compte les pièces d’une tirelire : la somme d’une liste, c’est la première pièce plus la somme <b>du reste</b>.',
      goal: 'Écris <code>somme(l)</code> récursive, sans <code>sum</code> ni boucle : la somme d’une liste vide vaut 0. Pour <code>2 5 1</code> :<pre>total: 8</pre>',
      lesson: '<p><code>l[1:]</code> est la liste <b>sans son premier élément</b> (une nouvelle liste plus courte). Donc :</p><pre>somme([2, 5, 1]) = 2 + somme([5, 1])\n                 = 2 + 5 + somme([1])\n                 = 2 + 5 + 1 + somme([])</pre>',
      starter: 'def somme(l):\n    if len(l) == 0:\n        return 0\n    # TODO\n    return 0\n\npieces = [int(x) for x in input().split()]\nprint(f"total: {somme(pieces)}")\n',
      stdin: '2 5 1\n',
      solution: 'def somme(l):\n    if len(l) == 0:\n        return 0\n    return l[0] + somme(l[1:])\n\npieces = [int(x) for x in input().split()]\nprint(f"total: {somme(pieces)}")\n',
      hints: ['La première pièce est l[0], le reste est l[1:].', 'return l[0] + somme(l[1:])'],
      tests: [{ stdin: '2 5 1\n', expect: 'total: 8\n' }, { stdin: '\n', expect: 'total: 0\n' }, { stdin: '10 20 30 40\n', expect: 'total: 100\n' }],
      rules: { mustCall: ['somme'], forbidCall: ['sum'], forbidSrc: [{ re: '\\bwhile\\b|\\bfor\\b(?![^\\n]*input\\(\\))', msg: 'Pas de boucle dans somme : utilise la récursion.' }] }
    },
    {
      id: 'p10_4', ch: 10, ord: 4,
      title: 'La puissance des lapins',
      story: 'Au club de biologie, une colonie de lapins se multiplie par x chaque mois. Après n mois : x<sup>n</sup>. Calcule-le récursivement.',
      goal: 'Écris <code>puissance(x, n)</code> récursive, sans <code>**</code> ni <code>pow</code> : x<sup>0</sup> = 1 et x<sup>n</sup> = x × x<sup>n−1</sup>. Pour <code>2 10</code> :<pre>2^10 = 1024</pre>',
      lesson: '<p>Même schéma que la factorielle : un cas de base (<code>n == 0</code>), puis un appel sur un problème plus petit (<code>n - 1</code>).</p>' +
        '<p>Pour n = 10, combien de cadres s’empilent ? Compte-les dans la pile d’appels !</p>',
      starter: 'def puissance(x, n):\n    # TODO\n    return x\n\nx, n = [int(v) for v in input().split()]\nprint(f"{x}^{n} = {puissance(x, n)}")\n',
      stdin: '2 10\n',
      solution: 'def puissance(x, n):\n    if n == 0:\n        return 1\n    return x * puissance(x, n - 1)\n\nx, n = [int(v) for v in input().split()]\nprint(f"{x}^{n} = {puissance(x, n)}")\n',
      hints: ['if n == 0: return 1', 'return x * puissance(x, n - 1)'],
      tests: [{ stdin: '2 10\n', expect: '2^10 = 1024\n' }, { stdin: '3 0\n', expect: '3^0 = 1\n' }, { stdin: '5 3\n', expect: '5^3 = 125\n' }],
      rules: { mustCall: ['puissance'], forbidCall: ['pow'], forbidSrc: [{ re: '\\*\\*', msg: 'Sans ** : multiplie récursivement.' }, { re: '\\bwhile\\b|\\bfor\\b(?![^\\n]*input\\(\\))', msg: 'Pas de boucle : utilise la récursion.' }] }
    },
    {
      id: 'p10_5', ch: 10, ord: 5,
      title: 'Les lapins de Fibonacci',
      story: 'Fibonacci a étudié des lapins plus réalistes : chaque mois, le nombre de couples est la somme des deux mois précédents. 0, 1, 1, 2, 3, 5, 8…',
      goal: 'Écris <code>fib(n)</code> récursive : <code>fib(0) = 0</code>, <code>fib(1) = 1</code>, sinon <code>fib(n - 1) + fib(n - 2)</code>. Pour 10 :<pre>fib(10) = 55</pre>',
      lesson: '<p>Ici la fonction s’appelle <b>deux fois</b> : la pile d’appels dessine un arbre. <code>fib(10)</code> provoque 177 appels, car les mêmes valeurs sont recalculées encore et encore.</p>' +
        '<p>Il faut <b>deux</b> cas de base, sinon <code>fib(1)</code> appellerait <code>fib(-1)</code>…</p>',
      starter: 'def fib(n):\n    if n == 0:\n        return 0\n    # TODO\n    return 0\n\nn = int(input())\nprint(f"fib({n}) = {fib(n)}")\n',
      stdin: '10\n',
      solution: 'def fib(n):\n    if n == 0:\n        return 0\n    if n == 1:\n        return 1\n    return fib(n - 1) + fib(n - 2)\n\nn = int(input())\nprint(f"fib({n}) = {fib(n)}")\n',
      hints: ['Deuxième cas de base : if n == 1: return 1', 'return fib(n - 1) + fib(n - 2)'],
      tests: [{ stdin: '10\n', expect: 'fib(10) = 55\n' }, { stdin: '1\n', expect: 'fib(1) = 1\n' }, { stdin: '7\n', expect: 'fib(7) = 13\n' }],
      rules: { mustCall: ['fib'], forbidSrc: [{ re: '\\bfor\\b|\\bwhile\\b', msg: 'Pas de boucle : utilise la récursion.' }] }
    },
    {
      id: 'p10_6', ch: 10, ord: 6,
      title: 'Le miroir du clown',
      story: 'Le clown du festival lit tout à l’envers. Retourne un mot récursivement : l’inverse d’un mot, c’est l’inverse de la fin… suivi de la première lettre.',
      goal: 'Écris <code>inverse(s)</code> récursive, sans <code>[::-1]</code>, <code>reversed</code> ni boucle. Pour n mots :<pre>kayak -> kayak\npython -> nohtyp</pre>',
      lesson: '<pre>inverse("abc") = inverse("bc") + "a"\n              = inverse("c") + "b" + "a"\n              = inverse("") + "c" + "b" + "a"</pre>' +
        '<p>Cas de base : le mot vide est son propre inverse.</p>',
      starter: 'def inverse(s):\n    if s == "":\n        return ""\n    # TODO\n    return s\n\nn = int(input())\nfor k in range(n):\n    mot = input()\n    print(f"{mot} -> {inverse(mot)}")\n',
      stdin: '2\nkayak\npython\n',
      solution: 'def inverse(s):\n    if s == "":\n        return ""\n    return inverse(s[1:]) + s[0]\n\nn = int(input())\nfor k in range(n):\n    mot = input()\n    print(f"{mot} -> {inverse(mot)}")\n',
      hints: ['s[0] est la première lettre, s[1:] le reste du mot.', 'return inverse(s[1:]) + s[0]'],
      tests: [{ stdin: '2\nkayak\npython\n', expect: 'kayak -> kayak\npython -> nohtyp\n' }, { stdin: '2\nab\nrecursion\n', expect: 'ab -> ba\nrecursion -> noisrucer\n' }],
      rules: { mustCall: ['inverse'], forbidSrc: [{ re: '::\\s*-1|reversed|\\bwhile\\b', msg: 'Sans [::-1], reversed ni while : utilise la récursion.' }] }
    },
    {
      id: 'p10_7', ch: 10, ord: 7,
      title: 'Le dictionnaire géant',
      story: 'Pour trouver un mot dans un dictionnaire papier, tu l’ouvres au milieu, puis tu gardes la bonne moitié… C’est la <b>recherche dichotomique</b> : diviser pour régner.',
      goal: 'Écris <code>chercher(l, x, debut, fin)</code> récursive dans la liste <b>triée</b> l. Affiche chaque indice regardé (<code>regarde 3</code>), puis la position de x ou <code>absent</code>. Pour <code>1 3 5 7 9 11 13</code> et 11 :<pre>regarde 3\nregarde 5\nposition 5</pre>',
      lesson: '<p>On regarde <code>milieu = (debut + fin) // 2</code> : si c’est x, trouvé ; si <code>l[milieu] &lt; x</code>, on cherche à droite (<code>milieu + 1</code> à <code>fin</code>), sinon à gauche (<code>debut</code> à <code>milieu - 1</code>).</p>' +
        '<p>Cas de base : si <code>debut &gt; fin</code>, la zone est vide → <code>-1</code>. Pour 1 000 000 d’éléments, une vingtaine d’appels suffisent !</p>',
      starter: 'def chercher(l, x, debut, fin):\n    if debut > fin:\n        return -1\n    milieu = (debut + fin) // 2\n    print(f"regarde {milieu}")\n    # TODO : trouvé, à droite ou à gauche ?\n    return -1\n\nl = [int(v) for v in input().split()]\nx = int(input())\nres = chercher(l, x, 0, len(l) - 1)\nif res == -1:\n    print("absent")\nelse:\n    print(f"position {res}")\n',
      stdin: '1 3 5 7 9 11 13\n11\n',
      solution: 'def chercher(l, x, debut, fin):\n    if debut > fin:\n        return -1\n    milieu = (debut + fin) // 2\n    print(f"regarde {milieu}")\n    if l[milieu] == x:\n        return milieu\n    if l[milieu] < x:\n        return chercher(l, x, milieu + 1, fin)\n    return chercher(l, x, debut, milieu - 1)\n\nl = [int(v) for v in input().split()]\nx = int(input())\nres = chercher(l, x, 0, len(l) - 1)\nif res == -1:\n    print("absent")\nelse:\n    print(f"position {res}")\n',
      hints: ['if l[milieu] == x: return milieu', 'if l[milieu] < x: return chercher(l, x, milieu + 1, fin)', 'Sinon : return chercher(l, x, debut, milieu - 1)'],
      tests: [
        { stdin: '1 3 5 7 9 11 13\n11\n', expect: 'regarde 3\nregarde 5\nposition 5\n' },
        { stdin: '1 3 5 7 9 11 13\n4\n', expect: 'regarde 3\nregarde 1\nregarde 2\nabsent\n' },
        { stdin: '2 4 6 8\n2\n', expect: 'regarde 1\nregarde 0\nposition 0\n' }
      ],
      rules: { mustCall: ['chercher'], forbidCall: ['index'], forbidSrc: [{ re: '\\bwhile\\b|\\bfor\\b(?![^\\n]*input\\(\\))', msg: 'Pas de boucle : utilise la récursion.' }] }
    },
    {
      id: 'p10_8', ch: 10, ord: 8,
      title: 'La puissance rapide',
      story: 'Les lapins se multiplient trop vite : pour x<sup>100</sup>, ta fonction s’empile 101 fois. Astuce de mathématicien : x<sup>10</sup> = (x<sup>5</sup>)², donc on peut <b>diviser n par deux</b> à chaque appel.',
      goal: 'Réécris <code>puissance(x, n)</code> en utilisant <code>moitie = puissance(x, n // 2)</code> : si n est pair, renvoie <code>moitie * moitie</code>, sinon <code>moitie * moitie * x</code>. Le programme compte les appels :<pre>2^10 = 1024 en 5 appels</pre>',
      lesson: '<p><b>Diviser pour régner</b> : au lieu de réduire n de 1, on le divise par 2. Pour n = 10 : 10 → 5 → 2 → 1 → 0, soit 5 appels au lieu de 11.</p>' +
        '<p>Attention à n’appeler <code>puissance(x, n // 2)</code> qu’<b>une</b> fois, et à réutiliser le résultat rangé dans <code>moitie</code>.</p>',
      starter: 'appels = 0\n\ndef puissance(x, n):\n    global appels\n    appels += 1\n    if n == 0:\n        return 1\n    # TODO : version rapide avec n // 2\n    return x * puissance(x, n - 1)\n\nx, n = [int(v) for v in input().split()]\nr = puissance(x, n)\nprint(f"{x}^{n} = {r} en {appels} appels")\n',
      stdin: '2 10\n',
      solution: 'appels = 0\n\ndef puissance(x, n):\n    global appels\n    appels += 1\n    if n == 0:\n        return 1\n    moitie = puissance(x, n // 2)\n    if n % 2 == 0:\n        return moitie * moitie\n    return moitie * moitie * x\n\nx, n = [int(v) for v in input().split()]\nr = puissance(x, n)\nprint(f"{x}^{n} = {r} en {appels} appels")\n',
      hints: ['moitie = puissance(x, n // 2)', 'if n % 2 == 0: return moitie * moitie', 'Sinon : return moitie * moitie * x'],
      tests: [{ stdin: '2 10\n', expect: '2^10 = 1024 en 5 appels\n' }, { stdin: '3 13\n', expect: '3^13 = 1594323 en 5 appels\n' }, { stdin: '2 100\n', expect: '2^100 = 1267650600228229401496703205376 en 8 appels\n' }],
      rules: { mustCall: ['puissance'], forbidCall: ['pow'], forbidSrc: [{ re: '\\*\\*', msg: 'Sans ** : c’est toi qui calcules la puissance.' }] }
    },
    {
      id: 'p10_9', ch: 10, ord: 9,
      title: 'Les codes du cadenas',
      story: 'Le serrurier a oublié dans quel ordre mettre les lettres de son cadenas. Il veut essayer <b>toutes les permutations</b> : chaque ordre possible des lettres.',
      goal: 'Écris <code>permuter(prefixe, reste)</code> : si <code>reste</code> est vide, affiche <code>prefixe</code> ; sinon, pour chaque lettre de <code>reste</code>, ajoute-la au préfixe et permute les lettres restantes. Pour <code>abc</code> :<pre>abc\nacb\nbac\nbca\ncab\ncba</pre>',
      lesson: '<p>Pour lister les ordres de « abc » : on choisit la première lettre (a, b ou c), puis on liste les ordres des lettres <b>qui restent</b> — c’est le même problème, en plus petit !</p>' +
        '<pre>reste[:i] + reste[i + 1:]   # reste sans la lettre i</pre>' +
        '<p>Une boucle <b>et</b> un appel récursif dans la boucle : la pile monte et descend de nombreuses fois. n lettres donnent n! codes.</p>',
      starter: 'def permuter(prefixe, reste):\n    if reste == "":\n        print(prefixe)\n        return\n    # TODO : pour chaque lettre de reste...\n\npermuter("", input())\n',
      stdin: 'abc\n',
      solution: 'def permuter(prefixe, reste):\n    if reste == "":\n        print(prefixe)\n        return\n    for i in range(len(reste)):\n        permuter(prefixe + reste[i], reste[:i] + reste[i + 1:])\n\npermuter("", input())\n',
      hints: ['for i in range(len(reste)):', 'La lettre choisie est reste[i] ; les autres : reste[:i] + reste[i + 1:]', 'permuter(prefixe + reste[i], reste[:i] + reste[i + 1:])'],
      tests: [{ stdin: 'abc\n', expect: 'abc\nacb\nbac\nbca\ncab\ncba\n' }, { stdin: 'xy\n', expect: 'xy\nyx\n' }, { stdin: 'z\n', expect: 'z\n' }],
      rules: { mustCall: ['permuter'], forbidSrc: [{ re: 'import|permutations', msg: 'Écris la récursion toi-même.' }] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
