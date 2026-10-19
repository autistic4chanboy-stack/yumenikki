/* =========================================================================
 *  CONFIGURATION CENTRALE DE LA MUSIQUE ET DES SONS
 *  ------------------------------------------------------------------------
 *  Pour remplacer une musique : déposez votre fichier dans assets/audio/music/
 *  puis renseignez `file` (chemin relatif à index.html). Exemple :
 *
 *     garden: { file: 'assets/audio/music/garden.ogg', loopStart: 2.0, loopEnd: 94.5, gain: 0.8, proc: {...} }
 *
 *  - Formats : .ogg (recommandé), .wav, .mp3 (repli).
 *  - loopStart / loopEnd (secondes) : points de boucle sans coupure
 *    (nécessite de lancer le jeu via un petit serveur local, voir README).
 *  - Si le fichier manque ou ne se charge pas, la version procédurale `proc`
 *    est jouée et un avertissement est inscrit dans la console de debug.
 *  - `fade` : durée du fondu enchaîné (secondes) quand on entre dans le monde.
 *  - Une musique `null` (ou un monde sans musique) = silence voulu.
 *
 *  Les mondes référencent ces identifiants (champ `music` de chaque monde).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  YN.musicConfig = {
    defaults: { fade: 2.5, gain: 0.8 },
    tracks: {
      title:      { file: null, proc: { key: 57, scale: 'aeolian', bpm: 58, seed: 'title', reverb: 0.7, lowpass: 3200, layers: [{ inst: 'pad', role: 'pad', oct: -1, vol: 0.35 }, { inst: 'musicbox', role: 'melody', oct: 1, density: 0.35, vol: 0.4 }, { inst: 'noise', role: 'texture', type: 'tape', vol: 0.05 }] } },
      room:       { file: null, proc: { key: 60, scale: 'major', bpm: 52, seed: 'chambre', reverb: 0.4, lowpass: 2400, layers: [{ inst: 'piano', role: 'arp', oct: 0, density: 0.22, vol: 0.32 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.04 }] } },
      roomnight:  { file: null, proc: { key: 57, scale: 'aeolian', bpm: 44, seed: 'chambre-nuit', reverb: 0.5, lowpass: 1600, layers: [{ inst: 'piano', role: 'arp', oct: 0, density: 0.14, vol: 0.28 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.03 }] } },
      dreamroom:  { file: null, proc: { key: 58, scale: 'lydian', bpm: 50, seed: 'chambre-reve', reverb: 0.8, detune: 12, layers: [{ inst: 'glass', role: 'arp', oct: 1, density: 0.18, vol: 0.25 }, { inst: 'pad', role: 'pad', oct: -1, vol: 0.2 }] } },
      nexus:      { file: null, proc: { key: 53, scale: 'phrygian', bpm: 40, seed: 'nexus', reverb: 0.9, lowpass: 1800, layers: [{ inst: 'drone', role: 'drone', oct: -2, vol: 0.4 }, { inst: 'bell', role: 'bell', oct: 1, density: 0.08, vol: 0.25 }, { inst: 'choir', role: 'pad', oct: -1, vol: 0.12 }] } },
      effectroom: { file: null, proc: { key: 50, scale: 'dorian', bpm: 36, seed: 'nids', reverb: 1, layers: [{ inst: 'choir', role: 'pad', oct: 0, vol: 0.2 }, { inst: 'glass', role: 'bell', oct: 2, density: 0.06, vol: 0.2 }] } },
      darkroom:   null,
      garden:     { file: null, proc: { key: 62, scale: 'dorian', bpm: 72, seed: 'jardin', reverb: 0.5, lowpass: 3600, layers: [{ inst: 'pad', role: 'pad', oct: -1, vol: 0.22 }, { inst: 'musicbox', role: 'melody', oct: 1, density: 0.42, vol: 0.32 }, { inst: 'pluck', role: 'arp', oct: 0, density: 0.3, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'wind', vol: 0.05 }] } },
      gardennight:{ file: null, proc: { key: 59, scale: 'aeolian', bpm: 54, seed: 'jardin-nuit', reverb: 0.75, lowpass: 2000, layers: [{ inst: 'pad', role: 'pad', oct: -1, vol: 0.2 }, { inst: 'glass', role: 'bell', oct: 1, density: 0.12, vol: 0.22 }, { inst: 'noise', role: 'texture', type: 'crickets', vol: 0.06 }] } },
      gardensnow: { file: null, proc: { key: 64, scale: 'lydian', bpm: 48, seed: 'jardin-neige', reverb: 0.9, lowpass: 2600, layers: [{ inst: 'glass', role: 'melody', oct: 1, density: 0.3, vol: 0.26 }, { inst: 'pad', role: 'pad', oct: -1, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'wind', vol: 0.09 }] } },
      roots:      { file: null, proc: { key: 45, scale: 'phrygian', bpm: 46, seed: 'racines', reverb: 0.8, lowpass: 1200, layers: [{ inst: 'drone', role: 'drone', oct: -1, vol: 0.35 }, { inst: 'pluck', role: 'bell', oct: 0, density: 0.1, vol: 0.2 }, { inst: 'noise', role: 'texture', type: 'drip', vol: 0.08 }] } },
      station:    { file: null, proc: { key: 55, scale: 'mixolydian', bpm: 66, seed: 'gare', reverb: 0.85, lowpass: 2800, layers: [{ inst: 'organ', role: 'pad', oct: -1, vol: 0.14 }, { inst: 'bell', role: 'melody', oct: 0, density: 0.22, vol: 0.2 }, { inst: 'perc', role: 'perc', type: 'tick', density: 0.25, vol: 0.12 }, { inst: 'noise', role: 'texture', type: 'crowd', vol: 0.03 }] } },
      wagon:      { file: null, proc: { key: 52, scale: 'aeolian', bpm: 92, seed: 'wagon', reverb: 0.3, lowpass: 1500, layers: [{ inst: 'perc', role: 'perc', type: 'rail', density: 0.5, vol: 0.2 }, { inst: 'pad', role: 'pad', oct: -1, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'rumble', vol: 0.12 }] } },
      dusk:       { file: null, proc: { key: 57, scale: 'aeolian', bpm: 62, seed: 'crepuscule', reverb: 0.6, lowpass: 2600, layers: [{ inst: 'strings', role: 'pad', oct: -1, vol: 0.2 }, { inst: 'piano', role: 'melody', oct: 0, density: 0.3, vol: 0.28 }, { inst: 'noise', role: 'texture', type: 'city', vol: 0.04 }] } },
      school:     { file: null, proc: { key: 60, scale: 'major', bpm: 76, seed: 'ecole', reverb: 0.7, lowpass: 2200, detune: 18, layers: [{ inst: 'chip', role: 'melody', oct: 1, density: 0.3, vol: 0.12 }, { inst: 'piano', role: 'pad', oct: -1, vol: 0.14 }, { inst: 'noise', role: 'texture', type: 'tape', vol: 0.05 }] } },
      plainmono:  { file: null, proc: { key: 48, scale: 'wholetone', bpm: 34, seed: 'plaine', reverb: 1, lowpass: 900, layers: [{ inst: 'drone', role: 'drone', oct: -1, vol: 0.32 }, { inst: 'noise', role: 'texture', type: 'wind', vol: 0.06 }] } },
      appleforest:{ file: null, proc: { key: 65, scale: 'major', bpm: 88, seed: 'pommiers', reverb: 0.45, layers: [{ inst: 'pluck', role: 'arp', oct: 0, density: 0.45, vol: 0.22 }, { inst: 'flute', role: 'melody', oct: 1, density: 0.25, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'birds', vol: 0.04 }] } },
      musicforest:{ file: null, proc: { key: 60, scale: 'pentatonic', bpm: 80, seed: 'foret-musicale', reverb: 0.6, layers: [{ inst: 'musicbox', role: 'arp', oct: 1, density: 0.55, vol: 0.24 }, { inst: 'bass', role: 'bass', oct: -2, density: 0.5, vol: 0.2 }, { inst: 'bell', role: 'bell', oct: 2, density: 0.1, vol: 0.12 }] } },
      ocean:      { file: null, proc: { key: 62, scale: 'lydian', bpm: 56, seed: 'ocean', reverb: 0.8, layers: [{ inst: 'pad', role: 'pad', oct: -1, vol: 0.22 }, { inst: 'glass', role: 'melody', oct: 1, density: 0.2, vol: 0.2 }, { inst: 'noise', role: 'texture', type: 'sea', vol: 0.12 }] } },
      building:   { file: null, proc: { key: 51, scale: 'locrian', bpm: 70, seed: 'immeuble', reverb: 0.5, lowpass: 1800, layers: [{ inst: 'organ', role: 'arp', oct: 0, density: 0.3, vol: 0.12 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.08 }] } },
      house:      { file: null, proc: { key: 58, scale: 'minor', bpm: 60, seed: 'maison', reverb: 0.55, lowpass: 2000, layers: [{ inst: 'piano', role: 'melody', oct: 0, density: 0.2, vol: 0.24 }, { inst: 'perc', role: 'perc', type: 'tick', density: 0.25, vol: 0.08 }] } },
      suburb:     { file: null, proc: { key: 55, scale: 'major', bpm: 64, seed: 'quartier', reverb: 0.4, detune: 25, layers: [{ inst: 'musicbox', role: 'melody', oct: 1, density: 0.3, vol: 0.2 }, { inst: 'pad', role: 'pad', oct: -1, vol: 0.12 }] } },
      phones:     { file: null, proc: { key: 49, scale: 'minpent', bpm: 50, seed: 'telephones', reverb: 0.9, layers: [{ inst: 'noise', role: 'texture', type: 'wind', vol: 0.1 }, { inst: 'bell', role: 'bell', oct: 1, density: 0.05, vol: 0.12 }] } },
      village:    { file: null, proc: { key: 62, scale: 'hirajoshi', bpm: 70, seed: 'vallon', reverb: 0.5, layers: [{ inst: 'pluck', role: 'melody', oct: 0, density: 0.35, vol: 0.24 }, { inst: 'perc', role: 'perc', type: 'shaker', density: 0.3, vol: 0.08 }, { inst: 'drone', role: 'drone', oct: -2, vol: 0.18 }] } },
      charcoal:   { file: null, proc: { key: 53, scale: 'minor', bpm: 48, seed: 'fusain', reverb: 0.4, lowpass: 1400, layers: [{ inst: 'piano', role: 'arp', oct: -1, density: 0.2, vol: 0.26 }, { inst: 'noise', role: 'texture', type: 'paper', vol: 0.06 }] } },
      arcade:     { file: null, proc: { key: 60, scale: 'major', bpm: 128, seed: 'arcade', reverb: 0.2, layers: [{ inst: 'chip', role: 'arp', oct: 1, density: 0.7, vol: 0.12 }, { inst: 'chip', role: 'bass', oct: -1, density: 0.5, vol: 0.12 }, { inst: 'perc', role: 'perc', type: 'kick', density: 0.25, vol: 0.12 }] } },
      supermarket:{ file: null, proc: { key: 64, scale: 'major', bpm: 98, seed: 'supermarche', reverb: 0.3, detune: 30, lowpass: 2400, layers: [{ inst: 'organ', role: 'melody', oct: 0, density: 0.35, vol: 0.12 }, { inst: 'bass', role: 'bass', oct: -2, density: 0.4, vol: 0.12 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.06 }] } },
      marsh:      { file: null, proc: { key: 57, scale: 'dorian', bpm: 52, seed: 'marais', reverb: 0.7, layers: [{ inst: 'glass', role: 'arp', oct: 1, density: 0.2, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'frogs', vol: 0.06 }] } },
      fair:       { file: null, proc: { key: 55, scale: 'harmonic', bpm: 84, seed: 'fete', reverb: 0.6, detune: 35, layers: [{ inst: 'organ', role: 'melody', oct: 0, density: 0.4, vol: 0.14 }, { inst: 'perc', role: 'perc', type: 'clap', density: 0.12, vol: 0.06 }] } },
      laundry:    { file: null, proc: { key: 67, scale: 'lydian', bpm: 76, seed: 'linge', reverb: 0.6, layers: [{ inst: 'flute', role: 'melody', oct: 1, density: 0.3, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'wind', vol: 0.08 }] } },
      lake:       { file: null, proc: { key: 64, scale: 'aeolian', bpm: 46, seed: 'lac', reverb: 1, layers: [{ inst: 'glass', role: 'melody', oct: 1, density: 0.22, vol: 0.2 }, { inst: 'noise', role: 'texture', type: 'ice', vol: 0.05 }] } },
      casino:     { file: null, proc: { key: 58, scale: 'blues', bpm: 96, seed: 'casino', reverb: 0.4, layers: [{ inst: 'piano', role: 'arp', oct: 0, density: 0.45, vol: 0.2 }, { inst: 'bass', role: 'bass', oct: -2, density: 0.5, vol: 0.18 }, { inst: 'perc', role: 'perc', type: 'hat', density: 0.5, vol: 0.06 }, { inst: 'noise', role: 'texture', type: 'crowd', vol: 0.04 }] } },
      maze:       { file: null, proc: { key: 50, scale: 'phrygian', bpm: 84, seed: 'dedale', reverb: 0.5, lowpass: 2000, layers: [{ inst: 'perc', role: 'perc', type: 'kick', density: 0.25, vol: 0.12 }, { inst: 'strings', role: 'pad', oct: -1, vol: 0.18 }, { inst: 'noise', role: 'texture', type: 'stone', vol: 0.05 }] } },
      glasscity:  { file: null, proc: { key: 61, scale: 'minor', bpm: 110, seed: 'ville-de-verre', reverb: 0.35, lowpass: 3600, layers: [{ inst: 'chip', role: 'arp', oct: 1, density: 0.6, vol: 0.08 }, { inst: 'pad', role: 'pad', oct: -1, vol: 0.14 }, { inst: 'perc', role: 'perc', type: 'click', density: 0.5, vol: 0.06 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.05 }] } },
      happiness:  { file: null, proc: { key: 60, scale: 'major', bpm: 104, seed: 'bonheur', reverb: 0.95, lowpass: 3000, layers: [{ inst: 'organ', role: 'melody', oct: 0, density: 0.45, vol: 0.14 }, { inst: 'strings', role: 'pad', oct: -1, vol: 0.14 }, { inst: 'perc', role: 'perc', type: 'clap', density: 0.25, vol: 0.06 }] } },
      hospital:   { file: null, proc: { key: 56, scale: 'locrian', bpm: 40, seed: 'hopital', reverb: 0.75, lowpass: 1400, layers: [{ inst: 'perc', role: 'perc', type: 'beep', density: 0.125, vol: 0.1 }, { inst: 'drone', role: 'drone', oct: -1, vol: 0.22 }, { inst: 'noise', role: 'texture', type: 'hum', vol: 0.06 }] } },
      generic:    { file: null, proc: { key: 57, scale: 'aeolian', bpm: 60, seed: 'generique', reverb: 0.6, layers: [{ inst: 'pad', role: 'pad', oct: -1, vol: 0.2 }, { inst: 'bell', role: 'melody', oct: 0, density: 0.25, vol: 0.18 }] } }
    },
    /* Remplacement facultatif des effets sonores par des fichiers : sfx: { door: 'assets/audio/sfx/door.ogg' } */
    sfx: {}
  };

  /* Pistes partagées : un monde peut citer l'identifiant d'une autre. */
  YN.musicConfig.alias = {
    mono: 'plainmono', orchard: 'appleforest', forest: 'musicforest', swamp: 'marsh', market: 'supermarket', train: 'wagon',
    tower: 'glasscity', happystation: 'happiness', greybeach: 'ocean', desert: 'phones', suburb: 'suburb', yard: 'school',
    pool: 'ocean', doors: 'building', dollhouse: 'house', attic: 'house', greenhouse: 'garden', darkroom: 'roots'
  };
  /* Toute autre piste est composée à la volée, de façon stable, à partir de son nom :
     même nom = même musique, à chaque partie. Pour la remplacer, déclarez-la dans `tracks`. */
  YN.musicConfig.auto = function (id) {
    var h = 2166136261; for (var i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var pick = function (arr, k) { return arr[(h >>> k) % arr.length]; };
    var scales = ['aeolian', 'dorian', 'phrygian', 'lydian', 'minpent', 'harmonic', 'wholetone', 'locrian', 'mixolydian', 'hirajoshi', 'major', 'pentatonic'];
    var lead = ['musicbox', 'glass', 'piano', 'flute', 'bell', 'pluck', 'chip', 'organ'], bed = ['pad', 'drone', 'choir', 'strings', 'organ'];
    var tex = ['tape', 'hum', 'wind', 'rain', 'static'];
    return { file: null, auto: true, proc: { key: 45 + (h % 18), scale: pick(scales, 3), bpm: 34 + ((h >>> 7) % 60), seed: id, reverb: 0.4 + ((h >>> 11) % 6) / 10, lowpass: 1400 + ((h >>> 13) % 8) * 300, detune: (h >>> 17) % 3 === 0 ? 14 : 0,
      layers: [{ inst: pick(bed, 5), role: 'pad', oct: -1, vol: 0.22 }, { inst: pick(lead, 9), role: (h >>> 19) % 2 ? 'arp' : 'melody', oct: (h >>> 21) % 2, density: 0.12 + ((h >>> 23) % 5) * 0.05, vol: 0.28 }, { inst: 'noise', role: 'texture', type: pick(tex, 25), vol: 0.035 }].concat((h >>> 27) % 3 === 0 ? [{ inst: 'bass', role: 'bass', oct: -2, density: 0.25, vol: 0.2 }] : []) } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
