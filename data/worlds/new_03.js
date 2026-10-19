/* =========================================================================
 *  NEW WORLDS 03 — W241 to W260: SCHOOL AFTER HOURS
 *  Her school at night, in a dream.
 *  Depth 2 (ground floor): the corridor after the bell (hub), the music room,
 *  the gym, the nurse, the trophy corridor, a classroom, the shoe lockers,
 *  the ten o'clock bus, the principal's microphone, the lost property box.
 *  Depth 3 (deeper, stranger): lane eight, the art room, the chained roof
 *  door, the stairwell, inside the piano, the last stop, parents' evening,
 *  the class photograph, sports day at night, the assembly for one.
 *  Through-line: five rooms (music, gym, nurse, trophies, class) each tick one
 *  line of the register; then she answers it at the principal's microphone and
 *  the assembly hall opens. Recurring: the night caretaker, the red balloon,
 *  the ten o'clock bus, the missing piano key, the unsigned permission slip.
 *  Parents: W004 (Empty School), W016 (The Empty Pool), W061 (The Evening
 *  Hagwon), W027 (The Vigil Hospital). NPC ids N1300-N1399, effects E213-E218.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a soul: a fragment of memory, said once, then undone */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* adds a door to an already defined world (placed at random, then made reachable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }

  /* shared looks */
  var NIGHTSCHOOL = Object.assign({}, K.LOOK.school, {
    floor: { p: 'wood', c: ['#6a5238', '#58442e', '#7a6044'] }, floor2: { p: 'tile', c: ['#8a8c94', '#6a6c74'] },
    wall: { p: 'flat', c: ['#2a2420', '#1e1a16'], topColor: '#26201c' },
    wallface: { p: 'panel', c: ['#8a8470', '#6e6858', '#4a4638'], skirt: '#3a2e22' }
  });
  var LOCKER = { look: 'locker', opt: { c: ['#4a6a8a'] } };
  var CARETAKER = H({ t: 'old', body: 'coat', c: ['#3a4a3a', '#2a3a2a', '#e0c8a8', '#c8c8c8'], hat: 'cap', hatColor: '#2a3a2a', acc: 'lantern' });
  var BALLOON = { t: 'jelly', c: ['#e04050'], h: 11 };
  var TICK = 'Somewhere, in the principal’s office, one line of the register is ticked.';
  var META = ['sah_music', 'sah_gym', 'sah_nurse', 'sah_trophy', 'sah_class'];

  /* ---------------------------------------------------------------
   *  EFFECTS E213–E218
   * --------------------------------------------------------------- */
  [
    { id: 'E213', name: 'The Missing Key', fam: 'music', world: 'W250', icon: { glyph: '▯', c: '#f4f0e6' }, action: 'ring',
      desc: 'A single white piano key. It was always the one between mi and sol.',
      use: 'Press it (F): one clear note, and whoever is near turns towards you. Somewhere, a gap fits it.',
      get: 'In the Lost Property Box, pick up the lost things in the order they hum.' },
    { id: 'E214', name: 'PE Whistle', fam: 'school', world: 'W243', icon: { glyph: 'ʘ', c: '#c0c8d0' }, action: 'whistle',
      desc: 'Hung on the wall bars by somebody who stopped picking teams.',
      use: 'Blow it (F): a sharp note that carries. Some doors only open on the whistle.',
      get: 'In the Gym of Fallen Balloons, catch the five balloons that still float, without running.' },
    { id: 'E215', name: 'Sick Note', fam: 'school', world: 'W244', icon: { glyph: '✚', c: '#e05050' }, action: 'hide', stealth: 0.3,
      desc: '“Please excuse her. She is tired.” In the nurse’s neat handwriting.',
      use: 'Hide (F); you are noticed less. Monitors let you through.',
      get: 'In the School Nurse’s Office, lie still on the paper bed until nobody asks anything.' },
    { id: 'E216', name: 'Bus Pass', fam: 'transport', world: 'W247', icon: { glyph: '▬', c: '#40a0e0' }, action: 'none', caps: ['ticket'],
      desc: 'A pass for the ten o’clock bus. The photo on it is of someone looking away.',
      use: 'Gets you through turnstiles and onto buses, all the way past the end of the line.',
      get: 'At the Shoe Lockers, match every pair of shoes: it is in the last cubby.' },
    { id: 'E217', name: 'The Principal’s Microphone', fam: 'sound', world: 'W249', icon: { glyph: '⊙', c: '#d0d0d8' }, action: 'shout',
      desc: 'It has read out every name in the school. Now it has read out yours too.',
      use: 'Speak through it (F): your voice carries through the walls, and whoever listens comes.',
      get: 'In the principal’s office, once the five rooms have been answered, answer the register.' },
    { id: 'E218', name: 'Unsigned Permission Slip', fam: 'school', world: 'W257', icon: { glyph: '◫', c: '#f0ecd8' }, action: 'none', caps: ['flat'],
      desc: 'For the school trip to the sea. Nobody signed it. Nothing can stop it now.',
      use: 'Slip through thin gaps and partitions, like a sheet of paper under a door.',
      get: 'At Parents’ Evening, answer the teacher’s three questions for the empty chair.' }
  ].forEach(function (e) { if (YN.effectById(e.id)) return; YN.data.effects.push(Object.assign({ ground: false, core: false }, e)); });
  YN._effIndex = null;

  /* ===============================================================
   *  DEPTH 2 — THE GROUND FLOOR
   * =============================================================== */

  /* W241 — The Corridor After the Bell (hub) */
  S({ id: 'W241', name: 'The Corridor After the Bell', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W004', backLook: 'door', backOpt: { style: 'wood', c: ['#6a4a2a'] }, backLabel: 'back to the empty school', backAt: [1, 5],
    map: (function () {
      var g = K.grid(66, 11, ' '); g.box(0, 0, 66, 11, '#', '.'); g.hline(1, 64, 5, ',');
      g.hline(3, 62, 1, '^'); g.hline(3, 62, 9, '^');
      [8, 18, 28, 32, 40, 44, 52, 58].forEach(function (x) { g.set(x, 1, '.'); });
      [12, 20, 24, 36, 56].forEach(function (x) { g.set(x, 9, '.'); });
      return g.rows();
    })(),
    look: NIGHTSCHOOL, tall: { '^': LOCKER }, style: { tallWalls: true }, music: 'afterbell', amb: { type: 'hum', vol: 0.05 }, dark: 0.45,
    doors: [
      { to: 'W242', at: [8, 1], look: 'door', opt: { style: 'wood', c: ['#7a5a3a'] }, label: 'the music room' },
      { to: 'W246', at: [18, 1], look: 'door', opt: { style: 'wood', c: ['#6a5a4a'] }, label: 'a classroom with its light still on' },
      { to: 'W244', at: [28, 1], look: 'door', opt: { style: 'wood', c: ['#e8e4dc'] }, label: 'the nurse’s office' },
      { to: 'W245', at: [40, 1], look: 'door', opt: { style: 'glass', c: ['#c8b880'] }, label: 'the corridor of trophy cabinets' },
      { to: 'W243', at: [52, 1], look: 'door', opt: { style: 'metal', c: ['#4a5a6a'] }, label: 'the gym' },
      { to: 'W247', at: [12, 9], look: 'door', opt: { style: 'glass', c: ['#8aa0b0'] }, label: 'the entrance hall' },
      { to: 'W254', type: 'stairs', at: [36, 9], look: 'stairs', label: 'the stairs up, out of bounds after hours' },
      { to: 'W250', at: [24, 9], look: 'locker', opt: { c: ['#4a6a8a'] }, cond: { flag: 'sah_locker31' }, label: 'locker 31, standing open' },
      { to: 'W257', at: [64, 5], look: 'door', opt: { style: 'wood', c: ['#e8c870'] }, cond: { dark: true }, label: 'the one lit classroom, at the dark end' }],
    decor: [
      { id: 'locker31', look: 'locker', opt: { c: ['#4a6a8a'] }, at: [24, 9], cond: { notFlag: 'sah_locker31' }, lines: ['Locker 31. No name on it. It is warmer than the others.'] },
      { look: 'wallclock', at: [32, 1], lines: ['The corridor clock: 16:31. One minute after the last bell.', 'It has been one minute after the bell for a very long time.'] },
      { look: 'poster', at: [44, 1], lines: ['A poster for the school play. Every part has a name beside it.', 'Beside “Tree, back row”, someone has written: “to be decided”.'] },
      { look: 'loudspeaker', at: [58, 1], lines: [EN('…would the following pupils please come to the office…'), 'A list of names, too far away to make out. It stops just before yours.'] },
      { look: 'trash', at: [56, 9], lines: ['A bin. In it, a party invitation, still sealed.', 'The envelope says “To:”, and then nothing.'] },
      { look: 'window', at: [20, 9], lines: ['A window onto the playground. The swings are moving. There is no wind.'] },
      { look: 'bench', at: [46, 8], lines: ['A bench for waiting outside a classroom.', 'The paint is worn in one place only: right at the very end.'] }],
    signs: [{ at: [62, 5], lines: [EN('When it is dark at home, one room here keeps its light on.')] }],
    npcs: [
      { id: 'N1300', name: 'The Night Caretaker', look: CARETAKER, behavior: 'patrol', path: [[4, 3], [61, 3], [61, 7], [4, 7]], speed: 0.5, solid: true,
        lines: [EN('School finished hours ago, love. Nobody come for you?'),
          EN('I’ve a key for every door in this place. Except the roof. That one has a chain.'),
          EN('Lost property lives in locker thirty-one now. It got too big for the box.'),
          EN('Knock on it. Three times, quick. The things in there are shy.'),
          EN('I never lock this corridor. Somebody might still be in it.')] },
      { id: 'N1301', name: 'A Pupil Late for Nothing', count: 3, look: H({ t: 'kid', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e0c8b0', '#1a1a1a'], eyes: 'none', alpha: 0.45 }),
        behavior: 'wander', radius: 10, speed: 2.2, solid: false,
        lines: ['A pupil-shaped blur runs past, laughing with someone who isn’t there.', { seq: [EN('Wait for me!'), 'Nobody waits. It runs on anyway.'] }] }],
    mech: [{ type: 'knock', mark: 'locker31', n: 3, within: 2.4, done: { flag: 'sah_locker31' },
        firstLine: 'Something inside the locker knocks back. Once. Politely.',
        winLines: ['On the third knock, the locker swings open by itself.', 'It goes back much further than a locker should. It smells of other people’s jumpers.'],
        reward: [{ set: { sah_locker31: true } }] },
      { type: 'bellRing', every: 75, under: 8 }],
    place: [SOUL([EN('Everyone has somewhere to be at half past four. She had the corridor.')]),
      SOUL([KS('학교 끝나면 바로 집에 와. 문 꼭 잠그고.', 'Come straight home after school. Make sure you lock the door.')])],
    info: { summary: 'The school’s main corridor an hour after the bell: longer than in the daytime, lockers on both sides.',
      rules: ['The hub of the school after hours: doors to the music room, a classroom, the nurse, the trophy corridor, the gym, the entrance hall, and the stairs up.',
        'Locker 31 knocks back: knock on it three times quickly and it opens onto the Lost Property Box (W250).',
        'With the bedroom light off (dark), a lit classroom appears at the far right end: Parents’ Evening (W257).',
        'The bell rings out roughly every minute and a quarter.'],
      lore: 'The hour after school, when everyone else has somewhere to go.' } });
  link('W004', { to: 'W241', look: 'door', lookOpt: { style: 'wood', c: ['#5a4a3a'] }, label: 'a corridor that carries on after the bell' });

  /* W242 — The Music Room of the Missing Key */
  S({ id: 'W242', name: 'The Music Room of the Missing Key', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'wood', c: ['#7a5a3a'] }, backLabel: 'back to the corridor', backAt: [15, 18],
    map: (function () {
      var g = K.grid(30, 20, ' '); g.box(0, 0, 30, 20, '#', '.'); g.rect(1, 1, 28, 5, ',');
      [9, 12, 15].forEach(function (y) { for (var x = 5; x <= 24; x += 3) g.set(x, y, '}'); });
      return g.rows();
    })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor2: { p: 'wood', c: ['#8a6a48', '#7a5a3a', '#9a7a58'] } }), tall: { '}': { look: 'chair' } },
    style: { tallWalls: true }, music: null, amb: { type: 'musicbox', vol: 0.03 }, dark: 0.4,
    doors: [{ to: 'W255', at: [14, 5], look: 'crack', opt: { c: ['rgba(0,0,0,0.55)'] }, cond: { equipped: 'E213' }, label: 'a crack exactly the width of a piano key' }],
    decor: [
      { id: 'piano', look: 'piano', at: [14, 3], lines: ['The school piano. One white key is missing, between mi and sol.', 'Where it should be, you can see down into the piano, and further.'] },
      { look: 'blackboard', opt: { text: 'SPRING CONCERT' }, at: [5, 1], lines: ['On the board: SPRING CONCERT. Underneath, the class song, in note names.'] },
      { look: 'musicbox', at: [27, 2], lines: ['A music box on the windowsill. Wound up, it plays the class song.', 'Where the missing key should sound, it waits, then carries on.'] },
      { look: 'portrait', n: 3, lines: ['A composer in a wig. Someone has drawn him a speech bubble: “LOUDER”.', 'A composer, frowning. He has been listening to the back row for a hundred years.'] },
      { look: 'book', n: 2, lines: ['A songbook. On the last page, in pencil: “sing with your mouth, not only your eyes”.'] }],
    signs: [{ at: [11, 4], lines: ['A soul with a baton taps the air, beat by beat.', EN('mi, mi, —, sol, sol, —, mi, re.'), EN('Where there is a dash, the piano has nothing. So you play nothing.')] }],
    npcs: [
      { id: 'N1305', name: 'The Music Teacher', at: [18, 3], look: H({ t: 'adult', hairStyle: 'bun', hair: '#5a4a3a', body: 'sweater', c: ['#8a5a6a', '#6a4a5a', '#e8d0b8', '#3a2a2a'], acc: 'baton', eyes: 'closed' }),
        behavior: 'static', solid: true,
        lines: [EN('One, two, three, four. From the top. Everybody sings. Everybody.'),
          { seq: [EN('Someone in the back row only moves her lips. I can always tell.'), 'She never says anything. She smiles at the back row anyway.'] },
          EN('The piano lost a key in spring. We sing around the hole. Children are good at that.')] },
      { id: 'N1306', name: 'A Recorder Pupil', count: 3, look: H({ t: 'kid', body: 'uniform', c: ['#5a6a8a', '#4a5a7a', '#e8c8b0', '#2a1a10'], eyes: 'closed', alpha: 0.6 }),
        behavior: 'static', solid: true,
        lines: ['A pupil playing the recorder. One note only, always the same, very proudly.', 'A pupil holding a recorder upside down, hoping nobody will ask her to play.'] }],
    mech: [{ type: 'melodyLock', mark: 'piano', tune: '223321', dist: 4, done: { flag: 'sah_music' }, reward: [{ set: { sah_music: true } }],
      winLines: ['You play the class song with its holes in it.', 'Where the missing key should be, you leave the silence. It fits. It always did.', TICK] }],
    place: [SOUL([EN('She knew every word. She sang them at home, to the fridge, while the rice cooked.')]),
      SOUL([KS('다음 발표회엔 엄마 꼭 갈게.', 'Mum will come to the next concert, I promise.')])],
    info: { summary: 'The music room after hours: rows of small chairs, and a silent piano with one white key missing.',
      rules: ['With the Melody, play the class song the soul taps out by the piano, leaving out the notes the piano doesn’t have: mi, mi, sol, sol, mi, re.',
        'This ticks one of the five lines of the register (see the Principal’s Microphone, W249).',
        'With The Missing Key (E213, from the Lost Property Box) equipped, a crack opens in front of the piano: Inside the Piano (W255).'],
      lore: 'The class song she knew by heart and never sang aloud.' } });

  /* W243 — The Gym of Fallen Balloons */
  var BALLOONCOLS = ['#e04050', '#4a90e0', '#e8c040', '#e070c0', '#50c070'];
  S({ id: 'W243', name: 'The Gym of Fallen Balloons', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'metal', c: ['#4a5a6a'] }, backLabel: 'back to the corridor', backAt: [22, 26],
    map: (function () {
      var g = K.grid(44, 28, ' '); g.box(0, 0, 44, 28, '#', '.'); g.rect(1, 1, 35, 4, ',');
      g.box(36, 0, 8, 5, '#', '.'); g.set(36, 2, '?'); g.rect(3, 19, 6, 5, '[');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#b08850', '#9a7440', '#c09860'] }, floor2: { p: 'plank', c: ['#5a3a2a', '#4a2a1a'] }, mat: { p: 'mat', c: ['#3a5a9a', '#2a4a8a'] },
      wall: { p: 'flat', c: ['#2a2a30', '#1e1e24'], topColor: '#24242a' }, wallface: { p: 'panel', c: ['#8a9098', '#6a7078', '#4a5058'], skirt: '#2a3038' } },
    style: { tallWalls: true }, music: 'fallenballoons', amb: { type: 'hum', vol: 0.04 }, dark: 0.4,
    doors: [
      { to: 'W251', at: [1, 14], look: 'door', opt: { style: 'metal', c: ['#4a7898'] }, label: 'the changing rooms, and a smell of chlorine' },
      { to: 'W259', at: [42, 14], look: 'door', opt: { style: 'metal', c: ['#c03030'] }, cond: { equipped: 'E214' }, label: 'the fire exit, onto the field',
        locked: 'A fire exit. A sticker on the bar: OPENS ON THE WHISTLE ONLY.' }],
    decor: [
      { look: 'balloons', n: 4, lines: ['Balloons lying on the floor, gone soft. They have been falling all evening, very slowly.', 'A bunch of balloons tied to a chair. It is the only chair nobody sat on.'] },
      { look: 'banner', at: [18, 1], lines: ['A banner: END OF YEAR PARTY. One letter has come unstuck and hangs by a corner.'] },
      { look: 'ladder', n: 2, lines: ['The wall bars. Somebody waited against them every Tuesday while the teams were picked.'] },
      { look: 'ball', n: 2, lines: ['A ball that rolled under the bench and was never fetched.'] },
      { look: 'curtain', at: [34, 3], lines: ['The stage curtain, drawn. Behind it, the wall sounds hollow.'] },
      { look: 'cake', at: [40, 2], lines: ['A party cake with one slice cut. The slice is still on the knife.'] }],
    signs: [{ at: [38, 2], lines: ['A soul in a paper party hat, sitting behind the curtain.', EN('Best place at a party. You hear everything, and nobody asks you to dance.')] }],
    npcs: BALLOONCOLS.map(function (c, i) {
      return { id: 'N131' + i, name: 'A Balloon That Still Floats', at: [[10, 10], [30, 10], [14, 20], [32, 20], [22, 15]][i], tag: 'sahballoon',
        look: { t: 'jelly', c: [c], h: 12 }, behavior: 'wander', radius: 4, speed: 0.7, solid: false,
        lines: ['A balloon that still floats a little above the floor. It drifts away from running feet.'] };
    }).concat([
      { id: 'N1315', name: 'The Teacher Who Picks Teams', at: [22, 8], look: H({ t: 'adult', body: 'shirt', c: ['#c04040', '#a03030', '#e0c0a0', '#2a2a2a'], hat: 'cap', hatColor: '#2a2a6a' }),
        behavior: 'static', solid: true,
        lines: [EN('Two captains. Pick your teams. Quickly, now.'),
          { seq: ['He waits, whistle in his mouth.', 'The teams were picked long ago. One pupil is still standing by the wall bars.'] },
          EN('Somebody has to be picked last. It isn’t personal. It’s arithmetic.'),
          { if: { flag: 'sah_gym' }, t: 'He has hung his whistle on the wall bars. He doesn’t look at it any more.' }] },
      { id: 'N1316', name: 'A Team Captain', count: 2, look: H({ t: 'kid', body: 'shirt', c: ['#3a6aa0', '#2a5a90', '#e8c8b0', '#2a1a10'], mouth: 'grin', alpha: 0.7 }),
        behavior: 'static', solid: true, lines: [EN('I pick… him.'), EN('…and her. And him. And… that’s everyone.')] }]),
    mech: [{ type: 'catchN', tag: 'sahballoon', n: 5, noRun: true, key: 'sah_balloons', give: 'E214', reward: [{ set: { sah_gym: true } }],
      countText: 'Balloon # of %', runLine: 'The balloon shies away from running feet, like everything else in here.',
      winLines: ['The fifth balloon. You hold all five strings in one hand.', 'They tug upwards, gently, like a hand that wants to show you something.',
        'On the wall bars, the teacher’s whistle swings on its cord. Nobody will blow it now. It is yours.', TICK] }],
    place: [SOUL([EN('Last one picked is still picked. That is what she told herself, every Tuesday.')])],
    info: { summary: 'The gym after the end-of-year party: balloons fallen on the floor, a banner, a stage with its curtain drawn.',
      rules: ['Catch the five balloons that still float by walking into them; running scares them away. This gives the PE Whistle (E214) and ticks one line of the register.',
        'With the PE Whistle equipped, the fire exit opens onto Sports Day at Night (W259).',
        'Behind the stage curtain, the right-hand wall is false: with a revealing effect (the Glasses) you can walk into a little backstage nook.'],
      lore: 'Teams picked every Tuesday, and a party where the best place was behind the curtain.' } });

  /* W244 — The School Nurse’s Office */
  S({ id: 'W244', name: 'The School Nurse’s Office', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'wood', c: ['#e8e4dc'] }, backLabel: 'back to the corridor', backAt: [11, 12],
    map: (function () { var g = K.grid(22, 14, ' '); g.box(0, 0, 22, 14, '#', '.'); g.rect(1, 1, 8, 12, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.hospital, { floor: { p: 'tile', c: ['#c8d0cc', '#a8b4b0'] }, floor2: { p: 'tile', c: ['#d8e0dc', '#b8c4c0'] } }),
    style: { tallWalls: true }, music: 'nurseroom', amb: { type: 'clock', vol: 0.04 }, dark: 0.3,
    doors: [
      { to: 'W027', at: [20, 7], look: 'door', opt: { style: 'wood', c: ['#f0f0ec'] }, label: 'a door that smells of the hospital at night' },
      { to: 'W258', type: 'bed', at: [3, 10], look: 'bed', opt: { c: ['#f0f0f0', '#c8d8e0'] }, cond: { flag: 'sah_nurse' }, label: 'the bed behind the curtain' }],
    decor: [
      { id: 'restbed', look: 'bed', opt: { c: ['#f4f4f0', '#a8c8d8'] }, at: [3, 3], solid: false, lines: ['A narrow bed with a paper sheet. It crackles when you lie down.'] },
      { id: 'otherbed', look: 'bed', opt: { c: ['#f0f0f0', '#c8d8e0'] }, at: [3, 10], cond: { notFlag: 'sah_nurse' }, lines: ['The other bed, behind the curtain.', 'The sheet is tucked in very tight, as if nobody is allowed in it yet.'] },
      { look: 'curtain', at: [5, 7], lines: ['A curtain on a rail, half drawn. Behind it, the other bed.'] },
      { look: 'pills', at: [20, 2], lines: ['A medicine cabinet. Plasters, a thermometer.', 'A box labelled “letters to parents — no reply”.'] },
      { look: 'sink', at: [12, 1], lines: ['A little sink. The tap drips at the speed of a waiting-room clock.'] },
      { look: 'poster', at: [16, 1], lines: ['An eye chart. The bottom line is very small.', 'It reads: “i am fine i am fine i am fine”.'] },
      { look: 'clipboard', at: [15, 4], lines: ['A file: “Sleeps in class. Light on at night. Mother works nights.”', 'The same three lines every term, in the same neat writing.'] },
      { look: 'blanketlump', at: [7, 3], lines: ['A folded blanket. It smells of washing powder and hospital, exactly like home.'] }],
    signs: [{ at: [5, 3], lines: [EN('Lie still. Count the cracks in the ceiling. Nobody will ask.')] }],
    npcs: [
      { id: 'N1320', name: 'The School Nurse', at: [14, 6], look: H({ t: 'adult', hairStyle: 'bun', hair: '#3a2a20', body: 'uniform', c: ['#f0f0f0', '#d0d8dc', '#e8c8a8', '#2a1a10'], acc: 'clipboard' }),
        behavior: 'static', solid: true,
        lines: [EN('Lie down for a bit, sweetheart. Ten minutes. Twenty, if nobody asks.'),
          EN('Headache? Tummy? …Tired. There isn’t a box for tired. I’ll write it in the margin.'),
          EN('I wrote to your mother. Twice. She works nights, I know. Everybody works nights.'),
          { if: { flag: 'sah_nurse' }, seq: [EN('You were in here on photo day too, behind that curtain.'), EN('They took the picture without you. In here, it isn’t too late.')] }] },
      { id: 'N1321', name: 'A Pupil with a Cold Compress', at: [7, 9], look: H({ t: 'kid', body: 'uniform', c: ['#6a5a4a', '#4a3a2a', '#e8c8b0', '#1a1a1a'], eyes: 'sad', alpha: 0.7 }),
        behavior: 'static', solid: true,
        lines: ['A pupil on the edge of a chair, holding a cold compress to her arm.', 'Nobody asked what happened. She says she walked into a door. There are doors everywhere here.'] }],
    mech: [{ type: 'standStill', mark: 'restbed', secs: 20, give: 'E215', reward: [{ set: { sah_nurse: true } }], tick: 'clock_tick',
      breakLine: 'The paper sheet crackles. Lie still.',
      winLines: ['You lie still. The paper sheet stops crackling.', 'Nobody asks you anything. For twenty minutes, being tired is allowed.',
        'When you sit up, there is a note on the pillow, in the nurse’s neat writing.', TICK] }],
    place: [SOUL([EN('The nurse’s office is the only room in a school where you may close your eyes.')]),
      SOUL([KS('열 있어? 아니면 그냥 피곤한 거야? …엄마도.', 'Have you got a temperature? Or are you just tired? …Me too.')])],
    info: { summary: 'The school nurse’s little office: two narrow beds, a curtain, an eye chart, a file on the desk.',
      rules: ['Lie on the paper bed and stay completely still for twenty seconds: this gives the Sick Note (E215) and ticks one line of the register.',
        'Afterwards, the bed behind the curtain becomes a way into The Class Photograph (W258), taken the day she was lying here.',
        'A side door leads to The Vigil Hospital (W027).'],
      lore: 'The one place at school where she was allowed to be tired.' } });
  link('W027', { to: 'W244', look: 'door', lookOpt: { style: 'wood', c: ['#e8e8e0'] }, label: 'a small door marked SCHOOL NURSE' });

  /* W245 — The Trophies for Nobody */
  var TROPHY = [
    ['A cup: “Sports Day — 100 metres — First — ______”.', 'The blank has been polished until it shines.'],
    ['A plaque: “Best Attendance — ______”.', 'Somebody came every single day. Nobody wrote it down.'],
    ['A medal on a ribbon: “Spring Concert — Solo — ______”.', 'The ribbon has never been worn.'],
    ['A tall cup with no event written on it at all.', 'Only the blank, waiting. It is the biggest one in the cabinet.'],
    ['A small shield: “Kindness — ______”.', 'Under the blank, in tiny letters: “nominated by nobody, earned anyway”.'],
    ['A trophy shaped like an open hand. Its plate is not blank: there is a name.', 'It has been rubbed so often it can’t be read. It has the right number of letters.']];
  S({ id: 'W245', name: 'The Trophies for Nobody', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'glass', c: ['#c8b880'] }, backLabel: 'back to the corridor', backAt: [1, 4],
    map: (function () { var g = K.grid(60, 9, ' '); g.box(0, 0, 60, 9, '#', '.'); g.hline(1, 58, 4, ','); g.vline(42, 1, 7, '#'); g.set(42, 4, ','); return g.rows(); })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor: { p: 'tile', c: ['#9a8a6a', '#7a6a4a'] }, floor2: { p: 'carpet', c: ['#6a2a2a', '#5a2020'] } }),
    style: { tallWalls: true }, music: 'trophies', amb: { type: 'clock', vol: 0.03 }, dark: 0.4,
    doors: [
      { to: 'W249', at: [58, 4], look: 'door', opt: { style: 'wood', c: ['#5a3a2a'] }, label: 'a door with a frosted pane: PRINCIPAL' },
      { to: 'W259', at: [39, 1], look: 'vitrine', opt: { c: ['#d8b850'] }, cond: { flag: 'sah_trophy' }, label: 'the back of the last cabinet, open onto a field at night' }],
    decor: TROPHY.map(function (l, i) { return { id: 'tro' + i, look: 'pedestal', opt: { c: ['#d8b850'] }, at: [6 + i * 6, 1], lines: l }; }).concat([
      { look: 'vitrine', n: 1, at: [9, 1], lines: ['A trophy cabinet. Cups, shields, a little gold runner. Every name plate is blank.'] },
      { look: 'vitrine', n: 1, at: [21, 1], lines: ['A cabinet of medals on ribbons, hung up very neatly, like coats nobody came for.'] },
      { look: 'vitrine', n: 1, at: [33, 1], lines: ['A cabinet with one empty shelf, dusted every week.'] },
      { look: 'frame', opt: { people: 6 }, at: [10, 7], lines: ['A team photo. There is one more face in it than there are names underneath.'] },
      { look: 'frame', opt: { people: 5 }, at: [28, 7], lines: ['A choir photo. Back row, far left: a girl with her mouth closed.'] },
      { look: 'portrait', at: [48, 1], lines: ['A former principal. His smile has been touched up.'] },
      { look: 'bench', at: [52, 7], lines: ['A bench outside the principal’s office. Long enough for one.'] }]),
    place: [{ id: 'monitorline', type: 'decor', at: [42, 4], look: 'chalkmark', solid: false, block: { unless: { equipped: 'E215' } },
        lines: ['A chalk line across the gap. The hall monitor keeps her toes exactly behind it.'],
        onBump: [{ lines: [{ t: 'Note, please. Nobody past the line after the bell without a note.', lang: 'en', who: 'The Hall Monitor' }] }] },
      SOUL([EN('A trophy for nobody is still a trophy. Somebody bought it. Somebody hoped.')])],
    npcs: [
      { id: 'N1325', name: 'The Hall Monitor', at: [41, 3], look: H({ t: 'kid', hairStyle: 'braids', hair: '#3a2a1a', body: 'uniform', c: ['#3a4a6a', '#2a3a5a', '#e8c8b0', '#1a1a1a'], acc: 'clipboard' }),
        behavior: 'static', solid: true,
        lines: [EN('Note, please. Nobody goes past the line after the bell without a note.'),
          EN('I’m not being mean. I’m being a monitor. They told me it’s different.'),
          { if: { equipped: 'E215' }, t: 'Oh. You’re excused. Go on, then. Don’t run.', lang: 'en' }],
        reacts: { E215: { lines: [EN('Oh! A note from the nurse. You’re excused.'), 'She steps back from the line, very formally, as if it were a door.'] } } },
      { id: 'N1326', name: 'The Trophy Polisher', look: H({ t: 'old', body: 'apron', c: ['#6a6a5a', '#4a4a3a', '#e0c8a8', '#d0d0d0'], acc: 'broom' }),
        behavior: 'patrol', path: [[3, 6], [38, 6]], speed: 0.4, solid: true,
        lines: [EN('Every week I polish the blank plates. It’s easier than engraving.'),
          EN('Read them all, if you like. They like being read. Nobody ever reads a blank.')] }],
    mech: [{ type: 'visitAll', marks: ['tro0', 'tro1', 'tro2', 'tro3', 'tro4', 'tro5'], countText: 'Plates read: # of %', done: { flag: 'sah_trophy' },
      reward: [{ set: { sah_trophy: true } }],
      winLines: ['Every blank, read. At the end of the row, a cabinet gives a small click,', 'like a cup being set down on a shelf, very gently.', TICK] }],
    info: { summary: 'A corridor of trophy cabinets. Every cup and shield has a blank where the winner’s name should be.',
      rules: ['Read all six name plates on the gold pedestals: this ticks one line of the register, and the back of the last cabinet opens onto Sports Day at Night (W259).',
        'The hall monitor won’t let anyone past her chalk line without a note: equip the Sick Note (E215, from the nurse) to reach the principal’s office (W249).'],
      lore: 'Prizes bought in advance for someone, and polished every week in case.' } });

  /* W246 — The Classroom of the Carved Word */
  var CARVED = ['The same word is carved into this desk. You don’t need to read it twice.',
    'The same word again, carved deeper, as if someone wanted to be sure.',
    'The same word. Someone has tried to sand it off and only made it shine.',
    'The same word, in different handwriting. In lots of different handwriting.',
    'The same word, very small, in a corner, where only the owner would see it.'];
  var DESKS = [], BOARDS = {};
  [8, 11, 14, 17].forEach(function (y, j) { [6, 10, 14, 18, 22].forEach(function (x, i) { if (y === 17 && (x === 10 || x === 18)) return; DESKS.push({ look: 'schooldesk', at: [x, y], lines: [CARVED[(i + j) % CARVED.length]] }); }); });
  for (var bx = 10; bx <= 19; bx++) BOARDS[bx + ',0'] = { to: 'W257' };
  S({ id: 'W246', name: 'The Classroom of the Carved Word', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'wood', c: ['#6a5a4a'] }, backLabel: 'back to the corridor', backAt: [28, 11],
    map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.'); g.hline(10, 19, 0, 'b'); g.rect(1, 1, 28, 4, ','); return g.rows(); })(),
    look: NIGHTSCHOOL, style: { tallWalls: true }, music: 'carvedword', amb: { type: 'whispers', vol: 0.04 }, dark: 0.3,
    extra: { boards: BOARDS, noFurnish: true },
    decor: DESKS.concat([
      { look: 'desk', at: [15, 3], lines: ['The teacher’s desk. The register lies open on it, one line left blank.'] },
      { look: 'window', at: [1, 9], lines: ['A window. In it, the classroom again, with one more pupil than in here.'] },
      { look: 'poster', at: [4, 1], lines: ['A poster: “OUR CLASS”. Twenty-seven handprints in paint. A space for one more.'] }]),
    place: [
      { id: 'desk_a', type: 'decor', at: [10, 19], look: 'schooldesk', solid: true, cond: { notFlag: 'sah_class' }, lines: ['A desk pushed to the back, against the radiator.', 'The same word is carved here too, but smaller, as if ashamed of itself.'] },
      { id: 'desk_b', type: 'decor', at: [18, 19], look: 'schooldesk', solid: true, cond: { notFlag: 'sah_class' }, lines: ['Another desk pushed out of its row. Its chair has gone. Nobody knows where.'] },
      { id: 'gap_a', type: 'decor', at: [10, 17], look: 'chalkmark', solid: false, lines: ['A chalk outline on the floor, the shape of a desk. Where a desk used to be.'] },
      { id: 'gap_b', type: 'decor', at: [18, 17], look: 'chalkmark', solid: false, lines: ['Another chalk outline, in the last row. Exactly the size of a desk.'] },
      { id: 'desk_a_back', type: 'decor', at: [10, 17], look: 'schooldesk', solid: true, cond: { flag: 'sah_class' }, lines: ['Her desk, back in its row. The carved word has gone pale, almost gone.'] },
      { id: 'desk_b_back', type: 'decor', at: [18, 17], look: 'schooldesk', solid: true, cond: { flag: 'sah_class' }, lines: ['The other desk, back in its row. Somebody has found it a chair.'] },
      { type: 'sign', at: [14, 1], lines: [EN('Nothing has been written on this board for a long time. It is waiting for a door.')] },
      SOUL([EN('A word carved into a desk outlasts whoever carved it, and whoever it was for.')])],
    npcs: [
      { id: 'N1330', name: 'The Teacher Taking the Register', at: [15, 2], look: H({ t: 'adult', hairStyle: 'short', hair: '#6a5a4a', body: 'sweater', c: ['#5a6a5a', '#4a5a4a', '#e8d0b8', '#2a2a2a'], acc: 'book' }),
        behavior: 'static', solid: true,
        lines: [{ seq: [EN('Abbott? Here. Bell? Here. Carter? Here. Doyle? Here…'), 'She turns the page. She has skipped a line. She always skips the same line.'] },
          EN('Don’t mind the desks. They get pushed about. Put them back where the chalk says, if you like.'),
          EN('The register is never finished in here. The office calls the last name. When there is one.'),
          { if: { flag: 'sah_class' }, t: 'She looks at the full rows for a long time. She says nothing. She looks pleased.' }] },
      { id: 'N1331', name: 'The Back of Someone’s Head', at: [6, 9], look: H({ t: 'kid', hairStyle: 'short', hair: '#2a1a10', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#e0c8b0', '#2a1a10'], eyes: 'none', alpha: 0.7 }),
        behavior: 'static', solid: true, face: false,
        lines: ['You only ever see them from behind. You know every one of them by the back of the neck.', 'A head turns, slightly, the way you check something is still there. Then it turns back.'] }],
    npcList: [{ id: 'N1331', at: [14, 12] }, { id: 'N1331', at: [22, 9] }, { id: 'N1331', at: [18, 15] }],
    mech: [{ type: 'push', blocks: ['desk_a', 'desk_b'], plates: ['gap_a', 'gap_b'], done: { flag: 'sah_class' }, reward: [{ set: { sah_class: true } }],
      winLines: ['The second desk scrapes back into its row. There are no gaps now.', 'On every desk, the carved word goes pale, as if the wood were forgetting it.', TICK] }],
    info: { summary: 'A classroom at night with rows of small desks: the same word is carved into every one of them.',
      rules: ['Two desks have been pushed to the back. Push each one up into the chalk outline in the last row (stand behind it and walk into it). This ticks one line of the register.',
        'If a desk gets stuck, leave the room and come back: the desks return to where they were.',
        'The blackboard is blank: with the Chalk, draw a door on it to reach Parents’ Evening (W257).'],
      lore: 'One word, carved by many hands, and a register that always skips the same line.' } });

  /* W247 — The Shoe Lockers */
  S({ id: 'W247', name: 'The Shoe Lockers', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W241', backLook: 'door', backOpt: { style: 'glass', c: ['#8aa0b0'] }, backLabel: 'back to the corridor', backAt: [38, 8],
    map: (function () {
      var g = K.grid(40, 22, ' '); g.box(0, 0, 40, 22, '#', '.');
      g.hline(4, 35, 5, '^'); g.hline(4, 35, 11, '^');
      [19, 20].forEach(function (x) { g.set(x, 5, '.'); g.set(x, 11, '.'); });
      [7, 13, 26, 32].forEach(function (x) { g.set(x, 5, '.'); });
      [6, 15, 24, 31].forEach(function (x) { g.set(x, 11, '.'); });
      g.hline(12, 27, 21, 'g');
      g.rect(1, 13, 4, 6, '#'); g.rect(1, 14, 3, 4, '.'); g.set(4, 15, '|');
      return g.rows();
    })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor: { p: 'tile', c: ['#8a8478', '#6a6458'] }, glass: { p: 'flat', c: ['#6a8aa0', '#5a7a90'] } }),
    tall: { '^': { look: 'locker', opt: { c: ['#7a8a6a'] } } }, style: { tallWalls: true }, music: 'shoelockers', amb: { type: 'rain', vol: 0.05 }, dark: 0.4,
    doors: [{ to: 'W248', at: [20, 20], look: 'gate', opt: { c: ['#4a4a4a'] }, label: 'the gate, and the bus stop outside' }],
    decor: [7, 13, 26, 32].map(function (x, i) { return { id: 'cub' + i, look: 'drawer', at: [x, 5], lines: ['A shoe cubby.'] }; })
      .concat([6, 15, 24, 31].map(function (x, i) { return { id: 'cub' + (i + 4), look: 'drawer', at: [x, 11], lines: ['A shoe cubby.'] }; }))
      .concat([
        { look: 'pot', at: [17, 20], lines: ['An umbrella stand. Every umbrella in it belongs to someone who was collected by car.'] },
        { look: 'poster', at: [30, 1], lines: ['A notice: “Pupils must not wait inside after 17:00.”', 'Underneath, much smaller: “unless”.'] },
        { look: 'bench', at: [10, 19], lines: ['A bench by the glass doors. From here you can see the whole gate.', 'You can see who gets collected.'] },
        { look: 'sock', n: 2, lines: ['A gym sock on the floor, inside out, like a word somebody took back.'] },
        { look: 'scuff', at: [5, 16], solid: false, lines: ['A gap between the lockers and the wall, thin as a sheet of paper. A shoelace sticks out.'] },
        { id: 'rightshoe', look: 'shoe', at: [2, 15], lines: ['Her other shoe, behind the lockers, where someone threw it. Where someone always throws it.', 'It is dusty. It is still hers.'], use: [{ secret: 'sah_shoe' }] }]),
    signs: [{ at: [2, 16], lines: [EN('Things that are thrown go somewhere. Usually behind something.')] }],
    npcs: [
      { id: 'N1335', name: 'A Parent Waiting with an Umbrella', at: [14, 19], look: H({ t: 'adult', body: 'coat', c: ['#4a5a6a', '#3a4a5a', '#e0c8b0', '#2a2a2a'], acc: 'umbrella', alpha: 0.6 }),
        behavior: 'static', solid: true,
        lines: ['A grown-up with an umbrella, waiting at the glass doors. Not for you.', 'They smile at you briefly, the way you smile at somebody else’s dog.',
          EN('Have you seen my son? Blue coat. He’s always the last one out.')] },
      { id: 'N1336', name: 'The Crossing Patrol', at: [25, 18], look: H({ t: 'adult', hairStyle: 'bun', hair: '#8a8a8a', body: 'coat', c: ['#e8d040', '#c8b030', '#e8c8a8', '#2a2a2a'], acc: 'sign' }),
        behavior: 'static', solid: true,
        lines: [EN('Nobody crosses on their own. Wait for a grown-up.'),
          { seq: [EN('…No grown-up?'), 'She looks at the empty gate, then at you, then lifts her sign.', EN('Then I’ll be one. Come on. The bus stop is just there.')] }] }],
    npcList: [{ id: 'N1335', at: [22, 19] }],
    mech: [{ type: 'pairs', tiles: ['cub0', 'cub1', 'cub2', 'cub3', 'cub4', 'cub5', 'cub6', 'cub7'], give: 'E216',
      wrongLine: 'Two shoes that don’t belong together. You put them back.', doneLine: 'Every pair is together now. Except hers.',
      winLines: ['The last pair. Every cubby is matched now, except one: hers.', 'Only her left outdoor shoe is in it. Tucked inside the shoe: a bus pass.'] }],
    place: [SOUL([KS('오늘 학원 버스 놓치지 마. 엄마 못 데리러 가.', 'Don’t miss the hagwon bus today. Mum can’t come and get you.')])],
    info: { summary: 'The entrance hall: banks of shoe lockers, glass doors onto the rain, grown-ups waiting for other children.',
      rules: ['Open the eight shoe cubbies two at a time and match the symbols inside (memory pairs): the last cubby holds the Bus Pass (E216).',
        'The gate leads to The Bus After Cram School (W248).',
        'Behind the left bank of lockers, a paper-thin gap: with the Unsigned Permission Slip (E218) you can slip through and find her other shoe.'],
      lore: 'Shoes hidden by others, and a gate where everyone is collected but her.' } });

  /* W248 — The Bus After Cram School */
  S({ id: 'W248', name: 'The Bus After Cram School', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W061', backLook: 'door', backOpt: { style: 'metal', c: ['#e0c040'] }, backLabel: 'get off at the hagwon', backAt: [1, 2],
    map: (function () {
      var g = K.grid(48, 5, ' '); g.box(0, 0, 48, 5, '#', '.');
      for (var x = 5; x <= 43; x += 2) { if ([13, 21, 31].indexOf(x) < 0) g.set(x, 1, '}'); if ([5, 25, 37, 41].indexOf(x) < 0) g.set(x, 3, '}'); }
      return g.rows();
    })(),
    look: { floor: { p: 'rug', c: ['#4a4a52', '#3a3a42'] }, wall: { p: 'flat', c: ['#1a1e26', '#12161e'], topColor: '#1a1e26' }, wallface: { p: 'panel', c: ['#c8c8c0', '#a8a8a0', '#6a6a64'], skirt: '#3a3a3a' } },
    tall: { '}': { look: 'trainseat', opt: { c: ['#3a5a8a'] } } }, style: { tallWalls: true }, music: 'bus2200', amb: { type: 'machine', vol: 0.07 }, dark: 0.4,
    doors: [
      { to: 'W247', at: [25, 3], look: 'door', opt: { style: 'metal', c: ['#c8c8c0'] }, label: 'the stop by the school gate' },
      { to: 'W256', at: [46, 2], look: 'door', opt: { style: 'metal', c: ['#e0c040'] }, cond: { equipped: 'E216' }, label: 'stay on past the last stop',
        locked: 'The back doors. The driver shakes his head, taps the card reader, points past the end of the line.' }],
    decor: [
      { id: 'stopbell', look: 'doorbell', at: [13, 1], lines: ['A red stop button on a pole.'] },
      { look: 'ticketmachine', at: [5, 3], lines: [KS('삑. 학생입니다.', 'Beep. Student.'), 'The card reader says the same thing to everyone.'] },
      { look: 'poster', at: [31, 1], lines: ['The route map. Every stop is a school, a hagwon or a convenience store.', 'The last stop has no name. Only a little drawing of an umbrella.'] },
      { look: 'trash', at: [37, 3], lines: ['A bin. A rice-triangle wrapper, folded into a very small square.'] }],
    signs: [{ at: [17, 2], lines: [EN('Press the bell only for the stop where someone is waiting for you.')] }],
    npcs: [
      { id: 'N1340', name: 'The Bus Driver', at: [2, 1], look: H({ t: 'adult', body: 'uniform', c: ['#3a4a6a', '#2a3a5a', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#2a3a5a' }),
        behavior: 'static', solid: true,
        lines: [KS('학원 끝났니? 앉아. 꽉 잡고.', 'Done at the hagwon? Sit down. Hold on tight.'),
          KS('끝까지 타는 애는 너밖에 없어.', 'You’re the only one who rides all the way to the end.'),
          { seq: [KS('정기권 있으면 종점 지나서도 데려다줄게.', 'If you’ve got a pass, I’ll take you past the last stop, even.'), 'He taps the card reader, then points down the road, past the end of the line.'] },
          { if: { equipped: 'E216' }, seq: ['He sees your pass and nods.', KS('그래. 끝까지 가자.', 'All right. All the way, then.')] }] },
      { id: 'N1341', name: 'A Pupil Asleep on Her Bag', at: [21, 1], look: H({ t: 'kid', hairStyle: 'long', hair: '#1a1a1a', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1a1a'], eyes: 'closed' }),
        behavior: 'static', solid: true,
        lines: [KS('…다음 정거장에서 깨워 줘…', '…wake me at the next stop…'), 'She sleeps with her cheek on a maths book. Her stop went past a long time ago.'] },
      { id: 'N1342', name: 'A Red Balloon on the Bus', at: [41, 3], look: BALLOON, behavior: 'static', solid: false,
        lines: ['A red balloon, riding the bus on its own, string trailing.', 'It must have got out of the gym. It looks as if it knows where it’s going.'] }],
    mech: [{ type: 'cycleFrames', mark: 'stopbell', every: 2.6, good: 3, done: { flag: 'sah_bus' }, doneLine: 'The button has been pressed. The bus remembers the stop.',
      frames: ['Outside: the hagwon, every window lit. A pupil at a desk waves without looking up.',
        'Outside: a convenience store. A boy eats ramen alone at the window counter.',
        'Outside: a tower block. On the twelfth floor, one window is dark.',
        'Outside: a shelter in the rain. Someone with an umbrella searches the bus windows for one face.',
        'Outside: the school, dark except for one corridor.',
        'Outside: a field, nothing else. The bus drives on as if it knew the way.'],
      reward: [{ set: { sah_bus: true } }, { secret: 'sah_bus' }],
      winLines: ['You press the button. Ding. The bus pulls in at the shelter in the rain.', 'The person with the umbrella has already gone. The bench is still warm.', 'At the end of the line, now, someone will be waiting.'] }],
    place: [SOUL([KS('밤 열 시 버스. “조심히 들어가” 해 주는 사람은 기사 아저씨뿐이야.', 'The ten o’clock bus. The driver is the only one who ever says “get home safe”.')]),
      SOUL([EN('If you stay on long enough, the bus brings you back to school.')])],
    info: { summary: 'The ten o’clock bus from the hagwon: a long aisle, blue seats, pupils asleep on their bags.',
      rules: ['Press the stop button while the view outside shows the shelter where someone with an umbrella is waiting (the fourth view). That someone will then be waiting at The Last Stop.',
        'With the Bus Pass (E216) equipped, the driver lets you stay on past the end of the line: The Last Stop (W256).',
        'The side door is the stop by the school gate (The Shoe Lockers, W247).'],
      lore: 'The cram-school bus home, ten at night, the only adult who says goodnight.' } });
  link('W061', { to: 'W248', look: 'door', lookOpt: { style: 'metal', c: ['#e0c040'] }, label: 'the ten o’clock bus, waiting outside' });

  /* W249 — The Principal’s Microphone */
  S({ id: 'W249', name: 'The Principal’s Microphone', depth: 2, tier: 'hard', secretLevel: 2,
    back: 'W245', backLook: 'door', backOpt: { style: 'wood', c: ['#5a3a2a'] }, backLabel: 'back past the hall monitor', backAt: [12, 14],
    map: (function () { var g = K.grid(24, 16, ' '); g.box(0, 0, 24, 16, '#', '.'); g.rect(6, 3, 12, 8, ','); return g.rows(); })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor2: { p: 'carpet', c: ['#3a4a3a', '#2a3a2a'] } }), style: { tallWalls: true }, music: 'principal', amb: { type: 'loudspeaker', vol: 0.03 }, dark: 0.35,
    doors: [{ to: 'W260', at: [22, 8], look: 'door', opt: { style: 'wood', c: ['#c8a050'] }, cond: { flag: 'sah_called' }, label: 'the double doors to the assembly hall, ajar, lights on' }],
    decor: [
      { look: 'desk', at: [12, 5], lines: ['The principal’s desk. Everything on it is at right angles.'] },
      { id: 'register', look: 'book', at: [10, 5], lines: [{ t: function () { var n = META.filter(function (f) { return YN.save.flag(f); }).length; return 'The register, open at the last page. ' + n + ' of the five ticks near the bottom are done.'; } },
        'Beside them, in pencil: “music · gym · nurse · trophies · class”. Below, one last box, with no name.'] },
      { id: 'mic', look: 'intercom', at: [14, 5], lines: ['The microphone for the whole school. A red light: ON. It has been on all evening.'] },
      { look: 'portrait', at: [4, 1], lines: ['A former principal. Under the frame: “Every name, every day.”'] },
      { look: 'portrait', at: [20, 1], lines: ['Another former principal. His smile has been painted over and painted back.'] },
      { look: 'wallclock', at: [12, 1], lines: ['The office clock: 16:31, like the corridor. Here, at least, it ticks.'] },
      { look: 'drawer', at: [22, 3], lines: ['A filing cabinet. One drawer is labelled “still to be called”. It is nearly empty.'] }],
    npcs: [{ id: 'N1345', name: 'The Principal', at: [12, 3], look: H({ t: 'tall', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#e0c8b0', '#c8c8c8'] }), behavior: 'static', solid: true,
      lines: [EN('Ah. You’re the one who doesn’t answer the register.'),
        EN('Every name in this school is called at the end of the day. It’s a rule. I wrote it.'),
        EN('Five lines still to tick before yours. Then you answer, and the list is finished.'),
        EN('When your name is called, you say the word. Everybody knows the word.'),
        { if: { flag: 'sah_called' }, seq: ['He smiles, for the first time in the history of the school.', EN('The hall is open. Everyone is there. Well. Everyone who stayed.')] }] }],
    mech: [{ type: 'sayTo', mark: 'mic', dist: 3, words: ['here', 'present', 'yes', 'im here', 'i am here', '네', '여기요', '여기 있어요', '저요', '출석'],
      cond: { flag: META }, notNow: 'The microphone hums. In the register, five ticks near the bottom are still missing.',
      wrong: 'Your voice goes out into every room at once. It is not the word the register is waiting for.',
      give: 'E217', reward: [{ set: { sah_called: true } }, { secret: 'sah_called' }],
      winLines: ['The microphone takes the word into every room at once.', 'Then, from every loudspeaker, a voice reads out the last name on the register.',
        'Yours. All of it. Pronounced right.', 'The principal ticks the box. It is the loudest sound the school has ever made.'] }],
    place: [SOUL([EN('Every name gets called at the end of the day. Some just get called much later.')])],
    info: { summary: 'The principal’s office: a desk at right angles, an open register, and the microphone for the whole school.',
      rules: ['Meta-puzzle: the register needs five ticks, one from each room — the music room (W242), the gym (W243), the nurse (W244), the trophies (W245) and the classroom (W246).',
        'Once all five are done, stand by the microphone and answer the register: say “here” (or “present”, “yes”, 여기요…). This gives The Principal’s Microphone (E217).',
        'The double doors then open onto The Assembly for One (W260).'],
      lore: 'The last name on the register, called at last.' } });

  /* W250 — The Lost Property Box */
  S({ id: 'W250', name: 'The Lost Property Box', depth: 2, tier: 'mid', secretLevel: 2,
    back: 'W004', backLook: 'toybox', backLabel: 'climb back out of the box', backAt: [2, 2],
    map: (function () {
      var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.');
      [6, 11, 16, 21].forEach(function (y) { g.hline(4, 30, y, '^'); g.set(10, y, '.'); g.set(20, y, '.'); });
      g.rect(32, 21, 7, 6, '#'); g.rect(33, 22, 5, 4, '.'); g.set(32, 23, '|');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#5a4632', '#4a3826', '#6a5440'] }, wall: { p: 'flat', c: ['#1e1812', '#16120c'], topColor: '#1e1812' }, wallface: { p: 'panel', c: ['#6a6050', '#5a5040', '#3a3428'], skirt: '#2a2018' } },
    tall: { '^': { look: 'shelf' } }, style: { tallWalls: true }, music: 'lostproperty', amb: { type: 'pages', vol: 0.04 }, dark: 0.5, weather: { dust: true },
    doors: [{ to: 'W241', at: [37, 2], arrive: 'locker31', look: 'locker', opt: { c: ['#4a6a8a'] }, label: 'the inside of locker 31' }],
    decor: [
      { id: 'lp0', look: 'sock', at: [8, 9], lines: ['A mitten, alone. It has been holding the shape of a hand all year.'] },
      { id: 'lp1', look: 'crane', at: [25, 4], lines: ['A paper crane, flattened, as if someone sat on it by accident. Or not by accident.'] },
      { id: 'lp2', look: 'trinket', at: [14, 14], lines: ['A yellow hair clip, exactly like hers. She touches her hair. Hers is still there.'] },
      { id: 'lp3', look: 'book', at: [28, 19], lines: ['A reading book with the name label cut out. The bookmark is at page three.'] },
      { id: 'lp4', look: 'shoe', at: [6, 24], lines: ['A plimsoll, size 31. Its name label has been snipped out with scissors.'] },
      { look: 'crate', at: [24, 9], lines: ['A box: “FOUND — PLAYGROUND”. A skipping rope inside, tied in a knot nobody can undo.'] },
      { look: 'crate', at: [16, 24], lines: ['A box: “FOUND — TOILETS”. It is empty, and it is the heaviest one.'] },
      { look: 'glassespile', at: [34, 8], lines: ['A heap of glasses. Through every pair, the room looks like a different year.'] },
      { look: 'clothesline', at: [16, 2], lines: ['A row of coats on hooks. Each coat has one arm slightly raised, as if to answer.'] },
      { look: 'scraps', at: [31, 24], solid: false, lines: ['Behind the last shelf, a gap as thin as a sheet of paper. It smells of crayons.'] },
      { id: 'unclaimed', look: 'toybox', at: [35, 24], lines: ['A box marked UNCLAIMED — 2014–2026.', 'Drawings. A recorder. A swimming cap with a name in Korean letters. All hers.'],
        listen: [{ match: ['mine', 'its mine', 'thats mine', 'it is mine', '내 거야', '내 거', '제 거예요'],
          lines: ['You say it out loud. It is the first time anything has ever been claimed from this box.', 'The drawings are still warm.'], do: [{ secret: 'sah_unclaimed' }] }] }],
    signs: [{ at: [34, 23], lines: [EN('Say whose it is. Things wait their whole lives to be claimed.')] }],
    npcs: [
      { id: 'N1350', name: 'The Keeper of Lost Things', at: [5, 2], look: H({ t: 'old', body: 'robe', c: ['#6a5a4a', '#5a4a3a', '#e0c8a8', '#d0d0d0'], acc: 'clipboard', eyes: 'closed' }),
        behavior: 'static', solid: true,
        lines: [EN('Everything here was put down for a moment. A moment can be very long.'),
          EN('Things hum when they remember who they belong to. Pick them up in the order they remember.'),
          EN('If nobody comes for something by Friday, it stays for ever. It is always Friday in here.')] },
      { id: 'N1351', name: 'A Glove Looking for the Other One', at: [24, 13], look: { t: 'hand', c: ['#c04040'], h: 10 }, behavior: 'wander', radius: 6, speed: 0.8, solid: false,
        lines: ['A red glove walks along the shelves on its fingers, looking for its other half.'] }],
    mech: [{ type: 'sequence', order: ['lp2', 'lp0', 'lp4', 'lp1', 'lp3'], passThrough: true, give: 'E213',
      ring: { every: 1.8, pause: 5, hear: 16, sfx: 'chime', glyph: '♪', color: '#f0e8c0' },
      okLines: ['It hums back, pleased.', 'It hums back.', 'It hums back, a little louder.', 'It hums back. Something underneath is humming too.'],
      wrongLine: 'It goes quiet in your hand. It was not its turn to be remembered.',
      winLines: ['The last thing hums, and something under the heap hums back.', 'A single white piano key, still warm, as if somebody had just been playing it.'] }],
    place: [SOUL([EN('Lost property is a room full of things that waited by the gate. Nobody came.')])],
    info: { summary: 'The school’s lost property box, grown into a whole dusty room of shelves, coats and single shoes.',
      rules: ['Five lost things hum in turn, a little note floating above each: pick them up in the order they hum (hair clip, mitten, plimsoll, paper crane, reading book). This gives The Missing Key (E213).',
        'Reached from the lost property box of the Empty School, or from locker 31 in the corridor.',
        'Behind the last shelf, a paper-thin gap: with the Unsigned Permission Slip (E218) you reach the UNCLAIMED box. Say “mine” to it.'],
      lore: 'Everything she ever lost at school, and never went to ask for.' } });
  link('W004', { to: 'W250', look: 'toybox', label: 'a lost property box, big enough to climb into' });

  /* ===============================================================
   *  DEPTH 3 — DEEPER IN THE BUILDING
   * =============================================================== */

  /* W251 — Lane Eight */
  /* lane eight (y 18-20) is shut off from the other lanes by the fallen rope (y 17) and only
     reached by its own ladder; fallen floats force the footprints to zigzag */
  var BUOYS = [[12, 18], [12, 19], [18, 19], [18, 20], [24, 18], [24, 19], [30, 19], [30, 20], [35, 18], [35, 19]];
  S({ id: 'W251', name: 'Lane Eight', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W243', backLook: 'door', backOpt: { style: 'metal', c: ['#4a7898'] }, backLabel: 'back to the changing rooms', backAt: [44, 14],
    map: (function () {
      var g = K.grid(46, 30, ' '); g.box(0, 0, 46, 30, '#', ',');
      g.rect(5, 6, 36, 16, '%'); g.rect(6, 7, 34, 14, '.');
      for (var y = 9; y <= 15; y += 2) g.hline(6, 39, y, ':');
      g.hline(6, 39, 17, 'o');
      g.set(5, 19, 's'); g.set(5, 8, 's');
      g.rect(34, 8, 6, 5, '_');
      return g.rows();
    })(),
    look: { floor: { p: 'tile', c: ['#3a6a8a', '#2a5a7a'] }, floor2: { p: 'tile', c: ['#d8e4e8', '#b8c8d0'] }, floor3: { p: 'tile', c: ['#1a3a5a', '#12304e'] },
      wall: { p: 'flat', c: ['#1a2a34', '#10202a'], topColor: '#16262e' }, wall2: { p: 'tile', c: ['#9ab8c8', '#7a98a8', '#5a7888'] },
      wallface: { p: 'panel', c: ['#a8c0c8', '#88a0a8', '#5a7a88'], skirt: '#2a4a5a' } },
    tall: { 'o': { look: 'buoy' } }, style: { tallWalls: true }, music: 'laneeight', amb: { type: 'drip', vol: 0.06 }, dark: 0.55, extra: { noFurnish: true },
    fall: { to: 'W090', cond: { flag: 'sah_lane8' } },
    doors: [
      { to: 'W016', at: [1, 14], look: 'door', opt: { style: 'metal', c: ['#5a88a8'] }, label: 'the shallow end, and a corridor to another empty pool' },
      { to: 'W254', at: [22, 28], arrive: 'toW251', look: 'door', opt: { style: 'wood', c: ['#3a3430'] }, label: 'the cupboard door, from the other side' }],
    decor: BUOYS.map(function (p) { return { look: 'buoy', at: p, lines: ['A lane float, fallen to the bottom of the empty pool and left there.'] }; }).concat([
      { id: 'block8', look: 'chalkmark', at: [6, 19], solid: false, lines: ['Wet footprints start here, at the foot of the lane eight ladder.'] },
      { look: 'pedestal', opt: { c: ['#e8e8e8'] }, at: [3, 20], lines: ['A starting block with an 8 on it. The paint on the 8 is the only paint not chipped.'] },
      { id: 'wall8', look: 'ladder', at: [39, 19], lines: ['The far wall of lane eight. The tiles here are worn smooth by one hand.'] },
      { look: 'drain', at: [22, 12], lines: ['A drain in the middle of the pool, its grille gone. Very far down, something sloshes.'] },
      { look: 'towel', at: [2, 25], lines: ['A towel folded on the bench. Every towel here has a name label but this one.'] },
      { look: 'wallclock', at: [22, 1], lines: ['The pool clock: nine o’clock. Saturday. No: Tuesday. It can’t decide.'] },
      { look: 'bench', at: [10, 26], lines: ['The poolside bench, where the ones who forgot their swimming things sit and watch.'] }]),
    signs: [{ at: [34, 14], lines: [EN('All the water went somewhere. Down, they say. There is a sea under the dreams.')] }],
    npcs: [
      { id: 'N1355', name: 'The Swimming Teacher on the Edge', at: [3, 18], look: H({ t: 'adult', body: 'shirt', c: ['#e0e0e0', '#c0c0c0', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#d03030' }),
        behavior: 'static', solid: true,
        lines: [EN('Lane eight. Off you go. One length.'), EN('Nobody swims in lane eight. That’s why it’s yours.'), EN('Follow the wet footprints to the far wall. Don’t step off them.')] },
      { id: 'N1356', name: 'A Swimmer Who Stayed', count: 3, look: H({ t: 'kid', body: 'shirt', c: ['#203a5a', '#102a4a', '#e0c8b0', '#f0f0f0'], eyes: 'closed', alpha: 0.5 }),
        behavior: 'static', solid: false,
        lines: ['A swimmer in a rubber cap stands on the bottom of the empty pool, holding her breath out of habit.'] }],
    mech: [{ type: 'trail', from: 'block8', to: 'wall8', slack: 0, done: { flag: 'sah_lane8' },
      lostLine: 'Your foot lands on dry tile. The footprints fade back to the start.',
      reward: [{ set: { sah_lane8: true } }, { secret: 'sah_lane8' }],
      winLines: ['The footprints end at the far wall, as if someone had touched it and turned round.', 'You touch it too. Far below the tiles, water moves.', 'The deep end is not as empty as it looks.'] }],
    place: [SOUL([EN('She never learned to swim. She learned to stand very still in the shallow end.')])],
    info: { summary: 'The school pool, drained: eight lanes of dry blue tiles, lane floats lying on the bottom, a deep end of black.',
      rules: ['Climb down the lane-eight ladder (bottom left of the pool). Wet footprints run from there to the far wall, winding round the fallen floats: follow them to the wall.',
        'Then climb into the upper lanes by the other ladder and push into the black hole of the deep end: you fall into The Inner Sea (W090).',
        'Doors lead to the changing rooms (the gym), to The Empty Pool (W016), and to the cupboard under the stairs (W254).'],
      lore: 'Swimming lessons in the lane nobody wanted, and the water that went somewhere.' } });
  link('W016', { to: 'W251', look: 'door', lookOpt: { style: 'metal', c: ['#4a7898'] }, label: 'a door marked LANE 8' });

  /* W252 — The Unfinished Portraits */
  var PAINT = [['red', '#d83030', [22, 17]], ['orange', '#e88a30', [9, 11]], ['yellow', '#e8d040', [16, 16]], ['green', '#40a050', [4, 15]], ['blue', '#3a70d0', [25, 10]], ['violet', '#8a50c0', [15, 6]]];
  var PLATES = {}; PAINT.forEach(function (p, i) { PLATES[p[2][0] + ',' + p[2][1]] = i; });
  S({ id: 'W252', name: 'The Unfinished Portraits', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W254', backLook: 'door', backOpt: { style: 'wood', c: ['#5a4a3a'] }, backLabel: 'back to the stairwell', backAt: [30, 11],
    map: (function () { var g = K.grid(32, 22, ' '); g.box(0, 0, 32, 22, '#', '.'); g.rect(1, 1, 30, 3, ','); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#8a7a60', '#7a6a50', '#9a8a70'] }, floor2: { p: 'flat', c: ['#d8d0c0', '#c8c0b0'] },
      wall: { p: 'flat', c: ['#2a2620', '#1e1a16'], topColor: '#26221c' }, wallface: { p: 'panel', c: ['#d8d0c0', '#b8b0a0', '#8a8478'], skirt: '#5a5040' } },
    style: { tallWalls: true }, music: 'unfinished', amb: { type: 'paper', vol: 0.04 }, dark: 0.35,
    doors: [{ to: 'W258', at: [16, 1], look: 'curtain', opt: { c: ['#8a8070'] }, cond: { flag: 'sah_portrait' }, label: 'the backdrop for the class photograph' }],
    decor: PAINT.map(function (p) { return { look: 'sparkle', opt: { c: [p[1]] }, at: p[2], solid: false, lines: ['A splash of ' + p[0] + ' paint on the floor, still wet.'] }; }).concat([
      { id: 'herportrait', look: 'frame', at: [16, 4], lines: ['The easel at the front. A portrait with everything but a face.',
        { if: { flag: 'sah_portrait' }, t: 'The portrait is finished: a girl with a yellow clip and a blue jumper. At the bottom: “finished”.' }] },
      { look: 'frame', at: [6, 8], lines: ['An unfinished portrait: the hair is done, very carefully. The face is not.'] },
      { look: 'frame', at: [12, 8], lines: ['A portrait of a boy, finished except the mouth. He looks about to say something.'] },
      { look: 'frame', at: [20, 8], lines: ['Two friends, each drawn by the other. Both are smiling at the same joke.'] },
      { look: 'frame', at: [26, 13], lines: ['A portrait signed in the corner by whoever sat next to the model.'] },
      { look: 'frame', at: [12, 13], lines: ['An empty easel. A name tag on it, then a second name tag stuck over the first.'] },
      { look: 'poster', at: [12, 1], lines: ['A colour wheel. Under it, in the teacher’s hand: “in the order the rain taught us”.'] },
      { look: 'drawing', at: [3, 1], lines: ['A drawing: “MY FAMILY”. Three figures. One has been rubbed out and drawn back in, twice.'] },
      { look: 'drawing', at: [8, 1], lines: ['A drawing: “MY HOUSE”. Every single window is yellow.'] },
      { look: 'drawing', at: [24, 1], lines: ['A drawing: “MY FRIEND”. A blank page and a name crossed out: N—.'] },
      { look: 'drawing', at: [28, 1], lines: ['A drawing: “WHEN I GROW UP”. A lamp.'] },
      { look: 'jar', at: [29, 3], lines: ['A jar of brushes in grey water. Every colour has been washed into this one.'] },
      { look: 'sink', at: [1, 5], lines: ['A deep sink, stained like a rainbow. Nobody has ever got it clean.'] }]),
    npcs: [
      { id: 'N1360', name: 'The Art Teacher', at: [18, 4], look: H({ t: 'adult', hairStyle: 'long', hair: '#8a4a2a', body: 'apron', c: ['#c8b890', '#a89870', '#e8d0b8', '#3a2a1a'], acc: 'book' }),
        behavior: 'static', solid: true,
        lines: [EN('Draw the person next to you. Everybody has someone next to them.'),
          EN('…Nearly everybody. Then the paper has to draw you itself. It needs a little help.'),
          EN('Walk the colours in the order the rain uses. Paper likes that.')] },
      { id: 'N1361', name: 'A Half-Drawn Classmate', at: [8, 17], look: H({ t: 'kid', head: 'hollow', body: 'uniform', c: ['#d8d0c0', '#b8b0a0', '#f0e8d8', '#3a3a3a'], alpha: 0.8 }),
        behavior: 'static', solid: true,
        lines: ['A classmate who was only half drawn: one eye, one ear, no mouth yet.', 'He is waiting to be finished too. He does not seem to mind.'] }],
    npcList: [{ id: 'N1361', at: [27, 17] }, { id: 'N1361', at: [3, 9] }],
    mech: [{ type: 'stepOrder', plates: PLATES, count: 6, color: 'rgba(255,230,200,0.9)', done: { flag: 'sah_portrait' },
      reward: [{ set: { sah_portrait: true } }, { secret: 'sah_portrait' }],
      winLines: ['Violet, last. The colours on the floor run together into one small shape.', 'On the front easel, the portrait finishes itself: a girl, a yellow clip, a blue jumper.',
        'Behind the easels, the backdrop for the class photo rolls down, with a gap in it the shape of a person.'] }],
    place: [SOUL([KS('그림 잘 그렸네. 냉장고에 붙여 놓을게.', 'What a lovely drawing. I’ll put it on the fridge.')])],
    info: { summary: 'The art room on the top floor: easels with portraits nobody finished, paint still wet on the floor.',
      rules: ['Six splashes of paint lie on the floor. Step on them in rainbow order: red, orange, yellow, green, blue, violet. A wrong splash starts you again.',
        'The front portrait then finishes itself, and the backdrop opens onto The Class Photograph (W258).'],
      lore: 'Draw the person next to you; nobody was next to her.' } });

  /* W253 — The Chained Roof Door */
  S({ id: 'W253', name: 'The Chained Roof Door', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W254', backType: 'stairs', backLook: 'stairsdown', backLabel: 'back down the stairs', backAt: [3, 20],
    map: (function () {
      var g = K.grid(34, 24, ' '); g.box(0, 0, 34, 24, '#', ',');
      g.hline(0, 33, 0, 'f'); g.vline(0, 0, 15, 'f'); g.vline(33, 0, 15, 'f');
      g.rect(1, 17, 32, 6, '.'); g.hline(1, 32, 16, '#'); g.set(16, 16, '|'); g.set(17, 16, '|');
      return g.rows();
    })(),
    mapPost: function (rows) { if (!YN.save.flag('sah_chain')) return rows; return rows.map(function (r, y) { return y === 16 ? r.replace(/\|/g, '.') : r; }); },
    look: { floor: { p: 'concrete', c: ['#4a4a50', '#3a3a40'] }, floor2: { p: 'concrete', c: ['#5a5a62', '#4a4a52', '#626270'] },
      wall: { p: 'flat', c: ['#1a1a20', '#121218'], topColor: '#1a1a20' }, wallface: { p: 'panel', c: ['#6a6a70', '#5a5a60', '#3a3a40'], skirt: '#2a2a30' } },
    style: { tallWalls: true, stars: true, sky: ['#0a1020', '#1a2a48'] }, music: null, amb: { type: 'wind', vol: 0.06 }, dark: 0.45,
    decor: [
      { id: 'd0', look: 'clock', at: [11, 17], lines: ['A wheel of the padlock.'] },
      { id: 'd1', look: 'clock', at: [12, 17], lines: ['A wheel of the padlock.'] },
      { id: 'd2', look: 'clock', at: [13, 17], lines: ['A wheel of the padlock.'] },
      { id: 'd3', look: 'clock', at: [14, 17], lines: ['A wheel of the padlock.'] },
      { look: 'door', opt: { style: 'metal', c: ['#5a5a60'] }, at: [15, 17], lines: ['The roof door. A chain through both handles, and a padlock with four little wheels.', 'Under the door there is a gap about as thick as a sheet of paper.'] },
      { look: 'door', opt: { style: 'metal', c: ['#5a5a60'] }, at: [18, 17], lines: ['The other half of the roof door. Cold air comes in under it, and the smell of rain.'] },
      { look: 'scuff', at: [10, 18], solid: false, lines: ['Scratched into the paint beside the padlock: a tiny bus, and under it, “ten”.'] },
      { look: 'window', at: [26, 17], lines: ['A wired window onto the roof. Out there: lanterns, a bench, two cups.'] },
      { look: 'bench', at: [16, 4], lines: ['A bench facing the town. Two cups have left two rings on it.'] },
      { look: 'telescope', at: [20, 3], lines: [{ t: function () { return 'A telescope aimed at the town. You count ' + (40 + Math.floor(Math.random() * 60)) + ' lit windows. Someone up in every one.'; } }] },
      { look: 'watertower', at: [26, 7], lines: ['The water tower. Somebody has painted on it, very small: “still here”.'] },
      { look: 'antenna', at: [7, 5], lines: ['A bent aerial. Something red is caught on it.'] },
      { look: 'vent', at: [10, 11], lines: ['A vent breathing warm air from the classrooms below, like a sleeping animal.'] },
      { look: 'pot', n: 3, lines: ['A pot of geraniums. Somebody climbs up here to water them. There is no other way up.'] },
      { look: 'lantern', n: 3, light: 2, lines: ['A lantern on a hook, lit. Somebody lights them every evening, just in case.'] }],
    signs: [{ at: [16, 9], lines: [EN('From up here you can count the lit windows. Each one is somebody else still up.')] }],
    npcs: [
      { id: 'N1365', name: 'The Night Caretaker', at: [6, 19], look: CARETAKER, behavior: 'static', solid: true,
        lines: [EN('Up here? I keep the chain on so everybody comes back down for their tea.'),
          EN('The combination is the time of the last bus. Same every night. Never changes.'),
          EN('People come up here to be on their own. I sit on the stairs so they’re not. Both can be true.'),
          { if: { flag: 'sah_chain' }, t: 'He has brought two cups of cocoa. He sets one down beside you without a word.' }] },
      { id: 'N1366', name: 'A Paper Aeroplane', count: 3, look: { t: 'bird', c: ['#f4f4f0'], h: 7 }, behavior: 'fly', radius: 6, speed: 0.8, solid: false,
        lines: ['A paper aeroplane, circling. On its wing: “is anyone else up?”', 'Another one. On its wing, in different handwriting: “yes”.'] },
      { id: 'N1367', name: 'The Red Balloon', at: [8, 6], look: BALLOON, behavior: 'static', solid: false,
        lines: ['The red balloon from the gym, caught on the aerial. It is not trying to get away.'] }],
    mech: [{ type: 'dials', marks: ['d0', 'd1', 'd2', 'd3'], states: 10, values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], start: [7, 3, 5, 9], target: [2, 2, 0, 0],
      labelText: 'The wheel clicks round to ', done: { flag: 'sah_chain' },
      reward: [{ set: { sah_chain: true } }, { secret: 'sah_roof' }, { tile: [{ x: 16, y: 16, ch: '.' }, { x: 17, y: 16, ch: '.' }] }],
      winLines: ['Two, two, zero, zero. The padlock opens with the sound of the last bus pulling away.', 'The chain slides off the handles and lies on the floor, like something asleep.'] }],
    place: [SOUL([EN('She came up here at lunch to be alone, and found geraniums somebody had watered.')])],
    info: { summary: 'The top landing, the roof door chained shut, and beyond it the flat roof under the stars.',
      rules: ['The padlock has four wheels: set them to the time of the last bus, 22:00 (2, 2, 0, 0). The chain falls and the roof opens for good.',
        'Or slip under the door with the Unsigned Permission Slip (E218): it goes through the paper-thin gap.',
        'The roof is only lanterns, geraniums, a telescope and lit windows: somebody keeps watch.'],
      lore: 'The place she went to be alone, where somebody else had already been keeping the lights on.' } });

  /* W254 — The Stairwell at Lunchtime */
  S({ id: 'W254', name: 'The Stairwell at Lunchtime', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W241', backLook: 'door', backOpt: { style: 'wood', c: ['#6a5a4a'] }, backLabel: 'down to the corridor', backAt: [12, 28],
    map: (function () {
      var g = K.grid(26, 30, ' '); g.box(0, 0, 26, 30, '#', '.');
      g.hline(1, 18, 8, '#'); g.hline(7, 24, 15, '#'); g.hline(1, 18, 22, '#');
      g.rect(19, 7, 6, 3, 's'); g.rect(1, 14, 6, 3, 's'); g.rect(19, 21, 6, 3, 's');
      return g.rows();
    })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor: { p: 'concrete', c: ['#6a6a6c', '#5a5a5c'] }, stairs: { p: 'hstripes', c: ['#7a7a7c', '#5a5a5c'] } }),
    style: { tallWalls: true }, music: 'stairwell', amb: { type: 'kids', vol: 0.02 }, dark: 0.85,
    doors: [
      { to: 'W252', at: [3, 1], look: 'door', opt: { style: 'wood', c: ['#8a7a60'] }, label: 'the art room, top floor' },
      { to: 'W253', type: 'stairs', at: [12, 1], look: 'stairs', label: 'up to the roof door' },
      { to: 'W251', at: [24, 27], look: 'door', opt: { style: 'wood', c: ['#3a3430'] }, cond: { flag: 'sah_stairs' }, label: 'the cupboard under the stairs' }],
    decor: [
      { id: 'sw0', look: 'switch', at: [1, 25], lines: ['A timer switch.'] },
      { id: 'sw1', look: 'switch', at: [24, 18], lines: ['A timer switch.'] },
      { id: 'sw2', look: 'switch', at: [1, 11], lines: ['A timer switch.'] },
      { id: 'sw3', look: 'switch', at: [24, 3], lines: ['A timer switch.'] },
      { look: 'window', at: [12, 9], lines: ['The stairwell window looks down on the playground.', 'Down there, everyone is in a group. From up here, the groups look like dropped coins.'] },
      { look: 'crumbs', at: [10, 18], solid: false, lines: ['Rice crumbs on the step. Somebody eats here every day, very slowly.'] },
      { look: 'pot', at: [8, 5], lines: ['A dead plant on the top landing. Somebody still waters it with the end of their bottle.'] },
      { look: 'trash', at: [20, 27], lines: ['A bin with one lunchbox lid in it, washed, as if it had been thrown away by mistake.'] }],
    signs: [{ at: [12, 25], lines: [EN('The lights on these stairs run on timers. They never wait for anyone.')] }],
    npcs: [
      { id: 'N1370', name: 'Someone Eating Lunch on the Steps', at: [8, 19], look: H({ t: 'kid', hairStyle: 'short', hair: '#2a1a1a', body: 'sweater', c: ['#7a8aa8', '#5a6a88', '#f0d8c0', '#1a1a1a'], eyes: 'sad', alpha: 0.65 }),
        behavior: 'static', solid: true,
        lines: ['She eats rice from a lunchbox, very slowly, so that lunch lasts until the bell.',
          EN('This landing is the best. Nobody comes up past the one below.'),
          { seq: [EN('My mum leaves a note in the lid. I read it last, like pudding.'), 'She shows you the lid. On a sticky note:', KS('다 먹어. 오늘도 수고했어.', 'Eat it all up. You did well today too.')] }] },
      { id: 'N1371', name: 'Footsteps Two Floors Up', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 16,
        ambientLines: ['Footsteps, two floors up. They stop when you stop.', 'Somebody above counts the steps under their breath: “…twelve, thirteen…”', 'Laughter from the playground, muffled, like something under water.'] }],
    mech: [{ type: 'lampsAll', lamps: ['sw0', 'sw1', 'sw2', 'sw3'], time: 32, light: 3, done: { flag: 'sah_stairs' }, reward: [{ set: { sah_stairs: true } }],
      onLine: 'Already ticking.', litLines: ['Click. Somewhere a timer starts ticking.', 'Click. Another landing lights up.', 'Click. The first light is already counting down.'],
      winLines: ['All four landings lit at once. From the bottom, the stairwell is not so tall after all.', 'Under the bottom flight, the cupboard door that is always locked stands open a crack.', 'Cold air comes out of it, smelling of chlorine.'] }],
    place: [SOUL([EN('The stairs are the only place in a school that belongs to nobody.')])],
    info: { summary: 'A dark switchback stairwell where somebody eats lunch alone on the landing every day.',
      rules: ['Each of the four landings has a timer switch. Press all four so that they are lit at the same time (each stays on about thirty seconds).',
        'Then the cupboard under the bottom flight opens onto Lane Eight (W251).',
        'The stairs lead up to the art room (W252) and to the chained roof door (W253).'],
      lore: 'Lunch made to last until the bell, on the landing nobody passes.' } });

  /* W255 — Inside the Piano */
  S({ id: 'W255', name: 'Inside the Piano', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W242', backLook: 'crack', backOpt: { c: ['rgba(0,0,0,0.55)'] }, backLabel: 'up through the crack, into the music room', backAt: [14, 22], backArrive: 'toW255',
    map: (function () {
      var g = K.grid(30, 24, ' '); g.box(0, 0, 30, 24, '#', '.');
      for (var x = 2; x < 28; x += 2) g.vline(x, 1, 16, ',');
      g.rect(1, 17, 28, 6, ':');
      g.hline(1, 28, 6, '^'); [5, 14, 23].forEach(function (x) { g.set(x, 6, '.'); });
      g.hline(1, 28, 11, '^'); [9, 19].forEach(function (x) { g.set(x, 11, '.'); });
      return g.rows();
    })(),
    look: { floor: { p: 'flat', c: ['#f0ece0', '#e4e0d4'] }, floor2: { p: 'flat', c: ['#1a1a1e', '#141418'] }, floor3: { p: 'carpet', c: ['#7a2030', '#6a1828'] },
      wall: { p: 'flat', c: ['#1a0e08', '#120a04'], topColor: '#1a0e08' }, wallface: { p: 'panel', c: ['#3a2416', '#2a180e', '#1a0e06'], skirt: '#100806' } },
    tall: { '^': { look: 'pillar', opt: { c: ['#c84848'] } } }, style: { tallWalls: true }, music: null, amb: { type: 'clock', vol: 0.05 }, dark: 0.55, extra: { noFurnish: true },
    decor: [
      { look: 'wire', at: [3, 3], lines: ['A piano string, taut, humming one note to itself so as not to forget it.'] },
      { look: 'wire', at: [26, 4], lines: ['A string so low it is more of a feeling than a note.'] },
      { look: 'wire', at: [3, 9], lines: ['A string with a hairpin wedged under it. Somebody wanted this note to buzz.'] },
      { look: 'coin', at: [24, 19], lines: ['A coin that fell between the keys in 1987. It has been ringing very quietly ever since.'] },
      { look: 'scraps', at: [6, 20], solid: false, lines: ['A sweet wrapper, a hair, a tiny folded note: “ask her to sing”. It was never passed on.'] }],
    place: [{ id: 'thegap', type: 'decor', at: [14, 1], look: 'hole', lines: ['The gap where the missing key lived. A little silence with edges.'],
        onEffect: { E213: [{ lines: ['You fit the key into the gap. It clicks, as if it had only been away for the afternoon.', 'You press it. Out comes the note the class song always skipped.',
          'It sounds like someone saying your name very softly, from the next room.'] }, { secret: 'sah_fa' }, { sfx: 'chime' }] } },
      SOUL([EN('A piano with a missing key still knows the whole song. It keeps one note to itself.')])],
    npcs: [
      { id: 'N1375', name: 'The Metronome', at: [4, 19], look: H({ t: 'tall', head: 'clock', body: 'stick', c: ['#6a4a2a', '#4a2a1a', '#e8d8b0', '#1a1a1a'] }), behavior: 'static', solid: true,
        lines: [EN('Tok. Tok. Tok.'), EN('Walk on the tok. Between the toks, the piano is listening.'), EN('A missing note is still a beat. Count it.')] },
      { id: 'N1376', name: 'A Felt Hammer', at: [27, 8], look: H({ t: 'tall', head: 'square', body: 'stick', c: ['#a03030', '#802020', '#c84040', '#000000'], eyes: 'none' }), behavior: 'static', solid: true,
        lines: ['A felt hammer, as tall as a door. It nods on every beat: tok, tok, tok.'] },
      { id: 'N1377', name: 'A Speck of Dust', look: { t: 'jelly', c: ['rgba(255,240,200,0.7)'], h: 5, glow: '#fff0c0' }, light: 1, behavior: 'fly', radius: 5, speed: 0.4, solid: false,
        lines: ['A speck of dust, glowing in the dark of the piano. It has heard every lesson since 1971.'] }],
    mech: [{ type: 'rhythmWalk', zone: [1, 1, 28, 2], start: [14, 20], period: 1.2, window: 0.45, lineY: 17, done: { flag: 'sah_piano' },
      failText: 'The metronome stops. You moved between the toks. Back to the felt.',
      reward: [{ set: { sah_piano: true } }, { secret: 'sah_piano' }],
      winLines: ['You reach the top of the keys, every step on the beat. The metronome stops, satisfied.', 'Up here is the gap where the missing key lived.'] }],
    info: { summary: 'Inside the music-room piano: a floor of black and white keys, felt hammers, humming strings.',
      rules: ['Leave the red felt and cross the keys to the top, moving only on the beat (the heartbeat thump). Moving between beats sends you back to the felt.',
        'At the top, face the gap and use The Missing Key (E213): the skipped note sounds at last.'],
      lore: 'The note the class song always left out.' } });

  /* W256 — The Last Stop */
  S({ id: 'W256', name: 'The Last Stop', depth: 3, tier: 'hard', secretLevel: 3, outdoor: true,
    back: 'W248', backLook: 'door', backOpt: { style: 'metal', c: ['#e0c040'] }, backLabel: 'back onto the bus', backAt: [3, 14],
    map: (function () { var g = K.grid(44, 24, ' '); g.box(0, 0, 44, 24, 'f', '.'); g.rect(1, 12, 42, 5, ','); g.rect(15, 1, 14, 11, ':'); return g.rows(); })(),
    look: { floor: { p: 'grass', c: ['#2a3a2a', '#24342a', '#304030'] }, floor2: { p: 'asphalt', c: ['#2a2a30'] }, floor3: { p: 'concrete', c: ['#5a5a5e', '#4a4a4e'] } },
    style: { sky: ['#0a1018', '#1a2430'] }, music: 'laststop', amb: { type: 'rain', vol: 0.08 }, dark: 0.5, weather: { rain: true }, extra: { noFurnish: true },
    doors: [{ to: 'W259', at: [22, 22], arrive: 'toW256', look: 'gate', opt: { c: ['#5a5a5a'] }, cond: { flag: 'sah_wait' }, label: 'the gate in the field fence' }],
    decor: [
      { look: 'bench', at: [21, 3], lines: ['The bench in the shelter. Two dry patches on it, side by side.'] },
      { look: 'poster', at: [25, 2], lines: ['The timetable. Every single bus says 22:00.', 'The last line says: “when you’re ready”.'] },
      { look: 'streetlamp', at: [8, 10], lines: ['A streetlamp. Its light falls in a perfect circle, and the rain only exists inside it.'] },
      { look: 'streetlamp', at: [36, 10], lines: ['A streetlamp. Under it, the rain is falling more slowly, as if it were tired too.'] },
      { look: 'puddle', at: [12, 14], solid: false, lines: ['A puddle. In it, the bus is still there, windows lit, going round and round.'] },
      { look: 'puddle', at: [31, 15], solid: false, lines: ['A puddle with a bus ticket floating in it, face down.'] },
      { look: 'telepole', at: [38, 5], lines: ['A telegraph pole. A lost-cat poster, years old: “answers to her name”.'] }],
    signs: [{ at: [17, 9], lines: [EN('Stay under the umbrella. Step when it steps.')] }],
    npcs: [
      { id: 'N1380', name: 'Someone with an Umbrella', at: [21, 6], look: H({ t: 'old', hairStyle: 'bun', hair: '#d8d8d8', body: 'robe', c: ['#c8b8a8', '#a89888', '#e0c0a0', '#2a2a2a'], acc: 'umbrella' }),
        behavior: 'static', solid: true,
        lines: ['An old woman with an umbrella, looking for one face in the windows of buses that don’t come.',
          { if: { flag: 'sah_bus' }, seq: ['She sees you. She lifts the umbrella a little, to make room.', KS('비 오네. 우산 같이 쓰자.', 'It’s raining. Let’s share the umbrella.'),
            KS('늦었지? 괜찮아. 할머니는 기다리는 거 잘해.', 'Late, are you? It’s all right. Grandma is good at waiting.')] }] },
      { id: 'N1381', name: 'A Wet Cat', at: [24, 4], look: { t: 'cat', c: ['#3a3a3a'], h: 9 }, behavior: 'static', solid: true,
        lines: ['A wet cat sits in the shelter beside you, as if someone had told it to keep you company.'] }],
    mech: [{ type: 'followShadow', center: [21, 6], r: 2.5, speed: 0.22, secs: 18, done: { flag: 'sah_wait' },
      breakLine: 'The rain finds you again. Stay under the umbrella.',
      reward: [{ set: { sah_wait: true } }, { secret: 'sah_wait' }],
      winLines: ['For a long time you stay under the umbrella, step for step. Nobody says anything. Nobody has to.', 'When the rain eases off, the gate in the field fence is standing open.'] }],
    place: [SOUL([EN('The last stop is the only one where everybody gets off. Nobody is left on the bus.')])],
    info: { summary: 'The end of the bus line: a shelter in the rain, a road, a fence, and an old woman with an umbrella.',
      rules: ['Reached on the ten o’clock bus with the Bus Pass, or through the gate after laps on the sports field.',
        'A patch of dry ground (the umbrella’s shadow) circles slowly round the old woman: stay inside it for about eighteen seconds.',
        'Then the gate in the field fence opens onto Sports Day at Night (W259). If you pressed the bus bell at the right stop, she speaks to you.'],
      lore: 'Somebody who always waited at the bus stop on rainy days.' } });

  /* W257 — Parents’ Evening */
  var COATS = ['A small chair with a big coat on it. The coat is listening hard.', 'A small chair. On it, a handbag held very straight, as if by someone proud.',
    'A small chair with a scarf folded on it. Whoever owns it is nodding, somewhere.'];
  var CHAIRS = [];
  [10, 13, 16].forEach(function (y, j) { [5, 9, 17, 21].forEach(function (x, i) { CHAIRS.push({ look: 'chair', at: [x, y], lines: [COATS[(i + j) % 3]] }); }); });
  S({ id: 'W257', name: 'Parents’ Evening', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W241', backLook: 'door', backOpt: { style: 'wood', c: ['#e8c870'] }, backLabel: 'back into the dark corridor', backAt: [26, 10], backArrive: [62, 5],
    map: (function () { var g = K.grid(28, 20, ' '); g.box(0, 0, 28, 20, '#', '.'); g.rect(1, 1, 26, 5, ','); return g.rows(); })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor: { p: 'wood', c: ['#9a7a58', '#8a6a48', '#aa8a68'] }, floor2: { p: 'tile', c: ['#c8c4b8', '#a8a498'] } }),
    style: { tallWalls: true }, music: 'parentsevening', amb: { type: 'whispers', vol: 0.04 }, dark: 0.12,
    doors: [{ to: 'W246', at: [1, 10], look: 'door', opt: { style: 'wood', c: ['#6a5a4a'] }, label: 'the classroom next door' }],
    decor: CHAIRS.concat([
      { id: 'teacherdesk', look: 'desk', at: [13, 4], lines: ['The teacher’s desk, a pile of report cards on it.'] },
      { id: 'mumchair', look: 'chair', at: [13, 6], lines: ['An empty small chair in front of the desk. A label on the back: her surname, misspelt.'],
        listen: [{ match: ['mum', 'mom', 'mummy', 'mommy', 'mother', 'mama', '엄마', 'eomma'],
          lines: ['Down the corridor: hurried footsteps, a voice out of breath.', KS('죄송합니다, 선생님… 오늘 야간 근무라서…', 'I’m so sorry, Miss… I’m on nights tonight…'),
            'The footsteps go away. On the chair now: a coat that smells of the hospital.', 'As if she had been here for a moment, after all.'], do: [{ secret: 'sah_mumcoat' }] }] },
      { look: 'wallclock', at: [6, 1], lines: ['The clock: 19:40. Parents’ evening ends at eight.', 'Her mother starts work at nine. She would have had to leave by now anyway.'] },
      { look: 'blackboard', opt: { text: 'PARENTS’ EVENING' }, at: [21, 1], lines: ['On the board: PARENTS’ EVENING, 18:00 to 20:00. Please wait to be called.'] },
      { look: 'clipboard', at: [15, 4], lines: ['Her report card, on top of the pile. “Very quiet. Very able.”', '“We would love to hear her voice.”'] }]),
    npcs: [
      { id: 'N1385', name: 'The Teacher at Parents’ Evening', at: [13, 3], look: H({ t: 'adult', hairStyle: 'short', hair: '#5a4030', body: 'sweater', c: ['#7a6a8a', '#5a4a6a', '#e8d0b8', '#2a1a10'], acc: 'book' }),
        behavior: 'static', solid: true,
        lines: [EN('Come in. Sit down. The small chairs, I’m afraid. Everybody fits in the end.'),
          EN('Eight o’clock soon. Her chair is still empty. I keep her report on top, just in case.'),
          EN('Sit in for her, if you like. Answer for her. Somebody should.')] },
      { id: 'N1386', name: 'A Parent Who Is Almost There', at: [9, 11], look: H({ t: 'adult', body: 'coat', c: ['#5a5a5a', '#4a4a4a', '#e0c8b0', '#2a2a2a'], alpha: 0.35 }),
        behavior: 'static', solid: true,
        lines: ['A parent, almost transparent, nodding at everything said about somebody else’s child.', EN('He’s doing so well. We’re so proud of him.')] }],
    npcList: [{ id: 'N1386', at: [21, 14] }, { id: 'N1386', at: [5, 17] }],
    mech: [{ type: 'quiz', mark: 'teacherdesk', give: 'E218',
      intro: ['The teacher looks up at you, then at the empty chair.', { t: 'Ah. Somebody came. Shall we begin? Three questions.', lang: 'en', who: 'The Teacher' }],
      questions: [
        { q: 'She falls asleep in class. How does she sleep at home?', choices: ['Very well', 'With the light on', 'She doesn’t sleep'], right: 1 },
        { q: 'Where does she eat her lunch?', choices: ['In the canteen, with friends', 'On the stairs, on a landing', 'At home'], right: 1 },
        { q: 'Who is at home when she gets back from school?', choices: ['Nobody at all', 'Her mother, asleep', 'Her grandmother'], right: 1 }],
      failLine: 'The teacher writes something else down. “Perhaps next term,” she says, to nobody.',
      winLines: ['The teacher writes for a long time.', { t: 'Thank you. Nobody had ever told me any of that.', lang: 'en', who: 'The Teacher' },
        'She slides a permission slip across the desk, for the trip to the sea. The signature box is empty.',
        { t: 'Take it anyway. A slip nobody signed can’t be stopped. It goes under doors.', lang: 'en', who: 'The Teacher' }] }],
    place: [SOUL([EN('Every parents’ evening, the teacher kept one report card on top. Just in case.')])],
    info: { summary: 'The only lit classroom: parents’ evening, small chairs with coats on them, and one empty chair in front of the desk.',
      rules: ['Reached at the dark end of the corridor when the bedroom light is off, or through a chalk door drawn on the classroom board.',
        'At the desk, answer the teacher’s three questions for the child: with the light on; on the stairs; her mother, asleep. This gives the Unsigned Permission Slip (E218).',
        'Say “mum” near the empty chair.'],
      lore: 'The meeting her mother could never come to, because of the night shift.' } });

  /* W258 — The Class Photograph */
  S({ id: 'W258', name: 'The Class Photograph', depth: 3, tier: 'hard', secretLevel: 3, outdoor: true,
    back: 'W244', backLook: 'bed', backOpt: { c: ['#f0f0f0', '#c8d8e0'] }, backLabel: 'back to the bed behind the curtain', backAt: [20, 24],
    map: (function () {
      var g = K.grid(40, 26, ' '); g.box(0, 0, 40, 26, '#', '.'); g.rect(1, 1, 38, 4, '%');
      g.hline(1, 11, 6, 'x'); g.vline(11, 6, 24, 'x'); g.set(11, 7, '.'); g.hline(1, 10, 24, 'x');
      for (var y = 8, k = 0; y <= 22; y += 2, k++) { g.hline(1, 10, y, 'x'); g.set(k % 2 ? 10 : 1, y, '.'); }
      return g.rows();
    })(),
    look: { floor: { p: 'concrete', c: ['#a89880', '#988870'] }, wall: { p: 'brick', c: ['#7a6048', '#6a5038', '#4a3828'] }, wall2: { p: 'brick', c: ['#8a7058', '#7a6048', '#5a4838'] } },
    style: { renderer: 'sepia' }, music: 'classphoto', amb: { type: 'birds', vol: 0.03 }, dark: 0.2,
    doors: [{ to: 'W252', at: [38, 20], arrive: 'toW258', look: 'curtain', opt: { c: ['#8a8070'] }, label: 'out through the backdrop, into the art room' }],
    decor: [
      { look: 'spotlight', at: [30, 22], lines: ['A photographer’s lamp on a stand. It makes everyone squint the same way.'] },
      { look: 'flagpole', at: [36, 6], lines: ['The school flag, very still, as if holding its breath for the photo.'] },
      { look: 'photo', at: [34, 15], lines: ['The photograph on a stand, developing as you watch. There is a gap in the back row.',
        { if: { flag: 'sah_photo' }, t: 'The photograph, developed. In the back row, between two shoulders: a girl. Not smiling. There.' }] },
      { look: 'bench', at: [16, 22], lines: ['A bench for the ones waiting their turn. The varnish is rubbed off where knees bounced.'] }],
    signs: [{ at: [13, 7], lines: [EN('The front row is full of people you can’t see. Feel your way past them.')] }],
    npcs: [
      { id: 'N1390', name: 'The Photographer', at: [20, 20], look: H({ t: 'adult', head: 'box', body: 'coat', c: ['#2a2a2a', '#1a1a1a', '#3a3a3a', '#e0e0e0'] }), behavior: 'static', solid: true,
        lines: [EN('Everybody squeeze in. Small ones at the front, tall ones at the back.'), EN('There’s a gap. There’s always a gap. Somebody is always at the nurse’s.'),
          EN('Watch my hands. I’ll put you in your place.')] },
      { id: 'N1391', name: 'A Classmate Holding a Smile', at: [14, 9], look: H({ t: 'kid', hairStyle: 'short', hair: '#3a2a1a', body: 'uniform', c: ['#6a5a4a', '#5a4a3a', '#e0c8a8', '#2a1a10'], mouth: 'smile' }),
        behavior: 'static', solid: true,
        lines: ['A classmate frozen mid-smile. Smiling for a photo is a kind of holding your breath.', 'Two classmates with their arms round each other’s shoulders. There is no arm left over.'] },
      { id: 'N1392', name: 'A Girl with a Map on Her Arm', at: [2, 23], look: H({ t: 'kid', hairStyle: 'short', hair: '#1a1a1a', body: 'shirt', c: ['#3a6a8a', '#2a5a7a', '#c89068', '#1a1a1a'] }),
        behavior: 'static', solid: true,
        lines: [EN('I’m leaving next week. Don’t tell anyone.'),
          { seq: ['She shows you her arm: a map in blue felt-tip.', 'At the end of every road, a little square with a face in it.'], do: [{ secret: 'sah_nour' }] },
          EN('In the photo I’m pointing at the gap in the back row. So they’ll know somebody’s missing.')] }],
    npcList: [[16, 9], [18, 9], [22, 9], [24, 9], [26, 9], [15, 12], [17, 12], [19, 12], [21, 12], [23, 12], [25, 12]].map(function (p) { return { id: 'N1391', at: p }; }),
    mech: [{ type: 'dirSequence', ent: 'N1390', seq: ['left', 'left', 'up', 'right', 'down'], dist: 6, done: { flag: 'sah_photo' },
      reward: [{ set: { sah_photo: true } }, { secret: 'sah_photo' }],
      winLines: ['“Perfect. Hold it.” A flash, like a whole summer at once.', 'The photograph develops around you. In the back row, between two shoulders, there is a girl now.', 'She is not smiling. She is there.'] }],
    place: [SOUL([EN('Photo day. She was lying down at the nurse’s. They said they’d add her in a little circle. They never did.')])],
    info: { summary: 'Inside the class photograph, in sepia: the school front, two rows of classmates, a gap in the back row.',
      rules: ['Stand near the photographer and copy his hands: step left, left, up, right, down. The photograph then develops with her in it.',
        'On the left, the “front row” is a maze of invisible walls (people you can’t see). Feel your way through the zigzag to find the girl with a map on her arm.',
        'Reached through the bed behind the nurse’s curtain, or through the backdrop of the art room.'],
      lore: 'The photo taken on the day she was at the nurse’s, and the friend who pointed at the gap.' } });

  /* W259 — Sports Day at Night */
  S({ id: 'W259', name: 'Sports Day at Night', depth: 3, tier: 'hard', secretLevel: 3, outdoor: true,
    back: 'W243', backLook: 'door', backOpt: { style: 'metal', c: ['#c03030'] }, backLabel: 'back through the fire exit, into the gym', backAt: [25, 34],
    map: (function () {
      var g = K.grid(50, 36, ' '); g.box(0, 0, 50, 36, 'f', '.');
      g.ellipse(24.5, 17.5, 20, 13, ','); g.ellipse(24.5, 17.5, 15, 8.5, '.'); g.ellipse(24.5, 17.5, 12, 6, '^');
      return g.rows();
    })(),
    look: { floor: { p: 'grass', c: ['#2a4a2a', '#24402a', '#305430'] }, floor2: { p: 'dirt', c: ['#8a4a3a', '#7a3a2a', '#9a5a4a'] } },
    tall: { '^': { look: 'bush', opt: { c: ['#1a3a20', '#143018'] } } },
    style: { stars: true, sky: ['#060a18', '#141c34'] }, music: 'sportsnight', amb: { type: 'crickets', vol: 0.05 }, dark: 0.45, weather: { fireflies: true },
    doors: [
      { to: 'W245', at: [2, 17], arrive: 'toW259', look: 'vitrine', opt: { c: ['#d8b850'] }, label: 'the back of the trophy cabinet' },
      { to: 'W256', at: [47, 17], arrive: 'toW259', look: 'gate', opt: { c: ['#5a5a5a'] }, cond: { tempGte: { sah_laps: 12 } }, label: 'the gate onto the road, where the bus line ends' }],
    decor: [
      { look: 'banner', at: [24, 1], lines: ['Bunting across the field: little triangles in every colour, flapping without wind.'] },
      { look: 'pedestal', at: [40, 31], lines: ['The podium. The third step is worn smooth by somebody who only ever came third, and was glad.'] },
      { look: 'pedestal', at: [42, 31], lines: ['The podium. The first step. Nobody has ever stood on it at night.'] },
      { look: 'sandbox', at: [6, 31], lines: ['The long-jump pit. In the sand, one footprint, a very long way from the board.'] },
      { look: 'spotlight', at: [3, 3], lines: ['A floodlight, off. It stays off so the stars can watch instead.'] },
      { look: 'bench', at: [10, 2], lines: ['A bench with a sign on it: EXCUSED. It has been sat on a lot.'] }],
    place: [{ id: 'startline', type: 'decor', at: [24, 6], look: 'chalkmark', solid: false, lines: ['The starting line, freshly painted. Nobody has crossed it yet tonight.'],
        onEffect: { E214: [{ lines: ['You blow the whistle.', 'Shapes of chalk dust burst off the line and run, all of them, one whole lap.', 'At the end they stop and wait, all together, until you have crossed it too.'] }, { secret: 'sah_race' }] } },
      SOUL([EN('On sports day she had a note from the nurse. She watched from the window. She’d have come third.')])],
    npcs: [
      { id: 'N1395', name: 'The Starter', at: [21, 3], look: H({ t: 'adult', body: 'shirt', c: ['#e0e0e0', '#c0c0c0', '#e0c0a0', '#1a1a1a'], hat: 'cap', hatColor: '#c03030', acc: 'flag' }),
        behavior: 'static', solid: true,
        lines: [EN('On your marks. Get set.'), 'He waits, flag raised. He has been waiting for “go” since the morning.',
          EN('Relay, three laps. Nobody to pass the baton to? Then you carry it the whole way. That’s allowed.'),
          { if: { tempGte: { sah_laps: 12 } }, t: 'He lowers the flag. On the far side of the field, the gate onto the road is open.' }],
        reacts: { E214: { lines: ['He jumps at the whistle, laughs, and drops his flag.', EN('Go!')] } } },
      { id: 'N1396', name: 'A Runner Made of Chalk Dust', count: 3, look: ghost('rgba(240,240,230,0.5)', 18), behavior: 'wander', radius: 5, speed: 2, solid: false,
        lines: ['A runner made of chalk dust, jogging on the spot, waiting for the whistle.'] },
      { id: 'N1397', name: 'A Mother Cheering for Someone Else', at: [36, 32], look: H({ t: 'adult', hairStyle: 'long', hair: '#4a3020', body: 'coat', c: ['#8a6a5a', '#6a4a3a', '#e8c8a8', '#2a1a10'], alpha: 0.55 }),
        behavior: 'static', solid: true,
        lines: [EN('Go on, sweetheart! Go on!'), 'She is cheering for someone in another lane. For a moment you pretend it is you.', 'She doesn’t mind. She doesn’t know.'] }],
    mech: [{ type: 'laps', center: [24.5, 17.5], key: 'sah_laps' }],
    info: { summary: 'The school playing field at night: a red running track round a dark hedge, bunting, a podium, no crowd.',
      rules: ['Run three full laps of the track (round the hedge in the middle): the gate on the right then opens onto The Last Stop (W256).',
        'With the PE Whistle (E214), blow it at the starting line.',
        'Reached through the gym’s fire exit (with the whistle), the back of the trophy cabinet, or the gate at the last stop.'],
      lore: 'The sports day she watched from the nurse’s window.' } });

  /* W260 — The Assembly for One */
  var SEATS = ['In this chair: a caretaker’s cap, turned round and round in two hands.', 'In this chair: a nurse’s cardigan, folded on the seat.',
    'In this chair: a conductor’s baton, laid across the knees of nobody.', 'In this chair: a bus driver’s gloves, one finger still bent round a wheel.',
    'In this chair: a crossing-patrol sign, leaning, like someone tired after a long day.', 'In this chair: a hall monitor’s badge, polished.',
    'An empty chair. It was saved for someone. It still is.'];
  var HALL = [];
  [11, 15, 19].forEach(function (y, j) { [7, 11, 15, 21, 25, 29].forEach(function (x, i) { HALL.push({ look: 'chair', at: [x, y], lines: [SEATS[(i + j * 6) % SEATS.length]] }); }); });
  S({ id: 'W260', name: 'The Assembly for One', depth: 3, tier: 'hard', secretLevel: 3,
    back: 'W249', backLook: 'door', backOpt: { style: 'wood', c: ['#c8a050'] }, backLabel: 'back to the principal’s office', backAt: [18, 24],
    map: (function () { var g = K.grid(36, 26, ' '); g.box(0, 0, 36, 26, '#', '.'); g.rect(1, 1, 34, 5, ','); g.hline(1, 34, 6, '#'); g.set(5, 6, 's'); g.set(30, 6, 's'); return g.rows(); })(),
    look: Object.assign({}, NIGHTSCHOOL, { floor: { p: 'wood', c: ['#8a6a48', '#7a5a3a', '#9a7a58'] }, floor2: { p: 'plank', c: ['#6a4a2a', '#5a3a1a'] } }),
    style: { tallWalls: true }, music: 'assembly', amb: { type: 'crowd', vol: 0.02 }, dark: 0.3,
    doors: [{ to: 'WAKE', at: [34, 13], look: 'door', opt: { style: 'glass', c: ['#f0e8c8'] }, cond: { flag: 'sah_assembly' }, label: 'the hall doors, open onto the morning' }],
    decor: HALL.concat([
      { look: 'pedestal', opt: { c: ['#8a6a48'] }, at: [17, 1], lines: ['The lectern. On it, a trophy shaped like an open hand.', 'The plate has been engraved again: your name, all of it. Under it, “for staying”.'] },
      { look: 'banner', at: [17, 7], lines: ['A banner below the stage: WELL DONE EVERYONE. Somebody has added, in marker: “and you”.'] },
      { look: 'spotlight', at: [2, 7], lines: ['A spotlight, aimed at the lectern. For once, someone might stand in it.'] }]),
    signs: [{ at: [18, 21], lines: [EN('Go up. Take the microphone. The stage is yours tonight.')] }],
    npcs: [
      { id: 'N1398', name: 'The Night Caretaker', at: [18, 9], look: CARETAKER, behavior: 'static', solid: true,
        lines: [EN('Told you they’d call it in the end. Took them long enough.'), EN('I left the corridor unlocked. I always do. Somebody might still be in it.'),
          { if: { secret: 'sah_fa' }, t: 'He hums the class song under his breath, all of it, the missing note too.' }] },
      { id: 'N1399', name: 'Everyone Who Stayed', at: [9, 12], look: ghost('rgba(230,220,200,0.45)', 20), behavior: 'static', solid: false,
        lines: ['A shape in a chair, clapping slowly. It doesn’t know you. It claps anyway.', 'Someone in the third row is crying a little and pretending it’s hay fever.'] }],
    npcList: [[13, 16], [23, 12], [27, 16], [9, 20], [23, 20]].map(function (p) { return { id: 'N1399', at: p }; }),
    mech: [{ type: 'reach', zone: [15, 2, 20, 3], cond: { equipped: 'E217' }, done: { flag: 'sah_assembly' },
      failLine: 'You step up to the lectern. Without the microphone, nobody at the back will hear.',
      reward: [{ set: { sah_assembly: true } }, { secret: 'sah_assembly' }],
      winLines: ['You stand at the lectern with the microphone. The hall goes quiet, the good kind of quiet.', 'You don’t say much. A word, perhaps two. Every chair in the hall hears it.',
        'Somewhere far off, the music-room piano plays the class song, all of it.', 'Behind you, the hall doors open onto a pale light. Morning.'] }],
    place: [SOUL([EN('An assembly for one is still an assembly. Somebody set out all the chairs.')])],
    info: { summary: 'The assembly hall after her name was called: rows of chairs holding the things of everyone who noticed her.',
      rules: ['Only opens once the register has been answered at the Principal’s Microphone (W249).',
        'Climb onto the stage and stand at the lectern with The Principal’s Microphone (E217) equipped.',
        'The hall doors then open onto the morning: they wake you up.'],
      lore: 'Everyone who stayed: the caretaker, the nurse, the driver, the crossing patrol. An assembly for one.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
