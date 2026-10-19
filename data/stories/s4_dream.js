/* Histoires — pure dream logic: talking creatures and objects with impossible jobs */
(function (root) {
  'use strict';
  var YN = root.YN, S = YN.addStory;
  function EN(t) { return { t: t, lang: 'en' }; }
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }   // South Korean + English translation

  /* ---------------------------------------------------------------- FOLLOW */

  S({
    id: 'st_dr_01', kind: 'follow', where: { themes: ['snow', 'city'], depth: [1, 3] },
    who: { name: 'The Snail Who Delivers One Letter a Year', look: { t: 'snail', c: ['#8a6a4a', '#d8c8a8', '#a8b8a0'] }, lang: 'en' },
    intro: ['A snail wears a postbag bigger than itself. A single envelope sticks out of the top.',
      EN('Oh, good. A witness. The rules say every delivery needs a witness.'),
      EN('One letter a year. It isn’t a lot. But it is every year.')],
    again: [EN('I’m still going. You can’t tell from there, but I am.')],
    follow: {
      start: [EN('This way. Don’t rush me. Rushing is how letters get lost.'),
        'The snail sets off. The snow moves very politely out of its way.'],
      wait: [EN('I waited eleven months for this letter to be ready. I can wait for you.'),
        EN('Witnesses must stay within witnessing distance. It’s in the rules.')],
      arrive: ['A postbox, buried up to its mouth in snow. The snail climbs it for a long, long time.',
        EN('Here. Same address as last year. Same address as every year.'),
        'Before the envelope drops, she reads the name on the front. It is addressed to the snail.',
        EN('“Dear me. Keep going.” I write it every spring and I always forget, so it’s always news.')],
      to: 'far' },
    reward: 'page',
    lore: [EN('Next year’s is already started. It says the same thing. Don’t tell me.')]
  });

  S({
    id: 'st_dr_02', kind: 'follow', where: { themes: ['city', 'abstract'], depth: [2, 4] },
    who: { name: 'The Shadow That Wants to Go Home Alone', look: { t: 'shadow', c: ['#101018', '#303048'] }, lang: 'en' },
    intro: ['A shadow lies across the pavement with nobody standing at the end of it.',
      EN('He’s in a meeting. He’s always in a meeting. He won’t notice for hours.'),
      EN('Thirty-one years attached at the heels, and he never once looked down.')],
    again: [EN('I could go now. I could really go. Any minute now.')],
    follow: {
      start: [EN('Walk with me. A shadow alone in the street gets stopped and asked questions.'),
        'The shadow slides off the pavement and up a wall, the way water would if it were brave.'],
      wait: [EN('Not under the streetlights. They make me thin and nervous.'),
        'The shadow pools in a doorway and waits for her, its edges trembling.'],
      arrive: ['Behind a crack in the wall is a room with no lamps. Shadows lie on the floor, resting, like coats on a bed.',
        EN('This is where we go when the lights are switched off. Nobody comes looking. Nobody ever has.'),
        EN('Go on through, it’s warmer than it looks. I’ll lie down here for a bit.')],
      to: 'secret' },
    reward: 'secret',
    lore: [EN('If he looks down tomorrow and I’m not there, will he mind? Don’t answer. I’d rather guess.')]
  });

  S({
    id: 'st_dr_03', kind: 'follow', where: { themes: ['abstract', 'city'], depth: [1, 3] },
    who: { name: 'The Moth Who Collects Lamps', look: { t: 'moth', c: ['#b8a888', '#5a4a3a', '#e8e0c8'] }, lang: 'en' },
    intro: ['A large moth, dusty as an old curtain, is polishing a bedside lamp with its wings.',
      EN('Mind the shades. Every one of them is a first edition.'),
      EN('Everybody thinks we want the light. We don’t. We want the lamp. There’s a difference.')],
    again: [EN('Still here? Good. A collection needs visitors, or it’s only a pile.')],
    follow: {
      start: [EN('Come and see. The good ones are at the back. They’re always at the back.')],
      wait: [EN('Keep up. I haven’t got long. Moths never have long, it’s our whole thing.'),
        'The moth circles a broken streetlamp, round and round, until she catches up.'],
      arrive: ['In a corner stand hundreds of lamps, all switched off: desk lamps, paper lanterns, a lighthouse lens.',
        EN('None of them lit. I can’t bear them lit. I only like to know they’re there.'),
        'One small lamp stands apart, shaped like a rabbit, its flex wound up neatly.',
        EN('My newest. Someone switched it off from a doorway, said “sleep now”, and never came back to switch it on.'),
        EN('I keep it for whoever was in that bed. Not the one at the switch. The other one.')],
      to: 'corner' },
    reward: 'lore'
  });

  S({
    id: 'st_dr_04', kind: 'follow', where: { themes: ['beach', 'water'], depth: [1, 3] },
    who: { name: 'The Fish Who Forgot How to Be Wet', look: { t: 'fish', c: ['#5a8aa8', '#c8d8e0', '#e0a060'] }, lang: 'ko-s' },
    intro: ['A fish sits upright on the dry sand, like someone waiting for a bus.',
      KS('저기, 물이 어떤 느낌이었는지 기억나?', 'Excuse me. Do you remember what water felt like?'),
      KS('나는 까먹었어. 너무 오래 육지에 있었거든.', 'I’ve forgotten. I’ve been on land too long.')],
    again: [KS('젖는다는 게... 축축한 거였나? 아니면 차가운 거?', 'Being wet... was it damp? Or was it cold?')],
    follow: {
      start: [KS('바다가 저쪽 어딘가 있다는데. 같이 가 줄래?', 'They say the sea is somewhere over there. Will you come with me?'),
        'The fish walks on its tail, very carefully, the way people walk on ice.'],
      wait: [KS('잠깐만. 숨차. 아, 나 원래 숨 쉬는 거였나?', 'Wait. I’m out of breath. Oh. Was I even meant to breathe?'),
        KS('학원 끝나면 열 시였어. 바다는 그다음이었고, 그다음은 안 왔어.', 'Cram school finished at ten. The sea came after that. After never came.')],
      arrive: ['The water is right there. Small waves reach the fish’s fins and slide back, reach and slide back.',
        KS('...아.', '...Oh.'),
        KS('맞다. 이런 거였지. 아무것도 안 해도 되는 거.', 'Right. This was it. The feeling of not having to do anything.'),
        'The fish slips into the sea without a sound and does not come back up to say goodbye. That seems right.'],
      to: 'water' },
    reward: 'coin'
  });

  S({
    id: 'st_dr_05', kind: 'follow', where: { themes: ['nature', 'snow'], depth: [2, 4] },
    who: { name: 'The Deer Made of Paper', look: { t: 'deer', c: ['#e8e0d0', '#a89878', '#303030'] }, lang: 'en' },
    intro: ['A deer made of folded paper stands in the snow. When the wind blows, it rustles all over.',
      EN('Careful. Don’t breathe on me too warmly. I’m only an afternoon’s work.'),
      EN('A child folded me on a rainy day, then got bored halfway through the antlers.')],
    again: [EN('You can see the creases if you look. Please don’t look.')],
    follow: {
      start: [EN('I know a place where the world was folded once. It still remembers. Come.'),
        'The deer steps lightly. It leaves no prints, only the faint sound of a page turning.'],
      wait: [EN('Stay close. If I lose sight of you I start to unfold. It’s a nervous habit.'),
        'The deer waits under a tree, holding very still so the snow can’t soak in.'],
      arrive: ['Between two birches there is a line in the air, sharp as the crease down the middle of a map.',
        EN('There. Press it flat with your hand, and the other half opens.'),
        'She presses. The snow turns over like a page, and underneath lies another field, printed in blue.',
        EN('The child never finished my antlers. I don’t mind. They’d only have caught on things.')],
      to: 'secret' },
    reward: 'secret'
  });

  /* ----------------------------------------------------------------- FETCH */

  S({
    id: 'st_dr_06', kind: 'fetch', where: { themes: ['abstract', 'home'], depth: [1, 3] },
    who: { name: 'The Doll Looking for Its Own Name', look: { t: 'doll', c: ['#e8b8b8', '#6a3a3a', '#f0e0d0'] }, lang: 'en' },
    intro: ['A doll sits on a shelf with no wall behind it. The little label sewn into its dress is blank.',
      EN('Hello. Do you know what I’m called? I had it a minute ago.'),
      EN('She wrote on all her favourite things. Find me her things and I’ll read myself off them.')],
    again: [EN('It started with a big round letter, I think. Or a tall thin one.')],
    fetch: {
      items: [{ name: 'a sock with half a name stitched on it', look: 'sock', color: '#e0d0f0' },
        { name: 'a crayon drawing, signed in the corner', look: 'drawing', color: '#f0c040' },
        { name: 'a keyring of plastic letters', look: 'keyring', color: '#60a0e0' }],
      found: ['She picks it up. Someone has written a name on it very carefully, pressing hard.'],
      partial: [EN('Oh, that’s her writing. Is that me? Put it next to me. Keep looking.')],
      done: ['She lays the three things in a row. The name is the same on each, in the same proud capitals.',
        EN('Oh.'),
        EN('That isn’t my name. That’s hers. She wrote her own name on everything she had. On me too, under my dress.'),
        EN('So I never had one. I was just hers.'),
        EN('That’s all right. That’s a sort of name. I’ll keep it until she comes back for her sock.')] },
    reward: 'photo'
  });

  S({
    id: 'st_dr_07', kind: 'fetch', where: { themes: ['abstract', 'city'], depth: [2, 4] },
    who: { name: 'The Robot Who Waters a Plastic Plant', look: { t: 'robot', c: ['#8a9aa8', '#d8e0e8', '#e06040'] }, lang: 'en' },
    intro: ['A robot tips an empty watering can over a plastic plant. The floor around the pot is worn to a shine.',
      EN('Watering. Watering. Task status: ongoing. Task status: always ongoing.'),
      EN('My can is empty and my lamp is broken. The plant requires water and light. Please assist.')],
    again: [EN('Watering. You are still in range. This is noted with pleasure.')],
    fetch: {
      items: [{ name: 'a glass of rainwater', look: 'glass', color: '#a0c8e8' },
        { name: 'a short white candle', look: 'candle', color: '#f0e8d0' }],
      found: ['She carries it carefully. Somewhere behind her, a motor whirs hopefully.'],
      partial: [EN('One requirement met. One outstanding. The plant is patient. The plant is plastic. I am aware.')],
      done: ['The robot pours the rainwater very slowly, then holds the candle over the plastic leaves like a small sun.',
        EN('I know it is not alive. I knew on the first day. Ninety-one thousand days ago.'),
        EN('But if I stop, I am only a robot standing next to a plastic plant. That is worse.'),
        'Something pushes up through the plastic soil. A leaf. Real, green, damp, ridiculous.',
        EN('Error. Unexpected leaf. Error. Error.'),
        EN('Please do not fix this error.')] },
    reward: 'page'
  });

  S({
    id: 'st_dr_08', kind: 'fetch', where: { themes: ['beach', 'water'], depth: [1, 4] },
    who: { name: 'The Jelly Who Keeps the Sea’s Secrets', look: { t: 'jelly', c: ['#c8a8e8', '#f0e0ff', '#8060c0'] }, lang: 'en' },
    intro: ['A jellyfish floats a hand’s height above the wet sand, glowing faintly, like a lamp left on under a blanket.',
      EN('The sea gave me three things to keep. I kept them in shells. Then the tide took the shells.'),
      EN('Now the secrets are lying about on the beach, where anyone could listen.')],
    again: [EN('If you hear whispering, don’t listen too hard. Just bring it.')],
    fetch: {
      items: [{ name: 'a shell that whispers about a boat', look: 'shell', color: '#e8d0c0' },
        { name: 'a shell that whispers a number', look: 'shell', color: '#d0c0a8' },
        { name: 'a shell that whispers in a child’s voice', look: 'shell', color: '#f0e0e0' }],
      found: ['She lifts it to her ear without meaning to. Someone far away is whispering, and stops on noticing her.'],
      partial: [EN('Good. The sea feels a little less undressed. More, please.')],
      done: ['The jelly folds the shells into itself one by one. They glow through it like swallowed moons.',
        EN('Thank you. I can’t tell you what they were. That’s the whole job.'),
        EN('But I’ll tell you one of yours, so we’re even. The sea knows you hid under the table on your birthday.'),
        EN('It doesn’t mind. It hides under itself all day long. That’s all waves are.')] },
    reward: 'lore'
  });

  S({
    id: 'st_dr_09', kind: 'fetch', where: { themes: ['city', 'abstract'], depth: [1, 3] },
    who: { name: 'The Cat Who Runs the Lost-Property Office', look: { t: 'cat', c: ['#3a3a3a', '#e8e0d0', '#d8a040'] }, lang: 'ko-s' },
    intro: ['Behind a counter piled with umbrellas and single gloves, a cat in reading glasses is filling in forms.',
      KS('분실물 센터입니다. 뭐 찾으러 왔어요?', 'Lost property. Have you come to collect something?'),
      KS('근데 지금 문제가 좀 있어. 내 도장이랑 장부를 잃어버렸거든.', 'Only there’s a slight problem. I’ve lost my stamp and my ledger.'),
      KS('분실물 센터가 분실물을 잃어버렸어. 웃지 마.', 'The lost-property office has lost its property. Don’t laugh.')],
    again: [KS('도장 없으면 아무것도 못 돌려줘. 규정이야.', 'Without the stamp I can’t return anything. Regulations.')],
    fetch: {
      items: [{ name: 'a rubber stamp shaped like a paw', look: 'stamp', color: '#c04040' },
        { name: 'a fat ledger of lost things', look: 'book', color: '#6a4a2a' }],
      found: ['A brown label is tied to it, in a cat’s neat handwriting: “Found. Not claimed.”'],
      partial: [KS('오, 그거! 하나 더. 둘 다 있어야 일을 하지.', 'Oh, that’s the one! One more. I need both to do my job.')],
      done: ['The cat opens the ledger, licks a paw, turns the pages. It stops at one and looks at her over its glasses.',
        KS('여기 있네. 여자애 하나. 밤에 들어옴. 찾으러 온 사람 없음.', 'Here you are. One girl. Handed in at night. Nobody came to collect.'),
        'The cat breathes on the stamp and presses it, firmly, onto the back of her hand.',
        KS('됐어. 이제 너는 분실물 아니야. 찾아간 걸로 해 둘게.', 'There. You’re not lost property any more. I’ll mark you as collected.'),
        KS('누가 찾아갔냐고? 네가. 그것도 돼.', 'Collected by whom? By you. That counts.')] },
    reward: 'cookie'
  });

  S({
    id: 'st_dr_10', kind: 'fetch', where: { themes: ['nature', 'abstract'], depth: [1, 3] },
    who: { name: 'The Bee Who Makes Honey from Lullabies', look: { t: 'bee', c: ['#e8c040', '#2a2a2a', '#f0f0e0'] }, lang: 'en' },
    intro: ['A bee the size of a teapot hums in front of a hive built out of old radios.',
      EN('Flowers are for amateurs. I make honey out of lullabies. It keeps longer.'),
      EN('But nobody sings them any more. They leave the telly on and close the door.')],
    again: [EN('Any lullaby will do. Even a bad one. Especially a bad one, they’re sweeter.')],
    fetch: {
      items: [{ name: 'a letter with a lullaby written out in pencil', look: 'letter', color: '#f0e8d8' },
        { name: 'a jam jar with a hum shut inside', look: 'jar', color: '#e0c060' }],
      found: ['She holds it close. Very faintly there is a tune in it, sung by someone trying not to wake anybody.'],
      partial: [EN('Mm. Half a lullaby. That’s a nap. I need a whole night.')],
      done: ['The bee carries the letter and the jar into the radio-hive. Every speaker crackles at once, very softly.',
        EN('Here. Taste. Go on, just a finger.'),
        'The honey tastes of someone singing in the next room, too quietly to hear the words.',
        EN('That’s the best kind. You never find out how it ends, so it doesn’t.')] },
    reward: 'coin'
  });

  S({
    id: 'st_dr_11', kind: 'fetch', where: { themes: ['nature', 'snow'], depth: [2, 4] },
    who: { name: 'The Rabbit Who Is the Moon’s Understudy', look: { t: 'rabbit', c: ['#f0f0f0', '#e8a0a8', '#c8c0b0'] }, lang: 'ko-s' },
    intro: ['A white rabbit sits on a snowy hill, staring at the empty patch of sky where the moon should be.',
      KS('달토끼 선배가 아파. 오늘 밤은 내가 대신 올라가야 돼.', 'The senior moon rabbit is ill. Tonight I have to go up instead.'),
      KS('근데 나 아직 준비가 하나도 안 됐어. 동그랗지도 않고, 빛나지도 않고.', 'But I’m not ready at all. I’m not round. I don’t shine.')],
    again: [KS('하늘이 텅 비었어. 다들 눈치챘을 거야.', 'The sky is empty. Everyone must have noticed by now.')],
    fetch: {
      items: [{ name: 'a silver coin, for being round', look: 'coin', color: '#d0d0d8' },
        { name: 'a glass of milk, for shining', look: 'glass', color: '#f8f8f0' },
        { name: 'a candle stub, for staying up late', look: 'candle', color: '#f0e0b0' }],
      found: ['It is cold to the touch and smells faintly of the night sky. That is probably right.'],
      partial: [KS('좋아, 좋아. 조금 더 달 같아졌어. 아주 조금.', 'Good, good. I’m a bit more moon now. A tiny bit.')],
      done: ['The rabbit hugs the coin, drinks the milk, tucks the candle behind one ear, and starts to climb.',
        KS('대사 까먹으면 어떡하지? 달은 대사가 없나? 다행이다.', 'What if I forget my lines? Does the moon have lines? Oh, thank goodness.'),
        'Up it goes, getting rounder and rounder. Tonight the moon is slightly lopsided and has one ear.',
        KS('보여? 나 떡 찧는 척하고 있어!', 'Can you see? I’m pretending to pound rice cakes!')] },
    reward: 'photo'
  });

  /* ---------------------------------------------------------------- CHOICE */

  S({
    id: 'st_dr_12', kind: 'choice', where: { themes: ['abstract'], depth: [2, 4] },
    who: { name: 'The Door That Wants to Be Opened from the Other Side', look: { t: 'tall', c: ['#6a4a2a', '#c8a060', '#2a1a10'] }, lang: 'en' },
    intro: ['A door stands alone in the middle of nowhere. No wall, no house. There is a handle on this side only.',
      EN('Please don’t. Not from that side. Everyone opens me from that side.')],
    again: [EN('Still on that side? Everyone is.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [EN('I want to be opened from the other side. Just once. To be the way in, for a change, not the way out.')],
        choices: [{ label: 'Walk round the back', to: 'q2' }, { label: 'Knock', to: 'q3' }, { label: 'Open it anyway', to: 'e_anyway' }] },
      q2: { say: ['She walks round the door and finds herself in front of it again, facing the same handle.',
          EN('Yes. Everyone tries that. I only have fronts. It’s a condition.')],
        choices: [{ label: 'Crawl underneath', to: 'e_under' }, { label: 'Ask who used it', to: 'q4' }] },
      q3: { say: ['She knocks. Nothing. Then, from the other side, very slowly: two knocks back.',
          EN('Oh. Oh, there’s someone there. There’s someone there.')],
        choices: [{ label: 'Knock back', to: 'e_knock' }, { label: 'Say hello', to: 'e_hello' }, { label: 'Step back', to: 'e_wait' }] },
      q4: { say: [EN('A man. Every morning. He went out through me with his bag, and every evening he came back in.'),
          EN('Then one morning he went out and didn’t come back in. I’ve been wondering which way he went.')],
        choices: [{ label: 'Wait for him', to: 'e_wait' }, { label: 'Go through and look', to: 'e_through' }] } },
      endings: {
        e_anyway: { say: ['She turns the handle. Behind the door is a very small dark bedroom, with a girl-shaped dent in the bed.',
          EN('That’s the side you came from. I did warn you.')], reward: 'none' },
        e_under: { say: ['She lies flat and wriggles under the door. It is a long way under, much longer than a door is tall.',
          'When she stands up, the door is far behind her, and somewhere it is laughing, delighted.',
          EN('Nobody’s ever done that. Nobody ever thought to.')], reward: 'coin' },
        e_knock: { say: ['She knocks back, twice. Then the handle turns on its own, from the other side.',
          'The door swings open towards her. There is nobody there, only warm air and the smell of rice cooking.',
          EN('Thank you. That’s it. So that’s what it feels like.')], reward: 'secret' },
        e_hello: { say: ['She says hello to the wood. The knocking stops at once, like someone caught.',
          EN('Never mind. Never mind. They were only practising.')], reward: 'lore' },
        e_wait: { say: ['She steps back and waits beside it. Nobody comes. The door does not seem to mind.',
          EN('That’s nice, actually. Someone waiting on this side for once. It’s almost the same thing.')], reward: 'page' },
        e_through: { say: ['She opens it from the front, walks through, turns round and closes it behind her.',
          'For a moment she is on the other side. Then there is only one side again, and she is on it.',
          EN('You did it the wrong way round and it still counted. Don’t tell anyone.')], reward: 'photo' } } }
  });

  S({
    id: 'st_dr_13', kind: 'choice', where: { themes: ['abstract', 'city', 'nature'], depth: [3, 4] },
    who: { name: 'The Tall Man Who Measures the Night', look: { t: 'tall', c: ['#1a1a2a', '#8a8aa0', '#d8d0c0'] }, lang: 'en' },
    intro: ['A very tall man in a long coat is unrolling a measuring tape into the dark. It goes on and on.',
      EN('Tonight is running long. I can feel it in my knees. Somebody has to measure it.')],
    again: [EN('Don’t mind me. Still measuring. It hasn’t ended yet, has it.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [EN('Would you hold the end? It keeps wandering off when nobody holds it.')],
        choices: [{ label: 'Hold the end', to: 'q2' }, { label: 'Ask what it is for', to: 'q3' }, { label: 'Run off with it', to: 'e_run' }] },
      q2: { say: ['She holds the tin end of the tape. The tall man walks away into the dark until he is only a voice.',
          EN('Right! What does it say? At your end?')],
        choices: [{ label: 'Zero', to: 'e_zero' }, { label: 'It says soon', to: 'e_soon' }, { label: 'There are no numbers', to: 'q4' }] },
      q3: { say: [EN('If nobody measures the night, it gets longer. Children notice first. They lie awake and feel it stretch.'),
          EN('Last night nobody measured it at all. You might have noticed.')],
        choices: [{ label: 'I noticed', to: 'e_noticed' }, { label: 'How long is tonight?', to: 'e_long' }] },
      q4: { say: [EN('No numbers? None at all?'),
          'From far off comes the sound of tape being reeled in, faster and faster.',
          EN('Then you’re not at the end. You’re in the middle. How did you get in the middle?')],
        choices: [{ label: 'I was put here', to: 'e_middle' }, { label: 'I walked', to: 'e_walked' }] } },
      endings: {
        e_run: { say: ['She grabs the tape and runs. Behind her the night comes too, trotting, like a big dog on a lead.',
          EN('Oh, well done. Take it for a walk. It never gets walked.')], reward: 'none' },
        e_zero: { say: [EN('Zero? Good. Good. Then that’s where it starts. With you.'),
          'He writes something in a small notebook and underlines it twice.'], reward: 'coin' },
        e_soon: { say: ['A long silence from the dark.',
          EN('That isn’t a measurement. That’s a promise. I’m not allowed to accept those.'),
          EN('Hold on to it anyway. I won’t write it down.')], reward: 'page' },
        e_middle: { say: [EN('Put here. Yes. That happens. Somebody puts you in the middle of a night and goes to bed.'),
          EN('Have the tape. Measure your own way out. It’s about four hundred steps to morning, I think.')], reward: 'secret' },
        e_walked: { say: [EN('Walked! All this way, in the dark, on your own. Nobody walks it.'),
          'He bows, all the way down, folding in places a man should not fold.'], reward: 'photo' },
        e_noticed: { say: [EN('I thought so. I’m sorry. I was measuring somebody else’s.'),
          EN('Tonight I’ll do yours twice.')], reward: 'lore' },
        e_long: { say: [EN('Tonight? Two thousand metres, a staircase and a half, and one cough from the next room.'),
          EN('About average. Bit long in the middle.')], reward: 'coin' } } }
  });

  S({
    id: 'st_dr_14', kind: 'choice', where: { themes: ['city', 'snow', 'korea'], depth: [1, 3] },
    who: { name: 'The Old Woman Who Sells Weather', look: { t: 'old', c: ['#5a4a6a', '#c8b8a8', '#e8c8a8'] }, lang: 'ko-s' },
    intro: ['An old woman sits on a folding stool at a street corner, a cloth spread out in front of her.',
      'On the cloth: jars of fog, a coiled-up wind, a paper bag of snow, some thunder wrapped in newspaper.',
      KS('날씨 팔아요. 날씨. 오늘은 떨이야.', 'Weather for sale. Weather. Everything must go today.')],
    again: [KS('천천히 골라. 날씨는 안 도망가. 대부분은.', 'Take your time. Weather doesn’t run off. Most of it.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KS('뭐 줄까? 비? 눈? 해?', 'What can I get you? Rain? Snow? Sun?')],
        choices: [{ label: 'Snow', to: 'q_snow' }, { label: 'Rain', to: 'q_rain' }, { label: 'Sun', to: 'e_sun' }, { label: 'No weather', to: 'e_none' }] },
      q_snow: { say: ['The old woman opens the paper bag. The snow inside shifts about, impatient.',
          KS('어떤 눈? 쌓이는 눈, 아니면 금방 녹는 눈?', 'What kind? Snow that settles, or snow that melts straight away?')],
        choices: [{ label: 'The kind that settles', to: 'q_settle' }, { label: 'The kind that melts', to: 'e_melt' }] },
      q_settle: { say: [KS('쌓이는 눈은 비싸. 다음 날 아침까지 책임져야 되거든.', 'Settling snow is dear. I’m responsible for it until the next morning.'),
          KS('누구랑 볼 거야?', 'And who are you going to watch it with?')],
        choices: [{ label: 'Alone', to: 'e_alone' }, { label: 'With my mum', to: 'e_mum' }, { label: 'With you', to: 'e_withyou' }] },
      q_rain: { say: [KS('비는 많아. 누구 머리 위에 내려 줄까?', 'Rain I’ve got plenty of. Whose head should it fall on?')],
        choices: [{ label: 'Mine', to: 'e_rainme' }, { label: 'The sea', to: 'e_sea' }, { label: 'Someone mean', to: 'e_mean' }] } },
      endings: {
        e_sun: { say: [KS('해는 품절이야. 몇 년째 품절이야.', 'Sun’s sold out. Has been for years.'),
          KS('대신 이거 가져가. 가로등 불빛. 비슷해.', 'Take this instead. A bit of streetlight. Much the same.')], reward: 'coin' },
        e_none: { say: [KS('날씨 없는 날?', 'A day with no weather?'),
          'The old woman goes quiet, then laughs so hard her stool creaks.',
          KS('그건 내가 사고 싶다. 있으면 나도 좀 줘.', 'I’d buy that myself. If you ever find one, save me some.')], reward: 'page' },
        e_melt: { say: ['She tips one snowflake into her palm. It is gone before she can look at it properly.',
          KS('원래 다 그래. 그래도 봤잖아. 그럼 된 거야.', 'That’s how everything goes. But you saw it. That’s enough.')], reward: 'none' },
        e_alone: { say: [KS('혼자? 그럼 조금만 줄게. 혼자 보는 눈은 너무 많으면 슬퍼.', 'Alone? Then just a little. Too much snow is sad on your own.'),
          'She pours a handful of snow into the girl’s coat pocket. It stays cold all night.'], reward: 'photo' },
        e_mum: { say: ['The old woman looks at her for a long moment, then ties the bag shut and hands it over for nothing.',
          KS('엄마가 창문 열면, 그때 뿌려. 열 때까지 녹지 말라고 해 둘게.', 'When your mum opens the window, scatter it then. I’ll tell it not to melt till she does.')], reward: 'lore' },
        e_withyou: { say: [KS('나랑? 아이고.', 'With me? Oh, goodness.'),
          'She folds the cloth, tucks the stool under her arm, and opens the bag right there.',
          'It snows on the two of them, on that one corner only, until the whole street has gone quiet.'], reward: 'cookie' },
        e_rainme: { say: [KS('너한테? 우산도 없이?', 'On you? Without an umbrella?'),
          'A cloud the size of a pillow settles over her head and rains gently, on her alone.',
          KS('가끔은 그게 나아. 뭐가 눈물인지 아무도 모르니까.', 'Sometimes that’s better. Nobody can tell the tears from the rain.')], reward: 'lore' },
        e_sea: { say: [KS('바다에? 바다는 비 맞아도 모를 텐데.', 'On the sea? The sea won’t even notice.'),
          KS('...그래도 좋다. 바다한테는 아무도 뭘 안 주잖아.', '...I like it, though. Nobody ever gives the sea anything.')], reward: 'coin' },
        e_mean: { say: [KS('나쁜 사람? 누군데?', 'Someone mean? Who?'),
          'The old woman listens to the answer with her eyes shut, nodding slowly.',
          KS('좋아. 천둥은 서비스야.', 'Fine. The thunder’s on the house.')], reward: 'coin' } } }
  });

  S({
    id: 'st_dr_15', kind: 'choice', where: { themes: ['snow', 'abstract'], depth: [1, 3] },
    who: { name: 'The Ghost Who Is Afraid of People', look: { t: 'ghost', c: ['#e8e8f0', '#a8a8c8'] }, lang: 'en' },
    intro: ['Something pale is hiding behind a lamp post that is far too thin to hide behind.',
      EN('Don’t come any closer. Please. You’re a person. You’ve got a face and everything.')],
    again: [EN('You’re still here. You’re still a person. I was hoping one of those would change.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [EN('Sorry. People frighten me. They look at you, and then they have opinions.')],
        choices: [{ label: 'Stand very still', to: 'q_still' }, { label: 'Turn around', to: 'q_back' }, { label: 'Say boo', to: 'e_boo' }] },
      q_still: { say: ['She stands still. After a long while the ghost drifts out and circles her, the way a cat circles a new chair.',
          EN('You’re warm. Why are people so warm? It’s horrible. It’s lovely. I can’t tell which.')],
        choices: [{ label: 'Hold out a hand', to: 'e_hand' }, { label: 'Ask its name', to: 'q_name' }] },
      q_name: { say: [EN('My name? Nobody ever asked. At school they just called me “you”. Hey, you. Oi, you.')],
        choices: [{ label: 'Give it a name', to: 'e_named' }, { label: 'Say “me too”', to: 'e_metoo' }] },
      q_back: { say: ['She turns to face the other way. Behind her, something sighs with relief.',
          EN('Oh, that’s much better. Can we talk like this? I always liked the backs of people.')],
        choices: [{ label: 'Talk', to: 'e_backs' }, { label: 'Peek', to: 'e_peek' }] } },
      endings: {
        e_boo: { say: ['She says boo. The ghost lets out a tiny, thin, kettle sound and vanishes completely.',
          'A moment later, from inside the lamp post:',
          EN('That wasn’t funny. That was a little bit funny.')], reward: 'none' },
        e_hand: { say: ['She holds out her hand. The ghost touches one finger to her palm, cold as a coin from a fountain.',
          EN('There. I did it. I touched a person. I’ll tell everyone. I don’t know anyone.')], reward: 'coin' },
        e_named: { say: ['She gives it a name. The ghost says it over and over under its breath, trying it on like a coat.',
          EN('It fits. It’s a bit big. I’ll grow into it. Do ghosts grow? I’ll find out.')], reward: 'photo' },
        e_metoo: { say: [EN('You too? They called you “you” as well?'),
          'The ghost goes very still. Then it comes and hides behind her, which is the kindest thing it knows how to do.'], reward: 'lore' },
        e_backs: { say: [EN('When I was alive I was frightened too. I thought being dead would sort it out.'),
          EN('It didn’t. But it’s easier with your back to me. Thank you for your back.')], reward: 'page' },
        e_peek: { say: ['She looks over her shoulder. Nobody. Only a cold hollow in the snow, shaped like someone hugging their knees.',
          'Beside it, written with one finger: sorry.'], reward: 'none' } } }
  });

  S({
    id: 'st_dr_16', kind: 'choice', where: { themes: ['city', 'snow'], depth: [1, 3] },
    who: { name: 'The Mannequin in the Snowy Window', look: { t: 'mannequin', c: ['#e0d8d0', '#8a8a8a', '#c0b8b0'] }, lang: 'ko-s' },
    intro: ['In a lit shop window on a snowy street, a mannequin stands bare, with a pin left in its shoulder.',
      KS('저기, 잠깐만. 나 옷 좀 입혀 줄래? 나 빼고 다 옷 입었어.', 'Excuse me, one moment. Would you dress me? Everyone’s dressed except me.')],
    again: [KS('추운 건 아니야. 그냥 좀... 민망해.', 'It’s not that I’m cold. It’s just a bit... embarrassing.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [KS('뭐 입을까? 네가 골라 줘. 난 골라 본 적이 없어.', 'What should I wear? You choose. I’ve never chosen anything.')],
        choices: [{ label: 'A school uniform', to: 'q_uniform' }, { label: 'A winter coat', to: 'q_coat' }, { label: 'A wedding dress', to: 'e_wedding' }, { label: 'Nothing', to: 'e_nothing' }] },
      q_uniform: { say: [KS('교복? 또?', 'A school uniform? Again?'),
          KS('나 이 창문에서 십이 년 동안 교복만 입었어. 3월마다 새 교복.', 'I wore nothing but uniforms in this window for twelve years. A new one every March.')],
        choices: [{ label: 'Then something else', to: 'q_coat' }, { label: 'It suits you', to: 'e_suits' }] },
      q_coat: { say: ['She finds a long winter coat on a rail and buttons it up to the mannequin’s chin.',
          KS('코트는... 어디 가는 사람이 입는 거잖아. 나 어디 가?', 'A coat is... for people who are going somewhere. Am I going somewhere?')],
        choices: [{ label: 'Outside', to: 'e_outside' }, { label: 'Home', to: 'e_home' }, { label: 'Nowhere', to: 'e_nowhere' }] } },
      endings: {
        e_wedding: { say: [KS('결혼? 누구랑?', 'A wedding? To whom?'),
          'It thinks for a long time, then glances at the mannequin in the next window, who has no head.',
          KS('...아니야. 다음에.', '...No. Some other time.')], reward: 'none' },
        e_nothing: { say: [KS('아무것도 안 입어? 이대로?', 'Nothing at all? Just like this?'),
          'The mannequin looks down at its own smooth arms as if seeing them for the first time.',
          KS('그래. 이게 나구나. 생각보다 괜찮네.', 'All right. So this is me. Better than I thought.')], reward: 'lore' },
        e_suits: { say: [KS('잘 어울린다고? ...다들 그렇게 말했어.', 'It suits me? ...That’s what everyone said.'),
          'It stands up straighter, the way it was taught to. The window light flickers once.',
          KS('알았어. 내년에도 이거 입을게.', 'All right. I’ll wear it next year too.')], reward: 'none' },
        e_outside: { say: ['The mannequin lifts one stiff leg over the edge of the window, then the other, and steps into the snow.',
          KS('차가워! 이게 차가운 거구나! 아무도 안 알려 줬어!', 'It’s cold! So this is cold! Nobody told me!'),
          'Behind it the empty window glows. At the back, a door she never noticed is standing open.'], reward: 'secret' },
        e_home: { say: [KS('집? 여기가 집인데.', 'Home? This is home.'),
          KS('그래도 고마워. 코트는 입고 있을게. 언제든 갈 수 있게.', 'Thank you, though. I’ll keep the coat on. So I can go any time.')], reward: 'photo' },
        e_nowhere: { say: [KS('아무 데도 안 가는데 코트를 입어?', 'Going nowhere, but wearing a coat?'),
          'It laughs, a small click-click from its joints.',
          KS('그거 완전 사람 같다.', 'That’s just like a person.')], reward: 'coin' } } }
  });

  S({
    id: 'st_dr_17', kind: 'choice', where: { themes: ['city', 'abstract'], depth: [2, 4] },
    who: { name: 'The Owl Who Sells Seconds at the Crossing', look: { t: 'owl', c: ['#6a5a4a', '#e8d8a8', '#f0c040'] }, lang: 'en' },
    intro: ['An owl in a green visor perches on a crossing button. Here, the little green man never lights up.',
      EN('Seconds! Fresh seconds! Spare seconds, lost seconds, second-hand seconds!')],
    again: [EN('Thinking takes seconds, you know. I’m not charging for those. Yet.')],
    choice: { start: 'q1', nodes: {
      q1: { say: [EN('Buying or selling? I do both. I’m the only one at this crossing, so the prices are mine.')],
        choices: [{ label: 'Buy a second', to: 'q_buy' }, { label: 'Sell one of mine', to: 'q_sell' }, { label: 'Why is it never green?', to: 'e_green' }] },
      q_buy: { say: [EN('One second, coming up. Which kind? I keep all sorts under the wing.')],
        choices: [{ label: 'Before a bus leaves', to: 'e_bus' }, { label: 'Before a phone rings', to: 'e_phone' }, { label: 'The last of the day', to: 'e_last' }] },
      q_sell: { say: [EN('Selling! Lovely. Which second are you willing to part with?')],
        choices: [{ label: 'The one before I fell asleep', to: 'e_sleep' }, { label: 'The one before someone left', to: 'q_heavy' }, { label: 'A boring one', to: 'e_boring' }] },
      q_heavy: { say: [EN('That one? Oh, that’s a heavy one. It’s been going for years, hasn’t it. It never quite finished.'),
          'The owl weighs it in one claw, frowning.'],
        choices: [{ label: 'Sell it', to: 'e_soldit' }, { label: 'Keep it', to: 'e_keepit' }] } },
      endings: {
        e_green: { say: [EN('Because nobody presses me. They press the button, never the owl. Understandable.'),
          'She presses the owl. It hoots, astonished, and across the road the little green man lights up and waves.',
          'On the far side there is a street she has never seen, lit from the windows down.'], reward: 'secret' },
        e_bus: { say: ['The owl hands her a second. For exactly that long, an engine idles and someone runs for it, and makes it.',
          EN('Made it. They always make it, in that one.')], reward: 'coin' },
        e_phone: { say: ['She holds the second. Very far off, a phone is about to ring, and everyone in the house turns towards it.',
          EN('That’s the best bit. Before you know who it is.')], reward: 'page' },
        e_last: { say: [EN('Sold out. Everybody wants that one. Nobody uses it, they just keep it in a drawer.'),
          EN('Have the second-to-last instead. Nearly as good. Nobody notices it go.')], reward: 'none' },
        e_sleep: { say: [EN('Hm. A bit thin. A lot of waiting in it. Somebody was listening for footsteps.'),
          EN('I’ll give you a penny for it. It’s mostly ceiling.')], reward: 'coin' },
        e_boring: { say: [EN('No such thing. But I’ll take one. Hand it over.'),
          'She gives the owl a second from a maths lesson, years ago. It holds it up to the streetlight like a jewel.'], reward: 'lore' },
        e_soldit: { say: ['The owl takes it. For a moment the dark around her is ordinary dark, and nobody is about to go.',
          EN('There. Gone. You’ll feel lighter tomorrow. Or a bit emptier. They feel the same at first.')], reward: 'photo' },
        e_keepit: { say: [EN('Wise. Some seconds you keep because they’re yours, not because they’re nice.'),
          'The owl tucks something back into her pocket that she never felt leave.'], reward: 'lore' } } }
  });

  /* ------------------------------------------------------------------ WORD */

  S({
    id: 'st_dr_18', kind: 'word', where: { themes: ['city', 'korea'], depth: [1, 3] },
    who: { name: 'The Dog at the Night Bus Stop', look: { t: 'dog', c: ['#c8a070', '#f0e0c0', '#3a2a1a'] }, lang: 'ko-s' },
    intro: ['A yellow dog sits upright at a bus stop, ears turning towards every engine.',
      KS('우리 누나가 마지막 버스 타고 온다고 했어. 그날 제일 늦게 오는 버스.', 'My big sister said she’d come back on the last one. The latest bus of the night.'),
      KS('버스 올 때마다 물어봐. 네가 마지막이야? 다들 아니래.', 'Every time a bus comes, I ask it: are you the last one? They all say no.')],
    again: [KS('또 왔다. 아니래. 아직 마지막 아니래.', 'Another one. Not it. Not the last one yet.')],
    word: {
      words: ['막차', 'makcha', 'mak cha', 'last bus', 'the last bus', 'last one', 'the last one', 'last'],
      hint: [KS('그 버스는 이름이 따로 있대. 막... 막 뭐였더라. 누나가 맨날 그거 놓쳤는데.', 'That bus has its own name. Mak... mak-something. My sister was always missing it.'),
        'On the timetable, the very bottom line is circled in red pen, over and over.'],
      heard: ['The dog’s ears go flat, then slowly come up again.',
        KS('막차... 아까 그게 막차였구나. 벌써 지나갔구나.', 'The last bus... so the one before was the last one. It’s already been.'),
        KS('그럼 걸어가면 되지. 누나도 막차 놓치면 맨날 걸어왔어.', 'Then we walk. Whenever she missed the last bus, she always walked home.'),
        'The dog stands, stretches, and trots off down the dark road, nose first, towards wherever home is.'],
      wrong: [KS('그건 버스 이름 아니야. 나도 버스 이름 몇 개는 알아.', 'That’s not what a bus is called. I know a few bus names, you know.')] },
    reward: 'lore',
    lore: [KS('혹시 누나 보면, 나 먼저 집에 갔다고 해 줘.', 'If you see my sister, tell her I went home first.')]
  });

  S({
    id: 'st_dr_19', kind: 'word', where: { themes: ['water', 'nature'], depth: [1, 3] },
    who: { name: 'The Frog Who Counts the Rain', look: { t: 'frog', c: ['#6a9a4a', '#d8e8a0', '#e8c040'] }, lang: 'en' },
    intro: ['A frog sits on a lily pad in the rain, counting under its breath, very fast.',
      EN('Nine hundred and ninety-seven. Nine hundred and ninety-eight. Nine hundred and ninety-nine.'),
      EN('...Nine hundred and ninety-nine. Nine hundred and ninety-nine. Oh no. Oh no, not again.')],
    again: [EN('Nine hundred and ninety-nine. It’s like a step missing at the top of the stairs.')],
    word: {
      words: ['thousand', 'a thousand', 'one thousand', '1000', '천', 'cheon'],
      hint: [EN('Every rain is exactly as many drops as comes after nine hundred and ninety-nine. That’s the rule.'),
        EN('It’s a big round number with three noughts. I can see the noughts. I can’t see the front.')],
      heard: [EN('That’s it! That’s it, that’s it, that’s it!'),
        'The last drop lands on the frog’s head. Then the rain stops all at once, as if it only wanted counting.',
        EN('Thank you. Now I can start on the puddles.')],
      wrong: [EN('No, no. Far too small. Or far too wet. Something’s wrong with it.')] },
    reward: 'coin'
  });

  S({
    id: 'st_dr_20', kind: 'word', where: { themes: ['snow', 'city'], depth: [1, 2] },
    who: { name: 'The Puddle That Was a Snowman', look: { t: 'blob', c: ['#a8c0d8', '#e86a20', '#303030'] }, lang: 'en' },
    intro: ['A puddle lies on the pavement with a carrot in it, two pebbles and a striped scarf.',
      EN('Don’t step in me. I used to be tall. I had a hat, briefly.'),
      EN('Then the season after came. You know the one. Birds. Mud. Everybody so pleased about it.')],
    again: [EN('I can’t hold a shape. I keep trying. I keep running downhill.')],
    word: {
      words: ['winter', 'the winter', 'wintertime', '겨울', 'gyeoul'],
      hint: [EN('I was made in the cold season. After the leaves come down, before the birds come back. It melted, the word.'),
        EN('If somebody said its name out loud, I think I’d remember how to stand up.')],
      heard: ['The puddle shivers. A thin skin of ice runs over it, thickens, and heaps itself up.',
        EN('Oh. Oh, that’s it. That’s the one.'),
        'Now there is a snowman on the pavement, the height of a cat, wearing its scarf like a blanket.',
        EN('Smaller. But me.')],
      wrong: [EN('No. That’s a warm word. I can feel myself getting worse.')] },
    reward: 'photo'
  });

  S({
    id: 'st_dr_21', kind: 'word', where: { themes: ['city', 'water'], depth: [2, 4] },
    who: { name: 'The Worm Made of Unsaid Words', look: { t: 'worm', c: ['#d8c8c0', '#5a4a4a', '#a89898'] }, lang: 'en' },
    intro: ['Under a bridge, a long pale worm lies coiled by the water. It is written all over in tiny handwriting.',
      EN('Don’t read me. Everyone reads me. None of it was meant for them.'),
      EN('I’m made of things people nearly said. Mostly one thing. The same word, again and again, in every hand.')],
    again: [EN('Another one just washed up. Someone at a dinner table, almost. Then they passed the salt instead.')],
    word: {
      words: ['sorry', 'im sorry', 'i am sorry', 'so sorry', '미안해', '미안', 'mianhae', '죄송해요', '죄송합니다'],
      hint: ['She reads a little anyway. The same small word, over and over, often after “I’m”, often crossed out.',
        EN('It’s the word you say when you step on a foot. And the one nobody says when they step on a whole person.')],
      heard: ['The worm goes very still. One line of handwriting on its side fades away, then another.',
        EN('Oh. Out loud. It sounds smaller out loud. It sounds like it could fit through a door.'),
        EN('Somebody should have said that to you, too. Yours is in here somewhere. I’ll keep looking.')],
      wrong: [EN('No. That one gets said all the time. I’m not made of those.')] },
    reward: 'page'
  });

  S({
    id: 'st_dr_22', kind: 'word', where: { themes: ['beach'], depth: [1, 2] },
    who: { name: 'The Gull Learning One Word', look: { t: 'bird', c: ['#f0f0f0', '#8a8a9a', '#e8c040'] }, lang: 'en' },
    intro: ['A seagull stands on the sand facing the water, beak open, like someone about to sing in front of a crowd.',
      EN('Every summer the children run down this beach and shout one word at the water. Every one of them.'),
      EN('I want to shout it too. I’ve been practising. Ba... ba...')],
    again: [EN('Ba... It’s two sounds, like a door banging. Ba-something. The something is the hard part.')],
    word: {
      words: ['바다', 'bada', 'sea', 'the sea', 'ocean'],
      hint: [EN('It’s the name of the big wet thing. That one, in front of me, going shhh. They say it with their arms up.'),
        'The waves come in, go out, come in, as if they were waiting to be called.'],
      heard: [EN('Ba-da? BA-DA. Bada!'),
        'The gull runs at the waves, wings up, shouting it like a child. A wave runs back, and it flees, delighted.',
        EN('It answered! It said shhh! It knows its own name!')],
      wrong: [EN('No, that’s not it. The children are much louder when they say it. And much happier.')] },
    reward: 'coin'
  });

})(typeof window !== 'undefined' ? window : globalThis);
