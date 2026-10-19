# État de l’implémentation — honnête

Dernière mise à jour : 19 octobre 2026. Chiffres produits par `node tools/validate.js` et `node tests/run.js`,
exécutés ce jour ; aucun chiffre n’est recopié à la main.

## Contenu

| | Demandé | Fait | Comment c’est vérifié |
|---|---|---|---|
| Mondes | 200 (30 faciles, 70 moyens, 100 difficiles dont 10 extrêmes), puis **200 de plus** | **400** — les 200 premiers : 30 / 70 / 100 dont **10 extrêmes** ; les 200 nouveaux (W201–W400) : 41 en P2, 67 en P3, 72 en P4, 20 en P5 | `tools/validate.js` (comptes), `tests/run.js` |
| Les 40 premiers mondes permettent de finir | 30 effets en P1–P2 | **36** effets obtenables dans W001–W040, sans heure réelle ; aucune énigme seule ne bloque | analyse d’accessibilité + test « énigmes fragiles » |
| Profondeurs | P1 à P5 | P1 : 26 · P2 : 38 · P3 : 68 · P4 : 58 · P5 : 10 | comptes |
| Sixième couche difficile d’accès | seulement via W181/W182 | oui (plus le trou `set 0` du mode caractères) | test dédié dans `tests/run.js` |
| Effets | ≥ 85 | **243** (90 d’origine, 90 artefacts, 3 de collections, 60 nouveaux dans les nouveaux mondes), tous attribués, tous avec une fonction | test « chaque effet est réellement attribué » |
| Habitants | ≥ 450 | **1 031** définitions uniques, plus les 110 habitants des histoires ; **307** redessinés pour faire peur dans les couches profondes | comptes, test « habitants terrifiants… » |
| Arcs longs | ≥ 10 | **12 + 2 méta** (Q01–Q12, M1, M2), avec étapes et conclusion | tests scriptés des maillons |
| Mondes à apparition | 10 | **10** (W141–W150), règles explicites | comptes + réseau |
| Générateurs aléatoires | 3 | **3 systèmes** : labyrinthe tiré chaque nuit (W151), paysages infinis procéduraux (5 mondes dont W152), lieux qui se réarrangent (5 mondes dont W153) | tests « change d’une nuit à l’autre », « graine stable », « se réarrange » |
| Mondes infinis / en boucle | ≥ 15 | **19** | comptes |
| Sorcières | 5 + Prêtresse | 5 sorcières (poursuite d’un monde à l’autre), Grande Prêtresse (présages, pouvoirs, verrou, corruption persistante qui se résorbe) | code + tests antérieurs en navigateur |
| Fins | 4 | 4, chaque séquence jouée dans le navigateur sans erreur ; conditions testées | `tests/run.js` + essai navigateur |
| Wiki | HTML séparé, carte | `wiki/dream_archive.html` (en anglais) : 406 fiches, carte du réseau (2 158 passages), vignettes, recherche, filtres, spoilers par niveau, mode « My archive » | généré par `tools/build_wiki.js`, ouvert dans le navigateur |
## Ajouts de la dernière passe

| | Fait | Vérifié par |
|---|---|---|
| Caméra directe (réglable : directe / douce), tremblements désactivés par défaut | oui | test « caméra exactement sur la protagoniste » |
| Déplacement au pixel (1 px par image en marchant, 2 en courant, réglable) | oui | test dédié + mesure dans le navigateur |
| Habitants en anglais, coréen du Sud, coréen du Nord — plus aucune parole en français | 1 866 répliques étrangères ; les répliques coréennes ont leur traduction anglaise | `tools/lang_check.js` (0 parole française) |
| Panneaux remplacés par des âmes (message unique, puis dissolution, onglet « Âmes » du journal) | 806 âmes ; les objets réels (tableaux, affiches) restent avec leur âme devant ; l’affiche d’aide 3114/119 et les plaques du pont restent des panneaux | test « plus aucun panneau », test « une âme parle et se défait » |
| Beaucoup plus de lore | ~750 nouvelles âmes porteuses de fragments, ~120 lignes d’habitants en plus, canon dans `docs/lore_canon.md` | relecture par échantillons |
| Cartes : 40 mondes générés agrandis, 16 nouveaux mondes qui bouclent (35 au total), 16 annexes, 66 paires de passages latéraux | oui | test « mondes agrandis… », `tools/reach_maps.js` |
| Chaque carte meublée (scènes, lumières, détails au sol) | ~1 500 objets + détails | test « chaque carte est meublée » |
| Graphismes : façades d’immeubles avec fenêtres, toits, reflets d’eau, ambiance (poussière, feuilles, lucioles), objets muraux accrochés aux murs, âmes à halo | oui | captures |
| 90 artefacts de plus (180 effets), posés au sol dans des recoins | oui, chacun avec une action, une capacité ou un réglage réel | test « chaque effet est réellement attribué » |
| Cercle d’exposition de la Salle des nids recentré, en spirale | oui | capture avec 180 effets |
| Musique : 14 styles très dépouillés, acoustique sèche / pièce / salle selon les pistes, 8 nouveaux timbres, 39 mondes sans musique, 26 petits bruitages lointains | oui | essai dans le navigateur (aucune erreur) |
| Deux emplacements « musique perso » détectés automatiquement | oui | essai avec un fichier de test synthétisé, puis supprimé |

## Passe « lenteur, oiseau, journal, contacts, anglais »

| | Fait | Vérifié par |
|---|---|---|
| Lenteur : les morceaux de carte se préparent à l’avance autour de la vue (dans le sens de la marche), jamais plus de ~10 ms de peinture par image ; toiles de travail en mémoire (relectures rapides) puis copiées en toiles d’affichage ; vignette, lumière, eau et grain sur toiles d’affichage | pire image en marchant/courant : **20–50 ms** (contre ~1 000 ms avant) ; moyenne 1,4–4,4 ms ; peinture d’un morceau 9–18 ms (dont « netteté » 0,2–0,7 ms au lieu de ~23) | mesure dans le navigateur sur W001, W003, W051, W090, W120, W162, W181 |
| Le merle du Jardin montre lui-même les quatre directions (il sautille dans chaque sens, une note par saut) ; plus aucune flèche. Les effets qui « montrent » (Flair, Boussole, Fil) tournent le regard de la protagoniste et lâchent une petite lueur dans la direction | oui | test « le merle montre lui-même… » + essai dans le navigateur |
| Journal retiré (touche J, menu pause, carnet de la chambre, réglage des touches) | oui | test « plus de journal » |
| Contacts des habitants : le rayon de promenade ne sert plus de rayon de collision (certains bloquaient à 2–9 cases) ; corps mesuré sur le dessin ; on s’arrête devant un habitant au lieu de glisser autour ; les personnes et animaux au sol redeviennent solides (sauf dans un passage étroit) ; l’escargot postier n’apparaît plus en double | marche vers chaque habitant depuis les 4 côtés : **1 407 approches réussies sur 1 439** (190 mondes) ; les échecs restants sont dans des mondes à tapis roulant / marche en rythme où le banc d’essai ne peut pas marcher normalement | audit automatique dans le navigateur, test « corps à leur taille » |
| **Jeu entièrement en anglais** : menus, réglages, schéma « How to play », récit, noms (glossaire commun de 925 noms), effets, quêtes, inscriptions, pierres gravées, mots à dire (anglais + coréen), page d’avertissement, wiki ; traductions **anglaises** sous les répliques coréennes | `tools/fr_check.js` : **0 chaîne française** sur ~32 000 lues (code, données, page, wiki) | test « le jeu est entièrement en anglais », `tools/lang_check.js` |

| Effets **seulement dans les rêves** : éveillée (chambre, balcon), rien n’est porté, pas de menu des effets (Tab), pas d’utilisation (F), pas d’icône, apparence normale ; le choix revient la nuit suivante | oui | test « les effets n’existent qu’en rêve » + essai dans le navigateur |
| Les 90 artefacts ne traînent plus par terre : chacun s’obtient d’une façon liée au lieu (`src/world/finds.js`) — **fouiller** un meuble plusieurs fois (18), **creuser** des feuilles, du sable, des cailloux (19), un **habitant qui le garde** dans sa main fermée et finit par le donner (15), une **lueur** sur laquelle rester immobile (19), **trois** bougies / carillons / lampes à éveiller (9), un **reflet** qui montre l’objet avant qu’il apparaisse (10) | les 90 obtenus un par un par leur méthode | test « les 90 artefacts s’obtiennent chacun par sa façon », `tools/reach_maps.js` (0 injoignable) |
| Lenteur supplémentaire trouvée en parcourant les 200 mondes : l’effet « psychédélique » recopiait l’écran sur lui-même 90 fois par image (≈ 380 ms dans W176) | une seule copie : **≈ 6 ms** ; sur les 200 mondes, image médiane 1,6 ms, pire 12,6 ms | mesure monde par monde dans le navigateur |

## Passe « histoires, collections, secrets, mondes immenses, cohérence »

| | Fait | Vérifié par |
|---|---|---|
| **Histoires d’habitants** (`src/systems/stories.js`, `data/stories/*.js`) : 110 histoires toutes différentes — **suivre** quelqu’un (20 : il marche vers une cachette, l’eau, un recoin, très loin, et attend si on traîne), **rapporter** ce qu’il a perdu (24, souvent 2–3 objets : les deux chaussures d’un enfant…), **dialogues à choix** (38 arbres, jusqu’à 9 fins, ex. « pommes ou poires ? »), **mot déclencheur** à dire avec T (28). Chaque nuit 5 à 7 sont confiées à des mondes qui leur vont ; une histoire finie ne revient jamais ; l’habitant s’en va ensuite | les 110 jouées de bout en bout, **344 fins de dialogue** parcourues | `tools/story_check.js`, `tools/story_play.js` (tests) |
| **Collections** : 40 vieilles pièces, 12 pages arrachées d’un journal, 8 photographies, 20 grues en papier ; chaque nuit une partie de ce qui manque est semée (d’abord dans les cachettes) ; l’étagère de la chambre de rêve montre où l’on en est ; trois nouveaux effets au bout (Coin Purse, Mended Diary qui guide vers ce qui reste caché, Photo Album qui montre les faux murs) | oui | test « collections… », `tools/reach_maps.js` |
| **Secrets placés aux bons endroits** (`src/world/secrets.js`) : pièce derrière un faux mur (au bout d’un couloir, loin de l’arrivée), raccourci à travers un mur fin entre deux endroits très éloignés à pied, chemin invisible au-dessus du vide ou de l’eau vers un îlot, tableau / miroir / affiche dans lequel on entre ; labyrinthes de murs invisibles dans les mondes immenses ; une fissure ou des traces trahissent parfois l’entrée ; seule la protagoniste traverse (ni habitants ni sorcières) ; les cachettes changent d’une nuit à l’autre | ~150 cachettes dans ~65 mondes (244 dans 146 mondes depuis l’ajout des 200 nouveaux) ; 0 cachette injoignable ; portes cachées jamais vers la sixième couche | test « secrets… » |
| **10 mondes immenses** (≈ 200 × 150 cases), redessinés à **chaque visite** : quartiers de formes différentes (forme du monde, clairière en anneau, lac et pont, jardin, ruines, petit dédale, labyrinthe invisible) séparés par d’épaisses bandes percées de passages | oui ; identiques pendant une visite, différents d’une visite à l’autre | test « mondes immenses… » |
| Lucioles : une luciole attrapée disparaît pour la nuit (elle revenait à chaque réévaluation et en rentrant dans le marais) | oui | test dédié |
| **Bug corrigé : aucun mot coréen tapé n’était reconnu** (la normalisation décomposait le hangeul puis l’effaçait) | 엄마, 바다… reconnus | test dédié |
| **Cohérence et synchronisation** (`tools/coherence.js`) : la porte « retour » ramène là d’où l’on vient vraiment (mondes à plusieurs entrées) ; un objet ramassé ne réapparaît plus en revenant dans le monde (on pouvait ramasser plusieurs fois les mêmes planches, grues…) ; les pièces de collection étaient invisibles (dessin manquant) ; l’arrivée ne tombe plus sur un faux mur ni sur un chemin invisible ; à côté d’une porte entourée d’obstacles, on apparaît sur une diagonale plutôt qu’au loin ; le bord est du Jardin mène maintenant au Verger (l’inverse existait seul) | **0 problème** relevé par l’audit | test « cohérence… », test « la porte du retour… » |
| Quatre nouvelles mécaniques d’énigmes (`src/world/mech_new.js`) : allumer toutes les lumières (parfois avant qu’elles ne s’éteignent), paires à retrouver, caisses à pousser sur des dalles, traces de pas à suivre sans s’écarter | oui | test « nouvelles énigmes » |
| Lenteur : construction d’un monde 21 → 17 ms en moyenne (accrochage des décors muraux 175 → 4 ms, vérification d’accessibilité 60 → 17 ms, lecture des cases sans fabriquer de texte, recoins mis en cache) ; l’arrivée dans un monde se prépare pendant le fondu au noir (plus d’image figée de 100–400 ms) ; pas au pixel à rythme régulier sur les écrans 75/90/120/144/165 Hz (plus de saccade 1-0-0-1) | pire image à l’arrivée 17–53 ms (W001…W162) ; rythme 0101… à 144 Hz, 001… à 165 Hz | mesures Node et navigateur |

Restent volontairement dans une langue inventée : la langue de la Vallée (« ouna-sé »…) et le babil des sorcières —
ce ne sont pas des langues réelles, elles faisaient partie de la demande d’origine. Les commentaires du code et les
documents (README, STATUS, docs/) restent en français ; ils ne sont jamais affichés en jeu. Numéros d’aide affichés :
109 (Corée du Sud), 3114 (France), 988 (États-Unis), 116 123 (Royaume-Uni et Irlande), findahelpline.com.

**Non fait, volontairement** : les deux musiques YouTube n’ont pas été téléchargées (droits d’auteur, conditions de
YouTube). Les emplacements `perso1` / `perso2` sont prêts pour des fichiers dont tu as les droits.

**À savoir** : les répliques coréennes (Sud et Nord) et anglaises ont été écrites par IA et n’ont pas été relues par
une personne dont c’est la langue ; le registre du Nord est soigné mais peut contenir des maladresses.

## Correctif « portes mieux placées »

| | Fait | Vérifié par |
|---|---|---|
| **Placement des portes posées au hasard** (portes, ascenseurs, escaliers, passages latéraux, portes qui n’apparaissent que plus tard) : dans un lieu fermé contre un mur, dehors sur un sol dégagé (pas dans un buisson ni contre l’eau), toujours avec une case libre devant pour s’y présenter, jamais collées à une autre porte ni sur l’arrivée, réparties sur la carte, les passages latéraux plutôt vers les bords ; la case devant chaque porte reste libre (meubles, objets muraux et objets posés au hasard n’y vont plus) ; une porte qui n’apparaît que plus tard compte déjà comme présente. Les portes placées à la main, celles des cachettes et les tableaux-portes ne bougent pas | sur 3 nuits, portes au hasard : seules au milieu d’une pièce 562 → **76**, collées à une autre 303 → **76**, sur l’arrivée 169 → **31**, sans place devant 99 → **13**, dont 5 vraiment bouchées ou avec un objet juste devant (ce qui reste : de toutes petites pièces et deux mondes sans murs) | `tools/door_audit.js`, test « portes posées au hasard… », `reach_maps --nights 8` (0 injoignable) |

## Correctif « les mondes qui bouclent »

| | Fait | Vérifié par |
|---|---|---|
| **Raccord des mondes qui bouclent** : le terrain est dessiné par blocs de 8 × 8 cases ; quand la largeur ou la hauteur d’un monde n’était pas un multiple de 8 (28 des 30 mondes en boucle), le dessin se répétait tous les 32 cases au lieu de 30 (par exemple) : le sol se décalait au raccord et les textures « sautaient » en le franchissant. Chaque copie du monde est maintenant posée à sa vraie place et le dernier bloc est coupé au bord. Les arbres et grands décors, et les reflets de l’eau, ne changent plus de variante d’un côté à l’autre ; l’ordre de profondeur près du raccord vertical est juste | image identique au pixel près quand la caméra est décalée d’une largeur ou d’une hauteur de monde, dans les **30** mondes en boucle (jusqu’à 52 % de pixels décalés avant) | `tests/browser_seams.js` (`__seams()` dans la page du jeu) |
| **Bords fermés** : deux couloirs « sans fin » (W043, W154) étaient murés à chaque bout et les six mondes immenses déclarés en boucle étaient entourés d’une bande pleine : on ne pouvait jamais en faire le tour. Les couloirs s’ouvrent aux deux bouts ; le générateur des mondes immenses perce un passage par rangée et par colonne de quartiers, à la même hauteur des deux côtés | traversée du bord vérifiée en jeu (W043, W154, W051, W106) | test « mondes qui bouclent : on peut vraiment en faire le tour » |

## Passe « cohérence, placement, psychédélique, énigmes et secrets partout, habitants terrifiants »

| | Fait | Vérifié par |
|---|---|---|
| **Une énigme et un secret écrits dans chaque monde** : 8 fichiers d’ajouts (`data/worlds/more_01.js` … `more_08.js`, via `YN.kit.more`) ajoutent à 194 mondes existants des énigmes (suites, pas à suivre, rester immobile, mots à dire, échos, cadrans, quiz, paires, caisses à pousser, lampes, poursuites…) et des secrets (pièce derrière un mur qu’elle seule traverse, porte qui n’apparaît qu’à une condition — mot dit, effet porté, lumière de la chambre, fenêtre ouverte, heure réelle, fin du rêve —, labyrinthe de murs invisibles, objet visible seulement avec un effet), chacun lié au thème et aux habitants du monde, avec un indice dans le monde | `tools/content_audit.js` : **0** monde sans énigme, **0** sans secret écrit (contre 110 et 116) ; énigmes 373 → **522**, secrets écrits 499 → **822** | résolution par programme de chaque ajout par ses auteurs ; `validate`, `reach_maps`, `coherence`, `fr_check`, `lang_check` |
| **Beaucoup de secrets dans les 40 premiers mondes** : 3 à 6 secrets écrits de plus par monde (moyenne **5,5** par monde, contre 2,2), et le moteur y creuse plus de cachettes et de portes peintes | moyenne moteur **2,0** par nuit (contre 0,8) | audit |
| **Éléments mieux placés** : dans les lieux fermés, une porte posée au hasard va contre le mur du fond (sinon contre un mur de côté), jamais seule au milieu d’une pièce ; les meubles d’intérieur (bibliothèque, télé, canapé, casiers, distributeurs…) se rangent contre les murs ; rien de solide ne se pose sur une case de passage obligatoire (entrée d’une pièce, virage d’un couloir) ; une porte de retour tombée dans un goulet est déplacée ; on n’arrive plus dans un cul-de-sac fermé par la porte elle-même ; un barrage formé par plusieurs objets posés au hasard (sièges et fenêtres en travers d’un train) est défait | 0 porte isolée au milieu d’une pièce ; **0 marque injoignable et 0 arrivée enfermée sur 12 nuits** (4 752 constructions) | test « placement… », test « placement sur plusieurs nuits », `tools/reach_maps.js --nights 12` |
| **Psychédélique voulu** dans 45 mondes (`data/worlds/_psy.js`, `renderer.psyPost`) : chacun a sa recette — ondes, respiration, tunnel d’échos, symétrie fantôme (kaléidoscope), double image, bandes arc-en-ciel, taches de couleur, rotation des teintes ; 14 mondes déjà psychédéliques ont enfin chacun leur manière ; « Reduce distortion / flashes / motion » calment tout | 45 recettes différentes, < 3 ms par image | test « psychédélique voulu… », essai navigateur |
| **Habitants terrifiants** (`src/render/art_horror.js`, `data/entities/_horror.js`) : **307** habitants redessinés — aucun en P1, 21 en P2, 114 en P3, 142 en P4, 30 en P5 ; les lieux tendres (jardin, grand-mère, berceuse…) et les personnages majeurs sont épargnés. Ils gardent vêtements, couleurs et objets ; visage, cou, bras ou silhouette changent selon le thème du monde (sourires fendus et masques au Nord, employés sans visage au cou trop long dans les bureaux, têtes bandées ou couvertes d’yeux à l’hôpital, bouches à dents à l’école, noyées aux cheveux sur le visage au bord de l’eau…), nouvelles silhouettes (l’homme très grand, la chose à quatre pattes, la gueule, le tas de mains, la grappe d’yeux, la marionnette, le fondu, le sourire flottant…), versions psychédéliques dans les mondes psychédéliques ; certains tremblent, se glitchent, clignotent, grandissent quand on approche, ou se rapprochent quand on ne les regarde pas | tous dessinables, 0 erreur dans les 400 mondes | test « habitants terrifiants… », parcours navigateur |
| **Apparence des effets** (`data/effects_look.js`) : 29 effets la transforment en quelque chose d’inquiétant ou de psychédélique (sourire fendu, bandeau de censure, visage au correcteur, fils de marionnette, mains d’ombre, cape à yeux, tête de télé, clé de remontage, troisième œil, larmes noires, cheveux sur le visage, double pâle, cou qui s’étire, ombre qui coule, corps d’étoiles, couronne kaléidoscope…) ; les 122 effets qui ne changeaient rien à son allure ont maintenant un objet visible | 242 effets sur 243 visibles (Tiny la rapetisse) ; les 243 portés en jeu sans erreur | test « effets : chacun change son allure… » |
| Corrections signalées pendant la passe : porte peinte dans le virage d’une spirale (W166), fenêtre qui scellait une pièce (W171), arrivée enfermée (W151, W193, W181), barrage dans le train (W192), porte de retour tombée dans une cachette (W149), porte peinte poussée dans le seul passage vers une pièce (W014), habitants qui pouvaient apparaître dans une pièce secrète ; Corridor 0 (W127) boucle enfin vraiment ; sons par défaut inexistants des énigmes « frapper » et « attraper » | oui | `reach_maps --nights` |

## Passe « 200 mondes de plus, énigmes, secrets, cohérence »

| | Fait | Vérifié par |
|---|---|---|
| **200 nouveaux mondes** (W201–W400) en dix ensembles cohérents de 20 : l’immeuble 107 (appartements), la ville au bord de la mer, l’école la nuit, la ligne de train du Nord, le travail de nuit de la mère, la forêt des objets perdus, la ville de papier (censure), l’intérieur des objets, les salles de la météo, et une nouvelle région de la sixième couche (« Below the Sixth Sleep »). Chaque ensemble a un fil rouge et une méta-énigme sur plusieurs mondes, des personnages récurrents, et se relie à 3–5 mondes existants de même thème | 400 mondes construits, jouables, **0 inaccessible** ; 2 169 passages valides | `tools/validate.js`, `tools/reach_maps.js`, `tools/coherence.js` (0 problème), parcours des 400 mondes dans le navigateur (0 erreur) |
| Une énigme dans presque chaque nouveau monde (toutes les mécaniques, dont les 4 nouvelles) et au moins un secret par monde : porte qui n’apparaît qu’à une condition (mot dit, effet porté, lumière de la chambre éteinte, fenêtre ouverte, heure réelle, fin du rêve…), labyrinthe de murs invisibles, mur traversable avec un effet, chute, coin caché qu’une âme suggère | chaque auteur a résolu ses énigmes par programme (sauf quelques-unes de poursuite, signalées non essayées) | scripts de résolution des auteurs |
| 60 nouveaux effets (E201–E260), chacun ouvrant au moins un secret de son ensemble | tous attribués | test « chaque effet est réellement attribué » |
| La sixième couche ne s’ouvre toujours que par W181/W182 : les 20 nouveaux mondes de P5 ne sont reliés qu’aux mondes de P5 | oui | `tools/coherence.js` |
| Les passages ajoutés automatiquement (annexes, portes peintes, portes cachées) ne mènent plus jamais vers un monde « récompense » (dont toutes les entrées demandent quelque chose) | oui | code + audit |
| Doublons de noms d’effets corrigés (Black Marker → Censor’s Marker, Television Snow → Off-Air Snow, ancien doublon Glowing Message → Phosphor Note) ; trace de pas avec tolérance réparée | oui | contrôle des noms, test |

## Ce qui a été exécuté

- `node tests/run.js` : **75 / 75** vérifications réussies (sur les 400 mondes).
- `node tools/validate.js` : 0 erreur, 0 avertissement, 0 référence cassée, 0 monde inaccessible, 2 170 passages valides,
  400 mondes construits sans erreur avec une arrivée libre.
- `node tools/reach_maps.js --nights 12` : 396 mondes à carte vérifiés sur 12 nuits (4 752 constructions), 0 porte / effet / objet injoignable à pied, 0 arrivée enfermée.
- `node tools/coherence.js` : 406 lieux, 0 problème. `node tools/fr_check.js` : 0 texte français sur ~71 600 chaînes. `node tools/content_audit.js` : 0 monde sans énigme, 0 sans secret écrit.
- `node tools/story_play.js` : les 110 histoires jouées de bout en bout.
- **Test d’exécution dans le navigateur** (refait après cette passe) : les 400 mondes W001–W400 ouverts un par un,
  marche dans trois directions, conversation avec le premier habitant visible : **0 erreur**. Résultat consigné
  dans `tests/smoke_results.json`.
- Les quatre séquences de fin jouées dans le navigateur : sans erreur.

## Ce qui n’a pas été fait ou pas vérifié

- **Les ~470 énigmes et secrets ajoutés** (149 énigmes et 323 secrets écrits, d’après l’audit) ont été résolus par programme par leurs auteurs (scripts de résolution), pas joués
  à la main ; certains indices peuvent être trop obscurs ou trop évidents. Les quelques poursuites et chronométrages
  dépendent du doigté.
- **Habitants redessinés** : choisis par règles (profondeur, thème du monde), pas un par un ; une réplique peut encore
  parler d’un visage ou d’un sourire que le nouveau dessin n’a plus. À 20 pixels par case, les détails fins (dents,
  petites fissures) se perdent : ce sont surtout les silhouettes et les animations qui font peur.
- **Psychédélique** : vérifié en capture sur quelques mondes (W174, W184) et sans erreur dans les 45 ; pas regardé
  longuement dans chacun. Le filtre de couleur par objet (`ctx.filter`) n’existe pas sur les vieux Safari : les
  traînées y restent sans couleur.
- **Aucune partie complète n’a été jouée à la main** du début à chaque fin en temps réel. Les fins et les arcs sont
  vérifiés par les tests de conditions et de dialogues, et par l’ouverture de chaque monde ; une vraie partie peut
  encore révéler des énigmes mal dosées ou des indices trop obscurs.
- **Contrôle visuel partiel** : les 40 premiers mondes et une dizaine de mondes profonds (W182, W183, W186, W190,
  W192…) ont été regardés en capture ; les autres mondes secrets ne l’ont été que par le test d’exécution. Certains
  mondes secrets réutilisent des décors de la bibliothèque commune et se ressemblent plus que souhaité.
- **Graphismes** : pixel art produit par le moteur (matériaux pixel natifs, décors et personnages dessinés puis
  aplatis et cernés), pas des planches dessinées à la main. La protagoniste a des sprites faits à la main.
- **Musique** : entièrement procédurale (aucun fichier audio fourni). Le chargement de fichiers avec points de boucle
  est implémenté mais n’a pas été essayé avec de vrais fichiers, faute de fichiers.
- **Pas de commandes tactiles** : le jeu se joue au clavier ou à la manette.
- **Heures réelles** : vérifiées par tests en simulant l’horloge (`YN.realtime.fixed`), pas en attendant les vraies
  heures.
- **La parole** : reconnaissance par mots-clés normalisés (accents, majuscules, ponctuation) ; une formulation
  inattendue peut ne pas être comprise.
- **Wiki** : vérifié par script (fiches, carte, vignettes) ; la capture d’écran n’a pas pu être faite pendant cette
  session.

## Où regarder si quelque chose casse

- Console de développement du jeu : touche **²** une fois le mode caractères ouvert (voir `docs/secrets.md`), ou
  `?debug` dans l’adresse. `validate` y lance la validation.
- Les avertissements du moteur sont gardés dans `YN.devLog` (console du navigateur).
