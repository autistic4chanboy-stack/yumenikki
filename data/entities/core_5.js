/* =========================================================================
 *  Habitants de la Serre, du Phare, de la Cour, du Dédale, du Casino et de
 *  la Tour de Verre ; Ondine, le Grand Rire, Thalie, 김 과장.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function G() { return YN.game; }
  var V_ONDINE = { wave: 'sine', pitch: 520, vary: 2, len: 50, vol: 0.03 };
  var V_RIRE = { wave: 'sawtooth', pitch: 240, vary: 9, len: 26, vol: 0.05 };
  var V_THALIE = { wave: 'triangle', pitch: 380, vary: 3, len: 28, vol: 0.05 };
  var V_KIM = { wave: 'triangle', pitch: 170, vary: 2, len: 40, vol: 0.05 };
  var GENTLE = ['hello', 'ondine', 'annyeong', '안녕', 'it s alright', 'its alright', 'it s all right', 'don t cry', 'dont cry', 'quietly', 'you re safe', 'youre safe',
    // anglais et coréen
    'hi', 'hey', 'it s ok', 'its ok', 'it s okay', 'its okay', 'okay', 'don t be afraid', 'dont be afraid', 'don t worry', 'dont worry', 'i m here', 'im here', 'it s me', 'its me',
    'gently', 'softly', 'for you', 'here you go', 'thank you', 'thanks', 'are you ok', 'are you okay', 'friend',
    '안녕하세요', '괜찮아', '괜찮아요', '무서워하지 마', '무서워하지마', '여기 있어', '나야', '고마워', '고마워요', '천천히', '너 줄게', '친구'];

  YN.defEntities([
    /* ---- Phare ---- */
    { id: 'N106', name: 'The Lighthouse Keeper', world: 'W029', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'old', head: 'cap', body: 'coat', c: ['#2a3a5a', '#1a2a4a', '#d8b898', '#2a3a5a'], eyes: 'closed', mouth: 'line', acc: 'lantern', h: 23 },
      lines: [{ t: 'I don’t light it anymore. I have no flame of my own left. You, maybe.', lang: 'en' },
        { t: 'The round moon pulls the water. When she is full, the bed at the bottom comes up a little. Just a little.', lang: 'en' },
        { t: 'Three lighthouses: here, one in the white, one in the waves. I saw them all lit only once.', lang: 'en' }],
      info: { role: 'Hints: light the lighthouses; the full-moon tide (W181).' } },

    /* ---- Cour ---- */
    { id: 'N009', name: 'Ondine', world: 'W030', kind: 'kid', role: 'major', major: true, behavior: 'static', solid: true, voice: V_ONDINE, hearDist: 3,
      look: { t: 'kid', head: 'round', hair: '#3a5a6a', hairStyle: 'long', body: 'dress', c: ['#a8c8d8', '#7a98a8', '#e8d8d0', '#3a5a6a'], eyes: 'down', mouth: 'line', acc: 'crane', h: 18 },
      hears: [
        { match: GENTLE, if: { item: { crane: 7 }, noEffect: 'E31' }, lines: [{ t: '…', who: 'Ondine' }, { t: 'seven. you found them all. even the one that fell in the lost-and-found box.', lang: 'en', who: 'Ondine' }, { t: 'She unfolds the seven cranes, folds them again into a single bigger one, and gives it to you.' }, { t: 'it knows how to jump over things. i don’t. not yet.', lang: 'en', who: 'Ondine' }], do: [{ item: { crane: -7 } }, { give: 'E31' }, { rel: { N009: 3 } }, { quest: { Q08: 'cranes' } }] },
        { match: GENTLE, lines: [{ t: 'You speak softly. The cubicle door opens a finger’s width.' }, { t: 'i lost my cranes. seven. in the school and in the yard. i need all seven to come out.', lang: 'en', who: 'Ondine' }], do: [{ rel: { N009: 1 } }, { quest: { Q08: 'met' } }] }
      ],
      lines: [{ if: { rel: { N009: 2 } }, seq: ['She folds a crane without looking at her hands.', { t: 'are they gone? the big one who laughs?', lang: 'en' }] }, 'Behind the door, someone is holding their breath. If you knock, she goes quiet. Perhaps you have to talk to her.'],
      info: { personality: 'Whispers, folds cranes, hides. Another child — or Sora herself.', wants: 'To be spoken to gently.', arc: 'Q08 The Playground', role: 'Crane puzzle (P031).' } },
    { id: 'N010', name: 'The Big Laugh', world: 'W030', kind: 'kid', role: 'major', major: true, behavior: 'mimic', solid: true, voice: V_RIRE, dialog: 'grandrire',
      look: { t: 'tall', head: 'round', hair: '#2a1a10', hairStyle: 'spiky', body: 'uniform', c: ['#3a3a6a', '#2a2a5a', '#f0c8a0', '#2a1a10'], eyes: 'wide', mouth: 'grin', h: 26 },
      info: { personality: 'Strong, cruel, nastily funny; imitates the others.', flaw: 'Learnt meanness; at home the TV is always on, and nobody is there.', wants: 'To be watched.', arc: 'Q08 The Playground', lore: 'As an adult, he shouts at his employees (W131).' } },
    { id: 'N107', name: 'A Bag-Head Child', world: 'W030', kind: 'kid', behavior: 'wander', radius: 4,
      look: { t: 'kid', head: 'bag', body: 'uniform', c: ['#3a3a6a', '#2a2a5a', '#f0c8a0', '#2a2a2a'], h: 18 },
      lines: [{ t: 'The mute girl? She asked for it.', lang: 'en' }, { t: 'We were just joking, that’s all. Everybody was laughing.', lang: 'en' }, { t: 'He said don’t talk to her. So we don’t talk to her.', lang: 'en' }, '… (he looks at his shoes).'],
      info: { belief: 'They say the mute girl “asked for it” (a collective lie).' } },
    { id: 'N108', name: 'The Monitor', world: 'W030', kind: 'adult', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#6a4a2a', hairStyle: 'bun', body: 'coat', c: ['#6a6a6a', '#4a4a4a', '#e0c0a0', '#6a4a2a'], eyes: 'closed', mouth: 'line', h: 24 },
      lines: ['Her eyes are closed and there is a whistle at her lips. She does not blow it.', { t: 'I didn’t see anything. I never see anything from here. That’s why they put me here.', lang: 'en' }] },

    /* ---- Dédale ---- */
    { id: 'N013', name: 'Thalie', world: 'W031', kind: 'kid', role: 'major', major: true, behavior: 'static', solid: true, voice: V_THALIE, dialog: 'thalie',
      look: { t: 'kid', head: 'round', hair: '#c88040', hairStyle: 'braids', body: 'shirt', c: ['#6a8a4a', '#4a6a2a', '#e8c0a0', '#c88040'], eyes: 'line', mouth: 'line', acc: 'map', h: 20 },
      info: { personality: 'Curt, competitive, looks down on “the new ones”.', habits: 'Marks the days on the wall.', flaw: 'Did nothing when they mocked the mute girl (same school).', wants: 'To get out.', arc: 'Q12 The Cartographer of the Maze', belief: 'Believes the Maze has a way out to “the real world”.' } },
    { id: 'N109', name: 'A Prowler', world: 'W031', kind: 'creature', behavior: 'chase', radius: 7, speed: 2.1, hostile: { kind: 'time', amount: 30 },
      look: { t: 'blob', c: ['#3a2a3a'], h: 18, many: true }, lines: ['…'],
      info: { role: 'At night, in the Maze: steals 30 s on contact.' } },
    { id: 'N110', name: 'The Runner', world: 'W031', kind: 'kid', behavior: 'wander', radius: 8, speed: 3.6,
      look: { t: 'kid', head: 'round', hair: '#1a1a1a', body: 'shirt', c: ['#c04040', '#902020', '#d8a880', '#1a1a1a'], eyes: 'wide', mouth: 'o', h: 19 },
      lines: [{ t: 'No time! The walls move when night falls in your room! Remember: at night, it’s not the same maze.', lang: 'en' }, { t: 'The beacon? North-east. Always north-east. Even when everything changes, it stays in its corner.', lang: 'en' }] },

    /* ---- Casino ---- */
    { id: 'N111', name: 'The Croupier', world: 'W032', kind: 'human', behavior: 'static', solid: true, lang: 'en',
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', body: 'suit', c: ['#1a1a1a', '#0a0a0a', '#e0c8b0', '#c8a040'], eyes: 'line', mouth: 'smile', h: 24 },
      lines: [{ t: 'Place your minutes, miss. The house always wins, but sometimes it gets bored.', lang: 'en' }, { t: 'Win a full minute and I’ll throw in a souvenir.', lang: 'en' }, { t: 'Under the table? Only small people go there.', lang: 'en' }] },
    { id: 'N112', name: 'The Gambler Without a Watch', world: 'W032', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'old', head: 'round', hair: '#9a9a9a', body: 'coat', c: ['#4a3a3a', '#2a1a1a', '#d8b898', '#9a9a9a'], eyes: 'sad', mouth: 'line', h: 23 },
      lines: [{ t: 'I gambled away all my hours. This one is all I have left. I’m keeping it for the end.', lang: 'en' }, { t: 'Don’t sell your cookies. They’re worth more than two minutes when someone catches up with you.', lang: 'en' }] },
    { id: 'N113', name: 'The Bellboy', world: 'W032', kind: 'kid', behavior: 'patrol', path: [[4, 6], [40, 6]], speed: 1.6, lang: 'en',
      look: { t: 'kid', head: 'cap', body: 'uniform', c: ['#a02030', '#801020', '#f0c8a0', '#c8a040'], eyes: 'dots', mouth: 'smile', acc: 'tray', h: 18 },
      lines: [{ t: 'Free drinks! They taste like the last minute of a dream.', lang: 'en' }] },
    { id: 'N114', name: 'The Lady with the Tokens', world: 'W032', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#d8c040', hairStyle: 'long', body: 'dress', c: ['#2a6a4a', '#1a4a2a', '#e8c8b0', '#d8c040'], eyes: 'closed', mouth: 'smile', h: 24 },
      lines: [{ t: 'Win three minutes and the red door opens. Me, I won two. Three times.', lang: 'en' }, { t: 'They never refund time. But you can win a little of it back.', lang: 'en' }] },

    /* ---- Tour de Verre ---- */
    { id: 'N011', name: '김 과장', world: 'W033', kind: 'human', role: 'major', major: true, behavior: 'static', solid: true, lang: 'ko-s', dialog: 'kim', voice: V_KIM,
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'closed', mouth: 'line', acc: 'coffee', h: 24 },
      info: { personality: 'Section chief, corporate Korean, sleeps standing up, drinks 아아.', flaw: 'Cannot say no.', wants: 'To get home before his daughter falls asleep.', arc: 'Q09 야근', lore: 'The grandfather. The photo on his desk: a little girl, name badge “미란”.' } },
    { id: 'N115', name: '이 대리', world: 'W033', kind: 'human', behavior: 'static', solid: true, lang: 'ko-s',
      look: { t: 'adult', head: 'round', hair: '#2a2a2a', hairStyle: 'long', body: 'shirt', c: ['#e8e8f0', '#c8c8d0', '#e8c8b0', '#2a2a2a'], eyes: 'line', mouth: 'line', h: 23 },
      lines: [{ t: '오늘도 야근이에요. 괜찮아요, 익숙해요.', lang: 'ko-s', tr: 'Overtime again tonight. It’s fine, I’m used to it.' }, { t: '과장님보다 먼저 퇴근하면 안 돼요.', lang: 'ko-s', tr: 'You mustn’t leave before the boss.' }] },
    { id: 'N116', name: '박 사원', world: 'W033', kind: 'human', behavior: 'static', solid: true, lang: 'ko-s',
      look: { t: 'adult', head: 'round', hair: '#3a2a1a', body: 'suit', c: ['#2a3a5a', '#1a2a4a', '#e0c0a0', '#3a2a1a'], eyes: 'closed', mouth: 'o', h: 24 },
      lines: [{ t: '…자는 거 아니에요. 눈만 감은 거예요.', lang: 'ko-s', tr: '…I’m not asleep. I’ve just got my eyes closed.' }, { t: '회식 가야 돼요. 빠지면 안 돼요.', lang: 'ko-s', tr: 'We have to go to the team dinner. You can’t skip it.' }] },
    { id: 'N117', name: 'The Office Drone', world: 'W033', kind: 'robot', behavior: 'orbit', radius: 3, speed: 2, solid: false,
      look: { t: 'humanoid', head: 'eye', body: 'none', legs: false, arms: false, c: ['#c8ccd4', '#c8ccd4', '#c8ccd4', '#40e0ff'], h: 14 },
      lines: [{ t: '업무 효율 측정 중입니다.', lang: 'ko-s', tr: 'Measuring work efficiency.' }] },
    { id: 'N118', name: 'The Intern', world: 'W033', kind: 'human', behavior: 'wander', radius: 3, lang: 'ko-s',
      look: { t: 'adult', head: 'round', hair: '#1a1a1a', hairStyle: 'short', body: 'shirt', c: ['#f0e8d8', '#d0c8b8', '#e8c8b0', '#1a1a1a'], eyes: 'wide', mouth: 'line', acc: 'tablet', h: 22 },
      lines: [{ t: '저… 학원도 끝나고 여기 와요. 밤 열두 시까지.', lang: 'ko-s', tr: 'I… come here after 학원, too. Until midnight.' }, { t: '빨리빨리. 다들 빨리빨리 해요.', lang: 'ko-s', tr: 'Quick, quick. Everybody does everything quick, quick.' }] }
  ]);

  /* ---------------- le Grand Rire ---------------- */
  YN.defDialogue('grandrire', {
    who: 'The Big Laugh', voice: V_RIRE,
    branches: [
      { once: 'first', lines: [{ t: 'HA! The mute girl! She can walk!', lang: 'en' }, { t: 'Say something. Come on. Say something.', lang: 'en' }, { t: '… Nothing? HAHA. Nothing. Like always.', lang: 'en' }] },
      { if: { effect: 'E16', equipped: 'E16' }, lines: ['He looks at you and does not recognise you behind the mask.', { t: 'Who are you? You new?', lang: 'en' }, { t: 'Watch out for the mute girl. She stares at everybody. It’s creepy.', lang: 'en' }] },
      { if: { rel: { N009: 3 } }, lines: [{ t: 'Ondine came out? …', lang: 'en' }, 'He does not laugh.', { t: 'At home the TV is always on. There are always people laughing inside it. So I laugh louder.', lang: 'en' }], do: [{ quest: { Q08: 'laughter' } }] },
      { lines: [{ t: function () { return ['He repeats what you did, bigger, stupider. The bag-head children laugh.', { t: 'HAHA. You gonna cry? Don’t cry. Doesn’t work here.', lang: 'en' }, { t: 'What’s your name again? Oh right. Nobody calls you anything.', lang: 'en' }, { t: 'Nobody’s watching. Nobody ever watches. So I make noise.', lang: 'en' }][Math.floor(Math.random() * 4)]; } }] }
    ]
  });

  /* ---------------- Thalie ---------------- */
  YN.defDialogue('thalie', {
    who: 'Thalie', voice: V_THALIE,
    branches: [
      { once: 'first', lines: [{ t: 'Another new girl.', lang: 'en' }, { t: 'Rule one: no running at night. Rule two: don’t ask my name. Rule three: you map, or you leave.', lang: 'en' }, { t: 'I’m Thalie. There. Rule two, broken.', lang: 'en' }] },
      { if: { effect: 'E29' }, lines: [{ t: 'You’ve got the compass. It always points to the way out. Problem is, the way out goes down.', lang: 'en' }, { t: 'Me, I’m staying. Someone has to hold the camp.', lang: 'en' }] },
      { if: { temp: { mazeMapped: true }, phase: ['opening', 'middle'] }, lines: [{ t: 'Show me. …Not bad. For a new girl.', lang: 'en' }, { t: 'Here. It was mine. It shows the way out. Don’t follow it too fast.', lang: 'en' }], do: [{ give: 'E29' }, { rel: { N013: 3 } }, { quest: { Q12: 'map1' } }] },
      { if: { temp: { mazeMapped: true } }, lines: [{ t: 'Too late. It’s night in your head, I can tell. Maps made at night are worth nothing by day.', lang: 'en' }, { t: 'Come back tomorrow. Earlier.', lang: 'en' }] },
      { if: { temp: { mazeMapping: true } }, lines: [{ t: 'The north-east beacon. Touch it, come back. Before the end. Before you get tired.', lang: 'en' }] },
      { lines: [{ t: 'Want to be useful? Take this.', lang: 'en' }, 'She hands you a blank map.', { t: 'The north-east sector. Go to the beacon, come back before night — before your time drops under four tenths.', lang: 'en' }], do: [{ temp: { mazeMapping: true } }] }
    ]
  });

  /* ---------------- 김 과장 ---------------- */
  YN.defDialogue('kim', {
    who: '김 과장', voice: V_KIM,
    branches: [
      { once: 'first', lines: [{ t: '…아, 죄송합니다. 잠깐 졸았네요.', lang: 'ko-s', tr: '…Ah, sorry. I dozed off for a moment.' }, { t: '수고하셨습니다. 아직 퇴근 안 하셨어요?', lang: 'ko-s', tr: 'Thank you for your hard work. You haven’t gone home yet?' }] },
      { if: { realTime: ['12:00', '13:00'] }, lines: [{ t: '점심시간이에요. 저는 안 먹어요. 시간 없어요.', lang: 'ko-s', tr: 'It’s lunch break. I don’t eat. No time.' }] },
      { if: { talks: { N011: 3 } }, once: 'daughter', lines: [{ t: '우리 딸이… 자기 전에 들어가야 하는데.', lang: 'ko-s', tr: 'My daughter… I ought to get home before she falls asleep.' }, { t: '매일 그렇게 생각해요. 매일 열두 시가 넘어요.', lang: 'ko-s', tr: 'I think that every day. Every day, it’s past midnight.' }], do: [{ quest: { Q09: 'daughter' } }] },
      { if: { quest: { Q09: 'daughter' } }, lines: [{ t: '아니요라고 말하는 법을 몰라요. 한 번도 안 해봤어요.', lang: 'ko-s', tr: 'I don’t know how to say no. I’ve never tried.' }] },
      { lines: [{ t: function () { return [{ t: '아아 한 잔 더요.', lang: 'ko-s', tr: 'Another iced Americano, please.' }, { t: '네, 네, 알겠습니다. 바로 하겠습니다.', lang: 'ko-s', tr: 'Yes, yes, understood. I’ll get on it right away.' }, { t: '괜찮습니다. 저는 괜찮습니다.', lang: 'ko-s', tr: 'I’m fine. Me, I’m fine.' }, { t: '내일 아침 회의 자료… 오늘 밤에…', lang: 'ko-s', tr: 'The papers for tomorrow morning’s meeting… tonight…' }][Math.floor(Math.random() * 4)]; }, lang: 'ko-s' }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
