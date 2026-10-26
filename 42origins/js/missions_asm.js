/* =========================================================================
 *  42 ORIGINS — missions assembleur x86-64 (10 contrats)
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  var U = O42.util;
  /* données « pokées » avant l'exécution pour les tests cachés */
  function q(n) { var b = [], v = BigInt.asUintN(64, BigInt(n)); for (var i = 0; i < 8; i++) { b.push(Number(v & 255n)); v >>= 8n; } return b; }
  function z(s) { return U.utf8(s).concat([0]); }

  var EXIT = '\n\tmov\trax, 60\t\t; exit\n\txor\trdi, rdi\t; code 0\n\tsyscall\n';

  O42.missions.asm = [
    {
      id: 'a1', title: 'La porte du processeur', job: 'Contrat 01 · Gardien', stars: 1,
      scene: 'door', sceneOpts: { code: 42 },
      story: 'Bienvenue dans le cœur de la machine. La porte du processeur ne s’ouvre que si ton programme se termine avec le <b>code de sortie 42</b>.',
      goal: 'Modifie le programme pour qu’il se termine avec le code de sortie <code>42</code>.',
      lesson: '<p>Le processeur possède des <b>registres</b> : 16 petites cases ultra-rapides de 64 bits (rax, rbx, rcx, rdx, rsi, rdi, rbp, rsp, r8…r15).</p>' +
        '<p><code>mov destination, source</code> copie une valeur : <code>mov rdi, 5</code> met 5 dans rdi.</p>' +
        '<p>Pour parler au système (Linux), on fait un <b>appel système</b> : on met son numéro dans <code>rax</code>, ses arguments dans <code>rdi</code>, <code>rsi</code>, <code>rdx</code>, puis on exécute <code>syscall</code>.</p>' +
        '<table><tr><th>rax</th><th>appel</th><th>arguments</th></tr><tr><td>60</td><td>exit</td><td>rdi = code de sortie</td></tr><tr><td>1</td><td>write</td><td>rdi = fd, rsi = adresse, rdx = taille</td></tr><tr><td>0</td><td>read</td><td>rdi = fd, rsi = adresse, rdx = taille max</td></tr></table>' +
        '<p>Avance pas à pas et regarde le registre changer dans la vue <b>processeur</b>.</p>',
      starter: 'section .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 60\t\t; numéro de l\'appel système exit\n\tmov\trdi, 0\t\t; code de sortie\n\tsyscall\t\t\t; le noyau termine le programme\n',
      hints: ['C’est rdi qui contient le code de sortie.', 'mov rdi, 42'],
      solution: 'section .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 60\n\tmov\trdi, 42\n\tsyscall\n',
      tests: [{ exit: 42 }],
      rules: { mustSrc: [{ re: '\\bsyscall\\b', msg: 'Il faut terminer avec syscall.' }] }
    },
    {
      id: 'a2', title: 'Dire bonjour en assembleur', job: 'Contrat 02 · Agent d’accueil', stars: 1,
      scene: 'talk', sceneOpts: { who: 'robot', name: 'Marvin', expect: 'Bonjour Marvin\n', happy: 'Bip bip ! Tu parles le langage machine !', wrong: 'Bip ? Message incorrect…', wait: '(Marvin écoute le processeur)' },
      story: 'Marvin te met au défi : le saluer <b>sans C</b>, directement avec un appel système <code>write</code>.',
      goal: 'Affiche <code>Bonjour Marvin⏎</code> avec l’appel système <code>write</code> (rax = 1), puis termine proprement avec <code>exit</code>.',
      lesson: '<p>Le texte est rangé dans la section <b>.data</b> : <code>msg db "Bonjour", 10</code> réserve une case par octet (<b>db</b> = define byte) ; <code>10</code> est le code ASCII de <code>\\n</code>.</p>' +
        '<p><code>len equ $ - msg</code> calcule la longueur : <code>$</code> = adresse courante, moins l’adresse de début.</p>' +
        '<p>Pour <code>write</code> : <code>rax = 1</code>, <code>rdi = 1</code> (stdout), <code>rsi = msg</code> (l’<b>adresse</b> du texte), <code>rdx = len</code>.</p>' +
        '<p>⚠ Un programme assembleur ne s’arrête jamais tout seul : sans <code>exit</code>, le processeur continue à lire n’importe quoi → <b>Segmentation fault</b>.</p>',
      starter: 'section .data\n\tmsg\tdb "Bonjour", 10\t; 10 = \'\\n\'\n\tlen\tequ $ - msg\t\t; longueur calculée\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 1\t\t; write\n\tmov\trdi, 1\t\t; fd 1 = stdout\n\t; TODO : rsi = adresse du message, rdx = sa longueur\n\tsyscall\n' + EXIT,
      hints: ['Change d’abord le texte : "Bonjour Marvin", 10', 'mov rsi, msg', 'mov rdx, len'],
      solution: 'section .data\n\tmsg\tdb "Bonjour Marvin", 10\n\tlen\tequ $ - msg\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, msg\n\tmov\trdx, len\n\tsyscall\n' + EXIT,
      tests: [{ expect: 'Bonjour Marvin\n', exit: 0 }],
      rules: {}
    },
    {
      id: 'a3', title: 'La calculatrice du marché', job: 'Contrat 03 · Comptable', stars: 2,
      scene: 'calc', sceneOpts: { regs: ['rax', 'rbx', 'rdi'] },
      story: 'Le marchand vend des lots : (a + b) paniers à 3 pièces, moins c pièces de réduction. Calcule le prix avec l’<b>ALU</b> du processeur et rends-le en code de sortie.',
      goal: 'Calcule <code>(a + b) × 3 − c</code> où a, b, c sont dans <code>.data</code>, et termine avec ce résultat comme code de sortie. Avec a = 7, b = 5, c = 6 → <b>30</b>. (D’autres valeurs seront testées !)',
      lesson: '<p>Lire une variable en mémoire : <code>mov rax, [a]</code> — les crochets veulent dire « le <b>contenu</b> à l’adresse a ». Sans crochets, <code>mov rax, a</code> copie l’<b>adresse</b> !</p>' +
        '<p>Opérations de l’ALU :</p><pre>add rax, rbx     ; rax = rax + rbx\nsub rax, rbx     ; rax = rax - rbx\nimul rax, 3      ; rax = rax × 3\ninc rax / dec rax</pre>' +
        '<p>Chaque opération met à jour les <b>drapeaux</b> (ZF si le résultat vaut 0, SF s’il est négatif…). Regarde l’ALU calculer dans la vue processeur.</p>' +
        '<p><code>dq</code> = define quad-word : 8 octets (64 bits).</p>',
      starter: 'section .data\n\ta\tdq 7\n\tb\tdq 5\n\tc\tdq 6\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, [a]\t; rax = contenu de a\n\t; TODO : ajoute b, multiplie par 3, retire c\n\n\tmov\trdi, rax\t; le résultat devient le code de sortie\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['add rax, [b]', 'imul rax, 3', 'sub rax, [c]'],
      solution: 'section .data\n\ta\tdq 7\n\tb\tdq 5\n\tc\tdq 6\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, [a]\n\tadd\trax, [b]\n\timul\trax, 3\n\tsub\trax, [c]\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      tests: [{ exit: 30 }, { exit: 40, poke: { a: q(10), b: q(4), c: q(2) } }, { exit: 0, poke: { a: q(1), b: q(1), c: q(6) } }, { exit: 200, poke: { a: q(33), b: q(34), c: q(1) } }],
      rules: { mustSrc: [{ re: '\\badd\\b', msg: 'Utilise add.' }, { re: '\\b(imul|mul)\\b', msg: 'Utilise imul.' }, { re: '\\bsub\\b', msg: 'Utilise sub.' }], forbidSrc: [{ re: 'mov\\s+rdi\\s*,\\s*30\\b', msg: 'Calcule le résultat, ne l’écris pas directement !' }] }
    },
    {
      id: 'a4', title: 'Le videur du club', job: 'Contrat 04 · Sécurité', stars: 2,
      scene: 'bouncer', sceneOpts: { v: 'age' },
      story: 'Le club 42 n’accepte que les majeurs. Programme le videur : il lit l’âge et affiche <b>ENTRE</b> (18 ans ou plus) ou <b>STOP</b>.',
      goal: 'Compare <code>[age]</code> à 18 avec <code>cmp</code>, puis saute vers <code>.entre</code> ou <code>.stop</code>. Testé avec 20, 18, 12 et 0 ans.',
      lesson: '<p>En assembleur, pas de <code>if</code> : on <b>compare</b> puis on <b>saute</b>.</p><pre>cmp rax, 18      ; calcule rax - 18 (sans le garder)\njge .majeur      ; saute si rax >= 18\n; sinon on continue ici</pre>' +
        '<table><tr><th>saut</th><th>condition (signée)</th></tr><tr><td>je / jne</td><td>égal / différent</td></tr><tr><td>jg / jge</td><td>plus grand / ou égal</td></tr><tr><td>jl / jle</td><td>plus petit / ou égal</td></tr><tr><td>jmp</td><td>toujours</td></tr></table>' +
        '<p><code>cmp</code> règle les drapeaux ZF, SF, OF ; le saut les lit. Regarde les voyants s’allumer !</p>',
      starter: 'section .data\n\tage\t\tdq 20\n\tok\t\tdb "ENTRE", 10\n\tnon\t\tdb "STOP", 10\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, [age]\n\t; TODO : compare rax à 18 et saute vers .entre si rax >= 18\n\tjmp\t.stop\n\n.entre:\n\tmov\trsi, ok\n\tmov\trdx, 6\n\tjmp\t.ecrire\n\n.stop:\n\tmov\trsi, non\n\tmov\trdx, 5\n\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT,
      hints: ['cmp rax, 18', 'jge .entre (juste avant le jmp .stop)'],
      solution: 'section .data\n\tage\t\tdq 20\n\tok\t\tdb "ENTRE", 10\n\tnon\t\tdb "STOP", 10\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, [age]\n\tcmp\trax, 18\n\tjge\t.entre\n\tjmp\t.stop\n\n.entre:\n\tmov\trsi, ok\n\tmov\trdx, 6\n\tjmp\t.ecrire\n\n.stop:\n\tmov\trsi, non\n\tmov\trdx, 5\n\n.ecrire:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n' + EXIT,
      tests: [{ expect: 'ENTRE\n' }, { expect: 'ENTRE\n', poke: { age: q(18) } }, { expect: 'STOP\n', poke: { age: q(12) } }, { expect: 'STOP\n', poke: { age: q(0) } }, { expect: 'ENTRE\n', poke: { age: q(99) } }],
      rules: { mustSrc: [{ re: '\\bcmp\\b', msg: 'Utilise cmp.' }] }
    },
    {
      id: 'a5', title: 'Le compte à rebours binaire', job: 'Contrat 05 · Base spatiale', stars: 3,
      scene: 'rocket', sceneOpts: { hint: 'La fusée part quand le programme affiche 54321 puis DECOLLAGE' },
      story: 'Retour à la base spatiale, mais cette fois le compte à rebours est câblé directement dans le processeur. Fais une <b>boucle</b> avec un compteur et un saut conditionnel.',
      goal: 'Affiche <code>54321</code> puis, sur la ligne suivante, <code>DECOLLAGE</code>. Utilise une boucle (un registre qui diminue + un saut), pas un texte tout fait.',
      lesson: '<p>Une boucle = une étiquette + un saut en arrière :</p><pre>    mov rbx, 5\n.boucle:\n    …\n    dec rbx          ; rbx = rbx - 1 (met ZF à 1 si 0)\n    jnz .boucle      ; recommence tant que rbx != 0</pre>' +
        '<p>Pour afficher un chiffre : <code>add al, \'0\'</code> transforme 3 en \'3\', qu’on range dans une case mémoire avant <code>write</code>.</p>' +
        '<p>⚠ Piège : <code>syscall</code> <b>écrase rcx et r11</b> ! N’utilise pas rcx comme compteur autour d’un syscall. rbx, lui, est préservé.</p>',
      starter: 'section .data\n\tchiffre\tdb 0\n\tfin\t\tdb 10, "DECOLLAGE", 10\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trbx, 5\t\t\t\t; compteur\n.boucle:\n\tmov\trax, rbx\n\tadd\tal, \'0\'\t\t\t; chiffre -> caractère\n\tmov\t[chiffre], al\t\t; range-le en mémoire\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, chiffre\n\tmov\trdx, 1\n\tsyscall\n\t; TODO : diminue rbx et recommence tant qu\'il n\'est pas nul\n\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, fin\n\tmov\trdx, 11\n\tsyscall\n' + EXIT,
      hints: ['dec rbx', 'jnz .boucle', 'Teste avec rcx à la place de rbx pour voir le piège du syscall…'],
      solution: 'section .data\n\tchiffre\tdb 0\n\tfin\t\tdb 10, "DECOLLAGE", 10\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trbx, 5\n.boucle:\n\tmov\trax, rbx\n\tadd\tal, \'0\'\n\tmov\t[chiffre], al\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, chiffre\n\tmov\trdx, 1\n\tsyscall\n\tdec\trbx\n\tjnz\t.boucle\n\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, fin\n\tmov\trdx, 11\n\tsyscall\n' + EXIT,
      tests: [{ expect: '54321\nDECOLLAGE\n', exit: 0 }],
      rules: { mustSrc: [{ re: '\\bj(nz|ne|g|ge|a|ae|l|le|nb|z|e|mp)\\s+\\.?\\w*bou', msg: 'Il faut une boucle (un saut vers une étiquette).' }], forbidSrc: [{ re: '54321', msg: 'Pas de texte tout fait : laisse la boucle calculer.' }] }
    },
    {
      id: 'a6', title: 'ft_strlen en langage machine', job: 'Contrat 06 · Atelier de couture', stars: 3,
      scene: 'ruler', sceneOpts: { v: 'msg', i: 'rax', cap: 'Le ruban = msg en mémoire ; la flèche = rax (le compteur)' },
      story: 'Le tailleur a modernisé son atelier : il veut <code>ft_strlen</code> écrite <b>en assembleur</b>, comme dans le projet <b>libasm</b> de 42.',
      goal: 'Écris la fonction <code>ft_strlen</code> : elle reçoit l’adresse de la chaîne dans <code>rdi</code> et renvoie sa longueur dans <code>rax</code>. Le <code>_start</code> fourni termine avec cette longueur comme code de sortie (7 pour "bonjour").',
      lesson: '<p><b>Convention d’appel</b> (System V, Linux) : le 1er argument arrive dans <code>rdi</code>, le 2e dans <code>rsi</code>, le 3e dans <code>rdx</code>… et le résultat repart dans <code>rax</code>.</p>' +
        '<p><code>call ft_strlen</code> <b>empile</b> l’adresse de retour puis saute ; <code>ret</code> la <b>dépile</b> pour revenir. Regarde la pile !</p>' +
        '<p>Lire un octet : <code>byte [rdi + rax]</code> = la case à l’adresse rdi + rax.</p><pre>    xor rax, rax          ; rax = 0\n.loop:\n    cmp byte [rdi + rax], 0\n    je .fin\n    inc rax\n    jmp .loop\n.fin:\n    ret</pre>',
      starter: 'section .data\n\tmsg\tdb "bonjour", 0\n\t\ttimes 40 db 0\t\t; place pour d\'autres tests\n\nsection .text\n\tglobal\t_start\n\n; size_t ft_strlen(const char *s)  — s dans rdi, résultat dans rax\nft_strlen:\n\txor\trax, rax\t\t\t; compteur = 0\n\t; TODO : tant que l\'octet [rdi + rax] n\'est pas 0, incrémente rax\n\tret\n\n_start:\n\tmov\trdi, msg\n\tcall\tft_strlen\n\tmov\trdi, rax\t\t\t; longueur = code de sortie\n\tmov\trax, 60\n\tsyscall\n',
      hints: ['Ajoute une étiquette .loop: après xor rax, rax.', 'cmp byte [rdi + rax], 0 puis je .fin', 'inc rax / jmp .loop / .fin: ret'],
      solution: 'section .data\n\tmsg\tdb "bonjour", 0\n\t\ttimes 40 db 0\n\nsection .text\n\tglobal\t_start\n\nft_strlen:\n\txor\trax, rax\n.loop:\n\tcmp\tbyte [rdi + rax], 0\n\tje\t.fin\n\tinc\trax\n\tjmp\t.loop\n.fin:\n\tret\n\n_start:\n\tmov\trdi, msg\n\tcall\tft_strlen\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n',
      tests: [{ exit: 7 }, { exit: 2, poke: { msg: z('42') } }, { exit: 0, poke: { msg: z('') } }, { exit: 17, poke: { msg: z('Assembleur x86-64') } }],
      rules: { mustSrc: [{ re: '^\\s*ft_strlen\\s*:', msg: 'Garde l’étiquette ft_strlen:' }] }
    },
    {
      id: 'a7', title: 'La pile d’assiettes', job: 'Contrat 07 · Plongeur', stars: 4,
      scene: 'plates', sceneOpts: {},
      story: 'Au restaurant, les assiettes s’empilent : la dernière posée est la première reprise (<b>LIFO</b>). Utilise la <b>pile du processeur</b> pour écrire un mot à l’envers.',
      goal: 'Empile chaque lettre de <code>mot</code> avec <code>push</code>, puis dépile-les avec <code>pop</code> dans <code>buf</code> : « HELLO » devient <code>OLLEH⏎</code>. Testé avec d’autres mots.',
      lesson: '<p><code>push rax</code> : rsp descend de 8 puis rax est écrit au sommet. <code>pop rbx</code> : lit le sommet dans rbx puis rsp remonte de 8. La pile grandit vers les <b>adresses basses</b>.</p>' +
        '<p><code>movzx rax, byte [rsi]</code> lit 1 octet et le range dans rax en complétant par des zéros (on ne peut empiler que 8 octets d’un coup).</p>' +
        '<p>Compte les lettres empilées (dans rcx) pour savoir combien en dépiler. Chaque <code>push</code> doit avoir son <code>pop</code> : sinon la pile est <b>déséquilibrée</b>.</p>',
      starter: 'section .data\n\tmot\tdb "HELLO", 0\n\t\ttimes 30 db 0\n\nsection .bss\n\tbuf\tresb 64\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trsi, mot\t\t\t; lecture\n\txor\trcx, rcx\t\t\t; nombre de lettres empilées\n.empile:\n\tmovzx\trax, byte [rsi]\n\tcmp\trax, 0\n\tje\t.depile_init\n\t; TODO : empile rax, avance rsi, compte dans rcx\n\tjmp\t.empile\n\n.depile_init:\n\tmov\trdi, buf\t\t\t; écriture\n\tmov\trdx, rcx\t\t\t; on garde la longueur\n.depile:\n\tcmp\trcx, 0\n\tje\t.affiche\n\t; TODO : dépile dans rax, range al dans [rdi], avance rdi, décompte rcx\n\tjmp\t.depile\n\n.affiche:\n\tmov\tbyte [rdi], 10\t\t; \'\\n\' final\n\tinc\trdx\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, buf\n\tsyscall\n' + EXIT,
      hints: ['Empiler : push rax / inc rsi / inc rcx', 'Dépiler : pop rax / mov [rdi], al / inc rdi / dec rcx', 'mov [rdi], al écrit 1 octet car al fait 8 bits.'],
      solution: 'section .data\n\tmot\tdb "HELLO", 0\n\t\ttimes 30 db 0\n\nsection .bss\n\tbuf\tresb 64\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trsi, mot\n\txor\trcx, rcx\n.empile:\n\tmovzx\trax, byte [rsi]\n\tcmp\trax, 0\n\tje\t.depile_init\n\tpush\trax\n\tinc\trsi\n\tinc\trcx\n\tjmp\t.empile\n\n.depile_init:\n\tmov\trdi, buf\n\tmov\trdx, rcx\n.depile:\n\tcmp\trcx, 0\n\tje\t.affiche\n\tpop\trax\n\tmov\t[rdi], al\n\tinc\trdi\n\tdec\trcx\n\tjmp\t.depile\n\n.affiche:\n\tmov\tbyte [rdi], 10\n\tinc\trdx\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, buf\n\tsyscall\n' + EXIT,
      tests: [{ expect: 'OLLEH\n' }, { expect: 'KCATS\n', poke: { mot: z('STACK') } }, { expect: 'A\n', poke: { mot: z('A') } }, { expect: '24 ,24 ,24\n', poke: { mot: z('42, 42, 42') } }],
      rules: { mustSrc: [{ re: '\\bpush\\b', msg: 'Utilise push.' }, { re: '\\bpop\\b', msg: 'Utilise pop.' }] }
    },
    {
      id: 'a8', title: 'La photocopieuse', job: 'Contrat 08 · Reprographie', stars: 4,
      scene: 'bakery', sceneOpts: { title: 'REPROGRAPHIE', cap: 'Source dans .data, copie dans .bss' },
      story: 'La reprographie a besoin de <code>ft_strcpy(dst, src)</code> en assembleur : copier une chaîne octet par octet, <b>\\0 compris</b>, et renvoyer dst.',
      goal: 'Écris <code>ft_strcpy</code> : <code>rdi</code> = destination, <code>rsi</code> = source, renvoie <code>rdi</code> dans <code>rax</code>. Le programme copie <code>original</code> dans <code>copie</code> (dans .bss) puis l’affiche suivi de <code>\\n</code>.',
      lesson: '<p>On ne peut pas copier <b>mémoire → mémoire</b> en une instruction : il faut passer par un registre.</p><pre>mov al, [rsi + rcx]    ; lire 1 octet de la source\nmov [rdi + rcx], al    ; l’écrire dans la destination</pre>' +
        '<p><code>al</code> est l’octet du bas de rax : écrire dans al ne touche pas au reste de rax (zoom sur rax dans la vue processeur).</p>' +
        '<p>La section <b>.bss</b> contient des zones réservées (<code>resb 64</code> = 64 octets) mises à zéro au démarrage.</p>',
      starter: 'section .data\n\toriginal\tdb "Photocopie 42", 0\n\t\t\t\ttimes 40 db 0\n\nsection .bss\n\tcopie\tresb 64\n\nsection .text\n\tglobal\t_start\n\n; char *ft_strcpy(char *dst, const char *src)\nft_strcpy:\n\txor\trcx, rcx\n.loop:\n\t; TODO : copie l\'octet [rsi + rcx] vers [rdi + rcx] ; arrête après le 0\n\tmov\trax, rdi\n\tret\n\nft_strlen:\n\txor\trax, rax\n.l:\n\tcmp\tbyte [rdi + rax], 0\n\tje\t.f\n\tinc\trax\n\tjmp\t.l\n.f:\n\tret\n\n_start:\n\tmov\trdi, copie\n\tmov\trsi, original\n\tcall\tft_strcpy\n\tmov\tbyte [copie + 63], 0\n\tmov\trdi, rax\n\tcall\tft_strlen\n\tmov\trdx, rax\n\tmov\tbyte [copie + rdx], 10\n\tinc\trdx\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, copie\n\tsyscall\n' + EXIT,
      hints: ['mov al, [rsi + rcx] puis mov [rdi + rcx], al', 'inc rcx, puis cmp al, 0 / jne .loop (le 0 a déjà été copié)'],
      solution: 'section .data\n\toriginal\tdb "Photocopie 42", 0\n\t\t\t\ttimes 40 db 0\n\nsection .bss\n\tcopie\tresb 64\n\nsection .text\n\tglobal\t_start\n\nft_strcpy:\n\txor\trcx, rcx\n.loop:\n\tmov\tal, [rsi + rcx]\n\tmov\t[rdi + rcx], al\n\tinc\trcx\n\tcmp\tal, 0\n\tjne\t.loop\n\tmov\trax, rdi\n\tret\n\nft_strlen:\n\txor\trax, rax\n.l:\n\tcmp\tbyte [rdi + rax], 0\n\tje\t.f\n\tinc\trax\n\tjmp\t.l\n.f:\n\tret\n\n_start:\n\tmov\trdi, copie\n\tmov\trsi, original\n\tcall\tft_strcpy\n\tmov\tbyte [copie + 63], 0\n\tmov\trdi, rax\n\tcall\tft_strlen\n\tmov\trdx, rax\n\tmov\tbyte [copie + rdx], 10\n\tinc\trdx\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, copie\n\tsyscall\n' + EXIT,
      tests: [{ expect: 'Photocopie 42\n' }, { expect: 'abc\n', poke: { original: z('abc') } }, { expect: '\n', poke: { original: z('') } }, { expect: 'Le C, c\'est la vie\n', poke: { original: z('Le C, c\'est la vie') } }],
      rules: { mustSrc: [{ re: '^\\s*ft_strcpy\\s*:', msg: 'Garde l’étiquette ft_strcpy:' }], forbidCall: ['strcpy'] }
    },
    {
      id: 'a9', title: 'Le perroquet du port', job: 'Contrat 09 · Capitainerie', stars: 4,
      scene: 'mail', sceneOpts: { parrot: true, title: 'CAPITAINERIE · LE PERROQUET', cap: 'Le perroquet répète ce qu’il lit sur stdin' },
      story: 'Coco, le perroquet de la capitainerie, répète tout ce qu’on lui dit… à condition que tu le programmes ! Lis l’entrée avec l’appel système <code>read</code>.',
      goal: 'Lis jusqu’à 128 octets de l’entrée dans <code>buf</code> (syscall read, rax = 0), puis affiche <code>Coco dit: </code> suivi <b>exactement</b> des octets lus.',
      lesson: '<p>L’appel système <code>read</code> : <code>rax = 0</code>, <code>rdi = 0</code> (stdin), <code>rsi = buf</code>, <code>rdx = 128</code>. Au retour, <code>rax</code> contient le <b>nombre d’octets lus</b> (0 = fin de l’entrée, négatif = erreur).</p>' +
        '<p>Il faut <b>sauvegarder</b> ce nombre (par exemple dans rbx) car le write suivant va écraser rax.</p>' +
        '<p>Change l’onglet <b>⌨ Entrée</b> pour faire répéter autre chose au perroquet.</p>',
      starter: 'section .data\n\tcoco\tdb "Coco dit: "\n\tclen\tequ $ - coco\n\nsection .bss\n\tbuf\tresb 128\n\nsection .text\n\tglobal\t_start\n\n_start:\n\t; TODO 1 : read(0, buf, 128) puis garde rax dans rbx\n\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, coco\n\tmov\trdx, clen\n\tsyscall\n\n\t; TODO 2 : write(1, buf, rbx)\n' + EXIT,
      stdin: 'Bonjour capitaine !\n',
      hints: ['xor rax, rax / xor rdi, rdi / mov rsi, buf / mov rdx, 128 / syscall', 'mov rbx, rax', 'mov rax, 1 / mov rdi, 1 / mov rsi, buf / mov rdx, rbx / syscall'],
      solution: 'section .data\n\tcoco\tdb "Coco dit: "\n\tclen\tequ $ - coco\n\nsection .bss\n\tbuf\tresb 128\n\nsection .text\n\tglobal\t_start\n\n_start:\n\txor\trax, rax\n\txor\trdi, rdi\n\tmov\trsi, buf\n\tmov\trdx, 128\n\tsyscall\n\tmov\trbx, rax\n\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, coco\n\tmov\trdx, clen\n\tsyscall\n\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, buf\n\tmov\trdx, rbx\n\tsyscall\n' + EXIT,
      tests: [{ stdin: 'Bonjour capitaine !\n', expect: 'Coco dit: Bonjour capitaine !\n' }, { stdin: 'Coco veut un biscuit\n', expect: 'Coco dit: Coco veut un biscuit\n' }, { stdin: '', expect: 'Coco dit: ' }],
      rules: {}
    },
    {
      id: 'a10', title: 'L’usine à copies', job: 'Contrat 10 · Ingénieur libasm', stars: 5,
      scene: 'bakery', sceneOpts: { title: 'USINE À COPIES (TAS)', cap: 'Chaque copie est un bloc obtenu avec call malloc' },
      story: 'Le contrat final de libasm : <code>ft_strdup</code> en assembleur. Il faut <b>appeler malloc</b> (une fonction de la libc), copier la chaîne, puis le main affiche la copie et la libère avec <b>free</b>.',
      goal: 'Complète <code>ft_strdup</code> : longueur avec <code>ft_strlen</code>, <code>malloc(longueur + 1)</code>, copie octet par octet (\\0 compris), renvoie l’adresse dans rax. Sortie attendue : le message copié. <b>Aucune fuite.</b>',
      lesson: '<p>Ici le programme commence à <code>main</code> : c’est la libc qui l’appelle, et <code>ret</code> à la fin de main termine le programme avec <code>eax</code> comme code de sortie.</p>' +
        '<p><code>call malloc</code> : taille dans <code>rdi</code>, adresse du bloc renvoyée dans <code>rax</code> (ou 0 si échec).</p>' +
        '<p>⚠ Un appel de fonction peut <b>écraser</b> rdi, rsi, rdx, rcx, r8–r11 : sauvegarde ce dont tu as besoin sur la pile (<code>push</code> / <code>pop</code>) ou dans rbx, r12–r15 (qu’il faut alors restaurer).</p>' +
        '<p>Avant un <code>call</code> vers la libc, <b>rsp doit être un multiple de 16</b> : le visualiseur t’avertit sinon.</p>',
      starter: 'extern\tmalloc\nextern\tfree\n\nsection .data\n\tmsg\tdb "Copie conforme !", 10, 0\n\t\ttimes 40 db 0\n\nsection .text\n\tglobal\tmain\n\nft_strlen:\n\txor\trax, rax\n.l:\n\tcmp\tbyte [rdi + rax], 0\n\tje\t.f\n\tinc\trax\n\tjmp\t.l\n.f:\n\tret\n\n; char *ft_strdup(const char *s)\nft_strdup:\n\tpush\trdi\t\t\t\t; garde s (et aligne la pile)\n\tcall\tft_strlen\t\t; rax = longueur\n\t; TODO 1 : rdi = rax + 1, puis call malloc\n\tpop\trsi\t\t\t\t; rsi = s\n\t; TODO 2 : copie [rsi + rcx] vers [rax + rcx] jusqu\'au 0 compris\n\tret\n\nmain:\n\tpush\trbx\n\tmov\trdi, msg\n\tcall\tft_strdup\n\tmov\trbx, rax\t\t\t; rbx = la copie\n\tmov\trdi, rbx\n\tcall\tft_strlen\n\tmov\trdx, rax\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, rbx\n\tsyscall\n\tmov\trdi, rbx\n\tcall\tfree\n\tpop\trbx\n\txor\teax, eax\n\tret\n',
      hints: ['lea rdi, [rax + 1] puis call malloc', 'xor rcx, rcx puis .copie: mov dl, [rsi + rcx] / mov [rax + rcx], dl / inc rcx / cmp dl, 0 / jne .copie', 'Si malloc renvoie 0 (rax = 0), il faudrait renvoyer 0 directement (test rax, rax / jz .fin).'],
      solution: 'extern\tmalloc\nextern\tfree\n\nsection .data\n\tmsg\tdb "Copie conforme !", 10, 0\n\t\ttimes 40 db 0\n\nsection .text\n\tglobal\tmain\n\nft_strlen:\n\txor\trax, rax\n.l:\n\tcmp\tbyte [rdi + rax], 0\n\tje\t.f\n\tinc\trax\n\tjmp\t.l\n.f:\n\tret\n\nft_strdup:\n\tpush\trdi\n\tcall\tft_strlen\n\tlea\trdi, [rax + 1]\n\tcall\tmalloc\n\tpop\trsi\n\ttest\trax, rax\n\tjz\t.fin\n\txor\trcx, rcx\n.copie:\n\tmov\tdl, [rsi + rcx]\n\tmov\t[rax + rcx], dl\n\tinc\trcx\n\tcmp\tdl, 0\n\tjne\t.copie\n.fin:\n\tret\n\nmain:\n\tpush\trbx\n\tmov\trdi, msg\n\tcall\tft_strdup\n\tmov\trbx, rax\n\tmov\trdi, rbx\n\tcall\tft_strlen\n\tmov\trdx, rax\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, rbx\n\tsyscall\n\tmov\trdi, rbx\n\tcall\tfree\n\tpop\trbx\n\txor\teax, eax\n\tret\n',
      tests: [{ expect: 'Copie conforme !\n', exit: 0 }, { expect: 'Bravo, tu as fini libasm !\n', exit: 0, poke: { msg: z('Bravo, tu as fini libasm !\n') } }, { expect: '', exit: 0, poke: { msg: z('') } }],
      rules: { mustCall: ['malloc', 'free'], noLeaks: true, forbidCall: ['strdup'] }
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
