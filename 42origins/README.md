# 42 ORIGINS

Visualiseur pas à pas de code **C**, **Python** et **assembleur x86-64** (NASM, Linux), dans le navigateur, sans dépendance.

- **Mémoire case par case** : pile (cadres, variables, paramètres, padding d’alignement), tas (blocs `malloc`, en-têtes, blocs libérés, fuites), `.data`/`.bss`, `.rodata`. Chaque case affiche son indice (`s[2]`), sa valeur, son adresse et sa zone ; la case lue ou écrite au dernier pas est surlignée avec l’expression (`s[i]`), et chaque pointeur a sa flèche.
- **Débogueur** : pas, par-dessus, sortir, retour en arrière, points d’arrêt (clic sur un numéro de ligne), vitesse de 0,5 pas/s à instantané, explication en français de chaque étape, sortie standard et bilan final (code de sortie, allocations, fuites, avertissements).
- **C** : pointeurs, tableaux, `struct`, `typedef`, `enum`, `static`, `malloc`/`calloc`/`realloc`/`free`, `write`/`read`/`open`/`close`, `get_next_line`, `printf`… Détection des segfaults, débordements (pile, tas, globales), use-after-free, double free, lectures non initialisées et fuites.
- **Python** : sous-ensemble de Python 3 (sans classes) ; noms dans les cadres, objets sur le tas avec leur id et leur compteur de références (alias de listes visibles).
- **Assembleur** : vue processeur en temps réel (pipeline fetch → decode → execute → write-back, RIP, ALU, drapeaux ZF/SF/CF/OF, 16 registres avec zoom rax/eax/ax/ah/al, bus mémoire), pile en tranches de 8 octets avec adresses de retour, syscalls `read`/`write`/`open`/`close`/`exit`, `call malloc`/`free`/`printf`.
- **300 missions** (100 par langage, en 10 chapitres de 10), de plus en plus difficiles : objectif, leçon, indices, tests cachés, solution, et une scène animée branchée sur la mémoire pour les contrats finaux. Un chapitre s’ouvre quand la moitié du précédent est réussie ; chaque réussite affiche une fenêtre « Bien joué ! ».
- **Écrire petit à petit** : mode *Direct* (réexécution à chaque frappe) ou *Rejouer jusqu’ici* après une modification en pause.

## Lancer

```bash
node tools/serve.js        # depuis la racine du dépôt
```

puis ouvrir http://localhost:8737/42origins/index.html (ou ouvrir `42origins/index.html` directement).

## Tests

```bash
node 42origins/tests/missions.js      # juge : solutions acceptées, codes de départ refusés, exemples
node 42origins/tests/realcheck.js     # compare chaque mission aux vrais gcc, python3 et nasm + ld
```

`realcheck.js` vérifie, pour chaque test de chaque mission, que la sortie attendue est celle du vrai programme et que le visualiseur produit la même. Le guide de rédaction des missions est dans `MISSIONS_GUIDE.md`.
