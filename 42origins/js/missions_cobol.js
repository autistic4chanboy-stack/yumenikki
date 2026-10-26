/* =========================================================================
 *  42 ORIGINS — missions COBOL (contrats finaux des 10 chapitres)
 *  Les missions ord 1 à 9 de chaque chapitre sont dans missions_cobol_*.js.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cobol = O42.missions.cobol || [];
  function H(id) { return 'IDENTIFICATION DIVISION.\n       PROGRAM-ID. ' + id + '.\n'; }
  O42.missions.cobol.push(
    {
      id: 'cob1', title: 'Bonjour, mainframe', job: 'Chapitre 1 · Premiers pas', stars: 1, scene: 'terminal',
      story: 'COBOL fait encore tourner les banques et les assurances. Premier contrat : saluer la salle des machines.',
      goal: 'Affiche exactement :<pre>BONJOUR 42</pre>avec l’instruction <code>DISPLAY</code>.',
      lesson: '<p>Un programme COBOL s’organise en <b>divisions</b>. Le minimum : <code>IDENTIFICATION DIVISION.</code> (le nom du programme) puis <code>PROCEDURE DIVISION.</code> (le code).</p>' +
        '<p><code>DISPLAY "texte"</code> affiche une ligne. <code>STOP RUN.</code> termine le programme. Chaque phrase finit par un <b>point</b>.</p>',
      starter: H('BONJOUR') + '       PROCEDURE DIVISION.\n           DISPLAY "BONJOUR".\n           STOP RUN.\n',
      hints: ['Change le texte entre guillemets.', 'DISPLAY "BONJOUR 42".'],
      solution: H('BONJOUR') + '       PROCEDURE DIVISION.\n           DISPLAY "BONJOUR 42".\n           STOP RUN.\n',
      tests: [{ expect: 'BONJOUR 42\n' }],
      rules: { mustSrc: [{ re: 'DISPLAY', msg: 'Utilise DISPLAY.' }] }
    },
    {
      id: 'cob2', title: 'La fiche client', job: 'Chapitre 2 · Les données', stars: 2, scene: 'terminal',
      story: 'Chaque client a une fiche. En COBOL, on réserve d’abord des zones de données avec leur taille.',
      goal: 'Déclare <code>NOM</code> (PIC X(10), valeur "ADA") et <code>AGE</code> (PIC 9(3), valeur 42), puis affiche :<pre>ADA       042</pre>(NOM sur 10 caractères, un espace, AGE sur 3 chiffres).',
      lesson: '<p>Dans la <code>WORKING-STORAGE SECTION</code>, chaque champ a un numéro de niveau (01), un nom, et une <b>PICTURE</b> :</p>' +
        '<ul><li><code>PIC X(10)</code> = 10 caractères (texte, cadré à gauche).</li><li><code>PIC 9(3)</code> = 3 chiffres (nombre, cadré à droite avec des zéros).</li></ul>' +
        '<p><code>VALUE</code> donne la valeur de départ. Regarde chaque champ, case par case, dans le panneau de droite.</p>',
      starter: H('FICHE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(10) VALUE "ADA".\n       01 AGE PIC 9(3) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM.\n           STOP RUN.\n',
      hints: ['Affiche NOM, un espace et AGE dans un seul DISPLAY : DISPLAY NOM " " AGE.', 'AGE vaut 42 mais PIC 9(3) l’affiche « 042 ».'],
      solution: H('FICHE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(10) VALUE "ADA".\n       01 AGE PIC 9(3) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM " " AGE.\n           STOP RUN.\n',
      tests: [{ expect: 'ADA        042\n' }],
      rules: { mustSrc: [{ re: 'PIC', msg: 'Déclare des champs avec PIC.' }] }
    },
    {
      id: 'cob3', title: 'Le relevé formaté', job: 'Chapitre 3 · MOVE', stars: 2, scene: 'terminal',
      story: 'Le relevé bancaire doit afficher un montant lisible : signe monétaire, séparateurs, virgule.',
      goal: 'Mets le solde <code>12345.67</code> dans un champ édité <code>PIC $Z,ZZ9.99</code> et affiche :<pre>$12,345.67</pre>',
      lesson: '<p><code>MOVE source TO dest</code> copie une valeur. Si <code>dest</code> est un champ <b>édité</b>, COBOL met en forme automatiquement.</p>' +
        '<pre>01 SOLDE   PIC 9(5)V99 VALUE 12345.67.\n01 AFFICHE PIC $Z,ZZ9.99.\nMOVE SOLDE TO AFFICHE.</pre>' +
        '<p><code>V</code> = virgule implicite (position du point décimal). <code>Z</code> = chiffre sans zéro de tête.</p>',
      starter: H('RELEVE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE   PIC 9(5)V99 VALUE 12345.67.\n       01 AFFICHE PIC 9(8).\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFFICHE.\n           DISPLAY AFFICHE.\n           STOP RUN.\n',
      hints: ['Le champ d’affichage doit être un champ ÉDITÉ (avec $ , .).', 'Donne à AFFICHE la PIC $Z,ZZ9.99.'],
      solution: H('RELEVE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE   PIC 9(5)V99 VALUE 12345.67.\n       01 AFFICHE PIC $Z,ZZ9.99.\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFFICHE.\n           DISPLAY AFFICHE.\n           STOP RUN.\n',
      tests: [{ expect: '$12,345.67\n' }],
      rules: { mustSrc: [{ re: 'MOVE', msg: 'Utilise MOVE.' }] }
    },
    {
      id: 'cob4', title: 'La caisse enregistreuse', job: 'Chapitre 4 · Calculs', stars: 3, scene: 'terminal',
      story: 'Trois articles à 19.99, moins 5.00 de remise. Calcule le total avec COMPUTE.',
      goal: 'Calcule <code>PRIX * 3 - REMISE</code> dans <code>TOTAL</code> (PIC 9(4)V99) et affiche-le via <code>$Z,ZZ9.99</code> :<pre>$54.97</pre>',
      lesson: '<p><code>COMPUTE cible = expression</code> calcule comme en maths : <code>+ - * /</code> et parenthèses.</p>' +
        '<p>On peut aussi utiliser <code>ADD</code>, <code>SUBTRACT</code>, <code>MULTIPLY … BY …</code>, <code>DIVIDE … INTO …</code>.</p>',
      starter: H('CAISSE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX    PIC 9(4)V99 VALUE 19.99.\n       01 REMISE  PIC 9(4)V99 VALUE 5.00.\n       01 TOTAL   PIC 9(4)V99.\n       01 AFF     PIC $Z,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX * 3.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      hints: ['Il manque la remise dans le calcul.', 'COMPUTE TOTAL = PRIX * 3 - REMISE.'],
      solution: H('CAISSE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX    PIC 9(4)V99 VALUE 19.99.\n       01 REMISE  PIC 9(4)V99 VALUE 5.00.\n       01 TOTAL   PIC 9(4)V99.\n       01 AFF     PIC $Z,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX * 3 - REMISE.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ expect: '$   54.97\n' }],
      rules: { mustSrc: [{ re: 'COMPUTE|MULTIPLY', msg: 'Calcule avec COMPUTE.' }] }
    },
    {
      id: 'cob5', title: 'Le barème d’impôt', job: 'Chapitre 5 · Décisions', stars: 3, scene: 'terminal',
      story: 'Selon le revenu lu, affiche la tranche. Utilise EVALUATE (le switch du COBOL).',
      goal: 'Lis un revenu avec <code>ACCEPT</code> puis affiche :<pre>EXONERE</pre>si &lt; 10000, <pre>TRANCHE 1</pre>si &lt; 30000, sinon <pre>TRANCHE 2</pre>Testé avec plusieurs revenus.',
      lesson: '<p><code>ACCEPT champ</code> lit une ligne de l’entrée. <code>IF cond … ELSE … END-IF</code> et <code>EVALUATE</code> décident.</p>' +
        '<pre>IF REV < 10000\n    DISPLAY "EXONERE"\nELSE IF ...\nEND-IF</pre>',
      starter: H('IMPOT') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REV PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT REV.\n           IF REV < 10000\n               DISPLAY "EXONERE"\n           END-IF.\n           STOP RUN.\n',
      stdin: '25000\n',
      hints: ['Ajoute les autres cas avec ELSE.', 'IF REV < 10000 … ELSE IF REV < 30000 DISPLAY "TRANCHE 1" ELSE DISPLAY "TRANCHE 2".'],
      solution: H('IMPOT') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REV PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT REV.\n           IF REV < 10000\n               DISPLAY "EXONERE"\n           ELSE\n               IF REV < 30000\n                   DISPLAY "TRANCHE 1"\n               ELSE\n                   DISPLAY "TRANCHE 2"\n               END-IF\n           END-IF.\n           STOP RUN.\n',
      tests: [{ stdin: '5000\n', expect: 'EXONERE\n' }, { stdin: '25000\n', expect: 'TRANCHE 1\n' }, { stdin: '90000\n', expect: 'TRANCHE 2\n' }, { stdin: '10000\n', expect: 'TRANCHE 1\n' }],
      rules: { mustSrc: [{ re: '\\bIF\\b|EVALUATE', msg: 'Décide avec IF ou EVALUATE.' }], mustCall: ['ACCEPT'] }
    },
    {
      id: 'cob6', title: 'La somme des jours', job: 'Chapitre 6 · Boucles', stars: 3, scene: 'terminal',
      story: 'Additionne 1 + 2 + … + N avec une boucle PERFORM VARYING.',
      goal: 'Lis N, calcule la somme de 1 à N dans <code>TOTAL</code> et affiche-la (PIC 9(5), zéros inclus). Pour N=5 → <pre>00015</pre>',
      lesson: '<pre>PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n    ADD I TO TOTAL\nEND-PERFORM</pre>' +
        '<p><code>I</code> part de 1 et augmente de 1 jusqu’à dépasser N. À chaque tour, on ajoute I au total.</p>',
      starter: H('SOMME') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(3).\n       01 I     PIC 9(3).\n       01 TOTAL PIC 9(5) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               CONTINUE\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      stdin: '5\n',
      hints: ['Remplace CONTINUE par l’ajout de I.', 'ADD I TO TOTAL'],
      solution: H('SOMME') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 N     PIC 9(3).\n       01 I     PIC 9(3).\n       01 TOTAL PIC 9(5) VALUE 0.\n       PROCEDURE DIVISION.\n           ACCEPT N.\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > N\n               ADD I TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      tests: [{ stdin: '5\n', expect: '00015\n' }, { stdin: '10\n', expect: '00055\n' }, { stdin: '1\n', expect: '00001\n' }, { stdin: '100\n', expect: '05050\n' }],
      rules: { mustSrc: [{ re: 'PERFORM', msg: 'Utilise PERFORM.' }] }
    },
    {
      id: 'cob7', title: 'La chaîne de traitement', job: 'Chapitre 7 · Paragraphes', stars: 4, scene: 'terminal',
      story: 'Un gros programme se découpe en paragraphes nommés, appelés avec PERFORM.',
      goal: 'Complète le paragraphe <code>CALCUL</code> pour qu’il double <code>X</code>, et appelle-le 3 fois. X part de 1 → affiche :<pre>00002\n00004\n00008</pre>',
      lesson: '<p>Un <b>paragraphe</b> est une étiquette suivie d’instructions. <code>PERFORM NOM</code> exécute ce paragraphe puis revient.</p>' +
        '<pre>PERFORM CALCUL.\n...\nCALCUL.\n    COMPUTE X = X * 2.</pre>',
      starter: H('CHAINE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 X PIC 9(5) VALUE 1.\n       PROCEDURE DIVISION.\n           PERFORM CALCUL 3 TIMES.\n           STOP RUN.\n       CALCUL.\n           DISPLAY X.\n',
      hints: ['Dans CALCUL, double X AVANT de l’afficher.', 'COMPUTE X = X * 2 puis DISPLAY X.'],
      solution: H('CHAINE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 X PIC 9(5) VALUE 1.\n       PROCEDURE DIVISION.\n           PERFORM CALCUL 3 TIMES.\n           STOP RUN.\n       CALCUL.\n           COMPUTE X = X * 2.\n           DISPLAY X.\n',
      tests: [{ expect: '00002\n00004\n00008\n' }],
      rules: { mustSrc: [{ re: 'PERFORM\\s+CALCUL', msg: 'Appelle le paragraphe CALCUL avec PERFORM.' }] }
    },
    {
      id: 'cob8', title: 'Le tableau des ventes', job: 'Chapitre 8 · Tableaux', stars: 4, scene: 'terminal',
      story: 'Stocke 5 ventes dans un tableau, puis affiche leur total.',
      goal: 'Range 10, 20, 30, 40, 50 dans <code>VENTE</code> (OCCURS 5), additionne-les et affiche :<pre>00150</pre>',
      lesson: '<p>Un <b>tableau</b> se déclare avec <code>OCCURS</code> :</p><pre>01 VENTE PIC 9(3) OCCURS 5 TIMES.</pre>' +
        '<p>On accède à une case par son indice (à partir de 1) : <code>VENTE(1)</code>, <code>VENTE(I)</code>.</p>',
      starter: H('VENTES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VENTE PIC 9(3) OCCURS 5 TIMES.\n       01 I     PIC 9.\n       01 TOTAL PIC 9(5) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 10 TO VENTE(1).\n           MOVE 20 TO VENTE(2).\n           MOVE 30 TO VENTE(3).\n           MOVE 40 TO VENTE(4).\n           MOVE 50 TO VENTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               CONTINUE\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      hints: ['Dans la boucle, ajoute VENTE(I) au total.', 'ADD VENTE(I) TO TOTAL'],
      solution: H('VENTES') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VENTE PIC 9(3) OCCURS 5 TIMES.\n       01 I     PIC 9.\n       01 TOTAL PIC 9(5) VALUE 0.\n       PROCEDURE DIVISION.\n           MOVE 10 TO VENTE(1).\n           MOVE 20 TO VENTE(2).\n           MOVE 30 TO VENTE(3).\n           MOVE 40 TO VENTE(4).\n           MOVE 50 TO VENTE(5).\n           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 5\n               ADD VENTE(I) TO TOTAL\n           END-PERFORM.\n           DISPLAY TOTAL.\n           STOP RUN.\n',
      tests: [{ expect: '00150\n' }],
      rules: { mustSrc: [{ re: 'OCCURS', msg: 'Déclare un tableau avec OCCURS.' }] }
    },
    {
      id: 'cob9', title: 'L’étiquette postale', job: 'Chapitre 9 · Texte', stars: 4, scene: 'terminal',
      story: 'Colle le prénom et le nom lus pour fabriquer une ligne d’adresse.',
      goal: 'Lis <code>PRENOM</code> puis <code>NOM</code> (ACCEPT), et construis avec <code>STRING</code> la ligne <code>&lt;PRENOM&gt; &lt;NOM&gt;</code>. Pour "Ada" / "Lovelace" → <pre>Ada Lovelace</pre>',
      lesson: '<p><code>STRING a " " b INTO dest</code> concatène plusieurs morceaux dans un champ texte.</p>' +
        '<p><code>DELIMITED BY SIZE</code> prend tout le champ ; <code>DELIMITED BY SPACE</code> s’arrête au premier espace.</p>',
      starter: H('ETIQ') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRENOM PIC X(10).\n       01 NOM    PIC X(10).\n       01 LIGNE  PIC X(22).\n       PROCEDURE DIVISION.\n           ACCEPT PRENOM.\n           ACCEPT NOM.\n           DISPLAY PRENOM.\n           STOP RUN.\n',
      stdin: 'Ada\nLovelace\n',
      hints: ['STRING assemble les morceaux. DELIMITED BY SPACE enlève les espaces de remplissage.', 'STRING PRENOM DELIMITED BY SPACE " " NOM DELIMITED BY SPACE INTO LIGNE then DISPLAY LIGNE.'],
      solution: H('ETIQ') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRENOM PIC X(10).\n       01 NOM    PIC X(10).\n       01 LIGNE  PIC X(22).\n       PROCEDURE DIVISION.\n           ACCEPT PRENOM.\n           ACCEPT NOM.\n           STRING PRENOM DELIMITED BY SPACE " " NOM DELIMITED BY SPACE INTO LIGNE.\n           DISPLAY LIGNE.\n           STOP RUN.\n',
      tests: [{ stdin: 'Ada\nLovelace\n', expect: 'Ada Lovelace          \n' }, { stdin: 'Bob\nSmith\n', expect: 'Bob Smith             \n' }],
      rules: { mustSrc: [{ re: 'STRING', msg: 'Assemble avec STRING.' }] }
    },
    {
      id: 'cob10', title: 'La paie du mois', job: 'Chapitre 10 · Un vrai programme', stars: 5, scene: 'terminal',
      story: 'Contrat final : lis des heures, calcule la paie (taux 15, +50 % au-delà de 35 h), édite le net. Comme un vrai batch de paie.',
      goal: 'Lis <code>HEURES</code>. Paie = heures × 15 ; au-delà de 35 h, les heures supplémentaires sont payées 1,5×. Affiche le résultat via <code>$ZZ,ZZ9.99</code>.<br>35 h → <code>$   525.00</code> · 40 h → <code>$   637.50</code> (le champ édité cadre avec des espaces).',
      lesson: '<p>On combine tout : lecture (<code>ACCEPT</code>), décision (<code>IF</code>), calcul (<code>COMPUTE</code>), édition (<code>MOVE … TO</code> champ édité).</p>' +
        '<p>Heures sup = heures − 35 (si positif), payées 15 × 1,5 = 22,5.</p>',
      starter: H('PAIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HEURES PIC 9(3).\n       01 SUP    PIC 9(3) VALUE 0.\n       01 PAIE   PIC 9(6)V99 VALUE 0.\n       01 AFF    PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT HEURES.\n           COMPUTE PAIE = HEURES * 15.\n*          TODO : gérer les heures supplémentaires (> 35) a 1.5x\n           MOVE PAIE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      stdin: '40\n',
      hints: ['Si HEURES > 35, calcule les heures sup et ajoute leur demi-taux.', 'IF HEURES > 35 COMPUTE SUP = HEURES - 35 puis COMPUTE PAIE = HEURES * 15 + SUP * 7.5 END-IF.', '40 h : base 600 + 5 h sup × 7,5 = 637,50.'],
      solution: H('PAIE') + '       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HEURES PIC 9(3).\n       01 SUP    PIC 9(3) VALUE 0.\n       01 PAIE   PIC 9(6)V99 VALUE 0.\n       01 AFF    PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           ACCEPT HEURES.\n           COMPUTE PAIE = HEURES * 15.\n           IF HEURES > 35\n               COMPUTE SUP = HEURES - 35\n               COMPUTE PAIE = PAIE + SUP * 7.5\n           END-IF.\n           MOVE PAIE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n',
      tests: [{ stdin: '35\n', expect: '$   525.00\n' }, { stdin: '40\n', expect: '$   637.50\n' }, { stdin: '10\n', expect: '$   150.00\n' }, { stdin: '50\n', expect: '$   862.50\n' }],
      rules: { mustCall: ['ACCEPT'], mustSrc: [{ re: 'IF', msg: 'Il faut un IF pour les heures sup.' }] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
