/* =========================================================================
 *  MORE (07) — puzzles and secrets for W176–W200 (deep layers P4–P5).
 *  One file, additions only (YN.kit.more). NPC ids N2235–N2259, no new
 *  effects, flags / temps / secret keys prefixed m7_.
 *  Fixed-position marks on hand-drawn maps are written into the map as mark
 *  characters (placed before every random mark, so nothing lands on them);
 *  on generated maps they go in a small clearing carved by gen.post, so the
 *  expanded and looping maps keep their size (no fixed coordinates in place).
 *  Hidden rooms: fakeWalls + map extension into new solid / void cells.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util, W = YN.data.worlds, MORE = YN.kit.more;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function IF(c, l) { var o = typeof l === 'string' ? { t: l } : Object.assign({}, l); o.if = c; return o; }
  void H;

  /* ---------- mark characters written into the map ---------- */
  var POOL = 'QZXJKVYWPMNHGFEDCBAULRSTIO9876543210';
  function freeChars(d, n, taken) {
    var used = Object.assign({}, taken || {});
    (d.map || []).forEach(function (r) { for (var i = 0; i < r.length; i++) used[r[i]] = 1; });
    U.keys(d.marks || {}).forEach(function (k) { used[k] = 1; });
    var out = []; for (var i = 0; i < POOL.length && out.length < n; i++) if (!used[POOL[i]]) out.push(POOL[i]);
    if (out.length < n) YN.warn('more_07: not enough mark characters for ' + d.id);
    return out;
  }
  /* registers marks (with at: [x, y] or rel: [dx, dy]) as map characters; returns a function (rows, x0, y0) that writes them */
  function marksAt(id, specs) {
    var d = W[id]; if (!d) { YN.warn('more_07: unknown world ' + id); return function (r) { return r; }; }
    d.marks = d.marks || {};
    var fixed = {}; specs.forEach(function (s) { if (s.ch) fixed[s.ch] = 1; });
    var auto = freeChars(d, specs.filter(function (s) { return !s.ch; }).length, fixed), ai = 0, put = [];
    specs.forEach(function (s) {
      var ch = s.ch || auto[ai++]; if (!ch) return;
      var md = Object.assign({}, s); delete md.at; delete md.rel; delete md.ch;
      d.marks[ch] = md; put.push([s.at || s.rel, ch]);
    });
    return function (rows, ox, oy) {
      var g = rows.map(function (r) { return r.split(''); });
      put.forEach(function (p) { var x = p[0][0] + (ox || 0), y = p[0][1] + (oy || 0); if (g[y] && x >= 0 && x < g[y].length) g[y][x] = p[1]; else YN.warn('more_07: ' + id + ' mark outside the map at ' + x + ',' + y); });
      return g.map(function (r) { return r.join(''); });
    };
  }
  function rect(rows, x0, y0, w, h, ch) {
    return rows.map(function (r, y) { if (y < y0 || y >= y0 + h) return r; var a = r.split(''); for (var x = x0; x < x0 + w && x < a.length; x++) if (x >= 0) a[x] = ch; return a.join(''); });
  }
  function padRight(rows, n, ch) { var s = new Array(n + 1).join(ch); return rows.map(function (r) { return r + s; }); }
  function padDown(rows, n, ch) { var w = rows[0].length, s = new Array(w + 1).join(ch), out = rows.slice(); for (var i = 0; i < n; i++) out.push(s); return out; }
  function nightNo() { return YN.save.dream ? YN.save.dream.no : 0; }

  /* =========================================================================
   *  W176 — The Sea of Televisions (P4, generated, looping)
   *  Puzzle (dials): three old sets labelled MUM / GRANDMA / ME — tune each
   *  to where that person is at night. Secret (realHour 2–5): after closedown,
   *  one set shows something that is not on the schedule.
   * ========================================================================= */
  var TV = ['snow', 'a hospital corridor at night', 'a garden at dawn', 'a bedroom with the lamp on', 'the news: nothing happened', 'a platform in the snow, 1951'];
  var tv176 = marksAt('W176', [
    { id: 'm7_set_mum', rel: [-2, 0], type: 'decor', look: 'crt', solid: true, light: 0.6, lines: ['An old set with a channel knob.'] },
    { id: 'm7_set_gran', rel: [0, 0], type: 'decor', look: 'crt', solid: true, light: 0.6, lines: ['An old set with a channel knob.'] },
    { id: 'm7_set_me', rel: [2, 0], type: 'decor', look: 'crt', solid: true, light: 0.6, lines: ['An old set with a channel knob.'] },
    { id: 'm7_tape_mum', rel: [-2, 1], type: 'decor', look: 'scraps', solid: false, flat: true,
      lines: ['A strip of masking tape on the floor under the left-hand set, in a child’s capitals: MUM.', 'The knob has been turned so often that the numbers have worn off.'] },
    { id: 'm7_tape_gran', rel: [0, 1], type: 'decor', look: 'scraps', solid: false, flat: true,
      lines: ['Tape under the middle set: GRANDMA.', 'The letters have been gone over again and again, as if to keep them from fading.'] },
    { id: 'm7_tape_me', rel: [2, 1], type: 'decor', look: 'scraps', solid: false, flat: true,
      lines: ['Tape under the right-hand set: ME. Somebody has drawn a tiny lamp next to the word.'] },
    { id: 'm7_notice', rel: [0, 2], type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A transmitter notice, fallen face up: BROADCASTING ENDS 02:00. RESUMES 05:00.', 'Underneath, by hand: “whatever is on in between is not on the schedule”.'] }]);
  MORE('W176', {
    post: function (rows) {
      var w = rows[0].length, h = rows.length, cx = Math.floor(w / 2), cy = Math.floor(h / 2);
      rows = rect(rows, cx - 4, cy, 9, 3, '.');
      rows = rect(rows, cx - 3, cy - 1, 7, 1, 'o');
      return tv176(rows, cx, cy);
    },
    place: [{ id: 'm7_closedown', type: 'decor', at: 'random-hidden', look: 'tv', animated: true, light: 0.9, cond: { realHour: [2, 5] },
      lines: ['One set out here is still showing something after closedown. The anthem is over, the flag has stopped.', 'Then, off the schedule: a young nurse laughing on a hospital roof, waving at whoever is filming.',
        'In the dust on the glass, a fingertip has written: “2008. first night.”'],
      use: [{ secret: 'm7_176_closedown' }] }],
    mech: [{ type: 'dials', marks: ['m7_set_mum', 'm7_set_gran', 'm7_set_me'], states: TV.length, values: TV, target: [1, 2, 3], labelText: 'Channel: ',
      done: { secret: 'm7_176_family' }, doneLine: 'The three sets are dark. In the glass, side by side: you, and two empty rooms.',
      winLines: ['Three sets in a row: a nurse asleep on her feet, a watering can on its side at dawn,', 'and a girl awake under a lamp.',
        'For a moment the three programmes are one programme: three people in three rooms, and nobody asleep.',
        'Then the three sets switch themselves off together. Out in the sea, the others go on talking to nobody.'],
      reward: [{ secret: 'm7_176_family' }] }],
    rules: ['Puzzle: in the middle of the sea, three old sets stand in a row, labelled MUM, GRANDMA and ME on tape. Turn their knobs (each interaction changes the channel) so that each shows where that person is at night: the hospital corridor, the garden at dawn, the bedroom with the lamp on. They switch themselves off together.',
      'Secret: between 2:00 and 5:00 (real time) — after the closedown announced on the fallen notice — one set in a far nook of the sea shows a young nurse on a hospital roof, in 2008.'] });

  /* =========================================================================
   *  W177 — The Sky Below (P4, generated islands)
   *  Puzzle (recede): a fallen star slides away whenever you look at it.
   *  Secret (said “wish”): a second star comes down in a nook.
   * ========================================================================= */
  MORE('W177', {
    place: [{ id: 'm7_star', type: 'decor', at: 'random-any', look: 'sparkle', lookOpt: { c: ['#fff0b0'] }, light: 1.6, solid: false, animated: true,
        lines: ['The star you caught shines low over the grass now. It does not run from you any more.'] },
      { id: 'm7_chart', type: 'decor', at: 'random-any', look: 'letter', solid: false, flat: true,
        lines: ['A sky chart drawn in crayon, weighed down with a pebble.', 'Stars marked with arrows, and a warning: “they are shy”.', '“Never look straight at one. Walk past as if you hadn’t seen it.”',
          'At the bottom, smaller: “and if you want one to come down, wish OUT LOUD. The sky is a bit deaf.”'] },
      { id: 'm7_wishstar', type: 'decor', at: 'random-hidden', look: 'sparkle', lookOpt: { c: ['#f0c8ff'] }, light: 1.2, solid: false, animated: true, cond: { said: 'wish' },
        lines: ['In a far nook of the island, another star has come down, because somebody wished out loud.', 'It grants nothing. It listens. You say the wish again, quieter, and it glows a little, as if taking notes.'],
        use: [{ secret: 'm7_177_wish' }] }],
    mech: [{ type: 'recede', mark: 'm7_star', dist: 7, done: { secret: 'm7_177_caught' },
      winLines: ['You walk past the star looking at the clouds under your feet, as if you had not seen it.', 'When you stop, it is right beside you: the size of a button, warm, a little out of breath.',
        'It was only a lit window from somebody else’s night that fell down here. It just wanted someone near.'],
      reward: [{ secret: 'm7_177_caught' }] }],
    rules: ['Puzzle: a fallen star wanders the islands and slides away whenever you look at it from close by. Walk past it facing elsewhere (sideways, not towards it) until you are right beside it: it lets itself be caught. A crayon sky chart on the grass hints at it.',
      'Secret: say a wish out loud (any sentence with the word “wish”): a second fallen star comes down in a far nook of the islands for the rest of the dream.'] });

  /* =========================================================================
   *  W178 — The Room of Smiles (P4, hand-drawn hall 28×18)
   *  Puzzle (sequence): put on the four masks in the order her day asks for
   *  them. Secret: a warm seam in the bottom wall leads into the workshop
   *  where the smiles are made (fake wall + room below the map).
   * ========================================================================= */
  var m178 = marksAt('W178', [
    { id: 'm7_m_photo', at: [13, 1], type: 'decor', look: 'frame', lookOpt: { c: ['#f8e0e0'] }, lines: ['A mask showing every tooth. Its tag: “for the class photo, after lunch — say kimchi”.'] },
    { id: 'm7_m_mum', at: [15, 1], type: 'decor', look: 'frame', lookOpt: { c: ['#f0d0d0'] }, lines: ['A mask held up at the corners by two pins. Its tag: “for Mum, when she comes in from the night shift”.'] },
    { id: 'm7_m_self', at: [17, 1], type: 'decor', look: 'frame', lookOpt: { c: ['#e8c8c8'] }, lines: ['A mask so small it fits in a fist. Its tag: “for yourself — put it on first, before anyone is awake”.'] },
    { id: 'm7_m_teacher', at: [19, 1], type: 'decor', look: 'frame', lookOpt: { c: ['#f0e8e8'] }, lines: ['A mask with very straight eyebrows. Its tag: “for the teacher — keep it on until the bell”.'] },
    { id: 'm7_card', at: [21, 1], type: 'decor', look: 'clipboard', lines: ['A card propped against the hooks: “Masks are worn in the order the day asks for them. No refunds on mornings.”',
      'Underneath, in pencil, someone has added: “the night shift ends at seven”.'] },
    { id: 'm7_seam', at: [22, 16], type: 'decor', look: 'crack', solid: false, flat: true, lines: ['Low on the wall here, a seam in the wallpaper, warm to the touch like the back of a hand.', 'Behind it, something smells of wet plaster and pink paint.'] },
    { id: 'm7_ws_in', at: [22, 18], type: 'trigger', lines: ['Behind the wallpaper: the room where the smiles are made.'], use: [{ secret: 'm7_178_workshop' }] },
    { id: 'm7_ws_bench', at: [21, 19], type: 'decor', look: 'desk', lines: ['A workbench. Plaster faces drying on wires, every one smiling.', 'A pot of pink paint, and a brush worn to the shape of a mouth.'] },
    { id: 'm7_ws_cast', at: [23, 19], type: 'decor', look: 'frame', lookOpt: { c: ['#d8d0c8'] }, cond: { secret: 'm7_178_order' },
      lines: ['One cast on the wire is not smiling. It has your face, exactly,', 'the way it looks when nobody is asking anything of it.', 'Its tag says: “not for sale”.'],
      use: [{ secret: 'm7_178_own_face' }] }]);
  MORE('W178', {
    fakeWalls: [[22, 17]],
    post: function (rows) { rows = padDown(rows, 4, '#'); rows = rect(rows, 20, 18, 5, 3, '.'); return m178(rows); },
    mech: [{ type: 'sequence', order: ['m7_m_self', 'm7_m_mum', 'm7_m_teacher', 'm7_m_photo'], passThrough: true,
      okLines: ['The smallest mask goes on first. It pulls at your face like a held breath.', 'The pinned smile goes on over it: for someone very tired, who must not worry.',
        'The straight eyebrows go on top. They will have to stay until the bell.'],
      wrongLine: 'That one doesn’t fit yet. The day hasn’t got that far.', doneLine: 'The masks hang on their hooks again. They don’t fit you any more.',
      done: { secret: 'm7_178_order' },
      winLines: ['The last mask goes on. Four smiles, one on top of another.', 'For a second the whole shop is very pleased with you.',
        'Then all four slide off at once and clatter on the floor.', 'Under them, your face. Not smiling, not anything. Just yours.'],
      reward: [{ secret: 'm7_178_order' }] }],
    rules: ['Puzzle: four masks hang on the back wall. Put them on in the order the day asks for them (the card says so; the night shift ends at seven): the one for yourself, before anyone is awake; the one for Mum, when she comes in from the night shift; the teacher’s; the class photo’s. They all fall off together.',
      'Secret: near the bottom-right of the shop, a warm seam in the bottom wall can be walked through: the workshop where the smiles are made. Once you have worn the four masks, a cast of your own face, not smiling, hangs on the wire.'] });

  /* =========================================================================
   *  W179 — The Field of Bells (P4, generated, looping)
   *  Puzzle (trail): walk in the Sunday visitor’s footprints without ringing a
   *  bell. Secret (a key equipped): the door you let yourself in by.
   * ========================================================================= */
  var KEYS = ['E12', 'E201', 'E234', 'E86', 'E163'];
  MORE('W179', {
    place: [{ id: 'm7_oldbell', type: 'decor', at: 'random-any', look: 'doorbell', lookOpt: { c: ['#8a7a5a'] },
        lines: ['A doorbell older than the others, its button worn pale by one thumb, on Sundays.', 'Slow, grown-up footprints lead away from it through the leaves. Wherever they step, nothing rings.'] },
      { id: 'm7_waitspot', type: 'decor', at: 'random-hidden', look: 'deadleaves', solid: false, flat: true,
        lines: [IF({ notSecret: 'm7_179_sunday' }, 'A patch of leaves pressed flat, as if someone stood here a long time, waiting to be let in.'),
          IF({ secret: 'm7_179_sunday' }, 'The paper bag of persimmons is still here. Nobody has come for it. Somebody will.')] },
      { id: 'm7_keyhook', type: 'decor', at: 'random-any', look: 'keyring',
        lines: ['A key hook planted in the leaves, the kind that hangs by a front door. Empty.', 'Whoever lives here never rings. She lets herself in.'] },
      { id: 'm7_letmein', type: 'decor', at: 'random-hidden', look: 'hatch', cond: { equipped: KEYS },
        lines: ['A door lying flat in the leaves, like a cellar hatch. It has no bell, only a keyhole.', 'You have a key. Nobody rang, so nobody has to open: you let yourself in.',
          'Three steps down, a doormat in a child’s handwriting: WELCOME HOME.', 'Then earth again. That is all it needed to say.'],
        use: [{ secret: 'm7_179_let_in' }] }],
    mech: [{ type: 'trail', from: 'm7_oldbell', to: 'm7_waitspot', slack: 1, lostLine: 'A bell rings under your foot. The footprints start again at the old doorbell.',
      done: { secret: 'm7_179_sunday' },
      winLines: ['You walk in the footprints all the way, and not one bell rings.', 'They stop at nothing: no house, no door. Just the place where someone waited a long time, on a Sunday.',
        'On the ground, a paper bag of persimmons gone soft, and a note in shaky handwriting:',
        KS('소라야, 할머니 왔다 간다. 문 안 열어도 돼. 잘했어.', 'Sora, Grandma came by. You didn’t have to open. You did well.')],
      reward: [{ secret: 'm7_179_sunday' }] }],
    rules: ['Puzzle: from the oldest doorbell (worn pale), slow footprints cross the field. Follow them to the end without straying more than a step (a stray step rings a bell and sends you back to the start): it is where the Sunday visitor waited. Grandma left persimmons and a note.',
      'Secret: with a key equipped (Keyring, Key on a String, Latchkey on a Shoelace, Handle or Doorless Handle), a door lying flat in the leaves appears in a far nook: you let yourself in. The empty key hook hints at it.'] });

  /* =========================================================================
   *  W180 — The Witches’ Dormitory (P4, hand-drawn 34×16)
   *  Puzzle (quiz): the lights-out roll call — name the sleeper of each bed.
   *  Secret (the Cat equipped): the cat’s hoard behind a flap nobody sees.
   * ========================================================================= */
  var m180 = marksAt('W180', [
    { id: 'm7_rollcall', at: [32, 3], type: 'decor', look: 'clipboard', lines: ['A clipboard on a nail: LIGHTS-OUT ROLL CALL.'] },
    { id: 'm7_catspot', at: [28, 7], type: 'decor', look: 'trinket', lookOpt: { c: ['#f0d040'] }, solid: false, cond: { secret: 'm7_180_rollcall' },
      lines: ['Where the cat was sitting, at the foot of the fifth bed: a child’s hairclip, a yellow star. Warm.', 'The cat has been keeping it for someone. It will not say for whom.'] },
    { id: 'm7_catbowl', at: [2, 14], type: 'decor', look: 'drawer', lookOpt: { c: ['#3a2a2a'] }, solid: false,
      lines: ['A cat’s bowl by the skirting board, licked clean.', 'Above it, scratches at cat height, as if something small goes in and out where people never look.'] },
    { id: 'm7_hoard', at: [1, 13], type: 'decor', look: 'hatch', solid: false, cond: { equipped: 'E19' },
      lines: ['With cat ears on, you see what cats see: a flap in the skirting board, and behind it the cat’s hoard.', 'Things the witches dropped while hunting: a pencil case, a door key on a string, one mitten,',
        'and a crayon drawing of a woman asleep at a kitchen table. The cat has kept them all. Nobody told it to.'],
      use: [{ secret: 'm7_180_hoard' }] }]);
  MORE('W180', {
    post: function (rows) { return m180(rows); },
    mech: [{ type: 'quiz', mark: 'm7_rollcall', done: { secret: 'm7_180_rollcall' }, doneLine: 'The roll call is done. Every bed has its name, and the lamp stays off.',
      intro: ['LIGHTS-OUT ROLL CALL. Every bed must be named before the lamp can go off. Wrong names keep everybody up.'],
      questions: [{ q: 'First bed from the left: who sleeps there?', choices: ['The Copycat', 'The Silent One', 'The Traveller', 'The Doorbell'], right: 1 },
        { q: 'The bed in the middle of the row?', choices: ['The Seamstress', 'The Doorbell', 'The Copycat', 'The Silent One'], right: 2 },
        { q: 'Fourth bed from the left?', choices: ['The Doorbell', 'The Traveller', 'The Seamstress', 'The Copycat'], right: 0 },
        { q: 'And where does the cat sleep?', choices: ['Under the first bed', 'In the middle bed', 'At the foot of the fifth bed', 'Outside the door'], right: 2 }],
      failLine: 'The clipboard shakes on its nail. Somewhere under the covers, someone giggles. Start the roll call again.',
      winLines: ['Every bed named, every rule in its place.', 'The lamp over the door switches itself off.', 'In the dark, five voices say goodnight, small and hoarse, like girls up far too late.',
        'At the foot of the fifth bed, the cat yawns and gets up, so that you can see what it was sitting on.'],
      reward: [{ secret: 'm7_180_rollcall' }] }],
    rules: ['Puzzle: the clipboard on the right-hand wall is the lights-out roll call. Name the sleeper of each bed from its embroidered pillow (first: the Silent One; middle: the Copycat; fourth: the Doorbell) and say where the cat sleeps (at the foot of the fifth bed). Then the cat moves, and a yellow star hairclip lies where it sat.',
      'Secret: with the Cat (E19) equipped, a flap in the skirting board above the cat’s bowl (bottom-left corner) shows the cat’s hoard: things the witches dropped while hunting.'] });

  /* =========================================================================
   *  W181 — The Bed at the Bottom of the Water (P4, generated cave)
   *  Puzzle (sayTo): a dry letter on the seabed asks one question. Answer it.
   *  (The bed to the sixth layer is untouched: Diving Suit, as before.)
   * ========================================================================= */
  MORE('W181', {
    place: [{ id: 'm7_seabox', type: 'decor', at: 'random-hidden', look: 'mailbox', lookOpt: { c: ['#5a7a8a'] },
      lines: ['A letterbox standing on the seabed, its little door open. Of the number, only a 4 is left.',
        'Inside, a letter in a plastic sleeve, perfectly dry.', 'Two handwritings ask the same thing, all the way down the page:',
        KS('밥은 먹었니?', 'Have you eaten?'), 'Nobody has ever written an answer under it.'] }],
    mech: [{ type: 'sayTo', mark: 'm7_seabox', dist: 3,
      words: ['yes', 'i ate', 'i have eaten', 'i ve eaten', 'ive eaten', 'i did', '먹었어', '먹었어요', '밥 먹었어', '네', '응'],
      done: { secret: 'm7_181_answered' }, doneLine: 'The letter has its answer now. It floats a little higher in its sleeve.',
      winLines: ['You answer it out loud, at the bottom of the sea.', 'The water goes still. Under all the questions, new ink comes up,', 'as if someone had waited years for the next line:',
        KS('그래. 그럼 됐다. 잘 자라.', 'Good. Then that’s all that matters. Sleep well.'), 'Grandmother’s hand. And under it, smaller and more tired, Mum’s: the same three words.'],
      reward: [{ secret: 'm7_181_answered' }] }],
    rules: ['Puzzle: in a nook of the seabed stands a letterbox with a dry letter asking “Have you eaten?” (밥은 먹었니?) over and over. Answer it out loud beside it (“yes”, “I ate”, 먹었어…): the letter answers back.'] });

  /* =========================================================================
   *  W182 — The Room Below (P4, inverted room)
   *  Puzzle (push): push the upside-down stool under the door whose handle is
   *  too high, and open the door a little. (The bed’s conditions are untouched.)
   * ========================================================================= */
  var m182 = marksAt('W182', [
    { id: 'm7_stool', at: [5, 6], type: 'decor', look: 'stool', solid: true,
      lines: ['A child’s stool, upside down like everything here.', 'Under a door, it would be just the right height for a handle that is out of reach.'] },
    { id: 'm7_dents', at: [2, 6], type: 'decor', look: 'scuff', solid: false, flat: true,
      lines: ['Four little dents in the floor in front of the door: the feet of something that used to stand here.'] }]);
  MORE('W182', {
    post: function (rows) { return m182(rows); },
    mech: [{ type: 'push', blocks: ['m7_stool'], plates: ['m7_dents'], sfx: 'step_wood', done: { secret: 'm7_182_ajar' },
      winLines: ['The stool stops under the door, the right way up for a room that is upside down.', 'You climb on it. The handle that was too high is in your hand. You open the door, just a little.',
        'Through the gap, the hall of the flat, the right way up. A uniform jacket on the floor, and someone in it,',
        'asleep sitting against the wall, the way you sit when you got home and could not go one step further.'],
      reward: [{ secret: 'm7_182_ajar' }] }],
    rules: ['Puzzle: push the upside-down stool (walk into it; the controls are reversed here) onto the four dents in front of the bedroom door, whose handle is too high: climbing on it, you open the door a little and see who is asleep in the hall.'] });

  /* =========================================================================
   *  W183 — The Sixth Layer (P5)
   *  Puzzle (laps + reach): go round the middle bed seven times, like someone
   *  checking a cot, then lie down on the polished marble just south of it.
   * ========================================================================= */
  var m183 = marksAt('W183', [
    { id: 'm7_ring', at: [16, 20], type: 'decor', look: 'scuff', solid: false, flat: true,
      lines: ['A groove worn into the marble all round the middle bed,', 'the way a floor wears where someone walks round a cot at night.',
        'Seven grooves, one inside the other.', 'Just south of the bed, a patch is polished smooth, as if someone lay down there once.'] },
    { id: 'm7_names', at: [20, 24], type: 'decor', look: 'glint', solid: false, flat: true, cond: { secret: 'm7_183_rounds' },
      lines: ['Cut into the marble where you lay, very small: OK-SUN. MI-RAN. SORA.', 'Under them, one more line, left smooth for whoever comes next. It does not have to be soon.'],
      use: [{ secret: 'm7_183_names' }] }]);
  MORE('W183', {
    post: function (rows) { return m183(rows); },
    mech: [{ type: 'laps', center: [20, 20], key: 'm7_183_laps' },
      { type: 'reach', zone: [19, 22, 21, 23], cond: { tempGte: { m7_183_laps: 28 } }, done: { secret: 'm7_183_rounds' },
        winLines: ['Seven times round the middle bed, like someone checking that everyone is still breathing.',
          'You lie down on the polished marble. It is not cold. Every night someone checked on someone has warmed it.', 'Above, the violet sky turns once, slowly, like a mobile.'],
        reward: [{ secret: 'm7_183_rounds' }] }],
    rules: ['Puzzle: walk seven times round the middle bed (any distance; turning back undoes the rounds), then lie down on the polished marble just south of it: names appear, cut into the floor. The worn ring west of the bed hints at it.'] });

  /* =========================================================================
   *  W185 — Before Words (P5, generated, looping)
   *  Puzzle (pairs): six wooden blocks around a playmat; match the shapes.
   * ========================================================================= */
  var BLK = { type: 'decor', look: 'crate', solid: false, lines: ['A wooden block, face down.'] };
  var m185 = marksAt('W185', [
    Object.assign({ id: 'm7_b0', rel: [-2, -1], lookOpt: { c: ['#e8c890'] } }, BLK), Object.assign({ id: 'm7_b1', rel: [0, -1], lookOpt: { c: ['#c8e0a0'] } }, BLK),
    Object.assign({ id: 'm7_b2', rel: [2, -1], lookOpt: { c: ['#a0c8e8'] } }, BLK), Object.assign({ id: 'm7_b3', rel: [-2, 1], lookOpt: { c: ['#f0b0b0'] } }, BLK),
    Object.assign({ id: 'm7_b4', rel: [0, 1], lookOpt: { c: ['#e8e0a0'] } }, BLK), Object.assign({ id: 'm7_b5', rel: [2, 1], lookOpt: { c: ['#d0b0e8'] } }, BLK),
    { id: 'm7_mat', rel: [0, 0], type: 'decor', look: 'scuff', lookOpt: { c: ['#f0e8d8'] }, solid: false, flat: true,
      lines: ['A playmat in the middle of nowhere, faded to the colour of milk.', 'Six wooden blocks around it, painted on one side.', 'Before words, things that look the same belong together. It is the first thing anyone learns.'] }]);
  MORE('W185', {
    post: function (rows) {
      var w = rows[0].length, h = rows.length, cx = Math.floor(w * 0.35), cy = Math.floor(h * 0.55);
      rows = rect(rows, cx - 4, cy - 2, 9, 5, '.');
      return m185(rows, cx, cy);
    },
    mech: [{ type: 'pairs', tiles: ['m7_b0', 'm7_b1', 'm7_b2', 'm7_b3', 'm7_b4', 'm7_b5'], done: { secret: 'm7_185_tower' },
      wrongLine: 'Two shapes that don’t match. The blocks roll back face down, patiently.', doneLine: 'The six blocks stand in a wobbly tower, shape on shape.',
      winLines: ['The last two shapes match. You stack the six blocks into a wobbly tower.', 'Somewhere on the plain the toddler shrieks with delight, runs over on unsteady legs, and knocks it down.',
        EN('again!'), 'You build it again. Before words, this is the whole game, and it is enough.'],
      reward: [{ secret: 'm7_185_tower' }, { collect: 'photos' }] }],
    rules: ['Puzzle: on a milk-coloured playmat in the plain lie six wooden blocks. Turn them over two at a time and match the shapes (they change every night): the toddler knocks the tower down, and a photograph is found.'] });

  /* =========================================================================
   *  W186 — The Lullaby (P5)
   *  Puzzle (corner): the sixth felt star fell off the mobile; it only lets
   *  itself be caught where there is nowhere left to roll.
   * ========================================================================= */
  var m186 = marksAt('W186', [
    { id: 'm7_chest', at: [1, 17], type: 'decor', look: 'commode', lines: ['A chest of drawers pushed against the wall.', 'Behind it, in the corner, a gap just big enough for something small to hide in, and no way out.'] },
    { id: 'm7_shelf', at: [22, 2], type: 'decor', look: 'shelf', lines: ['A low shelf of picture books against the wall. Between it and the corner, a dark gap where lost things end up.'] },
    { id: 'm7_thread', at: [11, 8], type: 'decor', look: 'trinket', lookOpt: { c: ['#f0e890'] }, solid: false,
      lines: [IF({ notSecret: 'm7_186_star' }, 'One thread of the star mobile hangs empty above the cradle. Five stars go round. There used to be six.'),
        IF({ notSecret: 'm7_186_star' }, 'The sixth rolls about the floor at night, and will only be caught where there is nowhere left to roll.'),
        IF({ secret: 'm7_186_star' }, 'Six stars go round the cradle now. The music box, unwound, plays three more notes than it used to.')] }]);
  MORE('W186', {
    post: function (rows) { return m186(rows); },
    npcs: [{ id: 'N2236', name: 'A Felt Star That Fell Off', look: { t: 'jelly', c: ['#f0e890'], h: 7, glow: '#f0e890' }, light: 1.2, behavior: 'flee', fleeDist: 4, radius: 11, speed: 1.6,
      solid: false, at: [19, 15], goneIf: { secret: 'm7_186_star' },
      lines: ['A felt star with a loose thread, rolling about on the floorboards.', 'It does not want to go back up. Up there, it only goes round and round.'] }],
    mech: [{ type: 'corner', ent: 'N2236', done: { secret: 'm7_186_star' },
      winLines: ['The felt star has nowhere left to roll. It lets you pick it up.', 'It is warm, as if it had been near a face all night.',
        'You tie it back on the empty thread. The mobile turns once, complete,', 'and the music box plays three notes it had forgotten.'],
      reward: [{ secret: 'm7_186_star' }] }],
    rules: ['Puzzle: a felt star that fell off the mobile rolls away from you across the nursery. Drive it into a corner where it cannot roll any further: it lets itself be tied back on the empty thread above the cradle.'] });

  /* =========================================================================
   *  W187 — The Mother’s Voice (P5)
   *  Puzzle (standStill): sit with your back against the door for a long time.
   * ========================================================================= */
  var m187 = marksAt('W187', [
    { id: 'm7_backrest', at: [59, 2], type: 'decor', look: 'scuff', solid: false, flat: true,
      lines: ['A patch of floor worn smooth against the door, the width of a back.', 'Someone sits like this every night, on the other side. Someone could sit here too.'] },
    { id: 'm7_list', at: [59, 3], type: 'decor', look: 'letter', solid: false, flat: true, cond: { secret: 'm7_187_sat' },
      lines: ['The paper that slid under the door: her list, the one from the uniform pocket.', '“milk — rice — call Sora — sleep”.',
        'Everything is crossed out but one line.', 'Beside “call Sora”, pressed so hard the pen went through: “tomorrow. really.”'],
      use: [{ secret: 'm7_187_list' }] }]);
  MORE('W187', {
    post: function (rows) { return m187(rows); },
    mech: [{ type: 'standStill', mark: 'm7_backrest', secs: 30, breakLine: 'You moved. On the other side of the door, the breathing stops, listens, goes on.',
      done: { secret: 'm7_187_sat' },
      winLines: ['You sit down with your back against the door. On the other side, through the wood, another back.', 'Nobody knocks. Nobody has to. For a long time, two people breathe at the same speed.',
        'A folded paper slides out under the door, into the line of light.'],
      reward: [{ secret: 'm7_187_sat' }] }],
    rules: ['Puzzle: at the very end of the corridor, stand without moving on the worn patch against the door for about thirty seconds, as if sitting back to back with whoever is on the other side: her list slides out under the door.'] });

  /* =========================================================================
   *  W188 — The First Memory (P5)
   *  Puzzle (guide): a speck of Sunday sunlight drifts round the room at a
   *  baby’s eye level; follow it, the way she once did.
   * ========================================================================= */
  MORE('W188', {
    npcs: [{ id: 'N2237', name: 'A Speck of Sunlight', look: { t: 'jelly', c: ['#fff4c8'], h: 6, glow: '#fff0a0' }, light: 1.8, behavior: 'patrol', ghost: true, passThrough: true, solid: false,
      speed: 0.9, pause: 0.5, at: [11, 3], path: [[11, 3], [17, 3], [17, 11], [4, 11], [4, 4], [9, 4], [9, 7]], goneIf: { any: [{ secret: 'm7_188_light' }, { temp: { m7_188_rest: true } }] },
      lines: ['A speck of Sunday sunlight, come loose from the window, drifting at the height of a baby’s eyes.', 'When you look away, it waits for you.'] }],
    mech: [{ type: 'guide', ent: 'N2237', wait: 4, done: { temp: { m7_188_rest: true } },
        winLines: ['The speck of light comes to rest on the edge of the cot,', 'and spreads into a small square of sun on the rug beside it.'],
        reward: [{ temp: { m7_188_rest: true } }] },
      { type: 'reach', zone: [8, 6, 9, 8], cond: { temp: { m7_188_rest: true } }, done: { secret: 'm7_188_light' },
        winLines: ['You lie down in the square of sun beside the cot, the way you did when you were very small,', 'following the light with your whole head.',
          'Behind you, the young woman claps her hands.', KS('이거 봐, 하나도 안 놓쳐!', 'Look at that — she doesn’t lose it for a second!'),
          'She laughs. It is the laugh you have been trying to remember for ten years.'],
        reward: [{ secret: 'm7_188_light' }] }],
    rules: ['Puzzle: a speck of sunlight drifts round the bedroom, and waits whenever you fall behind. Stay close to it all the way round: it comes to rest on the cot. Then lie down in the square of sun on the rug just left of the cot: the young woman laughs.'] });

  /* =========================================================================
   *  W190 — The Lit Bedroom (P5)
   *  Puzzle (visitAll): the four notes her mother left in the bedroom.
   * ========================================================================= */
  var m190 = marksAt('W190', [
    { id: 'm7_n1', at: [2, 3], type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A note under the pillow, folded in four, in your mother’s handwriting:', KS('엄마 일 갔다 올게. 밥 데워 먹어.', 'Mum’s gone to work, back soon. Heat up your rice.')] },
    { id: 'm7_n2', at: [13, 2], type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A note taped under the lamp switch:', KS('불 켜고 자도 돼. 오늘만.', 'You can sleep with the light on. Just tonight.'), 'The tape has been stuck and unstuck so often it has gone soft.'] },
    { id: 'm7_n3', at: [1, 7], type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A note on the floor of the doorway, where someone stood for a long time:', KS('문 잘 잠갔지? 누가 와도 열지 마.', 'You did lock the door? Don’t open it, whoever comes.')] },
    { id: 'm7_n4', at: [4, 4], type: 'decor', look: 'letter', solid: false, flat: true,
      lines: ['A note tucked into a slipper by the bed, the left one:', KS('미안해. 사랑해. 내일은 일찍 올게.', 'I’m sorry. I love you. I’ll be home early tomorrow.')] }]);
  MORE('W190', {
    post: function (rows) { return m190(rows); },
    mech: [{ type: 'visitAll', marks: ['m7_n1', 'm7_n2', 'm7_n3', 'm7_n4'], countText: 'Notes: # / %', done: { secret: 'm7_190_notes' },
      winLines: ['Four notes, four nights. The handwriting gets smaller and more tired from one to the next.', 'You fold them together, the way she folds them. They are all the same note, really.'],
      reward: [{ secret: 'm7_190_notes' }, { collect: 'pages' }] }],
    rules: ['Puzzle: four notes from her mother are hidden in the bedroom — under the pillow, under the lamp switch, in the doorway, in the left slipper. Read all four: they fold into one, and a torn page is found.'] });

  /* =========================================================================
   *  W191 — ▒▒▒▒▒▒ (P5, the character space)
   *  Puzzle (dials): four registers spell the subject’s name, given in hex.
   *  Secret: a soft cell in the east wall (drawn ░) opens onto the unwritten
   *  room outside the box.
   * ========================================================================= */
  var REG = ['_', 'A', 'E', 'N', 'O', 'R', 'S', 'U'];
  var m191 = marksAt('W191', [
    { id: 'm7_r0', ch: '0', at: [12, 12], type: 'decor', look: 'glyph', lines: ['> register 0'] },
    { id: 'm7_r1', ch: '1', at: [14, 12], type: 'decor', look: 'glyph', lines: ['> register 1'] },
    { id: 'm7_r2', ch: '2', at: [16, 12], type: 'decor', look: 'glyph', lines: ['> register 2'] },
    { id: 'm7_r3', ch: '3', at: [18, 12], type: 'decor', look: 'glyph', lines: ['> register 3'] },
    { id: 'm7_todo', ch: 'T', at: [42, 8], type: 'decor', look: 'glyph',
      lines: ['> // TODO: let her wake up gently', '> // TODO: when the mother switches the light off, make it kind', '> // NOTE: do not count the visits out loud'],
      use: [{ secret: 'm7_191_outside' }] },
    { id: 'm7_unused', ch: 'U', at: [42, 10], type: 'decor', look: 'glyph', lines: ['> world_000.map — 0 bytes', '> some dreams were never written. that is allowed.'] },
    { id: 'm7_save', ch: 'S', at: [44, 9], type: 'decor', look: 'glyph', cond: { secret: 'm7_191_named' },
      lines: ['> subject_6.sav — last saved: tonight', '> contents: one bedroom, one lamp, one mother on nights, a great many doors', '> this file is not her.'],
      use: [{ secret: 'm7_191_save' }] }]);
  MORE('W191', {
    fakeWalls: [[39, 9]],
    post: function (rows) { rows = padRight(rows, 7, '#'); rows = rect(rows, 40, 7, 6, 5, '.'); return m191(rows); },
    set: { asciiText: (W.W191.asciiText || []).concat([{ x: 6, y: 7, text: '> SUBJECT 6 = 53 4F 52 41' }, { x: 6, y: 12, text: 'NAME' }, { x: 39, y: 9, text: '░' }]) },
    mech: [{ type: 'dials', marks: ['m7_r0', 'm7_r1', 'm7_r2', 'm7_r3'], states: REG.length, values: REG, target: [6, 4, 5, 1], labelText: '> ',
      done: { secret: 'm7_191_named' }, doneLine: '> NAME = SORA',
      winLines: ['> NAME = SORA', '> SUBJECT 6 FOUND. STATUS: ASLEEP. LIGHT: ON.', '> a line has been added by someone else: she is not a file.'],
      reward: [{ secret: 'm7_191_named' }] }],
    rules: ['Puzzle: the line “SUBJECT 6 = 53 4F 52 41” is her name in hexadecimal character codes (like the ascii of the Nexus). Set the four registers after NAME (each interaction moves to the next character) to S, O, R, A.',
      'Secret: on the east wall, one cell is drawn ░ instead of #: walk through it into the unwritten room outside the box (comments, an empty map, and, once the name is set, her save file).'] });

  /* =========================================================================
   *  W192 — The 23:71 Train (P4)
   *  Puzzle (cycleFrames): one window shows 1951 going by; wave when the girl
   *  with one shoe is on the platform outside. (Mr. Ahn’s story untouched.)
   * ========================================================================= */
  var m192 = marksAt('W192', [{ id: 'm7_win1951', at: [34, 1], type: 'decor', look: 'window', light: 0.6, lines: ['A window. Outside, 1951 goes by.'] }]);
  MORE('W192', {
    post: function (rows) { return m192(rows); },
    mech: [{ type: 'cycleFrames', mark: 'm7_win1951', every: 2.4, good: 2,
      frames: ['Out of this window: snow, and people walking south with mattresses tied to their backs.', 'Out of this window: a frozen river, and a bridge with half of it missing.',
        'Out of this window: a crowded platform, and a little girl with one shoe, looking into every window.', 'Out of this window: rice paddies under the moon, and nobody in them.',
        'Out of this window: a station sign going by too fast to read.', 'Out of this window: only your own face, in the dark glass.'],
      done: { secret: 'm7_192_seen' }, doneLine: 'The glass still has two small handprints on it, from the inside.',
      winLines: ['You press both hands to the glass and wave, the way you wave at someone you are leaving.', 'On the platform, the little girl with one shoe sees you. Of all the windows, yours.',
        'She waves back with the shoe in her hand, laughing, as the platform slides away into 1951.'],
      reward: [{ secret: 'm7_192_seen' }] }],
    rules: ['Puzzle: one window near the middle of the carriage shows 1951 going by, a different view every few seconds. Use it while it shows the crowded platform with the little girl with one shoe: she sees you wave and waves back.'] });

  /* =========================================================================
   *  W193 — The Last Bed (P5)
   *  Puzzle (sayTo): at the tip of the island, answer the morning. A ladder
   *  out of every dream comes down (a wake-up door, next to Ending III).
   * ========================================================================= */
  var m193 = marksAt('W193', [
    { id: 'm7_dawn', at: [12, 2], type: 'decor', look: 'glint', lookOpt: { c: ['#d8d8e0'] }, solid: false, flat: true, light: 1,
      lines: ['At the very tip of the island, a thin grey line of light on the marble,', 'like the line under a bedroom door at six in the morning.',
        'From beyond it, the smell of rice and soup. Someone up there is already awake, waiting for an answer.'] },
    { id: 'm7_morning', at: [12, 1], type: 'ladder', to: 'WAKE', look: 'ladder', cond: { secret: 'm7_193_morning' }, label: 'a ladder made of morning, up out of every dream' }]);
  MORE('W193', {
    post: function (rows) { return m193(rows); },
    mech: [{ type: 'sayTo', mark: 'm7_dawn', dist: 3,
      words: ['good morning', 'morning', '좋은 아침', '안녕히 주무셨어요', '잘 잤어', 'i m up', 'im up', 'i m awake', 'im awake', '일어났어', '일어났어요', 'i m coming', 'im coming', '갈게'],
      done: { secret: 'm7_193_morning' }, doneLine: 'The ladder of morning is still there. It will wait.',
      winLines: ['You say it to the thin grey light, out loud: the first words of a day.', 'Far above all the beds, a spoon stops against a bowl. Someone has heard.',
        KS('…소라야? 일어났어?', '…Sora? Are you up?'), 'Out of the grey comes a ladder, plain, made of morning. It does not lead to any dream.'],
      reward: [{ secret: 'm7_193_morning' }, { reeval: true }] }],
    rules: ['Puzzle: at the northern tip of the island, a grey line of morning light smells of breakfast. Answer it out loud (“good morning”, “I’m up”, 좋은 아침…): a ladder made of morning comes down. Climbing it wakes you up — the other way out of the Last Bed.'] });

  /* =========================================================================
   *  W194 — Ok-sun’s Garden, 1952 (P4, generated forest)
   *  Puzzle (melodyLock): the blackbirds whistle the lullaby at the bare flower
   *  bed; play it to them. Secret (realHour 18–21): supper at sundown, with a
   *  third bowl kept warm for someone on a train.
   * ========================================================================= */
  MORE('W194', {
    place: [{ id: 'm7_bed194', type: 'decor', at: 'random-any', look: 'flowers', lookOpt: { c: ['#e8e0c0'] }, solid: false,
        lines: [IF({ notSecret: 'm7_194_tune' }, 'A flower bed edged with river stones, freshly watered. Nothing in it has opened yet.'),
          IF({ notSecret: 'm7_194_tune' }, 'A stick at one end, written in pencil:'),
          IF({ notSecret: 'm7_194_tune' }, KN('오빠 꽃밭', 'Big brother’s flower bed')),
          IF({ notSecret: 'm7_194_tune' }, 'Every evening the blackbirds sit on the stones and whistle the same few notes at it,'),
          IF({ notSecret: 'm7_194_tune' }, 'as if teaching it something.'),
          IF({ secret: 'm7_194_tune' }, 'The flower bed is in bloom, white and yellow. It is ready for whoever comes on the next train.')] },
      { id: 'm7_chalkstone', type: 'decor', at: 'random-any', look: 'pebbles', solid: false, flat: true,
        lines: ['A flat stone by the path, chalked on by a child’s hand:', KN('저녁밥은 해 질 때. 진짜 해.', 'Supper is at sundown. The real sun.'), 'Under it, three little circles. Three bowls.'] },
      { id: 'm7_supper', type: 'decor', at: 'random-hidden', look: 'table', lookOpt: { cloth: '#e8dcc0' }, cond: { realHour: [18, 21] },
        lines: ['A low table set out in a sheltered corner at sundown: three bowls of barley rice, three spoons.', 'One bowl has a lid on it, to keep it warm. There are only two people here to eat.',
          'Nobody touches the third bowl. Nobody takes it in, either.'],
        use: [{ secret: 'm7_194_third_bowl' }] }],
    mech: [{ type: 'melodyLock', mark: 'm7_bed194', tune: YN.data.lullaby || '3232120', dist: 4, done: { secret: 'm7_194_tune' },
      winLines: ['You play the blackbirds’ notes over the bare flower bed.', 'Seventy years from now, an old woman will hum these notes to a child who cannot sleep,', 'and say she has no idea where she learnt them.',
        'Here. She learnt them here, from the birds, in a garden that was waiting.', 'The buds open all at once. Somewhere behind you, Ok-sun drops her watering can and claps.'],
      reward: [{ secret: 'm7_194_tune' }] }],
    rules: ['Puzzle: the blackbirds whistle the grandmother’s lullaby (the Garden’s tune) at a bare flower bed kept for Ok-sun’s brother. Play it beside the bed with the Melody (E03): it blooms — so that is where the lullaby came from.',
      'Secret: between 18:00 and 21:00 (real time) — supper “at sundown, the real sun”, says a chalked stone — a low table appears in a sheltered nook, with a third bowl kept warm for someone on a train.'] });

  /* =========================================================================
   *  W195 — The Kitchen of 1989 (P4)
   *  Puzzle (reach): wait on the doormat until it is very late — the last two
   *  minutes of the dream, or real midnight — and he comes home.
   *  Secret (bedroom window open): the kitchen window opens too.
   * ========================================================================= */
  var m195 = marksAt('W195', [
    { id: 'm7_frontdoor', at: [18, 1], type: 'decor', look: 'door', lookOpt: { style: 'metal', c: ['#6a6a62'] },
      lines: ['The front door of the flat, chain on. The peephole is at a grown-up’s height.', 'Footsteps go past in the corridor now and then. They always go past.'] },
    { id: 'm7_doormat', at: [18, 2], type: 'decor', look: 'scuff', solid: false, flat: true,
      lines: ['The doormat. She is not allowed to open the door, but she is allowed to stand here.'] },
    { id: 'm7_kclock', at: [12, 1], type: 'decor', look: 'wallclock',
      lines: ['The kitchen clock. On its face someone has drawn a little man in felt-tip,', 'at the very end of the dial, where the night runs out.',
        'The hands crawl towards him as slowly as the night does.'] },
    { id: 'm7_kwindow', at: [10, 1], type: 'decor', look: 'window',
      lines: ['The kitchen window, latched. It hasn’t been opened since the autumn; opening windows is a grown-up’s job.', 'It will open when a window somewhere else is left open. Windows are like that.'] },
    { id: 'm7_sill', at: [11, 1], type: 'decor', look: 'coin', solid: false, cond: { roomWindow: true },
      lines: ['Tonight the window stands open, like a window somewhere else. The ladybird has gone out into 1989.', 'Where it walked, on the sill: a coin, and a scrap of paper in hurried writing:',
        KS('미란아, 간식 사 먹어. 아빠가.', 'Mi-ran, buy yourself a snack. Love, Dad.')],
      use: [{ secret: 'm7_195_snack' }] }]);
  MORE('W195', {
    post: function (rows) { return m195(rows); },
    mech: [{ type: 'reach', zone: [18, 2, 18, 2], cond: { any: [{ remainingLt: 120 }, { realHour: [0, 1] }] }, failLine: 'Footsteps in the corridor. They go past.',
      done: { secret: 'm7_195_late' },
      winLines: ['A key in the lock. It takes three tries; the hand holding it is very tired.', 'A man in a suit, tie loosened, smelling of soju and cold air.', 'He sees the bowl under the plate and stands very still.',
        KS('…아직 안 잤어? 밥 식었지. 괜찮아, 아빠가 다 먹을게.', '…You’re still up? The rice has gone cold. It’s all right, Dad will eat it all.'),
        'He eats the cold rice standing up, in his coat, and says it is the best he has ever had.', 'Mi-ran pretends to be asleep at the table, smiling.'],
      reward: [{ secret: 'm7_195_late' }] }],
    rules: ['Puzzle: stand on the doormat by the front door (top right) when it is very late — in the last two minutes of the dream, or between midnight and one in the morning (real time); the felt-tip man at the end of the clock’s dial hints at it: her father comes home and eats the cold rice.',
      'Secret: if the bedroom window was left open, the kitchen window is open too; on the sill, a coin and a note from her father.'] });

  /* =========================================================================
   *  W196 — Nour’s Classroom (P4)
   *  Puzzle (stepOrder): Nour copied the map from her arm onto the floor in
   *  blue arrows; walk her way home, crossing by crossing.
   *  Secret (a revealing effect): every whisper, settled on the floor.
   * ========================================================================= */
  var ARW = function (id, at, lines) { return { id: id, at: at, type: 'decor', look: 'doodle', lookOpt: { c: ['#3a6ad8'] }, solid: false, flat: true, lines: lines }; };
  var m196 = marksAt('W196', [
    ARW('m7_a0', [22, 15], ['A little arrow in blue felt-tip on the floor beside the last desk, pointing up the aisle.', 'Next to it, very small: “start”.']),
    ARW('m7_a1', [22, 10], ['A blue arrow on the floor, pointing left.']),
    ARW('m7_a2', [14, 10], ['A blue arrow on the floor, pointing down.']),
    ARW('m7_a3', [14, 13], ['A blue arrow, pointing left, and a tiny zebra crossing drawn beside it.']),
    ARW('m7_a4', [6, 13], ['A blue arrow, pointing up, towards the front of the class.']),
    ARW('m7_a5', [6, 3], ['A tiny house in blue felt-tip, one window coloured in. Beside it: “home (for now)”.']),
    ARW('m7_x1', [18, 13], ['A blue arrow pointing up, crossed out: “old road — we moved”.']),
    ARW('m7_x2', [10, 7], ['A blue arrow pointing right, crossed out: “old address”.']),
    { id: 'm7_dust', at: [11, 2], type: 'decor', look: 'scuff', lookOpt: { c: ['#e8e8e0'] }, solid: false, flat: true,
      lines: ['Chalk dust on the floor under the board, much more than one lesson makes.', 'As if every word ever whispered in here had settled somewhere you cannot see.'] },
    { id: 'm7_whispers', at: [10, 11], type: 'decor', look: 'doodle', lookOpt: { c: ['#f0f0f0'] }, solid: false, flat: true, hiddenUntilReveal: true,
      lines: ['White letters on the floor, visible only now: every whisper this class ever made, piled up like dust.', 'Most of them are the same nasty word. One, very small, near the back, is different:',
        EN('sorry I laughed. I was scared they’d start on me.')],
      use: [{ secret: 'm7_196_whispers' }] }]);
  MORE('W196', {
    post: function (rows) { return m196(rows); },
    mech: [{ type: 'stepOrder', plates: { '22,15': 0, '22,10': 1, '14,10': 2, '14,13': 3, '6,13': 4, '6,3': 5, '18,13': 99, '10,7': 99 }, count: 6, color: 'rgba(110,150,255,0.9)',
      done: { secret: 'm7_196_way_home' },
      winLines: ['You stand on the little house. Her way home, drawn smaller, crossing by crossing.',
        'At the back of the class, Nour looks up from her arm, at the arrows, then at you,', 'as if someone had read her handwriting for the first time.'],
      reward: [{ secret: 'm7_196_way_home' }] }],
    rules: ['Puzzle: Nour has copied the map from her arm onto the floor in blue arrows. Starting beside her desk (“start”), walk from arrow to arrow in the direction each one points — up, left, down, left, up — to the little house near the front. Crossed-out arrows are old roads and send you back to the start.',
      'Secret: with a revealing effect (Glasses, AR Glasses…) used near the middle of the class, the whispers show on the floor; one of them is an apology. The chalk dust under the board hints at it.'] });

  /* =========================================================================
   *  W197 — The Platform Found Again (P4)
   *  Puzzle (sequence): six flowers between the rails, one planted each spring
   *  that mattered; water them in the order of her life.
   *  Secret: a sunken hollow at the east end of the rails leads under the
   *  platform, to the lost property of 1951 (and, if he stayed, his answer).
   * ========================================================================= */
  var FL = function (id, x, ko, en) { return { id: id, at: [x, 10], type: 'decor', look: 'flower', solid: false, lines: ['A flower between the sleepers, with a wooden tag in an old woman’s careful writing:', KS(ko, en)] }; };
  var m197 = marksAt('W197', [
    FL('m7_f4', 8, '딸이 프랑스 간 봄', 'The spring my daughter flew to France'),
    FL('m7_f1', 14, '남쪽에서 맞은 첫 봄', 'The first spring in the South'),
    FL('m7_f6', 20, '마지막 봄', 'The last spring'),
    FL('m7_f2', 26, '시집간 봄', 'The spring I married'),
    FL('m7_f5', 32, '손녀가 태어난 봄', 'The spring my granddaughter was born'),
    FL('m7_f3', 38, '딸이 태어난 봄', 'The spring my daughter was born'),
    { id: 'm7_wlist', at: [23, 6], type: 'decor', look: 'book', solid: false,
      lines: ['A little notebook left open on the platform: a watering list. One flower for every spring she waited.', 'At the top, underlined twice: “oldest first, or they sulk”.'] },
    { id: 'm7_sunk', at: [46, 12], type: 'decor', look: 'pebbles', solid: false, flat: true,
      lines: ['Between the last two sleepers the gravel has sunk into a hollow.', 'Cold air comes up through it, smelling of 1951.'] },
    { id: 'm7_under', at: [46, 14], type: 'trigger', lines: ['Under the platform: the lost property of a whole war, sorted by nobody.'], use: [{ secret: 'm7_197_under' }] },
    { id: 'm7_bundle', at: [44, 15], type: 'decor', look: 'crate', lookOpt: { c: ['#d8d0b8'] },
      lines: ['A refugee bundle tied up in a cotton sheet.', 'Inside: one bowl, one spoon, and a family register with a page torn out.'] },
    { id: 'm7_unsent', at: [48, 15], type: 'decor', look: 'letter',
      lines: ['A letter in a child’s hand, never posted:', KN('오빠, 다음 렬차는 언제 와?', 'Big brother, when is the next train?')] },
    { id: 'm7_reply', at: [47, 16], type: 'decor', look: 'letter', lookOpt: { c: ['#f0e8d0'] }, solid: false, cond: { quest: { Q01: ['stay', 'home'] } },
      lines: ['Under the child’s letter, a second sheet, in an old man’s careful pencil:', KN('지금 왔다. 칠십 년 늦었다. 미안하다, 옥순아.', 'Now. Seventy years late. I am sorry, Ok-sun.')],
      use: [{ secret: 'm7_197_reply' }] }]);
  MORE('W197', {
    fakeWalls: [[46, 13]],
    post: function (rows) { rows = padDown(rows, 4, '#'); rows = rect(rows, 44, 14, 5, 3, '.'); return m197(rows); },
    mech: [{ type: 'sequence', order: ['m7_f1', 'm7_f2', 'm7_f3', 'm7_f4', 'm7_f5', 'm7_f6'], passThrough: true,
      okLines: ['You pour a little water at its roots. The first spring drinks.', 'The second spring lifts its head.', 'The third. It smells of milk.', 'The fourth leans east, towards a country very far away.',
        'The fifth is the smallest, and the most stubborn.'],
      wrongLine: 'You water the wrong spring. Its tag turns away, politely: not that one yet.', doneLine: 'Every spring along the rails has had its water.',
      done: { secret: 'm7_197_springs' },
      winLines: ['You water the last spring last.', 'All along the rails the flowers lift their heads at once, as if a train were coming.',
        'Behind you, the old lady has stopped watering. She is counting the flowers on her fingers, and smiling.', KS('다 셌네. 한 해도 안 빠졌어.', 'All of them counted. Not a single year missed.')],
      reward: [{ secret: 'm7_197_springs' }] }],
    rules: ['Puzzle: six flowers grow between the rails, each with a tag naming a spring of the old lady’s life. Water them (interact) oldest first, as the notebook on the platform says: the first spring in the South, the spring she married, her daughter’s birth, her daughter leaving for France, her granddaughter’s birth, the last spring.',
      'Secret: at the east end of the rails, a sunken hollow between the last sleepers can be walked through, down under the platform: the lost property of 1951. If Mr. Ahn chose to stay, his answer lies under the child’s letter.'] });

  /* =========================================================================
   *  W198 — The Dreamt Terrace (P4)
   *  Puzzle (lampsAll): four candles on the parapet, each answered by a window
   *  across the street; light all four before one goes out.
   *  Secret (Watering Can, then another night): the pot labelled “yours”.
   * ========================================================================= */
  var CANDLE = function (id, x) { return { id: id, at: [x, 1], type: 'decor', look: 'candle', lines: ['A candle in a jam jar on the parapet, unlit.', 'Across the street, one dark window, as if waiting to see whether you will.'] }; };
  var watered = function () { return YN.save.flag('m7_198_watered'); };
  var bloomed = function () { var w = watered(); return !!w && !!YN.save.dream && nightNo() > w; };
  var m198 = marksAt('W198', [CANDLE('m7_c0', 4), CANDLE('m7_c1', 9), CANDLE('m7_c2', 14), CANDLE('m7_c3', 20),
    { id: 'm7_yours', at: [22, 12], type: 'decor', look: 'pot',
      lines: [IF({ not: { fn: watered } }, 'A bare pot in the corner, with a label in pencil: “yours”. The soil is as dry as chalk.'),
        IF({ fn: function () { return !!watered() && !bloomed(); } }, 'The soil in the pot labelled “yours” is dark and damp. Nothing has come up. Not tonight.'),
        IF({ fn: bloomed }, 'In the pot labelled “yours”, two green leaves have come up while you were awake.')],
      onEffect: { E35: [{ if: { not: { fn: bloomed } }, fn: function () { if (!watered()) YN.save.setFlag('m7_198_watered', nightNo() || 1); },
        lines: ['You water the pot labelled “yours”. The soil drinks it all at once, as if it had been thirsty for years.', 'Nothing happens. Nothing ever blooms on the same night.'] }, { reeval: true }] } },
    { id: 'm7_shoot', at: [21, 12], type: 'decor', look: 'sprout', solid: false, cond: { fn: bloomed },
      lines: ['A shoot beside the pot labelled “yours”: two leaves, very green, come up between one night and the next.', 'It did not wait to be told it was allowed.'],
      use: [{ secret: 'm7_198_yours' }] }]);
  MORE('W198', {
    post: function (rows) { return m198(rows); },
    mech: [{ type: 'lampsAll', lamps: ['m7_c0', 'm7_c1', 'm7_c2', 'm7_c3'], time: 9, light: 2, done: { secret: 'm7_198_windows' },
      litLines: ['The candle catches. Across the street, a window lights up in answer.', 'Another jar, another window, further off.', 'Behind you, the first candle gutters. Somebody over there is getting sleepy.'],
      onLine: 'It is still burning.', doneLine: 'The four candles burn by themselves now. Across the street, four windows stay lit.',
      winLines: ['Four candles on the parapet, four windows across the street, all lit at once.', 'In one window someone lifts a hand. In another someone puts a kettle on. Nobody is keeping watch alone.',
        'The Keeper of Pots does not look up from her watering. She says, to the soil:', EN('There. You see? Morning comes quicker with company.')],
      reward: [{ secret: 'm7_198_windows' }] }],
    rules: ['Puzzle: light the four candles in jam jars along the top parapet; each lit candle is answered by a window across the street, but goes out after about nine seconds. Light all four before the first goes out.',
      'Secret: water the bare pot labelled “yours” in the bottom-right corner with the Watering Can (E35). Nothing happens that night; on a later night, a shoot has come up beside it.'] });

  /* =========================================================================
   *  W199 — The Nest (P4)
   *  Puzzle (push): three eggs have rolled away from the warm middle; push
   *  them back into their hollows. Secret: a thread runs off the east rim
   *  over nothing (fake void cells) to a little nest — her mother’s, when the
   *  bedroom door has been left ajar.
   * ========================================================================= */
  var EGG = function (id, at) { return { id: id, at: at, type: 'decor', look: 'egg', solid: true, lines: ['An egg that has rolled away from the warm middle of the nest. It is getting cold.'] }; };
  var HOL = function (id, at) { return { id: id, at: at, type: 'decor', look: 'scuff', lookOpt: { c: ['#e8d8c0'] }, solid: false, flat: true, lines: ['A hollow in the warm middle of the nest, exactly the size of an egg, and empty.'] }; };
  var KEEP = function (id, at) { return { id: id, at: at, type: 'decor', look: 'tuft', lookOpt: { c: ['#d8c8b0'] }, solid: false, flat: true, noInteract: true, decal: true }; };
  var m199 = marksAt('W199', [EGG('m7_e0', [9, 14]), EGG('m7_e1', [20, 14]), EGG('m7_e2', [14, 19]),
    HOL('m7_h0', [12, 14]), HOL('m7_h1', [17, 14]), HOL('m7_h2', [14, 16]),
    KEEP('m7_k0', [8, 14]), KEEP('m7_k1', [10, 14]), KEEP('m7_k2', [11, 14]), KEEP('m7_k3', [21, 14]), KEEP('m7_k4', [19, 14]), KEEP('m7_k5', [18, 14]),
    KEEP('m7_k6', [14, 20]), KEEP('m7_k7', [14, 18]), KEEP('m7_k8', [14, 17]),
    { id: 'm7_thread199', at: [27, 14], type: 'decor', look: 'tuft', lookOpt: { c: ['#f0f0f0'] }, solid: false, flat: true,
      lines: ['A single thread runs out of the weave here and off into the empty sky,', 'pulled tight, as if something at the other end were holding on.'] },
    { id: 'm7_tuft', at: [35, 13], type: 'decor', look: 'towel', solid: false,
      lines: ['The end of the thread: a scrap of towel caught on nothing, at the edge of the sky.', 'From here you see the nest the way someone looking in through a door left ajar would see it.'] },
    { id: 'm7_tunicnest', at: [35, 14], type: 'decor', look: 'nest', cond: { roomDoor: true },
      lines: ['A small nest made of a night-shift tunic rolled into a ring. The name tag is still pinned on: KIM MI-RAN.',
        'In the middle, folded small, a child’s drawing of a big white bird keeping watch over a sleeping girl.', 'On the back, in a grown-up’s hand: “thank you for watching her when I can’t”.'],
      use: [{ secret: 'm7_199_tunic' }] }]);
  MORE('W199', {
    fakeWalls: [[28, 14, 6, 1]],
    post: function (rows) { rows = padRight(rows, 8, ' '); rows = rect(rows, 34, 13, 3, 3, '.'); return m199(rows); },
    mech: [{ type: 'push', blocks: ['m7_e0', 'm7_e1', 'm7_e2'], plates: ['m7_h0', 'm7_h1', 'm7_h2'], sfx: 'step_wood', done: { secret: 'm7_199_eggs' },
      winLines: ['The last egg rolls into its hollow and settles, warm.', 'The Great Laundry Bird opens one eye, counts, and closes it again.', 'Nothing falls here. Nothing rolled away tonight, either.'],
      reward: [{ secret: 'm7_199_eggs' }] }],
    rules: ['Puzzle: three eggs have rolled away from the warm middle of the nest (west, east and south of it). Push each one (walk into it) back into the empty hollow beside the middle.',
      'Secret: on the east rim, a thread runs off into the sky: the air along it holds you. At its end, a scrap of towel; and if the bedroom door at home was left ajar, a little nest made of her mother’s night-shift tunic.'] });

  /* =========================================================================
   *  W200 — The Dream Archives (P4)
   *  Puzzle (quiz): the reader’s card asks four questions about the dreams.
   *  Secret (having met Nour): a card slides out of the index.
   * ========================================================================= */
  var m200 = marksAt('W200', [
    { id: 'm7_readercard', at: [20, 25], type: 'decor', look: 'clipboard', lines: ['A reader’s card on the catalogue desk.'] },
    { id: 'm7_noshelf', at: [18, 5], type: 'decor', look: 'book', lookOpt: { c: ['#e8e0c8'] }, solid: false, cond: { secret: 'm7_200_reader' },
      lines: ['A gap on the shelf, exactly one diary wide, with a new label: “S. — still being written. Do not shelve.”', 'Beside it, a pencil, sharpened at both ends.'],
      use: [{ secret: 'm7_200_gap' }] },
    { id: 'm7_nourcard', at: [22, 25], type: 'decor', look: 'letter', solid: false, cond: { met: 'N008' },
      lines: ['A card has slid half out of the index, as if it wanted to be found: NOUR.', 'Under “last seen”, someone has crossed out “moved away” and written, in blue felt-tip: “remembered”.'],
      use: [{ secret: 'm7_200_nour' }] }]);
  MORE('W200', {
    post: function (rows) { return m200(rows); },
    mech: [{ type: 'quiz', mark: 'm7_readercard', done: { secret: 'm7_200_reader' }, doneLine: 'The card says READER. It is yours to keep.',
      intro: ['“To borrow from the Archives, answer four questions about the dreams. The Archives do not lend to strangers.”'],
      questions: [{ q: 'How many beds wait round the middle one, in the sixth layer?', choices: ['Five', 'Six', 'Seven', 'Eight'], right: 2 },
        { q: 'What time does the last train run?', choices: ['23:59', '00:00', '23:71', 'It never runs'], right: 2 },
        { q: 'Which number is on the letterbox that matters?', choices: ['404', '1204', '107', '1989'], right: 1 },
        { q: 'Who is still watering, in a garden in the South?', choices: ['Mi-ran', 'Ok-sun', 'Sora', 'Nobody'], right: 1 }],
      failLine: 'A small red stamp: NOT YET. The card wipes itself clean. Look around the dreams a little longer.',
      winLines: ['The card is stamped READER.', 'Under it, in faded ink: “Welcome back. You have been here more often than you think.”', 'Near the top of the first aisle, a gap you had not noticed has been given a label.'],
      reward: [{ secret: 'm7_200_reader' }] }],
    rules: ['Puzzle: the reader’s card on the catalogue desk (by the card index, at the bottom) asks four questions about the dreams: seven beds; the 23:71; letterbox 1204; Ok-sun. All four right: a labelled gap appears on a shelf near the top — the place for her own diary.',
      'Secret: once you have met Nour, a card with her name slides out beside the card index.'] });
})(typeof window !== 'undefined' ? window : globalThis);
