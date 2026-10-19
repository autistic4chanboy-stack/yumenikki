/* =========================================================================
 *  MORE (08) — puzzles and secrets added to 26 newer worlds (new_01 … new_10),
 *  without rewriting them (see _more_kit.js). Each addition keeps to the
 *  spirit of its cluster: the apartment block, the seaside town, the school
 *  after hours, the Northern Line, the night shift, the forest of things left
 *  behind, the paper city, the inside of things, the weather rooms, and the
 *  sixth sleep (depth 5 stays among depth 5: no new doors anywhere).
 *  Flags, temps and secret keys prefixed m8_ · one inhabitant (N2260).
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, M = YN.kit.more;
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a mark at a fixed cell (checked on the built map) */
  function D(id, look, at, lines, o) { return Object.assign({ id: id, type: 'decor', look: look, at: at, lines: lines }, o || {}); }
  var LULLABY = YN.data.lullaby || '3232120';

  /* ---------------------------------------------------------------
   *  W208 — Inside the Shoe Cupboard · secret: say “I’m home”
   * --------------------------------------------------------------- */
  M('W208', {
    place: [D('m8_slippers', 'shoe', [1, 1], ['A pair of small indoor slippers by the 1204 cupboard door, set out toes-in, the way slippers wait for someone expected.',
        'The doors along the cupboard say “I’m home” all night. Nobody ever says anything back.'], { lookOpt: { c: ['#e8b8c0'] }, solid: false, listenDist: 4,
      listen: [{ if: { flag: 'm8_w208_home' }, match: ['i m home', 'im home', 'i am home', 'home', '다녀왔습니다', '다녀왔어', '나 왔어'], lines: [KS('어서 와.', 'Welcome home.')] },
        { if: { notFlag: 'm8_w208_home' }, match: ['i m home', 'im home', 'i am home', 'i m back', 'im back', 'home', '다녀왔습니다', '다녀왔어요', '다녀왔어', '나 왔어', '왔어요'],
          lines: ['You say it, quietly, to the dark inside the cupboard.', KS('…어서 와.', '…Welcome home.'),
            'It comes from every cupboard door at once, very softly, as if the whole building had been waiting to say it.',
            'The guest slippers shuffle over and line up beside yours, toes in.'],
          do: [{ set: { m8_w208_home: true } }, { secret: 'm8_welcome_home' }, { sfx: 'reveal' }] }] })],
    rules: ['Secret: by the 1204 cupboard door, where her slippers wait, say “I’m home” (다녀왔습니다). For once, the cupboard answers: “어서 와” (welcome home).']
  });

  /* ---------------------------------------------------------------
   *  W211 — The Twelfth-Floor Corridor · puzzle: wait with the Key Child
   * --------------------------------------------------------------- */
  M('W211', {
    place: [D('m8_spot', 'chalkmark', [26, 5], ['A square drawn in chalk beside the girl, the size of someone sitting down.',
      'Inside it, in a child’s writing: “for whoever waits with me”.'], { solid: false, flat: true })],
    mech: [{ type: 'standStill', mark: 'm8_spot', secs: 15, flag: 'm8_w211_waited', breakLine: 'You moved. She looks up, then back down at her knees.',
      reward: [{ secret: 'm8_waited_with_her' }, { collect: 'coins' }],
      winLines: ['You sit down in the chalk square beside her. Neither of you says anything.', 'The corridor light goes out, because nobody is moving. Neither of you minds.',
        KS('…같이 기다려 준 사람 처음이야.', '…You’re the first person who ever waited with me.'),
        'She presses something into your hand: a coin, still warm, the one she was keeping for the vending machine downstairs.'] }],
    rules: ['Puzzle: beside the Key Child, a chalk square “for whoever waits with me”. Stand still in it for about fifteen seconds: she is not waiting alone any more, and gives you a coin.']
  });

  /* ---------------------------------------------------------------
   *  W220 — The Show Flat · puzzle: push the child’s chair to the table
   * --------------------------------------------------------------- */
  M('W220', {
    place: [D('m8_place', 'scuff', [23, 15], ['At the table, the third place is laid: a plastic fish, a spoon, chopsticks. Its chair is missing.',
        'Four little dents in the rug show where the chair should stand.'], { solid: false, flat: true }),
      D('m8_chair', 'chair', [25, 18], ['A child’s dining chair, pushed far back from the table, as if someone had left in a hurry.',
        'It slides when you lean on it. It would only go forwards, never back.'], { cond: { notFlag: 'm8_w220_seat' } }),
      D('m8_chairin', 'chair', [23, 15], ['The child’s chair, back at the table. For once, the place in front of it is not only for show.'], { cond: { flag: 'm8_w220_seat' } })],
    mech: [{ type: 'push', blocks: ['m8_chair'], plates: ['m8_place'], sfx: 'step_wood', flag: 'm8_w220_seat', reward: [{ secret: 'm8_place_at_table' }],
      winLines: ['The chair slides into the dents in the rug with a small, satisfied knock.', 'All at once the three mannequins turn their heads towards it, the way a family looks up when someone sits down late.',
        'The model mother’s hand, which was resting on nothing, now rests on the back of the chair.'] }],
    rules: ['Puzzle: at the dining table the third place is laid but its chair has been pushed far back. Push the child’s chair (you can only push it) into the dents in the rug at the table: the mannequins turn towards it.']
  });

  /* ---------------------------------------------------------------
   *  W222 — The Ferry That Never Leaves · puzzle: answer the signal lamps
   * --------------------------------------------------------------- */
  var LAMP = ['A signal lamp bolted to the north rail. Its shutter clicks open and shut on its own, in turn with the others,', 'as if they were saying something across the water.'];
  M('W222', {
    place: [D('m8_lamp1', 'lantern', [15, 4], LAMP, { light: 1 }), D('m8_lamp2', 'lantern', [20, 4], LAMP, { light: 1 }),
      D('m8_lamp3', 'lantern', [25, 4], LAMP, { light: 1 }), D('m8_lamp4', 'lantern', [30, 4], LAMP, { light: 1 })],
    mech: [{ type: 'sequence', order: ['m8_lamp3', 'm8_lamp1', 'm8_lamp4', 'm8_lamp2'], flag: 'm8_w222_signal',
      ring: { every: 1.6, pause: 5, hear: 18, sfx: 'switch', glyph: '✦', color: '#f0e0a0' },
      okLines: ['The shutter clacks under your hand. Out on the water, nothing yet.', 'A second lamp flashes your answer north.', 'A third.'],
      wrongLine: 'The lamps go dark together, then start their message again from the beginning.', doneLine: 'The lamps are still now. Across the water, one window stays lit.',
      reward: [{ secret: 'm8_north_shore_answers' }],
      winLines: ['You answer the lamps in their own order.', 'Far across the water, where the North Shore should be, a single window lights up, goes out, and lights up again.',
        'Someone over there has signalled the ferry every night for seventy years. Nobody ever answered before.', 'Behind you, the captain takes off his cap and holds it against his chest.'] }],
    rules: ['Puzzle: four signal lamps on the north rail flash in turn, always in the same order. Use them in that order (third, first, fourth, second from the stern): a window answers from the North Shore.']
  });

  /* ---------------------------------------------------------------
   *  W234 — The Squid Boat Lights · secret: the dark boat (light off at home)
   * --------------------------------------------------------------- */
  M('W234', {
    place: [D('m8_bulb', 'glint', { near: 'back', dx: -4, dy: -1 }, ['A bare bulb lying on a coil of rope, unscrewed from a squid boat and set aside on purpose.',
        'Someone wanted one patch of this sea to stay dark, for those who sleep better without.'], { solid: false }),
      { id: 'm8_darkboat', type: 'decor', at: 'random-hidden', look: 'boat', lookOpt: { c: ['#3a3a40', '#1a1a20'] }, cond: { dark: true },
        lines: ['A small boat with no bulbs at all: the only dark thing on the sea.', 'Under a tarpaulin, a child is asleep, breathing slowly, one hand trailing in the water.',
          'Out here, in the one place without a light, somebody is not afraid.'], use: [{ secret: 'm8_dark_boat' }] }],
    rules: ['Secret: when the light is off in her bedroom, a boat with no bulbs at all appears at the edge of the lights. A child sleeps in it, in the dark.']
  });

  /* ---------------------------------------------------------------
   *  W247 — The Shoe Lockers · secret: the rest of the notice (after five)
   * --------------------------------------------------------------- */
  M('W247', {
    place: [D('m8_unless', 'letter', [26, 20], ['A note taped to the inside of the glass doors, at child height, in the caretaker’s square capitals:',
      '“…UNLESS NOBODY HAS COME FOR YOU YET. THEN WAIT IN HERE, WHERE IT IS DRY. I AM IN THE BOILER ROOM. KNOCK.”'],
      { solid: false, cond: { realHour: [17, 23] }, use: [{ secret: 'm8_unless' }] })],
    rules: ['Secret: after five in the evening (real time, until eleven), a note appears on the inside of the glass doors: the end of the notice’s “unless”.']
  });

  /* ---------------------------------------------------------------
   *  W253 — The Chained Roof Door · secret: the first paper aeroplane
   * --------------------------------------------------------------- */
  M('W253', {
    place: [D('m8_windsock', 'banner', [32, 4], ['A windsock tied to the railing, hanging limp.', 'It only lifts when a window is open somewhere far below, and the draught climbs the stairwell.']),
      D('m8_plane', 'letter', [32, 15], [{ t: 'A paper aeroplane, blown into the corner of the roof by the draught from an open window.' },
        { t: 'On its wing, in pencil, the question the others carry: “is anyone else up?” The handwriting is yours.' },
        { t: 'Unfolded, it is a page torn from a diary that is not yours.', do: [{ secret: 'm8_first_plane' }, { collect: 'pages' }] }],
        { solid: false, cond: { roomWindow: true } })],
    rules: ['Secret: when her bedroom window is left open, the draught brings a paper aeroplane into the far corner of the roof (bottom right). It is the first one: her question, folded from a diary page.']
  });

  /* ---------------------------------------------------------------
   *  W255 — Inside the Piano · secret: sing to the hairpin string
   * --------------------------------------------------------------- */
  M('W255', {
    place: [D('m8_hairpin', 'trinket', [3, 10], [{ if: { notFlag: 'm8_w255_sang' }, t: 'Under the humming string, a hairpin with a little plastic strawberry, wedged there on purpose.' },
        { if: { flag: 'm8_w255_sang' }, t: 'The strawberry hairpin. It stays where it is: it has a job.' }], { lookOpt: { c: ['#e04050'] }, solid: false, flat: true, listenDist: 3,
      listen: [{ if: { flag: 'm8_w255_sang' }, any: true, lines: ['The hairpin string buzzes along with you again.'] },
        { if: { notFlag: 'm8_w255_sang' }, any: true, lines: ['You sing, very quietly, into the dark of the piano. It doesn’t matter what.',
          'The string with the hairpin buzzes along like a bee keeping time.',
          'Somewhere above, in the empty music room, someone laughs once, delighted,', 'the way a teacher laughs when the shy one finally sings.'],
        do: [{ set: { m8_w255_sang: true } }, { secret: 'm8_hairpin_song' }, { sfx: 'chime' }] }] })],
    rules: ['Secret: the folded note says “ask her to sing”. By the string with a hairpin under it (left, middle row), say or sing anything: the string buzzes along, and someone upstairs laughs.']
  });

  /* ---------------------------------------------------------------
   *  W259 — Sports Day at Night · puzzle: say “go”, then take third place
   * --------------------------------------------------------------- */
  M('W259', {
    mech: [{ type: 'sayTo', ent: 'N1395', dist: 3, words: ['go', 'get set go', 'ready steady go', '출발', '시작', '땅'], flag: 'm8_w259_go',
        winLines: ['“…Go,” you say, so quietly that only the starter hears.', 'He drops the flag as if it had been burning his hand.',
          'All round the track the chalk runners burst off the line and run one whole lap,', 'then stop at the podium, waiting for whoever comes third.'] },
      { type: 'reach', zone: [40, 32, 40, 32], cond: { flag: 'm8_w259_go' }, flag: 'm8_w259_third', failLine: 'Nobody has run yet. There is no third place to stand in.',
        reward: [{ secret: 'm8_third_place' }],
        winLines: ['You stand in front of the third step, worn smooth by somebody who only ever came third, and was glad.',
          'The chalk runners clap without a sound. One of them hangs a paper ribbon round your neck: 3rd.', 'It is the first ribbon anyone has given you.'] }],
    rules: ['Puzzle: the starter has been waiting for “go” since the morning. Say “go” beside him: the chalk runners run.',
      'Then stand in front of the third step of the podium (bottom right): a paper ribbon, 3rd.']
  });

  /* ---------------------------------------------------------------
   *  W274 — Monument Square at Night · puzzle: the citizens’ questions
   * --------------------------------------------------------------- */
  M('W274', {
    place: [D('m8_board', 'board', [40, 1], ['A tall board at the edge of the square: CITIZENS’ EVENING QUESTIONS. A pencil hangs from it on a string.']),
      D('m8_honest', 'chalkmark', [41, 1], ['Beside the board, scratched low on the wall where only a child would write, the other answers:',
        KN('전기가 없습니다. 울고 있습니다. 철이.', 'There is no electricity. She is crying. Chol-i.')], { solid: false, cond: { flag: 'm8_w274_quiz' }, use: [{ secret: 'm8_other_answers' }] })],
    mech: [{ type: 'quiz', mark: 'm8_board', flag: 'm8_w274_quiz',
      intro: ['The board asks its questions in red letters. Everyone answers correctly. Everyone always has.'],
      questions: [{ q: 'Question one. How is everything?', choices: ['Everything is going well.', 'Not very well.', 'I don’t know.'], right: 0 },
        { q: 'Question two. The lights in your street went out at nine. Why?', choices: ['There is no electricity.', 'They did not go out.', 'So that the monument can shine.'], right: 1 },
        { q: 'Question three. A woman has been bowing for a long time, and her face is wet. Why?', choices: ['She is crying.', 'She is tired.', 'It is the dew.'], right: 2 },
        { q: 'Question four. Someone is missing from the square tonight. Who?', choices: ['A boy called Chol-i.', 'Nobody is missing.', 'You.'], right: 1 }],
      failLine: 'A red mark appears beside your name, and is quickly painted over. “Answer again. Correctly.”', doneLine: 'A gold star beside your name. The same gold star is beside every name.',
      winLines: ['Four correct answers. A loudspeaker plays a short fanfare for nobody.', 'A gold star is pasted beside your name. It is the same gold star beside every name.',
        'As the board swings back on its hinge, you see that the wall beside it has been written on too.'] }],
    rules: ['Puzzle: the board at the top of the square asks four questions. The “correct” answers are the ones in which everything is fine (going well; they did not go out; the dew; nobody is missing).',
      'Answered correctly, the board swings aside: scratched on the wall beside it, the true answers.']
  });

  /* ---------------------------------------------------------------
   *  W280 — The Lamp Hut · secret: the letter the daylight never showed
   * --------------------------------------------------------------- */
  M('W280', {
    place: [D('m8_letter', 'mailbox', [4, 12], [{ t: 'In the light of the signal lamp, something shows at the back of the letterbox:' }, { t: 'an envelope stuck flat to the cold metal, the same grey as the inside.' },
      { t: 'Every day, by daylight, he emptied the box and never saw it.' },
      { t: 'The stamp is from the South. On the back, in a woman’s round hand:' }, KS('오빠, 우리는 잘 지내요. 오빠 자리는 비워 뒀어요.', 'Big brother, we are well. We have kept your place at the table.'),
      { t: 'You leave it by the stove, where he will see it.', do: [{ secret: 'm8_letter_from_south' }, { collect: 'pages' }] }], { cond: { equipped: 'E224' } })],
    rules: ['Secret: with The Lamp Left On (E224) equipped, the empty letterbox by the door shows what daylight never did: a letter from the South, stuck to the back of the box for years.']
  });

  /* ---------------------------------------------------------------
   *  W284 — Inside the Humming Locker · secret: the mirror, in her tunic
   * --------------------------------------------------------------- */
  M('W284', {
    place: [D('m8_mirror', 'mirror', [10, 16], ['In the tunic, you stand on tiptoe. The mirror still only shows the top of your head, and a hanger.',
      'Then, for a moment, it shows more: a woman’s tired face, practising a smile before she goes home.', 'She stops when she sees you. Then she does it again, better, for you.'],
      { cond: { equipped: 'E225' }, use: [{ secret: 'm8_practised_smile' }] })],
    rules: ['Secret: wearing the Night Tunic (E225), look into the little mirror stuck to the locker door: it shows her, practising the smile she takes home.']
  });

  /* ---------------------------------------------------------------
   *  W293 — Four O’Clock at the Store · secret: the real four o’clock
   * --------------------------------------------------------------- */
  M('W293', {
    place: [D('m8_till', 'drawer', [16, 16], ['The till drawer, open a crack. Among the coins, a cheap wristwatch, ticking.',
        'The wall clock always says four. The clerk keeps the watch for the real four o’clock, when the nurse comes in.']),
      D('m8_milk', 'coffee', [14, 15], ['Four o’clock. Really four, out there too.', 'At the end of the counter: a banana milk with the straw already in it, and a tuna rice triangle.',
        'On the lid, in the clerk’s writing: “for her kid. paid.”'], { lookOpt: { c: ['#f0e070'] }, solid: false, cond: { realHour: [4, 5] }, use: [{ secret: 'm8_four_am_breakfast' }] })],
    rules: ['Secret: between four and five in the morning (real time), the breakfast she buys every night is waiting at the end of the counter, already paid for.']
  });

  /* ---------------------------------------------------------------
   *  W294 — Inside the Drum · puzzle: keep in the tumbling towel’s shadow
   * --------------------------------------------------------------- */
  M('W294', {
    place: [D('m8_scratch', 'chalkmark', [17, 25], ['High in the drum a towel tumbles round and round, and its shadow goes round the floor with it.',
      'Scratched into the steel at child height: “stay under the towel. it carries you.”'], { solid: false, flat: true })],
    mech: [{ type: 'followShadow', center: [15, 15], r: 10, speed: 0.22, secs: 18, flag: 'm8_w294_shadow', breakLine: 'You lose the shadow. The towel tumbles on without you.',
      reward: [{ secret: 'm8_spun_together' }],
      winLines: ['You keep under the tumbling shadow all the way round, the way you would keep under an umbrella someone was holding.',
        'The drum slows. Every floating thing settles at once, as if someone had opened the door.', 'For a moment her tunic and your uniform lie side by side, not knotted, just close, and warm.'] }],
    rules: ['Puzzle: a shadow (a towel tumbling high above) circles the drum. Walk inside it, round with it, for about eighteen seconds without leaving it: the drum slows and everything settles.']
  });

  /* ---------------------------------------------------------------
   *  W305 — The Thicket of Unburied Toys · secret: finish the count
   * --------------------------------------------------------------- */
  M('W305', {
    place: [D('m8_base', 'tree', [5, 30], ['A tree at the edge of the clearing, its bark rubbed smooth at a child’s forehead height: home base.', 'Carved into it, very small: 98.'],
        { listenDist: 3, listen: [{ if: { notFlag: 'm8_w305_counted' }, match: ['99', '100', 'ninety nine', 'a hundred', 'one hundred', 'hundred', 'ready or not', '구십구', '백', '다 숨었니'],
          lines: ['You finish the count out loud, with your forehead against the tree.', 'The whole thicket holds its breath.',
            'Then, deep in the bracken, a small wooden rattle:', 'something that has been hiding since ninety-eight wants to be found at last.'],
          do: [{ set: { m8_w305_counted: true } }, { secret: 'm8_counted_to_100' }, { sfx: 'reveal' }] }] }),
      { id: 'm8_carriage', type: 'decor', at: 'random-hidden', look: 'toytrain', solid: false, cond: { flag: 'm8_w305_counted' },
        lines: ['The missing carriage of the wooden train, tucked under the roots. It has been hiding since the count stopped.', 'Now that someone has counted to a hundred, it lets itself be found.'],
        use: [{ secret: 'm8_carriage_found' }] }],
    rules: ['Secret: the counting always stops at ninety-eight. At the home-base tree by the clearing (beside the gate back), say “a hundred” (or 99, 100, 백).',
      'Something that has been hiding ever since lets itself be found: the train’s missing carriage, in a nook of the thicket.']
  });

  /* ---------------------------------------------------------------
   *  W308 — The Moss of Lost Gloves · puzzle: the echo in the round chamber
   *  · secret: the string through the rock (a hidden niche)
   * --------------------------------------------------------------- */
  M('W308', {
    post: function (rows) { return rows.map(function (r, y) { return y === 10 && r.slice(1, 4) === '###' ? r.slice(0, 1) + '...' + r.slice(4) : r; }); },
    fakeWalls: [[4, 10]],
    place: [D('m8_drip', 'puddle', [26, 23], ['Water drips into the round chamber below. Every drip comes back up as a word, but never the word that fell.'], { solid: false, flat: true }),
      D('m8_glove', 'hand', [31, 27], ['The other gardening glove, given back by the moss. Inside it, three tomato seeds, dry and still good.',
        'Grandma always kept seeds in the left glove, “for later”.'], { lookOpt: { c: ['#7a8a4a'] }, solid: false, cond: { flag: 'm8_w308_echo' }, use: [{ secret: 'm8_other_glove' }] }),
      D('m8_string', 'wire', [5, 10], ['A grey wool string comes out of the rock here and goes back in, pulled tight,', 'as if something on the other side were still holding on.'], { solid: false, flat: true }),
      D('m8_cut', 'sock', [1, 10], ['A dry hollow in the rock, just big enough to sit in.', 'In it, the middle of a mitten string: the part that ran up one coat sleeve and down the other.', 'It was cut, neatly, with school scissors.',
        'A tag in the Cataloguer’s hand: “FOUND — who cut it. She did, at nine, because they laughed at mittens on a string.”'], { lookOpt: { c: ['#8a8a92'] }, use: [{ secret: 'm8_cut_string' }] })],
    mech: [{ type: 'echo', zone: [21, 24, 33, 30], words: ['warm', 'hold', 'pair', 'string', 'soil', 'later', 'other', 'grandma'], flag: 'm8_w308_echo',
      reward: [{ secret: 'm8_moss_echo' }],
      winLines: ['You say the word back to the moss. The chamber goes quiet: the soft quiet of someone listening properly.', 'At the far side, the moss heaves a little and gives something up: a gardening glove, the left one.'] }],
    rules: ['Puzzle: in the round chamber at the bottom (where the gardening glove sits), say any word: the moss answers with another. Say that word back: it gives up the other gardening glove.',
      'Secret: in the left tunnel, a wool string goes into the rock. The rock there is not rock: walk through it into a niche, where the cut mitten string is kept.']
  });

  /* ---------------------------------------------------------------
   *  W309 — The Pond of Those Who Left · puzzle: the puddle under the willow
   * --------------------------------------------------------------- */
  M('W309', {
    place: [D('m8_puddle', 'puddle', [5, 5], ['A small puddle under the willow, never still.'], { solid: false })],
    mech: [{ type: 'cycleFrames', mark: 'm8_puddle', every: 2.4, good: 4, flag: 'm8_w309_self',
      frames: ['The puddle shows the man with the suitcase, smiling, waiting for the end of a joke.', 'The puddle shows the old woman, whistling two notes at nothing.',
        'The puddle shows the girl with the map on her arm. The map is washing off.', 'The puddle shows the willow, the sky, and nobody.',
        'For one moment the puddle shows you. You are smiling. You did not know you were.', 'Ripples. Only ripples.'],
      doneLine: 'The puddle keeps your face now, the right way up.', reward: [{ secret: 'm8_own_reflection' }],
      winLines: ['You touch the water just as your own face is in it.', 'The ripple keeps it. For once, the pond has kept someone who did not leave.',
        'A tag floats up between the roots: “FOUND — her. Not lost. Not left.”'] }],
    rules: ['Puzzle: under the willow at the top left, a puddle shows a different reflection every few seconds. Touch it at the moment it shows her own face: the pond keeps her reflection.']
  });

  /* ---------------------------------------------------------------
   *  W323 — The Library of Blacked-Out Books · secret: reading in the dark
   * --------------------------------------------------------------- */
  M('W323', {
    place: [D('m8_notice', 'poster', [12, 1], ['A notice: READING IN THE DARK IS FORBIDDEN. The notice itself has been blacked out, except for the word DARK.']),
      D('m8_darkbook', 'book', [38, 1], ['A book lying face down in the far corner, where the lamps don’t reach.',
        'With every light out, the black bars are black on black: they vanish.', 'Only the words they left behind show, pale, and for once they make a sentence:',
        '“…mother… came… home… early… and… stayed.”', 'Whoever blacked it out left exactly those words. By mistake, perhaps.'], { cond: { roomLight: false }, use: [{ secret: 'm8_read_in_the_dark' }] })],
    rules: ['Secret: when the light is off in her bedroom, a book lies in the top right corner of the library. In the dark the black bars disappear, and the words left between them make a sentence.']
  });

  /* ---------------------------------------------------------------
   *  W333 — The Room of School Reports · secret: tick the box yourself
   * --------------------------------------------------------------- */
  M('W333', {
    place: [D('m8_slip', 'letter', [10, 1], [{ if: { notFlag: 'm8_w333_no' }, t: 'A reply slip stapled beside the report: “Is everything all right at home? [ ] Yes [ ] No. Please tick and return.”' },
        { if: { notFlag: 'm8_w333_no' }, t: 'Nobody ticked it. Nobody asked you to.' }, { if: { flag: 'm8_w333_no' }, t: 'The reply slip. The “No” box is ticked, in your handwriting.' }],
      { solid: false, listenDist: 3,
        listen: [{ if: { notFlag: 'm8_w333_no' }, exact: true, match: ['no', 'nope', 'not really', 'not fine', 'no it is not', 'no it isn t', 'i m not fine', 'i am not fine', 'it is not fine', 'it s not fine',
            '아니', '아니요', '아뇨', '아니오', '안 괜찮아', '안 괜찮아요'],
          lines: ['You say it out loud, to the slip: no.', 'The “No” box fills itself in, slowly, in your own handwriting.',
            'The teacher stops writing, and for the first time looks up from the clipboard, at you, and writes nothing down.'],
          do: [{ set: { m8_w333_no: true } }, { secret: 'm8_ticked_no' }, { sfx: 'page' }] },
          { if: { notFlag: 'm8_w333_no' }, exact: true, match: ['yes', 'fine', 'i m fine', 'i am fine', '네', '응', '괜찮아', '괜찮아요'],
            lines: ['The “Yes” box ticks itself, neatly, the way it always has.', 'The teacher files the slip without looking up.'] }] })],
    rules: ['Secret: beside the second report, a reply slip asks “Is everything all right at home?”. Answer it out loud: “no” (아니요). The box fills itself in, and the teacher looks up.']
  });

  /* ---------------------------------------------------------------
   *  W342 — Inside the Music Box · puzzle: hum the line the box remembers
   * --------------------------------------------------------------- */
  M('W342', {
    place: [D('m8_card', 'letter', [28, 18], ['A strip of punched card, fallen out of the drum: the song, written in holes.',
      'Seven holes, then nothing. A finger has traced them so often that the card has gone soft.'], { lookOpt: { c: ['#d8b060'] }, solid: false })],
    mech: [{ type: 'melodyLock', mark: 'm8_card', tune: LULLABY, dist: 4, flag: 'm8_w342_bar', reward: [{ secret: 'm8_last_bar' }],
      winLines: ['You play the seven notes beside the card, slowly. Not too fast, not too slow.', 'The governor straightens up as if someone had called his name, and beats time with his whole body.',
        'When the seventh note fades, the box does something it has never done:', 'it goes on, one bar more, the bar nobody ever stayed awake to hear.',
        'It is very short. It sounds like a door being closed gently, so as not to wake someone.'] }],
    rules: ['Puzzle: by the governor, a punched card has seven holes: the first line of Grandmother’s lullaby. Play the lullaby beside it with the Melody (E03): the box plays one bar more, the one nobody stayed awake to hear.']
  });

  /* ---------------------------------------------------------------
   *  W375 — The Typhoon’s Eye · puzzle: corner the little gust
   * --------------------------------------------------------------- */
  M('W375', {
    npcs: [{ id: 'N2260', name: 'A Gust in a School Hat', look: { t: 'ghost', c: ['rgba(214,226,238,0.55)'], h: 13 }, behavior: 'flee', fleeDist: 4, radius: 4, speed: 1.7,
      solid: false, at: [6, 20], appear: { notFlag: 'm8_w375_gust' },
      lines: [EN('Catch me! Nobody ever does!'), 'A little gust wearing a school hat much too big for it. It dashes off the moment you come near.',
        EN('I go where the big wind goes. He never looks back to see if I’m still there.')] }],
    mech: [{ type: 'corner', ent: 'N2260', flag: 'm8_w375_gust', reward: [{ secret: 'm8_gust_hat' }],
      winLines: ['The gust has nowhere left to blow. It stops, and is suddenly very small.', 'It only wanted someone to come after it.',
        'It gives you the school hat it was wearing. Inside the band, a name tag written by a nursery teacher a long time ago: 미리내.'] }],
    rules: ['Puzzle: a little gust in a school hat runs from you on the west side of the eye. Drive it into the narrow tip at the far west edge, where it cannot get past you: it gives you its hat, with a name inside (the Typhoon’s).']
  });

  /* ---------------------------------------------------------------
   *  W380 — The Umbrella That Came · puzzle: the puddles, smallest first
   * --------------------------------------------------------------- */
  var PUD = [['m8_p0', [33, 13], 'A tiny puddle, one boot deep. The first one is always the smallest.'],
    ['m8_p1', [12, 12], 'A puddle the size of a dinner plate.'], ['m8_p2', [24, 13], 'A puddle as big as a school desk.'],
    ['m8_p3', [5, 12], 'An enormous puddle, nearly a pond. The kind you are told not to jump in, and do.']];
  M('W380', {
    place: PUD.map(function (p) { return D(p[0], 'puddle', p[1], [p[2]], { solid: false, flat: true }); }).concat([
      D('m8_drawing', 'drawing', [20, 5], ['A chalk drawing on the school wall, half washed away: four puddles, from small to big,', 'and a girl jumping in each one, holding somebody’s hand.'], { solid: false })]),
    mech: [{ type: 'stepOrder', plates: { '33,13': 0, '12,12': 1, '24,13': 2, '5,12': 3 }, count: 4, color: 'rgba(200,220,255,0.9)', flag: 'm8_w380_splash',
      reward: [{ secret: 'm8_puddle_jumps' }, { collect: 'photos' }],
      winLines: ['Splash. Splash. Splash. SPLASH.', 'Your socks are soaked through. Somebody under an umbrella is laughing, really laughing.',
        KS('양말 다 젖었네. …괜찮아. 집에 가서 말리자.', 'Your socks are soaking. …It’s all right. We’ll dry them at home.'),
        'Later, in a drawer, there will be a photograph of this: a blur of water, and a girl in the air.'] }],
    rules: ['Puzzle: four puddles below the school wall, of four sizes. Jump in them from the smallest to the biggest, as the chalk drawing shows: someone laughs under the umbrella.']
  });

  /* ---------------------------------------------------------------
   *  W391 — The Night Drum · puzzle: knock on the glass
   * --------------------------------------------------------------- */
  M('W391', {
    place: [D('m8_glass', 'glint', [14, 25], ['The inside of the porthole glass, curving away beside the door.', 'At knuckle height, three small smudges, very close together.'],
      { lookOpt: { c: ['#c8d8e8'] }, solid: false })],
    mech: [{ type: 'knock', mark: 'm8_glass', n: 3, within: 2.5, sfx: 'knock', flag: 'm8_w391_knock', firstLine: 'Tok. The sound goes out through the glass, into the dark flat.',
      doneLine: 'The glass is warm where the other hand was.', reward: [{ secret: 'm8_knock_on_glass' }],
      winLines: ['Tok, tok, tok, on the inside of the glass.', 'Far away, through the porthole, the kitchen light flickers, as if someone had looked up from the table.',
        'A shape comes and crouches in front of the machine, and lays its hand flat on the glass, over yours.', 'Then it goes back to the table. The drum turns. Somehow that is enough.'] }],
    rules: ['Puzzle: beside the porthole, three smudges on the glass at knuckle height. Knock on it three times quickly: someone in the kitchen comes and lays a hand on the other side.']
  });

  /* ---------------------------------------------------------------
   *  W393 — The Left Shoe’s Walk · secret: the right shoe (by smell)
   * --------------------------------------------------------------- */
  M('W393', {
    place: [D('m8_scent', 'tuft', [16, 44], ['Under the snow, a faint smell of soil and peppermint, going off between the pines,',
        'as if someone in a garden apron had come this way once, looking for something.'], { solid: false, flat: true }),
      { id: 'm8_rightshoe', type: 'decor', at: 'random-hidden', look: 'shoe', lookOpt: { c: ['#8a6a4a'] }, solid: false, cond: { equipped: 'E258' },
        lines: ['Where the smell of peppermint stops, in a dead end of the pines: a child’s right shoe,', 'dry, as if the snow had been told to leave it alone.',
          'Round its strap, a strip of cloth from a boy’s coat, knotted twice: “so you come back for it”.'], use: [{ secret: 'm8_right_shoe' }] }],
    rules: ['Secret: wearing Halmeoni’s Apron (E258), whose smell finds trails, a child’s right shoe appears in a dead end of the pine maze. Her big brother tied a strip of his coat round it.']
  });

  /* ---------------------------------------------------------------
   *  W395 — The Thousandth Crane · secret: the knot at a twin minute
   * --------------------------------------------------------------- */
  M('W395', {
    place: [{ id: 'm8_clockcrane', type: 'decor', at: 'random-any', look: 'crane', lookOpt: { c: ['#c8d0e0'] }, solid: false,
        lines: ['A crane folded from a clock-mender’s card. On its wing, in pencil:', '“when the hours and the minutes are twins, the string can be tied.”'] },
      { id: 'm8_knot', type: 'decor', at: 'random-hidden', look: 'crane', lookOpt: { c: ['#f0d080'] }, solid: false, light: 1.2, cond: { realDate: 'twinMinute' },
        lines: [{ t: 'At the very end of the string of cranes, where it was always left loose, a knot has tied itself.' },
          { t: 'Out there, the hour and the minute are the same. For one minute, the thousand cranes are one string.' },
          { t: 'Tied into the knot, a small card in two handwritings, one old, one a child’s: “come home”, twice.', do: [{ secret: 'm8_twin_minute_knot' }, { collect: 'cranes' }] }] }],
    rules: ['Secret: when the real hour and minute are the same (07:07, 11:11, 22:22…), a golden knot ties the end of the string of cranes, in a nook of cloud.']
  });

  /* ---------------------------------------------------------------
   *  W399 — The Roof of the First Night Shift · secret: in the photograph
   * --------------------------------------------------------------- */
  M('W399', {
    place: [D('m8_cross', 'chalkmark', [18, 11], ['A cross in chalk on the roof beside her, the kind photographers draw for people who will not stand still: HERE.'], { solid: false, flat: true }),
      D('m8_photo', 'photo', [18, 12], [{ t: 'The photo, still developing. Mi-ran, twenty-eight, laughing on a hospital roof in 2008.' },
        { t: 'Beside her, a little blurred, as if she had moved: a girl in a sweater, who would not be born for years.' },
        { t: 'Mi-ran’s hand is on the blur’s shoulder. She did not know she was doing it.', do: [{ secret: 'm8_photo_2008' }, { collect: 'photos' }] }],
        { solid: false, cond: { flag: 'm8_w399_posed' } })],
    mech: [{ type: 'standStill', mark: 'm8_cross', secs: 8, flag: 'm8_w399_posed', breakLine: 'You moved. The colleague lowers the camera and laughs.',
      winLines: ['You stand very still on the chalk cross, beside her.', { t: 'One more! Who’s the little one? …Never mind. Smile!', lang: 'en', who: 'The Colleague with a Camera' },
        'Flash.', 'The photo slides out of the camera and lands at your feet, still developing.'] }],
    rules: ['Secret: beside Mi-ran, a chalk cross says HERE. Stand still on it for a few seconds: the colleague takes one more photo, and it lands at your feet. You are in it.']
  });
})(typeof window !== 'undefined' ? window : globalThis);
