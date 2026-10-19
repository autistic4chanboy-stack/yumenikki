/* Histoires — the North, where everything is fine */
(function (root) {
  'use strict';
  var YN = root.YN, S = YN.addStory;
  function EN(t) { return { t: t, lang: 'en' }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }

  S({
    id: 'st_nk_01', kind: 'word', where: { themes: ['north', 'city', 'snow'], depth: [1, 3] },
    who: { name: 'The Dawn Loudspeaker', look: { t: 'tall', c: ['#7a7a80', '#c03030', '#d0d0c8'] }, lang: 'ko-n' },
    intro: [
      'At the top of a pole, a loudspeaker clears its throat. It is five in the morning, as always.',
      KN('공화국의 아침을 알립니다. 오늘도 하늘은 맑고 푸릅니다.', 'Good morning, Republic. Today again, the sky is clear and blue.'),
      'Snow is falling on the loudspeaker. A little has already gathered in its mouth.',
      KN('동무, 동무 어깨에 무엇이 내리고 있습니까? 나는 우를 쳐다볼 수 없습니다.', 'Comrade, what is landing on your shoulders? I am not able to look up.')
    ],
    again: [KN('오늘도 하늘은 맑… 맑습니다. 원고에 그렇게 써 있습니다.', 'Today again the sky is clear… clear. That is what my script says.')],
    word: {
      words: ['snow', 'snowing', 'snowflakes', '눈', 'nun'],
      hint: [
        'The snow keeps falling. In the whole street, it is the only thing that moves.',
        KN('희고, 차고, 소리 없이 내리는 것. 내 원고에는 그 낱말이 없습니다.', 'White, cold, falling without a sound. My script doesn’t have that word.')
      ],
      heard: [
        KN('…눈. 눈이 오는구나.', '…Snow. So it’s snowing.'),
        'For a moment the loudspeaker says nothing at all. All over the city, people look up.',
        KN('오늘 아침, 공화국에 눈이 옵니다. 이 말은 원고에 없습니다.', 'This morning, snow is falling on the Republic. These words are not in the script.')
      ],
      wrong: [KN('아닙니다. 동무 어깨에 있는 건 그게 아닙니다.', 'No. That isn’t what is on your shoulders.')]
    },
    reward: 'lore',
    lore: ['A thin cap of snow slides off the loudspeaker, like someone lifting a hat to say hello.']
  });

  S({
    id: 'st_nk_02', kind: 'follow', where: { themes: ['north', 'school', 'city'], depth: [1, 2] },
    who: { name: 'The Girl in the Front Row of the Song', look: { t: 'kid', c: ['#2a3a5a', '#c83030', '#f0d8c0'] }, lang: 'ko-n' },
    intro: [
      'A small girl in a red scarf is singing at the top of her voice, smiling hard, the same verse over and over.',
      KN('해님이 방긋, 우리도 방긋! 해님이 방긋, 우리도 방긋!', 'The sun is smiling, so are we! The sun is smiling, so are we!'),
      KN('백 번 불렀어요. 교양원 선생님은 천 번 부르래요.', 'I’ve sung it a hundred times. Teacher says a thousand.'),
      KN('…동무, 노래가 안 들리는 데 알아요? 나 한 번 가 봤어요.', '…Comrade, do you know a place where you can’t hear the song? I went there once.')
    ],
    again: [KN('해님이 방긋… 아직 있었어요? 그럼 같이 가요.', 'The sun is smiling… You’re still here? Then let’s go together.')],
    follow: {
      start: [
        'She checks that no one is watching, then walks off still singing, so that it doesn’t look like leaving.',
        KN('따라와요. 노래하면서 걸으면 아무도 몰라요.', 'Follow me. If you sing while you walk, nobody can tell.')
      ],
      wait: [
        KN('빨리요! 노래가 끊기면 다들 돌아봐요.', 'Hurry! If the song stops, everyone turns round.'),
        'The girl sings a little louder, to cover for her.'
      ],
      arrive: [
        'Behind the coal shed, between two blind walls, the song from the loudspeakers cannot reach.',
        'The girl stops singing. Her smile stays up for a while on its own, then slowly comes down.',
        KN('여기서는 얼굴이 쉬어요.', 'Here, my face gets to rest.'),
        KN('조금만 있다가 가요. 아주 조금만요.', 'Let’s stay a little before we go back. Just a tiny bit.')
      ],
      to: 'corner'
    },
    reward: 'page',
    lore: ['When she goes back, she is already singing before she reaches the corner.']
  });

  S({
    id: 'st_nk_03', kind: 'choice', where: { themes: ['north', 'institution', 'snow'], depth: [2, 4] },
    who: { name: 'The Attendant Who Holds Up the Flag', look: { t: 'adult', c: ['#2a3a6a', '#d03838', '#e8d0b0'] }, lang: 'ko-n' },
    intro: [
      'On an empty platform, a woman in a blue uniform holds a small red flag above her head. Her arm is trembling.',
      KN('렬차가 도착하고 있습니다! 승객 동무들은 물러서 주십시오!', 'The train is arriving! Passenger comrades, please stand back!'),
      'Past the end of the platform there are no rails. Only snow, very flat, all the way.'
    ],
    again: [KN('렬차는 인차 도착합니다. 인차.', 'The train will be here any minute. Any minute.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KN('동무도 렬차를 기다립니까?', 'Are you waiting for the train too, comrade?')],
        choices: [{ label: 'Yes', to: 'q_yes' }, { label: 'There is no train', to: 'q_none' }, { label: 'Your arm is shaking', to: 'q_arm' }] },
      q_yes: { say: [KN('좋습니다. 어디까지 갑니까? 표를 보여주십시오.', 'Good. How far are you going? Show me your ticket.'), 'She has no ticket. She finds a button in her pocket and holds it out instead.'],
        choices: [{ label: 'Home', to: 'e_home' }, { label: 'Somewhere south', to: 'e_south' }, { label: 'Wherever it goes', to: 'e_any' }] },
      q_none: { say: ['The flag jerks higher. The attendant glances left, then right.', KN('렬차는 도착하고 있습니다. 동무, 나를 따라 말하십시오. 도착하고 있습니다.', 'The train is arriving. Comrade, say it after me. It is arriving.')],
        choices: [{ label: 'It is arriving', to: 'e_repeat' }, { label: 'Stay silent', to: 'e_silent' }] },
      q_arm: { say: [KN('일없습니다. 이 팔은 사십 년 동안 일없었습니다.', 'It’s fine. This arm has been fine for forty years.'), 'The arm shakes a little harder, very proudly.'],
        choices: [{ label: 'Hold the flag for her', to: 'e_hold' }, { label: 'Say nothing', to: 'e_proud' }] } },
      endings: {
        e_home: { say: [KN('집으로요? 집으로 가는 렬차는… 다음 렬차입니다. 언제나 다음 렬차입니다.', 'Home? The train for home is… the next one. It is always the next one.'), 'The attendant punches a neat hole in the button anyway, and hands it back.'], reward: 'page' },
        e_south: { say: ['The attendant’s face goes white, then bright, then smiling.', KN('그런 렬차는 없습니다! 공화국의 렬차는 모두 행복으로 갑니다!', 'There is no such train! Every train of the Republic goes to happiness!'), KN('…남쪽에는 내 동생이 삽니다. 이 말은 동무가 못 들었습니다.', '…My little brother lives in the south. You did not hear that.')], reward: 'lore' },
        e_any: { say: [KN('어디든지요? 그건… 아주 좋은 표입니다.', 'Wherever it goes? That is… a very good ticket.'), KN('나도 그런 표가 한 장 있었으면 좋겠습니다.', 'I wish I had a ticket like that.')], reward: 'coin' },
        e_repeat: { say: [KN('잘했습니다. 아주 잘했습니다.', 'Well done. Very well done.'), 'The attendant breathes out and slips a boiled sweet, wrapped in newspaper, into her hand.'], reward: 'coin' },
        e_silent: { say: ['The silence lasts a long time. Far away, something like a train whistle. Or the wind.', KN('…동무는 정직합니다. 정직은 위험합니다. 그래도 고맙습니다.', '…You are honest. Honesty is dangerous. Thank you all the same.')], reward: 'lore' },
        e_hold: { say: ['She takes the flag. It weighs almost nothing. For the first time in forty years, the attendant lowers her arm.', KN('아… 이렇게 가벼웠구나.', 'Oh… it was this light all along.'), KN('잠깐만. 아주 잠깐만 들고 있어 주십시오.', 'Just a moment. Hold it for me, just for a moment.')], reward: 'photo' },
        e_proud: { say: [KN('보십시오. 일없지요?', 'You see? It’s fine, isn’t it?'), 'The flag stays up. Somewhere a clock ticks, and the train goes on arriving.'], reward: 'none' } } }
  });

  S({
    id: 'st_nk_04', kind: 'fetch', where: { themes: ['north', 'home', 'snow'], depth: [2, 4] },
    who: { name: 'The Woman Who Writes Only the Address', look: { t: 'old', c: ['#4a4a5a', '#e8e0d0', '#d8c0a8'] }, lang: 'ko-n' },
    intro: [
      'An old woman sits at a low table, writing on envelopes. Only on the outside.',
      KN('편지는 안 씁니다. 주소만 씁니다. 속에 쓴 말은 다 지워져서 돌아오니까요.', 'I don’t write the letter. Only the address. Whatever you write inside comes back crossed out.'),
      KN('주소만 맞으면 그 애는 알 겁니다. 오마니가 아직 여기 있다는 걸.', 'If the address is right, he’ll know. That his mother is still here.'),
      KN('그런데 바람이 봉투 세 장을 가져갔습니다. 동무, 좀 찾아주겠습니까?', 'But the wind took three envelopes. Comrade, would you find them for me?')
    ],
    again: [KN('바람은 남쪽으로만 붑니다. 그래도 봉투는 멀리 못 갑니다.', 'The wind only ever blows south. But the envelopes never get very far.')],
    fetch: {
      items: [
        { name: 'an envelope with a faded address', look: 'letter', color: '#e8dcc0' },
        { name: 'an envelope with the address crossed out', look: 'letter', color: '#d8ccb0' },
        { name: 'an envelope with a pressed flower', look: 'letter', color: '#e8c8c8' }
      ],
      found: ['She picks up an envelope. It is empty, and the handwriting on the front is very careful.'],
      partial: [KN('고맙습니다. 아직 바람 속에 남은 게 있습니다.', 'Thank you. There are still some out in the wind.')],
      done: [
        'The old woman lays the three envelopes side by side. Three winters, one address.',
        KN('첫 장은 그 애가 떠난 해에 썼습니다. 둘째 장은 이사 갔나 싶어서 지웠다가… 다시 썼습니다.', 'I wrote the first the year he left. The second I crossed out, thinking he’d moved… then wrote it again.'),
        KN('꽃은 검열에 안 걸립니다. 꽃은 아무 말도 안 하니까요.', 'Flowers never get stopped by the censors. Flowers don’t say anything.'),
        KN('이제 됐습니다. 모든 게 다 좋습니다.', 'There. Now everything is fine.')
      ]
    },
    reward: 'page',
    lore: ['On the back of the last envelope, very small, where nobody looks: “Are you eating properly?”']
  });

  S({
    id: 'st_nk_05', kind: 'word', where: { themes: ['water', 'beach', 'north'], depth: [1, 3] },
    who: { name: 'The Fisherman Who Counts Boats', look: { t: 'old', c: ['#34465a', '#c8a878', '#d8b898'] }, lang: 'ko-n' },
    intro: [
      'An old fisherman sits on an upturned bucket, pointing at boats on a grey sea, one at a time.',
      KN('하나, 둘, 셋, 넷, 다섯, 여섯. 여섯 척. 다 돌아왔습니다.', 'One, two, three, four, five, six. Six boats. They all came back.'),
      KN('아침에 나간 배도 여섯 척이였습니다. 우리 수산사업소는 언제나 여섯 척입니다.', 'Six went out this morning, too. Our fishing station has always had six.')
    ],
    again: [KN('하나, 둘, 셋… 여섯. 여섯. 맞지요?', 'One, two, three… six. Six. That’s right, isn’t it?')],
    word: {
      words: ['seven', 'seventh', '7', '일곱', 'ilgop'],
      hint: [
        'Seven ropes are tied to seven posts on the beach. Six run down into the water. One lies slack on the sand.',
        KN('아침에 셀 때는 손가락이 하나 더 필요했던 것 같은데… 아닙니다. 아무것도 아닙니다.', 'This morning, when I counted, I think I needed one more finger… No. It’s nothing.')
      ],
      heard: [
        'He stops pointing. His hand stays up in the air, holding nothing.',
        KN('일곱. …그래, 일곱이였지. 우리 아들 배까지 일곱.', 'Seven. …Yes. It was seven. Seven, counting my son’s boat.'),
        KN('아무도 그 수를 입에 올리지 않습니다. 동무는 아이라서 셀 줄 아는 겁니다.', 'Nobody says that number out loud. You can still count because you’re a child.')
      ],
      wrong: [KN('아니요. 바다는 그런 수를 모릅니다.', 'No. The sea doesn’t know that number.')]
    },
    reward: 'photo',
    lore: ['Far out on the water, a seventh ripple spreads where there is no boat.']
  });

  S({
    id: 'st_nk_06', kind: 'follow', where: { themes: ['north', 'home', 'nature'], depth: [2, 4] },
    who: { name: 'The Radio With a Lead Seal', look: { t: 'robot', c: ['#6a5038', '#c8b890', '#8a8a8a'] }, lang: 'ko-n' },
    intro: [
      'A wooden radio stands on four short legs. A small lead seal is pressed over its tuning knob.',
      KN('여기는 하나뿐인 방송입니다. 오늘도 모든 것이 좋습니다.', 'This is the one and only station. Today again, everything is good.'),
      KN('동무, 비밀 하나. 제일 높은 언덕에 올라가면 내 바늘이 저절로 움직입니다.', 'Comrade, a secret. On the highest hill, my needle moves all by itself.'),
      KN('혼자서는 못 갑니다. 혼자 다니는 라지오는 신고됩니다.', 'I can’t go alone. A radio walking about on its own gets reported.')
    ],
    again: [KN('모든 것이 좋습니다. 좋습니다. …언덕에는 아직 갈 생각이 있습니까?', 'Everything is good. Good. …Do you still want to go up the hill?')],
    follow: {
      start: [
        KN('따라오십시오. 내가 행진곡을 틀면 사람들은 우리를 쳐다보지 않습니다.', 'Follow me. When I play a march, people stop looking at us.'),
        'The radio waddles off uphill, playing a brave little march to itself.'
      ],
      wait: [KN('동무? 뒤에 처지면 안 됩니다. 혼자 서 있는 라지오는 수상해 보입니다.', 'Comrade? Don’t fall behind. A radio standing about alone looks suspicious.')],
      arrive: [
        'On the last hilltop, where the wind comes in from the sea, the needle quivers under the seal, and slides.',
        'For a few seconds: a different voice. Someone laughing at something. A song with far too many violins.',
        'Then a click, and the march again.',
        KN('…들었습니까? 아무것도 못 들었지요. 나도 못 들었습니다.', '…Did you hear? You heard nothing, didn’t you. Neither did I.')
      ],
      to: 'far'
    },
    reward: 'lore',
    lore: [KN('그 웃음소리, 딱 한 번만 더 듣고 싶습니다.', 'That laughter. I would like to hear it just once more.')]
  });

  S({
    id: 'st_nk_07', kind: 'choice', where: { themes: ['institution', 'north', 'city'], depth: [2, 4] },
    who: { name: 'The Worker Under the Quota Board', look: { t: 'adult', c: ['#4a5a4a', '#b8b8a8', '#e0c8a8'] }, lang: 'ko-n' },
    intro: [
      'Above the machines, a huge board: PLAN FULFILLED 120%. Below it, one woman, and a machine that makes no sound.',
      KN('동무! 마침 잘 왔습니다. 오늘 생산량을 좀 세어 주십시오.', 'Comrade! Just in time. Please count today’s output for me.'),
      'In the crate at her feet there are four bolts.'
    ],
    again: [KN('검열원이 곧 옵니다. 수자가 있어야 합니다.', 'The inspector is coming soon. I need a number.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KN('몇 개입니까? 똑똑히 말해주십시오.', 'How many are there? Say it clearly.')],
        choices: [{ label: 'Four', to: 'q_four' }, { label: 'A hundred and twenty', to: 'q_lie' }, { label: 'Let’s count together', to: 'q_count' }] },
      q_four: { say: ['The worker’s smile doesn’t move at all.', KN('넷. 넷은… 넷은 적은 수가 아닙니다. 넷은 아주 큰 수입니다. 그렇지요?', 'Four. Four is… four is not a small number. Four is a very big number. Isn’t it?')],
        choices: [{ label: 'Four is a lot', to: 'e_lot' }, { label: 'Four is four', to: 'e_true' }] },
      q_lie: { say: [KN('백이십! 계획을 넘쳐 수행하였습니다!', 'A hundred and twenty! The plan is over-fulfilled!'), 'She chalks it on a slate. Then, quietly, she looks down at the crate.', KN('…동무, 그 백이십 개는 어디에 두면 좋겠습니까?', '…Comrade, where should I put the hundred and twenty?')],
        choices: [{ label: 'In the crate', to: 'e_crate' }, { label: 'On the board', to: 'e_board' }, { label: 'Nowhere', to: 'e_nowhere' }] },
      q_count: { say: ['They count together. One. Two. Three. Four.', 'Then the worker keeps going on her own — five, six, seven — louder and louder, faster and faster.'],
        choices: [{ label: 'Stop her gently', to: 'e_stop' }, { label: 'Keep counting with her', to: 'e_along' }] } },
      endings: {
        e_lot: { say: [KN('그렇습니다! 넷은 많습니다. 동무는 똑똑합니다.', 'Exactly! Four is a lot. You’re a clever one.'), 'She polishes each bolt on her sleeve, as if it were a medal.'], reward: 'coin' },
        e_true: { say: [KN('…넷은 넷입니다.', '…Four is four.'), 'For a second she looks very tired, and very young.', KN('그 말을 들은 지 오래됐습니다. 고맙습니다. 이제 가십시오, 검열원이 옵니다.', 'It’s been a long time since I heard that. Thank you. Now go, the inspector is coming.')], reward: 'lore' },
        e_crate: { say: ['She writes 120 on a scrap of paper and lays it in the crate, on top of the four bolts.', KN('이러면 됐습니다. 상자는 거짓말을 안 합니다. 종이만 하지요.', 'There. The crate never lies. Only the paper does.')], reward: 'none' },
        e_board: { say: [KN('그렇지요. 수자는 판에 있으면 됩니다. 판은 아주 높이 있으니까요.', 'Of course. Numbers belong on the board. The board is very high up.'), 'Up there, the board shines. Down here, the machine is silent.'], reward: 'page' },
        e_nowhere: { say: [KN('어디에도… 맞습니다. 그것들은 어디에도 없습니다.', 'Nowhere… Yes. That’s right. They are nowhere.'), 'She laughs, once, behind her hand.', KN('동무, 이건 우리 둘만 아는 수입니다.', 'Comrade, that’s a number only the two of us know.')], reward: 'photo' },
        e_stop: { say: ['She lays a hand on the worker’s sleeve. The counting stops at eighty-one.', KN('…고맙습니다. 혼자서는 멈출 수가 없었습니다.', '…Thank you. I couldn’t stop by myself.')], reward: 'coin' },
        e_along: { say: ['They count together until the numbers are bigger than the factory.', KN('백십구, 백이십! 됐습니다! 계획 완수!', 'A hundred and nineteen, a hundred and twenty! Done! Plan fulfilled!'), 'The crate still holds four bolts. Neither of them mentions it.'], reward: 'none' } } }
  });

  S({
    id: 'st_nk_08', kind: 'fetch', where: { themes: ['home', 'north', 'institution'], depth: [1, 3] },
    who: { name: 'The Man in White Gloves', look: { t: 'adult', c: ['#2a2a2e', '#f4f4f0', '#d8c0a0'] }, lang: 'ko-n' },
    intro: [
      'A man in white gloves stands on a chair before two great framed portraits. The glass shines like still water.',
      KN('검열은 새벽입니다. 액틀에 먼지가 한 톨이라도 있으면 안 됩니다.', 'Inspection is at dawn. There mustn’t be a single speck of dust on the frames.'),
      KN('그런데 걸레가 없습니다. 이번 배급에 걸레는 없었습니다.', 'But I have no cloth. There was no cloth in this month’s ration.'),
      KN('깨끗한 양말 한 짝이면 됩니다. 그리고 물 한 고뿌.', 'One clean sock would do. And a glass of water.')
    ],
    again: [KN('새벽이 오고 있습니다. 먼지도 오고 있습니다.', 'Dawn is coming. So is the dust.')],
    fetch: {
      items: [
        { name: 'a clean white sock', look: 'sock', color: '#f0f0ec' },
        { name: 'a glass of water', look: 'glass', color: '#a8c8e0' }
      ],
      found: ['She carries it with both hands, carefully, as if someone were watching. Someone might be.'],
      partial: [KN('좋습니다. 하나 더. 새벽은 기다려주지 않습니다.', 'Good. One more. Dawn won’t wait.')],
      done: [
        'He dips the sock in the water and polishes both great frames until they blaze, holding his breath.',
        'Then he climbs down and wipes something much lower, behind the stove: a tiny photo of a woman, laughing.',
        KN('이건 아무도 검열 안 합니다. 그래서 내가 합니다.', 'Nobody inspects this one. So I do.'),
        KN('동무는 아무것도 못 봤습니다. 고맙습니다.', 'You didn’t see anything. Thank you.')
      ]
    },
    reward: 'photo'
  });

  S({
    id: 'st_nk_09', kind: 'choice', where: { themes: ['school', 'north', 'beach'], depth: [1, 3] },
    who: { name: 'The Girl Who Is Drawing the Sea', look: { t: 'kid', c: ['#3a4a6a', '#e8e0d0', '#f0d8c0'] }, lang: 'ko-n' },
    intro: [
      'A little girl kneels over a sheet of paper. She has drawn a beach and a sun with a face, but no sea yet.',
      KN('선생님이 바다를 그리래요. 우리 공화국의 바다를요.', 'Teacher told us to draw the sea. Our Republic’s sea.'),
      'Three crayons lie beside her: blue, grey and black. The blue one has hardly been used.'
    ],
    again: [KN('바다가 아직 하얘요. 빨리 정해야 돼요.', 'The sea is still white. I have to decide quickly.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KN('동무, 바다는 무슨 색갈이에요?', 'Comrade, what colour is the sea?')],
        choices: [{ label: 'Blue', to: 'q_blue' }, { label: 'Grey', to: 'q_grey' }, { label: 'Black', to: 'q_black' }] },
      q_blue: { say: [KN('맞아요. 선생님도 파랗다고 했어요. 반짝반짝 파랗다고.', 'Right. Teacher said blue too. Sparkly blue.'), KN('그런데 동무가 본 바다도 파랬어요? 진짜로?', 'But was the sea you saw blue? Really?')],
        choices: [{ label: 'Really blue', to: 'e_blue' }, { label: 'Not really', to: 'q_grey' }] },
      q_grey: { say: ['She looks round, then whispers.', KN('나도 재색으로 봤어요. 아버지 배가 나간 날에.', 'I saw it grey too. The day Dad’s boat went out.'), KN('재색으로 그려도 돼요? 혼날까요?', 'Can I draw it grey? Will I get told off?')],
        choices: [{ label: 'Draw it grey', to: 'q_risk' }, { label: 'Better draw it blue', to: 'e_obey' }, { label: 'Draw two seas', to: 'e_two' }] },
      q_risk: { say: ['She colours the sea grey, slowly, right to the edge of the page.', KN('…예쁘다. 진짜 바다 같아요.', '…It’s pretty. It looks like the real sea.'), KN('이거 선생님한테 내도 돼요?', 'Can I hand this one in to Teacher?')],
        choices: [{ label: 'Hand it in', to: 'e_hand' }, { label: 'Keep it hidden', to: 'e_hide' }] },
      q_black: { say: [KN('까만 바다는 밤에만 있어요.', 'The black sea only comes at night.'), KN('밤에는 바다를 보면 안 돼요. 밤바다로 간 사람은 안 돌아와요.', 'You mustn’t look at the sea at night. People who go to the night sea don’t come back.')],
        choices: [{ label: 'Who went?', to: 'e_who' }, { label: 'Draw it by day', to: 'q_blue' }] } },
      endings: {
        e_blue: { say: ['She fills in the sea with bright blue, pressing so hard that the crayon snaps.', KN('다 됐다! 이건 일등 할 거예요.', 'Finished! This one will come first.')], reward: 'coin' },
        e_obey: { say: [KN('그렇지요. 파랗게 해야지요.', 'Right. It has to be blue.'), 'She draws the sea blue. Then, in one corner, so small it could be a slip, a single grey wave.'], reward: 'none' },
        e_two: { say: ['She draws a blue sea on the page, folds it in half, and draws a grey sea on the inside.', KN('선생님은 접힌 데는 안 봐요.', 'Teacher never looks inside the folds.')], reward: 'photo' },
        e_hand: { say: [KN('…아니에요. 안 낼래요. 무서워요.', '…No. I won’t. I’m scared.'), 'The girl tears off the grey strip and presses it into her hand. The rest she colours blue, very fast.'], reward: 'page' },
        e_hide: { say: ['She folds the grey sea very small and tucks it inside her red scarf.', KN('아버지 오면 보여줄 거예요. 아버지는 진짜 바다를 아니까.', 'I’ll show Dad when he comes home. He knows the real sea.')], reward: 'lore' },
        e_who: { say: ['She doesn’t answer. She puts the black crayon back in the box, gently, like someone putting a baby to sleep.', KN('…모르는 사람이에요. 모르는 사람.', '…Nobody I know. Nobody.')], reward: 'none' } } }
  });

  S({
    id: 'st_nk_10', kind: 'fetch', where: { themes: ['home', 'north'], depth: [1, 3] },
    who: { name: 'The Mother Measuring Rice', look: { t: 'adult', c: ['#6a5a4a', '#e8e0d0', '#d8b898'] }, lang: 'ko-n' },
    intro: [
      'A woman kneels by a cold stove. In front of her: three bowls, all empty, set out very neatly.',
      KN('오늘 배급이 나왔습니다. 쌀이 아주 많습니다. 아주요.', 'The ration came today. There’s plenty of rice. Plenty.'),
      KN('그런데 쌀을 담을 단지가 없고, 쌀을 되는 조개껍질도 잃어버렸습니다.', 'Only I have no jar to keep it in, and I’ve lost the shell I measure it with.')
    ],
    again: [KN('애들이 곧 옵니다. 배고프다는 말은 안 합니다. 우리 애들은 착합니다.', 'The children will be home soon. They never say they’re hungry. My children are good.')],
    fetch: {
      items: [
        { name: 'an empty clay jar', look: 'jar', color: '#8a5a3a' },
        { name: 'a small white shell', look: 'shell', color: '#f0e8e0' }
      ],
      found: ['She picks it up and holds it in both hands, the way people hold things that matter.'],
      partial: [KN('하나 찾았습니다. 하나만 더 있으면 저녁입니다.', 'That’s one. One more and it’s dinner.')],
      done: [
        'The woman pours the rice into the jar. It barely covers the bottom.',
        'With the shell she measures: one for the father, one for the boy, one for the girl. The last scrapes the jar.',
        'Nothing is left for a fourth bowl. There is no fourth bowl.',
        KN('나는 먹었습니다. 아까 먹었습니다. 배가 아주 부릅니다.', 'I’ve eaten. I ate earlier. I’m really very full.'),
        KN('동무도 먹었지요? 그래요. 다들 먹었습니다.', 'You’ve eaten too, haven’t you? Yes. Everyone has eaten.')
      ]
    },
    reward: 'lore',
    lore: ['On the way out, she finds three grains of rice in her pocket. She doesn’t remember putting them there.']
  });

  S({
    id: 'st_nk_11', kind: 'follow', where: { themes: ['city', 'north', 'snow'], depth: [2, 4] },
    who: { name: 'The Boy Who Knows the Market', look: { t: 'shadow', c: ['#3a3028', '#8a7a6a', '#d8b8a0'] }, lang: 'ko-n' },
    intro: [
      'A boy in a coat far too big for him crouches by a market stall, picking up grains of corn one by one.',
      KN('나는 일없습니다. 집도 있고 오마니도 있고, 다 있습니다.', 'I’m fine. I’ve got a house and a mum and everything.'),
      'His feet are wrapped in plastic bags tied with string.',
      KN('…동무 추워 보입니다. 따뜻한 데 알려줄까요? 아무한테도 말하면 안 됩니다.', '…You look cold. Want me to show you somewhere warm? You can’t tell anyone.')
    ],
    again: [KN('따뜻한 데 갈래요, 말래요? 빨리요, 단속반 옵니다.', 'Coming to the warm place or not? Quick, the patrol’s coming.')],
    follow: {
      start: [
        KN('나만 따라와요. 큰길로 가면 안 됩니다.', 'Stick with me. We can’t use the main street.'),
        'He slips between the stalls like water, without touching a thing.'
      ],
      wait: [
        'He waits behind a pillar, waving her on, impatient and rather proud.',
        KN('느려요! 동무는 장마당에서 하루도 못 살겠어요.', 'You’re so slow! You wouldn’t last a day at the market.')
      ],
      arrive: [
        'Behind the station boiler there is a gap in the bricks, and behind the gap a pipe as warm as an animal.',
        'On the wall someone has drawn a window in chalk, with curtains, and a pot steaming on a stove.',
        KN('여기가 우리 집입니다. 창문도 있고요. 봐요, 다 있다고 했지요.', 'This is my house. There’s even a window. See? I told you I had everything.')
      ],
      to: 'secret'
    },
    reward: 'secret',
    lore: [KN('동무는 오마니 있어요? …그럼 빨리 가요. 오마니들은 기다리니까.', 'Have you got a mum? …Then hurry home. Mums wait.')]
  });

  S({
    id: 'st_nk_12', kind: 'word', where: { themes: ['north', 'nature', 'institution'], depth: [2, 4] },
    who: { name: 'The Guard at the Barrier', look: { t: 'adult', c: ['#4a5638', '#b03030', '#d8c0a0'] }, lang: 'ko-n' },
    intro: [
      'A barrier blocks a country road. Beside it stands a young soldier, very straight, his ears red with cold.',
      KN('정지! 통행증을 보이십시오.', 'Halt! Show me your travel permit.'),
      'She has no permit. He looks at her, then at the empty road, and lowers his voice.',
      KN('통행증 없이 갈 수 있는 곳은 딱 하나입니다. 말해보십시오. 어디로 갑니까?', 'There is only one place you can go without a permit. Tell me. Where are you going?')
    ],
    again: [KN('정지! …아, 또 동무입니까. 어디로 가는지 생각났습니까?', 'Halt! …Oh, it’s you again. Have you remembered where you’re going?')],
    word: {
      words: ['home', 'house', 'jip', '집', '집에', 'going home'],
      hint: [
        KN('해가 지면 누구나 가는 곳. 군대에서는 십 년 동안 못 가는 곳.', 'Where everyone goes when the sun sets. Where a soldier can’t go for ten years.'),
        KN('나는 거기 못 간 지 칠 년 됐습니다. 오마니가 된장국을 끓이는 곳입니다.', 'I haven’t been there for seven years. It’s where Mum makes soybean soup.')
      ],
      heard: [
        'He lifts the barrier with both hands, slowly, as if it were heavy with snow.',
        KN('집. 그렇습니다. 집으로 가는 사람은 막지 않습니다.', 'Home. Yes. I don’t stop people who are going home.'),
        KN('가다가 우리 집 굴뚝이 보이면… 아닙니다. 됐습니다. 가십시오.', 'If you see my family’s chimney on the way… No. Never mind. Go on.')
      ],
      wrong: [KN('거기는 통행증이 있어야 갑니다. 돌아가십시오.', 'You need a permit to go there. Turn back.')]
    },
    reward: 'secret',
    lore: ['Beyond the barrier the road is narrower, and nobody has walked on it for a long time.']
  });

  S({
    id: 'st_nk_13', kind: 'choice', where: { themes: ['institution', 'north', 'korea'], depth: [3, 4] },
    who: { name: 'The Grandmother at Table Twelve', look: { t: 'old', c: ['#6a3a4a', '#f0e0e8', '#d8c0b0'] }, lang: 'ko-n' },
    intro: [
      'A hall full of round tables, and a clock with only two hours on its face. An old woman waits at table twelve.',
      KN('남쪽에서 손녀가 온다고 했습니다. 한 번도 못 본 손녀입니다.', 'They told me my granddaughter was coming from the south. A granddaughter I’ve never seen.'),
      'The grandmother looks at her for a long time, and seems to decide something.',
      KN('…너로구나. 그렇지? 앉아라. 두 시간밖에 없다.', '…It’s you, isn’t it? Sit down. We only have two hours.')
    ],
    again: [KN('시계가 간다. 앉아라, 얘야.', 'The clock is running. Sit down, child.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KN('남쪽은 어떠냐? 거기도 겨울이 춥냐?', 'What is the south like? Are the winters cold there too?')],
        choices: [{ label: 'Warmer than here', to: 'q_warm' }, { label: 'Just as cold', to: 'q_cold' }, { label: 'I am not her', to: 'q_not' }] },
      q_warm: { say: ['Her face lights up. Then she glances, very quickly, at the man in the grey suit by the door.', KN('…잘됐다. 여기도 따뜻하다. 우리도 아주 따뜻하다.', '…Good. It’s warm here too. We are all very warm.'), KN('네 아버지는? 내 아들은 나를 기억하냐?', 'And your father? Does my son remember me?')],
        choices: [{ label: 'He talks about you', to: 'e_talks' }, { label: 'He never stopped waiting', to: 'e_waiting' }] },
      q_cold: { say: [KN('그러냐? 추운 건 어디나 같구나.', 'Is it? So the cold is the same everywhere.'), KN('그럼 이걸 가져가라. 내가 뜬 장갑이다.', 'Then take these. I knitted them myself.'), 'She takes a pair of red mittens from her bag. They are very small.'],
        choices: [{ label: 'Put them on', to: 'e_mittens' }, { label: 'Hold her hand', to: 'e_hand' }, { label: 'Tell her a joke', to: 'e_joke' }] },
      q_not: { say: [KN('안다.', 'I know.'), KN('그래도 두 시간은 두 시간이다. 잠깐만 손녀 노릇을 해다오.', 'But two hours are two hours. Be my granddaughter for a little while.')],
        choices: [{ label: 'All right', to: 'q_son' }, { label: 'I’ll stay as myself', to: 'e_myself' }] },
      q_son: { say: ['The grandmother smooths her hair with a wet thumb, as if she had always done it.', KN('그럼 네 아버지 얘기를 해다오. 그 애가 아직 이 오마니를 기억하냐?', 'Then tell me about your father. Does that boy still remember his mother?')],
        choices: [{ label: 'He talks about you', to: 'e_talks' }, { label: 'He never stopped waiting', to: 'e_waiting' }] } },
      endings: {
        e_talks: { say: [KN('그래? 그 애가 내 얘기를 한단 말이냐…', 'Does he? He talks about me…'), 'She takes a boiled egg from her bag and peels it for her, the way you would for a very small child.', KN('먹어라. 남쪽 애들은 이런 거 안 먹지? 먹어.', 'Eat. Children in the south don’t eat things like this, do they? Eat.')], reward: 'coin' },
        e_waiting: { say: [KN('기다렸다고…', 'He waited…'), 'A bell rings. It has been two hours. It has been ten minutes.', KN('나도 기다렸다고 전해라. 꼭 전해라.', 'Tell him I waited too. Promise you’ll tell him.')], reward: 'lore' },
        e_mittens: { say: ['The mittens were knitted for a baby. They barely cover the tips of her fingers.', KN('네가 태어났다는 소식 듣고 떴다. 크기는 짐작으로 했다.', 'I knitted them when I heard you’d been born. I had to guess the size.'), KN('일없다. 손가락 끝만이라도 따뜻하면 됐다.', 'Never mind. As long as your fingertips are warm.')], reward: 'photo' },
        e_hand: { say: ['Her hand is small and dry and very warm. When the bell rings, she doesn’t let go.', KN('종이 울려도 일없다. 이 손은 내 거다. 두 시간 동안은.', 'Let it ring. This hand is mine. For two hours, it is.')], reward: 'page' },
        e_joke: { say: ['She tells the only joke she knows. It is not a very good joke.', 'The grandmother laughs so hard that the man by the door looks up, and then, strangely, looks away.', KN('아이고, 남쪽 애들은 참 우습기도 하다.', 'Oh dear me, children from the south are funny.')], reward: 'coin' },
        e_myself: { say: [KN('그래. 너는 너다. 그게 더 낫구나.', 'All right. You are you. Somehow that’s better.'), 'They sit together in silence until the bell, two strangers at table twelve. It is not a bad silence.'], reward: 'lore' } } }
  });

  S({
    id: 'st_nk_14', kind: 'fetch', where: { themes: ['city', 'north', 'institution'], depth: [2, 4] },
    who: { name: 'The Girl Who Is One Square of the Picture', look: { t: 'kid', c: ['#e0c040', '#c83030', '#3050a0', '#f0d8c0'] }, lang: 'ko-n' },
    intro: [
      'In an endless stadium, a girl sits alone on row ninety-one, a thick book of coloured cards on her knees.',
      KN('나는 그림의 한 칸입니다. 아주 큰 그림인데, 나는 한 번도 못 봤습니다.', 'I am one square of the picture. It’s a huge picture, and I’ve never once seen it.'),
      KN('바람에 카드 세 장이 날아갔습니다. 빨강, 노랑, 파랑. 없으면 그림에 구멍이 납니다.', 'The wind blew three cards away. Red, yellow, blue. Without them there’ll be a hole in the picture.')
    ],
    again: [KN('구멍이 나면 우에서 다 보입니다. 우에서는 다 보입니다.', 'If there’s a hole, they’ll see it from up there. From up there, they see everything.')],
    fetch: {
      items: [
        { name: 'a red card', look: 'drawing', color: '#c83030' },
        { name: 'a yellow card', look: 'drawing', color: '#e0c040' },
        { name: 'a blue card', look: 'drawing', color: '#3050a0' }
      ],
      found: ['A square of stiff card, bright on one side. On the back, in pencil: row 91, seat 40.'],
      partial: [KN('고맙습니다! 그래도 그림이 아직 다 안 됐습니다.', 'Thank you! But the picture still isn’t whole.')],
      done: [
        'A whistle. The girl lifts the red card above her head, smiling as hard as she can.',
        'From very far away, from the sky perhaps, a hundred thousand cards make a giant sun with a face.',
        'From here, it is one girl holding up one red square, and her arms are shaking.',
        KN('어때요? 예뻐요? 나는 못 봐요. 동무가 나 대신 봐 주세요.', 'Well? Is it pretty? I can’t see it. Look at it for me.')
      ]
    },
    reward: 'photo',
    lore: ['When the whistle blows again, her square turns yellow, and somewhere, enormous, the sun winks.']
  });

  S({
    id: 'st_nk_15', kind: 'follow', where: { themes: ['snow', 'north', 'city'], depth: [2, 4] },
    who: { name: 'The Man Clearing the Road', look: { t: 'adult', c: ['#4a4a3a', '#c0b8a0', '#d8c0a0'] }, lang: 'ko-n' },
    intro: [
      'A man in a padded coat is shovelling snow off a wide, perfectly empty road. Behind him, it is snowing again.',
      KN('오늘 귀한 분이 이 길로 지나가십니다. 오늘입니다. 틀림없이 오늘입니다.', 'Today someone important will pass along this road. Today. Definitely today.'),
      KN('서른한 해째 오늘입니다.', 'It has been today for thirty-one winters.'),
      KN('길 끝까지 다 쓸었는지 같이 봐 주겠습니까? 혼자 보면 믿을 수가 없습니다.', 'Will you come and check I’ve cleared it to the end? On my own, I can’t believe my eyes.')
    ],
    again: [KN('눈이 또 옵니다. 눈은 참으로 성실합니다.', 'More snow. The snow is truly diligent.')],
    follow: {
      start: [
        'He sets off down the road, shovelling as he goes, leaving one clean dark stripe behind him.',
        KN('내 발자국만 밟으십시오. 길은 깨끗해야 합니다.', 'Step only in my footprints. The road must stay clean.')
      ],
      wait: [KN('동무? 눈 속에 가만히 서 있으면 동무도 쓸어버리겠습니다. 하하. 농담입니다.', 'Comrade? Stand still in the snow and I’ll shovel you away too. Ha ha. A joke.')],
      arrive: [
        'The road runs on, clean and wide, until it simply stops at a white field without edges.',
        'There is no town here, no gate, nothing anyone could drive to.',
        KN('…끝까지 쓸었습니다. 보십시오. 아주 깨끗합니다.', '…Cleared to the very end. Look at that. Spotless.'),
        KN('이제 누가 와도 됩니다. 아무도 안 와도… 길은 깨끗합니다.', 'Now anyone can come. And if nobody comes… the road is clean.')
      ],
      to: 'far'
    },
    reward: 'coin',
    lore: ['On the way back, the snow has already filled the stripe. Far behind, he is shovelling it again, humming.']
  });

  S({
    id: 'st_nk_16', kind: 'choice', where: { themes: ['school', 'north', 'institution'], depth: [1, 3] },
    who: { name: 'The Boy Who Ran Out of Faults', look: { t: 'kid', c: ['#2a2a3a', '#c83030', '#e8d0b8'] }, lang: 'ko-n' },
    intro: [
      'A boy in a red scarf paces up and down a school corridor, whispering to himself and counting on his fingers.',
      KN('토요일은 생활총화입니다. 한 주일 동안 잘못한 걸 하나씩 말해야 합니다.', 'Saturday is the weekly review. Everyone has to own up to one thing they did wrong.'),
      KN('그런데 이번 주에 나는 잘못을 하나도 안 했습니다. 큰일 났습니다.', 'But this week I didn’t do a single thing wrong. It’s a disaster.')
    ],
    again: [KN('잘못 하나만 빌려주십시오. 작은 걸로요.', 'Lend me a fault. Just a small one.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KN('동무, 내가 무슨 잘못을 말하면 좋겠습니까?', 'Comrade, what fault should I confess?')],
        choices: [{ label: 'You were late', to: 'e_late' }, { label: 'You laughed in class', to: 'q_laugh' }, { label: 'You had a dream', to: 'q_dream' }] },
      q_laugh: { say: [KN('웃었다고요? 뭘 보고 웃었다고 할까요?', 'That I laughed? What should I say I laughed at?')],
        choices: [{ label: 'A pigeon slipping on ice', to: 'e_bird' }, { label: 'Nothing at all', to: 'e_nothing' }] },
      q_dream: { say: ['The boy goes pale.', KN('꿈도 잘못입니까? 무슨 꿈이요?', 'Are dreams faults too? What dream?')],
        choices: [{ label: 'You dreamed you could fly', to: 'e_fly' }, { label: 'Forget I said it', to: 'e_forget' }] } },
      endings: {
        e_late: { say: [KN('지각! 좋습니다. 아주 훌륭한 잘못입니다.', 'Late! Good. That’s an excellent fault.'), 'He practises looking sorry in the window glass. He is very good at it already.'], reward: 'coin' },
        e_bird: { say: [KN('비둘기가 얼음에 미끄러져서 웃었다… 그건 진짜로 있었던 일입니다.', 'A pigeon slipped on the ice and I laughed… That really happened.'), 'He laughs again, remembering it, and then remembers where he is.', KN('이제 이번 주 잘못이 두 개가 됐습니다.', 'Now I’ve got two faults this week.')], reward: 'page' },
        e_nothing: { say: [KN('아무것도 아닌 걸 보고 웃었다… 그게 제일 위험한 잘못입니다.', 'Laughing at nothing… that’s the most dangerous fault there is.'), KN('그래도 한 번 해 보고 싶습니다.', 'I’d still like to try it, once.')], reward: 'lore' },
        e_fly: { say: [KN('날아다니는 꿈… 어디로 날아갔다고 하지요? 아니, 말 안 하겠습니다.', 'A flying dream… Where would I say I flew to? No. I won’t say.'), KN('그 꿈은 총화에 안 냅니다. 그건 내 겁니다.', 'That dream isn’t going in the review. That one is mine.')], reward: 'photo' },
        e_forget: { say: [KN('예. 잊었습니다. 꿈은 없었습니다.', 'Yes. Forgotten. There was no dream.'), 'He says it so quickly that he must have said it before.'], reward: 'none' } } }
  });

  S({
    id: 'st_nk_17', kind: 'word', where: { themes: ['home', 'north', 'office'], depth: [2, 4] },
    who: { name: 'The Teacher With Two Watches', look: { t: 'old', c: ['#5a4a3a', '#c0a060', '#d8c0a8'] }, lang: 'en' },
    intro: [
      'An old man wears a watch on each wrist. He looks from one to the other, the way you follow two people talking.',
      EN('Good evening. I taught English for many years. Only the useful words. Tractor. Harvest. Victory.'),
      'The left watch says six o’clock. The right watch says half past six.',
      EN('My daughter lives on the right-hand watch. How far away is she, would you say? Not in miles. In minutes.')
    ],
    again: [EN('Tick, and tock. These two never agree. Like a family at New Year.')],
    word: {
      words: ['thirty', '30', 'half', 'samsip', '삼십', '30분', '삼십분'],
      hint: [
        'The two minute hands point in opposite directions, exactly half a turn apart.',
        EN('Count it for me, would you? My eyes are old, and numbers are the first words to go.')
      ],
      heard: [
        EN('Thirty. Yes. Only thirty minutes. You could boil rice in the time between us.'),
        'He unbuckles the right-hand watch and, for a moment, holds both watches together in one palm.',
        EN('There. Now we are on the same time. Nobody need know.')
      ],
      wrong: [EN('No, no. That is much too far. Or not nearly far enough.')]
    },
    reward: 'coin',
    lore: [EN('When I taught, I had one favourite word that was not useful at all. Visit. Isn’t it a lovely word?')]
  });

  S({
    id: 'st_nk_18', kind: 'fetch', where: { themes: ['school', 'north', 'city'], depth: [1, 3] },
    who: { name: 'The Boy With a Sack of Scrap', look: { t: 'kid', c: ['#5a5a4a', '#a0a090', '#e8d0b8'] }, lang: 'ko-n' },
    intro: [
      'A small boy drags an almost empty sack across a schoolyard. By the gate stands an enormous scale.',
      KN('학교 과제입니다. 파철 일 킬로그람. 래일까지입니다.', 'School assignment. One kilogramme of scrap metal. By tomorrow.'),
      KN('못 하면 우리 반이 꼴찌입니다. 동무, 쇠붙이 좀 찾아줄 수 있습니까?', 'If I don’t, our class comes last. Comrade, could you help me find some bits of metal?'),
      KN('…내 기차는 안 됩니다. 그건 일부러 멀리 숨겨 놨습니다.', '…Not my train, though. I hid that one far away, on purpose.')
    ],
    again: [KN('저울 바늘이 아직 꼼짝도 안 합니다. 쇠가 더 있어야 합니다.', 'The needle still hasn’t budged. I need more metal.')],
    fetch: {
      items: [
        { name: 'a bent coin', look: 'coin', color: '#a08850' },
        { name: 'a rusty keyring', look: 'keyring', color: '#8a6040' },
        { name: 'a little tin train', look: 'toytrain', color: '#c04030' }
      ],
      found: ['It is cold to the touch, and heavier than it looks.'],
      partial: [KN('좋습니다! 바늘이 조금 움직였습니다. 아주 조금.', 'Good! The needle moved a bit. Only a tiny bit.')],
      done: [
        'He lays everything on the scale. Last of all, very slowly, the tin train.',
        KN('…이 기차는 내 겁니다. 아니, 내 거였습니다. 일없습니다.', '…This train is mine. No, it was mine. It’s fine.'),
        'The needle moves for the coin, and for the keyring. For the train it doesn’t move at all.',
        'He stares. Then he snatches the train back into his coat before the scale can change its mind.',
        KN('저울이 기차를 못 알아봤습니다! 장난감은 무게가 없나 봅니다.', 'The scale didn’t notice the train! Maybe toys don’t weigh anything at all.')
      ]
    },
    reward: 'page'
  });

  S({
    id: 'st_nk_19', kind: 'follow', where: { themes: ['north', 'city', 'water'], depth: [2, 4] },
    who: { name: 'The Student Looking for Light', look: { t: 'humanoid', c: ['#2a2a3a', '#e8e8e0', '#d8c0a8'] }, lang: 'ko-n' },
    intro: [
      'The power has gone. The whole city is one block of black, except for a student holding a schoolbook.',
      KN('정전입니다. 일없습니다. 정전은 아주 정상입니다.', 'Power cut. It’s fine. Power cuts are perfectly normal.'),
      KN('래일 시험인데… 불빛이 있는 데를 압니다. 같이 가겠습니까?', 'There’s an exam tomorrow… I know a place where there’s light. Will you come?')
    ],
    again: [KN('눈을 감으면 어둠이 덜 무섭습니다. 그래도 책은 못 읽습니다.', 'With your eyes shut, the dark is less frightening. But you can’t read.')],
    follow: {
      start: [
        'The student walks quickly through the dark, one hand on the walls, counting doorways under their breath.',
        KN('스물, 스물하나… 내 손을 놓치지 마십시오. 아니, 내 목소리를.', 'Twenty, twenty-one… Don’t lose my hand. No — my voice.')
      ],
      wait: [KN('거기 있습니까? 대답하십시오. 어둠 속에서는 대답이 길입니다.', 'Are you there? Answer me. In the dark, an answer is a road.')],
      arrive: [
        'They come out on a riverbank. The river is black and very wide.',
        'On the far side, a whole town is lit: windows, signs, a great wheel of coloured lights turning slowly.',
        'The student sits on a stone, opens the book and tilts it towards the other shore.',
        KN('저쪽 불빛은 공짜입니다. 강을 혼자 건너오니까요.', 'The light from over there is free. It crosses the river by itself.'),
        KN('…저기는 정전이 없나 봅니다. 그런 건 시험에 안 나옵니다.', '…It seems they don’t have power cuts over there. That won’t be on the exam.')
      ],
      to: 'water'
    },
    reward: 'lore'
  });

  S({
    id: 'st_nk_20', kind: 'choice', where: { themes: ['city', 'north', 'institution'], depth: [2, 4] },
    who: { name: 'The Guide in the Pressed Suit', look: { t: 'adult', c: ['#2a3a5a', '#f0f0f0', '#e0c8a8', '#c03030'] }, lang: 'en' },
    intro: [
      'At the end of a very clean, very empty avenue, a woman in a perfectly pressed suit is waiting for her.',
      EN('Welcome, honoured visitor. I am your guide. Everything you will see today is real and very good.'),
      EN('Please do not leave the group.'),
      'There is no group. There is only her.'
    ],
    again: [EN('The itinerary is waiting, honoured visitor. The itinerary is always waiting.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [EN('Today we may visit three places. Please choose. All three are excellent.')],
        choices: [{ label: 'The tall tower', to: 'q_tower' }, { label: 'The big shop', to: 'q_shop' }, { label: 'Your house', to: 'q_house' }] },
      q_tower: { say: ['From the top of the tower the city is perfect and silent. Only the tower itself is lit.', EN('From here you can see that everyone is happy. It is too far to see faces, but they are.')],
        choices: [{ label: 'It is beautiful', to: 'e_beautiful' }, { label: 'Where is everyone?', to: 'e_people' }] },
      q_shop: { say: ['The shelves are full of tins, all identical, all facing forward. Nobody is buying anything.', EN('Please, take whatever you like. Only, put it back afterwards.')],
        choices: [{ label: 'Take a tin', to: 'e_tin' }, { label: 'Ask if it is real', to: 'e_real' }] },
      q_house: { say: ['The guide’s smile stops halfway.', EN('My house is not on the itinerary.'), EN('…It is very small. There is nothing to see. Why would you want to see it?')],
        choices: [{ label: 'To meet your family', to: 'q_family' }, { label: 'You look tired', to: 'e_tired' }, { label: 'Never mind', to: 'e_never' }] },
      q_family: { say: ['She looks back down the empty avenue for a long time.', EN('My mother is there. She does not speak English. She would make you eat far too much.'), EN('If I take you, afterwards you must say it was the tower.')],
        choices: [{ label: 'It was the tower', to: 'e_house' }, { label: 'I won’t lie', to: 'e_nolie' }] } },
      endings: {
        e_beautiful: { say: [EN('Yes. That is the correct answer. You are a very good visitor.'), 'She writes something in a small notebook. It looks a lot like relief.'], reward: 'coin' },
        e_people: { say: [EN('They are inside. Happiness is mostly done indoors.'), EN('…That was a joke. I am allowed one per visitor.')], reward: 'lore' },
        e_tin: { say: ['She takes a tin. It weighs nothing at all. It is empty.', EN('Please put it back facing forward. Thank you. Thank you very much.')], reward: 'none' },
        e_real: { say: [EN('Everything in this shop is real. The tins are real. The shelves are real.'), EN('What is inside the tins is a different question. I was not trained for different questions.')], reward: 'page' },
        e_tired: { say: [EN('Tired? No. In our country we do not…'), 'She sits down on the clean kerb all at once, like a coat sliding off a hook.', EN('Five minutes. Please do not write this down.')], reward: 'photo' },
        e_never: { say: [EN('Thank you. The tower is lovely at this hour.'), 'She is already walking. Her shoulders have come down a little.'], reward: 'none' },
        e_house: { say: ['A tiny room, a cold heater, an old woman who laughs with her whole face and gives her three hot potatoes.', EN('It was the tower. Remember. It was the tower, and it was very beautiful.')], reward: 'cookie' },
        e_nolie: { say: [EN('Then you are a very dangerous visitor.'), EN('…My mother would have liked you. Goodbye. The tower is that way.')], reward: 'lore' } } }
  });

  S({
    id: 'st_nk_21', kind: 'fetch', where: { themes: ['city', 'north', 'snow'], depth: [1, 2] },
    who: { name: 'The Man Who Lost His Badge', look: { t: 'adult', c: ['#34343e', '#c83030', '#d8c0a0'] }, lang: 'ko-n' },
    intro: [
      'A man in a dark jacket walks with his left hand pressed flat over his heart, as if he were swearing an oath.',
      KN('아무 일도 없습니다! 그저… 가슴이 좀 시려서 그럽니다.', 'Nothing’s the matter! My chest is just… a little cold, that’s all.'),
      'Under his hand, on the cloth, there is a small clean circle where something used to be pinned.',
      KN('…휘장을 잃어버렸습니다. 붉은 휘장을. 동무, 이건 비밀입니다.', '…I’ve lost my badge. My red badge. Comrade, this is a secret.')
    ],
    again: [KN('손이 얼어도 일없습니다. 이 손을 떼면 안 됩니다.', 'Even if my hand freezes, it’s fine. I mustn’t take it away.')],
    fetch: {
      items: [{ name: 'a small red badge', look: 'coin', color: '#c83030' }],
      found: ['A small red badge lies in the snow, still warm, as if someone had only just taken it off.'],
      done: [
        'He pins it on with shaking fingers, and at last lets his hand drop.',
        KN('이제 됐습니다. 이제 정말 아무 일도 없습니다.', 'There. Now nothing is the matter at all.'),
        KN('휘장이 없으니까, 꼭 내 심장이 밖에서 다 보이는 것 같았습니다.', 'Without it, I felt as if everyone could see my heart.')
      ]
    },
    reward: 'coin',
    lore: [KN('…동무 가슴에는 아무것도 없군요. 춥지 않습니까?', '…There’s nothing on your chest at all. Aren’t you cold?')]
  });

  S({
    id: 'st_nk_22', kind: 'word', where: { themes: ['home', 'north', 'city'], depth: [2, 4] },
    who: { name: 'The Woman Under the Blanket', look: { t: 'adult', c: ['#5a3a4a', '#e0c0c8', '#e8d0b8'] }, lang: 'ko-n' },
    intro: [
      'A young woman sits with a blanket over her head and a small dark screen in her lap, switched off.',
      KN('나는 아무것도 안 봤습니다. 이건 그냥 담요입니다.', 'I didn’t watch anything. This is just a blanket.'),
      KN('…그런데 동무, 비 오는 날 그 남자가 그 녀자한테 한 말이 생각 안 납니다.', '…Only, comrade, I can’t remember what the man said to the woman, that day in the rain.')
    ],
    again: [KN('비가 오고, 우산은 하나뿐이고… 그 다음 말이 안 나옵니다.', 'It’s raining, there’s only one umbrella… and I can’t get the next word.')],
    word: {
      words: ['love', 'saranghae', 'saranghaeyo', 'sarang', '사랑', '사랑해', '사랑해요', 'i love you'],
      hint: [
        KN('그 말을 듣고 녀자가 울었습니다. 우리는 그 말을 원수님께만 씁니다.', 'When she heard it, the woman cried. Here, we only use that word for the Marshal.'),
        KN('남쪽 사람들은 그 말을 밥 먹듯이 한답니다. 길에서도, 전화에서도.', 'They say people in the south use it like it’s nothing. In the street. On the telephone.')
      ],
      heard: [
        KN('쉿!', 'Shh!'),
        'She throws the blanket over both their heads. Under it, in the dark, she is laughing.',
        KN('맞습니다. 그 말이였습니다. 그 말을 그렇게 쉽게 해도 됩니까?', 'That’s it. That was the word. Are you allowed to say it as easily as that?'),
        KN('…나도 꼭 한 번 그 말을 해 보고 싶은 사람이 있습니다. 이건 비밀입니다.', '…There’s someone I’d like to say it to, just once. That’s a secret.')
      ],
      wrong: [KN('아니요, 그건 너무 정치적입니다. 비 오는 날 할 말이 아닙니다.', 'No, that’s far too political. That’s not something you say in the rain.')]
    },
    reward: 'cookie'
  });
})(typeof window !== 'undefined' ? window : globalThis);
