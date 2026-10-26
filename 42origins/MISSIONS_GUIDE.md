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
