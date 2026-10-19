/* =========================================================================
 *  NEW WORLDS (6) — W301 to W320: THE FOREST OF THINGS LEFT BEHIND
 *  A forest where everything put down "for a minute" has grown roots:
 *  umbrellas, single shoes, birthdays, toys, letters, keys, gloves, the
 *  people who left, hair ties, unsaid words. The Cataloguer writes it all
 *  down in her hut. Five entries in her ledger belong to a girl who does
 *  not speak (birthday W304, mitten W308, punchline W309, hair clip W310,
 *  word W312); with the ledger answered (W311), they open W318.
 *  Parents: W109 -> W301, W114 -> W305, W136 -> W309.
 *  NPC ids N1600-N1659 · effects E231-E236.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a soul: one fragment of memory, said once, then gone */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* adds a door to a world that already exists (placed at random, then made reachable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  /* deterministic perfect maze carved into a grid region (cells at odd offsets) */
  function carveMaze(g, x0, y0, cw, ch, wall, floor, seed, loops) {
    var s = seed >>> 0; function rnd() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }
    g.rect(x0, y0, 2 * cw + 1, 2 * ch + 1, wall);
    var seen = {}, st = [[0, 0]]; seen['0,0'] = 1; g.set(x0 + 1, y0 + 1, floor);
    while (st.length) {
      var c = st[st.length - 1], d = [[1, 0], [-1, 0], [0, 1], [0, -1]], moved = false;
      for (var i = d.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = d[i]; d[i] = d[j]; d[j] = t; }
      for (var k = 0; k < 4; k++) {
        var nx = c[0] + d[k][0], ny = c[1] + d[k][1];
        if (nx < 0 || ny < 0 || nx >= cw || ny >= ch || seen[nx + ',' + ny]) continue;
        seen[nx + ',' + ny] = 1; g.set(x0 + 1 + c[0] * 2 + d[k][0], y0 + 1 + c[1] * 2 + d[k][1], floor); g.set(x0 + 1 + nx * 2, y0 + 1 + ny * 2, floor);
        st.push([nx, ny]); moved = true; break;
      }
      if (!moved) st.pop();
    }
    /* a few extra openings: never a single path that one object could block */
    for (var yy = y0 + 1; yy < y0 + 2 * ch; yy++) for (var xx = x0 + 1; xx < x0 + 2 * cw; xx++) {
      if (g.at(xx, yy) !== wall || ((xx - x0) % 2 === 0) === ((yy - y0) % 2 === 0)) continue;
      if (rnd() < (loops || 0)) g.set(xx, yy, floor);
    }
    return g;
  }
  var MOSS = { floor: { p: 'moss', c: ['#34503a', '#2c4632', '#3e5e44', '#26402c'] }, floor2: { p: 'dirt', c: ['#5a4632', '#4a3a28', '#6a543c'] },
    leafg: { p: 'leaves', c: ['#4a4430', '#6a5a3a', '#3a5a3a'] }, flowers: { p: 'flowers', c: ['#34503a', '#c8c0d8', '#e8d8a0', '#f0f0f0'] },
    wall: { p: 'hedge', c: ['#1a3020', '#14281a', '#22402a', '#0c1c10'] } };
  function mossy(extra) { return Object.assign({}, MOSS, extra || {}); }
  /* forests are not connected by the generator: join every pocket to the rest */
  function joined(rows, r) { var g = rows.map(function (s) { return s.split(''); }); YN.gen.connectRegions(g, '.', r); return g.map(function (a) { return a.join(''); }); }
  var TREES = { '^': { look: 'tree', opt: { c: ['#3a5a3c', '#2a4a2e', '#4a3a28', '#5a7a4a'] } }, '{': { look: 'bush', opt: { c: ['#2a4a2e', '#22402a', '#3a5a3c'] } }, '}': { look: 'stump' }, 'o': { look: 'rock' } };
  var TAG = { c: ['#c8a868'] };
  var CLAIMS = ['ftl_c_birthday', 'ftl_c_mitten', 'ftl_c_joke', 'ftl_c_clip', 'ftl_c_word'];

  /* ---------------------------------------------------------------
   *  Effects E231–E236 (each one opens something in this forest)
   * --------------------------------------------------------------- */
  var EF = YN.data.effects;
  EF.push({ id: 'E231', name: 'Forgotten Umbrella', fam: 'lost things', world: 'W302', icon: { glyph: '☂', c: '#e8c040' }, acc: 'umbrella', action: 'float', caps: ['umbrella'],
    desc: 'A child’s umbrella, yellow, left at a school gate. It grew roots, then changed its mind.',
    use: 'Open it (F): the wind lifts you just off the ground, over water.',
    get: 'The Grove of Forgotten Umbrellas: open every folded umbrella before the first ones close again.', ground: false, core: false });
  EF.push({ id: 'E232', name: 'Unblown Candle', fam: 'lost things', world: 'W304', icon: { glyph: '¡', c: '#f0d080' }, acc: 'glow', action: 'glow', light: 2.2,
    desc: 'The twelfth candle. Nobody blew it out, so nobody made a wish.',
    use: 'A small flame you light and put out (F). Some dark places only open for it.',
    get: 'The Clearing of Forgotten Birthdays: go round the cakes in order of age.', ground: false, core: false });
  EF.push({ id: 'E233', name: 'Counting Hands', fam: 'lost things', world: 'W305', icon: { glyph: '⊓', c: '#f0d8c0' }, acc: 'cupped', action: 'hide', stealth: 0.3,
    desc: 'Hands over your eyes, counting to a hundred. Nobody ever came to find you.',
    use: 'Cover your eyes (F): you are much harder to notice. Shy things only come out then.',
    get: 'The Thicket of Unburied Toys: find the five toys still hiding, without running.', ground: false, core: false });
  EF.push({ id: 'E234', name: 'Latchkey on a Shoelace', fam: 'lost things', world: 'W307', icon: { glyph: '⚷', c: '#c8a040' }, acc: 'keys', action: 'knob', caps: ['keys'],
    desc: 'Twelfth floor, number four. You wear it under your jumper so nobody knows.',
    use: 'Turn a stuck handle in front of you (F). A front door that lost its house knows it.',
    get: 'The Hollow Tree of Keys: set the four tumblers to the number of the flat.', ground: false, core: false });
  EF.push({ id: 'E235', name: 'Milk Tooth', fam: 'lost things', world: 'W310', icon: { glyph: '◖', c: '#f4f0e4' }, action: 'seek',
    desc: 'On loan from a magpie. Give it back when you have a new one.',
    use: 'A glint drifts towards the nearest thing still hidden here (F). Buried things shine for it.',
    get: 'The Nest of Hair Ties: sing the magpie the milk-tooth rhyme.', ground: false, core: false });
  EF.push({ id: 'E236', name: 'Claim Tag', fam: 'lost things', world: 'W318', icon: { glyph: '◫', c: '#c8a868' }, acc: 'ticket', action: 'compass',
    desc: 'A brown luggage tag on a string: “CLAIMED.” It is already signed.',
    use: 'The tag tugs towards where you belong (F). At the edge of the forest, a counter waits for it.',
    get: 'The Unclaimed Shelf: push the three boxes with your name onto the chalk squares.', ground: false, core: false });

  /* ---------------------------------------------------------------
   *  W301 — The Forest of Things Left Behind (the heart of the cluster)
   * --------------------------------------------------------------- */
  S({ id: 'W301', name: 'The Forest of Things Left Behind', depth: 3, tier: 'mid', back: 'W109', backLook: 'gate', backOpt: { c: ['#5a4a32'] }, backLabel: 'back to the forest that comes back', backAt: [32, 42], outdoor: true,
    gen: { type: 'forest', w: 64, h: 46, opts: { density: 0.2, border: true, grass: '"' }, post: joined, stamps: [{ at: [26, 18], piece: K.grid(13, 10, '.').rows() }, { at: [27, 39], piece: K.grid(11, 5, '.').rows() }] },
    look: mossy(), tall: TREES, style: { renderer: 'watercolor', sky: ['#8a9a8a', '#c8d0c0'] }, music: 'leftbehind', amb: { type: 'wind', vol: 0.05 }, weather: { leaves: true },
    doors: [{ to: 'W302', look: 'gate', opt: { c: ['#3a3a5a'] }, label: 'a path under dripping umbrellas' },
      { to: 'W303', look: 'gate', opt: { c: ['#3a5a6a'] }, label: 'the sound of water, and of laces' },
      { to: 'W304', look: 'balloons', label: 'balloons caught in the branches' },
      { to: 'W306', look: 'mailbox', opt: { c: ['#c84030'], flag: true }, label: 'a postbox where the trees stop' },
      { to: 'W307', look: 'hole', label: 'a hollow in an enormous tree' },
      { to: 'W311', look: 'hut', label: 'a hut with one lit window' },
      { to: 'W314', look: 'gate', opt: { c: ['#7a5a3a'], open: true }, cond: { flag: 'ftl_waited' }, label: 'a dog’s path through the ferns', secret: true },
      { to: 'W315', look: 'streetlamp', opt: { off: true }, cond: { roomLight: false }, label: 'an unlit street lamp among the trees', secret: true }],
    decor: [{ id: 'lostspot', look: 'stump', at: [32, 23], lines: ['A wide stump, worn smooth. Carved into it: “IF YOU ARE LOST, STAY WHERE YOU ARE.”'] },
      { look: 'trinket', n: 8, opt: TAG, solid: false, lines: ['A brown luggage tag tied to a twig: “FOUND — one glove, left. Waiting.”', 'A tag: “FOUND — a voice, small. Not claimed.”', 'A tag: “FOUND — a Tuesday. Nobody came for it.”', 'A blank tag. Someone is still deciding what was lost.'] },
      { look: 'shoe', n: 4, opt: { c: ['#4a6a9a'] }, lines: ['A single shoe, laces still tied. Someone stepped out of it without stopping.'] },
      { look: 'glassespile', n: 2, lines: ['Reading glasses folded on a root, still waiting to be put on to read something.'] },
      { look: 'deadleaves', n: 6, solid: false, lines: ['Leaves, and under the leaves a button, a hair clip, a bus ticket.', 'Leaves. Under them, a mitten, palm up.'] }],
    npcs: [{ id: 'N1600', name: 'The Magpie', look: { t: 'bird', c: ['#16161c', 0, 0, '#2a2a34'], h: 11 }, behavior: 'wander', radius: 5, speed: 1.6, solid: false,
        lines: ['A magpie, black and white, with something shiny in its beak that it will not show you.', EN('Kkak-kkak. When a magpie calls, a guest is coming. That’s the rule.'), EN('I have called and called. You are the first one in years.'),
          EN('Lamps switched off at home come here. You only find their path when yours is off too.'), EN('Everything here was put down for a minute. A minute is a long time, in a forest.')] },
      { id: 'N1601', name: 'A Waiting Coat', look: H({ t: 'tall', head: 'none', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#000000', '#000000'], eyes: 'none', alpha: 0.85 }), behavior: 'static', solid: true,
        lines: [EN('Somebody hung me on a branch and said “wait here”. I am very good at it.'), EN('If they come back, I will be exactly here. That is the whole point of a coat.')] },
      { id: 'N1602', name: 'A Lost Glove', count: 2, look: { t: 'hand', c: ['#c04040'], h: 8 }, behavior: 'wander', radius: 4, speed: 0.8, solid: false, passThrough: true,
        lines: ['A red glove crawling on its fingers through the moss. It is looking for a hand.'] }],
    mech: [{ type: 'standStill', zone: [30, 21, 34, 25], secs: 20, tick: 'clock_tick', breakLine: 'She moved. Somewhere in the ferns, something that was coming stops.',
      reward: [{ set: { ftl_waited: true } }], done: { flag: 'ftl_waited' },
      winLines: ['You stay where you are. You do not move. For a long time.', 'Something comes through the ferns, nose to the ground: an old dog with a broken lead.', 'It sniffs your shoes, sneezes, and trots off down a path that was not there before.',
        { t: 'Good. That’s what you’re supposed to do. Most of them run.', lang: 'en', who: 'The Magpie' }] }],
    place: [SOUL([EN('Put something down for one minute and the forest keeps it for ever.')]), SOUL([KS('잠깐만 여기 있어. 금방 올게.', 'Stay here a moment. I’ll be right back.')])],
    info: { summary: 'A grey-green forest where everything ever put down for a minute has grown roots; luggage tags hang from every twig.',
      rules: ['Six paths lead to the clearings of lost things; the hut with the lit window belongs to the one who catalogues them.', 'Stand still beside the carved stump in the central clearing for twenty seconds: a dog opens the way to the Path of Lost Pets (W314).'],
      secrets: ['When the lamp in the real bedroom is off, an unlit street lamp appears among the trees: the way to the Clearing Where Lamps Go (W315).'],
      lore: 'What gets left behind by parents, by children, and by everyone who ever said “I’ll be right back”.' } });
  link('W109', { to: 'W301', look: 'gate', lookOpt: { c: ['#5a4a32'] }, label: 'a path where the leaves have stopped falling' });

  /* ---------------------------------------------------------------
   *  W302 — The Grove of Forgotten Umbrellas
   * --------------------------------------------------------------- */
  S({ id: 'W302', name: 'The Grove of Forgotten Umbrellas', depth: 3, tier: 'mid', back: 'W301', backLook: 'gate', backOpt: { c: ['#3a3a5a'] }, backLabel: 'back to the forest', backAt: [8, 33], outdoor: true,
    gen: { type: 'forest', w: 52, h: 40, opts: { density: 0.24, border: true }, post: joined, stamps: [{ at: [17, 13], piece: K.grid(18, 14, '.').rows() }, { at: [4, 30], piece: K.grid(9, 6, '.').rows() }] },
    look: mossy({ floor: { p: 'moss', c: ['#2a4440', '#22383a', '#30504a', '#1c3030'] } }),
    tall: { '^': { look: 'tree', vary: [{ look: 'mushroom', opt: { c: ['#20202a'] } }, { look: 'mushroom', opt: { c: ['#a02838'] } }, { look: 'mushroom', opt: { c: ['#2a3a6a'] } }, { look: 'mushroom', opt: { c: ['#3a5a3a'] } }, { look: 'tree', opt: { c: ['#2a4a3a', '#203a2e', '#3a3028', '#3a5a46'] } }] } },
    style: { renderer: 'watercolor', sky: ['#4a5a6a', '#7a8a9a'] }, music: 'umbrellagrove', amb: { type: 'rain', vol: 0.09 }, dark: 0.3, weather: { rain: true },
    doors: [{ to: 'W308', look: 'hole', label: 'the moss under the biggest umbrella' },
      { to: 'W313', look: 'gate', opt: { c: ['#8a8a90'] }, cond: { flag: 'ftl_umbrella_mine' }, label: 'a school gate, in the rain', secret: true }],
    place: [[19, 15], [25, 14], [31, 16], [20, 24], [27, 25], [33, 22]].map(function (p, i) { return { id: 'umb' + i, type: 'decor', at: p, look: 'mushroom', lookOpt: { c: ['#5a5a6a'] }, lines: ['A folded umbrella planted handle-down like a sapling.'] }; }).concat([
      SOUL([EN('Lend an umbrella and you lose it. Keep it and you lose the person.')])]),
    decor: [{ look: 'puddle', n: 8, solid: false, lines: ['A puddle with an umbrella’s reflection in it, and no umbrella above.', 'A puddle. Under the surface, a bus timetable.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — umbrella, black, left on the 7:40. Owner did not look back.”', 'A tag: “FOUND — umbrella, yellow, child’s. Left at a school gate.”'] },
      { look: 'bench', n: 2, lines: ['A bench, dry in a perfect square. Someone sat here under an umbrella for years, then left without it.'] }],
    mech: [{ type: 'lampsAll', lamps: ['umb0', 'umb1', 'umb2', 'umb3', 'umb4', 'umb5'], time: 30, light: 1.6, give: 'E231',
      litLines: ['It opens with a soft whump. Under it, the rain stops and a little warm light comes on.', 'Another one opens. Somewhere behind you, a closed one sighs.', 'It opens. The rain sounds further away.'],
      onLine: 'This one is open already. It is waiting for the others.', doneLine: 'The umbrellas stay open. Under each one, a dry circle the size of a child.',
      winLines: ['Every umbrella in the grove is open at once. For a moment, nowhere in the forest is it raining.', 'The smallest one, a child’s, pulls itself out of the ground, roots and all. It fits your hand exactly.'] }],
    npcs: [{ id: 'N1603', name: 'The Umbrella Stand', look: { t: 'barrel', c: ['#3a3a44'] }, behavior: 'static', solid: true, hearDist: 4,
        lines: [EN('Whose is this? Whose is this one? Nobody ever says.'), EN('I hold them until someone says the word. Not “sorry”. Not “thank you”. The other one.'),
          EN('A girl came every day and looked at the yellow one. She never said it was hers, so it isn’t. Yet.'), EN('Open them all, quickly. They close again if you dawdle.')],
        hears: [{ if: { flag: 'ftl_umbrella_mine' }, any: true, lines: [EN('Yes, yes. Mine, yours. Go on, the gate is open.')] },
          { match: ['mine', 'it s mine', 'that s mine', 'its mine', '내 거', '내거', '제 거', '제 거예요', '내 우산'], lines: ['The umbrella stand rattles, delighted.', EN('Mine! She said mine! Nobody ever says mine.'), 'Between two dripping trunks, a grey school gate swings open.'], do: [{ set: { ftl_umbrella_mine: true } }, { sfx: 'reveal' }, { reeval: true }] },
          { any: true, lines: [EN('No, no. The other word. The small one children are not allowed to say about anything.')] }] },
      { id: 'N1604', name: 'A Man Without an Umbrella', look: H({ t: 'adult', body: 'suit', c: ['#3a3a48', '#2a2a38', '#e0c8b0', '#1a1a1a'], acc: 'briefcase', eyes: 'down' }), behavior: 'wander', radius: 4, speed: 0.7, solid: true,
        lines: [EN('I left it on a train in 1997. I have been walking home ever since.'), EN('It’s fine. I like the rain. That’s what I tell everybody.')] }],
    info: { summary: 'A grove of umbrellas planted like saplings, in a rain that only falls here.',
      rules: ['Open the six folded umbrellas in the central glade (interact) before the first ones close again (30 seconds each): the child’s umbrella pulls itself up — the Forgotten Umbrella (E231).'],
      secrets: ['Say “mine” to the Umbrella Stand: a school gate opens to the Pick-Up Point in the Rain (W313).'],
      lore: 'Everything lent and never given back, and the children who never dared say “mine”.' } });

  /* ---------------------------------------------------------------
   *  W303 — The River of Single Shoes
   * --------------------------------------------------------------- */
  var SHOES = [[4, 6], [10, 9], [15, 6], [6, 17], [13, 20], [8, 26], [36, 9], [41, 19]];
  var SHOECOL = ['#d05060', '#4a6a9a', '#e8e0d0', '#3a3a3a', '#d8a040', '#5a8a4a', '#8a4a8a', '#c87040'];
  S({ id: 'W303', name: 'The River of Single Shoes', depth: 3, tier: 'mid', back: 'W301', backLook: 'gate', backOpt: { c: ['#3a5a6a'] }, backLabel: 'back to the forest', backAt: [2, 14], outdoor: true,
    map: (function () {
      var g = K.grid(46, 32, '^'); g.rect(1, 1, 44, 30, '.');
      g.rect(19, 0, 12, 32, '~'); g.vline(19, 1, 30, 'w'); g.vline(30, 1, 30, 'w'); g.rect(19, 3, 12, 2, 'w');
      g.rect(24, 14, 3, 4, '.');
      [[3, 3], [8, 4], [13, 12], [2, 21], [15, 25], [5, 29], [35, 4], [40, 12], [43, 24], [34, 28], [11, 15], [38, 16]].forEach(function (p) { g.set(p[0], p[1], '^'); });
      return g.rows();
    })(),
    look: mossy({ floor: { p: 'grass', c: ['#4a6a44', '#3e5e3a', '#56764e', '#34502e'] }, water: { p: 'water', c: ['#22485a', '#1c3e50', '#32607a', '#a8c8d8'] }, shallow: { p: 'water', c: ['#3a6a7a', '#33606e', '#4a7a8a', '#b8d0d8'] } }),
    tall: TREES, style: { renderer: 'watercolor', sky: ['#9aaab0', '#d8e0e0'] }, music: 'shoeriver', amb: { type: 'river', vol: 0.08 },
    doors: [{ to: 'W309', at: [17, 29], look: 'boat', cond: { flag: 'ftl_shoes_paired' }, locked: 'Downstream, the river is jammed with single shoes. Nothing floats past until they leave in pairs.', label: 'downstream, towards a still pond' }],
    place: SHOES.map(function (p, i) { return { id: 'sh' + i, type: 'decor', at: p, look: 'shoe', lookOpt: { c: [SHOECOL[i]] }, lines: ['A single shoe.'] }; }).concat([
      { id: 'islanddoor', type: 'door', to: 'W320', at: [25, 15], look: 'shoe', lookOpt: { c: ['#8a2a2a'] }, label: 'a shoe as big as a boat, laces trailing in the water', unreachOk: 'floating over the river with the Forgotten Umbrella (E231)' },
      { id: 'dent', type: 'decor', at: [25, 17], look: 'scuff', solid: false, lines: ['A dent in the mud, the size of a very small left shoe. The shoe is not here any more.', 'Somebody came for it, long after 1951, and took it to a platform.'] },
      SOUL([EN('Every shoe here ran after something. None of them caught it.')])]),
    decor: [{ look: 'reeds', n: 8, lines: ['Reeds full of laces, knotted by the current into bows nobody tied.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — left shoe, size 3, chasing an ice-cream van, 1999.”', 'A tag: “FOUND — one slipper. The other one went to hospital.”'] },
      { look: 'shoe', n: 6, opt: { c: ['#6a5a4a'] }, lines: ['Another single shoe, drifting downstream, then back up again, as if it had forgotten something.'] },
      { look: 'pebbles', n: 5, solid: false, lines: ['Pebbles in a line, like a path for somebody very small.'] }],
    mech: [{ type: 'pairs', tiles: SHOES.map(function (p, i) { return 'sh' + i; }), reward: [{ set: { ftl_shoes_paired: true } }], done: { flag: 'ftl_shoes_paired' },
      wrongLine: 'Two shoes that will never be a pair. They look away from each other.', doneLine: 'This one has a pair now. It is in no hurry.',
      winLines: ['The last two shoes find each other.', 'All along the banks, odd shoes step into the water two by two and let the current take them.', 'Downstream, the river is free again.'] }],
    npcs: [{ id: 'N1605', name: 'The Grey Heron', look: { t: 'bird', c: ['#9aa0a8', 0, 0, '#e8c040'], h: 18 }, behavior: 'static', solid: true, at: [18, 15],
        lines: [EN('I fish for laces. Shoes I throw back. They always come back single.'), EN('Two shoes that were never a pair can still leave together. That is what they are waiting for.'),
          EN('The island? Nobody wades there. Open something over your head and let the wind take you across.')] },
      { id: 'N1606', name: 'A Wellington Boot', look: { t: 'shoe', c: ['#2a5a3a'] }, behavior: 'static', solid: true, at: [8, 14],
        lines: [EN('Left foot. Size three. Kicked off in a hurry, chasing an ice-cream van.'), EN('The right one went home. It thinks about me, I’m sure.'), EN('Turn us over, two at a time. When the signs match, we go.')] }],
    info: { summary: 'A river crowded with single shoes drifting heel to toe; a heron fishes for laces.',
      rules: ['Interact with the eight odd shoes on the banks: two that show the same sign make a pair. With all four pairs made, the river flows on to the Pond of Those Who Left (W309).'],
      secrets: ['The island in the middle can only be reached by floating over the water with the Forgotten Umbrella (E231); a shoe the size of a boat there leads to the Edge of the Forest (W320).'],
      lore: 'Shoes lost running after something — and the dent left by one small left shoe from 1951 that somebody finally came for.' } });

  /* ---------------------------------------------------------------
   *  W304 — The Clearing of Forgotten Birthdays
   * --------------------------------------------------------------- */
  var CAKES = [[11, 'cake10', 'A cake with ten candles, still burning. Somebody started to cut it, then stopped.'],
    [14, 'cake7', 'A cake with seven candles, never blown out. Piped in icing: “7”.'],
    [17, 'cake12', 'A cake with twelve candles, the newest. The icing is still soft. The date is this year’s.'],
    [20, 'cake8', 'A cake with eight candles. The icing says “8” and, smaller, “sorry — night shift”.'],
    [23, 'cake11', 'A cake with eleven candles. A card leans on it: “From Mum. I’ll be home at seven.”'],
    [26, 'cake9', 'A cake with nine candles. A paper flag stuck in it: “1989”. The icing has gone hard.']];
  S({ id: 'W304', name: 'The Clearing of Forgotten Birthdays', depth: 3, tier: 'mid', back: 'W301', backLook: 'balloons', backLabel: 'back to the forest', backAt: [19, 27], outdoor: true,
    map: (function () { var g = K.grid(40, 30, '^'); g.ellipse(19.5, 15, 18, 13, '.'); g.ellipse(19.5, 15, 12, 7, ','); return g.rows(); })(),
    look: mossy({ floor2: { p: 'grass', c: ['#5a7a4a', '#4e6e40', '#668654'] } }), tall: TREES,
    style: { renderer: 'crayon', sky: ['#c8b0c0', '#f0e0e8'] }, music: 'forgottenbirthdays', amb: { type: 'wind', vol: 0.04 }, weather: { petals: true },
    doors: [{ to: 'W305', at: [34, 10], look: 'gate', opt: { c: ['#6a6a4a'] }, label: 'a path strewn with wrapping paper' },
      { to: 'W319', type: 'hole', at: [30, 15], look: 'hole', cond: { any: [{ said: 'happy birthday' }, { said: '생일 축하' }, { said: '생일축하' }] }, arrive: 'back', label: 'a hole under the thirteenth chair', secret: true }],
    place: CAKES.map(function (c) { return { id: c[1], type: 'decor', at: [c[0], 13], look: 'cake', lines: [c[2]] }; }).concat(
      CAKES.map(function (c) { return { type: 'decor', at: [c[0], 14], look: 'table', lookOpt: { cloth: '#f0e0e8' }, lines: ['The long party table. Paper plates, all clean. Party hats, all folded.'] }; }),
      [{ type: 'decor', at: [29, 15], look: 'chair', lines: ['The thirteenth chair, pulled out a little, the way you pull out a chair for somebody who is about to arrive.'] },
        SOUL([KS('오늘 생일 축하한다는 말, 아무도 안 했어.', 'Nobody said happy birthday today.')])]),
    decor: [{ look: 'balloons', n: 3, lines: ['Balloons caught in the branches, still tied to nothing.'] },
      { look: 'candle', n: 5, solid: false, light: 1, lines: ['A birthday candle stuck in the moss, burning. Nobody blows it out. Nobody makes a wish.'] },
      { look: 'scraps', n: 6, solid: false, lines: ['Wrapping paper, carefully folded and kept for next year.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — a birthday. Twelfth. Unopened.”', 'A tag: “FOUND — a team dinner that ran late, 1989.”'] }],
    mech: [{ type: 'sequence', order: ['cake7', 'cake8', 'cake9', 'cake10', 'cake11', 'cake12'], passThrough: true, give: 'E232', reward: [{ set: { ftl_c_birthday: true } }],
      wrongLine: 'All the flames lean the same way at once. That is not how birthdays go.', doneLine: 'The cakes keep their candles. One flame is missing: you have it.',
      winLines: ['Seven, eight, nine, ten, eleven, twelve. Every candle bows at once, as if a whole table had blown.', 'All but one. The twelfth candle goes on burning. It comes away in your hand, warm, and does not drip.', 'Somewhere a pencil writes in a ledger: “one birthday, twelfth — found”.'] }],
    npcs: [{ id: 'N1607', name: 'The Birthday Girl', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#e8a0b8', '#c88098', '#f0d0b0', '#2a1a1a'], acc: 'balloon', eyes: 'down' }), behavior: 'static', solid: true, at: [8, 14],
        lines: [KS('엄마가 일곱 시에 온댔어.', 'Mum said she’d come at seven.'), EN('Count up. That’s how birthdays go, even the forgotten ones. One after the other.'),
          EN('Nobody said it today. Not one person. If somebody says it, even late, the table opens all the way down.')] },
      { id: 'N1608', name: 'A Sleeping Guest', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#2a1a10'], eyes: 'closed', alpha: 0.7 }), behavior: 'static', solid: true, at: [29, 14],
        lines: ['She sleeps in her work tunic, head on the table, a present still wrapped on her knees.', KS('…오 분만. 오 분만 자고 일어날게.', '…Five minutes. I’ll just sleep for five minutes.'), 'The label on the present: “for my S. — sorry it’s late”.'] },
      { id: 'N1609', name: 'A Party Hat', count: 3, look: { t: 'moth', c: ['#e8d040'], h: 8 }, behavior: 'fly', radius: 6, speed: 1.2, solid: false, lines: ['A paper party hat, flapping from branch to branch like a moth.'] }],
    info: { summary: 'A clearing set for a party that never started: a long table, six cakes, candles nobody blew out.',
      rules: ['Interact with the cakes in order of age, from seven to twelve: the twelfth candle comes away still burning — the Unblown Candle (E232). The birthday is also claimed in the Cataloguer’s ledger.'],
      secrets: ['Say “happy birthday” in the clearing: a hole opens beside the thirteenth chair, down to the Burrow of Lost Sleep (W319).'],
      lore: 'Birthdays that fell on night shifts and team dinners, in Seoul in 1989 and in France now.' } });

  /* ---------------------------------------------------------------
   *  W305 — The Thicket of Unburied Toys
   * --------------------------------------------------------------- */
  var TOYMAZE = (function () {
    var g = K.grid(15, 13, '.'); g.rect(1, 1, 13, 11, '{');
    carveMaze(g, 2, 2, 5, 4, 'x', '.', 305, 0.1);
    g.rect(6, 4, 3, 3, '.'); g.set(7, 10, '.'); g.set(7, 11, '.');
    return g.rows();
  })();
  var TOYS = [['N1610', 'A One-Eyed Teddy', { t: 'plush', c: ['#b8946a'] }, 'A teddy bear behind a root, paws over its eyes.'],
    ['N1611', 'Mr Rabbit', { t: 'rabbit', c: ['#e8e0d8'] }, 'A cloth rabbit, ears flat, holding its breath.'],
    ['N1612', 'A Rag Doll', H({ t: 'doll', body: 'dress', c: ['#c06070', '#a04858', '#f0d8c8', '#6a3a1a'], eyes: 'painted', mouth: 'painted', h: 14 }), 'A rag doll squeezed under a fern.'],
    ['N1613', 'A Wind-Up Train', { t: 'toytrain' }, 'A little tin train, very still, pretending to be a stone.'],
    ['N1614', 'A Rubber Ball', { t: 'ball', c: ['#e04040'] }, 'A red ball, half sunk in the leaves, trying not to roll.']];
  S({ id: 'W305', name: 'The Thicket of Unburied Toys', depth: 3, tier: 'mid', back: 'W304', backLook: 'gate', backOpt: { c: ['#6a6a4a'] }, backLabel: 'back to the birthday clearing', backAt: [9, 33], outdoor: true,
    gen: { type: 'forest', w: 54, h: 40, opts: { density: 0.28, border: true, tree: '^', grass: '"' }, post: joined, stamps: [{ at: [36, 24], piece: TOYMAZE }, { at: [5, 30], piece: K.grid(9, 6, '.').rows() }] },
    look: mossy({ floor: { p: 'moss', c: ['#3e4e36', '#36462e', '#46583e', '#2e3e28'] } }), tall: TREES,
    style: { renderer: 'crayon', sky: ['#a8a0b8', '#d8d0e0'] }, music: 'unburiedtoys', amb: { type: 'kids', vol: 0.03 },
    doors: [{ to: 'W114', look: 'gate', opt: { c: ['#5a6a4a'] }, label: 'the hill of little graves' },
      { to: 'W313', at: [43, 29], look: 'book', opt: { c: ['#e8c030'] }, label: 'a school bag dropped in the middle of the brambles', secret: true }],
    decor: [{ look: 'plush', n: 4, opt: { dust: true }, solid: false, lines: ['A plush rabbit, damp, not hiding. It was simply forgotten.', 'A teddy bear with moss growing on its tummy.'] },
      { look: 'toytrain', n: 2, solid: false, lines: ['A wooden train with one carriage missing. The missing one is probably hiding too.'] },
      { look: 'ball', n: 3, solid: false, lines: ['A ball that rolled under the brambles one evening. Nobody came to get it out.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — Mr Rabbit. Not buried. Not yet.”', 'A tag: “FOUND — a game of hide-and-seek, unfinished.”'] }],
    npcs: TOYS.map(function (t) { return { id: t[0], name: t[1], look: t[2], tag: 'ftltoy', at: 'random-hidden', behavior: 'static', solid: false, passThrough: true, lines: [t[3]] }; }).concat([
      { id: 'N1615', name: 'The Counting Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 16,
        ambientLines: [EN('…ninety-five, ninety-six, ninety-seven…'), EN('…ninety-eight…'), EN('Dinner! Come in, it’s getting dark!'), 'The counting stops at ninety-eight. It always stops at ninety-eight.'] },
      { id: 'N1616', name: 'A Tin Soldier', look: H({ t: 'doll', head: 'helmet', body: 'uniform', c: ['#3a4a8a', '#2a3a6a', '#f0d0b0', '#c84030'], h: 13 }), behavior: 'static', solid: true,
        lines: [EN('Five of us are still hiding. Creep. If you run, they think it’s a grown-up and they hide deeper.'), EN('Walls you can’t see are still walls. Walk with one hand out.'),
          EN('Somebody dropped a school bag in the middle of the brambles. It’s still there, behind the pretend walls.')] }]),
    mech: [{ type: 'catchN', tag: 'ftltoy', n: 5, noRun: true, give: 'E233', countText: 'Found # / %', runLine: 'Running feet. The toys shuffle deeper into the bracken. In this game, you creep.',
      winLines: ['“Found you!” The last toy laughs, a small worn-out laugh.', 'They have been hiding since the day somebody stopped counting at ninety-eight and went in for dinner.',
        'All five put their paws over your eyes, very gently.', 'When they take them away, your own hands are still there, over your eyes, counting.'] }],
    place: [SOUL([EN('A toy that is buried was loved. A toy that is lost is still waiting to be.')])],
    info: { summary: 'A bramble thicket beside the Toy Graveyard, where toys that were lost — not outgrown — are still hiding.',
      rules: ['Find the five hidden toys by walking up to them without running: the last one gives Counting Hands (E233).'],
      secrets: ['A ring of bushes hides a glade of invisible walls; a school bag in its centre leads to the Pick-Up Point in the Rain (W313).'],
      lore: 'A game of hide-and-seek that nobody came back to finish.' } });
  link('W114', { to: 'W305', look: 'gate', lookOpt: { c: ['#6a6a4a'] }, label: 'a thicket where the toys were never buried' });

  /* ---------------------------------------------------------------
   *  W306 — The Field of Unanswered Letters
   * --------------------------------------------------------------- */
  S({ id: 'W306', name: 'The Field of Unanswered Letters', depth: 3, tier: 'mid', back: 'W301', backLook: 'gate', backOpt: { c: ['#7a6a4a'] }, backLabel: 'back to the forest', backAt: [2, 32], outdoor: true,
    map: (function () {
      var g = K.grid(49, 35, '^'); g.rect(1, 1, 47, 33, '.');
      carveMaze(g, 1, 1, 23, 14, '{', '+', 306, 0.06);
      g.set(2, 29, '+'); g.rect(42, 1, 6, 4, '.');
      return g.rows();
    })(),
    look: mossy({ floor: { p: 'meadow', c: ['#8a9a5a', '#7a8a4a', '#9aaa6a', '#6a7a40'] }, soil: { p: 'soil', c: ['#6a4e30', '#5a4026', '#7a5a3a'] } }),
    tall: { '^': TREES['^'], '{': { look: 'bush', opt: { c: ['#6a7a3a', '#5a6a2e', '#7a8a4a'] } } },
    style: { renderer: 'watercolor', sky: ['#d8d0b0', '#f0ecd8'] }, music: 'unansweredletters', amb: { type: 'paper', vol: 0.05 },
    doors: [{ to: 'W312', at: [46, 32], look: 'hole', label: 'a damp hollow full of mushrooms, past the last furrow' },
      { to: 'W316', at: [46, 1], look: 'gate', opt: { c: ['#e8e4dc'], open: true }, cond: { flag: 'ftl_trail' }, label: 'a line of white birches beyond the furrows', secret: true }],
    place: [{ id: 'postbox', type: 'decor', at: [4, 31], look: 'mailbox', lookOpt: { c: ['#c84030'], flag: true }, lines: ['A red postbox, flag up. It has been flag-up for years. Footprints lead away from it into the furrows.'] },
      { id: 'herletter', type: 'decor', at: [45, 2], look: 'letter', lines: ['A letter standing upright in the earth like a seedling. The envelope is addressed to you, in a hand you know.', 'Inside, one line: “I got all of them. Every single one. I keep them in my apron.”', 'It is not signed. It smells of earth and of a scarf.'] },
      { id: 'buriedbox', type: 'door', to: 'W138', at: [25, 33], look: 'mailbox', lookOpt: { c: ['#c84030'], flag: true }, cond: { equipped: 'E235' }, label: 'a letterbox buried up to its little red flag', secret: true },
      SOUL([EN('One letterbox in this field was buried with its flag up. Something shiny can still find it.')])],
    decor: [{ look: 'letter', n: 7, solid: false, lines: ['A letter: “Dear Dad, are you coming at Christmas? Tick yes or no.” Neither box is ticked.', 'A letter: “To 할머니. Are you cold there? I am wearing your scarf.”',
        'A letter to a radio station, asking for a song for somebody who works nights.', 'A letter to Nour, in another town. Stamped: ADDRESS UNKNOWN.'] },
      { look: 'scarecrow', n: 1, at: [16, 31], lines: ['A scarecrow made of a postman’s jacket. The pockets are full of stamps.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — letters, 4,113. Answered: 0.”', 'A tag: “FOUND — one reply, never sent. See far corner.”'] }],
    mech: [{ type: 'trail', from: 'postbox', to: 'herletter', slack: 1, lostLine: 'She has stepped off the postman’s footprints. They begin again, further on.',
      reward: [{ set: { ftl_trail: true } }], done: { flag: 'ftl_trail' },
      winLines: ['The footprints end at a letter standing upright in the furrow, like a seedling.', 'It is addressed to you. Inside, one line: “I got all of them. Every single one.”', 'Beyond the last furrow, a gate you had not seen stands open, onto white birches.'] }],
    npcs: [{ id: 'N1617', name: 'The Postman Scarecrow', look: { t: 'scarecrow' }, behavior: 'static', solid: true, at: [7, 31],
        lines: [EN('Every letter in this field was posted and never answered. They grow while they wait.'), EN('I walked to the far corner once, with one for you. My footprints are still there. Follow them; don’t think.'),
          { if: { flag: 'ftl_trail' }, t: 'He tips his cap. There is straw where his face should be, and the straw is smiling.' }] },
      { id: 'N1618', name: 'A Letter That Flaps', count: 3, look: { t: 'moth', c: ['#f0ead8'], h: 9 }, behavior: 'fly', radius: 6, speed: 1, solid: false,
        lines: ['An envelope flapping like a moth. The stamp is from a country that has changed its name.'] }],
    info: { summary: 'A field where unanswered letters grow in furrows between hedges, and a scarecrow wears a postman’s jacket.',
      rules: ['Follow the postman’s footprints from the red postbox through the furrows to the letter in the far corner: a gate opens onto the Birches of Fridge Notes (W316).'],
      secrets: ['With the Milk Tooth (E235) equipped, a letterbox buried up to its flag shows itself at the bottom of the field: it leads to the Post Office of Impossible Letters (W138).'],
      lore: 'Letters to fathers, to grandmothers, to friends who moved — and the one reply that finally came.' } });

  /* ---------------------------------------------------------------
   *  W307 — The Hollow Tree of Keys
   * --------------------------------------------------------------- */
  var BARK = { p: 'rock', c: ['#4a3622', '#3a2a18', '#5a4630'] };
  S({ id: 'W307', name: 'The Hollow Tree of Keys', depth: 3, tier: 'mid', back: 'W301', backLook: 'hole', backLabel: 'out of the hollow, back to the forest', backAt: [14, 26],
    map: (function () {
      var g = K.grid(32, 30, '#'); g.ellipse(14.5, 14.5, 12, 12, '.'); g.ellipse(14.5, 14.5, 4, 4, ',');
      g.rect(28, 12, 3, 5, '.'); g.set(27, 14, '?');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#6a4a2e', '#5a3e24', '#7a5638'] }, floor2: { p: 'wood', c: ['#8a6a44', '#7a5a38', '#9a7a52'] }, wall: BARK, secret: { p: 'rock', c: ['#4a3622', '#3e2c1a', '#5a4630'] } },
    style: { renderer: 'engraving' }, music: 'keytree', amb: { type: 'bells', vol: 0.03 }, dark: 0.45,
    doors: [{ to: 'W310', type: 'ladder', at: [14, 3], look: 'ladder', label: 'a ladder up inside the trunk, towards a nest' }],
    place: [0, 1, 2, 3].map(function (i) { return { id: 'tum' + i, type: 'decor', at: [[8, 8], [21, 8], [8, 21], [21, 21]][i], look: 'lever', lines: ['A tumbler as big as a cartwheel, carved with the digits nought to nine.'] }; }).concat([
      { id: 'knotdoor', type: 'door', to: 'W314', at: [29, 14], look: 'door', lookOpt: { style: 'wood', c: ['#6a5a3a'] }, arrive: 'back', label: 'a cat flap, just behind the knot-hole', unreachOk: 'through the knot-hole (? wall) with the Glasses (E14)' },
      { type: 'decor', at: [29, 12], look: 'keyring', lines: ['The keys the magpie likes best: one to a bicycle that was stolen, one to a diary, one to a house that moved.'] },
      SOUL([KS('열쇠는 목에 걸고 다녀. 아무한테도 보여 주지 마.', 'Keep the key round your neck. Don’t show it to anybody.')])]),
    decor: [{ look: 'keyring', n: 10, lines: ['A key on a shoelace. The tag says 1204.', 'House keys, hundreds of them, hanging from the roots. Every tag says the same number: 1204.', 'A key with a plastic duck on it. Tag: 1204.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — keys, front door, one set per year. Lost by: the same girl.”', 'A tag: “FOUND — a spare key under a doormat. Everybody knew.”'] },
      { look: 'mushroom', n: 3, opt: { c: ['#c8b890'] }, solid: false, lines: ['Pale mushrooms growing where the heartwood went soft.'] }],
    mech: [{ type: 'dials', marks: ['tum0', 'tum1', 'tum2', 'tum3'], states: 10, values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], start: [7, 3, 9, 0], target: [1, 2, 0, 4], labelText: 'The tumbler clicks round to ', sfx: 'tick', give: 'E234',
      winLines: ['One, two, nought, four. Every key in the tree turns at once, with one enormous click.', 'It sounds like a whole building coming home.', 'A key drops out of the dark into your palm, on a grubby shoelace.', 'It is the key you wear round your neck when nobody is in.'] }],
    npcs: [{ id: 'N1619', name: 'A Girl with a Key Round Her Neck', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#7a8aa8', '#5a6a88', '#f0d0b0', '#1a1a1a'], acc: 'bag' }), behavior: 'static', solid: true, at: [11, 14],
        lines: [KS('엄마가 열쇠 잃어버리지 말랬어.', 'Mum told me not to lose the key.'), KS('혼자 문 여는 거 이제 안 무서워. 진짜야.', 'I’m not scared of opening the door on my own any more. Really.'), KS('12층 4호. 외워 놨어. 잊어버리면 안 되니까.', 'Twelfth floor, number four. I learnt it by heart, so I can’t forget.')] },
      { id: 'N1620', name: 'The Magpie', look: { t: 'bird', c: ['#16161c', 0, 0, '#2a2a34'], h: 11 }, behavior: 'static', solid: false, at: [18, 11],
        lines: [EN('Every key in here opens the same flat. Don’t ask me which building. They all look alike.'), EN('Through the knot-hole there is daylight, if you wear something to see better.'), EN('My nest is at the top. Mind the edge when you get there.')] },
      { id: 'N1621', name: 'A Talking Key', look: { t: 'keyring' }, behavior: 'static', solid: true,
        lines: [EN('I opened a front door every day for six years. Then they changed the locks.'), EN('Nobody turns a key like a child alone. Slowly. Listening.')] }],
    info: { summary: 'The inside of a giant hollow tree, hung with thousands of house keys, all tagged with the same number.',
      rules: ['Set the four tumblers (interact to turn them) to 1-2-0-4, the flat number the girl learnt by heart: the Latchkey on a Shoelace (E234) falls into your hand.', 'The ladder climbs to the Nest of Hair Ties (W310).'],
      secrets: ['A knot-hole in the east wall can be walked through with the Glasses (E14): behind it, a cat flap opens onto the Path of Lost Pets (W314).'],
      lore: 'The keys of children who let themselves in. 1204: the flat in Seoul where Mi-ran grew up, and every flat since.' } });

  /* ---------------------------------------------------------------
   *  W308 — The Moss of Lost Gloves
   * --------------------------------------------------------------- */
  S({ id: 'W308', name: 'The Moss of Lost Gloves', depth: 3, tier: 'mid', back: 'W302', backLook: 'hole', backLabel: 'back up under the umbrellas', backAt: [6, 29],
    map: (function () {
      var g = K.grid(44, 32, '#');
      g.rect(5, 6, 3, 21, '.'); g.rect(5, 6, 17, 3, '.'); g.rect(19, 6, 3, 15, '.'); g.rect(19, 18, 17, 3, '.'); g.rect(33, 4, 3, 17, '.'); g.rect(33, 4, 8, 3, '.');
      g.ellipse(6, 27, 4, 3, '.'); g.ellipse(39, 5, 3, 2, ','); g.ellipse(12, 15, 4, 3, '.'); g.rect(7, 14, 3, 3, '.');
      g.ellipse(27, 27, 6, 3, '.'); g.rect(26, 20, 3, 6, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'moss', c: ['#3a6a3e', '#2e5a34', '#468048', '#26502c'] }, floor2: { p: 'moss', c: ['#5a8a4a', '#4a7a3e', '#6a9a56'] }, wall: { p: 'rock', c: ['#2a3a2a', '#1e2e20', '#364636'] } },
    style: { renderer: 'watercolor' }, music: 'glovemoss', amb: { type: 'drip', vol: 0.05 }, dark: 0.4, extra: { noFurnish: true },
    doors: [{ to: 'W319', at: [12, 13], look: 'hole', label: 'a warm burrow under the moss that smells of sleep' },
      { to: 'W315', at: 'random-hidden', look: 'hole', label: 'a crack in the moss with lamplight at the bottom', secret: true }],
    place: [{ id: 'othermitten', type: 'decor', at: [41, 5], look: 'sock', solid: false, lines: ['A grey mitten, knitted by hand, half sunk in the moss. Inside, embroidered in red: 소라.'] },
      SOUL([EN('A mitten on a string cannot be lost. Somebody had to cut the string.')])],
    decor: [{ look: 'sock', n: 8, solid: false, lines: ['A mitten in the moss, palm up, as if waiting to be given something.', 'A leather glove, the fingers still curled round a handle that is not there.'] },
      { look: 'tuft', n: 10, solid: false, lines: ['Moss, very soft. It grew over a glove so slowly that the glove never noticed.'] },
      { look: 'mushroom', n: 4, opt: { c: ['#a8a0c8'] }, solid: false, lines: ['A mushroom with a thimble on its head.'] },
      { look: 'trinket', n: 3, opt: TAG, solid: false, lines: ['A tag: “FOUND — one mitten, grey, hand-knitted. The other one is further in.”', 'A tag: “FOUND — a hand to hold. Unclaimed.”'] }],
    mech: [{ type: 'guide', ent: 'N1622', wait: 4.5, reward: [{ set: { ftl_c_mitten: true } }], done: { flag: 'ftl_c_mitten' },
      winLines: ['The Glove Hand stops beside a grey mitten half sunk in the moss.', 'It holds its cut string out to the other cut string.', 'They do not tie. They are just close. That is enough, apparently.', 'Inside the mitten, embroidered in red, a name.', 'Somewhere a pencil writes: “one mitten, pair restored — found”.'] }],
    npcs: [{ id: 'N1622', name: 'The Glove Hand', look: { t: 'hand', c: ['#a8a8b0'], h: 12 }, behavior: 'patrol', at: [6, 24], path: [[6, 24], [6, 7], [20, 7], [20, 19], [34, 19], [34, 5], [38, 5], [38, 5]], speed: 0.9, solid: false, passThrough: true,
        lines: [EN('Hold on. Don’t let go. I know where the other one is.'), 'A grey knitted mitten on a string. The string has been cut.', EN('If you fall behind, I wait. I have always waited for the slow one.')] },
      { id: 'N1623', name: 'A Gardening Glove', look: { t: 'hand', c: ['#7a8a4a'], h: 10 }, behavior: 'static', solid: true, at: [27, 27],
        lines: [KS('할머니 손은 늘 흙투성이였어. 그래도 따뜻했어.', 'Grandma’s hands were always covered in earth. They were warm, though.'), 'A gardening glove, stiff with old soil. It still smells of tomato leaves.'] },
      { id: 'N1624', name: 'A Snail in a Thimble', look: { t: 'snail', c: ['#c8c8d0', '#c8b890'], hat: true }, behavior: 'wander', radius: 3, speed: 0.3, solid: false,
        lines: [EN('Lost things are slow. That’s why snails find them first.')] }],
    info: { summary: 'Mossy tunnels under the umbrella grove, carpeted with gloves and mittens that lost their hands.',
      rules: ['Stay close to the Glove Hand: it stops whenever you fall behind and leads you to the other mitten, which is claimed in the Cataloguer’s ledger.', 'A warm burrow leads down to the Burrow of Lost Sleep (W319).'],
      secrets: ['A crack in the moss, tucked into a nook, leads to the Clearing Where Lamps Go (W315).'],
      lore: 'Mittens on strings, gardening gloves, hands that let go.' } });

  /* ---------------------------------------------------------------
   *  W309 — The Pond of Those Who Left
   * --------------------------------------------------------------- */
  S({ id: 'W309', name: 'The Pond of Those Who Left', depth: 3, tier: 'hard', back: 'W303', backLook: 'boat', backLabel: 'upstream, back to the river of shoes', backAt: [21, 2], outdoor: true,
    map: (function () {
      var g = K.grid(44, 34, '^'); g.rect(1, 1, 42, 32, '.');
      g.ellipse(21.5, 17, 13, 10, 'w'); g.ellipse(21.5, 17, 11.5, 8.5, '~');
      g.set(21, 17, '.'); g.set(22, 17, '.');
      [[4, 4], [38, 5], [5, 29], [39, 27], [12, 3], [31, 31]].forEach(function (p) { g.set(p[0], p[1], '^'); });
      return g.rows();
    })(),
    look: mossy({ water: { p: 'water', c: ['#1a3040', '#14283a', '#2a4a5e', '#c8d8e8'] }, shallow: { p: 'water', c: ['#2a4a58', '#244250', '#3a5a6a', '#c8d8e0'] } }),
    tall: { '^': { look: 'willow', opt: { c: ['#4a6a4a', '#3a5a3a', '#5a4a30'] } } },
    style: { renderer: 'watercolor', sky: ['#6a7a8a', '#b8c0c8'] }, music: 'pondleft', amb: { type: 'frogs', vol: 0.04 }, dark: 0.35,
    doors: [{ to: 'W136', at: [40, 30], look: 'gate', opt: { c: ['#3a4a5a'] }, label: 'a path up to a garden at night' }],
    place: [{ id: 'ring', type: 'hole', to: 'W317', at: [22, 17], look: 'puddle', label: 'a ring of ripples in the middle of the pond that never closes', unreachOk: 'floating over the pond with the Forgotten Umbrella (E231)' },
      SOUL([EN('The pond keeps the people who left the right way up, so you can still look at them.')])],
    decor: [{ look: 'reeds', n: 8, lines: ['Reeds. The wind passes a name through them, too fast to catch.'] },
      { look: 'bench', n: 2, lines: ['A bench facing the water. Two dips in the seat: one big, one small.'] },
      { look: 'puddle', n: 3, solid: false, lines: ['A puddle by the pond. In it, everybody is reflected except you.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag on a reed: “FOUND — the people who left. Kept here, the right way up.”'] }],
    npcs: [{ id: 'N1625', name: 'The Reflection with a Suitcase', look: H({ t: 'adult', body: 'coat', c: ['#6a6a7a', '#4a4a5a', '#d0c0b0', '#1a1a1a'], acc: 'suitcase', eyes: 'none', alpha: 0.5 }), behavior: 'static', solid: true, at: [21, 27], hearDist: 5,
        lines: [EN('Knock knock.'), 'He waits, smiling, the way people wait for the next line of a joke.', { seq: [EN('Knock knock.'), 'His suitcase has a letter on it: J.'] }],
        hears: [{ if: { flag: 'ftl_c_joke' }, any: true, lines: ['He only smiles. The rest of the joke is not in the pond any more.'] },
          { if: { temp: { ftl_kk: 1 } }, match: ['daddy who', 'dad who', 'appa who', '아빠 누구', '아빠 누구야'], lines: [EN('Daddy who’s coming back…'), 'The water trembles. His face breaks into rings before the last word.',
              'The last word sinks, slowly, like a coin. Somewhere below the pond, someone catches it.', 'A tag floats up in its place: “FOUND — one punchline. Never delivered.”'], do: [{ set: { ftl_c_joke: true } }, { temp: { ftl_kk: 0 } }, { sfx: 'reveal' }] },
          { match: ['who s there', 'whos there', 'who is there', 'who there', '누구세요', '누구야'], lines: [EN('Daddy.'), 'He waits again. He was always good at waiting for the end of his own jokes.'], do: [{ temp: { ftl_kk: 1 } }] },
          { any: true, lines: [EN('No, no. You say “who’s there”. That’s how it goes.')] }] },
      { id: 'N1626', name: 'The Reflection of an Old Woman', look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#e8e0d0', '#c8c0b0', '#e0c0a0', '#c8c8c8'], acc: 'flower', alpha: 0.5 }), behavior: 'static', solid: true, at: [9, 17],
        lines: ['She whistles two notes to a blackbird that is not there.', KS('물 줬니? 내 꽃들, 물 줬어?', 'Have you watered them? My flowers — have you watered them?'), KS('울지 마. 할머니 여기 있어.', 'Don’t cry. Grandma’s right here.')] },
      { id: 'N1627', name: 'The Reflection of a Girl with a Map on Her Arm', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#c89068', '#1a1a1a'], eyes: 'line', alpha: 0.5 }), behavior: 'static', solid: true, at: [34, 17],
        lines: [EN('I moved. It wasn’t my idea. Nobody asks you, when you’re nine.'), EN('I drew the way back on my arm. It washed off in the new bath.')] },
      { id: 'N1628', name: 'A Frog on the Bank', look: { t: 'frog', c: ['#4a8a4a'] }, behavior: 'static', solid: false,
        lines: [EN('In the middle of the pond there is a ring that never closes. Whatever goes in there goes to where they are.'), EN('Nobody swims out there. Things that float, maybe.')] }],
    info: { summary: 'A still pond whose surface shows the people who left: a man with a suitcase, an old woman whistling, a girl with a map on her arm.',
      rules: ['The man with the suitcase tells a knock-knock joke: answer “who’s there”, then “daddy who”. The punchline sinks, and is claimed in the Cataloguer’s ledger.', 'A path climbs to the Night Garden (W136).'],
      secrets: ['Float out over the pond with the Forgotten Umbrella (E231) to the ring in the middle: it drops you Beneath the Pond (W317).'],
      lore: 'The father’s last joke, which never had an ending; the grandmother; Nour, who moved away.' } });
  link('W136', { to: 'W309', look: 'gate', lookOpt: { c: ['#3a4a5a'] }, label: 'a path down to a still pond' });

  /* ---------------------------------------------------------------
   *  W310 — The Nest of Hair Ties (top of the hollow tree)
   * --------------------------------------------------------------- */
  S({ id: 'W310', name: 'The Nest of Hair Ties', depth: 3, tier: 'mid', back: 'W307', backType: 'ladder', backLook: 'ladder', backLabel: 'down the ladder into the hollow tree', backAt: [16, 29], outdoor: true,
    map: (function () { var g = K.grid(34, 34, ' '); g.ellipse(16.5, 16.5, 16, 16, '_'); g.ellipse(16.5, 16.5, 14, 14, '.'); g.ellipse(16.5, 16.5, 7, 7, ','); return g.rows(); })(),
    look: { floor: { p: 'rug', c: ['#c08090', '#a86878', '#d8a040', '#8a6a9a'] }, floor2: { p: 'rug', c: ['#e8c0c8', '#d0a8b8', '#f0d8a0'] }, pit: { p: 'void', c: ['#a8c8e8'] } },
    style: { sky: ['#a8c8e8', '#e8f0f8'], cliffH: 0.8, cliff: '#6a4a3a' }, music: 'hairtienest', amb: { type: 'wind', vol: 0.07 },
    fall: { to: 'W320', arrive: 'fallspot' },
    place: [{ id: 'rhyme', type: 'decor', at: [20, 18], look: 'scraps', solid: false, lines: ['A scrap of squared paper woven into the nest, in a child’s writing:', KS('까치야 까치야, 헌 이 줄게 새 이 다오.', 'Magpie, magpie, I’ll give you my old tooth — give me a new one.')] },
      SOUL([EN('Children used to throw their milk teeth on the roof for the magpie. Then the roofs got higher.')])],
    decor: [{ look: 'trinket', n: 10, opt: { c: ['#f070a0'] }, solid: false, lines: ['A hair tie, pink, with two long black hairs still caught in it.', 'A velvet scrunchie, the kind worn under a nurse’s cap.', 'A ribbon from school-photo day.', 'A hair tie with a plastic cherry on it.'] },
      { look: 'egg', n: 3, opt: { c: ['#e8e8f0'] }, lines: ['An egg wrapped in a hair tie, to keep it warm.'] },
      { look: 'glint', n: 4, solid: false, lines: ['Something shiny the magpie has not made up its mind about yet.'] },
      { look: 'nest', n: 3, lines: ['A smaller nest inside the big one, made entirely of elastic bands.'] }],
    mech: [{ type: 'sayTo', ent: 'N1629', dist: 4, words: ['magpie magpie', '까치야', 'old tooth', 'new tooth', '헌 이', '새 이'], give: 'E235', reward: [{ set: { ftl_c_clip: true } }],
      wrong: 'The magpie tilts its head. That is not the song.', doneLine: 'The magpie is asleep on one leg, holding nothing.',
      winLines: ['The magpie listens to the whole rhyme with its eyes shut.', { t: 'Nobody has sung me that in years.', lang: 'en', who: 'The Magpie' },
        'It hops into the heap of hair ties and comes back with a small yellow hair clip.', 'It sets the clip at your feet. Then, after some thought, a milk tooth.',
        { t: 'The clip is yours. The tooth is a loan. Bring it back when you have a new one.', lang: 'en', who: 'The Magpie' }] }],
    npcs: [{ id: 'N1629', name: 'The Magpie', look: { t: 'bird', c: ['#16161c', 0, 0, '#2a2a34'], h: 16 }, behavior: 'static', solid: true, at: [16, 14], hearDist: 5,
        lines: [EN('My nest. Everything here fell out of somebody’s hair on the way to somewhere.'), EN('Children used to throw their milk teeth on the roof and sing to me. Nobody sings it now.'),
          EN('There is a yellow clip in here I am very fond of. I might give it back. For a song.'), EN('Don’t lean over the edge. Below the nest there is no tree any more. Only the end of the forest.')] },
      { id: 'N1630', name: 'A Fledgling Magpie', count: 2, look: { t: 'bird', c: ['#2a2a34', 0, 0, '#3a3a44'], h: 7 }, behavior: 'wander', radius: 3, speed: 0.8, solid: false,
        lines: [KS('깍깍!', 'Kkak-kkak!'), 'It tugs at your hair, very politely, then pretends it did not.'] }],
    info: { summary: 'A huge nest at the top of the hollow tree, woven from hair ties, ribbons and scrunchies, above the clouds.',
      rules: ['Sing the magpie the milk-tooth rhyme written on the scrap of paper (“magpie, magpie…”): it gives back a yellow hair clip, claimed in the Cataloguer’s ledger, and lends you the Milk Tooth (E235).'],
      secrets: ['Push against the edge of the nest for a while and you fall off — down to the Edge of the Forest (W320).'],
      lore: 'The Korean milk-tooth rhyme, and a yellow clip that belongs to a girl who does not speak.' } });

  /* ---------------------------------------------------------------
   *  W311 — The Cataloguer’s Hut
   * --------------------------------------------------------------- */
  S({ id: 'W311', name: 'The Cataloguer’s Hut', depth: 3, tier: 'hard', back: 'W301', backLook: 'door', backOpt: { style: 'wood', c: ['#6a4a2a'] }, backLabel: 'out into the forest', backAt: [12, 16],
    map: (function () {
      var g = K.grid(26, 18, ' '); g.box(0, 0, 26, 18, '#', '.');
      g.hline(2, 9, 2, '%'); g.hline(16, 23, 2, '%'); g.hline(2, 9, 5, '%'); g.hline(16, 23, 5, '%'); g.rect(9, 9, 8, 3, ',');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#6a4a2e', '#5a3e24', '#7a5638'] }, floor2: { p: 'rug', c: ['#7a3a30', '#6a2e26', '#c8a040'] }, wall: { p: 'flat', c: ['#2a1c10', '#1e140a'], topColor: '#2a1c10' },
      wallface: { p: 'panel', c: ['#8a6a44', '#6a4e30', '#4a3420'], skirt: '#2a1a0a' }, wall2: { p: 'wood', c: ['#5a3a20', '#4a2a14', '#6a4a2a'] } },
    tall: { '%': { look: 'bookcase' } }, style: { tallWalls: true, renderer: 'sepia' }, music: 'cataloguer', amb: { type: 'pages', vol: 0.05 }, dark: 0.3,
    doors: [{ id: 'unclaimed', to: 'W318', at: [12, 1], look: 'door', opt: { style: 'wood', c: ['#3a2a1a'], symbol: '?' }, cond: { flag: ['ftl_ledger'].concat(CLAIMS) },
        locked: 'A narrow door marked UNCLAIMED. It opens for someone who has answered the ledger and claimed all five things.', label: 'the door marked UNCLAIMED' },
      { id: 'drawerdoor', to: 'W312', at: [3, 14], look: 'hatch', cond: { flag: 'ftl_drawer' }, arrive: 'back', label: 'the bottom drawer, marked “words”, which goes down too far', secret: true }],
    place: [{ id: 'ledger', type: 'decor', at: [12, 10], look: 'table', lookOpt: { cloth: '#e8dcc0' }, light: 2, lines: ['The ledger, open on the table.'] },
      { id: 'cardindex', type: 'decor', at: [3, 12], look: 'drawer', lines: ['A card index, one drawer per letter. Drawer S is stuck.', 'Cards like these only come out for the name written on them.'] },
      SOUL([EN('Ninety days, then it goes down to the shelf. Ninety years, then it stops waiting.')])],
    decor: [{ look: 'jar', n: 4, lines: ['A jar labelled “LAUGHS, MISC.” It is very light.', 'A jar labelled “SLEEP — NIGHT SHIFTS — 2008 TO”. The label goes round and round the jar.', 'A jar labelled “SUNDAYS”. Empty, but warm.'] },
      { look: 'lantern', n: 2, light: 2, lines: ['A lantern. Its light has the colour of old paper.'] },
      { look: 'clipboard', n: 1, lines: ['A clipboard: “Today: 3 umbrellas, 9 single shoes, 1 birthday, 1 child (see below).” Below: nothing.'] },
      { look: 'glassespile', n: 1, lines: ['A heap of spectacles nobody came back for. She wears a different pair every day.'] }],
    mech: [{ type: 'quiz', mark: 'ledger', intro: ['The ledger lies open at a page headed “UNCLAIMED”. The Cataloguer taps it with her pencil.', { t: 'Procedure. Four questions first, then you may claim things.', lang: 'en', who: 'The Cataloguer' }],
        questions: [{ q: 'In the river, how do the shoes leave?', choices: ['Alone', 'In pairs', 'They never leave'], right: 1 },
          { q: 'Which number opens every door in the hollow tree?', choices: ['404', '1204', '2371'], right: 1 },
          { q: 'When a magpie calls, who is supposed to come?', choices: ['A guest', 'The rain', 'Nobody'], right: 0 },
          { q: 'What must a lost child do?', choices: ['Run home', 'Stay where she is', 'Shout'], right: 1 }],
        failLine: 'She shakes her head and turns back a page. Lost things are patient. So is she.', doneLine: 'The page says SEEN, in red, slightly crooked.',
        reward: [{ set: { ftl_ledger: true } }, { cookie: 1 }], done: { flag: 'ftl_ledger' },
        winLines: ['Four ticks in pencil. She stamps the page: SEEN.', { t: 'You were paying attention. Nobody pays attention.', lang: 'en', who: 'The Cataloguer' }] },
      { type: 'sayTo', mark: 'cardindex', dist: 3, words: ['sora', '소라'], reward: [{ set: { ftl_drawer: true } }], done: { flag: 'ftl_drawer' },
        winLines: ['You say your own name to the card index. Drawer S slides open by itself.', 'One card: “SORA. Found: here. Left by: — . Claimed by: — .” The last two lines are empty.', 'At the bottom of the cabinet, the drawer marked “words” has opened too.', 'It goes down much further than a drawer should.'] }],
    npcs: [{ id: 'N1631', name: 'The Cataloguer', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#7a6a5a', '#5a4a3a', '#e8d0b8', '#d8d8d8'], acc: 'clipboard' }), behavior: 'static', solid: true, at: [14, 10],
        lines: [EN('Everything left behind in this forest comes through my door. I write it down. Somebody has to.'),
          { t: function () { var n = CLAIMS.filter(function (f) { return YN.save.flag(f); }).length; return { t: 'My ledger owes a quiet girl five things: a birthday, a mitten, a punchline, a clip, a word. ' + n + ' claimed.', lang: 'en' }; } },
          EN('Every card in that cabinet comes out for its own name. Say the name and the card comes out. Even yours.'), EN('The ledger first. Nobody claims anything here without answering the ledger.'),
          { if: { flag: ['ftl_ledger'].concat(CLAIMS) }, t: 'She takes off her glasses, which she does not need, and nods at the narrow door at the back.' }] },
      { id: 'N1632', name: 'The Cataloguer’s Cat', look: { t: 'cat', c: ['#8a8a90'] }, behavior: 'static', solid: true, at: [20, 12], appearHere: { flag: 'ftl_cat_home' },
        lines: ['A fat grey cat asleep on the in-tray. Its collar tag says: “FOUND — and kept.”'] }],
    info: { summary: 'A hut lined with shelves, jars and card indexes, where an old woman writes down everything the forest keeps.',
      rules: ['Answer the ledger’s four questions (the answers are in the river, the hollow tree and the central clearing) to be allowed to claim.', 'Claim the five things that belong to the girl — the birthday (W304), the mitten (W308), the punchline (W309), the hair clip (W310), the word (W312) — and the door marked UNCLAIMED opens onto the Unclaimed Shelf (W318).'],
      secrets: ['Say her name, “Sora”, to the card index: drawer S opens, and the drawer marked “words” becomes a way down to the Mushrooms of Unsaid Words (W312).', 'Once the grey cat from the Path of Lost Pets has been caught, it sleeps here.'],
      lore: 'Someone who keeps count of what is left behind, including children.' } });

  /* ---------------------------------------------------------------
   *  W312 — The Mushrooms of Unsaid Words
   * --------------------------------------------------------------- */
  S({ id: 'W312', name: 'The Mushrooms of Unsaid Words', depth: 3, tier: 'hard', back: 'W306', backLook: 'hole', backLabel: 'back up to the field of letters', backAt: [6, 30],
    map: (function () {
      var g = K.grid(48, 36, '#');
      g.ellipse(24, 18, 9, 6, '.'); g.ellipse(8, 28, 5, 4, '.'); g.ellipse(40, 8, 5, 4, '.'); g.ellipse(9, 8, 4, 3, '.'); g.ellipse(39, 28, 5, 3, '.');
      g.path(8, 28, 24, 18, '.', 2); g.path(24, 18, 40, 8, '.', 2); g.path(9, 8, 24, 18, '.', 2); g.path(24, 18, 39, 28, '.', 2);
      return g.rows();
    })(),
    look: { floor: { p: 'moss', c: ['#1e2a2a', '#182222', '#243232', '#141c1c'] }, wall: { p: 'rock', c: ['#141a1c', '#0e1214', '#1c2426'] } },
    style: { renderer: 'watercolor' }, music: 'unsaidwords', amb: { type: 'whispers', vol: 0.04 }, dark: 0.65, weather: { motes: true },
    doors: [{ to: 'W317', type: 'hole', at: [41, 7], look: 'crack', cond: { any: [{ said: 'goodbye' }, { said: '잘 가' }, { said: '안녕히' }] }, arrive: 'back', label: 'a crack in the floor where words go down', secret: true }],
    decor: [{ look: 'mushroom', n: 14, opt: { c: ['#8ab0c8'] }, light: 1.2, solid: false, lines: ['A mushroom that glows faintly. Under its cap, very small, a word: “sorry”.', 'A mushroom with “thank you” written under the cap. It has been there since a funeral.',
        'A tiny mushroom: “stay”.', 'A big bruised mushroom: “I didn’t mean it”.', 'A mushroom: “come back”. It leans towards the way out.'] },
      { look: 'tuft', n: 6, solid: false, lines: ['Moss growing over something that was nearly said.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — words, unsaid, assorted. Fragile.”'] }],
    mech: [{ type: 'echo', zone: [16, 13, 32, 23], words: ['sorry', 'thank you', 'goodbye', 'come back', 'stay', 'i miss you'], reward: [{ set: { ftl_c_word: true } }], done: { flag: 'ftl_c_word' },
      winLines: ['You say it back. Every mushroom in the grotto lights up at once.', 'They are the colour of a word that has finally been used.', 'It was a small word. It had been waiting under the moss for a very long time, for one particular person.', 'A tag drifts down from the ceiling: “FOUND — one word, unsaid. To: 할머니.”'] }],
    npcs: [{ id: 'N1633', name: 'A Mushroom Who Was a Word', look: { t: 'mushroom', c: ['#c8a0d0'] }, behavior: 'static', solid: true,
        lines: [EN('Speak in the big grotto. The cave answers with the word you didn’t say. Say it back.'), EN('Some words go all the way down if you finally say them. Goodbye, mostly. Goodbye goes deepest.'), EN('I was “sorry”. Then I waited so long I became a mushroom.')] },
      { id: 'N1634', name: 'A Listening Moth', count: 3, look: { t: 'moth', c: ['#d8d0e8'], h: 8 }, behavior: 'fly', radius: 5, speed: 0.8, solid: false, lines: ['A pale moth that lands on your lips, waits, then flies off disappointed.'] },
      { id: 'N1635', name: 'A Voice Under the Moss', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 14,
        ambientLines: [EN('…sorry.'), EN('…I should have called.'), KS('…고마웠어요. 다 고마웠어요.', '…Thank you. For everything.'), KS('…가지 마.', '…Don’t go.')] }],
    place: [SOUL([EN('She never said goodbye to her grandmother. She was at school. The word has been down here ever since.')])],
    info: { summary: 'Dark caves where mushrooms grow over the words people meant to say and never did.',
      rules: ['Speak inside the big central grotto: the echo answers with an unsaid word. Say that word back to claim it for the Cataloguer’s ledger.'],
      secrets: ['Saying “goodbye” anywhere in the dream opens a crack in the north-east cave, which drops you Beneath the Pond (W317).'],
      lore: 'The goodbye Sora never said to her grandmother, and the silence after it.' } });

  /* ---------------------------------------------------------------
   *  W313 — The Pick-Up Point in the Rain
   * --------------------------------------------------------------- */
  S({ id: 'W313', name: 'The Pick-Up Point in the Rain', depth: 3, tier: 'hard', back: 'W302', backLook: 'gate', backOpt: { c: ['#8a8a90'] }, backLabel: 'back to the umbrellas', backAt: [23, 27], outdoor: true,
    map: (function () {
      var g = K.grid(46, 30, '^'); g.rect(1, 1, 44, 28, '.');
      g.rect(1, 4, 44, 4, ','); g.hline(1, 44, 8, ':'); g.hline(14, 31, 16, 'f'); g.set(22, 16, '.'); g.set(23, 16, '.');
      return g.rows();
    })(),
    look: mossy({ floor2: { p: 'asphalt', c: ['#34343c'] }, floor3: { p: 'concrete', c: ['#7a7a7c'] } }), tall: TREES,
    style: { sky: ['#3a4250', '#6a7282'] }, music: null, amb: { type: 'rain', vol: 0.1 }, dark: 0.45, weather: { rain: true },
    doors: [{ to: 'W316', at: [23, 5], look: 'train', opt: { c: ['#e8c030', '#2a2a2a'] }, cond: { flag: 'ftl_bus' }, label: 'the yellow night shuttle, doors folded open', secret: true },
      { to: 'W305', at: [13, 16], look: 'hole', cond: { equipped: 'E233' }, label: 'the gap under the fence where children hide when nobody comes', secret: true }],
    decor: [{ look: 'bench', n: 2, lines: ['The bench of the bus shelter. Wet everywhere except two small dry patches.'] },
      { look: 'puddle', n: 6, solid: false, lines: ['A puddle with a headlight in it, coming closer, never arriving.'] },
      { look: 'streetlamp', n: 2, light: 2, lines: ['A street lamp at the edge of the forest. It hums.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag on the fence: “FOUND — children, assorted. Collect before dark.”'] }],
    mech: [{ type: 'bellRing', every: 30, under: 8 },
      { type: 'reach', zone: [2, 8, 43, 8], cond: { remainingMod: { every: 30, under: 8 } }, failLine: 'Headlights slide past without slowing. It only stops while the bell is ringing.',
        reward: [{ set: { ftl_bus: true } }], done: { flag: 'ftl_bus' },
        winLines: ['The bell is still ringing when your foot touches the kerb.', 'A yellow shuttle pulls up out of the rain and folds its doors open.', 'The driver has a cap and no face. On the dashboard, a card: “LAST RUN — HOME”.'] }],
    npcs: [{ id: 'N1636', name: 'A Girl with a Yellow Bag', look: H({ t: 'kid', hairStyle: 'long', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1010'], acc: 'bag', eyes: 'down' }), behavior: 'static', solid: true, at: [18, 10],
        lines: [KS('엄마가 비 오면 우산 갖고 온댔어.', 'Mum said she’d bring an umbrella if it rained.'), KS('다른 엄마들은 다 왔어. 우리 엄마는 일해.', 'All the other mums came. My mum’s at work.'),
          KS('종 치면 버스가 서. 그때 딱 서 있어야 돼. 늦으면 그냥 가.', 'When the bell rings, the bus stops. You have to be right there then. If you’re late it just goes.')] },
      { id: 'N1637', name: 'A Boy Who Pretends Not to Wait', look: H({ t: 'kid', body: 'shirt', c: ['#5a6a3a', '#4a5a2a', '#e8c8a8', '#1a1a1a'], eyes: 'line' }), behavior: 'static', solid: true, at: [27, 10],
        lines: [EN('I’m not waiting. I just like standing here. In the rain. For two hours.'), EN('The bus only stops while the bell goes. Step on the kerb then. Not before, not after.'),
          EN('When nobody comes, you can hide under the fence. Only with your eyes covered. Then it lets you through.')],
        reacts: { E231: { lines: ['You hold the umbrella over him. He pretends not to notice. He moves a little closer.', EN('…Thanks. Don’t tell anyone.')] } } },
      { id: 'N1638', name: 'A Mother with an Umbrella', count: 3, look: H({ t: 'adult', hairStyle: 'short', body: 'coat', c: ['#8a6a6a', '#6a4a4a', '#e0c8b0', '#2a1a1a'], acc: 'umbrella', alpha: 0.6 }), behavior: 'wander', radius: 5, speed: 1.4, solid: false, passThrough: true,
        lines: [KS('지민아! 여기야!', 'Ji-min! Over here!'), KS('빨리 와, 감기 걸려.', 'Hurry up, you’ll catch a cold.'), 'A mother with an umbrella, hurrying to collect somebody else.'] }],
    place: [SOUL([KS('비 오는 날 우산 없는 애들은 늘 같은 애들이야.', 'On rainy days, the children without umbrellas are always the same ones.')])],
    info: { summary: 'A school gate at the edge of the forest, in the rain: children with bags wait for mothers with umbrellas, and a night shuttle passes without stopping.',
      rules: ['A bell rings every thirty seconds. Step onto the kerb while it is ringing: the yellow night shuttle stops and opens its doors to the Birches of Fridge Notes (W316).'],
      secrets: ['With Counting Hands (E233) equipped, the gap under the fence at the left end opens: back to the Thicket of Unburied Toys (W305).'],
      lore: 'Hagwon nights and rainy afternoons; the children whose mothers are at work.' } });

  /* ---------------------------------------------------------------
   *  W314 — The Path of Lost Pets
   * --------------------------------------------------------------- */
  S({ id: 'W314', name: 'The Path of Lost Pets', depth: 3, tier: 'mid', back: 'W301', backLook: 'gate', backOpt: { c: ['#7a5a3a'], open: true }, backLabel: 'back to the forest', backAt: [3, 25], outdoor: true,
    map: (function () {
      var g = K.grid(56, 30, '^');
      g.rect(2, 24, 12, 3, '.'); g.rect(6, 6, 3, 20, '.'); g.rect(6, 6, 20, 3, '.'); g.rect(23, 6, 3, 18, '.'); g.rect(23, 21, 22, 3, '.'); g.rect(42, 4, 3, 20, '.'); g.rect(42, 4, 12, 3, '.');
      g.rect(9, 14, 8, 1, '.'); g.rect(26, 12, 10, 1, '.'); g.rect(30, 24, 1, 4, '.'); g.rect(45, 12, 4, 1, '.'); g.ellipse(50, 12, 3, 3, '.');
      return g.rows();
    })(),
    look: mossy({ floor: { p: 'path', c: ['#7a6a4a', '#6a5a3e', '#8a7a58'] } }), tall: TREES,
    style: { renderer: 'watercolor', sky: ['#9a9a8a', '#d0d0c0'] }, music: 'lostpets', amb: { type: 'birds', vol: 0.04 },
    doors: [{ to: 'W308', at: [52, 5], look: 'hole', cond: { flag: 'ftl_cat_home' }, arrive: 'back', label: 'the gap in the hedge where the grey cat went through', secret: true },
      { to: 'W313', at: [51, 11], look: 'gate', opt: { c: ['#8a8a90'] }, cond: { equipped: 'E233' }, arrive: 'back', label: 'a dog lead tied to a bus stop, in the rain', secret: true }],
    decor: [{ look: 'telepole', n: 5, lines: ['A post covered in posters: “LOST — CAT, GREY, ANSWERS TO NOTHING.”', 'A poster: “LOST — DOG, OLD, FRIENDLY. HE WAITED AT THE DOOR EVERY EVENING.”', 'A poster: “LOST — TORTOISE. SLOW. PLEASE HURRY.”', 'A poster, faded white. Only the word “REWARD” is left.'] },
      { look: 'puddle', n: 3, solid: false, lines: ['A water bowl, full. Somebody still fills it.'] },
      { look: 'tuft', n: 6, solid: false, lines: ['A tuft of grey fur caught on a bramble.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — a collar with a bell. The bell still rings for dinner.”'] }],
    mech: [{ type: 'corner', ent: 'N1641', reward: [{ set: { ftl_cat_home: true } }], done: { flag: 'ftl_cat_home' },
      winLines: ['The grey cat has nowhere left to run. It sits down, as if that had been its idea all along.', 'It lets you read its collar:', '“IF FOUND, BRING TO THE HUT. SHE KEEPS EVERYTHING.”', 'It trots off towards the hut without you.', 'The gap in the hedge it slips through, at the end of the path, stays open.'] }],
    npcs: [{ id: 'N1639', name: 'The Dog with a Broken Lead', look: { t: 'dog', c: ['#a08060'] }, behavior: 'static', solid: true, at: [50, 13], appearHere: { equipped: 'E233' },
        lines: [EN('You covered your eyes. Good. I only come out when nobody is looking for me.'), EN('I know where the children wait. I wait with them, sometimes. Through the gate behind me.')] },
      { id: 'N1640', name: 'A Goldfish in a Bag', look: { t: 'fish', c: ['#f08030'] }, behavior: 'static', solid: false, at: [11, 25],
        lines: [EN('Won at a fair. Forgotten on a bench. It’s fine. The bag is very nice.'), EN('The old dog only shows himself to those who aren’t looking. Cover your eyes, he says. Odd dog.')] },
      { id: 'N1641', name: 'The Grey Cat', look: { t: 'cat', c: ['#8a8a90'] }, behavior: 'flee', fleeDist: 4, radius: 8, speed: 2.6, solid: true, at: [34, 12],
        lines: ['A grey cat. It looks at you exactly the way a cat looks at someone who wants to pick it up.'] },
      { id: 'N1642', name: 'A Budgie Off Its Poster', look: { t: 'bird', c: ['#60c060', 0, 0, '#e8c040'], h: 7 }, behavior: 'fly', radius: 6, speed: 1.4, solid: false,
        lines: [EN('Answers to Kiwi. Does not answer.'), EN('The grey one runs. Walk it into a dead end, slowly. That’s the only way anyone ever caught it.')] }],
    place: [SOUL([EN('A dog that waited at the door every evening still waits. The door is what moved.')])],
    info: { summary: 'A long path through the trees lined with “LOST” posters, walked by the pets nobody found.',
      rules: ['Corner the grey cat in one of the path’s dead ends: it lets you read its collar and goes home to the Cataloguer’s hut; the gap it slips through leads to the Moss of Lost Gloves (W308).'],
      secrets: ['With Counting Hands (E233) equipped, the old dog appears in the little glade and a gate opens onto the Pick-Up Point in the Rain (W313).'],
      lore: 'Pets that waited at doors, and families that moved without them.' } });

  /* ---------------------------------------------------------------
   *  W315 — The Clearing Where Lamps Go
   * --------------------------------------------------------------- */
  var LAMPS = [0, 1, 2, 3, 4, 5, 6].map(function (i) { var a = -Math.PI / 2 + i * Math.PI * 2 / 7; return [Math.round(20.5 + Math.cos(a) * 12), Math.round(15.5 + Math.sin(a) * 9)]; });
  S({ id: 'W315', name: 'The Clearing Where Lamps Go', depth: 3, tier: 'hard', back: 'W301', backLook: 'streetlamp', backOpt: { off: true }, backLabel: 'back to the forest', backAt: [20, 28], outdoor: true,
    map: (function () { var g = K.grid(42, 32, '^'); g.ellipse(20.5, 15.5, 19, 14, '.'); g.ellipse(20.5, 15.5, 6, 5, ','); return g.rows(); })(),
    look: mossy({ floor: { p: 'grass', c: ['#1e2a24', '#18221e', '#24322a', '#141c18'] }, floor2: { p: 'moss', c: ['#2a3a30', '#22322a', '#324238'] } }), tall: TREES,
    style: { stars: true, sky: ['#05060c', '#101420'] }, music: 'switchedlamps', amb: { type: 'crickets', vol: 0.05 }, dark: 0.85,
    doors: [{ to: 'W319', at: [33, 6], look: 'candle', cond: { equipped: 'E232' }, arrive: 'back', label: 'a low door beside a candle nobody blew out', secret: true }],
    place: LAMPS.map(function (p, i) { return { id: 'lp' + i, type: 'decor', at: p, look: i % 2 ? 'lamp' : 'streetlamp', lookOpt: { off: true }, lines: ['A lamp, switched off.'] }; }).concat([
      SOUL([KS('불 꺼 줄게. 자.', 'I’ll turn the light off for you. Sleep.')])]),
    decor: [{ look: 'lamp', n: 5, opt: { off: true }, lines: ['A bedside lamp in the grass, its cord trailing off into the dark. Switched off.', 'A desk lamp, bent down over a homework book that is not there.'] },
      { look: 'lantern', n: 3, opt: { off: true }, lines: ['A paper lantern, unlit, still warm.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — the light. Switched off at 23:40 by someone who loved you.”'] }],
    mech: [{ type: 'lampsAll', lamps: LAMPS.map(function (p, i) { return 'lp' + i; }), time: 25, light: 2.6, reward: [{ set: { ftl_lamps: true } }, { cookie: 1 }], done: { flag: 'ftl_lamps' },
      litLines: ['The lamp comes on. The grass around it remembers its colour.', 'Another lamp. Somewhere in the dark, a click: someone has switched one off again.', 'It comes on, a little yellow, like a bedroom at three in the morning.'],
      onLine: 'This one is already on.', doneLine: 'The lamps stay on. Nobody comes to switch them off.',
      winLines: ['All seven lamps burn at once. For the first time, nobody comes to switch them off.', 'In the middle of the clearing, someone has left a biscuit on a saucer, for whoever stayed up.'] }],
    npcs: [{ id: 'N1643', name: 'The One Who Switches Off', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#2a2a3a', '#1a1a2a', '#d8c8b0', '#000000'], eyes: 'closed' }), behavior: 'wander', radius: 8, speed: 0.8, solid: true,
        lines: [EN('Lights out. Lights out. Everybody has work in the morning.'), KS('불 끄고 자.', 'Turn the light off and go to sleep.'), 'Her hand finds every switch in the dark, without looking, the way tired hands do.'] },
      { id: 'N1644', name: 'A Bedside Lamp', look: { t: 'lamp' }, behavior: 'static', solid: true,
        lines: [EN('I was on every night for a year. Then one night a hand switched me off, gently, and I came here.'), EN('It wasn’t a punishment. She thought you were asleep.'), EN('Light all seven of us before she comes round again. She is quick.')] },
      { id: 'N1645', name: 'A Moth', count: 4, look: { t: 'moth', c: ['#c8b8a0'], h: 8 }, behavior: 'fly', radius: 6, speed: 1.2, solid: false, lines: ['A moth circling a lamp that is off, out of habit.'] }],
    info: { summary: 'A dark clearing where every lamp ever switched off at night comes to stand in the grass.',
      rules: ['Only reachable when the lamp in the real bedroom is off (from the central forest) or through a crack in the Moss of Lost Gloves.', 'Light the seven lamps in the ring (interact) before they are switched off again (25 seconds each): a biscuit is left out for you.'],
      secrets: ['With the Unblown Candle (E232) equipped, a low door appears beside a candle in the north-east: down to the Burrow of Lost Sleep (W319).'],
      lore: 'The bedroom lamp the mother switches off while her daughter pretends to sleep.' } });

  /* ---------------------------------------------------------------
   *  W316 — The Birches of Fridge Notes
   * --------------------------------------------------------------- */
  var NOTES = [KS('밥 먹어. 냉장고에 있어.', 'Eat. It’s in the fridge.'), KS('문 꼭 잠가.', 'Make sure you lock the door.'), KS('숙제 하고 일찍 자.', 'Do your homework and go to bed early.'),
    KS('엄마 오늘 늦어. 미안해.', 'Mum is late today. Sorry.'), KS('사랑해. 괜찮아.', 'I love you. It’s all right.')];
  S({ id: 'W316', name: 'The Birches of Fridge Notes', depth: 3, tier: 'mid', back: 'W306', backLook: 'gate', backOpt: { c: ['#e8e4dc'], open: true }, backLabel: 'back to the field of letters', backAt: [24, 34], outdoor: true,
    gen: { type: 'forest', w: 60, h: 44, opts: { density: 0.22, border: true, grass: '"' }, post: joined, stamps: [{ at: [19, 31], piece: K.grid(11, 6, '.').rows() }] },
    look: mossy({ floor: { p: 'leaves', c: ['#c8b880', '#b8a870', '#d8c890', '#a89860'] }, leafg: { p: 'leaves', c: ['#d8c070', '#c8a850', '#e8d890'] } }),
    tall: { '^': { look: 'tree', opt: { c: ['#e0c860', '#c8a840', '#e8e4dc', '#f0e090'] } } },
    style: { renderer: 'watercolor', sky: ['#e0e4e8', '#f8f8f4'] }, music: 'fridgebirches', amb: { type: 'fridge', vol: 0.05 },
    doors: [{ to: 'W319', look: 'door', opt: { style: 'wood', c: ['#8a7a6a'], symbol: '1204' }, cond: { equipped: 'E234' }, arrive: 'back',
      locked: 'A front door standing on its own between two birches. No wall, no house. Locked. The number on it: 1204.', label: 'a front door that lost its house' }],
    place: NOTES.map(function (n, i) { return { id: 'note' + i, type: 'decor', at: 'random-any', look: 'scraps', lines: ['A yellow note stuck to the bark with a magnet that has nothing to hold on to:', n] }; }).concat([
      SOUL([EN('Five notes on the fridge, every night. She read them standing up, with her coat still on.')])]),
    decor: [{ look: 'trinket', n: 4, opt: { c: ['#e04040'] }, solid: false, lines: ['A fridge magnet shaped like a strawberry, stuck to a birch.', 'A magnet from a seaside town nobody in the family has been to.'] },
      { look: 'crumbs', n: 3, solid: false, lines: ['Crumbs on a paper towel: dinner, eaten standing up.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — notes from Mum. Every one of them read.”'] }],
    mech: [{ type: 'visitAll', marks: NOTES.map(function (n, i) { return 'note' + i; }), countText: 'Notes read # / %', reward: [{ set: { ftl_notes: true } }, { cookie: 1 }], done: { flag: 'ftl_notes' },
      winLines: ['All the notes, read. On the last birch, a sixth note that was not there before, in the same hurried writing:', KS('오늘은 엄마가 일찍 올게. 진짜로.', 'Today Mum will come home early. Really.'), 'The date on it is tomorrow’s.'] }],
    npcs: [{ id: 'N1646', name: 'The Lady from Downstairs', look: H({ t: 'old', hairStyle: 'bun', body: 'sweater', c: ['#a87a8a', '#8a5a6a', '#e0c0a0', '#c8c8c8'] }), behavior: 'wander', radius: 3, speed: 0.6, solid: true,
        lines: [KS('또 혼자니? 밥은 먹었어?', 'On your own again? Have you eaten?'), KS('너희 엄마 고생한다. 너도 고생하고.', 'Your mum works so hard. You do too.'), KS('무슨 일 있으면 아래층으로 와. 알았지?', 'If anything happens, come downstairs. All right?')] },
      { id: 'N1647', name: 'A Ladybird Magnet', look: { t: 'ant', c: ['#c02020'], h: 6 }, behavior: 'wander', radius: 3, speed: 0.5, solid: false,
        lines: ['A ladybird magnet climbing a birch on its own. It has dropped its note somewhere.'] }],
    info: { summary: 'A wood of white birches whose bark is covered in the notes a mother leaves on the fridge.',
      rules: ['Read the five notes stuck to the birches: a sixth one appears, with a biscuit.', 'The yellow night shuttle from the Pick-Up Point in the Rain stops here.'],
      secrets: ['A front door numbered 1204 stands alone among the trees; with the Latchkey on a Shoelace (E234) equipped it opens onto the Burrow of Lost Sleep (W319).'],
      lore: 'Love in five short sentences, written in a hurry before a night shift.' } });

  /* ---------------------------------------------------------------
   *  W317 — Beneath the Pond (P4)
   * --------------------------------------------------------------- */
  S({ id: 'W317', name: 'Beneath the Pond', depth: 4, tier: 'hard', back: 'W309', backLook: 'ladder', backLabel: 'up through the surface', backAt: [20, 2],
    map: (function () {
      var g = K.grid(40, 30, '#'); g.rect(1, 1, 38, 28, '.');
      [[8, 6], [16, 10], [28, 7], [33, 15], [14, 20], [24, 22], [31, 24]].forEach(function (p) { g.rect(p[0], p[1], 2, 2, '{'); });
      carveMaze(g, 1, 17, 4, 5, 'x', '.', 317, 0.1); g.set(8, 17, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'sand', c: ['#1e3448', '#182c40', '#26405a'] }, wall: { p: 'rock', c: ['#08121c', '#040a10', '#101e2c'] } },
    tall: { '{': { look: 'coral', opt: { c: ['#6a8aa8'] } } },
    style: { renderer: 'watercolor', sky: ['#0a1830', '#1a3050'] }, music: 'beneathpond', amb: { type: 'underwater', vol: 0.08 }, dark: 0.5, weather: { motes: true },
    doors: [{ to: 'W320', at: [37, 27], look: 'hole', cond: { flag: 'ftl_father_seen' }, arrive: 'fallspot', label: 'a current pulling towards a white edge', secret: true }],
    place: [{ id: 'farfigure', type: 'decor', at: [26, 16], look: 'ghostfig', lookOpt: { c: ['rgba(200,210,240,0.55)'] }, solid: false, lines: ['A man with a suitcase, seen from behind, looking up at the surface.'] },
      { id: 'sunkencase', type: 'decor', at: [2, 26], look: 'suitcase', lines: ['A suitcase marked “J.”, sunk in the sand.', 'Inside, folded very small: fourteen drawings of a garden, in crayon.', 'They were never posted. They were never asked for, either.'], use: [{ secret: 'ftl_suitcase' }] },
      SOUL([EN('From down here the surface is a window. The girl on the bank is the one who left.')])],
    decor: [{ look: 'shell', n: 4, solid: false, lines: ['A shell. Inside, instead of the sea, a voice saying “tomorrow” over and over.'] },
      { look: 'coin', n: 5, solid: false, lines: ['A coin thrown into the pond for a wish. Heads up. The wish is still waiting.'] },
      { look: 'reeds', n: 4, solid: false, lines: ['Reeds seen from underneath: roots, and a lot of patience.'] }],
    mech: [{ type: 'recede', mark: 'farfigure', dist: 8, reward: [{ set: { ftl_father_seen: true } }, { cookie: 1 }], done: { flag: 'ftl_father_seen' },
      winLines: ['You get close to him without looking at him, sideways, the way you approach a bird.', 'He is holding a word that drips with pond water. He says it to the surface, where a girl is standing.',
        { t: '…tomorrow.', lang: 'en', who: 'A Man with a Suitcase' }, 'He does not know you are behind him.', 'Then he is only a shape in the water, and a current opens towards the white.'] }],
    npcs: [{ id: 'N1648', name: 'The Grandmother, Below', look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#c8d0e0', '#a8b0c0', '#d8c0a8', '#e0e0e0'], alpha: 0.6 }), behavior: 'static', solid: true, at: [12, 4],
        lines: [KS('여기선 다 보여. 네가 물 주는 것도.', 'From down here I can see everything. Even you watering.'), EN('He backs away when you look at him. Push him into a corner with your eyes, then go to him sideways.')] },
      { id: 'N1649', name: 'A Girl Who Moved, Below', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#5a7a9a', '#4a6a8a', '#c89068', '#1a1a1a'], eyes: 'line', alpha: 0.6 }), behavior: 'static', solid: true, at: [33, 4],
        lines: [EN('I can see your pond from my new town. You’re always on the bank.'), EN('Nobody told me you stopped talking. I would have written slower.')] },
      { id: 'N1650', name: 'A Carp Who Keeps Wishes', look: { t: 'fish', c: ['#e8a040'], h: 14 }, behavior: 'fly', radius: 6, speed: 0.6, solid: false,
        lines: [EN('Every coin is a wish. I keep them under me. They are warm.'), EN('There is a suitcase in the far corner, behind the currents you can’t see. Feel your way.')] }],
    info: { summary: 'The underside of the pond, where the people who left stand on the sand and look up at the surface.',
      rules: ['The man with the suitcase backs away when you look at him. Drive him into a corner by looking, then reach him sideways: he says the last word, and a current opens to the Edge of the Forest (W320).'],
      secrets: ['Invisible currents form a maze in the south-west corner; at its end, the sunken suitcase marked “J.”.'],
      lore: 'The other side of leaving: the father who says “tomorrow” to a girl who cannot hear him.' } });

  /* ---------------------------------------------------------------
   *  W318 — The Unclaimed Shelf (P4, behind the hut)
   * --------------------------------------------------------------- */
  S({ id: 'W318', name: 'The Unclaimed Shelf', depth: 4, tier: 'hard', back: 'W311', backLook: 'door', backOpt: { style: 'wood', c: ['#3a2a1a'] }, backLabel: 'back into the hut', backAt: [2, 25],
    map: (function () {
      var g = K.grid(36, 28, ' '); g.box(0, 0, 36, 28, '#', '.');
      for (var y = 3; y <= 12; y += 3) { g.hline(2, 15, y, '%'); g.hline(20, 33, y, '%'); }
      g.hline(4, 31, 16, 'u'); g.set(17, 16, '.'); g.set(18, 16, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#2a2018', '#221a12', '#32281e'] }, wall: { p: 'flat', c: ['#0a0806', '#060402'], topColor: '#0a0806' }, wallface: { p: 'panel', c: ['#3a2a1a', '#2a1e12', '#1a120a'], skirt: '#0a0604' },
      wall2: { p: 'wood', c: ['#3a2818', '#2a1c10', '#4a3420'] }, counter: { p: 'wood', c: ['#5a3a20', '#4a2a14', '#6a4a2a'] } },
    tall: { '%': { look: 'bookcase' } }, style: { tallWalls: true, renderer: 'engraving' }, music: 'unclaimed', amb: { type: 'clock', vol: 0.04 }, dark: 0.6,
    extra: { compass: 'clockdoor', noFurnish: true },
    doors: [{ id: 'clockdoor', to: 'W301', at: [34, 1], look: 'door', opt: { style: 'wood', c: ['#d8e0e8'] }, cond: { realHour: [7, 8] }, label: 'a back door with a nurse’s tunic on the hook, still warm: out into the forest at dawn', secret: true }],
    place: [[9, 23], [18, 24], [27, 23]].map(function (p, i) { return { id: 'box' + i, type: 'decor', at: p, look: 'crate', lines: ['A cardboard box with your name on it, in somebody else’s handwriting.'] }; }).concat(
      [[9, 19], [18, 19], [27, 19]].map(function (p, i) { return { id: 'pl' + i, type: 'plate', at: p, look: 'chalkmark', solid: false, lines: ['A chalk square on the floor in front of the counter: CLAIMED.'] }; }),
      [{ type: 'decor', at: [21, 17], look: 'bell', lines: ['A bell on the counter, the kind you ring when nobody is there to serve you.'] },
        SOUL([EN('Most things on these shelves were not lost. They were left. It is a different shelf.')])]),
    decor: [{ look: 'suitcase', n: 3, solid: false, lines: ['A suitcase on the floor between the shelves. Unclaimed since 2020.'] },
      { look: 'plush', n: 2, opt: { dust: true }, solid: false, lines: ['A plush toy under a dust sheet, ears showing.'] },
      { look: 'trinket', n: 4, opt: TAG, solid: false, lines: ['A tag: “UNCLAIMED — a father’s Sundays. 2019.”', 'A tag: “UNCLAIMED — a mother’s day off, never taken.”', 'A tag: “UNCLAIMED — one childhood, partly used.”'] }],
    mech: [{ type: 'push', blocks: ['box0', 'box1', 'box2'], plates: ['pl0', 'pl1', 'pl2'], give: 'E236',
      winLines: ['The three boxes sit on the chalk squares. Each has your name on it, in a different hand:', 'your mother’s, your grandmother’s, and a careful, wobbly one that is yours.', 'Somewhere a counter bell rings once.',
        'A brown tag on a string settles round your wrist: “CLAIMED.”', 'There is a line for a signature. It is already signed.'] }],
    npcs: [{ id: 'N1651', name: 'The Keeper of the Unclaimed', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#3a3020', '#2a2014', '#d8c8a8', '#c8b080'], eyes: 'closed', acc: 'lantern' }), behavior: 'patrol', path: [[17, 2], [17, 14]], speed: 0.4, solid: true,
        lines: [EN('After ninety days, unclaimed things come down here. After ninety years, they stop waiting.'), EN('Push your boxes up to the counter. Things here only count as claimed on the chalk.'),
          EN('At seven in the morning, somebody always comes to the back door for their things. Every morning. Seven.')] },
      { id: 'N1652', name: 'A Voice Down the Shelves', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 18,
        ambientLines: [EN('Has anyone handed in a little girl? About this tall. Doesn’t talk much.'), EN('She sleeps with the light on. If that helps.'), KS('…소라야? 소라 여기 있어요?', '…Sora? Is Sora here?')] }],
    info: { summary: 'Endless dark shelves behind the hut, where everything nobody came for ends up — including a girl’s name.',
      rules: ['Only reachable once the Cataloguer’s ledger is answered and all five things are claimed.', 'Push the three boxes with your name up onto the chalk squares in front of the counter: the Claim Tag (E236).'],
      secrets: ['Between 7 and 8 in the morning, real time, a back door with a nurse’s tunic on the hook appears in the top-right corner: out into the forest at dawn (W301).'],
      time: ['Real time, 07:00–07:59: the back door.'],
      lore: 'The child left behind is catalogued too; someone is still asking for her at the counter.' } });

  /* ---------------------------------------------------------------
   *  W319 — The Burrow of Lost Sleep (P4)
   * --------------------------------------------------------------- */
  S({ id: 'W319', name: 'The Burrow of Lost Sleep', depth: 4, tier: 'hard', back: 'W308', backLook: 'hole', backLabel: 'back up into the moss', backAt: [15, 41],
    map: (function () {
      var g = K.grid(30, 44, '#'); g.rect(13, 30, 4, 12, '.'); g.rect(13, 8, 4, 22, '.'); g.ellipse(15, 5, 6, 4, ','); g.ellipse(6, 20, 3, 2, '.'); g.rect(8, 20, 5, 1, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'dirt', c: ['#2a2018', '#221a12', '#32281e'] }, floor2: { p: 'rug', c: ['#d8dce4', '#c0c8d4'] }, wall: { p: 'rock', c: ['#140e0a', '#0e0a06', '#1c1610'] } },
    style: { renderer: 'charcoal' }, music: null, amb: { type: 'hum', vol: 0.04 }, dark: 0.9, playerLight: 0.6, extra: { noFurnish: true },
    doors: [{ to: 'W320', at: [4, 20], look: 'door', opt: { style: 'wood', c: ['#e8e8e8'] }, cond: { equipped: 'E232' }, arrive: 'fallspot', label: 'by candlelight, a low door into white', secret: true }],
    place: [{ type: 'decor', at: [13, 3], look: 'towel', lines: ['Hospital towels, folded into a mattress.'] },
      SOUL([KS('조용히 해. 엄마 자.', 'Shh. Mum is sleeping.')])],
    decor: [{ look: 'blanketlump', n: 2, solid: false, lines: ['A blanket in the shape of somebody who sleeps in the daytime.'] },
      { look: 'clock', n: 2, lines: ['An alarm clock set for 13:40. It says 13:39 and has said so for years.'] },
      { look: 'trinket', n: 2, opt: TAG, solid: false, lines: ['A tag: “FOUND — sleep. Two hours, asked for. Forty minutes, given.”'] }],
    mech: [{ type: 'rhythmWalk', zone: [9, 1, 21, 8], start: [15, 39], period: 1.4, window: 0.6, lineY: 30, failText: 'She stirs. You freeze, too late. You are back at the bottom of the burrow.',
      reward: [{ set: { ftl_burrow: true } }, { cookie: 1 }], done: { flag: 'ftl_burrow' },
      winLines: ['You reach the den between two breaths. A woman is asleep there in her work tunic, one shoe still on.', 'You take the shoe off. You pull the towel up to her chin. For once, somebody tucks her in.'] }],
    npcs: [{ id: 'N1653', name: 'The Sleeper', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#2a1a10'], eyes: 'closed' }), behavior: 'static', solid: true, at: [15, 4],
        lines: ['A woman asleep in a nest of hospital towels, still in her tunic.', KS('…두 시간만. 딱 두 시간만.', '…Just two hours. Only two.')] },
      { id: 'N1654', name: 'A Mole in a Night Cap', look: { t: 'rabbit', c: ['#4a3a3a'] }, behavior: 'static', solid: true, at: [16, 35],
        lines: [EN('Shh. Walk when she breathes out. Stop when she breathes in. That is how everybody in this burrow moves.'), EN('If you wake her, you start again from the bottom. We all have.')] },
      { id: 'N1655', name: 'The Breathing', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 10, ambientLines: ['Breathing, far up the tunnel. In… out…', 'A sigh, from very tired lungs.'] }],
    info: { summary: 'A narrow burrow under the forest that leads up to where a mother’s lost sleep is kept.',
      rules: ['In the tunnel, move only on the heartbeat (when she breathes out); moving in the silence sends you back to the bottom. Reach the den at the top.', 'Reached through the moss, a hole under a birthday table, a candle-lit door in the lamp clearing, or the front door numbered 1204.'],
      secrets: ['With the Unblown Candle (E232) equipped, a low white door appears in the side niche halfway up: out to the Edge of the Forest (W320).'],
      lore: '“Hush, Mum is sleeping”: the daytime sleep of a night-shift nurse, and the child who tiptoes round it.' } });

  /* ---------------------------------------------------------------
   *  W320 — The Edge of the Forest (P4)
   * --------------------------------------------------------------- */
  var FADES = [[44, 5, 'shoe'], [47, 10, 'plush'], [43, 15, 'letter'], [48, 20, 'keyring'], [45, 25, 'photo']];
  S({ id: 'W320', name: 'The Edge of the Forest', depth: 4, tier: 'hard', back: 'W303', backLook: 'shoe', backOpt: { c: ['#8a2a2a'] }, backLabel: 'the shoe-boat, back up the river', backAt: [3, 15], outdoor: true,
    map: (function () {
      var g = K.grid(60, 30, ' '); g.rect(0, 1, 50, 28, '.'); g.vline(0, 0, 29, '^');
      for (var y = 1; y < 29; y++) for (var x = 0; x < 36; x++) { var h = ((x * 73856093) ^ (y * 19349663)) >>> 0; if (h % 100 < Math.max(0, 34 - x)) g.set(x, y, '^'); }
      [[3, 15], [3, 4], [30, 15], [49, 14]].forEach(function (p) { g.rect(p[0] - 1, p[1] - 1, 3, 3, '.'); });
      FADES.forEach(function (p) { g.set(p[0], p[1], '.'); });
      return g.rows();
    })(),
    look: { floor: { p: 'meadow', c: ['#c8ccc0', '#d8dcd0', '#e8ece4', '#b8bcb0'] }, wall: { p: 'flat', c: ['#f0f0f0', '#e8e8e8'] } },
    tall: { '^': { look: 'tree', opt: { c: ['#a8b0a0', '#98a090', '#8a8a80', '#c8d0c0'] } } },
    style: { renderer: 'watercolor', sky: ['#ffffff', '#f4f4f0'], cliffH: 0.6, cliff: '#e8e8e4' }, music: 'forestedge', amb: { type: 'wind', vol: 0.06 },
    extra: { compass: 'counterdoor' },
    doors: [{ to: 'W301', at: [3, 4], look: 'gate', opt: { c: ['#5a4a32'] }, label: 'back into the trees, where things are still looked for' },
      { id: 'counterdoor', to: 'W083', at: [49, 14], look: 'door', opt: { style: 'wood', c: ['#c8a868'], symbol: '?' }, cond: { equipped: 'E236' }, label: 'a lost-property counter at the very edge, with a bell on it', secret: true }],
    place: FADES.map(function (p, i) { return { id: 'fade' + i, type: 'decor', at: [p[0], p[1]], look: p[2], alpha: 0.5, lines: ['Something so faded it is almost the colour of the sky. You look at it properly, for a long moment. It stays.'] }; }).concat([
      { id: 'fallspot', type: 'spawn', at: [30, 15] },
      SOUL([EN('Beyond the last tree, nobody looks for anything. That is all the edge is.')])]),
    decor: [{ look: 'crane', n: 3, solid: false, lines: ['A paper crane, half unfolded, as if it had started to forget what it was.'] },
      { look: 'balloons', n: 1, lines: ['Balloons, white now, that used to be colours.'] },
      { look: 'trinket', n: 2, opt: { c: ['#e8e8e0'] }, solid: false, lines: ['A tag so pale the word on it can no longer be read.'] }],
    mech: [{ type: 'visitAll', marks: FADES.map(function (p, i) { return 'fade' + i; }), countText: 'Looked for # / %', reward: [{ set: { ftl_edge_looked: true } }, { cookie: 1 }], done: { flag: 'ftl_edge_looked' },
      winLines: ['Five things at the edge of the world, looked for properly. They stop fading.', 'That is all looking is, says the wind: making something stay.'] }],
    npcs: [{ id: 'N1656', name: 'The Magpie, Far from Home', look: { t: 'bird', c: ['#16161c', 0, 0, '#2a2a34'], h: 11 }, behavior: 'static', solid: false, at: [33, 13],
        lines: [EN('This is where the forest stops looking. Things here have been forgotten by everybody, even the forest.'), EN('If you look for something here, properly, it stays. That’s all looking is.'),
          EN('Somebody claimed you? Then the counter is here somewhere. It only shows itself to things with a tag.')] },
      { id: 'N1657', name: 'A Fading Balloon', look: { t: 'jelly', c: ['rgba(240,240,240,0.6)'], h: 12 }, behavior: 'fly', radius: 6, speed: 0.5, solid: false, lines: ['A balloon so pale it is nearly not there. The string is still tied to a small wrist that is not there either.'] },
      { id: 'N1658', name: 'A Paper Crane, Unfolding', look: { t: 'crane' }, behavior: 'static', solid: true, lines: [EN('I was folded to make a wish come true. Nobody remembers the wish. I am going back to being paper.')] }],
    info: { summary: 'Where the forest thins out into white: the last trees, and the things nobody will ever look for, fading.',
      rules: ['Look for (interact with) the five faded things near the edge: they stop fading, and a biscuit is left for you.', 'Reached from the island in the River of Single Shoes, by falling from the Nest of Hair Ties, beneath the pond, or by candlelight from the Burrow of Lost Sleep.'],
      secrets: ['With the Claim Tag (E236) equipped, a lost-property counter appears at the very edge (the tag points to it): the way to the Lost Property Office (W083).'],
      lore: 'The end of looking. A child who has been claimed can hand herself in.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
