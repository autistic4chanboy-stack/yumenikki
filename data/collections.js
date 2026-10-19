/* =========================================================================
 *  COLLECTIONS — de petites choses éparpillées dans les rêves.
 *  Chaque nuit, une partie de ce qui manque encore est semée dans des
 *  mondes tirés au sort : de préférence dans les cachettes (faux murs,
 *  chemins noirs), sinon dans un recoin. Ce qui est ramassé est gardé.
 *  Le bocal et l'étagère de la chambre de rêve montrent où l'on en est.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var COINS = [];
  var VAL = [10, 10, 50, 100, 100, 100, 500, 10, 50, 100];
  var MARK = ['', 'Someone scratched a tiny heart on it.', 'It is warm, as if it had been held for a long time.', 'Bent, as if it had been stepped on at a bus stop.',
    'There is a thread tied around it.', 'It smells of a coat pocket.', 'Rubbed so smooth the year is almost gone.', 'It was painted gold, badly, by a child.',
    'Someone wrote a phone number on it in pen. The last digit is missing.', 'It is stuck to a sweet wrapper.'];
  for (var i = 0; i < 40; i++) {
    var v = VAL[i % VAL.length], y = 1966 + ((i * 7) % 43);
    COINS.push({ name: v + ' won, ' + y, text: v + ' won, ' + y + '.' + (MARK[i % MARK.length] ? ' ' + MARK[i % MARK.length] : '') });
  }
  var PAGES = [
    'March. She said her first word today. It was not “mum”. It was “door”.',
    'The night shift again. I left the hall light on. She says the light is the only one who stays.',
    'The teacher called. She hasn’t spoken in class since the winter. I said she is shy. I said it twice, as if that helped.',
    'Bought her the music box from the market. Five notes. She plays them over and over, very quietly, under the blanket.',
    'Someone wrote a word on her desk. She won’t tell me which word. She scrubbed it until her fingers were red.',
    'I fell asleep in my uniform on the kitchen chair. When I woke up there was a blanket on me. Child-sized. It didn’t reach my feet.',
    'She draws doors. Only doors. Forty of them on one page. Some are open.',
    'My mother called from the countryside. She asked for her granddaughter. I said she was asleep. She was standing right there.',
    'Payday. I bought a cake and forgot it on the bus. She said it didn’t matter. She said it with her hands.',
    'She sleeps more and more. She says the dreams are bigger than the flat.',
    'I switched off her light tonight and stood in the doorway a long time. I think she was awake. I think she was somewhere else.',
    'If you find this: she likes pears, not apples. She hates the dark but she will never say so. Please leave the light on.'
  ];
  var PHOTOS = [
    'A photograph of a balcony full of plants. Every pot has a name written on it in marker.',
    'A school photograph. One face in the back row has been gently coloured in with pencil, as if to make it stay.',
    'A woman asleep on a bus, still in her work uniform. Whoever took the photo was very small.',
    'A beach in winter. Two sets of footprints, one large, one tiny, going towards the water. Only the large ones come back… no — the tiny ones are on her shoulders.',
    'A birthday table with one candle, photographed from very close. The flame is a blur.',
    'A grandmother in a field of radishes, laughing at something outside the picture.',
    'An empty playground at night. On the swing, a shape too pale to be anyone.',
    'The front door of the flat, from the inside. Someone stuck a drawing of a key on it at child height.'
  ];
  var CRANES = [];
  var CW = ['red', 'blue', 'yellow', 'green', 'white', 'silver', 'pink', 'black', 'orange', 'purple'];
  for (var c = 0; c < 20; c++) CRANES.push({ name: 'a ' + CW[c % 10] + ' paper crane', text: 'A ' + CW[c % 10] + ' paper crane. ' + (c % 3 === 0 ? 'Someone wrote a wish inside the wing, then crossed it out.' : c % 3 === 1 ? 'It is folded from a school timetable.' : 'Its beak is a little crooked. It was folded in the dark.') });

  YN.data.collections = [
    { id: 'coins', name: 'Old Coins', piece: 'an old coin', look: 'coin', color: '#c8a050', perNight: 9, pieces: COINS,
      milestones: { 10: { lines: ['The coins clink in her pocket. Ten of them. They sound like someone coming home.'] }, 25: { lines: ['Twenty-five coins. Enough for a phone call, a long time ago.'] }, 40: { lines: ['Forty coins. The last one is warm. She doesn’t need to count them any more.'], give: 'E181' } } },
    { id: 'pages', name: 'Torn Pages', piece: 'a torn page', look: 'letter', color: '#e8e0c8', perNight: 3, pieces: PAGES.map(function (t, i) { return { name: 'page ' + (i + 1), text: '“' + t + '”' }; }),
      milestones: { 12: { lines: ['The twelve pages fit together. The diary closes by itself.'], give: 'E182' } } },
    { id: 'photos', name: 'Photographs', piece: 'a photograph', look: 'photo', color: '#d8d0c0', perNight: 2, pieces: PHOTOS.map(function (t, i) { return { name: 'photograph ' + (i + 1), text: t }; }),
      milestones: { 8: { lines: ['Eight photographs. Together they make a family that never once stood in the same picture.'], give: 'E183' } } },
    { id: 'cranes', name: 'Paper Cranes', piece: 'a paper crane', look: 'crane', color: '#e06070', perNight: 5, pieces: CRANES,
      milestones: { 10: { lines: ['Ten cranes. She lines them up on her knees. They all face the same way.'] }, 20: { lines: ['Twenty cranes. One of them unfolds and becomes a biscuit wrapper, with a biscuit still inside.'], cookie: true } } }
  ];

  // trois effets de plus, au bout des collections
  var E = YN.data.effects;
  E.push({ id: 'E181', name: 'Coin Purse', fam: 'keepsake', world: 'DREAMROOM', icon: { glyph: '◍', c: '#c8a050' }, action: 'decoy', ground: false, core: false, collection: 'coins',
    desc: 'Forty coins and the sound they make together.', use: 'Throw a coin: whatever is listening goes to it.', get: 'Find all forty old coins scattered through the dreams.' });
  E.push({ id: 'E182', name: 'Mended Diary', fam: 'reading', world: 'DREAMROOM', icon: { glyph: '▤', c: '#e8e0c8' }, action: 'seek', ground: false, core: false, collection: 'pages',
    desc: 'The pages remember where things were left.', use: 'A small light drifts towards the nearest thing still hidden here (F).', get: 'Find the twelve torn pages.' });
  E.push({ id: 'E183', name: 'Photo Album', fam: 'perception', world: 'DREAMROOM', icon: { glyph: '▣', c: '#d8d0c0' }, action: 'trace', ground: false, core: false, collection: 'photos',
    desc: 'Every picture was taken from somewhere nobody stood.', use: 'For a moment, the walls that aren’t really walls show their edges (F).', get: 'Find the eight photographs.' });
  YN._effIndex = null;
  if (YN.stories) YN.stories.hook(); // la boucle et l'écoute des histoires (YN.game existe à ce moment)
})(typeof window !== 'undefined' ? window : globalThis);
