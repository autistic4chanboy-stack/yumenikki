/* =========================================================================
 *  42 ORIGINS — labos de cybersécurité (contrats finaux des 10 chapitres)
 *  Tout est SIMULÉ et pédagogique : comprendre la faille pour la corriger.
 *  Les missions ord 1 à 9 sont dans missions_cyber_*.js.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cyber = O42.missions.cyber || [];
  var esc = function (s) { return O42.util ? require0(s) : s; };
  function require0(s) { return String(s); }

  O42.missions.cyber.push(
    {
      id: 'cyb1', title: 'Le message chiffré', job: 'Chapitre 1 · Premiers réflexes', stars: 1, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'caesar', cipher: 'mshn{jhlzhy_iylhrz}', plain: 'flag{caesar_breaks}', flag: 'flag{caesar_breaks}' },
      story: 'Un agent a intercepté un message. Il est « chiffré »… avec le plus vieux code du monde : celui de César (chaque lettre décalée).',
      goal: 'Retrouve le texte clair derrière <code>mshn{jhlzhy_iylhrz}</code> et écris-le dans l’éditeur. Le panneau de droite montre les 26 décalages possibles — un seul a du sens.',
      lesson: '<p>Le <b>chiffre de César</b> décale chaque lettre d’un nombre fixe. Il n’y a que 25 clés possibles : on les teste toutes (« force brute »).</p>' +
        '<p>Première règle du métier : reconnaître un encodage/chiffrement et savoir l’inverser. Ici, cherche la rotation qui donne un mot lisible commençant par <code>flag{</code>.</p>' +
        '<p>🛡 On ne protège jamais un secret avec un chiffre « maison ». On utilise de la vraie cryptographie (AES, etc.).</p>',
      starter: 'mshn{jhlzhy_iylhrz}\n',
      hints: ['Regarde la colonne de droite : quelle rotation donne « flag{… » ?', 'Le décalage est de 19 (ou −7). Écris le texte déchiffré.', 'flag{caesar_breaks}'],
      solution: 'flag{caesar_breaks}\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb2', title: 'La porte dérobée du login', job: 'Chapitre 2 · Injection SQL', stars: 2, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'username', fixed: { password: 'inconnu' },
        db: function () { return { users: { cols: ['id', 'username', 'password', 'role'], rows: [{ id: 1, username: 'admin', password: 'Tr0ub4dour', role: 'admin' }, { id: 2, username: 'bob', password: 'hunter2', role: 'user' }] } }; },
        query: function (v) { return "SELECT * FROM users WHERE username='" + v.username + "' AND password='" + v.password + "'"; },
        success: function (rows) { return rows.length > 0; }, flag: 'ACCESS-GRANTED', winMsg: 'Connecté en tant qu’admin !'
      },
      story: 'Un site vérifie le mot de passe en collant ton nom d’utilisateur directement dans une requête SQL. Tu ne connais pas le mot de passe… mais tu n’en as pas besoin.',
      goal: 'Entre un <b>username</b> qui fait entrer sans connaître le mot de passe. Écris-le ainsi :<pre>username: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur fait :</p><pre>SELECT * FROM users\nWHERE username=\'<entrée>\' AND password=\'…\'</pre>' +
        '<p>Si ton entrée contient une apostrophe, tu « sors » de la chaîne et tu réécris la logique. <code>\' OR \'1\'=\'1</code> rend la condition toujours vraie ; <code>--</code> met le reste en commentaire (ignore le mot de passe).</p>' +
        '<p>🛡 Défense : <b>requêtes préparées</b> (paramètres liés), jamais de concaténation.</p>',
      starter: 'username: admin\n',
      hints: ['Ferme la chaîne avec une apostrophe, puis ajoute une condition toujours vraie.', "Termine par -- pour ignorer la vérification du mot de passe.", "username: ' OR '1'='1' -- "],
      solution: "username: ' OR '1'='1' -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'Tr0ub4dour', msg: 'Ne triche pas en écrivant le mot de passe : exploite l’injection.' }] }
    },
    {
      id: 'cyb3', title: 'Le ping piégé', job: 'Chapitre 3 · Injection de commande', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'cmdi', field: 'host', template: 'ping -c1 <host>', build: function (h) { return 'ping -c1 ' + h; },
        fs: function () { return { 'index.php': { content: '<?php ... ?>' }, 'flag.txt': { content: 'FLAG=flag{rce_ftw}', secret: true } }; },
        success: function (out) { return /flag\{/.test(out); }, flag: 'flag{rce_ftw}'
      },
      story: 'Un outil d’admin « pingue » l’adresse que tu donnes, en construisant une ligne de shell. Mauvaise idée.',
      goal: 'Donne un <b>host</b> qui, en plus du ping, lit le fichier <code>flag.txt</code> :<pre>host: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur exécute littéralement : <code>ping -c1 &lt;host&gt;</code> dans un shell.</p>' +
        '<p>En shell, <code>;</code> <code>&amp;&amp;</code> et <code>|</code> enchaînent des commandes. <code>127.0.0.1; cat flag.txt</code> lance le ping… puis une commande à toi.</p>' +
        '<p>🛡 Défense : ne jamais passer d’entrée à un shell ; utiliser une API avec arguments séparés et valider l’entrée.</p>',
      starter: 'host: 127.0.0.1\n',
      hints: ['Enchaîne une seconde commande après le ping.', 'Utilise ; puis cat sur le bon fichier.', 'host: 127.0.0.1; cat flag.txt'],
      solution: 'host: 127.0.0.1; cat flag.txt\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb4', title: 'Hors du dossier public', job: 'Chapitre 4 · Chemins & fichiers', stars: 3, scene: 'terminal',
      cyber: {
        sim: 'pathtrav', field: 'file', base: '/var/www/html/',
        fs: function () { return { '/var/www/html/index.html': { content: '<h1>Accueil</h1>' }, '/var/www/html/style.css': { content: 'body{}' }, '/etc/passwd': { content: 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33', secret: true }, '/var/secret/flag.txt': { content: 'flag{dot_dot_slash}', secret: true } }; },
        success: function (path) { return /etc\/passwd|flag/.test(path); }, flag: 'flag{dot_dot_slash}'
      },
      story: 'Un serveur sert les fichiers du dossier public à partir du nom que tu demandes. Rien ne t’empêche de remonter l’arborescence.',
      goal: 'Demande un <b>file</b> qui sort de <code>/var/www/html/</code> pour lire <code>/etc/passwd</code> :<pre>file: TON_PAYLOAD</pre>',
      lesson: '<p>Le serveur ouvre <code>/var/www/html/ + &lt;file&gt;</code>. La séquence <code>../</code> remonte d’un dossier.</p>' +
        '<p>Compte les niveaux : de <code>/var/www/html/</code> à <code>/</code> il faut remonter 3 fois, puis descendre vers <code>etc/passwd</code>.</p>' +
        '<p>🛡 Défense : refuser « .. », résoudre le chemin et vérifier qu’il reste dans le dossier autorisé.</p>',
      starter: 'file: index.html\n',
      hints: ['Chaque ../ remonte d’un dossier.', 'Il faut 3 remontées pour atteindre la racine /.', 'file: ../../../etc/passwd'],
      solution: 'file: ../../../etc/passwd\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb5', title: 'Le compte des autres', job: 'Chapitre 5 · Logique & accès', stars: 4, scene: 'terminal',
      cyber: {
        sim: 'logic', flag: 'flag{idor_pwned}', defense: 'Défense : vérifier que l’utilisateur connecté a le DROIT d’accéder à l’id demandé (contrôle d’accès côté serveur), pas seulement qu’il est connecté.',
        state: function () { return { session: 'bob', accounts: { '1001': { owner: 'bob', solde: '320.00' }, '1002': { owner: 'alice', solde: '58.00' }, '9999': { owner: 'CEO', solde: '9 000 000.00', flag: 'flag{idor_pwned}' } } }; },
        panel: function (st, req) {
          var rows = '';
          for (var id in st.accounts) { var a = st.accounts[id]; rows += '<tr class="' + (req.account === id ? 'cy-hit' : '') + '"><td>' + id + '</td><td>' + a.owner + '</td><td class="cy-secret">' + a.solde + ' €</td></tr>'; }
          return { title: 'API banque — session : ' + st.session, html: '<p class="cy-note">Tu es connecté en tant que « ' + st.session + ' » (propriétaire du compte 1001).</p><table class="cy-res"><tr><th>account</th><th>owner</th><th>solde</th></tr>' + rows + '</table>' };
        },
        check: function (st, req) {
          var acc = st.accounts[req.account];
          if (!acc) return { fail: 'Ce numéro de compte n’existe pas.' };
          if (acc.flag) return { ok: true, msg: 'Solde du compte ' + req.account + ' : ' + acc.solde + ' €  (' + acc.flag + ')', win: 'Tu as lu un compte qui ne t’appartient pas : c’est une faille IDOR.' };
          return { fail: 'Compte ' + req.account + ' lu (' + acc.owner + '). Mais ce n’est pas le compte qui cache le drapeau. Essaie un autre numéro.' };
        }
      },
      story: 'L’appli bancaire affiche un compte à partir de son numéro passé dans la requête. Elle vérifie que tu es connecté… mais pas que le compte est le tien.',
      goal: 'Tu es « bob » (compte 1001). Lis le compte du PDG (9999) en changeant le paramètre :<pre>account: 9999</pre>',
      lesson: '<p>L’API répond à <code>GET /api/account?account=&lt;id&gt;</code> en renvoyant le solde de cet id, sans vérifier qu’il t’appartient. C’est une faille <b>IDOR</b> (référence directe non protégée).</p>' +
        '<p>Écris la requête ligne par ligne, format <code>clé: valeur</code>.</p>' +
        '<p>🛡 Défense : contrôler le droit d’accès à chaque objet, côté serveur.</p>',
      starter: 'account: 1001\n',
      hints: ['Change juste le numéro de compte.', 'Le compte du PDG porte le numéro 9999.', 'account: 9999'],
      solution: 'account: 9999\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb6', title: 'Déborder la variable', job: 'Chapitre 6 · Mémoire', stars: 4, scene: 'terminal',
      cyber: { sim: 'overflow', buf: 16, afterLen: 1, afterInit: 0, varName: 'name[16]', afterName: 'is_admin', winMsg: 'is_admin = 1 → tu es administrateur !', flag: 'flag{smashed}', success: function (after) { return after !== 0; } },
      story: 'Un vieux programme C lit ton nom avec <code>gets()</code> dans un tampon de 16 octets. Juste après, en mémoire, se trouve la variable <code>is_admin</code>.',
      goal: 'Écris une entrée assez longue pour <b>déborder</b> le tampon et mettre <code>is_admin</code> à autre chose que 0. Observe la mémoire à droite.',
      lesson: '<pre>char name[16];\nint  is_admin = 0;   // juste après name\ngets(name);           // ne vérifie PAS la taille !</pre>' +
        '<p><code>gets</code> copie tout ce que tu tapes, même au-delà des 16 octets : les octets en trop écrasent <code>is_admin</code>.</p>' +
        '<p>Il faut remplir les 16 octets du tampon, puis un octet de plus pour toucher <code>is_admin</code>.</p>' +
        '<p>🛡 Défense : <code>fgets</code> avec une taille, jamais <code>gets</code>.</p>',
      starter: 'moi\n',
      hints: ['Le tampon fait 16 octets. Combien de caractères pour arriver juste après ?', 'Tape 16 caractères, puis au moins 1 de plus.', 'AAAAAAAAAAAAAAAA1'],
      solution: 'AAAAAAAAAAAAAAAA1\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb7', title: 'Le commentaire qui vole', job: 'Chapitre 7 · Web côté client', stars: 4, scene: 'terminal',
      cyber: { sim: 'xss', cookie: 'SESSION=flag{xss_steals_cookies}', template: '<div class="comment">{{input}}</div>', flag: 'flag{xss_steals_cookies}' },
      story: 'Un site affiche les commentaires tels quels, sans les échapper. Tu peux y glisser du code qui s’exécutera chez les autres visiteurs.',
      goal: 'Poste un commentaire qui exécute du JavaScript et vole le cookie de session de la victime (<code>document.cookie</code>).',
      lesson: '<p>Ton commentaire est inséré dans la page avec <code>innerHTML</code>, sans échappement. Une balise <code>&lt;script&gt;</code> ou un attribut <code>onerror</code> s’exécute alors dans le navigateur de la victime.</p>' +
        '<pre>&lt;script&gt;fetch(\'/x?c=\'+document.cookie)&lt;/script&gt;</pre>' +
        '<p>🛡 Défense : afficher les données avec <code>textContent</code> (pas <code>innerHTML</code>), une CSP, et des cookies <code>HttpOnly</code>.</p>',
      starter: 'Super article !\n',
      hints: ['Il faut injecter une balise qui exécute du JavaScript.', 'Vise document.cookie pour voler la session.', "<script>fetch('/x?c='+document.cookie)</script>"],
      solution: "<script>new Image().src='/log?c='+document.cookie</script>\n",
      tests: [{}], rules: {}
    },
    {
      id: 'cyb8', title: 'Le jeton forgé', job: 'Chapitre 8 · Jetons & sessions', stars: 5, scene: 'terminal',
      cyber: { sim: 'token', flag: 'JWT-FORGED' },
      story: 'Le site te donne un jeton JWT après connexion. Il contient ton rôle… et le serveur accepte, par erreur, les jetons « sans signature » (alg: none).',
      goal: 'Forge un jeton <b>header.payload.</b> avec <code>{"alg":"none"}</code> et <code>{"role":"admin"}</code>, encodés en base64url, collés avec des points. Colle-le dans l’éditeur.',
      lesson: '<p>Un JWT = <code>base64(header).base64(payload).signature</code>. Si le header dit <code>alg:none</code> et que le serveur l’accepte, aucune signature n’est vérifiée : tu peux mettre ce que tu veux dans le payload.</p>' +
        '<p>Encode <code>{"alg":"none"}</code> et <code>{"role":"admin"}</code> en base64, sépare par des points, laisse la signature vide (le dernier point).</p>' +
        '<p>🛡 Défense : refuser <code>alg:none</code>, vérifier la signature avec un secret robuste, contrôler les droits côté serveur.</p>',
      starter: 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.abc\n',
      hints: ['Le payload doit contenir role=admin, et le header alg=none.', 'base64({"alg":"none"}) = eyJhbGciOiJub25lIn0 ; base64({"role":"admin"}) = eyJyb2xlIjoiYWRtaW4ifQ', 'eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.'],
      solution: 'eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb9', title: 'La clé trop courte', job: 'Chapitre 9 · Cryptographie', stars: 5, scene: 'terminal',
      cyber: { sim: 'crypto', kind: 'xor', cipherHex: '2d29382c3e217b37067a36063c766d2038', flag: 'XOR-BROKEN' },
      story: 'Un développeur a « chiffré » un secret avec un XOR et une clé de 3 lettres répétée. C’est cassable.',
      goal: 'Trouve la clé de 3 lettres qui déchiffre le message. Le texte clair commence par <code>flag{</code>. Écris la clé dans l’éditeur.',
      lesson: '<p>Le chiffrement XOR à clé répétée : <code>chiffré[i] = clair[i] XOR clé[i mod len]</code>. Si on connaît (ou devine) un bout du clair, on retrouve la clé.</p>' +
        '<p>On sait que le clair commence par <code>flag{</code>. En faisant <code>chiffré XOR "flag{"</code> on lit le début de la clé qui se répète.</p>' +
        '<p>🛡 Défense : jamais de XOR « maison » ni de clé courte réutilisée — de la vraie crypto authentifiée.</p>',
      starter: 'ABC\n',
      hints: ['XOR les premiers octets du chiffré avec « flag{ » pour lire la clé.', 'La clé fait 3 lettres majuscules et se répète.', 'KEY'],
      solution: 'KEY\n',
      tests: [{}], rules: {}
    },
    {
      id: 'cyb10', title: 'Opération exfiltration', job: 'Chapitre 10 · Mission rouge', stars: 5, scene: 'terminal',
      cyber: {
        sim: 'sqli', field: 'q', fixed: {},
        db: function () { return { products: { cols: ['name', 'price'], rows: [{ name: 'Clé USB', price: '9' }, { name: 'Casque', price: '49' }] }, users: { cols: ['username', 'password'], rows: [{ username: 'admin', password: 'c0rrectH0rse!' }] } }; },
        query: function (v) { return "SELECT name, price FROM products WHERE name LIKE '%" + v.q + "%'"; },
        success: function (rows) { return rows.some(function (r) { return r.some(function (c) { return /c0rrectH0rse|admin/.test(String(c)); }); }); },
        flag: 'flag{union_exfil}', winMsg: 'Identifiants admin exfiltrés !'
      },
      story: 'Contrat final du chapitre rouge. Une barre de recherche interroge la table des produits. Mais une seule requête bien formée peut aussi voler la table des comptes.',
      goal: 'Dans le champ de recherche <b>q</b>, utilise une injection <code>UNION SELECT</code> pour faire remonter <code>username</code> et <code>password</code> de la table <code>users</code> :<pre>q: TON_PAYLOAD</pre>',
      lesson: '<p>La requête est : <code>SELECT name, price FROM products WHERE name LIKE \'%&lt;q&gt;%\'</code>.</p>' +
        '<p><b>UNION SELECT</b> colle le résultat d’une 2ᵉ requête à la première — à condition d’avoir le même nombre de colonnes (ici 2). On ferme la chaîne, on ajoute <code>UNION SELECT username, password FROM users</code>, puis <code>--</code>.</p>' +
        '<p>🛡 Défense : requêtes préparées, comptes en lecture seule, mots de passe hachés et salés.</p>',
      starter: 'q: usb\n',
      hints: ['Ferme le %\' puis ajoute un UNION SELECT à 2 colonnes.', 'Récupère username et password depuis users.', "q: ' UNION SELECT username, password FROM users -- "],
      solution: "q: ' UNION SELECT username, password FROM users -- \n",
      tests: [{}], rules: { forbidSrc: [{ re: 'c0rrectH0rse', msg: 'Exfiltre le mot de passe par l’injection, ne l’écris pas toi-même.' }] }
    }
  );
  void esc;
})(typeof window !== 'undefined' ? window : globalThis);
