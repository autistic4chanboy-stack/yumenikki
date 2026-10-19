/* =========================================================================
 *  LES CHAMBRES DU TEMPS (W361–W380) — « The Weather Rooms »
 *  Sous la Station météo (W092) : le Dépôt où l'on range chaque temps qui
 *  n'est pas sorti, et autour, les pièces et paysages où un seul temps vit.
 *  Fil rouge : le tableau du Dépôt affiche toujours FINE (괜찮아). Quatre
 *  fiches de prévision arrachées (Rain Room, Snowfield, Monsoon Corridor,
 *  Eclipse Plaza) donnent la vraie phrase : « it / is / not / fine ».
 *  La dire au tableau ouvre la dernière pièce : le parapluie qui est venu.
 *  Entrées : W092 (Dépôt), W099 (neige de 1951), W158 (marché du brouillard),
 *  W177 (escalier arc-en-ciel). Tout est en P4.
 *  Effets E249–E254 · habitants N1900–N1944.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* ajoute une porte dans un monde déjà défini (placée au hasard, puis rendue joignable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  /* le temps qu'il fait en ce moment dans le monde (l'effet « weather » le change) */
  function sky(k) { return function (x) { var rt = (x && x.rt) || (YN.game && YN.game.rt); return !!(rt && rt.weather && rt.weather[k]); }; }
  /* traces au sol (non solides) : réservent les cases d'une énigme et les montrent */
  function marks(list, look, line, opt) { return list.map(function (p, i) { return { id: look + 'm' + i, type: 'decor', at: p, look: look, lookOpt: opt, solid: false, noInteract: !line, lines: line ? [line] : null }; }); }
  /* une fiche de prévision arrachée (le méta-jeu du Dépôt) */
  function slip(n, word, where) { return 'A tear-off forecast slip, ' + where + '. Printed: ' + n + ' of 4. Over the printed word, in pencil: “' + word + '”.'; }

  /* ---------------------------------------------------------------
   *  EFFETS E249–E254
   * --------------------------------------------------------------- */
  var GIRL = (YN.spr && YN.spr.GIRL) || { hair: '#1e1a26', hairHi: '#4a4258', skin: '#f6d8c0', skinSh: '#e0b49a', blush: '#f0a0a8', eye: '#2a1822', sweater: '#a8c4e2', sweaterSh: '#7e9cc4', sweaterHi: '#d4e4f4', skirt: '#2c3458', sock: '#f2f0f6', shoe: '#5a2c2c', clip: '#f4c84a' };
  function pal(sw, sh, hi) { return Object.assign({}, GIRL, { sweater: sw, sweaterSh: sh, sweaterHi: hi }); }
  [{ id: 'E249', name: 'Red Umbrella', fam: 'weather', world: 'W362', icon: { glyph: '☂', c: '#d04050' }, acc: 'umbrella', action: 'decoy', caps: ['umbrella'],
    desc: 'The one nobody brought to the school gate. It was dry under a bed all along.',
    use: 'Rain stops falling on her. Leave it open on the ground (F): whatever is listening goes to it for a while.', get: 'Catch every leak in the Rain Room.' },
  { id: 'E250', name: 'Bottled Thunder', fam: 'weather', world: 'W364', icon: { glyph: 'ϟ', c: '#c8b8ff' }, acc: 'jar', action: 'shout',
    desc: 'A storm folded small enough to carry. It knocks on the glass whenever someone raises their voice.',
    use: 'Uncork it (F): one clap of thunder that everything nearby hears.', get: 'Open the thunder jars in the order the storm uses them.' },
  { id: 'E251', name: 'Pocket Fog', fam: 'weather', world: 'W376', icon: { glyph: '≋', c: '#d8dce0' }, action: 'hide', stealth: 0.45, noise: 0.8,
    desc: 'Fog from the market that does not exist. It smells of coal smoke and boiled corn.',
    use: 'Disappear into it (F): whatever looks for her sees only grey. Cameras too.', get: 'Say what everyone at the Fog Market pretends not to see.' },
  { id: 'E252', name: 'First Snowflake', fam: 'weather', world: 'W372', icon: { glyph: '❄', c: '#e8f4ff' }, action: 'weather', pal: pal('#e8eef8', '#c0cce0', '#ffffff'),
    desc: 'It landed on her sleeve and never melted. It has been waiting for the right weather ever since.',
    use: 'Turn the weather over where she stands (F): clear, then rain, then snow — even in August.', get: 'Wait at the window of the Room of the First Snow until it falls.' },
  { id: 'E253', name: 'Yellow-Dust Mask', fam: 'weather', world: 'W377', icon: { glyph: '▭', c: '#e8dca8' }, action: 'breath', caps: ['mask'], noise: 0.85,
    desc: 'A white mask gone yellow at the edges. A name was written on it in marker, then crossed out.',
    use: 'Breathe slowly behind it (F): dust, smoke and spores cannot reach her for a moment.', get: 'Touch the air-quality board on the Yellow Dust Street the one second it tells the truth.' },
  { id: 'E254', name: 'Smoked Glass', fam: 'weather', world: 'W374', icon: { glyph: '◐', c: '#3a3a44' }, acc: 'sunglasses', action: 'reveal', caps: ['reveal'],
    desc: 'A pane of window held over a candle. Through it the sun is a coin, and walls stop pretending.',
    use: 'Look through it (F): hidden things nearby show their edges, and walls that only pretend let her through.', get: 'Light every lantern of the Eclipse Plaza before they go out.' }
  ].forEach(function (e) { if (!YN.effectById || !YN.effectById(e.id)) YN.data.effects.push(Object.assign({ ground: false, core: false }, e)); });

  /* ---------------------------------------------------------------
   *  W361 — Le Dépôt du temps (la plaque tournante)
   * --------------------------------------------------------------- */
  var DEPOT = (function () {
    var g = K.grid(48, 18, ' '); g.box(0, 0, 48, 18, '#', '.');
    g.hline(1, 46, 9, ',');
    [[3, 9], [12, 18], [21, 27], [30, 36], [39, 45]].forEach(function (s) { g.hline(s[0], s[1], 5, '{'); g.hline(s[0], s[1], 13, '{'); });
    return g.rows();
  })();
  S({ id: 'W361', name: 'The Weather Depot', depth: 4, tier: 'hard', back: 'W092', backLook: 'door', backOpt: { style: 'metal', c: ['#8a8e96'] }, backLabel: 'back up to the weather station', backAt: [1, 9],
    map: DEPOT, tall: { '{': { look: 'shelf', opt: { c: ['#6a6e76'] } } },
    look: { floor: { p: 'concrete', c: ['#5a5e66', '#50545c'] }, floor2: { p: 'rug', c: ['#a89048', '#8a7438'] }, wall: { p: 'flat', c: ['#22262e', '#1a1e26'], topColor: '#22262e' }, wallface: { p: 'metal', c: ['#7a7e86'], skirt: '#e0c030' } },
    style: { tallWalls: true }, music: 'weatherdepot', amb: { type: 'hum', vol: 0.05 }, dark: 0.3, weather: { motes: true },
    doors: [{ to: 'W362', at: [6, 1], opt: { style: 'wood', c: ['#5a7aa0'] }, label: 'RAIN — a door that drips' },
      { to: 'W364', at: [15, 1], opt: { style: 'metal', c: ['#4a4a6a'] }, label: 'THUNDER — a door that hums' },
      { to: 'W366', at: [24, 1], opt: { style: 'wood', c: ['#4a6a5a'] }, label: 'MONSOON — a door swollen with damp' },
      { to: 'W369', at: [33, 1], opt: { style: 'wood', c: ['#8a8a7a'] }, label: 'WIND — a door that will not stay shut' },
      { to: 'W370', at: [42, 1], opt: { style: 'metal', c: ['#a0a8b0'] }, label: 'HAIL — a dented door' },
      { to: 'W375', at: [46, 16], opt: { style: 'wood', c: ['#c8ccd4'] }, label: 'a cupboard door, stencilled CALM' },
      { to: 'W380', at: [46, 9], opt: { style: 'wood', c: ['#f0d870'] }, cond: { flag: 'forecast_honest' }, label: 'a door with no label, warm to the touch' }],
    decor: [{ look: 'jar', n: 6, opt: { c: ['rgba(190,200,220,0.7)'], inside: '#8a90a0' }, lines: ['A jar labelled DRIZZLE (ASSORTED). The glass is fogged from inside.', 'A jar labelled MIST, MORNING, 1 PT. It is lighter than air.', 'A jar labelled SUNSHOWER. It is warm and wet at the same time.', 'A jar labelled FROST — DO NOT SHAKE.'] },
      { look: 'crate', n: 4, lines: ['A crate stamped FRAGILE — WEATHER. Inside, straw, and a small grey sound.', 'A crate of returned weathers. The delivery note says: “not wanted, it was a birthday”.'] },
      { look: 'clipboard', n: 1, lines: ['The ledger of weathers signed out. Last entry, nine years ago: “FAIR — 1 — signed out by: J. Not returned.”'] }],
    signs: [{ at: [24, 11], lines: [EN('Say what the sky does. Not what the board says.')] },
      { at: [45, 14], lines: [EN('The calm is not a weather. They keep it in the corner nobody sweeps.')] }],
    place: [{ id: 'board', type: 'decor', at: [24, 8], look: 'board', solid: true,
        lines: ['The forecast board. Painted, not chalked: TOMORROW — FINE. Underneath, smaller: 괜찮아 (it’s all right).', 'The paint is nine years thick. Under it, other words have been painted over, again and again.', { if: { flag: 'forecast_honest' }, t: 'The paint has flaked off. In old pencil underneath: “it is not fine. it is raining. bring her an umbrella.”' }] },
      { id: 'stand', type: 'decor', at: [3, 16], look: 'pot', lookOpt: { c: ['#4a4e56'] }, lines: ['An umbrella stand with thirty slots. Twenty-nine umbrellas were collected. One slot has never held anything.'] },
      { id: 'desk', type: 'decor', at: [18, 7], look: 'desk', lines: ['The clerk’s desk. Rubber stamps: RAIN, SNOW, FOG, FINE. The FINE stamp is worn down to the handle.'] },
      SOUL([EN('Fair weather was kept in the last jar. Someone signed it out in 2020 and never brought it back.')])],
    npcs: [{ id: 'N1900', name: 'The Depot Clerk', look: H({ t: 'old', body: 'coat', c: ['#e0c030', '#c0a010', '#d8b898', '#a0a8b0'], acc: 'clipboard' }), behavior: 'static', solid: true, at: [18, 8],
        lines: [EN('Every weather that isn’t out is kept down here. Signed for, shelved, dusted.'),
          EN('Upstairs they want FINE on the board. Always. In nine years it hasn’t been wrong. Or right.'),
          { seq: [EN('Four slips were torn off the forecast pad, the night of the long rain.'), EN('Find them all and you can read what the sky really said.')] },
          { if: { flag: 'forecast_honest' }, t: 'It’s raining in the depot. First time since I started. Smells wonderful, doesn’t it?', lang: 'en' }] },
      { id: 'N1901', name: 'A Cloud on a Trolley', look: { t: 'blob', c: ['#b8bcc8'], h: 12 }, behavior: 'wander', radius: 6, speed: 0.6, solid: false,
        lines: ['A small grey cloud on a trolley, waiting to be delivered. Its label says: “Tuesday, any Tuesday”.', 'It drizzles a little on your shoes, apologetically.'] }],
    mech: [{ type: 'sayTo', mark: 'board', dist: 4, flag: 'forecast_honest',
        words: ['not fine', 'not okay', 'not ok', 'not all right', 'not alright', 'isn t fine', 'isnt fine', '안 괜찮아', '안괜찮아', '괜찮지 않아'],
        winLines: ['You say it out loud, to the board. Your voice is very small. The board hears it anyway.', 'The paint cracks along the word FINE and comes off in flakes, like old snow.', 'For the first time in nine years, it starts to rain inside the depot. Softly. Honestly.', 'At the far end of the hall, a door you had not noticed is warm.'],
        reward: [{ set: { forecast_honest: true } }, { secret: 'depot_honest' }] },
      { type: 'weatherWhen', cond: { flag: 'forecast_honest' }, weather: { rain: true } }],
    info: { summary: 'The storehouse under the Weather Station, where every weather that is not out is shelved in jars.',
      rules: ['Doors lead to the rooms of rain, thunder, monsoon, wind and hail.', 'A cupboard marked CALM leads to the eye of a typhoon (W375).',
        'Four forecast slips: Rain Room “it”, Snowfield “is”, Monsoon Corridor “not”, Eclipse Plaza “fine”.',
        'Say “it is not fine” (or 안 괜찮아) to the forecast board: it rains in the depot.', 'The unlabelled door to W380 then opens.'],
      secrets: ['The CALM cupboard behind the last shelf, hinted by a soul.'],
      lore: 'Where the dream keeps its weathers, and the forecast that was never allowed to change.' } });
  link('W092', { to: 'W361', look: 'door', lookOpt: { style: 'metal', c: ['#e0c030'] }, label: 'a metal door stencilled STORES' });

  /* ---------------------------------------------------------------
   *  W362 — La Chambre de la pluie (pousser les seaux sous les fuites)
   * --------------------------------------------------------------- */
  var RAINROOM = (function () {
    var g = K.grid(24, 16, ' '); g.box(0, 0, 24, 16, '#', '.');
    g.rect(2, 12, 3, 2, 'w'); g.rect(14, 12, 4, 3, 'w'); g.rect(20, 3, 2, 3, 'w'); g.rect(8, 12, 3, 3, 'w');
    return g.rows();
  })();
  S({ id: 'W362', name: 'The Rain Room', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'wood', c: ['#5a7aa0'] }, backLabel: 'back to the depot', backAt: [1, 8],
    map: RAINROOM, look: Object.assign({}, K.LOOK.house, { floor: { p: 'wood', c: ['#6a5040', '#5a4232', '#7a5e4a'] }, shallow: { p: 'water', c: ['#4a6a8a', '#40607e', '#6a8aaa', '#a8c4dc'] } }),
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'rainroom', amb: { type: 'rain', vol: 0.1 }, dark: 0.35, weather: { rain: true },
    doors: [{ to: 'W363', type: 'hole', at: [9, 13], look: 'puddle', cond: { equipped: 'E249' }, label: 'the big puddle, gone still' }],
    signs: [{ at: [3, 7], lines: [EN('Three leaks, three buckets. The ceiling always drips in the same places.')] },
      { at: [7, 11], lines: [EN('Under an umbrella, even a puddle stops shivering. Then you can see to the bottom.')] }],
    place: [{ id: 'bed', type: 'decor', at: [2, 2], look: 'bed', lookOpt: { c: ['#c8d0e0', '#6a7a9a'] }, lines: ['A child’s bed. The blanket is soaked. Underneath, something has stayed perfectly dry.'] },
      { id: 'window', type: 'decor', at: [15, 1], look: 'window', light: 2, lines: ['Through the window, outside, it is sunny. It is only raining in here.'] },
      { id: 'desk', type: 'decor', at: [21, 8], look: 'desk', lines: ['A school desk with a timetable taped on. Every afternoon: “home time 4:00 — wait at the gate”.'] },
      { id: 'slip1', type: 'decor', at: [21, 13], look: 'letter', lines: [slip(1, 'it', 'stuck to the wet floor')] },
      { id: 'b1', type: 'decor', at: [6, 9], look: 'barrel', lines: ['A wooden bucket. It would rather be under a leak than in the way.'] },
      { id: 'b2', type: 'decor', at: [12, 6], look: 'barrel', lines: ['A wooden bucket, half full of yesterday.'] },
      { id: 'b3', type: 'decor', at: [18, 9], look: 'barrel', lines: ['A wooden bucket. Someone has written on it: “for the drips, not for crying”.'] },
      { id: 'p1', type: 'decor', at: [6, 5], look: 'puddle', solid: false, lines: ['Drops fall here from the ceiling, one by one, always on the same board.'] },
      { id: 'p2', type: 'decor', at: [12, 11], look: 'puddle', solid: false, lines: ['A drip, falling here with the patience of a clock.'] },
      { id: 'p3', type: 'decor', at: [18, 5], look: 'puddle', solid: false, lines: ['Here the ceiling drips. The board is dark and soft.'] },
      SOUL([EN('At four o’clock the other mums came with umbrellas. At five, the caretaker did.')])]
      .concat(marks([[6, 6], [6, 7], [6, 8], [6, 10], [12, 5], [12, 7], [12, 8], [12, 9], [12, 10], [18, 6], [18, 7], [18, 8], [18, 10]], 'scuff')),
    npcs: [{ id: 'N1902', name: 'The Child in the Yellow Raincoat', look: H({ t: 'kid', hairStyle: 'short', body: 'coat', c: ['#f0c830', '#d0a820', '#f0d8c0', '#2a1a10'], eyes: 'dots' }), behavior: 'static', solid: true, at: [9, 4],
        lines: [EN('It only rains inside. Outside it’s sunny. Everybody else went home.'), EN('Someone was supposed to bring the umbrella. It’s fine. I can wait.'), EN('If the buckets are under the drips, the room sounds like a clock. Then I know how long I’ve waited.')],
        reacts: { E249: { lines: ['You hold the red umbrella out to her.', EN('…No. You keep it. Someone’s coming for me. They said.'), 'She pushes it back towards you, gently, the way grown-ups do.'], do: [{ secret: 'umbrella_offered' }] } } },
      { id: 'N1903', name: 'A Drip', look: { t: 'blob', c: ['#8ab0d8'], h: 7 }, behavior: 'shy', shyDist: 3, radius: 4, speed: 1.2, solid: false, count: 2,
        lines: ['A single drop of rain with nowhere to land. It hides behind the bed leg.'] }],
    mech: [{ type: 'push', blocks: ['b1', 'b2', 'b3'], plates: ['p1', 'p2', 'p3'], give: 'E249',
      winLines: ['The three drips land in the three buckets: plink, plonk, plink. The room ticks like a clock.', 'In the dry space under the bed, something red has been waiting: an umbrella, child-sized, never opened.'] }],
    extra: { noFurnish: true },
    info: { summary: 'A child’s bedroom where it rains indoors, while outside the window it is sunny.',
      rules: ['Push the three buckets under the three drips (the dark boards): this gives the Red Umbrella (E249).', 'Forecast slip 1 of 4 (“it”) lies on the floor.'],
      secrets: ['With the Red Umbrella equipped, the big puddle goes still and becomes a way down (W363).'],
      lore: 'Waiting at the school gate in the rain, for an umbrella nobody brought.' } });

  /* ---------------------------------------------------------------
   *  W363 — Le Dessous de la flaque (l'écho à l'envers, le labyrinthe invisible)
   * --------------------------------------------------------------- */
  var UNDERSIDE = (function () {
    var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.');
    g.ellipse(14, 8, 3, 2, ','); g.rect(4, 4, 5, 3, '~');
    g.text(18, 12, ['..xxxxxxxxx', 'x.x.....x..', 'x.x.xxx.x.x', 'x...x...x.x', 'xxx.x.xxx.x', 'x...x.....x', 'x.xxxxxxx.x', 'x.x.....x.x', 'x...xxx....']);
    return g.rows();
  })();
  S({ id: 'W363', name: 'The Underside of the Puddle', depth: 4, tier: 'hard', back: 'W362', backLook: 'ladder', backLabel: 'the ladder back up through the puddle', backAt: [15, 2],
    map: UNDERSIDE, look: { floor: { p: 'flat', c: ['#dcd8e4', '#d0ccd8'] }, floor2: { p: 'marble', c: ['#e8e4f0', '#c8c0d8'] }, wall: { p: 'flat', c: ['#3a3650', '#2a2640'], topColor: '#3a3650' }, wallface: { p: 'wallpaper', c: ['#8a84a8', '#7a7498', '#5a5478'], skirt: '#2a2640' }, water: { p: 'water', c: ['#6a8ab8', '#5a7aa8', '#8aaad0', '#e0ecf8'] } },
    style: { tallWalls: true, renderer: 'watercolor', filter: 'hue-rotate(160deg) saturate(0.8)' }, music: 'underpuddle', amb: { type: 'drip', vol: 0.08 }, dark: 0.45, weather: { motes: true },
    extra: { invertY: true },
    doors: [{ to: 'W379', at: [3, 18], opt: { style: 'glass', c: ['#a8c0e0'] }, cond: { flag: 'puddle_echo' }, label: 'a door seen through water: a bus shelter, at night' }],
    signs: [{ at: [8, 10], lines: [EN('Down here, words come back the wrong way round. Give them back the way they came.')] },
      { at: [17, 10], lines: [EN('Walls you can’t see are walls all the same. Feel along them.')] }],
    place: [{ id: 'rose', type: 'decor', at: [14, 8], look: 'chandelier', light: 3, lines: ['A ceiling lamp, growing out of the floor like a flower. Down here, ceilings are what you walk on.'] },
      { id: 'ownlamp', type: 'decor', at: [28, 20], look: 'lamp', light: 2.4, lines: ['A bedside lamp, upside down, switched on. Her own lamp, seen from under the floor.', 'Above it, through the boards, someone is sitting in its light, very still, not sleeping.'], use: [{ secret: 'puddle_ownlamp' }] }],
    npcs: [{ id: 'N1904', name: 'The Reflection', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], alpha: 0.5 }), behavior: 'mimic', solid: false,
        lines: [EN('Up there you are standing in a puddle. Down here you are standing on a ceiling.'), EN('Say something. I’ll say it back. Backwards. That’s how water talks.'), EN('When you walk up, I walk down. Try it.')] },
      { id: 'N1905', name: 'A Fish of Lamplight', look: { t: 'fish', c: ['#f0e0a0'], h: 9, glow: '#f0e0a0' }, light: 1.2, behavior: 'swim', radius: 3, speed: 0.6, solid: false, count: 2,
        lines: ['A fish made of the light that falls into puddles. It swims in the ceiling of the water.'] }],
    mech: [{ type: 'echo', zone: [1, 1, 28, 20], words: ['niar', 'yad', 'emoh', 'nwod'], flag: 'puddle_echo',
      winLines: ['You give the word back the way it came. The water ripples overhead, pleased.', 'Through the ceiling of the puddle, a shape appears: a bus shelter, at night, in the rain.'],
      reward: [{ set: { puddle_echo: true } }] }],
    info: { summary: 'The other side of a puddle: a room upside down, where the floor is a ceiling and up means down.',
      rules: ['Up and down are reversed.', 'Say any word: the water echoes back a word written backwards; say that word to it. A door to W379 appears.'],
      secrets: ['In the south-east, a maze of invisible walls leads to her own bedside lamp, seen from below.'],
      lore: 'Under every puddle there is a ceiling, and under every ceiling someone awake.' } });

  /* ---------------------------------------------------------------
   *  W364 — La Salle du tonnerre en bocaux
   * --------------------------------------------------------------- */
  var THUNDER = (function () {
    var g = K.grid(36, 20, ' '); g.box(0, 0, 36, 20, '#', '.');
    [4, 8, 12, 16].forEach(function (y) { [[4, 9], [11, 16], [19, 24], [26, 31]].forEach(function (s) { g.hline(s[0], s[1], y, '}'); }); });
    return g.rows();
  })();
  S({ id: 'W364', name: 'The Hall of Kept Thunder', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'metal', c: ['#4a4a6a'] }, backLabel: 'back to the depot', backAt: [1, 10],
    map: THUNDER, tall: { '}': { look: 'jar', opt: { c: ['rgba(140,120,200,0.65)'], inside: '#e8e0ff' } } },
    look: { floor: { p: 'stone', c: ['#2a2838', '#24222e', '#34324a'] }, wall: { p: 'flat', c: ['#100e18', '#0a0810'], topColor: '#100e18' }, wallface: { p: 'panel', c: ['#3a3650', '#2e2a44', '#1a1828'], skirt: '#8070c0' } },
    style: { tallWalls: true }, music: 'keptthunder', amb: { type: 'drone', vol: 0.05 }, dark: 0.78,
    doors: [{ to: 'W365', at: [34, 18], opt: { style: 'wood', c: ['#c8b8e0'] }, cond: { any: [{ said: 'hush' }, { said: 'shh' }, { said: '쉿' }] }, label: 'a small door with a cot drawn on it' }],
    signs: [{ at: [18, 18], lines: [EN('Thunder is kept in jars so that someone can sleep. Hush.')] }],
    place: [{ id: 'j1', type: 'decor', at: [2, 6], look: 'jar', lookOpt: { c: ['rgba(200,180,255,0.8)'], inside: '#fff8c0' }, light: 0.8, lines: ['A big jar, sealed with wax. Label: “NIGHT OF 3 MARCH”. Something inside clears its throat.'] },
      { id: 'j2', type: 'decor', at: [33, 6], look: 'jar', lookOpt: { c: ['rgba(200,180,255,0.8)'], inside: '#fff8c0' }, light: 0.8, lines: ['A big jar. Label: “THE ONE THAT WOKE HER”. The lid is taped down twice.'] },
      { id: 'j3', type: 'decor', at: [2, 14], look: 'jar', lookOpt: { c: ['rgba(200,180,255,0.8)'], inside: '#fff8c0' }, light: 0.8, lines: ['A big jar. Label: “FIRST, FAR AWAY”. It rumbles very softly, like a stomach.'] },
      { id: 'j4', type: 'decor', at: [33, 14], look: 'jar', lookOpt: { c: ['rgba(200,180,255,0.8)'], inside: '#fff8c0' }, light: 0.8, lines: ['A big jar. Label: “RIGHT OVERHEAD — DO NOT OPEN BEFORE MIDNIGHT”.'] },
      SOUL([KS('천둥 치면 엄마 깨. 그러니까 울지 마.', 'If there’s thunder, Mum wakes up. So don’t cry.')])],
    npcs: [{ id: 'N1906', name: 'The Jar Keeper', look: H({ t: 'old', head: 'hood', body: 'robe', c: ['#4a4470', '#3a3460', '#d8c8b0', '#c8c8d8'], eyes: 'closed' }), behavior: 'static', solid: true, at: [17, 10],
        lines: [EN('Every storm that might have woken her is in here. I put the lids on myself.'), EN('A child who never hears thunder grows up thinking the sky is always polite.'), { seq: [EN('Listen. The big jars talk to each other in the order the storm comes.'), EN('Open them the same way and one will fit in your pocket.')] }] },
      { id: 'N1907', name: 'A Moth That Eats Lightning', look: { t: 'moth', c: ['#e8e0ff'], h: 9, glow: '#d8d0ff' }, light: 1, behavior: 'fly', radius: 6, speed: 0.8, solid: false, count: 3,
        lines: ['A pale moth. Its wings flicker every time a jar rumbles, as if it had swallowed a little of the flash.'] }],
    mech: [{ type: 'sequence', order: ['j3', 'j1', 'j4', 'j2'], give: 'E250', ring: { every: 1.5, pause: 4, sfx: 'crumble', glyph: 'ϟ', color: '#d8d0ff', hear: 18 },
      wrongLine: 'The jar grumbles and goes quiet. That is not when it comes in the storm.',
      winLines: ['The four jars answer each other, far, then near, then right overhead, then the one that woke her.', 'The last jar goes light in your hands. The storm inside has folded itself small enough to carry.'] }],
    info: { summary: 'A dark hall of shelves where every thunderstorm that might have woken someone is kept in a jar.',
      rules: ['The four big jars rumble in turn; open them in the same order (far, near, overhead, the one that woke her).', 'This gives Bottled Thunder (E250).'],
      secrets: ['Saying “hush” (or shh, 쉿) opens a small door to the Storm Nursery (W365) in the far corner.'],
      lore: 'Storms bottled so that a mother could sleep through the day.' } });

  /* ---------------------------------------------------------------
   *  W365 — La Nursery des orages
   * --------------------------------------------------------------- */
  var NURSERY = (function () {
    var g = K.grid(26, 18, ' '); g.box(0, 0, 26, 18, '#', '.');
    g.rect(6, 5, 12, 7, ',');
    g.box(20, 11, 6, 7, '#', '.'); g.set(20, 14, '?');
    return g.rows();
  })();
  S({ id: 'W365', name: 'The Storm Nursery', depth: 4, tier: 'hard', back: 'W364', backLook: 'door', backOpt: { style: 'wood', c: ['#c8b8e0'] }, backLabel: 'back to the thunder jars', backAt: [1, 9],
    map: NURSERY, look: { floor: { p: 'wood', c: ['#3a3450', '#322c46', '#443e5a'] }, floor2: { p: 'rug', c: ['#5a5480', '#4a4470'] }, wall: { p: 'flat', c: ['#14121e', '#0c0a14'], topColor: '#14121e' }, wallface: { p: 'wallpaper', c: ['#4a4878', '#3a3868', '#e8e0a0'], skirt: '#1a1830' }, secret: { p: 'wallpaper', c: ['#4a4878', '#3a3868', '#e8e0a0'] } },
    style: { tallWalls: true, stars: true }, music: 'stormnursery', amb: { type: 'musicbox', vol: 0.04 }, dark: 0.62,
    doors: [{ to: 'W375', at: [12, 1], opt: { style: 'wood', c: ['#8a90a8'] }, cond: { flag: 'nursery_calm' }, label: 'a door marked GROWN, left open by something big' },
      { to: 'W370', at: [12, 16], look: 'stairs', label: 'cellar steps up into an orchard' }],
    decor: [{ look: 'cloudpuff', n: 3, lines: ['A small storm cloud asleep in a heap, rumbling in its sleep.', 'A cloud no bigger than a cat, snoring drizzle.'] },
      { look: 'musicbox', n: 1, lines: ['A music box. Instead of a tune, it plays very distant thunder, slowed down until it sounds like breathing.'] }],
    signs: [{ at: [18, 14], lines: [EN('The nurse keeps one jar for herself, behind a wall that is only wallpaper.')] }],
    place: [{ id: 'cot1', type: 'decor', at: [4, 3], look: 'bed', lookOpt: { c: ['#e0e0f0', '#8a90c0'] }, lines: ['A cot. Name tag: 개미 (Gaemi). Empty, warm.'] },
      { id: 'cot2', type: 'decor', at: [9, 3], look: 'bed', lookOpt: { c: ['#e0e0f0', '#8a90c0'] }, lines: ['A cot. Name tag: 나리 (Nari). A small wet patch on the pillow.'] },
      { id: 'cot3', type: 'decor', at: [16, 3], look: 'bed', lookOpt: { c: ['#e0e0f0', '#8a90c0'] }, lines: ['A cot. Name tag: 제비 (Jebi). Something here has been chewing the blanket.'] },
      { id: 'bigcot', type: 'decor', at: [21, 4], look: 'bed', lookOpt: { c: ['#f0f0f8', '#5a6080'] }, lines: ['The biggest cot, much too big for a baby. Empty. The name tag says: 미리내 (Mirinae).', 'The bars are bent outwards. Whatever slept here grew up and left by the door marked GROWN.'] },
      { id: 'thunder0', type: 'decor', at: [23, 14], look: 'jar', lookOpt: { c: ['rgba(255,240,200,0.8)'], inside: '#fff0a0' }, light: 1.4, lines: ['A tiny jar on a high shelf. The label is in a child’s hand:', '“the first thunder i ever heard. i wasn’t scared. mum was holding me.”'], use: [{ secret: 'first_thunder' }] }],
    npcs: [{ id: 'N1908', name: 'The Night Nurse of Storms', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#e8eef4', '#c8d0d8', '#e0c8b0', '#2a1a10'], eyes: 'closed' }), behavior: 'static', solid: true, at: [12, 9],
        lines: [KS('쉿. 이제 겨우 재웠어.', 'Shh. I’ve only just got them to sleep.'), KS('얘네는 밤에만 깨. 엄마들이 일하러 가면.', 'They only wake at night. When the mums go to work.'),
          KS('불꽃 애들이 또 빠져나왔네. 뛰지 마. 뛰면 더 도망가.', 'The little sparks got out again. Don’t run. If you run they flee.'),
          KS('제일 큰 애는 벌써 나갔어. 이름을 불러 주면 돌아볼지도 몰라.', 'The biggest one has already left. If you call it by its name, it might turn round.')] },
    ].concat(['N1909', 'N1945', 'N1946', 'N1947', 'N1948'].map(function (id) {
      /* chaque étincelle a son identifiant : catchN compte les êtres attrapés par identifiant */
      return { id: id, name: 'A Loose Spark', tag: 'spark', look: { t: 'jelly', c: ['#f8f080'], h: 7, glow: '#f8f0a0' }, light: 1.3, behavior: 'wander', radius: 6, speed: 1.5, solid: false,
        lines: ['A baby lightning, out of its cot. It crackles when it giggles.'] };
    })),
    mech: [{ type: 'catchN', tag: 'spark', n: 5, noRun: true, flag: 'nursery_calm', countText: 'Sparks back in bed # / %', runLine: 'It crackles and darts away. Sparks flee from running feet.',
      winLines: ['Five sparks, tucked back into five clouds. The nursery hums like a fridge at night.', 'The nurse does not open her eyes. She smiles, the way people smile who have not slept since yesterday.', 'The door marked GROWN swings open by itself.'],
      reward: [{ set: { nursery_calm: true } }, { secret: 'nursery_calm' }] }],
    info: { summary: 'A night nursery where baby storms sleep in cots, watched by a nurse who never opens her eyes.',
      rules: ['Catch the five loose sparks by walking into them, never running.', 'The door marked GROWN then opens onto the Typhoon’s Eye (W375).', 'The biggest cot gives the name of the typhoon (미리내, Mirinae).'],
      secrets: ['A wall on the right only pretends (walk through it with Smoked Glass or another revealing effect).', 'Behind it, a closet keeps the first thunder she ever heard.'],
      lore: 'Night storms, raised by a nurse who works nights.' } });

  /* ---------------------------------------------------------------
   *  W366 — Le Couloir de la mousson (장마, Séoul, juillet 1989)
   * --------------------------------------------------------------- */
  var MONSOON = (function () {
    var g = K.grid(70, 7, ' '); g.box(0, 0, 70, 7, '#', '.');
    g.hline(1, 68, 5, 'f');
    g.rect(13, 3, 3, 2, 'w'); g.rect(30, 2, 2, 3, 'w'); g.rect(47, 3, 4, 2, 'w'); g.rect(60, 2, 3, 3, 'w');
    return g.rows();
  })();
  var APTS = [];
  for (var ai = 0; ai < 10; ai++) APTS.push({ id: 'd12' + ('0' + (ai + 1)).slice(-2), type: 'decor', at: [6 + ai * 6, 1], look: 'door', lookOpt: { style: 'metal', c: ['#6a7a70'] },
    lines: [['Door 1201. Two pairs of shoes outside, soaked.', 'Door 1202. Someone inside is watching the weather on television, loudly.', 'Door 1203. A radio is on.', 'Door 1204. A child’s umbrella hangs on the handle, folded, dry.', 'Door 1205. Nobody has lived here since the last monsoon.', 'Door 1206. A smell of instant noodles.', 'Door 1207. A note: “back late — 야근 (overtime)”.', 'Door 1208. A bucket outside, catching drips from the frame.', 'Door 1209. Silence, and the sound of a clock.', 'Door 1210. The number has been washed off.'][ai]] });
  S({ id: 'W366', name: 'The Monsoon Corridor', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'wood', c: ['#4a6a5a'] }, backLabel: 'back to the depot', backAt: [1, 2],
    map: MONSOON, tall: { f: { look: 'fence', opt: { c: ['#7a8a80'] } } },
    look: { floor: { p: 'concrete', c: ['#6a7068', '#5a6058'] }, wall: { p: 'concrete', c: ['#8a9088', '#7a8078', '#5a6058'] }, wallface: { p: 'concrete', c: ['#9aa098', '#8a9088', '#6a7068'], skirt: '#4a5048' }, shallow: { p: 'water', c: ['#5a6a70', '#50606a', '#7a8a90', '#b0c0c8'] } },
    style: { tallWalls: true, renderer: 'photo' }, music: 'monsoon', amb: { type: 'rain', vol: 0.14 }, dark: 0.35, weather: { rain: true, wind: 0.3 },
    doors: [{ to: 'W367', at: [68, 3], opt: { style: 'wood', c: ['#8a7a5a'] }, cond: { equipped: 'E249' }, label: 'a door behind the curtain of rain' }],
    decor: [{ look: 'pot', n: 4, opt: { plant: true }, lines: ['A pot of chilli plants on the corridor floor, drowning politely.', 'A pot used as a bucket. It is full and still being used.'] }],
    place: APTS.concat([{ id: 'curtain', type: 'decor', at: [67, 1], look: 'waterfall', solid: true, lines: ['At the very end of the corridor, the gutter overflows in one solid curtain of water.', 'Behind it there might be anything.'] },
      { id: 'slip3', type: 'decor', at: [52, 4], look: 'letter', lines: [slip(3, 'not', 'plastered to the corridor floor by the rain')] },
      SOUL([KS('김 과장, 비 와도 회식은 해.', 'Manager Kim, rain or no rain, there’s a team dinner.')])]),
    npcs: [{ id: 'N1910', name: 'A Neighbour with Buckets', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#8a6a7a', '#6a4a5a', '#e0c0a0', '#c8c8c8'] }), behavior: 'wander', radius: 3, speed: 0.5, solid: true, at: [20, 3],
        lines: [KS('장마야. 사십 일은 간대.', 'It’s the monsoon. They say forty days.'), KS('1204호 애는 맨날 혼자 있어. 아빠가 회사에서 안 와.', 'The child in 1204 is on her own every day. Her dad doesn’t come back from the office.'),
          KS('1204호는 세 번 두드려야 열어. 아빠가 그렇게 두드리거든.', 'At 1204 you have to knock three times. That’s how her dad knocks.'), KS('저 끝은 우산 없으면 못 지나가.', 'You can’t get past the far end without an umbrella.')] },
      { id: 'N1911', name: 'The Radio in 1203', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 10, ambientEvery: 16, at: [18, 2],
        ambientLines: [KS('장마전선이 북상하고 있습니다. 내일도 비가 오겠습니다.', 'The monsoon front is moving north. Rain again tomorrow.'), KS('서울 지역에 호우 경보가 내려졌습니다.', 'A heavy-rain warning has been issued for the Seoul area.'), KS('…오늘 밤 퇴근길, 우산 꼭 챙기세요.', '…On your way home tonight, don’t forget your umbrella.')] }],
    mech: [{ type: 'knock', mark: 'd1204', n: 3, within: 2.5, flag: 'knock_1204', firstLine: 'You knock once. Behind the door, the television goes quiet.',
        winLines: ['Three knocks. Behind the door, small feet run.', KS('아빠?', 'Dad?'), 'The door opens on its chain. A girl of nine, in socks, holding a bowl of rice under a plate.', KS('…아니구나. 아빠 아니구나.', '…Oh. It isn’t you. It isn’t Dad.'), KS('괜찮아. 비 오면 원래 늦어.', 'It’s all right. When it rains he’s always late.'), 'She closes the door gently, so the rice stays warm.'],
        reward: [{ secret: 'miran_1204' }, { cookie: 1 }] },
      { type: 'weatherWhen', cond: { phase: ['late', 'final'] }, weather: { wind: 0.8 } }],
    info: { summary: 'The open-air corridor of a Seoul apartment block in the monsoon of July 1989; buckets everywhere.',
      rules: ['Knock three times quickly at door 1204: a child opens (a biscuit).', 'Forecast slip 3 of 4 (“not”) lies on the floor.', 'Late in the dream the monsoon wind rises.'],
      secrets: ['With the Red Umbrella equipped, a door appears behind the curtain of rain at the far end (W367).'],
      lore: 'Mi-ran at nine, waiting for her father through forty days of rain.' } });

  /* ---------------------------------------------------------------
   *  W367 — Le Séchoir des jours mouillés
   * --------------------------------------------------------------- */
  var DRYING = (function () {
    var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, '#', '.');
    g.set(14, 17, '_'); g.rect(24, 14, 4, 4, ',');
    return g.rows();
  })();
  var LINES = [[5, 4], [10, 4], [15, 4], [20, 4], [5, 10], [10, 10], [15, 10], [20, 10]];
  S({ id: 'W367', name: 'The Drying Room of Wet Days', depth: 4, tier: 'hard', back: 'W366', backLook: 'door', backOpt: { style: 'wood', c: ['#8a7a5a'] }, backLabel: 'back into the monsoon', backAt: [1, 10],
    map: DRYING, look: { floor: { p: 'tile', c: ['#b8b0a0', '#988f80'] }, floor2: { p: 'rug', c: ['#c8b8a0', '#b0a088'] }, wall: { p: 'flat', c: ['#3a342c', '#2a241c'], topColor: '#3a342c' }, wallface: { p: 'tile', c: ['#d8d0c0', '#b8b0a0', '#8a8070'], skirt: '#5a5040' }, pit: { p: 'void', c: ['#0a0a10'] } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'dryingroom', amb: { type: 'drip', vol: 0.06 }, dark: 0.2, weather: { motes: true },
    fall: { to: 'W363' },
    doors: [{ to: 'W368', at: [28, 2], look: 'stairs', cond: { flag: 'drying_pairs' }, label: 'stairs up to the roof, where it is hot' }],
    decor: [{ look: 'sock', n: 3, lines: ['An odd sock pegged to nothing. A label: “Thursday”.', 'A sock, still damp, from a day nobody wanted to remember.'] },
      { look: 'towel', n: 2, lines: ['A hospital towel. It never dries. It smells of the night shift.', 'A towel folded in four. Someone has written on the label: “for after the rain”.'] },
      { look: 'washer', n: 1, lines: ['A washing machine, running. It has been on the rinse cycle since 1989.'] }],
    place: LINES.map(function (p, i) { return { id: 't' + (i + 1), type: 'decor', at: p, look: 'clothesline', lines: ['A day hung up to dry.'] }; })
      .concat([{ id: 'drain', type: 'decor', at: [13, 17], look: 'drain', solid: false, lines: ['A floor drain. Everything that drips in this room goes down it, and lands somewhere upside down.'] },
        SOUL([EN('Wet days take years to dry. Some never do. You hang them up anyway.')])]),
    npcs: [{ id: 'N1912', name: 'The Laundress of Days', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#c8c0b0', '#a8a090', '#e0c0a0', '#e8e8e8'], acc: 'tray' }), behavior: 'static', solid: true, at: [25, 12],
        lines: [EN('Every day on these lines got rained on. Tuesdays mostly. Birthdays more than you’d think.'), EN('Pair them up. A day is never lonely if its other half is hanging next to it.'),
          EN('When the lines are sorted, the heat from the roof comes down the stairs and dries them. Up there it’s August.'), { if: { flag: 'drying_pairs' }, t: 'There. Matched. Go on up, it’s dry weather on the roof. Too dry.', lang: 'en' }] },
      { id: 'N1913', name: 'A Sock Looking for Its Pair', look: { t: 'worm', c: ['#e0d8f0'], h: 8 }, behavior: 'wander', radius: 4, speed: 0.6, solid: false,
        lines: ['A single sock, inching along the floor. It is looking for its other half, like everything else in this room.'] }],
    mech: [{ type: 'pairs', tiles: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'], flag: 'drying_pairs', wrongLine: 'Two days that don’t belong together. You hang them back apart.', doneLine: 'The days hang in pairs now, dripping in time.',
      winLines: ['The last two days are hung side by side. Every line drips at the same moment, then stops.', 'Warm air rolls down the stairs from the roof. Somewhere above, it is August.'],
      reward: [{ set: { drying_pairs: true } }] }],
    info: { summary: 'A tiled drying room where rained-on days are hung up on lines, still damp after years.',
      rules: ['Each clothesline hides a symbol: find the four pairs (memory game).', 'The stairs up to the Heatwave Rooftop (W368) then appear.'],
      secrets: ['Pushing into the floor drain lets her fall through to the Underside of the Puddle (W363).'],
      lore: 'The days that got wet, and the patience of drying them.' } });

  /* ---------------------------------------------------------------
   *  W368 — Le Toit de la canicule (폭염, un 옥탑방 en août)
   * --------------------------------------------------------------- */
  var ROOFTOP = (function () {
    var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.');
    g.rect(4, 3, 10, 7, '#'); g.rect(30, 3, 6, 2, ',');
    return g.rows();
  })();
  S({ id: 'W368', name: 'The Heatwave Rooftop', depth: 4, tier: 'hard', back: 'W367', backLook: 'stairsdown', backLabel: 'the stairs back down to the drying room', backAt: [2, 25], outdoor: true,
    map: ROOFTOP, look: { floor: { p: 'flat', c: ['#3a8a5a', '#348050'] }, floor2: { p: 'concrete', c: ['#9a9a90'] }, wall: { p: 'concrete', c: ['#b8b8b0', '#a0a098', '#80807a'] } },
    style: { sky: ['#f8e8b0', '#fff8e0'], filter: 'saturate(1.25) contrast(1.05) sepia(0.15)', cliffH: 0.6, cliff: '#7a7a72' }, music: 'heatwave', amb: { type: 'crickets', vol: 0.07 }, weather: { dust: true },
    doors: [{ to: 'W372', at: [33, 7], opt: { style: 'metal', c: ['#c8e0f0'] }, cond: { fn: sky('snow') }, label: 'a hatch in the water tank, rimmed with frost' }],
    decor: [{ look: 'clothesline', n: 1, lines: ['Washing hung out at noon. It dried in four minutes and is now too hot to touch.'] },
      { look: 'antenna', n: 2, lines: ['A satellite dish turned towards a country where it is cooler.'] },
      { look: 'vent', n: 2, lines: ['An air-conditioner unit, blowing hot air onto the roof so that someone downstairs can be cold.'] },
      { look: 'wateringcan', n: 1, lines: ['A watering can by the outdoor tap. The water runs hot for a long time before it runs warm.'] }],
    place: [{ id: 'roomdoor', type: 'decor', at: [8, 10], look: 'door', lookOpt: { style: 'metal', c: ['#5a8a9a'] }, lines: ['The door of the rooftop room. Inside: a desk, a fan, a mattress, a revision timetable.', 'It is forty degrees in there.'] },
      { id: 'tank', type: 'decor', at: [33, 5], look: 'watertower', lines: ['The water tank. Too hot to touch.', 'Someone has scratched a snowflake into the paint, next to a seam that looks like a hatch.'] },
      { id: 'c1', type: 'decor', at: [18, 6], look: 'pot', lookOpt: { plant: true }, lines: ['A pot of chilli plants, wilted flat. You water it. It lifts one leaf.'] },
      { id: 'c2', type: 'decor', at: [24, 14], look: 'pot', lookOpt: { plant: true }, lines: ['Chillies drying on the plant. You water the soil anyway. It hisses.'] },
      { id: 'c3', type: 'decor', at: [6, 20], look: 'pot', lookOpt: { plant: true }, lines: ['A pot of perilla, burnt brown at the edges. You give it water.'] },
      { id: 'c4', type: 'decor', at: [30, 22], look: 'pot', lookOpt: { plant: true }, lines: ['The last pot, in full sun. You pour, and the soil drinks with a sound like a sigh.'] },
      SOUL([KS('옥상은 여름엔 지옥이고 겨울엔 냉장고야. 그래도 하늘은 제일 가까워.', 'The roof is hell in summer and a fridge in winter. But it’s the closest to the sky.')])],
    npcs: [{ id: 'N1914', name: 'A Student in the Heat', look: H({ t: 'adult', hairStyle: 'short', body: 'shirt', c: ['#f0f0f0', '#d0d0d0', '#f0d0b0', '#1a1010'], acc: 'book', eyes: 'line' }), behavior: 'static', solid: true, at: [10, 11],
        lines: [KS('에어컨은 엄마 방에만 있어. 엄마는 밤에 일하니까 낮에 자야 돼.', 'The air conditioner is only in Mum’s room. Mum works nights, so she has to sleep in the day.'), KS('수능까지 백 일. 더워도 해야 돼.', 'A hundred days until the exam. Hot or not, I have to.'),
          KS('여름에 눈 오면 소원 들어준대. 거짓말이지?', 'They say if it snows in summer, you get a wish. That’s a lie, isn’t it?'), { if: { flag: 'rooftop_watered' }, seq: ['The rain runs down her face. She closes her book.', KS('…시원하다. 잠깐만 쉴게.', '…That’s cool. I’ll rest, just for a minute.')] }] },
      { id: 'N1915', name: 'A Delivery Rider', look: H({ t: 'adult', head: 'helmet', body: 'coat', c: ['#3a6ab0', '#2a5a9a', '#e0c0a0', '#f0f0f0'] }), behavior: 'static', solid: true, at: [5, 24],
        lines: [KS('폭염 경보요? 그래도 배달은 가야죠. 별점 떨어져요.', 'A heatwave warning? I still have to deliver. My rating drops.'), KS('물 한 잔만… 아, 아니에요. 괜찮아요.', 'Just a glass of water… ah, no. I’m fine.'), KS('저 고추 화분들 물 좀 주지. 네 개 다 타겠네.', 'Someone should water those chilli pots. All four are going to burn.')] },
      { id: 'N1916', name: 'A Panting Dog', look: { t: 'dog', c: ['#c8a070'], h: 11 }, behavior: 'static', solid: true, at: [31, 8],
        lines: ['A dog lying flat in the only shade, the shape of the water tank. It thumps its tail once, to save energy.'] }],
    mech: [{ type: 'visitAll', marks: ['c1', 'c2', 'c3', 'c4'], flag: 'rooftop_watered', countText: 'Pots watered # / %',
        winLines: ['Far off over the city, the sky makes a sound like a fridge door opening.', 'A summer shower — 소나기, sonagi — comes across the rooftops in a straight line and stops exactly here.'],
        reward: [{ set: { rooftop_watered: true } }, { cookie: 1 }] },
      { type: 'weatherWhen', cond: { flag: 'rooftop_watered' }, weather: { rain: true } }],
    info: { summary: 'The roof of an apartment block in August, with a rooftop room, a water tank and four pots of burnt chillies.',
      rules: ['Water the four pots: a summer shower (sonagi) comes and cools the roof (a biscuit).'],
      secrets: ['If it snows on the roof (First Snowflake, E252, turned to snow), a frosted hatch opens in the water tank.', 'It leads to the Room of the First Snow (W372).'],
      lore: 'Studying through a heatwave on the roof, while the only cool room belongs to a mother asleep by day.' } });

  /* ---------------------------------------------------------------
   *  W369 — Le Tunnel des voix (le vent)
   * --------------------------------------------------------------- */
  var TUNNEL = (function () {
    var g = K.grid(64, 9, ' '); g.box(0, 0, 64, 9, '#', '.');
    [[12, 2], [12, 6], [26, 3], [40, 5], [52, 2], [52, 6]].forEach(function (p) { g.set(p[0], p[1], 'o'); });
    return g.rows();
  })();
  S({ id: 'W369', name: 'The Wind Tunnel of Voices', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'wood', c: ['#8a8a7a'] }, backLabel: 'back to the depot', backAt: [1, 4],
    map: TUNNEL, look: { floor: { p: 'concrete', c: ['#7a7a84', '#6a6a74'] }, wall: { p: 'concrete', c: ['#4a4a54', '#3a3a44', '#2a2a34'] }, wallface: { p: 'concrete', c: ['#5a5a64', '#4a4a54', '#3a3a44'], skirt: '#2a2a34' }, rock: { p: 'rock', c: ['#6a6a70', '#5a5a60', '#7a7a80'] } },
    style: { tallWalls: true, renderer: 'engraving' }, music: null, amb: { type: 'wind', vol: 0.16 }, dark: 0.3, weather: { leaves: true, wind: 0.9 },
    doors: [{ to: 'W375', at: [62, 4], opt: { style: 'wood', c: ['#9aa0a8'] }, cond: { flag: 'windvane_turned' }, label: 'the place where the wind goes round and round' },
      { to: 'W377', at: [45, 7], look: 'hatch', cond: { equipped: 'E253' }, label: 'a vent breathing yellow dust' }],
    decor: [{ look: 'scraps', n: 6, lines: ['A scrap of paper pinned to the wall by the wind: “i’m sorry”.', 'A scrap: “call me when you get home”. Nobody did.', 'A scrap: “you never asked”.', 'A scrap with a child’s drawing of an umbrella, blown inside out.'] }],
    place: [{ id: 'vent', type: 'decor', at: [43, 7], look: 'vent', lines: ['A vent. Yellow dust pours out of it in breaths. Nobody could go in there without something over their mouth.'] },
      { id: 'chime', type: 'decor', at: [22, 1], look: 'chime', lines: ['A wind chime, ringing so hard it can no longer make a tune. Every voice in the tunnel tangles in it.'],
        onEffect: { E250: [{ lines: ['You uncork the thunder under the chime. It booms down the tunnel and back.', 'For a moment every voice in the wind stops, the way a class goes quiet.', 'In the silence one small voice is left, very close:', EN('…i wanted to say it too.')] }, { secret: 'wind_hushed' }] } },
      SOUL([EN('Everything nobody said aloud ends up in the wind. That is why it never stops.')])],
    signs: [{ at: [30, 6], lines: [EN('When the vane turns, walk where it points. The wind likes to be followed.')] }],
    npcs: [{ id: 'N1917', name: 'The Weathervane', look: { t: 'bird', c: ['#c8a040', 0, 0, '#a06020'], h: 14 }, behavior: 'static', solid: true, at: [32, 4],
        lines: [{ seq: ['A tin cockerel on a pole, the kind that sits on roofs.', 'It points somewhere new every second, then waits to see if you follow.'] }] },
      { id: 'N1918', name: 'The Voices in the Wind', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 9,
        ambientLines: [EN('…you never asked…'), KS('…괜찮다고 했잖아…', '…you said it was all right…'), KN('…다 잘될 것입니다…', '…everything will be fine…'), EN('…come back tomorrow…'), KS('…미안해, 오늘도 늦어…', '…sorry, late again today…'), EN('…say something…')] }],
    mech: [{ type: 'wind', push: true, strength: 0.9, dir: 'left' },
      { type: 'dirSequence', ent: 'N1917', seq: ['right', 'up', 'right', 'down', 'right'], dist: 6, flag: 'windvane_turned',
        winLines: ['You walk where the vane points, five times.', 'The cockerel creaks all the way round and stays there, pointing to the far end.', 'Down the tunnel, the wind starts to turn in a circle.'],
        reward: [{ set: { windvane_turned: true } }] }],
    info: { summary: 'A long concrete tunnel where the wind carries every sentence nobody said aloud, and pushes her back.',
      rules: ['The wind pushes her back when she stands still (a scarf-type effect resists it).', 'Walk in the directions the weathervane points (right, up, right, down, right).', 'The far door to the Typhoon’s Eye (W375) then appears.'],
      secrets: ['With the Yellow-Dust Mask equipped, a vent opens onto the Yellow Dust Street (W377).', 'Uncorking Bottled Thunder under the wind chime silences the voices for a moment.'],
      lore: 'Unsaid things, blowing for ever.' } });

  /* ---------------------------------------------------------------
   *  W370 — Le Verger de la grêle
   * --------------------------------------------------------------- */
  S({ id: 'W370', name: 'The Hail Orchard', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'metal', c: ['#a0a8b0'] }, backLabel: 'back to the depot', outdoor: true,
    gen: { type: 'forest', w: 56, h: 40, opts: { density: 0.14, border: true, tree: '^', grass: 'n' }, stamps: [{ at: ['center', 'center'], piece: ['.......', '.......', '.......', '.......', '.......'] }] },
    look: { floor: { p: 'grass', c: ['#5a7a50', '#4e6e46', '#6a8a5e', '#405a3a'] }, snow: { p: 'snow', c: ['#e8eef4', '#d8e0ea', '#ffffff'] } },
    tall: { '^': { look: 'tree', opt: { c: ['#4a7040', '#3a5a32', '#5a3e26', '#6a9058'], fruit: '#c84040' } } },
    style: { renderer: 'crayon', sky: ['#a0a8b8', '#d0d8e0'] }, music: 'hailorchard', amb: { type: 'rain', vol: 0.08 }, dark: 0.2, weather: { snow: true, wind: 0.4 },
    decor: [{ look: 'fruit', n: 6, opt: { f: 'apple' }, lines: ['A fallen apple, bruised on the side that faced the sky.', 'An apple with a dent in it, the exact size of a hailstone.'] },
      { look: 'crate', n: 2, lines: ['A crate of apples marked SECONDS. Every one of them has the same bruise.'] },
      { look: 'pebbles', n: 4, lines: ['Hailstones heaped at the foot of a tree, as if someone had gathered them to throw.'] }],
    place: [{ id: 'oldtree', type: 'decor', at: [27, 18], look: 'tree', lookOpt: { c: ['#3a5a30', '#2a4a24', '#4a3020', '#5a7a48'], fruit: '#e05050', seed: 7 },
        lines: ['The oldest tree in the orchard. One apple is left on it, high up, holding on.', 'Under its branches the ground is dry. Someone used to stand here when it hailed.'],
        onEffect: { E250: [{ lines: ['You uncork the thunder under the oldest tree. The sky answers it, once.', 'The last apple lets go and lands in your hands. Where it fell, the roots part over a cellar door.'] }, { set: { orchard_thunder: true } }, { secret: 'orchard_thunder' }, { sfx: 'reveal' }, { reeval: true }] } },
      { id: 'toW365', type: 'stairs', to: 'W365', at: [27, 20], look: 'stairsdown', cond: { flag: 'orchard_thunder' }, label: 'a cellar door between the roots' },
      SOUL([EN('They called it the mute girl’s tree. She was the only one who stood under it when it hailed.')])],
    npcs: [{ id: 'N1919', name: 'The Hail Boy', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#c8c8d0', '#a8a8b0', '#f0d0b0', '#3a2a1a'], mouth: 'grin' }), behavior: 'flee', fleeDist: 5, radius: 9, speed: 2.4, solid: true,
        lines: [EN('Hey. Mute girl. Say something.'), 'He throws a hailstone. It misses on purpose. The next one won’t.'] },
      { id: 'N1920', name: 'The Hail Children', look: H({ t: 'kid', body: 'uniform', c: ['#5a6a8a', '#4a5a7a', '#e0c8b0', '#1a1a1a'], eyes: 'none', mouth: 'grin', alpha: 0.8 }), behavior: 'static', solid: true, count: 3,
        lines: [{ seq: ['She looks at you and whispers something to the others. They laugh.'] }, EN('Go on, then. Talk. You can’t, can you.'), 'His pockets are full of hailstones. His hands are blue.'] },
      { id: 'N1921', name: 'The Orchard Keeper', look: H({ t: 'old', body: 'apron', c: ['#7a6a4a', '#5a4a2a', '#d8b898', '#c8c8c8'], acc: 'seeds' }), behavior: 'wander', radius: 4, speed: 0.5, solid: true,
        lines: [EN('Hail in July. Every apple bruised on the side that faced the sky.'), { seq: [EN('That boy throws because the others throw at him if he doesn’t.'), EN('Corner him and he’ll stop. He’s waiting for someone to.')] },
          EN('The oldest tree won’t drop its last apple. It’s waiting for a bigger noise than hail.')] }],
    mech: [{ type: 'corner', ent: 'N1919', flag: 'hail_boy_caught',
      winLines: ['The boy has nowhere left to run. He drops the hailstones he was holding. His hands are red with cold.', EN('…They told me to. If I don’t throw, they throw at me.'), 'He puts his hands in his pockets and walks away slowly, not throwing anything.'],
      reward: [{ secret: 'hail_boy' }, { cookie: 1 }] }],
    info: { summary: 'An apple orchard under summer hail, where children gather hailstones to throw at the girl who doesn’t speak.',
      rules: ['Corner the Hail Boy until he cannot run any further: he stops throwing (a biscuit).'],
      secrets: ['Uncorking Bottled Thunder (E250) facing the oldest tree, in the middle, opens a cellar door.', 'It leads to the Storm Nursery (W365).'],
      lore: 'Bullying, and the boy who throws so as not to be thrown at.' } });

  /* ---------------------------------------------------------------
   *  W371 — La Plaine de neige d'un hiver d'autrefois (1951)
   * --------------------------------------------------------------- */
  var SNOWFIELD = (function () {
    var g = K.grid(52, 30, ' '); g.box(0, 0, 52, 30, '^', 'n');
    g.hline(1, 50, 2, 'r');
    g.scatter('^', 'n', 0.07, 1951, [1, 4, 50, 24]);
    [[1, 27], [2, 27], [3, 27], [4, 27], [5, 27], [2, 26], [6, 26], [47, 5], [48, 4], [48, 5], [26, 10], [26, 11], [14, 20], [50, 27], [49, 27]].forEach(function (p) { g.set(p[0], p[1], 'n'); });
    return g.rows();
  })();
  S({ id: 'W371', name: 'The Snowfield of a Long-Ago Winter', depth: 4, tier: 'hard', back: 'W099', backLook: 'gate', backOpt: { c: ['#8a8a90'] }, backLabel: 'the gap in the fence, back to the schoolyard', backAt: [2, 27], outdoor: true,
    map: SNOWFIELD, look: Object.assign({}, K.LOOK.snow, { floor: { p: 'snow', c: ['#e8eef4', '#dce4ee'] }, snow: { p: 'snow', c: ['#eef2f8', '#dfe6f0', '#ffffff'] }, rail: { p: 'rails', c: ['#3a342c', '#8a8a90'] } }), tall: K.TALL.pine,
    style: { renderer: 'sepia' }, music: 'longagowinter', amb: { type: 'wind', vol: 0.09 }, dark: 0.25, weather: { snow: true, wind: 0.5 },
    doors: [{ to: 'W372', at: [48, 4], opt: { style: 'wood', c: ['#c8a878'] }, cond: { flag: 'snowtrail_done' }, label: 'a door standing alone in the snow, warm light under it' },
      { to: 'W361', at: [50, 27], opt: { style: 'metal', c: ['#e0c030'] }, label: 'a depot door, half buried in the snow' }],
    decor: [{ look: 'suitcase', n: 2, lines: ['A suitcase abandoned in the snow. Too heavy to carry south.', 'A bundle tied with a sash. Inside: rice, a spoon, a photograph.'] },
      { look: 'telepole', n: 3, lines: ['A telegraph pole along the tracks. The wires hum with messages that will never arrive.'] }],
    signs: [{ at: [6, 26], lines: [EN('Small footprints. Walk in them exactly, or the snow fills them in.')] }],
    place: [{ id: 'trstart', type: 'decor', at: [4, 27], look: 'shoe', lookOpt: { c: ['#8a3a3a'] }, solid: false, lines: ['A child’s footprints in the snow: one shoe, one sock. They lead away north-east.'] },
      { id: 'trend', type: 'decor', at: [47, 5], look: 'glint', solid: false, noInteract: true },
      { id: 'snowman', type: 'decor', at: [26, 10], look: 'snowman', lines: ['A snowman with a brown scarf, too long for it, wound three times. It is facing north.'],
        listen: [{ match: ['oppa', '오빠', 'big brother', 'brother'], lines: ['The snowman’s scarf lifts, as if someone had turned round.', KN('오빠!', 'Big brother!'), 'A child’s voice, very far away, on a platform, in 1951. Then only snow.'], do: [{ secret: 'oksun_snowman' }] }] },
      { id: 'slip2', type: 'decor', at: [14, 20], look: 'letter', lines: [slip(2, 'is', 'frozen into the snow')] },
      SOUL([KN('신발 한 짝은 렬차에 두고 왔습니다. 오빠가 가져다준다고 했습니다.', 'I left one shoe on the train. Big brother said he would bring it.')])],
    npcs: [{ id: 'N1922', name: 'A Family Walking South', look: H({ t: 'adult', body: 'coat', c: ['#4a4a3a', '#3a3a2a', '#e0c0a0', '#202020'], acc: 'bag' }), behavior: 'wander', radius: 2, speed: 0.4, solid: true, count: 3,
        lines: [KN('남쪽으로 가면 따뜻하답니다.', 'They say it is warmer in the south.'), KN('보따리 하나면 됩니다. 나머지는 다 두고 왔습니다.', 'One bundle is enough. We left everything else behind.'), KN('일없습니다. 걸을 수 있습니다.', 'It is nothing. We can walk.'),
          KN('오빠를 부르던 아이가 있었습니다. 북쪽을 보고.', 'There was a little girl calling for her big brother. Facing north.')] },
      { id: 'N1923', name: 'A Crow on the Rails', look: { t: 'crow', c: ['#1a1a1a'], h: 9 }, behavior: 'wander', radius: 6, speed: 0.8, solid: false,
        lines: ['A crow walking along the railway line, the way people walk when the trains have stopped.'] }],
    mech: [{ type: 'trail', from: 'trstart', to: 'trend', slack: 1, flag: 'snowtrail_done', lostLine: 'You stray from the footprints. The snow fills them in behind you.',
      winLines: ['The small footprints stop here. One foot in a shoe, one foot in a sock.', 'Whoever made them stood here a long time, looking north, then turned round and went on south.', 'Where she stood, someone has left a door in the snow, with a warm light under it.'],
      reward: [{ set: { snowtrail_done: true } }, { secret: 'snow_trail_1951' }] }],
    info: { summary: 'A sepia snowfield along a railway line in the winter of 1951, where families walk south with their bundles.',
      rules: ['Follow the small footprints (one shoe, one sock) without straying, onto the spot where they stop.', 'A door to the Room of the First Snow (W372) appears there.', 'Forecast slip 2 of 4 (“is”) is frozen into the snow.', 'A depot door at the south-east corner leads back to the Weather Depot (W361).'],
      secrets: ['Saying “oppa” (big brother) near the snowman with the long scarf brings back a voice from the platform.'],
      lore: 'Ok-sun, nine years old, walking south with one shoe.' } });
  link('W099', { to: 'W371', look: 'gate', lookOpt: { c: ['#8a8a90'] }, label: 'a gap in the fence, onto older snow' });

  /* ---------------------------------------------------------------
   *  W372 — La Chambre de la première neige (첫눈)
   * --------------------------------------------------------------- */
  var FIRSTSNOW = (function () { var g = K.grid(18, 13, ' '); g.box(0, 0, 18, 13, '#', '.'); g.rect(5, 6, 8, 4, ','); return g.rows(); })();
  S({ id: 'W372', name: 'The Room of the First Snow', depth: 4, tier: 'hard', back: 'W371', backLook: 'door', backOpt: { style: 'wood', c: ['#c8a878'] }, backLabel: 'back out into the old snow', backAt: [1, 6],
    map: FIRSTSNOW, look: { floor: { p: 'ondol', c: ['#c8a070', '#b89060', '#d8b080'] }, floor2: { p: 'rug', c: ['#d8c8e0', '#c0b0d0'] }, wall: { p: 'flat', c: ['#2a2420', '#201a16'], topColor: '#2a2420' }, wallface: { p: 'wallpaper', c: ['#e8e0d0', '#d0c8b8', '#a8a090'], skirt: '#6a5a48' } },
    style: { tallWalls: true }, music: 'firstsnow', amb: { type: 'clock', vol: 0.04 }, dark: 0.4,
    doors: [{ to: 'W368', at: [16, 1], look: 'window', cond: { phase: 'final' }, label: 'the window, opening onto a hot August roof' }],
    place: [{ id: 'window', type: 'decor', at: [9, 1], look: 'window', light: 2, lines: ['A window onto a Seoul street at night. The sky is heavy, the way it is before the first snow.', { if: { flag: 'firstsnow_fell' }, t: 'Outside, the first snow is settling on the parked cars. Nobody comes out to see it.' }] },
      { id: 'phone', type: 'decor', at: [4, 3], look: 'phone', lines: ['A mobile phone on the floor, face up. No messages. She checks it anyway.'] },
      { id: 'heater', type: 'decor', at: [15, 9], look: 'stove', light: 1.2, lines: ['A little paraffin heater, ticking. It smells of every winter.'] },
      { id: 'calendar', type: 'decor', at: [12, 1], look: 'calendar', lines: ['A calendar from 2007. One square circled in red, with a question mark instead of a date.'] }],
    signs: [{ at: [3, 10], lines: [EN('Late, very late in the night, the other window opens onto summer.')] }],
    npcs: [{ id: 'N1925', name: 'A Young Woman Waiting', look: H({ t: 'adult', hairStyle: 'long', body: 'coat', c: ['#7a5a6a', '#5a3a4a', '#f0d0b0', '#1a1010'], acc: 'phone' }), behavior: 'static', solid: true, at: [13, 4],
      lines: [KS('첫눈 오면 만나자고 했잖아.', 'You said we’d meet when the first snow came.'), KS('전화는 안 와. 그래도 창문은 볼 수 있잖아.', 'The phone doesn’t ring. But I can still watch the window.'),
        KS('첫눈은 늦게 와. 기다리는 사람한테는 원래 늦게 와.', 'The first snow comes late. It always comes late for whoever is waiting.'),
        KS('창문 앞에 가만히 서 있으면, 결국엔 와.', 'If you stand still at the window, it comes in the end.'), { if: { flag: 'firstsnow_fell' }, t: '왔네. 아무도 안 왔는데, 눈은 왔네.', lang: 'ko-s', tr: 'It came. Nobody came, but the snow did.' }] }],
    mech: [{ type: 'standStill', zone: [8, 2, 10, 2], secs: 30, give: 'E252', breakLine: 'You move. Outside, the sky holds its breath again.',
        winLines: ['You stand at the window and wait, the way she waits. Your breath fogs the glass, clears, fogs.', 'Then the first one falls. Then all of them.', { t: '…첫눈이다.', lang: 'ko-s', tr: '…It’s the first snow.', who: 'A Young Woman Waiting' }, 'One flake lands on your sleeve and does not melt. It stays, like a promise somebody else forgot.'],
        reward: [{ set: { firstsnow_fell: true } }] },
      { type: 'weatherWhen', cond: { flag: 'firstsnow_fell' }, weather: { snow: true } }],
    info: { summary: 'A Seoul room in 2007: a young woman waits for the first snow, and for someone who promised to come with it.',
      rules: ['Stand still at the window for thirty seconds: the first snow falls and gives the First Snowflake (E252).'],
      secrets: ['In the last stretch of the dream, a second window opens onto the Heatwave Rooftop (W368).'],
      lore: '첫눈 오면 만나자: let’s meet at the first snow. A promise kept only by the snow.' } });

  /* ---------------------------------------------------------------
   *  W373 — L'Escalier arc-en-ciel
   * --------------------------------------------------------------- */
  var PADS = [[30, 28, ','], [8, 20, ':'], [32, 13, '`'], [9, 8, String.fromCharCode(39)], [21, 22, '['], [27, 6, ']'], [14, 14, 'i']];
  var RAINBOW = (function () {
    var g = K.grid(40, 34, ' '); g.ellipse(20, 17, 18, 15, '.');
    PADS.forEach(function (p) { g.rect(p[0] - 1, p[1] - 1, 3, 3, p[2]); });
    g.box(0, 14, 5, 6, '#', '.'); g.set(4, 16, '?');
    return g.rows();
  })();
  var PLATES = {}; PADS.forEach(function (p, i) { PLATES[p[0] + ',' + p[1]] = i; });
  S({ id: 'W373', name: 'The Rainbow Staircase', depth: 4, tier: 'hard', back: 'W177', backLook: 'cloudpuff', backLabel: 'a cloud back down to the sky below', backAt: [20, 29], outdoor: true,
    map: RAINBOW,
    look: { floor: { p: 'cloud', c: ['#ffffff', '#e8eef8'] }, floor2: { p: 'flat', c: ['#e04848', '#d03c3c'] }, floor3: { p: 'flat', c: ['#f09040', '#e08030'] }, floor4: { p: 'flat', c: ['#f0e050', '#e0d040'] },
      floor5: { p: 'flat', c: ['#60c060', '#50b050'] }, mat: { p: 'flat', c: ['#4880e0', '#3c70d0'] }, mat2: { p: 'flat', c: ['#5848b0', '#4c3ca0'] }, light: { p: 'flat', c: ['#a060d0', '#9050c0'] },
      wall: { p: 'cloud', c: ['#e8eef8', '#d0d8e8'] }, secret: { p: 'cloud', c: ['#e8eef8', '#d0d8e8'] } },
    style: { sky: ['#90c0f0', '#f0f8ff'], cliffH: 0.8, cliff: '#c8d8f0' }, music: 'rainbowstair', amb: { type: 'wind', vol: 0.05 }, weather: { motes: true },
    doors: [{ to: 'W374', at: [20, 3], look: 'stairs', cond: { flag: 'rainbow_climbed' }, label: 'the top of the rainbow, where it goes dark' },
      { to: 'W379', at: [5, 24], look: 'stairsdown', label: 'the rainbow’s foot, on a wet kerb' }],
    signs: [{ at: [24, 30], lines: [EN('Red at the bottom, violet at the top. A rainbow only holds you if you climb it in order.')] },
      { at: [7, 17], lines: [EN('Every rainbow ends in a pot. This one ends behind a wall that is only cloud.')] }],
    place: [{ id: 'pot', type: 'decor', at: [2, 17], look: 'pot', lookOpt: { c: ['#c8a040'] }, lines: ['At the end of the rainbow, a pot. Inside, no gold:', 'a bus ticket from 2020, one way, and a note: “back tomorrow — J.”'], use: [{ secret: 'rainbow_pot' }] },
      SOUL([EN('A rainbow is what the rain says when it is sorry.')])]
      .concat(marks(PADS.map(function (p) { return [p[0], p[1]]; }), 'glint', null, { c: ['rgba(255,255,255,0.7)'] })),
    npcs: [{ id: 'N1926', name: 'A Bird of Seven Colours', look: { t: 'bird', c: ['#e06060', 0, 0, '#f0d040'], h: 9 }, behavior: 'fly', radius: 8, speed: 1, solid: false,
        lines: ['It has a feather of every colour but one. It is not telling which.'] },
      { id: 'N1927', name: 'The Rainbow Painter', look: H({ t: 'old', body: 'apron', c: ['#e8e0d0', '#c8c0b0', '#e0c0a0', '#c8c8c8'], acc: 'needle' }), behavior: 'static', solid: true, at: [15, 27],
        lines: [EN('Every rainbow is a promise that the rain is over. Somebody has to keep repainting them.'), EN('People forget the order. I don’t blame them. It has been raining a long time.'),
          EN('Step on the middle of each colour. Wrong order and the rainbow forgets you were ever on it.')] }],
    mech: [{ type: 'stepOrder', plates: PLATES, count: 7, flag: 'rainbow_climbed', color: 'rgba(255,255,255,0.9)',
      winLines: ['Red, orange, yellow, green, blue, indigo, violet. The rainbow takes your weight all the way up.', 'At the top, where the colours run out, a staircase goes on into a sky that is going dark at noon.'],
      reward: [{ set: { rainbow_climbed: true } }] }],
    extra: { noFurnish: true },
    info: { summary: 'Seven coloured steps floating on a cloud, under a washed sky: a rainbow you climb.',
      rules: ['Step on the centre of each coloured step in rainbow order (red, orange, yellow, green, blue, indigo, violet).', 'The stairs at the top then open onto the Eclipse Plaza (W374).', 'The rainbow’s foot leads down to the Bus Stop in the Rain (W379).'],
      secrets: ['On the west edge, a wall of cloud only pretends (Smoked Glass): behind it, the pot at the rainbow’s end.'],
      lore: 'The promise after the rain: he will come back tomorrow.' } });
  link('W177', { to: 'W373', look: 'cloudpuff', label: 'a rainbow going down into the sky' });

  /* ---------------------------------------------------------------
   *  W374 — La Place de l'éclipse
   * --------------------------------------------------------------- */
  var PLAZA = (function () {
    var g = K.grid(44, 32, ' '); g.box(0, 0, 44, 32, '#', '.');
    g.ellipse(22, 16, 9, 7, ','); g.hline(12, 31, 4, '%');
    return g.rows();
  })();
  var LANTERNS = [[6, 6], [37, 6], [4, 16], [39, 16], [6, 27], [37, 27]];
  S({ id: 'W374', name: 'The Eclipse Plaza', depth: 4, tier: 'hard', back: 'W373', backLook: 'stairsdown', backLabel: 'down the rainbow', backAt: [22, 30], outdoor: true,
    map: PLAZA, look: Object.assign({}, K.LOOK.nk, { floor2: { p: 'marble', c: ['#3a3640', '#2a2630'] }, wall2: { p: 'stone', c: ['#8a7a68', '#6a5a48', '#9a8a78'] } }),
    style: { stars: true, sky: ['#05040a', '#1a1420'], filter: 'saturate(0.7)' }, music: 'eclipse', amb: { type: 'loudspeaker', vol: 0.05 }, dark: 0.86,
    doors: [{ to: 'W378', at: [22, 2], opt: { style: 'metal', c: ['#8a1a24'] }, label: 'the door of the broadcast tower' },
      { to: 'W376', at: [42, 30], opt: { style: 'wood', c: ['#1a1a1a'] }, cond: { equipped: 'E254' }, label: 'a door drawn in shadow, visible only through dark glass' }],
    decor: [{ look: 'flagpole', n: 2, lines: ['A flagpole with no flag. The flag is resting too.'] },
      { look: 'loudspeaker', n: 2, lines: ['A loudspeaker on a pole, aimed at the sky so the sun can hear.'] }],
    place: LANTERNS.map(function (p, i) { return { id: 'l' + (i + 1), type: 'decor', at: p, look: 'lantern', light: 0.7, lines: ['A paper lantern on a post, barely glowing.'] }; })
      .concat([{ id: 'sunshadow', type: 'decor', at: [22, 16], look: 'void', solid: false, lines: ['The shadow of the sun, lying on the square like a dropped coat. It is cold to stand in.'] },
        { id: 'notice', type: 'decor', at: [22, 5], look: 'banner', lookOpt: { text: '맑음' }, lines: ['The plaza notice, in big letters: 오늘의 날씨 — 맑음 (Today’s weather: clear). The sky above it is black.'] },
        { id: 'slip4', type: 'decor', at: [25, 5], look: 'letter', lines: [slip(4, 'fine', 'pasted under the notice like a sticker')] },
        SOUL([KN('해를 본 사람은 없었다. 보지 말라고 했으니까.', 'Nobody saw the sun. We had been told not to look.')])]),
    signs: [{ at: [40, 27], lines: [EN('In the corner where the shadow is thickest, someone drew a door. Dark things need dark glass.')] }],
    npcs: [{ id: 'N1928', name: 'The Plaza Loudspeaker', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 14,
        ambientLines: [KN('태양은 꺼지지 않았습니다. 잠시 쉬고 계십니다.', 'The sun has not gone out. It is resting for a moment.'), KN('하늘을 보지 마십시오. 보지 않아도 맑습니다.', 'Do not look at the sky. It is clear even if you do not look.'), KN('오늘의 날씨는 맑음. 래일의 날씨도 맑음.', 'Today’s weather: clear. Tomorrow’s weather: also clear.')] },
      { id: 'N1929', name: 'A Citizen Looking at His Shoes', look: H({ t: 'adult', body: 'suit', c: ['#3a3a40', '#2a2a30', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'static', solid: true, count: 4,
        lines: [KN('일없습니다. 아무 일도 없습니다.', 'It is nothing. Nothing is happening.'), 'He keeps his eyes on his shoes. Looking up is not forbidden. It is just not done.'] },
      { id: 'N1930', name: 'A Boy with a Candle', look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#f0f0f0', '#d0d0d0', '#f0d0b0', '#1a1010'], acc: 'candle' }), behavior: 'static', solid: true, at: [10, 20], light: 1.2,
        lines: [KN('할머니가 그랬어요. 해가 쉬면 등불을 다 켜야 한대요. 여섯 개 다요.', 'Grandma said when the sun rests you have to light all the lanterns. All six.'), KN('빨리 안 켜면 꺼져요. 하나씩 꺼져요.', 'If you’re not quick, they go out. One by one.')] }],
    mech: [{ type: 'lampsAll', lamps: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], time: 32, light: 2.6, give: 'E254', onLine: 'It is already burning.',
      winLines: ['All six lanterns burn at once.', 'In their ring of light, the boy holds out a pane of glass he has blackened over his candle.', KN('이걸로 보면 눈이 안 다쳐요. 해가 쉬는 걸 봐도 돼요.', 'Look through this and your eyes won’t hurt. You’re allowed to watch the sun rest.')] }],
    info: { summary: 'A parade ground at noon under a total eclipse; the loudspeakers insist that the sun is only resting.',
      rules: ['Light all six lanterns before the first ones go out (about thirty seconds each).', 'This gives Smoked Glass (E254).', 'Forecast slip 4 of 4 (“fine”) is pasted under the plaza notice.', 'The broadcast tower leads to the Forecast Studio (W378).'],
      secrets: ['With Smoked Glass equipped, a door drawn in shadow appears in the south-east corner (Fog Market, W376).'],
      lore: 'Everything is fine, even when the sun goes out.' } });

  /* ---------------------------------------------------------------
   *  W375 — L'Œil du typhon (태풍의 눈)
   * --------------------------------------------------------------- */
  var EYE = (function () {
    var g = K.grid(41, 41, ' '); g.ellipse(20, 20, 19, 19, '.'); g.ellipse(20, 20, 5, 5, ',');
    g.scatter('o', '.', 0.025, 1959, [1, 1, 39, 39]);
    [[20, 37], [20, 36], [20, 3], [20, 4], [20, 17], [20, 16]].forEach(function (p) { g.set(p[0], p[1], p[1] < 30 && p[1] > 10 ? ',' : '.'); });
    return g.rows();
  })();
  S({ id: 'W375', name: 'The Typhoon’s Eye', depth: 4, tier: 'hard', back: 'W365', backLook: 'door', backOpt: { style: 'wood', c: ['#8a90a8'] }, backLabel: 'the door marked GROWN, back to the nursery', backAt: [20, 37], outdoor: true,
    map: EYE, look: { floor: { p: 'waves', c: ['#3a4a5a', '#2a3a4a', '#4a5a6a'] }, floor2: { p: 'flat', c: ['#c8d0d8', '#b8c0c8'] }, rock: { p: 'rock', c: ['#5a6068', '#4a5058', '#6a7078'] } },
    style: { renderer: 'psychedelic', sky: ['#101820', '#405060'], cliffH: 1, cliff: '#1a2430' }, music: 'typhooneye', amb: { type: 'wind', vol: 0.2 }, dark: 0.45, weather: { rain: true, wind: 1.2 },
    doors: [{ to: 'W361', at: [20, 20], opt: { style: 'wood', c: ['#c8ccd4'] }, cond: { tempGte: { typhoon_laps: 12 } }, label: 'the calm in the middle: a cupboard door, from the inside' },
      { to: 'W369', at: [20, 3], opt: { style: 'wood', c: ['#8a8a7a'] }, cond: { flag: 'typhoon_named' }, label: 'the way the wind goes out' }],
    signs: [{ at: [24, 22], lines: [EN('Walk round the middle, three times. That is how eyes open.')] }],
    place: [SOUL([EN('A storm is given a name so that you can say it afterwards, when it is over.')])],
    npcs: [{ id: 'N1931', name: 'The Typhoon', look: H({ t: 'tall', head: 'hollow', body: 'robe', c: ['#6a7080', '#5a6070', '#a8b0c0', '#2a3040'], alpha: 0.75, eyes: 'closed' }), behavior: 'static', solid: true, at: [20, 17], hearDist: 6,
        lines: [EN('In here it is quiet. Everything I break is out there.'), EN('They gave me a name so they could remember me. Nobody says it.'), EN('I was the biggest in the nursery. Nobody came when I cried, so I cried harder.')],
        hears: [{ match: ['미리내', 'mirinae', 'milky way'], lines: ['The Typhoon goes very still.', EN('…You said it. My name. It means the Milky Way.'), 'For a moment the wind outside drops, and very far away you can hear someone humming a lullaby.', EN('Thank you. I can go out the quiet way now. So can you.')], do: [{ set: { typhoon_named: true } }, { secret: 'typhoon_named' }] }] },
      { id: 'N1932', name: 'Things the Wind Took', look: { t: 'moth', c: ['#d0d8e0'], h: 9 }, behavior: 'orbit', center: [20, 20], radius: 12, speed: 0.6, solid: false, count: 5,
        lines: ['An umbrella, inside out, going round and round.', 'A school hat, going round for the hundredth time.', 'A sheet of homework, marked in red, circling.', 'A little shoe. The left one.'] }],
    mech: [{ type: 'laps', center: [20, 20], key: 'typhoon_laps' }, { type: 'wind', push: true, strength: 1.2, dir: 'right' }],
    info: { summary: 'The calm centre of a typhoon, ringed by a wall of rain; everything the storm took goes round and round.',
      rules: ['Walk three full laps around the centre: a cupboard door appears in the middle.', 'It leads back to the Weather Depot (W361).', 'The wind pushes her when she stands still.'],
      secrets: ['Say the typhoon’s name, 미리내 (Mirinae), written on the biggest cot in the Storm Nursery.', 'The way out towards the Wind Tunnel (W369) opens.'],
      lore: 'The child who cried harder because nobody came.' } });

  /* ---------------------------------------------------------------
   *  W376 — Le Marché du brouillard (장마당)
   * --------------------------------------------------------------- */
  var FOGMARKET = (function () {
    var g = K.grid(50, 36, ' '); g.box(0, 0, 50, 36, '#', '.');
    [6, 14, 22].forEach(function (y) { [6, 15, 24, 33, 42].forEach(function (x) { if (x < 46) g.rect(x, y, 4, 1, 'u'); }); });
    g.text(1, 26, ['xxxxxxxxxx.x', 'x.....x....x', 'x.xxx.x.xx.x', 'x.x...x..x.x', 'x.x.xxxx.x.x', 'x........x.x', 'xxx.x.xxxx.x', 'x...x......x', 'xxxxxxxxxxxx']);
    return g.rows();
  })();
  S({ id: 'W376', name: 'The Fog Market', depth: 4, tier: 'hard', back: 'W158', backLook: 'lantern', backLabel: 'back towards the white lighthouse', backAt: [25, 34],
    map: FOGMARKET, look: { floor: { p: 'dirt', c: ['#6a6a60', '#5a5a52', '#7a7a70'] }, counter: { p: 'wood', c: ['#6a5a4a', '#5a4a3a', '#7a6a5a'] }, wall: { p: 'concrete', c: ['#9a9ca0', '#8a8c90', '#6a6c70'] }, invis: { p: 'dirt', c: ['#6a6a60', '#5a5a52', '#7a7a70'] } },
    style: { darkColor: 'rgb(196,200,204)' }, music: null, amb: { type: 'crowd', vol: 0.03 }, dark: 0.82, playerLight: 2.4,
    doors: [{ to: 'W377', at: [1, 12], opt: { style: 'wood', c: ['#c8a860'] }, label: 'the road west, where the yellow wind comes from' },
      { to: 'W378', at: [48, 4], opt: { style: 'metal', c: ['#8a1a24'] }, label: 'a door with a red broadcast lamp over it' },
      { to: 'W374', at: [2, 33], opt: { style: 'wood', c: ['#1a1a1a'] }, label: 'a door under the plaza, where the shadow is thickest' }],
    decor: [{ look: 'stall2', n: 5, opt: { c: ['#8a8a8a'], goods: ['#c8b060', '#e0e0d0', '#8a6a4a'] }, lines: ['A stall with nothing on it but a cloth. Things appear on the cloth when nobody official is looking.', 'Corn, a few batteries, one cabbage, a pair of shoes in a plastic bag.', 'A stall selling single shoes. Only left ones.'] },
      { look: 'lantern', n: 3, light: 1.6, lines: ['A lamp hung from a pole. In the fog it is a yellow coin with nothing around it.'] },
      { look: 'barrel', n: 3, lines: ['A drum of something that smells like diesel and sugar.'] }],
    signs: [{ at: [14, 25], lines: [EN('The fog hides walls too. Feel your way into the corner nobody looks at.')] }],
    place: [{ id: 'fogstall', type: 'decor', at: [38, 29], look: 'stall2', lookOpt: { c: ['#c8ccd0'], goods: ['#e8ecf0', '#d8dce0', '#c8ccd0'] }, light: 1.2, lines: ['A stall selling fog, in paper bags, folded at the top. Each bag is a little heavier than nothing.'] },
      { id: 'notmarket', type: 'decor', at: [10, 33], look: 'stall2', lookOpt: { c: ['#3a3a40'], goods: ['#40e0ff', '#f0f0f0'] }, light: 1, lines: ['The stall that does not exist. Under the cloth: memory sticks full of southern dramas.', 'And a radio, tuned to a station that is not allowed.'], use: [{ secret: 'fog_hidden_stall' }] },
      SOUL([KN('장마당은 없었다. 그런데 거기서 쌀을 샀다.', 'There was no market. But that is where we bought rice.')])],
    npcs: [{ id: 'N1933', name: 'The Fog Seller', look: H({ t: 'old', head: 'hood', body: 'robe', c: ['#8a8c90', '#6a6c70', '#d8c0a0', '#c8c8c8'] }), behavior: 'static', solid: true, at: [38, 30],
        lines: [KN('안개 사십시오. 한 봉지에 강냉이 두 개.', 'Buy some fog. Two ears of corn a bag.'), KN('여기는 시장이 아닙니다. 그냥 사람들이 서 있는 겁니다.', 'This is not a market. People are just standing here.'), KN('보이는 걸 보인다고 말하면, 안개를 드리지요.', 'Say that what you see is there, and I will give you some fog.')] },
      { id: 'N1934', name: 'The Guard Who Sees No Fog', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#1a1a1a'] }), behavior: 'patrol', path: [[29, 18], [40, 18], [40, 26], [29, 26]], speed: 0.5, solid: true,
        lines: [KN('안개는 없습니다. 오늘은 맑습니다.', 'There is no fog. Today is clear.'), KN('시장도 없습니다. 아무것도 없습니다.', 'There is no market either. There is nothing here.'), KN('동무, 왜 눈을 찡그립니까? 맑은 날입니다.', 'Comrade, why are you squinting? It is a clear day.')] },
      { id: 'N1935', name: 'A Shape in the Fog', look: ghost('rgba(150,154,160,0.55)', 21), behavior: 'wander', radius: 6, speed: 0.6, solid: false, count: 4,
        lines: ['A shape carrying a sack of rice on its back. It nods and is gone.', 'A shape counting money without looking at it.', 'A shape that says nothing, very politely.'] }],
    mech: [{ type: 'sayTo', mark: 'fogstall', dist: 3, give: 'E251', words: ['fog', 'foggy', 'mist', '안개', 'there is fog'],
      winLines: ['You say it: there is fog. The words make a little cloud in front of your mouth.', KN('…그렇지요. 안개가 있지요. 처음으로 누가 말해 주네.', '…That’s right. There is fog. The first time anyone has said so.'), KN('가져가시오. 숨고 싶을 때 쓰시오.', 'Take it. Use it when you want to hide.'), 'She folds a bag of fog into your pocket.'] }],
    info: { summary: 'A grey market in thick fog where everything is sold and nothing officially exists, not even the fog.',
      rules: ['Say “fog” (or 안개) at the fog seller’s stall: she gives Pocket Fog (E251).', 'Roads lead west to the Yellow Dust Street (W377) and to the Forecast Studio (W378).'],
      secrets: ['In the south-west corner, invisible walls in the fog make a maze.', 'At its end: the stall that does not exist, and a door up to the Eclipse Plaza (W374).'],
      lore: 'The jangmadang: the market that is not there, in the weather that is not there.' } });
  link('W158', { to: 'W376', look: 'lantern', label: 'a stall lamp, far off in the white' });

  /* ---------------------------------------------------------------
   *  W377 — La Rue de la poussière jaune (황사)
   * --------------------------------------------------------------- */
  S({ id: 'W377', name: 'The Yellow Dust Street', depth: 4, tier: 'hard', back: 'W376', backLook: 'door', backOpt: { style: 'wood', c: ['#c8a860'] }, backLabel: 'back east into the fog', outdoor: true,
    gen: { type: 'city', w: 56, h: 40, opts: { block: 6, road: ',', side: '.', building: '#', decor: '^', decorRate: 0.03 } },
    look: Object.assign({}, K.LOOK.street, { floor: { p: 'tile', c: ['#b8a888', '#a09070'] }, floor2: { p: 'asphalt', c: ['#5a5040'] } }), tall: K.TALL.city,
    style: { sky: ['#c8a860', '#e8d8a0'], filter: 'sepia(0.5) saturate(1.4) hue-rotate(-12deg)', darkColor: 'rgb(150,124,70)' }, music: 'yellowdust', amb: { type: 'city', vol: 0.05 }, dark: 0.5, playerLight: 3, weather: { dust: true, wind: 0.5 },
    doors: [{ to: 'W369', look: 'hatch', label: 'a ventilation shaft the dust blows out of' },
      { to: 'W370', look: 'gate', opt: { c: ['#8a8a90'] }, cond: { fn: sky('snow') }, label: 'a school gate, as the snow brings the dust down' }],
    decor: [{ look: 'newsstand', n: 2, lines: ['A newsstand. Front page: YELLOW DUST WARNING — STAY INDOORS. Underneath: OVERTIME UP 12%.'] },
      { look: 'vending', n: 2, lines: ['A vending machine selling masks, bottled water and canned coffee. The masks are sold out.'] },
      { look: 'bench', n: 2, lines: ['A bench under a thin coat of yellow. Someone has written a name in the dust with a finger.'] }],
    place: [{ id: 'airboard', type: 'decor', at: 'random', look: 'screen', lookOpt: { c: ['#a04030'] }, light: 1.5, lines: ['An air-quality board.'] },
      SOUL([KS('황사 심하대. 마스크 꼭 써. —엄마', 'Bad yellow dust today. Wear your mask. —Mum')])],
    npcs: [{ id: 'N1936', name: 'The Mask Seller', look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#d8d0b8', '#b8b098', '#e0c0a0', '#1a1010'] }), behavior: 'static', solid: true,
        lines: [KS('KF94 있어요. 애들 건 다 팔렸어요.', 'I’ve got KF94s. The children’s sizes are all sold out.'), KS('황사 경보래요. 학교도 일찍 끝났대요.', 'It’s a yellow-dust warning. They say school finished early.'),
          KS('저 전광판, 가끔 거짓말 안 할 때가 있어요. 그때 눌러 봐요.', 'That board sometimes stops lying. Press it then.'), { if: { effect: 'E253' }, t: '잘 어울리네. 숨 천천히 쉬어요.', lang: 'ko-s', tr: 'It suits you. Breathe slowly.' }] },
      { id: 'N1937', name: 'A Child in a Mask', look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#3a5a8a', '#2a4a7a', '#f0f0f0', '#1a1010'], mouth: 'none' }), behavior: 'wander', radius: 4, speed: 0.9, solid: true, count: 3,
        lines: [KS('엄마가 데리러 온대.', 'Mum’s coming to get me.'), KS('너는? 너네 엄마는?', 'What about you? Where’s your mum?'), 'A child in a mask. Only the eyes are left to tell who it is.'] },
      { id: 'N1938', name: 'An Old Man Without a Mask', look: H({ t: 'old', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#e0c0a0', '#e0e0e0'], acc: 'cane' }), behavior: 'static', solid: true,
        lines: [KS('우리 땐 마스크 같은 거 없었어.', 'In my day there was no such thing as a mask.'), KS('옛날엔 눈 오면 먼지가 다 가라앉았지. 학교 앞이 하얘졌어.', 'In the old days, when it snowed, all the dust settled. The street by the school went white.')] }],
    mech: [{ type: 'cycleFrames', mark: 'airboard', every: 1.3, good: 3, give: 'E253',
      frames: ['The board says 매우 나쁨 (very bad). The number is red and climbing.', 'The board says 나쁨 (bad). Orange.', 'The board says 보통 (moderate). The yellow outside disagrees.', 'The board says 좋음 (good), in blue — and for one second it is true.', 'The board says 점검 중 (under maintenance).'],
      winLines: ['You touch the board the very second it says “good”.', 'For that second the dust stops, and the street is a street again.', 'A shutter rattles up. The mask seller leans out and presses a mask into your hand.', KS('써요. 오늘은 진짜 안 좋아요.', 'Put it on. Today it really is bad.')] }],
    info: { summary: 'A Seoul street in spring under a yellow-dust warning: everyone masked, the sky the colour of old paper.',
      rules: ['The air-quality board cycles through its readings; touch it when it says 좋음 (good).', 'This gives the Yellow-Dust Mask (E253).'],
      secrets: ['If it snows here (First Snowflake turned to snow), the dust settles and a school gate appears.', 'It leads to the Hail Orchard (W370).'],
      lore: 'Spring days when children waited at school to be fetched, with the dust coming over from the west.' } });

  /* ---------------------------------------------------------------
   *  W378 — Le Studio des prévisions
   * --------------------------------------------------------------- */
  var STUDIO = (function () { var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, '#', '.'); g.rect(8, 6, 14, 8, ','); return g.rows(); })();
  S({ id: 'W378', name: 'The Forecast Studio', depth: 4, tier: 'hard', back: 'W374', backLook: 'door', backOpt: { style: 'metal', c: ['#8a1a24'] }, backLabel: 'back down to the plaza', backAt: [1, 10],
    map: STUDIO, look: Object.assign({}, K.LOOK.nk, { floor: { p: 'checker', c: ['#3a3a40', '#2a2a30'] }, floor2: { p: 'carpet', c: ['#2a4a8a', '#1a3a7a'] } }),
    style: { tallWalls: true }, music: 'forecaststudio', amb: { type: 'hum', vol: 0.06 }, dark: 0.35,
    doors: [{ to: 'W376', at: [28, 10], opt: { style: 'metal', c: ['#5a5a6a'] }, label: 'a door marked OUTSIDE BROADCAST' },
      { to: 'W369', at: [15, 18], opt: { style: 'wood', c: ['#3a3a40'] }, cond: { equipped: 'E251' }, label: 'a door in the back wall, where the camera never looks' }],
    decor: [{ look: 'spotlight', n: 3, light: 2.2, lines: ['A studio light. It is warmer than the sun has been all day.'] },
      { look: 'monitor', n: 2, lines: ['A monitor showing the broadcast: a map of the country, entirely sunny. Not a single cloud has been drawn.'] }],
    place: [{ id: 'map', type: 'decor', at: [15, 1], look: 'screen', lookOpt: { c: ['#3a7ac0'] }, lines: ['The weather map. Painted suns over every city. In one corner, a small cloud has been painted over in blue.'] },
      { id: 'newsdesk', type: 'decor', at: [15, 9], look: 'desk', lines: ['The presenter’s desk.'] },
      { id: 'camera', type: 'decor', at: [15, 15], look: 'telescope', lines: ['A studio camera on a tripod, its red light on. It has only ever pointed one way.'] },
      SOUL([EN('Behind the camera there is always weather nobody films.')])],
    npcs: [{ id: 'N1939', name: 'The Weather Presenter', look: H({ t: 'adult', hairStyle: 'bun', body: 'suit', c: ['#8a1a24', '#6a1018', '#f0d0b0', '#1a1010'], mouth: 'smile' }), behavior: 'static', solid: true, at: [15, 8],
        lines: [KN('오늘도 전국이 맑겠습니다.', 'Today again, clear skies across the whole country.'), KN('구름은 그리지 않습니다. 지도에 구름이 있으면 사람들이 걱정합니다.', 'We do not draw clouds. If there are clouds on the map, people worry.'), KN('질문이 있으면 책상 앞으로 오십시오. 생방송입니다.', 'If you have questions, come to the desk. We are live.')] },
      { id: 'N1940', name: 'The Cameraman Without a Face', look: H({ t: 'tall', head: 'box', body: 'coat', c: ['#3a3a40', '#2a2a30', '#8a8a90', '#1a1a1a'] }), behavior: 'static', solid: true, at: [17, 16],
        lines: ['He films the presenter and nothing else. He has never once turned the camera round.', 'He never films the back wall. Not even by accident. If he could not see you, you could go there.'] }],
    mech: [{ type: 'quiz', mark: 'newsdesk', flag: 'studio_quiz',
      intro: ['The red light comes on. The presenter turns to you without losing her smile. You are on air.'],
      questions: [{ q: 'She points her stick at the map. For the viewers at home: tomorrow’s weather?', choices: ['Clear.', 'Rain.', 'Nobody knows.'], right: 0 },
        { q: 'And at the market, this morning: was there fog?', choices: ['Yes, a lot.', 'There was no fog.', 'There is no market.'], right: 2 },
        { q: 'And at noon, when the sky went black over the plaza?', choices: ['The sun went out.', 'The sun was resting.', 'It was an eclipse.'], right: 1 }],
      failLine: 'The presenter’s smile stays exactly where it is. The red light goes off, then on again. Take two.',
      winLines: ['Three correct answers. The presenter’s smile loosens a little, the way a held breath does.', KN('완벽합니다. 동무는 멀리 가겠습니다.', 'Perfect. You will go far, comrade.'), 'The red light goes off. Off air, very quietly, she leans across the desk:', KN('…래일은 비가 옵니다. 우산을 챙기십시오.', '…Tomorrow it will rain. Take an umbrella.')],
      reward: [{ set: { studio_quiz: true } }, { secret: 'studio_true_forecast' }, { cookie: 1 }] }],
    info: { summary: 'A television studio where the weather map has no clouds and the forecast is always clear.',
      rules: ['At the desk, answer the three questions the official way: clear; there is no market; the sun was resting.', 'Off air, she gives the true forecast (a biscuit).', 'The official answers are heard in the Fog Market and on the Eclipse Plaza.'],
      secrets: ['With Pocket Fog equipped the camera cannot see her: a door in the back wall leads to the Wind Tunnel (W369).'],
      lore: 'The forecast that is never allowed to be wrong.' } });

  /* ---------------------------------------------------------------
   *  W379 — L'Arrêt de bus sous la pluie (2020)
   * --------------------------------------------------------------- */
  var BUSSTOP = (function () { var g = K.grid(46, 14, ' '); g.box(0, 0, 46, 14, '#', '.'); g.rect(1, 5, 44, 4, ','); g.hline(2, 43, 7, ':'); return g.rows(); })();
  S({ id: 'W379', name: 'The Bus Stop in the Rain', depth: 4, tier: 'hard', back: 'W363', backLook: 'puddle', backLabel: 'the puddle you came out of', backAt: [2, 11], outdoor: true,
    map: BUSSTOP, look: { floor: { p: 'tile', c: ['#6a6a70', '#5a5a60'] }, floor2: { p: 'asphalt', c: ['#2a2a32'] }, floor3: { p: 'hstripes', c: ['#2a2a32', '#c8c8c0'] }, wall: { p: 'brick', c: ['#4a3a38', '#3a2a28', '#2a1a18'] } },
    style: { sky: ['#0a0c18', '#202838'] }, music: 'busstoprain', amb: { type: 'rain', vol: 0.12 }, dark: 0.55,
    doors: [{ to: 'W373', at: [30, 11], look: 'cloudpuff', cond: { flag: 'busstop_knock' }, label: 'a rainbow coming down to the kerb like a staircase' },
      { to: 'W361', at: [44, 4], look: 'door', opt: { style: 'glass', c: ['#e8c040'] }, cond: { realHour: [21, 21] }, label: 'the 21:34 bus, its sign lit: DEPOT' }],
    decor: [{ look: 'streetlamp', n: 4, light: 2.4, lines: ['A streetlamp. The rain falls through its light and nowhere else.', 'A streetlamp with a lost-cat poster. The cat came back. Nobody took the poster down.'] },
      { look: 'puddle', n: 4, solid: false, lines: ['A puddle. In it, the lamp, and under the lamp, a room upside down.'] }],
    place: [{ id: 'shelter', type: 'decor', at: [22, 2], look: 'bench', lines: ['The bench of the bus shelter. One end is dry. Someone sat there for a long time with a suitcase.'] },
      { id: 'timetable', type: 'decor', at: [27, 3], look: 'poleclock', lines: ['The timetable. One bus left tonight: 21:34. Under it, in marker: “it only comes at the real time”.'] },
      SOUL([EN('Knock knock. Who’s there. And then the bus.')])],
    npcs: [{ id: 'N1941', name: 'A Man with a Suitcase', look: H({ t: 'adult', body: 'coat', c: ['#6a6a7a', '#4a4a5a', '#d0c0b0', '#1a1a1a'], alpha: 0.5, eyes: 'none', acc: 'suitcase' }), behavior: 'static', solid: true, at: [24, 3], hearDist: 5,
        lines: [EN('Knock knock.'), 'He waits, smiling, for the answer. He has been waiting for it for six years.'],
        hears: [{ match: ['daddy who', 'dad who', '아빠 누구'], lines: ['He opens his mouth for the end of the joke.', 'A bus goes by without stopping. The end of the joke goes with it.', 'Nobody ever heard how it ended. Not even him.'], do: [{ secret: 'joke_no_end' }] }] },
      { id: 'N1942', name: 'The Child in the Yellow Raincoat', look: H({ t: 'kid', hairStyle: 'short', body: 'coat', c: ['#f0c830', '#d0a820', '#f0d8c0', '#2a1a10'] }), behavior: 'static', solid: true, at: [20, 10],
        lines: [EN('He said he’d tell me the end tomorrow.'), EN('Tomorrow is a long way. I’m keeping my coat on.'), { if: { flag: 'busstop_knock' }, t: 'Look. A rainbow. That means it’s over, doesn’t it? The rain.', lang: 'en' }] }],
    mech: [{ type: 'sayTo', ent: 'N1941', dist: 4, flag: 'busstop_knock', words: ['who s there', 'whos there', 'who is there', 'who’s there', '누구세요', '누구야'],
        winLines: [{ t: 'Daddy.', lang: 'en', who: 'A Man with a Suitcase' }, 'He smiles, as if the rest of the joke were obvious.', 'Then the rain stops, all at once, the way it stops in films.', 'Across the road, a rainbow comes down to the kerb like a staircase.'],
        reward: [{ set: { busstop_knock: true } }] },
      { type: 'weatherWhen', cond: { notFlag: 'busstop_knock' }, weather: { rain: true, wind: 0.2 } }],
    info: { summary: 'A suburban bus stop at night, in the rain, in 2020; a blurred man with a suitcase is telling a joke.',
      rules: ['He says “Knock knock”: answer “who’s there?” The rain stops and a rainbow comes down to the kerb (W373).'],
      secrets: ['“Daddy who?” — the joke has no end.', 'Between 21:00 and 21:59 real time, the last bus stops here (the timetable says so).', 'It goes to the Weather Depot (W361).'],
      time: ['Real time, 21:00–21:59: the 21:34 bus.'],
      lore: 'The night the father left, mid-joke.' } });

  /* ---------------------------------------------------------------
   *  W380 — Le Parapluie qui est venu (la fin du fil)
   * --------------------------------------------------------------- */
  var GATE = (function () { var g = K.grid(40, 16, ' '); g.box(0, 0, 40, 16, '#', '.'); g.rect(1, 1, 38, 4, '#'); g.rect(1, 9, 38, 2, ','); return g.rows(); })();
  S({ id: 'W380', name: 'The Umbrella That Came', depth: 4, tier: 'hard', back: 'W361', backLook: 'door', backOpt: { style: 'wood', c: ['#f0d870'] }, backLabel: 'back to the depot', backAt: [2, 7], outdoor: true, secretLevel: 5,
    map: GATE, look: Object.assign({}, K.LOOK.school, { floor: { p: 'asphalt', c: ['#4a4a52'] }, floor2: { p: 'tile', c: ['#8a8a88', '#6a6a68'] }, wall: { p: 'brick', c: ['#8a6a58', '#7a5a48', '#5a4a38'] } }),
    style: { sky: ['#5a6070', '#8a90a0'], renderer: 'watercolor' }, music: 'umbrellacame', amb: { type: 'rain', vol: 0.1 }, dark: 0.25,
    extra: { noFurnish: true },
    doors: [{ to: 'W362', at: [6, 6], opt: { style: 'wood', c: ['#5a7aa0'] }, cond: { all: [{ temp: { umbrella_walk: true } }, { equipped: 'E249' }] }, label: 'a second umbrella in the stand, for someone still waiting' }],
    decor: [{ look: 'puddle', n: 4, solid: false, lines: ['A puddle by the school gate. In it, two people under one umbrella.'] },
      { look: 'streetlamp', n: 1, at: [14, 7], light: 2, lines: ['A streetlamp coming on, early, because of the rain.'] },
      { look: 'streetlamp', n: 1, at: [29, 12], light: 2, lines: ['A streetlamp. Under it, the rain shows up like static.'] }],
    place: [{ id: 'schoolgate', type: 'decor', at: [6, 5], look: 'gate', lookOpt: { c: ['#5a5a60'] }, lines: ['The school gate, at four o’clock. All the parents with umbrellas. And this time, one of them is for you.'] },
      { id: 'home', type: 'decor', at: [37, 6], look: 'apartment', lookOpt: { lit: 0.5 }, lines: ['The apartment block. On the fourth floor, a window is lit. Someone left the light on for when you get in.'] },
      SOUL([EN('Once, just once, in a dream, someone came.')])].concat(marks((function () { var a = []; for (var x = 8; x <= 36; x++) a.push([x, 10]); return a; })(), 'scuff')),
    npcs: [{ id: 'N1943', name: 'Someone with an Umbrella', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e0e8', '#b8c0c8', '#e0c8b0', '#2a1a10'], acc: 'umbrella' }), behavior: 'patrol', at: [7, 10],
        path: [[12, 10], [18, 10], [24, 10], [30, 10], [35, 10]], speed: 0.9, pause: 0.6, solid: true, hearDist: 4,
        lines: [KS('미안해, 늦었지. 우산 하나밖에 없어. 붙어서 걸어.', 'Sorry I’m late. I’ve only got one umbrella. Walk close.'), KS('괜찮아. 천천히 가.', 'It’s all right. Go slowly.')],
        hears: [{ match: ['엄마', 'mum', 'mummy', 'mom', 'mama', 'eomma', 'umma'], lines: ['She stops under the umbrella and looks at you,', 'as if you had said something in a language she had stopped expecting.', KS('응. 엄마 왔어.', 'Yes. Mum’s here.')], do: [{ secret: 'umbrella_mum' }] }] },
    ].concat([[4, 6], [9, 6], [11, 7]].map(function (p, i) {
      return { id: ['N1944', 'N1949', 'N1950'][i], name: 'Another Parent', look: ghost('rgba(200,210,230,0.45)', 23), behavior: 'static', solid: false, at: p,
        lines: ['A parent with an umbrella, waiting for someone else’s child. The child comes running, and they go together.'] };
    })),
    mech: [{ type: 'guide', ent: 'N1943', wait: 4, cond: { not: { temp: { umbrella_walk: true } } },
        winLines: ['You walk home under the umbrella. It is too small for two, so her shoulder gets wet.', 'She doesn’t say anything about it.', KS('미안해, 늦었지. …추웠어?', 'Sorry I’m late. …Were you cold?'), 'You shake your head. It isn’t true. It doesn’t matter.', KS('괜찮아. 오늘은 진짜 괜찮아.', 'It’s all right. Today it really is all right.')],
        reward: [{ temp: { umbrella_walk: true } }, { secret: 'umbrella_came' }] },
      { type: 'weatherWhen', cond: { not: { temp: { umbrella_walk: true } } }, weather: { rain: true } }],
    info: { summary: 'A school gate at four o’clock in the rain; this time, someone has come with an umbrella.',
      rules: ['Only reachable by telling the depot board the truth (“it is not fine”).', 'Walk close to her: she walks you home under the umbrella, and the rain stops.'],
      secrets: ['Saying “mum” (엄마) to her.', 'Once walked home, with the Red Umbrella equipped, a door appears by the gate.', 'It leads back to the child still waiting in the Rain Room (W362).'],
      lore: 'The umbrella that, once, in a dream, came.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
