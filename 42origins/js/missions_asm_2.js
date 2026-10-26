/* 42 ORIGINS — missions assembleur x86-64, chapitres 6 à 10 (missions 1 à 9) */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.asm = O42.missions.asm || [];

  /* morceaux de code partagés (gabarits : \t = tabulation, vrais retours à la ligne) */
  var EXIT = `
\tmov\trax, 60\t\t; exit(0)
\txor\trdi, rdi
\tsyscall
`;
  /* lit un entier positif sur stdin (un octet à la fois) ; besoin de « car resb 1 » dans .bss */
  var NOMBRE = `
; ---- fourni (tu l'écriras toi-même au chapitre 9) ----
; lire_nombre : lit un entier positif sur l'entrée standard et le renvoie dans rax
lire_nombre:
\txor\tr8, r8\t\t\t; nombre = 0
.lire:
\txor\teax, eax\t\t; read(0, car, 1)
\txor\tedi, edi
\tmov\trsi, car
\tmov\tedx, 1
\tsyscall
\tcmp\trax, 1
\tjne\t.fin\t\t\t; plus rien à lire
\tmovzx\teax, byte [car]
\tsub\teax, '0'
\tcmp\teax, 9
\tja\t.fin\t\t\t; pas un chiffre : le nombre est fini
\timul\tr8, r8, 10
\tadd\tr8, rax
\tjmp\t.lire
.fin:
\tmov\trax, r8
\tret
`;
  /* lit une ligne de stdin dans le tampon rdi, sans le retour à la ligne, terminée par 0 */
  var LIGNE = `
; ---- fourni (tu l'écriras toi-même au chapitre 9) ----
; lire_ligne(rdi = tampon) : lit une ligne de l'entrée, sans le retour à la ligne, terminée par 0
lire_ligne:
\tmov\tr9, rdi\t\t\t; r9 = où écrire
.lire:
\txor\teax, eax\t\t; read(0, r9, 1)
\txor\tedi, edi
\tmov\trsi, r9
\tmov\tedx, 1
\tsyscall
\tcmp\trax, 1
\tjne\t.fin\t\t\t; plus rien à lire
\tcmp\tbyte [r9], 10
\tje\t.fin\t\t\t; fin de la ligne
\tinc\tr9
\tjmp\t.lire
.fin:
\tmov\tbyte [r9], 0
\tret
`;
  var STRLEN = `
; ft_strlen(s) : longueur de la chaîne rdi (fournie)
ft_strlen:
\txor\teax, eax
.l:
\tcmp\tbyte [rdi + rax], 0
\tje\t.f
\tinc\trax
\tjmp\t.l
.f:
\tret
`;
  var ALIGN = /pile non align/;

  O42.missions.asm.push(

    /* ================================================================ CHAPITRE 6 : fonctions */
    {
      id: 'a6_1', ch: 6, ord: 1,
      title: 'Le carillon',
      story: 'Le carillon de la tour du campus a sa propre fonction <code>sonne</code>. Le gardien veut l’entendre <b>trois fois</b> pour annoncer la pause café.',
      goal: 'Appelle la fonction <code>sonne</code> trois fois avec <code>call</code>. Sortie attendue :<pre>DING⏎DING⏎DING⏎</pre>',
      lesson: '<p><code>call sonne</code> <b>empile</b> l’adresse de l’instruction suivante (l’adresse de retour) puis saute à l’étiquette <code>sonne</code>.</p>' +
        '<p>À la fin de la fonction, <code>ret</code> <b>dépile</b> cette adresse et y retourne : le programme reprend juste après le <code>call</code>. Une fonction s’écrit donc une fois et s’utilise autant de fois qu’on veut.</p>',
      starter: `section .data
\tding\tdb "DING", 10
\tlen\tequ $ - ding

section .text
\tglobal\t_start

; sonne : affiche DING une fois, puis revient
sonne:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, ding
\tmov\trdx, len
\tsyscall
\tret\t\t\t\t; retour juste après le call

_start:
\tcall\tsonne\t\t\t; 1er coup
\t; TODO : fais sonner le carillon encore deux fois
` + EXIT,
      solution: `section .data
\tding\tdb "DING", 10
\tlen\tequ $ - ding

section .text
\tglobal\t_start

sonne:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, ding
\tmov\trdx, len
\tsyscall
\tret

_start:
\tcall\tsonne
\tcall\tsonne
\tcall\tsonne
` + EXIT,
      hints: ['Une ligne call sonne = un coup de carillon.', 'Ajoute deux lignes call sonne sous la première.', 'Avance pas à pas : regarde l’adresse de retour apparaître sur la pile à chaque call.'],
      tests: [{ expect: 'DING\nDING\nDING\n', exit: 0 }],
      rules: { mustSrc: [{ re: '(call\\s+sonne[\\s\\S]*){3}', msg: 'Appelle sonne trois fois avec call.' }], forbidSrc: [{ re: 'DING.*DING', msg: 'Ne change pas le texte : c’est la fonction qui doit sonner trois fois.' }] }
    },

    {
      id: 'a6_2', ch: 6, ord: 2,
      title: 'Le doubleur',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi'] },
      story: 'La cantine double toutes les portions le vendredi. Le cuisinier veut une fonction <code>ft_double</code> qui reçoit un nombre et renvoie son double.',
      goal: 'Complète <code>ft_double</code> : le nombre arrive dans <code>rdi</code>, le résultat repart dans <code>rax</code>. Le programme lit un nombre sur l’entrée et sort avec son double (21 → code de sortie <b>42</b>).',
      lesson: '<p><b>Convention d’appel</b> Linux : le 1er argument d’une fonction arrive dans <code>rdi</code>, et la fonction range son résultat dans <code>rax</code> avant <code>ret</code>.</p>' +
        '<p>La fonction <code>lire_nombre</code> est fournie : elle lit le nombre tapé dans l’onglet <b>⌨ Entrée</b> et le renvoie, elle aussi, dans rax.</p>',
      stdin: '21\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_double(x) : x arrive dans rdi, le résultat repart dans rax
ft_double:
\tmov\trax, 0\t\t\t; TODO : rax = rdi × 2
\tret

_start:
\tcall\tlire_nombre\t\t; rax = nombre tapé sur l'entrée
\tmov\trdi, rax\t\t\t; 1er argument
\tcall\tft_double
\tmov\trdi, rax\t\t\t; le résultat devient le code de sortie
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_double:
\tmov\trax, rdi
\tadd\trax, rdi
\tret

_start:
\tcall\tlire_nombre
\tmov\trdi, rax
\tcall\tft_double
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['Commence par copier l’argument : mov rax, rdi', 'Puis ajoute-le encore une fois : add rax, rdi (ou imul rax, 2).'],
      tests: [{ stdin: '21\n', exit: 42 }, { stdin: '7\n', exit: 14 }, { stdin: '0\n', exit: 0 }, { stdin: '100\n', exit: 200 }],
      rules: { mustSrc: [{ re: '^\\s*ft_double\\s*:', msg: 'Garde l’étiquette ft_double:' }] }
    },

    {
      id: 'a6_3', ch: 6, ord: 3,
      title: 'Le potager rectangulaire',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi', 'rsi'] },
      story: 'Le jardinier du campus mesure ses parcelles. Il lui faut <code>ft_aire(longueur, largeur)</code> pour connaître la surface à semer.',
      goal: 'Écris <code>ft_aire</code> : longueur dans <code>rdi</code>, largeur dans <code>rsi</code>, renvoie longueur × largeur dans <code>rax</code>. L’entrée contient les deux nombres (<code>6 7</code> → code de sortie <b>42</b>).',
      lesson: '<p>Le <b>2e argument</b> d’une fonction arrive dans <code>rsi</code> (puis <code>rdx</code>, <code>rcx</code>, <code>r8</code>, <code>r9</code> pour les suivants).</p>' +
        '<p>Dans <code>_start</code>, la longueur est gardée dans <b>rbx</b> pendant le 2e appel à lire_nombre : les fonctions ont le droit d’écraser rdi, rsi, rax… mais doivent rendre rbx intact.</p>',
      stdin: '6 7\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_aire(longueur, largeur) : rdi = longueur, rsi = largeur, résultat dans rax
ft_aire:
\t; TODO
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = longueur
\tcall\tlire_nombre
\tmov\trsi, rax\t\t\t; 2e argument : largeur
\tmov\trdi, rbx\t\t\t; 1er argument : longueur
\tcall\tft_aire
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_aire:
\tmov\trax, rdi
\timul\trax, rsi
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\tlire_nombre
\tmov\trsi, rax
\tmov\trdi, rbx
\tcall\tft_aire
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['Le résultat doit finir dans rax : commence par mov rax, rdi.', 'imul rax, rsi multiplie rax par le 2e argument.'],
      tests: [{ stdin: '6 7\n', exit: 42 }, { stdin: '12 10\n', exit: 120 }, { stdin: '0 9\n', exit: 0 }, { stdin: '15 17\n', exit: 255 }],
      rules: { mustSrc: [{ re: '^\\s*ft_aire\\s*:', msg: 'Garde l’étiquette ft_aire:' }] }
    },

    {
      id: 'a6_4', ch: 6, ord: 4,
      title: 'Le meilleur saut',
      story: 'Au concours de saut en longueur du gymnase, chaque athlète saute deux fois et on garde le <b>meilleur</b> essai. Écris <code>ft_max</code>.',
      goal: 'Écris <code>ft_max(a, b)</code> : a dans <code>rdi</code>, b dans <code>rsi</code>, renvoie le plus grand dans <code>rax</code>. Entrée <code>4 9</code> → code de sortie <b>9</b>.',
      lesson: '<p>Une fonction peut contenir des comparaisons et des sauts, avec ses propres <b>étiquettes locales</b> (qui commencent par un point : <code>.fin</code>).</p>' +
        '<pre>mov rax, rdi     ; on suppose que a est le plus grand\ncmp rsi, rax\njle .fin         ; b <= a : on garde a\nmov rax, rsi     ; sinon c’est b\n.fin:\nret</pre>',
      stdin: '4 9\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_max(a, b) : renvoie le plus grand des deux
ft_max:
\tmov\trax, rdi\t\t\t; pour l'instant on renvoie toujours a
\t; TODO : si b (rsi) est plus grand, renvoie b
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = 1er saut
\tcall\tlire_nombre
\tmov\trsi, rax\t\t\t; 2e saut
\tmov\trdi, rbx
\tcall\tft_max
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_max:
\tmov\trax, rdi
\tcmp\trsi, rax
\tjle\t.fin
\tmov\trax, rsi
.fin:
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\tlire_nombre
\tmov\trsi, rax
\tmov\trdi, rbx
\tcall\tft_max
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['cmp rsi, rax compare b au résultat provisoire.', 'jle .fin saute si b <= a ; sinon mov rax, rsi.', 'N’oublie pas l’étiquette .fin: juste avant ret.'],
      tests: [{ stdin: '4 9\n', exit: 9 }, { stdin: '7 3\n', exit: 7 }, { stdin: '5 5\n', exit: 5 }, { stdin: '199 200\n', exit: 200 }],
      rules: { mustSrc: [{ re: '^\\s*ft_max\\s*:', msg: 'Garde l’étiquette ft_max:' }, { re: '\\bcmp\\b', msg: 'Compare les deux nombres avec cmp.' }] }
    },

    {
      id: 'a6_5', ch: 6, ord: 5,
      title: 'La distance du tram',
      story: 'Le tram du campus s’arrête aux bornes numérotées. Pour le ticket, on calcule la <b>distance</b> entre la borne de départ et celle d’arrivée, toujours positive : c’est <code>ft_abs(départ − arrivée)</code>.',
      goal: 'Écris <code>ft_abs</code> : renvoie la valeur absolue de <code>rdi</code> (un nombre signé) dans <code>rax</code>. Entrée <code>3 10</code> → 3 − 10 = −7 → code de sortie <b>7</b>.',
      lesson: '<p>Un registre peut contenir un nombre <b>négatif</b> (complément à deux). <code>neg rax</code> change son signe : −7 devient 7.</p>' +
        '<p>Pour savoir si un nombre est négatif : <code>cmp rax, 0</code> puis <code>jge</code> (saut <b>signé</b> : « plus grand ou égal »). Avec <code>jae</code> (non signé), −7 serait vu comme un nombre énorme !</p>',
      stdin: '3 10\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_abs(x) : valeur absolue de rdi
ft_abs:
\tmov\trax, rdi
\t; TODO : si rax est négatif, change son signe
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = borne de départ
\tcall\tlire_nombre\t\t; rax = borne d'arrivée
\tmov\trdi, rbx
\tsub\trdi, rax\t\t\t; rdi = départ - arrivée (peut être négatif)
\tcall\tft_abs
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_abs:
\tmov\trax, rdi
\tcmp\trax, 0
\tjge\t.fin
\tneg\trax
.fin:
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\tlire_nombre
\tmov\trdi, rbx
\tsub\trdi, rax
\tcall\tft_abs
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['cmp rax, 0 puis jge .fin : un nombre positif reste tel quel.', 'Sinon : neg rax.', 'Ajoute .fin: juste avant ret.'],
      tests: [{ stdin: '3 10\n', exit: 7 }, { stdin: '10 3\n', exit: 7 }, { stdin: '8 8\n', exit: 0 }, { stdin: '0 250\n', exit: 250 }],
      rules: { mustSrc: [{ re: '^\\s*ft_abs\\s*:', msg: 'Garde l’étiquette ft_abs:' }] }
    },

    {
      id: 'a6_6', ch: 6, ord: 6,
      title: 'Les cubes du maçon',
      scene: 'plates', sceneOpts: { title: 'PILE D’APPELS' },
      story: 'Le maçon empile des cubes de béton : il veut connaître le volume d’un cube de côté x. Une fonction peut en appeler une autre : <code>ft_cube</code> s’appuie sur <code>ft_carre</code>.',
      goal: 'Écris <code>ft_carre(x)</code> = x × x, puis <code>ft_cube(x)</code> qui <b>appelle</b> ft_carre et multiplie encore par x. Entrée <code>3</code> → code de sortie <b>27</b>.',
      lesson: '<p>Quand <code>ft_cube</code> fait <code>call ft_carre</code>, une 2e adresse de retour s’empile au-dessus de la première : la pile garde le chemin du retour (ft_carre → ft_cube → _start).</p>' +
        '<p>Ici ft_carre ne modifie pas <code>rdi</code> : après le call, ft_cube peut encore s’en servir. (Au chapitre 7 on apprendra à sauvegarder un registre qu’une fonction pourrait abîmer.)</p>',
      stdin: '3\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_carre(x) = x × x   (sans modifier rdi)
ft_carre:
\t; TODO 1
\tret

; ft_cube(x) = x × x × x
ft_cube:
\t; TODO 2 : appelle ft_carre, puis multiplie le résultat par rdi
\tmov\trax, rdi
\tret

_start:
\tcall\tlire_nombre
\tmov\trdi, rax
\tcall\tft_cube
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_carre:
\tmov\trax, rdi
\timul\trax, rdi
\tret

ft_cube:
\tcall\tft_carre
\timul\trax, rdi
\tret

_start:
\tcall\tlire_nombre
\tmov\trdi, rax
\tcall\tft_cube
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['ft_carre : mov rax, rdi / imul rax, rdi', 'ft_cube : call ft_carre (rax = x × x), puis imul rax, rdi.', 'Supprime le mov rax, rdi du code de départ de ft_cube.'],
      tests: [{ stdin: '3\n', exit: 27 }, { stdin: '5\n', exit: 125 }, { stdin: '0\n', exit: 0 }, { stdin: '6\n', exit: 216 }],
      rules: { mustSrc: [{ re: 'ft_cube\\s*:[\\s\\S]*call\\s+ft_carre[\\s\\S]*_start\\s*:', msg: 'ft_cube doit appeler ft_carre.' }] }
    },

    {
      id: 'a6_7', ch: 6, ord: 7,
      title: 'La rangée d’étoiles',
      story: 'Le cinéma en plein air note les films avec des étoiles. Il te faut <code>ft_putchar</code>, qui affiche <b>un</b> caractère : la boucle de <code>_start</code> l’appelle autant de fois que nécessaire.',
      goal: 'Écris <code>ft_putchar</code> : le caractère arrive dans <code>rdi</code> ; range-le dans <code>lettre</code> puis affiche-le avec write. Entrée <code>5</code> → <code>*****⏎</code>.',
      lesson: '<p><code>dil</code> est l’octet du bas de rdi (comme <code>al</code> pour rax) : <code>mov [lettre], dil</code> range le caractère en mémoire.</p>' +
        '<p>⚠ Piège : pour write, il faut <code>rdi = 1</code> (stdout)… ce qui <b>écrase</b> l’argument ! Range donc le caractère en mémoire <b>avant</b> de toucher à rdi.</p>' +
        '<p>Le compteur de la boucle est dans <b>rbx</b> : ni syscall ni ft_putchar ne doivent l’abîmer.</p>',
      stdin: '5\n',
      starter: `section .bss
\tcar\tresb 1
\tlettre\tresb 1

section .text
\tglobal\t_start

; ft_putchar(c) : affiche le caractère reçu dans rdi
ft_putchar:
\t; TODO : range dil dans [lettre], puis write(1, lettre, 1)
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = nombre d'étoiles
.boucle:
\tcmp\trbx, 0
\tje\t.fin
\tmov\trdi, '*'
\tcall\tft_putchar
\tdec\trbx
\tjmp\t.boucle
.fin:
\tmov\trdi, 10\t\t\t; retour à la ligne
\tcall\tft_putchar
` + EXIT + NOMBRE,
      solution: `section .bss
\tcar\tresb 1
\tlettre\tresb 1

section .text
\tglobal\t_start

ft_putchar:
\tmov\t[lettre], dil
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, lettre
\tmov\trdx, 1
\tsyscall
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
.boucle:
\tcmp\trbx, 0
\tje\t.fin
\tmov\trdi, '*'
\tcall\tft_putchar
\tdec\trbx
\tjmp\t.boucle
.fin:
\tmov\trdi, 10
\tcall\tft_putchar
` + EXIT + NOMBRE,
      hints: ['Première ligne : mov [lettre], dil', 'Puis le write habituel : rax = 1, rdi = 1, rsi = lettre, rdx = 1, syscall.', 'Termine par ret.'],
      tests: [{ stdin: '5\n', expect: '*****\n' }, { stdin: '1\n', expect: '*\n' }, { stdin: '0\n', expect: '\n' }, { stdin: '12\n', expect: '************\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_putchar\\s*:', msg: 'Garde l’étiquette ft_putchar:' }] }
    },

    {
      id: 'a6_8', ch: 6, ord: 8,
      title: 'Le détecteur de chiffres',
      story: 'Le service courrier trie les adresses : combien de <b>chiffres</b> dans chaque ligne ? La boucle est prête, il manque la fonction <code>ft_isdigit</code>.',
      goal: 'Écris <code>ft_isdigit(c)</code> : renvoie <code>1</code> dans rax si le caractère <code>rdi</code> est entre <code>\'0\'</code> et <code>\'9\'</code>, sinon <code>0</code>. Le programme sort avec le nombre de chiffres de la ligne lue (« Bureau 42, porte 7 » → <b>3</b>).',
      lesson: '<p>Un caractère est un petit nombre (son code ASCII) : <code>\'0\'</code> vaut 48 et <code>\'9\'</code> vaut 57. Tester « est un chiffre » = tester 48 ≤ c ≤ 57 avec deux comparaisons.</p>' +
        '<p><code>jb</code> / <code>ja</code> sont les sauts « en dessous » / « au-dessus » <b>non signés</b>, parfaits pour comparer des octets.</p>',
      stdin: 'Bureau 42, porte 7\n',
      starter: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

; ft_isdigit(c) : rax = 1 si rdi est un chiffre, sinon 0
ft_isdigit:
\txor\teax, eax\t\t\t; réponse par défaut : 0
\t; TODO
\tret

_start:
\tmov\trdi, texte
\tcall\tlire_ligne\t\t; texte = la ligne tapée
\txor\tebx, ebx\t\t\t; rbx = indice
\txor\tr12, r12\t\t\t; r12 = nombre de chiffres
.boucle:
\tmovzx\tedi, byte [texte + rbx]
\tcmp\tedi, 0
\tje\t.fin
\tcall\tft_isdigit
\tadd\tr12, rax
\tinc\trbx
\tjmp\t.boucle
.fin:
\tmov\trdi, r12
\tmov\trax, 60
\tsyscall
` + LIGNE,
      solution: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

ft_isdigit:
\txor\teax, eax
\tcmp\trdi, '0'
\tjb\t.non
\tcmp\trdi, '9'
\tja\t.non
\tmov\teax, 1
.non:
\tret

_start:
\tmov\trdi, texte
\tcall\tlire_ligne
\txor\tebx, ebx
\txor\tr12, r12
.boucle:
\tmovzx\tedi, byte [texte + rbx]
\tcmp\tedi, 0
\tje\t.fin
\tcall\tft_isdigit
\tadd\tr12, rax
\tinc\trbx
\tjmp\t.boucle
.fin:
\tmov\trdi, r12
\tmov\trax, 60
\tsyscall
` + LIGNE,
      hints: ['cmp rdi, \'0\' puis jb .non : trop petit.', 'cmp rdi, \'9\' puis ja .non : trop grand.', 'Sinon mov eax, 1, et place .non: juste avant ret.'],
      tests: [{ stdin: 'Bureau 42, porte 7\n', exit: 3 }, { stdin: 'abc\n', exit: 0 }, { stdin: '2026\n', exit: 4 }, { stdin: 'Salle :/09\n', exit: 2 }],
      rules: { mustSrc: [{ re: '^\\s*ft_isdigit\\s*:', msg: 'Garde l’étiquette ft_isdigit:' }] }
    },

    {
      id: 'a6_9', ch: 6, ord: 9,
      title: 'Le dernier wagon',
      scene: 'ruler', sceneOpts: { v: 'texte', i: 'rcx', cap: 'Le ruban = texte ; la flèche = rcx' },
      story: 'Le chef de gare veut connaître le <b>dernier wagon</b> de chaque train : le dernier caractère de la chaîne. Il faut d’abord trouver la fin (le 0), puis reculer d’une case.',
      goal: 'Écris <code>ft_dernier(s)</code> : renvoie dans rax le code ASCII du dernier caractère de la chaîne <code>rdi</code>, ou <code>0</code> si elle est vide. « abc » → code de sortie <b>99</b> (le code de \'c\').',
      lesson: '<p>Parcourir une chaîne : un compteur (rcx) avance tant que <code>byte [rdi + rcx]</code> n’est pas 0.</p>' +
        '<p>Une fois sur le 0, le dernier caractère est à <code>[rdi + rcx - 1]</code>. <code>movzx eax, byte [...]</code> lit un seul octet et met des 0 dans le reste du registre.</p>' +
        '<p>Attention au cas de la chaîne vide : rcx vaut 0 et il ne faut pas lire avant le début !</p>',
      stdin: 'abc\n',
      starter: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

; ft_dernier(s) : code du dernier caractère de rdi, 0 si la chaîne est vide
ft_dernier:
\txor\teax, eax
\t; TODO
\tret

_start:
\tmov\trdi, texte
\tcall\tlire_ligne
\tmov\trdi, texte
\tcall\tft_dernier
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + LIGNE,
      solution: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

ft_dernier:
\txor\tecx, ecx
.cherche:
\tcmp\tbyte [rdi + rcx], 0
\tje\t.bout
\tinc\trcx
\tjmp\t.cherche
.bout:
\txor\teax, eax
\tcmp\trcx, 0
\tje\t.fin
\tmovzx\teax, byte [rdi + rcx - 1]
.fin:
\tret

_start:
\tmov\trdi, texte
\tcall\tlire_ligne
\tmov\trdi, texte
\tcall\tft_dernier
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + LIGNE,
      hints: ['xor ecx, ecx puis une boucle .cherche: cmp byte [rdi + rcx], 0 / je .bout / inc rcx / jmp .cherche', 'À .bout : si rcx vaut 0, renvoie 0.', 'Sinon movzx eax, byte [rdi + rcx - 1].'],
      tests: [{ stdin: 'abc\n', exit: 99 }, { stdin: 'Train 42\n', exit: 50 }, { stdin: '\n', exit: 0 }, { stdin: 'Z\n', exit: 90 }],
      rules: { mustSrc: [{ re: '^\\s*ft_dernier\\s*:', msg: 'Garde l’étiquette ft_dernier:' }] }
    },

    /* ================================================================ CHAPITRE 7 : la pile */
    {
      id: 'a7_1', ch: 7, ord: 1,
      title: 'Le vestiaire',
      scene: 'plates', sceneOpts: { title: 'LE VESTIAIRE' },
      story: 'Au vestiaire du gala, on dépose son manteau, on récupère un ticket… et on le reprend en partant. La <b>pile</b> du processeur fonctionne pareil.',
      goal: 'Dépose le numéro lu (rax) sur la pile avec <code>push</code> avant qu’il soit écrasé, puis reprends-le dans <code>rdi</code> avec <code>pop</code>. Entrée <code>42</code> → code de sortie <b>42</b>.',
      lesson: '<p><code>push rax</code> : rsp descend de 8 et la valeur de rax est écrite au sommet de la pile.</p>' +
        '<p><code>pop rdi</code> : la valeur du sommet est copiée dans rdi, puis rsp remonte de 8.</p>' +
        '<p>Regarde le registre <code>rsp</code> et la pile bouger pas à pas : la pile grandit vers les adresses <b>basses</b>.</p>',
      stdin: '42\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre\t\t; rax = numéro du manteau
\t; TODO 1 : dépose rax sur la pile

\tmov\trax, 0\t\t\t; le vestiaire fait le ménage :
\tmov\trdi, 0\t\t\t; rax et rdi sont effacés !

\t; TODO 2 : reprends le numéro dans rdi

\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tpush\trax

\tmov\trax, 0
\tmov\trdi, 0

\tpop\trdi

\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['TODO 1 : push rax', 'TODO 2 : pop rdi'],
      tests: [{ stdin: '42\n', exit: 42 }, { stdin: '7\n', exit: 7 }, { stdin: '200\n', exit: 200 }],
      rules: { mustSrc: [{ re: '\\bpush\\s+rax\\b', msg: 'Dépose rax avec push.' }, { re: '\\bpop\\s+rdi\\b', msg: 'Reprends la valeur avec pop rdi.' }] }
    },

    {
      id: 'a7_2', ch: 7, ord: 2,
      title: 'Le registre sacré',
      scene: 'plates', sceneOpts: { title: 'SAUVEGARDE DE RBX' },
      story: 'Le magasinier garde son stock dans <code>rbx</code>. Mais la fonction <code>affiche_titre</code> emprunte rbx… sans le rendre ! Répare-la.',
      goal: 'Dans <code>affiche_titre</code>, sauvegarde rbx sur la pile au début et restaure-le à la fin. Sortie : <code>== ATELIER 42 ==⏎</code> et code de sortie = le nombre lu (<code>7</code> → <b>7</b>).',
      lesson: '<p>Règle de la convention d’appel : une fonction peut abîmer rax, rcx, rdx, rsi, rdi, r8–r11, mais doit rendre <b>rbx, rbp, r12–r15</b> intacts. Ce sont les registres « sauvegardés par l’appelé ».</p>' +
        '<p>Si elle en a besoin, elle fait <code>push rbx</code> en entrant et <code>pop rbx</code> juste avant <code>ret</code>.</p>',
      stdin: '7\n',
      starter: `section .data
\ttitre\tdb "== ATELIER 42 ==", 10
\ttlen\tequ $ - titre

section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; affiche_titre : écrit le titre (elle se sert de rbx pour son travail)
affiche_titre:
\t; TODO 1 : sauvegarde rbx
\tmov\trbx, tlen\t\t\t; rbx = longueur du titre
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, titre
\tmov\trdx, rbx
\tsyscall
\t; TODO 2 : restaure rbx
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = pièces en stock
\tcall\taffiche_titre
\tmov\trdi, rbx\t\t\t; rbx doit être intact !
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .data
\ttitre\tdb "== ATELIER 42 ==", 10
\ttlen\tequ $ - titre

section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

affiche_titre:
\tpush\trbx
\tmov\trbx, tlen
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, titre
\tmov\trdx, rbx
\tsyscall
\tpop\trbx
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\taffiche_titre
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['Première ligne de la fonction : push rbx', 'Juste avant ret : pop rbx'],
      tests: [{ stdin: '7\n', expect: '== ATELIER 42 ==\n', exit: 7 }, { stdin: '99\n', expect: '== ATELIER 42 ==\n', exit: 99 }, { stdin: '0\n', expect: '== ATELIER 42 ==\n', exit: 0 }],
      rules: { mustSrc: [{ re: '\\bpush\\s+rbx\\b', msg: 'Sauvegarde rbx avec push.' }, { re: '\\bpop\\s+rbx\\b', msg: 'Restaure rbx avec pop.' }, { re: 'mov\\s+rbx\\s*,\\s*tlen', msg: 'Laisse la fonction utiliser rbx (mov rbx, tlen).' }] }
    },

    {
      id: 'a7_3', ch: 7, ord: 3,
      title: 'L’échange de casiers',
      scene: 'plates', sceneOpts: { title: 'ÉCHANGE PAR LA PILE' },
      story: 'Deux étudiants veulent échanger leurs casiers. Pas de troisième casier libre… mais la <b>pile</b> peut servir de zone de transit.',
      goal: 'Échange <code>r12</code> et <code>r13</code> uniquement avec <code>push</code> et <code>pop</code>. Le code de sortie vaut r12 × 10 + r13 : entrée <code>3 7</code> → après échange <b>73</b>.',
      lesson: '<p>La pile rend les valeurs dans l’ordre <b>inverse</b> de leur arrivée (LIFO : dernier entré, premier sorti).</p>' +
        '<pre>push r12   ; pile : a\npush r13   ; pile : a, b   (b au sommet)\npop  ???   ; reçoit b\npop  ???   ; reçoit a</pre>',
      stdin: '3 7\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; r12 = casier de Léa
\tcall\tlire_nombre
\tmov\tr13, rax\t\t\t; r13 = casier de Sami
\t; TODO : échange r12 et r13 avec push / pop

\timul\trdi, r12, 10\t\t; code = r12 × 10 + r13
\tadd\trdi, r13
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tmov\tr12, rax
\tcall\tlire_nombre
\tmov\tr13, rax
\tpush\tr12
\tpush\tr13
\tpop\tr12
\tpop\tr13

\timul\trdi, r12, 10
\tadd\trdi, r13
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['Empile les deux : push r12 puis push r13.', 'Le sommet contient r13 : le premier pop va donc dans r12.', 'push r12 / push r13 / pop r12 / pop r13'],
      tests: [{ stdin: '3 7\n', exit: 73 }, { stdin: '1 9\n', exit: 91 }, { stdin: '5 5\n', exit: 55 }, { stdin: '2 0\n', exit: 2 }],
      rules: {
        mustSrc: [{ re: '\\bpush\\b', msg: 'Utilise push.' }, { re: '\\bpop\\b', msg: 'Utilise pop.' }, { re: 'imul\\s+rdi\\s*,\\s*r12\\s*,\\s*10', msg: 'Ne change pas le calcul final.' }, { re: 'add\\s+rdi\\s*,\\s*r13', msg: 'Ne change pas le calcul final.' }],
        forbidSrc: [{ re: '\\bxchg\\b', msg: 'Pas de xchg : passe par la pile.' }, { re: '\\bmov\\s+\\w+\\s*,\\s*r1[23]\\b', msg: 'Pas de mov depuis r12 ou r13 : passe par la pile.' }]
      }
    },

    {
      id: 'a7_4', ch: 7, ord: 4,
      title: 'La pile déséquilibrée',
      scene: 'plates', sceneOpts: { title: 'ÉQUILIBRE DE LA PILE' },
      story: 'La fonction <code>ft_moyenne</code> du bureau des notes fait planter le programme : elle empile deux registres mais n’en dépile qu’un. Au <code>ret</code>, le processeur saute n’importe où !',
      goal: 'Répare <code>ft_moyenne</code> pour que chaque <code>push</code> ait son <code>pop</code>, dans le bon ordre. Elle renvoie (a + b) / 2 : entrée <code>10 20</code> → code de sortie <b>15</b>. rbx et r12 doivent ressortir intacts.',
      lesson: '<p><code>ret</code> dépile l’adresse de retour… à condition qu’elle soit au sommet ! Si un push n’a pas son pop, <code>ret</code> dépile une donnée et saute dans le vide : <b>Segmentation fault</b>.</p>' +
        '<p>On dépile dans l’ordre <b>inverse</b> des push : <code>push rbx / push r12</code> … <code>pop r12 / pop rbx</code>.</p>',
      stdin: '10 20\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_moyenne(a, b) = (a + b) / 2. Elle emprunte rbx et r12 et doit les rendre intacts.
ft_moyenne:
\tpush\trbx
\tpush\tr12
\tmov\trbx, rdi
\tmov\tr12, rsi
\tadd\trbx, r12
\tshr\trbx, 1\t\t\t; ÷ 2
\tmov\trax, rbx
\tpop\trbx\t\t\t\t; TODO : la pile n'est pas équilibrée…
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; rbx = a
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; r12 = b
\tmov\tr13, rbx\t\t\t; copies pour vérifier
\tmov\tr14, r12
\tmov\trdi, rbx
\tmov\trsi, r12
\tcall\tft_moyenne
\tmov\trdi, rax
\tcmp\trbx, r13
\tjne\t.abime
\tcmp\tr12, r14
\tje\t.sortie
.abime:
\tmov\trdi, 255\t\t\t; rbx ou r12 a été abîmé !
.sortie:
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_moyenne:
\tpush\trbx
\tpush\tr12
\tmov\trbx, rdi
\tmov\tr12, rsi
\tadd\trbx, r12
\tshr\trbx, 1
\tmov\trax, rbx
\tpop\tr12
\tpop\trbx
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\tlire_nombre
\tmov\tr12, rax
\tmov\tr13, rbx
\tmov\tr14, r12
\tmov\trdi, rbx
\tmov\trsi, r12
\tcall\tft_moyenne
\tmov\trdi, rax
\tcmp\trbx, r13
\tjne\t.abime
\tcmp\tr12, r14
\tje\t.sortie
.abime:
\tmov\trdi, 255
.sortie:
\tmov\trax, 60
\tsyscall
` + NOMBRE,
      hints: ['Deux push → il faut deux pop avant ret.', 'Le dernier empilé (r12) sort en premier.', 'pop r12 puis pop rbx.'],
      tests: [{ stdin: '10 20\n', exit: 15 }, { stdin: '7 8\n', exit: 7 }, { stdin: '100 250\n', exit: 175 }, { stdin: '0 0\n', exit: 0 }],
      rules: { mustSrc: [{ re: '\\bpop\\s+r12\\b', msg: 'Il manque pop r12.' }, { re: '\\bpop\\s+rbx\\b', msg: 'Il faut aussi pop rbx.' }] }
    },

    {
      id: 'a7_5', ch: 7, ord: 5,
      title: 'Le tableau du stade',
      scene: 'plates', sceneOpts: { title: 'VARIABLES LOCALES' },
      story: 'Le tableau d’affichage du stade montre toujours <b>deux chiffres</b> : 7 s’affiche <code>07</code>. La fonction <code>ft_affiche2</code> range ses caractères dans une petite zone de la <b>pile</b>.',
      goal: 'Complète <code>ft_affiche2</code> : écris les 3 caractères (dizaines, unités, retour à la ligne) dans <code>[rsp]</code>, <code>[rsp + 1]</code>, <code>[rsp + 2]</code>. Entrée <code>3 12</code> → <code>03⏎12⏎</code>.',
      lesson: '<p><code>sub rsp, 16</code> <b>réserve</b> 16 octets sur la pile : c’est la place des variables locales de la fonction. <code>add rsp, 16</code> les rend avant <code>ret</code>, pour que l’adresse de retour soit de nouveau au sommet.</p>' +
        '<p><code>div rcx</code> divise rdx:rax par rcx : quotient dans rax (les dizaines), reste dans rdx (les unités). <code>add al, \'0\'</code> transforme un chiffre en caractère.</p>',
      stdin: '3 12\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

; ft_affiche2(n) : affiche n (0 à 99) sur 2 chiffres puis un retour à la ligne
ft_affiche2:
\tsub\trsp, 16\t\t\t; réserve 16 octets sur la pile
\tmov\trax, rdi
\tmov\tecx, 10
\txor\tedx, edx
\tdiv\trcx\t\t\t\t; rax = dizaines, rdx = unités
\t; TODO : '0' + dizaines dans [rsp], '0' + unités dans [rsp + 1], 10 dans [rsp + 2]

\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, rsp\t\t\t; la zone locale commence à rsp
\tmov\trdx, 3
\tsyscall
\tadd\trsp, 16\t\t\t; rend la place avant ret
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax\t\t\t; score de l'équipe 1
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; score de l'équipe 2
\tmov\trdi, rbx
\tcall\tft_affiche2
\tmov\trdi, r12
\tcall\tft_affiche2
` + EXIT + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

ft_affiche2:
\tsub\trsp, 16
\tmov\trax, rdi
\tmov\tecx, 10
\txor\tedx, edx
\tdiv\trcx
\tadd\tal, '0'
\tmov\t[rsp], al
\tadd\tdl, '0'
\tmov\t[rsp + 1], dl
\tmov\tbyte [rsp + 2], 10

\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, rsp
\tmov\trdx, 3
\tsyscall
\tadd\trsp, 16
\tret

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\tcall\tlire_nombre
\tmov\tr12, rax
\tmov\trdi, rbx
\tcall\tft_affiche2
\tmov\trdi, r12
\tcall\tft_affiche2
` + EXIT + NOMBRE,
      hints: ['add al, \'0\' puis mov [rsp], al', 'add dl, \'0\' puis mov [rsp + 1], dl', 'mov byte [rsp + 2], 10 (le mot byte est obligatoire pour écrire un nombre en mémoire).'],
      tests: [{ stdin: '3 12\n', expect: '03\n12\n' }, { stdin: '42 7\n', expect: '42\n07\n' }, { stdin: '99 0\n', expect: '99\n00\n' }],
      rules: { mustSrc: [{ re: '\\[\\s*rsp\\s*\\+\\s*1\\s*\\]', msg: 'Range les caractères dans la zone locale [rsp], [rsp + 1]…' }, { re: '\\badd\\s+rsp\\s*,\\s*16\\b', msg: 'Garde add rsp, 16 avant ret.' }] }
    },

    {
      id: 'a7_6', ch: 7, ord: 6,
      title: 'L’afficheur de score',
      scene: 'plates', sceneOpts: { title: 'LES CHIFFRES EMPILÉS' },
      story: 'Le flipper de la salle de jeux doit afficher des scores de n’importe quelle taille. En divisant par 10 on obtient les chiffres… <b>à l’envers</b>. La pile va les remettre dans l’ordre !',
      goal: 'Empile chaque reste de la division par 10, puis dépile les chiffres un par un pour les afficher. Entrée <code>1234</code> → <code>1234⏎</code>.',
      lesson: '<p>1234 ÷ 10 = 123 reste <b>4</b>, puis 123 ÷ 10 = 12 reste <b>3</b>… Les chiffres sortent du dernier au premier.</p>' +
        '<p>On les <code>push</code> au fur et à mesure (en les comptant dans rbx), puis on les <code>pop</code> : la pile les rend dans l’ordre d’écriture. Le compteur est dans <b>rbx</b> car syscall écrase rcx.</p>',
      stdin: '1234\n',
      starter: `section .bss
\tcar\tresb 1
\tchiffre\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre\t\t; rax = le score
\txor\tebx, ebx\t\t\t; rbx = nombre de chiffres empilés
\tmov\tr12, 10
.decoupe:
\txor\tedx, edx
\tdiv\tr12\t\t\t\t; rax = rax / 10, rdx = dernier chiffre
\t; TODO 1 : empile rdx et compte-le dans rbx
\tcmp\trax, 0
\tjne\t.decoupe
.affiche:
\t; TODO 2 : dépile un chiffre, ajoute '0', range-le dans [chiffre] et écris-le
\t;          recommence tant que rbx n'est pas nul
.fin:
\tmov\tbyte [chiffre], 10
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, chiffre
\tmov\trdx, 1
\tsyscall
` + EXIT + NOMBRE,
      solution: `section .bss
\tcar\tresb 1
\tchiffre\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\txor\tebx, ebx
\tmov\tr12, 10
.decoupe:
\txor\tedx, edx
\tdiv\tr12
\tpush\trdx
\tinc\trbx
\tcmp\trax, 0
\tjne\t.decoupe
.affiche:
\tpop\trax
\tadd\tal, '0'
\tmov\t[chiffre], al
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, chiffre
\tmov\trdx, 1
\tsyscall
\tdec\trbx
\tjnz\t.affiche
.fin:
\tmov\tbyte [chiffre], 10
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, chiffre
\tmov\trdx, 1
\tsyscall
` + EXIT + NOMBRE,
      hints: ['TODO 1 : push rdx / inc rbx', 'TODO 2 : pop rax / add al, \'0\' / mov [chiffre], al, puis le write d’un octet.', 'Après le write : dec rbx / jnz .affiche'],
      tests: [{ stdin: '1234\n', expect: '1234\n' }, { stdin: '7\n', expect: '7\n' }, { stdin: '0\n', expect: '0\n' }, { stdin: '65535\n', expect: '65535\n' }],
      rules: { mustSrc: [{ re: '\\bpush\\b', msg: 'Empile les chiffres avec push.' }, { re: '\\bpop\\b', msg: 'Dépile-les avec pop.' }] }
    },

    {
      id: 'a7_7', ch: 7, ord: 7,
      title: 'Les poupées russes',
      scene: 'plates', sceneOpts: { title: 'APPELS RÉCURSIFS' },
      story: 'La boutique de jouets range ses poupées russes : n! = n × (n − 1)!. Une fonction qui s’appelle <b>elle-même</b> : chaque appel pose une nouvelle assiette sur la pile.',
      goal: 'Complète la fonction récursive <code>ft_fact</code> : sauvegarde n sur la pile, appelle <code>ft_fact(n − 1)</code>, récupère n et multiplie. Entrée <code>5</code> → code de sortie <b>120</b>.',
      lesson: '<p>Chaque <code>call ft_fact</code> empile une adresse de retour : la pile garde toutes les « poupées » ouvertes jusqu’au <b>cas de base</b> (n ≤ 1 → 1).</p>' +
        '<p>Mais <code>rdi</code> est écrasé par l’appel suivant : pour retrouver n au retour, on fait <code>push rdi</code> avant le call et <code>pop rdi</code> après.</p>',
      stdin: '5\n',
      starter: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tmov\trdi, rax
\tcall\tft_fact
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall

; ft_fact(n) : n! = n × (n - 1)!   et   0! = 1! = 1
ft_fact:
\tcmp\trdi, 1
\tjg\t.recursion
\tmov\teax, 1\t\t\t; cas de base
\tret
.recursion:
\t; TODO : push rdi, rdi = n - 1, call ft_fact, pop rdi, rax = rax × rdi
\tmov\trax, rdi
\tret
` + NOMBRE,
      solution: `section .bss
\tcar\tresb 1

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tmov\trdi, rax
\tcall\tft_fact
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall

ft_fact:
\tcmp\trdi, 1
\tjg\t.recursion
\tmov\teax, 1
\tret
.recursion:
\tpush\trdi
\tdec\trdi
\tcall\tft_fact
\tpop\trdi
\timul\trax, rdi
\tret
` + NOMBRE,
      hints: ['push rdi garde n à l’abri.', 'dec rdi / call ft_fact → rax = (n - 1)!', 'pop rdi / imul rax, rdi / ret (supprime le mov rax, rdi de départ).'],
      tests: [{ stdin: '5\n', exit: 120 }, { stdin: '3\n', exit: 6 }, { stdin: '0\n', exit: 1 }, { stdin: '4\n', exit: 24 }],
      rules: { mustSrc: [{ re: 'ft_fact\\s*:[\\s\\S]*call\\s+ft_fact', msg: 'ft_fact doit s’appeler elle-même (récursion).' }, { re: '\\bpush\\s+rdi\\b', msg: 'Sauvegarde n avec push rdi.' }] }
    },

    {
      id: 'a7_8', ch: 7, ord: 8,
      title: 'Le palindrome',
      scene: 'plates', sceneOpts: { title: 'LETTRES EMPILÉES' },
      story: 'Le club de lettres collectionne les <b>palindromes</b> (kayak, radar…). Empile toutes les lettres : en les dépilant, on lit le mot à l’envers. Il suffit de comparer !',
      goal: 'Complète la boucle <code>.compare</code> : dépile une lettre et compare-la à <code>[mot + rcx]</code>. Affiche <code>PALINDROME⏎</code> ou <code>PAS UN PALINDROME⏎</code>. En cas d’échec, remets la pile à sa hauteur de départ.',
      lesson: '<p>On note la hauteur de départ : <code>mov rbp, rsp</code>. La pile est revenue à son point de départ quand <code>rsp = rbp</code>.</p>' +
        '<p>Si on s’arrête au milieu (lettres différentes), il reste des lettres sur la pile : <code>mov rsp, rbp</code> les abandonne d’un coup et <b>rééquilibre</b> la pile.</p>',
      stdin: 'kayak\n',
      starter: `section .data
\toui\tdb "PALINDROME", 10
\tolen\tequ $ - oui
\tnon\tdb "PAS UN PALINDROME", 10
\tnlen\tequ $ - non

section .bss
\tmot\tresb 64

section .text
\tglobal\t_start

_start:
\tmov\trdi, mot
\tcall\tlire_ligne
\tmov\trbp, rsp\t\t\t; hauteur de départ de la pile
\txor\tecx, ecx
.empile:
\tmovzx\teax, byte [mot + rcx]
\tcmp\teax, 0
\tje\t.compare_init
\tpush\trax
\tinc\trcx
\tjmp\t.empile
.compare_init:
\txor\tecx, ecx
.compare:
\t; TODO 1 : si rsp = rbp (pile vide) → .oui
\t;          sinon dépile une lettre, compare-la à [mot + rcx] : différente → .non
\t;          avance rcx et recommence
\tjmp\t.oui
.non:
\t; TODO 2 : remets la pile à sa hauteur de départ
\tmov\trsi, non
\tmov\trdx, nlen
\tjmp\t.ecrire
.oui:
\tmov\trsi, oui
\tmov\trdx, olen
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      solution: `section .data
\toui\tdb "PALINDROME", 10
\tolen\tequ $ - oui
\tnon\tdb "PAS UN PALINDROME", 10
\tnlen\tequ $ - non

section .bss
\tmot\tresb 64

section .text
\tglobal\t_start

_start:
\tmov\trdi, mot
\tcall\tlire_ligne
\tmov\trbp, rsp
\txor\tecx, ecx
.empile:
\tmovzx\teax, byte [mot + rcx]
\tcmp\teax, 0
\tje\t.compare_init
\tpush\trax
\tinc\trcx
\tjmp\t.empile
.compare_init:
\txor\tecx, ecx
.compare:
\tcmp\trsp, rbp
\tje\t.oui
\tpop\trax
\tcmp\tal, [mot + rcx]
\tjne\t.non
\tinc\trcx
\tjmp\t.compare
.non:
\tmov\trsp, rbp
\tmov\trsi, non
\tmov\trdx, nlen
\tjmp\t.ecrire
.oui:
\tmov\trsi, oui
\tmov\trdx, olen
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      hints: ['cmp rsp, rbp / je .oui', 'pop rax / cmp al, [mot + rcx] / jne .non / inc rcx / jmp .compare', 'Dans .non : mov rsp, rbp'],
      tests: [{ stdin: 'kayak\n', expect: 'PALINDROME\n' }, { stdin: 'bonjour\n', expect: 'PAS UN PALINDROME\n' }, { stdin: 'a\n', expect: 'PALINDROME\n' }, { stdin: 'radar ou rabat\n', expect: 'PAS UN PALINDROME\n' }],
      rules: { mustSrc: [{ re: '\\bpop\\b', msg: 'Dépile les lettres avec pop.' }, { re: 'mov\\s+rsp\\s*,\\s*rbp', msg: 'Remets la pile à sa hauteur de départ (mov rsp, rbp).' }] }
    },

    {
      id: 'a7_9', ch: 7, ord: 9,
      title: 'Les parenthèses du compilateur',
      scene: 'plates', sceneOpts: { title: 'OUVRANTS EN ATTENTE' },
      story: 'L’équipe du compilateur vérifie les formules : chaque <code>(</code> doit être fermée par <code>)</code> et chaque <code>[</code> par <code>]</code>, dans le bon ordre. L’outil parfait : une pile d’ouvrants en attente.',
      goal: 'Empile chaque ouvrant ; à chaque fermant, la pile ne doit pas être vide et le sommet doit être l’ouvrant correspondant. À la fin la pile doit être vide. Affiche <code>EQUILIBRE⏎</code> ou <code>DESEQUILIBRE⏎</code>.',
      lesson: '<p>Le dernier ouvrant rencontré est le premier à fermer : c’est exactement la règle LIFO de la pile.</p>' +
        '<p>Trois erreurs possibles : fermant avec la pile vide (<code>())</code>), mauvais couple (<code>(]</code>), ouvrants restants à la fin (<code>(()</code>). Dans tous les cas, <code>mov rsp, rbp</code> remet la pile en ordre.</p>',
      stdin: '([]())\n',
      starter: `section .data
\tmsg_ok\tdb "EQUILIBRE", 10
\tlen_ok\tequ $ - msg_ok
\tmsg_ko\tdb "DESEQUILIBRE", 10
\tlen_ko\tequ $ - msg_ko

section .bss
\tligne\tresb 64

section .text
\tglobal\t_start

_start:
\tmov\trdi, ligne
\tcall\tlire_ligne
\tmov\trbp, rsp\t\t\t; hauteur de départ de la pile
\txor\tebx, ebx\t\t\t; rbx = indice
.boucle:
\tmovzx\teax, byte [ligne + rbx]
\tcmp\teax, 0
\tje\t.fin_ligne
\tinc\trbx
\tcmp\teax, '('
\tje\t.ouvre
\tcmp\teax, '['
\tje\t.ouvre
\tcmp\teax, ')'
\tje\t.ferme_rond
\tcmp\teax, ']'
\tje\t.ferme_carre
\tjmp\t.boucle\t\t\t; autre caractère : ignoré
.ouvre:
\t; TODO 1 : empile l'ouvrant
\tjmp\t.boucle
.ferme_rond:
\tmov\tedx, '('\t\t\t; l'ouvrant attendu
\tjmp\t.ferme
.ferme_carre:
\tmov\tedx, '['
.ferme:
\t; TODO 2 : pile vide (rsp = rbp) → .ko ; sinon dépile et compare à rdx : différent → .ko
\tjmp\t.boucle
.fin_ligne:
\t; TODO 3 : s'il reste des ouvrants sur la pile → .ko
.ok:
\tmov\trsi, msg_ok
\tmov\trdx, len_ok
\tjmp\t.ecrire
.ko:
\tmov\trsp, rbp\t\t\t; remet la pile à sa hauteur de départ
\tmov\trsi, msg_ko
\tmov\trdx, len_ko
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      solution: `section .data
\tmsg_ok\tdb "EQUILIBRE", 10
\tlen_ok\tequ $ - msg_ok
\tmsg_ko\tdb "DESEQUILIBRE", 10
\tlen_ko\tequ $ - msg_ko

section .bss
\tligne\tresb 64

section .text
\tglobal\t_start

_start:
\tmov\trdi, ligne
\tcall\tlire_ligne
\tmov\trbp, rsp
\txor\tebx, ebx
.boucle:
\tmovzx\teax, byte [ligne + rbx]
\tcmp\teax, 0
\tje\t.fin_ligne
\tinc\trbx
\tcmp\teax, '('
\tje\t.ouvre
\tcmp\teax, '['
\tje\t.ouvre
\tcmp\teax, ')'
\tje\t.ferme_rond
\tcmp\teax, ']'
\tje\t.ferme_carre
\tjmp\t.boucle
.ouvre:
\tpush\trax
\tjmp\t.boucle
.ferme_rond:
\tmov\tedx, '('
\tjmp\t.ferme
.ferme_carre:
\tmov\tedx, '['
.ferme:
\tcmp\trsp, rbp
\tje\t.ko
\tpop\trax
\tcmp\trax, rdx
\tjne\t.ko
\tjmp\t.boucle
.fin_ligne:
\tcmp\trsp, rbp
\tjne\t.ko
.ok:
\tmov\trsi, msg_ok
\tmov\trdx, len_ok
\tjmp\t.ecrire
.ko:
\tmov\trsp, rbp
\tmov\trsi, msg_ko
\tmov\trdx, len_ko
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      hints: ['.ouvre : push rax', '.ferme : cmp rsp, rbp / je .ko / pop rax / cmp rax, rdx / jne .ko', '.fin_ligne : cmp rsp, rbp / jne .ko'],
      tests: [{ stdin: 'f(t[i]) * (2)\n', expect: 'EQUILIBRE\n' }, { stdin: '(]\n', expect: 'DESEQUILIBRE\n' }, { stdin: '(()\n', expect: 'DESEQUILIBRE\n' }, { stdin: '())\n', expect: 'DESEQUILIBRE\n' }],
      rules: { mustSrc: [{ re: '\\bpush\\b', msg: 'Empile les ouvrants avec push.' }, { re: '\\bpop\\b', msg: 'Dépile avec pop.' }] }
    },

    /* ================================================================ CHAPITRE 8 : copier la mémoire */
    {
      id: 'a8_1', ch: 8, ord: 1,
      title: 'L’étiquette du casier',
      story: 'Sur les casiers de la piscine, il n’y a place que pour <b>3 lettres</b>. Copie le début du nom tapé dans la zone <code>etiquette</code>.',
      goal: 'Copie les 3 premiers octets de <code>nom</code> dans <code>etiquette</code>, puis mets <code>10</code> (retour à la ligne) dans <code>[etiquette + 3]</code>. Entrée <code>Bernard</code> → <code>Ber⏎</code>.',
      lesson: '<p>Une instruction ne peut pas copier <b>mémoire → mémoire</b> : on passe par un registre.</p><pre>mov al, [nom + 1]        ; lire l’octet n°1\nmov [etiquette + 1], al  ; l’écrire</pre>' +
        '<p>La section <b>.bss</b> réserve des zones (<code>resb 4</code> = 4 octets) remplies de 0 au démarrage. Pour écrire un nombre directement en mémoire, précise la taille : <code>mov byte [etiquette + 3], 10</code>.</p>',
      stdin: 'Bernard\n',
      starter: `section .bss
\tnom\t\tresb 64
\tetiquette\tresb 4

section .text
\tglobal\t_start

_start:
\tmov\trdi, nom
\tcall\tlire_ligne\t\t; nom = la ligne tapée
\t; TODO : copie nom[0], nom[1], nom[2] dans etiquette, puis 10 dans [etiquette + 3]

\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, etiquette
\tmov\trdx, 4
\tsyscall
` + EXIT + LIGNE,
      solution: `section .bss
\tnom\t\tresb 64
\tetiquette\tresb 4

section .text
\tglobal\t_start

_start:
\tmov\trdi, nom
\tcall\tlire_ligne
\tmov\tal, [nom]
\tmov\t[etiquette], al
\tmov\tal, [nom + 1]
\tmov\t[etiquette + 1], al
\tmov\tal, [nom + 2]
\tmov\t[etiquette + 2], al
\tmov\tbyte [etiquette + 3], 10

\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, etiquette
\tmov\trdx, 4
\tsyscall
` + EXIT + LIGNE,
      hints: ['mov al, [nom] puis mov [etiquette], al', 'Même chose avec [nom + 1] et [nom + 2].', 'mov byte [etiquette + 3], 10'],
      tests: [{ stdin: 'Bernard\n', expect: 'Ber\n' }, { stdin: 'Zoe\n', expect: 'Zoe\n' }, { stdin: 'ABCDEF\n', expect: 'ABC\n' }],
      rules: {}
    },

    {
      id: 'a8_2', ch: 8, ord: 2,
      title: 'La frise du gymnase',
      scene: 'sign', sceneOpts: { v: 'frise', text: '' },
      story: 'Pour la fête du sport, il faut peindre une frise de <code>=</code> le long du mur. Sa longueur est donnée sur l’entrée.',
      goal: 'Remplis <code>frise</code> avec n caractères <code>=</code> grâce à un indice <code>rcx</code> : <code>mov byte [frise + rcx], \'=\'</code>. Entrée <code>5</code> → <code>=====⏎</code>.',
      lesson: '<p>Une adresse peut contenir un <b>registre d’indice</b> : <code>[frise + rcx]</code> = la case n° rcx de la zone frise. En faisant varier rcx, on parcourt toute la zone.</p>' +
        '<p>Boucle « tant que rcx &lt; n » : <code>cmp rcx, rbx</code> puis <code>jge .fin</code>.</p>',
      stdin: '5\n',
      starter: `section .bss
\tcar\tresb 1
\tfrise\tresb 64

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre\t\t; rax = longueur (moins de 60)
\tmov\trbx, rax
\txor\tecx, ecx\t\t\t; rcx = indice
.remplit:
\t; TODO : tant que rcx < rbx, écris '=' dans [frise + rcx] et avance rcx
.fin:
\tmov\tbyte [frise + rbx], 10\t; retour à la ligne final
\tlea\trdx, [rbx + 1]\t\t; nombre d'octets à écrire
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, frise
\tsyscall
` + EXIT + NOMBRE,
      solution: `section .bss
\tcar\tresb 1
\tfrise\tresb 64

section .text
\tglobal\t_start

_start:
\tcall\tlire_nombre
\tmov\trbx, rax
\txor\tecx, ecx
.remplit:
\tcmp\trcx, rbx
\tjge\t.fin
\tmov\tbyte [frise + rcx], '='
\tinc\trcx
\tjmp\t.remplit
.fin:
\tmov\tbyte [frise + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, frise
\tsyscall
` + EXIT + NOMBRE,
      hints: ['cmp rcx, rbx / jge .fin', 'mov byte [frise + rcx], \'=\'', 'inc rcx / jmp .remplit'],
      tests: [{ stdin: '5\n', expect: '=====\n' }, { stdin: '1\n', expect: '=\n' }, { stdin: '0\n', expect: '\n' }, { stdin: '20\n', expect: '====================\n' }],
      rules: { mustSrc: [{ re: '\\[\\s*frise\\s*\\+\\s*rcx\\s*\\]', msg: 'Utilise l’indice : [frise + rcx].' }] }
    },

    {
      id: 'a8_3', ch: 8, ord: 3,
      title: 'Les archives',
      story: 'Les archives du campus recopient chaque fiche avant de la ranger. Écris <code>ft_memcpy</code> : copier exactement <b>n octets</b> d’une zone à une autre.',
      goal: 'Écris <code>ft_memcpy(dst, src, n)</code> : <code>rdi</code> = destination, <code>rsi</code> = source, <code>rdx</code> = nombre d’octets ; renvoie dst dans rax. Le programme copie la ligne lue dans <code>copie</code> et l’affiche.',
      lesson: '<p>Le même indice sert pour la lecture et l’écriture :</p><pre>mov al, [rsi + rcx]   ; src[rcx]\nmov [rdi + rcx], al   ; dst[rcx]</pre>' +
        '<p>On s’arrête quand rcx atteint n (<code>cmp rcx, rdx</code>). Comme <code>rcx</code> part de 0, une copie de 0 octet ne fait rien.</p>',
      stdin: 'Archives 1987\n',
      starter: `section .bss
\tsource\tresb 64
\tcopie\tresb 64

section .text
\tglobal\t_start

; ft_memcpy(dst, src, n) : copie n octets de rsi vers rdi, renvoie dst
ft_memcpy:
\txor\tecx, ecx\t\t\t; rcx = indice
\t; TODO : tant que rcx < rdx, copie [rsi + rcx] vers [rdi + rcx]
\tmov\trax, rdi
\tret
` + STRLEN + `
_start:
\tmov\trdi, source
\tcall\tlire_ligne
\tmov\trdi, source
\tcall\tft_strlen
\tmov\trbx, rax\t\t\t; rbx = longueur
\tmov\trdi, copie
\tmov\trsi, source
\tmov\trdx, rbx
\tcall\tft_memcpy
\tmov\tbyte [copie + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, copie
\tsyscall
` + EXIT + LIGNE,
      solution: `section .bss
\tsource\tresb 64
\tcopie\tresb 64

section .text
\tglobal\t_start

ft_memcpy:
\txor\tecx, ecx
.boucle:
\tcmp\trcx, rdx
\tjge\t.fin
\tmov\tal, [rsi + rcx]
\tmov\t[rdi + rcx], al
\tinc\trcx
\tjmp\t.boucle
.fin:
\tmov\trax, rdi
\tret
` + STRLEN + `
_start:
\tmov\trdi, source
\tcall\tlire_ligne
\tmov\trdi, source
\tcall\tft_strlen
\tmov\trbx, rax
\tmov\trdi, copie
\tmov\trsi, source
\tmov\trdx, rbx
\tcall\tft_memcpy
\tmov\tbyte [copie + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, copie
\tsyscall
` + EXIT + LIGNE,
      hints: ['Ajoute une étiquette .boucle: avec cmp rcx, rdx / jge .fin', 'mov al, [rsi + rcx] / mov [rdi + rcx], al / inc rcx / jmp .boucle', 'Place .fin: juste avant mov rax, rdi.'],
      tests: [{ stdin: 'Archives 1987\n', expect: 'Archives 1987\n' }, { stdin: 'ok\n', expect: 'ok\n' }, { stdin: '\n', expect: '\n' }, { stdin: 'Fiche n 42 : rangee\n', expect: 'Fiche n 42 : rangee\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_memcpy\\s*:', msg: 'Garde l’étiquette ft_memcpy:' }] }
    },

    {
      id: 'a8_4', ch: 8, ord: 4,
      title: 'Le haut-parleur',
      scene: 'sign', sceneOpts: { v: 'texte', text: 'bonjour 42' },
      story: 'Le haut-parleur de la gare n’affiche que des MAJUSCULES. Écris <code>ft_majuscules</code> qui transforme une chaîne <b>sur place</b>.',
      goal: 'Dans <code>ft_majuscules</code>, chaque octet entre <code>\'a\'</code> et <code>\'z\'</code> perd 32 et est réécrit au même endroit. Les autres caractères ne bougent pas. <code>bonjour 42</code> → <code>BONJOUR 42⏎</code>.',
      lesson: '<p>En ASCII, une minuscule et sa majuscule sont séparées de <b>32</b> : <code>\'a\'</code> = 97, <code>\'A\'</code> = 65.</p>' +
        '<p>« Sur place » : on lit <code>[rdi + rcx]</code>, on modifie le registre, puis on <b>réécrit</b> à la même adresse. Regarde l’enseigne changer lettre par lettre.</p>',
      stdin: 'bonjour 42\n',
      starter: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

; ft_majuscules(s) : met en majuscules les lettres a…z de s, sur place
ft_majuscules:
\txor\tecx, ecx
.boucle:
\tmov\tal, [rdi + rcx]
\tcmp\tal, 0
\tje\t.fin
\t; TODO : si al est entre 'a' et 'z', retire 32 et réécris-le dans [rdi + rcx]
.suivant:
\tinc\trcx
\tjmp\t.boucle
.fin:
\tret
` + STRLEN + `
_start:
\tmov\trdi, texte
\tcall\tlire_ligne
\tmov\trdi, texte
\tcall\tft_majuscules
\tmov\trdi, texte
\tcall\tft_strlen
\tmov\tbyte [texte + rax], 10
\tlea\trdx, [rax + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, texte
\tsyscall
` + EXIT + LIGNE,
      solution: `section .bss
\ttexte\tresb 64

section .text
\tglobal\t_start

ft_majuscules:
\txor\tecx, ecx
.boucle:
\tmov\tal, [rdi + rcx]
\tcmp\tal, 0
\tje\t.fin
\tcmp\tal, 'a'
\tjb\t.suivant
\tcmp\tal, 'z'
\tja\t.suivant
\tsub\tal, 32
\tmov\t[rdi + rcx], al
.suivant:
\tinc\trcx
\tjmp\t.boucle
.fin:
\tret
` + STRLEN + `
_start:
\tmov\trdi, texte
\tcall\tlire_ligne
\tmov\trdi, texte
\tcall\tft_majuscules
\tmov\trdi, texte
\tcall\tft_strlen
\tmov\tbyte [texte + rax], 10
\tlea\trdx, [rax + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, texte
\tsyscall
` + EXIT + LIGNE,
      hints: ['cmp al, \'a\' / jb .suivant', 'cmp al, \'z\' / ja .suivant', 'sub al, 32 / mov [rdi + rcx], al'],
      tests: [{ stdin: 'bonjour 42\n', expect: 'BONJOUR 42\n' }, { stdin: 'Hello World\n', expect: 'HELLO WORLD\n' }, { stdin: '`az{\n', expect: '`AZ{\n' }, { stdin: '\n', expect: '\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_majuscules\\s*:', msg: 'Garde l’étiquette ft_majuscules:' }] }
    },

    {
      id: 'a8_5', ch: 8, ord: 5,
      title: 'Le compteur de lettres',
      scene: 'ruler', sceneOpts: { v: 'ligne', i: 'rcx', cap: 'Le 1er caractère est la lettre à chercher dans la suite' },
      story: 'Le club de Scrabble veut savoir combien de fois une lettre apparaît. Le <b>premier caractère</b> de la ligne est la lettre cherchée, le reste est le texte.',
      goal: 'Écris <code>ft_compte(s, c)</code> : <code>rdi</code> = chaîne, <code>rsi</code> = caractère ; renvoie dans rax le nombre de fois où c apparaît dans s. <code>aabracadabra</code> → cherche \'a\' dans « abracadabra » → code de sortie <b>5</b>.',
      lesson: '<p>Pour comparer un octet de la chaîne à un registre 64 bits, lis-le avec <code>movzx edx, byte [rdi + rcx]</code> : rdx contient alors exactement le code du caractère, et on peut faire <code>cmp rdx, rsi</code>.</p>' +
        '<p>Deux compteurs : <code>rcx</code> avance dans la chaîne, <code>rax</code> compte les trouvailles.</p>',
      stdin: 'aabracadabra\n',
      starter: `section .bss
\tligne\tresb 64

section .text
\tglobal\t_start

; ft_compte(s, c) : nombre d'apparitions de c (rsi) dans s (rdi)
ft_compte:
\txor\teax, eax
\t; TODO
\tret

_start:
\tmov\trdi, ligne
\tcall\tlire_ligne
\tlea\trdi, [ligne + 1]\t\t; le texte commence après la lettre
\tmovzx\tesi, byte [ligne]\t; la lettre cherchée
\tcall\tft_compte
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + LIGNE,
      solution: `section .bss
\tligne\tresb 64

section .text
\tglobal\t_start

ft_compte:
\txor\teax, eax
\txor\tecx, ecx
.boucle:
\tmovzx\tedx, byte [rdi + rcx]
\tcmp\tedx, 0
\tje\t.fin
\tcmp\trdx, rsi
\tjne\t.suivant
\tinc\trax
.suivant:
\tinc\trcx
\tjmp\t.boucle
.fin:
\tret

_start:
\tmov\trdi, ligne
\tcall\tlire_ligne
\tlea\trdi, [ligne + 1]
\tmovzx\tesi, byte [ligne]
\tcall\tft_compte
\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
` + LIGNE,
      hints: ['xor ecx, ecx puis .boucle: movzx edx, byte [rdi + rcx] / cmp edx, 0 / je .fin', 'cmp rdx, rsi / jne .suivant / inc rax', '.suivant: inc rcx / jmp .boucle'],
      tests: [{ stdin: 'aabracadabra\n', exit: 5 }, { stdin: 'sles sacs sont secs\n', exit: 6 }, { stdin: 'z42\n', exit: 0 }, { stdin: 'xxxxx\n', exit: 4 }],
      rules: { mustSrc: [{ re: '^\\s*ft_compte\\s*:', msg: 'Garde l’étiquette ft_compte:' }] }
    },

    {
      id: 'a8_6', ch: 8, ord: 6,
      title: 'Le miroir de la fête foraine',
      scene: 'sign', sceneOpts: { v: 'copie', text: '' },
      story: 'Au palais des glaces, chaque mot se reflète <b>à l’envers</b>. Copie la chaîne en partant de la fin de la source.',
      goal: 'Écris <code>ft_miroir(dst, src, n)</code> : <code>dst[i] = src[n − 1 − i]</code> pour i de 0 à n − 1 (rdi = dst, rsi = src, rdx = n). <code>bonjour</code> → <code>ruojnob⏎</code>.',
      lesson: '<p>Les adresses se calculent : avec <code>r8 = n − i</code>, la lettre à lire est <code>[rsi + r8 - 1]</code>.</p>' +
        '<p>Deux positions évoluent en sens contraires : on écrit en avançant dans dst pendant qu’on lit en reculant dans src. (Au chapitre 7 on l’avait fait avec la pile ; ici, uniquement avec des indices.)</p>',
      stdin: 'bonjour\n',
      starter: `section .bss
\tsource\tresb 64
\tcopie\tresb 64

section .text
\tglobal\t_start

; ft_miroir(dst, src, n) : dst[i] = src[n - 1 - i]
ft_miroir:
\txor\tecx, ecx\t\t\t; rcx = i
\t; TODO
\tret
` + STRLEN + `
_start:
\tmov\trdi, source
\tcall\tlire_ligne
\tmov\trdi, source
\tcall\tft_strlen
\tmov\trbx, rax\t\t\t; rbx = n
\tmov\trdi, copie
\tmov\trsi, source
\tmov\trdx, rbx
\tcall\tft_miroir
\tmov\tbyte [copie + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, copie
\tsyscall
` + EXIT + LIGNE,
      solution: `section .bss
\tsource\tresb 64
\tcopie\tresb 64

section .text
\tglobal\t_start

ft_miroir:
\txor\tecx, ecx
.boucle:
\tcmp\trcx, rdx
\tjge\t.fin
\tmov\tr8, rdx
\tsub\tr8, rcx
\tmov\tal, [rsi + r8 - 1]
\tmov\t[rdi + rcx], al
\tinc\trcx
\tjmp\t.boucle
.fin:
\tret
` + STRLEN + `
_start:
\tmov\trdi, source
\tcall\tlire_ligne
\tmov\trdi, source
\tcall\tft_strlen
\tmov\trbx, rax
\tmov\trdi, copie
\tmov\trsi, source
\tmov\trdx, rbx
\tcall\tft_miroir
\tmov\tbyte [copie + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, copie
\tsyscall
` + EXIT + LIGNE,
      hints: ['Boucle tant que rcx < rdx (cmp rcx, rdx / jge .fin).', 'mov r8, rdx / sub r8, rcx → r8 = n - i', 'mov al, [rsi + r8 - 1] / mov [rdi + rcx], al / inc rcx'],
      tests: [{ stdin: 'bonjour\n', expect: 'ruojnob\n' }, { stdin: '42 Origins\n', expect: 'snigirO 24\n' }, { stdin: 'a\n', expect: 'a\n' }, { stdin: '\n', expect: '\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_miroir\\s*:', msg: 'Garde l’étiquette ft_miroir:' }], forbidSrc: [{ re: '\\bpush\\b', msg: 'Ici, pas de pile : utilise des indices.' }] }
    },

    {
      id: 'a8_7', ch: 8, ord: 7,
      title: 'Le code sans espaces',
      story: 'Le Wi-Fi du campus refuse les espaces dans les codes, mais les étudiants tapent <code>4 2 4 2</code>. Recopie la saisie en <b>sautant les espaces</b>.',
      goal: 'Écris <code>ft_sans_espaces(dst, src)</code> : copie src dans dst sans les espaces, 0 final compris, et renvoie dans rax le nombre de caractères copiés (sans le 0). <code>12 34 56</code> → <code>123456⏎</code>.',
      lesson: '<p>Ici il faut <b>deux indices</b> : un pour lire dans src (rcx), un pour écrire dans dst (rax). Ils avancent à des vitesses différentes : rcx avance toujours, rax seulement quand on garde le caractère.</p>' +
        '<p>Le 0 final doit aussi être copié : c’est lui qui termine la boucle.</p>',
      stdin: '12 34 56\n',
      starter: `section .bss
\tsaisie\tresb 64
\tcode\tresb 64

section .text
\tglobal\t_start

; ft_sans_espaces(dst, src) : copie src dans dst sans les ' ', renvoie la longueur copiée
ft_sans_espaces:
\txor\tecx, ecx\t\t\t; rcx = lecture dans src
\txor\teax, eax\t\t\t; rax = écriture dans dst
\t; TODO
\tret

_start:
\tmov\trdi, saisie
\tcall\tlire_ligne
\tmov\trdi, code
\tmov\trsi, saisie
\tcall\tft_sans_espaces
\tmov\trbx, rax
\tmov\tbyte [code + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, code
\tsyscall
` + EXIT + LIGNE,
      solution: `section .bss
\tsaisie\tresb 64
\tcode\tresb 64

section .text
\tglobal\t_start

ft_sans_espaces:
\txor\tecx, ecx
\txor\teax, eax
.boucle:
\tmov\tdl, [rsi + rcx]
\tinc\trcx
\tcmp\tdl, ' '
\tje\t.boucle
\tmov\t[rdi + rax], dl
\tcmp\tdl, 0
\tje\t.fin
\tinc\trax
\tjmp\t.boucle
.fin:
\tret

_start:
\tmov\trdi, saisie
\tcall\tlire_ligne
\tmov\trdi, code
\tmov\trsi, saisie
\tcall\tft_sans_espaces
\tmov\trbx, rax
\tmov\tbyte [code + rbx], 10
\tlea\trdx, [rbx + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, code
\tsyscall
` + EXIT + LIGNE,
      hints: ['Lis un octet : mov dl, [rsi + rcx] / inc rcx', 'Si c’est un espace (cmp dl, \' \'), recommence sans écrire.', 'Sinon mov [rdi + rax], dl ; si dl = 0 c’est fini, sinon inc rax et recommence.'],
      tests: [{ stdin: '12 34 56\n', expect: '123456\n' }, { stdin: 'a b  c\n', expect: 'abc\n' }, { stdin: '   \n', expect: '\n' }, { stdin: 'sans\n', expect: 'sans\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_sans_espaces\\s*:', msg: 'Garde l’étiquette ft_sans_espaces:' }] }
    },

    {
      id: 'a8_8', ch: 8, ord: 8,
      title: 'Le bibliothécaire',
      story: 'Le bibliothécaire range les livres par ordre alphabétique. Il lui faut <code>ft_strcmp</code> pour savoir si un titre se range <b>avant</b> ou <b>après</b> un autre.',
      goal: 'Écris <code>ft_strcmp(s1, s2)</code> : avance tant que les octets sont égaux et non nuls, puis renvoie <code>s1[i] − s2[i]</code> dans rax (négatif, nul ou positif). Le programme lit deux lignes et affiche <code>AVANT⏎</code>, <code>APRES⏎</code> ou <code>PAREIL⏎</code>.',
      lesson: '<p>On lit les deux octets avec <code>movzx</code> (valeurs de 0 à 255), puis on les compare. Au premier écart, ou quand on arrive au 0 final, la réponse est leur <b>différence</b>.</p>' +
        '<p>« chat » et « chaton » : à l’indice 4, on compare 0 et \'o\' : 0 − 111 &lt; 0, donc « chat » se range avant.</p>',
      stdin: 'abc\nabd\n',
      starter: `section .data
\tavant\tdb "AVANT", 10
\tapres\tdb "APRES", 10
\tpareil\tdb "PAREIL", 10

section .bss
\tmot1\tresb 64
\tmot2\tresb 64

section .text
\tglobal\t_start

; ft_strcmp(s1, s2) : < 0, 0 ou > 0
ft_strcmp:
\txor\teax, eax
\t; TODO
\tret

_start:
\tmov\trdi, mot1
\tcall\tlire_ligne
\tmov\trdi, mot2
\tcall\tlire_ligne
\tmov\trdi, mot1
\tmov\trsi, mot2
\tcall\tft_strcmp
\tcmp\trax, 0
\tjl\t.avant
\tjg\t.apres
\tmov\trsi, pareil
\tmov\trdx, 7
\tjmp\t.ecrire
.avant:
\tmov\trsi, avant
\tmov\trdx, 6
\tjmp\t.ecrire
.apres:
\tmov\trsi, apres
\tmov\trdx, 6
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      solution: `section .data
\tavant\tdb "AVANT", 10
\tapres\tdb "APRES", 10
\tpareil\tdb "PAREIL", 10

section .bss
\tmot1\tresb 64
\tmot2\tresb 64

section .text
\tglobal\t_start

ft_strcmp:
\txor\tecx, ecx
.boucle:
\tmovzx\teax, byte [rdi + rcx]
\tmovzx\tedx, byte [rsi + rcx]
\tcmp\teax, edx
\tjne\t.fin
\tcmp\teax, 0
\tje\t.fin
\tinc\trcx
\tjmp\t.boucle
.fin:
\tsub\trax, rdx
\tret

_start:
\tmov\trdi, mot1
\tcall\tlire_ligne
\tmov\trdi, mot2
\tcall\tlire_ligne
\tmov\trdi, mot1
\tmov\trsi, mot2
\tcall\tft_strcmp
\tcmp\trax, 0
\tjl\t.avant
\tjg\t.apres
\tmov\trsi, pareil
\tmov\trdx, 7
\tjmp\t.ecrire
.avant:
\tmov\trsi, avant
\tmov\trdx, 6
\tjmp\t.ecrire
.apres:
\tmov\trsi, apres
\tmov\trdx, 6
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tsyscall
` + EXIT + LIGNE,
      hints: ['movzx eax, byte [rdi + rcx] et movzx edx, byte [rsi + rcx]', 'S’ils diffèrent (jne .fin) ou si eax vaut 0 (je .fin), c’est fini ; sinon inc rcx et recommence.', '.fin: sub rax, rdx / ret'],
      tests: [{ stdin: 'abc\nabd\n', expect: 'AVANT\n' }, { stdin: 'zoo\nzebre\n', expect: 'APRES\n' }, { stdin: 'chat\nchat\n', expect: 'PAREIL\n' }, { stdin: 'chat\nchaton\n', expect: 'AVANT\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_strcmp\\s*:', msg: 'Garde l’étiquette ft_strcmp:' }], forbidCall: ['strcmp'] }
    },

    {
      id: 'a8_9', ch: 8, ord: 9,
      title: 'Le graveur de badges',
      story: 'Le graveur de badges reçoit le prénom puis le nom, et doit graver « Prénom Nom ». Il lui faut <code>ft_strcat(dst, src)</code> : <b>ajouter</b> une chaîne à la fin d’une autre.',
      goal: 'Écris <code>ft_strcat</code> : trouve la fin de <code>dst</code> (rdi), puis copie <code>src</code> (rsi) à partir de là, 0 final compris ; renvoie dst. Entrée <code>Ada⏎Lovelace⏎</code> → <code>Ada Lovelace⏎</code>.',
      lesson: '<p>Deux étapes : 1) avancer rcx jusqu’au 0 de dst ; 2) copier src octet par octet à partir de <code>[rdi + rcx]</code>, avec un 2e indice pour src.</p>' +
        '<p>⚠ La zone dst doit être assez grande pour contenir les deux chaînes : ici <code>resb 128</code>.</p>',
      stdin: 'Ada\nLovelace\n',
      starter: `section .data
\tespace\tdb " ", 0

section .bss
\tbadge\tresb 128
\tnom\tresb 64

section .text
\tglobal\t_start

; ft_strcat(dst, src) : ajoute src à la fin de dst (0 final compris), renvoie dst
ft_strcat:
\t; TODO 1 : trouve la fin de dst (son 0) avec rcx
\t; TODO 2 : copie src à partir de là, 0 final compris
\tmov\trax, rdi
\tret
` + STRLEN + `
_start:
\tmov\trdi, badge
\tcall\tlire_ligne\t\t; le prénom va directement dans badge
\tmov\trdi, nom
\tcall\tlire_ligne
\tmov\trdi, badge
\tmov\trsi, espace
\tcall\tft_strcat
\tmov\trdi, badge
\tmov\trsi, nom
\tcall\tft_strcat
\tmov\trdi, badge
\tcall\tft_strlen
\tmov\tbyte [badge + rax], 10
\tlea\trdx, [rax + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, badge
\tsyscall
` + EXIT + LIGNE,
      solution: `section .data
\tespace\tdb " ", 0

section .bss
\tbadge\tresb 128
\tnom\tresb 64

section .text
\tglobal\t_start

ft_strcat:
\txor\tecx, ecx
.fin_dst:
\tcmp\tbyte [rdi + rcx], 0
\tje\t.copie_init
\tinc\trcx
\tjmp\t.fin_dst
.copie_init:
\txor\tedx, edx
.copie:
\tmov\tal, [rsi + rdx]
\tmov\t[rdi + rcx], al
\tinc\trcx
\tinc\trdx
\tcmp\tal, 0
\tjne\t.copie
\tmov\trax, rdi
\tret
` + STRLEN + `
_start:
\tmov\trdi, badge
\tcall\tlire_ligne
\tmov\trdi, nom
\tcall\tlire_ligne
\tmov\trdi, badge
\tmov\trsi, espace
\tcall\tft_strcat
\tmov\trdi, badge
\tmov\trsi, nom
\tcall\tft_strcat
\tmov\trdi, badge
\tcall\tft_strlen
\tmov\tbyte [badge + rax], 10
\tlea\trdx, [rax + 1]
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, badge
\tsyscall
` + EXIT + LIGNE,
      hints: ['Étape 1 : xor ecx, ecx / .fin_dst: cmp byte [rdi + rcx], 0 / je .copie_init / inc rcx / jmp .fin_dst', 'Étape 2 : xor edx, edx puis .copie: mov al, [rsi + rdx] / mov [rdi + rcx], al', 'inc rcx / inc rdx / cmp al, 0 / jne .copie'],
      tests: [{ stdin: 'Ada\nLovelace\n', expect: 'Ada Lovelace\n' }, { stdin: 'Alan\nTuring\n', expect: 'Alan Turing\n' }, { stdin: 'Grace\nHopper\n', expect: 'Grace Hopper\n' }],
      rules: { mustSrc: [{ re: '^\\s*ft_strcat\\s*:', msg: 'Garde l’étiquette ft_strcat:' }] }
    },

    /* ================================================================ CHAPITRE 9 : lire l'entrée */
    {
      id: 'a9_1', ch: 9, ord: 1,
      title: 'Le pèse-lettre',
      scene: 'mail', sceneOpts: { title: 'LA POSTE · PÈSE-LETTRE' },
      story: 'Au bureau de poste, on pèse chaque message en <b>octets</b>. L’appel système <code>read</code> dit justement combien d’octets il a lus.',
      goal: 'Fais l’appel système <code>read(0, buf, 64)</code> : rax = 0, rdi = 0 (stdin), rsi = buf, rdx = 64. Le programme sort avec le nombre d’octets lus (<code>bonjour⏎</code> → <b>8</b>, le retour à la ligne compte !).',
      lesson: '<p><code>read</code> est l’appel système n° <b>0</b>. Il copie jusqu’à rdx octets de l’entrée dans le tampon rsi, puis renvoie dans <code>rax</code> le nombre d’octets <b>vraiment</b> lus (0 = l’entrée est vide).</p>' +
        '<p>Le descripteur <code>0</code> est l’entrée standard (ce que tu tapes dans l’onglet ⌨ Entrée).</p>',
      stdin: 'bonjour\n',
      starter: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\t; TODO : read(0, buf, 64)

\tmov\trdi, rax\t\t\t; octets lus = code de sortie
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\tmov\trax, 0
\tmov\trdi, 0
\tmov\trsi, buf
\tmov\trdx, 64
\tsyscall

\tmov\trdi, rax
\tmov\trax, 60
\tsyscall
`,
      hints: ['mov rax, 0 (read) / mov rdi, 0 (stdin)', 'mov rsi, buf / mov rdx, 64 / syscall'],
      tests: [{ stdin: 'bonjour\n', exit: 8 }, { stdin: 'abc', exit: 3 }, { stdin: '42 Origins\n', exit: 11 }, { stdin: '', exit: 0 }],
      rules: { mustSrc: [{ re: '\\bsyscall\\b[\\s\\S]*\\bsyscall\\b', msg: 'Il faut un syscall pour read (et un pour exit).' }] }
    },

    {
      id: 'a9_2', ch: 9, ord: 2,
      title: 'Le dé du casino',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi'] },
      story: 'Le croupier tape le résultat du dé sur l’entrée. Mais <code>read</code> livre des <b>caractères</b> : \'5\' vaut 53, pas 5 ! Convertis-le.',
      goal: 'Lis <b>1 octet</b> dans <code>buf</code>, convertis le caractère chiffre en nombre et sors avec ce nombre. Entrée <code>5</code> → code de sortie <b>5</b> (et pas 53).',
      lesson: '<p>Les chiffres se suivent dans la table ASCII : <code>\'0\'</code> = 48, <code>\'1\'</code> = 49… <code>\'9\'</code> = 57. Donc valeur = caractère − <code>\'0\'</code>.</p>' +
        '<p><code>movzx rdi, byte [buf]</code> lit l’octet lu et met des 0 dans le reste de rdi.</p>',
      stdin: '5\n',
      starter: `section .bss
\tbuf\tresb 1

section .text
\tglobal\t_start

_start:
\t; TODO 1 : read(0, buf, 1)

\tmovzx\trdi, byte [buf]\t; le caractère lu
\t; TODO 2 : transforme le caractère en nombre
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 1

section .text
\tglobal\t_start

_start:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 1
\tsyscall

\tmovzx\trdi, byte [buf]
\tsub\trdi, '0'
\tmov\trax, 60
\tsyscall
`,
      hints: ['read : rax = 0, rdi = 0, rsi = buf, rdx = 1, syscall', 'sub rdi, \'0\''],
      tests: [{ stdin: '5\n', exit: 5 }, { stdin: '1\n', exit: 1 }, { stdin: '9', exit: 9 }, { stdin: '0\n', exit: 0 }],
      rules: { mustSrc: [{ re: '\\bsub\\b', msg: 'Retire le code de \'0\' avec sub.' }] }
    },

    {
      id: 'a9_3', ch: 9, ord: 3,
      title: 'La grotte à écho',
      scene: 'mail', sceneOpts: { title: 'LA GROTTE À ÉCHO' },
      story: 'Au fond du parc, une grotte répète tout ce qu’on lui crie. Programme l’écho : relis <b>exactement</b> les octets reçus, ni plus ni moins.',
      goal: 'Lis jusqu’à 64 octets dans <code>buf</code>, puis réécris-les avec <code>write</code> en utilisant comme longueur la valeur renvoyée par read. Entrée <code>Ohé !⏎</code> → <code>Ohé !⏎</code>.',
      lesson: '<p>On ne connaît pas la longueur à l’avance : c’est <code>rax</code>, au retour de read, qui la donne. Garde-la dans un registre sûr (rbx) car le write suivant va écraser rax.</p>' +
        '<p>Écrire 64 octets à chaque fois afficherait des octets 0 en trop !</p>',
      stdin: 'Ohé !\n',
      starter: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax\t\t; read(0, buf, 64)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\t; TODO : garde rax, puis write(1, buf, octets lus)
` + EXIT,
      solution: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\tmov\trbx, rax
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, buf
\tmov\trdx, rbx
\tsyscall
` + EXIT,
      hints: ['mov rbx, rax juste après le read.', 'Puis write : rax = 1, rdi = 1, rsi = buf, rdx = rbx, syscall.'],
      tests: [{ stdin: 'Ohé !\n', expect: 'Ohé !\n' }, { stdin: 'Echo echo echo\n', expect: 'Echo echo echo\n' }, { stdin: 'sans fin', expect: 'sans fin' }, { stdin: '', expect: '' }],
      rules: {}
    },

    {
      id: 'a9_4', ch: 9, ord: 4,
      title: 'La calculette de poche',
      scene: 'calc', sceneOpts: { regs: ['rax', 'rdi'] },
      story: 'La calculette de la boutique ne connaît qu’une opération : on tape <code>3+4</code> et elle donne 7. Les deux chiffres sont aux cases 0 et 2 du tampon.',
      goal: 'Après le read, calcule (buf[0] − \'0\') + (buf[2] − \'0\') et sors avec le résultat. <code>3+4</code> → <b>7</b>, <code>9+9</code> → <b>18</b>.',
      lesson: '<p>Le tampon lu est une suite d’octets : <code>3+4⏎</code> donne <code>buf[0] = \'3\'</code>, <code>buf[1] = \'+\'</code>, <code>buf[2] = \'4\'</code>, <code>buf[3] = 10</code>.</p>' +
        '<p>On lit chaque case avec <code>movzx</code>, on convertit, on additionne.</p>',
      stdin: '3+4\n',
      starter: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
\txor\teax, eax\t\t; read(0, buf, 16)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\txor\tedi, edi
\t; TODO : rdi = (buf[0] - '0') + (buf[2] - '0')
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\tmovzx\trdi, byte [buf]
\tsub\trdi, '0'
\tmovzx\trax, byte [buf + 2]
\tsub\trax, '0'
\tadd\trdi, rax
\tmov\trax, 60
\tsyscall
`,
      hints: ['movzx rdi, byte [buf] / sub rdi, \'0\'', 'movzx rax, byte [buf + 2] / sub rax, \'0\'', 'add rdi, rax'],
      tests: [{ stdin: '3+4\n', exit: 7 }, { stdin: '9+9\n', exit: 18 }, { stdin: '0+5', exit: 5 }, { stdin: '8+0\n', exit: 8 }],
      rules: { mustSrc: [{ re: '\\[\\s*buf\\s*\\+\\s*2\\s*\\]', msg: 'Lis le 2e chiffre dans [buf + 2].' }] }
    },

    {
      id: 'a9_5', ch: 9, ord: 5,
      title: 'Le guichet d’accueil',
      scene: 'mail', sceneOpts: { title: 'ACCUEIL 42 ORIGINS' },
      story: 'La borne d’accueil salue chaque visiteur par son prénom. Problème : <code>read</code> livre aussi le <b>retour à la ligne</b> tapé après le prénom, qui casse la phrase.',
      goal: 'Si le dernier octet lu est <code>10</code>, ne le compte pas. Affiche ensuite <code>Bonjour, </code> + le prénom + <code> !⏎</code>. <code>Alice⏎</code> → <code>Bonjour, Alice !⏎</code> ; <code>Bob</code> (sans retour) → <code>Bonjour, Bob !⏎</code>.',
      lesson: '<p>Le dernier octet lu est à <code>[buf + rbx - 1]</code> (rbx = nombre d’octets lus). Si c’est 10, on fait <code>dec rbx</code>.</p>' +
        '<p>Attention : si rien n’a été lu (rbx = 0), il n’y a pas de dernier octet à regarder !</p>',
      stdin: 'Alice\n',
      starter: `section .data
\tdebut\tdb "Bonjour, "
\tdlen\tequ $ - debut
\tfin\tdb " !", 10
\tflen\tequ $ - fin

section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax\t\t; read(0, buf, 64)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\tmov\trbx, rax\t\t\t; rbx = octets lus
\t; TODO : si rbx > 0 et que [buf + rbx - 1] vaut 10, retire 1 à rbx
.affiche:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, debut
\tmov\trdx, dlen
\tsyscall
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, buf
\tmov\trdx, rbx
\tsyscall
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, fin
\tmov\trdx, flen
\tsyscall
` + EXIT,
      solution: `section .data
\tdebut\tdb "Bonjour, "
\tdlen\tequ $ - debut
\tfin\tdb " !", 10
\tflen\tequ $ - fin

section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\tmov\trbx, rax
\tcmp\trbx, 0
\tjle\t.affiche
\tcmp\tbyte [buf + rbx - 1], 10
\tjne\t.affiche
\tdec\trbx
.affiche:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, debut
\tmov\trdx, dlen
\tsyscall
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, buf
\tmov\trdx, rbx
\tsyscall
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, fin
\tmov\trdx, flen
\tsyscall
` + EXIT,
      hints: ['cmp rbx, 0 / jle .affiche', 'cmp byte [buf + rbx - 1], 10 / jne .affiche', 'dec rbx'],
      tests: [{ stdin: 'Alice\n', expect: 'Bonjour, Alice !\n' }, { stdin: 'Bob', expect: 'Bonjour, Bob !\n' }, { stdin: 'Marie-Claire\n', expect: 'Bonjour, Marie-Claire !\n' }, { stdin: '', expect: 'Bonjour,  !\n' }],
      rules: {}
    },

    {
      id: 'a9_6', ch: 9, ord: 6,
      title: 'Le compteur de la photocopieuse',
      story: 'Le compteur de la photocopieuse n’a qu’un <b>tout petit tampon de 8 octets</b>. Pour mesurer un long texte, il faut appeler <code>read</code> en boucle jusqu’à ce qu’il renvoie 0.',
      goal: 'Lis l’entrée par paquets de 8 octets (<code>read(0, buf, 8)</code>) jusqu’à la fin (rax = 0), additionne les octets lus dans rbx et sors avec le total. <code>Bonjour tout le monde !⏎</code> → <b>24</b>.',
      lesson: '<p><code>read</code> ne lit <b>jamais plus</b> que rdx octets : avec un petit tampon, chaque appel donne un morceau, et le suivant reprend où le précédent s’est arrêté.</p>' +
        '<p>Quand il n’y a plus rien, read renvoie <b>0</b> (fin de l’entrée) ; un nombre négatif signale une erreur. Dans les deux cas on s’arrête : <code>cmp rax, 0</code> / <code>jle .fin</code>.</p>',
      stdin: 'Bonjour tout le monde !\n',
      starter: `section .bss
\tbuf\tresb 8

section .text
\tglobal\t_start

_start:
\txor\tebx, ebx\t\t\t; rbx = total
\t; TODO : recommence ce read tant qu'il renvoie plus que 0
\txor\teax, eax\t\t; read(0, buf, 8)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 8
\tsyscall
\tadd\trbx, rax
.fin:
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 8

section .text
\tglobal\t_start

_start:
\txor\tebx, ebx
.lire:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 8
\tsyscall
\tcmp\trax, 0
\tjle\t.fin
\tadd\trbx, rax
\tjmp\t.lire
.fin:
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      hints: ['Mets une étiquette .lire: avant le read.', 'Après syscall : cmp rax, 0 / jle .fin', 'add rbx, rax / jmp .lire'],
      tests: [{ stdin: 'Bonjour tout le monde !\n', exit: 24 }, { stdin: 'abc', exit: 3 }, { stdin: '', exit: 0 }, { stdin: 'ligne 1\nligne 2\nligne 3\n', exit: 24 }],
      rules: { mustSrc: [{ re: 'mov\\s+edx\\s*,\\s*8\\b|mov\\s+rdx\\s*,\\s*8\\b', msg: 'Garde le petit tampon : read de 8 octets.' }], forbidSrc: [{ re: 'resb\\s+(9|[1-9]\\d+)', msg: 'Le tampon doit rester à 8 octets.' }] }
    },

    {
      id: 'a9_7', ch: 9, ord: 7,
      title: 'Le tapis roulant',
      scene: 'conveyor', sceneOpts: {},
      story: 'À la cantine, les plateaux défilent sur un tapis : <b>une ligne = un plateau</b>. Compte les plateaux en comptant les retours à la ligne de toute l’entrée.',
      goal: 'Lis l’entrée par paquets de 16 octets jusqu’à la fin ; dans chaque paquet, compte les octets égaux à <code>10</code>. Sors avec le nombre de lignes. <code>soupe⏎frites⏎salade⏎</code> → <b>3</b>.',
      lesson: '<p>Deux boucles imbriquées : la grande lit un paquet (read), la petite parcourt les <b>rax</b> octets du paquet.</p>' +
        '<p>⚠ syscall écrase <code>rcx</code> : on peut l’utiliser comme indice dans la petite boucle (il n’y a pas de syscall dedans), mais le nombre d’octets lus et le total doivent vivre dans des registres sûrs (r12, rbx).</p>',
      stdin: 'soupe\nfrites\nsalade\n',
      starter: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
\txor\tebx, ebx\t\t\t; rbx = nombre de lignes
.lire:
\txor\teax, eax\t\t; read(0, buf, 16)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\tcmp\trax, 0
\tjle\t.fin
\tmov\tr12, rax\t\t\t; r12 = octets dans ce paquet
\t; TODO : parcours buf[0] … buf[r12 - 1] et ajoute 1 à rbx pour chaque 10
\tjmp\t.lire
.fin:
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
\txor\tebx, ebx
.lire:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\tcmp\trax, 0
\tjle\t.fin
\tmov\tr12, rax
\txor\tecx, ecx
.paquet:
\tcmp\trcx, r12
\tjge\t.lire
\tcmp\tbyte [buf + rcx], 10
\tjne\t.suivant
\tinc\trbx
.suivant:
\tinc\trcx
\tjmp\t.paquet
.fin:
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      hints: ['xor ecx, ecx puis .paquet: cmp rcx, r12 / jge .lire', 'cmp byte [buf + rcx], 10 / jne .suivant / inc rbx', '.suivant: inc rcx / jmp .paquet'],
      tests: [{ stdin: 'soupe\nfrites\nsalade\n', exit: 3 }, { stdin: '', exit: 0 }, { stdin: 'une seule ligne sans retour', exit: 0 }, { stdin: 'plateau numero un\nplateau numero deux\n\n', exit: 3 }],
      rules: { mustSrc: [{ re: 'mov\\s+edx\\s*,\\s*16\\b|mov\\s+rdx\\s*,\\s*16\\b', msg: 'Garde le read de 16 octets.' }] }
    },

    {
      id: 'a9_8', ch: 9, ord: 8,
      title: 'Le crieur public',
      scene: 'mail', sceneOpts: { title: 'LE CRIEUR PUBLIC' },
      story: 'Le crieur public du marché répète les annonces… en CRIANT. Il lit l’entrée par petits paquets, met chaque paquet en majuscules et le réécrit aussitôt.',
      goal: 'Boucle : <code>read(0, buf, 16)</code> ; si rax ≤ 0 c’est fini ; sinon mets en majuscules les rax octets de buf puis <code>write(1, buf, rax)</code>. <code>oyez oyez !⏎</code> → <code>OYEZ OYEZ !⏎</code>.',
      lesson: '<p>C’est le principe des « filtres » Unix (comme <code>tr a-z A-Z</code>) : lire un morceau, le transformer, l’écrire, recommencer. Le programme marche quelle que soit la longueur de l’entrée, même avec un petit tampon.</p>' +
        '<p>Garde le nombre d’octets lus dans <b>rbx</b> : rax et rcx sont écrasés par les syscall.</p>',
      stdin: 'oyez oyez !\n',
      starter: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
.lire:
\txor\teax, eax\t\t; read(0, buf, 16)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\tcmp\trax, 0
\tjle\t.fin
\tmov\trbx, rax\t\t\t; rbx = octets lus
\t; TODO 1 : mets en majuscules buf[0] … buf[rbx - 1]
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, buf
\tmov\trdx, rbx
\tsyscall
\t; TODO 2 : recommence la lecture
.fin:
` + EXIT,
      solution: `section .bss
\tbuf\tresb 16

section .text
\tglobal\t_start

_start:
.lire:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 16
\tsyscall
\tcmp\trax, 0
\tjle\t.fin
\tmov\trbx, rax
\txor\tecx, ecx
.maj:
\tcmp\trcx, rbx
\tjge\t.ecrire
\tmov\tal, [buf + rcx]
\tcmp\tal, 'a'
\tjb\t.suivant
\tcmp\tal, 'z'
\tja\t.suivant
\tsub\tal, 32
\tmov\t[buf + rcx], al
.suivant:
\tinc\trcx
\tjmp\t.maj
.ecrire:
\tmov\trax, 1
\tmov\trdi, 1
\tmov\trsi, buf
\tmov\trdx, rbx
\tsyscall
\tjmp\t.lire
.fin:
` + EXIT,
      hints: ['Petite boucle .maj avec rcx de 0 à rbx - 1 (cmp rcx, rbx / jge .ecrire).', 'mov al, [buf + rcx] ; si \'a\' ≤ al ≤ \'z\' : sub al, 32 / mov [buf + rcx], al', 'Après le write : jmp .lire'],
      tests: [{ stdin: 'oyez oyez !\n', expect: 'OYEZ OYEZ !\n' }, { stdin: 'le marche ouvre a 8h, venez nombreux !\n', expect: 'LE MARCHE OUVRE A 8H, VENEZ NOMBREUX !\n' }, { stdin: 'oui\nnon\n', expect: 'OUI\nNON\n' }, { stdin: '', expect: '' }],
      rules: { mustSrc: [{ re: 'mov\\s+edx\\s*,\\s*16\\b|mov\\s+rdx\\s*,\\s*16\\b', msg: 'Garde le read de 16 octets.' }] }
    },

    {
      id: 'a9_9', ch: 9, ord: 9,
      title: 'La caisse du marché',
      scene: 'calc', sceneOpts: { regs: ['rbx', 'r12', 'rcx'] },
      story: 'La caisse du marché reçoit les prix d’un panier sur une ligne : <code>12 30 7</code>. Il faut <b>convertir</b> chaque nombre tapé et faire le total.',
      goal: 'Après le read, parcours les octets lus : chaque chiffre fait <code>nombre = nombre × 10 + chiffre</code> ; tout autre caractère termine le nombre en cours, qu’on ajoute au total. Sors avec le total : <code>12 30 7</code> → <b>49</b>.',
      lesson: '<p>Lire un nombre à plusieurs chiffres : on part de 0 et, pour chaque chiffre, on décale d’un rang (× 10) avant d’ajouter le nouveau chiffre : 1 → 12 → 123.</p>' +
        '<p>Astuce : après <code>sub eax, \'0\'</code>, un seul test non signé <code>cmp eax, 9</code> / <code>ja</code> détecte tout ce qui n’est pas un chiffre. N’oublie pas d’ajouter le <b>dernier</b> nombre quand les octets sont épuisés.</p>',
      stdin: '12 30 7\n',
      starter: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax\t\t; read(0, buf, 64)
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\tmov\tr13, rax\t\t\t; r13 = octets lus
\txor\tebx, ebx\t\t\t; rbx = total
\txor\tr12, r12\t\t\t; r12 = nombre en cours
\txor\tecx, ecx\t\t\t; rcx = indice
\t; TODO : parcours buf[0] … buf[r13 - 1], convertis et additionne
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      solution: `section .bss
\tbuf\tresb 64

section .text
\tglobal\t_start

_start:
\txor\teax, eax
\txor\tedi, edi
\tmov\trsi, buf
\tmov\tedx, 64
\tsyscall
\tmov\tr13, rax
\txor\tebx, ebx
\txor\tr12, r12
\txor\tecx, ecx
.boucle:
\tcmp\trcx, r13
\tjge\t.dernier
\tmovzx\teax, byte [buf + rcx]
\tinc\trcx
\tsub\teax, '0'
\tcmp\teax, 9
\tja\t.separateur
\timul\tr12, r12, 10
\tadd\tr12, rax
\tjmp\t.boucle
.separateur:
\tadd\trbx, r12
\txor\tr12, r12
\tjmp\t.boucle
.dernier:
\tadd\trbx, r12
\tmov\trdi, rbx
\tmov\trax, 60
\tsyscall
`,
      hints: ['.boucle: cmp rcx, r13 / jge .dernier, puis movzx eax, byte [buf + rcx] / inc rcx', 'sub eax, \'0\' / cmp eax, 9 / ja .separateur ; sinon imul r12, r12, 10 / add r12, rax', '.separateur: add rbx, r12 / xor r12, r12 ; et à .dernier : add rbx, r12 avant de sortir.'],
      tests: [{ stdin: '12 30 7\n', exit: 49 }, { stdin: '100 100 55', exit: 255 }, { stdin: '5\n', exit: 5 }, { stdin: '', exit: 0 }],
      rules: { mustSrc: [{ re: '\\b(imul|mul)\\b', msg: 'Il faut multiplier par 10 pour convertir les nombres.' }] }
    },

    /* ================================================================ CHAPITRE 10 : la libc et malloc */
    {
      id: 'a10_1', ch: 10, ord: 1,
      title: 'Bienvenue dans la libc',
      story: 'Fini le <code>_start</code> : ton programme commence maintenant à <code>main</code>, appelée par la <b>libc</b>, la bibliothèque standard du C. Premier essai : <code>puts</code>.',
      goal: 'Dans <code>main</code> : aligne la pile, appelle <code>puts(msg)</code>, rends la pile, puis renvoie <b>42</b> (eax = 42 avant <code>ret</code>). Sortie : <code>Bienvenue dans la libc !⏎</code>.',
      lesson: '<p><code>main</code> est une fonction : elle se termine par <code>ret</code>, et <code>eax</code> devient le code de sortie. <code>puts(s)</code> affiche la chaîne rdi (terminée par 0) puis un retour à la ligne.</p>' +
        '<p>Règle de la libc : au moment d’un <code>call</code>, <b>rsp doit être un multiple de 16</b>. En entrant dans main, l’adresse de retour (8 octets) l’a décalé : un <code>push rbx</code> (ou <code>sub rsp, 8</code>) le réaligne. À rendre avant ret !</p>',
      starter: `extern\tputs

section .data
\tmsg\tdb "Bienvenue dans la libc !", 0

section .text
\tglobal\tmain

main:
\t; TODO 1 : aligne la pile (push rbx)
\t; TODO 2 : rdi = msg, puis call puts
\t; TODO 3 : rends la pile (pop rbx)
\txor\teax, eax\t\t\t; TODO 4 : renvoie 42
\tret
`,
      solution: `extern\tputs

section .data
\tmsg\tdb "Bienvenue dans la libc !", 0

section .text
\tglobal\tmain

main:
\tpush\trbx
\tmov\trdi, msg
\tcall\tputs
\tpop\trbx
\tmov\teax, 42
\tret
`,
      hints: ['push rbx en premier : la pile est maintenant alignée.', 'mov rdi, msg / call puts', 'pop rbx / mov eax, 42 / ret'],
      tests: [{ expect: 'Bienvenue dans la libc !\n', exit: 42 }],
      rules: { mustCall: ['puts'], noWarnings: ALIGN }
    },

    {
      id: 'a10_2', ch: 10, ord: 2,
      title: 'Le panneau du bus',
      story: 'Le panneau du bus 42 annonce les places libres. Avec <code>printf</code>, plus besoin de convertir les nombres à la main : <code>%d</code> s’en charge.',
      goal: 'Appelle <code>printf(fmt, n)</code> avec n = le nombre lu : rdi = format, rsi = n, <b>eax = 0</b>. Entrée <code>12</code> → <code>Il reste 12 places dans le bus 42.⏎</code>.',
      lesson: '<p><code>printf</code> reçoit le format dans <code>rdi</code>, puis les valeurs dans <code>rsi</code>, <code>rdx</code>, <code>rcx</code>, <code>r8</code>, <code>r9</code>.</p>' +
        '<p>printf est une fonction « variadique » : <code>al</code> doit contenir le nombre de registres flottants utilisés, donc <code>xor eax, eax</code> juste avant le call.</p>' +
        '<p>⚠ Ne mélange pas printf et l’appel système write : printf garde le texte dans un tampon, qui n’est vidé qu’à la fin.</p>',
      stdin: '12\n',
      starter: `extern\tprintf

section .data
\tfmt\tdb "Il reste %d places dans le bus 42.", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx\t\t\t\t; aligne la pile sur 16
\tcall\tlire_nombre\t\t; rax = places libres
\t; TODO : printf(fmt, rax)
\tpop\trbx
\txor\teax, eax\t\t\t; return (0)
\tret
` + NOMBRE,
      solution: `extern\tprintf

section .data
\tfmt\tdb "Il reste %d places dans le bus 42.", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tcall\tlire_nombre
\tmov\trsi, rax
\tmov\trdi, fmt
\txor\teax, eax
\tcall\tprintf
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      hints: ['D’abord mov rsi, rax (avant d’écraser rax !).', 'mov rdi, fmt / xor eax, eax / call printf'],
      tests: [{ stdin: '12\n', expect: 'Il reste 12 places dans le bus 42.\n', exit: 0 }, { stdin: '0\n', expect: 'Il reste 0 places dans le bus 42.\n', exit: 0 }, { stdin: '57\n', expect: 'Il reste 57 places dans le bus 42.\n', exit: 0 }],
      rules: { mustCall: ['printf'], noWarnings: /pile non align|al doit contenir/ }
    },

    {
      id: 'a10_3', ch: 10, ord: 3,
      title: 'La machine à badges',
      story: 'La machine à badges imprime le prénom et l’année de promo de chaque nouvel étudiant. Deux valeurs pour printf : une <b>chaîne</b> (<code>%s</code>) et un <b>nombre</b> (<code>%d</code>).',
      goal: 'Appelle <code>printf(fmt, nom, annee)</code> : rdi = fmt, rsi = <b>adresse</b> de nom, rdx = l’année lue. Entrée <code>Ada⏎2024⏎</code> → <code>Badge : Ada, promo 2024⏎</code>.',
      lesson: '<p>Pour <code>%s</code>, printf attend l’<b>adresse</b> de la chaîne (<code>mov rsi, nom</code>), pas son contenu.</p>' +
        '<p>Les arguments se rangent dans l’ordre : 1er rdi, 2e rsi, 3e rdx. Range rdx avant de réutiliser rax.</p>',
      stdin: 'Ada\n2024\n',
      starter: `extern\tprintf

section .data
\tfmt\tdb "Badge : %s, promo %d", 10, 0

section .bss
\tcar\tresb 1
\tnom\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx
\tmov\trdi, nom
\tcall\tlire_ligne\t\t; nom = le prénom
\tcall\tlire_nombre\t\t; rax = l'année
\t; TODO : printf(fmt, nom, rax)
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE + LIGNE,
      solution: `extern\tprintf

section .data
\tfmt\tdb "Badge : %s, promo %d", 10, 0

section .bss
\tcar\tresb 1
\tnom\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx
\tmov\trdi, nom
\tcall\tlire_ligne
\tcall\tlire_nombre
\tmov\trdx, rax
\tmov\trsi, nom
\tmov\trdi, fmt
\txor\teax, eax
\tcall\tprintf
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE + LIGNE,
      hints: ['mov rdx, rax (l’année, 3e argument)', 'mov rsi, nom (l’adresse du prénom, 2e argument)', 'mov rdi, fmt / xor eax, eax / call printf'],
      tests: [{ stdin: 'Ada\n2024\n', expect: 'Badge : Ada, promo 2024\n', exit: 0 }, { stdin: 'Linus\n1991\n', expect: 'Badge : Linus, promo 1991\n', exit: 0 }, { stdin: 'Zoe\n42\n', expect: 'Badge : Zoe, promo 42\n', exit: 0 }],
      rules: { mustCall: ['printf'], noWarnings: /pile non align|al doit contenir/ }
    },

    {
      id: 'a10_4', ch: 10, ord: 4,
      title: 'La table de multiplication',
      story: 'L’école primaire voisine veut ses tables de multiplication imprimées. Une boucle qui appelle <code>printf</code>… attention, printf <b>abîme</b> plusieurs registres !',
      goal: 'Lis la table t et la limite m, puis affiche <code>t x i = t×i⏎</code> pour i de 1 à m avec printf. Entrée <code>7 3</code> → <code>7 x 1 = 7⏎7 x 2 = 14⏎7 x 3 = 21⏎</code>.',
      lesson: '<p>Une fonction de la libc a le droit d’écraser rax, rcx, rdx, rsi, rdi, r8–r11. Le compteur de boucle et les valeurs à garder doivent donc vivre dans <b>rbx, r12–r15</b>, que main sauvegarde (push) au début et restaure (pop) à la fin.</p>' +
        '<p>3 push dans main : 8 (adresse de retour) + 3 × 8 = 32, un multiple de 16 → la pile est alignée.</p>' +
        '<p>⚠ Le visualiseur ne simule pas cet écrasement : un compteur dans rcx semble marcher ici, mais planterait en vrai.</p>',
      stdin: '7 3\n',
      starter: `extern\tprintf

section .data
\tfmt\tdb "%d x %d = %d", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13\t\t\t\t; 3 push : la pile est alignée sur 16
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; r12 = la table
\tcall\tlire_nombre
\tmov\tr13, rax\t\t\t; r13 = la limite
\tmov\trbx, 1\t\t\t; rbx = i
.ligne:
\t; TODO : tant que rbx <= r13 : printf(fmt, r12, rbx, r12 × rbx), puis rbx++
.fin:
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      solution: `extern\tprintf

section .data
\tfmt\tdb "%d x %d = %d", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax
\tcall\tlire_nombre
\tmov\tr13, rax
\tmov\trbx, 1
.ligne:
\tcmp\trbx, r13
\tjg\t.fin
\tmov\trdi, fmt
\tmov\trsi, r12
\tmov\trdx, rbx
\tmov\trcx, r12
\timul\trcx, rbx
\txor\teax, eax
\tcall\tprintf
\tinc\trbx
\tjmp\t.ligne
.fin:
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      hints: ['cmp rbx, r13 / jg .fin', 'rdi = fmt, rsi = r12, rdx = rbx, rcx = r12 × rbx (mov rcx, r12 / imul rcx, rbx)', 'xor eax, eax / call printf / inc rbx / jmp .ligne'],
      tests: [{ stdin: '7 3\n', expect: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n', exit: 0 }, { stdin: '9 5\n', expect: '9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45\n', exit: 0 }, { stdin: '2 1\n', expect: '2 x 1 = 2\n', exit: 0 }, { stdin: '6 0\n', expect: '', exit: 0 }],
      rules: { mustCall: ['printf'], noWarnings: /pile non align|al doit contenir/ }
    },

    {
      id: 'a10_5', ch: 10, ord: 5,
      title: 'La boulangerie du tas',
      scene: 'bakery', sceneOpts: { title: 'BOULANGERIE DU TAS', cap: 'Chaque baguette est un bloc obtenu avec call malloc' },
      story: 'Le boulanger fabrique des baguettes de longueur variable : il réserve un bloc sur le <b>tas</b> avec <code>malloc</code>, le remplit de <code>#</code>, l’affiche… et surtout le <b>libère</b>.',
      goal: 'Remplis les n octets du bloc avec <code>#</code> puis un 0 final, et libère le bloc avec <code>free</code> après l’affichage. Entrée <code>5</code> → <code>#####⏎</code>. <b>Aucune fuite.</b>',
      lesson: '<p><code>call malloc</code> : taille dans <code>rdi</code>, adresse du bloc dans <code>rax</code>. On la garde dans rbx, qui survit aux appels.</p>' +
        '<p>Le bloc contient n’importe quoi au départ : il faut l’écrire avant de l’afficher, sans oublier le 0 final (d’où <code>n + 1</code> octets).</p>' +
        '<p><code>call free</code> avec l’adresse dans rdi rend le bloc. Un bloc jamais libéré est une <b>fuite mémoire</b>.</p>',
      stdin: '5\n',
      starter: `extern\tmalloc
extern\tfree
extern\tputs

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; r12 = n
\tlea\trdi, [r12 + 1]\t\t; n + 1 octets (pour le 0 final)
\tcall\tmalloc
\tmov\trbx, rax\t\t\t; rbx = adresse du bloc
\t; TODO 1 : écris n fois '#' dans [rbx + rcx], puis un 0 final
\tmov\trdi, rbx
\tcall\tputs
\t; TODO 2 : libère le bloc
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      solution: `extern\tmalloc
extern\tfree
extern\tputs

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax
\tlea\trdi, [r12 + 1]
\tcall\tmalloc
\tmov\trbx, rax
\txor\tecx, ecx
.remplit:
\tcmp\trcx, r12
\tjge\t.fini
\tmov\tbyte [rbx + rcx], '#'
\tinc\trcx
\tjmp\t.remplit
.fini:
\tmov\tbyte [rbx + rcx], 0
\tmov\trdi, rbx
\tcall\tputs
\tmov\trdi, rbx
\tcall\tfree
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      hints: ['xor ecx, ecx puis .remplit: cmp rcx, r12 / jge .fini / mov byte [rbx + rcx], \'#\' / inc rcx / jmp .remplit', '.fini: mov byte [rbx + rcx], 0', 'Après puts : mov rdi, rbx / call free'],
      tests: [{ stdin: '5\n', expect: '#####\n', exit: 0 }, { stdin: '1\n', expect: '#\n', exit: 0 }, { stdin: '0\n', expect: '\n', exit: 0 }, { stdin: '30\n', expect: '##############################\n', exit: 0 }],
      rules: { mustCall: ['malloc', 'free'], noLeaks: true, noWarnings: ALIGN }
    },

    {
      id: 'a10_6', ch: 10, ord: 6,
      title: 'Les carrés du potager',
      scene: 'bakery', sceneOpts: { title: 'TABLEAU SUR LE TAS', cap: 'Un tableau de n cases de 8 octets' },
      story: 'Le potager compte n parcelles carrées de côtés 1, 2, 3… Range leurs surfaces dans un <b>tableau sur le tas</b>, puis fais le total.',
      goal: 'Le bloc de n × 8 octets est réservé. Remplis la case i avec (i + 1)² (<code>mov [rbx + rcx*8], rax</code>), puis additionne toutes les cases dans r13, et libère le tableau. Entrée <code>3</code> → <code>Total : 14⏎</code> (1 + 4 + 9).',
      lesson: '<p>Un tableau de nombres de 64 bits : chaque case fait <b>8 octets</b>. La case i est à l’adresse <code>rbx + i × 8</code>, ce qui s’écrit directement <code>[rbx + rcx*8]</code> (échelle 1, 2, 4 ou 8).</p>' +
        '<p>Le tableau n’existe que pendant que le bloc est alloué : après <code>free</code>, on ne doit plus y toucher.</p>',
      stdin: '3\n',
      starter: `extern\tmalloc
extern\tfree
extern\tprintf

section .data
\tfmt\tdb "Total : %d", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax\t\t\t; r12 = n (au moins 1)
\tmov\trdi, r12
\tshl\trdi, 3\t\t\t; n × 8 octets
\tcall\tmalloc
\tmov\trbx, rax\t\t\t; rbx = le tableau
\t; TODO 1 : pour rcx de 0 à n - 1 : case rcx = (rcx + 1)²
\txor\tr13, r13\t\t\t; r13 = total
\t; TODO 2 : additionne toutes les cases dans r13
\tmov\trdi, fmt
\tmov\trsi, r13
\txor\teax, eax
\tcall\tprintf
\t; TODO 3 : libère le tableau
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      solution: `extern\tmalloc
extern\tfree
extern\tprintf

section .data
\tfmt\tdb "Total : %d", 10, 0

section .bss
\tcar\tresb 1

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax
\tmov\trdi, r12
\tshl\trdi, 3
\tcall\tmalloc
\tmov\trbx, rax
\txor\tecx, ecx
.remplit:
\tcmp\trcx, r12
\tjge\t.somme_init
\tlea\trax, [rcx + 1]
\timul\trax, rax
\tmov\t[rbx + rcx*8], rax
\tinc\trcx
\tjmp\t.remplit
.somme_init:
\txor\tr13, r13
\txor\tecx, ecx
.somme:
\tcmp\trcx, r12
\tjge\t.affiche
\tadd\tr13, [rbx + rcx*8]
\tinc\trcx
\tjmp\t.somme
.affiche:
\tmov\trdi, fmt
\tmov\trsi, r13
\txor\teax, eax
\tcall\tprintf
\tmov\trdi, rbx
\tcall\tfree
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE,
      hints: ['Remplissage : lea rax, [rcx + 1] / imul rax, rax / mov [rbx + rcx*8], rax', 'Somme : add r13, [rbx + rcx*8] dans une 2e boucle (remets rcx à 0).', 'À la fin : mov rdi, rbx / call free'],
      tests: [{ stdin: '3\n', expect: 'Total : 14\n', exit: 0 }, { stdin: '5\n', expect: 'Total : 55\n', exit: 0 }, { stdin: '1\n', expect: 'Total : 1\n', exit: 0 }, { stdin: '10\n', expect: 'Total : 385\n', exit: 0 }],
      rules: { mustCall: ['malloc', 'free', 'printf'], noLeaks: true, noWarnings: ALIGN, mustSrc: [{ re: '\\[\\s*rbx\\s*\\+\\s*rcx\\s*\\*\\s*8\\s*\\]', msg: 'Utilise le tableau : [rbx + rcx*8].' }] }
    },

    {
      id: 'a10_7', ch: 10, ord: 7,
      title: 'Le miroir à la demande',
      scene: 'bakery', sceneOpts: { title: 'ATELIER DES MIROIRS', cap: 'Le reflet est fabriqué sur le tas' },
      story: 'Le palais des glaces fabrique maintenant ses reflets <b>sur mesure</b> : la taille du bloc dépend du mot. On mesure avec <code>strlen</code> de la libc, on réserve, on copie à l’envers.',
      goal: 'Dans le bloc de longueur + 1 octets, copie <code>ligne</code> à l’envers puis ajoute le 0 final. Le programme l’affiche avec puts et le libère. <code>bonjour</code> → <code>ruojnob⏎</code>. <b>Aucune fuite.</b>',
      lesson: '<p><code>call strlen</code> (libc) : chaîne dans rdi, longueur dans rax. On peut appeler la libc pour les outils courants et garder nos forces pour le reste.</p>' +
        '<p>Copie à l’envers : <code>bloc[i] = ligne[n − 1 − i]</code>. Le 0 final va dans <code>bloc[n]</code>.</p>',
      stdin: 'bonjour\n',
      starter: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrlen

section .bss
\tligne\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tmov\trdi, ligne
\tcall\tlire_ligne
\tmov\trdi, ligne
\tcall\tstrlen
\tmov\tr12, rax\t\t\t; r12 = n
\tlea\trdi, [r12 + 1]
\tcall\tmalloc
\tmov\trbx, rax\t\t\t; rbx = le reflet
\t; TODO : rbx[i] = ligne[n - 1 - i] pour i de 0 à n - 1, puis rbx[n] = 0
\tmov\trdi, rbx
\tcall\tputs
\tmov\trdi, rbx
\tcall\tfree
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + LIGNE,
      solution: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrlen

section .bss
\tligne\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tmov\trdi, ligne
\tcall\tlire_ligne
\tmov\trdi, ligne
\tcall\tstrlen
\tmov\tr12, rax
\tlea\trdi, [r12 + 1]
\tcall\tmalloc
\tmov\trbx, rax
\txor\tecx, ecx
.copie:
\tcmp\trcx, r12
\tjge\t.fini
\tmov\trdx, r12
\tsub\trdx, rcx
\tmov\tal, [ligne + rdx - 1]
\tmov\t[rbx + rcx], al
\tinc\trcx
\tjmp\t.copie
.fini:
\tmov\tbyte [rbx + r12], 0
\tmov\trdi, rbx
\tcall\tputs
\tmov\trdi, rbx
\tcall\tfree
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + LIGNE,
      hints: ['Boucle avec rcx de 0 à r12 - 1 (cmp rcx, r12 / jge .fini).', 'mov rdx, r12 / sub rdx, rcx / mov al, [ligne + rdx - 1] / mov [rbx + rcx], al', '.fini: mov byte [rbx + r12], 0'],
      tests: [{ stdin: 'bonjour\n', expect: 'ruojnob\n', exit: 0 }, { stdin: 'Ici 42\n', expect: '24 icI\n', exit: 0 }, { stdin: 'x\n', expect: 'x\n', exit: 0 }, { stdin: '\n', expect: '\n', exit: 0 }],
      rules: { mustCall: ['malloc', 'free', 'strlen'], noLeaks: true, noWarnings: ALIGN }
    },

    {
      id: 'a10_8', ch: 10, ord: 8,
      title: 'Les mots-valises',
      scene: 'bakery', sceneOpts: { title: 'FABRIQUE DE MOTS-VALISES', cap: 'ft_strjoin réserve un bloc pour les deux mots' },
      story: 'L’atelier d’écriture colle deux mots pour en inventer un nouveau : porte + manteau = portemanteau. Écris <code>ft_strjoin(s1, s2)</code>, qui renvoie une <b>nouvelle</b> chaîne sur le tas.',
      goal: 'Complète <code>ft_strjoin</code> : après le <code>malloc(len1 + len2 + 1)</code> fourni, copie s1 puis s2 (0 final compris) dans le bloc et renvoie son adresse dans rax. <code>porte⏎manteau⏎</code> → <code>portemanteau⏎</code>. <b>Aucune fuite.</b>',
      lesson: '<p>Dans ft_strjoin, s1, s2 et len1 doivent survivre aux appels à strlen et malloc : on les range dans rbx, r12, r13, sauvegardés par des push au début et restaurés à la fin.</p>' +
        '<p>Alignement : main est alignée, le <code>call ft_strjoin</code> empile 8 octets, puis 3 push en ajoutent 24 : total 32, un multiple de 16. ✔</p>' +
        '<p>Pour la 2e copie, une astuce : <code>lea rdi, [rax + r13]</code> donne l’adresse où commence la place de s2.</p>',
      stdin: 'porte\nmanteau\n',
      starter: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrlen

section .bss
\tmot1\tresb 64
\tmot2\tresb 64

section .text
\tglobal\tmain

; ft_strjoin(s1, s2) : nouvelle chaîne s1 + s2 sur le tas
ft_strjoin:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tmov\trbx, rdi\t\t\t; rbx = s1
\tmov\tr12, rsi\t\t\t; r12 = s2
\tcall\tstrlen
\tmov\tr13, rax\t\t\t; r13 = len1
\tmov\trdi, r12
\tcall\tstrlen\t\t\t; rax = len2
\tlea\trdi, [r13 + rax + 1]
\tcall\tmalloc\t\t\t; rax = le nouveau bloc
\t; TODO 1 : copie s1 (sans son 0) au début du bloc
\t; TODO 2 : copie s2 (avec son 0) juste après
\tpop\tr13
\tpop\tr12
\tpop\trbx
\tret

main:
\tpush\trbx
\tmov\trdi, mot1
\tcall\tlire_ligne
\tmov\trdi, mot2
\tcall\tlire_ligne
\tmov\trdi, mot1
\tmov\trsi, mot2
\tcall\tft_strjoin
\tmov\trbx, rax
\tmov\trdi, rbx
\tcall\tputs
\tmov\trdi, rbx
\tcall\tfree
\tpop\trbx
\txor\teax, eax
\tret
` + LIGNE,
      solution: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrlen

section .bss
\tmot1\tresb 64
\tmot2\tresb 64

section .text
\tglobal\tmain

ft_strjoin:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tmov\trbx, rdi
\tmov\tr12, rsi
\tcall\tstrlen
\tmov\tr13, rax
\tmov\trdi, r12
\tcall\tstrlen
\tlea\trdi, [r13 + rax + 1]
\tcall\tmalloc
\ttest\trax, rax
\tjz\t.fin
\txor\tecx, ecx
.copie1:
\tcmp\trcx, r13
\tjge\t.suite
\tmov\tdl, [rbx + rcx]
\tmov\t[rax + rcx], dl
\tinc\trcx
\tjmp\t.copie1
.suite:
\tlea\trdi, [rax + r13]
\txor\tecx, ecx
.copie2:
\tmov\tdl, [r12 + rcx]
\tmov\t[rdi + rcx], dl
\tinc\trcx
\tcmp\tdl, 0
\tjne\t.copie2
.fin:
\tpop\tr13
\tpop\tr12
\tpop\trbx
\tret

main:
\tpush\trbx
\tmov\trdi, mot1
\tcall\tlire_ligne
\tmov\trdi, mot2
\tcall\tlire_ligne
\tmov\trdi, mot1
\tmov\trsi, mot2
\tcall\tft_strjoin
\tmov\trbx, rax
\tmov\trdi, rbx
\tcall\tputs
\tmov\trdi, rbx
\tcall\tfree
\tpop\trbx
\txor\teax, eax
\tret
` + LIGNE,
      hints: ['Copie 1 : rcx de 0 à r13 - 1 : mov dl, [rbx + rcx] / mov [rax + rcx], dl', 'Copie 2 : lea rdi, [rax + r13], puis copie [r12 + rcx] vers [rdi + rcx] jusqu’au 0 compris.', 'rax doit encore contenir l’adresse du bloc au ret : n’utilise pas al pour copier !'],
      tests: [{ stdin: 'porte\nmanteau\n', expect: 'portemanteau\n', exit: 0 }, { stdin: 'tire\nbouchon\n', expect: 'tirebouchon\n', exit: 0 }, { stdin: 'abc\n\n', expect: 'abc\n', exit: 0 }, { stdin: '\nseul\n', expect: 'seul\n', exit: 0 }],
      rules: { mustCall: ['malloc', 'free'], noLeaks: true, noWarnings: ALIGN, forbidCall: ['strcpy', 'strdup'], mustSrc: [{ re: '^\\s*ft_strjoin\\s*:', msg: 'Garde l’étiquette ft_strjoin:' }] }
    },

    {
      id: 'a10_9', ch: 10, ord: 9,
      title: 'Le registre des inscriptions',
      scene: 'bakery', sceneOpts: { title: 'REGISTRE DES INSCRIPTIONS', cap: 'Un tableau de pointeurs + un bloc par prénom' },
      story: 'Le secrétariat range les inscrits dans un <b>tableau de pointeurs</b> sur le tas : chaque case pointe vers une copie (<code>strdup</code>) d’un prénom. Il faut les afficher du dernier au premier… puis tout rendre.',
      goal: 'Les n prénoms sont déjà copiés. Affiche-les dans l’ordre <b>inverse</b> avec puts, puis libère chaque prénom <b>et</b> le tableau. Entrée <code>3⏎Ada⏎Alan⏎Grace⏎</code> → <code>Grace⏎Alan⏎Ada⏎</code>. <b>Aucune fuite.</b>',
      lesson: '<p>La case i du tableau contient une <b>adresse</b> (8 octets) : <code>mov rdi, [rbx + r13*8]</code> la récupère pour puts ou free.</p>' +
        '<p>Libérer le tableau ne libère pas les prénoms vers lesquels il pointe ! Il faut d’abord un <code>free</code> par prénom, puis un dernier pour le tableau (n + 1 free pour n + 1 malloc).</p>',
      stdin: '3\nAda\nAlan\nGrace\n',
      starter: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrdup

section .bss
\tcar\tresb 1
\ttampon\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx\t\t\t\t; rbx = le tableau
\tpush\tr12\t\t\t\t; r12 = n
\tpush\tr13\t\t\t\t; r13 = i
\tcall\tlire_nombre
\tmov\tr12, rax
\tmov\trdi, r12
\tshl\trdi, 3\t\t\t; n pointeurs de 8 octets
\tcall\tmalloc
\tmov\trbx, rax
\txor\tr13, r13
.lit:
\tcmp\tr13, r12
\tjge\t.affiche
\tmov\trdi, tampon
\tcall\tlire_ligne
\tmov\trdi, tampon
\tcall\tstrdup\t\t\t; copie du prénom sur le tas
\tmov\t[rbx + r13*8], rax
\tinc\tr13
\tjmp\t.lit
.affiche:
\t; TODO 1 : puts(tableau[i]) pour i de n - 1 jusqu'à 0
\t; TODO 2 : free(tableau[i]) pour chaque i, puis free(tableau)
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE + LIGNE,
      solution: `extern\tmalloc
extern\tfree
extern\tputs
extern\tstrdup

section .bss
\tcar\tresb 1
\ttampon\tresb 64

section .text
\tglobal\tmain

main:
\tpush\trbx
\tpush\tr12
\tpush\tr13
\tcall\tlire_nombre
\tmov\tr12, rax
\tmov\trdi, r12
\tshl\trdi, 3
\tcall\tmalloc
\tmov\trbx, rax
\txor\tr13, r13
.lit:
\tcmp\tr13, r12
\tjge\t.affiche
\tmov\trdi, tampon
\tcall\tlire_ligne
\tmov\trdi, tampon
\tcall\tstrdup
\tmov\t[rbx + r13*8], rax
\tinc\tr13
\tjmp\t.lit
.affiche:
\tmov\tr13, r12
.aff:
\tcmp\tr13, 0
\tje\t.libere
\tdec\tr13
\tmov\trdi, [rbx + r13*8]
\tcall\tputs
\tjmp\t.aff
.libere:
\txor\tr13, r13
.lib:
\tcmp\tr13, r12
\tjge\t.tableau
\tmov\trdi, [rbx + r13*8]
\tcall\tfree
\tinc\tr13
\tjmp\t.lib
.tableau:
\tmov\trdi, rbx
\tcall\tfree
\tpop\tr13
\tpop\tr12
\tpop\trbx
\txor\teax, eax
\tret
` + NOMBRE + LIGNE,
      hints: ['Affichage : mov r13, r12 puis boucle : cmp r13, 0 / je … / dec r13 / mov rdi, [rbx + r13*8] / call puts', 'Libération : r13 de 0 à n - 1 : mov rdi, [rbx + r13*8] / call free', 'Enfin : mov rdi, rbx / call free (le tableau lui-même).'],
      tests: [{ stdin: '3\nAda\nAlan\nGrace\n', expect: 'Grace\nAlan\nAda\n', exit: 0 }, { stdin: '1\nLinus\n', expect: 'Linus\n', exit: 0 }, { stdin: '4\nun\ndeux\ntrois\nquatre\n', expect: 'quatre\ntrois\ndeux\nun\n', exit: 0 }],
      rules: { mustCall: ['malloc', 'free', 'puts'], noLeaks: true, noWarnings: ALIGN }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
