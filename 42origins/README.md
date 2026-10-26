# 42 ORIGINS

Visualiseur pas à pas de code **C**, **Python** et **assembleur x86-64** (NASM, Linux), dans le navigateur, sans dépendance.

- **Mémoire case par case** : pile (cadres, variables, paramètres, padding d’alignement), tas (blocs `malloc`, en-têtes, blocs libérés, fuites), `.data`/`.bss`, `.rodata`. Chaque case affiche son indice (`s[2]`), sa valeur, son adresse et sa zone ; la case lue ou écrite au dernier pas est surlignée avec l’expression (`s[i]`), et chaque pointeur a sa flèche.
- **Débogueur** : pas, par-dessus, sortir, retour en arrière, points d’arrêt (clic sur un numéro de ligne), vitesse de 0,5 pas/s à instantané, explication en français de chaque étape, sortie standard et bilan final (code de sortie, allocations, fuites, avertissements).
- **C** : pointeurs, tableaux, `struct`, `typedef`, `enum`, `static`, `malloc`/`calloc`/`realloc`/`free`, `write`/`read`/`open`/`close`, `get_next_line`, `printf`… Détection des segfaults, débordements (pile, tas, globales), use-after-free, double free, lectures non initialisées et fuites.
- **Python** : sous-ensemble de Python 3 (sans classes) ; noms dans les cadres, objets sur le tas avec leur id et leur compteur de références (alias de listes visibles).
- **Assembleur** : vue processeur en temps réel (pipeline fetch → decode → execute → write-back, RIP, ALU, drapeaux ZF/SF/CF/OF, 16 registres avec zoom rax/eax/ax/ah/al, bus mémoire), pile en tranches de 8 octets avec adresses de retour, syscalls `read`/`write`/`open`/`close`/`exit`, `call malloc`/`free`/`printf`.
- **30 missions** (10 par langage), présentées comme des contrats de plus en plus difficiles, chacune avec une scène animée branchée sur la mémoire du programme, une leçon, des indices, des tests cachés et une solution.
- **Écrire petit à petit** : mode *Direct* (réexécution à chaque frappe) ou *Rejouer jusqu’ici* après une modification en pause.

## Lancer

```bash
node tools/serve.js        # depuis la racine du dépôt
```

puis ouvrir http://localhost:8737/42origins/index.html (ou ouvrir `42origins/index.html` directement).

## Tests

```bash
node 42origins/tests/missions.js
```

Vérifie que les 30 solutions passent le juge, que les 30 codes de départ échouent, et que les exemples du bac à sable se comportent comme prévu (les exemples 🐞 doivent planter).
