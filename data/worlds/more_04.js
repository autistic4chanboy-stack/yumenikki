/* =========================================================================
 *  MORE (04) — puzzles and secrets added to existing worlds W091–W120
 *  (the wreck, the weather station, the statue garden, the street of
 *  children alone, the house where the TV is on, cubicle 3, the rope gym,
 *  the rough book, the schoolyard in the snow, the cave of fruit stones,
 *  the whale's throat, the museum, the sewers, the thousand doors, the
 *  voices, the theatre and its backstage, the lit kitchen, the toy
 *  graveyard, the school of 1989, the hospital beneath, the patient's
 *  dream, Laboratory 6).
 *  Through-line: a girl who no longer speaks, using her voice and her
 *  hands where it matters (saying "it's raining", "no", "I miss you",
 *  calling a name, sending an unsent message, telling a nurse to sit).
 *  NPC ids N2170–N2172 · no new effect · flags/temps/secrets prefixed m4_.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, M = YN.kit.more;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a conditional line (object or NPC) */
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  /* the same reaction for several effects (onEffect) */
  function onAll(ids, acts) { var o = {}; ids.forEach(function (e) { o[e] = acts; }); return o; }
  var REVEAL = ['E14', 'E66', 'E106', 'E129', 'E155', 'E171', 'E207', 'E223', 'E254'];
  var ERASE = ['E10', 'E96', 'E226', 'E238'];
  var HANDLE = ['E86', 'E163'];
  var CLAP = ['E39', 'E212'];
  var CAN = ['E35', 'E176'];
  /* hand-drawn maps: every mark of o.place with fixed coordinates is drawn into the map as a mark
     character (A–Z), so it is placed before the world's random marks and nothing random lands on it.
     keepPlace: true keeps a mark in place[] (a second state of a mark on the same cell, side view). */
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function MX(id, o) {
    var d = YN.data.worlds[id]; if (!d || !d.map) return M(id, o);
    var used = {}; d.map.forEach(function (r) { for (var i = 0; i < r.length; i++) used[r[i]] = 1; });
    d.marks = d.marks || {}; Object.keys(d.marks).forEach(function (k) { used[k] = 1; });
    var stamps = [], li = 0, place = [];
    (o.place || []).forEach(function (md) {
      if (!Array.isArray(md.at) || md.keepPlace) { place.push(md); return; }
      while (li < LET.length && used[LET[li]]) li++;
      if (li >= LET.length) { place.push(md); return; }
      var ch = LET[li++], def = Object.assign({}, md); used[ch] = 1;
      delete def.at; d.marks[ch] = def; stamps.push([md.at[0], md.at[1], ch]);
    });
    var o2 = Object.assign({}, o, { place: place }), prev = o.post;
    if (stamps.length) o2.post = function (rows, r, def) {
      if (prev) rows = prev(rows, r, def) || rows; rows = rows.slice();
      stamps.forEach(function (s) { var row = rows[s[1]]; if (row === undefined || s[0] >= row.length) return; rows[s[1]] = row.slice(0, s[0]) + s[2] + row.slice(s[0] + 1); });
      return rows;
    };
    return M(id, o2);
  }

  /* ---------------------------------------------------------------
   *  W091 — The Wreck
   *  Puzzle: push the three trunks to the scuppers (push) -> room for
   *  the children. Secret: say her name to the passenger list (listen).
   * --------------------------------------------------------------- */
  var NOROOM = { notFlag: 'm4_w091_room' }, ROOM = { flag: 'm4_w091_room' };
  function trunk(id, x, y, l) { return { id: id, type: 'decor', at: [x, y], look: 'suitcase', solid: true, cond: NOROOM, lines: [l, 'Too heavy to lift. It would slide, if you leaned on it.'] }; }
  function scupper(id, y) {
    return { id: id, type: 'decor', at: [9, y], look: 'drain', solid: false, flat: true,
      lines: [IF(NOROOM, 'A scupper at the foot of the hull. Through it, the sea, very close.'), IF(NOROOM, 'Anything heavy pushed here goes overboard.'),
        IF(ROOM, 'The scupper. The sea has taken what was pushed through it, and does not give things back.')] };
  }
  MX('W091', {
    fakeWalls: [[20, 9]],
    place: [{ id: 'm4_bow', type: 'decor', at: [20, 8], look: 'crack', solid: false, flat: true,
        lines: ['The bow of the wreck, split open to the beach.', 'Between two ribs of the hull, there is a gap just wide enough for a child.',
          'From inside comes the smell of the hold: rope, wet wood, and many people who slept close together.'] },
      trunk('m4_trunk1', 12, 11, 'A trunk roped shut. A name was chalked on the lid, then rubbed out with a sleeve.'),
      trunk('m4_trunk2', 15, 13, 'A trunk with a brass lock and a family’s whole kitchen inside, by the sound of it.'),
      trunk('m4_trunk3', 17, 10, 'A trunk with a child’s drawing pasted inside the handle: a house with a red door.'),
      scupper('m4_scup1', 10), scupper('m4_scup2', 12), scupper('m4_scup3', 14),
      { id: 'm4_stowage', type: 'decor', at: [10, 16], look: 'chalkmark', solid: false, flat: true,
        lines: ['Chalked on the planks in a hurried hand, then walked over many times:', 'LUGGAGE TO THE SIDE. CHILDREN IN THE MIDDLE.'] },
      { id: 'm4_berths', type: 'decor', at: [14, 12], look: 'blanketlump', solid: false, cond: ROOM,
        lines: ['Three small blankets in a row in the middle of the hold, where the trunks were.', 'Children slept here on the crossing.',
          'One blanket is folded smaller than the others, as if its owner had been afraid of taking up too much room.'] },
      { id: 'm4_list', type: 'decor', at: [25, 9], look: 'poster', listenDist: 4,
        lines: [IF({ notFlag: 'm4_w091_name' }, 'A passenger list nailed to the bulkhead: a hundred names in neat pencil.'),
          IF({ notFlag: 'm4_w091_name' }, 'Near the bottom, a child’s line, smudged by the sea: “Ahn O—, 9”.'),
          IF({ notFlag: 'm4_w091_name' }, 'The captain knows every line by heart. He would finish this one, if somebody read it out to him.'),
          IF({ flag: 'm4_w091_name' }, 'The passenger list. Near the bottom, freshly gone over: “Ahn Ok-sun, 9. One shoe. Taken aboard.”')],
        listen: [{ match: ['ok sun', 'oksun', 'okseon', '옥순', '안옥순'], if: { notFlag: 'm4_w091_name' },
          do: [{ set: { m4_w091_name: true } }, { secret: 'm4_oksun_aboard' }, { reeval: true }],
          lines: ['You read the name out loud, the whole of it.', 'Behind you, the captain stops searching the chart table.',
            EN('Ahn Ok-sun. Nine years old. One shoe.'), EN('She came aboard last, with nothing at all. She asked me to wait for her brother. I could not wait.'),
            'On the list, the smudged line darkens, as if someone had gone over it again in fresh pencil.'] }] }],
    mech: [{ type: 'push', blocks: ['m4_trunk1', 'm4_trunk2', 'm4_trunk3'], plates: ['m4_scup1', 'm4_scup2', 'm4_scup3'], sfx: 'creak',
      done: ROOM, reward: [{ set: { m4_w091_room: true } }],
      winLines: ['The last trunk slides into the scupper. The sea takes it with a small, polite sound.', 'The boat sits a little higher in the water.',
        'In the middle of the hold, where the luggage was, there is room now: three small blankets, laid out in a row.'] }],
    rules: ['Push the three trunks of the hold onto the three scuppers along the west side of the hull (walk into a trunk to push it). The luggage goes overboard and three children’s blankets appear in the middle of the hold.',
      'Secret: the dead end of the north beach is the split bow of the ship; walk on into the hull there, through a gap between the ribs, to reach the holds from the beach.',
      'Secret: near the passenger list in the right-hand hold, say the grandmother’s name (“Ok-sun”, 옥순): the captain finishes the smudged line, and the list is gone over in fresh pencil.'] });

  /* ---------------------------------------------------------------
   *  W092 — The Weather Station
   *  Secret: tell the forecast board the truth (listen) -> the real log.
   * --------------------------------------------------------------- */
  var W092DO = [{ set: { m4_w092_truth: true } }, { secret: 'm4_true_forecast' }, { reeval: true }];
  var W092LINES = ['You say it out loud, to the board: it is raining.', 'The whole station holds its breath. Somewhere a dial clicks back to where it was.',
    'Then the chalk on the board rubs itself out, and writes again in a smaller, braver hand: RAIN.', 'Under the board, a drawer that was not there before slides open.'];
  MX('W092', {
    place: [{ id: 'm4_board', type: 'decor', at: [22, 8], look: 'board', lookOpt: { lines: ['TOMORROW', 'FINE'], color: '#e8e8e0' },
        lookIf: [{ cond: { flag: 'm4_w092_truth' }, lookOpt: { lines: ['TOMORROW', 'RAIN'], color: '#a0c8f0' } }],
        lines: [IF({ notFlag: 'm4_w092_truth' }, 'The forecast board, chalked for tomorrow: FINE.'),
          IF({ notFlag: 'm4_w092_truth' }, 'Under it, smaller, the station rule: STAFF MUST NOT SAY WHAT THE WEATHER IS DOING.'),
          IF({ notFlag: 'm4_w092_truth' }, 'Rain is running down the inside of the window behind the board. The board has never once said so.'),
          IF({ flag: 'm4_w092_truth' }, 'The forecast board: RAIN. Someone has underlined it twice, the way you underline a word you are proud of.')],
        listen: [{ match: ['raining', 'it is rain', 'it s rain', 'rains', '비가 와', '비가 온다', '비 와', '비가 내려', '비 온다'], if: { notFlag: 'm4_w092_truth' }, do: W092DO, lines: W092LINES },
          { match: ['rain', '비', 'rain rain'], exact: true, if: { notFlag: 'm4_w092_truth' }, do: W092DO, lines: W092LINES }] },
      { id: 'm4_truelog', type: 'decor', at: [22, 9], look: 'book', cond: { flag: 'm4_w092_truth' },
        lines: ['The real logbook, from the drawer. Every day, the same two columns:', '“Observed: rain, indoors.” “Reported: fine.”',
          'Today’s line is different. “Observed: rain.” “Reported: rain.” It is the first time the two columns agree.'] }],
    rules: ['Secret: standing near the forecast board on the east wall, say the truth out loud (“it’s raining”, 비가 와). The board writes RAIN instead of FINE and a drawer opens with the station’s real logbook.'] });

  /* ---------------------------------------------------------------
   *  W093 — The Statue Garden (vast: re-drawn every visit)
   *  Puzzle: reach the father's statue without looking at it (recede);
   *  the Compass points at him. Secret: a plinth that only appears to
   *  someone wearing the Statue (E79).
   * --------------------------------------------------------------- */
  M('W093', {
    set: { compass: 'm4_father' },
    place: [{ id: 'm4_father', type: 'decor', at: 'random-any', look: 'statue', lookOpt: { c: ['#a8a8b0'] }, solid: true, cond: { notFlag: 'm4_w093_father' },
        lines: ['A statue walking away, a suitcase in its hand. Each time you look at him, he is a little further off.'] },
      { id: 'm4_fplinth', type: 'decor', at: 'random-any', look: 'pedestal',
        lines: ['An empty plinth. Its plaque says: “The father, who left.”', 'Stone footprints lead away from it, towards the trees.',
          'Scratched under the plaque, in a child’s hand: don’t look at the ones who are leaving. Walk beside them.',
          'Every statue in this garden has a plinth. One plinth only shows itself to someone who is already stone.'] },
      { id: 'm4_plinth', type: 'decor', at: 'random-hidden', look: 'pedestal', cond: { equipped: 'E79' }, use: [{ secret: 'm4_girl_who_stayed' }],
        lines: ['An empty plinth you have never seen before. On its plaque, freshly cut: “The girl, who stayed.”',
          'It is exactly your size. The stone is warm, as if somebody had only just stepped down from it.'] }],
    mech: [{ type: 'recede', mark: 'm4_father', dist: 7, done: { flag: 'm4_w093_father' },
      reward: [{ set: { m4_w093_father: true } }, { collect: 'photos' }, { secret: 'm4_father_reached' }],
      winLines: ['You come up beside him without looking at him, the way you used to walk next to him: eyes on the pavement.',
        'Up close, there is no statue at all: only a photograph, lying face down where he stood.', 'You pick it up. You do not turn it over yet.'] }],
    rules: ['The statue of “the father, who left” has walked off its plinth and backs away whenever you look at him. Reach him from the side, or catch him against a hedge, without facing him: he leaves a photograph. The Compass points to him.',
      'Secret: with the Statue (E79) equipped, an empty plinth appears in a hidden corner of the garden: “The girl, who stayed.”'] });

  /* ---------------------------------------------------------------
   *  W094 — The Street of Children Alone
   *  Puzzle: find the boy still hiding, without running (catchN, noRun).
   *  Secret: in the last minutes of the dream, a mother is home (phase).
   * --------------------------------------------------------------- */
  M('W094', {
    npcs: [{ id: 'N2170', name: 'A Boy Still Hiding', tag: 'm4_seek', look: H({ t: 'kid', hairStyle: 'short', body: 'shirt', c: ['#c89040', '#a07020', '#f0c8a0', '#1a1a1a'], acc: 'keys', h: 16 }),
      behavior: 'flee', fleeDist: 4, radius: 6, speed: 1.3, solid: false, at: 'random-hidden', goneIf: { flag: 'm4_w094_found' },
      lines: [EN('Shh! I’m hiding. Don’t run, they’ll hear you.'), EN('It’s hide-and-seek. Nobody’s it. Nobody’s ever it.'),
        EN('When it gets light, the doors open from outside, one by one. Then the game’s over and everybody has to go in.')] }],
    place: [{ id: 'm4_chalk', type: 'decor', at: 'random-any', look: 'hopscotch', solid: false, flat: true,
        lines: ['Chalk on the pavement, the rules of a game, in capitals: HIDE-AND-SEEK. RULE 1: NOBODY IS IT.', 'RULE 2: NO RUNNING, OR YOU’RE OUT.',
          'RULE 3, smaller, added later: THE LAST ONE FOUND GETS TO GO HOME FIRST.'] },
      { id: 'm4_shoes', type: 'decor', at: 'random-hidden', look: 'shoe', solid: false, cond: { phase: 'final' }, use: [{ secret: 'm4_door_from_outside' }],
        lines: ['The first door on the street has opened from the outside.', 'On its step, a grown-up’s shoes, side by side, wet with morning.',
          'Inside, very low, a woman’s voice is waking a child who is pretending to be asleep.'] }],
    mech: [{ type: 'catchN', tag: 'm4_seek', key: 'm4_seek', n: 1, noRun: true, runLine: 'You were running. He heard you, and he’s off again.',
      done: { flag: 'm4_w094_found' }, reward: [{ set: { m4_w094_found: true } }, { secret: 'm4_found_you' }],
      winLines: ['You walk up to him, slowly, and put your hand on his shoulder.', EN('…Found me?'), EN('Nobody ever finds me. They go in when it gets dark and I’m still hiding.'),
        'He takes the key from round his neck and looks at it, then at you.', EN('Last one found goes home first. That’s the rule. I made it.'), 'He runs off towards a door. This time he goes in.'] }],
    rules: ['A boy is still hiding somewhere in the streets. Catch him by touching him, walking: if you run, he hears you and flees again. Found, he goes home.',
      'Secret: in the last minutes of the dream, a doorstep appears in a corner of the street with a grown-up’s shoes on it: the doors open from outside at dawn.'] });

  /* ---------------------------------------------------------------
   *  W095 — The House Where the TV Is On
   *  Puzzle: the house answers in the television's voice; say it back
   *  (echo). Secret: pencil words on the wallpaper, only with glasses.
   * --------------------------------------------------------------- */
  MX('W095', {
    place: [{ id: 'm4_poster', type: 'decor', at: [1, 4], look: 'poster',
        lines: ['A poster for a children’s programme, curling at the corners: SAY IT BACK!', 'A cartoon microphone with an enormous mouth.',
          'Under it, in felt-tip, a child’s rule: the house always answers. Say it back to it.'] },
      { id: 'm4_drawing', type: 'decor', at: [28, 10], look: 'drawing', cond: { flag: 'm4_w095_back' },
        lines: ['A drawing taped to the wall that wasn’t there before.', 'A boy and a grown-up on a sofa, laughing at the same time.',
          'Underneath, in big careful letters: “WHEN YOU COME HOME”.'] },
      { id: 'm4_pencil', type: 'decor', at: [14, 9], look: 'drawing', solid: false, cond: { equipped: REVEAL }, use: [{ secret: 'm4_come_home' }],
        lines: ['On the wallpaper by the doorway, at child height, in pencil: HA HA HA, a hundred times over, rubbed out.',
          'Under the rubbing, pressed so hard it went through to the plaster, just once: come home.'] },
      { id: 'm4_crumbs', type: 'decor', at: [14, 11], look: 'crumbs', solid: false, flat: true,
        lines: ['Eraser crumbs on the floor by the doorway, as if someone had rubbed out a whole wall.', 'Glasses would find what was there.'] }],
    mech: [{ type: 'echo', zone: [1, 1, 28, 18], words: ['stay tuned', 'right back', 'ha ha ha', 'again', 'louder', 'applause', 'big laugh', 'goodnight'],
      done: { flag: 'm4_w095_back' }, reward: [{ set: { m4_w095_back: true } }],
      winLines: ['You say it back, in your own voice. The laugh track stops dead.', 'In the living room, the boy laughs: not after the television, for once. Before it.',
        'Then he turns round, and looks at you, and doesn’t laugh at all.', 'On the far wall, a drawing you hadn’t seen.'] }],
    rules: ['Say anything in the house: it answers in the television’s voice with another word. Say that word back: the laugh track stops, the boy turns round, and a drawing appears on the east wall of the second room.',
      'Secret: with a revealing effect equipped (Glasses and the like), pencil words appear on the wallpaper beside the doorway between the two rooms.'] });

  /* ---------------------------------------------------------------
   *  W096 — Cubicle 3
   *  Puzzle: answer the knocks from the next cubicle in the same order
   *  (sequence with ring) -> a crane. Secret: rub out the graffiti.
   * --------------------------------------------------------------- */
  var ERASED = { flag: 'm4_w096_erased' };
  MX('W096', {
    place: [{ id: 'm4_partL', type: 'decor', at: [1, 4], look: 'crack', solid: false, lines: ['A crack in the left partition, at knuckle height.', 'Sometimes it taps from the other side, in a pattern, and waits.'] },
      { id: 'm4_partR', type: 'decor', at: [10, 6], look: 'crack', solid: false, lines: ['A crack in the right partition. The metal is warm, as if someone were leaning on the other side.'] },
      { id: 'm4_pipe', type: 'decor', at: [5, 8], look: 'vent', lines: ['The pipe that runs behind every cubicle in the row. Tap it and the whole row hears.'] },
      { id: 'm4_graffiti', type: 'decor', at: [1, 7], look: 'drawing', solid: false, cond: { notFlag: 'm4_w096_erased' },
        lines: ['On the partition, in thick black marker: THE MUTE ONE SITS HERE.', 'Older writing shows through underneath, too faint to read.',
          'Marker comes off with patience, and something to rub with.'],
        onEffect: onAll(ERASE, [{ set: { m4_w096_erased: true } }, { sfx: 'erase' }, { lines: ['You rub at the marker. It comes away more easily than it went on.'] }, { reeval: true }]) },
      { id: 'm4_under', type: 'decor', keepPlace: true, at: [1, 7], look: 'drawing', solid: false, cond: ERASED, use: [{ secret: 'm4_keeping_it' }],
        lines: ['Under the marker, in small careful pencil, older than you:', '“S. was here. So was O. Neither of us was mute. We were keeping it for someone who would listen.”'] }],
    mech: [{ type: 'sequence', order: ['m4_partL', 'm4_partR', 'm4_partL', 'm4_pipe'], okSfx: 'chime',
      ring: { every: 1.4, pause: 5, hear: 12, sfx: 'door_far', glyph: '•' },
      okLines: ['Tap. On the other side, a breath held, then let go.', 'Tap. Someone shifts on a seat, listening.', 'Tap. A tiny laugh, the kind you swallow.'],
      wrongLine: 'Your knock comes back wrong. The other side goes quiet, then starts again from the beginning, patiently.',
      doneLine: 'The partitions are quiet now. On the other side, someone is folding paper.',
      done: { flag: 'm4_w096_knock' }, reward: [{ set: { m4_w096_knock: true } }, { collect: 'cranes' }],
      winLines: ['Tap, on the pipe that runs through every cubicle.', 'For a long moment, nothing.',
        'Then, under the partition, a paper crane slides across the tiles to your shoe.', 'On one wing, in pencil, very small: “me too”.'] }],
    rules: ['Someone in the next cubicle knocks in a pattern: left partition, right partition, left partition, then the pipe at the back. Knock back in the same order (use each spot): a paper crane slides under the partition.',
      'Secret: rub out the graffiti on the left partition with an eraser (Eraser, Scented Eraser, Rubber Gloves or Correction Fluid equipped, facing it): older pencil writing is underneath.'] });

  /* ---------------------------------------------------------------
   *  W097 — The Rope Gym (side view)
   *  Puzzle: match the PE bibs in pairs (pairs) -> a team sheet with her
   *  name first. Secret: pencil marks at the top of rope one (reveal).
   * --------------------------------------------------------------- */
  var BIBX = [4, 8, 15, 18, 22, 29];
  MX('W097', {
    place: BIBX.map(function (x, i) {
      return { id: 'm4_bib' + (i + 1), type: 'decor', keepPlace: true, at: [x, 30], look: 'towel', lookOpt: { c: ['#b8b8b0'] }, solid: false, flat: true,
        lines: ['A PE bib, grey with washing, dropped where a team was picked without it.', 'A sign is sewn inside the collar: every bib has a twin.'] };
    }).concat([
      { id: 'm4_teamsheet', type: 'decor', keepPlace: true, at: [31, 30], look: 'clipboard', solid: false, cond: { flag: 'm4_w097_teams' },
        lines: ['A team sheet clipped to the wall bars. Your name is on it, first, in a child’s handwriting.',
          'At the bottom, in pencil: the top of rope one, for anyone with good eyes.'] },
      { id: 'm4_ropetop', type: 'decor', at: [6, 8], floor: 's', look: 'scraps', solid: false, hiddenUntilReveal: true, use: [{ secret: 'm4_all_the_way' }],
        lines: ['Pencil marks on the wall beside the hook, higher than anyone was meant to reach: initials, and heights.',
          'The highest, very faint: “S. — all the way.” You don’t remember climbing this far. Not yet.'] }]),
    mech: [{ type: 'pairs', tiles: BIBX.map(function (x, i) { return 'm4_bib' + (i + 1); }),
      wrongLine: 'Two different signs. The bibs flop back onto the floor, unchosen.', doneLine: 'Every bib has its partner. Nobody is left over.',
      done: { flag: 'm4_w097_teams' }, reward: [{ set: { m4_w097_teams: true } }],
      winLines: ['The last two bibs match. Two teams, and nobody left over.', 'Clipped to the wall bars at the far end, a team sheet you had not noticed. Your name is on it.'] }],
    rules: ['Six grey PE bibs lie on the gym floor; each shows a sign when touched. Find the three pairs: a team sheet appears by the changing-room door, with her name written first.',
      'Secret: at the very top of the first rope, beside the hook, pencil marks visible with a revealing effect (Glasses…), readable by touch: “S. — all the way.”'] });

  /* ---------------------------------------------------------------
   *  W098 — The Rough Book
   *  Secrets: the three crossed-out words, said out loud (listen); a
   *  dog-eared corner at the bottom of the page.
   * --------------------------------------------------------------- */
  var SAID = { flag: 'm4_w098_said' }, UNSAID = { notFlag: 'm4_w098_said' };
  MX('W098', {
    place: [{ id: 'm4_crossed', type: 'decor', at: [2, 24], look: 'scraps', solid: false, flat: true, listenDist: 4,
        lines: [IF(UNSAID, 'In the margin, three words scribbled out so hard the paper has gone shiny.'),
          IF(UNSAID, 'You can still make out an I at the start, and a U at the end.'),
          IF(UNSAID, 'Whoever wrote it never said it out loud either.'),
          IF(SAID, 'In the margin: “I miss you. — S.” And beside it, very small, in blue marker: N.')],
        listen: [{ match: ['miss you', '보고 싶어', '보고싶어', '보고 싶다', '보고싶다'], if: UNSAID,
          do: [{ set: { m4_w098_said: true } }, { secret: 'm4_three_words' }, { reeval: true }],
          lines: ['You say it out loud, to the margin: I miss you.', 'The crossings-out lift off the paper one by one, like flies, and the sentence is there again.',
            'Next to it, in blue marker that wasn’t there a moment ago, someone has answered with a single letter: N.'] },
          { match: ['love you', 'hate you', 'need you', 'thank you', '사랑해'], if: UNSAID,
            lines: ['The crossings-out shiver, but stay. Not that one. Something smaller, and harder to say.'] }] },
      { id: 'm4_dogear', type: 'decor', at: [39, 27], look: 'letter', solid: false, flat: true,
        lines: ['The corner of the page is folded down, small and tight, the way you mark a page to come back to.',
          { t: 'You unfold it. In the fold, tiny handwriting that isn’t yours:', do: [{ secret: 'm4_dogear' }] },
          '“S — we moved to a town by the sea. Mum says I can write. I don’t know your address. — N.”'] }],
    rules: ['Secret: in the margin, near the bottom, a three-word sentence has been crossed out (I… U). Say it out loud there (“I miss you”, 보고 싶어): the crossings-out lift and N answers.',
      'Secret: the very bottom-right corner of the page is dog-eared; unfold it for a note from N.'] });

  /* ---------------------------------------------------------------
   *  W099 — The Schoolyard in the Snow
   *  Secret: with the Footprints (E82), a grown-up's tracks appear.
   * --------------------------------------------------------------- */
  M('W099', {
    place: [{ id: 'm4_frost', type: 'decor', at: 'random-any', look: 'fence', lookOpt: { c: ['#c8d0d8'] },
        lines: ['A railing furred with frost. A child’s finger has written in it:', '“Some footprints only show to someone who leaves footprints too.”'] },
      { id: 'm4_bigprints', type: 'decor', at: 'random-hidden', look: 'scuff', solid: false, flat: true, cond: { equipped: 'E82' }, use: [{ secret: 'm4_carried_home' }],
        lines: ['Grown-up footprints, in shoes not made for snow.', 'They come from the gate at a run and stop here, beside small ones.',
          'After that there is only one set going home, deeper than before. Somebody carried somebody.'] }],
    rules: ['Secret: with the Footprints (E82) equipped, a grown-up’s tracks appear in a sheltered corner of the yard, beside a child’s.'] });

  /* ---------------------------------------------------------------
   *  W100 — The Cave of Fruit Stones (vast)
   *  Puzzle: water the 2021 plum stone slowly (standStill with the
   *  watering can) -> it sprouts. The Compass points at it.
   * --------------------------------------------------------------- */
  var SPROUT = { flag: 'm4_w100_sprout' }, NOSPROUT = { notFlag: 'm4_w100_sprout' };
  M('W100', {
    set: { compass: 'm4_plum' },
    place: [{ id: 'm4_plum', type: 'decor', at: 'random-hidden', look: 'pebbles', solid: false, flat: true,
      lookIf: [{ cond: SPROUT, look: 'sprout' }],
      lines: [IF(NOSPROUT, 'A plum stone half buried in the floor of the cave. Scratched on it, in a child’s careful hand: 2021.'),
        IF(NOSPROUT, 'The earth around it is dry and cracked, as if someone used to water it and stopped.'),
        IF(NOSPROUT, 'Not a splash: it would want a long, patient pour.'),
        IF(SPROUT, 'A plum seedling, two leaves, in the dark of the cave. It leans towards wherever you are standing.')] }],
    mech: [{ type: 'standStill', mark: 'm4_plum', secs: 16, cond: { equipped: CAN }, breakLine: 'The water runs off. Slowly, and for longer.',
      done: SPROUT, reward: [{ set: { m4_w100_sprout: true } }, { secret: 'm4_plum_2021' }],
      winLines: ['You stand over the stone and let the water pour, slowly, the way she showed you: not too much, not too fast.',
        'The earth darkens. Something pushes up through it: two leaves, small and stubborn.', KS('봐, 나중이 왔잖아.', 'See? Later came after all.')] }],
    rules: ['Somewhere in the cave lies a plum stone marked 2021 (the Compass points to it). Stand on it with the Watering Can (or another watering effect) equipped and keep still for about fifteen seconds: it sprouts.'] });

  /* ---------------------------------------------------------------
   *  W102 — The Throat of the Whale
   *  Puzzle: say the swallowed words to the lump (sayTo on a mark).
   *  Secret: open the suitcase J. with a handle (onEffect).
   * --------------------------------------------------------------- */
  var CASEOPEN = { flag: 'm4_w102_case' };
  M('W102', {
    place: [{ id: 'm4_lump', type: 'decor', at: 'random-hidden', look: 'rock', lookOpt: { c: ['#a04858'] },
        lookIf: [{ cond: { flag: 'm4_w102_said' }, look: 'glint' }],
        lines: [IF({ notFlag: 'm4_w102_said' }, 'A lump in the whale’s throat, about the size of two words.'),
          IF({ notFlag: 'm4_w102_said' }, 'It is made of everything somebody swallowed instead of saying.'),
          IF({ notFlag: 'm4_w102_said' }, 'Pressed into it a thousand times, worn smooth: “it’s fine”. Said the other way round, it might come unstuck.'),
          IF({ flag: 'm4_w102_said' }, 'Where the lump was, the throat is open.'),
          IF({ flag: 'm4_w102_said' }, 'Air comes down it from far above, smelling of rain and of a flat at night.')] },
      { id: 'm4_note', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true,
        lines: ['A note, swallowed and half digested, in a child’s handwriting:', '“If you swallow it, it gets stuck. If you say it, it comes out.”'] },
      { id: 'm4_case', type: 'decor', at: 'random-hidden', look: 'suitcase', solid: true,
        lines: [IF({ notFlag: 'm4_w102_case' }, 'A suitcase, swallowed whole and still shut. A letter J was painted on it once.'),
          IF({ notFlag: 'm4_w102_case' }, 'The clasp has no keyhole, only a socket where a handle should go.'),
          IF(CASEOPEN, 'The swallowed suitcase stands open.'),
          IF(CASEOPEN, 'A man’s shirt folded small, a joke book with the last page torn out, a ticket with no destination.')],
        onEffect: onAll(HANDLE, [{ if: CASEOPEN, lines: ['The suitcase is already open. Nothing else is coming out of it.'],
          'else': [{ set: { m4_w102_case: true } }, { sfx: 'door' }, { secret: 'm4_suitcase_j' }, { reeval: true },
            { lines: ['You fit the handle into the socket. It turns as if it had been waiting forty years for exactly this.',
              'Inside: a man’s shirt folded small, and a book of knock-knock jokes with the last page torn out.', 'And a ticket with no destination.'] }] }]) }],
    mech: [{ type: 'sayTo', mark: 'm4_lump', dist: 3, words: ['not fine', 'not okay', 'not ok', 'not all right', 'not alright', '안 괜찮아', '괜찮지 않아', '안괜찮아', '괜찮지않아'],
      done: { flag: 'm4_w102_said' }, doneLine: 'The throat is open. You can breathe here now.',
      reward: [{ set: { m4_w102_said: true } }, { secret: 'm4_not_fine' }],
      winLines: ['You say it out loud, into the dark of the throat: you’re not fine.', 'The whole whale shudders. The lump comes loose and rolls away down into the dark, light as a pebble.',
        'Far above, the whale surfaces and breathes.', 'For a moment there is night air, and rain, and a woman’s voice, very tired:', KS('…엄마도 안 괜찮아.', '…Mum’s not fine either.')] }],
    rules: ['A lump sits in a corner of the throat, made of swallowed “it’s fine”. Standing next to it, say the opposite (“I’m not fine”, 안 괜찮아): the whale breathes and the throat opens.',
      'Secret: a shut suitcase marked J. lies in another corner. Face it with the Handle (E86) or the Doorless Handle (E163) equipped and use it: it opens.'] });

  /* ---------------------------------------------------------------
   *  W103 — The Museum of Forbidden Feelings
   *  Secret: the "Joy" case shows its exhibit only during permitted
   *  viewing (9:00–9:05, real time) or after someone laughs out loud.
   * --------------------------------------------------------------- */
  var JOY = { any: [{ flag: 'm4_w103_laughed' }, { realTime: ['09:00', '09:05'] }, { realTime: ['21:00', '21:05'] }] };
  MX('W103', {
    place: [{ id: 'm4_joy', type: 'decor', at: [38, 24], look: 'vitrine', solid: true, cond: { not: JOY },
        lines: ['The last display case, in the corner nobody is sent to. Its label: “Joy (date unknown)”. The case is empty.',
          'A smaller card: “Permitted viewing: Room 1, 9:00 to 9:05. Visitors must not laugh in the galleries.”'],
        onEffect: onAll(CLAP, [{ set: { m4_w103_laughed: true } }, { sfx: 'laugh' },
          { lines: ['You laugh out loud in the middle of the museum. It comes out rusty, then real.', 'Every case in the gallery rattles. The guard turns round, too late.'] }, { reeval: true }]) },
      { id: 'm4_joyshown', type: 'decor', keepPlace: true, at: [38, 24], look: 'vitrine', solid: true, light: 1.2, cond: JOY, use: [{ secret: 'm4_joy_on_display' }],
        lines: ['In the “Joy” case, for now, there is something.', 'A child’s laugh, caught in the glass like a bubble, turning slowly.',
          'It is the only exhibit in the museum that is still moving.'] }],
    rules: ['Secret: the “Joy” case in the south-east corner is empty, except during permitted viewing (9:00–9:05, morning or evening, real time), or after you laugh at it out loud (Laughter or Tambourine equipped, facing it): a child’s laugh appears inside.'] });

  /* ---------------------------------------------------------------
   *  W105 — The Maze Sewers
   *  Secret: scare the rats from their larder with the Cat (onEffect).
   * --------------------------------------------------------------- */
  M('W105', {
    place: [{ id: 'm4_larder', type: 'decor', at: 'random-hidden', look: 'scraps', solid: false, cond: { notFlag: 'm4_w105_map' },
      lines: ['A rats’ larder in a bend of the tunnel: chewed maps, stacked by size.', 'On top, guarded, a map folded into a little star, like a compass rose.',
        'The rats watch you from the dark. They are not afraid of girls. They are afraid of something else entirely.'],
      onEffect: { E19: [{ set: { m4_w105_map: true } }, { sfx: 'meow' }, { secret: 'm4_starmap' }, { reeval: true },
        { lines: ['You meow. Every rat in the tunnel freezes, then runs, taking the larder with it.', 'Only the star-folded map is left behind. You unfold it.',
          'It is a map of a flat, drawn by a child: bedroom, hallway, kitchen.', 'On the kitchen, an X: “Mum sleeps here (sitting up).”'] }] } }],
    rules: ['Secret: in a bend of the sewers, the rats keep a larder of chewed maps. Face it with the Cat (E19) equipped and use it: the rats flee and leave behind a child’s map of the flat.'] });

  /* ---------------------------------------------------------------
   *  W106 — The Room of 1000 Doors
   *  Secret: the door with light under it: knock twice (knock), then
   *  give his line of the joke (listen).
   * --------------------------------------------------------------- */
  var KNOCKED = { flag: 'm4_w106_knock' };
  MX('W106', {
    place: [{ id: 'm4_lightdoor', type: 'decor', at: [8, 13], look: 'door', lookOpt: { style: 'wood', c: ['#8a7a5a'] }, light: 0.9, solid: true, listenDist: 3,
      lines: [IF({ notFlag: 'm4_w106_who' }, 'A plain door that does not change when you look at it.'),
        IF({ notFlag: 'm4_w106_who' }, 'A line of light shows underneath, as if a lamp were on inside.'),
        IF({ notFlag: 'm4_w106_knock' }, 'Two small dents in the wood at knuckle height, worn by the same two knocks, over and over.'),
        IF({ flag: 'm4_w106_who' }, 'The door is open a crack. Behind it, a small bedroom with the light on, and someone asleep in it, smiling.')],
      listen: [{ match: ['daddy', 'dad', 'papa', '아빠', 'father'], if: { flag: 'm4_w106_knock', notFlag: 'm4_w106_who' },
        do: [{ set: { m4_w106_who: true } }, { secret: 'm4_knock_knock' }, { reeval: true }],
        lines: [EN('Daddy who?'), 'You know how it ends. You don’t say it. It was never really the end of the joke.',
          'Behind the door, the small voice waits, then laughs anyway, the way she always laughed before the end.', 'The door opens a crack. The light was on the whole time.'] }] }],
    mech: [{ type: 'knock', mark: 'm4_lightdoor', n: 2, within: 2, sfx: 'door_far', done: KNOCKED, doneLine: 'Behind the door, someone is waiting for the next line.',
      reward: [{ set: { m4_w106_knock: true } }],
      winLines: ['Knock, knock.', 'Behind the door, a small voice, sleepy, the way you used to answer him at bedtime:', EN('Who’s there?'),
        'It is his joke. You know your line in it, and you know his.'] }],
    rules: ['Secret: one door in the room does not change and has light under it. Knock on it twice quickly: a child’s voice asks “Who’s there?”. Answer with his line (“Daddy”, 아빠): the door opens a crack on a lit bedroom.'] });

  /* ---------------------------------------------------------------
   *  W108 — The Room of Voices
   *  Secret: play the lullaby to the grandmother's jar (melodyLock).
   * --------------------------------------------------------------- */
  var FREE = { flag: 'm4_w108_free' };
  MX('W108', {
    place: [{ id: 'm4_lulljar', type: 'decor', at: [24, 11], look: 'jar', solid: true,
      lines: [IF({ notFlag: 'm4_w108_free' }, 'A jar on a shelf of its own, labelled in a careful hand: Grandmother.'),
        IF({ notFlag: 'm4_w108_free' }, 'Inside, a lullaby goes round and round, never quite to the end.'),
        IF({ notFlag: 'm4_w108_free' }, 'It sounds like it is waiting for someone to play along.'),
        IF(FREE, 'An empty jar, its lid on the floor. It smells faintly of soap and of wet earth.')] }],
    mech: [{ type: 'melodyLock', mark: 'm4_lulljar', tune: YN.data.lullaby, dist: 4, done: FREE,
      reward: [{ set: { m4_w108_free: true } }, { secret: 'm4_lullaby_free' }],
      winLines: ['You play the lullaby, all of it.', 'Inside the jar, very small, the song answers you, a little ahead, like someone humming along.',
        KS('자장자장, 잘도 잔다.', 'Hush, hush, how well you sleep.'), 'The lid works itself loose. The song goes up out of the jar and does not come back.',
        'The Voice Collector watches it go. He does not try to stop it.'] }],
    rules: ['Secret: one jar on the east wall holds the grandmother’s lullaby. Play the lullaby next to it (Melody): the song is set free.'] });

  /* ---------------------------------------------------------------
   *  W111 — The Puppet Theatre
   *  Secret: say "no" at the prompter's box (listen).
   * --------------------------------------------------------------- */
  var NO = { flag: 'm4_w111_no' }, NONO = { notFlag: 'm4_w111_no' };
  var NODO = [{ set: { m4_w111_no: true } }, { secret: 'm4_she_said_no' }, { reeval: true }];
  var NOLINES = ['You say it out loud, up towards the flies above the stage: no.', 'The voice from above stops in the middle of a word.',
    'On the stage, one by one, the puppets let their arms come down. Nobody lifts them again.'];
  MX('W111', {
    place: [{ id: 'm4_prompt', type: 'decor', at: [17, 7], look: 'hatch', solid: false, flat: true, listenDist: 4,
      lines: [IF(NONO, 'The prompter’s box at the front of the stage. The script inside is open at the only line it has: ALL IS WELL.'),
        IF(NONO, 'Under it, the stage direction, underlined: (She smiles. She never says no.)'),
        IF(NO, 'The prompter’s box. Someone has written in the margin of the script, very small, next to ALL IS WELL: or not.')],
      listen: [{ match: ['no', 'nope', 'no no', 'no no no', 'stop', '싫어', '아니', '아니요', '안 해', '그만'], exact: true, if: NONO, do: NODO, lines: NOLINES },
        { match: ['i won t', 'i will not', 'i don t want to', 'no more', 'i said no', '싫어요', '안 할래', '하기 싫어', '그만해'], if: NONO, do: NODO, lines: NOLINES }] }],
    rules: ['Secret: at the prompter’s box at the front of the stage, refuse out loud (“no”, “I won’t”, 싫어): the puppeteer’s voice stops and the puppets put their arms down.'] });

  /* ---------------------------------------------------------------
   *  W112 — Backstage
   *  Puzzle: walk the spike-tape marks in order (stepOrder): the puppet
   *  without strings follows on its own. Secret: when the light at home
   *  is off, the bulbs of the last mirror come on.
   * --------------------------------------------------------------- */
  var TAPE = [[3, 10], [7, 8], [11, 11], [14, 8], [18, 10]], TP = {};
  TAPE.forEach(function (p, i) { TP[p[0] + ',' + p[1]] = i; });
  MX('W112', {
    place: TAPE.map(function (p, i) {
      return { id: 'm4_tape' + (i + 1), type: 'decor', at: p, look: 'chalkmark', solid: false, flat: true,
        lines: [i === 0 ? 'A cross of spike tape on the floor, numbered 1. Under the number, the name of the scene: “Walking Alone”.' : 'A cross of spike tape on the floor, numbered ' + (i + 1) + '. Worn, as if someone had practised here a thousand times.'] };
    }).concat([
      { id: 'm4_switches', type: 'decor', at: [1, 9], look: 'switch',
        lines: ['A switchboard for the dressing-room lights. One switch is labelled, in old tape, HOME.', 'Its wire goes a very long way.'] },
      { id: 'm4_bulbs', type: 'decor', at: [20, 6], look: 'mirror', light: 1.4, cond: { roomLight: false }, use: [{ secret: 'm4_take_it_off' }],
        lines: ['The last mirror. Its bulbs are lit tonight, all of them: they only come on when the light at home is off.',
          'On the glass, written in lipstick and wiped, still legible in the glare: “you can take it off now.”'] }]),
    mech: [{ type: 'stepOrder', plates: TP, count: TAPE.length, color: 'rgba(255,240,200,0.9)', done: { flag: 'm4_w112_walk' },
      reward: [{ set: { m4_w112_walk: true } }, { secret: 'm4_walking_alone' }],
      winLines: ['Five marks, in order. Behind you, wooden feet: one, two, three, four, five.', 'The Puppet Without Strings has walked the whole scene by itself, in your footsteps.',
        'It bows, to nobody. Then, carefully, to you.'] }],
    rules: ['Five crosses of spike tape on the floor are numbered 1 to 5 (the scene “Walking Alone”). Step on them in order: the Puppet Without Strings walks the scene on its own.',
      'Secret: when the bedroom light at home is switched off, the bulbs of a mirror on the east wall are lit, and a message shows on the glass.'] });

  /* ---------------------------------------------------------------
   *  W113 — The Lit Kitchen
   *  Puzzle: send the message she never sent (cycleFrames on her phone).
   *  Secret: between seven and nine in the morning (real time), the
   *  second bowl has been used.
   * --------------------------------------------------------------- */
  MX('W113', {
    place: [{ id: 'm4_phone', type: 'decor', at: [11, 7], look: 'phone', light: 0.5,
        lines: [IF({ flag: 'm4_w113_sent' }, 'Her phone, under her hand. The screen says: Sent.')] },
      { id: 'm4_clock', type: 'decor', at: [17, 1], look: 'wallclock',
        lines: ['The kitchen clock. Someone has drawn a little moon beside the 9 and a little sun beside the 7.', 'Between the sun and the moon, someone small has written: breakfast?'] },
      { id: 'm4_shoes', type: 'decor', at: [10, 8], look: 'shoe', solid: false, cond: { realHour: [7, 9] }, use: [{ secret: 'm4_two_bowls' }],
        lines: ['Under the table, a pair of small school shoes, still warm.', 'Above them, the second bowl has been used: a few grains of rice, a spoon set down crooked.',
          'For once, someone ate breakfast with her, between seven and nine.'] }],
    mech: [{ type: 'cycleFrames', mark: 'm4_phone', every: 3.2, good: 3, done: { flag: 'm4_w113_sent' }, doneLine: 'Her phone, under her hand. The screen says: Sent.',
      frames: ['Her phone, under her hand. The screen wakes: 06:58. Alarm, 07:00: home.', 'A message from the hospital: “Tonight 21:00–07:00 again. Thank you for your hard work.”',
        'The lock screen: a girl asleep with the light on, photographed from the doorway.',
        'Typed, never sent, to “my daughter”: “Sorry. I’ll come home early today.” The cursor blinks by SEND.',
        'The screen dims, then goes dark.'],
      reward: [{ set: { m4_w113_sent: true } }, { collect: 'pages' }, { secret: 'm4_message_sent' }],
      winLines: ['You press SEND for her.', 'Far away, a phone lights up on a bedside table, beside a girl asleep with the light on.',
        'The woman at the table doesn’t wake.', 'But her hand loosens on the phone, as if something heavy had been put down.',
        'Under her elbow, a page torn from a notebook has come loose. You keep it.'] }],
    rules: ['Her phone, by her hand on the table, cycles through screens. Use it while it shows the unsent message (“Sorry. I’ll come home early today.”): the message is sent and a diary page comes loose.',
      'Secret: between 7 and 9 in the morning (real time), small school shoes are under the table and the second bowl has been used.'] });

  /* ---------------------------------------------------------------
   *  W114 — The Toy Graveyard
   *  Puzzle: light the three candles of the newest grave at once
   *  (lampsAll). Secret: a postcard from N., once Nour's Town has been
   *  visited.
   * --------------------------------------------------------------- */
  function candle(id, dx, dy) { return { id: id, type: 'decor', at: { near: 'm4_newgrave', dx: dx, dy: dy }, look: 'candle', solid: false, lines: ['A grave candle in a jam jar, unlit. The wick has never been used.'] }; }
  M('W114', {
    place: [{ id: 'm4_newgrave', type: 'decor', at: 'random-any', look: 'cross', solid: true,
        lines: [IF({ notFlag: 'm4_w114_lit' }, 'The newest grave, the earth still loose. Its lolly-stick cross: “Things I got too old for (2026)”.'),
          IF({ notFlag: 'm4_w114_lit' }, 'The list underneath is blank.'),
          IF({ notFlag: 'm4_w114_lit' }, 'Three candles stand in front of it, unlit. Lit all at once, the toys say, they show what is buried.'),
          IF({ flag: 'm4_w114_lit' }, 'The newest grave: “Things I got too old for (2026).”'),
          IF({ flag: 'm4_w114_lit' }, '“The night light. The plush rabbit. Being carried up to bed.”')] },
      candle('m4_candle1', -1, 1), candle('m4_candle2', 0, 1), candle('m4_candle3', 1, 1),
      { id: 'm4_postcard', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true, cond: { visited: 'W140' }, use: [{ secret: 'm4_not_gone' }],
        lines: ['A postcard has blown in among the graves, the wrong way round, as if it had been posted out of one of them.',
          'Blue marker, a drawing of a sea: “I’m not gone. I’m in another town. You can come and see. — N.”'] }],
    mech: [{ type: 'lampsAll', lamps: ['m4_candle1', 'm4_candle2', 'm4_candle3'], time: 20, light: 2.2, done: { flag: 'm4_w114_lit' },
      litLines: ['The candle catches. The other wicks are waiting.', 'A small flame. Somewhere behind you, the first one is already shrinking.', 'It lights. Quickly, before the first goes out.'],
      onLine: 'Still burning. For now.', doneLine: 'The three candles burn low and steady.',
      reward: [{ set: { m4_w114_lit: true } }, { secret: 'm4_newest_grave' }],
      winLines: ['All three candles burn at once, and the newest grave is the brightest thing on the hill.',
        'In the candlelight, the list on the cross fills itself in:', 'The night light. The plush rabbit. Being carried up to bed.',
        'The Plush Gravedigger takes off its button hat and holds it to its chest.'] }],
    rules: ['The newest grave (“Things I got too old for”) has three candles in front of it. Light all three before the first goes out (about twenty seconds): its list fills in.',
      'Secret: once you have been to Nour’s Town (W140), a postcard from N. lies somewhere among the graves.'] });

  /* ---------------------------------------------------------------
   *  W115 — The School of 1989
   *  Puzzle: fill in Mi-ran's family survey truthfully (quiz).
   *  Secret: call her name for the register (listen).
   * --------------------------------------------------------------- */
  var CALLED = { flag: 'm4_w115_called' };
  MX('W115', {
    place: [{ id: 'm4_survey', type: 'decor', at: [17, 3], look: 'desk', lookOpt: { book: true }, solid: true },
      { id: 'm4_homework', type: 'decor', at: [5, 6], look: 'book', lookOpt: { c: ['#f0e8d0', '#3a6a3a'] }, solid: false,
        lines: ['Mi-ran’s homework book, every exercise done, every page neat.', 'The line “parent’s signature” is blank on every page, all year.'] },
      { id: 'm4_pinned', type: 'decor', at: [32, 2], look: 'poster', cond: { flag: 'm4_w115_survey' },
        lines: ['The family survey, pinned up with the others. Next to “After midnight”, a small sun drawn in pencil.', 'The teacher has stamped it: a smiling flower, “Well done.”'] },
      { id: 'm4_roll', type: 'decor', at: [14, 3], look: 'clipboard', listenDist: 4,
        lines: [IF({ notFlag: 'm4_w115_called' }, 'The class register, open on the corner of the desk. Every name has a tick beside it except one: Kim Mi-ran.'),
          IF({ notFlag: 'm4_w115_called' }, 'Her name has never been called out loud in this room. You can tell: the ink is still sharp.'),
          IF(CALLED, 'The class register. Beside Kim Mi-ran, a tick, a little shaky, as if the pen were surprised.')],
        listen: [{ match: ['mi ran', 'miran', '미란', '김미란', '미란아'], if: { notFlag: 'm4_w115_called' },
          do: [{ set: { m4_w115_called: true } }, { secret: 'm4_present' }, { reeval: true }],
          lines: ['You call her name, the way a teacher would at the start of the day.', 'At the back of the class, a chair scrapes.',
            KS('네! 저 여기 있어요.', 'Yes! I’m here.'), 'In the register, a tick appears beside her name.'] }] }],
    mech: [{ type: 'quiz', mark: 'm4_survey', done: { flag: 'm4_w115_survey' }, doneLine: 'The survey is filled in. The truth fits on one page.',
      intro: ['On the teacher’s desk, a family survey handed out to the whole class. Mi-ran’s is the only one still blank.', 'You pick up the pencil and fill it in for her.'],
      failLine: 'The teacher’s red pencil hovers over it, then crosses it all out. Try again: the truth, this time.',
      questions: [{ q: 'Father’s occupation:', choices: ['Doctor', 'The company', 'Factory, nights'], right: 1 },
        { q: 'Father comes home at:', choices: ['Six o’clock', 'After midnight', 'Never'], right: 1 },
        { q: 'Who checks the homework?', choices: ['Father', 'Mother', 'Nobody'], right: 2 }],
      reward: [{ set: { m4_w115_survey: true } }],
      winLines: ['You write the true answers, in pencil. Where the parent signs, you leave it blank. That is true too.',
        'Little Mi-ran reads it over your shoulder. She doesn’t say anything.', 'She takes the pencil and draws a sun next to “After midnight”.',
        'The teacher pins it up on the wall with the others.'] }],
    rules: ['On the teacher’s desk, fill in Mi-ran’s family survey with the true answers (her father works for “the company”, comes home after midnight, nobody checks her homework): it is pinned up on the wall.',
      'Secret: next to the class register on the desk, call her name out loud (“Mi-ran”, 미란): she answers “here” and her name is ticked at last.'] });

  /* ---------------------------------------------------------------
   *  W118 — The Hospital Beneath Reality (vast)
   *  Puzzle: tell the night nurse she can sit down (sayTo). The Compass
   *  points to her stool.
   * --------------------------------------------------------------- */
  var SAT = { flag: 'm4_w118_sat' }, STANDING = { notFlag: 'm4_w118_sat' };
  M('W118', {
    set: { compass: 'm4_stool' },
    npcs: [{ id: 'N2171', name: 'A Night Nurse Who Never Sits', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#d8e4e8', '#b8c8d0', '#e0c0a0', '#2a2020'], eyes: 'down' }),
      behavior: 'static', solid: true, lang: 'ko-s', at: { near: 'm4_stool', dx: 1, dy: 0 },
      lines: [IF(STANDING, KS('괜찮아요. 저는 괜찮아요.', 'I’m fine. I’m fine, really.')),
        IF(STANDING, { seq: ['She stands beside a stool, one hand on its back, the way you touch something in a shop you can’t afford.',
          KS('열두 시간째 서 있어요. 앉으면 다시 못 일어날 것 같아서.', 'Twelve hours on my feet. If I sit down, I don’t think I’ll get up again.')] }),
        IF(STANDING, KS('아무도 앉으라고 안 해요. 다들 바쁘니까.', 'Nobody ever tells you to sit. Everyone’s busy.')),
        IF(SAT, 'She sits on the stool with her eyes closed, both hands round a paper cup gone cold. She looks younger.'),
        IF(SAT, KS('조금만요. 진짜 조금만 앉아 있을게요.', 'Just a little while. I’ll only sit a little while.'))] }],
    place: [{ id: 'm4_stool', type: 'decor', at: 'random-hidden', look: 'stool', solid: true,
      lines: [IF(STANDING, 'A plastic stool in a corner of the ward, pushed against the wall. Nobody has ever been seen sitting on it.'),
        IF(SAT, 'The stool, warm.')] }],
    mech: [{ type: 'sayTo', ent: 'N2171', dist: 3, words: ['sit down', 'sit', 'have a seat', 'take a seat', 'rest', 'take a break', 'have a break', '앉으세요', '앉아요', '앉아', '쉬세요', '쉬어요', '쉬어'],
      done: SAT, doneLine: 'She sits with her eyes closed. You let her.',
      reward: [{ set: { m4_w118_sat: true } }, { collect: 'photos' }, { secret: 'm4_nurse_sat' }],
      winLines: ['She looks at you for a long time.', KS('…앉아도 돼요?', '…Am I allowed to sit?'), 'She sits. Her shoulders come down. For a minute, the whole ward is quiet.',
        KS('고마워요. 딸이 하나 있는데, 꼭 그쪽만 해요.', 'Thank you. I have a daughter. She’s just about your size.'),
        'She takes a photograph out of her pocket and gives it to you, as if it were the only thing she had to give.'] }],
    rules: ['A night nurse stands beside a stool in a corner of the wards (the Compass points to it) and never sits. Tell her she can (“sit down”, “rest”, 앉으세요): she sits, and gives you a photograph. The dreaming patient in The Patient’s Dream asks for this.'] });

  /* ---------------------------------------------------------------
   *  W119 — The Patient's Dream
   *  Puzzle: follow the patient's footprints from the hospital door to
   *  the kitchen door without straying (trail). Secret: with the Light
   *  Switch (E90), a front door with its porch light off.
   * --------------------------------------------------------------- */
  M('W119', {
    place: [{ id: 'm4_porch', type: 'decor', at: 'random-hidden', look: 'door', lookOpt: { style: 'wood', c: ['#e8e8f8'] }, solid: true, cond: { equipped: 'E90' }, use: [{ secret: 'm4_someone_home' }],
      lines: ['A cloud shaped like a front door. Above it, a porch light, switched off.', 'In this dream, a light switched off means somebody has come home.'] }],
    mech: [{ type: 'trail', from: 'back', to: 'toW113', slack: 1, lostLine: 'The bare footprints go on across the clouds without you.', done: { flag: 'm4_w119_home' },
      reward: [{ set: { m4_w119_home: true } }, { secret: 'm4_walked_home' }, { time: 40 }],
      winLines: ['You walk the patient’s footsteps all the way, without straying.', 'Out of the hospital door, across the clouds, to a kitchen door with a light behind it.',
        'Behind you, very faintly, someone sighs in their sleep, the way you sigh when you have finally got home.', 'The dream lengthens a little, as if he were letting you stay.'] }],
    rules: ['Bare footprints lead from the door back to the hospital to the kitchen door. Follow them to the end without straying: the patient walks home in his dream, and your dream lasts a little longer.',
      'Secret: with the Light Switch (E90) equipped, a cloud shaped like a front door appears in a corner, its porch light off: someone is home.'] });

  /* ---------------------------------------------------------------
   *  W120 — Laboratory 6
   *  Puzzle: Subject 4's eyes move in her sleep; walk what she sees
   *  (dirSequence). Secret: speak into the recording microphone.
   * --------------------------------------------------------------- */
  var WALKED = { flag: 'm4_w120_walked' };
  MX('W120', {
    npcs: [{ id: 'N2172', name: 'Subject 4', look: H({ t: 'kid', hairStyle: 'long', body: 'robe', c: ['#e0e8ec', '#c0ccd4', '#e8d8d0', '#3a3030'], eyes: 'closed', h: 18 }),
      behavior: 'static', face: false, solid: true, alpha: 0.75, at: [6, 10],
      lines: [IF({ notFlag: 'm4_w120_walked' }, { seq: ['A girl asleep standing up, wires in her hair, a tag on her wrist: 4.', 'She turns her head in her sleep, always in the same order, as if she were watching somebody walk.'] }),
        IF({ notFlag: 'm4_w120_walked' }, 'If somebody walked it for her, step for step, close by, she might stop watching.'),
        IF(WALKED, EN('I remember the ceiling. And now I remember walking.')),
        IF(WALKED, 'She sleeps without moving now, a small smile, the wires slack.')] }],
    place: [{ id: 'm4_spot4', type: 'decor', at: [6, 10], look: 'scuff', solid: false, flat: true, noInteract: true }, // keeps her cell free
      { id: 'm4_file4', type: 'decor', at: [42, 26], look: 'drawer', cond: WALKED, use: [{ secret: 'm4_subject_four' }],
        lines: ['A file drawer that was not here before, in the corner of the archives. One folder: SUBJECT 4.', 'One page inside, typed: “Paradoxical phase: walked.” Nothing else. It is enough.'] },
      { id: 'm4_mic', type: 'decor', at: [42, 3], look: 'intercom', light: 0.4, listenDist: 4,
        lines: [IF({ notFlag: 'm4_w120_spoke' }, 'A desk microphone with a red light: RECORDING.'),
          IF({ notFlag: 'm4_w120_spoke' }, 'A label on the stand: “For the subject’s use.” The tape beneath it is blank.'),
          IF({ flag: 'm4_w120_spoke' }, 'The microphone. The red light has gone green.')],
        listen: [{ any: true, if: { notFlag: 'm4_w120_spoke' }, do: [{ set: { m4_w120_spoke: true } }, { secret: 'm4_subject_spoke' }, { reeval: true }],
          lines: ['The red light on the microphone flickers.', 'On the nearest screen, the curves stop drawing mountains, and a line of text types itself:',
            { t: function () { var d = YN.save.dream, s = d && d.saidRaw && d.saidRaw.length ? d.saidRaw[d.saidRaw.length - 1] : '…'; return 'SUBJECT SPOKE. CONTENT: “' + s + '”.'; } },
            'Then, added in pencil, in a hand you know from the clipboards: she is awake in there.'] }] }],
    mech: [{ type: 'dirSequence', ent: 'N2172', seq: ['left', 'left', 'right', 'up', 'right', 'left'], dist: 6, done: WALKED,
      reward: [{ set: { m4_w120_walked: true } }],
      winLines: ['You walk her dream for her, step for step: left, left, right, up, right, left.', 'Her head stops turning. She smiles in her sleep.',
        EN('I remember the ceiling. And now I remember walking.'), 'Somewhere in the archives, a drawer slides open.'] }],
    rules: ['In the examination room, Subject 4 turns her head in her sleep in a pattern (left, left, right, up, right, left). Walk the same steps near her: a file drawer opens in the south-east corner of the archives.',
      'Secret: in the screen room, say anything near the recording microphone (north-east corner): the lab writes down, for once, that the subject spoke.'] });
})(typeof window !== 'undefined' ? window : globalThis);
