/* =========================================================================
 *  42 ORIGINS — exemples du bac à sable et mémos
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};

  O42.examples = {
    c: [
      { t: 'Chaînes et indices s[i]', d: 'Parcourir une chaîne case par case, sur la pile', stdin: '',
        code: '#include <unistd.h>\n\nint main(void)\n{\n\tchar\ts[] = "Hello";\n\tint\t\ti;\n\n\ti = 0;\n\twhile (s[i] != \'\\0\')\n\t{\n\t\tif (s[i] >= \'a\' && s[i] <= \'z\')\n\t\t\ts[i] = s[i] - 32;\n\t\ti++;\n\t}\n\twrite(1, s, i);\n\twrite(1, "\\n", 1);\n\treturn (0);\n}\n' },
      { t: 'malloc / free', d: 'Le tas, les pointeurs et les fuites', stdin: '',
        code: '#include <stdlib.h>\n#include <stdio.h>\n\nint main(void)\n{\n\tint\t*t;\n\tint\ti;\n\n\tt = malloc(sizeof(int) * 4);\n\ti = 0;\n\twhile (i < 4)\n\t{\n\t\tt[i] = i * i;\n\t\ti++;\n\t}\n\tprintf("t[3] = %d\\n", t[3]);\n\tfree(t);\n\tt = NULL;\n\treturn (0);\n}\n' },
      { t: 'Pointeurs et adresses', d: '&x, *p, et une fonction qui modifie une variable', stdin: '',
        code: '#include <stdio.h>\n\nvoid\tdoubler(int *p)\n{\n\t*p = *p * 2;\n}\n\nint main(void)\n{\n\tint\tx;\n\tint\t*p;\n\n\tx = 21;\n\tp = &x;\n\tdoubler(p);\n\tprintf("x = %d (adresse %p)\\n", x, p);\n\treturn (0);\n}\n' },
      { t: 'get_next_line', d: 'Lire l’entrée ligne par ligne', stdin: 'première ligne\ndeuxième ligne\nfin',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nchar\t*get_next_line(int fd);\n\nint main(void)\n{\n\tchar\t*line;\n\n\twhile ((line = get_next_line(0)) != NULL)\n\t{\n\t\tprintf("[%s]", line);\n\t\tfree(line);\n\t}\n\treturn (0);\n}\n' },
      { t: 'read + open', d: 'Lire un fichier avec un descripteur', stdin: '',
        code: '#include <unistd.h>\n#include <fcntl.h>\n\nint main(void)\n{\n\tchar\tbuf[16];\n\tint\t\tfd;\n\tint\t\tn;\n\n\tfd = open("texte.txt", O_RDONLY);\n\tn = read(fd, buf, 15);\n\twhile (n > 0)\n\t{\n\t\twrite(1, buf, n);\n\t\tn = read(fd, buf, 15);\n\t}\n\tclose(fd);\n\treturn (0);\n}\n' },
      { t: 'Liste chaînée', d: 'struct, -> et maillons sur le tas', stdin: '',
        code: '#include <stdlib.h>\n#include <stdio.h>\n\ntypedef struct s_list\n{\n\tint\t\t\t\tval;\n\tstruct s_list\t*next;\n}\tt_list;\n\nt_list\t*push(t_list *head, int v)\n{\n\tt_list\t*n;\n\n\tn = malloc(sizeof(t_list));\n\tn->val = v;\n\tn->next = head;\n\treturn (n);\n}\n\nint main(void)\n{\n\tt_list\t*l;\n\tt_list\t*tmp;\n\n\tl = NULL;\n\tl = push(l, 3);\n\tl = push(l, 2);\n\tl = push(l, 1);\n\twhile (l)\n\t{\n\t\tprintf("%d ", l->val);\n\t\ttmp = l->next;\n\t\tfree(l);\n\t\tl = tmp;\n\t}\n\tprintf("\\n");\n\treturn (0);\n}\n' },
      { t: 'Récursion', d: 'Les cadres de pile s’empilent puis se dépilent', stdin: '',
        code: '#include <stdio.h>\n\nint\tfact(int n)\n{\n\tif (n <= 1)\n\t\treturn (1);\n\treturn (n * fact(n - 1));\n}\n\nint main(void)\n{\n\tprintf("4! = %d\\n", fact(4));\n\treturn (0);\n}\n' },
      { t: 'static : le compteur', d: 'Une variable qui survit entre les appels (.data)', stdin: '',
        code: '#include <stdio.h>\n\nint\tcompteur(void)\n{\n\tstatic int\tn = 0;\n\n\tn++;\n\treturn (n);\n}\n\nint main(void)\n{\n\tcompteur();\n\tcompteur();\n\tprintf("%d\\n", compteur());\n\treturn (0);\n}\n' },
      { t: '🐞 Use-after-free', d: 'Bug : lire un bloc déjà libéré', stdin: '',
        code: '#include <stdlib.h>\n#include <string.h>\n#include <stdio.h>\n\nint main(void)\n{\n\tchar\t*s;\n\n\ts = strdup("secret");\n\tfree(s);\n\tprintf("%c\\n", s[0]);   // ← le bloc ne nous appartient plus\n\treturn (0);\n}\n' },
      { t: '🐞 Le +1 oublié', d: 'Bug : malloc trop petit pour le \\0', stdin: '',
        code: '#include <stdlib.h>\n\nint main(void)\n{\n\tchar\t*s;\n\tint\t\ti;\n\n\ts = malloc(5);\n\ti = 0;\n\twhile (i < 5)\n\t{\n\t\ts[i] = \'a\' + i;\n\t\ti++;\n\t}\n\ts[i] = \'\\0\';   // ← case 5 : en dehors du bloc !\n\tfree(s);\n\treturn (0);\n}\n' },
      { t: '🐞 Chaîne littérale', d: 'Bug : modifier un texte en lecture seule', stdin: '',
        code: 'int main(void)\n{\n\tchar\t*s;\n\tchar\tt[] = "abc";\n\n\tt[0] = \'X\';      // OK : t est une copie sur la pile\n\ts = "abc";\n\ts[0] = \'X\';      // segfault : .rodata est en lecture seule\n\treturn (0);\n}\n' }
    ],
    py: [
      { t: 'Variables et objets', d: 'Noms dans le cadre, objets sur le tas', stdin: '',
        code: 'age = 42\nnom = "Ada"\nnotes = [12, 15, 9]\nnotes.append(20)\nprint(nom, age, notes)\n' },
      { t: 'Alias de listes', d: 'Deux noms, un seul objet', stdin: '',
        code: 'a = [1, 2, 3]\nb = a\nc = a.copy()\nb.append(4)\nprint(a)\nprint(c)\nprint(a is b, a is c)\n' },
      { t: 'Fonctions et cadres', d: 'Chaque appel crée un cadre', stdin: '',
        code: 'def carre(x):\n    resultat = x * x\n    return resultat\n\ndef somme_carres(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += carre(i)\n    return total\n\nprint(somme_carres(3))\n' },
      { t: 'Dictionnaire', d: 'Clés et valeurs', stdin: 'le chat et le chien\n',
        code: 'phrase = input()\nfreq = {}\nfor mot in phrase.split():\n    freq[mot] = freq.get(mot, 0) + 1\nprint(freq)\n' },
      { t: 'Récursion : Fibonacci', d: 'La pile d’appels en action', stdin: '',
        code: 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(8)])\n' },
      { t: 'Chaînes immuables', d: 'Tranches et nouvelles chaînes', stdin: '',
        code: 's = "bonjour"\nt = s.upper()\nu = s[:3] + "soir"\nprint(s, t, u)\nprint(s[::-1])\n' },
      { t: '🐞 Erreurs classiques', d: 'IndexError, TypeError…', stdin: '',
        code: 'l = [10, 20, 30]\nprint(l[2])\nprint("total: " + str(len(l)))\nprint(l[3])\n' }
    ],
    asm: [
      { t: 'Hello world', d: 'write puis exit', stdin: '',
        code: 'section .data\n\tmsg\tdb "Hello, 42!", 10\n\tlen\tequ $ - msg\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 1\t\t; write\n\tmov\trdi, 1\t\t; stdout\n\tmov\trsi, msg\n\tmov\trdx, len\n\tsyscall\n\n\tmov\trax, 60\t\t; exit\n\txor\trdi, rdi\n\tsyscall\n' },
      { t: 'Arithmétique et drapeaux', d: 'add, sub, imul, cmp', stdin: '',
        code: 'section .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 5\n\tmov\trbx, 3\n\tadd\trax, rbx\t\t; 8\n\tsub\trax, 8\t\t; 0 -> ZF = 1\n\tsub\trax, 1\t\t; -1 -> SF = 1\n\timul\trbx, 14\t\t; 42\n\tcmp\trbx, 42\n\tje\t.ok\n\tmov\trdi, 1\n\tjmp\t.fin\n.ok:\n\tmov\trdi, rbx\n.fin:\n\tmov\trax, 60\n\tsyscall\n' },
      { t: 'Boucle et compteur', d: 'dec / jnz', stdin: '',
        code: 'section .text\n\tglobal\t_start\n\n_start:\n\txor\trax, rax\n\tmov\trcx, 10\n.boucle:\n\tadd\trax, rcx\t\t; somme de 10 à 1\n\tdec\trcx\n\tjnz\t.boucle\n\tmov\trdi, rax\t\t; 55\n\tmov\trax, 60\n\tsyscall\n' },
      { t: 'Fonction : call / ret', d: 'La pile garde l’adresse de retour', stdin: '',
        code: 'section .text\n\tglobal\t_start\n\n; int carre(int x) : x dans rdi, résultat dans rax\ncarre:\n\tpush\trbp\n\tmov\trbp, rsp\n\tmov\trax, rdi\n\timul\trax, rdi\n\tpop\trbp\n\tret\n\n_start:\n\tmov\trdi, 7\n\tcall\tcarre\n\tmov\trdi, rax\t\t; 49\n\tmov\trax, 60\n\tsyscall\n' },
      { t: 'push / pop', d: 'La pile LIFO', stdin: '',
        code: 'section .text\n\tglobal\t_start\n\n_start:\n\tpush\t1\n\tpush\t2\n\tpush\t3\n\tpop\trax\t\t; 3\n\tpop\trbx\t\t; 2\n\tpop\trcx\t\t; 1\n\tmov\trdi, rax\n\tmov\trax, 60\n\tsyscall\n' },
      { t: 'Lecture clavier', d: 'syscall read puis write', stdin: 'echo !\n',
        code: 'section .bss\n\tbuf\tresb 64\n\nsection .text\n\tglobal\t_start\n\n_start:\n\txor\trax, rax\t\t; read\n\txor\trdi, rdi\t\t; stdin\n\tmov\trsi, buf\n\tmov\trdx, 64\n\tsyscall\n\tmov\trdx, rax\t\t; octets lus\n\tmov\trax, 1\n\tmov\trdi, 1\n\tsyscall\n\tmov\trax, 60\n\txor\trdi, rdi\n\tsyscall\n' },
      { t: 'main + malloc', d: 'Appeler la libc', stdin: '',
        code: 'extern\tmalloc\nextern\tfree\n\nsection .text\n\tglobal\tmain\n\nmain:\n\tpush\trbx\n\tmov\trdi, 4\n\tcall\tmalloc\n\tmov\trbx, rax\n\tmov\tdword [rbx], 0x0a4b4f\t; "OK\\n"\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, rbx\n\tmov\trdx, 3\n\tsyscall\n\tmov\trdi, rbx\n\tcall\tfree\n\tpop\trbx\n\txor\teax, eax\n\tret\n' },
      { t: '🐞 Oubli de exit', d: 'Le processeur continue dans le vide', stdin: '',
        code: 'section .data\n\tmsg\tdb "et ensuite ?", 10\n\nsection .text\n\tglobal\t_start\n\n_start:\n\tmov\trax, 1\n\tmov\trdi, 1\n\tmov\trsi, msg\n\tmov\trdx, 13\n\tsyscall\n\t; pas de exit…\n' }
    ]
  };

  O42.memos = {
    c: '<h4>ENTRÉES / SORTIES</h4><pre>write(fd, buf, n)    // fd 1 = écran\nread(fd, buf, n)     // fd 0 = clavier\nchar *get_next_line(int fd)\nopen("f", O_RDONLY) / close(fd)</pre>' +
      '<h4>MÉMOIRE</h4><pre>malloc(n) / calloc(n, t) / free(p)\nsizeof(int) = 4   sizeof(char *) = 8</pre>' +
      '<h4>ZONES</h4><table><tr><td style="color:var(--stack)">stack</td><td>variables locales, paramètres</td></tr><tr><td style="color:var(--heap)">heap</td><td>blocs malloc</td></tr><tr><td style="color:var(--data)">.data</td><td>globales, static</td></tr><tr><td style="color:var(--rodata)">.rodata</td><td>"textes" (lecture seule)</td></tr></table>' +
      '<h4>AUSSI DISPONIBLES</h4><pre>printf putchar puts strlen strcpy strdup\nstrcmp strcat memset memcpy atoi exit\nisalpha isdigit toupper tolower</pre>',
    py: '<h4>BASES</h4><pre>print(a, b, sep=" ", end="\\n")\nx = input()       # toujours un str\nint("42")  str(42)  float("1.5")</pre>' +
      '<h4>LISTES / DICTS</h4><pre>l.append(x)  l.pop()  len(l)  l[-1]\nd = {"k": 1}  d.get("k", 0)  d.items()\n[x * 2 for x in l if x > 0]</pre>' +
      '<h4>MÉMOIRE</h4><p>Les noms vivent dans les <b>cadres</b> ; les objets (str, list, dict, fonctions) sur le <b>tas</b>. <code>b = a</code> partage l’objet, <code>a.copy()</code> le duplique.</p>',
    asm: '<h4>APPELS SYSTÈME</h4><table><tr><td>rax</td><td>appel</td><td>rdi, rsi, rdx</td></tr><tr><td>0</td><td>read</td><td>fd, buf, n</td></tr><tr><td>1</td><td>write</td><td>fd, buf, n</td></tr><tr><td>2</td><td>open</td><td>nom, flags</td></tr><tr><td>3</td><td>close</td><td>fd</td></tr><tr><td>60</td><td>exit</td><td>code</td></tr></table>' +
      '<h4>APPEL DE FONCTION (System V)</h4><pre>arguments : rdi rsi rdx rcx r8 r9\nretour    : rax\npréservés : rbx rbp r12-r15 rsp\nsyscall écrase rcx et r11</pre>' +
      '<h4>SAUTS APRÈS cmp a, b</h4><pre>je jne      égal / différent\njg jge jl jle   signé\nja jae jb jbe   non signé</pre>' +
      '<h4>TAILLES</h4><pre>byte 8 · word 16 · dword 32 · qword 64 bits\nrax ⊃ eax ⊃ ax ⊃ al (et ah)</pre>'
  };
})(typeof window !== 'undefined' ? window : globalThis);
