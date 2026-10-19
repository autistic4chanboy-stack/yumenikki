/* =========================================================================
 *  MONDES SECRETS (3/8) — W081 à W100
 *  Les horloges et la voie zéro ; le casino d'en bas ; la mer ;
 *  la cour d'en dessous ; la grotte des noyaux.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  /* répliques parlées : anglais, coréen du Sud, coréen du Nord (tr = traduction française) */
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  /* une âme : elle dit son fragment une fois, puis se défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }

  /* W081 — La Salle des horloges */
  S({ id: 'W081', name: 'The Clock Room', depth: 3, tier: 'hard', back: 'W080', map: K.hall(30, 20, '#', '.'),
    look: { floor: { p: 'wood', c: ['#5a3a2a', '#4a2a1a', '#6a4a3a'] }, wall: { p: 'flat', c: ['#1a100a', '#100a06'], topColor: '#1a100a' }, wallface: { p: 'panel', c: ['#6a4a2a', '#4a2a1a', '#3a1a0a'], skirt: '#c8a040' } },
    style: { tallWalls: true }, music: 'clocks', amb: { type: 'clock', vol: 0.12 }, dark: 0.4,
    doors: [{ to: 'W082', look: 'door', opt: { style: 'wood', symbol: '0' }, label: 'track zero' }],
    place: [{ id: 'c1', type: 'clock', at: [6, 6], look: 'clock', lookOpt: { hour: 1, min: 0 } }, { id: 'c2', type: 'clock', at: [12, 12], look: 'clock', lookOpt: { hour: 7, min: 0 } }, { id: 'c3', type: 'clock', at: [18, 6], look: 'clock', lookOpt: { hour: 10, min: 0 } }, { id: 'c4', type: 'clock', at: [24, 12], look: 'clock', lookOpt: { hour: 2, min: 0 } },
      { id: 'good', type: 'clock', at: [15, 2], look: 'clock', lookOpt: { hour: 4, min: 20 }, animated: true, lines: ['The only clock that works. It says four o’clock. This one, at least, moves on.'] },
      SOUL([EN('Nine at night, she leaves. Seven in the morning, she comes back.'), EN('Every clock in the house learned those two hours by heart.')]),
      SOUL([EN('Four o’clock is when a night shift is longest. Ask anyone who has worked one.')]),
      SOUL([KS('엄마 손목시계는 아직도 서울 시간이야. 한 번도 안 고쳤어.', 'Mum’s watch is still on Seoul time. She has never changed it.')])],
    effect: { id: 'E73', how: 'mech', mech: { type: 'dials', marks: ['c1', 'c2', 'c3', 'c4'], states: 12, values: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], start: [1, 7, 10, 2], target: [4, 4, 4, 4], optKey: 'hour', labelText: 'It now shows ', sfx: 'tick', winLines: ['Every clock shows the time of the only one that works. They begin to beat together. A hand works loose, thin as a needle, and drops into your palm, still quivering.'] } },
    npcs: [{ name: 'The Clockmaker', look: H({ t: 'old', head: 'clock', body: 'apron', c: ['#4a3a2a', '#3a2a1a', '#d8b898', '#c8c8c8'] }), behavior: 'static', solid: true, lines: [EN('Only one tells the time. The others tell the time it should have been.'), EN('Set them all to the one that works. They’ll stop arguing.')] }],
    info: { summary: 'A wood-panelled room full of clocks, each telling a different time.', rules: ['Setting all four clocks (one interaction = one hour on) to 4 o’clock, like the only one that works, gives the Needle (E73).'], lore: 'The clocks in the house, set to the mother’s night-shift hours.' } });

  /* W082 — La Voie zéro */
  S({ id: 'W082', name: 'Track Zero', depth: 3, tier: 'hard', back: 'W081',
    map: (function () { var g = K.grid(60, 12, ' '); g.box(0, 0, 60, 12, '#', '.'); g.rect(1, 7, 58, 4, 'r'); g.hline(1, 58, 6, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.station, { floor: { p: 'tile', c: ['#a8a498', '#888478'] } }), style: { tallWalls: true }, music: 'platformzero', dark: 0.65, amb: { type: 'train', vol: 0.03 },
    doors: [{ to: 'W192', look: 'train', opt: { c: ['#2a2a3a', '#e8c040'], dark: true }, at: [30, 8], cond: { realHour: [23, 24] }, label: 'the 23:71 train', locked: 'The rails hum. Nothing comes. Not yet. The platform clock wavers between eleven at night and midnight.' },
      { to: 'W083', look: 'door', opt: { style: 'metal', symbol: '?' }, label: 'lost property' }],
    decor: [{ look: 'board', opt: { lines: ['23:71  track 0', '00:11  track 0', '--:--  ---'], color: '#e8c040' }, lines: ['DEPARTURE 23:71 — TRACK 0 — ON TIME.', 'It is the first time a board has ever said “on time”.'] }, { look: 'bench', n: 2, lines: ['A bench. Two seats marked in felt-tip: “재식” and “옥순”.'] }],
    npcs: [{ name: 'The Stationmaster of Track Zero', look: H({ t: 'robot', head: 'clock', body: 'uniform', c: ['#2a2a4a', '#1a1a3a', '#c8c8d0', '#e8c040'] }), behavior: 'static', solid: true, lines: [EN('Beep. Platform zero does not exist. Beep. The train comes through anyway, between eleven at night and midnight.'), EN('Beep. Passengers must have the time. Beep.')] }],
    place: [
      SOUL([EN('The last hour has seventy-one minutes, for those who are still waiting.')]),
      SOUL([KN('렬차가 오면 동생한테 먼저 타라고 하겠습니다. 이번에는.', 'When the train comes, I will tell my little sister to get on first. This time.')]),
      SOUL([EN('He shined his shoes on this bench every night, with a handkerchief.'), EN('A man must look presentable when his sister arrives, he said.')])],
    info: { summary: 'A platform beneath the station where, at the right moment, the 23:71 train pulls in.', rules: ['Between 23:00 and midnight (real time), the 23:71 train pulls in (W192).'], time: ['23:00–23:59 real time: the 23:71 train.'], lore: 'The hour that overflowed.' } });

  /* W083 — Le Bureau des objets trouvés */
  S({ id: 'W083', name: 'The Lost Property Office', depth: 3, tier: 'hard', back: 'W082', wrap: true, loop: true,
    map: (function () { var g = K.grid(40, 24, '.'); for (var y = 2; y < 24; y += 5) g.hline(0, 39, y, '%'); for (var y2 = 2; y2 < 24; y2 += 5) for (var x = 4; x < 40; x += 9) g.set(x, y2, '.'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#7a7468'] }, wall2: { p: 'brick', c: ['#8a7a5a', '#6a5a3a', '#4a3a2a'] } }, music: 'lostfound', dark: 0.45,
    decor: [{ look: 'crate', n: 10, lines: ['A shelf of umbrellas. All of them red.', 'A shelf of cuddly toys. A rabbit with a sewn-up ear.', 'A box marked “VOICES”: empty. A label: “claimed by nobody”.', 'A box marked “NAMES”. Inside, little slips of paper: “Sora”, “Mi-ran”, “Ok-sun”… You close it again.', 'Letters never posted, filed by year: 1989, 2044.'] }],
    npcs: [{ name: 'The Clerk', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#4a4a3a', '#3a3a2a', '#d8b898', '#c8c8c8'], acc: 'clipboard' }), behavior: 'static', solid: true, lines: [EN('What did you lose? Everybody has lost something. It’s all filed away. Nothing is given back.'), EN('The box of voices is empty. They come back on their own, when they want to.')] }],
    place: [
      SOUL([KS('1951년에 잃어버린 왼쪽 신발을 찾으러 왔어. 여기 있대. 돌려주지는 않는대.', 'I came for a left shoe I lost in 1951. They say it’s here. They say they won’t give it back.'), KS('보기만 하래.', 'I’m only allowed to look at it.')]),
      SOUL([EN('A girl left her own voice here, three years ago. The label says: to be collected by the owner.')]),
      SOUL([EN('Shelf seven: knock-knock jokes without endings. Nobody ever comes to claim the endings.')])],
    info: { summary: 'Shelves of lost things repeating in every direction.', rules: ['The world loops.'], lore: 'What you have lost never comes back, but you know where it is.' } });

  /* W084 — La Mer de nuages (vue de côté) */
  S({ id: 'W084', name: 'The Sea of Clouds', depth: 3, tier: 'hard', back: 'W086', outdoor: true,
    map: (function () { var g = K.grid(40, 40, ' '); g.rect(0, 37, 40, 3, '#'); [[4, 9, 34], [12, 17, 31], [20, 25, 28], [28, 33, 25], [20, 26, 22], [10, 16, 19], [3, 8, 16], [10, 15, 13], [18, 23, 10], [26, 31, 7], [17, 22, 4], [8, 13, 1]].forEach(function (p) { g.hline(p[0], p[1], p[2], '-'); }); return g.rows(); })(),
    look: { wall: { p: 'cloud', c: ['#f0f4ff', '#d8e0f0'] }, platform: { p: 'cloud', c: ['#ffffff', '#e0e8f8'] } },
    style: { view: 'side', sky: ['#a8c8f0', '#f8fcff'], parallax: [{ c: '#ffffff', f: 0.1, y: 0.4, amp: 3 }, { c: '#e8f0fc', f: 0.25, y: 0.75, amp: 2 }] }, music: 'cloudsea', amb: { type: 'wind', vol: 0.08 },
    backAt: [3, 36],
    effect: { id: 'E74', how: 'find', at: [10, 0], look: 'cloudpuff', lines: ['The highest cloud. It lets itself be taken, like a cushion. You can become a cloud now.'] },
    npcs: [{ name: 'The Cloud Bird', look: { t: 'bird', c: ['#f0f4ff', 0, 0, '#e8a53a'], h: 12 }, behavior: 'static', solid: false, talkable: true, at: [22, 27], lines: [EN('Higher. Always higher. The highest cloud has never touched the ground.')] }],
    place: [
      SOUL([EN('Up here, nobody can ask where you are. That was the whole idea.'), EN('It got lonely anyway.')], [6, 33]),
      SOUL([EN('Clouds are the steam of every kettle left on in every kitchen at night.')], [30, 24]),
      SOUL([EN('Almost there. The last one lets itself be held, if you don’t squeeze.')], [20, 9])],
    info: { summary: 'Side view: a sea of clouds you climb from cloud to cloud.', rules: ['Reaching the highest cloud gives the Cloud (E74).'], lore: 'Climbing to where nobody can ask where you are.' } });

  /* W085 — Le Désert de sel */
  S({ id: 'W085', name: 'The Salt Desert', depth: 3, tier: 'hard', back: 'W089', outdoor: true,
    inf: { type: 'plain', floor: '.', scatter: ['o'], density: 0.004, cache: 48 }, look: { floor: { p: 'flat', c: ['#f0f0f4', '#e4e4ea'] }, rock: { p: 'rock', c: ['#d8d8e0', '#b8b8c0', '#f0f0f8'] } },
    style: { sky: ['#c8d8f0', '#ffffff'] }, music: 'saltdesert', amb: { type: 'wind', vol: 0.05 }, extra: { invertX: true, invertY: true },
    place: [{ id: 'mirage', type: 'decor', at: [16, 4], look: 'pillar', lookOpt: { c: ['#f8f8ff'] }, lines: [] },
      SOUL([EN('Salt is what the sea leaves behind when it gives up waiting.')]),
      SOUL([EN('I walked toward him for years. He kept stepping back, politely, like a man who does not want to be a bother.')]),
      SOUL([EN('Don’t want it so hard. Turn your back on it. Let it come to you.')])],
    effect: { id: 'E75', how: 'mech', mech: { type: 'recede', mark: 'mirage', dist: 9, winLines: ['You walked backwards all the way to the marker. It could not see you coming. When you touch it, it splits in two: one stays, the other follows you.'] } },
    npcs: [{ name: 'The Still Caravan', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#d8d0c0', '#b8b0a0', '#d8b898', '#1a1a1a'] }), behavior: 'static', at: [14, 18], solid: true, lines: [EN('Here, you go forward by looking behind you. Whatever you look at goes away.'), EN('The marker never comes closer to those who stare at it.')] }],
    info: { summary: 'An endless plain of white salt under a pale sky; a white marker draws back when you look at it.', rules: ['Endless world; the controls are reversed here (you go forward by walking backwards).', 'Reaching the marker without looking at it gives the Mirage (E75).'], lore: 'What you want too much draws away.' } });

  /* W086 — Le Salon des miroirs */
  S({ id: 'W086', name: 'The Hall of Mirrors', depth: 3, tier: 'hard', back: 'W089', map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, 'm', '.'); for (var i = 0; i < 8; i++) { var r = YN.rng.make(860 + i); g.set(r.int(3, 26), r.int(3, 18), 'm'); } return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#2a2430', '#6a5a7a'] }, mirror: { p: 'glass', c: ['#b8c8d8', '#f0f8ff', '#8898a8'] } }, style: { tallWalls: true }, music: 'mirrors', dark: 0.3,
    doors: [{ to: 'W084', look: 'mirror', label: 'a mirror with sky in it' }, { to: 'W087', look: 'curtain', opt: { c: ['#a01020'] }, label: 'a red curtain' }],
    npcs: [{ name: 'Your Reflection', count: 3, look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], alpha: 0.55 }), behavior: 'mimic', solid: false, talkable: true, lines: ['Your reflection opens its mouth. No sound comes out, but you read on its lips that it is asking you to speak.', 'Your reflection smiles before you do.'] }],
    place: [
      SOUL([EN('I checked the mirror every morning to make sure I was still there. Some mornings, I wasn’t sure.')]),
      SOUL([EN('When you stop talking, the reflections keep your voice for you. They keep it warm.')]),
      SOUL([EN('One mirror shows the sky. It belonged to a girl who looked up instead of looking at herself.')])],
    info: { summary: 'A hall whose walls and a few of its columns are mirrors; several reflections follow you.', lore: 'Looking at yourself to find out whether you exist.' } });

  /* W087 — La Chambre aux mille rideaux */
  S({ id: 'W087', name: 'The Room of a Thousand Curtains', depth: 3, tier: 'hard', back: 'W086', wrap: true, loop: true,
    map: (function () { var g = K.grid(28, 18, '.'); return g.rows(); })(), look: { floor: { p: 'carpet', c: ['#3a1a2a', '#2a0a1a'] } },
    music: 'curtains', dark: 0.35,
    place: [['violet', '#8a40c0', 'A violet curtain.'], ['indigo', '#4040a0', 'An indigo curtain.'], ['bleu', '#3080d0', 'A blue curtain.'], ['vert', '#40a050', 'A green curtain.'], ['jaune', '#e0c030', 'A yellow curtain.'], ['orange', '#e08030', 'An orange curtain.'], ['rouge', '#c02030', 'A red curtain.']].map(function (c, i) { var r = YN.rng.make(870 + i); return { id: 'cur_' + c[0], type: 'decor', at: [r.int(1, 26), r.int(1, 16)], look: 'curtain', lookOpt: { c: [c[1]] }, lines: [c[2]] }; }).concat([
      SOUL([EN('When the door slammed, I counted the colours on the curtain until it was quiet again.')]),
      SOUL([EN('Behind every curtain there is a window someone bricked up, so the night couldn’t look in.')]),
      SOUL([KS('커튼 뒤에 숨으면 엄마는 못 찾는 척했어. 그 놀이가 제일 좋았어.', 'When I hid behind the curtain, Mum pretended she couldn’t find me. That was my favourite game.')])]),
    decor: [{ look: 'curtain', n: 10, opt: { c: ['#5a3a4a'] }, lines: ['A grey curtain. Behind it, another curtain.', 'A curtain. Behind it, a bricked-up window.'] }],
    effect: { id: 'E76', how: 'mech', mech: { type: 'sequence', order: ['cur_violet', 'cur_indigo', 'cur_bleu', 'cur_vert', 'cur_jaune', 'cur_orange', 'cur_rouge'], winLines: ['You have opened the rainbow backwards. Behind the red curtain there is no window: there is a curtain just your size, which follows you.'], wrongLine: 'All the curtains close again at once.' } },
    npcs: [{ name: 'The Lady Behind the Curtain', look: ghost('rgba(200,160,180,0.5)', 22), behavior: 'wander', radius: 4, solid: false, talkable: true, lines: [{ seq: ['She can only be seen as a shadow, behind a curtain.', EN('The rainbow, backwards. From violet to red.')] }] }],
    info: { summary: 'A room with no walls, made of curtains that repeat.', rules: ['The world loops.', 'Opening the coloured curtains in the order of the rainbow backwards (violet → red) gives the Curtain (E76).'], lore: 'Hiding behind the curtains when the door slams.' } });

  /* W088 — Le Phare des vagues */
  S({ id: 'W088', name: 'The Lighthouse of Waves', depth: 4, tier: 'hard', back: 'W090', outdoor: true,
    map: (function () { var g = K.grid(40, 30, '~'); g.ellipse(20, 15, 7, 6, '.'); g.ellipse(20, 15, 8, 7, 'w'); g.ellipse(20, 15, 7, 6, '.'); return g.rows(); })(),
    look: { floor: { p: 'rock', c: ['#4a4a50', '#3a3a40', '#5a5a60'] }, water: { p: 'water', c: ['#1a2a3a', '#102030', '#2a3a4a', '#a0b8c8'] } },
    style: { stars: true, sky: ['#05081a', '#101830'] }, music: 'wavelighthouse', amb: { type: 'sea', vol: 0.14 }, weather: { rain: true, wind: 0.5 }, dark: 0.7,
    place: [{ id: 'lamp', type: 'anchor', at: [20, 13], look: 'lighthouse', lines: [{ if: { flag: 'lighthouse_W088' }, t: 'The lighthouse of waves turns. Its light sweeps across the sea, over the waves, towards a bed far down at the bottom.' }, { if: { equipped: 'E05' }, t: 'You light the lighthouse of waves with the Lantern.', do: [{ set: { lighthouse_W088: true } }, { sfx: 'reveal' }] }, { t: 'A lighthouse battered by the waves. Its lamp is drowned in spray. It would take a flame that is not afraid of water.' }] },
      SOUL([EN('Somebody keeps a light on for a person out at sea. It is not to show the way.'), EN('It is so they know.')]),
      SOUL([EN('Only a flame that has already been carried through the dark can burn in this rain.')]),
      SOUL(['A drenched soul that smells of soap and warm rice.', KS('불 켜 놓을게. 늦어도 괜찮아.', 'I’ll leave the light on. It’s all right if you’re late.')])],
    npcs: [{ name: 'The Drenched Keeper', look: H({ t: 'old', head: 'hood', body: 'coat', c: ['#3a4a5a', '#2a3a4a', '#d8b898', '#1a1a1a'] }), behavior: 'static', solid: true, lines: [EN('Three lighthouses. Mine, the one on the grey beach, and the one in the white. When all three keep watch, the bed rises from the deep.')] }],
    info: { summary: 'A lighthouse on a rock in the middle of the waves, in the rain.', rules: ['Light it with the Lantern equipped (one of the three lighthouses for W181).'], lore: 'Keeping watch for someone who is out at sea.' } });

  /* W089 — Le Salon privé */
  S({ id: 'W089', name: 'The Private Lounge', depth: 2, tier: 'hard', back: 'W032', backArrive: 'vip', map: K.hall(26, 16, '#', '.'),
    look: { floor: { p: 'carpet', c: ['#1a0a10', '#3a1020'] }, wall: { p: 'flat', c: ['#100508', '#0a0306'], topColor: '#100508' }, wallface: { p: 'panel', c: ['#3a0a18', '#2a0510', '#c8a040'], skirt: '#c8a040' } },
    style: { tallWalls: true }, music: 'vip', dark: 0.5,
    doors: [{ to: 'W085', look: 'door', opt: { style: 'glass', c: ['#f0f0ff'] }, label: 'a door that smells of salt' }, { to: 'W086', look: 'mirror', label: 'a gold-framed mirror' }],
    place: [{ id: 'bigtable', type: 'decor', at: [13, 7], look: 'roulette', animated: true, casino: { game: 'roulette', bets: [120, 240] } },
      SOUL([EN('I bet my evenings, one at a time. I won a promotion. I lost a daughter’s whole childhood.')]),
      SOUL([EN('The house always wins. The house is empty, but it wins.')]),
      SOUL([EN('Nine to seven: ten hours a night, five nights a week. Somebody in this room owns every one of them.')])],
    mech: [{ type: 'casino' }],
    npcs: [{ name: 'The Masked Gambler', look: H({ t: 'tall', head: 'mask', body: 'suit', c: ['#1a1a1a', '#0a0a0a', '#f0f0f0', '#c8a040'] }), behavior: 'static', solid: true, lang: 'en', lines: [{ t: 'Here we bet hours, darling. Hours of other people.', lang: 'en' }, { t: 'Your mother works nights, doesn’t she? I won those hours.', lang: 'en' }] }],
    info: { summary: 'The casino’s private lounge: a single table, enormous stakes.', rules: ['Bets of 2:00 and 4:00.'], lore: 'The hours you lose so that others can win.' } });

  /* W090 — La Mer intérieure */
  S({ id: 'W090', name: 'The Inner Sea', depth: 4, tier: 'hard', back: 'W091',
    gen: { type: 'islands', w: 56, h: 40, opts: { level: 0.52, decor: 'o', decorRate: 0.02 } }, look: { floor: { p: 'sand', c: ['#8aa0a0', '#708888'] }, water: { p: 'water', c: ['#103040', '#082030', '#205060', '#80c0d0'] }, shallow: { p: 'water', c: ['#205060', '#184050', '#307080', '#a0d0e0'] } },
    style: { renderer: 'watercolor' }, music: 'innersea', amb: { type: 'underwater', vol: 0.1 }, dark: 0.55,
    doors: [{ to: 'W088', look: 'buoy', label: 'towards a lighthouse' }, { to: 'W092', look: 'door', opt: { style: 'metal', c: ['#c8c8c8'] }, label: 'a station on stilts' }, { to: 'W181', look: 'hole', cond: { any: [{ all: [{ flag: 'lighthouse_W029' }, { flag: 'lighthouse_W088' }, { flag: 'lighthouse_W158' }] }, { realDate: 'fullMoon' }] }, label: 'the seabed rising', locked: 'Far down at the bottom, a bed. Too far. The sea would have to rise.' }],
    npcs: [{ name: 'A Jellyfish', count: 5, look: { t: 'jelly', c: ['#c0a0f0'], h: 14, shadow: false }, behavior: 'swim', radius: 6, speed: 0.8, solid: false, lines: ['It pulses slowly, like a night light.'] }, { name: 'The Diver Without Air', look: H({ head: 'helmet', body: 'suit', c: ['#a08040', '#806020', '#c8c8c8', '#a0a8b0'] }), behavior: 'static', solid: true, lines: [EN('The bed is at the bottom. When the three lighthouses shine, or when the moon is full, it rises enough to be reached.')] }],
    place: [
      SOUL([EN('This sea is made of everything nobody said at the dinner table.')]),
      SOUL([KS('바다 건너로 편지를 보냈어. 답장은 프랑스 말로 왔어. 못 읽었어.', 'I sent a letter across the sea. The reply came in French. I couldn’t read it.')]),
      SOUL([EN('The jellyfish are night lights somebody dropped overboard. They still work.')])],
    info: { summary: 'An inner sea scattered with islets, under a green light.', rules: ['You have to swim between the islands (Fish).', 'The three lighthouses lit, or a real full moon, open the way to the Bed at the Bottom of the Water (W181).'], time: ['Real full moon: the tide uncovers the way to W181.'], lore: 'The sea that keeps people apart, and that dreams cross.' } });

  /* W091 — L'Épave */
  S({ id: 'W091', name: 'The Wreck', depth: 3, tier: 'hard', back: 'W039', backLook: 'buoy',
    map: (function () { var g = K.grid(40, 26, '~'); g.ellipse(20, 13, 16, 8, '.'); g.box(8, 8, 24, 10, '#', ','); g.set(20, 8, ','); g.set(14, 17, ','); g.vline(20, 9, 16, '#'); g.set(20, 12, ','); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#4a3a2a', '#3a2a1a', '#5a4a3a'] }, floor2: { p: 'wood', c: ['#3a2a1a', '#2a1a10', '#4a3a2a'] }, wall: { p: 'flat', c: ['#2a1a10', '#1a100a'] }, water: { p: 'water', c: ['#183040', '#102030', '#284858', '#90b0c0'] } },
    music: 'wreck', amb: { type: 'underwater', vol: 0.12 }, dark: 0.75,
    doors: [{ to: 'W090', look: 'hole', label: 'a breach in the hull' }],
    decor: [{ id: 'logbook', look: 'book', n: 1, type: 'item', item: { logbook: 1 }, once: true, solid: false, opt: { c: ['#a08860', '#4a3a20'] }, lines: ['The logbook, swollen with water, at the bottom of the hold.'] }, { look: 'barrel', n: 4, lines: ['A barrel of provisions for a crossing that never happened.'] }],
    npcs: [{ name: 'The Drowned Captain', look: ghost('rgba(160,200,220,0.5)', 24), behavior: 'static', solid: false, talkable: true,
      lines: [{ if: { item: { logbook: 1 }, noEffect: 'E77' }, seq: ['The captain takes back his logbook and holds it close.', EN('No one was forgotten. I wrote every one of them down.'), 'He hands you his diving suit.', EN('You go down. I’m done.')], do: [{ item: { logbook: -1 } }, { give: 'E77' }] }, { seq: ['The captain is looking for something on the chart table.', EN('My log… it’s down in the hold. The names are in it.')] }] }],
    place: [
      SOUL([KN('배에는 자리가 없었습니다. 사람들은 짐을 버리고 아이들을 태웠습니다.', 'There was no room on the boat. People threw away their luggage and put the children aboard.')]),
      SOUL([EN('Each name in the log is someone who reached the other side. Each blank line is someone who didn’t.'), EN('He kept the blank lines too.')]),
      SOUL([KS('할머니는 배 이야기를 할 때 늘 웃었어. 웃으면서 손을 떨었어.', 'Whenever Grandma told the story of the boat, she smiled. She smiled, and her hands shook.')])],
    info: { summary: 'A ship run aground off the grey beach, its hold flooded.', rules: ['Bringing the logbook up from the hold to the captain gives the Diving Suit (E77).'], lore: 'The refugee boat, in Grandma’s stories.' } });

  /* W092 — La Station météo */
  S({ id: 'W092', name: 'The Weather Station', depth: 4, tier: 'hard', back: 'W090', map: K.hall(24, 16, '#', '.'),
    look: { floor: { p: 'metal', c: ['#6a6e76'] }, wall: { p: 'flat', c: ['#2a2e36', '#1a1e26'], topColor: '#2a2e36' }, wallface: { p: 'metal', c: ['#8a8e96'], skirt: '#e0c030' } },
    style: { tallWalls: true }, music: 'weather', amb: { type: 'wind', vol: 0.1 }, weather: { rain: true },
    place: [{ id: 'w1', type: 'decor', at: [5, 5], look: 'server', lookOpt: { w: 'storm' }, lines: ['A weather machine: one dial.'] }, { id: 'w2', type: 'decor', at: [12, 5], look: 'server', lines: ['A weather machine: one dial.'] }, { id: 'w3', type: 'decor', at: [19, 5], look: 'server', lines: ['A weather machine: one dial.'] },
      { id: 'warning', type: 'sign', at: [12, 11], look: 'sign', lines: ['A soul in a yellow oilskin, reciting in a radio voice.', EN('Warning: do not set to fair weather. Fair weather is not in the forecast.')] },
      SOUL([EN('The forecast said: it will be fine. It is always fine.'), EN('We were told to say it even when it was raining indoors.')]),
      SOUL([KS('괜찮아, 괜찮아 하는 날에는 꼭 비가 왔어.', 'On the days she said “it’s all right, it’s all right”, it always rained.')]),
      SOUL([EN('The barometer says variable. It is the most honest word in this whole station.')])],
    effect: { id: 'E78', how: 'mech', mech: { type: 'dials', marks: ['w1', 'w2', 'w3'], states: 4, values: ['storm', 'rain', 'fog', 'fair weather'], start: [0, 1, 2], target: [3, 3, 3], labelText: 'The dial reads: ', winLines: ['All three machines on fair weather, despite the warnings. The rain stops all at once. A barometer falls from the wall, its needle stuck on variable.'] } },
    npcs: [{ name: 'The Weatherman', look: H({ head: 'helmet', body: 'coat', c: ['#e0c030', '#c0a010', '#d8b898', '#a0a8b0'] }), behavior: 'static', solid: true, lines: [EN('Here we make the weather for dreams. Orders from above: never fair weather.'), EN('If you disobey, it will be fine. Once.')] }],
    info: { summary: 'A weather station on stilts where three machines make the weather to come.', rules: ['Setting all three machines to “fair weather” gives the Barometer (E78).'], lore: 'Disobeying so that the weather will be fine.' } });

  /* W093 — Le Jardin des statues */
  S({ id: 'W093', name: 'The Statue Garden', depth: 3, tier: 'hard', back: 'W100', outdoor: true,
    gen: { type: 'forest', w: 50, h: 38, opts: { density: 0.12, border: true, tree: '^' } }, look: K.LOOK.forest, tall: K.TALL.forest, style: { renderer: 'engraving' }, music: 'statues', amb: { type: 'wind', vol: 0.05 }, dark: 0.3,
    doors: [{ to: 'W095', look: 'door', opt: { style: 'wood', c: ['#4a4a5a'] }, label: 'a house where the TV is on' }],
    decor: [{ look: 'statue', n: 8, lines: ['A statue. Plaque: “The father, who left”. He holds a suitcase.', 'A statue. Plaque: “The mother, who worked”. She sleeps standing up.', 'A statue. Plaque: “The grandmother, who sang”. Her mouth is open.', 'A statue. Plaque: “The brother, on the platform”. He is nine years old.'] }],
    effect: { id: 'E79', how: 'find', look: 'statue', opt: { c: ['#a0a0a0'] }, lines: ['A statue with no plaque. It has no model. When you touch it, it turns and takes your pose — then you are the one who takes its.'] },
    npcs: [{ name: 'The Sculptor', look: H({ t: 'old', body: 'apron', c: ['#8a8a80', '#6a6a60', '#d8b898', '#c8c8c8'], acc: 'stamp' }), behavior: 'static', solid: true, lines: [EN('I sculpt the ones who left. There is one without a model. I don’t know who it is. Maybe someone who hasn’t left yet.')] }],
    place: [
      SOUL(['A soul kneeling before an empty plinth.', KS('엄마를 돌로 만들었어. 정원에 계속 계시라고. 가만히 있는 걸 제일 싫어하셨는데.', 'I turned Mum into stone, so she would stay in the garden. She, who hated keeping still more than anything.'), KS('엄마, 미안해.', 'Mum, I’m sorry.')]),
      SOUL([EN('The father’s statue holds a suitcase with no handle. He could never quite lift it.')]),
      SOUL([EN('A monument is only a person nobody is allowed to argue with any more.')])],
    info: { summary: 'An engraved wood where statues bear plaques; only one has none.', rules: ['Touching the statue with no plaque gives the Statue (E79).'], lore: 'The absent, turned into monuments.' } });

  /* W094 — La Rue des enfants seuls */
  S({ id: 'W094', name: 'The Street of Children Alone', depth: 3, tier: 'hard', back: 'W095', outdoor: true,
    gen: { type: 'city', w: 50, h: 34, opts: { block: 7 } }, look: 'night', tall: K.TALL.city, style: { stars: true }, music: 'lonelystreet', dark: 0.6,
    doors: [{ to: 'W097', look: 'door', opt: { style: 'metal', c: ['#3a5a8a'], symbol: 'GYM' }, label: 'the gym' }],
    npcs: [{ name: 'A Latchkey Child', count: 6, look: H({ t: 'kid', body: 'shirt', c: ['#6a8aa0', '#4a6a80', '#f0c8a0', '#1a1a1a'], acc: 'keys' }), behavior: 'wander', radius: 4, speed: 1.2, lines: [{ seq: ['He has a key around his neck.', EN('I go home by myself. It’s normal.')] }, EN('My mum comes home tomorrow morning. There’s a dish in the fridge.'), EN('Wanna play? We don’t play, we wait.'), EN('Don’t open the door to anybody. Not even when it rings. Especially not when it rings.')] }],
    place: [
      SOUL([EN('The key was warm from my neck. The door was cold. That is how I knew nobody was home.')]),
      SOUL([EN('At seven in the morning, the doors on this street open from the outside, one by one. The children pretend to wake up.')]),
      SOUL([EN('I used to talk to the microwave. It always answered: beep.')])],
    info: { summary: 'A street at night where children come home alone, a key around their necks.', lore: '“Latchkey children”; the Doorbell’s rule.' } });

  /* W095 — La Maison à la télévision allumée */
  S({ id: 'W095', name: 'The House Where the TV Is On', depth: 3, tier: 'hard', back: 'W093',
    map: (function () { var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, '#', '.'); g.vline(15, 0, 19, '#'); g.set(15, 10, '.'); return g.rows(); })(),
    look: K.LOOK.house, style: { tallWalls: true }, music: null, amb: { type: 'tv', vol: 0.2 }, dark: 0.75,
    doors: [{ to: 'W094', look: 'door', opt: { style: 'wood' }, label: 'the street' }, { to: 'W096', look: 'door', opt: { style: 'wood', c: ['#c8c8d0'] }, label: 'a door to a school' }],
    decor: [{ look: 'tv', n: 3, animated: true, lines: ['Canned laughter bursts out. Nobody in the living room.', 'A game show. A child wins a family.', 'The television is the only light. It laughs on its own.', EN('HA HA HA! Stay tuned, we’ll be right back! We’re always right back!')] }, { look: 'sofa', lines: ['A sofa sunk into the shape of a little boy. A controller, an empty packet of crisps.'] }, { look: 'table', opt: { cloth: '#d8c8b8' }, lines: ['A note: “not home tonight. eat.” No signature.'] }],
    npcs: [{ name: 'The Little Boy in Front of the TV', look: H({ t: 'kid', hairStyle: 'spiky', body: 'uniform', c: ['#3a3a6a', '#2a2a5a', '#f0c8a0', '#2a1a10'], eyes: 'wide', mouth: 'line' }), behavior: 'static', solid: true, lines: ['He watches the television. He laughs when it laughs, a second later.', { seq: ['He does not turn round.', EN('Who are you? Nobody ever comes.')] }, EN('At school I make everyone laugh. I’m the strongest. Here, only the telly laughs.')] }],
    place: [
      SOUL([EN('He learned to laugh from the television. It never taught him when to stop.')]),
      SOUL([EN('Years from now there will be an office, and a man shouting so that somebody looks at him.'), EN('The same laugh. Without the television.')]),
      SOUL([EN('The note on the table is the same every night. Only the handwriting gets more tired.')])],
    info: { summary: 'A dark house where a television left on laughs for a little boy on his own.', lore: 'The Big Laugh’s home: the television always on, nobody there.' } });

  /* W096 — La Cabine 3 */
  S({ id: 'W096', name: 'Cubicle 3', depth: 3, tier: 'hard', back: 'W095', map: K.hall(12, 10, '#', '.'),
    look: { floor: { p: 'tile', c: ['#d8e0e0', '#a8b8b8'] }, wall: { p: 'flat', c: ['#3a4a4a', '#2a3a3a'], topColor: '#3a4a4a' }, wallface: { p: 'tile', c: ['#c8d8e0', '#a0b0c0', '#7a8a9a'], skirt: '#4a5a6a' } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'cabin3', amb: { type: 'drip', vol: 0.05 },
    doors: [{ to: 'W097', look: 'door', opt: { style: 'metal', c: ['#a0b0c0'] }, label: 'the gym' }, { to: 'W004', arrive: 'toilets', look: 'door', opt: { style: 'metal', c: ['#a0b0c0'], symbol: '3' }, label: 'back to school' }],
    decor: [{ look: 'crane', n: 6, solid: false, lines: ['A paper crane. On one wing, in tiny writing: “sorry”.', 'A crane. On one wing: “I won’t tell”.', 'A crane. On one wing: “they laugh”.'] }],
    npcs: [{ name: 'Ondine’s Reflection', look: H({ t: 'kid', hairStyle: 'long', body: 'dress', c: ['#a8c8d8', '#7a98a8', '#e8d8d0', '#3a5a6a'], eyes: 'down', alpha: 0.6 }), behavior: 'static', solid: false, talkable: true, lines: [EN('This is where I hide. Or where you hide. After a while, you can’t tell.'), EN('If you tell someone, maybe it’ll get better. I never told.')] }],
    place: [
      SOUL([EN('Lunch break, cubicle three. Feet up on the seat, so nobody sees them under the door.')]),
      SOUL([EN('A thousand cranes and you get a wish. She is at two hundred and twelve. She hasn’t decided what to wish for.')]),
      SOUL([EN('They called her the mute. She wasn’t mute. She was keeping her words for someone who would listen.')])],
    info: { summary: 'Inside cubicle 3 of the school toilets, bigger inside than out, full of cranes.', lore: 'Hiding to cry; Ondine, or Sora herself.' } });

  /* W097 — Le Gymnase des cordes (vue de côté) */
  S({ id: 'W097', name: 'The Rope Gym', depth: 3, tier: 'hard', back: 'W094',
    map: (function () { var g = K.grid(36, 34, ' '); g.rect(0, 31, 36, 3, '#'); g.vline(0, 0, 33, '#'); g.vline(35, 0, 33, '#'); [6, 13, 20, 27].forEach(function (x, i) { g.vline(x, i === 2 ? 0 : 8 + i * 3, 30, 's'); }); g.hline(1, 34, 0, '#'); g.hline(17, 23, 1, '-'); return g.rows(); })(),
    look: { wall: { p: 'wood', c: ['#c8a070', '#a08050', '#d8b080'] }, stairs: { p: 'stripes', c: ['#c8b890', '#a89870'] }, platform: { p: 'plank', c: ['#c8a070', '#a08050', '#d8b080'] } },
    style: { view: 'side', sky: ['#d8d0c0', '#f0e8d8'] }, music: 'gym', amb: { type: 'hum', vol: 0.05 },
    backAt: [2, 30], doors: [{ to: 'W098', at: [33, 30], look: 'door', opt: { style: 'wood' }, label: 'the changing room' }],
    effect: { id: 'E80', how: 'find', at: [20, 0], look: 'jumprope', lines: ['You have climbed the rope nobody had ever managed to climb. At the top, tied to the hook, a skipping rope.'] },
    npcs: [{ name: 'The PE Teacher', look: H({ t: 'adult', head: 'cap', body: 'uniform', c: ['#3a6a3a', '#2a5a2a', '#e0c0a0', '#1a1a1a'], acc: 'baton' }), behavior: 'static', at: [10, 30], solid: true, lines: [{ seq: [EN('Come on! Everyone’s watching!'), 'Nobody is watching. There is nobody here.'] }, EN('Nobody ever climbed the third rope. They laughed at anyone who tried.')] }],
    place: [
      SOUL([EN('Picked last again. The teams were full before they said my name. My name was what was left over.')], [16, 30]),
      SOUL([EN('Halfway up the rope, the laughing sounds smaller. At the top you can’t hear it at all.')], [24, 30]),
      SOUL([EN('You were not slow. You were alone on the rope while everyone else held the floor.')], [30, 30])],
    info: { summary: 'Side view: a gym with smooth ropes hanging from the ceiling.', rules: ['Climbing the third rope up to the hook gives the Skipping Rope (E80).'], lore: 'PE lessons, when everyone watches the girl who can’t do it.' } });

  /* W098 — Le Cahier de brouillon */
  S({ id: 'W098', name: 'The Rough Book', depth: 3, tier: 'hard', back: 'W097',
    map: (function () { var g = K.grid(40, 28, '.'); g.vline(6, 0, 27, ','); return g.rows(); })(),
    look: { floor: { p: 'paper', c: ['#f4f0e4'] }, floor2: { p: 'lines', c: ['#f4f0e4', '#e04050'] } }, style: { renderer: 'crayon' }, music: 'notebook', amb: { type: 'paper', vol: 0.05 },
    doors: [{ to: 'W099', look: 'door', opt: { style: 'shoji' }, label: 'a page turning' }],
    decor: [{ look: 'doodle', n: 6, lines: ['A doodle: a house, a crying sun.', 'A doodle: “S + N = friends forever”. N has been crossed out, then written back in.', 'A drawing of a cat, very good, signed with a little flower.'] }],
    effect: { id: 'E81', how: 'find', at: [3, 14], look: 'doodle', opt: { unfinished: true }, need: { equipped: 'E09' }, notYet: ['In the margin, an unfinished stick figure: it has no mouth. Something is needed to finish it.'], lines: ['With the chalk, you finish the stick figure: you draw it a mouth. It smiles, jumps out of the margin and holds your hand. You become a doodle with it.'] },
    npcs: [{ name: 'The Eraser in Doubt', look: { t: 'blob', c: ['#f0a0b0'], h: 10 }, behavior: 'wander', radius: 4, lines: [{ seq: ['It rubs out a little, then stops.', EN('I don’t know if it was wrong.')] }] }],
    place: [
      SOUL([EN('N moved to another town in Year Four. S crossed her out, then wrote her back in. Twice.')]),
      SOUL([EN('In the margin you can write the things you don’t say. The teacher never reads the margins.')]),
      SOUL([EN('A drawing with no mouth isn’t sad. It is waiting for someone with chalk.')])],
    info: { summary: 'Inside a rough book: lines, a red margin, doodles.', rules: ['Finishing the stick figure in the margin with the Chalk equipped gives the Doodle (E81).'], lore: 'The margins where you write what you don’t say.' } });

  /* W099 — Le Préau sous la neige */
  S({ id: 'W099', name: 'The Schoolyard in the Snow', depth: 3, tier: 'hard', back: 'W098', outdoor: true,
    gen: { type: 'empty', w: 50, h: 34, opts: { floor: 'n', border: '#', decor: '^', decorRate: 0.02 } }, look: Object.assign({}, K.LOOK.snow, { snow: { p: 'snow', c: ['#eef4fa', '#dfe8f2'] } }), tall: K.TALL.pine,
    weather: { snow: true }, music: 'snowyard', amb: { type: 'wind', vol: 0.06 },
    place: [{ id: 'tracks', type: 'sign', at: [5, 5], look: 'sign', lines: ['A soul crouching by the footprints in the snow.', EN('Little feet. They go to the far end of the yard.'), EN('Follow them before it snows again.')] },
      SOUL([EN('Home time was half past four. At six, the caretaker switched off the lights in the yard. I stayed under the roof.')]),
      SOUL([EN('If you walk in your own footprints, nobody can count how long you have been waiting.')]),
      SOUL(['A breathless soul, still in her work tunic under her coat.', KS('미안해, 늦었지? 추웠어? …괜찮아, 괜찮아.', 'Sorry, I’m late, aren’t I? Were you cold? …It’s all right, it’s all right.')])],
    effect: { id: 'E82', how: 'mech', mech: { type: 'reach', zone: [44, 27, 48, 31], winLines: ['You followed the tracks to the one who leaves them: a little girl made of snow, who has been walking in circles for years. She gives you her footprints as a present.'] } },
    npcs: [{ name: 'The Snow Girl', look: H({ t: 'kid', hairStyle: 'long', body: 'dress', c: ['#f0f4fa', '#d8e0ea', '#f0f4fa', '#c8d0e0'], alpha: 0.8 }), behavior: 'patrol', at: [46, 29], path: [[44, 27], [48, 27], [48, 31], [44, 31]], speed: 0.6, lines: ['She does not speak. She walks in her own footprints so nobody can tell how long she has stayed.'] }],
    extra: { snowWeather: true },
    info: { summary: 'A snowbound schoolyard shelter where footprints lead somewhere.', rules: ['Following the tracks to the snow girl (south-east corner) gives the Footprints (E82).'], lore: 'Waiting in the yard for someone to come and fetch you.' } });

  /* W100 — La Grotte des noyaux */
  S({ id: 'W100', name: 'The Cave of Fruit Stones', depth: 3, tier: 'hard', back: 'W021', backLook: 'stairs', backLabel: 'climb back up to the roots',
    gen: { type: 'cave', w: 52, h: 40, opts: { fill: 0.45, iter: 4, decor: 'o', decorRate: 0.02, water: 3 } }, look: Object.assign({}, K.LOOK.cave, { floor: { p: 'soil', c: ['#3a2818'] } }),
    style: { renderer: 'crayon' }, music: 'pits', amb: { type: 'drip', vol: 0.08 }, dark: 0.85, playerLight: 1.5,
    doors: [{ to: 'W093', look: 'stairs', label: 'stairs down to some statues' }, { to: 'W095', look: 'door', opt: { style: 'wood' }, label: 'a house door, underground' }, { to: 'W105', look: 'hole', label: 'a narrow tunnel', cond: { effect: 'E29' } }],
    decor: [{ look: 'seedbag', n: 6, lines: ['Plum stones, buried in a row. On one of them, a date: 2021.', 'Peach stones. Nothing grew. But they are kept.', 'A cherry stone in a walnut shell, as if in a cradle.'] }],
    npcs: [{ name: 'The Old Root', look: H({ t: 'tall', head: 'hollow', body: 'stick', c: ['#5a3e26', '#4a2e16', '#6a4e36', '#5a3e26'] }), behavior: 'static', solid: true, lines: [{ seq: ['She used to bury everything she ate.', KS('언젠가 싹이 나면, 네가 먹게 될 거야.', 'One day, when it sprouts, you’ll get to eat it.')] }, KS('아무것도 안 났어. 그래도 너는 여기 있잖아.', 'Nothing came up. But you’re here, aren’t you.')] }, { name: 'A Writing Worm', count: 3, look: { t: 'worm', c: ['#e0a0a0'], h: 10 }, behavior: 'wander', radius: 3, speed: 0.4, lines: ['It traces signs in the earth that you have seen before, on stones.'] }],
    place: [
      SOUL([KS('씨는 버리는 게 아니야. 나중을 위해 두는 거야.', 'You don’t throw seeds away. You keep them for later.')]),
      SOUL([EN('2021: a plum stone, planted by an old woman and a little girl with a watering can too big for her.')]),
      SOUL([EN('Nothing grew. The stones were kept anyway. Some things you keep just to know where they are.')])],
    info: { summary: 'A cave beneath the roots where fruit stones are buried in rows.', rules: ['With the Compass, a narrow tunnel leads down to the Maze Sewers (W105).'], lore: 'Grandma planted the stones “for later”.' } });
})(typeof window !== 'undefined' ? window : globalThis);
