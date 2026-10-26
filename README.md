# YUME NIKKI : THE DREAM ARCHIVE

Un jeu d’exploration de rêves jouable dans le navigateur, en pixel art, sans installation ni dépendance.
Une fille dort. Ses rêves sont un réseau de deux cents mondes. Le jeu n’explique que sa boucle.

> **Avertissement.** Ce jeu aborde la censure et la dictature, la négligence envers un enfant, le harcèlement et le
> suicide. Un écran d’avertissement s’affiche au premier lancement. Si tu traverses un moment difficile : en France, le
> **3114** (prévention du suicide, gratuit, 24 h/24), le **119** (enfance en danger), le **3018** (harcèlement).
> Ailleurs : [findahelpline.com](https://findahelpline.com).

---

## Lancer le jeu

Le plus simple, avec Node.js (n’importe quelle version récente, aucun paquet à installer) :

```bash
node tools/serve.js
```

puis ouvrir **http://localhost:8737/** dans Chrome, Edge ou Firefox.

Ouvrir directement `index.html` (double-clic) fonctionne aussi, mais certains navigateurs limitent alors le stockage
local et le chargement de fichiers audio : le serveur local est recommandé.

La progression est enregistrée dans le stockage local du navigateur (avec somme de contrôle, copie de secours et
instantané du rêve en cours). Effacer les données du site remet la partie à zéro ; le menu Settings le propose aussi (*Delete save*).

## Commandes

| Action | Clavier | Manette |
|---|---|---|
| Se déplacer (8 directions, libre) | Flèches ou ZQSD/WASD | stick gauche, croix |
| Courir | Shift | RB / RT |
| Agir, parler, ouvrir | Space / Enter | A |
| Retour, pause | Esc / Backspace | B / Start |
| Utiliser l’effet équipé | F | X |
| Liste des effets | Tab / I | Y |
| Parler (taper une phrase) | T | LB (puis clavier) |
| Carte (avec un certain effet) | M | — |
| Se pincer (se réveiller) | P / 9 | LT |

Les touches se remappent dans Settings → *Controls…*. Taper une phrase sert à parler aux habitants : certains mots ouvrent
des choses (en anglais ou en coréen). Le journal a été retiré du jeu : il n’y a plus de touche J.

Réglages utiles (Settings) :
- **Camera** : *direct* (par défaut — elle suit la protagoniste au pixel près, sans anticipation ni retard) ou *smooth*.
- **Camera shake** : *off* par défaut.
- **Pixel movement** : *on* par défaut — vitesse constante, un nombre entier de pixels par image (défilement
  parfaitement régulier) ; sur *off*, le déplacement retrouve une légère inertie.
- **Translate speech** : les habitants parlent anglais, coréen du Sud ou coréen du Nord ; la traduction anglaise des
  répliques coréennes s’affiche *never*, *with the Earpiece* (par défaut) ou *always*.

## La boucle (la seule chose que le jeu explique)

Dormir. Rêver. Trouver des effets. Les garder en se réveillant normalement. Les coucher dans les nids pour
toujours. Il y a quatre fins.

## Ce qui peuple les rêves

- **Les habitants** (459) parlent anglais, coréen du Sud ou coréen du Nord — jamais français. L’interface et la narration
  sont en anglais.
- **Les âmes** remplacent les panneaux : elles flottent, disent une phrase (deux au plus), puis se défont (le jeu ne
  les réaffiche plus : il n’y a plus de journal). Elles sont rares : en dehors des anciens panneaux, on en croise une
  dans quelques mondes seulement, et pas toutes les nuits.
- **Les artefacts** : 180 effets en tout. 90 d’entre eux traînent par terre, dans des recoins, des culs-de-sac, des
  coins sombres : on les voit scintiller de temps en temps. Aucun n’est nécessaire pour finir. La Blackbird Feather
  (ex-Plume de merle) et le Paper Rat (ex-Rat de papier) indiquent le plus proche. La salle des nids (The Nest Room)
  les expose en spirale, au centre, autour d’elle.
- **Les cartes** : les mondes générés sont grands, une trentaine bouclent sur eux-mêmes, les mondes en plein air se
  prolongent par une annexe, des passages latéraux relient les mondes voisins, et chaque carte est meublée selon son
  thème (petites scènes, lumières, détails au sol).
- **Chaque monde a son énigme et son secret**, écrits pour lui (fichiers `data/worlds/more_*.js`) ; les 40 premiers
  mondes en cachent beaucoup (3 à 6 de plus chacun). Dans les lieux fermés, portes et meubles vont contre les murs ;
  rien de solide ne bouche un passage, quelle que soit la nuit.
- **Les couches profondes font peur** : environ 300 habitants y sont redessinés (visages vides, cous trop longs,
  bouches pleines de dents, têtes couvertes d’yeux, silhouettes démesurées…), certains tremblent, se dédoublent ou
  se rapprochent quand on ne les regarde pas. Rien en P1 ; les lieux tendres restent tendres.
- **45 mondes sont psychédéliques exprès**, chacun à sa manière (ondes, respiration, tunnel d’échos, kaléidoscope,
  couleurs qui coulent). Les réglages *Reduce distortion / flashes / motion* calment tout.
- **Les effets se voient** : chacun change son allure, et une trentaine la rendent inquiétante ou psychédélique.

## Le wiki

Une encyclopédie autonome, générée depuis les données du jeu, avec la carte complète du réseau des mondes,
une vignette de chaque monde, la recherche, des filtres, et des spoilers masqués par niveau :

```bash
node tools/build_wiki.js
```

puis ouvrir **http://localhost:8737/wiki/dream_archive.html** (le fichier `wiki/dream_archive.html` s’ouvre aussi
directement). Servi depuis le même serveur que le jeu, l’option « My archive » n’affiche que ce que ta partie a
déjà vu (lecture seule de la sauvegarde).

## Mettre tes propres musiques (deux emplacements prêts)

Deux emplacements « musique perso » sont déjà branchés :

| Fichier à déposer dans `assets/audio/music/` | Joué dans |
|---|---|
| `perso1.ogg` (ou `.mp3`, `.wav`, `.m4a`) | le Nexus et la chambre de rêve (The Dreamt Bedroom) |
| `perso2.ogg` (ou `.mp3`, `.wav`, `.m4a`) | The Garden (W001) et The Night Garden (W136) |

Lance le jeu avec `node tools/serve.js` : il trouve le fichier tout seul et le joue en boucle, avec un fondu. Sans
fichier, la musique procédurale reste. Pour changer les lieux, modifie la liste `worlds` de `MC.custom` dans
`data/audio_plan.js`. N’y mets que des morceaux dont tu as les droits (les tiens, ou sous licence libre).

## La musique procédurale

Toutes les pistes sont composées en temps réel. Elles sont volontairement très dépouillées (deux ou trois voix au plus,
des mesures de silence) et très différentes d’un monde à l’autre : quatorze styles (berceuse de boîte à musique à trois
temps, piano feutré seul, cloches sur un bourdon, kalimba à cinq temps, harpe, marimba à sept croches, clarinette grave,
vibraphone, célesta, nappe seule, orgue jouet, flûte, pincements et battement de cœur, chœur lointain), et pour chaque
piste une acoustique : sèche, petite pièce, salle ou cathédrale. Une quarantaine de mondes n’ont **aucune musique** :
seulement leur ambiance et, de temps en temps, un petit bruit lointain (oiseau, voiture, plancher, goutte, carillon…).
Le plan (silences, emplacements, bruitages) est dans `data/audio_plan.js` ; les styles dans `src/audio/music_styles.js`.

## Remplacer les musiques et les sons

Toute la musique est **procédurale par défaut** (composée en temps réel par le moteur audio) : le jeu n’a besoin
d’aucun fichier. Pour mettre tes propres morceaux :

1. Dépose le fichier dans `assets/audio/music/` (format `.ogg` recommandé, `.wav` ou `.mp3` acceptés).
2. Dans `src/audio/music_config.js`, renseigne le champ `file` de la piste, par exemple :
   ```js
   garden: { file: 'assets/audio/music/garden.ogg', loopStart: 2.0, loopEnd: 94.5, gain: 0.8, proc: { ... } },
   ```
   - `loopStart` / `loopEnd` (secondes) : boucle sans coupure ;
   - `gain` : volume relatif ; `fade` : durée du fondu enchaîné à l’entrée du monde.
3. Si le fichier manque ou ne se charge pas, la version procédurale (`proc`) est jouée et un avertissement est
   écrit dans la console de développement — le jeu ne casse jamais.

Chaque monde indique sa piste dans son champ `music` (fichiers `data/worlds/*.js`). Les pistes qui ne figurent pas
dans `music_config.js` sont générées automatiquement à partir de leur nom ; pour leur donner un fichier, ajoute une
entrée du même nom dans `tracks`. `alias` permet de faire partager une piste à plusieurs mondes.
Les ambiances et effets sonores sont configurés au même endroit (`ambience`, `sfx`).

## Outils et tests

```bash
node tests/run.js
```
Suite de tests automatisés (75 vérifications) : comptes demandés, références, accessibilité de chaque monde,
placement des portes à pied, générateurs, sauvegarde et copie de secours, conditions d’heure réelle, maillons des
arcs, fins, mode caractères, attribution réelle de chaque effet.

```bash
node tools/validate.js
```
Tableau de bord : mondes enregistrés / implémentés / jouables / testés, profondeurs, habitants, effets, sorcières,
Priestess, générateurs, mondes à apparition, mondes infinis, passages, références cassées, fichiers audio manquants.

```bash
node tools/reach_maps.js
```
Vérifie, monde par monde, que chaque porte, effet et objet est joignable à pied depuis l’arrivée
(`--nights 8` : refait le contrôle sur huit nuits, puisque cachettes et objets changent chaque nuit).

```bash
node tools/content_audit.js --list
```
Pour chaque monde : ses énigmes, ses secrets écrits, ceux que le moteur creuse cette nuit, et les mondes à qui il en
manque.

```bash
node tools/door_audit.js --nights 3
```
Où tombent les portes : collées à une autre, sur l’arrivée, sans place devant, seules au milieu d’une pièce, coincées.

```bash
node tools/show_map.js W029 --night 3
```
Affiche la carte construite d’un monde (une nuit donnée) avec ses coordonnées, ses marques et ses habitants : utile
pour placer quelque chose à la main dans un fichier `data/worlds/more_*.js` (`YN.kit.more`).

```bash
node tools/build_docs.js
```
Régénère `PROGRESSION.md` (la marche à suivre complète, avec spoilers) depuis les données.

`tests/browser_smoke.js` (avec `tests/dev_harness.js`) traverse tous les mondes dans le vrai navigateur : à charger
dans la console de la page du jeu, puis `await __smoke('W001', 'W200')` et `__smokeReport()`.
`tests/browser_seams.js` vérifie au pixel près le raccord des 30 mondes qui bouclent : `__seams()`.

## Organisation

```
index.html            la page du jeu (liste des scripts, dans l’ordre)
src/core/             boucle, entrées, sauvegarde, conditions, actions, heure réelle
src/render/           pixel art (matériaux, personnages, décors), lumière, post-effets
src/world/            construction des mondes, générateurs, mécaniques, réseau, apparitions
src/systems/          habitants, dialogues, effets, sorcières, Priestess, corruption, fins, mode caractères
src/audio/            moteur audio procédural, configuration des musiques
src/ui/               menus, interface façon Undertale
data/                 effets, lore, 400 mondes (core_*, secret_*, new_*), habitants, histoires (stories/), collections, arcs, événements réels
wiki/                 encyclopédie générée
tools/                serveur local, validation, wiki, docs
tests/                tests automatisés et outils de test en navigateur
docs/                 bible du jeu, secrets
PROGRESSION.md        comment finir (spoilers)
STATUS.md             état réel de l’implémentation
```

## Documents

- `PROGRESSION.md` — la progression complète, les fins, la sixième couche (spoilers).
- `STATUS.md` — ce qui est fait, testé, et ce qui ne l’est pas.
- `docs/bible.md` — la bible de conception.
- `docs/secrets.md` — les secrets (spoilers lourds).

---

## 42 Origins (visualiseur de code)

Le dossier [`42origins/`](42origins/README.md) contient un projet indépendant : un visualiseur pas à pas de code C, Python et assembleur x86-64 (pile, tas, registres du processeur) avec 30 missions. Ouvrir `42origins/index.html`.
