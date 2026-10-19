/* =========================================================================
 *  NEW WORLDS (8) — W341 to W360: "The Inside of Things"
 *  Small enough at last, she goes inside the objects of the bedroom and of
 *  the flat: the bedside drawer (the hub, reached with Tiny), Grandmother's
 *  music box and its comb, drum and dancer, the washing machine, the pocket
 *  of the mother's tunic and her handbag, the voicemail inside her phone,
 *  an old television and its test card, the rice cooker, the lunchbox, the
 *  kimchi jar, a snow globe, a piggy bank, a seashell, the bedside bulb, a
 *  biscuit tin full of needles, and a plush.
 *  Through-lines:
 *   · mending the music box: the comb (W343) + the drum (W344) + the spring
 *     wound in W342 open the dancer (W345), who gives the Wind-Up Key;
 *   · the Lost Button: met in the drawer, the tin and the wash, it finds its
 *     other half in the handbag's zipped pocket (W355);
 *   · the mother's night: the list in the pocket (W347) -> the phone in the
 *     handbag (W355) -> one word left on her voicemail (W358).
 *  Effects E243–E248, inhabitants N1800–N1855.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* a soul: a fragment of memory, said once, then undone */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* adds a door to an already defined world (placed at random, then made reachable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  function fill(g, pts, ch) { pts.forEach(function (p) { g.set(p[0], p[1], ch); }); return g; }
  /* repaints, inside an ellipse, only the cells that already hold `from` */
  function paint(g, cx, cy, rx, ry, from, to) {
    for (var y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (var x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      var dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1 && g.at(x, y) === from) g.set(x, y, to);
    }
    return g;
  }
  /* is it snowing in the dream she is in right now? (the Shaken Snow, or any weather effect) */
  function snowing() { var rt = YN.game && YN.game.rt; return !!(rt && rt.weather && rt.weather.snow); }
  var BTN = { t: 'blob', c: ['#6a6a72'], h: 9 }; // the Lost Button, a grey coat button
  var ALLBTN = { flag: ['btn_1', 'btn_2', 'btn_3'] };

  /* ---------------------------------------------------------------
   *  Effects E243–E248
   * --------------------------------------------------------------- */
  [{ id: 'E243', name: 'Wind-Up Key', fam: 'music box', world: 'W345', icon: { glyph: '⌘', c: '#d0a850' }, action: 'knob',
     desc: 'Brass, still warm from a hand much older than yours. Three turns, never four.',
     use: 'Turns handles and winds what has run down: a music box lid, a snow globe’s base, a toy’s music box (F).',
     get: 'Dance with the little nurse in the Dancer’s Mirror, once the music box has been mended.' },
   { id: 'E244', name: 'Odd Sock', fam: 'laundry', world: 'W346', icon: { glyph: 'ʃ', c: '#d86a7a' }, action: 'decoy', caps: ['scarf'],
     desc: 'Striped, warm, alone. Its other half is somewhere warm too.',
     use: 'Throw it: whatever listens goes to it. Warm feet don’t slip on ice. Someone in a pocket awaits it (F).',
     get: 'Match every pair of socks in the Washing Machine on Spin: the one left over is yours.' },
   { id: 'E245', name: 'Afterglow', fam: 'television', world: 'W348', icon: { glyph: '◎', c: '#90f0c8' }, action: 'glow', light: 2.2,
     desc: 'The last picture the screen showed, still printed on your eyes.',
     use: 'A pale phosphor glow you switch on and off (F). Burnt-out things show their doors to it.',
     get: 'Light the red, green and blue dots together inside the Old Television.' },
   { id: 'E246', name: 'Puff of Steam', fam: 'kitchen', world: 'W349', icon: { glyph: '♨', c: '#f4f0e8' }, action: 'float',
     desc: 'It smells of rice that was kept warm for someone all day.',
     use: 'Rise a little and drift over water, soup, brine and gaps (F).',
     get: 'Say the words you say before a meal to the Rice Cooker.' },
   { id: 'E247', name: 'Shaken Snow', fam: 'keepsake', world: 'W351', icon: { glyph: '❄', c: '#e0f0ff' }, action: 'weather',
     desc: 'A flake that never melts, from a globe brought back from Seoul.',
     use: 'Changes the weather of the dream: clear, rain, snow (F). Snow on a screen hides a door.',
     get: 'Stand still in the Snow Globe from Seoul until the snow settles.' },
   { id: 'E248', name: 'Bead Phone Charm', fam: 'mother', world: 'W355', icon: { glyph: '∴', c: '#f0a0c0' }, action: 'ring',
     desc: 'Plastic beads on a string: 소, 라, a heart, a star. Made at school, hung on a phone, never taken off.',
     use: 'It jingles: whoever is near turns towards you, and old machines that answer to bells wake up (F).',
     get: 'Unlock the phone inside the Mother’s Handbag.' }
  ].forEach(function (e) { YN.data.effects.push(Object.assign({ ground: false, core: false }, e)); });

  Object.assign(YN.data.notes, {
    n_photo_1980: { t: 'Under the velvet of the music box: Grandma, young, holding a baby. “1980. 미란.” It was Mum.' },
    n_button_pair: { t: 'The day he left, Mum held on to his coat. Two buttons came off. She kept one in her bag, six years.' },
    n_pocket_list: { t: 'Mum’s list, after the wash: milk, rice, call Sora, sleep. “Call Sora” was underlined twice.' },
    n_pig_wish: { t: 'I was saving up to buy Mum a day off. 13,400 won. Not enough for a day.' },
    n_lunch_note: { t: 'Under the soup there was a second note: you don’t have to eat it all. She knew.' },
    n_voicemail_word: { t: 'I left Mum a message. One word, out loud, in my own voice.' },
    n_kimchi_recipe: { t: 'Grandma’s recipe: don’t rush. Flavour comes to whoever waits.' }
  });

  /* ---------------------------------------------------------------
   *  W341 — The Bedside Drawer (the hub, P3)
   * --------------------------------------------------------------- */
  S({ id: 'W341', name: 'The Bedside Drawer', depth: 3, tier: 'mid', back: 'W154', backLook: 'door', backOpt: { style: 'wood', c: ['#6a4a30'] }, backLabel: 'back out through the skirting board', backAt: [24, 26],
    map: (function () {
      var g = K.grid(48, 28, ' '); g.box(0, 0, 48, 28, '#', '.');
      g.rect(2, 2, 13, 6, ','); g.rect(28, 18, 15, 7, ',');
      fill(g, [[9, 12], [10, 12], [20, 6], [21, 6], [33, 9], [34, 9], [12, 21], [13, 21], [41, 14]], '{');
      fill(g, [[24, 13], [25, 13], [24, 14], [25, 14], [6, 18], [7, 18], [35, 2], [36, 2]], '}');
      fill(g, [[16, 16], [30, 4], [43, 22], [4, 24]], 'o');
      g.vline(40, 1, 5, '#'); g.hline(40, 46, 5, '#'); g.rect(41, 1, 6, 4, ','); g.set(40, 3, '?'); // the false lining
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#9a7450', '#86603e', '#aa845c'] }, floor2: { p: 'paper', c: ['#e8e0cc', '#d4ccb4'] }, wall: { p: 'plank', c: ['#4a301c', '#3a2414', '#5a3e26'], topColor: '#3a2414' },
      wallface: { p: 'panel', c: ['#6a4a2e', '#5a3e24', '#3a2414'], skirt: '#2a1a0c' }, secret: { p: 'plank', c: ['#4a301c', '#3a2414', '#5a3e26'] } },
    tall: { '{': { look: 'barrel', opt: { c: ['#2a2a30', '#c8a040'] } }, '}': { look: 'crate', opt: { c: ['#b84a30'] } }, o: { look: 'coin' } },
    style: { tallWalls: true }, music: 'beddrawer', amb: { type: 'clock', vol: 0.04 }, dark: 0.35, weather: { dust: true },
    doors: [{ to: 'W342', at: [5, 3], look: 'musicbox', label: 'a music box, its lid shut since 2023' },
      { to: 'W351', at: [14, 25], look: 'glass', label: 'a snow globe lying on its side' },
      { to: 'W352', at: [45, 13], look: 'pot', opt: { c: ['#f0a8b8'] }, label: 'a pink china pig with a slot in its back' },
      { to: 'W353', at: [32, 21], look: 'shell', label: 'a seashell, its mouth turned towards you' },
      { to: 'W356', at: [26, 2], look: 'cookiejar', label: 'a blue biscuit tin, far too heavy for biscuits' },
      { to: 'W354', at: [1, 14], look: 'ladder', label: 'the lamp cord, climbing up the back of the drawer' }],
    decor: [{ look: 'coin', n: 3, lines: ['A 500-won coin, lying flat. The crane on it flies towards the wall.', 'A coin from 2008, the year someone arrived in this country with one suitcase.', 'A coin balanced on its edge. It has been about to fall for years.'] },
      { look: 'clock', n: 1, lines: ['A wristwatch with a cracked face, lying on its back. It still ticks. It has nowhere to be.'] },
      { look: 'letter', n: 2, lines: ['A receipt, curled like a wave: “24h — 02:14 — triangle kimbap, banana milk”.', 'A permission slip for a school trip. The line for a parent’s signature is empty.'] },
      { look: 'trinket', n: 1, lines: ['A yellow hair clip. It holds nothing back any more.'] },
      { look: 'drawing', n: 1, lines: ['A drawing folded into eight: a block of flats at night, every window dark but one.'] },
      { look: 'crumbs', n: 2, solid: false, lines: ['Biscuit crumbs, as big as stones down here. Someone ate in bed, in secret, very quietly.'] }],
    place: [{ id: 'tooth', type: 'decor', at: [9, 4], look: 'letter', lookOpt: { c: ['#f0e8d8'] }, cond: { flag: 'drawer_swept' }, use: [{ secret: 'milk_tooth' }],
        lines: ['An envelope the size of a stamp. Inside, a milk tooth.', 'On the envelope, in her grandmother’s hand: “소라 이빨, 일곱 살”. Sora’s tooth, aged seven.'] },
      { id: 'sparekey', type: 'decor', at: [44, 2], look: 'keyring', use: [{ secret: 'drawer_spare_key' }],
        lines: ['Behind the paper, in the corner nobody cleans: the spare key to the flat, on a red ribbon.', 'Taped beside it, a note: “소라 열쇠. 잃어버리지 마.” Sora’s key. Don’t lose it.', 'She used it every day after school, to let herself into a flat where someone was asleep.'] },
      SOUL([EN('Everything in a drawer is kept for later. Later never comes to open it.')])],
    signs: [{ at: [38, 2], lines: [EN('The paper lining is thinnest in the far corner. Eyes that see through things would find the gap.')] },
      { at: [22, 24], lines: [EN('Dust runs from feet that hurry. Walk slowly, and it waits for you.')] }],
    npcs: [{ id: 'N1800', name: 'The Lost Button', look: BTN, behavior: 'wander', radius: 5, speed: 0.8, solid: false, passThrough: true,
        lines: [{ if: { notFlag: 'btn_1' }, seq: [EN('Oh! A face. Sorry, I’m a button. I fell off a coat.'), EN('A big grey coat, by the front door. The day of the suitcase.'), 'It rolls a little circle around you, on its edge.'], do: [{ set: { btn_1: true } }] },
          EN('Four holes. A bit of grey thread still in one. That’s how you know I was sewn on once.'),
          EN('If you ever see a coat with a button missing, tell it I’m here. Tell it I waited.'),
          EN('I roll everywhere. Into drawers, into tins, into the wash. Buttons get around.')] },
      { id: 'N1801', name: 'A Dust Bunny', tag: 'dust', look: { t: 'blob', c: ['#a8a4a0'], h: 8 }, behavior: 'flee', fleeDist: 3, radius: 4, speed: 1, solid: false, passThrough: true, lines: ['A grey tuft that was swept under the bed and walked here on its own.'] },
      { id: 'N1802', name: 'A Dust Bunny', tag: 'dust', look: { t: 'blob', c: ['#b4b0aa'], h: 7 }, behavior: 'flee', fleeDist: 3, radius: 4, speed: 1, solid: false, passThrough: true, lines: ['A ball of dust and one long black hair. It trembles.'] },
      { id: 'N1803', name: 'A Dust Bunny', tag: 'dust', look: { t: 'blob', c: ['#9a968e'], h: 8 }, behavior: 'flee', fleeDist: 3, radius: 4, speed: 1, solid: false, passThrough: true, lines: ['A dust bunny with a biscuit crumb stuck in it, like a jewel.'] },
      { id: 'N1804', name: 'A Dust Bunny', tag: 'dust', look: { t: 'blob', c: ['#c0bcb4'], h: 6 }, behavior: 'flee', fleeDist: 3, radius: 4, speed: 1, solid: false, passThrough: true, lines: ['The smallest dust bunny. It has been under the bed the longest.'] },
      { id: 'N1805', name: 'A Curled Receipt', look: ghost('rgba(240,234,214,0.8)', 14), behavior: 'wander', radius: 3, speed: 0.4, solid: false,
        lines: [EN('Two fourteen in the morning. Triangle kimbap, banana milk. Paid in coins, counted twice.'), EN('I remember every price. Nobody ever asks me anything else.')] }],
    mech: [{ type: 'catchN', tag: 'dust', n: 4, noRun: true, runLine: 'The dust bunnies scatter at the sound of running feet.', countText: 'Dust bunnies: # / %', done: { flag: 'drawer_swept' },
      winLines: ['The last dust bunny lets itself be caught.', 'The four of them roll together into one soft grey ball, and the ball rolls away under the lining.', 'Where they were hiding, under the paper, something small has been uncovered.'],
      reward: [{ set: { drawer_swept: true } }] }],
    info: { summary: 'Inside the bedside drawer, at the size of a crumb: coins, batteries, receipts, and doors into things.',
      rules: ['Entered by a matchbox-sized door in the Corridor Longer on the Inside, with Tiny (E13) equipped.', 'Catch the four dust bunnies by walking (they scatter if you run).', 'They uncover a milk tooth in an envelope, in the lining at the top left.', 'From here: music box, snow globe, piggy bank, seashell, biscuit tin, and the lamp cord up to the bulb.'],
      secrets: ['The paper lining in the north-east corner is a false wall (Glasses, or any revealing effect).', 'Behind it: the spare key to the flat.'],
      lore: 'Everything kept in a drawer is kept for later. Later is where the inside of things begins.' } });
  link('W154', { to: 'W341', look: 'door', lookOpt: { style: 'wood', c: ['#6a4a30'] }, cond: { equipped: 'E13' }, label: 'a door the size of a matchbox, low in the skirting board',
    locked: 'A door the size of a matchbox, low in the skirting board. She would have to be very, very small.' });

  /* ---------------------------------------------------------------
   *  W342 — Inside the Music Box
   * --------------------------------------------------------------- */
  S({ id: 'W342', name: 'Inside the Music Box', depth: 4, tier: 'hard', back: 'W341', backLook: 'musicbox', backLabel: 'up and out through the lid', backAt: [18, 24],
    map: (function () { var g = K.grid(36, 26, ' '); g.box(0, 0, 36, 26, '#', ','); g.rect(3, 3, 30, 20, '.'); g.rect(16, 11, 4, 4, '%'); return g.rows(); })(),
    look: { floor: { p: 'metal', c: ['#b89448', '#a08038', '#c8a458'] }, floor2: { p: 'carpet', c: ['#8a1a2a', '#6a1020', '#a83040'] }, wall: { p: 'flat', c: ['#4a2a18', '#3a2010'], topColor: '#3a2010' },
      wall2: { p: 'metal', c: ['#d8b060', '#b89040', '#f0d080'] }, wallface: { p: 'panel', c: ['#5a3420', '#4a2a18', '#2a1408'], skirt: '#8a1a2a' } },
    style: { tallWalls: true }, music: 'musicboxinside', amb: { type: 'musicbox', vol: 0.03 }, dark: 0.4,
    doors: [{ to: 'W343', at: [1, 12], look: 'chime', label: 'between the steel teeth of the comb' },
      { to: 'W344', at: [34, 12], look: 'wheel', label: 'onto the drum and its pins' },
      { to: 'W345', at: [18, 1], look: 'stairs', label: 'a spiral stair up to the dancer', cond: { all: [{ flag: ['ib_comb', 'ib_drum'] }, { tempGte: { ib_wind: 12 } }] },
        locked: 'The stair to the dancer is slack. A box that cannot play cannot be climbed: a tooth, a pin, three turns.' }],
    decor: [{ look: 'wheel', n: 2, lines: ['A brass cog as big as a cartwheel. One tooth is worn smooth by the same song, every night, for years.'] },
      { look: 'sparkle', n: 3, solid: false, lines: ['A grain of dust, lit from inside like a star. Nobody has opened the lid for a long time.'] },
      { look: 'curtain', n: 1, lines: ['The red velvet lining, threadbare in one spot, where a finger always rested to hold the lid.'] },
      { look: 'letter', n: 1, lines: ['A sticker on the inside of the lid, in a child’s writing: “할머니 거”. Grandma’s.'] }],
    place: [{ id: 'spring', type: 'decor', at: [18, 15], look: 'wheel', lookOpt: { c: ['#d8b060'] },
        lines: [{ if: { tempGte: { ib_wind: 12 } }, t: 'The mainspring is wound tight. It hums one note, waiting to be let go.' },
          { if: { not: { tempGte: { ib_wind: 12 } } }, t: 'The mainspring, slack as a sleeping snake. The last hand that wound it was much older than hers.' }] },
      { id: 'lidlock', type: 'decor', at: [30, 1], look: 'drawer', lookOpt: { c: ['#c8a050'] }, lines: ['A tiny brass lock on the inside of the lid, with a keyhole shaped like a clover. Something is kept behind it.'],
        onEffect: { E243: [{ secret: 'mb_compartment' }, { note: 'n_photo_1980' }, { show: 'compartment' }, { sfx: 'reveal' }, { msg: 'The key turns three times. Under the velvet, a little flap lifts.' }] } },
      { id: 'compartment', type: 'decor', at: [28, 1], look: 'photo', cond: { secret: 'mb_compartment' },
        lines: ['A photo, folded in four, hidden under the velvet.', 'A young woman holding a baby, in front of this very music box.', 'On the back, in pencil: “1980. 미란.”'] },
      SOUL([KS('자장자장 우리 아기, 잘도 잔다 우리 아기.', 'Hush-a-bye, my baby, how soundly my baby sleeps.')]),
      SOUL([EN('She wound it every night, three turns, and fell asleep before the song did.')])],
    signs: [{ at: [8, 20], lines: [EN('Round the spring, the way her hand went. Three times round, last of all. Then the song can climb.')] }],
    npcs: [{ id: 'N1806', name: 'The Governor', look: H({ t: 'robot', body: 'suit', c: ['#c8a050', '#a08038', '#e8d090', '#3a2a10'], h: 15 }), behavior: 'static', solid: true, at: [26, 18],
        lines: [EN('I am the governor. Not too fast, not too slow. That is my whole job. Nobody thanks the governor.'), EN('When she wound it, the song lasted exactly one goodnight. I saw to that.'),
          EN('Since then I have regulated silence. It is very easy. It is very boring.'), EN('Mend the tooth. Mend the drum. Wind the spring last. Then I will have something to do again.')] },
      { id: 'N1807', name: 'A Brass Mite', count: 3, look: { t: 'ant', c: ['#c8a050'], h: 6 }, behavior: 'wander', radius: 4, speed: 0.6, solid: false,
        lines: ['A mite polishing a single pin with its whole body. It has polished this pin every day since the lid closed.', 'A mite carrying a speck of rust away, very seriously, as if it were a coffin.'] }],
    mech: [{ type: 'laps', center: [18, 13], key: 'ib_wind' }],
    info: { summary: 'The inside of Grandmother’s music box: a brass floor, red velvet walls, the mainspring coiled in the middle.',
      rules: ['Walk three times round the mainspring (twelve quarter turns, either way) to wind it.', 'The count is lost when you leave, so wind it last.', 'The stair to the dancer (W345) needs the comb (W343) and the drum (W344) mended, and the spring wound.'],
      secrets: ['The Wind-Up Key (E243), used on the little lock inside the lid, opens a compartment: a photo from 1980.'],
      lore: 'The box has stayed shut since the grandmother died. The lullaby is still inside it, in pieces.' } });

  /* ---------------------------------------------------------------
   *  W343 — The Steel Comb
   * --------------------------------------------------------------- */
  S({ id: 'W343', name: 'The Steel Comb', depth: 4, tier: 'hard', back: 'W342', backLook: 'door', backOpt: { style: 'metal', c: ['#b89448'] }, backLabel: 'back under the comb, into the box', backAt: [22, 18],
    map: (function () {
      var g = K.grid(44, 20, ' '); g.box(0, 0, 44, 20, '#', '.');
      [6, 14, 22, 30, 38].forEach(function (x) { g.vline(x, 1, 10, '%'); });
      g.text(39, 1, ['xx..', '.x.x', '...x', 'x.xx', '..x.', 'x...', '.xx.', '....']); // where the song never goes
      return g.rows();
    })(),
    look: { floor: { p: 'metal', c: ['#8a8a94', '#7a7a84', '#9a9aa4'] }, wall: { p: 'flat', c: ['#2a2a32', '#1a1a22'], topColor: '#2a2a32' }, wall2: { p: 'metal', c: ['#d8dce8', '#b0b4c0', '#f0f4ff'] },
      wallface: { p: 'panel', c: ['#3a3a44', '#2a2a34', '#1a1a22'], skirt: '#b89448' } },
    style: { tallWalls: true }, music: 'steelcomb', amb: { type: 'glass', vol: 0.04 }, dark: 0.45, extra: { noFurnish: true },
    place: [{ id: 't0', type: 'decor', at: [6, 11], look: 'chime', lines: ['The first tooth, the longest. Do.'] },
      { id: 't1', type: 'decor', at: [14, 11], look: 'chime', lines: ['The second tooth. Re.'] },
      { id: 't2', type: 'decor', at: [22, 11], look: 'chime', lines: ['The third tooth. Mi.'] },
      { id: 't3', type: 'decor', at: [30, 11], look: 'chime', lines: ['The fourth tooth. Sol.'] },
      { id: 't4', type: 'decor', at: [38, 11], look: 'chime', lookOpt: { c: ['#8a8a94'] }, lines: ['The fifth tooth, bent sideways. No song in this box ever needed it.'] },
      { id: 'oldtooth', type: 'decor', at: [42, 1], look: 'glint', use: [{ secret: 'comb_sixth_tooth' }],
        lines: ['A sixth tooth, snapped off long ago and hidden here, where the song never goes.', 'Scratched into it, very small, in a child’s hand: 옥순.'] },
      SOUL([EN('She hummed the low part herself. The box only ever had the high notes.')])],
    signs: [{ at: [18, 16], lines: [EN('Listen first. The comb remembers the song better than anyone. Then strike where it sang.')] },
      { at: [40, 12], lines: [EN('Where the song never goes, walk as if you already knew the way.')] }],
    decor: [{ look: 'glint', n: 4, solid: false, lines: ['A curl of steel filing, fine as a hair.', 'A drop of old oil, gone hard and amber.'] },
      { look: 'scuff', n: 2, solid: false, lines: ['Written on the base in pencil: 1, 2, 3, 4, 5. The 5 is crossed out.'] },
      { look: 'sparkle', n: 2, solid: false, lines: ['A note that was played years ago is still hanging in the air here, very thin.'] }],
    npcs: [{ id: 'N1808', name: 'The Tuning Fork', look: H({ t: 'tall', head: 'blank', body: 'robe', c: ['#d8dce8', '#b0b4c0', '#e8e8f0', '#3a3a44'], eyes: 'closed', mouth: 'o', h: 26 }), behavior: 'static', solid: true, at: [26, 16],
        lines: [EN('Every tooth has one note. It doesn’t get to choose. Neither do I.'), EN('When the box is quiet, the comb still hums the order, one tooth at a time. Watch for the little notes.'),
          EN('Strike them in the order they hum. Get one wrong and the comb shivers, and you start again.')] },
      { id: 'N1809', name: 'A Humming Mote', count: 4, look: { t: 'jelly', c: ['rgba(230,230,255,0.7)'], h: 7, glow: '#e0e0ff' }, light: 1, behavior: 'fly', radius: 6, speed: 0.4, solid: false, lines: ['A mote of dust humming one note, slightly flat.'] }],
    mech: [{ type: 'sequence', order: ['t3', 't2', 't3', 't2', 't1', 't2', 't0'], passThrough: true, ring: { every: 1.3, pause: 5, hear: 40, sfx: 'chime', glyph: '♪', color: '#e8e8ff' },
      done: { flag: 'ib_comb' }, doneLine: 'The comb hums the whole lullaby under its breath.',
      winLines: ['The last tooth rings on and on.', 'For a moment all the teeth sing the lullaby together, and the box is not silent any more.', KS('자장자장…', 'Hush-a-bye…')],
      reward: [{ set: { ib_comb: true } }] }],
    info: { summary: 'The comb of the music box, seen from between its teeth: five steel tines as tall as trees.',
      rules: ['While the box is quiet, a little note (♪) lights over the teeth one after another.', 'Strike them in that order: fourth, third, fourth, third, second, third, first (the lullaby).', 'Mends the comb for the dancer’s stair in the music box.'],
      secrets: ['Right of the last tooth, an invisible maze leads to a sixth tooth, snapped off and hidden.'],
      lore: 'The comb plays only the high notes. Someone always hummed the rest.' } });

  /* ---------------------------------------------------------------
   *  W344 — The Pinned Drum
   * --------------------------------------------------------------- */
  S({ id: 'W344', name: 'The Pinned Drum', depth: 4, tier: 'hard', back: 'W342', backLook: 'door', backOpt: { style: 'metal', c: ['#b89448'] }, backLabel: 'back off the drum', backAt: [17, 20],
    map: (function () {
      var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.');
      fill(g, [[4, 4], [12, 8], [13, 17], [20, 7], [29, 16], [30, 3], [5, 17], [21, 19], [3, 11], [31, 9], [15, 3], [11, 13]], 'o');
      return g.rows();
    })(),
    look: { floor: { p: 'dots', c: ['#b89448', '#d8b060'] }, wall: { p: 'flat', c: ['#3a2a14', '#2a1a0a'], topColor: '#3a2a14' }, wallface: { p: 'panel', c: ['#8a6a30', '#6a4a20', '#4a2a10'], skirt: '#2a1a0a' } },
    tall: { o: { look: 'pillar', opt: { c: ['#e8d090', '#b89448'] } } },
    style: { tallWalls: true }, music: 'pinneddrum', amb: { type: 'clock', vol: 0.05 }, dark: 0.4, extra: { noFurnish: true },
    doors: [{ to: 'W360', at: [2, 20], look: 'hatch', cond: { dark: true }, label: 'a hatch in the drum that only opens in the dark; it smells of fabric softener' }],
    place: [{ id: 'pin1', type: 'block', at: [8, 6], look: 'pillar', lookOpt: { c: ['#f0e0a0'] }, lines: ['A loose pin, lying on the drum.'] },
      { id: 'pin2', type: 'block', at: [17, 15], look: 'pillar', lookOpt: { c: ['#f0e0a0'] }, lines: ['A loose pin.'] },
      { id: 'pin3', type: 'block', at: [26, 10], look: 'pillar', lookOpt: { c: ['#f0e0a0'] }, lines: ['A loose pin.'] },
      { id: 'hole1', type: 'plate', at: [8, 11], look: 'manhole', lookOpt: { c: ['#2a1a0a'] }, lines: ['An empty hole in the drum, exactly the size of a pin.'] },
      { id: 'hole2', type: 'plate', at: [22, 15], look: 'manhole', lookOpt: { c: ['#2a1a0a'] }, lines: ['An empty hole, the size of a pin.'] },
      { id: 'hole3', type: 'plate', at: [26, 5], look: 'manhole', lookOpt: { c: ['#2a1a0a'] }, lines: ['An empty hole, the size of a pin.'] },
      { id: 'score', type: 'decor', at: [17, 1], look: 'plaque', lines: ['A ring of seven pins, engraved around the drum like a sentence.', 'Under the teeth they strike, in order: fourth, third, fourth, third, second, third, first.'] },
      SOUL([EN('The box fell off the shelf the night of the funeral. Nobody bent down for the pins.')], [30, 19])],
    signs: [{ at: [25, 19], lines: [EN('Pins don’t mind being pushed. They mind being lost. Push them home.')] },
      { at: [3, 19], lines: [EN('When the lamp goes out in the room above, the drum shows its other door.')] }],
    decor: [{ look: 'scuff', n: 3, solid: false, lines: ['A long scratch where a pin dragged when the box fell.'] },
      { look: 'sparkle', n: 2, solid: false, lines: ['A glint of brass, polished by a mite.'] },
      { look: 'glint', n: 2, solid: false, lines: ['A grain of rust, the only one. The mites are ashamed of it.'] }],
    npcs: [{ id: 'N1810', name: 'A Pill Bug', look: { t: 'ant', c: ['#6a6a72'], h: 7 }, behavior: 'wander', radius: 5, speed: 0.5, solid: false,
        lines: [EN('Three pins rolled out when the box fell. They have been lying there ever since, like teeth after a fall.'), EN('Push, don’t pull. You can’t pull a pin. You can only push it home.'), 'It curls into a ball and refuses to say anything else.'] },
      { id: 'N1811', name: 'The Tick Under the Drum', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 18,
        ambientLines: ['Somewhere under the drum, a tick. Then another. Not quite the rhythm it used to have.', EN('Tick. Tick. Tock. Where was I.')] }],
    mech: [{ type: 'push', blocks: ['pin1', 'pin2', 'pin3'], plates: ['hole1', 'hole2', 'hole3'], sfx: 'stamp', done: { flag: 'ib_drum' },
      winLines: ['The third pin drops into its hole with a small, satisfied click.', 'The drum turns a quarter of a turn by itself, as if clearing its throat.'], reward: [{ set: { ib_drum: true } }] }],
    info: { summary: 'The music box drum, at the scale of a dance floor: a brass plain studded with pins.',
      rules: ['Push the three loose pins into the three empty holes (each one is a straight push).', 'The plaque at the top gives the order of the teeth for the Steel Comb.'],
      secrets: ['When the bedroom lamp is off, a hatch opens in the south-west corner, into the Plush (W360).'],
      lore: 'Pins knocked out on the night of a funeral, left where they fell.' } });

  /* ---------------------------------------------------------------
   *  W345 — The Dancer’s Mirror
   * --------------------------------------------------------------- */
  S({ id: 'W345', name: 'The Dancer’s Mirror', depth: 4, tier: 'hard', back: 'W342', backLook: 'stairs', backLabel: 'back down the spiral stair', backAt: [15, 22],
    map: (function () { var g = K.grid(30, 24, ' '); g.box(0, 0, 30, 24, 'm', '.'); g.ellipse(14.5, 12, 10, 8, ','); g.vline(24, 1, 4, 'm'); g.hline(24, 28, 4, 'm'); return g.rows(); })(),
    look: { floor: { p: 'marble', c: ['#e8e4f0', '#c8c0d8'] }, floor2: { p: 'mosaic', c: ['#f0e0f0', '#d8c8e8', '#f8f0ff', '#c0b0d8'] }, mirror: { p: 'glass', c: ['#b8c8d8', '#f0f8ff', '#8898a8'] } },
    style: { tallWalls: true }, music: 'dancermirror', amb: { type: 'musicbox', vol: 0.05 }, dark: 0.3,
    doors: [{ to: 'W360', at: [3, 2], look: 'musicbox', opt: { c: ['#e0a0b0'] }, cond: { secret: 'danced_nurse' }, label: 'deep in the glass, another music box: one sewn inside a plush' }],
    place: [{ id: 'ballerina', type: 'decor', at: [27, 2], look: 'doll', lookOpt: { c: ['#f0c8d8'] }, use: [{ secret: 'broken_ballerina' }],
        lines: ['Behind the mirror, where nobody looks: the real dancer, in two pieces, her tutu yellowed.', 'Someone wrapped her in a handkerchief before putting her away. Someone could not throw her out.'] },
      SOUL([KS('엄마는 밤새 서 있어. 춤추는 것처럼, 왔다 갔다.', 'Mum is on her feet all night. Back and forth, as if she were dancing.')])],
    signs: [{ at: [15, 20], lines: [EN('Feet first. Watch her feet. The face can wait.')] },
      { at: [22, 2], lines: [EN('The real dancer is not in front of the mirror. Only someone who walks through reflections would find her.')] }],
    decor: [{ look: 'mirror', n: 3, lines: ['A mirror. In it, the little nurse is turning the other way.', 'A mirror. In it, you are taller, and tired.'] },
      { look: 'sparkle', n: 4, solid: false, lines: ['A sequin, come loose from a costume, still trying to catch the light.'] },
      { look: 'spotlight', n: 1, lines: ['A spotlight the size of a thimble, pointed at the middle of the stage.'] }],
    npcs: [{ id: 'N1812', name: 'The Little Plastic Nurse', look: H({ t: 'doll', hairStyle: 'bun', body: 'uniform', c: ['#f4f4fa', '#d8d8e8', '#f0d8c8', '#2a1a10'], eyes: 'closed', h: 17 }), behavior: 'static', face: false, solid: true, at: [15, 11],
        lines: [EN('I turn. I turn. Someone has to keep turning.'), EN('The real dancer broke. They glued me on instead. I came from a toy hospital. I know how to stay up all night.'),
          EN('Dance with me. Watch my feet, not my face. Close to me, one step for each of mine.')] },
      { id: 'N1813', name: 'A Felt Star', count: 4, look: { t: 'jelly', c: ['#f0e890'], h: 8, glow: '#f0e890' }, light: 1.2, behavior: 'orbit', radius: 3, speed: 0.5, solid: false, lines: ['A felt star from a cot mobile, turning around the stage on its own.'] }],
    mech: [{ type: 'dirSequence', ent: 'N1812', seq: ['left', 'up', 'right', 'down', 'right', 'up'], dist: 6, give: 'E243',
      winLines: ['You turn with her, step for step.', 'The music box plays the whole lullaby, first note to last, for the first time in years.', 'The little nurse stops, a little out of breath, and holds something out to you: the brass key from her back.', EN('Wind the things that have run down. I have to keep turning.')],
      reward: [{ secret: 'danced_nurse' }] }],
    info: { summary: 'The top of the music box: a stage of mirrors where a little plastic nurse turns instead of the dancer.',
      rules: ['Reached by the spiral stair in the music box, once comb, drum and spring are mended.', 'Watch the nurse’s feet: she faces left, up, right, down, right, up, then rests.', 'Take one step in each of those directions, in order, within six steps of her.', 'Gives the Wind-Up Key (E243) and opens a door into the Plush (W360).'],
      secrets: ['Behind the mirrors in the north-east corner (walk through them: Inverted Reflection): the ballerina.'],
      lore: 'A nurse who keeps turning all night, because someone has to.' } });

  /* ---------------------------------------------------------------
   *  W346 — The Washing Machine on Spin
   * --------------------------------------------------------------- */
  var SOCKS = [[8, 8], [14, 5], [26, 5], [32, 9], [33, 15], [28, 23], [11, 23], [6, 14]];
  S({ id: 'W346', name: 'The Washing Machine on Spin', depth: 4, tier: 'hard', back: 'W353', backLook: 'shell', backLabel: 'back into the sound of the sea', backAt: [2, 14],
    map: (function () { var g = K.grid(40, 30, ' '); g.ellipse(19.5, 14.5, 18.5, 13.5, '.'); g.rect(19, 2, 2, 3, '%'); g.rect(5, 19, 3, 2, '%'); g.rect(32, 19, 3, 2, '%'); g.rect(18, 25, 4, 2, '_'); return g.rows(); })(),
    look: { floor: { p: 'dots', c: ['#a8b4c0', '#7a8696'] }, wall: { p: 'metal', c: ['#c8d0d8', '#a8b0b8', '#e0e8f0'] }, wall2: { p: 'metal', c: ['#d8e0e8', '#b8c0c8', '#f0f4f8'] }, pit: { p: 'flat', c: ['#2a3a4a', '#1a2a3a'] } },
    style: { sky: ['#c8d8e8', '#e8f0f8'] }, music: 'spincycle', amb: { type: 'machine', vol: 0.1 }, dark: 0.2,
    fall: { to: 'W162' },
    doors: [{ to: 'W347', at: [37, 14], look: 'clothesline', label: 'a work tunic tangled in the wash, one pocket gaping open' }],
    place: SOCKS.map(function (p, i) { return { id: 's' + i, type: 'decor', at: p, look: 'sock', lines: ['A wet sock, lying where the spin flung it.'] }; })
      .concat([SOUL([EN('The washing machine works the night shift too. It never complains either.')])]),
    signs: [{ at: [20, 22], lines: [EN('The rinse water goes somewhere white and warm. Lean on the drain long enough and you go with it.')] }],
    decor: [{ look: 'towel', n: 2, lines: ['A towel, flattened against the drum by the spin.'] },
      { look: 'scraps', n: 3, solid: false, lines: ['A tissue that went through the wash, now a little snow of paper.'] },
      { look: 'coin', n: 1, lines: ['A coin that went through the wash. It is the cleanest thing in the flat.'] }],
    npcs: [{ id: 'N1814', name: 'The Lost Button', look: BTN, behavior: 'wander', radius: 6, speed: 1.2, solid: false, passThrough: true,
        lines: [{ if: { notFlag: 'btn_3' }, seq: ['A grey button tumbles past, round and round, and stops against your foot.', EN('I went through the wash! Forty degrees! I am very clean and very dizzy.'), EN('I thought the coat might be in here. Coats don’t go in the wash. I know that now.')], do: [{ set: { btn_3: true } }] },
          EN('Round and round. Like waiting. You don’t get anywhere, but you come out very clean.'), EN('Somewhere there is a pocket that zips. Buttons dream of zips.')] },
      { id: 'N1815', name: 'The Programme', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 15,
        ambientLines: [EN('Rinse. Spin. Rinse. Spin.'), 'The drum speeds up. Everything that was on the floor is suddenly on the ceiling, then back.', KS('세탁이 완료되었습니다.', 'The wash is complete.'), 'Nobody comes to open the door. The programme starts again by itself.'] },
      { id: 'N1816', name: 'A Hospital Towel', count: 2, look: ghost('rgba(240,244,248,0.6)', 18), behavior: 'wander', radius: 6, speed: 1.6, solid: false,
        lines: ['A towel tumbling past. It has been washed so many times it is nearly transparent.', 'A towel folding itself in four, all alone, as if someone were coming home soon.'] }],
    mech: [{ type: 'pairs', tiles: SOCKS.map(function (p, i) { return 's' + i; }), give: 'E244', wrongLine: 'Two socks that have never met. They turn away from each other.', doneLine: 'Four pairs, rolled into balls. They are finally still.',
        winLines: ['The fourth pair rolls itself into a ball.', 'And one sock is left over, striped, warm, with no pair at all.', 'It climbs onto your foot as if it had been waiting for you.'] },
      { type: 'wind', strength: 0.7 }],
    info: { summary: 'The drum of the washing machine in mid-spin: perforated steel, three lifters, wet socks everywhere.',
      rules: ['Reached from the Seashell from Busan, once its echo has been answered.', 'Find the socks that go together: look under two at a time; a wrong pair turns back over.', 'Gives the Odd Sock (E244).'],
      secrets: ['Pushing against the drain at the bottom of the drum several times lets you fall into the Sea of Milk (W162).'],
      lore: 'The machine that runs at night, alongside the mother.' } });

  /* ---------------------------------------------------------------
   *  W347 — The Tunic Pocket After the Wash
   * --------------------------------------------------------------- */
  S({ id: 'W347', name: 'The Tunic Pocket After the Wash', depth: 4, tier: 'hard', back: 'W346', backLook: 'clothesline', backLabel: 'back out into the drum', backAt: [2, 14],
    map: (function () { var g = K.grid(40, 30, ' '); g.ellipse(19.5, 14.5, 18.5, 13.5, '.'); g.ellipse(20, 14, 7, 6, ','); fill(g, [[5, 9], [6, 20], [33, 8], [34, 21], [12, 4], [27, 25], [10, 25], [28, 4]], 'o'); return g.rows(); })(),
    look: { floor: { p: 'carpet', c: ['#9ac0c0', '#88b0b0', '#a8d0d0'] }, floor2: { p: 'rug', c: ['#b8dcd8', '#a8ccc8'] }, wall: { p: 'flat', c: ['#4a6a6a', '#3a5a5a'] } },
    tall: { o: { look: 'tuft', opt: { c: ['#e8eef0'] } } },
    style: { renderer: 'watercolor' }, music: 'tunicpocket', amb: { type: 'hum', vol: 0.04 }, dark: 0.5, extra: { noFurnish: true },
    doors: [{ to: 'W355', at: [37, 14], look: 'curtain', opt: { c: ['#2a2a30'] }, label: 'a fold of fabric that smells of her handbag' },
      { id: 'tonest', to: 'W199', at: [19, 2], look: 'nest', cond: { secret: 'socks_paired' }, label: 'up the seam, towards a nest of lost socks' }],
    place: [{ id: 'list', type: 'decor', at: [20, 21], look: 'letter', cond: { flag: 'pocket_list' }, use: [{ note: 'n_pocket_list' }],
        lines: ['The list, dried out, almost legible again: “우유 — 쌀 — 소라 전화 — 잠”.', 'Milk. Rice. Call Sora. Sleep. “Call Sora” is underlined twice.'] },
      SOUL([KS('주머니 비우는 걸 또 깜빡했네.', 'I forgot to empty my pockets again.')], [8, 20])],
    signs: [{ at: [20, 25], lines: [EN('Every morning at seven her hand comes into the pocket, looking for the list.'), EN('Stay in its shadow. It is the warmest place.')] }],
    decor: [{ look: 'scraps', n: 3, solid: false, lines: ['A shred of paper, washed soft as cloth. A single letter is left on it: 소.'] },
      { look: 'coin', n: 1, solid: false, lines: ['Bus fare, exactly. She always keeps exactly the bus fare in this pocket.'] },
      { look: 'pills', n: 1, solid: false, lines: ['An empty blister of headache tablets, washed flat and clean.'] }],
    npcs: [{ id: 'N1817', name: 'A Ballpoint Pen', look: H({ t: 'tall', head: 'blank', body: 'robe', c: ['#2a3a8a', '#1a2a6a', '#e8e8f0', '#101030'], eyes: 'none', h: 24 }), behavior: 'static', solid: true, at: [9, 12],
        lines: [EN('I wrote the list. Then the list went through the wash. Then nobody called.'), KS('전화하기. 꼭.', 'Call. Without fail.'), EN('I am out of ink on one side. She presses very hard when she is tired.')] },
      { id: 'N1818', name: 'The Other Sock', look: { t: 'blob', c: ['#d86a7a'], h: 9 }, behavior: 'static', solid: true, at: [30, 18],
        lines: [EN('I came in with the tunic and stayed. Pockets are warm.'), EN('My other half went into the drum and never came out. Socks don’t come back. They go up.'), EN('If you ever meet someone striped and warm, with no pair, bring them close to me.')],
        reacts: { E244: { lines: ['The Odd Sock on your foot and the sock in the pocket look at each other for a very long time.', EN('…There you are. Striped. Warm. Late.'), 'Together they pull the inner seam of the pocket open, like a curtain.', EN('Go up. All the lost ones are up there, in a nest. Somebody kept them.')],
          do: [{ secret: 'socks_paired' }, { show: 'tonest' }, { sfx: 'reveal' }] } } },
      { id: 'N1819', name: 'Tissue Snow', count: 5, look: { t: 'jelly', c: ['rgba(250,250,255,0.8)'], h: 6 }, behavior: 'fly', radius: 6, speed: 0.4, solid: false, lines: ['A flake of tissue that went through the wash. It drifts like snow and sticks to everything.'] }],
    mech: [{ type: 'followShadow', center: [20, 14], r: 5, speed: 0.25, secs: 20, breakLine: 'The shadow of the hand moves on without you.', done: { flag: 'pocket_list' },
      winLines: ['You stay in the shadow of her hand all the way round, like being held.', 'The hand finds what it was looking for: a crumpled list, dried into a ball.', 'It smooths it out, and leaves it for you.'],
      reward: [{ set: { pocket_list: true } }] }],
    info: { summary: 'The pocket of the mother’s work tunic, after the wash: soft blue fabric, lint, a washed-out list.',
      rules: ['A shadow of her hand circles the middle of the pocket: stay inside it for twenty seconds.', 'The list appears: milk, rice, call Sora, sleep.'],
      secrets: ['Use the Odd Sock (E244) facing the Other Sock: the pair opens the seam onto the Nest of lost socks (W199).'],
      lore: 'She never empties her pockets. The wash keeps her lists for her, then takes them.' } });

  /* ---------------------------------------------------------------
   *  W348 — Inside the Old Television
   * --------------------------------------------------------------- */
  S({ id: 'W348', name: 'Inside the Old Television', depth: 4, tier: 'hard', back: 'W055', backLook: 'tv', backLabel: 'out through the glass, into the shop', backAt: [1, 13],
    map: (function () { var g = K.grid(46, 28, ' '); for (var x = 1; x < 45; x++) { var hh = Math.max(2, 12 - Math.floor(x * 0.22)); g.vline(x, 14 - hh, 13 + hh, '.'); } g.vline(0, 1, 26, 'g'); return g.rows(); })(),
    look: { floor: { p: 'stripes', c: ['#3a1018', '#103a18', '#10183a'] }, glass: { p: 'glass', c: ['#6a8a8a', '#a0c8c0', '#4a6a6a'] } },
    style: { renderer: 'pixel8' }, music: 'oldtelevision', amb: { type: 'tv', vol: 0.07 }, dark: 0.6,
    doors: [{ to: 'W357', at: [44, 13], look: 'tv', label: 'the channel after the last programme' },
      { to: 'W095', at: [3, 25], look: 'tv', opt: { c: ['#c04040'] }, cond: { remainingLt: 180 }, label: 'channel 13, very late: a house where the television is always on' }],
    place: [{ id: 'dotR', type: 'decor', at: [6, 4], look: 'spark', lookOpt: { c: ['#ff4050'] }, lines: ['A dot of red phosphor, dark.'] },
      { id: 'dotG', type: 'decor', at: [6, 23], look: 'spark', lookOpt: { c: ['#40ff70'] }, lines: ['A dot of green phosphor, dark.'] },
      { id: 'dotB', type: 'decor', at: [22, 13], look: 'spark', lookOpt: { c: ['#4070ff'] }, lines: ['A dot of blue phosphor, dark.'] },
      SOUL([EN('The television stayed on all night so the flat would sound like a family. Inside, it was very quiet.')])],
    signs: [{ at: [10, 13], lines: [EN('Channel 13 only comes on when there is almost no night left.')] }],
    decor: [{ look: 'wire', n: 3, lines: ['A cable as thick as a tree trunk, warm, humming fifty times a second.'] },
      { look: 'glint', n: 4, solid: false, lines: ['A grain of static, crackling on the floor.'] },
      { look: 'crt', n: 1, lines: ['A tiny television inside the television. It shows this room, from behind you.'] }],
    npcs: [{ id: 'N1820', name: 'The Electron Gun', look: H({ t: 'robot', body: 'suit', c: ['#4a4a5a', '#2a2a3a', '#c8c8d0', '#80f0ff'], eyes: 'wide', h: 22 }), behavior: 'static', solid: true, at: [41, 13],
        lines: [EN('I paint the picture one line at a time, left to right, top to bottom. Nobody has ever seen me do it.'), EN('Red, green, blue. Light all three before the first one forgets, and you will see what I see.'), EN('Phosphor forgets in a few seconds. Run.')] },
      { id: 'N1821', name: 'A Static Flea', count: 4, look: { t: 'ant', c: ['#d8d8e0'], h: 5 }, behavior: 'flee', fleeDist: 3, radius: 6, speed: 1.6, solid: false, passThrough: true, lines: ['A speck of static. It hisses at you and jumps two lines down.'] },
      { id: 'N1822', name: 'The Announcer', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 17,
        ambientLines: [EN('…and that concludes tonight’s programmes.'), EN('Please remember to switch off your set.'), 'Nobody switches off the set. The hum goes on.'] }],
    mech: [{ type: 'lampsAll', lamps: ['dotR', 'dotG', 'dotB'], time: 10, light: 2.6, give: 'E245', onLine: 'It is still glowing. Hurry to the others.',
      winLines: ['Red, green and blue glow at the same time.', 'For an instant there is a whole picture inside the glass: a kitchen, a woman asleep at a table.', 'Then the picture fades, and the glow stays on your eyes.'] }],
    info: { summary: 'The inside of an old cathode-ray television: a funnel of phosphor stripes narrowing towards the electron gun.',
      rules: ['Entered from the very old television at the back of the Television Shop.', 'Light the red, green and blue phosphor dots so all three glow at once; each fades after ten seconds.', 'Gives the Afterglow (E245). The far end leads to the Test Card.'],
      secrets: ['With under 3:00 of dream left, channel 13 opens in the south-west: the House Where the TV Is On (W095).'],
      lore: 'The television left on for company, seen from the inside.' } });
  link('W055', { to: 'W348', look: 'tv', label: 'a very old television at the back of the shop, its screen bulging like an eye' });

  /* ---------------------------------------------------------------
   *  W349 — The Rice Cooker’s Steam
   * --------------------------------------------------------------- */
  S({ id: 'W349', name: 'The Rice Cooker’s Steam', depth: 4, tier: 'hard', back: 'W113', backLook: 'pot', backOpt: { c: ['#e8e8e0'] }, backLabel: 'down the cord, back into the lit kitchen', backAt: [20, 27],
    map: (function () {
      var g = K.grid(42, 30, ' '); g.ellipse(20.5, 14.5, 19.5, 13.5, '.'); g.scatter(',', '.', 0.22, 349);
      fill(g, [[8, 9], [9, 9], [31, 8], [14, 19], [15, 19], [27, 18], [6, 15], [35, 13], [24, 6]], 'o'); g.rect(31, 22, 3, 2, '_');
      return g.rows();
    })(),
    look: { floor: { p: 'dots', c: ['#f4f0e4', '#e0d8c4'] }, floor2: { p: 'cloud', c: ['#ffffff', '#eef0f4'] }, wall: { p: 'metal', c: ['#c8ccd0', '#a8acb0', '#e0e4e8'] }, pit: { p: 'flat', c: ['#6a4a28', '#4a3018'] } },
    tall: { o: { look: 'egg', opt: { c: ['#f8f4ea'] } } },
    style: { renderer: 'watercolor', sky: ['#f0f0f0', '#ffffff'] }, music: 'ricesteam', amb: { type: 'fridge', vol: 0.05 }, weather: { dust: true },
    fall: { to: 'W195' },
    doors: [{ to: 'W350', at: [4, 14], look: 'pot', opt: { c: ['#c8ccd0'] }, label: 'a scoop of rice, on its way to a lunchbox' }],
    place: [{ id: 'display', type: 'decor', at: [20, 2], look: 'monitor', lookOpt: { c: ['#f0a030'] }, light: 1.6,
        lines: ['A little display, glowing orange: 보온 14:00. Keep warm. Fourteen hours.', 'Under it, a button nobody has pressed: 취소. Cancel.'] },
      SOUL([KS('밥은 먹었어?', 'Have you eaten?')])],
    signs: [{ at: [18, 6], lines: ['A child’s voice, from very long ago, before a meal:', KS('잘 먹겠습니다!', 'I’ll eat well! (what you say before you eat)')] },
      { at: [29, 21], lines: [EN('At the bottom of every pot there is a crust that tastes of 1989.')] }],
    decor: [{ look: 'cloudpuff', n: 4, solid: false, lines: ['A puff of steam, warm, slow, going nowhere in particular.', 'Steam that smells of rice and of a kitchen at night.'] },
      { look: 'crumbs', n: 2, solid: false, lines: ['A few grains stuck to the side of the pot, gone hard. Somebody always meant to wash it.'] },
      { look: 'glint', n: 2, solid: false, lines: ['A drop of water sliding down the inside of the lid, very slowly.'] }],
    npcs: [{ id: 'N1823', name: 'The Rice Cooker’s Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 16,
        ambientLines: [KS('취사가 완료되었습니다. 밥을 잘 저어 주세요.', 'Cooking is complete. Please stir the rice.'), KS('보온을 시작합니다.', 'Keep-warm mode is on.'), KS('보온 열네 시간째입니다.', 'The rice has been kept warm for fourteen hours.'), 'A gentle recorded voice, talking to a kitchen with nobody in it.'] },
      { id: 'N1824', name: 'A Grain of Rice', count: 4, look: { t: 'blob', c: ['#f6f2e6'], h: 8 }, behavior: 'wander', radius: 4, speed: 0.5, solid: false, passThrough: true,
        lines: [EN('I waited fourteen hours to be eaten. I am still good. I am just a little hard now.'), EN('Every grain is a promise that someone will come home.'), EN('Say it to the little light. The thing you say before eating. Nobody says it here any more.')] },
      { id: 'N1825', name: 'The Steam Valve', look: H({ t: 'robot', body: 'suit', c: ['#a8acb0', '#888c90', '#d8dce0', '#202020'], h: 13 }), behavior: 'static', solid: true,
        lines: [EN('Pssssst.'), 'It lets out a little steam, like a sigh it was holding in.', EN('I let the pressure out so the lid doesn’t fly off. Somebody in this family should.')] }],
    mech: [{ type: 'sayTo', mark: 'display', dist: 4, give: 'E246',
      words: ['잘 먹겠습니다', '잘먹겠습니다', 'jal meokgetseumnida', 'jal meokgesseumnida', 'thank you for the food', 'thanks for the food', 'thank you for the meal', 'thanks for the meal', 'eat well'],
      wrong: 'The display blinks: 보온. Keep warm. It is waiting for other words.', doneLine: 'The little light is green. The rice is warm, and it has been eaten.',
      winLines: ['The little light turns from orange to green.', KS('맛있게 드세요.', 'Enjoy your meal.'), 'A puff of steam lifts off the rice and settles around your shoulders, warm and light.'] }],
    info: { summary: 'Inside the rice cooker, kept warm for fourteen hours: steam, grains of rice like boulders, an orange light.',
      rules: ['Entered from the rice cooker in the Lit Kitchen.', 'Near the little orange display, say the words said before a meal: “잘 먹겠습니다” (or “thank you for the food”).', 'Gives the Puff of Steam (E246).'],
      secrets: ['Leaning several times on the scorched crust at the bottom right drops you into the Kitchen of 1989 (W195).'],
      lore: 'Rice kept warm for someone who comes home late. It runs in the family.' } });
  link('W113', { to: 'W349', look: 'pot', lookOpt: { c: ['#e8e8e0'] }, label: 'the rice cooker on the counter, its little light still orange' });

  /* ---------------------------------------------------------------
   *  W350 — The Lunchbox That Came Home Full
   * --------------------------------------------------------------- */
  S({ id: 'W350', name: 'The Lunchbox That Came Home Full', depth: 4, tier: 'mid', back: 'W113', backLook: 'crate', backOpt: { c: ['#b8c0c8'] }, backLabel: 'up over the steel rim, back into the kitchen', backAt: [8, 26],
    map: (function () {
      var g = K.grid(44, 28, ' '); g.box(0, 0, 44, 28, '#', '.');
      g.vline(17, 1, 26, '%'); g.hline(17, 42, 13, '%'); g.vline(31, 1, 26, '%');
      fill(g, [[17, 6], [17, 20], [31, 7], [24, 13], [37, 13], [31, 20]], '.'); // where the dividers do not quite meet
      g.rect(32, 14, 11, 13, '~'); g.rect(36, 18, 3, 3, ','); // the soup, and an island in it
      return g.rows();
    })(),
    look: { floor: { p: 'metal', c: ['#c8d0d8', '#b0b8c0', '#d8e0e8'] }, floor2: { p: 'dots', c: ['#f6f2e6', '#e8e0cc'] }, wall: { p: 'metal', c: ['#e0e6ec', '#c0c8d0', '#f0f4f8'] },
      wall2: { p: 'metal', c: ['#d0d8e0', '#b0b8c0', '#e8eef4'] }, water: { p: 'water', c: ['#c89850', '#b88840', '#d8b070', '#f0dcb0'] } },
    style: { tallWalls: true }, music: 'lunchbox', amb: { type: 'kids', vol: 0.03 }, dark: 0.25,
    doors: [{ to: 'W349', at: [2, 2], look: 'pot', opt: { c: ['#c8ccd0'] }, label: 'the rice paddle, back up into the steam' },
      { id: 'tojar', to: 'W359', at: [41, 2], look: 'onggi', cond: { flag: 'lunch_eaten' }, label: 'the kimchi, and behind it, the smell of a jar very far away',
        locked: 'The kimchi smells of a jar very far away. A voice you know, tired and very gentle: finish your lunch first.' }],
    place: [{ id: 'rice', type: 'decor', at: [8, 13], look: 'egg', lookOpt: { c: ['#f8f4ea'] }, lines: ['The rice, pressed flat under the lid, cold since morning. You take a bite. It tastes of the kitchen at seven.'] },
      { id: 'egg', type: 'decor', at: [24, 6], look: 'fruit', lookOpt: { c: ['#f0d060'] }, lines: ['A slice of rolled omelette, yellow and sweet. Somebody added sugar, the way children like it.'] },
      { id: 'kimchi', type: 'decor', at: [37, 6], look: 'onggi', lookOpt: { c: ['#c84030'] }, lines: ['Kimchi, red, sour, very old. It stings your tongue the way it once stung someone’s hands.'] },
      { id: 'octopus', type: 'decor', at: [21, 22], look: 'fruit', lookOpt: { c: ['#e05060'] }, lines: ['A sausage cut into an octopus, eight little legs fried open. It was made to make someone smile.'] },
      { id: 'anchovy', type: 'decor', at: [27, 18], look: 'crumbs', lookOpt: { c: ['#a08040'] }, lines: ['Tiny anchovies glazed with honey, crunchy. Every one of them is looking at you.'] },
      { id: 'lidnote', type: 'decor', at: [10, 1], look: 'letter', lines: ['A note taped inside the lid:', KS('점심 꼭 먹어. 남기지 말고.', 'Make sure you eat your lunch. Don’t leave any.')] },
      { id: 'undernote', type: 'decor', at: [37, 19], look: 'letter', lookOpt: { c: ['#f0e8d0'] }, use: [{ secret: 'lunch_second_note' }, { note: 'n_lunch_note' }],
        lines: ['On the island in the soup, under the bowl, a second note, folded very small:', KS('괜찮아. 다 안 먹어도 돼.', 'It’s all right. You don’t have to eat it all.')] },
      SOUL([EN('The lunchbox came home full every day. Someone opened it in a toilet cubicle and closed it again.')])],
    decor: [{ look: 'sparkle', n: 2, solid: false, lines: ['A drop of sesame oil, shining like a coin.'] },
      { look: 'glint', n: 3, solid: false, lines: ['A sesame seed, as big as a pillow down here.'] },
      { look: 'letter', n: 1, lines: ['A paper napkin folded into a crane. It has never been unfolded.'] }],
    npcs: [{ id: 'N1826', name: 'A Sausage Octopus', count: 3, look: { t: 'blob', c: ['#e05060'], h: 9 }, behavior: 'wander', radius: 4, speed: 0.8, solid: false, passThrough: true,
        lines: [EN('We were cut into octopuses so a child would smile at lunch. Did she smile?'), EN('We waited all morning in the dark of a schoolbag. Then a little light, in a toilet. Then the dark again.'), EN('Taste one of everything. Then the lunchbox can go home light.')] },
      { id: 'N1827', name: 'The Rolled Omelette', look: { t: 'blob', c: ['#f0d060'], h: 11 }, behavior: 'static', solid: true, at: [27, 9],
        lines: [KS('엄마가 아침 일곱 시에 말았어. 퇴근하자마자.', 'Mum rolled me at seven in the morning. The minute she got home from work.'), KS('설탕 조금 넣었어. 소라가 좋아하니까.', 'She put in a little sugar. Because Sora likes it.')] },
      { id: 'N1828', name: 'The Chopsticks', look: H({ t: 'tall', head: 'blank', body: 'robe', c: ['#c8ccd0', '#a8acb0', '#d8dce0', '#202020'], eyes: 'none', h: 28 }), behavior: 'static', solid: true,
        lines: [EN('We are a pair. Pairs are the easy part.'), EN('Steel ones, heavier than at school. Nobody else at the table had steel ones. Nobody else was at the table.')] }],
    mech: [{ type: 'visitAll', marks: ['rice', 'egg', 'kimchi', 'octopus', 'anchovy'], countText: 'Tasted: # / %', done: { flag: 'lunch_eaten' },
      winLines: ['One of everything. The lunchbox is empty for the first time in months.', 'Somewhere, a woman opening it in the evening will see that, and say nothing, and smile at the sink.'],
      reward: [{ set: { lunch_eaten: true } }] }],
    info: { summary: 'A steel lunchbox with five compartments, sent to school full and brought home full.',
      rules: ['Entered from the lunchbox by the sink in the Lit Kitchen.', 'Taste the five foods (rice, omelette, kimchi, sausage octopus, anchovies), in any order.', 'Then the kimchi corner opens onto Grandmother’s Kimchi Jar (W359).'],
      secrets: ['On an island in the soup (float or swim: the Puff of Steam, E246), a second note from the mother.'],
      lore: 'The lunch eaten alone in a cubicle, or not at all, and the mother who knew.' } });
  link('W113', { to: 'W350', look: 'crate', lookOpt: { c: ['#b8c0c8'] }, label: 'a steel lunchbox by the sink, still full' });

  /* ---------------------------------------------------------------
   *  W351 — The Snow Globe from Seoul
   * --------------------------------------------------------------- */
  S({ id: 'W351', name: 'The Snow Globe from Seoul', depth: 4, tier: 'hard', back: 'W341', backLook: 'glass', backLabel: 'out through the glass, back into the drawer', backAt: [21, 2], outdoor: true,
    map: (function () {
      var g = K.grid(44, 34, ' '); g.ellipse(21.5, 16.5, 20.5, 15.5, '.'); paint(g, 12, 22, 6, 4, '.', '&');
      fill(g, [[8, 8], [10, 6], [33, 7], [35, 10], [31, 24], [34, 22], [6, 15], [37, 16], [16, 28], [27, 28]], '^');
      return g.rows();
    })(),
    look: { floor: { p: 'snow', c: ['#f4f8fc', '#e4ecf4', '#ffffff'] }, ice: { p: 'ice', c: ['#c8e4f4', '#b0d4ec', '#ffffff'] } },
    tall: { '^': { look: 'pine', opt: { c: ['#3a6a4a', '#2a5a3a'] } } },
    style: { renderer: 'watercolor', sky: ['#a8c0d8', '#e8f0f8'], cliffH: 0.6, cliff: '#c8d8e8' }, music: 'snowglobe', amb: { type: 'wind', vol: 0.04 }, weather: { snow: true },
    place: [{ id: 'house', type: 'decor', at: [22, 15], look: 'house', light: 2, lines: ['A tiny house with a red roof and one lit window. It is the only light in the whole globe.', 'From close up you can see a little girl painted in the window, asleep.'] },
      { id: 'centre', type: 'decor', at: [22, 18], look: 'scuff', solid: false, lines: ['A spot in front of the house where the snow is thinner, as if somebody often stood here, waiting.'] },
      { id: 'globebase', type: 'decor', at: [21, 31], look: 'musicbox', lookOpt: { c: ['#4a3a5a'] }, lines: ['The base of the globe, under the snow: a tiny music box, with a key slot shaped like a clover.'],
        onEffect: { E243: [{ secret: 'globe_wound' }, { show: 'housewindow' }, { sfx: 'reveal' }, { msg: 'Three turns. The base plays a few notes; the snow dances in time, and the tiny house opens its curtains.' }] } },
      { id: 'housewindow', type: 'decor', at: [24, 15], look: 'window', cond: { secret: 'globe_wound' }, light: 1.5, use: [{ secret: 'globe_window' }],
        lines: ['Through the tiny window: the little girl is asleep.', 'Someone is sitting on the edge of her bed, very still.', 'The lamp is off. Someone else turned it off.'] },
      SOUL([KS('서울에서 사 왔어. 흔들면 눈이 와.', 'I brought it back from Seoul. Shake it and it snows.')])],
    signs: [{ at: [18, 20], lines: [EN('The snow only settles for people who stop. Stand where the waiting was.')] }],
    decor: [{ look: 'snowman', n: 2, lines: ['A snowman the size of a thumbnail. Its eyes are two poppy seeds.'] },
      { look: 'bench', n: 1, lines: ['A bench under the snow. Nobody sits in a snow globe. People only look in.'] },
      { look: 'streetlamp', n: 2, lines: ['A street lamp painted on the inside of the glass. Up close, it is only a brushstroke.'] }],
    npcs: [{ id: 'N1829', name: 'A Tiny Snowman', look: { t: 'blob', c: ['#f8fbff'], h: 12 }, behavior: 'static', solid: true, at: [28, 20],
        lines: [EN('I have been in here for years. I was a souvenir from Seoul. Souvenirs don’t get to go back.'), EN('Every time someone shakes us, it is winter all over again. Nobody asks the snowman.'), EN('Stand still in front of the house. The snow only settles for people who stop.')] },
      { id: 'N1830', name: 'A Skater the Size of a Grain', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#c84040', '#a03030', '#f0d0b0', '#1a1010'], h: 11 }), behavior: 'patrol', path: [[7, 22], [12, 19], [17, 22], [12, 25]], speed: 0.8, solid: false,
        lines: [KS('엄마, 나 봐! 나 안 넘어져!', 'Mum, look at me! I’m not falling over!'), 'She glances at the window of the tiny house. Nobody is at it.', KS('엄마? …봤어?', 'Mum? …Did you see?')] }],
    mech: [{ type: 'standStill', mark: 'centre', secs: 25, breakLine: 'The snow whirls up again.', give: 'E247',
      winLines: ['You stand still so long that the snow forgets you are there, and settles, flake by flake.', 'For the first time you can see through the glass: an enormous bedroom, a bed, a girl asleep under a lamp.', 'One last flake lands on your sleeve and does not melt.'] }],
    info: { summary: 'Inside a snow globe from Seoul: a tiny house with one lit window, pines, a frozen pond, endless snow.',
      rules: ['Stand still on the worn spot in front of the tiny house for twenty-five seconds: the snow settles.', 'Gives the Shaken Snow (E247). The Test Card’s painted door also leads here.'],
      secrets: ['The Wind-Up Key (E243), used on the music box in the globe’s base (bottom edge), opens the house’s curtains.'],
      lore: 'A souvenir that is always winter, and a child skating for a mother who is not at the window.' } });

  /* ---------------------------------------------------------------
   *  W352 — The Piggy Bank That Saves Days
   * --------------------------------------------------------------- */
  S({ id: 'W352', name: 'The Piggy Bank That Saves Days', depth: 4, tier: 'mid', back: 'W341', backLook: 'pot', backOpt: { c: ['#f0a8b8'] }, backLabel: 'out through the coin slot', backAt: [19, 23],
    map: (function () { var g = K.grid(40, 26, ' '); g.ellipse(19.5, 12.5, 18.5, 11.5, '.'); g.ellipse(19.5, 12.5, 9, 4, ','); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#f0c0c8', '#e0a8b4'] }, floor2: { p: 'dots', c: ['#e8b8c0', '#c8a040'] }, wall: { p: 'flat', c: ['#c87888', '#a85868'] } },
    style: { tallWalls: true, renderer: 'watercolor' }, music: 'piggybank', amb: { type: 'drip', vol: 0.03 }, dark: 0.3,
    doors: [{ to: 'W063', at: [37, 12], look: 'door', opt: { style: 'glass', c: ['#40e0a0'] }, cond: { visits: { W352: 3 } }, label: 'the rubber stopper, open at last, onto a shop that never closes' }],
    place: [{ id: 'c1', type: 'decor', at: [12, 12], look: 'coin', lines: ['A stack of coins.'] },
      { id: 'c2', type: 'decor', at: [17, 12], look: 'coin', lines: ['A stack of coins.'] },
      { id: 'c3', type: 'decor', at: [22, 12], look: 'coin', lines: ['A stack of coins.'] },
      { id: 'c4', type: 'decor', at: [27, 12], look: 'coin', lines: ['A stack of coins.'] },
      { id: 'slot', type: 'decor', at: [19, 1], look: 'skylight', light: 2, lines: ['The coin slot, high above: a long bright crack of bedroom light.', 'Every coin came down through it, one at a time.'] },
      { id: 'scratch', type: 'decor', at: [6, 8], look: 'scuff', solid: false, lines: ['Scratched into the china with the edge of a coin: 1 2 0 4.', 'The number of the flat. The one she must say if she ever gets lost.'] },
      { id: 'pignote', type: 'decor', at: [19, 16], look: 'letter', cond: { flag: 'pig_counted' }, use: [{ note: 'n_pig_wish' }, { secret: 'pig_wish' }],
        lines: ['A note, rolled tight, in a child’s handwriting:', KS('엄마 하루 쉬게 해 주세요. 13,400원.', 'Please let Mum have a day off. 13,400 won.')] },
      SOUL([EN('She fed it the change from her bus fare and walked the last two stops home.')])],
    decor: [{ look: 'coin', n: 3, lines: ['A coin lying flat, face down. It does not want to be counted.'] },
      { look: 'crack', n: 1, lines: ['A hairline crack in the china, from the day it was almost broken open. Nobody had the heart.'] },
      { look: 'sparkle', n: 2, solid: false, lines: ['A glint of light from the slot, landing on a coin like a stamp.'] }],
    npcs: [{ id: 'N1831', name: 'The Pig', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 16,
        ambientLines: [EN('Clink. Another one. Good girl.'), EN('Thirteen thousand four hundred. Not enough for a day. Enough for an afternoon.'), EN('Pigs only open up to friends. Come back. Come back again. The third time, I’ll show you my stopper.')] },
      { id: 'N1832', name: 'A 100-Won Coin', count: 3, look: { t: 'blob', c: ['#c8ccd0'], h: 8 }, behavior: 'wander', radius: 5, speed: 0.6, solid: false, passThrough: true,
        lines: [EN('A hundred won. One sweet. One phone call, a long time ago.'), EN('She counted us every Sunday. She always got the same number, and counted again anyway.')] },
      { id: 'N1833', name: 'A Coin from Outside', look: { t: 'blob', c: ['#d8b860'], h: 9 }, behavior: 'static', solid: true,
        lines: [EN('I am from the country outside the window. The others don’t talk to me much.'), EN('I am worth more than all of them together. Nobody in here believes it.')] }],
    mech: [{ type: 'dials', marks: ['c1', 'c2', 'c3', 'c4'], states: 10, values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], start: [3, 7, 5, 1], target: [1, 2, 0, 4], labelText: 'Coins in this stack: ', sfx: 'coin',
      done: { flag: 'pig_counted' }, doneLine: 'One, two, nothing, four. The stacks stand very still, like a number someone must not forget.',
      winLines: ['One, two, nothing, four.', 'The pig gives a deep china sigh. Something rolls out of the dark: a note, rolled tight.'], reward: [{ set: { pig_counted: true } }] }],
    info: { summary: 'The inside of a pink china piggy bank, lit by the coin slot: four stacks of coins and a child’s savings.',
      rules: ['Each stack gains a coin when touched (back to 0 after 9).', 'Set them to the number scratched on the wall: 1, 2, 0, 4 (the flat number).', 'A note appears: what the money was being saved for.'],
      secrets: ['On the third visit, the rubber stopper opens onto the 24-Hour Store (W063).'],
      lore: 'Savings for a day off for her mother. Never enough.' } });

  /* ---------------------------------------------------------------
   *  W353 — The Seashell from Busan
   * --------------------------------------------------------------- */
  S({ id: 'W353', name: 'The Seashell from Busan', depth: 4, tier: 'hard', back: 'W341', backLook: 'shell', backLabel: 'back out of the shell’s mouth', backAt: [21, 30],
    map: (function () {
      var g = K.grid(44, 32, ' '); g.box(0, 0, 44, 32, '#', '.');
      for (var k = 1; k <= 4; k++) { var o = 3 * k, gy = k % 2 ? o : 31 - o; g.box(o, o, 44 - 2 * o, 32 - 2 * o, '#', null); g.set(21, gy, '.'); g.set(22, gy, '.'); }
      g.vline(27, 13, 18, '#'); g.set(27, 15, '.'); // the innermost whorl
      return g.rows();
    })(),
    look: { floor: { p: 'marble', c: ['#f4e8e0', '#e8d4cc', '#fff4ec'] }, wall: { p: 'waves', c: ['#e8c8c0', '#d8b0a8', '#f8e0d8'] } },
    style: { renderer: 'watercolor' }, music: 'seashell', amb: { type: 'sea', vol: 0.08 }, dark: 0.35,
    doors: [{ id: 'towash', to: 'W346', at: [14, 14], look: 'washer', cond: { flag: 'shell_heard' }, label: 'a round door you had taken for a wave: a washing machine, on spin' },
      { to: 'W130', at: [29, 15], look: 'shoe', label: 'the innermost whorl, opening onto a beach covered in shoes' }],
    place: [{ id: 'whorl', type: 'decor', at: [27, 15], look: 'crack', solid: false, smallOnly: true, lines: ['The last turn of the shell, so narrow that only something very small could squeeze through.', 'Beyond it: the smell of a beach.'] },
      SOUL([KS('부산 바닷가에서 주웠어. 피난 와서 처음 본 바다야.', 'I picked it up on the beach at Busan. The first sea I saw after we fled.')])],
    signs: [{ at: [20, 16], lines: [EN('Speak in the middle of the shell. It never gives back what you said. Give back what it says.')] }],
    decor: [{ look: 'coral', n: 3, lines: ['A frill of pink nacre, like the inside of an ear.'] },
      { look: 'pebbles', n: 3, solid: false, lines: ['Grains of sand from 1953, still waiting to be shaken out.'] },
      { look: 'shoe', n: 1, lines: ['A child’s shoe, a left one, wedged in the pearl. Too small even for you.'] }],
    npcs: [{ id: 'N1834', name: 'A Hermit Crab', look: { t: 'snail', c: ['#d88060'], h: 9 }, behavior: 'wander', radius: 5, speed: 0.4, solid: false,
        lines: [EN('I live in a house that someone else outgrew. It fits. Mostly.'), EN('Say something in the middle. The shell answers with someone else’s word. Give it back, and it opens.'), EN('Right at the end there’s a turn too small even for me. Only something tiny gets through.')] },
      { id: 'N1835', name: 'The Sound of the Sea', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 14,
        ambientLines: ['Shhhh… shhhh…', 'Under the sound of the sea, a rhythm: thump, thump, click. Something turning.', EN('Rinse. Spin.'), 'The sea sound stops for a second, like a machine between two programmes.'] }],
    mech: [{ type: 'echo', zone: [13, 13, 26, 18], words: ['rinse', 'spin', 'again', 'seven', 'warm', 'home'], done: { flag: 'shell_heard' },
      winLines: ['You give the word back. The shell holds it and turns it over,', 'and the sound of the sea becomes the sound of a washing machine on spin, very close.', 'A round door you had taken for a wave opens in the pearl.'],
      reward: [{ set: { shell_heard: true } }] }],
    info: { summary: 'The inside of a conch: whorls of pink nacre winding inwards to a chamber that answers back.',
      rules: ['Walk the whorls to the middle: the openings alternate between top and bottom.', 'In the middle chamber, say anything: the echo answers with another word.', 'Say that word back: a door opens onto the Washing Machine on Spin (W346).'],
      secrets: ['The innermost whorl lets only something tiny through (Tiny): beyond it, a door to the Beach of Shoes (W130).'],
      lore: 'Grandmother’s shell from the beach at Busan, 1953. Inside, the sea sounds like a washing machine.' } });

  /* ---------------------------------------------------------------
   *  W354 — Inside the Bedside Bulb
   * --------------------------------------------------------------- */
  S({ id: 'W354', name: 'Inside the Bedside Bulb', depth: 4, tier: 'hard', back: 'W341', backLook: 'ladder', backLabel: 'down the cord, back into the drawer', backAt: [14, 31],
    map: (function () {
      var g = K.grid(30, 34, ' '); g.ellipse(14.5, 12.5, 13.5, 12, '_'); g.rect(9, 25, 12, 7, '.');
      g.vline(14, 21, 24, '.'); g.hline(14, 21, 21, '.'); g.vline(21, 16, 21, '.'); g.hline(8, 21, 16, '.'); g.vline(8, 11, 16, '.');
      g.hline(8, 19, 11, '.'); g.vline(19, 6, 11, '.'); g.hline(14, 19, 6, '.'); g.vline(14, 3, 6, '.'); g.rect(11, 1, 8, 3, '.');
      g.hline(4, 8, 27, '.'); // the loop that burnt out
      return g.rows();
    })(),
    look: { floor: { p: 'flat', c: ['#ffd860', '#ffc840'] }, pit: { p: 'flat', c: ['#fff8dc', '#fff2c8'] } },
    variants: { dark: { look: { floor: { p: 'flat', c: ['#5a4a38', '#4a3a2a'] }, pit: { p: 'flat', c: ['#1a1810', '#141208'] } } } },
    style: { renderer: 'pixel16' }, music: 'bedsidebulb', amb: { type: 'hum', vol: 0.07 }, extra: { noFurnish: true },
    doors: [{ to: 'W113', at: [4, 27], look: 'lamp', cond: { equipped: 'E245' }, label: 'a burnt-out loop of filament, leading to the other light that nobody turns off' }],
    place: [{ id: 'topview', type: 'decor', at: [15, 1], look: 'window', cond: { flag: 'filament_top' }, use: [{ secret: 'filament_top' }],
        lines: ['From the top of the filament, through the glass: the bedroom, enormous, upside down.', 'A girl asleep below, one arm over her eyes against the light. She has slept like that for three years.'] },
      SOUL([EN('Someone switches it off at seven in the morning, when she gets home. It is the only time it sleeps.')], [19, 30])],
    signs: [{ at: [17, 28], lines: [EN('Walk when it pulses. Stand still when it rests. It is very tired.')] },
      { at: [10, 26], lines: [EN('The loop that burnt out still shows a door to eyes that keep a glow.')] }],
    decor: [{ look: 'spark', n: 3, solid: false, lines: ['A spark jumps off the filament and goes out before it lands.'] },
      { look: 'glint', n: 2, solid: false, lines: ['A speck of tungsten, white-hot, cooling into a star.'] },
      { look: 'scuff', n: 1, solid: false, lines: ['A thread of the screw cap, worn bright from being turned in and out.'] }],
    npcs: [{ id: 'N1836', name: 'A Moth', count: 3, look: { t: 'moth', c: ['#c8b8a0'], h: 8 }, behavior: 'fly', radius: 8, speed: 0.6, solid: false,
        lines: ['A moth bumping against the inside of the glass. It got in once, through a crack, and never left.'] },
      { id: 'N1837', name: 'The Filament', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 15,
        ambientLines: [EN('On. On. On. I have been on every night for three years.'), EN('She is afraid of the dark. I am afraid of the dark too. Neither of us says so.'), EN('Walk when I pulse. Stop when I rest. I am very tired.')] }],
    mech: [{ type: 'rhythmWalk', zone: [11, 1, 18, 3], start: [14, 27], period: 1.3, window: 0.55, lineY: 24, done: { flag: 'filament_top' },
      failText: 'The filament rests. In the dark between two pulses, she slides back down to the cap.',
      winLines: ['You reach the top of the filament, where the light is made. It is so hot it is almost cold.'], reward: [{ set: { filament_top: true } }] }],
    info: { summary: 'The inside of the bulb in her bedside lamp: a glowing zig-zag filament over a vacuum of light.',
      rules: ['Climb the filament from the cap to the top, moving only while it pulses (on the heartbeat).', 'Moving during the pause sends you back to the cap.', 'At the top, a view of the bedroom.'],
      secrets: ['With the Afterglow (E245) on, the burnt-out loop west of the cap shows a door to the Lit Kitchen (W113).'],
      lore: 'The light that is never switched off, and is tired too.' } });

  /* ---------------------------------------------------------------
   *  W355 — The Mother’s Handbag
   * --------------------------------------------------------------- */
  var DOTS = [[27, 11], [23, 11], [19, 11], [19, 15], [23, 15], [27, 15], [27, 19], [23, 19], [19, 19]]; // the lock pattern, an S
  S({ id: 'W355', name: 'The Mother’s Handbag', depth: 4, tier: 'hard', back: 'W171', backLook: 'chair', backLabel: 'out of the bag, into the night corridor', backAt: [23, 30],
    map: (function () { var g = K.grid(46, 32, ' '); g.box(0, 0, 46, 32, '#', '.'); g.rect(17, 9, 13, 13, ','); g.vline(7, 1, 5, '#'); g.hline(1, 7, 5, '#'); g.set(7, 3, '.'); return g.rows(); })(),
    look: { floor: { p: 'carpet', c: ['#2a2430', '#221c28', '#3a3040'] }, floor2: { p: 'grid', c: ['#101820', '#2a4060'] }, wall: { p: 'flat', c: ['#141018', '#0c0810'] } },
    music: 'handbag', amb: { type: 'hum', vol: 0.04 }, dark: 0.65, extra: { noFurnish: true },
    doors: [{ to: 'W347', at: [44, 26], look: 'curtain', opt: { c: ['#9ac0c0'] }, label: 'a work tunic folded at the bottom of the bag; one pocket is open' },
      { id: 'tovoice', to: 'W358', at: [23, 22], look: 'phone', cond: { flag: 'bag_unlocked' }, label: 'into the phone, where the messages wait', locked: 'The phone is locked. Behind the glass, a voice is waiting to be let out.' }],
    place: DOTS.map(function (p, i) { return { id: 'dot' + i, type: 'decor', at: p, look: 'glint', lookOpt: { c: ['#a0d0ff'] }, solid: false, light: 0.6, lines: ['A dot on the lock screen, cold under your feet.'] }; })
      .concat([{ id: 'smudge', type: 'decor', at: [29, 9], look: 'scuff', solid: false, lines: ['Greasy thumb marks on the glass draw a snake:', 'from the top right-hand dot, back and forth, all the way down to the bottom left.'] },
        { id: 'zip', type: 'decor', at: [7, 3], look: 'crack', lookOpt: { c: ['#c8c8d0'] }, solid: false, smallOnly: true, lines: ['A zip, stuck half open. The gap is about the width of a button.'] },
        { id: 'greybutton', type: 'decor', at: [3, 2], look: 'trinket', lookOpt: { c: ['#6a6a72'] },
          lines: [{ if: { notSecret: 'button_pair' }, t: 'In the zipped pocket, wrapped in a tissue: a grey coat button. Four holes. A grey thread in one.' }, { if: { secret: 'button_pair' }, t: 'Two grey buttons in a tissue, side by side. A pair.' }] },
        SOUL([KS('괜찮아. 엄마 하나도 안 피곤해.', 'It’s fine. Mum isn’t tired at all.')])]),
    decor: [{ look: 'keyring', n: 1, lines: ['Her keys: the flat, the hospital locker, the letterbox. And a little plastic star, sticky with years.'] },
      { look: 'drawing', n: 1, lines: ['A child’s drawing folded small as a coin: a woman and a girl holding hands. Not on the fridge. Here.'] },
      { look: 'letter', n: 3, lines: ['A receipt from the 24-hour shop: milk, eggs, one slice of strawberry cake. 07:12.', 'A bus ticket, punched at 20:31 and again at 07:04.', 'In pencil: “소라 학교 상담 — 목요일 네 시”. Sora: school meeting, Thursday, 4 p.m. Rewritten three times.'] },
      { look: 'photo', n: 1, lines: ['A photo booth strip: a woman and a girl pulling faces. In the last one, they are asleep on each other.'] }],
    npcs: [{ id: 'N1838', name: 'The Night Staff Badge', look: H({ t: 'robot', head: 'blank', body: 'suit', c: ['#e8e8f0', '#c8c8d8', '#f0f0f8', '#3060a0'], eyes: 'none', h: 18 }), behavior: 'static', solid: true, at: [36, 6],
        lines: ['A plastic badge on a lanyard: KIM M. — NIGHT STAFF.', EN('Clipped on upside down for six years. Nobody noticed. Nobody looks at badges at four in the morning.')] },
      { id: 'N1839', name: 'A Lipstick Worn Flat', look: H({ t: 'tall', body: 'robe', c: ['#b83a4a', '#8a2a3a', '#d8a0a8', '#202020'], eyes: 'closed', h: 16 }), behavior: 'static', solid: true, at: [10, 24],
        lines: [EN('She puts me on at the bus stop at seven in the morning, so her daughter won’t see her so pale.'), EN('I am down to the stub. She never buys another one. She buys milk.')] },
      { id: 'N1840', name: 'The Lost Button', look: BTN, behavior: 'static', solid: true, at: [4, 3], appearHere: ALLBTN,
        lines: [{ if: { notSecret: 'button_pair' }, seq: ['The little grey button rolls up to the other one in the tissue, and stops.', EN('…That’s mine. That’s my other half. Same grey. Same thread.'), EN('That day, she held on to his coat at the door. Two of us came off. I rolled away. She kept the other.'), EN('I can stop rolling now.')],
          do: [{ secret: 'button_pair' }, { note: 'n_button_pair' }, { cookie: 1 }] },
          EN('Two of us. That’s a pair. That’s enough.')] }],
    mech: [{ type: 'stepOrder', plates: (function () { var o = {}; DOTS.forEach(function (p, i) { o[p[0] + ',' + p[1]] = i; }); return o; })(), count: 9, color: 'rgba(160,210,255,0.9)', give: 'E248',
      winLines: ['The phone unlocks.', 'The wallpaper is a photo of a girl asleep with the light on, taken from the doorway, without the flash.', 'Three missed calls, all from the same name: 소라.', 'The little bead charm hanging from the phone comes away in your hand.'],
      reward: [{ set: { bag_unlocked: true } }] }],
    info: { summary: 'Inside the mother’s handbag, at night: dark lining, keys, receipts, a badge, and a phone lying face up.',
      rules: ['Entered from a chair in the corridors of Mi-ran’s Sleep, or from the tunic pocket.', 'Walk the lock pattern on the phone screen: an S, from the top right dot, back and forth to the bottom left.', 'Gives the Bead Phone Charm (E248) and opens the way into the Voicemail Box (W358).'],
      secrets: ['The zipped pocket in the top left only lets something tiny through (Tiny): inside, a grey coat button.', 'Meet the Lost Button in the drawer, the biscuit tin and the wash: here it finds its other half.'],
      lore: 'What a mother carries all night: the flat’s keys, the school meeting, a drawing folded small, and a button.' } });
  link('W171', { to: 'W355', look: 'chair', label: 'a handbag hanging from a chair in the night corridor' });

  /* ---------------------------------------------------------------
   *  W356 — The Biscuit Tin of Needles
   * --------------------------------------------------------------- */
  S({ id: 'W356', name: 'The Biscuit Tin of Needles', depth: 4, tier: 'hard', back: 'W341', backLook: 'cookiejar', backLabel: 'out over the rim of the tin', backAt: [20, 27],
    map: (function () {
      var g = K.grid(42, 30, ' '); g.ellipse(20.5, 14.5, 19.5, 13.5, '.'); g.ellipse(20.5, 14.5, 6, 4, ',');
      fill(g, [[8, 7], [12, 10], [30, 7], [33, 12], [9, 20], [14, 23], [25, 20], [34, 17], [20, 4], [16, 26]], '^');
      g.hline(4, 9, 14, '%'); g.hline(32, 37, 15, '%'); g.vline(20, 19, 22, '%');
      g.vline(28, 21, 25, '#'); g.hline(28, 33, 21, '#'); g.hline(28, 33, 25, '#'); g.vline(33, 21, 25, '#'); g.rect(29, 22, 4, 3, '.'); g.set(28, 23, '?'); // under the tray
      return g.rows();
    })(),
    look: { floor: { p: 'metal', c: ['#3a5a9a', '#2a4a8a', '#4a6aaa'] }, floor2: { p: 'stripes', c: ['#e8d870', '#d8c860'] }, wall: { p: 'metal', c: ['#c8d0e0', '#a8b0c0', '#e0e8f0'] },
      wall2: { p: 'metal', c: ['#e0e0e8', '#c0c0c8', '#f8f8ff'] }, secret: { p: 'metal', c: ['#c8d0e0', '#a8b0c0', '#e0e8f0'] } },
    tall: { '^': { look: 'barrel', vary: [{ opt: { c: ['#c83040', '#e8e0d0'] } }, { opt: { c: ['#3060c0', '#e8e0d0'] } }, { opt: { c: ['#f0d040', '#e8e0d0'] } }, { opt: { c: ['#40a060', '#e8e0d0'] } }] } },
    music: 'needletin', amb: { type: 'hum', vol: 0.03 }, dark: 0.3,
    doors: [{ id: 'toplush', to: 'W360', at: [3, 14], look: 'wire', opt: { c: ['#d83040'] }, cond: { flag: 'bobbin_caught' }, label: 'a red thread running into a seam, very far away' }],
    place: [{ id: 'realbiscuit', type: 'decor', at: [31, 23], look: 'cookie', cycle: true,
        lines: [{ if: { notSecret: 'tin_real_biscuit' }, t: 'Under the plastic tray, at the very bottom: one real biscuit, still wrapped. The tin kept its promise.', do: [{ secret: 'tin_real_biscuit' }, { cookie: 1 }] },
          { if: { secret: 'tin_real_biscuit' }, t: 'An empty biscuit wrapper, folded into a perfect little square.' }] },
      SOUL([EN('The tin said biscuits. Grandma kept needles in it for thirty years. Every child was fooled once.')])],
    signs: [{ at: [26, 23], lines: [EN('The tin said biscuits. Under the tray, it keeps its word.'), EN('Eyes that see through things will find the way under.')] },
      { at: [20, 9], lines: [EN('A bobbin that runs is a bobbin that wants to be caught. Corner it.')] }],
    decor: [{ look: 'trinket', n: 4, lines: ['A mother-of-pearl button from a wedding dress nobody wears.', 'A school-shirt button, with a scrap of white thread.', 'A wooden toggle from a duffel coat, sitting like a boulder.'] },
      { look: 'puppetstrings', n: 1, lines: ['Threads hanging from nowhere, in every colour, all knotted together at the top.'] },
      { look: 'glint', n: 4, solid: false, lines: ['A pin lying on its side, sharp end towards you.'] }],
    npcs: [{ id: 'N1841', name: 'The Lost Button', look: BTN, behavior: 'wander', radius: 5, speed: 0.8, solid: false, passThrough: true,
        lines: [{ if: { notFlag: 'btn_2' }, seq: [EN('It’s me again. I thought: a tin full of buttons, surely one of them is family.'), EN('They are all very polite. Not one of them is grey.')], do: [{ set: { btn_2: true } }] },
          EN('The old one says grey coat buttons are kept closer to the heart. Buttons don’t have hearts. Do they?'), EN('I’ll keep rolling. Something warm keeps calling me towards the wash.')] },
      { id: 'N1842', name: 'The Button Elder', look: { t: 'blob', c: ['#8a6a4a'], h: 14 }, behavior: 'static', solid: true,
        lines: [EN('Every button in this tin came off something. A coat, a cardigan, a school shirt. We are kept in case.'), EN('In case of what? In case. That is what tins are for.'), EN('That little grey one is not ours. Coat buttons like that are kept closer to the heart. In a bag. Zipped.')] },
      { id: 'N1843', name: 'The Runaway Bobbin', look: { t: 'blob', c: ['#d83040'], h: 9 }, behavior: 'flee', fleeDist: 4, radius: 7, speed: 1.6, solid: false, at: [24, 14],
        lines: [EN('Catch me and I unravel! That’s the whole point of me!')] },
      { id: 'N1844', name: 'A Pin', count: 4, look: H({ t: 'tall', body: 'robe', c: ['#d8d8e0', '#b0b0b8', '#e8e8f0', '#202020'], eyes: 'none', h: 14 }), behavior: 'statue', solid: false, lines: ['A pin standing on its head. Every time you look away, it is a little closer.'] }],
    mech: [{ type: 'corner', ent: 'N1843', done: { flag: 'bobbin_caught' },
      winLines: ['The bobbin has nowhere left to run. It gives up, and unrolls itself at your feet.', 'The red thread runs off across the tin and into a seam, very far away, as if it had always known the way.'],
      reward: [{ set: { bobbin_caught: true } }] }],
    info: { summary: 'A blue biscuit tin that never held biscuits: spools tall as towers, pins, needles, a village of buttons.',
      rules: ['Corner the Runaway Bobbin so it has nowhere to flee (against the pin rows or the edge of the tin).', 'Its thread opens the way into the Plush (W360), on the west side.'],
      secrets: ['Under the plastic tray, in the south-east, a false wall (Glasses): one real biscuit.'],
      lore: 'Grandmother’s sewing tin, and the rule she kept in it: sew it up, so nobody sees.' } });

  /* ---------------------------------------------------------------
   *  W357 — The Test Card at 23:59
   * --------------------------------------------------------------- */
  S({ id: 'W357', name: 'The Test Card at 23:59', depth: 4, tier: 'hard', back: 'W348', backLook: 'tv', backLabel: 'back down the tube', backAt: [2, 26],
    map: (function () {
      var g = K.grid(44, 28, ' '); g.box(0, 0, 44, 28, '#', '.'); var bars = [',', ':', '`', "'", '.', ',', ':'];
      for (var x = 1; x < 43; x++) g.vline(x, 1, 26, bars[Math.floor((x - 1) / 6) % bars.length]);
      g.ellipse(21.5, 13.5, 9, 7, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'flat', c: ['#a8a8a8', '#9c9c9c'] }, floor2: { p: 'flat', c: ['#e8e040', '#dcd430'] }, floor3: { p: 'flat', c: ['#40e0e0', '#34d4d4'] },
      floor4: { p: 'flat', c: ['#40d040', '#34c434'] }, floor5: { p: 'flat', c: ['#d040d0', '#c434c4'] }, wall: { p: 'flat', c: ['#101010', '#080808'] } },
    style: { renderer: 'pixel8' }, music: 'testcard', amb: { type: 'beep', vol: 0.05 }, dark: 0.15,
    doors: [{ id: 'toglobe', to: 'W351', at: [41, 2], arrive: 'centre', look: 'glass', cond: { flag: 'card_door' }, label: 'the door painted behind the girl: it opens onto falling snow' },
      { id: 'tosea', to: 'W176', at: [41, 26], look: 'tv', cond: { fn: snowing }, label: 'static, falling like snow, onto a sea of screens' }],
    place: [{ id: 'card', type: 'decor', at: [21, 12], look: 'screen', lookOpt: { c: ['#c8c8c8'] }, light: 1.2, lines: ['The middle of the test card.'] },
      { id: 'cardclock', type: 'decor', at: [33, 4], look: 'clock', lines: ['The clock in the corner of the card: 23:59. It has said 23:59 for a very long time.'] },
      SOUL([EN('She left the set on the test card so the flat would have a sound. The tone is the same note as the fridge.')])],
    signs: [{ at: [10, 20], lines: [EN('When it snows on the screen, the sea of sets rises to the surface. They say it is only static.')] }],
    decor: [{ look: 'screen', n: 3, lines: ['A bar of pure colour, humming at one frequency.'] },
      { look: 'blackboard', n: 1, lines: ['A blackboard with a chalk house on it. The door of the house is drawn a little too carefully.'] },
      { look: 'glint', n: 4, solid: false, lines: ['A grain of colour that has come loose from its bar.'] }],
    npcs: [{ id: 'N1845', name: 'The Girl on the Test Card', look: H({ t: 'kid', hairStyle: 'short', body: 'dress', c: ['#c83040', '#a02030', '#f0d0b0', '#3a2010'], mouth: 'smile', h: 18 }), behavior: 'static', solid: true, at: [21, 16],
        lines: [EN('I have been waiting for the programmes to start since before you were born.'), EN('They told me: stay right there, smile, don’t move. So I didn’t move.'), EN('Once in a while I look away. Only for one picture. Catch me looking, and you’ll see where.')] },
      { id: 'N1846', name: 'The Toy Rabbit', look: { t: 'rabbit', c: ['#f0e8e0'], h: 10 }, behavior: 'static', solid: true, at: [23, 16],
        lines: ['A toy rabbit, held up so the cameras can focus on it. Its fur is worn away where a hand always holds it.', EN('I have never once been played with. I am only held up.')] },
      { id: 'N1847', name: 'The Tone', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 18,
        ambientLines: ['A long, flat tone. Beeeeeeeeeep.', EN('Normal service will be resumed as soon as possible.'), EN('We apologise for the delay.')] }],
    mech: [{ type: 'cycleFrames', mark: 'card', every: 2, good: 4, done: { flag: 'card_door' },
      frames: ['The test card: colour bars, a circle, the tone. 23:59.', 'The test card. 23:59. The girl smiles at the camera.', 'The test card. 23:59. Nothing starts.', 'The test card. The girl holds up the rabbit, very straight.',
        'For one picture only, the girl looks away from the camera, towards the corner of the card.', 'The test card. The tone goes on.'],
      doneLine: 'The test card. The girl is smiling at you now, not at the camera.',
      winLines: ['You stop the picture on the moment she looks away. You look where she looks.', 'In the corner of the card, a door has been painted. It was always there, behind the rabbit.'],
      reward: [{ set: { card_door: true } }] }],
    info: { summary: 'The test card left on after the last programme: colour bars, a girl holding up a toy rabbit, 23:59.',
      rules: ['Touch the middle of the card when it shows the girl looking away (the fifth of six pictures, 2 s each).', 'A painted door opens in the north-east corner onto the Snow Globe from Seoul (W351).'],
      secrets: ['When it snows here (the Shaken Snow, E247, used twice, or any weather effect),', 'a door appears in the south-east corner onto the Sea of Televisions (W176).'],
      lore: 'Waiting for the programme to start: the same waiting as for someone to come home.' } });

  /* ---------------------------------------------------------------
   *  W358 — The Voicemail Box
   * --------------------------------------------------------------- */
  S({ id: 'W358', name: 'The Voicemail Box', depth: 4, tier: 'hard', back: 'W355', backLook: 'phone', backLabel: 'back out of the phone, into the bag', backAt: [1, 7],
    map: (function () { var g = K.grid(48, 16, ' '); g.box(0, 0, 48, 16, '#', '#'); g.rect(1, 6, 46, 4, '.'); for (var i = 0; i < 6; i++) { var x = 4 + i * 7; g.rect(x, 2, 4, 4, ','); g.rect(x, 10, 4, 4, ','); } return g.rows(); })(),
    look: { floor: { p: 'tileLines', c: ['#6a7078', '#5a6068'] }, floor2: { p: 'carpet', c: ['#3a4048', '#30363e'] }, wall: { p: 'flat', c: ['#1a1e24', '#12161c'], topColor: '#1a1e24' },
      wallface: { p: 'panel', c: ['#4a5058', '#3a4048', '#2a3038'], skirt: '#80c0ff' } },
    style: { tallWalls: true, renderer: 'surveillance' }, music: 'voicemail', amb: { type: 'beep', vol: 0.04 }, dark: 0.45, extra: { noFurnish: true },
    doors: [{ id: 'tofuture', to: 'W172', at: [40, 13], look: 'door', opt: { style: 'glass', symbol: '2044' }, cond: { secret: 'voicemail_future' }, label: 'a saved message from 2044' }],
    place: [{ id: 'm1', type: 'decor', at: [5, 2], look: 'radio', lines: ['Message one. From: 소라. 21:12. Length: 0:00.', 'Listened to: 07:04, on the bus.'] },
      { id: 'm2', type: 'decor', at: [12, 2], look: 'radio', lines: ['Message two. From: 소라. 23:40. Length: 0:02. Someone breathing. Then nothing.', 'Listened to: 07:05.'] },
      { id: 'm3', type: 'decor', at: [19, 2], look: 'radio', lines: ['Message three. From: 소라. 02:17. Length: 0:03. The click of a lamp being switched on.', 'Listened to: 07:05. Saved.'] },
      { id: 'm4', type: 'decor', at: [26, 2], look: 'radio', lines: ['Message four. From: 엄마 (Mum). 2022. Saved. Never deleted.', KS('미란아, 밥은 잘 챙겨 먹니? 소라는 잘 크고?', 'Mi-ran, are you eating properly? Is Sora growing well?')] },
      { id: 'm5', type: 'decor', at: [33, 2], look: 'radio', lines: ['Message five. From: Work. 20:50.', EN('Can you cover tonight as well? Sorry. Thanks. Sorry.')] },
      { id: 'm6', type: 'decor', at: [40, 2], look: 'radio', lines: ['Message six. From: J. 2020. Saved.', EN('Knock knock…'), 'The message stops there. It has always stopped there.'] },
      { id: 'recorder', type: 'decor', at: [45, 7], look: 'phone', light: 1.2, lines: ['A grey recorder at the end of the corridor, its red light blinking.'] },
      SOUL([KS('메시지 다 들었어. 말 안 해도 돼.', 'I listened to all the messages. You don’t have to say anything.')])],
    signs: [{ at: [8, 8], lines: [EN('One word is enough. One word is a lot, for someone who doesn’t speak.')] }],
    decor: [{ look: 'drawer', n: 3, lines: ['A drawer of deleted messages. It is empty. She never deletes anything.', 'A drawer labelled “Saved”. It is full, and very quiet.'] },
      { look: 'monitor', n: 2, lines: ['A small screen: “You have 6 messages.” Nobody has ever pressed the button to call back.'] }],
    npcs: [{ id: 'N1848', name: 'The Voicemail Operator', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#5a6070', '#4a5060', '#e0c8b0', '#2a2a30'], eyes: 'closed', acc: 'phone' }), behavior: 'static', solid: true, at: [43, 8],
        lines: [EN('You have six messages. Three of them are silence. Silence is a message too. We keep it.'), EN('To leave a message, speak to the recorder at the end: who it is for, when she hears it, how long it lasts.'),
          EN('The old system still answers to bells. Ring, and the oldest saved message plays. Nobody rings any more.')],
        onBell: [{ if: { notSecret: 'voicemail_future' }, lines: ['The operator opens her eyes.', EN('A bell. Nobody has rung in years.'), EN('One more saved message, older than all the others. Date: 2044. From: S.'), 'A woman’s voice, tired, kind, that you almost recognise:', EN('Mum? It’s me. I just wanted to hear your voice on the machine.'), 'At the end of the corridor, a door you had not seen lights up.'] },
          { secret: 'voicemail_future' }, { show: 'tofuture' }] },
      { id: 'N1849', name: 'A Waiting Tone', count: 3, look: { t: 'jelly', c: ['rgba(160,200,255,0.6)'], h: 9, glow: '#a0c8ff' }, light: 1, behavior: 'fly', radius: 6, speed: 0.4, solid: false, lines: ['A dial tone drifting down the corridor, looking for someone to pick up.'] }],
    mech: [{ type: 'quiz', mark: 'recorder', intro: ['The red light stops blinking and stays on.', EN('Please record your message after the tone.')],
      questions: [{ q: 'Who is the message for?', choices: ['Mum', 'Dad', 'Nobody'], right: 0 },
        { q: 'When will she hear it?', choices: ['Tonight, at nine', 'At seven, on the bus home', 'Never'], right: 1 },
        { q: 'How long is the message?', choices: ['Zero seconds, like the others', 'One word', 'Everything, all at once'], right: 1 }],
      failLine: 'Beep. Your message has not been saved. Please try again.', doneLine: 'Saved messages: one more. Length: one second.', done: { flag: 'message_saved' },
      winLines: ['Beep.', 'You say it. Only one word. Your own voice, out loud, in a place where it will be kept.', EN('Message saved. Length: one second.')],
      reward: [{ set: { message_saved: true } }, { secret: 'voicemail_word' }, { note: 'n_voicemail_word' }] }],
    info: { summary: 'The voicemail inside the mother’s phone: a grey corridor of saved messages, most of them silent.',
      rules: ['Entered through the unlocked phone in the Mother’s Handbag.', 'At the recorder: the message is for Mum, she hears it at seven on the bus home, and it lasts one word.'],
      secrets: ['Ring a bell near the operator (the Bead Phone Charm, E248, or any bell):', 'the oldest saved message, from 2044, opens a door to the Bedroom of 2044 (W172).'],
      lore: 'The silent calls of a girl who does not speak, kept by a mother who listens to them every morning.' } });

  /* ---------------------------------------------------------------
   *  W359 — Grandmother’s Kimchi Jar
   * --------------------------------------------------------------- */
  S({ id: 'W359', name: 'Grandmother’s Kimchi Jar', depth: 4, tier: 'hard', back: 'W350', backLook: 'onggi', backLabel: 'back up to the lunchbox, smelling of garlic', backAt: [26, 31],
    map: (function () {
      var g = K.grid(44, 34, ' '); g.ellipse(21.5, 16.5, 20.5, 15.5, '.');
      // layers of salted cabbage leaves, each open at one end, alternately
      [26, 21, 16, 11, 6].forEach(function (y, i) {
        var xs = []; for (var x = 0; x < 44; x++) if (g.at(x, y) === '.') xs.push(x);
        var a = xs[0], b = xs[xs.length - 1]; for (var x2 = a; x2 <= b; x2++) g.set(x2, y, '%');
        for (var k = 0; k < 3; k++) g.set(i % 2 ? a + k : b - k, y, '.');
      });
      for (var y = 27; y < 33; y++) for (var x = 0; x <= 18; x++) if (g.at(x, y) === '.') g.set(x, y, '~'); // the brine
      g.rect(11, 28, 3, 2, ','); // a little island in it
      return g.rows();
    })(),
    look: { floor: { p: 'leaves', c: ['#c8d890', '#a8c070', '#e0e8b0'] }, floor2: { p: 'dirt', c: ['#8a6a48', '#7a5a38'] }, wall: { p: 'flat', c: ['#4a3020', '#3a2414'] },
      wall2: { p: 'leaves', c: ['#d8e8a0', '#b8d080', '#f0f4c8'] }, water: { p: 'water', c: ['#c84030', '#b03020', '#e06040', '#f0a080'] } },
    style: { renderer: 'watercolor' }, music: 'kimchijar', amb: { type: 'drip', vol: 0.05 }, dark: 0.5, extra: { noFurnish: true },
    place: [{ id: 'trailstart', type: 'decor', at: [24, 28], look: 'pebbles', lookOpt: { c: ['#d83020'] }, solid: false, lines: ['A pinch of red pepper flakes, spilled in a line, as if someone had walked through here with full hands.'] },
      { id: 'heart', type: 'decor', at: [21, 3], look: 'sprout', lines: ['The heart of the cabbage, pale and sweet, right at the top of the jar.'] },
      { id: 'recipe', type: 'decor', at: [23, 3], look: 'letter', cond: { flag: 'jar_heart' }, use: [{ note: 'n_kimchi_recipe' }, { secret: 'kimchi_recipe' }],
        lines: ['A strip of paper stuck to the inside of the jar, in her handwriting:', KS('배추는 하룻밤 절이고, 아침에 씻어. 서두르면 다 짜.', 'Salt the cabbage overnight, rinse it in the morning. Rush it and it is all salt.')] },
      { id: 'togarden', type: 'door', to: 'W194', at: [11, 28], look: 'gate', lookOpt: { c: ['#8a7a5a'] }, unreachOk: 'across the brine', cond: { secret: 'statue_truth' }, label: 'a little gate in the brine, onto a garden with jars in a row',
        locked: 'Across the brine, a little gate onto a garden in 1952. She would need to know the name carved on this jar.' },
      SOUL([KN('어머니가 하시던 대로 했다. 북에서 하던 대로.', 'I made it the way my mother did. The way we did it in the North.')])],
    signs: [{ at: [30, 29], lines: [EN('Follow the red. She always left a trail when her hands were full.')] }],
    decor: [{ look: 'onggi', n: 2, lines: ['A smaller jar inside the jar. Inside that, probably, a smaller one still.'] },
      { look: 'tuft', n: 3, solid: false, lines: ['A strand of spring onion, soft as a ribbon.'] },
      { look: 'pebbles', n: 2, solid: false, lines: ['Grains of coarse salt, glittering like frost.'] }],
    npcs: [{ id: 'N1850', name: 'Grandmother’s Voice', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 60, ambientEvery: 15,
        ambientLines: [KS('김장은 같이 하는 거야. 혼자 하면 맛이 안 나.', 'Kimjang is something you do together. On your own, it never tastes right.'), KS('소라야, 장갑 껴. 손 매워.', 'Sora, put your gloves on. It’ll sting your hands.'), KS('서두르지 마. 맛은 기다리는 사람한테 와.', 'Don’t rush. Flavour comes to whoever waits.')] },
      { id: 'N1851', name: 'A Clove of Garlic', count: 3, look: { t: 'blob', c: ['#f4ecd8'], h: 9 }, behavior: 'wander', radius: 4, speed: 0.5, solid: false, passThrough: true,
        lines: [EN('She peeled us by the hundred and never once cried. We did the crying for her.'), EN('Every winter the whole street smelled of us. Now it is only this jar.')] },
      { id: 'N1852', name: 'A Red Pepper Flake', count: 4, look: { t: 'ant', c: ['#d83020'], h: 5 }, behavior: 'wander', radius: 3, speed: 0.7, solid: false, passThrough: true, lines: ['A flake of red pepper, walking in a very straight line, as if it knew the way to the heart.'] }],
    mech: [{ type: 'trail', from: 'trailstart', to: 'heart', slack: 1, lostLine: 'The red trail is lost among the leaves. Back to where it began.', done: { flag: 'jar_heart' },
      winLines: ['The trail of red flakes ends at the heart of the cabbage,', 'the sweetest part, the part she always gave to the youngest.', 'Next to it, something has been written down, and kept.'],
      reward: [{ set: { jar_heart: true } }] }],
    info: { summary: 'Inside Grandmother’s kimchi jar: layers of salted cabbage leaves, red brine below, her voice in the walls.',
      rules: ['Entered from the kimchi corner of the Lunchbox, once everything has been tasted.', 'Follow the trail of red pepper flakes from the bottom to the heart of the cabbage at the top.', 'Do not stray from it (one step aside is allowed).', 'At the heart: her recipe.'],
      secrets: ['Across the brine (float or swim: the Puff of Steam, E246), a gate to Ok-sun’s Garden, 1952 (W194).', 'It opens once you know the name on the jar (from the True Statue).'],
      lore: 'Ok-sun’s jar, made the way it was made in the North, eaten all winter in the South.' } });

  /* ---------------------------------------------------------------
   *  W360 — Inside the Plush
   * --------------------------------------------------------------- */
  S({ id: 'W360', name: 'Inside the Plush', depth: 4, tier: 'hard', back: 'W356', backLook: 'wire', backOpt: { c: ['#d83040'] }, backLabel: 'back out along the red thread', backAt: [3, 14],
    map: (function () {
      var g = K.grid(40, 30, ' '); g.ellipse(19.5, 14.5, 18.5, 13.5, '.'); g.scatter(',', '.', 0.2, 360);
      for (var y = 0; y < 30; y++) if (g.at(28, y) === '.' || g.at(28, y) === ',') g.set(28, y, 'e'); // the seam
      g.set(28, 14, '.'); // one stitch missing
      return g.rows();
    })(),
    look: { floor: { p: 'cloud', c: ['#f4ecec', '#e8dcdc', '#fff8f8'] }, floor2: { p: 'cloud', c: ['#e8d8e0', '#f8f0f4'] }, seam: { p: 'stripes', c: ['#c83040', '#f0e0e0'] } },
    style: { renderer: 'crayon', sky: ['#e8c8c8', '#f8e8e8'] }, music: 'insideplush', amb: { type: 'heartbeat', vol: 0.03 }, dark: 0.35,
    doors: [{ to: 'W345', at: [19, 27], look: 'mirror', label: 'a mirror far away, where a little nurse is turning' },
      { id: 'tograve', to: 'W114', at: [6, 6], look: 'toybox', cond: { secret: 'plush_wound' }, label: 'down through the stuffing, to where toys go when nobody holds them any more' }],
    place: [{ id: 'keyslot', type: 'decor', at: [10, 14], look: 'musicbox', lookOpt: { c: ['#e0a0b0'] }, lines: ['A little music box, sewn into the middle of the stuffing, with a key slot shaped like a clover.', 'Its key is missing.'],
        onEffect: { E243: [{ secret: 'plush_wound' }, { show: 'tograve' }, { music: 'lullaby' }, { msg: 'Three turns. The lullaby plays inside the stuffing, muffled, as if through a blanket. A lid creaks below.' }] } },
      { id: 'heart', type: 'decor', at: [33, 14], look: 'heart', lookOpt: { c: ['#d83040'] }, solid: false, lines: ['A heart sewn from red felt, with uneven, careful stitches.'] },
      SOUL([EN('She held it every night the light was on, so the light would have someone to watch.')])],
    signs: [{ at: [24, 20], lines: [EN('A heart that is looked at runs away. Come close without looking straight at it.')] }],
    decor: [{ look: 'tuft', n: 4, solid: false, lines: ['A clump of stuffing pressed into the shape of a hand.'] },
      { look: 'trinket', n: 1, lines: ['A safety eye that came loose and rolls around in here. It still looks at everything.'] },
      { look: 'scraps', n: 2, solid: false, lines: ['A patch of old fabric, mended over with newer fabric. Somebody fixed this more than once.'] }],
    npcs: [{ id: 'N1853', name: 'The Squeaker', look: H({ t: 'robot', body: 'suit', c: ['#e8e0e0', '#c8c0c0', '#f0e8e8', '#3a2a2a'], mouth: 'o', h: 13 }), behavior: 'static', solid: true,
        lines: [EN('I used to say “I love you” when somebody squeezed. Now I say “I lo—”. Nobody squeezes hard enough any more.'), EN('I lo—'), EN('Wind the box in the middle. It plays better than I talk.')] },
      { id: 'N1854', name: 'Grandmother’s Stitches', count: 3, look: { t: 'worm', c: ['#c83040'], h: 7 }, behavior: 'wander', radius: 4, speed: 0.5, solid: false, passThrough: true,
        lines: [KS('꿰매면 돼. 아무도 몰라.', 'Just sew it up. Nobody will know.'), 'A row of small red stitches, walking. They closed a hole in this toy in 2019 and are still very proud of it.'] },
      { id: 'N1855', name: 'A Ball of Stuffing', count: 3, look: ghost('rgba(255,250,250,0.6)', 14), behavior: 'wander', radius: 6, speed: 0.6, solid: false, lines: ['A cloud of stuffing, drifting. It smells of fabric softener and of a pillow.'] }],
    mech: [{ type: 'recede', mark: 'heart', dist: 7, done: { flag: 'plush_heart' },
      winLines: ['The felt heart stops running away and lets itself be held.', 'It is warm. Somebody has been holding it every night for years, and it has kept the warmth like a promise.'],
      reward: [{ set: { plush_heart: true } }, { secret: 'plush_heart' }] }],
    info: { summary: 'The inside of the plush she sleeps with: clouds of stuffing, a red seam, a music box sewn into the middle.',
      rules: ['Entered from the Biscuit Tin (the red thread), from the Dancer’s Mirror, or by the drum’s dark hatch.', 'Behind the seam, a felt heart runs away when you face it: come close from the side, or corner it.'],
      secrets: ['The Wind-Up Key (E243) on the music box in the stuffing plays the lullaby and opens the Toy Graveyard (W114).'],
      lore: 'The toy that kept watch while the light stayed on.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
