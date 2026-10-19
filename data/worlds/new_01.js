/* =========================================================================
 *  NEW WORLDS (01) — W201 to W220: THE APARTMENT COMPLEX
 *  A dreamed Seoul apartment complex around Building 107 (flat 1204: where
 *  Mi-ran grew up, and the number of the flat where her daughter sleeps with
 *  the light on). Lobby, a lift that skips four, stairs, guard's booth, roof,
 *  playground, bins, shoe cupboard, neighbours' flats, car park, and below.
 *  Through-line: four people are still awake at three in the morning (1201,
 *  1202, 1205 and the guard). Once all four sleep, the lift remembers floor F.
 *  Entrances: W038 (lift), W026 (roof), W061 (hagwon bus), W063 (bins).
 *  NPC ids N1100-N1149 · effects E201-E206 · flags/temps prefixed cx_.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* a conditional line (NPC or object) */
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  function SEQ(c, seq, act) { var o = { if: c, seq: seq }; if (act) o.do = act; return o; }
  /* add a door to an existing world (placed at random, then made reachable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  var NOGEN = { noFurnish: true, noSecrets: true };
  var SLEEPERS = ['cx_sleep_1201', 'cx_sleep_1202', 'cx_sleep_1205', 'cx_sleep_guard'];

  /* shared materials */
  var APT = { floor: { p: 'tile', c: ['#cfc8b8', '#aaa494'] }, floor2: { p: 'concrete', c: ['#9a968e'] }, floor3: { p: 'tile', c: ['#8a8478', '#6a6458'] },
    wall: { p: 'flat', c: ['#2a2a30', '#1e1e24'], topColor: '#2a2a30' }, wallface: { p: 'panel', c: ['#ddd6c6', '#bdb6a6', '#8f897b'], skirt: '#6a6458' } };
  var HOME = { floor: { p: 'wood', c: ['#c8a070', '#b08a5c', '#d8b080'] }, floor2: { p: 'rug', c: ['#d8c8a8', '#c8b898'] }, floor3: { p: 'tile', c: ['#b8b4a8', '#98948a'] },
    wall: { p: 'flat', c: ['#2c2622', '#201a16'], topColor: '#2c2622' }, wallface: { p: 'wallpaper', c: ['#ebe3d3', '#d3cbbb', '#a99d89'], skirt: '#7a6a58' } };
  var YARD = { floor: { p: 'tile', c: ['#7c7a80', '#6a6870'] }, floor2: { p: 'mat', c: ['#3a7a52', '#2e6a44'] }, floor3: { p: 'sand', c: ['#c8b890', '#b8a880'] },
    wall: { p: 'concrete', c: ['#c8c4bc', '#a8a49c', '#88847c'] } };
  var NIGHT_SKY = ['#0a0e1c', '#24304c'];

  /* ---------------------------------------------------------------
   *  Effects E201-E206
   * --------------------------------------------------------------- */
  var EF = YN.data.effects;
  EF.push({ id: 'E201', name: 'Key on a String', fam: 'home', world: 'W206', icon: { glyph: '⚷', c: '#d8c070' }, acc: 'keys', action: 'knob', caps: ['keys'], ground: false, core: false,
    desc: 'A door key on a shoelace. The girl by the swings had two.', use: 'Turns a locked handle (F); opens the rooms that wait for a key worn round the neck.',
    get: 'Catch every child in the game of tag in the Playground Between the Blocks.' });
  EF.push({ id: 'E202', name: 'Sensor Light', fam: 'home', world: 'W203', icon: { glyph: '◌', c: '#f0e8a0' }, acc: 'glow', action: 'glow', light: 2.6, caps: ['softlight'], ground: false, core: false,
    desc: 'It comes on when you move and gives up when you stop.', use: 'A pale stairwell light you switch on and off (F). Some dark corners only exist under it.',
    get: 'Light all five sensor lamps of the Emergency Stairs before the first one goes out.' });
  EF.push({ id: 'E203', name: 'Shoe-Cupboard Mirror', fam: 'home', world: 'W208', icon: { glyph: '▯', c: '#c8d8e8' }, acc: 'pocketmirror', action: 'mirror', caps: ['mirrorwalk'], ground: false, core: false,
    desc: 'For checking your face before you go out. Nobody checked yours.', use: 'Shows who is copying whom (F); lets you walk into certain mirrors.',
    get: 'Match every pair of shoes Inside the Shoe Cupboard.' });
  EF.push({ id: 'E204', name: 'Guard’s Whistle', fam: 'city', world: 'W204', icon: { glyph: '♪', c: '#c0c0c8' }, action: 'whistle', ground: false, core: false,
    desc: 'It has blown children home for thirty years.', use: 'Blow it (F). Children scatter, and a gap in a hedge remembers itself.',
    get: 'Keep watch at the window of the Guard’s Booth so that the night guard can sleep.' });
  EF.push({ id: 'E205', name: 'Off-Air Snow', fam: 'screens', world: 'W209', icon: { glyph: '▒', c: '#d0d0d8' }, action: 'hide', stealth: 0.3, caps: ['camo'], ground: false, core: false,
    desc: 'A little static from a set that has finally been switched off.', use: 'Harder to notice; hide (F). Cameras lose you, and dark screens open.',
    get: 'Switch off the neighbour’s television at the right moment, in flat 1205.' });
  EF.push({ id: 'E206', name: 'Large-Item Sticker', fam: 'city', world: 'W207', icon: { glyph: '◘', c: '#e8d040' }, action: 'stamp', caps: ['stamp'], ground: false, core: false,
    desc: 'Paid for. Whatever wears it will be taken away before morning.', use: 'Stick it (F) on something too big to throw away, facing it.',
    get: 'Push the three bins of the Recycling Corner onto their painted squares.' });

  /* ---------------------------------------------------------------
   *  W201 — The Lobby of Building 107 (hub)
   *  Puzzle: the letterboxes rattle in an order (sequence).
   *  Secret: the lobby mirror can be walked through (Shoe-Cupboard Mirror).
   * --------------------------------------------------------------- */
  var MB = { '1201': 'Letterbox 1201. A Chuseok card, addressed by a son. It is three years old.', '1202': 'Letterbox 1202. Hagwon bills, folded very small.',
    '1203': 'Letterbox 1203. Estate-agent flyers. Nobody has lived there for a long time.', '1204': 'Letterbox 1204. The lid is warm, as if a hand had just left it.',
    '1205': 'Letterbox 1205. Television licence reminders, unopened.', '1206': 'Letterbox 1206. A change-of-address card, half filled in.' };
  S({ id: 'W201', name: 'The Lobby of Building 107', depth: 2, tier: 'mid', back: 'W038', backLook: 'door', backOpt: { style: 'glass', c: ['#8ab0c8'] }, backLabel: 'back to the stairwell of the block', backAt: [5, 16],
    map: (function () { var g = K.grid(36, 18, ' '); g.box(29, 6, 7, 6, '#', '.'); g.box(0, 0, 30, 18, '#', '.'); g.rect(3, 15, 15, 2, ','); g.set(29, 8, 'm'); g.set(29, 9, 'm'); return g.rows(); })(),
    look: Object.assign({}, APT, { floor2: { p: 'mat', c: ['#6a5a4a', '#5a4a3a'] } }), style: { tallWalls: true }, music: 'lobby107', amb: { type: 'hum', vol: 0.05 }, dark: 0.3,
    extra: NOGEN,
    doors: [{ to: 'W202', type: 'elevator', at: [14, 1], look: 'elevator', opt: { open: true }, label: 'the lift (it is waiting, doors open)' },
      { to: 'W203', at: [20, 1], look: 'door', opt: { style: 'metal', c: ['#3a7a4a'], symbol: 'EXIT' }, label: 'the emergency stairs' },
      { to: 'W206', at: [13, 16], look: 'door', opt: { style: 'glass', c: ['#8ab0c8'] }, label: 'the glass doors, out to the playground between the blocks' },
      { to: 'W210', type: 'stairs', at: [27, 13], look: 'stairsdown', label: 'the stairs down to car park B2' },
      { to: 'W204', at: [25, 1], look: 'door', opt: { style: 'metal', c: ['#6a6a70'] }, cond: { flag: 'cx_w201_post' }, label: 'the parcel room, through to the guard’s booth' }],
    decor: [{ look: 'board', at: [8, 1], lines: ['The notice board. “Water off tomorrow, 10:00 to 12:00.” “Recycling: Wednesday.” “Lost: a key on a string.”',
        'A notice in the guard’s careful hand: “Residents are kindly asked not to shout at the guard.”', 'A flyer for a show flat: “A NEW LIFE, FULLY FURNISHED.” The address given is: the mirror.'] },
      { look: 'crate', n: 3, lines: ['Parcels stacked by the lift. One has been here so long it has started to look like furniture.', 'A parcel for 1204. The sender’s name is rubbed out.'] },
      { look: 'pot', at: [27, 2], lines: ['A rubber plant, polished leaf by leaf by somebody on the night shift.'] },
      { look: 'glint', at: [28, 9], solid: false, lines: ['The lobby mirror. In it, the lobby goes on a little further than it really does.', 'In the mirror there is one more door than out here.'] }],
    place: Object.keys(MB).map(function (n, i) { return { id: 'mb' + n, type: 'decor', at: [1, 3 + i * 2], look: 'mailbox', lines: [MB[n]] }; }).concat([
      { id: 'mirrordoor', type: 'door', to: 'W220', at: [33, 8], look: 'mirror', label: 'a door that is only in the mirror', unreachOk: 'behind the lobby mirror (Shoe-Cupboard Mirror)' },
      { id: 'alcove', type: 'decor', at: [31, 10], look: 'chair', lines: ['A folding chair, behind the mirror, facing the lobby. Somebody sits here to watch the residents come home.'] },
      SOUL([KS('107동 1204호. 엄마가 어릴 때 살던 집이래.', 'Building 107, flat 1204. They say it’s where Mum lived when she was little.')]),
      SOUL([EN('Every letterbox in the block is full except one. Someone empties it each night, before anyone wakes.')])]),
    mech: [{ type: 'sequence', order: ['mb1204', 'mb1201', 'mb1205', 'mb1202'], ring: { every: 1.5, pause: 5, hear: 16, sfx: 'page', glyph: '✉' },
      okLines: ['The lid of 1204 clicks, as if it had been waiting for you.', 'Another lid rattles back, satisfied.', 'A third one sighs open and shut.'],
      wrongLine: 'The lid clatters. Wrong one. Somewhere, the rattling starts again from the beginning.', doneLine: 'The letterboxes are quiet now.',
      done: { flag: 'cx_w201_post' }, reward: [{ set: { cx_w201_post: true } }, { secret: 'cx_letters' }],
      winLines: ['The last letterbox opens on its own.', 'Inside, a bundle of letters with foreign stamps, addressed to Building 107, flat 1204. Every one is in your mother’s handwriting.',
        'None of them has been opened. You put them back, gently.', 'Behind you, a door you had not noticed: the parcel room.'] }],
    npcs: [{ id: 'N1100', name: 'A Man Back From Overtime', look: H({ t: 'adult', body: 'suit', c: ['#2e3240', '#20242e', '#e0c0a0', '#1a1a1a'], eyes: 'line', acc: 'briefcase' }), behavior: 'static', at: [11, 6], solid: true,
        lines: [KS('야근하고 왔어요. 엘리베이터 기다리는 중이에요.', 'I’ve just got back from overtime. I’m waiting for the lift.'),
          KS('문 열려 있다고요? …그래도 기다릴래요. 올라가면 내일이잖아요.', 'The doors are open, you say? …I’ll wait all the same. Once I go up, it’s tomorrow.'),
          'He presses the call button again. The lift is right in front of him, open.'] },
      { id: 'N1101', name: 'The Key Child', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#d0a0a8', '#b08088', '#f0d0b8', '#1a1010'], h: 17 }), behavior: 'wander', radius: 2, speed: 0.8, at: [18, 9], solid: true,
        lines: [KS('혼자 엘리베이터 타면 안 된대. 그래서 여기서 기다려.', 'I’m not allowed in the lift on my own. So I wait here.'),
          KS('편지함이 덜컹거려. 순서대로. 매일 밤.', 'The letterboxes rattle. In order. Every night.'),
          KS('거울 속 로비에는 문이 하나 더 있어. 거울 가진 사람만 들어가.', 'The lobby in the mirror has one more door. Only someone with a mirror can go in.'),
          'She shows you the key on a string round her neck, then tucks it back under her jumper.'] }],
    info: { summary: 'The ground-floor lobby of a dreamed Seoul apartment block: letterboxes, a lift that waits with its doors open, a mirror.',
      rules: ['The letterboxes rattle in a fixed order (1204, 1201, 1205, 1202). Open them in that order: the unopened letters, and the parcel room door (to the Guard’s Booth).',
        'The lift, the emergency stairs, the playground and car park B2 all start here.',
        'Secret: with the Shoe-Cupboard Mirror (E203) equipped, the lobby mirror can be walked through. Behind it, a door to the Show Flat.'],
      lore: 'Building 107, flat 1204: where Mi-ran grew up, and the number of the flat where her daughter now sleeps with the light on.' } });
  link('W038', { to: 'W201', type: 'elevator', look: 'elevator', lookOpt: { open: true }, label: 'a lift that was never there' });

  /* ---------------------------------------------------------------
   *  W202 — The Lift That Skips Four
   *  The cabin is a long corridor of floors. Floor F waits for the four
   *  sleepers. Emergency button (knock) = the guard's hint.
   *  Secret: a hatch that opens for 15 s every 2 min (fall into W219).
   * --------------------------------------------------------------- */
  var FLOORS = ['R', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', 'F', '3', '2', '1', 'B1', 'B2'];
  var FY = function (f) { return 2 + FLOORS.indexOf(f) * 2; };
  var BTN = { R: 'R. The button is cold, as if the wind came in through it.', '13': '13. Warm, as if someone had pressed it a moment ago.',
    '12': '12. Someone has stuck a tiny heart sticker beside it.', F: 'F. The light behind it is on, as though the floor were still awake.',
    '1': '1. Worn smooth by every homecoming.', B1: 'B1. Someone has scratched a little car next to it.', B2: 'B2. It buzzes when you touch it, like a car park.' };
  var HATCH = { remainingMod: { every: 120, under: 15 } };
  S({ id: 'W202', name: 'The Lift That Skips Four', depth: 2, tier: 'mid', back: 'W201', backType: 'elevator', backLook: 'elevator', backOpt: { open: true }, backLabel: 'floor 1 — the lobby', backAt: [1, FY('1')],
    map: (function () { var g = K.grid(9, 39, ' '); g.box(0, 0, 9, 39, '#', '.'); FLOORS.forEach(function (f) { g.hline(1, 7, FY(f), ','); }); return g.rows(); })(),
    look: { floor: { p: 'checker', c: ['#8a8a90', '#727278'] }, floor2: { p: 'metal', c: ['#a8acb4'] }, wall: { p: 'flat', c: ['#3a3e46', '#2a2e36'], topColor: '#3a3e46' }, wallface: { p: 'panel', c: ['#b8bcc4', '#989ca4', '#6a6e76'], skirt: '#3a3e46' } },
    style: { tallWalls: true }, music: 'liftnofour', amb: { type: 'machine', vol: 0.05 }, dark: 0.2, extra: NOGEN,
    doors: [{ to: 'W205', type: 'elevator', at: [1, FY('R')], look: 'elevator', opt: { open: true }, label: 'floor R — the roof' },
      { to: 'W211', type: 'elevator', at: [1, FY('12')], look: 'elevator', opt: { open: true }, label: 'floor 12' },
      { to: 'W210', type: 'elevator', at: [1, FY('B2')], look: 'elevator', opt: { open: true }, label: 'floor B2 — the car park' },
      { to: 'W218', type: 'elevator', at: [1, FY('F')], look: 'elevator', opt: { open: false }, label: 'floor F', cond: { flag: SLEEPERS },
        locked: 'The doors of floor F stay shut. Under the F, someone has scratched four little windows, all lit. One of them has a television in it.' }],
    place: FLOORS.map(function (f) { return { id: 'btn' + f, type: 'decor', at: [7, FY(f)], look: 'switch', lines: [BTN[f] || ('The button for floor ' + f + '. It lights up, then goes out. Nobody gets on at ' + f + '.')] }; }).concat([
      { id: 'intercom', type: 'decor', at: [6, 37], look: 'intercom', lines: ['The emergency button, a little bell drawn on it. Press it, and keep pressing.'] },
      { id: 'hatchshut', type: 'decor', at: [3, 37], look: 'hatch', cond: { not: HATCH }, lines: ['A maintenance hatch, screwed shut. Every two minutes it rattles, as if the lift were passing a floor that is not on the buttons.'] },
      { id: 'hatch', type: 'hole', to: 'W219', at: [3, 37], look: 'hatch', lookOpt: { open: true }, cond: HATCH, label: 'the maintenance hatch, open, and the dark below' },
      { id: 'liftmirror', type: 'decor', at: [7, 19], look: 'mirror', lines: ['The lift mirror. In it, the lift is full of people going home. Out here, there is only you.'] },
      SOUL([EN('Four sounds like death, in Korean. So the buttons say F, and everybody pretends the floor is not there.')]),
      SOUL([KS('엄마는 엘리베이터 혼자 타지 말래. 그럼 누구랑 타?', 'Mum says never to ride the lift on my own. So who am I supposed to ride with?')])]),
    mech: [{ type: 'knock', mark: 'intercom', n: 3, within: 2.5, sfx: 'switch', firstLine: 'A crackle. Somewhere far below, a radio wakes up.',
      done: { flag: 'cx_intercom' }, doneLine: 'The intercom hums. The guard is listening, even asleep.', reward: [{ set: { cx_intercom: true } }],
      winLines: ['The intercom crackles. A tired voice, from the guard’s booth:', KS('경비실입니다. …거기 누구 있어요?', 'Guard’s booth. …Is someone there?'),
        'You say nothing. He waits. He is used to it.', KS('사 층은 없어. 다들 잠들기 전에는.', 'There’s no fourth floor. Not until everyone’s asleep.'),
        KS('1201호, 1202호, 1205호… 그리고 나. 아직 넷이 불 켜고 있어.', 'Flats 1201, 1202, 1205… and me. Four of us still have the light on.')] }],
    npcs: [{ id: 'N1102', name: 'The Lift Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 13,
        ambientLines: [KS('문이 닫힙니다.', 'The doors are closing.'), KS('올라갑니다.', 'Going up.'), KS('내려갑니다.', 'Going down.'), KS('12층입니다.', 'Twelfth floor.'),
          KS('이 엘리베이터는 4층에 서지 않습니다.', 'This lift does not stop at the fourth floor.'), KS('정원 열한 명. 현재 한 명.', 'Capacity: eleven people. Now: one.')] },
      { id: 'N1103', name: 'A Delivery Rider Holding the Door', look: H({ t: 'adult', head: 'helmet', body: 'shirt', c: ['#e08020', '#c06010', '#e0c0a0', '#e8d040'], acc: 'bag' }), behavior: 'static', at: [5, 21], solid: true,
        lines: [KS('잠깐만요! 문 잡아 주세요! …아, 아무도 없네.', 'Hold the door! Please! …Oh. There’s nobody.'),
          KS('12층 배달인데 12층이 자꾸 지나가요.', 'I’ve a delivery for the twelfth floor, but the twelfth floor keeps going past.'),
          KS('사 층이요? 사 층은 배달 안 가요. 거기는 아무도 주문 안 해요.', 'The fourth floor? We don’t deliver to four. Nobody there ever orders.')] }],
    info: { summary: 'A lift whose cabin has become a long corridor of floors: walk to a floor to get off. There is no 4, only F.',
      rules: ['Walk along the lift and use a floor’s doors: 1 (the lobby), 12 (the twelfth-floor corridor), R (the roof), B2 (the car park).',
        'Pressing the emergency button three times quickly calls the guard, who says what floor F is waiting for.',
        'Floor F (The Floor Called F) opens only once the four who are still awake at three in the morning are asleep: the grandmother of 1201, the student of 1202, the television of 1205 and the night guard.',
        'Secret: for fifteen seconds every two minutes of the dream, the maintenance hatch at the very bottom opens: walk onto it to fall into the Lift Shaft.'],
      lore: 'In Korean, four sounds like death. Lifts skip it politely.' } });

  /* ---------------------------------------------------------------
   *  W203 — The Emergency Stairs
   *  Puzzle: five sensor lamps, all lit at once (lampsAll) -> E202.
   *  Secret: a corner of invisible walls beside floor 10 (service ladder to B2).
   * --------------------------------------------------------------- */
  var SF = ['1', '2', '3', 'F', '5', '6', '7', '8', '9', '10', '11', '12', 'R'];
  var SY = function (k) { return 41 - k * 3; };
  var SX = function (k) { return k % 2 ? 23 : 2; };
  var LAMPK = [6, 7, 8, 9, 10];
  S({ id: 'W203', name: 'The Emergency Stairs', depth: 2, tier: 'mid', back: 'W201', backLook: 'door', backOpt: { style: 'metal', c: ['#3a7a4a'], symbol: 'EXIT' }, backLabel: 'the fire door, back to the lobby', backAt: [3, 41],
    map: (function () {
      var g = K.grid(34, 44, '#');
      for (var k = 0; k < SF.length; k++) { var y = SY(k); if (k % 2) g.rect(16, y - 1, 8, 2, '.'); else g.rect(2, y - 1, 8, 2, '.'); if (k < SF.length - 1) g.hline(2, 23, y - 2, ','); }
      g.text(25, 9, ['......x.', '.xxxx.x.', '.x......', '.x.xxxx.', '...x....', 'xx.x.xx.', '...x.x..', '.xxx...x']);
      g.set(24, 13, '.');
      return g.rows();
    })(),
    look: Object.assign({}, APT, { floor: { p: 'concrete', c: ['#8a8680'] }, floor2: { p: 'hstripes', c: ['#7a7670', '#5a5650'] } }), style: { tallWalls: true }, music: 'firestairs', amb: { type: 'drip', vol: 0.04 }, dark: 0.8, extra: NOGEN,
    doors: [{ to: 'W211', at: [23, 7], look: 'door', opt: { style: 'metal', c: ['#5a5a60'], symbol: '12' }, label: 'the fire door of floor 12' },
      { to: 'W205', at: [2, 4], look: 'door', opt: { style: 'metal', c: ['#4a4a50'], symbol: 'R' }, label: 'the door to the roof' },
      { to: 'W210', at: [32, 9], look: 'ladder', label: 'a service ladder down to the car park' }],
    place: LAMPK.map(function (k) { return { id: 'lamp' + SF[k], type: 'decor', at: [SX(k), k % 2 ? SY(k) : SY(k) - 1], look: 'lamp', lines: ['A motion-sensor lamp. It wakes when you pass, and gives up when you stop.'] }; }).concat([
      { id: 'fl1', type: 'decor', at: [9, 40], look: 'poster', lines: ['Floor 1, painted on the wall in green. EXIT, and a little running man.'] },
      { id: 'flF', type: 'decor', at: [16, 31], look: 'poster', lines: ['Floor four. The number has been painted over with an F. Underneath, the 4 shows through, like a bruise.'] },
      { id: 'doorF', type: 'decor', at: [23, 31], look: 'door', lookOpt: { style: 'metal', c: ['#7a3a3a'] }, lines: ['The fire door of floor four, sealed with red tape: DO NOT USE. Behind it, very quietly, someone is humming.'] },
      { id: 'fl7', type: 'decor', at: [9, 22], look: 'poster', lines: ['Floor 7. A sticker: “please do not smoke on the stairs”. There is ash on the sticker.'] },
      { id: 'fl12', type: 'decor', at: [16, 7], look: 'poster', lines: ['Floor 12. A child’s height in pencil next to the number. Then another mark, higher.'] },
      { id: 'bucket', type: 'decor', at: [25, 15], look: 'barrel', lines: ['A bucket of sand, full of cigarette ends. Years of them.'] },
      { id: 'stool', type: 'decor', at: [31, 15], look: 'stool', lines: ['A folding stool, and one man’s slipper beside it.'] },
      SOUL([KS('계단에서 우는 건 괜찮아. 센서등이 꺼지니까 아무도 못 봐.', 'It’s all right to cry on the stairs. The sensor lights go out, so nobody sees.')]),
      SOUL([EN('Someone used to come out here to smoke for an hour at a time, so as not to go back in. The stairs kept his corner, beside floor ten.')])]),
    mech: [{ type: 'lampsAll', lamps: LAMPK.map(function (k) { return 'lamp' + SF[k]; }), time: 32, light: 3, give: 'E202',
      litLines: ['Click. Light. Somewhere below, another lamp is already counting down.', 'The sensor lamp wakes. The stairwell holds its breath.', 'Click. You can almost hear the first lamp’s timer, ticking.'],
      onLine: 'Still on. For now.', doneLine: 'The lamps stay on now. They seem to have forgotten how to go out.',
      winLines: ['All five lamps burn at once, from floor 7 to floor 11: a ladder of light.', 'For a moment the whole stairwell is lit, and nobody is on it but you.',
        'The lamp of floor 11 comes loose in your hand and keeps glowing.'] }],
    npcs: [{ id: 'N1104', name: 'A Student Taking the Stairs', look: H({ t: 'kid', hairStyle: 'long', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1a1a'], eyes: 'down', acc: 'book', h: 20 }),
        behavior: 'patrol', path: [[3, SY(4) - 2], [22, SY(4) - 2]], speed: 0.6, solid: false,
        lines: [KS('엘리베이터 기다릴 시간에 계단 오르면 영어 단어 스무 개.', 'If I take the stairs instead of waiting for the lift, that’s twenty English words.'),
          KS('센서등은 삼십 초야. 그 안에 다 켜면 계단이 기억해.', 'The sensor lamps last thirty seconds. Light them all in time and the stairs remember.'),
          'She climbs past, mouthing vocabulary, and never gets any higher.'] },
      { id: 'N1105', name: 'Someone Smoking on the Stairs', look: { t: 'shadow', c: ['#2a2a30'], h: 22 }, behavior: 'static', at: [27, 9], solid: false,
        lines: ['A shadow on a folding stool. Its cigarette never burns down.', KS('들어가기 싫어서. 딱 한 대만.', 'I just don’t want to go in yet. Just the one.'),
          KS('여기서 한 시간. 그러면 다들 자.', 'An hour out here. By then, they’re all asleep.')] }],
    info: { summary: 'A switchback stairwell lit by motion-sensor lamps that go out too soon. Floor four is painted over with an F.',
      rules: ['Five sensor lamps, on floors 7 to 11, switch on when touched and go out again after about thirty seconds. Light all five at once to receive the Sensor Light (E202).',
        'The fire door of floor 12 leads to the twelfth-floor corridor; the top landing leads to the roof.',
        'Secret: beside the landing of floor 10, an opening leads into a corner full of invisible walls. The way through ends at a service ladder down to car park B2.'],
      lore: 'The stairs people take when they do not want to be seen going home.' } });

  /* ---------------------------------------------------------------
   *  W204 — The Guard’s Booth
   *  Puzzle: watch the four screens (visitAll), then keep watch at the
   *  window (standStill) -> the guard sleeps (sleeper 4/4) and gives E204.
   *  Secret: with Off-Air Snow, a door the cameras never show (W217).
   * --------------------------------------------------------------- */
  var CAMS = ['Screen 1: the playground. A swing moves on its own. A little girl stands beside it, not getting on.',
    'Screen 2: car park B2. A blue car with its hazard lights blinking. Footprints in the dust.',
    'Screen 3: the lift. A girl alone, looking straight up into the camera. It is you.',
    'Screen 4: the roof. Water tanks. Something inside one of them answers when the wind speaks.'];
  S({ id: 'W204', name: 'The Guard’s Booth', depth: 2, tier: 'mid', back: 'W061', backLook: 'train', backOpt: { c: ['#e8c020', '#2a2a2a'] }, backLabel: 'the last hagwon bus, back to the hagwon', backAt: [8, 24], outdoor: true,
    map: (function () { var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.'); g.rect(1, 21, 38, 6, ','); g.box(24, 8, 10, 8, '#', ':'); g.set(24, 11, 'g'); g.set(24, 12, 'g'); g.set(28, 15, ':'); g.hline(12, 20, 18, 'f'); return g.rows(); })(),
    look: Object.assign({}, YARD, { floor2: { p: 'asphalt', c: ['#3a3a42'] }, floor3: { p: 'tile', c: ['#b8b0a0', '#988f80'] } }), style: { tallWalls: true, stars: true, sky: NIGHT_SKY },
    music: 'guardbooth', amb: { type: 'crickets', vol: 0.05 }, dark: 0.45,
    doors: [{ to: 'W206', at: [19, 1], look: 'gate', opt: { c: ['#6a6a70'] }, label: 'into the complex, towards the playground' },
      { to: 'W201', at: [35, 1], look: 'door', opt: { style: 'metal', c: ['#6a6a70'] }, label: 'the parcel room of Building 107' },
      { to: 'W217', at: [32, 11], look: 'door', opt: { style: 'metal', c: ['#4a4a50'] }, cond: { equipped: 'E205' }, label: 'a door that no camera ever shows' }],
    place: CAMS.map(function (l, i) { return { id: 'cam' + (i + 1), type: 'decor', at: [26 + i, 9], look: 'monitor', light: 0.8, lines: [l] }; }).concat([
      { id: 'log', type: 'decor', at: [31, 9], look: 'book', light: 1, lines: [{ t: function () { var s = function (k, on, off) { return YN.save.flag(k) ? off : on; };
        return 'The night log, in pencil. 3:00. 1201: ' + s('cx_sleep_1201', 'light on', 'dark') + '. 1202: ' + s('cx_sleep_1202', 'light on', 'dark') + '. 1205: ' + s('cx_sleep_1205', 'television on', 'dark') + '. Booth: ' + s('cx_sleep_guard', 'awake', 'asleep') + '.'; } },
        'At the bottom of the page, a drawing: a lift button marked F, and four little windows, all dark.'] },
      { id: 'keys', type: 'decor', at: [32, 9], look: 'keyring', lines: ['The key board: a hook for every flat. The hook for 1204 is empty. Under it, in pencil: “she wears it”.'] },
      { id: 'heater', type: 'decor', at: [31, 14], look: 'stove', light: 1.2, lines: ['A tiny electric heater, glowing orange, pointed at the guard’s feet.'] },
      { id: 'radio', type: 'decor', at: [25, 14], look: 'radio', lines: ['A radio, very low: a phone-in programme for people who cannot sleep.'] },
      { id: 'cot', type: 'decor', at: [32, 13], look: 'blanketlump', lines: ['A folding bed under the desk, still folded. It has been folded for thirty years.'] },
      { id: 'watch', type: 'decor', at: [25, 11], look: 'scuff', solid: false, flat: true, lines: ['A patch of floor worn pale in front of the window, by thirty years of standing.'] },
      SOUL([KS('경비 아저씨는 스물네 시간 일하고 스물네 시간 쉬어. 쉬는 날에도 꿈에서 순찰을 돌아.', 'The guard works twenty-four hours, then rests twenty-four. On his days off he does his rounds in his dreams.')]),
      SOUL([EN('Every child of the block has been carried home on his back at least once. None of them remembers.')])]),
    decor: [{ look: 'bench', at: [6, 20], lines: ['The hagwon bus stop. A bench worn shiny by children’s rucksacks.'] },
      { look: 'flowers', n: 4, solid: false, lines: ['A flower bed kept by the guard. Marigolds in a row, like children at assembly.'] },
      { look: 'loudspeaker', at: [20, 2], lines: ['The complex loudspeaker announces, to nobody: “The water will be cut off tomorrow from ten until noon.”'] },
      { look: 'crate', n: 2, lines: ['Parcels nobody has collected. One has been here so long it has a name on it: 1204.'] }],
    mech: [{ type: 'visitAll', marks: ['cam1', 'cam2', 'cam3', 'cam4'], countText: 'Screens watched: # / %', done: { flag: 'cx_monitors' }, reward: [{ set: { cx_monitors: true } }],
        winLines: ['The guard rubs his eyes.', KS('다 봤어? 다 들어왔네. 너만 빼고.', 'Seen them all? Everyone’s in. Except you.'),
          KS('딱 삼십 분만 눈 붙일게. 창문 앞에 서 있어 줘. 움직이지 말고.', 'Just thirty minutes’ shut-eye. Stand at the window for me. Don’t move.'), 'He points at the worn patch of floor in front of the glass.'] },
      { type: 'standStill', mark: 'watch', secs: 25, cond: { flag: 'cx_monitors' }, breakLine: 'You moved. Behind you, the guard opens one eye, then closes it again.',
        give: 'E204', reward: [{ set: { cx_sleep_guard: true } }],
        winLines: ['You stand at the window. Nothing passes. A moth. A car without lights. A cat.', 'Behind you, the breathing slows.',
          'He has fallen asleep, cap over his eyes. His whistle has rolled off the desk and into your hand.'] }],
    npcs: [{ id: 'N1106', name: 'The Night Guard', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e0c0a0', '#c8c8c8'], acc: 'lamp' }), behavior: 'static', at: [28, 12], solid: true,
        lines: [SEQ({ notFlag: 'cx_monitors' }, [KS('화면 좀 같이 봐 줄래? 눈이 자꾸 감겨서.', 'Will you watch the screens with me? My eyes keep closing.'), 'He points at the four little monitors above the desk.']),
          SEQ({ all: [{ flag: 'cx_monitors' }, { notFlag: 'cx_sleep_guard' }] }, [KS('창문 앞에 서 있어 줘. 딱 삼십 분만.', 'Stand at the window for me. Just thirty minutes.'), 'He points at the worn patch of floor in front of the glass.']),
          IF({ notFlag: 'cx_sleep_guard' }, KS('스물네 시간 근무야. 아침 여섯 시에 교대해.', 'It’s a twenty-four-hour shift. I hand over at six in the morning.')),
          IF({ notFlag: 'cx_sleep_guard' }, KS('카메라에 안 찍히는 데가 딱 한 군데 있어. 화면에 눈 내리면 아무것도 안 보이거든.', 'There’s one spot the cameras never catch. When it snows on the screen, you can’t see a thing.')),
          IF({ notFlag: 'cx_sleep_guard' }, KS('주민들 다 들어와야 나도 눈 붙여. 다 안 들어와.', 'I only shut my eyes once every resident is in. They never all are.')),
          IF({ flag: 'cx_sleep_guard' }, 'He sleeps sitting up, cap over his eyes, hands folded on the night log.'),
          IF({ flag: 'cx_sleep_guard' }, KS('…107동, 이상 무…', '…Building 107, all clear…'))] },
      { id: 'N1107', name: 'The Hagwon Bus Driver', look: H({ t: 'adult', head: 'cap', body: 'coat', c: ['#3a3a40', '#2a2a30', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', at: [11, 23], solid: true,
        lines: [KS('107동 앞입니다. 내리세요.', 'Building 107. Off you get.'), KS('열 시 반. 오늘도 네가 마지막이네.', 'Half past ten. You’re the last one off again.'),
          KS('내일도 여섯 시에 올게. 학교 끝나면 학원, 학원 끝나면 학원.', 'I’ll be back at six tomorrow. School, then hagwon, then hagwon.')] },
      { id: 'N1108', name: 'A Voice From a Window', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 22,
        ambientLines: [KS('경비! 주차 좀 똑바로 봐요!', 'Guard! Watch the parking properly, will you!'), KS('경비 아저씨, 택배 왜 아직 안 올려 줘요?', 'Guard, why hasn’t my parcel been brought up yet?'),
          'A window slams. The guard bows to it anyway.'] }],
    info: { summary: 'The guard’s booth at the gate of the complex, where the last hagwon bus drops the children at half past ten.',
      rules: ['Watch all four security screens, then stand still on the worn patch in front of the window for about twenty-five seconds: the guard falls asleep and leaves you his whistle (E204). He is one of the four sleepers floor F waits for.',
        'The night log shows which of the four are still awake.',
        'Secret: with the Off-Air Snow (E205) equipped, the cameras lose you and a door appears inside the booth, leading down to the Civil Defence Shelter.'],
      lore: 'Twenty-four-hour shifts, a folding bed never unfolded, and residents who shout from their windows.' } });
  link('W061', { to: 'W204', look: 'door', lookOpt: { style: 'metal', c: ['#e8c020'] }, label: 'the hagwon bus home: next stop, Building 107' });

  /* ---------------------------------------------------------------
   *  W205 — The Water Tanks on the Roof
   *  Puzzle: the big tank answers with another word (echo) -> a plank to 108.
   *  Secret: with the Blackbird Whistle, a ladder up the tallest tank (W052).
   * --------------------------------------------------------------- */
  S({ id: 'W205', name: 'The Water Tanks on the Roof', depth: 2, tier: 'mid', back: 'W026', backLook: 'ladder', backLabel: 'back across the rooftops', backAt: [2, 28], outdoor: true,
    map: (function () { var g = K.grid(44, 32, ' '); g.box(0, 0, 44, 32, '#', '.'); g.rect(3, 3, 6, 4, '#'); g.rect(33, 3, 8, 4, '#');
      [[14, 12], [18, 12], [22, 12], [14, 17], [18, 17], [22, 17]].forEach(function (p) { g.set(p[0], p[1], '^'); }); g.rect(5, 24, 12, 4, ','); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#7a7a7e'] }, floor2: { p: 'soil', c: ['#5a3e26', '#4a3220', '#6e4e30'] }, wall: { p: 'concrete', c: ['#9a9a9e', '#7a7a7e', '#5a5a5e'] } },
    tall: { '^': { look: 'watertower' } }, style: { stars: true, sky: NIGHT_SKY, cliffH: 0.8, cliff: '#2a2a32' }, music: 'watertanks', amb: { type: 'wind', vol: 0.07 },
    doors: [{ to: 'W203', at: [5, 7], look: 'door', opt: { style: 'metal', c: ['#4a4a50'], symbol: 'R' }, label: 'the stairwell door' },
      { to: 'W202', type: 'elevator', at: [36, 7], look: 'elevator', opt: { open: true }, label: 'the lift (floor R)' },
      { to: 'W219', at: [39, 7], look: 'door', opt: { style: 'metal', c: ['#5a5a40'] }, label: 'the lift machine room' },
      { to: 'W216', at: [42, 24], look: 'plank', cond: { flag: 'cx_plank' }, label: 'a plank laid across to the roof of Building 108' },
      { to: 'W052', at: [30, 20], look: 'ladder', cond: { equipped: 'E02' }, label: 'a ladder up the tallest tank, higher than any roof' }],
    place: [{ id: 'bigtank', type: 'decor', at: [28, 20], look: 'watertower', lines: ['The biggest tank. Its side is cold and sweating. Inside, the water is listening.', 'You knock. The tank knocks back, a little late.'] },
      { id: 'c1', type: 'decor', at: [6, 25], look: 'crate', lookOpt: { c: ['#f0f0f0'] }, lines: ['A polystyrene box full of earth: chillies, lettuce, sesame leaves.'] },
      { id: 'c2', type: 'decor', at: [10, 25], look: 'crate', lookOpt: { c: ['#f0f0f0'] }, lines: ['A polystyrene box of spring onions, growing out of the city.'] },
      { id: 'c3', type: 'decor', at: [14, 26], look: 'crate', lookOpt: { c: ['#f0f0f0'] }, lines: ['A polystyrene box with nothing in it but a label: “next spring”.'] },
      { id: 'view', type: 'decor', at: [22, 30], look: 'glint', solid: false, lines: ['Below, the whole complex: twenty buildings, two thousand windows. A handful are still lit.'] },
      SOUL([EN('The tanks hold the water for the whole building. Every bath, every pot of rice, every tear down a sink passes through here first.')]),
      SOUL([KS('여기 올라오면 숨이 쉬어져. 위에서는 아무도 시키지 않아.', 'Up here I can breathe. Nobody gives orders up here.')])],
    decor: [{ look: 'clothesline', n: 2, lines: ['Bedsheets drying on the roof at night. They will smell of the city.'] },
      { look: 'antenna', n: 3, lines: ['A satellite dish turned towards a country where it is still daytime.'] },
      { look: 'tuft', n: 3, solid: false, lines: ['Red chillies drying on a mat. Someone will come for them in the autumn.'] }],
    mech: [{ type: 'echo', zone: [25, 17, 31, 23], words: ['water', 'home', 'mum', 'fine', 'here', 'again', 'later', 'tomorrow'], done: { flag: 'cx_plank' }, reward: [{ set: { cx_plank: true } }],
      winLines: ['You say the word back to the tank. It answers with your own voice, a little older.', 'Across the gap, a plank slides from the roof of Building 108 to this one. It is just wide enough for a child.'] }],
    npcs: [{ id: 'N1109', name: 'A Boy Shouting Into a Tank', look: H({ t: 'kid', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#e0c0a0', '#1a1a1a'], h: 17 }), behavior: 'static', at: [26, 22], solid: true,
        lines: [KS('물탱크한테 말하면 다른 말로 대답해.', 'If you talk to the tank, it answers with a different word.'),
          KS('그 말을 똑같이 따라 하면 돼. 그러면 길이 생겨.', 'Say that word back to it, exactly. Then a way appears.'),
          'He cups his hands and shouts into the tank. It answers with a word he did not say.'] },
      { id: 'N1110', name: 'An Old Woman Tending Chillies', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#8a6a5a', '#6a4a3a', '#e0c0a0', '#d0d0d0'], acc: 'seeds' }), behavior: 'wander', radius: 2, speed: 0.4, at: [10, 27], solid: true,
        lines: [KS('옥상 텃밭이야. 고추, 상추, 깻잎.', 'It’s a rooftop garden. Chillies, lettuce, sesame leaves.'), KS('여기보다 높은 데는 새만 가. 휘파람 부는 새.', 'Only birds go higher than this. Birds that whistle.'),
          KS('옛날에 아는 할머니가 휘파람으로 새를 불렀어. 새들이 대답했지.', 'A grandmother I used to know called the birds by whistling. They answered her.')] },
      { id: 'N1111', name: 'A Pigeon', count: 3, look: { t: 'bird', c: ['#8a8a96'], h: 8 }, behavior: 'fly', radius: 6, speed: 1, solid: false, lines: ['A pigeon walking along the edge of the roof as if it owned the city.'] }],
    info: { summary: 'The roof of Building 107 at night: water tanks, drying chillies, bedsheets, two thousand windows below.',
      rules: ['Say a word inside the circle around the biggest tank: it answers with another word. Say that word back to it: a plank appears across to the roof of Building 108 (The Building Opposite).',
        'The lift machine room leads down into the Lift Shaft.',
        'Secret: with the Blackbird Whistle (E02) equipped, a ladder appears on the tallest tank. It climbs to the Roof of the World.'],
      lore: 'Where the building keeps its water, and its gardens.' } });
  link('W026', { to: 'W205', look: 'ladder', label: 'a ladder down onto a roof full of water tanks' });

  /* ---------------------------------------------------------------
   *  W206 — The Playground Between the Blocks
   *  Puzzle: tag (catchN, four children) -> the Key Child gives E201.
   *  Secret: with the Guard’s Whistle, a gap in the hedge (W094).
   * --------------------------------------------------------------- */
  var TAGKIDS = [['N1112', 'Min-su', '#c04040', [18, 18]], ['N1113', 'Ji-ho', '#4060c0', [24, 13]], ['N1114', 'Seo-yeon', '#40a060', [30, 20]], ['N1115', 'Da-eun', '#c0a030', [20, 22]]];
  S({ id: 'W206', name: 'The Playground Between the Blocks', depth: 2, tier: 'mid', back: 'W201', backLook: 'door', backOpt: { style: 'glass', c: ['#8ab0c8'], symbol: '107' }, backLabel: 'the entrance of Building 107', backAt: [24, 5], outdoor: true,
    map: (function () { var g = K.grid(48, 34, ' '); g.box(0, 0, 48, 34, '#', '.'); g.rect(1, 1, 46, 4, '#'); g.rect(1, 8, 5, 18, '#'); g.rect(42, 8, 5, 18, '#'); g.rect(14, 10, 20, 14, ','); g.rect(16, 12, 6, 4, ':'); return g.rows(); })(),
    look: Object.assign({}, YARD, { floor2: { p: 'mat', c: ['#a04848', '#3a7a52'] } }), style: { stars: true, sky: NIGHT_SKY }, music: 'playgroundnight', amb: { type: 'crickets', vol: 0.05 }, dark: 0.5,
    doors: [{ to: 'W216', at: [6, 16], look: 'door', opt: { style: 'glass', c: ['#8ab0c8'], symbol: '108' }, label: 'the entrance of Building 108, opposite' },
      { to: 'W207', at: [41, 16], look: 'gate', opt: { c: ['#6a7a6a'] }, label: 'behind Building 106: the recycling corner' },
      { to: 'W204', at: [24, 32], look: 'gate', opt: { c: ['#6a6a70'] }, label: 'the path down to the gate and the guard’s booth' },
      { to: 'W094', at: [45, 30], look: 'bush', cond: { equipped: 'E204' }, label: 'a gap in the hedge, where children run when they are called in' }],
    place: [{ id: 'swing1', type: 'decor', at: [28, 12], look: 'swing', lines: ['A swing, moving a little, with nobody on it.'] },
      { id: 'swing2', type: 'decor', at: [30, 12], look: 'swing', lines: ['A swing tied up with a skipping rope so that it cannot be used after ten.'] },
      { id: 'sand', type: 'decor', at: [19, 14], look: 'sandbox', solid: false, lines: ['A sandpit. Somebody has buried a toy car and drawn a map to it on the edge.'] },
      { id: 'hop', type: 'decor', at: [10, 28], look: 'hopscotch', solid: false, flat: true, lines: ['A hopscotch grid in chalk. The last square says HOME.'] },
      { id: 'ball', type: 'decor', at: [26, 18], look: 'ball', solid: false, lines: ['A ball left out. Whoever owned it was called in mid-game.'] },
      { id: 'pergola', type: 'decor', at: [40, 29], look: 'hut', lines: ['A wooden pergola where the grandmothers sit in the daytime. At night, only their cushions stay.'] },
      { id: 'hedge1', type: 'decor', at: [43, 30], look: 'bush', lines: ['A thick hedge. There are small footprints going into it, and none coming out.'] },
      { id: 'hedge2', type: 'decor', at: [46, 31], look: 'bush', lines: ['The hedge rustles, as if somebody small were holding their breath inside.'] },
      SOUL([KS('놀이터 불은 열 시에 꺼져. 그다음엔 그네만 혼자 놀아.', 'The playground lights go out at ten. After that, only the swings keep playing.')]),
      SOUL([EN('A key on a string bumps against your chest when you run. That is how you know you are going home to no one.')])],
    decor: [{ look: 'bench', n: 3, lines: ['A bench facing the playground. Mothers sit here in the daytime, looking at their phones.', 'A bench with a forgotten cardigan, folded.'] },
      { look: 'tree', n: 6, lines: ['A cherry tree, planted the year the building was finished.'] },
      { look: 'streetlamp', n: 3, light: 2, lines: ['A lamp post with a poster on it: “Have you seen this cat?”'] }],
    mech: [{ type: 'catchN', tag: 'cx_tag', n: 4, countText: 'Caught: # / %', give: 'E201',
      winLines: ['Four children caught. One by one, the windows call them in, and they go.', 'Only the girl by the swings is left. Nobody calls her.',
        KS('다 잡았네. 이거 가져. 나는 열쇠가 두 개야.', 'You caught them all. Take this. I’ve got two keys.'),
        'She threads one of her two keys onto a shoelace and hangs it round your neck.'] }],
    npcs: TAGKIDS.map(function (k) { return { id: k[0], name: k[1] + ', Playing Tag', tag: 'cx_tag', look: H({ t: 'kid', body: 'shirt', c: [k[2], '#2a2a2a', '#f0d0b0', '#1a1a1a'], h: 16 }),
        behavior: 'wander', radius: 6, speed: 1.6, at: k[3], solid: false,
        lines: [KS('잡아 봐!', 'Catch me!'), KS('술래다! 도망가!', 'You’re it! Run!'), KS('우리 엄마 곧 불러. 그 전에 잡아야 돼.', 'My mum’s about to call me. You have to catch me before.')] }; }).concat([
      { id: 'N1116', name: 'The Key Child', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#d0a0a8', '#b08088', '#f0d0b8', '#1a1010'], h: 17 }), behavior: 'static', at: [29, 14], solid: true,
        lines: [SEQ({ noEffect: 'E201' }, [KS('술래잡기 할래? 네가 술래야.', 'Want to play tag? You’re it.'), 'She points at the other children, one by one: catch them all.']),
          KS('다들 엄마가 부르면 들어가. 나는 안 불러. 엄마 일하거든.', 'They all go in when their mums call. Nobody calls me. Mum’s at work.'),
          KS('경비 아저씨가 호루라기 불면 다들 저 덤불 뒤로 도망가.', 'When the guard blows his whistle, everyone runs off behind that hedge.'),
          IF({ effect: 'E201' }, KS('열쇠 잃어버리지 마. 끈은 내가 묶었어.', 'Don’t lose the key. I tied the string myself.'))] },
      { id: 'N1117', name: 'Mothers at the Windows', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 16,
        ambientLines: [KS('민수야! 밥 먹어!', 'Min-su! Dinner!'), KS('지호야, 들어와! 지금 몇 시야!', 'Ji-ho, come in! Do you know what time it is?'), KS('서연아, 숙제 다 했어?', 'Seo-yeon, have you finished your homework?'),
          KS('다은아, 학원 가야지!', 'Da-eun, time for hagwon!'), 'A window opens, calls a name that is not yours, and closes.'] }]),
    info: { summary: 'The courtyard playground between Buildings 106, 107 and 108, at night: swings, a sandpit, children nobody has called in yet.',
      rules: ['Play tag: touch the four children (Min-su, Ji-ho, Seo-yeon, Da-eun). When all four are caught, the Key Child gives you the Key on a String (E201).',
        'Doors lead to Building 108 (The Building Opposite), the recycling corner, and the gate with the guard’s booth.',
        'Secret: with the Guard’s Whistle (E204) equipped, a gap opens in the hedge behind the pergola: the Street of Children Alone.'],
      lore: 'Children called in one by one, and the one nobody calls.' } });

  /* ---------------------------------------------------------------
   *  W207 — The Recycling Corner
   *  Puzzle: push the three bins onto their painted squares -> E206.
   *  Secret: a cardboard wall (?) hides what nobody could throw away (W214).
   * --------------------------------------------------------------- */
  S({ id: 'W207', name: 'The Recycling Corner', depth: 2, tier: 'mid', back: 'W063', backLook: 'door', backOpt: { style: 'glass', c: ['#40e0a0'] }, backLabel: 'the back door of the convenience store', backAt: [15, 20],
    map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.'); g.rect(1, 1, 20, 4, '#'); g.hline(1, 28, 5, '#'); g.set(24, 5, '?'); g.set(25, 5, '?'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#8a8a86'] }, wall: { p: 'flat', c: ['#3a3e3a', '#2a2e2a'], topColor: '#3a3e3a' }, wallface: { p: 'panel', c: ['#8a948a', '#6a746a', '#4a544a'], skirt: '#3a443a' } },
    style: { tallWalls: true }, music: 'recycling', amb: { type: 'fridge', vol: 0.04 }, dark: 0.45, extra: NOGEN,
    doors: [{ to: 'W206', at: [1, 16], look: 'gate', opt: { c: ['#6a7a6a'] }, label: 'the path behind Building 106, back to the playground' }],
    place: [{ id: 'b1', type: 'decor', at: [9, 14], look: 'trash', lookOpt: { c: ['#3a6ac8'] }, lines: ['A wheeled bin marked PLASTIC.'] },
      { id: 'b2', type: 'decor', at: [14, 15], look: 'trash', lookOpt: { c: ['#d8b020'] }, lines: ['A wheeled bin marked CANS.'] },
      { id: 'b3', type: 'decor', at: [19, 14], look: 'trash', lookOpt: { c: ['#3a9a4a'] }, lines: ['A wheeled bin marked GLASS.'] },
      { id: 'p1', type: 'decor', at: [6, 9], look: 'chalkmark', solid: false, flat: true, lines: ['A rectangle painted on the concrete: PLASTIC.'] },
      { id: 'p2', type: 'decor', at: [14, 9], look: 'chalkmark', solid: false, flat: true, lines: ['A rectangle painted on the concrete: CANS.'] },
      { id: 'p3', type: 'decor', at: [22, 9], look: 'chalkmark', solid: false, flat: true, lines: ['A rectangle painted on the concrete: GLASS.'] },
      { id: 'piano', type: 'decor', at: [3, 7], look: 'piano', lines: ['An upright piano with a large-item sticker on it. Someone gave up on it, one evening.'] },
      { id: 'sofa', type: 'decor', at: [26, 13], look: 'sofa', lines: ['A sofa put out for collection. The cushions still hold the shape of a family watching television.'] },
      { id: 'wardrobe', type: 'decor', at: [27, 9], look: 'commode', lines: ['A wardrobe with a child’s stickers on the inside of the door.'] },
      { id: 'kiddesk', type: 'decor', at: [26, 17], look: 'desk', lines: ['A child’s desk, with heights pencilled up one leg.'] },
      { id: 'suitcase', type: 'decor', at: [3, 18], look: 'suitcase', lines: ['A suitcase marked “J.”. Its sticker was never paid for, so nobody will take it away.'] },
      { id: 'foodbin', type: 'decor', at: [19, 20], look: 'barrel', lookOpt: { c: ['#d8c040'] }, lines: ['The yellow food-waste bin. It smells of every dinner in the building.'] },
      { id: 'thin', type: 'decor', at: [24, 6], look: 'scuff', solid: false, flat: true, lines: ['The back wall here is only cardboard, painted grey. It gives a little when you lean on it.'] },
      { id: 'toW214', type: 'door', to: 'W214', at: [27, 2], look: 'door', lookOpt: { style: 'wood', c: ['#8a6a4a'] }, label: 'a door with a moving-company sticker', unreachOk: 'behind the false wall (Glasses)' },
      { id: 'slippers', type: 'decor', at: [22, 2], look: 'shoe', lines: ['A pair of grandmother’s slippers. Nobody could bring themselves to put them in a bin.'] },
      { id: 'drawing', type: 'decor', at: [23, 1], look: 'drawing', lines: ['A child’s drawing: three people under one umbrella. It has been folded and unfolded many times.'] },
      { id: 'photo', type: 'decor', at: [25, 3], look: 'photo', lines: ['A wedding photograph with one face cut out, very carefully.'] },
      SOUL([EN('Some things are too big for the bin and too heavy to keep. They wait here for someone to pay for them to disappear.')], [22, 4]),
      SOUL([KS('버리는 것도 돈이 들어. 그래서 못 버리는 사람도 있어.', 'Throwing things away costs money. So some people can’t.')])],
    decor: [{ look: 'trash', at: [5, 20], lines: ['Rows of bins with lids like mouths.'] }, { look: 'trash', at: [9, 20], lines: ['A bin for vinyl, overflowing with the plastic bags of a whole week.'] },
      { look: 'crate', at: [2, 12], lines: ['Flattened cardboard, tied with string, ready to be sold by the kilo.'] }, { look: 'crate', at: [2, 13], lines: ['More cardboard. A box that once held a television, and before that, hope.'] }],
    mech: [{ type: 'push', blocks: ['b1', 'b2', 'b3'], plates: ['p1', 'p2', 'p3'], give: 'E206',
      winLines: ['The last bin rolls onto its painted rectangle with a clunk.', 'The cardboard grandmother claps once, slowly.',
        KS('아이고, 잘했네. 이거 붙이면 뭐든 가져가. 사람 빼고.', 'Well done, you. Stick this on anything and they’ll take it away. Anything but people.'), 'She presses a yellow sticker into your hand.'] }],
    npcs: [{ id: 'N1118', name: 'The Cardboard Grandmother', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#7a6a5a', '#5a4a3a', '#e0c0a0', '#d8d8d8'], acc: 'bag' }), behavior: 'static', at: [4, 15], solid: true,
        lines: [KS('박스 모아서 하루에 이천 원.', 'I collect boxes. Two thousand won a day.'),
          KS('통은 그림 위에 놔야 돼. 밀어. 끌면 안 돼.', 'The bins go on their painted squares. Push them. You can’t pull.'),
          KS('수요일이 분리수거 날이야. 오늘은 수요일이야. 매일 수요일이야.', 'Wednesday is recycling day. Today is Wednesday. Every day is Wednesday.'),
          KS('저 벽 뒤에 못 버리는 것들 모아 놨어. 안경 쓰면 보여.', 'Behind that wall I keep the things nobody can throw away. You’d see them with glasses on.')] },
      { id: 'N1119', name: 'A Cat in the Food-Waste Bin', look: { t: 'cat', c: ['#c8a060', '#e8d040'], h: 12 }, behavior: 'wander', radius: 1, speed: 0.5, at: [20, 19], solid: false,
        lines: ['A cat eating out of the food-waste bin with great dignity.', 'It looks at you as if you were the one in the bin.'] }],
    info: { summary: 'The covered bin area behind Building 106: colour-coded bins, cardboard, and the big things people cannot afford to throw away.',
      rules: ['Push the three wheeled bins onto the three painted rectangles (walk into a bin to push it). The cardboard grandmother gives you the Large-Item Sticker (E206).',
        'Secret: the back wall is cardboard. With the Glasses (E14) it can be walked through: a hidden room of things nobody could throw out, and a door to Flat 1206 on moving day.'],
      lore: 'Recycling day, every day; and the elderly who live off cardboard at two thousand won a day.' } });
  link('W063', { to: 'W207', look: 'door', lookOpt: { style: 'metal', c: ['#5a6a5a'] }, label: 'the back door, out to the bins' });

  /* ---------------------------------------------------------------
   *  W208 — Inside the Shoe Cupboard (every flat’s cupboard opens here)
   *  Puzzle: shoe pairs (pairs) -> E203.
   *  Secret: a mouse-sized gap (Tiny) to the cupboard of 107-1204 in Seoul (W065).
   * --------------------------------------------------------------- */
  var SHOES = [[6, 2], [15, 3], [24, 2], [33, 3], [42, 2], [5, 9], [14, 10], [23, 9], [32, 10], [41, 9]];
  S({ id: 'W208', name: 'Inside the Shoe Cupboard', depth: 2, tier: 'mid', back: 'W215', backLook: 'door', backOpt: { style: 'wood', c: ['#c8a878'], symbol: '1204' }, backLabel: 'out through the cupboard door, into 1204', backAt: [2, 1],
    map: (function () { var g = K.grid(52, 12, ' '); g.box(0, 0, 52, 12, '#', '.'); g.hline(3, 45, 4, '%'); g.hline(3, 45, 7, '%'); [8, 17, 26, 35, 44].forEach(function (x) { g.set(x, 4, '.'); g.set(x, 7, '.'); }); g.vline(46, 1, 10, '%'); g.set(46, 9, '.'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#6a4a30', '#5a3a24', '#7a5a3a'] }, wall: { p: 'flat', c: ['#1a120a', '#100a04'], topColor: '#1a120a' }, wall2: { p: 'plank', c: ['#8a6a4a', '#6a4a30', '#a07a50'] },
      wallface: { p: 'panel', c: ['#7a5a3a', '#5a3a24', '#3a2414'], skirt: '#2a1a0a' } },
    style: { tallWalls: true }, music: 'shoecupboard', amb: { type: 'hum', vol: 0.04 }, dark: 0.55, extra: NOGEN,
    doors: [{ to: 'W212', at: [12, 1], look: 'door', opt: { style: 'wood', c: ['#9a7a5a'], symbol: '1201' }, label: 'a cupboard door that smells of soup (1201)' },
      { to: 'W213', at: [21, 1], look: 'door', opt: { style: 'wood', c: ['#9a7a5a'], symbol: '1202' }, label: 'a cupboard door with a sticky note on it (1202)' },
      { to: 'W209', at: [30, 1], look: 'door', opt: { style: 'wood', c: ['#9a7a5a'], symbol: '1205' }, label: 'a cupboard door humming with television (1205)' },
      { to: 'W214', at: [39, 1], look: 'door', opt: { style: 'wood', c: ['#9a7a5a'], symbol: '1206' }, label: 'a cupboard door with a moving-company sticker (1206)' }],
    place: SHOES.map(function (p, i) { return { id: 's' + (i + 1), type: 'decor', at: p, look: 'shoe', lines: ['A shoe, alone on the shelf.'] }; }).concat([
      { id: 'leftshoe', type: 'decor', at: [27, 5], look: 'shoe', lookOpt: { c: ['#8a6a4a'] }, lines: ['A child’s left shoe, very old, with no partner anywhere. The other shoes give it room, out of respect.'] },
      { id: 'mousehole', type: 'decor', at: [46, 9], look: 'crack', solid: false, smallOnly: true, lines: ['A gap between two shoe boxes, just big enough for a mouse. Or for someone very small.'] },
      { id: 'toW065', type: 'door', to: 'W065', at: [49, 2], look: 'door', lookOpt: { style: 'metal', c: ['#8a8a8e'], symbol: '1204' }, label: 'a cupboard door marked Building 107, flat 1204: the one in Seoul' },
      { id: 'cmirror', type: 'decor', at: [2, 10], look: 'mirror', lines: ['A little mirror screwed to the inside of the cupboard door. It has seen everyone in the building leave, and nearly everyone come back.'] },
      SOUL([EN('Shoes facing the door are going out. Shoes facing the flat have come home. Count them, and you know who is missing.')]),
      SOUL([KN('왼쪽 신발 한 짝. 렬차에 두고 왔습니다.', 'One left shoe. Left behind on a train.')])]),
    decor: [{ look: 'crate', n: 3, lines: ['A shoe box labelled in marker: “Dad, winter”. Empty.', 'A shoe box of school shoes, every size from small to smaller.'] }],
    mech: [{ type: 'pairs', tiles: SHOES.map(function (p, i) { return 's' + (i + 1); }), give: 'E203',
      wrongLine: 'Not a pair. The two shoes shuffle apart, embarrassed.', doneLine: 'Every pair is together now, toes towards the door, ready to leave.',
      winLines: ['The last two shoes meet and settle side by side, toes pointing at the door.', 'On the inside of a cupboard door, a little mirror turns on its screw, as if offering itself.',
        'You unscrew it. It fits in your hand.'] }],
    npcs: [{ id: 'N1120', name: 'Slippers Nobody Is Wearing', look: { t: 'shadow', c: ['#c8a8a0'], h: 9 }, behavior: 'wander', radius: 4, speed: 0.6, at: [20, 6], solid: false,
        lines: ['A pair of guest slippers shuffling down the aisle with nobody in them.', 'They stop when you look, like children caught out of bed.'] },
      { id: 'N1121', name: 'Voices From the Doorways', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 15,
        ambientLines: [KS('다녀왔습니다.', 'I’m home.'), KS('다녀오겠습니다.', 'I’m off now.'), KS('신발 정리해.', 'Put your shoes away properly.'), KS('…아무도 없어?', '…Is nobody home?'),
          'Somewhere along the cupboard, a door opens. Shoes come in. Nobody is wearing them.'] }],
    info: { summary: 'The inside of the shoe cupboard: one long dark space shared by every flat’s entrance, shelves of shoes, a single old left shoe.',
      rules: ['Find the pairs: each shoe shows a sign when touched; touch two with the same sign to put them together. All five pairs give the Shoe-Cupboard Mirror (E203).',
        'Cupboard doors lead into flats 1201, 1202, 1204 (the way you came), 1205 and 1206.',
        'Secret: at the far end, a mouse-sized gap between shoe boxes. Only someone Tiny (E13) gets through: a cupboard door into the Identical Apartments.'],
      lore: 'Every shoe cupboard in the building opens onto the same dark. Ok-sun’s left shoe is in there somewhere.' } });

  /* ---------------------------------------------------------------
   *  W209 — The Neighbour’s Television (flat 1205)
   *  Puzzle: switch the TV off at the right frame (cycleFrames)
   *  -> sleeper 1205 + E205. Secret: the black screen is a door (W055).
   * --------------------------------------------------------------- */
  S({ id: 'W209', name: 'The Neighbour’s Television', depth: 2, tier: 'mid', back: 'W211', backLook: 'door', backOpt: { style: 'metal', c: ['#6a4a3a'], symbol: '1205' }, backLabel: 'the front door, back to the corridor', backAt: [2, 14],
    map: (function () { var g = K.grid(24, 16, ' '); g.box(0, 0, 24, 16, '#', '.'); g.rect(6, 4, 12, 6, ','); g.rect(1, 13, 5, 2, ':'); return g.rows(); })(),
    look: Object.assign({}, HOME, { floor2: { p: 'rug', c: ['#7a5a6a', '#6a4a5a'] } }), style: { tallWalls: true }, music: 'neighbourtv', amb: { type: 'tv', vol: 0.06 }, dark: 0.65, extra: NOGEN,
    doors: [{ to: 'W208', at: [5, 14], look: 'door', opt: { style: 'wood', c: ['#c8a878'] }, label: 'the shoe cupboard by the front door' }],
    place: [{ id: 'tvOn', type: 'decor', at: [12, 2], look: 'crt', light: 2.2, cond: { notFlag: 'cx_sleep_1205' }, lines: ['The television. It has been on for years.'] },
      { id: 'tvOff', type: 'decor', at: [12, 2], look: 'crt', cond: { all: [{ flag: 'cx_sleep_1205' }, { notEquipped: 'E205' }] }, lines: ['The television is off. In the black glass, the room looks smaller, and somebody else is in it.'] },
      { id: 'tvDoor', type: 'door', to: 'W055', at: [12, 2], look: 'crt', cond: { all: [{ flag: 'cx_sleep_1205' }, { equipped: 'E205' }] }, label: 'the black screen, which is a door now' },
      { id: 'sofa', type: 'decor', at: [12, 8], look: 'sofa', lines: ['A brown sofa with a dent the exact shape of one old man.'] },
      { id: 'photos', type: 'decor', at: [4, 1], look: 'photo', lines: ['Family photographs, all turned to face the wall.'] },
      { id: 'photo2', type: 'decor', at: [6, 1], look: 'photo', lines: ['One photograph is the right way round: a boy in a graduation gown. The glass has been wiped many times.'] },
      { id: 'cal', type: 'decor', at: [18, 1], look: 'calendar', lines: ['A calendar stopped at Chuseok, three years ago. A date circled in red: “son visiting”.'] },
      { id: 'phone', type: 'decor', at: [20, 5], look: 'phone', lines: ['The telephone. Its cord has been stretched as far as the sofa, so that he would hear it.'] },
      { id: 'table', type: 'decor', at: [8, 6], look: 'table', lines: ['A low table: a cup of barley tea gone cold, and his reading glasses.'] },
      SOUL([KS('아들이 사 준 텔레비전이야. 아들 대신 매일 말을 걸어.', 'My son bought me that television. It talks to me every day, instead of him.')]),
      SOUL([EN('Some televisions never sleep, so that the person in front of them can. They pass the static on.')])],
    mech: [{ type: 'cycleFrames', mark: 'tvOn', every: 2.6, good: 4, give: 'E205', reward: [{ set: { cx_sleep_1205: true } }],
      frames: ['Home shopping. A woman smiles at a non-stick pan at three in the morning. “Only ten left!”',
        'The news, sound off. A graph of overtime hours climbs off the edge of the screen.',
        'A drama. A grown-up son comes home at last and everyone cries. The old man’s lips move.',
        'The national anthem: a flag, mountains, the sun rising over the sea. The broadcast day is ending.',
        'The anthem has ended. The test card comes up, with its long, flat tone.',
        'Snow. Only snow, and its hiss.'],
      winLines: ['You press the button just as the long tone begins. Click. The screen shrinks to a white dot, then nothing.',
        'In the dark, the old man sighs, turns onto his side and falls properly asleep, for the first time in years.',
        'A little static has jumped from the screen onto your sleeve. It stays there, crackling softly.'] }],
    npcs: [{ id: 'N1122', name: 'The Old Man of 1205', look: H({ t: 'old', body: 'sweater', c: ['#8a7a6a', '#6a5a4a', '#e0c8a8', '#d8d8d8'], eyes: 'closed' }), behavior: 'static', at: [12, 7], solid: true,
        lines: [SEQ({ notFlag: 'cx_sleep_1205' }, ['He is talking in his sleep.', KS('…애국가 끝나면 꺼라… 끝나면…', '…Switch it off when the anthem’s over… once it’s over…')]),
          IF({ notFlag: 'cx_sleep_1205' }, KS('…아들 왔나…? 아니구나.', '…Is that my son…? No.')),
          IF({ notFlag: 'cx_sleep_1205' }, 'His hand twitches towards a remote control that is not there.'),
          IF({ flag: 'cx_sleep_1205' }, 'He sleeps on his side now, one hand under his cheek, like a boy.')] },
      { id: 'N1123', name: 'The Television', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 20, ambientEvery: 12, appearHere: { notFlag: 'cx_sleep_1205' },
        ambientLines: [KS('지금 바로 전화 주세요! 단 열 개 남았습니다!', 'Call now! Only ten left!'), KS('내일은 전국에 비가 오겠습니다.', 'Tomorrow, rain across the whole country.'),
          'Canned laughter, for nobody.', KS('아버지, 저 왔어요.', 'Father, I’m home.')] }],
    info: { summary: 'Flat 1205: an old man asleep in front of a television that has been on for years.',
      rules: ['The television cycles through programmes. Use it just after the national anthem, when the test card comes up: the old man really falls asleep (one of the four sleepers for floor F) and you receive the Off-Air Snow (E205).',
        'Secret: once the television is off, equip the Off-Air Snow and the black screen becomes a door to the Television Shop.'],
      lore: 'A son who calls at Chuseok, and a television that talks instead.' } });

  /* ---------------------------------------------------------------
   *  W210 — Car Park B2
   *  Puzzle: follow the footprints (trail) -> the shelter door (W217).
   *  Secret: the Large-Item Sticker on the blue car; behind it, W049.
   * --------------------------------------------------------------- */
  S({ id: 'W210', name: 'Car Park B2', depth: 2, tier: 'mid', back: 'W201', backLook: 'stairs', backLabel: 'the stairs back up to the lobby', backAt: [6, 1],
    map: (function () { var g = K.grid(56, 40, ' '); g.box(0, 0, 56, 40, '#', '.'); g.rect(1, 1, 10, 4, ':'); for (var y = 8; y <= 32; y += 8) for (var x = 8; x <= 48; x += 8) g.set(x, y, '^'); for (var yy = 10; yy <= 30; yy += 8) g.hline(4, 50, yy, ','); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#5a5a60'] }, floor2: { p: 'hstripes', c: ['#5a5a60', '#c8b840'] }, floor3: { p: 'tile', c: ['#7a7a80', '#6a6a70'] }, wall: { p: 'concrete', c: ['#4a4a50', '#3a3a40', '#2a2a30'] } },
    tall: { '^': { look: 'pillar' } }, style: { tallWalls: true }, music: 'carparkb2', amb: { type: 'drip', vol: 0.06 }, dark: 0.7,
    doors: [{ to: 'W202', type: 'elevator', at: [3, 1], look: 'elevator', opt: { open: true }, label: 'the lift' },
      { to: 'W203', at: [1, 20], look: 'ladder', label: 'a service ladder up into the stairwell' },
      { to: 'W217', at: [52, 38], look: 'door', opt: { style: 'metal', c: ['#5a6a5a'] }, cond: { flag: 'cx_trail' }, label: 'a heavy grey door under a civil-defence sign' }],
    place: [{ id: 'tstart', type: 'decor', at: [5, 5], look: 'scuff', solid: false, flat: true, lines: ['Footprints in the dust, starting at the lift. Someone walked from here in a hurry, carrying something heavy.'] },
      { id: 'tend', type: 'decor', at: [51, 37], look: 'scuff', solid: false, flat: true, lines: ['The footprints stop here, toes against the wall.'] },
      { id: 'jcar', type: 'decor', at: [53, 20], look: 'carpart', lookOpt: { c: ['#3a5a8a'] }, flickerLight: 1.6, flickerSpeed: 5, cond: { notFlag: 'cx_car_gone' },
        lines: ['A blue car with its hazard lights blinking. A parking permit for Building 107, and a child’s drawing of three people on the dashboard.',
          'The hazard lights have been blinking for years. The battery should be flat by now. It isn’t.'],
        onEffect: { E206: [{ set: { cx_car_gone: true } }, { lines: ['You stick the sticker on the windscreen. PAID. COLLECTION BEFORE 6 A.M.', 'You blink. The car has gone. Only a dry rectangle on the concrete, and a door in the wall where it stood.'] }, { reeval: true }] } },
      { id: 'toW049', type: 'door', to: 'W049', at: [54, 20], look: 'door', lookOpt: { style: 'metal', c: ['#3a3a40'] }, cond: { flag: 'cx_car_gone' }, label: 'a door behind the place where the blue car was' },
      SOUL([KS('아빠 차는 아직 여기 있어. 아빠만 없어.', 'Dad’s car is still here. Only Dad isn’t.')]),
      SOUL([EN('Under every apartment block in Seoul there is a shelter. Under every shelter, a quieter one.')])],
    decor: [{ look: 'carpart', n: 7, opt: { c: ['#6a6a70'] }, lines: ['A car under a grey cover. Nobody has driven it since the redundancies.', 'A car with a child seat in the back and a pillow in the front.', 'A car parked across two spaces, as if it had arrived in a hurry and never left.'] },
      { look: 'poster', n: 2, lines: ['Painted on a pillar: B2, ZONE C. REMEMBER WHERE YOU PARKED.'] },
      { look: 'puddle', n: 3, solid: false, lines: ['A puddle dripping from nowhere. It reflects a ceiling higher than this one.'] },
      { look: 'vent', n: 2, lines: ['A ventilation shaft breathing out warm air, like something asleep.'] }],
    mech: [{ type: 'trail', from: 'tstart', to: 'tend', slack: 1, lostLine: 'The footprints go on without you.', done: { flag: 'cx_trail' }, reward: [{ set: { cx_trail: true } }],
        winLines: ['You follow the footprints to the very end. They stop at the wall, toes touching it.', 'The wall is a door: grey, heavy, with a civil-defence sign above it. A little man running into a doorway.'] },
      { type: 'flickerLights' }],
    npcs: [{ id: 'N1124', name: 'A Man Asleep in His Car', look: H({ t: 'adult', body: 'suit', c: ['#2e3240', '#20242e', '#e0c0a0', '#1a1a1a'], eyes: 'closed' }), behavior: 'static', at: [20, 27], solid: true,
        lines: [KS('…집에 들어가면 애들 깨. 여기서 좀 자고 갈게.', '…If I go in, I’ll wake the kids. I’ll just sleep here for a bit.'), KS('…몇 시야? 세 시? 여섯 시에 나가야 돼.', '…What time is it? Three? I have to leave at six.'),
          'He sleeps with the seat tipped back, tie still on, keys in the ignition.'] },
      { id: 'N1125', name: 'The Night Guard on His Rounds', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e0c0a0', '#c8c8c8'], acc: 'lamp' }), behavior: 'patrol', path: [[12, 12], [44, 12], [44, 28], [12, 28]], speed: 0.5, solid: true,
        lines: [KS('순찰 중이야. 지하는 춥지?', 'On my rounds. Cold down here, isn’t it?'), KS('파란 차? 몇 년째 비상등 켜 놓고 있어. 주인은 안 와.', 'The blue car? Its hazard lights have been on for years. The owner never comes.'),
          KS('대형 폐기물 스티커 붙이면 다 가져가. 차도.', 'Put a large-item sticker on anything and they take it away. Even a car.')] }],
    info: { summary: 'The underground car park under Building 107: pillars, covered cars, a blue car with its hazard lights on, footprints in the dust.',
      rules: ['Follow the footprints from the lift to the far corner without straying: a heavy door appears there, down to the Civil Defence Shelter.',
        'The lift, the stairs to the lobby and a service ladder to the emergency stairs are near the top left.',
        'Secret: face the blue car with the Large-Item Sticker (E206) equipped and use it: the car is taken away, and a door behind it leads to the Endless Car Park.'],
      lore: 'Men who sleep in their cars so as not to wake their families, and a car nobody comes back for.' } });

  /* ---------------------------------------------------------------
   *  W211 — The Twelfth-Floor Corridor
   *  Puzzle: the keypad of 1204 hears its code (password) -> door 1204.
   *  Secret: 1203 is ajar only when the bedroom door is ajar (W216).
   * --------------------------------------------------------------- */
  var C12 = [[8, '1201', 'W212'], [15, '1202', 'W213'], [36, '1205', 'W209'], [43, '1206', 'W214']];
  S({ id: 'W211', name: 'The Twelfth-Floor Corridor', depth: 2, tier: 'mid', back: 'W202', backType: 'elevator', backLook: 'elevator', backOpt: { open: true }, backLabel: 'the lift', backAt: [2, 3],
    map: (function () { var g = K.grid(50, 9, ' '); g.rect(0, 0, 50, 6, '#'); g.rect(1, 3, 48, 3, '.'); g.hline(1, 48, 6, 'f'); return g.rows(); })(),
    look: Object.assign({}, APT, { floor: { p: 'concrete', c: ['#a8a49c'] } }), style: { tallWalls: true, stars: true, sky: NIGHT_SKY }, music: 'floor12', amb: { type: 'city', vol: 0.05 }, dark: 0.4, extra: NOGEN,
    doors: C12.map(function (c) { return { to: c[2], at: [c[0], 3], look: 'door', opt: { style: 'metal', c: ['#6a4a3a'], symbol: c[1] }, label: 'door ' + c[1] }; }).concat([
      { to: 'W215', at: [29, 3], look: 'door', opt: { style: 'metal', c: ['#6a4a3a'], symbol: '1204' }, label: 'door 1204, home', cond: { any: [{ equipped: 'E201' }, { flag: 'cx_1204_code' }] },
        locked: 'Door 1204. Home. The keypad glows green. Under it, a sticky note in a child’s handwriting: “code = our door, backwards”.' },
      { to: 'W216', at: [22, 3], look: 'door', opt: { style: 'metal', c: ['#5a4a4a'], symbol: '1203' }, cond: { doorAjar: true }, label: 'door 1203, open a crack' },
      { to: 'W203', at: [47, 3], look: 'door', opt: { style: 'metal', c: ['#3a7a4a'], symbol: 'EXIT' }, label: 'the emergency stairs' }]),
    place: [{ id: 'door1203', type: 'decor', at: [22, 3], look: 'door', lookOpt: { style: 'metal', c: ['#5a4a4a'], symbol: '1203' }, cond: { doorAjar: false },
        lines: ['Door 1203. Estate-agent flyers all over it. Behind it, someone breathes, then stops.'] },
      { id: 'keypad', type: 'decor', at: [30, 3], look: 'intercom', light: 0.6, lines: ['The keypad of 1204. Four digits, then the star. It listens, if you say the numbers out loud.'] },
      { id: 'w1201', type: 'decor', at: [10, 3], look: 'window', lines: [IF({ notFlag: 'cx_sleep_1201' }, 'The kitchen window of 1201. A light, and the smell of soup.'), IF({ flag: 'cx_sleep_1201' }, 'The kitchen window of 1201 is dark now. The smell of soup is fading.')] },
      { id: 'w1202', type: 'decor', at: [17, 3], look: 'window', lines: [IF({ notFlag: 'cx_sleep_1202' }, 'The window of 1202. A desk lamp, and the shadow of a head bent over a book.'), IF({ flag: 'cx_sleep_1202' }, 'The window of 1202 is dark.')] },
      { id: 'w1205', type: 'decor', at: [38, 3], look: 'window', lines: [IF({ notFlag: 'cx_sleep_1205' }, 'The window of 1205 flickers blue: a television, talking to someone asleep.'), IF({ flag: 'cx_sleep_1205' }, 'The window of 1205 has stopped flickering.')] },
      { id: 'rack', type: 'decor', at: [12, 3], look: 'shelf', lines: ['A shoe rack outside 1201: an old woman’s slippers, and a pair of men’s shoes, never worn.'] },
      { id: 'railing', type: 'decor', at: [33, 5], look: 'glint', solid: false, lines: ['Beyond the railing: eleven other twelfth floors, each with its own 1204. Most of them are dark.'] },
      SOUL([EN('From the twelfth floor, you can see eleven other twelfth floors. Every one of them has a 1204.')]),
      SOUL([KS('1203호는 이사 갔어. 근데 가끔 문이 조금 열려 있어. 우리 방문처럼.', 'The people in 1203 moved out. But sometimes the door is open a crack. Like my bedroom door.')])],
    decor: [{ look: 'crate', at: [19, 5], lines: ['A delivery box left at a door. The sticker says: “please don’t ring, a child is asleep”.'] },
      { look: 'crate', at: [40, 5], lines: ['A box of tangerines from the countryside, addressed to 1205, unopened.'] },
      { look: 'wheel', at: [25, 5], lines: ['A child’s bicycle chained to the railing, its basket full of rain.'] },
      { look: 'pot', at: [45, 5], lines: ['Pots of chillies along the railing, each with a flat number written on the side.'] },
      { look: 'pot', at: [5, 5], lines: ['A pot of chrysanthemums nobody waters. They flower anyway.'] }],
    mech: [{ type: 'password', mark: 'keypad', dist: 3, words: ['4021', '4 0 2 1', '사공이일'], do: [{ set: { cx_1204_code: true } }],
      text: 'The keypad plays its three little notes. The lock of 1204 clicks open.', wrong: 'The keypad beeps twice. Wrong code.' }],
    npcs: [{ id: 'N1126', name: 'A Delivery Rider', look: H({ t: 'adult', head: 'helmet', body: 'shirt', c: ['#3080c0', '#2060a0', '#e0c0a0', '#e8e8e8'], acc: 'bag' }), behavior: 'patrol', path: [[5, 4], [45, 4]], speed: 0.9, solid: false,
        lines: [KS('배달이요! …아무도 안 나오시네. 문 앞에 둘게요.', 'Delivery! …Nobody’s coming. I’ll leave it at the door.'), KS('벨 누르지 말래요. 애가 혼자 잔대요.', 'They said not to ring. A child is sleeping on her own.'),
          KS('별점 다섯 개만 부탁드려요.', 'Five stars, please, if you can.')] },
      { id: 'N1127', name: 'The Key Child', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#d0a0a8', '#b08088', '#f0d0b8', '#1a1010'], h: 17 }), behavior: 'static', at: [27, 5], solid: true,
        lines: [KS('열쇠 잃어버렸어. 비밀번호는 몰라. 엄마가 우리 집 거꾸로래.', 'I lost my key. I don’t know the code. Mum says it’s our door, backwards.'),
          KS('번호는 소리 내서 말하면 돼. 문이 들어.', 'You just say the numbers out loud. The door listens.'),
          KS('일, 이, 공, 사… 거꾸로 하면…', 'One, two, zero, four… backwards, that’s…'), 'She counts on her fingers and gives up, and sits down against the wall.'] }],
    info: { summary: 'The open-air corridor of the twelfth floor: six numbered doors, shoe racks, a railing over the night.',
      rules: ['Door 1204 opens with the Key on a String (E201) equipped, or by saying its code near the keypad: 4021 (the door number backwards).',
        'Doors lead into flats 1201, 1202, 1205 and 1206, the emergency stairs and the lift. The kitchen windows show which flats are still awake.',
        'Secret: when the bedroom door is left ajar (in the waking room), door 1203 is ajar too. It opens onto The Building Opposite.'],
      lore: 'Six doors, one corridor, everyone listening through the walls and nobody knocking.' } });

  /* ---------------------------------------------------------------
   *  W212 — Flat 1201, Where the Soup Stays Warm
   *  Puzzle: eat, then say the words before eating (sayTo) -> sleeper 1201.
   *  Secret: her son's room opens for a key worn round the neck (E201).
   * --------------------------------------------------------------- */
  S({ id: 'W212', name: 'Flat 1201, Where the Soup Stays Warm', depth: 2, tier: 'mid', back: 'W211', backLook: 'door', backOpt: { style: 'metal', c: ['#6a4a3a'], symbol: '1201' }, backLabel: 'the front door, propped open with a brick', backAt: [2, 14],
    map: (function () { var g = K.grid(22, 16, ' '); g.box(0, 0, 22, 16, '#', '.'); g.vline(14, 1, 8, '#'); g.hline(14, 20, 8, '#'); g.set(14, 5, '.'); g.rect(1, 13, 5, 2, ':'); return g.rows(); })(),
    look: HOME, style: { tallWalls: true }, music: 'soup1201', amb: { type: 'fridge', vol: 0.04 }, dark: 0.4, extra: NOGEN,
    doors: [{ to: 'W208', at: [5, 14], look: 'door', opt: { style: 'wood', c: ['#c8a878'] }, label: 'the shoe cupboard by her door' }],
    place: [{ id: 'soup', type: 'decor', at: [3, 1], look: 'stove', light: 1.2, lines: ['A pot of soybean-paste soup on the lowest flame. It has been kept warm for twenty years.'],
        use: [{ if: { not: { temp: { cx_soup: true } } }, temp: { cx_soup: true }, time: 30, msg: 'You eat a bowl, standing up. It tastes of someone waiting. The dream feels a little longer.' }] },
      { id: 'sink', type: 'decor', at: [5, 1], look: 'sink', lines: ['Two bowls drying on the rack. Two spoons. Two pairs of chopsticks.'] },
      { id: 'sonphoto', type: 'decor', at: [9, 1], look: 'photo', lines: ['A photograph of a boy in a school uniform, with a key on a string round his neck.'] },
      { id: 'cal', type: 'decor', at: [11, 1], look: 'calendar', lines: ['A calendar. Chuseok is circled every year. Under each circle, in pencil: “didn’t come”.'] },
      { id: 'table', type: 'decor', at: [6, 6], look: 'table', lines: ['A low table set for two, every night.'] },
      { id: 'phone', type: 'decor', at: [11, 11], look: 'phone', lines: ['The telephone, on a cushion, beside the mattress.'] },
      { id: 'mattress', type: 'decor', at: [9, 12], look: 'blanketlump', lines: ['A mattress on the floor, close to the telephone, just in case.'] },
      { id: 'sondoor', type: 'decor', at: [14, 5], look: 'door', lookOpt: { style: 'wood', c: ['#7a5a3a'] }, solid: false, block: { unless: { equipped: 'E201' } },
        lines: ['Her son’s room. Locked. The keyhole is small and old: the kind for a key worn on a string.'] },
      { id: 'sonbed', type: 'decor', at: [18, 2], look: 'bed', lines: ['A boy’s bed with clean sheets. She changes them every Sunday. He has not slept here for twenty years.'] },
      { id: 'sondesk', type: 'decor', at: [19, 5], look: 'desk', lines: ['A desk with an exam timetable from 1999 still pinned above it.'] },
      { id: 'sonshelf', type: 'decor', at: [20, 3], look: 'shelf', lines: ['Trophies for coming first. Every one of them dusted.'] },
      { id: 'sonposter', type: 'decor', at: [16, 1], look: 'poster', lines: ['A poster of a footballer, faded to blue.'] },
      SOUL([KS('엄마, 나 바빠. 다음에 갈게.', 'Mum, I’m busy. I’ll come next time.')], [17, 5]),
      SOUL([EN('She leaves the front door open a crack so the corridor smells of soup. Children with keys round their necks come in to eat.')])],
    mech: [{ type: 'sayTo', ent: 'N1128', dist: 3, cond: { temp: { cx_soup: true } }, notNow: 'She pushes the pot towards you first. Eat, then speak.',
      words: ['잘 먹겠습니다', '잘먹겠습니다', '잘 먹었습니다', 'jal meokgetseumnida', 'jal meokgesseumnida', 'thank you for the food', 'thanks for the food', 'i will eat well', 'thank you', 'thanks', '감사합니다', '고맙습니다', 'delicious'],
      done: { flag: 'cx_sleep_1201' }, reward: [{ set: { cx_sleep_1201: true } }],
      winLines: ['She smiles as if somebody had come home.', KS('그래. 그 말 듣고 싶었어. 이제 잘 수 있겠다.', 'Yes. That’s what I wanted to hear. Now I can sleep.'),
        'She turns off the gas. For the first time in twenty years, the pot is allowed to go cold.'] }],
    npcs: [{ id: 'N1128', name: 'The Grandmother of 1201', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#c8a8a0', '#a88880', '#e0c0a0', '#d8d8d8'] }), behavior: 'static', at: [6, 4], solid: true,
        lines: [IF({ notFlag: 'cx_sleep_1201' }, KS('배고프지? 국 먹어. 식기 전에.', 'You’re hungry, aren’t you? Have some soup. Before it goes cold.')),
          SEQ({ notFlag: 'cx_sleep_1201' }, [KS('먹기 전에 뭐라고 하지?', 'What do we say before we eat?'), 'She joins her hands and bows a little over an imaginary bowl, waiting for the words.']),
          IF({ notFlag: 'cx_sleep_1201' }, KS('우리 아들도 너만 할 때 열쇠를 목에 걸고 다녔어. 그 방 열쇠도 똑같은 거야.', 'My son wore his key round his neck too, at your age. His room takes the same kind.')),
          IF({ notFlag: 'cx_sleep_1201' }, KS('전화 오면 깨워 줘. 추석에는 꼭 온댔어.', 'Wake me if the phone rings. He said he’d come for Chuseok, for sure.')),
          IF({ flag: 'cx_sleep_1201' }, 'She sleeps curled up beside the telephone, one hand on the receiver, just in case.')] }],
    info: { summary: 'Flat 1201: an old woman who keeps a pot of soup warm for a son who never comes, and for the latchkey children of the floor.',
      rules: ['Eat from the pot of soup (it adds a little dream time), then say the words before a meal to the grandmother: “잘 먹겠습니다”, or “thank you for the food”. She finally sleeps: one of the four sleepers for floor F.',
        'Secret: with the Key on a String (E201) equipped, her son’s locked room can be entered: it has been kept exactly as it was.'],
      lore: 'Twenty Chuseoks circled on the calendar, and children from other flats who eat her soup instead.' } });

  /* ---------------------------------------------------------------
   *  W213 — Flat 1202, the Exam Year
   *  Puzzle: walk the English sentence on the floor (stepOrder) -> sleeper 1202.
   *  Secret: in the last two minutes of the dream, a door under the desk (W061).
   * --------------------------------------------------------------- */
  var NOTES = [['you', [8, 9]], ['are', [13, 6]], ['allowed', [10, 12]], ['to', [15, 10]], ['rest', [6, 6]]];
  S({ id: 'W213', name: 'Flat 1202, the Exam Year', depth: 2, tier: 'mid', back: 'W211', backLook: 'door', backOpt: { style: 'metal', c: ['#6a4a3a'], symbol: '1202' }, backLabel: 'the front door, back to the corridor', backAt: [2, 14],
    map: (function () { var g = K.grid(22, 16, ' '); g.box(0, 0, 22, 16, '#', '.'); g.rect(1, 13, 5, 2, ':'); return g.rows(); })(),
    look: Object.assign({}, HOME, { wallface: { p: 'wallpaper', c: ['#e8e8d8', '#d0d0c0', '#f0e060'], skirt: '#7a6a58' } }), style: { tallWalls: true }, music: 'examyear', amb: { type: 'clock', vol: 0.06 }, dark: 0.5, extra: NOGEN,
    doors: [{ to: 'W208', at: [5, 14], look: 'door', opt: { style: 'wood', c: ['#c8a878'] }, label: 'the shoe cupboard by the door' },
      { to: 'W061', at: [18, 3], look: 'hatch', cond: { remainingLt: 120 }, label: 'a small door under the desk, the size of a pillow' }],
    place: NOTES.map(function (n, i) { return { id: 'note' + i, type: 'decor', at: n[1], look: 'scraps', solid: false, flat: true, lines: ['A sticky note stuck to the floor. One English word: “' + n[0] + '”.'] }; }).concat([
      { id: 'desk', type: 'decor', at: [16, 3], look: 'desk', lookOpt: { lamp: true, book: true }, light: 2.4, lines: ['A desk buried in workbooks. A timetable: 06:00 hagwon, 08:00 school, 17:00 hagwon, 22:00 study room, 02:00 sleep?'] },
      { id: 'piano', type: 'decor', at: [3, 3], look: 'piano', lines: ['A piano under a sheet. Taped to the sheet, a note: “after the exam”. The note is three years old.'] },
      { id: 'cal', type: 'decor', at: [12, 1], look: 'calendar', lines: ['A countdown calendar: D-100. Every day before today has been crossed out so hard the paper tore.'] },
      { id: 'wall1', type: 'decor', at: [18, 1], look: 'poster', lines: ['Sticky notes in rows on the wall: formulas, dates, irregular verbs. One just says “sleep?”, and it is crossed out.'] },
      { id: 'wall2', type: 'decor', at: [20, 1], look: 'poster', lines: ['A poster of a university gate. In the corner, someone has drawn a much smaller door.'] },
      { id: 'cans', type: 'decor', at: [19, 6], look: 'glass', lines: ['Three empty energy-drink cans, lined up like trophies.'] },
      { id: 'fruit', type: 'decor', at: [9, 3], look: 'table', lines: ['A plate of apple slices going brown, with a fork on top. Cut at midnight, by someone who loves her.'] },
      { id: 'sofa', type: 'decor', at: [5, 11], look: 'sofa', lines: ['The sofa, with a mother asleep on it, sitting up.'] },
      SOUL([EN('In the last minutes before morning, the desk opens onto the hagwon. It always does. That is how she gets there so early.')]),
      SOUL([KS('일등 아니면 꼴등이야. 중간은 없대.', 'First or last. They say there’s nothing in between.')])]),
    mech: [{ type: 'stepOrder', plates: (function () { var o = {}; NOTES.forEach(function (n, i) { o[n[1][0] + ',' + n[1][1]] = i; }); return o; })(), count: NOTES.length, color: 'rgba(255,240,160,0.9)',
      done: { flag: 'cx_sleep_1202' }, reward: [{ set: { cx_sleep_1202: true } }],
      winLines: ['You walk the sentence across the floor: you, are, allowed, to, rest.', KS('…쉬어도 된다.', '…allowed to rest.'),
        'The student’s head sinks onto her arms. For the first time in a hundred days, she sleeps. The desk lamp dims by itself.'] }],
    npcs: [{ id: 'N1129', name: 'The Student of 1202', look: H({ t: 'kid', hairStyle: 'long', body: 'uniform', c: ['#3a3a5a', '#2a2a4a', '#f0d0b0', '#1a1a1a'], eyes: 'line', h: 21 }), behavior: 'static', at: [16, 4], solid: true,
        lines: [IF({ notFlag: 'cx_sleep_1202' }, KS('수능 백 일 남았어. 자면 안 돼.', 'A hundred days until the exam. I can’t sleep.')),
          SEQ({ notFlag: 'cx_sleep_1202' }, [KS('영어 문장 하나만 더. “너는 쉬어도 된다.” 바닥에 붙여 놨는데 순서가 기억이 안 나.', 'One more English sentence. “You are allowed to rest.” It’s on the floor, but I forget the order.'),
            'She mouths the English words one by one, without a sound.']),
          IF({ notFlag: 'cx_sleep_1202' }, KS('엄마는 소파에서 기다려. 여섯 시에 학원 데려다주려고.', 'Mum waits on the sofa. To drive me to the six o’clock hagwon.')),
          IF({ flag: 'cx_sleep_1202' }, 'She has fallen asleep on her arms, a highlighter still in her hand.')] },
      { id: 'N1130', name: 'Her Mother, Asleep on the Sofa', look: H({ t: 'adult', hairStyle: 'short', body: 'sweater', c: ['#8a7a9a', '#6a5a7a', '#e0c0a0', '#2a1a10'], eyes: 'closed' }), behavior: 'statue', at: [5, 10], solid: true,
        lines: ['She is asleep sitting up, car keys in her hand, ready to drive her daughter to the six o’clock hagwon.', KS('…과일 깎아 놨어… 먹으면서 해…', '…I’ve cut you some fruit… eat it while you study…')] }],
    info: { summary: 'Flat 1202: a student a hundred days before the national exam, awake at three, and a mother asleep on the sofa with the car keys.',
      rules: ['Five sticky notes on the floor each carry an English word. Step on them in the order of the sentence the student is trying to learn: you, are, allowed, to, rest. She falls asleep: one of the four sleepers for floor F.',
        'Secret: in the last two minutes of the dream, a small door opens under the desk: it leads to the Evening Hagwon.'],
      lore: 'The exam year: a piano under a sheet, a countdown calendar, a sentence nobody had said to her.' } });

  /* ---------------------------------------------------------------
   *  W214 — Flat 1206, Moving Day
   *  Puzzle: corner the cat (corner) -> the ladder truck to the new flat (W220).
   *  Secret: say goodbye to the flat -> the door frame opens (W207).
   * --------------------------------------------------------------- */
  S({ id: 'W214', name: 'Flat 1206, Moving Day', depth: 2, tier: 'mid', back: 'W211', backLook: 'door', backOpt: { style: 'metal', c: ['#6a4a3a'], symbol: '1206' }, backLabel: 'the front door, back to the corridor', backAt: [2, 16],
    map: (function () { var g = K.grid(26, 18, ' '); g.box(0, 0, 26, 18, '#', '.'); [[5, 5], [6, 5], [10, 8], [11, 8], [15, 5], [16, 4], [19, 9], [8, 12], [14, 12], [15, 12], [20, 13], [4, 9]].forEach(function (p) { g.set(p[0], p[1], '{'); }); g.rect(1, 15, 5, 2, ':'); return g.rows(); })(),
    look: Object.assign({}, HOME, { wallface: { p: 'wallpaper', c: ['#e0dccc', '#c8c4b4', '#a8a090'], skirt: '#7a6a58' } }), tall: { '{': { look: 'crate' } }, style: { tallWalls: true }, music: 'movingday', amb: { type: 'machine', vol: 0.04 }, dark: 0.3, extra: NOGEN,
    doors: [{ to: 'W208', at: [4, 16], look: 'door', opt: { style: 'wood', c: ['#c8a878'] }, label: 'the shoe cupboard by the door' },
      { to: 'W220', at: [12, 1], look: 'ladder', cond: { flag: 'cx_cat' }, label: 'the ladder truck at the window, down to the new flat',
        locked: 'The ladder truck hums at the window. The movers won’t go until everyone is packed. Someone small is missing.' },
      { to: 'W207', at: [6, 1], look: 'door', opt: { style: 'wood', c: ['#c8b898'] }, cond: { any: [{ said: 'goodbye' }, { said: '안녕' }, { said: 'bye' }] }, label: 'the door frame with the height marks, open onto somewhere else' }],
    place: [{ id: 'marks', type: 'decor', at: [7, 1], look: 'chalkmark', solid: false, lines: ['Pencil marks on the door frame: a child’s height every birthday, from knee-high to shoulder. The last one says 10.'] },
      { id: 'wardrobe', type: 'decor', at: [22, 2], look: 'commode', lines: ['A wardrobe too big for the new flat. It is staying. It does not seem surprised.'] },
      { id: 'throwbox', type: 'decor', at: [18, 15], look: 'crate', lines: ['A box marked TO THROW AWAY. Inside: drawings, a stuffed rabbit, a school prize.'] },
      SOUL([EN('A flat you leave keeps the shape of you for a while. Say goodbye, and it lets you through one last time.')]),
      SOUL([KS('새 아파트는 브랜드야. 거기 살면 다들 부러워해.', 'The new flat has a famous name. Everyone envies you if you live there.')])],
    mech: [{ type: 'corner', ent: 'N1131', done: { flag: 'cx_cat' }, reward: [{ set: { cx_cat: true } }],
      winLines: ['The cat lets itself be caught at last, wedged between two boxes marked KITCHEN.', 'You carry it to the basket. Now nobody is left behind.',
        'At the window, the ladder truck hums. The movers nod: time to go down to the new flat.'] }],
    npcs: [{ id: 'N1131', name: 'The Family Cat', look: { t: 'cat', c: ['#8a8a90', '#e8d040'], h: 12 }, behavior: 'flee', fleeDist: 4, radius: 6, speed: 1.6, at: [17, 10], solid: true,
        lines: ['A grey cat between two boxes. It will not be moved. Nobody asked it.', 'It flattens its ears: this is its flat.'] },
      { id: 'N1132', name: 'A Mover', look: H({ t: 'adult', head: 'cap', body: 'shirt', c: ['#4a6a4a', '#3a5a3a', '#d0a880', '#1a1a1a'], acc: 'tray' }), behavior: 'static', at: [9, 14], solid: true,
        lines: [KS('고양이 찾으면 출발해요. 새 아파트로.', 'We leave once the cat’s found. To the new flat.'), KS('새 집은 다 새거예요. 냄새도 없어요. 아무 냄새도.', 'Everything in the new place is new. It doesn’t even smell. Of anything.'),
          'He tapes up a box marked TO THROW AWAY without looking inside.'] },
      { id: 'N1133', name: 'The Daughter of 1206', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#e0a040', '#c08030', '#f0d0b0', '#1a1010'], h: 16 }), behavior: 'static', at: [21, 12], solid: true,
        lines: [KS('이사 가기 싫어. 키 재 놓은 거, 못 가져가잖아.', 'I don’t want to move. We can’t take the height marks with us.'), KS('엄마가 집한테 인사하래. 안녕이라고, 소리 내서.', 'Mum says to say goodbye to the flat. Out loud.'),
          KS('고양이가 숨었어. 고양이도 이사 가기 싫대.', 'The cat’s hidden. The cat doesn’t want to move either.')] }],
    info: { summary: 'Flat 1206 on moving day: boxes everywhere, a ladder truck at the window, a cat that will not be packed.',
      rules: ['Corner the family cat between the boxes so that it cannot run any further: the movers can leave, and the ladder truck at the window leads down to the Show Flat.',
        'Secret: say “goodbye” (or 안녕) out loud tonight: the door frame with the height marks opens onto the hidden room of the Recycling Corner.'],
      lore: 'Height marks that cannot be packed, and a new flat that smells of nothing.' } });

  /* ---------------------------------------------------------------
   *  W215 — Flat 1204 at Three in the Morning
   *  Puzzle: reach the silhouette that backs away (recede) -> her coat, a door (W118).
   *  Secret: when the bedroom light is off, the wardrobe opens (W087).
   * --------------------------------------------------------------- */
  S({ id: 'W215', name: 'Flat 1204 at Three in the Morning', depth: 2, tier: 'mid', back: 'W211', backLook: 'door', backOpt: { style: 'metal', c: ['#6a4a3a'], symbol: '1204' }, backLabel: 'the front door, back to the corridor', backAt: [1, 16],
    map: (function () {
      var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, '#', '.');
      g.hline(1, 28, 15, '#'); g.set(5, 15, '.'); g.set(15, 15, '.'); g.set(24, 15, '.');
      g.vline(12, 1, 14, '#'); g.vline(20, 1, 14, '#');
      g.rect(1, 16, 4, 3, ':'); g.rect(1, 1, 11, 3, ',');
      return g.rows();
    })(),
    look: Object.assign({}, HOME, { floor2: { p: 'tile', c: ['#a8b0a8', '#889088'] } }), style: { tallWalls: true }, music: 'flat1204', amb: { type: 'fridge', vol: 0.05 }, dark: 0.55, extra: NOGEN,
    doors: [{ to: 'W208', at: [1, 18], look: 'door', opt: { style: 'wood', c: ['#c8a878'] }, label: 'the shoe cupboard by the front door' },
      { to: 'W216', at: [3, 1], look: 'window', label: 'the balcony window, across to Building 108' },
      { to: 'W118', at: [28, 16], look: 'door', opt: { style: 'metal', c: ['#e0e8e8'] }, cond: { flag: 'cx_coat' }, label: 'a door that smells of disinfectant' },
      { to: 'W087', at: [27, 8], look: 'commode', cond: { dark: true }, label: 'the wardrobe, open in the dark, full of curtains' }],
    place: [{ id: 'coat', type: 'decor', at: [21, 17], look: 'ghostfig', lookOpt: { c: ['#d8e0e8'] }, cond: { notFlag: 'cx_coat' }, lines: ['Her silhouette, at the end of the hall. When you look at it, it is further away.'] },
      { id: 'wardrobe', type: 'decor', at: [27, 8], look: 'commode', cond: { dark: false }, lines: ['Your wardrobe. When the doorbell rings and Mum isn’t home, this is where you go.'] },
      { id: 'fridge', type: 'decor', at: [11, 5], look: 'fridge', cycle: false, lines: ['Magnets hold a note on the fridge, in your mother’s hurried handwriting:', KS('밥 먹고 자. 냉장고에 반찬 있어. 엄마 일곱 시에 와. 사랑해.', 'Eat, then bed. Side dishes in the fridge. Mum’s home at seven. Love you.')] },
      { id: 'cooker', type: 'decor', at: [9, 5], look: 'jar', light: 0.8, lines: ['The rice cooker. Its little red light says KEEP WARM. It has said it for twelve hours.'] },
      { id: 'clock', type: 'decor', at: [6, 4], look: 'wallclock', lines: ['The kitchen clock: 3:00. The second hand moves. The minute hand never does.'] },
      { id: 'table', type: 'decor', at: [6, 8], look: 'table', lines: ['A plate under clingfilm: rolled omelette, cut into neat slices, for one.'] },
      { id: 'tv', type: 'decor', at: [2, 6], look: 'tv', lines: ['The television is off. In the black glass, the flat looks bigger, and emptier.'] },
      { id: 'phone', type: 'decor', at: [11, 12], look: 'phone', lines: ['The telephone. If you lift the receiver, you hear a hospital corridor, very far away.'] },
      { id: 'washer', type: 'decor', at: [1, 3], look: 'washer', lines: ['The washing machine, spinning in the dark. It works the night shift too.'] },
      { id: 'herbs', type: 'decor', at: [9, 1], look: 'pot', lines: ['Pots of herbs on the balcony, watered by someone who is never here in daylight.'] },
      { id: 'mumbed', type: 'decor', at: [16, 3], look: 'bed', lookOpt: { c: ['#e8e8f0', '#a0a8c0'] }, lines: ['Your mother’s bed, made with tight hospital corners. The pillow is cold.'] },
      { id: 'mumrobe', type: 'decor', at: [18, 10], look: 'commode', lines: ['Her wardrobe. One hanger is empty: the one for her uniform.'] },
      { id: 'slippers', type: 'decor', at: [3, 18], look: 'shoe', lookOpt: { c: ['#e8a0b0'] }, lines: ['Her slippers by the front door, set facing outwards, ready for her to step into at seven.'] },
      { id: 'mybed', type: 'decor', at: [23, 3], look: 'bed', lines: ['Your bed. The covers are thrown back, as if you had just got up to check something.'] },
      { id: 'mylamp', type: 'decor', at: [27, 2], look: 'lamp', light: 3, lines: ['Your lamp, switched on. It is always on. It is waiting for someone else’s hand.'] },
      { id: 'mydesk', type: 'decor', at: [22, 7], look: 'desk', lookOpt: { book: true }, lines: ['Your desk. A drawing of three people, one of them coloured in very hard.'] },
      { id: 'drawings', type: 'decor', at: [25, 1], look: 'drawing', lines: ['Drawings taped to the wall. In every one of them, the window is lit.'] },
      SOUL([KS('세 시에 깨면 엄마는 없어. 일곱 시에 깨면 엄마는 자.', 'Wake at three and Mum isn’t here. Wake at seven and Mum’s asleep.')]),
      SOUL([EN('When the light at home goes off, the wardrobe here opens onto a room of curtains. Hiding is easier in the dark.')])],
    mech: [{ type: 'recede', mark: 'coat', dist: 7, done: { flag: 'cx_coat' }, reward: [{ set: { cx_coat: true } }],
      winLines: ['You reach the end of the hall. It was only her coat, on its hook.', 'It smells of hospital soap and the night bus.',
        KS('괜찮아. 엄마 일곱 시에 와.', 'It’s all right. Mum’s home at seven.'), 'Where the coat hung, a door you have never noticed. It smells of disinfectant.'] }],
    npcs: [{ id: 'N1134', name: 'The Rice Cooker', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 14, ambientEvery: 18, at: [9, 6],
        ambientLines: [KS('취사가 완료되었습니다. 보온을 시작합니다.', 'Cooking complete. Keeping warm.'), KS('보온 열두 시간째입니다.', 'Twelfth hour of keeping warm.'),
          KS('맛있는 밥이 완성되었습니다. 밥을 잘 저어 주세요.', 'Your delicious rice is ready. Please stir well.'), KS('…보온 중입니다…', '…keeping warm…')] },
      { id: 'N1135', name: 'A Moth at the Lamp', look: { t: 'moth', c: ['#f0e8b0'], h: 7, glow: '#f0e8b0', shadow: false }, behavior: 'orbit', center: [27, 3], radius: 1, speed: 0.8, solid: false,
        lines: ['A moth circling your lamp. It has been keeping it company all night.'] }],
    info: { summary: 'Flat 1204, three in the morning: the rice cooker keeping warm, a note on the fridge, a made bed, a lamp left on. Mum is at work.',
      rules: ['At the end of the hallway, her silhouette backs away whenever you look at it. Follow it to the end of the hall: it was only her coat, and a door appears where it hung (the Hospital Beneath Reality).',
        'The balcony window leads across to The Building Opposite; the shoe cupboard by the door leads inside the shoe cupboard.',
        'Secret: when the light in the waking bedroom is off, the wardrobe in the girl’s room opens onto the Room of a Thousand Curtains.'],
      lore: 'The flat as it is every night: everything left ready, nobody there.' } });

  /* ---------------------------------------------------------------
   *  W216 — The Building Opposite (Building 108)
   *  Puzzle: copy the girl in the window opposite (dirSequence) -> W068.
   *  Secret: a door in the corner behind the bicycles (W064).
   * --------------------------------------------------------------- */
  var WIN108 = [
    ['A lit window: a man in a tie asleep at a laptop, the report still open.', 'A dark window. Someone is lying awake in it; you can tell.', 'A lit window: a woman ironing a school uniform for tomorrow.', 'A lit window: a baby being walked up and down, up and down.', 'A dark window, with a paper star stuck to it.'],
    ['A lit window: a boy doing maths on the floor, using the bed as a desk.', 'A lit window: an old couple watching the same drama on two televisions.', 'A dark window. A cat sits in it, guarding nothing.', 'A lit window: someone rehearsing a job interview to a mirror.', 'A lit window: a grandmother folding dumplings for an army.'],
    ['A lit window: a delivery rider eating standing up.', 'A dark window. A phone screen glows under a blanket.', 'A lit window: a nurse putting her shoes on to leave.', 'A lit window: two sisters whispering, a torch between them.', 'A dark window, newly dark. Someone has just stopped waiting and gone to bed.']];
  var WX = [6, 12, 18, 30, 36], WY = [4, 11, 18];
  S({ id: 'W216', name: 'The Building Opposite', depth: 2, tier: 'mid', back: 'W206', backLook: 'gate', backOpt: { c: ['#6a6a70'] }, backLabel: 'the courtyard, back between the blocks', backAt: [20, 28], outdoor: true,
    map: (function () { var g = K.grid(46, 30, '#'); WY.forEach(function (y) { g.rect(2, y, 39, 2, '.'); }); g.rect(41, 4, 3, 25, ','); g.rect(2, 24, 42, 5, '.'); g.rect(22, 8, 3, 2, '.'); g.hline(22, 24, 10, 'g'); return g.rows(); })(),
    look: Object.assign({}, YARD, { floor2: { p: 'hstripes', c: ['#8a8680', '#6a6660'] }, wall: { p: 'concrete', c: ['#b8b4ac', '#98948c', '#78746c'] } }), style: { stars: true, sky: NIGHT_SKY }, music: 'building108', amb: { type: 'city', vol: 0.05 }, dark: 0.45,
    doors: [{ to: 'W215', at: [2, 4], look: 'plank', label: 'across the gap: the balcony of 1204' },
      { to: 'W205', at: [42, 4], look: 'plank', label: 'the roof of Building 108, and a plank back to 107' },
      { to: 'W211', at: [2, 18], look: 'window', label: 'a window that looks straight into the twelfth floor of Building 107' },
      { to: 'W068', at: [26, 11], look: 'window', cond: { flag: 'cx_waved' }, label: 'her window, open now: a way onto a bridge' },
      { to: 'W064', at: [43, 28], look: 'stairsdown', label: 'a back staircase, down to the first metro of the morning' }],
    place: [].concat.apply([], WY.map(function (y, l) { return WX.map(function (x, i) { return { id: 'win' + l + i, type: 'decor', at: [x, y], look: 'window', light: WIN108[l][i].indexOf('A lit') === 0 ? 1.2 : 0, lines: [WIN108[l][i]] }; }); })).concat([
      { id: 'bike1', type: 'decor', at: [39, 25], look: 'wheel', lines: ['Bicycles chained together, so that none of them can leave.'] },
      { id: 'bike2', type: 'decor', at: [40, 26], look: 'wheel', lines: ['A bicycle with a child seat, and a helmet left in it.'] },
      { id: 'bike3', type: 'decor', at: [41, 27], look: 'wheel', lines: ['A bicycle with a newspaper still in its basket: tomorrow’s.'] },
      SOUL([EN('From 108 you can see straight into 107. Every night, someone over there is looking back.')]),
      SOUL([EN('Behind the bicycles, in the corner, a staircase goes down to the first metro of the morning. Only the paper boys use it.')])]),
    mech: [{ type: 'dirSequence', ent: 'N1136', seq: ['up', 'left', 'down', 'right', 'up', 'left'], dist: 6, done: { flag: 'cx_waved' }, reward: [{ set: { cx_waved: true } }],
      winLines: ['You do the last move together, at the same moment, across the gap.', 'She laughs without a sound, waves, and switches off her light.',
        'Her window swings open. Beyond it, instead of a bedroom: a long bridge in the night, covered in messages.'] }],
    npcs: [{ id: 'N1136', name: 'The Girl in the Window Opposite', look: H({ t: 'kid', hairStyle: 'long', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], h: 17 }), behavior: 'static', at: [23, 9], solid: true,
        lines: ['A girl in the window opposite, in pyjamas. She is awake too.', 'She raises her arms, then points this way and that, as if teaching you a game: copy me.', 'She waits for you to copy her moves, step by step.'] },
      { id: 'N1137', name: 'The Windows of Building 108', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 18,
        ambientLines: ['A window goes dark. Another one lights up.', KS('…보고서 내일 아침까지요? 네. 네. 알겠습니다.', '…The report, by tomorrow morning? Yes. Yes. Understood.'),
          KS('쉿, 아기 깬다.', 'Shh, you’ll wake the baby.'), KS('엄마, 언제 와?', 'Mum, when are you coming home?')] }],
    info: { summary: 'The outside walkways of Building 108, facing 107: fifteen windows, each with someone awake, or someone pretending not to be.',
      rules: ['On the middle walkway, a girl behind a window shows a series of moves. Copy them step by step nearby (up, left, down, right, up, left): her window opens onto the Bridge of Messages.',
        'Doors lead back to the balcony of 1204, the roof of 107, the twelfth-floor corridor, and the courtyard.',
        'Secret: in the corner behind the bicycles, a back staircase leads down to the Rush-Hour Metro.'],
      lore: 'Nobody keeps watch alone: every lit window is somebody else who is not asleep.' } });

  /* ---------------------------------------------------------------
   *  W217 — The Civil Defence Shelter (P3)
   *  Puzzle: the drill quiz (quiz) -> a tunnel dug from the north (W077).
   *  Secret: under the Sensor Light, a classroom door from 1989 (W115).
   * --------------------------------------------------------------- */
  S({ id: 'W217', name: 'The Civil Defence Shelter', depth: 3, tier: 'hard', back: 'W210', backLook: 'door', backOpt: { style: 'metal', c: ['#5a6a5a'] }, backLabel: 'the heavy door, back up to the car park', backAt: [20, 26],
    map: (function () { var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.'); g.box(28, 0, 12, 10, '#', ':'); g.set(33, 9, ':'); g.rect(1, 20, 8, 7, 'k'); g.rect(34, 22, 5, 5, ','); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#6a6a5a'] }, floor2: { p: 'dirt', c: ['#4a4030', '#3a3020', '#5a5040'] }, floor3: { p: 'tile', c: ['#7a7a6a', '#5a5a4a'] },
      wall: { p: 'flat', c: ['#2a2a22', '#1a1a14'], topColor: '#2a2a22' }, wallface: { p: 'panel', c: ['#8a8a6a', '#6a6a4a', '#4a4a30'], skirt: '#3a3a28' } },
    style: { tallWalls: true, renderer: 'sepia' }, music: 'shelter', amb: { type: 'drip', vol: 0.06 }, dark: 0.6,
    doors: [{ to: 'W077', at: [37, 24], look: 'hole', cond: { flag: 'cx_drill' }, label: 'a tunnel dug from the north, a long time ago' },
      { to: 'W115', at: [2, 21], look: 'door', opt: { style: 'wood', c: ['#7a6a4a'] }, cond: { equipped: 'E202' }, label: 'a classroom door, from a drill in 1989' }],
    place: [{ id: 'pa', type: 'decor', at: [19, 12], look: 'loudspeaker', lines: ['The shelter loudspeaker. It is waiting for someone to stand in front of it.'] },
      { id: 'post1', type: 'decor', at: [4, 1], look: 'poster', lines: ['A faded poster: LONG SIREN, GO DOWN. Little drawn people walk calmly into a black doorway.'] },
      { id: 'post2', type: 'decor', at: [10, 1], look: 'poster', lines: ['A poster: TAKE WATER, A TORCH, ONE PHOTO. Underneath, someone has added in pen: “which one?”'] },
      { id: 'post3', type: 'decor', at: [16, 1], look: 'poster', lines: ['A poster: DO NOT WAIT FOR THE OTHERS. THEY KNOW THE WAY. A corner is torn, as if someone had tried to take it down.'] },
      { id: 'map', type: 'decor', at: [22, 1], look: 'frame', lines: ['A map of the peninsula with a line across its middle, drawn very thick, as if the pen had been pressed for years.'] },
      { id: 'radio', type: 'decor', at: [30, 2], look: 'radio', lines: ['An old shelter radio, tuned between two countries.'] },
      { id: 'masks', type: 'decor', at: [36, 2], look: 'locker', lines: ['A cabinet of gas masks, children’s sizes at the bottom.'] },
      { id: 'water', type: 'decor', at: [31, 6], look: 'crate', lines: ['Crates of bottled water, dated 1989. Nobody drank it. Nobody needed to.'] },
      { id: 'post89', type: 'decor', at: [5, 20], look: 'poster', lines: ['In the darkest corner, a poster you can barely read: SCHOOL DRILL, 1989. A whole class sat here, in the dark.'] },
      SOUL([KN('땅굴은 우리가 판 것이 아닙니다. 다들 그렇게 말합니다.', 'We did not dig the tunnel. That is what everyone says.')]),
      SOUL([KS('1989년 훈련 날, 우리 반은 여기 앉아 있었어. 미란이는 귀를 막고 있었고.', 'On drill day in 1989, our class sat here. Mi-ran had her hands over her ears.')])],
    decor: [{ look: 'bench', n: 6, lines: ['A long bench, cold. On it, someone has scratched a family tree with one branch rubbed out.', 'A long bench, for a whole building to sit on, in rows.'] }],
    mech: [{ type: 'quiz', mark: 'pa', intro: ['The loudspeaker crackles into life.', EN('Civil defence drill. Three questions. Answer as you have been taught.')],
      questions: [{ q: 'Long siren. What do you do?', choices: ['Go up to the roof', 'Go down to the shelter', 'Wait at home for Mum'], right: 1 },
        { q: 'What do you take with you?', choices: ['Everything', 'Water, a torch, one photo', 'Nothing at all'], right: 1 },
        { q: 'Someone is missing. What do you do?', choices: ['Wait for them', 'Go back up for them', 'Do not wait. They know the way.'], right: 2 }],
      failLine: 'The loudspeaker sighs: “Incorrect. Read the posters. Begin again.”', done: { flag: 'cx_drill' }, reward: [{ set: { cx_drill: true } }],
      winLines: [EN('Drill over. Thank you for your cooperation.'), 'Behind the last bench, the wall is not a wall. It is a tunnel, dug from the north a long time ago, and nobody ever filled it in.'] }],
    npcs: [{ id: 'N1138', name: 'The Radio Between Two Countries', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 17, at: [30, 3],
        ambientLines: [KN('여기는 평양입니다. 오늘도 모든 것이 좋습니다.', 'This is Pyongyang. Today, too, everything is fine.'), KN('남쪽의 동포 여러분, 조금만 더 기다리십시오.', 'Compatriots in the south, wait just a little longer.'),
          KN('일없습니다. 다 일없습니다.', 'It is nothing. It is all nothing.'), 'The radio hisses. Between two stations, someone is humming a lullaby.'] },
      { id: 'N1139', name: 'A Civil Defence Volunteer', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#c8a830', '#a88820', '#e0c0a0', '#c8c8c8'], acc: 'flag' }), behavior: 'static', at: [24, 15], solid: true,
        lines: [KS('매달 십오 일에 훈련해. 아무도 안 내려와.', 'There’s a drill on the fifteenth of every month. Nobody ever comes down.'),
          KS('나는 내려와. 1951년에 기차를 놓쳤거든. 그 뒤로는 하나도 안 놓쳐.', 'I always come down. I missed a train in 1951. I haven’t missed a thing since.'),
          KS('저 뒤 벽은 북쪽에서 판 굴이래. 훈련을 잘 하면 보여.', 'That wall at the back, they say it’s a tunnel dug from the north. Do the drill properly and you’ll see.')] },
      { id: 'N1140', name: 'A Child From the 1989 Drill', count: 4, look: H({ t: 'kid', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e0c8b0', '#1a1a1a'], alpha: 0.5, eyes: 'closed', h: 16 }), behavior: 'statue', solid: false,
        lines: ['A child in a 1989 school uniform, hands over its ears, waiting for the all-clear.', KS('선생님이 두 번 셌어. 한 명이 모자랐대.', 'The teacher counted us twice. One of us was missing, she said.')] }],
    info: { summary: 'The civil defence shelter under the car park: benches in rows, drill posters, water from 1989, a radio caught between two countries.',
      rules: ['Answer the drill at the loudspeaker as the posters say: go down; water, a torch, one photo; do not wait. A tunnel opens at the back, dug from the north: it leads to the Border.',
        'Secret: with the Sensor Light (E202) equipped, a classroom door appears in the darkest corner: the School of 1989.'],
      lore: 'Drills on the fifteenth of every month, and a country that rehearses its separations.' } });

  /* ---------------------------------------------------------------
   *  W218 — The Floor Called F (P3, the meta-puzzle's reward)
   *  Puzzle: knock three times at 404 (knock). Grandmother switches off the light.
   *  Secret: her garden gate, for whoever knows her name as a girl (W194).
   * --------------------------------------------------------------- */
  var F4 = [[6, '401', 'Door 401. A pair of men’s shoes, polished, side by side, facing the lift. They have been waiting since 1951.'],
    [14, '402', 'Door 402. A child’s bicycle with flat tyres, and a bell that still rings.'], [22, '403', 'Door 403. A white chrysanthemum on the mat, and nothing else.'],
    [40, '405', 'Door 405. A school bag whose name tag has been rubbed out, very gently.'], [46, '406', 'Door 406. A cardboard box: “for later”. It is light. It is full.']];
  S({ id: 'W218', name: 'The Floor Called F', depth: 3, tier: 'hard', back: 'W202', backType: 'elevator', backLook: 'elevator', backOpt: { open: true }, backLabel: 'the lift (floor F)', backAt: [2, 9],
    map: (function () { var g = K.grid(50, 16, ' '); g.rect(0, 0, 50, 12, '#'); g.rect(28, 1, 11, 7, '.'); g.set(32, 8, '.'); g.rect(1, 9, 48, 3, '.'); g.hline(1, 48, 12, 'f'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#f0f0f0', '#dcdcdc'] }, wall: { p: 'flat', c: ['#c8c8cc', '#b0b0b4'], topColor: '#d8d8dc' }, wallface: { p: 'panel', c: ['#f4f4f4', '#e0e0e0', '#c0c0c0'], skirt: '#a0a0a0' } },
    style: { tallWalls: true, renderer: 'watercolor', sky: ['#e8e8f0', '#ffffff'] }, music: 'floorf', amb: { type: 'wind', vol: 0.03 }, dark: 0.15, extra: NOGEN,
    place: F4.map(function (d) { return { id: 'door' + d[1], type: 'decor', at: [d[0], 9], look: 'door', lookOpt: { style: 'metal', c: ['#e8e8e8'], symbol: d[1] }, lines: [d[2]] }; }).concat([
      { id: 'door404', type: 'decor', at: [32, 8], look: 'door', lookOpt: { style: 'metal', c: ['#e8e0d0'], symbol: '404' }, cond: { notFlag: 'cx_404_open' },
        lines: ['Door 404. A smell of sesame oil and earth. Somebody inside is humming.', 'Under the bell, a little plastic flower. You know this door. You have never seen it.'] },
      { id: 'mums', type: 'decor', at: [30, 9], look: 'flower', lookOpt: { c: ['#ffffff'] }, solid: false, lines: ['White chrysanthemums by the door of 404, fresh, as they are every day.'] },
      { id: 'lampOn', type: 'decor', at: [29, 2], look: 'lamp', light: 3, cond: { notFlag: 'cx_grandma_light' }, lines: ['Her reading lamp. Its light is the colour of barley tea.'] },
      { id: 'lampOff', type: 'decor', at: [29, 2], look: 'lamp', cond: { flag: 'cx_grandma_light' }, lines: ['The lamp is off. For once, it was not you who switched it off.'] },
      { id: 'stool', type: 'decor', at: [30, 5], look: 'stool', lines: ['A low wooden stool, polished by years of sitting in gardens.'] },
      { id: 'pots', type: 'decor', at: [36, 2], look: 'pot', lines: ['Pots of chillies and a single rose, all watered.'] },
      { id: 'onggi', type: 'decor', at: [37, 6], look: 'onggi', lines: ['A kimchi jar. On its side, scratched with a nail, a girl’s name you cannot quite read.'] },
      { id: 'window', type: 'decor', at: [34, 1], look: 'window', light: 1.5, lines: ['Her window looks out onto a garden that cannot be here, four floors that do not exist above the ground.'] },
      { id: 'gate', type: 'door', to: 'W194', at: [38, 4], look: 'gate', lookOpt: { c: ['#8a7a5a'] }, cond: { all: [{ flag: 'cx_404_open' }, { secret: 'statue_truth' }] }, label: 'a little wooden garden gate, inside a flat', unreachOk: 'inside flat 404, once it has been knocked open' },
      SOUL([EN('Four sounds like death. So the lift says F, and the floor waits, and everyone who is gone lives here, quite comfortably.')]),
      SOUL([KS('할머니 이름은 정원에 있어. 어릴 때 이름.', 'Grandma’s name is in the garden. Her name from when she was little.')])]),
    decor: [{ look: 'flower', n: 5, opt: { c: ['#ffffff'] }, solid: false, lines: ['A white chrysanthemum, laid on a doormat like a letter.'] }],
    mech: [{ type: 'knock', mark: 'door404', n: 3, within: 2.5, firstLine: 'A soft knock. Inside, the humming stops for a moment.', done: { flag: 'cx_404_open' }, reward: [{ set: { cx_404_open: true } }],
      winLines: ['Three soft knocks, the way she used to knock when you were ill.', 'The humming stops.', KS('누구세요? …아이고, 우리 강아지.', 'Who is it? …Oh, my little puppy.'), 'The door was never locked.'] }],
    npcs: [{ id: 'N1141', name: 'A Mourner in White', look: H({ t: 'adult', hairStyle: 'bun', body: 'robe', c: ['#f4f4f0', '#dcdcd8', '#e0c8b0', '#1a1a1a'], eyes: 'down' }), behavior: 'statue', at: [18, 10], solid: true,
        lines: [KS('사 층은 없어요. 그래서 다들 여기 와요.', 'There is no fourth floor. That’s why everyone comes here.'), 'She holds a white chrysanthemum the way you would hold a hand.',
          KS('여기서는 아무도 안 늦어요. 다들 제시간이에요.', 'Nobody is late here. Everyone is on time.')] },
      { id: 'N1142', name: 'Grandmother', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#d8d0c0', '#b8b0a0', '#e8d0b8', '#e0e0e0'], alpha: 0.65, mouth: 'smile' }), behavior: 'static', at: [33, 4], solid: true,
        lines: [SEQ({ notFlag: 'cx_grandma_light' }, [KS('아이고, 우리 강아지. 아직도 불 켜 놓고 자?', 'Oh, my little puppy. Still sleeping with the light on?'), 'She reaches for the lamp the way she always did, without looking.',
            KS('할미가 꺼 줄게. 자.', 'Grandma will turn it off for you. Sleep.'), 'Click.'], [{ set: { cx_grandma_light: true } }, { sfx: 'switch' }, { secret: 'cx_grandma_light' }]),
          IF({ flag: 'cx_grandma_light' }, KS('엄마 미워하지 마. 엄마도 혼자 컸어.', 'Don’t be angry with your mum. She grew up on her own too.')),
          IF({ flag: 'cx_grandma_light' }, KS('열쇠는 목에. 국은 식기 전에. 불은 할미가.', 'Key round your neck. Soup before it goes cold. The light, leave that to Grandma.')),
          IF({ flag: 'cx_grandma_light' }, KS('할미 이름? 어릴 때 이름은 정원에 두고 왔어.', 'Grandma’s name? I left the name I had as a girl in the garden.')),
          IF({ flag: 'cx_grandma_light' }, 'In the dark she is easier to see. She sits on her little stool, as if nothing had happened.')] }],
    info: { summary: 'The fourth floor that the lift skips: a white corridor of chrysanthemums, slippers and doors 401 to 406, where the absent live.',
      rules: ['Reached from the lift once the four sleepers (1201, 1202, 1205 and the night guard) are all asleep.',
        'Knock three times quickly on door 404: it opens. Inside, her grandmother switches off the lamp for her.',
        'Secret: if you already know the true name of the girl from the statue, a garden gate appears inside 404: it leads to Ok-sun’s Garden, 1952.'],
      lore: 'Ok-sun used to switch off the light during Mi-ran’s night shifts. Since she died, nobody does, and the girl sleeps with the light on.' } });

  /* ---------------------------------------------------------------
   *  W219 — The Lift Shaft (P3)
   *  Puzzle: move only on the beat of the passing lift (rhythmWalk) -> a ledge door (W142).
   *  Secret: in the final part of the dream, the pit has no bottom (fall to W127).
   * --------------------------------------------------------------- */
  S({ id: 'W219', name: 'The Lift Shaft', depth: 3, tier: 'hard', back: 'W205', backLook: 'ladder', backLabel: 'the ladder back up to the machine room', backAt: [7, 1],
    map: (function () { var g = K.grid(19, 44, ' '); g.box(0, 0, 15, 44, '#', '.'); g.rect(1, 40, 13, 3, '_'); g.box(14, 19, 5, 5, '#', '.'); g.set(14, 21, '.'); return g.rows(); })(),
    look: { floor: { p: 'grid', c: ['#2a2a30', '#4a4a54'] }, wall: { p: 'concrete', c: ['#3a3a40', '#2a2a30', '#1a1a20'] } },
    style: { tallWalls: true }, music: 'liftshaft', amb: { type: 'heartbeat', vol: 0.05 }, dark: 0.85, extra: NOGEN,
    fall: { to: 'W127', cond: { phase: 'final' } },
    doors: [{ to: 'W202', at: [7, 38], look: 'hatch', label: 'up through the hatch, into the lift' },
      { to: 'W142', at: [17, 21], look: 'door', opt: { style: 'metal', c: ['#5a5a60'] }, cond: { flag: 'cx_ledge' }, label: 'a landing door between two floors, with no number' }],
    place: [{ id: 'cable1', type: 'decor', at: [3, 10], look: 'wire', lines: ['The lift cables, humming. They have pulled the same people up and down for forty years.'] },
      { id: 'cable2', type: 'decor', at: [11, 10], look: 'wire', lines: ['A cable, warm to the touch, like a pulse.'] },
      { id: 'cable3', type: 'decor', at: [3, 27], look: 'wire', lines: ['A cable. Someone has tied a red ribbon round it, very high up.'] },
      { id: 'weight', type: 'decor', at: [11, 30], look: 'crate', lookOpt: { c: ['#4a4a50'] }, lines: ['The counterweight, resting. It weighs exactly as much as a full lift of tired people.'] },
      { id: 'mlog', type: 'decor', at: [13, 5], look: 'clipboard', lines: ['A maintenance log on the wall. Every line, for forty years, says: “4F. No fault found.”'] },
      { id: 'pitedge', type: 'decor', at: [10, 39], look: 'glint', solid: false, lines: ['The bottom of the shaft, black. A cold draught comes up from much further down than B2.'] },
      SOUL([EN('When the dream is nearly over, the bottom of the shaft stops being a bottom.')]),
      SOUL([KS('엘리베이터에 갇혔을 때, 비상벨 세 번 눌렀어. 아무도 안 왔어.', 'When I got stuck in the lift, I rang the alarm three times. Nobody came.')])],
    mech: [{ type: 'rhythmWalk', zone: [15, 20, 17, 22], start: [7, 3], period: 1.6, window: 0.55, lineY: 37, done: { flag: 'cx_ledge' }, reward: [{ set: { cx_ledge: true } }],
      failText: 'The lift rushes past in the silence. The draught carries you back up to the top.',
      winLines: ['You reach the ledge between two floors. Above and below, the lift goes on beating, without you.', 'In the wall, a landing door with no number has opened a crack.'] }],
    npcs: [{ id: 'N1143', name: 'A Repairman Who Never Came', look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#3a5a8a', '#2a4a7a', '#e0c0a0', '#e8d040'], acc: 'clipboard' }), behavior: 'static', at: [16, 22], solid: true,
        lines: [KS('수리 기사 왔습니다. 1997년에 신고하신 거요.', 'Repairman. About the call you made in 1997.'), KS('엘리베이터가 사 층에서 자꾸 선대요. 사 층이 없는데.', 'They said the lift kept stopping at four. There is no four.'),
          KS('여기서 기다리면 다 지나가요. 층도, 사람도.', 'If you wait here, everything goes past. Floors, people.')] },
      { id: 'N1144', name: 'The Lift Voice, Far Above', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 14,
        ambientLines: [KS('사 층을 지나갑니다.', 'Passing the fourth floor.'), KS('문이 열립니다.', 'The doors are opening.'), KS('…문이 열립니다…', '…the doors are opening…'),
          'Far above, a lift passes, and its light falls down the shaft for one heartbeat.'] },
      { id: 'N1145', name: 'A Cable Moth', count: 3, look: { t: 'moth', c: ['#c8c0a0'], h: 7, glow: '#c8c0a0', shadow: false }, behavior: 'fly', radius: 5, speed: 0.8, solid: false,
        lines: ['A moth living on the warmth of the cables.'] }],
    info: { summary: 'The dark shaft under the machine room: cables, a counterweight, and the lift passing like a heartbeat.',
      rules: ['Above the bottom landing, move only while the beat sounds (the lift passing); moving in the silence sends you back to the top. Reach the ledge on the right, halfway down: a numberless door opens onto Floor 13A.',
        'The hatch at the bottom climbs back into the lift.',
        'Secret: in the final part of the dream, keep pushing into the pit at the bottom: you fall all the way to Corridor 0.'],
      lore: 'The space between floors, where the faults nobody repairs are kept.' } });

  /* ---------------------------------------------------------------
   *  W220 — The Show Flat (P3)
   *  Puzzle: take the full tour, four laps of the kitchen island (laps) -> W172.
   *  Secret: when the window at home is open, the painted view flaps (W153).
   * --------------------------------------------------------------- */
  S({ id: 'W220', name: 'The Show Flat', depth: 3, tier: 'hard', back: 'W214', backLook: 'ladder', backLabel: 'the ladder truck, back down to the old flat', backAt: [14, 20],
    map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.'); g.rect(13, 9, 4, 3, 'u'); g.vline(21, 1, 7, '#'); g.hline(21, 28, 7, '#'); g.set(21, 4, '.'); g.rect(1, 1, 8, 3, ','); return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#f4f0ea', '#dcd6cc'] }, floor2: { p: 'wood', c: ['#e0c8a0', '#c8b088'] }, wall: { p: 'flat', c: ['#e8e4dc', '#d0ccc4'], topColor: '#f0ece4' },
      wallface: { p: 'panel', c: ['#ffffff', '#ecece8', '#d0d0cc'], skirt: '#c0bcb4' }, counter: { p: 'marble', c: ['#ffffff', '#e0e0e0'] } },
    style: { tallWalls: true, filter: 'saturate(1.25) brightness(1.06)' }, music: 'showflat', amb: { type: 'hum', vol: 0.03 }, dark: 0, extra: NOGEN,
    doors: [{ to: 'W201', at: [27, 19], look: 'mirror', cond: { equipped: 'E203' }, label: 'the tall mirror in the hall, reflecting a lobby',
        locked: 'A tall mirror, reflecting a lobby that isn’t behind you. You cannot walk into a mirror without a mirror of your own.' },
      { to: 'W172', at: [28, 12], look: 'door', opt: { style: 'wood', c: ['#f0ece4'], symbol: '' }, cond: { tempGte: { cx_laps: 15 } }, label: 'the door at the back: “Your future home”',
        locked: 'A door at the back, marked “Your future home”. The sales representative’s smile says: not before the full tour.' },
      { to: 'W153', at: [2, 1], look: 'door', opt: { style: 'shoji', c: ['#f0f0e8'] }, cond: { roomWindow: true }, label: 'behind the painted view, a draught, and a door' }],
    place: [{ id: 'view', type: 'decor', at: [4, 1], look: 'poster', lines: ['The view from the balcony is a printed poster of a river at sunset. It flaps a little, as if there were a window behind it.'] },
      { id: 'fruit', type: 'decor', at: [14, 8], look: 'fruit', lines: ['A bowl of plastic fruit on the island. A tag on the apple: “sample”.'] },
      { id: 'sofa', type: 'decor', at: [5, 15], look: 'sofa', lookOpt: { c: ['#f8f8f8'] }, lines: ['A white sofa nobody has ever sat on. A card on it: “please do not sit”.'] },
      { id: 'tv', type: 'decor', at: [5, 18], look: 'tv', lines: ['An enormous television, switched off. A sticker on its screen shows a smiling family that came with it.'] },
      { id: 'dining', type: 'decor', at: [22, 15], look: 'table', lookOpt: { cloth: '#ffffff' }, lines: ['A dining table laid for three with plastic fish. Nobody’s chair is pulled out.'] },
      { id: 'kdesk', type: 'decor', at: [25, 2], look: 'desk', lines: ['A child’s desk with a certificate already framed: “Top of the class”. The name is left blank.'] },
      { id: 'kbed', type: 'decor', at: [23, 5], look: 'bed', lookOpt: { c: ['#ffffff', '#c8d8f0'] }, lines: ['A child’s bed, made so tight nobody could get into it.'] },
      { id: 'brochure', type: 'decor', at: [10, 19], look: 'book', lines: ['A brochure: “A NEW LIFE, FULLY FURNISHED. Children’s room south-facing. Study room with no window, for concentration.”'] },
      SOUL([EN('A show flat is a home with the people taken out, so that you can imagine yourself in it. Some people never stop imagining.')]),
      SOUL([KS('계약하시면 행복은 별도예요.', 'If you sign, happiness is sold separately.')]),
      SOUL([EN('If the window at home is open, the painted view here flaps in the draught. Behind it, the house keeps unfolding.')])],
    mech: [{ type: 'laps', center: [15, 10.5], key: 'cx_laps' }],
    npcs: [{ id: 'N1146', name: 'The Sales Representative', look: { t: 'mannequin', head: 'round', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#f0e0d0', '#1a1a1a'], eyes: 'dots', mouth: 'smile', h: 24 },
        behavior: 'patrol', path: [[12, 8], [17, 8], [17, 12], [12, 12]], speed: 0.5, solid: false,
        lines: [{ t: function () { var n = YN.save.temp('cx_laps') || 0; return n >= 15 ? KS('다 보셨네요. 뒷문 열어 드릴게요.', 'You’ve seen everything. I’ll open the back door for you.') : KS('천천히 둘러보세요. 네 바퀴 도시면 다 보여요.', 'Take your time. Go round four times and you’ll have seen it all.'); } },
          'She traces four slow circles in the air around the kitchen island, smiling the whole time.',
          KS('여기가 꿈의 집이에요. 아이 방은 남향이고요.', 'This is the home of your dreams. The child’s room faces south.'),
          KS('여기 사시면 행복하실 거예요. 계약서에 그렇게 써 있어요.', 'You’ll be happy living here. It says so in the contract.')] },
      { id: 'N1147', name: 'The Model Father', look: { t: 'mannequin', head: 'round', body: 'suit', c: ['#3a4a6a', '#2a3a5a', '#e8d8c8', '#e8d8c8'], eyes: 'none', mouth: 'none', h: 25 }, behavior: 'statue', at: [22, 14], solid: true,
        lines: ['A mannequin father at the dining table, smiling at a plate of plastic fish. He has a phone in his hand. It is the only real thing about him.'] },
      { id: 'N1148', name: 'The Model Mother', look: { t: 'mannequin', head: 'round', body: 'dress', c: ['#c8a0a8', '#a88088', '#e8d8c8', '#e8d8c8'], eyes: 'none', mouth: 'none', h: 24 }, behavior: 'statue', at: [20, 16], solid: true,
        lines: ['A mannequin mother, one hand resting on nothing, where a child’s head should be. Neither of them is looking at the other.'] },
      { id: 'N1149', name: 'The Model Child', look: { t: 'mannequin', head: 'round', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e8d8c8', '#e8d8c8'], eyes: 'none', mouth: 'none', h: 17 }, behavior: 'statue', at: [26, 3], solid: true,
        lines: ['A mannequin child at a desk, pencil raised, forever about to begin. The chair has no dent in it.'] }],
    info: { summary: 'The show flat of a brand-new apartment: white marble, plastic fruit, a mannequin family, a balcony view printed on paper.',
      rules: ['Take the full tour: walk round the kitchen island four times (the sales representative circles it as a hint). The door at the back, “Your future home”, then opens onto the Bedroom of 2044.',
        'With the Shoe-Cupboard Mirror (E203) equipped, the tall mirror leads back into the lobby of Building 107.',
        'Secret: when the bedroom window is open (in the waking room), the printed view flaps; behind it, a door to the Unfolding House.'],
      lore: 'The perfect home that is sold as a dream, and the future it rehearses.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
