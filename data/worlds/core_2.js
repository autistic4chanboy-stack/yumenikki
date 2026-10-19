/* =========================================================================
 *  MONDES DU CŒUR (2/6) — W006 Verger · W007 Fabrique de sommeil ·
 *  W008 Quartier vide · W009 Maison qui attend · W010 Portes identiques ·
 *  W011 Désert des téléphones · W012 Village à la langue inconnue ·
 *  W013 Forêt musicale
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;
  function cookieMark(key) { var t = {}; t[key] = true; var c = {}; c[key] = true; return { id: 'cookie_' + key, type: 'cookie', look: 'cookie', cond: { not: { temp: c } }, use: [{ temp: t }] }; }

  /* ======================= W006 — LE VERGER ======================= */
  (function () {
    var g = K.grid(50, 36, '.');
    g.border('#');
    for (var y = 4; y < 32; y += 4) for (var x = 4; x < 46; x += 5) if (!(x > 20 && x < 30 && y > 12 && y < 24)) g.set(x + ((y / 4) % 2 ? 2 : 0), y, '^');
    g.rect(21, 13, 9, 11, ','); g.ellipse(25, 18, 2, 2, ':');
    g.hline(1, 48, 34, ','); g.vline(25, 1, 12, ','); g.vline(25, 24, 34, ',');
    g.set(0, 18, 'W'); g.set(25, 0, 'N'); g.set(25, 18, 'P'); g.set(30, 16, 'L'); g.set(10, 30, 'S'); g.set(44, 6, '1'); g.set(38, 26, 'H');
    YN.defWorld({
      id: 'W006', name: 'The Orchard', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'orchard', amb: { type: 'wind', vol: 0.04 },
      look: { _base: 'garden', floor: { p: 'meadow', c: ['#5a8a3c', '#4a7a34', '#6a9a48', '#3a6a2c'] }, floor2: { p: 'dirt', c: ['#8a6a44', '#7a5c3a', '#9a7a52'] }, floor3: { p: 'stone', c: ['#8a8a80', '#6e6e66', '#4a4a44'] } },
      tall: { '^': { look: 'tree', opt: { c: ['#4a8a3a', '#2f6a2e', '#5a3e26', '#e04040'], fruit: '#e03838' } } },
      map: g.rows(),
      marks: {
        W: { id: 'west', type: 'path', to: 'W001', arrive: 'E', essential: true },
        N: { id: 'north', type: 'path', to: 'W025', essential: true },
        P: { id: 'well', type: 'fall', to: 'W039', look: 'well', solid: true, label: 'the well', lines: ['A well. Far down at the bottom, something grey breathes like the sea.'] },
        L: { id: 'ladder', type: 'decor', look: 'ladder', lines: ['A ladder leaning against nothing. The top apples are for those who float.'] },
        S: { id: 'basket', type: 'decor', look: 'crate', lines: [{ if: { not: { flag: 'got:apple' } }, t: 'A basket. Just one apple inside, shaped like a heart, almost.', do: [{ set: { 'got:apple': true } }, { item: { apple: 1 } }] }, { t: 'The basket is empty. It will stay empty until next season, which never comes.' }] },
        H: { id: 'hive', type: 'decor', look: 'hive', animated: true, lines: ['A hive. It hums a dance: three steps left, one up. Towards what?'] },
        '1': cookieMark('orchardCookie')
      },
      npcs: [{ id: 'N045', at: [33, 10] }, { id: 'N046', at: [12, 22] }, { id: 'N047', at: [40, 30] }],
      place: [
        { id: 's_w006_hearts', type: 'soul', at: 'random-any', lines: [{ t: 'She cut them in four. Always in four, always into hearts.', lang: 'en' }, { t: 'The peel came off in one long ribbon. She never let it break.', lang: 'en' }] },
        { id: 's_w006_share', type: 'soul', at: 'random-any', lines: ['She smells of cut apple and kitchen soap.', { t: '자, 아- 해 봐. 하나는 너, 하나는 엄마 거.', lang: 'ko-s', tr: 'Here, say “aah”. One piece for you, one for Mum.' }, { t: '엄마 건 냉장고에 넣어 두자. 일 끝나고 오면 먹게.', lang: 'ko-s', tr: 'Let’s put Mum’s in the fridge. So she can eat it when she gets home from work.' }] },
        { id: 's_w006_top', type: 'soul', at: 'random-any', lines: [{ t: 'Don’t pick the high ones. Somebody up there is still hungry.', lang: 'en' }] },
        { id: 's_w006_whistle', type: 'soul', at: 'random-any', lines: [{ t: 'She used to whistle into the well. Low, low, higher, higher still.', lang: 'en' }, { t: 'The well always sent something back up.', lang: 'en' }] },
        { id: 's_w006_ticket', type: 'soul', at: 'random-any', lines: [{ t: 'I dropped a bucket down there once. It came back with grey water and a train ticket.', lang: 'en' }, { t: 'No hour printed on it. Just a platform.', lang: 'en' }] }
      ],
      mech: [{ type: 'melodyLock', mark: 'well', tune: '0024', dist: 3, reward: [{ item: { apple: 1 } }], winLines: ['A bucket comes up out of the well. Inside, an apple, wet from very far away.'], flag: 'well_apple' }],
      info: {
        summary: 'An orchard of apple trees in staggered rows around a stone courtyard and a well.',
        art: 'Springtime pixel art, red apples, grass dotted with flowers.',
        rules: ['Falling into the well leads further down (W039).', 'The basket gives an apple (another way to get the Fish in The Garden).'],
        secrets: ['Playing do do mi sol at the edge of the well brings up a second apple.'],
        role: 'Links The Garden to The Frozen Lake (W025) and to the bottom of the well.',
        lore: 'The canteen apples, cut in four by grandmother, always into hearts.'
      }
    });
  })();

  /* ======================= W007 — LA FABRIQUE DE SOMMEIL ======================= */
  (function () {
    var g = K.grid(58, 34, ' ');
    g.box(0, 0, 58, 34, '#', '.');
    for (var y = 5; y < 30; y += 6) { g.hline(3, 54, y, 'z'); for (var x = 6; x < 54; x += 8) g.set(x, y - 2, '}'); }
    g.vline(28, 1, 32, '.');
    [[2, 2], [55, 2], [2, 31], [55, 31]].forEach(function (p) { g.set(p[0], p[1], '{'); });
    g.set(0, 16, 'N'); g.set(57, 16, 'X'); g.set(10, 3, 'A'); g.set(22, 9, 'B'); g.set(38, 15, 'C'); g.set(48, 21, 'D'); g.set(28, 32, 'S'); g.set(14, 27, 'P'); g.set(44, 9, 'Q'); g.set(52, 29, '1');
    YN.defWorld({
      id: 'W007', name: 'The Sleep Factory', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'factory', amb: { type: 'machine', vol: 0.08 }, conveyorDir: 'right', dark: 0.35,
      look: { floor: { p: 'metal', c: ['#4a4e56'] }, wall: { p: 'flat', c: ['#1a1c20', '#141618'], topColor: '#181a1e' }, wallface: { p: 'metal', c: ['#5a5e66'], skirt: '#a08020' }, conveyor: { p: 'hstripes', c: ['#2a2a2e', '#4a4a50'] } },
      tall: { '}': { look: 'server', opt: { c: ['#3a3e46'] } }, '{': { look: 'barrel', opt: { c: ['#8a2a20'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W002', look: 'door', lookOpt: { style: 'metal', symbol: 'P' }, essential: true, exitDir: 'right' },
        X: { id: 'lab', type: 'door', floor: '#', to: 'W120', look: 'door', lookOpt: { style: 'metal', c: ['#c8ccd4'], symbol: '6' }, cond: { flag: 'factory_off' }, lockedText: 'An armoured door: “RESTRICTED ACCESS — PROTOCOL 0”.', exitDir: 'left', label: 'laboratory door' },
        A: { id: 'lever1', type: 'switch', look: 'lever', lines: ['A lever. A label: ①.'] },
        B: { id: 'lever2', type: 'switch', look: 'lever', lines: ['A lever. ②.'] },
        C: { id: 'lever3', type: 'switch', look: 'lever', lines: ['A lever. ③.'] },
        D: { id: 'lever4', type: 'switch', look: 'lever', lines: ['A lever. ④.'] },
        S: { id: 'shift', type: 'sign', look: 'board', lookOpt: { lines: ['ORDER 1-3-2-4', 'PROTOCOL 0', 'SLEEP'], color: '#e04040' }, lines: ['A soul in work overalls, a night-shift badge pinned on crooked.', { t: 'Emergency stop: one, three, two, four. That’s what the board said.', lang: 'en' }, { t: 'Under it, in pen, someone wrote: do not stop.', lang: 'en' }, { t: 'PROTOCOL 0: sleep is made on site. Dreams are waste.', lang: 'en' }], cycle: true },
        P: { id: 'pod', type: 'hide', look: 'bathtub', lines: ['An empty vat, lukewarm. You could hide in it.'] },
        Q: { id: 'poster', type: 'sign', look: 'poster', lookOpt: { c: ['#202020', '#e04040'] }, lines: ['The soul keeps one eye shut, crossed out with a line.', { t: 'Close one eye. Then the other. That’s how we sleep here.', lang: 'en' }, { t: 'Nobody painted the open eye. Nobody was allowed to.', lang: 'en' }] },
        '1': cookieMark('factoryCookie')
      },
      npcs: [{ id: 'N048', at: [8, 11] }, { id: 'N049', at: [40, 23] }, { id: 'N050', at: [20, 17] }, { id: 'N050', at: [36, 29] }],
      place: [
        { id: 's_w007_night', type: 'soul', at: 'random-any', lines: [{ t: '야간 근무였어요. 아침 일곱 시에 들어가면 아이는 자고 있었어요.', lang: 'ko-s', tr: 'I worked nights. When I got home at seven in the morning, the little one was asleep.' }, { t: '깨우지 않았어요. 괜찮아요. 괜찮아요.', lang: 'ko-s', tr: 'I didn’t wake her. It’s fine. It’s fine.' }] },
        { id: 's_w007_bottles', type: 'soul', at: 'random-any', lines: [{ t: 'They take the sleep out of us and bottle it. Delivery at six.', lang: 'en' }, { t: 'The dreams go down the chute. I kept one in my pocket. It’s still warm.', lang: 'en' }] },
        { id: 's_w007_count', type: 'soul', at: 'random-any', lines: [{ t: 'Behind the steel door, a room counts your breathing.', lang: 'en' }, { t: 'It counted five before you. It lost their files.', lang: 'en' }] },
        { id: 's_w007_aa', type: 'soul', at: 'random-any', lines: ['A soul standing with its eyes closed, an empty cup in its hand.', { t: '아아 한 잔만 더 마시면 안 졸려요.', lang: 'ko-s', tr: 'One more iced americano and I won’t fall asleep.' }, { t: '칼퇴는 꿈에서나 하는 거죠.', lang: 'ko-s', tr: 'Leaving on time only happens in dreams.' }] }
      ],
      mech: [{ type: 'sequence', order: ['lever1', 'lever3', 'lever2', 'lever4'], flag: 'factory_off', okSfx: 'lever', winLines: ['The belts stop. The silence is enormous.', 'At the far end, an armoured door unlocks.'], wrongLine: 'A siren, brief. The belts start up again.' }],
      variants: { stopped: { cond: { flag: 'factory_off' }, tiles: { 'z': '.' } } },
      info: {
        summary: 'A factory where conveyor belts carry sleepers. Levers, a shift board, lukewarm vats.',
        art: 'Grey metal, sparse neon, moving belts; low light.',
        rules: ['The belts push to the right.', 'Pulling the levers in the order 1, 3, 2, 4 stops the factory (once and for all).'],
        secrets: ['Factory stopped: the armoured door leads to Laboratory 6 (W120).'],
        role: 'Secret way into Laboratory 6.',
        lore: 'PROTOCOL 0: one of the Priestess’s readings (the depression that makes sleep without dreams).'
      }
    });
  })();

  /* ======================= W008 — QUARTIER RÉSIDENTIEL VIDE ======================= */
  (function () {
    var g = K.grid(64, 40, '.');
    g.border('#');
    for (var by = 0; by < 3; by++) for (var bx = 0; bx < 5; bx++) {
      var x0 = 4 + bx * 12, y0 = 4 + by * 12;
      g.rect(x0, y0, 8, 7, ':');            // jardinets
      g.set(x0 + 4, y0 + 3, 'h');           // marque maison posée plus bas
      g.set(x0 + 1, y0 + 7, 'o');           // boîte aux lettres
    }
    for (var y = 0; y < 40; y++) for (var x = 0; x < 64; x++) if (g.at(x, y) === 'h') g.set(x, y, ':');
    g.hline(1, 62, 13, ','); g.hline(1, 62, 25, ','); g.vline(15, 1, 38, ','); g.vline(39, 1, 38, ',');
    g.rect(44, 28, 14, 8, '"'); g.set(47, 30, '{'); g.set(54, 33, '{');
    g.set(32, 0, 'N'); g.set(8, 7, 'A'); g.set(20, 7, 'B'); g.set(32, 7, 'C'); g.set(44, 7, 'D'); g.set(56, 7, 'E'); g.set(8, 19, 'F'); g.set(20, 19, 'H'); g.set(32, 19, 'I'); g.set(44, 19, 'J'); g.set(56, 19, 'L'); g.set(8, 31, 'M'); g.set(20, 31, 'O'); g.set(32, 31, 'Q');
    g.set(50, 30, 'R'); g.set(52, 34, 'S'); g.set(36, 26, 'T'); g.set(60, 38, '1'); g.set(46, 33, 'U');
    var houses = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, H: 6, I: 7, J: 8, L: 9, M: 10, O: 11, Q: 12 };
    var marks = {
      N: { id: 'back', type: 'path', to: 'W003', arrive: 'toHouses', essential: true },
      R: { id: 'swing', type: 'decor', look: 'swing', animated: true, lines: ['A swing moves on its own, very gently, as if someone had just got off.'] },
      S: { id: 'line', type: 'inner', to: 'W024', look: 'clothesline', lines: ['A clothesline rises, and rises, and is lost in the sky.'], label: 'the clothesline', essential: true },
      T: { type: 'spawn' },
      U: { id: 'sandbox', type: 'decor', look: 'sandbox', lines: ['In the sandpit, someone traced a number and rubbed it out with a foot: 4… 7?'] },
      '1': cookieMark('suburbCookie')
    };
    var names = ['Kim', 'Martin', 'Ahn', 'Walker', 'Lee', 'Moore', '—', 'Bennett', 'Park', 'Reed', 'Choi', 'Wood', 'Nour'];
    Object.keys(houses).forEach(function (k) {
      var i = houses[k];
      if (k === 'I') marks[k] = { id: 'house9', type: 'door', to: 'W009', look: 'house', lookOpt: { c: ['#c8b8a0', '#6a3a3a'], lit: true }, lines: [], label: 'the lit house', essential: true };
      else if (k === 'Q') marks[k] = { id: 'houseNour', type: 'decor', look: 'house', lookOpt: { c: ['#a8b8c8', '#3a4a6a'], sold: true }, lines: ['A “SOLD” sign. On the letterbox, a half-peeled name: NOUR.', 'Behind the window, an empty bedroom with drawings still on the wall.'], cycle: true,
        use: [{ if: { met: 'N008', not: { flag: 'got:drawing' } }, set: { 'got:drawing': true }, item: { drawing: 1 }, quest: { Q07: 'drawing' }, msg: 'Through the slot of the letterbox, you catch hold of a forgotten drawing: two girls holding hands in front of this house. One of them has a line on her arm.' }] };
      else marks[k] = { id: 'house' + i, type: 'decor', look: 'house', lookOpt: { c: [['#d8c8b0', '#c8b8a8', '#e0d0c0', '#b8a898'][i % 4], ['#7a3a3a', '#3a4a6a', '#4a6a3a', '#5a4a3a'][i % 4]] }, lines: ['The door of the ' + names[i] + ' house is shut. So are the shutters.', i % 3 === 0 ? 'A television is on, behind the shutters. Nobody laughs.' : 'Nothing moves. Not even the doormat.'], cycle: true };
    });
    YN.defWorld({
      id: 'W008', name: 'Empty Neighbourhood', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'suburb', amb: { type: 'wind', vol: 0.03 },
      look: { floor: { p: 'asphalt', c: ['#5a5a62'] }, floor2: { p: 'tile', c: ['#a8a4a0', '#7a7670'] }, floor3: { p: 'grass', c: ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#3a6a2a'] }, leafg: { p: 'grass', c: ['#4a7a3a', '#3a6a2a', '#5a8a4a', '#2a5a20'] }, wall: { p: 'hedge', c: ['#3a6a3a', '#2a5a2a', '#4a7a4a', '#1a4a1a'] } },
      tall: { 'o': { look: 'mailbox' }, '{': { look: 'bench' } },
      map: g.rows(), marks: marks,
      npcs: [{ id: 'N051', at: [26, 13] }, { id: 'N052', at: [48, 25] }, { id: 'N053', at: [12, 37] }],
      place: [
        { id: 's_w008_key', type: 'soul', at: 'random-any', lines: [{ t: 'Key on a string, under your shirt. Don’t show it. Don’t lose it.', lang: 'en' }, { t: 'Open, lock, shoes off. Don’t call anyone.', lang: 'en' }] },
        { id: 's_w008_mother', type: 'soul', at: 'random-any', lines: ['A soul in a coat; a pale smock shows underneath.', { t: '열쇠 챙겼어? 문 꼭 잠그고 자.', lang: 'ko-s', tr: 'Have you got your key? Lock the door properly before you go to sleep.' }, { t: '엄마 금방 올게. 아침에.', lang: 'ko-s', tr: 'Mum will be back soon. In the morning.' }] },
        { id: 's_w008_laugh', type: 'soul', at: 'random-any', lines: [{ t: 'In the house with the TV on, a boy laughs louder than the TV.', lang: 'en' }, { t: 'Nobody comes to tell him to stop. That’s the joke.', lang: 'en' }] },
        { id: 's_w008_arms', type: 'soul', at: 'random-any', lines: [{ t: 'Two girls used to sit on a low wall around here and write on each other’s arms. One of them moved away.', lang: 'en' }, { t: 'The other one stopped talking. Not because of that. Not only.', lang: 'en' }] },
        { id: 's_w008_windows', type: 'soul', at: 'random-any', lines: [{ t: 'Every window here was lit once. Fifteen houses, fifteen dinners.', lang: 'en' }, { t: 'Count the lit ones now.', lang: 'en' }] }
      ],
      info: {
        summary: 'An estate of fifteen identical houses, shutters closed; a little square with a swing and a clothesline that climbs into the sky.',
        art: 'Pastel pixel art, low hedges, light grey asphalt.',
        rules: ['Only one house is lit.', 'The clothesline is an “inside” entrance (W024).'],
        secrets: ['Nour’s house, sold.', 'The sandpit keeps a half-erased number (a clue for W010).'],
        role: 'Leads to The House That Waits (W009) and The Laundry Sky (W024).',
        lore: 'The neighbourhood where you come home alone with the key around your neck.'
      }
    });
  })();

  /* ======================= W009 — LA MAISON QUI ATTEND ======================= */
  (function () {
    var g = K.grid(34, 26, ' ');
    g.box(0, 0, 34, 26, '#', '.');
    g.vline(12, 0, 25, '#'); g.vline(22, 0, 25, '#'); g.hline(0, 33, 13, '#');
    g.set(12, 6, '.'); g.set(12, 19, '.'); g.set(22, 6, '.'); g.set(22, 19, '.'); g.set(6, 13, '.'); g.set(17, 13, '.'); g.set(28, 13, '.');
    g.rect(1, 14, 11, 11, ':'); g.rect(23, 1, 10, 12, ',');
    g.set(17, 25, 'N'); g.set(5, 1, 'K'); g.set(8, 3, 'F'); g.set(2, 6, 'T'); g.set(16, 1, 'W'); g.set(14, 5, 'S'); g.set(19, 9, 'V');
    g.set(27, 1, 'M'); g.set(30, 6, 'B'); g.set(5, 16, 'D'); g.set(9, 22, 'Y'); g.set(15, 16, 'A'); g.set(26, 20, 'C'); g.set(31, 23, '1'); g.set(20, 22, 'P');
    YN.defWorld({
      id: 'W009', name: 'The House That Waits', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'house', amb: { type: 'clock', vol: 0.05 },
      look: Object.assign({}, K.LOOK.house, { floor3: { p: 'tile', c: ['#d8e4e8', '#a8b8c0'] }, floor2: { p: 'carpet', c: ['#6a4a5a', '#5a3a4a'] } }),
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W008', arrive: 'house9', look: 'door', lookOpt: { style: 'wood' }, essential: true, exitDir: 'up' },
        K: { id: 'fridge', type: 'decor', floor: '#', look: 'fridge', lookOpt: { notes: true }, lines: ['On the fridge, a note under a magnet: “Be home before dark.” The handwriting is yours.', 'The fridge hums. Inside, two bowls under cling film. Nobody has touched them.'], cycle: true },
        F: { id: 'table', type: 'decor', look: 'table', lookOpt: { cloth: '#e8d8c8' }, lines: ['The table is laid for three. One chair is pushed against the wall.'] },
        T: { id: 'tv', type: 'tv', look: 'tv', animated: true, lines: [{ t: '“…and now, a word from the outside. Stay tuned, sweetheart.”', lang: 'en' },{ t: 'The television shows a lit kitchen, seen from very far away.' }], cycle: true },
        W: { id: 'window', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['Through the window, the street. A figure is holding a suitcase.'] },
        S: { id: 'sofa', type: 'decor', look: 'sofa', lines: ['The sofa keeps the shape of someone lying down. It is still warm.'] },
        V: { id: 'stairs', type: 'stairs', to: 'W034', look: 'stairs', solid: false, label: 'attic stairs', essential: true },
        M: { id: 'mirror', type: 'mirror', floor: '#', look: 'mirror', lines: [{ if: { dark: true, noEffect: 'E21' }, t: 'In the dark, the reflection does not copy you. It holds out its hand. In its hand, a little mirror.', do: [{ give: 'E21' }] }, { if: { dark: true }, t: 'The reflection smiles at you, a moment too late.' }, { t: 'The bathroom mirror. The reflection is waiting for you to switch off the light.' }] },
        B: { id: 'bath', type: 'hide', look: 'bathtub', lines: ['The bath is full of water that never goes cold.'] },
        D: { id: 'dollhouse', type: 'inner', look: 'dollhouse', to: 'W023', lines: ['A doll’s house. All the windows are lit, except one, upstairs.'], label: 'the doll’s house', essential: true },
        Y: { id: 'bed', type: 'decor', look: 'bed', lookOpt: { c: ['#f0e8f0', '#c87a9a'] }, lines: ['A child’s bed, neatly made. The blanket has never been used.'] },
        A: { id: 'shoes', type: 'decor', look: 'shoe', lines: ['Three pairs of shoes in the hall. One pair is a man’s, dusty.'] },
        C: { id: 'clock', type: 'anchor', look: 'clock', animated: true, lines: ['The hallway clock. It moves on when someone whistles in the house.'] },
        P: { id: 'phone', type: 'phone', look: 'phone', lines: ['The landline. A list of numbers taped beside it: “Mum’s work (nights) — do not call unless it’s an emergency”. The number has been torn off.'] },
        '1': cookieMark('houseCookie')
      },
      npcs: [{ id: 'N006', at: [26, 16] }],
      place: [
        { id: 's_w009_knock', type: 'soul', at: 'random-any', lines: ['A soul clears its throat, as if before a joke.', { t: 'Knock knock. — Who’s there? — Daddy.', lang: 'en' }, { t: '— Daddy who? — Daddy who’s coming back tomorrow…', lang: 'en' }] },
        { id: 's_w009_case', type: 'soul', at: 'random-any', lines: [{ t: 'A suitcase with a J on it went out through that door. The J was gold. It was peeling.', lang: 'en' }] },
        { id: 's_w009_plates', type: 'soul', at: 'random-any', lines: [{ t: 'Three plates, always. So he can come back without having to ask.', lang: 'en' }] },
        { id: 's_w009_busy', type: 'soul', at: 'random-any', lines: [{ t: '괜찮아. 아빠는 바빠서 그래.', lang: 'ko-s', tr: 'It’s all right. Daddy’s just busy.' }, { t: '…괜찮아. 자, 이제 자.', lang: 'ko-s', tr: '…It’s all right. Come on, go to sleep now.' }] },
        { id: 's_w009_tenant', type: 'soul', at: 'random-any', lines: [{ t: 'The tenant never asks who he’s waiting for.', lang: 'en' }, { t: 'If he asked, he would have to leave.', lang: 'en' }] },
        { id: 's_w009_wait', type: 'soul', at: 'random-any', lines: ['A small, stooped soul, with earth under its nails.', { t: '문은 잠그지 마라. 누가 올지 모르잖니.', lang: 'ko-s', tr: 'Don’t lock the door. You never know who might come.' }, { t: '나도 평생 기다렸단다. 기다리는 건 잘해.', lang: 'ko-s', tr: 'I waited my whole life too. Waiting, I’m good at.' }] }
      ],
      mech: [{ type: 'locataire' }],
      variants: { ajar: { cond: { roomDoor: true }, place: [{ id: 'ajarnote', type: 'note', at: [17, 14], look: 'letter', lines: ['A note on the floor, in careful handwriting:', { t: 'Tidied up. Don’t worry. — L.', lang: 'en' }] }] } },
      info: {
        summary: 'A house where everything is ready for someone: kitchen, living room, bathroom, child’s bedroom, attic stairs, doll’s house.',
        art: 'Warm interior, beige wallpaper, yellow light; the Tenant is never seen.',
        rules: ['Light off: the reflection in the mirror holds out the Pocket Mirror.', 'Bedroom door ajar: the Tenant tidies up (objects move, a note appears).'],
        secrets: ['The number of the mother’s work, torn off.'],
        role: 'Gives the Pocket Mirror. Leads to The Toy Attic (W034) and The Doll’s House (W023).',
        lore: 'A house waiting for someone to come back. The Tenant tidies so that everything is ready.'
      }
    });
  })();

  /* ======================= W010 — QUARTIER AUX PORTES IDENTIQUES ======================= */
  (function () {
    var g = K.grid(52, 30, '.');
    g.border('#');
    var nums = [12, 23, 31, 47, 58, 64, 71, 89, 90, 13, 44, 74];
    var keys = 'ABCDEFHIJLMO'.split('');
    for (var i = 0; i < 12; i++) { var x = 4 + (i % 6) * 8, y = i < 6 ? 6 : 18; g.rect(x - 2, y - 3, 5, 3, '%'); g.set(x, y - 1, keys[i]); g.set(x, y + 1, ','); }
    g.box(40, 23, 10, 6, '%', ':'); g.set(44, 23, '%'); g.set(45, 26, 'K'); g.set(42, 26, '@');
    g.set(26, 29, 'N'); g.set(26, 12, 'S'); g.set(3, 27, '1'); g.set(26, 26, 'G');
    var marks = {
      N: { id: 'back', type: 'path', to: 'W003', arrive: 'toDoors', essential: true },
      S: { id: 'sign', type: 'sign', look: 'sign', lines: [{ t: 'All the doors are the right door.', lang: 'en' }, { t: '…no.', lang: 'en' }] },
      K: { id: 'keys', type: 'effect', give: 'E12', unreachOk: 'through door 47', look: 'keyring', getLines: ['A keyring on a nail. None of the keys is yours. They open things all the same.'] },
      G: { type: 'spawn' },
      '@': { type: 'spawn', floor: ':' },
      '1': cookieMark('doorsCookie')
    };
    keys.forEach(function (k, i) {
      var n = nums[i], right = n === 47;
      marks[k] = { id: 'd' + n, type: 'decor', floor: '%', look: 'door', lookOpt: { style: 'metal', c: ['#5a6a7a'], symbol: String(n), ajar: right && false }, lookIf: right ? [{ cond: { roomDoor: true }, lookOpt: { style: 'metal', c: ['#5a6a7a'], symbol: String(n), ajar: true } }] : null,
        use: right ? [{ msg: 'Door 47 opens onto a small room.' }, { teleport: { world: 'W010', arrive: '@' } }] : [{ msg: ['Behind door ' + n + ': the same street, seen from a little further away.', 'Door ' + n + ' opens onto door ' + n + '.', 'Behind door ' + n + ', a voice whispers that you are not the one they are waiting for.'][i % 3] }, { teleport: { world: 'W010', arrive: 'G' } }] };
    });
    YN.defWorld({
      id: 'W010', name: 'District of Identical Doors', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'doors', amb: { type: 'hum', vol: 0.03 },
      look: { floor: { p: 'concrete', c: ['#7a7a80'] }, floor2: { p: 'tile', c: ['#9a9a9a', '#6a6a6a'] }, floor3: { p: 'carpet', c: ['#5a3a3a', '#4a2a2a'] }, wall2: { p: 'brick', c: ['#8a8a92', '#6a6a72', '#4a4a52'] } },
      map: g.rows(), marks: marks,
      npcs: [{ id: 'N022', at: [10, 12] }, { id: 'N054', at: [36, 12] }],
      place: [
        { id: 's_w010_1204', type: 'soul', at: 'random-any', lines: [{ t: 'Twelve-oh-four. Say it in the lift so you don’t forget. Twelve-oh-four.', lang: 'en' }] },
        { id: 's_w010_breath', type: 'soul', at: 'random-any', lines: [{ t: 'The right door is the one that breathes when yours does.', lang: 'en' }, { t: 'Or ask the desert. It keeps the number on the line.', lang: 'en' }] },
        { id: 's_w010_wrong', type: 'soul', at: 'random-any', lines: [{ t: 'Once I knocked on the wrong floor. A lady opened. Same carpet as ours.', lang: 'en' }, { t: 'I said sorry in the wrong language.', lang: 'en' }] }
      ],
      info: {
        summary: 'Twelve identical numbered metal doors, set into house fronts with no houses behind them.',
        art: 'Pale concrete, grey doors; only door 47 sometimes stands ajar.',
        rules: ['A wrong door takes you back to the middle of the street.', 'Door 47 (spoken by a voice in Desert of Telephones) leads to the keyring room.', 'Bedroom door ajar: the right door is ajar too.'],
        secrets: ['The sandpit in Empty Neighbourhood keeps “4… 7”.'],
        role: 'Gives the Keyring (E12).',
        lore: 'All the doors in the building look alike when you come home alone and are afraid of getting the floor wrong.'
      }
    });
  })();

  /* ======================= W011 — DÉSERT DES TÉLÉPHONES ======================= */
  (function () {
    var g = K.grid(60, 44, '.');
    var r = YN.rng.make(11);
    g.ellipse(30, 22, 26, 18, ','); g.ellipse(30, 22, 18, 12, '.');
    for (var i = 0; i < 40; i++) { var x = r.int(1, 58), y = r.int(1, 42); if (g.at(x, y) === ',') g.set(x, y, r.chance(0.6) ? 'o' : '^'); }
    g.set(30, 43, 'N'); g.set(59, 22, 'V'); g.set(30, 22, 'C');
    [[18, 14, 'A'], [42, 12, 'B'], [44, 30, 'D'], [16, 31, 'E'], [30, 8, 'F'], [24, 36, 'H']].forEach(function (p) { g.set(p[0], p[1], p[2]); });
    g.set(52, 38, '1'); g.set(8, 6, 'M');
    var phone = function (id, ln) { return { id: id, type: 'phone', look: 'phone', lookOpt: { c: ['#d03838'] }, lines: ln ? [ln] : null }; };
    YN.defWorld({
      id: 'W011', name: 'Desert of Telephones', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true, wrap: true,
      style: { view: 'top', cliffH: 0 }, music: 'desert', amb: { type: 'wind', vol: 0.06 }, weather: { dust: true },
      look: Object.assign({}, K.LOOK.desert, { rock: { p: 'rock', c: ['#a08868', '#806848', '#c0a888'] } }),
      tall: { '^': { look: 'telepole' }, 'o': { look: 'rock', opt: { c: ['#a08868'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', to: 'W005', arrive: 'toDesert', look: 'door', lookOpt: { style: 'metal', c: ['#e8e8e8'] }, essential: true },
        V: { id: 'village', type: 'path', to: 'W012', essential: true },
        C: { id: 'center', type: 'phone', look: 'payphone', lines: [{ if: { effect: 'E11' }, who: 'on the line, a slow voice', t: '…forty… seven. Forty-seven. Forty-seven.', lang: 'en', do: [{ note: 'n_47' }] }, { t: 'A phone box in the middle of the desert. The receiver is warm. It is waiting for the others to finish speaking.' }] },
        A: phone('ph1'), B: phone('ph2'), D: phone('ph3'), E: phone('ph4'), F: phone('ph5'), H: phone('ph6'),
        M: { id: 'mirage', type: 'decor', look: 'apartment', alpha: 0.35, lines: ['A building, far off, transparent. It moves back when you move forward.'] },
        '1': cookieMark('desertCookie')
      },
      npcs: [{ id: 'N055', at: [34, 26] }, { id: 'N056', at: [10, 20] }],
      place: [
        { id: 's_w011_clock', type: 'soul', at: 'random-any', lines: [{ t: 'I called the speaking clock every night. It never once asked how I was.', lang: 'en' }, { t: 'I said thank you anyway.', lang: 'en' }] },
        { id: 's_w011_seoul', type: 'soul', at: 'random-any', lines: [{ t: '엄마, 나 괜찮아. 여기 다 좋아.', lang: 'ko-s', tr: 'Mum, I’m fine. Everything’s fine here.' }, { t: '…전화 끊고 한참 울었어. 엄마는 몰랐지.', lang: 'ko-s', tr: '…After I hung up, I cried for a long time. Mum never knew.' }] },
        { id: 's_w011_brother', type: 'soul', at: 'random-any', lines: ['A stooped soul, gripping a receiver in both hands.', { t: '여보세요? 오빠? 오빠 맞아요?', lang: 'ko-s', tr: 'Hello? Big brother? Is it really you?' }, { t: '…잘못 걸었습니다. 죄송합니다.', lang: 'ko-s', tr: '…I have the wrong number. I’m sorry.' }] },
        { id: 's_w011_poles', type: 'soul', at: 'random-any', lines: [{ t: 'Every pole out here is a sentence someone didn’t finish.', lang: 'en' }, { t: 'The wires hum the rest.', lang: 'en' }] }
      ],
      mech: [{ type: 'sequence', order: ['ph3', 'ph1', 'ph5', 'ph2', 'ph6', 'ph4'], ring: { every: 1.4, pause: 5, sfx: 'phone_ring', hear: 40, glyph: '☎' }, give: 'E11', okLines: ['You breathe a hello, very softly. Nobody.', 'You breathe a hello, very softly. A breath.', 'You breathe a hello, very softly. A television, very far away.', { who: 'on the line', t: '…밥은 먹었어?', lang: 'ko-s', tr: '…have you eaten?' }, 'You breathe a hello, very softly. A train going past.', 'You breathe a hello, very softly. At the other end, someone breathes a hello too, in your voice.'], winLines: ['The last receiver does not hang up. It folds, shrinks, and fits in your hand: a toy telephone, with a dial tone.'], wrongLine: 'Dial tone. All the receivers start ringing again, from the beginning.' }],
      radio: { '47.0': { line: { t: '…forty-seven… forty-seven…', lang: 'en' } } },
      info: {
        summary: 'A desert that loops, planted with telegraph poles and telephones set in the sand. A phone box in the middle.',
        art: 'Ochre sand, dusty wind, red receivers.',
        rules: ['The telephones ring in a fixed order: picking them up in that order gives the Telephone.', 'With the Telephone, the central phone box dictates a door number (47).'],
        secrets: ['A mirage of a building that moves away.'],
        role: 'Gives the Telephone (E11) and the number of the keyring door (W010). Leads to Village of the Unknown Tongue (W012).',
        lore: 'The calls you make so that you no longer hear the silence.'
      }
    });
  })();

  /* ======================= W012 — VILLAGE À LA LANGUE INCONNUE ======================= */
  (function () {
    var g = K.grid(56, 40, '.');
    g.border('#');
    g.ellipse(28, 20, 10, 7, ','); g.set(28, 20, 'O');
    [[12, 8], [22, 6], [36, 6], [46, 9], [10, 30], [20, 33], [38, 33], [47, 29]].forEach(function (p, i) { g.set(p[0], p[1], 'ABCDEFHI'[i]); });
    for (var i = 0; i < 18; i++) { var r = YN.rng.make(i + 120); var x = r.int(2, 53), y = r.int(2, 37); if (g.at(x, y) === '.') g.set(x, y, r.chance(0.5) ? '^' : '{'); }
    g.set(0, 20, 'N'); g.set(28, 12, 'W'); g.set(40, 20, 'L'); g.set(16, 20, 'S'); g.set(52, 36, '1'); g.set(28, 38, 'K');
    var house = function (id, ln) { return { id: id, type: 'decor', look: 'hanok', lookOpt: { c: ['#d8c8a8', '#4a3a2a'] }, lines: ln }; };
    YN.defWorld({
      id: 'W012', name: 'Village of the Unknown Tongue', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'village', amb: { type: 'wind', vol: 0.03 },
      look: { floor: { p: 'grass', c: ['#7a9a4a', '#6a8a3a', '#8aaa5a', '#5a7a2a'] }, floor2: { p: 'dirt', c: ['#a08a5a', '#8a7448', '#b09a6a'] }, wall: { p: 'stone', c: ['#8a7a6a', '#6a5a4a', '#4a3a2a'] } },
      tall: { '^': { look: 'tree', opt: { c: ['#6a9a3a', '#4a7a2a', '#5a3e26', '#8aba5a'] } }, '{': { look: 'onggi' } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'path', to: 'W011', arrive: 'village', essential: true },
        O: { id: 'bell', type: 'anchor', look: 'bigbell', lines: [{ t: 'The village bell. A rope, but no clapper. On the wood: {{the bell remembers}}' }] },
        A: house('h1', ['A low house. On the door, a painted word, half rubbed away.']), B: house('h2', ['The shutters have painted eyes. They are watching the bell.']),
        C: house('h3', ['Someone is weaving behind the wall.']), D: house('h4', ['An empty house. The words have been scraped off every beam.']),
        E: house('h5', ['A jar by the door, full of rainwater and drowned letters.']), F: house('h6', ['On the doorstep, a child draws signs in chalk that nobody reads.']),
        H: house('h7', ['A door that only opens for someone who knows how to say hello.']), I: house('h8', ['The Elder’s house. Woollen threads everywhere, knotted into words.']),
        W: { id: 'well', type: 'decor', look: 'well', lines: ['The village well. When you speak into it, it answers in Vallonian.'], listen: [{ any: true, lines: ['The well answers:', { t: 'Ouna-sé, ouna-sé…', lang: 'val' }] }] },
        L: { id: 'loom', type: 'decor', look: 'loom', lines: ['A loom. In the weft, woven words: “hello”, “house”, “us”. The threads in the middle have been cut.'] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'we spoke here before', lines: ['The soul follows the signs with a finger, slowly, the way you read to a child.', { t: 'Nobody reads these any more. I just like their shape.', lang: 'en' }] },
        K: { id: 'south', type: 'path', to: 'W019', arrive: 'east', essential: true },
        '1': cookieMark('villageCookie')
      },
      npcs: [{ id: 'N005', at: [44, 12] }, { id: 'N057', at: [24, 20] }, { id: 'N058', at: [32, 18] }, { id: 'N059', at: [14, 26] }, { id: 'N060', at: [40, 28] }],
      place: [
        { id: 's_w012_korean', type: 'soul', at: 'random-any', lines: [{ t: '한국말 잊어버리면 안 돼. 할머니한테는 한국말로 해.', lang: 'ko-s', tr: 'You mustn’t forget your Korean. With Grandma, you speak Korean.' }, { t: '…그런데 대답은 늘 프랑스 말로 했지.', lang: 'ko-s', tr: '…But the answer always came back in French.' }] },
        { id: 's_w012_dry', type: 'soul', at: 'random-any', lines: [{ t: 'A word dies the way a well dries. Slowly, and then one summer.', lang: 'en' }] },
        { id: 's_w012_wool', type: 'soul', at: 'random-any', lines: [{ t: 'The old one ties the words in wool so the wind can’t take them.', lang: 'en' }, { t: 'The wind takes the wool.', lang: 'en' }] },
        { id: 's_w012_home', type: 'soul', at: 'random-any', lines: ['A stooped soul, a headscarf knotted under the chin.', { t: '고향 말은 다 잊어버렸다. 이제는 꿈에서만 그 말을 해.', lang: 'ko-s', tr: 'I have forgotten all the words of home. Now I only speak them in dreams.' }] },
        { id: 's_w012_greet', type: 'soul', at: 'random-any', lines: [{ t: 'Greet them the way they greet each other. Listen at the well first.', lang: 'en' }] }
      ],
      info: {
        summary: 'A village of low houses around a bell with no clapper. They speak a language nobody else speaks, and its words are disappearing.',
        art: 'Soft pixel art, tiled roofs, jars, yellow grass; signs painted on the doors.',
        rules: ['The villagers greet one another with “ouna-sé”. Saying it to the Elder gives the Bell.', 'The village words are marks: some disappear from one dream to the next (Q04).'],
        secrets: ['The well repeats what you say to it in Vallonian.'],
        role: 'Gives the Bell (E25). Heart of the quest of the nameless people (Q04). Leads to The Firefly Marsh (W019).',
        lore: 'A language you lose when nobody speaks it at home any more.'
      }
    });
  })();

  /* ======================= W013 — LA FORÊT MUSICALE ======================= */
  (function () {
    var g = K.grid(54, 42, '.');
    g.border('#');
    var r = YN.rng.make(13);
    for (var i = 0; i < 130; i++) { var x = r.int(2, 51), y = r.int(2, 39); if (Math.abs(x - 27) + Math.abs(y - 21) > 7 && g.at(x, y) === '.') g.set(x, y, '^'); }
    g.ellipse(27, 21, 7, 6, ','); g.vline(27, 27, 41, ','); g.hline(1, 27, 30, ',');
    g.set(27, 41, 'N'); g.set(27, 20, 'C'); g.set(22, 17, 'A'); g.set(33, 18, 'B'); g.set(27, 26, 'D'); g.set(0, 30, 'W'); g.set(48, 5, '1'); g.set(6, 6, 'M'); g.set(45, 33, 'S');
    YN.defWorld({
      id: 'W013', name: 'The Musical Forest', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'forest', amb: { type: 'birds', vol: 0.05 },
      look: K.LOOK.forest, tall: K.TALL.forest,
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', to: 'W001', arrive: 'gate', look: 'gate', lookOpt: { open: true }, essential: true },
        C: { id: 'chief', type: 'anchor', look: 'tree', lookOpt: { big: true, c: ['#3a7a3a', '#2a5a2a', '#5a3e26', '#6aaa5a'], face: true }, lines: ['The chief tree. Its trunk is shaped like a listening face. It has no note of its own.', 'It waits for someone to play its three neighbours, from smallest to biggest? No. In the order they stand around it.'], cycle: true },
        A: { id: 'treeA', type: 'decor', look: 'tree', lookOpt: { small: true, c: ['#5a9a4a', '#3a7a3a', '#5a3e26', '#8aca6a'] }, use: [{ sfx: { id: 'chime', note: 9 } }], lines: ['A little tree. When the wind passes, it sings high: la.'] },
        B: { id: 'treeB', type: 'decor', look: 'tree', lookOpt: { big: true, c: ['#2a6a2a', '#1a4a1a', '#4a2e16', '#4a8a3a'] }, use: [{ sfx: { id: 'chime', note: 0 } }], lines: ['A big tree. Its voice is low: do.'] },
        D: { id: 'treeD', type: 'decor', look: 'tree', lookOpt: { c: ['#3a7a3a', '#2a5a2a', '#5a3e26', '#6aaa5a'] }, use: [{ sfx: { id: 'chime', note: 4 } }], lines: ['A middle-sized tree. It sings: mi.'] },
        W: { id: 'west', type: 'path', to: 'W019', arrive: 'north', essential: true },
        M: { id: 'mushrooms', type: 'decor', look: 'mushroom', lines: ['Mushrooms in a ring. Step inside the ring and you can no longer hear the forest.'] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'the trees sing for the one who listens', lines: ['The soul hums three notes, then falls silent to listen.', { t: 'The little one, the big one, the middle one. Left, right, below.', lang: 'en' }, { t: 'Don’t sing what you think. Sing where they stand.', lang: 'en' }] },
        '1': cookieMark('forestCookie')
      },
      npcs: [{ id: 'N061', at: [20, 24] }, { id: 'N062', at: [36, 26] }, { id: 'N063', at: [10, 12] }],
      place: [
        { id: 's_w013_dms', type: 'soul', at: 'random-any', lines: [{ t: '도, 미, 솔. 할머니 따라 해 봐.', lang: 'ko-s', tr: 'Do, mi, sol. Say it after Grandma.' }, { t: '학교 가는 길엔 노래를 불러야 안 무섭지.', lang: 'ko-s', tr: 'On the way to school you have to sing, then you won’t be scared.' }] },
        { id: 's_w013_rings', type: 'soul', at: 'random-any', lines: [{ t: 'Every tree here was planted by someone humming. You can tell from the rings.', lang: 'en' }] },
        { id: 's_w013_name', type: 'soul', at: 'random-any', lines: [{ t: 'Inside the mushroom ring it’s so quiet you can hear your own name.', lang: 'en' }, { t: 'Nobody has said it out loud in a long time.', lang: 'en' }] },
        { id: 's_w013_blackbird', type: 'soul', at: 'random-any', lines: [{ t: 'The blackbird only answers whistling. Words make him fly off.', lang: 'en' }] }
      ],
      mech: [{ type: 'melodyLock', mark: 'chief', tune: '402', dist: 4, give: 'E28', winLines: ['La, do, mi. The chief tree shivers in every leaf. A red ribbon slips from a branch and ties itself in your hair.'] }],
      info: {
        summary: 'A dense forest around a clearing where the chief tree listens to its three neighbours sing.',
        art: 'Deep forest, bright clearing, pollen.',
        rules: ['Each of the chief tree’s neighbours has its own note (small = la, big = do, middle = mi).', 'With the Melody, under the chief tree, play the neighbours’ notes in the order they stand (left, right, below): la, do, mi.'],
        secrets: ['The mushroom ring cuts out all sound.'],
        role: 'Gives the Ribbon (E28). Links The Garden (W001) to The Firefly Marsh (W019).',
        lore: 'The nursery rhymes sung on the walk to school, each at its own pitch.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
