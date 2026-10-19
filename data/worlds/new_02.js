/* =========================================================================
 *  NEW WORLDS (02) — W221 to W240: THE SEASIDE TOWN
 *  A winter seaside town inside a dream, reached from the Grey Beach (W039),
 *  the Town at Dusk (W003), the Closed Funfair (W020) and the Lighthouse
 *  (W029). The ferry for the North Shore never leaves: five passengers keep
 *  getting off "just for a moment". Help each of them finish what keeps them
 *  ashore (fish market, karaoke, keeper's annex, sandal shore, last bus) and
 *  the hatch to the Hold opens; below it, the Crossing.
 *  Effects E207-E212 · inhabitants N1200-N1267.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a soul: a scrap of memory, said once, then undone */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* adds a door to an already defined world (placed at random, then made reachable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }

  /* the five passengers the ferry waits for (one puzzle each, in five worlds) */
  var PASSENGERS = ['sea_p_fish', 'sea_p_song', 'sea_p_keeper', 'sea_p_sandal', 'sea_p_bus'];
  function aboard() { return PASSENGERS.filter(function (f) { return YN.save.flag(f); }).length; }
  /* low tide on the flats: 35 seconds out of every 90 */
  var LOW = { remainingMod: { every: 90, under: 35 } };
  var GULL = { t: 'bird', c: ['#eef0f4'], h: 9 };
  var SEA = { p: 'water', c: ['#1c3044', '#162636', '#28445c', '#a8bccc'] };
  var SNOWF = { p: 'snow', c: ['#eef2f8', '#dfe6ee', '#ffffff'] };

  /* ---------------------------------------------------------------
   *  Effects E207–E212
   * --------------------------------------------------------------- */
  [
    { id: 'E207', name: 'Sea Glass', world: 'W224', icon: { glyph: '◇', c: '#7fd8c8' }, action: 'reveal', caps: ['reveal'],
      desc: 'Green glass, worn smooth by thirty winters. The world looks thinner through it.',
      use: 'Hold it to your eye (F): hidden things show for a moment. Walls that are only pretending let you through.',
      get: 'At the end of the footprints on the Tidal Flats.' },
    { id: 'E208', name: 'Hand Foghorn', world: 'W230', icon: { glyph: '⊲', c: '#c8a040' }, action: 'shout',
      desc: 'The keeper’s brass foghorn. It has answered the fog every night for thirty years.',
      use: 'Blow it (F): a long, low note that carries very far. Some fogs answer.',
      get: 'Left on the table in the Keeper’s Annex, once every lamp is lit.' },
    { id: 'E209', name: 'Laver Mat', world: 'W229', icon: { glyph: '▦', c: '#3a5a3a' }, action: 'hide', stealth: 0.3,
      desc: 'A bamboo mat for rolling laver. Wrapped in it, you smell of the sea and look like stock.',
      use: 'Hide under it (F); harder to notice. Some doors only let stock through.',
      get: 'From the women of the Seaweed Field, once every rack is turned.' },
    { id: 'E210', name: 'Last Bus Bell', world: 'W235', icon: { glyph: '⊙', c: '#e04040' }, action: 'ring',
      desc: 'A stop-request button, unscrewed from a bus dashboard. Still warm.',
      use: 'Press it (F): ding. Whoever is near turns towards you. Some buses stop where there is no stop.',
      get: 'From the driver of the Last Bus to the Sea, once the bells ring in the right order.' },
    { id: 'E211', name: 'Left Sandal', world: 'W233', icon: { glyph: '⌓', c: '#f0a060' }, action: 'hop',
      desc: 'A small left sandal, faded by a summer long ago. It never had a twin.',
      use: 'Hop (F): a small jump over a gap of water or a low obstacle.',
      get: 'From the girl on the Sandal Shore, once every pair is matched.' },
    { id: 'E212', name: 'Tambourine', world: 'W226', icon: { glyph: '❂', c: '#e8c060' }, action: 'clap',
      desc: 'Left on a karaoke table, still jingling. It keeps the beat of songs nobody chose.',
      use: 'Shake it (F): a burst of laughter. Those who laugh with you remember it; frozen things thaw.',
      get: 'Left behind by Manager Kim in the Quayside Karaoke, once the right song plays.' }
  ].forEach(function (e) { YN.data.effects.push(Object.assign({ fam: 'seaside', ground: false, core: false }, e)); });

  /* ---------------------------------------------------------------
   *  Shared materials
   * --------------------------------------------------------------- */
  var QUAY = { floor: { p: 'cobble', c: ['#8e949e', '#7e848e', '#9ea4ae'] }, floor2: { p: 'stone', c: ['#6e727a', '#5e626a', '#7e828a'] }, snow: SNOWF, water: SEA,
    bridge: { p: 'plank', c: ['#5e5040', '#4e4232', '#6e604e'] }, wall: { p: 'brick', c: ['#4e4446', '#3e3638', '#2e2628'] } };
  var INDOOR = function (floor, face, skirt) {
    var wall = { p: 'flat', c: ['#2a2e34', '#20242a'], topColor: '#2a2e34' };
    return { floor: floor, wall: wall, secret: wall, wallface: { p: face.p, c: face.c, skirt: skirt } };
  };
  /* the ferry deck (W222 and W240): hull, saloon, captain's cabin */
  function deckMap() {
    var g = K.grid(46, 22, '~'); g.ellipse(22.5, 11, 20, 8, ',');
    g.box(14, 7, 18, 9, '#', '.'); g.set(18, 15, '.'); g.set(21, 7, '.');
    g.vline(25, 8, 14, '#'); g.set(25, 11, '.');
    return g.rows();
  }
  var DECK = { floor: { p: 'wood', c: ['#5a4838', '#4a3a2a', '#6a5848'] }, floor2: { p: 'plank', c: ['#7a6a58', '#6a5a48', '#8a7a68'] }, water: SEA,
    wall: { p: 'flat', c: ['#e8e4dc', '#c8c4bc'], topColor: '#d8d4cc' }, wallface: { p: 'panel', c: ['#e8e4dc', '#c8c4bc', '#8a8680'], skirt: '#a03030' } };
  var SEATS = [[7, 8], [7, 14], [36, 8], [36, 14], [11, 17]];

  /* ---------------------------------------------------------------
   *  W221 — The Winter Harbour (hub of the town)
   * --------------------------------------------------------------- */
  S({ id: 'W221', name: 'The Winter Harbour', depth: 2, tier: 'easy', back: 'W039', backLook: 'ladder', backLabel: 'the ladder down to the grey sand', backAt: [3, 13], outdoor: true,
    map: (function () {
      var g = K.grid(60, 36, '#');
      g.rect(0, 0, 60, 13, '~'); g.rect(0, 13, 60, 11, '.'); g.hline(0, 59, 13, ',');
      g.rect(8, 4, 3, 9, '='); g.rect(28, 1, 4, 12, '='); g.rect(47, 6, 3, 7, '=');
      g.scatter('n', '.', 0.14, 2211, [0, 14, 60, 10]);
      [5, 16, 23, 36, 45, 55].forEach(function (x) { g.set(x, 15, '}'); });
      [7, 19, 37, 56].forEach(function (x) { g.set(x, 20, '^'); });
      g.rect(40, 24, 3, 11, ',');
      return g.rows();
    })(),
    look: QUAY, tall: { '^': { look: 'streetlamp' }, '}': { look: 'barrel', opt: { c: ['#3a3a42'] } } },
    extra: { noExpand: true }, style: { sky: ['#1a2230', '#3a4658'] }, music: 'winterharbour', amb: { type: 'sea', vol: 0.08 }, dark: 0.35, weather: { snow: true },
    doors: [{ to: 'W231', at: [30, 24], look: 'door', opt: { style: 'glass', c: ['#a8c0d0'] }, label: 'the ferry terminal' },
      { to: 'W223', at: [12, 24], look: 'door', opt: { style: 'metal', c: ['#6a7078'] }, label: 'the fish market' },
      { to: 'W226', at: [52, 24], look: 'door', opt: { style: 'red', c: ['#b04078'] }, label: 'a karaoke bar, still lit' },
      { to: 'W224', at: [0, 18], look: 'stairsdown', label: 'steps down to the mud flats' },
      { to: 'W228', at: [59, 18], look: 'gate', opt: { c: ['#5a6070'] }, label: 'the breakwater' },
      { to: 'W225', at: [41, 35], look: 'door', opt: { style: 'wood', c: ['#5a4a3a'] }, label: 'the high street' },
      { to: 'W234', at: [9, 4], look: 'ladder', cond: { flag: 'sea_board' }, label: 'a ladder down to a rowing boat' }],
    place: [{ id: 'departures', type: 'decor', at: [25, 22], look: 'board', lookOpt: { lines: ['NORTH SHORE', 'DELAYED', '', ''], color: '#f0a020' }, lines: ['The departures board.'] },
      { id: 'ferry', type: 'decor', at: [32, 6], look: 'boat', lookOpt: { c: ['#e8e4dc', '#2a3a52'] }, light: 1.2, lines: ['The ferry for the North Shore, moored with its lights on. Its engine has been warm for seventy years.', 'Snow settles on the deck and melts at once. Someone keeps the boilers lit.'] },
      { id: 'kneon', type: 'decor', at: [54, 23], look: 'neon', lookOpt: { text: 'KARAOKE', c: ['#ff60c0'] }, light: 1.6, lines: ['A pink sign hums over the karaoke bar. Inside, someone is singing the same song again.'] },
      SOUL([KN('다음 배로 꼭 가마. 짐은 싸 두었다.', 'I will go on the next boat, for certain. My bag is packed.')]),
      SOUL([EN('Every house in this town has a packed bag by the door. Nobody has unpacked one in seventy years.')])],
    signs: [{ at: [23, 22], lines: [EN('The board tells the truth for a moment at a time. Ask it then.')] }],
    decor: [{ look: 'crate', n: 3, lines: ['A fish crate stamped with a town name that has been painted over.', 'Crates stacked against the cold. On one, in chalk: “north, next ferry”.'] },
      { look: 'snowman', n: 1, lines: ['A snowman facing the sea, a ferry ticket stuck in its scarf.'] },
      { look: 'payphone', n: 1, lines: ['A telephone box. The only number written inside has no area code. It just says “home”.'] },
      { look: 'bench', n: 2, lines: ['A bench looking at the ferry. The snow on it has the shape of someone who sat here all evening.'] }],
    npcs: [{ id: 'N1200', name: 'The Harbour Master', look: H({ t: 'old', body: 'uniform', c: ['#2a3448', '#1e2838', '#e0c8a8', '#d0d0d0'], hat: 'cap', hatColor: '#1e2838' }), behavior: 'static', solid: true, at: [33, 17],
        lines: [KS('배는 오늘도 안 떠요. 걱정 마세요. 매일 안 떠요.', 'The boat isn’t leaving today either. Don’t worry. Every day, it doesn’t leave.'),
          KS('전광판은 거짓말 안 해요. 가끔은요.', 'The board doesn’t lie. Now and then.'),
          KS('북쪽 해안이요? 날씨가 좋으면 보인대요. 날씨가 좋은 적은 없지만.', 'The North Shore? They say you can see it when the weather is good. The weather has never been good.')] },
      { id: 'N1201', name: 'A Gull with a Ticket', count: 3, look: GULL, behavior: 'wander', radius: 6, speed: 1.2, solid: false,
        lines: ['A gull with a paper ticket in its beak. SINGLE — NORTH SHORE.', 'The gull will not give up its ticket. It has been waiting longer than you have.'] },
      { id: 'N1202', name: 'An Old Woman Mending Nets', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#6a5a4a', '#4a3a2a', '#e0c0a0', '#c8c8c8'], eyes: 'closed' }), behavior: 'static', solid: true, at: [14, 17],
        lines: [KN('아바이는 다음 배로 간다고 했습니다. 다음 배는 언제나 다음 배입니다.', 'Grandad said he would go on the next boat. The next boat is always the next boat.'),
          KN('하룻밤만 더. 우리는 매일 밤 그렇게 말했습니다. 칠십 년 동안.', 'One more night. We said it every night. For seventy years.'),
          'She mends a net that has never been to sea. The knots are perfect.'] }],
    mech: [{ type: 'cycleFrames', mark: 'departures', every: 2.2, good: 3, flag: 'sea_board',
      frames: ['NORTH SHORE · DELAYED.', 'NORTH SHORE · DELAYED.', 'NORTH SHORE · PLEASE WAIT.', 'NORTH SHORE · ON TIME.', 'NORTH SHORE · DEPARTED 1951.'],
      doneLine: 'NORTH SHORE · ON TIME. It has said so ever since you caught it out.',
      reward: [{ set: { sea_board: true } }, { secret: 'sea_board_honest' }],
      winLines: ['For one second, the board says ON TIME.', 'At the end of the first pier, a rowing boat knocks against a ladder, as if someone had called it.'] }],
    info: { summary: 'A snowed-in harbour at night: three piers, a ferry with its lights on, a fish market, a karaoke bar.',
      rules: ['The hub of the Seaside Town: the Ferry Terminal, the Fish Market and the Quayside Karaoke open onto the quay.', 'The Tidal Flats lie to the west, the Breakwater to the east, the High Street up the alley.',
        'The departures board changes every two seconds. Interact with it at the moment it says ON TIME.',
        'Then a ladder appears at the end of the first pier, down to a rowing boat (The Squid Boat Lights).'],
      secrets: ['The rowing boat at the end of the first pier.'], lore: 'A town where everyone waits for the ferry north, and nobody minds that it never leaves.' } });
  link('W039', { to: 'W221', look: 'stairs', label: 'stone steps up to a harbour in the snow' });

  /* ---------------------------------------------------------------
   *  W231 — The Ferry Terminal
   * --------------------------------------------------------------- */
  S({ id: 'W231', name: 'The Ferry Terminal', depth: 2, tier: 'mid', back: 'W221', backLook: 'door', backOpt: { style: 'glass', c: ['#a8c0d0'] }, backLabel: 'out onto the quay', backAt: [15, 17],
    map: (function () {
      var g = K.grid(30, 18, ' '); g.box(0, 0, 30, 18, '#', '.');
      g.hline(3, 13, 4, 'u');
      [8, 11, 14].forEach(function (y) { g.hline(4, 10, y, '{'); g.hline(14, 20, y, '{'); });
      g.vline(24, 6, 12, '#'); g.hline(24, 28, 6, '#'); g.hline(24, 28, 12, '#'); g.set(24, 9, '?');
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'tileLines', c: ['#c8c8c0', '#a8a8a0'] }, { p: 'tile', c: ['#c8ccd0', '#a8acb0', '#788088'] }, '#3a4a5a'), { counter: { p: 'wood', c: ['#6a5040', '#5a4030'] } }),
    tall: { '{': { look: 'bench', opt: { c: ['#4a6a8a'] } } }, style: { tallWalls: true }, music: 'ferryterminal', amb: { type: 'loudspeaker', vol: 0.04 }, dark: 0.2,
    doors: [{ to: 'W222', at: [20, 0], look: 'door', opt: { style: 'metal', c: ['#7a8088'] }, label: 'the gangway' }],
    place: [{ id: 'window', type: 'decor', at: [8, 4], look: 'till', lines: ['The ticket window.'] },
      { id: 'dboard', type: 'decor', at: [16, 1], look: 'board', lookOpt: { lines: ['NORTH SHORE', 'SINGLE ONLY', 'DELAYED', ''], color: '#f0a020' },
        lines: ['DEPARTURES: NORTH SHORE. SINGLE FARES ONLY. DELAYED.', 'There is no board for arrivals. Nothing has ever come in.'] },
      { id: 'lpsign', type: 'decor', at: [23, 7], look: 'banner', lookOpt: { text: 'LOST PROPERTY', c: ['#2a3a5a', '#f0e0a0'] },
        lines: ['LOST PROPERTY. The arrow points into the wall, where a hatch used to be. These bricks look too new.'] },
      { id: 'lostbox', type: 'decor', at: [27, 8], look: 'vitrine', use: [{ secret: 'sea_lost_property' }],
        lines: ['A walled-in cupboard. Everything in it is single: one glove, one shoe, one earring, half a pair of glasses.', 'A label on the shelf: “Unclaimed since 1951. Will be kept.”'] },
      SOUL([EN('Nobody here ever bought a return. Not one.')], [26, 10]),
      SOUL([KS('엄마, 배 언제 와? — 내일. 내일 와.', 'Mum, when is the boat coming? — Tomorrow. It’s coming tomorrow.')])],
    decor: [{ look: 'vending', n: 1, lines: ['A drinks machine. Every button says SOLD OUT except one: “warm barley tea, for the wait”.'] },
      { look: 'wallclock', n: 1, lines: ['The terminal clock. Its second hand goes round, but the minute hand stays where it was in the winter of 1951.'] },
      { look: 'suitcase', n: 2, lines: ['A suitcase tied with string, waiting by a bench. Its owner went to get a tea in another century.'] }],
    npcs: [{ id: 'N1237', name: 'The Ticket Clerk', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#3a4a6a', '#2a3a5a', '#e8ccb0', '#1a1a1a'] }), behavior: 'static', solid: true, at: [8, 2],
        lines: [KS('북쪽 해안행이요? 편도만 있어요. 왕복은 원래 없어요.', 'For the North Shore? Single only. There has never been a return.'),
          KS('탑승권 받으시려면 창구에서 서류 쓰세요.', 'If you want a boarding pass, fill in the form at the window.'),
          { if: { flag: 'sea_boarding' }, t: '안녕히 가세요. 아니, 안녕히 기다리세요.', lang: 'ko-s', tr: 'Have a good journey. No — have a good wait.' }] },
      { id: 'N1238', name: 'A Sleeping Passenger', at: [5, 9], look: H({ t: 'adult', body: 'coat', c: ['#4a4a40', '#3a3a30', '#e0c0a0', '#202020'], eyes: 'closed' }), behavior: 'statue', solid: true,
        lines: [{ seq: ['A passenger asleep sitting up, a ticket in each hand.', KN('하룻밤만 더…', 'Just one more night…')] }, 'She sleeps with her coat buttoned, ready to leave the moment they call.'] },
      { id: 'N1239', name: 'The Announcement', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 22,
        ambientLines: [EN('The ferry to the North Shore is delayed. Thank you for your patience.'),
          KS('북쪽 해안행 여객선 출항이 지연되고 있습니다. 승객 여러분의 양해 부탁드립니다.', 'Departure of the ferry for the North Shore is delayed. We ask passengers for their understanding.'),
          EN('Passengers are reminded that the ferry leaves only when everyone is aboard.')] }],
    npcList: [{ id: 'N1238', at: [16, 12] }, { id: 'N1238', at: [9, 15] }, { id: 'N1238', at: [19, 9] }],
    mech: [{ type: 'quiz', mark: 'window', flag: 'sea_boarding',
      intro: ['The clerk slides a form under the glass. Three questions, in pencil.'],
      questions: [{ q: 'DESTINATION:', choices: ['The South Shore', 'The North Shore', 'Anywhere but here'], right: 1 },
        { q: 'TICKET:', choices: ['Return', 'Single'], right: 1 },
        { q: 'HOW LONG WILL YOU WAIT?', choices: ['Until it leaves', 'One more night', 'As long as it takes'], right: 1 }],
      failLine: 'The clerk rubs out your answers with the side of her hand, gently, and slides the form back.',
      doneLine: 'The clerk taps your boarding pass through the glass and smiles.',
      reward: [{ set: { sea_boarding: true } }, { secret: 'sea_boarding_pass' }],
      winLines: ['The clerk stamps the form without reading it.', KS('탑승권이에요. 선장님께 보여 드리세요.', 'Here’s your boarding pass. Show it to the captain.'), 'The pass says: BOARDING — ONE MORE NIGHT.'] }],
    info: { summary: 'The ferry terminal’s waiting room: sleeping passengers, a ticket window, a board with no arrivals.',
      rules: ['Fill in the form at the ticket window: the North Shore, Single, One more night.', 'The board, the clerk and the sleeping passengers give the answers.',
        'The boarding pass opens the captain’s cabin on the ferry.',
        'With the Sea Glass, the bricked-up wall under the LOST PROPERTY banner lets you through.'],
      secrets: ['The walled-in lost property cupboard (Sea Glass).'], lore: 'Everyone waiting here bought a single.' } });

  /* ---------------------------------------------------------------
   *  W222 — The Ferry That Never Leaves (the meta-puzzle)
   * --------------------------------------------------------------- */
  S({ id: 'W222', name: 'The Ferry That Never Leaves', depth: 2, tier: 'mid', back: 'W231', backLook: 'ladder', backLabel: 'the gangway back to the terminal', backAt: [3, 11], outdoor: true,
    map: deckMap(), look: DECK, style: { sky: ['#101824', '#2a3648'] }, music: 'ferrywait', amb: { type: 'sea', vol: 0.07 }, dark: 0.4, weather: { snow: true },
    doors: [{ to: 'W238', at: [22, 18], look: 'hatch', cond: { flag: PASSENGERS }, label: 'the hatch to the hold',
      locked: 'The hatch is chained. The captain won’t cast off until everyone is aboard. Five seats on deck are still cold.' }],
    place: [{ id: 'cabindoor', type: 'decor', at: [25, 11], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a30'], locked: true }, solid: true, hideIf: { flag: 'sea_boarding' },
        lines: ['The captain’s cabin. Locked. A card in the little window: BOARDING PASSES ONLY.'] },
      { id: 'logbook', type: 'decor', at: [28, 9], look: 'book', light: 1.5, use: [{ secret: 'sea_logbook' }],
        lines: ['The ship’s log. Seventy years of the same entry: “Fog. Passengers: not all. Departure: tomorrow.”', 'The first entry is in a child’s handwriting. The captain was nine when he started waiting.'] },
      { id: 'porthole', type: 'decor', at: [29, 8], look: 'window', lookOpt: { night: true }, lines: ['Through the porthole, very far off, a coast with one lit window. It goes out when you look straight at it.'] },
      { id: 'cabinbed', type: 'decor', at: [29, 13], look: 'bed', lookOpt: { c: ['#d8d4cc', '#3a4a6a'] }, lines: ['A narrow bunk, made with hospital corners. Nobody has slept in it. Captains don’t, while they wait.'] },
      { id: 'wheel', type: 'decor', at: [16, 9], look: 'wheel', lines: ['The wheel, lashed with rope so it can’t turn. Someone tied the knot very carefully, a long time ago.'] },
      { id: 'seat0', type: 'decor', at: [6, 8], look: 'bench', lines: ['A seat on deck, swept clean of snow. A cardboard sign: RESERVED — FISH.'] },
      { id: 'seat1', type: 'decor', at: [6, 14], look: 'bench', lines: ['A seat on deck, swept clean of snow. A cardboard sign: RESERVED — SINGING.'] },
      { id: 'seat2', type: 'decor', at: [37, 8], look: 'bench', lines: ['A seat on deck, swept clean of snow. A cardboard sign: RESERVED — LIGHT.'] },
      { id: 'seat3', type: 'decor', at: [37, 14], look: 'bench', lines: ['A seat on deck, swept clean of snow. A cardboard sign: RESERVED — ONE SANDAL.'] },
      { id: 'seat4', type: 'decor', at: [10, 17], look: 'bench', lines: ['A seat on deck, swept clean of snow. A cardboard sign: RESERVED — LAST BUS.'] },
      SOUL([KN('배가 떠나면 고향이 없어질까 봐 무서웠습니다.', 'I was afraid that if the ship left, home would stop being there.')], [28, 12]),
      SOUL([EN('A ship that never leaves never has to arrive somewhere wrong.')])],
    decor: [{ look: 'buoy', n: 2, lines: ['A lifebuoy. The ship’s name has been painted over so many times it now just says “NEXT”.'] },
      { look: 'lantern', n: 2, lines: ['A deck lantern. It has been lit for so long the glass has gone amber.'] }],
    npcs: [{ id: 'N1203', name: 'The Captain Who Waits', look: H({ t: 'old', body: 'coat', c: ['#1e2a3a', '#141e2a', '#e0c8a8', '#e0e0e0'], hat: 'conductor', hatColor: '#141e2a' }), behavior: 'static', solid: true, at: [19, 10],
        lines: [{ if: { flag: PASSENGERS }, t: '다 탔습니다. 그래도 배가 안 떠납니다. 짐칸에 내려가 보십시오. 짐이 한쪽으로 다 쏠려 있습니다.', lang: 'ko-n', tr: 'All are aboard, and still the ship does not leave. Go down to the hold: the luggage has slid to one side.' },
          { if: { flag: 'sea_boarding' }, t: '탑승권이 있으시군요. 선장실 문은 열어 두었습니다.', lang: 'ko-n', tr: 'You have a boarding pass. I have left the cabin door open.' },
          KN('이 배는 모두 타야 떠납니다. 한 사람이라도 빠지면 안 됩니다.', 'This ship leaves when everyone is aboard. Not one person may be missing.'),
          { t: function () { var n = aboard(); return KN('다섯 자리 중에 ' + n + ' 자리가 찼습니다.', n + ' of the five seats are taken.'); } },
          { seq: [KN('생선 파는 아주머니, 노래하는 회사원, 등대지기.', 'The fishwife, the singing office worker, the lighthouse keeper.'), KN('샌들 신은 아이, 막차 기사. 다들 잠깐만 하고 내렸습니다.', 'The child in sandals, the last bus driver. They all got off just for a moment.')] }] },
      { id: 'N1204', name: 'The Fishwife, Aboard', look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#c06050', '#8a3a30', '#e0c0a0', '#2a1a10'] }), behavior: 'static', solid: true, at: SEATS[0], appear: { flag: 'sea_p_fish' },
        lines: [KS('생선은 다 팔았어. 이제 집에 가야지. 집이 어딘지는 배가 알겠지.', 'I sold all my fish. Time to go home. The boat must know where home is.')] },
      { id: 'N1205', name: 'Manager Kim, Aboard', look: H({ t: 'adult', body: 'suit', c: ['#3a3a44', '#2a2a34', '#e0c8a8', '#1a1a1a'] }), behavior: 'static', solid: true, at: SEATS[1], appear: { flag: 'sea_p_song' },
        lines: [KS('노래 끝났어. 이번엔 진짜 집에 간다. 미란이가 아직 안 자면 좋겠는데.', 'The song’s over. This time I really am going home. I hope Mi-ran isn’t asleep yet.')] },
      { id: 'N1206', name: 'The Keeper, Aboard', look: H({ t: 'old', body: 'coat', c: ['#2a3a4a', '#1a2a3a', '#e0c0a0', '#d8d8d8'], hat: 'beanie', hatColor: '#8a2a2a' }), behavior: 'static', solid: true, at: SEATS[2], appear: { flag: 'sea_p_keeper' },
        lines: [EN('First night off in thirty years. I don’t know what to do with my hands.')] },
      { id: 'N1207', name: 'The Girl in Sandals, Aboard', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#f0d880', '#d0b860', '#f0d0b0', '#2a1a10'], h: 16 }), behavior: 'static', solid: true, at: SEATS[3], appear: { flag: 'sea_p_sandal' },
        lines: [EN('I’ve got two sandals now. Not mine, but two. You can’t go home on one foot.')] },
      { id: 'N1208', name: 'The Bus Driver, Aboard', look: H({ t: 'adult', body: 'uniform', c: ['#3a5a4a', '#2a4a3a', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#2a4a3a' }), behavior: 'static', solid: true, at: SEATS[4], appear: { flag: 'sea_p_bus' },
        lines: [KS('운전 안 하고 타는 건 처음이네. 창밖이 이렇게 생겼구나.', 'First time I’ve ridden without driving. So that’s what it looks like out of the window.')] },
      { id: 'N1209', name: 'A Gull on the Rail', look: GULL, behavior: 'wander', radius: 5, speed: 1, solid: false, lines: ['A gull walks along the rail with a ticket in its beak, checking that everyone has one.'] }],
    info: { summary: 'The ferry for the North Shore, moored in the snow: five reserved seats, a captain, a chained hatch.',
      rules: ['The ferry waits for five passengers who got off, each kept ashore by a puzzle:', 'the fishwife (Fish Market), Manager Kim (Quayside Karaoke), the keeper (Keeper’s Annex),', 'the girl in sandals (Sandal Shore) and the bus driver (Last Bus to the Sea).',
        'Each one boards when their puzzle is solved; when all five seats are taken, the hatch to the Hold opens.',
        'The boarding pass from the Ferry Terminal unlocks the captain’s cabin (the log, the porthole).'],
      secrets: ['The captain’s cabin and its log.'], lore: 'The ferry that never leaves, so that home stays where it was.' } });

  /* ---------------------------------------------------------------
   *  W223 — The Fish Market at Dawn (passenger 1: the fishwife)
   * --------------------------------------------------------------- */
  var FISHC = ['#8aa0b0', '#c0c8d0', '#d07050', '#a0a8a0', '#e0c060', '#7080a0'];
  S({ id: 'W223', name: 'The Fish Market at Dawn', depth: 2, tier: 'mid', back: 'W221', backLook: 'door', backOpt: { style: 'metal', c: ['#6a7078'] }, backLabel: 'out onto the quay', backAt: [23, 27],
    map: (function () {
      var g = K.grid(46, 28, ' '); g.box(0, 0, 46, 28, '#', ',');
      [6, 12, 18].forEach(function (y) { [[4, 11], [15, 21], [26, 33], [37, 42]].forEach(function (s) { g.hline(s[0], s[1], y, 'u'); }); });
      g.hline(3, 20, 1, '}'); g.hline(26, 42, 1, '}');
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'concrete', c: ['#5a6064', '#4e5458', '#666c70'] }, { p: 'tile', c: ['#c8d0d4', '#a8b0b4', '#6a7478'] }, '#3a5a6a'),
      { floor2: { p: 'tile', c: ['#6a7278', '#586066'] }, counter: { p: 'metal', c: ['#9aa0a8', '#7a8088'] } }),
    tall: { '}': { look: 'tank', opt: { c: ['#3a7aa0'] } } }, style: { tallWalls: true }, music: 'fishmarket', amb: { type: 'fridge', vol: 0.06 }, dark: 0.25,
    doors: [{ to: 'W239', at: [23, 0], look: 'door', opt: { style: 'metal', c: ['#c8d8e0'] }, cond: { equipped: 'E209' }, label: 'the cold store',
      locked: 'A freezer door, white with frost. Stencilled on it: STOCK ONLY. People are not stock.' }],
    place: [SOUL([KS('새벽 다섯 시, 경매 시작. 엄마는 그 시간에 집에 오고 나는 그 시간에 일하러 와.', 'Five in the morning, the auction starts. That’s when Mum gets home, and when I come to work.')]),
      SOUL([EN('Ice keeps the fish fresh. It keeps the fishmongers, too.')])],
    decor: [{ look: 'crate', n: 4, lines: ['A crate of crushed ice with the shape of a fish in it, and no fish.', 'Empty crates, stacked in sevens. Seven was the number of crates her mother carried, every morning.'] },
      { look: 'stool', n: 2, lines: ['A low stool, warm. The fishwife sits here between auctions and sleeps for four minutes.'] },
      { look: 'lamp', n: 2, lines: ['A bare bulb over a stall. Fish scales stuck to it like sequins.'] }],
    npcs: [{ id: 'N1210', name: 'The Fishwife', look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#c06050', '#8a3a30', '#e0c0a0', '#2a1a10'] }), behavior: 'static', solid: true, at: [8, 9], goneIf: { flag: 'sea_p_fish' },
        lines: [KS('아이고, 생선이 다 도망갔네. 좀 잡아 줄래? 뛰지 말고. 뛰면 놀라.', 'Oh dear, the fish have all run off. Will you catch them for me? Don’t run. Running scares them.'),
          KS('여섯 마리만 팔면 배 타러 갈 거야. 딱 여섯 마리만.', 'Once I’ve sold six, I’m off to catch the boat. Just six.'),
          KS('영 사, 영 사… 그 노래 번호가 뭐였더라. 앞자리는 맨날 까먹어.', 'Oh-four, oh-four… what was the number of that song? I always forget the first part.'),
          KS('냉동창고엔 물건만 들어가. 사람은 안 돼. 김 한 장이면 모를까.', 'Only stock goes in the cold store. Not people. A sheet of laver, maybe.')] },
      { id: 'N1211', name: 'The Auctioneer', look: H({ t: 'adult', body: 'shirt', c: ['#e8e8e0', '#c8c8c0', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#c03030', acc: 'clipboard' }), behavior: 'static', solid: true, at: [30, 15],
        lines: [KS('자, 삼만! 삼만 오천! 아무도 없어요? 아무도?', 'Right, thirty thousand! Thirty-five! Nobody? Nobody at all?'), 'He auctions an empty crate to an empty hall. He is very good at it.'] },
      { id: 'N1218', name: 'A Man Asleep on the Ice', look: H({ t: 'adult', body: 'coat', c: ['#3a4a5a', '#2a3a4a', '#d8c0a8', '#1a1a1a'], eyes: 'closed' }), behavior: 'statue', solid: true, at: [40, 24],
        lines: ['A man asleep on a bed of crushed ice, his cheek against a fish. Both look peaceful.'] }]
      .concat(FISHC.map(function (c, i) {
        return { id: 'N' + (1212 + i), name: 'A Runaway Fish', tag: 'w223fish', look: { t: 'fish', c: [c], h: 9 }, behavior: 'shy', shyDist: 3, radius: 6, speed: 1.4, solid: false,
          lines: ['A fish flopping across the wet concrete. It looks at you sideways, the way fish do.'] };
      })),
    mech: [{ type: 'catchN', n: 6, tag: 'w223fish', key: 'w223fish', noRun: true, flag: 'sea_p_fish',
      runLine: 'The fish hear running feet and slither away.', countText: '# of % fish back in the crate.',
      reward: [{ set: { sea_p_fish: true } }],
      winLines: ['The last fish slaps into the crate. The fishwife wipes her hands on her apron.', KS('됐다. 다 팔았다. 이제 배 타러 가야지.', 'There. All sold. Now I’m off to the boat.'), 'She takes off her rubber boots and walks out barefoot, towards the harbour.'] }],
    info: { summary: 'A fish market under bare bulbs, just before dawn: counters, tanks, crushed ice, and fish that have escaped.',
      rules: ['Catch the six runaway fish by walking into them. Running scares them off.', 'Then the fishwife goes to board the ferry.',
        'The cold store only lets in stock: wrapped in the Laver Mat, you pass.'],
      secrets: ['The cold store (Laver Mat equipped).'], lore: 'The market opens when the night shift comes home.' } });

  /* ---------------------------------------------------------------
   *  W239 — The Cold Store (P3)
   * --------------------------------------------------------------- */
  S({ id: 'W239', name: 'The Cold Store', depth: 3, tier: 'hard', back: 'W223', backLook: 'door', backOpt: { style: 'metal', c: ['#c8d8e0'] }, backLabel: 'back out into the market', backAt: [19, 25],
    map: (function () {
      var g = K.grid(40, 26, ' '); g.box(0, 0, 40, 26, '#', '.');
      [4, 8, 12, 27, 31, 35].forEach(function (x) { g.vline(x, 3, 21, '%'); });
      g.scatter('&', '.', 0.22, 2391, [1, 3, 14, 19]); g.scatter('&', '.', 0.22, 2392, [25, 3, 14, 19]);
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'concrete', c: ['#c8d4dc', '#b8c4cc', '#d8e4ec'] }, { p: 'metal', c: ['#d0dce4', '#b0bcc4', '#8a96a0'] }, '#6a8aa0'),
      { wall2: { p: 'metal', c: ['#a8b8c4', '#8898a4', '#c8d8e4'] }, ice: { p: 'ice', c: ['#d8ecf8', '#c0dcf0', '#ffffff'] } }),
    style: { tallWalls: true, filter: 'saturate(0.6) brightness(1.05)' }, music: 'coldstore', amb: { type: 'machine', vol: 0.07 }, dark: 0.3, weather: { snow: true },
    place: [{ id: 'clock', type: 'decor', at: [20, 1], look: 'wallclock', light: 1.4, lines: ['The cold store clock, frozen at ten to five.'] },
      { id: 'letter', type: 'decor', at: [6, 23], look: 'letter', cond: { flag: 'sea_thaw' }, use: [{ secret: 'sea_frozen_letter' }],
        lines: ['A letter in the thawing ice: “Mother, I am in the south. I sell fish. When the ferry runs, I will come.”', 'It was never posted. The stamp is from a country with a different name now.'] },
      SOUL([KS('언 생선은 안 상해. 언 사람도.', 'Frozen fish don’t spoil. Neither do frozen people.')]),
      SOUL([EN('Ten to five, for ever: the minute before everything starts.')])],
    signs: [{ at: [21, 23], lines: [EN('Move when the machine thumps. Stand still when it rests.')] }],
    decor: [{ look: 'crate', n: 4, lines: ['A frozen crate. Through the ice, a label: “herring — 1951 — keep”.', 'A crate of frozen squid, stacked like letters waiting to be read.'] },
      { look: 'fridge', n: 2, lines: ['A freezer cabinet humming a single note. It has hummed it since before you were born.'] }],
    npcs: [{ id: 'N1259', name: 'A Frozen Fishmonger', count: 3, look: H({ t: 'adult', body: 'apron', c: ['#a8c0d0', '#88a0b0', '#d8e8f0', '#4a5a6a'], eyes: 'closed', alpha: 0.85 }), behavior: 'statue', solid: true,
        onLaugh: [{ if: { notFlag: 'sea_thaw' }, set: { sea_thaw: true }, msg: 'The frozen fishmongers smile, then laugh. Frost falls off them like sugar. Something thaws by the door.' }, { reeval: true }],
        lines: ['A fishmonger frozen in the middle of a shout, his mouth open on a price nobody will ever pay.', 'Frost on her eyelashes. She was laughing when the cold came. She is still nearly laughing.'] },
      { id: 'N1260', name: 'The Night Watchman', look: H({ t: 'old', body: 'coat', c: ['#4a4a3a', '#3a3a2a', '#e0c0a0', '#c8c8c8'], hat: 'beanie', hatColor: '#3a3a2a', acc: 'lantern' }), behavior: 'static', solid: true, at: [24, 23],
        lines: [KS('기계가 쿵 할 때만 움직여. 조용할 땐 서리가 너를 봐.', 'Only move when the machine thumps. When it’s quiet, the frost is watching you.'),
          KS('시계가 네 시 오십 분에 얼었어. 경매 시작 십 분 전. 영원히 십 분 전이야.', 'The clock froze at ten to five. Ten minutes before the auction. Ten minutes before, for ever.'),
          KS('얼어붙은 사람들은 웃음소리에 녹아. 근데 여기서 누가 웃어?', 'Frozen people thaw at the sound of laughter. But who laughs in here?')] }],
    mech: [{ type: 'rhythmWalk', period: 1.4, window: 0.5, zone: [17, 1, 22, 2], start: [19, 23], lineY: 22, flag: 'sea_clock',
      failText: 'The machine went quiet and the frost saw her move. She is back by the door.',
      reward: [{ set: { sea_clock: true } }, { secret: 'sea_clock_breath' }],
      winLines: ['You reach the frozen clock between two thumps.', 'You breathe on it. The minute hand moves, once, and stops again: five to five.', 'Somewhere above, the market wakes up five minutes early.'] }],
    info: { summary: 'A cold store under the fish market: frosted aisles, frozen fishmongers, a clock stuck at ten to five.',
      rules: ['Only through the Fish Market’s freezer door, wrapped in the Laver Mat.', 'Walk up the aisle to the clock only while the compressor thumps; moving in the silence sends you back.',
        'Shake the Tambourine near the frozen fishmongers: they laugh and thaw; a letter appears by the door.'],
      secrets: ['The letter that was never posted (Tambourine).'], lore: 'The minute before the market, kept fresh.' } });

  /* ---------------------------------------------------------------
   *  W224 — The Tidal Flats (things surface at low tide)
   * --------------------------------------------------------------- */
  S({ id: 'W224', name: 'The Tidal Flats', depth: 2, tier: 'mid', back: 'W221', backLook: 'stairs', backLabel: 'the steps up to the quay', backAt: [55, 18], outdoor: true,
    map: (function () {
      var g = K.grid(56, 36, ',');
      g.rect(48, 0, 8, 36, '.'); g.rect(0, 0, 4, 36, '~');
      [[38, 12], [28, 24], [18, 12]].forEach(function (c) { g.rect(c[0], 0, 2, 36, '~'); g.rect(c[0], c[1], 2, 2, 'w'); });
      g.scatter('w', ',', 0.05, 2241, [4, 0, 44, 36]);
      return g.rows();
    })(),
    look: { floor: { p: 'sand', c: ['#c8bca0', '#b8ac90', '#d8ccb0'] }, floor2: { p: 'dirt', c: ['#5a5048', '#4e443c', '#665c52'] }, water: SEA,
      shallow: { p: 'water', c: ['#4a5a68', '#3e4e5c', '#5a6a78', '#b8c8d0'] } },
    extra: { noExpand: true }, style: { sky: ['#2a3040', '#6a7080'], renderer: 'watercolor' }, music: 'tidalflats', amb: { type: 'sea', vol: 0.05 }, dark: 0.2, weather: { snow: true },
    doors: [{ to: 'W229', at: [50, 35], look: 'gate', opt: { c: ['#8a7a5a'] }, label: 'a path to the seaweed field' },
      { to: 'W227', at: [8, 1], look: 'stairs', label: 'the steps up to the pier' }],
    place: [{ id: 'toW237', type: 'door', to: 'W237', at: [23, 20], look: 'hatch', lookOpt: { c: ['#8a8a3a'] }, cond: LOW, label: 'a hatch in the roof of a bus, half out of the mud' },
      { id: 'trailA', type: 'decor', at: [46, 20], look: 'scuff', solid: false, lines: ['Footprints, leading off the sand and out across the mud.'] },
      { id: 'trailB', type: 'decor', at: [8, 22], look: 'glint', solid: false, lines: ['Something glints where the footprints stop.'] },
      { id: 'lowbike', type: 'decor', at: [33, 8], look: 'carpart', lookOpt: { c: ['#6a6a3a'] }, cond: LOW, solid: false, lines: ['At low tide: the roof of a little car, as if it had parked here on purpose.'] },
      { id: 'lowring', type: 'decor', at: [12, 30], look: 'trinket', cond: LOW, solid: false, lines: ['At low tide: a wedding ring on a clam shell. The shell has grown round it.'] },
      { id: 'lowtv', type: 'decor', at: [24, 31], look: 'crt', cond: LOW, solid: false, lines: ['At low tide: a television, face down in the mud. It is still on. It is showing the sea.'] },
      SOUL([EN('The sea goes out to look at what it kept. Then it comes back and covers it up again.')])],
    signs: [{ at: [47, 18], lines: [EN('Someone walked out here at low tide. Step where they stepped, and only there.')] }],
    decor: [{ look: 'shell', n: 5, lines: ['A clam shell, open, empty, polished by the tide.', 'A shell with a tiny house drawn inside it in pencil.'] },
      { look: 'pebbles', n: 3, lines: ['Pebbles laid in a line, as if someone had counted the days.'] }],
    npcs: [{ id: 'N1219', name: 'A Clam-Digging Grandmother', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#6a5a6a', '#4a3a4a', '#e0c0a0', '#c8c8c8'], hat: 'straw' }), behavior: 'static', solid: true, at: [45, 10],
        lines: [{ if: LOW, t: '지금이야, 물 빠졌다! 버스 지붕 보이지?', lang: 'ko-s', tr: 'Now, the tide’s out! See the bus roof?' },
          KS('물 빠지면 버스 지붕이 보여. 옛날에 바다로 들어간 버스야.', 'When the tide goes out, you can see the roof of a bus. It drove into the sea, long ago.'),
          KS('발자국 밖으로 나가면 뻘이 잡아. 발자국만 밟아.', 'Step off the footprints and the mud grabs you. Only tread in the footprints.'),
          KS('물은 금방 다시 들어와. 한 시간 반이 아니라 일 분 반이야, 여기선.', 'The water comes back fast. Here it’s a minute and a half, not six hours.')] },
      { id: 'N1220', name: 'A Gull on the Mud', look: GULL, behavior: 'wander', radius: 6, speed: 1.2, solid: false, lines: ['A gull pulls at something in the mud: a ferry ticket, soaked, still legible. SINGLE.'] },
      { id: 'N1221', name: 'A Thing Made of Mud', look: { t: 'blob', c: ['#5a5048'], h: 12 }, behavior: 'wander', radius: 4, speed: 0.5, solid: false, passThrough: true,
        lines: ['A lump of mud with two bright eyes. When the tide comes back, it will be the sea floor again.', 'It blinks slowly. It has been here since the tide first went out.'] }],
    mech: [{ type: 'trail', from: 'trailA', to: 'trailB', slack: 0, give: 'E207',
      lostLine: 'She stepped off the footprints. The mud lets go of her, slowly. Back to the beginning.',
      winLines: ['At the end of the footprints there is nobody. Only a pebble of green glass, worn smooth by thirty winters.', 'You hold it up to your eye. The flats look thinner through it, like a page held up to the light.'] }],
    info: { summary: 'Grey mud flats cut by three channels with fords; every minute and a half, the tide goes out.',
      rules: ['Follow the footprints from the sand across the three fords to the glint: Sea Glass.',
        'At low tide (35 seconds in every 90), things surface: a car roof, a ring, a television…', '…and the roof hatch of a sunken bus, which leads to the Sunken Bus.'],
      secrets: ['The bus roof hatch, only at low tide.'], lore: 'What the sea keeps, and shows for a minute.' } });

  /* ---------------------------------------------------------------
   *  W229 — The Seaweed Field
   * --------------------------------------------------------------- */
  var RACKS = [[5, 6], [42, 6], [5, 11], [42, 11], [5, 16], [42, 16], [5, 21], [42, 21]];
  S({ id: 'W229', name: 'The Seaweed Field', depth: 2, tier: 'mid', back: 'W224', backLook: 'gate', backOpt: { c: ['#8a7a5a'] }, backLabel: 'back to the flats', backAt: [25, 0], outdoor: true,
    map: (function () {
      var g = K.grid(50, 34, '.');
      [6, 11, 16, 21, 26].forEach(function (y) { g.hline(6, 41, y, '{'); g.set(15, y, '.'); g.set(16, y, '.'); g.set(28, y, '.'); g.set(29, y, '.'); });
      g.scatter('n', '.', 0.1, 2291);
      return g.rows();
    })(),
    look: { floor: { p: 'sand', c: ['#c0b8a8', '#b0a898', '#d0c8b8'] }, snow: SNOWF }, tall: { '{': { look: 'fence', opt: { c: ['#8a7a5a', '#2a3a2a'] } } },
    style: { sky: ['#8a96a8', '#c8d0dc'] }, music: 'seaweedfield', amb: { type: 'wind', vol: 0.08 }, weather: { wind: 0.5, snow: true },
    place: RACKS.map(function (p, i) {
      return { id: 'rack' + i, type: 'decor', at: p, look: 'clothesline', lookOpt: { c: ['#7a6a4a', '#1a2a1a'] },
        lines: [['You turn the sheets of laver over. The undersides are still wet and smell of the whole sea.', 'You turn the rack. The black sheets crackle in the wind.', 'You turn them over. One sheet has a fish-shaped hole in it.', 'You turn the sheets. Snow starts on the side you just turned.'][i % 4]] };
    }).concat([{ id: 'kite', type: 'decor', at: [22, 13], look: 'flagpole', lookOpt: { c: ['#e0a040'] }, cond: { wind: true }, use: [{ secret: 'sea_kite' }],
        lines: ['The wind has found a kite tangled in the racks. On its tail, in felt-tip: “Dad and me. Summer.”', 'The string goes up into the sky and doesn’t come down anywhere.'] },
      { id: 'hut', type: 'decor', at: [45, 30], look: 'hut', lines: ['A drying hut. Inside, a calendar stopped at a winter that never ended, and a radio tuned to the North.'] },
      SOUL([KS('바다 냄새 나는 손으로 애 머리를 쓰다듬었어. 애는 그 냄새를 좋아했어.', 'I stroked my child’s hair with hands that smelled of the sea. She loved that smell.')])]),
    signs: [{ at: [25, 3], lines: [KS('눈 오기 전에 다 뒤집어야 돼. 하나도 빠짐없이.', 'Turn them all over before the snow. Every single one.')] }],
    npcs: [{ id: 'N1233', name: 'A Laver Woman', count: 2, look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#4a6a5a', '#3a5a4a', '#e0c0a0', '#1a1a1a'], hat: 'beanie', hatColor: '#c06040' }), behavior: 'wander', radius: 4, speed: 0.6, solid: true,
        lines: [KS('눈 오기 전에 다 뒤집어야 돼. 줄 끝마다 하나씩.', 'We have to turn them all before the snow. One at the end of every row.'),
          KS('김은 바람이 말려 줘. 우리는 기다리기만 하면 돼.', 'The wind dries the laver for us. All we have to do is wait.'),
          KS('옛날엔 북쪽에서도 김을 말렸대. 같은 바람으로.', 'They say they dried laver up north too, in the old days. With the same wind.')] },
      { id: 'N1234', name: 'The Wind', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 20,
        ambientLines: [EN('Hush. I am drying everything.'), EN('I have been north. It looks like here, but colder.'), EN('Open a window and I will come and find you.')] }],
    mech: [{ type: 'visitAll', marks: RACKS.map(function (p, i) { return 'rack' + i; }), give: 'E209', countText: '# of % racks turned.',
      winLines: ['The last sheet turns black and crisp in the wind.', 'One of the women rolls a bamboo mat round a bundle of laver and hands it to you, as if you were the bundle.', KS('가져가. 이거 덮고 있으면 다들 너도 김인 줄 알 거야.', 'Take it. With that over you, everyone will think you’re laver too.')] }],
    info: { summary: 'A field of laver drying on bamboo racks, behind the flats, under falling snow.',
      rules: ['Turn the laver on the rack at each end of the first four rows (eight racks): the Laver Mat.',
        'With the bedroom window open (wind), a kite appears, tangled in the racks.'],
      secrets: ['The kite (window open).'], lore: 'The same wind dries the laver on both sides of the sea.' } });

  /* ---------------------------------------------------------------
   *  W225 — The Shuttered High Street
   * --------------------------------------------------------------- */
  S({ id: 'W225', name: 'The Shuttered High Street', depth: 2, tier: 'mid', back: 'W221', backLook: 'door', backOpt: { style: 'wood', c: ['#5a4a3a'] }, backLabel: 'the alley down to the harbour', backAt: [27, 0], outdoor: true,
    map: (function () {
      var g = K.grid(54, 24, '#');
      g.hline(0, 53, 8, '.'); g.rect(0, 9, 54, 6, ','); g.hline(0, 53, 15, '.'); g.rect(26, 0, 3, 8, '.');
      g.scatter('n', ',', 0.1, 2251); g.scatter('n', '.', 0.2, 2252);
      return g.rows();
    })(),
    look: { floor: { p: 'tile', c: ['#8a8a88', '#6a6a68'] }, floor2: { p: 'asphalt', c: ['#3a3a42'] }, snow: SNOWF, wall: { p: 'brick', c: ['#5a4a48', '#4a3a38', '#3a2a28'] } },
    style: { sky: ['#1a1a28', '#3a3a50'] }, music: 'shutteredstreet', amb: { type: 'wind', vol: 0.05 }, dark: 0.45, weather: { snow: true },
    doors: [{ to: 'W232', at: [12, 16], look: 'door', opt: { style: 'glass', c: ['#e0f0f0'] }, label: 'the bathhouse' },
      { to: 'W003', at: [0, 12], look: 'gate', opt: { c: ['#6a5a6a'] }, label: 'the road back to the town at dusk' },
      { to: 'W235', at: [47, 11], look: 'train', opt: { c: ['#3a6a5a', '#f0e0a0'] }, cond: { flag: 'sea_bus_came' }, label: 'the last bus, doors open' }],
    place: [{ id: 'litshutter', type: 'decor', at: [40, 7], look: 'door', lookOpt: { style: 'metal', c: ['#a8a090'] }, light: 1.5,
        lookIf: [{ cond: { flag: 'sea_shutter' }, lookOpt: { style: 'metal', c: ['#a8a090'], ajar: true } }],
        lines: ['A shutter with a light on behind it. The only one in the street.'] },
      { id: 'shutter1', type: 'decor', at: [8, 7], look: 'door', lookOpt: { style: 'metal', c: ['#7a7a80'] }, lines: ['A rolled-down shutter: “Closed until the ferry runs.”'] },
      { id: 'shutter2', type: 'decor', at: [18, 7], look: 'door', lookOpt: { style: 'metal', c: ['#7a7a80'] }, lines: ['A shutter, padlocked. Someone has drawn a little sun on it in the frost.'] },
      { id: 'shutter3', type: 'decor', at: [34, 7], look: 'door', lookOpt: { style: 'metal', c: ['#7a7a80'] }, lines: ['A shutter. Behind it, very faintly, a radio playing the weather for a coast that isn’t this one.'] },
      { id: 'busstop', type: 'decor', at: [50, 15], look: 'telepole', lines: ['A bus stop. The timetable lists a single bus: THE LAST ONE. No time is given.'] },
      { id: 'fishbread', type: 'decor', at: [20, 15], look: 'stall2', lookOpt: { c: ['#c04030'] }, light: 1.6, lines: ['A fish-bread stall. Little fish-shaped cakes in an iron mould, steaming in the snow.'] },
      { id: 'chimney', type: 'decor', at: [14, 15], look: 'pillar', lookOpt: { c: ['#8a6a5a'] }, lines: ['The bathhouse chimney, warm to the touch. It is the warmest thing in town.'] },
      SOUL([EN('Every shop here closed the year the ferry was meant to leave. They’ll open again when it comes back.')])],
    signs: [{ at: [45, 13], lines: [EN('The bus comes for those who stop looking down the road.')] }],
    decor: [{ look: 'payphone', n: 1, lines: ['A telephone box with a light on. Inside, a phone card worth exactly one call.'] },
      { look: 'streetlamp', n: 3, lines: ['A street lamp. Snow falls through its light and nowhere else.'] }],
    npcs: [{ id: 'N1222', name: 'The Fish-Bread Seller', look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#e0d0b0', '#c0b090', '#e8c8a8', '#2a1a10'], hat: 'beanie', hatColor: '#c03030' }), behavior: 'static', solid: true, at: [21, 14],
        lines: [KS('붕어빵 사 가. 따뜻할 때. 금방 식어.', 'Buy some fish-bread. While it’s warm. It goes cold fast.'),
          KS('불 켜진 셔터 있지? 세 번 두드려 봐. 아는 사람만 세 번 두드려.', 'See the shutter with the light on? Knock three times. Only people who know knock three times.'),
          KS('막차는 길 쳐다보는 사람한테는 안 와. 그냥 가만히 서 있어.', 'The last bus never comes for someone watching the road. Just stand still.')] },
      { id: 'N1224', name: 'An Old Man Shovelling Snow', look: H({ t: 'old', body: 'coat', c: ['#5a4a3a', '#4a3a2a', '#e0c0a0', '#d0d0d0'], hat: 'beanie', hatColor: '#3a4a6a', acc: 'broom' }), behavior: 'static', solid: true, at: [8, 10],
        lines: [{ seq: ['He shovels snow off the road. Behind him, it snows back.', KS('치워도 또 와. 그래도 치워야지.', 'You clear it and it comes back. You clear it anyway.')] }] },
      { id: 'N1223', name: 'Behind the Shutters', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 24,
        ambientLines: [EN('…we’re closed. We’ve been closed for years. Come in.'), KS('문 닫았어요. 내일 와요. 내일은 항상 있어요.', 'We’re closed. Come tomorrow. There’s always a tomorrow.')] }],
    mech: [{ type: 'standStill', zone: [45, 14, 49, 15], secs: 15, flag: 'sea_bus_came', breakLine: 'She looked down the road. The bus noticed, and stayed away.',
      reward: [{ set: { sea_bus_came: true } }],
      winLines: ['Headlights, at last, through the snow. The last bus pulls up without a sound and opens its doors.', KS('타세요. 막차예요.', 'Get on. It’s the last bus.')] },
      { type: 'knock', mark: 'litshutter', n: 3, within: 2.5, flag: 'sea_shutter', firstLine: 'Knock. Behind the shutter, someone stops moving.',
        doneLine: 'Under the shutter, the shelf of unsaid things. Still not for sale.',
        reward: [{ set: { sea_shutter: true } }, { secret: 'sea_unsaid_shop' }],
        winLines: ['The lit shutter rolls up by itself, just high enough to look under.', 'Inside: a shop with one shelf. On the shelf, in jars, the things nobody said: “sorry”, “stay”, “I’m home”.', 'They are not for sale. You can only look.'] }],
    info: { summary: 'The high street at night: every shop shuttered but one, a fish-bread stall, a bus stop with no times.',
      rules: ['Stand still at the bus stop for fifteen seconds: the last bus comes (The Last Bus to the Sea).',
        'Knock three times quickly on the lit shutter: the shop of things nobody said.', 'A door leads back to the Town at Dusk.'],
      secrets: ['The shop of unsaid things, behind the lit shutter.'], lore: 'A street closed until the ferry runs.' } });
  link('W003', { to: 'W225', look: 'door', lookOpt: { style: 'glass', c: ['#c8d8e0'] }, label: 'a bus shelter with a timetable for the sea' });

  /* ---------------------------------------------------------------
   *  W232 — The Seaside Bathhouse
   * --------------------------------------------------------------- */
  S({ id: 'W232', name: 'The Seaside Bathhouse', depth: 2, tier: 'mid', back: 'W225', backLook: 'door', backOpt: { style: 'glass', c: ['#e0f0f0'] }, backLabel: 'out into the snow', backAt: [18, 21],
    map: (function () {
      var g = K.grid(36, 22, ' '); g.box(0, 0, 36, 22, '#', 't');
      g.hline(2, 14, 1, '{');
      g.rect(18, 6, 10, 6, 'w'); g.rect(6, 14, 6, 4, 'w');
      g.vline(31, 1, 8, '#'); g.hline(31, 34, 8, '#'); g.set(31, 4, '?');
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'tile', c: ['#e8ecec', '#c8d0d0'] }, { p: 'tile', c: ['#f0f4f4', '#d0d8d8', '#98a8a8'] }, '#4a8a8a'),
      { tile: { p: 'tile', c: ['#e0e8e8', '#b8c8c8'] }, shallow: { p: 'water', c: ['#8ac8d0', '#7ab8c0', '#a8e0e8', '#ffffff'] } }),
    tall: { '{': { look: 'locker', opt: { c: ['#8ab0b8'] } } }, style: { tallWalls: true, filter: 'brightness(1.08) saturate(0.85)' }, music: 'bathhouse', amb: { type: 'drip', vol: 0.06 }, weather: { dust: true },
    place: [{ id: 'mirror', type: 'decor', at: [16, 1], look: 'mirror', lines: ['A big mirror, fogged over. Someone has drawn a smiley face in the steam, very low down, at a child’s height.'] },
      { id: 'mural', type: 'decor', at: [24, 1], look: 'mural', lines: ['A tiled mural: a mountain falling straight into the sea. Someone has added, in grease pencil, a tiny ferry.'] },
      { id: 'lastlocker', type: 'decor', at: [30, 4], look: 'locker', lookOpt: { c: ['#8ab0b8'] }, lines: ['The last locker has no number. The wall beside it is a slightly different white, like steam on glass.'] },
      { id: 'towel', type: 'decor', at: [33, 3], look: 'towel', use: [{ secret: 'sea_oksun_towel' }],
        lines: ['A towel folded into a little lamb, the way grandmothers fold them. Embroidered in one corner: 옥순.', 'It is still warm, as if someone had just used it to dry a child’s hair.'] },
      SOUL([KS('할머니가 등 밀어 줄 때 제일 아팠고 제일 좋았어.', 'When Grandma scrubbed my back it hurt the most and felt the best.')], [33, 6]),
      SOUL([EN('Hot water, cold tap, hot water. That was a whole Sunday.')])],
    decor: [{ look: 'stool', n: 4, lines: ['A little plastic stool and a plastic bowl. Every Sunday, a grandmother and a girl sat on two of these.'] },
      { look: 'sink', n: 2, lines: ['A row of taps. One drips in time with someone’s heartbeat.'] }],
    npcs: [{ id: 'N1240', name: 'The Back-Scrubbing Lady', look: H({ t: 'adult', hairStyle: 'short', body: 'shirt', c: ['#e04050', '#c03040', '#e8c8a8', '#2a1a10'] }), behavior: 'static', solid: true, at: [8, 9],
        lines: [KS('탕에 가만히 앉아 있어. 움직이면 김이 다 날아가.', 'Sit still in the bath. Move and all the steam flies off.'),
          KS('등 밀어 줄까? 할머니들은 다 서로 등 밀어 줘.', 'Shall I scrub your back? The grandmothers all scrub each other’s backs.'),
          'She has a scrubbing mitt on each hand and nobody’s back to scrub.'] },
      { id: 'N1241', name: 'A Grandmother in the Steam', count: 2, look: ghost('rgba(255,240,230,0.55)', 20), behavior: 'statue', solid: false,
        lines: [KS('물 좋다… 아이고, 좋다.', 'The water’s lovely… oh, that’s lovely.'), KS('우리 손녀도 데려와야 하는데. 다음 주에.', 'I should bring my granddaughter. Next week.')] }],
    mech: [{ type: 'standStill', zone: [20, 7, 25, 10], secs: 20, flag: 'sea_steam', breakLine: 'She moved. The steam fled to the ceiling.',
      reward: [{ set: { sea_steam: true } }, { secret: 'sea_bath_mirror' }],
      winLines: ['You sit still in the hot water until you can no longer tell where you end.', 'The steam lifts off the big mirror.', 'In it, a grandmother is scrubbing a little girl’s back. Both of them are laughing at the cold tap.', 'Then the steam comes back, gently, like a blanket.'] }],
    info: { summary: 'A bathhouse on the high street: steam, tiled walls, a hot pool, a mural of a mountain falling into the sea.',
      rules: ['Sit still in the hot pool for twenty seconds: the steam lifts off the mirror for a moment.',
        'With the Sea Glass, the wall beside the last locker lets you through to a small nook with a folded towel.'],
      secrets: ['The nook behind the lockers (Sea Glass): the towel embroidered 옥순.'], lore: 'Sundays with the grandmother, kept in the steam.' } });

  /* ---------------------------------------------------------------
   *  W235 — The Last Bus to the Sea (passenger 5: the driver)
   * --------------------------------------------------------------- */
  function busMap(len) {
    var g = K.grid(len, 5, ' '); g.box(0, 0, len, 5, '#', '.');
    for (var x = 3; x < len - 4; x += 2) { g.set(x, 1, '{'); g.set(x, 3, '{'); }
    return g.rows();
  }
  var BUS = Object.assign(INDOOR({ p: 'hstripes', c: ['#4a4a44', '#3a3a34'] }, { p: 'panel', c: ['#c8c0a0', '#a8a080', '#6a6450'] }, '#3a6a5a'), {});
  S({ id: 'W235', name: 'The Last Bus to the Sea', depth: 2, tier: 'mid', back: 'W225', backLook: 'door', backOpt: { style: 'glass', c: ['#a8c8c0'] }, backLabel: 'the rear doors, back to the high street', backAt: [44, 4],
    map: busMap(46), look: BUS, tall: { '{': { look: 'trainseat', opt: { c: ['#3a6a8a'] } } }, style: { tallWalls: true }, music: 'lastbus', amb: { type: 'train', vol: 0.08 }, dark: 0.35,
    doors: [{ to: 'W237', at: [2, 4], look: 'door', opt: { style: 'glass', c: ['#a8c8c0'] }, cond: { flag: 'sea_p_bus' }, label: 'the front doors, at the terminus',
      locked: 'The front doors stay shut while the driver is at the wheel. Ahead, the road runs straight into the sea.' }],
    place: [{ id: 'b1', type: 'decor', at: [8, 0], look: 'switch', lookOpt: { c: ['#e04040'] }, lines: ['A stop button.'] },
      { id: 'b2', type: 'decor', at: [16, 0], look: 'switch', lookOpt: { c: ['#e04040'] }, lines: ['A stop button.'] },
      { id: 'b3', type: 'decor', at: [24, 0], look: 'switch', lookOpt: { c: ['#e04040'] }, lines: ['A stop button.'] },
      { id: 'b4', type: 'decor', at: [32, 0], look: 'switch', lookOpt: { c: ['#e04040'] }, lines: ['A stop button.'] },
      { id: 'routemap', type: 'decor', at: [40, 0], look: 'frame', lines: ['The route map: HARBOUR · FISH MARKET · BATHHOUSE · BREAKWATER · ——. The last stop is scratched out.'] },
      { id: 'driverseat', type: 'decor', at: [1, 1], look: 'trainseat', lookOpt: { c: ['#2a2a2a'] }, lines: ['The driver’s seat, worn into the shape of thirty years.'] },
      SOUL([KS('막차 놓치면 걸어가면 돼. 바다까지는 안 멀어.', 'If you miss the last bus, you can walk. The sea isn’t far.')])],
    decor: [10, 20, 30, 38].map(function (x, i) { return { look: 'window', at: [x, 4], lines: [['Outside: the coast road, the sea, the coast road again. The bus has been going round for a long time.', 'Your reflection in the dark window. Behind it, the lit windows of houses where nobody is waiting up.'][i % 2]] }; }),
    npcs: [{ id: 'N1248', name: 'The Bus Driver', look: H({ t: 'adult', body: 'uniform', c: ['#3a5a4a', '#2a4a3a', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#2a4a3a' }), behavior: 'static', solid: true, at: [1, 2], goneIf: { flag: 'sea_p_bus' },
        lines: [KS('벨은 정류장 순서대로 눌러. 소리 잘 들어 봐. 다 외우면 내려 줄게.', 'Press the bells in the order of the stops. Listen carefully. Learn them all and I’ll let you off.'),
          KS('이 버스는 바다까지만 가. 종점? 집 앞이지. 아무도 거기서 안 내리지만.', 'This bus only goes as far as the sea. The terminus? In front of home. Nobody ever gets off there.'),
          KS('삼십 년째 막차만 몰았어. 첫차는 어떻게 생겼는지도 몰라.', 'Thirty years driving nothing but the last bus. I don’t even know what the first one looks like.')] },
      { id: 'N1250', name: 'A Passenger Asleep Against the Window', count: 3, look: H({ t: 'adult', body: 'coat', c: ['#5a4a5a', '#4a3a4a', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'statue', solid: false, passThrough: true,
        lines: ['A passenger asleep against the window. Her breath fogs the glass in the shape of a house.', 'He has missed his stop so many times that he no longer has one.'] },
      { id: 'N1249', name: 'The Next-Stop Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 18,
        ambientLines: [KS('다음 정류장은 수산시장입니다.', 'Next stop: the fish market.'), KS('다음 정류장은 목욕탕 앞입니다.', 'Next stop: the bathhouse.'), KS('이번 정류장은 종점, 바닷속입니다.', 'This stop is the terminus: under the sea.'), EN('Please hold on. The bus is turning towards the sea.')] }],
    mech: [{ type: 'sequence', order: ['b2', 'b4', 'b1', 'b3'], ring: { every: 1.6, pause: 4, sfx: 'bell', hear: 50, glyph: '♪' }, flag: 'sea_p_bus', give: 'E210', doneLine: 'The bells are quiet. The bus drives itself now.',
      wrongLine: 'Ding. The driver shakes his head without turning round. Wrong stop.',
      reward: [{ set: { sea_p_bus: true } }],
      winLines: ['The four bells ring in the right order. The driver nods, pulls the handbrake and stands up.', KS('다 외웠네. 그럼 나도 내려야지. 배 타러.', 'You’ve learned them all. Then I can get off too. To catch the boat.'), 'He leaves his stop button on the dashboard, unscrewed, still warm. Nobody is driving now. The bus goes on.'] }],
    info: { summary: 'The last bus of the night, going round the coast road with its windows fogged.',
      rules: ['From the High Street, once you have waited without moving at the bus stop.',
        'The four stop buttons ring one after another, in a loop: press them in the order they ring.', 'The driver gives you the Last Bus Bell and goes to board the ferry.',
        'With nobody at the wheel, the front doors open at the terminus: the Sunken Bus.'],
      secrets: ['The terminus under the sea, once the driver has gone.'], lore: 'Thirty years of last buses and never a first one.' } });

  /* ---------------------------------------------------------------
   *  W237 — The Sunken Bus (P3)
   * --------------------------------------------------------------- */
  S({ id: 'W237', name: 'The Sunken Bus', depth: 3, tier: 'hard', back: 'W224', backLook: 'hatch', backOpt: { c: ['#8a8a3a'] }, backLabel: 'the roof hatch, up into the mud', backAt: [20, 0], backArrive: 'toW237',
    map: busMap(44), look: Object.assign({}, BUS, { floor: { p: 'sand', c: ['#4a6a6a', '#3a5a5a', '#5a7a7a'] } }), tall: { '{': { look: 'trainseat', opt: { c: ['#2a5a6a'] } } },
    style: { tallWalls: true, renderer: 'watercolor', filter: 'hue-rotate(150deg) saturate(0.7) brightness(0.85)' }, music: 'sunkenbus', amb: { type: 'underwater', vol: 0.1 }, dark: 0.5, weather: { dust: true },
    doors: [{ to: 'W235', at: [2, 4], look: 'door', opt: { style: 'glass', c: ['#6a9a9a'] }, label: 'the front doors, onto a bus that is still driving' }],
    place: [{ id: 'toW236', type: 'door', to: 'W236', at: [40, 4], look: 'door', lookOpt: { style: 'glass', c: ['#6a9a9a'] }, cond: { flag: 'sea_stop' }, label: 'the rear doors, open onto the pilings' },
      { id: 'driverseat', type: 'decor', at: [1, 1], look: 'trainseat', lookOpt: { c: ['#1a2a2a'] }, lines: ['The driver’s seat, empty. Weed grows from the steering wheel like hair.'] },
      { id: 'stopbtn', type: 'decor', at: [30, 0], look: 'switch', lookOpt: { c: ['#a04040'] },
        onEffect: { E210: [{ set: { sea_stop: true } }, { lines: ['You press your stop button against the dead one. Ding.', 'Somewhere at the back, the rear doors hiss open onto a forest of pier pilings.'] }, { reeval: true }] },
        lines: ['A stop button, rusted solid. Its own button is missing; there is only the hole where one goes.'] },
      { id: 'routemap', type: 'decor', at: [12, 0], look: 'frame', lines: ['The route map, under water. The last stop is scratched out. Someone has written over it, very small.'] },
      SOUL([EN('The bus drove into the sea because the road went on, and so did the driver.')]),
      SOUL([KS('기사님, 여기서 내려 주세요. 집 앞이에요.', 'Driver, let me off here please. It’s in front of my house.')])],
    decor: [8, 18, 28, 36].map(function (x, i) { return { look: 'window', at: [x, 4], lines: [['Through the window, green water and a shoal of fish going past like traffic.', 'Through the window: the underside of the tide, and a bicycle wheel turning slowly in the current.'][i % 2]] }; }),
    npcs: [{ id: 'N1253', name: 'A Drowned Passenger', count: 4, look: H({ t: 'adult', body: 'coat', c: ['#4a6a7a', '#3a5a6a', '#b8d0d0', '#1a2a2a'], eyes: 'closed', alpha: 0.6 }), behavior: 'statue', solid: false, passThrough: true,
        lines: ['A passenger sitting very upright, hands on her knees, hair floating. She is waiting for her stop.', 'He holds a bag of shopping that has been dissolving for decades.'] },
      { id: 'N1254', name: 'A Fish with a Season Ticket', count: 3, look: { t: 'fish', c: ['#c0d8d0'], h: 8 }, behavior: 'swim', radius: 8, speed: 0.6, solid: false,
        lines: ['A small fish swims in through one window and out of another. It travels this way every day.'] },
      { id: 'N1255', name: 'The Drowned Announcement', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 20,
        ambientLines: [KS('이번 정류장은…', 'This stop is…'), EN('…please remember to take all your belongings…'), EN('…this bus terminates here. This bus terminates here. This bus…')] }],
    mech: [{ type: 'sayTo', mark: 'driverseat', dist: 3, flag: 'sea_terminus', words: ['home', 'in front of home', 'house', 'our house', '집', '집 앞', '우리 집'],
      wrong: 'The bus does not know that stop.', doneLine: 'The seats are empty now. Everyone got off at home.',
      reward: [{ set: { sea_terminus: true } }, { secret: 'sea_drowned_home' }],
      winLines: ['The empty driver’s seat creaks. The bus shudders, as if braking.', 'All the drowned passengers stand up, take their bags and get off through a door that isn’t there.', 'They are home.', 'You stay on. It isn’t your stop.'] }],
    info: { summary: 'A bus on the sea floor under the flats: drowned passengers waiting for a stop scratched off the map.',
      rules: ['Reached through the roof hatch on the Tidal Flats at low tide, or through the front doors of the Last Bus.',
        'Tell the driver’s seat the terminus (“home”, as the driver of the last bus said): the passengers get off.',
        'Use the Last Bus Bell facing the rusted stop button: the rear doors open onto Under the Pier.'],
      secrets: ['The rear doors (Last Bus Bell).'], lore: 'Everyone on this bus was going home.' } });

  /* ---------------------------------------------------------------
   *  W226 — The Quayside Karaoke (passenger 2: Manager Kim)
   * --------------------------------------------------------------- */
  var DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  S({ id: 'W226', name: 'The Quayside Karaoke', depth: 2, tier: 'mid', back: 'W221', backLook: 'door', backOpt: { style: 'red', c: ['#b04078'] }, backLabel: 'out onto the quay', backAt: [0, 9],
    map: (function () {
      var g = K.grid(34, 20, ' '); g.box(0, 0, 34, 20, '#', 'c');
      g.hline(1, 32, 8, '#'); g.hline(1, 32, 11, '#');
      [9, 17, 25].forEach(function (x) { g.vline(x, 1, 7, '#'); });
      [4, 13, 21, 29].forEach(function (x) { g.set(x, 8, 'c'); });
      g.set(16, 11, 'c'); g.set(17, 11, 'c');
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'carpet', c: ['#3a1a40', '#2a1030', '#c8a040'] }, { p: 'wallpaper', c: ['#4a2050', '#3a1040', '#e060c0'] }, '#1a0820'), { carpet: { p: 'carpet', c: ['#3a1a40', '#2a1030', '#c8a040'] } }),
    style: { tallWalls: true }, music: 'quaykaraoke', amb: { type: 'music_box', vol: 0.05 }, dark: 0.55,
    place: DIGITS.slice(0, 4).map(function (d, i) { return { id: 'd' + (i + 1), type: 'decor', at: [4 + i * 3, 12], look: 'neon', lookOpt: { text: '0', c: ['#40e0ff'] }, light: 1.2, lines: ['A digit on the song machine.'] }; })
      .concat([{ id: 'screen', type: 'decor', at: [24, 12], look: 'screen', lookOpt: { c: ['#3a2a6a'] }, light: 2,
        lines: [{ if: { flag: 'sea_p_song' }, t: 'The screen shows a harbour, a lit window and two words: GOING HOME. It plays to an empty room now.' }, { if: { notFlag: 'sea_p_song' }, t: 'The screen shows waves, a salaryman walking home at midnight, waves. The lyrics scroll too fast to read.' }] },
        { id: 'songbook', type: 'decor', at: [12, 3], look: 'book', lines: ['A songbook. One page is soft from turning: no. 12··. The last two digits are rubbed away by a thumb.'] },
        { id: 'room4note', type: 'decor', at: [30, 8], look: 'frame', lines: ['A paper on the door of the last booth: “Room 4 — after midnight”.'] },
        { id: 'room4mic', type: 'decor', at: [29, 3], look: 'sofa', lookOpt: { c: ['#6a2a4a'] }, cond: { realHour: [0, 4] }, use: [{ secret: 'sea_room4' }],
          lines: ['Room four. A microphone, still warm. Someone sang here just now, very softly, so as not to wake anyone.', 'On the screen, the score: 100. Nobody was there to see it.'] },
        { id: 'room4dark', type: 'decor', at: [29, 3], look: 'sofa', lookOpt: { c: ['#3a1a2a'] }, cond: { not: { realHour: [0, 4] } }, lines: ['Room four is dark. The microphone is cold. It’s too early.'] },
        SOUL([KS('아빠 노래는 맨날 똑같았어. 집에 가는 노래.', 'Dad always sang the same song. The one about going home.')]),
        SOUL([EN('He sang so he wouldn’t have to say he wanted to leave.')])]),
    signs: [{ at: [20, 9], lines: [EN('Home by twelve. Room four. Every time, the same song.')] }],
    decor: [{ look: 'table', n: 2, lines: ['A low table covered in empty glasses and one untouched plate of fruit, for the boss.'] },
      { look: 'tv', n: 2, lines: ['A booth screen showing a beach in summer, on a loop. The same child runs into the same wave.'] }],
    npcs: [{ id: 'N1225', name: 'Manager Kim', look: H({ t: 'adult', body: 'suit', c: ['#3a3a44', '#2a2a34', '#e0c8a8', '#1a1a1a'], acc: 'mic' }), behavior: 'static', solid: true, at: [24, 15], goneIf: { flag: 'sea_p_song' },
        lines: [KS('부장님이 한 곡만 더 하래. 한 곡만. 벌써 몇 곡째지…', 'The boss says one more song. Just one. How many does that make…'),
          KS('열두 시까지는 들어간다고 했는데. 딸한테 약속했는데.', 'I said I’d be home by twelve. I promised my daughter.'),
          KS('집에 가는 노래가 있었는데… 번호가 기억이 안 나.', 'There was a song about going home… I can’t remember its number.')] },
      { id: 'N1227', name: 'A Colleague Clapping', count: 3, look: H({ t: 'adult', body: 'suit', c: ['#4a4a54', '#3a3a44', '#e0c8a8', '#1a1a1a'], eyes: 'closed', mouth: 'smile' }), behavior: 'statue', solid: true,
        lines: ['A colleague claps on the beat with his eyes shut. He has been clapping since 1989.', { seq: ['She raises her glass to nobody.', KS('위하여!', 'Cheers!')] }] },
      { id: 'N1226', name: 'The Boss’s Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 16,
        ambientLines: [KS('김 과장! 한 곡 더!', 'Manager Kim! One more song!'), KS('벌써 가? 분위기 깨지 말고.', 'Leaving already? Don’t spoil the mood.'), KS('내일 회의는 아홉 시야. 오늘은 놀자고.', 'Tomorrow’s meeting is at nine. Tonight, we enjoy ourselves.')] }],
    mech: [{ type: 'dials', marks: ['d1', 'd2', 'd3', 'd4'], states: 10, target: [1, 2, 0, 4], values: DIGITS, optKey: 'text', labelText: 'The digit turns: ', flag: 'sea_p_song', give: 'E212', doneLine: 'The song machine still shows 1204. Nobody is singing.',
      reward: [{ set: { sea_p_song: true } }],
      winLines: ['Song number 1204. The machine plays a tune nobody else ever chose.', 'On the screen: a harbour, a lit window, GOING HOME.', 'Manager Kim puts down the microphone. His hands are shaking a little.', KS('부장님, 죄송합니다. 먼저 들어가 보겠습니다.', 'Sir, I’m sorry. I’ll be heading home first.'), 'Nobody stops him. On the table, he leaves a tambourine, still jingling.'] }],
    info: { summary: 'A karaoke bar on the quay: four booths, a big screen, a salaryman singing because the boss wants more.',
      rules: ['Set the four digits of the song machine to 1204.', 'Hints: “home by twelve” and “room four”, the fishwife humming “oh-four”, the songbook’s 12··.',
        'Manager Kim goes home, that is, to the ferry; he leaves the Tambourine.', 'Between midnight and four in the morning (real time), Room 4 holds a warm microphone.'],
      secrets: ['Room 4, after midnight (real time).'], lore: 'Manager Kim, Mi-ran’s father, who never said no to one more song.' } });

  /* ---------------------------------------------------------------
   *  W227 — The Closed Pier
   * --------------------------------------------------------------- */
  S({ id: 'W227', name: 'The Closed Pier', depth: 2, tier: 'mid', back: 'W020', backLook: 'gate', backOpt: { c: ['#5a6a7a'] }, backLabel: 'the gate back to the funfair', backAt: [20, 29], outdoor: true,
    map: (function () {
      var g = K.grid(40, 30, '~');
      g.rect(15, 0, 10, 30, '='); g.rect(6, 8, 28, 13, '='); g.hline(15, 24, 0, '~'); g.rect(17, 1, 6, 2, '_');
      return g.rows();
    })(),
    look: { floor: { p: 'plank', c: ['#6a5a4a', '#5a4a3a', '#7a6a5a'] }, bridge: { p: 'plank', c: ['#6a5a4a', '#5a4a3a', '#7a6a5a'] }, water: SEA, pit: { p: 'void', c: ['#0a1018'] } },
    style: { sky: ['#141a26', '#2a3446'] }, music: 'closedpier', amb: { type: 'wind', vol: 0.07 }, dark: 0.6, weather: { snow: true },
    variants: { lit: { cond: { flag: 'sea_pier_lit' }, dark: 0.2 } },
    fall: { to: 'W236' },
    doors: [{ to: 'W224', at: [33, 14], look: 'stairsdown', label: 'steps down to the mud flats' },
      { to: 'W233', at: [6, 14], look: 'stairsdown', label: 'steps down to a beach of sandals' }],
    place: [{ id: 'carousel', type: 'decor', at: [11, 11], look: 'carousel', lines: ['A carousel under a tarpaulin. One horse has kicked its way out and stares at the sea.'] },
      { id: 'ferris', type: 'decor', at: [28, 10], look: 'ferris', lines: ['A small Ferris wheel, its cars swinging empty. One car is stuck at the top with a child’s scarf in it.'] },
      { id: 'shooting', type: 'decor', at: [10, 18], look: 'stall2', lookOpt: { c: ['#c04040'] }, lines: ['A shooting stall. The prizes are all ferry tickets.'] },
      { id: 'fortune', type: 'decor', at: [29, 18], look: 'arcade', use: [{ if: { flag: 'sea_pier_lit' }, secret: 'sea_pier_fortune' }],
        lines: [{ if: { flag: 'sea_pier_lit' }, t: 'The fortune machine lights up and gives you a card: “Someone waits for you on a boat that will not leave.”' }, { if: { notFlag: 'sea_pier_lit' }, t: 'A fortune machine, unplugged. Its painted fortune-teller has her eyes shut.' }] },
      { id: 'kiosk', type: 'decor', at: [20, 23], look: 'stall', lines: ['A shuttered kiosk: ICE CREAM. A notice: “Back in the summer.” It doesn’t say which.'] },
      { id: 'lamp1', type: 'decor', at: [15, 5], look: 'streetlamp', lookOpt: { off: true }, lookIf: [{ cond: { flag: 'sea_pier_lit' }, lookOpt: {} }], lines: ['A pier lamp.'] },
      { id: 'lamp2', type: 'decor', at: [24, 5], look: 'streetlamp', lookOpt: { off: true }, lookIf: [{ cond: { flag: 'sea_pier_lit' }, lookOpt: {} }], lines: ['A pier lamp.'] },
      { id: 'lamp3', type: 'decor', at: [15, 25], look: 'streetlamp', lookOpt: { off: true }, lookIf: [{ cond: { flag: 'sea_pier_lit' }, lookOpt: {} }], lines: ['A pier lamp.'] },
      { id: 'lamp4', type: 'decor', at: [24, 25], look: 'streetlamp', lookOpt: { off: true }, lookIf: [{ cond: { flag: 'sea_pier_lit' }, lookOpt: {} }], lines: ['A pier lamp.'] },
      SOUL([EN('Summer came here once. It left its sandals and never came back for them.')])],
    signs: [{ at: [16, 4], lines: [EN('Lean on the missing planks long enough and the pier lets go of you.')] }],
    decor: [{ look: 'balloons', n: 1, lines: ['A bunch of balloons tied to the rail, gone soft in the cold. They still want to go up.'] },
      { look: 'bench', n: 2, lines: ['A bench facing the sea. A plaque: “For J., who loved this view.” The rest has worn off.'] }],
    npcs: [{ id: 'N1229', name: 'The Clockwork Sailor', look: H({ t: 'doll', body: 'uniform', c: ['#f0f0f0', '#2a3a6a', '#f0d0b0', '#1a1a1a'], hat: 'cap', hatColor: '#f0f0f0' }), behavior: 'static', solid: true, at: [20, 14],
        lines: [{ seq: ['A clockwork sailor in a glass box. It dances five steps, then stops, one hand held out.', 'It is waiting for someone to dance the steps back to it.'] }, 'Its key turns by itself, very slowly, like a heartbeat.'] },
      { id: 'N1228', name: 'The Ride Attendant Who Stayed', look: H({ t: 'adult', body: 'coat', c: ['#a03030', '#802020', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#a03030' }), behavior: 'static', solid: true, at: [17, 24],
        lines: [EN('Closed for the season. The season has been very long.'), EN('If you want the lights, you have to dance with him. Copy him. He’s shy.'),
          EN('The far end is rotten. Don’t lean on it. Or do. People fall through to somewhere.')] },
      { id: 'N1257', name: 'A Pier Cat', look: { t: 'cat', c: ['#e0a060'], h: 9 }, behavior: 'wander', radius: 5, speed: 0.8, solid: false, passThrough: true,
        lines: ['A pier cat, fat on old chips. It has seen the pier open. It does not recommend it.'] }],
    mech: [{ type: 'dirSequence', ent: 'N1229', seq: ['up', 'left', 'down', 'right', 'up'], dist: 5, flag: 'sea_pier_lit',
      reward: [{ set: { sea_pier_lit: true } }, { secret: 'sea_pier_dance' }],
      winLines: ['You dance the five steps back to him. The clockwork sailor bows, very stiffly.', 'One by one, the bulbs of the pier come on, all the way to the broken end. Next time you come, it will be lit.'] }],
    info: { summary: 'A pier closed for the winter: a carousel under a tarpaulin, a little Ferris wheel, rotten planks at the end.',
      rules: ['Standing near the clockwork sailor, dance back his five steps (up, left, down, right, up).', 'The pier lights up and the fortune machine works.',
        'Push against the missing planks at the far end long enough: you fall through to Under the Pier.',
        'Steps lead down to the Tidal Flats and to the Sandal Shore.'],
      secrets: ['The fall through the broken planks.'], lore: 'A summer place, kept closed until summer comes back.' } });
  link('W020', { to: 'W227', look: 'gate', lookOpt: { c: ['#5a6a7a'] }, label: 'a gate that smells of salt' });

  /* ---------------------------------------------------------------
   *  W236 — Under the Pier (P3)
   * --------------------------------------------------------------- */
  S({ id: 'W236', name: 'Under the Pier', depth: 3, tier: 'hard', back: 'W227', backLook: 'ladder', backLabel: 'the ladder up to the pier', backArrive: [20, 4],
    gen: { type: 'forest', w: 44, h: 32, opts: { density: 0.3, tree: '^', grass: 'w', border: true } },
    look: { floor: { p: 'sand', c: ['#3a4a4a', '#2e3e3e', '#4a5a5a'] }, shallow: { p: 'water', c: ['#2a3a48', '#203040', '#3a4a58', '#8aa0b0'] } },
    tall: { '^': { look: 'pillar', opt: { c: ['#4a3a2a'] } } }, style: { sky: ['#05080c', '#101820'] }, music: 'underpier', amb: { type: 'drip', vol: 0.08 }, dark: 0.65,
    doors: [{ to: 'W237', look: 'telepole', opt: { c: ['#a0a060'] }, cond: { equipped: 'E207' }, label: 'a bus stop standing in the water' }],
    place: [SOUL([EN('Through sea glass, a bus stop stands in the water. The bus still stops there.')]),
      SOUL([KS('부두 밑에서 숨바꼭질했어. 아무도 안 찾으러 왔어.', 'We played hide-and-seek under the pier. Nobody ever came looking.')])],
    signs: [{ lines: [EN('It stops running only when there is nowhere left to run.')] }],
    decor: [{ look: 'coral', n: 4, lines: ['Barnacles grown on a piling into the shape of a face trying to remember something.'] },
      { look: 'trinket', n: 3, lines: ['A plastic toy from a pier machine, stuck in the weed. A tiny ferry.', 'A fortune card, soaked: “You will cross the sea without leaving.”'] },
      { look: 'puddle', n: 3, lines: ['A pool left by the tide. The pier lamps are reflected in it, even the broken ones.', 'A pool left by the tide. In it, the reflection of a bus stop that isn’t there.'] }],
    npcs: [{ id: 'N1251', name: 'The Pier Crab', look: { t: 'blob', c: ['#a04030'], h: 14 }, behavior: 'shy', shyDist: 4, radius: 10, speed: 1.6, solid: true,
        lines: ['A crab as big as a suitcase, a fortune card stuck to its back. It runs whenever it sees you: always.'] },
      { id: 'N1252', name: 'A Thing in the Pilings', count: 3, look: ghost('rgba(160,200,200,0.35)', 18), behavior: 'wander', radius: 4, speed: 0.4, solid: false,
        lines: ['Something pale moves between the pilings. When you look, it is a plastic bag. When you look away, it isn’t.'] }],
    mech: [{ type: 'corner', ent: 'N1251', flag: 'sea_crab', reward: [{ set: { sea_crab: true } }, { cookie: 1 }, { secret: 'sea_pier_crab' }],
      winLines: ['The crab backs into the pilings and has nowhere left to go. It sighs, a crab sigh, and drops its card.', 'The card says: “You will cross the sea without leaving.” Stuck to the back, a biscuit, slightly damp.'] }],
    info: { summary: 'A dark forest of pier pilings in shallow water, under the closed pier.',
      rules: ['You arrive by falling through the broken planks of the Closed Pier.',
        'Corner the pier crab against the pilings until it cannot flee: a fortune card and a biscuit.',
        'With the Sea Glass equipped, a bus stop appears in the water: it leads to the Sunken Bus.'],
      secrets: ['The bus stop in the water (Sea Glass).'], lore: 'What falls through a summer place.' } });

  /* ---------------------------------------------------------------
   *  W233 — The Sandal Shore (passenger 4: the girl in sandals)
   * --------------------------------------------------------------- */
  var SANDALS = [[6, 10], [14, 9], [22, 11], [30, 9], [10, 17], [27, 18], [34, 15], [40, 12]];
  var MAZE = [
    '.xxxxxxxxxxxxxxxx',
    '.x.......x.......',
    '.x.xxxxx.x.xxxxx.',
    '...x...x...x...x.',
    'xxxx.x.xxxxx.x.x.',
    '.....x.......x...',
    '.xxxxxxxxxxx.xxxx',
    '.x...........x...',
    '...xxxxxxxxx...x.'
  ];
  S({ id: 'W233', name: 'The Sandal Shore', depth: 2, tier: 'mid', back: 'W227', backLook: 'stairs', backLabel: 'the steps up to the pier', backAt: [44, 8], outdoor: true,
    map: (function () {
      var g = K.grid(48, 32, '.');
      g.rect(0, 0, 48, 6, '~'); g.hline(0, 47, 6, 'w');
      g.hline(2, 20, 21, '%'); g.hline(2, 20, 31, '%'); g.vline(2, 21, 31, '%'); g.vline(20, 21, 31, '%'); g.set(3, 21, '.');
      MAZE.forEach(function (row, j) { for (var i = 0; i < row.length; i++) g.set(3 + i, 22 + j, row[i]); });
      return g.rows();
    })(),
    look: { floor: { p: 'sand', c: ['#c8c0b0', '#b8b0a0', '#d8d0c0'] }, water: SEA, shallow: { p: 'water', c: ['#5a6a78', '#4e5e6c', '#6a7a88', '#e0e8f0'] },
      wall2: { p: 'fence', c: ['#8a7a60', '#6a5a40', '#a89878'] } },
    style: { sky: ['#6a7488', '#b0b8c8'], renderer: 'watercolor' }, music: 'sandalshore', amb: { type: 'sea', vol: 0.09 }, weather: { snow: true },
    place: SANDALS.map(function (p, i) {
      return { id: 'sandal' + i, type: 'decor', at: p, look: 'shoe', lookOpt: { c: [['#f0a060', '#60a0e0', '#e06080', '#80c060'][i % 4]] },
        lines: ['A summer sandal washed up in the snow.'] };
    }).concat([{ id: 'hut', type: 'decor', at: [19, 30], look: 'hut', use: [{ secret: 'sea_j_flipflops' }],
        lines: ['A beach hut at the end of the invisible paths. Inside, men’s flip-flops; on the left strap, in biro: “J.”', 'Two ice creams are drawn on the wall, in a child’s hand. Only one has been coloured in.'] },
      { id: 'prints', type: 'decor', at: [4, 20], look: 'scuff', solid: false, lines: ['Footprints go into the fenced sand and turn where there is nothing, as if walking round walls.'] },
      SOUL([EN('Every summer leaves one sandal behind, to have a reason to come back.')])]),
    decor: [{ look: 'shell', n: 4, lines: ['A shell with a little sand still warm inside, from a summer that is over.'] }],
    npcs: [{ id: 'N1242', name: 'The Girl in Summer Sandals', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#f0d880', '#d0b860', '#f0d0b0', '#2a1a10'], h: 16 }), behavior: 'static', solid: true, at: [24, 14], goneIf: { flag: 'sea_p_sandal' },
        lines: [EN('I lost one sandal in the summer. The sea brought back all the wrong ones.'), EN('They all had twins once. Find two that belong together. Then two more.'),
          EN('My dad carried me on his shoulders to the water. Then he went to get ice creams.'), 'She is wearing one sandal, in the snow. Her other foot is bare and doesn’t seem to mind.'] },
      { id: 'N1243', name: 'A Polite Crab', count: 3, look: { t: 'ant', c: ['#c84030'], h: 8 }, behavior: 'wander', radius: 4, speed: 0.7, solid: false, passThrough: true,
        lines: ['A crab wearing a bottle cap as a hat. It walks sideways out of politeness.'] },
      { id: 'N1244', name: 'A Gull on the Sand', look: GULL, behavior: 'wander', radius: 6, speed: 1.2, solid: false, lines: ['A gull trying on a sandal. It doesn’t fit. It keeps it anyway.'] }],
    mech: [{ type: 'pairs', tiles: SANDALS.map(function (p, i) { return 'sandal' + i; }), flag: 'sea_p_sandal', give: 'E211',
      wrongLine: 'Two sandals side by side. They do not belong together, and they know it.', doneLine: 'Every sandal has its twin now.',
      reward: [{ set: { sea_p_sandal: true } }],
      winLines: ['The last pair lies side by side in the snow, toes towards the sea.', EN('There. Everybody has their twin.'),
        'The girl puts on two sandals that are not hers and holds out the one left over: a small left sandal, faded.', EN('This one never had a twin. You keep it. It’s good for hopping.'), 'She runs off towards the pier, towards the ferry.'] }],
    info: { summary: 'A winter beach where the sea brings back summer sandals, one at a time.',
      rules: ['Each sandal hides a sign: find the four matching pairs (a memory game).', 'The girl gives you the Left Sandal and goes to the ferry.',
        'Inside the fenced sand in the south-west, invisible walls make a maze: it leads to a beach hut.'],
      secrets: ['The invisible maze and the beach hut (the flip-flops marked “J.”).'], lore: 'The summer before the father went to get ice creams.' } });

  /* ---------------------------------------------------------------
   *  W228 — The Breakwater
   * --------------------------------------------------------------- */
  S({ id: 'W228', name: 'The Breakwater', depth: 2, tier: 'mid', back: 'W221', backLook: 'gate', backOpt: { c: ['#5a6070'] }, backLabel: 'back to the harbour', backAt: [0, 11], outdoor: true,
    map: (function () {
      var g = K.grid(64, 24, '~');
      g.rect(0, 10, 56, 3, '.'); g.rect(0, 7, 56, 3, 'o'); g.rect(0, 13, 56, 3, 'o');
      g.rect(20, 13, 5, 3, ','); g.rect(19, 18, 8, 3, '.'); g.rect(56, 7, 8, 9, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'concrete', c: ['#8a8c90', '#7a7c80', '#9a9ca0'] }, floor2: { p: 'concrete', c: ['#5a5c60', '#4a4c50'] }, water: SEA, rock: { p: 'rock', c: ['#9a9ca0', '#7a7c80', '#aaacb0'] } },
    tall: { 'o': { look: 'rock', opt: { c: ['#9a9ca0', '#7a7c80'] } } }, extra: { noExpand: true }, style: { sky: ['#4a5260', '#8a929e'] }, music: 'breakwater', amb: { type: 'sea', vol: 0.12 }, dark: 0.2, weather: { snow: true, wind: 0.4 },
    doors: [{ to: 'W230', at: [60, 7], look: 'door', opt: { style: 'wood', c: ['#5a4a3a'] }, cond: { flag: 'sea_echo' }, label: 'the keeper’s annex',
      locked: 'The annex door is sealed with ice. Somewhere among the tetrapods, a voice is waiting for an answer.' }],
    place: [{ id: 'toW234', type: 'door', to: 'W234', at: [23, 20], look: 'boat', lookOpt: { c: ['#6a5a4a'] }, unreachOk: 'hop with the Left Sandal', label: 'a skiff tied to the last tetrapod' },
      { id: 'beacon', type: 'decor', at: [62, 14], look: 'beacon', light: 2.4, lines: ['The harbour beacon, green, blinking every four seconds. It has never missed one.'] },
      { id: 'tetra', type: 'decor', at: [22, 19], look: 'rock', lookOpt: { c: ['#9a9ca0'] }, lines: ['The last tetrapod, alone in the water. Someone has tied a skiff to one of its four legs.'] },
      SOUL([EN('Tetrapods have four legs and nowhere to go. They hold the sea back by staying.')])],
    npcs: [{ id: 'N1230', name: 'The Angler Fishing for the Moon', look: H({ t: 'old', body: 'coat', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#c8c8c8'], hat: 'beanie', hatColor: '#c0a030' }), behavior: 'static', solid: true, at: [40, 11],
        lines: [KS('달 낚는 중이야. 물에 비친 거. 아직 한 번도 안 물었어.', 'I’m fishing for the moon. The one in the water. It hasn’t bitten yet.'),
          KS('구멍 속에서 소리치면 대답이 와. 그 대답을 그대로 따라 해.', 'Shout into the hollow and an answer comes. Say the answer back, word for word.'),
          KS('저 끝 테트라포드엔 깡충 뛰어야 가. 신발 한 짝으로.', 'To reach that last tetrapod you have to hop. On one shoe.')] },
      { id: 'N1231', name: 'The Fog', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 20,
        ambientLines: [EN('…hello?'), EN('Is anyone still out on the breakwater?'), EN('I answer everything. Nobody answers me.')] },
      { id: 'N1232', name: 'A Gull on a Tetrapod', look: GULL, behavior: 'fly', radius: 6, speed: 1, solid: false, lines: ['A gull standing on one leg on a tetrapod, as if it were showing you how.'] }],
    mech: [{ type: 'echo', zone: [20, 13, 24, 15], words: ['come back', 'next ferry', 'one more night', 'home'], flag: 'sea_echo',
      reward: [{ set: { sea_echo: true } }, { secret: 'sea_echo_answer' }],
      winLines: ['The hollow repeats your word, then falls quiet, satisfied.', 'Far down the breakwater, ice cracks off a door.'] }],
    info: { summary: 'A concrete breakwater between two banks of tetrapods, with a hollow, a beacon and the keeper’s annex.',
      rules: ['Say something in the hollow among the tetrapods; the echo answers with another word.', 'Say that word back: the ice falls off the door of the Keeper’s Annex.',
        'With the Left Sandal, hop from the hollow to the last tetrapod: a skiff to the Squid Boat Lights.'],
      secrets: ['The skiff on the last tetrapod (Left Sandal).'], lore: 'Concrete that holds the sea back by staying.' } });

  /* ---------------------------------------------------------------
   *  W230 — The Keeper’s Annex (passenger 3: the keeper)
   * --------------------------------------------------------------- */
  var LAMPS = [[2, 2], [2, 17], [15, 12], [29, 2], [29, 17]];
  S({ id: 'W230', name: 'The Keeper’s Annex', depth: 2, tier: 'mid', back: 'W029', backLook: 'stairs', backLabel: 'the stairs up into the lighthouse', backAt: [15, 0],
    map: (function () {
      var g = K.grid(32, 20, ' '); g.box(0, 0, 32, 20, '#', '.');
      g.vline(10, 1, 18, '#'); g.vline(21, 1, 18, '#'); g.hline(1, 9, 9, '#'); g.hline(22, 30, 9, '#');
      [[10, 5], [10, 14], [21, 5], [21, 14], [5, 9], [26, 9]].forEach(function (p) { g.set(p[0], p[1], '.'); });
      return g.rows();
    })(),
    look: INDOOR({ p: 'wood', c: ['#6a5040', '#5a4030', '#7a6050'] }, { p: 'wallpaper', c: ['#8a8070', '#7a7060', '#4a4030'] }, '#3a2a1a'),
    style: { tallWalls: true }, music: 'keeperannex', amb: { type: 'clock', vol: 0.05 }, dark: 0.75, playerLight: 0.4,
    doors: [{ to: 'W228', at: [15, 19], look: 'door', opt: { style: 'wood', c: ['#5a4a3a'] }, label: 'out onto the breakwater' }],
    place: LAMPS.map(function (p, i) { return { id: 'lamp' + (i + 1), type: 'decor', at: p, look: 'lantern', lines: ['An oil lamp.'] }; })
      .concat([{ id: 'kbed', type: 'decor', at: [7, 2], look: 'bed', lookOpt: { c: ['#e0d8c8', '#4a5a7a'] }, lines: ['The keeper’s bed. The pillow has never been dented.'] },
        { id: 'kdrawing', type: 'decor', at: [4, 1], look: 'drawing', cond: { dark: true }, light: 1, use: [{ secret: 'sea_keeper_drawing' }],
          lines: ['In the dark, a child’s drawing glows faintly on the wall: a lighthouse, a small figure asleep at its foot.', 'Under it, in crayon: “dad works nights”.'] },
        { id: 'kradio', type: 'decor', at: [27, 4], look: 'radio', lines: ['A shipping radio. It reads out the weather for every coast but this one.'] },
        { id: 'klog', type: 'decor', at: [24, 7], look: 'book', lines: ['The keeper’s log: “Lamp lit. Fog. No ships. Lamp lit. Fog. No ships.” Thirty years of the same three lines.'] },
        SOUL([EN('Someone has to stay awake so the others can sleep. Nobody stays awake for the one who stays awake.')])]),
    decor: [{ look: 'crate', n: 2, lines: ['A crate of lamp oil. Each can is labelled with a date and the word “enough”.'] },
      { look: 'clock', n: 1, lines: ['A clock that only has nights on it.'] }],
    npcs: [{ id: 'N1235', name: 'The Keeper', look: H({ t: 'old', body: 'coat', c: ['#2a3a4a', '#1a2a3a', '#e0c0a0', '#d8d8d8'], hat: 'beanie', hatColor: '#8a2a2a' }), behavior: 'static', solid: true, at: [13, 6], goneIf: { flag: 'sea_p_keeper' },
        lines: [EN('All of them, before the first one gives up. They don’t wait long. Nothing here waits long except me.'),
          EN('If the lamps are all lit, I can sleep. I haven’t slept since the light was invented.'),
          EN('There’s a boat that waits for me too. I keep telling it: one more night.'),
          EN('Turn your light off sometime. The walls in here remember things in the dark.')] },
      { id: 'N1236', name: 'A Moth', count: 3, look: { t: 'moth', c: ['#c8b8a0'], h: 7 }, behavior: 'fly', radius: 4, speed: 1, solid: false, lines: ['A moth circling a lamp that isn’t lit yet. It is very patient.'] }],
    mech: [{ type: 'lampsAll', lamps: ['lamp1', 'lamp2', 'lamp3', 'lamp4', 'lamp5'], time: 22, light: 2.6, flag: 'sea_p_keeper', give: 'E208',
      litLines: ['A lamp catches.', 'Another. The first is already beginning to gutter.'], onLine: 'This one is burning. Hurry.', doneLine: 'All five lamps are burning. The annex is warm.',
      reward: [{ set: { sea_p_keeper: true } }],
      winLines: ['The fifth lamp catches while the first is still burning. The whole annex glows like a held breath.', 'The keeper sits down on his bed and unlaces his boots.',
        EN('…Thank you. I’ll go to the boat. Someone else can answer the fog tonight.'), 'He leaves his hand foghorn on the table.'] }],
    info: { summary: 'The lighthouse keeper’s annex: five small rooms, five oil lamps, a keeper who has not slept in thirty years.',
      rules: ['Light all five lamps, one in each room, before the first goes out (each burns 22 seconds).', 'The keeper leaves you the Hand Foghorn and goes to the ferry.',
        'With the bedroom light off in the real room (dark), a child’s drawing glows on the bedroom wall.'],
      secrets: ['The glowing drawing (in the dark).'], lore: 'The one who stays awake so that the others can sleep.' } });
  link('W029', { to: 'W230', look: 'door', lookOpt: { style: 'wood', c: ['#5a4a3a'] }, label: 'a low door to the keeper’s annex' });

  /* ---------------------------------------------------------------
   *  W234 — The Squid Boat Lights
   * --------------------------------------------------------------- */
  S({ id: 'W234', name: 'The Squid Boat Lights', depth: 2, tier: 'mid', back: 'W221', backLook: 'boat', backOpt: { c: ['#6a5a4a'] }, backLabel: 'the rowing boat back to the harbour', backAt: [23, 29], outdoor: true,
    map: (function () { var g = K.grid(48, 34, '~'); g.ellipse(23.5, 16.5, 21, 14, '.'); return g.rows(); })(),
    look: { floor: { p: 'waves', c: ['#0e1a2a', '#16263a', '#e0e8a0'] }, water: { p: 'water', c: ['#060c16', '#040810', '#101a28', '#40506a'] } },
    style: { stars: true, sky: ['#02040a', '#0a1428'] }, music: 'squidlights', amb: { type: 'sea', vol: 0.06 }, dark: 0.7,
    doors: [{ to: 'W228', at: [4, 16], look: 'boat', opt: { c: ['#6a5a4a'] }, label: 'the skiff back to the breakwater' }],
    place: [{ id: 'farlight', type: 'decor', at: [23, 4], look: 'lantern', light: 3, solid: true, lines: ['A light on the horizon.'] },
      { id: 'fog', type: 'decor', at: [40, 9], look: 'buoy', lookOpt: { c: ['#8a8a8a'] },
        onEffect: { E208: [{ lines: ['You blow the foghorn into the dark.', 'For a long time, nothing. Then, from very far to the north, another foghorn answers. Two notes. The same two.'] }, { secret: 'sea_horn_answer' }] },
        lines: ['A buoy at the edge of the lights. Beyond it, fog, and a line nobody drew on the water but everyone can see.'] },
      SOUL([EN('From far enough away, the lights of the North and the South are the same colour.')]),
      SOUL([KN('불빛 보고 올라오는 건 오징어만이 아닙니다.', 'It is not only the squid that rise towards the lights.')])],
    decor: [{ look: 'boat', n: 6, opt: { c: ['#e8e4dc', '#2a3a52'] }, light: 2.2, lines: ['A squid boat strung with dozens of bare bulbs, brighter than the town. Its crew is asleep.', 'A squid boat with its lights on and nobody aboard. The bulbs hum like insects.'] }],
    npcs: [{ id: 'N1245', name: 'A Fisherman from the South', look: H({ t: 'adult', body: 'coat', c: ['#c0a030', '#a08020', '#e0c0a0', '#1a1a1a'], hat: 'beanie', hatColor: '#2a3a6a' }), behavior: 'static', solid: true, at: [30, 20],
        lines: [KS('저 불빛은 쳐다보면 멀어져. 등 돌리고 가 봐.', 'That light moves away when you look at it. Try going with your back to it.'),
          KS('오징어는 불빛 보고 올라와. 사람도 그래.', 'Squid come up towards the light. People too.'),
          KS('저 너머 배들은 북쪽 배야. 불빛은 똑같은데.', 'The boats out there are from the North. The lights look just the same.'),
          KS('안개 쪽에 뿔피리를 불면 북쪽에서 대답했어. 옛날엔.', 'Blow a horn towards the fog and the North used to answer. In the old days.')] },
      { id: 'N1246', name: 'A Fisherman from the North', look: H({ t: 'adult', body: 'coat', c: ['#4a5a4a', '#3a4a3a', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#3a4a3a' }), behavior: 'static', solid: true, at: [20, 6], appear: { flag: 'sea_border' },
        lines: [KN('여기까지 오시면 안 됩니다. 아니… 일없습니다. 잠깐은 일없습니다.', 'You should not come this far. No… it is nothing. For a moment, it is nothing.'),
          KN('우리 마을에서도 오징어를 말립니다. 같은 바람에.', 'In our village we dry squid too. In the same wind.'),
          KN('저쪽 불빛이 남쪽입니까? 우리 불빛하고 똑같습니다.', 'Is that light over there the South? It is just like ours.')] },
      { id: 'N1247', name: 'A Squid Rising to the Light', count: 5, look: { t: 'jelly', c: ['rgba(240,240,220,0.7)'], h: 10, glow: '#f0f0c0' }, light: 1, behavior: 'fly', radius: 6, speed: 0.6, solid: false,
        lines: ['A squid rising towards the bulbs, translucent, as if made of the light it wants.'] }],
    mech: [{ type: 'recede', mark: 'farlight', dist: 8, flag: 'sea_border',
      reward: [{ set: { sea_border: true } }, { secret: 'sea_border_boat' }],
      winLines: ['You walk backwards towards the light until you bump into it.', 'It is a lamp hanging from a small boat, a star painted out on its bow.', 'The man in it looks at you, then away, then back.'] }],
    info: { summary: 'The sea at night, far out, strung with the bulbs of squid boats; one light on the horizon keeps away.',
      rules: ['Reached by the rowing boat off the Harbour’s first pier, or the skiff by the Breakwater’s last tetrapod.',
        'The light on the horizon moves away when you look at it: approach it facing away, or corner it.', 'A fisherman from the North then appears.',
        'Blow the Hand Foghorn facing the grey buoy: a foghorn answers from the North.'],
      secrets: ['The answer from the North (Hand Foghorn).'], lore: 'Two coasts with the same lights, and a line on the water.' } });

  /* ---------------------------------------------------------------
   *  W238 — The Hold (P3): reached when all five passengers are aboard
   * --------------------------------------------------------------- */
  S({ id: 'W238', name: 'The Hold', depth: 3, tier: 'hard', back: 'W222', backLook: 'ladder', backLabel: 'the ladder up to the deck', backAt: [2, 1],
    map: (function () {
      var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.');
      g.hline(3, 12, 4, '{'); g.hline(21, 30, 4, '{'); g.hline(3, 12, 17, '{'); g.hline(21, 30, 17, '{');
      g.box(11, 7, 12, 8, '%', ','); g.set(16, 14, ','); g.set(17, 14, ',');
      g.scatter('w', '.', 0.06, 2381);
      return g.rows();
    })(),
    look: Object.assign(INDOOR({ p: 'plank', c: ['#3a2e24', '#2e241a', '#4a3a2e'] }, { p: 'panel', c: ['#4a3a2a', '#3a2a1a', '#1a120a'] }, '#1a120a'),
      { floor2: { p: 'plank', c: ['#4a3e30', '#3e3226', '#5a4a3a'] }, wall2: { p: 'plank', c: ['#5a4a38', '#4a3a28', '#6a5a48'] }, shallow: { p: 'water', c: ['#1a2a30', '#142228', '#2a3a40', '#6a8088'] } }),
    tall: { '{': { look: 'crate', opt: { c: ['#6a5038'] } } }, extra: { noFurnish: true }, style: { tallWalls: true, renderer: 'sepia' }, music: 'thehold', amb: { type: 'underwater', vol: 0.07 }, dark: 0.6,
    doors: [{ to: 'W240', at: [31, 20], look: 'stairs', cond: { flag: 'sea_balanced' }, label: 'the stairs up to a deck in the fog',
      locked: 'The stairs are blocked by luggage that has slid against them. The ship lists to one side.' }],
    place: [{ id: 'crate1', type: 'decor', at: [13, 11], look: 'suitcase', lookOpt: { c: ['#8a5a3a'] }, solid: true, lines: ['A bundle, tied with string.'] },
      { id: 'crate2', type: 'decor', at: [16, 11], look: 'suitcase', lookOpt: { c: ['#5a6a3a'] }, solid: true, lines: ['A bundle, tied with string.'] },
      { id: 'crate3', type: 'decor', at: [20, 11], look: 'suitcase', lookOpt: { c: ['#3a5a7a'] }, solid: true, lines: ['A bundle, tied with string.'] },
      { id: 'out1', type: 'decor', at: [14, 8], look: 'chalkmark', solid: false, lines: ['A chalk outline on the floor, the size of a bundle. Written inside: “family Ri”.'] },
      { id: 'out2', type: 'decor', at: [16, 8], look: 'chalkmark', solid: false, lines: ['A chalk outline on the floor, the size of a bundle. Written inside: “family Pak”.'] },
      { id: 'out3', type: 'decor', at: [19, 8], look: 'chalkmark', solid: false, lines: ['A chalk outline on the floor, the size of a bundle. Written inside: “family Ahn”.'] },
      { id: 'tagbundle', type: 'decor', at: [6, 10], look: 'suitcase', lookOpt: { c: ['#6a4a2a'] },
        lines: ['A bundle tagged in old ink with a boy’s name: 안재식. It has been on the wrong boat for seventy years.'],
        listen: [{ match: ['ok-sun', 'oksun', 'ok sun', '옥순', '옥순아', 'ahn ok-sun', '안옥순'],
          lines: ['You say her name to the bundle.', 'The knot loosens by itself. Inside: a boy’s school cap, and a ticket for a train that left without him.', 'He got on the wrong train, the tag says. His bundle got on the wrong boat. Only the name stayed right.'],
          do: [{ secret: 'sea_jaesik_bundle' }] }] },
      SOUL([KN('보따리 하나에 집 한 채가 다 들어갔습니다.', 'A whole house fitted into one bundle.')]),
      SOUL([EN('The sea knocks on the hull, politely, like a neighbour who wants to come in.')])],
    signs: [{ at: [17, 15], lines: [EN('Every family’s bundle has its outline on the floor. Put each one home.')] }],
    decor: [{ look: 'barrel', n: 3, lines: ['A barrel of drinking water, stamped “for the crossing”. It is still full.'] },
      { look: 'letter', n: 2, lines: ['A sack of letters addressed to the North Shore, all marked: RETURN TO SENDER — NO SUCH ADDRESS.'] }],
    npcs: [{ id: 'N1256', name: 'A Sleeping Refugee', at: [3, 8], look: H({ t: 'adult', body: 'robe', c: ['#d8d0c0', '#b8b0a0', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'statue', solid: true,
        lines: [{ seq: ['She sleeps sitting on her bundle, so nobody can take it.', KN('제 자리에 놓으면 배가 바로 섭니다.', 'Put things in their places and the ship stands up straight.')] },
          { seq: ['He sleeps with one hand on a bundle that isn’t his.', KN('배가 기울었습니다. 다들 짐을 한쪽에만 몰아 두었습니다.', 'The ship is listing. Everyone piled their luggage on one side.')] },
          { seq: ['She points at the bundle with the boy’s name on it.', KN('저 보따리 임자는 누이동생을 찾았습니다. 누이 이름을 부르면 풀립니다.', 'Its owner was looking for his little sister. Call her name and it will come undone.')] }] },
      { id: 'N1258', name: 'The Voice in the Hull', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 20,
        ambientLines: [KN('일없습니다… 일없습니다…', 'It is nothing… it is nothing…'), KN('곧 떠납니다. 곧입니다.', 'We leave soon. Very soon.')] }],
    npcList: [{ id: 'N1256', at: [28, 12] }, { id: 'N1256', at: [8, 19] }],
    mech: [{ type: 'push', blocks: ['crate1', 'crate2', 'crate3'], plates: ['out1', 'out2', 'out3'], flag: 'sea_balanced', sfx: 'stamp',
      reward: [{ set: { sea_balanced: true } }, { secret: 'sea_hold_balanced' }],
      winLines: ['The last bundle slides onto its outline. The hold groans, then rights itself.', 'Above, the engines change their note, as if the ship had finally remembered how.'] }],
    info: { summary: 'The ferry’s hold, below the waterline: bundles, letters with no address, refugees asleep on their luggage.',
      rules: ['Only once the five passengers are aboard the ferry.',
        'Push the three bundles in the middle room onto the three chalk outlines: the ship rights itself.', 'The stairs to the Crossing are then freed. A stuck bundle goes back to its place if you leave and return.',
        'Say Ok-sun’s name to the bundle tagged 안재식.'],
      secrets: ['The bundle of Ahn Jae-sik (say “Ok-sun”).'], lore: 'Luggage packed in 1951 for a crossing that never happened.' } });

  /* ---------------------------------------------------------------
   *  W240 — The Crossing (P3): the end of the through-line
   * --------------------------------------------------------------- */
  S({ id: 'W240', name: 'The Crossing', depth: 3, tier: 'hard', back: 'W238', backLook: 'hatch', backLabel: 'the hatch down to the hold', backAt: [22, 18], secretLevel: 4, outdoor: true,
    map: deckMap(), look: Object.assign({}, DECK, { water: { p: 'water', c: ['#c8ccd0', '#b8bcc0', '#d8dce0', '#ffffff'] } }),
    extra: { noFurnish: true }, style: { sky: ['#d8dce0', '#f0f2f4'], renderer: 'watercolor', filter: 'contrast(0.8) brightness(1.12) saturate(0.5)' }, music: 'thecrossing', amb: { type: 'wind', vol: 0.05 }, dark: 0.1, weather: { snow: true },
    place: [{ id: 'toW090', type: 'door', to: 'W090', at: [42, 11], look: 'ladder', cond: { flag: 'sea_crossed' }, label: 'a rope ladder over the side, into a sea with no bottom' },
      { id: 'stern', type: 'decor', at: [41, 8], look: 'lantern', light: 1.5,
        onEffect: { E208: [{ lines: ['You blow the foghorn off the stern.', 'The fog answers in five voices: a fishwife, an office worker, a keeper, a child, a driver.', 'Then a sixth, very small, that sounds like you.'] }, { secret: 'sea_fog_six' }] },
        lines: ['The stern lantern, white with fog. Behind the ship, there is no wake.'] },
      { id: 'wheel', type: 'decor', at: [16, 9], look: 'wheel', lines: ['The wheel, untied at last. It turns by itself, gently, towards nowhere in particular.'] },
      SOUL([KN('오마니, 저 갑니다. 아니, 저 아직 여기 있습니다.', 'Mother, I am going. No — I am still here.')]),
      SOUL([EN('Leaving and staying look the same in fog.')])],
    decor: [[30, 17], [34, 16], [38, 13]].map(function (p) { return { look: 'bench', at: p, lines: ['A bench on deck, covered in fog instead of snow.'] }; }),
    npcs: [{ id: 'N1261', name: 'The Captain at Sea', look: H({ t: 'old', body: 'coat', c: ['#1e2a3a', '#141e2a', '#e0c8a8', '#e0e0e0'], hat: 'conductor', hatColor: '#141e2a' }), behavior: 'static', solid: true, at: [19, 10],
        lines: [KN('보십시오. 떠났습니다. 아니, 떠난 것 같습니다. 안개 속에서는 구별이 안 됩니다.', 'Look. We have left. Or it seems we have. In fog you cannot tell.'),
          KN('갈매기 그림자 밑에 있으면 안개가 비켜 줍니다. 오래 있어야 합니다.', 'Stay under the gull’s shadow and the fog makes way. You must stay a long time.'),
          KN('고물에서 뿔피리를 불면 안개가 대답합니다.', 'Blow a horn from the stern and the fog answers.'),
          { if: { flag: 'sea_crossed' }, t: '건너편 해안은 없습니다. 그래서 우리는 한 번도 떠나지 않았던 겁니다. 떠나지 않으면 집은 아직 거기 있으니까요.', lang: 'ko-n', tr: 'There is no far shore. That is why we never left. As long as we do not leave, home is still there.' }] },
      { id: 'N1262', name: 'The Fishwife, at Sea', look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#c06050', '#8a3a30', '#e0c0a0', '#2a1a10'], eyes: 'closed' }), behavior: 'static', solid: true, at: SEATS[0],
        lines: [{ seq: ['She sleeps with her head on the rail, smiling.', KS('엄마, 나 왔어…', 'Mum, I’m here…')] }] },
      { id: 'N1263', name: 'Manager Kim, at Sea', look: H({ t: 'adult', body: 'suit', c: ['#3a3a44', '#2a2a34', '#e0c8a8', '#1a1a1a'] }), behavior: 'static', solid: true, at: SEATS[1],
        lines: [KS('열두 시 전에 들어간 건 처음이야. 아직 열두 시 전이지?', 'It’s the first time I’ve got home before twelve. It is still before twelve, isn’t it?')] },
      { id: 'N1264', name: 'The Keeper, at Sea', look: H({ t: 'old', body: 'coat', c: ['#2a3a4a', '#1a2a3a', '#e0c0a0', '#d8d8d8'], eyes: 'closed' }), behavior: 'static', solid: true, at: SEATS[2],
        lines: ['The keeper is asleep sitting up, his mouth a little open. It is the first time anyone has seen him sleep.'] },
      { id: 'N1265', name: 'The Girl in Sandals, at Sea', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#f0d880', '#d0b860', '#f0d0b0', '#2a1a10'], h: 16 }), behavior: 'static', solid: true, at: SEATS[3],
        lines: [EN('Is my dad on the other side? He said he’d only be a minute.')] },
      { id: 'N1266', name: 'The Bus Driver, at Sea', look: H({ t: 'adult', body: 'uniform', c: ['#3a5a4a', '#2a4a3a', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, at: SEATS[4],
        lines: [KS('이게 첫차구나. 생각보다 조용하네.', 'So this is what the first one is like. Quieter than I thought.')] },
      { id: 'N1267', name: 'The Gull, Ticketless', look: GULL, behavior: 'orbit', center: [9, 11], radius: 3, speed: 0.25, solid: false, at: [9, 8],
        lines: ['The gull has let go of its ticket at last. It circles the bow very slowly, its shadow going round with it.'] }],
    mech: [{ type: 'followShadow', center: [9, 11], r: 3, speed: 0.25, secs: 25, flag: 'sea_crossed', breakLine: 'She stepped out of the gull’s shadow. The fog closes in again.',
      reward: [{ set: { sea_crossed: true } }, { secret: 'sea_no_far_shore' }],
      winLines: ['For a long time you walk under the gull’s shadow, round and round the bow.', 'The fog parts. There is no shore. Only the sea, going down and down, and a rope ladder over the side.'] }],
    info: { summary: 'The ferry at sea at last, inside a white fog, with all five passengers aboard.',
      rules: ['From the Hold, once the ship is balanced.', 'Walk in the shadow of the circling gull, at the bow, for twenty-five seconds: the fog parts.', 'A rope ladder then leads down into the Inner Sea.',
        'Blow the Hand Foghorn facing the stern lantern: the fog answers in six voices.'],
      secrets: ['The six voices in the fog (Hand Foghorn).'], lore: 'There is no far shore. As long as the ferry never arrives, home is still there.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
