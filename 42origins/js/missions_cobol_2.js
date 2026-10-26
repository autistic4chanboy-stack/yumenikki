/* =========================================================================
 *  42 ORIGINS — missions COBOL chapitres 6-10 (ords 1-9)
 *  Remplies niveau par niveau ; le moteur engine_cobol.js est la référence.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cobol = O42.missions.cobol || [];
  function H(id) { return 'IDENTIFICATION DIVISION.\n       PROGRAM-ID. ' + id + '.\n'; }
  O42.missions.cobol.push(
    /* ===================== Chapitre 6 — Boucles ===================== */
    {
      id: 'cob6_1', ch: 6, ord: 1, title: 'Le portier répète', job: 'Chapitre 6 · Boucles', stars: 2, scene: 'terminal',
      story: 'À l’entrée du campus, le portier appelle les visiteurs un par un. Il répète la même consigne.',
      goal: 'Avec <code>PERFORM … TIMES</code>, affiche <b>3 fois</b> :<pre>SUIVANT\nSUIVANT\nSUIVANT</pre>',
      lesson: '<p><code>PERFORM n TIMES … END-PERFORM</code> répète un bloc d’instructions n fois.</p>' +
        '<pre>PERFORM 3 TIMES\n    DISPLAY "SUIVANT"\nEND-PERFORM.</pre>',
      starter: H('PORTIER') + '       PROCEDURE DIVISION.\n           PERFORM 1 TIMES\n               DISPLAY "SUIVANT"\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['Le nombre devant TIMES est le nombre de tours.', 'PERFORM 3 TIMES … END-PERFORM.'],
      solution: H('PORTIER') + '       PROCEDURE DIVISION.\n           PERFORM 3 TIMES\n               DISPLAY "SUIVANT"\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: 'SUIVANT\nSUIVANT\nSUIVANT\n' }],
      rules: { mustSrc: [{ re: 'PERFORM', msg: 'Répète avec PERFORM … TIMES.' }] }
    },
    {
      id: 'cob6_2', ch: 6, ord: 2, title: 'Les tickets numérotés', job: 'Chapitre 6 · Boucles', stars: 2, scene: 'terminal',
      story: 'Le distributeur imprime les tickets dans l’ordre, de 1 à 5.',
      goal: 'Avec <code>PERFORM VARYING</code>, affiche un numéro par ligne :<pre>1\n2\n3\n4\n5</pre>',
      lesson: '<p><code>PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5</code> fait tourner <code>I</code> de 1 à 5. À chaque tour, <code>I</code> vaut le numéro courant.</p>',
      starter: H('TICKETS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I PIC 9.\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 3\n               DISPLAY I\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['La boucle s’arrête quand I dépasse 5.', 'UNTIL I > 5.'],
      solution: H('TICKETS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I PIC 9.\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               DISPLAY I\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: '1\n2\n3\n4\n5\n' }],
      rules: { mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM VARYING.' }] }
    },
    {
      id: 'cob6_3', ch: 6, ord: 3, title: 'La fournée du boulanger', job: 'Chapitre 6 · Boucles', stars: 3, scene: 'terminal',
      story: 'Le boulanger enfourne 6 fournées de 12 pains chacune. Combien de pains au total ?',
      goal: 'Dans une boucle de 6 tours, ajoute 12 à <code>TOTAL</code> (PIC 9(3)). Affiche :<pre>072</pre>',
      lesson: '<p>On accumule dans une variable : <code>ADD 12 TO TOTAL</code> à chaque tour de boucle.</p>',
      starter: H('FOURNEE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 TOTAL PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM 6 TIMES\n               ADD 10 TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      hints: ['Chaque fournée fait 12 pains, pas 10.', 'ADD 12 TO TOTAL.'],
      solution: H('FOURNEE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 TOTAL PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM 6 TIMES\n               ADD 12 TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      tests: [{ expect: '072\n' }],
      rules: { mustSrc: [{ re: 'PERFORM', msg: 'Répète l’addition avec PERFORM.' }] }
    },
    {
      id: 'cob6_4', ch: 6, ord: 4, title: 'Les intérêts composés', job: 'Chapitre 6 · Boucles', stars: 3, scene: 'terminal',
      story: 'Un placement de 1 double chaque année. En combien d’années dépasse-t-il 1000 ?',
      goal: 'Tant que <code>MONTANT &lt; 1000</code>, double-le et compte une année dans <code>ANNEES</code>. Affiche :<pre>10</pre>',
      lesson: '<p><code>PERFORM UNTIL condition … END-PERFORM</code> répète <b>tant que</b> la condition est fausse, et s’arrête dès qu’elle devient vraie.</p>',
      starter: H('INTERETS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5) VALUE 1.\n       01 ANNEES  PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM UNTIL MONTANT >= 2000\n               COMPUTE MONTANT = MONTANT * 2\n               ADD 1 TO ANNEES\n           END-PERFORM.\n           DISPLAY ANNEES.\n           STOP RUN.\n',
      hints: ['La cible à dépasser est 1000, pas 2000.', 'PERFORM UNTIL MONTANT >= 1000.'],
      solution: H('INTERETS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5) VALUE 1.\n       01 ANNEES  PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM UNTIL MONTANT >= 1000\n               COMPUTE MONTANT = MONTANT * 2\n               ADD 1 TO ANNEES\n           END-PERFORM.\n           DISPLAY ANNEES.\n           STOP RUN.\n',
      tests: [{ expect: '10\n' }],
      rules: { mustSrc: [{ re: 'UNTIL', msg: 'Utilise PERFORM UNTIL.' }] }
    },
    {
      id: 'cob6_5', ch: 6, ord: 5, title: 'La table de 7', job: 'Chapitre 6 · Boucles', stars: 3, scene: 'terminal',
      story: 'Le professeur de l’école affiche la table de multiplication de 7.',
      goal: 'Pour I de 1 à 9, calcule <code>7 * I</code> dans <code>RES</code> (PIC 9(2)) et affiche-le. Attendu :<pre>07\n14\n21\n28\n35\n42\n49\n56\n63</pre>',
      lesson: '<p>Dans la boucle, <code>I</code> sert au calcul : <code>COMPUTE RES = 7 * I</code>. Attention, un compteur qui doit atteindre 9 tient dans <code>PIC 9(2)</code>.</p>',
      starter: H('TABLE7') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I   PIC 9(2).\n       01 RES PIC 9(2).\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 9\n               COMPUTE RES = 6 * I\n               DISPLAY RES\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['C’est la table de 7, pas de 6.', 'COMPUTE RES = 7 * I.'],
      solution: H('TABLE7') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I   PIC 9(2).\n       01 RES PIC 9(2).\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 9\n               COMPUTE RES = 7 * I\n               DISPLAY RES\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: '07\n14\n21\n28\n35\n42\n49\n56\n63\n' }],
      rules: { mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM VARYING.' }] }
    },
    {
      id: 'cob6_6', ch: 6, ord: 6, title: 'La somme des carrés', job: 'Chapitre 6 · Boucles', stars: 4, scene: 'terminal',
      story: 'L’architecte empile des carrés : 1×1, puis 2×2, … jusqu’à N×N. Quelle surface totale ?',
      goal: 'Lis <code>N</code>, calcule <code>1² + 2² + … + N²</code> dans <code>TOTAL</code> (PIC 9(4)). Pour N=3 → <pre>0014</pre>',
      lesson: '<p>À chaque tour, on ajoute le carré de I : <code>COMPUTE TOTAL = TOTAL + I * I</code>.</p>',
      starter: H('CARRES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(2).\n       01 I     PIC 9(2).\n       01 TOTAL PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE TOTAL = TOTAL + I\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      stdin: '3\n',
      hints: ['Ce n’est pas I qu’on ajoute, mais I au carré.', 'COMPUTE TOTAL = TOTAL + I * I.'],
      solution: H('CARRES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(2).\n       01 I     PIC 9(2).\n       01 TOTAL PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE TOTAL = TOTAL + I * I\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      tests: [{ stdin: '3\n', expect: '0014\n' }, { stdin: '4\n', expect: '0030\n' }, { stdin: '1\n', expect: '0001\n' }, { stdin: '5\n', expect: '0055\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM VARYING.' }] }
    },
    {
      id: 'cob6_7', ch: 6, ord: 7, title: 'La factorielle', job: 'Chapitre 6 · Boucles', stars: 4, scene: 'terminal',
      story: 'Combien de façons d’aligner N livres sur une étagère ? C’est N ! = 1 × 2 × … × N.',
      goal: 'Lis <code>N</code>, calcule la factorielle dans <code>FACT</code> (PIC 9(6), valeur initiale 1). Pour N=5 → <pre>000120</pre>',
      lesson: '<p>On part de 1 et on <b>multiplie</b> par I à chaque tour : <code>COMPUTE FACT = FACT * I</code>. (Additionner donnerait la somme, pas le produit.)</p>',
      starter: H('FACTO') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N    PIC 9(2).\n       01 I    PIC 9(2).\n       01 FACT PIC 9(6) VALUE 1.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE FACT = FACT + I\n           END-PERFORM.\n           DISPLAY FACT.\n           STOP RUN.\n',
      stdin: '5\n',
      hints: ['La factorielle multiplie, elle n’additionne pas.', 'COMPUTE FACT = FACT * I.'],
      solution: H('FACTO') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N    PIC 9(2).\n       01 I    PIC 9(2).\n       01 FACT PIC 9(6) VALUE 1.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE FACT = FACT * I\n           END-PERFORM.\n           DISPLAY FACT.\n           STOP RUN.\n',
      tests: [{ stdin: '5\n', expect: '000120\n' }, { stdin: '4\n', expect: '000024\n' }, { stdin: '1\n', expect: '000001\n' }, { stdin: '6\n', expect: '000720\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM VARYING.' }] }
    },
    {
      id: 'cob6_8', ch: 6, ord: 8, title: 'Les multiples de trois', job: 'Chapitre 6 · Boucles', stars: 4, scene: 'terminal',
      story: 'Au jeu du campus, on compte les points sur les cases multiples de 3 jusqu’à la case N.',
      goal: 'Lis <code>N</code>, additionne 3, 6, 9, … jusqu’à N dans <code>TOTAL</code> (PIC 9(4)). Utilise le pas <code>BY 3</code>. Pour N=10 → <pre>0018</pre>',
      lesson: '<p>Le pas d’une boucle peut valoir plus que 1 : <code>FROM 3 BY 3</code> donne 3, 6, 9, …</p>',
      starter: H('MULT3') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(3).\n       01 I     PIC 9(3).\n       01 TOTAL PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 3 BY 1 UNTIL I > N\n               ADD I TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      stdin: '10\n',
      hints: ['Pour n’avoir que les multiples de 3, avance de 3 en 3.', 'FROM 3 BY 3.'],
      solution: H('MULT3') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(3).\n       01 I     PIC 9(3).\n       01 TOTAL PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 3 BY 3 UNTIL I > N\n               ADD I TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      tests: [{ stdin: '10\n', expect: '0018\n' }, { stdin: '9\n', expect: '0018\n' }, { stdin: '3\n', expect: '0003\n' }, { stdin: '15\n', expect: '0045\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'BY\\s+3', msg: 'Avance de 3 en 3 (BY 3).' }] }
    },
    {
      id: 'cob6_9', ch: 6, ord: 9, title: 'La suite de Fibonacci', job: 'Chapitre 6 · Boucles', stars: 4, scene: 'terminal',
      story: 'Les lapins de la ferme se reproduisent selon Fibonacci : chaque terme est la somme des deux précédents (1, 1, 2, 3, 5, 8…).',
      goal: 'Lis <code>N</code> et affiche le N-ième terme dans <code>A</code> (PIC 9(6)). Pour N=10 → <pre>000055</pre>',
      lesson: '<p>On garde deux valeurs <code>A</code> et <code>B</code>. À chaque tour : <code>T = A + B</code>, puis <code>A</code> prend <code>B</code> et <code>B</code> prend <code>T</code>. Après N tours, <code>A</code> contient le terme cherché.</p>',
      starter: H('FIBO') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N PIC 9(2).\n       01 I PIC 9(2).\n       01 A PIC 9(6) VALUE 0.\n       01 B PIC 9(6) VALUE 1.\n       01 T PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE T = A + B\n               MOVE T TO B\n           END-PERFORM.\n           DISPLAY A.\n           STOP RUN.\n',
      stdin: '10\n',
      hints: ['Il manque le décalage : A doit recevoir l’ancien B.', 'MOVE B TO A avant MOVE T TO B.'],
      solution: H('FIBO') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N PIC 9(2).\n       01 I PIC 9(2).\n       01 A PIC 9(6) VALUE 0.\n       01 B PIC 9(6) VALUE 1.\n       01 T PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               COMPUTE T = A + B\n               MOVE B TO A\n               MOVE T TO B\n           END-PERFORM.\n           DISPLAY A.\n           STOP RUN.\n',
      tests: [{ stdin: '10\n', expect: '000055\n' }, { stdin: '7\n', expect: '000013\n' }, { stdin: '1\n', expect: '000001\n' }, { stdin: '12\n', expect: '000144\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM VARYING.' }] }
    },

    /* ===================== Chapitre 7 — Paragraphes ===================== */
    {
      id: 'cob7_1', ch: 7, ord: 1, title: 'La routine d’accueil', job: 'Chapitre 7 · Paragraphes', stars: 2, scene: 'terminal',
      story: 'Le robot d’accueil range sa phrase de bienvenue dans un paragraphe nommé, et l’appelle quand il faut.',
      goal: 'Appelle le paragraphe <code>SALUER</code> avec <code>PERFORM</code> pour afficher :<pre>BONJOUR 42</pre>',
      lesson: '<p>Un <b>paragraphe</b> est une étiquette (un nom suivi d’un point) puis des instructions. <code>PERFORM SALUER</code> exécute ce paragraphe puis revient.</p>' +
        '<pre>PERFORM SALUER.\n...\nSALUER.\n    DISPLAY "BONJOUR 42".</pre>',
      starter: H('ACCUEIL') + '       PROCEDURE DIVISION.\n           STOP RUN.\n       SALUER.\n           DISPLAY "BONJOUR 42".\n',
      hints: ['Le paragraphe SALUER existe déjà, il faut l’appeler.', 'Ajoute PERFORM SALUER avant STOP RUN.'],
      solution: H('ACCUEIL') + '       PROCEDURE DIVISION.\n           PERFORM SALUER.\n           STOP RUN.\n       SALUER.\n           DISPLAY "BONJOUR 42".\n',
      tests: [{ expect: 'BONJOUR 42\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+SALUER', msg: 'Appelle le paragraphe SALUER avec PERFORM.' }] }
    },
    {
      id: 'cob7_2', ch: 7, ord: 2, title: 'L’en-tête et le pied', job: 'Chapitre 7 · Paragraphes', stars: 2, scene: 'terminal',
      story: 'Chaque ticket de caisse a un en-tête et un pied. Deux paragraphes, appelés dans l’ordre.',
      goal: 'Appelle <code>ENTETE</code> puis <code>PIED</code> pour obtenir :<pre>--- TICKET ---\n--- FIN ---</pre>',
      lesson: '<p>On découpe le programme en morceaux clairs. La PROCEDURE DIVISION appelle les paragraphes dans l’ordre voulu.</p>',
      starter: H('RECU') + '       PROCEDURE DIVISION.\n           PERFORM ENTETE.\n           STOP RUN.\n       ENTETE.\n           DISPLAY "--- TICKET ---".\n       PIED.\n           DISPLAY "--- FIN ---".\n',
      hints: ['Le pied n’est jamais appelé.', 'Ajoute PERFORM PIED après PERFORM ENTETE.'],
      solution: H('RECU') + '       PROCEDURE DIVISION.\n           PERFORM ENTETE.\n           PERFORM PIED.\n           STOP RUN.\n       ENTETE.\n           DISPLAY "--- TICKET ---".\n       PIED.\n           DISPLAY "--- FIN ---".\n',
      tests: [{ expect: '--- TICKET ---\n--- FIN ---\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+PIED', msg: 'Appelle aussi le paragraphe PIED.' }] }
    },
    {
      id: 'cob7_3', ch: 7, ord: 3, title: 'Le compteur de passages', job: 'Chapitre 7 · Paragraphes', stars: 3, scene: 'terminal',
      story: 'Le tourniquet appelle le même paragraphe à chaque passage pour incrémenter son compteur.',
      goal: 'Appelle le paragraphe <code>COMPTER</code> <b>5 fois</b> ; il ajoute 1 à <code>CPT</code> (PIC 9(2)). Affiche :<pre>05</pre>',
      lesson: '<p>On peut répéter l’appel d’un paragraphe : <code>PERFORM COMPTER 5 TIMES</code>.</p>',
      starter: H('TOURNIQUET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM COMPTER 3 TIMES.\n           DISPLAY CPT.\n           STOP RUN.\n       COMPTER.\n           ADD 1 TO CPT.\n',
      hints: ['Il y a eu 5 passages, pas 3.', 'PERFORM COMPTER 5 TIMES.'],
      solution: H('TOURNIQUET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM COMPTER 5 TIMES.\n           DISPLAY CPT.\n           STOP RUN.\n       COMPTER.\n           ADD 1 TO CPT.\n',
      tests: [{ expect: '05\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+COMPTER', msg: 'Appelle le paragraphe COMPTER.' }] }
    },
    {
      id: 'cob7_4', ch: 7, ord: 4, title: 'Lire, calculer, afficher', job: 'Chapitre 7 · Paragraphes', stars: 3, scene: 'terminal',
      story: 'Le bon programme se lit comme une recette : un paragraphe pour lire, un pour calculer, un pour afficher.',
      goal: 'Trois paragraphes : <code>LIRE</code> (ACCEPT A puis B), <code>CALCULER</code> (<code>S = A + B</code>), <code>AFFICHER</code> (DISPLAY S, PIC 9(4)). Pour 12 et 30 → <pre>0042</pre>',
      lesson: '<p>La PROCEDURE DIVISION devient une liste d’appels lisible :</p><pre>PERFORM LIRE.\nPERFORM CALCULER.\nPERFORM AFFICHER.</pre>',
      starter: H('ETAPES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 A PIC 9(3).\n       01 B PIC 9(3).\n       01 S PIC 9(4).\n       PROCEDURE DIVISION.\n           PERFORM LIRE.\n           PERFORM CALCULER.\n           PERFORM AFFICHER.\n           STOP RUN.\n       LIRE.\n           ACCEPT A.\n           ACCEPT B.\n       CALCULER.\n           COMPUTE S = A - B.\n       AFFICHER.\n           DISPLAY S.\n',
      stdin: '12\n30\n',
      hints: ['CALCULER doit additionner, pas soustraire.', 'COMPUTE S = A + B.'],
      solution: H('ETAPES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 A PIC 9(3).\n       01 B PIC 9(3).\n       01 S PIC 9(4).\n       PROCEDURE DIVISION.\n           PERFORM LIRE.\n           PERFORM CALCULER.\n           PERFORM AFFICHER.\n           STOP RUN.\n       LIRE.\n           ACCEPT A.\n           ACCEPT B.\n       CALCULER.\n           COMPUTE S = A + B.\n       AFFICHER.\n           DISPLAY S.\n',
      tests: [{ stdin: '12\n30\n', expect: '0042\n' }, { stdin: '5\n5\n', expect: '0010\n' }, { stdin: '100\n200\n', expect: '0300\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'PERFORM\\s+CALCULER', msg: 'Appelle le paragraphe CALCULER.' }] }
    },
    {
      id: 'cob7_5', ch: 7, ord: 5, title: 'L’ascenseur qui descend', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'L’ascenseur part du 3e étage et descend étage par étage jusqu’au rez-de-chaussée.',
      goal: 'Appelle le paragraphe <code>ETAGE</code> tant que <code>NIV &gt; 0</code> ; il affiche le niveau puis descend d’un cran. Ensuite affiche <code>REZ</code>. Attendu :<pre>3\n2\n1\nREZ</pre>',
      lesson: '<p>On peut répéter un paragraphe avec une condition : <code>PERFORM ETAGE UNTIL NIV = 0</code>. Le paragraphe doit faire évoluer la condition (ici, décrémenter).</p>',
      starter: H('ASCENSEUR') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NIV PIC 9 VALUE 3.\n       PROCEDURE DIVISION.\n           PERFORM ETAGE UNTIL NIV = 1.\n           DISPLAY "REZ".\n           STOP RUN.\n       ETAGE.\n           DISPLAY NIV.\n           SUBTRACT 1 FROM NIV.\n',
      hints: ['La boucle s’arrête trop tôt : il faut descendre jusqu’à 0.', 'PERFORM ETAGE UNTIL NIV = 0.'],
      solution: H('ASCENSEUR') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NIV PIC 9 VALUE 3.\n       PROCEDURE DIVISION.\n           PERFORM ETAGE UNTIL NIV = 0.\n           DISPLAY "REZ".\n           STOP RUN.\n       ETAGE.\n           DISPLAY NIV.\n           SUBTRACT 1 FROM NIV.\n',
      tests: [{ expect: '3\n2\n1\nREZ\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+ETAGE\\s+UNTIL', msg: 'Répète le paragraphe ETAGE avec UNTIL.' }] }
    },
    {
      id: 'cob7_6', ch: 7, ord: 6, title: 'Le paragraphe variant', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'Le graveur affiche le carré de chaque numéro de plaque, de 1 à 4.',
      goal: 'Appelle le paragraphe <code>CARRE</code> avec <code>VARYING I FROM 1 BY 1 UNTIL I &gt; 4</code> ; il affiche <code>I * I</code> (PIC 9(4)). Attendu :<pre>0001\n0004\n0009\n0016</pre>',
      lesson: '<p><code>PERFORM NOM VARYING I FROM 1 BY 1 UNTIL …</code> répète un paragraphe en faisant varier un compteur, sans <code>END-PERFORM</code>.</p>',
      starter: H('GRAVEUR') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I     PIC 9(2).\n       01 CARRE PIC 9(4).\n       PROCEDURE DIVISION.\n           PERFORM CARRE VARYING I FROM 1 BY 1 UNTIL I > 3.\n           STOP RUN.\n       CARRE.\n           COMPUTE CARRE = I * I.\n           DISPLAY CARRE.\n',
      hints: ['Il faut aller jusqu’à 4, pas 3.', 'UNTIL I > 4.'],
      solution: H('GRAVEUR') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 I     PIC 9(2).\n       01 CARRE PIC 9(4).\n       PROCEDURE DIVISION.\n           PERFORM CARRE VARYING I FROM 1 BY 1 UNTIL I > 4.\n           STOP RUN.\n       CARRE.\n           COMPUTE CARRE = I * I.\n           DISPLAY CARRE.\n',
      tests: [{ expect: '0001\n0004\n0009\n0016\n' }],
      rules: { mustSrc: [{ re: 'VARYING', msg: 'Utilise PERFORM … VARYING.' }] }
    },
    {
      id: 'cob7_7', ch: 7, ord: 7, title: 'Les paragraphes enchaînés', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'À l’usine, poser le châssis appelle la pose des roues : un paragraphe peut en appeler un autre.',
      goal: 'Dans <code>MONTER</code>, ajoute 10 à <code>X</code> puis <code>PERFORM ROUES</code> (qui ajoute 5). Appelle <code>MONTER</code> une fois. Affiche <code>X</code> (PIC 9(3)) :<pre>015</pre>',
      lesson: '<p>Un paragraphe peut en appeler un autre avec <code>PERFORM</code>. On compose ainsi des traitements.</p>',
      starter: H('USINE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 X PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM MONTER.\n           DISPLAY X.\n           STOP RUN.\n       MONTER.\n           ADD 10 TO X.\n       ROUES.\n           ADD 5 TO X.\n',
      hints: ['MONTER doit appeler ROUES lui-même.', 'Ajoute PERFORM ROUES à la fin de MONTER.'],
      solution: H('USINE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 X PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM MONTER.\n           DISPLAY X.\n           STOP RUN.\n       MONTER.\n           ADD 10 TO X.\n           PERFORM ROUES.\n       ROUES.\n           ADD 5 TO X.\n',
      tests: [{ expect: '015\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+ROUES', msg: 'MONTER doit appeler ROUES.' }] }
    },
    {
      id: 'cob7_8', ch: 7, ord: 8, title: 'Le menu du distributeur', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'Le distributeur de boissons lit un choix et appelle le bon paragraphe de préparation.',
      goal: 'Lis <code>CHOIX</code>. Avec <code>EVALUATE</code>, appelle <code>CAFE</code> (1), <code>THE</code> (2), sinon <code>RIEN</code>. Chaque paragraphe affiche son nom. Pour 1 → <pre>CAFE</pre>',
      lesson: '<p>On combine décision et paragraphes : chaque branche <code>WHEN</code> appelle le paragraphe approprié.</p>',
      starter: H('BOISSON') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CHOIX PIC 9.\n       PROCEDURE DIVISION.\n           ACCEPT CHOIX.\n           EVALUATE CHOIX\n               WHEN 1\n                   PERFORM THE\n               WHEN 2\n                   PERFORM CAFE\n               WHEN OTHER\n                   PERFORM RIEN\n           END-EVALUATE.\n           STOP RUN.\n       CAFE.\n           DISPLAY "CAFE".\n       THE.\n           DISPLAY "THE".\n       RIEN.\n           DISPLAY "RIEN".\n',
      stdin: '1\n',
      hints: ['Les deux premiers WHEN sont inversés.', 'WHEN 1 → PERFORM CAFE, WHEN 2 → PERFORM THE.'],
      solution: H('BOISSON') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CHOIX PIC 9.\n       PROCEDURE DIVISION.\n           ACCEPT CHOIX.\n           EVALUATE CHOIX\n               WHEN 1\n                   PERFORM CAFE\n               WHEN 2\n                   PERFORM THE\n               WHEN OTHER\n                   PERFORM RIEN\n           END-EVALUATE.\n           STOP RUN.\n       CAFE.\n           DISPLAY "CAFE".\n       THE.\n           DISPLAY "THE".\n       RIEN.\n           DISPLAY "RIEN".\n',
      tests: [{ stdin: '1\n', expect: 'CAFE\n' }, { stdin: '2\n', expect: 'THE\n' }, { stdin: '9\n', expect: 'RIEN\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'EVALUATE', msg: 'Choisis avec EVALUATE.' }] }
    },
    {
      id: 'cob7_9', ch: 7, ord: 9, title: 'Le reçu bien rangé', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'La caisse du campus produit un reçu : lire le prix et la quantité, calculer, puis éditer le montant.',
      goal: 'Paragraphes <code>LIRE</code> (ACCEPT PRIX puis QTE), <code>CALCULER</code> (<code>TOTAL = PRIX * QTE</code>), <code>EDITER</code> (MOVE vers <code>$ZZ,ZZ9.99</code> et DISPLAY). Pour 19.99 et 3 → <pre>$    59.97</pre>',
      lesson: '<p>Un vrai programme sépare les étapes en paragraphes. Le montant final passe dans un champ <b>édité</b> pour être lisible.</p>',
      starter: H('CAISSE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX  PIC 9(4)V99.\n       01 QTE   PIC 9(2).\n       01 TOTAL PIC 9(6)V99.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           PERFORM LIRE.\n           PERFORM CALCULER.\n           PERFORM EDITER.\n           STOP RUN.\n       LIRE.\n           ACCEPT PRIX.\n           ACCEPT QTE.\n       CALCULER.\n           COMPUTE TOTAL = PRIX + QTE.\n       EDITER.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n',
      stdin: '19.99\n3\n',
      hints: ['Un total, c’est prix fois quantité.', 'COMPUTE TOTAL = PRIX * QTE.'],
      solution: H('CAISSE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX  PIC 9(4)V99.\n       01 QTE   PIC 9(2).\n       01 TOTAL PIC 9(6)V99.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           PERFORM LIRE.\n           PERFORM CALCULER.\n           PERFORM EDITER.\n           STOP RUN.\n       LIRE.\n           ACCEPT PRIX.\n           ACCEPT QTE.\n       CALCULER.\n           COMPUTE TOTAL = PRIX * QTE.\n       EDITER.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n',
      tests: [{ stdin: '19.99\n3\n', expect: '$    59.97\n' }, { stdin: '10.00\n5\n', expect: '$    50.00\n' }, { stdin: '2.50\n2\n', expect: '$     5.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'PERFORM\\s+CALCULER', msg: 'Appelle le paragraphe CALCULER.' }] }
    },

    /* ===================== Chapitre 8 — Tableaux ===================== */
    {
      id: 'cob8_1', ch: 8, ord: 1, title: 'Les casiers numérotés', job: 'Chapitre 8 · Tableaux', stars: 2, scene: 'terminal',
      story: 'Au vestiaire, chaque casier a un numéro. On range quatre notes et on relit l’une d’elles.',
      goal: 'Déclare <code>NOTE</code> (PIC 9(2), OCCURS 4), range 12, 15, 9, 18 puis affiche la <b>4e</b> case :<pre>18</pre>',
      lesson: '<p>Un tableau se déclare avec <code>OCCURS</code> :</p><pre>01 NOTE PIC 9(2) OCCURS 4 TIMES.</pre>' +
        '<p>On accède à une case par son indice, à partir de 1 : <code>NOTE(4)</code>.</p>',
      starter: H('CASIERS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 4 TIMES.\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 15 TO NOTE(2).\n           MOVE 9 TO NOTE(3).\n           MOVE 18 TO NOTE(4).\n           DISPLAY NOTE(1).\n           STOP RUN.\n',
      hints: ['On veut la 4e case, pas la première.', 'DISPLAY NOTE(4).'],
      solution: H('CASIERS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 4 TIMES.\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 15 TO NOTE(2).\n           MOVE 9 TO NOTE(3).\n           MOVE 18 TO NOTE(4).\n           DISPLAY NOTE(4).\n           STOP RUN.\n',
      tests: [{ expect: '18\n' }],
      rules: { mustSrc: [{ re: 'OCCURS', msg: 'Déclare un tableau avec OCCURS.' }] }
    },
    {
      id: 'cob8_2', ch: 8, ord: 2, title: 'Faire l’appel', job: 'Chapitre 8 · Tableaux', stars: 2, scene: 'terminal',
      story: 'Le surveillant lit toutes les notes à voix haute, dans l’ordre des casiers.',
      goal: 'Parcours le tableau avec une boucle et affiche chaque case (indice <code>NOTE(I)</code>) :<pre>12\n15\n09\n18</pre>',
      lesson: '<p>On parcourt un tableau avec <code>PERFORM VARYING I</code> et l’indice variable <code>NOTE(I)</code>.</p>',
      starter: H('APPEL') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 4 TIMES.\n       01 I    PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 15 TO NOTE(2).\n           MOVE 9 TO NOTE(3).\n           MOVE 18 TO NOTE(4).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 4\n               DISPLAY NOTE(1)\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['Affiche la case I, pas toujours la première.', 'DISPLAY NOTE(I).'],
      solution: H('APPEL') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 4 TIMES.\n       01 I    PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 15 TO NOTE(2).\n           MOVE 9 TO NOTE(3).\n           MOVE 18 TO NOTE(4).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 4\n               DISPLAY NOTE(I)\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: '12\n15\n09\n18\n' }],
      rules: { mustSrc: [{ re: 'NOTE\\s*\\(\\s*I\\s*\\)', msg: 'Affiche NOTE(I) dans la boucle.' }] }
    },
    {
      id: 'cob8_3', ch: 8, ord: 3, title: 'La meilleure vente', job: 'Chapitre 8 · Tableaux', stars: 3, scene: 'terminal',
      story: 'Le gérant cherche la plus grosse vente de la journée parmi cinq chiffres.',
      goal: 'Parcours <code>VENTE</code> (OCCURS 5 : 12, 45, 7, 89, 23) et garde la plus grande dans <code>MAX</code> (PIC 9(3)). Affiche :<pre>089</pre>',
      lesson: '<p>Pour trouver le maximum : on part de 0, et pour chaque case, si elle est plus grande que le maximum courant, on la garde.</p>' +
        '<pre>IF VENTE(I) > MAX\n    MOVE VENTE(I) TO MAX\nEND-IF</pre>',
      starter: H('MEILLEURE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VENTE PIC 9(3) OCCURS 5 TIMES.\n       01 I     PIC 9(2).\n       01 MAX   PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 12 TO VENTE(1).\n           MOVE 45 TO VENTE(2).\n           MOVE 7 TO VENTE(3).\n           MOVE 89 TO VENTE(4).\n           MOVE 23 TO VENTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF VENTE(I) < MAX\n                   MOVE VENTE(I) TO MAX\n               END-IF\n           END-PERFORM.\n           DISPLAY MAX.\n           STOP RUN.\n',
      hints: ['On garde la plus GRANDE, donc la comparaison est à l’envers.', 'IF VENTE(I) > MAX.'],
      solution: H('MEILLEURE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VENTE PIC 9(3) OCCURS 5 TIMES.\n       01 I     PIC 9(2).\n       01 MAX   PIC 9(3) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 12 TO VENTE(1).\n           MOVE 45 TO VENTE(2).\n           MOVE 7 TO VENTE(3).\n           MOVE 89 TO VENTE(4).\n           MOVE 23 TO VENTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF VENTE(I) > MAX\n                   MOVE VENTE(I) TO MAX\n               END-IF\n           END-PERFORM.\n           DISPLAY MAX.\n           STOP RUN.\n',
      tests: [{ expect: '089\n' }],
      rules: { mustSrc: [{ re: 'OCCURS', msg: 'Utilise un tableau OCCURS.' }] }
    },
    {
      id: 'cob8_4', ch: 8, ord: 4, title: 'Les élèves admis', job: 'Chapitre 8 · Tableaux', stars: 3, scene: 'terminal',
      story: 'On compte combien d’élèves ont la moyenne (note ≥ 10) parmi cinq copies.',
      goal: 'Compte dans <code>CPT</code> (PIC 9(2)) les cases de <code>NOTE</code> (OCCURS 5 : 12, 8, 15, 10, 18) qui valent <b>au moins 10</b>. Affiche :<pre>04</pre>',
      lesson: '<p>On combine boucle, tableau et décision : à chaque case, un <code>IF</code> décide si on incrémente le compteur. « Au moins 10 » inclut le 10 : attention à l’opérateur.</p>',
      starter: H('ADMIS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 5 TIMES.\n       01 I    PIC 9(2).\n       01 CPT  PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 8 TO NOTE(2).\n           MOVE 15 TO NOTE(3).\n           MOVE 10 TO NOTE(4).\n           MOVE 18 TO NOTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF NOTE(I) > 10\n                   ADD 1 TO CPT\n               END-IF\n           END-PERFORM.\n           DISPLAY CPT.\n           STOP RUN.\n',
      hints: ['« Au moins 10 » inclut 10 : utilise >=, pas >.', 'IF NOTE(I) >= 10.'],
      solution: H('ADMIS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(2) OCCURS 5 TIMES.\n       01 I    PIC 9(2).\n       01 CPT  PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 12 TO NOTE(1).\n           MOVE 8 TO NOTE(2).\n           MOVE 15 TO NOTE(3).\n           MOVE 10 TO NOTE(4).\n           MOVE 18 TO NOTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF NOTE(I) >= 10\n                   ADD 1 TO CPT\n               END-IF\n           END-PERFORM.\n           DISPLAY CPT.\n           STOP RUN.\n',
      tests: [{ expect: '04\n' }],
      rules: { mustSrc: [{ re: 'OCCURS', msg: 'Utilise un tableau OCCURS.' }] }
    },
    {
      id: 'cob8_5', ch: 8, ord: 5, title: 'La saisie du jour', job: 'Chapitre 8 · Tableaux', stars: 3, scene: 'terminal',
      story: 'Le caissier saisit les trois montants de la caisse, puis en fait le total.',
      goal: 'Lis 3 valeurs dans <code>T</code> (OCCURS 3) avec une boucle d’<code>ACCEPT</code>, puis additionne-les dans <code>TOT</code> (PIC 9(4)). Pour 100, 250, 50 → <pre>0400</pre>',
      lesson: '<p>On remplit un tableau au clavier : dans une boucle, <code>ACCEPT T(I)</code> range la valeur lue dans la case I.</p>',
      starter: H('SAISIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T   PIC 9(3) OCCURS 3 TIMES.\n       01 I   PIC 9(2).\n       01 TOT PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 3\n               ACCEPT T(I)\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 3\n               ADD T(1) TO TOT\n           END-PERFORM.\n           DISPLAY TOT.\n           STOP RUN.\n',
      stdin: '100\n250\n50\n',
      hints: ['Dans le total, additionne la case I, pas toujours la première.', 'ADD T(I) TO TOT.'],
      solution: H('SAISIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T   PIC 9(3) OCCURS 3 TIMES.\n       01 I   PIC 9(2).\n       01 TOT PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 3\n               ACCEPT T(I)\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 3\n               ADD T(I) TO TOT\n           END-PERFORM.\n           DISPLAY TOT.\n           STOP RUN.\n',
      tests: [{ stdin: '100\n250\n50\n', expect: '0400\n' }, { stdin: '10\n20\n30\n', expect: '0060\n' }, { stdin: '5\n5\n5\n', expect: '0015\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'OCCURS', msg: 'Utilise un tableau OCCURS.' }] }
    },
    {
      id: 'cob8_6', ch: 8, ord: 6, title: 'La moyenne de la classe', job: 'Chapitre 8 · Tableaux', stars: 4, scene: 'terminal',
      story: 'Le professeur calcule la moyenne entière des quatre notes du tableau.',
      goal: 'Additionne <code>T</code> (OCCURS 4 : 10, 20, 30, 40) dans <code>TOT</code>, puis <code>MOYENNE = TOT / 4</code> (PIC 9(3)). Affiche :<pre>025</pre>',
      lesson: '<p>La moyenne, c’est la somme divisée par le nombre de cases : <code>COMPUTE MOYENNE = TOT / 4</code>.</p>',
      starter: H('MOYENNE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T       PIC 9(3) OCCURS 4 TIMES.\n       01 I       PIC 9(2).\n       01 TOT     PIC 9(5) VALUE 0.\n       01 MOYENNE PIC 9(3).\n       PROCEDURE DIVISION.\n           MOVE 10 TO T(1).\n           MOVE 20 TO T(2).\n           MOVE 30 TO T(3).\n           MOVE 40 TO T(4).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 4\n               ADD T(I) TO TOT\n           END-PERFORM.\n           COMPUTE MOYENNE = TOT / 2.\n           DISPLAY MOYENNE.\n           STOP RUN.\n',
      hints: ['Il y a 4 notes, donc on divise par 4.', 'COMPUTE MOYENNE = TOT / 4.'],
      solution: H('MOYENNE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T       PIC 9(3) OCCURS 4 TIMES.\n       01 I       PIC 9(2).\n       01 TOT     PIC 9(5) VALUE 0.\n       01 MOYENNE PIC 9(3).\n       PROCEDURE DIVISION.\n           MOVE 10 TO T(1).\n           MOVE 20 TO T(2).\n           MOVE 30 TO T(3).\n           MOVE 40 TO T(4).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 4\n               ADD T(I) TO TOT\n           END-PERFORM.\n           COMPUTE MOYENNE = TOT / 4.\n           DISPLAY MOYENNE.\n           STOP RUN.\n',
      tests: [{ expect: '025\n' }],
      rules: { mustSrc: [{ re: 'OCCURS', msg: 'Utilise un tableau OCCURS.' }] }
    },
    {
      id: 'cob8_7', ch: 8, ord: 7, title: 'Chercher le produit', job: 'Chapitre 8 · Tableaux', stars: 4, scene: 'terminal',
      story: 'Le magasinier cherche à quelle position se trouve un article dans le rayon.',
      goal: 'Range des codes dans <code>REF</code> (OCCURS 5 : 11, 22, 33, 44, 55). Lis un code et affiche sa <b>position</b> dans <code>POS</code> (PIC 9). Pour le code 44 → <pre>4</pre>',
      lesson: '<p>Recherche linéaire : on parcourt le tableau, et dès qu’une case vaut la valeur cherchée, on garde son indice.</p>',
      starter: H('RECHERCHE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REF PIC 9(2) OCCURS 5 TIMES.\n       01 I   PIC 9(2).\n       01 CIBLE PIC 9(2).\n       01 POS PIC 9 VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 11 TO REF(1).\n           MOVE 22 TO REF(2).\n           MOVE 33 TO REF(3).\n           MOVE 44 TO REF(4).\n           MOVE 55 TO REF(5).\n           ACCEPT CIBLE.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF REF(I) = CIBLE\n                   MOVE 0 TO POS\n               END-IF\n           END-PERFORM.\n           DISPLAY POS.\n           STOP RUN.\n',
      stdin: '44\n',
      hints: ['Quand on trouve la valeur, on garde l’indice I, pas 0.', 'MOVE I TO POS.'],
      solution: H('RECHERCHE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REF PIC 9(2) OCCURS 5 TIMES.\n       01 I   PIC 9(2).\n       01 CIBLE PIC 9(2).\n       01 POS PIC 9 VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 11 TO REF(1).\n           MOVE 22 TO REF(2).\n           MOVE 33 TO REF(3).\n           MOVE 44 TO REF(4).\n           MOVE 55 TO REF(5).\n           ACCEPT CIBLE.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               IF REF(I) = CIBLE\n                   MOVE I TO POS\n               END-IF\n           END-PERFORM.\n           DISPLAY POS.\n           STOP RUN.\n',
      tests: [{ stdin: '44\n', expect: '4\n' }, { stdin: '11\n', expect: '1\n' }, { stdin: '55\n', expect: '5\n' }, { stdin: '99\n', expect: '0\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'OCCURS', msg: 'Utilise un tableau OCCURS.' }] }
    },
    {
      id: 'cob8_8', ch: 8, ord: 8, title: 'À l’envers', job: 'Chapitre 8 · Tableaux', stars: 4, scene: 'terminal',
      story: 'L’afficheur du podium montre les dossards du dernier au premier.',
      goal: 'Range <code>D</code> (OCCURS 5 : 10, 20, 30, 40, 50) puis affiche les cases <b>dans l’ordre inverse</b> en utilisant l’indice <code>D(6 - I)</code> :<pre>50\n40\n30\n20\n10</pre>',
      lesson: '<p>L’indice d’un tableau peut être une expression : <code>D(6 - I)</code> donne la case 5, 4, 3… quand I va de 1 à 5.</p>',
      starter: H('ENVERS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 D PIC 9(2) OCCURS 5 TIMES.\n       01 I PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 10 TO D(1).\n           MOVE 20 TO D(2).\n           MOVE 30 TO D(3).\n           MOVE 40 TO D(4).\n           MOVE 50 TO D(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               DISPLAY D(I)\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['Pour partir de la fin, affiche la case 6 - I.', 'DISPLAY D(6 - I).'],
      solution: H('ENVERS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 D PIC 9(2) OCCURS 5 TIMES.\n       01 I PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 10 TO D(1).\n           MOVE 20 TO D(2).\n           MOVE 30 TO D(3).\n           MOVE 40 TO D(4).\n           MOVE 50 TO D(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               DISPLAY D(6 - I)\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: '50\n40\n30\n20\n10\n' }],
      rules: { mustSrc: [{ re: '6\\s*-\\s*I', msg: 'Affiche la case 6 - I.' }] }
    },
    {
      id: 'cob8_9', ch: 8, ord: 9, title: 'Trier les scores', job: 'Chapitre 8 · Tableaux', stars: 4, scene: 'terminal',
      story: 'Le classement doit sortir dans l’ordre croissant. On trie le tableau par la méthode des bulles.',
      goal: 'Trie <code>T</code> (OCCURS 5 : 30, 10, 50, 20, 40) dans l’ordre croissant, puis affiche-le :<pre>10\n20\n30\n40\n50</pre>',
      lesson: '<p>Tri à bulles : on fait plusieurs passages ; à chaque fois qu’une case est plus grande que la suivante, on les <b>échange</b> via une variable temporaire.</p>' +
        '<pre>IF T(J) > T(J + 1)\n    MOVE T(J) TO TMP\n    MOVE T(J + 1) TO T(J)\n    MOVE TMP TO T(J + 1)\nEND-IF</pre>',
      starter: H('TRI') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T   PIC 9(2) OCCURS 5 TIMES.\n       01 I   PIC 9(2).\n       01 J   PIC 9(2).\n       01 TMP PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 30 TO T(1).\n           MOVE 10 TO T(2).\n           MOVE 50 TO T(3).\n           MOVE 20 TO T(4).\n           MOVE 40 TO T(5).\n           PERFORM 4 TIMES\n               PERFORM VARYING J FROM 1 BY 1 UNTIL J > 4\n                   IF T(J) > T(J + 1)\n                       CONTINUE\n                   END-IF\n               END-PERFORM\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               DISPLAY T(I)\n           END-PERFORM.\n           STOP RUN.\n',
      hints: ['Le CONTINUE ne fait rien : il faut échanger les deux cases.', 'Utilise TMP pour échanger T(J) et T(J + 1).'],
      solution: H('TRI') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 T   PIC 9(2) OCCURS 5 TIMES.\n       01 I   PIC 9(2).\n       01 J   PIC 9(2).\n       01 TMP PIC 9(2).\n       PROCEDURE DIVISION.\n           MOVE 30 TO T(1).\n           MOVE 10 TO T(2).\n           MOVE 50 TO T(3).\n           MOVE 20 TO T(4).\n           MOVE 40 TO T(5).\n           PERFORM 4 TIMES\n               PERFORM VARYING J FROM 1 BY 1 UNTIL J > 4\n                   IF T(J) > T(J + 1)\n                       MOVE T(J) TO TMP\n                       MOVE T(J + 1) TO T(J)\n                       MOVE TMP TO T(J + 1)\n                   END-IF\n               END-PERFORM\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               DISPLAY T(I)\n           END-PERFORM.\n           STOP RUN.\n',
      tests: [{ expect: '10\n20\n30\n40\n50\n' }],
      rules: { mustSrc: [{ re: 'TMP', msg: 'Échange les cases avec une variable temporaire.' }] }
    },

    /* ===================== Chapitre 9 — Texte ===================== */
    {
      id: 'cob9_1', ch: 9, ord: 1, title: 'Coller deux mots', job: 'Chapitre 9 · Texte', stars: 2, scene: 'terminal',
      story: 'Le nom de la station se compose de deux mots qu’il faut coller avec une espace.',
      goal: 'Avec <code>STRING</code>, assemble <code>P1</code> ("SAINT") et <code>P2</code> ("DENIS") avec une espace entre eux dans <code>LIGNE</code> (PIC X(20)). Attendu :<pre>SAINT DENIS</pre>(complété par des espaces jusqu’à 20 caractères)',
      lesson: '<p><code>STRING a " " b INTO dest</code> met bout à bout plusieurs morceaux. <code>DELIMITED BY SPACE</code> s’arrête aux espaces de remplissage d’un champ.</p>',
      starter: H('STATION') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 P1    PIC X(8) VALUE "SAINT".\n       01 P2    PIC X(8) VALUE "DENIS".\n       01 LIGNE PIC X(20).\n       PROCEDURE DIVISION.\n           STRING P1 DELIMITED BY SPACE P2 DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      hints: ['Il manque l’espace entre les deux mots.', 'STRING P1 DELIMITED BY SPACE " " P2 DELIMITED BY SPACE INTO LIGNE.'],
      solution: H('STATION') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 P1    PIC X(8) VALUE "SAINT".\n       01 P2    PIC X(8) VALUE "DENIS".\n       01 LIGNE PIC X(20).\n       PROCEDURE DIVISION.\n           STRING P1 DELIMITED BY SPACE " " P2 DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      tests: [{ expect: 'SAINT DENIS         \n' }],
      rules: { mustSrc: [{ re: 'STRING', msg: 'Assemble avec STRING.' }] }
    },
    {
      id: 'cob9_2', ch: 9, ord: 2, title: 'Le code postal', job: 'Chapitre 9 · Texte', stars: 2, scene: 'terminal',
      story: 'L’étiquette d’envoi colle le code postal et la ville, séparés par un trait.',
      goal: 'Assemble <code>CP</code> ("75001") et <code>VILLE</code> ("PARIS") avec un <code>"-"</code> au milieu dans <code>LIGNE</code> (PIC X(20)). Attendu :<pre>75001-PARIS</pre>',
      lesson: '<p>Le séparateur de <code>STRING</code> peut être n’importe quel littéral, comme <code>"-"</code>.</p>',
      starter: H('CODEP') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CP    PIC X(8) VALUE "75001".\n       01 VILLE PIC X(10) VALUE "PARIS".\n       01 LIGNE PIC X(20).\n       PROCEDURE DIVISION.\n           STRING CP DELIMITED BY SPACE " " VILLE DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      hints: ['Le séparateur doit être un trait d’union, pas une espace.', 'Remplace " " par "-".'],
      solution: H('CODEP') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CP    PIC X(8) VALUE "75001".\n       01 VILLE PIC X(10) VALUE "PARIS".\n       01 LIGNE PIC X(20).\n       PROCEDURE DIVISION.\n           STRING CP DELIMITED BY SPACE "-" VILLE DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      tests: [{ expect: '75001-PARIS         \n' }],
      rules: { mustSrc: [{ re: 'STRING', msg: 'Assemble avec STRING.' }] }
    },
    {
      id: 'cob9_3', ch: 9, ord: 3, title: 'Compter une lettre', job: 'Chapitre 9 · Texte', stars: 3, scene: 'terminal',
      story: 'Le jeu de lettres du campus demande combien de fois apparaît la lettre A dans un mot.',
      goal: 'Lis un mot dans <code>MOT</code> (PIC X(12)) et compte les <code>"A"</code> dans <code>CPT</code> (PIC 9(2)) avec <code>INSPECT … TALLYING</code>. Pour "BANANA" → <pre>03</pre>',
      lesson: '<p><code>INSPECT champ TALLYING cpt FOR ALL "A"</code> ajoute à <code>cpt</code> le nombre de « A » trouvés dans le champ.</p>',
      starter: H('COMPTEA') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT TALLYING CPT FOR ALL "B".\n           DISPLAY CPT.\n           STOP RUN.\n',
      stdin: 'BANANA\n',
      hints: ['On compte les A, pas les B.', 'INSPECT MOT TALLYING CPT FOR ALL "A".'],
      solution: H('COMPTEA') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT TALLYING CPT FOR ALL "A".\n           DISPLAY CPT.\n           STOP RUN.\n',
      tests: [{ stdin: 'BANANA\n', expect: '03\n' }, { stdin: 'ANANAS\n', expect: '03\n' }, { stdin: 'POMME\n', expect: '00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'TALLYING', msg: 'Compte avec INSPECT … TALLYING.' }] }
    },
    {
      id: 'cob9_4', ch: 9, ord: 4, title: 'Censurer un mot', job: 'Chapitre 9 · Texte', stars: 3, scene: 'terminal',
      story: 'Le filtre du forum remplace chaque voyelle A par une étoile.',
      goal: 'Lis <code>MOT</code> (PIC X(12)) et remplace tous les <code>"A"</code> par <code>"*"</code> avec <code>INSPECT … REPLACING</code>. Pour "BANANA" → <pre>B*N*N*</pre>(complété par des espaces)',
      lesson: '<p><code>INSPECT champ REPLACING ALL "A" BY "*"</code> remplace, dans le champ, chaque « A » par « * ».</p>',
      starter: H('CENSURE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT REPLACING ALL "A" BY "A".\n           DISPLAY MOT.\n           STOP RUN.\n',
      stdin: 'BANANA\n',
      hints: ['On remplace le A par une étoile, pas par un A.', 'INSPECT MOT REPLACING ALL "A" BY "*".'],
      solution: H('CENSURE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT REPLACING ALL "A" BY "*".\n           DISPLAY MOT.\n           STOP RUN.\n',
      tests: [{ stdin: 'BANANA\n', expect: 'B*N*N*      \n' }, { stdin: 'ANANAS\n', expect: '*N*N*S      \n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'REPLACING', msg: 'Remplace avec INSPECT … REPLACING.' }] }
    },
    {
      id: 'cob9_5', ch: 9, ord: 5, title: 'La référence produit', job: 'Chapitre 9 · Texte', stars: 3, scene: 'terminal',
      story: 'Chaque produit a une référence : un rayon, un trait, puis un nom de modèle.',
      goal: 'Assemble <code>RAYON</code> ("A12"), <code>"-"</code> et <code>MODELE</code> ("CHAISE") dans <code>REF</code> (PIC X(16)). Attendu :<pre>A12-CHAISE</pre>',
      lesson: '<p>On enchaîne plusieurs morceaux et littéraux dans un seul <code>STRING</code>. <code>DELIMITED BY SPACE</code> enlève le remplissage de chaque champ.</p>',
      starter: H('REFPROD') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 RAYON  PIC X(4) VALUE "A12".\n       01 MODELE PIC X(10) VALUE "CHAISE".\n       01 REF    PIC X(16).\n       PROCEDURE DIVISION.\n           STRING RAYON DELIMITED BY SPACE MODELE DELIMITED BY SPACE INTO REF.\n           DISPLAY REF.\n           STOP RUN.\n',
      hints: ['Il manque le trait d’union entre le rayon et le modèle.', 'STRING RAYON DELIMITED BY SPACE "-" MODELE DELIMITED BY SPACE INTO REF.'],
      solution: H('REFPROD') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 RAYON  PIC X(4) VALUE "A12".\n       01 MODELE PIC X(10) VALUE "CHAISE".\n       01 REF    PIC X(16).\n       PROCEDURE DIVISION.\n           STRING RAYON DELIMITED BY SPACE "-" MODELE DELIMITED BY SPACE INTO REF.\n           DISPLAY REF.\n           STOP RUN.\n',
      tests: [{ expect: 'A12-CHAISE      \n' }],
      rules: { mustSrc: [{ re: 'STRING', msg: 'Assemble avec STRING.' }] }
    },
    {
      id: 'cob9_6', ch: 9, ord: 6, title: 'Remplacer les tirets', job: 'Chapitre 9 · Texte', stars: 4, scene: 'terminal',
      story: 'Un numéro de série arrive avec des tirets ; la base veut des points à la place.',
      goal: 'Lis <code>SERIE</code> (PIC X(14)) et remplace tous les <code>"-"</code> par <code>"."</code> avec <code>INSPECT … REPLACING</code>. Pour "12-34-56" → <pre>12.34.56</pre>',
      lesson: '<p><code>REPLACING</code> fonctionne avec n’importe quel caractère, y compris la ponctuation.</p>',
      starter: H('SERIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SERIE PIC X(14).\n       PROCEDURE DIVISION.\n           ACCEPT SERIE.\n           INSPECT SERIE REPLACING ALL "-" BY "-".\n           DISPLAY SERIE.\n           STOP RUN.\n',
      stdin: '12-34-56\n',
      hints: ['On remplace le tiret par un point.', 'INSPECT SERIE REPLACING ALL "-" BY ".".'],
      solution: H('SERIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SERIE PIC X(14).\n       PROCEDURE DIVISION.\n           ACCEPT SERIE.\n           INSPECT SERIE REPLACING ALL "-" BY ".".\n           DISPLAY SERIE.\n           STOP RUN.\n',
      tests: [{ stdin: '12-34-56\n', expect: '12.34.56      \n' }, { stdin: 'A-B-C-D\n', expect: 'A.B.C.D       \n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'REPLACING', msg: 'Remplace avec INSPECT … REPLACING.' }] }
    },
    {
      id: 'cob9_7', ch: 9, ord: 7, title: 'Le mot de passe fort', job: 'Chapitre 9 · Texte', stars: 4, scene: 'terminal',
      story: 'Le portail vérifie qu’un mot de passe contient assez de chiffres « 1 » (au moins 2).',
      goal: 'Lis <code>PWD</code> (PIC X(12)), compte les <code>"1"</code> dans <code>CPT</code>, puis affiche <code>FORT</code> si <code>CPT &gt;= 2</code>, sinon <code>FAIBLE</code>. Pour "A1B1C1" → <pre>FORT</pre>',
      lesson: '<p>On combine <code>INSPECT … TALLYING</code> et <code>IF</code> : d’abord compter, ensuite décider.</p>',
      starter: H('PASSFORT') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PWD PIC X(12).\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT PWD.\n           INSPECT PWD TALLYING CPT FOR ALL "1".\n           IF CPT >= 2\n               DISPLAY "FAIBLE"\n           ELSE\n               DISPLAY "FORT"\n           END-IF.\n           STOP RUN.\n',
      stdin: 'A1B1C1\n',
      hints: ['Les deux messages sont inversés.', 'Si CPT >= 2 c’est FORT, sinon FAIBLE.'],
      solution: H('PASSFORT') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PWD PIC X(12).\n       01 CPT PIC 9(2) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT PWD.\n           INSPECT PWD TALLYING CPT FOR ALL "1".\n           IF CPT >= 2\n               DISPLAY "FORT"\n           ELSE\n               DISPLAY "FAIBLE"\n           END-IF.\n           STOP RUN.\n',
      tests: [{ stdin: 'A1B1C1\n', expect: 'FORT\n' }, { stdin: 'ABC1DE\n', expect: 'FAIBLE\n' }, { stdin: 'XYZ\n', expect: 'FAIBLE\n' }, { stdin: '111\n', expect: 'FORT\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'TALLYING', msg: 'Compte avec INSPECT … TALLYING.' }] }
    },
    {
      id: 'cob9_8', ch: 9, ord: 8, title: 'Masquer les voyelles', job: 'Chapitre 9 · Texte', stars: 4, scene: 'terminal',
      story: 'Le jeu du pendu masque les voyelles A, E et I d’un mot par des tirets bas.',
      goal: 'Lis <code>MOT</code> (PIC X(12)) et remplace <code>A</code>, <code>E</code> et <code>I</code> par <code>"_"</code> (trois <code>INSPECT REPLACING</code>). Pour "ALPINE" → <pre>_LP_N_</pre>',
      lesson: '<p>Un seul <code>INSPECT REPLACING</code> ne gère qu’un caractère à la fois : on en enchaîne plusieurs, un par voyelle.</p>',
      starter: H('PENDU') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT REPLACING ALL "A" BY "_".\n           INSPECT MOT REPLACING ALL "E" BY "_".\n           DISPLAY MOT.\n           STOP RUN.\n',
      stdin: 'ALPINE\n',
      hints: ['Il manque la voyelle I.', 'Ajoute INSPECT MOT REPLACING ALL "I" BY "_".'],
      solution: H('PENDU') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MOT PIC X(12).\n       PROCEDURE DIVISION.\n           ACCEPT MOT.\n           INSPECT MOT REPLACING ALL "A" BY "_".\n           INSPECT MOT REPLACING ALL "E" BY "_".\n           INSPECT MOT REPLACING ALL "I" BY "_".\n           DISPLAY MOT.\n           STOP RUN.\n',
      tests: [{ stdin: 'ALPINE\n', expect: '_LP_N_      \n' }, { stdin: 'MARITIME\n', expect: 'M_R_T_M_    \n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'REPLACING\\s+ALL\\s+"I"', msg: 'Masque aussi la voyelle I.' }] }
    },
    {
      id: 'cob9_9', ch: 9, ord: 9, title: 'L’étiquette complète', job: 'Chapitre 9 · Texte', stars: 4, scene: 'terminal',
      story: 'Le service courrier compose une ligne d’adresse à partir du nom, du prénom et de la ville.',
      goal: 'Lis <code>NOM</code>, <code>PRENOM</code>, <code>VILLE</code> (ACCEPT). Compose avec <code>STRING</code> la ligne <code>NOM PRENOM (VILLE)</code> dans <code>LIGNE</code> (PIC X(40)). Pour "DUPONT" / "JEAN" / "LYON" → <pre>DUPONT JEAN (LYON)</pre>',
      lesson: '<p>On enchaîne champs et littéraux. <code>DELIMITED BY SPACE</code> coupe chaque champ à son premier espace de remplissage ; les parenthèses sont de simples littéraux.</p>',
      starter: H('COURRIER') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM    PIC X(12).\n       01 PRENOM PIC X(12).\n       01 VILLE  PIC X(12).\n       01 LIGNE  PIC X(40).\n       PROCEDURE DIVISION.\n           ACCEPT NOM.\n           ACCEPT PRENOM.\n           ACCEPT VILLE.\n           STRING NOM DELIMITED BY SPACE " " PRENOM DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      stdin: 'DUPONT\nJEAN\nLYON\n',
      hints: ['Il manque la ville entre parenthèses à la fin.', 'Ajoute " (" VILLE DELIMITED BY SPACE ")" dans le STRING.'],
      solution: H('COURRIER') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM    PIC X(12).\n       01 PRENOM PIC X(12).\n       01 VILLE  PIC X(12).\n       01 LIGNE  PIC X(40).\n       PROCEDURE DIVISION.\n           ACCEPT NOM.\n           ACCEPT PRENOM.\n           ACCEPT VILLE.\n           STRING NOM DELIMITED BY SPACE " " PRENOM DELIMITED BY SPACE " (" VILLE DELIMITED BY SPACE ")" INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      tests: [{ stdin: 'DUPONT\nJEAN\nLYON\n', expect: 'DUPONT JEAN (LYON)                      \n' }, { stdin: 'MARTIN\nLEA\nNICE\n', expect: 'MARTIN LEA (NICE)                       \n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'STRING', msg: 'Compose avec STRING.' }] }
    },

    /* ===================== Chapitre 10 — Un vrai programme (banque) ===================== */
    {
      id: 'cob10_1', ch: 10, ord: 1, title: 'Le guichet', job: 'Chapitre 10 · Un vrai programme', stars: 2, scene: 'terminal',
      story: 'Au guichet de la banque du campus, on saisit un montant et on l’affiche proprement, à la façon d’un reçu.',
      goal: 'Lis <code>M</code> (PIC 9(6)V99), place-le dans un champ édité <code>AFF</code> (PIC $ZZ,ZZ9.99) et affiche-le. Pour 1234.50 → <pre>$ 1,234.50</pre>',
      lesson: '<p>Un montant se lit avec <code>ACCEPT</code>, puis se met en forme avec un <b>champ édité</b> via <code>MOVE</code>. Le champ <code>$ZZ,ZZ9.99</code> ajoute le symbole, les séparateurs et la virgule.</p>',
      starter: H('GUICHET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 M   PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT M.\n           DISPLAY M.\n           STOP RUN.\n',
      stdin: '1234.50\n',
      hints: ['N’affiche pas M brut : passe-le d’abord dans le champ édité.', 'MOVE M TO AFF puis DISPLAY AFF.'],
      solution: H('GUICHET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 M   PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT M.\n           MOVE M TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '1234.50\n', expect: '$  1,234.50\n' }, { stdin: '42.00\n', expect: '$    42.00\n' }, { stdin: '500.00\n', expect: '$   500.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'MOVE', msg: 'Édite le montant avec MOVE vers le champ édité.' }] }
    },
    {
      id: 'cob10_2', ch: 10, ord: 2, title: 'Les intérêts du livret', job: 'Chapitre 10 · Un vrai programme', stars: 3, scene: 'terminal',
      story: 'Le livret d’épargne rapporte 5 % par an. On calcule l’intérêt d’un capital et on l’édite.',
      goal: 'Lis le capital <code>CAP</code> (PIC 9(6)V99), calcule <code>INT = CAP * 5 / 100</code>, édite-le via <code>$ZZ,ZZ9.99</code>. Pour 1000.00 → <pre>$    50.00</pre>',
      lesson: '<p>On combine lecture, calcul et édition. Attention à l’ordre des opérations : <code>CAP * 5 / 100</code>.</p>',
      starter: H('LIVRET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAP PIC 9(6)V99.\n       01 INT PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT CAP.\n           COMPUTE INT = CAP * 10 / 100.\n           MOVE INT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '1000.00\n',
      hints: ['Le taux est 5 %, pas 10 %.', 'COMPUTE INT = CAP * 5 / 100.'],
      solution: H('LIVRET') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAP PIC 9(6)V99.\n       01 INT PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT CAP.\n           COMPUTE INT = CAP * 5 / 100.\n           MOVE INT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '1000.00\n', expect: '$    50.00\n' }, { stdin: '2000.00\n', expect: '$   100.00\n' }, { stdin: '500.00\n', expect: '$    25.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'COMPUTE', msg: 'Calcule l’intérêt avec COMPUTE.' }] }
    },
    {
      id: 'cob10_3', ch: 10, ord: 3, title: 'Le solde de deux comptes', job: 'Chapitre 10 · Un vrai programme', stars: 3, scene: 'terminal',
      story: 'Un client a un compte courant et un livret. On additionne les deux pour afficher son avoir total.',
      goal: 'Lis <code>C1</code> puis <code>C2</code> (PIC 9(6)V99), additionne dans <code>TOT</code> (PIC 9(7)V99), édite via <code>$Z,ZZZ,ZZ9.99</code>. Pour 1200.00 et 800.50 → <pre>$    2,000.50</pre>',
      lesson: '<p>On totalise plusieurs montants avec <code>ADD … GIVING</code> ou <code>COMPUTE</code>, puis on édite le résultat.</p>',
      starter: H('DEUXC') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 C1  PIC 9(6)V99.\n       01 C2  PIC 9(6)V99.\n       01 TOT PIC 9(7)V99.\n       01 AFF PIC $Z,ZZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT C1.\n           ACCEPT C2.\n           COMPUTE TOT = C1.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '1200.00\n800.50\n',
      hints: ['Le total doit inclure le deuxième compte.', 'COMPUTE TOT = C1 + C2.'],
      solution: H('DEUXC') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 C1  PIC 9(6)V99.\n       01 C2  PIC 9(6)V99.\n       01 TOT PIC 9(7)V99.\n       01 AFF PIC $Z,ZZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT C1.\n           ACCEPT C2.\n           COMPUTE TOT = C1 + C2.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '1200.00\n800.50\n', expect: '$    2,000.50\n' }, { stdin: '100.00\n50.00\n', expect: '$     150.00\n' }, { stdin: '10000.00\n5000.00\n', expect: '$   15,000.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'COMPUTE|ADD', msg: 'Additionne les deux comptes.' }] }
    },
    {
      id: 'cob10_4', ch: 10, ord: 4, title: 'Le relevé du jour', job: 'Chapitre 10 · Un vrai programme', stars: 3, scene: 'terminal',
      story: 'La banque totalise les opérations de la journée : on lit le nombre d’opérations, puis chaque montant.',
      goal: 'Lis <code>N</code>, puis <code>N</code> montants (PIC 9(6)V99) dans une boucle en les cumulant dans <code>TOT</code> (PIC 9(8)V99). Édite via <code>$ZZ,ZZ9.99</code>. Pour 3 opérations 100.50, 250.00, 49.50 → <pre>$   400.00</pre>',
      lesson: '<p>Un vrai traitement par lot lit un nombre d’enregistrements, puis les parcourt en boucle et les totalise.</p>',
      starter: H('RELEVE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N   PIC 9(2).\n       01 I   PIC 9(2).\n       01 M   PIC 9(6)V99.\n       01 TOT PIC 9(8)V99 VALUE 0.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT M\n           END-PERFORM.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '3\n100.50\n250.00\n49.50\n',
      hints: ['On lit chaque montant mais on ne l’ajoute jamais au total.', 'Ajoute ADD M TO TOT dans la boucle.'],
      solution: H('RELEVE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N   PIC 9(2).\n       01 I   PIC 9(2).\n       01 M   PIC 9(6)V99.\n       01 TOT PIC 9(8)V99 VALUE 0.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT M\n               ADD M TO TOT\n           END-PERFORM.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '3\n100.50\n250.00\n49.50\n', expect: '$   400.00\n' }, { stdin: '2\n1000.00\n500.00\n', expect: '$  1,500.00\n' }, { stdin: '1\n99.99\n', expect: '$    99.99\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'PERFORM', msg: 'Parcours les opérations avec PERFORM.' }] }
    },
    {
      id: 'cob10_5', ch: 10, ord: 5, title: 'Dépôts et retraits', job: 'Chapitre 10 · Un vrai programme', stars: 4, scene: 'terminal',
      story: 'Chaque opération a un type : D pour dépôt, R pour retrait. On calcule le solde final.',
      goal: 'Lis <code>N</code>, puis N opérations (une lettre <code>OP</code> puis un montant <code>M</code>). Ajoute si <code>D</code>, retire sinon. Solde dans <code>SOLDE</code> (PIC S9(7)V99), édité via <code>$ZZ,ZZ9.99</code>. Pour D 100, D 50, R 30 → <pre>$   120.00</pre>',
      lesson: '<p>On lit deux lignes par opération : le type puis le montant. Un <code>IF</code> choisit d’ajouter ou de soustraire.</p>',
      starter: H('OPER') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(2).\n       01 I     PIC 9(2).\n       01 OP    PIC X.\n       01 M     PIC 9(5)V99.\n       01 SOLDE PIC S9(7)V99 VALUE 0.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT OP\n               ACCEPT M\n               IF OP = "D"\n                   ADD M TO SOLDE\n               ELSE\n                   ADD M TO SOLDE\n               END-IF\n           END-PERFORM.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '3\nD\n100.00\nD\n50.00\nR\n30.00\n',
      hints: ['Le retrait doit DIMINUER le solde, pas l’augmenter.', 'Dans le ELSE : SUBTRACT M FROM SOLDE.'],
      solution: H('OPER') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(2).\n       01 I     PIC 9(2).\n       01 OP    PIC X.\n       01 M     PIC 9(5)V99.\n       01 SOLDE PIC S9(7)V99 VALUE 0.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT OP\n               ACCEPT M\n               IF OP = "D"\n                   ADD M TO SOLDE\n               ELSE\n                   SUBTRACT M FROM SOLDE\n               END-IF\n           END-PERFORM.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '3\nD\n100.00\nD\n50.00\nR\n30.00\n', expect: '$   120.00\n' }, { stdin: '2\nD\n500.00\nR\n200.00\n', expect: '$   300.00\n' }, { stdin: '1\nD\n75.50\n', expect: '$    75.50\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: '\\bIF\\b', msg: 'Choisis ajout ou retrait avec IF.' }] }
    },
    {
      id: 'cob10_6', ch: 10, ord: 6, title: 'Les frais de tenue', job: 'Chapitre 10 · Un vrai programme', stars: 4, scene: 'terminal',
      story: 'La banque prélève 10 de frais sur les comptes dont le solde est inférieur à 500.',
      goal: 'Lis <code>SOLDE</code> (PIC 9(6)V99). Si <code>SOLDE &lt; 500</code>, retire 10.00. Édite le solde final via <code>$ZZ,ZZ9.99</code>. Pour 300.00 → <pre>$   290.00</pre> ; pour 800.00 → <pre>$   800.00</pre>',
      lesson: '<p>Une règle de gestion typique : un <code>IF</code> applique des frais seulement dans certains cas.</p>',
      starter: H('FRAIS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6)V99.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           IF SOLDE > 500\n               SUBTRACT 10.00 FROM SOLDE\n           END-IF.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '300.00\n',
      hints: ['Les frais touchent les PETITS soldes, sous 500.', 'IF SOLDE < 500.'],
      solution: H('FRAIS') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6)V99.\n       01 AFF   PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           IF SOLDE < 500\n               SUBTRACT 10.00 FROM SOLDE\n           END-IF.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '300.00\n', expect: '$   290.00\n' }, { stdin: '800.00\n', expect: '$   800.00\n' }, { stdin: '499.99\n', expect: '$   489.99\n' }, { stdin: '500.00\n', expect: '$   500.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: '\\bIF\\b', msg: 'Applique les frais avec un IF.' }] }
    },
    {
      id: 'cob10_7', ch: 10, ord: 7, title: 'Le portefeuille', job: 'Chapitre 10 · Un vrai programme', stars: 4, scene: 'terminal',
      story: 'Un client détient plusieurs comptes. On les range dans un tableau, on les totalise et on édite l’avoir.',
      goal: 'Lis <code>N</code> comptes (PIC 9(6)V99) dans <code>CPT</code> (OCCURS 5), additionne dans <code>TOT</code> (PIC 9(8)V99), édite via <code>$ZZ,ZZ9.99</code>. Pour 3 comptes 1000.00, 250.50, 49.50 → <pre>$ 1,300.00</pre>',
      lesson: '<p>On réunit tableau (<code>OCCURS</code>), boucle de saisie, boucle de totalisation et édition : la structure d’un vrai programme bancaire.</p>',
      starter: H('PORTEF') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CPT PIC 9(6)V99 OCCURS 5 TIMES.\n       01 N   PIC 9(2).\n       01 I   PIC 9(2).\n       01 TOT PIC 9(8)V99 VALUE 0.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT CPT(I)\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ADD CPT(1) TO TOT\n           END-PERFORM.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '3\n1000.00\n250.50\n49.50\n',
      hints: ['Dans le total, additionne la case I et non toujours la première.', 'ADD CPT(I) TO TOT.'],
      solution: H('PORTEF') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CPT PIC 9(6)V99 OCCURS 5 TIMES.\n       01 N   PIC 9(2).\n       01 I   PIC 9(2).\n       01 TOT PIC 9(8)V99 VALUE 0.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ACCEPT CPT(I)\n           END-PERFORM.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ADD CPT(I) TO TOT\n           END-PERFORM.\n           MOVE TOT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '3\n1000.00\n250.50\n49.50\n', expect: '$  1,300.00\n' }, { stdin: '2\n500.00\n500.00\n', expect: '$  1,000.00\n' }, { stdin: '1\n42.42\n', expect: '$    42.42\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'OCCURS', msg: 'Range les comptes dans un tableau OCCURS.' }] }
    },
    {
      id: 'cob10_8', ch: 10, ord: 8, title: 'La remise fidélité', job: 'Chapitre 10 · Un vrai programme', stars: 4, scene: 'terminal',
      story: 'Le magasin accorde une remise selon le montant : rien sous 50, 10 % de 50 à 99, 20 % à partir de 100.',
      goal: 'Lis <code>M</code> (PIC 9(6)V99). Avec <code>EVALUATE</code>/<code>IF</code>, calcule <code>NET</code> après remise, édite via <code>$ZZ,ZZ9.99</code>. Pour 100.00 → <pre>$    80.00</pre> ; 60.00 → <pre>$    54.00</pre> ; 30.00 → <pre>$    30.00</pre>',
      lesson: '<p>Des paliers de remise se traduisent par des conditions successives. On calcule le taux, puis <code>NET = M - M * taux / 100</code>.</p>',
      starter: H('FIDELITE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 M   PIC 9(6)V99.\n       01 NET PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT M.\n           IF M >= 100\n               COMPUTE NET = M - M * 10 / 100\n           ELSE\n               IF M >= 50\n                   COMPUTE NET = M - M * 10 / 100\n               ELSE\n                   MOVE M TO NET\n               END-IF\n           END-IF.\n           MOVE NET TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '100.00\n',
      hints: ['À partir de 100, la remise est de 20 %, pas 10 %.', 'Pour M >= 100 : COMPUTE NET = M - M * 20 / 100.'],
      solution: H('FIDELITE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 M   PIC 9(6)V99.\n       01 NET PIC 9(6)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT M.\n           IF M >= 100\n               COMPUTE NET = M - M * 20 / 100\n           ELSE\n               IF M >= 50\n                   COMPUTE NET = M - M * 10 / 100\n               ELSE\n                   MOVE M TO NET\n               END-IF\n           END-IF.\n           MOVE NET TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '100.00\n', expect: '$    80.00\n' }, { stdin: '60.00\n', expect: '$    54.00\n' }, { stdin: '30.00\n', expect: '$    30.00\n' }, { stdin: '200.00\n', expect: '$   160.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: '\\bIF\\b|EVALUATE', msg: 'Décide des paliers avec IF ou EVALUATE.' }] }
    },
    {
      id: 'cob10_9', ch: 10, ord: 9, title: 'Le bulletin de paie', job: 'Chapitre 10 · Un vrai programme', stars: 4, scene: 'terminal',
      story: 'Dernière ligne droite avant la finale : un bulletin simple. Salaire brut = heures × 15, puis 20 % de charges, et le net édité.',
      goal: 'Lis <code>HEURES</code> (PIC 9(3)). Brut = heures × 15, charges = 20 % du brut, <code>NET = BRUT - CHARGES</code> (PIC 9(6)V99). Édite via <code>$ZZ,ZZ9.99</code>. Pour 100 h → <pre>$ 1,200.00</pre>',
      lesson: '<p>On enchaîne les calculs d’un bulletin : d’abord le brut, puis les charges, puis le net, qu’on met en forme pour le reçu.</p>',
      starter: H('PAIE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HEURES  PIC 9(3).\n       01 BRUT    PIC 9(6)V99.\n       01 CHARGES PIC 9(6)V99.\n       01 NET     PIC 9(6)V99.\n       01 AFF     PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT HEURES.\n           COMPUTE BRUT = HEURES * 15.\n           COMPUTE CHARGES = BRUT * 20 / 100.\n           MOVE BRUT TO NET.\n           MOVE NET TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '100\n',
      hints: ['Le net, c’est le brut MOINS les charges.', 'COMPUTE NET = BRUT - CHARGES.'],
      solution: H('PAIE2') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HEURES  PIC 9(3).\n       01 BRUT    PIC 9(6)V99.\n       01 CHARGES PIC 9(6)V99.\n       01 NET     PIC 9(6)V99.\n       01 AFF     PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT HEURES.\n           COMPUTE BRUT = HEURES * 15.\n           COMPUTE CHARGES = BRUT * 20 / 100.\n           COMPUTE NET = BRUT - CHARGES.\n           MOVE NET TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '100\n', expect: '$  1,200.00\n' }, { stdin: '35\n', expect: '$   420.00\n' }, { stdin: '40\n', expect: '$   480.00\n' }, { stdin: '10\n', expect: '$   120.00\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'COMPUTE', msg: 'Calcule le net avec COMPUTE.' }] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
