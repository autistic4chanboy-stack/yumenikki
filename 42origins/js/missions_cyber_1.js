/* =========================================================================
 *  42 ORIGINS — labos Cybersécurité chapitres 1-5 (ords 1-9)
 *  Tout est SIMULÉ et pédagogique. engine_cyber.js est la référence.
 *  Comprendre une faille pour savoir la corriger : chaque leçon finit par 🛡.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cyber = O42.missions.cyber || [];
  O42.missions.cyber.push(

    /* ============================================================= CHAPITRE 1
     *  Premiers réflexes — encodages, bases, lire une cible (crypto jouet).
     * ========================================================================= */
    {
      id: 'cyb1_1', ch: 1, ord: 1, title: 'ROT13, le classique', job: 'Chapitre 1 · Premiers réflexes', stars: 1, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'synt{ebg13_snpvyr}', plain: 'flag{rot13_facile}', flag: 'flag{rot13_facile}' },
      story: 'Première mission : un message te tombe sous la main, brouillé par ROT13 — un simple décalage de 13 lettres, le plus connu des « codes » faibles.',
      goal: 'Déchiffre <code>synt{ebg13_snpvyr}</code> et écris le texte clair dans l’éditeur. Le panneau de droite liste les 26 rotations : une seule donne un mot lisible.',
      lesson: '<p>ROT13 décale chaque lettre de 13 rangs. Comme 13 + 13 = 26, la même opération chiffre ET déchiffre.</p>' +
        '<p>Dans la colonne de droite, la ligne <code>+13</code> transforme <code>synt{</code> en… <code>flag{</code>. Recopie la ligne entière.</p>' +
        '<p>🛡 Un décalage n’est jamais un chiffrement sérieux : il n’y a que 25 clés. On utilise de la vraie cryptographie (AES).</p>',
      starter: 'synt{ebg13_snpvyr}\n',
      hints: ['Repère la ligne +13 dans le tableau.', 'Le début synt{ devient flag{.', 'flag{rot13_facile}'],
      solution: 'flag{rot13_facile}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_2', ch: 1, ord: 2, title: 'Décalé de trois', job: 'Chapitre 1 · Premiers réflexes', stars: 1, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'IODJ{GHFDOH_GH_WURLV}', plain: 'FLAG{DECALE_DE_TROIS}', flag: 'FLAG{DECALE_DE_TROIS}' },
      story: 'Jules César décalait ses ordres de 3 lettres. On a retrouvé un ordre chiffré de la même façon, en majuscules cette fois.',
      goal: 'Retrouve le texte clair de <code>IODJ{GHFDOH_GH_WURLV}</code>. Ici le décalage n’est pas 13 : teste les rotations et trouve celle qui a du sens.',
      lesson: '<p>Le chiffre de César décale d’un nombre fixe. Pour revenir en arrière, on décale dans l’autre sens.</p>' +
        '<p>Le message a été chiffré avec +3 ; pour le lire, applique la rotation qui ramène <code>IODJ{</code> à <code>FLAG{</code> (c’est la ligne <code>+23</code>).</p>' +
        '<p>🛡 Tester les 26 décalages (force brute) suffit à casser César : un espace de clés minuscule est une faute.</p>',
      starter: 'IODJ{GHFDOH_GH_WURLV}\n',
      hints: ['Quelle rotation transforme I en F ?', 'La ligne +23 (soit −3) donne le clair.', 'FLAG{DECALE_DE_TROIS}'],
      solution: 'FLAG{DECALE_DE_TROIS}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_3', ch: 1, ord: 3, title: 'La rotation inconnue', job: 'Chapitre 1 · Premiers réflexes', stars: 2, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'kqfl{uwjrnjw_wjkqjcj}', plain: 'flag{premier_reflexe}', flag: 'flag{premier_reflexe}' },
      story: 'Cette fois personne ne t’a donné la clé. À toi de la trouver, uniquement en lisant les rotations.',
      goal: 'Déchiffre <code>kqfl{uwjrnjw_wjkqjcj}</code>. Balaie les 26 lignes et repère celle qui commence par <code>flag{</code>.',
      lesson: '<p>Pas besoin de connaître le décalage : on les essaie tous et on garde la seule rotation lisible. C’est l’« analyse par force brute » de César.</p>' +
        '<p>Astuce : vise un repère connu. Tu sais que le clair commence par <code>flag{</code> ; cherche la ligne qui produit ces cinq caractères.</p>' +
        '<p>🛡 Un bon chiffre résiste même quand l’attaquant connaît le début du message (ici, ce début suffit à tout casser).</p>',
      starter: 'kqfl{uwjrnjw_wjkqjcj}\n',
      hints: ['Cherche la ligne où kqfl{ devient flag{.', 'La rotation vaut +21 (soit −5).', 'flag{premier_reflexe}'],
      solution: 'flag{premier_reflexe}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_4', ch: 1, ord: 4, title: 'Le mot de passe trop court', job: 'Chapitre 1 · Premiers réflexes', stars: 2, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'hash', hash: 'h7dd1705a', algo: 'toyHash' },
      story: 'Une fuite de base de données t’a donné le hash du compte admin. Un hash n’est pas réversible… mais on peut deviner le mot de passe et le re-hacher.',
      goal: 'Trouve le mot de passe dont le hash est <code>h7dd1705a</code>. Écris-le dans l’éditeur ; le moteur le hache et compare.',
      lesson: '<p>Un hash transforme un mot de passe en empreinte. On ne « déchiffre » pas un hash : on teste des mots de passe courants et on compare les empreintes — c’est une attaque par <b>dictionnaire</b>.</p>' +
        '<p>Commence par le pire mot de passe du monde, celui qu’on retrouve en tête de tous les classements.</p>' +
        '<p>🛡 Défense : hachage lent et salé (argon2, bcrypt) et mots de passe longs — pas un mot du dictionnaire.</p>',
      starter: '0000\n',
      hints: ['Essaie les mots de passe les plus courants.', 'Six chiffres qui se suivent…', '123456'],
      solution: '123456\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_5', ch: 1, ord: 5, title: 'Dictionnaire français', job: 'Chapitre 1 · Premiers réflexes', stars: 2, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'hash', hash: 'hf2fc6de4', algo: 'toyHash' },
      story: 'Le hash suivant appartient à un utilisateur francophone. Les classements de mots de passe diffèrent d’un pays à l’autre.',
      goal: 'Casse le hash <code>hf2fc6de4</code> en retrouvant le mot de passe (c’est un grand classique des claviers français).',
      lesson: '<p>Un dictionnaire d’attaque contient les mots de passe les plus fréquents par langue et par région. En France, une suite de touches du clavier revient tout le temps.</p>' +
        '<p>Pense aux six premières lettres de la rangée du haut d’un clavier AZERTY.</p>' +
        '<p>🛡 Défense : imposer de la longueur et de l’imprévisibilité ; bannir les mots de passe des listes connues (« have I been pwned »).</p>',
      starter: '123456\n',
      hints: ['Regarde la première ligne de lettres d’un clavier AZERTY.', 'Six lettres : a, z, e, r, t, y.', 'azerty'],
      solution: 'azerty\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_6', ch: 1, ord: 6, title: 'XOR à une lettre', job: 'Chapitre 1 · Premiers réflexes', stars: 3, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2d272a2c30332439143e251424283f2e3f36', flag: 'XOR-BROKEN' },
      story: 'Un développeur a « chiffré » un secret en appliquant un XOR avec une clé d’une seule lettre, répétée. C’est trivial à casser.',
      goal: 'Trouve la clé (une seule lettre majuscule) qui déchiffre <code>2d272a2c3033…</code>. Le clair commence par <code>flag{</code>.',
      lesson: '<p>XOR à clé répétée : <code>chiffré[i] = clair[i] XOR clé[i mod n]</code>. Avec une clé d’un octet, le même octet sert partout.</p>' +
        '<p>Si tu connais le premier caractère du clair (<code>f</code>), alors <code>clé = chiffré[0] XOR \'f\'</code>. Essaie la lettre ainsi obtenue ; le panneau te montre le résultat.</p>' +
        '<p>🛡 Défense : jamais de XOR « maison ». Une clé d’un octet n’offre que 256 possibilités — cassable en un clin d’œil.</p>',
      starter: 'A\n',
      hints: ['La clé fait un seul octet et se répète.', 'Teste chiffré[0] XOR « f » : 0x2d XOR 0x66 donne une majuscule.', 'K'],
      solution: 'K\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_7', ch: 1, ord: 7, title: 'XOR à deux lettres', job: 'Chapitre 1 · Premiers réflexes', stars: 3, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2e05290e3311271b170d2d1c30361014', flag: 'XOR-BROKEN' },
      story: 'Même développeur, clé un peu plus longue : deux lettres cette fois. Un peu plus de travail, pas plus sûr.',
      goal: 'Retrouve la clé de <b>deux</b> lettres qui déchiffre le message (il commence toujours par <code>flag{</code>).',
      lesson: '<p>Avec une clé de 2 octets, les positions paires utilisent la 1ʳᵉ lettre, les impaires la 2ᵉ.</p>' +
        '<p>On connaît le début <code>flag</code> : <code>clé[0] = chiffré[0] XOR \'f\'</code> et <code>clé[1] = chiffré[1] XOR \'l\'</code>. Deux octets suffisent à tout lire.</p>' +
        '<p>🛡 Défense : la sécurité d’un XOR dépend d’une clé aussi longue que le message et jamais réutilisée (masque jetable), ce qui n’est pas pratique — on préfère un vrai chiffrement.</p>',
      starter: 'Zz\n',
      hints: ['Deux octets : récupère-les avec « f » puis « l ».', '0x2e XOR « f » = H ; 0x05 XOR « l » = i.', 'Hi'],
      solution: 'Hi\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_8', ch: 1, ord: 8, title: 'XOR à trois lettres', job: 'Chapitre 1 · Premiers réflexes', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2d29382c3e212437063f373622360628293c3838', flag: 'XOR-BROKEN' },
      story: 'La clé passe à trois lettres. La méthode ne change pas : on exploite le début connu du clair.',
      goal: 'Trouve la clé de <b>trois</b> lettres majuscules qui déchiffre <code>2d29382c3e21…</code>.',
      lesson: '<p>Clé de 3 octets : positions 0,3,6… ↔ 1ʳᵉ lettre ; 1,4,7… ↔ 2ᵉ ; 2,5,8… ↔ 3ᵉ.</p>' +
        '<p>Avec le crib <code>fla</code> : <code>clé[0]=chiffré[0] XOR \'f\'</code>, <code>clé[1]=chiffré[1] XOR \'l\'</code>, <code>clé[2]=chiffré[2] XOR \'a\'</code>. Vérifie en lisant la suite.</p>' +
        '<p>🛡 Défense : une clé courte répétée fuit sa structure dès qu’on devine un bout du clair. Utiliser des primitives modernes et authentifiées.</p>',
      starter: 'ABC\n',
      hints: ['Récupère les 3 octets avec « f », « l », « a ».', 'Les trois lettres forment un mot courant de 3 lettres.', 'KEY'],
      solution: 'KEY\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb1_9', ch: 1, ord: 9, title: 'La clé réutilisée', job: 'Chapitre 1 · Premiers réflexes', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '525e2e53492c585710575d3a46462a6b512e47412a514f', flag: 'XOR-BROKEN' },
      story: 'Dernier message du chapitre : clé de trois caractères, mais ce ne sont pas que des lettres. Applique la même attaque jusqu’au bout.',
      goal: 'Casse <code>525e2e53492c…</code> : trouve la clé de 3 caractères. Le clair commence encore par <code>flag{</code>.',
      lesson: '<p>La méthode du crib marche quel que soit le jeu de caractères de la clé. Récupère les trois premiers octets de clé avec <code>flag{</code>, puis confirme que la suite reste lisible.</p>' +
        '<p>Ici le premier octet de clé vaut <code>0x52 XOR \'f\'</code> = <code>0x34</code> = le caractère « 4 ». Continue : la clé mélange chiffres et lettre.</p>' +
        '<p>🛡 Défense : réutiliser une clé courte est la faute la plus courante. Chiffrement authentifié, clés longues et aléatoires, une clé par usage.</p>',
      starter: '000\n',
      hints: ['Le premier octet de clé est un chiffre, pas une lettre.', 'flag{ → clé[0]=« 4 », clé[1]=« 2 », clé[2]=« O ».', '42O'],
      solution: '42O\n',
      tests: [{}], rules: {}
    },

    /* ============================================================= CHAPITRE 2
     *  Injection SQL — contourner un login, dumper une base (sim sqli).
     * ========================================================================= */
    {
      id: 'cyb2_1', ch: 2, ord: 1, title: 'La condition toujours vraie', job: 'Chapitre 2 · Injection SQL', stars: 1, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'username', fixed: {},
        db: function () { return { users: { cols: ['id', 'username'], rows: [{ id: '1', username: 'admin' }, { id: '2', username: 'lea' }] } }; },
        query: function (v) { return "SELECT id FROM users WHERE username='" + v.username + "'"; },
        flag: 'SQLI-TRUE', winMsg: 'La requête a renvoyé des lignes qu’elle n’aurait pas dû.'
      },
      story: 'Un formulaire « mot de passe oublié » vérifie si un nom d’utilisateur existe, en collant ton texte dans une requête SQL. Tu vas faire répondre « oui » à tous les coups.',
      goal: 'Entre un <b>username</b> qui rend la condition toujours vraie :<pre>username: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur construit : <code>SELECT id FROM users WHERE username=\'&lt;entrée&gt;\'</code>.</p>' +
        '<p>Une apostrophe ferme la chaîne ; tu ajoutes alors ta propre logique. <code>\' OR \'1\'=\'1</code> donne <code>username=\'\' OR \'1\'=\'1\'</code> : toujours vrai, donc toutes les lignes remontent.</p>' +
        '<p>🛡 Défense : <b>requêtes préparées</b> (paramètres liés), jamais de concaténation de l’entrée.</p>',
      starter: 'username: charlie\n',
      hints: ['Ferme la chaîne avec une apostrophe.', 'Ajoute une condition toujours vraie : OR \'1\'=\'1.', "username: ' OR '1'='1"],
      solution: "username: ' OR '1'='1\n",
      tests: [{}], rules: {}
    },
    {
      id: 'cyb2_2', ch: 2, ord: 2, title: 'Commenter le mot de passe', job: 'Chapitre 2 · Injection SQL', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'username', fixed: { password: 'inconnu' },
        db: function () { return { users: { cols: ['id', 'username', 'password'], rows: [{ id: '1', username: 'admin', password: 'S3cr3t!' }, { id: '2', username: 'lea', password: 'azerty' }] } }; },
        query: function (v) { return "SELECT * FROM users WHERE username='" + v.username + "' AND password='" + v.password + "'"; },
        flag: 'ACCESS-GRANTED', winMsg: 'Connecté sans le mot de passe !'
      },
      story: 'Un vrai login : il colle ton nom ET ton mot de passe dans la même requête. Tu ne connais pas le mot de passe de « admin »… mais tu peux faire ignorer sa vérification.',
      goal: 'Connecte-toi en tant qu’<code>admin</code> sans son mot de passe :<pre>username: TON_PAYLOAD</pre>',
      lesson: '<p>La requête est <code>… WHERE username=\'&lt;entrée&gt;\' AND password=\'…\'</code>. Si tu termines ton entrée par <code>--</code>, tout ce qui suit (le test du mot de passe) devient un <b>commentaire</b> ignoré.</p>' +
        '<p><code>admin\' -- </code> donne <code>… WHERE username=\'admin\'</code> : la ligne admin remonte, mot de passe non vérifié.</p>' +
        '<p>🛡 Défense : requêtes préparées. L’entrée ne doit jamais pouvoir changer la structure de la requête.</p>',
      starter: 'username: admin\n',
      hints: ['Ferme la chaîne après admin avec une apostrophe.', 'Mets le reste en commentaire avec -- (garde l’espace après).', "username: admin' -- "],
      solution: "username: admin' -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'S3cr3t', msg: 'N’écris pas le mot de passe : contourne-le par l’injection.' }] }
    },
    {
      id: 'cyb2_3', ch: 2, ord: 3, title: 'Un autre style de commentaire', job: 'Chapitre 2 · Injection SQL', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'user', fixed: { pass: 'x' },
        db: function () { return { membres: { cols: ['id', 'user', 'pass', 'role'], rows: [{ id: '1', user: 'modo', pass: 'p1', role: 'mod' }, { id: '2', user: 'root', pass: 'Zz9!kk', role: 'admin' }] } }; },
        query: function (v) { return "SELECT * FROM membres WHERE user='" + v.user + "' AND pass='" + v.pass + "'"; },
        flag: 'ACCESS-GRANTED', winMsg: 'Session root ouverte !'
      },
      story: 'Le forum du campus utilise MySQL. En MySQL, un autre marqueur de commentaire existe : le dièse <code>#</code>. Entre dans le compte « root ».',
      goal: 'Connecte-toi en tant que <code>root</code> en commentant la vérification du mot de passe avec <code>#</code> :<pre>user: TON_PAYLOAD</pre>',
      lesson: '<p>Selon la base, le commentaire s’écrit <code>--</code> (standard), <code>#</code> (MySQL) ou <code>/* */</code>. Ici on utilise <code>#</code>.</p>' +
        '<p><code>root\' #</code> ⇒ <code>… WHERE user=\'root\'</code> et le reste est commenté.</p>' +
        '<p>🛡 Défense : les requêtes préparées rendent tous ces styles de commentaires inoffensifs.</p>',
      starter: 'user: root\n',
      hints: ['Ferme la chaîne après root.', 'Commente la fin avec un dièse #.', "user: root' #"],
      solution: "user: root' #\n",
      tests: [{}], rules: { forbidSrc: [{ re: 'Zz9', msg: 'Ne recopie pas le mot de passe, exploite le commentaire.' }] }
    },
    {
      id: 'cyb2_4', ch: 2, ord: 4, title: 'OR 1=1', job: 'Chapitre 2 · Injection SQL', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'email', fixed: { password: '???' },
        db: function () { return { comptes: { cols: ['id', 'email', 'password'], rows: [{ id: '1', email: 'admin@42.fr', password: 'Hunter!2' }, { id: '2', email: 'lea@42.fr', password: 'lea123' }] } }; },
        query: function (v) { return "SELECT * FROM comptes WHERE email='" + v.email + "' AND password='" + v.password + "'"; },
        flag: 'ACCESS-GRANTED', winMsg: 'Authentification contournée !'
      },
      story: 'La condition toujours vraie n’a pas besoin d’apostrophes autour du 1. Entraîne-toi avec la forme numérique <code>OR 1=1</code>.',
      goal: 'Contourne le login avec une condition numérique toujours vraie, puis commente le reste :<pre>email: TON_PAYLOAD</pre>',
      lesson: '<p><code>1=1</code> est vrai sans guillemets. Il faut quand même fermer la chaîne de l’email d’abord, puis commenter la vérification du mot de passe.</p>' +
        '<p><code>\' OR 1=1 -- </code> ⇒ <code>… WHERE email=\'\' OR 1=1</code> : vrai pour toutes les lignes.</p>' +
        '<p>🛡 Défense : paramètres liés. La valeur <code>\' OR 1=1 -- </code> serait alors cherchée telle quelle comme email, et ne correspondrait à rien.</p>',
      starter: 'email: admin@42.fr\n',
      hints: ['Ferme la chaîne, puis OR 1=1.', 'Termine par -- pour ignorer le mot de passe.', "email: ' OR 1=1 -- "],
      solution: "email: ' OR 1=1 -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'Hunter', msg: 'Exploite l’injection, n’écris pas le mot de passe.' }] }
    },
    {
      id: 'cyb2_5', ch: 2, ord: 5, title: 'Viser l’administrateur', job: 'Chapitre 2 · Injection SQL', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'login', fixed: { password: 'x' },
        db: function () { return { users: { cols: ['id', 'login', 'password', 'role'], rows: [{ id: '1', login: 'invite', password: 'g1', role: 'guest' }, { id: '2', login: 'lea', password: 'l2', role: 'user' }, { id: '3', login: 'admin', password: 'Adm1n!x', role: 'admin' }] } }; },
        query: function (v) { return "SELECT * FROM users WHERE login='" + v.login + "' AND password='" + v.password + "'"; },
        success: function (rows) { return rows.some(function (r) { return r.indexOf('admin') >= 0; }); },
        flag: 'ADMIN-SESSION', winMsg: 'Session administrateur obtenue !'
      },
      story: 'Avec <code>OR 1=1</code> tu peux te connecter… mais sur la première ligne venue (un invité). Pour prendre les pleins pouvoirs, il faut viser précisément la ligne « admin ».',
      goal: 'Ouvre une session <b>administrateur</b> (pas un simple invité) :<pre>login: TON_PAYLOAD</pre>',
      lesson: '<p>Une condition toujours vraie renvoie toutes les lignes ; l’appli te connecte souvent à la première. Pour choisir le compte, nomme-le : <code>admin\' -- </code>.</p>' +
        '<p>Cette requête ne remonte que la ligne admin, et le mot de passe est commenté.</p>' +
        '<p>🛡 Défense : requêtes préparées, et ne jamais déduire les droits d’une ligne arbitraire renvoyée par la base.</p>',
      starter: "login: invite' -- \n",
      hints: ['Te connecter en tant qu’invité ne suffit pas, vise admin.', 'Nomme explicitement le compte admin puis commente.', "login: admin' -- "],
      solution: "login: admin' -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'Adm1n', msg: 'Vise la ligne admin par l’injection, n’écris pas son mot de passe.' }] }
    },
    {
      id: 'cyb2_6', ch: 2, ord: 6, title: 'Compter les colonnes', job: 'Chapitre 2 · Injection SQL', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'id', fixed: {},
        db: function () { return { posts: { cols: ['id', 'titre', 'auteur'], rows: [{ id: '1', titre: 'Bienvenue', auteur: 'lea' }, { id: '2', titre: 'News', auteur: 'marc' }] } }; },
        query: function (v) { return "SELECT titre, auteur FROM posts WHERE id=" + v.id; },
        success: function (rows) { return rows.some(function (r) { return r.some(function (c) { return /INJECTE/.test(String(c)); }); }); },
        flag: 'UNION-OK', winMsg: 'UNION accepté : 2 colonnes, c’est le bon compte.'
      },
      story: 'Avant de voler des données avec <code>UNION SELECT</code>, il faut connaître le nombre de colonnes renvoyées. Ici, l’identifiant est numérique : pas besoin d’apostrophe.',
      goal: 'La requête renvoie 2 colonnes. Ajoute un <code>UNION SELECT</code> à 2 valeurs littérales pour vérifier :<pre>id: TON_PAYLOAD</pre>',
      lesson: '<p><code>SELECT titre, auteur FROM posts WHERE id=&lt;entrée&gt;</code>. L’id n’est pas entre guillemets, donc on injecte directement.</p>' +
        '<p><code>UNION SELECT</code> colle une 2ᵉ requête — à condition d’avoir le MÊME nombre de colonnes. Teste avec deux chaînes : <code>0 UNION SELECT \'INJECTE\', \'OK\'</code>.</p>' +
        '<p>🛡 Défense : requêtes préparées (l’id serait traité comme un nombre, pas comme du SQL).</p>',
      starter: 'id: 1\n',
      hints: ['L’id est numérique : commence par 0 pour ne remonter aucun post.', 'Ajoute UNION SELECT avec 2 valeurs, dont le mot INJECTE.', "id: 0 UNION SELECT 'INJECTE', 'OK'"],
      solution: "id: 0 UNION SELECT 'INJECTE', 'OK'\n",
      tests: [{}], rules: {}
    },
    {
      id: 'cyb2_7', ch: 2, ord: 7, title: 'Voler une autre table', job: 'Chapitre 2 · Injection SQL', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'q', fixed: {},
        db: function () { return { produits: { cols: ['nom', 'prix'], rows: [{ nom: 'Clé USB', prix: '9' }, { nom: 'Câble', prix: '5' }] }, secrets: { cols: ['label', 'valeur'], rows: [{ label: 'api_key', valeur: 'flag{union_vole_la_table}' }] } }; },
        query: function (v) { return "SELECT nom, prix FROM produits WHERE nom LIKE '%" + v.q + "%'"; },
        success: function (rows) { return rows.some(function (r) { return r.some(function (c) { return /flag\{/.test(String(c)); }); }); },
        flag: 'flag{union_vole_la_table}', winMsg: 'Clé API exfiltrée depuis une autre table !'
      },
      story: 'Une barre de recherche interroge la table des produits. Avec UNION, tu peux faire remonter le contenu d’une table qui n’a rien à voir — celle des secrets.',
      goal: 'Dans <b>q</b>, utilise <code>UNION SELECT</code> pour lire la table <code>secrets</code> (colonnes <code>label</code>, <code>valeur</code>) :<pre>q: TON_PAYLOAD</pre>',
      lesson: '<p>La requête : <code>SELECT nom, prix FROM produits WHERE nom LIKE \'%&lt;q&gt;%\'</code>. On ferme la chaîne, puis on ajoute un UNION à 2 colonnes depuis <code>secrets</code>, et on commente la fin.</p>' +
        '<pre>q: \' UNION SELECT label, valeur FROM secrets -- </pre>' +
        '<p>🛡 Défense : requêtes préparées, et un compte applicatif qui n’a accès qu’aux tables strictement nécessaires (moindre privilège).</p>',
      starter: 'q: USB\n',
      hints: ['Ferme la chaîne avec une apostrophe, puis UNION SELECT à 2 colonnes.', 'Lis label et valeur depuis la table secrets.', "q: ' UNION SELECT label, valeur FROM secrets -- "],
      solution: "q: ' UNION SELECT label, valeur FROM secrets -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'union_vole_la_table', msg: 'Exfiltre la valeur par l’injection, ne l’écris pas toi-même.' }] }
    },
    {
      id: 'cyb2_8', ch: 2, ord: 8, title: 'Fuite de données RH', job: 'Chapitre 2 · Injection SQL', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'search', fixed: {},
        db: function () { return { annuaire: { cols: ['nom', 'poste'], rows: [{ nom: 'Léa', poste: 'Dev' }, { nom: 'Marc', poste: 'Ops' }] }, rh: { cols: ['nom', 'salaire', 'ssn'], rows: [{ nom: 'PDG', salaire: '250000', ssn: 'flag{donnees_rh_exposees}' }] } }; },
        query: function (v) { return "SELECT nom, poste FROM annuaire WHERE nom LIKE '%" + v.search + "%'"; },
        success: function (rows) { return rows.some(function (r) { return r.some(function (c) { return /flag\{/.test(String(c)); }); }); },
        flag: 'flag{donnees_rh_exposees}', winMsg: 'Données RH confidentielles exposées !'
      },
      story: 'L’annuaire public du campus cache, dans la même base, une table RH confidentielle (salaires, numéros de sécu). Une seule recherche bien formée peut la révéler.',
      goal: 'Depuis le champ <b>search</b>, exfiltre <code>ssn</code> de la table <code>rh</code> via UNION :<pre>search: TON_PAYLOAD</pre>',
      lesson: '<p>Même schéma qu’avant : on ferme le <code>LIKE \'%…%\'</code>, on colle un UNION à 2 colonnes depuis <code>rh</code>, on commente.</p>' +
        '<p>La 2ᵉ requête n’a pas besoin des mêmes noms de colonnes que la 1ʳᵉ, seulement du même NOMBRE. Choisis deux colonnes de <code>rh</code> dont l’une contient le secret.</p>' +
        '<p>🛡 Défense : séparer les données sensibles, chiffrer au repos, et surtout requêtes préparées + moindre privilège.</p>',
      starter: 'search: Léa\n',
      hints: ['Ferme la chaîne du LIKE, puis UNION SELECT à 2 colonnes.', 'Prends nom et ssn dans la table rh.', "search: ' UNION SELECT nom, ssn FROM rh -- "],
      solution: "search: ' UNION SELECT nom, ssn FROM rh -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'donnees_rh_exposees', msg: 'Fais remonter le secret par l’injection.' }] }
    },
    {
      id: 'cyb2_9', ch: 2, ord: 9, title: 'Exfiltrer les comptes', job: 'Chapitre 2 · Injection SQL', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'q', fixed: {},
        db: function () { return { articles: { cols: ['titre', 'extrait'], rows: [{ titre: 'Accueil', extrait: 'Bienvenue' }] }, comptes: { cols: ['login', 'mdp', 'role'], rows: [{ login: 'admin', mdp: 'flag{dump_des_comptes}', role: 'admin' }, { login: 'lea', mdp: 'azerty', role: 'user' }] } }; },
        query: function (v) { return "SELECT titre, extrait FROM articles WHERE titre LIKE '%" + v.q + "%'"; },
        success: function (rows) { return rows.some(function (r) { return r.some(function (c) { return /flag\{/.test(String(c)); }); }); },
        flag: 'flag{dump_des_comptes}', winMsg: 'Table des comptes exfiltrée !'
      },
      story: 'Dernier entraînement du chapitre, proche du contrat final : une recherche d’articles qui cache la table des comptes. Récupère le mot de passe admin.',
      goal: 'Dump <code>login</code> et <code>mdp</code> de la table <code>comptes</code> via le champ <b>q</b> :<pre>q: TON_PAYLOAD</pre>',
      lesson: '<p>Tu maîtrises maintenant la recette : fermer la chaîne, <code>UNION SELECT</code> au bon nombre de colonnes depuis la table visée, puis <code>--</code>.</p>' +
        '<p>Vise les colonnes qui portent les identifiants : <code>login, mdp</code>.</p>' +
        '<p>🛡 Défense : requêtes préparées, mots de passe hachés ET salés (jamais en clair), comptes en lecture seule.</p>',
      starter: 'q: accueil\n',
      hints: ['Ferme le LIKE, ajoute UNION SELECT à 2 colonnes.', 'Récupère login et mdp depuis comptes.', "q: ' UNION SELECT login, mdp FROM comptes -- "],
      solution: "q: ' UNION SELECT login, mdp FROM comptes -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'dump_des_comptes', msg: 'Exfiltre le mot de passe par l’injection, ne l’écris pas.' }] }
    },

    /* ============================================================= CHAPITRE 3
     *  Injection de commande — enchaîner des commandes shell (sim cmdi).
     * ========================================================================= */
    {
      id: 'cyb3_1', ch: 3, ord: 1, title: 'Une commande en plus', job: 'Chapitre 3 · Injection de commande', stars: 1, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'index.html': { content: '<h1>ok</h1>' }, 'flag.txt': { content: 'flag{point_virgule}', secret: true } }; }
      },
      story: 'Un outil réseau « pingue » l’adresse que tu donnes, en la collant dans une ligne de shell. On va lui faire exécuter une commande de plus.',
      goal: 'Donne un <b>host</b> qui pingue puis lit <code>flag.txt</code> :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur lance <code>ping -c1 &lt;host&gt;</code> dans un shell. Le point-virgule <code>;</code> sépare deux commandes : la première finit, la seconde (la tienne) démarre.</p>' +
        '<p><code>127.0.0.1; cat flag.txt</code> ⇒ ping, puis <code>cat flag.txt</code>.</p>' +
        '<p>🛡 Défense : ne jamais passer d’entrée à un shell. Utiliser une API avec arguments séparés et valider l’entrée.</p>',
      starter: 'host: 127.0.0.1\n',
      hints: ['Ajoute ; après l’adresse.', 'Puis cat sur le fichier flag.txt.', 'host: 127.0.0.1; cat flag.txt'],
      solution: 'host: 127.0.0.1; cat flag.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'point_virgule', msg: 'Lis le fichier avec cat, n’écris pas le drapeau.' }] }
    },
    {
      id: 'cyb3_2', ch: 3, ord: 2, title: 'Et ensuite (&&)', job: 'Chapitre 3 · Injection de commande', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'secret.txt': { content: 'flag{et_commercial}', secret: true } }; }
      },
      story: 'Il existe d’autres façons d’enchaîner des commandes. <code>&amp;&amp;</code> lance la suivante seulement si la première a réussi.',
      goal: 'Enchaîne la lecture de <code>secret.txt</code> avec <code>&amp;&amp;</code> :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p><code>A &amp;&amp; B</code> : B s’exécute si A réussit (ping vers 127.0.0.1 réussit). <code>A ; B</code> exécute B dans tous les cas, <code>A || B</code> seulement si A échoue.</p>' +
        '<p><code>127.0.0.1 &amp;&amp; cat secret.txt</code>.</p>' +
        '<p>🛡 Défense : séparer données et commande ; interdire ces métacaractères de shell dans l’entrée.</p>',
      starter: 'host: 127.0.0.1\n',
      hints: ['Utilise && entre le ping et ta commande.', 'cat secret.txt pour lire le drapeau.', 'host: 127.0.0.1 && cat secret.txt'],
      solution: 'host: 127.0.0.1 && cat secret.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'et_commercial', msg: 'Passe par cat, n’écris pas le drapeau.' }] }
    },
    {
      id: 'cyb3_3', ch: 3, ord: 3, title: 'Dans le tuyau (|)', job: 'Chapitre 3 · Injection de commande', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'token.txt': { content: 'flag{le_tuyau}', secret: true } }; }
      },
      story: 'Le « pipe » <code>|</code> enchaîne aussi deux commandes. Peu importe le sens réel du pipe ici : ta deuxième commande s’exécute.',
      goal: 'Lis <code>token.txt</code> après le ping avec un pipe <code>|</code> :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p>En shell, <code>A | B</code> branche la sortie de A sur l’entrée de B, mais B s’exécute bien. Tout métacaractère non filtré (<code>; &amp;&amp; || |</code>) permet l’injection.</p>' +
        '<p><code>127.0.0.1 | cat token.txt</code>.</p>' +
        '<p>🛡 Défense : liste blanche stricte (ici, n’autoriser que des chiffres et des points pour une IP).</p>',
      starter: 'host: 127.0.0.1\n',
      hints: ['Mets un | après l’adresse.', 'cat token.txt derrière le pipe.', 'host: 127.0.0.1 | cat token.txt'],
      solution: 'host: 127.0.0.1 | cat token.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'le_tuyau', msg: 'Lis le fichier avec cat.' }] }
    },
    {
      id: 'cyb3_4', ch: 3, ord: 4, title: 'Si ça échoue (||)', job: 'Chapitre 3 · Injection de commande', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'note.txt': { content: 'flag{ou_sinon}', secret: true } }; }
      },
      story: 'Le ping échoue sur une adresse vide. <code>||</code> lance alors la commande de secours… que tu choisis.',
      goal: 'Fais échouer le ping puis lis <code>note.txt</code> avec <code>||</code> :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p><code>A || B</code> exécute B si A échoue. En donnant une adresse qui fait rater le ping, on force l’exécution de B.</p>' +
        '<p>Exemple : <code>"" || cat note.txt</code> ou simplement <code>x || cat note.txt</code>.</p>' +
        '<p>🛡 Défense : ne pas construire de ligne de commande à partir de l’entrée ; utiliser des appels système paramétrés.</p>',
      starter: 'host: 127.0.0.1\n',
      hints: ['Donne une adresse bidon, puis ||.', 'cat note.txt après le ||.', 'host: x || cat note.txt'],
      solution: 'host: x || cat note.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'ou_sinon', msg: 'Passe par cat.' }] }
    },
    {
      id: 'cyb3_5', ch: 3, ord: 5, title: 'Lister puis lire', job: 'Chapitre 3 · Injection de commande', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'index.html': { content: 'x' }, 'data_9f3a.txt': { content: 'flag{recon_puis_lecture}', secret: true } }; }
      },
      story: 'Tu ne connais pas le nom du fichier sensible. Qu’à cela ne tienne : on liste d’abord, on lit ensuite — dans la même charge.',
      goal: 'Enchaîne <code>ls</code> (pour découvrir les fichiers) puis <code>cat</code> sur le bon :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p>La reconnaissance fait partie de l’attaque : <code>ls</code> révèle les noms, <code>cat</code> lit le contenu. On enchaîne plusieurs commandes avec des <code>;</code>.</p>' +
        '<p><code>127.0.0.1; ls; cat data_9f3a.txt</code>. Le panneau de gauche montre déjà les fichiers.</p>' +
        '<p>🛡 Défense : validation stricte de l’entrée et exécution sans shell coupent l’attaque dès la 1ʳᵉ commande injectée.</p>',
      starter: 'host: 127.0.0.1; ls\n',
      hints: ['ls d’abord pour voir les noms de fichiers.', 'Puis cat sur data_9f3a.txt.', 'host: 127.0.0.1; ls; cat data_9f3a.txt'],
      solution: 'host: 127.0.0.1; ls; cat data_9f3a.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'recon_puis_lecture', msg: 'Découvre le fichier avec ls, lis-le avec cat.' }] }
    },
    {
      id: 'cyb3_6', ch: 3, ord: 6, title: 'Qui suis-je ?', job: 'Chapitre 3 · Injection de commande', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'domain', template: 'host <domain>', build: function (h) { return 'host ' + h; },
        fs: function () { return { 'config.php': { content: 'DB_PASS=flag{contexte_rce}', secret: true } }; }
      },
      story: 'Un outil de résolution DNS, cette fois. Après une injection, un attaquant vérifie d’abord sous quel utilisateur il tourne, puis lit un fichier de config.',
      goal: 'Injecte <code>id</code> (pour voir le contexte) puis lis <code>config.php</code> :<pre>domain: TON_PAYLOAD</pre>',
      lesson: '<p>Le template a changé (<code>host &lt;domain&gt;</code>) mais la faille est la même : l’entrée arrive dans un shell.</p>' +
        '<p><code>whoami</code> et <code>id</code> montrent sous quel compte le code tourne — utile pour mesurer les dégâts possibles. Puis <code>cat config.php</code> expose les secrets de l’appli.</p>' +
        '<p><code>42.fr; id; cat config.php</code>.</p>' +
        '<p>🛡 Défense : exécuter le service avec le moins de droits possible, et surtout ne pas injecter l’entrée dans un shell.</p>',
      starter: 'domain: 42.fr\n',
      hints: ['Enchaîne id après le domaine.', 'Puis cat config.php.', 'domain: 42.fr; id; cat config.php'],
      solution: 'domain: 42.fr; id; cat config.php\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'contexte_rce', msg: 'Lis config.php avec cat.' }] }
    },
    {
      id: 'cyb3_7', ch: 3, ord: 7, title: 'Un fichier dans un sous-dossier', job: 'Chapitre 3 · Injection de commande', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'app/.env': { content: 'APP_SECRET=flag{env_cache}', secret: true }, 'app/main.py': { content: 'print("hi")' } }; }
      },
      story: 'Les secrets ne sont pas toujours à la racine. Le fichier d’environnement se cache dans un sous-dossier <code>app/</code>.',
      goal: 'Lis le fichier <code>app/.env</code> via une injection :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p><code>cat</code> prend un chemin : on peut descendre dans un dossier avec <code>app/.env</code>. Le point devant <code>.env</code> en fait un fichier « caché », mais <code>cat</code> le lit quand même.</p>' +
        '<p><code>127.0.0.1; cat app/.env</code>.</p>' +
        '<p>🛡 Défense : ne pas stocker de secrets en clair dans l’arborescence servie, et bloquer l’injection à la source.</p>',
      starter: 'host: 127.0.0.1; cat app/main.py\n',
      hints: ['Le secret est dans app/.env.', 'Donne le chemin complet à cat.', 'host: 127.0.0.1; cat app/.env'],
      solution: 'host: 127.0.0.1; cat app/.env\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'env_cache', msg: 'Lis app/.env avec cat.' }] }
    },
    {
      id: 'cyb3_8', ch: 3, ord: 8, title: 'L’outil de sauvegarde', job: 'Chapitre 3 · Injection de commande', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'dir', template: 'tar -czf backup.tgz <dir>', build: function (d) { return 'tar -czf backup.tgz ' + d; },
        fs: function () { return { 'www': { dir: ['index.html'] }, 'backup.key': { content: 'flag{sauvegarde_injectee}', secret: true } }; }
      },
      story: 'Un bouton « Sauvegarder » lance <code>tar</code> sur le dossier que tu choisis. Le nom du dossier est collé dans la commande : encore une injection.',
      goal: 'Détourne la sauvegarde pour lire <code>backup.key</code> :<pre>dir: TON_PAYLOAD</pre>',
      lesson: '<p>Peu importe que <code>tar</code> réussisse : ce qui compte, c’est ta commande injectée après le séparateur.</p>' +
        '<p><code>www; cat backup.key</code> ⇒ tar s’exécute sur <code>www</code>, puis <code>cat backup.key</code>.</p>' +
        '<p>🛡 Défense : passer le chemin comme argument d’un appel système (pas de shell), et le valider contre une liste autorisée.</p>',
      starter: 'dir: www\n',
      hints: ['Ferme la commande tar avec ; (le dossier www existe).', 'Puis cat backup.key.', 'dir: www; cat backup.key'],
      solution: 'dir: www; cat backup.key\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'sauvegarde_injectee', msg: 'Lis backup.key avec cat.' }] }
    },
    {
      id: 'cyb3_9', ch: 3, ord: 9, title: 'Remonter chercher le drapeau', job: 'Chapitre 3 · Injection de commande', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'index.php': { content: '<?php ?>' }, '/var/secret/flag.txt': { content: 'FLAG=flag{rce_chemin_absolu}', secret: true } }; }
      },
      story: 'Dernier entraînement avant le contrat final : le drapeau est rangé dans un chemin absolu <code>/var/secret/flag.txt</code>, hors du dossier de travail.',
      goal: 'Lis le fichier par son chemin absolu après le ping :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p>Une fois l’exécution obtenue, tu n’es pas limité au dossier courant : <code>cat</code> accepte un chemin absolu commençant par <code>/</code>.</p>' +
        '<p><code>127.0.0.1; cat /var/secret/flag.txt</code>.</p>' +
        '<p>🛡 Défense : l’injection de commande donne un accès shell complet (recon, lecture, écriture…). La seule vraie protection est de ne jamais construire de commande à partir de l’entrée.</p>',
      starter: 'host: 127.0.0.1; cat index.php\n',
      hints: ['Le fichier est en /var/secret/flag.txt.', 'Donne le chemin absolu complet à cat.', 'host: 127.0.0.1; cat /var/secret/flag.txt'],
      solution: 'host: 127.0.0.1; cat /var/secret/flag.txt\n',
      tests: [{}], rules: { forbidSrc: [{ re: 'rce_chemin_absolu', msg: 'Lis le fichier avec cat, n’écris pas le drapeau.' }] }
    },

    /* ============================================================= CHAPITRE 4
     *  Chemins & fichiers — traversée de répertoire, LFI (sim pathtrav).
     * ========================================================================= */
    {
      id: 'cyb4_1', ch: 4, ord: 1, title: 'Un cran au-dessus', job: 'Chapitre 4 · Chemins & fichiers', stars: 1, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/var/www/html/',
        fs: function () { return { '/var/www/html/index.html': { content: '<h1>Accueil</h1>' }, '/var/www/private.txt': { content: 'flag{un_cran_plus_haut}', secret: true } }; }
      },
      story: 'Un serveur affiche les fichiers du dossier public à partir du nom que tu demandes. Rien ne vérifie que tu restes dans ce dossier.',
      goal: 'Remonte d’un dossier pour lire <code>private.txt</code> (il est juste au-dessus du dossier public) :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur ouvre <code>/var/www/html/ + &lt;file&gt;</code>. La séquence <code>../</code> remonte d’un dossier.</p>' +
        '<p>De <code>/var/www/html/</code>, un seul <code>../</code> mène à <code>/var/www/</code> où se trouve <code>private.txt</code>.</p>' +
        '<p>🛡 Défense : résoudre le chemin et vérifier qu’il reste sous le dossier autorisé ; refuser toute séquence <code>..</code>.</p>',
      starter: 'file: index.html\n',
      hints: ['Un ../ remonte d’un dossier.', 'De html/ à www/, c’est un seul cran.', 'file: ../private.txt'],
      solution: 'file: ../private.txt\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_2', ch: 4, ord: 2, title: 'Deux crans', job: 'Chapitre 4 · Chemins & fichiers', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/var/www/html/',
        fs: function () { return { '/var/www/html/index.html': { content: '<h1>ok</h1>' }, '/var/backup.txt': { content: 'flag{deux_crans}', secret: true } }; }
      },
      story: 'Le fichier visé est deux dossiers plus haut. Il suffit d’empiler les <code>../</code>.',
      goal: 'Lis <code>/var/backup.txt</code> en remontant deux dossiers :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>Chaque <code>../</code> remonte d’un niveau. De <code>/var/www/html/</code> : un <code>../</code> → <code>/var/www/</code>, deux → <code>/var/</code>.</p>' +
        '<p><code>../../backup.txt</code> résout donc en <code>/var/backup.txt</code>.</p>' +
        '<p>🛡 Défense : canoniser le chemin (résoudre les <code>..</code>) PUIS vérifier qu’il commence bien par le dossier autorisé.</p>',
      starter: 'file: index.html\n',
      hints: ['Compte les dossiers : html → www → var.', 'Il faut deux ../.', 'file: ../../backup.txt'],
      solution: 'file: ../../backup.txt\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_3', ch: 4, ord: 3, title: 'Jusqu’à /etc/passwd', job: 'Chapitre 4 · Chemins & fichiers', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/var/www/html/',
        fs: function () { return { '/var/www/html/index.html': { content: '<h1>ok</h1>' }, '/etc/passwd': { content: 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33', secret: true } }; }
      },
      story: 'Le grand classique : lire <code>/etc/passwd</code>, le fichier des comptes Unix, depuis un dossier web public.',
      goal: 'Remonte jusqu’à la racine puis descends vers <code>etc/passwd</code> :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>De <code>/var/www/html/</code> à la racine <code>/</code>, il faut remonter 3 dossiers : <code>html → www → var → /</code>.</p>' +
        '<p>Puis on descend : <code>../../../etc/passwd</code>.</p>' +
        '<p>🛡 Défense : ne pas servir de fichier à partir d’un chemin fourni par l’utilisateur ; utiliser un identifiant mappé côté serveur.</p>',
      starter: 'file: index.html\n',
      hints: ['3 dossiers jusqu’à la racine.', 'Puis etc/passwd.', 'file: ../../../etc/passwd'],
      solution: 'file: ../../../etc/passwd\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_4', ch: 4, ord: 4, title: 'Dossier plus profond', job: 'Chapitre 4 · Chemins & fichiers', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/srv/app/public/assets/',
        fs: function () { return { '/srv/app/public/assets/logo.png': { content: 'PNG…' }, '/etc/passwd': { content: 'root:x:0:0:root:/root:/bin/bash', secret: true } }; }
      },
      story: 'Le dossier public est enfoui plus profondément (<code>/srv/app/public/assets/</code>). À toi de compter les niveaux.',
      goal: 'Lis <code>/etc/passwd</code> depuis ce dossier profond :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>Le nombre de <code>../</code> dépend de la profondeur du dossier de base. Ici : <code>assets → public → app → srv → /</code>, soit 4 remontées.</p>' +
        '<p><code>../../../../etc/passwd</code>.</p>' +
        '<p>🛡 Défense : un attaquant ajoute simplement des <code>../</code> jusqu’à atteindre la racine. Seul un contrôle strict du chemin résolu arrête l’attaque.</p>',
      starter: 'file: logo.png\n',
      hints: ['Compte : assets, public, app, srv.', 'Quatre dossiers → quatre ../.', 'file: ../../../../etc/passwd'],
      solution: 'file: ../../../../etc/passwd\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_5', ch: 4, ord: 5, title: 'Le fichier .env', job: 'Chapitre 4 · Chemins & fichiers', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'page', base: '/var/www/app/public/',
        fs: function () { return { '/var/www/app/public/home.html': { content: '<h1>home</h1>' }, '/var/www/app/.env': { content: 'DB_PASSWORD=flag{env_hors_public}', secret: true } }; }
      },
      story: 'Les applis web rangent leurs secrets dans un fichier <code>.env</code>, juste au-dessus du dossier public. Un classique du vol de configuration.',
      goal: 'Lis le fichier <code>.env</code> (un cran au-dessus du dossier public) via le paramètre <b>page</b> :<pre>page: TON_PAYLOAD</pre>',
      lesson: '<p>Le dossier public est <code>/var/www/app/public/</code> ; le <code>.env</code> est dans <code>/var/www/app/</code>. Un seul <code>../</code> suffit pour sortir du dossier public.</p>' +
        '<p><code>../.env</code>.</p>' +
        '<p>🛡 Défense : stocker les secrets HORS de l’arborescence servie et refuser toute entrée contenant <code>..</code>.</p>',
      starter: 'page: home.html\n',
      hints: ['Le .env est dans le dossier app, juste au-dessus de public.', 'Un seul ../ puis .env.', 'page: ../.env'],
      solution: 'page: ../.env\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_6', ch: 4, ord: 6, title: 'La clé SSH', job: 'Chapitre 4 · Chemins & fichiers', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/home/web/htdocs/',
        fs: function () { return { '/home/web/htdocs/index.html': { content: '<h1>ok</h1>' }, '/home/user/.ssh/id_rsa': { content: '-----BEGIN KEY-----\nflag{cle_ssh_volee}', secret: true } }; }
      },
      story: 'Encore plus grave : lire une clé privée SSH dans le dossier personnel d’un autre utilisateur.',
      goal: 'Lis <code>/home/user/.ssh/id_rsa</code> en combinant remontées et descente :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>On remonte de <code>/home/web/htdocs/</code> jusqu’à <code>/home/</code> (2 crans : <code>htdocs → web → home</code>), puis on descend dans <code>user/.ssh/</code>.</p>' +
        '<p><code>../../user/.ssh/id_rsa</code>.</p>' +
        '<p>🛡 Défense : isoler le service web (chroot/conteneur, droits minimaux) pour qu’il ne PUISSE pas lire les dossiers des utilisateurs.</p>',
      starter: 'file: index.html\n',
      hints: ['Remonte à /home/ (deux ../), puis descends.', 'user/.ssh/id_rsa derrière les ../.', 'file: ../../user/.ssh/id_rsa'],
      solution: 'file: ../../user/.ssh/id_rsa\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_7', ch: 4, ord: 7, title: 'Lire le code source', job: 'Chapitre 4 · Chemins & fichiers', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'tpl', base: '/opt/webapp/www/pages/',
        fs: function () { return { '/opt/webapp/www/pages/accueil.tpl': { content: 'Bonjour' }, '/opt/config/prod.php': { content: '<?php $DB="flag{lfi_lit_la_config}"; ?>', secret: true } }; }
      },
      story: 'Une inclusion de template (LFI) : l’appli charge le fichier de « page » que tu nommes. On s’en sert pour lire la config de production rangée ailleurs.',
      goal: 'Lis <code>/opt/config/prod.php</code> depuis <code>/opt/webapp/www/pages/</code> :<pre>tpl: TON_PAYLOAD</pre>',
      lesson: '<p>LFI (Local File Inclusion) : le serveur inclut un fichier local à partir d’un nom contrôlé. La traversée <code>../</code> permet de sortir du dossier des pages.</p>' +
        '<p>Remonte : <code>pages → www → webapp → opt</code> (3 crans), puis <code>config/prod.php</code> ⇒ <code>../../../config/prod.php</code>.</p>' +
        '<p>🛡 Défense : inclure uniquement depuis une liste blanche de fichiers, jamais un chemin libre.</p>',
      starter: 'tpl: accueil.tpl\n',
      hints: ['Compte : pages, www, webapp → 3 crans jusqu’à /opt.', 'Puis config/prod.php.', 'tpl: ../../../config/prod.php'],
      solution: 'tpl: ../../../config/prod.php\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_8', ch: 4, ord: 8, title: 'Jusqu’à la racine', job: 'Chapitre 4 · Chemins & fichiers', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/data/sites/clientA/public_html/',
        fs: function () { return { '/data/sites/clientA/public_html/index.html': { content: 'ok' }, '/flag': { content: 'flag{a_la_racine}', secret: true } }; }
      },
      story: 'Hébergement mutualisé : chaque client a un dossier profond. Le drapeau, lui, est posé à la racine absolue du système.',
      goal: 'Lis le fichier <code>/flag</code> (à la racine) :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>De <code>/data/sites/clientA/public_html/</code> jusqu’à <code>/</code> : 4 dossiers (<code>public_html → clientA → sites → data</code>).</p>' +
        '<p><code>../../../../flag</code> résout en <code>/flag</code>.</p>' +
        '<p>🛡 Défense : en hébergement mutualisé, chaque site doit être confiné (chroot/conteneur) pour ne jamais atteindre la racine commune.</p>',
      starter: 'file: index.html\n',
      hints: ['Quatre dossiers jusqu’à la racine.', 'Quatre ../ puis flag.', 'file: ../../../../flag'],
      solution: 'file: ../../../../flag\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4_9', ch: 4, ord: 9, title: 'Le drapeau bien caché', job: 'Chapitre 4 · Chemins & fichiers', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/var/www/html/uploads/',
        fs: function () { return { '/var/www/html/uploads/photo.jpg': { content: 'JPG…' }, '/var/secret/flag.txt': { content: 'flag{traversee_profonde}', secret: true } }; }
      },
      story: 'Dernier exercice du chapitre : le dossier d’upload est profond, et le drapeau est rangé dans un dossier système à part.',
      goal: 'Lis <code>/var/secret/flag.txt</code> depuis le dossier d’upload :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>On remonte de <code>/var/www/html/uploads/</code> jusqu’à <code>/</code> (4 crans : <code>uploads → html → www → var</code>), puis on redescend dans <code>var/secret/</code>.</p>' +
        '<p><code>../../../../var/secret/flag.txt</code>.</p>' +
        '<p>🛡 Défense : canoniser puis vérifier l’appartenance au dossier autorisé ; interdire <code>..</code> ; séparer les dossiers d’upload du reste du système.</p>',
      starter: 'file: photo.jpg\n',
      hints: ['Remonte à la racine (4 ../) puis redescends dans var/secret.', 'Le fichier est /var/secret/flag.txt.', 'file: ../../../../var/secret/flag.txt'],
      solution: 'file: ../../../../var/secret/flag.txt\n',
      tests: [{}], rules: {}
    },

    /* ============================================================= CHAPITRE 5
     *  Logique & accès — IDOR, contournement d’autorisation (sim logic).
     * ========================================================================= */
    {
      id: 'cyb5_1', ch: 5, ord: 1, title: 'Le profil du voisin', job: 'Chapitre 5 · Logique & accès', stars: 1, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{idor_profil}', defense: 'Défense : vérifier côté serveur que l’utilisateur connecté a le droit de voir l’id demandé, pas seulement qu’il est connecté.',
        state: function () { return { session: 'lea', users: { '12': { name: 'Léa', role: 'client' }, '34': { name: 'Marc', role: 'client' }, '1': { name: 'root', role: 'admin', flag: 'flag{idor_profil}' } } }; },
        panel: function (st, req) {
          var rows = ''; for (var id in st.users) { var u = st.users[id]; rows += '<tr class="' + (req && req.id === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + u.name + '</td><td>' + u.role + '</td></tr>'; }
          return { title: 'Profils — session : ' + st.session, html: '<p class="cy-note">Connecté en tant que « ' + st.session +' » (id 12).</p><table class="cy-res"><tr><th>id</th><th>nom</th><th>rôle</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          var u = st.users[req.id];
          if (!u) return { fail: 'Aucun profil avec l’id ' + req.id + '.' };
          if (u.flag) return { ok: true, msg: 'Profil ' + req.id + ' (' + u.name + ') : ' + u.flag, win: 'Tu as lu le profil de l’admin en changeant l’id : c’est une faille IDOR.' };
          return { fail: 'Profil ' + req.id + ' lu (' + u.name + '), mais ce n’est pas la cible. Essaie un autre id.' };
        }
      },
      story: 'Une page profil affiche <code>GET /profil?id=&lt;id&gt;</code>. Elle vérifie que tu es connecté… mais pas que l’id est le tien.',
      goal: 'Tu es « lea » (id 12). Lis le profil de l’administrateur en changeant l’id. L’admin porte l’id 1 :<pre>id: 1</pre>',
      lesson: '<p>Une <b>IDOR</b> (référence directe à un objet non protégée) : le serveur renvoie l’objet dont tu donnes l’id, sans vérifier qu’il t’appartient.</p>' +
        '<p>Écris la requête en <code>clé: valeur</code>. Il suffit de remplacer ton id par celui d’un autre.</p>' +
        '<p>🛡 Défense : contrôler le droit d’accès à chaque objet, côté serveur.</p>',
      starter: 'id: 12\n',
      hints: ['Change juste la valeur de l’id.', 'Le profil admin a l’id 1.', 'id: 1'],
      solution: 'id: 1\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_2', ch: 5, ord: 2, title: 'La facture d’un autre', job: 'Chapitre 5 · Logique & accès', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{idor_facture}', defense: 'Défense : à chaque accès, vérifier que la facture appartient bien au client connecté.',
        state: function () { return { session: 'client#204', factures: { '2001': { client: 'client#204', montant: '42 €' }, '2002': { client: 'client#204', montant: '13 €' }, '2050': { client: 'PDG', montant: '9 000 €', flag: 'flag{idor_facture}' } } }; },
        panel: function (st, req) {
          var rows = ''; for (var id in st.factures) { var f = st.factures[id]; rows += '<tr class="' + (req && req.facture === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + f.client + '</td><td class="cy-secret">' + f.montant + '</td></tr>'; }
          return { title: 'Facturation — ' + st.session, html: '<p class="cy-note">Tes factures : 2001 et 2002.</p><table class="cy-res"><tr><th>facture</th><th>client</th><th>montant</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          var f = st.factures[req.facture];
          if (!f) return { fail: 'Facture ' + req.facture + ' introuvable.' };
          if (f.flag) return { ok: true, msg: 'Facture ' + req.facture + ' (' + f.client + ') : ' + f.flag, win: 'Tu as ouvert la facture d’un autre client en devinant son numéro.' };
          return { fail: 'Facture ' + req.facture + ' lue (' + f.client + '), mais ce n’est pas la bonne.' };
        }
      },
      story: 'Le portail de facturation sert <code>GET /facture?facture=&lt;n°&gt;</code>. Les numéros se suivent : il suffit d’en essayer un qui n’est pas à toi.',
      goal: 'Lis une facture qui ne t’appartient pas. Celle du PDG porte le numéro 2050 :<pre>facture: TON_PAYLOAD</pre>',
      lesson: '<p>Quand les identifiants sont séquentiels et non protégés, deviner ceux des autres est trivial (incrémentation d’id).</p>' +
        '<p>Change le numéro de facture pour un numéro voisin qui n’est pas le tien.</p>' +
        '<p>🛡 Défense : contrôle d’accès par objet + identifiants non devinables (UUID) pour compliquer l’énumération.</p>',
      starter: 'facture: 2001\n',
      hints: ['Essaie un numéro que tu n’as pas.', 'La facture du PDG est 2050.', 'facture: 2050'],
      solution: 'facture: 2050\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_3', ch: 5, ord: 3, title: 'Je décrète mon rôle', job: 'Chapitre 5 · Logique & accès', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{role_cote_client}', defense: 'Défense : ne jamais faire confiance à un rôle envoyé par le client ; déduire les droits de la session côté serveur.',
        state: function () { return { session: 'bob', roleReel: 'user' }; },
        panel: function (st, req) {
          var demande = (req && req.role) || '(aucun)';
          return { title: 'Espace membre — ' + st.session, html: '<p class="cy-note">Rôle réel du compte : <b>' + st.roleReel + '</b>.</p><p>Le serveur lit le champ <code>role</code> envoyé dans la requête : <b>' + demande + '</b>.</p>' };
        },
        check: function (st, req) {
          if (String(req.role || '').toLowerCase() === 'admin') return { ok: true, msg: 'Rôle « admin » accepté tel quel. flag{role_cote_client}', win: 'Le serveur a cru le champ « role » envoyé par le client.' };
          return { fail: 'Rôle « ' + (req.role || '') + ' » : accès limité. Le serveur attend un champ role.' };
        }
      },
      story: 'Un bug classique : le serveur lit ton rôle dans la requête que TU envoies, au lieu de le déduire de ta session. Déclare-toi admin.',
      goal: 'Envoie un paramètre <code>role</code> qui te fait passer pour administrateur :<pre>role: TON_PAYLOAD</pre>',
      lesson: '<p>Ici, le champ <code>role</code> vient du client. Le serveur lui fait aveuglément confiance (« contrôle d’accès cassé »).</p>' +
        '<p>Il suffit de mettre <code>role: admin</code> dans la requête.</p>' +
        '<p>🛡 Défense : les droits se décident côté serveur, à partir de la session authentifiée — jamais d’un champ fourni par l’utilisateur.</p>',
      starter: 'role: user\n',
      hints: ['Le serveur lit le champ role de la requête.', 'Mets-le à admin.', 'role: admin'],
      solution: 'role: admin\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_4', ch: 5, ord: 4, title: 'Le paramètre caché', job: 'Chapitre 5 · Logique & accès', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{parametre_debug}', defense: 'Défense : désactiver les modes debug en production et ne pas se fier à des paramètres cachés pour le contrôle d’accès.',
        state: function () { return { session: 'visiteur', page: 'tableau de bord' }; },
        panel: function (st, req) {
          var dbg = /^(1|true|on|yes)$/i.test(String((req && req.debug) || ''));
          return { title: 'Application — ' + st.session, html: '<p class="cy-note">Vue normale : ' + st.page + '.</p><p>Mode debug : <b>' + (dbg ? 'ACTIVÉ' : 'désactivé') + '</b>. Quand il est activé, l’appli affiche des informations réservées.</p>' };
        },
        check: function (st, req) {
          if (/^(1|true|on|yes)$/i.test(String(req.debug || ''))) return { ok: true, msg: 'Mode debug activé par paramètre : flag{parametre_debug}', win: 'Un paramètre non documenté débloque une fonctionnalité réservée.' };
          return { fail: 'Rien de spécial. Existe-t-il un paramètre « debug » que le serveur lirait ?' };
        }
      },
      story: 'Les développeurs ont laissé un mode debug qui s’active par un paramètre non documenté. Devine-le.',
      goal: 'Active le mode debug en ajoutant le bon paramètre à la requête :<pre>debug: TON_PAYLOAD</pre>',
      lesson: '<p>Des paramètres cachés (<code>debug</code>, <code>admin</code>, <code>test</code>…) traînent souvent dans le code. Les activer donne accès à des fonctions réservées : c’est du contrôle d’accès défaillant.</p>' +
        '<p>Beaucoup de code accepte <code>1</code>, <code>true</code>, <code>on</code> comme « vrai ». Mets <code>debug: true</code>.</p>' +
        '<p>🛡 Défense : pas de porte dérobée « pratique » ; les fonctions sensibles exigent une vraie autorisation.</p>',
      starter: 'page: accueil\n',
      hints: ['Ajoute un paramètre nommé debug.', 'Mets-le à true (ou 1).', 'debug: true'],
      solution: 'debug: true\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_5', ch: 5, ord: 5, title: 'Le compte numéro zéro', job: 'Chapitre 5 · Logique & accès', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{id_zero_superadmin}', defense: 'Défense : tester les cas limites (0, valeurs négatives, très grands id) et contrôler l’accès pour chacun.',
        state: function () { return { session: 'user#7', comptes: { '7': { nom: 'toi', niveau: 'standard' }, '8': { nom: 'ami', niveau: 'standard' }, '0': { nom: 'système', niveau: 'superadmin', flag: 'flag{id_zero_superadmin}' } } }; },
        panel: function (st, req) {
          var rows = ''; for (var id in st.comptes) { var a = st.comptes[id]; rows += '<tr class="' + (req && req.compte === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + a.nom + '</td><td>' + a.niveau + '</td></tr>'; }
          return { title: 'Comptes — ' + st.session, html: '<p class="cy-note">Les id « utiles » commencent à 1. Et le 0 ?</p><table class="cy-res"><tr><th>id</th><th>nom</th><th>niveau</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          var a = st.comptes[req.compte];
          if (!a) return { fail: 'Pas de compte « ' + req.compte + ' ».' };
          if (a.flag) return { ok: true, msg: 'Compte ' + req.compte + ' (' + a.nom + ', ' + a.niveau + ') : ' + a.flag, win: 'Le compte caché à l’id 0 était le compte système.' };
          return { fail: 'Compte ' + req.compte + ' (' + a.nom + ') : rien de spécial.' };
        }
      },
      story: 'Les comptes visibles démarrent à l’id 1. Mais un compte système « invisible » se cache souvent à l’id 0.',
      goal: 'Accède au compte caché en testant une valeur limite : l’id 0 :<pre>compte: TON_PAYLOAD</pre>',
      lesson: '<p>Les comptes « spéciaux » (système, superadmin) occupent souvent le premier id, le 0, que l’interface ne montre pas.</p>' +
        '<p>Pense aussi aux valeurs négatives ou énormes : les cas limites révèlent des objets oubliés.</p>' +
        '<p>🛡 Défense : contrôle d’accès systématique, y compris sur les id « spéciaux » ; ne pas cacher un objet simplement en l’absentant de l’UI.</p>',
      starter: 'compte: 7\n',
      hints: ['Essaie un id que l’interface ne montre pas.', 'Le premier id possible est 0.', 'compte: 0'],
      solution: 'compte: 0\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_6', ch: 5, ord: 6, title: 'Le prix côté client', job: 'Chapitre 5 · Logique & accès', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{prix_manipule}', defense: 'Défense : recalculer le prix côté serveur à partir du catalogue ; ne jamais faire confiance à un prix envoyé par le client.',
        state: function () { return { session: 'acheteur', article: 'Ordinateur portable', prixCatalogue: '1200' }; },
        panel: function (st, req) {
          var p = (req && req.prix !== undefined) ? req.prix : st.prixCatalogue;
          return { title: 'Panier — ' + st.session, html: '<p class="cy-note">Article : ' + st.article + ' — prix catalogue : ' + st.prixCatalogue + ' €.</p><p>Prix envoyé par le navigateur : <b>' + p + ' €</b>. Le serveur facture ce montant sans le revérifier.</p>' };
        },
        check: function (st, req) {
          if (req.prix === undefined) return { fail: 'Le serveur attend un champ « prix » dans la commande.' };
          var p = Number(req.prix);
          if (isNaN(p)) return { fail: 'Le prix doit être un nombre.' };
          if (p <= 0) return { ok: true, msg: 'Commande validée au prix de ' + p + ' € : flag{prix_manipule}', win: 'Tu as acheté l’article pour rien en changeant le prix envoyé.' };
          return { fail: 'Commande à ' + p + ' €. Peux-tu baisser ce prix jusqu’à le rendre nul ?' };
        }
      },
      story: 'Une boutique en ligne envoie le prix de l’article depuis… le navigateur. Le serveur facture ce que le client lui dit. Erreur de logique métier.',
      goal: 'Commande l’ordinateur à 1200 € pour 0 € en modifiant le prix envoyé :<pre>prix: TON_PAYLOAD</pre>',
      lesson: '<p>Faille de <b>logique métier</b> : une donnée qui devrait être décidée par le serveur (le prix) est acceptée depuis le client.</p>' +
        '<p>Mets le prix à 0 (ou négatif) : <code>prix: 0</code>.</p>' +
        '<p>🛡 Défense : le serveur recalcule TOUJOURS les montants depuis sa propre source de vérité.</p>',
      starter: 'prix: 1200\n',
      hints: ['Le serveur facture le prix que tu envoies.', 'Mets-le à 0.', 'prix: 0'],
      solution: 'prix: 0\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_7', ch: 5, ord: 7, title: 'La quantité négative', job: 'Chapitre 5 · Logique & accès', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{quantite_negative}', defense: 'Défense : valider les bornes (quantité ≥ 1) et recalculer les totaux côté serveur.',
        state: function () { return { session: 'client', article: 'Livre', prixUnitaire: '20' }; },
        panel: function (st, req) {
          var q = (req && req.qte !== undefined) ? req.qte : '1';
          var total = Number(q) * Number(st.prixUnitaire);
          return { title: 'Commande — ' + st.session, html: '<p class="cy-note">' + st.article + ' à ' + st.prixUnitaire + ' € l’unité.</p><p>Quantité : <b>' + q + '</b> → total facturé : <b>' + (isNaN(total) ? '?' : total) + ' €</b>. Un total négatif serait un remboursement…</p>' };
        },
        check: function (st, req) {
          if (req.qte === undefined) return { fail: 'Le serveur attend un champ « qte » (quantité).' };
          var q = Number(req.qte);
          if (isNaN(q)) return { fail: 'La quantité doit être un nombre.' };
          if (q < 0) return { ok: true, msg: 'Total négatif → ton compte est crédité : flag{quantite_negative}', win: 'Une quantité négative transforme un achat en remboursement.' };
          return { fail: 'Quantité ' + q + '. Et si elle était négative ?' };
        }
      },
      story: 'Le panier accepte n’importe quelle quantité. Une quantité négative donne un total négatif — c’est-à-dire un remboursement sur ton compte.',
      goal: 'Fais-toi créditer en commandant une quantité négative :<pre>qte: TON_PAYLOAD</pre>',
      lesson: '<p>Oublier de borner les entrées est une faille de logique : <code>total = qte × prix</code> devient négatif si <code>qte &lt; 0</code>.</p>' +
        '<p>Essaie <code>qte: -5</code>.</p>' +
        '<p>🛡 Défense : valider côté serveur (quantité entière ≥ 1), refuser les valeurs absurdes, recalculer les totaux.</p>',
      starter: 'qte: 1\n',
      hints: ['Le total suit qte × prix.', 'Rends la quantité négative.', 'qte: -5'],
      solution: 'qte: -5\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_8', ch: 5, ord: 8, title: 'Accès direct à l’admin', job: 'Chapitre 5 · Logique & accès', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{forced_browsing}', defense: 'Défense : protéger CHAQUE route sensible par un contrôle d’autorisation, pas seulement cacher le lien dans le menu.',
        state: function () { return { session: 'user', menu: ['/accueil', '/profil'] }; },
        panel: function (st, req) {
          var p = (req && req.route) || '(aucune)';
          return { title: 'Navigation — ' + st.session, html: '<p class="cy-note">Liens visibles dans ton menu : ' + st.menu.join(', ') + '.</p><p>Route demandée : <b>' + p + '</b>. Les pages d’admin ne sont pas dans le menu… mais existent toujours.</p>' };
        },
        check: function (st, req) {
          if (!req.route) return { fail: 'Indique la route à ouvrir (champ « route »).' };
          if (/\/admin/i.test(req.route)) return { ok: true, msg: 'Page d’administration ouverte sans y avoir droit : flag{forced_browsing}', win: 'Une route non listée mais non protégée : c’est du forced browsing.' };
          return { fail: 'Route « ' + req.route + ' » : rien d’intéressant. L’admin se trouve ailleurs.' };
        }
      },
      story: 'Le menu ne montre pas la page d’administration — mais l’URL existe toujours. Il suffit de la demander directement (« forced browsing »).',
      goal: 'Ouvre une page d’admin absente du menu en demandant sa route :<pre>route: TON_PAYLOAD</pre>',
      lesson: '<p>Cacher un lien n’est pas une protection. Si la route <code>/admin/...</code> n’exige pas d’autorisation, n’importe qui peut la demander.</p>' +
        '<p>Essaie une route contenant <code>/admin</code>, par ex. <code>/admin/panel</code>.</p>' +
        '<p>🛡 Défense : contrôle d’autorisation sur chaque endpoint serveur, indépendamment de l’interface.</p>',
      starter: 'route: /profil\n',
      hints: ['Devine une URL d’administration.', 'Elle contient /admin.', 'route: /admin/panel'],
      solution: 'route: /admin/panel\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5_9', ch: 5, ord: 9, title: 'IDOR en deux temps', job: 'Chapitre 5 · Logique & accès', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{idor_plus_scope}', defense: 'Défense : contrôle d’accès par objet ET ignorer les paramètres clients qui élargissent la portée (scope) d’une réponse.',
        state: function () { return { session: 'patient#88', dossiers: { '88': { nom: 'toi', note: 'RAS' }, '90': { nom: 'autre patient', note: 'confidentiel' }, '7': { nom: 'VIP', note: 'secret', flag: 'flag{idor_plus_scope}' } } }; },
        panel: function (st, req) {
          var rows = ''; for (var id in st.dossiers) { var d = st.dossiers[id]; rows += '<tr class="' + (req && req.dossier === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + d.nom + '</td></tr>'; }
          return { title: 'Dossiers médicaux — ' + st.session, html: '<p class="cy-note">Par défaut, l’API renvoie une version « résumé ». Le champ caché <code>scope=full</code> renvoie tout.</p><table class="cy-res"><tr><th>dossier</th><th>patient</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          var d = st.dossiers[req.dossier];
          if (!d) return { fail: 'Dossier ' + req.dossier + ' introuvable.' };
          if (!d.flag) return { fail: 'Dossier ' + req.dossier + ' (' + d.nom + ') : ce n’est pas la cible. Essaie un autre numéro.' };
          if (String(req.scope || '').toLowerCase() !== 'full') return { fail: 'Dossier ' + req.dossier + ' trouvé, mais seul le résumé est renvoyé. Il manque un paramètre pour tout voir (scope).' };
          return { ok: true, msg: 'Dossier complet ' + req.dossier + ' (' + d.nom + ') : ' + d.flag, win: 'Tu as combiné un IDOR (changer le dossier) et une élévation de portée (scope=full).' };
        }
      },
      story: 'Avant le contrat final : l’API de dossiers médicaux a DEUX faiblesses. Le numéro de dossier n’est pas protégé (IDOR) et un paramètre <code>scope</code> élargit la réponse. Il faut combiner les deux.',
      goal: 'Lis le dossier complet du VIP (dossier 7) en demandant aussi la portée complète :<pre>dossier: ...\nscope: ...</pre>',
      lesson: '<p>Les failles de logique se combinent. Ici : d’abord l’IDOR (demander le dossier d’un autre, le 7), puis un paramètre <code>scope=full</code> que le serveur accepte sans vérifier.</p>' +
        '<p>Écris deux lignes : <code>dossier: 7</code> et <code>scope: full</code>.</p>' +
        '<p>🛡 Défense : autoriser chaque objet par la session, et ignorer tout paramètre client qui élargit les données renvoyées.</p>',
      starter: 'dossier: 88\nscope: full\n',
      hints: ['Change d’abord le numéro de dossier (le VIP est le 7).', 'Ajoute ensuite une 2ᵉ ligne scope: full.', 'dossier: 7\nscope: full'],
      solution: 'dossier: 7\nscope: full\n',
      tests: [{}], rules: {}
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
