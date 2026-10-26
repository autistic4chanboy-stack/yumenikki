/* =========================================================================
 *  42 ORIGINS — missions COBOL chapitres 1-5 (ords 1-9)
 *  Remplies niveau par niveau ; le moteur engine_cobol.js est la référence.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  O42.missions = O42.missions || {};
  O42.missions.cobol = O42.missions.cobol || [];
  function H(id) { return 'IDENTIFICATION DIVISION.\n       PROGRAM-ID. ' + id + '.\n'; }
  O42.missions.cobol.push(
    {
      id: "cob1_1", ch: 1, ord: 1, title: "Allumer la salle", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "Minuit sur le campus. Le gardien allume la salle des machines et veut un mot à l’écran.",
      goal: "Affiche exactement :<pre>CAMPUS 42</pre>avec <code>DISPLAY</code>.",
      lesson: "<p>Un programme COBOL contient au minimum une <code>IDENTIFICATION DIVISION.</code> (son nom) et une <code>PROCEDURE DIVISION.</code> (le code).</p><p><code>DISPLAY \"texte\"</code> affiche une ligne, <code>STOP RUN.</code> termine. Chaque phrase finit par un <b>point</b>.</p>",
      starter: H("CAMPUS") + "       PROCEDURE DIVISION.\n           DISPLAY \"CAMPUS\".\n           STOP RUN.\n",
      solution: H("CAMPUS") + "       PROCEDURE DIVISION.\n           DISPLAY \"CAMPUS 42\".\n           STOP RUN.\n",
      hints: ["Change le texte entre guillemets.", "DISPLAY \"CAMPUS 42\"."],
      tests: [{ expect: "CAMPUS 42\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_2", ch: 1, ord: 2, title: "L’année de naissance", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "Sur le mur de la salle, une plaque rappelle l’année de naissance du COBOL : 1959.",
      goal: "Affiche exactement :<pre>COBOL 1959</pre>",
      lesson: "<p>Le texte affiché est celui que tu écris entre guillemets, à l’identique (lettres, chiffres, espaces).</p>",
      starter: H("ANNEE") + "       PROCEDURE DIVISION.\n           DISPLAY \"COBOL\".\n           STOP RUN.\n",
      solution: H("ANNEE") + "       PROCEDURE DIVISION.\n           DISPLAY \"COBOL 1959\".\n           STOP RUN.\n",
      hints: ["Il manque l’année dans le texte.", "DISPLAY \"COBOL 1959\"."],
      tests: [{ expect: "COBOL 1959\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_3", ch: 1, ord: 3, title: "Deux messages", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "L’équipe de nuit veut deux lignes de consignes, l’une sous l’autre.",
      goal: "Affiche deux lignes :<pre>OUVERTURE\nGUICHET PRET</pre>",
      lesson: "<p>Chaque <code>DISPLAY</code> affiche sa ligne puis passe à la ligne suivante. Deux <code>DISPLAY</code> = deux lignes.</p>",
      starter: H("CONSIGNE") + "       PROCEDURE DIVISION.\n           DISPLAY \"OUVERTURE\".\n           STOP RUN.\n",
      solution: H("CONSIGNE") + "       PROCEDURE DIVISION.\n           DISPLAY \"OUVERTURE\".\n           DISPLAY \"GUICHET PRET\".\n           STOP RUN.\n",
      hints: ["Ajoute un deuxième DISPLAY.", "DISPLAY \"OUVERTURE\". puis DISPLAY \"GUICHET PRET\"."],
      tests: [{ expect: "OUVERTURE\nGUICHET PRET\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_4", ch: 1, ord: 4, title: "Débit et crédit", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "Un seul DISPLAY peut coller plusieurs morceaux de texte bout à bout.",
      goal: "Avec <b>un seul</b> DISPLAY et trois littéraux, affiche :<pre>DEBIT ET CREDIT</pre>",
      lesson: "<p><code>DISPLAY \"a\" \"b\" \"c\"</code> colle les morceaux sans rien ajouter entre eux. Les espaces, c’est à toi de les mettre.</p>",
      starter: H("COMPTA") + "       PROCEDURE DIVISION.\n           DISPLAY \"DEBIT\" \"CREDIT\".\n           STOP RUN.\n",
      solution: H("COMPTA") + "       PROCEDURE DIVISION.\n           DISPLAY \"DEBIT\" \" ET \" \"CREDIT\".\n           STOP RUN.\n",
      hints: ["Il manque le mot au milieu, avec ses espaces.", "DISPLAY \"DEBIT\" \" ET \" \"CREDIT\"."],
      tests: [{ expect: "DEBIT ET CREDIT\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_5", ch: 1, ord: 5, title: "Le numéro de guichet", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "On affiche un libellé suivi d’un nombre écrit directement dans le code.",
      goal: "Affiche exactement :<pre>GUICHET 7</pre>",
      lesson: "<p>Un nombre écrit sans guillemets (ex. <code>7</code>) s’affiche tel quel. Pense à l’espace dans le texte avant le nombre.</p>",
      starter: H("GUICHET") + "       PROCEDURE DIVISION.\n           DISPLAY \"GUICHET \" 3.\n           STOP RUN.\n",
      solution: H("GUICHET") + "       PROCEDURE DIVISION.\n           DISPLAY \"GUICHET \" 7.\n           STOP RUN.\n",
      hints: ["Le bon guichet est le 7.", "DISPLAY \"GUICHET \" 7."],
      tests: [{ expect: "GUICHET 7\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_6", ch: 1, ord: 6, title: "Le menu du distributeur", job: "Chapitre 1 · Premiers pas", stars: 1, scene: 'terminal',
      story: "Le distributeur automatique affiche trois choix, un par ligne.",
      goal: "Affiche :<pre>1 RETRAIT\n2 DEPOT\n3 SOLDE</pre>",
      starter: H("MENU") + "       PROCEDURE DIVISION.\n           DISPLAY \"1 RETRAIT\".\n           DISPLAY \"2 DEPOT\".\n           STOP RUN.\n",
      solution: H("MENU") + "       PROCEDURE DIVISION.\n           DISPLAY \"1 RETRAIT\".\n           DISPLAY \"2 DEPOT\".\n           DISPLAY \"3 SOLDE\".\n           STOP RUN.\n",
      hints: ["Il manque la troisième ligne du menu.", "Ajoute DISPLAY \"3 SOLDE\"."],
      tests: [{ expect: "1 RETRAIT\n2 DEPOT\n3 SOLDE\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_7", ch: 1, ord: 7, title: "La séquence de démarrage", job: "Chapitre 1 · Premiers pas", stars: 2, scene: 'terminal',
      story: "Le mainframe démarre dans un ordre précis : alimentation, puis disques, puis réseau. Les phrases s’exécutent de haut en bas.",
      goal: "Affiche, dans cet ordre :<pre>ALIMENTATION\nDISQUES\nRESEAU</pre>",
      lesson: "<p>Les phrases de la PROCEDURE DIVISION s’exécutent <b>dans l’ordre</b> où elles sont écrites. Remets-les dans le bon ordre.</p>",
      starter: H("BOOT") + "       PROCEDURE DIVISION.\n           DISPLAY \"RESEAU\".\n           DISPLAY \"ALIMENTATION\".\n           DISPLAY \"DISQUES\".\n           STOP RUN.\n",
      solution: H("BOOT") + "       PROCEDURE DIVISION.\n           DISPLAY \"ALIMENTATION\".\n           DISPLAY \"DISQUES\".\n           DISPLAY \"RESEAU\".\n           STOP RUN.\n",
      hints: ["L’ordre des DISPLAY compte.", "ALIMENTATION d’abord, RESEAU en dernier."],
      tests: [{ expect: "ALIMENTATION\nDISQUES\nRESEAU\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob1_8", ch: 1, ord: 8, title: "Le mot figuratif SPACE", job: "Chapitre 1 · Premiers pas", stars: 2, scene: 'terminal',
      story: "Pour mettre un espace, on peut écrire \" \" ou utiliser le mot réservé SPACE.",
      goal: "En utilisant <code>SPACE</code> entre les deux mots, affiche :<pre>COMPTE OUVERT</pre>",
      lesson: "<p><code>SPACE</code> est un <b>mot figuratif</b> qui vaut un espace. <code>DISPLAY \"COMPTE\" SPACE \"OUVERT\"</code> affiche « COMPTE OUVERT ».</p>",
      starter: H("ETAT") + "       PROCEDURE DIVISION.\n           DISPLAY \"COMPTE\" \"OUVERT\".\n           STOP RUN.\n",
      solution: H("ETAT") + "       PROCEDURE DIVISION.\n           DISPLAY \"COMPTE\" SPACE \"OUVERT\".\n           STOP RUN.\n",
      hints: ["Sans séparateur, les deux mots se collent.", "DISPLAY \"COMPTE\" SPACE \"OUVERT\"."],
      tests: [{ expect: "COMPTE OUVERT\n" }],
      rules: { mustSrc: [{ re: "SPACE", msg: "Utilise le mot SPACE." }] }
    },
    {
      id: "cob1_9", ch: 1, ord: 9, title: "L’en-tête du reçu", job: "Chapitre 1 · Premiers pas", stars: 2, scene: 'terminal',
      story: "Dernier contrat du chapitre : imprimer un petit en-tête de reçu, titre, numéro et remerciement.",
      goal: "Affiche :<pre>=== BANQUE 42 ===\nRECU NUMERO 1001\nMERCI</pre>",
      starter: H("RECU") + "       PROCEDURE DIVISION.\n           DISPLAY \"=== BANQUE 42 ===\".\n           DISPLAY \"RECU NUMERO \".\n           DISPLAY \"MERCI\".\n           STOP RUN.\n",
      solution: H("RECU") + "       PROCEDURE DIVISION.\n           DISPLAY \"=== BANQUE 42 ===\".\n           DISPLAY \"RECU NUMERO \" 1001.\n           DISPLAY \"MERCI\".\n           STOP RUN.\n",
      hints: ["Le numéro de reçu manque sur la 2e ligne.", "DISPLAY \"RECU NUMERO \" 1001."],
      tests: [{ expect: "=== BANQUE 42 ===\nRECU NUMERO 1001\nMERCI\n" }],
      rules: { mustSrc: [{ re: "DISPLAY", msg: "Utilise DISPLAY." }] }
    },
    {
      id: "cob2_1", ch: 2, ord: 1, title: "La zone VILLE", job: "Chapitre 2 · Les données", stars: 1, scene: 'terminal',
      story: "Avant d’afficher une donnée, COBOL la range dans une zone de taille fixe, décrite par sa PICTURE.",
      goal: "Déclare <code>VILLE</code> en <code>PIC X(5)</code> avec <code>VALUE \"PARIS\"</code>, puis affiche-la :<pre>PARIS</pre>",
      lesson: "<p>Dans la <code>WORKING-STORAGE SECTION</code>, un champ a un niveau (01), un nom et une <b>PICTURE</b>. <code>PIC X(5)</code> = 5 caractères de texte. <code>VALUE</code> donne la valeur de départ.</p>",
      starter: H("ZVILLE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VILLE PIC X(5) VALUE \"LYON\".\n       PROCEDURE DIVISION.\n           DISPLAY VILLE.\n           STOP RUN.\n",
      solution: H("ZVILLE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 VILLE PIC X(5) VALUE \"PARIS\".\n       PROCEDURE DIVISION.\n           DISPLAY VILLE.\n           STOP RUN.\n",
      hints: ["Change la VALUE du champ VILLE.", "VALUE \"PARIS\"."],
      tests: [{ expect: "PARIS\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare le champ avec PIC." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob2_2", ch: 2, ord: 2, title: "Les zéros de tête", job: "Chapitre 2 · Les données", stars: 1, scene: 'terminal',
      story: "Un champ numérique s’affiche toujours sur toute sa largeur, complété par des zéros devant.",
      goal: "Déclare <code>SOLDE</code> en <code>PIC 9(4)</code> avec <code>VALUE 50</code> et affiche :<pre>0050</pre>",
      lesson: "<p><code>PIC 9(4)</code> = 4 chiffres. Le nombre est cadré à droite et complété par des <b>zéros</b> à gauche : 50 devient « 0050 ».</p>",
      starter: H("ZSOLDE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 0.\n       PROCEDURE DIVISION.\n           DISPLAY SOLDE.\n           STOP RUN.\n",
      solution: H("ZSOLDE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 50.\n       PROCEDURE DIVISION.\n           DISPLAY SOLDE.\n           STOP RUN.\n",
      hints: ["Mets 50 dans la VALUE.", "VALUE 50 → s’affiche « 0050 »."],
      tests: [{ expect: "0050\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare le champ avec PIC." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob2_3", ch: 2, ord: 3, title: "Le champ trop large", job: "Chapitre 2 · Les données", stars: 1, scene: 'terminal',
      story: "Un texte plus court que sa zone est complété par des espaces à droite.",
      goal: "Déclare <code>NOM</code> en <code>PIC X(10)</code> avec <code>VALUE \"ADA\"</code> et affiche-le. La ligne fait 10 caractères (ADA puis 7 espaces) :<pre>ADA       </pre>",
      lesson: "<p>Le texte d’un <code>PIC X(n)</code> est cadré <b>à gauche</b> et complété par des espaces jusqu’à la largeur n. « ADA » dans un X(10) occupe donc 10 positions.</p>",
      starter: H("ZNOM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(3) VALUE \"ADA\".\n       PROCEDURE DIVISION.\n           DISPLAY NOM.\n           STOP RUN.\n",
      solution: H("ZNOM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(10) VALUE \"ADA\".\n       PROCEDURE DIVISION.\n           DISPLAY NOM.\n           STOP RUN.\n",
      hints: ["La zone doit faire 10 caractères de large.", "PIC X(10) VALUE \"ADA\"."],
      tests: [{ expect: "ADA       \n" }],
      rules: { mustSrc: [{ re: "X\\(10\\)", msg: "NOM doit faire 10 caractères (PIC X(10))." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob2_4", ch: 2, ord: 4, title: "Nom et matricule", job: "Chapitre 2 · Les données", stars: 1, scene: 'terminal',
      story: "Une fiche d’employé tient sur deux lignes : le nom, puis le matricule.",
      goal: "Déclare <code>NOM</code> (PIC X(8), \"ADA\") et <code>MAT</code> (PIC 9(5), 42). Affiche NOM sur une ligne, MAT sur la suivante :<pre>ADA     \n00042</pre>",
      starter: H("FICHE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(8) VALUE \"ADA\".\n       01 MAT PIC 9(5) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM.\n           STOP RUN.\n",
      solution: H("FICHE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(8) VALUE \"ADA\".\n       01 MAT PIC 9(5) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM.\n           DISPLAY MAT.\n           STOP RUN.\n",
      hints: ["Ajoute un DISPLAY pour le matricule.", "DISPLAY NOM. puis DISPLAY MAT."],
      tests: [{ expect: "ADA     \n00042\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare les champs avec PIC." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob2_5", ch: 2, ord: 5, title: "Le libellé du solde", job: "Chapitre 2 · Les données", stars: 2, scene: 'terminal',
      story: "On peut mélanger un texte en dur et un champ dans le même DISPLAY.",
      goal: "Déclare <code>SOLDE</code> (PIC 9(4), 1234) et affiche :<pre>SOLDE=1234</pre>",
      lesson: "<p>Un <code>DISPLAY</code> peut enchaîner un littéral et un champ : <code>DISPLAY \"SOLDE=\" SOLDE</code> colle le texte puis la valeur du champ.</p>",
      starter: H("LIBELLE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 1234.\n       PROCEDURE DIVISION.\n           DISPLAY \"SOLDE=\".\n           STOP RUN.\n",
      solution: H("LIBELLE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 1234.\n       PROCEDURE DIVISION.\n           DISPLAY \"SOLDE=\" SOLDE.\n           STOP RUN.\n",
      hints: ["Ajoute le champ SOLDE après le texte, dans le même DISPLAY.", "DISPLAY \"SOLDE=\" SOLDE."],
      tests: [{ expect: "SOLDE=1234\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare le champ avec PIC." }] }
    },
    {
      id: "cob2_6", ch: 2, ord: 6, title: "Carte d’identité", job: "Chapitre 2 · Les données", stars: 2, scene: 'terminal',
      story: "On rassemble un nom et un âge sur une même ligne, séparés par un espace.",
      goal: "Déclare <code>NOM</code> (PIC X(6), \"ADA\") et <code>AGE</code> (PIC 9(3), 42). Affiche-les dans un seul DISPLAY avec un espace :<pre>ADA    042</pre>",
      lesson: "<p>Combine plusieurs champs : <code>DISPLAY NOM \" \" AGE</code>. Le NOM occupe ses 6 positions (ADA + 3 espaces), puis l’espace, puis AGE sur 3 chiffres.</p>",
      starter: H("CARTE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(6) VALUE \"ADA\".\n       01 AGE PIC 9(3) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM AGE.\n           STOP RUN.\n",
      solution: H("CARTE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM PIC X(6) VALUE \"ADA\".\n       01 AGE PIC 9(3) VALUE 42.\n       PROCEDURE DIVISION.\n           DISPLAY NOM \" \" AGE.\n           STOP RUN.\n",
      hints: ["Il manque l’espace entre NOM et AGE.", "DISPLAY NOM \" \" AGE."],
      tests: [{ expect: "ADA    042\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare les champs avec PIC." }] }
    },
    {
      id: "cob2_7", ch: 2, ord: 7, title: "Le compteur à zéro", job: "Chapitre 2 · Les données", stars: 2, scene: 'terminal',
      story: "Les mots ZEROS et SPACES initialisent proprement un champ, sans compter les caractères.",
      goal: "Déclare <code>COMPTEUR</code> (PIC 9(5)) avec <code>VALUE ZEROS</code> et affiche :<pre>00000</pre>",
      lesson: "<p><code>VALUE ZEROS</code> met un champ numérique à zéro, <code>VALUE SPACES</code> met un champ texte à blanc. Pratique pour démarrer un total ou un compteur.</p>",
      starter: H("CPT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 COMPTEUR PIC 9(5) VALUE 99.\n       PROCEDURE DIVISION.\n           DISPLAY COMPTEUR.\n           STOP RUN.\n",
      solution: H("CPT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 COMPTEUR PIC 9(5) VALUE ZEROS.\n       PROCEDURE DIVISION.\n           DISPLAY COMPTEUR.\n           STOP RUN.\n",
      hints: ["Utilise le mot figuratif ZEROS.", "VALUE ZEROS."],
      tests: [{ expect: "00000\n" }],
      rules: { mustSrc: [{ re: "ZERO", msg: "Utilise VALUE ZEROS." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob2_8", ch: 2, ord: 8, title: "Deux montants", job: "Chapitre 2 · Les données", stars: 2, scene: 'terminal',
      story: "Le bilan du jour tient deux nombres : les entrées et les sorties de caisse.",
      goal: "Déclare <code>ENTREES</code> (PIC 9(6), 1250) et <code>SORTIES</code> (PIC 9(6), 300). Affiche-les séparés par \" / \" :<pre>001250 / 000300</pre>",
      starter: H("BILAN") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 ENTREES PIC 9(6) VALUE 1250.\n       01 SORTIES PIC 9(6) VALUE 300.\n       PROCEDURE DIVISION.\n           DISPLAY ENTREES.\n           STOP RUN.\n",
      solution: H("BILAN") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 ENTREES PIC 9(6) VALUE 1250.\n       01 SORTIES PIC 9(6) VALUE 300.\n       PROCEDURE DIVISION.\n           DISPLAY ENTREES \" / \" SORTIES.\n           STOP RUN.\n",
      hints: ["Mets les deux champs et le séparateur dans un seul DISPLAY.", "DISPLAY ENTREES \" / \" SORTIES."],
      tests: [{ expect: "001250 / 000300\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare les champs avec PIC." }] }
    },
    {
      id: "cob2_9", ch: 2, ord: 9, title: "La fiche complète", job: "Chapitre 2 · Les données", stars: 2, scene: 'terminal',
      story: "Contrat de fin de chapitre : une fiche client sur une seule ligne, nom, âge et ville.",
      goal: "Déclare <code>NOM</code> (PIC X(10), \"ADA\"), <code>AGE</code> (PIC 9(3), 42) et <code>VILLE</code> (PIC X(5), \"PARIS\"). Affiche :<pre>ADA        042 PARIS</pre>",
      starter: H("CLIENT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM   PIC X(10) VALUE \"ADA\".\n       01 AGE   PIC 9(3) VALUE 42.\n       01 VILLE PIC X(5) VALUE \"PARIS\".\n       PROCEDURE DIVISION.\n           DISPLAY NOM \" \" AGE.\n           STOP RUN.\n",
      solution: H("CLIENT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOM   PIC X(10) VALUE \"ADA\".\n       01 AGE   PIC 9(3) VALUE 42.\n       01 VILLE PIC X(5) VALUE \"PARIS\".\n       PROCEDURE DIVISION.\n           DISPLAY NOM \" \" AGE \" \" VILLE.\n           STOP RUN.\n",
      hints: ["Il manque la ville à la fin de la ligne.", "DISPLAY NOM \" \" AGE \" \" VILLE."],
      tests: [{ expect: "ADA        042 PARIS\n" }],
      rules: { mustSrc: [{ re: "PIC", msg: "Déclare les champs avec PIC." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_1", ch: 3, ord: 1, title: "Déplacer un texte", job: "Chapitre 3 · MOVE", stars: 1, scene: 'terminal',
      story: "MOVE copie une valeur dans un champ. On prépare d’abord la zone, puis on y range le texte.",
      goal: "Range (avec <code>MOVE</code>) le texte \"OUVERT\" dans <code>ETAT</code> (PIC X(6)) puis affiche :<pre>OUVERT</pre>",
      lesson: "<p><code>MOVE source TO destination</code> copie la source dans la destination. La source peut être un littéral : <code>MOVE \"OUVERT\" TO ETAT</code>.</p>",
      starter: H("MVTEXTE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 ETAT PIC X(6).\n       PROCEDURE DIVISION.\n           MOVE \"FERME\" TO ETAT.\n           DISPLAY ETAT.\n           STOP RUN.\n",
      solution: H("MVTEXTE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 ETAT PIC X(6).\n       PROCEDURE DIVISION.\n           MOVE \"OUVERT\" TO ETAT.\n           DISPLAY ETAT.\n           STOP RUN.\n",
      hints: ["Change le texte déplacé dans ETAT.", "MOVE \"OUVERT\" TO ETAT."],
      tests: [{ expect: "OUVERT\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_2", ch: 3, ord: 2, title: "D’un champ à l’autre", job: "Chapitre 3 · MOVE", stars: 2, scene: 'terminal',
      story: "On recopie la valeur d’un champ dans un autre. La source garde sa valeur.",
      goal: "Copie <code>SOURCE</code> (\"ADA\", PIC X(6)) dans <code>COPIE</code> (PIC X(6)) et affiche <code>COPIE</code> :<pre>ADA   </pre>",
      lesson: "<p>La source d’un <code>MOVE</code> peut aussi être un champ : <code>MOVE SOURCE TO COPIE</code> recopie le contenu de SOURCE dans COPIE.</p>",
      starter: H("MVCHAMP") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOURCE PIC X(6) VALUE \"ADA\".\n       01 COPIE  PIC X(6).\n       PROCEDURE DIVISION.\n           DISPLAY COPIE.\n           STOP RUN.\n",
      solution: H("MVCHAMP") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOURCE PIC X(6) VALUE \"ADA\".\n       01 COPIE  PIC X(6).\n       PROCEDURE DIVISION.\n           MOVE SOURCE TO COPIE.\n           DISPLAY COPIE.\n           STOP RUN.\n",
      hints: ["COPIE est vide tant que tu n’as rien déplacé dedans.", "MOVE SOURCE TO COPIE."],
      tests: [{ expect: "ADA   \n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_3", ch: 3, ord: 3, title: "Déplacer un nombre", job: "Chapitre 3 · MOVE", stars: 2, scene: 'terminal',
      story: "On range un nombre dans un champ numérique, qui garde ses zéros de tête.",
      goal: "Déplace le nombre 7 dans <code>NUM</code> (PIC 9(4)) et affiche :<pre>0007</pre>",
      starter: H("MVNUM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NUM PIC 9(4).\n       PROCEDURE DIVISION.\n           MOVE 1 TO NUM.\n           DISPLAY NUM.\n           STOP RUN.\n",
      solution: H("MVNUM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NUM PIC 9(4).\n       PROCEDURE DIVISION.\n           MOVE 7 TO NUM.\n           DISPLAY NUM.\n           STOP RUN.\n",
      hints: ["Déplace le bon nombre.", "MOVE 7 TO NUM."],
      tests: [{ expect: "0007\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_4", ch: 3, ord: 4, title: "Zéros supprimés", job: "Chapitre 3 · MOVE", stars: 2, scene: 'terminal',
      story: "Un champ ÉDITÉ met en forme automatiquement ce qu’on y déplace : le Z remplace les zéros de tête par des espaces.",
      goal: "Déplace <code>SOLDE</code> (PIC 9(4), 42) dans <code>AFF</code> (PIC ZZZ9) et affiche :<pre>  42</pre>",
      lesson: "<p>Un champ <b>édité</b> sert à l’affichage. <code>Z</code> = un chiffre dont les zéros de tête deviennent des espaces. <code>PIC ZZZ9</code> affiche 42 comme «   42 » (deux espaces, puis 42).</p>",
      starter: H("EDZ") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 42.\n       01 AFF   PIC 9(4).\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("EDZ") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 42.\n       01 AFF   PIC ZZZ9.\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["AFF doit être un champ ÉDITÉ avec des Z.", "Donne à AFF la PIC ZZZ9."],
      tests: [{ expect: "  42\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }, { re: "Z", msg: "Le champ édité utilise des Z." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_5", ch: 3, ord: 5, title: "Le séparateur de milliers", job: "Chapitre 3 · MOVE", stars: 2, scene: 'terminal',
      story: "Les grands nombres se lisent mieux avec une virgule tous les trois chiffres.",
      goal: "Déplace <code>MONTANT</code> (PIC 9(6), 12345) dans <code>AFF</code> (PIC ZZ,ZZ9) et affiche :<pre>12,345</pre>",
      lesson: "<p>Dans une PICTURE éditée, la <code>,</code> insère un séparateur de milliers. <code>PIC ZZ,ZZ9</code> affiche 12345 comme « 12,345 ».</p>",
      starter: H("EDVIRG") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(6) VALUE 12345.\n       01 AFF     PIC 9(6).\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("EDVIRG") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(6) VALUE 12345.\n       01 AFF     PIC ZZ,ZZ9.\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["Ajoute une virgule dans la PICTURE de AFF.", "PIC ZZ,ZZ9."],
      tests: [{ expect: "12,345\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_6", ch: 3, ord: 6, title: "Le signe dollar", job: "Chapitre 3 · MOVE", stars: 2, scene: 'terminal',
      story: "Les relevés affichent un symbole monétaire devant le montant.",
      goal: "Déplace <code>MONTANT</code> (PIC 9(5), 250) dans <code>AFF</code> (PIC $ZZ,ZZ9) et affiche :<pre>$   250</pre>",
      lesson: "<p>Le <code>$</code> en tête d’une PICTURE éditée affiche le symbole monétaire. Avec des Z, les zéros de tête restent des espaces : <code>$ZZ,ZZ9</code>.</p>",
      starter: H("EDDOLLAR") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5) VALUE 250.\n       01 AFF     PIC ZZ,ZZ9.\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("EDDOLLAR") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5) VALUE 250.\n       01 AFF     PIC $ZZ,ZZ9.\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["Mets un $ au début de la PICTURE de AFF.", "PIC $ZZ,ZZ9."],
      tests: [{ expect: "$   250\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }, { re: "\\$", msg: "Ajoute le signe $ dans la PICTURE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_7", ch: 3, ord: 7, title: "Les centimes", job: "Chapitre 3 · MOVE", stars: 3, scene: 'terminal',
      story: "Un montant d’argent a une partie entière et des centimes, séparés par un point.",
      goal: "Déplace <code>PRIX</code> (PIC 9(3)V99, 7.50) dans <code>AFF</code> (PIC ZZ9.99) et affiche :<pre>  7.50</pre>",
      lesson: "<p><code>V</code> marque la virgule <b>implicite</b> (invisible) d’un champ stocké. Le <code>.</code> d’un champ édité affiche un vrai point décimal. <code>PIC 9(3)V99</code> stocke 7.50 ; <code>PIC ZZ9.99</code> l’affiche « &nbsp;&nbsp;7.50 ».</p>",
      starter: H("EDCENT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX PIC 9(3)V99 VALUE 7.50.\n       01 AFF  PIC ZZ9.\n       PROCEDURE DIVISION.\n           MOVE PRIX TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("EDCENT") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX PIC 9(3)V99 VALUE 7.50.\n       01 AFF  PIC ZZ9.99.\n       PROCEDURE DIVISION.\n           MOVE PRIX TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["AFF doit garder les centimes : ajoute .99 à sa PICTURE.", "PIC ZZ9.99."],
      tests: [{ expect: "  7.50\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_8", ch: 3, ord: 8, title: "Le chèque", job: "Chapitre 3 · MOVE", stars: 3, scene: 'terminal',
      story: "Sur un chèque, le montant est précédé du symbole monétaire et garde ses centimes.",
      goal: "Déplace <code>MONTANT</code> (PIC 9(5)V99, 1234.05) dans <code>AFF</code> (PIC $ZZ,ZZ9.99) et affiche :<pre>$ 1,234.05</pre>",
      starter: H("CHEQUE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5)V99 VALUE 1234.05.\n       01 AFF     PIC ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("CHEQUE") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5)V99 VALUE 1234.05.\n       01 AFF     PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           MOVE MONTANT TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["Il manque le $ devant le montant du chèque.", "PIC $ZZ,ZZ9.99."],
      tests: [{ expect: "$  1,234.05\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }, { re: "\\$", msg: "Ajoute le signe $ dans la PICTURE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob3_9", ch: 3, ord: 9, title: "Le relevé de fin de mois", job: "Chapitre 3 · MOVE", stars: 3, scene: 'terminal',
      story: "Contrat de fin de chapitre : mettre en forme le solde d’un compte comme sur un vrai relevé bancaire.",
      goal: "Déplace <code>SOLDE</code> (PIC 9(6)V99, 48250.70) dans <code>AFF</code> (PIC $ZZZ,ZZ9.99) et affiche :<pre>$ 48,250.70</pre>",
      starter: H("RELMOIS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6)V99 VALUE 48250.70.\n       01 AFF   PIC 9(6).\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("RELMOIS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6)V99 VALUE 48250.70.\n       01 AFF   PIC $ZZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           MOVE SOLDE TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["AFF doit être un champ édité avec $, virgule et centimes.", "PIC $ZZZ,ZZ9.99."],
      tests: [{ expect: "$  48,250.70\n" }],
      rules: { mustSrc: [{ re: "MOVE", msg: "Utilise MOVE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_1", ch: 4, ord: 1, title: "Additionner au total", job: "Chapitre 4 · Calculs", stars: 2, scene: 'terminal',
      story: "La caisse ajoute un versement au total du jour. ADD … TO ajoute dans un champ.",
      goal: "Ajoute 30 au <code>TOTAL</code> (PIC 9(4), déjà à 100) et affiche :<pre>0130</pre>",
      lesson: "<p><code>ADD valeur TO champ</code> ajoute la valeur au champ (le champ est modifié). <code>ADD 30 TO TOTAL</code> ajoute 30 à TOTAL.</p>",
      starter: H("ADD1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 TOTAL PIC 9(4) VALUE 100.\n       PROCEDURE DIVISION.\n           ADD 10 TO TOTAL.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      solution: H("ADD1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 TOTAL PIC 9(4) VALUE 100.\n       PROCEDURE DIVISION.\n           ADD 30 TO TOTAL.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      hints: ["Ajoute la bonne somme.", "ADD 30 TO TOTAL."],
      tests: [{ expect: "0130\n" }],
      rules: { mustSrc: [{ re: "ADD", msg: "Utilise ADD." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_2", ch: 4, ord: 2, title: "Le retrait", job: "Chapitre 4 · Calculs", stars: 2, scene: 'terminal',
      story: "Un retrait diminue le solde. SUBTRACT … FROM retire d’un champ.",
      goal: "Retire 40 du <code>SOLDE</code> (PIC 9(4), 200) et affiche :<pre>0160</pre>",
      lesson: "<p><code>SUBTRACT valeur FROM champ</code> retire la valeur du champ. <code>SUBTRACT 40 FROM SOLDE</code> enlève 40 à SOLDE.</p>",
      starter: H("SUB1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 200.\n       PROCEDURE DIVISION.\n           SUBTRACT 10 FROM SOLDE.\n           DISPLAY SOLDE.\n           STOP RUN.\n",
      solution: H("SUB1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(4) VALUE 200.\n       PROCEDURE DIVISION.\n           SUBTRACT 40 FROM SOLDE.\n           DISPLAY SOLDE.\n           STOP RUN.\n",
      hints: ["Retire le bon montant.", "SUBTRACT 40 FROM SOLDE."],
      tests: [{ expect: "0160\n" }],
      rules: { mustSrc: [{ re: "SUBTRACT", msg: "Utilise SUBTRACT." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_3", ch: 4, ord: 3, title: "Le lot d’articles", job: "Chapitre 4 · Calculs", stars: 2, scene: 'terminal',
      story: "Un lot contient plusieurs fois le même article. MULTIPLY … BY multiplie un champ.",
      goal: "Multiplie <code>QUANTITE</code> (PIC 9(4), 12) par 4 et affiche le résultat (QUANTITE modifié) :<pre>0048</pre>",
      lesson: "<p><code>MULTIPLY n BY champ</code> multiplie le champ par n. On peut aussi écrire <code>MULTIPLY a BY b GIVING c</code> pour ranger le produit ailleurs.</p>",
      starter: H("MUL1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 QUANTITE PIC 9(4) VALUE 12.\n       PROCEDURE DIVISION.\n           MULTIPLY 2 BY QUANTITE.\n           DISPLAY QUANTITE.\n           STOP RUN.\n",
      solution: H("MUL1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 QUANTITE PIC 9(4) VALUE 12.\n       PROCEDURE DIVISION.\n           MULTIPLY 4 BY QUANTITE.\n           DISPLAY QUANTITE.\n           STOP RUN.\n",
      hints: ["Multiplie par le bon facteur.", "MULTIPLY 4 BY QUANTITE."],
      tests: [{ expect: "0048\n" }],
      rules: { mustSrc: [{ re: "MULTIPLY", msg: "Utilise MULTIPLY." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_4", ch: 4, ord: 4, title: "Le partage équitable", job: "Chapitre 4 · Calculs", stars: 2, scene: 'terminal',
      story: "On partage une cagnotte entre plusieurs personnes. DIVIDE … GIVING range le quotient.",
      goal: "Divise <code>CAGNOTTE</code> (PIC 9(5), 1000) par 4 et range le résultat dans <code>PART</code> (PIC 9(5)). Affiche PART :<pre>00250</pre>",
      lesson: "<p><code>DIVIDE a BY b GIVING c</code> range dans c le quotient de a divisé par b. Ici <code>DIVIDE CAGNOTTE BY 4 GIVING PART</code>.</p>",
      starter: H("DIV1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAGNOTTE PIC 9(5) VALUE 1000.\n       01 PART     PIC 9(5).\n       PROCEDURE DIVISION.\n           DIVIDE CAGNOTTE BY 2 GIVING PART.\n           DISPLAY PART.\n           STOP RUN.\n",
      solution: H("DIV1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAGNOTTE PIC 9(5) VALUE 1000.\n       01 PART     PIC 9(5).\n       PROCEDURE DIVISION.\n           DIVIDE CAGNOTTE BY 4 GIVING PART.\n           DISPLAY PART.\n           STOP RUN.\n",
      hints: ["Partage entre 4 personnes, pas 2.", "DIVIDE CAGNOTTE BY 4 GIVING PART."],
      tests: [{ expect: "00250\n" }],
      rules: { mustSrc: [{ re: "DIVIDE", msg: "Utilise DIVIDE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_5", ch: 4, ord: 5, title: "Le reste de la division", job: "Chapitre 4 · Calculs", stars: 3, scene: 'terminal',
      story: "En partageant 1000 par 3, il reste quelque chose. REMAINDER récupère ce reste.",
      goal: "Divise <code>CAGNOTTE</code> (PIC 9(5), 1000) par 3, quotient dans <code>PART</code> (PIC 9(5)) et reste dans <code>RESTE</code> (PIC 9(5)). Affiche :<pre>00333 reste 00001</pre>",
      lesson: "<p><code>DIVIDE a BY b GIVING q REMAINDER r</code> range le quotient dans q et le reste dans r. 1000 ÷ 3 = 333, reste 1.</p>",
      starter: H("DIVREM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAGNOTTE PIC 9(5) VALUE 1000.\n       01 PART     PIC 9(5).\n       01 RESTE    PIC 9(5).\n       PROCEDURE DIVISION.\n           DIVIDE CAGNOTTE BY 3 GIVING PART.\n           DISPLAY PART \" reste \" RESTE.\n           STOP RUN.\n",
      solution: H("DIVREM") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CAGNOTTE PIC 9(5) VALUE 1000.\n       01 PART     PIC 9(5).\n       01 RESTE    PIC 9(5).\n       PROCEDURE DIVISION.\n           DIVIDE CAGNOTTE BY 3 GIVING PART REMAINDER RESTE.\n           DISPLAY PART \" reste \" RESTE.\n           STOP RUN.\n",
      hints: ["Sans REMAINDER, le reste n’est jamais calculé.", "DIVIDE CAGNOTTE BY 3 GIVING PART REMAINDER RESTE."],
      tests: [{ expect: "00333 reste 00001\n" }],
      rules: { mustSrc: [{ re: "REMAINDER", msg: "Récupère le reste avec REMAINDER." }] }
    },
    {
      id: "cob4_6", ch: 4, ord: 6, title: "Le total avec COMPUTE", job: "Chapitre 4 · Calculs", stars: 3, scene: 'terminal',
      story: "COMPUTE écrit un calcul comme en maths. Le panier contient 3 articles à 20.",
      goal: "Avec <code>COMPUTE</code>, calcule <code>TOTAL</code> = PRIX × QTE (PRIX=20, QTE=3, PIC 9(5)) et affiche :<pre>00060</pre>",
      lesson: "<p><code>COMPUTE cible = expression</code> accepte <code>+ - * /</code> et des parenthèses. <code>COMPUTE TOTAL = PRIX * QTE</code>.</p>",
      starter: H("COMP1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX  PIC 9(5) VALUE 20.\n       01 QTE   PIC 9(5) VALUE 3.\n       01 TOTAL PIC 9(5).\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      solution: H("COMP1") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX  PIC 9(5) VALUE 20.\n       01 QTE   PIC 9(5) VALUE 3.\n       01 TOTAL PIC 9(5).\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX * QTE.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      hints: ["Il faut multiplier le prix par la quantité.", "COMPUTE TOTAL = PRIX * QTE."],
      tests: [{ expect: "00060\n" }],
      rules: { mustSrc: [{ re: "COMPUTE", msg: "Calcule avec COMPUTE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_7", ch: 4, ord: 7, title: "Les parenthèses comptent", job: "Chapitre 4 · Calculs", stars: 3, scene: 'terminal',
      story: "La TVA s’applique à la somme des articles. L’ordre des opérations change le résultat.",
      goal: "Calcule <code>TOTAL</code> = (A + B) × 2 (A=30, B=20, PIC 9(5)) et affiche :<pre>00100</pre>",
      lesson: "<p>La multiplication passe avant l’addition. Pour additionner d’abord, mets des parenthèses : <code>COMPUTE TOTAL = (A + B) * 2</code>.</p>",
      starter: H("COMP2") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 A     PIC 9(5) VALUE 30.\n       01 B     PIC 9(5) VALUE 20.\n       01 TOTAL PIC 9(5).\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = A + B * 2.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      solution: H("COMP2") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 A     PIC 9(5) VALUE 30.\n       01 B     PIC 9(5) VALUE 20.\n       01 TOTAL PIC 9(5).\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = (A + B) * 2.\n           DISPLAY TOTAL.\n           STOP RUN.\n",
      hints: ["Sans parenthèses, B est multiplié par 2 avant l’addition.", "COMPUTE TOTAL = (A + B) * 2."],
      tests: [{ expect: "00100\n" }],
      rules: { mustSrc: [{ re: "COMPUTE", msg: "Calcule avec COMPUTE." }, { re: "\\(", msg: "Utilise des parenthèses." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_8", ch: 4, ord: 8, title: "La TVA", job: "Chapitre 4 · Calculs", stars: 4, scene: 'terminal',
      story: "On applique 20 % de TVA à un montant hors taxes, puis on affiche le montant TTC comme sur une facture.",
      goal: "Calcule <code>TTC</code> = HT × 1.20 (HT=50.00, PIC 9(5)V99) et affiche via <code>$ZZ,ZZ9.99</code> :<pre>$    60.00</pre>",
      lesson: "<p>COMPUTE gère les décimales des champs <code>V99</code>. On calcule dans un champ monétaire, puis on le déplace dans un champ édité pour l’afficher.</p>",
      starter: H("TVA") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HT  PIC 9(5)V99 VALUE 50.00.\n       01 TTC PIC 9(5)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TTC = HT.\n           MOVE TTC TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("TVA") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 HT  PIC 9(5)V99 VALUE 50.00.\n       01 TTC PIC 9(5)V99.\n       01 AFF PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TTC = HT * 1.20.\n           MOVE TTC TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["Applique les 20 % : multiplie par 1.20.", "COMPUTE TTC = HT * 1.20."],
      tests: [{ expect: "$    60.00\n" }],
      rules: { mustSrc: [{ re: "COMPUTE", msg: "Calcule avec COMPUTE." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob4_9", ch: 4, ord: 9, title: "Le ticket de caisse", job: "Chapitre 4 · Calculs", stars: 4, scene: 'terminal',
      story: "Contrat de fin de chapitre : calculer un total de caisse, articles × prix moins une remise, et l’éditer.",
      goal: "Calcule <code>TOTAL</code> = PRIX × QTE − REMISE (PRIX=9.99, QTE=5, REMISE=4.95, PIC 9(5)V99) et affiche via <code>$ZZ,ZZ9.99</code> :<pre>$    45.00</pre>",
      starter: H("TICKET") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX   PIC 9(5)V99 VALUE 9.99.\n       01 QTE    PIC 9(3) VALUE 5.\n       01 REMISE PIC 9(5)V99 VALUE 4.95.\n       01 TOTAL  PIC 9(5)V99.\n       01 AFF    PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX * QTE.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      solution: H("TICKET") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 PRIX   PIC 9(5)V99 VALUE 9.99.\n       01 QTE    PIC 9(3) VALUE 5.\n       01 REMISE PIC 9(5)V99 VALUE 4.95.\n       01 TOTAL  PIC 9(5)V99.\n       01 AFF    PIC $ZZ,ZZ9.99.\n       PROCEDURE DIVISION.\n           COMPUTE TOTAL = PRIX * QTE - REMISE.\n           MOVE TOTAL TO AFF.\n           DISPLAY AFF.\n           STOP RUN.\n",
      hints: ["La remise n’est pas encore enlevée du calcul.", "COMPUTE TOTAL = PRIX * QTE - REMISE."],
      tests: [{ expect: "$    45.00\n" }],
      rules: { mustSrc: [{ re: "COMPUTE|MULTIPLY", msg: "Calcule le total." }], forbidSrc: [{ re: "DISPLAY\\s+\"", msg: "Affiche le champ, pas un texte écrit en dur." }] }
    },
    {
      id: "cob5_1", ch: 5, ord: 1, title: "Le seuil de découvert", job: "Chapitre 5 · Décisions", stars: 2, scene: 'terminal',
      story: "La banque signale les comptes dans le rouge. On lit un solde et on décide s’il faut alerter.",
      goal: "Lis un solde avec <code>ACCEPT</code>. S’il est inférieur à 0… ici on teste l’inverse : si <code>SOLDE</code> &gt; 100, affiche <pre>OK</pre>sinon rien. Testé avec plusieurs soldes.",
      lesson: "<p><code>ACCEPT champ</code> lit une ligne de l’entrée. <code>IF condition … END-IF</code> exécute un bloc seulement si la condition est vraie.</p><pre>IF SOLDE > 100\n    DISPLAY \"OK\"\nEND-IF.</pre>",
      starter: H("SEUIL") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(5).\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           IF SOLDE > 999999\n               DISPLAY \"OK\"\n           END-IF.\n           STOP RUN.\n",
      solution: H("SEUIL") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(5).\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           IF SOLDE > 100\n               DISPLAY \"OK\"\n           END-IF.\n           STOP RUN.\n",
      hints: ["Compare SOLDE à 100.", "IF SOLDE > 100 … END-IF."],
      tests: [{ stdin: "500\n", expect: "OK\n" }, { stdin: "50\n", expect: "" }, { stdin: "101\n", expect: "OK\n" }],
      rules: { mustSrc: [{ re: "\\bIF\\b", msg: "Décide avec IF." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_2", ch: 5, ord: 2, title: "Majeur ou mineur", job: "Chapitre 5 · Décisions", stars: 2, scene: 'terminal',
      story: "Pour ouvrir un compte, le client doit être majeur. On répond dans tous les cas.",
      goal: "Lis <code>AGE</code> avec ACCEPT. Si AGE &gt;= 18 affiche <pre>MAJEUR</pre>sinon <pre>MINEUR</pre>Testé avec plusieurs âges.",
      lesson: "<p><code>IF condition … ELSE … END-IF</code> : la branche ELSE s’exécute quand la condition est fausse. <code>&gt;=</code> signifie « supérieur ou égal ».</p>",
      starter: H("MAJEUR") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 AGE PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT AGE.\n           IF AGE >= 18\n               DISPLAY \"MAJEUR\"\n           END-IF.\n           STOP RUN.\n",
      solution: H("MAJEUR") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 AGE PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT AGE.\n           IF AGE >= 18\n               DISPLAY \"MAJEUR\"\n           ELSE\n               DISPLAY \"MINEUR\"\n           END-IF.\n           STOP RUN.\n",
      hints: ["Il manque le cas où l’âge est inférieur à 18.", "Ajoute ELSE DISPLAY \"MINEUR\"."],
      tests: [{ stdin: "20\n", expect: "MAJEUR\n" }, { stdin: "17\n", expect: "MINEUR\n" }, { stdin: "18\n", expect: "MAJEUR\n" }],
      rules: { mustSrc: [{ re: "ELSE", msg: "Traite les deux cas avec ELSE." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_3", ch: 5, ord: 3, title: "Le plafond de retrait", job: "Chapitre 5 · Décisions", stars: 3, scene: 'terminal',
      story: "Un distributeur refuse les retraits supérieurs à 300. Égal à 300, c’est accepté.",
      goal: "Lis <code>MONTANT</code> avec ACCEPT. Si MONTANT &lt;= 300 affiche <pre>ACCEPTE</pre>sinon <pre>REFUSE</pre>Testé avec plusieurs montants.",
      lesson: "<p>Les comparaisons : <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>=</code>. <code>MONTANT &lt;= 300</code> est vrai jusqu’à 300 inclus.</p>",
      starter: H("PLAFOND") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5).\n       PROCEDURE DIVISION.\n           ACCEPT MONTANT.\n           IF MONTANT < 300\n               DISPLAY \"ACCEPTE\"\n           ELSE\n               DISPLAY \"REFUSE\"\n           END-IF.\n           STOP RUN.\n",
      solution: H("PLAFOND") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 MONTANT PIC 9(5).\n       PROCEDURE DIVISION.\n           ACCEPT MONTANT.\n           IF MONTANT <= 300\n               DISPLAY \"ACCEPTE\"\n           ELSE\n               DISPLAY \"REFUSE\"\n           END-IF.\n           STOP RUN.\n",
      hints: ["300 pile doit être accepté : utilise <=.", "IF MONTANT <= 300 …"],
      tests: [{ stdin: "300\n", expect: "ACCEPTE\n" }, { stdin: "301\n", expect: "REFUSE\n" }, { stdin: "100\n", expect: "ACCEPTE\n" }],
      rules: { mustSrc: [{ re: "<=", msg: "Utilise la comparaison <=." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_4", ch: 5, ord: 4, title: "Les trois mentions", job: "Chapitre 5 · Décisions", stars: 3, scene: 'terminal',
      story: "Selon la note de l’examen de fin de formation, on décerne une mention.",
      goal: "Lis <code>NOTE</code> avec ACCEPT. &lt; 10 → <pre>ECHEC</pre>&lt; 14 → <pre>PASSABLE</pre>sinon → <pre>BIEN</pre>Testé avec plusieurs notes.",
      lesson: "<p>On enchaîne les cas avec des <code>IF … ELSE</code> imbriqués : si la première condition est fausse, on teste la suivante dans le ELSE.</p>",
      starter: H("MENTION") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT NOTE.\n           IF NOTE < 10\n               DISPLAY \"ECHEC\"\n           ELSE\n               DISPLAY \"BIEN\"\n           END-IF.\n           STOP RUN.\n",
      solution: H("MENTION") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 NOTE PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT NOTE.\n           IF NOTE < 10\n               DISPLAY \"ECHEC\"\n           ELSE\n               IF NOTE < 14\n                   DISPLAY \"PASSABLE\"\n               ELSE\n                   DISPLAY \"BIEN\"\n               END-IF\n           END-IF.\n           STOP RUN.\n",
      hints: ["Il manque le cas intermédiaire PASSABLE.", "Dans le ELSE, ajoute un IF NOTE < 14 … ELSE …"],
      tests: [{ stdin: "8\n", expect: "ECHEC\n" }, { stdin: "12\n", expect: "PASSABLE\n" }, { stdin: "16\n", expect: "BIEN\n" }, { stdin: "14\n", expect: "BIEN\n" }],
      rules: { mustSrc: [{ re: "PASSABLE", msg: "Ajoute le cas PASSABLE." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_5", ch: 5, ord: 5, title: "Le feu vert du prêt", job: "Chapitre 5 · Décisions", stars: 3, scene: 'terminal',
      story: "Un prêt n’est accordé que si DEUX conditions sont réunies : des revenus suffisants ET pas d’incident.",
      goal: "Lis <code>REVENU</code> puis <code>INCIDENTS</code> (ACCEPT). Si REVENU &gt;= 2000 <b>ET</b> INCIDENTS = 0 affiche <pre>ACCORDE</pre>sinon <pre>REFUSE</pre>Testé avec plusieurs cas.",
      lesson: "<p>On combine des conditions avec <code>AND</code> (les deux vraies) et <code>OR</code> (au moins une). <code>IF REVENU &gt;= 2000 AND INCIDENTS = 0</code>.</p>",
      starter: H("PRET") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REVENU    PIC 9(6).\n       01 INCIDENTS PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT REVENU.\n           ACCEPT INCIDENTS.\n           IF REVENU >= 2000\n               DISPLAY \"ACCORDE\"\n           ELSE\n               DISPLAY \"REFUSE\"\n           END-IF.\n           STOP RUN.\n",
      solution: H("PRET") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 REVENU    PIC 9(6).\n       01 INCIDENTS PIC 9(3).\n       PROCEDURE DIVISION.\n           ACCEPT REVENU.\n           ACCEPT INCIDENTS.\n           IF REVENU >= 2000 AND INCIDENTS = 0\n               DISPLAY \"ACCORDE\"\n           ELSE\n               DISPLAY \"REFUSE\"\n           END-IF.\n           STOP RUN.\n",
      hints: ["La condition sur les incidents manque.", "IF REVENU >= 2000 AND INCIDENTS = 0 …"],
      tests: [{ stdin: "3000\n0\n", expect: "ACCORDE\n" }, { stdin: "3000\n2\n", expect: "REFUSE\n" }, { stdin: "1500\n0\n", expect: "REFUSE\n" }],
      rules: { mustSrc: [{ re: "\\bAND\\b", msg: "Combine les conditions avec AND." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_6", ch: 5, ord: 6, title: "Le menu du guichet", job: "Chapitre 5 · Décisions", stars: 3, scene: 'terminal',
      story: "EVALUATE est le « switch » de COBOL : il choisit une branche selon une valeur.",
      goal: "Lis <code>CHOIX</code> (ACCEPT). 1 → <pre>RETRAIT</pre>2 → <pre>DEPOT</pre>3 → <pre>SOLDE</pre>Testé avec plusieurs choix.",
      lesson: "<p><code>EVALUATE valeur … WHEN n … END-EVALUATE</code> compare la valeur à chaque <code>WHEN</code> et exécute la branche qui correspond.</p><pre>EVALUATE CHOIX\n    WHEN 1 DISPLAY \"RETRAIT\"\n    WHEN 2 DISPLAY \"DEPOT\"\nEND-EVALUATE.</pre>",
      starter: H("GMENU") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CHOIX PIC 9(1).\n       PROCEDURE DIVISION.\n           ACCEPT CHOIX.\n           EVALUATE CHOIX\n               WHEN 1 DISPLAY \"RETRAIT\"\n               WHEN 2 DISPLAY \"DEPOT\"\n           END-EVALUATE.\n           STOP RUN.\n",
      solution: H("GMENU") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CHOIX PIC 9(1).\n       PROCEDURE DIVISION.\n           ACCEPT CHOIX.\n           EVALUATE CHOIX\n               WHEN 1 DISPLAY \"RETRAIT\"\n               WHEN 2 DISPLAY \"DEPOT\"\n               WHEN 3 DISPLAY \"SOLDE\"\n           END-EVALUATE.\n           STOP RUN.\n",
      hints: ["Il manque la branche du choix 3.", "WHEN 3 DISPLAY \"SOLDE\"."],
      tests: [{ stdin: "1\n", expect: "RETRAIT\n" }, { stdin: "2\n", expect: "DEPOT\n" }, { stdin: "3\n", expect: "SOLDE\n" }],
      rules: { mustSrc: [{ re: "EVALUATE", msg: "Choisis avec EVALUATE." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_7", ch: 5, ord: 7, title: "Le code pays", job: "Chapitre 5 · Décisions", stars: 4, scene: 'terminal',
      story: "Un code chiffre le pays d’une agence. Tout code inconnu doit tomber sur un cas par défaut.",
      goal: "Lis <code>CODE</code> (ACCEPT). 1 → <pre>FRANCE</pre>2 → <pre>BELGIQUE</pre>autre → <pre>INCONNU</pre>Testé avec plusieurs codes.",
      lesson: "<p><code>WHEN OTHER</code> attrape tous les cas non prévus. Place-le en dernier dans l’EVALUATE.</p>",
      starter: H("PAYS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CODE PIC 9(2).\n       PROCEDURE DIVISION.\n           ACCEPT CODE.\n           EVALUATE CODE\n               WHEN 1 DISPLAY \"FRANCE\"\n               WHEN 2 DISPLAY \"BELGIQUE\"\n           END-EVALUATE.\n           STOP RUN.\n",
      solution: H("PAYS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 CODE PIC 9(2).\n       PROCEDURE DIVISION.\n           ACCEPT CODE.\n           EVALUATE CODE\n               WHEN 1 DISPLAY \"FRANCE\"\n               WHEN 2 DISPLAY \"BELGIQUE\"\n               WHEN OTHER DISPLAY \"INCONNU\"\n           END-EVALUATE.\n           STOP RUN.\n",
      hints: ["Ajoute un cas par défaut.", "WHEN OTHER DISPLAY \"INCONNU\"."],
      tests: [{ stdin: "1\n", expect: "FRANCE\n" }, { stdin: "2\n", expect: "BELGIQUE\n" }, { stdin: "9\n", expect: "INCONNU\n" }, { stdin: "7\n", expect: "INCONNU\n" }],
      rules: { mustSrc: [{ re: "OTHER", msg: "Prévois WHEN OTHER." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_8", ch: 5, ord: 8, title: "Les tranches de livraison", job: "Chapitre 5 · Décisions", stars: 4, scene: 'terminal',
      story: "Les frais de port dépendent du poids du colis. EVALUATE TRUE teste des conditions, pas une seule valeur.",
      goal: "Lis <code>POIDS</code> (ACCEPT). &lt; 1000 → <pre>PETIT</pre>&lt; 5000 → <pre>MOYEN</pre>sinon → <pre>GROS</pre>Testé avec plusieurs poids.",
      lesson: "<p><code>EVALUATE TRUE</code> permet d’écrire une condition complète derrière chaque <code>WHEN</code> : la première vraie gagne.</p><pre>EVALUATE TRUE\n    WHEN POIDS < 1000 DISPLAY \"PETIT\"\n    WHEN POIDS < 5000 DISPLAY \"MOYEN\"\n    WHEN OTHER DISPLAY \"GROS\"\nEND-EVALUATE.</pre>",
      starter: H("COLIS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 POIDS PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT POIDS.\n           EVALUATE TRUE\n               WHEN POIDS < 1000 DISPLAY \"PETIT\"\n               WHEN OTHER DISPLAY \"GROS\"\n           END-EVALUATE.\n           STOP RUN.\n",
      solution: H("COLIS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 POIDS PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT POIDS.\n           EVALUATE TRUE\n               WHEN POIDS < 1000 DISPLAY \"PETIT\"\n               WHEN POIDS < 5000 DISPLAY \"MOYEN\"\n               WHEN OTHER DISPLAY \"GROS\"\n           END-EVALUATE.\n           STOP RUN.\n",
      hints: ["Il manque la tranche MOYEN.", "WHEN POIDS < 5000 DISPLAY \"MOYEN\"."],
      tests: [{ stdin: "500\n", expect: "PETIT\n" }, { stdin: "3000\n", expect: "MOYEN\n" }, { stdin: "9000\n", expect: "GROS\n" }, { stdin: "5000\n", expect: "GROS\n" }],
      rules: { mustSrc: [{ re: "EVALUATE\\s+TRUE", msg: "Utilise EVALUATE TRUE." }], mustCall: ["ACCEPT"] }
    },
    {
      id: "cob5_9", ch: 5, ord: 9, title: "Le barème des agios", job: "Chapitre 5 · Décisions", stars: 4, scene: 'terminal',
      story: "Contrat de fin de chapitre : classer un solde en trois états de compte, comme le ferait un relevé bancaire.",
      goal: "Lis <code>SOLDE</code> (ACCEPT). 0 → <pre>VIDE</pre>&lt; 1000 → <pre>FAIBLE</pre>sinon → <pre>CONFORTABLE</pre>Testé avec plusieurs soldes.",
      lesson: "<p>On combine lecture (<code>ACCEPT</code>) et décision multiple. Attention à l’ordre des cas : teste d’abord le cas le plus précis (0), puis les intervalles.</p>",
      starter: H("AGIOS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           EVALUATE TRUE\n               WHEN SOLDE = 0 DISPLAY \"VIDE\"\n               WHEN OTHER DISPLAY \"CONFORTABLE\"\n           END-EVALUATE.\n           STOP RUN.\n",
      solution: H("AGIOS") + "       DATA DIVISION.\n       WORKING-STORAGE SECTION.\n       01 SOLDE PIC 9(6).\n       PROCEDURE DIVISION.\n           ACCEPT SOLDE.\n           EVALUATE TRUE\n               WHEN SOLDE = 0 DISPLAY \"VIDE\"\n               WHEN SOLDE < 1000 DISPLAY \"FAIBLE\"\n               WHEN OTHER DISPLAY \"CONFORTABLE\"\n           END-EVALUATE.\n           STOP RUN.\n",
      hints: ["Il manque la tranche FAIBLE entre VIDE et CONFORTABLE.", "WHEN SOLDE < 1000 DISPLAY \"FAIBLE\"."],
      tests: [{ stdin: "0\n", expect: "VIDE\n" }, { stdin: "500\n", expect: "FAIBLE\n" }, { stdin: "5000\n", expect: "CONFORTABLE\n" }, { stdin: "999\n", expect: "FAIBLE\n" }],
      rules: { mustSrc: [{ re: "EVALUATE", msg: "Décide avec EVALUATE." }], mustCall: ["ACCEPT"] }
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
