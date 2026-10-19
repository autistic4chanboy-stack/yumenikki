/* =========================================================================
 *  STYLES MUSICAUX — des pièces très peu chargées et très différentes.
 *  Chaque monde sans piste écrite reçoit un archétype (tiré de son nom) :
 *  une berceuse à trois temps, un piano seul, des cloches lointaines, un
 *  ostinato à cinq temps… Parfois une grande réverbération, parfois rien
 *  du tout (sec, tout près de l'oreille), parfois une petite pièce.
 *  Les pistes déjà écrites gardent leur caractère mais sont allégées et
 *  réparties entre « sec », « pièce » et « salle ».
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, MC = YN.musicConfig;

  function H(id) { var h = 2166136261; for (var i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
  function pick(arr, h, k) { return arr[(h >>> k) % arr.length]; }
  var ROOMS = [0, 0, 0.12, 0.25, 0.45, 0.7, 0.9]; // sec, sec, pièce, pièce, salle, grande salle, cathédrale

  /* archétypes : (h) → proc */
  var STYLES = [
    // 1. berceuse de boîte à musique, à trois temps
    function (h) { return { scale: pick(['major', 'pentatonic', 'lydian'], h, 3), bpm: 60 + h % 18, steps: 12, sparse: 0.55, layers: [{ inst: 'musicbox', role: 'melody', oct: 1, density: 0.28, vol: 0.24 }, { inst: 'sinepad', role: 'pad', oct: -1, vol: 0.12 }] }; },
    // 2. piano seul, lent, beaucoup de silence
    function (h) { return { scale: pick(['aeolian', 'dorian', 'minpent'], h, 3), bpm: 40 + h % 14, sparse: 0.45, layers: [{ inst: 'felt', role: 'melody', oct: 0, density: 0.22, vol: 0.3 }, { inst: 'felt', role: 'bass', oct: -2, density: 0.1, vol: 0.18 }] }; },
    // 3. cloches lointaines sur un bourdon
    function (h) { return { scale: pick(['phrygian', 'hirajoshi', 'pelog'], h, 3), bpm: 30 + h % 12, sparse: 0.5, layers: [{ inst: 'drone', role: 'drone', oct: -2, vol: 0.18 }, { inst: 'bell', role: 'bell', oct: 1, density: 0.25, vol: 0.12 }] }; },
    // 4. kalimba à cinq temps
    function (h) { return { scale: pick(['pentatonic', 'minpent', 'dorian'], h, 3), bpm: 70 + h % 24, steps: 20, sparse: 0.6, layers: [{ inst: 'kalimba', role: 'arp', oct: 0, density: 0.3, vol: 0.26 }, { inst: 'bass', role: 'bass', oct: -2, density: 0.15, vol: 0.14 }] }; },
    // 5. harpe et rien d'autre
    function (h) { return { scale: pick(['lydian', 'major', 'mixolydian'], h, 3), bpm: 52 + h % 20, sparse: 0.5, layers: [{ inst: 'harp', role: 'arp', oct: 0, density: 0.25, vol: 0.24 }] }; },
    // 6. marimba en sept croches, presque une comptine
    function (h) { return { scale: pick(['major', 'pentatonic', 'dorian'], h, 3), bpm: 84 + h % 30, steps: 14, sparse: 0.55, layers: [{ inst: 'marimba', role: 'melody', oct: 0, density: 0.3, vol: 0.24 }, { inst: 'marimba', role: 'bass', oct: -1, density: 0.12, vol: 0.14 }] }; },
    // 7. clarinette grave, très lente
    function (h) { return { scale: pick(['harmonic', 'aeolian', 'phrygian'], h, 3), bpm: 38 + h % 12, sparse: 0.45, layers: [{ inst: 'clarinet', role: 'melody', oct: -1, density: 0.2, vol: 0.18 }, { inst: 'sinepad', role: 'pad', oct: -2, vol: 0.1 }] }; },
    // 8. vibraphone de nuit
    function (h) { return { scale: pick(['dorian', 'minpent', 'mixolydian'], h, 3), bpm: 56 + h % 16, sparse: 0.5, layers: [{ inst: 'vibes', role: 'melody', oct: 0, density: 0.22, vol: 0.2 }, { inst: 'bass', role: 'bass', oct: -2, density: 0.12, vol: 0.14 }] }; },
    // 9. célesta et verre, comme une veilleuse
    function (h) { return { scale: pick(['lydian', 'wholetone', 'pentatonic'], h, 3), bpm: 48 + h % 16, sparse: 0.5, layers: [{ inst: 'celesta', role: 'arp', oct: 1, density: 0.22, vol: 0.18 }, { inst: 'glass', role: 'bell', oct: 1, density: 0.15, vol: 0.1 }] }; },
    // 10. une seule nappe, une note qui change parfois
    function (h) { return { scale: pick(['aeolian', 'lydian', 'phrygian', 'wholetone'], h, 3), bpm: 26 + h % 10, sparse: 0.4, layers: [{ inst: 'sinepad', role: 'pad', oct: -1, vol: 0.16 }, { inst: 'glass', role: 'bell', oct: 1, density: 0.1, vol: 0.08 }] }; },
    // 11. orgue jouet, valse de travers
    function (h) { return { scale: pick(['major', 'harmonic', 'locrian'], h, 3), bpm: 72 + h % 24, steps: 12, sparse: 0.55, detune: 14, layers: [{ inst: 'organ', role: 'melody', oct: 0, density: 0.25, vol: 0.12 }, { inst: 'pluck', role: 'bass', oct: -1, density: 0.2, vol: 0.14 }] }; },
    // 12. flûte qui hésite
    function (h) { return { scale: pick(['pentatonic', 'hirajoshi', 'dorian'], h, 3), bpm: 50 + h % 18, sparse: 0.45, layers: [{ inst: 'flute', role: 'melody', oct: 1, density: 0.2, vol: 0.16 }, { inst: 'drone', role: 'drone', oct: -2, vol: 0.1 }] }; },
    // 13. pincements graves et cœur qui bat
    function (h) { return { scale: pick(['phrygian', 'locrian', 'minpent'], h, 3), bpm: 58 + h % 14, sparse: 0.5, layers: [{ inst: 'pluck', role: 'arp', oct: -1, density: 0.2, vol: 0.18 }, { inst: 'kick', role: 'perc', type: 'heart', density: 0.08, vol: 0.12 }] }; },
    // 14. chœur lointain, deux accords
    function (h) { return { scale: pick(['aeolian', 'dorian', 'major'], h, 3), bpm: 32 + h % 10, sparse: 0.4, bars: 4, layers: [{ inst: 'choir', role: 'pad', oct: -1, vol: 0.12 }, { inst: 'felt', role: 'bell', oct: 0, density: 0.12, vol: 0.14 }] }; }
  ];

  MC.styles = STYLES;
  MC.auto = function (id) {
    var h = H(String(id)), st = STYLES[h % STYLES.length](h >>> 5);
    var room = ROOMS[(h >>> 17) % ROOMS.length];
    st.key = 45 + (h >>> 9) % 20; st.seed = id; st.reverb = room; st.lowpass = room === 0 ? 2600 + ((h >>> 13) % 6) * 400 : 1800 + ((h >>> 13) % 8) * 300;
    if (st.detune === undefined) st.detune = (h >>> 21) % 7;
    return { file: null, auto: true, style: h % STYLES.length, room: room, fade: 2.5, proc: st };
  };

  /* les pistes écrites : allégées, et réparties entre sec / pièce / salle */
  Object.keys(MC.tracks).forEach(function (id) {
    var t = MC.tracks[id]; if (!t || !t.proc) return;
    var h = H(id), p = t.proc;
    if (p.sparse === undefined) p.sparse = 0.55 + ((h >>> 3) % 3) * 0.06;
    if (p.maxLayers === undefined) p.maxLayers = 2 + (h >>> 7) % 2;
    if (!t.keepRoom) p.reverb = ROOMS[(h >>> 11) % ROOMS.length];
  });
})(typeof window !== 'undefined' ? window : globalThis);
