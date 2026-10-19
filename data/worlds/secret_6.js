/* =========================================================================
 *  MONDES SECRETS (6/8) — W141 à W160
 *  W141–W150 : les dix mondes à apparition (règles dans spawnRule).
 *  W151–W153 : les trois générateurs (dédale instable, paysage infini,
 *  maison qui se réarrange). W154–W160 : géographies impossibles, le Phare
 *  dans le blanc, la Statue véritable, le Puits des noms.
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
  function back() { return { back: null }; }

  /* ---------------- les dix mondes à apparition ---------------- */
  /* W141 — L'Épicerie qui n'existe pas */
  S({ id: 'W141', name: 'The Grocery That Doesn’t Exist', depth: 2, tier: 'mid', back: 'W003', backLabel: 'back out into the street',
    spawnRule: { in: ['W003', 'W008', 'W017', 'W051'], chance: 0.2, as: 'door', lookOpt: { style: 'glass', c: ['#e0a040'], symbol: '?' }, label: 'a grocery nobody had ever seen before' },
    map: (function () { var g = K.grid(22, 14, ' '); g.box(0, 0, 22, 14, '#', '.'); g.vline(7, 3, 9, '|'); g.vline(14, 3, 9, '|'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#d8c8a8', '#b0a080'] }, wall: { p: 'flat', c: ['#3a2a1a', '#2a1a0a'], topColor: '#3a2a1a' }, wallface: { p: 'panel', c: ['#c8a868', '#a88848', '#7a6028'], skirt: '#4a3a1a' }, thin: { p: 'stripes', c: ['#e0d0a0', '#a08040'] } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'grocery',
    decor: [{ look: 'crate', n: 3, lines: ['Sweets of a brand that no longer exists, at a price that no longer exists.', 'Tins of “time”: “1 minute — 50 cents”. They are empty.'] }],
    npcs: [{ name: 'The Grocer Who Knows Your Name', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#a06040', '#804020', '#e0c8b0', '#c8c8c8'], eyes: 'closed', mouth: 'smile' }), behavior: 'static', solid: true,
      lines: [{ seq: [EN('Ah, there you are. The little one of the garden lady.'), 'She holds out a mint sweet to you, like before.'] }, EN('This shop only opens when you walk past without looking for it.')],
      hears: [{ match: ['thank you', 'thanks', 'thank', 'cheers', '고마워', '고맙습니다', '감사합니다'], lines: [EN('You’re welcome, sweetie. You have your grandmother’s voice, when you speak.')] }] }],
    place: [SOUL([EN('She paid in coins, always the exact amount. She counted them twice, in Korean.')]),
      SOUL([EN('The little one never asked for anything. That is how I knew she wanted the mint ones.')]),
      SOUL([EN('Closed on Sundays. Open on the nights someone needs it.')])],
    info: { summary: 'An old-fashioned corner grocery that sometimes appears in a street.', rules: ['Appears: 1 chance in 5 per night, in Town at Dusk, the Empty Neighbourhood, the Night Supermarket or the Street in the Rain.'], lore: 'The corner shop the grandmother used to take her to.' } });

  /* W142 — L'Étage 13 bis */
  S({ id: 'W142', name: 'Floor 13A', depth: 3, tier: 'mid', back: 'W027', backLook: 'elevator', backLabel: 'the lift goes back down',
    spawnRule: { in: ['W027', 'W033', 'W053', 'W118'], cond: { phase: ['late', 'final'] }, chance: 0.35, as: 'elevator', label: 'a lift that stops at 13A' },
    map: K.corridor(40, 3, '#', '.'), look: Object.assign({}, K.LOOK.hospital, { floor: { p: 'tile', c: ['#a0a8a8', '#808888'] } }), style: { tallWalls: true, renderer: 'surveillance' }, music: 'floor13', dark: 0.65,
    decor: [{ look: 'door', n: 6, opt: { style: 'metal', symbol: '13A' }, lines: ['A door marked 13A. Behind it, you can hear your own breathing, a beat late.', 'A door marked 13A. Locked from the other side by someone who is scared too.'] }],
    npcs: [{ name: 'The Man from Floor 13A', look: H({ t: 'tall', head: 'none', body: 'suit', c: ['#2a2a2a', '#1a1a1a', '#d0d0d0', '#2a2a2a'] }), behavior: 'statue', solid: true, lines: ['He has no face. He only moves when you are not looking at him.'] }],
    place: [SOUL([EN('There is no thirteenth floor in this hospital. The night nurses take the stairs anyway.')]),
      SOUL([EN('Room 13A. Patient: none. Visitor: one, small, every night.')]),
      SOUL([EN('I waited for the lift for nine years. It stopped here once. I did not get out.')])],
    info: { summary: 'A floor that does not exist, reached late in the dream by certain lifts.', rules: ['Appears: late and final phases, one chance in three, in the Vigil Hospital, the Glass Tower, the Lift That Never Stops and the Hospital Beneath Reality.'], lore: 'The floor you are afraid of arriving at.' } });

  /* W143 — L'Escalier dans le noir */
  S({ id: 'W143', name: 'The Stairs in the Dark', depth: 3, tier: 'hard', back: 'NEXUS', backLook: 'stairs', backLabel: 'climb back up to the Nexus',
    spawnRule: { in: { depthMin: 1, depthMax: 2 }, cond: { all: [{ dark: true }, { phase: 'final' }] }, chance: 0.12, as: 'stairs', label: 'a staircase going down into the dark' },
    map: (function () { var g = K.grid(14, 40, ' '); g.rect(5, 0, 4, 40, 's'); return g.rows(); })(), look: { stairs: { p: 'hstripes', c: ['#2a2a30', '#1a1a20'] } },
    music: null, amb: { type: 'drip', vol: 0.05 }, dark: 0.97, playerLight: 0.9, totalDark: true, backAt: [6, 0],
    doors: [{ to: 'W181', at: [6, 39], look: 'hole', label: 'at the bottom, water', cond: { all: [{ effect: 'E77' }, { effectsCount: 50 }] }, locked: 'At the bottom of the stairs, the dark gets darker. Not yet.' }],
    npcs: [{ name: 'The Voice That Counts the Steps', kind: 'voice', invisible: true, look: { t: 'voice' }, ambientLines: [EN('One hundred and twelve. One hundred and thirteen.'), EN('There is no bottom. There is a moment when you stop counting.')], ambientEvery: 10, hearDist: 40 }],
    place: [SOUL([EN('When the lamp goes off, the stairs grow by one step. Every night.')]),
      SOUL([EN('Mother leaves at nine. The dark arrives at one minute past.')]),
      SOUL([EN('Do not count out loud. Something down there is counting with you.')])],
    info: { summary: 'A narrow staircase going down into almost total darkness.', rules: ['Appears: light off, final phase, one chance in eight, in depth 1–2 worlds.'], lore: 'Fear of the dark, when the mother is not there.' } });

  /* W144 — La Maison au loin */
  S({ id: 'W144', name: 'The House in the Distance', depth: 3, tier: 'hard', back: 'W011', backLabel: 'the desert',
    spawnRule: { in: ['W011', 'W085', 'W039'], chance: 0.25, as: 'door', look: 'house', lookOpt: { c: ['#d8c8a8', '#6a3a3a'], lit: true }, label: 'a house, in the distance' },
    map: (function () { var g = K.grid(28, 18, ' '); g.box(0, 0, 28, 18, '#', '.'); g.vline(14, 0, 17, '#'); g.set(14, 9, '.'); return g.rows(); })(), look: K.LOOK.house, style: { tallWalls: true, renderer: 'sepia' }, music: 'farhouse',
    doors: [{ to: 'W152', look: 'window', label: 'the window looks out on an endless landscape' }],
    decor: [{ look: 'table', opt: { cloth: '#e8d8c8' }, lines: ['A table for four. Four bowls. Chopsticks, spoons, a child’s fork.'] }, { look: 'photo', opt: { person: true }, lines: ['A family photo: a grandmother, a mother, a blurred man, a little girl. Everyone is looking at the little girl.'] }, { look: 'bed', lines: ['A bed just the right size, with your favourite blanket. It smells of the grandmother’s washing powder.'] }],
    npcs: [{ name: 'Nobody', look: ghost('rgba(255,240,220,0.3)', 22), behavior: 'wander', radius: 4, solid: false, talkable: true, lines: ['A warmth passes by you, like someone coming back from the kitchen.', { seq: ['The house speaks, with everyone’s voice at once.', KS('왔어?', 'You’re back?'), EN('You’re home?')] }] }],
    place: [SOUL([EN('Draw your family, the teacher said. She drew four bowls and no faces.')]),
      SOUL([KS('밥 다 됐다. 다들 와서 앉아.', 'The rice is ready. Everyone, come and sit down.')]),
      SOUL([EN('This house is lit every night. Nobody has ever lived in it.')])],
    info: { summary: 'A lit house glimpsed far off in the deserts, sometimes; inside, a complete family that does not exist.', rules: ['Appears: one chance in four in the Desert of Telephones, the Salt Desert and the Grey Beach.'], lore: 'The house you draw when they ask you to “draw your family”.' } });

  /* W145 — Le Passage quand on s'arrête */
  S({ id: 'W145', name: 'The Passage When You Stop', depth: 3, tier: 'hard', back: 'W001', backLabel: 'set off again',
    spawnRule: { in: { depthMin: 1, depthMax: 3, outdoor: true }, still: 20, as: 'path', look: 'sparkle', label: 'a passage that opened while you stood still' },
    gen: { type: 'empty', w: 40, h: 28, opts: { floor: '"', border: '#' } }, look: { leafg: { p: 'grass', c: ['#7a9a6a', '#6a8a5a', '#8aaa7a', '#5a7a4a'] }, wall: { p: 'hedge', c: ['#4a6a3a', '#3a5a2a', '#5a7a4a', '#2a4a1a'] } },
    style: { renderer: 'watercolor', sky: ['#e0e8f0', '#f8f8ff'] }, music: 'stillness', amb: { type: 'wind', vol: 0.02 },
    decor: [{ look: 'bench', n: 3, lines: ['A bench. There is nothing to do here, and that is just fine.'] }, { look: 'flower', n: 8, solid: false, lines: ['A flower that only blooms if nobody is looking at it. You close your eyes.'] }],
    npcs: [{ name: 'The Slow Butterfly', look: { t: 'moth', c: ['#f0f0c0'], h: 12, shadow: false }, behavior: 'fly', radius: 6, speed: 0.4, solid: false, lines: ['It lands on your knee and does not fly off again. You do not move.'] }],
    place: [SOUL([EN('Nobody needs you here. Rest.')]),
      SOUL([KS('가만히 있어도 돼.', 'It’s all right to keep still.')]),
      SOUL([EN('I stopped once, on the way to school. I was late. It was the best morning of the year.')])],
    info: { summary: 'A peaceful meadow with nothing to do; the only way in is to stand still.', rules: ['Appears: stand still for 20 seconds in an outdoor world of depth 1–3.'], lore: 'The right to do nothing.' } });

  /* W146 — La Chambre de la sorcière */
  S({ id: 'W146', name: 'The Witch’s Room', depth: 3, tier: 'hard', back: 'NEXUS', backLook: 'ndoor', backLabel: 'flee to the Nexus',
    spawnRule: { in: { depthMin: 1, depthMax: 4, core: false }, cond: { witchHere: true }, chance: 0.5, as: 'door', lookOpt: { style: 'red', c: ['#3a0a0a'] }, label: 'a red door that was not there before' },
    map: K.hall(18, 12, '#', '.'), look: { floor: { p: 'carpet', c: ['#3a0a10', '#2a0508'] }, wall: { p: 'flat', c: ['#1a0508', '#100306'], topColor: '#1a0508' }, wallface: { p: 'wallpaper', c: ['#5a1a2a', '#3a0a1a', '#2a0510'], skirt: '#000000' } },
    style: { tallWalls: true }, music: 'witchroom', dark: 0.6,
    decor: [{ look: 'bed', opt: { c: ['#2a2a2a', '#5a1a2a'] }, lines: ['A child’s bed with black sheets. On the pillow, five little slips of paper: “hush, Mum is sleeping”, “sew it up, nobody must see”, “do what the others do”, “if someone rings, don’t open”, “he will come back”.'] }, { look: 'frame', n: 2, lines: ['A frame: the house rule, handwritten by a child, so as to remember.'] }],
    signs: [{ glyphs: 'every rule was a protection', lines: [EN('I wrote them down so I would not forget. Then they would not forget me.')] }],
    place: [SOUL([EN('Hush, mother is sleeping. That one was the first. She was four.')]),
      SOUL([EN('A rule is a wall you build when nobody comes. Then the wall starts to walk.')]),
      SOUL([EN('The red door only appears when one of them is near. They come home to sleep.')])],
    info: { summary: 'The room the witches come from: a child’s bed with black sheets, five little rules written by hand.', rules: ['Appears: one chance in two in a secret world when a witch is there.'], secrets: ['Each witch is a house rule learned too early.'], lore: 'The rules that once protected her have become huntresses.' } });

  /* W147 — La Salle corrompue */
  S({ id: 'W147', name: 'The Corrupted Room', depth: 4, tier: 'hard', back: 'NEXUS', backLook: 'ndoor',
    spawnRule: { in: { depthMin: 1, depthMax: 4 }, cond: { fn: function (x) { var rt = (x && x.rt) || YN.game.rt; return !!rt && YN.save.corruption(rt.id) >= 2; } }, as: 'door', lookOpt: { style: 'metal', c: ['#000000'], symbol: '█' }, label: 'a door crossed out in black' },
    gen: { type: 'rooms', w: 40, h: 30, opts: { depth: 3 } }, look: { floor: { p: 'paper', c: ['#e8e4d8'] }, wall: { p: 'flat', c: ['#101010', '#080808'] } },
    style: { renderer: 'engraving' }, music: 'corrupted', amb: { type: 'static', vol: 0.06 },
    doors: [{ to: 'W153', look: 'door', opt: { style: 'shoji' }, label: 'a house that unfolds' }],
    decor: [{ look: 'sign', lines: ['A soul struck through in black, half erased.', EN('My name was ███. I was ████ years old. I lived ███.')] },
      { look: 'sign', lines: [EN('Everything is fine. Everything is fine.'), EN('…is it?')] },
      { look: 'sign', lines: [EN('I used to point somewhere. Someone erased the arrow.')] },
      { look: 'sign', lines: [EN('Nothing happened.'), EN('Nothing happened to ████.')] },
      { look: 'sign', lines: [KN('아무 일도 없었습니다.', 'Nothing happened.')] },
      { look: 'sign', lines: [KS('괜찮아, 괜찮아. 지우면 괜찮아.', 'It’s fine, it’s fine. Erase it and it’s fine.')] }],
    npcs: [{ name: 'A Crossed-Out Word', count: 4, look: { t: 'shadow', c: ['#0a0a0a'], h: 14 }, behavior: 'wander', radius: 4, lines: ['A black line that walks. When it passes over a word, the word disappears.'] }],
    place: [SOUL([EN('She erases so that everything is fine. She never asks what was underneath.')]),
      SOUL([EN('Protocol zero: if it hurts, cross it out.')]),
      SOUL([EN('With ink, you can still read me. Under the black, I am still here.')])],
    info: { summary: 'A paper place covered in crossings-out, which only appears in worlds the Priestess has corrupted.', rules: ['Appears: in a world corrupted to level 2 or higher.'], lore: 'What is left when everything has been corrected.' } });

  /* W148 — La Fête d'anniversaire */
  S({ id: 'W148', name: 'The Birthday Party', depth: 2, tier: 'mid', back: 'NEXUS', backLook: 'ndoor',
    spawnRule: { in: { depthMin: 1, depthMax: 1 }, cond: { dreams: 10 }, chance: 0.08, as: 'door', lookOpt: { style: 'red', c: ['#e06080'], symbol: '♥' }, label: 'a door decorated with balloons' },
    map: K.hall(24, 16, '#', ','), look: { floor2: { p: 'checker', c: ['#f0e0e8', '#e0b0c0'] }, wall: { p: 'flat', c: ['#3a2a3a', '#2a1a2a'], topColor: '#3a2a3a' }, wallface: { p: 'wallpaper', c: ['#f8d8e8', '#e8b8c8', '#c08090'], skirt: '#ffffff' } },
    style: { tallWalls: true }, music: 'birthday',
    decor: [{ look: 'cake', lines: ['A cake with twelve candles. Eleven are lit. The twelfth is waiting.'] }, { look: 'balloons', n: 2, lines: ['Balloons. On one of them: “happy birthday S__”. The name has got wet.'] }, { look: 'chair', n: 6, lines: ['An empty chair. There are six empty chairs.'] }],
    npcs: [{ name: 'The Clown Who Sings Alone', look: H({ body: 'suit', c: ['#e04040', '#4040e0', '#f8f8f8', '#e04040'], eyes: 'sad', mouth: 'smile' }), behavior: 'static', solid: true,
      lines: [{ seq: [KS('생일 축하합니다…', 'Happy birthday to you…'), 'He sings alone, counting the guests on his fingers: zero.'] }, EN('They were supposed to come. They said they would come.')],
      hears: [{ match: ['happy birthday', 'birthday', 'happy bday', 'thank you', 'thanks', '고마워', '생일 축하해', '생일 축하합니다'], lines: ['The clown claps very loudly, enough for ten. The twelfth candle lights itself.'], do: [{ note: 'n_birthday' }] }] }],
    place: [SOUL([EN('Twelve candles. She turned twelve in a dream, because nobody was awake for it.')]),
      SOUL([EN('The invitations are still in her school bag. Six of them. Folded very small.')]),
      SOUL([KS('케이크는 내일 사 올게. 약속해.', 'I’ll bring a cake home tomorrow. Promise.')])],
    info: { summary: 'A birthday party laid out for a child, with six empty chairs.', rules: ['Appears: after ten dreams, rarely, in a depth-1 world.'], lore: 'The invitations she never dared to hand out.' } });

  /* W149 — Le Quai du rêve n° 7 */
  S({ id: 'W149', name: 'Dream Platform No. 7', depth: 2, tier: 'mid', back: 'W002', backLook: 'stairs',
    spawnRule: { in: ['W002'], cond: { fn: function () { var d = YN.save.dream; return !!d && d.no % 7 === 0; } }, as: 'stairs', label: 'a staircase marked “7”' },
    map: (function () { var g = K.grid(50, 12, ' '); g.box(0, 0, 50, 12, '#', '.'); g.rect(1, 7, 48, 4, 'r'); g.hline(1, 48, 6, ','); return g.rows(); })(), look: K.LOOK.station, style: { tallWalls: true, renderer: 'watercolor' }, music: 'platform7',
    decor: [{ look: 'bench', n: 3, lines: ['A bench. On the backrest: “every seven dreams, this platform exists”.'] }, { look: 'board', opt: { lines: ['DREAM NO. 7', 'DREAM NO. 14', 'DREAM NO. 21'], color: '#80e0ff' }, lines: [{ t: function () { return 'DEPARTURE: dream no. ' + (YN.save.dream ? YN.save.dream.no : '?') + '. Track 7. Destination: a dream you would already have been to.'; } }] }],
    npcs: [{ name: 'The Inspector with the Calendar', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#2a4a6a', '#1a3a5a', '#e0c0a0', '#c8a040'], acc: 'ticket' }), behavior: 'static', solid: true, lines: [EN('This platform only exists one dream in seven. You came on the right day. Or the wrong one.'), EN('The next one is in seven dreams. I’ll be here. I don’t move, in between.')] }],
    place: [SOUL([EN('Seven nights make a week. Mother works five of them.')]),
      SOUL([EN('Mr Ahn never comes to platform seven. He says it is not his train.')]),
      SOUL([EN('I counted my weeks in dreams. I had more dreams than weeks.')])],
    info: { summary: 'A station platform that only exists one night in seven.', rules: ['Appears: at the Station of the Missing Hours, one dream in seven (when the dream number is a multiple of 7).'], lore: 'Weeks counted in dreams.' } });

  /* W150 — La Boutique des souvenirs */
  S({ id: 'W150', name: 'The Souvenir Shop', depth: 2, tier: 'mid', back: 'W003',
    spawnRule: { in: ['W003', 'W008', 'W020', 'W015'], cond: { talks: { N007: 5 } }, chance: 0.5, as: 'door', lookOpt: { style: 'red', c: ['#8a2a3a'], symbol: 'T' }, label: 'Knock-Knock’s shop' },
    map: K.hall(20, 12, '#', '.'), look: K.LOOK.house, style: { tallWalls: true }, music: 'souvenirs',
    decor: [{ look: 'crate', n: 4, lines: ['A box of “joke endings”. Empty.', 'A box of laughs in jars. Just one, very small.', 'A suitcase marked “J.”, on special offer. Not for sale.'] }, { look: 'till', lines: ['Knock-Knock’s till. In the drawer, raffle tickets from 2019.'] }],
    npcs: [{ name: 'Knock-Knock’s Mannequin', look: H({ head: 'doorbell', body: 'suit', c: ['#8a2a3a', '#5a1a2a', '#e8c8a8', '#f0d040'], alpha: 0.7 }), behavior: 'static', solid: true, lines: [{ seq: [EN('Knock knock.'), 'It is a mannequin, with a recording inside.', EN('…who’s there?…'), 'The recording always stops there.'] }] }],
    place: [SOUL([EN('He told one joke every evening. On the last evening, he only told the first half.')]),
      SOUL([EN('The suitcase came back without him. Then the suitcase left too.')]),
      SOUL([EN('Raffle tickets, 2019. First prize: a weekend for three. Nobody checked the numbers.')])],
    info: { summary: 'Knock-Knock’s souvenir shop, which sets up in a street once you have listened to him a lot.', rules: ['Appears: after five conversations with Knock-Knock, one chance in two, in Town at Dusk, the Empty Neighbourhood, the Closed Funfair or the Arcade.'], lore: 'The father’s things, kept in a shop window.' } });

  /* ---------------- les trois générateurs ---------------- */
  /* W151 — Le Dédale instable (générateur 1) */
  S({ id: 'W151', name: 'The Unstable Maze', depth: 3, tier: 'hard', back: 'W105', backLook: 'hole',
    gen: { type: 'maze', w: 45, h: 33, perDream: true, opts: { loops: 0.1, rooms: 5, decor: 'o', decorRate: 0.01 } },
    look: { floor: { p: 'flat', c: ['#4a4458', '#403a4e'] }, wall: { p: 'brick', c: ['#6a5a7a', '#4a3a5a', '#2a1a3a'] }, rock: { p: 'rock', c: ['#8a7a9a', '#6a5a7a', '#aa9aba'] } },
    variants: { lit: { cond: { phase: ['opening', 'middle'] }, dark: 0.35 }, late: { cond: { phase: ['late', 'final'] }, dark: 0.85, look: { floor: { p: 'flat', c: ['#2a2438', '#241e30'] } } } },
    music: 'unstablemaze', amb: { type: 'wind', vol: 0.04 },
    doors: [{ to: 'W154', look: 'door', opt: { style: 'metal', c: ['#6a5a7a'] }, label: 'an exit' }, { to: 'W155', look: 'door', opt: { style: 'metal', c: ['#5a6a7a'] }, label: 'another exit' }, { to: 'W106', look: 'door', opt: { style: 'wood', c: ['#6a4a3a'] }, label: 'a third exit', cond: { phase: ['late', 'final'] } }, { to: 'W180', look: 'hole', label: 'a hidden passage', secret: true, cond: { equipped: 'E14' } }],
    decor: [{ look: 'statue', n: 2, lines: ['A landmark: a statue of a girl pointing the way. She points a different way every night.'] }, { look: 'sign', lines: [EN('Tonight, the maze has another plan.')] },
      { look: 'sign', lines: [EN('That way. …No. I lied. I always lie a little, so you keep walking.')] },
      { look: 'sign', lines: [EN('When she was afraid, the way to school was never the same twice.')] }],
    npcs: [{ name: 'The Despairing Cartographer', look: H({ t: 'old', body: 'coat', c: ['#6a5a3a', '#4a3a2a', '#d8b898', '#c8c8c8'], acc: 'map' }), behavior: 'wander', radius: 6, lines: [EN('I have yesterday’s map. It’s wrong today. It will be right tomorrow, maybe, for someone else.')] }],
    place: [SOUL([EN('Take the long way. The short way goes past the school gates.')]),
      SOUL([EN('Late in the dream the walls come closer. They are only tired.')]),
      SOUL([EN('Some walls are only drawn. Look at them through glass.')])],
    info: { summary: 'Generator no. 1: a maze drawn at random each dream, with rooms, loops, landmarks and several exits; it grows darker late in the dream.', rules: ['A different layout every dream.', 'A third exit late in the dream; a hidden passage with the Glasses.'], lore: 'The way to school, which is never the same when you are afraid.' } });

  /* W152 — Le Paysage infini (générateur 2) */
  S({ id: 'W152', name: 'The Endless Landscape', depth: 3, tier: 'mid', back: 'W144', backLook: 'window',
    inf: { type: 'forest', floor: '.', tree: '^', cache: 64, landmarks: 'o', landmarkRate: 0.08 }, look: K.LOOK.forest, tall: K.TALL.forest, outdoor: true,
    extra: { inf: { type: 'forest', floor: '.', tree: '^', cache: 64, landmarkDecor: [{ look: 'statue' }, { look: 'well' }, { look: 'house', opt: { c: ['#d8c8a8', '#6a3a3a'] } }, { look: 'telepole' }, { look: 'bench' }], landmarks: 'o' } },
    music: 'endlesslandscape', amb: { type: 'birds', vol: 0.04 }, weather: { leaves: true },
    doors: [{ to: 'W156', look: 'sign', label: 'a signpost: “further on”' }],
    npcs: [{ name: 'The Walker', look: H({ t: 'adult', hairStyle: 'long', body: 'coat', c: ['#6a7a5a', '#4a5a3a', '#e0c0a0', '#3a2a1a'], acc: 'cane' }), behavior: 'static', at: [18, 18], solid: true, lines: [EN('It never ends. But it changes, if you look closely: the landmarks never come back in the same order.')] }],
    place: [SOUL([EN('Night drive. Mother at the wheel, the radio low. You were asleep in the back, and you were not.')], [13, 13]),
      SOUL([EN('Count the poles. At a hundred, we are there. Nobody ever got to a hundred.')], [19, 13]),
      SOUL([EN('The well, the house, the statue. Again. The road is not repeating itself. It is remembering.')], [14, 18])],
    info: { summary: 'Generator no. 2: wooded countryside stretching on without end, chunk by chunk; rare landmarks (statues, wells, houses, poles) mark the road.', rules: ['Infinite world, generated in 32×32 chunks (bounded memory).'], lore: 'Car journeys at night, asleep in the back.' } });

  /* W153 — La Maison qui se déplie (générateur 3) */
  S({ id: 'W153', name: 'The Unfolding House', depth: 4, tier: 'hard', back: 'W147',
    gen: { type: 'rooms', w: 44, h: 32, shifting: true, opts: { depth: 4 } }, look: K.LOOK.house, style: { tallWalls: true },
    extra: { styles: [{ renderer: 'hd' }, { renderer: 'watercolor' }, { renderer: 'sepia' }, { renderer: 'crayon' }], lookShift: [{}, { floor: { p: 'carpet', c: ['#5a3a4a', '#4a2a3a'] } }, { floor: { p: 'tile', c: ['#e0e0d8', '#b0b0a8'] } }, { floor: { p: 'tatami', c: ['#c8c088'] } }] },
    mech: [{ type: 'shifting', every: 35 }], music: 'unfoldinghouse',
    doors: [{ to: 'W157', look: 'door', opt: { style: 'wood', c: ['#4a3a2a'] }, label: 'the front door, always somewhere else' }],
    decor: [{ look: 'sofa', n: 2, lines: ['The sofa. It used to be in the living room. The living room is a kitchen now.'] }, { look: 'fridge', n: 1, lines: ['The fridge has moved rooms, but the note on it is the same: “데워 먹어”.'] }],
    npcs: [{ name: 'The Tenant, from Behind', look: H({ t: 'tall', head: 'round', body: 'coat', c: ['#4a4a5a', '#3a3a4a', '#d8b898', '#3a3a3a'], alpha: 0.5 }), behavior: 'turnaway', solid: false, talkable: true, lines: ['You see him from behind, at the end of a corridor, tidying up. He whistles. He vanishes at the next corner.'] }],
    place: [SOUL([EN('When someone leaves, the rooms move to fill the gap. That is all this is.')]),
      SOUL([KS('데워 먹어. 엄마 늦어.', 'Heat it up and eat. Mum will be late.')]),
      SOUL([EN('The sofa remembers where the living room was. Sit on it and you are home, wherever it is.')]),
      SOUL([EN('He whistles while he tidies. He is tidying for someone who comes back tomorrow.')])],
    info: { summary: 'Generator no. 3 (shifting dream): a house whose rooms rearrange themselves and whose style changes every 35 seconds.', rules: ['Layout and style renew during the dream.'], lore: 'A house you no longer recognise once someone has left it.' } });

  /* ---------------- géographies impossibles ---------------- */
  /* W154 — Le Couloir plus long dedans */
  S({ id: 'W154', name: 'The Corridor Longer on the Inside', depth: 3, tier: 'mid', back: 'W151', wrap: true, loop: true, map: K.corridor(16, 2, '#', '.'),
    look: { floor: { p: 'wood', c: ['#6a4a30', '#4a3020', '#7a5a40'] }, wall: { p: 'flat', c: ['#2a1a10', '#1a100a'], topColor: '#2a1a10' }, wallface: { p: 'wallpaper', c: ['#a89070', '#887050', '#5a4a30'], skirt: '#3a2a1a' } },
    style: { tallWalls: true }, music: 'longcorridor',
    mech: [{ type: 'loopCount', key: 'lc', onLoop: function (rt, n) { YN.game.toast(Math.abs(n) + ' × 16 steps. From outside, the corridor is four steps long.'); YN.world.reeval(rt); } }],
    doors: [{ to: 'W155', look: 'door', opt: { style: 'wood' }, cond: { fn: function () { return Math.abs(YN.save.temp('lc') || 0) >= 5; } }, label: 'the door at the end, at last' }],
    decor: [{ look: 'frame', n: 2, lines: ['A plan of the flat hanging on the wall: on it, this corridor is four steps long.'] }],
    place: [SOUL([EN('Four steps from her door to mine. At night it took a hundred.')]),
      SOUL([EN('If her door is closed, she is sleeping. If it is open, she is gone.')]),
      SOUL([EN('Keep walking. The hallway gets tired before you do.')])],
    info: { summary: 'A corridor four steps long, seen from outside, which never ends when you walk along it.', rules: ['Loops; on the fifth lap, the door at the end appears.'], lore: 'The corridor between her bedroom and her mother’s, at night.' } });

  /* W155 — La Pièce qui se connecte à elle-même */
  S({ id: 'W155', name: 'The Room That Connects to Itself', depth: 3, tier: 'mid', back: 'W154', wrap: true, loop: true, map: (function () { var g = K.grid(9, 7, '.'); g.set(4, 3, '}'); return g.rows(); })(),
    look: { floor: { p: 'carpet', c: ['#5a4a6a', '#4a3a5a'] } }, tall: { '}': { look: 'lamp' } }, music: 'selfroom',
    doors: [{ to: 'W157', look: 'door', opt: { style: 'wood', c: ['#8a6a4a'] }, cond: { fn: function () { return YN.game.player.dir === 'up' && YN.game.clock % 10 < 5; } }, label: 'the door you only see when you look up' }],
    decor: [{ look: 'mirror', lines: ['A mirror. You see yourself from behind, one step ahead of you.'] }],
    place: [SOUL([EN('Round and round the bedroom. Nine steps. Seven steps. Again.')]),
      SOUL([EN('Look up. Doors are where nobody looks.')])],
    info: { summary: 'A small room where every exit leads back into the room.', rules: ['The world loops over a few steps.'], lore: 'Going round in circles in your bedroom.' } });

  /* W156 — Les Repères qui épellent */
  S({ id: 'W156', name: 'The Landmarks That Spell', depth: 4, tier: 'hard', back: 'W152', outdoor: true,
    inf: { type: 'plain', floor: '.', scatter: ['^'], density: 0.01, landmarks: 'o', landmarkRate: 0.2, cache: 48 },
    extra: { inf: { type: 'plain', floor: '.', scatter: ['^'], density: 0.01, landmarks: 'o', landmarkRate: 0.2, cache: 48, landmarkDecor: 'RETURNHERE'.split('').map(function (ch) { return { look: 'glyph', opt: { ch: ch.toLowerCase(), c: ['#e8e0c0'] } }; }) } },
    look: { floor: { p: 'grass', c: ['#7a8a5a', '#6a7a4a', '#8a9a6a', '#5a6a3a'] } }, tall: K.TALL.forest, music: 'spellingmarks',
    doors: [{ to: 'W160', look: 'well', label: 'a well among the landmarks' }],
    npcs: [{ name: 'The Landscape Reader', look: H({ t: 'old', body: 'robe', c: ['#8a7a5a', '#6a5a3a', '#d8b898', '#c8c8c8'], acc: 'book' }), behavior: 'static', at: [18, 16], solid: true, lines: [EN('The landmarks are letters. If you read them in the order you meet them, they say something. Always the same thing.')] }],
    place: [SOUL([EN('Ten stones. One sentence. The sentence is about someone.')], [13, 13]),
      SOUL([EN('Grandmother’s letters were shapes before they were sounds. She traced them in my palm.')], [19, 13]),
      SOUL([EN('A landscape repeated enough times starts to talk. So does a silence.')], [14, 19])],
    info: { summary: 'An endless plain where landmark stones bear signs; in the order you come across them, they end up forming words.', rules: ['Infinite world; the carved landmarks come back in a pattern.'], secrets: ['Deciphered, the signs say: RETURN HERE.'], lore: 'Repeated landscapes that end up talking.' } });

  /* W157 — Le Début qui change */
  S({ id: 'W157', name: 'The Changing Beginning', depth: 4, tier: 'hard', back: 'W155', wrap: true, loop: true,
    gen: { type: 'forest', w: 30, h: 22, shifting: true, opts: { density: 0.2 } }, look: K.LOOK.forest, tall: K.TALL.forest,
    extra: { styles: [{ renderer: 'hd' }, { renderer: 'mono' }, { renderer: 'charcoal' }, { renderer: 'psychedelic' }] }, music: 'changingstart',
    mech: [{ type: 'loopCount', key: 'dc', onLoop: function (rt) { var n = (YN.save.temp('shift_W157') || 0) + 1; YN.save.temp('shift_W157', n); YN.game.rebuildWorld(); } }],
    doors: [{ to: 'W160', look: 'hole', cond: { fn: function () { return (YN.save.temp('shift_W157') || 0) >= 4; } }, label: 'a hole, which appeared after four returns' }],
    place: [SOUL([EN('You came back to the start. The start did not wait for you.')]),
      SOUL([EN('Every time I come home, the flat is a little different. Same furniture. Fewer people.')]),
      SOUL([EN('Four times around. Then the ground gives up.')])],
    info: { summary: 'A forest that loops; every time you come back to the start, the start has changed style and shape.', rules: ['Going all the way round changes the world; after four returns, a hole leads further down.'], lore: 'Coming back to where you started and no longer recognising it.' } });

  /* W158 — Le Phare dans le blanc */
  S({ id: 'W158', name: 'The Lighthouse in the White', depth: 3, tier: 'hard', back: 'W043', outdoor: true,
    gen: { type: 'empty', w: 44, h: 34, opts: { floor: '.' } }, look: { floor: { p: 'flat', c: ['#f8f8f8', '#f0f0f0'] } }, style: { sky: ['#ffffff', '#f0f0f0'], cliffH: 0 }, music: 'whitelighthouse', amb: { type: 'wind', vol: 0.03 },
    place: [{ id: 'lamp', type: 'anchor', at: [22, 16], look: 'lighthouse', lines: [{ if: { flag: 'lighthouse_W158' }, t: 'The white lighthouse turns in the white. Its light can only be seen by the shadow it casts.' }, { if: { equipped: 'E05' }, t: 'In all this white, your flame is the only colour. The lighthouse lights up.', do: [{ set: { lighthouse_W158: true } }, { sfx: 'reveal' }] }, { t: 'A white lighthouse in the white. Unlit. Nothing sets it apart from the rest, except that it is waiting for a flame.' }] },
      SOUL([EN('A lighthouse is for the ones still out at sea. Not for the shore.')]),
      SOUL([EN('Three lights, and the deep water opens. That is what the divers say.')]),
      SOUL([EN('White on white. You only see her by the shadow she leaves.')])],
    npcs: [{ name: 'Someone’s Shadow', look: { t: 'shadow', c: ['#c8c8c8'], h: 22 }, behavior: 'wander', radius: 8, lines: ['The only grey thing here. It follows the lighthouse beam as it turns.'] }],
    info: { summary: 'A white lighthouse lost in an entirely white plain.', rules: ['Light it with the Lantern equipped (one of the three lighthouses for W181).'], lore: 'A light you only see by its shadow.' } });

  /* W159 — La Statue véritable */
  S({ id: 'W159', name: 'The True Statue', depth: 4, tier: 'hard', back: 'W137', outdoor: true, secretLevel: 5,
    map: (function () { var g = K.grid(30, 24, '.'); g.border('#'); g.ellipse(15, 12, 5, 4, ','); g.set(15, 11, 'M'); return g.rows(); })(), look: Object.assign({}, K.LOOK.forest, { floor2: { p: 'flowers', c: ['#3f7a3c', '#f070a0', '#f8e070', '#ffffff'] } }),
    marks: { M: { id: 'truestatue', type: 'anchor', look: 'statue', lookOpt: { flowers: true }, lines: ['The statue from the Garden, but whole, unworn. An elderly woman, hands clasped, smiling.', 'On the plinth, a plaque the rain has never touched: “안옥순 (1942–2023)”.', 'Below it, carved by someone else, more clumsily: “엄마, 미안해. — 미란”. (Mum, I’m sorry. — Mi-ran.)'], use: [{ secret: 'statue_truth' }, { note: 'n_statue_truth' }] } },
    style: { renderer: 'watercolor', sky: ['#f0e0c0', '#fff8e8'] }, music: 'truestatue', amb: { type: 'birds', vol: 0.05 },
    npcs: [{ name: 'The Blackbird', look: { t: 'bird', c: ['#16161c', 0, 0, '#e8a53a'], h: 14 }, behavior: 'static', at: [18, 9], solid: true, lines: ['It whistles the three notes. The chime’s notes, the grandmother’s notes.'] }],
    place: [SOUL([KS('엄마, 나 프랑스 가. 미안해. 금방 올게.', 'Mum, I’m going to France. I’m sorry. I’ll be back soon.')]),
      SOUL([EN('She whistled three notes to the blackbirds. They answered with four.')]),
      SOUL([KS('엄마, 미안해. 그날 밤에도 나 일하고 있었어.', 'Mum, I’m sorry. That night too, I was at work.')]),
      SOUL([EN('Nobody’s statue, the flower says. The flower lies so the garden stays quiet.')]),
      SOUL([KN('옥순아, 많이 컸구나.', 'Ok-sun, how you’ve grown.')]),
      SOUL([EN('Two dates on the stone. Everything in between was watered by hand.')])],
    info: { summary: 'The Garden statue as it once was, surrounded by flowers; here the plaque can be read.', secrets: ['“In memory of Mum” is Mi-ran’s grief for her own mother, Ok-sun.'], lore: 'The Garden belongs to the mother’s grief, not only to Sora’s.' } });

  /* W160 — Le Puits des noms */
  S({ id: 'W160', name: 'The Well of Names', depth: 4, tier: 'hard', back: 'W156', backLook: 'well',
    map: (function () { var g = K.grid(20, 20, ' '); g.ellipse(9.5, 9.5, 9, 9, '.'); g.ellipse(9.5, 9.5, 3, 3, '_'); return g.rows(); })(), look: { floor: { p: 'stone', c: ['#5a5a54', '#4a4a44', '#3a3a34'] }, pit: { p: 'void', c: ['#000'] } },
    style: { renderer: 'engraving', cliffH: 0.8 }, music: 'wellofnames', amb: { type: 'drip', vol: 0.06 }, dark: 0.6,
    fall: { to: 'W175', cond: { effectsCount: 45 } },
    doors: [{ to: 'W125', look: 'stairs', label: 'back up to the City That Replaces Itself' }],
    signs: [{ glyphs: 'ok sun mi ran so ra jae sik', lines: ['She walks round the rim of the well, whispering.', EN('Say them. Names sink if nobody says them.')] }],
    place: [SOUL(['A woman’s voice, from very far away, in another winter.', KN('재식아! 재식아!', 'Jae-sik! Jae-sik!')]),
      SOUL([KS('미란아, 밥 먹었니?', 'Mi-ran, have you eaten?')]),
      SOUL([EN('Sora. They chose a name that works in both languages. It still went unspoken.')]),
      SOUL([EN('One name is missing. It left with a suitcase. Only its first letter stayed.')]),
      SOUL([KS('김 과장님, 오늘도 야근이세요?', 'Manager Kim, working late again tonight?')])],
    npcs: [{ name: 'The Voice in the Well', kind: 'voice', invisible: true, look: { t: 'voice' }, ambientLines: ['From the bottom of the well, names rise one by one, then sink back down.'], ambientEvery: 14, hearDist: 12,
      hears: [{ any: true, lines: ['The well repeats what you said, then adds a name you did not say.'] }] }],
    info: { summary: 'A round well at the back of a stone room; names rise up from below.', rules: ['With 45 effects, you can let yourself fall in (W175).'], lore: 'The names the family no longer says.' } });
})(typeof window !== 'undefined' ? window : globalThis);
