/* =========================================================================
 *  MONDES DU CŒUR (3/6) — W014 Monde au fusain · W015 Salle d'arcade ·
 *  W016 Piscine vide · W017 Supermarché de nuit · W018 Bibliothèque des
 *  livres blancs · W019 Marais aux lucioles · W020 Fête foraine fermée
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;
  function cookieMark(key) { var t = {}; t[key] = true; var c = {}; c[key] = true; return { id: 'cookie_' + key, type: 'cookie', look: 'cookie', cond: { not: { temp: c } }, use: [{ temp: t }] }; }

  /* ======================= W014 — LE MONDE AU FUSAIN ======================= */
  (function () {
    // un dédale de papier : couloirs à la main, culs-de-sac nombreux, murs de papier effaçables
    var rows = [
      '##############################################',
      '#.....p.........#.........p..........#.......#',
      '#.###.p.#######.#.#######.p.########.#.#####.#',
      '#.#...p.#.....#...#.....#.p.#......#...#...#.#',
      '#.#.###.#.###.#####.###.#.###.####.#####.#.#.#',
      '#.#.#...#.#.#.......#.#.#.....#..#.......#.#.#',
      '#.#.#.###.#.#########.#.#######..#########.#.#',
      '#...#.....#...........#..................#...#',
      '#####.#############.####.##########.####.#####',
      '#.....#...........#....#.#........#.#..#.....#',
      '#.#####.#########.####.#.#.######.#.#..#####.#',
      '#.#.....#.......#....#.#.#.#....#.#.#........#',
      '#.#.#####.#####.####.#.#.#.#.##.#.#.##########',
      '#.#.......#...#......#...#...#..#.#..........#',
      '#.#########.#.########.#######.##.##########.#',
      '#...........#..........#.......#.............#',
      '######################N#######################'
    ];
    var g = K.grid(46, 17); g.text(0, 0, rows);
    g.set(30, 11, 'M'); g.set(2, 1, 'S'); g.set(44, 13, '1'); g.set(39, 1, 'D'); g.set(10, 5, 'G');
    YN.defWorld({
      id: 'W014', name: 'The Charcoal World', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', renderer: 'charcoal', tallWalls: false, wallH: 0.7 }, music: 'charcoal', amb: { type: 'paper', vol: 0.05 },
      look: { floor: { p: 'paper', c: ['#ece8e0'] }, wall: { p: 'flat', c: ['#2a2a2a', '#1a1a1a'] }, paper: { p: 'hatch', c: ['#d8d4cc', '#404040'] } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W004', arrive: 'board1', look: 'door', lookOpt: { style: 'shoji', c: ['#e8e8e8'] }, essential: true, exitDir: 'up' },
        S: { id: 'sign', type: 'sign', look: 'sign', lines: ['The soul is drawn in charcoal. One of its edges has already been rubbed out.', { t: 'Do not erase.', lang: 'en' }, { t: 'Please. Not this part.', lang: 'en' }] },
        D: { id: 'drawing', type: 'decor', look: 'frame', lines: ['A child’s drawing: a house, a woman, a little girl. A man has been rubbed out. Only his suitcase is left.'] },
        G: { id: 'gum', type: 'decor', look: 'crumbs', lines: ['Grey crumbs. Crumb has been this way.'] },
        M: { type: 'spawn' },
        '1': cookieMark('charcoalCookie')
      },
      npcs: [{ id: 'N064', at: 'M' }, { id: 'N065', at: [6, 13] }, { id: 'N066', at: [40, 5] }],
      mech: [{ type: 'corner', ent: 'N064', give: 'E10', winLines: ['Crumb has nowhere left to run. She huddles up, very small, and lets herself be caught: an eraser that smells of bread.'] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'I drew him every Sunday. Then I drew him a little less.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'An eraser never really erases. Hold the paper up to the light: he’s still there, in the dents.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: ['The soul’s fingers are black with charcoal.', { t: 'Crumb isn’t mean. She eats mistakes. She just can’t tell which ones.', lang: 'en' }, { t: 'When she’s scared, she runs into corners. Corners have no way out.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'Knock knock.', lang: 'en' }, { t: 'Who’s there?', lang: 'en' }, 'The rest has been rubbed out. Only the groove of the pencil is left, pressed down very hard.'] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: '아빠는 그리지 말자. 엄마가 속상해해.', lang: 'ko-s', tr: 'Let’s not draw Dad. It makes Mum sad.' }, 'The soul gently lays a hand on the sheet, as if to cover it.'] }
      ],
      info: {
        summary: 'A maze drawn in charcoal on paper: corridors, dead ends, a few walls of hatched paper.',
        art: 'Charcoal on paper, hatching, grain; monochrome rendering.',
        rules: ['Crumb (the breadcrumb that erases) runs away: cornering her in a dead end gives the Eraser.', 'Hatched (paper) walls can be rubbed out with the Eraser.'],
        secrets: ['A drawing with the father rubbed out.'],
        role: 'Gives the Eraser (E10). Reached through a blackboard in the Empty School (Chalk).',
        lore: 'What you erase from a drawing stays behind, pressed into the paper.'
      }
    });
  })();

  /* ======================= W015 — LA SALLE D'ARCADE ======================= */
  (function () {
    var g = K.grid(38, 24, ' ');
    g.box(0, 0, 38, 24, '#', '.');
    for (var y = 3; y < 18; y += 5) for (var x = 3; x < 35; x += 4) g.set(x, y, '}');
    g.rect(28, 18, 8, 5, ',');
    g.set(19, 23, 'N'); g.set(33, 2, 'B'); g.set(18, 20, 'R'); g.set(31, 20, 'C'); g.set(2, 21, 'T'); g.set(36, 12, 'Y'); g.set(6, 21, 'S'); g.set(35, 1, '1'); g.set(10, 20, 'W');
    YN.defWorld({
      id: 'W015', name: 'The Arcade', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'arcade', amb: { type: 'arcade', vol: 0.06 }, dark: 0.55,
      look: { floor: { p: 'carpet', c: ['#2a1040', '#401860'] }, floor2: { p: 'neon', c: ['#0a0a14', '#40c0ff'] }, wall: { p: 'flat', c: ['#10081a', '#0a0610'], topColor: '#120a1c' }, wallface: { p: 'panel', c: ['#2a1a3a', '#1a0a2a', '#4a2a6a'], skirt: '#ff40a0' } },
      tall: { '}': { look: 'arcade', opt: { c: ['#3030a0'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W003', arrive: 'toArcade', look: 'door', lookOpt: { style: 'glass', c: ['#c04090'] }, essential: true, exitDir: 'up' },
        B: { id: 'backcab', type: 'arcade', look: 'arcade', lookOpt: { c: ['#802020'], off: true }, animated: true, lines: [{ if: { equipped: 'E13', noEffect: 'E17' }, t: 'Tiny, you slip under the machine. In the dust, a golden token.', do: [{ give: 'E17' }] }, { t: 'The machine at the back is switched off. Beneath it, a slit of light, too low for you.' }] },
        R: { id: 'rhythm', type: 'arcade', look: 'arcade', lookOpt: { c: ['#20a060'] }, animated: true, lines: [{ t: 'DANCE! DANCE!', lang: 'en', who: 'the machine' }, 'The screen shows arrows. The pixelated dancer beside it repeats them. Your turn.'] },
        C: { id: 'claw', type: 'decor', look: 'clawmachine', lines: [{ if: { effect: 'E17', noEffect: 'E07' }, t: 'You slip the token in. The claw comes down, hesitates, and lifts out a pair of roller skates.', do: [{ give: 'E07' }] }, { t: 'A claw machine. At the bottom, red roller skates. It would take a token.' }] },
        Y: { id: 'secretcab', type: 'door', floor: '#', to: 'W169', look: 'arcade', lookOpt: { c: ['#101010'] }, cond: { flag: 'arcade_watermelon' }, label: 'the black machine', exitDir: 'left' },
        S: { id: 'scores', type: 'sign', look: 'board', lookOpt: { lines: ['1. S__  999', '2. ---  000', '3. ---  000'], color: '#40e0ff' }, lines: ['A small pixelated soul flickers in front of the scoreboard.', { t: 'High score: S. Nine hundred ninety-nine.', lang: 'en' }, { t: 'Everyone else: zero. Here, you come first.', lang: 'en' }] },
        T: { type: 'spawn' }, W: { id: 'change', type: 'decor', look: 'vending', lookOpt: { c: ['#c8a020'] }, lines: ['A change machine. It gives change for nothing.'] },
        '1': cookieMark('arcadeCookie')
      },
      npcs: [{ id: 'N067', at: [21, 20] }, { id: 'N068', at: [12, 9] }, { id: 'N069', at: [26, 14] }],
      mech: [{ type: 'dirSequence', ent: 'N067', seq: ['left', 'up', 'right', 'right', 'down'], give: 'E17', winLines: [{ t: 'PERFECT!', lang: 'en', who: 'the machine' }, 'The machine spits out a golden token.'] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'I came here after school so I wouldn’t go home. Home had the same noise.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'Insert coin. Insert coin. Insert coin.', lang: 'en' }, { t: 'Nobody ever told me to stop.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'The kid who laughs the loudest always plays alone. Watch his hands, not his mouth.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: ['The soul is the colour of a screen on standby.', { t: 'Three letters, but she only ever typed one. S, then two dashes. As if she had to leave.', lang: 'en' }] }
      ],
      info: {
        summary: 'A dark arcade, purple carpet, rows of machines; a claw machine, a black machine.',
        art: 'Neon, patterned carpet, animated machines.',
        rules: ['Copying the dancer’s steps at the rhythm machine (left, up, right, right, down) gives the Token.', 'With Tiny, the token can also be found under the machine at the back.', 'The Token in the claw machine gives the Skates (alternative).'],
        secrets: ['After the watermelon on the Bedroom’s arcade machine, the black machine leads further (W169).'],
        role: 'Gives the Token (E17); alternative route to the Skates (E07).',
        lore: 'The only place where her name (“S__”) comes first.'
      }
    });
  })();

  /* ======================= W016 — LA PISCINE VIDE ======================= */
  (function () {
    var g = K.grid(44, 28, ' ');
    g.box(0, 0, 44, 28, '#', ',');
    g.rect(6, 6, 32, 16, '.');        // le bassin vide (carrelage bleu)
    g.rect(28, 8, 8, 12, ':');         // le grand bain
    g.hline(6, 37, 5, ',');
    [[4, 4], [39, 4], [4, 23], [39, 23]].forEach(function (p) { g.set(p[0], p[1], '^'); });
    g.set(22, 27, 'N'); g.set(5, 14, 'L'); g.set(32, 14, 'E'); g.set(40, 14, 'B'); g.set(2, 26, '1'); g.set(21, 2, 'S'); g.set(12, 12, 'D');
    YN.defWorld({
      id: 'W016', name: 'The Empty Pool', depth: 2, tier: 'mid', core: true, status: 'implemented', region: 'P2',
      style: { view: 'top', tallWalls: true, renderer: 'watercolor' }, music: 'pool', amb: { type: 'drip', vol: 0.06 },
      look: { floor: { p: 'tile', c: ['#8ab8d0', '#5a88a8'] }, floor2: { p: 'tile', c: ['#e0ecec', '#b0c8c8'] }, floor3: { p: 'tile', c: ['#4a7898', '#30587a'] }, wall: { p: 'flat', c: ['#2a3a44', '#1a2a34'], topColor: '#22323c' }, wallface: { p: 'panel', c: ['#c8e0e8', '#a8c8d0', '#7aa0b0'], skirt: '#3a6a8a' } },
      tall: { '^': { look: 'pillar', opt: { c: ['#d8e8f0'] } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'stairs', floor: '#', to: 'W004', arrive: 'toPool', look: 'stairs', solid: true, essential: true },
        L: { id: 'ladder', type: 'decor', look: 'ladder', lines: ['The pool ladder. It goes down into tiled emptiness.'] },
        E: { id: 'deep', type: 'decor', look: 'drain', lines: ['The drain in the deep end. If you speak here, the pool answers.'] },
        B: { id: 'board', type: 'sign', look: 'sign', lines: ['The soul wears a whistle around its neck. It points at the deep end, then at its own mouth.', { t: 'One: no running. Two: no shouting.', lang: 'en' }, { t: 'Three: answer when the echo calls.', lang: 'en' }] },
        S: { id: 'clock', type: 'decor', floor: '#', look: 'wallclock', lookOpt: { hour: 6, min: 0 }, lines: ['The pool clock. Six o’clock. The time of the swimming lesson she never had.'] },
        D: { id: 'towel', type: 'decor', look: 'towel', lines: ['A child’s towel, dry. Embroidered in one corner: “S”.'] },
        '1': cookieMark('poolCookie')
      },
      npcs: [{ id: 'N070', at: [10, 24] }, { id: 'N071', at: [20, 10] }],
      mech: [{ type: 'echo', zone: [28, 8, 35, 19], words: ['bedtime', 'mum', 'come home', 'splash', 'stay', 'nobody', 'here'], give: 'E33', winLines: ['You repeat the word. This time the echo falls silent. Then it comes back, but in your own mouth.'] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'Saturday, nine o’clock. The other mothers sat on that bench, holding towels.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: '다음 주엔 꼭 데려갈게. 약속해.', lang: 'ko-s', tr: 'Next week I’ll take you, for sure. I promise.' }, 'The soul repeats the promise several times, quieter and quieter.'] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'The echo isn’t mean. It only gives back what you didn’t dare to say.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'They drained the pool in winter. The swimmers stayed anyway. They didn’t know where else to go.', lang: 'en' }] }
      ],
      info: {
        summary: 'An indoor pool with no water, blue tiles, a deep end where voices come back changed.',
        art: 'Blue watercolour, tiles, drips.',
        rules: ['Say a word in the deep end: the echo sends back a different word. Repeating that word gives the Echo (E33).'],
        role: 'Gives the Echo.',
        lore: 'The Saturday-morning swimming lesson nobody ever took her to.'
      }
    });
  })();

  /* ======================= W017 — LE SUPERMARCHÉ DE NUIT ======================= */
  (function () {
    var g = K.grid(46, 30, ' ');
    g.box(0, 0, 46, 30, '#', '.');
    for (var i = 0; i < 8; i++) g.vline(5 + i * 5, 4, 20, '|');
    g.rect(1, 23, 44, 6, ',');
    [8, 16, 24, 32].forEach(function (x) { g.set(x, 24, 'u'); g.set(x + 1, 24, 'u'); });
    g.set(23, 29, 'N'); g.set(37, 3, 'S'); g.set(17, 25, 'C'); g.set(38, 12, 'K'); g.set(2, 2, '1'); g.set(43, 26, 'F'); g.set(12, 3, 'P');
    YN.defWorld({
      id: 'W017', name: 'The Night Supermarket', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'market', amb: { type: 'hum', vol: 0.07 },
      look: { floor: { p: 'tile', c: ['#e0e0d8', '#b8b8b0'] }, floor2: { p: 'tile', c: ['#c8c8c0', '#a0a098'] }, wall: { p: 'flat', c: ['#2a3a2a', '#1a2a1a'], topColor: '#2a362a' }, wallface: { p: 'panel', c: ['#e0e8e0', '#c0c8c0', '#90a090'], skirt: '#40a060' }, thin: { p: 'stripes', c: ['#d8d0b8', '#a8a090'] }, counter: { p: 'metal', c: ['#a0a8a8'] } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W003', arrive: 'toMarket', look: 'door', lookOpt: { style: 'glass', c: ['#40a060'] }, essential: true, exitDir: 'up' },
        S: { id: 'aisle7', type: 'sign', look: 'sign', lines: ['The soul wears a shop assistant’s green vest. It points at the empty aisle.', { t: 'Aisle seven. Sports and leisure.', lang: 'en' }, { t: 'Reserved. She knows for whom.', lang: 'en' }] },
        C: { id: 'till', type: 'decor', look: 'till', lines: ['A till. The belt moves on its own, with nothing on it.'] },
        K: { id: 'cold', type: 'decor', look: 'fridge', lookOpt: { c: ['#a0d0e0'] }, lines: ['The chilled aisle. Ready meals for one, lined up in rows.', 'One tray has a note on it in felt-tip: “데워 먹어”.'], cycle: true },
        F: { id: 'flyer', type: 'sign', look: 'poster', lookOpt: { c: ['#e8e040', '#d03030'] }, lines: [{ t: 'Two for one! Two for one!', lang: 'en' }, { t: '…There is only one. There has only ever been one.', lang: 'en' }] },
        P: { id: 'announce', type: 'decor', floor: '#', look: 'loudspeaker', lines: ['The loudspeaker crackles.', { t: 'Good evening, dear customers. Please remember to say good evening.', lang: 'en', who: 'the loudspeaker' }] },
        '1': cookieMark('marketCookie')
      },
      npcs: [{ id: 'N072', at: [18, 26] }, { id: 'N073', at: [27, 10] }, { id: 'N074', at: [7, 16] }],
      mech: [{ type: 'sayTo', ent: 'N072', words: ['good evening', 'evening', 'good night', 'goodnight', 'hello', 'hi there', 'annyeong', '안녕', '안녕하세요', '좋은 저녁'], give: 'E07', dist: 4, winLines: [{ t: 'Good evening.', lang: 'en', who: 'The Cashier' }, 'The cashier finally looks up. From under the till, she takes out a pair of roller skates.', { t: 'Aisle seven. They were yours, I think.', lang: 'en', who: 'The Cashier' }], wrong: 'The cashier doesn’t look up.', doneLine: 'The cashier gives you a little wave.' }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: ['The soul holds a small piece of paper folded in four, in a hurried mother’s handwriting.', { t: '냉장고에 반찬 있어. 데워 먹어. 엄마 늦어.', lang: 'ko-s', tr: 'There’s food in the fridge. Heat it up before you eat. Mum will be late.' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'She counts the change twice. Once for herself, once as if someone were checking.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Aisle seven is for things nobody buys for you. Roller skates. Birthday candles. A second chair.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'The cashier works nights too. She says good evening to no one, because no one says it first.', lang: 'en' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: 'Rice. Eggs. The small jar of kimchi. Always the smallest size. For one.', lang: 'en' }] }
      ],
      info: {
        summary: 'A supermarket open all night, and empty: eight aisles, four tills, a chilled aisle.',
        art: 'White neon, tiles, price tags; a constant hum.',
        rules: ['Saying “good evening” (T) to the cashier gives the Skates.'],
        role: 'Gives the Skates (E07).',
        lore: 'Evening shopping, alone, with the list her mother wrote.'
      }
    });
  })();

  /* ======================= W018 — LA BIBLIOTHÈQUE DES LIVRES BLANCS ======================= */
  (function () {
    var g = K.grid(44, 32, ' ');
    g.box(0, 0, 44, 32, '#', '.');
    for (var y = 4; y < 26; y += 4) { g.hline(3, 16, y, '%'); g.hline(27, 40, y, '%'); }
    g.rect(18, 4, 8, 22, ','); g.set(22, 14, 'L'); g.set(22, 12, 'G');
    g.set(22, 31, 'N'); g.set(0, 16, 'Q'); g.set(43, 28, 'H'); g.set(4, 28, 'R'); g.set(36, 1, 'S'); g.set(40, 2, '1'); g.set(10, 2, 'M');
    YN.defWorld({
      id: 'W018', name: 'The Library of Blank Books', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'library', amb: { type: 'clock', vol: 0.04 },
      look: { floor: { p: 'wood', c: ['#6a4a30', '#4a3020', '#7a5a3a'] }, floor2: { p: 'carpet', c: ['#5a2a2a', '#4a1a1a'] }, wall: { p: 'flat', c: ['#2a1a10', '#1a100a'], topColor: '#24180e' }, wallface: { p: 'panel', c: ['#6a4a2a', '#5a3a1a', '#3a2a10'], skirt: '#2a1a0a' }, wall2: { p: 'brick', c: ['#f0ece0', '#d8d0c0', '#a89878'], h: 1.3, ownFace: true } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'W004', arrive: 'toLibrary', look: 'door', lookOpt: { style: 'wood', c: ['#6a4a2a'] }, essential: true, exitDir: 'up' },
        Q: { id: 'side', type: 'path', floor: '.', to: 'W004', arrive: 'toGym' },
        L: { id: 'desk', type: 'decor', look: 'desk', lookOpt: { book: true, lamp: true }, lines: ['The librarian’s desk. A stamp that says “ERASED”. A pile of blank books waiting to be stamped.'] },
        G: { id: 'glasses', type: 'effect', give: 'E14', look: 'glassespile', cond: { dark: true }, getLines: ['The librarian is asleep, her head on her arms. Her glasses have slipped off. You take them. Through them, a line appears on the open book, then fades.'] },
        H: { id: 'herbarium', type: 'door', floor: '#', to: 'W046', look: 'door', lookOpt: { style: 'wood', c: ['#4a6a3a'], symbol: '✿' }, cond: { effect: 'E14' }, label: 'door to the Herbarium', exitDir: 'left' },
        R: { id: 'rosette', type: 'inscription', look: 'glyphstone', glyphs: 'abcdefghijklmnopqrstuvwxyz', lines: ['The soul murmurs the signs one by one, then says them again as letters, very slowly, the way you make a child recite.', { t: 'a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z.', lang: 'en' }, { t: 'One under the other. Like a table.', lang: 'en' }] },
        S: { id: 'shh', type: 'sign', floor: '#', look: 'sign', lines: [{ t: 'Shhh.', lang: 'en' }, { t: 'The white books have always been white.', lang: 'en' }, { t: '…That is what we were told to say.', lang: 'en' }] },
        M: { id: 'returns', type: 'decor', floor: '#', look: 'mailbox', lines: ['The returns box. Someone has returned a book that doesn’t exist yet. The return date is 2044.'] },
        '1': cookieMark('libraryCookie')
      },
      npcs: [{ id: 'N075', at: [22, 15] }, { id: 'N076', at: [8, 10] }, { id: 'N077', at: [34, 18] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'Before it was white, this one had names in it. Two names. A brother and a sister.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'She stamps ERASED so she won’t have to read them. Reading is where it starts to hurt.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'Someone returned a book from 2044. Signed S. Every page was a meeting.', lang: 'en' }, 'The soul pretends to leaf through the pages, faster and faster, never looking up.'] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: [{ t: 'When the lights go out, everyone sleeps. Even the ones who never sleep. That’s when things can be taken.', lang: 'en' }] }
      ],
      info: {
        summary: 'A library of dark wood where every book is blank. In the middle, the librarian’s desk.',
        art: 'Dark panelling, blank books on the shelves, red carpet.',
        rules: ['With the light off (Bedroom), the librarian sleeps: you can take her Glasses.', 'With the Glasses, a door leads to the Herbarium (W046).'],
        secrets: ['A “table” stone for the ancient script.', 'A book returned in 2044.'],
        role: 'Gives the Glasses (E14).',
        lore: 'The librarian believes the blank books were always blank. Someone erased them.'
      }
    });
  })();

  /* ======================= W019 — LE MARAIS AUX LUCIOLES ======================= */
  (function () {
    var g = K.grid(56, 40, '.');
    var r = YN.rng.make(19);
    for (var i = 0; i < 9; i++) g.ellipse(r.int(6, 50), r.int(6, 34), r.int(3, 7), r.int(2, 4), '~');
    for (var j = 0; j < 14; j++) g.ellipse(r.int(4, 52), r.int(4, 36), r.int(2, 4), r.int(1, 3), 'w');
    for (var k = 0; k < 40; k++) { var x = r.int(1, 54), y = r.int(1, 38); if (g.at(x, y) === '.') g.set(x, y, r.chance(0.6) ? '{' : '^'); }
    g.hline(0, 55, 20, ','); g.vline(28, 0, 39, ',');
    for (var q = 0; q < 56; q++) { if (g.at(q, 20) === '~') g.set(q, 20, '='); }
    for (var q2 = 0; q2 < 40; q2++) { if (g.at(28, q2) === '~') g.set(28, q2, '='); }
    g.border('#');
    g.set(55, 20, 'E'); g.set(28, 0, 'N'); g.set(0, 20, 'W'); g.set(28, 39, 'S'); g.set(14, 30, 'H'); g.set(44, 9, '1'); g.set(40, 30, 'P');
    YN.defWorld({
      id: 'W019', name: 'The Firefly Marsh', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'swamp', amb: { type: 'frogs', vol: 0.06 }, darkAmount: 0.75, dark: 0.45,
      look: { floor: { p: 'moss', c: ['#3a5a3a', '#2a4a2a', '#4a6a4a', '#1a3a1a'] }, floor2: { p: 'dirt', c: ['#4a4030', '#3a3020', '#5a5040'] }, water: { p: 'water', c: ['#2a4a3a', '#1a3a2a', '#3a5a4a', '#8ab098'] }, shallow: { p: 'water', c: ['#3a5a4a', '#2a4a3a', '#4a6a5a', '#9ac0a8'] }, wall: { p: 'hedge', c: ['#1a3020', '#102018', '#24402a', '#081008'] } },
      tall: { '{': { look: 'reeds' }, '^': { look: 'willow', opt: { c: ['#3a5a3a', '#2a4a2a', '#4a3a26', '#5a7a4a'] } } },
      map: g.rows(),
      marks: {
        E: { id: 'east', type: 'path', to: 'W001', arrive: 'O', essential: true },
        N: { id: 'north', type: 'path', to: 'W013', arrive: 'W', essential: true },
        W: { id: 'west', type: 'path', to: 'W012', arrive: 'K', essential: true },
        S: { id: 'south', type: 'path', to: 'W025', arrive: 'west', essential: true },
        H: { id: 'hut', type: 'decor', look: 'hut', lines: ['A hut on stilts. In a jar, a single firefly, unlit.'] },
        P: { id: 'post', type: 'sign', look: 'sign', lines: ['The soul comes towards you on tiptoe, very slowly.', { t: 'Don’t run.', lang: 'en' }, { t: 'They hear you with their light.', lang: 'en' }] },
        '1': cookieMark('swampCookie')
      },
      npcs: [{ id: 'N078', at: [10, 8] }, { id: 'N079', at: [36, 32] }, { id: 'N080', at: [12, 20] }, { id: 'N081', at: [20, 14] }, { id: 'N082', at: [40, 18] }, { id: 'N083', at: [33, 28] }, { id: 'N084', at: [8, 34] }, { id: 'N085', at: [48, 12] }],
      mech: [{ type: 'catchN', tag: 'firefly', n: 5, noRun: true, give: 'E27', countText: 'Firefly # / %', runLine: 'It goes dark and darts away. They flee from running.', winLines: ['Five fireflies circle around you and do not leave.'] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: '하나만 잡고, 자기 전에 놓아주자.', lang: 'ko-s', tr: 'Let’s catch just one, and let it go before we sleep.' }, 'The soul opens its hands, slowly, above the water.'] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'Grandmother whistled to the blackbirds. The fireflies came too, but only if you stood still.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'The jar in the hut never had a lid. Nothing was meant to stay.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: ['The soul hums, very low, just above the water.', { t: '자장자장, 우리 아기, 잘도 잔다…', lang: 'ko-s', tr: 'Hush now, hush now, my little one, how well you sleep…' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: 'Four paths from here. One goes home. The others go further. At night they all look the same.', lang: 'en' }] }
      ],
      info: {
        summary: 'A lukewarm marsh, deep pools and shallows, reeds and willows; boardwalks laid in a cross.',
        art: 'Dark greens, murky water, fireflies tracing curves.',
        rules: ['Catching five fireflies by touching them gives the Fireflies (E27). They flee from running.', 'Deep water requires swimming.'],
        role: 'Crossroads: the Garden, the Musical Forest, the Village, the Frozen Lake.',
        lore: 'Summer evenings at her grandmother’s: a jar of fireflies, let go before bed.'
      }
    });
  })();

  /* ======================= W020 — LA FÊTE FORAINE FERMÉE ======================= */
  (function () {
    var g = K.grid(60, 40, '.');
    g.border('#');
    g.ellipse(15, 12, 6, 6, ','); g.set(15, 12, 'F');
    g.ellipse(44, 12, 6, 5, ','); g.set(44, 12, 'C');
    g.rect(20, 24, 20, 10, ','); g.set(30, 25, 'T'); g.set(30, 24, 'G');
    [[6, 24], [10, 24], [50, 24], [54, 24], [6, 32], [54, 32]].forEach(function (p) { g.set(p[0], p[1], '}'); });
    for (var x = 4; x < 58; x += 6) g.set(x, 2, '^');
    g.set(30, 39, 'N'); g.set(30, 20, 'M'); g.set(8, 36, 'B'); g.set(52, 36, '1'); g.set(36, 30, 'H'); g.set(24, 30, 'K');
    YN.defWorld({
      id: 'W020', name: 'The Closed Funfair', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'fair', amb: { type: 'wind', vol: 0.04 }, dark: 0.5,
      look: { floor: { p: 'dirt', c: ['#6a5a48', '#5a4a38', '#7a6a58'] }, floor2: { p: 'flat', c: ['#4a4038', '#403830'] }, wall: { p: 'fence', c: ['#8a3a3a', '#6a2a2a', '#aa5a5a'] } },
      tall: { '^': { look: 'streetlamp', opt: { off: true } }, '}': { look: 'stall2' } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', to: 'W003', arrive: 'toFair', look: 'gate', lookOpt: { c: ['#8a3a3a'], open: true }, essential: true },
        F: { id: 'ferris', type: 'decor', look: 'ferris', animated: true, lines: ['The Ferris wheel turns empty, very slowly. One gondola is still lit.'] },
        C: { id: 'carousel', type: 'decor', look: 'carousel', animated: true, lines: ['The carousel. One horse is missing. In its place, a suitcase.'] },
        G: { id: 'tent', type: 'door', to: 'W036', look: 'tent', label: 'the big top', lockedText: 'The big top is closed. A poster: “THE GREAT SPECTACLE — COMING SOON”.', cond: { any: [{ quest: { Q06: 'met' } }, { effect: 'E18' }] } },
        T: { type: 'spawn' }, M: { type: 'spawn' },
        B: { id: 'balloons', type: 'decor', look: 'balloons', lines: ['A bunch of balloons tied to a barrier. They pull upwards.'] },
        H: { id: 'cotton', type: 'decor', look: 'stall2', lookOpt: { c: ['#f0a0c0'] }, lines: ['Candyfloss. The machine is spinning. Nobody to sell it.'] },
        K: { id: 'ticket', type: 'sign', look: 'sign', lines: ['A soul in a fairground worker’s cap, behind an empty ticket booth.', { t: 'One ride, one minute.', lang: 'en' }, { t: 'We don’t take money here. Only time.', lang: 'en' }] },
        '1': cookieMark('fairCookie')
      },
      npcs: [{ id: 'N086', at: 'M' }, { id: 'N087', at: [44, 18] }, { id: 'N088', at: [12, 28] }],
      mech: [{ type: 'dirSequence', ent: 'N086', seq: ['up', 'left', 'down', 'right', 'up'], dist: 6, give: 'E18', winLines: ['The mime stops, pretends to clap without a sound, and pulls a red balloon from an invisible pocket. A real one.'] }],
      place: [
        { id: 'soul1', type: 'soul', at: 'random-any', lines: [{ t: 'He bought her a red balloon and tied it to her wrist so she wouldn’t lose it.', lang: 'en' }, { t: 'She lost him instead.', lang: 'en' }] },
        { id: 'soul2', type: 'soul', at: 'random-any', lines: [{ t: 'Knock knock, he said, at the top of the wheel. She laughed before the end. He never told her the end.', lang: 'en' }] },
        { id: 'soul3', type: 'soul', at: 'random-any', lines: [{ t: 'The big top opens for laughter. Bring something funny. Or someone who thinks he is.', lang: 'en' }] },
        { id: 'soul4', type: 'soul', at: 'random-any', lines: ['The soul has a white face and doesn’t move its lips. You hear it anyway.', { t: 'I used to talk. People listened better once I stopped.', lang: 'en' }] },
        { id: 'soul5', type: 'soul', at: 'random-any', lines: [{ t: 'There’s a horse missing from the carousel. It left on a Tuesday, with a suitcase.', lang: 'en' }] }
      ],
      info: {
        summary: 'A funfair closed for the night: a Ferris wheel and a carousel turning empty, dark stalls, a big top.',
        art: 'Dead bulbs, packed earth, faded colours.',
        rules: ['Copying the mime’s moves (up, left, down, right, up) gives the Balloon.', 'The big top (The Grand Show, W036) opens after talking about the show with Knock-Knock, or with the Balloon.'],
        role: 'Gives the Balloon (E18). Leads to Knock-Knock’s Grand Show.',
        lore: 'The fair her father took her to, once, before the suitcase.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
