/* =========================================================================
 *  Habitants du Fusain, de l'Arcade, de la Piscine, du Supermarché, de la
 *  Bibliothèque, du Marais et de la Fête foraine.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var fireflies = [];
  for (var i = 0; i < 8; i++) fireflies.push({ id: 'N0' + (78 + i), name: 'Firefly', world: 'W019', kind: 'animal', tag: 'firefly', behavior: 'fly', radius: 4, speed: 1.3, solid: false, talkable: false,
    look: { t: 'moth', c: ['#f8f070'], h: 8, glow: '#f8f070', shadow: false }, light: 1.2, lightColor: '#f8f080', info: { role: 'Fireflies puzzle (P027).' } });

  YN.defEntities([
    /* ---- fusain ---- */
    { id: 'N064', name: 'Crumb', world: 'W014', kind: 'creature', behavior: 'flee', radius: 9, speed: 2.6, solid: true,
      look: { t: 'blob', c: ['#d8d0c0'], h: 12 }, lines: ['Crumb looks at you and darts off, leaving grey crumbs behind.'],
      info: { role: 'Eraser puzzle (P010): corner it in a dead end.' } },
    { id: 'N065', name: 'The Rubbed-Out Man', world: 'W014', kind: 'shadow', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'round', body: 'stick', c: ['#c8c4bc', '#c8c4bc', '#e8e4dc', '#c8c4bc'], eyes: 'none', mouth: 'none', alpha: 0.6, h: 24 },
      lines: ['A drawn stick man, half rubbed out. He has only one hand left, and it holds a suitcase.', 'He tries to say something. His mouth was the first thing rubbed out.'] },
    { id: 'N066', name: 'The Hatching', world: 'W014', kind: 'creature', behavior: 'wander', radius: 3,
      look: { t: 'shadow', c: ['#303030'], h: 16 }, lines: ['A walking scribble. It crosses out everything it touches, without malice.'] },

    /* ---- arcade ---- */
    { id: 'N067', name: 'The Pixelated Dancer', world: 'W015', kind: 'creature', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'square', body: 'shirt', c: ['#40e0a0', '#20a070', '#e0ffe0', '#40e0a0'], eyes: 'x', mouth: 'grin', h: 22 },
      lines: [{ t: 'LEFT! UP! RIGHT! RIGHT! DOWN! Your turn, kid!', lang: 'en' }, 'He does the steps again, more slowly. Patient, for a game.'],
      info: { role: 'Token puzzle (P017).' } },
    { id: 'N068', name: 'The Screen Child', world: 'W015', kind: 'kid', behavior: 'static', solid: true,
      look: { t: 'kid', head: 'tv', body: 'shirt', c: ['#3a3a5a', '#2a2a4a', '#c8c8c8', '#8af0ff'], h: 18 },
      lines: ['He plays without moving. On the screen of his head, a game that never ends.', { t: 'At home the TV is always on. Here too. Same thing, but with points.', lang: 'en' }],
      info: { role: 'Echo of the Big Laugh (a child left alone in front of screens).' } },
    { id: 'N069', name: 'The Token Cashier', world: 'W015', kind: 'human', behavior: 'static', solid: true, lang: 'en',
      look: { t: 'adult', head: 'round', hair: '#e04090', hairStyle: 'long', body: 'uniform', c: ['#2a2a4a', '#1a1a3a', '#e0c0a0', '#e04090'], eyes: 'dots', mouth: 'line', h: 23 },
      lines: [{ t: 'No tokens left, hun. Win one or crawl for one.', lang: 'en' }, { t: 'The black machine? It only wakes for watermelons.', lang: 'en' }],
      info: { role: 'Hints: Token, the black machine (the watermelon from the Bedroom).' } },

    /* ---- piscine ---- */
    { id: 'N070', name: 'The Absent Lifeguard', world: 'W016', kind: 'voice', behavior: 'static', invisible: true, ambientLines: ['A blast on a whistle, very far away.', { t: 'No shouting in the pool.', lang: 'en' }, { t: 'You answer when the echo calls. Just repeat.', lang: 'en' }], hearDist: 16, ambientEvery: 16, look: { t: 'voice' },
      info: { role: 'Hint for the Echo.' } },
    { id: 'N071', name: 'The Dry Swimmer', world: 'W016', kind: 'ghost', behavior: 'wander', radius: 4, alpha: 0.6, solid: false, talkable: true,
      look: { t: 'ghost', c: ['rgba(180,220,255,0.6)'], h: 20 }, lines: ['She swims breaststroke in the air, above the empty pool.', { seq: ['She stops, without touching the bottom.', { t: 'I learned on my own. Nobody had the time.', lang: 'en' }] }] },

    /* ---- supermarché ---- */
    { id: 'N072', name: 'The Cashier', world: 'W017', kind: 'human', behavior: 'static', solid: true, face: false,
      look: { t: 'adult', head: 'round', hair: '#4a3020', hairStyle: 'bun', body: 'apron', c: ['#40a060', '#307048', '#e0c0a0', '#4a3020'], eyes: 'down', mouth: 'line', h: 23 },
      lines: ['She scans invisible items. Beep. Beep. She does not look up.', 'She seems to be waiting for someone to greet her, as happens once in a thousand times.'],
      info: { role: 'Skates puzzle (P007): say “good evening” to her.' } },
    { id: 'N073', name: 'The Shelf Stacker', world: 'W017', kind: 'human', behavior: 'patrol', path: [[27, 4], [27, 20]], speed: 1.2,
      look: { t: 'adult', head: 'cap', body: 'apron', c: ['#40a060', '#307048', '#d8b898', '#2a6a40'], eyes: 'dots', mouth: 'line', acc: 'box', h: 23 },
      lines: [{ t: 'I shelve what nobody buys. That’s most of the job.', lang: 'en' }, { t: 'Aisle seven is reserved. The cashier knows who for.', lang: 'en' }] },
    { id: 'N074', name: 'The Child with the Trolley', world: 'W017', kind: 'kid', behavior: 'wander', radius: 5, speed: 2.4,
      look: { t: 'kid', head: 'round', hair: '#2a1a10', body: 'shirt', c: ['#e0a040', '#c08020', '#f0c8a0', '#2a1a10'], eyes: 'wide', mouth: 'o', h: 17 },
      lines: [{ t: 'I’m doing the shopping all by myself! Mom left the list and the money on the table.', lang: 'en' }, { t: 'Can you count change? I can. For a long time now.', lang: 'en' }] },

    /* ---- bibliothèque ---- */
    { id: 'N075', name: 'The Librarian', world: 'W018', kind: 'human', behavior: 'static', solid: true, dayOnly: true,
      look: { t: 'old', head: 'round', hair: '#a0a0a0', hairStyle: 'bun', body: 'dress', c: ['#5a4a6a', '#3a2a4a', '#e0c8b0', '#a0a0a0'], eyes: 'line', mouth: 'line', acc: 'stamp', h: 22 },
      lines: [{ t: 'Shh.', lang: 'en' }, { t: 'The white books have always been white. Always.', lang: 'en' }, { t: 'I stamp. ERASED. ERASED. It’s cleaner.', lang: 'en' }, { seq: [{ t: 'My glasses? I only take them off to sleep. And I never sleep. Except when the light goes out.', lang: 'en' }, 'She taps her glasses, then glances at the lamps, as if they might go out all at once.'] }],
      info: { role: 'Glasses puzzle (P014): at night (light off), she sleeps and her glasses stay on the desk.', belief: 'Believes the books have always been blank (they were erased).' } },
    { id: 'N089', name: 'The Sleeping Librarian', world: 'W018', at: [22, 15], kind: 'human', behavior: 'static', solid: true, nightOnly: true,
      look: { t: 'old', head: 'round', hair: '#a0a0a0', hairStyle: 'bun', body: 'dress', c: ['#5a4a6a', '#3a2a4a', '#e0c8b0', '#a0a0a0'], eyes: 'closed', mouth: 'o', h: 20 },
      lines: [{ seq: ['She sleeps with her head on her arms. She snores very softly, stamping in her dream.', { t: 'Erased… erased…', lang: 'en' }] }] },
    { id: 'N076', name: 'The Reader Without a Book', world: 'W018', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#3a3a3a', body: 'coat', c: ['#4a4a5a', '#3a3a4a', '#d8b898', '#3a3a3a'], eyes: 'down', mouth: 'line', acc: 'book', h: 23 },
      lines: ['He reads a blank page with great attention. He turns the page. Blank too.', { t: 'With glasses, you see what was written. You don’t always see what was erased.', lang: 'en' }] },
    { id: 'N077', name: 'The Library Rat', world: 'W018', kind: 'animal', behavior: 'wander', radius: 4, speed: 2.6,
      look: { t: 'rabbit', c: ['#8a8a8a'], h: 10 }, lines: ['It eats the margins. It leaves only the text, which is blank.'] },

    /* ---- marais : les lucioles ---- */
  ].concat(fireflies).concat([
    /* ---- fête foraine ---- */
    { id: 'N086', name: 'The Mime', world: 'W020', kind: 'human', behavior: 'static', solid: true, silentTalk: true, onTalk: [{ msg: 'The mime puts a finger to his lips, then repeats his gestures: up, left, down, right, up. He points at the ground: your turn.' }],
      look: { t: 'humanoid', head: 'mask', body: 'shirt', c: ['#101010', '#f0f0f0', '#f8f8f8', '#101010'], eyes: 'painted', mouth: 'painted', h: 23 },
      info: { role: 'Balloon puzzle (P018): copy his gestures (non-verbal communication).' } },
    { id: 'N087', name: 'The Balloon Seller', world: 'W020', kind: 'ghost', behavior: 'static', alpha: 0.5, solid: false, talkable: true,
      look: { t: 'ghost', c: ['rgba(240,200,200,0.5)'], acc: 'balloon', h: 22 },
      lines: [{ t: 'A balloon, miss? They’re free tonight. But you have to know how to ask for one without talking.', lang: 'en' }, { t: 'The gentleman with the suitcase bought one, once. For a little girl.', lang: 'en' }] },
    { id: 'N088', name: 'The Sad Clown', world: 'W020', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'round', body: 'suit', c: ['#d04040', '#4040d0', '#f8f8f8', '#e04040'], eyes: 'sad', mouth: 'frown', h: 23 },
      lines: [{ t: 'I’m not funny. Knock-Knock, now, he’s funny. Well. He thinks so.', lang: 'en' }, { t: 'The big top opens when he has something to make people laugh. He’s still looking for the end of his joke.', lang: 'en' }] }
  ]));
})(typeof window !== 'undefined' ? window : globalThis);
