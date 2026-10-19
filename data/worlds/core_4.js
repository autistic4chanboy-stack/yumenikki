/* =========================================================================
 *  MONDES DU CŒUR (4/6) — W021 Les Racines · W022 Wagon infini ·
 *  W023 Maison de poupée · W024 Ciel de linge · W025 Lac gelé ·
 *  W026 Les Toits · W027 Hôpital de veille
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;
  function cookieMark(key) { var t = {}; t[key] = true; var c = {}; c[key] = true; return { id: 'cookie_' + key, type: 'cookie', look: 'cookie', cond: { not: { temp: c } }, use: [{ temp: t }] }; }

  /* ======================= W021 — LES RACINES ======================= */
  (function () {
    var g = K.grid(50, 40, '#');
    var r = YN.rng.make(21);
    // galeries creusées
    var pts = [[25, 4], [10, 10], [38, 9], [6, 24], [24, 20], [42, 26], [14, 34], [34, 35], [25, 30]];
    pts.forEach(function (p, i) { g.ellipse(p[0], p[1], r.int(3, 5), r.int(2, 4), '.'); if (i) { var q = pts[i - 1]; g.path(q[0], q[1], p[0], p[1], '.', 2); } });
    g.path(10, 10, 6, 24, '.', 2); g.path(38, 9, 42, 26, '.', 2);
    for (var k = 0; k < 60; k++) { var x = r.int(1, 48), y = r.int(1, 38); if (g.at(x, y) === '.' && r.chance(0.3)) g.set(x, y, ','); }
    for (var k2 = 0; k2 < 26; k2++) { var x2 = r.int(1, 48), y2 = r.int(1, 38); if (g.at(x2, y2) === '.') g.set(x2, y2, 'v'); }
    g.ellipse(34, 35, 3, 2, '~');
    g.set(25, 3, 'U'); g.set(24, 20, 'M'); g.set(5, 24, 'A'); g.set(43, 26, 'B'); g.set(14, 35, 'C'); g.set(25, 31, 'D'); g.set(10, 9, 'S'); g.set(40, 8, '1');
    YN.defWorld({
      id: 'W021', name: 'The Roots', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', renderer: 'crayon', wallH: 0.9 }, music: 'roots', amb: { type: 'drip', vol: 0.07 }, dark: 0.9, playerLight: 1.3,
      look: Object.assign({}, K.LOOK.cave, { floor2: { p: 'soil', c: ['#4a3420', '#3a2818', '#5a4028'] }, vine: { p: 'flat', c: ['#4a3420', '#5a6a2a'] }, wall: { p: 'rock', c: ['#3a2c20', '#2a2018', '#4a3a2a'] } }),
      map: g.rows(),
      marks: {
        U: { id: 'cave', type: 'stairs', floor: '.', to: 'W001', arrive: 'cave', look: 'stairs', solid: true, essential: true, label: 'climb back up to the waterfall' },
        M: { type: 'spawn' },
        A: { id: 'spark1', type: 'item', look: 'spark', item: { spark: 1 }, light: 1.6, once: false, solid: false },
        B: { id: 'spark2', type: 'item', look: 'spark', item: { spark: 1 }, light: 1.6, solid: false },
        C: { id: 'spark3', type: 'item', look: 'spark', item: { spark: 1 }, light: 1.6, solid: false },
        D: { id: 'deep', type: 'fall', to: 'W100', look: 'hole', label: 'a hole beneath the roots', cond: { effect: 'E05' } },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'the light comes back to the one who gives it back', lines: ['The soul comes out from between the roots. It repeats the signs twice, like a lesson learnt by heart.', { t: 'Down here, nothing is lost. It is only kept.', lang: 'en' }] },
        '1': cookieMark('rootsCookie')
      },
      npcs: [{ id: 'N014', at: [26, 21] }, { id: 'N090', at: [12, 33] }, { id: 'N091', at: [40, 12] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: '씨앗은 어두워야 싹이 나. 무서워하지 마.', lang: 'ko-s', tr: 'A seed needs the dark to sprout. Don’t be afraid.' }, 'The soul has soil under its nails and smells like an apron.'] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'She buried a plum stone for every year she didn’t see him. The roots are very long now.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Three sparks fell. One rolled west. One rolled east. One fell all the way down, to the bottom of the burrows.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'Something is buried under the biggest root. A child’s shoe. The left one.', lang: 'en' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: 'The things you don’t say go down. They don’t rot. They wait.', lang: 'en' }] }
      ],
      info: {
        summary: 'Tunnels under the Garden, among the roots. Almost pitch black; three sparks glow somewhere.',
        art: 'Wax crayon on a dark background, roots, drips.',
        rules: ['Very dark.', 'Bringing three sparks back to Wick gives the Lantern (E05).', 'With the Lantern, a hole leads further down (W100).'],
        role: 'Gives the Lantern. Secret access to W100.',
        lore: 'Under the garden, what her grandmother buried: fruit stones, seeds, things left unsaid.'
      }
    });
  })();

  /* ======================= W022 — LE WAGON INFINI ======================= */
  (function () {
    var g = K.grid(40, 9, '.');
    g.hline(0, 39, 0, '#'); g.hline(0, 39, 8, '#');
    for (var x = 2; x < 38; x += 4) { g.set(x, 2, '{'); g.set(x, 6, '{'); }
    g.vline(0, 1, 7, '.'); g.set(20, 0, 'W'); g.set(10, 0, 'X'); g.set(30, 0, 'Y'); g.set(19, 4, 'S'); g.set(35, 4, 'L'); g.set(5, 8, 'D'); g.set(3, 4, 'P');
    YN.defWorld({
      id: 'W022', name: 'The Endless Carriage', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2', wrap: true, loop: true,
      style: { view: 'top', tallWalls: true }, music: 'train', amb: { type: 'train', vol: 0.1 },
      look: { floor: { p: 'carpet', c: ['#5a3a3a', '#4a2a2a'] }, wall: { p: 'flat', c: ['#2a2020', '#1a1414'], topColor: '#241a1a' }, wallface: { p: 'panel', c: ['#8a6a4a', '#6a4a2a', '#4a3020'], skirt: '#3a2010' } },
      tall: { '{': { look: 'trainseat' } },
      map: g.rows(),
      marks: {
        W: { id: 'win', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: [{ t: function () { return 'Through the window, the night rushes past. A plate: CARRIAGE ' + (1 - (YN.save.temp('wagon') || 0)) + '.'; } }] },
        X: { id: 'win2', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['In the glass, your reflection sits in an empty seat.'] },
        Y: { id: 'win3', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['Lights go by. Always the same ones, in the same order.'] },
        S: { id: 'plate', type: 'sign', look: 'sign', lines: ['The soul wears a ticket inspector’s cap, too big for it.', { who: 'a soul', t: function () { var n = 1 - (YN.save.temp('wagon') || 0); return n === 7 ? { t: 'Car seven. The lady travels alone.', lang: 'en' } : n < 1 ? { t: 'Car ' + n + '. This car does not exist.', lang: 'en' } : { t: 'Car ' + n + '.', lang: 'en' }; } }, { t: 'Tickets, please. …No. Nobody checks anymore.', lang: 'en' }] },
        L: { id: 'exit', type: 'train', floor: '.', to: 'W002', arrive: 'trainA', look: 'door', lookOpt: { style: 'metal', c: ['#6a7a8a'] }, label: 'get off', essential: true, cond: { fn: function () { return (YN.save.temp('wagon') || 0) === 0; } } },
        D: { id: 'depot', type: 'door', floor: '#', to: 'W080', look: 'door', lookOpt: { style: 'metal', c: ['#3a3a3a'], symbol: '0' }, cond: { fn: function () { return (YN.save.temp('wagon') || 0) >= 12; } }, label: 'door to carriage zero' },
        P: { type: 'spawn' }
      },
      npcs: [{ id: 'N092', at: [26, 4] }, { id: 'N093', at: [12, 4] }, { id: 'N094', at: [30, 3] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'I counted the lights to stay awake. Mom said I could sleep. I didn’t want to miss the stop.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: ['The soul is very old and very polite. It holds something small against its chest.', { t: '렬차가 떠납니다. 손을 놓지 마십시오.', lang: 'ko-n', tr: 'The train is departing. Do not let go of the hand.' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'The 23:71 doesn’t run on this line. This line doesn’t run at all. And yet here we are.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'Walk toward what you’re leaving behind. It’s the only direction that counts in here.', lang: 'en' }] }
      ],
      mech: [{ type: 'loopCount', key: 'wagon', onLoop: function (rt, n, d) { YN.audio.sfx('door', { vol: 0.4 }); YN.world.reeval(rt); if (YN.entities.reeval) YN.entities.reeval(rt); YN.game.toast('Carriage ' + (1 - n)); } }],
      info: {
        summary: 'The inside of a night carriage that never ends: walk out of one end and you enter the next carriage, which is the same one.',
        art: 'Wood panelling, red velvet seats, black windows.',
        rules: ['The carriage loops: going left, you head towards the back (rising numbers); going right, you move forward into carriages that don’t exist.', 'In the seventh carriage (towards the back), a lady travelling alone gives the Hourglass (E23).', 'You can only get off at carriage 1.'],
        secrets: ['Twelve carriages forward: a door marked “0” leads to the Ghost Train Depot (W080).'],
        role: 'Gives the Hourglass.',
        lore: 'Night journeys to the hospital, asleep against the window, counting the lights.'
      }
    });
  })();

  /* ======================= W023 — LA MAISON DE POUPÉE ======================= */
  (function () {
    var g = K.grid(30, 26, ' ');
    g.box(0, 0, 30, 26, '#', '.');
    g.hline(0, 29, 12, '#'); g.set(4, 12, 's'); g.set(5, 12, 's');
    g.vline(15, 0, 12, '#'); g.set(15, 6, '.'); g.vline(15, 12, 25, '#'); g.set(15, 19, '.');
    g.rect(1, 1, 14, 11, ','); g.rect(16, 13, 13, 12, ':');
    g.set(15, 25, 'N'); g.set(8, 3, 'B'); g.set(24, 3, 'C'); g.set(22, 18, 'D'); g.set(6, 18, 'K'); g.set(26, 10, 'W'); g.set(2, 23, '1'); g.set(10, 7, 'M');
    YN.defWorld({
      id: 'W023', name: 'The Doll’s House', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true }, music: 'dollhouse', amb: { type: 'music_box', vol: 0.03 },
      look: { floor: { p: 'wood', c: ['#c89a6a', '#a07a4a', '#d8aa7a'] }, floor2: { p: 'rug', c: ['#d8a0b0', '#e8b8c8'] }, floor3: { p: 'checker', c: ['#f0e8e0', '#c8a8b0'] }, wall: { p: 'flat', c: ['#4a2a3a', '#3a1a2a'], topColor: '#4a2a3a' }, wallface: { p: 'wallpaper', c: ['#f0c8d8', '#d8a0b8', '#a87088'], skirt: '#f8f0f0' }, stairs: { p: 'hstripes', c: ['#a07a4a', '#7a5a34'] } },
      map: g.rows(),
      marks: {
        N: { id: 'out', type: 'door', floor: '#', to: 'W009', arrive: 'dollhouse', look: 'door', lookOpt: { style: 'red', c: ['#d06080'] }, essential: true, exitDir: 'up' },
        B: { id: 'dollbed', type: 'decor', look: 'bed', lookOpt: { c: ['#f8e8f0', '#e080a0'] }, lines: [{ if: { item: { doll: 1 }, noEffect: 'E13' }, t: 'You put the little doll to bed and pull up the blanket. She closes her eyes. The whole house sighs. You shrink.', do: [{ item: { doll: -1 } }, { give: 'E13' }] }, { t: 'A small empty bed, upstairs. There is a hollow in the pillow.' }] },
        C: { id: 'parents', type: 'decor', look: 'bed', lookOpt: { c: ['#e8e0e0', '#8090a8'] }, lines: ['The doll parents’ bed. Only one side has been slept in.'] },
        D: { id: 'doll', type: 'item', look: 'doll', item: { doll: 1 }, once: true, solid: false, lines: ['A little girl doll, on the floor, by the front door. She is cold.'] },
        K: { id: 'kitchen', type: 'decor', look: 'stove', lines: ['The doll’s house cooker. A wooden saucepan, empty.'] },
        W: { id: 'window', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['Through the doll’s house window, a giant bedroom. A giant bed. Someone is asleep in it.'] },
        M: { id: 'mirror', type: 'decor', look: 'mirror', lines: ['A doll’s mirror. In it, you are made of wood, with painted eyes.'] },
        '1': cookieMark('dollCookie')
      },
      npcs: [{ id: 'N095', at: [20, 20] }, { id: 'N096', at: [8, 16] }, { id: 'N097', at: [22, 6] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: ['The soul puts on a coat it doesn’t have, in front of a door that doesn’t exist.', { t: '엄마 출근한다. 문 잠그고 자.', lang: 'ko-s', tr: 'Mum’s off to work. Lock the door and go to sleep.' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'We played family with what we had. The father doll always stood by the door. Coming or going — we never decided.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: '할머니가 이불 덮어 줄게. 우리 강아지.', lang: 'ko-s', tr: 'Grandma will tuck you in. My little puppy.' }, 'The soul smooths an invisible blanket, twice, the way you would stroke a cheek.'] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'The little doll was left by the front door, as if she were waiting for someone to come home. Put her to bed. Somebody should.', lang: 'en' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: 'Only one side of the big bed is ever warm. The other side is folded, like a letter nobody sent.', lang: 'en' }] },
        { id: 'soul6', type: 'soul', at: 'random-any', lines: [{ t: '괜찮아. 엄마 괜찮아. 진짜야.', lang: 'ko-s', tr: 'It’s okay. Mum’s okay. Really.' }, 'The soul repeats the words, smiling too much, with a painted smile.'] }
      ],
      info: {
        summary: 'The inside of the doll’s house: a ground floor (kitchen, living room), an upper floor (two bedrooms), a staircase.',
        art: 'Pink wallpaper, pale wood, toy furniture.',
        rules: ['Picking up the girl doll downstairs and putting her to bed upstairs gives Tiny (E13).'],
        role: 'Gives Tiny.',
        lore: 'You play families with what you have: two dolls, a bed, an absence.'
      }
    });
  })();

  /* ======================= W024 — LE CIEL DE LINGE (vue de côté) ======================= */
  (function () {
    var W = 40, H = 32, g = K.grid(W, H, ' ');
    g.rect(0, 29, W, 3, '#'); g.vline(1, 0, 31, '#'); g.vline(38, 0, 31, '#');
    [[4, 11, 26], [12, 18, 23], [6, 11, 20], [14, 20, 17], [22, 28, 14], [30, 36, 11], [22, 27, 8], [13, 19, 5], [17, 24, 2]].forEach(function (p) { g.hline(p[0], p[1], p[2], '-'); });
    g.vline(33, 12, 28, 's'); g.vline(3, 21, 28, 's');
    g.set(3, 28, 'B'); g.set(20, 1, 'N'); g.set(26, 13, 'L'); g.set(8, 19, 'C'); g.set(15, 4, '1'); g.set(35, 10, 'S');
    YN.defWorld({
      id: 'W024', name: 'The Laundry Sky', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2', outdoor: true,
      style: { view: 'side', sky: ['#90c0e8', '#e8f4ff'], parallax: [{ c: '#f4f8ff', f: 0.15, y: 0.55, amp: 2.2, freq: 0.3 }, { c: '#dce8f6', f: 0.3, y: 0.8, amp: 1.6 }] },
      music: 'sky', amb: { type: 'wind', vol: 0.07 }, gravity: 1,
      look: { wall: { p: 'flat', c: ['#8a7a6a', '#6a5a4a'] }, floor: { p: 'blank', c: ['#000'] }, platform: { p: 'plank', c: ['#e8e8e8', '#c8c8c8', '#ffffff'] } },
      map: g.rows(),
      marks: {
        B: { id: 'down', type: 'door', to: 'W008', arrive: 'line', look: 'door', lookOpt: { style: 'wood', c: ['#c8a070'] }, essential: true, label: 'go back down' },
        N: { id: 'nest', type: 'effect', give: 'E22', look: 'nest', getLines: ['In the nest, at the very top of the lines, a white feather, lighter than air.'] },
        L: { id: 'shirt', type: 'decor', look: 'clothesline', lines: ['A man’s shirt has been drying on the line for a very long time. It has kept the shape of his shoulders.'] },
        C: { id: 'clip', type: 'item', look: 'clothespin', item: { clothespin: 1 }, once: true, solid: false, lines: ['A wooden clothes peg.'] },
        S: { id: 'sock', type: 'decor', look: 'sock', lines: ['A child’s sock, on its own. The other one never came back.'] },
        '1': cookieMark('skyCookie')
      },
      npcs: [{ id: 'N098', at: [25, 7] }],
      place: [
        { id: 'soul1', type: 'soul', at: [12, 28], lines: [{ t: 'On Sundays we hung out the washing and waited. Waiting was the whole day.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: [9, 25], lines: [{ t: 'That shirt has been drying since 2020. It will never be dry enough to fold.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: [17, 16], lines: ['The soul holds a clothes peg between its teeth and talks anyway.', { t: '빨래는 해가 말려 주는 거야. 기다리면 돼.', lang: 'ko-s', tr: 'It’s the sun that dries the washing. You only have to wait.' }] },
        { id: 'soul4', type: 'soul', at: [33, 10], lines: [{ t: 'The bird guards a nest that isn’t his. Up there, at the very top. He’d give what’s in it to someone light enough.', lang: 'en' }] }
      ],
      info: {
        summary: 'A sky seen from the side, crossed by washing lines at every height; you climb it by jumping from line to line.',
        art: 'Side view, pale sky, parallax clouds, white laundry.',
        rules: ['Side view: jump (Space or Up), ladders (Up/Down).', 'The nest at the top gives the Feather (E22).', 'Falling takes you back to the last foothold (−10 s).'],
        role: 'Gives the Feather.',
        lore: 'Washing hung out, waiting for it to dry, on Sundays when nothing happens.'
      }
    });
  })();

  /* ======================= W025 — LE LAC GELÉ ======================= */
  (function () {
    var g = K.grid(54, 40, '.');
    g.border('#');
    g.ellipse(27, 20, 17, 11, '~'); g.ellipse(27, 20, 3, 2, ','); g.set(27, 20, 'H');
    var r = YN.rng.make(25);
    for (var i = 0; i < 46; i++) { var x = r.int(1, 52), y = r.int(1, 38); if (g.at(x, y) === '.') g.set(x, y, '^'); }
    g.vline(27, 32, 39, ','); g.hline(0, 9, 20, ',');
    g.set(27, 39, 'N'); g.set(0, 20, 'W'); g.set(46, 33, 'P'); g.set(8, 33, 'M'); g.set(44, 8, '1'); g.set(10, 6, 'S');
    YN.defWorld({
      id: 'W025', name: 'The Frozen Lake', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'lake', amb: { type: 'wind', vol: 0.06 },
      look: { floor: { p: 'grass', c: ['#6a8a7a', '#5a7a6a', '#7a9a8a', '#4a6a5a'] }, floor2: { p: 'dirt', c: ['#7a6a5a', '#6a5a4a', '#8a7a6a'] }, water: { p: 'water', c: ['#3a6a98', '#2a5a88', '#4a7aa8', '#c8e0f0'] }, wall: { p: 'hedge', c: ['#2a4a3a', '#1a3a2a', '#3a5a4a', '#0a2a1a'] } },
      tall: K.TALL.pine,
      map: g.rows(),
      marks: {
        N: { id: 'north', type: 'path', to: 'W006', arrive: 'north', essential: true },
        W: { id: 'west', type: 'path', to: 'W019', arrive: 'south', essential: true },
        H: { id: 'icehole', type: 'fall', to: 'W101', look: 'hole', cond: { snow: true }, unreachOk: 'on the ice', label: 'a hole in the ice' },
        P: { id: 'puddle', type: 'decor', look: 'puddle', lines: [{ if: { snow: false, notFlag: 'got:carrot' }, t: 'A puddle of clear water. A carrot at the bottom. You fish it out, your fingers frozen.', do: [{ set: { 'got:carrot': true } }, { item: { carrot: 1 } }] }, { if: { snow: true }, t: 'The puddle has frozen. Inside, bubbles caught in the ice.' }, { t: 'A puddle. The sky’s reflection trembles in it.' }] },
        M: { id: 'sign', type: 'sign', look: 'sign', lines: ['A child’s soul in a woolly hat blows on its fingers. It points at the sky, where an open window would be.', { t: 'Thin ice.', lang: 'en' }, { t: 'There’s only ice when the window is open.', lang: 'en' }] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'the cold comes in through the window', lines: ['The soul has frost on its eyelashes.', { t: 'Nobody fixed the latch. We just kept our coats on, inside.', lang: 'en' }] },
        '1': cookieMark('lakeCookie')
      },
      variants: { snow: { place: [{ id: 'snowman', type: 'decor', at: [36, 34], look: 'snowman', lookIf: [{ cond: { effect: 'E15' }, lookOpt: { nose: true } }], lines: [{ if: { item: { carrot: 1 }, noEffect: 'E15' }, t: 'You push the carrot into the middle of the snowman’s face. He smiles — really smiles. He unwinds his red scarf and wraps it around your neck.', do: [{ item: { carrot: -1 } }, { give: 'E15' }] }, { if: { noEffect: 'E15' }, t: 'A snowman with no nose. He seems to be looking for something on the ground.' }, { t: 'The snowman smiles with his carrot.' }] }] } },
      npcs: [{ id: 'N099', at: [14, 30] }, { id: 'N100', at: [42, 14] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'The fisherman was here before the lake. He says the fish are memories that learned to swim.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: ['The soul has a rolled-up towel under its arm, the kind you wedge under a window.', { t: '괜찮아, 내일 고칠게.', lang: 'ko-s', tr: 'It’s fine, I’ll fix it tomorrow.' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Snowmen wait better than people do. All they need is a nose, and someone who comes back.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'The ice remembers every footstep. In spring it lets them all go at once.', lang: 'en' }] }
      ],
      info: {
        summary: 'A lake among fir trees, a small island in the middle. With the window open, it freezes and a snowman appears on the shore.',
        art: 'Cold blues, fir trees, ice and snow when the window is open.',
        rules: ['Window open: the lake freezes (you slide on it), it snows, a snowman with no nose waits.', 'Window closed: the puddle isn’t frozen and gives a carrot.', 'Giving the carrot back to the snowman gives the Scarf (E15) — two different nights.'],
        secrets: ['With the window open, a hole in the ice by the island leads very far down (W101).'],
        role: 'Gives the Scarf.',
        lore: 'The winter the window would no longer close.'
      }
    });
  })();

  /* ======================= W026 — LES TOITS ======================= */
  (function () {
    var g = K.grid(56, 34, ' ');
    // plusieurs toits plats séparés par le vide, reliés de planches
    [[2, 2, 16, 12], [22, 4, 14, 10], [40, 2, 14, 14], [6, 18, 18, 13], [30, 19, 22, 12]].forEach(function (b) { g.rect(b[0], b[1], b[2], b[3], '.'); });
    g.hline(18, 21, 8, '='); g.hline(36, 39, 9, '='); g.vline(12, 14, 17, '='); g.vline(44, 16, 18, '='); g.hline(24, 29, 24, '=');
    [[5, 5], [26, 7], [46, 6], [10, 22], [36, 22], [48, 27]].forEach(function (p) { g.set(p[0], p[1], '}'); });
    [[14, 4], [33, 12], [52, 12], [20, 28], [40, 29]].forEach(function (p) { g.set(p[0], p[1], '^'); });
    g.set(4, 12, 'N'); g.set(47, 11, 'T'); g.set(16, 25, 'W'); g.set(40, 24, 'K'); g.set(50, 20, 'A'); g.set(30, 5, '1'); g.set(8, 28, 'S');
    YN.defWorld({
      id: 'W026', name: 'The Rooftops', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top', stars: true, sky: ['#0a0c20', '#202a4a'], cliffH: 0.6, cliff: '#2a2a34' }, music: 'roofs', amb: { type: 'wind', vol: 0.09 }, weather: { wind: 0.4 }, dark: 0.55,
      look: { floor: { p: 'concrete', c: ['#5a5a62'] }, bridge: { p: 'plank', c: ['#7a6a5a', '#5a4a3a', '#8a7a6a'] } },
      tall: { '}': { look: 'vent' }, '^': { look: 'antenna' } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', to: 'W003', arrive: 'toRoofs', look: 'door', lookOpt: { style: 'metal', c: ['#5a5a5a'] }, essential: true },
        T: { id: 'tower', type: 'decor', look: 'watertower', lines: ['A water tower. When you knock on it, it answers with a note, then the water inside repeats it, lower.'], use: [{ sfx: { id: 'chime', note: -5 } }] },
        W: { id: 'window', type: 'decor', look: 'skylight', lines: [{ if: { roomLight: true }, t: 'A skylight. Below, a lit kitchen. A woman in a work smock is asleep, her head on the table. You can’t see her face.' }, { t: 'A skylight. Below, a dark kitchen. Two bowls on the table.' }] },
        K: { id: 'scope', type: 'decor', look: 'telescope', lines: ['A telescope. The stars form numbers: 2, 3, 7, 1. Then they slip back into place, as if nothing happened.'] },
        A: { id: 'roofworld', type: 'door', to: 'W052', look: 'hatch', cond: { effectsCount: 15 }, label: 'hatch leading higher', lockedText: 'A hatch leading up. Too heavy, for now.' },
        S: { id: 'graffiti', type: 'sign', look: 'sign', lines: ['A crouching soul, an empty spray can in its hand.', { t: 'At 3 a.m., even the wolves don’t sleep.', lang: 'en' }] },
        '1': cookieMark('roofCookie')
      },
      mech: [{ type: 'wind', push: true, strength: 0.6, dir: 'right' }],
      npcs: [{ id: 'N101', at: [28, 10] }, { id: 'N102', at: [10, 25] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'From up here you can count the lit windows. At three in the morning there are always a few. Someone is always awake.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: ['The soul has the shoulders of a woman coming home late at night. It talks to itself.', { t: '오늘도 수고했어, 나.', lang: 'ko-s', tr: 'Good work again today, me.' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Two bowls on the table. One goes cold first. It’s always the same one.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'The hatch opens for full pockets. Fifteen things, maybe more. The sky is heavy to lift.', lang: 'en' }] }
      ],
      info: {
        summary: 'The town’s rooftops at night, linked by planks over the void; antennas, air vents, a water tower, a skylight.',
        art: 'Grey concrete, starry sky, wind.',
        rules: ['Gusts push you to the right (the Scarf protects you).', 'With 15 effects, a hatch leads higher up (W052).'],
        time: ['Hint: “At 3 a.m., even the wolves don’t sleep” (the hour of the wolf).'],
        secrets: ['The skylight shows the kitchen lit up when the Bedroom light is on.'],
        role: 'A place for hints, with a view of the kitchen.',
        lore: 'From above, the kitchen window where the mother falls asleep when she gets home.'
      }
    });
  })();

  /* ======================= W027 — L'HÔPITAL DE VEILLE ======================= */
  (function () {
    var g = K.grid(60, 28, ' ');
    g.box(0, 0, 60, 28, '#', ',');
    for (var i = 0; i < 6; i++) { g.box(1 + i * 10, 1, 10, 9, '#', '.'); g.set(6 + i * 10, 9, '.'); g.box(1 + i * 10, 18, 10, 9, '#', '.'); g.set(6 + i * 10, 18, '.'); }
    g.rect(25, 11, 10, 6, ':');
    for (var j = 0; j < 6; j++) { g.set(3 + j * 10, 4, 'u'); g.set(3 + j * 10, 21, 'u'); }
    g.set(0, 14, 'N'); g.set(28, 13, 'R'); g.set(32, 13, 'L'); g.set(53, 22, 'B'); g.set(23, 4, 'E'); g.set(3, 12, 'S'); g.set(57, 14, 'V'); g.set(56, 2, '1'); g.set(8, 24, 'K');
    YN.defWorld({
      id: 'W027', name: 'The Vigil Hospital', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'hospital', amb: { type: 'beep', vol: 0.05 }, dark: 0.3,
      look: Object.assign({}, K.LOOK.hospital, { counter: { p: 'tile', c: ['#e8f0f0', '#b8c8c8'] } }),
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W005', arrive: 'toHospital', look: 'door', lookOpt: { style: 'glass', c: ['#f0f0f0'] }, essential: true, exitDir: 'right' },
        R: { id: 'radio', type: 'decor', look: 'radio', lines: [{ t: 'The nurses’ radio. It crackles between two stations.' }], use: [{ fn: function () { YN.ui.radio.open(); } }] },
        L: { id: 'log', type: 'sign', look: 'clipboard', lines: ['A soul in a smock reads the night log in a low voice.', { t: 'Two ten: bed twelve, restless. Three o’clock: bed three, empty. Normal.', lang: 'en' }, { t: 'Four twenty: nothing to report.', lang: 'en' }, { t: 'K. M., care assistant, end of shift seven a.m. …Someone crossed that out.', lang: 'en' }], cycle: true },
        B: { id: 'bed12', type: 'decor', look: 'bed', lookOpt: { c: ['#f0f0f0', '#a8c0c8'] }, lines: ['Bed 12. Nobody. On the bedpost, a plastic wristband: “96.6”.'] },
        E: { id: 'bed3', type: 'decor', look: 'bed', lookOpt: { c: ['#f0f0f0', '#c8b8d8'] }, lines: [{ if: { noEffect: 'E26', fn: function () { var n = YN.game.rt.findEnt('N103'); if (!n) return true; var p = YN.game.player, away = { up: p.y > n.y, down: p.y < n.y, left: p.x > n.x, right: p.x < n.x }[n.dir]; return away || Math.abs(n.x - p.x) + Math.abs(n.y - p.y) > 9; } }, t: 'The Night Watcher has her back turned. You take the blanket from the empty bed and hold it close.', do: [{ give: 'E26' }] }, { if: { noEffect: 'E26' }, t: 'Go back to bed, you.', lang: 'en', who: 'The Night Watcher' }, { t: 'Bed 3, empty. Normal.' }] },
        S: { id: 'lockers', type: 'decor', look: 'locker', lookOpt: { c: ['#a8c0c8'] }, lines: ['The staff lockers. On one, a label: KIM M. Inside, a badge and a cardigan that smells of the night.'], use: [{ if: { not: { flag: 'got:badge' } }, set: { 'got:badge': true }, item: { badge: 1 } }] },
        V: { id: 'elevator', type: 'elevator', floor: '#', to: 'W118', look: 'elevator', cond: { all: [{ phase: ['late', 'final'] }, { effectsCount: 10 }] }, label: 'restricted lift', lockedText: 'LIFT RESERVED FOR STAFF — after midnight.', exitDir: 'left' },
        K: { id: 'kids', type: 'sign', keepSign: true, look: 'poster', lookOpt: { c: ['#f0e8a0', '#60a0e0'] }, lines: ['A poster from the children’s ward, pinned up very straight. Two numbers, written large: 3114 and 119. Underneath, by hand: you can call at night too, awake. Someone is listening.'] },
        '1': cookieMark('hospitalCookie')
      },
      radio: { '96.6': { cond: { noEffect: 'E20' }, line: { t: '…12번 침대, 12번 침대, 괜찮아요, 다시 주무세요…', lang: 'ko-s', tr: '…bed twelve, bed twelve, it’s all right, go back to sleep…' }, do: [{ give: 'E20' }] } },
      npcs: [{ id: 'N103', at: [30, 14] }, { id: 'N104', at: [45, 6] }, { id: 'N105', at: [15, 23] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'Kim? She does nights. Always nights. She says it’s so she can be home in the morning.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: ['The soul looks at the corridor clock and, through it, at a bedroom very far from here.', { t: '우리 딸 자고 있겠지. 불 켜고 자면 안 되는데.', lang: 'ko-s', tr: 'My daughter must be asleep by now. She shouldn’t sleep with the light on.' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Sixth floor, at the end. They watch children sleep there. The files are numbered. Six is the last one.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'Bed three is always empty. We make it every night anyway. Just in case.', lang: 'en' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: ['The soul leans against the wall, eyes closed, a hand on the back of its neck.', { t: '아직 세 시… 네 시간 더.', lang: 'ko-s', tr: 'Only three o’clock… four more hours.' }] },
        { id: 'soul6', type: 'soul', at: 'random-any', lines: [{ t: 'Twelve talks to his radio because nobody visits. Ninety-six point six. He says that’s where his wife sings.', lang: 'en' }] }
      ],
      info: {
        summary: 'A hospital ward at night: twelve rooms in two rows, a nurses’ station in the middle, a restricted lift.',
        art: 'Pale aqua, tiles, wan neon lights, beeps.',
        rules: ['Tuning the nurses’ radio to the frequency on the bed 12 wristband (96.6) gives the Radio (E20).', 'Taking the blanket from bed 3 while the Night Watcher’s back is turned gives the Blanket (E26).', 'The restricted lift only works late in the dream, with 10 effects (W118).'],
        secrets: ['The locker marked “KIM M.”: a badge.'],
        role: 'Gives the Radio and the Blanket.',
        lore: 'Where the mother works at night. She is never there when you go.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
