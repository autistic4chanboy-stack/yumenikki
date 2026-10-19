/* Histoires — la Corée du Sud rêvée : nuits de travail, hagwon, examen, immeubles, néons */
(function (root) {
  'use strict';
  var YN = root.YN, S = YN.addStory;
  function EN(t) { return { t: t, lang: 'en' }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }   // South Korean + English translation
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }   // North Korean + English translation

  /* ---------------------------------------------------------------- FOLLOW */

  S({
    id: 'st_sk_01', kind: 'follow', where: { themes: ['home', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The Boy Who Presses Every Button', look: { t: 'kid', c: ['#3a4a6a', '#e0c890', '#f0d8b8'] }, lang: 'ko-s' },
    intro: [
      'A small boy stands in an apartment lift. Every button on the panel is lit, all the way up to 25.',
      KS('누나도 타요? 제가 다 눌러놨어요.', 'Getting in? I’ve pressed all of them.'),
      KS('엄마가 몇 층에 사는지 까먹었거든요.', 'I forgot which floor Mum lives on.')
    ],
    again: [KS('아직 3층이에요. 엘리베이터가 고민이 많아요.', 'Still the third floor. The lift has a lot on its mind.')],
    follow: {
      start: [
        'The doors open on a corridor exactly like the last one: shoe racks, a bicycle, a pot of dried-up chillies.',
        KS('여기 아니에요. 따라와요, 계단이 더 빨라요.', 'Not this one. Come on, the stairs are quicker.')
      ],
      wait: [KS('누나, 빨리요! 계단은 기다려주지만 저는 안 기다려요.', 'Hurry! The stairs will wait for you, but I won’t.')],
      arrive: [
        'Between the third floor and the fifth, there is a landing marked only with the letter F.',
        KS('여기는 아무도 안 눌러요. 사 층이라서요.', 'Nobody ever presses this one. Because it’s four.'),
        KS('엄마는 여기 없네요. 그래도 문은 있어요.', 'Mum isn’t here. There’s a door, though.')
      ],
      to: 'secret'
    },
    reward: 'secret',
    lore: ['Behind her, the boy steps back into the lift and presses every button again, one by one, gently.']
  });

  S({
    id: 'st_sk_02', kind: 'follow', where: { themes: ['city', 'home', 'korea'], depth: [1, 3] },
    who: { name: 'The Rider Looking for Unit 1204', look: { t: 'adult', c: ['#2a6a4a', '#e8d040', '#b88868'] }, lang: 'en' },
    intro: [
      'A delivery rider in a dented helmet stands by his scooter, a warm box held against his chest.',
      EN('Building 103, unit 1204. The map says I’m here. It has said that for a long time.'),
      EN('Every block looks like every other block. You live around here? You know the way?')
    ],
    again: [EN('I keep the box inside my jacket. It’s the warmest thing on this whole estate.')],
    follow: {
      start: [
        EN('Okay. We look together. You walk behind me. If I go the wrong way, cough.'),
        'He pushes the scooter instead of riding it, so that she can keep up.'
      ],
      wait: [EN('Hey. Don’t you get lost too. One lost person a night is plenty.')],
      arrive: [
        'At the far edge of the estate, one window is still lit. Building 103. The twelfth floor.',
        EN('There. Somebody waited up.'),
        'He leaves the box on the bench below and rings once. Upstairs, the light goes out.',
        EN('They’ll come down. They always come down after I’ve gone. Here, this is for the walk.')
      ],
      to: 'far'
    },
    reward: 'coin',
    lore: [EN('Five stars, if anyone asks. Wherever the stars go in a place like this.')]
  });

  S({
    id: 'st_sk_03', kind: 'follow', where: { themes: ['school', 'city', 'korea'], depth: [1, 2] },
    who: { name: 'The Girl With Five Schoolbags', look: { t: 'kid', c: ['#c84a5a', '#2a2a3a', '#f0d8b8'] }, lang: 'ko-s' },
    intro: [
      'A girl in a school uniform carries five bags: one on her back, one on each arm, one in each hand.',
      KS('수학, 영어, 논술, 피아노, 코딩. 아직 두 개 남았어요.', 'Maths, English, essay writing, piano, coding. Two left to go.'),
      KS('셔틀 놓치면 안 돼요. 언니, 같이 뛰어줄래요?', 'I can’t miss the shuttle. Will you run with me?')
    ],
    again: [KS('지금 몇 시예요? 아니, 말하지 마요. 알면 무서워요.', 'What time is it? No, don’t tell me. Knowing is scary.')],
    follow: {
      start: [
        KS('이쪽이요. 지름길이에요. 엄마는 몰라요.', 'This way. It’s a shortcut. Mum doesn’t know about it.'),
        'She runs, but every few steps a bag slips, and she has to stop and hitch it back up.'
      ],
      wait: [KS('언니, 늦으면 벌점이에요! 벌점 세 개면 반 내려가요!', 'If we’re late it’s a penalty point! Three points and they move you down a class!')],
      arrive: [
        'The shortcut ends in a small playground between two tower blocks. The swings are wet with dew.',
        'The girl puts the five bags down on a bench, in a careful row, biggest to smallest.',
        KS('여기 맨날 뛰어서 지나가기만 했어요. 한 번도 안 타봤어요.', 'I run past this every single day. I’ve never once been on it.'),
        KS('딱 한 번만요. 셔틀은 기다려줄 거예요. 아마도요.', 'Just once. The shuttle will wait. Probably.')
      ],
      to: 'corner'
    },
    reward: 'photo',
    lore: ['The swing creaks up and up. From the top, the five bags on the bench look very small.']
  });

  S({
    id: 'st_sk_04', kind: 'follow', where: { themes: ['city', 'water', 'korea'], depth: [2, 3] },
    who: { name: 'The Man Asleep on the Last Train', look: { t: 'adult', c: ['#3a3a4a', '#d8d8e0', '#c8a888'] }, lang: 'ko-s' },
    intro: [
      'The last train. One carriage, one passenger: a man asleep on his feet, a clear umbrella on his wrist.',
      KS('…이번 역은… 어디죠?', '…This station is… where?'),
      'He does not open his eyes. When the doors slide apart, he walks out anyway.'
    ],
    again: [KS('쉿. 깨우지 마세요. 깨면 내릴 데가 없어져요.', 'Shh. Don’t wake me. If I wake up, there’s nowhere left to get off.')],
    follow: {
      start: [
        KS('종점까지만 가면 돼요. 따라와요. 우산 있어요.', 'We just go to the end of the line. Follow me. I have an umbrella.'),
        'He walks the length of the platform with his eyes shut, never once stepping over the yellow line.'
      ],
      wait: [KS('어디 갔어요? 막차는 한 대뿐이에요.', 'Where did you go? There’s only one last train.')],
      arrive: [
        'The platform ends and the river begins, with no wall and no step between them. It starts to rain.',
        KS('아, 여기였구나. 십일 년 동안 지나쳐 갔네.', 'Oh. So it was here. Eleven years I’ve been riding past it.'),
        'He opens the umbrella and holds it over her, not over himself.',
        KS('가져가요. 이건 어차피 맨날 두고 내리는 거예요.', 'Take it. I always leave this one behind anyway.')
      ],
      to: 'water'
    },
    reward: 'lore',
    lore: ['When she looks out from under the umbrella, the platform is empty and the rain has stopped.']
  });

  S({
    id: 'st_sk_05', kind: 'follow', where: { themes: ['nature', 'snow', 'korea'], depth: [2, 4] },
    who: { name: 'The Ajusshi in Full Hiking Gear', look: { t: 'adult', c: ['#e04a8a', '#40c0e0', '#c89070', '#2a2a2a'] }, lang: 'ko-s' },
    intro: [
      'At the foot of a snowy hill: a man in a neon pink jacket, gaiters, a visor, two poles and a thermos.',
      'The hill is about as tall as a bus shelter.',
      KS('이 정도 산이면 장비는 기본이지.', 'For a mountain like this, gear is the bare minimum.'),
      KS('정상 가 봤어? 같이 가자. 천천히.', 'Ever been to the top? Let’s go together. Slowly.')
    ],
    again: [KS('물은 챙겼고? 귤은? 하나 줄까?', 'Got water? A tangerine? Want one?')],
    follow: {
      start: [
        KS('발밑 조심해. 눈 밑에 얼음 있어.', 'Mind your feet. There’s ice under the snow.'),
        'The hill goes on far longer than it looked. Every hundred steps he stops to greet nobody at all.'
      ],
      wait: [KS('쉬었다 갈까? 그래, 산은 안 도망가.', 'Need a rest? Fine. The mountain isn’t going anywhere.')],
      arrive: [
        'The top is a flat white stone with a little cairn. Far off, on another peak, a tiny figure in purple waves.',
        KS('우리 집사람이야. 저 산은 저 사람 거, 이 산은 내 거.', 'That’s my wife. That mountain is hers, this one is mine.'),
        KS('일요일마다 이렇게 손 흔들어. 삼십 년째. 집에서는 말을 잘 안 해.', 'Every Sunday we wave like this. Thirty years now. At home we don’t talk much.'),
        'He waves both poles high above his head. The purple figure waves back with both arms.'
      ],
      to: 'far'
    },
    reward: 'page',
    lore: [KS('내려갈 땐 네가 앞장서. 나는 조금만 더 있다 갈게.', 'You lead the way down. I’ll stay up here a little longer.')]
  });

  /* ----------------------------------------------------------------- FETCH */

  S({
    id: 'st_sk_06', kind: 'fetch', where: { themes: ['home', 'nature', 'korea'], depth: [1, 2] },
    who: { name: 'The Grandmother by the Telephone', look: { t: 'old', c: ['#7a5a8a', '#e8e0d0', '#d8b898'] }, lang: 'ko-s' },
    intro: [
      'A country house, its sliding door open onto persimmon trees. An old woman kneels by a beige telephone.',
      KS('아이고, 손님 왔네. 우리 손주가 전화한다 그랬는데.', 'Oh my, a visitor. My grandson said he’d ring.'),
      KS('근데 번호를 어디 적어놨더라. 안경도 어디 뒀는지 모르겠고.', 'But where did I write his number? And I can’t think where I put my glasses.')
    ],
    again: [KS('전화는 안 왔어. 소리를 제일 크게 해놨는데.', 'No call yet. I’ve turned the ringer all the way up.')],
    fetch: {
      items: [
        { name: 'reading glasses on a beaded cord', look: 'glass', color: '#a08060' },
        { name: 'a calendar page with a number on the back', look: 'letter', color: '#e8e0c8' }
      ],
      found: ['She picks it up. It smells of camphor and dried red pepper.'],
      partial: [KS('하나 찾았네. 아이고 착하다. 하나만 더.', 'You found one. Aren’t you good. Just one more.')],
      done: [
        'The old woman puts on the glasses, reads the number twice, and dials very slowly with one finger.',
        KS('여보세요? …응, 할머니야. 아니, 그냥. 밥은 먹었어?', 'Hello? …Yes, it’s Grandma. No, nothing. Have you eaten?'),
        'She listens to the dial tone for a long time, nodding along.',
        KS('바쁘대. 바쁜 게 좋은 거야. 자, 이거 먹고 가.', 'He’s busy. Busy is good. Here, eat this before you go.')
      ]
    },
    reward: 'cookie',
    lore: [KS('다음 주에 또 전화한대. 맨날 그렇게 말해.', 'He says he’ll ring again next week. He always says that.')]
  });

  S({
    id: 'st_sk_07', kind: 'fetch', where: { themes: ['home', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The Man Who Sorts the Recycling', look: { t: 'old', c: ['#4a6a4a', '#d8d0b8', '#c8a080'] }, lang: 'ko-s' },
    intro: [
      'Wednesday night behind an apartment block. An old man in a reflective vest stands over a row of labelled bins.',
      KS('유리는 유리, 종이는 종이, 캔은 캔. 세상도 이렇게만 되면 좋겠어.', 'Glass with glass, paper with paper, cans with cans. If only the world worked like that.'),
      KS('근데 몇 개가 아직 안 내려왔어. 굴러다니는 거 보이면 좀 갖다줘.', 'But a few things never came down. If you see any rolling about, bring them here.')
    ],
    again: [KS('비닐은 씻어서 내놔야 돼. 다들 그걸 몰라.', 'Plastic film has to be rinsed first. Nobody knows that.')],
    fetch: {
      items: [
        { name: 'an empty green bottle', look: 'glass', color: '#3a8a4a' },
        { name: 'a jar with its label scraped off', look: 'jar', color: '#d8c890' },
        { name: 'a bundle of takeaway flyers tied with string', look: 'letter', color: '#e0d8d0' }
      ],
      found: ['She carries it carefully, as if it might get sorted wrong on the way.'],
      partial: [KS('그건 저기. 아니, 저기. 그래. 잘했어.', 'That goes there. No, there. Yes. Good.')],
      done: [
        'Everything is in its bin. The old man looks for a while at the empty strip of ground between the bins.',
        KS('다 제자리가 있는데. 나는 어느 통에 들어가나 몰라.', 'Everything has its place. I wonder which bin I go in.'),
        KS('농담이야. 얼른 들어가. 엄마 기다리시겠다.', 'Only joking. Off you go home. Your mum will be waiting.')
      ]
    },
    reward: 'lore',
    lore: ['She looks back once. He is sweeping the empty strip between the bins, very carefully.']
  });

  S({
    id: 'st_sk_08', kind: 'fetch', where: { themes: ['city', 'korea'], depth: [1, 3] },
    who: { name: 'The Father at the Claw Machine', look: { t: 'adult', c: ['#5a4a3a', '#e0d0b0', '#c89878'] }, lang: 'ko-s' },
    intro: [
      'An unmanned claw-machine shop at 2 a.m., lit like an aquarium. A man in a work jacket stands at one machine.',
      KS('저 토끼 보여? 귀 하나 접힌 거. 우리 딸이 저런 거 좋아해.', 'See that rabbit? The one with a folded ear. My daughter loves those.'),
      KS('동전이 떨어졌네. 세 번만 더 하면 될 것 같은데.', 'Out of coins. Three more goes and I think I’ll have it.')
    ],
    again: [KS('집게가 약해. 일부러 약하게 해놓은 거야. 알면서 하는 거지.', 'The claw is weak. They make it weak on purpose. You know, and you play anyway.')],
    fetch: {
      items: [
        { name: 'a 500-won coin', look: 'coin', color: '#d8d8c8' },
        { name: 'another 500-won coin', look: 'coin', color: '#d8d8c8' },
        { name: 'a slightly bent 500-won coin', look: 'coin', color: '#c8c0a8' }
      ],
      found: ['It was lodged under the change machine, heads up, as if it had been waiting.'],
      partial: [KS('한 판 더. 이번엔 진짜다.', 'One more go. This time for real.')],
      done: [
        'The third coin. The claw closes on the folded ear, wobbles all the way across and lets go over the chute.',
        KS('…잡았다. 잡았어!', '…Got it. I actually got it!'),
        'He holds the rabbit for a long moment. Then he puts it in her arms.',
        KS('너 가져. 우리 딸 이제 스물여섯이야. 이런 거 안 좋아해.', 'You keep it. My daughter is twenty-six now. She doesn’t like these any more.')
      ]
    },
    reward: 'photo',
    lore: [KS('그래도 매일 와. 버릇이 돼서.', 'I still come every night. It’s become a habit.')]
  });

  S({
    id: 'st_sk_09', kind: 'fetch', where: { themes: ['city', 'water', 'korea'], depth: [2, 3] },
    who: { name: 'The Woman in the Sheep-Ear Towel', look: { t: 'adult', c: ['#e8a0a0', '#f0f0e8', '#d8b090'] }, lang: 'ko-s' },
    intro: [
      'A bathhouse at 5 a.m.: heated floors, sleepers under orange lights.',
      'A woman sits cross-legged, a towel rolled around her head into two little sheep’s ears.',
      KS('사물함 열쇠를 잃어버렸어. 팔찌처럼 차는 거 있잖아.', 'I’ve lost my locker key. You know, the kind you wear like a bracelet.'),
      KS('그게 없으면 못 나가. 옷이 다 거기 있거든. 사실 나가기 싫기도 하고.', 'Without it I can’t leave. My clothes are all in there. Truth is, I don’t want to leave.')
    ],
    again: [KS('불가마 안은 봤어? 거기 들어가면 다 잊어버려. 열쇠도, 회사도.', 'Did you look in the kiln room? You forget everything in there. Keys, work, all of it.')],
    fetch: {
      items: [{ name: 'a locker key on an orange rubber band, number 1004', look: 'keyring', color: '#e86a3a' }],
      found: ['The rubber band is damp and cold, as if it has spent years at the bottom of the cold pool.'],
      done: [
        KS('천사 번. 천사. 웃기지? 그래서 골랐어.', 'Number 1004. Cheon-sa, like “angel”. Silly, isn’t it? That’s why I picked it.'),
        'She turns the key over and over in her fingers, but she does not get up.',
        KS('조금만 더 누워 있을게. 아침 되면 출근해야 되니까.', 'I’ll lie here a little longer. When morning comes I have to go to work.'),
        KS('계란 줄까? 아, 다 먹었네. 그럼 이거라도.', 'Want an egg? Oh, I’ve eaten them all. Take this, then.')
      ]
    },
    reward: 'coin'
  });

  S({
    id: 'st_sk_10', kind: 'fetch', where: { themes: ['institution', 'office', 'korea'], depth: [2, 4] },
    who: { name: 'The Clerk at Window Three', look: { t: 'adult', c: ['#2a3a5a', '#e8e8f0', '#d0b8a0'] }, lang: 'ko-s' },
    intro: [
      'A community service centre long after closing. One window is lit. The ticket machine hums and prints: 0001.',
      KS('0001번 고객님. 네, 앉으세요. 어떤 서류 떼러 오셨어요?', 'Customer 0001. Yes, have a seat. Which document did you come for?'),
      'Before she can answer, the clerk is already typing.',
      KS('가족관계증명서네요. 본인 도장이랑 사진 한 장 있어야 돼요.', 'A family relations certificate. I’ll need your personal seal and one photo.')
    ],
    again: [KS('규정이라서요. 저도 어쩔 수가 없어요.', 'It’s the regulations. There’s nothing I can do either.')],
    fetch: {
      items: [
        { name: 'a small red seal with her name carved in it', look: 'stamp', color: '#c03a3a' },
        { name: 'an ID photo with its corners trimmed', look: 'photo', color: '#d8e0e8' }
      ],
      found: ['She has never owned one of these. It fits her hand anyway.'],
      partial: [KS('하나 됐고요. 나머지 하나 주세요.', 'That’s one. Now the other one, please.')],
      done: [
        'The clerk stamps the form twice, slides it under the glass and turns it round so that she can read it.',
        'Under Guardian, someone has typed: see above. Above, both lines are blank.',
        KS('…전산 오류일 거예요. 아마도요.', '…Probably a system error. Probably.'),
        KS('수수료는 됐어요. 오늘은 제가 낼게요.', 'Never mind the fee. Today it’s on me.')
      ]
    },
    reward: 'page'
  });

  S({
    id: 'st_sk_11', kind: 'fetch', where: { themes: ['beach', 'water', 'korea'], depth: [2, 4] },
    who: { name: 'The Old Sea Diver', look: { t: 'old', c: ['#1a1a2a', '#e86a2a', '#a87858', '#e8e0d0'] }, lang: 'ko-s' },
    intro: [
      'On black volcanic rock, an old woman in a diving suit sits beside an orange float. Her eyes are very red.',
      KS('혼저 옵서예. 나 잠을 못 자. 물에서 나온 뒤로 계속.', 'Welcome, welcome. I can’t sleep. Not since I came out of the water.'),
      KS('저 밑에 소라 하나 있어. 열두 살 때 처음 딴 거. 그 안에 바다 소리가 있어.', 'There’s a conch down there. The first one I ever took, at twelve. The sea’s sound is in it.')
    ],
    again: [KS('나는 이제 못 들어가. 무릎이 바다를 잊어버렸어.', 'I can’t go in any more. My knees have forgotten the sea.')],
    fetch: {
      items: [{ name: 'a conch shell, heavy with seawater', look: 'shell', color: '#e8c8a0' }],
      found: ['She holds it to her ear. Inside, someone is breathing out in a long, thin whistle.'],
      done: [
        'The old woman empties the seawater from the shell and lies back on the warm rock, the conch at her ear.',
        KS('그래, 이 소리. 우리 엄마 숨소리. 물 위로 올라올 때.', 'Yes, that sound. My mother’s breath, when she came up for air.'),
        'Her own breathing slows to match it. Soon she is asleep, the float rocking gently against her knee.'
      ]
    },
    reward: 'none',
    lore: ['The tide comes in very quietly, so as not to wake her.']
  });

  /* ---------------------------------------------------------------- CHOICE */

  S({
    id: 'st_sk_12', kind: 'choice', where: { themes: ['city', 'korea'], depth: [1, 3] },
    who: { name: 'The Night Clerk at the Corner Store', look: { t: 'humanoid', c: ['#3a7a9a', '#f0f0f0', '#e0c8a8'] }, lang: 'ko-s' },
    intro: [
      'A convenience store at 4 a.m. The fridges hum in harmony. Behind the till, a young clerk reads a textbook.',
      KS('어서 오세요. …아, 손님이구나. 바람인 줄 알았네.', 'Welcome. …Oh, a customer. I thought it was the wind.')
    ],
    again: [KS('천천히 고르세요. 아침까지 시간 많아요.', 'Take your time. There’s plenty of time until morning.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: ['She sets a triangle of rice and seaweed on the counter. He scans it twice; it beeps once.',
            KS('봉투 필요하세요? 봉투는 백 원 따로예요.', 'Do you need a bag? Bags are a hundred won extra.')],
          choices: [{ label: 'Yes, a bag', to: 'q_bag' }, { label: 'No bag', to: 'q_heat' }, { label: 'Just looking', to: 'e_look' }]
        },
        q_bag: {
          say: [KS('백 원이요. …없어요? 괜찮아요. 제가 낼게요.', 'A hundred won. …You don’t have it? That’s fine. I’ll pay.'),
            'He puts the rice triangle in a bag big enough for a television.'],
          choices: [{ label: 'Thank him', to: 'e_thanks' }, { label: 'Ask what he studies', to: 'q_study' }]
        },
        q_heat: {
          say: [KS('데워드릴까요? 삼각김밥은 원래 잘 안 데우는데.', 'Shall I heat it up? People don’t usually heat rice triangles.')],
          choices: [{ label: 'Heat it', to: 'e_warm' }, { label: 'Cold is fine', to: 'q_study' }]
        },
        q_study: {
          say: ['He tilts the textbook so she can see: civil service exam, year five. Tiny coloured tabs on every page.',
            KS('낮에는 공부하고 밤에는 여기 있어요. 잠은 버스에서 자고요.', 'Study by day, here by night. I sleep on the bus.'),
            KS('저 붙을 것 같아요? 솔직하게요.', 'Do you think I’ll pass? Be honest.')],
          choices: [{ label: 'Yes', to: 'e_yes' }, { label: 'I don’t know', to: 'e_unsure' }, { label: 'Go to sleep', to: 'e_nap' }]
        }
      },
      endings: {
        e_look: { say: [KS('네, 구경하세요. 새벽엔 다들 구경만 해요.', 'Sure, look around. At this hour everyone only looks.')], reward: 'none' },
        e_thanks: { say: [KS('뭘요. 백 원으로 좋은 사람 되면 싼 거죠.', 'Don’t mention it. A hundred won is cheap, for being a good person.')], reward: 'coin' },
        e_warm: { say: ['The microwave turns the rice triangle round and round under its little light, like a tiny stage.',
          KS('이상하죠? 근데 새벽엔 따뜻한 게 나아요.', 'Strange, right? But at dawn, warm is better.')], reward: 'page' },
        e_yes: { say: [KS('…그 말, 오 년 만에 처음 들어봐요.', '…That’s the first time anyone’s said that in five years.'),
          'He writes something small in the margin of the textbook and underlines it twice.'], reward: 'photo' },
        e_unsure: { say: [KS('맞아요. 아무도 몰라요. 그게 제일 정직한 대답이에요.', 'Right. Nobody knows. That’s the most honest answer there is.')], reward: 'none' },
        e_nap: { say: ['He laughs, then lays his head on the open textbook. The fridges hum lower, as if to help.',
          KS('딱 오 분만요. 손님 오면 깨워주세요.', 'Just five minutes. Wake me if a customer comes in.')], reward: 'lore' }
      }
    }
  });

  S({
    id: 'st_sk_13', kind: 'choice', where: { themes: ['office', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The Team Leader on the Roof', look: { t: 'adult', c: ['#2a2a3a', '#f0f0f0', '#d0a888', '#c84a3a'] }, lang: 'ko-s' },
    intro: [
      'The roof of an office tower. A box of fried chicken, two cans of beer, one plastic chair.',
      'In the chair, a man with his tie pulled loose.',
      KS('회식 끝나고 혼자 2차 중이야. 앉아. 의자는 없지만.', 'Team dinner’s over. This is my private second round. Sit. There’s no chair, but sit.')
    ],
    again: [KS('식기 전에 와. 치킨은 식으면 그냥 슬픈 고기야.', 'Come before it goes cold. Cold chicken is just sad meat.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('양념이야, 후라이드야? 이걸로 사람 다 알 수 있어.', 'Sweet-spicy or plain fried? That tells you everything about a person.')],
          choices: [{ label: 'Sweet-spicy', to: 'q_sweet' }, { label: 'Plain fried', to: 'q_plain' }, { label: 'Half and half', to: 'q_half' }]
        },
        q_sweet: {
          say: [KS('달달한 거 좋아하는구나. 나도 그랬어. 입사하기 전에는.', 'You like it sweet. So did I. Before I joined the company.'),
            'He pulls a white envelope halfway out of his jacket, looks at it, and pushes it back in.'],
          choices: [{ label: 'What’s that?', to: 'q_letter' }, { label: 'Eat quietly', to: 'e_quiet' }]
        },
        q_plain: {
          say: [KS('기본이 제일이지. 우리 부장님도 맨날 그래. 기본, 기본.', 'The basics are best. My director always says so. Basics, basics.'),
            KS('기본만 이십 년 했어. 이제 기본만 남았어.', 'Twenty years of basics. Now the basics are all that’s left.')],
          choices: [{ label: 'That’s sad', to: 'e_sad' }, { label: 'Basics are good', to: 'e_basics' }]
        },
        q_half: {
          say: [KS('반반! 결정 못 하는 사람이네. 나랑 똑같다.', 'Half and half! Someone who can’t decide. Just like me.'),
            'He takes out a white envelope. On the front, in careful handwriting: RESIGNATION.'],
          choices: [{ label: 'Hand it in', to: 'e_send' }, { label: 'Keep it', to: 'e_keep' }, { label: 'Make a paper plane', to: 'e_plane' }]
        },
        q_letter: {
          say: [KS('사직서. 십 년째 들고 다녀. 부적처럼.', 'My resignation letter. I’ve carried it for ten years. Like a lucky charm.'),
            KS('너라면 낼래?', 'Would you hand it in, if you were me?')],
          choices: [{ label: 'Yes', to: 'e_send' }, { label: 'Not tonight', to: 'e_keep' }, { label: 'Make a paper plane', to: 'e_plane' }]
        }
      },
      endings: {
        e_quiet: { say: ['They eat without a word. Far below, the city turns off its windows floor by floor, like someone tidying up.'], reward: 'lore' },
        e_sad: { say: [KS('슬프지. 그래도 애 학원비는 나와.', 'It is sad. But it pays for my kid’s cram school.'),
          'He gives her the last drumstick, the one that always goes to the youngest.'], reward: 'coin' },
        e_basics: { say: [KS('그래? 네가 그렇게 말하니까 좀 덜 억울하네.', 'Yeah? When you say it, I feel a little less cheated.')], reward: 'none' },
        e_send: { say: [KS('…그래. 내일 아침에. 아니, 지금.', '…Right. Tomorrow morning. No. Now.'),
          'He sits down on the gravel and types on his phone for a long time. Then he laughs once, like a cough.'], reward: 'page' },
        e_keep: { say: [KS('그래, 내일도 들고 다니자. 무거워야 버티지.', 'Yes. I’ll carry it tomorrow too. It has to be heavy, to keep me on my feet.')], reward: 'none' },
        e_plane: { say: ['He folds it with great precision, like a man who has folded a great many documents.',
          'The plane glides off the roof, turns once, and slips into a lit window far below.',
          KS('저기 부장님 방인데. 큰일 났다.', 'That’s the director’s office. I’m in big trouble.'),
          'He is grinning like a schoolboy.'], reward: 'photo' }
      }
    }
  });

  S({
    id: 'st_sk_14', kind: 'choice', where: { themes: ['home', 'korea'], depth: [1, 3] },
    who: { name: 'The Aunt at the Holiday Table', look: { t: 'adult', c: ['#a04a6a', '#f0d8c0', '#e0b898'] }, lang: 'ko-s' },
    intro: [
      'A low table laid for twenty with pancakes, rice cakes and fruit. Only one aunt, with a fresh perm, sits at it.',
      KS('어머, 왔니? 많이 컸다. 이리 와 앉아. 물어볼 게 많아.', 'Oh, you came! Look how you’ve grown. Come, sit. I’ve got so much to ask.')
    ],
    again: [KS('전 하나 더 먹어. 너무 말랐다. 아니, 좀 쪘나?', 'Have another pancake. You’re too thin. Or have you put on a bit?')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('요즘 공부는 잘 하고? 반에서 몇 등 해?', 'How’s school going? Where do you rank in your class?')],
          choices: [{ label: 'First', to: 'q_first' }, { label: 'Last', to: 'q_last' }, { label: 'I don’t go', to: 'q_noschool' }, { label: 'Pass the fruit', to: 'e_fruit' }]
        },
        q_first: {
          say: [KS('일 등? 어머, 그럼 의대 가야겠다. 아니면 법대.', 'First? My goodness, then it’s medical school. Or law.'),
            KS('남자친구는? 아직 없지? 없어야지. 공부해야지.', 'A boyfriend? Not yet, surely. Better not. You need to study.')],
          choices: [{ label: 'I have one', to: 'e_boyfriend' }, { label: 'Ask about her', to: 'q_her' }]
        },
        q_last: {
          say: [KS('꼴등? …어머.', 'Last? …Oh my.'),
            'For a moment she has nothing to say. It is the first silence of the whole holiday.'],
          choices: [{ label: 'It’s fine', to: 'e_fine' }, { label: 'Ask about her', to: 'q_her' }]
        },
        q_noschool: {
          say: [KS('학교를 안 가? 그럼 낮에는 뭐 해?', 'You don’t go to school? Then what do you do all day?'),
            'She leans closer. She does not look shocked. She looks curious, the way a child would.'],
          choices: [{ label: 'I sleep', to: 'e_sleep' }, { label: 'Ask about her', to: 'q_her' }]
        },
        q_her: {
          say: ['The aunt blinks, as if nobody has asked her anything in years.',
            KS('나? 나는… 원래 그림 그리는 사람 되고 싶었어.', 'Me? I… I wanted to be a painter, once.'),
            KS('웃기지? 지금은 전만 부쳐.', 'Funny, right? Now I just fry pancakes.')],
          choices: [{ label: 'Paint something', to: 'e_paint' }, { label: 'Pancakes are art', to: 'e_art' }]
        }
      },
      endings: {
        e_fruit: { say: ['She passes the persimmons. The aunt keeps talking, but now with her mouth full, which is an improvement.'], reward: 'none' },
        e_boyfriend: { say: [KS('뭐? 누구? 어느 대학? 키는? 부모님은 뭐 하셔?', 'What? Who? Which university? How tall? What do his parents do?'),
          'The questions keep coming long after she has left the table.'], reward: 'none' },
        e_fine: { say: [KS('…그래, 괜찮아. 등수가 뭐라고.', '…Yes. It’s fine. What’s a rank, anyway.'),
          'She presses a folded banknote into her hand, the way aunts do, as if it were a secret.'], reward: 'coin' },
        e_sleep: { say: [KS('잠? 좋겠다. 나는 명절엔 세 시간 자.', 'Sleep? Lucky you. Over the holidays I get three hours a night.'),
          'She rests her chin on her hand. Her eyes close for one second, two, and stay closed.'], reward: 'lore' },
        e_paint: { say: ['The aunt dips a chopstick in soy sauce and draws on a paper napkin.',
          'A mountain, a house, a small figure standing at the door.',
          KS('너야. 아니, 나인가. 가져가.', 'That’s you. Or maybe it’s me. Take it.')], reward: 'page' },
        e_art: { say: [KS('예술? 하하. 그럼 나 이십 년째 전시회 하고 있었네.', 'Art? Ha! Then I’ve been holding an exhibition for twenty years.'),
          'She arranges the pancakes on the plate into a careful flower.'], reward: 'photo' }
      }
    }
  });

  S({
    id: 'st_sk_15', kind: 'choice', where: { themes: ['city', 'korea'], depth: [2, 4] },
    who: { name: 'The Man in Karaoke Room Seven', look: { t: 'adult', c: ['#6a3a8a', '#e0e040', '#d8b090'] }, lang: 'ko-s' },
    intro: [
      'A karaoke room, a mirror ball turning slowly. A man holds a microphone in each hand. The timer reads 00:00.',
      KS('끝난 줄 알았는데 사장님이 서비스 넣어줬어. 또 넣어줬어. 계속 넣어줘.', 'I thought it was over, but the owner gave me bonus time. And again. He keeps on giving it.'),
      'The timer flickers to 00:30.',
      KS('혼자서는 못 나가. 마지막 곡은 같이 불러야 돼. 그게 규칙이야.', 'I can’t leave on my own. The last song has to be sung together. That’s the rule.')
    ],
    again: [KS('탬버린이라도 쳐줄래? 혼자 치면 박수 소리 같지가 않아.', 'Will you at least shake the tambourine? On your own, it doesn’t sound like applause.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('뭐 부를래? 번호만 누르면 돼.', 'What’ll you sing? Just punch in the number.'),
            'The songbook is as thick as a phone directory. Every title is blurred except three.'],
          choices: [{ label: 'A slow ballad', to: 'q_ballad' }, { label: 'An old trot song', to: 'q_trot' }, { label: 'Press cancel', to: 'q_cancel' }]
        },
        q_ballad: {
          say: ['The screen shows a beach at sunset: the same three seconds of waves, over and over.',
            KS('이 노래, 팀원들 다 집에 가고 나서 혼자 부르던 거야.', 'I used to sing this one alone, after the whole team had gone home.')],
          choices: [{ label: 'Sing along', to: 'e_duet' }, { label: 'Just listen', to: 'e_listen' }]
        },
        q_trot: {
          say: [KS('트로트! 어린 애가 뭘 좀 아네. 우리 아버지 노래야.', 'Trot! A youngster who knows a thing or two. That’s my father’s song.'),
            'He loosens his tie and does a small, extremely serious dance step.'],
          choices: [{ label: 'Dance too', to: 'e_dance' }, { label: 'Ask about his father', to: 'q_father' }]
        },
        q_father: {
          say: [KS('아버지도 여기서 불렀어. 이 방에서. 이 번호로.', 'My father sang here too. This room. This number.'),
            KS('다 부르고 나서 나가셨지. 원래 그렇게 나가는 거야.', 'He finished the song, and then he left. That’s how you’re meant to leave.')],
          choices: [{ label: 'Then sing it', to: 'e_out' }, { label: 'Stay a bit', to: 'e_stay' }]
        },
        q_cancel: {
          say: ['She presses the red button. The screen asks, in huge letters: END THE SESSION?',
            KS('…진짜로? 아직 삼십 초 남았는데.', '…Really? There are still thirty seconds left.')],
          choices: [{ label: 'Really', to: 'e_end' }, { label: 'Not yet', to: 'e_stay' }]
        }
      },
      endings: {
        e_duet: { say: ['They sing. Neither knows the words, and the words on the screen are blank. At the end, the score says 100.',
          KS('백 점. 태어나서 처음이야. 이제 나가도 되겠다.', 'A hundred points. First time in my life. Now I can go.')], reward: 'photo' },
        e_listen: { say: ['He sings the whole song to the empty sofa where his team used to sit. His voice is surprisingly good.',
          KS('들어줘서 고마워. 그게 반이야.', 'Thanks for listening. That’s half of it.')], reward: 'lore' },
        e_dance: { say: ['The mirror ball speeds up. For one whole chorus, the little room is a wedding hall in the countryside.',
          KS('오, 잘하네! 우리 아버지가 봤으면 좋아했겠다.', 'Oh, you’re good! My father would have loved that.')], reward: 'coin' },
        e_out: { say: ['The song ends. The timer reads 00:00 and, for once, it stays there.',
          KS('자, 가자. 문 열렸다.', 'Right, let’s go. The door’s open.'),
          'Beyond the door is a long corridor of karaoke rooms. Every timer in every room reads 00:00.'], reward: 'secret' },
        e_stay: { say: [KS('그래. 조금만 더. 사장님이 또 넣어줄 거야.', 'All right. A little longer. The owner will give us more.'),
          'The timer clicks over to 00:30. It always will.'], reward: 'none' },
        e_end: { say: ['The lights come up, white and ordinary. The man has gone.',
          'His two microphones lie crossed on the table, like a pair of chopsticks.'], reward: 'page' }
      }
    }
  });

  S({
    id: 'st_sk_16', kind: 'choice', where: { themes: ['office', 'city', 'korea'], depth: [2, 4] },
    who: { name: 'The Man Who Waits for the Director', look: { t: 'adult', c: ['#3a3a3a', '#e8e8e8', '#c8b0a0'] }, lang: 'ko-s' },
    intro: [
      'An open-plan office at 1 a.m. Every desk lamp is on. A tired man in shirtsleeves sits very straight.',
      'He is watching a glass office. Inside, a figure in a dark suit sits with its back to the room, quite still.',
      KS('부장님이 아직 안 가셨어. 먼저 가면 안 되지.', 'The director hasn’t gone home yet. You can’t leave before him.')
    ],
    again: [KS('조용히. 키보드 소리라도 내. 일하는 것처럼.', 'Quietly. At least make keyboard noises. Like you’re working.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [KS('너 새로 온 인턴이야? 눈치껏 퇴근하는 법 알려줄까?', 'You the new intern? Want me to show you how to slip out without anyone noticing?')],
          choices: [{ label: 'Show me', to: 'q_teach' }, { label: 'Just go home', to: 'q_go' }, { label: 'Knock on the glass', to: 'q_knock' }]
        },
        q_teach: {
          say: [KS('일단 재킷은 의자에 걸어둬. 그리고 화장실 가는 척 나가는 거야.', 'First, leave your jacket on the chair. Then walk out as if you’re going to the toilet.'),
            KS('나 그거 십오 년 했어. 진짜로 나간 적은 한 번도 없고.', 'I’ve done that for fifteen years. I’ve never actually left.')],
          choices: [{ label: 'Try it together', to: 'e_jacket' }, { label: 'That’s silly', to: 'e_silly' }]
        },
        q_go: {
          say: ['She stands and buttons her coat. The whole office holds its breath. The ceiling lights buzz louder.',
            KS('야, 야! 진짜 가? …진짜 가네.', 'Hey, hey! You’re really going? …She’s really going.')],
          choices: [{ label: 'Come with me', to: 'e_together' }, { label: 'Wave goodbye', to: 'e_alone' }]
        },
        q_knock: {
          say: ['She knocks on the glass. The figure inside turns slowly on its swivel chair.',
            'It is a tailor’s dummy in a very good suit. A sticky note on its chest reads: DON’T WAIT FOR ME.'],
          choices: [{ label: 'Show him the note', to: 'e_note' }, { label: 'Pocket the note', to: 'e_hide' }]
        }
      },
      endings: {
        e_jacket: { say: ['They hang their jackets on their chairs and stroll towards the toilets, very casually, and keep going.',
          KS('계단이다. 계단이 이렇게 생겼었구나.', 'Stairs. So this is what the stairs look like.')], reward: 'coin' },
        e_silly: { say: [KS('바보 같지. 근데 다 이래. 바보 같은 게 규칙이야.', 'It is silly. But everyone does it. Being silly is the rule.')], reward: 'none' },
        e_together: { say: ['He looks at the glass office, then at her, then at the glass office. Then he switches off his lamp.',
          'Behind them, one by one, every lamp on the floor goes out.'], reward: 'lore' },
        e_alone: { say: [KS('내일 보자. 아니, 너는 내일 오지 마.', 'See you tomorrow. No. Don’t you come tomorrow.'),
          'From the street, she can see his lamp, still on, the only one in the tower.'], reward: 'none' },
        e_note: { say: ['He reads the note three times. He laughs, puts his face in his hands, and laughs again.',
          KS('십오 년. 십오 년 동안 마네킹 눈치를 봤네.', 'Fifteen years. Fifteen years of minding a mannequin.')], reward: 'photo' },
        e_hide: { say: ['She folds the note into her pocket. The dummy turns slowly back to face the wall.',
          KS('왜? 뭐라고 쓰여 있었어? …아니야. 말 안 해도 돼.', 'What? What did it say? …No. You don’t have to tell me.')], reward: 'page' }
      }
    }
  });

  S({
    id: 'st_sk_17', kind: 'choice', where: { themes: ['city', 'korea'], depth: [1, 3] },
    who: { name: 'The Girl Who Leaves Room in the Frame', look: { t: 'humanoid', c: ['#e8b0c8', '#2a2a3a', '#f0d8c0'] }, lang: 'en' },
    intro: [
      'A photo booth in a shopping street that closed hours ago. Its curtain glows pink.',
      'Inside, a girl in a school uniform is posing. She always stands to the left, leaving room for someone.',
      EN('Oh! Finally. You can be the other half. Four shots, ten seconds each.')
    ],
    again: [EN('It stopped taking my money ages ago. It just keeps flashing. Get in.')],
    choice: {
      start: 'q1',
      nodes: {
        q1: {
          say: [EN('First shot. What pose? Everyone does the finger heart. I hate the finger heart.')],
          choices: [{ label: 'Finger heart', to: 'q_heart' }, { label: 'Something weird', to: 'q_weird' }, { label: 'Don’t pose', to: 'q_still' }]
        },
        q_heart: {
          say: ['Flash. She does the finger heart anyway, very small, beside her cheek.',
            EN('Okay, I don’t hate it. My best friend always did it. We had a whole wall of these.'),
            EN('Second shot. Do we smile or not?')],
          choices: [{ label: 'Smile', to: 'q_last' }, { label: 'Don’t smile', to: 'e_serious' }]
        },
        q_weird: {
          say: ['Flash. They both pull faces: a frog face, a fish face.',
            EN('Ha! Next one: we pretend to be asleep. Like we’ve been in here all night.')],
          choices: [{ label: 'Pretend to sleep', to: 'e_asleep' }, { label: 'Another face', to: 'q_last' }]
        },
        q_still: {
          say: ['Flash. She stands still. Beside her, the girl stands still too, and suddenly looks much younger.',
            EN('That one looks like an ID card. Or like the photo they put at the front of the room.')],
          choices: [{ label: 'Retake it', to: 'q_last' }, { label: 'Keep it', to: 'e_portrait' }]
        },
        q_last: {
          say: [EN('Last shot. Say something to the camera. On the last one it records sound. I swear it does.')],
          choices: [{ label: 'Say “cheese”', to: 'e_cheese' }, { label: 'Say “see you”', to: 'e_seeyou' }, { label: 'Say nothing', to: 'e_silent' }]
        }
      },
      endings: {
        e_serious: { say: ['Flash. Two very serious faces, like a band on the cover of a sad album.',
          EN('We look like we’ve been through something. Have we?')], reward: 'none' },
        e_asleep: { say: ['Flash. They lean on each other with their eyes shut. When she opens hers, the bench beside her is empty.',
          'The strip slides out of the slot. In all four frames, she is alone, asleep.'], reward: 'lore' },
        e_portrait: { say: ['A strip slides out with a single photo on it. The girl folds the empty half underneath.',
          EN('Thanks. Mum only ever keeps the serious ones.')], reward: 'page' },
        e_cheese: { say: ['Flash. The strip slides out: four frames, two girls, and in the last one they are both laughing.',
          EN('Keep it. I’ve got a whole wall. You’ve got none, right?')], reward: 'photo' },
        e_seeyou: { say: ['She says it. The booth plays it back tinnily, then in the girl’s voice, then in a voice neither of them knows.',
          EN('See you. That’s what she said too. I think she meant it.')], reward: 'coin' },
        e_silent: { say: ['Ten seconds of silence. The flash never comes. The girl laughs, softly.',
          EN('Yeah. That’s the best one. The one that didn’t take.')], reward: 'none' }
      }
    }
  });

  /* ------------------------------------------------------------------ WORD */

  S({
    id: 'st_sk_18', kind: 'word', where: { themes: ['school', 'city', 'korea'], depth: [1, 3] },
    who: { name: 'The English Teacher at Eleven', look: { t: 'adult', c: ['#4a5a3a', '#e0d8c8', '#e8c8b0'] }, lang: 'en' },
    intro: [
      'A cram-school classroom on the sixth floor, above a fried-chicken shop. Forty desks, all of them empty.',
      'A man in a cardigan is writing on the whiteboard.',
      EN('Okay, class. Last vocabulary word of the night, then you can all run to your next academy.'),
      EN('Anyone? Nobody? You’re all so tired. I don’t blame you. I’m tired too.')
    ],
    again: [EN('I’ll wait. I’m paid until midnight. In a way, so are you.')],
    word: {
      words: ['asleep', 'sleep', 'sleeping', 'dream', 'dreaming'],
      hint: ['On the whiteboard, in green marker: AWAKE ↔ ______.',
        EN('The opposite. The thing none of you ever get enough of. The thing some of you are doing right now.')],
      heard: [EN('Yes! Somebody was listening. Somebody always is, at the back.'),
        'He draws a huge tick on the board, caps the marker and puts it in his pocket.',
        EN('Class dismissed. All of you. Go home and practise it. That’s your homework.')],
      wrong: [EN('Close. No. Not close at all. But I like that you tried.')]
    },
    reward: 'page',
    lore: ['When she looks back from the door, every desk has a head resting on it, very peacefully.']
  });

  S({
    id: 'st_sk_19', kind: 'word', where: { themes: ['home', 'city'], depth: [1, 2] },
    who: { name: 'The Dog Who Faces the Door', look: { t: 'dog', c: ['#e8e0c8', '#8a5a3a', '#2a2a2a'] }, lang: 'ko-s' },
    intro: [
      'A small flat, very tidy and very quiet. A white dog lies with its chin on the doormat, facing the door.',
      KS('…멍.', '…Woof.'),
      'A note on the fridge: Back late again. Food in the bowl. Sorry. The bowl is full. The dog has not touched it.'
    ],
    again: [KS('끼잉.', '(a small whine)')],
    word: {
      words: ['walk', 'walkies', 'sanchaek', '산책', 'go out', 'outside'],
      hint: ['The lead hangs from its hook beside the door. The dog looks at the lead, then at her, then at the lead.',
        'Then at her shoes. Then at the lead again, with enormous patience.'],
      heard: ['The dog is on its feet before she has finished the word. Its whole body is wagging.',
        KS('멍! 멍멍!', 'Woof! Woof woof!'),
        'They go once around the block. The dog stops at every tree to read the news.',
        'Back home it lies down to wait again, but now its tail keeps thumping the mat.'],
      wrong: ['The dog tilts its head politely, the way it does for the television.']
    },
    reward: 'coin',
    lore: ['Where the dog was lying, under the mat, there is a coin it has been keeping warm.']
  });

  S({
    id: 'st_sk_20', kind: 'word', where: { themes: ['school', 'institution', 'korea'], depth: [2, 4] },
    who: { name: 'The Student Who Finished the Exam', look: { t: 'kid', c: ['#2a3a5a', '#e8e8e8', '#f0d0b0'] }, lang: 'ko-s' },
    intro: [
      'A school gate after dark on the day of the big exam. Rows of folding stools where the mothers waited, empty.',
      'One student stands among them, holding a clear plastic pencil case.',
      KS('끝났어요. 십이 년 동안 이거 하나 보고 왔는데, 아홉 시간 만에 끝났어요.', 'It’s over. Twelve years aiming at this one thing, and it was over in nine hours.'),
      KS('듣기 시험 때는 비행기도 안 떴대요. 우리 때문에. 하늘이 엄청 조용했어요.', 'During the listening test, even the planes stayed down. For us. The sky was so quiet.')
    ],
    again: [KS('엄마는 아직이에요. 회사에서 빠져나오기 힘들대요.', 'Mum’s not here yet. She says it’s hard to get away from work.')],
    word: {
      words: ['sugohaesseo', 'sugohaesseoyo', 'sugo', '수고했어', '수고했어요', '수고', 'gosaenghaesseo', '고생했어', '고생 많았어',
        'well done', 'welldone', 'good job', 'goodjob', 'good work', 'you did well', 'you worked hard', 'worked hard'],
      hint: [KS('나오는 애들마다 엄마들이 안아주면서 똑같은 말을 했어요.', 'Every kid who came out got a hug from their mum, and the same few words.'),
        KS('잘 봤냐고 묻는 거 말고요. 그 전에요. 고생한 사람한테 하는 말.', 'Not “how did it go”. Before that. What you say to someone who has worked so hard.'),
        KS('그 말 한 번만 들으면 집에 갈 수 있을 것 같아요.', 'If I heard it just once, I think I could go home.')],
      heard: ['The student’s shoulders drop all at once, as if a heavy bag has been lifted off them.',
        KS('…네. 저 수고했어요. 진짜로.', '…Yes. I did work hard. I really did.'),
        KS('이제 집에 가서 자도 되겠다. 열두 시간.', 'Now I can go home and sleep. Twelve hours straight.')],
      wrong: [KS('음… 그거 아닌 것 같아요. 엄마들은 그렇게 말 안 해요.', 'Hmm… not that. That’s not how mums talk.')]
    },
    reward: 'lore',
    lore: ['High above, the first plane of the night crosses the sky, very loud after all that quiet.']
  });

  S({
    id: 'st_sk_21', kind: 'word', where: { themes: ['city', 'korea'], depth: [1, 3] },
    who: { name: 'The Boy at Seat Twenty-Seven', look: { t: 'kid', c: ['#2a2a4a', '#40e0a0', '#e0c8a8'] }, lang: 'ko-s' },
    intro: [
      'A PC bang at dawn: rows of glowing screens, the smell of cup noodles.',
      'One boy in a hoodie sits with headphones round his neck, staring at a screen that says WAIT.',
      KS('삼 일째예요. 아니, 사 일인가? 시간을 계속 충전했거든요.', 'Day three. Or is it four? I kept topping up my time.'),
      KS('근데 이상해요. 제 이름이 기억이 안 나요. 아이디만 생각나요.', 'But it’s weird. I can’t remember my name. Only my username.')
    ],
    again: [KS('부활 대기 중이에요. 칠 초. 칠 초가 원래 이렇게 길었나.', 'Waiting to respawn. Seven seconds. Were seven seconds always this long?')],
    word: {
      words: ['minjun', 'minjoon', '민준', '민준아', '민준이'],
      hint: ['On the counter monitor, a sticky note in hurried writing: SEAT 27 — MINJUN — MOTHER PHONED (3 TIMES).',
        KS('누가 불러주면 생각날 것 같은데.', 'If someone called me by it, I think it would come back.')],
      heard: ['The boy pulls off his headphones. On his screen, the game carries on without him.',
        KS('…민준. 맞다, 민준이. 엄마가 그렇게 불렀어요. 밥 먹으라고.', '…Minjun. That’s right, Minjun. That’s what Mum called me. To come and eat.'),
        KS('전화해봐야겠다. 세 번이나 했대요.', 'I should call her back. Three times, she called.')],
      wrong: [KS('아닌 것 같아요. 그건 다른 애 이름 같아요.', 'I don’t think so. That sounds like some other kid’s name.')]
    },
    reward: 'photo',
    lore: ['On the screen, his little character stands still at last, politely waiting for him to come back.']
  });

  S({
    id: 'st_sk_22', kind: 'word', where: { themes: ['snow', 'city', 'korea'], depth: [2, 4] },
    who: { name: 'The Man Who Clears the Snow at Night', look: { t: 'adult', c: ['#e8a030', '#3a3a3a', '#c89878'] }, lang: 'ko-s' },
    intro: [
      'A wide road under heavy snow, 5 a.m. A man in an orange vest leans on a shovel beside a small yellow plough.',
      KS('밤새 길 치웠어. 사람들 출근하라고.', 'I cleared the roads all night. So people can get to work.'),
      KS('다 치우면 해가 떠. 그럼 다들 인사해. 좋은 아침이에요, 하고.', 'When I’m done, the sun comes up. Then everyone greets me. “Good morning,” they say.'),
      KS('근데 난 이제 자러 가는 건데. 반대 인사는 아무도 안 해줘.', 'But I’m only just going to bed. Nobody ever says the other one.')
    ],
    again: [KS('눈이 또 오네. 눈은 퇴근을 몰라.', 'More snow. Snow doesn’t know when to clock off.')],
    word: {
      words: ['good night', 'goodnight', 'night night', 'sleep well', 'sweet dreams', 'jalja', 'jaljayo',
        '잘자', '잘 자', '잘자요', '잘 자요', '안녕히 주무세요', 'annyeonghi jumuseyo'],
      hint: ['Behind him, the sun is rising over the tower blocks. He yawns so widely that his hat slips.',
        KS('딱 한 번 들어보고 싶어. 자러 가는 사람한테 하는 말.', 'Just once, I’d like to hear it. What you say to someone who’s off to sleep.')],
      heard: ['He stops leaning on the shovel. For a moment he looks like a boy being tucked in.',
        KS('…응. 너도. 너도 잘 자.', '…Yeah. You too. You sleep well too.'),
        'He climbs into the little plough, pulls his hat over his eyes and is asleep before the snow covers the glass.'],
      wrong: [KS('음, 그것도 좋은 말이네. 근데 그거 말고.', 'Hm. That’s a nice thing to say too. But not that one.')]
    },
    reward: 'none',
    lore: [KS('일어나면 또 밤이겠지. 괜찮아. 길은 내가 알아.', 'When I wake up it’ll be night again. That’s fine. I know the roads.')]
  });
})(typeof window !== 'undefined' ? window : globalThis);
