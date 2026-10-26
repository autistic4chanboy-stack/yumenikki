/* 42 ORIGINS — missions Python, chapitres 1 à 5 (missions 1 à 9) */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.py = O42.missions.py || [];
  O42.missions.py.push(

    /* ===================== Chapitre 1 · Afficher avec print ===================== */
    {
      id: 'p1_1', ch: 1, ord: 1,
      title: 'Le gardien du portail',
      scene: 'talk', sceneOpts: { who: 'robot', name: 'Gardien', expect: 'Campus ouvert\n', happy: 'Accès autorisé. Bonne journée !', wrong: 'Message incompris…', wait: '(le gardien attend le mot de passe)' },
      story: 'Le robot gardien du campus n’ouvre le portail que si on lui dit la bonne phrase.',
      goal: 'Affiche exactement :<pre>Campus ouvert⏎</pre>',
      lesson: '<p><code>print("…")</code> affiche le texte écrit entre guillemets, puis passe à la ligne tout seul.</p>' +
        '<p>Majuscules, espaces et accents comptent : le robot compare lettre par lettre.</p>',
      starter: 'print("Campus")\n',
      solution: 'print("Campus ouvert")\n',
      hints: ['Il manque un mot après « Campus ».', 'N’oublie pas l’espace entre les deux mots.', 'print("Campus ouvert")'],
      tests: [{ expect: 'Campus ouvert\n' }],
      rules: { mustCall: ['print'] }
    },
    {
      id: 'p1_2', ch: 1, ord: 2,
      title: 'Le menu de la cafétéria',
      story: 'Le chef de la cafétéria veut afficher son menu sur l’écran de l’entrée, une information par ligne.',
      goal: 'Affiche ces trois lignes :<pre>Menu du jour⏎Entree : soupe⏎Plat : pates⏎</pre>',
      lesson: '<p>Chaque appel à <code>print</code> écrit <b>une ligne</b>. Pour trois lignes, écris trois <code>print</code> l’un sous l’autre : Python les exécute de haut en bas.</p>',
      starter: 'print("Menu du jour")\n# TODO : l\'entree et le plat\n',
      solution: 'print("Menu du jour")\nprint("Entree : soupe")\nprint("Plat : pates")\n',
      hints: ['Ajoute deux lignes print(…) sous la première.', 'Attention aux espaces autour des deux-points.', 'print("Entree : soupe") puis print("Plat : pates")'],
      tests: [{ expect: 'Menu du jour\nEntree : soupe\nPlat : pates\n' }],
      rules: { mustCall: ['print'] }
    },
    {
      id: 'p1_3', ch: 1, ord: 3,
      title: 'Le panneau des salles',
      story: 'Le panneau du couloir indique quelle salle est libre. Le numéro est un <b>nombre</b>, pas un texte.',
      goal: 'Avec <b>un seul</b> <code>print</code> à trois arguments (un texte, le nombre <code>3</code>, un texte), affiche :<pre>Salle 3 libre⏎</pre>',
      lesson: '<p><code>print</code> accepte plusieurs <b>arguments</b> séparés par des virgules. Il les affiche l’un après l’autre, avec <b>un espace</b> entre chacun :</p><pre>print("Il y a", 12, "chaises")\n# Il y a 12 chaises</pre>' +
        '<p>Un nombre s’écrit sans guillemets : c’est un <code>int</code>.</p>',
      starter: 'print("Salle")\n',
      solution: 'print("Salle", 3, "libre")\n',
      hints: ['Sépare les morceaux par des virgules à l’intérieur des parenthèses.', 'L’espace est ajouté automatiquement : n’en mets pas dans les guillemets.', 'print("Salle", 3, "libre")'],
      tests: [{ expect: 'Salle 3 libre\n' }],
      rules: { mustSrc: [{ re: 'print\\(\\s*"Salle"\\s*,\\s*3\\s*,', msg: 'Utilise trois arguments : "Salle", le nombre 3, puis "libre".' }] }
    },
    {
      id: 'p1_4', ch: 1, ord: 4,
      title: 'La caisse du café',
      story: 'Trois cafés à 2 euros et un croissant à 1 euro. La caissière veut que Python fasse le calcul, pas toi.',
      goal: 'Affiche le total en écrivant le <b>calcul</b> <code>3 * 2 + 1</code> dans le <code>print</code> :<pre>Total : 7⏎</pre>Interdit d’écrire 7 toi-même.',
      lesson: '<p>Python calcule comme une calculatrice : <code>+</code>, <code>-</code>, <code>*</code> (multiplier). La multiplication passe avant l’addition, comme en maths.</p><pre>print(2 + 3 * 4)   # 14</pre>' +
        '<p>Le calcul est fait <b>avant</b> l’affichage : <code>print</code> reçoit déjà le résultat.</p>',
      starter: 'print("Total :")\n',
      solution: 'print("Total :", 3 * 2 + 1)\n',
      hints: ['Ajoute un deuxième argument au print, après une virgule.', 'Ce deuxième argument est le calcul lui-même, sans guillemets.', 'print("Total :", 3 * 2 + 1)'],
      tests: [{ expect: 'Total : 7\n' }],
      rules: { forbidSrc: [{ re: '\\b7\\b', msg: 'N’écris pas 7 : laisse Python calculer.' }], mustSrc: [{ re: '\\*', msg: 'Il faut une multiplication.' }] }
    },
    {
      id: 'p1_5', ch: 1, ord: 5,
      title: 'L’horloge du hall',
      story: 'L’horloge du hall affiche l’heure et la date, mais ses morceaux doivent être collés avec des <code>:</code> et des <code>/</code>, pas des espaces.',
      goal: 'Avec le paramètre <code>sep</code>, affiche :<pre>14:30⏎26/10/2026⏎</pre>Chaque nombre doit être un argument séparé.',
      lesson: '<p>Par défaut, <code>print</code> met un espace entre ses arguments. Le paramètre <code>sep</code> change ce séparateur :</p><pre>print(1, 2, 3, sep="-")   # 1-2-3\nprint("a", "b", sep="")   # ab</pre>',
      starter: 'print(14, 30)\nprint(26, 10, 2026)\n',
      solution: 'print(14, 30, sep=":")\nprint(26, 10, 2026, sep="/")\n',
      hints: ['Ajoute sep=":" à la fin du premier print, après une virgule.', 'Le second print utilise sep="/".', 'print(14, 30, sep=":")'],
      tests: [{ expect: '14:30\n26/10/2026\n' }],
      rules: { mustSrc: [{ re: 'sep\\s*=\\s*["\']:', msg: 'Utilise sep=":" pour l’heure.' }, { re: 'sep\\s*=\\s*["\']/', msg: 'Utilise sep="/" pour la date.' }], forbidSrc: [{ re: '["\'][^"\'\\n]*\\d[:/]\\d', msg: 'N’écris pas l’heure ou la date dans un seul texte : utilise sep.' }] }
    },
    {
      id: 'p1_6', ch: 1, ord: 6,
      title: 'Le départ de la course',
      story: 'Le starter de la course du campus annonce le départ, mais tout doit tenir sur <b>une seule ligne</b>, avec un <code>print</code> par mot.',
      goal: 'Avec quatre <code>print</code> et le paramètre <code>end</code>, affiche sur une seule ligne :<pre>3... 2... 1... Partez !⏎</pre>',
      lesson: '<p>Après ses arguments, <code>print</code> ajoute <code>end</code>, qui vaut par défaut <code>"\\n"</code> (le retour à la ligne). On peut le remplacer :</p><pre>print("A", end="")\nprint("B")\n# AB</pre>',
      starter: 'print("3...")\nprint("2...")\nprint("1...")\nprint("Partez !")\n',
      solution: 'print("3...", end=" ")\nprint("2...", end=" ")\nprint("1...", end=" ")\nprint("Partez !")\n',
      hints: ['Les trois premiers print ne doivent pas passer à la ligne.', 'end=" " remplace le retour à la ligne par un espace.', 'print("3...", end=" ") — pareil pour 2 et 1, le dernier reste normal.'],
      tests: [{ expect: '3... 2... 1... Partez !\n' }],
      rules: { mustSrc: [{ re: 'end\\s*=', msg: 'Utilise le paramètre end.' }], forbidSrc: [{ re: '["\'][^"\'\\n]*\\.\\.\\. *\\d', msg: 'Un print par nombre : utilise end au lieu de tout écrire d’un coup.' }] }
    },
    {
      id: 'p1_7', ch: 1, ord: 7,
      title: 'Le partage des cookies',
      story: 'La boulangerie offre 17 cookies à 5 étudiants. Chacun reçoit le même nombre, et le reste va au boulanger.',
      goal: 'Calcule avec <code>//</code> et <code>%</code> et affiche :<pre>Chacun : 3⏎Reste : 2⏎</pre>Interdit d’écrire 3 ou 2 toi-même.',
      lesson: '<p>Trois divisions en Python :</p><pre>17 / 5    # 3.4  (division « normale », nombre à virgule)\n17 // 5   # 3    (division entière)\n17 % 5    # 2    (reste, appelé « modulo »)</pre>',
      starter: 'print("Chacun :", 17 / 5)\nprint("Reste :")\n',
      solution: 'print("Chacun :", 17 // 5)\nprint("Reste :", 17 % 5)\n',
      hints: ['17 / 5 donne 3.4 : il faut la division entière.', 'Le reste s’obtient avec %.', 'print("Chacun :", 17 // 5) puis print("Reste :", 17 % 5)'],
      tests: [{ expect: 'Chacun : 3\nReste : 2\n' }],
      rules: { mustSrc: [{ re: '//', msg: 'Utilise la division entière //.' }, { re: '%', msg: 'Utilise le modulo %.' }], forbidSrc: [{ re: '\\b[23]\\b', msg: 'Laisse Python calculer 3 et 2.' }] }
    },
    {
      id: 'p1_8', ch: 1, ord: 8,
      title: 'Le club informatique',
      story: 'Le club informatique imprime sa fiche d’adhésion. Les nombres doivent être <b>calculés</b> : une puissance de 2 et un prix entre parenthèses.',
      goal: 'Affiche :<pre>1 Kio = 1024 octets⏎Prix : 30 euros⏎</pre>avec <code>2 ** 10</code> pour 1024 et <code>(4 + 6) * 3</code> pour 30. N’écris ni 1024 ni 30.',
      lesson: '<p><code>**</code> est la <b>puissance</b> : <code>2 ** 3</code> vaut 8.</p>' +
        '<p>Les <b>parenthèses</b> forcent l’ordre des calculs :</p><pre>4 + 6 * 3     # 22\n(4 + 6) * 3   # 30</pre>',
      starter: 'print("1 Kio =", 2 * 10, "octets")\nprint("Prix :", 4 + 6 * 3, "euros")\n',
      solution: 'print("1 Kio =", 2 ** 10, "octets")\nprint("Prix :", (4 + 6) * 3, "euros")\n',
      hints: ['2 * 10 vaut 20 : il faut la puissance **.', 'Sans parenthèses, 6 * 3 est calculé en premier.', 'print("Prix :", (4 + 6) * 3, "euros")'],
      tests: [{ expect: '1 Kio = 1024 octets\nPrix : 30 euros\n' }],
      rules: { mustSrc: [{ re: '\\*\\*', msg: 'Utilise la puissance **.' }, { re: '\\(\\s*4\\s*\\+\\s*6\\s*\\)', msg: 'Mets 4 + 6 entre parenthèses.' }], forbidSrc: [{ re: '1024|\\b30\\b', msg: 'Laisse Python calculer les nombres.' }] }
    },
    {
      id: 'p1_9', ch: 1, ord: 9,
      title: 'Le ticket de caisse',
      story: 'L’épicerie du campus imprime ses tickets. Il faut combiner tout ce que tu sais : plusieurs arguments, <code>sep</code>, <code>end</code> et un calcul.',
      goal: 'Affiche exactement :<pre>CAFE | CROISSANT | JUS⏎Total: 6 euros⏎</pre>Ligne 1 : <b>un</b> print à trois arguments avec <code>sep</code>.<br>Ligne 2 : <b>un</b> print avec les arguments <code>"Total"</code> et <code>2 + 1 + 3</code>, <code>sep=": "</code> et <code>end=" euros\\n"</code>.',
      lesson: '<p><code>sep</code> et <code>end</code> peuvent être utilisés <b>ensemble</b>, et contenir plusieurs caractères :</p><pre>print("a", "b", sep=" + ", end=" !\\n")\n# a + b !</pre>',
      starter: 'print("CAFE", "CROISSANT", "JUS")\nprint("Total", 2 + 1 + 3)\n',
      solution: 'print("CAFE", "CROISSANT", "JUS", sep=" | ")\nprint("Total", 2 + 1 + 3, sep=": ", end=" euros\\n")\n',
      hints: ['Ligne 1 : sep=" | " (avec un espace de chaque côté).', 'Ligne 2 : sep=": " colle « Total » et le nombre ; end=" euros\\n" termine la ligne.', 'print("Total", 2 + 1 + 3, sep=": ", end=" euros\\n")'],
      tests: [{ expect: 'CAFE | CROISSANT | JUS\nTotal: 6 euros\n' }],
      rules: { mustSrc: [{ re: 'sep\\s*=', msg: 'Utilise sep.' }, { re: 'end\\s*=', msg: 'Utilise end.' }], forbidSrc: [{ re: '\\b6\\b', msg: 'Laisse Python calculer le total.' }, { re: '["\'][^"\'\\n]*\\| C', msg: 'Ne colle pas les mots toi-même : utilise sep.' }] }
    },

    /* ===================== Chapitre 2 · Variables et textes ===================== */
    {
      id: 'p2_1', ch: 2, ord: 1,
      title: 'La boîte à badge',
      story: 'Le secrétariat imprime deux fois le nom d’Ada : une fois pour la porte, une fois pour le registre. Plutôt que de l’écrire deux fois, range-le dans une <b>variable</b>.',
      goal: 'Range <code>"Ada Lovelace"</code> dans la variable <code>badge</code>, puis affiche-la deux fois :<pre>Ada Lovelace⏎Ada Lovelace⏎</pre>Le nom ne doit être écrit qu’une seule fois dans ton code.',
      lesson: '<p>Une <b>variable</b> est un nom qui désigne une valeur :</p><pre>ville = "Paris"\nprint(ville)    # Paris</pre>' +
        '<p>Dans la vue mémoire, <code>ville</code> est une étiquette qui <b>pointe</b> vers l’objet str rangé sur le tas.</p>',
      starter: 'badge = ""\nprint(badge)\nprint(badge)\n',
      solution: 'badge = "Ada Lovelace"\nprint(badge)\nprint(badge)\n',
      hints: ['Mets le nom entre les guillemets de la première ligne.', 'badge = "Ada Lovelace"'],
      tests: [{ expect: 'Ada Lovelace\nAda Lovelace\n' }],
      rules: { mustSrc: [{ re: 'badge\\s*=\\s*"Ada Lovelace"', msg: 'Range le nom dans la variable badge.' }], forbidSrc: [{ re: 'Lovelace[\\s\\S]*Lovelace', msg: 'Écris le nom une seule fois : réutilise la variable.' }] }
    },
    {
      id: 'p2_2', ch: 2, ord: 2,
      title: 'Le stock de jus',
      story: 'La cafétéria a 10 bouteilles de jus. Le matin, on en vend 3, puis le livreur en apporte 5. La variable <code>stock</code> doit suivre.',
      goal: 'Mets à jour <code>stock</code> avec deux calculs (<code>stock - 3</code>, puis <code>stock + 5</code>) et affiche :<pre>Stock : 12⏎</pre>',
      lesson: '<p>Une variable peut <b>changer</b> de valeur. À droite du <code>=</code>, on utilise l’ancienne valeur :</p><pre>points = 4\npoints = points + 1   # points vaut 5</pre>' +
        '<p>Python calcule d’abord la droite, puis fait pointer le nom vers le résultat.</p>',
      starter: 'stock = 10\n# TODO : vente de 3, puis livraison de 5\nprint("Stock :", stock)\n',
      solution: 'stock = 10\nstock = stock - 3\nstock = stock + 5\nprint("Stock :", stock)\n',
      hints: ['stock = stock - 3', 'Puis stock = stock + 5, avant le print.'],
      tests: [{ expect: 'Stock : 12\n' }],
      rules: { forbidSrc: [{ re: '\\b12\\b', msg: 'Laisse Python calculer 12.' }], mustSrc: [{ re: 'stock\\s*=\\s*stock\\s*-', msg: 'Retire la vente : stock = stock - 3.' }, { re: 'stock\\s*=\\s*stock\\s*\\+', msg: 'Ajoute la livraison : stock = stock + 5.' }] }
    },
    {
      id: 'p2_3', ch: 2, ord: 3,
      title: 'Le registre des visiteurs',
      story: 'Grace Hopper visite le campus. Le registre veut son nom dans deux formats différents, fabriqués à partir de deux variables.',
      goal: 'Avec <code>+</code>, affiche :<pre>Grace Hopper⏎Hopper, Grace⏎</pre>en utilisant uniquement les variables <code>prenom</code> et <code>nom</code> (et des petits textes comme <code>" "</code> ou <code>", "</code>).',
      lesson: '<p>Le signe <code>+</code> entre deux textes les <b>colle</b> (concaténation) :</p><pre>a = "bon"\nb = "jour"\nprint(a + b)          # bonjour\nprint(a + " " + b)    # bon jour</pre>' +
        '<p>Le résultat est une <b>nouvelle</b> chaîne : <code>a</code> et <code>b</code> ne changent pas.</p>',
      starter: 'prenom = "Grace"\nnom = "Hopper"\nprint(prenom)\n',
      solution: 'prenom = "Grace"\nnom = "Hopper"\nprint(prenom + " " + nom)\nprint(nom + ", " + prenom)\n',
      hints: ['prenom + nom donne "GraceHopper" : il manque l’espace.', 'print(prenom + " " + nom)', 'Deuxième ligne : print(nom + ", " + prenom)'],
      tests: [{ expect: 'Grace Hopper\nHopper, Grace\n' }],
      rules: { mustSrc: [{ re: 'prenom\\s*\\+|\\+\\s*prenom', msg: 'Colle les variables avec +.' }], forbidSrc: [{ re: '(Grace|Hopper)[\\s\\S]*(Grace|Hopper)[\\s\\S]*(Grace|Hopper)', msg: 'N’écris les noms qu’une fois : utilise les variables.' }] }
    },
    {
      id: 'p2_4', ch: 2, ord: 4,
      title: 'Texte et nombre',
      story: 'La salle 42 est au 4e étage. L’accueil veut afficher les deux, mais <code>"Salle " + 42</code> fait planter Python : on ne colle pas un texte et un nombre !',
      goal: 'Avec <code>str()</code> et <code>+</code>, affiche :<pre>Salle 42, etage 4⏎</pre>L’étage se calcule : <code>salle // 10</code>.',
      lesson: '<p><code>"a" + 1</code> provoque une <b>TypeError</b> : Python refuse de deviner. <code>str(42)</code> fabrique le texte <code>"42"</code>, que l’on peut coller :</p><pre>age = 19\nprint("J\'ai " + str(age) + " ans")</pre>',
      starter: 'salle = 42\nprint("Salle " + "?")\n',
      solution: 'salle = 42\nprint("Salle " + str(salle) + ", etage " + str(salle // 10))\n',
      hints: ['str(salle) donne "42".', 'L’étage : str(salle // 10).', 'print("Salle " + str(salle) + ", etage " + str(salle // 10))'],
      tests: [{ expect: 'Salle 42, etage 4\n' }],
      rules: { mustCall: ['str'], forbidSrc: [{ re: 'Salle 4|etage 4|\\b4\\b', msg: 'N’écris pas les numéros dans les textes : utilise str() et le calcul.' }] }
    },
    {
      id: 'p2_5', ch: 2, ord: 5,
      title: 'La règle des indices',
      scene: 'ruler', sceneOpts: { v: 'mot', i: 'i' },
      story: 'Le professeur de Python cache un message dans le mot <code>PYTHON</code> : la première lettre, la dernière, puis celle d’indice 2.',
      goal: 'En lisant les cases de <code>mot</code>, affiche :<pre>P⏎N⏎T⏎</pre>',
      lesson: '<p>Chaque lettre d’une chaîne a un <b>indice</b>, qui commence à <b>0</b> :</p><pre>mot = "CHAT"\nmot[0]    # "C"\nmot[3]    # "T"\nmot[-1]   # "T" (en partant de la fin)</pre>',
      starter: 'mot = "PYTHON"\ni = 0\nprint(mot[i])\n',
      solution: 'mot = "PYTHON"\ni = 0\nprint(mot[i])\ni = -1\nprint(mot[i])\ni = 2\nprint(mot[i])\n',
      hints: ['La dernière lettre est mot[-1].', 'T est à l’indice 2 (P=0, Y=1, T=2).', 'print(mot[-1]) puis print(mot[2])'],
      tests: [{ expect: 'P\nN\nT\n' }],
      rules: { forbidSrc: [{ re: 'print\\(\\s*["\']', msg: 'Lis les lettres dans mot, ne les écris pas toi-même.' }] }
    },
    {
      id: 'p2_6', ch: 2, ord: 6,
      title: 'Le code du casier',
      story: 'Chaque casier porte un code comme <code>42-PARIS-2026</code>. Le gardien veut les trois morceaux séparément.',
      goal: 'Avec des <b>tranches</b> de <code>code</code>, affiche :<pre>42⏎PARIS⏎2026⏎</pre>',
      lesson: '<p>Une <b>tranche</b> <code>s[a:b]</code> donne les lettres de l’indice a jusqu’à b <b>exclu</b> :</p><pre>s = "BONJOUR"\ns[0:3]   # "BON"\ns[:3]    # "BON" (début omis = 0)\ns[3:]    # "JOUR" (fin omise = jusqu\'au bout)\ns[-4:]   # "JOUR"</pre>',
      starter: 'code = "42-PARIS-2026"\nprint(code)\n',
      solution: 'code = "42-PARIS-2026"\nprint(code[:2])\nprint(code[3:8])\nprint(code[-4:])\n',
      hints: ['Compte les indices : 4=0, 2=1, -=2, P=3…', 'PARIS va de l’indice 3 à 7 inclus, donc code[3:8].', 'Les 4 dernières lettres : code[-4:].'],
      tests: [{ expect: '42\nPARIS\n2026\n' }],
      rules: { forbidSrc: [{ re: 'print\\(\\s*["\']', msg: 'Utilise des tranches de code.' }], mustSrc: [{ re: 'code\\s*\\[[^\\]]*:', msg: 'Il faut des tranches (avec :).' }] }
    },
    {
      id: 'p2_7', ch: 2, ord: 7,
      title: 'L’annonce du haut-parleur',
      scene: 'sign', sceneOpts: { v: 'annonce', text: 'le cours de python commence' },
      story: 'Le haut-parleur répète l’annonce en criant (majuscules), puis une version corrigée. Mais l’annonce d’origine ne doit <b>pas</b> être abîmée.',
      goal: 'Affiche :<pre>LE COURS DE PYTHON COMMENCE⏎le cours de C commence⏎le cours de python commence⏎</pre>avec <code>upper()</code>, <code>replace()</code>, puis <code>annonce</code> elle-même.',
      lesson: '<p>Les <b>méthodes</b> s’appellent avec un point. Elles ne modifient pas la chaîne (immuable) : elles en <b>renvoient une nouvelle</b>.</p><pre>s = "salut"\ns.upper()               # "SALUT"\ns.replace("lu", "LU")   # "saLUt"\nprint(s)                # salut (inchangée)</pre>',
      starter: 'annonce = "le cours de python commence"\nprint(annonce)\n',
      solution: 'annonce = "le cours de python commence"\nprint(annonce.upper())\nprint(annonce.replace("python", "C"))\nprint(annonce)\n',
      hints: ['annonce.upper() renvoie la version en majuscules.', 'annonce.replace("python", "C")', 'Termine par print(annonce) : elle n’a pas changé.'],
      tests: [{ expect: 'LE COURS DE PYTHON COMMENCE\nle cours de C commence\nle cours de python commence\n' }],
      rules: { mustCall: ['upper', 'replace'], forbidSrc: [{ re: 'COURS|de C', msg: 'Laisse les méthodes fabriquer les nouvelles chaînes.' }] }
    },
    {
      id: 'p2_8', ch: 2, ord: 8,
      title: 'Le mot de passe masqué',
      story: 'L’écran de connexion n’affiche jamais le mot de passe : seulement sa longueur et autant d’étoiles que de lettres.',
      goal: 'Avec <code>len()</code>, affiche :<pre>8⏎********⏎</pre>Ton code doit marcher pour n’importe quel mot de passe (pas de 8 écrit à la main).',
      lesson: '<p><code>len(s)</code> renvoie le <b>nombre de caractères</b> de <code>s</code>.</p>' +
        '<p>Une chaîne multipliée par un entier se <b>répète</b> :</p><pre>"ab" * 3    # "ababab"</pre>',
      starter: 'mdp = "girafe42"\nprint(mdp)\n',
      solution: 'mdp = "girafe42"\nprint(len(mdp))\nprint("*" * len(mdp))\n',
      hints: ['print(len(mdp)) affiche la longueur.', '"*" * len(mdp) fabrique les étoiles.'],
      tests: [{ expect: '8\n********\n' }],
      rules: { mustCall: ['len'], forbidSrc: [{ re: '\\b8\\b|\\*\\*\\*', msg: 'Calcule la longueur avec len().' }, { re: 'print\\(\\s*mdp\\s*\\)', msg: 'N’affiche jamais le mot de passe !' }] }
    },
    {
      id: 'p2_9', ch: 2, ord: 9,
      title: 'Le login de Marie',
      story: 'Marie Curie arrive à 42 Origins. Son <b>login</b> est l’initiale de son prénom suivie de son nom ; sa carte affiche le prénom avec une majuscule et le nom en capitales.',
      goal: 'À partir de <code>prenom = "marie"</code> et <code>nom = "curie"</code>, affiche :<pre>Login : mcurie⏎Carte : Marie CURIE⏎Longueur : 6⏎</pre>Construis tout avec indices, tranches, <code>upper()</code>, <code>+</code> et <code>len()</code>.',
      lesson: '<p>On enchaîne les outils : <code>prenom[0]</code> est la première lettre, <code>prenom[0].upper()</code> la met en majuscule, <code>prenom[1:]</code> donne le reste.</p>' +
        '<p>Range les résultats dans des variables (<code>login</code>, <code>carte</code>) pour les réutiliser.</p>',
      starter: 'prenom = "marie"\nnom = "curie"\nlogin = ""\n# TODO : login et carte\nprint("Login : " + login)\n',
      solution: 'prenom = "marie"\nnom = "curie"\nlogin = prenom[0] + nom\ncarte = prenom[0].upper() + prenom[1:] + " " + nom.upper()\nprint("Login : " + login)\nprint("Carte : " + carte)\nprint("Longueur : " + str(len(login)))\n',
      hints: ['login = prenom[0] + nom', 'carte = prenom[0].upper() + prenom[1:] + " " + nom.upper()', 'print("Longueur : " + str(len(login)))'],
      tests: [{ expect: 'Login : mcurie\nCarte : Marie CURIE\nLongueur : 6\n' }],
      rules: { mustCall: ['upper', 'len'], forbidSrc: [{ re: 'mcurie|Marie|CURIE|\\b6\\b', msg: 'Construis les textes à partir de prenom et nom.' }] }
    },

    /* ===================== Chapitre 3 · Boucles ===================== */
    {
      id: 'p3_1', ch: 3, ord: 1,
      title: 'Le robot qui bipe',
      story: 'Le robot de ménage bipe trois fois avant de démarrer. Plutôt que trois <code>print</code>, utilise une boucle.',
      goal: 'Avec une boucle <code>for</code> et <b>un seul</b> <code>print</code>, affiche :<pre>Bip⏎Bip⏎Bip⏎</pre>',
      lesson: '<p><code>for i in range(n):</code> répète le bloc indenté <b>n fois</b> (i vaut 0, 1, …, n−1) :</p><pre>for i in range(2):\n    print("Coucou")\n# Coucou\n# Coucou</pre>' +
        '<p>Le bloc répété est défini par l’<b>indentation</b> (4 espaces).</p>',
      starter: 'for i in range(1):\n    print("Bip")\n',
      solution: 'for i in range(3):\n    print("Bip")\n',
      hints: ['range(1) ne fait qu’un tour.', 'for i in range(3):'],
      tests: [{ expect: 'Bip\nBip\nBip\n' }],
      rules: { mustSrc: [{ re: '\\bfor\\b', msg: 'Il faut une boucle for.' }], forbidSrc: [{ re: 'Bip[\\s\\S]*Bip', msg: 'Un seul print("Bip") : la boucle répète.' }] }
    },
    {
      id: 'p3_2', ch: 3, ord: 2,
      title: 'La file d’attente',
      story: 'Au guichet, l’écran appelle les tickets numéro 1 à 5, l’un après l’autre.',
      goal: 'Avec une boucle, affiche :<pre>Ticket 1⏎Ticket 2⏎Ticket 3⏎Ticket 4⏎Ticket 5⏎</pre>',
      lesson: '<p><code>range(debut, fin)</code> compte de <code>debut</code> jusqu’à <code>fin</code> <b>exclue</b> :</p><pre>for n in range(3, 6):\n    print(n)     # 3, 4, 5</pre>',
      starter: 'for n in range(5):\n    print("Ticket", n)\n',
      solution: 'for n in range(1, 6):\n    print("Ticket", n)\n',
      hints: ['range(5) donne 0, 1, 2, 3, 4 : on veut commencer à 1.', 'La fin est exclue : pour finir à 5, écris 6.', 'for n in range(1, 6):'],
      tests: [{ expect: 'Ticket 1\nTicket 2\nTicket 3\nTicket 4\nTicket 5\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: 'Ticket[\\s\\S]*Ticket', msg: 'Un seul print : la boucle fait le travail.' }] }
    },
    {
      id: 'p3_3', ch: 3, ord: 3,
      title: 'Les casiers pairs',
      story: 'Le concierge repeint seulement les casiers <b>pairs</b>, de 2 à 10.',
      goal: 'Avec <code>range</code> et un <b>pas</b>, affiche (sur une ligne chacun) :<pre>2⏎4⏎6⏎8⏎10⏎</pre>Sans <code>if</code>.',
      lesson: '<p>Le troisième argument de <code>range</code> est le <b>pas</b> :</p><pre>range(0, 10, 3)   # 0 3 6 9\nrange(5, 0, -1)   # 5 4 3 2 1</pre>',
      starter: 'for c in range(2, 11):\n    print(c)\n',
      solution: 'for c in range(2, 11, 2):\n    print(c)\n',
      hints: ['Il faut avancer de 2 en 2.', 'for c in range(2, 11, 2):'],
      tests: [{ expect: '2\n4\n6\n8\n10\n' }],
      rules: { mustSrc: [{ re: 'range\\([^)]*,[^)]*,', msg: 'Utilise range avec un pas (3 arguments).' }], forbidSrc: [{ re: '\\bif\\b', msg: 'Pas besoin de if : le pas suffit.' }] }
    },
    {
      id: 'p3_4', ch: 3, ord: 4,
      title: 'Le haricot magique',
      story: 'Au jardin du campus, un haricot de 1 cm <b>double</b> de taille chaque jour. On le récolte dès qu’il dépasse 50 cm.',
      goal: 'Avec une boucle <code>while</code>, affiche la taille chaque jour, puis <code>Recolte !</code> :<pre>Jour 1 : 2 cm⏎Jour 2 : 4 cm⏎…⏎Jour 6 : 64 cm⏎Recolte !⏎</pre>',
      lesson: '<p><code>while condition:</code> répète le bloc <b>tant que</b> la condition est vraie. On ne sait pas d’avance combien de tours il y aura.</p><pre>n = 1\nwhile n < 20:\n    n = n * 3\nprint(n)    # 27</pre>' +
        '<p>Attention : si rien ne change dans la boucle, elle ne s’arrête jamais !</p>',
      starter: 'taille = 1\njour = 0\nwhile taille < 50:\n    taille = taille * 2\n    # TODO : compter le jour et afficher\nprint("Recolte !")\n',
      solution: 'taille = 1\njour = 0\nwhile taille < 50:\n    taille = taille * 2\n    jour = jour + 1\n    print("Jour", jour, ":", taille, "cm")\nprint("Recolte !")\n',
      hints: ['Dans la boucle : jour = jour + 1.', 'Puis print("Jour", jour, ":", taille, "cm").'],
      tests: [{ expect: 'Jour 1 : 2 cm\nJour 2 : 4 cm\nJour 3 : 8 cm\nJour 4 : 16 cm\nJour 5 : 32 cm\nJour 6 : 64 cm\nRecolte !\n' }],
      rules: { mustSrc: [{ re: '\\bwhile\\b', msg: 'Utilise une boucle while.' }], forbidSrc: [{ re: '\\b64\\b', msg: 'Laisse la boucle calculer.' }] }
    },
    {
      id: 'p3_5', ch: 3, ord: 5,
      title: 'La tirelire',
      story: 'Chaque jour du mois, Léa met dans sa tirelire autant d’euros que le numéro du jour : 1 € le jour 1, 2 € le jour 2… jusqu’au jour 10.',
      goal: 'Avec une boucle et un <b>accumulateur</b>, affiche :<pre>Total : 55⏎</pre>Sans <code>sum</code> et sans écrire 55.',
      lesson: '<p>Un <b>accumulateur</b> est une variable qui démarre à 0 et grossit à chaque tour :</p><pre>total = 0\nfor x in range(1, 4):\n    total = total + x\n# total : 0 → 1 → 3 → 6</pre>' +
        '<p>Le <code>print</code> se place <b>après</b> la boucle (pas indenté) pour n’afficher que le résultat final.</p>',
      starter: 'total = 0\nfor jour in range(1, 11):\n    pass  # TODO\nprint("Total :", total)\n',
      solution: 'total = 0\nfor jour in range(1, 11):\n    total = total + jour\nprint("Total :", total)\n',
      hints: ['À chaque tour, ajoute jour à total.', 'total = total + jour (ou total += jour)'],
      tests: [{ expect: 'Total : 55\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: '\\b55\\b', msg: 'Laisse la boucle calculer.' }, { re: '\\bsum\\s*\\(', msg: 'Sans sum : fais l’accumulateur toi-même.' }] }
    },
    {
      id: 'p3_6', ch: 3, ord: 6,
      title: 'La table de 7',
      story: 'Le petit frère d’un étudiant révise sa table de 7. Imprime-la-lui, de 7 x 1 à 7 x 10.',
      goal: 'Avec une boucle, affiche :<pre>7 x 1 = 7⏎7 x 2 = 14⏎…⏎7 x 10 = 70⏎</pre>',
      lesson: '<p>La variable de boucle s’utilise dans les calculs :</p><pre>for i in range(1, 4):\n    print(i, "au carre :", i * i)</pre>',
      starter: 'for i in range(1, 11):\n    print("7 x", i)\n',
      solution: 'for i in range(1, 11):\n    print("7 x", i, "=", 7 * i)\n',
      hints: ['Ajoute les arguments "=" et 7 * i au print.', 'print("7 x", i, "=", 7 * i)'],
      tests: [{ expect: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: '\\b70\\b', msg: 'Laisse la boucle calculer.' }] }
    },
    {
      id: 'p3_7', ch: 3, ord: 7,
      title: 'L’escalier d’étoiles',
      story: 'Le club de dessin ASCII veut un escalier de 5 marches, fait d’étoiles.',
      goal: 'Avec une boucle et <code>"*" * i</code>, affiche :<pre>*⏎**⏎***⏎****⏎*****⏎</pre>',
      lesson: '<p>Rappel : <code>"*" * 3</code> donne <code>"***"</code>. Combiné à une boucle, on dessine des motifs :</p><pre>for i in range(1, 4):\n    print("#" * i)</pre>',
      starter: 'for i in range(1, 6):\n    print("*")\n',
      solution: 'for i in range(1, 6):\n    print("*" * i)\n',
      hints: ['Le nombre d’étoiles de la ligne est i.', 'print("*" * i)'],
      tests: [{ expect: '*\n**\n***\n****\n*****\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: '\\*\\*\\*', msg: 'Ne dessine pas les lignes à la main.' }] }
    },
    {
      id: 'p3_8', ch: 3, ord: 8,
      title: 'Le sapin du hall',
      story: 'Pour les fêtes, le hall veut un sapin de 4 étages centré. Chaque ligne a des espaces devant, puis un nombre <b>impair</b> d’étoiles.',
      goal: 'Avec une boucle, affiche (pas d’espace en fin de ligne) :<pre>   *⏎  ***⏎ *****⏎*******⏎</pre>',
      lesson: '<p>Pour la ligne <code>i</code> (de 1 à 4) d’un sapin de hauteur 4 : <code>4 - i</code> espaces, puis <code>2 * i - 1</code> étoiles. On colle les deux avec <code>+</code> :</p><pre>print(" " * 2 + "#" * 3)   #   ###</pre>',
      starter: 'n = 4\nfor i in range(1, n + 1):\n    print("*" * i)\n',
      solution: 'n = 4\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "*" * (2 * i - 1))\n',
      hints: ['Ligne 1 : 3 espaces et 1 étoile ; ligne 4 : 0 espace et 7 étoiles.', 'Espaces : " " * (n - i) ; étoiles : "*" * (2 * i - 1).', 'print(" " * (n - i) + "*" * (2 * i - 1))'],
      tests: [{ expect: '   *\n  ***\n *****\n*******\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: '\\*\\*\\*', msg: 'Ne dessine pas les lignes à la main.' }] }
    },
    {
      id: 'p3_9', ch: 3, ord: 9,
      title: 'La grande table',
      story: 'Le professeur de maths veut afficher au tableau les tables de 1 à 4, chacune sur une ligne : il faut une boucle <b>dans</b> une boucle.',
      goal: 'Avec deux boucles imbriquées, affiche :<pre>1 2 3 4⏎2 4 6 8⏎3 6 9 12⏎4 8 12 16⏎</pre>Pas d’espace en fin de ligne : construis chaque ligne dans une variable texte.',
      lesson: '<p>Une boucle peut en contenir une autre : pour chaque tour de la grande boucle, la petite fait <b>tous</b> ses tours.</p>' +
        '<p>Pour fabriquer une ligne morceau par morceau, on part d’un texte et on lui colle la suite :</p><pre>ligne = "1"\nfor j in range(2, 4):\n    ligne = ligne + " " + str(j)\nprint(ligne)    # 1 2 3</pre>',
      starter: 'for i in range(1, 5):\n    ligne = str(i)\n    # TODO : ajouter i*2, i*3, i*4\n    print(ligne)\n',
      solution: 'for i in range(1, 5):\n    ligne = str(i)\n    for j in range(2, 5):\n        ligne = ligne + " " + str(i * j)\n    print(ligne)\n',
      hints: ['Ajoute une boucle for j in range(2, 5): dans la première.', 'Dans cette boucle : ligne = ligne + " " + str(i * j)', 'Le print(ligne) reste dans la grande boucle, après la petite.'],
      tests: [{ expect: '1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16\n' }],
      rules: { mustSrc: [{ re: '\\b(for|while)\\b[^\\n]*\\n(\\s+[^\\n]*\\n)*?\\s+(for|while)\\b', msg: 'Il faut deux boucles imbriquées.' }], forbidSrc: [{ re: '\\b16\\b', msg: 'Laisse les boucles calculer.' }] }
    },

    /* ===================== Chapitre 4 · Lire l’entrée ===================== */
    {
      id: 'p4_1', ch: 4, ord: 1,
      title: 'Le perroquet',
      scene: 'mail', sceneOpts: { title: 'PERROQUET', parrot: true },
      story: 'Le perroquet de la bibliothèque répète tout ce qu’on lui dit. Apprends-lui à <b>lire</b> une phrase, puis à la répéter.',
      goal: 'Lis une ligne avec <code>input()</code> et affiche-la telle quelle. Exemple : entrée <code>Coco veut un biscuit</code> → <pre>Coco veut un biscuit⏎</pre>',
      lesson: '<p><code>input()</code> attend une ligne sur l’<b>entrée standard</b> et la renvoie sous forme de texte, <b>sans</b> le retour à la ligne final.</p><pre>phrase = input()\nprint(phrase)</pre>' +
        '<p>Change le texte de l’onglet <b>⌨ Entrée</b> pour tester : le juge essaiera plusieurs phrases.</p>',
      starter: 'phrase = input()\n# TODO : repete la phrase\n',
      stdin: 'Coco veut un biscuit\n',
      solution: 'phrase = input()\nprint(phrase)\n',
      hints: ['La phrase lue est rangée dans la variable phrase.', 'print(phrase)'],
      tests: [{ stdin: 'Coco veut un biscuit\n', expect: 'Coco veut un biscuit\n' }, { stdin: 'Bonjour 42\n', expect: 'Bonjour 42\n' }],
      rules: { mustCall: ['input', 'print'] }
    },
    {
      id: 'p4_2', ch: 4, ord: 2,
      title: 'L’imprimante à badges',
      story: 'L’imprimante à badges écrit le prénom de chaque nouvel arrivant en <b>majuscules</b>.',
      goal: 'Lis un prénom et affiche <code>BADGE : </code> suivi du prénom en majuscules. Exemple : <code>linus</code> → <pre>BADGE : LINUS⏎</pre>',
      lesson: '<p>Ce que renvoie <code>input()</code> est une chaîne comme les autres : toutes les méthodes du chapitre 2 marchent dessus.</p>',
      starter: 'prenom = input()\nprint("BADGE : " + prenom)\n',
      stdin: 'linus\n',
      solution: 'prenom = input()\nprint("BADGE : " + prenom.upper())\n',
      hints: ['prenom.upper() met en majuscules.', 'print("BADGE : " + prenom.upper())'],
      tests: [{ stdin: 'linus\n', expect: 'BADGE : LINUS\n' }, { stdin: 'Ada\n', expect: 'BADGE : ADA\n' }, { stdin: 'margaret\n', expect: 'BADGE : MARGARET\n' }],
      rules: { mustCall: ['input', 'upper'] }
    },
    {
      id: 'p4_3', ch: 4, ord: 3,
      title: 'La machine à doubler',
      story: 'La machine du labo double le nombre qu’on lui donne… mais elle affiche <code>2121</code> au lieu de <code>42</code> ! Lance le code de départ pour voir.',
      goal: 'Lis un nombre entier et affiche son double. Exemple : <code>21</code> → <pre>42⏎</pre>',
      lesson: '<p><code>input()</code> renvoie toujours du <b>texte</b>. Or <code>"21" * 2</code> répète le texte : <code>"2121"</code>.</p>' +
        '<p><code>int(texte)</code> le convertit en <b>entier</b> :</p><pre>n = int(input())   # "21" → 21\nprint(n * 2)       # 42</pre>',
      starter: 'n = input()\nprint(n * 2)\n',
      stdin: '21\n',
      solution: 'n = int(input())\nprint(n * 2)\n',
      hints: ['Le problème : n est un texte.', 'Entoure input() avec int( … ).', 'n = int(input())'],
      tests: [{ stdin: '21\n', expect: '42\n' }, { stdin: '-5\n', expect: '-10\n' }, { stdin: '1000\n', expect: '2000\n' }],
      rules: { mustCall: ['input', 'int'] }
    },
    {
      id: 'p4_4', ch: 4, ord: 4,
      title: 'L’addition du comptable',
      story: 'Le comptable du campus tape deux montants, un par ligne. Il veut voir l’opération complète.',
      goal: 'Lis deux entiers (deux lignes) et affiche l’addition. Exemple : <code>12</code> puis <code>30</code> → <pre>12 + 30 = 42⏎</pre>',
      lesson: '<p>Chaque appel à <code>input()</code> lit la <b>ligne suivante</b> :</p><pre>a = int(input())   # 1re ligne\nb = int(input())   # 2e ligne</pre>',
      starter: 'a = int(input())\n# TODO : lire b, puis afficher\n',
      stdin: '12\n30\n',
      solution: 'a = int(input())\nb = int(input())\nprint(a, "+", b, "=", a + b)\n',
      hints: ['b = int(input())', 'print(a, "+", b, "=", a + b)'],
      tests: [{ stdin: '12\n30\n', expect: '12 + 30 = 42\n' }, { stdin: '7\n-2\n', expect: '7 + -2 = 5\n' }, { stdin: '100\n250\n', expect: '100 + 250 = 350\n' }],
      rules: { mustCall: ['input', 'int'] }
    },
    {
      id: 'p4_5', ch: 4, ord: 5,
      title: 'Le chronomètre',
      story: 'Le chronomètre de la salle de sport compte en minutes. Les sportifs préfèrent lire des heures et des minutes.',
      goal: 'Lis un nombre de minutes et affiche-le en heures et minutes. Exemple : <code>125</code> → <pre>2 h 5 min⏎</pre>',
      lesson: '<p>Rappel du chapitre 1 : <code>//</code> donne le quotient entier, <code>%</code> le reste.</p><pre>125 // 60   # 2 (heures)\n125 % 60    # 5 (minutes restantes)</pre>',
      starter: 'total = int(input())\nprint(total, "min")\n',
      stdin: '125\n',
      solution: 'total = int(input())\nprint(total // 60, "h", total % 60, "min")\n',
      hints: ['Les heures : total // 60.', 'Les minutes : total % 60.', 'print(total // 60, "h", total % 60, "min")'],
      tests: [{ stdin: '125\n', expect: '2 h 5 min\n' }, { stdin: '60\n', expect: '1 h 0 min\n' }, { stdin: '59\n', expect: '0 h 59 min\n' }, { stdin: '1000\n', expect: '16 h 40 min\n' }],
      rules: { mustCall: ['input', 'int'], mustSrc: [{ re: '//', msg: 'Utilise //.' }, { re: '%', msg: 'Utilise %.' }] }
    },
    {
      id: 'p4_6', ch: 4, ord: 6,
      title: 'Le tapis de la caisse',
      scene: 'conveyor', sceneOpts: { title: 'CAISSE · TAPIS' },
      story: 'À la caisse, la première ligne indique combien d’articles arrivent sur le tapis, puis vient le prix de chacun, un par ligne.',
      goal: 'Lis le nombre d’articles <code>n</code>, puis <code>n</code> prix, et affiche leur somme. Exemple : <code>3</code>, <code>4</code>, <code>10</code>, <code>6</code> → <pre>Total : 20⏎</pre>',
      lesson: '<p>Un <code>input()</code> <b>dans une boucle</b> lit une nouvelle ligne à chaque tour :</p><pre>n = int(input())\nfor k in range(n):\n    ligne = input()\n    …</pre>',
      starter: 'n = int(input())\ntotal = 0\nfor k in range(n):\n    pass  # TODO : lire un prix et l\'ajouter\nprint("Total :", total)\n',
      stdin: '3\n4\n10\n6\n',
      solution: 'n = int(input())\ntotal = 0\nfor k in range(n):\n    prix = int(input())\n    total = total + prix\nprint("Total :", total)\n',
      hints: ['Dans la boucle : prix = int(input())', 'Puis total = total + prix'],
      tests: [{ stdin: '3\n4\n10\n6\n', expect: 'Total : 20\n' }, { stdin: '1\n99\n', expect: 'Total : 99\n' }, { stdin: '5\n1\n2\n3\n4\n5\n', expect: 'Total : 15\n' }, { stdin: '0\n', expect: 'Total : 0\n' }],
      rules: { mustCall: ['input', 'int'], mustSrc: [{ re: '\\b(for|while)\\b', msg: 'Il faut une boucle.' }] }
    },
    {
      id: 'p4_7', ch: 4, ord: 7,
      title: 'Les scores sur une ligne',
      story: 'Au tournoi de fléchettes, l’arbitre tape tous les scores d’un joueur <b>sur une seule ligne</b>, séparés par des espaces.',
      goal: 'Lis la ligne, découpe-la avec <code>split()</code> et affiche le nombre de lancers et la somme. Exemple : <code>12 5 8</code> → <pre>Lancers : 3⏎Somme : 25⏎</pre>',
      lesson: '<p><code>texte.split()</code> découpe un texte aux espaces et renvoie les morceaux (toujours des textes) :</p><pre>"12 5 8".split()   # ["12", "5", "8"]</pre>' +
        '<p>On peut parcourir les morceaux avec <code>for</code> et convertir chacun avec <code>int()</code>.</p>',
      starter: 'ligne = input()\nlancers = 0\nsomme = 0\nfor morceau in ligne.split():\n    pass  # TODO\nprint("Lancers :", lancers)\nprint("Somme :", somme)\n',
      stdin: '12 5 8\n',
      solution: 'ligne = input()\nlancers = 0\nsomme = 0\nfor morceau in ligne.split():\n    lancers = lancers + 1\n    somme = somme + int(morceau)\nprint("Lancers :", lancers)\nprint("Somme :", somme)\n',
      hints: ['À chaque morceau : lancers = lancers + 1.', 'morceau est un texte : somme = somme + int(morceau).'],
      tests: [{ stdin: '12 5 8\n', expect: 'Lancers : 3\nSomme : 25\n' }, { stdin: '60\n', expect: 'Lancers : 1\nSomme : 60\n' }, { stdin: '1 2 3 4 5 6\n', expect: 'Lancers : 6\nSomme : 21\n' }],
      rules: { mustCall: ['input', 'split', 'int'] }
    },
    {
      id: 'p4_8', ch: 4, ord: 8,
      title: 'Le rendu de monnaie',
      story: 'Le distributeur du foyer lit le prix puis la somme payée (en euros entiers). Il rend la monnaie en pièces de 2 € et de 1 €… s’il y a assez d’argent.',
      goal: 'Lis le prix puis le montant payé. S’il manque de l’argent, affiche <code>Pas assez</code>. Sinon, affiche par exemple pour <code>3</code> et <code>10</code> :<pre>Rendu : 7⏎Pieces de 2 : 3⏎Pieces de 1 : 1⏎</pre>',
      lesson: '<p><code>if</code> / <code>else</code> choisit quoi faire selon une condition :</p><pre>if paye < prix:\n    print("…")\nelse:\n    …</pre>' +
        '<p>Avec le rendu <code>r</code> : <code>r // 2</code> pièces de 2 €, et <code>r % 2</code> pièce de 1 €.</p>',
      starter: 'prix = int(input())\npaye = int(input())\nrendu = paye - prix\nprint("Rendu :", rendu)\n',
      stdin: '3\n10\n',
      solution: 'prix = int(input())\npaye = int(input())\nif paye < prix:\n    print("Pas assez")\nelse:\n    rendu = paye - prix\n    print("Rendu :", rendu)\n    print("Pieces de 2 :", rendu // 2)\n    print("Pieces de 1 :", rendu % 2)\n',
      hints: ['Commence par if paye < prix: print("Pas assez")', 'Dans le else : rendu // 2 pièces de 2 et rendu % 2 pièce de 1.'],
      tests: [{ stdin: '3\n10\n', expect: 'Rendu : 7\nPieces de 2 : 3\nPieces de 1 : 1\n' }, { stdin: '5\n5\n', expect: 'Rendu : 0\nPieces de 2 : 0\nPieces de 1 : 0\n' }, { stdin: '8\n5\n', expect: 'Pas assez\n' }, { stdin: '2\n10\n', expect: 'Rendu : 8\nPieces de 2 : 4\nPieces de 1 : 0\n' }],
      rules: { mustCall: ['input', 'int'], mustSrc: [{ re: '\\bif\\b', msg: 'Il faut un if pour le cas « Pas assez ».' }] }
    },
    {
      id: 'p4_9', ch: 4, ord: 9,
      title: 'La fiche d’inscription',
      story: 'Le bureau des inscriptions reçoit trois lignes : le prénom, la ville et l’âge. Il imprime une fiche avec les <b>f-strings</b>.',
      goal: 'Lis le prénom, la ville et l’âge, puis affiche, par exemple pour <code>Ada</code>, <code>Londres</code>, <code>36</code> :<pre>Ada (36 ans) habite a Londres⏎Dans 10 ans : 46 ans⏎</pre>',
      lesson: '<p>Une <b>f-string</b> commence par <code>f</code> ; ce qui est entre accolades est calculé puis inséré :</p><pre>x = 5\nprint(f"{x} au carre = {x * x}")   # 5 au carre = 25</pre>' +
        '<p>Plus besoin de <code>str()</code> ni de <code>+</code>.</p>',
      starter: 'prenom = input()\nville = input()\nage = input()\nprint(f"{prenom}")\n',
      stdin: 'Ada\nLondres\n36\n',
      solution: 'prenom = input()\nville = input()\nage = int(input())\nprint(f"{prenom} ({age} ans) habite a {ville}")\nprint(f"Dans 10 ans : {age + 10} ans")\n',
      hints: ['L’âge doit être un entier pour faire + 10 : age = int(input()).', 'print(f"{prenom} ({age} ans) habite a {ville}")', 'print(f"Dans 10 ans : {age + 10} ans")'],
      tests: [{ stdin: 'Ada\nLondres\n36\n', expect: 'Ada (36 ans) habite a Londres\nDans 10 ans : 46 ans\n' }, { stdin: 'Linus\nHelsinki\n21\n', expect: 'Linus (21 ans) habite a Helsinki\nDans 10 ans : 31 ans\n' }, { stdin: 'Grace\nNew York\n85\n', expect: 'Grace (85 ans) habite a New York\nDans 10 ans : 95 ans\n' }],
      rules: { mustCall: ['input', 'int'] }
    },

    /* ===================== Chapitre 5 · Listes ===================== */
    {
      id: 'p5_1', ch: 5, ord: 1,
      title: 'Le panier de fruits',
      story: 'Le marchand de fruits du campus range sa marchandise dans une <b>liste</b>. Il veut voir le panier entier, puis combien de fruits il contient.',
      goal: 'Crée la liste <code>panier</code> contenant <code>"pomme"</code>, <code>"poire"</code> et <code>"kiwi"</code>, puis affiche :<pre>[\'pomme\', \'poire\', \'kiwi\']⏎3⏎</pre>',
      lesson: '<p>Une <b>liste</b> s’écrit entre crochets, éléments séparés par des virgules :</p><pre>notes = [12, 15, 9]\nprint(notes)        # [12, 15, 9]\nprint(len(notes))   # 3</pre>' +
        '<p>Dans la vue mémoire, la liste est une rangée de cases qui <b>pointent</b> chacune vers un objet.</p>',
      starter: 'panier = []\nprint(panier)\n',
      solution: 'panier = ["pomme", "poire", "kiwi"]\nprint(panier)\nprint(len(panier))\n',
      hints: ['panier = ["pomme", "poire", "kiwi"]', 'Puis print(len(panier)).'],
      tests: [{ expect: '[\'pomme\', \'poire\', \'kiwi\']\n3\n' }],
      rules: { mustCall: ['len'], forbidSrc: [{ re: '\\b3\\b|print\\(\\s*["\']', msg: 'Affiche la liste elle-même et sa longueur avec len().' }] }
    },
    {
      id: 'p5_2', ch: 5, ord: 2,
      title: 'Les casiers modifiables',
      scene: 'bars', sceneOpts: { v: 'casiers', title: 'CASIERS' },
      story: 'Quatre casiers numérotés de 0 à 3. Contrairement aux chaînes, une liste est <b>modifiable</b> : on peut changer une case.',
      goal: 'Affiche le premier et le dernier élément de <code>casiers</code>, remplace la case 2 par <code>"Eve"</code>, puis affiche la liste :<pre>Ada⏎Dan⏎[\'Ada\', \'Bob\', \'Eve\', \'Dan\']⏎</pre>',
      lesson: '<p>Les indices des listes marchent comme ceux des chaînes : <code>l[0]</code>, <code>l[-1]</code>…</p>' +
        '<p>Mais une liste est <b>muable</b> : <code>l[1] = "x"</code> change la case 1 <b>sur place</b>. (Avec une chaîne, ce serait une TypeError.)</p>',
      starter: 'casiers = ["Ada", "Bob", "Cy", "Dan"]\nprint(casiers)\n',
      solution: 'casiers = ["Ada", "Bob", "Cy", "Dan"]\nprint(casiers[0])\nprint(casiers[-1])\ncasiers[2] = "Eve"\nprint(casiers)\n',
      hints: ['casiers[0] et casiers[-1].', 'casiers[2] = "Eve" remplace "Cy".', 'Termine par print(casiers).'],
      tests: [{ expect: 'Ada\nDan\n[\'Ada\', \'Bob\', \'Eve\', \'Dan\']\n' }],
      rules: { mustSrc: [{ re: 'casiers\\s*\\[\\s*2\\s*\\]\\s*=', msg: 'Modifie la case 2 : casiers[2] = "Eve".' }], forbidSrc: [{ re: 'print\\(\\s*["\']', msg: 'Lis les éléments dans la liste.' }] }
    },
    {
      id: 'p5_3', ch: 5, ord: 3,
      title: 'L’équipe de foot',
      story: 'Le capitaine recrute trois joueurs. Il lit leurs noms un par un et les ajoute à la liste <code>equipe</code>.',
      goal: 'Lis trois noms (un par ligne), ajoute-les avec <code>append</code>, puis affiche la liste. Exemple :<pre>[\'Zizou\', \'Mia\', \'Pele\']⏎</pre>',
      lesson: '<p><code>liste.append(x)</code> ajoute <code>x</code> <b>à la fin</b> de la liste, qui grandit :</p><pre>l = []\nl.append("a")   # ["a"]\nl.append("b")   # ["a", "b"]</pre>',
      starter: 'equipe = []\nfor k in range(3):\n    nom = input()\n    # TODO\nprint(equipe)\n',
      stdin: 'Zizou\nMia\nPele\n',
      solution: 'equipe = []\nfor k in range(3):\n    nom = input()\n    equipe.append(nom)\nprint(equipe)\n',
      hints: ['equipe.append(nom)'],
      tests: [{ stdin: 'Zizou\nMia\nPele\n', expect: '[\'Zizou\', \'Mia\', \'Pele\']\n' }, { stdin: 'A\nB\nC\n', expect: '[\'A\', \'B\', \'C\']\n' }],
      rules: { mustCall: ['append', 'input'] }
    },
    {
      id: 'p5_4', ch: 5, ord: 4,
      title: 'Les invités de la soirée',
      story: 'L’organisateur de la soirée a sa liste d’invités. À l’entrée, il accueille chacun personnellement.',
      goal: 'Parcours la liste <code>invites</code> avec <code>for</code> et affiche :<pre>Bienvenue Ada !⏎Bienvenue Linus !⏎Bienvenue Grace !⏎3 invites⏎</pre>',
      lesson: '<p><code>for x in liste:</code> donne chaque élément tour à tour, du premier au dernier :</p><pre>for fruit in ["pomme", "kiwi"]:\n    print(fruit)</pre>',
      starter: 'invites = ["Ada", "Linus", "Grace"]\n# TODO\n',
      solution: 'invites = ["Ada", "Linus", "Grace"]\nfor nom in invites:\n    print("Bienvenue", nom, "!")\nprint(len(invites), "invites")\n',
      hints: ['for nom in invites:', '    print("Bienvenue", nom, "!")', 'Après la boucle : print(len(invites), "invites")'],
      tests: [{ expect: 'Bienvenue Ada !\nBienvenue Linus !\nBienvenue Grace !\n3 invites\n' }],
      rules: { mustSrc: [{ re: 'for\\s+\\w+\\s+in\\s+invites', msg: 'Parcours la liste avec for … in invites.' }], forbidSrc: [{ re: 'Bienvenue[\\s\\S]*Bienvenue', msg: 'Un seul print de bienvenue : la boucle répète.' }, { re: '\\b3\\b', msg: 'Compte avec len().' }] }
    },
    {
      id: 'p5_5', ch: 5, ord: 5,
      title: 'Le bulletin de notes',
      scene: 'bars', sceneOpts: { v: 'notes', title: 'BULLETIN · NOTES' },
      story: 'Le professeur tape les notes d’un élève sur une ligne. Il veut la somme, la meilleure et la pire note.',
      goal: 'Lis la ligne, range chaque note (en entier) dans la liste <code>notes</code> avec <code>append</code>, puis affiche avec <code>sum</code>, <code>max</code> et <code>min</code>. Exemple : <code>12 15 9</code> →<pre>Somme : 36⏎Max : 15⏎Min : 9⏎</pre>',
      lesson: '<p>Python a des fonctions toutes prêtes pour les listes de nombres :</p><pre>sum([3, 8, 1])   # 12\nmax([3, 8, 1])   # 8\nmin([3, 8, 1])   # 1</pre>',
      starter: 'notes = []\nfor morceau in input().split():\n    notes.append(morceau)\nprint(notes)\n',
      stdin: '12 15 9\n',
      solution: 'notes = []\nfor morceau in input().split():\n    notes.append(int(morceau))\nprint("Somme :", sum(notes))\nprint("Max :", max(notes))\nprint("Min :", min(notes))\n',
      hints: ['Les morceaux sont des textes : notes.append(int(morceau)).', 'print("Somme :", sum(notes))', 'Même chose avec max(notes) et min(notes).'],
      tests: [{ stdin: '12 15 9\n', expect: 'Somme : 36\nMax : 15\nMin : 9\n' }, { stdin: '20\n', expect: 'Somme : 20\nMax : 20\nMin : 20\n' }, { stdin: '7 18 3 11 14\n', expect: 'Somme : 53\nMax : 18\nMin : 3\n' }],
      rules: { mustCall: ['append', 'sum', 'max', 'min'] }
    },
    {
      id: 'p5_6', ch: 5, ord: 6,
      title: 'La moyenne de la classe',
      story: 'Le conseil de classe veut la <b>moyenne</b> des notes, arrondie à un chiffre après la virgule, et le nombre d’élèves au-dessus de 10.',
      goal: 'Lis les notes (une ligne), puis affiche la moyenne avec une décimale et le nombre de notes ≥ 10. Exemple : <code>12 15 8 9</code> →<pre>Moyenne : 11.0⏎Au-dessus : 2⏎</pre>',
      lesson: '<p>La moyenne est <code>sum(notes) / len(notes)</code> (division normale : nombre à virgule).</p>' +
        '<p>Dans une f-string, <code>{x:.1f}</code> affiche <code>x</code> avec <b>1</b> chiffre après la virgule :</p><pre>m = 31 / 3\nprint(f"{m:.1f}")   # 10.3</pre>',
      starter: 'notes = []\nfor morceau in input().split():\n    notes.append(int(morceau))\n# TODO : moyenne et compte\n',
      stdin: '12 15 8 9\n',
      solution: 'notes = []\nfor morceau in input().split():\n    notes.append(int(morceau))\nmoyenne = sum(notes) / len(notes)\nprint(f"Moyenne : {moyenne:.1f}")\nnb = 0\nfor n in notes:\n    if n >= 10:\n        nb = nb + 1\nprint("Au-dessus :", nb)\n',
      hints: ['moyenne = sum(notes) / len(notes)', 'print(f"Moyenne : {moyenne:.1f}")', 'Pour compter : nb = 0, puis une boucle sur notes avec if n >= 10: nb = nb + 1.'],
      tests: [{ stdin: '12 15 8 9\n', expect: 'Moyenne : 11.0\nAu-dessus : 2\n' }, { stdin: '10 11 12\n', expect: 'Moyenne : 11.0\nAu-dessus : 3\n' }, { stdin: '5 7 9\n', expect: 'Moyenne : 7.0\nAu-dessus : 0\n' }, { stdin: '20 13 4\n', expect: 'Moyenne : 12.3\nAu-dessus : 2\n' }],
      rules: { mustCall: ['sum', 'len', 'append'] }
    },
    {
      id: 'p5_7', ch: 5, ord: 7,
      title: 'Le podium',
      scene: 'bars', sceneOpts: { v: 'scores', title: 'PODIUM' },
      story: 'Au tournoi de jeux vidéo, on ne garde que les trois meilleurs scores pour le podium.',
      goal: 'Lis les scores (une ligne, au moins 3), trie-les du plus grand au plus petit, puis affiche le podium. Exemple : <code>50 90 70 20</code> →<pre>1er : 90⏎2e : 70⏎3e : 50⏎</pre>',
      lesson: '<p><code>sorted(liste)</code> renvoie une <b>nouvelle</b> liste triée ; <code>liste.sort()</code> trie la liste <b>sur place</b>. Avec <code>reverse=True</code>, l’ordre est décroissant :</p><pre>sorted([3, 1, 2], reverse=True)   # [3, 2, 1]</pre>',
      starter: 'scores = []\nfor morceau in input().split():\n    scores.append(int(morceau))\n# TODO : trier\nprint("1er :", scores[0])\n',
      stdin: '50 90 70 20\n',
      solution: 'scores = []\nfor morceau in input().split():\n    scores.append(int(morceau))\nscores.sort(reverse=True)\nprint("1er :", scores[0])\nprint("2e :", scores[1])\nprint("3e :", scores[2])\n',
      hints: ['scores.sort(reverse=True) range du plus grand au plus petit.', 'Le podium : scores[0], scores[1], scores[2].'],
      tests: [{ stdin: '50 90 70 20\n', expect: '1er : 90\n2e : 70\n3e : 50\n' }, { stdin: '1 2 3\n', expect: '1er : 3\n2e : 2\n3e : 1\n' }, { stdin: '40 40 100 10 75\n', expect: '1er : 100\n2e : 75\n3e : 40\n' }],
      rules: { mustSrc: [{ re: 'sort', msg: 'Trie la liste (sort ou sorted).' }], forbidCall: ['max'] }
    },
    {
      id: 'p5_8', ch: 5, ord: 8,
      title: 'Le catalogue de la bibliothèque',
      story: 'La bibliothécaire cherche un livre dans le catalogue. Elle veut savoir s’il est présent, et à quelle <b>place</b> (en comptant à partir de 1).',
      goal: 'Lis un titre. S’il est dans <code>catalogue</code>, affiche <code>Place N</code> ; sinon <code>Absent</code>. Exemple : <code>Dune</code> → <pre>Place 3⏎</pre>',
      lesson: '<p><code>x in liste</code> vaut <code>True</code> si <code>x</code> est dans la liste.</p>' +
        '<p><code>liste.index(x)</code> renvoie l’indice de la première case égale à <code>x</code> (et plante s’il n’y est pas : vérifie avec <code>in</code> d’abord !).</p>',
      starter: 'catalogue = ["Candide", "Germinal", "Dune", "Neuromancien", "Fondation"]\ntitre = input()\nprint("Absent")\n',
      stdin: 'Dune\n',
      solution: 'catalogue = ["Candide", "Germinal", "Dune", "Neuromancien", "Fondation"]\ntitre = input()\nif titre in catalogue:\n    print("Place", catalogue.index(titre) + 1)\nelse:\n    print("Absent")\n',
      hints: ['if titre in catalogue:', 'catalogue.index(titre) commence à 0 : ajoute 1.', 'print("Place", catalogue.index(titre) + 1)'],
      tests: [{ stdin: 'Dune\n', expect: 'Place 3\n' }, { stdin: 'Candide\n', expect: 'Place 1\n' }, { stdin: 'Fondation\n', expect: 'Place 5\n' }, { stdin: 'Matilda\n', expect: 'Absent\n' }],
      rules: { mustCall: ['input'], mustSrc: [{ re: '\\bin\\s+catalogue|index|for\\b', msg: 'Cherche le titre dans la liste.' }] }
    },
    {
      id: 'p5_9', ch: 5, ord: 9,
      title: 'La station météo',
      scene: 'conveyor', sceneOpts: { title: 'MÉTÉO · RELEVÉS' },
      story: 'La station météo du toit envoie une température par ligne, jusqu’au mot <code>FIN</code>. Le climatologue veut les relevés triés et la liste des jours chauds.',
      goal: 'Lis les températures jusqu’à <code>FIN</code> (dans une liste), puis affiche la liste triée (croissante), les températures strictement supérieures à 20 (dans l’ordre d’arrivée) et le maximum. Exemple :<pre>Tri : [12, 18, 22, 25]⏎Chauds : [22, 25]⏎Max : 25⏎</pre>S’il n’y a aucun relevé, affiche seulement <code>Aucun releve</code>.',
      lesson: '<p>On peut fabriquer une deuxième liste en parcourant la première et en ne gardant que certains éléments :</p><pre>pairs = []\nfor n in nombres:\n    if n % 2 == 0:\n        pairs.append(n)</pre>' +
        '<p><code>max</code> d’une liste vide plante : teste d’abord <code>len(liste) == 0</code>.</p>',
      starter: 'temps = []\nligne = input()\nwhile ligne != "FIN":\n    # TODO\n    ligne = input()\nprint("Tri :", sorted(temps))\n',
      stdin: '22\n12\n25\n18\nFIN\n',
      solution: 'temps = []\nligne = input()\nwhile ligne != "FIN":\n    temps.append(int(ligne))\n    ligne = input()\nif len(temps) == 0:\n    print("Aucun releve")\nelse:\n    chauds = []\n    for t in temps:\n        if t > 20:\n            chauds.append(t)\n    print("Tri :", sorted(temps))\n    print("Chauds :", chauds)\n    print("Max :", max(temps))\n',
      hints: ['Dans la boucle : temps.append(int(ligne)).', 'Pour les chauds : une nouvelle liste vide, puis for t in temps: if t > 20: chauds.append(t).', 'Commence par if len(temps) == 0: print("Aucun releve"), et mets le reste dans le else.'],
      tests: [{ stdin: '22\n12\n25\n18\nFIN\n', expect: 'Tri : [12, 18, 22, 25]\nChauds : [22, 25]\nMax : 25\n' }, { stdin: '5\n-3\nFIN\n', expect: 'Tri : [-3, 5]\nChauds : []\nMax : 5\n' }, { stdin: 'FIN\n', expect: 'Aucun releve\n' }, { stdin: '30\n21\n20\n31\nFIN\n', expect: 'Tri : [20, 21, 30, 31]\nChauds : [30, 21, 31]\nMax : 31\n' }],
      rules: { mustCall: ['append', 'input'] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
