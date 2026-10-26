# Écrire des missions pour 42 Origins

42 Origins (dossier `42origins/`) est un site qui exécute du C, du Python ou de l'assembleur x86-64 **pas à pas dans un moteur JavaScript maison** et montre la mémoire. Les missions sont des petits « contrats » (jobs) de plus en plus difficiles. Tout le texte est en **français**, tutoiement, ton simple et encourageant, petite mise en scène sur le campus « 42 Origins » (personnages, métiers, commerces…).

Chaque langage a **10 chapitres × 10 missions**. Les missions `ord: 10` existent déjà (fichiers `js/missions_c.js`, `js/missions_py.js`, `js/missions_asm.js`, ids `c1`…`c10`, `p1`…`p10`, `a1`…`a10` : la mission k est la finale du chapitre k). **Lis-les d'abord** : elles donnent le style et le niveau attendu à la fin de chaque chapitre. Tu écris les missions `ord: 1` à `9` d'un chapitre, en difficulté croissante, qui préparent la finale.

Les titres des chapitres sont dans `js/chapters.js`.

## Format

Un fichier `js/missions_<lang>_<n>.js` (ex. `missions_c_1.js`) :

```js
/* 42 ORIGINS — missions C, chapitres 1 à 5 */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.c = O42.missions.c || [];
  O42.missions.c.push(
    {
      id: 'c1_1', ch: 1, ord: 1,
      title: 'Le premier mot',                       // court, concret
      story: 'Le gardien du campus…',                // 1-2 phrases, HTML simple autorisé (<b>, <code>)
      goal: 'Affiche exactement :<pre>A⏎</pre>…',    // ce qu'il faut faire + sortie attendue (⏎ = retour à la ligne)
      lesson: '<p>…</p>',                            // OPTIONNEL : 1-3 courts paragraphes sur la notion nouvelle
      starter: '…',                                  // code de départ : doit s'exécuter (ou compiler) mais NE PAS réussir
      solution: '…',                                 // une solution correcte et lisible
      hints: ['…', '…', '…'],                        // 2-3 indices progressifs, le dernier presque la réponse
      tests: [{ stdin: '…', expect: '…' }],          // sortie EXACTE attendue ; exit: N pour le code de sortie
      rules: { mustCall: ['write'], forbidCall: ['printf'], forbidSrc: [{ re: 'regex', msg: '…' }], mustSrc: [{ re: 'regex', msg: '…' }], noLeaks: true },
      scene: 'terminal', sceneOpts: {}               // OPTIONNEL, voir plus bas
    },
    …
  );
})(typeof window !== 'undefined' ? window : globalThis);
```

- `id` : `c<ch>_<ord>`, `p<ch>_<ord>`, `a<ch>_<ord>`.
- Les chaînes de code : guillemets simples JS avec `\n` pour les retours à la ligne et `\t` pour l'indentation C / ASM, 4 espaces en Python. Dans le code C, un `'\n'` C s'écrit donc `\'\\n\'` dans la chaîne JS. Tu peux aussi utiliser des gabarits `` `…` `` (attention : `\n` y devient un vrai retour, et `\\n` le `\n` C).
- `tests` : 1 à 4 tests. Si la mission lit l'entrée, **au moins 2 tests** avec des entrées différentes (le joueur ne doit pas pouvoir tricher en écrivant la réponse en dur). `stdin` absent = entrée de la mission (`stdin: '…'` au niveau de la mission, ce que voit le joueur au départ) ou vide.
- `rules` (toutes optionnelles) : `mustCall` / `forbidCall` = noms de fonctions appelées (C : fonctions de la bibliothèque ET fonctions du joueur ; Python : fonctions, méthodes (`append`…) et fonctions du joueur ; ASM : fonctions externes `malloc`, `free`…) ; `forbidSrc` / `mustSrc` = regex testées sur le code sans commentaires (pour interdire de tricher, imposer une boucle…) ; `noLeaks` = aucun bloc malloc non libéré (C, ASM) ; `noWarnings: /regex/` = refuse si un avertissement du visualiseur correspond (ex. `/pile non align/` en ASM).
- **Pas de `poke`** dans les nouvelles missions : fais varier les tests par l'entrée standard.
- Le `starter` doit tourner dans le visualiseur sans erreur de compilation si possible (un `// TODO` à la place du code manquant) et **échouer** au juge. La `solution` doit **réussir**.
- Garde les programmes petits (quelques centaines d'étapes, jamais plus de ~50 000) : le joueur les suit pas à pas.
- Ne rien afficher qui dépende des adresses (`%p`, `id()`), du hasard ou de la plateforme : la sortie doit être identique entre le visualiseur et le vrai gcc / python3 / nasm.
- Progression : ord 1 très simple, ord 9 presque au niveau de la finale. Varie les situations (métiers, objets du campus), évite de répéter la même mission.

## Scènes disponibles (`scene` + `sceneOpts`)

`terminal` (par défaut), `talk` {who:'robot'|'human', name, expect, happy, wrong, wait}, `sign` {v: nom d'un tableau/chaîne, text: texte initial}, `rocket` {}, `ruler` {v: chaîne, i: indice}, `mail` {title, parrot:true}, `vault` {v, i, j}, `bakery` {title} (montre les blocs du tas), `tickets` {} (dernier tableau d'int du tas, C), `conveyor` {title} (lignes de stdin traitées), `train` {head, valOff, nextOff} (liste chaînée C), `door` {code} (code de sortie ASM), `calc` {regs:[…]} (ASM), `bouncer` {v} (ASM, valeur d'une étiquette), `bars` {v, title} (Python : dict ou liste de nombres), `twins` {a, b} (Python : deux noms → listes), `hanoi` {n}, `plates` {} (pile ASM). Utilise `terminal` quand rien ne colle ; une scène adaptée de temps en temps rend le chapitre vivant.

## Ce que les moteurs savent faire

**C** : `int char short long unsigned size_t ssize_t bool float double`, pointeurs, tableaux (2D compris), `struct`, `typedef`, `enum`, `static`, `const`, `if/else while do for switch break continue return`, opérateurs habituels, ternaire, cast, `sizeof`, `#include` (ignoré), `#define NOM valeur` (sans paramètres). Bibliothèque : `write read open close malloc calloc realloc free printf dprintf putchar puts strlen strcpy strncpy strcat strcmp strncmp strdup strchr memset bzero memcpy memmove atoi abs exit isalpha isdigit isalnum isspace isupper islower isprint toupper tolower get_next_line` (déclare `char *get_next_line(int fd);`). `printf` : `%d %i %u %x %X %o %c %s %f %ld %lu %zu %%` avec largeur, précision, `-`, `0`. Fichier virtuel `texte.txt` pour `open` (contenu : `Bonjour depuis un fichier !\nDeuxième ligne.\n`). **Pas** de pointeurs sur fonction, macros à paramètres, goto, fonctions variadiques du joueur, renvoi de struct par valeur, initialiseurs désignés. `main` renvoie le code de sortie. Style 42 apprécié (tabulations, `return (0);`), sans obligation.

**Python** : sous-ensemble de Python 3 **sans classes, sans with, sans yield**. `def` (défauts, `*args`, `**kwargs`), `lambda`, `if/elif/else`, `while`, `for`, `break/continue/pass`, `try/except`, `global`, `assert`, `del`, compréhensions de liste/dict/set, f-strings avec format (`{x:.2f}`, `{s:>5}`), `%`-format, tranches, chaînes de comparaisons, `in`, `is`. Fonctions : `print(sep=, end=) input len range int float str bool list tuple set dict abs min max sum sorted(reverse=) reversed enumerate zip ord chr round divmod pow any all type isinstance hex bin map filter`. Méthodes str : `upper lower capitalize title swapcase strip lstrip rstrip split join replace find rfind index count startswith endswith isdigit isalpha isalnum isspace isupper islower center ljust rjust zfill format` ; list : `append extend insert pop remove index count reverse sort(reverse=) copy clear` ; dict : `get keys values items pop setdefault update copy` ; set : `add`. **Pas** de `key=` pour sorted/min/max, pas d'import (sauf `math`). Entiers en précision illimitée.

**ASM** : NASM x86-64 Linux. `section .data/.rodata/.bss/.text`, `global`, `extern`, `db dw dd dq` (chaînes, nombres, `10` pour `\n`), `resb resw resd resq`, `equ` (avec `$ - msg`), `times`, étiquettes locales `.boucle`. Instructions : `mov movzx movsx movsxd lea add sub adc sbb inc dec imul mul div idiv neg not and or xor shl sal shr sar rol ror cmp test jmp jcc (je jne jg jge jl jle ja jae jb jbe jz jnz js jns jo jno…) setcc cmovcc call ret push pop syscall nop xchg cqo cdq cdqe leave loop movsb stosb lodsb scasb cmpsb (avec rep) cld std`. Opérandes mémoire `[base + index*échelle + déplacement]` ; une écriture d'immédiat en mémoire exige `byte/word/dword/qword`. Syscalls : 0 read, 1 write, 2 open, 3 close, 60 exit (syscall écrase rcx et r11). Point d'entrée `_start` (terminer par exit) ou `main` (avec `extern malloc`/`free`/`printf`, `ret` termine avec eax). Fonctions externes : `malloc calloc free printf puts putchar strlen strdup strcpy strcmp write read exit __errno_location`. Pile alignée sur 16 avant un `call` vers la libc.

## Vérification (obligatoire)

```bash
node 42origins/tests/realcheck.js <lang> <préfixe>     # ex. : node 42origins/tests/realcheck.js c c1_ c2_ c3_ c4_ c5_
```

Pour chaque mission : la solution doit passer le juge, le code de départ échouer, et pour chaque test la sortie attendue doit être égale à celle du **vrai** programme (gcc, python3, nasm + ld) **et** à celle du visualiseur. Ne termine pas avant que ta commande affiche `0 en échec` pour tes missions. Si le visualiseur diffère du vrai programme, contourne-le dans la mission (n'édite pas les moteurs) et signale-le dans ton rapport final.

---

## Missions COBOL

Domaine `cobol`, moteur `js/engine_cobol.js`. Les 10 **contrats finaux** (ids `cob1`…`cob10`) sont dans `js/missions_cobol.js` — **lis-les d'abord** pour le style et le niveau. Tu écris les ords 1 à 9 de chaque chapitre dans `js/missions_cobol_1.js` (chapitres 1-5, ids `cob1_1`…`cob5_9`) ou `js/missions_cobol_2.js` (chapitres 6-10, ids `cob6_1`…`cob10_9`). Format identique aux autres domaines (id, ch, ord, title, story, goal, lesson, starter, solution, hints, tests, rules, scene). Fichiers : `O42.missions.cobol = O42.missions.cobol || []; O42.missions.cobol.push(...)`.

**⚠ Il n'y a pas de vrai compilateur COBOL ici : le moteur EST la référence.** Écris la solution, exécute-la mentalement, et surtout vérifie la sortie exacte avec la commande de vérification. Mets dans `expect` **exactement** ce que le moteur produit (y compris les zéros de tête des PIC 9 et les espaces des champs édités/alphanumériques).

Astuces de rédaction COBOL :
- Les programmes commencent par `IDENTIFICATION DIVISION.` + `PROGRAM-ID. NOM.` puis `DATA DIVISION. WORKING-STORAGE SECTION.` (si données) et `PROCEDURE DIVISION.`. Termine par `STOP RUN.`. Indente le code (7 espaces avant les niveaux 01, comme dans les finals).
- `PIC 9(n)` = nombre (cadré à droite, zéros de tête inclus à l'affichage) ; `PIC X(n)` = texte (cadré à gauche, complété par des espaces) ; `V` = virgule implicite ; `S` = signé ; champs édités `$ Z , . -`. `VALUE` donne la valeur initiale.
- Verbes gérés : `DISPLAY` (plusieurs éléments, littéraux et champs), `ACCEPT` (lit une ligne de stdin), `MOVE … TO …`, `ADD/SUBTRACT/MULTIPLY/DIVIDE … GIVING … REMAINDER …`, `COMPUTE`, `IF/ELSE/END-IF`, `EVALUATE … WHEN … END-EVALUATE`, `PERFORM` (paragraphe ; `n TIMES` ; `UNTIL` ; `VARYING … FROM … BY … UNTIL …` ; `… END-PERFORM`), paragraphes, `STRING … DELIMITED BY … INTO`, `INSPECT … REPLACING/TALLYING`, `INITIALIZE`, `OCCURS` + indices `T(I)`.
- Commentaires : `*` en colonne 7 ou `*` en début de ligne (évite-les dans le code testé car la numérotation de colonnes libre peut varier).
- Le code de départ doit s'exécuter mais donner une mauvaise sortie (laisse un `CONTINUE` ou une valeur fausse à compléter). `mustSrc`/`forbidSrc` empêchent de tricher ; pas de `noLeaks` (pas de tas en COBOL).
- `scene` : garde `'terminal'` (le panneau de droite montre déjà la WORKING-STORAGE case par case).

## Missions Cybersécurité

Domaine `cyber`, moteur `js/engine_cyber.js`. **Tout est simulé et pédagogique** : on comprend une faille pour savoir la corriger ; aucun vrai système. Les 10 contrats finaux (`cyb1`…`cyb10`) sont dans `js/missions_cyber.js` — **lis-les**. Tu écris les ords 1 à 9 dans `js/missions_cyber_1.js` (ch 1-5, `cyb1_1`…`cyb5_9`) et `js/missions_cyber_2.js` (ch 6-10, `cyb6_1`…`cyb10_9`). `O42.missions.cyber.push(...)`.

Une mission cyber a un champ **`cyber`** (la cible) en plus des champs habituels. L'éditeur contient la **charge** du joueur (`starter` = charge qui échoue, `solution` = charge qui réussit). `tests: [{}]` suffit (le juge vérifie que la solution compromet la cible, `m.ok === true`, et que le starter échoue). Pas de `expect`. `scene: 'terminal'`.

Simulateurs disponibles (`cyber.sim`) et leur config (toutes les fonctions renvoient un objet NEUF à chaque appel) :
- **`crypto`** : `{kind:'caesar', cipher:'...', plain:'...'}` (le joueur écrit le texte clair) · `{kind:'xor', cipherHex:'..'}` (le joueur écrit la clé ; le clair doit contenir `flag{`) · `{kind:'hash', hash:'h...', algo:'...'}` (le joueur écrit le mot de passe ; hash via `O42.cyber.toyHash`).
- **`sqli`** : `{field, fixed:{...}, db:function(){return {table:{cols:[...],rows:[{...}]}}}, query:function(vals){return "SELECT ..."}, success:function(rows){return ...}}`. Le joueur écrit `field: payload`. Le moteur a un mini-SQL (SELECT/WHERE/AND/OR/LIKE/UNION, commentaires `--` `#`).
- **`cmdi`** : `{field, template:'...', build:function(inj){return 'cmd '+inj}, fs:function(){return {'flag.txt':{content:'FLAG=flag{..}',secret:true}}}, success:function(out){...}}`. Shell jouet : echo, whoami, id, ls, cat, pwd, ping ; séparateurs `; && || |`.
- **`pathtrav`** : `{field, base:'/var/www/html/', fs:function(){return {'/chemin':{content:'..',secret:true}}}, success:function(path,content){...}}`. Le joueur écrit `file: ../../etc/passwd`.
- **`logic`** : `{state:function(){return {...}}, panel:function(st,req){return {title,html}}, check:function(st,req,c){return {ok:true,msg,win} | {fail:'...'}}, defense:'...', flag}`. Logique/IDOR sur mesure, requête en `clé: valeur`.
- **`overflow`** : `{buf:16, afterLen:1|4, afterInit:0, varName, afterName, success:function(after){return after!==0}}`. Mémoire affichée case par case ; le joueur tape une entrée qui déborde.
- **`formatstr`** : `{stack:['..','SECRET=flag{..}','..'], secret}`. Le joueur utilise `%x`/`%s` pour fuiter.
- **`token`** : JWT jouet. `{secret?}`. Le joueur colle un jeton `header.payload.sig`. Gagne si `alg:none` (ou signature valide avec le secret) ET `role:admin`.
- **`xss`** : `{template:'...{{input}}...', cookie:'SESSION=flag{..}'}`. Le joueur injecte un script qui lit `document.cookie`.

Progression : ord 1 très guidé (payload presque donné dans la leçon), ord 9 proche du final. Varie les scénarios (différentes tables, fichiers, formulaires). Garde un ton pédagogique, toujours avec la **défense** (🛡) dans la leçon. `forbidSrc` empêche d'écrire en dur le secret au lieu de l'exploiter.

**Vérification (COBOL et Cyber)** :
```bash
node 42origins/tests/realcheck.js cobol cob1_ cob2_ ...   # ou : node 42origins/tests/realcheck.js cobol
node 42origins/tests/realcheck.js cyber cyb1_ cyb2_ ...
```
Pour chaque mission : la solution est acceptée, le code/charge de départ est refusé, et (cyber) la cible est bien compromise. Ne termine pas avant `0 en échec`. Lance aussi `node --check` sur ton fichier.
