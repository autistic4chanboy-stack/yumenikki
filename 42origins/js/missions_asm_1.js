/* =========================================================================
 *  42 ORIGINS — missions assembleur x86-64, chapitres 1 à 5 (missions 1 à 9)
 *  Les finales (ord 10) sont dans missions_asm.js (a1 … a5).
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.asm = O42.missions.asm || [];

  /* morceaux de code réutilisés */
  var TEXT = 'section .text\n\tglobal\t_start\n\n_start:\n';
  var EXIT0 = '\n\tmov\trax, 60\t\t; exit\n\txor\trdi, rdi\t\t; code 0\n\tsyscall\n';
  function wr(lbl, len, fd) { return '\tmov\trax, 1\t\t; write\n\tmov\trdi, ' + (fd || 1) + '\n\tmov\trsi, ' + lbl + '\n\tmov\trdx, ' + len + '\n\tsyscall\n'; }
  function rd(lbl, n) { return '\tmov\trax, 0\t\t; read\n\tmov\trdi, 0\t\t; fd 0 = stdin\n\tmov\trsi, ' + lbl + '\n\tmov\trdx, ' + n + '\n\tsyscall\n'; }
  /* lit un chiffre tapé et le range (en nombre) dans reg */
  function digit(reg) { return rd('chiffre', 1) + '\tmovzx\t' + reg + ', byte [chiffre]\t; le caractère lu (\'5\' = 53)\n\tsub\t' + reg + ', \'0\'\t\t; 53 - 48 = 5 : le vrai nombre\n'; }
  var LOOP = { re: /\bj[a-z]{1,3}\s+\.?\w+|\bloop\b/.source, msg: 'Il faut une boucle : une étiquette et un saut vers elle.' };

  O42.missions.asm.push(

    /* ===================== Chapitre 1 · Registres et exit ===================== */
    {
      id: 'a1_1', ch: 1, ord: 1, stars: 1,
      title: 'Le code du casier',
      scene: 'door', sceneOpts: { code: 7, title: 'LE CASIER DE NORMA' },
      story: 'Norma, la gardienne du campus, a un casier un peu spécial : il s’ouvre quand un programme se termine avec le <b>code de sortie 7</b>.',
      goal: 'Change le programme pour qu’il se termine avec le code de sortie <code>7</code>.',
      lesson: '<p>Un programme assembleur parle au système avec <code>syscall</code>. Le registre <code>rax</code> dit <b>quel</b> service on veut (60 = exit), <code>rdi</code> donne l’argument (ici le code de sortie).</p>' +
        '<p><code>mov rdi, 5</code> range la valeur 5 dans le registre rdi.</p>',
      starter: TEXT + '\tmov\trax, 60\t\t; 60 = exit\n\tmov\trdi, 0\t\t; le code de sortie\n\tsyscall\t\t\t; le noyau termine le programme\n',
      solution: TEXT + '\tmov\trax, 60\n\tmov\trdi, 7\n\tsyscall\n',
      hints: ['Le code de sortie est la valeur de rdi au moment du syscall.', 'Remplace 0 par 7 dans mov rdi, 0.'],
      tests: [{ exit: 7 }],
      rules: { mustSrc: [{ re: /\bsyscall\b/.source, msg: 'Il faut terminer avec syscall.' }] }
    },
    {
      id: 'a1_2', ch: 1, ord: 2, stars: 1,
      title: 'Le double de la clé',
      scene: 'calc', sceneOpts: { regs: ['rbx', 'rdi'] },
      story: 'Le serrurier a rangé le code d’une porte dans le registre <code>rbx</code>. Il te demande d’en faire un double dans <code>rdi</code>.',
      goal: 'Copie <code>rbx</code> dans <code>rdi</code> pour que le programme se termine avec le code de sortie <code>13</code>, sans écrire 13 une deuxième fois.',
      lesson: '<p><code>mov</code> marche aussi entre deux registres : <code>mov rdi, rbx</code> copie la valeur de rbx dans rdi. rbx garde sa valeur : c’est une <b>copie</b>, pas un déplacement.</p>' +
        '<p>On lit toujours <code>mov destination, source</code> : la destination est à gauche.</p>',
      starter: TEXT + '\tmov\trbx, 13\t\t; le code du serrurier\n\tmov\trax, 60\t\t; exit\n\tmov\trdi, 0\t\t; TODO : copie rbx dans rdi\n\tsyscall\n',
      solution: TEXT + '\tmov\trbx, 13\n\tmov\trax, 60\n\tmov\trdi, rbx\n\tsyscall\n',
      hints: ['La source (à droite) est rbx.', 'mov rdi, rbx'],
      tests: [{ exit: 13 }],
      rules: {
        mustSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*(rbx|ebx)\b/.source, msg: 'Copie rbx dans rdi avec mov.' }],
        forbidSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*13\b/.source, msg: 'Ne recopie pas 13 à la main : copie le registre.' }]
      }
    },
    {
      id: 'a1_3', ch: 1, ord: 3, stars: 1,
      title: 'Le bon ordre',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi'] },
      story: 'Au snack, le cuisinier pose la commande n°21 dans <code>rax</code>… puis réutilise aussitôt <code>rax</code> pour l’appel exit. La commande est perdue !',
      goal: 'Remets les instructions dans le bon ordre pour que le programme se termine avec le code <code>21</code> (la valeur préparée dans rax).',
      lesson: '<p>Un registre ne garde qu’<b>une</b> valeur : un nouveau <code>mov</code> efface l’ancienne. Il faut donc mettre la valeur à l’abri (dans rdi) <b>avant</b> de réutiliser rax.</p>' +
        '<p>Avance pas à pas et regarde rax changer.</p>',
      starter: TEXT + '\tmov\trax, 21\t\t; la commande est prête dans rax…\n\tmov\trax, 60\t\t; …mais exit écrase rax !\n\tmov\trdi, rax\t; trop tard : rax vaut déjà 60\n\tsyscall\n',
      solution: TEXT + '\tmov\trax, 21\n\tmov\trdi, rax\t; on met la commande à l\'abri\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Le programme se termine avec 60 : rax a été écrasé avant la copie.', 'Il suffit d’échanger deux lignes.', 'mov rax, 21 / mov rdi, rax / mov rax, 60 / syscall'],
      tests: [{ exit: 21 }],
      rules: {
        mustSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*(rax|eax)\b/.source, msg: 'Copie rax dans rdi.' }],
        forbidSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*21\b/.source, msg: 'Garde la valeur dans rax et copie-la.' }]
      }
    },
    {
      id: 'a1_4', ch: 1, ord: 4, stars: 1,
      title: 'L’échange des badges',
      scene: 'calc', sceneOpts: { regs: ['rbx', 'rcx', 'rdx'] },
      story: 'Alice (<code>rbx</code>) et Bob (<code>rcx</code>) se sont trompés de badge. Échange-les ! Le portique vérifie ensuite le badge rangé dans rbx.',
      goal: 'Échange les valeurs de <code>rbx</code> et <code>rcx</code>. Le programme se termine avec rbx comme code de sortie : <code>9</code> attendu.',
      lesson: '<p>Pour échanger deux verres de jus, il faut un troisième verre vide. Pareil ici : <code>rdx</code> sert de case temporaire.</p>' +
        '<pre>mov rdx, rbx    ; on garde rbx\nmov rbx, rcx    ; rbx reçoit rcx\nmov rcx, rdx    ; rcx reçoit l’ancien rbx</pre>' +
        '<p>(Il existe aussi <code>xchg rbx, rcx</code>, qui le fait en une instruction.)</p>',
      starter: TEXT + '\tmov\trbx, 3\t\t; badge d\'Alice\n\tmov\trcx, 9\t\t; badge de Bob\n\t; TODO : échange rbx et rcx (rdx sert de verre vide)\n\n\tmov\trax, 60\n\tmov\trdi, rbx\t; le portique lit rbx\n\tsyscall\n',
      solution: TEXT + '\tmov\trbx, 3\n\tmov\trcx, 9\n\tmov\trdx, rbx\n\tmov\trbx, rcx\n\tmov\trcx, rdx\n\n\tmov\trax, 60\n\tmov\trdi, rbx\n\tsyscall\n',
      hints: ['Si tu fais directement mov rbx, rcx, le 3 est perdu.', 'Commence par mov rdx, rbx.', 'mov rdx, rbx / mov rbx, rcx / mov rcx, rdx'],
      tests: [{ exit: 9 }],
      rules: { forbidSrc: [{ re: /\bmov\s+(rbx|ebx|rdi|edi)\s*,\s*9\b/.source, msg: 'Échange les registres, n’écris pas 9 à la main.' }] }
    },
    {
      id: 'a1_5', ch: 1, ord: 5, stars: 1,
      title: 'Les demi-registres',
      scene: 'door', sceneOpts: { code: 33, title: 'LA SALLE DES SERVEURS' },
      story: 'La salle des serveurs n’accepte que les programmes économes : ils doivent utiliser les <b>registres 32 bits</b>. Le code d’entrée est <b>33</b>.',
      goal: 'Termine avec le code <code>33</code> en n’utilisant que les noms 32 bits <code>eax</code> et <code>edi</code> (plus aucun <code>rax</code> ni <code>rdi</code>).',
      lesson: '<p>Chaque registre 64 bits a des « morceaux » avec leur propre nom :</p>' +
        '<table><tr><th>64 bits</th><th>32 bits</th><th>16 bits</th><th>8 bits</th></tr><tr><td>rax</td><td>eax</td><td>ax</td><td>al</td></tr><tr><td>rdi</td><td>edi</td><td>di</td><td>dil</td></tr><tr><td>r8</td><td>r8d</td><td>r8w</td><td>r8b</td></tr></table>' +
        '<p>Écrire dans un registre 32 bits (<code>mov edi, 5</code>) met aussi les 32 bits du haut de rdi à <b>zéro</b>. C’est pour ça que <code>mov eax, 60</code> suffit pour exit.</p>',
      starter: TEXT + '\tmov\trax, 60\n\tmov\trdi, 0\n\tsyscall\n',
      solution: TEXT + '\tmov\teax, 60\t\t; les 32 bits du haut de rax passent à 0\n\tmov\tedi, 33\n\tsyscall\n',
      hints: ['eax est la moitié basse de rax.', 'mov eax, 60', 'mov edi, 33'],
      tests: [{ exit: 33 }],
      rules: {
        mustSrc: [{ re: /\beax\b/.source, msg: 'Utilise eax.' }, { re: /\bedi\b/.source, msg: 'Utilise edi.' }],
        forbidSrc: [{ re: /\b(rax|rdi)\b/.source, msg: 'Uniquement les noms 32 bits : eax et edi.' }]
      }
    },
    {
      id: 'a1_6', ch: 1, ord: 6, stars: 1,
      title: 'Le badge hexadécimal',
      scene: 'door', sceneOpts: { code: 31, title: 'LE DISTRIBUTEUR' },
      story: 'Le distributeur de boissons affiche son code en hexadécimal : <b>0x1F</b>. Les programmeurs système écrivent souvent les nombres comme ça.',
      goal: 'Termine avec le code de sortie <code>0x1F</code> (= 31) en écrivant la valeur <b>en hexadécimal</b> dans ton code.',
      lesson: '<p>En hexadécimal (base 16), on compte <code>0 1 2 … 9 A B C D E F</code>, puis <code>10</code>. Chaque chiffre vaut 16 fois plus que celui de droite : <code>0x1F</code> = 1 × 16 + 15 = 31.</p>' +
        '<p>NASM comprend <code>0x1F</code> (ou <code>1Fh</code>), et aussi le binaire <code>0b11111</code>. C’est la même valeur dans le registre : seule l’écriture change.</p>',
      starter: TEXT + '\tmov\trax, 60\n\tmov\trdi, 0\t\t; TODO : le code 0x1F\n\tsyscall\n',
      solution: TEXT + '\tmov\trax, 60\n\tmov\trdi, 0x1F\n\tsyscall\n',
      hints: ['0x indique un nombre hexadécimal.', 'mov rdi, 0x1F'],
      tests: [{ exit: 31 }],
      rules: {
        mustSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*(0x[0-9a-f]+|[0-9][0-9a-f]*h)\b/.source, msg: 'Écris le code en hexadécimal (0x…).' }],
        forbidSrc: [{ re: /\b31\b/.source, msg: 'Écris 0x1F, pas 31.' }]
      }
    },
    {
      id: 'a1_7', ch: 1, ord: 7, stars: 1,
      title: 'Le compteur à 8 bits',
      scene: 'door', sceneOpts: { code: 10, title: 'LE VIEUX COMPTEUR' },
      story: 'Le vieux compteur de la cafétéria n’a que 8 bits : il ne garde que les valeurs de 0 à 255. Au-delà, il repart de zéro, comme un compteur kilométrique.',
      goal: 'Termine avec le code de sortie <code>10</code>, mais en mettant dans rdi un nombre <b>plus grand que 255</b>.',
      lesson: '<p>Le code de sortie d’un programme Linux ne garde que l’octet du bas de rdi : <b>code = rdi & 255</b> (le reste de la division par 256).</p>' +
        '<p>Ainsi 256 donne 0, 257 donne 1, 300 donne 44…</p>',
      starter: TEXT + '\tmov\trax, 60\n\tmov\trdi, 0\t\t; TODO : un nombre > 255 qui donne 10\n\tsyscall\n',
      solution: TEXT + '\tmov\trax, 60\n\tmov\trdi, 266\t\t; 266 = 256 + 10\n\tsyscall\n',
      hints: ['Après 255, le compteur repart à 0 : 256 donne 0.', 'Que donne 256 + 10 ?', 'mov rdi, 266'],
      tests: [{ exit: 10 }],
      rules: { mustSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*(25[6-9]|2[6-9]\d|[3-9]\d\d|[1-9]\d{3,}|0x[0-9a-f]{3,})\b/.source, msg: 'Mets dans rdi un nombre plus grand que 255.' }] }
    },
    {
      id: 'a1_8', ch: 1, ord: 8, stars: 1,
      title: 'Le grand ménage',
      scene: 'door', sceneOpts: { code: 0, title: 'FIN DE SERVICE' },
      story: 'Le robot de ménage termine son service. Dans <code>rdi</code> traîne encore un vieux 77. Il faut tout remettre à zéro, à la façon des pros.',
      goal: 'Termine avec le code <code>0</code> en remettant rdi à zéro avec <code>xor</code> (pas avec <code>mov rdi, 0</code>).',
      lesson: '<p><code>xor a, b</code> compare les bits un à un : 1 si ils sont différents, 0 sinon. Donc <code>xor rdi, rdi</code> donne toujours <b>0</b>.</p>' +
        '<p>C’est l’astuce classique des programmeurs assembleur : l’instruction est plus courte que <code>mov rdi, 0</code>. On l’écrit souvent <code>xor edi, edi</code> (version 32 bits, qui efface aussi le haut).</p>',
      starter: TEXT + '\tmov\trdi, 77\t\t; un reste d\'un ancien calcul\n\tmov\trax, 60\n\t; TODO : remets rdi à zéro avec xor\n\tsyscall\n',
      solution: TEXT + '\tmov\trdi, 77\n\tmov\trax, 60\n\txor\trdi, rdi\t\t; rdi = 0\n\tsyscall\n',
      hints: ['Un nombre xor lui-même donne toujours 0.', 'xor rdi, rdi'],
      tests: [{ exit: 0 }],
      rules: {
        mustSrc: [{ re: /\bxor\s+(rdi|edi)\s*,\s*(rdi|edi)\b/.source, msg: 'Utilise xor rdi, rdi.' }],
        forbidSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*0\b/.source, msg: 'Pas de mov rdi, 0 : utilise xor.' }]
      }
    },
    {
      id: 'a1_9', ch: 1, ord: 9, stars: 1,
      title: 'La ronde des chaises',
      scene: 'calc', sceneOpts: { regs: ['r8', 'r9', 'r10', 'r11'] },
      story: 'Trois étudiants sont assis dans <code>r8</code>, <code>r9</code> et <code>r10</code>. Au signal, chacun se décale d’une chaise : la ronde commence !',
      goal: 'Fais tourner les valeurs : r8 reçoit r9, r9 reçoit r10, et r10 reçoit l’<b>ancien</b> r8. Le programme se termine avec r10 : code <code>11</code> attendu.',
      lesson: '<p>En 64 bits, il y a 8 registres de plus : <code>r8</code> à <code>r15</code>. Leur moitié 32 bits s’appelle <code>r8d</code>, <code>r9d</code>…</p>' +
        '<p>Pour faire tourner trois valeurs, une seule case temporaire suffit : on met de côté celle qu’on va écraser en premier.</p>',
      starter: TEXT + '\tmov\tr8, 11\t\t; Ada\n\tmov\tr9, 22\t\t; Linus\n\tmov\tr10, 33\t\t; Grace\n\t; TODO : r8 <- r9, r9 <- r10, r10 <- ancien r8 (r11 est libre)\n\n\tmov\teax, 60\n\tmov\tedi, r10d\t; le code de sortie = r10\n\tsyscall\n',
      solution: TEXT + '\tmov\tr8, 11\n\tmov\tr9, 22\n\tmov\tr10, 33\n\tmov\tr11, r8\t\t; on met Ada de côté\n\tmov\tr8, r9\n\tmov\tr9, r10\n\tmov\tr10, r11\n\n\tmov\teax, 60\n\tmov\tedi, r10d\n\tsyscall\n',
      hints: ['r8 va être écrasé en premier : mets-le de côté dans r11.', 'mov r11, r8 / mov r8, r9 / mov r9, r10', 'Il reste : mov r10, r11'],
      tests: [{ exit: 11 }],
      rules: { forbidSrc: [{ re: /\bmov\s+(r10d?|rdi|edi)\s*,\s*11\b/.source, msg: 'Fais tourner les registres, n’écris pas 11 à la main.' }] }
    },

    /* ===================== Chapitre 2 · Écrire avec write ===================== */
    {
      id: 'a2_1', ch: 2, ord: 1, stars: 1,
      title: 'Le panneau d’accueil',
      story: 'Le panneau lumineux de l’entrée affiche encore « Hello ». Le campus veut un accueil plus local.',
      goal: 'Change le message pour afficher exactement :<pre>Salut 42⏎</pre>',
      lesson: '<p>Le texte vit dans la section <code>.data</code> : <code>msg db "Hello", 10</code> range un octet par lettre, puis 10 (le code de <code>\\n</code>).</p>' +
        '<p><code>write</code> (rax = 1) a besoin de trois arguments : <code>rdi</code> = 1 (l’écran, stdout), <code>rsi</code> = l’<b>adresse</b> du texte, <code>rdx</code> = le nombre d’octets. <code>len equ $ - msg</code> calcule ce nombre tout seul.</p>',
      starter: 'section .data\n\tmsg\tdb "Hello", 10\t; 10 = \'\\n\'\n\tlen\tequ $ - msg\t\t; longueur calculée par NASM\n\n' + TEXT + '\tmov\trax, 1\t\t; write\n\tmov\trdi, 1\t\t; fd 1 = stdout\n\tmov\trsi, msg\t; adresse du texte\n\tmov\trdx, len\t; nombre d\'octets\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\tmsg\tdb "Salut 42", 10\n\tlen\tequ $ - msg\n\n' + TEXT + wr('msg', 'len') + EXIT0,
      hints: ['Seule la ligne msg db … est à changer.', 'msg db "Salut 42", 10'],
      tests: [{ expect: 'Salut 42\n', exit: 0 }],
      rules: {}
    },
    {
      id: 'a2_2', ch: 2, ord: 2, stars: 1,
      title: 'La bonne longueur',
      story: 'Le stagiaire a compté les lettres à la main… et s’est arrêté à 5. Le panneau affiche « Bienv » !',
      goal: 'Affiche toute la phrase <pre>Bienvenue au campus⏎</pre> en laissant NASM calculer la longueur avec <code>equ $ - msg</code>.',
      lesson: '<p><code>$</code> veut dire « l’adresse où NASM en est ». Juste après le message, <code>$ - msg</code> = adresse de fin − adresse de début = <b>nombre d’octets</b>, <code>\\n</code> compris.</p>' +
        '<pre>msg db "Salut", 10\nlen equ $ - msg      ; len = 6</pre>' +
        '<p>Si tu changes le texte, la longueur suit toute seule.</p>',
      starter: 'section .data\n\tmsg\tdb "Bienvenue au campus", 10\n\n' + TEXT + '\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, msg\n\tmov\trdx, 5\t\t; TODO : remplace par une longueur calculée\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\tmsg\tdb "Bienvenue au campus", 10\n\tlen\tequ $ - msg\n\n' + TEXT + wr('msg', 'len') + EXIT0,
      hints: ['Ajoute une ligne juste après msg : len equ $ - msg', 'Puis mov rdx, len'],
      tests: [{ expect: 'Bienvenue au campus\n', exit: 0 }],
      rules: {
        mustSrc: [{ re: /equ\s+\$\s*-\s*\w+/.source, msg: 'Calcule la longueur avec equ $ - msg.' }],
        forbidSrc: [{ re: /\bmov\s+(rdx|edx)\s*,\s*\d/.source, msg: 'Ne compte pas à la main : utilise len.' }]
      }
    },
    {
      id: 'a2_3', ch: 2, ord: 3, stars: 1,
      title: 'Deux annonces',
      story: 'La cafétéria vient d’ouvrir et le chef veut annoncer le plat du jour. Deux messages, deux appels à <code>write</code>.',
      goal: 'Affiche les deux messages, l’un après l’autre :<pre>Cafeteria ouverte⏎Plat du jour : couscous⏎</pre>',
      lesson: '<p>Chaque message a son étiquette et sa longueur. Pour afficher le second, on refait un <code>write</code> complet : <b>rax doit être remis à 1</b>, car <code>syscall</code> y a rangé son résultat (le nombre d’octets écrits).</p>',
      starter: 'section .data\n\tmsg1\tdb "Cafeteria ouverte", 10\n\tlen1\tequ $ - msg1\n\tmsg2\tdb "Plat du jour : couscous", 10\n\tlen2\tequ $ - msg2\n\n' + TEXT + wr('msg1', 'len1') + '\t; TODO : affiche aussi msg2\n' + EXIT0,
      solution: 'section .data\n\tmsg1\tdb "Cafeteria ouverte", 10\n\tlen1\tequ $ - msg1\n\tmsg2\tdb "Plat du jour : couscous", 10\n\tlen2\tequ $ - msg2\n\n' + TEXT + wr('msg1', 'len1') + wr('msg2', 'len2') + EXIT0,
      hints: ['Recopie les 5 lignes du premier write.', 'Change msg1 en msg2 et len1 en len2.', 'Après le premier syscall, rax vaut 18 : n’oublie pas mov rax, 1.'],
      tests: [{ expect: 'Cafeteria ouverte\nPlat du jour : couscous\n', exit: 0 }],
      rules: { mustSrc: [{ re: /\bmov\s+rsi\s*,\s*msg2\b/.source, msg: 'Affiche msg2 avec un deuxième write.' }] }
    },
    {
      id: 'a2_4', ch: 2, ord: 4, stars: 1,
      title: 'Le menu sur trois lignes',
      scene: 'sign', sceneOpts: { v: 'menu', text: 'MENU' },
      story: 'L’ardoise de la cantine est toute tordue : le menu tient sur une seule ligne. Le chef veut une ligne par plat, et un seul appel à <code>write</code>.',
      goal: 'Affiche, avec <b>un seul</b> <code>write</code> :<pre>Entree : soupe⏎Plat : gratin⏎Dessert : flan⏎</pre>',
      lesson: '<p>Une ligne <code>db</code> peut mélanger textes et nombres, séparés par des virgules :</p><pre>txt db "Un", 10, "Deux", 10</pre>' +
        '<p>Tous ces octets se suivent en mémoire : un seul <code>write</code> les affiche tous. Regarde-les dans la vue mémoire.</p>',
      starter: 'section .data\n\tmenu\tdb "Entree : soupe Plat : gratin Dessert : flan", 10\n\tlen\t\tequ $ - menu\n\n' + TEXT + wr('menu', 'len') + EXIT0,
      solution: 'section .data\n\tmenu\tdb "Entree : soupe", 10, "Plat : gratin", 10, "Dessert : flan", 10\n\tlen\t\tequ $ - menu\n\n' + TEXT + wr('menu', 'len') + EXIT0,
      hints: ['Coupe la chaîne en trois morceaux entre guillemets.', 'Mets 10 entre les morceaux : "Entree : soupe", 10, "Plat : gratin", 10, …'],
      tests: [{ expect: 'Entree : soupe\nPlat : gratin\nDessert : flan\n', exit: 0 }],
      rules: { forbidSrc: [{ re: /syscall[\s\S]*syscall[\s\S]*syscall/.source, msg: 'Un seul write suffit (plus l’exit).' }] }
    },
    {
      id: 'a2_5', ch: 2, ord: 5, stars: 1,
      title: 'Le canal des erreurs',
      story: 'Le portique a refusé un badge. Une erreur ne s’écrit pas sur la sortie normale : elle va sur la <b>sortie d’erreur</b>, et le programme signale l’échec par son code.',
      goal: 'Écris <code>Erreur : badge inconnu⏎</code> sur la sortie d’erreur (fd <code>2</code>), rien sur la sortie standard, et termine avec le code <code>1</code>.',
      lesson: '<p>Tout programme Linux démarre avec trois descripteurs : <b>0</b> = stdin (clavier), <b>1</b> = stdout (sortie normale), <b>2</b> = stderr (erreurs).</p>' +
        '<p>Le terminal affiche les deux sorties, mais on peut les séparer : <code>./prog > log.txt</code> ne redirige que stdout, les erreurs restent visibles.</p>' +
        '<p>Par convention, le code de sortie <b>0</b> veut dire « tout va bien », et autre chose « échec ».</p>',
      starter: 'section .data\n\terr\tdb "Erreur : badge inconnu", 10\n\tlen\tequ $ - err\n\n' + TEXT + wr('err', 'len') + '\t; TODO : écris sur stderr, et termine avec le code 1\n' + EXIT0,
      solution: 'section .data\n\terr\tdb "Erreur : badge inconnu", 10\n\tlen\tequ $ - err\n\n' + TEXT + wr('err', 'len', 2) + '\n\tmov\trax, 60\n\tmov\trdi, 1\t\t; code 1 = échec\n\tsyscall\n',
      hints: ['C’est rdi qui choisit le descripteur dans write.', 'mov rdi, 2 pour le write.', 'Pour exit : mov rdi, 1 au lieu de xor rdi, rdi.'],
      tests: [{ expect: '', exit: 1 }],
      rules: { mustSrc: [{ re: /\bmov\s+(rdi|edi)\s*,\s*2\b/.source, msg: 'Écris sur le descripteur 2 (stderr).' }] }
    },
    {
      id: 'a2_6', ch: 2, ord: 6, stars: 1,
      title: 'Juste le numéro',
      story: 'Au guichet, l’écran affiche « Ticket numero 4242 ». Le nouvel écran est tout petit : il ne doit montrer <b>que le numéro</b>.',
      goal: 'Sans changer la donnée <code>msg</code>, affiche seulement :<pre>4242⏎</pre>',
      lesson: '<p><code>msg</code> est une <b>adresse</b> : celle du premier octet, le <code>T</code>. <code>msg + 3</code> est l’adresse du quatrième octet. NASM fait le calcul : <code>mov rsi, msg + 3</code>.</p>' +
        '<p>Il faut alors afficher moins d’octets : <code>mov rdx, len - 3</code>. Compte bien les espaces !</p>',
      starter: 'section .data\n\tmsg\tdb "Ticket numero 4242", 10\n\tlen\tequ $ - msg\n\n' + TEXT + '\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, msg\t\t; TODO : commence plus loin…\n\tmov\trdx, len\t\t; … et affiche moins d\'octets\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\tmsg\tdb "Ticket numero 4242", 10\n\tlen\tequ $ - msg\n\n' + TEXT + '\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, msg + 14\t; on saute "Ticket numero "\n\tmov\trdx, len - 14\n\tsyscall\n' + EXIT0,
      hints: ['« Ticket numero » plus l’espace : combien d’octets ?', '14 octets à sauter.', 'mov rsi, msg + 14 / mov rdx, len - 14'],
      tests: [{ expect: '4242\n', exit: 0 }],
      rules: {
        mustSrc: [{ re: /msg\s*\+\s*\d+/.source, msg: 'Utilise une adresse décalée : msg + …' }],
        forbidSrc: [{ re: /"4242/.source, msg: 'Ne crée pas de nouveau texte : décale l’adresse.' }]
      }
    },
    {
      id: 'a2_7', ch: 2, ord: 7, stars: 1,
      title: 'L’écho du hall',
      stdin: 'bonjour\n',
      story: 'Le grand hall du campus a un écho : tout ce qu’on y dit revient. Programme-le avec <code>read</code> puis <code>write</code>.',
      goal: 'Lis au plus 64 octets sur l’entrée standard, puis réécris <b>exactement</b> ce qui a été lu. Avec l’entrée <code>bonjour⏎</code>, affiche <code>bonjour⏎</code>. D’autres phrases seront testées.',
      lesson: '<p>La section <code>.bss</code> réserve de la place vide : <code>buf resb 64</code> = 64 octets à zéro.</p>' +
        '<p><code>read</code> (rax = 0) : rdi = 0 (stdin), rsi = où ranger, rdx = taille maximum. Au retour, <b>rax = nombre d’octets vraiment lus</b>.</p>' +
        '<p>C’est ce nombre qu’il faut donner à <code>write</code> : sinon on afficherait aussi les zéros du tampon.</p>',
      starter: 'section .bss\n\tbuf\tresb 64\t\t\t; 64 octets vides\n\n' + TEXT + '\tmov\trax, 0\t\t; read\n\tmov\trdi, 0\t\t; fd 0 = stdin\n\tmov\trsi, buf\t\t; où ranger les octets\n\tmov\trdx, 64\t\t; au plus 64\n\tsyscall\t\t\t; rax = nombre d\'octets lus\n\t; TODO : réécris ces rax octets sur stdout\n' + EXIT0,
      solution: 'section .bss\n\tbuf\tresb 64\n\n' + TEXT + rd('buf', 64) + '\tmov\trdx, rax\t\t; autant d\'octets que lus\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, buf\n\tsyscall\n' + EXIT0,
      hints: ['Copie rax dans rdx avant de changer rax.', 'mov rdx, rax / mov rax, 1 / mov rdi, 1 / mov rsi, buf / syscall'],
      tests: [{ stdin: 'bonjour\n', expect: 'bonjour\n' }, { stdin: '42 Origins\n', expect: '42 Origins\n' }, { stdin: 'x\n', expect: 'x\n' }],
      rules: {}
    },
    {
      id: 'a2_8', ch: 2, ord: 8, stars: 1,
      title: 'Le perroquet poli',
      stdin: 'Marvin\n',
      scene: 'talk', sceneOpts: { who: 'robot', name: 'Marvin', expect: 'Bonjour Marvin\n', happy: 'Bip ! Quelle politesse !', wrong: 'Bip ? Ce n’est pas mon nom…', wait: '(Marvin attend qu’on le salue)' },
      story: 'Le robot d’accueil doit saluer chaque visiteur par son nom. Le nom arrive sur l’entrée standard.',
      goal: 'Lis le nom (au plus 32 octets) puis affiche <code>Bonjour </code> suivi du nom lu. Avec <code>Marvin⏎</code> : <pre>Bonjour Marvin⏎</pre>',
      lesson: '<p>Après <code>read</code>, le nombre d’octets lus est dans rax… mais le prochain <code>write</code> va écraser rax ! Range-le dans un registre qui survit à <code>syscall</code>, comme <code>rbx</code>.</p>' +
        '<p>⚠ <code>syscall</code> écrase <code>rax</code> (le résultat), <code>rcx</code> et <code>r11</code>. rbx, rbp, r12 à r15 sont préservés.</p>',
      starter: 'section .data\n\thello\tdb "Bonjour "\n\thlen\tequ $ - hello\n\nsection .bss\n\tnom\t\tresb 32\n\n' + TEXT + rd('nom', 32) + '\tmov\trbx, rax\t\t; longueur du nom (rbx survit à syscall)\n\t; TODO : écris "Bonjour " puis le nom (rbx octets)\n' + EXIT0,
      solution: 'section .data\n\thello\tdb "Bonjour "\n\thlen\tequ $ - hello\n\nsection .bss\n\tnom\t\tresb 32\n\n' + TEXT + rd('nom', 32) + '\tmov\trbx, rax\n' + wr('hello', 'hlen') + wr('nom', 'rbx') + EXIT0,
      hints: ['Deux write : le premier avec hello et hlen.', 'Le second avec rsi = nom et rdx = rbx.'],
      tests: [{ stdin: 'Marvin\n', expect: 'Bonjour Marvin\n' }, { stdin: 'Norma\n', expect: 'Bonjour Norma\n' }, { stdin: 'Ada Lovelace\n', expect: 'Bonjour Ada Lovelace\n' }],
      rules: {}
    },
    {
      id: 'a2_9', ch: 2, ord: 9, stars: 1,
      title: 'L’affiche encadrée',
      stdin: '42\n',
      story: 'L’imprimeur du campus fabrique des affiches encadrées. Le texte du milieu (2 caractères) arrive sur l’entrée standard et se glisse directement dans le cadre.',
      goal: 'Le code fourni lit 2 caractères au milieu de <code>milieu</code>. Affiche ensuite le cadre complet, en utilisant <b>deux fois</b> la même bordure. Avec <code>42</code> :<pre>+--------+⏎|   42   |⏎+--------+⏎</pre>',
      lesson: '<p>Une donnée de <code>.data</code> peut être affichée autant de fois qu’on veut : il suffit de redonner son adresse à <code>write</code>.</p>' +
        '<p>Et <code>read</code> peut écrire <b>n’importe où</b> dans une zone modifiable : ici à l’adresse <code>milieu + 4</code>, en plein dans le texte.</p>',
      starter: 'section .data\n\tbord\tdb "+--------+", 10\n\tblen\tequ $ - bord\n\tmilieu\tdb "|   ??   |", 10\n\tmlen\tequ $ - milieu\n\n' + TEXT + rd('milieu + 4', 2) + '\t; TODO : bordure, milieu, bordure\n' + EXIT0,
      solution: 'section .data\n\tbord\tdb "+--------+", 10\n\tblen\tequ $ - bord\n\tmilieu\tdb "|   ??   |", 10\n\tmlen\tequ $ - milieu\n\n' + TEXT + rd('milieu + 4', 2) + wr('bord', 'blen') + wr('milieu', 'mlen') + wr('bord', 'blen') + EXIT0,
      hints: ['Trois write à la suite.', 'Le premier et le troisième sont identiques : rsi = bord, rdx = blen.'],
      tests: [{ stdin: '42\n', expect: '+--------+\n|   42   |\n+--------+\n' }, { stdin: 'OK\n', expect: '+--------+\n|   OK   |\n+--------+\n' }],
      rules: { forbidSrc: [{ re: /\+-+\+[\s\S]*\+-+\+/.source, msg: 'Réutilise la même bordure, ne la recopie pas.' }] }
    },

    /* ===================== Chapitre 3 · Calculer avec l’ALU ===================== */
    {
      id: 'a3_1', ch: 3, ord: 1, stars: 1,
      title: 'La caisse enregistreuse',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdi'] },
      story: 'À la cafétéria, un sandwich coûte 15 pièces et un jus 27. La caisse doit calculer le total.',
      goal: 'Additionne <code>rbx</code> à <code>rax</code> avec <code>add</code>. Le total devient le code de sortie : <code>42</code>.',
      lesson: '<p><code>add rax, rbx</code> calcule rax + rbx et range le résultat dans <b>rax</b> (la destination). rbx ne change pas.</p>' +
        '<p>Le calcul est fait par l’<b>ALU</b>, l’unité de calcul du processeur.</p>',
      starter: TEXT + '\tmov\trax, 15\t\t; prix du sandwich\n\tmov\trbx, 27\t\t; prix du jus\n\t; TODO : additionne rbx à rax\n\n\tmov\trdi, rax\t\t; le total devient le code de sortie\n\tmov\trax, 60\n\tsyscall\n',
      solution: TEXT + '\tmov\trax, 15\n\tmov\trbx, 27\n\tadd\trax, rbx\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['add destination, source', 'add rax, rbx'],
      tests: [{ exit: 42 }],
      rules: { mustSrc: [{ re: /\badd\b/.source, msg: 'Utilise add.' }], forbidSrc: [{ re: /\b42\b/.source, msg: 'Laisse l’ALU calculer 42.' }] }
    },
    {
      id: 'a3_2', ch: 3, ord: 2, stars: 1,
      title: 'Rendre la monnaie',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdi'] },
      story: 'Une cliente paie 200 pièces pour un livre à 135. Combien la libraire doit-elle rendre ?',
      goal: 'Calcule <code>200 − 135</code> avec <code>sub</code> et termine avec le résultat comme code de sortie (<code>65</code>).',
      lesson: '<p><code>sub rax, rbx</code> calcule rax − rbx et range le résultat dans rax. L’ordre compte : <code>sub rbx, rax</code> ferait l’inverse !</p>' +
        '<p>La source peut aussi être un nombre : <code>sub rax, 10</code>.</p>',
      starter: TEXT + '\tmov\trax, 200\t\t; somme payée\n\tmov\trbx, 135\t\t; prix du livre\n\t; TODO : rax = rax - rbx\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: TEXT + '\tmov\trax, 200\n\tmov\trbx, 135\n\tsub\trax, rbx\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['La destination est celle qui reçoit le résultat.', 'sub rax, rbx'],
      tests: [{ exit: 65 }],
      rules: { mustSrc: [{ re: /\bsub\b/.source, msg: 'Utilise sub.' }], forbidSrc: [{ re: /\b65\b/.source, msg: 'Laisse l’ALU calculer.' }] }
    },
    {
      id: 'a3_3', ch: 3, ord: 3, stars: 1,
      title: 'Le compteur de la salle',
      stdin: '5\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi'] },
      story: 'Le compteur de la salle de lecture démarre avec le nombre de personnes tapé au clavier. Puis 3 personnes entrent et 1 sort.',
      goal: 'Le code fourni lit un chiffre dans rax. Avec <code>inc</code> et <code>dec</code>, ajoute les 3 entrées et retire la sortie, puis termine avec le résultat. Avec <code>5</code> → code <code>7</code>.',
      lesson: '<p>Un chiffre tapé arrive comme un <b>caractère</b> : <code>\'5\'</code> vaut 53 (son code ASCII). On retire <code>\'0\'</code> (48) pour obtenir le nombre 5.</p>' +
        '<p><code>movzx rax, byte [chiffre]</code> lit <b>un octet</b> en mémoire et complète rax avec des zéros.</p>' +
        '<p><code>inc rax</code> ajoute 1, <code>dec rax</code> retire 1.</p>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : 3 personnes entrent, 1 sort\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\tinc\trax\n\tinc\trax\n\tinc\trax\n\tdec\trax\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Une entrée = inc rax.', 'inc rax trois fois, puis dec rax une fois.'],
      tests: [{ stdin: '5\n', exit: 7 }, { stdin: '0\n', exit: 2 }, { stdin: '9\n', exit: 11 }],
      rules: {
        mustSrc: [{ re: /\binc\b/.source, msg: 'Utilise inc.' }, { re: /\bdec\b/.source, msg: 'Utilise dec.' }],
        forbidSrc: [{ re: /\b(add|sub)\s+\w+\s*,\s*\d/.source, msg: 'Ici, compte avec inc et dec.' }]
      }
    },
    {
      id: 'a3_4', ch: 3, ord: 4, stars: 1,
      title: 'Les boîtes de croissants',
      stdin: '6\n',
      story: 'La boulangerie range ses croissants par boîtes de 12. Le livreur tape le nombre de boîtes : combien de croissants livre-t-il ?',
      goal: 'Lis le nombre de boîtes (un chiffre) et termine avec <code>boîtes × 12</code> comme code de sortie. Avec <code>6</code> → <code>72</code>.',
      lesson: '<p><code>imul rax, 12</code> multiplie rax par 12 (multiplication <b>signée</b>, qui marche aussi pour les positifs).</p>' +
        '<p>On peut aussi multiplier deux registres : <code>imul rax, rbx</code>.</p>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : multiplie par 12\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\timul\trax, 12\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['imul destination, valeur', 'imul rax, 12'],
      tests: [{ stdin: '6\n', exit: 72 }, { stdin: '3\n', exit: 36 }, { stdin: '0\n', exit: 0 }, { stdin: '9\n', exit: 108 }],
      rules: { mustSrc: [{ re: /\b(imul|mul)\b/.source, msg: 'Utilise imul.' }] }
    },
    {
      id: 'a3_5', ch: 3, ord: 5, stars: 1,
      title: 'Le partage des cookies',
      stdin: '5\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdx'] },
      story: 'Le club pâtisserie a cuit 47 cookies. Ils sont partagés équitablement entre les élèves présents (le nombre est tapé au clavier).',
      goal: 'Divise 47 par le nombre d’élèves (dans rbx) avec <code>div</code>, et termine avec la part de chacun. Avec <code>5</code> → <code>9</code>.',
      lesson: '<p><code>div rbx</code> divise le nombre de 128 bits <b>rdx:rax</b> par rbx : le quotient va dans <b>rax</b>, le reste dans <b>rdx</b>.</p>' +
        '<p>⚠ rdx fait partie du nombre divisé ! Il faut le vider avant : <code>xor rdx, rdx</code>. Sinon le quotient peut être énorme et le programme plante (<i>Floating point exception</i>).</p>' +
        '<pre>mov rax, 47\nxor rdx, rdx\ndiv rbx         ; rax = 47 / rbx, rdx = 47 % rbx</pre>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, 47\t\t; les cookies\n\t; TODO : divise rax par rbx (pense à vider rdx)\n\n\tmov\trdi, rax\t\t; la part de chacun\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, 47\n\txor\trdx, rdx\t\t; rdx:rax = 47\n\tdiv\trbx\t\t\t; rax = quotient, rdx = reste\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Le quotient arrive dans rax.', 'Après read, rdx vaut 1 : il faut le mettre à 0.', 'xor rdx, rdx / div rbx'],
      tests: [{ stdin: '5\n', exit: 9 }, { stdin: '3\n', exit: 15 }, { stdin: '7\n', exit: 6 }, { stdin: '1\n', exit: 47 }],
      rules: { mustSrc: [{ re: /\bdiv\b/.source, msg: 'Utilise div.' }] }
    },
    {
      id: 'a3_6', ch: 3, ord: 6, stars: 2,
      title: 'Parts et miettes',
      stdin: '5\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdx'] },
      story: 'Cette fois, 53 cookies. Le ticket de la pâtissière note la part de chacun et ce qui reste, collés : 10 parts et 3 restes → <b>103</b>.',
      goal: 'Divise 53 par le chiffre lu, puis termine avec <code>quotient × 10 + reste</code>. Avec <code>5</code> → <code>103</code>, avec <code>6</code> → <code>85</code>.',
      lesson: '<p>Après <code>div</code>, le <b>reste</b> est dans <code>rdx</code> : c’est l’équivalent du <code>%</code> du C.</p>' +
        '<p>Attention à l’ordre : <code>imul rax, 10</code> ne touche pas rdx, tu peux donc multiplier le quotient puis ajouter le reste.</p>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, 53\n\txor\trdx, rdx\n\tdiv\trbx\t\t\t; rax = quotient, rdx = reste\n\t; TODO : rax = quotient * 10 + reste\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, 53\n\txor\trdx, rdx\n\tdiv\trbx\n\timul\trax, 10\n\tadd\trax, rdx\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Le reste est dans rdx.', 'imul rax, 10', 'add rax, rdx'],
      tests: [{ stdin: '5\n', exit: 103 }, { stdin: '6\n', exit: 85 }, { stdin: '7\n', exit: 74 }, { stdin: '3\n', exit: 172 }],
      rules: { mustSrc: [{ re: /\badd\s+(rax|eax)\s*,\s*(rdx|edx)\b/.source, msg: 'Ajoute le reste (rdx) au résultat.' }] }
    },
    {
      id: 'a3_7', ch: 3, ord: 7, stars: 2,
      title: 'La dette du club',
      stdin: '5\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdx'] },
      story: 'Le club de jeux doit 45 pièces : son compte affiche <b>−45</b>. La dette est partagée entre les membres (chiffre tapé). Combien chacun doit-il payer ?',
      goal: 'Divise <code>[dette]</code> (−45) par le chiffre lu avec une division <b>signée</b>, puis rends le résultat positif avec <code>neg</code>. Avec <code>5</code> → <code>9</code>, avec <code>4</code> → <code>11</code>.',
      lesson: '<p>Pour les nombres négatifs, on utilise <code>idiv</code> (division signée). Le quotient est arrondi vers zéro : −45 / 4 = −11.</p>' +
        '<p>⚠ Ici, <code>xor rdx, rdx</code> serait faux : pour un nombre négatif, rdx doit être rempli de 1. <code>cqo</code> recopie le signe de rax dans tout rdx.</p>' +
        '<pre>mov rax, [dette]\ncqo             ; rdx:rax = rax, avec son signe\nidiv rbx\nneg rax         ; rax = -rax</pre>',
      starter: 'section .data\n\tdette\tdq -45\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, [dette]\t\t; -45\n\t; TODO : division signée par rbx, puis change le signe\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .data\n\tdette\tdq -45\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\trax, [dette]\n\tcqo\t\t\t\t; étend le signe dans rdx\n\tidiv\trbx\t\t\t; rax = -45 / rbx\n\tneg\trax\t\t\t; on rend positif\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Le code de sortie de −45 seul est 211 : c’est −45 vu sur 8 bits.', 'cqo puis idiv rbx', 'Termine par neg rax.'],
      tests: [{ stdin: '5\n', exit: 9 }, { stdin: '4\n', exit: 11 }, { stdin: '9\n', exit: 5 }, { stdin: '2\n', exit: 22 }],
      rules: { mustSrc: [{ re: /\bidiv\b/.source, msg: 'Utilise idiv (division signée).' }, { re: /\bcqo\b/.source, msg: 'Prépare rdx avec cqo.' }, { re: /\bneg\b/.source, msg: 'Change le signe avec neg.' }] }
    },
    {
      id: 'a3_8', ch: 3, ord: 8, stars: 2,
      title: 'Quitte ou double',
      stdin: '42\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdi'] },
      story: 'À la fête foraine du campus, le joueur tape une mise à deux chiffres. S’il gagne, la machine lui rend le double.',
      goal: 'Le code fourni lit deux chiffres : les dizaines dans rax, les unités dans rbx. Reconstruis le nombre (<code>rax × 10 + rbx</code>) puis termine avec son <b>double</b>. Avec <code>42</code> → <code>84</code>.',
      lesson: '<p>Le texte <code>"42"</code> est fait de deux octets : <code>\'4\'</code> puis <code>\'2\'</code>. Le nombre 42, c’est 4 dizaines + 2 unités : <code>4 × 10 + 2</code>.</p>' +
        '<p><code>[chiffres + 1]</code> désigne l’octet juste après le premier.</p>',
      starter: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\t\t; dizaines\n\tsub\trax, \'0\'\n\tmovzx\trbx, byte [chiffres + 1]\t; unités\n\tsub\trbx, \'0\'\n\t; TODO : nombre = rax * 10 + rbx, puis double-le\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\n\tsub\trax, \'0\'\n\tmovzx\trbx, byte [chiffres + 1]\n\tsub\trbx, \'0\'\n\timul\trax, 10\n\tadd\trax, rbx\t\t; rax = le nombre\n\tadd\trax, rax\t\t; le double\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['imul rax, 10 puis add rax, rbx.', 'Pour doubler : add rax, rax (ou imul rax, 2).'],
      tests: [{ stdin: '42\n', exit: 84 }, { stdin: '07\n', exit: 14 }, { stdin: '99\n', exit: 198 }, { stdin: '10\n', exit: 20 }],
      rules: { mustSrc: [{ re: /\bimul\b/.source, msg: 'Utilise imul pour les dizaines.' }] }
    },
    {
      id: 'a3_9', ch: 3, ord: 9, stars: 2,
      title: 'Le chronomètre',
      stdin: '75\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdx', 'rdi'] },
      story: 'Le coach de course note les temps en secondes (deux chiffres). Son vieux tableau d’affichage veut des minutes et des secondes collées : 75 s = 1 min 15 → <b>115</b>.',
      goal: 'Lis un nombre de secondes à deux chiffres, puis termine avec <code>minutes × 100 + secondes restantes</code>. Avec <code>75</code> → <code>115</code>, avec <code>59</code> → <code>59</code>.',
      lesson: '<p>Tu as tous les outils : reconstruire un nombre à deux chiffres, <code>div</code> pour le quotient (rax) et le reste (rdx), <code>imul</code> et <code>add</code> pour assembler le résultat.</p>' +
        '<p>Rappel : vide rdx avant <code>div</code>.</p>',
      starter: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\t; TODO : nombre de secondes, puis minutes * 100 + secondes\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\n\tsub\trax, \'0\'\n\timul\trax, 10\n\tmovzx\trbx, byte [chiffres + 1]\n\tsub\trbx, \'0\'\n\tadd\trax, rbx\t\t; rax = secondes\n\txor\trdx, rdx\n\tmov\trbx, 60\n\tdiv\trbx\t\t\t; rax = minutes, rdx = secondes restantes\n\timul\trax, 100\n\tadd\trax, rdx\n\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Reprends la mission précédente pour lire le nombre.', 'xor rdx, rdx / mov rbx, 60 / div rbx', 'imul rax, 100 / add rax, rdx'],
      tests: [{ stdin: '75\n', exit: 115 }, { stdin: '59\n', exit: 59 }, { stdin: '99\n', exit: 139 }, { stdin: '60\n', exit: 100 }],
      rules: { mustSrc: [{ re: /\bdiv\b/.source, msg: 'Utilise div pour trouver les minutes.' }] }
    },

    /* ===================== Chapitre 4 · Comparer et sauter ===================== */
    {
      id: 'a4_1', ch: 4, ord: 1, stars: 1,
      title: 'La porte à code',
      stdin: '7\n',
      story: 'La porte du labo s’ouvre avec la touche <b>7</b>. Toute autre touche la laisse fermée.',
      goal: 'Lis un caractère. S’il vaut <code>\'7\'</code>, affiche <code>OUVERT⏎</code>, sinon <code>FERME⏎</code>.',
      lesson: '<p>Pas de <code>if</code> en assembleur : on <b>compare</b>, puis on <b>saute</b>.</p><pre>cmp al, \'7\'     ; compare al et \'7\'\nje .ouvre       ; Jump if Equal : saute s\'ils sont égaux\n                ; sinon on continue à la ligne suivante</pre>' +
        '<p><code>.ouvre</code> est une étiquette locale. <code>jmp</code> saute toujours.</p>',
      starter: 'section .data\n\touvert\tdb "OUVERT", 10\n\tferme\tdb "FERME", 10\n\nsection .bss\n\ttouche\tresb 1\n\n' + TEXT + rd('touche', 1) + '\tmov\tal, [touche]\t\t; le caractère tapé\n\t; TODO : si al vaut \'7\', saute vers .ouvre\n\tjmp\t.refuse\n\n.ouvre:\n\tmov\trsi, ouvert\n\tmov\trdx, 7\n\tjmp\t.ecrire\n\n.refuse:\n\tmov\trsi, ferme\n\tmov\trdx, 6\n\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\touvert\tdb "OUVERT", 10\n\tferme\tdb "FERME", 10\n\nsection .bss\n\ttouche\tresb 1\n\n' + TEXT + rd('touche', 1) + '\tmov\tal, [touche]\n\tcmp\tal, \'7\'\n\tje\t.ouvre\n\tjmp\t.refuse\n\n.ouvre:\n\tmov\trsi, ouvert\n\tmov\trdx, 7\n\tjmp\t.ecrire\n\n.refuse:\n\tmov\trsi, ferme\n\tmov\trdx, 6\n\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      hints: ['cmp al, \'7\'', 'je .ouvre (juste avant le jmp .refuse)'],
      tests: [{ stdin: '7\n', expect: 'OUVERT\n' }, { stdin: '3\n', expect: 'FERME\n' }, { stdin: '0\n', expect: 'FERME\n' }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a4_2', ch: 4, ord: 2, stars: 1,
      title: 'Oui ou non',
      stdin: 'o\n',
      scene: 'door', sceneOpts: { code: 0, title: 'CONFIRMATION' },
      story: 'L’imprimante demande « Imprimer ? (o/n) ». Seule la réponse <b>o</b> (minuscule) confirme : le programme répond alors par le code 0. Tout le reste annule : code 1.',
      goal: 'Lis un caractère. Si ce n’est <b>pas</b> <code>\'o\'</code>, saute vers <code>.non</code> avec <code>jne</code>. Code 0 pour <code>o</code>, code 1 sinon.',
      lesson: '<p><code>jne</code> (Jump if Not Equal) saute quand la comparaison trouve deux valeurs <b>différentes</b>. C’est souvent plus simple : on saute pour le cas « à part », et le cas normal continue tout droit.</p>' +
        '<p>Les majuscules ont un autre code : <code>\'O\'</code> = 79, <code>\'o\'</code> = 111.</p>',
      starter: 'section .bss\n\ttouche\tresb 1\n\n' + TEXT + rd('touche', 1) + '\tmov\tal, [touche]\n\t; TODO : si al n\'est pas \'o\', saute vers .non\n\n\tmov\trax, 60\t\t; oui : code 0\n\txor\trdi, rdi\n\tsyscall\n\n.non:\n\tmov\trax, 60\t\t; non : code 1\n\tmov\trdi, 1\n\tsyscall\n',
      solution: 'section .bss\n\ttouche\tresb 1\n\n' + TEXT + rd('touche', 1) + '\tmov\tal, [touche]\n\tcmp\tal, \'o\'\n\tjne\t.non\n\n\tmov\trax, 60\n\txor\trdi, rdi\n\tsyscall\n\n.non:\n\tmov\trax, 60\n\tmov\trdi, 1\n\tsyscall\n',
      hints: ['cmp al, \'o\'', 'jne .non'],
      tests: [{ stdin: 'o\n', exit: 0 }, { stdin: 'n\n', exit: 1 }, { stdin: 'O\n', exit: 1 }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }, { re: /\bj(ne|nz)\b/.source, msg: 'Utilise jne.' }] }
    },
    {
      id: 'a4_3', ch: 4, ord: 3, stars: 1,
      title: 'Le thermostat',
      stdin: '9\n',
      story: 'Le thermostat de la salle de sport reçoit un niveau de chaleur de 0 à 9. Au-dessus de 5, il faut prévenir.',
      goal: 'Lis un chiffre. S’il est <b>strictement plus grand</b> que 5, affiche <code>CHAUD⏎</code>, sinon <code>OK⏎</code>.',
      lesson: '<p>Après <code>cmp a, b</code> :</p><table><tr><th>saut</th><th>quand</th></tr><tr><td>jg</td><td>a &gt; b</td></tr><tr><td>jge</td><td>a ≥ b</td></tr><tr><td>jl</td><td>a &lt; b</td></tr><tr><td>jle</td><td>a ≤ b</td></tr></table>' +
        '<p>« g » = <i>greater</i>, « l » = <i>less</i>, « e » = <i>equal</i>.</p>',
      starter: 'section .data\n\tchaud\tdb "CHAUD", 10\n\tok\t\tdb "OK", 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : si rax > 5, saute vers .chaud\n\tjmp\t.ok\n\n.chaud:\n' + wr('chaud', 6) + '\tjmp\t.fin\n\n.ok:\n' + wr('ok', 3) + '\n.fin:' + EXIT0,
      solution: 'section .data\n\tchaud\tdb "CHAUD", 10\n\tok\t\tdb "OK", 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\tcmp\trax, 5\n\tjg\t.chaud\n\tjmp\t.ok\n\n.chaud:\n' + wr('chaud', 6) + '\tjmp\t.fin\n\n.ok:\n' + wr('ok', 3) + '\n.fin:' + EXIT0,
      hints: ['cmp rax, 5', 'jg .chaud (5 lui-même doit donner OK)'],
      tests: [{ stdin: '9\n', expect: 'CHAUD\n' }, { stdin: '6\n', expect: 'CHAUD\n' }, { stdin: '5\n', expect: 'OK\n' }, { stdin: '2\n', expect: 'OK\n' }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a4_4', ch: 4, ord: 4, stars: 1,
      title: 'Le stock de la boulangerie',
      stdin: '1\n',
      story: 'La boulangère tape le nombre de sacs de farine restants. Sous 3 sacs, il faut commander ; sinon, le programme ne dit rien.',
      goal: 'Lis un chiffre. S’il est plus petit que 3, affiche <code>COMMANDER⏎</code> ; sinon, n’affiche rien. Astuce : saute <b>par-dessus</b> le message quand le stock suffit.',
      lesson: '<p>Pour faire « si stock &lt; 3 alors afficher », on écrit souvent la condition <b>inverse</b> : « si stock ≥ 3, sauter après l’affichage ».</p>' +
        '<pre>cmp rax, 3\njge .fin        ; assez de stock : on saute le message\n; … affichage …\n.fin:</pre>',
      starter: 'section .data\n\tmsg\tdb "COMMANDER", 10\n\tlen\tequ $ - msg\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : si rax >= 3, saute vers .fin\n\n' + wr('msg', 'len') + '\n.fin:' + EXIT0,
      solution: 'section .data\n\tmsg\tdb "COMMANDER", 10\n\tlen\tequ $ - msg\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\tcmp\trax, 3\n\tjge\t.fin\n\n' + wr('msg', 'len') + '\n.fin:' + EXIT0,
      hints: ['cmp rax, 3', 'jge .fin'],
      tests: [{ stdin: '1\n', expect: 'COMMANDER\n' }, { stdin: '3\n', expect: '' }, { stdin: '8\n', expect: '' }, { stdin: '0\n', expect: 'COMMANDER\n' }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a4_5', ch: 4, ord: 5, stars: 1,
      title: 'Le plus grand des deux',
      stdin: '38\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdi'] },
      story: 'Deux équipes ont marqué des points au baby-foot (un chiffre chacune). Le tableau doit afficher le meilleur score.',
      goal: 'Le code fourni lit deux chiffres dans rax et rbx. Termine avec le <b>plus grand</b> des deux comme code de sortie. Avec <code>38</code> → <code>8</code>.',
      lesson: '<p>Idée : on suppose que rax est le plus grand. Si ce n’est pas le cas, on le remplace par rbx.</p>' +
        '<pre>cmp rax, rbx\njge .fin        ; rax déjà le plus grand\nmov rax, rbx\n.fin:</pre>' +
        '<p>(Les pros utilisent aussi <code>cmovl rax, rbx</code> : un mov qui n’a lieu que si la condition est vraie.)</p>',
      starter: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\n\tsub\trax, \'0\'\n\tmovzx\trbx, byte [chiffres + 1]\n\tsub\trbx, \'0\'\n\t; TODO : garde le plus grand dans rax\n\n.fin:\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\n\tsub\trax, \'0\'\n\tmovzx\trbx, byte [chiffres + 1]\n\tsub\trbx, \'0\'\n\tcmp\trax, rbx\n\tjge\t.fin\n\tmov\trax, rbx\n\n.fin:\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['cmp rax, rbx', 'Si rax >= rbx, saute à .fin ; sinon mov rax, rbx.'],
      tests: [{ stdin: '38\n', exit: 8 }, { stdin: '72\n', exit: 7 }, { stdin: '55\n', exit: 5 }, { stdin: '09\n', exit: 9 }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a4_6', ch: 4, ord: 6, stars: 2,
      title: 'Pair ou impair',
      stdin: '4\n',
      story: 'Au jeu de la roulette du foyer, on mise sur pair ou impair. Le croupier tape le chiffre sorti.',
      goal: 'Lis un chiffre et affiche <code>PAIR⏎</code> ou <code>IMPAIR⏎</code>.',
      lesson: '<p>Un nombre est impair quand son <b>bit de poids faible</b> vaut 1. <code>test al, 1</code> fait un « et » bit à bit sans garder le résultat : ZF passe à 1 si le bit est 0 (pair).</p>' +
        '<pre>test al, 1\njnz .impair     ; bit à 1 → impair</pre>' +
        '<p>Bonus : le caractère <code>\'0\'</code> vaut 48 (pair), donc tester directement le caractère marche aussi !</p>',
      starter: 'section .data\n\tpair\tdb "PAIR", 10\n\timpair\tdb "IMPAIR", 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : saute vers .impair si rax est impair\n\n' + wr('pair', 5) + '\tjmp\t.fin\n\n.impair:\n' + wr('impair', 7) + '\n.fin:' + EXIT0,
      solution: 'section .data\n\tpair\tdb "PAIR", 10\n\timpair\tdb "IMPAIR", 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\ttest\tal, 1\t\t\t; bit de poids faible ?\n\tjnz\t.impair\n\n' + wr('pair', 5) + '\tjmp\t.fin\n\n.impair:\n' + wr('impair', 7) + '\n.fin:' + EXIT0,
      hints: ['Le dernier bit d’un nombre impair vaut 1.', 'test al, 1', 'jnz .impair'],
      tests: [{ stdin: '4\n', expect: 'PAIR\n' }, { stdin: '7\n', expect: 'IMPAIR\n' }, { stdin: '0\n', expect: 'PAIR\n' }, { stdin: '9\n', expect: 'IMPAIR\n' }],
      rules: { mustSrc: [{ re: /\b(test|and|div|shr|bt)\b/.source, msg: 'Teste le bit de poids faible (test al, 1).' }] }
    },
    {
      id: 'a4_7', ch: 4, ord: 7, stars: 2,
      title: 'Le solde du compte',
      stdin: '73\n',
      story: 'La banque du campus reçoit un dépôt puis un retrait (un chiffre chacun). Le solde est-il positif, négatif ou nul ?',
      goal: 'Le code fourni calcule <code>rax = dépôt − retrait</code>. Affiche <code>POSITIF⏎</code>, <code>NEGATIF⏎</code> ou <code>NUL⏎</code>.',
      lesson: '<p>Pas besoin de <code>cmp</code> après un calcul : <code>sub</code> règle déjà les drapeaux. <b>ZF</b> = 1 si le résultat vaut 0, <b>SF</b> = 1 s’il est négatif.</p>' +
        '<pre>jz .nul         ; résultat nul\njs .negatif     ; signe moins (SF = 1)</pre>' +
        '<p>Tu peux aussi écrire <code>cmp rax, 0</code> puis <code>je</code> / <code>jl</code>.</p>',
      starter: 'section .data\n\tmpos\tdb "POSITIF", 10\n\tmneg\tdb "NEGATIF", 10\n\tmnul\tdb "NUL", 10\n\nsection .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\t\t; dépôt\n\tmovzx\trbx, byte [chiffres + 1]\t; retrait\n\tsub\trax, rbx\t\t\t\t; solde (les \'0\' s\'annulent)\n\t; TODO : saute vers .nul ou .negatif selon le résultat\n\tjmp\t.nul\n\n\tmov\trsi, mpos\n\tmov\trdx, 8\n\tjmp\t.ecrire\n.negatif:\n\tmov\trsi, mneg\n\tmov\trdx, 8\n\tjmp\t.ecrire\n.nul:\n\tmov\trsi, mnul\n\tmov\trdx, 4\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\tmpos\tdb "POSITIF", 10\n\tmneg\tdb "NEGATIF", 10\n\tmnul\tdb "NUL", 10\n\nsection .bss\n\tchiffres\tresb 2\n\n' + TEXT + rd('chiffres', 2) + '\tmovzx\trax, byte [chiffres]\n\tmovzx\trbx, byte [chiffres + 1]\n\tsub\trax, rbx\n\tjz\t.nul\n\tjs\t.negatif\n\n\tmov\trsi, mpos\n\tmov\trdx, 8\n\tjmp\t.ecrire\n.negatif:\n\tmov\trsi, mneg\n\tmov\trdx, 8\n\tjmp\t.ecrire\n.nul:\n\tmov\trsi, mnul\n\tmov\trdx, 4\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      hints: ['Le cas positif est celui qui continue tout droit.', 'jz .nul', 'js .negatif (et supprime le jmp .nul)'],
      tests: [{ stdin: '73\n', expect: 'POSITIF\n' }, { stdin: '38\n', expect: 'NEGATIF\n' }, { stdin: '55\n', expect: 'NUL\n' }, { stdin: '09\n', expect: 'NEGATIF\n' }],
      rules: {}
    },
    {
      id: 'a4_8', ch: 4, ord: 8, stars: 2,
      title: 'Le bulletin',
      stdin: '7\n',
      story: 'Le professeur note sur 9. Le bulletin affiche une appréciation : moins de 5 → INSUFFISANT, de 5 à 7 → BIEN, 8 ou 9 → EXCELLENT.',
      goal: 'Lis une note (un chiffre) et affiche <code>INSUFFISANT⏎</code>, <code>BIEN⏎</code> ou <code>EXCELLENT⏎</code>.',
      lesson: '<p>Plusieurs cas = plusieurs comparaisons à la suite, comme des <code>if … else if …</code> :</p>' +
        '<pre>cmp rax, 5\njl .insuffisant\ncmp rax, 8\njl .bien\n; ici : 8 ou plus</pre>' +
        '<p>Chaque branche se termine par un <code>jmp</code> vers la suite commune, sinon elle « tombe » dans la suivante.</p>',
      starter: 'section .data\n\tinsuf\tdb "INSUFFISANT", 10\n\tlinsuf\tequ $ - insuf\n\tbien\tdb "BIEN", 10\n\tlbien\tequ $ - bien\n\texcel\tdb "EXCELLENT", 10\n\tlexcel\tequ $ - excel\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\t; TODO : choisis le bon message selon la note\n\n.insuffisant:\n\tmov\trsi, insuf\n\tmov\trdx, linsuf\n\tjmp\t.ecrire\n.bien:\n\tmov\trsi, bien\n\tmov\trdx, lbien\n\tjmp\t.ecrire\n.excellent:\n\tmov\trsi, excel\n\tmov\trdx, lexcel\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      solution: 'section .data\n\tinsuf\tdb "INSUFFISANT", 10\n\tlinsuf\tequ $ - insuf\n\tbien\tdb "BIEN", 10\n\tlbien\tequ $ - bien\n\texcel\tdb "EXCELLENT", 10\n\tlexcel\tequ $ - excel\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rax') + '\tcmp\trax, 5\n\tjl\t.insuffisant\n\tcmp\trax, 8\n\tjl\t.bien\n\tjmp\t.excellent\n\n.insuffisant:\n\tmov\trsi, insuf\n\tmov\trdx, linsuf\n\tjmp\t.ecrire\n.bien:\n\tmov\trsi, bien\n\tmov\trdx, lbien\n\tjmp\t.ecrire\n.excellent:\n\tmov\trsi, excel\n\tmov\trdx, lexcel\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      hints: ['Commence par le cas « moins de 5 ».', 'cmp rax, 5 / jl .insuffisant', 'cmp rax, 8 / jl .bien / jmp .excellent'],
      tests: [{ stdin: '4\n', expect: 'INSUFFISANT\n' }, { stdin: '5\n', expect: 'BIEN\n' }, { stdin: '7\n', expect: 'BIEN\n' }, { stdin: '8\n', expect: 'EXCELLENT\n' }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a4_9', ch: 4, ord: 9, stars: 2,
      title: 'Le podium',
      stdin: '372\n',
      story: 'Trois coureurs, trois scores à un chiffre tapés d’un coup. Le speaker veut annoncer le <b>meilleur score</b>.',
      goal: 'Lis trois chiffres et affiche le plus grand, suivi d’un retour à la ligne. Avec <code>372</code> → <code>7⏎</code>.',
      lesson: '<p>On peut comparer directement les <b>caractères</b> : <code>\'0\'</code> &lt; <code>\'1\'</code> &lt; … &lt; <code>\'9\'</code>, leurs codes se suivent.</p>' +
        '<p><code>cmp al, [scores + 1]</code> compare al avec un octet en mémoire. Pour des codes sans signe, on utilise plutôt <code>ja</code>/<code>jae</code>/<code>jb</code>/<code>jbe</code> (<i>above</i> / <i>below</i>).</p>' +
        '<p>Range le gagnant dans <code>res</code> : le <code>10</code> qui le suit fera le retour à la ligne.</p>',
      starter: 'section .data\n\tres\tdb 0, 10\t\t\t; le gagnant, puis \'\\n\'\n\nsection .bss\n\tscores\tresb 3\n\n' + TEXT + rd('scores', 3) + '\tmov\tal, [scores]\t\t; premier score\n\t; TODO : garde dans al le plus grand des trois\n\n\tmov\t[res], al\n' + wr('res', 2) + EXIT0,
      solution: 'section .data\n\tres\tdb 0, 10\n\nsection .bss\n\tscores\tresb 3\n\n' + TEXT + rd('scores', 3) + '\tmov\tal, [scores]\n\tcmp\tal, [scores + 1]\n\tjae\t.deux\n\tmov\tal, [scores + 1]\n.deux:\n\tcmp\tal, [scores + 2]\n\tjae\t.fin\n\tmov\tal, [scores + 2]\n.fin:\n\tmov\t[res], al\n' + wr('res', 2) + EXIT0,
      hints: ['Comme pour le maximum de deux, mais deux fois.', 'cmp al, [scores + 1] / jae .deux / mov al, [scores + 1]', '.deux: puis la même chose avec [scores + 2].'],
      tests: [{ stdin: '372\n', expect: '7\n' }, { stdin: '159\n', expect: '9\n' }, { stdin: '826\n', expect: '8\n' }, { stdin: '444\n', expect: '4\n' }],
      rules: { mustSrc: [{ re: /\bcmp\b/.source, msg: 'Utilise cmp.' }] }
    },

    /* ===================== Chapitre 5 · Boucles ===================== */
    {
      id: 'a5_1', ch: 5, ord: 1, stars: 2,
      title: 'Les tours de piste',
      scene: 'rocket', sceneOpts: { hint: 'Une étoile par tour de piste' },
      story: 'À l’entraînement, chaque tour de piste fait apparaître une étoile au tableau. Aujourd’hui : 5 tours.',
      goal: 'Affiche <code>*****⏎</code> avec une <b>boucle</b> : un seul write de <code>*</code>, répété 5 fois.',
      lesson: '<p>Une boucle = une étiquette + un saut <b>en arrière</b> :</p><pre>    mov rbx, 5\n.tour:\n    … (une étoile)\n    dec rbx         ; rbx - 1, ZF = 1 si on arrive à 0\n    jnz .tour       ; recommence tant que rbx ≠ 0</pre>' +
        '<p>⚠ N’utilise pas rcx comme compteur : <code>syscall</code> l’écrase. rbx est préservé.</p>',
      starter: 'section .data\n\tetoile\tdb "*"\n\tnl\t\tdb 10\n\n' + TEXT + '\tmov\trbx, 5\t\t\t; nombre de tours\n\t; TODO : une étiquette ici…\n' + wr('etoile', 1) + '\t; TODO : … et ici dec rbx puis un saut vers l\'étiquette\n' + wr('nl', 1) + EXIT0,
      solution: 'section .data\n\tetoile\tdb "*"\n\tnl\t\tdb 10\n\n' + TEXT + '\tmov\trbx, 5\n.tour:\n' + wr('etoile', 1) + '\tdec\trbx\n\tjnz\t.tour\n' + wr('nl', 1) + EXIT0,
      hints: ['Ajoute .tour: juste avant le write de l’étoile.', 'Après le syscall : dec rbx', 'jnz .tour'],
      tests: [{ expect: '*****\n', exit: 0 }],
      rules: { mustSrc: [LOOP], forbidSrc: [{ re: /\*\*/.source, msg: 'Une seule étoile dans les données : c’est la boucle qui répète.' }] }
    },
    {
      id: 'a5_2', ch: 5, ord: 2, stars: 2,
      title: 'La guirlande à la demande',
      stdin: '3\n',
      story: 'Pour la fête du campus, le décorateur tape la longueur de la guirlande (un chiffre). Attention : il peut taper 0 !',
      goal: 'Lis un chiffre n et affiche n fois <code>#</code>, puis un retour à la ligne. Avec <code>3</code> → <code>###⏎</code>, avec <code>0</code> → <code>⏎</code>.',
      lesson: '<p>Si le compteur vaut déjà 0, une boucle « fais puis vérifie » tourne quand même une fois… puis <code>dec</code> donne −1 et elle ne s’arrête plus !</p>' +
        '<p>Il faut donc vérifier <b>avant</b> d’entrer :</p><pre>    test rbx, rbx   ; rbx vaut 0 ?\n    jz .fin         ; oui : on saute la boucle</pre>',
      starter: 'section .data\n\tdiese\tdb "#"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\t; TODO : affiche rbx fois le # (attention à 0 !)\n\n.fin:\n' + wr('nl', 1) + EXIT0,
      solution: 'section .data\n\tdiese\tdb "#"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\ttest\trbx, rbx\n\tjz\t.fin\t\t\t; rien à afficher\n.boucle:\n' + wr('diese', 1) + '\tdec\trbx\n\tjnz\t.boucle\n\n.fin:\n' + wr('nl', 1) + EXIT0,
      hints: ['La même boucle que la mission précédente, avec rbx lu au clavier.', 'Avant la boucle : test rbx, rbx / jz .fin'],
      tests: [{ stdin: '3\n', expect: '###\n' }, { stdin: '7\n', expect: '#######\n' }, { stdin: '0\n', expect: '\n' }],
      rules: { mustSrc: [LOOP] }
    },
    {
      id: 'a5_3', ch: 5, ord: 3, stars: 2,
      title: 'Compter jusqu’à n',
      stdin: '5\n',
      story: 'Le professeur de maternelle du campus veut un programme qui compte avec les petits : 1, 2, 3… jusqu’au chiffre tapé.',
      goal: 'Lis un chiffre n et affiche les chiffres de 1 à n collés, puis un retour à la ligne. Avec <code>5</code> → <code>12345⏎</code>, avec <code>0</code> → <code>⏎</code>.',
      lesson: '<p>Cette fois le compteur <b>monte</b> : <code>r12</code> part de 1, et on continue tant que <code>r12 ≤ n</code>.</p>' +
        '<pre>    mov r12, 1\n.boucle:\n    cmp r12, rbx\n    jg .fin          ; r12 > n : c’est fini\n    …\n    inc r12\n    jmp .boucle</pre>' +
        '<p>Pour afficher r12 : ajoute <code>\'0\'</code> et range l’octet dans <code>[car]</code> avant le write.</p>',
      starter: 'section .data\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\tcar\t\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\tr12, 1\t\t\t; on commence à 1\n\t; TODO : tant que r12 <= rbx : affiche r12 puis inc r12\n\n.fin:\n' + wr('nl', 1) + EXIT0,
      solution: 'section .data\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\tcar\t\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\tr12, 1\n.boucle:\n\tcmp\tr12, rbx\n\tjg\t.fin\n\tmov\trax, r12\n\tadd\tal, \'0\'\t\t\t; chiffre -> caractère\n\tmov\t[car], al\n' + wr('car', 1) + '\tinc\tr12\n\tjmp\t.boucle\n\n.fin:\n' + wr('nl', 1) + EXIT0,
      hints: ['.boucle: cmp r12, rbx / jg .fin', 'mov rax, r12 / add al, \'0\' / mov [car], al puis un write de car.', 'inc r12 / jmp .boucle'],
      tests: [{ stdin: '5\n', expect: '12345\n' }, { stdin: '9\n', expect: '123456789\n' }, { stdin: '1\n', expect: '1\n' }, { stdin: '0\n', expect: '\n' }],
      rules: { mustSrc: [LOOP], forbidSrc: [{ re: /"12/.source, msg: 'Pas de texte tout fait : c’est la boucle qui compte.' }] }
    },
    {
      id: 'a5_4', ch: 5, ord: 4, stars: 2,
      title: 'La tirelire',
      stdin: '4\n',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx'] },
      story: 'Léa met 1 pièce dans sa tirelire le premier jour, 2 le deuxième, 3 le troisième… Combien a-t-elle après n jours ?',
      goal: 'Lis un chiffre n et termine avec <code>1 + 2 + … + n</code> comme code de sortie, calculé avec une boucle. Avec <code>4</code> → <code>10</code>.',
      lesson: '<p>Un <b>accumulateur</b> : un registre qui part de 0 et grossit à chaque tour.</p>' +
        '<pre>    xor eax, eax    ; somme = 0\n.boucle:\n    add rax, rbx    ; somme += n\n    dec rbx         ; n - 1\n    …</pre>' +
        '<p>Compter à rebours de n à 1 donne la même somme.</p>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\txor\teax, eax\t\t; somme = 0\n\t; TODO : ajoute rbx, rbx-1, … 1 à rax\n\n.fin:\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\txor\teax, eax\n.boucle:\n\ttest\trbx, rbx\n\tjz\t.fin\n\tadd\trax, rbx\n\tdec\trbx\n\tjmp\t.boucle\n\n.fin:\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['N’oublie pas le cas n = 0.', '.boucle: test rbx, rbx / jz .fin', 'add rax, rbx / dec rbx / jmp .boucle'],
      tests: [{ stdin: '4\n', exit: 10 }, { stdin: '9\n', exit: 45 }, { stdin: '0\n', exit: 0 }, { stdin: '1\n', exit: 1 }],
      rules: { mustSrc: [LOOP], forbidSrc: [{ re: /\b(imul|mul)\b/.source, msg: 'Pas de formule : fais-le avec une boucle.' }] }
    },
    {
      id: 'a5_5', ch: 5, ord: 5, stars: 2,
      title: 'La somme des chiffres',
      stdin: '1234\n',
      story: 'Le contrôleur des tickets vérifie un numéro en additionnant tous ses chiffres. Le numéro arrive sur une ligne, terminée par un retour à la ligne.',
      goal: 'Lis une ligne de chiffres (au plus 16 octets) et termine avec la <b>somme de ses chiffres</b>. Avec <code>1234⏎</code> → <code>10</code>.',
      lesson: '<p>On parcourt le tampon avec un <b>indice</b> : <code>byte [ligne + rbx]</code> est l’octet n° rbx de la ligne.</p>' +
        '<p>On s’arrête sur le <code>\\n</code> (10) :</p><pre>.boucle:\n    movzx eax, byte [ligne + rbx]\n    cmp al, 10\n    je .fin\n    …\n    inc rbx\n    jmp .boucle</pre>',
      starter: 'section .bss\n\tligne\tresb 16\n\n' + TEXT + rd('ligne', 16) + '\txor\tebx, ebx\t\t; indice = 0\n\txor\tr12d, r12d\t\t; somme = 0\n\t; TODO : pour chaque octet jusqu\'au \'\\n\' : ajoute sa valeur à r12\n\n.fin:\n\tmov\trdi, r12\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\tligne\tresb 16\n\n' + TEXT + rd('ligne', 16) + '\txor\tebx, ebx\n\txor\tr12d, r12d\n.boucle:\n\tmovzx\teax, byte [ligne + rbx]\n\tcmp\tal, 10\t\t\t; fin de ligne ?\n\tje\t.fin\n\tsub\teax, \'0\'\n\tadd\tr12, rax\n\tinc\trbx\n\tjmp\t.boucle\n\n.fin:\n\tmov\trdi, r12\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['movzx eax, byte [ligne + rbx]', 'cmp al, 10 / je .fin', 'sub eax, \'0\' / add r12, rax / inc rbx / jmp .boucle'],
      tests: [{ stdin: '1234\n', exit: 10 }, { stdin: '999\n', exit: 27 }, { stdin: '5\n', exit: 5 }, { stdin: '80706\n', exit: 21 }],
      rules: { mustSrc: [LOOP] }
    },
    {
      id: 'a5_6', ch: 5, ord: 6, stars: 3,
      title: 'La chasse aux a',
      stdin: 'banane\n',
      story: 'Le club de jeux de mots organise un concours : quel mot contient le plus de lettres <b>a</b> ? Il faut un compteur automatique.',
      goal: 'Lis une ligne (au plus 64 octets) et termine avec le <b>nombre de</b> <code>a</code> minuscules. Avec <code>banane⏎</code> → <code>2</code>.',
      lesson: '<p>Cette fois on s’arrête grâce au nombre d’octets lus (rax après <code>read</code>) : on boucle tant que <code>indice &lt; longueur</code>.</p>' +
        '<p>Pour compter seulement certains tours, on <b>saute par-dessus</b> le <code>inc</code> :</p><pre>    cmp byte [texte + rbx], \'a\'\n    jne .suivant\n    inc r13\n.suivant:\n    inc rbx</pre>',
      starter: 'section .bss\n\ttexte\tresb 64\n\n' + TEXT + rd('texte', 64) + '\tmov\tr12, rax\t\t; longueur lue\n\txor\tebx, ebx\t\t; indice\n\txor\tr13d, r13d\t\t; nombre de a\n\t; TODO : parcours les r12 octets et compte les \'a\'\n\n.fin:\n\tmov\trdi, r13\n\tmov\trax, 60\n\tsyscall\n',
      solution: 'section .bss\n\ttexte\tresb 64\n\n' + TEXT + rd('texte', 64) + '\tmov\tr12, rax\n\txor\tebx, ebx\n\txor\tr13d, r13d\n.boucle:\n\tcmp\trbx, r12\n\tjge\t.fin\t\t\t; tout lu\n\tcmp\tbyte [texte + rbx], \'a\'\n\tjne\t.suivant\n\tinc\tr13\n.suivant:\n\tinc\trbx\n\tjmp\t.boucle\n\n.fin:\n\tmov\trdi, r13\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['.boucle: cmp rbx, r12 / jge .fin', 'cmp byte [texte + rbx], \'a\' / jne .suivant / inc r13', '.suivant: inc rbx / jmp .boucle'],
      tests: [{ stdin: 'banane\n', exit: 2 }, { stdin: 'abracadabra\n', exit: 5 }, { stdin: '42\n', exit: 0 }, { stdin: 'aaaaaaa\n', exit: 7 }],
      rules: { mustSrc: [LOOP] }
    },
    {
      id: 'a5_7', ch: 5, ord: 7, stars: 3,
      title: 'Le tableau d’affichage',
      stdin: '4\n',
      story: 'La tirelire de Léa a maintenant un écran ! Mais il n’affiche qu’un chiffre : au-delà de 9, il montre des symboles bizarres. Apprends-lui à afficher des nombres à plusieurs chiffres.',
      goal: 'Le code fourni calcule la somme 1 + … + n dans rax. Affiche-la en décimal, suivie d’un retour à la ligne. Avec <code>4</code> → <code>10⏎</code>, avec <code>9</code> → <code>45⏎</code>.',
      lesson: '<p>Pour découper un nombre en chiffres, on divise par 10 : le <b>reste</b> est le dernier chiffre, le quotient est ce qu’il reste à traiter.</p>' +
        '<pre>45 / 10 = 4 reste 5   → \'5\'\n 4 / 10 = 0 reste 4   → \'4\'   (quotient 0 : fini)</pre>' +
        '<p>Les chiffres sortent à l’envers : on les range dans le tampon <b>de droite à gauche</b>, avec un pointeur <code>rsi</code> qui recule. La boucle « fais puis vérifie » gère aussi le nombre 0.</p>',
      starter: 'section .bss\n\tchiffre\tresb 1\n\tnombre\tresb 8\n\n' + TEXT + digit('rbx') + '\txor\teax, eax\t\t; somme = 0\n.somme:\n\ttest\trbx, rbx\n\tjz\t.affiche\n\tadd\trax, rbx\n\tdec\trbx\n\tjmp\t.somme\n\n.affiche:\n\t; TODO : ce code n\'affiche qu\'UN chiffre ; découpe rax avec div 10\n\tadd\tal, \'0\'\n\tmov\t[nombre], al\n\tmov\tbyte [nombre + 1], 10\n' + wr('nombre', 2) + EXIT0,
      solution: 'section .bss\n\tchiffre\tresb 1\n\tnombre\tresb 8\n\n' + TEXT + digit('rbx') + '\txor\teax, eax\n.somme:\n\ttest\trbx, rbx\n\tjz\t.affiche\n\tadd\trax, rbx\n\tdec\trbx\n\tjmp\t.somme\n\n.affiche:\n\tmov\trsi, nombre + 7\t\t; on remplit depuis la fin\n\tmov\tbyte [rsi], 10\t\t; le \'\\n\' final\n\tmov\trbx, 10\n.chiffre:\n\txor\trdx, rdx\n\tdiv\trbx\t\t\t\t; rax = rax / 10, rdx = dernier chiffre\n\tadd\tdl, \'0\'\n\tdec\trsi\n\tmov\t[rsi], dl\n\ttest\trax, rax\n\tjnz\t.chiffre\n\n\tmov\trdx, nombre + 8\n\tsub\trdx, rsi\t\t\t; nombre d\'octets à écrire\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT0,
      hints: ['Mets rsi sur nombre + 7 et range 10 (\'\\n\') à cette adresse.', 'Boucle : xor rdx, rdx / div rbx (rbx = 10) / add dl, \'0\' / dec rsi / mov [rsi], dl', 'Continue tant que rax ≠ 0, puis write depuis rsi : rdx = nombre + 8 - rsi.'],
      tests: [{ stdin: '4\n', expect: '10\n' }, { stdin: '9\n', expect: '45\n' }, { stdin: '2\n', expect: '3\n' }, { stdin: '0\n', expect: '0\n' }],
      rules: { mustSrc: [{ re: /\bdiv\b/.source, msg: 'Découpe le nombre avec div 10.' }] }
    },
    {
      id: 'a5_8', ch: 5, ord: 8, stars: 3,
      title: 'Le carrelage',
      stdin: '3\n',
      story: 'Le carreleur pose des dalles en carré : n rangées de n dalles. Il veut voir le plan avant de commencer.',
      goal: 'Lis un chiffre n (de 1 à 9) et affiche un carré de n lignes de n <code>#</code>. Avec <code>3</code> :<pre>###⏎###⏎###⏎</pre>',
      lesson: '<p>Une boucle <b>dans</b> une boucle : la boucle extérieure compte les lignes (<code>r12</code>), la boucle intérieure les dalles d’une ligne (<code>r13</code>).</p>' +
        '<p>Le compteur intérieur doit être <b>remis à n au début de chaque ligne</b>. Les deux compteurs doivent survivre à syscall : r12 et r13 conviennent.</p>',
      starter: 'section .data\n\tdalle\tdb "#"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\t; TODO : répète cette ligne rbx fois (compteur r12)\n\tmov\tr13, rbx\t\t; dalles restantes sur la ligne\n.dalle:\n' + wr('dalle', 1) + '\tdec\tr13\n\tjnz\t.dalle\n' + wr('nl', 1) + EXIT0,
      solution: 'section .data\n\tdalle\tdb "#"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\tr12, rbx\t\t; lignes restantes\n.ligne:\n\tmov\tr13, rbx\n.dalle:\n' + wr('dalle', 1) + '\tdec\tr13\n\tjnz\t.dalle\n' + wr('nl', 1) + '\tdec\tr12\n\tjnz\t.ligne\n' + EXIT0,
      hints: ['mov r12, rbx avant tout, puis une étiquette .ligne:', 'L’étiquette .ligne doit être AVANT mov r13, rbx.', 'Après le write du \\n : dec r12 / jnz .ligne'],
      tests: [{ stdin: '3\n', expect: '###\n###\n###\n' }, { stdin: '1\n', expect: '#\n' }, { stdin: '4\n', expect: '####\n####\n####\n####\n' }],
      rules: { mustSrc: [LOOP] }
    },
    {
      id: 'a5_9', ch: 5, ord: 9, stars: 3,
      title: 'La pyramide de cartons',
      stdin: '4\n',
      scene: 'rocket', sceneOpts: { hint: 'La pyramide grandit d’un carton par étage' },
      story: 'Au déménagement du club, on empile les cartons en escalier : 1 carton au premier étage, 2 au deuxième… jusqu’à n.',
      goal: 'Lis un chiffre n et affiche n lignes : la ligne i contient i <code>*</code>. Avec <code>4</code> :<pre>*⏎**⏎***⏎****⏎</pre>Avec <code>0</code>, n’affiche rien.',
      lesson: '<p>Le nombre de tours de la boucle intérieure dépend maintenant du <b>numéro de ligne</b> : au début de chaque ligne, <code>mov r13, r12</code>.</p>' +
        '<p>La boucle extérieure monte de 1 à n et s’arrête quand <code>r12 &gt; n</code>.</p>',
      starter: 'section .data\n\tcarton\tdb "*"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\tr12, 1\t\t\t; numéro de ligne\n\t; TODO : pour chaque ligne r12 de 1 à rbx, affiche r12 cartons puis \'\\n\'\n\n.fin:' + EXIT0,
      solution: 'section .data\n\tcarton\tdb "*"\n\tnl\t\tdb 10\n\nsection .bss\n\tchiffre\tresb 1\n\n' + TEXT + digit('rbx') + '\tmov\tr12, 1\n.ligne:\n\tcmp\tr12, rbx\n\tjg\t.fin\n\tmov\tr13, r12\t\t; autant de cartons que le numéro de ligne\n.carton:\n' + wr('carton', 1) + '\tdec\tr13\n\tjnz\t.carton\n' + wr('nl', 1) + '\tinc\tr12\n\tjmp\t.ligne\n\n.fin:' + EXIT0,
      hints: ['.ligne: cmp r12, rbx / jg .fin', 'mov r13, r12 puis la boucle .carton (dec r13 / jnz .carton).', 'Après le \\n : inc r12 / jmp .ligne'],
      tests: [{ stdin: '4\n', expect: '*\n**\n***\n****\n' }, { stdin: '1\n', expect: '*\n' }, { stdin: '3\n', expect: '*\n**\n***\n' }, { stdin: '0\n', expect: '' }],
      rules: { mustSrc: [LOOP] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
