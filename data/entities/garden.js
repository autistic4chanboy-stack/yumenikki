/* =========================================================================
 *  Habitants du Jardin (W001) et dialogues de Flowey et Pépin.
 *  Langues : Flowey, Pépin, Gaston et les bêtes parlent anglais ; la dame
 *  assise (fête des mères) parle coréen du Sud. Narration en français.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function visits() { return YN.save.visits('W001'); }
  var VOICE_FLOWEY = { wave: 'square', pitch: 640, vary: 3, len: 32, vol: 0.04 };
  var VOICE_PEPIN = { wave: 'triangle', pitch: 330, vary: 6, len: 42, vol: 0.06 };

  YN.defEntities([
    { id: 'N001', name: 'Flowey', world: 'W001', kind: 'plant', role: 'major', major: true, behavior: 'static', dialog: 'flowey', voice: VOICE_FLOWEY,
      look: { t: 'humanoid', head: 'flower', body: 'stick', legs: false, arms: false, c: ['#3a8a3a', '#3a8a3a', '#f0d040', '#f0d040'], eyes: 'dots', mouth: 'smile', h: 22 },
      info: { personality: 'A small yellow flower, anxious and possessive. Counts everything, especially your visits. Lies to protect. Speaks English, in short sentences.', habits: 'Counts. Asks for the window to be closed. Sees nothing at night.', wants: 'To see the other gardens without leaving her own.', arc: 'Q11 Flowey and the Seasons', relations: 'On bad terms with Pip, who never planted her. Knows the statue.' } },
    { id: 'N003', name: 'Pip', world: 'W001', kind: 'human', role: 'major', major: true, behavior: 'wander', radius: 2, dialog: 'pepin', voice: VOICE_PEPIN,
      worlds: { W028: { at: 'P' } },
      look: { t: 'humanoid', head: 'pot', body: 'apron', c: ['#6a7a4a', '#5a4a3a', '#e8c8a8', '#e8e0c8'], eyes: 'wide', mouth: 'smile', acc: 'seeds', h: 22 },
      info: { personality: 'A gardener with a clay-pot head, eager and chatty, endless sentences, garden puns (in English).', habits: 'Recounts his seeds, loses count, starts again.', flaw: 'Never dares to plant: “what if it isn’t the right place?”', wants: 'To remember what he was supposed to grow.', arc: 'Q02 The Gardener Without a Garden' } },
    { id: 'N015', name: 'The Blackbird', world: 'W001', kind: 'animal', behavior: 'static', silentTalk: true, onTalk: [{ mech: 'birdSing' }], oy: -1.1, solid: false,
      look: { t: 'bird', c: ['#16161c', 0, 0, '#e8a53a'], h: 16 }, info: { role: 'The Blackbird Whistle puzzle (P002).' } },
    { id: 'N016', name: 'The Pond Fish', world: 'W001', kind: 'animal', behavior: 'swim', radius: 5, speed: 1.5, solid: false, talkable: true,
      look: { t: 'fish', c: ['#e08040'], h: 14, shadow: false },
      lines: [{ if: { item: { apple: 1 } }, t: 'The fish leaps and catches the apple in mid-air.', do: [{ item: { apple: -1 } }, { give: 'E04' }] }, { t: 'Bloop.', lang: 'en' }, 'It circles a water lily, always the same one.'],
      info: { role: 'The Fish effect puzzle (P004).' } },
    { id: 'N018', name: 'The Owl', world: 'W001', kind: 'animal', behavior: 'static', nightOnly: true, solid: true,
      look: { t: 'owl', c: ['#7a5a3a'], h: 18 },
      lines: [{ t: 'Hoo.', lang: 'en' }, { seq: [{ t: 'Hoo hoo.', lang: 'en' }, 'She turns her head towards the hedge, to the south-west, and keeps it turned.'] }, 'She closes one eye, then the other.'],
      info: { role: 'At night, watches the door in the hedge (a clue to W136).' } },
    { id: 'N019', name: 'The Butterfly', world: 'W001', kind: 'animal', behavior: 'fly', radius: 6, dayOnly: true, noSnow: true, solid: false, speed: 1.4,
      look: { t: 'moth', c: ['#f0c0e0'], h: 16, shadow: false }, lines: ['It lands on your hand. It flies off again.'] },
    { id: 'N020', name: 'The Snail on the Bank', world: 'W001', kind: 'animal', behavior: 'wander', radius: 2, speed: 0.3,
      look: { t: 'snail', c: ['#9a6a40', '#c8b890'], h: 14 }, lines: ['It leaves a shining trail. It almost spells a word.', 'It draws back into its shell when you talk too loudly.'] },
    { id: 'N021', name: 'The Seated Lady', world: 'W001', kind: 'human', behavior: 'static', appear: { realDate: 'feteDesMeres' }, major: true,
      look: { t: 'humanoid', head: 'round', hair: '#d8d8d8', hairStyle: 'bun', body: 'hanbok', c: ['#e8e4dc', '#f4f0e8', '#e8d0b8', '#c04050'], eyes: 'closed', mouth: 'smile', h: 24, alpha: 0.75 },
      dialog: 'mothersday', voice: { wave: 'sine', pitch: 260, vary: 2, len: 60, vol: 0.05 },
      info: { role: 'Appears only on the real date of Mother’s Day. Gives the Pasta Necklace (E43). Speaks South Korean.', hint: 'Flowey: “Today someone is sitting by the stone”; the calendar in the Bedroom.' } },
    { id: 'N022', name: 'Gaston', kind: 'animal', role: 'major', major: true, behavior: 'wander', radius: 1, speed: 0.4, dialog: 'gaston',
      worlds: { W001: { at: [36, 18] }, W003: { at: 'G' }, W010: { at: 'G' } },
      look: { t: 'snail', c: ['#b07040', '#d8c8a0'], hat: true, hatColor: '#2a4a8a', h: 18 }, voice: { wave: 'triangle', pitch: 150, vary: 1, len: 90, vol: 0.06 },
      info: { personality: 'A postman snail, pompous and very slow (broken English, syllable by syllable), stamps everything. Always arrives too early or too late.', arc: 'Q03 The Impossible Correspondence' } }
  ]);

  /* ---------------- FLOWEY ---------------- */
  YN.defDialogue('flowey', {
    who: 'Flowey', voice: VOICE_FLOWEY,
    branches: [
      { once: 'first', lines: [{ t: 'Oh. You’re here.', lang: 'en' }, { t: 'Don’t step on the brown leaves. They scream.', lang: 'en' }, { t: 'I’m Flowey. I count. Somebody has to count.', lang: 'en' }, { t: 'That’s one visit. One.', lang: 'en' }], do: [{ rel: { N001: 1 } }] },
      { if: { priestessHere: true }, lines: ['…', { t: 'She cuts the flowers. Don’t look at her.', lang: 'en' }, { t: 'I said don’t look at her.', lang: 'en' }] },
      { if: { witchHere: true }, lines: [{ t: 'Shh.', lang: 'en' }, { t: 'Someone’s walking without making a sound.', lang: 'en' }] },
      { if: { realDate: 'feteDesMeres' }, once: 'md', lines: [{ t: 'Today someone is sitting by the stone. Across the water.', lang: 'en' }, { t: 'Don’t tell her I told you. She doesn’t like being counted.', lang: 'en' }] },
      { if: { snow: true }, lines: [{ t: 'Close the window. Please. Close it.', lang: 'en' }, { t: 'My leaves remember the cold. They remember everything.', lang: 'en' }] },
      { if: { dark: true }, lines: [{ t: 'It’s dark.', lang: 'en' }, { t: 'I can’t see at night, you know I can’t see at night.', lang: 'en' }, { t: 'Stay close. Not too close.', lang: 'en' }] },
      { if: { tempGte: { sproutFled: 3 }, noEffect: 'E01' }, once: 'leafhint', lines: [{ t: 'You scared it off again.', lang: 'en' }, { t: 'The brown ones scream. The green ones keep quiet. That’s all I’m saying.', lang: 'en' }] },
      { if: { captures: 1, fn: function () { var d = YN.save.perm.lastDream; return d && d.reason === 'capture'; } }, once: 'cap', lines: [{ t: 'You left fast last time.', lang: 'en' }, { t: 'Were you scared?', lang: 'en' }, { t: 'I can’t leave. So I’m not allowed to be scared.', lang: 'en' }] },
      { if: { flag: 'statue_flowers' }, once: 'flowers', lines: [{ t: 'You put flowers on the stone.', lang: 'en' }, { t: 'She never watered anything, you know.', lang: 'en' }, '…', { t: 'No. That’s a lie. She watered everything. It was me she forgot.', lang: 'en' }, { t: 'Or it was you who watered me. Before. I don’t count so well any more.', lang: 'en' }] },
      { if: { met: 'N003' }, once: 'pepin', lines: [{ t: 'Did Pip talk to you?', lang: 'en' }, { t: 'He keeps his seeds the way you keep a secret you’ve forgotten.', lang: 'en' }, { t: 'He never planted me. I planted myself.', lang: 'en' }, { t: 'Don’t tell him I’m jealous. I’m not jealous.', lang: 'en' }] },
      { if: { talks: { N001: 4 } }, once: 'statue', lines: [{ t: 'The statue? It’s nobody’s statue.', lang: 'en' }, '…', { t: 'Nobody who counted.', lang: 'en' }], choices: [{ t: 'Who was it?', lines: [{ t: 'I don’t count people. Only visits.', lang: 'en' }, { t: 'And flowers. And drops. And… leave me alone.', lang: 'en' }], do: [{ rel: { N001: -1 } }] }, { t: 'All right.', lines: [{ t: 'Thank you.', lang: 'en' }, { t: 'You’re nice when you don’t ask anything.', lang: 'en' }], do: [{ rel: { N001: 1 } }] }] },
      { if: { effect: 'E01', notFlag: 'statue_flowers' }, once: 'sprout', lines: [{ t: 'You’ve got the sprout. Good.', lang: 'en' }, { t: 'Don’t plant it just anywhere. The soil remembers.', lang: 'en' }, { t: 'Where something happened, things grow better.', lang: 'en' }] },
      { if: { fn: function () { return visits() >= 20; } }, lines: [{ t: function () { var n = visits(); return { t: 'Visit number ' + n + '.', lang: 'en' }; } }, { t: 'You always come back.', lang: 'en' }, { t: 'I stay. It’s not the same, but after a while it starts to look the same.', lang: 'en' }] },
      { if: { fn: function () { return visits() === 7; } }, lines: [{ t: 'Seven. My favourite.', lang: 'en' }, { t: 'Don’t ask why. Seven is seven.', lang: 'en' }] },
      { lines: [{ t: function () { var n = visits(); return { t: 'This is your visit number ' + n + '. I count.', lang: 'en' }; } }, { t: function () { return [
        { t: 'I count the waterfall drops too. I give up around a thousand.', lang: 'en' },
        { t: 'The blackbird sang eleven times today. Always in the same order. Never the same two days running.', lang: 'en' },
        { t: 'Pip counted his seeds again. He lost one. He always loses one.', lang: 'en' },
        { t: 'The maze is never the same. I am.', lang: 'en' },
        { t: 'If you fall through the hole in the bridge, you’ll come back from underneath. Everything comes back.', lang: 'en' }
      ][Math.floor(Math.random() * 5)]; } }] }
    ]
  });

  /* ---------------- PÉPIN ---------------- */
  YN.defDialogue('pepin', {
    who: 'Pip', voice: VOICE_PEPIN,
    branches: [
      { once: 'first', lines: [
        { t: 'Oh! Oh oh. A visitor! Mind the flowerbeds — well, there aren’t any flowerbeds, that’s rather the problem, you see, I’ve got the seeds but not the garden, or rather I’ve got the garden but not the — well.', lang: 'en' },
        { t: 'Pip. Gardener. Without a garden. Well, with. But without.', lang: 'en' },
        { t: 'You wouldn’t happen to know, would you, what I was supposed to grow?', lang: 'en' }],
        choices: [
          { t: 'Flowers?', lines: [{ t: 'Flowers! Yes! No. Maybe. Flowers are for something, not for themselves. For whom, then? Oh, fiddle-de-fern.', lang: 'en' }], do: [{ quest: { Q02: 'met' } }, { rel: { N003: 1 } }] },
          { t: 'No idea.', lines: [{ t: 'Me neither! That makes two of us. Two is the start of a row.', lang: 'en' }], do: [{ quest: { Q02: 'met' } }] },
          { t: '…', lines: [{ t: 'Silence is good for seedlings. They don’t like to be rushed.', lang: 'en' }], do: [{ quest: { Q02: 'met' } }, { rel: { N003: 1 } }] }
        ] },
      { if: { flag: 'pepin_pile_taken', notFlag: 'pepin_pile_seen' }, once: 'pile', lines: [{ t: 'There’s a plank missing from my pile.', lang: 'en' }, { t: 'I count again. And again. One, two…', lang: 'en' }, { t: 'It’s nothing. It’s nothing. People always take what was put aside for later, that’s normal, later never comes.', lang: 'en' }], do: [{ set: { pepin_pile_seen: true } }] },
      { if: { notFlag: 'pepin_plank' }, once: 'plank', lines: [{ t: 'You’re looking at the bridge, aren’t you? Everyone looks at the bridge. Nobody looks underneath.', lang: 'en' }, { t: 'A plank? I have three. Well, two. Well, one, which I’m saving for a garden that’s coming.', lang: 'en' }, { t: 'Here. If the garden comes, you’ll give it back. It won’t come. Take it anyway.', lang: 'en' }], do: [{ item: { plank: 1 } }, { set: { pepin_plank: true } }, { quest: { Q02: 'met' } }] },
      { if: { effect: 'E01', notFlag: 'pepin_seeds' }, once: 'seeds', lines: [{ t: 'But — that’s the sprout! It let you take it? It never lets anyone take it!', lang: 'en' }, { t: 'Then you could… would you… plant my seeds? Just one per place. Not anywhere: where something happened.', lang: 'en' }, { t: 'The first one’s the easiest. By the stone, across the water. I don’t dare go there. Bridges, the dead, you see.', lang: 'en' }], do: [{ set: { pepin_seeds: true } }, { quest: { Q02: 'seeds' } }, { rel: { N003: 1 } }] },
      { if: { flag: 'statue_flowers', notFlag: 'pepin_statue_seen' }, once: 'statue', lines: [{ t: 'You planted by the stone. I felt it. I always feel it when a seed makes up its mind.', lang: 'en' }, { t: 'There used to be someone who came here with a watering can too big for her arms. A little one. With a white-haired lady who whistled at the blackbirds.', lang: 'en' }, { t: 'Maybe I’m talking nonsense. Pots don’t have memories. Only soil.', lang: 'en' }], do: [{ set: { pepin_statue_seen: true } }, { quest: { Q02: 'statue' } }] },
      { if: { dark: true }, lines: [{ t: 'At night the seeds tell each other stories. I only hear the endings.', lang: 'en' }, { t: 'Always the same ending: “and then they had to leave”.', lang: 'en' }] },
      { if: { snow: true }, lines: [{ t: 'Brr. Frost is good for some seeds. They have to believe they’re dead before they want to live.', lang: 'en' }, { t: 'I don’t know where I dug that up.', lang: 'en' }] },
      { lines: [{ t: function () { return [
        { t: 'One, two, three, four, five, six… six. There were seven. There are always seven, except when I count.', lang: 'en' },
        { t: 'Tomatoes, no. Radishes, no. Sunflowers… maybe. No.', lang: 'en' },
        { t: 'Have you seen my head? A sprout that won’t sprout. Like a reminder.', lang: 'en' },
        { t: 'Flowey won’t talk to me. She says I never planted her. It’s true. She grew without me. That’s almost worse.', lang: 'en' },
        { t: 'If you find a seed that isn’t mine, don’t show me. I’d be jealous, and jealousy rots the roots.', lang: 'en' }
      ][Math.floor(Math.random() * 5)]; } }] }
    ]
  });

  /* ---------------- LA DAME ASSISE (fête des mères) ---------------- */
  YN.defDialogue('mothersday', {
    who: '', voice: { wave: 'sine', pitch: 260, vary: 2, len: 60, vol: 0.05 },
    branches: [
      { if: { noEffect: 'E43' }, lines: ['She doesn’t turn round.', 'On her lap, a necklace of painted pasta. Two beads are missing.', { t: '고마워.', lang: 'ko-s', tr: 'Thank you.' }, 'She places it in your hand. She is gone.'], do: [{ give: 'E43' }, { set: { mothersday_seen: true } }, { note: 'n_mothersday' }] },
      { lines: ['The stone bench is warm.'] }
    ]
  });

  /* ---------------- GASTON (Q03, provisoire) ---------------- */
  YN.defDialogue('gaston', {
    who: 'Gaston', voice: { wave: 'triangle', pitch: 150, vary: 1, len: 90, vol: 0.06 },
    branches: [
      { once: 'first', lines: [{ t: 'Young… la-dy.', lang: 'en' }, { t: 'Gas-ton. Post-man. Ex-press… ser-vice.', lang: 'en' }, { t: 'I… have… a… let-ter. For… some-one.', lang: 'en' }, { t: 'I… will… tell… you… who… when… I… re-mem-ber.', lang: 'en' }], do: [{ quest: { Q03: 'met' } }] },
      { lines: [{ t: 'Stamp.', lang: 'en' }, { t: 'It… is… da-ted… to-mor-row. That… is… why… it… is… late.', lang: 'en' }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
