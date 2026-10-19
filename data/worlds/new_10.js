/* =========================================================================
 *  SOUS LE SIXIÈME SOMMEIL — W381 à W400 (tous en profondeur 5, couche P5)
 *  Sous les sept lits de la Sixième Couche (W183) s'étend leur envers
 *  (W381). Sous chaque lit, l'envers de son souvenir ; plus bas encore,
 *  les rêves les plus proches du cœur : la voix gardée, les œufs, la nuit
 *  de la mère, la neige de télévision, les sorcières petites filles, les
 *  anniversaires, la chapelle vide, le jardin du premier jour, la chambre
 *  vue d'en haut, la machine à laver, la blague sans chute, la chaussure
 *  gauche, les mots du frigo, la millième grue, la poche du tablier, les
 *  chrysanthèmes blancs, la porte de sept heures, le toit de 2008 et la
 *  dernière page.
 *
 *  Méta-énigme : cinq mots arrachés à la dernière page du journal, un par
 *  monde — « Mum » (W398), « I » (W382), « am » (W392), « still » (W393),
 *  « here » (W397). Sur la dernière page (W400), on dit la phrase entière :
 *  « Mum, I am still here. » → E260, sa propre voix.
 *  Habitants N2000–N2059 · effets E255–E260.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function ghost(c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : un fragment de mémoire, dit une fois puis défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  /* une âme-indice : elle revient chaque nuit (jamais éclaircie) */
  function HINT(id, lines, at) { return { id: id, type: 'soul', at: at || 'random-any', lines: lines, nightly: true }; }
  /* ajoute une porte dans un monde déjà défini (placée au hasard, puis rendue joignable) */
  function link(from, d) { var w = YN.data.worlds[from]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ id: 'to' + d.to, type: 'door', at: 'random-any', lookOpt: { style: 'wood', c: ['#3a3a4a'] } }, d)]); }
  /* une porte secrète reste ouverte une fois qu'on est passé de l'autre côté */
  function orSeen(c, id) { return { any: [c, { visited: id }] }; }
  /* les cinq mots de la dernière page */
  var PAGES = ['bss_mum', 'bss_i', 'bss_am', 'bss_still', 'bss_here'];
  function PAGE(flag) { var o = {}; o[flag] = true; return [{ setNow: o }, { secret: flag }, { note: 'n_' + flag }, { sfx: 'page' }]; }

  /* ---------------------------------------------------------------
   *  Effets E255–E260
   * --------------------------------------------------------------- */
  [
    { id: 'E255', name: 'The Egg That Waited', fam: 'nest', world: 'W383', icon: { glyph: '◯', c: '#f0e8d8' }, action: 'hug', noise: 0.6,
      desc: 'Warm. Whatever is inside is in no hurry at all.',
      use: 'Hold it close (F): you walk softly, like someone carrying a sleeper. Paper strings come down for it.',
      get: 'Keep to the shadow of the wing in the Nursery of Unhatched Eggs.' },
    { id: 'E256', name: 'Television Snow', fam: 'screen', world: 'W385', icon: { glyph: '▒', c: '#c8c8c8' }, action: 'tv', caps: ['reveal'],
      desc: 'It settles on your shoulders and never melts. It hisses when something is being kept from you.',
      use: 'Change a screen’s channel (F); walk through walls that are only pictures; see doors made of static.',
      get: 'Stop the right channel on the Static Tide.' },
    { id: 'E257', name: 'Night-Shift Clogs', fam: 'night', world: 'W384', icon: { glyph: 'ʊ', c: '#f0f0f0' }, action: 'none', speed: 1.16, noise: 0.8,
      desc: 'White, worn down at the heels. Eleven kilometres a night.',
      use: 'You walk faster and more quietly. You can stand where she stands.',
      get: 'Answer every call, in the order they ring, in the Corridor of Night Shifts.' },
    { id: 'E258', name: 'Halmeoni’s Apron', fam: 'garden', world: 'W389', icon: { glyph: '⌓', c: '#c8b8a0' }, action: 'smell',
      desc: 'Soil, peppermint and soap, in that order.',
      use: 'Smell out trails for a few seconds (F). Its pocket opens onto somewhere.',
      get: 'Remember every pair in the Garden That Remembers.' },
    { id: 'E259', name: 'The Thousandth Crane', fam: 'paper', world: 'W395', icon: { glyph: '⌃', c: '#f4f0e8' }, action: 'fold',
      desc: 'Nine hundred and ninety-nine were folded by someone else. This one, by you.',
      use: 'Fold a place (F), then fold yourself back to it. A wish is kept inside it, for when it is urgent.',
      get: 'Catch the seven loose cranes without running.' },
    { id: 'E260', name: 'Her Own Voice', fam: 'voice', world: 'W400', icon: { glyph: '◠', c: '#f0c0a0' }, action: 'shout',
      desc: 'Lower than she remembered. Hers.',
      use: 'Call out (F): you are heard from very far away. Things that were waiting for her voice answer it.',
      get: 'Say the last line of the last page.' }
  ].forEach(function (e) { e.ground = false; e.core = false; if (!YN.effectById(e.id)) YN.data.effects.push(e); YN._effIndex = null; });

  /* ce qu'elle garde (notes) */
  Object.assign(YN.data.notes, {
    n_bss_i: { t: 'A jar gave my own word back to me. “I”.' },
    n_bss_am: { t: 'Knock knock. Somebody answered. The joke was finished at last: “am”.' },
    n_bss_still: { t: 'A shoe print in the snow, kept for seventy years. “still”.' },
    n_bss_here: { t: 'I sang her lullaby back to her. “here”.' },
    n_bss_mum: { t: 'Seven o’clock, in the doorway, in her shoes. “Mum”.' },
    n_bss_last_page: { t: 'Mum, I am still here.' },
    n_bss_shift: { t: 'Every light in the corridor, answered. The clock said seven at last.' },
    n_bss_girls: { t: 'Five rules, put away. Five girls with my hairclip.' },
    n_bss_chapel: { t: 'Five candles, five names. Not one of them chosen.' },
    n_bss_route: { t: 'Shoes off, rice on, a look round my door, sleep. Every morning.' },
    n_bss_twelve: { t: 'Twelve candles. I sang, in my head.' },
    n_bss_unasked: { t: 'The note nobody wrote: “How was school today?”' },
    n_bss_photo: { t: 'It’s all right if my words come late. She could hear all of them.' },
    n_bss_roof: { t: 'The stay-awake dance, 2008. She was laughing.' },
    n_bss_monster: { t: 'The monster under the bed only wanted the warm side of the floor.' },
    n_bss_tunic: { t: 'School play, Thursday, 14:00. Circled, crossed out, circled again.' },
    n_bss_slippers: { t: 'Dad’s slippers are still in the shoe cupboard.' },
    n_bss_jars: { t: 'Every jar answered me in the voice I had when I was nine.' },
    n_bss_crane: { t: 'A thousand cranes and one wish. I didn’t say it. It was made anyway.' },
    n_bss_present: { t: 'A present for my tenth birthday, wrapped by Halmeoni. She didn’t get there.' },
    n_bss_firstcrane: { t: 'Crane number one: 1952, a school exercise book, “big brother”.' },
    n_bss_7am: { t: 'At seven, real seven, she looked up at the ceiling and asked if I was there.' }
  });

  /* ---------------------------------------------------------------
   *  W381 — L'Envers des lits (le carrefour sous la Sixième Couche)
   *  Sept pieds de lit, sept trappes vers l'envers de chaque souvenir ;
   *  sous le lit du milieu, le journal (W400), fermé tant qu'il manque
   *  cinq mots. Le monstre sous le lit s'enfuit : le coincer ouvre la
   *  trappe de la machine à laver (W391).
   * --------------------------------------------------------------- */
  var BEDPOS = [0, 1, 2, 3, 4, 5, 6].map(function (i) { var a = -Math.PI / 2 + i * Math.PI * 2 / 7; return [Math.round(20 + Math.cos(a) * 12), Math.round(20 + Math.sin(a) * 12)]; });
  var UNDER = [
    { to: 'W385', look: 'hole', label: 'under the bed with colourless sheets: a hole that hisses' },
    { to: 'W386', look: 'door', opt: { style: 'wood', c: ['#e8c8a0'] }, label: 'under the bed from before words: a door at toddler height' },
    { to: 'W383', look: 'nest', label: 'under the cradle: a nest, going down' },
    { to: 'W384', look: 'door', opt: { style: 'metal', c: ['#c8d8d8'] }, label: 'under the bed near a door: a ward door' },
    { to: 'W387', look: 'stairsdown', label: 'under the cot in the sun: stairs, with sunlight coming up them' },
    { to: 'W382', look: 'hatch', label: 'under the white bed: a cellar hatch' },
    { to: 'W390', look: 'ladder', label: 'under the bed under the lamp: a ladder that goes up' }
  ];
  S({ id: 'W381', name: 'The Underside of the Beds', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W183', backLook: 'ladder', backLabel: 'back up between the beds', backAt: [20, 36],
    map: (function () {
      var g = K.grid(41, 41, ' '); g.ellipse(20, 20, 18, 18, '.'); g.ellipse(20, 20, 4, 4, ',');
      BEDPOS.concat([[20, 20]]).forEach(function (p) { [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(function (d) { g.set(p[0] + d[0], p[1] + d[1], '{'); }); });
      return g.rows();
    })(),
    look: { floor: { p: 'plank', c: ['#2a2434', '#221c2c', '#342c40'] }, floor2: { p: 'dots', c: ['#16121e', '#3a3448'] }, wall: { p: 'flat', c: ['#05030a', '#0a0614'] } },
    tall: { '{': { look: 'column', opt: { c: ['#4a3c5a', '#2a2238'] } } },
    style: { renderer: 'engraving', sky: ['#05030a', '#140c22'], cliffH: 0.5, cliff: '#0a0614' }, music: 'undersleep', amb: { type: 'heartbeat', vol: 0.03 }, dark: 0.55, weather: { dust: true },
    doors: UNDER.map(function (d, i) { return { to: d.to, at: BEDPOS[i], look: d.look, opt: d.opt, label: d.label }; }).concat([
      { to: 'W400', at: [20, 20], look: 'book', opt: { c: ['#e8e0c8'] }, label: 'the diary under the middle bed', cond: { flag: PAGES },
        locked: 'Under the middle bed, a diary held shut with an elastic band. Five words are missing from its last page.' },
      { to: 'W391', at: [4, 20], look: 'hatch', label: 'a trapdoor that smells of washing powder', cond: orSeen({ flag: 'bss_monster' }, 'W391') }]),
    decor: [{ look: 'sock', n: 3, lines: ['An odd sock. Its pair is upstairs, in a drawer, still waiting.', 'A school sock with a name tape: “S.”. Grey with dust.', 'A baby’s sock. It has been down here since before she could walk.'] },
      { look: 'trinket', n: 2, lines: ['A yellow hairclip shaped like a star. The same as the one she is wearing.', 'A milk tooth wrapped in a tissue. Nobody came to swap it for a coin.'] },
      { look: 'drawing', n: 1, lines: ['A drawing that slid under the bed years ago: a woman in a blue uniform, waving. Underneath: “mum at work”.'] },
      { look: 'crumbs', n: 3, lines: ['Biscuit crumbs. Someone ate in bed, in secret, with the light on.', 'Dust, in drifts, like snow that never had anywhere to melt.'] },
      { look: 'book', n: 1, lines: ['A library book, three years overdue. The bookmark is at the page where she stopped reading aloud.'] }],
    npcs: [{ id: 'N2000', name: 'The Monster Under the Bed', look: { t: 'shadow', c: ['#120e1c'], h: 26 }, behavior: 'flee', fleeDist: 5, radius: 8, speed: 1.6, solid: true, at: [20, 27],
        lines: [EN('Don’t look under the bed. That’s my only rule.'), EN('I was never going to eat you. I only wanted the warm side of the floor.'),
          EN('Every night you checked if I was here. I was. I was checking if you were.'),
          { if: { flag: 'bss_monster' }, t: 'You found me. Now you know where things go when they fall.', lang: 'en' }],
        reacts: { E260: { lines: ['You call it with your own voice. It stops running for the first time.', EN('…You have a nice voice. I always wondered what it sounded like.')] } } },
      { id: 'N2001', name: 'A Dust Bunny', count: 5, look: { t: 'blob', c: ['#8a8494'], h: 9 }, behavior: 'wander', radius: 4, speed: 0.6, solid: false, passThrough: true,
        lines: ['A dust bunny. It rolls away from your breath.', 'It is made of hair, lint and one eyelash. Make a wish.'] },
      { id: 'N2002', name: 'The Springs Above', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 22,
        ambientLines: ['Above you, the mattress springs creak. Someone has turned over in her sleep.', 'Seven sleepers breathe at once, out of step.', KS('…자니?', '…are you asleep?')] }],
    mech: [{ type: 'corner', ent: 'N2000', flag: 'bss_monster',
      winLines: ['Cornered between two bed legs, the monster under the bed covers its eyes with both hands.', EN('Don’t look. Nobody looks under here. That’s the rule.'),
        'It peeks through its fingers. Then, to have something to do with its hands, it lifts a trapdoor in the floor.', EN('That one goes to the machine that works nights. Mind the spin.')],
      reward: [{ setNow: { bss_monster: true } }, { secret: 'monster_under_bed' }, { note: 'n_bss_monster' }] }],
    place: [SOUL([EN('Everything that falls under a bed ends up here. Socks. Teeth. Words.')]),
      SOUL([KS('침대 밑엔 아무것도 없어. 엄마가 봤어.', 'There’s nothing under the bed. Mum checked.')]),
      SOUL([EN('Seven beds above. One floor below. It was always the same floor.')]),
      HINT('h_words', [EN('Five words fell under here, one at a time, over three years. Each one rolled further than the last.')]),
      HINT('h_monster', [EN('It runs from anyone who looks. Walk it into a corner, gently, the way you would a cat.')])],
    info: { summary: 'The dark beneath the seven beds of the Sixth Layer: seven bed legs, seven ways further down, and a diary under the middle bed.',
      rules: ['Each bed of the Sixth Layer has its underside here: a hatch, door or ladder beneath each one leads to a deeper version of that memory.',
        'The diary under the middle bed (The Last Page) opens only once the five words of its last line have been found: “Mum”, “I”, “am”, “still”, “here”.',
        'The Monster Under the Bed flees; corner it against the edge or between bed legs and it opens a trapdoor to the Night Drum.'],
      secrets: ['The trapdoor to the Night Drum (W391).', 'The diary under the middle bed (W400).'],
      lore: 'Below the sixth sleep. Where everything that falls under a bed goes.' } });
  link('W183', { to: 'W381', look: 'ladder', at: 'random-hidden', label: 'a gap between the beds, and a ladder going down into it' });

  /* ---------------------------------------------------------------
   *  W382 — La Pièce où l'on garde sa voix (sous le lit blanc, W189)
   *  Une cave d'onggi : chaque jarre garde un mot qu'elle n'a pas dit.
   *  Écho : dire un mot, la grande jarre en rend un autre ; le redire.
   *  Derrière la dernière étagère, un dédale de murs invisibles mène à la
   *  dernière jarre (« 할머니 ») et à la porte des chrysanthèmes (W397).
   * --------------------------------------------------------------- */
  S({ id: 'W382', name: 'The Room Where Her Voice Is Kept', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the white bed', backAt: [1, 8],
    map: (function () {
      var g = K.grid(34, 24, ' ');
      g.box(0, 15, 34, 9, '#', 'x');
      g.box(0, 0, 34, 16, '#', '.');
      [2, 4, 11, 13].forEach(function (y) { [[2, 7], [9, 14], [19, 24], [26, 31]].forEach(function (s) { g.hline(s[0], s[1], y, '{'); }); });
      g.ellipse(16.5, 7.5, 3.5, 2, ',');
      // derrière la dernière étagère, le sol continue ; les murs ne se montrent pas
      g.set(30, 15, '.');
      g.vline(30, 16, 21, '.'); g.hline(26, 30, 21, '.'); g.vline(26, 17, 21, '.'); g.hline(20, 26, 17, '.'); g.vline(20, 17, 20, '.');
      g.hline(14, 20, 20, '.'); g.vline(14, 17, 20, '.'); g.hline(8, 14, 17, '.'); g.vline(8, 17, 21, '.'); g.hline(3, 8, 21, '.');
      g.rect(2, 20, 3, 3, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'cobble', c: ['#4a3c30', '#3a2e24', '#5a4a3a'] }, floor2: { p: 'rug', c: ['#6a4a30', '#5a3a24'] },
      wall: { p: 'flat', c: ['#1a120c', '#100a06'], topColor: '#1a120c' }, wallface: { p: 'panel', c: ['#5a4632', '#4a3624', '#2a1e12'], skirt: '#1a120a' } },
    tall: { '{': { look: 'onggi', opt: { c: ['#5a3a24'] } } },
    style: { renderer: 'sepia', tallWalls: true }, music: 'keptvoice', amb: { type: 'whispers', vol: 0.04 }, dark: 0.5,
    doors: [{ to: 'W189', at: [32, 8], look: 'stairs', opt: { c: ['#f0f0f0'] }, label: 'white stairs going up into the silence' },
      { to: 'W397', at: [2, 22], look: 'door', opt: { style: 'wood', c: ['#f4f4f0'] }, label: 'a white door, behind the last jar' }],
    decor: [{ look: 'jar', n: 6, lines: ['A jar with a label: “2023.11 — no”.', 'A jar: “2024.03 — it hurts”. The lid is screwed on very tight.',
        'A jar: “2025.09 — stop it”. It was filled at school. It rattles.', 'A jar: “every night — mum?”. It is the fullest jar on the shelf.',
        'A jar: “2024.12 — happy birthday”. Never opened.', 'A jar: “2025.02 — I know”. It is the smallest one.'] },
      { look: 'calendar', n: 1, lines: ['A calendar from November 2023. After the fourth, every day is crossed out with the same pencil.'] },
      { look: 'lantern', n: 2, lines: ['A paper lantern. Inside, instead of a flame, a word glowing very faintly: “later”.'] }],
    npcs: [{ id: 'N2003', name: 'The Woman Who Salts the Jars', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#e8e0d0', '#c8c0b0', '#e0c0a0', '#d0d0d0'], eyes: 'closed' }), behavior: 'static', solid: true, at: [19, 9],
        lines: [KS('말은 소금에 절여 두면 오래 가.', 'Words keep for a long time, if you salt them.'),
          KS('여기 있는 건 다 네가 안 한 말이야. 하나도 안 버렸어.', 'Everything here is a word you didn’t say. I didn’t throw a single one away.'),
          { seq: ['She taps the big jar in the middle, then her own lips, then your ear.', KS('한 번 말하면 날아가. 두 번 말하면 남아.', 'Say a word once and it flies off. Say it twice and it stays.')] },
          { if: { flag: 'bss_i' }, t: '첫 번째 단지가 찼네. 나머지 네 개는 다른 데 있어.', lang: 'ko-s', tr: 'The first jar is full. The other four are somewhere else.' }] },
      { id: 'N2004', name: 'A Word That Got Out', count: 3, look: { t: 'moth', c: ['#f0ece0'], h: 7 }, behavior: 'fly', radius: 5, speed: 0.9, solid: false, light: 0.6,
        lines: ['A small white moth. As it flutters past your ear, you hear: “no”.', 'A moth made of a single word. This one says “wait”.', 'It brushes your cheek: “why”.'] }],
    mech: [{ type: 'echo', zone: [13, 5, 20, 10], words: ['I', 'me', '나', 'myself', 'I'], flag: 'bss_i', reward: PAGE('bss_i'),
      winLines: ['You say it again: the word your voice gave back.', 'The big jar closes over it, gently, like a hand over a firefly.',
        'A strip of paper floats up out of the jar: a line torn from a diary. One word, in her handwriting: “I”.'] }],
    place: [{ id: 'bigjar', type: 'decor', at: [16, 7], look: 'onggi', lookOpt: { c: ['#6a4428'] }, solid: true, light: 1.2,
        lines: ['A big earthenware jar, empty, open. When you lean over it, your breath comes back up, a little late.'],
        use: [{ if: { equipped: 'E260' }, lines: [{ t: 'You call into the big jar with your own voice.' }, { t: 'Every jar on every shelf answers at once, softly, in the voice you had when you were nine.' }],
          secret: 'jars_answer', note: 'n_bss_jars' }] },
      { id: 'lastjar', type: 'decor', at: [2, 20], look: 'onggi', lookOpt: { c: ['#8a6a4a'] },
        lines: ['A small jar, alone, at the very back. The label: “2023.11.04 — 할머니”.', 'It is the last word she said out loud. The jar is still warm.'], use: [{ secret: 'last_word_halmeoni' }] },
      { id: 'chalk1', type: 'decor', at: [30, 21], look: 'chalkmark', solid: false, lines: ['A chalk arrow on the floor, drawn by a child. It points left.'] },
      { id: 'chalk2', type: 'decor', at: [26, 17], look: 'chalkmark', solid: false, lines: ['A chalk arrow, smaller. Left again.'] },
      { id: 'chalk3', type: 'decor', at: [20, 20], look: 'chalkmark', solid: false, lines: ['A chalk arrow. Someone has rubbed it out and drawn it again.'] },
      { id: 'chalk4', type: 'decor', at: [14, 17], look: 'chalkmark', solid: false, lines: ['A chalk arrow, very faint.'] },
      { id: 'chalk5', type: 'decor', at: [8, 21], look: 'chalkmark', solid: false, lines: ['The last chalk arrow. Beside it, a tiny drawing of a jar.'] },
      SOUL([EN('They called her the mute one. Down here, every shelf is full.')]),
      SOUL([KS('할머니, 나 무서워.', 'Grandma, I’m scared.')]),
      HINT('h_echo', [KS('메아리한테 대답해 줘. 메아리도 외로워.', 'Answer the echo. Echoes get lonely too.')]),
      HINT('h_maze', [EN('Behind the last shelf, the floor goes on. The walls there are too shy to show themselves.')])],
    info: { summary: 'A cellar of earthenware jars; each one holds a word she did not say after November 2023.',
      rules: ['Speak near the big jar in the middle: your voice comes back as a different word. Say that word: the jar keeps it and gives the first word of the last page, “I”.',
        'Behind the last shelf (bottom right) the floor continues through a maze of invisible walls; chalk arrows mark the turns.',
        'With Her Own Voice equipped, the big jar makes every jar answer.'],
      secrets: ['The last jar: “할머니”, the last word she said out loud.', 'The white door behind it leads to the White Chrysanthemums (W397).'],
      lore: 'The mute one was only keeping her words for later. This is where.' } });
  link('W189', { to: 'W382', look: 'stairsdown', lookOpt: { c: ['#e8e8e8'] }, label: 'white stairs going down without a sound', cond: { secret: 'silence_heard' } });

  /* ---------------------------------------------------------------
   *  W383 — La Nurserie des œufs pas éclos (sous le berceau, W186)
   *  L'ombre d'une aile tourne au-dessus des berceaux : y rester assez
   *  longtemps donne l'œuf qui attendait (E255) ; le porter fait
   *  descendre la ficelle de grues de papier (W395).
   * --------------------------------------------------------------- */
  S({ id: 'W383', name: 'The Nursery of Unhatched Eggs', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the cradle', backAt: [14, 20],
    map: (function () {
      var g = K.grid(30, 22, ' '); g.box(0, 0, 30, 22, '#', '.');
      g.ellipse(14.5, 10.5, 7, 5, ',');
      [4, 8, 12, 17, 21, 25].forEach(function (x) { g.set(x, 3, '{'); g.set(x, 18, '{'); });
      [7, 11, 14].forEach(function (y) { g.set(3, y, '{'); g.set(26, y, '{'); });
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#2a2440', '#201a34', '#342e4a'] }, floor2: { p: 'rug', c: ['#3a3460', '#4a4470'] },
      wall: { p: 'flat', c: ['#0a0818', '#06040e'], topColor: '#0a0818' }, wallface: { p: 'wallpaper', c: ['#2a2a50', '#20204a', '#e0d890'], skirt: '#101020' } },
    tall: { '{': { look: 'nest', opt: { c: ['#c8b8a8'] } } },
    style: { renderer: 'watercolor', tallWalls: true, stars: true }, music: 'eggnursery', amb: { type: 'musicbox', vol: 0.04 }, dark: 0.6,
    doors: [{ to: 'W186', at: [2, 1], look: 'bed', opt: { c: ['#f0e8d0', '#a0a8e0'] }, label: 'the cradle, back up to the lullaby' },
      { to: 'W395', at: [16, 1], look: 'crane', label: 'the string of paper cranes', cond: orSeen({ equipped: 'E255' }, 'W395') }],
    extra: { noFurnish: true },
    decor: [{ look: 'musicbox', n: 1, at: [27, 18], lines: ['A music box without a dancer. Only the spring, turning, turning.'] },
      { look: 'blanketlump', n: 1, at: [2, 19], lines: ['A folded blanket, waiting for someone small enough.'] }],
    npcs: [{ id: 'N2005', name: 'The Egg Warden', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#d8d0e8', '#b8b0c8', '#f0e8f0', '#3a3050'], eyes: 'closed', acc: 'clipboard' }),
        behavior: 'patrol', path: [[5, 5], [24, 5], [24, 16], [5, 16]], speed: 0.3, solid: true,
        lines: [EN('Shh. They aren’t asleep. They aren’t awake. They are waiting to be wanted.'), EN('Every egg here is something someone put down, meaning to pick it up later.'),
          EN('The mother bird never lands. She circles. If you want to be warm, go where her shadow goes.'),
          { if: { effect: 'E255' }, t: 'Carry it. That is all it ever asked for.', lang: 'en' }] },
      { id: 'N2006', name: 'An Egg That Rocks Itself', count: 4, look: { t: 'blob', c: ['#f0e8d8'], h: 9 }, behavior: 'wander', radius: 1, speed: 0.3, solid: false, passThrough: true,
        lines: ['An egg rocks itself, very slowly, the way you rock a baby you are too tired to hold.'] },
      { id: 'N2007', name: 'The Wing Above', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 20,
        ambientLines: ['Far above, something enormous beats its wings once. Every cradle sways.', 'A feather comes down, slowly, and never lands.'] }],
    mech: [{ type: 'followShadow', center: [14.5, 10.5], r: 5, speed: 0.22, secs: 16, give: 'E255', breakLine: 'The shadow slides on without you. The cold comes back at once.',
      winLines: ['You keep to the shadow of the wing, round and round, until you are dizzy and warm.',
        'One egg rolls out of its nest and stops against your foot. It does not hatch. It only wanted to be carried.'] }],
    place: [['An egg in a nest of hospital towels. Its tag says “later”.', [6, 2]], ['An egg with a crack that has stayed exactly the same size for years.', [10, 2]],
      ['An egg wearing a tiny knitted hat, made in a break room at four in the morning.', [19, 2]], ['An egg labelled “drawing for mum”. It is very flat.', [23, 2]],
      ['An egg labelled “Thursday, school play”. It is cold.', [6, 19]], ['An egg with no label. It is the warmest one.', [23, 19]]]
      .map(function (e, i) { return { id: 'egg' + i, type: 'decor', at: e[1], look: 'egg', lines: [e[0]] }; }).concat([
      { id: 'cranestring', type: 'decor', at: [13, 1], look: 'crane', lines: ['A string of paper cranes hangs from the dark, too high to reach.', 'It sways towards each egg in turn, as if it were counting them.'] },
      SOUL([EN('In the room of nests, things are laid down. In here, they wait for someone to come back for them.')]),
      SOUL([KS('나중에. 나중에 꼭.', 'Later. Later, for sure.')]),
      HINT('h_wing', [EN('Under the wing it is warm. The wing does not stop for anyone.')])]),
    info: { summary: 'A midnight-blue nursery of nests and eggs that never hatched, under the shadow of a circling wing.',
      rules: ['A shadow circles the middle of the room. Stay inside it for sixteen seconds without falling behind: an egg gives itself to you (The Egg That Waited, E255).',
        'Equip The Egg That Waited: the string of paper cranes comes down and leads to the Thousandth Crane (W395).'],
      secrets: ['The string of cranes (W395).'],
      lore: 'Everything she put down meaning to pick it up later.' } });
  link('W186', { to: 'W383', look: 'nest', label: 'a nest under the cradle, still warm', cond: { secret: 'lullaby_sung' } });

  /* ---------------------------------------------------------------
   *  W384 — Le Couloir des nuits (le rêve de la mère, sous W187)
   *  Les lumières d'appel s'allument dans un ordre ; y répondre dans cet
   *  ordre finit la garde (E257, sabots). Alors 7:00 s'ouvre (W398),
   *  et l'escalier du personnel (W399) — ou à trois heures du matin, vraies.
   * --------------------------------------------------------------- */
  var CALLS = ['call1', 'call2', 'call3', 'call4', 'call5'];
  S({ id: 'W384', name: 'The Corridor of Night Shifts', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the bed near a door', backAt: [1, 3],
    map: (function () {
      var g = K.grid(84, 12, ' ');
      g.box(38, 6, 12, 6, '#', '.');
      g.box(0, 0, 84, 7, '#', '.');
      g.set(43, 6, '.'); g.set(44, 6, '.');
      g.hline(1, 82, 3, ',');
      return g.rows();
    })(),
    look: Object.assign({}, K.LOOK.hospital, { floor: { p: 'tile', c: ['#a8b8b4', '#88989a'] }, floor2: { p: 'flat', c: ['#6a9a8a', '#5a8a7a'] } }),
    style: { renderer: 'surveillance', tallWalls: true }, music: 'nightcorridor', amb: { type: 'beep', vol: 0.04 }, dark: 0.5,
    doors: [{ to: 'W187', at: [3, 1], look: 'door', opt: { style: 'wood', c: ['#6a5a3a'] }, label: 'the long dark corridor, with a line of light under its door' },
      { to: 'W398', at: [82, 3], look: 'door', opt: { style: 'metal', c: ['#e0e0d8'], symbol: '7' }, label: 'EXIT — 07:00', cond: orSeen({ flag: 'bss_shift' }, 'W398'),
        locked: 'A door at the end of the corridor: “EXIT — 07:00”. It is 03:12. It has been 03:12 for a very long time.' },
      { to: 'W394', at: [47, 8], look: 'fridge', label: 'the staff-room fridge, covered in notes' },
      { to: 'W399', at: [40, 8], look: 'stairs', label: 'the staff stairwell, going up to the roof', cond: { any: [{ flag: 'bss_shift' }, { realHour: [3, 4] }, { visited: 'W399' }] } }],
    decor: [{ look: 'pills', n: 2, lines: ['A paper cup of pills for room 6. Counted twice.'] },
      { look: 'coffee', n: 2, lines: ['A vending-machine coffee, gone cold. Three sugars. She doesn’t take sugar. She does at night.'] },
      { look: 'bench', n: 2, lines: ['A plastic bench for families. Nobody comes at night.'] }],
    npcs: [{ id: 'N2008', name: 'The Night Nurse', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#c8dce8', '#a8bcc8', '#e8c8b0', '#1a1010'], eyes: 'line' }),
        behavior: 'patrol', path: [[6, 4], [78, 4]], speed: 0.55, solid: true,
        lines: [KS('괜찮아요. 금방 갈게요.', 'It’s all right. I’m coming.'), KS('세 시 십이 분… 아직도.', 'Twelve minutes past three… still.'),
          { seq: ['She checks her watch, then the ceiling, as if the flat were up there. Her name tag says KIM M.', KS('집에 전화해야 되는데. 자고 있겠지.', 'I should call home. She’ll be asleep.')] },
          { seq: [KS('간호사는 졸면 안 돼. 엄마도.', 'A nurse can’t nod off. A mum can’t either.'), KS('세 시엔 다들 옥상에 올라가. 숨 쉬러.', 'At three, everyone goes up to the roof. To breathe.')] },
          { if: { flag: 'bss_shift' }, seq: [KS('일곱 시다.', 'Seven o’clock.'), 'She looks at the white clogs on your feet, then at your face. She does not recognise you. She smiles anyway.',
            KS('…오늘은 바로 집에 가서 얼굴 봐야지.', '…Today I’ll go straight home and look at her face.')] }] },
      { id: 'N2009', name: 'A Patient Who Calls', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 14,
        ambientLines: [EN('Nurse?'), EN('Nurse… is it morning yet?'), KS('간호사님, 물 좀…', 'Nurse, some water…'), EN('Is anyone there? I only wanted to know if anyone was there.')] },
      { id: 'N2010', name: 'A Colleague Asleep on Two Chairs', look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#c8d8c8', '#a8b8a8', '#d8b8a0', '#3a2a1a'], eyes: 'closed' }), behavior: 'static', solid: true, at: [44, 10],
        lines: [KS('오 분만. 오 분만 눈 붙일게.', 'Five minutes. Just five minutes with my eyes shut.'), 'He is asleep sitting up, his badge still clipped on, his phone glowing in his hand.'] }],
    mech: [{ type: 'sequence', order: ['call3', 'call1', 'call5', 'call2', 'call4'], ring: { every: 1.8, pause: 6, sfx: 'bell', hear: 50, glyph: '◉', color: '#ff7070' }, give: 'E257',
      okLines: ['You answer the call. Someone wants water. You bring it.', 'You answer. Someone only wanted to know if it was morning yet.', 'You answer. Someone wants the window shut. It is shut. You shut it again.',
        'You answer. Someone asks you to stay a minute. You stay a minute.', 'You answer the last light. Nobody is calling any more.'],
      wrongLine: 'The light goes out before you reach it. Another one lights up, further along.',
      reward: [{ setNow: { bss_shift: true } }, { note: 'n_bss_shift' }],
      winLines: ['The clock on the wall jumps from 03:12 to 07:00 without passing through anything in between.',
        'At the nurses’ station, someone has left a pair of white clogs, worn down at the heels.', 'Tonight they are your size.'] }],
    place: CALLS.map(function (id, i) { return { id: id, type: 'decor', at: [30 + i * 4, 1], look: 'door', lookOpt: { style: 'metal', c: ['#b8c8c8'], symbol: String(i + 2) }, lines: ['A ward door. Above it, a call light, dark.'] }; }).concat([
      { id: 'clock', type: 'decor', at: [20, 1], look: 'wallclock', lines: ['A wall clock: 03:12. The second hand trembles in place.'] },
      { id: 'rota', type: 'decor', at: [26, 1], look: 'clipboard', lines: ['The rota. Every night of every month has the same name on it: KIM M., 21:00–07:00.'] },
      { id: 'table', type: 'decor', at: [42, 9], look: 'table', lines: ['The staff-room table. A packed lunch, untouched. On the lid, in a child’s handwriting: “eat”.'] },
      SOUL([KS('나이트 끝나면 아침 해가 너무 밝아.', 'When a night shift ends, the morning sun is far too bright.')]),
      SOUL([EN('Eleven kilometres a night, up and down one corridor. She has walked to Seoul and back on this floor.')]),
      HINT('h_calls', [EN('The lights call in an order. The tired learn it without counting.')]),
      HINT('h_three', [KS('새벽 세 시엔 옥상 문이 열려 있어.', 'At three in the morning, the roof door is left open.')])]),
    info: { summary: 'Her mother’s dream: a hospital corridor at 03:12 that never ends, where the call lights ring all night.',
      rules: ['Five call lights ring one after another, then pause. Answer them (interact) in the order they ring: the shift ends, the clock jumps to 07:00 and the Night-Shift Clogs (E257) are left for you.',
        'Once the shift is over, the EXIT door opens onto Seven O’Clock, the Doorway (W398) and the staff stairwell goes up to the roof (W399).',
        'Real time: between 03:00 and 04:00, the staff stairwell is open even before the shift is over.'],
      time: ['Real time, 03:00–03:59: the roof stairs.'],
      secrets: ['The roof of the first night shift (W399).', 'The staff-room fridge (W394).'],
      lore: 'Mi-ran’s own dream: the same corridor, every night, for eighteen years.' } });
  link('W187', { to: 'W384', look: 'door', lookOpt: { style: 'metal', c: ['#c8d8d8'] }, label: 'a ward door, propped open with a chair', cond: { secret: 'mother_voice' } });

  /* ---------------------------------------------------------------
   *  W385 — La Marée de neige (sous le lit aux draps sans couleur, W184)
   *  Une mer de neige de télévision. Arrêter la chaîne au bon moment
   *  donne la Neige de télévision (E256), qui montre une porte blanche :
   *  la chapelle vide de la Grande Prêtresse (W388).
   * --------------------------------------------------------------- */
  S({ id: 'W385', name: 'The Static Tide', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the colourless bed',
    gen: { type: 'cave', w: 56, h: 40, opts: { fill: 0.5, iter: 4, wall: '~' } },
    look: { floor: { p: 'noise', c: ['#9a9a9a', '#5a5a5a', '#d8d8d8'] }, floor2: { p: 'checker', c: ['#e0e0e0', '#202020'] },
      water: { p: 'water', c: ['#6a6a6a', '#3a3a3a', '#b0b0b0', '#ffffff'] }, wall: { p: 'flat', c: ['#101010', '#080808'] } },
    style: { renderer: 'collage', sky: ['#202020', '#606060'], filter: 'grayscale(1) contrast(1.2)' }, music: 'statictide', amb: { type: 'static', vol: 0.06 }, weather: { snow: true },
    doors: [{ to: 'W184', look: 'crt', label: 'a television face down on the shore, hissing colours' },
      { to: 'W388', at: 'random-hidden', look: 'door', opt: { style: 'wood', c: ['#f4f4f4'] }, label: 'a white door, standing up in the static', cond: orSeen({ equipped: 'E256' }, 'W388') }],
    decor: [{ look: 'crt', n: 6, lines: ['A television on the shore, still plugged into the sea.', 'A television showing the back of someone’s head. It is your head.',
        'A small television. On it, a hospital corridor at night, seen from the ceiling.'] },
      { look: 'antenna', n: 3, lines: ['An antenna, bent towards the north. It receives nothing but good news.'] },
      { look: 'scraps', n: 4, lines: ['Strips of newspaper with black bars across them. Under the bars, the paper is warm.', 'A photograph with one face cut out. The hole is smiling.'] }],
    npcs: [{ id: 'N2011', name: 'The Announcer Up to Her Waist', look: H({ t: 'adult', hairStyle: 'short', body: 'coat', c: ['#c8c8c8', '#8a8a8a', '#e0e0e0', '#202020'], eyes: 'dots', mouth: 'smile' }), behavior: 'static', solid: true,
        lines: [EN('Good evening. Nothing happened today. We will now show it again.'), EN('Everything that gets cut from the broadcast washes up here. We sort it by tide.'),
          EN('Stay tuned. Somewhere in this snow there is a channel where someone is waiting up.'),
          { seq: ['She lowers her voice, as if the sea were listening.', EN('There is a white door out on the static. You only see it with the snow on you.')] }] },
      { id: 'N2012', name: 'A Cut-Out Face', count: 4, look: ghost('rgba(230,230,230,0.5)', 20), behavior: 'wander', radius: 6, speed: 0.5, solid: false,
        lines: ['A face cut out of a newspaper photo, drifting on the static. It is still smiling.', 'A face with a black bar over its eyes. It bumps gently into you, like a boat.'] },
      { id: 'N2013', name: 'The Broadcast', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 50, ambientEvery: 16,
        ambientLines: [KN('모든 것이 다 좋습니다. 날씨도 좋습니다.', 'Everything is good. The weather is good too.'), KS('지금 바로 주문하세요. 잠은 한정 수량입니다.', 'Order now. Sleep is available in limited quantities.'),
          EN('…we apologise for the interruption. There has been no interruption.'), EN('This is the end of today’s programmes. Please do not switch off.')] }],
    mech: [{ type: 'cycleFrames', mark: 'channel', every: 2.2, good: 4, give: 'E256',
      frames: ['On screen: snow.', 'On screen: a shopping channel, selling sleep by the hour.', 'On screen: a parade. Everyone is smiling exactly the same amount.',
        'On screen: the weather for a city nobody lives in.', 'On screen: a flat at night, lamp on. A girl asleep. Someone is sitting at the end of the bed.',
        'On screen: a test card, and a clock: 03:12.', 'On screen: a newsreader reads out a name. Then the name is cut out of the picture.'],
      winLines: ['You stop the channel on the sleeping girl and the person sitting with her.', 'The tide goes still, like a held breath.',
        'Snow lifts off the screen and settles on your shoulders. It does not melt.'] }],
    place: [{ id: 'channel', type: 'decor', at: 'random-any', look: 'screen', light: 1.6, lines: ['A huge screen standing in the static, changing channel by itself.'] },
      SOUL([EN('Everything she erases ends up as snow.')]),
      SOUL([KN('신문에서 지운 사람도 꿈에서는 웃어요.', 'People erased from the newspapers still smile in dreams.')]),
      HINT('h_channel', [EN('Stop on the channel where nobody is alone.')])],
    info: { summary: 'A grey sea made of television static, where everything cut from the broadcast washes up.',
      rules: ['A big screen flicks through seven channels. Interact while it shows the sleeping girl with someone at the end of her bed: you get Television Snow (E256).',
        'With Television Snow equipped, a white door appears somewhere in a nook of the static: the Priestess’s Empty Chapel (W388).'],
      secrets: ['The white door to the Priestess’s Empty Chapel.'],
      lore: 'What is erased so that everything is fine does not disappear. It becomes snow.' } });
  link('W184', { to: 'W385', look: 'crt', label: 'a television face down in the colours, hissing', cond: { secret: 'color_unnamed' } });

  /* ---------------------------------------------------------------
   *  W386 — Là où les sorcières étaient petites (sous W185)
   *  Cinq petites filles apprennent cinq règles. Défaire les cinq
   *  (ranger les cinq objets) ouvre le sixième lit : la chapelle (W388).
   * --------------------------------------------------------------- */
  var GIRLX = [5, 10, 15, 20, 25];
  function girl(id, name, hair, body, cols, lines, extra) { return Object.assign({ id: id, name: name, look: H({ t: 'kid', hairStyle: hair, body: body, c: cols, h: 16, eyes: 'dots', mouth: 'line' }), behavior: 'static', solid: true, lines: lines }, extra || {}); }
  S({ id: 'W386', name: 'Where the Witches Were Girls', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the bed from before words', backAt: [16, 16],
    map: (function () { var g = K.grid(32, 18, ' '); g.box(0, 0, 32, 18, '#', '.'); g.rect(1, 1, 30, 8, ','); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#c8a880', '#b89870', '#d8b890'] }, floor2: { p: 'rug', c: ['#e8c8d0', '#d8b8c8'] },
      wall: { p: 'flat', c: ['#3a2a30', '#2a1a20'], topColor: '#3a2a30' }, wallface: { p: 'wallpaper', c: ['#f0d8c8', '#e0c8b8', '#c8a8a0'], skirt: '#8a6a60' } },
    style: { renderer: 'crayon', tallWalls: true }, music: 'girlsbefore', amb: { type: 'kids', vol: 0.02 }, dark: 0.25,
    doors: [{ to: 'W185', at: [2, 16], look: 'door', opt: { style: 'wood', c: ['#e8d8b0'] }, label: 'back to before words' },
      { to: 'W388', at: [29, 2], look: 'bed', opt: { c: ['#e8e4d8', '#202020'] }, label: 'the sixth bed', cond: orSeen({ flag: 'bss_girls' }, 'W388'),
        locked: 'A sixth bed, made with newspaper sheets, every line crossed out. It is not for sleeping in. Not yet.' }],
    decor: [{ look: 'toybox', n: 1, lines: ['A toy box. Inside, five identical yellow hairclips shaped like stars.'] },
      { look: 'doll', n: 2, lines: ['A doll with its mouth sewn shut. Someone has started to unpick the stitches.', 'A doll sitting very straight, being good.'] }],
    npcs: [girl('N2014', 'A Girl Keeping Quiet', 'short', 'dress', ['#2a2a34', '#1a1a24', '#f0d8c0', '#1e1a26'],
        [{ seq: ['She has a finger on her lips. She has kept it there so long it has left a mark.', KS('쉿. 엄마 자.', 'Shh. Mum’s sleeping.')] },
          { if: { flag: 'bss_girls' }, t: '…말해도 돼? 진짜?', lang: 'ko-s', tr: '…I’m allowed to talk? Really?' }]),
      girl('N2015', 'A Girl Who Sews', 'bun', 'dress', ['#6a3028', '#4a2018', '#f0d8c0', '#1e1a26'],
        [{ seq: ['She is sewing her sleeve shut over her wrist. The thread is the colour of skin.', KS('꿰매면 아무도 몰라.', 'If you sew it shut, nobody knows.')] },
          { if: { flag: 'bss_girls' }, t: '아파. …아프다고 말해도 되는구나.', lang: 'ko-s', tr: 'It hurts. …So I can say that it hurts.' }]),
      girl('N2016', 'A Girl Who Copies', 'short', 'sweater', ['#d8d0c4', '#b8b0a4', '#f0d8c0', '#1e1a26'],
        [{ seq: ['Whatever you do, she does a moment later.', KS('다들 그렇게 해. 그러니까 나도.', 'Everyone does it like that. So I do too.')] },
          { if: { flag: 'bss_girls' }, t: '이건 내 거야. 아무도 안 따라 했어.', lang: 'ko-s', tr: 'This one’s mine. I didn’t copy anybody.' }], { behavior: 'mimic' }),
      girl('N2017', 'A Girl by the Door', 'braids', 'dress', ['#2a2a38', '#1a1a28', '#f0d8c0', '#1e1a26'],
        [{ seq: ['She is crouching beside a doorbell, holding her breath.', KS('누가 와도 문 열지 마. 엄마가 그랬어.', 'Don’t open the door, whoever comes. Mum said so.')] },
          { if: { flag: 'bss_girls' }, t: '누구세요, 하고 물어봐도 되는 거였어.', lang: 'ko-s', tr: 'I was allowed to ask who it was, all along.' }]),
      girl('N2018', 'A Girl with a Suitcase', 'long', 'coat', ['#5a2a2a', '#3a1414', '#f0d8c0', '#1e1a26'],
        [{ seq: ['She is watching the window, her suitcase packed beside her.', KS('아빠가 내일 온대.', 'Dad says he’s coming tomorrow.')] },
          { if: { flag: 'bss_girls' }, t: '내일은 그냥 내일이야. 오늘은 여기 있을래.', lang: 'ko-s', tr: 'Tomorrow is just tomorrow. Today I’ll stay here.' }]),
      { id: 'N2019', name: 'The Voice That Teaches Rules', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 15,
        ambientLines: [KS('조용히 해. 엄마 주무셔.', 'Be quiet. Mum is sleeping.'), KS('아무한테도 보여 주지 마.', 'Don’t show anyone.'), KS('남들 하는 대로 해.', 'Do what the others do.'),
          KS('초인종 울려도 열지 마.', 'If the bell rings, don’t open.'), KS('아빠 다시 올 거야.', 'Dad will come back.')] }].map(function (n, i) { if (i < 5) n.at = [GIRLX[i], 4]; return n; }),
    mech: [{ type: 'visitAll', marks: ['rule1', 'rule2', 'rule3', 'rule4', 'rule5'], countText: 'Rules undone # / %',
      reward: [{ setNow: { bss_girls: true } }, { secret: 'witches_were_girls' }, { note: 'n_bss_girls' }],
      winLines: ['Five girls, five beds, and for the first time nobody is keeping a rule.', 'They look at each other. They all wear the same yellow star-shaped hairclip as you.',
        'At the end of the room, the sixth bed shrugs off its newspaper sheets.'] }],
    place: GIRLX.map(function (x, i) { return { id: 'bed' + i, type: 'decor', at: [x, 2], look: 'bed', lookOpt: { c: ['#f0e8e0', ['#3a3a48', '#b02838', '#d8d0c4', '#2a2a38', '#7a4a2a'][i]] }, lines: ['A small bed. The blanket is folded with perfect corners, the way you fold it when you are trying to be good.'] }; }).concat([
      { id: 'rule1', type: 'decor', at: [5, 6], look: 'scraps', lines: ['A strip of tape on the floor, the size of a mouth. You peel it up and fold it away.', 'The girl with her finger on her lips takes it away. Very slowly. Nothing bad happens.'] },
      { id: 'rule2', type: 'decor', at: [10, 6], look: 'drawer', lines: ['A sewing box, open. You close the lid on the needle and the skin-coloured thread.', 'The girl who sews lets go of her sleeve. Under it, a bruise. She doesn’t cover it.'] },
      { id: 'rule3', type: 'decor', at: [15, 6], look: 'drawing', lines: ['Two drawings, one copied from the other. You turn the copy over: on the back, she can draw anything.', 'The girl who copies stops copying. She draws a dog with six legs, very happy.'] },
      { id: 'rule4', type: 'decor', at: [20, 6], look: 'doorbell', lines: ['A doorbell, taped over with brown tape. You peel the tape off.', 'It rings. The girl by the door asks, through the door: “Who is it?” It is only the wind. She laughs.'] },
      { id: 'rule5', type: 'decor', at: [25, 6], look: 'suitcase', lines: ['A small suitcase by the window, packed for a visit that never came. You unpack it: pyjamas, a toothbrush.', 'The girl with the suitcase stops watching the window. She puts her pyjamas on, here, where she is.'] },
      { id: 'board', type: 'decor', at: [12, 1], look: 'blackboard', lines: ['On the blackboard, five rules in a child’s handwriting. Each has been copied out a hundred times.'] },
      SOUL([EN('Subjects one to five: files missing. They were never missing. They were only small.')]),
      SOUL([KS('규칙을 지키면 착한 아이래.', 'If you keep the rules, they say you’re a good girl.')]),
      HINT('h_rules', [EN('A rule is undone with the hands, not with words. Put the things away.')])]),
    info: { summary: 'A playroom with six small beds, where five little girls are each learning one rule of the house.',
      rules: ['Five girls, five rules: keep quiet, sew it shut, copy the others, never open the door, wait for Dad. Beside each girl lies the object of her rule.',
        'Interact with all five objects (tape, sewing box, copied drawing, taped doorbell, suitcase) to undo the rules: the sixth bed opens onto the Priestess’s Empty Chapel (W388).'],
      secrets: ['The sixth bed: the Priestess’s Empty Chapel.'],
      lore: 'The five witches were rules learned too early. Before that, they were girls. They all have her hairclip.' } });
  link('W185', { to: 'W386', look: 'door', lookOpt: { style: 'wood', c: ['#e8c8a0'] }, label: 'a very small door, at toddler height', cond: { secret: 'first_word' } });

  /* ---------------------------------------------------------------
   *  W387 — L'Escalier de tous les anniversaires (sous W188)
   *  Douze paliers, douze anniversaires. Au sommet, les allumettes
   *  posent quatre questions sur ce qu'on a vu en montant. Palier 4 :
   *  le jardin (W389) ; palier 6 : la blague (W392) ; palier 9 : un mur
   *  qui n'en est pas un, et le cadeau jamais donné.
   * --------------------------------------------------------------- */
  function LAND(a) { return 60 - (a - 1) * 5; }
  var CAKES = [
    ['A cake with one candle. Three people are singing: a woman, a man, an old woman. The old woman sings loudest.'],
    ['A cake shaped like a rabbit. A man is filming with his phone. You can hear him laughing behind it.'],
    ['Three candles. Someone has written “소라” in chocolate, a little crooked.'],
    ['Four candles, in a garden. There is soil on the cake.', 'An old woman and a small girl have just planted something.'],
    ['Five candles. Dad tells a joke. Everyone groans. Everyone laughs.'],
    ['Six candles. A chair has been pushed in at the table, too neatly. Nobody sits on it.', 'By the front door, a pale rectangle on the floor where a suitcase stood.'],
    ['Seven candles. Halmeoni lights them. Mum is on the phone in her uniform, saying sorry to someone.'],
    ['Eight candles, on a cake from the supermarket. Halmeoni says it is the best one yet.'],
    ['A cake, untouched, on a table covered in white flowers. No candles. Nobody could bring themselves to.'],
    ['Ten candles. A note beside the cake:', KS('생일 축하해. 미안, 오늘 나이트야. — 엄마', 'Happy birthday. Sorry, night shift tonight. — Mum')],
    ['Eleven candles. She lit them herself, with a match, the way she was told never to. Nobody sang.']
  ];
  S({ id: 'W387', name: 'The Staircase of Every Birthday', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'ladder', backLabel: 'back up under the cot in the sun', backAt: [1, LAND(1)],
    map: (function () {
      var g = K.grid(19, 64, '#');
      for (var a = 1; a <= 12; a++) { var y = LAND(a); g.rect(1, y - 1, 13, 3, a === 4 ? '*' : '.'); if (a < 12) g.rect(5, y - 3, 5, 2, 's'); }
      var y9 = LAND(9); g.set(14, y9, '?'); g.rect(15, y9 - 1, 3, 3, ',');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#e8c890', '#d8b880', '#f0d8a0'] }, floor2: { p: 'rug', c: ['#f0e0c0', '#e8d0b0'] }, flowers: { p: 'flowers', c: ['#8aa860', '#f0e0a0', '#e0a0a0', '#ffffff'] },
      wall: { p: 'flat', c: ['#4a3a2a', '#3a2a1a'], topColor: '#4a3a2a' }, wallface: { p: 'wallpaper', c: ['#f0e0b8', '#e0d0a8', '#c8b088'], skirt: '#8a6a48' } },
    style: { renderer: 'watercolor', tallWalls: true }, music: 'birthdaystairs', amb: { type: 'clock', vol: 0.04 },
    doors: [{ to: 'W188', at: [13, LAND(1)], look: 'door', opt: { style: 'wood', c: ['#f0d8a0'] }, label: 'back into the Sunday sunlight' },
      { to: 'W389', at: [13, LAND(4)], look: 'gate', opt: { c: ['#8a7a5a'] }, label: 'a garden gate, on the fourth landing' },
      { to: 'W392', at: [13, LAND(6)], look: 'door', opt: { style: 'wood', c: ['#5a4a3a'] }, label: 'the front door, on the sixth landing' },
      { to: 'W390', at: [12, LAND(12)], look: 'ladder', label: 'a ladder above the last landing, to the ceiling', cond: orSeen({ flag: 'bss_twelve' }, 'W390') }],
    npcs: [{ id: 'N2020', name: 'A Balloon Going Upstairs', look: { t: 'jelly', c: ['#f06070'], h: 10 }, behavior: 'fly', radius: 3, speed: 0.6, solid: false,
        lines: ['A red balloon, climbing the stairs one at a time. Its string is tied to nothing.'] },
      { id: 'N2021', name: 'Halmeoni at Eight Candles', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#e8dcc8', '#c8bca8', '#e0c0a0', '#c8c8c8'] }), behavior: 'static', solid: true, at: [10, LAND(8)],
        lines: [KS('우리 강아지, 벌써 여덟 살이야?', 'My little puppy, eight already?'), KS('엄마 바빠도 할머니가 있잖아.', 'Mum may be busy, but you’ve got Grandma.'),
          { seq: ['She looks down the stairs, then up them.', KS('위로 갈수록 사람이 줄어. 그래도 올라가.', 'The higher you go, the fewer people. Keep climbing anyway.')] }] },
      { id: 'N2022', name: 'A Blurred Man on the Sixth Landing', look: H({ t: 'adult', body: 'coat', c: ['#6a6a7a', '#4a4a5a', '#d0c0b0', '#1a1a1a'], alpha: 0.35, eyes: 'none', acc: 'suitcase' }), behavior: 'static', solid: false, at: [10, LAND(6)],
        lines: [EN('Knock knock.'), 'He waits for you to say “who’s there”. Before you can, he has gone a little blurrier.'] }],
    mech: [{ type: 'quiz', mark: 'twelve', intro: ['Twelve candles, not lit yet. The matchbox rattles.', 'Before you light them, it wants to know if you were looking on the way up.'],
      questions: [{ q: 'On which birthday did a chair stay empty?', choices: ['The fourth', 'The sixth', 'The ninth'], right: 1 },
        { q: 'Who sang loudest, the very first time?', choices: ['Mum', 'Dad', 'Halmeoni'], right: 2 },
        { q: 'Who lit the eleven candles?', choices: ['Mum', 'Nobody', 'She did, herself'], right: 2 },
        { q: 'Which cake had soil on it?', choices: ['The fourth', 'The seventh', 'The tenth'], right: 0 }],
      failLine: 'The match goes out before it reaches the wick. Go down and look again.',
      reward: [{ setNow: { bss_twelve: true } }, { secret: 'twelve_candles' }, { note: 'n_bss_twelve' }],
      winLines: ['You light the twelve candles, one by one. For once you sing too. Only in your head, but you sing.',
        'Above the last landing, a ladder lets itself down from the ceiling.'] }],
    place: CAKES.map(function (l, i) { return { id: 'cake' + (i + 1), type: 'decor', at: [3, LAND(i + 1)], look: 'cake', lines: l }; }).concat([
      { id: 'twelve', type: 'decor', at: [3, LAND(12)], look: 'cake', light: 1.2, lines: ['Twelve candles, not lit yet. The matches are beside the cake. This is today.'] },
      { id: 'present', type: 'decor', at: [16, LAND(9)], look: 'toybox', lines: ['A present wrapped in newspaper, tied with garden string. The tag:', KS('소라 열 살 생일 — 할머니', 'For Sora’s tenth birthday — Grandma'),
        'Inside, a watering can her size. Halmeoni wrapped it early. She didn’t get there.'], use: [{ secret: 'halmeoni_present' }, { note: 'n_bss_present' }] },
      SOUL([EN('Every year the staircase got one step longer, and fewer people climbed it.')]),
      SOUL([KS('생일 축하합니다…', 'Happy birthday to you…')]),
      HINT('h_present', [EN('On the ninth landing, the wall on the right is only pretending.')])]),
    info: { summary: 'A sunlit staircase of twelve landings, one for each birthday, with fewer people on each.',
      rules: ['Climb all twelve landings and look at each cake. At the top, the twelve candles ask four questions about what you saw (the empty chair: sixth; loudest singer: Halmeoni; eleven candles: she lit them herself; soil: fourth).',
        'All four right: the candles light and a ladder to the Bed Seen from Above (W390) comes down.',
        'Landing 4 opens onto the Garden That Remembers (W389); landing 6 onto the Missing Punchline (W392).'],
      secrets: ['Landing 9: a false wall on the right (walk through it with a revealing effect) hides Halmeoni’s present for her tenth birthday.'],
      lore: 'Twelve birthdays. The chair, the flowers, the note on the fridge, the match.' } });
  link('W188', { to: 'W387', look: 'stairs', label: 'a staircase that wasn’t there, going on into the sunlight', cond: { secret: 'first_memory' } });

  /* ---------------------------------------------------------------
   *  W388 — La Chapelle vide de la Grande Prêtresse
   *  Elle n'est pas là : elle est en haut, à effacer. Cinq bancs, cinq
   *  noms possibles. Allumer les cinq bougies à la fois (le courant d'air
   *  en éteint une à chaque instant) ouvre la porte derrière l'autel (W397).
   * --------------------------------------------------------------- */
  var CANDLES = [['c1', [4, 9]], ['c2', [8, 6]], ['c3', [12, 7]], ['c4', [16, 6]], ['c5', [20, 9]]];
  var PEWNAMES = [['n1', [9, 14], 'A name carved into the end of a pew: 어머님. Crossed out. Carved again. Crossed out.'],
    ['n2', [9, 17], 'A name carved into a pew: S. Just the initial. The rest has been sanded off.'],
    ['n3', [9, 20], 'A name carved into a pew: 할머니. Beside it, small, in pencil: “she cuts the flowers”.'],
    ['n4', [15, 23], 'Carved into a pew: PROTOCOL 0. The letters are perfectly straight, as if cut with a ruler.'],
    ['n5', [15, 26], 'Carved into a pew: 어버이. Under it, in a child’s hand: “the Parent”.']];
  S({ id: 'W388', name: 'The Priestess’s Empty Chapel', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W385', backLook: 'door', backOpt: { style: 'wood', c: ['#f4f4f4'] }, backLabel: 'back out into the static', backAt: [12, 28],
    map: (function () {
      var g = K.grid(25, 30, ' '); g.box(0, 0, 25, 30, '#', '.');
      g.rect(10, 10, 5, 19, ',');
      for (var y = 14; y <= 26; y += 3) { g.hline(3, 8, y, '{'); g.hline(16, 21, y, '{'); }
      return g.rows();
    })(),
    look: { floor: { p: 'marble', c: ['#d8d4c8', '#202020'] }, floor2: { p: 'carpet', c: ['#e8e4d8', '#c8c4b8'] },
      wall: { p: 'flat', c: ['#101010', '#080808'], topColor: '#101010' }, wallface: { p: 'wallpaper', c: ['#d8d4c8', '#c0bcb0', '#202020'], skirt: '#101010' } },
    tall: { '{': { look: 'bench', opt: { c: ['#3a3430'] } } },
    style: { renderer: 'engraving', tallWalls: true }, music: 'emptychapel', amb: { type: 'choir', vol: 0.025 }, dark: 0.6,
    doors: [{ to: 'W386', at: [2, 28], look: 'bed', opt: { c: ['#e8e4d8', '#202020'] }, label: 'back through the sixth bed' },
      { to: 'W397', at: [21, 2], look: 'door', opt: { style: 'wood', c: ['#1a1a1a'] }, label: 'a door behind the altar, painted over with black bars', cond: orSeen({ flag: 'bss_candles' }, 'W397') }],
    decor: [{ look: 'lantern', n: 3, lines: ['A lamp that has been blown out so many times its wick is shaped like a question mark.'] },
      { look: 'scraps', n: 3, lines: ['A hymn sheet. Every word is blacked out except “fine”.'] }],
    npcs: [{ id: 'N2023', name: 'The Verger Made of Newspaper', look: H({ t: 'tall', head: 'blank', body: 'robe', c: ['#e8e4d8', '#c8c4b8', '#e8e4d8', '#101010'], eyes: 'none' }),
        behavior: 'patrol', path: [[12, 12], [12, 27]], speed: 0.3, solid: true,
        lines: [EN('She isn’t in. She is never in. She is always somewhere else, making things fine.'), EN('Everything she crosses out is brought here and kept. Kept is not the same as gone.'),
          EN('Five candles, five names. Light one and the draught takes another. She likes it when nobody can be sure.'), EN('Which one is she? All of them have sat in the front row.')] },
      { id: 'N2024', name: 'A Hymn Without Words', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 18,
        ambientLines: [KN('모든 것이 다 좋습니다.', 'Everything is good.'), KS('괜찮아. 다 괜찮아.', 'It’s all right. Everything’s all right.'), EN('Nothing happened. Nothing happened. Nothing happened.')] }],
    mech: [{ type: 'lampsAll', lamps: CANDLES.map(function (c) { return c[0]; }), time: 9, light: 2.2,
      litLines: ['Five. Every name is lit.', 'The first candle catches. Behind you, the draught takes a breath.', 'Two. Somewhere in the chapel a page turns over by itself.',
        'Three. The veil of newspapers stirs.', 'Four. The draught is coming back for the first one.'],
      doneLine: 'The five candles burn without flickering. The draught has given up for tonight.',
      reward: [{ setNow: { bss_candles: true } }, { secret: 'priestess_chapel_lit' }, { note: 'n_bss_chapel' }],
      winLines: ['Five candles at once. Five names, all lit, none of them chosen.',
        'For a moment nobody is crossed out. The veil of newspapers lifts by itself.', 'Behind the altar, you see a door painted over with black bars.',
        { t: 'She will be back. She always comes back. But not tonight.', lang: 'en', who: 'The Verger Made of Newspaper' }] }],
    place: CANDLES.map(function (c) { return { id: c[0], type: 'decor', at: c[1], look: 'candle', lines: ['A tall white candle, cold.'] }; })
      .concat(PEWNAMES.map(function (p) { return { id: p[0], type: 'decor', at: p[1], look: 'plaque', lines: [p[2]] }; }))
      .concat([{ id: 'dress', type: 'decor', at: [12, 2], look: 'ghostfig', lookOpt: { c: ['#f4f2ec'] }, lines: ['A white mourning dress on a stand, the kind worn at funerals.', 'It is empty. It stands up straight all the same.',
          'One eye is embroidered on the collar. Closed. Crossed out.'] },
        { id: 'altar', type: 'decor', at: [12, 4], look: 'pedestal', lines: ['The altar. On it, a stack of newspapers. Every line is blacked out except the dates.'] },
        SOUL([EN('One eye closed, one eye crossed out. She sees exactly half of everything, and calls it all.')]),
        SOUL([KS('엄마, 미안해.', 'Mum, I’m sorry.')]),
        HINT('h_candles', [EN('All five at once, or none at all. The draught is quicker than one name.')])]),
    info: { summary: 'The High Priestess’s chapel, empty: a white mourning dress on a stand, five pews with five names, and a veil of crossed-out newspapers.',
      rules: ['Five candles stand around the altar; each goes out nine seconds after it is lit. Light all five at once.',
        'The candles lit, a barred door behind the altar opens onto the White Chrysanthemums (W397).',
        'Reached from the Static Tide (with Television Snow) or through the sixth bed in Where the Witches Were Girls.'],
      secrets: ['The barred door behind the altar.'],
      lore: 'She is not here. She is up above, making things fine. Five names; none is confirmed.' } });

  /* ---------------------------------------------------------------
   *  W389 — Le Jardin qui se souvient (palier 4)
   *  Le premier jour du Jardin : Halmeoni et Sora, quatre ans, plantent
   *  la fleur. Le jardin se souvient par paires (pots) → le tablier (E258),
   *  dont la poche ouvre W396. Au nord, la route de la chaussure (W393).
   * --------------------------------------------------------------- */
  S({ id: 'W389', name: 'The Garden That Remembers', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W387', backLook: 'gate', backOpt: { c: ['#8a7a5a'] }, backLabel: 'back to the fourth landing',
    gen: { type: 'forest', w: 46, h: 34, opts: { density: 0.07, grass: '*', border: true } },
    look: { floor: { p: 'grass', c: ['#8ab860', '#7aa850', '#9ac870', '#6a9840'] }, flowers: { p: 'flowers', c: ['#8ab860', '#f0e0a0', '#f0a0c0', '#ffffff'] } },
    tall: { '^': { look: 'tree', opt: { c: ['#6a9a4a', '#4a7a3a', '#5a4030', '#8aba6a'] } } },
    style: { renderer: 'watercolor', sky: ['#c8e0f0', '#f0f8ff'] }, music: 'firstgarden', amb: { type: 'birds', vol: 0.05 }, weather: { petals: true },
    doors: [{ to: 'W393', look: 'gate', opt: { c: ['#a0a8b0'] }, label: 'a path going north, into snow' },
      { to: 'W396', look: 'clothesline', label: 'an apron on the fence, its pocket gaping', cond: orSeen({ equipped: 'E258' }, 'W396') }],
    decor: [{ id: 'pot', look: 'pot', n: 8, lines: ['A flowerpot.'] },
      { look: 'wateringcan', n: 1, lines: ['A tin watering can, too big for a four-year-old. She uses it anyway.'] },
      { look: 'sprout', n: 3, lines: ['The first sprout. One day it will be a flower with a face, if someone remembers to water it.'] },
      { look: 'seedbag', n: 1, lines: ['A packet of seeds with a handwritten label: “for Sora, when she is older”.'] },
      { look: 'bench', n: 1, lines: ['A bench nobody has worn smooth yet. Everything here is new.'] }],
    npcs: [{ id: 'N2025', name: 'Halmeoni, Kneeling', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#e8dcc8', '#c8bca8', '#e0c0a0', '#c8c8c8'], acc: 'flower' }), behavior: 'static', solid: true,
        lines: [KS('여기다 심자. 해가 제일 오래 드는 데.', 'Let’s plant it here. Where the sun stays longest.'),
          { seq: ['She lifts a flowerpot, peeks underneath, and puts it back.', KS('이 정원은 다 둘씩 기억해. 하나만 있으면 외로우니까.', 'This garden remembers everything in twos. One on its own would be lonely.')] },
          KS('물은 매일 줘야 돼. 사람도 그래.', 'You have to water it every day. People too.'),
          { if: { effect: 'E258' }, t: '앞치마 잘 어울리네. 주머니에 손 넣어 봐.', lang: 'ko-s', tr: 'The apron suits you. Put your hand in the pocket.' }] },
      { id: 'N2026', name: 'Little Sora, Aged Four', look: H({ t: 'kid', hairStyle: 'short', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], h: 14, eyes: 'wide', mouth: 'smile' }),
        behavior: 'wander', radius: 2, speed: 0.8, solid: true,
        lines: [{ seq: ['A little girl with a yellow star hairclip and a watering can far too big for her.', 'She has not stopped talking since you arrived.',
          KS('할머니! 꽃 이름 뭐야? 내가 지어도 돼?', 'Grandma! What’s the flower called? Can I name it?')] }, KS('얘는 플라위야. 플라위!', 'It’s called Flowey. Flowey!'),
          KS('나 커서 할머니처럼 정원 할 거야. 매일매일.', 'When I grow up I’m going to have a garden like Grandma. Every single day.')] },
      { id: 'N2027', name: 'A Young Blackbird', look: { t: 'bird', c: ['#1a1a1a'], h: 8 }, behavior: 'fly', radius: 5, speed: 1.2, solid: false,
        lines: ['A young blackbird. It is learning the three notes. It gets the second one wrong.'] }],
    mech: [{ type: 'pairs', tiles: ['pot0', 'pot1', 'pot2', 'pot3', 'pot4', 'pot5', 'pot6', 'pot7'], give: 'E258',
      wrongLine: 'The garden frowns. It does not remember those two together.',
      winLines: ['Every pot remembers its twin. The garden sighs, the way a person sighs when a name comes back.',
        'On the fence, an apron flaps, though there is no wind.', 'In its pocket: soil, a peppermint, and the smell of her.'] }],
    place: [SOUL([EN('The first garden was planted on a Sunday, in the rain, by two people who did not mind.')]),
      SOUL([KS('할머니 손은 흙 냄새가 나.', 'Grandma’s hands smell of soil.')]),
      HINT('h_pairs', [EN('Lift the pots. The garden keeps its memories underneath, two by two.')])],
    info: { summary: 'The Garden on the day it was first planted: an old woman, a four-year-old who talks non-stop, a watering can too big for her.',
      rules: ['Eight flowerpots hide four pairs of signs. Lift them two at a time; find every pair: Halmeoni’s Apron (E258).',
        'With the Apron equipped, the apron on the fence opens its pocket: Halmeoni’s Apron Pocket (W396).',
        'A path north leads into the snow: the Left Shoe’s Walk (W393).'],
      secrets: ['The apron pocket (W396).'],
      lore: 'The garden that remembers the first one: the day Flowey was planted, and the girl still talked.' } });

  /* ---------------------------------------------------------------
   *  W390 — Le Lit vu d'en haut (au-dessus de W190)
   *  L'appartement 1204, sans toit, vu du plafond. Refaire le trajet de la
   *  mère chaque matin (chaussures, riz, la porte de Sora, son lit) ouvre
   *  la porte d'entrée (W398). Machine à laver (W391), frigo (W394).
   *  À sept heures, vraies, une femme rentre et lève les yeux.
   * --------------------------------------------------------------- */
  S({ id: 'W390', name: 'The Bed Seen from Above', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W381', backLook: 'ladder', backLabel: 'back down under the bed', backAt: [2, 9],
    map: (function () {
      var g = K.grid(36, 24, ' '); g.box(0, 0, 36, 24, '#', '.');
      g.rect(1, 1, 11, 10, ','); g.rect(1, 12, 11, 11, ','); g.rect(19, 1, 16, 10, ':'); g.rect(19, 12, 7, 11, ':');
      g.vline(12, 1, 22, '#'); g.hline(1, 11, 11, '#'); g.vline(18, 1, 22, '#'); g.hline(19, 34, 11, '#'); g.vline(26, 12, 22, '#');
      g.set(12, 5, '.'); g.set(12, 17, '.'); g.set(18, 4, '.'); g.set(18, 15, '.'); g.set(30, 11, '.');
      return g.rows();
    })(),
    look: { floor: { p: 'wood', c: ['#8a6848', '#6a4a30', '#9a7a58'] }, floor2: { p: 'rug', c: ['#a8b8d0', '#90a0c0'] }, floor3: { p: 'tile', c: ['#e0e0d8', '#b0b0a8'] },
      wall: { p: 'flat', c: ['#e8e4dc', '#d0ccc4'] } },
    style: { renderer: 'psychedelic', stars: true, sky: ['#0a0a28', '#1a1440'], cliffH: 0.3, cliff: '#0a0a20' }, music: 'fromabove', amb: { type: 'fridge', vol: 0.03 }, dark: 0.4,
    doors: [{ to: 'W190', at: [3, 3], look: 'bed', opt: { c: ['#f0f0f8', '#a0b0d0'] }, label: 'her own bed, seen from above: lie back down into it' },
      { to: 'W387', at: [15, 1], look: 'stairsdown', label: 'the staircase of every birthday, going down' },
      { to: 'W391', at: [20, 21], look: 'washer', label: 'the washing machine, still turning' },
      { to: 'W394', at: [33, 2], look: 'fridge', label: 'the fridge, covered in notes' },
      { to: 'W398', at: [34, 17], look: 'door', opt: { style: 'metal', c: ['#6a7a8a'], symbol: '1204' }, label: 'the front door', cond: orSeen({ flag: 'bss_route' }, 'W398'),
        locked: 'The front door. From up here you can see both sides of it at once. It is 06:59 on both sides.' }],
    decor: [{ look: 'sock', n: 1, lines: ['A sock in the corridor, exactly where it fell three days ago.'] }],
    npcs: [{ id: 'N2028', name: 'A Woman Coming Home', look: H({ t: 'adult', hairStyle: 'bun', body: 'coat', c: ['#4a5a6a', '#3a4a5a', '#e8c8b0', '#1a1010'], eyes: 'line' }), behavior: 'static', solid: true, at: [30, 16],
        appear: { realHour: [7, 8] },
        lines: [{ seq: [KS('…다녀왔습니다.', '…I’m home.'), 'She takes her shoes off without a sound and looks up, straight at you, at the ceiling.',
          KS('…거기 있니?', '…are you there?')], do: [{ secret: 'seen_from_above_7am' }, { note: 'n_bss_7am' }] }] },
      { id: 'N2029', name: 'A Moth Round the Lamp', look: { t: 'moth', c: ['#e8e0c8'], h: 7 }, behavior: 'fly', radius: 2, speed: 1, solid: false, at: [9, 3],
        lines: ['A moth going round and round the lamp. It has been doing it all night. It thinks the lamp is the moon.'] }],
    mech: [{ type: 'stepOrder', plates: { '31,19': 0, '23,6': 1, '11,5': 2, '4,16': 3 }, count: 4, color: 'rgba(255,230,180,0.9)',
      reward: [{ setNow: { bss_route: true } }, { secret: 'mum_route' }, { note: 'n_bss_route' }],
      winLines: ['Shoes off. Rice on. A look round her door. Lie down.', 'From up here you have watched her do it a thousand times without seeing it. Now you have walked it.',
        'Down in the entrance, the front door unlocks itself, with the small sound of a key turned very carefully.'] }],
    place: [{ id: 'lamp', type: 'decor', at: [10, 2], look: 'lamp', light: 3, lines: ['The bedside lamp, on. From above, it looks like a small sun somebody forgot to switch off.'] },
      { id: 'mumbed', type: 'decor', at: [3, 14], look: 'bed', lookOpt: { c: ['#e8e0d0', '#8090a0'] }, lines: ['Her mother’s bed, made with hospital corners. Cold. It is only ever slept in by day.'] },
      { id: 'rice', type: 'decor', at: [22, 1], look: 'stove', lines: ['The rice cooker, keeping rice warm for nobody since six.'] },
      { id: 'kitchentable', type: 'decor', at: [27, 6], look: 'table', lines: ['The kitchen table. Two chairs. One is always pushed in.'] },
      { id: 'list', type: 'decor', at: [31, 1], look: 'letter', lines: ['A list on the fridge door, in her mother’s handwriting:', KS('신발, 밥, 소라 방, 잠. — 매일 아침', 'Shoes, rice, Sora’s room, sleep. — every morning')] },
      { id: 'shoes', type: 'decor', at: [33, 20], look: 'shoe', lines: ['Two pairs of shoes by the door: small trainers, and a gap where work shoes should be.'] },
      { id: 'p1', type: 'decor', at: [31, 19], look: 'scuff', solid: false, lines: ['A patch of floor worn paler than the rest, just inside the door.'] },
      { id: 'p2', type: 'decor', at: [23, 6], look: 'scuff', solid: false, lines: ['A worn patch in front of the rice cooker.'] },
      { id: 'p3', type: 'decor', at: [11, 5], look: 'scuff', solid: false, lines: ['A worn patch just inside her bedroom door, where someone stands for a moment and doesn’t come in.'] },
      { id: 'p4', type: 'decor', at: [4, 16], look: 'scuff', solid: false, lines: ['A worn patch beside the made bed.'] },
      SOUL([EN('From up here the flat is small enough to look after. Nobody up here is tired.')]),
      HINT('h_seven', [EN('At seven, real seven, a key turns down there. From up here you would see who comes in.')])],
    info: { summary: 'Flat 1204 with its roof taken off, seen from above at night: her bed, the lamp, her mother’s empty bed, the kitchen, the front door.',
      rules: ['A list on the fridge gives the order of her mother’s mornings. Step on the four worn patches in that order: entrance, rice cooker, just inside Sora’s door, beside the mother’s bed. The front door opens onto Seven O’Clock, the Doorway (W398).',
        'The washing machine leads to the Night Drum (W391), the fridge to the Archipelago of Fridge Notes (W394), her own bed back down to the Lit Bedroom.'],
      time: ['Real time, 07:00–07:59: a woman comes home and looks up at the ceiling.'],
      secrets: ['At seven in the morning, real time, talk to the woman coming home.'],
      lore: 'What she would see if she could watch over the flat, the way nobody does at night.' } });
  link('W190', { to: 'W390', look: 'ladder', label: 'a ladder up to the ceiling', cond: { secret: 'light_off_by_mother' } });

  /* ---------------------------------------------------------------
   *  W391 — Le Tambour de nuit (la machine à laver)
   *  « La seule chose de l'appartement qui fait les nuits avec elle. »
   *  Sept tours complets du tambour (laps) : le cycle finit, la tunique
   *  reste collée à la vitre, avec la lettre de l'école dans sa poche.
   * --------------------------------------------------------------- */
  S({ id: 'W391', name: 'The Night Drum', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W390', backLook: 'washer', backLabel: 'back out through the porthole', backAt: [15, 25],
    map: (function () { var g = K.grid(31, 31, ' '); g.ellipse(15, 15, 14, 14, '.'); g.ellipse(15, 15, 9, 9, ','); g.ellipse(15, 15, 3.5, 3.5, '%'); return g.rows(); })(),
    look: { floor: { p: 'dots', c: ['#c8d0d8', '#a8b0b8'] }, floor2: { p: 'waves', c: ['#a8c0d8', '#88a0b8'] }, wall: { p: 'metal', c: ['#8a9098', '#6a7078', '#aab0b8'] }, wall2: { p: 'metal', c: ['#c8ccd0', '#a8acb0', '#e0e4e8'] } },
    style: { renderer: 'psychedelic', sky: ['#1a2030', '#3a4a60'], cliffH: 0.6, cliff: '#202838' }, music: 'nightdrum', amb: { type: 'machine', vol: 0.06 }, dark: 0.35,
    doors: [{ to: 'W381', at: [15, 4], look: 'hatch', label: 'the trapdoor back under the beds' }],
    decor: [{ look: 'sock', n: 4, lines: ['A sock, soaked, going round and round.', 'A small sock and a big sock, tangled together.'] },
      { look: 'towel', n: 3, lines: ['A hospital towel that came home by mistake. It smells of disinfectant, and of her.'] },
      { look: 'clothespin', n: 2, lines: ['A clothes peg that fell in. It holds on to nothing, very firmly.'] }],
    npcs: [{ id: 'N2030', name: 'A Sock Looking for Its Pair', look: { t: 'worm', c: ['#e8e8f0'], h: 8 }, behavior: 'wander', radius: 6, speed: 1, solid: false, passThrough: true,
        lines: ['A sock, wriggling through the wet laundry. It has been looking for the other one since 2019.', 'It sniffs your foot and moves on. Wrong sock.'] },
      { id: 'N2031', name: 'The School Uniform, Spinning', look: H({ t: 'kid', body: 'uniform', c: ['#3a4a6a', '#2a3a5a', '#3a4a6a', '#000000'], alpha: 0.4, eyes: 'none', mouth: 'none' }), behavior: 'orbit', radius: 4, speed: 0.8, solid: false,
        lines: ['A school uniform tumbling round with nobody inside it. It is her size.', 'It goes round and round. It doesn’t have to go anywhere tomorrow.'] },
      { id: 'N2032', name: 'The Hum of the Drum', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 18,
        ambientLines: ['The drum turns. The whole flat is asleep except this.', 'Through the porthole, far away, a light is on in the kitchen.', KS('빨래 다 됐다.', 'The washing’s done.')] }],
    mech: [{ type: 'laps', center: [15, 15], key: 'w391_laps' }, { type: 'wind', strength: 0.5, push: true, dir: 'right' }],
    place: [{ id: 'tunic', type: 'decor', at: [15, 10], look: 'towel', lookOpt: { c: ['#c8dce8'] }, cond: { tempGte: { w391_laps: 28 } }, appearSfx: 'reveal',
        lines: ['The spin is over. One thing is left stuck to the glass: a nurse’s tunic.', 'In its pocket, a folded school letter:',
          'School play, Thursday, 14:00. Parents welcome.', 'The time has been circled. Then crossed out. Then circled again, harder.'], use: [{ secret: 'school_play_letter' }, { note: 'n_bss_tunic' }] },
      SOUL([KS('세탁기 소리 들으면 잠이 와.', 'The sound of the washing machine makes me sleepy.')]),
      HINT('h_spin', [EN('Seven spins a week. The drum counts the nights so that nobody else has to.')])],
    info: { summary: 'The inside of the washing machine, running at night: a turning drum full of socks, towels and an empty school uniform.',
      rules: ['Walk round the drum’s centre seven full times (in either direction) without stopping the count: the cycle ends and a nurse’s tunic appears, stuck to the glass.',
        'The drum pushes you round now and then when you stand still.'],
      secrets: ['The school letter in the tunic pocket.'],
      lore: 'The only thing in the flat that works the night shift with her.' } });

  /* ---------------------------------------------------------------
   *  W392 — La Chute qui manque (palier 6)
   *  « Knock knock. — Who's there? — Daddy. — Daddy who? — … »
   *  Frapper deux fois ; la porte demande qui est là ; répondre, puis
   *  répondre encore : la chute, c'est que quelqu'un réponde. → « am ».
   * --------------------------------------------------------------- */
  S({ id: 'W392', name: 'The Missing Punchline', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W387', backLook: 'door', backOpt: { style: 'wood', c: ['#f0d8a0'] }, backLabel: 'back to the sixth birthday', backAt: [1, 5],
    map: (function () { var g = K.grid(22, 11, ' '); g.box(0, 0, 22, 11, '#', '.'); g.rect(1, 4, 20, 3, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.house, { floor2: { p: 'carpet', c: ['#5a3a40', '#4a2a30'] } }),
    style: { renderer: 'silhouette', tallWalls: true }, music: 'punchline', amb: { type: 'clock', vol: 0.05 }, dark: 0.5,
    decor: [{ look: 'photo', n: 1, lines: ['A photo: a man pulling a face, and a little girl laughing so hard her eyes are shut.'] },
      { look: 'keyring', n: 1, lines: ['A hook by the door with no keys on it.'] },
      { look: 'shoe', n: 1, lines: ['One big slipper, a man’s. The other one left too.'] }],
    npcs: [{ id: 'N2033', name: 'Behind the Door', kind: 'voice', invisible: true, look: { t: 'voice' }, at: [19, 5], hearDist: 6,
      hears: [{ if: { temp: { w392_who: true } }, any: true,
          lines: ['Silence. Then, behind the door, a laugh.', 'A man’s laugh, too loud, the one that always came before the joke was even finished.',
            { t: 'That’s a good one. That’s a really good one.', lang: 'en' }, 'It is the punchline he never had: somebody answering.',
            'A strip of paper slides out under the door: a line torn from a diary. One word: “am”.'],
          do: PAGE('bss_am').concat([{ temp: { w392_who: false, w392_knock: false } }]) },
        { if: { temp: { w392_knock: true } }, any: true,
          lines: [{ t: function () { var r = (YN.save.dream && YN.save.dream.saidRaw) || [], w = String(r[r.length - 1] || '…').slice(0, 30); return { t: w + ' who?', lang: 'en' }; } }],
          do: [{ temp: { w392_who: true } }] },
        { if: { flag: 'bss_am' }, any: true, lines: ['Behind the door, someone is still chuckling, very quietly, to himself.'] },
        { any: true, lines: ['Nobody answers. You haven’t knocked yet. That is how the joke goes.'] }] }],
    mech: [{ type: 'knock', mark: 'frontdoor', n: 2, within: 2.5, firstLine: 'Knock.', done: { flag: 'bss_am' }, doneLine: 'The door is quiet now. It got its punchline.',
      reward: [{ temp: { w392_knock: true, w392_who: false } }], winLines: [{ t: 'Who’s there?', lang: 'en', who: 'Behind the Door' }] }],
    place: [{ id: 'frontdoor', type: 'decor', at: [20, 5], look: 'bigdoor', solid: true, lines: ['The front door, closed. Behind it, someone is waiting for a cue.'] },
      { id: 'suitcasemark', type: 'decor', at: [17, 8], look: 'scuff', solid: false, lines: ['A pale rectangle on the floor, the size of a suitcase. Something stood here a long time, then was taken away.'] },
      SOUL([EN('Knock knock. — Who’s there? — Daddy. — Daddy who? — …')]),
      SOUL([EN('He told the same joke every night for a week. On the last night, he didn’t finish it.')]),
      HINT('h_knock', [EN('A joke needs two people: one to knock, one to answer. Tonight you can be both.')])],
    info: { summary: 'The front hall on her sixth birthday, at night: a closed front door, a pale mark where a suitcase stood.',
      rules: ['Knock twice on the front door (interact twice quickly). A voice asks “Who’s there?”. Say anything; it asks “… who?”. Say anything again: the joke is finished, and a strip of paper gives the word “am”.'],
      lore: 'Daddy who’s coming back tomorrow. The joke without an ending, finished by the one who stayed.' } });

  /* ---------------------------------------------------------------
   *  W393 — La Marche de la chaussure gauche (au nord du jardin)
   *  Un dédale de pins sous la neige. Les traces d'une seule petite
   *  chaussure remontent vers le quai de 1951 ; les suivre sans s'en
   *  écarter. Au bout, l'empreinte que la neige a gardée : « still ».
   * --------------------------------------------------------------- */
  S({ id: 'W393', name: 'The Left Shoe’s Walk', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W389', backLook: 'gate', backOpt: { c: ['#a0a8b0'] }, backLabel: 'back south, to the garden', backAt: [19, 47],
    gen: { type: 'maze', w: 25, h: 49, opts: { wall: '^', floor: '.', loops: 0 },
      post: function (rows) {
        var g = rows.map(function (r) { return r.split(''); });
        var clr = function (x0, y0, x1, y1) { for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = '.'; };
        clr(1, 1, 9, 5); for (var x = 1; x <= 9; x++) g[4][x] = 'r';
        clr(15, 43, 23, 47);
        return g.map(function (r) { return r.join(''); });
      } },
    look: { floor: { p: 'snow', c: ['#eef4fa', '#dfe8f2'] }, wall: { p: 'stone', c: ['#a8b8c8', '#8898a8', '#687888'] }, rail: { p: 'rails', c: ['#3a342c', '#9a9aa0'] } },
    tall: { '^': { look: 'pine', opt: { c: ['#3a5a4a', '#2a4a3a', '#4a3a2a', '#e8f0f8'] } } },
    style: { renderer: 'sepia' }, music: 'leftshoe', amb: { type: 'wind', vol: 0.07 }, weather: { snow: true },
    decor: [{ look: 'suitcase', n: 2, solid: false, lines: ['A suitcase in the snow, open, empty, facing south.'] },
      { look: 'telepole', n: 2, lines: ['A telegraph pole. The wires go north and stop.'] }],
    npcs: [{ id: 'N2035', name: 'A Family Walking South', count: 2, look: H({ t: 'adult', body: 'coat', c: ['#5a5040', '#4a4030', '#e0c0a0', '#1a1a1a'], acc: 'suitcase' }), behavior: 'static', solid: false, passThrough: true,
        lines: [KN('신발 한 짝이 혼자 걸어가더라.', 'There was a single shoe walking along on its own.'), KN('따라가지 마라. 우리 갈 길도 멀다.', 'Don’t follow it. Our own road is long enough.')] },
      { id: 'N2036', name: 'A Man Carrying a Door', look: H({ t: 'old', body: 'coat', c: ['#4a4a40', '#3a3a30', '#e0c0a0', '#c8c8c8'] }), behavior: 'static', solid: false, passThrough: true,
        lines: ['He is carrying the front door of his house on his back.', KN('문만 있으면 집은 다시 지을 수 있습니다.', 'As long as you have the door, you can build the house again.')] },
      { id: 'N2037', name: 'A Voice on the Platform', kind: 'voice', invisible: true, look: { t: 'voice' }, at: [5, 3], hearDist: 14, ambientEvery: 12,
        ambientLines: [KN('오빠, 신발! 내 신발!', 'Big brother, my shoe! My shoe!'), KN('다음 렬차로 꼭 오마.', 'I will come on the next train, for certain.')] }],
    mech: [{ type: 'trail', from: 'firststep', to: 'print', slack: 1, flag: 'bss_still', lostLine: 'The footprints fill with snow behind you. Find them again.', reward: PAGE('bss_still'),
      winLines: ['The footprints end where they began: at the edge of a platform, in 1951.', 'Here a girl stood on one foot while a train left.',
        'The snow has kept the shape of her shoe ever since. Seventy years, and it is still here.',
        'In the hollow of the print, folded small: a strip of paper torn from a diary. One word: “still”.'] }],
    place: [{ id: 'firststep', type: 'decor', at: [21, 45], look: 'scuff', solid: false, lines: ['A small footprint in the snow. Only ever the left foot. It points north.'] },
      { id: 'print', type: 'decor', at: [3, 2], look: 'scuff', solid: false, lines: ['The print of a small left shoe, pressed into the snow at the edge of the platform. It has never melted.'] },
      { id: 'clock', type: 'decor', at: [8, 2], look: 'poleclock', lines: ['A platform clock in the snow. Its hands have fallen off. Under it, someone has written 1951 with a finger.'] },
      SOUL([EN('A child’s shoe walks slowly. Seventy years is about right.')]),
      HINT('h_prints', [EN('Follow the small prints. Only the left foot. Step off them and the snow forgets.')])],
    info: { summary: 'A snowy pine labyrinth in 1951, crossed by the footprints of a single small left shoe.',
      rules: ['From the south end, follow the footprints of the left shoe through the pines without stepping off them (one tile of slack).',
        'They lead north to the platform; at the print that never melted, a strip of paper gives the word “still”.'],
      lore: 'Ok-sun lost her left shoe on a platform in 1951. The snow kept the shape of it, still.' } });

  /* ---------------------------------------------------------------
   *  W394 — L'Archipel des mots du frigo
   *  Une mer d'émail blanc, des îles de papier : les mots de Mi-ran,
   *  de 2015 à aujourd'hui. Les lire dans l'ordre où ils ont été écrits
   *  fait surgir la note que personne n'a écrite.
   * --------------------------------------------------------------- */
  var NOTES = [['n15', ['A note held by a strawberry magnet, dated 2015:', KS('어린이집 가방 챙겼어. 엄마 사랑해.', 'I’ve packed your nursery bag. Mummy loves you.')]],
    ['n18', ['A note under a cat magnet, 2018:', KS('할머니 말 잘 들어. 엄마 아침에 와.', 'Be good for Grandma. Mum’s home in the morning.')]],
    ['n20', ['A note from 2020. The magnet is a little suitcase:', KS('아빠 얘기는 나중에 하자. 밥 먹어.', 'We’ll talk about Dad later. Eat your dinner.')]],
    ['n23', ['A note from November 2023, written in a hurry:', KS('괜찮아. 엄마가 있잖아.', 'It’s all right. You’ve got Mum.')]],
    ['n25', ['A note from 2025, held by tape instead of a magnet:', KS('선생님한테 전화 왔었어. 얘기 좀 하자. 내일. 미안.', 'Your teacher called. We need to talk. Tomorrow. Sorry.')]],
    ['n26', ['A note from this year:', KS('밥 먹어. 불 끄고 자.', 'Eat. Turn off the light and sleep.')]]];
  S({ id: 'W394', name: 'The Archipelago of Fridge Notes', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W384', backLook: 'fridge', backLabel: 'back to the staff-room fridge',
    gen: { type: 'cave', w: 50, h: 36, opts: { fill: 0.47, iter: 4, wall: '~' } },
    look: { floor: { p: 'paper', c: ['#f0e8c0', '#e8dcb0'] }, floor2: { p: 'paper', c: ['#f0c8d0'] }, water: { p: 'water', c: ['#f0f4f8', '#e0e8f0', '#ffffff', '#d0d8e0'] }, wall: { p: 'flat', c: ['#d8dce0', '#c8ccd0'] } },
    style: { renderer: 'crayon', sky: ['#e8eef4', '#ffffff'] }, music: 'fridgenotes', amb: { type: 'fridge', vol: 0.05 },
    doors: [{ to: 'W390', look: 'fridge', label: 'the fridge in the flat, opening from the inside' }],
    decor: [{ look: 'photo', n: 1, lines: ['A school photo held by a magnet. She is smiling the way you smile for photos.'] },
      { look: 'calendar', n: 1, lines: ['A calendar stuck to the fridge. Every night is circled. N, N, N, N, N.'] }],
    npcs: [{ id: 'N2038', name: 'A Strawberry Magnet', look: { t: 'blob', c: ['#e04050'], h: 8 }, behavior: 'wander', radius: 5, speed: 0.7, solid: false, passThrough: true,
        lines: ['A strawberry magnet, wandering. It has held up the same note since 2015. It would like a holiday.'] },
      { id: 'N2039', name: 'The Hum of the Fridge', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 17,
        ambientLines: [EN('The fridge hums one note all night. It is the only one in the flat that never stops.'), KS('…밥 먹어. 아니, 밥 꼭 먹어.', '…Eat. No, make sure you eat.'), 'A pen on a string taps against the door.'] },
      { id: 'N2040', name: 'A Pen on a String', look: { t: 'worm', c: ['#3050a0'], h: 6 }, behavior: 'wander', radius: 3, speed: 0.5, solid: false, passThrough: true,
        lines: ['A pen hanging from a string, swinging. It has written every note here. It is nearly out of ink.'] }],
    mech: [{ type: 'sequence', order: NOTES.map(function (n) { return n[0]; }), passThrough: true,
      wrongLine: 'A magnet slips. The notes shuffle back into the wrong order.',
      reward: [{ setNow: { bss_notes: true } }],
      winLines: ['Six notes, in the order they were written. The fridge hums a different note.', 'In the middle of the white sea, a new island surfaces: a note nobody has written yet.'] }],
    place: NOTES.map(function (n) { return { id: n[0], type: 'decor', at: 'random-any', look: 'letter', lines: n[1] }; }).concat([
      { id: 'lastnote', type: 'decor', at: 'random-any', look: 'letter', lookOpt: { c: ['#ffffff'] }, cond: { flag: 'bss_notes' }, light: 1.4,
        lines: ['A note you have never seen. The paper is new.', 'Only the first words are there, very light, as if she were still deciding:',
          KS('오늘 학교 어땠어?', 'How was school today?'), 'It is the question nobody asked. It has been on the fridge, unwritten, for three years.'],
        use: [{ secret: 'unasked_question' }, { note: 'n_bss_unasked' }] },
      SOUL([EN('A fridge door is a letterbox for people who are never home at the same time.')]),
      HINT('h_notes', [EN('Notes are read in the order they were written. It is the only order they know.')])]),
    info: { summary: 'A white enamel sea with islands of paper: every note her mother has left on the fridge since 2015.',
      rules: ['Six notes lie on the islands, each dated (2015, 2018, 2020, November 2023, 2025, this year). Read them in the order they were written.',
        'In order, a seventh note surfaces: the question nobody asked.'],
      secrets: ['The unwritten note: “How was school today?”'],
      lore: 'A family that talks through a fridge door.' } });

  /* ---------------------------------------------------------------
   *  W395 — La Millième Grue (au bout de la ficelle de grues, W383)
   *  999 grues pliées par Ok-sun ; sept se sont échappées. Les attraper
   *  sans courir : on plie la millième (E259). Cachée dans un recoin, la
   *  toute première grue, 1952 : « 오빠 ».
   * --------------------------------------------------------------- */
  var CRANES = [];
  for (var ci = 0; ci < 7; ci++) CRANES.push({ id: 'N' + (2041 + ci), name: 'A Loose Paper Crane', tag: 'w395crane', look: { t: 'bird', c: ['#f4f0e8'], h: 8 }, behavior: 'flee', fleeDist: 2, radius: 6, speed: 0.8, solid: false,
    lines: ['A paper crane that came loose from the string. It has a number in pencil on one wing: ' + [17, 203, 388, 512, 640, 871, 999][ci] + '.'] });
  S({ id: 'W395', name: 'The Thousandth Crane', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W383', backLook: 'crane', backLabel: 'back down the string of cranes',
    gen: { type: 'cave', w: 48, h: 36, opts: { fill: 0.42, iter: 4, wall: ' ' } },
    look: { floor: { p: 'cloud', c: ['#f4f0f8', '#e4e0f0', '#ffffff'] }, floor2: { p: 'cloud', c: ['#f0d8e0'] }, wall: { p: 'flat', c: ['#d8d0e8', '#c8c0d8'] } },
    style: { renderer: 'watercolor', sky: ['#f0c8d8', '#c8d8f8'], cliffH: 0.8, cliff: '#d8d0e8' }, music: 'thousandcranes', amb: { type: 'wind', vol: 0.04 },
    decor: [{ look: 'crane', n: 10, lines: ['A paper crane hanging from nothing. Number 214, in pencil, on its wing.', 'Crane number 998. The folds are a little shaky.',
        'Crane number 507, folded from a hospital appointment card.', 'Crane number 730, folded from a bus ticket, Seoul, 1987.', 'Crane number 912. Folded from a child’s drawing of a lamp.'] }],
    npcs: CRANES.concat([{ id: 'N2048', name: 'A Woman Folding in the Clouds', look: H({ t: 'old', hairStyle: 'bun', body: 'robe', c: ['#e8e0d8', '#c8c0b8', '#e0c0a0', '#d0d0d0'], alpha: 0.6 }), behavior: 'static', solid: true,
      lines: [{ seq: ['An old woman sits on a cloud with her back to you, folding.', 'Her hands move on their own. She does not turn round.'] }, KS('하나 더. 하나만 더.', 'One more. Just one more.'),
        { if: { effect: 'E259' }, seq: ['Her hands stop. For the first time, they rest in her lap.', KS('다 접었구나. 소원은 아껴 둬. 급할 때 써.', 'You finished it. Save the wish. Use it when it’s urgent.')] }] }]),
    mech: [{ type: 'catchN', tag: 'w395crane', n: 7, noRun: true, give: 'E259', countText: 'Cranes # / %', runLine: 'The crane startles and flaps off. Paper is afraid of running.',
      winLines: ['Seven loose cranes settle on your arms. Each is folded from a page of a letter.', 'Smoothed flat, the pages read:',
        KS('천 마리 접으면 소원 하나. 999마리 접었어. 마지막 하나는 네가 접어.', 'Fold a thousand and you get one wish. I’ve folded 999. You fold the last one.'),
        'You fold the thousandth crane. Your hands know how. Someone taught them, a long time ago.'] }],
    place: [{ id: 'firstcrane', type: 'decor', at: 'random-hidden', look: 'crane', lookOpt: { c: ['#d8c8a0'] },
        lines: ['Hidden in a fold of cloud: crane number 1. It is folded from a page of a school exercise book, 1952.', 'Under the wing, in a nine-year-old’s handwriting:',
          KN('오빠', 'big brother')], use: [{ secret: 'first_crane_1952' }, { note: 'n_bss_firstcrane' }] },
      SOUL([KN('오빠 오면 천 마리 다 보여 줄 거야.', 'When big brother comes, I’ll show him all thousand.')]),
      SOUL([EN('Nine hundred and ninety-nine wishes, and every one of them the same wish.')]),
      HINT('h_cranes', [EN('Paper is frightened of running. Walk up to it as if you were not trying.')])],
    info: { summary: 'A pink sky of clouds where 999 paper cranes hang from nothing, and an old woman folds with her back turned.',
      rules: ['Seven loose cranes flee from you. Touch all seven without running (running scares them off): you fold the thousandth crane (E259).'],
      secrets: ['Crane number 1, hidden in a nook of cloud: folded in 1952, with “오빠” under its wing.'],
      lore: 'Ok-sun started folding cranes for her brother’s return as a girl. She stopped at 999.' } });

  /* ---------------------------------------------------------------
   *  W396 — La Poche du tablier de Halmeoni (le tablier sur la clôture)
   *  Pousser les trois graines dans les trois creux du tissu : la photo
   *  pliée se déplie (« 말이 늦게 나와도 괜찮아 »).
   * --------------------------------------------------------------- */
  S({ id: 'W396', name: 'Halmeoni’s Apron Pocket', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W389', backLook: 'clothesline', backLabel: 'back out of the pocket, into the garden', backAt: [12, 16],
    map: (function () { var g = K.grid(26, 18, ' '); g.box(0, 0, 26, 18, '#', '.'); g.rect(1, 1, 24, 16, ','); return g.rows(); })(),
    look: { floor: { p: 'rug', c: ['#c8b8a0', '#b8a890', '#d8c8b0'] }, floor2: { p: 'rug', c: ['#d0c0a8', '#c0b098'] }, wall: { p: 'flat', c: ['#6a5a48', '#5a4a38'], topColor: '#6a5a48' } },
    style: { renderer: 'watercolor' }, music: 'apronpocket', amb: { type: 'hum', vol: 0.03 }, dark: 0.3,
    extra: { noFurnish: true },
    npcs: [{ id: 'N2049', name: 'A Moth That Lives in the Pocket', look: { t: 'moth', c: ['#d8c8a8'], h: 7 }, behavior: 'fly', radius: 4, speed: 0.7, solid: false,
        lines: ['A moth that has lived in this pocket for years. It has eaten only the corner of a bus ticket.'] },
      { id: 'N2050', name: 'Someone Humming Outside', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 16,
        ambientLines: [KS('자장자장 우리 아기…', 'Hush-a-bye, my little one…'), 'Outside the pocket, a hand pats a small back in time with the song.', KS('우리 강아지, 잘 자라.', 'Sleep well, my little puppy.')] }],
    mech: [{ type: 'push', blocks: ['seed1', 'seed2', 'seed3'], plates: ['hole1', 'hole2', 'hole3'], sfx: 'stamp',
      reward: [{ setNow: { bss_seeds: true } }],
      winLines: ['The three seeds settle into the hollows of the cloth. Nothing grows.', 'Pockets are not for growing. They are for keeping.',
        'Where the seams meet, something folded very small unfolds itself: a photograph.'] }],
    place: [{ id: 'seed1', type: 'decor', at: [6, 5], look: 'seedbag', solid: true, lines: ['A sunflower seed as big as a pillow.'] },
      { id: 'seed2', type: 'decor', at: [13, 12], look: 'seedbag', solid: true, lines: ['A seed as big as a pillow. It wants to be somewhere.'] },
      { id: 'seed3', type: 'decor', at: [19, 6], look: 'seedbag', solid: true, lines: ['A seed, warm from a hand that held it for a long time.'] },
      { id: 'hole1', type: 'decor', at: [6, 10], look: 'crack', solid: false, lines: ['A hollow in the cloth, seed-shaped.'] },
      { id: 'hole2', type: 'decor', at: [13, 6], look: 'crack', solid: false, lines: ['A seed-shaped hollow, worn by years of thumbs.'] },
      { id: 'hole3', type: 'decor', at: [19, 12], look: 'crack', solid: false, lines: ['A hollow in the cloth. Something used to sit here.'] },
      { id: 'mint', type: 'decor', at: [3, 14], look: 'rock', lookOpt: { c: ['#c8f0e0', '#a0d8c0', '#ffffff'] }, lines: ['A peppermint the size of a boulder, still in its wrapper. For emergencies.'] },
      { id: 'hanky', type: 'decor', at: [22, 3], look: 'towel', lookOpt: { c: ['#f0f0e8'] }, lines: ['A handkerchief, folded into a tent. It smells of soap.'] },
      { id: 'ticket', type: 'decor', at: [22, 14], look: 'letter', solid: false, lines: ['A bus ticket, Seoul, 1987, with one corner eaten by a moth.'] },
      { id: 'photo', type: 'decor', at: [10, 9], look: 'photo', solid: false, cond: { flag: 'bss_seeds' }, light: 1.2,
        lines: ['A photo of a four-year-old with a yellow star hairclip, mid-sentence, her mouth wide open.', 'On the back, in pencil:',
          KS('우리 소라. 말이 늦게 나와도 괜찮아. 할머니는 다 들려.', 'My Sora. It’s all right if your words come late. Grandma can hear all of them.')],
        use: [{ secret: 'halmeoni_photo' }, { note: 'n_bss_photo' }] },
      SOUL([KS('주머니에 사탕 있다. 울지 마.', 'There’s a sweet in my pocket. Don’t cry.')]),
      HINT('h_seeds', [EN('Seeds roll only forwards. If one sticks, go out of the pocket and come back in. Pockets forgive.')])],
    info: { summary: 'Inside the pocket of Halmeoni’s apron: soft cloth hills, a giant peppermint, a handkerchief tent, three seeds.',
      rules: ['Push the three giant seeds (walk into them) into the three seed-shaped hollows in the cloth. If one gets stuck, leave and come back: everything is put back.',
        'All three in place: a folded photograph appears, with a message on the back.'],
      secrets: ['The photo: “It’s all right if your words come late.”'],
      lore: 'Everything she kept for Sora, in one pocket.' } });

  /* ---------------------------------------------------------------
   *  W397 — Les Chrysanthèmes blancs (novembre 2023)
   *  Les funérailles d'Ok-sun : le jour où les mots se sont arrêtés.
   *  Chanter la berceuse au portrait (mélodie ou paroles) : « here ».
   *  Avec la millième grue : le vœu.
   * --------------------------------------------------------------- */
  var LULLABY = YN.data.lullaby || '3232120';
  var HERE_WIN = ['You sing the lullaby she used to sing to you. Your voice is very small, and it does not break.',
    'In the portrait, the old woman closes her eyes.', 'The way you close them when a song is nearly over and you want to hear the end.',
    { t: '여기 있어. 우리 소라, 할머니 여기 있어.', lang: 'ko-s', tr: 'I’m here. My Sora, Grandma’s here.', who: 'the portrait' },
    'A white petal falls at your feet. It is not a petal.', 'It is a strip of paper torn from a diary. One word: “here”.'];
  S({ id: 'W397', name: 'The White Chrysanthemums', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W382', backLook: 'door', backOpt: { style: 'wood', c: ['#f4f4f0'] }, backLabel: 'back to the room of jars', backAt: [26, 15],
    map: (function () {
      var g = K.grid(28, 18, ' '); g.box(0, 0, 28, 18, '#', '.'); g.rect(4, 5, 20, 8, ',');
      [6, 8, 10, 18, 20, 22].forEach(function (x) { g.set(x, 3, '{'); });
      return g.rows();
    })(),
    look: { floor: { p: 'ondol', c: ['#e8dcc0', '#d8ccb0'] }, floor2: { p: 'mat', c: ['#e0e0d8', '#c8c8c0'] },
      wall: { p: 'flat', c: ['#202020', '#181818'], topColor: '#202020' }, wallface: { p: 'panel', c: ['#f0f0ec', '#d8d8d4', '#b0b0a8'], skirt: '#404040' } },
    tall: { '{': { look: 'flowers', opt: { c: ['#f8f8f0', '#e8e8e0'] } } },
    style: { renderer: 'mono', tallWalls: true }, music: null, amb: { type: 'hum', vol: 0.03 }, dark: 0.2,
    doors: [{ to: 'W388', at: [1, 15], look: 'door', opt: { style: 'wood', c: ['#1a1a1a'] }, label: 'a door hung with black bars: the empty chapel' }],
    decor: [{ look: 'flowers', n: 6, opt: { c: ['#f8f8f0'] }, lines: ['White chrysanthemums, by the hundred. They smell of cold water.'] },
      { look: 'candle', n: 2, lines: ['Incense smoke rising straight up, then bending, as if someone had breathed out.'] }],
    npcs: [{ id: 'N2051', name: 'A Woman in White Mourning Clothes', look: H({ t: 'adult', hairStyle: 'bun', body: 'robe', c: ['#f4f2ea', '#dcd8cc', '#e0c0a0', '#1a1010'], eyes: 'closed' }), behavior: 'static', solid: true, at: [12, 6],
        lines: [KS('엄마, 미안해.', 'Mum, I’m sorry.'),
          { seq: ['She turns to the girl in black beside her and smooths her hair, too fast, too often.', KS('괜찮아, 소라야. 괜찮아.', 'It’s all right, Sora. It’s all right.')] },
          KS('일 끝나고 바로 왔어. 그래도 늦었어.', 'I came straight from work. I was still too late.'),
          { if: { flag: 'bss_here' }, t: '…방금 노래한 거, 너야?', lang: 'ko-s', tr: '…Was that you singing, just now?' }] },
      { id: 'N2052', name: 'A Guest Who Bows', count: 3, look: H({ t: 'adult', body: 'coat', c: ['#1a1a1e', '#101014', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true,
        lines: [KS('저 아이가 손녀야? 한마디도 안 하네.', 'Is that the granddaughter? She hasn’t said a word.'), KS('괜찮아질 거야. 애들은 금방 괜찮아져.', 'She’ll be all right. Children get over things quickly.'),
          'He bows twice before the portrait, very deeply, and checks his phone on the way out.'] },
      { id: 'N2053', name: 'The Girl Aged Nine, in Black', look: H({ t: 'kid', hairStyle: 'short', body: 'dress', c: ['#1a1a20', '#101014', '#f6d8c0', '#1e1a26'], h: 16, eyes: 'line', mouth: 'line' }), behavior: 'static', solid: true, at: [16, 6],
        lines: ['She is nine. She opens her mouth to say something. Someone says “괜찮아” first. She closes it again.',
          'She is humming, under her breath, a tune of seven notes. She stops whenever anyone looks at her.',
          { if: { flag: 'bss_here' }, t: 'She looks at you. She is still not speaking. But she is no longer closing her mouth either.' }] }],
    mech: [{ type: 'melodyLock', mark: 'portrait', tune: LULLABY, dist: 5, flag: 'bss_here', reward: PAGE('bss_here'), winLines: HERE_WIN }],
    place: [{ id: 'portrait', type: 'decor', at: [14, 1], look: 'portrait', lookOpt: { person: true }, light: 1.2,
        lines: ['A portrait with a black ribbon across one corner: an old woman, smiling the way she smiled at blackbirds.'],
        listen: [{ if: { notFlag: 'bss_here' }, match: ['자장자장', 'jajang', 'jajangjajang', 'lullaby', '자장가', 'hush a bye', 'hushabye'], lines: HERE_WIN, do: PAGE('bss_here') }] },
      { id: 'altar', type: 'decor', at: [14, 3], look: 'table', lookOpt: { cloth: '#f0f0ea' }, lines: ['The offering table: fruit, rice cakes, soju, and a bowl of rice for someone who will not come to eat.'],
        use: [{ if: { equipped: 'E259' }, lines: [{ t: 'You set the thousandth crane down among the white chrysanthemums. A thousand cranes, and one wish.' },
          { t: 'You do not say the wish. You only stand there while it is made.' }, { t: 'Somewhere, in a garden, an old woman puts down her watering can, satisfied.' }],
          secret: 'thousandth_crane_wish', note: 'n_bss_crane' }] },
      { id: 'foodtable', type: 'decor', at: [5, 14], look: 'table', lines: ['A long table of food nobody eats. Someone has wrapped a rice cake in a napkin for a child who isn’t hungry.'] },
      { id: 'shoes', type: 'decor', at: [24, 15], look: 'shoe', lines: ['Rows of shoes by the entrance. Among the black ones, a pair of white nurse’s clogs.'] },
      SOUL([EN('The day the words stopped. Not because they were gone: everyone was busy saying “it’s all right”.')]),
      HINT('h_lullaby', [KS('할머니는 자장가 부르다가 꼭 먼저 잠들었어.', 'Grandma always fell asleep before the lullaby was over.')])],
    info: { summary: 'A funeral hall in November 2023, full of white chrysanthemums: the day she stopped speaking.',
      rules: ['Near the portrait, sing the lullaby (with the Melody: the tune from the Garden pond), or say its words (“자장자장”): the portrait answers and gives the word “here”.',
        'With the Thousandth Crane equipped, interact with the offering table: the wish.'],
      secrets: ['The thousandth crane on the offering table.'],
      lore: 'Ok-sun’s funeral. Mi-ran’s grief (“엄마, 미안해”). Everyone said 괜찮아, so the child said nothing.' } });

  /* ---------------------------------------------------------------
   *  W398 — Sept heures, le seuil
   *  La minute où elles se croisent chaque matin. Rester immobile sur le
   *  seuil, dans les sabots de la mère (E257) : 07:00, elle s'arrête.
   *  → « Mum ». Derrière les manteaux, un mur qui n'en est pas un.
   * --------------------------------------------------------------- */
  S({ id: 'W398', name: 'Seven O’Clock, the Doorway', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W384', backLook: 'door', backOpt: { style: 'metal', c: ['#e0e0d8'], symbol: '7' }, backLabel: 'the staff door, back to the night corridor', backAt: [20, 10],
    map: (function () {
      var g = K.grid(22, 14, ' ');
      g.box(0, 2, 22, 12, '#', '.');
      g.rect(1, 0, 4, 3, '#'); g.set(2, 1, '.'); g.set(3, 1, '.'); g.set(2, 2, '?');
      g.vline(10, 3, 12, '#'); g.set(10, 7, '.'); g.set(10, 8, '.');
      g.rect(1, 3, 9, 10, ',');
      return g.rows();
    })(),
    look: Object.assign({}, K.LOOK.house, { floor: { p: 'tile', c: ['#a8a8a0', '#888880'] }, floor2: { p: 'wood', c: ['#9a7a58', '#8a6848'] } }),
    style: { renderer: 'sepia', tallWalls: true }, music: 'sevenoclock', amb: { type: 'clock', vol: 0.05 }, dark: 0.2,
    doors: [{ to: 'W390', at: [1, 8], look: 'ladder', label: 'up, to see the flat from above' }],
    npcs: [{ id: 'N2054', name: 'A Woman with Keys', look: H({ t: 'adult', hairStyle: 'bun', body: 'coat', c: ['#4a5a6a', '#3a4a5a', '#e8c8b0', '#1a1010'], eyes: 'line' }), behavior: 'static', solid: true, at: [13, 7],
        lines: [KS('다녀왔어. …벌써 가?', 'I’m home. …Off already?'), KS('밥 먹었어? 응. 잘 다녀와.', 'Have you eaten? Good. Have a nice day.'),
          { if: { notEquipped: 'E257' }, seq: ['She glances down at your feet.', KS('신발이 작네. 이 문턱은 큰 신발로 넘어야 돼.', 'Small shoes. This doorstep takes bigger ones.')] },
          { if: { flag: 'bss_mum' }, t: '…오늘은 엄마 옆에 있어.', lang: 'ko-s', tr: '…Stay by me today.' }] },
      { id: 'N2055', name: 'The Stairwell Light', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 30, ambientEvery: 15,
        ambientLines: [EN('The stairwell light clicks off on its timer. Somebody presses it again.'), 'Down the stairwell, the lift stops at the twelfth floor and opens on nobody.',
          KS('1204호. 다녀왔습니다.', 'Flat 1204. I’m home.')] }],
    mech: [{ type: 'standStill', mark: 'doorway', secs: 12, cond: { equipped: 'E257' }, breakLine: 'The clock slips back to 06:59.', flag: 'bss_mum', reward: PAGE('bss_mum'),
      winLines: ['You stand in the doorway in her clogs. 06:59:59. You do not move. You do not step aside to let her pass.', 'The clock gives up and says 07:00.',
        'She is right in front of you, keys in hand, coat half off.', 'For once she has nowhere to go, and neither have you.',
        { t: '…소라야. 오늘은 학교 조금 늦게 가도 돼. 이리 와.', lang: 'ko-s', tr: '…Sora. You can be a little late for school today. Come here.', who: 'A Woman with Keys' },
        'Something falls out of her coat pocket: a strip of paper torn from a diary.', 'One word, in your handwriting: “Mum”.'] }],
    place: [{ id: 'doorway', type: 'decor', at: [10, 7], look: 'scuff', solid: false, lines: ['The doorstep. Worn in two places: where she comes in, where you go out.'] },
      { id: 'clock', type: 'decor', at: [5, 3], look: 'wallclock', lines: ['06:59:59. The second hand is pressing against the twelve with all its strength.'] },
      { id: 'coats', type: 'decor', at: [3, 3], look: 'clothesline', lines: ['Coat hooks: a school blazer, and the hook that is always empty at night.'] },
      { id: 'schoolshoes', type: 'decor', at: [3, 11], look: 'shoe', lines: ['Her school shoes, laced, ready. They have been ready at 06:59 for three years.'] },
      { id: 'number', type: 'decor', at: [11, 3], look: 'plaque', lines: ['The door number: 1204.'] },
      { id: 'lift', type: 'decor', at: [20, 5], look: 'elevator', lines: ['The lift. It goes down to the street where the school bus stops, and comes back up with nurses.'] },
      { id: 'slippers', type: 'decor', at: [3, 1], look: 'shoe', lookOpt: { c: ['#6a5040'] },
        lines: ['Behind the coats, in the shoe cupboard: a pair of men’s slippers, size 44, never thrown away.', 'Between them, a joke book with a bookmark on the last page.'],
        use: [{ secret: 'dads_slippers' }, { note: 'n_bss_slippers' }] },
      SOUL([EN('Every morning at seven they pass each other in this doorway, like two trains on one track.')]),
      HINT('h_doorway', [EN('To meet her in the doorway you have to stand where she stands, in what she walks in.')]),
      HINT('h_cupboard', [EN('The wall behind the coats is only a coat of paint.')])],
    info: { summary: 'The front door of flat 1204 at 06:59:59: the minute when the mother comes home and the daughter leaves for school.',
      rules: ['Equip the Night-Shift Clogs (from the Corridor of Night Shifts) and stand still on the doorstep for twelve seconds: the clock reaches 07:00, she stops, and the word “Mum” falls from her pocket.'],
      secrets: ['Behind the coat hooks, a false wall (walk through it with a revealing effect): the shoe cupboard with Dad’s slippers.'],
      lore: 'They cross every morning. Once, in a dream, nobody stepped aside.' } });

  /* ---------------------------------------------------------------
   *  W399 — Le Toit de la première garde (2008)
   *  La photo du couloir : Mi-ran, 28 ans, sa première nuit, qui rit.
   *  Refaire sa danse anti-sommeil : la photo est prise.
   * --------------------------------------------------------------- */
  S({ id: 'W399', name: 'The Roof of the First Night Shift', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5, outdoor: true,
    back: 'W384', backLook: 'door', backOpt: { style: 'metal', c: ['#c8d8d8'] }, backLabel: 'the staff stairwell, back down', backAt: [5, 6],
    map: (function () { var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, 'f', '.'); g.rect(2, 2, 6, 4, '#'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#8a8a88', '#7a7a78'] }, wall: { p: 'concrete', c: ['#6a6a6c', '#5a5a5c', '#4a4a4c'] }, fence: { p: 'metal', c: ['#9aa0a8'] } },
    style: { renderer: 'watercolor', sky: ['#1a2040', '#e0a070'], stars: true }, music: 'firstnightroof', amb: { type: 'city', vol: 0.04 },
    decor: [{ look: 'watertower', n: 1, lines: ['The water tower. Somebody has drawn a smiley face on it in marker, very high up.'] },
      { look: 'vent', n: 4, lines: ['An air vent breathing out the hospital’s warm breath.'] },
      { look: 'bench', n: 1, lines: ['A bench made of two crates and a board. Two coffees on it, still hot.'] }],
    npcs: [{ id: 'N2056', name: 'Mi-ran, Aged Twenty-Eight', look: H({ t: 'adult', hairStyle: 'long', body: 'uniform', c: ['#d8e4ec', '#b8c4cc', '#f0d0b0', '#1a1010'], eyes: 'dots', mouth: 'smile' }),
        behavior: 'static', face: false, solid: true, at: [17, 11],
        lines: [KS('첫 나이트야! 하나도 안 피곤해.', 'My first night shift! I’m not tired at all.'),
          { seq: ['She does a silly little dance to stay awake: left, right, left, right, up on her toes, down.', KS('따라 해 봐! 졸음 쫓는 춤이야.', 'Copy me! It’s the stay-awake dance.')] },
          KS('나중에 아이 생기면, 밤에는 꼭 옆에 있어 줄 거야.', 'When I have a child one day, I’ll be there at night. For sure.'),
          KS('엄마한테 전화해야지. 서울은 지금 낮이야.', 'I should call my mum. It’s daytime in Seoul.')] },
      { id: 'N2057', name: 'The Colleague with a Camera', look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#c8d8c8', '#a8b8a8', '#d8b8a0', '#3a2a1a'] }), behavior: 'static', solid: true, at: [21, 12],
        lines: [EN('First night? And you’re laughing. Nobody laughs at four in the morning. Hold still, let me get a picture.'), EN('Dance again, I missed it!'),
          EN('Ten years from now you’ll be the tired one, and I’ll show you this.')] }],
    mech: [{ type: 'dirSequence', ent: 'N2056', seq: ['left', 'right', 'left', 'right', 'up', 'down'], dist: 6,
      reward: [{ setNow: { bss_roof: true } }, { secret: 'first_night_shift_photo' }, { note: 'n_bss_roof' }],
      winLines: ['You copy her steps: left, right, left, right, up on your toes, down again.', 'It is the silliest dance in the world.',
        'She laughs so hard she has to hold on to the railing. The colleague’s camera flashes.', { t: 'Got it! That one’s going on your wall.', lang: 'en', who: 'The Colleague with a Camera' },
        'Years later, in a corridor that never ends, this photo will hang on a wall.', 'On the back: “1st night shift. 2008.”'] }],
    place: [{ id: 'hut', type: 'decor', at: [5, 3], look: 'hut', lines: ['The stairwell hut. A sign on the door: “Staff only. Do not prop open.” It is propped open.'] },
      { id: 'scratch', type: 'decor', at: 'random-hidden', look: 'chalkmark', solid: false,
        lines: ['Scratched into the parapet, very small:', KS('M. 2008 — 여기서 다시 시작.', 'M. 2008 — starting again, from here.')], use: [{ secret: 'm_2008_scratch' }] },
      SOUL([EN('At four in the morning, the nurses up here breathe the only air in the building nobody else has breathed.')]),
      SOUL([KS('서울은 지금 낮이야. 엄마는 밭에 있겠지.', 'It’s daytime in Seoul. Mum will be out in the garden.')])],
    info: { summary: 'A hospital roof in 2008, before dawn: Mi-ran, twenty-eight, on her first night shift, laughing.',
      rules: ['Mi-ran dances to stay awake. Stand near her and copy her steps in order: left, right, left, right, up, down. The colleague takes the photo.'],
      secrets: ['A scratch in a corner of the parapet: “M. 2008 — starting again, from here.”'],
      lore: 'The photo in the corridor of the Mother’s Voice: “1st night shift. 2008.” She was not tired yet.' } });

  /* ---------------------------------------------------------------
   *  W400 — La Dernière page (sous le lit du milieu ; sous l'oreiller du
   *  Dernier Lit). Les cinq mots retrouvés se posent sur la page, dans le
   *  désordre ; il faut dire la dernière ligne à voix haute.
   * --------------------------------------------------------------- */
  var STRIPS = [['bss_still', [10, 6], 'A strip of paper: “still”.'], ['bss_mum', [30, 9], 'A strip of paper: “Mum”. The M is written twice over, to make it darker.'],
    ['bss_here', [16, 14], 'A strip of paper: “here”.'], ['bss_i', [26, 18], 'A strip of paper: “I”. Just one stroke. It took three years.'],
    ['bss_am', [12, 21], 'A strip of paper: “am”.']];
  var SENTENCE = ['mum i am still here', 'mum i m still here', 'mum im still here', 'mummy i am still here', 'mummy i m still here', 'mom i am still here', 'mom i m still here',
    'mommy i am still here', 'mama i am still here', 'eomma i am still here', 'mother i am still here', 'i am still here mum', 'i m still here mum', 'im still here mum',
    'i am still here mom', '엄마 나 아직 여기 있어', '엄마 나 아직 여기있어', '엄마 아직 여기 있어', '엄마 나는 아직 여기 있어', '엄마 나 여기 아직 있어', '나 아직 여기 있어 엄마'];
  S({ id: 'W400', name: 'The Last Page', depth: 5, tier: 'extreme', region: 'P5', secretLevel: 5,
    back: 'W381', backLook: 'book', backOpt: { c: ['#e8e0c8'] }, backLabel: 'back under the middle bed', backAt: [37, 27],
    map: (function () { var g = K.grid(40, 30, ' '); g.box(0, 0, 40, 30, '#', '.'); g.vline(5, 1, 28, ':'); return g.rows(); })(),
    look: { floor: { p: 'lines', c: ['#f4ecd8', '#a8b8d8'] }, floor3: { p: 'flat', c: ['#e08080', '#d07070'] }, wall: { p: 'flat', c: ['#d8ccb0', '#c8bca0'] } },
    style: { renderer: 'charcoal' }, music: 'lastpage', amb: { type: 'pages', vol: 0.04 },
    variants: { said: { cond: { flag: 'bss_sentence' }, music: 'lastpagesaid' } },
    doors: [{ to: 'W193', at: [2, 27], look: 'bed', opt: { c: ['#ffffff', '#c8b8ff'] }, label: 'back up to the last bed' }],
    decor: [{ look: 'doodle', n: 3, lines: ['A doodle in the margin: a lamp, switched off, smiling.', 'A doodle: a blackbird sitting on a watering can.', 'A doodle: a door, with a line of light under it.'] }],
    npcs: [{ id: 'N2058', name: 'The Margin', kind: 'voice', invisible: true, look: { t: 'voice' }, hearDist: 40, ambientEvery: 20,
        ambientLines: [EN('Somebody is reading this page from above. You can feel their breath on the paper.'), EN('The ruled lines hum, very low, like a held note.')] },
      { id: 'N2059', name: 'A Full Stop That Wanders', look: { t: 'blob', c: ['#101018'], h: 6 }, behavior: 'wander', radius: 6, speed: 0.7, solid: false, passThrough: true,
        lines: ['A full stop, wandering the page, looking for the end of a sentence to sit at.',
          { if: { flag: 'bss_sentence' }, t: 'The full stop has found its place at the very end of the last line. It sits very still, very proud.' }] }],
    mech: [{ type: 'sayTo', mark: 'lastline', dist: 5, cond: { flag: PAGES }, notNow: 'The page waits. Some of its words are still missing.',
      words: SENTENCE, wrong: 'The ink trembles, but stays where it is. Five words, all of them, in the order you would say them.', give: 'E260',
      doneLine: 'The last line has been said. The page is light now, like a page that has been read.',
      reward: [{ secret: 'bss_last_page' }, { note: 'n_bss_last_page' }, { setNow: { bss_sentence: true, heard_mother: true } }],
      winLines: ['You say it out loud. All five words.', 'Your voice is lower than you remembered. It does not shake.',
        'The words lift off the page one by one and do not come back down.', 'Far above every layer of sleep, on the twelfth floor, a key stops halfway in a lock.',
        { t: '…소라야? 방금… 너야?', lang: 'ko-s', tr: '…Sora? Just now… was that you?', who: 'very far above' },
        'Your voice is yours again. It was kept for you, salted, in the dark, all this time.'] }],
    place: STRIPS.map(function (s) { var c = {}; c.flag = s[0]; return { id: 'w_' + s[0], type: 'decor', at: s[1], look: 'letter', cond: c, light: 0.8, lines: [s[2]] }; })
      .concat(STRIPS.map(function (s) { return { id: 'gap_' + s[0], type: 'decor', at: s[1], look: 'crack', solid: false, cond: { notFlag: s[0] }, lines: ['A hole torn in the page, the size of one word.'] }; }))
      .concat([{ id: 'lastline', type: 'decor', at: [20, 26], look: 'inkwell', light: 1.2,
          lines: ['The last line of the last page. Nothing is written on it. The ink is ready.',
            { if: { flag: PAGES }, t: 'All five words are on the page now. The last line is not for writing. It is for saying.' }] },
        SOUL([EN('Every dream diary ends with a blank line. Most people leave it blank.')]),
        HINT('h_order', [EN('Start with who you are talking to. Then who you are. Then when. Then where.')])]),
    info: { summary: 'The last page of the dream diary: a huge ruled sheet, five torn holes the size of a word, and a blank last line.',
      rules: ['The five words of the last line are found in five worlds: “Mum” (Seven O’Clock, the Doorway), “I” (the Room Where Her Voice Is Kept), “am” (the Missing Punchline), “still” (the Left Shoe’s Walk), “here” (the White Chrysanthemums).',
        'Once all five are on the page, say the whole line out loud beside the inkwell: “Mum, I am still here.” (or in Korean, “엄마, 나 아직 여기 있어”). You get Her Own Voice (E260).'],
      secrets: ['The sentence itself.'],
      lore: 'The first thing she will say, when she says something again.' } });
  link('W193', { to: 'W400', look: 'book', lookOpt: { c: ['#e8e0c8'] }, label: 'a diary under the pillow', cond: { flag: PAGES },
    locked: 'Under the pillow, a diary. Its last page is stuck. Five words are missing from it.' });

  YN._effIndex = null;
})(typeof window !== 'undefined' ? window : globalThis);
