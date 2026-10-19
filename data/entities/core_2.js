/* =========================================================================
 *  Habitants du Verger, de la Fabrique, du Quartier vide, de la Maison
 *  qui attend, des Portes, du Désert, du Village et de la Forêt musicale.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function G() { return YN.game; }
  var V_OUMA = { wave: 'sine', pitch: 230, vary: 4, len: 80, vol: 0.06 };

  YN.defEntities([
    /* ---- Verger ---- */
    { id: 'N045', name: 'The Picker', world: 'W006', kind: 'human', behavior: 'wander', radius: 4, speed: 1,
      look: { t: 'tall', head: 'round', hair: '#6a4a2a', body: 'apron', c: ['#4a6a3a', '#3a5a2a', '#e0b890', '#6a4a2a'], eyes: 'down', mouth: 'line', acc: 'bag', h: 28 },
      lines: [{ t: 'The apples up top, I don’t pick them. They’re for the ones who float.', lang: 'en' },
        { t: 'At the bottom of the well there’s the sea. A grey sea with no edge.', lang: 'en' },
        { t: 'An apple for the fish in the pond? He’s crazy about them. He won’t tell you so.', lang: 'en' }],
      info: { role: 'Hints: apples (Fish), well (W039).' } },
    { id: 'N046', name: 'The Worm in the Apple', world: 'W006', kind: 'animal', behavior: 'wander', radius: 2, speed: 0.4,
      look: { t: 'worm', c: ['#e8a0a8'], h: 10 }, lines: ['It pokes its head out of a hole, looks at you, goes back in.', 'It has eaten a path in the shape of a letter. An S.'] },
    { id: 'N047', name: 'The Stray Bee', world: 'W006', kind: 'animal', behavior: 'fly', radius: 5, speed: 1.6, solid: false,
      look: { t: 'bee', c: ['#e8c030'], h: 10, shadow: false }, lines: ['She dances: three to the left, one up. The hive itself is elsewhere. Very far. In the white.'],
      info: { role: 'Hint for the Wax Hive (W042, through the Mono World in the dark).' } },

    /* ---- Fabrique de sommeil ---- */
    { id: 'N048', name: 'The Sleeping Worker', world: 'W007', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#2a2a2a', hairStyle: 'bun', body: 'uniform', c: ['#5a6a7a', '#3a4a5a', '#d8b8a0', '#2a2a2a'], eyes: 'closed', mouth: 'line', h: 23 },
      lines: [{ seq: ['She sleeps standing up, one hand on a lever. She murmurs:', { t: '하나, 셋… 둘… 넷… 멈추면 안 돼…', lang: 'ko-s', tr: 'One, three… two… four… mustn’t stop…' }, 'Her fingers tap the lever in time: one, then three, then two, then four.'] },
        { seq: ['Zzz.', { t: '코 자자. 생산하자, 생산하자.', lang: 'ko-s', tr: 'Night-night. Produce, produce.' }] },
        { t: '자장자장… 우리 아가…', lang: 'ko-s', tr: 'Hush, hush… my baby…' }],
      info: { role: 'Hint for the lever order (1-3-2-4).' } },
    { id: 'N049', name: 'The Foreman', world: 'W007', kind: 'human', behavior: 'patrol', path: [[30, 23], [52, 23], [52, 26], [30, 26]], speed: 1.6,
      look: { t: 'tall', head: 'tv', body: 'suit', c: ['#2a2a30', '#1a1a20', '#c8c8c8', '#40e060'], h: 28 },
      lines: [{ t: 'OUTPUT: ONE HUNDRED PERCENT. DREAMS: ZERO PERCENT. WELL DONE.', lang: 'en' },
        { t: 'Sleep is produced. Sleep is delivered. Sleep is not for you.', lang: 'en' },
        { t: 'PROTOCOL 0. You don’t know it? That’s normal. Nobody knows it.', lang: 'en' }],
      info: { role: 'Atmosphere; PROTOCOL 0 slogans.' } },
    { id: 'N050', name: 'The Sleeper on the Belt', world: 'W007', kind: 'human', behavior: 'static', solid: false, talkable: true,
      look: { t: 'adult', head: 'round', hair: '#4a3a2a', body: 'shirt', c: ['#c8c8c0', '#8a8a80', '#d8b898', '#4a3a2a'], eyes: 'closed', mouth: 'o', h: 20 },
      lines: ['He sleeps on the conveyor belt, hands folded. He does not dream.', 'A label on his foot: DELIVERY 06:00.'] },

    /* ---- Quartier vide ---- */
    { id: 'N051', name: 'The Woman with the Laundry', world: 'W008', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'none', body: 'dress', c: ['#a87a8a', '#8a5a6a', '#e0c0a0', '#3a2a2a'], h: 24 },
      lines: ['She hangs out washing that never dries. She has no face, but she looks tired.', { seq: ['The line goes all the way up to the sky. She says:', { t: 'If you go up, take a clothes peg. You never know.', lang: 'en' }] }],
      info: { role: 'Hint for the Laundry Sky (W024).' } },
    { id: 'N052', name: 'The Unleashed Dog', world: 'W008', kind: 'animal', behavior: 'follow', radius: 6, speed: 2.4,
      look: { t: 'dog', c: ['#c8a070', '#8a6a40'], h: 14 }, lines: ['He wags his tail, follows you a little, sits down in front of the lit house.', 'Woof. He looks at the sold house. He is waiting for someone who does not come back.'] },
    { id: 'N053', name: 'The Boy on the Bike', world: 'W008', kind: 'kid', behavior: 'patrol', path: [[2, 37], [61, 37]], speed: 3.2,
      look: { t: 'kid', head: 'cap', body: 'shirt', c: ['#3a6aa0', '#2a4a7a', '#f0c8a0', '#c03030'], eyes: 'dots', mouth: 'grin', h: 18 },
      lines: [{ t: 'Where do you live? Oh, over there. Me too. Everybody lives over there.', lang: 'en' },
        { t: 'Nour? She left. Her parents put the boxes in a blue car. She didn’t say goodbye.', lang: 'en' }],
      info: { role: 'First hint about Nour (Q07).' } },

    /* ---- Maison qui attend ---- */
    { id: 'N006', name: 'The Tenant', world: 'W009', kind: 'voice', role: 'major', major: true, behavior: 'static', invisible: true, hearDist: 6,
      ambientLines: ['Someone is whistling in another room.', 'A door closes softly, somewhere else.', 'Someone has set a chair straight.'], ambientEvery: 14,
      hears: [{ match: ['hello', 'hi', 'hey', 'is anyone there', 'is anybody there', 'anybody there', 'anyone home', 'anybody home', 'who is there', 'who s there', 'whos there', 'tenant', '안녕하세요', '안녕', '계세요', '누구 있어요', '누구세요', '여보세요', '세입자'], lines: ['The whistling stops. Silence. Then, from another room:', { t: 'Everything is ready.', lang: 'en' }], do: [{ rel: { N006: 1 } }] }, { match: ['thank you', 'thanks', 'thank u', 'cheers', '감사합니다', '고맙습니다', '고마워요', '고마워'], lines:['A pause. The whistling starts again, a little merrier.'], do: [{ rel: { N006: 2 } }, { quest: { Q05: 'thanked' } }] }],
      look: { t: 'voice' },
      info: { personality: 'Never seen; whistles; tidies. Vanishes if he is seen.', wants: 'For the house to stay ready.', arc: 'Q05 The House That Waits', flaw: 'Does not know who he is waiting for.' } },

    /* ---- Portes identiques ---- */
    { id: 'N054', name: 'The Number Seller', world: 'W010', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'box', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#c8a070', '#202020'], h: 23 },
      lines: [{ t: 'Numbers! Brand new! The 12, the 23, the 31… Which one is yours? Ah, that one I don’t sell.', lang: 'en' },
        { t: 'There’s a voice in the desert that knows the right one. It talks on the telephone. You need a telephone, naturally.', lang: 'en' },
        { t: 'If your bedroom door is ajar, one of mine is ajar too. They’re polite doors.', lang: 'en' }],
      info: { role: 'Hints for the Keyring (the voice in the desert, the door left ajar).' } },

    /* ---- Désert des téléphones ---- */
    { id: 'N055', name: 'The Operator', world: 'W011', kind: 'human', behavior: 'static', solid: true, lang: 'en',
      look: { t: 'humanoid', head: 'phone', body: 'dress', c: ['#2a2a4a', '#1a1a3a', '#e0c0a0', '#d03838'], h: 24 },
      lines: [{ t: 'Number, please. … No? Then listen. They ring in turn. Answer in turn.', lang: 'en' }, { t: 'Long distance is the only distance here, sweetheart.', lang: 'en' }, { t: 'The booth in the middle speaks last. It always speaks last.', lang: 'en' }],
      info: { role: 'Hint for the Telephone (order of the rings); speaks English (the “outside”).' } },
    { id: 'N056', name: 'The Lizard on the Pole', world: 'W011', kind: 'animal', behavior: 'wander', radius: 3, speed: 2,
      look: { t: 'frog', c: ['#c8a050'], h: 10 }, lines: ['It listens to the wires. It seems to know everything and not to care.'] },

    /* ---- Village ---- */
    { id: 'N005', name: 'Elder Ouma', world: 'W012', kind: 'human', role: 'major', major: true, behavior: 'static', lang: 'val', dialog: 'ouma', voice: V_OUMA,
      look: { t: 'old', head: 'round', hair: '#e8e8e0', hairStyle: 'braids', body: 'robe', c: ['#7a5a8a', '#5a3a6a', '#d8b090', '#e8e8e0'], eyes: 'closed', mouth: 'line', h: 22 },
      hears: [{ match: ['ouna se', 'ouna-se', 'ounase'], if: { noEffect: 'E25' }, lines: [{ t: 'Ouna-sé, tipa. Ouna-sé.', lang: 'val', tr: 'Hello, child. Hello.' }, { t: 'She smiles with her whole face. She puts a little wooden bell in your hand.' }], do: [{ give: 'E25' }, { rel: { N005: 3 } }, { quest: { Q04: 'greeted' } }] },
        { match: ['ouna se', 'ouna-se', 'ounase'], lines: [{ t: 'Ouna-sé. Ouma, ouma.', lang: 'val', tr: 'Hello. Thank you, thank you.' }] }],
      info: { personality: 'Weaver of words, Vallonian proverbs, resigned.', habits: 'Knots words in wool.', flaw: 'Believes that lost words are lost for ever.', wants: 'For the village to remember.', arc: 'Q04 The Nameless People' } },
    { id: 'N057', name: 'The Villager with the Bucket', world: 'W012', kind: 'human', behavior: 'wander', radius: 3, lang: 'val',
      look: { t: 'adult', head: 'round', hair: '#3a2a1a', body: 'robe', c: ['#8a7a5a', '#6a5a3a', '#d8b090', '#3a2a1a'], eyes: 'dots', mouth: 'smile', h: 22 },
      lines: [{ t: 'Ouna-sé !', lang: 'val', tr: 'Hello!' }, { t: 'Ilo, ilo. Ki ilo.', lang: 'val', tr: 'Water, water. Here, water.' }, { seq: [{ t: 'He greets the villager across the way:' }, { t: 'Ouna-sé !', lang: 'val', tr: 'Hello!' }, { t: 'She answers:' }, { t: 'Ouna-sé !', lang: 'val', tr: 'Hello!', who: 'The Villager Across the Way' }] }],
      info: { role: 'Shows the greeting (ouna-sé).' } },
    { id: 'N058', name: 'The Villager with the Threads', world: 'W012', kind: 'human', behavior: 'static', solid: true, lang: 'val',
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', hairStyle: 'long', body: 'robe', c: ['#5a7a8a', '#3a5a6a', '#d8b090', '#1a1a1a'], eyes: 'dots', mouth: 'line', h: 22 },
      lines: [{ t: 'Ouna-sé. Lé-lé… pélou.', lang: 'val', tr: 'Hello. The words… lost.' }, { t: 'Ké nami ti ? … Na-na. Nami pélou.', lang: 'val', tr: 'What is your name? … No. The name is lost.' }] },
    { id: 'N059', name: 'The Child Who Draws', world: 'W012', kind: 'kid', behavior: 'static', solid: true, lang: 'val',
      look: { t: 'kid', head: 'round', hair: '#4a2a1a', hairStyle: 'short', body: 'shirt', c: ['#c8a050', '#a08030', '#e0b890', '#4a2a1a'], eyes: 'wide', mouth: 'smile', acc: 'book', h: 17 },
      lines: [{ t: 'Pi tipa pala chou.', lang: 'val', tr: 'The little child speaks in silence.' }, { t: 'He shows you his drawing: a girl with her mouth sewn shut. He rubs out the stitches with his thumb.' }] },
    { id: 'N060', name: 'The Old Man on the Bench', world: 'W012', kind: 'human', behavior: 'static', solid: true, lang: 'val',
      look: { t: 'old', head: 'round', hair: '#c8c8c8', body: 'coat', c: ['#6a5a4a', '#4a3a2a', '#d8b090', '#c8c8c8'], eyes: 'closed', mouth: 'line', acc: 'cane', h: 21 },
      lines: [{ t: 'Oumé mo. Fou-ka, fou-ka.', lang: 'val', tr: 'I am old. I forget, I forget.' }, { t: 'Dinou ka-fou.', lang: 'val', tr: 'The bell remembers.' }] },

    /* ---- Forêt musicale ---- */
    { id: 'N061', name: 'The Listening Stag', world: 'W013', kind: 'animal', behavior: 'wander', radius: 4, speed: 1.2,
      look: { t: 'deer', c: ['#a07040', '#f0e0c0'], h: 22 }, lines: ['He turns one ear towards the small tree, the other towards the tall one. Then towards the one below.', 'He walks away if you play out of tune.'] },
    { id: 'N062', name: 'The Singing Mushroom', world: 'W013', kind: 'creature', behavior: 'static', solid: true,
      look: { t: 'humanoid', head: 'round', body: 'stick', c: ['#e8e0d0', '#e8e0d0', '#d04040', '#d04040'], eyes: 'closed', mouth: 'o', legs: false, h: 14 },
      lines: [{ seq: [{ t: 'La… do… mi…', lang: 'en' }, 'It sings the chief tree’s neighbours, left to right, then below. Then it falls silent.'] }, 'It has no mouth. It sings anyway.'],
      info: { role: 'Hint for the Ribbon (la, do, mi).' } },
    { id: 'N063', name: 'The Owl in the Branches', world: 'W013', kind: 'animal', behavior: 'static', nightOnly: true, solid: true,
      look: { t: 'owl', c: ['#6a5a4a'], h: 16 }, lines: [{ seq: ['Hoo.', { t: 'At night the forest sings lower. But the same notes.', lang: 'en' }] }] }
  ]);

  /* ---------------- l'Ancienne Ouma ---------------- */
  YN.defDialogue('ouma', {
    who: 'The Elder', voice: V_OUMA,
    branches: [
      { once: 'first', lines: [{ t: '…', lang: 'val' }, { t: 'She waits. She looks at you the way one looks at someone who has forgotten to say something.' }] },
      { if: { effect: 'E25', notFlag: 'q04_words' }, lines: [{ t: 'Lé-lé pélou. Mo-mo fou-ka.', lang: 'val', tr: 'The words are lost. We forget.' }, { t: 'Ré-pélou lé-lé, tipa. Dinou ka-fou.', lang: 'val', tr: 'Find the words again, child. The bell remembers.' }], do: [{ quest: { Q04: 'asked' } }] },
      { if: { flag: 'q04_words' }, lines: [{ t: 'Mo-mo pala ! Mo-mo pala !', lang: 'val', tr: 'We speak! We speak!' }, { t: 'Ti nami… ké ?', lang: 'val', tr: 'Your name… what is it?' }] },
      { lines: [{ t: 'Ouna-sé… ?', lang: 'val' }, { t: 'She tilts her head, as if at a question the whole village knows how to answer.' }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
