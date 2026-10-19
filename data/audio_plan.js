/* =========================================================================
 *  PLAN SONORE
 *   · Des mondes sans musique : seulement leur ambiance et quelques bruits.
 *   · Deux emplacements « musique perso » : déposer perso1.(ogg|mp3|wav|m4a)
 *     et perso2.(…) dans assets/audio/music/ ; le jeu les trouve tout seul
 *     (serveur local) et les joue dans les lieux choisis ci-dessous.
 *   · De petits bruitages, rares et lointains, selon le thème du lieu.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, W = YN.data.worlds, MC = YN.musicConfig;

  /* ---------- silence ---------- */
  var SILENT = ['W009', 'W016', 'W025', 'W026', 'W039', 'W043', 'W049', 'W054', 'W057', 'W060', 'W080', 'W083', 'W085', 'W087', 'W096', 'W099', 'W106', 'W112', 'W113', 'W119', 'W123', 'W127', 'W128', 'W142', 'W144', 'W145', 'W146', 'W154', 'W155', 'W157', 'W158', 'W160', 'W166', 'W175', 'W178', 'W182', 'W185', 'W193', 'W198'];
  SILENT.forEach(function (id) {
    var d = W[id]; if (!d) return;
    d.music = null;
    if (!d.amb) d.amb = { type: d.outdoor ? 'wind' : 'hum', vol: 0.04 };
  });

  /* ---------- musiques perso ---------- */
  MC.custom = [
    { id: 'perso1', base: 'assets/audio/music/perso1', worlds: ['NEXUS', 'DREAMROOM'], gain: 0.75 },
    { id: 'perso2', base: 'assets/audio/music/perso2', worlds: ['W001', 'W136'], gain: 0.75 }
  ];
  function probe(slot, done) {
    if (!root.fetch || !root.location || root.location.protocol === 'file:') { done(null); return; }
    var exts = ['.ogg', '.mp3', '.wav', '.m4a'], i = 0;
    (function next() {
      if (i >= exts.length) { done(null); return; }
      var url = slot.base + exts[i++];
      fetch(url, { method: 'HEAD' }).then(function (r) { if (r.ok) done(url); else next(); }).catch(next);
    })();
  }
  YN.bus.on('boot', function () {
    MC.custom.forEach(function (slot) {
      probe(slot, function (url) {
        if (!url) return;
        MC.tracks[slot.id] = { file: url, gain: slot.gain || 0.75, fade: 3, custom: true };
        slot.found = url;
        slot.worlds.forEach(function (w) { if (W[w]) W[w].music = slot.id; });
        var G = YN.game; if (G && G.rt && slot.worlds.indexOf(G.rt.id) >= 0) { G.rt.music = slot.id; YN.audio.playMusic(slot.id, { fade: 2 }); }
      });
    });
  });

  /* ---------- petits bruitages ---------- */
  var BY = {
    nature: ['chirp', 'chirp2', 'twig', 'rustle', 'owl'], beach: ['gull', 'splash_small', 'gust'], city: ['car_far', 'dog_far', 'door_far', 'bike_bell', 'buzz'],
    home: ['creak', 'pipe', 'clock_far', 'page'], institution: ['buzz', 'phone_far', 'door_far', 'clock_far'], office: ['phone_far', 'buzz', 'page'],
    north: ['speaker_blip', 'train_far', 'door_far'], abstract: ['chime2', 'glass_tick', 'swell'], snow: ['crunch', 'gust', 'owl'], water: ['drip2', 'splash_small', 'swell'], korea: ['bike_bell', 'chime2', 'car_far', 'clock_far']
  };
  var S = YN.ambientFx = { next: 6, list: null, quietUntil: 0 };
  YN.bus.on('worldEnter', function (rt) {
    if (!rt) { S.list = null; return; }
    if (rt.depth === 0) { S.list = rt.id === 'ROOM' ? ['clock_far', 'car_far', 'pipe'] : null; S.next = 9; return; }
    var th = rt.furnishTheme || (YN.furnish ? YN.furnish.themeOf(rt.def) : 'home');
    if (rt.def.totalDark || rt.id === 'W189' || rt.id === 'W191') { S.list = null; return; }
    S.list = (rt.def.ambientFx || BY[th] || BY.abstract).slice();
    S.next = 4 + Math.random() * 6;
  });
  root.setInterval(function () {
    var A = YN.audio, G = YN.game;
    if (!S.list || !A || !A.ctx || !A.unlocked || !G || !G.rt || G.paused || G.state === 'title') return;
    S.next -= 1;
    if (S.next > 0) return;
    S.next = 8 + Math.random() * 14;
    var name = S.list[Math.floor(Math.random() * S.list.length)];
    A.sfx(name, { vol: 0.25 + Math.random() * 0.3, pan: (Math.random() * 2 - 1) * 0.8 });
  }, 1000);
})(typeof window !== 'undefined' ? window : globalThis);
