/* =========================================================================
 *  42 ORIGINS — missions C (10 contrats, du plus simple au plus dur)
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};

  O42.missions.c = [
    {
      id: 'c1', title: 'Dire bonjour à Marvin', job: 'Contrat 01 · Agent d’accueil', stars: 1,
      scene: 'talk', sceneOpts: { who: 'robot', name: 'Marvin', expect: 'Bonjour Marvin\n', happy: 'Bip ! Bonjour à toi ! Bienvenue à 42 Origins.', wrong: 'Bip ?… Ce n’est pas exactement ça.', wait: 'Bip… (il attend qu’on le salue)' },
      story: 'Premier jour sur le campus. Marvin, le robot de l’accueil, ne répond qu’aux messages <b>exacts</b>. Ton premier contrat : le saluer.',
      goal: 'Affiche exactement :<pre>Bonjour Marvin⏎</pre>avec la fonction <code>write</code> (le ⏎ est un retour à la ligne <code>\\n</code>).',
      lesson: '<p><code>write(fd, adresse, taille)</code> envoie <b>taille</b> octets lus à partir de <b>adresse</b> vers le « descripteur de fichier » <b>fd</b>.</p>' +
        '<table><tr><th>fd</th><th>nom</th><th>rôle</th></tr><tr><td>0</td><td>stdin</td><td>entrée (clavier)</td></tr><tr><td>1</td><td>stdout</td><td>sortie (écran)</td></tr><tr><td>2</td><td>stderr</td><td>erreurs</td></tr></table>' +
        '<p>Un texte entre guillemets <code>"Bonjour"</code> est rangé en mémoire dans la zone <b>.rodata</b> (lecture seule), une lettre par case :</p>' +
        '<div class="mem-mini"><span>B<small>[0]</small></span><span>o<small>[1]</small></span><span>n<small>[2]</small></span><span>j<small>[3]</small></span><span>o<small>[4]</small></span><span>u<small>[5]</small></span><span>r<small>[6]</small></span><span>\\0<small>[7]</small></span></div>' +
        '<p>Le <code>\\n</code> (retour à la ligne) compte pour <b>1 octet</b>. Si la taille est trop petite, le texte est coupé ; trop grande, tu affiches des octets en trop !</p>' +
        '<p>👉 Clique <b>⤓ Pas</b> pour avancer ligne par ligne et regarde la mémoire à droite.</p>',
      starter: '#include <unistd.h>\n\nint main(void)\n{\n\t// write(fd, texte, nombre_d_octets)\n\twrite(1, "Bonjour", 7);\n\treturn (0);\n}\n',
      hints: ['Le texte doit devenir "Bonjour Marvin\\n".', 'Compte les octets : « Bonjour » = 7, l’espace = 1, « Marvin » = 6, « \\n » = 1.', 'write(1, "Bonjour Marvin\\n", 15);'],
      solution: '#include <unistd.h>\n\nint main(void)\n{\n\twrite(1, "Bonjour Marvin\\n", 15);\n\treturn (0);\n}\n',
      tests: [{ expect: 'Bonjour Marvin\n' }],
      rules: { mustCall: ['write'], forbidCall: ['printf', 'puts'] }
    },
    {
      id: 'c2', title: 'L’enseigne du café', job: 'Contrat 02 · Électricien du néon', stars: 1,
      scene: 'sign', sceneOpts: { v: 'enseigne', text: 'CAFE FERME' },
      story: 'Le café du campus rouvre, mais l’enseigne au néon affiche toujours <b>CAFE FERME</b>. Le patron veut <b>CAFE OUVRE</b>… sans racheter d’enseigne : tu dois changer les lettres <b>une par une</b>, directement dans les cases mémoire.',
      goal: 'Modifie le tableau <code>enseigne</code> case par case (<code>enseigne[i] = \'X\';</code>) pour qu’il contienne <code>CAFE OUVRE</code>, puis affiche-le suivi de <code>\\n</code>.<br>Interdit d’écrire le mot "OUVRE" en entier entre guillemets !',
      lesson: '<p><code>char enseigne[] = "CAFE FERME";</code> crée sur la <b>pile (stack)</b> un tableau de 11 cases : 10 lettres + le <code>\\0</code> final qui marque la fin.</p>' +
        '<div class="mem-mini"><span>C<small>0</small></span><span>A<small>1</small></span><span>F<small>2</small></span><span>E<small>3</small></span><span>␣<small>4</small></span><span>F<small>5</small></span><span>E<small>6</small></span><span>R<small>7</small></span><span>M<small>8</small></span><span>E<small>9</small></span><span>\\0<small>10</small></span></div>' +
        '<p>On accède à une case avec son <b>indice</b> : <code>enseigne[5]</code> est la 6e case (on compte depuis 0 !). Un caractère s’écrit entre apostrophes : <code>\'O\'</code>.</p>' +
        '<p>Contrairement à <code>char *s = "…"</code> (texte en lecture seule dans .rodata), un tableau <code>char s[]</code> est une <b>copie modifiable</b>.</p>',
      starter: '#include <unistd.h>\n\nint main(void)\n{\n\tchar\tenseigne[] = "CAFE FERME";\n\n\t// FERME commence à la case 5\n\tenseigne[5] = \'O\';\n\n\twrite(1, enseigne, 10);\n\twrite(1, "\\n", 1);\n\treturn (0);\n}\n',
      hints: ['F-E-R-M-E occupe les cases 5, 6, 7, 8 et 9.', 'Il faut O U V R E dans les cases 5 à 9.', 'enseigne[6] = \'U\'; enseigne[7] = \'V\'; enseigne[8] = \'R\'; enseigne[9] = \'E\';'],
      solution: '#include <unistd.h>\n\nint main(void)\n{\n\tchar\tenseigne[] = "CAFE FERME";\n\n\tenseigne[5] = \'O\';\n\tenseigne[6] = \'U\';\n\tenseigne[7] = \'V\';\n\tenseigne[8] = \'R\';\n\tenseigne[9] = \'E\';\n\twrite(1, enseigne, 10);\n\twrite(1, "\\n", 1);\n\treturn (0);\n}\n',
      tests: [{ expect: 'CAFE OUVRE\n' }],
      rules: { mustCall: ['write'], forbidSrc: [{ re: '"[^"\\n]*OUVR', msg: 'Le mot OUVRE ne doit pas être écrit entre guillemets : change les cases une à une.' }] }
    },
    {
      id: 'c3', title: 'Le compte à rebours', job: 'Contrat 03 · Base spatiale', stars: 2,
      scene: 'rocket', sceneOpts: {},
      story: 'La fusée de l’association « 42 Space » est prête. Il manque le programme de compte à rebours : <b>5, 4, 3, 2, 1</b> puis <b>DECOLLAGE</b>. Interdit de tout écrire à la main : utilise une <b>boucle</b>.',
      goal: 'Affiche :<pre>5\n4\n3\n2\n1\nDECOLLAGE</pre>(chaque ligne finie par <code>\\n</code>) avec une boucle <code>while</code>, sans <code>printf</code>.',
      lesson: '<p>Une boucle répète un bloc tant qu’une condition est vraie :</p><pre>while (i > 0)\n{\n    …\n    i--;   // sans ça : boucle infinie !\n}</pre>' +
        '<p>Pour afficher un <b>chiffre</b> avec write, il faut son <b>caractère</b>. En ASCII, <code>\'0\'</code> vaut 48, <code>\'1\'</code> vaut 49… donc <code>\'0\' + 3</code> donne <code>\'3\'</code>.</p>' +
        '<p><code>ft_putchar(c)</code> écrit 1 octet : elle passe <code>&amp;c</code>, l’<b>adresse</b> de la variable c (sur la pile), à write.</p>',
      starter: '#include <unistd.h>\n\nvoid\tft_putchar(char c)\n{\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tint\ti;\n\n\ti = 5;\n\t// TODO : tant que i > 0, affiche i puis \'\\n\', et diminue i\n\n\twrite(1, "DECOLLAGE\\n", 10);\n\treturn (0);\n}\n',
      hints: ['while (i > 0) { … }', 'Dans la boucle : ft_putchar(\'0\' + i); ft_putchar(\'\\n\'); i--;', 'Regarde la variable i changer dans la pile à chaque tour.'],
      solution: '#include <unistd.h>\n\nvoid\tft_putchar(char c)\n{\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tint\ti;\n\n\ti = 5;\n\twhile (i > 0)\n\t{\n\t\tft_putchar(\'0\' + i);\n\t\tft_putchar(\'\\n\');\n\t\ti--;\n\t}\n\twrite(1, "DECOLLAGE\\n", 10);\n\treturn (0);\n}\n',
      tests: [{ expect: '5\n4\n3\n2\n1\nDECOLLAGE\n' }],
      rules: { forbidCall: ['printf', 'puts'], mustSrc: [{ re: '\\b(while|for)\\b', msg: 'Il faut une boucle (while).' }], forbidSrc: [{ re: '"[^"]*5[^"]*4', msg: 'Ne recopie pas les chiffres à la main : laisse la boucle les calculer.' }] }
    },
    {
      id: 'c4', title: 'Le mètre du tailleur', job: 'Contrat 04 · Atelier de couture', stars: 2,
      scene: 'ruler', sceneOpts: { v: 's', i: 'i' },
      story: 'Le tailleur mesure ses rubans… lettre par lettre. Il a besoin de <code>ft_strlen</code> : une fonction qui compte les caractères d’une chaîne <b>jusqu’au <code>\\0</code></b>.',
      goal: 'Complète <code>ft_strlen</code> pour qu’elle renvoie la longueur de la chaîne. Le <code>main</code> fourni doit afficher :<pre>5\n2\n0\n22</pre><code>strlen</code> est interdite, évidemment.',
      lesson: '<p>Une chaîne C n’a pas de taille enregistrée : elle s’arrête au premier octet <code>\\0</code> (valeur 0). Pour la mesurer, on avance un indice jusqu’à le trouver :</p>' +
        '<pre>while (s[i] != \'\\0\')\n    i++;</pre>' +
        '<p><code>s</code> est un <b>pointeur</b> (8 octets sur la pile) qui contient l’adresse de la première lettre. <code>s[i]</code> lit la case située <code>i</code> octets plus loin.</p>' +
        '<p>À chaque appel de <code>ft_strlen</code>, un nouveau <b>cadre</b> apparaît sur la pile avec ses variables <code>s</code> et <code>i</code>, puis disparaît au <code>return</code>.</p>',
      starter: '#include <unistd.h>\n\nint\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\t// TODO : avance i tant que s[i] n\'est pas \'\\0\'\n\treturn (i);\n}\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tft_putnbr(ft_strlen("ruban"));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen("42"));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen(""));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen("Bienvenue a 42 Origins"));\n\twrite(1, "\\n", 1);\n\treturn (0);\n}\n',
      hints: ['Une boucle while qui teste s[i].', 'while (s[i] != \'\\0\') i++;', 'Pour la chaîne vide "", la première case est déjà \\0 : la boucle ne tourne jamais et on renvoie 0.'],
      solution: '#include <unistd.h>\n\nint\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i] != \'\\0\')\n\t\ti++;\n\treturn (i);\n}\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tft_putnbr(ft_strlen("ruban"));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen("42"));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen(""));\n\twrite(1, "\\n", 1);\n\tft_putnbr(ft_strlen("Bienvenue a 42 Origins"));\n\twrite(1, "\\n", 1);\n\treturn (0);\n}\n',
      tests: [{ expect: '5\n2\n0\n22\n' }],
      rules: { forbidCall: ['strlen'], mustCall: ['ft_strlen'] }
    },
    {
      id: 'c5', title: 'Le guichet de la poste', job: 'Contrat 05 · Postier', stars: 2,
      scene: 'mail', sceneOpts: {},
      story: 'Au guichet, chaque client glisse son prénom sous la vitre (sur l’<b>entrée standard</b>). Tu dois le lire avec <code>read</code> et répondre « Bonjour » + le prénom.',
      goal: 'Lis le prénom avec <code>read(0, …)</code> puis affiche <code>Bonjour &lt;prénom&gt;</code> suivi d’un retour à la ligne. Testé avec plusieurs clients (Alice, Bob, Zoé…).<br>Astuce : ce que <code>read</code> reçoit contient déjà le <code>\\n</code> de la touche Entrée.',
      lesson: '<p><code>lus = read(0, buffer, 99);</code> copie <b>au plus</b> 99 octets de l’entrée dans <code>buffer</code> et renvoie le nombre d’octets <b>vraiment</b> lus.</p>' +
        '<p>Pour <code>Alice⏎</code>, <code>read</code> renvoie 6 : A l i c e \\n. Attention : read <b>n’ajoute pas de <code>\\0</code></b> ! Le reste du tableau garde ses anciennes valeurs (affichées en hachuré <i>?</i>).</p>' +
        '<p>Il suffit donc d’écrire les <code>lus</code> octets du buffer : <code>write(1, buffer, lus);</code></p>' +
        '<p>Change le texte de l’onglet <b>⌨ Entrée (stdin)</b> pour essayer d’autres prénoms.</p>',
      starter: '#include <unistd.h>\n\nint main(void)\n{\n\tchar\tnom[100];\n\tint\t\tlus;\n\n\tlus = read(0, nom, 99);\n\twrite(1, "Bonjour ", 8);\n\t// TODO : affiche les octets lus\n\treturn (0);\n}\n',
      stdin: 'Alice\n',
      hints: ['La variable lus contient le nombre d’octets reçus.', 'write(1, nom, lus);', 'Pas besoin d’ajouter \\n : il est déjà dans nom !'],
      solution: '#include <unistd.h>\n\nint main(void)\n{\n\tchar\tnom[100];\n\tint\t\tlus;\n\n\tlus = read(0, nom, 99);\n\twrite(1, "Bonjour ", 8);\n\twrite(1, nom, lus);\n\treturn (0);\n}\n',
      tests: [{ stdin: 'Alice\n', expect: 'Bonjour Alice\n' }, { stdin: 'Bob\n', expect: 'Bonjour Bob\n' }, { stdin: 'Zoé\n', expect: 'Bonjour Zoé\n' }, { stdin: 'Maximilien\n', expect: 'Bonjour Maximilien\n' }],
      rules: { mustCall: ['read', 'write'] }
    },
    {
      id: 'c6', title: 'Le coffre-fort à l’envers', job: 'Contrat 06 · Serrurier', stars: 3,
      scene: 'vault', sceneOpts: { v: 's', i: 'i', j: 'j' },
      story: 'Le coffre de la banque s’ouvre avec le mot de passe… <b>écrit à l’envers</b>. Écris <code>ft_strrev</code> qui retourne une chaîne <b>sur place</b>, en échangeant les lettres deux à deux.',
      goal: 'Complète <code>ft_strrev(char *s)</code> : elle doit inverser la chaîne directement dans sa mémoire. Le main affiche ensuite :<pre>ROSERT\ncba\nX\n</pre>(la 4e chaîne est vide).',
      lesson: '<p>Technique des <b>deux indices</b> : <code>i</code> part du début, <code>j</code> de la fin (<code>longueur − 1</code>). On échange <code>s[i]</code> et <code>s[j]</code>, puis on les rapproche jusqu’à ce qu’ils se croisent.</p>' +
        '<pre>tmp  = s[i];\ns[i] = s[j];\ns[j] = tmp;</pre>' +
        '<p>Pour échanger deux cases il faut une <b>3e variable</b> (comme pour échanger deux verres d’eau !).</p>' +
        '<p><code>s</code> pointe vers le tableau <code>mot</code> du main : la fonction modifie donc directement la mémoire du main. Suis la flèche du pointeur dans la vue mémoire.</p>',
      starter: '#include <unistd.h>\n\nvoid\tft_strrev(char *s)\n{\n\tint\t\ti;\n\tint\t\tj;\n\tchar\ttmp;\n\n\ti = 0;\n\tj = 0;\n\twhile (s[j] != \'\\0\')\n\t\tj++;\n\tj--;\n\t// TODO : tant que i < j, échange s[i] et s[j] puis rapproche-les\n}\n\nvoid\tft_putstr(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\twrite(1, s, i);\n\twrite(1, "\\n", 1);\n}\n\nint main(void)\n{\n\tchar\tmot[] = "TRESOR";\n\tchar\tabc[] = "abc";\n\tchar\tx[] = "X";\n\tchar\tvide[] = "";\n\n\tft_strrev(mot);\n\tft_putstr(mot);\n\tft_strrev(abc);\n\tft_putstr(abc);\n\tft_strrev(x);\n\tft_putstr(x);\n\tft_strrev(vide);\n\tft_putstr(vide);\n\treturn (0);\n}\n',
      hints: ['while (i < j) { … }', 'Dans la boucle : tmp = s[i]; s[i] = s[j]; s[j] = tmp; i++; j--;', 'Pour la chaîne vide, j vaut -1 au départ : la condition i < j est fausse tout de suite. Parfait.'],
      solution: '#include <unistd.h>\n\nvoid\tft_strrev(char *s)\n{\n\tint\t\ti;\n\tint\t\tj;\n\tchar\ttmp;\n\n\ti = 0;\n\tj = 0;\n\twhile (s[j] != \'\\0\')\n\t\tj++;\n\tj--;\n\twhile (i < j)\n\t{\n\t\ttmp = s[i];\n\t\ts[i] = s[j];\n\t\ts[j] = tmp;\n\t\ti++;\n\t\tj--;\n\t}\n}\n\nvoid\tft_putstr(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\twrite(1, s, i);\n\twrite(1, "\\n", 1);\n}\n\nint main(void)\n{\n\tchar\tmot[] = "TRESOR";\n\tchar\tabc[] = "abc";\n\tchar\tx[] = "X";\n\tchar\tvide[] = "";\n\n\tft_strrev(mot);\n\tft_putstr(mot);\n\tft_strrev(abc);\n\tft_putstr(abc);\n\tft_strrev(x);\n\tft_putstr(x);\n\tft_strrev(vide);\n\tft_putstr(vide);\n\treturn (0);\n}\n',
      tests: [{ expect: 'ROSERT\ncba\nX\n\n' }],
      rules: { mustCall: ['ft_strrev'] }
    },
    {
      id: 'c7', title: 'La boulangerie du tas', job: 'Contrat 07 · Boulanger', stars: 3,
      scene: 'bakery', sceneOpts: {},
      story: 'La boulangère veut <b>copier</b> ses recettes pour les clients. Une copie doit vivre <b>après</b> la fin de la fonction : impossible sur la pile… il faut réserver de la place sur le <b>tas</b> avec <code>malloc</code>. Écris <code>ft_strdup</code>.',
      goal: '<code>ft_strdup(src)</code> doit : mesurer src, réserver <code>longueur + 1</code> octets avec malloc, copier chaque lettre <b>et le <code>\\0</code></b>, puis renvoyer la copie. Le main affiche les copies et les libère.<pre>baguette\ncroissant\n</pre>Aucune fuite mémoire, et <code>strdup</code> est interdite.',
      lesson: '<p>Les variables locales disparaissent à la fin de la fonction (son cadre est retiré de la pile). Pour garder des données, on demande de la mémoire au <b>tas</b> :</p>' +
        '<pre>char *copie = malloc(n + 1);   // +1 pour le \\0 !</pre>' +
        '<p><code>malloc</code> renvoie l’<b>adresse</b> d’un bloc de <code>n + 1</code> octets (contenu indéterminé, en hachuré). Le pointeur <code>copie</code> est sur la pile, le bloc sur le tas : regarde la flèche.</p>' +
        '<p>Tout bloc doit être rendu avec <code>free(copie)</code>, sinon c’est une <b>fuite mémoire</b> (signalée en rouge à la fin).</p>' +
        '<p>Oublier le +1 ? Le visualiseur détecte l’écriture hors du bloc : <b>heap-buffer-overflow</b>, comme AddressSanitizer.</p>',
      starter: '#include <unistd.h>\n#include <stdlib.h>\n\nint\t\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\treturn (i);\n}\n\nchar\t*ft_strdup(char *src)\n{\n\tchar\t*copie;\n\tint\t\ti;\n\n\t// TODO 1 : réserve ft_strlen(src) + 1 octets\n\tcopie = NULL;\n\ti = 0;\n\t// TODO 2 : copie chaque lettre, puis ajoute le \'\\0\'\n\treturn (copie);\n}\n\nint main(void)\n{\n\tchar\t*a;\n\tchar\t*b;\n\n\ta = ft_strdup("baguette");\n\tb = ft_strdup("croissant");\n\twrite(1, a, ft_strlen(a));\n\twrite(1, "\\n", 1);\n\twrite(1, b, ft_strlen(b));\n\twrite(1, "\\n", 1);\n\tfree(a);\n\tfree(b);\n\treturn (0);\n}\n',
      hints: ['copie = malloc(ft_strlen(src) + 1);', 'while (src[i]) { copie[i] = src[i]; i++; }', 'Après la boucle : copie[i] = \'\\0\'; — sans lui, ft_strlen(a) lirait des octets indéterminés.'],
      solution: '#include <unistd.h>\n#include <stdlib.h>\n\nint\t\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\treturn (i);\n}\n\nchar\t*ft_strdup(char *src)\n{\n\tchar\t*copie;\n\tint\t\ti;\n\n\tcopie = malloc(ft_strlen(src) + 1);\n\tif (copie == NULL)\n\t\treturn (NULL);\n\ti = 0;\n\twhile (src[i])\n\t{\n\t\tcopie[i] = src[i];\n\t\ti++;\n\t}\n\tcopie[i] = \'\\0\';\n\treturn (copie);\n}\n\nint main(void)\n{\n\tchar\t*a;\n\tchar\t*b;\n\n\ta = ft_strdup("baguette");\n\tb = ft_strdup("croissant");\n\twrite(1, a, ft_strlen(a));\n\twrite(1, "\\n", 1);\n\twrite(1, b, ft_strlen(b));\n\twrite(1, "\\n", 1);\n\tfree(a);\n\tfree(b);\n\treturn (0);\n}\n',
      tests: [{ expect: 'baguette\ncroissant\n' }],
      rules: { mustCall: ['malloc', 'free'], forbidCall: ['strdup', 'strcpy', 'memcpy'], noLeaks: true, noWarnings: /non initialis/ }
    },
    {
      id: 'c8', title: 'Les tickets du parc', job: 'Contrat 08 · Billetterie', stars: 4,
      scene: 'tickets', sceneOpts: {},
      story: 'Le parc d’attractions numérote ses tickets. Écris <code>ft_range(min, max)</code> qui fabrique sur le tas un <b>tableau d’int</b> contenant min, min+1, … jusqu’à max−1.',
      goal: '<code>ft_range(3, 8)</code> doit renvoyer un tableau de 5 int <code>{3, 4, 5, 6, 7}</code>. Le main l’affiche puis le libère :<pre>3 4 5 6 7 \n10 11 \n</pre>Si <code>min >= max</code>, renvoie <code>NULL</code>.',
      lesson: '<p>Un <code>int</code> occupe <b>4 octets</b>. Pour 5 int il faut donc <code>5 * sizeof(int)</code> = 20 octets :</p><pre>int *t = malloc(sizeof(int) * n);</pre>' +
        '<p>Ensuite <code>t[k]</code> désigne le k-ième int : son adresse est <code>t + k × 4</code>. Dans la vue mémoire, le bloc du tas s’affiche en cases de 4 octets numérotées [0], [1]…</p>' +
        '<p>Piège classique : <code>malloc(n)</code> ne réserve que n <b>octets</b>, pas n int ! L’écriture de <code>t[1]</code> déborderait déjà.</p>',
      starter: '#include <unistd.h>\n#include <stdlib.h>\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint\t\t*ft_range(int min, int max)\n{\n\tint\t*t;\n\tint\tk;\n\n\tif (min >= max)\n\t\treturn (NULL);\n\t// TODO : réserve (max - min) int, puis remplis t[k] = min + k\n\tt = NULL;\n\treturn (t);\n}\n\nvoid\tafficher(int min, int max)\n{\n\tint\t*t;\n\tint\tk;\n\n\tt = ft_range(min, max);\n\tk = 0;\n\twhile (k < max - min)\n\t{\n\t\tft_putnbr(t[k]);\n\t\twrite(1, " ", 1);\n\t\tk++;\n\t}\n\twrite(1, "\\n", 1);\n\tfree(t);\n}\n\nint main(void)\n{\n\tafficher(3, 8);\n\tafficher(10, 12);\n\treturn (0);\n}\n',
      hints: ['t = malloc(sizeof(int) * (max - min));', 'k = 0; while (k < max - min) { t[k] = min + k; k++; }', 'Vérifie dans la vue du tas que le bloc fait bien 20 octets pour ft_range(3, 8).'],
      solution: '#include <unistd.h>\n#include <stdlib.h>\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint\t\t*ft_range(int min, int max)\n{\n\tint\t*t;\n\tint\tk;\n\n\tif (min >= max)\n\t\treturn (NULL);\n\tt = malloc(sizeof(int) * (max - min));\n\tif (t == NULL)\n\t\treturn (NULL);\n\tk = 0;\n\twhile (k < max - min)\n\t{\n\t\tt[k] = min + k;\n\t\tk++;\n\t}\n\treturn (t);\n}\n\nvoid\tafficher(int min, int max)\n{\n\tint\t*t;\n\tint\tk;\n\n\tt = ft_range(min, max);\n\tk = 0;\n\twhile (k < max - min)\n\t{\n\t\tft_putnbr(t[k]);\n\t\twrite(1, " ", 1);\n\t\tk++;\n\t}\n\twrite(1, "\\n", 1);\n\tfree(t);\n}\n\nint main(void)\n{\n\tafficher(3, 8);\n\tafficher(10, 12);\n\treturn (0);\n}\n',
      tests: [{ expect: '3 4 5 6 7 \n10 11 \n' }],
      rules: { mustCall: ['malloc', 'free', 'ft_range'], noLeaks: true }
    },
    {
      id: 'c9', title: 'Le tri du courrier', job: 'Contrat 09 · Centre de tri', stars: 4,
      scene: 'conveyor', sceneOpts: {},
      story: 'Le centre de tri reçoit des lettres sur un tapis (l’entrée standard), <b>une ligne à la fois</b>. Avec <code>get_next_line</code>, numérote chaque lettre… et recycle chaque enveloppe (<code>free</code>) !',
      goal: 'Lis toutes les lignes avec <code>get_next_line(0)</code> jusqu’à ce qu’elle renvoie <code>NULL</code>, et affiche chacune précédée de son numéro :<pre>1: Paris\n2: Lyon\n3: Marseille\n</pre>Chaque ligne renvoyée est un bloc malloc : <b>aucune fuite</b> autorisée.',
      lesson: '<p><code>char *get_next_line(int fd)</code> (le projet GNL de 42) renvoie la ligne suivante, <code>\\n</code> compris, dans un <b>nouveau bloc du tas</b> ; ou <code>NULL</code> quand il n’y a plus rien.</p>' +
        '<pre>ligne = get_next_line(0);\nwhile (ligne != NULL)\n{\n    …utiliser ligne…\n    free(ligne);\n    ligne = get_next_line(0);\n}</pre>' +
        '<p>Si tu oublies <code>free</code>, chaque ligne reste sur le tas : regarde les blocs s’accumuler dans la vue mémoire, puis le bilan des fuites à la fin.</p>' +
        '<p>La dernière ligne peut ne pas avoir de <code>\\n</code> : teste en modifiant l’entrée !</p>',
      starter: '#include <unistd.h>\n#include <stdlib.h>\n\nchar\t*get_next_line(int fd);\n\nint\t\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\treturn (i);\n}\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tchar\t*ligne;\n\tint\t\tnum;\n\n\tnum = 1;\n\tligne = get_next_line(0);\n\t// TODO : tant que ligne n\'est pas NULL :\n\t//   affiche num, ": ", la ligne ; libère-la ; lis la suivante\n\treturn (0);\n}\n',
      stdin: 'Paris\nLyon\nMarseille\n',
      hints: ['while (ligne != NULL) { … }', 'ft_putnbr(num); write(1, ": ", 2); write(1, ligne, ft_strlen(ligne));', 'Puis : free(ligne); num++; ligne = get_next_line(0);'],
      solution: '#include <unistd.h>\n#include <stdlib.h>\n\nchar\t*get_next_line(int fd);\n\nint\t\tft_strlen(char *s)\n{\n\tint\ti;\n\n\ti = 0;\n\twhile (s[i])\n\t\ti++;\n\treturn (i);\n}\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nint main(void)\n{\n\tchar\t*ligne;\n\tint\t\tnum;\n\n\tnum = 1;\n\tligne = get_next_line(0);\n\twhile (ligne != NULL)\n\t{\n\t\tft_putnbr(num);\n\t\twrite(1, ": ", 2);\n\t\twrite(1, ligne, ft_strlen(ligne));\n\t\tfree(ligne);\n\t\tnum++;\n\t\tligne = get_next_line(0);\n\t}\n\treturn (0);\n}\n',
      tests: [{ stdin: 'Paris\nLyon\nMarseille\n', expect: '1: Paris\n2: Lyon\n3: Marseille\n' }, { stdin: 'a\n\nb', expect: '1: a\n2: \n3: b' }, { stdin: '', expect: '' }, { stdin: 'un\ndeux\ntrois\nquatre\ncinq\nsix\nsept\nhuit\nneuf\ndix\nonze\n', expect: '1: un\n2: deux\n3: trois\n4: quatre\n5: cinq\n6: six\n7: sept\n8: huit\n9: neuf\n10: dix\n11: onze\n' }],
      rules: { mustCall: ['get_next_line', 'free'], noLeaks: true }
    },
    {
      id: 'c10', title: 'Le train de marchandises', job: 'Contrat 10 · Chef de gare', stars: 5,
      scene: 'train', sceneOpts: { head: 'tete', valOff: 0, nextOff: 8 },
      story: 'Dernier contrat, le plus prestigieux : assembler un train dont chaque wagon est une <b>struct</b> allouée sur le tas, reliée au suivant par un pointeur <code>next</code> : une <b>liste chaînée</b>. Puis le démonter sans rien perdre.',
      goal: '1. Complète <code>nouveau_wagon</code> (malloc + remplir les champs).<br>2. Complète <code>accrocher</code> pour ajouter un wagon <b>à la fin</b>.<br>3. Libère <b>tous</b> les wagons à la fin du main.<br>Sortie attendue :<pre>12\n7\n23\ntotal: 42\n</pre>',
      lesson: '<pre>typedef struct s_wagon\n{\n    int             poids;  // octets 0 à 3\n    struct s_wagon  *next;  // octets 8 à 15\n}   t_wagon;</pre>' +
        '<p>La struct fait <b>16 octets</b> : 4 pour <code>poids</code>, 4 octets de <b>remplissage</b> (pour aligner le pointeur sur 8), puis 8 pour <code>next</code>. Tu verras ce « pad » dans la vue mémoire.</p>' +
        '<p><code>w->poids</code> veut dire « le champ poids de la struct pointée par w » (= <code>(*w).poids</code>).</p>' +
        '<p>Parcours : <code>while (w != NULL) { …; w = w->next; }</code>. Pour libérer, garde l’adresse du suivant <b>avant</b> le free (après, lire <code>w->next</code> serait un <b>use-after-free</b> !).</p>',
      starter: '#include <unistd.h>\n#include <stdlib.h>\n\ntypedef struct s_wagon\n{\n\tint\t\t\t\tpoids;\n\tstruct s_wagon\t*next;\n}\tt_wagon;\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nt_wagon\t*nouveau_wagon(int poids)\n{\n\tt_wagon\t*w;\n\n\t// TODO : malloc d\'un t_wagon, poids = poids, next = NULL\n\tw = NULL;\n\treturn (w);\n}\n\nvoid\taccrocher(t_wagon **tete, t_wagon *w)\n{\n\tt_wagon\t*cur;\n\n\tif (*tete == NULL)\n\t{\n\t\t*tete = w;\n\t\treturn ;\n\t}\n\tcur = *tete;\n\t// TODO : avance cur jusqu\'au dernier wagon, puis accroche w\n}\n\nint main(void)\n{\n\tt_wagon\t*tete;\n\tt_wagon\t*cur;\n\tt_wagon\t*suivant;\n\tint\t\ttotal;\n\n\ttete = NULL;\n\taccrocher(&tete, nouveau_wagon(12));\n\taccrocher(&tete, nouveau_wagon(7));\n\taccrocher(&tete, nouveau_wagon(23));\n\ttotal = 0;\n\tcur = tete;\n\twhile (cur != NULL)\n\t{\n\t\tft_putnbr(cur->poids);\n\t\twrite(1, "\\n", 1);\n\t\ttotal += cur->poids;\n\t\tcur = cur->next;\n\t}\n\twrite(1, "total: ", 7);\n\tft_putnbr(total);\n\twrite(1, "\\n", 1);\n\t// TODO : libère tous les wagons (garde le suivant avant chaque free)\n\treturn (0);\n}\n',
      hints: ['w = malloc(sizeof(t_wagon)); w->poids = poids; w->next = NULL;', 'while (cur->next != NULL) cur = cur->next; puis cur->next = w;', 'cur = tete; while (cur) { suivant = cur->next; free(cur); cur = suivant; }'],
      solution: '#include <unistd.h>\n#include <stdlib.h>\n\ntypedef struct s_wagon\n{\n\tint\t\t\t\tpoids;\n\tstruct s_wagon\t*next;\n}\tt_wagon;\n\nvoid\tft_putnbr(int n)\n{\n\tchar\tc;\n\n\tif (n >= 10)\n\t\tft_putnbr(n / 10);\n\tc = \'0\' + n % 10;\n\twrite(1, &c, 1);\n}\n\nt_wagon\t*nouveau_wagon(int poids)\n{\n\tt_wagon\t*w;\n\n\tw = malloc(sizeof(t_wagon));\n\tif (w == NULL)\n\t\treturn (NULL);\n\tw->poids = poids;\n\tw->next = NULL;\n\treturn (w);\n}\n\nvoid\taccrocher(t_wagon **tete, t_wagon *w)\n{\n\tt_wagon\t*cur;\n\n\tif (*tete == NULL)\n\t{\n\t\t*tete = w;\n\t\treturn ;\n\t}\n\tcur = *tete;\n\twhile (cur->next != NULL)\n\t\tcur = cur->next;\n\tcur->next = w;\n}\n\nint main(void)\n{\n\tt_wagon\t*tete;\n\tt_wagon\t*cur;\n\tt_wagon\t*suivant;\n\tint\t\ttotal;\n\n\ttete = NULL;\n\taccrocher(&tete, nouveau_wagon(12));\n\taccrocher(&tete, nouveau_wagon(7));\n\taccrocher(&tete, nouveau_wagon(23));\n\ttotal = 0;\n\tcur = tete;\n\twhile (cur != NULL)\n\t{\n\t\tft_putnbr(cur->poids);\n\t\twrite(1, "\\n", 1);\n\t\ttotal += cur->poids;\n\t\tcur = cur->next;\n\t}\n\twrite(1, "total: ", 7);\n\tft_putnbr(total);\n\twrite(1, "\\n", 1);\n\tcur = tete;\n\twhile (cur != NULL)\n\t{\n\t\tsuivant = cur->next;\n\t\tfree(cur);\n\t\tcur = suivant;\n\t}\n\treturn (0);\n}\n',
      tests: [{ expect: '12\n7\n23\ntotal: 42\n' }],
      rules: { mustCall: ['malloc', 'free', 'nouveau_wagon', 'accrocher'], noLeaks: true }
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
