/* =========================================================================
 *  MORE (02) — puzzles and secrets added to the core worlds W021–W040
 *  (YN.kit.more, see _more_kit.js). Nothing existing is moved or changed:
 *  only new marks, mechanics, hidden rooms carved into solid/void space
 *  (fakeWalls + post), and rules lines for the wiki.
 *  NPC ids N2120–N2139 · flags / temps / secrets prefixed m2_.
 *  No new effects, no new doors.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, MORE = YN.kit.more;
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, who) { var o = { t: t, lang: 'en' }; if (who) o.who = who; return o; }
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  /* a decor mark; o = extra fields */
  function D(id, at, look, lines, o) { return Object.assign({ id: id, type: 'decor', at: at, look: look, lines: lines }, o || {}); }
  var FLAT = { solid: false, flat: true };
  function F(o) { return Object.assign({}, FLAT, o || {}); }
  function wagon() { return YN.save.temp('wagon') || 0; }

  /* ---- map helpers (rows are strings) ---- */
  function pad(rows) { var w = 0; rows.forEach(function (r) { w = Math.max(w, r.length); }); return rows.map(function (r) { while (r.length < w) r += ' '; return r; }); }
  function widen(rows, n) { return pad(rows).map(function (r) { return r + new Array(n + 1).join('#'); }); }
  function deepen(rows, n) { rows = pad(rows); var w = rows[0].length, out = rows.slice(); for (var i = 0; i < n; i++) out.push(new Array(w + 1).join('#')); return out; }
  /* a small room: floor fl inside the rectangle, walls around it (only where there was void) */
  function carve(rows, x0, y0, w, h, fl) {
    var g = pad(rows).map(function (r) { return r.split(''); });
    for (var y = y0 - 1; y <= y0 + h; y++) for (var x = x0 - 1; x <= x0 + w; x++) {
      if (!g[y] || g[y][x] === undefined) continue;
      if (x >= x0 && x < x0 + w && y >= y0 && y < y0 + h) g[y][x] = fl || '.';
      else if (g[y][x] === ' ') g[y][x] = '#';
    }
    return g.map(function (r) { return r.join(''); });
  }
  function put(rows, cells, ch) {
    var g = pad(rows).map(function (r) { return r.split(''); });
    cells.forEach(function (c) { if (g[c[1]] && g[c[1]][c[0]] !== undefined) g[c[1]][c[0]] = ch; });
    return g.map(function (r) { return r.join(''); });
  }

  /* ======================= W021 — THE ROOTS =======================
   * Puzzle: follow the mole's claw prints (trail) to the biggest root -> a left shoe.
   * Secrets: a buried kimchi cellar behind a dead end (fake wall) · the slips of
   * unsaid words listen · a plum stone sprouts when the bedroom light is off. */
  MORE('W021', {
    fakeWalls: [[38, 4]],
    post: function (rows) { return carve(rows, 37, 1, 3, 3, ','); },
    place: [
      D('m2_draught', [38, 5], 'crack', ['The burrow ends in a cold patch of rock. A draught comes through it that smells of garlic and brine, the way a kitchen smells in November.'], FLAT),
      D('m2_onggi', [38, 2], 'onggi', [{ t: 'Two earthenware jars buried up to their necks, the way kimchi is kept through the winter. Chalked on one lid: 2023. Nobody ever came down to open it. Tucked under the lid, dry, a photograph.',
        do: [{ secret: 'm2_roots_onggi' }, { collect: 'photos' }] }], { solid: true }),
      D('m2_unsaid', [1, 24], 'scraps', ['Folded slips of paper pushed into the soil like seeds, dozens of them. Each one has a single word on it, too small to read. There is room for one more.'], F({
        listen: [{ match: ['sorry', 'im sorry', 'i am sorry', '미안해', '미안해요', '미안', 'i miss you', '보고 싶어', '보고싶어', 'dont go', 'don t go', 'stay', '가지 마', '가지마'],
          lines: ['You say it to the soil, very quietly.', 'Nothing answers. But a root as thin as a hair curls out of the dark and closes around the word, the way a hand closes around a seed.', 'Down here, it will be kept.'],
          do: [{ secret: 'm2_roots_unsaid' }] }] })),
      D('m2_plums', [27, 32], 'pebbles', [IF({ roomLight: true }, 'Plum stones pressed into the soil in rows, more than seventy of them. Not one has come up. Even down here it is not dark enough: somewhere above, a light is still on.'),
        IF({ roomLight: false }, 'Plum stones pressed into the soil in rows, more than seventy of them: one for every year she waited.')], FLAT),
      D('m2_plumsprout', [27, 31], 'sprout', [{ t: 'One of the plum stones has split in the dark. A pale shoot no longer than a finger leans towards nothing at all. She would have counted it. One.', do: [{ secret: 'm2_roots_plum' }] }],
        { solid: false, cond: { roomLight: false } }),
      D('m2_molehill', [14, 37], 'pebbles', ['A fresh molehill at the very end of the burrow. Tiny claw prints lead away from it into the dark, perfectly straight, as if they knew exactly where they were going.'], FLAT),
      D('m2_bigroot', [42, 29], 'stump', [IF({ notFlag: 'm2_roots_trail' }, 'The biggest root of all, as thick as a body, curling down into the soil. Little claw marks all round its foot, as if something had started to dig here and lost its nerve.'),
        IF({ flag: 'm2_roots_trail' }, 'The biggest root. At its foot, the soil the mole turned over is still soft.')], { solid: true }),
      D('m2_shoe', [43, 28], 'shoe', [{ t: 'A child’s shoe, half dug out from under the root. A left shoe, very old, the kind with a strap. The soil has kept it the way soil keeps everything down here: patiently.', do: [{ secret: 'm2_roots_shoe' }] }],
        { solid: false, cond: { flag: 'm2_roots_trail' } })
    ],
    mech: [{ type: 'trail', from: 'm2_molehill', to: 'm2_bigroot', slack: 1, lostLine: 'The claw prints are gone. You have lost the mole’s way.',
      done: { flag: 'm2_roots_trail' }, reward: [{ set: { m2_roots_trail: true } }],
      winLines: ['The claw prints end at the foot of the biggest root.', 'The soil there has been turned over, very gently, by something small and blind that knew what it was looking for.', 'Something pale shows under the earth.'] }],
    rules: ['Puzzle: tiny claw prints lead from the molehill at the southern tip of the burrows to the biggest root, at the eastern dead end. Follow them all the way without straying: a child’s left shoe is dug up at the foot of the root.',
      'Secret: the dead end just east of the climb to the waterfall (a cold draught that smells of brine) can be walked through. Behind it, a buried kimchi cellar with two onggi jars (and a photograph).',
      'Secret: near the folded paper slips at the western tip of the burrows, say a word that was never said (“sorry”, “I miss you”, “stay”, 미안해…).',
      'Secret: with the Bedroom light off, one of the plum stones in the southern chamber, beside the hole, has sprouted.']
  });

  /* ======================= W022 — THE ENDLESS CARRIAGE =======================
   * Puzzle: the lights pass four little windows in the same order (sequence) -> a biscuit.
   * Secrets: carriage 3 keeps a cardigan (carriage number) · the inspector's punch,
   * only seen with a ticket ready · the Hourglass stops the lights at a window. */
  var CAR_LABEL = 'A luggage label tied to the rack, written in a tired hand: CAR 3 — WINDOW SEAT — WAKE ME AT THE HOSPITAL.';
  MORE('W022', {
    place: [
      D('m2_w5', [5, 0], 'window', ['A small window. Outside, a light goes by, then the dark, then a light.'], { lookOpt: { night: true } }),
      D('m2_w15', [15, 0], 'window', ['Your breath on the glass. A light passes through it, as if through you.'], { lookOpt: { night: true } }),
      D('m2_w25', [25, 0], 'window', ['A small window above an empty seat. The lights outside are not stations. Nobody knows what they are.'], { lookOpt: { night: true },
        onEffect: { E23: [{ lines: ['You turn the hourglass. Outside, the lights stop dead.', 'For five seconds, one of them hangs right outside the glass: a lamp post, and under it a station sign with no station. It says the name of your town. Under the name, smaller: 23:71.', 'Then the sand runs out, and the night rushes on.'] }, { secret: 'm2_carriage_still' }] } }),
      D('m2_w35', [35, 0], 'window', ['The last window before the door. The lights come past here last. Or first.'], { lookOpt: { night: true } }),
      D('m2_label', [27, 1], 'letter', [CAR_LABEL, 'On the back, in a child’s capitals: HAVE YOUR TICKET READY.'], { solid: false }),
      D('m2_cardigan3', [23, 2], 'blanketlump', [{ t: 'A cardigan folded on the window seat of carriage three, still warm. A name badge pinned to it: KIM M. — CARE ASSISTANT — NIGHTS. In the pocket, a car-park ticket stamped 06:58.', do: [{ secret: 'm2_carriage_three' }] }],
        { solid: false, cond: { fn: function () { return wagon() === -2; } } }),
      D('m2_punch', [13, 5], 'trinket', [{ t: 'With your ticket ready, you notice it at last: the inspector’s punch, fallen by his boot years ago. You punch your own ticket. The little hole comes out in the shape of a crescent moon.', do: [{ secret: 'm2_carriage_punch' }] }],
        F({ cond: { equipped: 'E08' } }))
    ],
    mech: [{ type: 'sequence', order: ['m2_w15', 'm2_w35', 'm2_w5', 'm2_w25'], ring: { every: 1.3, pause: 4.5, hear: 24, sfx: 'chime', glyph: '✦', color: '#fff4c0' },
      okLines: ['One.', 'Two. Outside, the next light seems to slow down a little, as if it noticed you counting.', 'Three.'],
      wrongLine: 'You lose count. Outside, the lights start again from the beginning, patiently.',
      doneLine: 'You know the lights by heart now. You are still awake.',
      done: { secret: 'm2_carriage_count' }, reward: [{ cookie: 1 }, { secret: 'm2_carriage_count' }],
      winLines: ['Four. You have counted them all, in the right order, and you are still awake.', 'Somebody across the aisle, whom you had not noticed, quietly holds out a biscuit, as if you had earned it. When you look again, the seat is empty.'] }],
    rules: ['Puzzle: lights pass the four small windows in the same order, over and over (counting from the left: the second, the fourth, the first, the third). Touch the windows in that order: someone leaves you a biscuit.',
      'Secret: walk out of the left end of the carriage twice, to carriage 3: a cardigan with the name badge KIM M. lies on a window seat. The luggage label in every carriage hints at it.',
      'Secret: with the Ticket (E08) equipped, the inspector’s fallen punch appears by his feet; use it to punch your ticket.',
      'Secret: use the Hourglass (E23) facing the third small window: the lights stop, and a station sign can be read (23:71).']
  });

  /* ======================= W023 — THE DOLL’S HOUSE =======================
   * Secrets: a doll's door in the skirting board, only for someone Tiny (smallOnly,
   * fake wall) -> the study nobody played in · the mother doll's work bag at nine in
   * the evening, real time (the clock shows it) · saying goodnight to the cold side of the bed. */
  MORE('W023', {
    fakeWalls: [[29, 3]],
    post: function (rows) { return carve(widen(rows, 6), 30, 2, 3, 3, '.'); },
    place: [
      D('m2_mousehole', [29, 3], 'vent', [IF({ notEquipped: 'E13' }, 'A tiny arched door in the skirting board, painted the same pink as the wallpaper, with a brass knob the size of a pea. It is a doll’s door. You are not a doll.'),
        IF({ equipped: 'E13' }, 'The tiny door is exactly your size now. It is not locked. It never was.')], { solid: false, smallOnly: true }),
      D('m2_study', [32, 2], 'desk', ['A doll-sized study that nobody ever played in. A typewriter the size of a matchbox, and a chair pushed back, as if someone had just stood up to go.'], { solid: true }),
      D('m2_dustcase', [31, 4], 'scuff', [{ t: 'On the floor, a clean rectangle in the dust, where a little suitcase stood for a long time. Left behind in it: a luggage label with a single letter. J.', do: [{ secret: 'm2_doll_study' }] }], FLAT),
      D('m2_dollclock', [8, 13], 'wallclock', [{ t: function () { var d = YN.realtime.now(); return 'The doll’s-house clock, ticking much too loudly for its size. It shows the real time: ' + d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2) + '. Beside the nine, someone has painted a tiny coat on a tiny hook.'; } }], { solid: true }),
      D('m2_workbag', [12, 24], 'suitcase', [{ t: 'Nine o’clock. By the front door, the mother doll’s work bag, packed and waiting: a folded smock, a bus pass, a lunch box with one rice ball in it, and a note for the morning that says only: eat something.', do: [{ secret: 'm2_doll_ninepm' }] }],
        { solid: false, cond: { realHour: [21, 22] } }),
      D('m2_coldside', [25, 3], 'blanketlump', ['The cold side of the big bed. The sheet is folded back neatly, like a letter nobody sent. The pillow has no dent in it. It looks as if it were waiting for somebody to say goodnight to it.'], {
        solid: false,
        listen: [{ match: ['goodnight', 'good night', 'night night', 'sleep well', 'sleep tight', '잘 자', '잘자', '잘 자요', '안녕히 주무세요'],
          lines: ['You whisper goodnight to the cold side of the bed.', 'The Bedroom Bear stops keeping the place. He climbs over, very carefully, and lies down in the hollow, the way a bear does when somebody should.', 'The cold side is a little less cold.'],
          do: [{ secret: 'm2_doll_goodnight' }] }] })
    ],
    rules: ['Secret: in the parents’ bedroom, a doll’s door in the east skirting board can only be walked through with Tiny (E13) equipped. Behind it, a little study nobody played in, and the clean mark of a suitcase labelled J.',
      'Secret: between 21:00 and 22:00 (real time), the mother doll’s packed work bag waits by the front door. The doll’s-house clock in the kitchen shows the real time, with a coat painted beside the nine.',
      'Secret: say “goodnight” (잘 자) beside the cold side of the parents’ bed: the Bedroom Bear lies down in the hollow.']
  });

  /* ======================= W024 — THE LAUNDRY SKY (side view) =======================
   * Puzzle: wait in the shadow of the man's shirt (standStill) until it is dry.
   * Secrets: the other sock, brought back some nights (dreamChance) · the wooden peg
   * fits a bare line -> a red mitten (item + flag) · an open window blows a sheet loose. */
  MORE('W024', {
    place: [
      D('m2_sock2', [24, 1], 'sock', [{ t: 'The other sock! Caught on the very top line, right beside the nest. Some nights the wind brings back what it took. Not every night.', do: [{ secret: 'm2_sky_sock' }] }],
        { solid: false, cond: { dreamChance: { p: 0.34, key: 'm2_sock' } } }),
      D('m2_bareline', [10, 25], 'clothesline', [
        { if: { notFlag: 'm2_sky_peg', item: { clothespin: 1 } }, t: 'A bare stretch of line with a peg-shaped gap. You clip your wooden peg into it. It holds. From somewhere above, something small and red drifts down and catches on it.', do: [{ item: { clothespin: -1 } }, { set: { m2_sky_peg: true } }] },
        { if: { notFlag: 'm2_sky_peg', noItem: 'clothespin' }, t: 'A bare stretch of line. Every other line is full; this one has a gap exactly the size of one wooden peg, as if a peg had been taken and never put back.' },
        { if: { flag: 'm2_sky_peg' }, t: 'Your peg, holding on to the line very firmly.' }], { solid: false }),
      D('m2_mitten', [9, 25], 'sock', [{ t: 'A child’s red mitten, pegged to the line by your peg. It is warm, as if a hand had only just come out of it. Inside, a bus ticket from a Sunday, years ago.', do: [{ secret: 'm2_sky_mitten' }] }],
        { solid: false, cond: { flag: 'm2_sky_peg' } }),
      D('m2_sheet', [31, 10], 'clothesline', [{ t: 'With a window open somewhere below, the wind reaches all the way up here: a bedsheet has wound itself round and round its line. Pegged inside it, out of the weather for years, a crayon drawing of three people under a sun. All three are dry.', do: [{ secret: 'm2_sky_sheet' }] }],
        { solid: false, cond: { roomWindow: true } }),
      D('m2_shirtshade', [27, 13], 'scuff', ['The shadow of the man’s shirt falls exactly here. On Sundays, somebody small used to sit in it and wait for the shirt to dry. When a window is open somewhere below, the wind reaches even this high.'], FLAT)
    ],
    mech: [{ type: 'standStill', mark: 'm2_shirtshade', secs: 40, breakLine: 'You moved. The shirt goes on drying, the way it has since 2020.',
      done: { secret: 'm2_sky_dry' }, reward: [{ secret: 'm2_sky_dry' }],
      winLines: ['You wait in the shirt’s shadow. For a long time, nothing happens. Waiting is the whole day.', 'Then the wind drops, and the sun, which has not moved since 2020, moves a little.', 'The shirt is dry. It could be folded now. You leave it on the line, in case.'] }],
    rules: ['Puzzle: stand still for about forty seconds in the shadow of the man’s shirt (on its line): the shirt is dry at last.',
      'Secret: on about one night in three, the other sock is caught on the top line beside the nest.',
      'Secret: clip the wooden peg (picked up lower down) into the bare line on the lowest left platform: a red mitten drifts down onto it.',
      'Secret: with the Bedroom window open, a bedsheet is blown round its line on the right; a dry crayon drawing is pegged inside it.']
  });

  /* ======================= W025 — THE FROZEN LAKE =======================
   * Puzzle: pull the fisherman's line when the float dips (cycleFrames).
   * Secrets: the doe's hiding place inside a pine thicket (fake pine) · a word carved
   * in the ice, readable on skates · footprints of another winter, seen with glasses. */
  MORE('W025', {
    fakeWalls: [[47, 36]],
    post: function (rows) {
      var ring = [], inner = [], x, y;
      for (x = 47; x <= 52; x++) { ring.push([x, 34]); ring.push([x, 38]); }
      for (y = 35; y <= 37; y++) { ring.push([47, y]); ring.push([52, y]); for (x = 48; x <= 51; x++) inner.push([x, y]); }
      return put(put(rows, ring, '^'), inner, '.');
    },
    place: [
      D('m2_hoofprints', [46, 36], 'scuff', ['Small hoofprints in the frost, going straight into the pine thicket. None of them come out.'], FLAT),
      D('m2_doebed', [50, 36], 'tuft', [{ t: 'Inside the thicket, a hollow of flattened grass, still warm, in the shape of something curled up very small. This is where she hides when the window opens. Caught on a twig: a few red woollen threads, the red of a scarf.', do: [{ secret: 'm2_lake_doe' }] }], { solid: false }),
      D('m2_float', [18, 29], 'buoy', ['A fishing line runs from a forked stick on the bank to a red float.'], { solid: false }),
      D('m2_skateguards', [10, 30], 'shoe', ['A pair of skate guards left on the bank, the rubber cracked with cold. Whoever wore them wrote something on the ice, long ago. You would have to be on skates yourself to read it the way it was written.'], { solid: false }),
      D('m2_icecarving', [22, 14], 'chalkmark', [{ t: 'On skates you can follow it: one word, carved into the ice by blades, round and round in a loop as wide as the lake, over and over until the ice went white with it. It is the Korean word for “it’s all right”.', do: [{ secret: 'm2_lake_carving' }] }],
        F({ cond: { equipped: 'E07' } })),
      D('m2_frozenprints', [26, 35], 'scuff', [{ t: 'Under the frost, your glasses find them: footprints from another winter. A big pair and a small pair, side by side along the path. Halfway to the lake the small ones stop. From there on, only the big pair, pressed deeper, as if carrying something.', do: [{ secret: 'm2_lake_prints' }] }],
        F({ cond: { equipped: 'E14' }, hiddenUntilReveal: true })),
      D('m2_mousehouse', [13, 3], 'trinket', [{ t: 'Down at your size, a house in the roots of the pine: a door made from a bottle cap, a window of ice, and a red scarf one stitch wide, drying on a twig. Whoever lives here keeps their coat on indoors too.', do: [{ secret: 'm2_lake_mouse' }] }],
        F({ cond: { equipped: 'E13' } }))
    ],
    mech: [{ type: 'cycleFrames', mark: 'm2_float', every: 1.4, good: 2,
      frames: ['The float lies still.', 'The float trembles. Something underneath is curious.', 'The float dips — now!', 'The float bobs back up. A long shadow slides away underneath.', 'Nothing. The line is cold in your hands.'],
      doneLine: 'The float lies still. Whatever lives down there has been caught once, and let go.',
      done: { secret: 'm2_lake_fish' }, reward: [{ secret: 'm2_lake_fish' }],
      winLines: ['You pull at exactly the right moment.', 'On the end of the line, instead of a fish: a rolled-up towel, dripping, the kind you wedge under a window that will not close.', 'Along the bank, the fisherman nods without looking round, as if that is what he catches every time.', 'You let it go back. It swims.'] }],
    rules: ['Puzzle: interact with the red float on the south-west shore at the moment it dips under: you pull out a memory (a rolled-up towel).',
      'Secret: in the south-east corner, hoofprints go into a pine thicket. One pine can be walked through: inside, the place where the Shivering Doe hides.',
      'Secret: with the Skates (E07) equipped, on the frozen lake (Bedroom window open), a word carved into the ice by skates can be read.',
      'Secret: with the Glasses (E14) equipped, use them beside the path to the north door: footprints from another winter appear.',
      'Secret: with Tiny (E13) equipped, a mouse’s house shows in the roots of a pine in the north-west of the shore.']
  });

  /* ======================= W026 — THE ROOFTOPS =======================
   * Puzzle: step on the chalk numbers in the order the stars showed (stepOrder) -> a crane.
   * Secrets: an invisible way over the void to a scrap of roof (fake void) · the Radio held
   * to an old aerial · a word said into the kitchen vent. */
  MORE('W026', {
    fakeWalls: [[4, 27], [5, 27]],
    post: function (rows) { var c = [], x, y; for (y = 26; y <= 28; y++) for (x = 1; x <= 3; x++) c.push([x, y]); return put(rows, c, '.'); },
    place: [
      D('m2_pebbles', [6, 27], 'pebbles', ['Pebbles laid in a neat row along the very edge of the roof, pointing out into the dark, the way you would lay them to find your way back.'], FLAT),
      D('m2_foldchair', [2, 27], 'chair', [{ t: 'A folding chair on a scrap of roof that nobody should be able to reach, facing the town. On the seat, a can of coffee from a machine, still warm, and a hospital lanyard. Somebody sits here for five minutes between the night shift and the morning.', do: [{ secret: 'm2_roofs_chair' }] }], { solid: true }),
      D('m2_aerial', [42, 3], 'antenna', ['An old television aerial bent towards the flats below. It hums faintly, as if it were picking up something nobody is tuned to.'], { solid: true,
        onEffect: { E20: [{ lines: ['You hold the radio up to the old aerial and turn the dial.', 'Between two stations, a dream from a flat below comes through, clear as anything: a child counting lit windows out loud, very slowly, so as not to reach the end.'] }, { secret: 'm2_roofs_radio' }] } }),
      D('m2_kitchenvent', [17, 25], 'vent', ['The kitchen extractor vent, beside the skylight. Warm air comes out of it, smelling of rice and of the cheap soap they have at hospitals.'], { solid: true,
        listen: [{ match: ['엄마', '어머니', 'mum', 'mom', 'mummy', 'mommy', 'mama', 'mother'],
          lines: ['You say it into the vent.', 'Far below, a chair scrapes on a kitchen floor. Someone half-wakes at the table.', KS('응? …괜찮아. 자.', 'Hm? …It’s all right. Go to sleep.'), 'Then the chair is still again.'],
          do: [{ secret: 'm2_roofs_vent' }] }] }),
      D('m2_chalk2', [33, 21], 'chalkmark', ['A chalk 2 on the roof, written very carefully by someone small, with a star beside it.'], FLAT),
      D('m2_chalk3', [44, 21], 'chalkmark', ['A chalk 3. The chalk broke halfway through, and it was finished in a different colour.'], FLAT),
      D('m2_chalk7', [35, 27], 'chalkmark', ['A chalk 7, crossed in the middle the way grown-ups write it.'], FLAT),
      D('m2_chalk1', [46, 26], 'chalkmark', ['A chalk 1, the smallest of the numbers, tucked in beside a vent as if it were shy.'], FLAT),
      D('m2_threeam', [52, 14], 'glint', [{ t: 'Three in the morning. From this corner of the roof you can count the lit windows in the whole town: seven. In one of them, a woman in a work smock is putting on her coat. In another, a child is counting too.', do: [{ secret: 'm2_roofs_three' }] }],
        F({ cond: { realHour: [3, 4] } }))
    ],
    mech: [{ type: 'stepOrder', plates: { '33,21': 0, '44,21': 1, '35,27': 2, '46,26': 3 }, count: 4, color: 'rgba(230,240,255,0.9)',
      done: { secret: 'm2_roofs_stars' }, reward: [{ secret: 'm2_roofs_stars' }, { collect: 'cranes' }],
      winLines: ['Two, three, seven, one: you walk the numbers the stars showed in the telescope.', 'Overhead, the stars slip back into their places with a sound like chalk.', 'Something light comes down out of the sky and lands at your feet: a paper crane folded from a train timetable. Every departure on it has been crossed out but one.'] }],
    rules: ['Puzzle: the telescope shows the stars as the numbers 2, 3, 7, 1. Chalk numbers are written on the south-east roof: step on them in that order to receive a paper crane.',
      'Secret: on the west edge of the south-west roof, a row of pebbles points into the void. Walk straight on: an invisible way leads to a scrap of roof with a folding chair.',
      'Secret: use the Radio (E20) facing the old aerial on the north-east roof: a dream from a flat below comes through.',
      'Secret: say “mum” (엄마) into the kitchen vent beside the skylight.',
      'Secret: between 3:00 and 4:00 in the morning (real time), the lit windows of the town can be counted from the south-east corner of the north-east roof.']
  });

  /* ======================= W027 — THE VIGIL HOSPITAL =======================
   * Puzzle: fill in the handover sheet (quiz) -> two pairs of shoes by the exit.
   * Secrets: an observation room behind the mirror of the last room (fake wall) ·
   * a cardigan and biscuits at the very end of the night (dream phase) · words on the
   * waiting-room wall, only with glasses (reveal). */
  MORE('W027', {
    fakeWalls: [[60, 4]],
    post: function (rows) { return carve(widen(rows, 7), 61, 3, 4, 4, '.'); },
    place: [
      D('m2_endmirror', [59, 5], 'mirror', ['A long mirror on the end wall of the last room. Up close it is not quite a mirror: someone has breathed on it, and the mist is on the wrong side of the glass.'], { solid: true }),
      D('m2_obsglass', [61, 5], 'window', ['From this side, the mirror is a window. Through it, the last room of the ward, empty. Someone sat here and watched children sleep.'], { solid: true, lookOpt: { night: true } }),
      D('m2_obsfiles', [64, 3], 'drawer', ['A filing cabinet with six drawers, numbered one to six. Drawers one to five are empty, apart from dust in the shape of folders.'], { solid: true }),
      D('m2_file6', [63, 6], 'clipboard', [{ t: 'Drawer six has been left open and its file put out, as if someone were about to read it. SUBJECT S. — AGE 11. Asked to sleep with the light off: did not. Asked what she dreams about: did not answer. Under that, in different ink: she is dreaming right now.', do: [{ secret: 'm2_hosp_file6' }] }], { solid: false }),
      D('m2_handover', [34, 11], 'clipboard', ['The handover sheet for the morning shift.'], { solid: true }),
      D('m2_homeshoes', [2, 16], 'shoe', [{ t: 'By the exit, two pairs of outdoor shoes have appeared side by side: a woman’s, worn down at the heel, and a child’s. Someone is about to walk someone home.', do: [{ secret: 'm2_hosp_home' }] }],
        { solid: false, cond: { flag: 'm2_hosp_handover' } }),
      D('m2_cardigan', [2, 12], 'towel', [{ t: 'Nearly seven. A cardigan and a handbag hang on the end of the staff lockers, waiting for their owner to clock off. In the bag, a packet of cream biscuits saved for someone. One is missing. It is in your hand.', do: [{ cookie: 1 }, { secret: 'm2_hosp_seven' }] }],
        { solid: false, cond: { phase: 'final' } }),
      D('m2_pencilmarks', [13, 19], 'doodle', ['Faint pencil marks on the wall at the height of a child sitting down, too faint to read without help.'], FLAT),
      D('m2_wallwords', [14, 19], 'doodle', [{ t: 'Through your glasses the pencil comes back: I WAS HERE FROM 10 UNTIL 7. Then a row of little lamps, one for every night. Under the last lamp: she came. she always came.', do: [{ secret: 'm2_hosp_wall' }] }],
        F({ cond: { equipped: 'E14' }, hiddenUntilReveal: true }))
    ],
    mech: [{ type: 'quiz', mark: 'm2_handover', intro: ['The handover sheet for the morning shift. Every box is blank. Someone has to fill it in before the night staff can go home.'],
      questions: [{ q: 'Bed 3?', choices: ['Asleep.', 'Empty. Normal.', 'Gone home.'], right: 1 },
        { q: 'Bed 12?', choices: ['Restless. Talks to his radio.', 'Quiet all night.', 'Moved to the sixth floor.'], right: 0 },
        { q: 'Waiting room?', choices: ['Nobody.', 'A man with flowers.', 'A child, waiting for her mother.'], right: 2 },
        { q: 'Night staff, end of shift?', choices: ['Midnight.', 'Seven in the morning.', 'When everyone is asleep.'], right: 1 }],
      failLine: 'Someone has written over your answers in red: CHECK AGAIN. The night goes on.',
      doneLine: 'The handover sheet, filled in and signed. The night staff can go home.',
      done: { flag: 'm2_hosp_handover' }, reward: [{ set: { m2_hosp_handover: true } }, { secret: 'm2_hosp_handover' }],
      winLines: ['You sign the sheet in the box marked NIGHT STAFF. Your signature comes out as a small drawing of a lamp.', 'At the end of the corridor, a lift dings: the morning shift, at last.', 'Somewhere far from here, a woman in a cardigan can finally go home.'] }],
    rules: ['Puzzle: fill in the handover sheet at the nurses’ station (bed 3: empty, normal; bed 12: restless, talks to his radio; waiting room: a child waiting for her mother; end of shift: seven in the morning). Two pairs of shoes then wait by the exit.',
      'Secret: the long mirror at the far end of the last room on the north side hides a fake wall just beside it. Behind it, an observation room and the file of “Subject S.”.',
      'Secret: in the last phase of the dream, a cardigan and a bag hang by the staff lockers, with a biscuit for you.',
      'Secret: with the Glasses (E14) equipped, use them in the waiting room: pencilled words come back on the wall.']
  });

  /* ======================= W028 — THE WINTER GREENHOUSE =======================
   * Secrets: water the pot without a label (Watering Can on it) -> a shoot · count the
   * seeds out loud (listen) · frost ferns and a word on the glass when the window is open. */
  MORE('W028', {
    place: [
      D('m2_nolabel', [32, 22], 'pot', [IF({ notFlag: 'm2_green_watered' }, 'A pot without a label, pushed against the glass behind the seed bag as if it were a mistake. The soil in it is dry and pale. Nobody has dared to water it.'),
        IF({ flag: 'm2_green_watered' }, 'The pot without a label. The soil is dark and damp now.')], { solid: true,
        onEffect: { E35: [{ if: { notFlag: 'm2_green_watered' }, lines: ['You tip the big watering can over the pot without a label, with both arms, like something alive.', 'For a moment, nothing. Then the soil sighs, and something pushes up beside the pot, very fast, as if it had only been waiting for someone to dare.'], set: { m2_green_watered: true },
          else: [{ msg: 'The soil is already damp.' }] }] } }),
      D('m2_shoot', [31, 22], 'sprout', [{ t: 'A shoot has come up between the pot and the glass, two leaves already, the green of something that has made up its mind.', do: [{ secret: 'm2_green_shoot' }] }],
        { solid: false, cond: { flag: 'm2_green_watered' } }),
      D('m2_seedrow', [22, 18], 'pebbles', ['A row of seeds pressed into the soil at the end of the bed, evenly spaced. They look as if they were waiting to be counted.'], F({
        listen: [{ match: ['one two three', 'one two', '1 2 3', 'hana dul set', 'hana dul', '하나 둘 셋', '하나 둘', '일 이 삼'],
          lines: ['You count them out loud, the way it was done on Sundays.', 'The seeds do not move. But the soil around them darkens a little, as if warmed by a hand, and the whole greenhouse seems to wait for the end of the count.'],
          do: [{ secret: 'm2_green_count' }] }] })),
      D('m2_smudge', [7, 1], 'glint', ['One pane of glass, at the height of a child, is smudged, as if somebody once wrote on it with a finger. The writing would need the cold to come back.'], FLAT),
      D('m2_frost', [8, 1], 'sparkle', [{ t: 'With a window open somewhere, the cold gets in, and frost draws ferns on the inside of the glass. In among them, written with a finger long ago and brought back by the frost: a heart, and the word children use for their grandmother.', do: [{ secret: 'm2_green_frost' }] }],
        F({ cond: { roomWindow: true } }))
    ],
    rules: ['Secret: use the Watering Can (E35) facing the pot without a label, behind the seed bag: a shoot comes up beside it.',
      'Secret: count out loud (“one, two, three”, 하나 둘 셋) beside the row of seeds at the foot of the fourth bed.',
      'Secret: with the Bedroom window open, frost brings back a word written on the glass by the north wall, beside the smudged pane.']
  });

  /* ======================= W029 — THE LIGHTHOUSE =======================
   * Puzzle: walk in the lamp's shadow as it goes round (followShadow).
   * Secrets: the room of logbooks behind the keeper's bed (fake wall) · the keeper's
   * cap on the pillow when the lamp is lit and the night ends · a porthole seen by lantern light. */
  MORE('W029', {
    fakeWalls: [[15, 23]],
    post: function (rows) { return carve(rows, 16, 23, 4, 3, '.'); },
    place: [
      D('m2_shadowring', [20, 9], 'chalkmark', ['A ring worn into the floor around the lamp by someone who walked in its shadow every night, round and round, to see the sea the way the light never could.'], FLAT),
      D('m2_behindbed', [14, 23], 'crack', ['Between the keeper’s bed and the wall, a draught that smells of paper and lamp oil. The wall here is not as cold as the rest.'], FLAT),
      D('m2_logshelf', [19, 24], 'bookcase', ['Shelves of logbooks, one for every night, from the floor to the ceiling. You open one at random: Kept the light. No ship. You open another: Kept the light. No ship.'], { solid: true }),
      D('m2_lastlog', [17, 25], 'book', [{ t: 'The last logbook, open on the floor. The keeper’s handwriting stops halfway down the page. Under it, in another hand, smaller: kept the light for him tonight. no ship. A loose page is tucked inside.', do: [{ secret: 'm2_lh_logs' }, { collect: 'pages' }] }], { solid: false }),
      D('m2_keepercap', [12, 23], 'blanketlump', [{ t: 'The night is nearly over and the lamp is lit. The keeper’s cap lies on his pillow, and the pillow has a dent in it at last: someone else kept the light, so he could lie down, just for a minute.', do: [{ secret: 'm2_lh_rest' }] }],
        { solid: false, cond: { all: [{ flag: 'lighthouse_W029' }, { phase: 'final' }] } }),
      D('m2_porthole', [2, 20], 'window', [{ t: 'By lantern light you notice a porthole in the wall that faces the land. Out there, a dark shore without a single light. You raise the lantern to the glass. After a long while, on the shore, someone strikes a match, holds it up, and lets it go out.', do: [{ secret: 'm2_lh_answer' }] }],
        { solid: true, lookOpt: { night: true }, cond: { equipped: 'E05' } })
    ],
    mech: [{ type: 'followShadow', center: [22, 7], r: 2.6, speed: 0.28, secs: 18, breakLine: 'You step into the light. The count of the dark starts again.',
      done: { secret: 'm2_lh_shadow' }, reward: [{ secret: 'm2_lh_shadow' }],
      winLines: ['You walk in the lamp’s shadow until you stop seeing the light at all, and see only the sea.', 'Out in the dark the lamp leaves behind, very far away, something small is waving: a lantern in a rowing boat.', 'It goes out. The lamp comes round again.'] }],
    rules: ['Puzzle: in the lamp room, a shadow goes slowly round the lamp. Stay inside it for about eighteen seconds without stepping into the light.',
      'Secret: the wall just behind the keeper’s bed (a draught) can be walked through: a room full of logbooks, and a loose page.',
      'Secret: once the lamp is lit, in the last phase of the dream, the keeper’s cap lies on his pillow.',
      'Secret: with the Lantern (E05) equipped, a porthole appears in the west wall of the lower room.']
  });

  /* ======================= W030 — THE PLAYGROUND =======================
   * Puzzle: blow a whistle by the duty rota, the one nobody blows (gate) -> a dropped pencil case.
   * Secrets: draw the SKY square back with the Chalk · tell the tree it is not its fault
   * (listen) · a note on the bench once you have met the girl in cubicle three. */
  MORE('W030', {
    place: [
      D('m2_dutyrota', [9, 4], 'board', ['A playground duty rota pinned to the shelter wall. Every name has been crossed off but one, which says: nobody.'], { solid: true }),
      D('m2_pencilcase', [12, 10], 'book', [{ t: 'A pencil case, dropped in a hurry when the whistle blew. Inside the lid, in correction fluid: THE MUTE GIRL. Someone has crossed it out very neatly and begun to write a real name underneath, then stopped after the first letter.', do: [{ secret: 'm2_yard_pencilcase' }] }],
        F({ cond: { flag: 'm2_yard_whistle' } })),
      D('m2_skysquare', [30, 33], 'chalkmark', [IF({ notFlag: 'm2_yard_sky' }, 'The last square of the hopscotch, rubbed out with a wet sleeve. You can still read the ghost of the word: SKY.'),
        IF({ flag: 'm2_yard_sky' }, 'The SKY square, drawn back in your chalk, in capitals.')], F({
        onEffect: { E09: [{ if: { notFlag: 'm2_yard_sky' }, lines: ['You draw the square back, and write SKY in it, in capitals.', 'When you hop into it, for a second, your feet do not come down.'], set: { m2_yard_sky: true },
          else: [{ msg: 'The chalk squeaks over the word SKY. It is already there.' }] }] } })),
      D('m2_feather', [29, 33], 'sparkle', [{ t: 'A small white feather has landed just outside the SKY square, as if something had come down to look.', do: [{ secret: 'm2_yard_skyfeather' }] }],
        F({ cond: { flag: 'm2_yard_sky' } })),
      D('m2_treeface', [28, 25], 'doodle', ['Carved low on the trunk, at the height of someone sitting with their knees up: a small face with no mouth. Under it, older letters, nearly healed over by the bark: IT’S MY FAULT.'], F({
        listen: [{ match: ['not your fault', 'its not your fault', 'it isnt your fault', 'wasnt your fault', 'not her fault', '네 잘못 아니야', '네 잘못이 아니야', '너 잘못 아니야', '잘못 없어'],
          lines: ['You say it to the tree, out loud.', 'The bark around the old letters seems to soften. When you look again, someone has carved a mouth into the little face: a short line, nearly a smile.'],
          do: [{ secret: 'm2_yard_tree' }] }] })),
      D('m2_benchnote', [15, 30], 'letter', [{ t: 'Since you spoke to the girl in cubicle three, a note has been left on the end of the bench, folded very small. Inside, a drawing: two girls on this bench, not talking, sitting close together.', do: [{ secret: 'm2_yard_note' }] }],
        F({ cond: { met: 'N009' } }))
    ],
    mech: [{ type: 'gate', mark: 'm2_dutyrota', dist: 7, flag: 'm2_yard_whistle', events: ['whistle'], text: 'The whistle shrieks across the yard. For once, everybody stops.' }],
    rules: ['Puzzle: the playground monitor never blows her whistle. Blow a whistle (the Blackbird Whistle, E02, or any other) near the duty rota in the covered shelter: the bullies scatter and drop a pencil case.',
      'Secret: use the Chalk (E09) facing the rubbed-out top square of the hopscotch: SKY is drawn back, and a white feather lands beside it.',
      'Secret: say “it’s not your fault” (네 잘못 아니야) beside the little carved face at the foot of the tree.',
      'Secret: once you have met Ondine (cubicle 3), a folded note waits on the end of the southern bench.']
  });

  /* ======================= W031 — THE MAZE (generated) =======================
   * Puzzle: check Thalie's four dead ends (visitAll).
   * Secrets: chalk that only glows at night (dark) · Thalie's buried letter, found by the
   * Compass beside the beacon (equipped) · morning light through a crack at the end of the dream. */
  var PEGS = ['A wooden survey peg driven into the gravel at the dead end, a red ribbon tied round it. Thalie has written on it: CHECKED. NOT HERE.',
    'A survey peg with a red ribbon. Scratched into it: CHECKED. THE WALLS MOVED WHILE I WAS WRITING THIS.',
    'A survey peg with a faded ribbon. On it, in pencil: CHECKED. I THOUGHT I HEARD SOMEONE ON THE OTHER SIDE.',
    'A survey peg leaning against the wall, its ribbon almost white. On it: CHECKED. SAME AS YESTERDAY.'];
  /* the order of these random-hidden marks was chosen so that, by day and by night,
     the four pegs and the two chalk/crack marks end up in different dead ends */
  var PEG = function (i) { return D('m2_peg' + i, 'random-hidden', 'clothespin', [PEGS[i - 1]], { solid: true }); };
  MORE('W031', {
    place: [PEG(2), PEG(4),
      D('m2_survey', { near: 'camp', dx: -4, dy: -1 }, 'letter', ['Thalie’s survey sheet, weighted down with a stone by the fire. Four dead ends marked with a red cross, and the words: STILL TO CHECK. In the margin, smaller: the needle knows where I buried the letter.'], FLAT),
      D('m2_nightchalk', 'random-hidden', 'doodle', [{ t: 'Chalk on the wall of the dead end, visible only at night, glowing very faintly: LOOKING IS NOT DOING. Under it, in the same hand, much smaller: I know.', do: [{ secret: 'm2_maze_night' }] }],
        F({ cond: { dark: true } })),
      PEG(3), PEG(1),
      D('m2_tin', { near: 'beacon', dx: 1, dy: -1 }, 'trinket', [{ t: 'With the compass in your hand, the needle swings away from north and points at your feet. Under the gravel, a biscuit tin. Inside: a letter that begins “To the quiet girl, two rows in front of me” and stops after the word sorry.', do: [{ secret: 'm2_maze_letter' }] }],
        F({ cond: { equipped: 'E29' } })),
      D('m2_morningcrack', 'random-hidden', 'glint', [{ t: 'In the last minutes of the dream, light comes through a crack in this dead end: grey morning light, the colour of a real window. You cannot get through. But it is there, and it is morning on the other side.', do: [{ secret: 'm2_maze_morning' }] }],
        F({ cond: { remainingLt: 120 } })),
      D('m2_schoolbag', { near: 'camp', dx: 4, dy: -1 }, 'book', [{ t: 'It is the weekend. By the fire, Thalie’s school bag has been put down at last, unopened. In its side pocket, a class photograph: one face in the row in front of hers has been circled in pencil, very lightly, as if she were afraid of pressing too hard.', do: [{ secret: 'm2_maze_weekend' }] }],
        { solid: false, cond: { weekday: [0, 6] } })
    ],
    mech: [{ type: 'visitAll', marks: ['m2_peg1', 'm2_peg2', 'm2_peg3', 'm2_peg4'], countText: 'Dead ends checked: # / %',
      done: { secret: 'm2_maze_survey' }, reward: [{ secret: 'm2_maze_survey' }],
      winLines: ['That is the last of Thalie’s red crosses.', 'Every dead end on her sheet has been checked, and not one of them is the way out.', 'By the fire, a pencil crosses something off, and does not write anything new.'] }],
    rules: ['Puzzle: Thalie’s survey sheet (by the campfire) lists four dead ends. Find the four wooden survey pegs at the ends of dead ends (they move between day and night) and touch each one.',
      'Secret: at night (Bedroom light off), chalk glows on the wall of one dead end.',
      'Secret: with the Compass (E29) equipped, a biscuit tin with Thalie’s unsent letter appears just beside the north-east beacon.',
      'Secret: in the last two minutes of the dream, morning light shows through a crack in one dead end.',
      'Secret: at the weekend (Saturday or Sunday, real date), Thalie’s school bag lies unopened by the campfire.']
  });

  /* ======================= W032 — THE CASINO OF MINUTES =======================
   * Puzzle: finish the abandoned game of pairs on the felt (pairs) -> a minute of dream.
   * Secrets: the counting room behind the cashier's wall (fake wall) · a clock painted
   * over, seen with glasses (reveal) · ask the RETURNS slot for your time back (listen). */
  var CARDS = [[16, 16], [18, 16], [25, 16], [27, 16], [16, 19], [18, 19], [25, 19], [27, 19]];
  MORE('W032', {
    fakeWalls: [[43, 27]],
    post: function (rows) { return carve(widen(rows, 6), 44, 25, 4, 4, '.'); },
    place: CARDS.map(function (c, i) { return D('m2_card' + (i + 1), c, 'letter', ['A playing card, face down.'], FLAT); }).concat([
      D('m2_scorecard', [21, 18], 'scraps', ['A scorecard on the felt: PAIRS — THE HOUSE 0 — NOBODY 0. The cards around it are all face down. Nobody has ever finished a game.'], FLAT),
      D('m2_chiptrail', [42, 27], 'glint', ['A trail of dropped chips leads from the cashier’s window to the wall, and stops at the wall, as if the wall had swallowed them.'], FLAT),
      D('m2_hourshelf', [47, 25], 'shelf', ['Shelves of hourglasses sorted by size, each one labelled with a name. Most of them have run out.'], { solid: true }),
      D('m2_ledger', [45, 27], 'book', [{ t: 'The house’s ledger, open on the floor of the counting room. Column after column of minutes won and lost. Your line has one entry: owed, one night. Somebody has left a coin on the page, as if to keep it from closing.', do: [{ secret: 'm2_casino_count' }, { collect: 'coins' }] }], { solid: false }),
      D('m2_paintdrip', [30, 2], 'scuff', ['A drip of red paint on the carpet, under a bare patch of wall. There are no clocks in here. Somebody made sure of that.'], FLAT),
      D('m2_hiddenclock', [30, 1], 'wallclock', [{ t: 'Through your glasses, the bare patch of wall is a clock, painted over in the same red as the wall. Under the paint, its hands say three in the morning. They have said it for a very long time.', do: [{ secret: 'm2_casino_clock' }] }],
        { solid: false, cond: { equipped: 'E14' }, hiddenUntilReveal: true }),
      D('m2_returns', [38, 28], 'mailbox', ['A brass slot in the wall marked RETURNS. It has been soldered shut. Under it, a smaller plate: THE HOUSE DOES NOT REFUND LOST TIME.'], { solid: true,
        listen: (function () {
          var w = ['my time back', 'give me back my time', 'give it back', 'give back', 'refund', 'i want my time', 'return my time', '돌려줘', '돌려주세요', '내 시간'];
          return [{ if: { notSecret: 'm2_casino_refund' }, match: w, lines: ['You ask for it back, out loud, to the soldered slot.', 'A long pause. Then, behind the wall, something counts. A single minute rolls out from under the plate and into your hand, warm.', 'Just this once, the plate seems to say. Do not tell the others.'], do: [{ time: 60 }, { secret: 'm2_casino_refund' }] },
            { if: { secret: 'm2_casino_refund' }, match: w, lines: ['The slot stays shut. Once was already an exception.'] }];
        })() })
    ]),
    mech: [{ type: 'pairs', tiles: CARDS.map(function (c, i) { return 'm2_card' + (i + 1); }), wrongLine: 'Two different cards. They turn themselves face down again.',
      doneLine: 'Every card is face up. The game is over, and nobody lost.',
      done: { secret: 'm2_casino_pairs' }, reward: [{ time: 45 }, { secret: 'm2_casino_pairs' }],
      winLines: ['The last two cards turn over.', 'Without looking up from the roulette, the croupier flicks a single chip across the felt to you.', EN('A minute, miss. For patience.', 'The Croupier')] }],
    rules: ['Puzzle: eight cards lie face down on the green felt around the roulette. Turn them two at a time and find all the matching pairs: the croupier gives you back dream time.',
      'Secret: a trail of chips leads from the cashier’s window to the east wall, which can be walked through: the counting room (and a coin).',
      'Secret: with the Glasses (E14) equipped, use them near the bare patch of wall on the north side: a painted-over clock appears.',
      'Secret: ask the soldered RETURNS slot, out loud, for your time back (“give me back my time”, 돌려줘): once, it gives you a minute.']
  });

  /* ======================= W033 — THE GLASS TOWER =======================
   * Puzzle: say the clock-off time by the board (password) -> one screen goes dark.
   * Secrets: under the Blanket, someone who lives under a desk · a drawing taped under a
   * desk, at Tiny height · a note by the lift once you have been to the 44th floor. */
  MORE('W033', {
    place: [
      D('m2_contract', [12, 11], 'book', ['An employment contract left on a desk. Working hours: 09:00 to 18:00. The 18:00 has been underlined so many times that the pen has gone through the paper.'], { solid: false }),
      D('m2_darkscreen', [48, 26], 'monitor', [{ t: 'One screen in the whole tower has gone dark. The chair in front of it is pushed in, and the coat that hung on it is gone: somebody has gone home on time, and nobody has stopped them.', do: [{ secret: 'm2_tower_home' }] }],
        { solid: false, cond: { flag: 'm2_tower_kaltoe' } }),
      D('m2_officeshoes', [4, 6], 'shoe', ['A pair of office shoes under the desk, side by side, as if someone had stepped out of them to lie down.'], FLAT),
      D('m2_sleeper', [5, 6], 'blanketlump', [{ t: 'Hidden under your blanket, you see what the others hide: a sleeping bag rolled out under the desk, a toothbrush in a coffee cup, a calendar on which every Sunday is crossed out too. Someone lives here.', do: [{ secret: 'm2_tower_sleeper' }] }],
        { solid: false, cond: { equipped: 'E26' } }),
      D('m2_deskdrawing', [35, 16], 'drawing', [{ t: 'Down at your size, under a desk, a child’s drawing is taped where only someone very small would see it: a table, four bowls of rice, four people, and the sun in the window. Underneath: everybody home by six.', do: [{ secret: 'm2_tower_drawing' }] }],
        { solid: false, cond: { equipped: 'E13' } }),
      D('m2_postit', [53, 29], 'scraps', [{ t: 'A yellow sticky note on the floor by the lift, fallen from the call button. In a hurried hand: forty-fourth floor. nobody there either.', do: [{ secret: 'm2_tower_postit' }] }],
        F({ cond: { visited: 'W139' } }))
    ],
    mech: [{ type: 'password', mark: 'board', dist: 3, flag: 'm2_tower_kaltoe',
      words: ['18 00', '1800', '18시', '6pm', '6 pm', 'six pm', 'six oclock', 'six o clock', '6 oclock', '여섯 시', '여섯시', '오후 여섯 시', 'home at six', 'leave at six'],
      do: [{ secret: 'm2_tower_kaltoe' }], text: 'In the empty box on the board, a time writes itself: leaving on time, 18:00. Somewhere on the floor, one screen goes dark.' }],
    rules: ['Puzzle: the board by the coffee machine has an empty box for leaving on time. An employment contract on a desk gives the hours (09:00 to 18:00). Say “18:00” (or “six pm”, 여섯 시) beside the board: one screen in the tower goes dark.',
      'Secret: with the Blanket (E26) equipped, a sleeping bag appears under the desk with the office shoes, in the north-west corner.',
      'Secret: with Tiny (E13) equipped, a child’s drawing appears under a desk in the middle of the floor.',
      'Secret: after a visit to the 44th floor (W139), a sticky note lies by the lift.']
  });

  /* ======================= W034 — THE TOY ATTIC =======================
   * Puzzle: push the two boxes marked J. back onto their clean squares (push).
   * Secrets: footprints that glow in the dark lead to a loose floorboard (dark) ·
   * a ticket in front of the wooden train at 23:71, i.e. 00:11 real time (realDate h2371). */
  MORE('W034', {
    place: [
      D('m2_boxj1', [23, 16], 'crate', ['A cardboard box marked J. — BOOKS, in a man’s capitals. Someone dragged it here: there is a long smear in the dust behind it.'], { solid: true }),
      D('m2_boxj2', [27, 19], 'crate', ['A cardboard box marked J. — WINTER. It is light, as if it held a single coat.'], { solid: true }),
      D('m2_dust1', [23, 19], 'scuff', ['A clean rectangle in the dust, exactly the size of a box, where something stood for a long time and then was moved.'], FLAT),
      D('m2_dust2', [25, 19], 'scuff', ['Another clean rectangle, a little to the right of the first. Two boxes stood here side by side, the night someone packed.'], FLAT),
      D('m2_jokebook', [24, 18], 'book', [{ t: 'With both boxes back in their places, the lid of BOOKS has come open. On top: a joke book, much read, every page turned down at the corner. The last page has been torn out.', do: [{ secret: 'm2_attic_jokebook' }] }],
        F({ cond: { flag: 'm2_attic_boxes' } })),
      D('m2_dusthint', [33, 20], 'scuff', ['The dust here has been disturbed, as if something small came this way often. In this light you cannot make out the shapes. Perhaps they show better in the dark.'], FLAT),
      D('m2_glowprints', [32, 19], 'scuff', ['In the dark they glow faintly in the dust: small bare footprints, going back and forth between the stairs and this corner, night after night.'],
        F({ cond: { dark: true } })),
      D('m2_floorboard', [34, 20], 'plank', [{ t: 'A floorboard in the corner rocks under your foot. Under it, a dust-free shoebox: a tie, a harmonica with two notes missing, and a photograph of a small girl on a man’s shoulders, both laughing at something outside the picture.', do: [{ secret: 'm2_attic_floorboard' }] }], FLAT),
      D('m2_dustyduck', [13, 1], 'plush', [IF({ notFlag: 'm2_attic_duck' }, 'A plush duck so grey with dust that you can only guess it was ever yellow. Nobody has held it since the night the toys came up here.'),
        IF({ flag: 'm2_attic_duck' }, 'The plush duck, yellow again where you held it.')], { solid: true, lookOpt: { c: ['#d8c870'], dust: true },
        lookIf: [{ cond: { flag: 'm2_attic_duck' }, lookOpt: { c: ['#f0d040'] } }],
        onEffect: { E36: [{ if: { notFlag: 'm2_attic_duck' }, lines: ['You hug the dusty duck hard, the way you hug the clean one.', 'The dust comes off on your coat. Underneath, it is yellow, and it still smells, very faintly, of somebody’s aftershave.'],
          set: { m2_attic_duck: true }, secret: 'm2_attic_duck', else: [{ msg: 'The duck is already yellow where you held it.' }] }] } }),
      D('m2_trainticket', [4, 19], 'letter', [{ t: 'Eleven minutes past midnight. On the floor in front of the wooden train, a tiny cardboard ticket, still warm from a pocket: ONE CHILD — 23:71 — PLATFORM: ATTIC. The train has not moved. It was waiting for its passenger.', do: [{ secret: 'm2_attic_ticket' }] }],
        F({ cond: { realDate: 'h2371' } }))
    ],
    mech: [{ type: 'push', blocks: ['m2_boxj1', 'm2_boxj2'], plates: ['m2_dust1', 'm2_dust2'], sfx: 'stamp',
      done: { flag: 'm2_attic_boxes' }, reward: [{ set: { m2_attic_boxes: true } }, { secret: 'm2_attic_boxes' }],
      winLines: ['The second box settles into its clean square, and the dust remembers the room the way it was.', 'For a moment you can almost smell aftershave.', 'The lid of the box marked BOOKS creaks open by itself.'] }],
    rules: ['Puzzle: push the two boxes marked J. (south-east of the rug) onto the two clean rectangles in the dust near the stairs: the box of books opens on a joke book with its last page torn out.',
      'Secret: with the Bedroom light off, glowing footprints lead to the south-east corner; the loose floorboard there hides a shoebox.',
      'Secret: at 23:71 (eleven past midnight, real time, until twenty past), a ticket waits in front of the wooden train.',
      'Secret: use the Plushie (E36) facing the dusty duck by the north wall: hugged, it turns yellow again.']
  });

  /* ======================= W035 — HAPPINESS STATION =======================
   * Puzzle: play her lullaby by the bench with her name (melodyLock).
   * Secrets: say the name painted off the list (listen) · with the Ink, the scratched-out
   * line under the name comes back · the lost property office behind the wall (fake wall) ·
   * an unannounced carriage for a few seconds every minute (dream timer). */
  MORE('W035', {
    fakeWalls: [[55, 25]],
    post: function (rows) { return carve(widen(rows, 6), 56, 24, 4, 4, '.'); },
    place: [
      D('m2_namelist', [24, 1], 'board', ['A board of names in neat rows, freshly painted, under the words OUR HAPPY PASSENGERS. One line has been painted over so many times that it stands out like a scar.'], { solid: true,
        listen: [{ match: ['철이', 'chol i', 'choli', 'cheol i', 'cheoli', 'chul i'],
          lines: ['You say the name out loud, under the board.', 'For a moment the whole station is silent. Even the anthem stops.', 'Then a loudspeaker clears its throat.',
            KN('명단에 없는 이름입니다. 명단에 없는 이름입니다.', 'That name is not on the list. That name is not on the list.'), 'Under the paint of the scar, very faintly, letters show through, as if someone on the other side had pressed them there.'],
          do: [{ secret: 'm2_happy_choli' }] }] }),
      D('m2_benchink', [19, 26], 'chalkmark', [{ t: 'With the ink in hand, the line someone scratched out under the carved name comes back, letter by letter, in a child’s careful hand: big brother, I will wait for you.', do: [{ secret: 'm2_happy_bench' }] }],
        F({ cond: { equipped: 'E24' } })),
      D('m2_benchnotes', [21, 26], 'scraps', ['Scratched into the marble at the end of the bench, very small: seven notes, the way someone would write a song down for a child who cannot read music yet.'], FLAT),
      D('m2_tape', [54, 25], 'scuff', ['An arrow of yellowed tape on the floor points at the bare wall. Beside it, two Korean words that mean lost property.'], FLAT),
      D('m2_lostshelf', [59, 24], 'shelf', ['Shelves of lost property, every item tagged and dated. Umbrellas. Gloves. Smiles, still in their wrappers, never issued.'], { solid: true }),
      D('m2_leftshoe', [57, 26], 'shoe', [{ t: 'On its own on the lowest shelf, a child’s shoe, very old, its strap mended with thread. The tag says: LEFT SHOE — PLATFORM 2 — 1951 — UNCLAIMED. Under it, in pencil: not yet.', do: [{ secret: 'm2_happy_lostshoe' }] }], { solid: false }),
      D('m2_timetable', [40, 1], 'board', ['The timetable. Every train arrives exactly on the minute and leaves exactly on the minute, and nobody gets on or off. Pencilled at the very bottom: and one more, that is never announced.'], { solid: true }),
      D('m2_unannounced', [40, 21], 'ghostfig', [{ t: 'For a few seconds a carriage stands at the platform with every window lit, though no train came in. In one window, a boy in a red scarf waves at you with his whole arm, the way you wave when you are not allowed to shout.', do: [{ secret: 'm2_happy_unannounced' }] }],
        { solid: false, cond: { remainingMod: { every: 60, under: 8 } } })
    ],
    mech: [{ type: 'melodyLock', mark: 'bench', tune: YN.data.lullaby || '3232120', dist: 3,
      done: { secret: 'm2_happy_lullaby' }, reward: [{ secret: 'm2_happy_lullaby' }],
      winLines: ['You play her lullaby beside the bench where her name is carved.', 'The anthem stops, very politely, to let it pass.', 'When the last note is gone, the marble under the name is warm, as if somebody small had been sitting there for a very long time and had only just got up.'] }],
    rules: ['Puzzle: play the Garden lullaby with the Melody (E03) beside the marble bench where a name is carved: the marble is warm.',
      'Secret: say the name of Chol-i (철이) beside the board of names on the north wall: the loudspeaker answers.',
      'Secret: with the Ink (E24) equipped, the scratched-out line under the name on the bench comes back.',
      'Secret: an arrow of tape by the east wall of the platform points at a fake wall: behind it, the lost property office, and a left shoe from 1951.',
      'Secret: for eight seconds of every minute of the dream, an unannounced carriage stands on the rails east of the train.']
  });

  /* ======================= W036 — THE GRAND SHOW =======================
   * Puzzle: walk the Understudy's steps (dirSequence).
   * Secrets: an invisible maze in the dark wing (x tiles) · clap with the Laughter at the
   * empty golden seat · in the dark, someone sits beside the golden seat. */
  var X36 = [[1, 22], [2, 22], [3, 22], [5, 22], [1, 23], [3, 23], [5, 23], [1, 24], [3, 24], [5, 24], [5, 25], [2, 26], [3, 26], [4, 26], [5, 26]];
  MORE('W036', {
    post: function (rows) { return put(rows, X36, 'x'); },
    npcs: [{ id: 'N2136', name: 'The Understudy', kind: 'human', behavior: 'static', at: [12, 6], solid: true,
      look: { t: 'humanoid', head: 'round', body: 'suit', c: ['#f0f0f0', '#202020', '#f8f0f0', '#1a1a1a'], eyes: 'dots', mouth: 'line', h: 21 },
      lines: ['A mime in white gloves and a painted tear, waiting on a stage he never goes on. He points at his own feet, then at yours.',
        EN('I know the whole routine. Every step. Just not the end.'),
        'He walks a few steps on the spot, then stops, and waits, as if it were your turn.'] }],
    place: [
      D('m2_zigzag', [3, 21], 'scuff', ['Footprints in the dust of the dark wing, going in zigzags, as if someone had walked between furniture that is no longer there.'], FLAT),
      D('m2_print1', [4, 24], 'scuff', null, F({ noInteract: true })),
      D('m2_print2', [2, 25], 'scuff', null, F({ noInteract: true })),
      D('m2_slate', [1, 26], 'board', [{ t: 'In the darkest corner of the wing, a slate propped against the wall: the whole act, written out in chalk, every knock and every voice. The last line has been rubbed out with a thumb. Only its beginning is left: Daddy who’s…', do: [{ secret: 'm2_show_slate' }] }], { solid: true }),
      D('m2_programme', [20, 23], 'letter', ['A programme on the floor in front of the golden seat, as if dropped by someone leaving before the end. Curtain: eight o’clock. On the back, in pencil: if nobody claps, I will.'], F({
        onEffect: { E39: [{ lines: ['You laugh, and clap, alone, at the empty golden seat.', 'The seat claps back. Twice. Softly, like someone who came in late and does not want to be noticed.'] }, { secret: 'm2_show_clap' }] } })),
      D('m2_footlights', [27, 8], 'glint', [{ t: 'Eight o’clock: showtime. The footlights have come on by themselves along the front of the stage, for an audience of paper. Nobody comes on. The poster did say tonight.', do: [{ secret: 'm2_show_eight' }] }],
        F({ cond: { realHour: [20, 21] }, light: 1.6 })),
      D('m2_spectator', [21, 24], 'ghostfig', [{ t: 'In the dark, someone is sitting beside the golden seat: only the shape of a coat, and a hand on the armrest, ready to get up. When the light comes back on, they will leave before the end, as they always do.', do: [{ secret: 'm2_show_spectator' }] }],
        { solid: false, cond: { dark: true } })
    ],
    mech: [{ type: 'dirSequence', ent: 'N2136', seq: ['left', 'up', 'right', 'right', 'down'], dist: 6,
      done: { secret: 'm2_show_steps' }, reward: [{ secret: 'm2_show_steps' }],
      winLines: ['You walk his steps back to him: left, up, right, right, down.', 'The Understudy bows to you, deeply, as if you were the audience and the act at once.', 'Somewhere in the dark of the hall, one pair of hands claps, twice, and stops.'] }],
    rules: ['Puzzle: on the stage, the Understudy turns to face a sequence of directions, over and over. Standing near him, take steps in the same directions in the same order (left, up, right, right, down).',
      'Secret: the bottom-left corner of the hall, past the zigzag footprints, is an invisible maze (walls you cannot see). At its end, a slate with the whole act on it.',
      'Secret: use the Laughter (E39) facing the programme on the floor in front of the golden seat: the seat claps back.',
      'Secret: with the Bedroom light off, someone sits beside the golden seat.',
      'Secret: between 20:00 and 21:00 (real time, “curtain: eight o’clock”), the footlights come on by themselves at the front of the stage.']
  });

  /* ======================= W037 — THE COMPLAINTS OFFICE =======================
   * Secrets: the drawer room behind the plaque (fake wall) · with a Stamp of your own,
   * the empty APPROVED tray · with glasses, the notice under the black bars (reveal). */
  MORE('W037', {
    fakeWalls: [[43, 2]],
    post: function (rows) { return carve(widen(rows, 6), 44, 1, 4, 4, '.'); },
    place: [
      D('m2_formtrail', [42, 1], 'scraps', ['A trail of dropped forms leads behind the plaque and into the wall, as if the wall had been eating them, one at a time.'], FLAT),
      D('m2_drawers', [47, 2], 'drawer', ['Drawers from floor to ceiling, each labelled with a date. This is where the forms go. Every complaint ever made is in here, still sealed.'], { solid: true }),
      D('m2_childform', [45, 3], 'letter', [{ t: 'One drawer has been left open. On top, a form in a child’s handwriting, the one that is crossed out in the files upstairs. Down here, nobody has crossed it out. Reason for complaint: at school, nobody talks to me. Under it, in pencil: read.', do: [{ secret: 'm2_office_drawer' }] }], { solid: false }),
      D('m2_approved', [35, 20], 'book', [{ t: 'With a stamp of your own, you see the tray at last: APPROVED. It has always been empty. You stamp the top complaint from the other pile — HEARD — and put it in. The tray does not know what to do with it, so it keeps it.', do: [{ secret: 'm2_office_heard' }] }],
        F({ cond: { equipped: 'E34' } })),
      D('m2_notice', [30, 1], 'poster', ['A notice on the wall, every word under a black bar. The bars are so new that they still shine.'], { solid: true }),
      D('m2_noticeread', [31, 1], 'scraps', [{ t: 'Through your glasses, the letters under the bars show their shapes: ALL COMPLAINTS WILL BE READ. The bars were added later, one word at a time, starting with READ.', do: [{ secret: 'm2_office_notice' }] }],
        F({ cond: { equipped: 'E14' }, hiddenUntilReveal: true }))
    ],
    rules: ['Secret: a trail of dropped forms leads behind the plaque in the north-east corner; the wall there can be walked through. Behind it, the drawer room, with the child’s complaint, uncrossed.',
      'Secret: with the Stamp (E34) equipped, the empty APPROVED tray appears on a desk in the south-east of the office.',
      'Secret: with the Glasses (E14) equipped, use them by the blacked-out notice on the north wall: its words show through.']
  });

  /* ======================= W038 — THE APARTMENT BLOCK =======================
   * Secrets: a line of light under 1204 when the bedroom door is ajar · say you are home at
   * the door of 1204 (listen) · wet footprints on the stairs at seven in the morning (real
   * time) · a slice of cake once you have talked to the neighbour enough (talks). */
  MORE('W038', {
    place: [
      D('m2_light1204', [36, 3], 'glint', [{ t: 'A thin line of light under the door of 1204. Inside, someone has left a bedroom door ajar, the way you do when you are waiting to hear the front door.', do: [{ secret: 'm2_block_light' }] }],
        F({ cond: { roomDoor: true } })),
      D('m2_doormat', [34, 3], 'towel', ['The doormat of 1204, worn through in two places by the same small shoes.'], F({
        listen: [{ match: ['다녀왔습니다', '다녀왔어', '다녀왔어요', '나 왔어', 'im home', 'i am home', 'i m home', 'im back', 'i am back'],
          lines: ['You say it at the door, the way you say it every day.', 'Nobody answers. Nobody ever does.', 'But behind the door, the television turns itself down, as if somebody wanted to hear your footsteps.'],
          do: [{ secret: 'm2_block_home' }] }] })),
      { id: 'm2_homesoul', type: 'soul', at: [33, 4], keepSoul: true, lines: [EN('When you come in, you say you’re home. Out loud. Even when nobody answers.')] },
      D('m2_wetsteps', [21, 12], 'scuff', [{ t: 'Seven in the morning. Wet footprints come up the stairs, a woman’s work shoes, one step at a time, stopping on every landing to rest. They go on up towards the twelfth floor.', do: [{ secret: 'm2_block_seven' }] }],
        F({ cond: { realHour: [7, 8] } })),
      D('m2_cake', [16, 3], 'cake', [{ t: 'On a plate outside the door of 1202, a slice of cake under cling film, and a note: for the girl in 1204. you don’t have to say anything. You take a biscuit-sized piece and leave the rest for later.', do: [{ cookie: 1 }, { secret: 'm2_block_cake' }] }],
        { solid: false, cond: { talks: { N130: 3 } } })
    ],
    rules: ['Secret: with the Bedroom door ajar, a line of light shows under the door of 1204.',
      'Secret: say “I’m home” (다녀왔습니다) on the doormat of 1204: the television behind the door turns itself down.',
      'Secret: between 7:00 and 8:00 in the morning (real time), wet footprints come up the stairs.',
      'Secret: after talking to the Neighbour in 1202 three times, a slice of cake is left outside her door (a biscuit).']
  });

  /* ======================= W039 — THE GREY BEACH =======================
   * Puzzle: light the four driftwood fires before the first goes out (lampsAll) -> a bottle.
   * Secrets: the sea cave of left shoes behind the cliff (fake wall) · give the sea a song with
   * the Melody · the ash is burnt letters, with glasses (reveal) · the crab reaches the boat
   * at the very end of the night (dream phase). */
  var FIRES = [[8, 15], [22, 15], [38, 15], [52, 15]];
  MORE('W039', {
    fakeWalls: [[10, 33]],
    post: function (rows) { return carve(deepen(rows, 5), 8, 34, 5, 3, '.'); },
    place: FIRES.map(function (c, i) { return D('m2_fire' + (i + 1), c, 'beacon', ['A pile of driftwood and burnt letters, ready to be lit. There are four of them along the tide line, like the words of a sentence.'], { solid: true }); }).concat([
      D('m2_bottle', [31, 13], 'glass', [{ t: 'A bottle the tide has left at your feet. Inside, a letter so washed out that only the first word can still be read, written in a careful hand from before the war: a girl’s name, and the little sound you add to it when you call someone you love.', do: [{ secret: 'm2_beach_bottle' }] }],
        F({ cond: { flag: 'm2_beach_fires' } })),
      D('m2_cliffcrack', [10, 32], 'crack', ['A crack at the foot of the cliff. Cold air comes out of it, and the smell of the sea from much further down.'], FLAT),
      D('m2_caveshoes', [10, 35], 'shoe', [{ t: 'A sea cave, where the tide keeps what it takes: letters, bottles, an oar. Along the back wall, set out in a careful row, as if by someone tidying a hallway: children’s shoes. Every one of them is a left shoe.', do: [{ secret: 'm2_beach_cave' }] }], { solid: false }),
      D('m2_caveoar', [12, 34], 'plank', ['An oar, worn smooth on one side only. Here, the oars only ever rowed one way.'], { solid: false }),
      D('m2_tideline', [26, 13], 'shell', ['The very edge of the sea. The waves come in so quietly here that you can tell they are listening.'], F({
        onEffect: { E03: [{ lines: ['You give the sea the only song you have, the one from the garden.', 'For once the sea does not take. It holds the tune a moment, and gives back the last note, a little lower, in a voice like an old woman humming at a bedside.'] }, { secret: 'm2_beach_song' }] } })),
      D('m2_ashwords', [44, 27], 'scraps', [{ t: 'Through your glasses the ash is not ash. Every grey flake is a scrap of burnt letter, and some still have a word on them: next. boat. come. back. soon. They are all from the same letter.', do: [{ secret: 'm2_beach_ash' }] }],
        F({ cond: { equipped: 'E14' }, hiddenUntilReveal: true })),
      D('m2_crabboat', [15, 22], 'shell', [IF({ notFlag: 'got:shoe' }, { t: 'At the very end of the night, the ash crab has reached the rowing boat at last. It has climbed into the child’s shoe and sits in it like a hermit crab in a borrowed shell.', do: [{ secret: 'm2_beach_crab' }] }),
        IF({ flag: 'got:shoe' }, { t: 'At the very end of the night, the ash crab has reached the rowing boat at last. It sits in the bottom of the boat, exactly where the child’s shoe used to be, and will not be moved.', do: [{ secret: 'm2_beach_crab' }] })],
        { solid: false, cond: { phase: 'final' } })
    ]),
    mech: [{ type: 'lampsAll', lamps: ['m2_fire1', 'm2_fire2', 'm2_fire3', 'm2_fire4'], time: 24, light: 3,
      litLines: ['The driftwood catches. Burnt letters curl and glow.', 'Another fire on the tide line. The first is already sinking.', 'Three fires. Hurry.'],
      onLine: 'It burns. For now.', doneLine: 'The four fires burn on along the tide line.',
      done: { flag: 'm2_beach_fires' }, reward: [{ set: { m2_beach_fires: true } }, { secret: 'm2_beach_fires' }],
      winLines: ['Four fires burn along the shore at once, like a sentence finally finished.', 'Far out at sea, for a moment, a boat turns towards them. It does not come in. But it turned.', 'The tide comes in, and goes out, and leaves something at your feet.'] }],
    rules: ['Puzzle: four piles of driftwood stand along the tide line. Light all four before the first one goes out (about twenty-four seconds): a bottle washes up on the shore.',
      'Secret: a cold crack at the foot of the cliff, west of the ladder, can be walked through: a sea cave full of left shoes.',
      'Secret: use the Melody (E03) facing the shell at the very edge of the sea: the sea gives the last note back.',
      'Secret: with the Glasses (E14) equipped, use them on the sand south-east of the whale bones: the ash is burnt letters.',
      'Secret: in the last phase of the dream, the ash crab has reached the rowing boat.']
  });

  /* ======================= W040 — THE LIGHTLESS ROOM =======================
   * Puzzle: keep very still in the middle of the room (standStill), the way you do.
   * Secrets: the space behind the east wall (? wall, seen with a revealing effect) ·
   * handprints inside the mirror by lantern light · tell the switch you are awake (listen). */
  MORE('W040', {
    post: function (rows) { return carve(widen(rows, 5), 15, 5, 4, 3, '.'); },
    place: [
      D('m2_stillspot', [7, 5], 'scuff', ['The middle of the room, where the floor is a little warmer, as if someone had lain here a great many nights without moving.'], FLAT),
      D('m2_waterglass', [7, 4], 'glass', [{ t: 'A glass of water on the floor by where your head was, the way she leaves one on the nights she is not working. It is still cold.', do: [{ secret: 'm2_dark_water' }] }],
        { solid: false, cond: { flag: 'm2_dark_still' } }),
      D('m2_switchplate', [7, 1], 'switch', ['A pale square on the wall, at the height of a grown-up’s hand, where a light switch used to be. Pressing it does nothing.'], { solid: true,
        listen: [{ match: ['im awake', 'i am awake', 'i m awake', 'not asleep', 'im not asleep', 'i am not asleep', '안 자', '안자', '안 자요', '안 잤어', '깨어 있어'],
          lines: ['You say it out loud, into the dark.', 'Somewhere a switch clicks. For one second the room is lit, and it is your bedroom, exactly, with you in the bed, eyes shut.', 'Then it is dark again. Nobody heard. Or somebody did.'],
          do: [{ secret: 'm2_dark_awake' }] }] }),
      D('m2_handprints', [12, 8], 'hand', [{ t: 'By lantern light you can see them: small handprints all over the mirror, on the inside of the glass, as if someone in there had been looking for the way out for a long time.', do: [{ secret: 'm2_dark_hands' }] }],
        F({ cond: { equipped: 'E05' } })),
      D('m2_tapedswitch', [18, 6], 'switch', [{ t: 'Behind the wall, in a space no bigger than a cupboard: a light switch at a child’s height, taped down in the ON position. The tape is very old. Someone has written on it, in the round letters of a six-year-old: DONT.', do: [{ secret: 'm2_dark_switch' }] }], { solid: true })
    ],
    mech: [{ type: 'standStill', mark: 'm2_stillspot', secs: 30, breakLine: 'You moved. Somewhere, a hand that was reaching for a switch stops, and waits.',
      done: { flag: 'm2_dark_still' }, reward: [{ set: { m2_dark_still: true } }, { secret: 'm2_dark_still' }],
      winLines: ['You lie very still, the way you do, and breathe the way people breathe when they are asleep.', 'Footsteps. A door opens a crack. A hand on a switch that is not there.',
        KS('자니? …잘 자, 우리 딸.', 'Are you asleep? …Sleep well, my girl.'), 'The door closes. You let your breath out.'] }],
    rules: ['Puzzle: stand perfectly still for thirty seconds on the warm spot in the middle of the room: someone looks in, says goodnight, and leaves a glass of water.',
      'Secret: the east wall (?) can be walked through with a revealing effect (the Glasses, E14): behind it, a cupboard-sized space with a light switch taped ON.',
      'Secret: with the Lantern (E05) equipped, small handprints show on the mirror.',
      'Secret: say “I’m awake” (안 자) by the pale square where the light switch used to be.']
  });
})(typeof window !== 'undefined' ? window : globalThis);
