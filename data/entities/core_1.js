/* =========================================================================
 *  Habitants de la Gare, de la Ville au crépuscule, de l'École vide et du
 *  Monde mono ; Toc-Toc (qui est partout) et M. Ahn.
 *  Langues : M. Ahn parle le coréen du Nord d’avant 1951 ; Toc-Toc et les
 *  autres habitants parlent anglais. Narration en français.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  function G() { return YN.game; }
  var V_AHN = { wave: 'triangle', pitch: 190, vary: 2, len: 70, vol: 0.06 };
  var V_TOC = { wave: 'square', pitch: 420, vary: 8, len: 30, vol: 0.035 };

  YN.defEntities([
    /* ---------------- M. Ahn ---------------- */
    { id: 'N002', name: 'Mr. Ahn', world: 'W002', kind: 'human', role: 'major', major: true, behavior: 'static', dialog: 'ahn', voice: V_AHN, lang: 'ko-n',
      look: { t: 'old', head: 'round', hair: '#d8d8d0', hairStyle: 'short', body: 'coat', c: ['#3a3a48', '#2a2a34', '#e8c8a8', '#202030'], eyes: 'closed', mouth: 'line', acc: 'suitcase', h: 24 },
      hears: [{ any: true, if: { noEffect: 'E08' }, do: [{ fn: function (ctx) {
        var t = String(ctx.said || '');
        if (/\d/.test(t) || /(o.?clock|\bhours?\b|midnight|noon|midday|half past|quarter|\btime\b|시|자정|정오)/i.test(t)) {
          var said = t.replace(/[<>]/g, '');
          YN.ui.dialog.queue([{ t: '아… ' + said + '… 고맙습니다, 아가씨. 이제는 아무도 저한테 시간을 알려 주지 않습니다.', lang: 'ko-n', tr: 'Oh. ' + said + '… Thank you, miss. Nobody tells me the time any more.', who: 'Mr. Ahn' }, { t: '받으십시오. 저한테는 필요 없을 겁니다. 제 렬차가 조금 늦어질 뿐이니까요.', lang: 'ko-n', tr: 'Please, take it. I shan’t be needing it. My train is only running a little late.', who: 'Mr. Ahn' }], {}, function () { G().giveEffect('E08'); YN.save.addRel('N002', 2); });
        } else YN.speech.npcBubble(ctx.ent, { t: '죄송합니다만… 시간 말입니다, 아가씨. 몇 시인지 여쭈었습니다.', lang: 'ko-n', tr: 'Forgive me… The time, miss. I was asking the time.' });
      } }] }],
      info: { personality: 'Old man in a coat, polite to the point of vanishing. Speaks the North Korean of before 1951, very ceremonious. Apologises for everything.', habits: 'Polishes his shoes with his handkerchief. Watches the clock, never the platform.', flaw: 'Denial, stubbornness: the train has been “running a little late” since 1951.', wants: 'To see his little sister, Ok-sun, again.', arc: 'Q01 The Last Passenger', relations: 'Ri Myong-hui knows his name; he does not recognise her.' } },

    /* ---------------- Toc-Toc, partout ---------------- */
    { id: 'N007', name: 'Knock-Knock', kind: 'human', role: 'major', major: true, behavior: 'wander', radius: 2, speed: 2.4, dialog: 'toctoc', voice: V_TOC,
      worlds: { W001: { at: [30, 30], appear: { dreamChance: { p: 0.25, key: 'toc1' } } }, W008: { at: 'T', appear: { dreamChance: { p: 0.4, key: 'toc8' } } }, W015: { at: 'T', appear: { dreamChance: { p: 0.5, key: 'toc15' } } }, W020: { at: 'T' } },
      look: { t: 'humanoid', head: 'doorbell', body: 'suit', c: ['#8a2a3a', '#5a1a2a', '#e8c8a8', '#f0d040'], eyes: 'wide', mouth: 'grin', acc: 'bag', h: 23 },
      reacts: { E39: { lines: [{ t: 'Boss! You’re laughing! Finally somebody who gets the punchline!', lang: 'en' }, { t: '… What punchline?', lang: 'en' }] } },
      info: { personality: 'Doorbell-headed hawker. Street pedlar’s patter in English, rhymes, malapropisms, calls everyone “Boss”. Knocks on anything that looks like a door.', habits: 'Knocks twice before speaking.', flaw: 'Never finishes anything, lies about his successes.', wants: 'To make “the Spectator” laugh.', arc: 'Q06 Knock-Knock and the Grand Show', lore: 'The father’s jokes. The last one never had a punchline.' } },

    /* ---------------- la gare ---------------- */
    { id: 'N030', name: 'The Stationmaster', world: 'W002', kind: 'robot', behavior: 'patrol', path: [[40, 7], [40, 10], [30, 10], [30, 7]], speed: 1.4,
      look: { t: 'robot', head: 'clock', body: 'uniform', c: ['#2a3a6a', '#1a2a4a', '#c8c8d0', '#d0b040'], h: 26 },
      lines: [{ t: 'Beep. The 23:71 line has never existed. Beep.', lang: 'en' }, { t: 'Beep. Timetables are posted. Timetables are always posted.', lang: 'en' }, { t: 'Beep. No running on the platforms. No sitting on the tracks. No waiting longer than sixty years.', lang: 'en' }, { if: { remainingLt: 120 }, t: 'Beep. Last train. Beep. There is always a last train.', lang: 'en' }],
      info: { role: 'Sincerely believes the 23:71 line does not exist (it is off the timetable).' } },
    { id: 'N031', name: 'The Lady with the Broom', world: 'W002', kind: 'human', behavior: 'wander', radius: 3, speed: 0.8,
      look: { t: 'adult', head: 'round', hair: '#3a2a20', hairStyle: 'bun', body: 'apron', c: ['#6a8a7a', '#4a6a5a', '#e0b898', '#d8d0c0'], eyes: 'down', mouth: 'line', acc: 'broom', h: 22 },
      lines: ['She sweeps the same tile. Again.', { t: 'We clean before people arrive. People never arrive. We clean anyway.', lang: 'en' }, { t: '수고하셨습니다… 아, 아니다. 죄송해요. 안녕히 주무세요.', lang: 'ko-s', tr: 'Thank you for your hard work… oh, no. Sorry. Sleep well.' }, { if: { dark: true }, t: 'When the light goes out at your place, the neon here flickers. You see the marks better.', lang: 'en' }],
      info: { role: 'Atmosphere. A night worker, like the mother; a word of Korean slips out.' } },
    { id: 'N032', name: 'The Faceless Traveller', world: 'W002', kind: 'shadow', behavior: 'static', solid: true,
      look: { t: 'shadow', c: ['#1a1a24'], h: 24 },
      lines: ['…', 'He holds a white ticket. When you look at it, he hides it.', { if: { effect: 'E08' }, seq: ['He looks at your ticket. He nods.', { t: 'Track A. Backwards. Always backwards.', lang: 'en' }] }],
      info: { role: 'Hint for the Endless Carriage (walk towards the back).' } },
    { id: 'N033', name: 'The Announcement Voice', world: 'W002', kind: 'voice', behavior: 'static', invisible: true, lang: 'en',
      ambientLines: [{ t: '“Ladies and gentlemen, the 23:71 train is running slightly late.”', lang: 'en' }, { t: '“Passengers are reminded not to leave children unattended.”', lang: 'en' }, { t: '“The white train on track B serves the Glass City. 감사합니다.”', lang: 'en' }, { t: '“Passengers bound for Happiness are kindly asked to go down.”', lang: 'en' }], hearDist: 30, ambientEvery: 18,
      look: { t: 'voice' }, info: { role: 'Announcements: every destination is spoken.' } },

    /* ---------------- la ville au crépuscule ---------------- */
    { id: 'N034', name: 'The Black Cat', world: 'W003', kind: 'animal', behavior: 'runner', path: [[12, 12], [29, 12], [29, 26]], speed: 2.2, solid: false, talkable: true,
      look: { t: 'cat', c: ['#141418', '#e8d040'], h: 14 },
      lines: [{ if: { remainingGt: 240 }, t: 'The black cat looks at you, yawns, and does not move. It is waiting for something.' }, 'It takes three steps, turns round. Coming?'],
      info: { role: 'Cat puzzle (P019): under 4:00, it leads to the cats’ meeting.' } },
    { id: 'N035', name: 'The Man with the Newspaper', world: 'W003', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'adult', head: 'round', hair: '#2a2a2a', body: 'coat', c: ['#5a4a3a', '#3a2a20', '#e0c0a0', '#2a2a2a'], eyes: 'dots', mouth: 'line', acc: 'newspaper', h: 24 },
      lines: ['He reads a newspaper with no letters.', { t: 'Children walk home alone now. It’s more practical.', lang: 'en' }, { if: { phase: 'middle' }, t: 'It is raining. He does not move. The newspaper does not get wet.' }, { t: 'The drains give back what they take. But only when it rains.', lang: 'en' }],
      info: { role: 'Hint for the Umbrella (P006).' } },
    { id: 'N036', name: 'The Child with the Balloon', world: 'W003', kind: 'kid', behavior: 'wander', radius: 3,
      look: { t: 'kid', head: 'round', hair: '#5a3a20', hairStyle: 'short', body: 'shirt', c: ['#c04040', '#3a3a6a', '#f0c8a0', '#5a3a20'], eyes: 'dots', mouth: 'smile', acc: 'balloon', h: 18 },
      lines: [{ t: 'The funfair’s closed. But the mime isn’t closed.', lang: 'en' }, { t: 'He makes moves. If you copy them, he’s happy.', lang: 'en' }, { t: 'I don’t copy them. Mimes scare me.', lang: 'en' }],
      info: { role: 'Hint for the Balloon (W020).' } },
    { id: 'N037', name: 'The Old Woman with the Pigeons', world: 'W003', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'old', head: 'round', hair: '#e0e0e0', hairStyle: 'bun', body: 'dress', c: ['#5a5a7a', '#3a3a5a', '#e8c8b0', '#e0e0e0'], eyes: 'closed', mouth: 'smile', h: 21 },
      lines: [{ t: 'The pigeons don’t come any more. I feed them anyway.', lang: 'en' }, { t: 'The cats, now, they meet at the end. Always at the end. The sky has to be nearly black.', lang: 'en' }, { t: '할머니도 그랬어. 비둘기한테.', lang: 'ko-s', tr: 'Grandma used to do that too. For the pigeons.' }],
      info: { role: 'Hint for the Cat: “at the end”.' } },

    /* ---------------- l'école ---------------- */
    { id: 'N038', name: 'The Caretaker', world: 'W004', kind: 'human', behavior: 'patrol', path: [[3, 17], [48, 17]], speed: 1.1, pause: 2,
      look: { t: 'adult', head: 'cap', body: 'uniform', c: ['#4a4a3a', '#3a3a2a', '#d8b898', '#3a4a3a'], eyes: 'dots', mouth: 'line', acc: 'keys', h: 24 },
      lines: [{ t: 'We’re closing. We’re always closing. And then nobody comes to close.', lang: 'en' }, { t: 'The third classroom? We repainted it. The signs come back.', lang: 'en' }, { t: 'Don’t run in the corridor. It wakes the lockers.', lang: 'en' }, { if: { weekday: 0 }, t: 'Sundays we’re closed. You’re not here. Neither am I.', lang: 'en' }],
      info: { role: 'Atmosphere; mentions the writing that comes back.' } },
    { id: 'N039', name: 'The Transparent Pupil', world: 'W004', kind: 'ghost', behavior: 'wander', radius: 4, alpha: 0.55, solid: false, talkable: true,
      look: { t: 'ghost', c: ['rgba(200,210,240,0.55)'], h: 20 },
      lines: [{ t: 'Looking for your seat? It’s carved. Everybody knows where it is.', lang: 'en' }, { t: 'We never heard you. So we stopped listening.', lang: 'en' }, { t: 'Sit down. Just once.', lang: 'en' }],
      info: { role: 'Hint for the Chalk (the carved desk).' } },
    { id: 'N040', name: 'The Mannequin Teacher', world: 'W004', kind: 'human', behavior: 'statue', solid: true,
      look: { t: 'mannequin', head: 'round', body: 'dress', c: ['#8a6a8a', '#6a4a6a', '#e8d8c8', '#e8d8c8'], eyes: 'none', mouth: 'none', h: 25 },
      lines: [{ seq: ['She has a finger to her lips.', { t: 'Shh.', lang: 'en' }] }, { seq: ['On her smock, a label.', { t: 'Speak only when spoken to.', lang: 'en' }] }],
      info: { role: 'Only moves when nobody is looking at her (“statue” behaviour).' } },
    { id: 'N041', name: 'The Crane Boy', world: 'W004', kind: 'kid', behavior: 'static', solid: true,
      look: { t: 'kid', head: 'round', hair: '#1a1a1a', hairStyle: 'short', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1a1a'], eyes: 'sad', mouth: 'line', acc: 'crane', h: 18 },
      lines: [{ t: 'She folds cranes, the girl in the toilets. She drops them everywhere. In the yard, in here.', lang: 'en' }, { t: 'Seven. She says it takes seven to come out.', lang: 'en' }, { t: 'Talk to her softly. The others shout.', lang: 'en' }],
      info: { role: 'Hint for Ondine’s quest (Q08, Paper Crane).' } },

    /* ---------------- monde mono ---------------- */
    { id: 'N042', name: 'The Negative', world: 'W005', kind: 'shadow', behavior: 'mimic', solid: true,
      look: { t: 'humanoid', head: 'round', body: 'dress', c: ['#f0f0f0', '#101010', '#101010', '#f0f0f0'], eyes: 'dots', mouth: 'none', h: 22 },
      lines: ['He does everything you do, in reverse.', 'When you speak, he opens his mouth, but in white.'],
      info: { role: 'Imitates the player (a mirror). Atmosphere.' } },
    { id: 'N043', name: 'The Checkerboard Lady', world: 'W005', kind: 'human', behavior: 'static', solid: true,
      look: { t: 'tall', head: 'square', body: 'robe', c: ['#101010', '#f0f0f0', '#f0f0f0', '#101010'], eyes: 'x', mouth: 'line', h: 30 },
      lines: [{ t: 'Black. White. Black. White. Don’t stop on the grey, it doesn’t exist.', lang: 'en' }, { t: 'The telephone rings in the desert, on the other side of the door. Pick up in order.', lang: 'en' }, { if: { dark: true }, t: 'You turned it off? Then everything flips. Even what was good.', lang: 'en' }],
      info: { role: 'Hint for the Telephone (desert, order of the rings).' } },
    { id: 'N044', name: 'The Dot', world: 'W005', kind: 'creature', behavior: 'orbit', radius: 2, speed: 1.6, solid: false,
      look: { t: 'blob', c: ['#101010'], h: 10 },
      lines: ['A dot. It goes round and round. It seems to have forgotten the sentence it was ending.'],
      info: { role: 'Atmosphere.' } }
  ]);

  /* ---------------- dialogue de M. Ahn (coréen du Nord d’avant, très poli) ---------------- */
  YN.defDialogue('ahn', {
    who: 'Mr. Ahn', voice: V_AHN,
    branches: [
      { once: 'first', lines: [{ t: '아이고, 죄송합니다, 아가씨. 오시는 소리를 못 들었습니다.', lang: 'ko-n', tr: 'Oh dear. Forgive me, miss. I did not hear you coming.' }, { t: '스물세 시 칠십일 분 렬차가 조금 늦어지고 있습니다.', lang: 'ko-n', tr: 'The twenty-three seventy-one train is running a little late.' }, { t: '아주 조금 말입니다.', lang: 'ko-n', tr: 'Only a very little.' }], do: [{ rel: { N002: 1 } }] },
      { if: { witchHere: true }, lines: [{ t: '쉿. 승강장에 누가 기다리고 있습니다. 렬차를 기다리는 사람이 아닙니다.', lang: 'ko-n', tr: 'Hush. Someone is waiting on the platform who is not waiting for the train.' }] },
      { if: { priestessHere: true }, lines: ['…', { t: '다 좋습니다. 다 좋지요, 그렇지요?', lang: 'ko-n', tr: 'All is well. All is well, isn’t it?' }, { t: '괜찮아요… 괜찮아요.', lang: 'ko-n', tr: 'It’s fine… it’s fine.' }] },
      { if: { realHour: [23, 24] }, lines: [{ t: '스물세 시하고, 먼지가 조금 지났습니다.', lang: 'ko-n', tr: 'It is twenty-three hundred, and a little dust past.' }, { t: '먼지가 아주 많습니다. 이제는 아무도 쓸지 않습니다.', lang: 'ko-n', tr: 'A great deal of dust. Nobody sweeps it any more.' }, { t: '이 시간에는 다른 렬차가 지나갑니다, 아래로. 하지만 늙은이를 위해서는 서지 않습니다.', lang: 'ko-n', tr: 'At this hour another train goes by, down below. But it does not stop for old men.' }] },
      { if: { realTime: ['00:11', '00:20'] }, once: 'q01t', lines: [{ t: '…들리십니까?', lang: 'ko-n', tr: '…Do you hear it?' }, { t: '스물세 시 칠십일 분. 넘쳐 버린 시간입니다.', lang: 'ko-n', tr: 'Twenty-three seventy-one. An hour that has overflowed.' }, { t: '옵니다. 정말로 옵니다.', lang: 'ko-n', tr: 'It is coming. It is really coming.' }], do: [{ quest: { Q01: 'heard' } }] },
      { if: { item: { ticketstub: 1 } }, once: 'stub', lines: [{ t: '이 표 쪼가리… 23:71.', lang: 'ko-n', tr: 'This stub. 23:71.' }, { t: '제 것이었습니다. 너무 일찍 찍어 버렸지요, 죄송스럽게도. 어머니께서 늘 말씀하셨습니다. 표는 렬차가 와 있을 때 찍는 거라고.', lang: 'ko-n', tr: 'It was mine. I punched it too early, you see. My mother always said: you punch your ticket when the train is there.' }, { t: '가지고 계십시오. 기다리는 사람들한테 복을 가져다줍니다.', lang: 'ko-n', tr: 'Keep it. It brings luck to people who wait.' }], do: [{ rel: { N002: 2 } }, { quest: { Q01: 'stub' } }] },
      { if: { item: { shoe: 1 } }, once: 'shoe', lines: [{ t: '이 신발은…', lang: 'ko-n', tr: 'This shoe…' }, { t: '옥순이. 승강장에서 한 짝을 잃어버렸습니다. 왼쪽 것을. 저 때문이 아니라 신발 때문에 울었지요.', lang: 'ko-n', tr: 'Ok-sun. She lost one on the platform. The left one. She cried for the shoe, not for me.' }, { t: '제가 그랬습니다. 다음 렬차로 돌아오마고.', lang: 'ko-n', tr: 'I told her: I will come back on the next train.' }], do: [{ rel: { N002: 3 } }, { quest: { Q01: 'shoe' } }] },
      { if: { noEffect: 'E08' }, lines: [{ t: '실례지만… 지금 몇 시입니까, 아가씨?', lang: 'ko-n', tr: 'Excuse me… would you have the time, miss?' }, { t: '그냥 말씀만 해 주십시오. 소리 내어서. 여기 시계들은 거짓말을 합니다.', lang: 'ko-n', tr: 'Just tell me, please. Out loud. The clocks here lie.' }, 'He points at the clock in the hall, shakes his head, then points at your mouth. He is waiting for you to say a time, out loud.'] },
      { if: { talks: { N002: 4 } }, once: 'sister', lines: [{ t: '제 누이동생을 기다립니다. 옥순이를.', lang: 'ko-n', tr: 'I am waiting for my little sister. Ok-sun.' }, { t: '아홉 살이었습니다. 지금쯤이면… 아닙니다. 승강장에서는 언제나 아홉 살입니다.', lang: 'ko-n', tr: 'She was nine. By now she must be… no. On the platform, she is always nine.' }, { t: '렬차가 반대편에 섰습니다. 어느 한쪽을 골라야 했지요.', lang: 'ko-n', tr: 'The train stopped on the other side. One had to choose a side.' }] },
      { if: { effect: 'E38' }, lines: [{ t: '아가씨 시계에 바늘이 없군요. 잘됐습니다. 이제는 거짓말을 안 하겠지요.', lang: 'ko-n', tr: 'Your watch has no hands, miss. Good. Now it will not lie.' }] },
      { lines: [{ t: function () { return [
        { t: '구두를 닦습니다. 누구를 다시 만나게 될지 모르니까요.', lang: 'ko-n', tr: 'I polish my shoes. One never knows whom one will see again.' },
        { t: 'A선 렬차들은 가끔 뒤로 갑니다. 거슬러 걸어야 합니다.', lang: 'ko-n', tr: 'The trains on track A go backwards, sometimes. You must walk against them.' },
        { t: '저 계단은 모든 것이 좋은 나라로 내려간다고 합니다. 자주 들었습니다.', lang: 'ko-n', tr: 'They say that staircase goes down to a country where all is well. I have often been told so.' },
        { t: '빗자루 든 아주머니한테 표를 맡기지 마십시오. 그걸로 승강장을 쓸어 버릴 겁니다.', lang: 'ko-n', tr: 'Do not leave your ticket with the lady with the broom. She would sweep the platform with it.' },
        { t: '일없습니다. 우리 고향에서는 그렇게 말했습니다.', lang: 'ko-n', tr: 'Never mind. That is what we used to say, back home.' }
      ][Math.floor(Math.random() * 5)]; } }] }
    ]
  });

  /* ---------------- dialogue de Toc-Toc (boniment anglais) ---------------- */
  YN.defDialogue('toctoc', {
    who: 'Knock-Knock', voice: V_TOC,
    branches: [
      { once: 'first', lines: [{ t: 'Knock knock!', lang: 'en' }, { t: '… Who’s there? You’re supposed to say “who’s there”, Boss!', lang: 'en' }, { t: 'Right. Knock-Knock, travelling salesman, salesman travelling, I’ve got everything that’s good for nothing and a little of what’s good for something.', lang: 'en' }, { t: 'Drop by whenever, I’m everywhere and nowhere, mostly nowhere.', lang: 'en' }] },
      { if: { witchHere: true }, lines: [{ t: 'Shhhh. Difficult customer. Shop’s shut, shop reopens after.', lang: 'en' }] },
      { if: { noEffect: 'E06', fn: function () { return YN.save.cookies() > 0; } }, lines: [{ t: 'Umbrella, Boss? Red, waterproof, guaranteed against other people’s rain.', lang: 'en' }, { t: 'For one cookie. Just the one. I love cookies, they never talk back.', lang: 'en' }],
        choices: [{ t: 'Trade a biscuit', do: [{ fn: function () { if (YN.save.useCookie()) { YN.ui.hud.refresh(); G().giveEffect('E06'); } } }], lines: [{ t: 'Deal! One umbrella, one umbrellum, whatever, it opens.', lang: 'en' }] }, { t: 'No, thanks', lines: [{ t: 'Rain check, then. Ha. Rain check.', lang: 'en' }] }] },
      { if: { effect: 'E39' }, lines: [{ t: 'You laughed! I heard it all the way over here, and here is far!', lang: 'en' }] },
      { if: { talks: { N007: 5 } }, once: 'show', lines: [{ t: 'I’m putting on a show. The Grand Show. For the Spectator.', lang: 'en' }, { t: 'She never laughs. She watches the door.', lang: 'en' }, { t: 'I’m missing the end of the joke. Lost it somewhere. A suitcase, I think. A suitcase with a J on it.', lang: 'en' }], do: [{ quest: { Q06: 'met' } }] },
      { lines: [{ t: function () { return [
        { t: 'Knock knock. — Who’s there? — Nobody. — Nobody who? — … I forget the rest.', lang: 'en' },
        { t: 'Knock knock. — Who’s there? — Time. — Time who? — Time for bed, Boss. It’s time.', lang: 'en' },
        { t: 'I knocked on every door in town. Only one answered. It said: “not now”.', lang: 'en' },
        { t: 'Witches don’t like jokes. Except the Copycat: she repeats them, but backwards. Ruins everything.', lang: 'en' },
        { t: 'Free advice, so worthless: don’t run on the brown leaves. They gossip.', lang: 'en' },
        { t: 'I knew a gentleman who left with a suitcase. He told jokes. He left anyway.', lang: 'en' }
      ][Math.floor(Math.random() * 6)]; } }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
