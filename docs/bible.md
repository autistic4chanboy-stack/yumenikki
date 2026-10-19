# BIBLE DE CONCEPTION — *Yume Nikki : The Dream Archive*

> Document interne. Il contient **toutes les vérités cachées** du jeu. Rien de ce qui est écrit ici
> ne doit être expliqué au joueur dans le jeu. Le jeu montre, suggère, contredit ; la bible tranche.
> Chaque monde, personnage, énigme et règle doit être vérifié contre ce document (voir `tools/validate.js`).

---

## 0. Ordre de priorité (décisions de l'auteur, prioritaires sur tout le reste)

1. Le jeu est **terminable avec 30 effets**, tous trouvables dans les **40 premiers mondes** (W001–W040),
   en profondeur 1 et 2. Ces 40 mondes sont « relativement classiques ».
2. Les **160 autres mondes** (W041–W200) sont cachés, et d'autant plus originaux et difficiles qu'ils sont secrets.
3. Trois peuples parlent des langues réelles :
   - **anglais** (la télévision, l'arcade, le casino, les opérateurs téléphoniques : le « dehors ») ;
   - **coréen du Sud** (la Glass City, ex-« Ville de Verre » : technologie avancée, surmenage, 야근, 학원) ;
   - **coréen du Nord** (Happiness Station, ex-« Gare du Bonheur » : « everything is fine, we are happy » — métaphore de la dictature).
4. Thèmes : censure, dictature, négligence d'enfant et ses conséquences futures, harcèlement, suicide.
   Avertissement obligatoire avant de jouer, à accepter.
5. **Seule la boucle de gameplay est expliquée** (schéma avant la partie). Tout le reste est cryptique :
   les comprimés, le flacon blanc, les sorcières (qui parlent une autre langue quand elles attaquent),
   les effets, les PNJ à grand lore.
6. Une **sixième couche** (Profondeur 5) existe sous la cinquième. Plus on descend, plus c'est étrange et psychédélique.
7. Beaucoup d'endroits à énigmes, **jamais bloquants** pour la progression principale.
8. Lieux imposés : laboratoire secret, casino où l'on parie du temps de rêve, gare inspirée du métro nord-coréen,
   monde 100 % noir, le Garden complet, un dédale « Labyrinthe » (The Maze, W031) qui change selon le jour et la nuit.
9. La mère peut entrer et éteindre la lumière (1 chance sur 5, entre 5 et 10 minutes de rêve).
10. Une salle à effets (les « nids » : The Nest Room), une écriture ancienne sur ses parois, jamais expliquée, jamais nommée « langue ».
11. Des secrets dans les fichiers du jeu. La protagoniste peut parler (texte tapé).
12. Mode debug : tous les sprites deviennent des caractères ASCII ; `set <code>` change la case devant soi.
    Certains lieux ne sont accessibles qu'ainsi.
13. Événements liés à l'heure réelle, **toujours suggérés** par un indice dissimulé.

---

## 1. La boucle de gameplay (la seule chose expliquée au joueur)

```
CHAMBRE ÉVEILLÉE → CHOISIR SON RISQUE → ENTRER EN RÊVE → EXPLORER ET RÉSOUDRE
→ CHOISIR SA PROCHAINE ÉTAPE ─┬─ Réveil normal  → Sauvegarde validée ─┐
                              ├─ Continuer      → Risque de perdre    ├→ RETOUR À LA CHAMBRE → NOUVEAU CYCLE
                              └─ Capture        → Retour sauvegarde  ─┘
```

Règles annoncées sans ambiguïté (écran de schéma) :

| Règle | Valeur |
|---|---|
| Durée d'un rêve normal | 10:00 maximum |
| Avec un comprimé bleu | 20:00 maximum |
| Réveil normal (*the door to waking*, fin du temps, se pincer) | sauvegarde la progression |
| Capture par une sorcière | perte de tout ce qui n'a pas été sauvegardé depuis le dernier réveil |
| Biscuit | protège d'une seule attaque fatale, puis disparaît ; aucune réapparition, aucune sauvegarde |
| La grande présence | son étreinte annoncée (trois cloches) ignore les biscuits |
| Quêtes longues | progressent sur plusieurs rêves ; chaque étape n'est acquise qu'au réveil |
| Profondeurs | six couches ; plus profond = plus instable, plus important |

Ce que l'écran **ne dit pas** : pourquoi elle prend des comprimés, ce qu'est le flacon blanc, qui sont les sorcières,
ce que font les effets, ce que veulent les personnages.

---

## 2. Lois physiques des rêves (invariants — ne jamais les trahir)

1. **Le rêve suit l'horloge réelle.** Le compte à rebours ne se réinitialise jamais en changeant de monde.
   La pause (Esc) ou un onglet caché fige le rêve. À 00:00, le réveil est inévitable.
2. **On se réveille de trois façons** : *the door to waking* (Nexus), la fin du temps, se pincer (maintenir P).
   Se pincer prend `1,5 s × profondeur` (plus on est profond, plus on met de temps à remonter).
   Une capture interrompt le pincement.
3. **Seules les sorcières et la Priestess attrapent.** Les autres créatures hostiles *déplacent*
   (vers une salle piège) ou *volent du temps* (−30 s), jamais plus.
4. **Le Nexus, la chambre rêvée et la salle des nids sont sûrs.** Aucune sorcière n'y entre.
5. **Une porte mène toujours au même monde.** Seul son point d'arrivée peut varier (P3 et plus, ou corruption).
6. **On ne tombe que vers le bas.** Une chute descend toujours d'au moins une couche (ou reste dans la même).
7. **Ce qui est dit à voix haute est entendu.** Parler (T) est un bruit ; certains écoutent.
8. **Éveillée, elle ne parle pas.** Dans la chambre, la bulle n'affiche que « … » — sauf à la toute fin.
9. **La chambre compte moins à mesure qu'on descend** : P1 subit tout (lumière, fenêtre, porte),
   P2 la moitié (pénombre, vent, murmures), P3+ rien — sauf The Room Below (W182), qui l'inverse.
10. **Plus on descend, plus on remonte dans le temps** : P1 = l'appartement aujourd'hui, P2 = l'enfance,
    P3 = ce qu'on lui a raconté (les deux Corées, la télévision), P4 = ce qu'on ne dit pas,
    P5 = avant les mots.
11. **En P5, le temps compte double.** Le chronomètre tremble : une seconde réelle en coûte deux.
12. **Rien n'est détruit pour toujours.** La corruption est une couche réversible ; la définition d'un monde n'est jamais modifiée.

---

## 3. Les six couches

| Couche | Nom interne | Stabilité | Influence de la chambre | Signes |
|---|---|---|---|---|
| P0 | L'éveil | — | totale (c'est la chambre) | lumière, fenêtre, porte, commode, borne |
| P1 | Rêves accessibles | stable | totale | Nexus, 5 portes, mondes du quotidien |
| P2 | Rêves imbriqués | stable | moitié | entrées « dedans » : tableaux, lits, puits, trains qui descendent |
| P3 | Rêves instables | arrivées variables par rêve (graine) | aucune | gravité, miroirs, couleurs qui glissent |
| P4 | Rêves profonds | événements persistants | aucune (sauf W182, inversée) | lore, Priestess fréquente, psychédélisme fort |
| P5 | La Sixième Couche | temps ×2 | aucune | couleurs sans nom, mots d'avant les mots |

Accès à P5 (seulement deux chemins) :
- **The Room Below (W182)** (ex-« La Chambre d'en bas ») : copie inversée de la chambre. Il faut que l'état réel de la chambre soit l'inverse
  de celui dessiné au mur de W182 (indice : le dessin), avoir pris un comprimé bleu et arriver au lit avec au moins
  08:00 restantes. Dormir dans ce lit → W183.
- **The Bed at the Bottom of the Water (W181)** (ex-« Le Lit au fond de l'eau ») : avec l'effet Diving Suit (ex-Scaphandre), à la marée de pleine lune (heure réelle) ou après avoir
  allumé les trois phares (W029, W158, W088).

---

## 4. Portes et connexions

Types de passages : `door` (porte), `path` (bord de carte), `fall` (chute, à sens unique vers le bas),
`train` (horaires), `inner` (entrer *dans* un objet : tableau, lit, télévision, maison de poupée → couche +1),
`stairs`, `elevator`, `oneway`, `secret` (caché, conditionnel), `debug` (n'existe que par `set`).

Conditions possibles (combinables) : effet possédé ou équipé, état de la chambre, temps restant ou phase,
heure réelle, date réelle, drapeaux de quête, relations, nombre de visites, corruption, présence d'une sorcière,
phrase dite à voix haute, comprimé pris.

Règles de cohérence :
- toute porte possède un retour, sauf les passages explicitement `oneway`/`fall` ; dans ce cas le monde d'arrivée
  contient une autre sortie (validé automatiquement) ;
- aucune connexion obligatoire (vers W001–W040) n'exige d'effet introuvable dans W001–W040 ;
- un monde P(n) ne communique avec P(n+2) que par une chute ou un passage `secret`.

---

## 5. La chambre (P0)

Objets : lit, porte de chambre, porte-fenêtre de la terrasse, fenêtre, interrupteur, commode (*Top drawer* :
boîte de comprimés bleus ; *Bottom drawer* : flacon blanc, étiquette arrachée), borne d'arcade (jeu de fusion de fruits),
bureau (son carnet : « Her diary »), calendrier, poster, plante (si Pip…), tapis.

Variables persistantes : `light` (allumée/éteinte), `window` (ouverte/fermée), `door` (fermée/entrouverte).
Éveillée, elle ne sort jamais : la porte peut être entrouverte, mais elle secoue la tête.

Effets génériques en P1 (P2 = atténué) :
- **Lumière éteinte** : variante nocturne, rayon de vision réduit, portes invisibles (`cond.dark`), PNJ diurnes absents,
  PNJ nocturnes présents, certains indices deviennent des sons.
- **Fenêtre ouverte** : neige et vent, l'eau profonde gèle en glace (nouveaux chemins), objets légers déplacés,
  créatures frileuses cachées, créatures de neige présentes, congères bloquant certains passages.
- **Porte entrouverte** : murmure d'une télévision lointaine, portes entrouvertes dans certains mondes, le Tenant
  (W009) déplace des objets, les pas de la mère s'entendent avant qu'elle n'entre.

**La mère** : si la lumière est allumée au coucher, tirage 1/5. Si réussi, elle entre à un instant tiré entre
5:00 et 10:00 de rêve écoulé. Clic de l'interrupteur, le rêve bascule en nocturne pour le reste de la nuit.
Au réveil : lumière éteinte, un verre d'eau sur la table de nuit. Compteur `motherVisits`.
À la 3e visite, un mot en coréen glissé sous la porte (« 미안해 »). À la 5e, au réveil, une couverture en plus.
Elle n'est jamais vue : une main, un rectangle de lumière, des pas.

**Comprimés bleus** (5 max, +1 tous les 3 réveils normaux) : rêve de 20:00. Un par nuit.
**Flacon blanc** (7 max, +1 par réveil normal) : la nuit suivante est « aplatie » : couleurs ternes, musique plus basse,
perception des sorcières −30 %, certains PNJ ne disent que « … », la Plaine Égale (W0xx) devient accessible.
Rien n'explique d'où ils viennent ni qui les remplit.

**Borne d'arcade** : 4×4, fusion de fruits (cherry → strawberry → grape → tangerine → apple → pear → peach → pineapple →
melon → watermelon → ?). Atteindre la watermelon (pastèque) ouvre W169 (The Land of Fruit) depuis The Arcade (W015). Le fruit « ? » n'existe
qu'en mode debug.

---

## 6. Temps

- Phases : **ouverture** (100 %→70 % restant), **milieu** (70→40 %), **tardive** (40→10 %), **finale** (<10 %).
- Événements temporels types : train qui part à un instant précis (W002), PNJ des trente premières secondes,
  porte qui disparaît sous 2:00, créature visible après plusieurs minutes, pluie de milieu de rêve (W003),
  chats réunis sous 4:00 (W003), casino ouvert après l'ouverture (W032).
- **Heures réelles** (toujours suggérées par un indice) :

| Événement | Condition réelle | Indice |
|---|---|---|
| Fête des mères au Garden | dernier dimanche de mai (1er juin si Pentecôte) | Flowey (le jour même) : « Today someone is sitting by the stone. » ; calendrier entouré |
| The 23:71 Train (W192) | 23:00–23:59 réelles | Mr. Ahn : « It is twenty-three hundred, and a little dust past. » / « A great deal of dust. » |
| Le 23:71 arrive en gare (Q01) | 00:11–00:20 réelles *ou* horloge maîtresse (*master clock*) réglée sur 0:11 | « Twenty-three seventy-one. An hour that has overflowed. » |
| L'heure du loup (W1xx) | 03:00–03:59 | graffiti « At 3 a.m., even the wolves don’t sleep. » |
| Vœu (dire « wish ») des chiffres jumeaux | minute = heure (11:11, 22:22…) | Knock-Knock : « The clock’s stuttering! Quick, a wish! » |
| Pause déjeuner de la Glass Tower (W033) | 12:00–13:00 | panneau « 점심시간 12:00–13:00 » |
| 어버이날 (8 mai) | 8 mai | calendrier coréen de Manager Kim (W139), œillets rouges |
| Marée de pleine lune | pleine lune (calcul) | The Lighthouse Keeper : « The round moon pulls the water. » |
| École fermée | dimanche | panonceau « Closed on Sundays. » |

---

## 7. Sauvegarde

Deux couches strictement séparées :
- **Permanente** (validée au réveil normal) : effets, mondes découverts, PNJ rencontrés, relations, étapes de quête,
  portes débloquées, secrets, nids, état de la chambre, compteurs, biscuits possédés, comprimés.
- **Rêve en cours** (temporaire) : effets trouvés cette nuit, drapeaux, étapes, relations modifiées, biscuits trouvés,
  objets portés, découvertes, phrases dites, état des sorcières.

Réveil normal → fusion du rêve dans la permanente, décroissance de la corruption, recharge des comprimés.
Capture → le rêve est jeté. **Seules exceptions** (écrites directement en permanent car ce sont des cicatrices) :
la corruption laissée par la Priestess, le compteur de captures, la première rencontre avec une sorcière.

Robustesse : JSON + somme de contrôle FNV-1a, écriture sur clé principale puis copie de secours, validation des
identifiants au chargement, instantané du rêve toutes les 5 s (reprise après rechargement du navigateur, jamais
retour en arrière).

---

## 8. Effets

90 effets (E01–E90). 36 dans les mondes W001–W040 (on n'en exige que 30). Chaque effet :
apparence (calque ou transformation), action (touche F), capacités passives (`caps`), bruit, vitesse, lumière.
Familles : transformation, déplacement, végétation, musique, lumière, révélation, perception sonore, lecture,
PNJ, réalité, corruption, eau, ombres, portes.

Règles d'interaction :
- un seul effet équipé à la fois ;
- les effets bruyants (Skates, Bell, Microphone) attirent la Doorbell ;
- les effets lumineux (Lantern, Morse) attirent la Silent One ; les Fireflies non ;
- la corruption de niveau ≥3 peut **inverser** un effet (règle affichée par un tremblement de son icône) ;
- la Priestess peut **éteindre** l'effet équipé 15 s.

Les effets ne sont jamais expliqués : on ne voit qu'un nom, une icône et une phrase poétique.

---

## 9. Les cinq sorcières

Vérité cachée : chacune est **une règle de la maison**, apprise trop tôt. Leur « langue » est la règle déformée.

| | Nom | Règle cachée | Détection | Fuite | Langue (quand elle attaque) |
|---|---|---|---|---|---|
| I | The Silent One (ex-Silencieuse) | « hush, Mum is sleeping » | mouvement + changements de lumière ; immobile = invisible | rester immobile, obscurité, porte non vue | « Shh'ma ja… shh'ma ja… » |
| II | The Seamstress (ex-Couturière) | « sew it up, nobody must see » | suit la trace des portes empruntées | prendre une porte non recousue, Handle, Eraser sur les fils | « Nu-vé, nu-vé, ka-shé… » |
| III | The Copycat (ex-Copieuse) | « do what the others do » | se déguise en PNJ du monde ; attaque au contact | Pocket Mirror / Photo Booth la révèlent ; Mask la trouble | répète **à l'envers** la dernière phrase dite par la joueuse |
| IV | The Doorbell (ex-Sonnette) | « if someone rings, don’t open » | sons : course, feuilles brunes, cloche, parole, actions répétées | silence, Souffle, leurre sonore (Radio, Telephone) | « Vrou-pa… vrou-pa… dinn » |
| V | The Traveller (ex-Voyageuse) | « he will come back » | connaît la route habituelle ; attend à la porte la plus probable | changer d'itinéraire, chemins à sens unique, Thread | « Rèv'yen'dra, ommar dess… » |

Montée en puissance (jamais toutes d'un coup) : I active à 2 effets sauvegardés, IV à 5, III à 8, II à 12, V à 16.
Leur première apparition est une mise en scène (on les voit sans danger).
Elles se déplacent dans le réseau toutes les 25–60 s, entrent par une vraie porte (jamais d'apparition à l'écran),
et sont plus actives en phase tardive et finale.

Capture : visage en gros plan, cri synthétique, distorsion, phrase dans sa langue, réveil, perte du non-sauvegardé.
Un biscuit, s'il y en a, est consommé : la sorcière est repoussée dans un monde voisin, 3 s d'invulnérabilité.

---

## 10. La Grande Prêtresse (The High Priestess)

Fonction cachée (la seule vérité, jamais dite) : **ce qui efface pour que tout aille bien.**
Elle corrige, censure, lisse, fait taire. Elle porte un voile de journaux barrés de noir et une robe blanche
(blanc du deuil coréen, 소복). Symbole : un œil fermé barré.

Interprétations soutenues par des indices contradictoires (aucune n'est confirmée) :
1. **La mère** (« 괜찮아 », « it’s all right ») — Happiness Station : on l'appelle 어머님.
2. **Sora adulte** qui efface les rêves de son propre enfant — The 44th Floor (W139) : « She no longer sleeps. »
3. **La grand-mère morte** (robe de deuil) — Garden : Flowey dit « She cuts the flowers. »
4. **La dépression** — The Sleep Factory (W007) : « PROTOCOL 0 ».
5. **Le Parent de la nation** (어버이, the Parent) — The Censorship Archives (W110).

Règles (observables, apprenables) :
- apparaît seulement si ≥20 effets sauvegardés ou après une visite en P3+ ; plus probable en profondeur et en fin de rêve ;
- attirée par les mondes les plus visités (« elle vient là où tu aimes aller ») ;
- signes 15–30 s avant : PNJ figés, musique ralentie, symboles aux murs, silence, une porte au mauvais endroit ;
- vitesse ×1,6, perception 12 cases, ignore l'obscurité ;
- toutes les 10 s, un pouvoir : fermer un passage non essentiel, fausse porte, alerter toutes les sorcières,
  éteindre l'effet équipé, inverser les commandes ;
- **verrouillage** : trois cloches en 3 s ; casser la ligne de vue avant la troisième annule ; après la troisième,
  son étreinte ignore les biscuits (bord d'écran violet + icône de biscuit fêlée) ;
- les cachettes la trompent si elle était à plus de 4 cases ; la berceuse (jouée avec Melody) l'immobilise 3 s une fois par rencontre ;
- capture : l'écran est barré ligne par ligne, des fragments « EVERYTHING IS FINE » ; corruption +2 ici, +1 aux voisins ;
- chaque passage en présence de la joueuse laisse +1 de corruption persistante.

---

## 11. Corruption

Couche réversible (`overlay`), jamais écrite dans la définition du monde.

- **Locale (sorcières)** : monte de 0 à 2 pendant que la sorcière est dans le monde, disparaît à la sortie.
- **Persistante (Priestess)** : niveau 1–5 par monde, sauvegardé ; −1 par réveil normal si elle n'est pas revenue ;
  stabilisation : interagir avec l'**ancre** du monde (statue, horloge maîtresse, cloche…) avec la berceuse ou Melody,
  ou certaines actions de quête.

| Niveau | Nom | Effets |
|---|---|---|
| 1 | Fissures | teintes qui glissent, scintillements, mots rares barrés |
| 2 | Glissements | objets déplacés, une porte secondaire cachée, répliques à trous █, musique désaccordée |
| 3 | Déchirures | palette inversée par zones, collisions non essentielles modifiées, PNJ figés, fausses portes, effets inversables |
| 4 | Réécriture | changement de style (pixel → fusain…), PNJ hostiles (−30 s), commandes miroir |
| 5 | Effacement | décor barré, seul le chemin essentiel reste (trace blanche), dialogues entièrement censurés |

Chaque monde a un **profil** : une gare corrompue dérègle ses horloges et ses annonces ; une forêt fait marcher ses
arbres ; un monde monochrome s'inverse ; une école efface ses tableaux ; un monde coréen du Nord ajoute des haut-parleurs.

**Invariant** : la corruption ne touche jamais aux marques `essential` (validé par les tests).

---

## 12. PNJ, langues et écritures

- **Français** : absent du jeu. Aucun habitant ne parle français ; l'interface et la narration sont en **anglais** (voir `docs/lore_canon.md`).
- **Anglais** : télévision, arcade, casino, opératrices, hôtel. Accent de la « fenêtre sur dehors ».
- **Coréen du Sud** (`ko-s`) : politesse d'entreprise (수고하셨습니다, 괜찮습니다, 야근, 회식, 칼퇴, 학원, 빨리빨리),
  technologie (hologrammes, drones, AR). Orthographe standard du Sud (노동, 이, 여자).
- **Coréen du Nord** (`ko-n`) : 동무, 일없습니다 (« never mind », « it’s nothing »), 인민, 로동 (ㄹ initial conservé), 력사, 렬차,
  formules de bonheur obligatoire (세상에 부럼 없어라). Jamais de dirigeant réel nommé : on dit « 어버이 » (the Parent).
  Sans caricature : des gens polis, fatigués, qui ont appris à sourire.
- Traduction : l'effet **Earpiece** (ex-Oreillette, Glass City) affiche la traduction anglaise des paroles coréennes (Sud et Nord) — réglage *Translate speech* : never / with the Earpiece / always ; l'**Ink** (ex-Encre) révèle
  le texte barré. La progression principale n'exige jamais de parler coréen (boutons ✔/✖, gestes, pictogrammes).
- **Vallonian** (ex-vallonnais ; W012, the nameless people) : langue inventée CV, accent tonique final ; mots qui disparaissent.
- **Chuchote**, **Fil**, **Écho-inverse**, **Sonnerie**, **Voie** : langues des sorcières (règles déformées).
- **L'écriture ancienne** : 26 glyphes, substitution simple de l'anglais (lettres a–z). Jamais nommée langue :
  « Signs are carved here. » Pierres de Rosette dispersées (Station of the Missing Hours, Empty School, The Library of Blank Books,
  The Lightless Room).
  Texte de la salle des nids (The Nest Room, déchiffré) :
  `HERE SLEEP THE THINGS THAT YOU HAVE KEPT. WHEN THIRTY ARE LAID DOWN THE OUTSIDE DOOR WILL LISTEN.
   IN THE DARK SAY THE NAME OF THE ONE WHO WAITED AT THE STATIONS : OKSUN`
- Communications non verbales : abeilles qui dansent (W042), mime (W020), lumières aux fenêtres (W059).

---

### Les âmes (à la place des panneaux)
Il n'y a plus de panneaux ni de pierres gravées dans les rêves (sauf les parois de la salle des nids). À leur place,
des **âmes** : des silhouettes de buée qui flottent, donnent leur message une seule fois, puis se défont. Le jeu ne
réaffiche pas le message (le journal a été retiré). Elles parlent anglais ou coréen, comme les habitants. Elles portent l'essentiel
du lore : fragments, témoignages, règles dites à demi-mot. Elles se trompent parfois.

## 13. La parole de la protagoniste

Touche T : on tape une phrase, elle la dit (bulle 3 s). Bruit pour la Doorbell ; mémorisée par la Copycat.
Écouteurs : PNJ à moins de 4 cases, marques `listen`, mécaniques de monde. Comparaison normalisée
(minuscules, sans accents, hangul conservé) ; les mots attendus sont en anglais (ou en coréen). Usages : mots de passe, réponses à des devinettes, noms,
restaurer les mots du peuple sans nom, chanter (« do re mi »), dire « good night », parler coréen aux PNJ coréens.
Éveillée : « … » (règle 8). Après les conditions de la Fin II, sa voix revient dans la chambre.

---

## 14. Lore : faits réels (jamais dits)

### Personnes
- **Sora (소라)**, 12 ans, la protagoniste. Ne parle presque plus depuis la mort de sa grand-mère. Appelée « the mute girl » (ex-« la muette ») à l'école.
- **Kim Mi-ran (김미란)**, sa mère, née à Séoul en 1980, en France depuis 2008, aide-soignante de nuit.
  Épuisée, déprimée, aimante mais absente. Dit toujours « 괜찮아 » (« it’s all right »). Elle éteint parfois la lumière.
- **Le père** : parti quand Sora avait 6 ans, avec une valise marquée « J. ». Il racontait des blagues « knock knock ».
- **Ahn Ok-sun (안옥순)**, la grand-mère (halmeoni), née en 1942 au Nord, séparée de son grand frère **Ahn Jae-sik**
  sur un quai de gare en 1951. A élevé Sora pendant les nuits de Mi-ran. Jardinait, sifflait aux merles,
  chantait 자장자장. Morte quand Sora avait 9 ans. La statue « In memory of Mum » est le deuil **de Mi-ran**.
- **Kim (le grand-père)**, salarié à Séoul dans les années 80–90, jamais rentré avant minuit : Mi-ran enfant l'attendait.

### Ce que les rêves en font
- **Mr. Ahn** (Station of the Missing Hours) = Jae-sik, tel que halmeoni le racontait. Il attend le train vers sa sœur.
- **Manager Kim, 김 과장** (The Glass Tower) = le grand-père. La photo de son bureau : une petite fille, badge « 미란 ».
- **Station of the Missing Hours** (ex-« Gare des heures absentes ») = les heures où la mère est absente (21 h–7 h).
- **Happiness Station** = le pays de halmeoni tel que la télévision le montre, et la règle « everything is fine » de la maison.
- **La Glass City** (ex-« Ville de Verre ») = le pays de Mi-ran tel que les appels vidéo le montrent : travail, examens, écrans.
- **The Garden** = le jardin partagé de halmeoni. Flowey = la fleur qu'elles ont plantée ensemble.
- **Knock-Knock** (ex-Toc-Toc) = les blagues du père. La dernière n'a jamais eu de chute.
- **Laboratory 6** (W120) = l'examen du sommeil (polysomnographie) passé à l'hôpital de Mi-ran. « Subject S. ».
- **Ondine** (toilettes, Cubicle 3) = une autre enfant **ou** Sora elle-même (les deux lectures sont tenues).
- **The Big Laugh** (ex-« le Grand Rire ») = le harceleur, négligé chez lui (télévision toujours allumée, personne). Adulte, il hurle sur ses employés (W131).
- **Nour** = l'amie d'école primaire partie dans une autre ville.
- **Les lettres** : « M. » (Mi-ran enfant, Séoul 1989) et « S. » (Sora adulte, 2044, surmenée, qui ne voit plus son enfant).

### Chronologie interne
| Année | Fait |
|---|---|
| 1942 | Naissance d'Ok-sun au Nord |
| 1951 | Ok-sun et Jae-sik séparés sur un quai |
| 1980 | Naissance de Mi-ran à Séoul |
| 1989 | Mi-ran, 9 ans, attend son père chaque nuit (lettres de « M. ») |
| 2008 | Mi-ran part en France |
| 2014 | Naissance de Sora |
| 2020 | Le père part |
| 2023 | Mort d'Ok-sun. Sora cesse presque de parler. Statue (dans le rêve) |
| 2025 | Harcèlement. Examen du sommeil (Laboratory 6) |
| 2026 | Le présent du jeu |
| 2044 | Lettres de « S. » (futur possible) |

### Croyances des personnages (fausses ou partielles, volontaires)
- Mr. Ahn croit que le train est « running a little late ». (Faux : il n'existe que si on le fait exister.)
- Ri Myong-hui croit, ou dit croire, que personne n'a jamais disparu. (Mensonge appris.)
- Flowey affirme que la statue est « nobody’s statue ». (Mensonge protecteur.)
- Le chef de gare mécanique (The Stationmaster) : « The 23:71 line has never existed. » (Erreur sincère : elle est hors horaire.)
- Les enfants-sacs (bag-head children) disent que the mute girl « asked for it ». (Mensonge collectif.)
- La bibliothécaire dit que « The white books have always been white. » (Erreur : ils ont été effacés.)
- Thalie croit que le Maze a une sortie vers « the real world ». (Ambigu : la sortie mène plus bas.)

---

## 15. Personnages majeurs (voix, habitudes, défauts, arcs)

| ID | Nom | Monde | Voix | Habitude | Défaut | Désir | Arc |
|---|---|---|---|---|---|---|---|
| N001 | Flowey | W001 | phrases courtes, compte tout | compte les visites | possessif, menteur protecteur | voir les autres jardins | Q11 |
| N002 | Mr. Ahn | W002 | coréen du Nord d'avant 1951, très poli, s'excuse | cire ses chaussures au mouchoir | déni, entêtement | revoir Ok-sun | Q01 |
| N003 | Pip (ex-Pépin) | W001/W028 | phrases sans fin, jeux de mots de jardin | recompte ses graines | n'ose jamais planter | savoir ce qu'il devait faire pousser | Q02 |
| N004 | Gaston le facteur lent | W003… | très lent, pompeux | tamponne tout | arrive toujours trop tôt ou trop tard | « que chaque lettre arrive » | Q03 |
| N005 | Elder Ouma | W012 | proverbes (Vallonian) | tisse des mots | résignée | que le village se souvienne | Q04 |
| N006 | The Tenant (ex-Locataire) | W009 | jamais vu ; sifflote | range | disparaît si on le voit | que la maison reste prête | Q05 |
| N007 | Knock-Knock (ex-Toc-Toc) | partout | camelot, rimes, malapropismes, « Boss » | frappe sur tout | ne finit rien, ment sur ses succès | faire rire « the Spectator » | Q06 |
| N008 | Nour | partout | sèche, sarcastique | écrit sur son bras | refuse l'aide | retrouver « home » | Q07 |
| N009 | Ondine | W096/W004 | chuchote | plie des grues | se cache | qu'on lui parle doucement | Q08 |
| N010 | The Big Laugh | W030/W095 | fort, cruel, drôle méchamment | imite les autres | méchanceté apprise | qu'on le regarde | Q08 |
| N011 | 김 과장 | W033/W139 | coréen d'entreprise | dort debout, 아아 | ne sait pas dire non | rentrer avant que sa fille dorme | Q09 |
| N012 | 리명희 동무 | W035 | coréen du Nord, formules | recolle les journaux | dénonce, sourit | pleurer, retrouver 철이 | Q10 |
| N013 | Thalie | W031 | brève, compétitive | trace les jours au mur | méprise « the new ones » | sortir | Q12 |
| N014 | Wick (ex-Mèche, ver luisant) | W021 | timide, s'éteint quand elle a peur | — | — | retrouver sa lumière | — |

Relations : Flowey ↔ Pip (vieux amis brouillés : Pip n'a jamais planté Flowey) ; Knock-Knock ↔ Nour (il l'agace, elle
le protège) ; Mr. Ahn ↔ Ri Myong-hui (elle connaît son nom, il ne la reconnaît pas) ; The Big Laugh ↔ Ondine ↔ Thalie
(Thalie était au même collège ; elle n'a rien fait) ; 김 과장 ↔ Gaston (il porte les lettres de « M. »).

Règles d'écriture : chaque personnage a un tic verbal, une contradiction, et au moins un dialogue qui change après
une découverte ailleurs. Pardonner n'est pas oublier. Aider l'un peut blesser l'autre (aider Thalie à partir attriste
le Glade ; montrer la photo à Myong-hui attire la Priestess).

---

## 16. Les arcs (12 + 2 méta)

Voir `data/quests.js` (source de vérité, étapes et conséquences implémentées) et le wiki.
Q01 The Last Passenger · Q02 The Gardener Without a Garden · Q03 The Impossible Correspondence · Q04 The Nameless People ·
Q05 The House That Waits · Q06 Knock-Knock and the Grand Show · Q07 The Road Home · Q08 The Playground ·
Q09 야근 · Q10 The Painted Smile · Q11 Flowey and the Seasons · Q12 The Cartographer of the Maze ·
M1 Mum’s Lights · M2 The Priestess’s Names.

---

## 17. Fins

| Fin | Nom | Conditions |
|---|---|---|
| I | The Terrace | 30 effets couchés dans les nids → au réveil, la porte-fenêtre s'ouvre seule |
| II | The Door | Fin I disponible **et** sa voix est revenue : Q04 résolue (le village reparle), lettre de M. remise à S. (Q03), Ondine sortie (Q08), la voix de la mère entendue (W187, fête des mères ou 5 visites). Elle peut alors parler à la porte de la chambre. Les deux portes sont ouvertes : la joueuse choisit. |
| III | The Sixth Sleep | se coucher dans le dernier lit de W193 |
| IV | █████ | écrire END avec des caractères dans W191 |

La Fin I est traitée sans aucune image explicite (lumière blanche, terrasse vide, vent). Elle est suivie d'un message
de prévention. La Fin II montre une cuisine éclairée, une mère endormie sur la table en tenue de travail, et Sora
qui pose une couverture sur elle (écho de la lumière éteinte).

---

## 18. Secrets à ne pas révéler tôt

- Le nom de Sora (seulement : étiquette d'école grattée « S_ra », dossier « Subject S. », plaque de W159).
- Le lien Kim 과장 = grand-père (photo lisible seulement avec Glasses, en P2+).
- Que la statue est le deuil de Mi-ran (seulement en P4 : W159, plaque « 안옥순 »).
- La fonction de la Priestess (jamais).
- Le déchiffrement de l'écriture (jamais confirmé dans le jeu).
- Le lien des sorcières avec les règles de la maison (seulement par leurs langues et quelques objets).

---

## 19. Conventions artistiques

Résolution interne 320×240, tuiles 16 px, personnages 16×24. Styles (`style.renderer`) :
`pixel16`, `pixel8`, `hires`, `charcoal`, `crayon`, `watercolor`, `engraving`, `mono`, `collage`, `painting`,
`silhouette`, `pattern`, `psychedelic`, `dark`, `void`, `realistic`, `ascii`.
Vues (`style.view`) : `top`, `side` (plateforme), `iso`, `fps` (raycast), `wire`.
- P1 : couleurs du quotidien, pixel art lisible.
- P2 : textures d'enfance (crayon, fusain, aquarelle).
- P3 : géométrie impossible, monochromes, miroirs, perspectives.
- P4 : psychédélisme, corps, vitraux, voix.
- P5 : couleurs sans nom, formes avant les formes, presque rien.
Pas de flashs rapides à fort contraste ; option de réduction des mouvements, distorsions et flashs (*Reduce motion*, *Reduce distortion*, *Reduce flashes*).

Musique : procédurale par défaut (boucles de 8 mesures, fondus à puissance constante), remplaçable fichier par fichier
(`src/audio/music_config.js`). Certains mondes n'ont aucune musique : le silence est un choix.

---

## 20. Règles de génération procédurale

- Graines stables : `hash(worldId) ^ seedSalt` ; en P3+, `^ dreamNumber` pour les arrivées.
- Les marques essentielles (portes obligatoires, effets) sont posées **après** la génération sur des cases accessibles
  vérifiées par parcours (BFS) ; si la génération échoue, on régénère (max 20 essais) puis on retombe sur une carte sûre.
- Mondes infinis : tronçons 32×32, cache LRU borné (64 tronçons), repères déterministes par tronçon.
- La génération complète le level design : les mondes du cœur sont dessinés à la main, les générateurs servent aux
  labyrinthes, plaines, boucles et réseaux.

---

## 21. Secrets dans les fichiers, debug, triche

- Commentaires et fichiers cachés (voir `docs/secrets.md`, qui n'est **pas** destiné aux joueurs).
- Debug : déverrouillé en disant « ascii » au Nexus dans le noir (indice en hexadécimal dans `index.html`),
  ou `?debug` dans l'adresse (développeur). F9 bascule le rendu ASCII ; ` ouvre la console.
- `set <n>` : la case devant soi devient le caractère `n` (temporaire). Cas spéciaux : `set 68` (D) sur un mur crée une
  porte vers W191 ; `set 7` (BEL) fait sonner la Doorbell ; `set 27` (ESC) réveille ; `set 127` (DEL) efface l'entité
  devant soi ; `set 0` (NUL) ouvre un trou vers P5 dans un monde P4.
- Les modifications de debug ne sont jamais sauvegardées. W191 n'est accessible que par `set 68`.
