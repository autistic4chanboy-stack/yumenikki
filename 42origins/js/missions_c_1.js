/* =========================================================================
 *  42 ORIGINS — missions C, chapitres 1 à 5 (missions 1 à 9 de chaque chapitre)
 *  Le code C est écrit tel quel dans des gabarits C`…` : chaque groupe de
 *  4 espaces devient une tabulation, et les \n du C restent des \n du C.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.c = O42.missions.c || [];

  /* gabarit brut → code C (4 espaces → tabulation) */
  function C(strs) {
    return strs.raw[0].replace(/ {4}/g, '\t');
  }

  var PUTCHAR = C`void    ft_putchar(char c)
{
    write(1, &c, 1);
}
`;
  var PUTNBR = C`void    ft_putnbr(int n)
{
    char    c;

    if (n >= 10)
        ft_putnbr(n / 10);
    c = '0' + n % 10;
    write(1, &c, 1);
}
`;
  var PUTNBR_NEG = C`void    ft_putnbr(int n)
{
    char    c;

    if (n < 0)
    {
        write(1, "-", 1);
        n = -n;
    }
    if (n >= 10)
        ft_putnbr(n / 10);
    c = '0' + n % 10;
    write(1, &c, 1);
}
`;
  var PUTSTR = C`void    ft_putstr(char *s)
{
    int    i;

    i = 0;
    while (s[i] != '\0')
    {
        write(1, &s[i], 1);
        i++;
    }
}
`;
  var INC = '#include <unistd.h>\n\n';
  /* début d'une regex « dans un texte entre guillemets » (ignore les guillemets fermants) */
  var STR = '^(?:[^"\\n]*"[^"\\n]*")*[^"\\n]*"[^"\\n]*';
  var NOPRINT = ['printf', 'puts', 'putchar', 'dprintf'];

  O42.missions.c.push(
    /* ===================== Chapitre 1 — Afficher avec write ===================== */
    {
      id: 'c1_1', ch: 1, ord: 1,
      title: 'Le premier mot',
      story: 'Le tableau d’affichage du hall n’affiche qu’un seul nombre : celui de l’école. Pour l’instant, il ne montre qu’un pauvre <b>4</b>…',
      goal: 'Affiche exactement :<pre>42⏎</pre>avec <code>write</code> (⏎ = retour à la ligne <code>\\n</code>).',
      lesson: '<p><code>write(1, "42\\n", 3);</code> envoie <b>3 octets</b> vers le descripteur <b>1</b> (la sortie standard, l’écran) : <code>4</code>, <code>2</code> et le retour à la ligne <code>\\n</code>.</p>' +
        '<p>Le troisième argument est le <b>nombre d’octets</b> à envoyer : s’il est trop petit, la fin du texte est coupée.</p>',
      starter: INC + C`int    main(void)
{
    write(1, "4", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "42\n", 3);
    return (0);
}
`,
      hints: ['Le texte doit devenir "42\\n".', '"42\\n" fait 3 octets : 4, 2 et \\n.', 'write(1, "42\\n", 3);'],
      tests: [{ expect: '42\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT }
    },
    {
      id: 'c1_2', ch: 1, ord: 2,
      title: 'Le bon nombre d’octets',
      story: 'Le stagiaire de l’accueil a programmé le message de bienvenue… mais il s’est trompé en comptant : l’écran n’affiche que <b>Salut</b>.',
      goal: 'Corrige la taille pour afficher :<pre>Salut le campus⏎</pre>',
      lesson: '<p>Pour trouver la taille, compte <b>chaque</b> caractère : les lettres, les <b>espaces</b> et le <code>\\n</code> (qui ne compte que pour 1 octet même s’il s’écrit avec deux signes).</p>',
      starter: INC + C`int    main(void)
{
    write(1, "Salut le campus\n", 5);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "Salut le campus\n", 16);
    return (0);
}
`,
      hints: ['Seuls les 5 premiers octets sont envoyés.', '« Salut » 5 + espace 1 + « le » 2 + espace 1 + « campus » 6 + \\n 1.', 'write(1, "Salut le campus\\n", 16);'],
      tests: [{ expect: 'Salut le campus\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT }
    },
    {
      id: 'c1_3', ch: 1, ord: 3,
      title: 'La phrase en deux morceaux',
      story: 'L’écran de la cafétéria reçoit ses messages en <b>morceaux</b>. Le premier est déjà programmé, il manque la suite.',
      goal: 'Garde le premier <code>write</code> et ajoute un <b>deuxième</b> <code>write</code> pour que l’écran affiche :<pre>Cafe ouvert⏎</pre>',
      lesson: '<p>Chaque <code>write</code> ajoute ses octets <b>à la suite</b> des précédents : deux <code>write</code> peuvent former une seule ligne. Le retour à la ligne n’arrive que quand tu envoies un <code>\\n</code>.</p>',
      starter: INC + C`int    main(void)
{
    write(1, "Cafe", 4);
    // TODO : écris la suite : " ouvert" puis le retour à la ligne
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "Cafe", 4);
    write(1, " ouvert\n", 8);
    return (0);
}
`,
      hints: ['La suite commence par un espace : " ouvert\\n".', 'Espace 1 + « ouvert » 6 + \\n 1 = 8 octets.', 'write(1, " ouvert\\n", 8);'],
      tests: [{ expect: 'Cafe ouvert\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: '"Cafe ouvert', msg: 'Garde les deux morceaux : un write pour "Cafe", un autre pour la suite.' }], mustSrc: [{ re: 'write[\\s\\S]*write', msg: 'Il faut deux appels à write.' }] }
    },
    {
      id: 'c1_4', ch: 1, ord: 4,
      title: 'Trois lignes d’un coup',
      story: 'Le club de théâtre affiche ses jours de répétition. Le président veut <b>un seul</b> <code>write</code> pour les trois lignes : « c’est plus élégant ».',
      goal: 'Avec <b>un seul</b> appel à <code>write</code>, affiche :<pre>Lundi\nMardi\nMercredi</pre>(chaque ligne finie par <code>\\n</code>).',
      lesson: '<p>Un texte peut contenir <b>plusieurs</b> <code>\\n</code> : <code>"A\\nB\\n"</code> s’affiche sur deux lignes. Chaque <code>\\n</code> compte pour 1 octet dans la taille.</p>',
      starter: INC + C`int    main(void)
{
    write(1, "Lundi", 5);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "Lundi\nMardi\nMercredi\n", 21);
    return (0);
}
`,
      hints: ['Le texte : "Lundi\\nMardi\\nMercredi\\n".', 'Lundi\\n = 6, Mardi\\n = 6, Mercredi\\n = 9.', 'write(1, "Lundi\\nMardi\\nMercredi\\n", 21);'],
      tests: [{ expect: 'Lundi\nMardi\nMercredi\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: 'write[\\s\\S]*write', msg: 'Un seul write pour les trois lignes !' }] }
    },
    {
      id: 'c1_5', ch: 1, ord: 5,
      title: 'Le canal des erreurs',
      story: 'La reprographie affiche son stock sur l’écran du couloir. Mais l’alerte « stock bas » ne doit pas s’y afficher : elle doit partir sur le canal des <b>erreurs</b>, que seul le technicien surveille.',
      goal: 'La sortie standard (fd 1) doit contenir seulement :<pre>Stock : 12 ramettes⏎</pre>L’alerte <code>Attention : stock bas</code> doit être envoyée sur le descripteur <b>2</b> (stderr).',
      lesson: '<p>Un programme a deux sorties : le fd <b>1</b> (stdout) pour les résultats et le fd <b>2</b> (stderr) pour les messages d’erreur. Les deux s’affichent dans le terminal, mais on peut les séparer : le juge ne regarde que stdout.</p>',
      starter: INC + C`int    main(void)
{
    write(1, "Stock : 12 ramettes\n", 20);
    write(1, "Attention : stock bas\n", 22);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "Stock : 12 ramettes\n", 20);
    write(2, "Attention : stock bas\n", 22);
    return (0);
}
`,
      hints: ['Le premier argument de write choisit la destination.', '0 = entrée, 1 = sortie, 2 = erreurs.', 'write(2, "Attention : stock bas\\n", 22);'],
      tests: [{ expect: 'Stock : 12 ramettes\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, mustSrc: [{ re: 'write\\s*\\(\\s*2\\s*,', msg: 'L’alerte doit partir sur le descripteur 2.' }, { re: 'stock bas', msg: 'Ne supprime pas l’alerte : envoie-la sur stderr.' }] }
    },
    {
      id: 'c1_6', ch: 1, ord: 6,
      title: 'Une lettre dans une boîte',
      story: 'Au secrétariat, la lettre du groupe de chaque étudiant est rangée dans une variable <code>lettre</code>. Il faut l’afficher… sans la recopier à la main.',
      goal: 'Affiche le contenu de la variable <code>lettre</code> avec <code>write(1, &amp;lettre, 1)</code>, puis un retour à la ligne :<pre>M⏎</pre>Interdit d’écrire <code>M</code> entre guillemets.',
      lesson: '<p><code>char lettre;</code> réserve <b>1 octet</b> sur la pile. <code>write</code> veut une <b>adresse</b> : <code>&amp;lettre</code> est l’adresse de cette case.</p>' +
        '<p>Un caractère seul s’écrit entre apostrophes (<code>\'M\'</code>), un texte entre guillemets (<code>"M"</code>).</p>',
      starter: INC + C`int    main(void)
{
    char    lettre;

    lettre = 'M';
    // TODO : affiche lettre avec write et son adresse &lettre
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    lettre;

    lettre = 'M';
    write(1, &lettre, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['write a besoin de l’adresse de la variable.', 'L’adresse de lettre s’écrit &lettre.', 'write(1, &lettre, 1);'],
      tests: [{ expect: 'M\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + 'M', msg: 'N’écris pas M entre guillemets : affiche la variable lettre.' }], mustSrc: [{ re: '&\\s*lettre', msg: 'Passe l’adresse &lettre à write.' }] }
    },
    {
      id: 'c1_7', ch: 1, ord: 7,
      title: 'La fonction ft_putchar',
      story: 'À 42, on écrit ses propres outils. Le premier de tous : <code>ft_putchar</code>, qui affiche <b>un</b> caractère. Le <code>main</code> est prêt, il manque le corps de la fonction.',
      goal: 'Complète <code>ft_putchar</code> pour que le programme affiche :<pre>42⏎</pre>',
      lesson: '<p>Quand on appelle <code>ft_putchar(\'4\')</code>, le caractère est copié dans le paramètre <code>c</code>, une variable de la fonction (sur la pile).</p>' +
        '<p>Dans la fonction, il suffit d’envoyer cet octet : <code>write(1, &amp;c, 1);</code></p>',
      starter: INC + C`void    ft_putchar(char c)
{
    // TODO : écris le caractère c
}

int    main(void)
{
    ft_putchar('4');
    ft_putchar('2');
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    ft_putchar('4');
    ft_putchar('2');
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['C’est la même idée que la mission précédente, avec c au lieu de lettre.', 'L’adresse du paramètre c s’écrit &c.', 'write(1, &c, 1);'],
      tests: [{ expect: '42\n' }],
      rules: { mustCall: ['ft_putchar', 'write'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + '42', msg: 'N’écris pas 42 dans un texte : c’est ft_putchar qui doit afficher.' }] }
    },
    {
      id: 'c1_8', ch: 1, ord: 8,
      title: 'Le badge de Marvin',
      story: 'L’imprimante à badges est capricieuse : elle refuse les textes entre guillemets et n’accepte que des caractères <b>un par un</b>. Marvin attend son badge.',
      goal: 'Affiche :<pre>MARVIN⏎</pre>uniquement avec <code>ft_putchar</code>. Aucun guillemet double <code>"</code> n’est autorisé dans ton code.',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    ft_putchar('M');
    // TODO : la suite du nom, puis le retour à la ligne
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    ft_putchar('M');
    ft_putchar('A');
    ft_putchar('R');
    ft_putchar('V');
    ft_putchar('I');
    ft_putchar('N');
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['Un appel par lettre : A, R, V, I, N.', 'N’oublie pas le retour à la ligne : ft_putchar(\'\\n\');', 'ft_putchar(\'A\'); ft_putchar(\'R\'); ft_putchar(\'V\'); ft_putchar(\'I\'); ft_putchar(\'N\'); ft_putchar(\'\\n\');'],
      tests: [{ expect: 'MARVIN\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, forbidSrc: [{ re: '"', msg: 'Pas de guillemets doubles : uniquement des ft_putchar(\'…\').' }] }
    },
    {
      id: 'c1_9', ch: 1, ord: 9,
      title: 'Le panneau des horaires',
      story: 'Le panneau des horaires coupe la fin de chaque ligne. Le stagiaire a pourtant compté les lettres… mais il a oublié que les <b>lettres accentuées</b> prennent plus de place.',
      goal: 'Corrige les trois tailles pour afficher :<pre>Café : 8h-18h\nBibliothèque : 9h-20h\nFermé le dimanche</pre>(chaque ligne finie par <code>\\n</code>).',
      lesson: '<p>Le texte est codé en <b>UTF-8</b> : les lettres simples (a, b, 8, espace…) prennent <b>1 octet</b>, mais <code>é</code>, <code>è</code>, <code>à</code>… en prennent <b>2</b>.</p>' +
        '<p><code>write</code> compte en <b>octets</b>, pas en lettres : « Café » fait 4 lettres mais 5 octets. Regarde les cases de la chaîne dans la mémoire (.rodata).</p>',
      starter: INC + C`int    main(void)
{
    write(1, "Café : 8h-18h\n", 14);
    write(1, "Bibliothèque : 9h-20h\n", 22);
    write(1, "Fermé le dimanche\n", 18);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    write(1, "Café : 8h-18h\n", 15);
    write(1, "Bibliothèque : 9h-20h\n", 23);
    write(1, "Fermé le dimanche\n", 19);
    return (0);
}
`,
      hints: ['Chaque ligne contient exactement une lettre accentuée.', 'Une lettre accentuée = 2 octets : ajoute 1 à chaque taille.', 'Les tailles sont 15, 23 et 19.'],
      tests: [{ expect: 'Café : 8h-18h\nBibliothèque : 9h-20h\nFermé le dimanche\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT.concat(['strlen']) }
    },

    /* ===================== Chapitre 2 — Cases et tableaux ===================== */
    {
      id: 'c2_1', ch: 2, ord: 1,
      title: 'La note corrigée',
      story: 'Le jury a relu la copie de Léa : sa note passe de <b>C</b> à <b>A</b> ! Il faut mettre à jour la variable avant d’imprimer le relevé.',
      goal: 'Change la valeur de la variable <code>note</code> en <code>\'A\'</code> pour afficher :<pre>Note : A⏎</pre>',
      lesson: '<p>Une <b>variable</b> est une case mémoire avec un nom. <code>note = \'A\';</code> <b>remplace</b> son contenu : l’ancienne valeur est perdue.</p>' +
        '<p>Avance pas à pas et regarde la case <code>note</code> changer sur la pile.</p>',
      starter: INC + C`int    main(void)
{
    char    note;

    note = 'C';
    // TODO : le jury change la note en 'A'
    write(1, "Note : ", 7);
    write(1, &note, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    note;

    note = 'C';
    note = 'A';
    write(1, "Note : ", 7);
    write(1, &note, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Ajoute une affectation après note = \'C\';', 'Le signe = range une nouvelle valeur dans la case.', 'note = \'A\';'],
      tests: [{ expect: 'Note : A\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + 'A', msg: 'N’écris pas A dans un texte : change la variable note.' }], mustSrc: [{ re: 'note\\s*=\\s*\'A\'', msg: 'Range \'A\' dans la variable note.' }] }
    },
    {
      id: 'c2_2', ch: 2, ord: 2,
      title: 'Le terminal à nombres',
      story: 'Le vieux terminal de la bibliothèque ne comprend que les <b>nombres</b>. Pour lui faire dire <b>OUI</b>, il faut lui donner les codes ASCII des lettres.',
      goal: 'Affiche :<pre>OUI⏎</pre>en rangeant des <b>nombres</b> dans <code>c</code> (pas de lettre entre apostrophes ou guillemets). Le code de <code>O</code> est 79.',
      lesson: '<p>Pour l’ordinateur, un <code>char</code> est un petit <b>nombre</b> (1 octet). La table <b>ASCII</b> fait le lien : <code>\'A\'</code> = 65, <code>\'B\'</code> = 66… <code>\'O\'</code> = 79, <code>\'U\'</code> = 85, <code>\'I\'</code> = 73.</p>' +
        '<p><code>c = 79;</code> et <code>c = \'O\';</code> rangent exactement le même octet.</p>',
      starter: INC + C`int    main(void)
{
    char    c;

    c = 79;
    write(1, &c, 1);
    // TODO : affiche U (85) puis I (73)
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    c;

    c = 79;
    write(1, &c, 1);
    c = 85;
    write(1, &c, 1);
    c = 73;
    write(1, &c, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Réutilise la même variable c : change sa valeur puis réaffiche-la.', 'U vaut 85 et I vaut 73.', 'c = 85; write(1, &c, 1); c = 73; write(1, &c, 1);'],
      tests: [{ expect: 'OUI\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: '\'[A-Za-z]\'', msg: 'Pas de lettre entre apostrophes : utilise les codes ASCII.' }, { re: STR + '[OUI]', msg: 'Pas de lettre entre guillemets : utilise les codes ASCII.' }] }
    },
    {
      id: 'c2_3', ch: 2, ord: 3,
      title: 'Les guichets du self',
      story: 'Au self, les guichets s’appellent <b>a</b>, <b>b</b>, <b>c</b> et <b>d</b>. Le panneau doit les afficher dans l’ordre en partant de <code>\'a\'</code> et en avançant d’une lettre à chaque fois.',
      goal: 'Affiche :<pre>abcd⏎</pre>en partant de <code>c = \'a\'</code> et en ajoutant 1 à <code>c</code>. N’écris pas les lettres b, c, d toi-même.',
      lesson: '<p>Comme un <code>char</code> est un nombre, on peut faire des calculs : <code>\'a\' + 1</code> vaut 98, c’est-à-dire <code>\'b\'</code>. Les lettres de l’alphabet se suivent dans la table ASCII.</p>' +
        '<p><code>c = c + 1;</code> (ou <code>c++;</code>) fait avancer c d’une lettre.</p>',
      starter: INC + C`int    main(void)
{
    char    c;

    c = 'a';
    write(1, &c, 1);
    // TODO : avance c d'une lettre et affiche-le, trois fois
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    c;

    c = 'a';
    write(1, &c, 1);
    c = c + 1;
    write(1, &c, 1);
    c = c + 1;
    write(1, &c, 1);
    c = c + 1;
    write(1, &c, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Après le premier write, ajoute 1 à c.', 'Répète trois fois : c = c + 1; puis write(1, &c, 1);', 'c = c + 1; write(1, &c, 1); (×3)'],
      tests: [{ expect: 'abcd\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: '\'[b-d]\'', msg: 'N’écris pas b, c ou d : calcule-les à partir de \'a\'.' }, { re: STR + '[a-d]', msg: 'Pas de lettres entre guillemets.' }, { re: '\\b9[89]\\b|\\b100\\b', msg: 'Pas de codes ASCII en dur : ajoute 1 à c.' }] }
    },
    {
      id: 'c2_4', ch: 2, ord: 4,
      title: 'Le coach qui crie',
      story: 'Le coach du club de sport veut un panneau qui crie <b>GO !</b> en majuscules. Les lettres arrivent en minuscules : à toi de les convertir.',
      goal: 'Affiche :<pre>GO !⏎</pre>en partant des minuscules <code>\'g\'</code> et <code>\'o\'</code> et en les transformant par un <b>calcul</b>. Aucune majuscule entre apostrophes ou guillemets.',
      lesson: '<p>Dans la table ASCII, <code>\'a\'</code> = 97 et <code>\'A\'</code> = 65 : chaque minuscule est <b>32 de plus</b> que sa majuscule.</p>' +
        '<p>Donc <code>c = c - 32;</code> transforme une minuscule en majuscule (et <code>c + 32</code> fait l’inverse).</p>',
      starter: INC + C`int    main(void)
{
    char    c;

    c = 'g';
    // TODO : transforme c en majuscule
    write(1, &c, 1);
    c = 'o';
    // TODO : idem
    write(1, &c, 1);
    write(1, " !\n", 3);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    c;

    c = 'g';
    c = c - 32;
    write(1, &c, 1);
    c = 'o';
    c = c - 32;
    write(1, &c, 1);
    write(1, " !\n", 3);
    return (0);
}
`,
      hints: ['Majuscule = minuscule − 32.', 'Avant chaque write, enlève 32 à c.', 'c = c - 32;'],
      tests: [{ expect: 'GO !\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT.concat(['toupper']), forbidSrc: [{ re: '\'[A-Z]\'', msg: 'Pas de majuscule entre apostrophes : calcule-la.' }, { re: STR + '[A-Z]', msg: 'Pas de majuscule entre guillemets.' }, { re: '\\b(71|79)\\b', msg: 'Pas de code ASCII en dur : fais le calcul à partir de la minuscule.' }] }
    },
    {
      id: 'c2_5', ch: 2, ord: 5,
      title: 'Le vestiaire',
      story: 'Au vestiaire de la piscine, les casiers sont rangés dans un tableau. Seuls les casiers aux places <b>paires</b> (0, 2, 4) sont libres : il faut afficher leur lettre.',
      goal: 'Affiche les cases d’indices 0, 2 et 4 du tableau <code>casiers</code> :<pre>ABC⏎</pre>',
      lesson: '<p><code>char casiers[] = "AXBYCZ";</code> crée un tableau de 7 cases (6 lettres + <code>\\0</code>). On compte depuis <b>0</b> : <code>casiers[0]</code> = A, <code>casiers[1]</code> = X…</p>' +
        '<p><code>&amp;casiers[2]</code> est l’adresse de la case 2 : <code>write(1, &amp;casiers[2], 1)</code> l’affiche.</p>',
      starter: INC + C`int    main(void)
{
    char    casiers[] = "AXBYCZ";

    write(1, &casiers[0], 1);
    // TODO : affiche les cases 2 et 4
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    casiers[] = "AXBYCZ";

    write(1, &casiers[0], 1);
    write(1, &casiers[2], 1);
    write(1, &casiers[4], 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['B est à l’indice 2, C à l’indice 4.', 'Même forme que la ligne déjà écrite : write(1, &casiers[…], 1);', 'write(1, &casiers[2], 1); write(1, &casiers[4], 1);'],
      tests: [{ expect: 'ABC\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + '(AB|BC)', msg: 'Lis les lettres dans le tableau, ne les recopie pas.' }, { re: '\'[A-Z]\'', msg: 'Lis les lettres dans le tableau, ne les recopie pas.' }], mustSrc: [{ re: 'casiers\\s*\\[\\s*4\\s*\\]', msg: 'Il faut lire la case casiers[4].' }] }
    },
    {
      id: 'c2_6', ch: 2, ord: 6,
      title: 'Le digicode',
      story: 'La porte de la salle machines a un digicode. Les chiffres sont rangés dans un tableau d’<code>int</code> : pour les afficher, il faut les transformer en <b>caractères</b>.',
      goal: 'Affiche les 4 chiffres du tableau <code>code</code> :<pre>4207⏎</pre>en calculant chaque caractère avec <code>\'0\' + code[i]</code>.',
      lesson: '<p>Un <code>int</code> occupe <b>4 octets</b> : <code>int code[4]</code> fait 16 octets sur la pile.</p>' +
        '<p>Le <b>nombre</b> 4 n’est pas le <b>caractère</b> <code>\'4\'</code> (qui vaut 52). Les chiffres se suivent en ASCII à partir de <code>\'0\'</code> (48), donc <code>\'0\' + 4</code> donne <code>\'4\'</code>.</p>',
      starter: INC + C`int    main(void)
{
    int     code[4];
    char    c;

    code[0] = 4;
    code[1] = 2;
    code[2] = 0;
    code[3] = 7;
    c = '0' + code[0];
    write(1, &c, 1);
    // TODO : les trois autres chiffres
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    int     code[4];
    char    c;

    code[0] = 4;
    code[1] = 2;
    code[2] = 0;
    code[3] = 7;
    c = '0' + code[0];
    write(1, &c, 1);
    c = '0' + code[1];
    write(1, &c, 1);
    c = '0' + code[2];
    write(1, &c, 1);
    c = '0' + code[3];
    write(1, &c, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Répète les deux lignes c = … et write pour les indices 1, 2 et 3.', 'c = \'0\' + code[1]; write(1, &c, 1);', 'Fais de même avec code[2] et code[3].'],
      tests: [{ expect: '4207\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + '[1-9]', msg: 'Pas de chiffres entre guillemets.' }, { re: '\'[1-9]\'', msg: 'Calcule les caractères avec \'0\' + code[i].' }], mustSrc: [{ re: 'code\\s*\\[\\s*3\\s*\\]\\s*[;)]', msg: 'Utilise la case code[3].' }] }
    },
    {
      id: 'c2_7', ch: 2, ord: 7,
      title: 'Les ciseaux du \\0',
      story: 'L’imprimante de la boulangerie imprime le mot du jour jusqu’à la fin de la chaîne. Le boulanger veut juste <b>Bon</b> au lieu de <b>Bonjour</b>, sans changer le texte d’origine.',
      goal: 'Coupe la chaîne <code>mot</code> en plaçant un <code>\'\\0\'</code> au bon endroit, pour que le programme affiche :<pre>Bon⏎</pre>Ne touche pas aux <code>write</code>.',
      lesson: '<p>Une chaîne C se termine au premier octet <code>\\0</code> (valeur 0). <code>strlen(mot)</code> compte les cases <b>avant</b> ce <code>\\0</code>.</p>' +
        '<p>Si on écrit <code>\\0</code> au milieu, la chaîne « s’arrête » là, même si les lettres suivantes sont toujours en mémoire !</p>',
      starter: INC + '#include <string.h>\n\n' + C`int    main(void)
{
    char    mot[] = "Bonjour";

    // TODO : coupe le mot après "Bon"
    write(1, mot, strlen(mot));
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + '#include <string.h>\n\n' + C`int    main(void)
{
    char    mot[] = "Bonjour";

    mot[3] = '\0';
    write(1, mot, strlen(mot));
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['B-o-n occupe les cases 0, 1 et 2.', 'La case 3 (le j) doit devenir la fin de la chaîne.', 'mot[3] = \'\\0\';'],
      tests: [{ expect: 'Bon\n' }],
      rules: { mustCall: ['write', 'strlen'], forbidCall: NOPRINT, forbidSrc: [{ re: '"Bon"', msg: 'Ne réécris pas le mot : coupe-le avec \\0.' }, { re: 'write\\s*\\(\\s*1\\s*,\\s*mot\\s*,\\s*\\d', msg: 'Garde write(1, mot, strlen(mot)) : c’est le \\0 qui doit couper.' }], mustSrc: [{ re: 'mot\\s*\\[\\s*3\\s*\\]\\s*=', msg: 'Place la fin de chaîne dans la case mot[3].' }] }
    },
    {
      id: 'c2_8', ch: 2, ord: 8,
      title: 'La photocopie',
      story: 'Le secrétariat doit garder une <b>copie</b> de l’adresse d’un colis dans un deuxième tableau. Pas de photocopieuse (<code>strcpy</code>) : on recopie case par case.',
      goal: 'Copie le tableau <code>src</code> dans <code>dst</code> case par case, <b>sans oublier le <code>\\0</code></b>, pour que l’affichage de <code>dst</code> donne :<pre>Paris⏎</pre>',
      lesson: '<p><code>char dst[6];</code> réserve 6 cases <b>non initialisées</b> : elles contiennent n’importe quoi (hachuré <i>?</i> dans la vue mémoire).</p>' +
        '<p>Pour que <code>dst</code> soit une vraie chaîne, il faut copier les 5 lettres <b>et</b> le <code>\\0</code> final : 6 cases en tout.</p>',
      starter: INC + '#include <string.h>\n\n' + C`int    main(void)
{
    char    src[] = "Paris";
    char    dst[6];

    dst[0] = src[0];
    dst[1] = '\0';
    // TODO : copie toutes les cases de src (le \0 en dernier)
    write(1, dst, strlen(dst));
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + '#include <string.h>\n\n' + C`int    main(void)
{
    char    src[] = "Paris";
    char    dst[6];

    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = '\0';
    write(1, dst, strlen(dst));
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['La ligne dst[1] = \'\\0\'; coupe la copie trop tôt.', 'dst[1] = src[1]; … jusqu’à dst[4] = src[4];', 'Et pour finir : dst[5] = \'\\0\';'],
      tests: [{ expect: 'Paris\n' }],
      rules: { mustCall: ['write', 'strlen'], forbidCall: NOPRINT.concat(['strcpy', 'strncpy', 'memcpy', 'memmove', 'strdup']), forbidSrc: [{ re: '\'[A-Za-z]\'', msg: 'Copie depuis src, n’écris pas les lettres toi-même.' }, { re: 'write\\s*\\([^;]*src', msg: 'Affiche la copie dst, pas l’original.' }], mustSrc: [{ re: 'dst\\s*\\[\\s*5\\s*\\]\\s*=', msg: 'N’oublie pas la case dst[5] (le \\0).' }] }
    },
    {
      id: 'c2_9', ch: 2, ord: 9,
      title: 'Le message codé',
      story: 'Un message secret est arrivé au club d’informatique : <b>Tbmvu</b>. Le code est simple : chaque lettre a été avancée d’une place dans l’alphabet. À toi de le décoder… <b>dans le tableau lui-même</b>.',
      goal: 'Recule chaque lettre du tableau <code>msg</code> d’une place (case par case) pour afficher :<pre>Salut⏎</pre>Aucune lettre entre apostrophes, et pas le mot décodé entre guillemets.',
      lesson: '<p><code>msg[0] = msg[0] - 1;</code> lit la case 0, enlève 1 au code ASCII, et range le résultat <b>dans la même case</b>. <code>\'T\' - 1</code> donne <code>\'S\'</code>.</p>',
      starter: INC + C`int    main(void)
{
    char    msg[] = "Tbmvu";

    msg[0] = msg[0] - 1;
    // TODO : décode les cases 1 à 4
    write(1, msg, 5);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    msg[] = "Tbmvu";

    msg[0] = msg[0] - 1;
    msg[1] = msg[1] - 1;
    msg[2] = msg[2] - 1;
    msg[3] = msg[3] - 1;
    msg[4] = msg[4] - 1;
    write(1, msg, 5);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Même calcul pour chaque case.', 'msg[1] = msg[1] - 1;', 'Répète jusqu’à msg[4] = msg[4] - 1;'],
      tests: [{ expect: 'Salut\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, forbidSrc: [{ re: '\'[A-Za-z]\'', msg: 'Pas de lettre entre apostrophes : décode avec un calcul.' }, { re: STR + 'alut', msg: 'N’écris pas le mot décodé : modifie les cases du tableau.' }] },
      scene: 'sign', sceneOpts: { v: 'msg', text: 'Tbmvu' }
    },

    /* ===================== Chapitre 3 — Conditions et boucles ===================== */
    {
      id: 'c3_1', ch: 3, ord: 1,
      title: 'Le videur du foyer',
      story: 'Le foyer organise une soirée réservée aux majeurs. Le programme du videur laisse entrer tout le monde : il faut qu’il <b>regarde l’âge</b> d’abord.',
      goal: 'Avec <code>if</code> / <code>else</code> : si <code>age &gt;= 18</code>, affiche <code>Entre</code>, sinon <code>Reviens plus tard</code> (suivi de <code>\\n</code>). Ici <code>age</code> vaut 16, donc :<pre>Reviens plus tard⏎</pre>',
      lesson: '<pre>if (condition)\n    …   // si vrai\nelse\n    …   // sinon</pre>' +
        '<p>Les comparaisons : <code>==</code> (égal, deux signes !), <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Une seule des deux branches est exécutée : suis la flèche verte.</p>',
      starter: INC + C`int    main(void)
{
    int    age;

    age = 16;
    // TODO : n'affiche "Entre" que si age >= 18, sinon "Reviens plus tard"
    write(1, "Entre\n", 6);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    int    age;

    age = 16;
    if (age >= 18)
        write(1, "Entre\n", 6);
    else
        write(1, "Reviens plus tard\n", 18);
    return (0);
}
`,
      hints: ['Place le write("Entre…") sous un if (age >= 18).', 'Le else contient l’autre message : "Reviens plus tard\\n" fait 18 octets.', 'if (age >= 18) write(1, "Entre\\n", 6); else write(1, "Reviens plus tard\\n", 18);'],
      tests: [{ expect: 'Reviens plus tard\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, mustSrc: [{ re: '\\bif\\b', msg: 'Il faut un if.' }, { re: '\\belse\\b', msg: 'Il faut un else.' }, { re: '"Entre', msg: 'Garde le message "Entre" pour les majeurs.' }] }
    },
    {
      id: 'c3_2', ch: 3, ord: 2,
      title: 'Les tours de piste',
      story: 'Le club d’athlétisme compte les tours de ses coureurs. Aujourd’hui : <b>4 tours</b>, puis le coach crie « Fini ».',
      goal: 'Avec une boucle <code>while</code> et <b>un seul</b> <code>write</code> pour « Tour », affiche :<pre>Tour\nTour\nTour\nTour\nFini</pre>(chaque ligne finie par <code>\\n</code>).',
      lesson: '<pre>tours = 0;\nwhile (tours &lt; 4)\n{\n    …\n    tours++;\n}</pre>' +
        '<p>La condition est vérifiée <b>avant</b> chaque tour. <code>tours++</code> ajoute 1 : sans lui, la boucle ne s’arrêterait jamais !</p>',
      starter: INC + C`int    main(void)
{
    int    tours;

    tours = 0;
    // TODO : répète ce write 4 fois avec une boucle while
    write(1, "Tour\n", 5);
    write(1, "Fini\n", 5);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    int    tours;

    tours = 0;
    while (tours < 4)
    {
        write(1, "Tour\n", 5);
        tours++;
    }
    write(1, "Fini\n", 5);
    return (0);
}
`,
      hints: ['while (tours < 4) { … }', 'Dans la boucle : le write puis tours++;', 'Le write("Fini…") reste après la boucle.'],
      tests: [{ expect: 'Tour\nTour\nTour\nTour\nFini\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, mustSrc: [{ re: '\\bwhile\\b', msg: 'Il faut une boucle while.' }], forbidSrc: [{ re: '"Tour[\\s\\S]*"Tour', msg: 'Un seul write pour « Tour » : c’est la boucle qui répète.' }, { re: 'Tour\\\\nTour', msg: 'Un seul « Tour » par write.' }] }
    },
    {
      id: 'c3_3', ch: 3, ord: 3,
      title: 'Les numéros de casiers',
      story: 'Les casiers neufs du gymnase doivent être numérotés de <b>1 à 9</b>. Écrire les chiffres un par un ? Non : une boucle <code>for</code> le fera.',
      goal: 'Avec une boucle <code>for</code> et <code>ft_putchar(\'0\' + i)</code>, affiche :<pre>123456789⏎</pre>',
      lesson: '<p>La boucle <code>for</code> regroupe les trois morceaux d’un compteur :</p><pre>for (i = 1; i &lt;= 9; i++)\n    …</pre>' +
        '<p>départ ; condition ; pas. C’est exactement un <code>while</code> écrit en une ligne.</p>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    i;

    i = 1;
    // TODO : une boucle for de 1 à 9
    ft_putchar('0' + i);
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    i;

    for (i = 1; i <= 9; i++)
        ft_putchar('0' + i);
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['for (départ; condition; pas)', 'for (i = 1; i <= 9; i++)', 'Seul ft_putchar(\'0\' + i) est dans la boucle, le \\n vient après.'],
      tests: [{ expect: '123456789\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, mustSrc: [{ re: '\\bfor\\b', msg: 'Il faut une boucle for.' }], forbidSrc: [{ re: STR + '[1-9]|\'[1-9]\'', msg: 'Ne recopie pas les chiffres : calcule-les avec \'0\' + i.' }] }
    },
    {
      id: 'c3_4', ch: 3, ord: 4,
      title: 'Les casiers pairs',
      story: 'Dans le vestiaire des filles, seuls les casiers <b>pairs</b> ont une serrure. Le gardien veut la liste des numéros de 0 à 9 qui sont pairs.',
      goal: 'Parcours les nombres de 0 à 9 et n’affiche que les <b>pairs</b>, grâce à un <code>if</code> et au modulo <code>%</code> :<pre>02468⏎</pre>',
      lesson: '<p><code>a % b</code> donne le <b>reste</b> de la division de a par b : <code>7 % 2</code> = 1, <code>8 % 2</code> = 0.</p>' +
        '<p>Un nombre est pair quand <code>i % 2 == 0</code>.</p>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    i;

    for (i = 0; i <= 9; i++)
    {
        // TODO : n'affiche i que s'il est pair
        ft_putchar('0' + i);
    }
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    i;

    for (i = 0; i <= 9; i++)
    {
        if (i % 2 == 0)
            ft_putchar('0' + i);
    }
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['Ajoute un if autour de ft_putchar.', 'Pair = le reste de la division par 2 vaut 0.', 'if (i % 2 == 0) ft_putchar(\'0\' + i);'],
      tests: [{ expect: '02468\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, mustSrc: [{ re: '%\\s*2', msg: 'Utilise le modulo : i % 2.' }, { re: '\\bif\\b', msg: 'Il faut un if.' }], forbidSrc: [{ re: STR + '[0-9]|\'[2-9]\'', msg: 'Ne recopie pas les chiffres.' }] }
    },
    {
      id: 'c3_5', ch: 3, ord: 5,
      title: 'Les admis du jury',
      story: 'Le jury de la piscine a noté 8 candidats. Le directeur veut savoir combien ont <b>au moins 10</b>.',
      goal: 'Compte les notes <code>&gt;= 10</code> du tableau <code>notes</code> avec une boucle et un compteur, puis affiche :<pre>5 admis sur 8⏎</pre>(le chiffre 5 doit être <b>calculé</b>).',
      lesson: '<p>Un <b>compteur</b> est une variable qui part de 0 et qu’on augmente de 1 à chaque fois qu’une condition est vraie :</p>' +
        '<pre>admis = 0;\nfor (i = 0; i &lt; 8; i++)\n    if (notes[i] &gt;= 10)\n        admis++;</pre>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    notes[8] = {12, 8, 15, 10, 4, 19, 9, 11};
    int    admis;
    int    i;

    admis = 0;
    i = 0;
    // TODO : parcours les 8 notes et compte celles >= 10
    ft_putchar('0' + admis);
    write(1, " admis sur 8\n", 13);
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    notes[8] = {12, 8, 15, 10, 4, 19, 9, 11};
    int    admis;
    int    i;

    admis = 0;
    i = 0;
    while (i < 8)
    {
        if (notes[i] >= 10)
            admis++;
        i++;
    }
    ft_putchar('0' + admis);
    write(1, " admis sur 8\n", 13);
    return (0);
}
`,
      hints: ['Une boucle sur i de 0 à 7 (i < 8).', 'Dans la boucle : if (notes[i] >= 10) admis++;', 'N’oublie pas i++ si tu utilises while.'],
      tests: [{ expect: '5 admis sur 8\n' }],
      rules: { mustCall: ['write'], forbidCall: NOPRINT, mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Il faut une boucle.' }], forbidSrc: [{ re: '\'5\'|"5|admis\\s*=\\s*5', msg: 'Le 5 doit être compté par le programme.' }] }
    },
    {
      id: 'c3_6', ch: 3, ord: 6,
      title: 'Le mur de briques',
      story: 'L’atelier de maçonnerie construit un mur en escalier : 1 brique, puis 2, puis 3, puis 4. Il faut une boucle… <b>dans</b> une boucle.',
      goal: 'Avec deux boucles imbriquées, affiche :<pre>*\n**\n***\n****</pre>(chaque ligne finie par <code>\\n</code>). Une seule étoile par <code>ft_putchar</code>.',
      lesson: '<p>La boucle <b>extérieure</b> choisit la ligne (<code>ligne</code> de 1 à 4), la boucle <b>intérieure</b> dessine <code>ligne</code> étoiles :</p>' +
        '<pre>for (ligne = 1; ligne &lt;= 4; ligne++)\n{\n    for (j = 0; j &lt; ligne; j++)\n        ft_putchar(\'*\');\n    ft_putchar(\'\\n\');\n}</pre>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    ligne;
    int    j;

    for (ligne = 1; ligne <= 4; ligne++)
    {
        // TODO : affiche "ligne" étoiles
        ft_putchar('\n');
    }
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    ligne;
    int    j;

    for (ligne = 1; ligne <= 4; ligne++)
    {
        for (j = 0; j < ligne; j++)
            ft_putchar('*');
        ft_putchar('\n');
    }
    return (0);
}
`,
      hints: ['À la ligne 3, il faut 3 étoiles : la boucle intérieure dépend de ligne.', 'for (j = 0; j < ligne; j++)', 'for (j = 0; j < ligne; j++) ft_putchar(\'*\');'],
      tests: [{ expect: '*\n**\n***\n****\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, mustSrc: [{ re: '\\b(while|for)\\b[\\s\\S]*\\b(while|for)\\b', msg: 'Il faut deux boucles imbriquées.' }], forbidSrc: [{ re: STR + '\\*', msg: 'Une étoile à la fois, avec ft_putchar(\'*\').' }] }
    },
    {
      id: 'c3_7', ch: 3, ord: 7,
      title: 'Le thermostat',
      story: 'Le thermostat de la salle de sport relève 6 températures dans la journée. Pour chacune, il affiche <b>F</b> (froid, moins de 18), <b>C</b> (chaud, plus de 24) ou <b>O</b> (ok).',
      goal: 'Pour chaque température du tableau, affiche <code>F</code> si elle est <code>&lt; 18</code>, <code>C</code> si elle est <code>&gt; 24</code>, sinon <code>O</code> :<pre>FOCOCO⏎</pre>',
      lesson: '<p>Pour choisir entre <b>trois</b> cas, on enchaîne <code>else if</code> :</p>' +
        '<pre>if (t &lt; 18)\n    …\nelse if (t &gt; 24)\n    …\nelse\n    …</pre><p>Les tests sont faits dans l’ordre, et seule la première branche vraie est exécutée.</p>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    temps[6] = {15, 20, 26, 18, 30, 24};
    int    i;

    for (i = 0; i < 6; i++)
    {
        // TODO : F si < 18, C si > 24, sinon O
        ft_putchar('O');
    }
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    temps[6] = {15, 20, 26, 18, 30, 24};
    int    i;

    for (i = 0; i < 6; i++)
    {
        if (temps[i] < 18)
            ft_putchar('F');
        else if (temps[i] > 24)
            ft_putchar('C');
        else
            ft_putchar('O');
    }
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['Trois cas : if, else if, else.', 'if (temps[i] < 18) ft_putchar(\'F\'); else if (temps[i] > 24) …', '18 et 24 ne sont ni froids ni chauds : ils donnent O.'],
      tests: [{ expect: 'FOCOCO\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, mustSrc: [{ re: 'else\\s+if', msg: 'Utilise else if.' }], forbidSrc: [{ re: STR + '[FOC]{2}', msg: 'Calcule chaque lettre dans la boucle.' }] }
    },
    {
      id: 'c3_8', ch: 3, ord: 8,
      title: 'Les nombres à deux chiffres',
      story: 'Le distributeur de tickets du self affiche les numéros de 7 à 12… et après le 9, il affiche des symboles bizarres (<code>:</code>, <code>;</code>, <code>&lt;</code>). Il ne sait pas écrire les nombres à deux chiffres !',
      goal: 'Affiche les nombres de 7 à 12, un par ligne :<pre>7\n8\n9\n10\n11\n12</pre>Pour un nombre <code>&gt;= 10</code>, affiche d’abord le chiffre des dizaines.',
      lesson: '<p><code>\'0\' + 10</code> n’est pas « 10 » : c’est le caractère suivant <code>\'9\'</code> dans la table ASCII, <code>\':\'</code>.</p>' +
        '<p>Pour 12 : les dizaines sont <code>12 / 10</code> = 1 (division entière) et les unités <code>12 % 10</code> = 2.</p>',
      starter: INC + PUTCHAR + C`
int    main(void)
{
    int    n;

    for (n = 7; n <= 12; n++)
    {
        // TODO : les dizaines si n >= 10, puis les unités
        ft_putchar('0' + n);
        ft_putchar('\n');
    }
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    main(void)
{
    int    n;

    for (n = 7; n <= 12; n++)
    {
        if (n >= 10)
            ft_putchar('0' + n / 10);
        ft_putchar('0' + n % 10);
        ft_putchar('\n');
    }
    return (0);
}
`,
      hints: ['Les dizaines : n / 10. Les unités : n % 10.', 'N’affiche les dizaines que si n >= 10 (pas de 07).', 'if (n >= 10) ft_putchar(\'0\' + n / 10); ft_putchar(\'0\' + n % 10);'],
      tests: [{ expect: '7\n8\n9\n10\n11\n12\n' }],
      rules: { mustCall: ['ft_putchar'], forbidCall: NOPRINT, mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Garde la boucle.' }], forbidSrc: [{ re: STR + '[0-9]|\'[1-9]\'', msg: 'Calcule les chiffres avec / et %.' }] }
    },
    {
      id: 'c3_9', ch: 3, ord: 9,
      title: 'La table de 7',
      story: 'La maîtresse de l’école du quartier veut afficher la <b>table de 7</b> au tableau numérique. Dix lignes, sans rien écrire à la main.',
      goal: 'Affiche les 10 lignes de la table de 7 :<pre>7 x 1 = 7\n7 x 2 = 14\n…\n7 x 10 = 70</pre>(chaque ligne finie par <code>\\n</code>). Les nombres (jusqu’à 99) doivent être calculés.',
      lesson: '<p>Pour éviter d’écrire deux fois le même code, range-le dans une petite fonction <code>ft_put2(int n)</code> qui affiche un nombre de 0 à 99 (dizaines si besoin, puis unités).</p>',
      starter: INC + PUTCHAR + C`
void    ft_put2(int n)
{
    // TODO : affiche n (de 0 à 99)
}

int    main(void)
{
    int    i;

    for (i = 1; i <= 10; i++)
    {
        write(1, "7 x ", 4);
        ft_put2(i);
        write(1, " = ", 3);
        ft_put2(7 * i);
        write(1, "\n", 1);
    }
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
void    ft_put2(int n)
{
    if (n >= 10)
        ft_putchar('0' + n / 10);
    ft_putchar('0' + n % 10);
}

int    main(void)
{
    int    i;

    for (i = 1; i <= 10; i++)
    {
        write(1, "7 x ", 4);
        ft_put2(i);
        write(1, " = ", 3);
        ft_put2(7 * i);
        write(1, "\n", 1);
    }
    return (0);
}
`,
      hints: ['C’est le calcul de la mission précédente, rangé dans une fonction.', 'Les dizaines : n / 10, les unités : n % 10.', 'if (n >= 10) ft_putchar(\'0\' + n / 10); ft_putchar(\'0\' + n % 10);'],
      tests: [{ expect: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n' }],
      rules: { mustCall: ['ft_put2'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + '[0-689]', msg: 'Calcule les nombres, ne les écris pas à la main.' }] }
    },

    /* ===================== Chapitre 4 — Fonctions et chaînes ===================== */
    {
      id: 'c4_1', ch: 4, ord: 1,
      title: 'Le jingle de la radio',
      story: 'La radio du campus passe son jingle trois fois par heure. Plutôt que de le recopier, on le range dans une <b>fonction</b> qu’on appelle quand on veut.',
      goal: 'Complète <code>ft_jingle</code> pour qu’elle affiche <code>Radio 42 !</code> suivi de <code>\\n</code>. Le <code>main</code> l’appelle trois fois :<pre>Radio 42 !\nRadio 42 !\nRadio 42 !</pre>',
      lesson: '<p>Une fonction est un bloc de code avec un nom. <code>void</code> veut dire qu’elle ne renvoie rien.</p>' +
        '<p>À chaque appel <code>ft_jingle();</code>, un nouveau <b>cadre</b> apparaît sur la pile, le code de la fonction s’exécute, puis on revient juste après l’appel.</p>',
      starter: INC + C`void    ft_jingle(void)
{
    // TODO : affiche "Radio 42 !" et un retour à la ligne
}

int    main(void)
{
    ft_jingle();
    ft_jingle();
    ft_jingle();
    return (0);
}
`,
      solution: INC + C`void    ft_jingle(void)
{
    write(1, "Radio 42 !\n", 11);
}

int    main(void)
{
    ft_jingle();
    ft_jingle();
    ft_jingle();
    return (0);
}
`,
      hints: ['Un seul write dans la fonction suffit.', '"Radio 42 !\\n" fait 11 octets.', 'write(1, "Radio 42 !\\n", 11);'],
      tests: [{ expect: 'Radio 42 !\nRadio 42 !\nRadio 42 !\n' }],
      rules: { mustCall: ['ft_jingle'], forbidCall: NOPRINT, forbidSrc: [{ re: '"Radio[\\s\\S]*"Radio', msg: 'Le texte ne doit apparaître qu’une fois : dans la fonction.' }] }
    },
    {
      id: 'c4_2', ch: 4, ord: 2,
      title: 'La ligne d’étoiles',
      story: 'Le restaurant du campus note ses plats avec des étoiles. Il faut une fonction <code>ft_stars(n)</code> qui dessine une ligne de <b>n</b> étoiles.',
      goal: 'Complète <code>ft_stars(int n)</code> : elle affiche <code>n</code> étoiles puis <code>\\n</code>. Le main affiche :<pre>***\n*\n*****\n⏎</pre>(la dernière ligne, pour <code>ft_stars(0)</code>, est vide).',
      lesson: '<p>Un <b>paramètre</b> est une variable de la fonction qui reçoit une <b>copie</b> de la valeur passée à l’appel : pour <code>ft_stars(3)</code>, <code>n</code> vaut 3 dans ce cadre-là.</p>',
      starter: INC + PUTCHAR + C`
void    ft_stars(int n)
{
    // TODO : affiche n étoiles
    ft_putchar('\n');
}

int    main(void)
{
    ft_stars(3);
    ft_stars(1);
    ft_stars(5);
    ft_stars(0);
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
void    ft_stars(int n)
{
    int    i;

    i = 0;
    while (i < n)
    {
        ft_putchar('*');
        i++;
    }
    ft_putchar('\n');
}

int    main(void)
{
    ft_stars(3);
    ft_stars(1);
    ft_stars(5);
    ft_stars(0);
    return (0);
}
`,
      hints: ['Une boucle qui tourne n fois.', 'int i = 0; while (i < n) { … i++; }', 'Dans la boucle : ft_putchar(\'*\');'],
      tests: [{ expect: '***\n*\n*****\n\n' }],
      rules: { mustCall: ['ft_stars'], forbidCall: NOPRINT, forbidSrc: [{ re: STR + '\\*', msg: 'Une étoile à la fois.' }] }
    },
    {
      id: 'c4_3', ch: 4, ord: 3,
      title: 'Le plus grand',
      story: 'Au tournoi de ping-pong, l’arbitre veut une fonction qui donne le <b>meilleur score</b> de deux joueurs.',
      goal: 'Complète <code>ft_max(a, b)</code> pour qu’elle <b>renvoie</b> le plus grand des deux. Le main affiche :<pre>7\n9\n4</pre>',
      lesson: '<p><code>int ft_max(int a, int b)</code> renvoie un <code>int</code> : <code>return (x);</code> termine la fonction et donne <code>x</code> à celui qui l’a appelée.</p>' +
        '<p>Dans <code>ft_putchar(\'0\' + ft_max(3, 7));</code>, l’appel <code>ft_max(3, 7)</code> est remplacé par la valeur renvoyée.</p>',
      starter: INC + PUTCHAR + C`
int    ft_max(int a, int b)
{
    // TODO : renvoie le plus grand
    return (a);
}

int    main(void)
{
    ft_putchar('0' + ft_max(3, 7));
    ft_putchar('\n');
    ft_putchar('0' + ft_max(9, 2));
    ft_putchar('\n');
    ft_putchar('0' + ft_max(4, 4));
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
int    ft_max(int a, int b)
{
    if (a > b)
        return (a);
    return (b);
}

int    main(void)
{
    ft_putchar('0' + ft_max(3, 7));
    ft_putchar('\n');
    ft_putchar('0' + ft_max(9, 2));
    ft_putchar('\n');
    ft_putchar('0' + ft_max(4, 4));
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['Compare a et b avec un if.', 'Si a > b, renvoie a ; sinon renvoie b.', 'if (a > b) return (a); return (b);'],
      tests: [{ expect: '7\n9\n4\n' }],
      rules: { mustCall: ['ft_max'], forbidCall: NOPRINT }
    },
    {
      id: 'c4_4', ch: 4, ord: 4,
      title: 'La fonction ft_putstr',
      story: 'Le club d’échecs veut afficher ses annonces sans compter les octets à chaque fois. Il lui faut <code>ft_putstr</code> : afficher une chaîne <b>jusqu’à son <code>\\0</code></b>.',
      goal: 'Complète <code>ft_putstr(char *s)</code> : elle affiche les caractères de <code>s</code> un par un jusqu’au <code>\\0</code>. Le main affiche :<pre>Club echecs\nSalle B12\nA+</pre>',
      lesson: '<p><code>s</code> contient l’<b>adresse</b> de la première lettre. <code>s[i]</code> est la lettre numéro <code>i</code>, et <code>&amp;s[i]</code> son adresse.</p>' +
        '<pre>i = 0;\nwhile (s[i] != \'\\0\')\n{\n    write(1, &amp;s[i], 1);\n    i++;\n}</pre>',
      starter: INC + C`void    ft_putstr(char *s)
{
    int    i;

    i = 0;
    // TODO : affiche s[i] tant que ce n'est pas '\0'
}

int    main(void)
{
    ft_putstr("Club echecs\n");
    ft_putstr("Salle B12\n");
    ft_putstr("");
    ft_putstr("A+\n");
    return (0);
}
`,
      solution: INC + PUTSTR + C`
int    main(void)
{
    ft_putstr("Club echecs\n");
    ft_putstr("Salle B12\n");
    ft_putstr("");
    ft_putstr("A+\n");
    return (0);
}
`,
      hints: ['Une boucle while qui s’arrête sur \'\\0\'.', 'Dans la boucle : write(1, &s[i], 1); puis i++;', 'while (s[i] != \'\\0\') { write(1, &s[i], 1); i++; }'],
      tests: [{ expect: 'Club echecs\nSalle B12\nA+\n' }],
      rules: { mustCall: ['ft_putstr', 'write'], forbidCall: NOPRINT.concat(['strlen']) },
      scene: 'ruler', sceneOpts: { v: 's', i: 'i' }
    },
    {
      id: 'c4_5', ch: 4, ord: 5,
      title: 'Le compteur de lettres',
      story: 'Le linguiste du campus étudie les mots : combien de <b>a</b> dans « abracadabra » ? Il lui faut une fonction qui compte un caractère dans une chaîne.',
      goal: 'Complète <code>ft_count_char(s, c)</code> : elle renvoie le nombre de fois où <code>c</code> apparaît dans <code>s</code>. Le main affiche :<pre>2\n5\n0\n4</pre>',
      lesson: '<p>On combine le <b>parcours</b> d’une chaîne (jusqu’au <code>\\0</code>) et un <b>compteur</b> : on avance <code>i</code> sur chaque lettre, et on augmente le compteur quand <code>s[i] == c</code>.</p>',
      starter: INC + PUTNBR + C`
int    ft_count_char(char *s, char c)
{
    int    count;

    count = 0;
    // TODO : parcours s et compte les c
    return (count);
}

int    main(void)
{
    ft_putnbr(ft_count_char("banane", 'a'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("abracadabra", 'a'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("42 Origins", 'z'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("mississippi", 's'));
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    ft_count_char(char *s, char c)
{
    int    count;
    int    i;

    count = 0;
    i = 0;
    while (s[i] != '\0')
    {
        if (s[i] == c)
            count++;
        i++;
    }
    return (count);
}

int    main(void)
{
    ft_putnbr(ft_count_char("banane", 'a'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("abracadabra", 'a'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("42 Origins", 'z'));
    write(1, "\n", 1);
    ft_putnbr(ft_count_char("mississippi", 's'));
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Il te faut un indice i en plus du compteur.', 'while (s[i] != \'\\0\') { … i++; }', 'Dans la boucle : if (s[i] == c) count++;'],
      tests: [{ expect: '2\n5\n0\n4\n' }],
      rules: { mustCall: ['ft_count_char'], forbidCall: NOPRINT.concat(['strchr']) }
    },
    {
      id: 'c4_6', ch: 4, ord: 6,
      title: 'Le haut-parleur',
      story: 'Le haut-parleur du hall ne lit que les <b>majuscules</b>. Il faut une fonction qui transforme une chaîne en majuscules, <b>directement dans sa mémoire</b>.',
      goal: 'Complète <code>ft_strupcase(char *s)</code> : chaque minuscule (de <code>\'a\'</code> à <code>\'z\'</code>) devient majuscule, le reste ne change pas. Le main affiche :<pre>BONJOUR 42 !\nSALLE B12</pre><code>toupper</code> est interdite.',
      lesson: '<p>Quand on passe un tableau à une fonction, elle reçoit son <b>adresse</b> : en modifiant <code>s[i]</code>, elle modifie le tableau du <code>main</code>.</p>' +
        '<p>Une lettre est minuscule si <code>s[i] &gt;= \'a\' &amp;&amp; s[i] &lt;= \'z\'</code> (<code>&amp;&amp;</code> = « et »).</p>',
      starter: INC + PUTSTR + C`
void    ft_strupcase(char *s)
{
    // TODO : passe les minuscules en majuscules
}

int    main(void)
{
    char    a[] = "bonjour 42 !\n";
    char    b[] = "Salle b12\n";

    ft_strupcase(a);
    ft_putstr(a);
    ft_strupcase(b);
    ft_putstr(b);
    return (0);
}
`,
      solution: INC + PUTSTR + C`
void    ft_strupcase(char *s)
{
    int    i;

    i = 0;
    while (s[i] != '\0')
    {
        if (s[i] >= 'a' && s[i] <= 'z')
            s[i] = s[i] - 32;
        i++;
    }
}

int    main(void)
{
    char    a[] = "bonjour 42 !\n";
    char    b[] = "Salle b12\n";

    ft_strupcase(a);
    ft_putstr(a);
    ft_strupcase(b);
    ft_putstr(b);
    return (0);
}
`,
      hints: ['Parcours s jusqu’au \\0, comme dans ft_putstr.', 'Ne touche que les lettres entre \'a\' et \'z\' (les espaces, chiffres, ! restent).', 'if (s[i] >= \'a\' && s[i] <= \'z\') s[i] = s[i] - 32;'],
      tests: [{ expect: 'BONJOUR 42 !\nSALLE B12\n' }],
      rules: { mustCall: ['ft_strupcase'], forbidCall: NOPRINT.concat(['toupper']), forbidSrc: [{ re: STR + '[A-Z]{2}', msg: 'Ne change pas les textes du main : c’est la fonction qui convertit.' }] }
    },
    {
      id: 'c4_7', ch: 4, ord: 7,
      title: 'L’ordre du dictionnaire',
      story: 'La bibliothécaire range les livres par ordre alphabétique. Elle a besoin de <code>ft_strcmp</code> : comparer deux mots <b>lettre par lettre</b>.',
      goal: 'Complète <code>ft_strcmp(s1, s2)</code> : elle avance tant que les lettres sont égales (et que <code>s1</code> n’est pas finie), puis renvoie <code>s1[i] - s2[i]</code>. Le main affiche :<pre>egal\navant\napres\navant\negal</pre><code>strcmp</code> est interdite.',
      lesson: '<p>On compare les codes ASCII : <code>"chat"</code> et <code>"chien"</code> diffèrent à l’indice 2, <code>\'a\' - \'i\'</code> est <b>négatif</b> → « chat » vient avant.</p>' +
        '<p>Si un mot est le début de l’autre (« chat » / « chats »), on compare le <code>\\0</code> (0) à <code>\'s\'</code> : négatif aussi. Résultat 0 = mots identiques.</p>',
      starter: INC + PUTSTR + C`
int    ft_strcmp(char *s1, char *s2)
{
    int    i;

    i = 0;
    // TODO : avance tant que s1[i] == s2[i] et que s1[i] != '\0'
    return (0);
}

void    ft_compare(char *s1, char *s2)
{
    int    r;

    r = ft_strcmp(s1, s2);
    if (r == 0)
        ft_putstr("egal\n");
    else if (r < 0)
        ft_putstr("avant\n");
    else
        ft_putstr("apres\n");
}

int    main(void)
{
    ft_compare("chat", "chat");
    ft_compare("chat", "chien");
    ft_compare("zebre", "abeille");
    ft_compare("chat", "chats");
    ft_compare("", "");
    return (0);
}
`,
      solution: INC + PUTSTR + C`
int    ft_strcmp(char *s1, char *s2)
{
    int    i;

    i = 0;
    while (s1[i] != '\0' && s1[i] == s2[i])
        i++;
    return (s1[i] - s2[i]);
}

void    ft_compare(char *s1, char *s2)
{
    int    r;

    r = ft_strcmp(s1, s2);
    if (r == 0)
        ft_putstr("egal\n");
    else if (r < 0)
        ft_putstr("avant\n");
    else
        ft_putstr("apres\n");
}

int    main(void)
{
    ft_compare("chat", "chat");
    ft_compare("chat", "chien");
    ft_compare("zebre", "abeille");
    ft_compare("chat", "chats");
    ft_compare("", "");
    return (0);
}
`,
      hints: ['La boucle s’arrête à la première différence ou à la fin de s1.', 'while (s1[i] != \'\\0\' && s1[i] == s2[i]) i++;', 'Puis : return (s1[i] - s2[i]);'],
      tests: [{ expect: 'egal\navant\napres\navant\negal\n' }],
      rules: { mustCall: ['ft_strcmp'], forbidCall: NOPRINT.concat(['strcmp', 'strncmp']) }
    },
    {
      id: 'c4_8', ch: 4, ord: 8,
      title: 'Le graveur de badges',
      story: 'Le graveur de badges copie le nom d’un étudiant dans sa mémoire avant de l’imprimer. Mais quand il grave un nom <b>plus court</b> que le précédent, des restes de l’ancien apparaissent…',
      goal: 'Complète <code>ft_strcpy(dest, src)</code> : copie toutes les lettres de <code>src</code> dans <code>dest</code>, <b>puis le <code>\\0</code></b>, et renvoie <code>dest</code>. Le main affiche :<pre>Badge 0042\nOK</pre>',
      lesson: '<p>Si on oublie de copier le <code>\\0</code>, la chaîne <code>dest</code> continue avec ce qui restait en mémoire : <code>"OK\\n"</code> copié par-dessus <code>"Badge 0042\\n"</code> donne <code>"OK\\nge 0042\\n"</code>. Avance pas à pas pour le voir !</p>' +
        '<p><code>ft_strcpy</code> renvoie <code>dest</code> pour qu’on puisse l’utiliser directement : <code>ft_putstr(ft_strcpy(buf, "…"))</code>.</p>',
      starter: INC + PUTSTR + C`
char    *ft_strcpy(char *dest, char *src)
{
    int    i;

    i = 0;
    while (src[i] != '\0')
    {
        dest[i] = src[i];
        i++;
    }
    // TODO : il manque quelque chose à la fin de dest
    return (dest);
}

int    main(void)
{
    char    buf[20] = {0};

    ft_putstr(ft_strcpy(buf, "Badge 0042\n"));
    ft_strcpy(buf, "OK\n");
    ft_putstr(buf);
    return (0);
}
`,
      solution: INC + PUTSTR + C`
char    *ft_strcpy(char *dest, char *src)
{
    int    i;

    i = 0;
    while (src[i] != '\0')
    {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
    return (dest);
}

int    main(void)
{
    char    buf[20] = {0};

    ft_putstr(ft_strcpy(buf, "Badge 0042\n"));
    ft_strcpy(buf, "OK\n");
    ft_putstr(buf);
    return (0);
}
`,
      hints: ['La boucle s’arrête avant de copier le \\0.', 'Après la boucle, i est l’indice où doit aller la fin de chaîne.', 'dest[i] = \'\\0\';'],
      tests: [{ expect: 'Badge 0042\nOK\n' }],
      rules: { mustCall: ['ft_strcpy'], forbidCall: NOPRINT.concat(['strcpy', 'strncpy', 'memcpy', 'memset', 'bzero', 'strdup']) }
    },
    {
      id: 'c4_9', ch: 4, ord: 9,
      title: 'Le tableau des scores',
      story: 'Le tableau des scores du tournoi doit afficher <b>n’importe quel</b> nombre : 0, des milliers, et même des scores négatifs (pénalités !). Il te faut <code>ft_putnbr</code>.',
      goal: 'Complète <code>ft_putnbr(int n)</code> pour qu’elle affiche un entier quelconque (positif, négatif ou nul). Le main affiche :<pre>0\n42\n-7\n2024\n-1000</pre>',
      lesson: '<p>Idée <b>récursive</b> : pour afficher 2024, on affiche d’abord 202 (<code>n / 10</code>) avec… <code>ft_putnbr</code> elle-même, puis le dernier chiffre <code>n % 10</code>. On s’arrête quand <code>n &lt; 10</code>.</p>' +
        '<p>Pour un négatif : on affiche <code>-</code>, puis on continue avec <code>-n</code>. Regarde les cadres s’empiler sur la pile.</p>',
      starter: INC + PUTCHAR + C`
void    ft_putnbr(int n)
{
    // TODO : gérer les négatifs et les nombres à plusieurs chiffres
    ft_putchar('0' + n);
}

int    main(void)
{
    ft_putnbr(0);
    ft_putchar('\n');
    ft_putnbr(42);
    ft_putchar('\n');
    ft_putnbr(-7);
    ft_putchar('\n');
    ft_putnbr(2024);
    ft_putchar('\n');
    ft_putnbr(-1000);
    ft_putchar('\n');
    return (0);
}
`,
      solution: INC + PUTCHAR + C`
void    ft_putnbr(int n)
{
    if (n < 0)
    {
        ft_putchar('-');
        n = -n;
    }
    if (n >= 10)
        ft_putnbr(n / 10);
    ft_putchar('0' + n % 10);
}

int    main(void)
{
    ft_putnbr(0);
    ft_putchar('\n');
    ft_putnbr(42);
    ft_putchar('\n');
    ft_putnbr(-7);
    ft_putchar('\n');
    ft_putnbr(2024);
    ft_putchar('\n');
    ft_putnbr(-1000);
    ft_putchar('\n');
    return (0);
}
`,
      hints: ['Commence par le signe : if (n < 0) { ft_putchar(\'-\'); n = -n; }', 'Ensuite, si n >= 10, affiche d’abord n / 10 avec ft_putnbr.', 'Enfin : ft_putchar(\'0\' + n % 10);'],
      tests: [{ expect: '0\n42\n-7\n2024\n-1000\n' }],
      rules: { mustCall: ['ft_putnbr'], forbidCall: NOPRINT }
    },

    /* ===================== Chapitre 5 — Lire l'entrée ===================== */
    {
      id: 'c5_1', ch: 5, ord: 1,
      title: 'La touche du clavier',
      story: 'La borne d’accueil demande d’appuyer sur une touche, puis l’affiche à l’écran pour confirmer. Pour l’instant elle affiche toujours <b>?</b>.',
      goal: 'Lis <b>un</b> caractère sur l’entrée standard avec <code>read(0, &amp;c, 1)</code> puis affiche :<pre>Touche : a⏎</pre>(avec la touche tapée à la place de <code>a</code>).',
      lesson: '<p><code>read(0, &amp;c, 1)</code> est le contraire de <code>write</code> : il prend <b>1 octet</b> sur le descripteur <b>0</b> (stdin, le clavier) et le range à l’adresse <code>&amp;c</code>.</p>' +
        '<p>Change le texte de l’onglet <b>⌨ Entrée (stdin)</b> pour essayer d’autres touches.</p>',
      stdin: 'a\n',
      starter: INC + C`int    main(void)
{
    char    c;

    c = '?';
    // TODO : lis un caractère dans c
    write(1, "Touche : ", 9);
    write(1, &c, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    c;

    c = '?';
    read(0, &c, 1);
    write(1, "Touche : ", 9);
    write(1, &c, 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['read a les mêmes arguments que write : fd, adresse, taille.', 'Le clavier est le descripteur 0.', 'read(0, &c, 1);'],
      tests: [{ stdin: 'a\n', expect: 'Touche : a\n' }, { stdin: 'Z\n', expect: 'Touche : Z\n' }, { stdin: '7', expect: 'Touche : 7\n' }],
      rules: { mustCall: ['read', 'write'], forbidCall: NOPRINT }
    },
    {
      id: 'c5_2', ch: 5, ord: 2,
      title: 'Combien d’octets ?',
      story: 'Le facteur du campus pèse chaque message avant de l’envoyer : il veut savoir combien d’<b>octets</b> il contient, retour à la ligne compris.',
      goal: 'Lis l’entrée avec <code>read(0, buffer, 100)</code> et affiche le <b>nombre d’octets lus</b> (la valeur renvoyée par <code>read</code>) suivi de <code>\\n</code>. Pour <code>Bonjour⏎</code> :<pre>8⏎</pre>',
      lesson: '<p><code>n = read(0, buffer, 100);</code> lit <b>au plus</b> 100 octets et <b>renvoie</b> combien il en a vraiment lu. À la fin de l’entrée, il renvoie 0.</p>' +
        '<p>Attention, les accents comptent double : <code>Zoé⏎</code> fait 5 octets.</p>',
      stdin: 'Bonjour\n',
      starter: INC + PUTNBR + C`
int    main(void)
{
    char    buffer[100];
    int     n;

    n = 0;
    // TODO : lis l'entrée dans buffer et garde le résultat de read dans n
    ft_putnbr(n);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    main(void)
{
    char    buffer[100];
    int     n;

    n = read(0, buffer, 100);
    ft_putnbr(n);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['read renvoie un nombre : range-le dans n.', 'Le tableau buffer reçoit les octets.', 'n = read(0, buffer, 100);'],
      tests: [{ stdin: 'Bonjour\n', expect: '8\n' }, { stdin: 'Zoé\n', expect: '5\n' }, { stdin: 'Rendez-vous a 14h\n', expect: '18\n' }, { stdin: '', expect: '0\n' }],
      rules: { mustCall: ['read'], forbidCall: NOPRINT.concat(['strlen']) }
    },
    {
      id: 'c5_3', ch: 5, ord: 3,
      title: 'Le crieur du hall',
      story: 'Le crieur du hall répète les annonces qu’on lui donne… mais toujours en <b>MAJUSCULES</b>, pour que tout le monde entende.',
      goal: 'Lis l’annonce avec <code>read</code>, passe ses minuscules en majuscules, puis affiche-la :<pre>RDV A 14H⏎</pre>pour l’entrée <code>rdv a 14h⏎</code>.',
      lesson: '<p><code>read</code> n’ajoute <b>pas</b> de <code>\\0</code> ! Impossible donc de s’arrêter sur le <code>\\0</code> : on parcourt les <code>n</code> octets lus avec <code>i &lt; n</code>.</p>',
      stdin: 'rdv a 14h\n',
      starter: INC + C`int    main(void)
{
    char    buf[100];
    int     n;
    int     i;

    n = read(0, buf, 100);
    i = 0;
    // TODO : passe buf[0] … buf[n - 1] en majuscules
    write(1, buf, n);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    buf[100];
    int     n;
    int     i;

    n = read(0, buf, 100);
    i = 0;
    while (i < n)
    {
        if (buf[i] >= 'a' && buf[i] <= 'z')
            buf[i] = buf[i] - 32;
        i++;
    }
    write(1, buf, n);
    return (0);
}
`,
      hints: ['Une boucle while (i < n).', 'Comme ft_strupcase, mais la boucle s’arrête à n, pas au \\0.', 'if (buf[i] >= \'a\' && buf[i] <= \'z\') buf[i] = buf[i] - 32;'],
      tests: [{ stdin: 'rdv a 14h\n', expect: 'RDV A 14H\n' }, { stdin: 'salut\n', expect: 'SALUT\n' }, { stdin: 'Cafe Ouvert !\n', expect: 'CAFE OUVERT !\n' }],
      rules: { mustCall: ['read', 'write'], forbidCall: NOPRINT.concat(['toupper']) }
    },
    {
      id: 'c5_4', ch: 5, ord: 4,
      title: 'Le nom entre crochets',
      story: 'L’imprimante d’étiquettes met chaque prénom <b>entre crochets</b>. Problème : le <code>\\n</code> de la touche Entrée se retrouve à l’intérieur et casse l’étiquette.',
      goal: 'Lis le prénom puis affiche-le entre crochets, <b>sans</b> le <code>\\n</code> final :<pre>[Alice]⏎</pre>Attention : parfois l’entrée n’a pas de <code>\\n</code> à la fin.',
      lesson: '<p>Le dernier octet lu est <code>buf[n - 1]</code>. S’il vaut <code>\'\\n\'</code>, il suffit d’enlever 1 à <code>n</code> pour ne pas l’afficher.</p>' +
        '<p>Vérifie d’abord que <code>n &gt; 0</code> : avec une entrée vide, <code>buf[-1]</code> serait en dehors du tableau !</p>',
      stdin: 'Alice\n',
      starter: INC + C`int    main(void)
{
    char    buf[100];
    int     n;

    n = read(0, buf, 100);
    // TODO : si le dernier octet est '\n', ne le compte pas
    write(1, "[", 1);
    write(1, buf, n);
    write(1, "]\n", 2);
    return (0);
}
`,
      solution: INC + C`int    main(void)
{
    char    buf[100];
    int     n;

    n = read(0, buf, 100);
    if (n > 0 && buf[n - 1] == '\n')
        n--;
    write(1, "[", 1);
    write(1, buf, n);
    write(1, "]\n", 2);
    return (0);
}
`,
      hints: ['Le dernier octet lu est buf[n - 1].', 'S’il vaut \'\\n\', fais n--.', 'if (n > 0 && buf[n - 1] == \'\\n\') n--;'],
      tests: [{ stdin: 'Alice\n', expect: '[Alice]\n' }, { stdin: 'Zoé\n', expect: '[Zoé]\n' }, { stdin: 'Eve', expect: '[Eve]\n' }, { stdin: 'Maximilien\n', expect: '[Maximilien]\n' }],
      rules: { mustCall: ['read', 'write'], forbidCall: NOPRINT }
    },
    {
      id: 'c5_5', ch: 5, ord: 5,
      title: 'Le chiffre doublé',
      story: 'À la boulangerie, le client tape le nombre de baguettes (un seul chiffre) et la machine en prépare… le <b>double</b>, c’est la promo du jour.',
      goal: 'Lis <b>un</b> chiffre, transforme le caractère en nombre, et affiche son double :<pre>14⏎</pre>pour l’entrée <code>7⏎</code>.',
      lesson: '<p>Le caractère <code>\'7\'</code> vaut 55, pas 7 ! Pour obtenir le <b>nombre</b>, on enlève le code de <code>\'0\'</code> : <code>\'7\' - \'0\'</code> = 55 − 48 = 7.</p>' +
        '<p>C’est l’inverse de <code>\'0\' + 7</code> vu au chapitre 2.</p>',
      stdin: '7\n',
      starter: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     n;

    read(0, &c, 1);
    n = c;
    // TODO : n doit être le nombre, pas le code ASCII
    ft_putnbr(n * 2);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     n;

    read(0, &c, 1);
    n = c - '0';
    ft_putnbr(n * 2);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['n = c donne le code ASCII (55 pour \'7\').', 'Enlève le code du caractère \'0\'.', 'n = c - \'0\';'],
      tests: [{ stdin: '7\n', expect: '14\n' }, { stdin: '3\n', expect: '6\n' }, { stdin: '0\n', expect: '0\n' }, { stdin: '9', expect: '18\n' }],
      rules: { mustCall: ['read'], forbidCall: NOPRINT.concat(['atoi']) }
    },
    {
      id: 'c5_6', ch: 5, ord: 6,
      title: 'Le atoi maison',
      story: 'Au guichet des tickets, le client tape son numéro et la machine appelle <b>le suivant</b>. Mais un numéro peut avoir plusieurs chiffres : il faut convertir toute la chaîne en nombre.',
      goal: 'Lis un nombre (positif) tapé au clavier, convertis-le en <code>int</code> chiffre par chiffre, puis affiche ce nombre <b>+ 1</b> :<pre>42⏎</pre>pour l’entrée <code>41⏎</code>. <code>atoi</code> est interdite.',
      lesson: '<p>Pour lire « 413 » de gauche à droite : on part de 0, et pour chaque chiffre on fait <code>n = n * 10 + (chiffre)</code> :</p>' +
        '<p>0 → 0×10+4 = <b>4</b> → 4×10+1 = <b>41</b> → 41×10+3 = <b>413</b>.</p>' +
        '<p>On s’arrête dès que le caractère n’est plus entre <code>\'0\'</code> et <code>\'9\'</code> (par exemple sur le <code>\\n</code>) ou qu’on a lu les <code>lus</code> octets.</p>',
      stdin: '41\n',
      starter: INC + PUTNBR + C`
int    main(void)
{
    char    buf[20];
    int     lus;
    int     n;
    int     i;

    lus = read(0, buf, 20);
    n = 0;
    i = 0;
    // TODO : convertis tous les chiffres, pas seulement le premier
    n = buf[0] - '0';
    ft_putnbr(n + 1);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    main(void)
{
    char    buf[20];
    int     lus;
    int     n;
    int     i;

    lus = read(0, buf, 20);
    n = 0;
    i = 0;
    while (i < lus && buf[i] >= '0' && buf[i] <= '9')
    {
        n = n * 10 + (buf[i] - '0');
        i++;
    }
    ft_putnbr(n + 1);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Une boucle tant que buf[i] est un chiffre (et i < lus).', 'À chaque tour : n = n * 10 + (buf[i] - \'0\');', 'while (i < lus && buf[i] >= \'0\' && buf[i] <= \'9\') { n = n * 10 + (buf[i] - \'0\'); i++; }'],
      tests: [{ stdin: '41\n', expect: '42\n' }, { stdin: '999\n', expect: '1000\n' }, { stdin: '7\n', expect: '8\n' }, { stdin: '2023', expect: '2024\n' }],
      rules: { mustCall: ['read'], forbidCall: NOPRINT.concat(['atoi']) }
    },
    {
      id: 'c5_7', ch: 5, ord: 7,
      title: 'La station météo',
      story: 'La station météo du toit reçoit la température avec parfois des <b>espaces</b> devant et un <b>signe</b> <code>+</code> ou <code>-</code>. Elle affiche l’écart avec les 20 degrés idéaux.',
      goal: 'Complète <code>ft_atoi(char *s)</code> : saute les espaces, lis un signe éventuel, puis les chiffres. Le main affiche <code>Ecart : </code> suivi de <code>température − 20</code> :<pre>Ecart : -23⏎</pre>pour l’entrée <code>  -3⏎</code>.',
      lesson: '<p>Un vrai <code>atoi</code> se fait en trois étapes :</p>' +
        '<p>1. avancer tant que <code>s[i] == \' \'</code> ; 2. si <code>s[i]</code> est <code>\'-\'</code>, retenir <code>signe = -1</code> (et avancer aussi sur <code>\'+\'</code>) ; 3. convertir les chiffres comme avant, puis renvoyer <code>n * signe</code>.</p>' +
        '<p>Ici le main ajoute un <code>\\0</code> après les octets lus, pour que <code>buf</code> soit une vraie chaîne.</p>',
      stdin: '  -3\n',
      starter: INC + PUTNBR_NEG + C`
int    ft_atoi(char *s)
{
    int    i;
    int    signe;
    int    n;

    i = 0;
    signe = 1;
    n = 0;
    // TODO : espaces, signe, puis chiffres
    return (n * signe);
}

int    main(void)
{
    char    buf[50];
    int     lus;

    lus = read(0, buf, 49);
    if (lus < 0)
        lus = 0;
    buf[lus] = '\0';
    write(1, "Ecart : ", 8);
    ft_putnbr(ft_atoi(buf) - 20);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR_NEG + C`
int    ft_atoi(char *s)
{
    int    i;
    int    signe;
    int    n;

    i = 0;
    signe = 1;
    n = 0;
    while (s[i] == ' ')
        i++;
    if (s[i] == '-' || s[i] == '+')
    {
        if (s[i] == '-')
            signe = -1;
        i++;
    }
    while (s[i] >= '0' && s[i] <= '9')
    {
        n = n * 10 + (s[i] - '0');
        i++;
    }
    return (n * signe);
}

int    main(void)
{
    char    buf[50];
    int     lus;

    lus = read(0, buf, 49);
    if (lus < 0)
        lus = 0;
    buf[lus] = '\0';
    write(1, "Ecart : ", 8);
    ft_putnbr(ft_atoi(buf) - 20);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['while (s[i] == \' \') i++;', 'if (s[i] == \'-\' || s[i] == \'+\') { if (s[i] == \'-\') signe = -1; i++; }', 'Puis la boucle des chiffres : n = n * 10 + (s[i] - \'0\');'],
      tests: [{ stdin: '  -3\n', expect: 'Ecart : -23\n' }, { stdin: '25\n', expect: 'Ecart : 5\n' }, { stdin: '+20\n', expect: 'Ecart : 0\n' }, { stdin: '   7\n', expect: 'Ecart : -13\n' }],
      rules: { mustCall: ['read', 'ft_atoi'], forbidCall: NOPRINT.concat(['atoi']) }
    },
    {
      id: 'c5_8', ch: 5, ord: 8,
      title: 'Le compteur de lignes',
      story: 'Le scanner de la bibliothèque envoie un texte d’un seul coup, mais le bibliothécaire veut savoir combien de <b>lignes</b> il contient. On va lire l’entrée <b>octet par octet</b> jusqu’à la fin.',
      goal: 'Appelle <code>read(0, &amp;c, 1)</code> dans une boucle tant qu’il renvoie 1, compte les <code>\\n</code>, puis affiche :<pre>Lignes : 3⏎</pre>',
      lesson: '<p>On peut appeler <code>read</code> <b>plusieurs fois</b> : chaque appel reprend là où le précédent s’est arrêté. Quand il n’y a plus rien, <code>read</code> renvoie <b>0</b> : c’est la fin de l’entrée.</p>' +
        '<pre>while (read(0, &amp;c, 1) == 1)\n{\n    …\n}</pre>',
      stdin: 'pomme\npoire\nkiwi\n',
      starter: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     lignes;

    lignes = 0;
    // TODO : lis l'entrée octet par octet et compte les '\n'
    write(1, "Lignes : ", 9);
    ft_putnbr(lignes);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     lignes;

    lignes = 0;
    while (read(0, &c, 1) == 1)
    {
        if (c == '\n')
            lignes++;
    }
    write(1, "Lignes : ", 9);
    ft_putnbr(lignes);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['while (read(0, &c, 1) == 1) { … }', 'Dans la boucle, teste si c vaut \'\\n\'.', 'if (c == \'\\n\') lignes++;'],
      tests: [{ stdin: 'pomme\npoire\nkiwi\n', expect: 'Lignes : 3\n' }, { stdin: 'seul\n', expect: 'Lignes : 1\n' }, { stdin: '', expect: 'Lignes : 0\n' }, { stdin: 'a\n\nb\nfin', expect: 'Lignes : 3\n' }],
      rules: { mustCall: ['read'], forbidCall: NOPRINT, mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Il faut une boucle de lecture.' }] },
    },
    {
      id: 'c5_9', ch: 5, ord: 9,
      title: 'La caisse enregistreuse',
      story: 'À la cafétéria, la caissière tape les prix un par un, <b>un par ligne</b>. La caisse doit lire tout ça et annoncer le <b>total</b>.',
      goal: 'Lis l’entrée octet par octet : construis chaque nombre chiffre par chiffre, et à chaque <code>\\n</code> ajoute-le au total. Pour l’entrée <code>12⏎30⏎</code> :<pre>Total : 42⏎</pre>',
      lesson: '<p>On mélange les deux dernières missions : une boucle de <code>read(0, &amp;c, 1)</code>, et la conversion <code>n = n * 10 + (c - \'0\')</code>.</p>' +
        '<p>Quand on lit un <code>\\n</code>, le nombre en cours est terminé : on l’ajoute à <code>total</code> et on remet <code>n</code> à 0. Attention au dernier nombre s’il n’y a pas de <code>\\n</code> à la fin !</p>',
      stdin: '12\n30\n',
      starter: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     n;
    int     total;

    n = 0;
    total = 0;
    while (read(0, &c, 1) == 1)
    {
        // TODO : un chiffre → complète n ; un '\n' → ajoute n au total
    }
    write(1, "Total : ", 8);
    ft_putnbr(total);
    write(1, "\n", 1);
    return (0);
}
`,
      solution: INC + PUTNBR + C`
int    main(void)
{
    char    c;
    int     n;
    int     total;

    n = 0;
    total = 0;
    while (read(0, &c, 1) == 1)
    {
        if (c >= '0' && c <= '9')
            n = n * 10 + (c - '0');
        else if (c == '\n')
        {
            total = total + n;
            n = 0;
        }
    }
    total = total + n;
    write(1, "Total : ", 8);
    ft_putnbr(total);
    write(1, "\n", 1);
    return (0);
}
`,
      hints: ['Si c est un chiffre : n = n * 10 + (c - \'0\');', 'Si c est \'\\n\' : total = total + n; puis n = 0;', 'Après la boucle, ajoute aussi le dernier n (s’il n’y avait pas de \\n final).'],
      tests: [{ stdin: '12\n30\n', expect: 'Total : 42\n' }, { stdin: '5\n5\n5\n5\n', expect: 'Total : 20\n' }, { stdin: '250\n', expect: 'Total : 250\n' }, { stdin: '100\n23\n7', expect: 'Total : 130\n' }],
      rules: { mustCall: ['read'], forbidCall: NOPRINT.concat(['atoi']), mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Il faut une boucle de lecture.' }] },
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
