/* =========================================================================
 *  42 ORIGINS — missions C, chapitres 6 à 10 (missions 1 à 9 de chaque chapitre)
 *  Chaque mission décrit un gabarit de code (tpl) avec des trous @1@, @2@…
 *  remplis soit par la version « départ » (starter), soit par la solution.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.c = O42.missions.c || [];

  /* fabrique starter / solution à partir du gabarit et des trous */
  function M(m) {
    if (m.tpl) {
      var fill = function (k) {
        return m.tpl.replace(/@(\d+)@/g, function (_, n) { return m.parts[+n - 1][k]; });
      };
      m.starter = fill(0);
      m.solution = fill(1);
      delete m.tpl;
      delete m.parts;
    }
    return m;
  }

  /* lecture d'une ligne de stdin dans buf, sans le \n final */
  var LIRE = `\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tif (n > 0 && buf[n - 1] == '\\n')
\t\tn--;
\tbuf[n] = '\\0';
`;

  /* affichage d'un tableau d'int : « 1 2 3⏎ » */
  var AFFICHER = `void\tafficher(int *tab, int size)
{
\tint\ti;

\ti = 0;
\twhile (i < size)
\t{
\t\tprintf("%d", tab[i]);
\t\tif (i < size - 1)
\t\t\tprintf(" ");
\t\ti++;
\t}
\tprintf("\\n");
}
`;

  var WAGON = `typedef struct s_wagon
{
\tint\t\t\t\tpoids;
\tstruct s_wagon\t*next;
}\tt_wagon;
`;

  var NOUVEAU = `t_wagon\t*nouveau_wagon(int poids)
{
\tt_wagon\t*w;

\tw = malloc(sizeof(t_wagon));
\tif (w == NULL)
\t\treturn (NULL);
\tw->poids = poids;
\tw->next = NULL;
\treturn (w);
}
`;

  var DEVANT = `void\tajouter_devant(t_wagon **tete, int poids)
{
\tt_wagon\t*w;

\tw = nouveau_wagon(poids);
\tw->next = *tete;
\t*tete = w;
}
`;

  var VIDER = `void\tvider(t_wagon *cur)
{
\tt_wagon\t*suivant;

\twhile (cur != NULL)
\t{
\t\tsuivant = cur->next;
\t\tfree(cur);
\t\tcur = suivant;
\t}
}
`;

  var MONTRER = `void\tmontrer(t_wagon *cur)
{
\twhile (cur != NULL)
\t{
\t\tprintf("[%d]-", cur->poids);
\t\tcur = cur->next;
\t}
\tprintf("NULL\\n");
}
`;

  /* lit les nombres de stdin et les accroche devant (ordre inverse) */
  var CHARGER = `t_wagon\t*charger(void)
{
\tt_wagon\t*tete;
\tchar\tbuf[100];
\tint\t\tn;
\tint\t\ti;

\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\ttete = NULL;
\ti = 0;
\twhile (buf[i])
\t{
\t\tif (buf[i] >= '0' && buf[i] <= '9')
\t\t{
\t\t\tajouter_devant(&tete, atoi(buf + i));
\t\t\twhile (buf[i] >= '0' && buf[i] <= '9')
\t\t\t\ti++;
\t\t}
\t\telse
\t\t\ti++;
\t}
\treturn (tete);
}
`;

  O42.missions.c.push(

    /* ===================== Chapitre 6 : Algorithmes sur place ===================== */
    M({
      id: 'c6_1', ch: 6, ord: 1,
      title: 'L’échange des badges',
      story: 'Les deux gardiens du campus, celui du <b>matin</b> et celui du <b>soir</b>, veulent échanger leurs horaires. La fonction <code>ft_swap</code> doit échanger deux variables… qui appartiennent au <code>main</code>.',
      goal: 'Complète <code>ft_swap(int *a, int *b)</code> pour échanger les deux valeurs pointées. Sortie attendue :<pre>avant : matin=7 soir=19⏎\naprès : matin=19 soir=7⏎\nx=-5 y=42⏎</pre>',
      lesson: '<p>Si on passait <code>matin</code> et <code>soir</code> par valeur, la fonction ne recevrait que des <b>copies</b>. On lui donne donc leurs <b>adresses</b> : <code>ft_swap(&amp;matin, &amp;soir)</code>.</p>' +
        '<p>Dans la fonction, <code>*a</code> désigne la case pointée par <code>a</code> : la variable <code>matin</code> du main elle-même. Avec une 3e variable :</p><pre>tmp = *a;\n*a = *b;\n*b = tmp;</pre>',
      tpl: `#include <stdio.h>

void\tft_swap(int *a, int *b)
{
\tint\ttmp;

@1@}

int\tmain(void)
{
\tint\tmatin;
\tint\tsoir;
\tint\tx;
\tint\ty;

\tmatin = 7;
\tsoir = 19;
\tprintf("avant : matin=%d soir=%d\\n", matin, soir);
\tft_swap(&matin, &soir);
\tprintf("après : matin=%d soir=%d\\n", matin, soir);
\tx = 42;
\ty = -5;
\tft_swap(&x, &y);
\tprintf("x=%d y=%d\\n", x, y);
\treturn (0);
}
`,
      parts: [[`\t// TODO : échange les valeurs pointées par a et b
`, `\ttmp = *a;
\t*a = *b;
\t*b = tmp;
`]],
      hints: ['Il faut une variable tmp pour ne pas perdre la première valeur.', 'tmp = *a; puis *a = *b;', 'tmp = *a; *a = *b; *b = tmp;'],
      tests: [{ expect: 'avant : matin=7 soir=19\naprès : matin=19 soir=7\nx=-5 y=42\n' }],
      rules: { mustCall: ['ft_swap'] }
    }),

    M({
      id: 'c6_2', ch: 6, ord: 2,
      title: 'Le colis le plus lourd',
      story: 'Au quai de livraison, le chef veut savoir quel colis est le <b>plus lourd</b> de chaque camion avant de charger le monte-charge.',
      goal: 'Complète <code>ft_max(int *tab, int size)</code> qui renvoie la plus grande valeur du tableau. Sortie attendue :<pre>42⏎\n-2⏎\n9⏎\n100⏎</pre>',
      lesson: '<p>On garde le « meilleur candidat » dans une variable <code>max</code>, initialisée avec la <b>première case</b> (et pas 0 : tous les nombres pourraient être négatifs !).</p>' +
        '<p>Puis on parcourt les autres cases : si <code>tab[i] &gt; max</code>, on a trouvé mieux, on remplace.</p>',
      tpl: `#include <stdio.h>

int\tft_max(int *tab, int size)
{
\tint\tmax;
\tint\ti;

\tmax = tab[0];
\ti = 1;
@1@\treturn (max);
}

int\tmain(void)
{
\tint\ta[] = {3, 17, 8, 42, 5};
\tint\tb[] = {-7, -2, -9};
\tint\tc[] = {9};
\tint\td[] = {1, 2, 3, 100};

\tprintf("%d\\n", ft_max(a, 5));
\tprintf("%d\\n", ft_max(b, 3));
\tprintf("%d\\n", ft_max(c, 1));
\tprintf("%d\\n", ft_max(d, 4));
\treturn (0);
}
`,
      parts: [[`\t// TODO : parcours le tableau et garde la plus grande valeur dans max
`, `\twhile (i < size)
\t{
\t\tif (tab[i] > max)
\t\t\tmax = tab[i];
\t\ti++;
\t}
`]],
      hints: ['Une boucle while (i < size).', 'Dans la boucle : if (tab[i] > max) max = tab[i];', 'N’oublie pas i++ à chaque tour.'],
      tests: [{ expect: '42\n-2\n9\n100\n' }],
      rules: { mustCall: ['ft_max'], mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Il faut une boucle pour parcourir le tableau.' }] }
    }),

    M({
      id: 'c6_3', ch: 6, ord: 3,
      title: 'Le casier perdu',
      story: 'Un étudiant a oublié où est son casier. Il donne son numéro au concierge (sur l’entrée standard), qui cherche dans la rangée des casiers à <b>quelle place</b> il se trouve.',
      goal: 'Complète <code>ft_find(tab, size, val)</code> : elle renvoie l’<b>indice</b> de la première case qui vaut <code>val</code>, ou <code>-1</code> si elle n’existe pas. Pour l’entrée <code>42</code> :<pre>casier 42 : place 3⏎</pre>Pour un numéro absent : <pre>casier introuvable⏎</pre>',
      lesson: '<p>La <b>recherche linéaire</b> regarde les cases une par une. Dès qu’on trouve, on peut faire <code>return (i);</code> tout de suite : la fonction s’arrête là.</p>' +
        '<p>Si la boucle arrive au bout sans trouver, on renvoie une valeur impossible pour un indice : <code>-1</code>.</p>',
      stdin: '42\n',
      tpl: `#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int\tft_find(int *tab, int size, int val)
{
\tint\ti;

\ti = 0;
@1@\treturn (-1);
}

int\tmain(void)
{
\tint\t\tcasiers[] = {104, 17, 256, 42, 8, 73};
\tchar\tbuf[20];
\tint\t\tn;
\tint\t\tnum;
\tint\t\tpos;

\tn = read(0, buf, 19);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tnum = atoi(buf);
\tpos = ft_find(casiers, 6, num);
\tif (pos == -1)
\t\tprintf("casier introuvable\\n");
\telse
\t\tprintf("casier %d : place %d\\n", num, pos);
\treturn (0);
}
`,
      parts: [[`\t// TODO : si tab[i] vaut val, renvoie i ; sinon passe à la case suivante
`, `\twhile (i < size)
\t{
\t\tif (tab[i] == val)
\t\t\treturn (i);
\t\ti++;
\t}
`]],
      hints: ['while (i < size) { … i++; }', 'Dans la boucle : if (tab[i] == val) return (i);', 'Si la boucle se termine, on arrive au return (-1) déjà écrit.'],
      tests: [{ stdin: '42\n', expect: 'casier 42 : place 3\n' }, { stdin: '104\n', expect: 'casier 104 : place 0\n' }, { stdin: '73\n', expect: 'casier 73 : place 5\n' }, { stdin: '5\n', expect: 'casier introuvable\n' }],
      rules: { mustCall: ['ft_find'] }
    }),

    M({
      id: 'c6_4', ch: 6, ord: 4,
      title: 'La pile d’assiettes',
      story: 'À la cantine, les assiettes numérotées ont été empilées dans le mauvais sens. Retourne la pile <b>sur place</b>, sans utiliser de deuxième tableau.',
      goal: 'Complète <code>ft_rev_int_tab(int *tab, int size)</code> qui inverse le tableau dans sa propre mémoire. Sortie attendue :<pre>5 4 3 2 1⏎\n40 30 20 10⏎\n7⏎</pre>',
      lesson: '<p>On échange la case <code>i</code> avec sa « jumelle » de l’autre côté : <code>size - 1 - i</code>. Il suffit d’aller jusqu’à la <b>moitié</b> (<code>i &lt; size / 2</code>) : au-delà, on remettrait tout dans l’ordre de départ !</p>' +
        '<p>Avec 5 cases : on échange [0]↔[4], [1]↔[3], et la case [2] du milieu ne bouge pas.</p>',
      tpl: `#include <stdio.h>

void\tft_rev_int_tab(int *tab, int size)
{
\tint\ti;
\tint\ttmp;

\ti = 0;
@1@}

${AFFICHER}
int\tmain(void)
{
\tint\ta[] = {1, 2, 3, 4, 5};
\tint\tb[] = {10, 20, 30, 40};
\tint\tc[] = {7};

\tft_rev_int_tab(a, 5);
\tafficher(a, 5);
\tft_rev_int_tab(b, 4);
\tafficher(b, 4);
\tft_rev_int_tab(c, 1);
\tafficher(c, 1);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que i < size / 2, échange tab[i] et tab[size - 1 - i]
`, `\twhile (i < size / 2)
\t{
\t\ttmp = tab[i];
\t\ttab[i] = tab[size - 1 - i];
\t\ttab[size - 1 - i] = tmp;
\t\ti++;
\t}
`]],
      hints: ['while (i < size / 2) { … }', 'L’échange : tmp = tab[i]; tab[i] = tab[size - 1 - i]; tab[size - 1 - i] = tmp;', 'Et i++ à la fin du tour.'],
      tests: [{ expect: '5 4 3 2 1\n40 30 20 10\n7\n' }],
      rules: { mustCall: ['ft_rev_int_tab'] }
    }),

    M({
      id: 'c6_5', ch: 6, ord: 5,
      title: 'Le mégaphone',
      story: 'Le responsable des annonces veut que tout ce qui passe dans son mégaphone soit en <b>MAJUSCULES</b>. Le texte arrive sur l’entrée standard : transforme-le directement dans le buffer.',
      goal: 'Complète <code>ft_strupcase(char *s)</code> qui change chaque minuscule en majuscule <b>sur place</b>. Pour l’entrée <code>bonjour marvin</code> :<pre>BONJOUR MARVIN⏎</pre><code>toupper</code> est interdite : calcule-le toi-même.',
      lesson: '<p>En ASCII, <code>\'a\'</code> vaut 97 et <code>\'A\'</code> vaut 65 : il y a <b>32</b> d’écart, pour toutes les lettres. Donc pour une minuscule :</p><pre>s[i] = s[i] - 32;</pre>' +
        '<p>Mais attention : seulement si <code>s[i] &gt;= \'a\' &amp;&amp; s[i] &lt;= \'z\'</code>. Les chiffres, espaces et majuscules ne bougent pas.</p>',
      stdin: 'bonjour marvin\n',
      tpl: `#include <unistd.h>

void\tft_strupcase(char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t{
@1@\t\ti++;
\t}
}

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\tn;

\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tft_strupcase(buf);
\twrite(1, buf, n);
\treturn (0);
}
`,
      parts: [[`\t\t// TODO : si s[i] est une minuscule, transforme-la en majuscule
`, `\t\tif (s[i] >= 'a' && s[i] <= 'z')
\t\t\ts[i] = s[i] - 32;
`]],
      hints: ['Teste si la lettre est entre \'a\' et \'z\'.', 'if (s[i] >= \'a\' && s[i] <= \'z\') …', '… s[i] = s[i] - 32;'],
      tests: [{ stdin: 'bonjour marvin\n', expect: 'BONJOUR MARVIN\n' }, { stdin: 'Salle 42, porte b\n', expect: 'SALLE 42, PORTE B\n' }, { stdin: 'deja EN Majuscules ?\n', expect: 'DEJA EN MAJUSCULES ?\n' }],
      rules: { mustCall: ['ft_strupcase'], forbidCall: ['toupper'] }
    }),

    M({
      id: 'c6_6', ch: 6, ord: 6,
      title: 'La photo de classe',
      story: 'Le photographe range les élèves par taille : il passe le long du rang et, chaque fois que deux voisins sont dans le mauvais ordre, il les fait échanger de place. Une <b>passe</b> à la fois.',
      goal: 'Complète <code>une_passe(int *tab, int size)</code> : parcours les voisins <code>tab[i]</code> et <code>tab[i + 1]</code> et échange-les si le premier est plus grand. Le main fait deux passes :<pre>5 1 4 2 8 3⏎\n1 4 2 5 3 8⏎\n1 2 4 3 5 8⏎</pre>',
      lesson: '<p>Après une passe, le plus grand nombre a forcément « remonté » jusqu’au bout du tableau, comme une <b>bulle</b>. C’est le cœur du <b>tri à bulles</b>.</p>' +
        '<p>Attention à la borne : on compare <code>tab[i]</code> avec <code>tab[i + 1]</code>, donc <code>i</code> doit s’arrêter à <code>size - 2</code> (condition <code>i &lt; size - 1</code>), sinon on lit en dehors du tableau !</p>',
      tpl: `#include <stdio.h>

void\tune_passe(int *tab, int size)
{
\tint\ti;
\tint\ttmp;

\ti = 0;
@1@}

${AFFICHER}
int\tmain(void)
{
\tint\trang[] = {5, 1, 4, 2, 8, 3};

\tafficher(rang, 6);
\tune_passe(rang, 6);
\tafficher(rang, 6);
\tune_passe(rang, 6);
\tafficher(rang, 6);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que i < size - 1, si tab[i] > tab[i + 1], échange-les
`, `\twhile (i < size - 1)
\t{
\t\tif (tab[i] > tab[i + 1])
\t\t{
\t\t\ttmp = tab[i];
\t\t\ttab[i] = tab[i + 1];
\t\t\ttab[i + 1] = tmp;
\t\t}
\t\ti++;
\t}
`]],
      hints: ['while (i < size - 1) { … i++; }', 'if (tab[i] > tab[i + 1]) { échange }', 'tmp = tab[i]; tab[i] = tab[i + 1]; tab[i + 1] = tmp;'],
      tests: [{ expect: '5 1 4 2 8 3\n1 4 2 5 3 8\n1 2 4 3 5 8\n' }],
      rules: { mustCall: ['une_passe'] }
    }),

    M({
      id: 'c6_7', ch: 6, ord: 7,
      title: 'Le tri à bulles',
      story: 'Le photographe est content : maintenant il veut le rang <b>entièrement trié</b>, quel que soit le nombre d’élèves. On recommence les passes jusqu’à ce que tout soit en ordre.',
      goal: 'Complète <code>ft_sort_int_tab(int *tab, int size)</code> (tri croissant, sur place). Sortie attendue :<pre>3 7 11 19 25 42⏎\n1 2⏎\n-8 -3 0 10⏎</pre>',
      lesson: '<p>Une passe place le plus grand au bout. Il suffit donc de faire <b>size − 1 passes</b> : deux boucles imbriquées.</p>' +
        '<pre>passe = 0;\nwhile (passe &lt; size - 1)\n{\n    i = 0;\n    while (i &lt; size - 1)\n    {\n        …comparer / échanger…\n        i++;\n    }\n    passe++;\n}</pre>' +
        '<p>Pense à remettre <code>i</code> à 0 au début de chaque passe !</p>',
      tpl: `#include <stdio.h>

void\tft_sort_int_tab(int *tab, int size)
{
\tint\tpasse;
\tint\ti;
\tint\ttmp;

\tpasse = 0;
@1@}

${AFFICHER}
int\tmain(void)
{
\tint\ta[] = {42, 7, 19, 3, 25, 11};
\tint\tb[] = {2, 1};
\tint\tc[] = {-3, 10, -8, 0};

\tft_sort_int_tab(a, 6);
\tafficher(a, 6);
\tft_sort_int_tab(b, 2);
\tafficher(b, 2);
\tft_sort_int_tab(c, 4);
\tafficher(c, 4);
\treturn (0);
}
`,
      parts: [[`\t// TODO : répète size - 1 passes ; dans chaque passe, échange les voisins mal rangés
`, `\twhile (passe < size - 1)
\t{
\t\ti = 0;
\t\twhile (i < size - 1)
\t\t{
\t\t\tif (tab[i] > tab[i + 1])
\t\t\t{
\t\t\t\ttmp = tab[i];
\t\t\t\ttab[i] = tab[i + 1];
\t\t\t\ttab[i + 1] = tmp;
\t\t\t}
\t\t\ti++;
\t\t}
\t\tpasse++;
\t}
`]],
      hints: ['Reprends la boucle de la mission précédente et place-la dans une autre boucle.', 'while (passe < size - 1) { i = 0; while (i < size - 1) { … } passe++; }', 'L’intérieur : if (tab[i] > tab[i + 1]) { tmp = tab[i]; tab[i] = tab[i + 1]; tab[i + 1] = tmp; } i++;'],
      tests: [{ expect: '3 7 11 19 25 42\n1 2\n-8 -3 0 10\n' }],
      rules: { mustCall: ['ft_sort_int_tab'] }
    }),

    M({
      id: 'c6_8', ch: 6, ord: 8,
      title: 'Les anagrammes du bibliothécaire',
      story: 'Le bibliothécaire range ses mots croisés : deux mots sont des <b>anagrammes</b> s’ils ont les mêmes lettres. Son astuce : trier les lettres de chaque mot par ordre alphabétique et comparer.',
      goal: 'Complète <code>ft_sort_letters(char *s)</code> qui trie les lettres de la chaîne <b>sur place</b> (tri à bulles sur des <code>char</code>). Pour l’entrée <code>chien</code> :<pre>cehin⏎</pre>',
      lesson: '<p>Un <code>char</code> est un petit nombre (son code ASCII) : on peut le comparer avec <code>&gt;</code> exactement comme un int. <code>\'a\' &lt; \'b\' &lt; … &lt; \'z\'</code>.</p>' +
        '<p>Ici la taille n’est pas donnée : calcule d’abord la longueur <code>len</code> de la chaîne, puis applique le tri à bulles de la mission précédente.</p>',
      stdin: 'chien\n',
      tpl: `#include <unistd.h>
#include <stdio.h>

void\tft_sort_letters(char *s)
{
\tint\t\tlen;
\tint\t\tpasse;
\tint\t\ti;
\tchar\ttmp;

\tlen = 0;
\twhile (s[len])
\t\tlen++;
\tpasse = 0;
@1@}

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\tn;

${LIRE}\tft_sort_letters(buf);
\tprintf("%s\\n", buf);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tri à bulles sur les len lettres de s
`, `\twhile (passe < len - 1)
\t{
\t\ti = 0;
\t\twhile (i < len - 1)
\t\t{
\t\t\tif (s[i] > s[i + 1])
\t\t\t{
\t\t\t\ttmp = s[i];
\t\t\t\ts[i] = s[i + 1];
\t\t\t\ts[i + 1] = tmp;
\t\t\t}
\t\t\ti++;
\t\t}
\t\tpasse++;
\t}
`]],
      hints: ['C’est le même tri que ft_sort_int_tab, avec len à la place de size.', 'while (passe < len - 1) { i = 0; while (i < len - 1) { … } passe++; }', 'if (s[i] > s[i + 1]) { tmp = s[i]; s[i] = s[i + 1]; s[i + 1] = tmp; }'],
      tests: [{ stdin: 'chien\n', expect: 'cehin\n' }, { stdin: 'niche\n', expect: 'cehin\n' }, { stdin: 'campus\n', expect: 'acmpsu\n' }, { stdin: 'zebre\n', expect: 'beerz\n' }],
      rules: { mustCall: ['ft_sort_letters'] }
    }),

    M({
      id: 'c6_9', ch: 6, ord: 9,
      title: 'Le code palindrome',
      story: 'Le vieux coffre de la banque n’accepte que les codes qui se lisent <b>pareil dans les deux sens</b> (des palindromes, comme « kayak »). Écris le vérificateur avec deux indices qui se rapprochent.',
      goal: 'Complète <code>ft_is_palindrome(char *s)</code> : elle renvoie 1 si la chaîne est un palindrome, 0 sinon. Le main lit le code et affiche :<pre>kayak : OUVERT⏎</pre>ou <code>campus : FERME⏎</code>.',
      lesson: '<p>Même technique que pour inverser une chaîne : <code>i</code> part du début, <code>j</code> de la fin. Au lieu d’échanger, on <b>compare</b> :</p>' +
        '<pre>while (i &lt; j)\n{\n    if (s[i] != s[j])\n        return (0);\n    i++;\n    j--;\n}\nreturn (1);</pre>' +
        '<p>Dès qu’une paire diffère, inutile de continuer. Regarde <code>i</code> et <code>j</code> se croiser sous le coffre.</p>',
      stdin: 'kayak\n',
      scene: 'vault', sceneOpts: { v: 's', i: 'i', j: 'j' },
      tpl: `#include <unistd.h>
#include <stdio.h>

int\tft_is_palindrome(char *s)
{
\tint\ti;
\tint\tj;

\ti = 0;
\tj = 0;
\twhile (s[j] != '\\0')
\t\tj++;
\tj--;
@1@\treturn (1);
}

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\tn;

${LIRE}\tif (ft_is_palindrome(buf))
\t\tprintf("%s : OUVERT\\n", buf);
\telse
\t\tprintf("%s : FERME\\n", buf);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que i < j, compare s[i] et s[j] (différents → return (0))
`, `\twhile (i < j)
\t{
\t\tif (s[i] != s[j])
\t\t\treturn (0);
\t\ti++;
\t\tj--;
\t}
`]],
      hints: ['while (i < j) { … }', 'if (s[i] != s[j]) return (0);', 'Puis i++; j--; — si on sort de la boucle, c’est un palindrome.'],
      tests: [{ stdin: 'kayak\n', expect: 'kayak : OUVERT\n' }, { stdin: 'campus\n', expect: 'campus : FERME\n' }, { stdin: 'abba\n', expect: 'abba : OUVERT\n' }, { stdin: 'abca\n', expect: 'abca : FERME\n' }],
      rules: { mustCall: ['ft_is_palindrome'] }
    }),

    /* ===================== Chapitre 7 : Pointeurs et malloc ===================== */
    M({
      id: 'c7_1', ch: 7, ord: 1,
      title: 'La télécommande',
      story: 'Le casier <code>x</code> contient 10 jetons. Tu n’as pas le droit d’y toucher directement… mais tu as une <b>télécommande</b> : le pointeur <code>p</code>, qui connaît son adresse.',
      goal: 'Sans écrire <code>x = …</code>, mets <b>42</b> dans <code>x</code> en passant par <code>p</code>. Sortie attendue :<pre>x vaut 42⏎\n*p vaut 42⏎</pre>',
      lesson: '<p><code>&amp;x</code> donne l’<b>adresse</b> de x (où il est rangé sur la pile). <code>p = &amp;x;</code> range cette adresse dans le pointeur p : regarde la flèche dans la vue mémoire.</p>' +
        '<p><code>*p</code> veut dire « la case pointée par p ». Donc <code>*p = 42;</code> écrit dans x, sans le nommer !</p>',
      tpl: `#include <stdio.h>

int\tmain(void)
{
\tint\tx;
\tint\t*p;

\tx = 10;
\tp = &x;
@1@\tprintf("x vaut %d\\n", x);
\tprintf("*p vaut %d\\n", *p);
\treturn (0);
}
`,
      parts: [[`\t// TODO : écris 42 dans x en passant par p
`, `\t*p = 42;
`]],
      hints: ['L’étoile devant un pointeur donne accès à la case pointée.', 'Il suffit d’une ligne.', '*p = 42;'],
      tests: [{ expect: 'x vaut 42\n*p vaut 42\n' }],
      rules: { mustSrc: [{ re: '\\*\\s*p\\s*=[^=]', msg: 'Écris dans x en passant par *p.' }], forbidSrc: [{ re: '\\bx\\s*=\\s*42', msg: 'Interdit d’écrire x = 42 : passe par le pointeur p.' }, { re: 'vaut 42', msg: 'Ne recopie pas le résultat dans le printf.' }] }
    }),

    M({
      id: 'c7_2', ch: 7, ord: 2,
      title: 'Le partage des bonbons',
      story: 'Le marchand de bonbons partage <b>a</b> bonbons entre <b>b</b> enfants. Une fonction ne peut renvoyer qu’une valeur… or il en veut deux : la part de chacun <b>et</b> le reste. Solution : lui donner deux adresses où écrire.',
      goal: 'Complète <code>ft_div_mod(a, b, div, mod)</code> : elle range <code>a / b</code> dans <code>*div</code> et <code>a % b</code> dans <code>*mod</code>. Pour l’entrée <code>17 5</code> :<pre>17 = 5 x 3 + 2⏎</pre>',
      lesson: '<p>Le main passe <code>&amp;q</code> et <code>&amp;r</code> : la fonction reçoit les adresses de ses variables et peut donc les <b>remplir</b>. On appelle ça des paramètres de « sortie ».</p>' +
        '<p><code>a / b</code> est la division entière (17 / 5 = 3) et <code>a % b</code> le reste (17 % 5 = 2).</p>',
      stdin: '17 5\n',
      tpl: `#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

void\tft_div_mod(int a, int b, int *div, int *mod)
{
@1@}

int\tmain(void)
{
\tchar\tbuf[50];
\tint\t\tn;
\tint\t\ti;
\tint\t\tq;
\tint\t\tr;

\tn = read(0, buf, 49);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\ti = 0;
\twhile (buf[i] && buf[i] != ' ')
\t\ti++;
\tq = 0;
\tr = 0;
\tft_div_mod(atoi(buf), atoi(buf + i), &q, &r);
\tprintf("%d = %d x %d + %d\\n", atoi(buf), atoi(buf + i), q, r);
\treturn (0);
}
`,
      parts: [[`\t// TODO : range a / b dans *div et a % b dans *mod
`, `\t*div = a / b;
\t*mod = a % b;
`]],
      hints: ['*div est la variable q du main.', '*div = a / b;', '*mod = a % b;'],
      tests: [{ stdin: '17 5\n', expect: '17 = 5 x 3 + 2\n' }, { stdin: '42 4\n', expect: '42 = 4 x 10 + 2\n' }, { stdin: '30 6\n', expect: '30 = 6 x 5 + 0\n' }],
      rules: { mustCall: ['ft_div_mod'] }
    }),

    M({
      id: 'c7_3', ch: 7, ord: 3,
      title: 'Le facteur pressé',
      story: 'Le facteur ne veut pas compter les maisons avec un indice : il <b>avance lui-même</b> d’une porte à l’autre. Écris <code>ft_putstr</code> en déplaçant le pointeur, sans crochets.',
      goal: 'Complète <code>ft_putstr(char *s)</code> en utilisant seulement <code>*s</code> et <code>s++</code> (les crochets <code>[ ]</code> sont interdits). Sortie attendue :<pre>Le facteur passe⏎\nrue des Pointeurs⏎\nau numero 42⏎</pre>',
      lesson: '<p><code>s</code> contient l’adresse d’une lettre. <code>*s</code> est la lettre elle-même, et <code>s++</code> fait avancer l’adresse d’<b>un octet</b> : s pointe alors sur la lettre suivante.</p>' +
        '<p><code>s[i]</code> et <code>*(s + i)</code> sont exactement la même chose. Ici, on modifie directement <code>s</code> (c’est une copie locale du pointeur : le main ne voit pas la différence).</p>',
      tpl: `#include <unistd.h>

void\tft_putstr(char *s)
{
@1@}

int\tmain(void)
{
\tft_putstr("Le facteur passe\\n");
\tft_putstr("rue des Pointeurs\\n");
\tft_putstr("");
\tft_putstr("au numero 42\\n");
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que *s n'est pas '\\0', écris la lettre pointée puis avance s
`, `\twhile (*s != '\\0')
\t{
\t\twrite(1, s, 1);
\t\ts++;
\t}
`]],
      hints: ['while (*s != \'\\0\') { … }', 'write(1, s, 1) écrit l’octet pointé par s.', 'while (*s) { write(1, s, 1); s++; }'],
      tests: [{ expect: 'Le facteur passe\nrue des Pointeurs\nau numero 42\n' }],
      rules: { mustCall: ['write'], forbidCall: ['printf', 'puts', 'strlen'], forbidSrc: [{ re: 's\\s*\\[', msg: 'Sans crochets : utilise *s et s++.' }] }
    }),

    M({
      id: 'c7_4', ch: 7, ord: 4,
      title: 'Le premier pain',
      story: 'Première fournée à la boulangerie du tas ! Réserve la place d’<b>un</b> int avec <code>malloc</code>, mets-y le poids du pain, affiche-le… et rends le plateau avec <code>free</code>.',
      goal: 'Réserve un int sur le tas, range <b>250</b> dans la case pointée, puis affiche :<pre>pain de 250 g⏎</pre>et libère le bloc (aucune fuite).',
      lesson: '<p><code>malloc(sizeof(int))</code> réserve 4 octets sur le <b>tas</b> et renvoie leur adresse. On la range dans un pointeur : <code>pain = malloc(sizeof(int));</code></p>' +
        '<p>Ensuite <code>*pain = 250;</code> écrit dans ce bloc. Quand on n’en a plus besoin : <code>free(pain);</code> — sinon le plateau reste oublié dans le four (<b>fuite</b>).</p>',
      scene: 'bakery', sceneOpts: {},
      tpl: `#include <stdio.h>
#include <stdlib.h>

int\tmain(void)
{
\tint\t*pain;

@1@\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : réserve la place d'un int avec malloc
\t// TODO 2 : range 250 dans la case pointée
\t// TODO 3 : affiche "pain de %d g\\n" avec *pain, puis libère le bloc
`, `\tpain = malloc(sizeof(int));
\tif (pain == NULL)
\t\treturn (1);
\t*pain = 250;
\tprintf("pain de %d g\\n", *pain);
\tfree(pain);
`]],
      hints: ['pain = malloc(sizeof(int));', '*pain = 250; puis printf("pain de %d g\\n", *pain);', 'Et pour finir : free(pain);'],
      tests: [{ expect: 'pain de 250 g\n' }],
      rules: { mustCall: ['malloc', 'free'], mustSrc: [{ re: '\\*\\s*pain\\s*=[^=]', msg: 'Range 250 dans le bloc avec *pain = …' }], forbidSrc: [{ re: '"pain de 250', msg: 'Affiche la valeur du bloc avec %d, pas un texte écrit à la main.' }], noLeaks: true }
    }),

    M({
      id: 'c7_5', ch: 7, ord: 5,
      title: 'La poche à douille',
      story: 'Le pâtissier décore ses gâteaux : il lui faut des rubans de <b>n</b> fois le même caractère, fabriqués sur le tas pour pouvoir les garder.',
      goal: 'Complète <code>ft_repeat(char c, int n)</code> : réserve <code>n + 1</code> octets, remplis-les avec <code>n</code> fois <code>c</code> et termine par <code>\\0</code>. Sortie attendue :<pre>[*****]⏎\n[ooo]⏎\n[]⏎</pre>Le main libère tout : aucune fuite.',
      lesson: '<p>Une chaîne de n lettres occupe <b>n + 1</b> octets : il faut la place du <code>\\0</code> final, sinon <code>printf("%s")</code> lirait au-delà du bloc.</p>' +
        '<p>Avec <code>n = 0</code> on réserve 1 octet, qui contient juste <code>\\0</code> : la chaîne vide.</p>',
      scene: 'bakery', sceneOpts: { title: 'PÂTISSERIE DU TAS' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*ft_repeat(char c, int n)
{
\tchar\t*s;
\tint\t\ti;

@1@\treturn (s);
}

int\tmain(void)
{
\tchar\t*a;
\tchar\t*b;
\tchar\t*c;

\ta = ft_repeat('*', 5);
\tb = ft_repeat('o', 3);
\tc = ft_repeat('-', 0);
\tprintf("[%s]\\n[%s]\\n[%s]\\n", a, b, c);
\tfree(a);
\tfree(b);
\tfree(c);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve n + 1 octets, remplis n fois c, termine par '\\0'
\ts = NULL;
\ti = 0;
`, `\ts = malloc(n + 1);
\tif (s == NULL)
\t\treturn (NULL);
\ti = 0;
\twhile (i < n)
\t{
\t\ts[i] = c;
\t\ti++;
\t}
\ts[i] = '\\0';
`]],
      hints: ['s = malloc(n + 1);', 'while (i < n) { s[i] = c; i++; }', 'Après la boucle : s[i] = \'\\0\';'],
      tests: [{ expect: '[*****]\n[ooo]\n[]\n' }],
      rules: { mustCall: ['malloc', 'free', 'ft_repeat'], noLeaks: true }
    }),

    M({
      id: 'c7_6', ch: 7, ord: 6,
      title: 'Le ménage du soir',
      story: 'Le programme de l’inventaire affiche ce qu’il faut… mais le soir, les plateaux s’entassent dans la boulangerie : <b>personne ne les rend</b>. Ton travail : faire le ménage.',
      goal: 'Le code affiche déjà la bonne sortie :<pre>Inventaire⏎\n=⏎\n==⏎\n===⏎\n====⏎</pre>mais il <b>fuit</b>. Ajoute les <code>free</code> au bon endroit (après la dernière utilisation de chaque bloc) pour qu’il n’y ait plus aucune fuite.',
      lesson: '<p>Chaque <code>malloc</code> (et chaque <code>strdup</code>, qui fait un malloc caché) doit avoir <b>son</b> <code>free</code>.</p>' +
        '<p>Dans une boucle qui fabrique un bloc à chaque tour, il faut le libérer <b>dans le même tour</b>, juste après l’avoir utilisé : sinon, au tour suivant, <code>s</code> pointe vers un nouveau bloc et l’ancien est perdu pour toujours.</p>' +
        '<p>Mais pas trop tôt : utiliser un bloc après son <code>free</code> est un <b>use-after-free</b>.</p>',
      scene: 'bakery', sceneOpts: {},
      tpl: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char\t*ft_ligne(int n)
{
\tchar\t*s;
\tint\t\ti;

\ts = malloc(n + 1);
\tif (s == NULL)
\t\treturn (NULL);
\ti = 0;
\twhile (i < n)
\t{
\t\ts[i] = '=';
\t\ti++;
\t}
\ts[i] = '\\0';
\treturn (s);
}

int\tmain(void)
{
\tchar\t*titre;
\tchar\t*s;
\tint\t\tk;

\ttitre = strdup("Inventaire");
\tprintf("%s\\n", titre);
@1@\tk = 1;
\twhile (k <= 4)
\t{
\t\ts = ft_ligne(k);
\t\tprintf("%s\\n", s);
@2@\t\tk++;
\t}
\treturn (0);
}
`,
      parts: [[``, `\tfree(titre);
`], [``, `\t\tfree(s);
`]],
      hints: ['Il y a deux sortes de blocs : titre (fait par strdup) et s (fait par ft_ligne, à chaque tour).', 'free(titre); dès qu’on ne s’en sert plus.', 'Dans la boucle, juste après le printf : free(s);'],
      tests: [{ expect: 'Inventaire\n=\n==\n===\n====\n' }],
      rules: { mustCall: ['free'], noLeaks: true }
    }),

    M({
      id: 'c7_7', ch: 7, ord: 7,
      title: 'Le photocopieur',
      story: 'La photocopieuse du secrétariat recopie un texte <b>lettre par lettre</b> dans une feuille qu’on lui donne : un tableau sur la pile, ou un bloc pris sur le tas.',
      goal: 'Complète <code>ft_strcpy(char *dest, char *src)</code> : copie toutes les lettres de src dans dest, <b>puis le <code>\\0</code></b>, et renvoie dest. Sortie attendue :<pre>recette du pain⏎\nbrioche 42⏎</pre><code>strcpy</code>, <code>strdup</code> et <code>memcpy</code> sont interdites.',
      lesson: '<p>La fonction ne réserve rien : c’est l’appelant qui fournit une zone <b>assez grande</b>. Ici <code>carnet</code> est un tableau de 30 cases sur la pile, et <code>copie</code> un bloc de 11 octets sur le tas (10 lettres + <code>\\0</code>).</p>' +
        '<p>Oublier le <code>\\0</code> final est l’erreur classique : printf continuerait à lire des octets au hasard.</p>',
      scene: 'bakery', sceneOpts: { title: 'SECRÉTARIAT · COPIES' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*ft_strcpy(char *dest, char *src)
{
\tint\ti;

\ti = 0;
@1@\treturn (dest);
}

int\tmain(void)
{
\tchar\tcarnet[30];
\tchar\t*copie;

\tcarnet[0] = '\\0';
\tft_strcpy(carnet, "recette du pain");
\tprintf("%s\\n", carnet);
\tcopie = malloc(11);
\tif (copie == NULL)
\t\treturn (1);
\tft_strcpy(copie, "brioche 42");
\tprintf("%s\\n", copie);
\tfree(copie);
\treturn (0);
}
`,
      parts: [[`\t// TODO : copie chaque lettre de src dans dest, puis le '\\0'
`, `\twhile (src[i] != '\\0')
\t{
\t\tdest[i] = src[i];
\t\ti++;
\t}
\tdest[i] = '\\0';
`]],
      hints: ['while (src[i] != \'\\0\') { … }', 'dest[i] = src[i]; i++;', 'Après la boucle : dest[i] = \'\\0\';'],
      tests: [{ expect: 'recette du pain\nbrioche 42\n' }],
      rules: { mustCall: ['ft_strcpy', 'malloc', 'free'], forbidCall: ['strcpy', 'strdup', 'memcpy', 'strncpy'], noLeaks: true }
    }),

    M({
      id: 'c7_8', ch: 7, ord: 8,
      title: 'Le nom complet',
      story: 'L’imprimerie des badges colle deux morceaux de texte bout à bout : le prénom et le titre. Le résultat doit vivre sur le tas, car il sera gardé après la fonction.',
      goal: 'Complète <code>ft_strjoin(s1, s2)</code> : réserve la place des deux chaînes + 1, copie s1 puis s2 à la suite, termine par <code>\\0</code>. Sortie attendue :<pre>Marvin le robot⏎\n42 Origins⏎\nvide a gauche⏎</pre>Aucune fuite ; <code>strcat</code>, <code>strcpy</code>, <code>strdup</code>, <code>memcpy</code> interdites.',
      lesson: '<p>Deux indices : <code>i</code> parcourt la source, <code>j</code> avance dans le résultat. On copie s1 (j va de 0 à len1), puis s2 en <b>continuant</b> à partir de j.</p>' +
        '<pre>taille = ft_strlen(s1) + ft_strlen(s2) + 1;</pre>' +
        '<p>Le <code>+ 1</code> est pour le <b>seul</b> <code>\\0</code> final (celui de s1 n’est pas recopié).</p>',
      scene: 'bakery', sceneOpts: { title: 'IMPRIMERIE DES BADGES' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

int\t\tft_strlen(char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t\ti++;
\treturn (i);
}

char\t*ft_strjoin(char *s1, char *s2)
{
\tchar\t*res;
\tint\t\ti;
\tint\t\tj;

@1@\treturn (res);
}

int\tmain(void)
{
\tchar\t*a;
\tchar\t*b;
\tchar\t*c;

\ta = ft_strjoin("Marvin", " le robot");
\tb = ft_strjoin("42 ", "Origins");
\tc = ft_strjoin("", "vide a gauche");
\tprintf("%s\\n%s\\n%s\\n", a, b, c);
\tfree(a);
\tfree(b);
\tfree(c);
\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : réserve ft_strlen(s1) + ft_strlen(s2) + 1 octets
\t// TODO 2 : copie s1, puis s2 à la suite, puis le '\\0'
\tres = NULL;
`, `\tres = malloc(ft_strlen(s1) + ft_strlen(s2) + 1);
\tif (res == NULL)
\t\treturn (NULL);
\tj = 0;
\ti = 0;
\twhile (s1[i])
\t{
\t\tres[j] = s1[i];
\t\ti++;
\t\tj++;
\t}
\ti = 0;
\twhile (s2[i])
\t{
\t\tres[j] = s2[i];
\t\ti++;
\t\tj++;
\t}
\tres[j] = '\\0';
`]],
      hints: ['res = malloc(ft_strlen(s1) + ft_strlen(s2) + 1);', 'j = 0; i = 0; while (s1[i]) { res[j] = s1[i]; i++; j++; }', 'Puis i = 0; même boucle avec s2 ; enfin res[j] = \'\\0\';'],
      tests: [{ expect: 'Marvin le robot\n42 Origins\nvide a gauche\n' }],
      rules: { mustCall: ['ft_strjoin', 'malloc', 'free'], forbidCall: ['strcat', 'strcpy', 'strdup', 'memcpy', 'strncpy'], noLeaks: true }
    }),

    M({
      id: 'c7_9', ch: 7, ord: 9,
      title: 'Le miroir de la vitrine',
      story: 'La boulangère écrit ses mots sur la vitrine pour qu’on les lise <b>de l’extérieur</b>… donc à l’envers. Mais elle veut garder l’original intact : il faut une <b>copie inversée</b> sur le tas.',
      goal: 'Complète <code>ft_miroir(char *s)</code> : elle renvoie un <b>nouveau</b> bloc contenant s à l’envers (s n’est pas modifiée). Pour l’entrée <code>croissant</code> :<pre>croissant -> tnassiorc⏎</pre>Aucune fuite.',
      lesson: '<p>Au chapitre 6 on inversait <b>sur place</b>. Ici on fabrique une copie : la lettre <code>i</code> du miroir est la lettre <code>len - 1 - i</code> de l’original.</p>' +
        '<pre>m[i] = s[len - 1 - i];</pre>' +
        '<p>Comme pour strdup : <code>len + 1</code> octets et un <code>\\0</code> à la fin. Le main affiche les deux chaînes puis libère le miroir.</p>',
      stdin: 'croissant\n',
      scene: 'bakery', sceneOpts: {},
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\t\tft_strlen(char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t\ti++;
\treturn (i);
}

char\t*ft_miroir(char *s)
{
\tchar\t*m;
\tint\t\tlen;
\tint\t\ti;

\tlen = ft_strlen(s);
@1@\treturn (m);
}

int\tmain(void)
{
\tchar\tbuf[100];
\tchar\t*m;
\tint\t\tn;

${LIRE}\tm = ft_miroir(buf);
\tprintf("%s -> %s\\n", buf, m);
\tfree(m);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve len + 1 octets ; m[i] = s[len - 1 - i] ; termine par '\\0'
\tm = NULL;
\ti = 0;
`, `\tm = malloc(len + 1);
\tif (m == NULL)
\t\treturn (NULL);
\ti = 0;
\twhile (i < len)
\t{
\t\tm[i] = s[len - 1 - i];
\t\ti++;
\t}
\tm[i] = '\\0';
`]],
      hints: ['m = malloc(len + 1);', 'while (i < len) { m[i] = s[len - 1 - i]; i++; }', 'N’oublie pas m[len] = \'\\0\';'],
      tests: [{ stdin: 'croissant\n', expect: 'croissant -> tnassiorc\n' }, { stdin: 'ABC\n', expect: 'ABC -> CBA\n' }, { stdin: 'x\n', expect: 'x -> x\n' }],
      rules: { mustCall: ['ft_miroir', 'malloc', 'free'], forbidCall: ['strdup'], noLeaks: true }
    }),

    /* ===================== Chapitre 8 : Tableaux dynamiques ===================== */
    M({
      id: 'c8_1', ch: 8, ord: 1,
      title: 'Les cinq tickets',
      story: 'La billetterie du parc ouvre : il faut imprimer <b>5 tickets</b> numérotés 10, 20, 30, 40, 50, rangés dans un tableau d’int sur le tas.',
      goal: 'Réserve 5 int avec malloc, remplis <code>t[k] = (k + 1) * 10</code>. Le main affiche puis libère :<pre>10 20 30 40 50 ⏎</pre>',
      lesson: '<p>Un int fait 4 octets : pour 5 int, <code>malloc(sizeof(int) * 5)</code> (20 octets). Ensuite le pointeur s’utilise <b>comme un tableau</b> : <code>t[0]</code>, <code>t[1]</code>…</p>' +
        '<p>Dans la scène, chaque ticket est une case de 4 octets du bloc.</p>',
      scene: 'tickets', sceneOpts: {},
      tpl: `#include <stdio.h>
#include <stdlib.h>

int\tmain(void)
{
\tint\t*t;
\tint\tk;

@1@\tk = 0;
\twhile (k < 5)
\t{
@2@\t\tk++;
\t}
\tk = 0;
\twhile (k < 5)
\t{
\t\tprintf("%d ", t[k]);
\t\tk++;
\t}
\tprintf("\\n");
\tfree(t);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve 5 int sur le tas
\tt = NULL;
`, `\tt = malloc(sizeof(int) * 5);
\tif (t == NULL)
\t\treturn (1);
`], [`\t\t// TODO : range (k + 1) * 10 dans t[k]
`, `\t\tt[k] = (k + 1) * 10;
`]],
      hints: ['t = malloc(sizeof(int) * 5);', 'Dans la première boucle : t[k] = (k + 1) * 10;', 'Ne fais pas malloc(5) : ça ne réserve que 5 octets !'],
      tests: [{ expect: '10 20 30 40 50 \n' }],
      rules: { mustCall: ['malloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c8_2', ch: 8, ord: 2,
      title: 'La caisse du soir',
      story: 'Le soir, la caissière du parc additionne la recette : les visiteurs ont payé 1, 2, 3… jusqu’à <b>n</b> pièces. Le nombre n arrive sur l’entrée standard.',
      goal: 'Dans <code>ft_suite</code>, réserve <code>n</code> int (la boucle de remplissage est fournie). Puis complète <code>ft_somme</code>. Pour l’entrée <code>5</code> :<pre>somme de 1 a 5 = 15⏎</pre>',
      lesson: '<p>La taille d’un tableau sur la pile doit être connue en écrivant le code. Avec <code>malloc</code>, elle peut dépendre de ce que tape l’utilisateur : <code>malloc(sizeof(int) * n)</code>.</p>' +
        '<p>Une fonction qui reçoit <code>int *t</code> ne sait pas combien de cases il y a : on lui passe toujours la taille <code>n</code> à côté.</p>',
      stdin: '5\n',
      scene: 'tickets', sceneOpts: { title: 'CAISSE DU PARC' },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\t*ft_suite(int n)
{
\tint\t*t;
\tint\tk;

@1@\tk = 0;
\twhile (k < n)
\t{
\t\tt[k] = k + 1;
\t\tk++;
\t}
\treturn (t);
}

int\tft_somme(int *t, int n)
{
\tint\ttotal;
\tint\tk;

\ttotal = 0;
\tk = 0;
@2@\treturn (total);
}

int\tmain(void)
{
\tchar\tbuf[20];
\tint\t\t*t;
\tint\t\tn;

\tn = read(0, buf, 19);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tn = atoi(buf);
\tt = ft_suite(n);
\tprintf("somme de 1 a %d = %d\\n", n, ft_somme(t, n));
\tfree(t);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve n int sur le tas
\tt = NULL;
`, `\tt = malloc(sizeof(int) * n);
\tif (t == NULL)
\t\treturn (NULL);
`], [`\t// TODO : additionne les n cases de t dans total
`, `\twhile (k < n)
\t{
\t\ttotal = total + t[k];
\t\tk++;
\t}
`]],
      hints: ['t = malloc(sizeof(int) * n);', 'Dans ft_somme : while (k < n) { … }', 'total = total + t[k]; k++;'],
      tests: [{ stdin: '5\n', expect: 'somme de 1 a 5 = 15\n' }, { stdin: '10\n', expect: 'somme de 1 a 10 = 55\n' }, { stdin: '1\n', expect: 'somme de 1 a 1 = 1\n' }],
      rules: { mustCall: ['malloc', 'free', 'ft_somme'], noLeaks: true }
    }),

    M({
      id: 'c8_3', ch: 8, ord: 3,
      title: 'La copie du professeur',
      story: 'Le professeur veut ajouter un bonus de 2 points à toutes les notes… mais garder l’<b>original</b> pour l’administration. Il lui faut une vraie copie du tableau, sur le tas.',
      goal: 'Complète <code>ft_tabdup(int *src, int n)</code> qui renvoie une copie neuve du tableau. Le main modifie la copie seulement :<pre>notes : 12 8 15 10⏎\nbonus : 14 10 17 12⏎</pre>',
      lesson: '<p><code>int *bonus = notes;</code> ne copie <b>rien</b> : les deux noms pointeraient sur les mêmes cases, et le bonus modifierait l’original !</p>' +
        '<p>Pour une vraie copie : un nouveau bloc (<code>malloc(sizeof(int) * n)</code>) puis une boucle qui recopie chaque case. Compare les adresses dans la vue mémoire : pile d’un côté, tas de l’autre.</p>',
      scene: 'tickets', sceneOpts: { title: 'NOTES + BONUS' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

int\t*ft_tabdup(int *src, int n)
{
\tint\t*copie;
\tint\tk;

@1@\treturn (copie);
}

void\tafficher(char *titre, int *t, int n)
{
\tint\tk;

\tprintf("%s :", titre);
\tk = 0;
\twhile (k < n)
\t{
\t\tprintf(" %d", t[k]);
\t\tk++;
\t}
\tprintf("\\n");
}

int\tmain(void)
{
\tint\tnotes[] = {12, 8, 15, 10};
\tint\t*bonus;
\tint\tk;

\tbonus = ft_tabdup(notes, 4);
\tk = 0;
\twhile (k < 4)
\t{
\t\tbonus[k] = bonus[k] + 2;
\t\tk++;
\t}
\tafficher("notes", notes, 4);
\tafficher("bonus", bonus, 4);
\tfree(bonus);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve n int, puis copie src[k] dans copie[k]
\tcopie = NULL;
`, `\tcopie = malloc(sizeof(int) * n);
\tif (copie == NULL)
\t\treturn (NULL);
\tk = 0;
\twhile (k < n)
\t{
\t\tcopie[k] = src[k];
\t\tk++;
\t}
`]],
      hints: ['copie = malloc(sizeof(int) * n);', 'k = 0; while (k < n) { … k++; }', 'Dans la boucle : copie[k] = src[k];'],
      tests: [{ expect: 'notes : 12 8 15 10\nbonus : 14 10 17 12\n' }],
      rules: { mustCall: ['ft_tabdup', 'malloc', 'free'], forbidCall: ['memcpy', 'memmove'], forbidSrc: [{ re: '=\\s*notes\\s*;', msg: 'bonus = notes ne fait pas de copie : il faut un nouveau bloc.' }], noLeaks: true }
    }),

    M({
      id: 'c8_4', ch: 8, ord: 4,
      title: 'Les tables paires',
      story: 'Pour la fête du campus, seules les tables à numéro <b>pair</b> sont près de la scène. L’organisatrice veut leur liste dans un tableau <b>juste à la bonne taille</b>.',
      goal: 'Complète <code>ft_garder_pairs(t, n, &amp;taille)</code> : compte les pairs, range ce nombre dans <code>*taille</code>, réserve exactement ce nombre d’int et copie-les. Sortie attendue :<pre>4 table(s) : 12 8 20 6⏎\n1 table(s) : 4⏎</pre>',
      lesson: '<p>On fait <b>deux passages</b> : le premier compte (pour savoir combien réserver), le second copie. Il faut alors deux indices : <code>k</code> dans <code>t</code> et <code>j</code> dans le résultat.</p>' +
        '<p>La fonction renvoie le tableau ET sa taille : la taille passe par un pointeur (<code>int *taille</code>), comme pour ft_div_mod.</p>' +
        '<p>Un nombre est pair si <code>x % 2 == 0</code>.</p>',
      scene: 'tickets', sceneOpts: { title: 'TABLES PRÈS DE LA SCÈNE' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

int\t*ft_garder_pairs(int *t, int n, int *taille)
{
\tint\t*res;
\tint\tk;
\tint\tj;

\t*taille = 0;
\tk = 0;
@1@\treturn (res);
}

void\tmontrer(int *t, int n)
{
\tint\t*p;
\tint\ttaille;
\tint\tk;

\tp = ft_garder_pairs(t, n, &taille);
\tprintf("%d table(s) :", taille);
\tk = 0;
\twhile (k < taille)
\t{
\t\tprintf(" %d", p[k]);
\t\tk++;
\t}
\tprintf("\\n");
\tfree(p);
}

int\tmain(void)
{
\tint\ta[] = {7, 12, 3, 8, 20, 5, 6};
\tint\tb[] = {1, 3, 4};

\tmontrer(a, 7);
\tmontrer(b, 3);
\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : compte les nombres pairs de t dans *taille
\t// TODO 2 : réserve *taille int, puis copie les pairs dans res (indice j)
\tres = NULL;
`, `\twhile (k < n)
\t{
\t\tif (t[k] % 2 == 0)
\t\t\t*taille = *taille + 1;
\t\tk++;
\t}
\tres = malloc(sizeof(int) * *taille);
\tif (res == NULL)
\t\treturn (NULL);
\tj = 0;
\tk = 0;
\twhile (k < n)
\t{
\t\tif (t[k] % 2 == 0)
\t\t{
\t\t\tres[j] = t[k];
\t\t\tj++;
\t\t}
\t\tk++;
\t}
`]],
      hints: ['1er passage : while (k < n) { if (t[k] % 2 == 0) *taille = *taille + 1; k++; }', 'res = malloc(sizeof(int) * *taille);', '2e passage avec j = 0 et k = 0 : if (t[k] % 2 == 0) { res[j] = t[k]; j++; }'],
      tests: [{ expect: '4 table(s) : 12 8 20 6\n1 table(s) : 4\n' }],
      rules: { mustCall: ['ft_garder_pairs', 'malloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c8_5', ch: 8, ord: 5,
      title: 'L’élection du délégué',
      story: 'Quatre candidats (numérotés 0 à 3) se présentent au poste de délégué. Les bulletins arrivent sur l’entrée standard, un chiffre par vote. À toi de <b>dépouiller</b>.',
      goal: 'Réserve 4 compteurs <b>à zéro</b> avec <code>calloc</code>, puis ajoute 1 au bon compteur pour chaque chiffre lu. Pour <code>1 3 1 2 1 0 3</code> :<pre>candidat 0 : 1 voix⏎\ncandidat 1 : 3 voix⏎\ncandidat 2 : 1 voix⏎\ncandidat 3 : 2 voix⏎</pre>',
      lesson: '<p><code>calloc(4, sizeof(int))</code> réserve 4 int comme malloc, mais les <b>met à 0</b> (avec malloc, ils contiendraient n’importe quoi : hachuré dans la vue mémoire).</p>' +
        '<p>Astuce : le caractère <code>\'3\'</code> devient l’indice 3 avec <code>buf[i] - \'0\'</code>. Donc <code>votes[buf[i] - \'0\']++;</code> ajoute une voix au bon candidat.</p>',
      stdin: '1 3 1 2 1 0 3\n',
      scene: 'tickets', sceneOpts: { title: 'URNE · DÉPOUILLEMENT' },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\t*votes;
\tint\t\tn;
\tint\t\ti;

\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
@1@\ti = 0;
\twhile (buf[i])
\t{
@2@\t\ti++;
\t}
\ti = 0;
\twhile (i < 4)
\t{
\t\tprintf("candidat %d : %d voix\\n", i, votes[i]);
\t\ti++;
\t}
\tfree(votes);
\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : réserve 4 compteurs à 0 avec calloc
\tvotes = NULL;
`, `\tvotes = calloc(4, sizeof(int));
\tif (votes == NULL)
\t\treturn (1);
`], [`\t\t// TODO 2 : si buf[i] est entre '0' et '3', ajoute 1 à votes[buf[i] - '0']
`, `\t\tif (buf[i] >= '0' && buf[i] <= '3')
\t\t\tvotes[buf[i] - '0']++;
`]],
      hints: ['votes = calloc(4, sizeof(int));', 'if (buf[i] >= \'0\' && buf[i] <= \'3\') …', '… votes[buf[i] - \'0\']++;'],
      tests: [{ stdin: '1 3 1 2 1 0 3\n', expect: 'candidat 0 : 1 voix\ncandidat 1 : 3 voix\ncandidat 2 : 1 voix\ncandidat 3 : 2 voix\n' }, { stdin: '2 2 2\n', expect: 'candidat 0 : 0 voix\ncandidat 1 : 0 voix\ncandidat 2 : 3 voix\ncandidat 3 : 0 voix\n' }, { stdin: '0 1 2 3 3 3 0\n', expect: 'candidat 0 : 2 voix\ncandidat 1 : 1 voix\ncandidat 2 : 1 voix\ncandidat 3 : 3 voix\n' }],
      rules: { mustCall: ['calloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c8_6', ch: 8, ord: 6,
      title: 'La file du food-truck',
      story: 'Devant le food-truck, la file s’allonge : à chaque client, le tableau des tickets doit <b>grandir d’une case</b>. Mais un bloc malloc ne grandit pas tout seul…',
      goal: 'Complète <code>ajouter(t, n, v)</code> : réserve <code>n + 1</code> int, recopie les n anciens, mets <code>v</code> à la fin, <b>libère l’ancien</b> tableau et renvoie le nouveau. Pour <code>5 12 7 30</code> :<pre>4 client(s) : 5 12 7 30⏎</pre><code>realloc</code> interdite, aucune fuite.',
      lesson: '<p>Pour agrandir un tableau du tas, on fait ce que fait <code>realloc</code> en coulisses : <b>nouveau bloc</b> plus grand, <b>copie</b>, <b>free</b> de l’ancien.</p>' +
        '<p>Au premier appel, <code>t</code> vaut NULL et <code>n</code> vaut 0 : la copie ne fait rien et <code>free(NULL)</code> est autorisé (ça ne fait rien non plus).</p>' +
        '<p>Regarde les blocs défiler dans la vue du tas : un seul reste vivant à la fois.</p>',
      stdin: '5 12 7 30\n',
      scene: 'tickets', sceneOpts: { title: 'FOOD-TRUCK · FILE' },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\t*ajouter(int *t, int n, int v)
{
\tint\t*nouveau;
\tint\tk;

@1@}

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\t*t;
\tint\t\tn;
\tint\t\ti;
\tint\t\tk;

\tk = read(0, buf, 99);
\tif (k < 0)
\t\tk = 0;
\tbuf[k] = '\\0';
\tt = NULL;
\tn = 0;
\ti = 0;
\twhile (buf[i])
\t{
\t\tif (buf[i] >= '0' && buf[i] <= '9')
\t\t{
\t\t\tt = ajouter(t, n, atoi(buf + i));
\t\t\tn++;
\t\t\twhile (buf[i] >= '0' && buf[i] <= '9')
\t\t\t\ti++;
\t\t}
\t\telse
\t\t\ti++;
\t}
\tprintf("%d client(s) :", n);
\tk = 0;
\twhile (k < n)
\t{
\t\tprintf(" %d", t[k]);
\t\tk++;
\t}
\tprintf("\\n");
\tfree(t);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve n + 1 int, copie les n anciens, mets v à la fin,
\t//        libère l'ancien tableau, renvoie le nouveau
\treturn (t);
`, `\tnouveau = malloc(sizeof(int) * (n + 1));
\tif (nouveau == NULL)
\t\treturn (t);
\tk = 0;
\twhile (k < n)
\t{
\t\tnouveau[k] = t[k];
\t\tk++;
\t}
\tnouveau[n] = v;
\tfree(t);
\treturn (nouveau);
`]],
      hints: ['nouveau = malloc(sizeof(int) * (n + 1));', 'Copie : while (k < n) { nouveau[k] = t[k]; k++; } puis nouveau[n] = v;', 'Enfin free(t); return (nouveau);'],
      tests: [{ stdin: '5 12 7 30\n', expect: '4 client(s) : 5 12 7 30\n' }, { stdin: '42\n', expect: '1 client(s) : 42\n' }, { stdin: '1 2 3 4 5 6\n', expect: '6 client(s) : 1 2 3 4 5 6\n' }],
      rules: { mustCall: ['ajouter', 'malloc', 'free'], forbidCall: ['realloc', 'memcpy'], noLeaks: true }
    }),

    M({
      id: 'c8_7', ch: 8, ord: 7,
      title: 'Le plan de la salle',
      story: 'L’amphithéâtre a 3 rangées de 4 sièges. Le régisseur veut le <b>plan numéroté</b> : un tableau à deux dimensions, rangée par rangée.',
      goal: 'Remplis <code>salle[r][c]</code> avec le numéro du siège <code>r * 4 + c + 1</code>, puis complète la ligne qui calcule le total de la rangée du milieu. Sortie attendue :<pre>  1  2  3  4⏎\n  5  6  7  8⏎\n  9 10 11 12⏎\nrangee 1 : 26⏎</pre>',
      lesson: '<p><code>int salle[3][4];</code> = 3 rangées de 4 int. En mémoire, c’est un seul bloc de 12 int <b>à la suite</b> : la rangée 0, puis la rangée 1, puis la 2.</p>' +
        '<p><code>salle[r][c]</code> : la rangée <code>r</code>, la colonne <code>c</code>. Deux boucles imbriquées les parcourent toutes. <code>%3d</code> affiche le nombre sur 3 caractères (aligné à droite).</p>',
      tpl: `#include <stdio.h>

int\tmain(void)
{
\tint\tsalle[3][4];
\tint\tr;
\tint\tc;
\tint\ttotal;

\tr = 0;
\twhile (r < 3)
\t{
\t\tc = 0;
\t\twhile (c < 4)
\t\t{
@1@\t\t\tc++;
\t\t}
\t\tr++;
\t}
\tr = 0;
\twhile (r < 3)
\t{
\t\tc = 0;
\t\twhile (c < 4)
\t\t{
\t\t\tprintf("%3d", salle[r][c]);
\t\t\tc++;
\t\t}
\t\tprintf("\\n");
\t\tr++;
\t}
\ttotal = 0;
\tc = 0;
\twhile (c < 4)
\t{
@2@\t\tc++;
\t}
\tprintf("rangee 1 : %d\\n", total);
\treturn (0);
}
`,
      parts: [[`\t\t\tsalle[r][c] = 0; // TODO : remplace 0 par le numéro du siège
`, `\t\t\tsalle[r][c] = r * 4 + c + 1;
`], [`\t\t// TODO : ajoute le siège c de la rangée 1 à total
`, `\t\ttotal = total + salle[1][c];
`]],
      hints: ['salle[r][c] = r * 4 + c + 1;', 'La rangée du milieu est la rangée d’indice 1.', 'total = total + salle[1][c];'],
      tests: [{ expect: '  1  2  3  4\n  5  6  7  8\n  9 10 11 12\nrangee 1 : 26\n' }],
      rules: { forbidSrc: [{ re: '"\\s*1\\s+2\\s+3', msg: 'Ne recopie pas le plan à la main : remplis le tableau.' }] }
    }),

    M({
      id: 'c8_8', ch: 8, ord: 8,
      title: 'La table de multiplication',
      story: 'L’instituteur du campus junior veut des tables de multiplication de <b>n’importe quelle taille</b>. Une grille n × n sur le tas : un tableau de lignes, chaque ligne étant elle-même un tableau d’int.',
      goal: 'Complète <code>ft_table(n)</code> (une ligne de n int par rangée, <code>t[r][c] = (r + 1) * (c + 1)</code>) et <code>ft_free_table</code>. Pour l’entrée <code>3</code> :<pre>   1   2   3⏎\n   2   4   6⏎\n   3   6   9⏎</pre>Aucune fuite.',
      lesson: '<p><code>int **t</code> est un pointeur vers des pointeurs. D’abord on réserve le tableau des lignes : <code>malloc(sizeof(int *) * n)</code> (8 octets par pointeur), puis <b>chaque ligne</b> : <code>t[r] = malloc(sizeof(int) * n);</code></p>' +
        '<p>Il y a donc <b>n + 1</b> blocs à libérer : chaque ligne d’abord, puis le tableau de lignes en dernier (sinon on perd l’adresse des lignes !).</p>',
      stdin: '3\n',
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\t**ft_table(int n)
{
\tint\t**t;
\tint\tr;
\tint\tc;

\tt = malloc(sizeof(int *) * n);
\tif (t == NULL)
\t\treturn (NULL);
\tr = 0;
\twhile (r < n)
\t{
@1@\t\tr++;
\t}
\treturn (t);
}

void\tft_free_table(int **t, int n)
{
\tint\tr;

\tr = 0;
@2@}

int\tmain(void)
{
\tchar\tbuf[20];
\tint\t\t**t;
\tint\t\tn;
\tint\t\tr;
\tint\t\tc;

\tn = read(0, buf, 19);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tn = atoi(buf);
\tt = ft_table(n);
\tr = 0;
\twhile (r < n)
\t{
\t\tc = 0;
\t\twhile (c < n)
\t\t{
\t\t\tprintf("%4d", t[r][c]);
\t\t\tc++;
\t\t}
\t\tprintf("\\n");
\t\tr++;
\t}
\tft_free_table(t, n);
\treturn (0);
}
`,
      parts: [[`\t\t// TODO : réserve une ligne de n int dans t[r],
\t\t//        puis remplis t[r][c] = (r + 1) * (c + 1)
\t\tt[r] = NULL;
`, `\t\tt[r] = malloc(sizeof(int) * n);
\t\tc = 0;
\t\twhile (c < n)
\t\t{
\t\t\tt[r][c] = (r + 1) * (c + 1);
\t\t\tc++;
\t\t}
`], [`\t// TODO : libère chaque ligne t[r], puis le tableau t lui-même
`, `\twhile (r < n)
\t{
\t\tfree(t[r]);
\t\tr++;
\t}
\tfree(t);
`]],
      hints: ['t[r] = malloc(sizeof(int) * n); puis une boucle sur c.', 't[r][c] = (r + 1) * (c + 1);', 'Libération : while (r < n) { free(t[r]); r++; } free(t);'],
      tests: [{ stdin: '3\n', expect: '   1   2   3\n   2   4   6\n   3   6   9\n' }, { stdin: '5\n', expect: '   1   2   3   4   5\n   2   4   6   8  10\n   3   6   9  12  15\n   4   8  12  16  20\n   5  10  15  20  25\n' }],
      rules: { mustCall: ['ft_table', 'ft_free_table', 'malloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c8_9', ch: 8, ord: 9,
      title: 'Le découpeur de mots',
      story: 'Le traducteur automatique du campus a besoin de découper une phrase en <b>mots</b> : un tableau de chaînes sur le tas, terminé par <code>NULL</code>. C’est un petit <code>ft_split</code>.',
      goal: 'Complète <code>ft_split</code> (séparateurs : espace et <code>\\n</code>) puis la libération dans le main. Pour <code>le chat dort</code> :<pre>1: le⏎\n2: chat⏎\n3: dort⏎</pre>Aucune fuite.',
      lesson: '<p>Le résultat est un <code>char **</code> : un tableau de <code>nb_mots + 1</code> pointeurs (le dernier vaut <code>NULL</code> pour marquer la fin), chacun pointant vers un mot alloué à part.</p>' +
        '<p>Parcours de la phrase : on saute les espaces ; au début d’un mot, on mesure sa longueur, on le copie avec <code>ft_strndup(s + i, len)</code>, puis on avance <code>i</code> de <code>len</code>.</p>' +
        '<p>Libération : chaque mot, puis le tableau.</p>',
      stdin: 'le chat dort\n',
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int\t\test_sep(char c)
{
\treturn (c == ' ' || c == '\\n');
}

int\t\tcompter_mots(char *s)
{
\tint\ti;
\tint\tn;

\ti = 0;
\tn = 0;
\twhile (s[i])
\t{
\t\tif (!est_sep(s[i]) && (i == 0 || est_sep(s[i - 1])))
\t\t\tn++;
\t\ti++;
\t}
\treturn (n);
}

char\t*ft_strndup(char *s, int len)
{
\tchar\t*m;
\tint\t\ti;

\tm = malloc(len + 1);
\tif (m == NULL)
\t\treturn (NULL);
\ti = 0;
\twhile (i < len)
\t{
\t\tm[i] = s[i];
\t\ti++;
\t}
\tm[i] = '\\0';
\treturn (m);
}

char\t**ft_split(char *s)
{
\tchar\t**mots;
\tint\t\ti;
\tint\t\tk;
\tint\t\tlen;

\tmots = malloc(sizeof(char *) * (compter_mots(s) + 1));
\tif (mots == NULL)
\t\treturn (NULL);
\ti = 0;
\tk = 0;
@1@\tmots[k] = NULL;
\treturn (mots);
}

int\tmain(void)
{
\tchar\tbuf[100];
\tchar\t**mots;
\tint\t\tn;
\tint\t\tk;

\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tmots = ft_split(buf);
\tk = 0;
\twhile (mots[k] != NULL)
\t{
\t\tprintf("%d: %s\\n", k + 1, mots[k]);
\t\tk++;
\t}
@2@\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que s[i] : saute les séparateurs ; au début d'un mot,
\t//        mesure len, mots[k] = ft_strndup(s + i, len), k++, i += len
`, `\twhile (s[i])
\t{
\t\tif (est_sep(s[i]))
\t\t\ti++;
\t\telse
\t\t{
\t\t\tlen = 0;
\t\t\twhile (s[i + len] && !est_sep(s[i + len]))
\t\t\t\tlen++;
\t\t\tmots[k] = ft_strndup(s + i, len);
\t\t\tk++;
\t\t\ti = i + len;
\t\t}
\t}
`], [`\t// TODO : libère chaque mot, puis le tableau mots
`, `\tk = 0;
\twhile (mots[k] != NULL)
\t{
\t\tfree(mots[k]);
\t\tk++;
\t}
\tfree(mots);
`]],
      hints: ['Dans ft_split : while (s[i]) { if (est_sep(s[i])) i++; else { … } }', 'Pour un mot : len = 0; while (s[i + len] && !est_sep(s[i + len])) len++; mots[k] = ft_strndup(s + i, len); k++; i = i + len;', 'Dans le main : k = 0; while (mots[k]) { free(mots[k]); k++; } free(mots);'],
      tests: [{ stdin: 'le chat dort\n', expect: '1: le\n2: chat\n3: dort\n' }, { stdin: '  Marvin   aime  le C \n', expect: '1: Marvin\n2: aime\n3: le\n4: C\n' }, { stdin: 'bonjour\n', expect: '1: bonjour\n' }],
      rules: { mustCall: ['ft_split', 'malloc', 'free'], noLeaks: true }
    }),

    /* ===================== Chapitre 9 : Ligne par ligne ===================== */
    M({
      id: 'c9_1', ch: 9, ord: 1,
      title: 'Le premier colis',
      story: 'Le tapis du centre de tri démarre. Pour l’instant, on ne s’occupe que du <b>premier</b> colis : le lire avec <code>get_next_line</code>, l’annoncer… et recycler son emballage.',
      goal: 'Affiche la première ligne de l’entrée précédée de <code>Premier colis : </code>, puis libère-la. Pour l’entrée <code>Paris⏎Lyon⏎</code> :<pre>Premier colis : Paris⏎</pre>',
      lesson: '<p><code>get_next_line(0)</code> lit sur l’entrée standard jusqu’au premier <code>\\n</code> (compris) et renvoie une <b>nouvelle chaîne sur le tas</b>.</p>' +
        '<p>Comme la ligne contient déjà son <code>\\n</code>, <code>printf("Premier colis : %s", ligne)</code> suffit. Et puisque c’est un bloc malloc : <code>free(ligne);</code> !</p>',
      stdin: 'Paris\nLyon\n',
      scene: 'conveyor', sceneOpts: {},
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;

\tligne = get_next_line(0);
@1@\treturn (0);
}
`,
      parts: [[`\t// TODO : affiche "Premier colis : " suivi de la ligne, puis libère-la
`, `\tprintf("Premier colis : %s", ligne);
\tfree(ligne);
`]],
      hints: ['La ligne contient déjà le \\n.', 'printf("Premier colis : %s", ligne);', 'Puis free(ligne);'],
      tests: [{ stdin: 'Paris\nLyon\n', expect: 'Premier colis : Paris\n' }, { stdin: 'Tokyo\n', expect: 'Premier colis : Tokyo\n' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    }),

    M({
      id: 'c9_2', ch: 9, ord: 2,
      title: 'Le compteur du tapis',
      story: 'Le chef du centre de tri veut juste savoir <b>combien</b> de lettres sont arrivées aujourd’hui. Lis-les toutes, compte-les, et recycle chaque enveloppe.',
      goal: 'Lis toutes les lignes avec <code>get_next_line(0)</code> jusqu’à <code>NULL</code> et affiche leur nombre :<pre>3 ligne(s)⏎</pre>Aucune fuite.',
      lesson: '<p>Le schéma classique :</p><pre>ligne = get_next_line(0);\nwhile (ligne != NULL)\n{\n    …\n    free(ligne);\n    ligne = get_next_line(0);\n}</pre>' +
        '<p>Quand il n’y a plus rien, <code>get_next_line</code> renvoie <code>NULL</code> et la boucle s’arrête. La dernière ligne peut ne pas avoir de <code>\\n</code> : elle compte quand même.</p>',
      stdin: 'a\nb\nc\n',
      scene: 'conveyor', sceneOpts: {},
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;
\tint\t\tn;

\tn = 0;
\tligne = get_next_line(0);
@1@\tprintf("%d ligne(s)\\n", n);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que ligne != NULL : compte-la, libère-la, lis la suivante
`, `\twhile (ligne != NULL)
\t{
\t\tn++;
\t\tfree(ligne);
\t\tligne = get_next_line(0);
\t}
`]],
      hints: ['while (ligne != NULL) { … }', 'Dans la boucle : n++; free(ligne);', '… puis ligne = get_next_line(0); pour passer à la suivante.'],
      tests: [{ stdin: 'a\nb\nc\n', expect: '3 ligne(s)\n' }, { stdin: '', expect: '0 ligne(s)\n' }, { stdin: 'un seul\n', expect: '1 ligne(s)\n' }, { stdin: 'x\ny', expect: '2 ligne(s)\n' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    }),

    M({
      id: 'c9_3', ch: 9, ord: 3,
      title: 'Le dossier du secrétariat',
      story: 'Le secrétariat a rangé une note dans le fichier <code>texte.txt</code>. Ouvre-le, lis son contenu avec <code>read</code> et affiche-le tel quel.',
      goal: 'Ouvre <code>texte.txt</code> avec <code>open</code>, lis jusqu’à 100 octets avec <code>read</code>, écris les octets lus avec <code>write</code> et ferme le fichier. Sortie attendue (le contenu du fichier) :<pre>Bonjour depuis un fichier !⏎\nDeuxième ligne.⏎</pre>',
      lesson: '<p><code>fd = open("texte.txt", O_RDONLY);</code> ouvre le fichier en lecture et renvoie un <b>descripteur</b> : un petit numéro (3, puisque 0, 1 et 2 sont déjà pris). Il vaut -1 en cas d’erreur.</p>' +
        '<p>Ensuite on lit comme sur l’entrée standard, mais avec ce fd : <code>n = read(fd, buf, 100);</code>. À la fin, <code>close(fd);</code> rend le descripteur.</p>' +
        '<p>Le contenu du fichier est modifiable dans l’onglet du fichier virtuel.</p>',
      tpl: `#include <fcntl.h>
#include <unistd.h>

int\tmain(void)
{
\tchar\tbuf[100];
\tint\t\tfd;
\tint\t\tn;

@1@\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : ouvre "texte.txt" en lecture (O_RDONLY)
\t// TODO 2 : lis jusqu'à 100 octets dans buf, écris les n octets lus
\t// TODO 3 : ferme le fichier
`, `\tfd = open("texte.txt", O_RDONLY);
\tif (fd < 0)
\t\treturn (1);
\tn = read(fd, buf, 100);
\tif (n > 0)
\t\twrite(1, buf, n);
\tclose(fd);
`]],
      hints: ['fd = open("texte.txt", O_RDONLY);', 'n = read(fd, buf, 100); puis write(1, buf, n);', 'Et pour finir : close(fd);'],
      tests: [{ expect: 'Bonjour depuis un fichier !\nDeuxième ligne.\n' }],
      rules: { mustCall: ['open', 'read', 'write', 'close'], forbidSrc: [{ re: '"Bonjour depuis', msg: 'Lis le fichier au lieu de recopier son contenu.' }] }
    }),

    M({
      id: 'c9_4', ch: 9, ord: 4,
      title: 'La note citée',
      story: 'Le journal du campus veut citer la note du secrétariat : chaque ligne du fichier doit être précédée de <code>&gt; </code>, comme une citation dans un e-mail.',
      goal: 'Ouvre <code>texte.txt</code>, lis-le ligne par ligne avec <code>get_next_line(fd)</code> et affiche chaque ligne précédée de <code>&gt; </code> :<pre>&gt; Bonjour depuis un fichier !⏎\n&gt; Deuxième ligne.⏎</pre>Aucune fuite, et pense à <code>close</code>.',
      lesson: '<p><code>get_next_line</code> marche avec <b>n’importe quel descripteur</b> : 0 pour l’entrée standard, ou celui renvoyé par <code>open</code>.</p>' +
        '<p>Même boucle qu’avant, en remplaçant 0 par <code>fd</code>.</p>',
      tpl: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;
\tint\t\tfd;

\tfd = open("texte.txt", O_RDONLY);
\tif (fd < 0)
\t\treturn (1);
@1@\tclose(fd);
\treturn (0);
}
`,
      parts: [[`\t// TODO : lis chaque ligne de fd, affiche "> " puis la ligne, libère-la
`, `\tligne = get_next_line(fd);
\twhile (ligne != NULL)
\t{
\t\tprintf("> %s", ligne);
\t\tfree(ligne);
\t\tligne = get_next_line(fd);
\t}
`]],
      hints: ['ligne = get_next_line(fd);', 'while (ligne != NULL) { printf("> %s", ligne); … }', 'free(ligne); ligne = get_next_line(fd);'],
      tests: [{ expect: '> Bonjour depuis un fichier !\n> Deuxième ligne.\n' }],
      rules: { mustCall: ['open', 'get_next_line', 'free', 'close'], noLeaks: true }
    }),

    M({
      id: 'c9_5', ch: 9, ord: 5,
      title: 'Les messages urgents',
      story: 'Le standard reçoit des dizaines de messages. Les <b>urgents</b> commencent par <code>!</code>. Le directeur ne veut voir qu’eux, et savoir combien il y en a.',
      goal: 'Lis toutes les lignes de l’entrée ; affiche seulement celles qui commencent par <code>!</code>, puis le nombre d’urgences :<pre>!incendie salle 3⏎\n!Marvin bloque⏎\n2 urgence(s)⏎</pre>Aucune fuite.',
      lesson: '<p>La ligne renvoyée est une chaîne normale : <code>ligne[0]</code> est son premier caractère. On peut donc tester <code>if (ligne[0] == \'!\')</code>.</p>' +
        '<p>Attention : même les lignes qu’on n’affiche pas doivent être libérées ! Le <code>free</code> se fait <b>en dehors</b> du if.</p>',
      stdin: 'cafe vide\n!incendie salle 3\nreunion a 14h\n!Marvin bloque\n',
      scene: 'conveyor', sceneOpts: { title: 'STANDARD' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;
\tint\t\turgences;

\turgences = 0;
\tligne = get_next_line(0);
\twhile (ligne != NULL)
\t{
@1@\t\tfree(ligne);
\t\tligne = get_next_line(0);
\t}
\tprintf("%d urgence(s)\\n", urgences);
\treturn (0);
}
`,
      parts: [[`\t\tprintf("%s", ligne); // TODO : seulement si la ligne commence par '!' (et compte-la)
`, `\t\tif (ligne[0] == '!')
\t\t{
\t\t\tprintf("%s", ligne);
\t\t\turgences++;
\t\t}
`]],
      hints: ['if (ligne[0] == \'!\') { … }', 'Dans le if : printf("%s", ligne); urgences++;', 'Laisse le free(ligne) en dehors du if.'],
      tests: [{ stdin: 'cafe vide\n!incendie salle 3\nreunion a 14h\n!Marvin bloque\n', expect: '!incendie salle 3\n!Marvin bloque\n2 urgence(s)\n' }, { stdin: 'tout va bien\nrien a signaler\n', expect: '0 urgence(s)\n' }, { stdin: '!a\n!b\n!c\n', expect: '!a\n!b\n!c\n3 urgence(s)\n' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    }),

    M({
      id: 'c9_6', ch: 9, ord: 6,
      title: 'Le total des factures',
      story: 'Le comptable de la cafétéria reçoit une facture par ligne (un montant, parfois négatif pour un remboursement). Il veut le <b>total</b> du jour.',
      goal: 'Lis toutes les lignes de l’entrée, convertis chacune avec <code>atoi</code> et additionne. Pour <code>12⏎30⏎-5⏎</code> :<pre>total : 37⏎</pre>Aucune fuite.',
      lesson: '<p><code>atoi("30\\n")</code> renvoie 30 : elle lit les chiffres (et un signe <code>-</code> éventuel) et s’arrête au premier caractère qui n’en est pas un, ici le <code>\\n</code>.</p>' +
        '<p>Convertis la ligne <b>avant</b> de la libérer : après le free, la lire serait un use-after-free.</p>',
      stdin: '12\n30\n-5\n',
      scene: 'conveyor', sceneOpts: { title: 'FACTURES' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;
\tint\t\ttotal;

\ttotal = 0;
@1@\tprintf("total : %d\\n", total);
\treturn (0);
}
`,
      parts: [[`\t// TODO : lis chaque ligne, ajoute atoi(ligne) au total, libère la ligne
`, `\tligne = get_next_line(0);
\twhile (ligne != NULL)
\t{
\t\ttotal = total + atoi(ligne);
\t\tfree(ligne);
\t\tligne = get_next_line(0);
\t}
`]],
      hints: ['Reprends la boucle get_next_line des missions précédentes.', 'Dans la boucle : total = total + atoi(ligne);', 'Puis free(ligne); ligne = get_next_line(0);'],
      tests: [{ stdin: '12\n30\n-5\n', expect: 'total : 37\n' }, { stdin: '100\n', expect: 'total : 100\n' }, { stdin: '', expect: 'total : 0\n' }, { stdin: '7\n-7\n42\n1\n', expect: 'total : 43\n' }],
      rules: { mustCall: ['get_next_line', 'atoi', 'free'], noLeaks: true }
    }),

    M({
      id: 'c9_7', ch: 9, ord: 7,
      title: 'La plus longue lettre',
      story: 'Le concours de la plus longue lettre d’amour est ouvert ! Une lettre par ligne : garde la <b>plus longue</b> (la première en cas d’égalité) et annonce-la à la fin.',
      goal: 'Garde un pointeur <code>record</code> vers la plus longue ligne lue. Quand une ligne bat le record, libère l’ancien record ; sinon libère la ligne. Pour <code>chat⏎elephant⏎chien⏎</code> :<pre>gagnante : elephant⏎</pre>Si l’entrée est vide : <code>aucune lettre⏎</code>. Aucune fuite.',
      lesson: '<p>Cette fois, on veut <b>garder</b> une ligne après le tour de boucle. Pas besoin de la copier : il suffit de garder son adresse dans <code>record</code> et de <b>ne pas</b> la libérer tout de suite.</p>' +
        '<p>À chaque ligne, exactement un bloc doit être libéré : soit l’ancien record (remplacé), soit la nouvelle ligne (perdante). À la fin, il reste un seul bloc : le record, qu’on libère après l’avoir affiché.</p>',
      stdin: 'chat\nelephant\nchien\n',
      scene: 'bakery', sceneOpts: { title: 'CONCOURS DE LETTRES' },
      tpl: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*ligne;
\tchar\t*record;

\trecord = NULL;
\tligne = get_next_line(0);
\twhile (ligne != NULL)
\t{
@1@\t\tligne = get_next_line(0);
\t}
@2@\treturn (0);
}
`,
      parts: [[`\t\t// TODO : si record vaut NULL ou si ligne est plus longue que record :
\t\t//          libère record et garde ligne ; sinon libère ligne
\t\tfree(ligne);
`, `\t\tif (record == NULL || strlen(ligne) > strlen(record))
\t\t{
\t\t\tfree(record);
\t\t\trecord = ligne;
\t\t}
\t\telse
\t\t\tfree(ligne);
`], [`\t// TODO : affiche "gagnante : " + record (ou "aucune lettre"), puis libère record
`, `\tif (record == NULL)
\t\tprintf("aucune lettre\\n");
\telse
\t\tprintf("gagnante : %s", record);
\tfree(record);
`]],
      hints: ['if (record == NULL || strlen(ligne) > strlen(record)) { … } else free(ligne);', 'Dans le if : free(record); record = ligne;  (free(NULL) ne fait rien)', 'Après la boucle : if (record == NULL) printf("aucune lettre\\n"); else printf("gagnante : %s", record); free(record);'],
      tests: [{ stdin: 'chat\nelephant\nchien\n', expect: 'gagnante : elephant\n' }, { stdin: 'a\nbb\nccc\nddd\nb\n', expect: 'gagnante : ccc\n' }, { stdin: '', expect: 'aucune lettre\n' }, { stdin: 'seule lettre\n', expect: 'gagnante : seule lettre\n' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    }),

    M({
      id: 'c9_8', ch: 9, ord: 8,
      title: 'Le compteur du fichier',
      story: 'L’archiviste veut une fiche technique du fichier <code>texte.txt</code> : son nombre d’<b>octets</b> et de <b>lignes</b>. Sa petite machine ne lit que <b>8 octets à la fois</b>.',
      goal: 'Lis le fichier par morceaux de 8 octets avec <code>read</code>, <b>jusqu’à ce qu’il renvoie 0</b>, en comptant les octets et les <code>\\n</code>. Sortie attendue :<pre>45 octets, 2 lignes⏎</pre>',
      lesson: '<p><code>read</code> renvoie le nombre d’octets <b>vraiment</b> lus : 8 tant qu’il en reste assez, moins pour le dernier morceau, puis <b>0</b> à la fin du fichier. D’où la boucle :</p>' +
        '<pre>n = read(fd, buf, 8);\nwhile (n &gt; 0)\n{\n    …traiter les n octets…\n    n = read(fd, buf, 8);\n}</pre>' +
        '<p>Remarque : le « è » de « Deuxième » occupe <b>2 octets</b> (UTF-8) !</p>',
      tpl: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int\tmain(void)
{
\tchar\tbuf[8];
\tint\t\tfd;
\tint\t\tn;
\tint\t\ti;
\tint\t\toctets;
\tint\t\tlignes;

\toctets = 0;
\tlignes = 0;
\tfd = open("texte.txt", O_RDONLY);
\tif (fd < 0)
\t\treturn (1);
\tn = read(fd, buf, 8);
@1@\tclose(fd);
\tprintf("%d octets, %d lignes\\n", octets, lignes);
\treturn (0);
}
`,
      parts: [[`\t// TODO : tant que n > 0 : ajoute n aux octets, compte les '\\n' des n
\t//        cases de buf, puis lis le morceau suivant
\toctets = n;
`, `\twhile (n > 0)
\t{
\t\toctets = octets + n;
\t\ti = 0;
\t\twhile (i < n)
\t\t{
\t\t\tif (buf[i] == '\\n')
\t\t\t\tlignes++;
\t\t\ti++;
\t\t}
\t\tn = read(fd, buf, 8);
\t}
`]],
      hints: ['while (n > 0) { … n = read(fd, buf, 8); }', 'octets = octets + n; puis une boucle i de 0 à n - 1.', 'if (buf[i] == \'\\n\') lignes++;'],
      tests: [{ expect: '45 octets, 2 lignes\n' }],
      rules: { mustCall: ['open', 'read', 'close'], forbidCall: ['get_next_line'], forbidSrc: [{ re: '\\b45\\b', msg: 'Compte les octets au lieu d’écrire le résultat.' }] }
    }),

    M({
      id: 'c9_9', ch: 9, ord: 9,
      title: 'La pile du courrier',
      story: 'Le courrier s’empile sur le bureau du directeur : la dernière lettre arrivée est <b>sur le dessus</b>. Il les lit donc dans l’ordre inverse de leur arrivée.',
      goal: 'Range chaque ligne lue dans le tableau <code>lettres</code> (sans la libérer tout de suite). Puis affiche-les de la dernière à la première, en libérant chacune. Pour <code>un⏎deux⏎trois⏎</code> :<pre>trois⏎\ndeux⏎\nun⏎</pre>Aucune fuite.',
      lesson: '<p>Un tableau de pointeurs <code>char *lettres[100]</code> (sur la pile) garde les adresses des lignes (sur le tas). On ne copie pas le texte : on garde juste où il est.</p>' +
        '<p>Après la lecture, <code>n</code> lignes sont vivantes sur le tas. On les parcourt de <code>n - 1</code> jusqu’à <code>0</code>, et chaque ligne est libérée juste après avoir été affichée.</p>',
      stdin: 'un\ndeux\ntrois\n',
      scene: 'bakery', sceneOpts: { title: 'BUREAU DU DIRECTEUR' },
      tpl: `#include <stdio.h>
#include <stdlib.h>

char\t*get_next_line(int fd);

int\tmain(void)
{
\tchar\t*lettres[100];
\tchar\t*ligne;
\tint\t\tn;
\tint\t\tk;

\tn = 0;
\tligne = get_next_line(0);
\twhile (ligne != NULL && n < 100)
\t{
@1@\t\tligne = get_next_line(0);
\t}
\tk = n - 1;
@2@\treturn (0);
}
`,
      parts: [[`\t\t// TODO : range ligne dans lettres[n], puis n++
\t\tfree(ligne);
`, `\t\tlettres[n] = ligne;
\t\tn++;
`], [`\t// TODO : de k = n - 1 jusqu'à 0 : affiche lettres[k], puis libère-la
`, `\twhile (k >= 0)
\t{
\t\tprintf("%s", lettres[k]);
\t\tfree(lettres[k]);
\t\tk--;
\t}
`]],
      hints: ['Dans la boucle de lecture : lettres[n] = ligne; n++; (pas de free ici !)', 'while (k >= 0) { … k--; }', 'printf("%s", lettres[k]); free(lettres[k]);'],
      tests: [{ stdin: 'un\ndeux\ntrois\n', expect: 'trois\ndeux\nun\n' }, { stdin: 'A\nB\n', expect: 'B\nA\n' }, { stdin: 'seule\n', expect: 'seule\n' }, { stdin: '', expect: '' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    }),

    /* ===================== Chapitre 10 : Structs et listes chaînées ===================== */
    M({
      id: 'c10_1', ch: 10, ord: 1,
      title: 'La fiche d’étudiante',
      story: 'Le bureau des étudiants range chaque fiche dans une <b>struct</b> : le nom, l’expérience (xp) et le niveau. Alice vient de terminer un projet : mets sa fiche à jour.',
      goal: 'Remplis les champs <code>xp</code> (lu sur l’entrée) et <code>niveau</code> (<code>xp / 1000</code>) de la fiche <code>e</code>. Pour l’entrée <code>4250</code> :<pre>Alice : 4250 xp, niveau 4⏎</pre>',
      lesson: '<p>Une <code>struct</code> regroupe plusieurs variables (les <b>champs</b>) sous un seul nom. <code>typedef</code> lui donne un nom court : <code>t_etudiant</code>.</p>' +
        '<p>On accède à un champ avec un point : <code>e.xp = 4250;</code>. Dans la vue mémoire, les champs sont rangés côte à côte dans la variable <code>e</code>.</p>',
      stdin: '4250\n',
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct s_etudiant
{
\tchar\t*nom;
\tint\t\txp;
\tint\t\tniveau;
}\tt_etudiant;

int\tmain(void)
{
\tt_etudiant\te;
\tchar\t\tbuf[20];
\tint\t\t\tn;

\tn = read(0, buf, 19);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\te.nom = "Alice";
@1@\tprintf("%s : %d xp, niveau %d\\n", e.nom, e.xp, e.niveau);
\treturn (0);
}
`,
      parts: [[`\t// TODO : e.xp = le nombre lu (atoi), e.niveau = e.xp / 1000
\te.xp = 0;
\te.niveau = 0;
`, `\te.xp = atoi(buf);
\te.niveau = e.xp / 1000;
`]],
      hints: ['e.xp = atoi(buf);', 'e.niveau = e.xp / 1000;', 'Les deux lignes remplacent les « = 0 » du code de départ.'],
      tests: [{ stdin: '4250\n', expect: 'Alice : 4250 xp, niveau 4\n' }, { stdin: '1200\n', expect: 'Alice : 1200 xp, niveau 1\n' }, { stdin: '999\n', expect: 'Alice : 999 xp, niveau 0\n' }],
      rules: { mustSrc: [{ re: 'e\\.niveau\\s*=\\s*e\\.xp', msg: 'Calcule le niveau à partir de e.xp.' }] }
    }),

    M({
      id: 'c10_2', ch: 10, ord: 2,
      title: 'Marvin se promène',
      story: 'Marvin le robot se déplace sur la grille du campus. Sa position est une struct <code>t_robot</code> ; la fonction <code>avancer</code> reçoit un <b>pointeur</b> sur elle pour pouvoir la modifier.',
      goal: 'Complète <code>avancer(t_robot *r, char ordre)</code> : <code>N</code> → y + 1, <code>S</code> → y − 1, <code>E</code> → x + 1, <code>O</code> → x − 1. Pour les ordres <code>NNEEO</code> :<pre>Marvin est en (1, 2)⏎</pre>',
      lesson: '<p>Comme pour un int, si on passait la struct par valeur, la fonction modifierait une <b>copie</b>. On passe donc son adresse : <code>avancer(&amp;marvin, …)</code>.</p>' +
        '<p>Avec un pointeur sur struct, on accède aux champs avec la flèche : <code>r-&gt;x</code> veut dire <code>(*r).x</code>.</p>',
      stdin: 'NNEEO\n',
      tpl: `#include <unistd.h>
#include <stdio.h>

typedef struct s_robot
{
\tint\tx;
\tint\ty;
}\tt_robot;

void\tavancer(t_robot *r, char ordre)
{
@1@}

int\tmain(void)
{
\tt_robot\tmarvin;
\tchar\tbuf[100];
\tint\t\tn;
\tint\t\ti;

\tn = read(0, buf, 99);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\tmarvin.x = 0;
\tmarvin.y = 0;
\ti = 0;
\twhile (buf[i])
\t{
\t\tavancer(&marvin, buf[i]);
\t\ti++;
\t}
\tprintf("Marvin est en (%d, %d)\\n", marvin.x, marvin.y);
\treturn (0);
}
`,
      parts: [[`\t// TODO : selon ordre ('N', 'S', 'E', 'O'), modifie r->x ou r->y
`, `\tif (ordre == 'N')
\t\tr->y++;
\telse if (ordre == 'S')
\t\tr->y--;
\telse if (ordre == 'E')
\t\tr->x++;
\telse if (ordre == 'O')
\t\tr->x--;
`]],
      hints: ['if (ordre == \'N\') r->y++;', 'Puis des else if pour S, E et O.', 'Les autres caractères (comme le \\n) ne doivent rien faire.'],
      tests: [{ stdin: 'NNEEO\n', expect: 'Marvin est en (1, 2)\n' }, { stdin: 'SSSO\n', expect: 'Marvin est en (-1, -3)\n' }, { stdin: 'NESO\n', expect: 'Marvin est en (0, 0)\n' }, { stdin: 'EEEEN\n', expect: 'Marvin est en (4, 1)\n' }],
      rules: { mustCall: ['avancer'], mustSrc: [{ re: 'r\\s*->', msg: 'Utilise la flèche -> sur le pointeur r.' }] }
    }),

    M({
      id: 'c10_3', ch: 10, ord: 3,
      title: 'Le rayon de l’épicerie',
      story: 'L’épicerie du campus range ses produits dans un tableau de structs. Le gérant veut connaître la <b>valeur</b> de chaque stock (prix × quantité) et le produit le plus précieux.',
      goal: 'Complète <code>valeur(t_produit *p)</code> (avec <code>-&gt;</code>), puis trouve dans le main l’indice du produit de plus grande valeur. Sortie attendue :<pre>pomme : 60⏎\npain : 45⏎\ncafe : 120⏎\nlait : 24⏎\nle plus precieux : cafe⏎</pre>',
      lesson: '<p><code>t_produit rayon[4];</code> est un tableau de 4 structs, côte à côte en mémoire. <code>rayon[k]</code> est une struct ; <code>&amp;rayon[k]</code> est son adresse, qu’on peut passer à une fonction.</p>' +
        '<p>Pour le maximum, même idée qu’au chapitre 6, mais on garde l’<b>indice</b> du meilleur (pour pouvoir afficher son nom).</p>',
      tpl: `#include <stdio.h>

typedef struct s_produit
{
\tchar\t*nom;
\tint\t\tprix;
\tint\t\tstock;
}\tt_produit;

void\tremplir(t_produit *p, char *nom, int prix, int stock)
{
\tp->nom = nom;
\tp->prix = prix;
\tp->stock = stock;
}

int\tvaleur(t_produit *p)
{
@1@}

int\tmain(void)
{
\tt_produit\trayon[4];
\tint\t\t\tk;
\tint\t\t\tbest;

\tremplir(&rayon[0], "pomme", 2, 30);
\tremplir(&rayon[1], "pain", 3, 15);
\tremplir(&rayon[2], "cafe", 8, 15);
\tremplir(&rayon[3], "lait", 1, 24);
\tbest = 0;
\tk = 0;
\twhile (k < 4)
\t{
\t\tprintf("%s : %d\\n", rayon[k].nom, valeur(&rayon[k]));
@2@\t\tk++;
\t}
\tprintf("le plus precieux : %s\\n", rayon[best].nom);
\treturn (0);
}
`,
      parts: [[`\t// TODO : renvoie le prix multiplié par le stock
\treturn (0);
`, `\treturn (p->prix * p->stock);
`], [`\t\t// TODO : si ce produit vaut plus que rayon[best], best = k
`, `\t\tif (valeur(&rayon[k]) > valeur(&rayon[best]))
\t\t\tbest = k;
`]],
      hints: ['return (p->prix * p->stock);', 'Dans la boucle : if (valeur(&rayon[k]) > valeur(&rayon[best])) …', '… best = k;'],
      tests: [{ expect: 'pomme : 60\npain : 45\ncafe : 120\nlait : 24\nle plus precieux : cafe\n' }],
      rules: { mustCall: ['valeur'], mustSrc: [{ re: 'p\\s*->\\s*prix', msg: 'Utilise p->prix dans valeur.' }] }
    }),

    M({
      id: 'c10_4', ch: 10, ord: 4,
      title: 'Le premier wagon',
      story: 'L’atelier de la gare construit son tout premier <b>wagon</b> : une struct allouée sur le tas, avec un poids et un attelage <code>next</code> (vide pour l’instant).',
      goal: 'Réserve un <code>t_wagon</code> avec malloc, mets <code>poids = 12</code> et <code>next = NULL</code>. Le main affiche puis libère :<pre>un wagon fait 16 octets⏎\npoids : 12⏎\nsuivant : NULL⏎</pre>',
      lesson: '<p><code>malloc(sizeof(t_wagon))</code> réserve exactement la taille de la struct : 4 octets pour <code>poids</code>, 4 de <b>remplissage</b>, 8 pour le pointeur <code>next</code> = 16 octets.</p>' +
        '<p>Le main n’a qu’un pointeur <code>w</code> : on remplit les champs avec la flèche, <code>w-&gt;poids = 12;</code>.</p>',
      scene: 'train', sceneOpts: { head: 'w', valOff: 0, nextOff: 8 },
      tpl: `#include <stdio.h>
#include <stdlib.h>

${WAGON}
int\tmain(void)
{
\tt_wagon\t*w;

@1@\tprintf("un wagon fait %d octets\\n", (int)sizeof(t_wagon));
\tprintf("poids : %d\\n", w->poids);
\tif (w->next == NULL)
\t\tprintf("suivant : NULL\\n");
\tfree(w);
\treturn (0);
}
`,
      parts: [[`\t// TODO : réserve un t_wagon, poids = 12, next = NULL
\tw = NULL;
`, `\tw = malloc(sizeof(t_wagon));
\tif (w == NULL)
\t\treturn (1);
\tw->poids = 12;
\tw->next = NULL;
`]],
      hints: ['w = malloc(sizeof(t_wagon));', 'w->poids = 12;', 'w->next = NULL;'],
      tests: [{ expect: 'un wagon fait 16 octets\npoids : 12\nsuivant : NULL\n' }],
      rules: { mustCall: ['malloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c10_5', ch: 10, ord: 5,
      title: 'L’attelage',
      story: 'Trois wagons attendent sur la voie de garage. Le chef de gare veut les <b>atteler</b> : le premier tire le deuxième, qui tire le troisième.',
      goal: 'Relie les wagons <code>a → b → c</code> avec leurs champs <code>next</code>. Le main parcourt le train depuis <code>tete</code> :<pre>[5]-[9]-[2]-NULL⏎</pre>',
      lesson: '<p>Atteler, c’est ranger une <b>adresse</b> dans le champ <code>next</code> : <code>a-&gt;next = b;</code>. Dans la vue mémoire, une flèche part du wagon a vers le bloc b.</p>' +
        '<p>Le dernier wagon garde <code>next = NULL</code> : c’est ce qui arrête le parcours <code>while (cur != NULL)</code>.</p>',
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      tpl: `#include <stdio.h>
#include <stdlib.h>

${WAGON}
${NOUVEAU}
${MONTRER}
int\tmain(void)
{
\tt_wagon\t*tete;
\tt_wagon\t*a;
\tt_wagon\t*b;
\tt_wagon\t*c;

\ta = nouveau_wagon(5);
\tb = nouveau_wagon(9);
\tc = nouveau_wagon(2);
@1@\ttete = a;
\tmontrer(tete);
\tfree(a);
\tfree(b);
\tfree(c);
\treturn (0);
}
`,
      parts: [[`\t// TODO : relie a -> b -> c
`, `\ta->next = b;
\tb->next = c;
`]],
      hints: ['Le champ next de a doit contenir l’adresse de b.', 'a->next = b;', 'b->next = c; (c->next vaut déjà NULL)'],
      tests: [{ expect: '[5]-[9]-[2]-NULL\n' }],
      rules: { mustCall: ['nouveau_wagon', 'free'], mustSrc: [{ re: '->\\s*next\\s*=\\s*b', msg: 'Accroche b au champ next de a.' }], noLeaks: true }
    }),

    M({
      id: 'c10_6', ch: 10, ord: 6,
      title: 'L’inspecteur des trains',
      story: 'L’inspecteur passe le long du train, du premier wagon jusqu’au <code>NULL</code>, pour compter les wagons et additionner leur poids. Les wagons sont annoncés sur l’entrée standard.',
      goal: 'Complète <code>ft_taille</code> et <code>ft_poids</code> en parcourant la liste. Pour l’entrée <code>3 1 4 1 5</code> (accrochés <b>devant</b>, donc à l’envers) :<pre>[5]-[1]-[4]-[1]-[3]-NULL⏎\n5 wagon(s), 14 tonnes⏎</pre>',
      lesson: '<p>Le parcours d’une liste chaînée :</p><pre>while (cur != NULL)\n{\n    …utiliser cur-&gt;poids…\n    cur = cur-&gt;next;\n}</pre>' +
        '<p><code>cur</code> est une copie du pointeur de tête : on peut l’avancer sans perdre le début du train.</p>' +
        '<p>Remarque <code>ajouter_devant</code> (fournie) : chaque nouveau wagon devient la tête. Tu l’écriras toi-même à la prochaine mission.</p>',
      stdin: '3 1 4 1 5\n',
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${WAGON}
${NOUVEAU}
${DEVANT}
${CHARGER}
${MONTRER}
${VIDER}
int\tft_taille(t_wagon *cur)
{
\tint\tn;

\tn = 0;
@1@\treturn (n);
}

int\tft_poids(t_wagon *cur)
{
\tint\ttotal;

\ttotal = 0;
@2@\treturn (total);
}

int\tmain(void)
{
\tt_wagon\t*tete;

\ttete = charger();
\tmontrer(tete);
\tprintf("%d wagon(s), %d tonnes\\n", ft_taille(tete), ft_poids(tete));
\tvider(tete);
\treturn (0);
}
`,
      parts: [[`\t// TODO : compte les wagons jusqu'à NULL
`, `\twhile (cur != NULL)
\t{
\t\tn++;
\t\tcur = cur->next;
\t}
`], [`\t// TODO : additionne les poids jusqu'à NULL
`, `\twhile (cur != NULL)
\t{
\t\ttotal = total + cur->poids;
\t\tcur = cur->next;
\t}
`]],
      hints: ['while (cur != NULL) { … cur = cur->next; }', 'Dans ft_taille : n++;', 'Dans ft_poids : total = total + cur->poids;'],
      tests: [{ stdin: '3 1 4 1 5\n', expect: '[5]-[1]-[4]-[1]-[3]-NULL\n5 wagon(s), 14 tonnes\n' }, { stdin: '7\n', expect: '[7]-NULL\n1 wagon(s), 7 tonnes\n' }, { stdin: '\n', expect: 'NULL\n0 wagon(s), 0 tonnes\n' }],
      rules: { mustCall: ['ft_taille', 'ft_poids'], noLeaks: true }
    }),

    M({
      id: 'c10_7', ch: 10, ord: 7,
      title: 'La locomotive de tête',
      story: 'Nouvelle méthode à la gare : chaque wagon qui arrive est accroché <b>devant</b> le train. C’est l’opération la plus rapide, pas besoin d’aller jusqu’au bout !',
      goal: 'Complète <code>ajouter_devant(t_wagon **tete, int poids)</code> : crée le wagon, accroche l’ancien train derrière lui, et fais-en la nouvelle tête. Pour l’entrée <code>10 20 30</code> :<pre>[30]-[20]-[10]-NULL⏎</pre>Aucune fuite.',
      lesson: '<p>La fonction doit <b>changer</b> la variable <code>tete</code> du main : elle reçoit donc son adresse, un <code>t_wagon **</code> (pointeur sur pointeur). <code>*tete</code> est la tête actuelle.</p>' +
        '<pre>w-&gt;next = *tete;   // l’ancien train derrière w\n*tete = w;         // w devient la tête</pre>' +
        '<p>L’ordre compte : si on change <code>*tete</code> d’abord, on perd l’ancien train !</p>',
      stdin: '10 20 30\n',
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${WAGON}
${NOUVEAU}
void\tajouter_devant(t_wagon **tete, int poids)
{
\tt_wagon\t*w;

\tw = nouveau_wagon(poids);
@1@}

${CHARGER}
${MONTRER}
${VIDER}
int\tmain(void)
{
\tt_wagon\t*tete;

\ttete = charger();
\tmontrer(tete);
\tvider(tete);
\treturn (0);
}
`,
      parts: [[`\t// TODO : accroche l'ancien train (*tete) derrière w, puis w devient la tête
`, `\tif (w == NULL)
\t\treturn ;
\tw->next = *tete;
\t*tete = w;
`]],
      hints: ['*tete est l’ancienne tête du train.', 'w->next = *tete;', 'Puis *tete = w;'],
      tests: [{ stdin: '10 20 30\n', expect: '[30]-[20]-[10]-NULL\n' }, { stdin: '1 2 3 4 5\n', expect: '[5]-[4]-[3]-[2]-[1]-NULL\n' }, { stdin: '42\n', expect: '[42]-NULL\n' }],
      rules: { mustCall: ['ajouter_devant', 'malloc', 'free'], noLeaks: true }
    }),

    M({
      id: 'c10_8', ch: 10, ord: 8,
      title: 'Le démontage',
      story: 'Fin de service : tous les wagons doivent retourner au dépôt. Écris <code>ft_list_clear</code> qui <b>libère tout le train</b> et remet la tête à <code>NULL</code>.',
      goal: 'Complète <code>ft_list_clear(t_wagon **tete)</code> : libère chaque wagon (en gardant le suivant <b>avant</b> chaque free), puis mets <code>*tete</code> à NULL. Pour <code>4 8 15</code> :<pre>[15]-[8]-[4]-NULL⏎\napres demontage : NULL⏎</pre>Aucune fuite.',
      lesson: '<p>Piège classique : <code>free(cur); cur = cur-&gt;next;</code> lit dans un bloc <b>déjà libéré</b> (use-after-free) ! Il faut sauvegarder l’adresse du suivant d’abord :</p>' +
        '<pre>suivant = cur-&gt;next;\nfree(cur);\ncur = suivant;</pre>' +
        '<p>À la fin, <code>*tete = NULL;</code> : le main ne garde pas une adresse vers un train qui n’existe plus (un pointeur « pendouillant »).</p>',
      stdin: '4 8 15\n',
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${WAGON}
${NOUVEAU}
${DEVANT}
${CHARGER}
${MONTRER}
void\tft_list_clear(t_wagon **tete)
{
\tt_wagon\t*cur;
\tt_wagon\t*suivant;

\tcur = *tete;
@1@}

int\tmain(void)
{
\tt_wagon\t*tete;

\ttete = charger();
\tmontrer(tete);
\tft_list_clear(&tete);
\tif (tete == NULL)
\t\tprintf("apres demontage : NULL\\n");
\telse
\t\tprintf("apres demontage : il reste un train !\\n");
\treturn (0);
}
`,
      parts: [[`\t// TODO : libère chaque wagon (garde le suivant avant le free), puis *tete = NULL
`, `\twhile (cur != NULL)
\t{
\t\tsuivant = cur->next;
\t\tfree(cur);
\t\tcur = suivant;
\t}
\t*tete = NULL;
`]],
      hints: ['while (cur != NULL) { … }', 'suivant = cur->next; free(cur); cur = suivant;', 'Après la boucle : *tete = NULL;'],
      tests: [{ stdin: '4 8 15\n', expect: '[15]-[8]-[4]-NULL\napres demontage : NULL\n' }, { stdin: '16 23 42 1\n', expect: '[1]-[42]-[23]-[16]-NULL\napres demontage : NULL\n' }],
      rules: { mustCall: ['ft_list_clear', 'free'], noLeaks: true }
    }),

    M({
      id: 'c10_9', ch: 10, ord: 9,
      title: 'Le wagon défectueux',
      story: 'L’inspecteur a repéré des wagons défectueux : tous ceux d’un certain poids (lu sur l’entrée) doivent être <b>décrochés</b> du train et renvoyés à l’atelier (libérés), sans casser le reste du convoi.',
      goal: 'Complète <code>supprimer(t_wagon **tete, int poids)</code> qui retire et libère <b>tous</b> les wagons de ce poids, y compris en tête. Le train est <code>[4]-[7]-[4]-[2]</code>. Pour l’entrée <code>4</code> :<pre>[4]-[7]-[4]-[2]-NULL⏎\n[7]-[2]-NULL⏎</pre>Aucune fuite.',
      lesson: '<p>Deux cas :</p><ul><li><b>en tête</b> : tant que <code>*tete</code> a le mauvais poids, on garde son suivant, on le libère, et le suivant devient la tête ;</li>' +
        '<li><b>au milieu</b> : on regarde depuis le wagon d’avant (<code>cur</code>) : si <code>cur-&gt;next</code> est défectueux, on fait <code>cur-&gt;next = cur-&gt;next-&gt;next</code> (en ayant gardé l’adresse du défectueux pour le libérer). Sinon on avance.</li></ul>' +
        '<p>Attention à ne jamais lire un wagon après son free !</p>',
      stdin: '4\n',
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      tpl: `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${WAGON}
${NOUVEAU}
${DEVANT}
${MONTRER}
${VIDER}
void\tsupprimer(t_wagon **tete, int poids)
{
\tt_wagon\t*cur;
\tt_wagon\t*mauvais;

@1@}

int\tmain(void)
{
\tt_wagon\t*tete;
\tchar\tbuf[20];
\tint\t\tn;

\tn = read(0, buf, 19);
\tif (n < 0)
\t\tn = 0;
\tbuf[n] = '\\0';
\ttete = NULL;
\tajouter_devant(&tete, 2);
\tajouter_devant(&tete, 4);
\tajouter_devant(&tete, 7);
\tajouter_devant(&tete, 4);
\tmontrer(tete);
\tsupprimer(&tete, atoi(buf));
\tmontrer(tete);
\tvider(tete);
\treturn (0);
}
`,
      parts: [[`\t// TODO 1 : tant que la tête existe et a ce poids : décroche-la et libère-la
\t// TODO 2 : depuis cur = *tete, si cur->next a ce poids, décroche-le
\t//          (cur->next = mauvais->next) et libère-le ; sinon avance cur
`, `\twhile (*tete != NULL && (*tete)->poids == poids)
\t{
\t\tmauvais = *tete;
\t\t*tete = mauvais->next;
\t\tfree(mauvais);
\t}
\tcur = *tete;
\twhile (cur != NULL && cur->next != NULL)
\t{
\t\tif (cur->next->poids == poids)
\t\t{
\t\t\tmauvais = cur->next;
\t\t\tcur->next = mauvais->next;
\t\t\tfree(mauvais);
\t\t}
\t\telse
\t\t\tcur = cur->next;
\t}
`]],
      hints: ['Tête : while (*tete != NULL && (*tete)->poids == poids) { mauvais = *tete; *tete = mauvais->next; free(mauvais); }', 'Milieu : cur = *tete; while (cur != NULL && cur->next != NULL) { … }', 'if (cur->next->poids == poids) { mauvais = cur->next; cur->next = mauvais->next; free(mauvais); } else cur = cur->next;'],
      tests: [{ stdin: '4\n', expect: '[4]-[7]-[4]-[2]-NULL\n[7]-[2]-NULL\n' }, { stdin: '2\n', expect: '[4]-[7]-[4]-[2]-NULL\n[4]-[7]-[4]-NULL\n' }, { stdin: '7\n', expect: '[4]-[7]-[4]-[2]-NULL\n[4]-[4]-[2]-NULL\n' }, { stdin: '9\n', expect: '[4]-[7]-[4]-[2]-NULL\n[4]-[7]-[4]-[2]-NULL\n' }],
      rules: { mustCall: ['supprimer', 'free'], noLeaks: true }
    })
  );
})(typeof window !== 'undefined' ? window : globalThis);
