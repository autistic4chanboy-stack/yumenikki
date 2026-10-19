/* =========================================================================
 *  HABITANTS TERRIFIANTS — une partie des habitants des couches profondes
 *  est redessinée (src/render/art_horror.js) : ils gardent leurs vêtements,
 *  leurs couleurs et ce qu'ils tiennent, mais leur visage, leur cou, leurs
 *  bras ou leur silhouette deviennent inquiétants ; certains se tordent à
 *  l'affichage (tremblent, se dédoublent, grandissent quand on approche).
 *  Pas partout : rien en P1, peu en P2, de plus en plus en descendant ; les
 *  lieux tendres (jardin, grand-mère, berceuse…) restent tendres.
 *  Les mondes psychédéliques (data/worlds/_psy.js) ont des habitants à leur image.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, W = YN.data.worlds, EN = YN.data.entities, U = YN.util;

  /* ---- les dessins, par degré ---- */
  var L1 = {
    hollow: { eyes: 'void', mouth: 'none', fx: { jitter: 1 } },
    widesmile: { eyes: 'blank', mouth: 'ear2ear' },
    tilted: { tilt: 0.55, tiltSway: 0.12, eyes: 'stare', mouth: 'line' },
    faceless: { head: 'faceless' },
    neck: { neck: 0.28, eyes: 'void', mouth: 'none' },
    watcher: { eyes: 'stare', mouth: 'none', fx: { loom: 0.8, creep: 1 } },
    whisper: { eyes: 'closed', mouth: 'whisper', fx: { flicker: 1 } }
  };
  var L2 = {
    gapeneck: { neck: 0.62, eyes: 'void', mouth: 'gape', headScale: 1.15 },
    clawed: { longArms: true, claws: true, hunch: true, eyes: 'red', mouth: 'none', fx: { jitter: 1 } },
    longhead: { head: 'long', eyes: 'void', mouth: 'gape', hMul: 1.25 },
    porcelain: { head: 'porcelain', fx: { glitch: 1 } },
    tvhead: { head: 'static', fx: { glitch: 1 } },
    noh: { head: 'noh', fx: { loom: 1, creep: 1 } },
    bleeding: { eyes: 'bleed', mouth: 'stitchwide', aura: 'dark' },
    bandaged: { head: 'bandage', longArms: 1.6 },
    drowned: { veil: true, veilEye: true, float: true, fx: { flicker: 1 } },
    manyeyed: { eyes: 'lots', thirdEye: true, mouth: 'none', headScale: 1.2 },
    upside: { head: 'upside', tilt: 0.25, tiltSway: 0.3 },
    teeth: { eyes: 'void', mouth: 'teeth', headScale: 1.25 }
  };
  var L3 = {
    maw: { head: 'maw', longArms: true, claws: true, hMul: 1.35, fx: { jitter: 1 }, headScale: 1.3 },
    eyes: { head: 'eyes', eyesHalo: 9, aura: 'dark', headScale: 1.3, fx: { loom: 1 } },
    split: { head: 'split', manyArms: 2, claws: true, headScale: 1.2, fx: { glitch: 1 } },
    stretched: { head: 'faceless', neck: 0.9, thin: true, longArms: 2.4, claws: true, hMul: 1.5, fx: { stretch: 1, loom: 0.6 } },
    tallman: { swap: 'tallman', hat: true, h: 34, fx: { loom: 1, creep: 1 } },
    crawler: { swap: 'crawler', fx: { jitter: 1 } },
    faces: { swap: 'faces', n: 4, h: 30, fx: { jitter: 1 } },
    smiler: { swap: 'smiler', fx: { flicker: 1, loom: 1, creep: 1 } },
    moth: { head: 'moth', antlers: true, antlerEyes: true, aura: 'dark' },
    voidhead: { head: 'void', aura: 'dark', eyesHalo: 7, headScale: 1.2 },
    melter: { swap: 'melter', fx: { stretch: 1 } },
    redaura: { eyes: 'red', mouth: 'teeth', aura: 'red', manyArms: 1, claws: true, headScale: 1.2, fx: { jitter: 1 } }
  };
  var PSY = {
    prism: { head: 'prism', aura: 'psy', fx: { hue: 1 } },
    spinning: { eyes: 'spin', mouth: 'whisper', halo: 'psy', fx: { trail: 'psy' } },
    kaleido: { swap: 'kaleido', fx: { hue: 0.6 } },
    doubles: { swap: 'doubles', fx: { trail: 'psy' } },
    petals: { head: 'petals', aura: 'psy', headScale: 1.2 },
    starry: { head: 'void', fx: { trail: 'psy' } },
    cluster: { swap: 'eyecluster', fx: { hue: 0.4 } },
    rainbow: { eyes: 'spin', aura: 'psy', fx: { hue: 1.4, trail: 1 } }
  };
  /* ghosts, ombres, boules : leurs propres dessins */
  var SOFT = {
    ghost: [{ eyes: 'void', fx: { flicker: 1 } }, { eyes: 'bleed', fx: { loom: 1 } }, { swap: 'longface', h: 30 }, { swap: 'smiler', fx: { flicker: 1 } }, { eyes: 'stare', fx: { jitter: 1 } }],
    shadow: [{ eyes: 'red', fx: { loom: 1, creep: 1 } }, { eyes: 'hollowglow', fx: { flicker: 1 } }, { swap: 'smiler' }, { eyes: 'stare', fx: { stretch: 1 } }],
    blob: [{ eyes: 'lots', mouth: 'teeth' }, { swap: 'mouthbeast', fx: { jitter: 1 } }, { swap: 'eyecluster' }, { eyes: 'spin', mouth: 'many', fx: { hue: 0.8 } }]
  };

  /* ---- les thèmes : quels dessins vont où ---- */
  var THEMES = [
    { re: /parade|monument|border|model village|collective|school of the parent|portrait|recitation|stadium|sings on cue|three-hundred|happiness|permit|press|censor|identical|great leader|anthem|assembly/, pick: ['widesmile', 'noh', 'porcelain', 'teeth', 'faces', 'tilted', 'faceless'] },
    { re: /office|canteen|meeting|open-plan|call centre|punch clock|packing|laundr|night shift|overtime|tower|floor|lift|corridor|commute|metro|courier|cubicle/, pick: ['faceless', 'gapeneck', 'stretched', 'tvhead', 'neck', 'hollow', 'tallman', 'clawed'] },
    { re: /hospital|laborator|patient|ward|nurse|subject|observation|dream machine|recording/, pick: ['bandaged', 'manyeyed', 'split', 'eyes', 'watcher', 'porcelain', 'stretched'] },
    { re: /school|class|hagwon|kindergarten|playground|gym|exam|report|principal|lockers|corridor after/, pick: ['teeth', 'widesmile', 'maw', 'faces', 'whisper', 'watcher', 'hollow'] },
    { re: /television|screen|tv|static|test card|signal|arcade|pc|karaoke|cinema|photo booth/, pick: ['tvhead', 'porcelain', 'hollow', 'doubles', 'redaura', 'faceless'] },
    { re: /sea|water|wreck|pier|drown|pool|whale|tide|harbour|ferry|bath|rain|puddle|well/, pick: ['drowned', 'bleeding', 'longhead', 'gapeneck', 'melter', 'voidhead'] },
    { re: /flesh|body|belly|throat|stairs of flesh|heart|eyes|smile|mouth|teeth/, pick: ['maw', 'eyes', 'split', 'redaura', 'crawler', 'melter'] },
    { re: /forest|wood|grove|thicket|moss|burrow|field|orchard|scarecrow|barn/, pick: ['moth', 'eyes', 'tallman', 'crawler', 'watcher', 'stretched'] },
    { re: /doll|puppet|toy|plush|music box|theatre|backstage|mannequin|attic/, pick: ['porcelain', 'widesmile', 'tilted', 'noh', 'upside', 'split'] },
    { re: /mirror|double|copy|reflection|replace|repeat|itself|room of 1000/, pick: ['faceless', 'upside', 'doubles', 'porcelain', 'hollow', 'tilted'] },
    { re: /night|dark|tunnel|shaft|shelter|cold store|underside|below|beneath|unlit|witch|grave|bones|archive|erased|missing|lost/, pick: ['voidhead', 'tallman', 'crawler', 'smiler', 'clawed', 'stretched', 'gapeneck'] }
  ];
  // les lieux tendres restent tendres
  var GENTLE = /garden|grandmother|halmeoni|kimchi|lullaby|first memory|nest|apron|mother's voice|mother’s voice|lit bedroom|last bed|egg|biscuit|cookie|sweet potato|soup|birthday|snow globe|seashell|first snow|seoul, 1989|kitchen of 1989|ok-sun|nour/;
  var RATE = { 1: 0, 2: 0.12, 3: 0.42, 4: 0.68, 5: 0.78 };
  var HUMAN = /^(humanoid|adult|old|tall|doll|mannequin|robot)$/;

  // monde de chaque habitant
  var home = {};
  U.keys(W).forEach(function (wid) { (W[wid].npcs || []).forEach(function (q) { if (q && q.id && !home[q.id]) home[q.id] = wid; }); });
  function worldOf(id, ed) { return ed.world || home[id] || (ed.worlds && U.keys(ed.worlds)[0]) || null; }
  function r01(s) { return (YN.rng.hash(s) % 10000) / 10000; }
  function pickFrom(list, s) { return list[YN.rng.hash(s) % list.length]; }
  var ALL = Object.assign({}, L1, L2, L3);

  var done = {}, psySet = {}; (YN.data.psyWorlds || []).forEach(function (w) { psySet[w] = 1; });
  U.keys(EN).forEach(function (id) {
    var ed = EN[id]; if (!ed || !ed.look || ed.major || ed.invisible || ed.kind === 'voice' || ed.noHorror) return;
    var t = ed.look.t || 'humanoid';
    var wid = worldOf(id, ed), wd = wid && W[wid]; if (!wd || !/^W\d{3}$/.test(wid)) return;
    var depth = wd.depth || 0, name = U.norm(wd.name || '').toLowerCase(), psy = !!psySet[wid];
    if (GENTLE.test(name) && !psy) return;
    var theme = THEMES.filter(function (th) { return th.re.test(name); })[0];
    var rate = (RATE[depth] || 0) * (theme ? 1.35 : 1) * (psy ? 1.4 : 1);
    if (t === 'kid') rate *= 0.45;
    if (r01('horror:' + id) >= Math.min(0.92, rate)) return;
    var design = null, key;
    if (SOFT[t]) { design = pickFrom(SOFT[t], 'soft:' + id); key = t + '-' + SOFT[t].indexOf(design); }
    else if (psy || (depth >= 5 && r01('psy:' + id) < 0.3)) { key = pickFrom(U.keys(PSY), 'psy:' + id); design = PSY[key]; }
    else if (HUMAN.test(t) || t === 'kid') {
      var lvl = depth <= 2 ? 1 : depth === 3 ? (r01('lvl:' + id) < 0.55 ? 1 : 2) : depth === 4 ? (r01('lvl:' + id) < 0.5 ? 2 : 3) : 3;
      if (t === 'kid') lvl = Math.min(lvl, depth >= 4 ? 2 : 1);
      var pool = lvl === 1 ? L1 : lvl === 2 ? L2 : L3, names = U.keys(pool);
      if (theme) { var fav = theme.pick.filter(function (k) { return pool[k]; }); if (fav.length && r01('fav:' + id) < 0.75) names = fav; }
      if (t === 'kid') names = names.filter(function (k) { return !ALL[k].swap && !ALL[k].claws && k !== 'maw' && k !== 'teeth'; });
      if (!names.length) return;
      key = pickFrom(names, 'design:' + id); design = pool[key];
    } else return; // animaux, objets : ils restent ce qu'ils sont
    var lk = Object.assign({}, ed.look), d = Object.assign({}, design);
    if (d.swap) { lk.t = d.swap; delete d.swap; }
    if (d.hMul) { lk.h = Math.round((lk.h || 24) * d.hMul); delete d.hMul; }
    if (d.h) { lk.h = Math.max(lk.h || 24, d.h); delete d.h; }
    Object.assign(lk, d);
    lk.seed = YN.rng.hash(id) % 1000;
    ed.lookBefore = ed.look; ed.look = lk; ed.horror = key;
    done[id] = key;
  });
  YN.data.horror = done;
})(typeof window !== 'undefined' ? window : globalThis);
