/* =========================================================================
 *  MONDES SECRETS (5/8) — W121 à W140
 *  Le laboratoire et ses dépendances ; le rêve changeant ; la tour de
 *  bureaux (le Grand Rire adulte, le toit) ; le Jardin de nuit et ce qu'il
 *  ouvre : la serre des absents, la poste des lettres impossibles, la ville
 *  de Nour ; le 44e étage.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function soul(lines) { return { type: 'soul', at: 'random-any', lines: lines }; }
  var LAB = { floor: { p: 'tile', c: ['#e0e8ec', '#b0c0c8'] }, wall: { p: 'flat', c: ['#1a2228', '#121a20'], topColor: '#1a2228' }, wallface: { p: 'panel', c: ['#d8e4e8', '#b0c4cc', '#7a909a'], skirt: '#2a7aa0' }, glass: { p: 'glass', c: ['#80b0c8', '#e0f4fc', '#a0c8dc'] } };

  /* W121 — La Salle d'observation */
  S({ id: 'W121', name: 'The Observation Room', depth: 3, tier: 'mid', back: 'W120', map: (function () { var g = K.grid(30, 18, ' '); g.box(0, 0, 30, 18, '#', '.'); g.hline(1, 28, 6, 'g'); g.set(2, 6, '.'); return g.rows(); })(),
    look: LAB, style: { tallWalls: true }, music: 'observation', amb: { type: 'beep', vol: 0.05 }, dark: 0.55,
    doors: [{ to: 'W126', look: 'door', opt: { style: 'metal', symbol: 'Z' }, label: 'dormitory' }],
    place: [{ type: 'decor', at: [14, 5], look: 'window', floor: 'g', lines: [{ t: function () { var S = YN.save.perm; return 'Behind the one-way glass: a child’s bedroom, yours. A girl is sleeping. On a screen beside it: “dreams recorded: ' + (S ? S.stats.dreams : 0) + '”. '; } }] },
      { type: 'decor', at: [6, 10], look: 'monitor', animated: true, lines: [{ t: function () { var n = YN.save.perm ? YN.save.perm.effects.length : 0; return 'A monitor: “dream objects kept: ' + n + '”. A note: “she keeps them in nests”. '; } }] },
      { type: 'decor', at: [22, 10], look: 'monitor', animated: true, lines: ['A monitor shows curves. When you move, they move.'] },
      soul([EN('We watch a child sleep and we call it taking care of her.')]),
      soul([EN('The glass only looks one way. She learned that at home first.')]),
      soul(['She presses her forehead to the glass, from the inside.', EN('The blue pills give twenty minutes. Twenty minutes goes a long way down.')]),
      soul([EN('Nobody in this room has ever said her name out loud. Only the letter.')])],
    npcs: [{ name: 'The Observer', look: H({ t: 'adult', head: 'eye', body: 'uniform', c: ['#e0ecf0', '#c0d0d8', '#e0c0a0', '#4060a0'] }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('The subject dreams for ten minutes. Always ten minutes.'), EN('Except with the blue pills: twenty.')] }, { seq: [EN('She does not speak when she wakes.'), EN('She speaks while she sleeps.')] }] }],
    info: { summary: 'A room behind one-way glass, from which a sleeping child’s bedroom is watched.', lore: 'Knowing you are watched while you sleep.' } });

  /* W122 — Les Archives des sujets */
  S({ id: 'W122', name: 'The Subject Archives', depth: 3, tier: 'mid', back: 'W120', map: (function () { var g = K.grid(32, 22, ' '); g.box(0, 0, 32, 22, '#', '.'); for (var y = 4; y < 19; y += 4) g.hline(3, 28, y, '%'); for (var y2 = 4; y2 < 19; y2 += 4) g.set(16, y2, '.'); return g.rows(); })(),
    look: Object.assign({}, LAB, { wall2: { p: 'metal', c: ['#8a9098', '#6a7078', '#4a5058'], ownFace: true } }), style: { tallWalls: true }, music: 'subjects',
    doors: [{ to: 'W123', look: 'door', opt: { style: 'metal', symbol: 'REC' }, label: 'recordings' }],
    decor: [{ look: 'locker', n: 6, opt: { c: ['#a0b0b8'] }, lines: ['File “Subject S.”: “Age 12. Mute since 2023. Abnormally long dreams. Mother: nursing assistant, night shift.”', 'File “Subject M.”: “Age 9, Seoul, 1989. Waiting for her father.” The file has no business being here.', 'File “Subject J.”: empty, except for a joke with no ending.', 'File “Subject O.”: “1942–2023”. A single line: “sang”.'] }],
    place: [soul([EN('File M. does not belong here. Nineteen eighty-nine does not belong here either.')]),
      soul([EN('File O. says only: she sang. Four words would have been too many.')]),
      soul(['She leafs through an empty file, very slowly.', EN('File J. holds a joke with no ending. Filed under unfinished.')]),
      soul([EN('A file is what is left of someone when the someone is not asked.')])],
    npcs: [{ name: 'The Archivist in a Lab Coat', look: H({ t: 'old', body: 'uniform', c: ['#e0ecf0', '#c0d0d8', '#e0c0a0', '#c8c8c8'], acc: 'clipboard' }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('Subjects must not read their own file. But you will not read.'), EN('You are only looking.')] }] }],
    info: { summary: 'Metal cabinets full of “subject” files.', lore: 'Subject S.: the first name is never written out in full.' } });

  /* W123 — La Chambre d'enregistrement */
  S({ id: 'W123', name: 'The Recording Room', depth: 4, tier: 'hard', back: 'W122', map: K.hall(22, 14, '#', '.'),
    look: Object.assign({}, LAB, { floor: { p: 'carpet', c: ['#2a2a3a', '#1a1a2a'] } }), style: { tallWalls: true }, music: 'recording', dark: 0.6,
    doors: [{ to: 'W124', look: 'door', opt: { style: 'metal', symbol: '⚙' }, label: 'the machine' }],
    decor: [{ look: 'crt', n: 4, animated: true, lines: [{ t: function () { var v = YN.save.perm ? Object.keys(YN.save.perm.visits || {}).length : 0; return 'A tape is turning: “Dream no. ' + (YN.save.perm ? YN.save.perm.stats.dreams : 0) + '. Places passed through: ' + v + '.” You can hear your own breathing.'; } }, 'A tape: a garden, a station, a school. Then places you have not seen yet.', 'An erased tape. All that is left is a voice saying “all is well” on a loop.'] }],
    place: [soul([EN('Tape nine was a grandmother humming. We recorded over it. Twice.')]),
      soul(['She listens to something that is still turning.', EN('Anything that repeats all is well in a loop was taped over something else.')]),
      soul([EN('There is a tape of places she has not visited yet. We did not record that one.')])],
    npcs: [{ name: 'The Magnetic Tape', look: { t: 'worm', c: ['#3a2a1a'], h: 10 }, behavior: 'wander', radius: 4, speed: 0.8, lines: ['A strip of cassette tape crawling along, mumbling your dreams backwards.'] }],
    info: { summary: 'A studio where tapes record the subject’s dreams.', lore: 'Dreams counted by other people.' } });

  /* W124 — La Machine à rêves */
  S({ id: 'W124', name: 'The Dream Machine', depth: 4, tier: 'hard', back: 'W123',
    map: (function () { var g = K.grid(36, 26, ' '); g.box(0, 0, 36, 26, '#', '.'); g.rect(10, 6, 16, 12, 'z'); for (var x = 4; x < 32; x += 4) { g.set(x, 3, '}'); g.set(x, 22, '}'); } return g.rows(); })(),
    look: { floor: { p: 'metal', c: ['#4a4e56'] }, conveyor: { p: 'hstripes', c: ['#2a2a2e', '#5a5a60'] }, wall: { p: 'flat', c: ['#14161a', '#0e1014'], topColor: '#14161a' }, wallface: { p: 'metal', c: ['#5a5e66'], skirt: '#c03030' } },
    tall: { '}': { look: 'server', opt: { c: ['#3a3e46'] } } }, style: { tallWalls: true }, music: 'dreammachine', amb: { type: 'machine', vol: 0.1 }, conveyorDir: 'up', extra: { conveyorDir: 'up' },
    doors: [{ to: 'W125', look: 'door', opt: { style: 'metal', symbol: '∿' }, label: 'the way out of the machine' }],
    decor: [{ look: 'lever', n: 3, lines: ['A lever: “DREAM — ON / OFF”. Stuck on ON.', 'A lever: “DURATION: 10:00”. It does not move.'] }],
    place: [soul([EN('Nobody builds dreams. We read the meter and we sign.')]),
      soul(['She rests her hand on a lever that no longer moves.', EN('The lever says ten minutes. The child inside says years.')]),
      soul([EN('The belt only goes up. Everything that falls off goes back to the beginning.')])],
    npcs: [{ name: 'The Sleeping Mechanic', look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#6a5a3a', '#4a3a2a', '#d8b898', '#e8d040'], eyes: 'closed' }), behavior: 'static', solid: true, lang: 'en', lines: ['He sleeps against the machine. It purrs in time with his breathing.', { seq: [EN('Nobody makes the dreams. They come out on their own.'), EN('We only measure them.')] }] }],
    info: { summary: 'A machine room where a central belt runs upwards, surrounded by racks of computers.', lore: 'Believing that a machine makes the dreams.' } });

  /* W125 — La Ville qui se remplace (rêve changeant) */
  S({ id: 'W125', name: 'The City That Replaces Itself', depth: 4, tier: 'hard', back: 'W124', outdoor: true,
    gen: { type: 'city', w: 48, h: 36, shifting: true, opts: { block: 7 } }, look: 'street', tall: K.TALL.city, music: 'shifting',
    extra: { styles: [{ renderer: 'hd' }, { renderer: 'charcoal' }, { renderer: 'watercolor' }, { renderer: 'mono' }, { renderer: 'psychedelic' }, { renderer: 'sepia' }],
      lookShift: [{}, { floor: { p: 'paper', c: ['#ece8e0'] }, wall: { p: 'flat', c: ['#2a2a2a', '#1a1a1a'] } }, { floor: { p: 'grass', c: ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#3a6a2a'] }, wall: { p: 'hedge', c: ['#2a5a2a', '#1a4a1a', '#3a6a3a', '#0a3a0a'] } }, { floor: { p: 'flat', c: ['#f0f0f0', '#e0e0e0'] }, wall: { p: 'flat', c: ['#101010', '#080808'] } }, { floor: { p: 'flesh', c: ['#6a2030', '#802838', '#401018'] } }, { floor: { p: 'tile', c: ['#a09080', '#7a6a5a'] }, wall: { p: 'brick', c: ['#8a6a5a', '#6a4a3a', '#4a2a1a'] } }] },
    mech: [{ type: 'shifting', every: 40 }],
    doors: [{ to: 'W127', look: 'door', opt: { style: 'metal', c: ['#202020'], symbol: '0' }, label: 'a corridor', cond: { fn: function () { return (YN.save.temp('shift_W125') || 0) >= 3; } }, locked: 'The door does not exist yet. The city has to replace itself a little more.' }, { to: 'W160', look: 'hole', label: 'a hole that always stays in the same place' }],
    place: [soul([EN('Tell me a place twice and I will build it wrong both times.')]),
      soul(['She changes colour when you look at her.', EN('Yesterday this was a shared garden. Somebody kept watering the same dry square.')]),
      soul([EN('A door remembers better than a city. Wait for the third change.')])],
    npcs: [{ name: 'The Resident Who Remembers', look: H({ t: 'old', hairStyle: 'bun', body: 'dress', c: ['#7a6a8a', '#5a4a6a', '#e0c8b0', '#d8d8d8'] }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('Yesterday it was a forest. The day before, a blank page.'), EN('The city replaces itself with whatever you remember.')] }, { seq: [EN('Wait for three changes.'), EN('A door will appear. It remembers too.')] }] }],
    info: { summary: 'A city that rearranges itself and changes style every 40 seconds of dream.', rules: ['Shifting dream: the map and the style renew every 40 s.', 'After three changes, a door to Corridor 0 (W127).'], lore: 'Childhood places that blend together when you tell them.' } });

  /* W126 — Le Dortoir des enfants endormis */
  S({ id: 'W126', name: 'The Dormitory of Sleeping Children', depth: 3, tier: 'mid', back: 'W121', map: (function () { var g = K.grid(36, 20, ' '); g.box(0, 0, 36, 20, '#', '.'); return g.rows(); })(),
    look: Object.assign({}, LAB, { floor: { p: 'wood', c: ['#9a8a7a', '#7a6a5a', '#aa9a8a'] } }), style: { tallWalls: true }, music: 'dormitory', dark: 0.75,
    place: (function () { var o = [], hints = ['“…the 23:71 train… at eleven at night…”', '“…three lighthouses… three…”', '“…say the name backwards to the glass…”', '“…don’t talk to the Priestess… she cuts the flowers…”', '“…in the dark, at the Nexus, say ascii…”', '“…the basement of the block… an upside-down bedroom…”', '“…forty-seven…”', '“…grandma sang sol mi sol mi re mi do…”']; for (var i = 0; i < 8; i++) o.push({ type: 'decor', at: [4 + (i % 4) * 8, i < 4 ? 4 : 14], look: 'bed', lookOpt: { c: ['#e8e8f0', ['#a0b0d0', '#d0a0b0', '#a0d0b0', '#d0d0a0'][i % 4]] }, lines: ['A child is sleeping, mumbling: ' + hints[i]] });
      o.push(soul([EN('Eight children, one dream, eight pieces. Nobody gets the whole thing.')]));
      o.push(soul(['She goes from bed to bed without touching the floor.', EN('The girl in the fourth bed stopped talking two years ago. Here she talks all night.')]));
      o.push(soul([EN('When one of us wakes up, the piece is lost. Listen while they sleep.')]));
      return o; })(),
    doors: [{ to: 'W127', look: 'door', opt: { style: 'metal', c: ['#202020'], symbol: '0' }, label: 'Corridor 0' }],
    npcs: [{ name: 'The Night Monitor', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#e0ecf0', '#c0d0d8', '#e0c0a0', '#3a2a20'], acc: 'lantern' }), behavior: 'patrol', path: [[2, 9], [33, 9]], speed: 0.6, lang: 'en', lines: [{ seq: [EN('Hush. They all dream the same thing.'), EN('Each of them only gets one piece of it.')] }] }],
    info: { summary: 'A dormitory of eight beds where sleeping children mumble pieces of secrets.', lore: 'The other children who are dreaming too, elsewhere.' } });

  /* W127 — Le Couloir 0 */
  S({ id: 'W127', name: 'Corridor 0', depth: 4, tier: 'hard', back: 'W126', wrap: true, loop: true, map: K.corridor(48, 2, '#', '.'),
    look: { floor: { p: 'flat', c: ['#2a2a30', '#24242a'] }, wall: { p: 'flat', c: ['#14141a', '#0e0e14'], topColor: '#14141a' }, wallface: { p: 'panel', c: ['#3a3a44', '#2a2a34', '#1a1a24'], skirt: '#101018' } },
    style: { tallWalls: true }, music: 'corridor0', dark: 0.85,
    mech: [{ type: 'loopCount', key: 'c0', onLoop: function (rt) { YN.world.reeval(rt); } }],
    doors: [{ to: 'W128', look: 'door', opt: { style: 'wood', c: ['#3a3a3a'] }, cond: { all: [{ equipped: 'E13' }, { fn: function () { return Math.abs(YN.save.temp('c0') || 0) >= 7; } }] }, label: 'a mouse door', locked: 'A tiny door, right down at floor level.' }],
    decor: [{ look: 'frame', n: 3, lines: ['A frame. Inside it, the same corridor, shorter.', 'A plate: “0”. Nobody knows if it is the start or the end.'] }],
    place: [soul([EN('A night is a corridor that only pretends to come back.')]),
      soul(['She counts under her breath, walking beside you.', EN('Seven laps. Count them. Counting is how children survive long halls.')]),
      soul([EN('Zero is written on the plate. Nobody knows if it is the start or the end.')])],
    npcs: [{ name: 'The Step Counter', look: H({ t: 'tall', head: 'clock', body: 'robe', c: ['#3a3a44', '#2a2a34', '#c8c8c8', '#c8c8c8'] }), behavior: 'static', solid: true, lang: 'en', lines: [EN('Seven laps. Then you have to be small.'), { seq: [EN('This corridor looks short. It is very long.'), EN('It only looks like it comes back.')] }] }],
    info: { summary: 'A dark corridor that keeps coming back on itself.', rules: ['The world loops.', 'After seven laps, with Tiny equipped, a mouse door leads to the Room Without a Door (W128).'], lore: 'The length of nights.' } });

  /* W128 — La Pièce sans porte */
  S({ id: 'W128', name: 'The Room Without a Door', depth: 4, tier: 'hard', back: 'W127', backLook: 'hole', backLabel: 'a mouse hole', map: K.hall(10, 8, '#', '.'), secretLevel: 5,
    look: { floor: { p: 'wood', c: ['#6a5a4a', '#4a3a2a', '#7a6a5a'] }, wall: { p: 'flat', c: ['#2a2420', '#1a1410'], topColor: '#2a2420' }, wallface: { p: 'wallpaper', c: ['#c8b8a8', '#a89888', '#7a6a5a'], skirt: '#4a3a2a' } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'nodoorroom', dark: 0.4,
    decor: [{ look: 'letter', n: 1, lines: ['A letter lying in the middle of the floorboards: “If you are reading this, you have found the room I made for you, where nobody can come in. Not even me. — 할머니”.'] }, { look: 'plush', opt: { c: ['#c8a080'] }, lines: ['A bear. The same one as in the attic, but with no dust on it, ever.'] }],
    signs: [{ glyphs: 'here nobody asks you to speak', lines: ['She whispers the carved signs above the skirting board, one by one.', KS('여기서는 아무도 너한테 말하라고 안 해.', 'Here, nobody tells you to speak.')] }],
    place: [soul([KS('할머니가 방 하나를 약속했어. 문은 안 만들었어. 문은 어른들이 여니까.', 'Grandma promised a room. She didn’t make a door. Doors are what grown-ups open.')]),
      soul([KS('먼지가 없는 건 아무도 안 들어왔다는 뜻이야. 그게 선물이야.', 'No dust means nobody has come in. That is the present.')]),
      soul(['She sits on the floor, the way you sit at home.', KS('말 안 해도 돼. 숨만 쉬어.', 'You don’t have to talk. Just breathe.')]),
      soul([KS('그 곰은 다락방 곰이야. 여기서는 먼지가 안 앉아.', 'That bear is the attic bear. Here, no dust settles on it.')])],
    info: { summary: 'A small closed room with no door; the only way in is through a mouse hole.', lore: 'A place of one’s own, which the grandmother had promised.' } });

  /* W129 — Le Jardin d'enfants abandonné */
  S({ id: 'W129', name: 'The Abandoned Kindergarten', depth: 2, tier: 'mid', back: 'W136', outdoor: true,
    gen: { type: 'empty', w: 44, h: 32, opts: { floor: '.', border: 'f', decor: '"', decorRate: 0.1 } }, look: { floor: { p: 'dirt', c: ['#7a6a50', '#6a5a40', '#8a7a60'] }, leafg: { p: 'grass', c: ['#5a7a3a', '#4a6a2a', '#6a8a4a', '#3a5a1a'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#c84040'] } },
    tall: { f: { look: 'fence', opt: { c: ['#c84040'] } } }, style: { renderer: 'crayon' }, music: 'kindergarten', dark: 0.5,
    decor: [{ look: 'swing', n: 2, animated: true, lines: ['A swing, creaking all by itself.'] }, { look: 'sandbox', n: 1, lines: ['A sandpit. Someone has buried a doll in it, head out, “so she can breathe”.'] }, { look: 'ball', n: 3, lines: ['A burst ball.'] }],
    place: [soul([EN('Six o’clock was a promise. The clock here only knows how to be late.')]),
      soul(['She pushes an empty swing, twice.', EN('The doll was buried head out, so she could breathe. Children think of that.')]),
      soul([EN('I was the last one every Friday. The teacher stopped pretending to be busy.')]),
      soul([EN('Waiting is a room with no walls. You can be in it anywhere.')])],
    npcs: [{ name: 'The Child Nobody Came For', look: H({ t: 'kid', hairStyle: 'long', body: 'dress', c: ['#e0a0b0', '#c08090', '#f0c8a0', '#3a2a1a'], eyes: 'down', acc: 'bag' }), behavior: 'static', solid: true, lang: 'en', lines: [EN('Mum comes at six. What time is it?'), { seq: [EN('Everyone else has gone. There is me and the teacher.'), EN('And the teacher has gone too.')] }, EN('Are you waiting for somebody as well?')] }],
    info: { summary: 'A nursery-school playground at night, swings, a sandpit; a little girl is still waiting.', lore: 'Being the last one to be picked up.' } });

  /* W130 — La Plage des chaussures */
  S({ id: 'W130', name: 'The Beach of Shoes', depth: 4, tier: 'mid', back: 'W102', backLook: 'hole', outdoor: true,
    gen: { type: 'empty', w: 56, h: 30, opts: { floor: '.', decor: 'o', decorRate: 0.02 } }, look: { floor: { p: 'sand', c: ['#c8b898', '#a89878'] } },
    style: { sky: ['#e0c0a0', '#f8e8d0'], renderer: 'watercolor' }, music: 'shoebeach', amb: { type: 'sea', vol: 0.1 },
    mapPost: function (rows) { for (var y = 0; y < 6; y++) rows[y] = rows[y].replace(/./g, '~'); return rows; },
    decor: [{ look: 'shoe', n: 14, lines: ['A child’s shoe. The left one.', 'A man’s shoe, very worn.', 'A woman’s slipper, set neatly facing the sea.', 'A small red shoe, embroidered: 옥순.'] }],
    doors: [{ to: 'W162', look: 'boat', label: 'a rowing boat' }],
    place: [soul([EN('The sea gives back shoes. Railway platforms give back nothing.')]),
      soul(['She searches among the left shoes, only the left ones.', EN('Nineteen fifty-one. A girl of nine, one shoe, one brother on the other train.')]),
      soul([EN('The small red shoe with a name sewn inside is still waiting for the other one.')])],
    npcs: [{ name: 'The Shoe Gatherer', look: H({ t: 'old', head: 'cap', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#d8b898', '#c8c8c8'], acc: 'bag' }), behavior: 'wander', radius: 6, lang: 'en', lines: [EN('The sea gives back shoes. Never people.'), { seq: [EN('If you find your own, do not put it back on.'), EN('It is not your size any more.')] }] }],
    info: { summary: 'A beach at sunset covered in odd shoes that the sea has given back.', lore: 'What the sea gives back: traces, not people.' } });

  /* W131 — Le Bureau du Grand Rire */
  S({ id: 'W131', name: 'The Big Laugh’s Office', depth: 3, tier: 'hard', back: 'W139',
    map: (function () { var g = K.grid(40, 26, ' '); g.box(0, 0, 40, 26, '#', '.'); g.box(26, 2, 12, 9, 'g', ','); g.set(31, 10, ','); for (var y = 14; y < 24; y += 3) for (var x = 4; x < 36; x += 4) g.set(x, y, '{'); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor2: { p: 'carpet', c: ['#3a2a2a', '#2a1a1a'] } }), tall: { '{': { look: 'monitor', opt: { c: ['#202838'] } } }, style: { tallWalls: true }, music: 'bossoffice', amb: { type: 'office', vol: 0.06 },
    doors: [{ to: 'W132', look: 'door', opt: { style: 'glass' }, label: 'the canteen' }, { to: 'W133', look: 'door', opt: { style: 'glass', c: ['#4a4a4a'] }, label: 'the open-plan office' }],
    place: [soul([KS('그 사람이 소리치면 우리는 웃어요. 웃으면 빨리 끝나요.', 'When he shouts, we laugh. If we laugh, it ends sooner.')]),
      soul(['Her hand still rests on a keyboard that no longer exists.', KS('저는 잘못한 게 없었어요. 그래도 죄송하다고 했어요.', 'I hadn’t done anything wrong. I said sorry anyway.')]),
      soul([EN('He was the funny one at school. Same voice, same timing.'), EN('Only the laughing changed hands.')]),
      soul([KS('유리 방에 있는 사람은 집에 아무도 없어요. 텔레비전만 켜 놓고 살아요.', 'The man in the glass room has nobody at home. He lives with just the television on.')])],
    npcs: [{ name: 'The Screaming Director', look: H({ t: 'tall', hairStyle: 'spiky', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#e8b0a0', '#2a1a10'], eyes: 'wide', mouth: 'grin' }), behavior: 'static', at: [31, 6], solid: true, lang: 'en',
      lines: [{ seq: [EN('WHO DID THIS?'), 'He screams at an employee who has done nothing. Then he laughs, very loudly, and everyone laughs with him, too late.'] }, { seq: [EN('You know what I did at school? I made everyone laugh.'), EN('Now I make everyone afraid. Same thing. They look at me.')] }, { if: { quest: { Q08: 'laughter' } }, seq: ['He stops in the middle of a shout.', EN('You… the mute girl? Are you still mute?'), 'He looks away.', EN('I was on my own too, you know. That excuses nothing.')], do: [{ quest: { Q08: 'adult' } }] }] },
      { name: 'An Employee with Head Bowed', count: 4, look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'down' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('네, 죄송합니다. 네.', 'Yes, I’m sorry. Yes.'), 'He types on a keyboard with no keys.', 'He smiles when the director shouts. He has learned.'] }],
    info: { summary: 'An office floor dominated by a glass cage where a director screams.', lore: 'The Big Laugh grown up: cruelty learned, then passed on.' } });

  /* W132 — La Cantine des employés */
  S({ id: 'W132', name: 'The Staff Canteen', depth: 3, tier: 'mid', back: 'W131', map: (function () { var g = K.grid(32, 20, ' '); g.box(0, 0, 32, 20, '#', '.'); for (var y = 5; y < 17; y += 4) for (var x = 4; x < 28; x += 6) g.set(x, y, '}'); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'tile', c: ['#d8d0c0', '#a8a090'] } }), tall: { '}': { look: 'table', opt: { c: ['#c8c0b0'] } } }, style: { tallWalls: true }, music: 'canteen',
    doors: [{ to: 'W134', look: 'door', opt: { style: 'glass' }, label: 'meeting room' }],
    place: [soul([KS('앉아서 먹는 사람은 신입이에요. 두 달이면 서서 먹어요.', 'The ones who eat sitting down are new. After two months, you eat standing up.')]),
      soul([KS('휴대폰 화면이 다 애기 사진이에요. 전부 자는 사진이요.', 'Every phone screen is a photo of a baby. All of them asleep.')]),
      soul(['She fills a bowl for someone who has already gone.', KS('식은 밥은 미안하다는 말이에요.', 'Cold rice is a way of saying sorry.')])],
    npcs: [{ name: 'The Dinner Lady', look: H({ t: 'adult', hairStyle: 'bun', head: 'round', body: 'apron', c: ['#f0f0f0', '#d0d0d0', '#e0c0a0', '#2a2a2a'], acc: 'tray' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('밥 먹었어요? 안 먹었으면 먹어요.', 'Have you eaten? If not, eat.'), 'She fills bowls of rice for people who have no time to sit down.', KS('천천히 먹어요. 아무도 안 그러지만요.', 'Eat slowly. Not that anybody does.')] }, { name: 'An Employee Eating Standing Up', count: 3, look: H({ t: 'adult', body: 'shirt', c: ['#e8e8f0', '#c8c8d0', '#e0c0a0', '#1a1a1a'], acc: 'phone' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('5분이면 돼요.', 'Five minutes is enough.'), 'He eats while looking at his phone. On the screen, a photo of a child, on standby.'] }],
    info: { summary: 'A company canteen where people eat standing up, fast.', lore: 'Meals eaten in five minutes.' } });

  /* W133 — L'Open space qui rétrécit */
  S({ id: 'W133', name: 'The Shrinking Open-Plan Office', depth: 4, tier: 'hard', back: 'W131', map: (function () { var g = K.grid(34, 26, ' '); g.box(0, 0, 34, 26, '#', '.'); for (var y = 4; y < 23; y += 4) for (var x = 4; x < 31; x += 5) g.set(x, y, '{'); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'carpet', c: ['#4a4a52', '#3a3a42'] } }), tall: { '{': { look: 'monitor', opt: { c: ['#202838'] } } }, style: { tallWalls: true }, music: 'shrinking', amb: { type: 'office', vol: 0.08 },
    backAt: [3, 2], mech: [{ type: 'shrink', every: 10, max: 10, text: 'The walls move in by one row.' }],
    doors: [{ to: 'W135', at: [17, 13], look: 'door', opt: { style: 'metal', symbol: '↑' }, label: 'the stairs to the roof' }],
    place: [soul([KS('벽이 다가와도 아무도 안 일어나요. 일어나면 자리가 없어져요.', 'Even when the walls come closer, nobody gets up. Get up and your seat is gone.')]),
      soul([KS('칼퇴라는 말은 있어요. 쓰는 사람은 없어요.', 'There is a word for leaving on the dot. Nobody uses it.')]),
      soul(['She measures the room with her arms spread wide. It fits.', KS('제 딸은 저보다 제 책상을 더 자주 봐요. 화면으로요.', 'My daughter sees my desk more often than she sees me. On a screen.')]),
      soul([KS('가운데 문이 제일 늦게 막혀요. 그래서 가운데로 가요.', 'The door in the middle is the last to be blocked. That is why you head for the middle.')])],
    npcs: [{ name: 'The Colleague Who Never Looks Up', look: H({ t: 'adult', hairStyle: 'long', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#e0c0a0', '#1a1a1a'], eyes: 'down' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('일이 줄어들지 않아요. 방이 줄어들어요.', 'The work does not shrink. The room does.'), 'She does not move when the wall comes closer. She is used to it.'] }],
    info: { summary: 'An open-plan office whose walls close in every ten seconds of dream.', rules: ['The walls close in; the door to the roof is in the centre.'], lore: 'The space to live in, shrinking.' } });

  /* W134 — La Salle de réunion éternelle */
  S({ id: 'W134', name: 'The Eternal Meeting Room', depth: 4, tier: 'mid', back: 'W132', map: (function () { var g = K.grid(28, 18, ' '); g.box(0, 0, 28, 18, '#', '.'); g.rect(6, 6, 16, 6, '}'); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'carpet', c: ['#3a3a4a', '#2a2a3a'] } }), tall: { '}': { look: 'table', opt: { c: ['#4a3a2a'] } } }, style: { tallWalls: true }, music: 'meeting',
    place: [{ type: 'decor', at: [14, 1], look: 'screen', lines: [KS('결론: 내일 다시 회의.', 'Conclusion: meeting again tomorrow.'), 'Slide 1 of ∞.'] },
      soul([KS('결론은 늘 《내일 다시》예요. 내일도 같은 결론이에요.', 'The conclusion is always “again tomorrow”. Tomorrow, the same conclusion.')]),
      soul(['She sits in the empty seat at the end of the table.', KS('여덟 시에 끝낼 수 있었어요. 아무도 먼저 못 일어나요.', 'We could have finished at eight. Nobody can be the first to stand up.')]),
      soul([KS('이 방에서 잃은 시간은 전부 누군가의 저녁이에요.', 'All the time lost in this room is somebody’s evening.')])],
    npcs: [{ name: 'A Participant', count: 6, look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'static', solid: true, lang: 'ko-s', lines: [KS('좋은 의견입니다. 검토하겠습니다.', 'Excellent point. We will look into it.'), KS('다음 슬라이드요.', 'Next slide.'), 'He sleeps with his eyes open. He nods every eight seconds.'] }],
    info: { summary: 'A meeting room where the meeting never ends.', lore: 'Time stolen from evenings.' } });

  /* W135 — Le Toit de la tour */
  S({ id: 'W135', name: 'The Tower Roof', depth: 4, tier: 'hard', back: 'W133', outdoor: true,
    map: (function () { var g = K.grid(30, 24, ' '); g.rect(2, 2, 26, 20, '.'); g.box(1, 1, 28, 22, 'f', null); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#5a5e66'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#a0a8b0'] } }, tall: { f: { look: 'fence', opt: { c: ['#a0a8b0'] } } },
    style: { stars: true, sky: ['#02040e', '#101a34'], cliffH: 1.2, cliff: '#1a1e26' }, music: 'towerroof', amb: { type: 'wind', vol: 0.12 }, weather: { wind: 0.5 }, dark: 0.5,
    doors: [{ to: 'W139', look: 'door', opt: { style: 'metal' }, label: 'back down to the 44th' }],
    place: [soul([KS('여기 올라오는 사람들은 다 누군가한테 전화하려고 올라와요. 번호를 잊었을 뿐이에요.', 'Everyone who comes up here comes up to call someone. They have only forgotten the number.')]),
      soul([KS('저 아래 불 켜진 창문, 하나씩 세 보세요. 다 사람이에요.', 'The lit windows down there: count them one by one. Every one of them is a person.')]),
      soul(['She stays beside you for a while, saying nothing.', KS('옆에 있어 주는 것만으로 충분한 밤이 있어요.', 'There are nights when just staying beside someone is enough.')]),
      soul([KS('피로는 잠으로 안 풀려요. 말로는 조금 풀려요. 누가 들어 주면요.', 'Tiredness does not go away with sleep. Talking helps a little — if someone listens.')]),
      soul([KS('2044년에도 누군가 기다려요. 딸이 불을 켜 놓고 기다려요.', 'In 2044 too, someone is waiting. Her daughter waits with the light on.')]),
      soul([KS('이 문은 내려가는 문이에요. 올라오는 문보다 훨씬 많이 쓰였어요.', 'This door is a door for going back down. It has been used far more often than the other.')])],
    npcs: [{ name: 'The Woman with the S. Badge', look: H({ t: 'adult', hairStyle: 'short', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#f6d8c0', '#1e1a26'], eyes: 'down', acc: 'phone' }), behavior: 'static', at: [26, 4], solid: true, lang: 'ko-s', dialog: 'roofS' }],
    info: { summary: 'The roof of an office tower, fenced in, very high above the city. A woman has gone up close to the fence.', rules: ['Talk to her, stay, listen to her.'], lore: 'S. as an adult, in 2044, exhausted, no longer seeing her child. The game does not leave her alone.', help: 'Someone answers, day and night: 109 in South Korea, 988 in the US, 116 123 in the UK, 3114 in France.' } });

  /* W136 — Le Jardin de nuit */
  S({ id: 'W136', name: 'The Night Garden', depth: 2, tier: 'mid', back: 'W001', backArrive: 'nightdoor', outdoor: true,
    gen: { type: 'forest', w: 52, h: 40, opts: { density: 0.14, border: true, grass: '*' } }, look: Object.assign({}, K.LOOK.forest, { flowers: { p: 'flowers', c: ['#1f3a2a', '#e8e8ff', '#c8c8f8', '#f8f0c8'] } }), tall: K.TALL.forest,
    style: { stars: true }, music: 'nightgarden', amb: { type: 'crickets', vol: 0.08 }, dark: 0.75, weather: { dust: true },
    doors: [{ to: 'W129', look: 'gate', label: 'a kindergarten gate' }, { to: 'W137', look: 'door', opt: { style: 'glass', c: ['#c8e0d0'] }, label: 'a lit greenhouse' }, { to: 'W138', look: 'mailbox', label: 'a letterbox among the flowers' }, { to: 'W140', look: 'door', opt: { style: 'wood', c: ['#3a5a8a'] }, label: 'a blue door', cond: { met: 'N008' } }],
    decor: [{ look: 'flower', n: 10, opt: { c: ['#e8e8ff'] }, solid: false, lines: ['A moonflower. It only opens when the light is out, at home.', 'A flower that smells of soap and wet earth.'] }],
    place: [soul([KS('할머니는 여기서 휘파람으로 새를 불렀어. 새들은 아직 와.', 'Grandma used to whistle for the birds here. The birds still come.')]),
      soul([EN('Moonflowers open when a lamp goes out somewhere. Not here. Somewhere.')]),
      soul(['She counts the flowers, then starts again.', KS('떠난 사람 수만큼 피어요. 한 송이는 아직 안 폈어요.', 'As many bloom as there are people who left. One has not opened yet.')]),
      soul([EN('The gate, the greenhouse, the mailbox, the blue door. Four ways of missing someone.')])],
    npcs: [{ name: 'The Night Garden Owl', look: { t: 'owl', c: ['#6a5a4a'], h: 16 }, behavior: 'static', solid: true, lines: ['Hoo. She is watching the blue door. A sarcastic girl goes in sometimes, with a line drawn on her arm.'] }, { id: 'N008', name: 'Nour', major: true, role: 'major', lang: 'en', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#c89068', '#1a1a1a'], eyes: 'line', mouth: 'line', acc: 'map' }), behavior: 'wander', radius: 3, dialog: 'nour',
      info: { personality: 'Curt, sarcastic; writes on her arm.', flaw: 'Refuses help.', wants: 'To find “home” again.', arc: 'Q07 The Road Home', lore: 'The primary-school friend who moved away to another town.' } }],
    info: { summary: 'The Garden at night, on the other side of the hedge: moonflowers, fireflies, hidden doors.', lore: 'The garden of the absent.' } });

  /* W137 — La Serre des absents */
  S({ id: 'W137', name: 'The Greenhouse of the Absent', depth: 3, tier: 'hard', back: 'W136', map: (function () { var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, 'g', '.'); for (var x = 4; x < 27; x += 5) g.vline(x, 4, 15, '+'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#a8b8a0', '#889880'] }, glass: { p: 'glass', c: ['#a8c8d8', '#e8f4fc', '#c8dce8'] }, soil: { p: 'soil', c: ['#3a2a18'] } }, music: 'absentgreenhouse', dark: 0.55,
    place: ['appa', 'Nour', 'halmeoni', 'Jae-sik', 'Mi-ran'].map(function (n, i) { return { id: 'abs' + i, type: 'decor', at: [4 + i * 5, 10], look: 'pot', lookOpt: { label: n }, lines: ['A pot labelled “' + n + '”. The soil is dry. It needs watering.'] }; }).concat([
      soul([EN('Water the names or they dry out. A dry name is where forgetting starts.')]),
      soul([KS('아버지 이름은 안 썼어요. 그냥 《아빠》라고 썼어요.', 'We didn’t write the father’s name. We just wrote “Appa”.')]),
      soul(['She holds a watering can too big for her.', EN('Five pots. Two of them are for people who are still alive. Nobody dares move those.')]),
      soul([EN('The sixth pot was taken away. It had the name of a brother on a platform.')])]),
    mech: [{ type: 'visitAll', marks: ['abs0', 'abs1', 'abs2', 'abs3', 'abs4'], flag: 'absents_watered', cond: null, winLines: ['All the pots bloom at once, each with a different flower. At the back of the greenhouse, a door opens a crack.'], countText: 'Pots watered # / %' }],
    doors: [{ to: 'W159', look: 'door', opt: { style: 'wood', c: ['#e8e0d0'] }, cond: { all: [{ flag: 'absents_watered' }, { equipped: 'E35' }] }, label: 'a garden door, at the back', locked: 'A garden door. It is waiting for the greenhouse to bloom again — and for someone who waters.' }],
    npcs: [{ name: 'The Glass Gardener', look: H({ t: 'tall', head: 'pot', body: 'apron', c: ['#a8c8d8', '#88a8b8', '#e8f4fc', '#a8c8d8'], alpha: 0.6 }), behavior: 'static', solid: true, lang: 'en', lines: [{ seq: [EN('Here we plant the names of the ones who left. You have to water them, or you forget them.'), EN('With Pip’s watering can, preferably.')] }] }],
    info: { summary: 'A greenhouse at night where pots bear the names of the absent.', rules: ['Water (interact with) the five pots; with the Watering Can equipped, the door at the back leads to the True Statue (W159).'], lore: 'Tending memory so as not to forget.' } });

  /* W138 — La Poste des lettres impossibles */
  S({ id: 'W138', name: 'The Post Office of Impossible Letters', depth: 3, tier: 'hard', back: 'W136', map: (function () { var g = K.grid(32, 20, ' '); g.box(0, 0, 32, 20, '#', '.'); g.hline(4, 27, 8, 'u'); g.set(16, 8, '.'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#8a6a48', '#6a4a30', '#9a7a58'] }, counter: { p: 'wood', c: ['#5a3a20', '#4a2a10', '#6a4a30'] }, wall: { p: 'flat', c: ['#2a1e14', '#1e140c'], topColor: '#2a1e14' }, wallface: { p: 'panel', c: ['#a07a50', '#805a30', '#5a3a1a'], skirt: '#2a6a3a' } },
    style: { tallWalls: true, renderer: 'sepia' }, music: 'impossiblepost', amb: { type: 'clock', vol: 0.04 },
    doors: [{ to: 'W116', look: 'door', opt: { style: 'wood', symbol: '1989' }, label: 'sorting: Seoul 1989' }],
    place: [{ id: 'sorting', type: 'decor', at: [10, 4], look: 'mailbox', lines: ['The sorting pigeonholes. “1989 → 2044”. “2044 → 1989”. “Nowhere → home”.'] }, { id: 'letterS', type: 'decor', at: [22, 4], look: 'letter', lines: [{ if: { quest: { Q03: 'delivered' }, noEffect: 'E40' }, t: 'A letter dated 2044, signed “S.”: “My darling, I’m home late, again. I watch you sleep on my phone screen. I don’t want to become what I am becoming.” You keep it.', do: [{ give: 'E40' }, { quest: { Q03: 'kept' } }] }, { t: 'A letter from 2044 is waiting to be claimed by someone who has already delivered another letter.' }] },
      soul([EN('A letter does not need the person to be there. Only the address.')]),
      soul(['She stamps the air, twice, out of habit.', EN('From eighty-nine to forty-four and back. Both letters say the same thing: I am late again.')]),
      soul([EN('Dead letters are the ones nobody answered. We keep them warm anyway.')])],
    npcs: [{ name: 'The Postman of the Impossible', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#2a4a8a', '#1a3a7a', '#d8b898', '#c8c8c8'], acc: 'stamp' }), behavior: 'static', solid: true, lang: 'en',
      lines: [{ if: { item: { letter: 1 }, not: { quest: { Q03: 'delivered' } } }, seq: ['He takes your letter from Seoul, signed M., 1989, and stamps it: 2044.', EN('It will arrive. A letter always arrives, even when it is too late.')], do: [{ item: { letter: -1 } }, { quest: { Q03: 'delivered' } }, { rel: { N022: 2 } }] }, { seq: [EN('Here we deliver what cannot be delivered. The letters from M. go to S. The letters from S. go to M.'), EN('And Gaston carries them, very slowly.')] }] }],
    info: { summary: 'A sepia post office where letters are sorted between 1989 and 2044.', rules: ['Hand the letter from “M.” (letterbox 1204 in the Apartment Block) to the postman, then take the letter from “S.”: the Letter (E40).'], lore: 'Mi-ran as a child writes to her father; Sora as an adult writes to her child. Neither letter is ever read by the other.' } });

  /* W139 — Le 44e étage */
  S({ id: 'W139', name: 'The 44th Floor', depth: 2, tier: 'mid', back: 'W033', backLook: 'elevator', backArrive: 'elevator',
    map: (function () { var g = K.grid(38, 24, ' '); g.box(0, 0, 38, 24, '#', '.'); for (var y = 5; y < 21; y += 5) for (var x = 4; x < 34; x += 6) { g.set(x, y, '{'); g.set(x + 1, y, '{'); } return g.rows(); })(),
    look: K.LOOK.sk, tall: { '{': { look: 'monitor', opt: { c: ['#202838'] } } }, style: { tallWalls: true }, music: 'floor44', amb: { type: 'office', vol: 0.05 }, dark: 0.5,
    doors: [{ to: 'W131', look: 'door', opt: { style: 'glass', c: ['#3a3a4a'] }, label: 'the director’s office' }, { to: 'W135', look: 'door', opt: { style: 'metal', symbol: '↑' }, label: 'the roof' }, { to: 'W116', look: 'window', label: 'the window looks out on 1989' }],
    place: [{ id: 'kimdesk', type: 'decor', at: [10, 10], look: 'desk', lookOpt: { book: true, lamp: true }, lines: [{ if: { equipped: 'E14' }, t: 'On 김 과장’s desk, a photo: a little girl of nine, a satchel on her back, a badge pinned on: “미란”. She is smiling at someone who is not in the photo.', do: [{ note: 'n_miran_photo' }, { quest: { Q09: 'photo' } }] }, { t: 'A desk. A blurred photo in a frame. You would need to see better.' }] },
      soul([KS('김 과장은 《아니요》를 배운 적이 없어요. 아무도 안 가르쳐 줬어요.', 'Manager Kim never learned to say “no”. Nobody ever taught him.')]),
      soul([KS('이 층에서 제일 늦게 꺼지는 불이 그 사람 책상이에요. 1989년부터요.', 'On this floor, the last light to go out is the one on his desk. Since 1989.')]),
      soul(['She looks at the photo, then at the lift.', KS('사진 속 아이는 아홉 살이에요. 지금은 간호조무사예요. 밤에 일해요.', 'The child in the photo is nine. Today she is a nursing assistant. She works nights.')]),
      soul([KS('성실한 사람이라고 했어요. 그 말 하나로 사십 년을 보냈어요.', 'People called him a diligent man. He spent forty years on that one word.')]),
      soul([KS('누가 《집에 가세요》라고 말해 주기만 기다렸어요. 아무도 안 했어요.', 'He was only waiting for someone to tell him “go home”. Nobody did.')]),
      soul([KS('44층에는 창문이 많아요. 집 창문은 하나도 안 보여요.', 'The 44th floor has many windows. Not one of them shows the window of a home.')])],
    npcs: [{ name: '김 과장 (at night)', look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'closed', acc: 'coffee' }), behavior: 'static', at: [12, 10], solid: true, lang: 'ko-s',
      hears: [{ match: ['go home', 'home', 'go back', 'leave', 'your daughter', 'daughter', 'she is waiting', 'waiting', '집에 가세요', '퇴근', 'no', 'say no', '집에 가', '딸이 기다려요', '안 돼'], lines: [KS('…집에… 가도 될까요?', '…May I… go home?'), KS('아니요. 아니요라고 해 볼게요.', 'No. I will try saying no.'), 'He switches off his screen, takes his jacket and walks to the lift. He does not look back. On the desk, he has left his coffee.'], do: [{ quest: { Q09: 'home' } }, { note: 'n_kim_home' }] }],
      lines: [KS('미란이가 기다리는데…', 'Mi-ran is waiting…'), KS('오늘만, 오늘만 늦게…', 'Just today, just today I stay late…'), 'He looks at the blurred photo, then at the screen, then at the photo.'] }],
    info: { summary: 'The 44th floor of the Glass Tower at two in the morning; 김 과장 cannot bring himself to leave.', rules: ['Telling him (T) to go home — or saying “no” — makes him leave (Q09).', 'With the Glasses, the photo on his desk can be made out.'], lore: 'The grandfather. His daughter Mi-ran is waiting, in 1989.' } });

  /* W140 — La Ville de Nour */
  S({ id: 'W140', name: 'Nour’s Town', depth: 3, tier: 'hard', back: 'W136', outdoor: true,
    gen: { type: 'city', w: 50, h: 36, opts: { block: 8 } }, look: Object.assign({}, K.LOOK.street, { floor: { p: 'tile', c: ['#b8a890', '#988870'] } }), tall: K.TALL.city, style: { renderer: 'watercolor' }, music: 'nourcity',
    decor: [{ look: 'house', n: 4, opt: { c: ['#d8c8b0', '#3a5a8a'] }, lines: ['A house that looks like the old one, without being it. The shutters are the wrong colour.', 'A new school. Nobody knows anybody.'] }],
    place: [soul([EN('New town, same streets, wrong shutters. The hands still reach for the old door.')]),
      soul([EN('She writes things on her arm because paper ends up in boxes.')]),
      soul(['She is looking for a house whose layout she knows by heart.', EN('Nobody said goodbye. The car was blue and already running.')]),
      soul([EN('Two girls drew on a wall. One wall got repainted. The other girl stopped talking.')]),
      soul([EN('A map is a promise that somebody can find you.')]),
      soul([EN('Here nobody knows the name they called her at the old school. She misses even that.')])],
    npcs: [{ name: 'Nour (the town)', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#c89068', '#1a1a1a'], eyes: 'line', acc: 'map' }), behavior: 'static', solid: true, lang: 'en',
      lines: [{ if: { item: { drawing: 1 }, noEffect: 'E37' }, seq: ['Nour takes the drawing. She looks at it for a very long time.', EN('That was my home.'), 'She writes on her arm, then on a sheet of paper, then holds it out to you: a map.', EN('So that you always know where you are. And so I know where you are too.')], do: [{ item: { drawing: -1 } }, { give: 'E37' }, { quest: { Q07: 'done' } }, { rel: { N008: 4 } }] }, { seq: [EN('What are you doing here? This is my home.'), EN('Well. It is supposed to be.')] }, { seq: [EN('I left drawings on the wall of my old room.'), EN('The new people threw them out, probably.')] }] }],
    info: { summary: 'A new town where everything looks like the old one without being it.', rules: ['Bringing Nour the drawing left behind in her old house (Empty Neighbourhood) gives the Map (E37).'], lore: 'The friend who moved to another town and did not say goodbye.' } });

  /* ---------------- dialogues ---------------- */
  YN.defDialogue('roofS', {
    who: 'S.', voice: { wave: 'sine', pitch: 300, vary: 2, len: 50, vol: 0.05 },
    branches: [
      { once: 'first', lines: ['She does not turn around.', KS('울타리에 너무 가까이 오지 마. 튼튼하지 않아. 아무것도 튼튼하지 않아.', 'Don’t come too close to the fence. It isn’t solid. Nothing is solid.'), KS('난 피곤해. 자도 안 풀리는 피곤함이 뭔지 알아?', 'I’m tired. Do you know what it’s like, a tiredness that doesn’t go away when you sleep?')],
        choices: [
          { t: 'Stay beside her, saying nothing', lines: ['You stay. The wind goes by. After a long while, she takes a step back, then another.', KS('너 안 갔네. 아무도 안 있어 주는데.', 'You didn’t go. Nobody ever stays.'), 'She sits down on the ground, her back to the fence, on the right side of it.'], do: [{ set: { roofS_stayed: true } }, { note: 'n_roof' }] },
          { t: '“Go home. Someone left the light on.”', lines: ['She laughs, a small broken laugh.', KS('불… 우리 딸은 불 켜 놓고 자. 내가 꺼 주는 걸 기다려.', 'The light… My daughter sleeps with the light on. She waits for me to switch it off.'), 'She moves away from the fence.', KS('집에 갈게. 그 불, 내가 꺼 줄게.', 'I’ll go home. That light — I’ll switch it off for her.')], do: [{ set: { roofS_stayed: true } }, { note: 'n_roof' }] }
        ] },
      { if: { flag: 'roofS_stayed' }, lines: ['She is sitting far from the fence, her phone in her hands.', KS('누구한테 전화했어. 신호 가고 있어. 조금만 더 있어 줄래?', 'I called someone. It’s ringing. Will you stay a little longer?'), 'On her phone screen, a number: 3114. Someone has picked up.'] },
      { lines: ['She looks at the city from a distance, from the right side of the fence.'] }
    ]
  });
  YN.defDialogue('nour', {
    who: 'Nour', voice: { wave: 'square', pitch: 360, vary: 3, len: 26, vol: 0.035 },
    branches: [
      { once: 'first', lines: [EN('Well. The mute girl.'), EN('What? That is what they called you. I never called you anything. I never called you at all, actually, since I left.'), 'She writes something on her arm in pen, and hides the arm.'], do: [{ quest: { Q07: 'met' } }] },
      { if: { item: { drawing: 1 } }, lines: [EN('Is that… my drawing? Come to my place. The blue door. Not here, here is a garden full of ghosts.')] },
      { if: { quest: { Q07: 'done' } }, lines: [EN('You have the map. Do not lose it. I lost every one of mine.'), EN('… Thanks. There. I said it. Do not get used to it.')] },
      { lines: [{ t: function () { return [EN('I do not need anybody.'), EN('My parents put the boxes in a blue car. I had no time to say goodbye. Not that I would have.'), EN('On my arm I write the things I must not forget. Your name is on it. Do not look.'), EN('My old room had drawings on the wall. Nobody kept them, probably.')][Math.floor(Math.random() * 4)]; } }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
