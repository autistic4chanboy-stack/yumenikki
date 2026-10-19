# Progression — comment finir THE DREAM ARCHIVE

> **Spoilers complets.** Le jeu n’explique que sa boucle ; ce document explique le reste.
> Généré par `node tools/build_docs.js` à partir des données — il suit le jeu tel qu’il est.
> Les noms (mondes, effets, habitants, arcs) et les mots à dire sont ceux du jeu, en anglais.

## La boucle

1. Dans la chambre (The Bedroom) : régler la lampe, la fenêtre, la porte (elles changent les rêves), éventuellement prendre un comprimé à la commode (*Top drawer* : boîte bleue, rêve plus long et plus profond ; *Bottom drawer* : flacon blanc, rêve plus doux), puis dormir.
2. Le rêve dure 10 minutes (20 avec le comprimé bleu). La chambre de rêve (The Dreamt Bedroom) mène au Nexus ; le Nexus aux mondes.
3. Les effets trouvés pendant la nuit ne sont gardés qu’au **réveil normal** (*the door to waking* au Nexus, *Wake up* sur le lit de la chambre de rêve, ou fin du temps). Une capture par une sorcière ou la Priestess jette la nuit — sauf si l’on a un biscuit.
4. Au Nexus, **coucher un effet dans un nid** le garde pour toujours (on ne peut plus l’équiper).
5. **Trente nids** : au réveil suivant, la porte-fenêtre s’ouvre (Fin I).

## Les 36 effets des quarante premiers mondes

Trente suffisent. Il y en a 36 : on peut en manquer six. Aucune énigme seule ne bloque la fin (vérifié par `tests/run.js`).

| Effet | Monde | Comment | Chemin depuis le Nexus |
|---|---|---|---|
| **Sprout** (E01 ; ex-Pousse) | The Garden (W001) | Le champ de feuilles du Garden : n’avancer que sur les feuilles vertes (silencieuses) jusqu’à la pousse. Alternatives : la nuit elle dort ; avec Feather, les feuilles brunes ne crissent plus. | W001 |
| **Blackbird Whistle** (E02 ; ex-Sifflet du merle) | The Garden (W001) | Le merle de la place de pierre montre quatre directions en sautillant (une note par saut) : les marcher dans l’ordre sur les dalles. Avec la neige, ses traces montrent l’ordre. | W001 |
| **Melody** (E03 ; ex-Mélodie) | The Garden (W001) | Les nénuphars de l’étang chantent : rejouer dessus l’air de la boîte à musique. La nuit, les lucioles montrent l’ordre. | W001 |
| **Fish** (E04 ; ex-Poisson) | The Garden (W001) | Le poisson de l’étang suit la berceuse jouée au bord. Alternative : lui offrir une pomme (*Apple*) de The Orchard (W006). | W001 |
| **Lantern** (E05 ; ex-Lanterne) | The Roots (W021) | The Roots : rendre à Wick (ex-Mèche) ses trois étincelles (*Spark*). Alternative : le crochet de The Lightless Room (W040). | W001 → W021 |
| **Umbrella** (E06 ; ex-Parapluie) | Town at Dusk (W003) | Town at Dusk : coincé dans une grille, il ne remonte qu’avec la pluie du milieu de rêve. Alternative : Knock-Knock le vend contre un biscuit (*Trade a biscuit*). | W003 |
| **Skates** (E07 ; ex-Patins) | The Night Supermarket (W017) | Night Supermarket, rayon 7 : la caissière ne les rend qu’à qui lui dit « good evening ». Alternative : un Token dans la machine à pinces. | W003 → W017 |
| **Ticket** (E08 ; ex-Billet) | Station of the Missing Hours (W002) | Station of the Missing Hours : le distributeur cassé (frapper trois fois) ou Mr. Ahn, si on lui donne l’heure. | W002 |
| **Chalk** (E09 ; ex-Craie) | Empty School (W004) | Empty School : s’asseoir au pupitre gravé « THE MUTE GIRL ». La craie tombe. | W004 |
| **Eraser** (E10 ; ex-Gomme) | The Charcoal World (W014) | The Charcoal World : coincer Crumb (ex-Mie, la mie de pain qui gomme) dans un cul-de-sac. | W004 → W014 |
| **Telephone** (E11 ; ex-Téléphone) | Desert of Telephones (W011) | Desert of Telephones : décrocher les combinés dans l’ordre de leurs sonneries (1, 2, 3, 4…). | W005 → W011 |
| **Keyring** (E12 ; ex-Trousseau) | District of Identical Doors (W010) | District of Identical Doors : la porte dont le numéro est dicté par la voix du désert. Alternative : porte de la chambre entrouverte → une porte est entrouverte aussi. | W003 → W010 |
| **Tiny** (E13 ; ex-Petite) | The Doll’s House (W023) | The Doll’s House : coucher la poupée-fille dans son lit, à l’étage. | W002 → W022 → W023 |
| **Glasses** (E14 ; ex-Lunettes) | The Library of Blank Books (W018) | The Library of Blank Books : les prendre à la bibliothécaire quand elle dort (lumière éteinte). | W004 → W018 |
| **Scarf** (E15 ; ex-Écharpe) | The Frozen Lake (W025) | The Frozen Lake : prendre la carotte (*Carrot*) de la flaque (fenêtre fermée), puis la rendre au bonhomme de neige (fenêtre ouverte). | W001 → W006 → W025 |
| **Mask** (E16 ; ex-Masque) | The Playground (W030) | The Playground : la poubelle derrière le préau, à la sonnerie. | W004 → W030 |
| **Token** (E17 ; ex-Jeton) | The Arcade (W015) | The Arcade : sous la borne du fond (avec Tiny) ou en battant la machine à rythme. | W003 → W015 |
| **Balloon** (E18 ; ex-Ballon) | The Closed Funfair (W020) | The Closed Funfair : refaire les gestes du mime. | W003 → W020 |
| **Cat** (E19 ; ex-Chat) | Town at Dusk (W003) | Town at Dusk : suivre le chat noir jusqu’à la réunion des chats, quand il reste moins de 4:00. | W003 |
| **Radio** (E20) | The Vigil Hospital (W027) | The Vigil Hospital : régler la radio des infirmières sur la fréquence du bracelet du lit 12. | W005 → W027 |
| **Pocket Mirror** (E21 ; ex-Miroir de poche) | The House That Waits (W009) | The House That Waits : le miroir de la salle de bain, lumière éteinte — le reflet le tend. | W003 → W008 → W009 |
| **Feather** (E22 ; ex-Plume) | The Laundry Sky (W024) | The Laundry Sky : le nid au sommet des cordes (plateforme). | W003 → W008 → W024 |
| **Hourglass** (E23 ; ex-Sablier) | The Endless Carriage (W022) | The Endless Carriage : la dame du septième wagon, qu’on n’atteint qu’en marchant vers l’arrière. | W002 → W022 |
| **Ink** (E24 ; ex-Encre) | The Complaints Office (W037) | The Complaints Office : occuper le censeur en lui disant une phrase à caviarder, prendre l’encrier. | W001 → W028 → W037 |
| **Bell** (E25 ; ex-Cloche) | Village of the Unknown Tongue (W012) | Village of the Unknown Tongue : dire à Elder Ouma (ex-l’Ancienne) la salutation que se font les villageois (« ouna-sé »). | W001 → W019 → W012 |
| **Blanket** (E26 ; ex-Couverture) | The Vigil Hospital (W027) | The Vigil Hospital : le lit vide de la chambre 3, quand The Night Watcher (la veilleuse) a le dos tourné. | W005 → W027 |
| **Fireflies** (E27 ; ex-Lucioles) | The Firefly Marsh (W019) | The Firefly Marsh : en attraper cinq en marchant (elles fuient la course). | W001 → W019 |
| **Ribbon** (E28 ; ex-Ruban) | The Musical Forest (W013) | The Musical Forest : jouer sous l’arbre-chef les trois notes des hauteurs de ses trois voisins. | W001 → W013 |
| **Compass** (E29 ; ex-Boussole) | The Maze (W031) | The Maze : rapporter à Thalie la carte d’un secteur avant la nuit. | W001 → W031 |
| **Dice** (E30 ; ex-Dé) | The Casino of Minutes (W032) | The Casino of Minutes : gagner une mise d’au moins 1:00, ou le trouver sous la roulette (Tiny). | W003 → W032 |
| **Paper Crane** (E31 ; ex-Grue de papier) | The Playground (W030) | Ondine : lui rapporter sept grues (*Paper Crane*) dispersées dans l’école et la cour, en lui parlant doucement. | W004 → W030 |
| **Earpiece** (E32 ; ex-Oreillette) | The Glass Tower (W033) | The Glass Tower : signer la livraison du robot (bouton ✔ « 네 »). | W002 → W033 |
| **Echo** (E33 ; ex-Écho) | The Empty Pool (W016) | The Empty Pool : dire un mot dans le grand bain, puis répéter le mot que l’écho renvoie à la place. | W004 → W016 |
| **Stamp** (E34 ; ex-Tampon) | Happiness Station (W035) | Happiness Station : le contrôleur le prête à qui chante l’hymne de la gare (Melody) ou montre un sourire. | W002 → W035 |
| **Watering Can** (E35 ; ex-Arrosoir) | The Winter Greenhouse (W028) | The Winter Greenhouse : aider Pip (ex-Pépin) à compter ses graines (le bon nombre est écrit sur les pots). | W001 → W028 |
| **Plushie** (E36 ; ex-Peluche) | The Toy Attic (W034) | The Toy Attic : la seule peluche sans poussière, cachée sous la boîte à jouets. | W004 → W016 → W034 |

## Ordre conseillé

- **Premières nuits** : le Garden (Sprout, Blackbird Whistle, Watering Can côté serre), la Station (Ticket), Town at Dusk, l’Empty School, le Village (Bell). Peu de sorcières tant qu’on a peu d’effets gardés.
- **Ensuite** : les effets qui ouvrent d’autres effets — Lantern (lieux sombres, phares), Fish (eau), Chalk (tableaux de l’École → deux mondes), Glasses (ce qui est caché), Compass (Maze).
- **Coucher tôt dans les nids** ce qu’on n’utilise plus : une capture ne peut plus le reprendre.
- Les sorcières se débloquent avec le nombre d’effets gardés (2, 5, 8, 12, 16). Un biscuit sauve d’une étreinte (pas de celle de la Priestess verrouillée).

## Les quatre fins

| Fin | Conditions |
|---|---|
| I — The Terrace | 30 effets dans les nids → au réveil, la porte-fenêtre s’ouvre ; au garde-corps : « Look at the sky ». Suivie d’un message de prévention. |
| II — The Door | Fin I disponible **et** sa voix revenue : Q04 résolue (cinq mots rendus à Elder Ouma), Q03 (lettre de M. remise au Postman of the Impossible, ex-« facteur des lettres impossibles »), Q08 (Ondine sortie de la cabine, Cubicle 3), voix de la mère entendue (W187 ou W190 ; ou fête des mères ; ou cinq visites de la mère). Éveillée, devant la porte de la chambre : lui parler. |
| III — The Sixth Sleep | Entrer dans la sixième couche par W181 (Diving Suit équipé) ou W182 (voir plus bas), dormir dans les sept lits, se recoucher dans le dernier (W193, The Last Bed). |
| IV — █████ | Mode caractères ; « set 68 » devant un mur ; dans l’espace en caractères (W191), écrire ou dire « END ». |

## La sixième couche (P5)

Deux entrées seulement :
- **W181 The Bed at the Bottom of the Water** (ex-« Le Lit au fond de l’eau ») — depuis The Inner Sea (W090) quand les trois phares sont allumés (W029, W088, W158, avec la Lantern) ou une nuit de pleine lune réelle ; aussi depuis The Stairs in the Dark (W143). S’allonger dans le lit demande le **Diving Suit** (E77, ex-Scaphandre ; dans The Wreck, W091).
- **W182 The Room Below** (ex-« La Chambre d’en bas ») — depuis la cave de The Apartment Block (W038) après une visite en profondeur 3 et avec le comprimé bleu. Le lit n’accepte que si la chambre est **l’inverse du dessin** accroché au mur (dessin : lampe allumée, fenêtre ouverte, porte fermée → donc lampe éteinte, fenêtre fermée, porte entrouverte), avec le comprimé bleu, avec au moins **8:00** de rêve restant.

## Les arcs

### Q01 — The Last Passenger
- `heard` — Le train de 23:71 existe. Il arrive quand l’heure déborde.
- `stub` — Un talon (*Ticket Stub*) composté trop tôt. Il porte bonheur aux gens qui attendent.
- `shoeFound` — Une chaussure d’enfant (*Little Shoe*), dans une barque échouée.
- `shoe` — La gauche. Celle d’Ok-sun. Elle pleurait pour la chaussure.
- `witness` — Quelqu’un, au sud, a vu la petite grandir.
- `aboard` — Le train de 23:71 roule vers 1951. Il est à bord.
- `stay` — Il est descendu de ce côté-ci. Sa montre n’a plus d’aiguilles.
- `gone` — Il est resté dans le train. Ses chaussures sont bien cirées.
- `home` — Sur un quai plein de fleurs, une vieille dame a levé la tête.
- *Au bout :* E38 Handless Watch (s’il reste)

### Q02 — The Gardener Without a Garden
- `met` — Un jardinier qui ne sait plus ce qu’il devait faire pousser.
- `seeds` — Une graine par endroit, là où quelque chose s’est passé.
- `statue` — Une petite avec un arrosoir trop grand, une dame qui sifflait aux merles.
- `lastseed` — La dernière graine se plante là où l’on dort.
- `end_room` — Il y a une pousse sur la terrasse. Elle n’était pas là avant.
- *Au bout :* une pousse sur la terrasse

### Q03 — The Impossible Correspondence
- `met` — Un facteur très lent cherche à qui est la lettre qu’il porte.
- `letter` — Une lettre de Séoul, 1989, signée M., dans la boîte du 1204.
- `delivered` — La lettre de M. est partie vers S., en 2044. Elle arrivera.
- `kept` — S. a répondu : « I don’t want to become what I’m becoming. » Je garde la lettre.
- *Au bout :* E40 Letter

### Q04 — The Nameless People
- `greeted` — Ouna-sé. La cloche de bois.
- `asked` — Les mots du village sont partis. Il faut les rapporter : cinq nœuds de laine.
- `resolved` — Mo-mo pala. Ils parlent. Ils m’ont demandé mon nom.
- *Au bout :* E41 Word · le village reparle

### Q05 — The House That Waits
- `thanked` — Quelqu’un range une maison pour quelqu’un qui ne vient pas.
- `rest` — Il a posé la valise. Il a arrêté de siffler. La maison dort.
- *Au bout :* la maison se repose

### Q06 — Knock-Knock and the Grand Show
- `met` — Il prépare un spectacle pour the Spectator (ex-« la Spectatrice »). Il lui manque la fin de la blague.
- `joke` — Un ticket (*Joke Ticket*) dans une malle « J. » : le début de la blague.
- `show` — La fin était dans la valise. Ce soir, the Grand Show.
- `laughed` — J’ai ri à la fin. Quelqu’un devait le faire.
- *Au bout :* E39 Laughter

### Q07 — The Road Home
- `met` — Une fille qui écrit sur son bras cherche « home » (ex-« chez elle »).
- `drawing` — Un dessin (*Drawing*) oublié : deux filles qui se tiennent la main devant une maison.
- `done` — Elle m’a donné une carte. Pour que je sache toujours où je suis.
- `class` — Quelqu’un a effacé le mot au tableau. Elle a rangé le feutre.
- *Au bout :* E37 Map

### Q08 — The Playground
- `met` — Derrière la porte de la cabine, quelqu’un plie des grues.
- `cranes` — Sept grues. Elle en a fait une seule, plus grande.
- `laughter` — Le grand qui rit : chez lui, la télé est toujours allumée.
- `adult` — Adulte, il crie sur tout le monde. « I was all alone too. That doesn’t excuse anything. »
- `out` — Ondine est sortie de la cabine. Elle a regardé la cour.
- *Au bout :* E31 Paper Crane · Ondine sort

### Q09 — 야근
- `daughter` — Il pense à sa fille tous les jours. Tous les jours, il est plus de minuit.
- `photo` — Sur son bureau, une petite fille, un badge : 미란.
- `home` — Il a éteint son écran. Il a essayé de dire non.
- *Au bout :* E32 Earpiece

### Q10 — The Painted Smile
- `photo` — Une photo de 철이. Le sourire peint s’est fendillé.
- `list` — Elle connaît le nom de Mr. Ahn : il était sur la liste.
- `tears` — Je lui ai dit qu’elle avait le droit de pleurer. Pas ici. Plus tard.
- `smile` — Elle a gardé son sourire. Elle m’en a donné un.
- *Au bout :* E42 Painted Smile

### Q11 — Flowey and the Seasons
- `snow` — Elle a voulu voir le froid des autres jardins.
- `night` — Elle ne voit rien la nuit. Elle a demandé qu’on reste.
- `flowers` — Des fleurs sur la pierre. Elle a dit la vérité une seconde.
- `seasons` — Trois saisons. « I don’t need to count your visits any more. I know you come back. »
- *Au bout :* Flowey arrête de compter

### Q12 — The Cartographer of the Maze
- `map1` — Une carte du secteur nord-est, faite avant la nuit. Une boussole.
- `out` — Dans The Unstable Maze (W151), la boussole s’est tournée vers elle. Elle a dit pardon à la muette (« the mute girl »).
- *Au bout :* E29 Compass

### M1 — Mum’s Lights
- `first` — Une nuit, quelqu’un a éteint la lumière.
- `three` — Trois fois. Des pas très doux, une couverture remontée.
- `five` — Cinq fois. Elle vient, même fatiguée.
- `dream` — Dans un rêve aussi, elle a éteint la lumière.
- *Au bout :* compte pour la porte

### M2 — The Priestess’s Names
- `one` — On lui donne un nom, quelque part.
- `three` — Trois noms. Ils ne se ressemblent pas.
- `five` — Cinq noms. Aucun n’est le bon. Tous le sont.
- *Au bout :* aucun

## Événements à l’heure réelle (jamais nécessaires)

- The Garden (W001) : Fête des mères (jour réel) : une silhouette assise près de la statue.
- Station of the Missing Hours (W002) : Les trains n’attendent pas : ils suivent le compte à rebours. Le soir réel (23 h–minuit), Mr. Ahn parle d’un autre train.
- Empty School (W004) : Dimanche réel : panneau de fermeture (« Closed on Sundays » ; l’école reste ouverte).
- The Glass Tower (W033) : Pause déjeuner réelle (12:00–13:00) : tout le monde est parti.
- Track Zero (W082) : 23:00–23:59 réelles : le train de 23:71.
- The Inner Sea (W090) : Pleine lune réelle : la marée découvre le chemin vers W181.
- The 23:71 Train (W192) : 23:00–23:59 réelles.
- Heure du loup (3 h–4 h) : un loup dans The Forest That Comes Back (W109). Indice : graffiti (« At three, even the wolves don’t sleep. »), Town at Dusk.
- Minute qui bégaie (11:11, 22:22…) : dire « wish » en rêve donne un biscuit. Indices : Knock-Knock (« The clock’s stuttering! Quick, a wish! »), The Clock Room (W081).
- 8 mai (어버이날) : des œillets dans The Glass Tower (W033). Indice : calendrier de The 44th Floor (W139).
- Vendredi 13 : une maison numéro 13 dans le District of Identical Doors (W010), vers Floor 13A (W142, ex-« Étage 13 bis »).
- 24–25 décembre : un sapin allumé dans l’Empty Neighbourhood (W008).
