/* =========================================================================
 *  W001 — LE JARDIN. Monde de référence (voir docs/bible.md).
 *  Labyrinthe procédural (change à chaque rêve), pont cassé et trois
 *  planches, chute vers les Racines, champ de feuilles, énigme du merle,
 *  nénuphars et berceuse, poisson, statue, fête des mères, nuit, neige.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  YN.defWorld({
    id: 'W001', name: 'The Garden', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'A',
    style: { view: 'top' },
    look: { _base: 'garden', tile: { p: 'tile', c: ['#a8a89a', '#8a8a7a', '#c0c0b0'] }, wall2: { p: 'stone', c: ['#8a8278', '#6e665e', '#a09890'], face: '#5a524a' } },
    bg: '#16301c', music: 'garden', musicDark: 'gardennight', musicSnow: 'gardensnow', outdoor: true, corruption: 'forest',
    tall: { '^': { look: 'tree', vary: [{ look: 'tree' }, { look: 'tree', opt: { c: ['#3a7a3a', '#2a5a2a', '#5a3e26', '#5aa050'] } }, { look: 'willow' }], snowOpt: { c: ['#c8d8d0', '#a8b8b0', '#5a3e26', '#e8f0f0'] } }, '{': { look: 'bush', vary: [{ look: 'bush' }, { look: 'bush', opt: { berry: '#e04060' } }] }, 'o': { look: 'rock' } },
    fall: { to: 'W021', arrive: 'fallpoint' },
    anchor: 'statue', compass: 'mazeD',
    mapPost: function (rows, r) {
      // le labyrinthe ne se souvient pas : il change à chaque rêve
      var seed = r.int(1, 1e9) ^ ((YN.save.dream ? YN.save.dream.no : 0) * 7919);
      var mr = YN.rng.make(seed), mz = YN.gen.maze(25, 17, mr, { loops: 0.07 });
      rows = YN.gen.stamp(rows, mz, 44, 2);
      rows = YN.gen.put(rows, 45, 18, '.');
      var cx = 44 + 13, cy = 2 + 9;
      for (var yy = cy - 1; yy <= cy + 1; yy++) for (var xx = cx - 1; xx <= cx + 1; xx++) rows = YN.gen.put(rows, xx, yy, '.');
      rows = YN.gen.put(rows, cx, cy, 'D');
      // la planche : au cul-de-sac le plus lointain de l'entrée
      var b = YN.gen.bfs(rows, [45, 18]), best = null, bd = -1;
      for (var y = 3; y < 18; y++) for (var x = 45; x < 68; x++) {
        var d = b.dist[x + y * b.w]; if (d < 0 || rows[y][x] !== '.') continue;
        var walls = 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (q) { if (rows[y + q[1]][x + q[0]] === '#') walls++; });
        if (walls === 3 && d > bd && Math.abs(x - cx) + Math.abs(y - cy) > 3) { bd = d; best = [x, y]; }
      }
      if (best) rows = YN.gen.put(rows, best[0], best[1], 'K');
      return rows;
    },
    map: [
      '###################################G##################################',
      '#......w~C~~w......................,.................................#',
      '#......w~~~~www....................,........##########################',
      '#....www~~~~~~wwww.................,.3......##########################',
      '#...ww~~~~~~~~~~~ww.....^..........,........##########################',
      '#..ww~~~~~~~~~~~~~ww...............,........##########################',
      '#..w~~~~~~~~~~~~~~~w...............,....^...##########################',
      '#.ww~~~~~~~~~~~~~~~ww......^.......,........##########################',
      '#.w~~~~~~~~~~~~~~~~~w.........{....,........##########################',
      '#.ww~~~~~~~y~~~~~~~ww..............,........##########################',
      '#..w~~~~~~yyy~~~~~~w...............,...{....##########################',
      '#..ww~~~~~~y~~~~~~ww...............,........##########################',
      '#...ww~~~~~w~~~~~ww...^....{.......,......^.##########################',
      '#....wwww~~w~~wwwM.................,........##########################',
      '#.......wwwwwww..............o.....,.o......##########################',
      '#...................o....^........,,........##########################',
      '#.................................,,.....^..##########################',
      '#.""""""""""""""""""".............,,........##########################',
      '#."""""""""""";"""""".............,,........##########################',
      '#.""";;"""""""";"""""............:...................................#',
      '#.""""";"""""""";""""..^.....:::::::::...1...........................#',
      '#.""""""";";";"""""""......:::*:::::::::...........B.................#',
      '#."""""""""";"""""""".....:::::::::::::::....{..,,,,,,,....%%%%%%%%%.#',
      '#.""""""";"""""""""""....:::::::::::::*:::......,ttttt,....%.......%.#',
      'O,,"""";"""Y""";"""""....:::*:::::::::::::.^....,ttttt,....%.......%.#',
      '#.";"""";""""";""""""...:::::::::::::::::::.....,ttttt,....%.......%.#',
      '#."";""""""";"""";""".^.:::::::::::::::::::.....,ttttt,....%.......%.#',
      '#."""""""";"";"""";""...:::::::::F:::::::::...{.,ttttt,....%.......%.#',
      '#."""""""""""""""""""..:::*:::::::::::::*:::....,,,,,,,....%%%%R%%%%.#',
      '#.""""""";""";"""""""...:::::::::::::::::::.^......,.................#',
      '#."""""""";""""""""""...{::::::::,:::::::::........,....{....P...4...#',
      '#."J"""""""""""""""""...:::::*:::,:::::::::........,.................#',
      '#."""""""""""""""""""....::::::::,::::*:::,,,,,,,,,,,,,,,,,,,,,,,,,,,E',
      '#.....................^..::::::::,::::::::.............,..{..........#',
      '#......^..................:::::::,::*::::.....^........,.............#',
      '#.......###########^.......::::::,::::::...............,.^....^......#',
      '#...^...###########.....^...{::::N::::....{............,..........^..#',
      '#.......####V######..............:...........o.........,.............#',
      '#....{........................^.......^................,.............#',
      '#......................................................=.............#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_~~~~~~~~~~~~~#',
      '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_~~~~~~~~~~~~~#',
      '#......................................................=.............#',
      '#..^..........^.................^...............{.:::::::::::.....^..#',
      '#.......^.................^.................^..:::::::+:+:5:::::.....#',
      '#.........o.........^.................^.......:::::::::S:::::::::....#',
      '#...................................o..........:::2:::+:+:::{:::.....#',
      '#.............................................^...:::::::::::...^....#',
      '######################################################################'
    ],
    marks: {
      N: { id: 'N', type: 'door', to: 'NEXUS', arrive: 'doorA', look: 'ndoor', lookOpt: { c: ['#3a6a3a', '#f8f0e0'], sym: 'leaf' }, animated: true, essential: true },
      G: { id: 'gate', type: 'door', floor: '#', to: 'W013', look: 'gate', lookIf: [{ cond: { flag: 'garden_gate' }, lookOpt: { open: true } }], lock: { unless: { flag: 'garden_gate' }, text: 'The gate is shut. A bird is carved on the lock, its beak open.' }, essential: true },
      E: { id: 'east', type: 'path', to: 'W006', essential: true },
      O: { id: 'west', type: 'path', to: 'W019', essential: true },
      C: { id: 'cave', type: 'door', floor: '%', to: 'W021', arrive: 'cave', look: 'hole', label: 'cave behind the waterfall', unreachOk: 'swimming (Fish) or ice' },
      M: { id: 'musicbox', type: 'decor', look: 'musicbox', animated: true },
      Y: { id: 'sprout', type: 'effect', give: 'E01', look: 'sprout', getLines: ['The sprout doesn’t run away any more. It lets itself be picked up.'] },
      J: { id: 'plankJ', type: 'item', look: 'plank', item: { plank: 1 }, once: true, solid: false },
      K: { id: 'plankK', type: 'item', look: 'plank', item: { plank: 1 }, solid: false },
      D: { id: 'mazeD', type: 'stairs', to: 'W031', look: 'stairsdown', solid: false, essential: true },
      F: { type: 'spawn' }, P: { type: 'spawn' }, B: { type: 'spawn' },
      '1': { id: 'cookiebush', type: 'decor', look: 'bush', lookOpt: { berry: '#c8904a' }, use: [{ if: { not: { temp: { gardenCookie: true } } }, temp: { gardenCookie: true }, cookie: 1, else: [{ msg: 'Leaves. Only leaves.' }] }] },
      '2': { id: 'bench', type: 'decor', look: 'bench', lines: ['A bench. On the backrest, two initials carved inside a heart; one has been scratched out.', 'She sits down for a second. The bench is warm on one side.'], cycle: true },
      '3': { id: 'sign', type: 'sign', look: 'sign', lines: [{ t: 'Shared garden. Please close the gate behind you.', lang: 'en' }, { t: '{{garden}}' }, { t: 'She always closed it twice. Once for the cats. Once for the little one.', lang: 'en' }] },
      '4': { id: 'planks', type: 'decor', look: 'crate' },
      '5': { id: 'chime', type: 'decor', look: 'chime', animated: true, lines: ['The wind chime rings on its own: G… E…', 'The wind plays two notes on it, always the same ones.'], cycle: true, use: [{ sfx: 'chime' }] },
      R: { id: 'shed', type: 'door', floor: '%', to: 'W028', look: 'door', lookOpt: { style: 'wood', c: ['#6a5a3a'] } },
      S: { id: 'statue', type: 'decor', look: 'statue', lookIf: [{ cond: { realDate: 'feteDesMeres' }, lookOpt: { flowers: true, tears: true } }, { cond: { flag: 'statue_flowers' }, lookOpt: { flowers: true } }] },
      V: { id: 'nightdoor', type: 'door', floor: '#', to: 'W136', look: 'door', lookOpt: { style: 'wood', c: ['#1a3a1e'] }, cond: { dark: true }, label: 'a door in the hedge' }
    },
    place: [
      { id: 'waterfall', type: 'decor', at: [10, 3], look: 'waterfall', animated: true, solid: false, zy: -2, alpha: 0.82, sound: 'rain', soundVol: 0.07 },
      { id: 'deadtree', type: 'decor', at: [51, 20], look: 'deadtree', solid: true },
      { id: 'fallpoint', type: 'spawn', at: [55, 38] },
      /* âmes : fragments du jardin partagé */
      { id: 'soulStatue', type: 'soul', at: [52, 45], lines: ['She is wearing a work smock. Her hands are empty.', { t: '엄마, 미안해. 다음 주에는 꼭 올게. 꽃 사 가지고.', lang: 'ko-s', tr: 'Mum, I’m sorry. Next week I’ll come, I promise. With flowers.' }, { t: '…다음 주도 야간이네.', lang: 'ko-s', tr: '… I’m on nights next week too.' }] },
      { id: 'soulLeaves', type: 'soul', at: [10, 20], lines: [{ t: '쉿, 낙엽 밟지 마라. 아프다고 소리 지른다.', lang: 'ko-s', tr: 'Shh, don’t step on the dead leaves. They cry out that it hurts.' }, { t: '초록 잎은 괜찮다. 아직 살아 있어서 조용한 거야.', lang: 'ko-s', tr: 'The green leaves are all right. They’re still alive, that’s why they keep quiet.' }] },
      { id: 'soulPond', type: 'soul', at: [21, 8], lines: [{ t: 'The old lady from the fourth floor whistled at the blackbirds. Three notes. They always answered.', lang: 'en' }, { t: 'I tried for years. They only answer people who are in no hurry.', lang: 'en' }] },
      { id: 'soulPlot', type: 'soul', at: [66, 24], lines: [{ t: 'Plot twelve was hers. Nobody took it, after.', lang: 'en' }, { t: 'Her perilla came back on its own for two summers. Then the committee mowed it.', lang: 'en' }] },
      { id: 'soulCan', type: 'soul', at: [25, 33], lines: ['She bends down, as if she were holding a small hand.', { t: '물뿌리개가 너보다 크구나. 할머니랑 같이 들자.', lang: 'ko-s', tr: 'The watering can is bigger than you. Let’s carry it together, with Grandma.' }, { t: '천천히. 꽃은 급한 사람을 싫어해.', lang: 'ko-s', tr: 'Slowly. Flowers don’t like people in a hurry.' }] },
      { id: 'soulLullaby', type: 'soul', at: [19, 15], lines: ['She hums, very softly, without opening her mouth.', { t: '자장자장 우리 아가, 잘도 잔다 우리 아가…', lang: 'ko-s', tr: 'Hush-a-bye, my little one, how well you sleep, my little one…' }, 'Five notes. She forgets what comes next, and starts again.'] }
    ],
    npcs: [
      { id: 'N001', at: 'F' }, { id: 'N003', at: 'P' }, { id: 'N015', at: 'B' }, { id: 'N016', at: [12, 7] }, { id: 'N018', at: [14, 38] },
      { id: 'N019', at: [28, 20] }, { id: 'N020', at: [40, 44] }, { id: 'N021', at: [53, 46] }, { id: 'N022', at: [36, 18] }
    ],
    variants: {
      bridge: { cond: { flag: 'garden_bridge' }, tiles: { '_': '=' } }
    },
    mech: [
      { type: 'gardenLeaves', sprout: 'sprout', field: [2, 17, 20, 32] },
      { type: 'gardenBird', bird: 'N015', plaza: [49, 23, 53, 27] },
      { type: 'gardenLilies', box: 'musicbox', lilies: { '11,9': 4, '10,10': 1, '11,10': 2, '12,10': 3, '11,11': 0 } },
      { type: 'gardenFish', fish: 'N016' },
      { type: 'bridgePlanks', gaps: [[55, 40], [55, 41], [55, 42]], flag: 'garden_bridge' },
      { type: 'gate', mark: 'gate', flag: 'garden_gate', events: ['whistle', 'melody'], dist: 5, text: 'The gate creaks open.' },
      { type: 'gardenStatue', statue: 'statue' },
      { type: 'plankPile', mark: 'planks', owner: 'N003' }
    ],
    radio: { '91.3': { line: { t: '… and tomorrow’s rain over the shared garden… children may come and help with the watering…', lang: 'en' } } },
    info: {
      summary: 'A shared garden enclosed by hedges: a meadow, a pond beneath a waterfall, a field of leaves, a stone square, a shed, a maze that changes every night, a river and its broken bridge, a statue on the far bank.',
      art: '16 px pixel art, deep greens, animated water, semi-transparent waterfall. Night: darkness, fireflies, owl. Snow: whitened ground, frozen pond.',
      musicDesc: 'Music box in the Dorian mode over a soft pad; at night, glass and crickets; in the snow, Lydian bells and wind.',
      rules: ['Brown leaves crunch (noise); green ones are silent.', 'The river and the pond are deep: you have to swim, float or wait for the ice.', 'The maze is different in every dream.', 'Falling through the hole in the bridge leads to the Roots.'],
      time: ['Mother’s Day (real date): a seated silhouette near the statue.'],
      secrets: ['At night, a door opens in the south-west hedge (W136).', 'The cave behind the waterfall leads down to the Roots.', 'Say “할머니” (or “grandma”) in front of the statue.'],
      role: 'Reference world. Introduces effects, bedroom variants and the link between noise and witches.',
      lore: 'The shared garden where the grandmother gardened. The statue is not who you think.'
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* le bord est du Jardin mène au Verger (le Verger y ramenait déjà par son bord ouest) */
(function (root) { var W = root.YN.data.worlds.W001; if (W) W.place = (W.place || []).concat([{ id: 'E', type: 'path', to: 'W006', arrive: 'west', at: [131, 18], label: 'the orchard, to the east' }]); })(typeof window !== 'undefined' ? window : globalThis);
