/* =========================================================================
 *  MONDES DU CŒUR (1/6) — les quatre autres portes du Nexus :
 *  W002 Gare des heures absentes · W003 Ville au crépuscule ·
 *  W004 École vide · W005 Monde mono
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit;

  /* ======================= W002 — GARE DES HEURES ABSENTES ======================= */
  (function () {
    var g = K.grid(46, 27, ' ');
    g.box(0, 0, 46, 27, '#', '.');
    g.rect(1, 1, 44, 2, ',');                         // bande sous l'horloge
    for (var x = 4; x < 44; x += 7) { g.set(x, 4, '^'); g.set(x, 9, '^'); }
    [6, 13, 27, 34].forEach(function (x) { g.set(x, 6, '{'); });
    g.hline(1, 44, 12, 'f');                          // ligne des tourniquets
    ['T', 'U', 'V', 'W'].forEach(function (c, i) { g.set([8, 17, 29, 38][i], 12, c); });
    g.rect(1, 13, 44, 4, '.'); g.hline(1, 44, 17, ',');   // quai A, bord jaune
    g.rect(1, 18, 44, 3, 'r');                        // voies
    g.hline(1, 44, 21, ','); g.rect(1, 22, 44, 4, '.');   // quai B
    g.set(1, 23, '{'); g.set(44, 23, '}');
    // marques
    g.set(3, 0, 'N'); g.set(22, 0, 'C'); g.set(16, 0, 'B'); g.set(29, 0, 'P'); g.set(36, 0, 'L');
    g.set(45, 6, 'F'); g.set(11, 5, 'M'); g.set(40, 7, 'D'); g.set(2, 10, 'Q');
    g.set(12, 19, 'A'); g.set(34, 19, 'E'); g.set(44, 24, 'S'); g.set(24, 24, 'R'); g.set(5, 25, '1'); g.set(42, 14, 'G');
    var rows = g.rows();

    YN.defWorld({
      id: 'W002', name: 'Station of the Missing Hours', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'station', amb: { type: 'hum', vol: 0.05 }, bg: '#0a0a10',
      look: { floor: { p: 'tile', c: ['#c8c4b8', '#a09c90'] }, floor2: { p: 'flat', c: ['#d8b838', '#c0a030'] }, wall: { p: 'flat', c: ['#2a2622', '#201c18'], topColor: '#262220' }, wallface: { p: 'panel', c: ['#d8d0bc', '#bab29c', '#8a8470'], skirt: '#4a3e30' }, rail: { p: 'rails', c: ['#3a342c', '#9a9aa0'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#8a8a90'] } },
      tall: { '^': { look: 'pillar', opt: { c: ['#b8b0a0'] } }, '{': { look: 'bench', opt: { c: ['#6a4a30'] } }, '}': { look: 'trash' }, 'f': { look: 'fence', opt: { c: ['#8a8a90'] } } },
      map: rows,
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'NEXUS', arrive: 'doorB', look: 'ndoor', lookOpt: { c: ['#6a5a3a', '#f8f0e0'], sym: 'clock' }, animated: true, essential: true },
        C: { id: 'clock', type: 'anchor', floor: '#', look: 'wallclock', lookOpt: { hour: 11.9, min: 71 }, lines: ['The clock says 23:71. The minute hand has gone round more than once.', 'It moves on when nobody is looking.'], cycle: true },
        B: { id: 'board', type: 'sign', floor: '#', look: 'board', lookOpt: { lines: ['23:71 ...  0', '00:11 ...  0', '--:-- ...  B'] }, lines: ['She wears a platform guard’s cap and reads a board that is no longer there.', { t: 'Departures. 23:71, platform zero, delayed. 00:11, platform zero, delayed.', lang: 'en' }, { t: 'The last line has no time. It goes down under the board: platform B, the stairs.', lang: 'en' }] },
        P: { id: 'poster', type: 'sign', floor: '#', look: 'poster', lookOpt: { c: ['#2a3a6a', '#e8c040'] }, lines: [{ t: 'Lost property. Dial 2371.', lang: 'en' }, { t: 'I circled the numbers twice in pen, so I would remember what I had lost.', lang: 'en' }] },
        L: { id: 'lost', type: 'decor', floor: '#', look: 'window', lookOpt: { night: true }, lines: ['The lost property office. Closed. Behind the glass: umbrellas, a child’s shoe, a suitcase marked “J.”.'], use: [{ if: { not: { flag: 'got:ticketstub' } }, set: { 'got:ticketstub': true }, item: { ticketstub: 1 }, msg: 'Under the glass, a ticket stub has slid all the way out to you.' }] },
        F: { id: 'staff', type: 'door', floor: '#', to: 'W007', look: 'door', lookOpt: { style: 'metal', c: ['#5a5a60'], symbol: 'P' }, label: 'STAFF', exitDir: 'left' },
        M: { id: 'machine', type: 'decor', look: 'ticketmachine', lookOpt: { broken: true }, lines: ['The ticket machine is switched off. A label: “OUT OF ORDER”.'] },
        D: { type: 'spawn' }, Q: { type: 'spawn' }, G: { type: 'spawn' },
        T: { id: 'gate1', type: 'decor', floor: '.', look: 'turnstile', solid: true, block: { unless: { effect: 'E08' } }, lines: [{ if: { effect: 'E08' }, t: 'The turnstile eats the ticket and gives it straight back.' }, { t: 'The turnstile won’t turn. A slot is waiting for something.' }] },
        U: { id: 'gate2', type: 'decor', floor: '.', look: 'turnstile', solid: false, block: { unless: { effect: 'E08' } } },
        V: { id: 'gate3', type: 'decor', floor: '.', look: 'turnstile', solid: false, block: { unless: { effect: 'E08' } } },
        W: { id: 'gate4', type: 'decor', floor: '.', look: 'turnstile', solid: false, block: { unless: { effect: 'E08' } } },
        A: { id: 'trainA', type: 'train', floor: 'r', to: 'W022', look: 'train', lookOpt: { c: ['#5a6a7a', '#d8c040'] }, cond: { remainingMod: { every: 120, under: 45 } }, lock: { unless: { effect: 'E08' }, text: 'The train doors open, then close again in front of you. Not without a ticket.' }, appearSfx: 'train_arrive', label: 'platform A train', essential: true },
        E: { id: 'trainE', type: 'train', floor: 'r', to: 'W033', look: 'train', lookOpt: { c: ['#d8dce8', '#40a0e0'] }, cond: { remainingMod: { every: 150, under: 50 } }, lock: { unless: { effect: 'E08' }, text: 'A white train, silent. 감사합니다 lights up on the door, then 표가 필요합니다, next to a drawing of a ticket.' }, appearSfx: 'train_arrive', label: 'white train on platform B', essential: true },
        S: { id: 'down', type: 'stairs', floor: '.', to: 'W035', look: 'escalator', lookOpt: { down: true }, solid: true, lock: { unless: { effect: 'E08' }, text: 'The escalator goes down on its own. A little gate: “TICKET”.' }, label: 'escalator going down', essential: true },
        R: { id: 'repair', type: 'decor', look: 'newsstand', lines: ['A kiosk. Today’s newspapers are dated at an hour that does not exist.', 'A headline: “ALL IS WELL”. Underneath, smaller: “all is well”.'], cycle: true },
        '1': { id: 'cookie', type: 'cookie', look: 'cookie', cond: { not: { temp: { stationCookie: true } } }, use: [{ temp: { stationCookie: true } }] }
      },
      place: [
        /* âmes : les heures où elle n’est pas là, et un quai de 1951 */
        { id: 'soulQuay', type: 'soul', at: [30, 23], lines: ['She elbows her way through a crowd that is not there.', { t: '밀지 마십시오! 아이가 있습니다, 아이가!', lang: 'ko-n', tr: 'Don’t push! There’s a child, a child!' }, { t: '두 렬차 다 남쪽으로 간다고 했습니다. 하나는 아니었습니다.', lang: 'ko-n', tr: 'They told us both trains were going south. One of them was not.' }] },
        { id: 'soulHours', type: 'soul', at: [22, 2], lines: [{ t: 'This station opens at nine at night and closes at seven in the morning.', lang: 'en' }, { t: 'Nobody has ever seen it closed. Someone always comes home too tired to look.', lang: 'en' }] },
        { id: 'soulLeaving', type: 'soul', at: [8, 8], lines: [{ t: '소라야, 엄마 일 다녀올게. 불 끄고 자.', lang: 'ko-s', tr: 'Sora, Mum’s off to work. Turn the light off and go to sleep.' }, 'Somewhere, a lamp stays on all the same.'] },
        { id: 'soulKnock', type: 'soul', at: [16, 8], lines: [{ t: 'The machine is not broken. It is shy.', lang: 'en' }, { t: 'Knock three times, quickly, the way you knock at a door you are afraid of.', lang: 'en' }] },
        { id: 'soulShoe', type: 'soul', at: [36, 2], lines: [{ t: 'Someone handed in a child’s left shoe. No name, no date.', lang: 'en' }, { t: 'We keep it on the top shelf, where it can see the trains.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N002', at: [12, 6] }, { id: 'N030', at: 'D' }, { id: 'N031', at: 'Q' }, { id: 'N032', at: 'G' }, { id: 'N007', at: [26, 15], appear: { dreamChance: { p: 0.45, key: 'toc2' } } }, { id: 'N033', at: [20, 23] }],
      mech: [{ type: 'knock', mark: 'machine', n: 3, within: 2.2, give: 'E08', firstLine: 'The ticket machine crackles.', winLines: ['On the third knock, the machine spits out a warm ticket. The date has been rubbed out.'], doneLine: 'The machine only gives once.' }],
      radio: { '23.71': { line: { t: '“… the twenty-three seventy-one train… is running slightly late…”', lang: 'en' } } },
      info: {
        summary: 'A night station with impossible clocks: a great hall, turnstiles, two platforms and two tracks, an escalator going down.',
        art: 'Pixel art, beige tiles, wood panelling, cold neon; trains pull in now and then.',
        rules: ['The turnstiles, the trains and the escalator require the Ticket.', 'The platform A train leaves every two dream minutes (45 s at the platform); the platform B train every two and a half minutes.'],
        time: ['The trains don’t wait: they follow the countdown.', 'In the real evening (11 p.m.–midnight), Mr. Ahn talks about another train.'],
        secrets: ['The lost property office gives a ticket stub (23:71).', 'The number on the poster answers the Telephone.'],
        role: 'Crossroads world of the core: The Endless Carriage (W022), The Glass Tower (W033), Happiness Station (W035), The Sleep Factory (W007).',
        lore: 'The hours when the mother is not there. An old man waits for a train that only comes if someone makes it come.'
      }
    });
  })();

  /* ======================= W003 — VILLE AU CRÉPUSCULE ======================= */
  (function () {
    var g = K.grid(60, 40, '.');
    g.border('#');
    // pâtés de maisons
    [[3, 3, 12, 8], [19, 3, 10, 8], [33, 3, 9, 8], [46, 3, 11, 8], [3, 15, 9, 9], [16, 15, 12, 9], [32, 15, 10, 9], [46, 15, 11, 9], [3, 28, 14, 8], [21, 28, 10, 8], [35, 28, 8, 8], [47, 28, 10, 8]].forEach(function (b) { g.rect(b[0], b[1], b[2], b[3], '%'); });
    // trottoirs (dalles) autour des pâtés
    for (var y = 1; y < 39; y++) for (var x = 1; x < 59; x++) if (g.at(x, y) === '.') { var near = false; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (g.at(x + dx, y + dy) === '%') near = true; if (near) g.set(x, y, ','); }
    // réverbères et décor
    [[2, 2], [17, 2], [31, 2], [44, 2], [2, 13], [30, 13], [57, 13], [15, 26], [45, 26], [2, 37], [33, 37], [57, 37]].forEach(function (p) { g.set(p[0], p[1], '^'); });
    [[13, 12], [42, 12], [19, 25], [52, 25], [33, 26]].forEach(function (p) { g.set(p[0], p[1], '{'); });
    [[29, 12], [43, 26]].forEach(function (p) { g.set(p[0], p[1], '}'); });
    // l'impasse des chats
    g.rect(28, 25, 3, 3, '.'); g.set(29, 25, ','); g.set(29, 27, 'Z');
    // portes et marques
    g.set(8, 11, 'N'); g.set(23, 11, 'H'); g.set(37, 11, 'Q'); g.set(51, 11, 'R'); g.set(7, 24, 'Y'); g.set(22, 24, 'L'); g.set(51, 24, 'M');
    g.set(10, 36, 'O'); g.set(39, 36, 'J');
    g.set(26, 13, 'G'); g.set(14, 26, 'C'); g.set(44, 13, 'S'); g.set(31, 38, 'P');
    g.set(29, 38, '1'); g.set(56, 38, '2');
    YN.defWorld({
      id: 'W003', name: 'Town at Dusk', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', outdoor: true,
      style: { view: 'top' }, music: 'dusk', amb: { type: 'city', vol: 0.05 },
      look: { floor: { p: 'asphalt', c: ['#4a4450'] }, floor2: { p: 'tile', c: ['#8a8078', '#6a6058'] }, wall: { p: 'brick', c: ['#7a5048', '#5a3a34', '#3a2420'] }, wall2: { p: 'brick', c: ['#6a5a6a', '#4a3a4a', '#2a2030'], topColor: '#3a2a3a' } },
      tall: K.TALL.city, bg: '#1a1424',
      darkAmount: 0.7,
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', floor: '%', to: 'NEXUS', arrive: 'doorC', look: 'ndoor', lookOpt: { c: ['#a0503a', '#f8f0e0'], sym: 'sun' }, animated: true, essential: true },
        H: { id: 'toHouses', type: 'door', floor: '%', to: 'W008', look: 'door', lookOpt: { style: 'wood', c: ['#6a4a3a'] }, essential: true },
        Q: { id: 'toDoors', type: 'door', floor: '%', to: 'W010', look: 'door', lookOpt: { style: 'metal', c: ['#4a5a6a'], symbol: '?' }, essential: true },
        R: { id: 'toArcade', type: 'door', floor: '%', to: 'W015', look: 'door', lookOpt: { style: 'glass', c: ['#c04090'], symbol: '★' }, essential: true },
        Y: { id: 'toMarket', type: 'door', floor: '%', to: 'W017', look: 'door', lookOpt: { style: 'glass', c: ['#40a060'], symbol: '24' }, essential: true },
        L: { id: 'toRoofs', type: 'door', floor: '%', to: 'W026', look: 'door', lookOpt: { style: 'metal', c: ['#5a5a5a'] }, label: 'service stairs' },
        M: { id: 'toBuilding', type: 'door', floor: '%', to: 'W038', look: 'door', lookOpt: { style: 'wood', c: ['#3a4a5a'], symbol: '107' }, essential: true },
        O: { id: 'toFair', type: 'door', floor: '%', to: 'W020', look: 'gate', lookOpt: { c: ['#8a3a3a'] }, label: 'the funfair' },
        J: { id: 'toCasino', type: 'door', floor: '%', to: 'W032', look: 'door', lookOpt: { style: 'glass', c: ['#d0a020'], symbol: '$' }, cond: { not: { phase: 'opening' } }, lockedText: 'A sign, unlit: “OPEN AFTER OPENING”.' },
        G: { id: 'grate', type: 'decor', look: 'drain', lines: [{ if: { phase: 'middle', noEffect: 'E06' }, t: 'The water rises in the grate. The umbrella rises with it, handle first.', do: [{ give: 'E06' }] }, { if: { noEffect: 'E06' }, t: 'A drain grate. A red umbrella is stuck inside, too far down for a hand.' }, { t: 'A drain grate. It breathes a little.' }] },
        C: { id: 'cats', type: 'decor', look: 'trash', lines: ['Bins. They smell of fish.'] },
        Z: { id: 'catspot', type: 'trigger', look: null, repeat: true, cond: { remainingLt: 240 }, do: [{ if: { noEffect: 'E19', temp: { catFollowed: true } }, lines: [{ t: 'At the end of the alley, the cats sit together in a circle. They make room for you.' }, { t: 'When you stand up again, you walk on tiptoe.' }], give: 'E19' }] },
        S: { id: 'sign', type: 'sign', look: 'sign', lines: [{ t: 'Street of Hours.', lang: 'en' }, { t: '{{the town sleeps}}' }, { t: 'I lived at number seven. My mother came home when the street lamps went out.', lang: 'en' }] },
        P: { type: 'spawn' },
        '1': { id: 'cookie', type: 'cookie', look: 'cookie', cond: { not: { temp: { duskCookie: true } } }, use: [{ temp: { duskCookie: true } }] },
        '2': { id: 'phonebooth', type: 'decor', look: 'payphone', lines: ['A phone box. The receiver hangs at the end of its cord, swaying a little.', 'Carved into the shelf: 0 — Mum.'], cycle: true }
      },
      mech: [{ type: 'weatherWhen', cond: { phase: 'middle' }, weather: { rain: true } }],
      place: [
        /* âmes : la ville à l’heure où personne n’attend */
        { id: 'soulKey', type: 'soul', at: 'random-any', lines: [{ t: 'At this hour every child in town wears a key on a string around the neck.', lang: 'en' }, { t: 'The television says hello first. It is polite like that.', lang: 'en' }] },
        { id: 'soulBooth', type: 'soul', at: [55, 37], lines: [{ t: 'The booth on the corner only takes one number. Zero.', lang: 'en' }, { t: 'It rings at the hospital. Someone always says she is with a patient.', lang: 'en' }] },
        { id: 'soulDrain', type: 'soul', at: [24, 13], lines: [{ t: 'I lost a red umbrella down that drain. It is still there, waiting for the rain to lift it.', lang: 'en' }] },
        { id: 'soulCat', type: 'soul', at: [27, 26], lines: [{ t: 'Do not follow the black cat while the sky is still orange. He hates being early.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N022', at: [26, 26] }, { id: 'N034', at: [5, 12] }, { id: 'N035', at: [40, 25] }, { id: 'N036', at: [53, 37] }, { id: 'N037', at: [18, 37] }, { id: 'N007', at: [36, 13], appear: { dreamChance: { p: 0.5, key: 'toc3' } } }],
      info: {
        summary: 'A brick town under an orange sky that never finishes falling: twelve blocks of houses, street lamps, a phone box, a dead end.',
        art: 'Twilight pixel art, pink bricks, mauve asphalt, street lamps; rain in the middle of the dream.',
        rules: ['In the middle phase of the dream (70% → 40% remaining), it rains.', 'The casino only opens after the opening phase.', 'The black cat only leads to the other cats below 4:00.'],
        time: ['Mid-dream rain.', 'The cats gather below 4:00.'],
        secrets: ['The phone box: “0 — Mum”.'],
        role: 'Urban crossroads: residential neighbourhood, identical doors, arcade, supermarket, rooftops, apartment block, funfair, casino.',
        lore: 'The town on the way home from school, at the hour when nobody is waiting.'
      }
    });
  })();

  /* ======================= W004 — ÉCOLE VIDE ======================= */
  (function () {
    var g = K.grid(52, 34, ' ');
    g.box(0, 0, 52, 34, '#', ',');                 // couloir (carrelage)
    // salles de classe en haut
    g.box(1, 1, 16, 12, '#', '.'); g.box(18, 1, 16, 12, '#', '.'); g.box(35, 1, 16, 12, '#', '.');
    g.set(8, 12, '.'); g.set(25, 12, '.'); g.set(42, 12, '.');
    [6, 23, 40].forEach(function (x0) { g.hline(x0, x0 + 4, 1, 'b'); });
    // pupitres
    for (var c = 0; c < 3; c++) for (var r = 0; r < 3; r++) for (var k = 0; k < 4; k++) g.set(3 + c * 17 + k * 3, 5 + r * 2, '{');
    // casiers dans le couloir
    for (var x = 2; x < 50; x += 3) if ([8, 25, 42].indexOf(x) < 0) g.set(x, 14, '^');
    // bas : bibliothèque, escalier, toilettes, porte de la cour
    g.box(1, 21, 18, 12, '#', '.'); g.set(10, 21, '.');
    g.box(34, 21, 17, 12, '#', ':'); g.set(42, 21, ':');
    g.rect(22, 26, 8, 6, ',');
    // marques
    g.set(25, 33, 'N'); g.set(8, 1, 'K'); g.set(25, 1, 'L'); g.set(42, 1, 'M');
    g.set(15, 9, 'D'); g.set(5, 26, 'B'); g.set(10, 31, 'R'); g.set(47, 25, 'P'); g.set(42, 31, 'T');
    g.set(51, 17, 'O'); g.set(0, 17, 'Q'); g.set(30, 18, 'S'); g.set(26, 28, 'C'); g.set(44, 9, '1'); g.set(36, 27, 'H');
    YN.defWorld({
      id: 'W004', name: 'Empty School', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1',
      style: { view: 'top', tallWalls: true }, music: 'school', amb: { type: 'hum', vol: 0.04 },
      look: K.LOOK.school, tall: { '^': { look: 'locker', opt: { c: ['#5a7a9a'] } }, '{': { look: 'schooldesk' } }, bg: '#0a0a0c',
      variants: { sunday: { cond: { weekday: 0 }, place: [{ id: 'closed', type: 'sign', at: [26, 30], look: 'sign', lines: [{ t: 'Closed on Sundays.', lang: 'en' }, { t: 'And yet the door was never locked. Not once. Somebody should have locked it.', lang: 'en' }] }] } },
      map: g.rows(),
      boards: { '8,1': { to: 'W014' }, '25,1': { to: 'W030' } },
      marks: {
        N: { id: 'back', type: 'door', floor: '#', to: 'NEXUS', arrive: 'doorD', look: 'ndoor', lookOpt: { c: ['#4a5a7a', '#f8f0e0'], sym: 'school' }, animated: true, essential: true, exitDir: 'up' },
        K: { id: 'board1', type: 'sign', floor: 'b', look: 'blackboard', lookOpt: { text: 'THE MUTE GIRL' }, cond: { noEffect: 'E09' }, lines: [{ t: 'On the board, in chalk: THE MUTE GIRL.', lang: 'en' }, { t: 'I tried to wipe it off. It would not come off. I stopped before the bell.', lang: 'en' }] },
        L: { id: 'board2', type: 'sign', floor: 'b', look: 'blackboard', lookOpt: { text: '3 + 4 = 7' }, cond: { noEffect: 'E09' }, lines: [{ t: 'Three plus four makes seven. I circled the seven.', lang: 'en' }, { t: 'Underneath I wrote: cranes. She needs seven of them. Don’t tell the others.', lang: 'en' }] },
        M: { id: 'board3', type: 'sign', floor: 'b', look: 'blackboard', lookOpt: { text: '' }, lines: [{ t: '{{the door to outside}}' }, { t: 'The last day, someone wrote this on the board. Nobody could read it. Everybody copied it anyway.', lang: 'en' }] },
        D: { id: 'desk', type: 'decor', look: 'schooldesk', lookOpt: { carved: true }, lines: [{ if: { noEffect: 'E09' }, t: 'A desk scratched with a compass point: THE MUTE GIRL. She sits down. The wood is warm. A piece of chalk rolls and falls.', do: [{ give: 'E09' }] }, { t: 'THE MUTE GIRL. The letters are deep. Someone pressed hard, for a long time.' }] },
        B: { id: 'shelf', type: 'decor', look: 'bookcase', lines: ['Textbooks. In one of them, a scratched-out name label: “S_ra”.', 'A geography book open at Korea. A dotted line cuts it in two.'], cycle: true },
        R: { id: 'toLibrary', type: 'door', floor: '#', to: 'W018', look: 'door', lookOpt: { style: 'wood', c: ['#6a4a2a'], symbol: '¶' }, essential: true, exitDir: 'up' },
        P: { id: 'toilets', type: 'door', to: 'W096', look: 'stall', lock: { unless: { met: 'N009' }, text: 'The girls’ toilets. Cubicle 3 is locked from the inside. Someone is folding paper.' }, label: 'cubicle 3' },
        T: { id: 'toPool', type: 'stairs', to: 'W016', look: 'stairsdown', solid: false, essential: true, label: 'stairs to the pool' },
        O: { id: 'toYard', type: 'path', floor: ',', to: 'W030', essential: true },
        Q: { id: 'toGym', type: 'path', floor: ',', to: 'W018', arrive: 'side' },
        S: { id: 'speaker', type: 'decor', look: 'loudspeaker', lines: [{ t: '… would the mute girl please come to the…', lang: 'en' }, 'The loudspeaker: the bell, very far away, late.'], cycle: true },
        C: { id: 'lostbox', type: 'decor', look: 'toybox', lines: ['The lost property box: a pencil case, a glove, a flattened paper crane.'] },
        H: { id: 'mirrorWC', type: 'mirror', look: 'mirror', lines: [{ if: { dark: true }, t: 'In the mirror there is nobody. Not her, not the door behind her.' }, { t: 'The toilet mirror. In it she looks like someone who is waiting.' }] },
        '1': { id: 'cookie', type: 'cookie', look: 'cookie', cond: { not: { temp: { schoolCookie: true } } }, use: [{ temp: { schoolCookie: true } }] }
      },
      place: [{ id: 'crane5', type: 'item', at: [46, 30], look: 'crane', item: { crane: 1 }, once: true, solid: false }, { id: 'crane6', type: 'item', at: [30, 4], look: 'crane', item: { crane: 1 }, once: true, solid: false }, { id: 'crane7', type: 'item', at: [3, 16], look: 'crane', item: { crane: 1 }, once: true, solid: false },
        /* âmes : l’école où on l’appelait « la muette » */
        { id: 'soulBystander', type: 'soul', at: [10, 3], lines: [{ t: 'I saw who wrote it. I did not write it. I did not wipe it off either.', lang: 'en' }, { t: 'Is that the same thing? Nobody ever told me.', lang: 'en' }] },
        { id: 'soulMute', type: 'soul', at: [13, 10], lines: [{ t: 'She was not mute. She was keeping her words for someone who was not there any more.', lang: 'en' }] },
        { id: 'soulNurse', type: 'soul', at: [30, 16], lines: ['She wears a white coat and carries a file under her arm.', { t: 'Falls asleep in class. Sleeps with the light on. Mother works nights.', lang: 'en' }, { t: 'I wrote it down, put it in a file, and put the file in a drawer.', lang: 'en' }] },
        { id: 'soulMeeting', type: 'soul', at: [24, 30], lines: [{ t: '죄송합니다, 선생님. 제가 밤에 일해서요… 상담은 다음에 꼭 올게요.', lang: 'ko-s', tr: 'I’m sorry, Miss. I work nights… I’ll come to the meeting next time, I promise.' }, { t: '우리 소라는 괜찮아요. 원래 조용한 아이예요.', lang: 'ko-s', tr: 'My Sora is fine. She’s always been a quiet child, that’s all.' }] }
      ],
      npcs: [{ id: 'N038', at: [12, 17] }, { id: 'N039', at: [40, 17] }, { id: 'N040', at: [27, 7] }, { id: 'N041', at: [6, 30] }],
      info: {
        summary: 'A neighbourhood school at night: three classrooms, a long corridor of lockers, the library, the toilets, the stairs to the pool, the door to the playground.',
        art: 'Pixel art, cream panelling, parquet, corridor tiles; chalk on the blackboards.',
        rules: ['With the Chalk, a blackboard becomes a drawn door.', 'On a real Sunday, a “CLOSED” sign.'],
        time: ['Real Sunday: a closing sign (the school stays open).'],
        secrets: ['“S_ra” on a textbook.', 'The board in the third classroom is written in signs.'],
        role: 'Gives the Chalk. Leads to The Charcoal World (W014), The Playground (W030), The Empty Pool (W016), The Library of Blank Books (W018).',
        lore: 'The school where they called her “the mute girl”. Nobody is cruel there, at night. That is worse.'
      }
    });
  })();

  /* ======================= W005 — MONDE MONO ======================= */
  (function () {
    var g = K.grid(56, 42, '.');
    var r = YN.rng.make(55);
    // grandes formes noires sur blanc, damiers, chemins
    g.ellipse(14, 12, 7, 5, ','); g.ellipse(40, 28, 9, 6, ','); g.rect(30, 6, 14, 8, ':'); g.rect(6, 26, 12, 10, ':');
    for (var i = 0; i < 26; i++) { var x = r.int(2, 53), y = r.int(2, 39); if (g.at(x, y) === '.') g.set(x, y, r.chance(0.5) ? 'o' : '^'); }
    g.hline(2, 53, 20, ','); g.vline(28, 2, 39, ',');
    g.set(28, 20, 'N'); g.set(54, 20, 'D'); g.set(28, 40, 'H'); g.set(14, 12, 'E'); g.set(40, 28, 'U'); g.set(10, 33, 'S'); g.set(37, 10, 'M'); g.set(3, 3, '1'); g.set(52, 38, 'X');
    YN.defWorld({
      id: 'W005', name: 'Mono World', depth: 1, tier: 'easy', core: true, status: 'implemented', region: 'P1', wrap: true,
      style: { view: 'top', renderer: 'mono', cliffH: 0 }, music: 'mono', amb: null, bg: '#ffffff',
      look: { floor: { p: 'flat', c: ['#f2f2f2', '#e6e6e6'] }, floor2: { p: 'flat', c: ['#141414', '#0c0c0c'] }, floor3: { p: 'checker', c: ['#f0f0f0', '#101010'] }, rock: { p: 'rock', c: ['#202020', '#101010', '#404040'] } },
      tall: { '^': { look: 'pillar', opt: { c: ['#101010'] } }, 'o': { look: 'rock', opt: { c: ['#1a1a1a'] } } },
      variants: { dark: { look: { floor: { p: 'flat', c: ['#0c0c0c', '#141414'] }, floor2: { p: 'flat', c: ['#f0f0f0', '#e0e0e0'] } } } },
      map: g.rows(),
      marks: {
        N: { id: 'back', type: 'door', to: 'NEXUS', arrive: 'doorE', look: 'ndoor', lookOpt: { c: ['#505050', '#f8f0e0'], sym: 'mono' }, animated: true, essential: true },
        D: { id: 'toDesert', type: 'door', to: 'W011', look: 'door', lookOpt: { style: 'metal', c: ['#e8e8e8'] }, essential: true },
        H: { id: 'toHospital', type: 'door', to: 'W027', look: 'door', lookOpt: { style: 'glass', c: ['#f0f0f0'], symbol: '+' }, essential: true },
        E: { id: 'eye', type: 'decor', look: 'bigeye', animated: true, lines: ['An eye, lying on the ground. It blinks when you blink.', 'It watches you when you are not watching it.'], cycle: true },
        U: { id: 'mouth', type: 'decor', look: 'mouth', lines: ['A mouth drawn on the ground, closed. When you speak, it shapes the same words, without a sound.'] },
        S: { id: 'stone', type: 'inscription', look: 'glyphstone', glyphs: 'here all is black or white', lines: [{ t: 'I carved it straight. There is no grey in the cuts.', lang: 'en' }] },
        M: { id: 'piano', type: 'decor', look: 'piano', lines: ['A piano. All the keys are white. Even the black ones.'], use: [{ sfx: 'chime' }] },
        X: { id: 'exitX', type: 'door', to: 'W042', look: 'hole', cond: { all: [{ dark: true }, { effectsCount: 12 }] }, label: 'white hole in the dark' },
        '1': { id: 'cookie', type: 'cookie', look: 'cookie', cond: { not: { temp: { monoCookie: true } } }, use: [{ temp: { monoCookie: true } }] }
      },
      listen: true,
      place: [
        /* âmes : ce qu’on dit aux enfants, bien ou mal */
        { id: 'soulGrey', type: 'soul', at: 'random-any', lines: [{ t: 'Here you are good or you are bad. I was grey once. They painted me over.', lang: 'en' }] },
        { id: 'soulWords', type: 'soul', at: 'random-any', lines: [{ t: 'Say nothing and you stay white.', lang: 'en' }, { t: 'Every word you say gets checked for black.', lang: 'en' }] },
        { id: 'soulLamp', type: 'soul', at: 'random-any', lines: [{ t: 'When the lamp goes out, the good things turn dark first. Remember which ones they were.', lang: 'en' }, { t: 'In the dark, the only white thing left is a way out.', lang: 'en' }] }
      ],
      npcs: [{ id: 'N042', at: [20, 30] }, { id: 'N043', at: [45, 12] }, { id: 'N044', at: [8, 18] }],
      info: {
        summary: 'A world without grey that loops back on itself: black shapes on white, an eye on the ground, a drawn mouth, a piano.',
        art: 'Pure black and white, maximum contrast; with the light off, the colours swap.',
        rules: ['The world loops in both directions.', 'Light off: white becomes black.'],
        secrets: ['In the dark, with at least 12 effects, a white hole leads further on (W042).'],
        role: 'Leads to Desert of Telephones (W011) and The Vigil Hospital (W027).',
        lore: 'What children are told: it is good or it is bad. For them there is no grey.'
      }
    });
  })();
})(typeof window !== 'undefined' ? window : globalThis);
