/* =========================================================================
 *  MONDES SECRETS (2/8) — W061 à W080
 *  Ville de Verre (sud) : hagwon, PC방, supérette, métro, appartements,
 *  livreur, karaoké, pont, écrans, drones. Le Bonheur (nord) : défilé,
 *  village modèle, école, champs, portraits, monument, frontière, pont,
 *  quai des adieux. Le dépôt des trains fantômes.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, K = YN.kit, S = YN.kit.secret;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e0c0a0', '#1a1a1a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  /* une âme : elle dit son fragment une fois, puis se défait */
  function SOUL(lines, at) { return { type: 'soul', at: at || 'random-any', lines: lines }; }
  var SK = K.LOOK.sk, NK = K.LOOK.nk;

  /* W061 — Le Hagwon du soir */
  S({ id: 'W061', name: 'The Evening Hagwon', depth: 2, tier: 'mid', back: 'W033', backArrive: 'hagwon',
    map: (function () { var g = K.grid(36, 22, ' '); g.box(0, 0, 36, 22, '#', '.'); for (var y = 5; y < 19; y += 3) for (var x = 4; x < 32; x += 3) g.set(x, y, '{'); return g.rows(); })(),
    look: Object.assign({}, SK, { floor: { p: 'tile', c: ['#d0d4dc', '#a0a8b4'] } }), tall: { '{': { look: 'schooldesk' } }, style: { tallWalls: true }, music: 'hagwon', amb: { type: 'clock', vol: 0.06 },
    doors: [{ to: 'W064', look: 'door', opt: { style: 'metal', c: ['#e0e040'] }, label: 'exit to the metro' }],
    decor: [{ look: 'book', n: 3, opt: { c: ['#f0f0f0', '#c03030'] }, lines: ['In the margin of an exercise book, in pencil: “1 → 7”.', 'In the margin: “2 → the moon”.', 'In the margin: “3 → nobody”. Someone has underlined it three times.'] }, { look: 'board', opt: { lines: ['수학 22:00', '영어 23:00', '시험 00:00'], color: '#f0f040' }, lines: [KS('수학 22:00 · 영어 23:00 · 시험 00:00', 'Maths 22:00 · English 23:00 · Exam 00:00')] }],
    place: [{ id: 'exam', type: 'decor', at: [18, 2], look: 'desk', lookOpt: { book: true }, lines: ['The midnight exam paper.'] },
      SOUL([KS('밤 열 시에 학원 버스가 와. 집에 가면 엄마는 벌써 자고 있어.', 'At ten at night, the hagwon bus comes. When I get home, Mum is already asleep.')]),
      SOUL([KS('일등 해야 돼. 그래야 엄마가 웃어.', 'I have to come first. Only then does Mum smile.')]),
      SOUL(['A soul in uniform, head resting on a desk.', KS('시험 끝나면 뭐 하고 싶어? …자고 싶어. 그냥 자고 싶어.', 'What do you want to do after the exam? …Sleep. I just want to sleep.')])],
    effect: { id: 'E58', how: 'mech', mech: { type: 'quiz', mark: 'exam', intro: ['The midnight exam. Three questions. The invigilator is asleep.'], questions: [{ q: '1. 3 + 4 = ?', choices: ['5', '7', '12'], right: 1 }, { q: '2. What comes back every night without being called?', choices: ['The sun', 'The moon', 'Dad'], right: 1 }, { q: '3. Who is waiting at home?', choices: ['Mum', 'The cat', 'Nobody'], right: 2 }], winLines: ['A mark writes itself in red, all on its own: 100. The invigilator’s red pen rolls over to you.'], failLine: 'The invigilator’s red pen crosses out your paper. Start again.' } },
    npcs: [{ name: 'The Sleeping Invigilator', look: H({ t: 'adult', body: 'suit', eyes: 'closed', acc: 'clipboard' }), behavior: 'static', solid: true, lines: [KS('…조용히 해. 시험 중이야.', '…Quiet. There’s an exam on.')] }, { name: 'A Pupil Revising', count: 4, look: H({ t: 'kid', hairStyle: 'long', body: 'uniform', c: ['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1a1a'], eyes: 'down', acc: 'book' }), behavior: 'static', solid: true, lines: [KS('밤 열두 시까지 해야 돼. 엄마가 기다려.', 'I have to keep going until midnight. Mum is waiting.'), KS('졸리면 안 돼. 졸리면 지는 거야.', 'You can’t get sleepy. Getting sleepy means losing.'), 'In the margin, very small, she writes that she wants to sleep.'] }],
    info: { summary: 'An evening cram-school classroom (학원) full of pupils revising until midnight.', rules: ['Answering the three questions of the midnight exam correctly (the answers are in the margins) gives the Red Pen (E58).'], lore: 'The 학원 after school, until midnight: Mi-ran’s childhood, or the one that was planned for her.' } });

  /* W062 — La PC방 */
  S({ id: 'W062', name: 'The PC방', depth: 2, tier: 'mid', back: 'W033', backArrive: 'pcbang',
    map: (function () { var g = K.grid(38, 24, ' '); g.box(0, 0, 38, 24, '#', '.'); for (var y = 4; y < 21; y += 4) for (var x = 3; x < 35; x += 3) g.set(x, y, '{'); return g.rows(); })(),
    look: K.LOOK.neon, tall: { '{': { look: 'monitor', opt: { c: ['#101828'] } } }, style: { tallWalls: true }, music: 'pcbang', amb: { type: 'arcade', vol: 0.05 }, dark: 0.7,
    doors: [{ to: 'W063', look: 'door', opt: { style: 'glass', c: ['#40e0a0'] }, label: 'to the convenience store' }, { to: 'W069', look: 'door', opt: { style: 'metal', c: ['#202030'] }, label: 'a door behind the screens' }],
    npcs: [{ id: 'N210', name: 'The Player at Seat 44', look: H({ t: 'adult', head: 'round', body: 'shirt', c: ['#2a2a2a', '#1a1a1a', '#e0c0a0', '#1a1a1a'], eyes: 'closed', acc: 'headphones' }), behavior: 'static', solid: true, lines: [KS('…끝내 줘… 위, 위, 아래, 아래…', '…finish it for me… up, up, down, down…'), 'He sleeps in front of his screen. The game is waiting for him: four arrows blink, up, up, down, down.'] },
      { name: 'A Player', count: 5, look: H({ t: 'adult', head: 'round', body: 'shirt', c: ['#4a4a5a', '#3a3a4a', '#e0c0a0', '#1a1a1a'], eyes: 'line', acc: 'headphones' }), behavior: 'static', solid: true, lines: [KS('라면 하나만요.', 'Just one ramen, please.'), KS('집에 가기 싫어요. 여기가 더 따뜻해요.', 'I don’t want to go home. It’s warmer here.'), 'He has been playing since yesterday. Or since tomorrow.'] }],
    effect: { id: 'E59', how: 'mech', mech: { type: 'dirSequence', ent: 'N210', seq: ['up', 'up', 'down', 'down', 'left', 'right'], dist: 6, winLines: [EN('STAGE CLEAR!'), 'The player at seat 44 half wakes, takes off his headset and puts it on your head.', KS('고마워. 이제 잘 수 있어.', 'Thank you. Now I can sleep.')] } },
    place: [
      SOUL([KS('집에 아무도 없어서 여기 왔어. 여기는 불이 안 꺼져.', 'I came here because there was nobody at home. Here, the lights never go out.')]),
      SOUL([KS('컵라면은 삼 분. 엄마 퇴근은 아홉 시간.', 'Cup ramen: three minutes. Mum coming home from work: nine hours.')]),
      SOUL([KS('게임에서는 다시 하기가 있잖아. 그게 좋아.', 'In games, you can always try again. That’s what I like.')])],
    info: { summary: 'An all-night internet gaming room: neon, screens, ramen.', rules: ['Finishing the sleeping player’s game at seat 44 (up, up, down, down, left, right) gives the Gamer’s Headset (E59).'], lore: 'Those who don’t go home because nobody is there.' } });

  /* W063 — La supérette 24 h */
  S({ id: 'W063', name: 'The 24-Hour Store', depth: 2, tier: 'mid', back: 'W062',
    map: (function () { var g = K.grid(26, 16, ' '); g.box(0, 0, 26, 16, '#', '.'); g.vline(7, 3, 11, '|'); g.vline(13, 3, 11, '|'); g.vline(19, 3, 11, '|'); return g.rows(); })(),
    look: Object.assign({}, SK, { thin: { p: 'stripes', c: ['#e0e0e0', '#c03030'] } }), style: { tallWalls: true }, music: 'convenience', amb: { type: 'hum', vol: 0.07 },
    doors: [{ to: 'W067', look: 'door', opt: { style: 'glass', c: ['#ff40a0'] }, label: 'the karaoke across the street' }],
    decor: [{ look: 'fridge', n: 2, opt: { c: ['#c0e0f0'] }, lines: [KS('삼각김밥, 바나나우유, 컵라면.', 'Rice triangles, banana milk, cup ramen.'), 'The “1+1” stickers have all been torn off.'] }, { look: 'coffee', lines: [KS('아이스 아메리카노 — 1,500원', 'Iced Americano — 1,500 won')] }],
    npcs: [{ name: 'The Night Clerk', look: H({ t: 'adult', head: 'cap', body: 'apron', c: ['#30a060', '#208040', '#e0c0a0', '#1a1a1a'] }), behavior: 'static', solid: true, lines: [KS('어서 오세요. …아, 아무도 없네.', 'Welcome. …Oh, there’s nobody here.'), KS('세 시에 오는 손님이 있어요. 한 번도 안 왔어요.', 'There’s a customer who comes at three. He has never once come.')] },
      { name: 'The Customer Who Never Comes', look: H({ t: 'adult', head: 'none', body: 'coat', c: ['#4a4a4a', '#2a2a2a', '#d0d0d0', '#1a1a1a'], alpha: 0.6 }), behavior: 'static', solid: true, appearHere: { all: [{ remainingLt: 180 }, { remainingGt: 120 }] },
        lines: [{ if: { noEffect: 'E60' }, seq: ['He has come. He sets an iced coffee on the counter, untouched, and hands it to you.', KS('버티라고. 하지만 너무 오래는 말고.', 'To keep you going. But not for too long.')], do: [{ give: 'E60' }] }, 'He drinks his coffee. He looks at the time. He fades away.'] }],
    place: [
      SOUL([KS('삼각김밥 하나, 바나나우유 하나. 혼자 먹는 저녁은 빨리 끝나.', 'One rice triangle, one banana milk. Dinner alone is over quickly.')]),
      SOUL([KS('새벽 세 시 손님은 간호사였어요. 언제나 웃으면서 괜찮다고 했어요.', 'The three a.m. customer was a nurse. She always smiled and said she was fine.')]),
      SOUL([KS('1+1 스티커는 누가 다 떼어 갔을까. 같이 먹을 사람이 없나 봐.', 'Who took all the 1+1 stickers? Maybe there’s nobody left to share with.')])],
    info: { summary: 'A Korean convenience store lit all night: shelves, ramen, iced coffee.', rules: ['The Customer Who Never Comes appears when between 3:00 and 2:00 remain: serving him gives the Iced Coffee (E60).'], lore: 'Meals eaten standing up, alone, under the neon.' } });

  /* W064 — Le Métro aux heures de pointe */
  S({ id: 'W064', name: 'The Rush-Hour Metro', depth: 2, tier: 'mid', back: 'W061', conveyorDir: 'right',
    map: (function () { var g = K.grid(56, 20, ' '); g.box(0, 0, 56, 20, '#', '.'); g.rect(2, 6, 52, 6, 'z'); g.rect(1, 14, 54, 3, 'r'); g.hline(1, 54, 13, ','); g.rect(48, 2, 6, 3, ','); return g.rows(); })(),
    look: Object.assign({}, SK, { conveyor: { p: 'tile', c: ['#a8b0bc', '#8890a0'] }, rail: { p: 'rails', c: ['#2a2e36', '#a0a4b0'] } }), style: { tallWalls: true }, music: 'subway', amb: { type: 'crowd', vol: 0.1 },
    extra: { conveyorDir: 'right' },
    doors: [{ to: 'W065', look: 'door', opt: { style: 'glass', symbol: '107' }, label: 'exit 7' }, { to: 'W068', look: 'stairs', label: 'to the bridge' }],
    place: [{ id: 'q4', type: 'sign', at: [51, 3], look: 'sign', lines: ['A soul squeezed into the crowd, with no body to carry it.', KS('4번 승강장. 밀리면 그냥 밀려 가.', 'Platform 4. If you get pushed, just let yourself be carried.')] },
      SOUL([KS('매일 지하철에서 서서 잤어요. 내릴 역은 꿈속에서 지나갔어요.', 'Every day I slept standing up on the metro. My stop went by while I was dreaming.')]),
      SOUL([KS('아침 일곱 시 사십 분, 삼 호선. 아무도 서로 얼굴을 안 봐요.', 'Seven forty in the morning, Line 3. Nobody looks anybody in the face.')]),
      SOUL([KS('칼퇴하면 눈치 보여요. 그래서 다들 막차를 타요.', 'Leave on time and people notice. So everyone takes the last train.')])],
    effect: { id: 'E61', how: 'mech', mech: { type: 'reach', zone: [48, 2, 53, 4], give: 'E61', winLines: ['The crowd has carried you to platform 4 without you taking a step. At the end, a travel card slips into your pocket. Beep.'] } },
    npcs: [{ name: 'A Hurried Traveller', count: 8, look: H({ t: 'adult', head: 'round', body: 'suit', c: ['#2a2a3a', '#1a1a2a', '#e0c0a0', '#1a1a1a'], eyes: 'line', acc: 'phone' }), behavior: 'wander', radius: 6, speed: 3, solid: false, talkable: true, lines: [KS('빨리빨리!', 'Hurry, hurry!'), KS('지각이에요, 지각!', 'I’m late, I’m late!'), 'He doesn’t see you. Nobody sees anybody here.'] }],
    info: { summary: 'A packed metro corridor where the crowd moves on its own, like a conveyor belt.', rules: ['The crowd (conveyor) carries you to the right; letting it carry you to platform 4 gives the T-money Card (E61).'], lore: 'Rush hour: being swept along without moving forward.' } });

  /* W065 — Les Appartements identiques */
  S({ id: 'W065', name: 'The Identical Apartments', depth: 3, tier: 'mid', back: 'W064',
    map: (function () { var g = K.grid(48, 30, ' '); g.box(0, 0, 48, 30, '#', ','); for (var f = 0; f < 3; f++) for (var b = 0; b < 3; b++) { g.box(2 + b * 15, 2 + f * 9, 13, 7, '#', '.'); g.set(8 + b * 15, 8 + f * 9, '.'); } return g.rows(); })(),
    look: Object.assign({}, SK, { floor2: { p: 'concrete', c: ['#9a9a9e'] } }), style: { tallWalls: true }, music: 'apartments', amb: { type: 'hum', vol: 0.05 },
    doors: [{ to: 'W066', look: 'door', opt: { style: 'metal', c: ['#e08020'], symbol: '배' }, label: 'a delivery door' }],
    decor: [{ look: 'door', n: 8, opt: { style: 'metal', c: ['#8a8a8e'], symbol: '1204' }, lines: [KS('105동 1204호.', 'Building 105, flat 1204.'), KS('106동 1204호.', 'Building 106, flat 1204.'), KS('103동 1204호. 아무도 없어요.', 'Building 103, flat 1204. Nobody home.')] },
      { look: 'sign', lines: ['A soul in slippers, on the landing.', KS('여기는 105동이에요. 107동은 두 층 위예요.', 'This is Building 105. Building 107 is two floors up.')] },
      { look: 'sign', lines: [KS('107동이요? 엘리베이터 옆, 오른쪽 세 번째 집.', 'Building 107? Next to the lift, third door on the right.')] },
      { look: 'sign', lines: ['A soul pointing upwards, then to the right.', KS('저쪽. 저기 위.', 'That way. Up there.')] }],
    effect: { id: 'E62', how: 'find', look: 'intercom', lines: ['107동 1204호. You press the intercom.', KS('누구세요?', 'Who is it?'), 'A woman’s voice, tired, gentle. You don’t answer. The intercom comes away from the wall and stays in your hand.'] },
    npcs: [{ name: 'The Concierge', look: H({ t: 'old', hairStyle: 'bun', body: 'apron', c: ['#5a6a7a', '#3a4a5a', '#e0c8b0', '#c8c8c8'] }), behavior: 'static', solid: true, lines: [KS('107동 1204호? 위층이야. 이 건물은 다 똑같아서 헷갈려.', '107-1204? Upstairs. These buildings are all the same, it’s easy to get lost.'), 'She gives you a sweet. She gives sweets to every child who rings at nobody’s door.'] }],
    place: [
      SOUL([KS('1204호 창문은 밤에도 불이 켜져 있었어. 아이가 혼자 숙제를 했지.', 'The window of 1204 stayed lit at night. A child did her homework there, alone.')]),
      SOUL([KS('아빠는 열두 시 넘어서 왔어. 미란이는 밥상 앞에서 잠들었고.', 'Dad came home after midnight. Mi-ran fell asleep at the dinner table.')]),
      SOUL([KS('집이 다 똑같으니까, 아무도 자기가 길을 잃은 줄 몰라.', 'All the homes are the same, so nobody knows they’re lost.')])],
    info: { summary: 'Identical concrete apartments, identical landings, doors marked 1204 everywhere.', rules: ['Finding the intercom of 107동 1204호 with the help of the signs on the landings gives the Intercom (E62).'], lore: 'The flat in Seoul where Mi-ran grew up: 107동 1204호.' } });

  /* W066 — Le Livreur infini */
  S({ id: 'W066', name: 'The Endless Courier', depth: 3, tier: 'hard', back: 'W065',
    inf: { type: 'city', road: ',', side: '.', building: '#', cache: 48 }, look: Object.assign({}, SK, { floor: { p: 'tile', c: ['#a0a4ac', '#80848c'] }, floor2: { p: 'asphalt', c: ['#3a3a40'] }, wall: { p: 'concrete', c: ['#6a6e78', '#5a5e68', '#4a4e58'] } }),
    music: 'delivery', amb: { type: 'city', vol: 0.06 }, dark: 0.6, style: { stars: true },
    marks: { X: { type: 'decor', look: 'door', lookOpt: { style: 'metal', c: ['#8a8a8e'] }, lines: [KS('배달 왔습니다! …아무도 없네요.', 'Delivery! …Nobody’s home.')] } },
    place: [{ id: 'd1', type: 'decor', at: [12, 9], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'], symbol: '1' }, lines: ['Delivered.'] }, { id: 'd2', type: 'decor', at: [22, 9], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'], symbol: '2' }, lines: ['Delivered.'] }, { id: 'd3', type: 'decor', at: [12, 23], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'], symbol: '3' }, lines: ['Delivered.'] }, { id: 'd4', type: 'decor', at: [22, 23], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'], symbol: '4' }, lines: ['Delivered.'] }, { id: 'd5', type: 'decor', at: [30, 16], look: 'door', lookOpt: { style: 'metal', c: ['#e08020'], symbol: '5' }, lines: ['Delivered. The last one.'] },
      SOUL([KS('신호 세 번 무시하면 십 분 빨라. 그 십 분 때문에 다쳤어.', 'Run three red lights and you save ten minutes. I got hurt for those ten minutes.')]),
      SOUL(['A soul whispering behind a door, without opening it.', KS('문 앞에 두고 가 주세요. 벨은 누르지 마세요. 아이 혼자 있어요.', 'Please leave it at the door. Don’t ring the bell. The child is home alone.')]),
      SOUL([KS('별점 다섯 개. 아무도 내 얼굴은 못 봤지만.', 'Five stars. Even though nobody ever saw my face.')])],
    effect: { id: 'E63', how: 'mech', mech: { type: 'visitAll', marks: ['d1', 'd2', 'd3', 'd4', 'd5'], countText: 'Deliveries # / %', winLines: ['Every orange door has had its meal. The courier takes off his helmet and puts it on your head:', KS('수고했어. 나는 한 번도 못 끝냈어.', 'Good work. I never once finished.')] } },
    npcs: [{ name: 'The Courier', look: H({ t: 'adult', head: 'helmet', body: 'shirt', c: ['#e08020', '#c06010', '#e0c0a0', '#e8d040'], acc: 'box' }), behavior: 'static', at: [16, 16], solid: true, lines: [KS('다섯 집. 끝나기 전에. 도와줄래?', 'Five homes. Before the end. Will you help me?'), KS('주황색 문들, 이 근처야. 다른 집들은 주문을 안 해.', 'The orange doors, around here. The other homes never order.')] }],
    info: { summary: 'An endless city of towers at night, criss-crossed by streets; orange doors are waiting for a delivery.', rules: ['Endless world.', 'Delivering to the five orange doors (interact with each one) gives the Courier’s Helmet (E63).'], lore: 'The meal ordered in, left at the door, eaten alone.' } });

  /* W067 — La Salle de karaoké */
  S({ id: 'W067', name: 'The Karaoke Room', depth: 3, tier: 'mid', back: 'W063',
    map: (function () { var g = K.grid(36, 18, ' '); g.box(0, 0, 36, 18, '#', ','); for (var i = 0; i < 4; i++) { g.box(1 + i * 9, 1, 8, 8, '#', '.'); g.set(5 + i * 9, 8, '.'); } return g.rows(); })(),
    look: K.LOOK.neon, style: { tallWalls: true }, music: 'karaoke', dark: 0.6,
    doors: [{ to: 'W070', look: 'door', opt: { style: 'metal', c: ['#40c0ff'] }, label: 'emergency exit' }],
    decor: [{ look: 'tv', n: 3, animated: true, lines: [KS('사랑해요… 사랑해요…', 'I love you… I love you…'), 'The lyrics scroll across the screen. Nobody is singing.', 'A screen: “ROOM 2 — BOOKED — 회식”.'] }, { look: 'sofa', n: 3, opt: { c: ['#5a2a6a'] }, lines: ['A leatherette sofa, still warm. Tambourines lie on it.'] }],
    place: [{ id: 'room3', type: 'tv', at: [23, 2], look: 'tv', lookOpt: { off: true }, lines: ['Room 3. The screen is off. On the black glass, reflected, some lyrics: “do — mi — sol — mi — do”.'] },
      SOUL([KS('부장님 노래 끝나면 박수. 그게 내 일이었어.', 'Clap when the boss finishes his song. That was my job.')]),
      SOUL([KS('새벽 두 시. 딸한테 문자 보냈어. 먼저 자. …답장은 없었어.', 'Two in the morning. I texted my daughter. Go to sleep without me. …No reply.')]),
      SOUL([KS('한 곡만 더 부르면 집에 갈 수 있어. 매번 한 곡만 더.', 'One more song and I can go home. Every time, just one more.')])],
    effect: { id: 'E64', how: 'mech', mech: { type: 'melodyLock', mark: 'room3', tune: '02320', dist: 5, winLines: ['You sing the song from room 3. The screen lights up: 100 points. A microphone drops from the ceiling, still plugged into nothing.'] } },
    npcs: [{ name: 'The 회식 Team', count: 4, look: H({ t: 'adult', body: 'suit', c: ['#3a3a4a', '#2a2a3a', '#e8b0a0', '#1a1a1a'], eyes: 'closed', mouth: 'grin' }), behavior: 'static', solid: true, lines: [KS('한 곡 더! 한 곡 더!', 'One more! One more!'), KS('부장님이 아직 안 가셨어요. 우리도 못 가요.', 'The boss hasn’t left yet. So we can’t either.'), 'He sings off-key, very loudly, eyes shut, so as not to see the time.'] }],
    info: { summary: 'A karaoke bar (노래방) with purple rooms, where an office team cannot leave before the boss.', rules: ['Playing (Melody) the song reflected on the dark screen of room 3 (do mi sol mi do) gives the Microphone (E64).'], lore: 'The compulsory 회식, until morning.' } });

  /* W068 — Le Pont des messages
     les six plaques restent des plaques (keepSign) : il faut toutes les lire dans le même rêve */
  S({ id: 'W068', name: 'The Bridge of Messages', depth: 3, tier: 'mid', back: 'W064', outdoor: true,
    map: (function () { var g = K.grid(70, 14, '~'); g.rect(0, 5, 70, 4, '.'); g.hline(0, 69, 4, 'f'); g.hline(0, 69, 9, 'f'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#7a7a80'] }, water: { p: 'water', c: ['#1a2a4a', '#10203a', '#2a3a5a', '#8090b0'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#9aa0b0'] } },
    tall: { 'f': { look: 'fence', opt: { c: ['#9aa0b0'] } } }, style: { stars: true, sky: ['#05081a', '#1a2040'] }, music: 'bridge', amb: { type: 'wind', vol: 0.08 }, dark: 0.55,
    place: [
      { id: 'm1', type: 'sign', keepSign: true, at: [8, 5], look: 'plaque', light: 1.5, lines: [KS('밥은 먹었어?', 'Have you eaten?')] },
      { id: 'm2', type: 'sign', keepSign: true, at: [20, 8], look: 'plaque', light: 1.5, lines: [KS('오늘 하루도 수고했어.', 'You got through today, too. Well done.')] },
      { id: 'm3', type: 'sign', keepSign: true, at: [32, 5], look: 'plaque', light: 1.5, lines: [KS('보고 싶은 사람에게 전화해 봐.', 'Call someone you miss.')] },
      { id: 'm4', type: 'sign', keepSign: true, at: [44, 8], look: 'plaque', light: 1.5, lines: [{ t: 'A plaque in English, very small, at a child’s height: “You are not a burden.”' }] },
      { id: 'm5', type: 'sign', keepSign: true, at: [56, 5], look: 'plaque', light: 1.5, lines: [KS('힘들면 말해도 돼. 109', 'If it’s too hard, you can say so. 109 (Korea) — 3114 (France).')] },
      { id: 'm6', type: 'sign', keepSign: true, at: [66, 8], look: 'plaque', light: 1.5, lines: [{ t: 'The last plaque: “Go home. Someone left the light on.”' }] },
      SOUL([KS('그날 밤 여기까지 왔어. 첫 번째 글을 읽고, 두 번째 글을 읽고…', 'That night, I came all the way here. I read the first message, then the second…'), KS('다 읽고 나니까 아침이었어.', 'By the time I had read them all, it was morning.')]),
      SOUL([KS('누가 밥은 먹었냐고 물어봐 주는 게 그렇게 큰 일인 줄 몰랐어.', 'I didn’t know it mattered so much, someone asking if you’ve eaten.')]),
      SOUL(['A soul holding a phone to its ear.', KS('엄마한테 전화했어. 받자마자 괜찮냐고 물었어. 처음으로 아니라고 했어.', 'I called Mum. As soon as she picked up, she asked if I was all right. For the first time, I said no.')])],
    effect: { id: 'E65', how: 'mech', mech: { type: 'visitAll', marks: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'], countText: 'Messages read # / %', winLines: ['You have read every message, all the way to the end of the bridge. The glowing letters lift off the plaques and settle on your shoulder, like a nightlight.'] } },
    doors: [{ to: 'W064', look: 'stairs', at: [68, 6], label: 'back down to the metro' }],
    npcs: [{ name: 'The Bridge Walker', look: H({ t: 'adult', body: 'coat', c: ['#4a4a5a', '#3a3a4a', '#e0c0a0', '#1a1a1a'], eyes: 'down' }), behavior: 'patrol', path: [[4, 6], [66, 6]], speed: 0.7, lines: [KS('저도 다 읽었어요. 다 읽으면 조금 나아져요.', 'I read them all too. Once you’ve read them all, it gets a little better.'), 'He stops at every plaque. He doesn’t look at the water.'] }],
    info: { summary: 'A long bridge over a black river; on the railing, glowing messages for those who walk it at night.', rules: ['Reading the six messages, all the way to the end of the bridge, gives the Glowing Message (E65).'], lore: 'A real bridge in Seoul where messages were written to hold back those who want to jump. Here, you read to the end, and you go home.', help: 'The game recalls helplines: 109 in South Korea, 3114 in France. Elsewhere: findahelpline.com.' } });

  /* W069 — La Salle des écrans */
  S({ id: 'W069', name: 'The Screen Room', depth: 3, tier: 'mid', back: 'W062', map: K.hall(30, 18, '#', '.'),
    look: Object.assign({}, SK, { floor: { p: 'grid', c: ['#0a0e18', '#30c0ff'] } }), style: { tallWalls: true }, music: 'screens', dark: 0.7,
    doors: [{ to: 'W070', look: 'door', opt: { style: 'metal', c: ['#40c0ff'] }, label: 'to the city of drones' }],
    place: ['광고', 'SALE', '대출', '성형', '1+1', '학원'].map(function (t, i) { return { id: 'ad' + i, type: 'decor', at: [4 + i * 4, 1], look: 'screen', lookOpt: { ad: t }, lines: ['An advert: “' + t + '”. You take it down from the wall.'] }; }).concat([
      SOUL([KS('창문 자리에 화면을 달았어요. 이제 밤이 언제 오는지 몰라요.', 'They put a screen where the window was. Now we don’t know when night comes.')]),
      SOUL([KS('화면 속 엄마는 늘 웃어. 화면이 꺼지면 얼굴이 피곤해.', 'On the screen, Mum is always smiling. When the screen goes off, her face is tired.')]),
      SOUL([KS('광고가 내 얼굴을 고쳐 줬어. 이제 아무도 나를 못 알아봐.', 'The adverts fixed my face. Now nobody recognises me.')])]),
    effect: { id: 'E66', how: 'mech', mech: { type: 'visitAll', marks: ['ad0', 'ad1', 'ad2', 'ad3', 'ad4', 'ad5'], hide: true, countText: 'Adverts removed # / %', winLines: ['The wall is bare. Behind the screens, a plain window, and outside, the real night. On your nose, a pair of glasses that shows what lies behind the images.'] } },
    npcs: [{ name: 'The Screen Man', look: H({ head: 'tv', body: 'suit', c: ['#1a1a2a', '#0a0a1a', '#c8c8c8', '#ff40a0'] }), behavior: 'static', solid: true, lines: [KS('보세요! 사세요! 웃으세요!', 'Look! Buy! Smile!'), 'His screen shows your face with a better smile.'] }],
    info: { summary: 'A room papered with advertising screens that cover the wall.', rules: ['Removing the six adverts from the wall gives the AR Glasses (E66).'], lore: 'The screens that replace the windows.' } });

  /* W070 — La Ville des drones */
  S({ id: 'W070', name: 'The City of Drones', depth: 3, tier: 'hard', back: 'W069', outdoor: true,
    gen: { type: 'city', w: 56, h: 40, opts: { block: 9 } }, look: Object.assign({}, SK, { floor: { p: 'tile', c: ['#9aa0aa', '#7a808a'] }, floor2: { p: 'asphalt', c: ['#30343c'] }, wall: { p: 'glass', c: ['#3a5070', '#8ab0d8', '#5a7090'] } }),
    style: { stars: true }, music: 'drones', amb: { type: 'drone', vol: 0.08 }, dark: 0.55,
    doors: [{ to: 'W139', look: 'elevator', cond: { effect: 'E67' }, label: 'a tower, up to the 44th floor' }],
    npcs: [{ name: 'A Delivery Drone', count: 6, look: { t: 'humanoid', head: 'eye', body: 'box', legs: false, arms: false, c: ['#c8ccd4', '#a0a4ac', '#c8ccd4', '#40e0ff'], h: 14 }, behavior: 'fly', radius: 8, speed: 2.6, solid: false, lines: [KS('배송 중. 배송 중.', 'Delivering. Delivering.')] },
      { id: 'N211', name: 'The Drone Without a Parcel', tag: 'emptydrone', look: { t: 'humanoid', head: 'eye', body: 'none', legs: false, arms: false, c: ['#e8ecf0', '#e8ecf0', '#e8ecf0', '#ff8040'], h: 12 }, behavior: 'flee', radius: 10, speed: 3, solid: false, lines: ['It has nothing to deliver. It flees like someone who has forgotten why they are flying.'] }],
    effect: { id: 'E67', how: 'mech', mech: { type: 'catchN', tag: 'emptydrone', n: 1, winLines: ['You catch the drone without a parcel. It settles on your shoulder, relieved to have someone to follow at last.'] } },
    place: [
      SOUL([KS('일 인분, 일 인분, 일 인분. 이 도시는 혼자 먹는 사람들뿐이야.', 'One portion, one portion, one portion. This city is nothing but people eating alone.')]),
      SOUL([KS('드론이 저녁을 가져왔어. 아이는 창문에 대고 고맙습니다, 했어.', 'The drone brought dinner. The child said thank you to the window.')]),
      SOUL([KS('44층에서 누가 아직 일하고 있어. 불이 하나만 켜져 있어.', 'Someone is still working on the 44th floor. Only one light is on.')])],
    info: { summary: 'A city of glass where drones carry meals for one; one of them carries nothing.', rules: ['Catching the Drone Without a Parcel gives the Drone (E67).', 'With the Drone, a tower leads to the 44th Floor (W139).'], lore: 'Meals delivered to children on their own.' } });

  /* ======================== LE NORD ======================== */
  /* W071 — Le Défilé */
  S({ id: 'W071', name: 'The Parade', depth: 3, tier: 'hard', back: 'W035', backArrive: 'deep', outdoor: true,
    map: (function () { var g = K.grid(60, 36, '.'); g.rect(0, 0, 60, 8, ':'); for (var y = 12; y < 32; y += 2) for (var x = 6; x < 54; x += 2) g.set(x, y, 'X'); g.vline(30, 8, 35, ','); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#9a9890'] }, floor2: { p: 'tile', c: ['#c83030', '#a02020'] }, floor3: { p: 'mosaic', c: ['#c83030', '#e8c040', '#f0e8d0'] } },
    marks: { X: { type: 'decor', look: 'cardperson', lines: [KN('하나! 둘! 셋!', 'One! Two! Three!'), 'A child holds a coloured card above his head. He cannot see the picture he is part of.'] } },
    style: { sky: ['#e8e0d0', '#f8f4ec'] }, music: 'parade', amb: { type: 'anthem', vol: 0.06 },
    doors: [{ to: 'W072', look: 'gate', label: 'to the model village' }, { to: 'W075', look: 'door', opt: { style: 'red', c: ['#a02020'] }, label: 'the portrait hall' }],
    place: [{ id: 'card', type: 'decor', at: [30, 9], look: 'mural', lookOpt: { frame: 0 }, lines: [] },
      SOUL([KN('나는 삼천이백열한 번째 카드였습니다. 그림 전체를 한 번도 본 적이 없습니다.', 'I was card number three thousand two hundred and eleven. I never once saw the whole picture.')]),
      SOUL([KN('팔이 아파도 내리면 안 됩니다. 한 명이 내리면 해님의 웃음이 찢어집니다.', 'Even when your arms ache, you must not lower them. If one person lowers theirs, the sun’s smile tears.')]),
      SOUL([KN('련습은 석 달 동안 했습니다. 울던 동무는 다음 날 오지 않았습니다.', 'We practised for three months. The comrade who cried did not come back the next day.')])],
    effect: { id: 'E68', how: 'mech', mech: { type: 'cycleFrames', mark: 'card', every: 1.6, optKey: 'frame', good: 3, frames: ['The cards form a smiling sun.', 'The cards form ears of wheat.', 'The cards form the word “행복” (happiness).', 'One card is turned too soon: for an instant, the picture shows a crying face.', 'The cards form a flag.'], winLines: ['You turn your card at the wrong moment, on purpose. The forbidden picture stays one second longer. Your card stays in your hands.'], doneLine: 'The cards rise and fall, perfectly.' } },
    npcs: [{ name: 'The Coach', look: H({ t: 'adult', hairStyle: 'short', body: 'uniform', c: ['#3a5a3a', '#2a4a2a', '#e0c0a0', '#1a1a1a'], acc: 'flag', mouth: 'painted' }), behavior: 'static', solid: true, lines: [KN('모두 같이! 아무도 틀리지 않습니다!', 'All together! Nobody makes a mistake!'), KN('틀리는 아이는… 없습니다.', 'A child who makes mistakes… does not exist.')] }],
    info: { summary: 'A vast square where thousands of children raise coloured cards to form pictures.', rules: ['Interacting with the mosaic at the moment a card turned too soon shows the forbidden picture gives the Mosaic Card (E68).'], lore: 'Being one pixel in someone else’s picture.' } });

  /* W072 — Le Village modèle (vue de côté) */
  S({ id: 'W072', name: 'The Model Village', depth: 3, tier: 'hard', back: 'W071', outdoor: true,
    map: (function () { var g = K.grid(80, 14, ' '); g.rect(0, 11, 80, 3, '#'); g.hline(20, 26, 7, '-'); g.hline(50, 56, 7, '-'); return g.rows(); })(),
    look: { wall: { p: 'flat', c: ['#8a7a6a', '#6a5a4a'] }, thin: { p: 'panel', c: ['#e8e0c8', '#c8c0a8', '#a89878'] } },
    style: { view: 'side', sky: ['#c8d8e8', '#f0f4f8'], parallax: [{ c: '#d8dce0', f: 0.2, y: 0.7, amp: 1.5 }] }, music: 'modelvillage', amb: { type: 'loudspeaker', vol: 0.05 },
    backAt: [2, 10], doors: [{ to: 'W073', at: [40, 10], look: 'door', opt: { style: 'wood', c: ['#8a6a4a'] }, label: 'the village school' }],
    place: [8, 18, 28, 38, 48, 58, 68].map(function (x, i) { return { type: 'decor', at: [x, 10], look: 'house', lookOpt: { c: ['#f0e8d0', '#c83030'] }, solid: false, zy: -0.5, alpha: 0.85, lines: [['A painted façade, perfect. Behind it, planks and wind.', 'A façade. Plastic flowers in the windows.', 'A façade. A painted family smiles from the balcony.'][i % 3]] }; }).concat([
      SOUL([KN('손님이 오는 날에는 굴뚝에 연기를 피웠습니다. 가마에는 물만 끓였습니다.', 'On visiting days, we made the chimneys smoke. In the pot, we boiled only water.')], [13, 10]),
      SOUL([KN('뒤쪽으로 가지 마십시오. 뒤쪽은 없습니다.', 'Do not go round the back. There is no back.')], [33, 10]),
      SOUL([KN('진짜 집에는 그릇이 두 개 있습니다. 한 사람은 아직 오지 않았습니다.', 'In the real house there are two bowls. Someone has not come yet.')], [63, 10])]),
    effect: { id: 'E69', how: 'find', at: [76, 10], look: 'house', opt: { c: ['#a08868', '#5a3a2a'], lit: true }, lines: ['The only real house, at the very end. Inside, a table, a lamp, two bowls. When you come back out, you take its façade with you, folded like a fan.'] },
    npcs: [{ name: 'The Extra', count: 3, look: H({ t: 'adult', body: 'shirt', c: ['#e8e8e0', '#c8c8c0', '#e0c0a0', '#1a1a1a'], mouth: 'painted' }), behavior: 'static', solid: true, lines: [KN('우리 마을은 아주 행복합니다. 손님이 오시면.', 'Our village is very happy. When there are visitors.'), 'He smiles towards the road. When you go behind the façade, he stops smiling.'] }],
    info: { summary: 'Side view: a street of perfect façades with no houses behind them, except one.', rules: ['Side view.', 'Going behind the façades to the only real house, at the very end, gives the Façade (E69).'], lore: 'A village built to be seen from far away.' } });

  /* W073 — L'École du Parent */
  S({ id: 'W073', name: 'The School of the Parent', depth: 3, tier: 'hard', back: 'W072',
    map: (function () { var g = K.grid(34, 22, ' '); g.box(0, 0, 34, 22, '#', '.'); for (var y = 6; y < 19; y += 3) for (var x = 4; x < 30; x += 3) g.set(x, y, '{'); return g.rows(); })(),
    look: NK, tall: { '{': { look: 'schooldesk' } }, style: { tallWalls: true }, music: 'nkschool',
    doors: [{ to: 'W074', look: 'door', opt: { style: 'wood' }, label: 'the fields' }],
    decor: [{ look: 'portrait', opt: { redacted: true }, lines: ['The portrait of the Parent, above the blackboard. A black band across the eyes.'] }, { look: 'board', opt: { lines: ['우리는 행복합니다', '우리는 행복합니다', '우리는 행복합니다'], color: '#f0f0f0' }, cycle: false, lines: ['On the blackboard, a hundred times, in chalk:', KN('우리는 행복합니다.', 'We are happy.')] }],
    npcs: [{ name: 'A Schoolgirl Reciting', count: 5, look: H({ t: 'kid', hairStyle: 'short', body: 'uniform', c: ['#f0f0f0', '#c8c8c8', '#f0c8a0', '#1a1a1a'], mouth: 'painted', acc: 'flag' }), behavior: 'static', solid: true, lines: [KN('어버이의 은혜는 하늘보다 높습니다!', 'The Parent’s kindness is higher than the sky!'), KN('저는 아무것도 원하지 않습니다.', 'I want nothing.'), 'She recites with her eyes closed. When she thinks nobody is looking, she draws a flower on her desk and rubs it out at once.'] }, { name: 'The Schoolmaster', look: H({ t: 'adult', body: 'suit', c: ['#2a3a2a', '#1a2a1a', '#e0c0a0', '#1a1a1a'], acc: 'cane' }), behavior: 'patrol', path: [[3, 3], [30, 3]], speed: 0.8, lines: [KN('질문은 없습니다. 질문이 없는 것이 좋은 학생입니다.', 'There are no questions. A good pupil is one who has no questions.')] }],
    place: [
      SOUL([KN('꽃을 그리면 지워야 합니다. 그래도 책상에는 자국이 남습니다.', 'If you draw a flower, you must rub it out. But the mark stays on the desk.')]),
      SOUL([KN('우리 반에 철이라는 동무가 있었습니다. 아니, 없었습니다.', 'In our class there was a comrade called Chol-i. No, there was not.'), KN('없었다고 배웠습니다.', 'We were taught that there was not.')]),
      SOUL([KN('질문이 하나 있었습니다. 지금은 생각나지 않습니다. 그것이 좋은 것입니다.', 'I had a question. Now I cannot remember it. That is a good thing.')])],
    info: { summary: 'A classroom where happiness is recited beneath the portrait of the Parent.', lore: 'Grandmother’s school, the way she never told it.' } });

  /* W074 — Les Champs collectifs */
  S({ id: 'W074', name: 'The Collective Fields', depth: 3, tier: 'hard', back: 'W073', outdoor: true,
    gen: { type: 'empty', w: 54, h: 40, opts: { floor: '+', border: 'f', decor: '"', decorRate: 0.12 } }, look: { soil: { p: 'soil', c: ['#6a5a3a'] }, leafg: { p: 'grass', c: ['#8a9a4a', '#7a8a3a', '#9aaa5a', '#5a6a2a'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#6a5a4a'] } },
    tall: { 'f': { look: 'fence' } }, style: { sky: ['#d8d0b0', '#f0e8c8'] }, music: 'fields', amb: { type: 'wind', vol: 0.06 },
    doors: [{ to: 'W077', look: 'gate', label: 'the road south' }],
    decor: [{ look: 'loudspeaker', n: 3, lines: [KN('오늘의 생산량: 백 퍼센트 초과 달성!', 'Today’s output: target exceeded, over one hundred per cent!')] }, { look: 'scarecrow', n: 4, lines: ['A scarecrow in uniform. It wears a medal.'] }],
    npcs: [{ name: 'A Gleaner', count: 4, look: H({ t: 'adult', hairStyle: 'bun', body: 'apron', c: ['#7a7a5a', '#5a5a3a', '#d8b090', '#2a2a2a'], eyes: 'down' }), behavior: 'wander', radius: 5, speed: 0.7, lines: [KN('배고프지 않습니다. 일없습니다.', 'I am not hungry. It is nothing.'), 'She gathers invisible ears of grain and hands them to the loudspeaker.', KN('남쪽에서 온 사람? …못 들은 걸로 하겠습니다.', 'Someone from the South? …I will pretend I did not hear that.')] }],
    place: [
      SOUL([KN('풀죽을 먹으면서 풍년가를 불렀습니다. 노래는 배가 부릅니다.', 'We sang the song of good harvests while eating grass porridge. Songs fill the belly.')]),
      SOUL(['A soul clutching something in its fist.', KN('어머니는 씨앗 한 줌을 옷깃에 꿰매 두었습니다. 어디에 가든 심으라고.', 'Mother sewed a handful of seeds into a collar. So that we could plant them, wherever we went.')]),
      SOUL([KN('배고프다고 말하면 안 됩니다. 그래서 우리는 일없습니다, 하고 말합니다.', 'You must not say you are hungry. So we say: it is nothing.')])],
    info: { summary: 'Fenced collective fields as far as the eye can see; loudspeakers announce record harvests.', lore: 'The hunger that no one names.' } });

  /* W075 — La Salle des portraits */
  S({ id: 'W075', name: 'The Portrait Hall', depth: 3, tier: 'hard', back: 'W071', map: K.hall(30, 20, '#', ','),
    look: NK, style: { tallWalls: true }, music: 'portraits', dark: 0.4,
    doors: [{ to: 'W076', look: 'door', opt: { style: 'red', c: ['#a02020'] }, label: 'to the Monument' }],
    decor: [{ look: 'portrait', n: 10, opt: { redacted: true }, lines: ['A portrait. The face has been cut out with scissors. Under the frame: a name, scratched away.', 'A family portrait. One person has been erased from the photo; their shadow is still on the wall behind.', 'A portrait of a young boy. Plaque: “철”. The rest has been torn off.'] }],
    npcs: [{ name: 'The Curator', look: H({ t: 'old', hairStyle: 'bun', body: 'uniform', c: ['#3a2a2a', '#2a1a1a', '#e0c8b0', '#c8c8c8'], acc: 'scissors' }), behavior: 'patrol', path: [[3, 3], [26, 3], [26, 16], [3, 16]], speed: 0.6, lines: [KN('이 사람들은 처음부터 없었습니다.', 'These people never existed in the first place.'), 'She cuts out a face, very carefully, and tucks it into her pocket, against her heart.'] }],
    place: [
      SOUL([KN('얼굴을 오려 낸 자리로 바람이 들어옵니다. 그 사람은 아직도 춥습니다.', 'The wind comes in where the face was cut out. That person is still cold.')]),
      SOUL([KN('철이는 열 살이었습니다. 명희 동무가 사진을 붙이고 또 붙였습니다.', 'Chol-i was ten years old. Comrade Myong-hui stuck the photo back up, again and again.')]),
      SOUL([KN('우리 가족 사진에는 다섯 명이 있었습니다. 지금은 네 명이 웃고 있습니다.', 'There were five people in our family photo. Now four are smiling.')])],
    info: { summary: 'A gallery of portraits whose faces have been cut out.', lore: 'The disappeared, erased from family photos.' } });

  /* W076 — Le Grand Monument */
  S({ id: 'W076', name: 'The Great Monument', depth: 4, tier: 'hard', back: 'W075', outdoor: true,
    map: (function () { var g = K.grid(44, 44, ' '); g.ellipse(22, 22, 20, 20, '.'); g.ellipse(22, 22, 3, 3, ':'); g.set(22, 22, 'M'); return g.rows(); })(),
    look: { floor: { p: 'stone', c: ['#c8c0b0', '#a8a090', '#7a7468'] }, floor3: { p: 'marble', c: ['#e8e0d0', '#a89878'] } },
    marks: { M: { id: 'statue', type: 'anchor', look: 'monument', lines: ['A gigantic statue, one arm raised. Its shadow turns around it, faster than the sun.'] } },
    style: { sky: ['#f8f0d0', '#ffffff'], cliffH: 1 }, music: 'monument', amb: { type: 'wind', vol: 0.06 },
    doors: [{ to: 'W077', look: 'stairsdown', label: 'stairs beneath the plinth' }],
    effect: { id: 'E70', how: 'mech', mech: { type: 'followShadow', center: [22, 22], r: 6, speed: 0.22, secs: 26, breakLine: 'You step out of the shadow. The sun burns your eyes.', winLines: ['You stayed in the statue’s shadow for its whole turn. When the turn ends, the shadow does not go on with the statue: it stays stuck to your feet.'] } },
    npcs: [{ name: 'The Visitor in Black', count: 3, look: H({ t: 'adult', body: 'suit', c: ['#1a1a1a', '#0a0a0a', '#e0c0a0', '#1a1a1a'], acc: 'flower' }), behavior: 'static', solid: true, lines: [KN('꽃을 바치세요. 모두 바칩니다.', 'Lay your flowers. Everyone lays flowers.'), 'He bows too low, for too long.'] }],
    place: [
      SOUL([KN('그늘 밖은 너무 밝습니다. 그늘 안에서는 아무도 우리를 보지 않습니다.', 'Outside the shade, it is too bright. In the shade, nobody sees us.')]),
      SOUL([KN('어버이께서는 우리를 보살펴 주십니다. 너무 가까이에서.', 'The Parent watches over us. From too close.')]),
      SOUL([KN('꽃을 바치는 날, 나는 내 어머니 무덤에도 꽃을 놓고 싶었습니다.', 'On the day of flowers, I wanted to lay some on my mother’s grave too.')])],
    info: { summary: 'A round esplanade at the foot of a gigantic statue; its shadow turns.', rules: ['Staying in the shadow for the whole turn gives the Shadow (E70).'], lore: 'Living in the shadow of someone greater than yourself.' } });

  /* W077 — La Frontière */
  S({ id: 'W077', name: 'The Border', depth: 4, tier: 'hard', back: 'W074', outdoor: true,
    map: (function () { var g = K.grid(64, 30, '.'); g.hline(0, 63, 14, 'f'); g.hline(0, 63, 16, 'f'); g.rect(0, 15, 64, 1, '_'); g.set(32, 14, '.'); g.set(32, 16, '.'); g.set(32, 15, '='); return g.rows(); })(),
    look: { floor: { p: 'grass', c: ['#6a7a5a', '#5a6a4a', '#7a8a6a', '#4a5a3a'] }, fence: { p: 'stripes', c: ['rgba(0,0,0,0)', '#7a7a7a'] }, pit: { p: 'void', c: ['#0a0a0a'] } },
    tall: { 'f': { look: 'fence', opt: { c: ['#7a7a7a'], wire: true } } }, style: { sky: ['#b0b8c0', '#d8dce0'] }, music: 'border', amb: { type: 'wind', vol: 0.08 }, weather: { ash: true },
    doors: [{ to: 'W078', at: [32, 28], look: 'gate', label: 'the bridge' }, { to: 'W076', at: [10, 4], look: 'stairs', label: 'back to the Monument' }],
    decor: [
      { look: 'sign', lines: ['A soul cut in two by the fence. Each half speaks its own tongue.', KN('이쪽은 행복합니다.', 'This side is happy.'), KS('이쪽은 자유롭습니다.', 'This side is free.')] },
      { look: 'sign', lines: [KS('지뢰. 조심해. 풀은 아무것도 몰라.', 'Mines. Careful. The grass knows nothing.')] },
      { look: 'sign', lines: [KN('이 선을 넘지 마시오. 선은 보이지 않습니다.', 'Do not cross this line. The line cannot be seen.')] },
      { look: 'sign', lines: ['A soul that no longer knows which side it fell on.', KS('나는 어느 쪽 사람이었을까?', 'Which side did I belong to?')] },
      { look: 'flagpole', n: 2, lines: ['An immense flagpole. The flag is too heavy for the wind.'] }],
    npcs: [{ name: 'The Soldier from the North', look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#4a5a3a', '#3a4a2a', '#e0c0a0', '#4a5a3a'] }), behavior: 'static', solid: true, lines: [KN('저쪽은 없습니다. 아무것도 없습니다.', 'There is no other side. There is nothing at all.')] }, { name: 'The Soldier from the South', look: H({ t: 'adult', head: 'helmet', body: 'uniform', c: ['#3a4a5a', '#2a3a4a', '#e0c0a0', '#3a4a5a'] }), behavior: 'static', solid: true, lines: [KS('건너가면 안 돼요. 돌아오는 다리가 없어요.', 'You can’t cross. There’s no bridge back.')] }, { name: 'The Old Woman at the Fence', look: H({ t: 'old', hairStyle: 'bun', body: 'hanbok', c: ['#e8e4dc', '#c8c4bc', '#d8c0a8', '#e0e0e0'], eyes: 'closed' }), behavior: 'static', solid: true, lines: [KS('오빠… 기다려.', 'Big brother… wait for me.'), 'She ties a ribbon to the fence. There are thousands of them.'] }],
    place: [
      SOUL([KS('리본마다 이름이 하나씩. 바람이 불면 이름들이 북쪽으로 날아가.', 'A name on every ribbon. When the wind blows, the names fly away north.')]),
      SOUL([KN('동생이 남쪽으로 갔다는 소문을 들었습니다. 소문은 국경을 넘을 수 있습니다.', 'I heard a rumour that my little sister had gone south. Rumours can cross the border.')]),
      SOUL([KS('보초 서다가 저쪽 병사랑 눈이 마주쳤어. 우리 둘 다 열아홉 살이었어.', 'On sentry duty, I met the eyes of the soldier on the other side. We were both nineteen.')])],
    info: { summary: 'A strip of grass between two fences, a ditch, two soldiers standing back to back.', lore: 'The line that separated Ok-sun from her brother.' } });

  /* W078 — Le Pont de non-retour */
  S({ id: 'W078', name: 'The Bridge of No Return', depth: 4, tier: 'hard', back: 'W077', outdoor: true,
    map: (function () { var g = K.grid(16, 60, '~'); g.rect(6, 0, 4, 60, '='); return g.rows(); })(),
    look: { bridge: { p: 'plank', c: ['#6a5a4a', '#4a3a2a', '#7a6a5a'] }, water: { p: 'water', c: ['#3a4a4a', '#2a3a3a', '#4a5a5a', '#a0b0b0'] } },
    style: { sky: ['#a0a8b0', '#d0d4d8'] }, music: 'noreturn', amb: { type: 'river', vol: 0.08 }, dark: 0.3,
    backAt: [8, 1], doors: [{ to: 'W079', at: [8, 58], look: 'gate', oneway: true, label: 'the other bank' }],
    decor: [{ look: 'shoe', at: [7, 30], n: 1, lines: ['A child’s shoe, the left one, in the middle of the bridge.'], use: [{ if: { not: { flag: 'got:shoe2' } }, set: { 'got:shoe2': true }, item: { shoe: 1 } }] }],
    npcs: [{ name: 'The Nine-Year-Old Boy', look: H({ t: 'kid', body: 'shirt', c: ['#c8c0b0', '#a8a090', '#f0c8a0', '#1a1a1a'], eyes: 'sad' }), behavior: 'static', at: [8, 45], solid: true, lines: [KN('동생이 저쪽에 있어요. 저는 이쪽이에요.', 'My little sister is on that side. I am on this side.'), 'He says his name is Jae-sik. He counts the planks so as not to cry.'] }],
    place: [
      SOUL([KN('이 다리를 건너면 다시는 돌아오지 못한다고 했습니다. 그래도 사람들은 건넜습니다.', 'They said that once you crossed this bridge, you could never come back. People crossed anyway.')], [7, 12]),
      SOUL([KN('널판자는 이백열 개입니다. 아니, 이백열한 개. 셀 때마다 하나씩 늘어납니다.', 'There are two hundred and ten planks. No, two hundred and eleven. Every time you count, there is one more.')], [9, 22]),
      SOUL(['A very small soul, barefoot on one side.', KS('신발 한 짝은 여기 두고 갈게. 오빠가 찾으러 오면 알아보게.', 'I’ll leave one shoe here. That way, if Big Brother comes looking for me, he’ll recognise it.')], [8, 52])],
    info: { summary: 'A very long wooden bridge over a grey river; it can only be crossed one way.', rules: ['One-way passage to the Platform of Farewells (W079).'], lore: '1951. A side was chosen.' } });

  /* W079 — Le Quai des adieux */
  S({ id: 'W079', name: 'The Platform of Farewells', depth: 4, tier: 'hard', back: 'W002', backLook: 'stairs', backLabel: 'a staircase leading back up to a station',
    map: (function () { var g = K.grid(70, 14, ' '); g.box(0, 0, 70, 14, '#', '.'); g.rect(1, 9, 68, 4, 'r'); g.hline(1, 68, 8, ','); return g.rows(); })(),
    look: Object.assign({}, NK, { floor: { p: 'stone', c: ['#8a8478', '#6a6458', '#4a4438'] }, rail: { p: 'rails', c: ['#2a241c', '#8a8a8a'] } }), style: { tallWalls: true, renderer: 'sepia' }, music: 'farewell', amb: { type: 'train', vol: 0.06 }, weather: { ash: true },
    doors: [{ to: 'W080', look: 'door', opt: { style: 'metal', c: ['#3a3a3a'] }, label: 'the depot' }],
    effect: { id: 'E71', how: 'find', at: [67, 7], look: 'suitcase', cond: { remainingLt: 120 }, lines: ['The last train has gone. At the end of the platform, a forgotten suitcase: “J.” It is light. It holds everything that was never said.'] },
    place: [{ type: 'trigger', at: [35, 5], look: null, lines: ['A train pulls into the station, packed to bursting. It does not stop.'], cond: { remainingGt: 120 } },
      SOUL([KN('렬차 지붕 위에도 사람들이 앉아 있었습니다. 모두 같은 쪽을 보고 있었습니다.', 'There were people sitting even on the roof of the train. They were all looking the same way.')]),
      SOUL([KN('다음 렬차로 갈게. 그 말을 한 사람은 많았습니다.', '“I’ll take the next train.” Many people said that.'), KN('다음 렬차는 없었습니다.', 'There was no next train.')]),
      SOUL(['A soul hopping, one foot colder than the other.', KS('왼쪽 신발은 기차 밑으로 떨어졌어. 평생 왼발이 시렸어.', 'My left shoe fell under the train. All my life, my left foot was cold.')])],
    npcs: [{ name: 'A Family Parting', count: 4, look: H({ t: 'adult', body: 'hanbok', c: ['#d8d0c0', '#b8b0a0', '#d8b898', '#1a1a1a'], eyes: 'sad' }), behavior: 'static', solid: true, lines: ['They hold hands right to the edge of the platform, then let go.', KN('다음 렬차로 갈게.', 'I’ll take the next train.'), 'Nobody cries. They will cry later, when it is forbidden.'] }, { name: 'The Little Girl with One Shoe', look: H({ t: 'kid', hairStyle: 'braids', body: 'dress', c: ['#e04050', '#b02030', '#f0c8a0', '#1a1a1a'], eyes: 'sad' }), behavior: 'static', solid: true, lines: [KS('오빠! 오빠!', 'Big brother! Big brother!'), 'She has only one shoe, the right one. Her name is Ok-sun. She is nine.'] }],
    info: { summary: 'A station platform in sepia, 1951; packed trains pass without stopping.', rules: ['Once the last train has passed (under 2:00 left), the suitcase at the end of the platform gives the Suitcase (E71).'], lore: 'The platform where Ok-sun lost her brother and her left shoe.' } });

  /* W080 — Le Dépôt des trains fantômes */
  S({ id: 'W080', name: 'The Ghost Train Depot', depth: 3, tier: 'hard', back: 'W022', backArrive: 'depot',
    map: (function () { var g = K.grid(50, 30, ' '); g.box(0, 0, 50, 30, '#', '.'); for (var y = 4; y < 27; y += 5) g.rect(1, y, 48, 2, 'r'); return g.rows(); })(),
    look: { floor: { p: 'concrete', c: ['#3a3a3e'] }, rail: { p: 'rails', c: ['#2a2a2a', '#7a7a80'] }, wall: { p: 'flat', c: ['#1a1a1e', '#101014'], topColor: '#1a1a1e' }, wallface: { p: 'brick', c: ['#4a3a3a', '#3a2a2a', '#2a1a1a'], skirt: '#2a2a2a' } },
    style: { tallWalls: true }, music: 'depot', dark: 0.7, amb: { type: 'machine', vol: 0.05 },
    doors: [{ to: 'W079', look: 'door', opt: { style: 'metal' }, label: 'the platform of farewells' }, { to: 'W081', look: 'door', opt: { style: 'wood', symbol: '⏱' }, label: 'the clock room' }],
    place: [3, 1, 5, 2, 4].map(function (n, i) { return { id: 't' + n, type: 'decor', at: [6 + i * 9, 4 + i * 5], look: 'train', lookOpt: { c: ['#3a4a3a', '#c8c040'], dark: true }, lines: ['Ghost train no. ' + n + '.'] }; }).concat([
      SOUL([EN('Train number 4 was meant to go south in 1951. It waited so long its tickets turned to ash.')]),
      SOUL([EN('A ghost train is only a journey somebody promised and never took.')]),
      SOUL([KN('렬차 번호를 외우십시오. 번호를 잊으면 집도 잊습니다.', 'Learn the train number by heart. If you forget the number, you forget home too.')])]),
    effect: { id: 'E72', how: 'mech', mech: { type: 'sequence', order: ['t1', 't2', 't3', 't4', 't5'], okSfx: 'train_horn', winLines: ['The five ghost trains stand in order. A switch lever comes away from the wall, still warm from all the routes it never took.'], wrongLine: 'The train backs away into the dark. They must be lined up in order of their numbers.' } },
    npcs: [{ name: 'The Signalman', look: H({ t: 'old', head: 'cap', body: 'uniform', c: ['#3a3a3a', '#2a2a2a', '#d8b898', '#c8c8c8'], acc: 'lantern' }), behavior: 'static', solid: true, lines: [EN('Trains that never ran end up here. The 23:71 too, one day.'), EN('Line them up in order. One, two, three… Ghosts like things in order.')] }],
    info: { summary: 'A dark depot where trains that never ran lie sleeping.', rules: ['Touching the trains in order of their numbers (1 to 5) gives the Track Switch (E72).'], lore: 'The journeys never made.' } });
})(typeof window !== 'undefined' ? window : globalThis);
