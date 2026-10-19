/* =========================================================================
 *  MORE (06) — puzzles and secrets for existing worlds W148–W175 (not W161).
 *  Each world gets what it lacked (a puzzle, a written secret, or both),
 *  tied to its own objects, inhabitants and lore. Fixed-position marks are
 *  moved to the front of `place` so that random decor never lands on them.
 *  Generated worlds use random/near positions, or marks drawn into the map
 *  by `post` (W162, W164, W169) so that _expanse.js still enlarges them.
 *  Hidden rooms behind fake walls: W149, W168, W173, W175.
 *  IDs: no new NPC (N2210–N2234 unused), no new effect (E267–E268 unused);
 *  flags, temps, secrets and mark ids are prefixed m6_.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, MORE = YN.kit.more, W = YN.data.worlds;
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t) { return { t: t, lang: 'en' }; }
  /* a line (string or object) shown only when a condition holds */
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  /* an inhabitant written in another file, found by world and name */
  function npcId(world, name) {
    var E = YN.data.entities;
    for (var k in E) if (Object.prototype.hasOwnProperty.call(E, k) && E[k].world === world && E[k].name === name) return k;
    YN.warn('more_06: no inhabitant “' + name + '” in ' + world); return null;
  }
  /* my fixed-position marks first: random ones placed after them avoid their cells */
  function front(id, ids) {
    var d = W[id]; if (!d || !d.place) return;
    var mine = d.place.filter(function (m) { return ids.indexOf(m.id) >= 0; });
    d.place = mine.concat(d.place.filter(function (m) { return mine.indexOf(m) < 0; }));
  }
  /* marks drawn into a generated map (by `post`), keyed by their map character */
  function marksOf(id, o) { var d = W[id]; d.marks = d.marks || {}; Object.keys(o).forEach(function (k) { d.marks[k] = o[k]; }); }
  /* stamp a small pattern into generated rows where `test` accepts the spot (' ' in the pattern keeps the cell) */
  function stamp(rows, r, pat, test) {
    var h = rows.length, w = rows[0].length, ph = pat.length, pw = pat[0].length;
    var spanX = w - pw - 6, spanY = h - ph - 6; if (spanX < 1 || spanY < 1) return rows;
    var sx = r.int(0, spanX - 1), sy = r.int(0, spanY - 1);
    for (var k = 0; k < spanX * spanY; k++) {
      var x = 3 + (sx + k) % spanX, y = 3 + (sy + Math.floor((sx + k) / spanX)) % spanY;
      if (!test(rows, x, y, pw, ph)) continue;
      return rows.map(function (s, yy) {
        if (yy < y || yy >= y + ph) return s;
        var line = pat[yy - y], out = s.slice(0, x);
        for (var i = 0; i < pw; i++) out += line[i] === ' ' ? s[x + i] : line[i];
        return out + s.slice(x + pw);
      });
    }
    return rows;
  }
  /* the pattern and a one-cell margin around it are all this floor character */
  function allOf(ch) {
    return function (rows, x, y, pw, ph) {
      for (var yy = y - 1; yy <= y + ph; yy++) for (var xx = x - 1; xx <= x + pw; xx++) if (!rows[yy] || rows[yy][xx] !== ch) return false;
      return true;
    };
  }
  /* the one-cell ring around the pattern is mostly open ground (a clearing that joins the forest) */
  function airy(ch, share) {
    return function (rows, x, y, pw, ph) {
      var n = 0, f = 0;
      for (var yy = y - 1; yy <= y + ph; yy++) for (var xx = x - 1; xx <= x + pw; xx++) {
        if (!rows[yy] || rows[yy][xx] === undefined) return false;
        if (yy > y - 1 && yy < y + ph && xx > x - 1 && xx < x + pw) continue;
        n++; if (rows[yy][xx] === ch) f++;
      }
      return f / n >= share;
    };
  }
  YN.data.items = YN.data.items || {};
  YN.data.items.m6_raffle = { name: 'Raffle Ticket No. 0412', desc: 'Spring raffle, 2019. Nobody checked the numbers.' };

  /* ---------------------------------------------------------------
   *  W148 — The Birthday Party (P2) · puzzle
   *  Six invitations were never handed out: leave one on each of the six
   *  places at the table (visitAll) → a going-home bag, a note from Mum.
   * --------------------------------------------------------------- */
  var GUESTS = ['Nour', 'Lina', 'Sami', 'Maya', 'Elio', 'Jin'];
  var PLACE_AT = [[17, 8], [18, 8], [19, 8], [17, 10], [18, 10], [19, 10]];
  var PLACE_LINES = [
    'Nour’s place. Your invitation lies open on her plate now, as if it had been delivered on time.',
    'Lina’s place. A paper cup, a paper plate, and now an invitation, a little creased from your bag.',
    'Sami’s place. His party hat is still folded flat. Your invitation is propped against it.',
    'Maya’s place. You smooth the invitation out on the plate. Somebody once told her you did not talk.',
    'Elio’s place. The invitation slides a little on the plate, then stays.',
    'Jin’s place. The last chair. The last invitation. Your handwriting looks very small on the plate.'];
  MORE('W148', {
    place: [
      { id: 'm6_w148_table1', type: 'decor', at: [17, 9], look: 'table', lookOpt: { cloth: '#f8d8e8' }, lines: ['The party table, laid for six. Paper plates, paper cups, a hat at every place.'] },
      { id: 'm6_w148_table2', type: 'decor', at: [18, 9], look: 'table', lookOpt: { cloth: '#f8d8e8' }, lines: ['A paper tablecloth with balloons printed on it. Nobody has spilt anything on it yet.'] },
      { id: 'm6_w148_table3', type: 'decor', at: [19, 9], look: 'table', lookOpt: { cloth: '#f8d8e8' }, lines: ['The end of the table, where the birthday girl sits. The chair is pulled out, waiting.'] },
      { id: 'm6_w148_pile', type: 'decor', at: [16, 9], look: 'letter', solid: false, flat: true,
        lines: ['Six invitations in a little pile at the end of the table, in a child’s best handwriting, folded very small.', 'Each one has a name on it. There are six places at the table, and each place has a name card.'] },
      { id: 'm6_w148_bag', type: 'decor', at: [20, 9], look: 'crate', lookOpt: { c: ['#f0a0c0'] }, cond: { flag: 'm6_w148_invited' },
        lines: ['A going-home bag with your name on it, the only one left on the table.',
          'Inside: a slice of cake wrapped in a napkin, and a note in your mother’s handwriting.',
          { t: '생일 축하해, 우리 딸. 늦어서 미안해.', lang: 'ko-s', tr: 'Happy birthday, my girl. Sorry I’m late.', do: [{ secret: 'm6_going_home_bag' }] }] }
    ].concat(GUESTS.map(function (g, i) { return { id: 'm6_w148_place' + (i + 1), type: 'decor', at: PLACE_AT[i], look: 'glass', solid: false, lines: [PLACE_LINES[i]] }; })),
    mech: [{ type: 'visitAll', marks: GUESTS.map(function (g, i) { return 'm6_w148_place' + (i + 1); }), countText: 'Invitations left on the plates: # / %', flag: 'm6_w148_invited',
      winLines: ['The last invitation is on the last plate.', 'For a moment every chair is pulled out a little, as if six people had just sat down at once.',
        'Nobody is there. But every place is taken.', 'At the end of the table, beside your chair, a going-home bag with your name on it.'] }],
    rules: ['Six invitations lie folded at the end of the party table; there are six named places. Go to each of the six places (interact): an invitation is left on every plate.',
      'Once all six are delivered, a going-home bag appears at the end of the table, with cake and a note from her mother (secret).']
  });
  front('W148', ['m6_w148_table1', 'm6_w148_table2', 'm6_w148_table3', 'm6_w148_pile', 'm6_w148_bag', 'm6_w148_place1', 'm6_w148_place2', 'm6_w148_place3', 'm6_w148_place4', 'm6_w148_place5', 'm6_w148_place6']);

  /* ---------------------------------------------------------------
   *  W149 — Dream Platform No. 7 (P2) · puzzle + secret
   *  Puzzle: punch the ticket seven times, one hole per night (knock).
   *  Secret: Lost Property, through the end wall of the platform (fake wall).
   * --------------------------------------------------------------- */
  MORE('W149', {
    post: function (rows) { return rows.map(function (s, y) { return s + (y >= 2 && y <= 5 ? '.....##' : '#######'); }); },
    fakeWalls: [[49, 3]],
    place: [
      { id: 'm6_w149_validator', type: 'decor', at: [31, 1], look: 'ticketmachine', lines: ['A ticket validator.'] },
      { id: 'm6_w149_notice', type: 'decor', at: [32, 1], look: 'poster', solid: false,
        lines: ['A notice above the validator: TICKETS FOR PLATFORM 7 ARE VALID FOR ONE WEEK OF NIGHTS. PLEASE VALIDATE.', 'Your ticket is already in the slot: six holes, one for each night. There is room for more.'] },
      { id: 'm6_w149_carriage', type: 'decor', at: [24, 8], look: 'train', cond: { flag: 'm6_w149_week' },
        lines: ['One old carriage, stopped at the platform with its doors open. It was not here a moment ago.',
          'Inside, seven seats. On each seat, a ticket for this same train, dated seven days apart. Six of them have been used.',
          { t: 'On the seventh seat, a child’s lunchbox with a sticker: “for the weekend”. It is still warm.', do: [{ secret: 'm6_seventh_hole' }] }] },
      { id: 'm6_w149_mitten', type: 'decor', at: [48, 3], look: 'sock', solid: false, flat: true,
        lines: ['A child’s mitten at the very end of the platform, its thumb pointing at the end wall, as if it had tried to follow someone through.'] },
      { id: 'm6_w149_shelf', type: 'decor', at: [54, 3], look: 'shelf',
        lines: ['Shelves of lost property, every item tagged with a dream number.', 'Dream 14: one mitten. Dream 21: a library book, three weeks late. Dream 28: a whole afternoon, folded small.'] },
      { id: 'm6_w149_bell', type: 'decor', at: [52, 2], look: 'bell',
        lines: ['A bell above the counter: RING FOR ASSISTANCE.', 'You ring it. Seven days from now, somebody will come.'] },
      { id: 'm6_w149_box', type: 'decor', at: [50, 5], look: 'crate',
        lines: ['A box marked UNCLAIMED — PLATFORM 7.', { t: 'Under a scarf at the bottom, a page torn from somebody’s notebook, kept flat for you all this time.', do: [{ collect: 'pages' }, { secret: 'm6_lost_property' }] }] }
    ],
    mech: [{ type: 'knock', mark: 'm6_w149_validator', n: 7, within: 6, sfx: 'stamp', firstLine: 'Clack. One hole. The machine waits, as if it were counting with you.',
      doneLine: 'Seven holes. The ticket is full: one week, and the week is over.', flag: 'm6_w149_week',
      winLines: ['Clack. The seventh hole.', 'The validator gives your ticket back, warm. Seven little holes in a row, one for every night of the week.',
        'Down on the track, without a sound, a carriage that was not there has come in and opened its doors.'] }],
    rules: ['The ticket validator against the back wall wants one punch for each night of the week: interact with it seven times quickly. An old carriage then stands at the platform; on its seventh seat, a warm lunchbox (secret).',
      'Secret: at the far east end of the platform, a mitten points at the end wall. The wall there can be walked through, into Lost Property; in the unclaimed box, a collection page.']
  });
  front('W149', ['m6_w149_validator', 'm6_w149_notice', 'm6_w149_carriage', 'm6_w149_mitten', 'm6_w149_shelf', 'm6_w149_bell', 'm6_w149_box']);

  /* ---------------------------------------------------------------
   *  W150 — The Souvenir Shop (P2) · puzzle + secret
   *  Puzzle: the 2019 raffle was never drawn. Find ticket 0412 in the
   *  drawer and take it to the drum (reach with the item) → the prize.
   *  Secret: a jar that keeps one laugh opens when she laughs (listen).
   * --------------------------------------------------------------- */
  MORE('W150', {
    place: [
      { id: 'm6_w150_drum', type: 'decor', at: [18, 5], look: 'wheel',
        lines: [IF({ notFlag: 'm6_w150_drawn' }, 'A raffle drum on a stand, full of folded tickets. A card: SPRING RAFFLE 2019 — FIRST PRIZE: A WEEKEND FOR THREE BY THE SEA — DRAW TONIGHT, BRING YOUR TICKET.'),
          IF({ notFlag: 'm6_w150_drawn' }, 'Nobody ever drew it. The handle is still taped down.'),
          IF({ flag: 'm6_w150_drawn' }, 'The raffle drum has turned at last. The tape hangs off the handle.')] },
      { id: 'm6_w150_drawer', type: 'decor', at: [18, 9], look: 'drawer',
        lines: [IF({ notFlag: 'm6_w150_took' }, { t: 'A drawer of small things nobody came back for: buttons, a bus pass from 2019, and a raffle ticket, No. 0412. You take the ticket.', do: [{ item: { m6_raffle: 1 } }, { set: { m6_w150_took: true } }] }),
          IF({ flag: 'm6_w150_took' }, 'Buttons, a bus pass from 2019, and the clean rectangle where the raffle ticket was.')] },
      { id: 'm6_w150_prize', type: 'decor', at: [18, 4], look: 'letter', solid: false, cond: { flag: 'm6_w150_drawn' },
        lines: ['The prize envelope, sealed since 2019: a weekend for three by the sea. Three return tickets, dated the summer he left. None of them used.',
          { t: 'On the back, in biro, a man’s quick handwriting: “When you’re bigger, the three of us. — J.”', do: [{ secret: 'm6_weekend_for_three' }] }] },
      { id: 'm6_w150_jar', type: 'decor', at: [18, 7], look: 'jar', listenDist: 4,
        lines: [IF({ notFlag: 'm6_w150_laugh' }, 'A jar with a screw lid, labelled LAUGH — ONE ONLY. Something very small rattles inside whenever anyone nearby so much as smiles.'),
          IF({ flag: 'm6_w150_laugh' }, 'The jar is empty now. It smells faintly of aftershave.')],
        listen: [{ match: ['haha', 'ha ha', 'hahaha', 'ha ha ha', 'hehe', 'lol', '하하', '하하하', '히히', 'ㅋㅋ', 'ㅋㅋㅋ'], if: { notFlag: 'm6_w150_laugh' },
          lines: ['The lid of the jar unscrews itself. The little laugh inside climbs out, finds your voice, and stays in it for a moment.', 'It is a man’s laugh, the kind that always started before the end of the joke.'],
          do: [{ set: { m6_w150_laugh: true } }, { secret: 'm6_laugh_in_a_jar' }, { reeval: true }] }],
        onEffect: { E39: [{ set: { m6_w150_laugh: true } }, { secret: 'm6_laugh_in_a_jar' }, { lines: ['You laugh at the jar. Inside, a smaller laugh answers, unscrews the lid and climbs out into yours.'] }] } }
    ],
    mech: [{ type: 'reach', zone: [16, 4, 17, 6], cond: { item: { m6_raffle: 1 } }, flag: 'm6_w150_drawn', reward: [{ item: { m6_raffle: -1 } }, { secret: 'm6_raffle_drawn' }],
      winLines: ['You hold ticket No. 0412 up to the drum. The tape comes off the handle by itself.', 'The drum turns once, slowly, the way it was meant to on the night of the draw, and stops.',
        'One ticket drops out: No. 0412. Beside the drum, the prize envelope has been waiting all along.'] }],
    rules: ['The 2019 raffle was never drawn. Raffle ticket No. 0412 is in the drawer against the east wall: take it to the raffle drum (stand in front of it). The drum turns and the prize envelope appears — three tickets to the sea, and a word from J. (secret).',
      'Secret: the jar labelled LAUGH opens if she laughs near it (type “haha”, or use Laughter on it).']
  });
  front('W150', ['m6_w150_drum', 'm6_w150_drawer', 'm6_w150_prize', 'm6_w150_jar']);

  /* ---------------------------------------------------------------
   *  W151 — The Unstable Maze (P3) · puzzle
   *  Small footprints start at the way in and take her long way round to a
   *  hiding place (trail). Different every night, like the maze.
   * --------------------------------------------------------------- */
  MORE('W151', {
    place: [
      { id: 'm6_w151_hideout', type: 'decor', at: 'random-hidden', look: 'blanketlump',
        lines: ['A coat folded into a cushion at a dead end, and a wristwatch set ten minutes slow.', 'Somebody used to wait here every morning until the school bell had stopped ringing.'] }
    ],
    mech: [{ type: 'trail', from: 'back', to: 'm6_w151_hideout', slack: 1, lostLine: 'You have stepped off the footprints. They wait for you back where you left them.',
      flag: 'm6_w151_longway', reward: [{ secret: 'm6_the_long_way' }, { collect: 'cranes' }],
      winLines: ['The footprints end at a dead end, where someone sat down every morning.', 'A coat folded into a cushion. A wristwatch set ten minutes slow, so that being late would not be her fault.',
        'In the coat pocket, a paper crane folded out of a school timetable.'] }],
    rules: ['Small footprints start beside the way in. Follow them all the way without straying: they lead to the dead end where a child hid before school, and a paper crane (collection).']
  });

  /* ---------------------------------------------------------------
   *  W152 — The Endless Landscape (P3, infinite) · puzzle + secret
   *  Puzzle: the well, the house, the statue ring in an order (sequence)
   *  → the hundredth telegraph pole appears.
   *  Secret: with the bedroom light off, a car waits on the verge.
   * --------------------------------------------------------------- */
  MORE('W152', {
    place: [
      { id: 'm6_w152_well', type: 'decor', at: [9, 13], look: 'well' },
      { id: 'm6_w152_house', type: 'decor', at: [22, 21], look: 'house', lookOpt: { c: ['#d8c8a8', '#6a3a3a'] } },
      { id: 'm6_w152_statue', type: 'decor', at: [8, 20], look: 'statue' },
      { id: 'm6_w152_pole', type: 'decor', at: [21, 23], look: 'telepole', cond: { flag: 'm6_w152_road' },
        lines: ['A telegraph pole with 100 painted on it, in a child’s round numbers.', { t: 'At its foot, a coin, dropped from a car window for luck by whoever last got this far.', do: [{ collect: 'coins' }] }] },
      { id: 'm6_w152_lamp', type: 'decor', at: [14, 21], look: 'streetlamp',
        lines: ['A road lamp that has never been lit. Under it, tyre marks that only show when everything else is dark.'] },
      { id: 'm6_w152_car', type: 'decor', at: [12, 22], look: 'carpart', cond: { roomLight: false },
        lines: ['A car on the verge, engine running, hazard lights ticking. Nobody is at the wheel.', 'On the back seat, a blanket shaped like a sleeping child. The radio is on very low.',
          { t: 'The blanket is breathing. It is you, pretending to be asleep, so that someone will carry you in.', do: [{ secret: 'm6_night_drive' }] }] }
    ],
    mech: [{ type: 'sequence', order: ['m6_w152_well', 'm6_w152_house', 'm6_w152_statue'], ring: { every: 1.8, pause: 5, hear: 18, sfx: 'chime', glyph: '♪' },
      okLines: ['The well answers: a low note from very far down.', 'The house answers. A window lights up, then goes out.'],
      wrongLine: 'Silence. The road does not remember it that way round.', doneLine: 'The landmarks are quiet. The road has remembered.', flag: 'm6_w152_road',
      reward: [{ secret: 'm6_hundredth_pole' }],
      winLines: ['The statue answers last. The three notes hang together in the air, like a car horn heard from very far away.',
        'Down the road, a telegraph pole you had never counted leans out of the trees. Somebody has painted a number on it: 100.'] }],
    rules: ['Near the arrival, a well, a lit house and a statue chime one after the other. Touch them in the order they chime (well, house, statue): the hundredth telegraph pole appears, with a coin at its foot (collection).',
      'Secret: when the bedroom light at home is off, a car waits on the verge by the unlit road lamp, a child pretending to sleep on the back seat.']
  });

  /* ---------------------------------------------------------------
   *  W153 — The Unfolding House (P4, shifting) · puzzle + secret
   *  Puzzle: wherever the rooms have moved, touch the four things of the
   *  living room (visitAll, kept across the shifts) → a corner stays still.
   *  Secret: when her bedroom door is ajar, the room the house added.
   * --------------------------------------------------------------- */
  MORE('W153', {
    place: [
      { id: 'm6_w153_note', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true,
        lines: ['A note on the floor of a corridor, in a tired adult hand: “Clock, photo, slippers, lamp. That is all a living room ever was. Touch them and it will remember.”'] },
      { id: 'm6_w153_clock', type: 'decor', at: 'random-any', look: 'clock', lines: ['The living-room clock, standing in some other room tonight. It still says ten to nine, the time she leaves for work.'] },
      { id: 'm6_w153_photo', type: 'decor', at: 'random-any', look: 'photo', lines: ['The photo from the top of the television: four people on a sofa. It has been moved so often the sofa has come out blurred.'] },
      { id: 'm6_w153_slippers', type: 'decor', at: 'random-any', look: 'shoe', solid: false, lines: ['A pair of grown-up slippers, side by side by a door that leads nowhere in particular. They are still warm.'] },
      { id: 'm6_w153_lamp', type: 'decor', at: 'random-any', look: 'lamp', light: 1.2, lines: ['The standing lamp from beside the sofa. It is on. It is always on.'] },
      { id: 'm6_w153_corner', type: 'decor', at: 'random-hidden', look: 'sofa', cond: { flag: 'm6_w153_lounge' },
        lines: ['A corner the house keeps still for you now: the sofa, the low table, four bowls.', 'Three bowls have been washed and put away. One is still waiting, with a plate over it to keep it warm.'] },
      { id: 'm6_w153_added', type: 'decor', at: 'random-hidden', look: 'bed', cond: { roomDoor: true },
        lines: ['A small room that was not here before: a bed, a lamp left on, a door that does not quite shut.',
          { t: 'From the bed you can hear the whole house: the fridge, the pipes, a key in the lock. That was the point of it.', do: [{ secret: 'm6_the_added_room' }] }] }
    ],
    mech: [{ type: 'visitAll', marks: ['m6_w153_clock', 'm6_w153_photo', 'm6_w153_slippers', 'm6_w153_lamp'], countText: 'The living room, remembered: # / %', flag: 'm6_w153_lounge',
      reward: [{ secret: 'm6_living_room' }],
      winLines: ['Clock, photo, slippers, lamp. The fourth one clicks into place under your hand.',
        'For one breath the house stops moving. Around you is the living room as it was: four bowls on the low table, the television on with the sound off.',
        'Then the walls begin to slide again. But somewhere, they have kept a corner of it still.'] }],
    rules: ['The rooms move every 35 seconds. Wherever they are tonight, touch the living room’s clock, photo, slippers and lamp (the count is kept when the house shifts): the house keeps a corner of the living room still (secret).',
      'Secret: when her bedroom door at home is left ajar, a room the house added appears in a nook — a bed, a lamp left on, a door that does not quite shut.']
  });

  /* ---------------------------------------------------------------
   *  W154 — The Corridor Longer on the Inside (P3) · puzzle
   *  The land surveyor’s form, half filled in (quiz): measured at last,
   *  the corridor agrees to be short, and the door at the end appears.
   * --------------------------------------------------------------- */
  MORE('W154', {
    place: [{ id: 'm6_w154_form', type: 'decor', at: 'random-any', look: 'clipboard', solid: false, lines: ['The land surveyor’s clipboard.'] }],
    mech: [{ type: 'quiz', mark: 'm6_w154_form', flag: 'm6_w154_survey',
      intro: ['The surveyor’s form, dropped on the floorboards: SURVEY OF A CORRIDOR. Four boxes, still empty.'],
      questions: [
        { q: 'Length of the corridor, measured from outside:', choices: ['four metres', 'forty metres', 'four hundred metres'], right: 0 },
        { q: 'Length of the corridor, measured from inside:', choices: ['four metres', 'four hundred metres', 'it has no end'], right: 1 },
        { q: 'What takes up the extra room?', choices: ['furniture', 'grief', 'the dark'], right: 1 },
        { q: 'The suitcase nobody unpacks, on its own:', choices: ['nothing at all', 'four metres', 'forty metres'], right: 2 }],
      failLine: 'A red cross in the margin, in the surveyor’s pencil: “Measure again.”', doneLine: 'The form is complete and signed. The corridor has been measured.',
      reward: [{ fn: function () {
        var n = Math.max(5, Math.abs(YN.save.temp('lc') || 0)); YN.save.temp('lc', n);
        var rt = YN.game && YN.game.rt; if (rt && rt.mechs) rt.mechs.forEach(function (m) { if (m.type === 'loopCount' && m.p.key === 'lc') m.s.n = n; });
      } }, { secret: 'm6_corridor_surveyed' }],
      winLines: ['Every box is filled. At the bottom of the form, a total in pencil: four metres, plus grief, plus one suitcase.',
        'The corridor seems to agree with the figures. When you look up, the door at the end is right there.'] }],
    rules: ['The surveyor’s clipboard lies on the floor near the west end. Fill in his form with what he says while he walks (four metres outside, four hundred inside, grief, forty metres for the suitcase): the corridor is measured, and the door at the end appears at once, as if after five laps (secret).']
  });

  /* ---------------------------------------------------------------
   *  W155 — The Room That Connects to Itself (P3) · puzzle
   *  Go round the lamp three times, then stop under it (laps + reach):
   *  the girl in the mirror turns round, at last, to face her.
   * --------------------------------------------------------------- */
  MORE('W155', {
    place: [{ id: 'm6_w155_ring', type: 'decor', at: [4, 4], look: 'scuff', solid: false, flat: true,
      lines: [IF({ notFlag: 'm6_w155_met' }, 'The carpet under the lamp is worn into a ring, as if somebody walked round and round it three times every night before stopping here.'),
        IF({ flag: 'm6_w155_met' }, 'The worn ring in the carpet. You know whose feet made it.')] }],
    mech: [{ type: 'laps', center: [4.5, 3.5], key: 'm6_laps155' },
      { type: 'reach', zone: [4, 4, 4, 4], cond: { tempGte: { m6_laps155: 12 } }, flag: 'm6_w155_met', reward: [{ secret: 'm6_face_to_face' }, { collect: 'photos' }],
        winLines: ['You stop under the lamp, dizzy, exactly where the ring in the carpet stops.',
          'Somewhere in the room the girl who always arrives a step ahead of you stops too, and for the first time she turns round.',
          'She is not one step ahead any more. She is right here, facing you. She holds out a photograph, and lets go of it when you take it.'] }],
    rules: ['Walk round the lamp in the middle of the room three full times, then stop on the worn ring just below it: the girl who keeps meeting herself turns round at last and gives her a photograph (collection, secret).']
  });
  front('W155', ['m6_w155_ring']);

  /* ---------------------------------------------------------------
   *  W156 — The Landmarks That Spell (P4, infinite) · puzzle + secret
   *  Puzzle: say what the stones really spell, at the blank cairn (password).
   *  Secret: say her own name, and a conch shell appears (listen).
   * --------------------------------------------------------------- */
  MORE('W156', {
    place: [
      { id: 'm6_w156_cairn', type: 'decor', at: [20, 14], look: 'rock', cycle: true,
        lines: ['A cairn of flat stones, taller than the other landmarks, with nothing carved on it at all.', 'It leans towards you a little, the way someone leans in when they are waiting for you to say it.'] },
      { id: 'm6_w156_seat', type: 'decor', at: [21, 15], look: 'stump', cond: { flag: 'm6_w156_read' },
        lines: ['A flat stone where the cairn stood, worn into a seat the size of a child.', 'Scratched into it twice, once in the old writing and once in capitals: HERE.'] },
      { id: 'm6_w156_ring', type: 'decor', at: [11, 21], look: 'pebbles', solid: false, flat: true, listenDist: 4,
        lines: ['A ring of white pebbles in the grass, around something that is not there yet.'],
        listen: [{ match: ['sora', '소라'], if: { notFlag: 'm6_w156_shell' }, do: [{ set: { m6_w156_shell: true } }, { reeval: true }],
          lines: ['At your feet, inside the ring of pebbles, the grass parts around something pale and curled.'] }] },
      { id: 'm6_w156_shell', type: 'decor', at: [12, 21], look: 'shell', cond: { flag: 'm6_w156_shell' },
        lines: ['A conch shell, big enough for both hands. In Korean, it has the same name as you.',
          { t: 'You hold it to your ear. Not the sea: a woman’s voice, very far away, saying your name twice, once in each language.', do: [{ secret: 'm6_conch_shell' }] }] }
    ],
    mech: [{ type: 'password', mark: 'm6_w156_cairn', dist: 3, words: ['return here', 'returnhere'], flag: 'm6_w156_read',
      do: [{ if: { notSecret: 'm6_return_here' }, secret: 'm6_return_here',
        lines: ['“Return here.” You say it to the cairn the way the stones have been saying it to you all along.',
          'The cairn settles, stone by stone, into a low seat. The grass around it is flattened in the shape of someone who sat here often, waiting for someone to come back.'] }] }],
    rules: ['The carved landmarks spell RETURN HERE in the old writing. Say “return here” beside the tall blank cairn near the arrival: it settles into a seat marked HERE (secret).',
      'Secret: say her name, “Sora”, by the ring of white pebbles: a conch shell appears (소라 also means conch); held to the ear, it speaks her name.']
  });

  /* ---------------------------------------------------------------
   *  W157 — The Changing Beginning (P4, shifting) · puzzle
   *  A start line, somewhere new each time. Stand on it and wait
   *  (standStill): for once, the beginning waits with her.
   * --------------------------------------------------------------- */
  MORE('W157', {
    place: [{ id: 'm6_w157_start', type: 'decor', at: 'random-any', look: 'chalkmark', solid: false, flat: true,
      lines: [IF({ notFlag: 'm6_w157_waited' }, 'A circle chalked on the ground: START. It has been rubbed out and drawn again many times, a little further off each time. Under it, smaller: “wait for me”.'),
        IF({ flag: 'm6_w157_waited' }, 'The chalk circle: START. Beside it now, two small chalky footprints, facing the same way as yours.')] }],
    mech: [{ type: 'standStill', mark: 'm6_w157_start', secs: 20, breakLine: 'You moved. The beginning shrugs, and goes back to changing.', flag: 'm6_w157_waited',
      reward: [{ secret: 'm6_the_start_waited' }],
      winLines: ['You wait on the start line. For once, the beginning waits with you.', 'Nothing changes. The trees stay where they are. It is the first time anything here has stayed.',
        'When you look down, there are two small footprints in the chalk beside yours. Whoever made them waited here too, a long time ago.'] }],
    rules: ['Somewhere in the forest (in a new place after each return), a chalk circle marked START: stand on it without moving for about twenty seconds (secret).']
  });

  /* ---------------------------------------------------------------
   *  W158 — The Lighthouse in the White (P3; lamp and W181 gate untouched)
   *  Puzzle: keep inside the lighthouse’s turning shadow (followShadow).
   *  Secret: a white buoy at the far edge, seen only through glass.
   * --------------------------------------------------------------- */
  MORE('W158', {
    place: [
      { id: 'm6_w158_buoy', type: 'decor', at: [42, 32], look: 'buoy', hiddenUntilReveal: true,
        lines: ['A white buoy at the far edge of the white, the kind that marks deep water. Through glass, it is the only thing out here with a shadow of its own.',
          { t: 'Tied to it with string, a child’s white mitten, frozen stiff, waiting for its other hand.', do: [{ secret: 'm6_white_buoy' }] }] },
      { id: 'm6_w158_prints', type: 'decor', at: { near: 'lamp', dx: 3, dy: 2 }, look: 'scuff', solid: false, flat: true,
        lines: ['Grey footprints in the white, going round the lighthouse in a ring. They only ever step where its shadow falls.'] },
      { id: 'm6_w158_door', type: 'decor', at: { near: 'lamp', dx: 0, dy: 1 }, look: 'door', lookOpt: { style: 'wood', c: ['#f4f4f4'] }, cond: { flag: 'm6_w158_shadow' },
        lines: ['A door in the foot of the lighthouse, white on white. You could only see it from inside the shadow.',
          'It does not open. On it, at a child’s height, pencil tally marks: hundreds of them, one for every night a light was left on for somebody still out at sea.'] },
      { id: 'm6_w158_specs', type: 'decor', at: 'random-any', look: 'glassespile', solid: false,
        lines: ['Somebody’s spectacles, folded and left in the white, lenses turned towards the far corner. Through them, the white has edges.'] }
    ],
    mech: [{ type: 'followShadow', center: [22, 16], r: 4, speed: 0.22, secs: 20, breakLine: 'You step out of the shadow, and the white closes over your footprints.', flag: 'm6_w158_shadow',
      reward: [{ secret: 'm6_inside_the_shadow' }],
      winLines: ['You walk inside the turning shadow until you are part of it.', 'From in here the white is not empty at all. It is full of grey footprints going round and round the lighthouse, all of them yours.',
        'At the foot of the tower, a door you had walked past a hundred times: white on white.'] }],
    rules: ['A shadow turns slowly around the lighthouse. Walk inside it, keeping up with it, for about twenty seconds: a white door appears at the foot of the tower, covered in tally marks (secret).',
      'Secret: with the Glasses’ pulse, a white buoy shows at the far south-east edge of the plain, a frozen mitten tied to it. Folded spectacles near the way in point that way.']
  });

  /* ---------------------------------------------------------------
   *  W159 — The True Statue (P4) · puzzle
   *  The blackbird stops halfway through Grandmother’s tune; play the end
   *  of it at the statue (melodyLock) → her watering can.
   * --------------------------------------------------------------- */
  MORE('W159', {
    place: [
      { id: 'm6_w159_score', type: 'decor', at: [14, 12], look: 'letter', solid: false, flat: true,
        lines: ['A sheet of music paper, rained soft, at the foot of the plinth. Four notes in pencil — sol, mi, sol, mi — and then the stave runs on empty, as if the rest had always been sung from memory.'] },
      { id: 'm6_w159_can', type: 'decor', at: [16, 12], look: 'wateringcan', cond: { flag: 'm6_w159_tune' },
        lines: ['A watering can, much too big for a child. The handle is worn smooth in two places, one high, one low.', 'Two hands used to carry it together. There is still a little water in it, warm from a sun that is not out.'] }
    ],
    mech: [{ type: 'melodyLock', mark: 'truestatue', tune: '120', dist: 4, flag: 'm6_w159_tune', reward: [{ secret: 'm6_end_of_the_tune' }],
      winLines: ['You play the end of the tune by the statue: re, mi, do.', 'On the plinth the blackbird takes it up and whistles the whole tune, all the way to the end, for the first time in years.',
        'Among the flowers at the foot of the statue, something has been set down where you can see it: a watering can, too big for a child.'] }],
    rules: ['The blackbird whistles the start of the grandmother’s lullaby and stops; a sheet of music at the plinth shows sol, mi, sol, mi. Play the rest (re, mi, do — or the whole lullaby) on the Melody near the statue: her watering can appears (secret).']
  });
  front('W159', ['m6_w159_score', 'm6_w159_can']);

  /* ---------------------------------------------------------------
   *  W160 — The Well of Names (P4) · puzzle
   *  Say the four names into the well (listen), then the fifth, of which
   *  only a letter stayed: “J” (sayTo) → the luggage label comes up.
   * --------------------------------------------------------------- */
  var NAMES = { m6_n_oksun: 1, m6_n_miran: 1, m6_n_sora: 1, m6_n_jaesik: 1 };
  function namesSaid() { var o = {}; Object.keys(NAMES).forEach(function (k) { o[k] = true; }); return { temp: o }; }
  function lastSaid(list) { return { fn: function () { var d = YN.save.dream; if (!d || !d.said || !d.said.length) return false; return list.indexOf(d.said[d.said.length - 1]) >= 0; } }; }
  MORE('W160', {
    place: [
      { id: 'm6_w160_rim', type: 'decor', at: [9, 13], look: 'pebbles', solid: false, flat: true, listenDist: 4,
        lines: ['Five names are scratched into the rim stone. Four are worn smooth by hands that have said them: a grandmother’s, a mother’s, your own, and an old man’s.', 'The fifth is only a letter: J.'],
        listen: [
          { match: ['ok sun', 'oksun', '옥순', '안옥순'], do: [{ temp: { m6_n_oksun: true } }], lines: ['The name goes down into the well. A moment later it floats back up, lighter, and stays at the rim.'] },
          { match: ['mi ran', 'miran', '미란', '김미란'], do: [{ temp: { m6_n_miran: true } }], lines: ['The well holds that name a long time before giving it back, the way you hold a hand that is very tired.'] },
          { match: ['sora', '소라'], do: [{ temp: { m6_n_sora: true } }], lines: ['Your own name goes down. It comes back up in two languages at once.'] },
          { match: ['jae sik', 'jaesik', '재식', '안재식'], do: [{ temp: { m6_n_jaesik: true } }], lines: ['Far below, someone answers “present”, very politely, and apologises for being late.'] }] },
      { id: 'm6_w160_label', type: 'decor', at: [10, 13], look: 'letter', solid: false, cond: { flag: 'm6_w160_j' },
        lines: ['A luggage label drying on the rim. One letter: J.', 'The string is still tied in a bow. Whoever cut it from the suitcase did it carefully.'] }
    ],
    mech: [{ type: 'sayTo', mark: 'm6_w160_rim', dist: 4, words: ['j', 'jay'], cond: { all: [namesSaid(), lastSaid(['j', 'jay'])] }, flag: 'm6_w160_j',
      reward: [{ secret: 'm6_the_letter_j' }],
      winLines: ['“J.”', 'Only a letter. The well takes it anyway, the way it takes everything.',
        'Something comes up from very deep down, hand over hand: a luggage label, soaked through. One letter on it: J.', 'On the back, in a child’s capitals: COME BACK TOMORROW.'] }],
    rules: ['Say the four names into the well, standing by the scratched rim stone: Ok-sun, Mi-ran, Sora, Jae-sik (any order). Then say the fifth, of which only a letter is left: “J”. A luggage label comes up from the well (secret).']
  });
  front('W160', ['m6_w160_rim', 'm6_w160_label']);

  /* ---------------------------------------------------------------
   *  W162 — The Sea of Milk (P4, vast: redrawn every visit) · puzzle + secret
   *  Puzzle: a kitchen washed up on an island; warm the milk the way Mum’s
   *  card says (sequence). The kitchen is drawn into the map by `post`.
   *  Secret: between 21:00 and midnight (real time), a cold carton.
   * --------------------------------------------------------------- */
  marksOf('W162', {
    P: { id: 'm6_w162_pan', type: 'decor', look: 'pot', lines: ['A milk pan.'] },
    Q: { id: 'm6_w162_flame', type: 'decor', look: 'campfire', light: 1.4, lines: ['A camping flame.'] },
    R: { id: 'm6_w162_honey', type: 'decor', look: 'jar', solid: false, lines: ['A honey jar.'] },
    S: { id: 'm6_w162_cup', type: 'decor', look: 'glass', solid: false, lines: ['A cup.'] },
    T: { id: 'm6_w162_card', type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A recipe card in your mother’s handwriting, soft with milk.', KS('우유 데우는 법. 하나, 냄비. 둘, 불. 셋, 꿀 한 숟가락. 넷, 컵.', 'How to warm milk. One: the pan. Two: the flame. Three: a spoonful of honey. Four: the cup.'),
        'Down the side of the card, four little drawings: a pan, a flame, a honey pot, a cup.'] },
    U: { id: 'm6_w162_rota', type: 'decor', look: 'clipboard', solid: false,
      lines: ['A staff rota, washed up on the sand: KIM M. — 21:00 TO 07:00. Every night but two.'] }
  });
  MORE('W162', {
    post: function (rows, r) { return stamp(rows, r, ['PQRT', '.SU.'], allOf('.')); },
    place: [{ id: 'm6_w162_carton', type: 'decor', at: 'random-hidden', look: 'crate', lookOpt: { c: ['#f4f0e8'] }, cond: { realHour: [21, 24] },
      lines: ['A carton of milk standing upright on the sand in a little cove, opened, cold to the touch.',
        { t: 'There is a lipstick mark on the spout. Someone drank from it standing up, at nine o’clock, on the way out to a night shift.', do: [{ secret: 'm6_cold_carton' }] }] }],
    mech: [{ type: 'sequence', order: ['m6_w162_pan', 'm6_w162_flame', 'm6_w162_honey', 'm6_w162_cup'],
      okLines: ['Milk into the pan. It is white all the way down, like the sea.', 'The flame catches: blue under white.', 'A spoonful of honey, turning slowly into gold.'],
      wrongLine: 'That is not how she did it. You start again from the pan.', doneLine: 'The cup is empty and still warm.', flag: 'm6_w162_milk',
      reward: [{ secret: 'm6_warm_milk' }, { collect: 'pages' }],
      winLines: ['You pour it into the cup. It steams.', 'Nobody has made this for you in a long time. You drink it standing up, and then you sit down and drink the rest sitting.',
        'Under the cup, folded small, a page from your mother’s notebook. Far out on the milk, someone switches off a light at the end of a shift.'] }],
    rules: ['On one island, a little kitchen: a pan, a flame, honey, a cup, and Mum’s recipe card. Use them in the card’s order (pan, flame, honey, cup) to warm the milk: a page of her notebook (collection, secret).',
      'Secret: between 21:00 and midnight real time (when the rota says her shift starts), an opened carton of milk stands in a cove, drunk standing up.']
  });

  /* ---------------------------------------------------------------
   *  W163 — The Body-House (P4) · puzzle + secret
   *  Puzzle: a mouth in the wall asks if she has had dinner; answer it (sayTo).
   *  Secret: as small as she once was (Tiny), the hollow that first held her.
   * --------------------------------------------------------------- */
  MORE('W163', {
    place: [
      { id: 'm6_w163_mouth', type: 'decor', at: 'random-any', look: 'mouth',
        lines: [KS('저녁은? 저녁은 먹었어?', 'Dinner? Did you have your dinner?'), 'The mouth in the wall waits for an answer. It has been asking every evening for twelve years.'] },
      { id: 'm6_w163_rice', type: 'decor', at: 'random-hidden', look: 'pot', cond: { flag: 'm6_w163_fed' },
        lines: ['A rice cooker in a fold of the wall, its little light glowing: KEEP WARM.', 'Inside, one bowl’s worth of rice, still warm, kept every evening for whoever comes home last.'] },
      { id: 'm6_w163_chart', type: 'decor', at: 'random-any', look: 'drawing', solid: false,
        lines: ['A growth chart drawn in pencil on the soft wall. The lowest mark is tiny, mouse-high, and dated before any birthday.', 'Beside it, in a child’s hand: “I was this small once. I fitted.”'] },
      { id: 'm6_w163_hollow', type: 'decor', at: 'random-hidden', look: 'blanketlump', solid: false, cond: { equipped: 'E13' },
        lines: ['A curled hollow in the wall, exactly your size now that you are this small. Warm, and lit red from outside, like a hand held over a torch.',
          { t: 'Someone scratched a year into the soft wall a long time ago: 2014.', do: [{ secret: 'm6_first_house' }] }] }
    ],
    mech: [{ type: 'sayTo', mark: 'm6_w163_mouth', dist: 3, words: ['yes', 'i ate', 'i have eaten', 'ive eaten', 'i ve eaten', 'i had dinner', '먹었어', '먹었어요'], flag: 'm6_w163_fed',
      doneLine: 'The mouth only smiles now. It has stopped asking.', reward: [{ secret: 'm6_have_you_eaten' }],
      winLines: ['The mouth smiles, a little crooked, the way you smile at a yes you are not sure is true.', KS('그래, 잘했어. 이제 자.', 'Good. Well done. Now go to sleep.'),
        'All the walls breathe out at once. Somewhere deep in the house, a little light comes on and stays on, keeping something warm.'] }],
    rules: ['A mouth in the wall asks whether she has had her dinner. Answer it (“yes”, “I ate”, “먹었어”) next to it: a rice cooker keeping a bowl warm appears in a fold of the house (secret).',
      'Secret: with the Tiny effect equipped, a curled hollow just her size appears in a nook, dated 2014. A growth chart on a wall hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W164 — The Forest of Eyes (P4) · puzzle + secret
   *  Puzzle: five eyes in a clearing never sleep; close them all before the
   *  first one opens again (lampsAll). The clearing is drawn by `post`.
   *  Secret: with the Pocket Mirror, what is behind her back.
   * --------------------------------------------------------------- */
  /* a clearing ringed by trees, four ways in; every eye has a trunk behind it (never in a one-cell gap) */
  var CLEARING = ['^^^^.^^^^', '^^1...2^^', '^3.....4^', '....N....', '^B.....^^', '^^^.5.^^^', '^^^.^^^^^'];
  var clearingFits = function (rows, x, y, pw, ph) {
    if (!airy('.', 0.6)(rows, x, y, pw, ph)) return false;
    return [[x + 4, y - 1], [x - 1, y + 3], [x + pw, y + 3], [x + 3, y + ph]].every(function (c) { return rows[c[1]] && rows[c[1]][c[0]] === '.'; });
  };
  var EYE = function (i) { return { id: 'm6_w164_eye' + i, type: 'decor', look: 'bigeye', animated: true, lines: ['An eye in a trunk, wide open.'] }; };
  marksOf('W164', {
    1: EYE(1), 2: EYE(2), 3: EYE(3), 4: EYE(4), 5: EYE(5),
    N: { id: 'm6_w164_note', type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A note in the middle of the clearing, in a careful adult hand: “Five of them never sleep. Close them the way you close a book you have finished: gently, one after the other, before the first one wakes.”'] },
    B: { id: 'm6_w164_bark', type: 'decor', look: 'deadtree', lines: ['Letters cut into the bark at eye level: LOOK BEHIND YOU — BUT NOT WITH YOUR EYES.'] }
  });
  MORE('W164', {
    post: function (rows, r) { return stamp(rows, r, CLEARING, clearingFits); },
    place: [{ id: 'm6_w164_behind', type: 'decor', at: 'random-hidden', look: 'tree', cond: { equipped: 'E21' },
      lines: ['In the little mirror, over your shoulder: a tree with every one of its eyes shut tight, as if there were something it did not want to see.',
        { t: 'At its roots, a school bag nobody has picked up. The name tag on the strap has been scribbled over so hard the pen went through.', do: [{ secret: 'm6_behind_your_back' }] }] }],
    mech: [{ type: 'lampsAll', lamps: ['m6_w164_eye1', 'm6_w164_eye2', 'm6_w164_eye3', 'm6_w164_eye4', 'm6_w164_eye5'], time: 45, light: 0.4, flag: 'm6_w164_shut',
      litLines: ['You stroke the lid shut. The eye lets you.', 'Another eye closes. The others are counting.', 'Shut. Behind you, the first one is thinking about opening again.'],
      onLine: 'This one is shut. It is listening instead.', doneLine: 'The eyes stay shut. They are only resting.',
      reward: [{ secret: 'm6_nobody_watching' }, { collect: 'cranes' }],
      winLines: ['The fifth eye closes.', 'For the first time in this forest, nothing is looking at you. It is so quiet you can hear your own heart.',
        'Between the trees, very softly, a voice you know asks if you are all right. Nobody is watching while you answer. At your feet, a paper crane.'] }],
    rules: ['Somewhere in the forest, a clearing ringed by five open eyes in the trunks, with a note in the middle. Close all five (interact) before the first opens again (45 seconds): a paper crane (collection, secret).',
      'Secret: with the Pocket Mirror equipped, a tree that keeps its eyes shut appears in a nook, a forgotten school bag at its roots. The bark in the clearing says to look behind, but not with your eyes.']
  });

  /* ---------------------------------------------------------------
   *  W165 — The Choir of Voices (P4) · puzzle
   *  The choirmistress beats four in a bar; walk the pattern of her baton
   *  (dirSequence): down, left, right, up.
   * --------------------------------------------------------------- */
  MORE('W165', {
    place: [{ id: 'm6_w165_stand', type: 'decor', at: [14, 7], look: 'pedestal',
      lines: ['A music stand turned towards the choir. On it, no music: a little cross drawn in pencil, numbered 1 at the bottom, 2 on the left, 3 on the right, 4 at the top.',
        'The choirmistress’s baton draws the same cross in the air, over and over, waiting for someone to follow it.'] }],
    mech: [{ type: 'dirSequence', ent: npcId('W165', 'The Choirmistress'), seq: ['down', 'left', 'right', 'up'], dist: 7, flag: 'm6_w165_bar',
      reward: [{ secret: 'm6_four_in_a_bar' }],
      winLines: ['Down, left, right, up. You follow the baton with your whole body.', 'On the fourth beat, every mouth in the floor stops singing its one note and sings yours instead.',
        'For a whole bar, the choir is the sound of a girl who does not speak, and it is very loud.'] }],
    rules: ['The choirmistress beats time: down, left, right, up (the music stand shows the cross). Standing a few steps from her, take one step in each of those directions, in that order: the whole choir sings her part (secret).']
  });
  front('W165', ['m6_w165_stand']);

  /* ---------------------------------------------------------------
   *  W166 — The Spiral (P4) · puzzle + secret
   *  Puzzle: at the centre, say the doctor’s word that nobody says (sayTo).
   *  Secret: walking it the wrong way (Reversed Step), what everyone steps over.
   * --------------------------------------------------------------- */
  MORE('W166', {
    place: [
      { id: 'm6_w166_letter', type: 'decor', at: [20, 3], look: 'letter', solid: false, flat: true,
        lines: ['A letter from a clinic, folded into eight. At the fold, only the first letter of a long word shows: D.'] },
      { id: 'm6_w166_pills', type: 'decor', at: [18, 9], look: 'pills', solid: false, flat: true,
        lines: ['A pill organiser, one little box for each day. Most of the boxes are still full.', 'On the lid, in marker: “for the tiredness”. Under it, in a doctor’s hand, a longer word, crossed out until it tore.'] },
      { id: 'm6_w166_centre', type: 'decor', at: [20, 21], look: 'glint', solid: false, flat: true,
        lines: [IF({ notFlag: 'm6_w166_said' }, 'The very middle. The floor dips here, as if everyone stopped on this spot, just before the end, and did not say it.'),
          IF({ flag: 'm6_w166_said' }, 'The middle. Somebody said it here, out loud. The floor has stopped dipping.')] },
      { id: 'm6_w166_arrow', type: 'decor', at: [8, 1], look: 'chalkmark', solid: false, flat: true,
        lines: ['An arrow chalked on the floor, pointing back the way you came in. Under it: “some things you only see on the way out.”'] },
      { id: 'm6_w166_envelopes', type: 'decor', at: [6, 1], look: 'trash', solid: false, cond: { equipped: 'E55' },
        lines: ['Walking the wrong way round, you see what everyone steps over on the way in: a bin bag full of envelopes from the same clinic, all unopened.',
          'On the top one, in your mother’s handwriting:', { t: '나중에.', lang: 'ko-s', tr: 'Later.', do: [{ secret: 'm6_unopened_letters' }] }] }
    ],
    mech: [{ type: 'sayTo', mark: 'm6_w166_centre', dist: 3, words: ['depression', 'depressed', '우울증', '우울해', '우울'], flag: 'm6_w166_said',
      reward: [{ secret: 'm6_the_word' }],
      winLines: ['You say it. Only a word: the doctor’s long word.', 'It goes round the spiral once, all the way out, and comes back smaller. It has been said, out loud, by someone.',
        'Nothing is cured. But the walls have stopped turning.'] }],
    rules: ['At the very centre of the spiral (beside the hole), say the long word the doctor used and nobody else does — “depression” (the clinic letter shows a D, the pill box says “for the tiredness”): the spiral stops turning (secret).',
      'Secret: with the Reversed Step equipped, a bag of unopened clinic letters appears near the entrance, where a chalk arrow points back out.']
  });
  front('W166', ['m6_w166_letter', 'm6_w166_pills', 'm6_w166_centre', 'm6_w166_arrow', 'm6_w166_envelopes']);

  /* ---------------------------------------------------------------
   *  W167 — The Garden of Nameless Colours (P4) · puzzle + secret
   *  Puzzle: a flower runs through colours; touch it while it has no name
   *  (cycleFrames).
   *  Secret: with the window open at home, the wind turns the petals over.
   * --------------------------------------------------------------- */
  MORE('W167', {
    place: [
      { id: 'm6_w167_flower', type: 'decor', at: 'random-any', look: 'flower', lines: ['A flower.'] },
      { id: 'm6_w167_grass', type: 'decor', at: 'random-any', look: 'tuft', solid: false,
        lines: ['Every blade of grass in this patch leans the same way, as if a window were open somewhere. There is no window here. There could be.'] },
      { id: 'm6_w167_petals', type: 'decor', at: 'random-hidden', look: 'flowers', solid: false, cond: { roomWindow: true },
        lines: ['The wind from an open window has got in here and turned the petals of this bed over.', 'Under every petal, a colour name in a child’s handwriting — red, sky, plum, grass — each one crossed out.',
          { t: 'One petal has nothing under it but a note: “ask the flower”.', do: [{ secret: 'm6_crossed_out_colours' }] }] }
    ],
    mech: [{ type: 'cycleFrames', mark: 'm6_w167_flower', every: 2,
      frames: ['It is red. The word sits on it like a hat that is too small.', 'It is blue. It goes a little grey under the name.', 'It is green. You think the word and it wilts slightly.',
        'It is a colour you have no word for. It holds very still.', 'It is yellow. It flinches when you look at it.'], good: 3, flag: 'm6_w167_kept',
      doneLine: 'The flower keeps the colour that has no name. It does not need you to call it anything.', reward: [{ secret: 'm6_kept_nameless' }],
      winLines: ['You touch it while it has no name.', 'It stays. It does not have to become anything for you to keep looking at it.',
        'In your palm, a seed of the same colour. You could never tell anyone what colour it is, and that is fine.'] }],
    rules: ['One flower keeps changing colour every two seconds. Touch it while it is the colour that has no word: it stays that way (secret).',
      'Secret: when her bedroom window at home is open, a bed of flowers in a nook has its petals turned over by the wind, showing crossed-out colour names. Grass leaning towards a missing window hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W168 — The Museum of Mothers (P4) · puzzle + secret
   *  Puzzle: the empty plinth answers in a mother’s words; say the word
   *  back (echo) → a new exhibit: “She leaves it on.”
   *  Secret: the children’s wing, through the east wall (fake wall).
   * --------------------------------------------------------------- */
  MORE('W168', {
    post: function (rows) { return rows.map(function (s, y) { return s + (y >= 7 && y <= 12 ? '......##' : '########'); }); },
    fakeWalls: [[39, 10]],
    place: [
      { id: 'm6_w168_plinth', type: 'decor', at: [30, 15], look: 'pedestal', lookIf: [{ cond: { flag: 'm6_w168_exhibit' }, look: 'statue' }],
        lines: [IF({ notFlag: 'm6_w168_exhibit' }, 'An empty plinth with a blank plaque. The museum is waiting for one more mother, and for someone to say what she always says.'),
          IF({ flag: 'm6_w168_exhibit' }, 'A woman in a coat over her uniform, one hand on the light switch of a child’s room. Plaque: “She leaves it on.”')] },
      { id: 'm6_w168_sign', type: 'decor', at: [38, 1], look: 'poster', solid: false,
        lines: ['A museum sign: CHILDREN’S WING →. The arrow points straight at the east wall.'] },
      { id: 'm6_w168_hands', type: 'decor', at: [38, 10], look: 'scuff', solid: false, flat: true,
        lines: ['Small handprints on the marble at the foot of the east wall, at a child’s height. Lots of them, all pushing the same way.'] },
      { id: 'm6_w168_drawings', type: 'decor', at: [42, 7], look: 'drawing',
        lines: ['The children’s wing. Drawings pinned at a child’s height: mothers with phones for heads, mothers asleep on buses, a mother made entirely of a coat.',
          'One drawing is very careful: a woman in a doorway, the light of the corridor behind her. Underneath: “mine”.'] },
      { id: 'm6_w168_bench', type: 'decor', at: [44, 10], look: 'bench', lines: ['A low bench for small visitors. A school jumper has been left folded on it, as if its owner meant to come back.'] },
      { id: 'm6_w168_book', type: 'decor', at: [45, 12], look: 'book',
        lines: ['The visitors’ book of the children’s wing. Every entry is in a child’s handwriting.',
          { t: '“I understand her now. I am still angry.” Underneath, in other hands: “me too”, “me too”, “me too”. A photograph has been slipped between the pages.', do: [{ secret: 'm6_childrens_wing' }, { collect: 'photos' }] }] }
    ],
    mech: [{ type: 'echo', zone: [28, 13, 32, 17], words: ['sorry', 'soon', 'promise', 'tired', 'busy', 'next week', 'eat first', 'go to sleep'], flag: 'm6_w168_exhibit',
      reward: [{ secret: 'm6_she_leaves_it_on' }],
      winLines: ['You say it back to the empty plinth, in her voice, without meaning to.',
        'Something takes shape on it: a woman in a coat over her uniform, one hand on the light switch of a child’s doorway. She does not switch it off.', 'The plaque fills itself in: “She leaves it on.”'] }],
    rules: ['Speak anything beside the empty plinth (south-east of the hall): it answers with one of a mother’s words. Say that word back to it: a new exhibit appears, “She leaves it on” (secret).',
      'Secret: the sign CHILDREN’S WING points at the east wall, where small handprints push. The wall can be walked through: drawings, a bench and a visitors’ book with a photograph in it (collection).']
  });
  front('W168', ['m6_w168_plinth', 'm6_w168_sign', 'm6_w168_hands', 'm6_w168_drawings', 'm6_w168_bench', 'm6_w168_book']);

  /* ---------------------------------------------------------------
   *  W169 — The Land of Fruit (P3) · puzzle + secret
   *  Puzzle: two the same make one bigger — match the fruit hidden under
   *  six boxes (pairs). The boxes are drawn into the field by `post`.
   *  Secret: with the Token, a cabinet half grown into a hedge.
   * --------------------------------------------------------------- */
  var BOX = function (i) { return { id: 'm6_w169_box' + i, type: 'decor', look: 'crate', lookOpt: { c: ['#c88a4a'] }, lines: ['A fruit box.'] }; };
  marksOf('W169', {
    A: BOX(1), B: BOX(2), C: BOX(3), D: BOX(4), E: BOX(5), F: BOX(6),
    G: { id: 'm6_w169_rule', type: 'decor', look: 'chalkmark', solid: false, flat: true, lines: ['Chalked on the grass between the fruit boxes: TWO THE SAME MAKE ONE BIGGER. TWO DIFFERENT MAKE NOTHING.'] },
    H: { id: 'm6_w169_stump', type: 'decor', look: 'stump', lines: ['A tree stump with a coin slot cut into it, rusty, as if the tree had grown round an old machine. The slot is just the size of a token.'] }
  });
  MORE('W169', {
    post: function (rows, r) { return stamp(rows, r, ['A.B.C', 'H.G..', 'D.E.F'], allOf('.')); },
    place: [{ id: 'm6_w169_cabinet', type: 'decor', at: 'random-hidden', look: 'arcade', cond: { equipped: 'E17' },
      lines: ['Half grown into the hedge, an arcade cabinet you could not see before, its screen glowing green. Your token fits the slot.',
        { t: 'CONTINUE? 9… 8… 7… On the high-score table, your initial at the top. Under it, entered letter by letter by somebody else: HALMEONI. Someone has been playing the second player for you.', do: [{ secret: 'm6_second_player' }] }] }],
    mech: [{ type: 'pairs', tiles: ['m6_w169_box1', 'm6_w169_box2', 'm6_w169_box3', 'm6_w169_box4', 'm6_w169_box5', 'm6_w169_box6'], flag: 'm6_w169_merged',
      wrongLine: 'Two different fruits. They roll back under their boxes and sulk.', doneLine: 'The boxes are empty. Everything has merged into everything else.',
      reward: [{ secret: 'm6_merged' }],
      winLines: ['The last two fruits roll together and become one bigger fruit, with a soft pop, like a game played a thousand times alone.',
        'Somewhere a score goes up. For once, the screen in the sky does not say GAME OVER. It says: TWO PLAYERS.'] }],
    rules: ['Somewhere in the field, six fruit boxes with a chalked rule between them. Lift them two at a time: each hides a fruit, and two the same merge. Match all three pairs (secret).',
      'Secret: with the Token equipped, an arcade cabinet appears half grown into a hedge in a nook, its high-score table shared with HALMEONI. The stump with a coin slot by the boxes hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W170 — The Watermelon (P4) · puzzle + secret
   *  Puzzle: trap the rolling pip against a seed (corner) → a soft place.
   *  Secret: plant it there with the Sprout → a watermelon summer.
   * --------------------------------------------------------------- */
  MORE('W170', {
    place: [
      { id: 'm6_w170_dots', type: 'decor', at: [9, 17], look: 'crumbs2', solid: false, flat: true,
        lines: ['A trail of sticky dots between the seeds, where something small keeps rolling into corners and out again.'] },
      { id: 'm6_w170_soft', type: 'decor', at: [11, 13], look: 'scuff', solid: false, flat: true, cond: { flag: 'm6_w170_pip' },
        lines: [IF({ notFlag: 'm6_w170_vine' }, 'A soft place in the red, near the middle, just the size of a pip. The ground here would take a seed, if somebody planted one.'),
          IF({ flag: 'm6_w170_vine' }, 'The vine grows out of the soft place now, curling towards you.')],
        onEffect: { E01: [{ set: { m6_w170_vine: true } }, { reeval: true }, { lines: ['You press the pip into the soft place and plant it. The red closes over it like a mouth over a secret.'] }] } },
      { id: 'm6_w170_vine', type: 'decor', at: [12, 13], look: 'sprout', cond: { flag: 'm6_w170_vine' },
        lines: ['A watermelon vine, grown in one breath, as fast as a summer. At the end of it, a watermelon the size of a fist.',
          { t: 'It is already cut into triangles. The biggest piece has been put aside for you. Somebody said they were not hungry.', do: [{ secret: 'm6_biggest_piece' }] }] }
    ],
    mech: [{ type: 'corner', ent: npcId('W170', 'A Rolling Pip'), flag: 'm6_w170_pip', reward: [{ secret: 'm6_caught_the_pip' }],
      winLines: ['You trap the pip against a seed. It stops rolling and lets you pick it up. It is warm and slightly sticky.',
        'Near the middle of the red, something you had not noticed: a soft place, exactly the size of a pip.'] }],
    rules: ['A black pip rolls about among the seeds. Trap it against the seed rocks so that it cannot roll away: she picks it up, and a soft place appears near the middle (secret).',
      'Secret: use the Sprout on the soft place to plant the pip: a vine grows a fist-sized watermelon, already cut, the biggest piece kept for her.']
  });
  front('W170', ['m6_w170_dots', 'm6_w170_soft', 'm6_w170_vine']);

  /* ---------------------------------------------------------------
   *  W171 — Mi-ran’s Sleep (P4) · puzzle
   *  Do her rounds for her: answer the five call lights before the first
   *  one rings again (lampsAll) → she can sit down.
   * --------------------------------------------------------------- */
  var CALL = ['m6_w171_call1', 'm6_w171_call2', 'm6_w171_call3', 'm6_w171_call4', 'm6_w171_call5'];
  MORE('W171', {
    place: CALL.map(function (id) { return { id: id, type: 'decor', at: 'random-any', look: 'lamp', lines: ['A call light by a bed, blinking red.'] }; }).concat([
      { id: 'm6_w171_board', type: 'decor', at: 'random-any', look: 'board',
        lines: ['A whiteboard from a nurses’ station, in tired capitals: FIVE CALL LIGHTS. IF YOU ARE SLOW, THEY RING AGAIN. IF YOU ARE QUICK, I CAN SIT DOWN. — K.M.'] },
      { id: 'm6_w171_chair', type: 'decor', at: 'random-hidden', look: 'chair', cond: { flag: 'm6_w171_rounds' },
        lines: ['A plastic chair in a corner of the corridor, still warm, a cardigan over its back.',
          'In the cardigan pocket, a child’s drawing folded small: a nurse asleep on a chair, and a little girl doing the rounds for her.'] }]),
    mech: [{ type: 'lampsAll', lamps: CALL, time: 80, light: 1.6, flag: 'm6_w171_rounds',
      litLines: ['You answer the call. The light over the bed turns from red to a calm white.', 'Answered. Down the corridor, another one is already blinking.', 'Another patient sighs and goes back to sleep. Your legs ache the way hers must.'],
      onLine: 'Answered already. For now.', doneLine: 'The call lights are quiet. Nobody needs anybody for a while.',
      reward: [{ secret: 'm6_her_rounds' }],
      winLines: ['The last call light turns white.', 'For a moment, nobody needs anyone. The corridor is quiet from one end to the other.',
        'Somewhere a chair creaks: someone sits down, very tired, and this time stays sitting. The flashlight clicks off.'] }],
    rules: ['Five call lights blink red by beds around the night corridors. Answer all five (interact) before the first starts ringing again (80 seconds), as the nurses’ whiteboard says: her mother can sit down, and her chair appears in a corner (secret).']
  });

  /* ---------------------------------------------------------------
   *  W172 — The Bedroom of 2044 (P4) · puzzle + secret
   *  Puzzle: sit by the bed and stay (standStill): somebody stayed.
   *  Secret: when the light at home is off, a blanket fort lights up.
   * --------------------------------------------------------------- */
  MORE('W172', {
    place: [
      { id: 'm6_w172_rug', type: 'decor', at: [8, 7], look: 'scuff', solid: false, flat: true,
        lines: [IF({ notFlag: 'm6_w172_stayed' }, 'A dip in the rug beside the bed, as if somebody used to sit here every night until the child was asleep. Nobody has sat here for a long time.'),
          IF({ flag: 'm6_w172_stayed' }, 'The dip in the rug is warm now.')] },
      { id: 'm6_w172_switch', type: 'decor', at: [2, 1], look: 'switch', solid: false,
        lines: ['The light switch by the door has been taped down in the ON position. On the tape, in marker: DON’T.', 'In 2044, nobody switches this light off. At home, somebody still does.'] },
      { id: 'm6_w172_fort', type: 'decor', at: [16, 11], look: 'blanketlump', cond: { roomLight: false },
        lines: ['With the light at home switched off, something here lights up in answer: a blanket fort made of two chairs, glowing from inside.',
          { t: 'Inside, by torchlight, a drawing for the mother, just finished: two people at a table, eating, both with real faces.', do: [{ secret: 'm6_blanket_fort' }] }] }
    ],
    mech: [{ type: 'standStill', mark: 'm6_w172_rug', secs: 25, breakLine: 'You moved. The child half wakes and reaches for the tablet again.', flag: 'm6_w172_stayed',
      reward: [{ secret: 'm6_somebody_stayed' }],
      winLines: ['You sit on the rug by the bed and stay. That is all.', 'The child stops checking the tablet. The hologram bear finishes its story and, for once, does not start it again.',
        'The child falls properly asleep. The light is still on, but not because nobody is there.'] }],
    rules: ['Sit in the dip in the rug beside the bed and stay still for about twenty-five seconds: the child falls properly asleep (secret).',
      'Secret: when the bedroom light at home is off, a glowing blanket fort appears in the far corner, a drawing for the mother inside. The taped-down switch by the door hints at it.']
  });
  front('W172', ['m6_w172_rug', 'm6_w172_switch', 'm6_w172_fort']);

  /* ---------------------------------------------------------------
   *  W173 — The Station with No North (P4) · puzzle + secret
   *  Puzzle: give the NORTH line its time, 23:71, on four flaps (dials).
   *  Secret: platform zero, through the south wall (fake wall).
   * --------------------------------------------------------------- */
  var FLAPS = ['m6_w173_flap1', 'm6_w173_flap2', 'm6_w173_flap3', 'm6_w173_flap4'];
  var ROW = function (a, b, c) { var s = ''; for (var i = 0; i < 56; i++) s += i < 18 ? a : i < 38 ? b : c; return s; };
  MORE('W173', {
    post: function (rows) { return rows.concat([ROW('#', '.', '#'), ROW('#', '.', '#'), ROW('#', ',', '#'), ROW('#', 'r', '#'), ROW('#', '#', '#')]); },
    fakeWalls: [[27, 13]],
    place: FLAPS.map(function (id, i) { return { id: id, type: 'decor', at: [12 + i, 1], look: 'board', lines: ['A blank flap.'] }; }).concat([
      { id: 'm6_w173_plate', type: 'decor', at: [11, 1], look: 'poster', solid: false,
        lines: ['A small enamel plate beside four blank flaps: NORTH — DEPARTURE. The flaps turn when you touch them.'] },
      { id: 'm6_w173_stub', type: 'decor', at: [27, 12], look: 'scraps', solid: false, flat: true,
        lines: ['A ticket stub on the floor by the south wall. 1951. NORTH. Departure 23:7…, the last figure rubbed away by a thumb that held it for a very long time.',
          'Cold air comes up through the wall here, smelling of coal smoke and snow.'] },
      { id: 'm6_w173_train', type: 'decor', at: [27, 17], look: 'train',
        lines: [IF({ notFlag: 'm6_w173_north' }, 'An old train on a platform nobody uses. Its board says NORTH. Its windows are dark. It has no departure time.'),
          IF({ flag: 'm6_w173_north' }, 'The old train has its lamps lit. Its board says NORTH — 23:71. The doors stay shut, politely.')] },
      { id: 'm6_w173_bench', type: 'decor', at: [22, 14], look: 'bench',
        lines: ['A bench on platform zero. On it, a lunch tin wrapped in a cloth, for someone who was going to come back on the next train.'] },
      { id: 'm6_w173_letter', type: 'decor', at: [23, 14], look: 'letter', solid: false, cond: { flag: 'm6_w173_north' },
        lines: ['A letter beside the lunch tin, addressed in old-fashioned writing: “to my little sister, in the south”.', KN('옥순아, 일없다. 다 일없다.', 'Ok-sun, it’s all right. Everything is all right.'),
          { t: 'It was never posted. Tonight, at 23:71, it will go.', do: [{ secret: 'm6_platform_zero' }] }] }]),
    mech: [{ type: 'dials', marks: FLAPS, states: 10, target: [2, 3, 7, 1], labelText: 'NORTH — ', flag: 'm6_w173_north',
      doneLine: 'NORTH — 23:71. The flaps will not turn any more.', reward: [{ secret: 'm6_twenty_three_seventy_one' }],
      winLines: ['The four flaps settle: 23:71.', 'With a noise like a held breath, the NORTH line on the board gets a departure time at last. It is a time that does not exist. It is the only one that would ever do.',
        'Under the platform, something heavy shifts, as if a train had been waiting down there since 1951 for permission.'] }],
    rules: ['Four blank flaps beside a NORTH — DEPARTURE plate: each turns through 0–9. Set them to 23:71 (the stub by the south wall shows 23:7…): the NORTH line gets its impossible time (secret).',
      'Secret: by the stub, cold air comes through the south wall, which can be walked through onto platform zero: an old northbound train and a bench; once the time is set, a letter to Ok-sun lies there.']
  });
  front('W173', FLAPS.concat(['m6_w173_plate', 'm6_w173_stub', 'm6_w173_train', 'm6_w173_bench', 'm6_w173_letter']));

  /* ---------------------------------------------------------------
   *  W174 — The Kaleidoscope (P4, shifting) · puzzle + secret
   *  Puzzle: hold the eyepiece still at the moment the family is whole
   *  (cycleFrames). Secret: on every seventh turn, a photograph.
   * --------------------------------------------------------------- */
  MORE('W174', {
    place: [
      { id: 'm6_w174_eyepiece', type: 'decor', at: 'random-any', look: 'telescope', lines: ['An eyepiece.'] },
      { id: 'm6_w174_tally', type: 'decor', at: 'random-any', look: 'glint', solid: false, flat: true,
        lines: ['A shard with seven little lines scratched on it, and a heart after the seventh.'] },
      { id: 'm6_w174_photo', type: 'decor', at: 'random-hidden', look: 'photo',
        cond: { fn: function () { var n = YN.save.temp('shift_W174') || 0; return n > 0 && n % 7 === 0; } },
        lines: ['A photograph caught between two mirrors, only now, only on this turn: three people on a beach in winter, squinting.',
          { t: 'The man is holding the camera out at arm’s length, so that nobody has to be left out of the picture. On the next turn it will be gone.', do: [{ secret: 'm6_seventh_turn' }] }] }
    ],
    mech: [{ type: 'cycleFrames', mark: 'm6_w174_eyepiece', every: 2.2, good: 3,
      frames: ['Through the eyepiece: three shards, a table, two bowls.', 'Through the eyepiece: a suitcase, turning, turning.', 'Through the eyepiece: four bowls, four chairs, nobody sitting.',
        'Through the eyepiece: a man, a woman and a child at one table. Every piece is where it belongs.', 'Through the eyepiece: a lamp, on, all by itself.'],
      flag: 'm6_w174_whole', doneLine: 'Through the eyepiece, the pieces turn as they like. You saw them whole once. That stays.', reward: [{ secret: 'm6_held_still' }],
      winLines: ['You hold the kaleidoscope still at exactly that moment.', 'The pieces stop: a man, a woman, a child, a table. Then the man’s piece slides out of the picture, very gently, the way it always does.',
        'But you saw it whole. Nobody can turn that back.'] }],
    rules: ['An eyepiece shows a different arrangement every two seconds. Use it while it shows the man, the woman and the child at one table (secret).',
      'Secret: on every seventh turn of the kaleidoscope (it turns every 20 seconds), a photograph of three people on a winter beach appears in a nook, for one turn only. A shard with seven marks hints at it.']
  });

  /* ---------------------------------------------------------------
   *  W175 — The Stairs of Flesh (P4) · puzzle + secret
   *  Puzzle: four steps carry Korean numbers; step on them in counting
   *  order, up and down the stairs (stepOrder), so the woman can finish.
   *  Secret: a warm hollow off the side of the stairs (fake void cell).
   * --------------------------------------------------------------- */
  var NUM = [['m6_w175_one', [10, 26], '하나.', 'One.'], ['m6_w175_two', [10, 12], '둘.', 'Two.'], ['m6_w175_three', [9, 38], '셋.', 'Three.'], ['m6_w175_four', [5, 44], '넷.', 'Four.']];
  var PLATES = {}; NUM.forEach(function (n, i) { PLATES[n[1][0] + ',' + n[1][1]] = i; });
  MORE('W175', {
    post: function (rows) { return rows.map(function (s, y) { return y >= 30 && y <= 32 ? s.slice(0, 18) + 'sss' + s.slice(21) : s; }); },
    fakeWalls: [[17, 31]],
    place: NUM.map(function (n) { return { id: n[0], type: 'decor', at: n[1], look: 'chalkmark', solid: false, flat: true, lines: ['A word is written on this step in something dark, in Korean.', { t: n[2], lang: 'ko-s', tr: n[3] }] }; }).concat([
      { id: 'm6_w175_ear', type: 'decor', at: [13, 6], look: 'heart', solid: false, animated: true,
        lines: ['One step is beating. You put your ear to it.', 'Under it, a woman is counting under her breath in Korean, losing her place, starting again from one. If somebody stepped on the numbered steps with her, in order, she might get to the end.'] },
      { id: 'm6_w175_warm', type: 'decor', at: [16, 31], look: 'scuff', solid: false, flat: true,
        lines: ['The edge of this step is warm, much warmer than the rest, as if something just past the dark were breathing very close.'] },
      { id: 'm6_w175_hollow', type: 'decor', at: [20, 31], look: 'blanketlump',
        lines: ['A warm hollow off the side of the stairs, where someone has curled up before. It is exactly the size of a child who has stopped counting.',
          { t: 'Pressed into the soft wall: a hospital wristband, tiny, the kind they put on newborns. KIM — BABY GIRL — 2014.', do: [{ secret: 'm6_warm_hollow' }] }] }]),
    mech: [{ type: 'stepOrder', plates: PLATES, count: 4, color: 'rgba(255,200,210,0.9)', flag: 'm6_w175_counted', reward: [{ secret: 'm6_counted_to_four' }],
      winLines: ['You step on the fourth number, and for the first time the counting reaches four.', KS('…넷. 다 셌다.', '…Four. That is all of them counted.'),
        'The stairs go quiet, the way a body goes quiet when it finally falls asleep.'] }],
    rules: ['Four steps carry a Korean number (하나 one, 둘 two, 셋 three, 넷 four), out of order down the stairs. Step on them in counting order — one, then back up to two, then down to three and four: the counting woman reaches the end (secret).',
      'Secret: halfway down, one step is warm on its right-hand edge; step off it into the dark there, into a warm hollow with a newborn’s wristband.']
  });
  front('W175', NUM.map(function (n) { return n[0]; }).concat(['m6_w175_ear', 'm6_w175_warm', 'm6_w175_hollow']));
})(typeof window !== 'undefined' ? window : globalThis);
