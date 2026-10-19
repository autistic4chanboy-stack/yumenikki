# Secrets — spoilers lourds

> À ne lire qu’après avoir joué. Le jeu ne confirme jamais rien de ce qui suit ; ce document dit seulement où sont
> les choses, pas ce qu’elles veulent dire.

## Secrets cachés dans les fichiers

| Où | Quoi |
|---|---|
| `index.html`, dernier commentaire | `41 53 43 49 49` (hexadécimal : « ASCII ») — « in the middle, when everything is off, out loud ». Dire *ascii* dans le Nexus, lumière de la chambre éteinte, ouvre le mode caractères. |
| `src/core/save.js`, ligne 15 | Un commentaire en base64 (en anglais) : « if you are reading this, the biscuit will not protect you from her. » — un avertissement à propos des biscuits et de la Priestess. |
| Console du navigateur au démarrage | « If you are reading this, she is still asleep. » |
| `assets/audio/music/README.txt` | L’heure du train de 23:71 (The 23:71 Train, W192) : « between eleven and midnight ». |
| `assets/audio/sfx/README.txt` | Silence (W189, ex-« Le Silence ») : rester immobile quarante secondes au centre. |
| `assets/audio/ambience/README.txt` | `4D 55 4D` (« MUM ») — indice du mot à dire à la porte au bout du couloir (W187, The Mother’s Voice) : « mum » (ou « mummy », « mama », « 엄마 »). |
| Écriture gravée | Les pierres et plaques gravées utilisent 26 glyphes générés une fois pour toutes. Le jeu ne dit jamais ce que c’est. Les déchiffrer est possible ; rien ne le valide. |

## Le mode caractères (debug)

- **S’ouvre** en disant « ascii » dans le Nexus quand la lumière de la chambre est éteinte, ou avec `?debug` dans
  l’adresse. Une fois ouvert, il reste disponible pour la partie.
- **F9** : tout devient caractères. **`** (la touche ² sur un clavier AZERTY) : console.
- `set N` (0–255) : la case en face de la protagoniste devient le caractère N, pour ce rêve seulement.
  - `set 68` (« D ») devant un **mur** : une porte tient debout → **W191**, l’espace en caractères (Fin IV : y écrire
    ou dire END).
  - `set 0` (NUL) en profondeur 4 ou plus : un trou vers la sixième couche (W183).
  - `set 7` (BEL) : la Doorbell (ex-Sonnette) arrive. `set 27` (ESC) : réveil. `set 127` (DEL) : efface l’habitant ou l’objet en face.
- Autres commandes : `help`, `tp ID`, `time mm:ss`, `give ID|all`, `witch ID`, `priestess`, `corrupt N`, `clean`,
  `room light|window|door`, `mother`, `hour HH:MM` (simule l’heure réelle), `flag`, `quest`, `stats`, `validate`,
  `seed`, `reveal`, `noclip`, `witchesoff`, `priestessoff`.
- Tricher se voit : la partie le retient (drapeau `cheated`).

## La sixième couche

- Entrées : **W181** (The Bed at the Bottom of the Water, Diving Suit équipé) et **W182** (The Room Below : Blue Pill,
  chambre inverse du dessin, au moins 8:00 restantes). Rien d’autre n’y mène, sauf `set 0` en mode caractères.
- Sept lits (W184–W190), puis le huitième (W193, The Last Bed, Fin III).
- W187 et W190 font revenir la voix de la mère pour la Fin II.

## Ce que disent les lieux (sans le dire)

- La statue du Garden (W001) est **안옥순 (Ahn Ok-sun, 1942–2023)**, la grand-mère de Sora — lisible seulement dans
  The True Statue (W159, ex-« Statue véritable »). En dessous : « 엄마, 미안해. — 미란 ». Le Garden est le deuil de la mère.
- **Mr. Ahn** (W002) est le grand frère d’Ok-sun, monté dans un train en 1951 ; il attend le suivant depuis.
- **김 과장** (W033, W139) est le grand-père : la photo de son bureau, un badge « 미란 ».
- La mère, **Kim Mi-ran**, aide-soignante de nuit. On ne la voit jamais : sa lampe de poche (W171), sa voix derrière
  une porte (W187), une silhouette (W190), une main près d’une table (Fin II).
- **S.** adulte, en 2044 (W135, W138, W172) : le cycle que les rêves montrent pour qu’on le casse.
- Les cinq sorcières sont les règles de la maison, brodées sur cinq oreillers (W180, The Witches’ Dormitory).
- La Priestess a cinq noms (arc M2, The Priestess’s Names). Aucun n’est confirmé.

## Événements à l’heure réelle

Voir `PROGRESSION.md`. Aucun n’est nécessaire pour finir.
