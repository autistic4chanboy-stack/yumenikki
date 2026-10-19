/* =========================================================================
 *  NOUVEAUX MONDES (7) — W321 à W340 : LA VILLE DE PAPIER
 *  Une ville pliée dans du papier, où les mots sont contrôlés. Le bureau de
 *  la censure, la bibliothèque des livres noircis, la rue des maisons
 *  d'origami qui se déplient sous la pluie, la presse qui n'imprime que
 *  « FINE », la poste des lettres renvoyées, le kiosque des nouvelles de
 *  demain, la volière de grues, le canyon des broyeuses, la salle des
 *  bulletins scolaires, les archives des noms effacés…
 *  Fil rouge : la phrase découpée « Mum, / I am / not / fine. — Sora ».
 *  Quatre morceaux (W323, W329, W333, W335) ouvrent la Coquille (W339) dans
 *  la presse ; les trois lettres N, O, T (W321) la composent ; la Page non
 *  écrite (W340) attend qu'on la dise en entier.
 *  Effets E237–E242 · habitants N1700–N1747.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret, U = YN.util;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* ajoute une porte dans un monde déjà défini (placée au hasard, puis rendue joignable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  /* il pleut, là, maintenant (pluie de mi-rêve ou Prévisions de demain) */
  function RAIN() { var g = YN.game; return !!(g && g.rt && g.rt.weather && g.rt.weather.rain); }
  var SCRAPS = ['pc_scrap_letter', 'pc_scrap_report', 'pc_scrap_book', 'pc_scrap_name'];

  /* matières de papier */
  var PAPER = { floor: { p: 'paper', c: ['#ece6d8'] }, floor2: { p: 'lines', c: ['#e4ddcc', '#9cb2d2'] }, floor3: { p: 'grid', c: ['#e8e2d2', '#c8c0ae'] },
    wall: { p: 'flat', c: ['#f2ede0', '#d6cebd', '#a89f8c'], topColor: '#f8f4ea' }, wallface: { p: 'paper', c: ['#e6dfcf'] },
    paper: { p: 'paper', c: ['#f4efe2', '#cfc6b2'] }, thin: { p: 'stripes', c: ['#f2ede0', '#2a2a30'] }, secret: { p: 'flat', c: ['#f2ede0', '#d6cebd', '#a89f8c'], topColor: '#f8f4ea' } };
  function look(o) { return Object.assign({}, PAPER, o || {}); }
  var INKWALL = { p: 'flat', c: ['#18181e', '#0e0e12'], topColor: '#18181e' };

  /* les notes qu'elle garde */
  YN.data.notes = YN.data.notes || {};
  Object.assign(YN.data.notes, {
    n_pc_not: { t: 'Three letters ran away from the censor: N, O, T. I caught them. They make a word nobody there may say.' },
    n_pc_book: { t: 'In a library where everything is blacked out, the marker missed one word: “not”.' },
    n_pc_letter: { t: 'A letter, returned to sender. It starts “Mum,” and stops.' },
    n_pc_report: { t: 'A hundred lines of “I am fine”, with “fine” crossed out every time. “I am”, a hundred times.' },
    n_pc_name: { t: 'In the archive of erased names, someone was erasing mine. I took the card before the line was finished.' },
    n_pc_crane: { t: 'A crane unfolded on my shoulder. Inside, a name: 안재식. “It was on the list.”' },
    n_pc_reader: { t: 'Behind a paper wall, the last reader. She reads the black bars. Black, she says, means someone was here.' },
    n_pc_sorry: { t: 'The pulp fisher caught the end of his word. “Sorry.” He didn’t say who it was for.' },
    n_pc_page: { t: 'I said it: I am not fine. Nobody crossed it out. Someone answered.' }
  });

  /* ---------------------------------------------------------------
   *  Les six effets de la ville de papier
   * --------------------------------------------------------------- */
  YN.data.effects.push(
    { id: 'E237', name: 'Censor’s Marker', fam: 'reality', world: 'W322', icon: { glyph: '▬', c: '#18181e' }, action: 'hide', ground: false, core: false,
      desc: 'It smells of the inside of a drawer. What it touches stops being said.',
      use: 'Hide (F): she crosses herself out, a black bar nobody reads. Worn, it opens the doors kept for the crossed-out: the Correctors’ staff door (Censorship Office) and the black door of the Archive of Erased Names.',
      get: 'The Censorship Office: put a form through the trays in the order of the Standing Order — In, Approved, Redacted, Filed, Forgotten.' },
    { id: 'E238', name: 'Correction Fluid', fam: 'reality', world: 'W333', icon: { glyph: '◧', c: '#f4f4ee' }, action: 'erase', ground: false, core: false,
      desc: 'It cannot change what was written. It can only make it white.',
      use: 'Erase (F): rubs out paper walls, like the Eraser. Opens the reading room of the Library of Blacked-Out Books and the oldest report in the Room of School Reports.',
      get: 'The Room of School Reports: read every report written about her.' },
    { id: 'E239', name: 'Tomorrow’s Forecast', fam: 'weather', world: 'W327', icon: { glyph: '☂', c: '#8aa0c0' }, action: 'weather', ground: false, core: false,
      desc: 'Folded in four. It smells of the day after tomorrow.',
      use: 'Weather (F): clear, rain, snow, in turn. Rain unfolds the houses of Origami Street, whatever the hour.',
      get: 'The Kiosk of Tomorrow’s News: take a paper at the moment the headline is the weather.' },
    { id: 'E240', name: 'Paper Doll Chain', fam: 'transformation', world: 'W324', icon: { glyph: '✂', c: '#e8e0cc' }, action: 'fold', caps: ['flat'], ground: false, core: false,
      desc: 'Cut from one sheet. None of them can let go.',
      use: 'Flat: she slips through cracks and thin gaps (|). Fold (F): mark a crease; fold again to come back to it. Opens the paper gap in the Paper City and the crack in the Shredder Canyon.',
      get: 'Origami Street: follow the newspaper footprints across the paper garden without straying.' },
    { id: 'E241', name: 'Return-to-Sender Stamp', fam: 'doors', world: 'W329', icon: { glyph: '↩', c: '#b03030' }, action: 'stamp', ground: false, core: false,
      desc: 'Everything comes back. You might as well decide where.',
      use: 'Stamp (F). On the box addressed TO: NOBODY in the Return-to-Sender Office, it sends the letter back, and a door opens.',
      get: 'The Return-to-Sender Office: tell the postmistress who the returned letters were for.' },
    { id: 'E242', name: 'Pencil Stub', fam: 'reading', world: 'W340', icon: { glyph: '✎', c: '#d8b060' }, action: 'write', ground: false, core: false,
      desc: 'Not a marker. It writes.',
      use: 'Write (F): in the Paper City, what she writes is heard like speech. On the blank line of the Recitation Hall, it opens the way back to the Unwritten Page.',
      get: 'The Unwritten Page: say the whole sentence the Paper City cut into pieces.' }
  );

  /* dans la ville de papier, ce qu'elle écrit compte comme ce qu'elle dit */
  YN.bus.on('write', function (v) {
    var g = YN.game; if (!g || !g.rt || !/^W3(2[1-9]|3\d|40)$/.test(g.rt.id) || !YN.speech) return false;
    var text = String(v || '').trim().slice(0, 80), n = U.norm(text); if (!n) return false;
    if (YN.save.dream) YN.save.dream.said.push(n);
    YN.speech.bubble('player', '✎ ' + text, 3.2);
    YN.speech.dispatch(text, false);
    return true;
  });

  /* ---------------------------------------------------------------
   *  W321 — La Ville de papier (le carrefour)
   * --------------------------------------------------------------- */
  S({ id: 'W321', name: 'The Paper City', depth: 4, tier: 'mid', back: 'W125', backLook: 'door', backOpt: { style: 'wood', c: ['#5a5a6a'] }, backLabel: 'back to the city that replaces itself', outdoor: true,
    gen: { type: 'city', w: 58, h: 42, opts: { block: 6, road: ',', side: '.', building: '#', decor: '{', decorRate: 0.025 } },
    look: look(), tall: { '{': { look: 'lantern', opt: { c: ['#f4efe2'] } } },
    style: { renderer: 'engraving', sky: ['#e8e2d4', '#f6f2e8'] }, music: 'papercity', amb: { type: 'paper', vol: 0.05 }, weather: { leaves: true },
    doors: [{ to: 'W322', look: 'bigdoor', opt: { c: ['#18181e'] }, label: 'the Censorship Office' },
      { to: 'W324', look: 'gate', opt: { c: ['#d8d0bc'] }, label: 'a street of folded houses' },
      { to: 'W325', look: 'door', opt: { style: 'metal', c: ['#4a4a52'], symbol: 'F' }, label: 'the press, still running' },
      { to: 'W326', look: 'door', opt: { style: 'wood', c: ['#8a2a2a'] }, label: 'a hall where children recite' },
      { to: 'W327', look: 'newsstand', label: 'a kiosk selling tomorrow' },
      { to: 'W329', look: 'door', opt: { style: 'wood', c: ['#2a4a8a'], symbol: '↩' }, label: 'a post office with its shutters down' },
      { to: 'W330', look: 'gate', opt: { c: ['#f0ece0'] }, label: 'an aviary of paper' },
      { to: 'W337', look: 'door', opt: { style: 'shoji', c: ['#f4f0e4'] }, cond: { equipped: 'E240' }, label: 'a gap between two buildings, thin as a page' }],
    decor: [{ look: 'poster', n: 3, lines: ['A poster: EVERYTHING IS ███ FINE.', 'A poster: SPEAK CLEARLY. SPEAK LITTLE. SPEAK CORRECTLY.', 'A poster with a face on it. The mouth has been cut out with scissors, very neatly.'] },
      { look: 'crane', n: 4, lines: ['A paper crane on the pavement, one wing crushed by a shoe.', 'A paper crane folded from a bus ticket. It is going nowhere either.'] },
      { look: 'mailbox', n: 2, lines: ['A letterbox stuffed to the slot with blank envelopes.', 'A letterbox. Someone has posted a whole sentence into it, word by word, and the last word got stuck.'] },
      { look: 'banner', n: 1, lines: ['A banner across the street, blank. It has been erased so many times the paper has gone thin as skin.'] }],
    npcs: [{ id: 'N1700', name: 'A Folded Passer-by', count: 4, look: { t: 'cardperson', c: ['#f4f0e4', '#2a2a30'], h: 22 }, behavior: 'wander', radius: 5, speed: 1.1, solid: true,
        lines: [EN('I am ███ fine. Thank you for asking. Nobody asked.'), KS('괜찮아요. 다 괜찮아요. 접어 두면 괜찮아요.', 'I’m fine. It’s all fine. Folded away, it’s fine.'),
          KN('일없습니다. 우리 거리는 언제나 깨끗합니다.', 'It is nothing. Our street is always clean.'), 'He is folded along a crease that runs straight through his mouth.'] },
      { id: 'N1701', name: 'Jong-i, the Paper Boy', look: H({ t: 'kid', head: 'cap', body: 'shirt', c: ['#e8e0cc', '#c8c0aa', '#f0d8c0', '#2a2a2a'], acc: 'newspaper' }), behavior: 'wander', radius: 6, speed: 1.6, solid: true,
        lines: [KS('내일 신문이요! 내일 신문! 아직 아무 일도 안 일어났어요!', 'Tomorrow’s paper! Tomorrow’s paper! Nothing has happened yet!'),
          { seq: [KS('글자 세 개가 도망쳤대요. 뛰면 더 멀리 가요. 천천히 걸어요.', 'They say three letters ran away. If you run, they go further. Walk slowly.'), 'He mimes tiptoeing, then grabbing something small out of the air.'] },
          KS('검열관 아저씨는 “아니”라는 말을 제일 싫어해요.', 'The censor man hates the word “no” most of all.'),
          KS('건물 사이에 종이만 지나갈 수 있는 틈이 있어요. 사람은 너무 두꺼워요.', 'Between two buildings there’s a gap only paper can get through. People are too thick.')] },
      { id: 'N1702', name: 'The Corrector', look: H({ t: 'tall', head: 'square', body: 'suit', c: ['#2a2a30', '#18181e', '#e8e0d0', '#000000'], eyes: 'line', acc: 'baton' }), behavior: 'patrol', path: [[8, 8], [48, 8], [48, 32], [8, 32]], speed: 0.6, solid: true, hearDist: 5,
        lines: [EN('Say something. Anything. I will make it correct.'), EN('A sentence is safest with one word missing.'), EN('Three letters escaped this morning. They will not get far. Letters never do.')],
        hears: [{ any: true, lines: ['He draws a short black line in the air in front of your mouth.', EN('There. Corrected.')] }] },
      { id: 'N1703', name: 'A Loose Letter N', tag: 'pc_letter', look: { t: 'blob', c: ['#18181e'], h: 9 }, behavior: 'wander', radius: 5, speed: 1.2, solid: false, lines: ['A letter N, upside down, trembling. It ran out of a sentence.'] },
      { id: 'N1704', name: 'A Loose Letter O', tag: 'pc_letter', look: { t: 'blob', c: ['#18181e'], h: 9 }, behavior: 'wander', radius: 5, speed: 1.2, solid: false, lines: ['A letter O. It rolls when it is frightened.'] },
      { id: 'N1705', name: 'A Loose Letter T', tag: 'pc_letter', look: { t: 'blob', c: ['#18181e'], h: 9 }, behavior: 'wander', radius: 5, speed: 1.2, solid: false, lines: ['A letter T, holding its arms out, like someone asking to be picked up.'] }],
    mech: [{ type: 'catchN', tag: 'pc_letter', n: 3, noRun: true, flag: 'pc_not', countText: 'Letters # / %', runLine: 'The letter flattens itself against a wall and slides away. Running frightens words.',
      reward: [{ set: { pc_not: true } }, { note: 'n_pc_not' }, { secret: 'pc_letters' }],
      winLines: ['The three letters stop struggling in your hands. N. O. T.', 'Put together, they make a word nobody here is allowed to say.', 'They are warm, as if someone had been holding them for a long time.'] }],
    place: [SOUL([EN('In this city, every sentence has one word missing. People learn to hear the hole.')]),
      SOUL([KS('엄마는 맨날 괜찮대. 종이처럼 접어 놓고 괜찮대.', 'Mum always says she’s fine. She folds it up like paper and says it’s fine.')])],
    info: { summary: 'A city folded out of paper and ink, where every sentence has one word cut out of it.',
      rules: ['Three loose letters (N, O, T) wander the streets: catch all three by touching them, walking — running scares them off. They spell the word the city forbids.', 'Doors to the Censorship Office, Origami Street, the Press, the Recitation Hall, the Kiosk of Tomorrow’s News, the Return-to-Sender Office and the Paper Crane Aviary.'],
      secrets: ['With the Paper Doll Chain (E240) equipped, a gap thin as a page opens between two buildings: Between Two Pages (W337).'],
      lore: 'The censorship of the Paper City is the family rule seen from inside: everything is fine, and the word that would say otherwise has been removed.' } });
  link('W125', { to: 'W321', look: 'door', lookOpt: { style: 'shoji', c: ['#f4f0e4'] }, label: 'a street folded out of paper' });

  /* ---------------------------------------------------------------
   *  W322 — Le Bureau de la censure
   * --------------------------------------------------------------- */
  S({ id: 'W322', name: 'The Censorship Office', depth: 4, tier: 'hard', back: 'W321', backAt: [16, 22], backLabel: 'back out to the paper street',
    map: (function () { var g = K.grid(34, 24, ' '); g.box(0, 0, 34, 24, '#', '.'); for (var y = 8; y <= 17; y += 3) for (var x = 5; x <= 25; x += 4) g.set(x, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#d8d4cc', '#b8b4ac'] }, wall: INKWALL, wallface: { p: 'wallpaper', c: ['#e8e4dc', '#c8c4bc', '#1a1a1a'], skirt: '#101010' }, deco1: { p: 'wood', c: ['#4a4a4a', '#3a3a3a', '#5a5a5a'] } },
    tall: { '{': { look: 'desk' } }, style: { tallWalls: true, renderer: 'mono' }, music: 'censoroffice', amb: { type: 'typewriter', vol: 0.05 },
    doors: [{ to: 'W323', at: [31, 21], look: 'stairsdown', label: 'stairs: CONFISCATED MATERIAL — BASEMENT' },
      { to: 'W338', at: [32, 1], look: 'door', opt: { style: 'metal', c: ['#101010'], symbol: '█' }, cond: { equipped: 'E237' }, label: 'STAFF ONLY — PERSONNEL ALREADY CROSSED OUT' }],
    place: [{ id: 'order', type: 'decor', at: [9, 1], look: 'poster', lines: ['STANDING ORDER: “What comes in is approved. What is approved is redacted. Then filed. Then forgotten.”'] },
      { id: 'trFil', type: 'decor', at: [6, 2], look: 'drawer', lookOpt: { c: ['#6a6a6a'] }, lines: ['A wire tray labelled FILED.'] },
      { id: 'trIn', type: 'decor', at: [11, 2], look: 'drawer', lookOpt: { c: ['#a8a8a8'] }, lines: ['A wire tray labelled IN.'] },
      { id: 'trFor', type: 'decor', at: [16, 2], look: 'drawer', lookOpt: { c: ['#f0f0f0'] }, lines: ['A wire tray labelled FORGOTTEN. It has no bottom.'] },
      { id: 'trApp', type: 'decor', at: [21, 2], look: 'drawer', lookOpt: { c: ['#c8c8c8'] }, lines: ['A wire tray labelled APPROVED.'] },
      { id: 'trRed', type: 'decor', at: [26, 2], look: 'drawer', lookOpt: { c: ['#202020'] }, lines: ['A wire tray labelled REDACTED. Black dust in the corners.'] },
      SOUL([KN('검은 줄 하나면 됩니다. 사람도 그렇게 지워집니다.', 'One black line is all it takes. A person is erased the same way.')])],
    decor: [{ look: 'stamp', n: 3, lines: ['A rubber stamp: FINE. The ink pad is worn through in the middle.', 'A rubber stamp: NOTHING TO REPORT.'] },
      { look: 'trash', n: 2, lines: ['A bin full of black confetti: words, cut out one by one.'] },
      { look: 'lamp', n: 2, lines: ['A desk lamp, angled down at the desk as if questioning it.'] }],
    npcs: [{ id: 'N1706', name: 'The Chief Corrector', at: [16, 5], look: H({ t: 'tall', head: 'square', body: 'suit', c: ['#1a1a20', '#101014', '#e8e0d0', '#000000'], eyes: 'line', acc: 'stamp' }), behavior: 'static', solid: true,
        lines: [EN('Every word that comes in must come out smaller.'), EN('In, approved, redacted, filed, forgotten. That is the whole job. It is a good job.'),
          EN('Staff use their own door. You have to be crossed out yourself to see it.'),
          { if: { equipped: 'E237' }, t: 'Ah. You are one of us now. The staff door is in the far corner. Mind the coffee.', lang: 'en' }] },
      { id: 'N1707', name: 'A Clerk with Black Hands', count: 4, look: H({ t: 'adult', body: 'suit', c: ['#4a4a4a', '#2a2a2a', '#e0d0c0', '#101010'], eyes: 'closed' }), behavior: 'statue', solid: true,
        lines: [KN('일없습니다. 지울수록 깨끗해집니다.', 'It is nothing. The more you erase, the cleaner it gets.'), 'His hands are black to the elbow. He keeps them flat on the desk, like something confiscated.'] },
      { id: 'N1708', name: 'A Word Waiting in the Queue', count: 3, look: { t: 'blob', c: ['#3a3a3a'], h: 10 }, behavior: 'wander', radius: 3, speed: 0.6, solid: false,
        lines: ['A small word, waiting its turn. It is shaking. It is the word “why”.', 'A word waiting for approval. Its ticket says it has been waiting since 1951.'] }],
    effect: { id: 'E237', how: 'mech', mech: { type: 'sequence', order: ['trIn', 'trApp', 'trRed', 'trFil', 'trFor'], passThrough: true, okSfx: 'stamp',
      winLines: ['The last tray swallows the form whole. Somewhere a clerk sighs with relief.', 'A drawer opens by itself. Inside, a censor’s marker, uncapped, still wet.', 'When you pick it up, the tip of your finger goes black and stops being quite there.'] } },
    info: { summary: 'A grey office of desks and wire trays, where words wait in a queue to be made smaller.',
      rules: ['The Standing Order on the wall gives the route of a form: interact with the trays in the order In → Approved → Redacted → Filed → Forgotten (the trays are not in that order on the wall). A wrong tray starts the form again.', 'Reward: the Censor’s Marker (E237).'],
      secrets: ['With the Censor’s Marker equipped, a staff door appears in the top-right corner: the Correctors’ Break Room (W338). The Chief Corrector says so once you wear it.'],
      lore: 'Censorship as office work: tidy, tired, and proud of how clean it leaves things.' } });

  /* ---------------------------------------------------------------
   *  W323 — La Bibliothèque des livres noircis
   * --------------------------------------------------------------- */
  S({ id: 'W323', name: 'The Library of Blacked-Out Books', depth: 4, tier: 'hard', back: 'W322', backLook: 'stairs', backAt: [19, 27], backLabel: 'back up to the office',
    map: (function () { var g = K.grid(40, 30, ' '); g.box(0, 0, 40, 30, '#', '.'); for (var y = 4; y <= 20; y += 4) { g.hline(3, 16, y, '%'); g.hline(23, 36, y, '%'); } g.box(28, 22, 11, 7, 'p', ','); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#3a2c20', '#2c2018', '#4a3a2a'] }, floor2: { p: 'rug', c: ['#5a4a3a', '#4a3a2a'] }, wall: { p: 'flat', c: ['#141010', '#0a0808'], topColor: '#141010' },
      wallface: { p: 'panel', c: ['#3a2a1a', '#2a1a0a', '#1a0a04'], skirt: '#0a0404' }, paper: { p: 'paper', c: ['#e8e0cc', '#b8b0a0'] } },
    tall: { '%': { look: 'bookcase' } }, style: { tallWalls: true, renderer: 'engraving' }, music: 'blackedlibrary', amb: { type: 'pages', vol: 0.05 }, dark: 0.45,
    doors: [{ to: 'W335', at: [20, 1], look: 'door', opt: { style: 'wood', c: ['#2a1a10'], symbol: 'Z' }, label: 'Stack Z: names' },
      { to: 'W200', at: [1, 10], look: 'bookcase', label: 'a shelf that swings round, back to the Dream Archives' }],
    place: [{ id: 'pb1', type: 'decor', at: [6, 2], look: 'book', lines: ['A book.'] }, { id: 'pb2', type: 'decor', at: [30, 2], look: 'book', lines: ['A book.'] },
      { id: 'pb3', type: 'decor', at: [10, 6], look: 'book', lines: ['A book.'] }, { id: 'pb4', type: 'decor', at: [27, 10], look: 'book', lines: ['A book.'] },
      { id: 'pb5', type: 'decor', at: [6, 14], look: 'book', lines: ['A book.'] }, { id: 'pb6', type: 'decor', at: [33, 14], look: 'book', lines: ['A book.'] },
      { id: 'pb7', type: 'decor', at: [12, 18], look: 'book', lines: ['A book.'] }, { id: 'pb8', type: 'decor', at: [26, 18], look: 'book', lines: ['A book.'] },
      /* derrière le mur de papier : la salle de lecture */
      { id: 'unwritten', type: 'decor', at: [36, 24], look: 'book', lookOpt: { c: ['#f4f0e4'] }, lines: ['A book nobody has blacked out. Its pages are blank. It is waiting for someone to write in it first.'], use: [{ secret: 'pc_last_reader' }, { note: 'n_pc_reader' }] },
      SOUL([EN('A book with every word blacked out still weighs the same. That is how you know.')], [30, 26]),
      SOUL([KN('우리 오빠 이름도 여기 어디 검은 줄 밑에 있습니다.', 'My big brother’s name is under a black line somewhere in here too.')])],
    decor: [{ look: 'book', n: 4, lines: ['A book in which every line is blacked out except the page numbers.', 'A cookbook. All the ingredients blacked out. Only “serves one” remains.', 'A children’s dictionary. The entry for “mother” is a single black brick.', 'A book of fairy tales. Every ending is blacked out. Every one.'] },
      { look: 'lamp', n: 2, lines: ['A reading lamp with a black shade. It lights only the black.'] },
      { look: 'chair', n: 2, lines: ['A reading chair. The seat is still warm. The book on it is closed.'] }],
    npcs: [{ id: 'N1709', name: 'The Librarian with the Marker', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#2a2a30', '#1a1a20', '#e0c8b0', '#c8c8c8'], acc: 'book' }), behavior: 'patrol', path: [[19, 2], [19, 26]], speed: 0.35, solid: true,
        lines: [EN('Shh. Silence is the only thing in here we have not blacked out.'), EN('Every black bar has a twin somewhere on the shelves. Open two that match and they forgive each other.'), EN('The reading room was walled up with paper. Paper is only paper.')] },
      { id: 'N1710', name: 'A Reader with a Black Bar for Eyes', count: 2, look: H({ t: 'adult', body: 'sweater', c: ['#4a3a2a', '#3a2a1a', '#e0c0a0', '#000000'], eyes: 'none' }), behavior: 'static', solid: true,
        lines: ['She reads the black, line by line, moving her lips.', 'He turns a page. It is as black as the last one. He nods, as if it was a good chapter.'] },
      { id: 'N1711', name: 'The Last Reader', at: [33, 25], look: H({ t: 'old', hairStyle: 'long', body: 'robe', c: ['#e8e0cc', '#c8c0aa', '#e0c8b0', '#e8e8e8'], acc: 'candle' }), behavior: 'static', solid: true,
        lines: [EN('You rubbed out the wall. Then you are a reader. There are not many of us left.'), EN('They black out the books so we read the black. Black is a colour too. It says: someone was here.')] }],
    mech: [{ type: 'pairs', tiles: ['pb1', 'pb2', 'pb3', 'pb4', 'pb5', 'pb6', 'pb7', 'pb8'], flag: 'pc_scrap_book', wrongLine: 'Two different silences. The books shut again.', doneLine: 'The books lie open, matched. The black has stopped mattering.',
      reward: [{ set: { pc_scrap_book: true } }, { note: 'n_pc_book' }, { secret: 'pc_scrap_book' }],
      winLines: ['The last two black bars match. The pages unstick from each other.', 'In the whole library, the marker missed one word. It is very small. It is “not”.', 'You tear it out along the line. It fits in your palm. It is one piece of a sentence.'] }],
    info: { summary: 'Rows of shelves where every book has been blacked out, line by line.',
      rules: ['Eight books lie open on the floor. Open them two at a time: each shows the shape of its black bar. Match all four pairs (memory). A mismatch closes both.', 'Reward: the scrap “not”, one of the four pieces of the sentence (see the Press That Only Prints Fine).'],
      secrets: ['The reading room, bottom right, is walled with paper: rub it out with the Eraser (E10) or the Correction Fluid (E238), or pass with the Doodle. Inside, the Last Reader and the one unwritten book.', 'A shelf on the left wall swings back to the Dream Archives (W200).'],
      lore: 'What is blacked out is not gone: the black remembers the shape of what it hides.' } });
  link('W200', { to: 'W323', look: 'bookcase', label: 'a shelf where every spine is black' });

  /* ---------------------------------------------------------------
   *  W324 — La Rue d'origami
   * --------------------------------------------------------------- */
  S({ id: 'W324', name: 'Origami Street', depth: 4, tier: 'hard', back: 'W321', backLook: 'gate', backOpt: { c: ['#d8d0bc'] }, backAt: [1, 13], backLabel: 'back to the paper city', outdoor: true,
    map: (function () {
      var g = K.grid(52, 28, '#');
      g.rect(1, 1, 50, 1, '.'); for (var x = 8; x < 50; x += 8) g.rect(x, 1, 2, 8, '.');
      g.rect(1, 9, 50, 2, '.'); g.rect(1, 11, 50, 5, ','); g.rect(1, 16, 50, 1, '.');
      /* le jardin de papier, derrière une haie épaisse : une seule entrée */
      g.rect(1, 19, 49, 7, ':'); g.set(3, 17, ':'); g.set(3, 18, ':');
      var gaps = { 8: 24, 14: 20, 20: 24, 26: 20, 32: 24, 38: 20, 44: 24 };
      U.keys(gaps).forEach(function (k) { g.vline(+k, 19, 25, '{'); g.set(+k, gaps[k], ':'); });
      return g.rows();
    })(),
    look: look({ floor3: { p: 'paper', c: ['#e0d8c4'] }, deco1: { p: 'paper', c: ['#d8d0bc', '#b8b09c'] }, wall: { p: 'flat', c: ['#f0e8d8', '#d0c4ac', '#a89a80'], topColor: '#f6f0e2' } }),
    tall: { '{': { look: 'bush', opt: { c: ['#ece6d6', '#cfc6b2'] } } }, style: { renderer: 'watercolor', sky: ['#d8dce4', '#eef0f4'] }, music: 'origamistreet', amb: { type: 'wind', vol: 0.04 },
    mech: [{ type: 'weatherWhen', cond: { remainingMod: { every: 100, under: 35 } }, weather: { rain: true } }],
    doors: [{ to: 'W331', at: [50, 13], look: 'manhole', label: 'a storm drain at the end of the street' }],
    place: [{ id: 'toW328', type: 'door', to: 'W328', at: [12, 9], look: 'door', lookOpt: { style: 'shoji', c: ['#f0ece0'] }, cond: { fn: RAIN }, label: 'a paper house, unfolded by the rain' },
      { id: 'tStart', type: 'decor', at: [3, 20], look: 'shoe', lines: ['A shoe folded out of newspaper. Its footprints lead off into the paper garden.'] },
      { id: 'tDoll', type: 'decor', at: [48, 22], look: 'doll', solid: false, lines: ['A chain of paper dolls, pinned under a stone. Holding hands. Waiting to be followed to.'] },
      SOUL([EN('Paper only tells the truth when it is wet.')]),
      SOUL([KS('우리 집은 비 올 때만 문이 생겨.', 'Our house only gets a door when it rains.')])],
    decor: [{ look: 'lantern', n: 3, lines: ['A paper lantern. Its candle is drawn on.', 'A paper lantern. In the rain it goes soft, and you can see the drawn flame shiver.'] },
      { look: 'pot', n: 2, lines: ['A paper flowerpot. The flower is a folded receipt.'] },
      { look: 'puddle', n: 2, lines: ['A puddle. The paper street around it has gone soft and see-through.'] }],
    npcs: [{ id: 'N1712', name: 'An Origami Neighbour', count: 3, look: H({ t: 'adult', head: 'box', body: 'dress', c: ['#f0ece0', '#d8d0bc', '#f0e0d0', '#2a2a2a'], mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [EN('When it rains, we unfold. It is the only time anyone sees inside.'), KS('비 오면 집이 펴져요. 그때만 안이 보여요.', 'When it rains, the houses unfold. That’s the only time you can see inside.'),
          { if: { fn: RAIN }, t: 'In the rain her face unfolds a little. Underneath is a younger face that has been crying for years.' }] },
      { id: 'N1713', name: 'A Folded Child', look: H({ t: 'kid', head: 'box', body: 'shirt', c: ['#e8e0cc', '#c8c0aa', '#f0d8c0', '#2a2a2a'] }), behavior: 'wander', radius: 4, speed: 1.2, solid: true,
        lines: [{ seq: [KS('저기 신문지 발자국 따라가 봐. 벗어나면 처음부터야.', 'Follow the newspaper footprints over there. Step off and you start again.'), 'He points through the gap in the hedge, towards the paper garden.'] }] }],
    effect: { id: 'E240', how: 'mech', mech: { type: 'trail', from: 'tStart', to: 'tDoll', slack: 1, lostLine: 'The footprints go on without you. Back to the newspaper shoe.',
      winLines: ['The last footprint is exactly the size of your shoe.', 'Under the stone, the paper dolls let go of the stone and take hold of you instead.', 'Flat, light, many: you could slip through a crack now.'] } },
    info: { summary: 'A watercolour street of origami houses; in the rain, they unfold.',
      rules: ['It rains here for a while every hundred seconds of dream (or whenever Tomorrow’s Forecast, E239, makes it rain). While it rains, the paper house above the north pavement unfolds into a door: the House Folded Eight Times (W328).', 'In the paper garden behind the hedge, newspaper footprints lead from a newspaper shoe to a chain of paper dolls: follow them without straying more than a step. Straying sends you back. Reward: the Paper Doll Chain (E240).'],
      secrets: ['The house door exists only in the rain.', 'The storm drain at the east end leads down to the Shredder Canyon (W331).'],
      lore: 'Houses that only open when they are soaked: people who only show the inside when they cry.' } });

  /* ---------------------------------------------------------------
   *  W325 — La Presse qui n'imprime que FINE
   * --------------------------------------------------------------- */
  YN.defDialogue('pc_ri325', {
    who: 'Comrade Typesetter Ri',
    branches: [
      { if: { flag: SCRAPS }, lines: [KN('네 조각이 다 모였습니다. 아래층에 한 장을 잘못 찍어 두었습니다. 딱 한 장입니다.', 'All four pieces are here. I have misprinted one sheet, downstairs. Just one.'), 'He points at a door behind him that was not there a moment ago.'] },
      { if: { flag: 'pc_press_crossed' }, lines: [KN('여기까지 건너오셨군요. 조각을 넷 다 모아 오시면, 딱 한 번 다른 문장을 짜 드리겠습니다.', 'You crossed all the way here. Bring me all four pieces and I will set a different sentence. Just once.'),
        'He counts on his fingers: a letter that came back, a report, a book, a name.'] },
      { lines: [KN('이 인쇄기는 한 낱말만 찍습니다. 〈FINE〉. 일없습니다.', 'This press prints one word only: “FINE”. It is nothing.'), KN('글자가 네 개뿐입니다. 에프, 아이, 엔, 이. 그거면 다 됩니다.', 'We have only four letters. F, I, N, E. That is all anyone needs.')] }
    ]
  });
  S({ id: 'W325', name: 'The Press That Only Prints Fine', depth: 4, tier: 'hard', back: 'W321', backAt: [15, 28], backLabel: 'back out to the paper street',
    map: (function () { var g = K.grid(30, 30, ' '); g.box(0, 0, 30, 30, '#', '.'); g.rect(1, 3, 28, 16, ':'); g.hline(1, 28, 2, '#'); g.hline(11, 18, 2, '.'); g.vline(5, 21, 28, '#'); g.hline(1, 5, 21, '#'); g.set(5, 24, '?'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#5a5650'] }, floor3: { p: 'metal', c: ['#6a6a70', '#4a4a50'] }, wall: { p: 'flat', c: ['#2a2622', '#1a1612'], topColor: '#2a2622' }, wallface: { p: 'metal', c: ['#4a4640', '#3a3630', '#2a2620'], skirt: '#1a1612' },
      secret: { p: 'flat', c: ['#2a2622', '#1a1612'], topColor: '#2a2622' } },
    style: { tallWalls: true, renderer: 'charcoal' }, music: 'finepress', amb: { type: 'machine', vol: 0.09 },
    doors: [{ to: 'W339', at: [17, 1], look: 'stairsdown', cond: { flag: SCRAPS }, label: 'stairs down to the one misprint' }],
    place: [{ id: 'typecase', type: 'decor', at: [2, 23], look: 'drawer', lookOpt: { c: ['#3a3a3a'] }, lines: ['The drawer of confiscated type: every letter that is not F, I, N or E. Thousands, oiled, never used.', 'Right at the back, three letters have been taken out recently. The dust shows their shapes: N, O, T.'], use: [{ secret: 'pc_typecase' }] },
      SOUL([KN('〈FINE〉을 백만 장 찍었습니다. 한 장도 읽히지 않았습니다.', 'We printed a million “FINE”s. Not one was read.')], [3, 26]),
      SOUL([EN('The machine breathes in, then stamps. Walk while it stamps. Stand while it breathes.')])],
    decor: [{ look: 'crate', n: 3, lines: ['A crate of printed sheets. FINE. FINE. FINE. The ink is still wet on every one.'] },
      { look: 'banner', n: 1, lines: ['A banner: TODAY’S OUTPUT — 1,000,000 FINES. TARGET EXCEEDED.'] },
      { look: 'wheel', n: 2, lines: ['A cog the size of a door, turning with a sound like someone swallowing.'] }],
    npcs: [{ id: 'N1714', name: 'Comrade Typesetter Ri', at: [14, 1], look: H({ t: 'old', head: 'cap', body: 'apron', c: ['#3a3a3a', '#2a2a2a', '#e0c8a8', '#c8c8c8'], eyes: 'closed', acc: 'newspaper' }), behavior: 'static', solid: true, dialog: 'pc_ri325' },
      { id: 'N1715', name: 'A Press Worker', count: 2, look: H({ t: 'adult', body: 'uniform', c: ['#4a5a6a', '#3a4a5a', '#e0c8b0', '#1a1a1a'], acc: 'tray' }), behavior: 'static', solid: true,
        lines: [KS('수고하셨습니다… 저는 아직 근무 중이에요. 삼십 년째요.', 'Thanks for your hard work… I’m still on shift. Thirty years now.'),
          { seq: [KS('쿵 할 때만 걸어요. 조용할 때 움직이면 처음으로 돌아가요.', 'Only walk on the thump. Move in the quiet and you go back to the start.'), 'He stamps his foot twice, in time with the machine, then freezes.'] },
          KS('압수한 활자는 왼쪽 아래 벽 뒤에 있대요. 그 벽, 진짜 벽 아니에요.', 'They say the confiscated type is behind the wall, bottom left. That wall isn’t a real wall.')] }],
    mech: [{ type: 'rhythmWalk', zone: [11, 1, 18, 2], start: [15, 26], lineY: 19, period: 1.3, window: 0.5, flag: 'pc_press_crossed', failText: 'The press slams down in the quiet. She is back at the start, a little flatter.',
      reward: [{ set: { pc_press_crossed: true } }, { secret: 'pc_press_crossed' }],
      winLines: ['You reach the typesetter’s corner without being pressed.', 'The machine breathes on behind you. Under the lamp, an old man sets the word he has set all his life.'] }],
    info: { summary: 'A charcoal press hall where a giant machine prints a single word, day and night: FINE.',
      rules: ['The press floor (metal plates) can only be crossed on the beat: walk while the machine thumps, stand still in the quiet, or you are sent back to the start. Reach the typesetter’s corner at the top.', 'Comrade Typesetter Ri will set a different sentence once you bring him its four pieces: the scrap from the Library of Blacked-Out Books, the returned letter (Return-to-Sender Office), the punishment lines (Room of School Reports) and the name (Archive of Erased Names). Then a stair appears beside him: The Misprint (W339).'],
      secrets: ['A ? wall on the left, low down, opens with a revealing effect (Glasses): the drawer of confiscated type, where three letters are missing.'],
      lore: 'One million copies of a word nobody reads. The one sentence that matters will be printed once, by mistake.' } });

  /* ---------------------------------------------------------------
   *  W326 — La Salle de récitation
   * --------------------------------------------------------------- */
  S({ id: 'W326', name: 'The Recitation Hall', depth: 4, tier: 'hard', back: 'W321', backAt: [15, 20], backLabel: 'back out to the paper street',
    map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.'); for (var y = 7; y <= 16; y += 3) for (var x = 5; x <= 25; x += 4) g.set(x, y, '{'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#b08a5a', '#8a6a44', '#c8a070'] }, wall: { p: 'flat', c: ['#4a2a20', '#3a1a10'], topColor: '#3a2018' }, wallface: { p: 'panel', c: ['#e8d8b8', '#c8b898', '#8a1a1a'], skirt: '#6a1a1a' } },
    tall: { '{': { look: 'schooldesk' } }, style: { tallWalls: true }, music: 'recitation', amb: { type: 'anthem', vol: 0.03 },
    doors: [{ to: 'W333', at: [27, 1], look: 'door', opt: { style: 'wood', c: ['#5a3a2a'], symbol: '✓' }, cond: { flag: 'pc_recited' }, label: 'the staff room' }],
    place: [{ id: 'chalkboard', type: 'decor', at: [15, 1], look: 'blackboard', lines: ['ORAL TEST.'] },
      { id: 'tdesk', type: 'decor', at: [15, 4], look: 'desk', lines: ['The teacher’s desk. In the drawer, a list of answers that are never on the walls. The list is empty.'],
        listen: [{ match: ['no', 'nope', '아니', '아니요', '아니오', '싫어', '싫어요', '아닙니다'], exact: true, do: [{ set: { pc_said_no: true } }, { secret: 'pc_said_no' }, { sfx: 'reveal' }],
          lines: ['The whole class stops reciting at once.', 'In the silence, a door you had not seen creaks open in the corner. It smells of chalk and of 1989.'] }] },
      { id: 'post1', type: 'decor', at: [4, 1], look: 'poster', lines: ['A poster: “HOW ARE YOU? — FINE, THANK YOU.”'] },
      { id: 'post2', type: 'decor', at: [8, 1], look: 'poster', lines: ['A poster: “WHAT IS MISSING? — NOTHING.”'] },
      { id: 'post3', type: 'decor', at: [22, 1], look: 'poster', lines: ['A poster: “WHO IS CRYING? — NOBODY.”'] },
      { id: 'toW115', type: 'door', to: 'W115', at: [1, 20], look: 'door', lookOpt: { style: 'wood', c: ['#6a5a3a'], symbol: '1989' }, cond: { flag: 'pc_said_no' }, label: 'a back door, into another school, another year' },
      { id: 'toW340', type: 'door', to: 'W340', at: [28, 20], look: 'door', lookOpt: { style: 'shoji', c: ['#ffffff'] }, cond: { equipped: 'E242' }, label: 'the blank line at the bottom of the wall' },
      SOUL([EN('There is one answer that is never on the walls. It is the shortest one.')])],
    decor: [{ look: 'banner', n: 1, lines: ['A banner above the board: WE HAVE NOTHING TO ENVY. Underneath, in pencil, very small: “except”.'] },
      { look: 'loudspeaker', n: 1, lines: ['A loudspeaker. It is reciting too, a little behind the children.'] }],
    npcs: [{ id: 'N1716', name: 'The Recitation Teacher', at: [12, 3], look: H({ t: 'adult', hairStyle: 'bun', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c8b0', '#1a1a1a'], mouth: 'smile', acc: 'baton' }), behavior: 'static', solid: true,
        lines: [KN('따라 하십시오. 〈나는 행복합니다.〉', 'Repeat after me. “I am happy.”'), { seq: [KN('칠판 앞으로 나오십시오. 정답은 벽에 다 붙어 있습니다.', 'Come up to the blackboard. The right answers are all on the walls.'), 'She taps the posters with her pointer, one after another.'] }, 'She smiles with the corners of her mouth only.'] },
      { id: 'N1717', name: 'A Reciting Child', count: 6, look: { t: 'cardperson', c: ['#f0ece0', '#8a1a1a'], h: 18 }, behavior: 'static', solid: true,
        lines: [KN('우리는 세상에 부러운 것이 없습니다!', 'We have nothing in the world to envy!'), KS('괜찮아요. 괜찮아요. 괜찮아요.', 'I’m fine. I’m fine. I’m fine.'), EN('I am fine, thank you, and you?'), 'He recites with his eyes shut, very fast, so as not to hear what he is saying.',
          'A girl at the back mouths a two-letter word, over and over, without a sound, eyes on the teacher’s desk.'] }],
    mech: [{ type: 'quiz', mark: 'chalkboard', flag: 'pc_recited', intro: ['The blackboard wipes itself clean. Chalk writes, in a round, patient hand: “ORAL TEST. ANSWER CORRECTLY.”'],
      questions: [{ q: 'How are you?', choices: ['Tired.', 'Fine, thank you.', '…'], right: 1 }, { q: 'What is missing in our city?', choices: ['A word.', 'Nothing.', 'Someone.'], right: 1 }, { q: 'Who is crying at the back?', choices: ['Nobody.', 'Me.', 'A girl.'], right: 0 }],
      failLine: 'A red cross appears beside your name. The children do not turn round. They are far too polite.', doneLine: 'Three gold stars beside your name. They have not moved.',
      reward: [{ set: { pc_recited: true } }],
      winLines: ['Three gold stars appear beside your name. They are heavy, like coins.', KN('잘했습니다. 이제 모두와 똑같습니다.', 'Well done. Now you are the same as everyone.'), 'Behind the teacher, the staff-room door unfolds itself.'] }],
    info: { summary: 'A red-and-cream hall where paper children recite approved phrases in three languages.',
      rules: ['The blackboard holds an oral test. The “right” answers are the approved ones printed on the posters: “Fine, thank you”, “Nothing”, “Nobody”. Three right answers open the staff room: the Room of School Reports (W333).'],
      secrets: ['Say “no” (or 아니) beside the teacher’s desk: the class falls silent and a back door appears in the bottom-left corner, into the School of 1989 (W115).', 'With the Pencil Stub (E242) equipped, the blank line at the bottom-right of the wall opens onto the Unwritten Page (W340).'],
      lore: 'Learning the right answer and learning to lie are taught in the same lesson.' } });

  /* ---------------------------------------------------------------
   *  W327 — Le Kiosque des nouvelles de demain
   * --------------------------------------------------------------- */
  S({ id: 'W327', name: 'The Kiosk of Tomorrow’s News', depth: 4, tier: 'hard', back: 'W321', backLabel: 'back to the paper city', outdoor: true,
    gen: { type: 'empty', w: 44, h: 32, opts: { floor: '.', border: '#' } },
    look: look({ floor: { p: 'paper', c: ['#e4dcc8'] } }), style: { renderer: 'collage', sky: ['#e8e0d0', '#f8f4ea'] }, music: 'tomorrowkiosk', amb: { type: 'wind', vol: 0.05 }, weather: { leaves: true },
    doors: [{ to: 'W176', look: 'door', opt: { style: 'metal', c: ['#5a5a5a'] }, cond: { realHour: [1, 5] }, label: 'the kiosk’s back shutter, raised before the papers come' }],
    place: [{ id: 'kiosk', type: 'decor', at: [22, 15], look: 'newsstand', lines: ['Tomorrow’s papers.'] },
      SOUL([EN('Only the forecast is never censored. Nobody thinks the rain has opinions.')])],
    decor: [{ look: 'newsstand', n: 3, lines: ['A kiosk with its shutter down. Painted on it: SOLD OUT OF TODAY.'] },
      { look: 'bench', n: 2, lines: ['A bench made of folded newspapers. Today’s date is on all of them. Nobody sits on today.'] },
      { look: 'trash', n: 2, lines: ['A bin full of yesterday’s tomorrows.'] }],
    npcs: [{ id: 'N1718', name: 'Jong-i, the Paper Boy', at: [24, 16], look: H({ t: 'kid', head: 'cap', body: 'shirt', c: ['#e8e0cc', '#c8c0aa', '#f0d8c0', '#2a2a2a'], acc: 'newspaper' }), behavior: 'static', solid: true,
        lines: [KS('내일 신문 사세요! 아직 아무 일도 안 일어났어요!', 'Buy tomorrow’s paper! Nothing has happened yet!'), KS('날씨만 진짜예요. 나머지는 다 미리 고쳐 놨어요.', 'Only the weather is real. Everything else has been corrected in advance.'),
          KS('아주 늦은 밤에 오면 가판대 뒤 셔터가 올라가 있어요. 신문 오기 전에요.', 'Come very late at night and the shutter behind the kiosk is up. Before the papers arrive.')] },
      { id: 'N1719', name: 'A Reader of Tomorrow', count: 3, look: H({ t: 'adult', head: 'bag', body: 'coat', c: ['#6a6a5a', '#4a4a3a', '#c9a878', '#1a1a1a'], acc: 'newspaper' }), behavior: 'wander', radius: 4, speed: 0.8, solid: true,
        lines: [EN('I read tomorrow every morning. It is always fine. Then it happens, and it isn’t.'), EN('I look for my name in tomorrow’s paper. It is never there. I think that is good news.')] },
      { id: 'N1720', name: 'A Loose Page', count: 4, look: { t: 'bird', c: ['#f0ece0'], h: 9 }, behavior: 'fly', radius: 8, speed: 1.4, solid: false, lines: ['A page from tomorrow, flapping. Blank on both sides: tomorrow has not been written yet.'] }],
    effect: { id: 'E239', how: 'mech', mech: { type: 'cycleFrames', mark: 'kiosk', every: 2.4, good: 3,
      frames: ['The front page: TOMORROW, EVERYTHING WILL HAVE BEEN FINE.', 'The front page: TOMORROW, A GIRL WILL SAY A WORD. (THE WORD HAS BEEN REMOVED.)', 'The front page: MOTHER HOME AT SEVEN. The photo shows a closed door.', 'The front page: TOMORROW’S WEATHER — RAIN, ALL DAY, ON PAPER.', 'The front page: TOMORROW, NOTHING HAPPENED.', 'The front page: THIS NEWSPAPER WILL BE YESTERDAY’S.'],
      winLines: ['You take the paper at the exact moment the headline says rain.', 'It is damp already. Folded in four, it smells of the day after tomorrow.'] } },
    info: { summary: 'A paper square with one open kiosk, selling tomorrow’s news while the headlines change every few seconds.',
      rules: ['The kiosk’s front page changes every couple of seconds. Take a paper when it shows the weather (“RAIN, ALL DAY, ON PAPER”): the only headline nobody corrects. Reward: Tomorrow’s Forecast (E239).'],
      secrets: ['Between 1:00 and 5:00 (real time), the shutter behind the kiosk is raised: a door to the Sea of Televisions (W176). Jong-i says so.'],
      lore: 'News written in advance, already corrected; only the weather is allowed to be true.' } });

  /* ---------------------------------------------------------------
   *  W328 — La Maison pliée huit fois
   * --------------------------------------------------------------- */
  S({ id: 'W328', name: 'The House Folded Eight Times', depth: 4, tier: 'hard', back: 'W324', backLook: 'door', backOpt: { style: 'shoji', c: ['#f0ece0'] }, backAt: [10, 22], backLabel: 'back out into the rain',
    map: (function () {
      var g = K.grid(28, 24, ' '); g.box(0, 0, 28, 24, '#', '.'); g.vline(20, 1, 22, '#'); g.set(20, 3, 'l');
      /* les plis : le seul chemin honnête dans la bande de droite */
      g.vline(23, 1, 4, 'l'); g.hline(21, 26, 4, 'l');
      [[5, 26], [9, 21], [13, 26], [17, 21]].forEach(function (r) { g.hline(21, 26, r[0], 'x'); g.set(r[1], r[0], 'l'); });
      g.vline(26, 5, 8, 'l'); g.hline(21, 26, 8, 'l'); g.vline(21, 9, 12, 'l'); g.hline(21, 26, 12, 'l'); g.vline(26, 13, 16, 'l'); g.hline(21, 26, 16, 'l'); g.vline(21, 17, 21, 'l'); g.hline(21, 25, 21, 'l');
      return g.rows();
    })(),
    look: { floor: { p: 'paper', c: ['#ece4d0'] }, line: { p: 'lines', c: ['#ece4d0', '#b8a888'] }, wall: { p: 'flat', c: ['#d8ccb4', '#b8ac94'], topColor: '#c8bca4' }, wallface: { p: 'paper', c: ['#e4dcc8'] } },
    style: { tallWalls: true, renderer: 'collage' }, music: 'foldedhouse', amb: { type: 'paper', vol: 0.05 },
    place: [{ id: 'bx1', type: 'block', at: [6, 8], look: 'crate', lookOpt: { c: ['#e8e0cc'] }, lines: ['A folded paper box, heavy as a drawer full of letters.'] },
      { id: 'bx2', type: 'block', at: [14, 15], look: 'crate', lookOpt: { c: ['#e8e0cc'] }, lines: ['A folded paper box. Something inside slides about when you push it.'] },
      { id: 'pl1', type: 'plate', at: [10, 8], look: 'chalkmark', lines: ['A crease in the floor, pressed very hard, the shape of a box.'] },
      { id: 'pl2', type: 'plate', at: [14, 11], look: 'chalkmark', lines: ['A crease in the floor, the shape of a box.'] },
      { id: 'toW337', type: 'door', to: 'W337', at: [18, 2], look: 'door', lookOpt: { style: 'shoji', c: ['#f4f0e4'] }, cond: { flag: 'pc_unfolded' }, label: 'the last fold' },
      { id: 'bed', type: 'decor', at: [3, 18], look: 'bed', lookOpt: { c: ['#f0ece0', '#c8c0aa'] }, lines: ['A bed folded in half, with the blanket inside it.'] },
      { id: 'table', type: 'decor', at: [5, 13], look: 'table', lines: ['A table set for two, folded so the second plate is underneath.'] },
      { id: 'photo', type: 'decor', at: [16, 20], look: 'photo', lines: ['A family photo, folded so one person is behind the others. Through the paper: the shape of a suitcase.'] },
      { id: 'jcase', type: 'decor', at: [24, 21], look: 'suitcase', lines: ['A suitcase, folded flat as a letter. On the handle tag, a single initial: “J.”', 'Inside, nothing but creases. Someone folded the leaving away so carefully it fits in a drawer.'], use: [{ secret: 'pc_suitcase_flat' }] },
      SOUL([EN('Walk the creases, not the paper. The creases are where the house is honest.')], [18, 5]),
      SOUL([KS('아빠 가방도 접어서 넣어 놨어. 납작하게.', 'I folded Dad’s suitcase away too. Flat.')], [22, 19])],
    npcs: [{ id: 'N1721', name: 'The Folded Mother', at: [4, 3], look: H({ t: 'adult', hairStyle: 'bun', head: 'box', body: 'apron', c: ['#f0ece0', '#d8d0bc', '#f0e0d0', '#2a1a10'], eyes: 'line' }), behavior: 'static', solid: true,
        lines: [KS('괜찮아. 엄마는 접혀 있어도 괜찮아.', 'It’s fine. Mum’s fine, even folded.'), KS('여덟 번 접으면 아무도 못 봐. 엄마도.', 'Fold something eight times and nobody can see it. Not even Mum.'),
          { seq: [KS('저쪽 방은 주름만 밟아. 종이를 밟으면 벽이야.', 'In that room over there, step only on the creases. Step on the paper and it’s a wall.'), 'She points with her one visible eye towards the narrow room on the right.'] }, 'She is folded so small that only one eye still shows. It is open. It is very tired.'] },
      { id: 'N1722', name: 'A Crease', count: 2, look: ghost('rgba(200,190,170,0.45)', 16), behavior: 'wander', radius: 3, speed: 0.6, solid: false, lines: ['A crease that walks about on its own, looking for something to fold.'] }],
    mech: [{ type: 'push', blocks: ['bx1', 'bx2'], plates: ['pl1', 'pl2'], flag: 'pc_unfolded', sfx: 'paper', reward: [{ set: { pc_unfolded: true } }, { secret: 'pc_unfolded' }],
      winLines: ['Both boxes sit in their creases. The house sighs, and one fold comes undone in the corner.', 'Behind it there is no room. Only the gap between two sheets of paper.'] }],
    info: { summary: 'Inside an origami house folded eight times: rooms tucked under rooms, a mother folded very small.',
      rules: ['Push the two paper boxes onto the two creases pressed into the floor (walk into a box to push it). The last fold opens: Between Two Pages (W337).'],
      secrets: ['The strip on the right is a maze of invisible walls; only the creases drawn on the floor are the real path. At the bottom, Dad’s suitcase, folded flat.'],
      lore: 'What the family folds away so as not to see it: the father’s leaving, the mother’s tiredness.' } });

  /* ---------------------------------------------------------------
   *  W329 — Le Bureau des retours à l'envoyeur (P3)
   * --------------------------------------------------------------- */
  S({ id: 'W329', name: 'The Return-to-Sender Office', depth: 3, tier: 'hard', back: 'W138', backAt: [16, 18], backLabel: 'back to the post office of impossible letters',
    map: (function () { var g = K.grid(32, 20, ' '); g.box(0, 0, 32, 20, '#', '.'); g.hline(4, 27, 7, 'u'); g.set(16, 7, '.'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#8a6a48', '#6a4a30', '#9a7a58'] }, counter: { p: 'wood', c: ['#5a3a20', '#4a2a10', '#6a4a30'] }, wall: { p: 'flat', c: ['#2a1e14', '#1e140c'], topColor: '#2a1e14' }, wallface: { p: 'panel', c: ['#a07a50', '#805a30', '#5a3a1a'], skirt: '#7a1a1a' } },
    style: { tallWalls: true, renderer: 'sepia' }, music: 'returnoffice', amb: { type: 'clock', vol: 0.04 },
    doors: [{ to: 'W334', at: [2, 17], look: 'stairsdown', label: 'stairs down to the sorting belt' },
      { to: 'W321', at: [30, 12], look: 'door', opt: { style: 'shoji', c: ['#f4f0e4'] }, label: 'out into the paper city' }],
    place: [{ id: 'nobodybox', type: 'decor', at: [26, 10], look: 'mailbox', lookOpt: { c: ['#7a1a1a'] }, lines: ['A red box. Its label: TO: NOBODY. It is full to the slot and still taking letters.'],
        onEffect: { E241: [{ set: { pc_nobody_returned: true } }, { secret: 'pc_nobody_returned' }, { sfx: 'stamp' }, { msg: 'You stamp the box: RETURN TO SENDER. Every letter inside rustles and turns round.' }, { msg: 'Behind the box, a door you had not noticed is now addressed to somewhere.' }, { reeval: true }] } },
      { id: 'toW168', type: 'door', to: 'W168', at: [28, 10], look: 'door', lookOpt: { style: 'wood', c: ['#6a4a2a'] }, cond: { flag: 'pc_nobody_returned' }, label: 'a door addressed to all the mothers' },
      SOUL([EN('A letter that comes back is still a letter. It has just been everywhere except where it was going.')]),
      SOUL([KS('엄마, 나 사실…', 'Mum, the truth is, I…')])],
    decor: [{ look: 'letter', n: 4, lines: ['A returned envelope: “To: the person who sleeps in the daytime.” Stamped: NOT KNOWN AT THIS ADDRESS.', 'A returned envelope in a child’s writing: “To: 엄마.” The clerk has circled the word in pencil, puzzled.', 'A returned envelope with no address at all, only a drawing of a lit window.', 'A returned envelope from a city in the south, 1952: “To my big brother, on the next train.”'] },
      { look: 'crate', n: 2, lines: ['A sack of returned mail, tied with string. The label says: TOO LATE.'] },
      { look: 'wallclock', n: 1, lines: ['A clock whose hands go backwards, slowly, the way letters come home.'] }],
    npcs: [{ id: 'N1723', name: 'The Postmistress of Returns', at: [10, 6], look: H({ t: 'old', hairStyle: 'bun', head: 'cap', body: 'uniform', c: ['#2a4a8a', '#1a3a7a', '#d8b898', '#c8c8c8'], acc: 'stamp' }), behavior: 'static', solid: true, hearDist: 4,
        lines: [EN('Everything comes back here. Love, bills, apologies. Mostly apologies.'), EN('The red box is for letters to nobody. A stamp would send them home. I am not allowed to.'), { seq: [EN('Who was your letter for? Say it to me. I’ll check the register.'), 'She opens a ledger as thick as a pillow and waits, pen raised.'] }] },
      { id: 'N1724', name: 'A Returned Letter', count: 4, look: { t: 'moth', c: ['#f0e8d8'], h: 8 }, behavior: 'fly', radius: 6, speed: 1.2, solid: false, lines: ['A letter flapping its flap. It has come back so many times its corners have gone soft.'] },
      { id: 'N1725', name: 'A Man Waiting for a Reply', look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c8b0', '#1a1a1a'], acc: 'briefcase' }), behavior: 'static', solid: true,
        lines: [KS('답장을 기다리고 있어요. 1989년부터요. 늦어도 괜찮아요.', 'I’m waiting for a reply. Since 1989. It’s fine if it’s late.'), 'He checks his watch, then the door, then his watch.'] }],
    effect: { id: 'E241', how: 'mech', mech: { type: 'sayTo', ent: 'N1723', dist: 4, words: ['mum', 'mom', 'mother', 'mummy', 'mommy', 'mama', 'umma', 'eomma', '엄마', '어머니', '엄마한테'],
      wrong: { t: 'Nobody by that name at any address I know. Try the person it was really for.', lang: 'en', who: 'The Postmistress of Returns' },
      reward: [{ set: { pc_scrap_letter: true } }, { note: 'n_pc_letter' }, { secret: 'pc_scrap_letter' }],
      winLines: ['She runs her finger down the register. She stops. She does not look up.', EN('Mum. Yes. We have a great many of those. They all come back.'), 'She hands you a returned letter. It begins “Mum,” and then nothing. Someone meant to write the rest.', EN('Keep my stamp too. Everything comes back. You might as well be the one who decides where.')] } },
    info: { summary: 'A sepia post office where every letter comes back, unopened.',
      rules: ['Tell the postmistress, out loud, who the returned letters were for: “Mum” (엄마). Reward: the Return-to-Sender Stamp (E241) and the returned letter “Mum,”, one of the four pieces of the sentence.'],
      secrets: ['Use the Return-to-Sender Stamp on the red box marked TO: NOBODY: a door appears beside it, to the Museum of Mothers (W168).'],
      lore: 'The letters children write to parents who are never awake when they arrive.' } });
  link('W138', { to: 'W329', look: 'door', lookOpt: { style: 'wood', c: ['#7a1a1a'], symbol: '↩' }, label: 'a chute marked RETURNED' });

  /* ---------------------------------------------------------------
   *  W330 — La Volière des grues de papier
   * --------------------------------------------------------------- */
  S({ id: 'W330', name: 'The Paper Crane Aviary', depth: 4, tier: 'hard', back: 'W321', backLook: 'gate', backOpt: { c: ['#f0ece0'] }, backAt: [18, 26], backLabel: 'back to the paper city', outdoor: true,
    map: (function () { var g = K.grid(36, 30, ' '); g.ellipse(17.5, 14.5, 17, 14, '#'); g.ellipse(17.5, 14.5, 15.5, 12.5, '.'); g.rect(4, 13, 2, 3, '_'); return g.rows(); })(),
    look: look({ floor: { p: 'paper', c: ['#f0ece2'] }, wall: { p: 'flat', c: ['#e8e2d2', '#c8c0ae', '#9a9280'], topColor: '#f4f0e6' }, pit: { p: 'void', c: ['#1a1a1a'] } }),
    style: { renderer: 'watercolor', sky: ['#f4f2ec', '#ffffff'] }, music: 'craneaviary', amb: { type: 'birds', vol: 0.03 }, weather: { petals: true },
    fall: { to: 'W331', arrive: 'fallin' },
    place: [{ id: 'perch', type: 'decor', at: [18, 14], look: 'nest', lookOpt: { c: ['#e8e0cc'] }, solid: false, lines: ['A nest of shredded paper, right in the middle. Big enough to stand in.'] },
      SOUL([KN('천 마리를 접으면 소원이 이루어진다고 했습니다. 소원은 이름 하나였습니다.', 'They said fold a thousand and your wish comes true. The wish was a single name.')]),
      SOUL([EN('The floor is torn near the west bars. Below, something is chewing paper.')])],
    decor: [{ look: 'crane', n: 5, lines: ['A crane that fell. Its name has run in the rain.', 'A crane folded from a school report. You can still read “does not participate”.', 'A crane folded from a ration card, 1951.'] },
      { look: 'pillar', n: 4, lines: ['A pillar of stacked paper, folded into bars.'] },
      { look: 'lantern', n: 2, lines: ['A paper lantern with a crane painted on it, flying the wrong way.'] }],
    npcs: [{ id: 'N1726', name: 'The Woman Who Folds', at: [21, 24], look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#f0ece0', '#c8c0b0', '#e0c0a0', '#d8d8d8'], eyes: 'closed', acc: 'crane' }), behavior: 'static', solid: true,
        lines: [KN('지워진 이름 하나에 학을 한 마리씩 접습니다. 천 마리가 넘었습니다.', 'I fold one crane for each erased name. There are more than a thousand.'),
          { seq: [KN('가만히 서 계십시오. 학은 움직이지 않는 사람한테만 내려앉습니다.', 'Stand still. Cranes only land on people who do not move.'), 'She points at the nest in the middle of the cage, then holds herself very still, to show you.'] },
          KN('학 안에는 이름이 들어 있습니다. 이름은 기록실에 가서 소리 내어 불러 주어야 합니다.', 'There is a name inside every crane. A name must be taken to the archive and called aloud.'),
          'She glances at the torn floor by the west bars, where the chewing is loudest, and shakes her head.'] },
      { id: 'N1727', name: 'A Paper Crane', count: 8, look: { t: 'bird', c: ['#f4f0e6'], h: 10 }, behavior: 'fly', radius: 8, speed: 1.1, solid: false,
        lines: ['A paper crane. On its wing, very small, a name you cannot read.', 'A crane folded so tightly it can no longer open its beak.'] }],
    mech: [{ type: 'standStill', mark: 'perch', secs: 20, flag: 'pc_crane_name', breakLine: 'The cranes scatter. You moved.',
      reward: [{ set: { pc_crane_name: true } }, { note: 'n_pc_crane' }, { secret: 'pc_crane_landed' }],
      winLines: ['You stand still so long the cranes forget you are not a perch.', 'The biggest one lands on your shoulder and unfolds itself, very carefully, into a sheet of paper.',
        'On it, a name in an old hand, nearly erased: 안재식 — Ahn Jae-sik. Under it: “It was on the list.”', 'The paper folds itself back into a crane and flies up to the top of the cage, to wait.'] }],
    info: { summary: 'A round white aviary where a thousand paper cranes fly, each with an erased name inside.',
      rules: ['Stand still in the paper nest at the centre for twenty seconds: the biggest crane lands and unfolds the name it carries, Ahn Jae-sik (안재식). That name can be called aloud in the Archive of Erased Names (W335).'],
      secrets: ['The floor is torn near the west bars: push into the hole and you fall into the Shredder Canyon (W331).'],
      lore: 'One crane for each person removed from the record; the wish is always the same: a name said again.' } });

  /* ---------------------------------------------------------------
   *  W331 — Le Canyon des broyeuses
   * --------------------------------------------------------------- */
  S({ id: 'W331', name: 'The Shredder Canyon', depth: 4, tier: 'hard', back: 'W324', backLook: 'ladder', backAt: [1, 12], backLabel: 'back up the storm drain',
    map: (function () { var g = K.grid(60, 24, '#'); g.rect(1, 8, 58, 9, '.'); g.ellipse(30, 12, 8, 6, '.'); g.rect(14, 11, 3, 3, '_'); g.rect(47, 2, 7, 3, ','); g.vline(50, 5, 7, '|'); return g.rows(); })(),
    look: { floor: { p: 'paper', c: ['#bab4a6'] }, floor2: { p: 'paper', c: ['#d8d2c4'] }, wall: { p: 'flat', c: ['#3a3a40', '#2a2a30', '#1a1a20'], topColor: '#2a2a30' }, wallface: { p: 'metal', c: ['#5a5a62', '#4a4a52', '#2a2a30'] },
      thin: { p: 'stripes', c: ['#3a3a40', '#d8d2c4'] }, pit: { p: 'void', c: ['#050505'] } },
    style: { renderer: 'charcoal' }, music: 'shreddercanyon', amb: { type: 'machine', vol: 0.1 }, weather: { ash: true }, dark: 0.3,
    fall: { to: 'W332' },
    doors: [{ to: 'W334', at: [58, 12], look: 'hatch', label: 'a conveyor hatch, back up to the sorting belt' }],
    place: [{ id: 'fallin', type: 'decor', at: [8, 10], look: 'scraps', solid: false, lines: ['A soft heap of shredded paper. Something landed here not long ago.'] },
      { id: 'toW337', type: 'door', to: 'W337', at: [52, 3], look: 'door', lookOpt: { style: 'shoji', c: ['#f4f0e4'] }, unreachOk: 'through a crack only something flat can pass (Paper Doll Chain)', label: 'a gap between two pages' },
      { id: 'crevnote', type: 'decor', at: [48, 3], look: 'letter', lines: ['A sheet that slipped into the crack, not the shredder. It says only “dear”. All of it, whole.'], use: [{ secret: 'pc_crevice' }] },
      SOUL([EN('Everything they shred falls here. Every sentence, one strip at a time. Nobody comes to put them back.')]),
      SOUL([EN('A crack in the north wall, thin as a page. Only something flat could fit.')])],
    decor: [{ look: 'scraps', n: 5, lines: ['A drift of shreds. On one strip: “…ine”. The rest of the word is somewhere else.', 'Shreds from a school report, a love letter and a confession, mixed so well they agree now.'] },
      { look: 'wheel', n: 3, lines: ['A cog as big as a house, made of cardboard, turning slowly towards nothing.'] }],
    npcs: [{ id: 'N1728', name: 'Jong-i, Lost', look: H({ t: 'kid', head: 'cap', body: 'shirt', c: ['#c8c0aa', '#a8a08a', '#f0d8c0', '#2a2a2a'], acc: 'newspaper' }), behavior: 'static', solid: true,
        lines: [KS('신문 돌리다가 길을 잃었어. 여긴 다 잘게 잘린 내일이야.', 'I got lost on my paper round. Everything here is tomorrow, cut into strips.'),
          { seq: [KS('큰 종이가 떨어지면 그 그림자 밑에 있어. 그럼 안 잘려.', 'When the big sheet comes down, stay under its shadow. Then you don’t get cut.'), 'He points up. High above the canyon, an enormous page drifts in slow circles.'] },
          KS('북쪽 벽에 종잇장만 한 틈이 있어. 납작해지면 들어갈 수 있을 텐데.', 'There’s a crack in the north wall, thin as a sheet. If you were flat, you could get in.')] },
      { id: 'N1729', name: 'A Shred', count: 6, look: { t: 'worm', c: ['#e8e4d8'], h: 6 }, behavior: 'wander', radius: 4, speed: 0.9, solid: false,
        lines: ['A strip of paper, wriggling. On it: “sor…”. It is looking for the rest of itself.'] }],
    mech: [{ type: 'followShadow', center: [30, 12], r: 5, speed: 0.25, secs: 22, flag: 'pc_canyon_shadow', breakLine: 'The shadow slides off you. Shreds fall in your hair.',
      reward: [{ set: { pc_canyon_shadow: true } }, { secret: 'pc_canyon_shadow' }, { cookie: 1 }],
      winLines: ['The great page settles at last, gently, over you, like a sheet pulled up to the chin.', 'Under it, for a moment, nothing is being cut. On its underside, in a child’s hand: “goodnight”.'] }],
    info: { summary: 'A charcoal canyon whose walls are shredder teeth, where cut-up sentences fall like snow.',
      rules: ['A huge page circles above the plaza in the middle of the canyon. Stay inside its shadow for twenty-two seconds without leaving it. Reward: a biscuit and a goodnight.', 'The holes in the canyon floor (shredder mouths) drop you into the Pulp Sea (W332).'],
      secrets: ['A crack in the north wall (thin gap |) can only be crossed flat, with the Paper Doll Chain (E240): behind it, an unshredded sheet and a way Between Two Pages (W337).', 'You also land here if you fall through the torn floor of the Paper Crane Aviary.'],
      lore: 'Where the city’s corrections end up: every sentence that was too much, cut so fine it can no longer mean anything.' } });

  /* ---------------------------------------------------------------
   *  W332 — La Mer de pâte
   * --------------------------------------------------------------- */
  S({ id: 'W332', name: 'The Pulp Sea', depth: 4, tier: 'hard', back: 'W331', backLook: 'ladder', backAt: [5, 18], backLabel: 'climb back up to the canyon', outdoor: true,
    map: (function () {
      var g = K.grid(50, 36, '~');
      g.path(12, 16, 18, 9, 'w', 2); g.path(12, 20, 20, 26, 'w', 2); g.path(26, 9, 34, 14, 'w', 2); g.path(40, 17, 41, 26, 'w', 2); g.path(29, 27, 38, 28, 'w', 2);
      g.ellipse(8, 18, 6, 5, '.'); g.ellipse(22, 9, 6, 4, '.'); g.ellipse(24, 26, 7, 5, '.'); g.ellipse(38, 14, 7, 5, '.'); g.ellipse(42, 28, 5, 4, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'paper', c: ['#a8a49a'] }, water: { p: 'water', c: ['#8a8680', '#7a766e', '#9a968e', '#c8c4b8'] }, shallow: { p: 'water', c: ['#a09c94', '#948f86', '#b0aca2', '#d8d4ca'] } },
    style: { renderer: 'silhouette', sky: ['#6a6862', '#9a968c'] }, music: 'pulpsea', amb: { type: 'sea', vol: 0.06 }, dark: 0.35,
    place: [{ id: 'lp1', type: 'decor', at: [22, 8], look: 'lantern', lines: ['A paper lantern on a stick, unlit.'] },
      { id: 'lp2', type: 'decor', at: [40, 13], look: 'lantern', lines: ['A paper lantern on a stick, unlit.'] },
      { id: 'lp3', type: 'decor', at: [42, 30], look: 'lantern', lines: ['A paper lantern on a stick, unlit.'] },
      { id: 'lp4', type: 'decor', at: [25, 28], look: 'lantern', lines: ['A paper lantern on a stick, unlit.'] },
      { id: 'toW336', type: 'door', to: 'W336', at: [21, 25], look: 'hole', cond: { flag: 'pc_pulp_lit' }, label: 'where the pulp turns black' },
      { id: 'toW195', type: 'door', to: 'W195', at: [36, 16], look: 'door', lookOpt: { style: 'wood', c: ['#e8d8a0'] }, cond: { flag: 'pc_sorry' }, label: 'a kitchen door floating on the pulp' },
      SOUL([EN('Everything shredded ends up as pulp. Pulp ends up as paper. The paper ends up blank. That is the plan.')])],
    decor: [{ look: 'boat', n: 1, lines: ['A paper boat, sodden, still floating out of politeness.'] },
      { look: 'scraps', n: 3, lines: ['A clot of pulp with half a word in it: “fin…”.', 'A clot of pulp with half a word in it: “…ther”. It could have been mother. It could have been other.'] }],
    npcs: [{ id: 'N1730', name: 'The Pulp Fisher', at: [9, 21], look: H({ t: 'old', head: 'hood', body: 'coat', c: ['#5a5a52', '#3a3a32', '#d8c0a0', '#c8c8c8'], acc: 'lantern' }), behavior: 'static', solid: true, hearDist: 4,
        lines: [EN('I fish for words. Mostly I catch halves.'), EN('Light all four lanterns before the first one goes out. The pulp only parts for light.'), EN('Forty years ago I caught “sor”. I am still waiting for the rest of it.')],
        hears: [{ match: ['sorry', 'im sorry', 'i m sorry', 'ry', '미안해', '미안', '미안해요', '죄송합니다'], lines: ['He reels in, very slowly. On the hook: the other half of a word. “…ry.”', EN('Sor-ry. There. I have been trying to finish that word for forty years.'), 'He puts it in his pocket. He does not say who it was for. Behind him, a door is floating on the pulp.'],
          do: [{ set: { pc_sorry: true } }, { secret: 'pc_sorry' }, { note: 'n_pc_sorry' }] }] },
      { id: 'N1731', name: 'A Floating Half-Word', count: 4, look: { t: 'fish', c: ['#d8d4c8'], h: 8 }, behavior: 'swim', radius: 6, speed: 0.6, solid: false, lines: ['Half a word, floating belly-up.'] }],
    mech: [{ type: 'lampsAll', lamps: ['lp1', 'lp2', 'lp3', 'lp4'], time: 45, flag: 'pc_pulp_lit', onLine: 'It is already lit. It will not stay lit for ever.',
      litLines: ['The lantern catches.', 'One lantern. The pulp under it thins a little.', 'Two. Faint words surface and sink again.', 'Three. The grey water holds its breath.'],
      reward: [{ set: { pc_pulp_lit: true } }, { secret: 'pc_pulp_lit' }],
      winLines: ['The fourth lantern catches. Their light runs together across the grey water.', 'Where it meets, the pulp turns black: ink, welling up from below. A way down.'] }],
    info: { summary: 'A grey sea of paper pulp, islands linked by shallow fords, under a sky the colour of wet newsprint.',
      rules: ['Light the four paper lanterns on the islands; each goes out again forty-five seconds after it is lit, so light them all in one go. Then the pulp turns to ink beside the southern island: a way down to the Inkwell (W336).'],
      secrets: ['The Pulp Fisher has half a word on his hook: “sor…”. Say the end of it (“sorry”, 미안해) near him: a kitchen door floats up, to the Kitchen of 1989 (W195).'],
      lore: 'Everything cut up turns back into blank paper; the half-words float up first.' } });

  /* ---------------------------------------------------------------
   *  W333 — La Salle des bulletins scolaires
   * --------------------------------------------------------------- */
  S({ id: 'W333', name: 'The Room of School Reports', depth: 4, tier: 'hard', back: 'W326', backAt: [8, 18], backLabel: 'back to the recitation hall',
    map: (function () { var g = K.grid(26, 20, ' '); g.box(0, 0, 26, 20, '#', '.'); g.box(19, 6, 6, 8, 'p', ','); return g.rows(); })(),
    look: { floor: { p: 'tile', c: ['#d8d8d0', '#b8b8b0'] }, floor2: { p: 'paper', c: ['#e8e0cc'] }, wall: { p: 'flat', c: ['#4a4038', '#3a3028'], topColor: '#3a322c' }, wallface: { p: 'paper', c: ['#f0ece2'] }, paper: { p: 'paper', c: ['#f0ece2', '#c8c0b0'] } },
    style: { tallWalls: true, renderer: 'crayon' }, music: 'schoolreports', amb: { type: 'whispers', vol: 0.04 },
    place: [{ id: 'r1', type: 'decor', at: [4, 1], look: 'frame', lines: ['TERM REPORT, Year 7. Conduct: quiet. Participation: none. Comment: “Sora does not answer when spoken to.”'] },
      { id: 'r2', type: 'decor', at: [9, 1], look: 'frame', lines: ['TERM REPORT. Written work: good. Oral: no mark (did not speak). Comment: “Is everything all right at home?”'] },
      { id: 'r3', type: 'decor', at: [14, 1], look: 'letter', lines: ['A note to parents, never signed, never returned: “Please contact the school about your daughter’s silence.”'] },
      { id: 'r4', type: 'decor', at: [1, 10], look: 'drawing', lines: ['Punishment lines: “I am fine”, a hundred times. Each “fine” is crossed out, hard. Only “I am” is left.'] },
      { id: 'r5', type: 'decor', at: [13, 8], look: 'clipboard', lines: ['TERM REPORT. Art: excellent. Comment: “Draws doors. Many doors. Always closed.”'] },
      /* derrière le mur de papier : le plus vieux bulletin */
      { id: 'r1989', type: 'decor', at: [22, 8], look: 'frame', lookOpt: { c: ['#c8b890'] }, lines: ['An older report from Seoul, 1989: “김미란 — 조용함. 혼자 기다림.” (Kim Mi-ran — quiet. Waits alone.)', 'Someone has stuck it behind the others so the two girls would not see each other.'], use: [{ secret: 'pc_report_1989' }] },
      SOUL([KS('선생님, 저희 애는 괜찮아요. 조금 조용할 뿐이에요.', 'Teacher, my child is fine. She is just a little quiet.')], [21, 11]),
      SOUL([EN('One wall is thinner than the others. It is made of the oldest report.')])],
    decor: [{ look: 'schooldesk', n: 2, lines: ['A school desk. Carved into the lid, very small: a door.'] },
      { look: 'calendar', n: 1, lines: ['A calendar with every parents’ evening crossed out in red. Nobody came to any of them.'] }],
    npcs: [{ id: 'N1732', name: 'The Teacher Who Writes Reports', at: [12, 7], look: H({ t: 'adult', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#e0c8b0', '#3a2a1a'], acc: 'clipboard' }), behavior: 'static', solid: true,
        lines: [EN('I write what I see. I see a quiet girl. Quiet is not a problem. Quiet is easy to mark.'), EN('Read them all, if you like. They are about you. That is allowed.'), EN('The oldest report is not on the wall. It is the wall. We papered over it.'),
          { if: { equipped: 'E238' }, t: 'If you white it out, I will only write it again. But it will take me longer.', lang: 'en' }] },
      { id: 'N1733', name: 'A Paper Classmate', count: 3, look: { t: 'cardperson', c: ['#f0ece0', '#3a5a8a'], h: 19 }, behavior: 'statue', solid: true,
        lines: ['A classmate cut out of a class photo. Where his hand was on your shoulder, there is a hole.', 'A classmate cut out of a class photo. She is smiling at the camera, not at you.'] }],
    effect: { id: 'E238', how: 'mech', mech: { type: 'visitAll', marks: ['r1', 'r2', 'r3', 'r4', 'r5'], countText: 'Reports read # / %', reward: [{ set: { pc_scrap_report: true } }, { note: 'n_pc_report' }, { secret: 'pc_scrap_report' }],
      winLines: ['You have read every word they wrote about you. None of them asked you anything.', 'You keep the sheet of lines. “I am”, a hundred times: one piece of a sentence.', 'On the teacher’s desk, a little bottle of correction fluid. The brush is still wet.', 'It cannot change what they wrote. It can only make it white.'] } },
    info: { summary: 'A small classroom whose walls are made of school reports, all about the same quiet girl.',
      rules: ['Read the five reports pinned around the room (two frames, a note, a punishment sheet, a clipboard). Reward: the Correction Fluid (E238) and the punishment lines “I am”, one of the four pieces of the sentence.'],
      secrets: ['The east wall is paper: rub it out (Correction Fluid, Eraser) to find Mi-ran’s report from Seoul, 1989.'],
      lore: 'The school sees the silence and writes it down; nobody asks it a question.' } });

  /* ---------------------------------------------------------------
   *  W334 — La Bande de tri (P3)
   * --------------------------------------------------------------- */
  S({ id: 'W334', name: 'The Sorting Belt', depth: 3, tier: 'hard', back: 'W329', backLook: 'stairs', backAt: [1, 10], backLabel: 'back up to the post office',
    map: (function () { var g = K.grid(44, 20, ' '); g.box(0, 0, 44, 20, '#', '.'); g.rect(4, 9, 36, 3, 'z'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#7a6a58'] }, conveyor: { p: 'hstripes', c: ['#3a3430', '#5a5048'] }, wall: { p: 'flat', c: ['#2a2018', '#1a1410'], topColor: '#2a2018' }, wallface: { p: 'panel', c: ['#8a6a48', '#6a4a30', '#4a3018'], skirt: '#2a1a10' } },
    style: { tallWalls: true, renderer: 'sepia' }, music: 'sortingbelt', amb: { type: 'machine', vol: 0.07 }, conveyorDir: 'right',
    place: [{ id: 'c1989', type: 'decor', at: [8, 2], look: 'mailbox', lookOpt: { c: ['#a08050'] }, lines: ['A chute labelled 1989.'] },
      { id: 'c2044', type: 'decor', at: [16, 2], look: 'mailbox', lookOpt: { c: ['#5080a0'] }, lines: ['A chute labelled 2044.'] },
      { id: 'cNowhere', type: 'decor', at: [24, 2], look: 'mailbox', lookOpt: { c: ['#808080'] }, lines: ['A chute labelled NOWHERE.'] },
      { id: 'cHome', type: 'decor', at: [32, 2], look: 'mailbox', lookOpt: { c: ['#a04040'] }, lines: ['A chute labelled HOME. It looks as if it has never been used.'] },
      { id: 'toW331', type: 'door', to: 'W331', at: [42, 10], look: 'hatch', cond: { flag: 'pc_belt_sorted' }, label: 'the end of the belt, where the unsortable goes' },
      { id: 'toW066', type: 'door', to: 'W066', at: [22, 17], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'] }, cond: { remainingMod: { every: 60, under: 15 } }, label: 'a delivery hatch, open fifteen seconds a minute' },
      SOUL([KS('아빠, 오늘도 늦어? 편지 쓸게.', 'Dad, are you late again tonight? I’ll write you a letter.')]),
      SOUL([EN('Fifteen seconds in every minute, the delivery hatch by the south wall stands open. Couriers never stop for it.')])],
    decor: [{ look: 'crate', n: 3, lines: ['A crate of letters with no stamp, no address and no sender. Only a date: tomorrow.'] },
      { look: 'lamp', n: 2, lines: ['A lamp over the belt. Under it, each letter blushes as it passes.'] }],
    npcs: [{ id: 'N1734', name: 'A Sorter With No Hands', at: [20, 5], look: H({ t: 'old', body: 'apron', c: ['#7a6a5a', '#5a4a3a', '#e0c8b0', '#c8c8c8'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [EN('I sort by smell. 1989 smells of rice. 2044 smells of screens. Nowhere smells of nothing.'), { seq: [EN('Listen to the chutes. They ring in the order the letters want to go. Copy them.'), 'He nods at the four chutes on the north wall, one after another.'] },
          EN('A courier’s hatch opens by the south wall, a quarter of every minute. Couriers never stop for it.')] },
      { id: 'N1735', name: 'A Letter Riding the Belt', count: 3, look: { t: 'moth', c: ['#f0e8d8'], h: 8 }, behavior: 'wander', radius: 6, speed: 1.0, solid: false, lines: ['A letter riding the belt like a tram, pretending it knows where it gets off.'] }],
    mech: [{ type: 'sequence', order: ['cHome', 'c1989', 'cNowhere', 'c2044'], passThrough: true, flag: 'pc_belt_sorted', ring: { every: 1.8, pause: 4.5, hear: 20, sfx: 'chime', glyph: '✉' },
      reward: [{ set: { pc_belt_sorted: true } }, { secret: 'pc_belt_sorted' }],
      winLines: ['The machine sorts one letter correctly, for the first time in its life: HOME goes into HOME.', 'It jams, out of shock. At the end of the belt, the hatch to the shredders creaks open.'] }],
    info: { summary: 'Under the post office, a sepia belt that carries the letters nobody can deliver towards the shredders.',
      rules: ['The four chutes on the north wall ring in turn (Home, 1989, Nowhere, 2044). Interact with them in the order they ring. Then the hatch at the end of the belt opens onto the Shredder Canyon (W331).', 'The belt pushes everyone east.'],
      secrets: ['For fifteen seconds of every minute of dream, a delivery hatch opens by the south wall, to the Endless Courier (W066).'],
      lore: 'Letters between 1989 and 2044: a family writing to people who are always at work.' } });

  /* ---------------------------------------------------------------
   *  W335 — Les Archives des noms effacés
   * --------------------------------------------------------------- */
  S({ id: 'W335', name: 'The Archive of Erased Names', depth: 4, tier: 'hard', back: 'W323', backAt: [20, 26], backLabel: 'back to the library',
    map: (function () { var g = K.grid(40, 28, ' '); g.box(0, 0, 40, 28, '#', '.'); for (var y = 5; y <= 21; y += 4) { g.hline(3, 15, y, '%'); g.hline(24, 36, y, '%'); } return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#3a3a3e'] }, wall: INKWALL, wallface: { p: 'panel', c: ['#3a3a40', '#2a2a30', '#1a1a20'], skirt: '#000000' }, wall2: { p: 'metal', c: ['#6a6a70', '#4a4a50', '#2a2a30'], ownFace: true } },
    tall: { '%': { look: 'locker', opt: { c: ['#4a4a50'] } } }, style: { tallWalls: true, renderer: 'surveillance' }, music: 'erasednames', amb: { type: 'whispers', vol: 0.05 }, dark: 0.5,
    doors: [{ to: 'W122', at: [1, 2], look: 'drawer', label: 'a drawer marked SUBJECTS, back to the subject archives' }],
    place: [{ id: 'register', type: 'decor', at: [20, 14], look: 'desk', light: 2, lines: ['The register of the erased. Every line in it is a black line.'] },
      { id: 'toW110', type: 'door', to: 'W110', at: [38, 26], look: 'door', lookOpt: { style: 'metal', c: ['#000000'], symbol: '█' }, cond: { equipped: 'E237' }, label: 'a black door, for the crossed-out' },
      SOUL([KN('명단에 있었습니다. 그래서 없어졌습니다.', 'He was on the list. So he was gone.')]),
      SOUL([EN('A black door in the far corner, for black-lined people. You would have to be crossed out yourself.')])],
    decor: [{ look: 'drawer', n: 4, lines: ['A card: a name under a thick black line. Beside it, in pencil: “waited at the station for the 23:71”.', 'A card with its black line worn thin by handling: you can just read 철이 (Chol-i). Someone looks often.', 'A card for a whole village. One line was enough.', 'A blank card, very new, still warm, with a black line waiting above it.'] },
      { look: 'lamp', n: 2, lines: ['A lamp that only lights the space between the lines.'] }],
    npcs: [{ id: 'N1737', name: 'The Archivist of the Erased', at: [20, 13], look: H({ t: 'tall', head: 'veil', body: 'robe', c: ['#e8e4d8', '#c8c4b8', '#e0d0c0', '#000000'], acc: 'book' }), behavior: 'static', solid: true, hearDist: 4,
        lines: [KN('여기는 없었던 사람들의 방입니다. 조용히 하십시오. 그들은 이미 조용합니다.', 'This is the room of people who never existed. Please be quiet. They already are.'),
          { seq: [KN('지워진 이름을 하나 말씀해 주십시오. 소리 내어 부르면 줄이 풀립니다.', 'Tell me one erased name. Called aloud, the line comes undone.'), 'She taps a drawer of cards, then her own lips, and waits.'] }] },
      { id: 'N1738', name: 'A Name Without a Person', count: 5, look: ghost('rgba(200,200,210,0.4)', 18), behavior: 'wander', radius: 5, speed: 0.6, solid: false, lines: ['A name, walking about on its own, looking for its person. It cannot read its own letters.'] },
      { id: 'N1739', name: 'The Woman Who Folds', at: [10, 25], look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#f0ece0', '#c8c0b0', '#e0c0a0', '#d8d8d8'], eyes: 'closed', acc: 'crane' }), behavior: 'static', solid: true,
        lines: [KN('학 안에서 이름을 꺼내 오셨습니까? 여기서 불러 주십시오.', 'Did you bring a name out of a crane? Call it here.'), 'She folds a crane without looking at her hands. She has done it a thousand times.',
          KN('저 구석의 검은 문은 스스로 검게 지워진 사람만 봅니다.', 'Only those who have blacked themselves out can see the black door in that corner.')] }],
    mech: [{ type: 'sayTo', ent: 'N1737', dist: 4, flag: 'pc_scrap_name', words: ['ahn jae sik', 'ahn jaesik', 'an jae sik', 'jae sik', 'jaesik', '안재식', '재식', 'mr ahn', 'chol i', 'choli', 'cheol i', '철이', '리철'],
      wrong: { t: '그 이름은 지워진 적이 없습니다. 지워진 이름을 부르십시오.', lang: 'ko-n', tr: 'That name was never erased. Call an erased one.', who: 'The Archivist of the Erased' },
      reward: [{ set: { pc_scrap_name: true } }, { note: 'n_pc_name' }, { secret: 'pc_scrap_name' }],
      winLines: ['The archivist stops writing. She looks at you over glasses with no lenses.', KN('그 이름을 소리 내어 부른 사람은 칠십 년 만에 처음입니다.', 'You are the first to call that name aloud in seventy years.'),
        'She draws a card from a drawer. The black line across it lifts off like a hair and floats away.', 'Behind it another card was hiding, newer. It is being erased right now, very slowly: “Sora”.', 'You take it before the line can finish. It is warm. It is the signature at the end of a sentence.'] }],
    info: { summary: 'Grey card cabinets in the dark, holding the names of everyone removed from the record.',
      rules: ['Call an erased name aloud near the archivist: Ahn Jae-sik (안재식, from the crane in the Paper Crane Aviary, the man who waits for the 23:71) or Chol-i (철이, readable on a worn card). Reward: the card “Sora”, one of the four pieces of the sentence.'],
      secrets: ['With the Censor’s Marker (E237) equipped, a black door appears in the bottom-right corner: the Censorship Archives (W110).'],
      lore: 'Mr. Ahn, Ok-sun’s brother, “was on the list”; the girl who no longer speaks is being slowly erased too.' } });
  link('W122', { to: 'W335', look: 'drawer', label: 'a drawer marked ERASED' });

  /* ---------------------------------------------------------------
   *  W336 — L'Encrier
   * --------------------------------------------------------------- */
  S({ id: 'W336', name: 'The Inkwell', depth: 4, tier: 'hard', back: 'W332', backLook: 'ladder', backLabel: 'climb back up into the pulp',
    gen: { type: 'cave', w: 46, h: 34, opts: { fill: 0.45, iter: 4 } },
    look: { floor: { p: 'flat', c: ['#14141c', '#0e0e14'] }, wall: { p: 'rock', c: ['#05050a', '#000000', '#0a0a12'] } },
    style: { renderer: 'silhouette', sky: ['#000000', '#05050a'] }, music: 'inkwell', amb: { type: 'drip', vol: 0.06 }, dark: 0.72,
    doors: [{ to: 'W014', look: 'door', opt: { style: 'wood', c: ['#303030'] }, cond: { equipped: 'E05' }, label: 'a door drawn in charcoal, visible only by lantern light' }],
    place: [SOUL([EN('Ink does not choose what it hides. Hands do.')]),
      SOUL([EN('Hold a lantern up to the ink: it remembers it was once a door.')])],
    decor: [{ look: 'inkwell', n: 3, lines: ['An inkwell as big as a well. Something at the bottom is breathing.', 'An empty inkwell, licked clean.'] },
      { look: 'puddle', n: 3, lines: ['A pool of ink. Your reflection in it has a black bar across the mouth.'] }],
    npcs: [{ id: 'N1740', name: 'The Last Drop', look: { t: 'blob', c: ['#05050a'], h: 10 }, behavior: 'flee', fleeDist: 4, radius: 30, speed: 2.2, solid: false, lines: ['A drop of ink, round and frightened.'] },
      { id: 'N1741', name: 'A Diver in the Ink', look: H({ t: 'adult', head: 'helmet', body: 'coat', c: ['#2a2a30', '#1a1a20', '#c8b890', '#c0a060'] }), behavior: 'static', solid: true,
        lines: [EN('All the black in the city comes from down here. Every line across every name.'), EN('The first drop got away. It runs into the tunnels. Herd it into a dead end and it will let you hold it.'),
          EN('Hold a lantern up to the ink. It remembers it was once a door.')] }],
    mech: [{ type: 'corner', ent: 'N1740', flag: 'pc_last_drop', reward: [{ set: { pc_last_drop: true } }, { secret: 'pc_last_drop' }],
      winLines: ['The drop has nowhere left to run. It trembles, then lets itself be held.', 'It is the very first drop of ink in the city. It has never crossed anything out. It was meant for a letter.'] }],
    info: { summary: 'A pitch-black cave of ink under the Pulp Sea, where all the city’s black lines come from.',
      rules: ['The Last Drop flees when you come near: herd it into a dead end until it has nowhere left to go, then it lets itself be held.'],
      secrets: ['With the Lantern (E05) equipped, a door drawn in charcoal appears somewhere in the ink: the Charcoal World (W014).'],
      lore: 'Before it crossed anything out, the ink was meant for writing.' } });

  /* ---------------------------------------------------------------
   *  W337 — Entre deux pages
   * --------------------------------------------------------------- */
  S({ id: 'W337', name: 'Between Two Pages', depth: 4, tier: 'hard', back: 'W321', backLook: 'door', backOpt: { style: 'shoji', c: ['#f4f0e4'] }, backAt: [1, 6], backLabel: 'slip back out into the paper city', secretLevel: 5,
    map: (function () { var g = K.grid(72, 12, '#'); g.rect(1, 5, 70, 3, '.'); g.rect(33, 1, 6, 3, ','); g.set(35, 4, '?'); return g.rows(); })(),
    look: { floor: { p: 'lines', c: ['#f6f2e8', '#c8d0e0'] }, floor2: { p: 'paper', c: ['#efe6cc'] }, wall: { p: 'flat', c: ['#fbf8f0', '#e8e2d2', '#c8c0ae'], topColor: '#fbf8f0' }, secret: { p: 'flat', c: ['#fbf8f0', '#e8e2d2', '#c8c0ae'], topColor: '#fbf8f0' } },
    style: { renderer: 'mono' }, music: 'betweenpages', amb: { type: 'paper', vol: 0.04 },
    doors: [{ to: 'W331', at: [20, 5], look: 'door', opt: { style: 'shoji', c: ['#d8d2c4'] }, label: 'the crack, back down to the canyon' },
      { to: 'W328', at: [12, 7], look: 'door', opt: { style: 'shoji', c: ['#ece4d0'] }, label: 'the last fold, back into the folded house' }],
    place: [{ id: 'notword', type: 'decor', at: [40, 6], look: 'letter', lines: ['A word, alone between the pages.'] },
      { id: 'pressed', type: 'decor', at: [35, 2], look: 'flower', lookOpt: { c: ['#c0a0e0'] }, lines: ['A flower pressed flat between the pages long ago. Beside it, in pencil: “for the garden — O.”'], use: [{ secret: 'pc_pressed_flower' }] },
      SOUL([EN('Between two pages there is always room for something thin. A flower. A ticket. A child.')], [37, 2])],
    decor: [{ look: 'glyph', n: 3, lines: ['A letter that slipped between the pages. Here nobody reads it, so it can be anything it likes.'] }],
    npcs: [{ id: 'N1742', name: 'A Flat Girl', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#c8d0e0', '#a8b0c0', '#f0e0d0', '#1a1a2a'], alpha: 0.5 }), behavior: 'mimic', solid: false,
        lines: [EN('I live here, between the pages. It is narrow, but nobody turns me.'), EN('The word ahead runs away when you look at it. It is shy. It has nowhere to go, in the end.'),
          EN('Above the middle of the page there is a pocket where things get pressed. Good eyes find the way in.')] },
      { id: 'N1743', name: 'A Bookworm', count: 2, look: { t: 'worm', c: ['#c8a878'], h: 6 }, behavior: 'wander', radius: 6, speed: 0.6, solid: false, lines: ['A bookworm. It has eaten a tunnel through every “no” in the book. It is very thin.'] }],
    mech: [{ type: 'recede', mark: 'notword', dist: 7, flag: 'pc_between', reward: [{ set: { pc_between: true } }, { secret: 'pc_between' }],
      winLines: ['At the very edge of the page the word has nowhere left to retreat. It lets you pick it up: “not”.', 'It is the same word as everywhere else. Here it is not crossed out. Between two pages, nobody checks.'] }],
    info: { summary: 'A long, thin white strip between two pages of the city, where nobody reads and nobody corrects.',
      rules: ['A word drifts away down the strip whenever you look at it. Keep after it: at the far east end it can retreat no further and lets you pick it up (“not”).', 'Reached through the paper gap in the Paper City (Paper Doll Chain), the crack in the Shredder Canyon, or the last fold of the House Folded Eight Times.'],
      secrets: ['Above the middle of the strip, a ? wall (Glasses) hides a pocket with a pressed flower, signed “O.”.'],
      lore: 'The only place in the city where a word can exist without being checked: in between.' } });

  /* ---------------------------------------------------------------
   *  W338 — La Salle de pause des correcteurs
   * --------------------------------------------------------------- */
  S({ id: 'W338', name: 'The Correctors’ Break Room', depth: 4, tier: 'hard', back: 'W322', backAt: [11, 14], backLabel: 'back to the office', secretLevel: 5,
    map: K.hall(22, 16, '#', '.'),
    look: { floor: { p: 'carpet', c: ['#5a5048', '#4a4038', '#7a6a50'] }, wall: INKWALL, wallface: { p: 'wallpaper', c: ['#c8c0b0', '#a8a090', '#3a3a3a'], skirt: '#1a1a1a' } },
    style: { tallWalls: true, renderer: 'photo' }, music: 'breakroom', amb: { type: 'fridge', vol: 0.05 },
    doors: [{ to: 'W134', at: [20, 2], look: 'door', opt: { style: 'glass' }, cond: { flag: 'pc_echo' }, label: 'the meeting room, where the corrections are corrected' },
      { to: 'W053', at: [1, 2], look: 'elevator', cond: { phase: 'final' }, label: 'the staff lift; it only comes at the end of the shift' }],
    place: [SOUL([EN('At the very end of the shift, the staff lift comes for the ones who stayed late. It always comes too late.')])],
    decor: [{ look: 'coffee', n: 2, lines: ['A coffee machine that only makes one drink: “black”.', 'A mug: WORLD’S MOST CORRECT DAD. The word “dad” has been crossed out and written in again, by hand.'] },
      { look: 'sofa', n: 1, lines: ['A sagging sofa. On the cushion, the shape of someone who sleeps here instead of going home.'] },
      { look: 'locker', n: 3, lines: ['A locker. Inside, a jacket, a photo of a child, and a marker with its cap on.', 'A locker with a name on it, crossed out, written again, crossed out.'] },
      { look: 'calendar', n: 1, lines: ['A calendar. Every day says: OVERTIME.'] }],
    npcs: [{ id: 'N1744', name: 'An Off-Duty Corrector', count: 2, look: H({ t: 'adult', head: 'square', body: 'shirt', c: ['#d8d0c0', '#b8b0a0', '#e8e0d0', '#000000'], eyes: 'closed', acc: 'coffee' }), behavior: 'static', solid: true,
        lines: [EN('Off duty, I still hear everything with a line through it.'), { seq: [EN('Say anything. I will say it back properly. It is a habit.'), EN('Say it back to me the way I said it, and we are even.')] }, EN('My daughter asked me what I do. I told her I make things fine.'),
          EN('The staff lift only comes at the very end of the shift. By then you are too tired to take it.')] }],
    mech: [{ type: 'echo', zone: [1, 1, 20, 14], words: ['fine', 'approved', 'nothing', 'nobody', 'happy', 'thank you', 'correct', 'quiet'], flag: 'pc_echo', reward: [{ set: { pc_echo: true } }, { secret: 'pc_echo' }],
      winLines: ['You repeat the corrected word, exactly. The correctors look up from their coffee, surprised.', 'For a moment they look ashamed of how well you did it. The glass door to the meeting room unlocks.'] }],
    info: { summary: 'A cramped staff room behind the Censorship Office, where the correctors drink black coffee and don’t go home.',
      rules: ['Say anything: the correctors’ habit answers with a corrected, approved word (shown above her). Say that exact word back to win. Then the glass door to the Eternal Meeting Room (W134) opens.', 'Reached only by the staff door of the Censorship Office, with the Censor’s Marker equipped.'],
      secrets: ['In the last tenth of the dream (final phase), the staff lift arrives in the top-left corner: the Lift That Never Stops (W053).'],
      lore: 'The censors are tired workers too; even their own words come out corrected.' } });

  /* ---------------------------------------------------------------
   *  W339 — La Coquille (l'unique feuille mal imprimée)
   * --------------------------------------------------------------- */
  S({ id: 'W339', name: 'The Misprint', depth: 4, tier: 'hard', back: 'W325', backLook: 'stairs', backAt: [15, 20], backLabel: 'back up to the press', secretLevel: 5,
    map: (function () { var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.'); g.rect(9, 7, 13, 3, ','); return g.rows(); })(),
    look: { floor: { p: 'paper', c: ['#ece6d8'] }, floor2: { p: 'grid', c: ['#e0d8c4', '#a89c84'] }, wall: { p: 'flat', c: ['#f2ede0', '#d6cebd'], topColor: '#f8f4ea' }, wallface: { p: 'paper', c: ['#e6dfcf'] } },
    style: { tallWalls: true, filter: 'invert(1) hue-rotate(180deg)' }, music: 'misprint', amb: { type: 'machine', vol: 0.03 },
    extra: { noHiddenEntry: true },
    doors: [{ to: 'W340', at: [15, 4], look: 'door', opt: { style: 'shoji', c: ['#ffffff'] }, cond: { flag: 'pc_misprint' }, label: 'a page nobody has written on' },
      { to: 'W200', at: [28, 20], look: 'bookcase', cond: { visited: ['W337', 'W338'] }, label: 'the shelf where this misprint will be filed' }],
    place: [{ id: 'proof', type: 'decor', at: [15, 1], look: 'poster', lines: ['A proof sheet pinned to the wall: “Mum, I am ███ fine. — Sora.” One word is missing. It is three letters wide.'] },
      { id: 'd1', type: 'decor', at: [11, 8], look: 'wheel', lines: ['A type drum.'] },
      { id: 'd2', type: 'decor', at: [15, 8], look: 'wheel', lines: ['A type drum.'] },
      { id: 'd3', type: 'decor', at: [19, 8], look: 'wheel', lines: ['A type drum.'] },
      SOUL([EN('Once, the press made a mistake. They kept the mistake. It is the only true thing it ever printed.')])],
    npcs: [{ id: 'N1745', name: 'Comrade Typesetter Ri', at: [8, 4], look: H({ t: 'old', head: 'cap', body: 'apron', c: ['#3a3a3a', '#2a2a2a', '#e0c8a8', '#c8c8c8'], eyes: 'closed', acc: 'newspaper' }), behavior: 'static', solid: true,
        lines: [{ seq: [KN('딱 한 번입니다. 세 글자짜리 낱말입니다. 거리에서 도망친 글자들, 기억하십니까?', 'Just once. A word of three letters. Do you remember the letters that ran away in the street?'), 'He holds up three fingers, then points at the three drums.'] },
          KN('저는 평생 〈FINE〉만 짰습니다. 손이 다른 낱말을 기억할지 모르겠습니다.', 'All my life I have set nothing but “FINE”. I do not know if my hands remember any other word.')] },
      { id: 'N1746', name: 'A Misprinted Child', count: 3, look: { t: 'cardperson', c: ['#f0ece0', '#1a1a1a'], h: 18 }, behavior: 'wander', radius: 4, speed: 0.8, solid: true,
        lines: [EN('Fine. Not. Am. I.'), 'A child printed back to front. When she speaks, the words come out reversed, but she means every one of them.',
          EN('Shelf the. Know will. Staff door the behind and. Pages the between been have you if.')] }],
    mech: [{ type: 'dials', marks: ['d1', 'd2', 'd3'], states: 6, values: ['F', 'I', 'N', 'E', 'O', 'T'], start: [0, 1, 3], target: [2, 4, 5], labelText: 'The drum shows: ', sfx: 'click', flag: 'pc_misprint',
      reward: [{ set: { pc_misprint: true } }, { secret: 'pc_misprint' }],
      winLines: ['N. O. T. The drums lock with a sound like a held breath.', 'Far above, the press stops for the first time in thirty years and prints one single sheet.', 'It drifts down through the ceiling like a leaf.', 'Where it lands, a door of blank paper stands up.'] }],
    info: { summary: 'The one sheet the press got wrong: a white room printed in reverse, with three type drums.',
      rules: ['Reached from the Press once its four pieces have been brought (letter, report, book, name).', 'Turn the three type drums (F, I, N, E, O, T) until they spell N-O-T, the word of the three loose letters of the Paper City and the scrap from the library. A door of blank paper opens: the Unwritten Page (W340).'],
      secrets: ['If you have been both Between Two Pages (W337) and in the Correctors’ Break Room (W338), a shelf appears in the bottom-right corner, to the Dream Archives (W200).'],
      lore: 'A sentence only gets printed by mistake: Mum, I am not fine.' } });

  /* ---------------------------------------------------------------
   *  W340 — La Page non écrite
   * --------------------------------------------------------------- */
  S({ id: 'W340', name: 'The Unwritten Page', depth: 4, tier: 'hard', back: 'W339', backLook: 'door', backOpt: { style: 'shoji', c: ['#ffffff'] }, backAt: [20, 27], backLabel: 'back down into the misprint', secretLevel: 5,
    map: (function () { var g = K.grid(40, 30, ' '); g.box(0, 0, 40, 30, '#', '.'); return g.rows(); })(),
    look: { floor: { p: 'paper', c: ['#fbfaf6'] }, wall: { p: 'flat', c: ['#ffffff', '#f0f0ea'], topColor: '#ffffff' }, wallface: { p: 'paper', c: ['#fbfaf6'] } },
    style: { sky: ['#ffffff', '#ffffff'] }, music: 'unwrittenpage', amb: null,
    extra: { noHiddenEntry: true },
    place: [{ id: 'page', type: 'decor', at: [20, 14], look: 'letter', lookOpt: { c: ['#ffffff'] }, lines: ['A blank page as big as a field. At the top, in small print: “Mum,”. Then nothing. Then room for everything.'] },
      { id: 'toW041', type: 'door', to: 'W041', at: [38, 28], look: 'door', lookOpt: { style: 'shoji', c: ['#f4f0e4'] }, label: 'a dog-eared corner of the page' },
      SOUL([EN('You have every piece now. Say them in order. Out loud, or in writing.')]),
      SOUL([EN('Every page has one corner someone folded down, to find their way back.')], [33, 25])],
    npcs: [{ id: 'N1747', name: 'The Corrector, Off Duty', at: [26, 16], look: H({ t: 'tall', head: 'square', body: 'suit', c: ['#2a2a30', '#18181e', '#e8e0d0', '#000000'], eyes: 'closed' }), behavior: 'static', solid: true,
        lines: [EN('I am not going to cross that out.'), EN('I have been crossing out that sentence all my life. Mine too.'), 'His marker lies beside him on the page, capped.',
          EN('Every page has one corner someone folded down, to find the way back. Bottom right, usually.')] }],
    effect: { id: 'E242', how: 'mech', mech: { type: 'sayTo', mark: 'page', dist: 5, cond: { flag: SCRAPS.concat(['pc_misprint']) },
      notNow: 'The page waits. You are still missing pieces of what you came here to say.', words: ['i am not fine', 'im not fine', 'i m not fine', 'mum i am not fine', 'mum im not fine', 'not fine', '안 괜찮아', '안괜찮아', '괜찮지 않아', '나 안 괜찮아', '엄마 나 안 괜찮아', '안 괜찮아요'],
      wrong: 'The page stays blank. That is not what you have been carrying all this way.',
      reward: [{ note: 'n_pc_page' }, { secret: 'pc_unwritten_page' }],
      winLines: ['You say it. Here, saying and writing are the same thing.', 'The words stay on the page. No line comes to cross them out.', 'Very far away, through a door, a tired voice answers:',
        KS('…안 괜찮아도 돼. 엄마도 안 괜찮아.', '…You don’t have to be fine. Mum isn’t fine either.'), 'Where the sentence ends, a pencil stub is lying on the page. It is not a marker. It writes.'] } },
    info: { summary: 'An endless white page with one word printed at the top: “Mum,”.',
      rules: ['Once the four pieces (letter, report, book, name) have been found and the Misprint has been set, say (or write) the whole sentence near the page: “I am not fine” (or 안 괜찮아). Reward: the Pencil Stub (E242).'],
      secrets: ['The bottom-right corner of the page is dog-eared: a door back to the Paper Room (W041), where paper began. Only a soul hints at it.'],
      lore: 'The end of the Paper City: the sentence nobody in the family says, said once, and answered.' } });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
