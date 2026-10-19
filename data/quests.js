/* =========================================================================
 *  LES ARCS — Q01 à Q12, M1, M2. Source de vérité des étapes.
 *  Le jeu ne les annonce jamais : le journal (page « Fils ») n'en garde
 *  qu'une phrase, au présent, comme une note de rêve.
 *  Ce fichier ajoute aussi les maillons qui ferment chaque arc
 *  (répliques, objets, conséquences) aux habitants déjà définis.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function V(t, tr) { return { t: t, lang: 'val', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function inWorld(id) { return function () { return !!(YN.game && YN.game.rt && YN.game.rt.id === id); }; }
  function place(world, md) { var w = YN.data.worlds[world]; if (!w) return; w.place = (w.place || []).concat([Object.assign({ at: 'random-any' }, md)]); }
  function dlg(id) { return YN.data.dialogues[id]; }
  function insertBranch(id, br, beforeFn) {
    var d = dlg(id); if (!d) { YN.warn('dialogue absent : ' + id); return; }
    var i = beforeFn ? d.branches.findIndex(beforeFn) : 0; if (i < 0) i = d.branches.length - 1;
    d.branches.splice(i, 0, br);
  }

  /* ------------------------------------------------------------------
   *  Définitions
   * ------------------------------------------------------------------ */
  YN.data.quests = [
    { id: 'Q01', name: 'The Last Passenger', giver: 'N002', world: 'W002', reward: 'E38 (if he stays)',
      stages: [['heard', 'The 23:71 train exists. It comes when the hour overflows.'], ['stub', 'A ticket stub, punched too early. It brings luck to people who wait.'], ['shoeFound', 'A child’s shoe, in a stranded rowing boat.'], ['shoe', 'The left one. Ok-sun’s. She was crying over the shoe.'], ['witness', 'Someone, in the south, saw the little girl grow up.'], ['aboard', 'The 23:71 train is heading for 1951. He is on board.'], ['stay', 'He got off on this side. His watch has no hands any more.'], ['gone', 'He stayed on the train. His shoes are well polished.'], ['home', 'On a platform full of flowers, an old lady looked up.']],
      ends: ['stay', 'gone', 'home'] },
    { id: 'Q02', name: 'The Gardener Without a Garden', giver: 'N003', world: 'W001', reward: 'a sprout on the terrace',
      stages: [['met', 'A gardener who no longer knows what he was meant to grow.'], ['seeds', 'One seed for each place where something happened.'], ['statue', 'A little girl with a watering can too big for her, a lady who whistled at the blackbirds.'], ['lastseed', 'The last seed is planted where you sleep.'], ['end_room', 'There is a sprout on the terrace. It wasn’t there before.']],
      ends: ['end_room'] },
    { id: 'Q03', name: 'The Impossible Correspondence', giver: 'N022', world: 'W003', reward: 'E40',
      stages: [['met', 'A very slow postman is trying to find out whose letter he is carrying.'], ['letter', 'A letter from Seoul, 1989, signed M., in the letterbox of 1204.'], ['delivered', 'M.’s letter has gone to S., in 2044. It will arrive.'], ['kept', 'S. answered: “I don’t want to become what I’m becoming.” I keep the letter.']],
      ends: ['kept'] },
    { id: 'Q04', name: 'The Nameless People', giver: 'N005', world: 'W012', reward: 'E41 · the village speaks again',
      stages: [['greeted', 'Ouna-sé. The wooden bell.'], ['asked', 'The village’s words have gone. They must be brought back: five knots of wool.'], ['resolved', 'Mo-mo pala. They speak. They asked me my name.']],
      ends: ['resolved'] },
    { id: 'Q05', name: 'The House That Waits', giver: 'N006', world: 'W009', reward: 'the house rests',
      stages: [['thanked', 'Someone is tidying a house for someone who isn’t coming.'], ['rest', 'He put down the suitcase. He stopped whistling. The house is asleep.']],
      ends: ['rest'] },
    { id: 'Q06', name: 'Knock-Knock and the Grand Show', giver: 'N007', world: 'W036', reward: 'E39',
      stages: [['met', 'He is preparing a show for the Spectator. He is missing the end of the joke.'], ['joke', 'A ticket in a “J.” trunk: the start of the joke.'], ['show', 'The end was in the suitcase. Tonight, the Grand Show.'], ['laughed', 'I laughed at the end. Someone had to.']],
      ends: ['laughed'] },
    { id: 'Q07', name: 'The Road Home', giver: 'N008', world: 'W140', reward: 'E37',
      stages: [['met', 'A girl who writes on her arm is looking for “home”.'], ['drawing', 'A forgotten drawing: two girls holding hands in front of a house.'], ['done', 'She gave me a map. So that I always know where I am.'], ['class', 'Someone rubbed out the word on the board. She put the marker away.']],
      ends: ['done', 'class'] },
    { id: 'Q08', name: 'The Playground', giver: 'N009', world: 'W030', reward: 'E31 · Ondine comes out',
      stages: [['met', 'Behind the cubicle door, someone is folding cranes.'], ['cranes', 'Seven cranes. She made them into a single one, bigger.'], ['laughter', 'The big boy who laughs: at his house, the TV is always on.'], ['adult', 'Grown up, he shouts at everyone. “I was all alone too. That doesn’t excuse anything.”'], ['out', 'Ondine came out of the cubicle. She looked at the playground.']],
      ends: ['out'] },
    { id: 'Q09', name: '야근', giver: 'N011', world: 'W033', reward: 'E32',
      stages: [['daughter', 'He thinks of his daughter every day. Every day, it is past midnight.'], ['photo', 'On his desk, a little girl, a badge: 미란.'], ['home', 'He switched off his screen. He tried to say no.']],
      ends: ['home'] },
    { id: 'Q10', name: 'The Painted Smile', giver: 'N012', world: 'W035', reward: 'E42',
      stages: [['photo', 'A photo of 철이. The painted smile has cracked.'], ['list', 'She knows Mr. Ahn’s name: he was on the list.'], ['tears', 'I told her she was allowed to cry. Not here. Later.'], ['smile', 'She kept her smile. She gave me one.']],
      ends: ['smile'] },
    { id: 'Q11', name: 'Flowey and the Seasons', giver: 'N001', world: 'W001', reward: 'Flowey stops counting',
      stages: [['snow', 'She wanted to see the cold of other gardens.'], ['night', 'She can’t see anything at night. She asked for someone to stay.'], ['flowers', 'Flowers on the stone. She told the truth for a second.'], ['seasons', 'Three seasons. “I don’t need to count your visits any more. I know you come back.”']],
      ends: ['seasons'] },
    { id: 'Q12', name: 'The Cartographer of the Maze', giver: 'N013', world: 'W031', reward: 'E29',
      stages: [['map1', 'A map of the north-east sector, made before nightfall. A compass.'], ['out', 'In the unstable maze, the compass turned towards her. She said sorry to the silent girl.']],
      ends: ['out'] },
    { id: 'M1', name: 'Mum’s Lights', derived: true, reward: 'counts towards the door',
      stages: [['first', 'One night, someone turned off the light.'], ['three', 'Three times. Very soft footsteps, a blanket pulled up.'], ['five', 'Five times. She comes, even when she is tired.'], ['dream', 'In a dream too, she turned off the light.']],
      ends: ['dream'] },
    { id: 'M2', name: 'The Priestess’s Names', derived: true, reward: 'none',
      stages: [['one', 'Somewhere, someone gives her a name.'], ['three', 'Three names. They are nothing alike.'], ['five', 'Five names. None is the right one. All of them are.']],
      ends: ['five'] }
  ];
  YN.questById = function (id) { return YN.data.quests.filter(function (q) { return q.id === id; })[0] || null; };
  YN.questText = function (id) {
    var q = YN.questById(id), st = YN.save.questStage(id); if (!q || !st) return null;
    var s = q.stages.filter(function (x) { return x[0] === st; })[0];
    return s ? s[1] : null;
  };

  /* ------------------------------------------------------------------
   *  Q01 — déjà câblé (W002, W039, W173, W192, W194, W197)
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
   *  Q02 — la dernière graine
   * ------------------------------------------------------------------ */
  insertBranch('pepin', { if: { flag: ['pepin_statue_seen', 'absents_watered'], not: { questLog: { Q02: 'lastseed' } } }, once: 'last',
    lines: [EN('Two! Two places where something happened, and two seeds that made up their minds. The stone, and the greenhouse of the people who aren’t here any more.'),
      EN('I’ve got the last one left. The stubbornest. It won’t grow here, and it won’t grow in a dream.'),
      EN('Plant it where you sleep. In the empty pot, out on the terrace. The real one. Not the one here.'),
      EN('I won’t come and look. Gardeners never watch things grow: it puts them off.')],
    do: [{ item: { seed: 1 } }, { quest: { Q02: 'lastseed' } }, { rel: { N003: 2 } }] }, function (b) { return b.if && b.if.dark; });
  if (YN.room) {
    var origPlant = YN.room.plant;
    YN.room.plant = function () {
      var S = YN.save;
      if (S.questStage('Q02') === 'lastseed' && S.items('seed') > 0) {
        S.addItem('seed', -1); S.setQuest('Q02', 'end_room'); YN.audio.sfx('reveal');
        YN.room.say(['She pushes the last seed into the dry soil of the pot with her finger.', 'She doesn’t know why she did it. She did it anyway.']);
        YN.room.refresh(); return;
      }
      return origPlant.apply(this, arguments);
    };
  }

  /* ------------------------------------------------------------------
   *  Q03 — la lettre remise compte pour la porte
   * ------------------------------------------------------------------ */
  YN.data.codeFlags = (YN.data.codeFlags || []).concat(['letter_to_s']);
  YN.bus.on('worldEnter', function () { var S = YN.save; if (S.perm && !S.perm.flags.letter_to_s) { var r = S.quest('Q03'); if (r && r.log && r.log.indexOf('delivered') >= 0) S.setFlag('letter_to_s', true); } });

  /* ------------------------------------------------------------------
   *  Q04 — cinq nœuds de laine, cinq mots du village
   * ------------------------------------------------------------------ */
  [['W012', 'pala', 'Between two houses, a knot of green wool. Inside, a word of the village: “pala”. It means “to speak”, surely. Or “again”.'],
    ['W013', 'tipa', 'Hanging from a branch that plays a note, a knot of wool: “tipa”. The note changes when you untie it.'],
    ['W014', 'ka-fou', 'A knot of wool, the only thing in colour in all the charcoal: “ka-fou”.'],
    ['W018', 'nami', 'Between two blank books, a knot of wool. The only written word in the whole library: “nami”.'],
    ['W019', 'mo-mo', 'A knot of wool caught in the reeds, glowing like a firefly: “mo-mo”.']].forEach(function (w) {
    var f = 'got:word_' + w[0], c = {}; c[f] = true;
    place(w[0], { id: 'word_' + w[0], type: 'decor', look: 'sparkle', lookOpt: { c: ['#d8f0c8'] }, solid: false, animated: true, lines: [w[2]],
      cond: { all: [{ questLog: { Q04: 'asked' } }, { not: { flag: f } }] }, use: [{ set: c }, { item: { word: 1 } }, { sfx: 'reveal' }, { hide: 'word_' + w[0] }] });
  });
  insertBranch('ouma', { if: { item: { word: 5 }, notFlag: 'q04_words' },
    lines: ['You open your hands. Five knots of wool. The Elder takes them one by one, unties them, and each word flies off towards a house.', V('Pala. Tipa. Ka-fou. Nami. Mo-mo.', 'Speak. Child. The bell. Name. Us.'), 'The village begins to speak, very softly at first, then everyone at once.', V('Tipa… ti nami ké ?', 'Child… what is your name?'), 'She waits. Then she smiles, as if it didn’t matter that you haven’t said it yet. She gives you the last word, the one that belonged to no one.'],
    do: [{ item: { word: -5 } }, { set: { q04_words: true, val_resolved: true } }, { give: 'E41' }, { quest: { Q04: 'resolved' } }, { rel: { N005: 3 } }] },
    function (b) { return b.if && b.if.notFlag === 'q04_words'; });

  /* ------------------------------------------------------------------
   *  Q05 — la maison peut se reposer
   * ------------------------------------------------------------------ */
  (function () {
    var e = YN.data.entities.N006; if (!e) return;
    e.hears = [{ match: ['papa', '아빠', 'father', 'he isn t coming back', 'he won t return',
      'dad', 'daddy', 'he won t come back', 'he is not coming back', 'he s not coming back', 'he is gone', 'he s gone', 'he left', 'you can rest', 'you can stop', 'rest now',
      '아빠는 안 와', '아빠 안 와', '쉬어도 돼', '그만해도 돼'], if: { equipped: 'E71' },
      lines: ['In the entrance hall, you set down the suitcase marked with a J.', 'The whistling stops. For a long time. Then a voice, very close, that no longer needs to hide.',
        EN('Ah. That’s the one. That’s the suitcase I was waiting for.'),
        EN('It’s empty. Well. Then I can stop tidying.'),
        'Somewhere, a chair creaks: someone sits down, for the first time.'],
      do: [{ quest: { Q05: 'rest' } }, { secret: 'locataire_rest' }, { rel: { N006: 3 } }] }].concat(e.hears || []);
  })();

  /* ------------------------------------------------------------------
   *  Q06 — la fin de la blague, le Grand Spectacle, le rire
   * ------------------------------------------------------------------ */
  insertBranch('toctoc', { if: { item: { joke: 1 }, equipped: 'E71', not: { quest: { Q06: ['show', 'laughed'] } } },
    lines: [EN('The ticket! And the suitcase! The “J.” suitcase! Boss, you found it — no, don’t say a thing, don’t say a thing —'),
      'He opens the suitcase. Inside, at the very bottom, the end of the joke, written in the same hand as the start.', 'He reads it. He doesn’t laugh. He reads it again.',
      EN('Tonight, Boss. The Grand Show. Under the big top. The Spectator might come. You — you come.')],
    do: [{ item: { joke: -1 } }, { quest: { Q06: 'show' } }] });
  insertBranch('toctoc', { if: { quest: { Q06: 'show' }, fn: inWorld('W036') },
    lines: [EN('Ladies and gentlemen, Boss! The Grand Show! The last joke!'),
      EN('Knock knock.'),
      'The empty big top answers, with a single voice:',
      { t: 'Who’s there?', lang: 'en', who: 'The Big Top' },
      EN('Daddy.'),
      { t: 'Daddy who?', lang: 'en', who: 'The Big Top' },
      '…',
      EN('… Daddy’s coming back tomorrow.'),
      'The spotlight crackles. Nobody laughs. The golden armchair is empty. Knock-Knock waits, arms open. Someone ought to laugh. Anyone.'] });
  (function () {
    var e = YN.data.entities.N007; if (!e) return;
    e.hearDist = Math.max(e.hearDist || 4, 8);
    e.hears = [{ match: ['haha', 'ha ha', 'hahaha', 'hihi', 'hehe', 'lol', 'hee hee', 'giggle', 'ㅋㅋ', 'ㅋㅋㅋ', 'ㅎㅎ', 'laughing',
      'ahah', 'ahahah', 'hah', 'heh', 'lmao', 'laugh', 'i laugh', '하하', '하하하', '히히', '크크', '웃어'], if: { quest: { Q06: 'show' } },
      lines: ['You laugh. It is a slightly broken laugh, a little too loud. It fills the whole big top.', 'Knock-Knock freezes. Then he laughs too, crying, bowing.',
        EN('She laughed! The Spectator laughed!'),
        'He looks at you.',
        EN('… It was you. You were the Spectator. All along.')],
      do: [{ give: 'E39' }, { quest: { Q06: 'laughed' } }, { rel: { N007: 3 } }] }].concat(e.hears || []);
  })();

  /* ------------------------------------------------------------------
   *  Q08 — Ondine sort de la cabine
   * ------------------------------------------------------------------ */
  (function () {
    var e = YN.data.entities.N009; if (!e) return;
    e.lines = [{ if: { quest: { Q08: 'adult' } }, seq: ['Very quietly, you tell her about the big boy who laughs, grown up now, who shouts at everyone, and who admitted that he was all alone too.', 'Behind the door, a long silence.', 'Then the latch. The door swings wide open. Ondine comes out, blinking in the light of the playground.', { t: 'He’s scared too. So I can come out. Not for him. For me.', lang: 'en', who: 'Ondine' }], do: [{ set: { ondine_out: true } }, { quest: { Q08: 'out' } }, { rel: { N009: 3 } }] }]
      .concat([{ if: { flag: 'ondine_out' }, t: 'Ondine plays hopscotch, alone, but outside. She waves to you without stopping.' }]).concat(e.lines || []);
  })();

  /* ------------------------------------------------------------------
   *  Q10 — la photo de 철이, le sourire
   * ------------------------------------------------------------------ */
  place('W083', { id: 'cholphoto', type: 'decor', look: 'photo', lookOpt: { person: true }, lines: ['In a locker marked “unclaimed items — 1951”, a passport photo: a boy in uniform. On the back: 철이.'],
    cond: { not: { flag: 'got:cholphoto' } }, use: [{ set: { 'got:cholphoto': true } }, { item: { photo: 1 } }, { hide: 'cholphoto' }] });
  insertBranch('ri', { if: { questLog: { Q10: 'tears' }, noEffect: 'E42' }, lines: [KN('…어제, 렬차 안에서 조금 울었습니다.', '…Yesterday, on the train, I cried a little.'), 'She touches her smile with her fingertips. It peels off, like a transfer.', KN('이건 이제 필요 없습니다. 동무가 가지십시오.', 'I don’t need this any more. You take it, comrade.')], do: [{ give: 'E42' }, { quest: { Q10: 'smile' } }] },
    function (b) { return b.lines && !b.if && !b.once; });
  insertBranch('ri', { if: { questLog: { Q10: 'photo' }, noEffect: 'E42', not: { questLog: { Q10: 'tears' } } },
    lines: ['She holds the photo of 철이 close. The painted smile holds, barely.', KN('저는 웃어야 합니다. 여기서는 모두 웃습니다.', 'I must smile. Here, everyone smiles.')],
    choices: [{ t: '“You’re allowed to cry.”', lines: ['She looks at you as if you had said a forbidden word.', KN('…여기서는 아닙니다. 나중에. 다른 꿈에서.', '…Not here. Later. In another dream.')], do: [{ quest: { Q10: 'tears' } }, { secret: 'ri_tears' }] },
      { t: '“Keep your smile, if you want.”', lines: ['She breathes out, slowly. The smile doesn’t move, but something behind it rests.', KN('고맙습니다. 하나 드리겠습니다. 쓸모가 있을 겁니다.', 'Thank you. I will give you one. It will be useful.'), 'She peels a spare smile, a painted one, off her face and puts it in your hand.'], do: [{ give: 'E42' }, { quest: { Q10: 'smile' } }] },
      { t: 'Say nothing.', lines: ['She glues a newspaper column back down. Her hands no longer shake.'] }] },
    function (b) { return b.lines && !b.if && !b.once; });

  /* ------------------------------------------------------------------
   *  Q11 — Flowey et les saisons
   * ------------------------------------------------------------------ */
  (function () {
    var at = function (b) { return b.if && (b.if.realDate || b.if.snow || b.if.dark); };
    insertBranch('flowey', { if: { all: [{ questLog: { Q11: 'snow' } }, { questLog: { Q11: 'night' } }, { questLog: { Q11: 'flowers' } }] }, once: 'seasons',
      lines: [EN('Snow. Night. Flowers on the stone.'), EN('You showed me three gardens and I never moved from here.'), '…',
        EN('I’m not going to count your visits any more.'), EN('I know you come back. That’s enough.')],
      do: [{ quest: { Q11: 'seasons' } }, { secret: 'flowey_seasons' }, { note: 'n_flowey' }, { rel: { N001: 3 } }] }, at);
    insertBranch('flowey', { if: { snow: true, not: { questLog: { Q11: 'snow' } } }, lines: [EN('Close the window. Please. Close it.'), EN('… No. Wait. Leave it open. One minute.'), EN('I want to know what the cold is like, in other people’s gardens.')], do: [{ quest: { Q11: 'snow' } }] }, at);
    insertBranch('flowey', { if: { dark: true, not: { questLog: { Q11: 'night' } } }, lines: [EN('It’s dark. I can’t see anything at night.'), EN('Stay. Not too close. But stay.'), EN('Is that what other people’s night is? Someone who stays?')], do: [{ quest: { Q11: 'night' } }] }, at);
    insertBranch('flowey', { if: { flag: 'statue_flowers', not: { questLog: { Q11: 'flowers' } } }, lines: [EN('You put flowers on the stone.'), EN('It was me she was forgetting. No. That’s not true.'), EN('She wasn’t forgetting me. She was tired. It isn’t the same, but it looks like it.')], do: [{ quest: { Q11: 'flowers' } }] }, at);
    // dans le Jardin, la Prêtresse a un nom (M2)
    var pr = dlg('flowey').branches.filter(function (b) { return b.if && b.if.priestessHere; })[0];
    if (pr) pr.do = (pr.do || []).concat([{ note: 'n_pr_grand' }]);
  })();

  /* ------------------------------------------------------------------
   *  Q12 — Thalie, plus loin
   * ------------------------------------------------------------------ */
  (function () {
    var e = YN.data.entities.N013; if (!e) return;
    e.worlds = Object.assign({}, e.worlds || {}, { W151: { at: 'random-any', appear: { questLog: { Q12: 'map1' } } } });
    insertBranch('thalie', { if: { fn: inWorld('W151') }, once: 'out',
      lines: [EN('You. Here too. The maze moves every night here. My maps are worthless.'),
        'You take out the compass. The needle spins, hesitates, and stops on Thalie.',
        EN('… It’s pointing at me?'),
        'She laughs, for the first time, a short, surprised laugh.',
        EN('So the way out wasn’t a place. It was turning round.'),
        EN('… At school there was a girl who didn’t talk. People made fun of her. Me, I did nothing. Nothing. Nothing is worse.'),
        EN('If you see her, tell her I’m sorry. No. I’ll tell her myself. Some day. When I’ve finished mapping this.')],
      do: [{ quest: { Q12: 'out' } }, { note: 'n_thalie' }, { rel: { N013: 3 } }] });
  })();

  /* ------------------------------------------------------------------
   *  M2 — les cinq noms de la Prêtresse
   * ------------------------------------------------------------------ */
  place('W035', { id: 'pr_poster', type: 'decor', look: 'poster', lookOpt: { c: ['#e8e0d0', '#202020'] }, lines: ['An official poster: a woman veiled in newspapers, in a white dress, a closed eye crossed out. Caption: “어머님”. (Mother.)'], use: [{ note: 'n_pr_mother' }] });
  place('W139', { id: 'pr_screen', type: 'decor', look: 'monitor', lines: ['On a screensaver, a sentence scrolls past: “She no longer sleeps. She erases her child’s dreams so the child can sleep better.”'], use: [{ note: 'n_pr_adult' }] });
  place('W007', { id: 'pr_protocol', type: 'decor', look: 'clipboard', lines: ['A sheet from the production line: “PROTOCOL 0 — if the subject cries, erase. Report nothing. Everything is fine.”'], use: [{ note: 'n_pr_depr' }] });
  place('W110', { id: 'pr_register', type: 'decor', look: 'book', lines: [KN('어버이께서는 고쳐야 할 것을 고쳐 주십니다.', 'The Parent corrects what must be corrected.'), 'An open register. In the margin, someone has drawn a closed eye, crossed out.'], use: [{ note: 'n_pr_nation' }] });

  /* ------------------------------------------------------------------
   *  Arcs dérivés (M1, M2) : recalculés à chaque passage
   * ------------------------------------------------------------------ */
  function syncDerived() {
    var S = YN.save; if (!S.perm) return;
    var mv = S.perm.mother ? S.perm.mother.visits : 0, m1 = null;
    if (mv >= 1) m1 = 'first'; if (mv >= 3) m1 = 'three'; if (mv >= 5) m1 = 'five';
    if (S.secret && S.secret('light_off_by_mother')) m1 = 'dream';
    if (m1 && S.questStage('M1') !== m1 && !(S.questStage('M1') === 'dream')) S.setQuest('M1', m1);
    var names = ['n_pr_mother', 'n_pr_adult', 'n_pr_grand', 'n_pr_depr', 'n_pr_nation'].filter(function (n) { return S.hasNote(n); }).length;
    var m2 = names >= 5 ? 'five' : names >= 3 ? 'three' : names >= 1 ? 'one' : null;
    if (m2 && S.questStage('M2') !== m2) { S.setQuest('M2', m2); if (m2 === 'five') S.setSecret('priestess_names'); }
  }
  YN.bus.on('worldEnter', syncDerived);
  YN.syncQuests = syncDerived;

  /* ------------------------------------------------------------------
   *  Notes du journal (phrases qu'elle garde)
   * ------------------------------------------------------------------ */
  Object.assign(YN.data.notes, {
    n_302: { t: 'Room 302. A scarf begun in 1989. It will be long.' },
    n_47: { t: 'Every house is number 47. Only one has a light on.' },
    n_birthday: { t: 'A cake, candles, an empty chair. The guest came after all. In a dream.' },
    n_color_unnamed: { t: 'I said a colour that didn’t exist. It exists now.' },
    n_drawings_box: { t: 'Under the bed down below, drawings for Mum. I never gave them to her.' },
    n_first_word: { t: 'The first word was “ma”. Nobody remembers. I do.' },
    n_kim_home: { t: 'He switched off his screen. He took his jacket. He went home before midnight, once.' },
    n_light_off: { t: 'Someone turned off the light. For the first time, it wasn’t me.' },
    n_lullaby: { t: '자장자장. She always falls asleep before the end.' },
    n_miran_child: { t: 'A little girl, in 1989, in front of a bowl of cold rice. She said sorry to me in advance.' },
    n_miran_photo: { t: 'On the desk of an employee who never goes home: a photo, a badge, 미란.' },
    n_mother_dream: { t: 'In her own dream, Mum does her rounds with a flashlight.' },
    n_nour_board: { t: 'I rubbed out the word on the board. The name stayed, all alone, clean.' },
    n_okSun_grew: { t: 'The little girl from the platform grew up. She watered a garden all her life.' },
    n_oksun_garden: { t: '1950. “He won’t come. I’ll water anyway.”' },
    n_reunion: { t: '“There you are. You took your time. Sit down. The garden is lovely.”' },
    n_roof: { t: 'On the tower roof, a woman by the railing. We stayed. She came back down.' },
    n_rule_silent: { t: 'Hush, Mum is sleeping.' },
    n_rule_seam: { t: 'Sew it up, nobody must see.' },
    n_rule_copy: { t: 'Do what the others do.' },
    n_rule_bell: { t: 'If someone rings, don’t open.' },
    n_rule_voyager: { t: 'He will come back.' },
    n_silence: { t: 'I’m allowed to stay silent. I’m also allowed to speak.' },
    n_statue_truth: { t: '안옥순 (1942–2023). Underneath: “엄마, 미안해. — 미란”.' },
    n_voice_mother: { t: '“응. 엄마 여기 있어.” She was there. Behind the door, but there.' },
    n_flowey: { t: 'Flowey doesn’t count my visits any more. She knows I come back.' },
    n_thalie: { t: 'The compass pointed at the one holding it. The way out was to turn round.' },
    n_pr_mother: { t: 'A poster calls her 어머님.' },
    n_pr_adult: { t: 'A screen says: she no longer sleeps, she erases her child’s dreams.' },
    n_pr_grand: { t: 'Flowey says: the one who cuts the flowers.' },
    n_pr_depr: { t: 'PROTOCOL 0: if the subject cries, erase.' },
    n_pr_nation: { t: 'A register says: the Parent corrects what needs correcting.' }
  });
})(typeof window !== 'undefined' ? window : globalThis);
