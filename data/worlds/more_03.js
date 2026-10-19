/* =========================================================================
 *  MORE (03) — puzzles and secrets added to existing worlds W044–W090:
 *  the fields and the barn, the rain street and the rooftops, the screens,
 *  the stairs and the cinema, the hagwon, the metro and the apartments,
 *  the North (parade, school, fields, portraits, monument, border, bridge),
 *  the depot, the clocks and track zero, lost property, the clouds, the
 *  salt, the mirrors, the curtains, the lighthouse, the lounge, the sea.
 *  Small through-lines: a name that crosses the border (W077 → W078),
 *  Chol-i who is not on the register (W073, W075), hours won back.
 *  NPC ids N2140–N2145 · flags, temps and secret keys prefixed m3_.
 *  Displayed lines are kept under 110 characters.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, MORE = YN.kit.more;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t) { return { t: t, lang: 'en' }; }
  /* a conditional line, and a line that acts (once) */
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  function DO(l, acts) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.do = acts; return o; }
  /* several lines under the same condition */
  function IFS(c, ls) { return ls.map(function (l) { return IF(c, l); }); }
  function ids(prefix, n) { var a = []; for (var i = 1; i <= n; i++) a.push(prefix + i); return a; }

  /* ---------------------------------------------------------------
   *  W044 — The Scarecrow Field
   *  Secret (listen): a child-sized scarecrow waits to be called in.
   * --------------------------------------------------------------- */
  var CALLED = { flag: 'm3_w044_called' }, UNCALLED = { notFlag: 'm3_w044_called' };
  MORE('W044', {
    place: [{ id: 'm3_stake', type: 'decor', at: 'random-hidden', look: 'scarecrow', lookIf: [{ cond: CALLED, look: 'stump' }],
      lines: IFS(UNCALLED, ['The last scarecrow, out against the hedge. It is smaller than the others: the size of a child.',
        'It faces the gate instead of the centre, as if it were waiting to be fetched.',
        'A label is safety-pinned to its coat, in a grown-up’s capitals: “STAY HERE UNTIL SOMEONE CALLS YOU IN.”'])
        .concat(IFS(CALLED, ['An empty stake. The little coat lies folded on the stubble beside it, buttons up,',
          'the way you fold things when you have been told to tidy up before you go.'])),
      listen: [{ if: UNCALLED, match: ['come in', 'come home', 'come inside', 'home time', 'time to go home', 'dinner', 'game over', 'you can go', '들어와', '밥 먹어', '집에 와', '집에 가자'],
        do: [{ set: { m3_w044_called: true } }, { secret: 'm3_called_in' }, { sfx: 'reveal' }, { reeval: true }],
        lines: ['The little scarecrow lowers its arms, very slowly, as if they had been aching for years.',
          'It climbs down from its stake and folds its coat on the stubble.', 'Then it walks off towards the barn without looking back.',
          'All across the field, the other scarecrows turn their heads to watch it go.'] }] }],
    rules: ['Secret: against the hedge at the edge of the field, a child-sized scarecrow wears a label: “stay here until someone calls you in”. Stand beside it and call it in out loud (“come in”, “come home”, “dinner”, “들어와”…): it climbs down and goes home.']
  });

  /* ---------------------------------------------------------------
   *  W045 — The Barn
   *  Secret (fake wall + hidden room): behind the plank that says
   *  NEXT YEAR, the summer holiday that never happened.
   * --------------------------------------------------------------- */
  MORE('W045', {
    post: function (rows) {
      rows = rows.slice(); // a small room added beyond the east wall (x 26–31, y 5–12)
      rows[5] += '######'; rows[12] += '######';
      for (var y = 6; y <= 11; y++) rows[y] += '.....#';
      return rows;
    },
    fakeWalls: [[25, 8]],
    place: [
      { id: 'm3_newplank', type: 'decor', at: [24, 9], look: 'plank', solid: false, lines: ['One plank of the east wall is newer than the others, and painted in a hurry.',
        'Two words have been carved into it with a penknife, at a child’s height: NEXT YEAR.',
        'If you put your ear to the wall just above it, the barn on the other side is warmer.', 'It smells faintly of sun cream.'] },
      { id: 'm3_summercal', type: 'decor', at: [27, 6], look: 'calendar', lines: ['A farm calendar for one August. Every Saturday has the sea drawn on it in blue crayon.',
        'Across the top, in a man’s quick writing: “next year, promise”.'] },
      { id: 'm3_packedcase', type: 'decor', at: [30, 6], look: 'suitcase', lines: ['A little suitcase, packed and buckled: a swimming costume, a bucket and spade,',
        'and a sunhat with the price still on it. It has been ready to go for years.'] },
      { id: 'm3_augustapples', type: 'decor', at: [26, 11], look: 'crate', lines: ['A crate of apples gone soft and sweet. On every one, someone has written a date in marker.',
        'All of the dates are in August.'] },
      { id: 'm3_tractorphoto', type: 'decor', at: [30, 10], look: 'photo', lines: ['A photograph pinned to the post: a man in a straw hat lifting a girl onto a tractor seat.',
        'His face is not in the picture, the way the farmer’s face is not on his head.', 'Only the hat, and the hands holding on.',
        DO('On the back, in pencil: “our summer — the one we didn’t have”.', [{ secret: 'm3_next_year' }, { collect: 'photos' }])] }],
    rules: ['Secret: one plank of the barn’s east wall says NEXT YEAR. The wall just above it can be walked through: behind it, a hidden room keeps the country holiday that never happened (and a photograph for the album).']
  });

  /* ---------------------------------------------------------------
   *  W047 — The Press
   *  Secret (listen): say the pressed word into the empty barrel.
   * --------------------------------------------------------------- */
  var FLAT = { flag: 'm3_w047_flat' };
  MORE('W047', {
    place: [
      { id: 'm3_flatword', type: 'decor', at: [19, 1], look: 'frame', lines: ['A frame on the wall. Pressed inside, instead of a flower, a single word.',
        'It has been pressed so long and so hard that it has gone as thin as tissue. You can just read it: “fine”.'] },
      { id: 'm3_hollow', type: 'decor', at: 'random-hidden', look: 'barrel',
        lines: IFS({ notFlag: 'm3_w047_flat' }, ['An empty barrel lying on its side in a corner, open at one end like an ear.',
          'The staves inside are stained the colour of Sunday juice. When you lean close, it breathes out.'])
          .concat([IF(FLAT, 'The empty barrel. It is quiet now. It has given back what it was keeping.')]),
        listen: [{ if: { notFlag: 'm3_w047_flat' }, match: ['fine', 'all right', 'alright', 'okay', '괜찮아', '괜찮아요', '일없습니다'],
          do: [{ set: { m3_w047_flat: true } }, { secret: 'm3_under_fine' }, { collect: 'pages' }, { reeval: true }],
          lines: ['You say it into the barrel. It comes back older, then older again, flatter each time,', 'until the word wears right through, like a flower pressed too long.',
            'Behind it, at the bottom of the barrel, there was something else all along. A woman’s voice, very tired:', KS('엄마, 미안해. 자주 못 가서.', 'Mum, I’m sorry. For not coming more often.'),
            'Pressed flat against the staves where the voice had been, a page comes away in your hand.'] }] }],
    rules: ['Secret: a framed word on the wall says “fine”. Say it (“fine”, “all right”, “괜찮아”…) into the empty barrel lying in a corner of the cellar: the word wears through, and what it was hiding comes back (with a page for the collection).']
  });

  /* ---------------------------------------------------------------
   *  W051 — The Street in the Rain (vast)
   *  Secret (an inhabitant who reacts): walk a waiting girl home
   *  under an umbrella.
   * --------------------------------------------------------------- */
  var UMB = { lines: ['You open the umbrella and hold it over her, although it is not raining in the doorway.', KS('…엄마는?', '…Where’s Mum?'),
    'You have no answer. She steps out under the umbrella with you anyway.', 'The two of you walk a few steps into the rain together.',
    'Then she runs on ahead, home, her bag bouncing on her back.', 'The rain on the umbrella sounds like someone humming.'],
    do: [{ set: { m3_w051_walked: true } }, { secret: 'm3_shared_umbrella' }, { collect: 'photos' }, { reeval: true }] };
  MORE('W051', {
    npcs: [{ id: 'N2140', name: 'A Girl in a Doorway', look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#4a5a7a', '#3a4a6a', '#f0d0b8', '#1a1a1a'], h: 17, acc: 'bag' }),
      behavior: 'static', at: 'random-hidden', solid: true, appear: { notFlag: 'm3_w051_walked' },
      lines: [KS('엄마가 우산 가지고 온댔어. 여기서 기다리래.', 'Mum said she’d bring an umbrella. She told me to wait here.'), KS('…조금만 더 기다리면 올 거야.', '…If I wait a bit longer, she’ll come.'),
        'She holds her school bag over her head, although she is standing out of the rain.'],
      reacts: { E06: UMB, E110: UMB, E231: UMB, E249: UMB },
      hears: [{ match: ['let s go', 'lets go', 'come with me', 'go home', 'come on', '가자', '집에 가자', '같이 가자'], lines: [KS('우산 없잖아. …엄마가 올 거야.', 'You haven’t got an umbrella. …Mum will come.')] }] }],
    rules: ['Secret: somewhere in a dead end of the street, a schoolgirl shelters in a doorway, waiting for a mother who promised an umbrella. Equip an umbrella (Umbrella, Clear Umbrella, Forgotten Umbrella or Red Umbrella), face her and use it: you walk her home (and a photograph for the album). Asking her to come without one is not enough.']
  });

  /* ---------------------------------------------------------------
   *  W052 — The Roof of the World
   *  Secret (bedroom light off): a star that is a window, upside down.
   * --------------------------------------------------------------- */
  MORE('W052', {
    place: [
      { id: 'm3_telescope', type: 'decor', at: [16, 3], look: 'telescope', lines: ['An old brass telescope bolted to the northern rim, pointing straight up.',
        'On the tube, a label in a child’s capitals: “ONLY WORKS WHEN THE LIGHT AT HOME IS OFF.”',
        IF({ dark: false }, 'You look through it anyway: stars, washed out by the glare of a lit bedroom far below.')] },
      { id: 'm3_starwindow', type: 'decor', at: [17, 3], look: 'glint', solid: false, light: 1.2, cond: { dark: true }, lines: ['With the light off at home, the stars come down close enough to read.',
        'One of them is a window, upside down. In it, a girl does her homework alone under a lamp, very late.',
        DO('She looks up. For a moment you are looking at each other through the wrong end of the sky.', [{ secret: 'm3_upside_window' }])] }],
    rules: ['Secret: a telescope on the northern rim “only works when the light at home is off”. Go to sleep with the bedroom light off: beside it, one of the stars has come down, an upside-down window you can look into.']
  });

  /* ---------------------------------------------------------------
   *  W055 — The Television Shop
   *  Puzzle + secret (a remote, from across the room): the set that
   *  faces the wall plays a home video.
   * --------------------------------------------------------------- */
  var PLAYING = { flag: 'm3_w055_play' };
  MORE('W055', {
    place: [
      { id: 'm3_backtv', type: 'decor', at: [28, 10], look: 'tv',
        lines: IFS({ notFlag: 'm3_w055_play' }, ['A television turned to face the wall, its back to the shop, a price tag dangling.',
          'Its screen glows against the plaster. It is not for sale.', 'It is waiting for somebody to press play from across the room.'])
          .concat(IFS(PLAYING, ['The television has turned round by itself.', 'It plays the same home video over and over, very quietly, to nobody.'])) },
      { id: 'm3_vhs', type: 'decor', at: [28, 11], look: 'book', solid: false, cond: PLAYING, lines: ['A video cassette has slid out of the set, still warm.',
        'The label, in felt-tip: “J. — her 5th birthday — DO NOT TAPE OVER.”', 'On the screen above it: a cake with five candles, and a little girl in a paper crown.',
        'Behind the camera, a man’s voice begins a joke: “Knock knock…”',
        DO('The tape has been worn thin at exactly that place.', [{ secret: 'm3_birthday_tape' }])] }],
    mech: [{ type: 'gate', mark: 'm3_backtv', flag: 'm3_w055_play', dist: 4, events: ['remote'], text: 'Behind you, a television clicks round and starts to play.' }],
    rules: ['Puzzle and secret: against the right-hand wall, one television faces the plaster. Use a remote near it (Remote Control, Broken Remote, Television Snow): it turns round and plays a home video, and a cassette slides out.']
  });

  /* ---------------------------------------------------------------
   *  W058 — The Penrose Stairs
   *  Secret (laps): after twelve flights, a thirteenth step.
   * --------------------------------------------------------------- */
  MORE('W058', {
    place: [
      { id: 'm3_tally', type: 'decor', at: [12, 5], look: 'chalkmark', solid: false, flat: true, lines: ['Chalk marks on a step, in groups of four: IIII IIII IIII. Then nothing.',
        'Whoever was counting the flights stopped one short of finding out.'] },
      { id: 'm3_landing', type: 'decor', at: [20, 20], look: 'shoe', solid: false, cond: { tempGte: { penroseFlights: 12 } }, lines: ['A thirteenth step, wedged between two that were touching a moment ago.',
        'On it sits a child’s slipper, placed neatly, toe pointing down. Or up.', 'You have gone round enough times for the stairs to admit it: there is one step more than they show.',
        DO('It is where someone sat down once, and stopped pretending to be fine.', [{ secret: 'm3_thirteenth_step' }])] }],
    rules: ['Secret: chalk on a step counts three groups of four flights. Go round the square staircase three whole times (twelve flights) in one visit: a thirteenth step appears on the far flight, with a slipper on it.']
  });

  /* ---------------------------------------------------------------
   *  W060 — The Empty Cinema
   *  Secret (knock, then speak): the father’s joke, without its ending.
   * --------------------------------------------------------------- */
  MORE('W060', {
    place: [
      { id: 'm3_boothcard', type: 'decor', at: [15, 20], look: 'plaque', lines: ['A card pinned beside the projection booth, at the back of the hall: PROJECTIONIST — PLEASE KNOCK.',
        'Under it, in a child’s pencil, the beginning of a joke: “knock knock”.'] },
      { id: 'm3_booth', type: 'decor', at: [16, 20], look: 'door', lookOpt: { style: 'metal', c: ['#4a1a1a'] }, lines: ['The door of the projection booth.'],
        listen: [{ if: { all: [{ flag: 'm3_w060_who' }, { notFlag: 'm3_w060_reel' }] }, any: true,
          do: [{ fn: function (ctx) { var w = String(ctx.said || '').replace(/[.?!…]+$/, '').trim().slice(0, 24);
            YN.ui.dialog.queue([{ t: (w ? w.charAt(0).toUpperCase() + w.slice(1) : '…') + ' who?', lang: 'en', who: 'a voice behind the door' },
              { t: 'You wait for the rest of the joke. There is no rest.' }, { t: 'The projector clatters and the film runs off the end of its reel.' },
              { t: 'The booth door swings open a crack, by itself.' }]); } },
            { set: { m3_w060_reel: true } }, { secret: 'm3_no_punchline' }, { reeval: true }] }] },
      { id: 'm3_lastreel', type: 'decor', at: [17, 20], look: 'scraps', solid: false, cond: { flag: 'm3_w060_reel' }, lines: ['By the booth door, a short reel of film in a tin.',
        'The label, in felt-tip: “THE LAST ONE — WITH THE ENDING”.', 'You hold a strip up to the light. Every frame is the same: a man at a front door,',
        'a suitcase marked J., his mouth open on the end of a joke. There is no soundtrack. There never was.'] }],
    mech: [{ type: 'knock', mark: 'm3_booth', n: 2, within: 3, sfx: 'door_far', flag: 'm3_w060_who', done: { flag: 'm3_w060_who' },
      doneLine: { t: function () { return YN.save.flag('m3_w060_reel') ? 'The booth door stands open a crack. Inside, only the rewinding bench and the smell of warm film.' : 'Behind the door, someone is still waiting for you to say who is there.'; } },
      winLines: ['Two knocks. In the hall, the projector stops.', 'From inside the booth, a man’s voice, close to the door, playing along the way fathers do:', EN('Who’s there?')] }],
    rules: ['Secret: a card beside the projection booth (back of the hall) begins a knock-knock joke. Knock twice on the booth door; when the voice asks “Who’s there?”, answer anything out loud. It asks “… who?”, and the film runs out before the punchline: a reel is left by the door.']
  });

  /* ---------------------------------------------------------------
   *  W061 — The Evening Hagwon
   *  Secret (fake wall + hidden room): the nap room, closed until
   *  after the exam.
   * --------------------------------------------------------------- */
  MORE('W061', {
    post: function (rows) {
      rows = rows.slice(); // a small room beyond the back wall (x 25–34, y 21–26)
      var pad = new Array(26).join(' ');
      for (var y = 22; y <= 25; y++) rows[y] = pad + '#........#';
      rows[26] = pad + '##########';
      return rows;
    },
    fakeWalls: [[30, 21]],
    place: [
      { id: 'm3_radiator', type: 'decor', at: [29, 20], look: 'vent', lines: ['A radiator under the back wall, warm. The wall beside it is warm too,',
        'as if someone were breathing on the other side, slowly,', 'the way people breathe when they are allowed to sleep.'] },
      { id: 'm3_napsign', type: 'decor', at: [27, 22], look: 'poster', lines: ['A sign: NAP ROOM — 20 MINUTES. Under it, a newer one: CLOSED UNTIL AFTER THE EXAM.',
        'Somebody has drawn a little moon on it in correction fluid.'] },
      { id: 'm3_mats', type: 'decor', at: [26, 25], look: 'blanketlump', lines: ['Rolled-up sleeping mats, one per pupil, each with a name tag. Not one of them has ever been unrolled.'] },
      { id: 'm3_noalarm', type: 'decor', at: [32, 22], look: 'wallclock', lines: ['A clock with no hands at all. In here, nobody wakes you.'] },
      { id: 'm3_onemat', type: 'decor', at: [31, 24], look: 'blanketlump', solid: false, lines: ['One mat has been unrolled, exactly your size.',
        'The pillow keeps the dent of a head that lay here for twenty minutes, once, and was not marked down for it.',
        'Under the pillow, a paper crane folded from an exam paper. On one wing you can read the mark: 100.',
        DO('On the other wing, in pencil: “sleep first”.', [{ secret: 'm3_nap_room' }, { collect: 'cranes' }])] }],
    rules: ['Secret: in the bottom right of the classroom, the back wall beside the warm radiator can be walked through. Behind it, a nap room “closed until after the exam”, with a paper crane under one pillow.']
  });

  /* ---------------------------------------------------------------
   *  W064 — The Rush-Hour Metro
   *  Secret (early in the dream only): the on-time window.
   * --------------------------------------------------------------- */
  MORE('W064', {
    place: [
      { id: 'm3_sixclock', type: 'decor', at: [5, 1], look: 'wallclock', lines: ['A station clock stopped at six in the evening, the hour nobody here ever goes home.',
        'Taped under it, a note in neat office capitals:', '“ON-TIME WINDOW: FAR END. EARLY IN THE NIGHT ONLY. DON’T TELL THE OTHERS.”'] },
      { id: 'm3_ontime', type: 'decor', at: [2, 1], look: 'window', light: 1.6, cond: { phase: 'opening' }, lines: ['A small lit window at the far end of the corridor, open only this early.',
        'Inside, a man in a suit has loosened his tie.', 'He is eating dinner at six o’clock with a girl in a school uniform.',
        'He is laughing at something she said.', KS('오늘은 칼퇴했어. 그래서 아빠가 데리러 갔지.', 'I left on time today. So Dad was the one who came to get you.'),
        DO('Behind you, the crowd has not noticed. It never notices the ones who go home.', [{ secret: 'm3_left_on_time' }])] }],
    rules: ['Secret: a clock stopped at six points to an “on-time window” at the far left end of the corridor. The window only shows early in the dream (its first part): a father having dinner with his daughter at six.']
  });

  /* ---------------------------------------------------------------
   *  W065 — The Identical Apartments
   *  Secret (answer the intercom): a light comes on in the middle flat.
   * --------------------------------------------------------------- */
  MORE('W065', {
    place: [
      { id: 'm3_stopclock', type: 'decor', at: [20, 12], look: 'wallclock', lines: ['A kitchen clock in the middle flat, stopped at five past midnight.',
        'In every identical flat the clocks have stopped at a different hour.', 'Only this one stopped after twelve, waiting for a key in the door.'] },
      { id: 'm3_coldrice', type: 'decor', at: [23, 14], look: 'table', light: 1.6, cond: { flag: 'm3_w065_home' }, lines: ['A low table in the middle flat, lit now.',
        'A bowl of rice under an upturned plate, to keep it warm. It is not warm any more.', 'A girl’s exercise book, open; a pencil; a dent in the page the shape of a cheek.',
        'Somebody fell asleep here waiting, and somebody else is only now coming home.',
        DO(KS('미란아, 아빠 왔다. …자니? 미안해.', 'Mi-ran, Dad’s home. …Asleep? I’m sorry.'), [{ secret: 'm3_rice_under_plate' }])] }],
    mech: [{ type: 'password', mark: 'effE62', dist: 3, words: ['it s me', 'its me', 'i m home', 'im home', 'i am home', 'i m back', 'im back', '나야', '저예요', '다녀왔습니다', '왔어'], flag: 'm3_w065_home',
      text: 'Somewhere in the block, behind one of the identical doors, a light comes on.' }],
    rules: ['Secret: at the intercom of 107동 1204호, when the tired voice asks “누구세요?” (who is it?), answer out loud (“it’s me”, “I’m home”, “나야”, “다녀왔습니다”…). A light comes on in the middle flat: a table where a girl fell asleep waiting.']
  });

  /* ---------------------------------------------------------------
   *  W068 — The Bridge of Messages
   *  Secret (Glowing Message equipped): a sticker at a child’s height.
   * --------------------------------------------------------------- */
  MORE('W068', {
    place: [{ id: 'm3_lowsticker', type: 'decor', at: [69, 8], look: 'plaque', solid: false, light: 1, cond: { equipped: 'E65' }, lines: ['With the glowing message on your shoulder, you notice what everybody walks past:',
      'low on the very last railing post, at a child’s height, a sticker. The handwriting is round and careful:',
      DO('“I read them all, and then I went home. The light was on. Thank you for writing them.”', [{ secret: 'm3_went_home' }])] }],
    rules: ['Secret: with the Glowing Message (E65) equipped, a small sticker appears low on the last railing post at the end of the bridge, left by someone who read every message and went home.']
  });

  /* ---------------------------------------------------------------
   *  W069 — The Screen Room
   *  Secret (revealing effect): the one window nobody covered.
   * --------------------------------------------------------------- */
  MORE('W069', {
    place: [{ id: 'm3_realwindow', type: 'decor', at: [26, 1], look: 'window', solid: false, hiddenUntilReveal: true,
      cond2: { fn: function () { var g = YN.game, m = g && g.rt && g.rt.findMark('m3_realwindow'); return !!(m && m.revealed); } },
      lines: ['Beside the last advert, a window that nobody covered with a screen. It only shows through glasses.',
        'Outside: the real night, with real windows in it, most of them dark.',
        DO('On this side of the glass, a small handprint in the condensation, at exactly your height, not yet dry.', [{ secret: 'm3_uncovered_window' }])] }],
    rules: ['Secret: one window of the Screen Room, top right beside the last advert, was never covered. It can only be seen (and looked through) after using a revealing effect nearby (Glasses, AR Glasses, Dead Pixel…).']
  });

  /* ---------------------------------------------------------------
   *  W071 — The Parade
   *  Secret (Mosaic Card equipped): the child who lowered her arms.
   * --------------------------------------------------------------- */
  MORE('W071', {
    place: [{ id: 'm3_lowered', type: 'decor', at: [31, 21], look: 'cardperson', solid: false, cond: { equipped: 'E68' }, lines: ['From inside the picture, with your own card held up, you can see what the coach cannot:',
      'in the middle of the square, one girl has lowered her arms. She is crying without a sound.',
      'Around her, the others hold their cards a little higher to cover the gap. The picture holds.',
      DO(KN('…팔이 아팠습니다. 그것뿐입니다.', '…My arms hurt. That is all.'), [{ secret: 'm3_lowered_arms' }])] }],
    rules: ['Secret: with the Mosaic Card (E68) equipped, a girl who has lowered her arms appears in the middle of the card square, just right of the central aisle.']
  });

  /* ---------------------------------------------------------------
   *  W073 — The School of the Parent
   *  Puzzle (corner): the boy who is not on the register.
   *  Secret: his desk, at the back, afterwards.
   * --------------------------------------------------------------- */
  MORE('W073', {
    npcs: [{ id: 'N2141', name: 'A Boy Who Is Not on the Register', look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#e8e8e0', '#c8c8c0', '#f0c8a0', '#1a1a1a'], h: 16, alpha: 0.7 }),
      behavior: 'flee', radius: 6, fleeDist: 5, speed: 2.6, at: [30, 19], solid: true, appear: { notFlag: 'm3_w073_choli' },
      lines: [KN('저는 없습니다. 출석부에도 없습니다.', 'I am not here. I am not on the register either.'), KN('잡지 마십시오. 잡히면 있게 됩니다.', 'Do not catch me. If you catch me, I will exist.'),
        { seq: ['He runs between the desks without a sound.', 'The girls go on reciting, as if the air beside them were empty.'] }] }],
    place: [
      { id: 'm3_register', type: 'decor', at: 'random-any', look: 'book', lines: ['The class register. Thirty names in neat rows.',
        'One line has been inked over so many times that the paper shines.', 'The ink is still wet: somebody keeps going over it.'] },
      { id: 'm3_lastdesk', type: 'decor', at: [32, 20], look: 'schooldesk', cond: { flag: 'm3_w073_choli' }, lines: ['A desk at the very back, in the corner, where nobody sits.',
        'Under the lid, carved small and deep: 철.', DO('Below it, carved much later by another hand, in a grown woman’s careful strokes:', [{ secret: 'm3_choli_desk' }]),
        KN('명희가 아직 찾고 있어.', 'Myong-hui is still looking for you.')] }],
    mech: [{ type: 'corner', ent: 'N2141', flag: 'm3_w073_choli', done: { flag: 'm3_w073_choli' }, reward: [{ secret: 'm3_choli_cornered' }],
      winLines: ['You have him in a corner, between a desk and the wall, and he stops running.', 'Up close he is only a boy of ten, with ink on his fingers and his collar done up wrong.',
        KN('…저를 봤습니까? 아무도 저를 안 봅니다.', '…You saw me? Nobody ever sees me.'), 'He points at the back corner of the classroom, where there is no desk.',
        'Then he is not there.'] }],
    rules: ['Puzzle: a boy nobody admits to (Chol-i) runs silently between the desks. Corner him against a wall or a desk so that he has nowhere left to run: he speaks, then vanishes.',
      'Secret: afterwards, a desk appears in the back right corner, with his name carved under the lid.']
  });

  /* ---------------------------------------------------------------
   *  W074 — The Collective Fields
   *  Puzzle (planting near a mark): one ear of real wheat.
   * --------------------------------------------------------------- */
  MORE('W074', {
    place: [
      { id: 'm3_collar', type: 'decor', at: 'random-any', look: 'scraps', solid: false, flat: true, lines: ['A child’s collar, unpicked, lying in a furrow. The stitches have been cut one by one.',
        'Whatever was sewn inside was meant to be planted wherever she ended up:', 'in earth that was really earth, at the edge of things.'] },
      { id: 'm3_realsoil', type: 'decor', at: 'random-hidden', look: 'scuff', solid: false, flat: true, lines: ['A square of dark, wet earth, tucked away at the edge of the painted furrows.',
        'It is the only soil in these fields that smells of anything.'] },
      { id: 'm3_ear', type: 'decor', at: { near: 'm3_realsoil' }, look: 'tuft', solid: false, cond: { flag: 'm3_w074_rooted' }, lines: ['One ear of wheat, real, heavy enough to bend.',
        'It grew in the time it took you to look away. When you touch it, a few warm grains fall into your palm.',
        DO('They are the first thing in these fields that is not a number.', [{ secret: 'm3_one_real_ear' }])] }],
    mech: [{ type: 'gate', mark: 'm3_realsoil', flag: 'm3_w074_rooted', dist: 2, events: ['planted'], text: 'Something real has taken root at the edge of the field.' }],
    rules: ['Puzzle: an unpicked collar in a furrow speaks of seeds sewn in to be planted. In a nook at the edge of the fields lies a square of real, dark earth: plant something right beside it (Sprout, Sunflower Seeds, Returning Pine Cone…). A real ear of wheat grows there.']
  });

  /* ---------------------------------------------------------------
   *  W075 — The Portrait Hall
   *  Puzzle (trail): curls of cut paper from the empty frame.
   *  Secret: the faces she kept.
   * --------------------------------------------------------------- */
  var KEPT = { flag: 'm3_w075_faces' };
  MORE('W075', {
    place: [
      { id: 'm3_emptyframe', type: 'decor', at: [16, 1], look: 'frame', lines: ['An empty frame, the only one with no portrait in it at all. On the brass plate: 철, and nothing else.',
        'Below it on the floor, tiny curls of cut paper,', 'as if someone had trimmed a face very carefully here and carried the pieces off across the hall.'] },
      { id: 'm3_cupboard', type: 'decor', at: [28, 18], look: 'commode',
        lines: [IF({ notFlag: 'm3_w075_faces' }, 'A low cupboard in the far corner, shut.'), IF({ notFlag: 'm3_w075_faces' }, 'The curator’s keys are the only thing about her that ever makes a sound.'),
          IF(KEPT, 'The cupboard in the corner stands open, very slightly,'), IF(KEPT, 'the way you leave a door for someone who may come back.')] },
      { id: 'm3_faces', type: 'decor', at: [27, 18], look: 'photo', solid: false, cond: KEPT, lines: ['Cut-out faces, hundreds of them, each folded into its own handkerchief and filed by name.',
        'Not one has been thrown away. On top, a boy of ten with ink on his fingers, and a note in a careful hand:',
        DO(KN('언젠가 다시 붙일 날을 위하여.', 'For the day they can be put back up.'), [{ secret: 'm3_kept_faces' }, { collect: 'photos' }])] }],
    mech: [{ type: 'trail', from: 'm3_emptyframe', to: 'm3_cupboard', slack: 1, lostLine: 'The curls of paper scatter. They gather again under the empty frame.', flag: 'm3_w075_faces', done: KEPT,
      winLines: ['You follow the curls of paper from the empty frame across the whole hall,', 'all the way to the far corner, without losing them once.',
        'The cupboard there was never locked. Only shut, gently, the way you close a door on someone asleep.'] }],
    rules: ['Puzzle: under the empty frame marked 철 (top wall), curls of cut paper lead away across the hall. Follow them without straying to the cupboard in the bottom right corner.',
      'Secret: inside, the curator has kept every face she cut out, each wrapped and filed by name (and a photograph for the album).']
  });

  /* ---------------------------------------------------------------
   *  W076 — The Great Monument
   *  Secret (flowers on a stone): the grave outside the shadow.
   * --------------------------------------------------------------- */
  var STONE = [{ if: { notFlag: 'm3_w076_flowers' }, set: { m3_w076_flowers: true }, secret: 'm3_unnamed_stone',
    lines: ['You kneel and leave your flowers on the little stone instead of at the giant’s feet.', 'Nobody stops you. Up on its plinth, the statue’s shadow falters in its turning, then goes on.',
      'Behind you, one of the visitors in black has seen. He bows to the little stone, too, very briefly.', KN('…어머니께서 좋아하셨을 겁니다.', '…Mother would have liked that.')] }, { reeval: true }];
  MORE('W076', {
    place: [
      { id: 'm3_stone', type: 'decor', at: [3, 22], look: 'rock', lines: IFS({ notFlag: 'm3_w076_flowers' }, ['A small stone at the far western edge of the esplanade, outside the statue’s shadow.',
        'No name, no flowers. Everyone walks past it on the way to lay theirs at the giant’s feet.']),
        onEffect: { E01: STONE, E100: STONE, E132: STONE, E166: STONE } },
      { id: 'm3_stoneflowers', type: 'decor', at: [3, 22], look: 'flowers', solid: false, cond: { flag: 'm3_w076_flowers' }, lines: ['The little stone at the edge has flowers on it now. Nobody else has noticed.',
        'That is all right. They were not for anybody else.'] }],
    rules: ['Secret: at the far western edge of the esplanade, outside the shadow, a small stone with no name. Face it and use a flower or a seed (Sprout, Sunflower Seeds, Dried Flower, Returning Pine Cone): the flowers stay on the stone instead of the statue.']
  });

  /* ---------------------------------------------------------------
   *  W077 — The Border
   *  Puzzle (say a name): the blank ribbon. Sets m3_w077_ribbon, which
   *  W078 answers.
   * --------------------------------------------------------------- */
  MORE('W077', {
    place: [
      { id: 'm3_ribbonline', type: 'decor', at: [40, 13], look: 'clothesline', lines: ['A line strung between the fence and a stake, heavy with ribbons, like washing.',
        'Each one has a name on it, written the way you write on something you will never see again.',
        IF({ notFlag: 'm3_w077_ribbon' }, 'The last ribbon is still blank. A pen hangs beside it on a string.'),
        IF({ notFlag: 'm3_w077_ribbon' }, 'Whoever ties these ribbons has never been able to write this one.')] },
      { id: 'm3_knot', type: 'decor', at: [41, 13], look: 'scraps', solid: false, cond: { flag: 'm3_w077_ribbon' }, lines: ['Where the blank ribbon hung, only its knot is left on the line, pulled tight,',
        'as if somebody on the far side had taken hold of the other end.'] }],
    mech: [{ type: 'sayTo', mark: 'm3_ribbonline', dist: 3, words: ['jae sik', 'jaesik', 'jae shik', '재식', '안재식', 'ahn jae sik'], flag: 'm3_w077_ribbon', done: { flag: 'm3_w077_ribbon' },
      wrong: 'The ribbon stays blank. It is waiting for one name only: the one she could never bring herself to write.', reward: [{ secret: 'm3_name_goes_north' }],
      winLines: ['You say the name. On the blank ribbon, in a nine-year-old girl’s handwriting, it appears: 재식.',
        'The wind turns north. The ribbon slips its knot and goes with it,', 'over the first fence, over the ditch, over the second fence, and on.',
        KS('…오빠한테 가는 거야?', '…Is it going to Big Brother?'), 'Behind you, the old woman at the fence has opened her eyes.'] }],
    rules: ['Puzzle: near the fence, a line of name ribbons ends with a blank one. Standing beside it, say the name of the brother the old woman keeps calling for (Jae-sik, 재식, the boy counting planks on the bridge): the name writes itself and the ribbon flies north. It reaches the Bridge of No Return.']
  });

  /* ---------------------------------------------------------------
   *  W078 — The Bridge of No Return
   *  Puzzle (reach with the shoe): Jae-sik recognises the left shoe.
   *  Secret: the ribbon from W077, caught on the railing.
   * --------------------------------------------------------------- */
  MORE('W078', {
    place: [
      { id: 'm3_twoshoes', type: 'decor', at: [9, 44], look: 'scuff', solid: false, flat: true, cond: { flag: 'm3_w078_shoe' }, lines: ['Two small marks on the plank, where a girl’s left shoe stood beside a boy’s right one, for a moment.',
        'The wood has kept the shape of both.'] },
      { id: 'm3_northribbon', type: 'decor', at: [7, 44], look: 'scraps', solid: false, cond: { flag: 'm3_w077_ribbon' }, lines: ['A ribbon has caught on the railing beside him, blown all the way from the border.',
        'On it, in a little girl’s handwriting: 재식. He has not noticed it yet. He is still counting.',
        DO('When he reaches the end of the planks, he will.', [{ secret: 'm3_ribbon_caught' }])] }],
    mech: [{ type: 'reach', zone: [6, 43, 9, 47], cond: { item: { shoe: 1 } }, failLine: 'Jae-sik is counting the planks under his breath. He does not look up at empty hands.',
      flag: 'm3_w078_shoe', done: { flag: 'm3_w078_shoe' }, reward: [{ secret: 'm3_shoe_recognised' }],
      winLines: ['You hold out the little left shoe. Jae-sik stops counting.', 'He takes it in both hands, turns it over, and finds inside the heel a name, written by their mother:',
        KN('옥순이 거다. …옥순이가 신발을 두고 갔구나. 찾으라고.', 'It is Ok-sun’s. …Ok-sun left her shoe behind. So that I would find it.'),
        'He sets it beside his own foot for a moment, very carefully.', 'Then he gives it back to you, because you are going the way she went.'] }],
    rules: ['Puzzle: pick up the left shoe in the middle of the bridge (or bring the one from the sea) and walk up to Jae-sik, the boy counting planks: he recognises his sister’s shoe.',
      'Secret: once a name has been sent north from the Border (W077), a ribbon with it is caught on the railing beside him.']
  });

  /* ---------------------------------------------------------------
   *  W080 — The Ghost Train Depot
   *  Secret (Track Switch on the points): ghost train no. 0.
   * --------------------------------------------------------------- */
  var THROWN = { flag: 'm3_w080_points' };
  var POINTS = [{ if: { notFlag: 'm3_w080_points' }, set: { m3_w080_points: true }, sfx: 'train_horn',
    lines: ['You fit the switch to the rusted lever and pull.', 'It gives at once, as if it had only been waiting for the right hand.',
      'At the end of the last siding the points move, and something rolls slowly out of the dark.'] }, { reeval: true }];
  MORE('W080', {
    place: [
      { id: 'm3_points', type: 'decor', at: [47, 26], look: 'lever',
        lines: [IF({ notFlag: 'm3_w080_points' }, 'A points lever at the end of the last siding, rusted solid.'),
          IF({ notFlag: 'm3_w080_points' }, 'A luggage tag is wired to it: “NO. 0 — ANSWERS TO THE SWITCH ONLY.”'),
          IF(THROWN, 'The points lever, thrown. The rust has flaked off where you held it.')], onEffect: { E72: POINTS } },
      { id: 'm3_trainzero', type: 'decor', at: [47, 24], look: 'train', lookOpt: { c: ['#2a2a3a', '#e8e0c0'] }, cond: THROWN, lines: ['Ghost train no. 0.',
        'Its destination board does not name a city. It says HOME, in three alphabets.', 'Its tickets have not turned to ash.',
        DO('One lies on the step, already punched, for a child travelling alone.', [{ secret: 'm3_train_zero' }])] }],
    rules: ['Secret: at the end of the last siding (bottom right), a rusted points lever “answers to the switch only”. Face it and use the Track Switch (E72): ghost train no. 0 rolls out, bound for HOME.']
  });

  /* ---------------------------------------------------------------
   *  W081 — The Clock Room
   *  Secret (Needle on a stopped clock): from nine at night to seven.
   * --------------------------------------------------------------- */
  var SEVEN = { flag: 'm3_w081_seven' };
  var NIGHT = [{ if: { notFlag: 'm3_w081_seven' }, set: { m3_w081_seven: true }, secret: 'm3_seven_am',
    lines: ['You fit the needle to the stub and turn it, slowly, through the whole night:', 'ten, eleven, midnight, one, two, three, four (the longest), five, six, seven.',
      'At seven the clock starts ticking by itself.', 'Somewhere behind you: a key in a lock, a bag set down very gently, a whisper.', KS('다녀왔어. …자?', 'I’m back. …Asleep?')] }, { reeval: true }];
  MORE('W081', {
    place: [
      { id: 'm3_nineclock', type: 'decor', at: [19, 1], look: 'wallclock', lookOpt: { hour: 9, min: 0 }, lookIf: [{ cond: SEVEN, lookOpt: { hour: 7, min: 0 } }],
        lines: IFS({ notFlag: 'm3_w081_seven' }, ['A wall clock by the door, stopped at nine. Its minute hand is missing; only a stub is left.',
          'Nine at night: the hour someone puts on her coat and goes to work.']).concat([IF(SEVEN, 'The clock by the door says seven now, and it is ticking.')]),
        onEffect: { E73: NIGHT } },
      { id: 'm3_clogs', type: 'decor', at: [18, 2], look: 'shoe', solid: false, cond: SEVEN, lines: ['A pair of white nurse’s clogs by the door, still warm,', 'set side by side so as not to make any noise.'] }],
    rules: ['Secret: a wall clock by the door is stopped at nine, its minute hand missing. Face it and use the Needle (E73): you turn it through the whole night to seven, and someone comes home from her shift.']
  });

  /* ---------------------------------------------------------------
   *  W082 — Track Zero
   *  Puzzle (lampsAll): light the platform for the 23:71.
   * --------------------------------------------------------------- */
  var PLX = [5, 17, 29, 41, 53];
  MORE('W082', {
    place: PLX.map(function (x, i) { return { id: 'm3_plamp' + (i + 1), type: 'decor', at: [x, 5], look: 'streetlamp', lines: ['A platform lamp, cold.'] }; }).concat([
      { id: 'm3_lampnotice', type: 'decor', at: [14, 1], look: 'poster', lines: ['A staff notice, typed: “FOR THE 23:71 — LIGHT EVERY PLATFORM LAMP AT ONCE,',
        'SO THAT IT KNOWS SOMEONE IS WAITING. THE LAMPS ARE OLD: THEY GO OUT IF YOU DAWDLE.”'] },
      { id: 'm3_hanky', type: 'decor', at: [30, 2], look: 'scraps', solid: false, cond: { flag: 'm3_w082_lit' }, lines: ['In the lamplight, on the platform, a folded handkerchief and a tin of shoe polish,',
        'set down as if their owner had only stepped away to look down the line.'] }]),
    mech: [{ type: 'lampsAll', lamps: ids('m3_plamp', 5), time: 20, light: 2.6, flag: 'm3_w082_lit', done: { flag: 'm3_w082_lit' },
      litLines: ['Click. A circle of light on the platform. Far behind you, the first lamp is already flickering.', 'The lamp hums awake.', 'Click. Light. Hurry: the old bulbs do not last.'],
      onLine: 'Still lit. For now.', doneLine: 'The platform lamps stay lit now. They have someone to wait for.', reward: [{ secret: 'm3_platform_lit' }],
      winLines: ['Five lamps, all lit at once, from one end of track zero to the other.', 'For the first time, the platform looks like somewhere a train might stop.',
        'Far down the tunnel, very faintly, a headlight answers.'] }],
    rules: ['Puzzle: a staff notice asks for every platform lamp to be lit at once “so that the 23:71 knows someone is waiting”. Light the five lamps along the platform before the first goes out again (about twenty seconds each): a handkerchief and a tin of shoe polish appear.']
  });

  /* ---------------------------------------------------------------
   *  W083 — The Lost Property Office
   *  Puzzle (quiz): the claim form for a voice.
   * --------------------------------------------------------------- */
  MORE('W083', {
    place: [
      { id: 'm3_claimtag', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true, lines: ['A luggage label tied to nothing, fallen from a shelf:',
        '“ONE VOICE, CHILD’S. HANDED IN THREE YEARS AGO, THE WEEK OF A FUNERAL.', 'TO BE COLLECTED BY THE OWNER.”'] },
      { id: 'm3_claimform', type: 'decor', at: 'random-any', look: 'clipboard', lines: ['A claim form on a clipboard, chained to the shelf.'] }],
    mech: [{ type: 'quiz', mark: 'm3_claimform', intro: ['A claim form on a clipboard, chained to the shelf. The clerk pushes a pencil towards you without looking up.',
      EN('Every box, please. Nothing is ever given back. But everything is written down.')],
      questions: [{ q: 'ITEM LOST:', choices: ['An umbrella', 'A voice', 'A left shoe'], right: 1 }, { q: 'LOST WHEN:', choices: ['Tomorrow', 'In 1951', 'Three years ago'], right: 2 }, { q: 'OWNER:', choices: ['Me', 'Nobody', 'My mother'], right: 0 }],
      failLine: 'The clerk reads the form, sighs, and tears it neatly in half. Another blank one is already waiting.',
      doneLine: 'Your form hangs on the clipboard, stamped CLAIMED. Underneath: “to be delivered when ready”.',
      flag: 'm3_w083_claimed', done: { flag: 'm3_w083_claimed' }, reward: [{ secret: 'm3_voice_claimed' }],
      winLines: ['The clerk reads the form twice. He takes out a rubber stamp, breathes on it, and brings it down:', 'CLAIMED.', EN('It isn’t here, you know. Voices don’t wait on shelves.'),
        EN('But now the form says whose it is. When it comes back, it will know where to go.')] }],
    rules: ['Puzzle: a luggage label on a shelf describes a child’s voice handed in three years ago. Fill in the claim form on the clipboard: a voice, three years ago, owner “me”. The clerk stamps it CLAIMED.']
  });

  /* ---------------------------------------------------------------
   *  W084 — The Sea of Clouds (side view)
   *  Puzzle (sequence, they whistle in turn): the kettles left on.
   *  Secret: what is left where the oldest one was.
   * --------------------------------------------------------------- */
  var KT = [[30, 6], [5, 15], [31, 24], [6, 33]];
  MORE('W084', {
    place: KT.map(function (p, i) { return { id: 'm3_kettle' + (i + 1), type: 'decor', at: p, look: 'stove', solid: false, light: 0.8, lines: ['A kettle whistling on a little gas ring, on a cloud.'] }; }).concat([
      { id: 'm3_kettlenote', type: 'decor', at: [8, 33], look: 'letter', solid: false, lines: ['A note pegged to the lowest cloud: “Turn them off in the order they were put on.',
        'The first went on furthest up, where nobody comes back to it.”'] },
      { id: 'm3_tea', type: 'decor', at: [28, 6], look: 'glass', solid: false, cond: { flag: 'm3_w084_quiet' }, lines: ['Where the oldest kettle was, someone has left a mug of barley tea on the cloud.',
        'It is still warm, with a note under it:', DO(KS('먼저 자. 차 마시고.', 'Go to sleep without me. Drink your tea first.'), [{ secret: 'm3_barley_tea' }])] }]),
    mech: [{ type: 'sequence', order: ids('m3_kettle', 4), ring: { every: 1.3, pause: 5, hear: 60, sfx: 'whistle', glyph: '♨', color: '#f0f0ff' },
      okLines: ['The oldest kettle stops whistling. The steam above it thins and drifts away.', 'The second kettle falls quiet.', 'The third gives a last little sigh.'],
      wrongLine: 'That one was not put on first. Above, the oldest kettle whistles on, and the others light again.',
      doneLine: 'The kettle is cold now.', flag: 'm3_w084_quiet', done: { flag: 'm3_w084_quiet' }, reward: [{ secret: 'm3_kettles_off' }],
      winLines: ['The last kettle goes quiet. For the first time, the sea of clouds is still.', 'Without the steam to feed it, the cloud under your feet thins a little.',
        'Through it, very far below, you can see a kitchen with its light on.'] }],
    rules: ['Puzzle: four kettles whistle on four clouds, one after another. A note on the lowest cloud says to turn them off in the order they were put on, the first “furthest up”: switch them off from the highest cloud down to the lowest.',
      'Secret: where the highest kettle was, a mug of barley tea appears.']
  });

  /* ---------------------------------------------------------------
   *  W085 — The Salt Desert (endless)
   *  Puzzle + secret (cry near a mark): the salt remembers the sea.
   * --------------------------------------------------------------- */
  MORE('W085', {
    place: [
      { id: 'm3_saltpan', type: 'decor', at: [21, 21], look: 'crack', solid: false, flat: true, lines: ['A shallow basin in the salt, cracked into tiles like a dried tear under a magnifying glass.',
        'Salt is only what is left when something stops crying. This one stopped too soon.'] },
      { id: 'm3_tidepool', type: 'decor', at: { near: 'm3_saltpan' }, look: 'puddle', solid: false, cond: { flag: 'm3_w085_wept' }, lines: ['Where your tear fell, the basin has filled:',
        'a pool of seawater no bigger than a bath, clear to the bottom.', 'At the bottom lies a wedding ring, very small, as if it had shrunk with waiting.',
        DO('You leave it where it is. Some things are better kept by water.', [{ secret: 'm3_salt_remembers' }])] }],
    mech: [{ type: 'gate', mark: 'm3_saltpan', flag: 'm3_w085_wept', dist: 3, events: ['cry'], text: 'The salt drinks the tear, and remembers that it was the sea.' }],
    rules: ['Puzzle and secret: a little way from where you arrive, a cracked basin in the salt “stopped crying too soon”. Cry beside it (Tear, Raindrop, Forbidden Tear…): it fills with seawater, and something small lies at the bottom.']
  });

  /* ---------------------------------------------------------------
   *  W086 — The Hall of Mirrors
   *  Puzzle (dirSequence): the reflection that does not copy you.
   *  Secret (mirror-walking): a stool inside a mirror pillar.
   * --------------------------------------------------------------- */
  MORE('W086', {
    npcs: [{ id: 'N2142', name: 'A Reflection That Does Not Copy', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], alpha: 0.45 }),
      behavior: 'static', face: false, at: [14, 19], solid: false, talkable: true,
      lines: [{ seq: ['A reflection that stays still while you move.', 'It is not copying you. It is waiting for you to copy it.'] },
        { seq: ['It turns left, then right, then left, then right, then lifts its chin,', 'like a girl trying on a new dress for someone who is not there to say it suits her.'] }] }],
    place: [{ id: 'm3_inmirror', type: 'decor', at: [23, 16], look: 'stool', solid: false, cond: { equipped: ['E85', 'E203', 'E161'] }, lines: ['Inside the mirror pillar it is quiet and cool, like the inside of a wardrobe.',
      'Someone has left a stool here, facing out, the way you sit to watch a front door.', 'From in here, the hall looks the right way round.',
      DO('On the stool: a hairpin, and a little heap of words that nobody said, kept warm.', [{ secret: 'm3_inside_the_mirror' }])] }],
    mech: [{ type: 'dirSequence', ent: 'N2142', seq: ['left', 'right', 'left', 'right', 'up'], dist: 6, flag: 'm3_w086_led', done: { flag: 'm3_w086_led' }, reward: [{ secret: 'm3_led_reflection' }],
      winLines: ['You turn as it turned: left, right, left, right, and lift your chin.', 'For once you lead, and the hall follows. Every reflection lifts its chin at the same moment.',
        'Your own reflection steps out of time with you.', 'It points at a mirror pillar near the bottom right of the hall,', 'as if to say: in there, if you can.'] }],
    rules: ['Puzzle: near the bottom of the hall, a reflection stands still and shows a little dance (left, right, left, right, chin up). Step in those directions near it: every reflection follows you.',
      'Secret: with a mirror-walking effect equipped (Inverted Reflection, Shoe-Cupboard Mirror, Pocket Reflection), one mirror pillar near the bottom right can be entered: a stool inside, facing out.']
  });

  /* ---------------------------------------------------------------
   *  W087 — The Room of a Thousand Curtains
   *  Puzzle (standStill): hide and seek in the curtain’s folds.
   * --------------------------------------------------------------- */
  MORE('W087', {
    place: [
      { id: 'm3_folds', type: 'decor', at: 'random-any', look: 'curtain', lookOpt: { c: ['#7a2a3a'] }, solid: false, lines: ['A curtain so long that it pools on the carpet in deep folds.',
        'A child could stand inside them and not be seen at all, if she kept very still and counted to twenty.'] },
      { id: 'm3_hairribbon', type: 'decor', at: { near: 'm3_folds' }, look: 'trinket', solid: false, cond: { flag: 'm3_w087_found' }, lines: ['Caught in the folds of the curtain, a child’s hair ribbon and a paper crane,',
        'tucked there for whoever won. The crane is folded from a page of a children’s calendar.',
        DO('On it, in a grown-up’s hand: “you win again”.', [{ collect: 'cranes' }])] }],
    mech: [{ type: 'standStill', mark: 'm3_folds', secs: 20, tick: 'clock_tick', breakLine: 'You moved. Somewhere in the room, a voice laughs, pretending: “Found you!”',
      flag: 'm3_w087_found', done: { flag: 'm3_w087_found' }, reward: [{ secret: 'm3_hide_and_seek' }],
      winLines: ['You stay in the curtain’s folds, very still, and count to twenty.', 'Footsteps come into the room. A woman’s voice, pretending, the way grown-ups pretend:',
        KS('어디 갔지? 우리 딸 어디 갔지? 아무리 찾아도 없네…', 'Where did she go? Where’s my girl? I’ve looked everywhere…'),
        'The footsteps stop right in front of the curtain. They wait, and go away again without opening it,', 'the way she always did, so that you could win.'] }],
    rules: ['Puzzle: one long dark-red curtain pools on the floor in deep folds. Stand inside them without moving for about twenty seconds: someone comes looking and pretends not to find you. A hair ribbon and a paper crane are left in the folds.']
  });

  /* ---------------------------------------------------------------
   *  W088 — The Lighthouse of Waves (the lamp itself is untouched)
   *  Puzzle (echo): say back what the sea says.
   * --------------------------------------------------------------- */
  MORE('W088', {
    place: [
      { id: 'm3_earrock', type: 'decor', at: [17, 19], look: 'rock', lines: ['A rock at the island’s southern edge, worn by the spray into the shape of an ear.',
        'The wives of fishermen used to stand here and call out to the sea.', 'The sea always called back with another word.',
        'Those who said that word back to it found something on the rocks by morning.'] },
      { id: 'm3_bottle', type: 'decor', at: [22, 19], look: 'glass', solid: false, cond: { flag: 'm3_w088_answered' }, lines: ['A bottle has washed up between the rocks, its cork sealed with candle wax.',
        'Inside, a folded drawing: three lighthouses, and in the sea between them a bed,', 'with someone small asleep in it.',
        'Underneath, in a grown-up’s hand:', DO(KS('다들 지켜보고 있어. 푹 자.', 'Everyone’s keeping watch. Sleep well.'), [{ secret: 'm3_bottle_drawing' }])] }],
    mech: [{ type: 'echo', zone: [14, 17, 26, 20], words: ['later', 'home', 'here', 'soon', 'light', 'wait', 'sorry', 'tomorrow'], flag: 'm3_w088_answered', done: { flag: 'm3_w088_answered' },
      winLines: ['You say the word back to the sea. For a moment the waves stop, as if listening.', 'Then a bigger wave comes in, slowly, and sets something down among the rocks at your feet.'] }],
    rules: ['Puzzle: on the southern shore of the island, beside a rock shaped like an ear, say anything: the sea answers with another word. Say that word back: a bottle washes up with a drawing in it.']
  });

  /* ---------------------------------------------------------------
   *  W089 — The Private Lounge
   *  Puzzle (pairs): win back the hours, two envelopes at a time.
   * --------------------------------------------------------------- */
  var IOU = [[8, 10], [11, 10], [14, 10], [17, 10], [8, 12], [11, 12], [14, 12], [17, 12]];
  MORE('W089', {
    place: IOU.map(function (p, i) { return { id: 'm3_iou' + (i + 1), type: 'decor', at: p, look: 'letter', solid: false, flat: true, lines: ['A sealed envelope, face down: an IOU for somebody’s evening.'] }; }).concat([
      { id: 'm3_houseplaque', type: 'decor', at: [5, 1], look: 'plaque', lines: ['A brass plaque on the wall: HOUSE GAME.', 'TURN THE ENVELOPES TWO AT A TIME. WHAT MATCHES GOES HOME.'] },
      { id: 'm3_watch', type: 'decor', at: [13, 9], look: 'trinket', solid: false, cond: { flag: 'm3_w089_hours' }, lines: ['On the carpet below the table, where the stakes would fall, a cheap wristwatch with a cracked strap.',
        'It is still set to Seoul time, and warm, as if it had just come off a wrist after a long night.',
        DO('The hours on it are not for sale any more.', [{ secret: 'm3_hours_back' }])] }]),
    mech: [{ type: 'pairs', tiles: ids('m3_iou', 8), flag: 'm3_w089_hours', done: { flag: 'm3_w089_hours' }, wrongLine: 'Two different nights. The envelopes slide back face down.',
      doneLine: 'The envelopes lie face up now, every one of them matched.', reward: [{ collect: 'coins' }],
      winLines: ['The last two envelopes match: two IOUs in the same tired handwriting,', 'for the same ten hours, nine at night to seven in the morning.',
        'The Masked Gambler laughs, but his mask slips a little.', EN('Fine. Take them. They were never much fun to win.')] }],
    rules: ['Puzzle: eight sealed envelopes lie face down in front of the roulette table, and a plaque explains the house game. Turn them two at a time and match every pair: the gambler gives the hours back, and a wristwatch on Seoul time appears below the table (and a coin for the collection).']
  });

  /* ---------------------------------------------------------------
   *  W090 — The Inner Sea (vast)
   *  Puzzle (catch): put the stranded night-lights back in the water.
   * --------------------------------------------------------------- */
  var JELLY = { look: { t: 'jelly', c: ['#f0e8a0'], h: 12, shadow: false }, behavior: 'wander', radius: 2, speed: 0.5, at: 'random-any', solid: false, tag: 'm3_jelly', appear: { notFlag: 'm3_w090_lit' },
    lines: ['A jellyfish stranded on the sand, glowing weakly, like a night light whose battery is running down.'] };
  MORE('W090', {
    npcs: ['N2143', 'N2144', 'N2145'].map(function (id) { return Object.assign({ id: id, name: 'A Stranded Night-Light' }, JELLY); }),
    place: [{ id: 'm3_glowline', type: 'decor', at: 'random-hidden', look: 'glint', solid: false, light: 1.6, cond: { flag: 'm3_w090_lit' }, lines: ['Where the three night-lights went back into the water,',
      'a faint line of glow runs down and down into the green, all the way to the bottom.',
      'It is the kind of light someone leaves on in a corridor,',
      DO('so that a child can find her way in the dark without having to call anyone.', [{ secret: 'm3_corridor_light' }])] }],
    mech: [{ type: 'catchN', tag: 'm3_jelly', key: 'm3_jellies', n: 3, countText: 'Night-lights back in the water: # / %', sfx: 'splash_small', color: '#f0e8a0', flag: 'm3_w090_lit', done: { flag: 'm3_w090_lit' },
      winLines: ['You carry the last stranded night-light down to the water and let it go.', 'It pulses once, brighter, and sinks after the other two.',
        'Somewhere among the islands, the sea begins to glow from underneath.'] }],
    rules: ['Puzzle: three jellyfish lie stranded on the sand of different islands, glowing weakly like old night lights. Touch each one to put it back in the water.',
      'Secret: once all three are back, a line of glow appears in a hidden corner of the sea, running down towards the bottom.']
  });

  /* In worlds of depth 3 and more, the random layout is drawn again every night anyway: the additions placed at
     fixed coordinates are resolved first there, so that nothing placed at random (doors, cookie, decor) lands on them. */
  ['W047', 'W055', 'W058', 'W060', 'W065', 'W068', 'W069', 'W071', 'W073', 'W075', 'W076', 'W077', 'W078', 'W080', 'W081', 'W082', 'W084', 'W086', 'W088'].forEach(function (id) {
    var d = YN.data.worlds[id]; if (!d || !d.place || (d.depth || 0) < 3) return;
    var mine = d.place.filter(function (p) { return p && /^m3_/.test(p.id || '') && Array.isArray(p.at); });
    d.place = mine.concat(d.place.filter(function (p) { return mine.indexOf(p) < 0; }));
  });
})(typeof window !== 'undefined' ? window : globalThis);
