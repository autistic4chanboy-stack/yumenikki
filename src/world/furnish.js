/* =========================================================================
 *  AMEUBLEMENT DES MONDES — chaque carte est remplie de petites scènes
 *  (vignettes) accordées à son thème : un banc sous un réverbère, une table
 *  et ses chaises, une souche près d'un feu, des flaques, des lumières.
 *  Placé à des cases dégagées (jamais dans un couloir étroit), avec une graine
 *  stable par monde. Chaque objet a quelques phrases de narration.
 *  Un monde s'en dispense avec `noFurnish: true` ; `furnish: 'theme'` force un thème.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  /* phrases de narration par objet (français : c'est la narratrice qui regarde) */
  var SAY = {
    flowers: ['Flowers that have no name here. They turn a little towards her.', 'Flowers. One of them is closed, as if sulking.', 'A wild bunch of flowers. Someone watered it, not long ago.'],
    bush: ['A bush. Something breathes in it, then goes quiet.', 'A bush trimmed round, with care, by no one.'],
    stump: ['A stump. Rings to count. She stops at twelve.', 'A smooth stump, worn by people who sat on it for a long time.'],
    mushroom: ['A warm mushroom. It grows fast when no one is looking.', 'Mushrooms in a ring. In the middle, nothing. Just room for someone.'],
    rock: ['A pebble. The earth under it is dry, as if it had just been set down.', 'A round stone. It is the exact shape of a palm.'],
    puddle: ['A puddle. The reflection lags a moment behind.', 'A puddle. In it, the sky of somewhere else.', 'A puddle that isn’t wet.'],
    firefly: ['A firefly, torn between her and the dark.', 'A small light flying in loops.'],
    sprout: ['A sprout. It hasn’t decided yet what it will be.', 'A brand-new sprout, between two paving stones.'],
    deadtree: ['A dead tree. Its branches look like arms that forgot why they were raised.'],
    bench: ['A bench. Still warm.', 'A bench. On the backrest, initials carved, then scratched out.', 'A bench facing nothing in particular.'],
    reeds: ['Reeds. The wind passes a name through them, too fast to hear.'],
    sunflower: ['A sunflower. It turns towards no sun. It turns towards her.'],
    well: ['A well. Far down at the bottom, a kitchen light.', 'A well. The echo sends her breathing back, slower.'],
    swing: ['A swing, still moving a little.', 'A swing. The chain creaks on two notes.'],
    shell: ['A seashell. Inside, instead of the sea, a washing machine.', 'A seashell. It keeps a sentence once said to someone who was leaving.'],
    buoy: ['A buoy washed up, far from any water.'],
    boat: ['An upturned rowing boat. Underneath, someone has written with a finger in the moss: “later”.'],
    towel: ['A towel folded in four, clean, warm. As if someone had just laid it out for her.'],
    sandbox: ['A sandpit. A bucket, a spade, and a half-finished castle.'],
    streetlamp: ['A street lamp. It hums one very low note.', 'A street lamp. Its light says midnight.'],
    trash: ['A bin. Inside, a shopping list. The last word is a name.', 'A bin, shut tight. Nobody throws anything away here.'],
    vending: ['A vending machine. Every slot shows the same drink. No price.', 'A lit vending machine. The coffee button is worn down to the metal.'],
    mailbox: ['A letterbox. The name is rubbed out. It is full.', 'An empty letterbox. The flap knocks softly.'],
    telepole: ['A pole. Flyers pasted on in layers. The bottom one is from before she was born.'],
    newsstand: ['A closed news kiosk. The papers in the window all have the same date.'],
    payphone: ['A phone box. The receiver hangs from its cord. A dial tone, very far away.'],
    crate: ['A crate. Label: “fragile — memories”.', 'Stacked crates. One bears a number: 1204.'],
    neon: ['A neon sign. One letter flickers, always the same one.'],
    chair: ['A chair, pulled out as if for someone about to sit down.', 'A chair. It bears the shape of a back.'],
    table: ['A table. Two bowls, only one used.', 'A table. Someone has drawn hopscotch on it in felt-tip.'],
    shelf: ['A shelf. Things lined up by size, largest to smallest.', 'A dusty shelf, except for one circle where the dust is missing.'],
    bookcase: ['A bookcase. The titles are all written backwards.', 'Books. Only one has a worn spine.'],
    plush: ['A plushie. It has been sewn up several times, in the same place.', 'A plushie looking at the door.'],
    toybox: ['A toy chest. The same one is always missing.'],
    frame: ['A frame. The photo has been turned around.', 'A frame. In it, a window, and behind the window, this corridor.'],
    lamp: ['A lamp, switched on. No one will turn it off.', 'A lamp. Its switch is warm.'],
    sofa: ['A sofa. A folded blanket, and the hollow of someone who slept here, fully dressed.'],
    pot: ['A flowerpot. A label: “one more day”.', 'An empty clay pot, damp all the same.'],
    photo: ['A photo. The faces were left in, for once.', 'A blurred photo of a place she has never been.'],
    schooldesk: ['A school desk. Carved into it: a name, then a cruel word, then nothing more.', 'A school desk. The tray is full of paper cranes.'],
    locker: ['A locker. It is shut with a heart-shaped padlock.', 'A locker, ajar. Inside, a spare pair of shoes, too small.'],
    monitor: ['A screen on standby. Now and then, a face drifts across it.', 'A screen. It reads: “3 missed calls”.'],
    clipboard: ['A clipboard. A list of names. Hers isn’t on it. Not yet.'],
    stool: ['A stool, just high enough to look out of a window.'],
    sparkle: ['A small glimmer that moves one step away whenever she takes one.'],
    bigeye: ['An eye. It blinks when she blinks.'],
    mouth: ['A mouth in the floor. It shapes a word without saying it.'],
    hand: ['A hand, lying there, open, as if to be held.'],
    egg: ['A warm egg. Something inside waits, unhurried.'],
    cloudpuff: ['A small cloud sitting on the ground, not knowing how to get back up.'],
    doodle: ['A child’s drawing, at a child’s height, on nothing.'],
    mirror: ['A mirror. She is a little further away in it than she should be.', 'A mirror covered with a sheet.'],
    tv: ['A TV on, showing static. In the static, someone waves.', 'A television. It laughs to itself.'],
    poster: ['A faded poster. Faces can just be made out, all smiling the same way.'],
    flagpole: ['A flagpole with no flag. The rope taps softly against the metal.'],
    loudspeaker: ['A loudspeaker. It crackles, ready to say that everything is fine.'],
    statue: ['A worn statue. The face has been rubbed smooth by hands, over time.'],
    banner: ['A banner. The letters have fallen off, except the exclamation marks.'],
    snowman: ['A snowman. It wears a child’s scarf.'],
    pine: ['A fir tree. It smells of resin and cellar.'],
    lantern: ['A lantern set on the ground, for someone coming home late.'],
    campfire: ['A campfire that burns nothing. It is warm all the same.'],
    candle: ['A candle. The flame leans towards her.'],
    suitcase: ['A closed suitcase. It is heavy with something left unsaid.'],
    shoe: ['A child’s shoe, on its own. The left one.'],
    letter: ['A letter, sealed, addressed to “later”.'],
    book: ['A book open at the same page, wherever there is an open book.'],
    radio: ['A radio between two stations. A voice describes weather that doesn’t exist.'],
    phone: ['A phone. The screen shows a photo of a bedroom, light on.'],
    desk: ['A desk. A cup of cold coffee, and a sticky note: “home before midnight”.'],
    fence: ['A fence. Someone has tied a ribbon to it, at a child’s height.'],
    chime: ['A wind chime. It rings when no one goes by.'],
    wateringcan: ['A watering can, too big for the hands that used it.'],
    onggi: ['An earthenware jar. Inside, something has been fermenting slowly for a very long time.'],
    coral: ['Pale coral, growing on something from the house.'],
    nest: ['A nest. There is room in it for someone bigger than a bird.']
  };
  var LIGHT = { streetlamp: 3, lantern: 2.4, vending: 2, neon: 2.2, lamp: 2.4, firefly: 1.2, sparkle: 1, campfire: 3.4, candle: 1.6, tv: 1.8, monitor: 1.4 };
  var FLAT = { puddle: 1, flowers: 1, sprout: 1, shell: 1, doodle: 1, mouth: 1, egg: 1, shoe: 1, letter: 1, sparkle: 1, firefly: 1, reeds: 0 };

  /* objets qui vont contre un mur quand il y en a (le premier objet d'une vignette décide) */
  var AGAINST = { bookcase: 1, shelf: 1, sofa: 1, tv: 1, locker: 1, vending: 1, toybox: 1, desk: 1, piano: 1, bed: 1, fridge: 1, stove: 1, sink: 1, commode: 1, nightstand: 1, payphone: 1, newsstand: 1, mailbox: 1, crate: 1, onggi: 1, frame: 1, poster: 1, loudspeaker: 1, banner: 1, mirror: 1, clipboard: 1, phone: 1 };
  /* vignettes : un objet central et ses voisins (décalages) */
  function V(items) { return items; }
  var THEMES = {
    nature: [V([['bench', 0, 0], ['streetlamp', 1, 0]]), V([['stump', 0, 0], ['campfire', 1, 0], ['stump', 2, 0]]), V([['flowers', 0, 0], ['flowers', 1, 1], ['sprout', -1, 1]]), V([['mushroom', 0, 0], ['mushroom', 1, 0], ['mushroom', 0, 1]]), V([['rock', 0, 0], ['puddle', 1, 0]]), V([['bush', 0, 0], ['flowers', 1, 0]]), V([['firefly', 0, 0]]), V([['well', 0, 0], ['wateringcan', 1, 0]]), V([['swing', 0, 0]]), V([['sunflower', 0, 0], ['sunflower', 1, 0]]), V([['deadtree', 0, 0]]), V([['lantern', 0, 0], ['shoe', 1, 0]])],
    beach: [V([['shell', 0, 0], ['shell', 2, 1]]), V([['rock', 0, 0], ['puddle', 1, 1]]), V([['boat', 0, 0]]), V([['towel', 0, 0], ['sandbox', 1, 0]]), V([['buoy', 0, 0]]), V([['shoe', 0, 0]]), V([['campfire', 0, 0], ['stump', 1, 0]])],
    city: [V([['bench', 0, 0], ['streetlamp', 1, 0], ['trash', 2, 0]]), V([['vending', 0, 0], ['trash', 1, 0]]), V([['mailbox', 0, 0]]), V([['telepole', 0, 0]]), V([['payphone', 0, 0]]), V([['crate', 0, 0], ['crate', 1, 0]]), V([['puddle', 0, 0], ['puddle', 2, 1]]), V([['newsstand', 0, 0], ['streetlamp', 1, 0]]), V([['neon', 0, 0]]), V([['bench', 0, 0], ['pot', 1, 0]])],
    home: [V([['table', 0, 0], ['chair', -1, 0], ['chair', 1, 0]]), V([['shelf', 0, 0], ['plush', 1, 0]]), V([['bookcase', 0, 0], ['lamp', 1, 0]]), V([['sofa', 0, 0], ['lamp', 1, 0]]), V([['toybox', 0, 0], ['plush', 1, 0]]), V([['pot', 0, 0]]), V([['frame', 0, 0]]), V([['chair', 0, 0], ['radio', 1, 0]]), V([['suitcase', 0, 0]]), V([['tv', 0, 0], ['sofa', 0, 1]])],
    institution: [V([['schooldesk', 0, 0], ['schooldesk', 2, 0], ['schooldesk', 1, 1]]), V([['locker', 0, 0], ['locker', 1, 0]]), V([['bench', 0, 0], ['pot', 1, 0]]), V([['desk', 0, 0], ['chair', 0, 1], ['monitor', 1, 0]]), V([['clipboard', 0, 0], ['stool', 1, 0]]), V([['vending', 0, 0]]), V([['trash', 0, 0]]), V([['chair', 0, 0], ['chair', 1, 0], ['chair', 2, 0]])],
    office: [V([['desk', 0, 0], ['chair', 0, 1], ['monitor', 1, 0]]), V([['desk', 0, 0], ['monitor', 1, 0]]), V([['vending', 0, 0]]), V([['pot', 0, 0]]), V([['clipboard', 0, 0]]), V([['phone', 0, 0], ['stool', 1, 0]])],
    north: [V([['bench', 0, 0], ['flowers', 1, 0]]), V([['loudspeaker', 0, 0]]), V([['flagpole', 0, 0]]), V([['poster', 0, 0]]), V([['banner', 0, 0]]), V([['statue', 0, 0], ['flowers', 1, 1]]), V([['streetlamp', 0, 0]])],
    abstract: [V([['sparkle', 0, 0]]), V([['bigeye', 0, 0]]), V([['mouth', 0, 0]]), V([['hand', 0, 0]]), V([['egg', 0, 0], ['egg', 1, 0]]), V([['cloudpuff', 0, 0]]), V([['doodle', 0, 0]]), V([['mirror', 0, 0]]), V([['tv', 0, 0]]), V([['candle', 0, 0], ['candle', 1, 0]]), V([['chair', 0, 0]])],
    snow: [V([['snowman', 0, 0]]), V([['pine', 0, 0], ['rock', 1, 0]]), V([['lantern', 0, 0]]), V([['bench', 0, 0], ['streetlamp', 1, 0]]), V([['campfire', 0, 0], ['stump', 1, 0]])],
    water: [V([['coral', 0, 0], ['shell', 1, 0]]), V([['boat', 0, 0]]), V([['rock', 0, 0]]), V([['coral', 0, 0]]), V([['letter', 0, 0]])],
    korea: [V([['onggi', 0, 0], ['onggi', 1, 0], ['onggi', 2, 0]]), V([['bench', 0, 0], ['streetlamp', 1, 0]]), V([['vending', 0, 0]]), V([['pot', 0, 0], ['wateringcan', 1, 0]]), V([['chime', 0, 0]])]
  };
  /* détails de sol par thème (purement visuels) */
  var DECALS = { nature: ['pebbles', 'tuft', 'tuft', 'deadleaves'], beach: ['pebbles', 'glint'], city: ['manhole', 'crack', 'crack', 'scraps', 'chalkmark'], home: ['scuff', 'crumbs2'], institution: ['scuff', 'scraps', 'crack'], office: ['scuff', 'scraps'], north: ['crack', 'scraps', 'pebbles'], abstract: ['glint', 'crack'], snow: ['pebbles', 'glint'], water: ['pebbles', 'glint'], korea: ['scuff', 'pebbles', 'chalkmark'] };
  var NORTH = { W035: 1, W071: 1, W072: 1, W073: 1, W074: 1, W075: 1, W076: 1, W077: 1, W078: 1, W103: 1, W110: 1, W037: 1 };
  var SKIP = { ROOM: 1, TERRACE: 1, HALL: 1, DREAMROOM: 1, NEXUS: 1, EFFECTROOM: 1, W040: 1, W189: 1, W191: 1, W166: 1, W127: 1, W154: 1, W155: 1, W193: 1, W043: 1 };

  function themeOf(def, rt) {
    if (def.furnish) return def.furnish;
    if (NORTH[def.id]) return 'north';
    var n = U.norm(def.name || ''), lk = def.look || {}, fl = (lk.floor && lk.floor.p) || '', rend = (def.style && def.style.renderer) || '';
    // noms des mondes (anglais), avec bornes de mot
    if (/\b(snow|frozen|ice|winter)\b/.test(n) || fl === 'snow') return 'snow';
    if (/\b(bottom of the water|wreck|belly|throat|sea of milk)\b/.test(n)) return 'water';
    if (/\b(beach|shore|ocean|sand|sea of)\b/.test(n) || fl === 'sand') return 'beach';
    if (/\b((?<!post )office|tower|open plan|meeting room|floor|canteen|lift)\b/.test(n)) return 'office';
    if (/\b(school|hospital|classroom|gym|laboratory|archives|museum|library|post office|station|platform|hotel|dormitory|arcade|waiting room|bathroom|karaoke room|screen room|clock room|observation room|room of (?!a ))/.test(n)) return 'institution';
    if (/\b(seoul|1989|hagwon|pc|24 hour store|ok sun|kitchen of)\b|\bpc/.test(n)) return 'korea';
    if (/\b(house|bedroom|apartments?|kitchen|attic|lounge|block|nest|courtyard|hall of mirrors|room of a)\b/.test(n)) return 'home';
    if (/\b(street|town|city|neighbourhood|district|car park|metro|bridge|roof|rooftops)\b/.test(n)) return 'city';
    if (/\b(garden|forest|orchard|fields?|marsh|meadow|roots|greenhouse|land|landscape|plain|graveyard|cemetery)\b/.test(n) || /grass|moss|meadow|leaves|flowers/.test(fl)) return def.depth >= 4 && rend === 'psychedelic' ? 'abstract' : 'nature';
    if (/psychedelic|pattern/.test(rend) || /mosaic|flat|grid|hex|flesh|marble/.test(fl)) return 'abstract';
    return def.outdoor ? 'nature' : 'home';
  }

  var F = YN.furnish = {
    SAY: SAY, THEMES: THEMES, themeOf: themeOf, AGAINST: AGAINST,
    apply: function (rt) {
      var def = rt.def;
      if (rt.inf || def.noFurnish || SKIP[def.id] || (def.depth || 0) === 0 || rt.view === 'side' || rt.view === 'fps' || rt.view === 'wire') return 0;
      var theme = themeOf(def, rt), set = THEMES[theme] || THEMES.nature;
      var w = rt.w, h = rt.h, taken = {};
      rt.marks.forEach(function (m) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) taken[(m.x + dx) + ',' + (m.y + dy)] = 1; });
      var pass = function (x, y) { if (rt.wrap) { x = U.mod(x, w); y = U.mod(y, h); } if (x < 0 || y < 0 || x >= w || y >= h) return false; var ti = YN.tileInfo(rt.tile(x, y)); return ti.pass && !ti.water && !ti.slide && !ti.pit && !ti.hazard; };
      var roomy = function (x, y) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (!pass(x + dx, y + dy)) return false; return true; };
      var cells = [];
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) if (roomy(x, y) && !taken[x + ',' + y]) cells.push([x, y]);
      // les meubles d'intérieur (bibliothèque, canapé, télé, casiers…) se rangent contre un mur, jamais au milieu de la pièce
      var indoor = YN.world.indoor ? YN.world.indoor(rt) : false, wcells = [];
      var wallUp = function (x, y) { return y > 0 && !!YN.tileInfo(rt.tile(x, y - 1)).wall; };
      var wallOk = function (x, y) { return pass(x, y) && wallUp(x, y) && pass(x, y + 1) && pass(x - 1, y + 1) && pass(x + 1, y + 1) && !YN.world.choke(rt, x, y) && !(rt.fake && rt.fake[y * w + x]); };
      if (indoor || theme === 'city' || theme === 'korea') for (var y1 = 1; y1 < h - 1; y1++) for (var x1 = 1; x1 < w - 1; x1++) if (wallOk(x1, y1) && !taken[x1 + ',' + y1]) wcells.push([x1, y1]);
      var n = Math.max(0, Math.min(70, Math.round(cells.length / (def.furnishDensity || 95))));
      if (!n) return 0;
      var r = YN.rng.make(YN.rng.hash('furnish:' + def.id) ^ (rt.seed & 0xffff)), placed = 0, tries = 0;
      while (placed < n && tries++ < n * 12 && cells.length) {
        var vg = set[r.int(0, set.length - 1)], ok = true, wallV = !!(AGAINST[vg[0][0]] && wcells.length);
        if (AGAINST[vg[0][0]] && !wcells.length && indoor) continue; // pas de mur libre : pas de meuble perdu au milieu
        var c = wallV ? wcells[r.int(0, wcells.length - 1)] : cells[r.int(0, cells.length - 1)];
        for (var i = 0; i < vg.length; i++) { var px = c[0] + vg[i][1], py = c[1] + vg[i][2]; if (taken[px + ',' + py] || !(wallV && vg[i][2] === 0 ? wallOk(px, py) : roomy(px, py))) { ok = false; break; } }
        if (!ok) continue;
        vg.forEach(function (it, k) {
          var px = c[0] + it[1], py = c[1] + it[2], look = it[0], says = SAY[look];
          var md = { id: 'fx' + placed + '_' + k, type: 'decor', look: look, solid: !FLAT[look], light: LIGHT[look] || 0, animated: YN.decor.animated(look), lines: says ? [says[r.int(0, says.length - 1)]] : null, furnished: true, at: 'random' };
          YN.world.addMark(rt, md, px, py, null);
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) taken[(px + dx) + ',' + (py + dy)] = 1;
        });
        placed++;
      }
      // couche de détails au sol
      var dec = DECALS[theme] || DECALS.nature, nd = Math.min(160, Math.round(cells.length / 26));
      for (var q = 0; q < nd; q++) {
        var cc = cells[r.int(0, cells.length - 1)]; if (rt.markAt(cc[0], cc[1])) continue;
        YN.world.addMark(rt, { id: 'dc' + q, type: 'decor', look: dec[r.int(0, dec.length - 1)], solid: false, noInteract: true, decal: true, furnished: true, ox: (r.next() - 0.5) * 0.5, oy: (r.next() - 0.5) * 0.4, zy: -0.5 }, cc[0], cc[1], null);
      }
      rt.furnishTheme = theme;
      return placed;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
