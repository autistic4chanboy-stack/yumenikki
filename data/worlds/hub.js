/* =========================================================================
 *  Lieux-pivots : la chambre (P0), la terrasse, le couloir, la chambre
 *  rêvée, le Nexus, la salle des nids, la Salle sans lumière (W040).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function R(name) { return function () { YN.room[name](); }; }
  var ROOM_LOOK = {
    floor: { p: 'wood', c: ['#9a7650', '#7e5e3e', '#a8865c'] }, floor2: { p: 'rug', c: ['#7a5a8a', '#8a6a9a'] },
    wall: { p: 'flat', c: ['#3a2c2a', '#342826'], topColor: '#3b2f2b' }, wallface: { p: 'wallpaper', c: ['#e2d4bc', '#c9ad92', '#9a7a5e'], skirt: '#7a5638' }, counter: { p: 'wood', c: ['#7a5a3a', '#5a4028', '#8a6a48'] }
  };

  /* ---------------- LA CHAMBRE (éveillée) ---------------- */
  YN.defWorld({
    id: 'ROOM', name: 'The Bedroom', depth: 0, tier: 'hub', core: true, status: 'implemented', region: 'P0',
    style: { view: 'top', tallWalls: true, zoom: 12.5 }, look: ROOM_LOOK, bg: '#000', music: 'room', musicDark: 'roomnight', darkAmount: 0.72,
    amb: { type: 'hum', vol: 0.03 },
    map: [
      '##T#K#W#Q##OS###',
      '#P....C..A.N.Ux#',
      '#.............B#',
      '#R..........L..#',
      '#..............#',
      '#.....,,,,,....#',
      '#.....,,@,,....#',
      '#.Dx..,,,,,....#',
      '#..............#',
      '#..............#',
      '################'
    ],
    place: [],
    marks: {
      K: { id: 'calendar', type: 'decor', floor: '#', look: 'calendar', lookOpt: { circle: true }, use: [{ fn: R('calendar') }] },
      W: { id: 'window', type: 'decor', floor: '#', look: 'window', lookIf: [{ cond: { roomWindow: true, roomLight: false }, lookOpt: { open: true, night: true } }, { cond: { roomWindow: true }, lookOpt: { open: true } }, { cond: { roomLight: false }, lookOpt: { night: true } }], use: [{ fn: R('window') }], light: 0 },
      Q: { id: 'poster', type: 'decor', floor: '#', look: 'poster', lookOpt: { c: ['#1a2040', '#3a4a80'] }, use: [{ fn: R('poster') }] },
      T: { id: 'terrace', type: 'decor', floor: '#', look: 'door', lookOpt: { style: 'glass' }, lookIf: [{ cond: { flag: 'terrace_open' }, lookOpt: { style: 'glass', ajar: true } }], use: [{ fn: R('terrace') }] },
      P: { id: 'pot', type: 'decor', look: 'pot', lookIf: [{ cond: { quest: { Q02: 'end_room' } }, lookOpt: { plant: true } }], use: [{ fn: R('plant') }] },
      C: { id: 'commode', type: 'decor', look: 'commode', use: [{ fn: R('commode') }] },
      A: { id: 'arcade', type: 'decor', look: 'arcade', animated: true, use: [{ fn: R('arcade') }] },
      B: { id: 'bed', type: 'decor', look: 'bed', lookOpt: { c: ['#e8e0f0', '#8a9ac8'] }, lookIf: [{ cond: { motherVisits: 5 }, lookOpt: { c: ['#e8e0f0', '#a87aa0'] } }], use: [{ fn: R('bed') }], solid: true },
      U: { id: 'nightstand', type: 'decor', look: 'nightstand', lookIf: [{ cond: { flag: 'glass_today' }, lookOpt: { glass: true } }], use: [{ fn: function () { if (YN.save.flag('glass_today')) YN.room.glass(); else YN.room.say(['The bedside table. The drawer doesn’t quite close any more.']); } }] },
      L: { id: 'blanket', type: 'decor', look: 'blanketlump', cond: { motherVisits: 5 }, use: [{ fn: R('blanket') }], solid: false },
      R: { id: 'shelf', type: 'decor', look: 'shelf', lines: ['Picture books. On the spine of one of them, someone has written “S.” in marker.', 'A book of Korean folk tales. The middle pages are stuck together.', 'An atlas. Korea is coloured in two colours that don’t touch.'], cycle: true },
      S: { id: 'switch', type: 'decor', floor: '#', look: 'switch', lookIf: [{ cond: { roomLight: true }, lookOpt: { on: true } }], use: [{ fn: R('light') }] },
      N: { id: 'note', type: 'decor', look: 'letter', cond: { motherVisits: 3 }, solid: false, use: [{ fn: R('note') }] },
      O: { id: 'door', type: 'decor', floor: '#', look: 'door', lookIf: [{ cond: { roomDoor: true }, lookOpt: { ajar: true } }], use: [{ fn: R('door') }] },
      D: { id: 'desk', type: 'decor', look: 'desk', lookOpt: { book: true, lamp: true }, use: [{ fn: R('desk') }] },
      '@': { type: 'spawn', floor: ',' }
    },
    info: { summary: 'The waking bedroom. Here you set the light, the window and the door, take a pill (or not), play on the arcade cabinet, and sleep.', role: 'Starting point of every cycle. Its details change with discoveries (poster, glass of water, note under the door, blanket, pot).' }
  });

  /* ---------------- LA TERRASSE ---------------- */
  YN.defWorld({
    id: 'TERRACE', name: 'The Terrace', depth: 0, tier: 'hub', core: true, status: 'implemented', region: 'P0',
    style: { view: 'top', sky: ['#05060f', '#12183a', '#2a2a50'], stars: true },
    look: { floor: { p: 'tile', c: ['#6a6a78', '#4a4a58'] }, wall: { p: 'concrete', c: ['#8a8a90', '#707078', '#5a5a60'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#9a9aa8'] } },
    bg: '#05060f', music: null, amb: { type: 'wind', vol: 0.08 }, outdoor: true,
    mech: [{ type: 'skyline' }],
    map: [
      '            ',
      'fffffRffffff',
      '#..........#',
      '#..........#',
      '#..........#',
      '#####D######'
    ],
    tall: { f: { look: 'fence', opt: { c: ['#9a9aa8'] } } },
    marks: {
      R: { id: 'rail', type: 'decor', floor: 'f', look: null, use: [{ fn: R('terraceRail') }], solid: true },
      D: { id: 'in', type: 'decor', floor: '#', look: 'door', lookOpt: { style: 'glass' }, use: [{ fn: function () { YN.game.enterWorld('ROOM', 'terrace', 'TERRACE', 'door'); } }] }
    },
    place: [{ id: 'tpot', type: 'decor', at: [4, 3], look: 'pot', lookIf: [{ cond: { quest: { Q02: 'end_room' } }, lookOpt: { plant: true } }], use: [{ fn: R('plant') }] }],
    info: { summary: 'A small balcony above the sleeping city.', role: 'Observation. After the thirty nests, the glass door opens on its own.' }
  });

  /* ---------------- LE COULOIR (Fin II) ---------------- */
  YN.defWorld({
    id: 'HALL', name: 'The Hallway', depth: 0, tier: 'hub', status: 'implemented', region: 'P0', secretLevel: 3,
    style: { view: 'top' }, dark: 0.85,
    look: { floor: { p: 'wood', c: ['#6a5040', '#5a4030', '#7a5a48'] }, floor2: { p: 'tile', c: ['#d8d0c0', '#b8b0a0'] }, wall: { p: 'wallpaper', c: ['#a89880', '#988870', '#6a5a48'] } },
    bg: '#000', music: null, amb: { type: 'hum', vol: 0.05 },
    map: [
      '####################',
      '#R.......#,,,,,,,,,#',
      '#..................#',
      '#........#,,,T,,F,,#',
      '#........#,,,,M,,,,#',
      '####################'
    ],
    marks: {
      R: { id: 'back', type: 'decor', look: 'door', lines: ['Her room. She won’t go back in just yet.'] },
      T: { id: 'table', type: 'decor', look: 'table', lookOpt: { cloth: '#d8c8b8' }, light: 4.5 },
      F: { id: 'fridge', type: 'decor', look: 'fridge', lookOpt: { notes: true }, lines: [{ t: '냉장고에 반찬 있어. 데워 먹어.', lang: 'ko-s', tr: 'There are side dishes in the fridge. Heat them up.' }, 'Under the magnet, a shopping list. The last word is her name.'] },
      M: { id: 'mother', type: 'decor', look: 'hand', lookOpt: { c: ['#e8c8a8'] }, use: [{ fn: function () { YN.game.ending('II'); } }] }
    },
    info: { summary: 'The flat’s hallway, and the lit kitchen at the end.', role: 'Ending II, only once her voice has come back.' }
  });

  /* ---------------- LA CHAMBRE RÊVÉE (P1) ---------------- */
  YN.defWorld({
    id: 'DREAMROOM', name: 'The Dreamt Bedroom', depth: 1, tier: 'hub', core: true, status: 'implemented', region: 'P1',
    style: { view: 'top', tallWalls: true, zoom: 12.5 },
    look: { floor: { p: 'wood', c: ['#6a5a8a', '#5a4a78', '#7a6a9a'] }, floor2: { p: 'rug', c: ['#3a2a5a', '#4a3a6a'] }, wall: { p: 'flat', c: ['#1e1830', '#1a1428'], topColor: '#241c34' }, wallface: { p: 'wallpaper', c: ['#a898c8', '#9080b8', '#605078'], skirt: '#3a2c50' }, counter: { p: 'wood', c: ['#5a4a6a', '#4a3a5a', '#6a5a7a'] } },
    bg: '#000', music: 'dreamroom', darkAmount: 0.6,
    map: [
      '##T#K#W#Q##O####',
      '#P....C..A...Ux#',
      '#.............B#',
      '#R.............#',
      '#..............#',
      '#.....,,,,,....#',
      '#.....,,@,,....#',
      '#.Dx..,,,,,....#',
      '#..............#',
      '#..............#',
      '################'
    ],
    marks: {
      K: { type: 'decor', floor: '#', look: 'calendar', lines: ['Every day of the month is a Sunday.'] },
      W: { type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['Behind the glass, the sky is too close.', 'Behind the glass, another window. Behind that, another.'], cycle: true },
      Q: { type: 'decor', floor: '#', look: 'poster', lookOpt: { c: ['#101028', '#f0e070'] }, lines: ['On the poster, the stars have moved.'] },
      T: { type: 'decor', floor: '#', look: 'door', lookOpt: { style: 'glass', c: ['#504878'] }, lines: ['It doesn’t open from this side.'] },
      P: { type: 'decor', look: 'pot', lookOpt: { plant: true }, lines: ['Here, something has grown.'] },
      C: { type: 'decor', look: 'commode', lookOpt: { c: ['#6a5a8a'] }, lines: ['The drawers are empty. Or full of something else.'] },
      A: { id: 'darcade', type: 'decor', look: 'arcade', lookOpt: { c: ['#202050'] }, animated: true, lookIf: [{ cond: { flag: 'arcade_question' }, lookOpt: { c: ['#000000'] } }],
        lines: [{ if: { notFlag: 'arcade_watermelon' }, t: 'The screen is off. Your reflection is playing anyway.' }, { if: { flag: 'arcade_watermelon' }, t: 'On the screen, a watermelon turns slowly.' }] },
      B: { id: 'bed', type: 'decor', look: 'bed', lookOpt: { c: ['#c8c0e0', '#6a5aa0'] }, solid: true,
        use: [{ fn: function () { YN.ui.dialog.queue([{ t: 'To fall back asleep here is to wake up over there.' }], {}, function () { YN.ui.dialog.choose(['Wake up', 'Stay'], function (i) { if (i === 0) YN.game.wake('door'); }); }); } }] },
      U: { type: 'decor', look: 'nightstand', lookOpt: { c: ['#5a4a6a'], clock: true }, lines: ['The alarm clock shows a time that doesn’t exist.'] },
      R: { type: 'decor', look: 'shelf', lookOpt: { c: ['#5a4a7a'] }, lines: ['All the books have the same cover. Except one, which has no cover at all.'] },
      O: { id: 'out', type: 'door', floor: '#', to: 'NEXUS', arrive: [10, 13], look: 'door', lookOpt: { c: ['#3a2a5a'], ajar: true }, essential: true, exitDir: 'down' },
      D: { type: 'decor', look: 'desk', lookOpt: { c: ['#6a5a8a'], book: true }, lines: ['The diary is open at a page she hasn’t written yet.'] },
      '@': { type: 'spawn', floor: ',' }
    },
    place: [
      { id: 'soulSunday', type: 'soul', at: [3, 9], lines: [{ t: 'In this room every day is a Sunday. Walk softly. On Sundays she sleeps until dark.', lang: 'en' }] }
    ],
    spawn: 'bed',
    info: { summary: 'The bedroom, on the other side of sleep. Its door, which stays shut when she is awake, opens here onto the Nexus.', role: 'Entrance to the dream. The bed lets you wake up (saves the game).' }
  });

  /* ---------------- LE NEXUS ---------------- */
  var NEXUS_DOORS = [
    ['A', 'W001', '#3a6a3a', 'leaf'], ['B', 'W002', '#6a5a3a', 'clock'], ['C', 'W003', '#a0503a', 'sun'], ['D', 'W004', '#4a5a7a', 'school'], ['E', 'W005', '#505050', 'mono']
  ];
  var nexusMarks = {
    Z: { id: 'Z', type: 'door', to: 'WAKE', look: 'ndoor', lookOpt: { c: ['#2a2a4a', '#ffffff'], sym: 'moon' }, animated: true, essential: true, label: 'the door to waking' },
    H: { id: 'hatch', type: 'stairs', to: 'EFFECTROOM', arrive: 'U', look: 'stairsdown', cond: { any: [{ savedEffects: 1 }, { eggs: 1 }] }, solid: false, appearSfx: 'reveal' },
    S: { id: 'secret', type: 'door', to: 'W040', look: 'ndoor', lookOpt: { c: ['#0a0a0a', '#303030'], sym: 'eye' }, cond: { dark: true }, label: 'lightless door' },
    J: { id: 'jar', type: 'decor', look: 'cookiejar', lookIf: [{ cond: { temp: { jarTaken: true } }, lookOpt: { empty: true } }],
      use: [{ if: { all: [{ fn: function () { var d = YN.save.dream; return d && d.no % 3 === 1; } }, { not: { temp: { jarTaken: true } } }] }, temp: { jarTaken: true }, cookie: 1, else: [{ msg: 'The jar is empty. It doesn’t fill up every night.' }] }] },
    '@': null
  };
  NEXUS_DOORS.forEach(function (d) { nexusMarks[d[0]] = { id: 'door' + d[0], type: 'door', to: d[1], look: 'ndoor', lookOpt: { c: [d[2], '#f8f0e0'], sym: d[3] }, animated: true, essential: true }; });
  YN.defWorld({
    id: 'NEXUS', name: 'The Nexus', depth: 1, tier: 'hub', core: true, status: 'implemented', region: 'P1', safe: true,
    style: { view: 'top', stars: true, sky: ['#05040c', '#0c0a1e'], cliffH: 0, voidEdge: 'organic' }, weather: { dust: true },
    lookFn: function () {
      var n = YN.save.perm ? YN.save.perm.effects.length + YN.save.perm.eggs.length : 0;
      var cols = ['#2a2440', '#2e2848'];
      if (n >= 3) cols.push('#3a3070'); if (n >= 8) cols.push('#4a3a3a'); if (n >= 14) cols.push('#2a4a3a'); if (n >= 20) cols.push('#5a4a20'); if (n >= 30) cols.push('#6a2a4a');
      return { floor: { p: 'blank', c: cols }, floor2: { p: 'blank', c: cols }, floor3: { p: 'blank', c: cols } };
    },
    mech: [{ type: 'nexusFloor' }],
    bg: '#05040c', music: 'nexus', darkAmount: 0.7,
    map: [
      '                     ',
      '       S..A..        ',
      '      .........      ',
      '    B...:::::...C    ',
      '    ...:.....:...    ',
      '    ..:.......:..    ',
      '   ..:....,....:..   ',
      '   ..:...,,,...:..   ',
      '   ..:..,,H,,..:..   ',
      '   ..:...,,,.J.:..   ',
      '   ..:....,....:..   ',
      '    ..:.......:..    ',
      '    ...:.....:...    ',
      '    D...::@::...E    ',
      '      .........      ',
      '        ..Z..        ',
      '                     '
    ],
    marks: nexusMarks,
    place: [
      { id: 'soulDoors', type: 'soul', at: [16, 10], lines: [{ t: 'Every door here was a door of the flat, once.', lang: 'en' }, { t: 'The sixth one only opens when the lamp is off.', lang: 'en' }] }
    ],
    info: { summary: 'A disc hanging in the void, five doors and the door to waking. The floor takes on colour as effects are kept.', role: 'Hub and safe place: no witch comes in. A hatch appears after the first effect is kept; in the dark, a sixth door.' }
  });

  /* ---------------- LA SALLE DES NIDS ---------------- */
  var STONES = [
    ['here sleep the things', [13, 1]], ['that you have kept', [19, 7]], ['when thirty are laid down', [17, 14]],
    ['the outside door will listen', [9, 17]], ['in the dark say the name', [3, 11]], ['of the one who waited at the stations oksun', [5, 4]]
  ];
  YN.defWorld({
    id: 'EFFECTROOM', name: 'The Nest Room', depth: 1, tier: 'hub', core: true, status: 'implemented', region: 'P1', safe: true,
    style: { view: 'top' },
    look: { floor: { p: 'stone', c: ['#3a3448', '#2a2438', '#4a4458'] }, floor2: { p: 'flat', c: ['#5a4a6a', '#54446a'] }, wall: { p: 'stone', c: ['#5a5068', '#4a4058', '#6a6078'], face: '#3a3048' } },
    bg: '#000', music: 'effectroom',
    mech: [{ type: 'effectGallery' }],
    map: [
      '                       ',
      '        #######        ',
      '       ##.....##       ',
      '     ##....N....##     ',
      '     #..NNN.NNN..#     ',
      '    #..N.......N..#    ',
      '   ##.N.........N.##   ',
      '   #..N.........N..#   ',
      '   #.N....,,,....N.#   ',
      '   #......,,,......#   ',
      '   #.N....,,,....N.#   ',
      '   #..N.........N..#   ',
      '   ##.N.........N.##   ',
      '    #..N.......N..#    ',
      '     #..NNN.NNN..#     ',
      '     ##....N....##     ',
      '       ##.....##       ',
      '        ###U###        ',
      '                       '
    ],
    marks: {
      N: { type: 'nest', look: 'nest', mech: 'nest' },
      U: { id: 'U', type: 'stairs', floor: '#', to: 'NEXUS', arrive: 'hatch', look: 'stairs', solid: true, essential: true }
    },
    place: STONES.map(function (s, i) { return { id: 'stone' + i, type: 'inscription', at: s[1], look: 'glyphstone', glyphs: s[0], lines: ['Signs are carved here.'] }; }).concat([
      { id: 'soulKeeper', type: 'soul', at: [6, 9], lines: [{ t: 'I kept a ticket, a shoe, a paper crane. I never had thirty things to lay down.', lang: 'en' }, { t: 'Maybe you will. You keep everything.', lang: 'en' }] }
    ]),
    info: { summary: 'A round room beneath the Nexus. Thirty empty nests in a circle, carved signs on the walls, and the kept effects floating above the floor.', role: 'The thirty nests: laying thirty effects in them opens the ending. The signs (never explained) can be deciphered: see the extreme secrets.' }
  });

  /* ---------------- W040 — LA SALLE SANS LUMIÈRE ---------------- */
  YN.defWorld({
    id: 'W040', name: 'The Lightless Room', depth: 1, tier: 'mid', core: true, status: 'implemented', region: 'E',
    style: { view: 'top' }, dark: 0.96, playerLight: 1.1,
    look: { floor: { p: 'flat', c: ['#141418', '#101014'] }, wall: { p: 'concrete', c: ['#202024', '#18181c', '#101012'], face: '#0c0c0e' } },
    bg: '#000', music: 'darkroom',
    map: [
      '###############',
      '#.............#',
      '#..L.......G..#',
      '#.............#',
      '#......,......#',
      '#.....,,,.....#',
      '#......,......?',
      '#.............#',
      '#..T.......M..#',
      '#.............#',
      '#######U#######'
    ],
    marks: {
      L: { id: 'hook', type: 'effect', look: 'lantern', lookOpt: { off: true }, give: 'E05', light: 0.8, getLines: ['A lantern hangs from a hook. It lights up when you take it down.'], lines: ['An empty hook.'] },
      G: { id: 'table', type: 'inscription', look: 'glyphstone', lookOpt: { c: ['#3a3a40'] }, glyphs: 'abcdefghijklm', lines: [{ t: 'Under some of them I wrote in pencil: A, B, C…', lang: 'en' }, { t: 'Then I stopped. Two rows was enough for one night.', lang: 'en' }] },
      T: { id: 'tglyph', type: 'inscription', look: 'glyphstone', lookOpt: { c: ['#3a3a40'] }, glyphs: 'nopqrstuvwxyz', lines: [{ t: 'More of them. Someone rubbed out my pencil marks.', lang: 'en' }, { t: 'Whoever erased them knew what they said.', lang: 'en' }] },
      M: { id: 'mirror', type: 'decor', look: 'mirror', lines: ['In the dark, the mirror shows nothing. Then it shows someone who has no lamp.'] },
      U: { id: 'U', type: 'stairs', floor: '#', to: 'NEXUS', arrive: 'secret', look: 'stairs', solid: true, essential: true }
    },
    asciiText: [{ x: 2, y: 4, text: 'SHE IS NOT ASLEEP' }],
    place: [
      { id: 'soulSwitch', type: 'soul', at: [7, 2], lines: ['Her hand rests on a light switch that isn’t there.', { t: '자니? …불 끌게. 잘 자, 우리 딸.', lang: 'ko-s', tr: 'Are you asleep? … I’ll turn off the light. Sleep well, my girl.' }] },
      { id: 'soulStill', type: 'soul', at: [12, 5], lines: [{ t: 'She turns the light off when she thinks you are asleep.', lang: 'en' }, { t: 'You are never asleep. You just keep very still.', lang: 'en' }] },
      { id: 'soulNoLamp', type: 'soul', at: [9, 8], lines: [{ t: 'The mirror here shows the one who has no lamp.', lang: 'en' }, { t: 'Do not lend her yours. She never gives anything back.', lang: 'en' }] }
    ],
    info: { summary: 'A dark room behind a Nexus door that only exists with the light off. A lantern, signs in pencil, a mirror.', art: 'Almost black pixel art; only the player gives off a little light.', role: 'Second source of the Lantern. A partial Rosetta Stone for the carved signs. A wall hides a passage (secret).', secret: 'The east wall (?) leads further on, for those who can see passages.' }
  });
})(typeof window !== 'undefined' ? window : globalThis);
