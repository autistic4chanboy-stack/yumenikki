/* =========================================================================
 *  MONDES DU CŒUR (5/6) — W028 Serre d'hiver · W029 Le Phare ·
 *  W030 Cour de récréation · W031 Le Dédale · W032 Casino des minutes ·
 *  W033 Tour de Verre
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;
  function cookieMark(key) { var t = {}; t[key] = true; var c = {}; c[key] = true; return { id: 'cookie_' + key, type: 'cookie', look: 'cookie', cond: { not: { temp: c } }, use: [{ temp: t }] }; }

  /* ======================= W028 — LA SERRE D'HIVER ======================= */
  (function () {
    var g = K.grid(36, 24, ' ');
    g.box(0, 0, 36, 24, 'g', '.');
    for (var x = 4; x < 32; x += 6) { g.vline(x, 4, 18, '+'); }
    g.hline(2, 33, 20, ',');
    g.set(18, 23, 'N'); g.set(18, 12, 'P'); g.set(4, 3, 'A'); g.set(10, 3, 'B'); g.set(16, 3, 'C'); g.set(22, 3, 'D'); g.set(28, 3, 'E'); g.set(33, 21, 'S'); g.set(2, 21, '1'); g.set(31, 10, 'T');
    var pot = function (id, n, txt) { return { id: id, type: 'decor', look: 'pot', lookOpt: { plant: n > 0, label: String(n) }, lines: [txt] }; };
    YN.defWorld({
      id: 'W028', name: 'The Winter Greenhouse', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top' }, music: 'greenhouse', amb: { type: 'drip', vol: 0.05 }, weather: { snow: true },
      look: { floor: { p: 'tile', c: ['#a8b8a0', '#889880'] }, floor2: { p: 'dirt', c: ['#6a5a40', '#5a4a30', '#7a6a50'] }, glass: { p: 'glass', c: ['#a8c8d8', '#e8f4fc', '#c8dce8'] }, soil: { p: 'soil', c: ['#4a3a24', '#3a2a18', '#5a4a30'] } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: 'g', to: 'W001', arrive: 'shed', look: 'door', lookOpt: { style: 'wood', c: ['#6a5a3a'] }, essential: true, exitDir: 'up' },
        P: { type: 'spawn' },
        A: pot('pot3', 3, 'A pot. On the label, in pencil: 3.'), B: pot('pot5', 5, 'A pot. Label: 5.'), C: pot('pot0', 0, 'An empty pot. Label: 0. Nothing has been sown.'), D: pot('pot2', 2, 'A pot. Label: 2.'), E: pot('pot4', 4, 'A pot. Label: 4.'),
        S: { id: 'seedbag', type: 'decor', look: 'seedbag', lines: ['A bag of seeds with a hole in it. The seeds fall out one by one, without a sound.'] },
        T: { id: 'tools', type: 'decor', look: 'wateringcan', lines: ['A green watering can, rusty. It hangs too high, like a reward.'] },
        '1': cookieMark('greenCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'We counted them on Sundays. Out loud. She said seeds like to hear their number.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: ['The soul has soil under its nails, and its hands are still warm.', { t: '겨울에도 흙은 따뜻해. 손 넣어 봐.', lang: 'ko-s', tr: 'Even in winter, the soil is warm. Put your hand in.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'The watering can was always too big for the little one. She carried it with both arms, like something alive.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'He has pockets full of seeds and not one hole dug. The glass keeps the cold out, and the waiting in.', lang: 'en' }] }
      ],
      mech: [{ type: 'sayTo', ent: 'N003', words: ['14', 'fourteen', 'forteen', '열넷', '열네', '십사'], dist: 4, give: 'E35',
        winLines: [{ t: 'Fourteen! Fourteen, of course, fourteen, I was about to say it, it was on the tip of my tongue, well, on the tip of my pots…', lang: 'en', who: 'Pip' }, 'Pip takes down the watering can and gives it to you.', { t: 'Here. I don’t dare to water. You do.', lang: 'en', who: 'Pip' }],
        wrong: { t: 'No… no, that’s not it, some are missing, or there are too many, I don’t know anymore…', lang: 'en', who: 'Pip' },
        doneLine: { t: 'Fourteen. I’ll remember. Or not.', lang: 'en', who: 'Pip' } }],
      info: {
        summary: 'A glass greenhouse under the snow: rows of soil, five labelled pots, a watering can hung too high.',
        art: 'Glass, snow outside, dark soil, sleeping plants.',
        rules: ['Pip has lost count of his seeds: saying (T) the total written on the pots (3 + 5 + 0 + 2 + 4 = 14, “fourteen”) gives the Watering Can (E35).'],
        role: 'Gives the Watering Can. Setting of Pip’s quest (Q02).',
        lore: 'Her grandmother’s seedlings, counted together on Sundays.'
      }
    });
  })();

  /* ======================= W029 — LE PHARE ======================= */
  (function () {
    var g = K.grid(30, 30, ' ');
    g.ellipse(9, 20, 7, 7, '.'); g.ellipse(9, 20, 7.6, 7.6, '#'); g.ellipse(9, 20, 6.4, 6.4, '.');
    g.ellipse(22, 7, 5, 5, '.'); g.ellipse(22, 7, 5.6, 5.6, '#'); g.ellipse(22, 7, 4.6, 4.6, ',');
    g.set(9, 27, 'N'); g.set(9, 14, 'U'); g.set(22, 11, 'D'); g.set(22, 6, 'L'); g.set(5, 18, 'B'); g.set(13, 23, 'K'); g.set(26, 7, 'W');
    YN.defWorld({
      id: 'W029', name: 'The Lighthouse', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true, cliffH: 0 }, music: 'lighthouse', amb: { type: 'sea', vol: 0.08 }, dark: 0.6,
      look: { floor: { p: 'stone', c: ['#8a8a84', '#6a6a64', '#4a4a44'] }, floor2: { p: 'metal', c: ['#5a5e64'] }, wall: { p: 'flat', c: ['#3a3a3e', '#2a2a2e'], topColor: '#303034' }, wallface: { p: 'brick', c: ['#e8e4dc', '#c8c0b4', '#8a8478'], skirt: '#c03030' } },
      map: g.rows(),
      marks: {
        N: { id: 'out', type: 'door', floor: '#', to: 'W039', arrive: 'lighthouse', look: 'door', lookOpt: { style: 'red' }, essential: true, exitDir: 'up' },
        U: { id: 'up', type: 'stairs', floor: '.', to: 'W029', arrive: 'D', look: 'stairs', solid: false, label: 'go up' },
        D: { id: 'down', type: 'stairs', floor: ',', to: 'W029', arrive: 'U', unreachOk: 'upper floor', look: 'stairsdown', solid: false, label: 'go down' },
        L: { id: 'lamp', type: 'anchor', look: 'lamp', lookIf: [{ cond: { flag: 'lighthouse_W029' }, lookOpt: { on: true } }], light: 0, lines: [{ if: { flag: 'lighthouse_W029' }, t: 'The lamp turns. Its light sweeps over the grey sea, every nine seconds.' }, { if: { equipped: 'E05' }, t: 'You hold the Lantern up to the wick. The great lamp lights and begins to turn.', do: [{ set: { lighthouse_W029: true } }, { sfx: 'reveal' }, { reeval: true }] }, { t: 'The great lamp is dark. Its wick is waiting for a flame.' }] },
        B: { id: 'log', type: 'sign', look: 'book', lines: ['The soul clutches a logbook that no longer exists.', { t: 'Three lighthouses. This one, one in the white, one in the waves.', lang: 'en' }, { t: 'When all three keep watch, the bed at the bottom comes up.', lang: 'en' }] },
        K: { id: 'bed', type: 'decor', look: 'bed', lookOpt: { c: ['#e0e0d8', '#5a6a8a'] }, lines: ['The keeper’s bed. Made with tight corners. He doesn’t sleep here.'] },
        W: { id: 'window', type: 'decor', look: 'window', lookOpt: { night: true }, floor: '#', lines: ['The sea, with no shore. Very far away, another lighthouse blinks, then goes dark.'] }
      },
      variants: { lit: { cond: { flag: 'lighthouse_W029' }, dark: 0.25 } },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'Someone has to stay awake so the others can sleep. That’s the whole job. Nobody thanks the light.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '밤 근무는 일곱 시에 끝나요. 그 시간이면 아이는 벌써 학교 갈 준비를 해요.', lang: 'ko-s', tr: 'The night shift ends at seven. By then, the child is already getting ready for school.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'No ship ever came. I left the light on anyway. In case.', lang: 'en' }, { t: 'Nine seconds of light, then the dark. You learn to count the dark too.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N106', at: [10, 22] }],
      info: {
        summary: 'A white-brick lighthouse on the Grey Beach: a round room below, the lamp above.',
        art: 'White bricks, a red band, grey sea through the window.',
        rules: ['Light the lamp with the Lantern equipped (once and for all).', 'Three lit lighthouses (W029, W158, W088) open a way to the Bed at the Bottom of the Water (W181).'],
        role: 'The first of the three lighthouses.',
        lore: 'Someone who stays awake all night so the others get home.'
      }
    });
  })();

  /* ======================= W030 — LA COUR DE RÉCRÉATION ======================= */
  (function () {
    var g = K.grid(58, 38, '.');
    g.border('#');
    g.rect(4, 4, 18, 8, ','); g.hline(4, 21, 3, '%');             // préau
    g.rect(40, 4, 14, 10, ':'); g.box(42, 24, 12, 10, '#', ',');    // toilettes de la cour
    g.set(47, 24, ',');
    g.ellipse(28, 24, 6, 4, '"'); g.set(28, 24, '^');
    [[10, 20], [14, 30], [34, 9], [24, 14]].forEach(function (p) { g.set(p[0], p[1], '{'); });
    g.hline(1, 56, 36, ',');
    g.set(0, 18, 'N'); g.set(13, 2, 'B'); g.set(22, 7, 'T'); g.set(48, 30, 'O'); g.set(30, 34, 'L'); g.set(52, 6, 'H'); g.set(8, 34, 'S'); g.set(36, 18, 'G');
    g.set(6, 6, 'C'); g.set(50, 12, 'D'); g.set(20, 30, 'E'); g.set(44, 20, 'F'); g.set(54, 2, '1');
    var crane = function (id) { return { id: id, type: 'item', look: 'crane', item: { crane: 1 }, once: true, solid: false }; };
    YN.defWorld({
      id: 'W030', name: 'The Playground', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2', outdoor: true,
      style: { view: 'top', renderer: 'crayon' }, music: 'yard', amb: { type: 'kids', vol: 0.03 },
      look: { floor: { p: 'asphalt', c: ['#6a6a70'] }, floor2: { p: 'concrete', c: ['#8a8a88'] }, floor3: { p: 'tile', c: ['#c84040', '#a03030'] }, leafg: { p: 'grass', c: ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#3a6a2a'] }, wall: { p: 'brick', c: ['#9a6a5a', '#7a4a3a', '#5a3020'] }, wall2: { p: 'concrete', c: ['#8a8a90', '#6a6a70', '#4a4a50'] } },
      tall: { '{': { look: 'bench' }, '^': { look: 'tree' } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'path', to: 'W004', arrive: 'toYard', essential: true },
        B: { id: 'bell', type: 'decor', floor: '%', look: 'bell', lines: ['The school bell. It rings on its own, now and then, for nobody.'] },
        T: { id: 'bin', type: 'decor', look: 'trash', lines: [{ if: { remainingMod: { every: 90, under: 12 }, noEffect: 'E16' }, t: 'The bell has stirred the bin: something is poking out from under the lid. A white mask, smiling. It fits you.', do: [{ give: 'E16' }] }, { t: 'The bin behind the shelter. It only opens when the bell rings, someone says, somewhere.' }] },
        O: { id: 'cabin', type: 'decor', look: 'stall', lines: [{ if: { met: 'N009' }, t: 'Cubicle 3. You can hear paper being folded.' }, { t: 'Cubicle 3. Locked from the inside. Someone is breathing very softly.' }] },
        L: { id: 'hopscotch', type: 'decor', look: 'hopscotch', lines: ['A chalk hopscotch. The “SKY” square has been rubbed out.'] },
        H: { id: 'fence', type: 'decor', look: 'fence', lines: ['The wire fence. Behind it, another playground, identical, further away, smaller.'] },
        S: { id: 'graffiti', type: 'sign', look: 'sign', lines: ['The soul’s fingers are covered in chalk.', { t: 'They wrote THE MUTE GIRL HAS A TONGUE on the wall, with a nasty drawing.', lang: 'en' }, { t: 'I drew flowers over it. Lots of flowers. You can still see it underneath.', lang: 'en' }] },
        G: { id: 'game', type: 'decor', look: 'ball', lines: ['A deflated ball. Nobody ever passed it to anybody.'] },
        C: crane('crane1'), D: crane('crane2'), E: crane('crane3'), F: crane('crane4'),
        '1': cookieMark('yardCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'I laughed too. Not because it was funny. Because everyone was looking at me to see if I would.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'The bell rings for nobody. When it rings, look in the bin behind the shelter. People throw faces away in there.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Seven cranes, folded small so nobody would see. Four out here, three inside. She hides them where she can find them again.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Nobody hit her. That’s what they all said, after. Nobody hit her.', lang: 'en' }, { t: 'Talk to the door softly. Knocking only makes it quieter.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N009', at: [48, 29] }, { id: 'N010', at: [28, 18] }, { id: 'N107', at: [14, 24] }, { id: 'N107', at: [36, 28] }, { id: 'N108', at: [10, 8] }],
      mech: [{ type: 'bellRing', every: 90, under: 12 }],
      info: {
        summary: 'A schoolyard in crayon: a covered shelter, a hopscotch, a tree, benches, the yard toilets, a wire fence.',
        art: 'Wax crayon, children’s colours, grey asphalt.',
        rules: ['The bell rings every 90 s of dream time: at that moment, the bin behind the shelter gives the Mask (E16).', 'Seven paper cranes scattered about (four in the playground, three in the Empty School): bringing them to Ondine while speaking to her softly gives the Paper Crane (E31).'],
        role: 'Gives the Mask and the Paper Crane. Setting of the Playground quest (Q08).',
        lore: 'Bullying. Those who laugh, the one who hides, the one who looks away.'
      }
    });
  })();

  /* ======================= W031 — LE DÉDALE ======================= */
  (function () {
    var scale2 = function (rows) {
      var out = []; rows.forEach(function (r) { var s = ''; for (var i = 0; i < r.length; i++) s += r[i] + r[i]; out.push(s); out.push(s); }); return out;
    };
    var glade = [
      '`````````````````````',
      '`...................`',
      '`.,,,,,,,,,,,,,,,,,.`',
      '`.,"""""""""""""",.`',
      '`.,""""""T""""""",.`',
      '`.,""""""""""""""",.`',
      '`.,""""""C""""""",.`',
      '`.,,,,,,,,,,,,,,,,,.`',
      '`.........U.........`',
      '`````````````````````'
    ].map(function (r) { while (r.length < 21) r += '`'; return r.slice(0, 21); });
    YN.defWorld({
      id: 'W031', name: 'The Maze', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top', wallH: 2.2 }, music: 'maze', amb: { type: 'wind', vol: 0.05 },
      look: { floor: { p: 'dirt', c: ['#6a5a40', '#5a4a30', '#7a6a50'] }, floor2: { p: 'stone', c: ['#8a8478', '#6a6458', '#4a4438'] }, leafg: { p: 'grass', c: ['#4a7a3a', '#3a6a2a', '#5a8a4a', '#2a5a1a'] }, wall: { p: 'stone', c: ['#6a6a60', '#4a4a40', '#3a3a30'], h: 2.2 } },
      gen: { type: 'maze', w: 33, h: 25, loops: 0.08, dayNight: true, stable: true,
        post: function (rows, r) {
          rows = scale2(rows);
          var W = rows[0].length, H = rows.length;
          rows = YN.gen.stamp(rows, glade, Math.floor(W / 2 - 10), Math.floor(H / 2 - 5));
          // entrée au sud, balise au nord-est
          rows = YN.gen.put(rows, Math.floor(W / 2), H - 1, 'N'); for (var y = H - 2; y > H / 2 + 4; y--) rows = YN.gen.put(rows, Math.floor(W / 2), y, '.');
          rows = YN.gen.put(rows, W - 4, 3, 'B'); rows = YN.gen.put(rows, W - 5, 3, '.'); rows = YN.gen.put(rows, W - 4, 4, '.');
          rows = YN.gen.put(rows, 3, H - 4, 'S'); rows = YN.gen.put(rows, 4, H - 4, '.');
          rows = YN.gen.put(rows, 3, 3, 'X'); rows = YN.gen.put(rows, 4, 3, '.');
          return rows;
        } },
      marks: {
        N: { id: 'back', type: 'stairs', to: 'W001', arrive: 'mazeD', look: 'stairs', solid: true, essential: true, label: 'back up to the Garden' },
        T: { type: 'spawn' }, C: { id: 'camp', type: 'decor', look: 'campfire', animated: true, light: 3, lines: ['The campfire. Walking sticks stacked together. A wall covered in tally marks: days counted.'] },
        U: { id: 'tally', type: 'sign', look: 'sign', lines: ['The soul has stone dust under its nails.', { t: 'Five, five, five, five… hundreds of fives. The last bundle only has four.', lang: 'en' }, { t: 'I stopped before the fifth day. Or the fifth day stopped first.', lang: 'en' }] },
        B: { id: 'beacon', type: 'trigger', look: 'beacon', repeat: true, do: [{ if: { temp: { mazeMapping: true }, not: { temp: { mazeMapped: true } } }, temp: { mazeMapped: true }, lines: [{ t: 'You copy the sector onto Thalie’s blank map. The walls, the dead ends, the beacon. The map fills itself in as you go.' }] }] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'the way out leads further down', lines: [{ t: 'I carved it so I wouldn’t forget. Then I forgot how to read.', lang: 'en' }] },
        X: { id: 'grate', type: 'fall', to: 'W105', look: 'hole', cond: { dark: true }, label: 'an open grate in the dark' }
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'By day the walls remember the way. By night they forget it, and so do you.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'There’s a grate in the north-west that only opens in the dark. I didn’t go down. I’m still deciding.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Same school. Same corridor. She sat two rows behind the quiet girl and looked at the back of her neck every day.', lang: 'en' }, { t: 'Looking is not doing. She knows that now.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N013', at: 'T' }, { id: 'N109', at: 'random', appear: { dark: true } }, { id: 'N109', at: 'random', appear: { dark: true } }, { id: 'N109', at: 'random', appear: { dark: true } }, { id: 'N110', at: 'random' }],
      info: {
        summary: 'A vast maze of high stone walls around a clearing where Thalie camps. It is not the same by day and by night.',
        art: 'High grey walls, packed earth, a grassy clearing; at night, prowlers.',
        rules: ['The layout changes with the Bedroom light (on: day; off: night); it stays the same from one dream to the next for the same state.', 'At night, prowlers steal time on contact.', 'Thalie hands over a blank map: touching the north-east beacon and coming back before the late phase of the dream gives the Compass (E29).'],
        secrets: ['At night, an open grate in the north-west leads down (W105).'],
        role: 'Gives the Compass. The cartographer’s quest (Q12).',
        lore: 'Thalie believes there is a way out to “the real world”. There is one. It leads further down.'
      }
    });
  })();

  /* ======================= W032 — LE CASINO DES MINUTES ======================= */
  (function () {
    var g = K.grid(44, 30, ' ');
    g.box(0, 0, 44, 30, '#', '.');
    g.rect(1, 1, 42, 4, ','); g.rect(14, 10, 16, 10, ':');
    for (var x = 3; x < 42; x += 4) g.set(x, 2, '}');
    g.set(22, 29, 'N'); g.set(21, 14, 'R'); g.set(8, 12, 'C'); g.set(36, 12, 'D'); g.set(8, 22, 'E'); g.set(36, 22, 'F'); g.set(22, 6, 'S'); g.set(40, 27, 'K'); g.set(3, 27, 'X'); g.set(22, 22, 'L');
    var slot = function (id) { return { id: id, type: 'decor', look: 'slot', animated: true, casino: { game: 'slot', bets: [30, 60] } }; };
    YN.defWorld({
      id: 'W032', name: 'The Casino of Minutes', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'casino', amb: { type: 'casino', vol: 0.06 }, dark: 0.35,
      look: { floor: { p: 'carpet', c: ['#6a1020', '#4a0814'] }, floor2: { p: 'marble', c: ['#2a2420', '#5a4a30'] }, floor3: { p: 'carpet', c: ['#1a5a3a', '#104a2a'] }, wall: { p: 'flat', c: ['#1a1008', '#100a04'], topColor: '#1a1008' }, wallface: { p: 'panel', c: ['#5a3a1a', '#4a2a0a', '#c8a040'], skirt: '#c8a040' } },
      tall: { '}': { look: 'slot' } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W003', arrive: 'toCasino', look: 'door', lookOpt: { style: 'glass', c: ['#d0a020'] }, essential: true, exitDir: 'up' },
        R: { id: 'roulette', type: 'decor', look: 'roulette', animated: true, casino: { game: 'roulette', bets: [60, 120] }, lines: [{ if: { equipped: 'E13', noEffect: 'E30' }, t: 'Tiny, you slip under the roulette table. Among the cigarette ends and lost chips, a six-sided die, warm as a hand.', do: [{ give: 'E30' }] }] },
        C: slot('slot1'), D: slot('slot2'),
        E: { id: 'cards', type: 'decor', look: 'cardtable', casino: { game: 'cards', bets: [60, 180] } },
        F: { id: 'dice', type: 'decor', look: 'cardtable', lookOpt: { c: ['#1a4a6a'] }, casino: { game: 'dice', bets: [30, 60, 120] } },
        S: { id: 'rules', type: 'sign', floor: ',', look: 'board', lookOpt: { lines: ['MINIMUM BET 0:30', 'THE HOUSE WINS', 'NO REFUNDS'], color: '#e8c040' }, lines: ['The soul speaks in the hoarse voice of a gaming-hall loudspeaker.', { t: 'All bets are placed in dream minutes. Minimum bet, thirty seconds. The house does not refund lost time.', lang: 'en' }, { t: 'I bet a whole night once. I won it back. It wasn’t the same night.', lang: 'en' }] },
        K: { id: 'cashier', type: 'decor', look: 'till', lines: ['The cashier’s window. Behind the glass, a gloved hand taps a sign.', { t: 'We buy cookies. One cookie, two minutes. No questions asked.', lang: 'en' }], use: [{ fn: function () { if (YN.save.cookies() > 0) YN.ui.dialog.choose(['Sell a biscuit (+2:00)', 'Keep it'], function (i) { if (i === 0 && YN.save.useCookie()) { YN.game.addTime(120); YN.ui.hud.refresh(); YN.audio.sfx('coin'); } }); } }] },
        X: { id: 'vip', type: 'door', floor: '#', to: 'W089', look: 'door', lookOpt: { style: 'red', symbol: 'VIP' }, cond: { flag: 'casino_jackpot' }, label: 'private lounge', lockedText: 'PRIVATE LOUNGE. Reserved for three-minute winners.' },
        L: { id: 'lost', type: 'decor', look: 'sofa', lookOpt: { c: ['#5a1a2a'] }, lines: ['A sofa. On the cushion, a man’s watch, stopped. It only ever had minute hands.'] }
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: 'I traded an hour of sleep for ten minutes of winning. Then I traded the ten minutes back. Now I have neither.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'Only very small people fit under the roulette. Chips roll down there. So do warmer things.', lang: 'en' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: 'A man left his watch on the sofa and went to play the last hour. He never came back for it.', lang: 'en' }, { t: 'Maybe he’s still winning somewhere.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N111', at: [21, 12] }, { id: 'N112', at: [9, 23] }, { id: 'N113', at: [30, 7] }, { id: 'N114', at: [38, 24] }],
      mech: [{ type: 'casino', prize: 'E30', jackpotFlag: 'casino_jackpot' }],
      info: {
        summary: 'A red-carpeted casino where you bet minutes of dream time: roulette, slot machines, cards, dice. It only opens after the opening phase.',
        art: 'Red velvet, gilding, green baize, blinking lights.',
        rules: ['Each table takes bets in dream time; winning doubles the stake, losing takes it off the countdown.', 'Winning a bet of at least 1:00 gives the Dice (E30). Alternative: under the roulette table with Tiny.', 'The cashier’s window buys a biscuit for 2:00.', 'Winning three minutes in total opens the Private Lounge (W089).'],
        role: 'Gives the Dice.',
        lore: 'Time gambled and lost; the house always wins.'
      }
    });
  })();

  /* ======================= W033 — LA TOUR DE VERRE ======================= */
  (function () {
    var g = K.grid(56, 34, ' ');
    g.box(0, 0, 56, 34, '#', '.');
    for (var y = 5; y < 26; y += 5) for (var x = 4; x < 50; x += 6) { g.set(x, y, '{'); g.set(x + 1, y, '{'); }
    g.rect(1, 28, 54, 5, ','); g.vline(28, 1, 27, ',');
    g.set(28, 33, 'N'); g.set(27, 30, 'R'); g.set(52, 30, 'E'); g.set(3, 30, 'C'); g.set(28, 0, 'H'); g.set(10, 0, 'W'); g.set(46, 0, 'V'); g.set(16, 30, 'B'); g.set(40, 30, 'L'); g.set(54, 2, '1'); g.set(2, 14, 'P'); g.set(0, 20, 'X');
    YN.defWorld({
      id: 'W033', name: 'The Glass Tower', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'tower', amb: { type: 'office', vol: 0.06 },
      look: { floor: { p: 'tile', c: ['#d8dce4', '#a8b0bc'] }, floor2: { p: 'grid', c: ['#101420', '#40e0ff'] }, wall: { p: 'flat', c: ['#1a2030', '#141a28'], topColor: '#1a2030' }, wallface: { p: 'glass', c: ['#6a90b8'], skirt: '#2a3a5a' } },
      tall: { '{': { look: 'monitor', opt: { c: ['#202838'] } } },
      variants: { lunch: { cond: { realTime: ['12:00', '13:00'] }, place: [{ id: 'lunchsign', type: 'sign', at: [28, 26], look: 'sign', lines: ['The soul still wears its badge around its neck.', { t: '점심시간이에요. 열두 시부터 한 시까지. 다들 밥 먹으러 갔어요.', lang: 'ko-s', tr: 'It’s lunchtime. From twelve to one. Everyone’s gone to eat.' }, { t: '화면은 그냥 켜 둬요. 습관이에요.', lang: 'ko-s', tr: 'We just leave the screens on. Force of habit.' }] }] } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'train', floor: '#', to: 'W002', arrive: 'trainE', look: 'door', lookOpt: { style: 'glass', c: ['#d8dce8'] }, essential: true, label: 'the white train', exitDir: 'up' },
        R: { id: 'robot', type: 'decor', look: 'deliverybot', animated: true, lines: [{ if: { noEffect: 'E32' }, t: '배달 왔습니다. 서명해 주세요.', lang: 'ko-s', tr: 'Delivery for you. Please sign here.' }, { if: { noEffect: 'E32' }, t: 'The robot holds out a screen and a stylus, and waits for your signature: yes, or no.' }], use: [{ if: { noEffect: 'E32' }, fn: function () { YN.ui.dialog.choose(['✔  네', '✖  아니요'], function (i) { if (i === 0) { YN.ui.dialog.queue([{ t: '감사합니다!', lang: 'ko-s', tr: 'Thank you very much!' }, 'The robot places a glowing earpiece in your hand. The Korean words all around begin to make sense.'], {}, function () { YN.game.giveEffect('E32'); }); } else YN.ui.dialog.queue([{ t: '…재배송하겠습니다.', lang: 'ko-s', tr: '…I will attempt redelivery.' }]); }); } }] },
        E: { id: 'elevator', type: 'elevator', floor: '.', to: 'W139', look: 'elevator', cond: { all: [{ effect: 'E32' }, { phase: ['late', 'final'] }] }, label: 'lift 44F', lockedText: [{ t: '44층 — 퇴근 시간 이후에만.', lang: 'ko-s', tr: '44th floor — only after clocking-off time.' }, 'Under the button, a small pictogram: a moon above a briefcase.'] },
        C: { id: 'coffee', type: 'decor', look: 'coffee', lines: [{ t: '아이스 아메리카노 나왔습니다.', lang: 'ko-s', tr: 'Your iced americano is ready.' }, 'The machine serves them without being asked. Forty cups are already lined up.'] },
        H: { id: 'holo', type: 'decor', floor: '#', look: 'hologram', animated: true, lines: [{ t: '빨리빨리! 더 빨리, 더 높이, 더 늦게까지.', lang: 'ko-s', tr: 'Hurry, hurry! Faster, higher, later.' }, 'The hologram’s smiling face has no mouth.'] },
        W: { id: 'window', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['Through the picture window, a whole city lit up at midnight. Every window is an office.'] },
        V: { id: 'window2', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['A drone passes the window, carrying a meal for one.'] },
        B: { id: 'board', type: 'sign', look: 'board', lookOpt: { lines: ['야근 23:00', '회식 01:00', '칼퇴 —'], color: '#40e0ff' }, lines: [{ t: '야근은 밤 열한 시. 회식은 새벽 한 시.', lang: 'ko-s', tr: 'Overtime, eleven at night. Team dinner, one in the morning.' }, { t: '칼퇴는… 그 칸은 비어 있어요. 원래 비어 있었어요.', lang: 'ko-s', tr: 'Leaving on time… that box is empty. It’s always been empty.' }] },
        L: { id: 'printer', type: 'decor', look: 'server', lines: ['A printer prints the same leave request, refused, over and over.'] },
        P: { id: 'pcbang', type: 'door', floor: '#', to: 'W062', look: 'door', lookOpt: { style: 'glass', c: ['#40e0ff'], symbol: 'PC' }, cond: { effect: 'E32' }, label: 'PC방', exitDir: 'right' },
        X: { id: 'hagwon', type: 'door', floor: '#', to: 'W061', look: 'door', lookOpt: { style: 'metal', c: ['#e0e040'], symbol: '학' }, cond: { effect: 'E32' }, label: '학원', exitDir: 'right' },
        '1': cookieMark('towerCookie')
      },
      place: [
        { type: 'soul', at: 'random-any', lines: [{ t: '밥 식는다, 미란아. …아빠는 오늘도 늦어.', lang: 'ko-s', tr: 'Your rice is getting cold, Mi-ran. …Dad’s late again tonight.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '과장님 책상 위에 사진이 있어요. 작은 여자아이. 명찰에 이름이 있는데… 잘 안 보여요.', lang: 'ko-s', tr: 'There’s a photo on the manager’s desk. A little girl. There’s a name on her name tag… you can’t quite make it out.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '서울이랑 영상통화를 하면, 다들 사무실에 있었어요. 뒤는 항상 밤이었어요.', lang: 'ko-s', tr: 'When we video-called Seoul, everyone was at the office. Behind them, it was always night.' }] },
        { type: 'soul', at: 'random-any', lines: ['The soul wears a meeting headset, its little red light on.', { t: '아이가 “엄마” 하고 불렀는데, 저는 회의 중이었어요. 음소거 끄는 법을 잊어버렸어요.', lang: 'ko-s', tr: 'My child called out “Mum”, and I was in a meeting. I’d forgotten how to unmute.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '“아니요”는 결재가 안 나요. 그래서 다들 “네”만 해요.', lang: 'ko-s', tr: '“No” never gets signed off. So everyone only ever says “yes”.' }] },
        { type: 'soul', at: 'random-any', lines: [{ t: '불 꺼진 창문이 하나도 없어요. 누가 먼저 끄는지, 다들 보고 있어요.', lang: 'ko-s', tr: 'There isn’t a single dark window. Everyone is watching to see who switches off first.' }] }
      ],
      npcs: [{ id: 'N011', at: [20, 15] }, { id: 'N115', at: [10, 20] }, { id: 'N116', at: [40, 10] }, { id: 'N117', at: [34, 22] }, { id: 'N118', at: [46, 18] }],
      info: {
        summary: 'An open-plan office floor in a Seoul tower, at night: screens on, iced coffee, holograms, a delivery robot.',
        art: 'Bluish glass, grey carpet, cyan neon, holograms.',
        rules: ['Signing for the robot’s delivery (✔ 네) gives the Earpiece (E32), which translates both Koreans.', 'With the Earpiece: the PC방 (W062), the 학원 (W061); late in the dream, the lift to the 44th floor (W139).'],
        time: ['Real-world lunch break (12:00–13:00): everyone has gone.'],
        role: 'Gives the Earpiece. The 야근 quest (Q09) with 김 과장.',
        lore: 'The mother’s country as the video calls show it: work, exams, screens.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
