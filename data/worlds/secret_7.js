/* =========================================================================
 *  MONDES SECRETS (7/8) — W161 à W180 : les rêves profonds (P4)
 *  Plus on descend, plus c'est étrange : vitraux, chair, yeux, voix,
 *  couleurs sans nom ; les rêves des autres (la mère, l'enfant de 2044) ;
 *  le domaine des sorcières.
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
  var GLASS = { floor: { p: 'mosaic', c: ['#c83040', '#3060c0', '#e0b030', '#40a060', '#8040b0'] }, wall: { p: 'flat', c: ['#1a1020', '#100818'] }, floor2: { p: 'marble', c: ['#2a2030', '#6a5a7a'] } };

  /* W161 — La Cathédrale de vitraux */
  S({ id: 'W161', name: 'The Stained-Glass Cathedral', depth: 4, tier: 'hard', back: 'W162',
    map: (function () { var g = K.grid(30, 44, ' '); g.box(0, 0, 30, 44, '#', ','); g.rect(12, 1, 6, 42, '.'); for (var y = 6; y < 40; y += 5) { g.set(6, y, '^'); g.set(23, y, '^'); } return g.rows(); })(),
    look: GLASS, tall: { '^': { look: 'pillar', opt: { c: ['#8a7a9a'] } } }, style: { renderer: 'pattern', tallWalls: true }, music: 'cathedral', amb: { type: 'choir', vol: 0.05 }, dark: 0.4,
    doors: [{ to: 'W164', look: 'door', opt: { style: 'wood', c: ['#4a2a5a'] }, label: 'the north portal' }, { to: 'W165', look: 'door', opt: { style: 'wood', c: ['#5a2a3a'] }, label: 'the crypt' }],
    decor: [{ look: 'window', n: 8, lines: ['A stained-glass window: a grandmother watering, in a green halo.', 'A stained-glass window: a woman in a work tunic asleep on her feet, with a neon halo.', 'A stained-glass window: a man walking away with a suitcase, seen from behind, in blue.', 'A stained-glass window: a child holding her mouth shut with both hands.', 'A stained-glass window: a woman veiled in newspapers, one closed eye struck through. The glass is cracked.'] }],
    npcs: [{ name: 'The Glass Sacristan', look: H({ t: 'tall', head: 'hood', body: 'robe', c: ['#6a4a8a', '#4a2a6a', '#c8b8e0', '#000000'] }), behavior: 'patrol', path: [[14, 40], [14, 3]], speed: 0.5, lines: [EN('Here, every sorrow is a stained-glass window. The light goes through. That is all one can do with it.')] }, { name: 'A Nightlight', count: 6, look: { t: 'jelly', c: ['#f8e0a0'], h: 8, glow: '#f8e0a0' }, light: 1.5, behavior: 'fly', radius: 4, speed: 0.3, solid: false, lines: ['A little floating flame. It keeps you company.'] }],
    place: [SOUL([EN('The cracked window is the newest one. Nobody dares to repair it.')]),
      SOUL([EN('I prayed for the light to stay on. It stayed on. I still could not sleep.')]),
      SOUL([EN('Green for the one who watered. Blue for the one who left. There is no colour yet for the one who stays.')])],
    info: { summary: 'A cathedral whose stained-glass windows show the family; the floor is made of their light.', lore: 'Bringing to light what hurts.' } });

  /* W162 — La Mer de lait */
  S({ id: 'W162', name: 'The Sea of Milk', depth: 4, tier: 'hard', back: 'W130', backLook: 'boat',
    gen: { type: 'islands', w: 60, h: 44, opts: { level: 0.55, sea: '~', shore: 'w', land: '.' } }, look: { floor: { p: 'sand', c: ['#f0e8d8', '#e0d8c8'] }, water: { p: 'water', c: ['#f0ece4', '#e0dcd4', '#f8f4ec', '#ffffff'] }, shallow: { p: 'water', c: ['#f4f0e8', '#e8e4dc', '#fcf8f0', '#ffffff'] } },
    style: { renderer: 'watercolor', sky: ['#f8f4ec', '#ffffff'] }, music: 'milksea', amb: { type: 'sea', vol: 0.05 }, freeze: false,
    doors: [{ to: 'W161', look: 'pillar', label: 'a cathedral spire rising out of the milk' }, { to: 'W163', look: 'house', opt: { c: ['#e8c8c8', '#a06070'] }, label: 'a pink house on an island' }],
    npcs: [{ name: 'The Ferryman', look: H({ t: 'old', head: 'hood', body: 'robe', c: ['#d8d0c0', '#b8b0a0', '#d8c0a8', '#000000'] }), behavior: 'static', solid: true, lines: [EN('You cross the milk in a boat. Or swimming, if you have learned to swim like a fish.'), EN('The milk of the night. The one you drink warm to fall asleep, when someone heats it.')] }],
    place: [SOUL([KS('우유 데워 줄까?', 'Shall I warm some milk for you?')]),
      SOUL([EN('Since 2023, the milk is drunk cold, straight from the carton, standing up.')]),
      SOUL([EN('Islands are only the places where the milk forgot to be.')])],
    info: { summary: 'A sea of white milk dotted with pale islands.', rules: ['You must swim (Fish) or find the fords.'], lore: 'The glass of warm milk before bed, that nobody makes any more.' } });

  /* W163 — La Maison-corps */
  S({ id: 'W163', name: 'The Body-House', depth: 4, tier: 'hard', back: 'W162',
    gen: { type: 'rooms', w: 40, h: 32, opts: { depth: 3 } }, look: K.LOOK.flesh, style: { renderer: 'psychedelic' }, music: 'bodyhouse', amb: { type: 'heartbeat', vol: 0.1 }, dark: 0.45,
    doors: [{ to: 'W166', look: 'hole', label: 'a passage that breathes' }],
    decor: [{ look: 'heart', n: 1, animated: true, lines: ['The heart of the house, in the living room. It beats faster when you speak.'] }, { look: 'mouth', n: 3, lines: ['A mouth in the wall. It opens slightly.', KS('밥 먹었어?', 'Have you eaten?'), 'A toothless mouth singing 자장자장.'] }, { look: 'bigeye', n: 3, animated: true, lines: ['An eye in the ceiling. It keeps watch.'] }],
    npcs: [{ name: 'The House Itself', kind: 'voice', invisible: true, look: { t: 'voice' }, ambientLines: ['The walls contract gently, like breathing.', KS('가지 마. 안은 따뜻해. 밖은 추워.', 'Don’t go. It’s warm inside. It’s cold outside.'), KS('너를 품었어. 지금도 품고 있어.', 'I carried you. I am carrying you still.')], ambientEvery: 16, hearDist: 40 }],
    place: [SOUL([EN('Before the flat, before France, there was this house. Nine months. The best address she ever had.')]),
      SOUL([EN('The heart beats faster when you speak. It has waited a long time to hear you.')]),
      SOUL([KS('아가, 엄마 목소리 들려?', 'Baby, can you hear Mum’s voice?')])],
    info: { summary: 'A living house made of warm flesh; its rooms are organs, its walls breathe.', lore: 'The mother’s body as the first house.' } });

  /* W164 — La Forêt d'yeux */
  S({ id: 'W164', name: 'The Forest of Eyes', depth: 4, tier: 'hard', back: 'W161', outdoor: true,
    gen: { type: 'forest', w: 50, h: 40, opts: { density: 0.24, border: true } }, look: Object.assign({}, K.LOOK.forest, { floor: { p: 'moss', c: ['#3a2a4a', '#2a1a3a', '#4a3a5a', '#1a0a2a'] } }),
    tall: { '^': { look: 'tree', vary: [{ opt: { c: ['#4a2a6a', '#3a1a5a', '#2a1a20', '#6a4a8a'], face: true } }, { look: 'bigeye' }] } }, style: { renderer: 'psychedelic' }, music: 'eyeforest', amb: { type: 'whispers', vol: 0.05 }, dark: 0.5,
    doors: [{ to: 'W167', look: 'gate', label: 'a clearing of colours' }],
    npcs: [{ name: 'A Watching Tree', count: 5, look: H({ t: 'tall', head: 'eye', body: 'stick', c: ['#3a2a4a', '#3a2a4a', '#f0f0f0', '#6040a0'] }), behavior: 'statue', solid: true, lines: ['It only moves when you turn your back. It only wants to see if you are all right.'] }],
    place: [SOUL([EN('At school they stare at the back of your neck. At home, nobody looks at all.')]),
      SOUL([EN('An eye that never closes is not watching over you. It is only afraid to miss something.')]),
      SOUL([EN('Turn around slowly. They only want to know if you are all right.')])],
    info: { summary: 'A purple forest where the trees have eyes and only move behind your back.', lore: 'Feeling watched everywhere, except when you would need to be.' } });

  /* W165 — Le Chœur des voix */
  S({ id: 'W165', name: 'The Choir of Voices', depth: 4, tier: 'hard', back: 'W161',
    map: (function () { var g = K.grid(30, 24, ' '); g.ellipse(14.5, 12, 13, 11, '.'); g.ellipse(14.5, 12, 4, 3, ','); return g.rows(); })(), look: GLASS, style: { renderer: 'painting', cliffH: 0.5 }, music: 'voicechoir', amb: { type: 'choir', vol: 0.1 },
    doors: [{ to: 'W168', look: 'door', opt: { style: 'wood', c: ['#6a4a2a'] }, label: 'a museum' }],
    decor: [{ look: 'mouth', n: 8, lines: ['A mouth in the floor, singing a single note, endlessly.'], listen: [{ any: true, lines: ['All the mouths repeat what you just said, in chorus, very softly, so that you hear it clearly.'] }] }],
    npcs: [{ name: 'The Choirmistress', look: H({ t: 'tall', head: 'mask', body: 'robe', c: ['#e8e4dc', '#c8c4bc', '#f0ece4', '#000000'], acc: 'baton' }), behavior: 'static', solid: true, lines: [EN('Sing. Anything. Here, everything that is said is taken up by all. Nobody speaks alone.')] }],
    place: [SOUL([EN('In class they called her the mute one. Here, she would be the loudest.')]),
      SOUL([EN('Every voice in this choir belonged to someone nobody listened to.')]),
      SOUL([KS('크게 말해도 돼. 아무도 혼내지 않아.', 'You can speak up. Nobody will tell you off.')])],
    info: { summary: 'A round room of coloured light where mouths in the floor take up whatever is said, in chorus.', lore: 'Being heard, at last, by many.' } });

  /* W166 — La Spirale */
  var SPIRAL_END = [20, 20];
  var SPIRAL = (function () {
    var n = 41, g = K.grid(n, n, '#'), x = 1, y = 1, d = 0, D = [[1, 0], [0, 1], [-1, 0], [0, -1]], L = n - 3, lens = [L, L, L];
    for (var k = L - 2; k > 0; k -= 2) lens.push(k, k);
    g.set(x, y, '.');
    lens.forEach(function (len) { for (var i = 0; i < len; i++) { x += D[d][0]; y += D[d][1]; g.set(x, y, '.'); } d = (d + 1) % 4; });
    SPIRAL_END = [x, y];
    return g.rows();
  })();
  S({ id: 'W166', name: 'The Spiral', depth: 4, tier: 'hard', back: 'W163', map: SPIRAL,
    look: { floor: { p: 'hex', c: ['#e8c040', '#a07020'] }, wall: { p: 'flat', c: ['#2a1a3a', '#1a0a2a'] } }, style: { renderer: 'psychedelic' }, music: 'spiral', amb: { type: 'whispers', vol: 0.04 },
    backAt: [1, 1], doors: [{ to: 'W171', at: SPIRAL_END, look: 'hole', label: 'the centre' }],
    place: [{ type: 'inscription', look: 'glyph', glyphs: 'the more you turn the closer you are', lines: ['She turns on the spot before she speaks.', EN('Closer. Closer. You have been close for years.')], at: [3, 1], solid: false },
      SOUL([EN('In the middle is the thing nobody says. You are walking around it, like everyone.')]),
      SOUL([EN('Mother calls it tiredness. Grandmother called it nothing. The doctor had a longer word.')]),
      SOUL([EN('Every turn is shorter than the last. That is how you know.')])],
    info: { summary: 'A single corridor coiling in towards a centre.', lore: 'Circling the thing nobody talks about.' } });

  /* W167 — Le Jardin des couleurs sans nom */
  S({ id: 'W167', name: 'The Garden of Nameless Colours', depth: 4, tier: 'hard', back: 'W164', outdoor: true,
    gen: { type: 'forest', w: 46, h: 36, opts: { density: 0.1, grass: '*' } }, look: { floor: { p: 'meadow', c: ['#c040a0', '#a03080', '#e060c0', '#802060'] }, flowers: { p: 'flowers', c: ['#40c0a0', '#f0e040', '#40a0f0', '#ffffff'] } },
    tall: { '^': { look: 'mushroom', opt: { c: ['#40e0c0'] } } }, style: { renderer: 'psychedelic' }, music: 'namelesscolors', weather: { petals: true },
    doors: [{ to: 'W174', look: 'door', opt: { style: 'glass', c: ['#ff80ff'] }, label: 'a kaleidoscope' }],
    npcs: [{ name: 'A Flower That Changes Colour', count: 6, look: H({ head: 'flower', body: 'stick', legs: false, arms: false, c: ['#40c040', '#40c040', '#f0f040', '#ff40ff'], h: 16 }), behavior: 'static', solid: true, lines: ['It is a colour that has no name. When you try to name it, it changes.', EN('Before words, there was this.')] }],
    place: [SOUL([EN('She asked me the name of this colour. I said: ask your grandmother. Grandmother said: ask the flower.')]),
      SOUL([EN('Some things are lighter without a name.')]),
      SOUL([KS('이건 무슨 색이야?', 'What colour is this?')])],
    info: { summary: 'A garden of impossible colours that change as soon as you try to name them.', lore: 'What you see before you have the words.' } });

  /* W168 — Le Musée des mères */
  S({ id: 'W168', name: 'The Museum of Mothers', depth: 4, tier: 'hard', back: 'W165', map: K.hall(40, 20, '#', '.'),
    look: { floor: { p: 'marble', c: ['#e8e0d8', '#a89888'] }, wall: { p: 'flat', c: ['#2a2420', '#1a1410'], topColor: '#2a2420' }, wallface: { p: 'panel', c: ['#e8e0d0', '#c8c0b0', '#8a8478'], skirt: '#5a4a3a' } },
    style: { tallWalls: true, renderer: 'engraving' }, music: 'mothersmuseum',
    doors: [{ to: 'W172', look: 'door', opt: { style: 'wood', symbol: '2044' }, label: 'a bedroom from 2044' }],
    decor: [{ look: 'statue', n: 8, lines: ['The silhouette of a woman in a hospital tunic. Plaque: “She gets home at 7 a.m.”', 'The silhouette of a woman in a suit. Plaque: “She answers emails during dinner.”', 'The silhouette of a woman in a mourning hanbok. Plaque: “She did not cry in front of the little one.”', 'The silhouette of a woman holding a phone. Plaque: “She calls at 9 p.m., every evening, even when she can’t.”', 'The silhouette of a woman leaning over a bed. Plaque: “She turns off the light.”'] }],
    npcs: [{ name: 'The Museum Guide', look: H({ t: 'adult', hairStyle: 'bun', body: 'uniform', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#3a2a1a'] }), behavior: 'patrol', path: [[3, 10], [36, 10]], speed: 0.6, lines: [EN('None of them is perfect. All of them are here. The museum does not judge. It exhibits.'), EN('The children’s wing is on the other side. Children do judge. That is normal.')] }],
    place: [SOUL([KS('미안해. 다음 주에는 꼭 쉬는 날 받을게.', 'Sorry. Next week I’ll get a day off, I promise.')]),
      SOUL([EN('Exhibit without a plaque: a woman asleep in her car, in the hospital car park, before driving home.')]),
      SOUL([EN('Her father came home after midnight. Her mother once waited on a platform. It goes back a long way, this museum.')]),
      SOUL([EN('Not forgiven. Understood. It is not the same room.')])],
    info: { summary: 'A marble museum where silhouettes of mothers are on display, each with its own plaque.', lore: 'Understanding the mother without excusing or condemning her.' } });

  /* W169 — Le Pays des fruits */
  S({ id: 'W169', name: 'The Land of Fruit', depth: 3, tier: 'hard', back: 'W015', backLook: 'arcade', backArrive: 'secretcab', outdoor: true,
    gen: { type: 'empty', w: 48, h: 36, opts: { floor: '.', border: '#', decor: 'o', decorRate: 0.03 } }, look: { floor: { p: 'grass', c: ['#8ad060', '#7ac050', '#9ae070', '#6ab040'] }, wall: { p: 'hedge', c: ['#4a9a3a', '#3a8a2a', '#5aaa4a', '#2a7a1a'] } },
    tall: { 'o': { look: 'fruit', vary: [{ opt: { f: 'cherry' } }, { opt: { f: 'grape' } }, { opt: { f: 'apple' } }, { opt: { f: 'peach' } }, { opt: { f: 'melon' } }] } }, style: { renderer: 'crayon' }, music: 'fruitland',
    doors: [{ to: 'W170', look: 'fruit', opt: { f: 'watermelon', big: true }, label: 'the watermelon' }],
    npcs: [{ name: 'A Merging Cherry', count: 4, look: H({ head: 'round', body: 'none', legs: false, arms: false, c: ['#d02040', '#d02040', '#e03050', '#40a040'], h: 12 }), behavior: 'wander', radius: 5, speed: 1.6, lines: [EN('Two cherries make a strawberry. Two strawberries make a grape. Two watermelons make… we don’t know. Nobody knows.')] }],
    place: [SOUL([EN('She played alone every evening. High score: nobody to show it to.')]),
      SOUL([EN('The game never ends. You can only lose, or stop.')]),
      SOUL([EN('Merge two sad things and you get a bigger sad thing. Fruit does not work like that. Nights do.')])],
    info: { summary: 'The land of fruit from the arcade cabinet: a meadow strewn with giant fruit.', rules: ['Reached through the black cabinet in the Arcade, after getting the watermelon in the bedroom game.'], lore: 'The game she plays alone in the evenings.' } });

  /* W170 — La Pastèque */
  S({ id: 'W170', name: 'The Watermelon', depth: 4, tier: 'hard', back: 'W169', backLook: 'fruit', backOpt: { f: 'watermelon' },
    map: (function () { var g = K.grid(30, 24, ' '); g.ellipse(14.5, 12, 13, 10, '.'); for (var i = 0; i < 30; i++) { var r = YN.rng.make(1700 + i); g.set(r.int(4, 25), r.int(4, 20), 'o'); } return g.rows(); })(),
    look: { floor: { p: 'flesh', c: ['#e04050', '#f05060', '#c03040'] }, rock: { p: 'rock', c: ['#1a1010', '#0a0505', '#3a2020'] } }, tall: { o: { look: 'rock', opt: { c: ['#1a1010'] } } }, style: { cliffH: 0.6, cliff: '#2a7a2a' }, music: 'watermelon',
    doors: [{ to: 'W176', look: 'tv', label: 'a television screen among the seeds' }],
    signs: [{ glyphs: 'the next fruit only exists in character mode', lines: ['She is shaped like a seed, bigger than the others.', EN('Look at me with letters instead of eyes.')] }],
    place: [{ type: 'decor', at: [14, 12], look: 'fruit', lookOpt: { f: 'question' }, lines: ['A “?” fruit, blurred, as if badly drawn. It only exists in a certain way of looking.'] },
      SOUL([EN('Seeds are only watermelons that have not been told yet.')]),
      SOUL([EN('Summer 2019. A whole watermelon, three spoons, a balcony. Then two spoons.')]),
      SOUL([EN('There is a screen among the seeds. Screens grow everywhere now.')])],
    info: { summary: 'The red inside of a giant watermelon, studded with seeds.', secrets: ['The “?” fruit only exists in character mode.'], lore: 'What comes after the biggest fruit.' } });

  /* W171 — Le Sommeil de Mi-ran */
  S({ id: 'W171', name: 'Mi-ran’s Sleep', depth: 4, tier: 'hard', back: 'W166',
    gen: { type: 'rooms', w: 46, h: 34, opts: { depth: 4 } }, look: { floor: { p: 'tile', c: ['#c8d8d8', '#98a8a8'] }, floor2: { p: 'wood', c: ['#8a6848', '#6a4a30', '#9a7a58'] }, wall: { p: 'brick', c: ['#6a6a7a', '#4a4a5a', '#3a3a4a'] } },
    style: { renderer: 'watercolor' }, music: 'miransleep', amb: { type: 'beep', vol: 0.04 }, dark: 0.6,
    doors: [{ to: 'W173', look: 'train', opt: { c: ['#3a3a4a', '#e0c040'] }, label: 'a night train' }, { to: 'W113', look: 'door', opt: { style: 'wood', c: ['#e8d8a0'] }, label: 'a lit kitchen' }],
    decor: [{ look: 'bed', n: 3, opt: { c: ['#f0f0f0', '#a0c0d0'] }, lines: ['A hospital bed. On it, a chart: “Kim M. — nursing assistant — 9 p.m. / 7 a.m.”.'] }, { look: 'phone', n: 2, lines: [KS('부재중 전화 3통: 소라.', '3 missed calls: Sora.'), 'A phone lying on a tray. The screen shows a photo of a child’s bedroom, with the light on.'] }, { look: 'window', n: 2, lines: ['Through the window: a Seoul street, in 1989. A little girl is waiting under a streetlamp.'] }],
    npcs: [{ name: 'The Glow of a Flashlight', kind: 'voice', invisible: true, look: { t: 'voice' }, ambientLines: ['A flashlight passes along the corridor; someone is doing the rounds.', KS('괜찮아. 괜찮아. 다 괜찮아.', 'It’s fine. It’s fine. Everything is fine.'), 'Someone sits down, very tired, and does not get up again straight away.'], ambientEvery: 14, hearDist: 50,
      hears: [{ match: ['mummy', '엄마', 'eomma', 'mom', 'mommy', 'mama', 'mum', 'mother'], lines: ['The flashlight stops. It trembles a little. Then it lights up the floor in front of you, as if to show you where to walk.'], do: [{ note: 'n_mother_dream' }, { setNow: { heard_mother_dream: true } }] }] }],
    place: [SOUL([KS('302호 할머니, 오늘 밤은 조용하시네. 다행이다.', 'The old lady in 302 is quiet tonight. Thank goodness.')]),
      SOUL([EN('Nine to seven. She walks eleven kilometres of corridor a night and calls it nothing.')]),
      SOUL([KS('소라는 지금 자고 있겠지. 불 켜 놓고.', 'Sora must be asleep by now. With the light on.')]),
      SOUL([KS('엄마, 나 잘하고 있는 거 맞지?', 'Mum, I’m doing all right, aren’t I?')]),
      SOUL([EN('She dreams in two cities. In both, she is on duty.')])],
    info: { summary: 'The mother’s dream: night-time hospital corridors, a Seoul street in 1989 and the flat, all mixed together.', rules: ['The mother is never seen there: only the light of her flashlight.'], lore: 'Mi-ran dreams too, and in her dream she does her rounds.' } });

  /* W172 — La Chambre de 2044 */
  S({ id: 'W172', name: 'The Bedroom of 2044', depth: 4, tier: 'hard', back: 'W168',
    map: (function () { var g = K.grid(18, 13, ' '); g.box(0, 0, 18, 13, '#', '.'); g.rect(6, 5, 6, 4, ','); return g.rows(); })(),
    look: Object.assign({}, K.LOOK.sk, { floor: { p: 'wood', c: ['#c8b8a0', '#a89880', '#d8c8b0'] }, floor2: { p: 'rug', c: ['#a0c0e0', '#b0d0f0'] } }), style: { tallWalls: true }, music: 'room2044',
    doors: [{ to: 'W178', look: 'door', opt: { style: 'glass' }, label: 'the bedroom door' }],
    decor: [{ look: 'bed', opt: { c: ['#f0f0f8', '#80a0e0'] }, lines: ['A child is asleep with the light on. On the tablet beside the bed, a blinking message: “Mum’s home late, sweetheart. Go to sleep.”'] }, { look: 'hologram', animated: true, lines: ['A hologram bear tells a story, on a loop, in the recorded voice of the child’s mother.', KS('…그래서 아기 곰은 불을 켜 놓고 잤대요. 엄마 곰은 아주 늦게 왔대요…', '…and so the baby bear slept with the light on. Mummy bear came home very late…'), EN('Story time is over. Your mother will be home in: four hours, twelve minutes.')] }, { look: 'window', lines: ['Through the window, a glass city in 2044. Every window is lit. They are offices.'] }, { look: 'drawing', n: 1, lines: ['A drawing on the wall: “my mum” — a woman with a phone instead of a head.'] }],
    npcs: [],
    place: [SOUL([EN('Promises made at twelve expire at thirty.')]),
      SOUL([KS('엄마, 오늘은 몇 시에 와?', 'Mum, what time are you coming home today?')]),
      SOUL([EN('Same light. Same bed. Another child.')]),
      SOUL([EN('It can be broken. Things that repeat can be broken.')])],
    info: { summary: 'A child’s bedroom in 2044: a child sleeps with the light on, their mother comes home late.', lore: 'What Sora could become, and what her child could live through. The cycle — which the dreams show so that it can be broken.' } });

  /* W173 — La Gare sans nord */
  S({ id: 'W173', name: 'The Station with No North', depth: 4, tier: 'hard', back: 'W171',
    map: (function () { var g = K.grid(56, 14, ' '); g.box(0, 0, 56, 14, '#', '.'); g.rect(1, 8, 54, 4, 'r'); g.hline(1, 54, 7, ','); return g.rows(); })(), look: K.LOOK.station, style: { tallWalls: true, renderer: 'sepia' }, music: 'nonorth', weather: { ash: true },
    doors: [{ to: 'W177', look: 'train', opt: { c: ['#4a4a4a', '#c8c8c8'] }, label: 'a train heading south' }],
    decor: [{ look: 'board', opt: { lines: ['SOUTH south SOUTH', 'SOUTH south SOUTH', 'NORTH  —'], color: '#e0c040' }, lines: ['Every train goes south. A “NORTH” line has been on the board since 1951, with no times.'] }],
    npcs: [{ name: 'An Old Man from the Train South', look: H({ t: 'old', body: 'coat', c: ['#3a3a48', '#2a2a34', '#e8c8a8', '#202030'], eyes: 'closed', acc: 'suitcase' }), behavior: 'static', solid: true,
      lines: [KN('나는 남쪽으로 가는 렬차에 올랐습니다. 다른 길이 없었습니다. 그래도 늘 북쪽을 바라봅니다.', 'I got on the train going south. There was no other way. Still, I always look towards the north.'),
        KN('승강장에서 녀자아이 하나가 신발 한 짝 때문에 울고 있었습니다. 오빠가 다음 렬차로 돌아오겠다고 약속했지요. 그가 오르는 것을 내가 보았습니다. 다음 렬차는 없었습니다.', 'On the platform, a little girl was crying over one shoe. Her big brother promised to come back on the next train. I saw him get on. There was no next train.'),
        { if: { item: { shoe: 1 } }, seq: ['He sees the shoe in your hand.', KN('왼쪽이군요. 그 아이 것입니다. 오빠는 안씨였습니다. 아마 지금도 기다리고 있을 겁니다. 이제는 없는 역에서.', 'The left one. It is hers. The brother was an Ahn. He is probably still waiting, at a station that no longer exists.'), KN('그 아이가 다 컸다고 전해 주십시오. 한평생 정원에 물을 주었다고 전해 주십시오.', 'Please tell him the little girl grew up. Tell him she watered a garden all her life.'), 'Very slowly, he mimes a little girl growing up, then a watering can being tipped. Then he points north.'], do: [{ quest: { Q01: 'witness' } }, { note: 'n_okSun_grew' }] }] }],
    place: [SOUL([KN('어머니, 먼저 갑니다. 다음 렬차에서 만납시다.', 'Mother, I am going on ahead. We will meet on the next train.')]),
      SOUL([KN('신발 한 짝쯤은 일없다. 발은 두 개 다 있지 않니.', 'One shoe is nothing. You still have both your feet, don’t you?')]),
      SOUL([EN('Every train here leaves for the south. None of them ever arrives anywhere.')]),
      SOUL([KN('명단에 그 이름이 있었습니다. 다들 그렇게 말합니다.', 'His name was on the list. That is what everyone says.')]),
      SOUL([KN('짐은 하나만. 사진은 두고 가거라.', 'One bag only. Leave the photographs.')])],
    info: { summary: 'A station where every train leaves for the south; the northern line is on the board with no times.', lore: 'Those who left for the south in 1951, and those who never arrived.' } });

  /* W174 — Le Kaléidoscope */
  S({ id: 'W174', name: 'The Kaleidoscope', depth: 4, tier: 'hard', back: 'W167',
    gen: { type: 'cave', w: 40, h: 30, shifting: true, opts: { fill: 0.42, iter: 3 } }, look: { floor: { p: 'mosaic', c: ['#ff40a0', '#40c0ff', '#f0f040', '#40f080', '#a040ff'] }, wall: { p: 'flat', c: ['#1a0a2a', '#100520'] } },
    extra: { styles: [{ renderer: 'psychedelic' }, { renderer: 'pattern' }, { renderer: 'psychedelic', filter: 'hue-rotate(120deg)' }, { renderer: 'psychedelic', filter: 'hue-rotate(240deg)' }] },
    mech: [{ type: 'shifting', every: 20 }], music: 'kaleidoscope', amb: { type: 'glass', vol: 0.05 },
    doors: [{ to: 'W179', look: 'hole', label: 'a shard that does not move' }],
    place: [SOUL([EN('The same pieces. Every twenty seconds, another story.')]),
      SOUL([EN('Turn it enough times and the father comes back. Turn it once more and he leaves again.')]),
      SOUL([EN('One shard does not move. It is the only true one.')])],
    info: { summary: 'The inside of a kaleidoscope that rearranges itself every 20 seconds.', rules: ['Fast-changing dream.'], lore: 'The pieces of one same thing, turned over and over.' } });

  /* W175 — Les Escaliers de chair */
  S({ id: 'W175', name: 'The Stairs of Flesh', depth: 4, tier: 'hard', back: 'W160', backLook: 'stairs', backLabel: 'climb back up towards the well',
    map: (function () { var g = K.grid(22, 50, ' '); for (var y = 0; y < 50; y++) { var x = 6 + Math.round(Math.sin(y * 0.25) * 4); g.rect(x, y, 7, 1, 's'); } return g.rows(); })(), look: { stairs: { p: 'flesh', c: ['#a04050', '#b85060', '#702030'] } },
    style: { renderer: 'psychedelic', cliffH: 0.6, cliff: '#300810' }, music: 'fleshstairs', amb: { type: 'heartbeat', vol: 0.08 }, dark: 0.5, backAt: [9, 0],
    doors: [{ to: 'W176', at: [9, 49], look: 'tv', label: 'at the bottom, a screen' }],
    place: [SOUL([EN('Going down into yourself takes longer than going down a well.')]),
      SOUL([EN('The steps are warm. Someone is breathing under each one.')]),
      SOUL([EN('Do not hurry. Here, the heart sets the pace.')])],
    info: { summary: 'A winding, living staircase going down.', lore: 'Going down into yourself.' } });

  /* W176 — La Mer de télévisions */
  S({ id: 'W176', name: 'The Sea of Televisions', depth: 4, tier: 'hard', back: 'W170', backLook: 'fruit', backOpt: { f: 'watermelon' }, outdoor: true,
    gen: { type: 'empty', w: 50, h: 40, opts: { floor: '.', decor: 'o', decorRate: 0.25 } }, look: { floor: { p: 'grid', c: ['#0a0a10', '#3a3a50'] } }, tall: { o: { look: 'tv', opt: {} } },
    style: { renderer: 'psychedelic', stars: true }, music: 'tvsea', amb: { type: 'tv', vol: 0.12 }, dark: 0.55,
    doors: [{ to: 'NEXUS', look: 'tv', label: 'a screen showing the Nexus' }],
    decor: [{ look: 'tv', n: 6, animated: true, lines: ['A screen shows your bedroom, with the light on. You are asleep in it.', 'A screen shows a lit kitchen. A woman is asleep at the table.', 'A screen shows a platform in 1951.', { t: '…it’s fine, everything is fine, stay tuned…', lang: 'en' }, 'A screen shows a garden where an old woman is watering, then turns towards the camera.'] }],
    place: [SOUL([EN('In his flat the television was never turned off. It was the only one who talked to him.')]),
      SOUL([EN('A screen for the nights, a screen for the mornings, a screen for when Mum calls from work.')]),
      SOUL([KN('세상에 부럼 없어라. 모두 화면 앞에 앉으십시오.', 'We have nothing to envy in the world. Everyone, please sit in front of the screen.')])],
    info: { summary: 'A black expanse covered with switched-on televisions, as far as the eye can see.', rules: ['One screen leads back to the Nexus.'], lore: 'The screens that took the place of people.' } });

  /* W177 — Le Ciel en dessous */
  S({ id: 'W177', name: 'The Sky Below', depth: 4, tier: 'hard', back: 'W173', outdoor: true,
    gen: { type: 'islands', w: 56, h: 40, opts: { level: 0.5, sea: ' ', shore: '.', land: '.' } }, look: { floor: { p: 'grass', c: ['#6a9a5a', '#5a8a4a', '#7aaa6a', '#4a7a3a'] } },
    style: { stars: true, sky: ['#0a1030', '#304080'], cliffH: 1, cliff: '#3a2a1a' }, music: 'skybelow', amb: { type: 'wind', vol: 0.06 },
    extra: { gen: { type: 'cave', w: 56, h: 40, opts: { fill: 0.5, iter: 4, wall: ' ', floor: '.' } } },
    decor: [{ look: 'cloudpuff', n: 4, lines: ['A cloud, under your feet, between two islands. Further down, you can see stars.'] }],
    npcs: [{ name: 'The Child Who Falls Upward', look: H({ t: 'kid', body: 'sweater', c: ['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], alpha: 0.6 }), behavior: 'wander', radius: 6, solid: false, talkable: true, lines: [EN('If you fall here, you fall into the sky. It doesn’t matter. It’s just far.')] }],
    place: [SOUL([EN('Upside down, the stars are only lights in other people’s windows.')]),
      SOUL([EN('There is a terrace past the clouds. Things grow there that almost did not.')]),
      SOUL([EN('Vertigo is only the body remembering that it can fall.')])],
    info: { summary: 'Islands of grass hanging above a starry sky.', lore: 'The vertigo of things turned upside down.' } });

  /* W178 — La Salle des sourires */
  S({ id: 'W178', name: 'The Room of Smiles', depth: 4, tier: 'hard', back: 'W172', map: K.hall(28, 18, '#', '.'),
    look: { floor: { p: 'checker', c: ['#f0e0e0', '#d0a0a0'] }, wall: { p: 'flat', c: ['#3a1a1a', '#2a0a0a'], topColor: '#3a1a1a' }, wallface: { p: 'wallpaper', c: ['#f8d8d8', '#e0b0b0', '#c08080'], skirt: '#ffffff' } },
    style: { tallWalls: true }, music: 'smiles',
    decor: [{ look: 'frame', n: 8, lines: ['A smiling mask hung like a painting. Behind it, a face that is not smiling.', 'A mask: “for photos”.', 'A mask: “for the teacher”.', 'A mask: “for Mum, when she comes home tired”.', 'A mask, a very small one: “for yourself, in the morning”.'] }],
    npcs: [{ name: 'The Smile Seller', look: H({ t: 'adult', head: 'mask', body: 'dress', c: ['#e8a0a0', '#c08080', '#f8f0f0', '#3a1a1a'] }), behavior: 'static', solid: true, lines: [EN('A smile, darling? They last a whole day. Afterwards, it pulls a little.'), EN('Ri Myong-hui has worn one for so long that it is painted on. If someone gives her permission, she could take it off. Or keep it. She will choose.')] }],
    place: [SOUL([KN('웃으십시오. 모두가 행복합니다.', 'Smile. Everyone is happy.')]),
      SOUL([KS('괜찮아요, 괜찮아요. 웃으면 돼요.', 'It’s fine, it’s fine. You just have to smile.')]),
      SOUL([EN('The smallest mask is the heaviest. You put it on before anyone is awake.')])],
    info: { summary: 'A shop where smiling masks are sold.', lore: 'Polite smiles, which protect you and wear you out.' } });

  /* W179 — Le Champ de cloches */
  S({ id: 'W179', name: 'The Field of Bells', depth: 4, tier: 'hard', back: 'W174', outdoor: true,
    gen: { type: 'empty', w: 50, h: 38, opts: { floor: ';', border: '#', decor: 'o', decorRate: 0.06 } }, look: { leafb: { p: 'leaves', c: ['#5a4a3a', '#9a6a34', '#b8843e'] }, wall: { p: 'hedge', c: ['#3a3020', '#2a2010', '#4a4030', '#1a1000'] } },
    tall: { o: { look: 'bell' } }, style: { renderer: 'charcoal', sky: ['#3a3040', '#6a6070'] }, music: 'bellfield', amb: { type: 'bells', vol: 0.05 },
    doors: [{ to: 'W180', look: 'door', opt: { style: 'red', c: ['#3a0a10'] }, label: 'a house with no doorbell' }],
    decor: [{ look: 'doorbell', n: 4, lines: ['A doorbell planted in the ground. Someone has written underneath: “don’t open”.'] }],
    npcs: [{ name: 'The Child Who Doesn’t Open', look: H({ t: 'kid', body: 'sweater', c: ['#6a8aa0', '#4a6a80', '#f0c8a0', '#1a1a1a'], eyes: 'wide', acc: 'keys' }), behavior: 'static', solid: true, lines: [EN('When it rings, you must not open. Even if it’s someone you know. Especially then.'), EN('Here, every step rings a bell. Walk softly. She is listening.')] }],
    place: [SOUL([EN('Once, it rang on a Sunday. She never found out who it was. She still listens for it.')]),
      SOUL([EN('Mother has her keys. Grandmother had her keys. Everyone else is a stranger.')]),
      SOUL([KS('누가 와도 문 열지 마. 알았지?', 'Whoever comes, don’t open the door. Got it?')])],
    info: { summary: 'A field of brown leaves bristling with bells that ring at the slightest sound.', lore: 'The Doorbell’s rule: if someone rings, don’t open.' } });

  /* W180 — Le Dortoir des sorcières */
  S({ id: 'W180', name: 'The Witches’ Dormitory', depth: 4, tier: 'hard', back: 'W179', secretLevel: 5,
    map: (function () { var g = K.grid(34, 16, ' '); g.box(0, 0, 34, 16, '#', '.'); return g.rows(); })(),
    look: { floor: { p: 'wood', c: ['#2a1a1a', '#1a0a0a', '#3a2a2a'] }, wall: { p: 'flat', c: ['#100508', '#080304'], topColor: '#100508' }, wallface: { p: 'wallpaper', c: ['#3a2a3a', '#2a1a2a', '#1a0a1a'], skirt: '#000000' } },
    style: { tallWalls: true }, music: 'witchdorm', dark: 0.8,
    doors: [{ to: 'W146', look: 'door', opt: { style: 'red', c: ['#3a0a0a'] }, label: 'the room next door' }, { to: 'W151', look: 'hole', label: 'back to the maze' }],
    place: [['the Silent One', 'hush, Mum is sleeping', 'silent'], ['the Seamstress', 'sew it up, nobody must see', 'seam'], ['the Copycat', 'do what the others do', 'copy'], ['the Doorbell', 'if someone rings, don’t open', 'bell'], ['the Traveller', 'he will come back', 'voyager']].map(function (w, i) {
      return { id: 'wbed' + i, type: 'decor', at: [4 + i * 6, 6], look: 'bed', lookOpt: { c: ['#1a1a1a', '#3a1a2a'] }, lines: ['A black bed. On the pillow, embroidered by hand: “' + w[1] + '”. The bed of ' + w[0] + '.'], use: [{ note: 'n_rule_' + w[2] }, { secret: 'rule_' + w[2] }] };
    }).concat([SOUL([EN('They sleep inside their rules. When you break one, a bed stays empty for a night.')]),
      SOUL([EN('The Traveller’s bed is never made. She is always about to leave.')]),
      SOUL([EN('Hush. They hunt better when you are tired.')])]),
    signs: [{ at: [17, 12], glyphs: 'they protected you before they hunted you', lines: [EN('They kept you safe. Then they kept you.')] }],
    info: { summary: 'Five black beds in a row; on each pillow, a house rule embroidered by hand.', secrets: ['The witches are the rules learnt too early: hush, Mum is sleeping; sew it up; do what the others do; don’t open; he will come back.'], lore: 'Where the witches sleep when they are not hunting.' } });
})(typeof window !== 'undefined' ? window : globalThis);
